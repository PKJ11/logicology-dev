export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from "next/server";
import { ObjectId } from "mongodb";
import { verifyAdmin } from "@/app/lib/admin-auth";
import { connectToDatabase } from "../../lib/db/models";
import { sendEmail } from "@/lib/notifications/email";
import {
  INDIA_POST_TRACKING_URL,
  OrderTracking,
  TRACKING_STATUS_LABELS,
  TrackingStatus,
  isTrackingStatus,
  isValidConsignmentNo,
  normalizeConsignmentNo,
} from "@/lib/orders/tracking";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://logicology.in";

const escapeRegex = (value: string) => value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

const escapeHtml = (value: string) =>
  value.replace(
    /[&<>"']/g,
    (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]!
  );

/** GET /api/admin/orders?q=&status= — paid orders with their tracking, newest first. */
export async function GET(req: NextRequest) {
  try {
    const admin = await verifyAdmin(req);
    if (!admin) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const q = searchParams.get("q")?.trim();
    const status = searchParams.get("status");

    const filter: Record<string, any> = { paymentId: { $exists: true, $ne: null } };
    if (q) {
      const rx = { $regex: escapeRegex(q), $options: "i" };
      filter.$or = [
        { paymentId: rx },
        { orderId: rx },
        { "userInfo.name": rx },
        { "userInfo.email": rx },
        { "userInfo.phone": rx },
        { "shipping.name": rx },
        { "tracking.consignmentNo": rx },
      ];
    }
    if (status === "processing") {
      // Orders with no tracking yet are still processing
      filter.$and = [
        { $or: [{ tracking: { $exists: false } }, { "tracking.status": "processing" }] },
      ];
    } else if (isTrackingStatus(status)) {
      filter["tracking.status"] = status;
    }

    const { db } = await connectToDatabase();
    const orders = await db
      .collection("orders")
      .find(filter, {
        projection: {
          paymentId: 1,
          orderId: 1,
          userInfo: 1,
          shipping: 1,
          "cart.name": 1,
          "cart.quantity": 1,
          totalAmount: 1,
          createdAt: 1,
          tracking: 1,
        },
      })
      .sort({ createdAt: -1 })
      .limit(200)
      .toArray();

    return NextResponse.json({
      success: true,
      orders: orders.map((o) => ({ ...o, _id: o._id.toString() })),
    });
  } catch (error: any) {
    console.error("Error fetching orders:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

/**
 * PATCH /api/admin/orders
 * body: { id, status, consignmentNo?, note?, notifyCustomer? }
 * Updates the order's India Post tracking and, when asked, emails the customer the
 * consignment number the first time it is shipped.
 */
export async function PATCH(req: NextRequest) {
  try {
    const admin = await verifyAdmin(req);
    if (!admin) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    const { id, status, consignmentNo, note, notifyCustomer } = await req.json();

    if (!id || !ObjectId.isValid(id)) {
      return NextResponse.json({ success: false, error: "Invalid order id" }, { status: 400 });
    }
    if (!isTrackingStatus(status)) {
      return NextResponse.json({ success: false, error: "Invalid status" }, { status: 400 });
    }

    const consignment = consignmentNo ? normalizeConsignmentNo(String(consignmentNo)) : "";
    if (consignment && !isValidConsignmentNo(consignment)) {
      return NextResponse.json(
        { success: false, error: "Consignment number should look like EE123456789IN" },
        { status: 400 }
      );
    }
    if (status !== "processing" && !consignment) {
      return NextResponse.json(
        {
          success: false,
          error: "Add the India Post consignment number before marking it shipped",
        },
        { status: 400 }
      );
    }

    const { db } = await connectToDatabase();
    const col = db.collection("orders");
    const _id = new ObjectId(id);
    const order = await col.findOne({ _id });
    if (!order) {
      return NextResponse.json({ success: false, error: "Order not found" }, { status: 404 });
    }

    const now = new Date();
    const previous: Partial<OrderTracking> = order.tracking || {};
    const history = [...(previous.history || [])];
    const trimmedNote = typeof note === "string" ? note.trim().slice(0, 300) : "";
    if (previous.status !== status || trimmedNote) {
      history.push({ status: status as TrackingStatus, note: trimmedNote || undefined, at: now });
    }

    const tracking: OrderTracking = {
      carrier: "indiapost",
      consignmentNo: consignment || undefined,
      status,
      history,
      shippedAt: previous.shippedAt || (status !== "processing" ? now : undefined),
      deliveredAt: status === "delivered" ? previous.deliveredAt || now : undefined,
      shippedEmailSent: previous.shippedEmailSent || false,
      updatedAt: now,
    };

    let emailSent = false;
    const customerEmail = order.userInfo?.email;
    if (notifyCustomer && consignment && customerEmail && !tracking.shippedEmailSent) {
      try {
        await sendEmail({
          to: customerEmail,
          subject: `Your Logicology order has shipped – ${consignment}`,
          html: buildShippedEmail({
            name: order.userInfo?.name || "there",
            paymentId: order.paymentId,
            consignmentNo: consignment,
            status,
          }),
        });
        tracking.shippedEmailSent = true;
        emailSent = true;
      } catch (err) {
        console.error(`Order ${order.paymentId}: shipped email failed`, err);
      }
    }

    await col.updateOne({ _id }, { $set: { tracking } });

    return NextResponse.json({ success: true, tracking, emailSent });
  } catch (error: any) {
    console.error("Error updating order tracking:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

function buildShippedEmail({
  name,
  paymentId,
  consignmentNo,
  status,
}: {
  name: string;
  paymentId: string;
  consignmentNo: string;
  status: TrackingStatus;
}) {
  const trackUrl = `${SITE_URL}/track-order?ref=${encodeURIComponent(paymentId)}`;
  return `
  <div style="font-family:Arial,sans-serif;max-width:560px;margin:0 auto;color:#3d3b40">
    <h2 style="color:#0A8A80">Your order is on its way! 🚚</h2>
    <p>Hi ${escapeHtml(name)},</p>
    <p>Your Logicology order has been shipped via <strong>India Post</strong>.</p>
    <table style="border-collapse:collapse;margin:16px 0">
      <tr><td style="padding:4px 12px 4px 0"><strong>Payment ID</strong></td><td>${escapeHtml(paymentId)}</td></tr>
      <tr><td style="padding:4px 12px 4px 0"><strong>Consignment No.</strong></td><td>${escapeHtml(consignmentNo)}</td></tr>
      <tr><td style="padding:4px 12px 4px 0"><strong>Status</strong></td><td>${TRACKING_STATUS_LABELS[status]}</td></tr>
    </table>
    <p>
      <a href="${trackUrl}" style="display:inline-block;background:#0A8A80;color:#fff;padding:10px 18px;border-radius:8px;text-decoration:none">Track your order</a>
    </p>
    <p style="font-size:13px;color:#666">
      You can also track it on <a href="${INDIA_POST_TRACKING_URL}">indiapost.gov.in</a> using the consignment number above.
    </p>
    <p>Thank you for shopping with Logicology!</p>
  </div>`;
}

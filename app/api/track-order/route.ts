export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "../lib/db/models";
import { INDIA_POST_TRACKING_URL, OrderTracking } from "@/lib/orders/tracking";

const NOT_FOUND = "We couldn't find an order matching those details.";

const digitsLast10 = (value: unknown) =>
  String(value ?? "")
    .replace(/\D/g, "")
    .slice(-10);

/**
 * POST /api/track-order  body: { ref, contact }
 * ref = Razorpay payment id (pay_…) or order id (order_…); contact = the email or phone used at checkout.
 * Returns only what the customer needs to see; a wrong contact gets the same answer as an unknown order.
 */
export async function POST(req: NextRequest) {
  try {
    const { ref, contact } = await req.json();
    const orderRef = String(ref ?? "").trim();
    const contactValue = String(contact ?? "")
      .trim()
      .toLowerCase();

    if (!orderRef || !contactValue) {
      return NextResponse.json(
        { success: false, error: "Enter your Payment ID and the email or phone used to order." },
        { status: 400 }
      );
    }

    const { db } = await connectToDatabase();
    const order = await db
      .collection("orders")
      .findOne({ $or: [{ paymentId: orderRef }, { orderId: orderRef }] });

    if (!order) {
      return NextResponse.json({ success: false, error: NOT_FOUND }, { status: 404 });
    }

    const emails = [order.userInfo?.email, order.shipping?.email]
      .filter(Boolean)
      .map((e: string) => e.trim().toLowerCase());
    const phones = [order.userInfo?.phone, order.shipping?.phone].map(digitsLast10).filter(Boolean);
    const contactPhone = digitsLast10(contactValue);

    const matches =
      emails.includes(contactValue) ||
      (contactPhone.length === 10 && phones.includes(contactPhone));
    if (!matches) {
      return NextResponse.json({ success: false, error: NOT_FOUND }, { status: 404 });
    }

    const tracking: Partial<OrderTracking> = order.tracking || {};

    return NextResponse.json({
      success: true,
      order: {
        paymentId: order.paymentId,
        placedAt: order.createdAt,
        items: (order.cart || []).map((item: any) => ({
          name: item.name,
          quantity: item.quantity ?? 1,
        })),
        deliverTo: [order.shipping?.city, order.shipping?.state, order.shipping?.pin]
          .filter(Boolean)
          .join(", "),
        tracking: {
          carrier: "indiapost",
          status: tracking.status || "processing",
          consignmentNo: tracking.consignmentNo || null,
          history: tracking.history || [],
          shippedAt: tracking.shippedAt || null,
          deliveredAt: tracking.deliveredAt || null,
        },
        trackingUrl: INDIA_POST_TRACKING_URL,
      },
    });
  } catch (err: any) {
    console.error("Error tracking order:", err);
    return NextResponse.json(
      { success: false, error: "Something went wrong. Please try again." },
      { status: 500 }
    );
  }
}

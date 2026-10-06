import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { fulfillOrder } from "@/lib/orders/fulfillment";

/**
 * Razorpay webhook (events: payment.captured, order.paid).
 * Fulfils the order server-side so it is saved and notified even when the customer's browser
 * never runs the checkout handler. Non-2xx responses make Razorpay retry later.
 */
export async function POST(req: NextRequest) {
  const secret = process.env.RAZORPAY_WEBHOOK_SECRET;
  if (!secret) {
    console.error("RAZORPAY_WEBHOOK_SECRET is not set");
    return NextResponse.json({ error: "Webhook not configured" }, { status: 500 });
  }

  const rawBody = await req.text();
  const signature = req.headers.get("x-razorpay-signature") || "";
  const expectedSignature = crypto.createHmac("sha256", secret).update(rawBody).digest("hex");

  const valid =
    signature.length === expectedSignature.length &&
    crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(expectedSignature));
  if (!valid) {
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  try {
    const event = JSON.parse(rawBody);
    if (event.event !== "payment.captured" && event.event !== "order.paid") {
      return NextResponse.json({ ignored: event.event });
    }

    const payment = event.payload?.payment?.entity;
    if (!payment?.order_id || !payment?.id) {
      return NextResponse.json({ ignored: "no order/payment id" });
    }

    const result = await fulfillOrder(payment.order_id, payment.id);

    // Another request is fulfilling this order right now; ask Razorpay to retry so a crash there is recovered.
    if (result.status === "in_progress") {
      return NextResponse.json({ status: result.status }, { status: 503 });
    }

    // "not_found" = not a checkout order (e.g. subscription / primetime) — acknowledge and ignore.
    return NextResponse.json({ status: result.status });
  } catch (error: any) {
    console.error("Razorpay webhook error:", error);
    return NextResponse.json({ error: error?.message || "Unknown error" }, { status: 500 });
  }
}

import { NextRequest, NextResponse } from "next/server";
import Razorpay from "razorpay";
import { createPendingOrder, PendingOrderInput } from "@/lib/orders/fulfillment";

/**
 * Creates the Razorpay order AND stores everything needed to fulfil it (record, invoice email,
 * WhatsApp) before the customer pays, so the order can be completed server-side even if the
 * browser never returns from Razorpay. See lib/orders/fulfillment.ts.
 */
export async function POST(req: NextRequest) {
  try {
    const { amount, currency, receipt, kind, record, email, whatsapp } = await req.json();

    if (
      (kind !== "order" && kind !== "summer_camp") ||
      !record ||
      !email?.html ||
      !email?.subject ||
      !Array.isArray(email?.to)
    ) {
      return NextResponse.json({ error: "Invalid checkout payload" }, { status: 400 });
    }

    const razorpay = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID || "rzp_live_RNIwt54hh7eqmk",
      key_secret: process.env.RAZORPAY_KEY_SECRET || "t8NMj5PKyi0Af2b15uARbtLl",
    });

    const order = await razorpay.orders.create({
      amount: Math.round(amount * 100), // amount in paise
      currency: currency || "INR",
      receipt: receipt || "receipt#1",
      notes: { kind },
    });

    const input: PendingOrderInput = { kind, record, email, whatsapp: whatsapp || null };
    await createPendingOrder(order.id, Number(order.amount), input);

    return NextResponse.json({ order });
  } catch (error: any) {
    console.error("Checkout create-order error:", error);
    return NextResponse.json({ error: error?.message || "Unknown error" }, { status: 500 });
  }
}

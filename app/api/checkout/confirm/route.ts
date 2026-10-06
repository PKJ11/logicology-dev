import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { fulfillOrder } from "@/lib/orders/fulfillment";

/** Called by the Razorpay checkout handler in the browser after a successful payment. */
export async function POST(req: NextRequest) {
  try {
    const { orderId, paymentId, signature } = await req.json();

    if (!orderId || !paymentId || !signature) {
      return NextResponse.json({ success: false, error: "Missing payment details" }, { status: 400 });
    }

    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET || "t8NMj5PKyi0Af2b15uARbtLl")
      .update(`${orderId}|${paymentId}`)
      .digest("hex");

    if (expectedSignature !== signature) {
      return NextResponse.json({ success: false, error: "Invalid payment signature" }, { status: 400 });
    }

    const result = await fulfillOrder(orderId, paymentId);

    if (result.status === "not_found") {
      return NextResponse.json({ success: false, error: "Order not found" }, { status: 404 });
    }

    // "in_progress" means the webhook is fulfilling it right now — still a success for the customer.
    return NextResponse.json({
      success: true,
      recordId: "recordId" in result ? result.recordId : null,
    });
  } catch (error: any) {
    console.error("Checkout confirm error:", error);
    return NextResponse.json({ success: false, error: error?.message || "Unknown error" }, { status: 500 });
  }
}

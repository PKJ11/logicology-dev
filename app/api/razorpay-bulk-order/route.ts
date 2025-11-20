import { NextRequest, NextResponse } from "next/server";
import Razorpay from "razorpay";

const RAZORPAY_KEY_ID = process.env.RAZORPAY_KEY_ID || "rzp_test_2QvQwQwQwQwQwQw";
const RAZORPAY_KEY_SECRET = process.env.RAZORPAY_KEY_SECRET || "test_secret";

const razorpay = new Razorpay({
  key_id: RAZORPAY_KEY_ID,
  key_secret: RAZORPAY_KEY_SECRET,
});

export async function POST(req: NextRequest) {
  try {
    const { amount, receipt } = await req.json();
    const order = await razorpay.orders.create({
      amount: amount * 100, // INR paise
      currency: "INR",
      receipt,
      payment_capture: true,
    });
    return NextResponse.json({ success: true, order, key: RAZORPAY_KEY_ID });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err?.message || "Razorpay error" },
      { status: 500 }
    );
  }
}

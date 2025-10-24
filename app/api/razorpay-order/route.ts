import { NextRequest, NextResponse } from "next/server";
import Razorpay from "razorpay";

export async function POST(req: NextRequest) {
  const { amount, currency, receipt } = await req.json();

  const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID || "rzp_test_RM7EaWFSnW9Fod",
    key_secret: process.env.RAZORPAY_KEY_SECRET || "ED0M86MSh0Axn3oYK3dn2GNJ",
  });

  const options = {
    amount: Math.round(amount * 100), // amount in paise
    currency: currency || "INR",
    receipt: receipt || "receipt#1",
  };

  try {
    const order = await razorpay.orders.create(options);
    return NextResponse.json({ order });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

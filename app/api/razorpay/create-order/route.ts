import { NextRequest, NextResponse } from 'next/server';
import Razorpay from 'razorpay';

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID || 'rzp_live_RNIwt54hh7eqmk',
  key_secret: process.env.RAZORPAY_KEY_SECRET || 't8NMj5PKyi0Af2b15uARbtLl',
});

export async function POST(req: NextRequest) {
  try {
    const { amount, currency, tierId } = await req.json();

    const options = {
      amount: Math.round(amount), // amount in paise
      currency: currency || 'INR',
      receipt: `sub_${tierId}_${Date.now()}`,
      notes: {
        tierId: tierId.toString()
      }
    };

    const order = await razorpay.orders.create(options);

    return NextResponse.json({ 
      success: true, 
      order 
    });
  } catch (error: any) {
    console.error('Error creating Razorpay order:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
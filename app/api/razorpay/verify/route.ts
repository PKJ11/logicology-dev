import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';

export async function POST(req: NextRequest) {
  try {
    const { orderId, paymentId, signature } = await req.json();

    const body = orderId + '|' + paymentId;
    const expectedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET || 't8NMj5PKyi0Af2b15uARbtLl')
      .update(body.toString())
      .digest('hex');

    const isValid = expectedSignature === signature;

    return NextResponse.json({ 
      valid: isValid,
      success: true 
    });
  } catch (error: any) {
    console.error('Error verifying payment:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
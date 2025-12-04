// app/api/primetime/verify-payment/route.ts
import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import dbConnect from '@/lib/dbConnect';
import User from '@/app/models/User';

const RAZORPAY_KEY_SECRET = 't8NMj5PKyi0Af2b15uARbtLl';

export async function POST(request: NextRequest) {
  try {
    await dbConnect();

    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, userId } = await request.json();

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature || !userId) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Generate expected signature
    const body = razorpay_order_id + '|' + razorpay_payment_id;
    const expectedSignature = crypto
      .createHmac('sha256', RAZORPAY_KEY_SECRET)
      .update(body)
      .digest('hex');

    // Verify signature
    const isSignatureValid = expectedSignature === razorpay_signature;

    if (!isSignatureValid) {
      return NextResponse.json(
        { success: false, error: 'Payment verification failed' },
        { status: 400 }
      );
    }

    // Update user payment status
    const user = await User.findByIdAndUpdate(
      userId,
      {
        paymentStatus: 'completed',
        paymentId: razorpay_payment_id,
        amountPaid: 100,
        isVerified: true,
        $unset: { paymentError: 1 } // Remove any previous payment errors
      },
      { new: true }
    );

    if (!user) {
      return NextResponse.json(
        { success: false, error: 'User not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Payment verified successfully',
      payment: {
        id: razorpay_payment_id,
        orderId: razorpay_order_id,
        amount: 100,
        currency: 'INR',
        status: 'completed',
        verifiedAt: new Date().toISOString()
      },
      user: {
        id: user._id.toString(),
        name: user.name,
        email: user.email,
        paymentStatus: user.paymentStatus
      }
    });

  } catch (error: any) {
    console.error('Verify payment error:', error);
    
    // Log the error but don't expose details to client
    return NextResponse.json(
      {
        success: false,
        error: 'Payment verification failed',
        message: 'Please contact support if the amount was deducted'
      },
      { status: 500 }
    );
  }
}
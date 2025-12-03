import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import { createPaymentOrder } from '@/lib/razorpay';
import { v4 as uuidv4 } from 'uuid';
import User from '@/app/models/User';

export async function POST(request: NextRequest) {
  try {
    await dbConnect();

    const { userId } = await request.json();
    
    if (!userId) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
      );
    }

    const user = await User.findById(userId);
    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    if (user.paymentStatus === 'completed') {
      return NextResponse.json(
        { error: 'Payment already completed' },
        { status: 400 }
      );
    }

    const orderData = {
      amount: 100 * 100, // ₹100 in paise
      currency: 'INR',
      receipt: `receipt_${uuidv4()}`,
      notes: {
        userId: userId.toString(),
        name: user.name,
        email: user.email,
        phone: user.phone,
        type: 'competition_registration'
      }
    };

    const order = await createPaymentOrder(orderData);

    return NextResponse.json({
      success: true,
      order
    });
  } catch (error: any) {
    console.error('Create order error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to create order' },
      { status: 500 }
    );
  }
}
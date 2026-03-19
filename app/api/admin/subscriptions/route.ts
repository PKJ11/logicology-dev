import { NextRequest, NextResponse } from 'next/server';
import { verifyAdmin } from '@/app/lib/admin-auth';
import { ObjectId } from 'mongodb';
import { connectToDatabase } from '../../lib/db/models';

export async function GET(req: NextRequest) {
  try {
    const admin = await verifyAdmin(req);
    if (!admin) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { db } = await connectToDatabase();
    
    // Fetch all subscriptions
    const subscriptions = await db.collection('subscriptions')
      .find({})
      .sort({ startDate: -1 })
      .toArray();

    // Format subscriptions for frontend
    const formattedSubscriptions = subscriptions.map(sub => ({
      _id: sub._id.toString(),
      userId: sub.userId.toString(),
      tierId: sub.tierId,
      status: sub.status,
      startDate: sub.startDate || new Date().toISOString(),
      endDate: sub.endDate || new Date().toISOString(),
      paymentId: sub.paymentId,
      autoRenew: sub.autoRenew || false
    }));

    return NextResponse.json({
      success: true,
      subscriptions: formattedSubscriptions
    });

  } catch (error: any) {
    console.error('Error fetching subscriptions:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

// Optional: POST to create a new subscription
export async function POST(req: NextRequest) {
  try {
    const admin = await verifyAdmin(req);
    if (!admin) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const data = await req.json();
    const { db } = await connectToDatabase();

    const newSubscription = {
      ...data,
      userId: new ObjectId(data.userId),
      createdAt: new Date(),
      updatedAt: new Date()
    };

    const result = await db.collection('subscriptions').insertOne(newSubscription);

    return NextResponse.json({
      success: true,
      subscription: { ...newSubscription, _id: result.insertedId }
    });

  } catch (error: any) {
    console.error('Error creating subscription:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
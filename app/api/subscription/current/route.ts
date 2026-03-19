import { NextRequest, NextResponse } from 'next/server';
import { MongoClient } from 'mongodb';
import jwt from 'jsonwebtoken';

const MONGO_URI = process.env.MONGO_URI || 'mongodb+srv://pratikkumarjhavnit:pratik11@cluster0.2gksooz.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0';
const DB_NAME = 'logicology';
const JWT_SECRET = process.env.JWT_SECRET || 'your-jwt-secret';

// Helper function to get month start and end dates
function getMonthDateRange(date: Date = new Date()) {
  const year = date.getFullYear();
  const month = date.getMonth();
  
  const startDate = new Date(year, month, 1, 0, 0, 0, 0);
  const endDate = new Date(year, month + 1, 0, 23, 59, 59, 999);
  
  return { startDate, endDate };
}

export async function GET(req: NextRequest) {
  try {
    const token = req.headers.get('authorization')?.replace('Bearer ', '');
    if (!token) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Verify JWT
    const decoded: any = jwt.verify(token, JWT_SECRET);

    const client = new MongoClient(MONGO_URI);
    await client.connect();
    const db = client.db(DB_NAME);
    const subscriptions = db.collection('subscriptions');
    const payments = db.collection('payments');

    // Get current month range
    const now = new Date();
    const { startDate, endDate } = getMonthDateRange(now);

    // Find active subscription for current month
    const subscription = await subscriptions.findOne({ 
      userId: decoded.userId,
      status: 'active',
      startDate: { $lte: endDate },
      endDate: { $gte: startDate }
    });

    // Get user's subscription history
    const history = await subscriptions.find({
      userId: decoded.userId
    })
    .sort({ startDate: -1 })
    .limit(12) // Last 12 months
    .toArray();

    // Get payment history
    const paymentHistory = await payments.find({
      userId: decoded.userId
    })
    .sort({ createdAt: -1 })
    .limit(12)
    .toArray();

    // Calculate days remaining in current month
    const daysRemaining = subscription 
      ? Math.ceil((subscription.endDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))
      : 0;

    await client.close();

    return NextResponse.json({
      success: true,
      subscription: subscription || { 
        tierId: 1, 
        status: 'active',
        startDate,
        endDate,
        isFree: true 
      },
      currentMonth: {
        startDate,
        endDate,
        daysRemaining: daysRemaining > 0 ? daysRemaining : 0
      },
      history,
      paymentHistory,
      canUpgrade: subscription ? true : false,
      canDowngrade: false // Downgrade not allowed during active month
    });

  } catch (error: any) {
    console.error('Error fetching subscription:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
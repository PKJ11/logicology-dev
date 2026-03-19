import { NextRequest, NextResponse } from 'next/server';
import { MongoClient } from 'mongodb';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';

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

// Helper function to calculate pro-rated amount for upgrades
function calculateUpgradeAmount(currentTierPrice: number, newTierPrice: number, daysRemaining: number, daysInMonth: number) {
  const remainingValue = (currentTierPrice / daysInMonth) * daysRemaining;
  const newValue = (newTierPrice / daysInMonth) * daysRemaining;
  const upgradeAmount = Math.max(0, newValue - remainingValue);
  
  return Math.round(upgradeAmount); // Return in rupees (not paise)
}

export async function POST(req: NextRequest) {
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
    
    const {
      razorpay_payment_id,
      razorpay_order_id,
      razorpay_signature,
      tierId,
      amount,
      isUpgrade = false,
      currentTierId
    } = await req.json();

    // Verify payment signature
    const body = razorpay_order_id + '|' + razorpay_payment_id;
    const expectedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET || 't8NMj5PKyi0Af2b15uARbtLl')
      .update(body.toString())
      .digest('hex');

    if (expectedSignature !== razorpay_signature) {
      return NextResponse.json(
        { success: false, error: 'Invalid signature' },
        { status: 400 }
      );
    }

    // Connect to MongoDB
    const client = new MongoClient(MONGO_URI);
    await client.connect();
    const db = client.db(DB_NAME);
    const subscriptions = db.collection('subscriptions');
    const payments = db.collection('payments');

    // Get current date and month range
    const now = new Date();
    const { startDate, endDate } = getMonthDateRange(now);

    // Check if user already has an active subscription for current month
    const existingSubscription = await subscriptions.findOne({
      userId: decoded.userId,
      status: 'active',
      endDate: { $gte: now }
    });

    let subscription;
    
    if (existingSubscription) {
      // This is an upgrade within the same month
      if (!isUpgrade) {
        return NextResponse.json(
          { success: false, error: 'User already has an active subscription for this month' },
          { status: 400 }
        );
      }

      // Calculate days remaining in month
      const daysInMonth = endDate.getDate();
      const daysRemaining = Math.ceil((endDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
      
      // Get tier prices (you might want to fetch these from a tiers collection)
      const tiers = await db.collection('tiers').find({}).toArray();
      const currentTier = tiers.find(t => t.id === currentTierId);
      const newTier = tiers.find(t => t.id === tierId);
      
      if (!currentTier || !newTier) {
        return NextResponse.json(
          { success: false, error: 'Invalid tier IDs' },
          { status: 400 }
        );
      }

      // Calculate upgrade amount
      const expectedUpgradeAmount = calculateUpgradeAmount(
        currentTier.price,
        newTier.price,
        daysRemaining,
        daysInMonth
      );

      // Verify payment amount matches expected upgrade amount
      if (Math.abs(amount - expectedUpgradeAmount) > 1) { // Allow 1 rupee rounding difference
        return NextResponse.json(
          { success: false, error: 'Invalid upgrade amount' },
          { status: 400 }
        );
      }

      // Update existing subscription to new tier
      subscription = {
        ...existingSubscription,
        tierId: parseInt(tierId),
        upgradedAt: now,
        previousTierId: currentTierId,
        upgradePaymentId: razorpay_payment_id,
        updatedAt: now
      };

      await subscriptions.updateOne(
        { _id: existingSubscription._id },
        { $set: subscription }
      );

    } else {
      // New subscription for the month
      subscription = {
        userId: decoded.userId,
        tierId: parseInt(tierId),
        startDate,
        endDate,
        status: 'active',
        paymentId: razorpay_payment_id,
        orderId: razorpay_order_id,
        autoRenew: true,
        createdAt: now,
        updatedAt: now,
        billingMonth: `${startDate.getFullYear()}-${String(startDate.getMonth() + 1).padStart(2, '0')}`
      };

      await subscriptions.insertOne(subscription);
    }

    // Record payment
    const payment = {
      userId: decoded.userId,
      paymentId: razorpay_payment_id,
      orderId: razorpay_order_id,
      amount,
      tierId: parseInt(tierId),
      type: isUpgrade ? 'upgrade' : 'new',
      month: `${startDate.getFullYear()}-${String(startDate.getMonth() + 1).padStart(2, '0')}`,
      createdAt: now
    };
    
    await payments.insertOne(payment);

    await client.close();

    return NextResponse.json({
      success: true,
      subscription,
      message: isUpgrade ? 'Subscription upgraded successfully' : 'Subscription activated successfully'
    });

  } catch (error: any) {
    console.error('Error activating subscription:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
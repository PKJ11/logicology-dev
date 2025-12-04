// app/api/primetime/create-order/route.ts
import { NextRequest, NextResponse } from "next/server";
import Razorpay from "razorpay";
import crypto from "crypto";
import dbConnect from "@/lib/dbConnect";
import User from "@/app/models/User";

// Use provided credentials directly
const RAZORPAY_KEY_ID = "rzp_live_RNIwt54hh7eqmk";
const RAZORPAY_KEY_SECRET = "t8NMj5PKyi0Af2b15uARbtLl";

// Initialize Razorpay
const razorpayInstance = new Razorpay({
  key_id: RAZORPAY_KEY_ID,
  key_secret: RAZORPAY_KEY_SECRET,
});

export async function POST(request: NextRequest) {
  try {
    await dbConnect();

    const { userId, amount = 100 } = await request.json();

    if (!userId) {
      return NextResponse.json({ success: false, error: "User ID is required" }, { status: 400 });
    }

    // Verify user exists and is a non-school user
    const user = await User.findById(userId);
    if (!user) {
      return NextResponse.json({ success: false, error: "User not found" }, { status: 404 });
    }

    // Check if user is a non-school user
    if (user.userType === "school") {
      return NextResponse.json(
        { success: false, error: "School students do not need to pay" },
        { status: 400 }
      );
    }

    // Check if payment is already completed
    if (user.paymentStatus === "completed") {
      return NextResponse.json(
        { success: false, error: "Payment already completed" },
        { status: 400 }
      );
    }

    // Create order options
    const options = {
      amount: amount * 100, // Convert to paise (100 INR = 10000 paise)
      currency: "INR",
      receipt: `receipt_${userId}_${Date.now()}`,
      notes: {
        userId: userId.toString(),
        userName: user.name,
        userEmail: user.email,
        competition: "PrimeTime Competition",
        type: user.userType,
      },
      payment_capture: 1, // Auto capture payment
    };

    // Create order
    const order = await razorpayInstance.orders.create(options);

    // Generate signature for verification
    const signature = crypto
      .createHmac("sha256", RAZORPAY_KEY_SECRET)
      .update(order.id + "|" + order.amount)
      .digest("hex");

    return NextResponse.json({
      success: true,
      order: {
        id: order.id,
        amount: order.amount,
        currency: order.currency,
        receipt: order.receipt,
      },
      key: RAZORPAY_KEY_ID,
      signature,
      user: {
        id: user._id.toString(),
        name: user.name,
        email: user.email,
      },
    });
  } catch (error: any) {
    console.error("Create order error:", error);

    // Handle specific Razorpay errors
    if (error.error?.description) {
      return NextResponse.json(
        {
          success: false,
          error: "Payment gateway error",
          message: error.error.description,
        },
        { status: 500 }
      );
    }

    return NextResponse.json(
      {
        success: false,
        error: "Failed to create order",
        message: process.env.NODE_ENV === "development" ? error.message : undefined,
      },
      { status: 500 }
    );
  }
}

// For testing without making actual payment
export async function GET(request: NextRequest) {
  // Return mock data for testing (development only)
  if (process.env.NODE_ENV === "development") {
    return NextResponse.json({
      success: true,
      order: {
        id: `order_test_${Date.now()}`,
        amount: 10000,
        currency: "INR",
        receipt: `receipt_test_${Date.now()}`,
        status: "created",
      },
      key: RAZORPAY_KEY_ID,
      signature: "test_signature",
      message: "This is a test order for development",
    });
  }

  return NextResponse.json({ success: false, error: "Method not allowed" }, { status: 405 });
}

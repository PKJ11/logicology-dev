import { NextResponse } from "next/server";

// This is a placeholder SMS sending API endpoint.
// For production,  with a real SMS gintegrateateway (e.g., Twilio, MSG91, Textlocal).
// Free SMS sending is not available for production use; gateways may offer trial credits.

export async function POST(request: Request) {
  try {
    const { phone, message } = await request.json();
    // Simulate SMS sending (for development/testing only)
    // In production, call SMS gateway API here
    console.log(`Sending SMS to ${phone}: ${message}`);
    return NextResponse.json({ success: true, message: "SMS sent (simulated)" });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error?.message || "Failed to send SMS" },
      { status: 500 }
    );
  }
}

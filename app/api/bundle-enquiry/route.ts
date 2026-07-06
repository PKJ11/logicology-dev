import { NextRequest, NextResponse } from "next/server";
import { MongoClient } from "mongodb";
import nodemailer from "nodemailer";

const MONGO_URI = process.env.MONGODB_URI || "mongodb+srv://pratikkumarjhavnit:pratik11@cluster0.2gksooz.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";
const DB_NAME = "logicology";
const COLLECTION = "bundle_enquiries";

export async function POST(req: NextRequest) {
  const { volume, phone, email, city, quantity } = await req.json();

  if (!volume || !phone || !email || !city || !quantity) {
    return NextResponse.json(
      { success: false, error: "Missing required fields" },
      { status: 400 }
    );
  }

  // Save to MongoDB
  try {
    const client = new MongoClient(MONGO_URI);
    await client.connect();
    const db = client.db(DB_NAME);
    const col = db.collection(COLLECTION);
    await col.insertOne({
      volume,
      phone,
      email,
      city,
      quantity,
      createdAt: new Date(),
    });
    await client.close();
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err?.message || "DB error" },
      { status: 500 }
    );
  }

  // Email configuration
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.GMAIL_USER,
      pass: process.env.GMAIL_PASSWORD,
    },
  });

  // 1. Notify Logicology
  const notificationMailOptions = {
    from: process.env.GMAIL_USER,
    to: process.env.GMAIL_USER,
    subject: `New Bundle Enquiry — ${volume}`,
    text: `Volume: ${volume}\nPhone: ${phone}\nEmail: ${email}\nCity: ${city}\nQuantity: ${quantity}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #333;">New Bundle Enquiry Received</h2>
        <div style="background: #f5f5f5; padding: 15px; border-radius: 5px;">
          <p><strong>Volume:</strong> ${volume}</p>
          <p><strong>Phone:</strong> ${phone}</p>
          <p><strong>Email:</strong> ${email}</p>
          <p><strong>City:</strong> ${city}</p>
          <p><strong>Quantity Required:</strong> ${quantity}</p>
        </div>
        <p style="color: #666; font-size: 12px; margin-top: 20px;">
          Received at: ${new Date().toLocaleString()}
        </p>
      </div>
    `,
  };

  // 2. Acknowledge to the enquirer
  const thankYouMailOptions = {
    from: process.env.GMAIL_USER,
    to: email,
    subject: "We've received your bundle enquiry - Logicology",
    text: `Thank you for your interest in ${volume} (${quantity} copies).\n\nOur team will get back to you shortly at ${phone} or this email with the best bulk pricing.\n\nBest regards,\nThe Logicology Team`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; color: #333;">
        <div style="text-align: center; padding: 20px 0;">
          <h1 style="color: #007bff; margin: 0;">Logicology</h1>
        </div>

        <div style="background: #f8f9fa; padding: 30px; border-radius: 10px;">
          <h2 style="color: #333; margin-top: 0;">Thanks for Your Enquiry!</h2>

          <p>We've received your bundle enquiry for <strong>${volume}</strong> (${quantity} copies, ${city}).</p>

          <p>Our team will review the details and get back to you shortly with the best bulk pricing.</p>

          <div style="margin-top: 30px;">
            <p>Best regards,</p>
            <p><strong>The Logicology Team</strong></p>
          </div>
        </div>

        <div style="text-align: center; margin-top: 20px; padding: 20px; color: #666; font-size: 12px;">
          <p>This is an automated message. Please do not reply to this email.</p>
        </div>
      </div>
    `,
  };

  try {
    await transporter.sendMail(notificationMailOptions);
    await transporter.sendMail(thankYouMailOptions);

    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
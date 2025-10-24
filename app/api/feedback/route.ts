import { NextRequest, NextResponse } from "next/server";
import { MongoClient } from "mongodb";
import nodemailer from "nodemailer";

const MONGO_URI = "mongodb+srv://pratikkumarjhavnit:pratik11@cluster0.2gksooz.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";
const DB_NAME = "logicology";
const COLLECTION = "feedback";

export async function POST(req: NextRequest) {
  const { name, email, phone, feedback, message } = await req.json();

  // Use feedback field if available, otherwise use message field
  const feedbackText = feedback || message;
  const phoneNumber = phone || "Not provided";

  // Save to MongoDB
  try {
    const client = new MongoClient(MONGO_URI);
    await client.connect();
    const db = client.db(DB_NAME);
    const col = db.collection(COLLECTION);
    await col.insertOne({ 
      name, 
      email, 
      phone: phoneNumber, 
      feedback: feedbackText, 
      createdAt: new Date() 
    });
    await client.close();
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err?.message || "DB error" }, { status: 500 });
  }

  // Email configuration
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.GMAIL_USER || "logicologymeta@gmail.com",
      pass: process.env.GMAIL_PASSWORD || "fdqz xqjx neoz nzan",
    },
  });

  // 1. Send notification email to Logicology
  const notificationMailOptions = {
    from: process.env.GMAIL_USER || "logicologymeta@gmail.com",
    to: process.env.GMAIL_USER || "logicologymeta@gmail.com",
    subject: `New Feedback from ${name}`,
    text: `Name: ${name}\nEmail: ${email}\nPhone: ${phoneNumber}\n\nFeedback: ${feedbackText}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #333;">New Feedback Received</h2>
        <div style="background: #f5f5f5; padding: 15px; border-radius: 5px;">
          <p><strong>Name:</strong> ${name}</p>
          <p><strong>Email:</strong> ${email}</p>
          <p><strong>Phone:</strong> ${phoneNumber}</p>
          <p><strong>Feedback:</strong></p>
          <p style="background: white; padding: 10px; border-left: 4px solid #007bff;">${feedbackText}</p>
        </div>
        <p style="color: #666; font-size: 12px; margin-top: 20px;">
          Received at: ${new Date().toLocaleString()}
        </p>
      </div>
    `,
  };

  // 2. Send thank you email to the user
  const thankYouMailOptions = {
    from: process.env.GMAIL_USER || "logicologymeta@gmail.com",
    to: email,
    subject: "Thank You for Your Feedback - Logicology",
    text: `Dear ${name},\n\nThank you for taking the time to share your feedback with us. We truly appreciate your input and will carefully review your suggestions.\n\nYour opinion helps us improve our services and provide a better experience for all our users.\n\nBest regards,\nThe Logicology Team`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; color: #333;">
        <div style="text-align: center; padding: 20px 0;">
          <h1 style="color: #007bff; margin: 0;">Logicology</h1>
        </div>
        
        <div style="background: #f8f9fa; padding: 30px; border-radius: 10px;">
          <h2 style="color: #333; margin-top: 0;">Thank You for Your Feedback!</h2>
          
          <p>Dear <strong>${name}</strong>,</p>
          
          <p>Thank you for taking the time to share your valuable feedback with us. We truly appreciate your input and will carefully review your suggestions.</p>
          
          <p>Your opinion is important to us and helps us improve our services to provide a better experience for all our users.</p>
          
          <div style="background: white; padding: 15px; border-radius: 5px; border-left: 4px solid #28a745; margin: 20px 0;">
            <p style="margin: 0; font-style: italic;">"${feedbackText}"</p>
          </div>
          
          <p>We're committed to continuously enhancing our offerings based on feedback from valued users like you.</p>
          
          <p>If you have any further questions or concerns, please don't hesitate to reach out to us.</p>
          
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
    // Send both emails
    await transporter.sendMail(notificationMailOptions);
    await transporter.sendMail(thankYouMailOptions);
    
    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
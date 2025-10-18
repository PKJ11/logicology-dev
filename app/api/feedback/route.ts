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

  // Send email notification
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.GMAIL_USER || "logicologymeta@gmail.com",
      pass: process.env.GMAIL_PASSWORD || "fdqz xqjx neoz nzan",
    },
  });

  const mailOptions = {
    from: process.env.GMAIL_USER || "logicologymeta@gmail.com",
    to: process.env.GMAIL_USER || "logicologymeta@gmail.com",
    subject: `New Feedback from ${name}`,
    text: `Name: ${name}\nEmail: ${email}\nPhone: ${phoneNumber}\n\nFeedback: ${feedbackText}`,
  };

  try {
    await transporter.sendMail(mailOptions);
    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
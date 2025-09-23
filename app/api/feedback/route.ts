import { NextRequest, NextResponse } from "next/server";
import nodemailer from "nodemailer";

export async function POST(req: NextRequest) {
  const { name, email, message } = await req.json();

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
    text: `Name: ${name}\nEmail: ${email}\n\n${message}`,
  };

  try {
    await transporter.sendMail(mailOptions);
    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

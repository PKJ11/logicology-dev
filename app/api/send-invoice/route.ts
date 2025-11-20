import { NextRequest, NextResponse } from "next/server";
import nodemailer from "nodemailer";

const HOSTINGER_EMAIL = process.env.HOSTINGER_EMAIL || "orders@logicology.in";
const HOSTINGER_PASSWORD = process.env.HOSTINGER_PASSWORD || "Raha@1ogic$$$";

export async function POST(req: NextRequest) {
  try {
    const { to, subject, html, pdfUrl } = await req.json();

    const transporter = nodemailer.createTransport({
      host: "smtp.hostinger.com", // Hostinger SMTP server
      port: 465, // SSL port
      secure: true, // Use SSL
      auth: {
        user: HOSTINGER_EMAIL,
        pass: HOSTINGER_PASSWORD,
      },
    });

    const mailOptions: any = {
      from: HOSTINGER_EMAIL,
      to,
      subject,
      html,
    };

    // Attach PDF if available
    if (pdfUrl) {
      mailOptions.attachments = [
        {
          filename: "GST-Invoice.pdf",
          path: pdfUrl,
        },
      ];
    }

    // Verify connection configuration
    await transporter.verify();

    await transporter.sendMail(mailOptions);
    return NextResponse.json({ success: true, status: "paid" });
  } catch (err: any) {
    console.error("Email error:", err);
    return NextResponse.json(
      { success: false, error: err?.message || "Unknown error" },
      { status: 500 }
    );
  }
}

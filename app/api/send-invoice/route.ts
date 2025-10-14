import { NextRequest, NextResponse } from "next/server";
import nodemailer from "nodemailer";

const GMAIL_USER = process.env.GMAIL_USER || "logicologymeta@gmail.com";
const GMAIL_PASSWORD = process.env.GMAIL_PASSWORD || "fdqz xqjx neoz nzan";

export async function POST(req: NextRequest) {
  try {
    const { to, subject, html, pdfUrl } = await req.json();
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: GMAIL_USER,
        pass: GMAIL_PASSWORD,
      },
    });

    const mailOptions: any = {
      from: GMAIL_USER,
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

    // Mark invoice as paid (simulate status update)
    // If you have a DB or API to update, call it here
    // Example: await updateInvoiceStatus(invoiceId, 'paid');

    await transporter.sendMail(mailOptions);
    return NextResponse.json({ success: true, status: "paid" });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err?.message || "Unknown error" },
      { status: 500 }
    );
  }
}

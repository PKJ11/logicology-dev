/**
 * Server-only: sends mail through the Hostinger SMTP account.
 * Used by /api/send-invoice and by order fulfillment (lib/orders/fulfillment.ts).
 */
import nodemailer from "nodemailer";

const HOSTINGER_EMAIL = process.env.HOSTINGER_EMAIL || "orders@logicology.in";
const HOSTINGER_PASSWORD = process.env.HOSTINGER_PASSWORD || "Raha@1ogic$$$";

export interface EmailMessage {
  to: string | string[];
  subject: string;
  html: string;
  cc?: string[];
  pdfUrl?: string;
}

export async function sendEmail({ to, subject, html, cc, pdfUrl }: EmailMessage): Promise<void> {
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
  if (cc && cc.length > 0) {
    mailOptions.cc = cc;
  }

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
}

import { NextRequest, NextResponse } from "next/server";
import { sendEmail } from "@/lib/notifications/email";

export async function POST(req: NextRequest) {
  try {
    const { to, subject, html, pdfUrl, cc } = await req.json();

    await sendEmail({ to, subject, html, cc, pdfUrl });
    return NextResponse.json({ success: true, status: "paid" });
  } catch (err: any) {
    console.error("Email error:", err);
    return NextResponse.json(
      { success: false, error: err?.message || "Unknown error" },
      { status: 500 }
    );
  }
}

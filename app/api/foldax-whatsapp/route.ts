import { NextResponse } from "next/server";
import { sendWhatsAppTemplate } from "@/lib/notifications/whatsapp-service";

export async function POST(req: Request) {
  try {
    const { name, phone } = await req.json();
    if (!name || !phone) {
      return NextResponse.json({ success: false, error: "Missing fields" }, { status: 400 });
    }

    const result = await sendWhatsAppTemplate("FOLDAX_WELCOME", phone, {
      message: "Thank you for registering for Foldax!",
    });

    if (!result.success) {
      return NextResponse.json(
        { success: false, error: result.error || "Failed to send WhatsApp message" },
        { status: 500 }
      );
    }
    return NextResponse.json({ success: true, messageId: result.messageId });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

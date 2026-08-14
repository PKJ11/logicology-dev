import { NextResponse } from "next/server";
import { sendWhatsAppTemplate } from "@/lib/notifications/whatsapp-service";
import { WHATSAPP_TEMPLATES } from "@/lib/notifications/whatsapp-templates";
import { WhatsAppTemplateKey } from "@/lib/notifications/types";

export async function POST(req: Request) {
  try {
    const { templateKey, phoneNumber, variables } = await req.json();

    if (!templateKey || !(templateKey in WHATSAPP_TEMPLATES)) {
      return NextResponse.json(
        { success: false, messageId: null, error: "Invalid or missing templateKey" },
        { status: 400 }
      );
    }

    if (!phoneNumber) {
      return NextResponse.json(
        { success: false, messageId: null, error: "Missing phoneNumber" },
        { status: 400 }
      );
    }

    const result = await sendWhatsAppTemplate(
      templateKey as WhatsAppTemplateKey,
      phoneNumber,
      variables || {}
    );

    return NextResponse.json(result, { status: result.success ? 200 : 502 });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, messageId: null, error: error.message || "Unknown error" },
      { status: 500 }
    );
  }
}

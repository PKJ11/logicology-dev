/**
 * Client-safe helper for "use client" components. Never touches the Botbiz token directly —
 * posts to our own /api/notifications/whatsapp route, which holds the secret server-side.
 */
import { SendWhatsAppResult, WhatsAppTemplateKey } from "./types";

export async function sendWhatsAppNotification(
  templateKey: WhatsAppTemplateKey,
  phoneNumber: string,
  variables: Record<string, string>
): Promise<SendWhatsAppResult> {
  try {
    const res = await fetch("/api/notifications/whatsapp", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ templateKey, phoneNumber, variables }),
    });

    return await res.json();
  } catch (error) {
    return {
      success: false,
      messageId: null,
      error: error instanceof Error ? error.message : "Network error sending WhatsApp message",
    };
  }
}

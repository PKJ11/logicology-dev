/**
 * Server-only orchestration: validates a template request against the registry,
 * normalizes the phone number, and calls the Botbiz client.
 * Used directly by API routes; client components go through whatsapp-client.ts + /api/notifications/whatsapp.
 */
import { sendBotbizTemplateMessage } from "./botbiz-client";
import { WHATSAPP_TEMPLATES } from "./whatsapp-templates";
import { SendWhatsAppResult, WhatsAppTemplateKey } from "./types";

/** Accepts local 10-digit, 91-prefixed, or +91-prefixed Indian numbers; returns 91XXXXXXXXXX or null. */
export function normalizeIndianPhoneNumber(rawPhone: string): string | null {
  let cleaned = (rawPhone || "").replace(/\D/g, "");

  if (cleaned.startsWith("91") && cleaned.length === 12) {
    cleaned = cleaned.slice(2);
  } else if (cleaned.length === 11 && cleaned.startsWith("0")) {
    cleaned = cleaned.slice(1);
  }

  if (cleaned.length !== 10) return null;
  return `91${cleaned}`;
}

export async function sendWhatsAppTemplate(
  templateKey: WhatsAppTemplateKey,
  phoneNumber: string,
  variables: Record<string, string>
): Promise<SendWhatsAppResult> {
  const template = WHATSAPP_TEMPLATES[templateKey];
  if (!template) {
    return { success: false, messageId: null, error: `Unknown WhatsApp template: ${templateKey}` };
  }

  if (!template.templateId) {
    return {
      success: false,
      messageId: null,
      error: `Botbiz template not configured for "${templateKey}" — set its template ID env var.`,
    };
  }

  const fullPhone = normalizeIndianPhoneNumber(phoneNumber);
  if (!fullPhone) {
    return { success: false, messageId: null, error: "Invalid phone number format" };
  }

  const missing = template.variables.filter((name) => variables[name] === undefined);
  if (missing.length > 0) {
    return {
      success: false,
      messageId: null,
      error: `Missing template variables for "${templateKey}": ${missing.join(", ")}`,
    };
  }

  const orderedVariables: Record<string, string> = {};
  template.variables.forEach((name) => {
    orderedVariables[name] = variables[name] ?? "";
  });

  const sendOne = async (phone: string): Promise<SendWhatsAppResult> => {
    try {
      return await sendBotbizTemplateMessage({
        templateId: template.templateId,
        phoneNumber: phone,
        variables: orderedVariables,
      });
    } catch (error) {
      return {
        success: false,
        messageId: null,
        error: error instanceof Error ? error.message : "Unknown Botbiz error",
      };
    }
  };

  // CC copies go out alongside the main send; their outcome never affects the caller's result.
  const ccPhones = Array.from(
    new Set(
      (template.ccPhoneNumbers || [])
        .map(normalizeIndianPhoneNumber)
        .filter((phone): phone is string => !!phone && phone !== fullPhone)
    )
  );

  const [result, ...ccResults] = await Promise.all([
    sendOne(fullPhone),
    ...ccPhones.map(sendOne),
  ]);

  ccResults.forEach((ccResult, i) => {
    if (!ccResult.success) {
      console.error(`WhatsApp CC for "${templateKey}" to ${ccPhones[i]} failed:`, ccResult.error);
    }
  });

  return result;
}

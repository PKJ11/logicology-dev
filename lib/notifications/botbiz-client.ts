/**
 * Low-level Botbiz WhatsApp API client. Server-only — holds the API token.
 * Never import this from a "use client" component; go through whatsapp-client.ts instead.
 */

const BOTBIZ_SEND_TEMPLATE_URL = "https://dash.botbiz.io/api/v1/whatsapp/send/template";

interface BotbizSendParams {
  templateId: string;
  /** Full number with country code, e.g. 917756916144 */
  phoneNumber: string;
  /** Ordered map of variable name -> value; position determines the templateVariable-<name>-N index. */
  variables: Record<string, string>;
}

interface BotbizConfig {
  apiToken: string;
  phoneNumberId: string;
}

function getBotbizConfig(): BotbizConfig {
  const apiToken =
    process.env.BOTBIZ_API_TOKEN || "22772|IKy6S1FQBF6RJewFjiAqkzSMV5dElqPYas0M53Xa244e9a7e";
  const phoneNumberId = process.env.BOTBIZ_PHONE_NUMBER_ID || "1109076355631500";

  if (!apiToken || !phoneNumberId) {
    throw new Error("Botbiz is not configured: set BOTBIZ_API_TOKEN and BOTBIZ_PHONE_NUMBER_ID");
  }

  return { apiToken, phoneNumberId };
}

export async function sendBotbizTemplateMessage({
  templateId,
  phoneNumber,
  variables,
}: BotbizSendParams): Promise<{ success: boolean; messageId: string | null; error?: string }> {
  const { apiToken, phoneNumberId } = getBotbizConfig();

  const params = new URLSearchParams({
    apiToken,
    phone_number_id: phoneNumberId,
    template_id: templateId,
    phone_number: phoneNumber,
  });

  Object.entries(variables).forEach(([name, value], index) => {
    params.set(`templateVariable-${name}-${index + 1}`, value);
  });

  const res = await fetch(BOTBIZ_SEND_TEMPLATE_URL, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: params.toString(),
  });

  const result = await res.json().catch(() => ({}));
  const messageId = result.id || result.message_id || result.data?.message_id || null;
  const success = res.ok && (result.success || result.status === "success" || !!messageId);

  return {
    success,
    messageId,
    error: success ? undefined : JSON.stringify(result),
  };
}

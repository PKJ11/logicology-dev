export type WhatsAppTemplateKey =
  | "ORDER_CONFIRMATION"
  | "COMMUNITY_INVITE"
  | "FOLDAX_WELCOME"
  | "ANALYTICS_REPORT";

export interface WhatsAppTemplateDefinition<V extends string = string> {
  /** Botbiz template_id. Empty string means the template hasn't been created in Botbiz yet. */
  templateId: string;
  description: string;
  /** Ordered variable names — position N maps to Botbiz's templateVariable-<name>-N. */
  variables: readonly V[];
}

export interface SendWhatsAppResult {
  success: boolean;
  messageId: string | null;
  error?: string;
}

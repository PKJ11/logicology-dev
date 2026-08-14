import { WhatsAppTemplateDefinition, WhatsAppTemplateKey } from "./types";

/**
 * Central registry of every Botbiz WhatsApp template this app can send.
 * Adding a new notification is config here, not a new Interakt/Botbiz integration —
 * define the template's variables, drop its Botbiz template_id in an env var, done.
 */
export const WHATSAPP_TEMPLATES: Record<WhatsAppTemplateKey, WhatsAppTemplateDefinition> = {
  ORDER_CONFIRMATION: {
    templateId: process.env.BOTBIZ_TEMPLATE_ORDER_CONFIRMATION || "424547",
    description:
      "Purchase/order confirmation sent after a successful payment (cart checkout, buy-now, summer camp enrollment).",
    variables: ["name", "orderItems", "finalAmount", "shippingAddress", "paymentId"],
  },
  COMMUNITY_INVITE: {
    templateId: process.env.BOTBIZ_TEMPLATE_COMMUNITY_INVITE || "425634",
    description: "Invite a friend to the PlayThinkers Community via WhatsApp.",
    variables: ["friendName", "inviterName", "communityName", "inviteLink"],
  },
  FOLDAX_WELCOME: {
    templateId: process.env.BOTBIZ_TEMPLATE_FOLDAX_WELCOME || "",
    description: "Welcome message sent after a new Foldax registration.",
    variables: ["message"],
  },
  ANALYTICS_REPORT: {
    templateId: process.env.BOTBIZ_TEMPLATE_ANALYTICS_REPORT || "",
    description: "Internal analytics summary sent to the Logicology admin number.",
    variables: ["companyName", "period", "totalUsers", "totalSessions", "pageViews"],
  },
};

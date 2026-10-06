/**
 * Client-safe checkout helpers for "use client" components (no DB / secrets here).
 * Server side lives in lib/orders/fulfillment.ts and /api/checkout/*.
 */

/** Put this wherever the payment id belongs in email/WhatsApp content built before payment. */
export const PAYMENT_ID_PLACEHOLDER = "{{PAYMENT_ID}}";

export interface ConfirmCheckoutResult {
  success: boolean;
  /** Saved order / registration id, when the server has it. */
  recordId: string | null;
  error?: string;
}

/**
 * Tells the server the Razorpay payment succeeded so it saves the order and sends the invoice + WhatsApp.
 * Never throws: if this fails, the Razorpay webhook still completes the order.
 */
export async function confirmCheckoutPayment(response: {
  razorpay_order_id: string;
  razorpay_payment_id: string;
  razorpay_signature: string;
}): Promise<ConfirmCheckoutResult> {
  const body = JSON.stringify({
    orderId: response.razorpay_order_id,
    paymentId: response.razorpay_payment_id,
    signature: response.razorpay_signature,
  });

  for (let attempt = 1; attempt <= 2; attempt++) {
    try {
      const res = await fetch("/api/checkout/confirm", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body,
      });
      const data = await res.json();
      if (res.ok) return { success: true, recordId: data.recordId ?? null };
      if (res.status < 500) return { success: false, recordId: null, error: data.error };
    } catch (error) {
      if (attempt === 2) {
        return {
          success: false,
          recordId: null,
          error: error instanceof Error ? error.message : "Network error confirming payment",
        };
      }
    }
  }

  return { success: false, recordId: null, error: "Could not confirm payment" };
}

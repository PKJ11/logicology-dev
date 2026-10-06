/**
 * Server-only order fulfillment.
 *
 * Checkout stores everything needed to complete an order (the DB record, the invoice email and the
 * WhatsApp message) as a "pending order" keyed by the Razorpay order id BEFORE the customer pays.
 * After payment, fulfillOrder() is called from both the browser (/api/checkout/confirm) and the
 * Razorpay webhook (/api/razorpay/webhook). Whichever arrives first does the work exactly once, so an
 * order is still saved and notified when the customer's browser never returns from Razorpay.
 */
import { Collection, MongoClient } from "mongodb";
import { sendEmail } from "@/lib/notifications/email";
import { sendWhatsAppTemplate } from "@/lib/notifications/whatsapp-service";
import { PAYMENT_ID_PLACEHOLDER } from "./checkout-client";

const MONGO_URI =
  process.env.MONGO_URI ||
  "mongodb+srv://pratikkumarjhavnit:pratik11@cluster0.2gksooz.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";
const DB_NAME = process.env.MONGO_DB_NAME || "logicology";
const SUMMER_CAMP_DB_NAME = "summer-camp-2026";

/** A "processing" claim older than this is assumed to have crashed and may be taken over. */
const STALE_CLAIM_MS = 2 * 60 * 1000;

export type PendingOrderKind = "order" | "summer_camp";

export interface PendingOrderInput {
  kind: PendingOrderKind;
  /** The document saved today by /api/save-order-info or /api/save-summer-camp-registration, minus payment ids. */
  record: Record<string, any>;
  email: { to: string[]; cc?: string[]; subject: string; html: string };
  whatsapp: { phone: string; variables: Record<string, string> } | null;
}

interface PendingOrder extends PendingOrderInput {
  _id: string; // Razorpay order id
  amount: number; // paise
  status: "pending" | "processing" | "fulfilled";
  createdAt: Date;
  processingAt?: Date;
  paymentId?: string;
  recordId?: string;
  emailSent?: boolean;
  whatsappSent?: boolean;
  fulfilledAt?: Date;
}

export type FulfillResult =
  | { status: "fulfilled" | "already_fulfilled"; recordId: string }
  | { status: "in_progress" }
  | { status: "not_found" };

// Reuse one client per server instance instead of connecting on every request.
let clientPromise: Promise<MongoClient> | null = null;

function getClient(): Promise<MongoClient> {
  if (!clientPromise) {
    clientPromise = new MongoClient(MONGO_URI).connect().catch((err) => {
      clientPromise = null;
      throw err;
    });
  }
  return clientPromise;
}

async function pendingOrders(): Promise<Collection<PendingOrder>> {
  const client = await getClient();
  return client.db(DB_NAME).collection<PendingOrder>("pending_orders");
}

export async function createPendingOrder(
  razorpayOrderId: string,
  amount: number,
  input: PendingOrderInput
): Promise<void> {
  const col = await pendingOrders();
  await col.insertOne({
    _id: razorpayOrderId,
    amount,
    status: "pending",
    createdAt: new Date(),
    kind: input.kind,
    record: input.record,
    email: input.email,
    whatsapp: input.whatsapp,
  });
}

const fillPaymentId = (text: string, paymentId: string) =>
  text.split(PAYMENT_ID_PLACEHOLDER).join(paymentId);

/** Saves the order/registration document and returns its id. Safe to repeat for the same payment. */
async function saveRecord(order: PendingOrder, paymentId: string): Promise<string> {
  const client = await getClient();
  const orderId = order._id;

  if (order.kind === "summer_camp") {
    const col = client.db(SUMMER_CAMP_DB_NAME).collection("registrations");
    const existing = await col.findOne({ "paymentInfo.paymentId": paymentId });
    if (existing) return existing._id.toString();

    const result = await col.insertOne({
      ...order.record,
      paymentInfo: { ...(order.record.paymentInfo || {}), paymentId, orderId },
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    return result.insertedId.toString();
  }

  const db = client.db(DB_NAME);
  const col = db.collection("orders");
  const existing = await col.findOne({ paymentId });
  if (existing) return existing._id.toString();

  const result = await col.insertOne({
    ...order.record,
    paymentId,
    orderId,
    createdAt: new Date(),
    rzpDeviceId: order.record.rzpDeviceId ?? null,
  });

  // Mark the matching cart_events record as converted (same as /api/save-order-info)
  if (order.record.rzpDeviceId) {
    await db.collection("cart_events").updateOne(
      { rzpDeviceId: order.record.rzpDeviceId },
      {
        $set: {
          convertedToOrder: true,
          paymentId,
          orderId,
          convertedAt: new Date(),
        },
      }
    );
  }

  return result.insertedId.toString();
}

export async function fulfillOrder(razorpayOrderId: string, paymentId: string): Promise<FulfillResult> {
  const col = await pendingOrders();
  const now = new Date();

  const claimed = await col.findOneAndUpdate(
    {
      _id: razorpayOrderId,
      $or: [
        { status: "pending" },
        { status: "processing", processingAt: { $lt: new Date(now.getTime() - STALE_CLAIM_MS) } },
      ],
    },
    { $set: { status: "processing", processingAt: now, paymentId } },
    { returnDocument: "after" }
  );

  if (!claimed) {
    const current = await col.findOne({ _id: razorpayOrderId });
    if (!current) return { status: "not_found" };
    if (current.status === "fulfilled" && current.recordId) {
      return { status: "already_fulfilled", recordId: current.recordId };
    }
    return { status: "in_progress" };
  }

  const recordId = await saveRecord(claimed, paymentId);
  await col.updateOne({ _id: razorpayOrderId }, { $set: { recordId } });

  let emailSent = false;
  try {
    await sendEmail({
      to: claimed.email.to,
      cc: claimed.email.cc,
      subject: fillPaymentId(claimed.email.subject, paymentId),
      html: fillPaymentId(claimed.email.html, paymentId),
    });
    emailSent = true;
  } catch (err) {
    console.error(`Order ${razorpayOrderId}: invoice email failed`, err);
  }

  let whatsappSent = false;
  if (claimed.whatsapp?.phone) {
    const variables: Record<string, string> = {};
    Object.entries(claimed.whatsapp.variables).forEach(([key, value]) => {
      variables[key] = fillPaymentId(String(value ?? ""), paymentId);
    });
    const result = await sendWhatsAppTemplate("ORDER_CONFIRMATION", claimed.whatsapp.phone, variables);
    whatsappSent = result.success;
    if (!result.success) {
      console.error(`Order ${razorpayOrderId}: WhatsApp failed`, result.error);
    }
  }

  await col.updateOne(
    { _id: razorpayOrderId },
    { $set: { status: "fulfilled", fulfilledAt: new Date(), emailSent, whatsappSent } }
  );

  return { status: "fulfilled", recordId };
}

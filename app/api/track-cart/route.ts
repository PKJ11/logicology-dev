// NEW FILE → app/api/track-cart/route.ts

import { NextRequest, NextResponse } from "next/server";
import { MongoClient } from "mongodb";

const MONGO_URI =
  process.env.MONGO_URI ||
  "mongodb+srv://pratikkumarjhavnit:pratik11@cluster0.2gksooz.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";
const DB_NAME = process.env.MONGO_DB_NAME || "logicology";
const COLLECTION = "cart_events";

/**
 * POST /api/track-cart
 *
 * Body:
 * {
 *   rzpDeviceId: string          — from Razorpay cookie or localStorage fallback
 *   cart: CartProduct[]          — full current cart snapshot
 *   action: "add"|"remove"|"increase"|"decrease"|"clear"|"enrich"
 *   changedItem?: Partial<CartProduct>
 *   userInfo?: { name, email, phone }  — sent at checkout Step 1
 * }
 *
 * One document per rzpDeviceId. Upserted on every cart change.
 * History array keeps full audit trail of every action.
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { rzpDeviceId, cart, action, changedItem, userInfo } = body;

    if (!rzpDeviceId) {
      return NextResponse.json({ error: "rzpDeviceId is required" }, { status: 400 });
    }

    const client = new MongoClient(MONGO_URI);
    await client.connect();
    const db = client.db(DB_NAME);
    const col = db.collection(COLLECTION);

    const now = new Date();

    // Append this action to history
    const event = {
      action,
      changedItem: changedItem ?? null,
      cartSnapshot: cart,
      timestamp: now,
    };

    // Fields updated on every write
    const $set: Record<string, unknown> = {
      rzpDeviceId,
      cart,         // latest cart snapshot
      updatedAt: now,
    };

    // Enrich with identity when user fills checkout Step 1
    if (userInfo) {
      if (userInfo.name)  $set["userInfo.name"]       = userInfo.name;
      if (userInfo.email) $set["userInfo.email"]      = userInfo.email;
      if (userInfo.phone) $set["userInfo.phone"]      = userInfo.phone;
      $set["userInfo.enrichedAt"] = now;
    }

    await col.updateOne(
      { rzpDeviceId },
      {
        $set,
        $setOnInsert: { createdAt: now },   // only on first insert
        $push: { history: event } as any,
      },
      { upsert: true }
    );

    await client.close();
    return NextResponse.json({ success: true });
  } catch (err: any) {
    console.error("track-cart error:", err);
    return NextResponse.json({ error: err?.message || "Unknown error" }, { status: 500 });
  }
}

/**
 * GET /api/track-cart?rzpDeviceId=xxx
 *                  OR ?phone=9876543210
 */
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const rzpDeviceId = searchParams.get("rzpDeviceId");
    const phone       = searchParams.get("phone");

    if (!rzpDeviceId && !phone) {
      return NextResponse.json(
        { error: "Provide rzpDeviceId or phone" },
        { status: 400 }
      );
    }

    const client = new MongoClient(MONGO_URI);
    await client.connect();
    const db = client.db(DB_NAME);
    const query = rzpDeviceId ? { rzpDeviceId } : { "userInfo.phone": phone };
    const record = await db.collection(COLLECTION).findOne(query);
    await client.close();

    return NextResponse.json({ success: true, record });
  } catch (err: any) {
    return NextResponse.json({ error: err?.message || "Unknown error" }, { status: 500 });
  }
}
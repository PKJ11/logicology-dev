import { NextRequest, NextResponse } from "next/server";
import { MongoClient } from "mongodb";

const MONGO_URI =
  process.env.MONGO_URI ||
  "mongodb+srv://pratikkumarjhavnit:pratik11@cluster0.2gksooz.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";
const DB_NAME = process.env.MONGO_DB_NAME || "logicology";
const COLLECTION = "orders";

export async function POST(req: NextRequest) {
  try {
    const data = await req.json();

    const client = new MongoClient(MONGO_URI);
    await client.connect();
    const db = client.db(DB_NAME);
    const col = db.collection(COLLECTION);

    // ── Add timestamp + rzpDeviceId to every order document ──
    await col.insertOne({
      ...data,
      createdAt: new Date(), // ← NEW: order timestamp
      rzpDeviceId: data.rzpDeviceId ?? null, // ← NEW: device link
    });

    // ── Mark the matching cart_events record as converted ──
    if (data.rzpDeviceId) {
      const cartCol = db.collection("cart_events");
      await cartCol.updateOne(
        { rzpDeviceId: data.rzpDeviceId },
        {
          $set: {
            convertedToOrder: true,
            paymentId: data.paymentId ?? null,
            orderId: data.orderId ?? null,
            convertedAt: new Date(),
          },
        }
      );
    }

    await client.close();
    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err?.message || "Unknown error" },
      { status: 500 }
    );
  }
}

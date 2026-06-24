import { NextRequest, NextResponse } from "next/server";
import { MongoClient, ObjectId } from "mongodb";

const MONGO_URI =
  process.env.MONGO_URI ||
  "mongodb+srv://pratikkumarjhavnit:pratik11@cluster0.2gksooz.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";
const DB_NAME = "summer-camp-2026";
const COLLECTION = "registrations";

// ── POST: Save registration ───────────────────────────────────────────────────
export async function POST(req: NextRequest) {
  try {
    const data = await req.json();

    const documentToInsert = {
      ...data,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const client = new MongoClient(MONGO_URI);
    await client.connect();
    const db = client.db(DB_NAME);
    const col = db.collection(COLLECTION);
    const result = await col.insertOne(documentToInsert);
    await client.close();

    return NextResponse.json({
      success: true,
      registrationId: result.insertedId.toString(),
    });
  } catch (err: any) {
    console.error("Save summer camp registration error:", err);
    return NextResponse.json(
      { success: false, error: err?.message || "Unknown error" },
      { status: 500 }
    );
  }
}

// ── GET: Fetch registration by MongoDB _id OR paymentId OR orderId ────────────
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ success: false, error: "Missing id parameter" }, { status: 400 });
    }

    const client = new MongoClient(MONGO_URI);
    await client.connect();
    const db = client.db(DB_NAME);
    const col = db.collection(COLLECTION);

    let registration = null;

    // 1. Try MongoDB ObjectId (24-char hex)
    if (ObjectId.isValid(id) && id.length === 24) {
      registration = await col.findOne({ _id: new ObjectId(id) });
    }

    // 2. Fallback: Razorpay paymentId  e.g. pay_SboPcZLE2hWEsa
    if (!registration) {
      registration = await col.findOne({ "paymentInfo.paymentId": id });
    }

    // 3. Fallback: Razorpay orderId  e.g. order_SboPD08N9JK5jd
    if (!registration) {
      registration = await col.findOne({ "paymentInfo.orderId": id });
    }

    await client.close();

    if (!registration) {
      return NextResponse.json(
        { success: false, error: "Registration not found" },
        { status: 404 }
      );
    }

    // Serialise ObjectId → string so JSON works
    const doc = { ...registration, _id: registration._id.toString() };

    return NextResponse.json({ success: true, registration: doc });
  } catch (err: any) {
    console.error("Fetch registration error:", err);
    return NextResponse.json(
      { success: false, error: err?.message || "Unknown error" },
      { status: 500 }
    );
  }
}

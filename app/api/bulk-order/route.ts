import { NextRequest, NextResponse } from "next/server";
import { MongoClient, ObjectId } from "mongodb";

const MONGO_URI = "mongodb+srv://pratikkumarjhavnit:pratik11@cluster0.2gksooz.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";
const DB_NAME = "logicology";
const COLLECTION = "bulk_orders";

export async function POST(req: NextRequest) {
  try {
    const data = await req.json();
    const client = new MongoClient(MONGO_URI);
    await client.connect();
    const db = client.db(DB_NAME);
    const col = db.collection(COLLECTION);
    const result = await col.insertOne({ ...data, paid: false, createdAt: new Date() });
    await client.close();
    return NextResponse.json({ success: true, _id: result.insertedId });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err?.message || "Unknown error" }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const { _id, paid, paymentId } = await req.json();
    const client = new MongoClient(MONGO_URI);
    await client.connect();
    const db = client.db(DB_NAME);
    const col = db.collection(COLLECTION);
    await col.updateOne({ _id: new ObjectId(_id) }, { $set: { paid, paymentId } });
    await client.close();
    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err?.message || "Unknown error" }, { status: 500 });
  }
}

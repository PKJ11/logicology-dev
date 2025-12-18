import { NextRequest, NextResponse } from "next/server";
import { MongoClient } from "mongodb";

const MONGO_URI = "mongodb+srv://pratikkumarjhavnit:pratik11@cluster0.2gksooz.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";
const DB_NAME = "logicology";
const COLLECTION = "mica-test-result";

export async function POST(req: NextRequest) {
  const data = await req.json();
  try {
    const client = new MongoClient(MONGO_URI);
    await client.connect();
    const db = client.db(DB_NAME);
    const col = db.collection(COLLECTION);
    await col.insertOne({ ...data, createdAt: new Date() });
    await client.close();
    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err?.message || "DB error" }, { status: 500 });
  }
}

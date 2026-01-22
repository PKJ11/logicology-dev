import { NextResponse } from "next/server";
import { MongoClient } from "mongodb";

const MONGO_URI = "mongodb+srv://pratikkumarjhavnit:pratik11@cluster0.2gksooz.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";
const DB_NAME = "logicology";
const COLLECTION = "foldax user";

export async function POST(req: Request) {
  try {
    const { name, email, phone } = await req.json();
    if (!name || !email || !phone) {
      return NextResponse.json({ success: false, error: "Missing fields" }, { status: 400 });
    }
    const client = new MongoClient(MONGO_URI);
    await client.connect();
    const db = client.db(DB_NAME);
    const collection = db.collection(COLLECTION);
    await collection.insertOne({ name, email, phone, createdAt: new Date() });
    await client.close();
    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

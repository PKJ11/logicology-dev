import { NextRequest, NextResponse } from "next/server";
import { MongoClient } from "mongodb";

const MONGO_URI =
  "mongodb+srv://pratikkumarjhavnit:pratik11@cluster0.2gksooz.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";
const DB_NAME = "logicology";
const COLLECTION = "community";

export async function POST(req: NextRequest) {
  const { phone } = await req.json();

  try {
    const client = new MongoClient(MONGO_URI);
    await client.connect();
    const db = client.db(DB_NAME);
    const col = db.collection(COLLECTION);

    const user = await col.findOne({ phone });
    await client.close();

    return NextResponse.json({ exists: !!user });
  } catch (error: any) {
    return NextResponse.json({ exists: false, error: error.message }, { status: 500 });
  }
}

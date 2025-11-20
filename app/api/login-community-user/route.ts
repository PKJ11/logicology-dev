import { NextRequest, NextResponse } from "next/server";
import { MongoClient } from "mongodb";
import jwt from "jsonwebtoken";

const MONGO_URI =
  "mongodb+srv://pratikkumarjhavnit:pratik11@cluster0.2gksooz.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";
const DB_NAME = "logicology";
const COLLECTION = "community";
const JWT_SECRET = process.env.JWT_SECRET || "your-jwt-secret";

export async function POST(req: NextRequest) {
  const { phone } = await req.json();

  try {
    const client = new MongoClient(MONGO_URI);
    await client.connect();
    const db = client.db(DB_NAME);
    const col = db.collection(COLLECTION);

    const user = await col.findOne({ phone });
    await client.close();

    if (!user) {
      return NextResponse.json({ success: false, message: "User not found" }, { status: 404 });
    }

    // Generate JWT token
    const token = jwt.sign(
      {
        userId: user._id,
        phone: user.phone,
        name: user.name,
      },
      JWT_SECRET,
      { expiresIn: "30d" }
    );

    return NextResponse.json({
      success: true,
      token,
      user: {
        id: user._id.toString(),
        name: user.name,
        email: user.email,
        phone: user.phone,
      },
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

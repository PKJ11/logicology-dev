import { NextRequest, NextResponse } from "next/server";
import { MongoClient } from "mongodb";
import jwt from "jsonwebtoken";

const MONGO_URI =
  "mongodb+srv://pratikkumarjhavnit:pratik11@cluster0.2gksooz.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";
const DB_NAME = "logicology";
const COLLECTION = "community";
const JWT_SECRET = process.env.JWT_SECRET || "your-jwt-secret";

export async function POST(req: NextRequest) {
  const { name, email, phone } = await req.json();

  try {
    const client = new MongoClient(MONGO_URI);
    await client.connect();
    const db = client.db(DB_NAME);
    const col = db.collection(COLLECTION);

    // Check if user already exists
    const existingUser = await col.findOne({ phone });
    if (existingUser) {
      await client.close();
      return NextResponse.json(
        {
          success: false,
          error: "User already exists",
        },
        { status: 400 }
      );
    }

    // Insert new user
    const result = await col.insertOne({
      name,
      email,
      phone,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    // Generate JWT token
    const token = jwt.sign(
      {
        userId: result.insertedId,
        phone: phone,
        name: name,
      },
      JWT_SECRET,
      { expiresIn: "30d" }
    );

    await client.close();

    return NextResponse.json({
      success: true,
      token,
      user: {
        id: result.insertedId.toString(),
        name,
        email,
        phone,
      },
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

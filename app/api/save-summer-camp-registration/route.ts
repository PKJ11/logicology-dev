import { NextRequest, NextResponse } from "next/server";
import { MongoClient } from "mongodb";

const MONGO_URI =
  process.env.MONGO_URI ||
  "mongodb+srv://pratikkumarjhavnit:pratik11@cluster0.2gksooz.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";
const DB_NAME = "summer-camp-2026";
const COLLECTION = "registrations";

interface RegistrationData {
  parentInfo: {
    name: string;
    email: string;
    phone: string;
  };
  childInfo: {
    name: string;
    age: string;
    grade: string;
    allergies: string;
  };
  enrollmentInfo: {
    batch: string;
    referralSource: string;
    enrollmentFee: number;
  };
  paymentInfo: {
    paymentId: string;
    orderId: string;
    amount: number;
    currency: string;
    status: string;
  };
}

export async function POST(req: NextRequest) {
  try {
    const data: RegistrationData = await req.json();

    // Add timestamps
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
      registrationId: result.insertedId,
    });
  } catch (err: any) {
    console.error("Save summer camp registration error:", err);
    return NextResponse.json(
      { success: false, error: err?.message || "Unknown error" },
      { status: 500 }
    );
  }
}

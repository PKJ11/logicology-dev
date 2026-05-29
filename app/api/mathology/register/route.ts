import { NextRequest, NextResponse } from "next/server";
import { MongoClient, ObjectId } from "mongodb";

const MONGO_URI =
  process.env.MONGO_URI ||
  "mongodb+srv://pratikkumarjhavnit:pratik11@cluster0.2gksooz.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

const DB_NAME = "mathology-2026";
const COLLECTION = "registrations";

export async function POST(req: NextRequest) {
  try {
    const { name, className, school, branch, parentName, mobile, email, area } = await req.json();

    const missing: string[] = [];
    if (!name?.trim())       missing.push("name");
    if (!school?.trim())     missing.push("school");
    if (!branch?.trim())     missing.push("branch");
    if (!parentName?.trim()) missing.push("parentName");
    if (!mobile?.trim())     missing.push("mobile");
    if (!area?.trim())       missing.push("area");

    if (missing.length > 0) {
      return NextResponse.json(
        { success: false, error: `Missing required fields: ${missing.join(", ")}` },
        { status: 400 }
      );
    }

    const cleanMobile = mobile.replace(/\D/g, "");
    if (cleanMobile.length !== 10) {
      return NextResponse.json(
        { success: false, error: "Mobile number must be 10 digits" },
        { status: 400 }
      );
    }

    const document = {
      name:       name.trim(),
      className:  className ?? "Grade 8",
      school:     school.trim(),
      branch:     branch.trim(),
      parentName: parentName.trim(),
      mobile:     cleanMobile,
      email:      email?.trim() || "",
      area:       area.trim(),
      createdAt:  new Date(),
    };

    const client = new MongoClient(MONGO_URI);
    await client.connect();
    const result = await client.db(DB_NAME).collection(COLLECTION).insertOne(document);
    await client.close();

    return NextResponse.json({ success: true, registrationId: result.insertedId.toString() });

  } catch (err: any) {
    console.error("[register] POST error:", err);
    return NextResponse.json(
      { success: false, error: err?.message ?? "Server error" },
      { status: 500 }
    );
  }
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id     = searchParams.get("id");
    const mobile = searchParams.get("mobile");

    if (!id && !mobile) {
      return NextResponse.json(
        { success: false, error: "Provide either ?id= or ?mobile=" },
        { status: 400 }
      );
    }

    const client = new MongoClient(MONGO_URI);
    await client.connect();
    const col = client.db(DB_NAME).collection(COLLECTION);

    let registration = null;

    if (id && ObjectId.isValid(id) && id.length === 24) {
      registration = await col.findOne({ _id: new ObjectId(id) });
    }

    if (!registration && mobile) {
      registration = await col.findOne(
        { mobile: mobile.replace(/\D/g, "") },
        { sort: { createdAt: -1 } }
      );
    }

    await client.close();

    if (!registration) {
      return NextResponse.json(
        { success: false, error: "Registration not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      registration: { ...registration, _id: registration._id.toString() },
    });

  } catch (err: any) {
    console.error("[register] GET error:", err);
    return NextResponse.json(
      { success: false, error: err?.message ?? "Server error" },
      { status: 500 }
    );
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const { id, status } = await req.json();
    const VALID_STATUSES = ["demo-registered", "contacted", "enrolled", "dropped"];

    if (!id) return NextResponse.json({ success: false, error: "Missing id" }, { status: 400 });
    if (!VALID_STATUSES.includes(status)) {
      return NextResponse.json(
        { success: false, error: `Invalid status. Must be one of: ${VALID_STATUSES.join(", ")}` },
        { status: 400 }
      );
    }
    if (!ObjectId.isValid(id) || id.length !== 24) {
      return NextResponse.json({ success: false, error: "Invalid id format" }, { status: 400 });
    }

    const client = new MongoClient(MONGO_URI);
    await client.connect();
    const result = await client
      .db(DB_NAME)
      .collection(COLLECTION)
      .updateOne({ _id: new ObjectId(id) }, { $set: { status, updatedAt: new Date() } });
    await client.close();

    if (result.matchedCount === 0) {
      return NextResponse.json({ success: false, error: "Registration not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, updated: result.modifiedCount > 0 });

  } catch (err: any) {
    console.error("[register] PATCH error:", err);
    return NextResponse.json(
      { success: false, error: err?.message ?? "Server error" },
      { status: 500 }
    );
  }
}
// app/api/speed-maths-result/route.ts
import { NextRequest, NextResponse } from "next/server";
import { MongoClient, ObjectId } from "mongodb";

const MONGO_URI =
  process.env.MONGO_URI ||
  "mongodb+srv://pratikkumarjhavnit:pratik11@cluster0.2gksooz.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";
const DB_NAME = "summer-camp-2026";
const COLLECTION_NAME = "speed-maths-test-result";

let client: MongoClient | null = null;

async function getClient() {
  if (!client) {
    client = new MongoClient(MONGO_URI);
    await client.connect();
  }
  return client;
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { 
      username, 
      score, 
      answers, 
      timeUsed, 
      timeUp, 
      attempted, 
      correct, 
      wrong, 
      skipped,
      stage1Points,
      stage2Points,
      penalty,
      totalQuestions,
      questions
    } = body;

    // Validate required fields
    if (!username || username.trim() === "") {
      return NextResponse.json(
        { success: false, error: "Username is required" },
        { status: 400 }
      );
    }

    // Validate that test was completed (has score)
    if (score === undefined) {
      return NextResponse.json(
        { success: false, error: "Test data incomplete" },
        { status: 400 }
      );
    }

    const client = await getClient();
    const db = client.db(DB_NAME);
    const collection = db.collection(COLLECTION_NAME);

    // Prepare document for insertion
    const resultDoc = {
      username: username.trim(),
      score: score,
      answers: answers || {},
      timeUsed: timeUsed || 0,
      timeUp: timeUp || false,
      attempted: attempted || 0,
      correct: correct || 0,
      wrong: wrong || 0,
      skipped: skipped || 0,
      stage1Points: stage1Points || 0,
      stage2Points: stage2Points || 0,
      penalty: penalty || 0,
      totalQuestions: totalQuestions || 20,
      questions: questions || [],
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    // Insert the result
    const result = await collection.insertOne(resultDoc);

    return NextResponse.json({
      success: true,
      message: "Test result saved successfully",
      resultId: result.insertedId,
    });
  } catch (error) {
    console.error("Error saving test result:", error);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}

// Optional: GET endpoint to fetch results for a user
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const username = searchParams.get("username");
    const limit = parseInt(searchParams.get("limit") || "10");
    const skip = parseInt(searchParams.get("skip") || "0");

    if (!username) {
      return NextResponse.json(
        { success: false, error: "Username is required" },
        { status: 400 }
      );
    }

    const client = await getClient();
    const db = client.db(DB_NAME);
    const collection = db.collection(COLLECTION_NAME);

    const results = await collection
      .find({ username: username.trim() })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .toArray();

    const total = await collection.countDocuments({ username: username.trim() });

    return NextResponse.json({
      success: true,
      data: results,
      pagination: {
        total,
        limit,
        skip,
      },
    });
  } catch (error) {
    console.error("Error fetching test results:", error);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}

// DELETE endpoint to cleanup (optional)
export async function DELETE(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const resultId = searchParams.get("id");

    if (!resultId) {
      return NextResponse.json(
        { success: false, error: "Result ID is required" },
        { status: 400 }
      );
    }

    const client = await getClient();
    const db = client.db(DB_NAME);
    const collection = db.collection(COLLECTION_NAME);

    await collection.deleteOne({ _id: new ObjectId(resultId) });

    return NextResponse.json({
      success: true,
      message: "Test result deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting test result:", error);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}

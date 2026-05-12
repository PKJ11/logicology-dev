// app/api/communityoffline/[...slug]/route.ts
// ─────────────────────────────────────────────────────────────────────────────
// Handles all /api/communityoffline/* sub-routes via a single catch-all route.
//
// Endpoints:
//   POST   /api/communityoffline/user              — upsert user on login
//   GET    /api/communityoffline/users             — admin: list all users
//   POST   /api/communityoffline/user/tokens       — admin: add/remove tokens
//   GET    /api/communityoffline/sessions          — list sessions (?active=true)
//   POST   /api/communityoffline/sessions          — admin: create session
//   PUT    /api/communityoffline/sessions/:id      — admin: update session
//   DELETE /api/communityoffline/sessions/:id      — admin: delete session
//   POST   /api/communityoffline/book              — user: book a seat
//   POST   /api/communityoffline/cancel            — user: cancel booking
// ─────────────────────────────────────────────────────────────────────────────

import { NextRequest, NextResponse } from "next/server";
import { ObjectId } from "mongodb";
import { MongoClient, Db } from "mongodb";

// ─────────────────────────────────────────────────────────────────────────────
// MongoDB Connection
// ─────────────────────────────────────────────────────────────────────────────

const MONGO_URI =
  process.env.MONGO_URI ||
  "mongodb+srv://pratikkumarjhavnit:pratik11@cluster0.2gksooz.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

const DB_NAME = "logicology_community";

let client: MongoClient | null = null;
let db: Db | null = null;

async function getDb(): Promise<Db> {
  if (db) return db;
  client = new MongoClient(MONGO_URI);
  await client.connect();
  db = client.db(DB_NAME);
  return db;
}

// ─────────────────────────────────────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────────────────────────────────────

const ok = (data: unknown, status = 200) => NextResponse.json(data, { status });
const err = (msg: string, status = 400) =>
  NextResponse.json({ error: msg }, { status });

// ─────────────────────────────────────────────────────────────────────────────
// GET Handler
// ─────────────────────────────────────────────────────────────────────────────

export async function GET(
  req: NextRequest,
  { params }: { params: { slug: string[] } }
) {
  const db = await getDb();
  const [resource, id] = params.slug ?? [];

  // GET /api/communityoffline/sessions
  if (resource === "sessions") {
    const onlyActive = req.nextUrl.searchParams.get("active") === "true";
    const filter = onlyActive ? { isActive: true } : {};
    const sessions = await db
      .collection("sessions")
      .find(filter)
      .sort({ date: 1 })
      .toArray();
    return ok(sessions);
  }

  // GET /api/communityoffline/users
  if (resource === "users") {
    const users = await db
      .collection("users")
      .find({})
      .sort({ tokens: -1 })
      .toArray();
    return ok(users);
  }

  return err("Not found", 404);
}

// ─────────────────────────────────────────────────────────────────────────────
// POST Handler
// ─────────────────────────────────────────────────────────────────────────────

export async function POST(
  req: NextRequest,
  { params }: { params: { slug: string[] } }
) {
  const db = await getDb();
  const [resource, sub] = params.slug ?? [];
  const body = await req.json().catch(() => ({}));

  // POST /api/communityoffline/user — upsert on login
  if (resource === "user" && !sub) {
    const { phone } = body;
    if (!phone) return err("phone required");

    let user: any = await db.collection("users").findOne({ phone });
    if (!user) {
      const newUser = {
        phone,
        tokens: 20,
        bookings: [],
        createdAt: new Date(),
      };
      await db.collection("users").insertOne(newUser);
      user = newUser;
    }
    return ok(user);
  }

  // POST /api/communityoffline/user/tokens — admin: adjust tokens
  if (resource === "user" && sub === "tokens") {
    const { phone, amount } = body;
    if (!phone || amount == null) return err("phone and amount required");
    await db
      .collection("users")
      .updateOne({ phone }, { $inc: { tokens: Number(amount) } });
    const user = await db.collection("users").findOne({ phone });
    return ok(user);
  }

  // POST /api/communityoffline/sessions — admin: create session
  if (resource === "sessions") {
    const { title, date, time, venue, description, totalSeats } = body;
    if (!title || !date || !time || !venue)
      return err("title, date, time, venue required");
    const session = {
      title,
      date: new Date(date),
      time,
      venue,
      description: description || "",
      totalSeats: Number(totalSeats) || 30,
      bookedSeats: [],
      isActive: true,
      createdAt: new Date(),
    };
    const result = await db.collection("sessions").insertOne(session);
    return ok({ ...session, _id: result.insertedId }, 201);
  }

  // POST /api/communityoffline/book — user books a seat
  if (resource === "book") {
    const { phone, sessionId } = body;
    if (!phone || !sessionId) return err("phone and sessionId required");

    const session = await db
      .collection("sessions")
      .findOne({ _id: new ObjectId(sessionId) });
    if (!session) return err("Session not found", 404);
    if (!session.isActive) return err("This session is not active");
    if (session.bookedSeats.includes(phone)) return err("Already booked");
    if (session.bookedSeats.length >= session.totalSeats)
      return err("Session is fully booked");

    const user = await db.collection("users").findOne({ phone });
    if (!user) return err("User not found", 404);
    if (user.tokens <= 0) return err("Insufficient tokens");

    // Atomic operations
    await db.collection("sessions").updateOne(
      { _id: new ObjectId(sessionId) },
      { $push: { bookedSeats: phone } as any }
    );
    await db.collection("users").updateOne(
      { phone },
      {
        $inc: { tokens: -1 },
        $push: { bookings: sessionId } as any,
      }
    );

    const updatedUser = await db.collection("users").findOne({ phone });
    return ok({ success: true, user: updatedUser });
  }

  // POST /api/communityoffline/cancel — user cancels booking
  if (resource === "cancel") {
    const { phone, sessionId } = body;
    if (!phone || !sessionId) return err("phone and sessionId required");

    const session = await db
      .collection("sessions")
      .findOne({ _id: new ObjectId(sessionId) });
    if (!session) return err("Session not found", 404);

    const sessionDate = new Date(session.date);
    if (sessionDate < new Date()) return err("Cannot cancel a past session");

    if (!session.bookedSeats.includes(phone)) return err("Booking not found");

    await db.collection("sessions").updateOne(
      { _id: new ObjectId(sessionId) },
      { $pull: { bookedSeats: phone } as any }
    );
    await db.collection("users").updateOne(
      { phone },
      {
        $inc: { tokens: 1 },
        $pull: { bookings: sessionId } as any,
      }
    );

    const updatedUser = await db.collection("users").findOne({ phone });
    return ok({ success: true, user: updatedUser });
  }

  return err("Not found", 404);
}

// ─────────────────────────────────────────────────────────────────────────────
// PUT Handler
// ─────────────────────────────────────────────────────────────────────────────

export async function PUT(
  req: NextRequest,
  { params }: { params: { slug: string[] } }
) {
  const db = await getDb();
  const [resource, id] = params.slug ?? [];
  if (resource !== "sessions" || !id) return err("Not found", 404);

  const body = await req.json();
  const update: Record<string, unknown> = {};
  if (body.title !== undefined) update.title = body.title;
  if (body.date !== undefined) update.date = new Date(body.date);
  if (body.time !== undefined) update.time = body.time;
  if (body.venue !== undefined) update.venue = body.venue;
  if (body.description !== undefined) update.description = body.description;
  if (body.totalSeats !== undefined) update.totalSeats = Number(body.totalSeats);
  if (body.isActive !== undefined) update.isActive = Boolean(body.isActive);

  await db
    .collection("sessions")
    .updateOne({ _id: new ObjectId(id) }, { $set: update });
  const session = await db
    .collection("sessions")
    .findOne({ _id: new ObjectId(id) });
  return ok(session);
}

// ─────────────────────────────────────────────────────────────────────────────
// DELETE Handler
// ─────────────────────────────────────────────────────────────────────────────

export async function DELETE(
  req: NextRequest,
  { params }: { params: { slug: string[] } }
) {
  const db = await getDb();
  const [resource, id] = params.slug ?? [];
  if (resource !== "sessions" || !id) return err("Not found", 404);

  await db.collection("sessions").deleteOne({ _id: new ObjectId(id) });
  return ok({ success: true });
}
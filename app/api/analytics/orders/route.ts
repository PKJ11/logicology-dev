// app/api/analytics/orders/route.ts
import { NextRequest, NextResponse } from "next/server";
import { MongoClient } from "mongodb";

const MONGO_URI =
  process.env.MONGO_URI ||
  "mongodb+srv://pratikkumarjhavnit:pratik11@cluster0.2gksooz.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

const DB_NAME = process.env.MONGO_DB_NAME || "logicology";
const COLLECTION = "orders";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const limit = Math.min(Number(searchParams.get("limit")) || 7, 200);

  let client: MongoClient | null = null;

  try {
    client = new MongoClient(MONGO_URI);
    await client.connect();
    const db = client.db(DB_NAME);
    const col = db.collection(COLLECTION);

    // Not all orders have a createdAt (older documents predate that field), so we
    // sort by _id instead — every ObjectId encodes its insertion time, which gives
    // us reliable "most recent first" ordering regardless of whether createdAt exists.
    const orders = await col.find({}).sort({ _id: -1 }).limit(limit).toArray();

    const totalRevenue = orders.reduce((sum, o) => sum + (Number(o.totalAmount) || 0), 0);

    const data = orders.map((o) => ({
      id: String(o._id),
      paymentId: o.paymentId || "-",
      orderId: o.orderId || "-",
      customerName: o.userInfo?.name || "Guest",
      email: o.userInfo?.email || "-",
      totalAmount: Number(o.totalAmount) || 0,
      itemCount: Array.isArray(o.cart)
        ? o.cart.reduce((sum: number, item: any) => sum + (Number(item.quantity) || 1), 0)
        : 0,
      isGift: !!o.isGift,
      createdAt: o.createdAt || o._id.getTimestamp().toISOString(),
    }));

    return NextResponse.json({
      success: true,
      data,
      count: data.length,
      totalRevenue,
    });
  } catch (error: any) {
    console.error("❌ Orders fetch error:", error.message);
    return NextResponse.json({
      success: false,
      error: error.message,
      data: [],
      count: 0,
      totalRevenue: 0,
    });
  } finally {
    if (client) await client.close();
  }
}

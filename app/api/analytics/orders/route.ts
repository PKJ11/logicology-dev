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
  const range = searchParams.get("range") || "7days";
  const limit = Math.min(Number(searchParams.get("limit")) || 50, 200);

  let client: MongoClient | null = null;

  try {
    const { startDate, endDate } = getDateRange(range);

    client = new MongoClient(MONGO_URI);
    await client.connect();
    const db = client.db(DB_NAME);
    const col = db.collection(COLLECTION);

    const orders = await col
      .find({ createdAt: { $gte: startDate, $lte: endDate } })
      .sort({ createdAt: -1 })
      .limit(limit)
      .toArray();

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
      createdAt: o.createdAt,
    }));

    return NextResponse.json({
      success: true,
      data,
      count: data.length,
      totalRevenue,
      dateRange: {
        startDate: startDate.toISOString(),
        endDate: endDate.toISOString(),
      },
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

function getDateRange(range: string) {
  const now = new Date();
  const endDate = new Date();
  endDate.setHours(23, 59, 59, 999);

  const startDate = new Date();

  switch (range) {
    case "today":
      startDate.setHours(0, 0, 0, 0);
      break;
    case "yesterday":
      startDate.setDate(now.getDate() - 1);
      startDate.setHours(0, 0, 0, 0);
      endDate.setDate(now.getDate() - 1);
      endDate.setHours(23, 59, 59, 999);
      break;
    case "7days":
      startDate.setDate(now.getDate() - 7);
      break;
    case "30days":
      startDate.setDate(now.getDate() - 30);
      break;
    case "90days":
      startDate.setDate(now.getDate() - 90);
      break;
    default:
      startDate.setDate(now.getDate() - 7);
  }

  return { startDate, endDate };
}

import { NextRequest, NextResponse } from "next/server";
import axios from "axios";

export async function GET(req: NextRequest, { params }: { params: { itemId: string } }) {
  const itemId = params.itemId;
  const key_id = process.env.RAZORPAY_KEY_ID;
  const key_secret = process.env.RAZORPAY_KEY_SECRET;
  console.log("Razorpay Key ID:", key_id);
  if (!key_id || !key_secret) {
    return NextResponse.json(
      { success: false, error: "Missing Razorpay credentials" },
      { status: 500 }
    );
  }
  const url = `https://api.razorpay.com/v1/items/${itemId}`;
  const auth = Buffer.from(`${key_id}:${key_secret}`).toString("base64");
  try {
    const response = await axios.get(url, {
      headers: {
        Authorization: `Basic ${auth}`,
      },
    });
    // Return relevant item details
    const { id, name, description, amount, currency, hsn_code, tax_rate } = response.data;
    return NextResponse.json({
      success: true,
      item: {
        id,
        name,
        description,
        amount: amount / 100, // Razorpay returns amount in paise
        currency,
        hsn_code,
        tax_rate,
      },
    });
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        error: error?.response?.data?.error?.description || "Failed to fetch item",
      },
      { status: 500 }
    );
  }
}

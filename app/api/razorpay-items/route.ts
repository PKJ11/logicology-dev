import { NextRequest, NextResponse } from "next/server";
import axios from "axios";

export async function GET(req: NextRequest) {
  const key_id =  "rzp_live_RNIwt54hh7eqmk";
  const key_secret =  "t8NMj5PKyi0Af2b15uARbtLl";
  console.log("Razorpay Key ID:", key_id);
  if (!key_id || !key_secret) {
    return NextResponse.json(
      { success: false, error: "Missing Razorpay credentials" },
      { status: 500 }
    );
  }
  const url = `https://api.razorpay.com/v1/items`;
  const auth = Buffer.from(`${key_id}:${key_secret}`).toString("base64");
  try {
    const response = await axios.get(url, {
      headers: {
        Authorization: `Basic ${auth}`,
      },
    });
    // response.data.items is an array of item objects
    const items = response.data.items.map((item: any) => ({
      id: item.id,
      name: item.name,
      description: item.description,
      amount: item.amount / 100, // Razorpay returns amount in paise
      currency: item.currency,
      hsn_code: item.hsn_code,
      tax_rate: item.tax_rate / 100,
    }));
    return NextResponse.json({ success: true, items });
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        error: error?.response?.data?.error?.description || "Failed to fetch items",
      },
      { status: 500 }
    );
  }
}

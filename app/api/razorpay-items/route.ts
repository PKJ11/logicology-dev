import { NextRequest, NextResponse } from "next/server";
import axios from "axios";

export async function GET(req: NextRequest) {
  const key_id = "rzp_live_RNIwt54hh7eqmk";
  const key_secret = "t8NMj5PKyi0Af2b15uARbtLl";
  console.log("Razorpay Key ID:", key_id);
  
  if (!key_id || !key_secret) {
    return NextResponse.json(
      { success: false, error: "Missing Razorpay credentials" },
      { status: 500 }
    );
  }
  
  const auth = Buffer.from(`${key_id}:${key_secret}`).toString("base64");
  
  try {
    let allItems: any[] = [];
    let page = 1;
    let hasMore = true;
    const limit = 50; // Maximum items per page (Razorpay allows up to 50)
    
    while (hasMore) {
      const url = `https://api.razorpay.com/v1/items?count=${limit}&skip=${(page - 1) * limit}`;
      
      const response = await axios.get(url, {
        headers: {
          Authorization: `Basic ${auth}`,
        },
      });
      
      const items = response.data.items || [];
      
      // Process and add items to our collection
      const processedItems = items.map((item: any) => ({
        id: item.id,
        name: item.name,
        description: item.description,
        amount: item.amount / 100, // Razorpay returns amount in paise
        currency: item.currency,
        hsn_code: item.hsn_code,
        tax_rate: item.tax_rate, // Keep as is (already in percentage from API)
      }));
      
      allItems = [...allItems, ...processedItems];
      
      // Check if we have more items
      if (items.length < limit) {
        hasMore = false;
      } else {
        page++;
      }
    }
    
    console.log(`Fetched ${allItems.length} items from Razorpay`);
    return NextResponse.json({ success: true, items: allItems });
    
  } catch (error: any) {
    console.error("Razorpay API Error:", error);
    return NextResponse.json(
      {
        success: false,
        error: error?.response?.data?.error?.description || "Failed to fetch items",
      },
      { status: 500 }
    );
  }
}
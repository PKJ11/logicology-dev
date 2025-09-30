//meta-conversion/route.ts
import { NextRequest, NextResponse } from "next/server";

const PIXEL_ID = process.env.META_PIXEL_ID || "1374809147978540";
const ACCESS_TOKEN = process.env.META_ACCESS_TOKEN || "EAAJRXssyU4EBPqlK8EtzUL40TfOpm8ZCwYipqbopcq1ZCZAZBumfb69KneYA18AloSabS5ZCiHP1bbNgDprjo5kHZACwSoanjbZBs4I46pasackLpf0YSLWEQvG1Ciz1t2ZAGnAvsZAGFNm3pequZCBRo8zUCQcReBZC7LfcxQ9xRO4EZBnYVsZAbzCrvxV296fJRCYGZAjQZDZD";

export async function POST(req: NextRequest) {
  try {
    const event = await req.json(); // { event_name, event_id, user_data, custom_data }
    const url = `https://graph.facebook.com/v19.0/${PIXEL_ID}/events?access_token=${ACCESS_TOKEN}`;
    const payload = {
      data: [event],
    };
    const fbRes = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    const fbJson = await fbRes.json();
    return NextResponse.json(fbJson);
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err?.message || "Unknown error" },
      { status: 500 }
    );
  }
}

//meta-conversion/route.ts

import { createHash } from "crypto";
import { NextRequest, NextResponse } from "next/server";

const PIXEL_ID = process.env.META_PIXEL_ID || "1374809147978540";
const ACCESS_TOKEN =
  process.env.META_ACCESS_TOKEN ||
  "EAAJRXssyU4EBPqlK8EtzUL40TfOpm8ZCwYipqbopcq1ZCZAZBumfb69KneYA18AloSabS5ZCiHP1bbNgDprjo5kHZACwSoanjbZBs4I46pasackLpf0YSLWEQvG1Ciz1t2ZAGnAvsZAGFNm3pequZCBRo8zUCQcReBZC7LfcxQ9xRO4EZBnYVsZAbzCrvxV296fJRCYGZAjQZDZD";

// Hashing utility for email/phone (SHA256)
function hash(str: string) {
  if (!str) return undefined;
  return createHash("sha256").update(str.trim().toLowerCase()).digest("hex");
}

export async function POST(req: NextRequest) {
  try {
    const event = await req.json();
    // Required fields for Meta Conversion API
    const now = Math.floor(Date.now() / 1000);
    const client_ip = req.headers.get("x-forwarded-for") || req.headers.get("host") || "";
    const client_ua = req.headers.get("user-agent") || "";

    // Build user_data
    const user_data: any = {
      client_ip_address: client_ip,
      client_user_agent: client_ua,
    };
    if (event.user_data) {
      if (event.user_data.em) user_data.em = [hash(event.user_data.em)];
      if (event.user_data.ph) user_data.ph = [hash(event.user_data.ph)];
      if (event.user_data.fbc) user_data.fbc = event.user_data.fbc;
      if (event.user_data.fbp) user_data.fbp = event.user_data.fbp;
    }

    // Build event object
    const metaEvent = {
      event_name: event.event_name,
      event_time: event.event_time || now,
      event_id: event.event_id || `${event.event_name}_${now}`,
      event_source_url:
        event.event_source_url ||
        (typeof event.custom_data?.url === "string" ? event.custom_data.url : undefined),
      action_source: event.action_source || "website",
      user_data,
      custom_data: event.custom_data || {},
      data_processing_options: event.data_processing_options || [],
      data_processing_options_country: event.data_processing_options_country || 0,
      data_processing_options_state: event.data_processing_options_state || 0,
      opt_out: event.opt_out || false,
    };

    // Test event code support
    const payload: any = {
      data: [metaEvent],
    };
    if (event.test_event_code) payload.test_event_code = event.test_event_code;

    const url = `https://graph.facebook.com/v19.0/${PIXEL_ID}/events?access_token=${ACCESS_TOKEN}`;
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

// app/api/analytics/meta-pixel/route.ts
import { NextRequest, NextResponse } from "next/server";

const PIXEL_ID = process.env.META_PIXEL_ID || "1374809147978540";
const ACCESS_TOKEN =
  process.env.META_ACCESS_TOKEN ||
  "EAAJRXssyU4EBPqlK8EtzUL40TfOpm8ZCwYipqbopcq1ZCZAZBumfb69KneYA18AloSabS5ZCiHP1bbNgDprjo5kHZACwSoanjbZBs4I46pasackLpf0YSLWEQvG1Ciz1t2ZAGnAvsZAGFNm3pequZCBRo8zUCQcReBZC7LfcxQ9xRO4EZBnYVsZAbzCrvxV296fJRCYGZAjQZDZD";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const range = searchParams.get("range") || "7days";

  try {
    const { startTime, endTime } = getUnixDateRange(range);

    const url = `https://graph.facebook.com/v19.0/${PIXEL_ID}/stats?aggregation=event&start_time=${startTime}&end_time=${endTime}&access_token=${ACCESS_TOKEN}`;

    const res = await fetch(url);
    const json = await res.json();

    if (json.error) {
      throw new Error(json.error.message || "Meta Graph API error");
    }

    // Each bucket: { aggregation, start_time, data: [{ value, count }] }
    const eventTotals: Record<string, number> = {};
    for (const bucket of json.data || []) {
      for (const item of bucket.data || []) {
        const name = item.value || "Unknown";
        eventTotals[name] = (eventTotals[name] || 0) + Number(item.count || 0);
      }
    }

    const events = Object.entries(eventTotals)
      .map(([eventName, count]) => ({ eventName, count }))
      .sort((a, b) => b.count - a.count);

    const totalFires = events.reduce((sum, e) => sum + e.count, 0);

    return NextResponse.json({
      success: true,
      data: {
        pixelId: PIXEL_ID,
        totalFires,
        events,
      },
      timestamp: new Date().toISOString(),
    });
  } catch (error: any) {
    console.error("❌ Meta Pixel stats error:", error.message);

    return NextResponse.json({
      success: false,
      error: error.message,
      message: "Using sample data for demo",
      sample: true,
      data: getSampleMetaPixelData(),
    });
  }
}

function getUnixDateRange(range: string) {
  const now = new Date();
  const endTime = Math.floor(now.getTime() / 1000);
  const start = new Date();

  switch (range) {
    case "today":
      start.setHours(0, 0, 0, 0);
      break;
    case "yesterday":
      start.setDate(now.getDate() - 1);
      start.setHours(0, 0, 0, 0);
      break;
    case "7days":
      start.setDate(now.getDate() - 7);
      break;
    case "30days":
      start.setDate(now.getDate() - 30);
      break;
    case "90days":
      start.setDate(now.getDate() - 90);
      break;
    default:
      start.setDate(now.getDate() - 7);
  }

  return { startTime: Math.floor(start.getTime() / 1000), endTime };
}

function getSampleMetaPixelData() {
  const events = [
    { eventName: "PageView", count: 1850 },
    { eventName: "ViewContent", count: 920 },
    { eventName: "AddToCart", count: 340 },
    { eventName: "InitiateCheckout", count: 180 },
    { eventName: "Purchase", count: 62 },
  ];
  return {
    pixelId: PIXEL_ID,
    totalFires: events.reduce((sum, e) => sum + e.count, 0),
    events,
  };
}

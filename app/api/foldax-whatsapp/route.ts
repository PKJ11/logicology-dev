import { NextResponse } from "next/server";

const INTERAKT_API_KEY = "QTc1emFobGthSVpxRGp1aWtRNE5aaDdCU0xGNFk5LXRFZ3ZXYkRySDZjbzo=";

export async function POST(req: Request) {
  try {
    const { name, phone } = await req.json();
    if (!name || !phone) {
      return NextResponse.json({ success: false, error: "Missing fields" }, { status: 400 });
    }
    let cleanedPhoneNumber = phone.replace(/\D/g, "");
    if (cleanedPhoneNumber.startsWith("91") && cleanedPhoneNumber.length === 12) {
      cleanedPhoneNumber = cleanedPhoneNumber.substring(2);
    } else if (cleanedPhoneNumber.startsWith("+91")) {
      cleanedPhoneNumber = cleanedPhoneNumber.substring(3);
    }
    if (cleanedPhoneNumber.length !== 10) {
      return NextResponse.json({ success: false, error: "Invalid phone number format" }, { status: 400 });
    }
    const countryCode = "+91";
    // Send WhatsApp message using Interakt API
    const messageRes = await fetch("https://api.interakt.ai/v1/public/message/", {
      method: "POST",
      headers: {
        Authorization: `Basic ${INTERAKT_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        countryCode,
        phoneNumber: cleanedPhoneNumber,
        type: "Template",
        template: {
          name: "foldax_test",
          languageCode: "en",
          bodyValues: ["Thank you for registering for Foldax!"],
        },
      }),
    });
    const messageResult = await messageRes.json();
    if (!messageResult.id) {
      return NextResponse.json({ success: false, error: "Failed to send WhatsApp message" }, { status: 500 });
    }
    return NextResponse.json({ success: true, messageId: messageResult.id });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

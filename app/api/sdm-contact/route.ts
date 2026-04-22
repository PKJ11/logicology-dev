import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    // Allow CORS from your React site
    const origin = req.headers.get("origin") || "";
    const allowedOrigins = [
      "https://stellardesignmfg.com",
      "https://www.stellardesignmfg.com",
      "http://localhost:8080",  // for local dev
      "http://localhost:3000",
      "https://steller-med.netlify.app/"
    ];
    const isAllowed = allowedOrigins.includes(origin);

    const { name, email, company, subject, message } = await req.json();

    if (!name || !email || !message) {
      return NextResponse.json(
        { success: false, error: "Missing required fields" },
        { status: 400, headers: corsHeaders(isAllowed ? origin : "") }
      );
    }

    const emailHtml = `
      <div style="font-family: Arial, sans-serif; max-width: 700px; margin: 0 auto;">
        <div style="background: #0a1628; padding: 30px; text-align: center; color: white;">
          <h1 style="margin: 0; font-size: 28px; color: #00aeef;">New Contact Form Submission</h1>
          <p style="margin: 10px 0 0; font-size: 16px; opacity: 0.8;">Stellar Design & Manufacturing</p>
        </div>

        <div style="padding: 25px; background: #f5f6f7; margin: 20px; border-radius: 10px;">
          <h3 style="color: #0a1628; margin-bottom: 15px; border-bottom: 2px solid #00aeef; padding-bottom: 10px;">
            Contact Details
          </h3>
          <div style="margin-bottom: 10px;"><strong>Name:</strong> ${name}</div>
          <div style="margin-bottom: 10px;"><strong>Email:</strong> ${email}</div>
          <div style="margin-bottom: 10px;"><strong>Company:</strong> ${company || "—"}</div>
          <div style="margin-bottom: 10px;"><strong>Subject:</strong> ${subject || "—"}</div>
        </div>

        <div style="padding: 25px; background: #e8f4fb; margin: 20px; border-radius: 10px;">
          <h3 style="color: #0a1628; margin-bottom: 12px;">Message</h3>
          <p style="color: #374151; line-height: 1.8; white-space: pre-wrap;">${message}</p>
        </div>

        <div style="text-align: center; padding: 20px; color: #666; font-size: 12px; border-top: 1px solid #ddd;">
          <p style="margin: 0;">Sent from the SDM website contact form.<br/>
          <strong>Stellar Design & Manufacturing</strong></p>
        </div>
      </div>
    `;

    // Reuse your existing /api/send-invoice endpoint
    const emailRes = await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/send-invoice`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        to: ["pratikkumarjha2002@gmail.com"],
        cc: ["kartikgvyas@outlook.com"],
        subject: `[SDM Enquiry] ${subject || "New Message"} — ${name}`,
        html: emailHtml,
      }),
    });

    const emailResult = await emailRes.json();

    if (!emailResult.success) {
      return NextResponse.json(
        { success: false, error: "Failed to send email" },
        { status: 500, headers: corsHeaders(isAllowed ? origin : "") }
      );
    }

    return NextResponse.json(
      { success: true },
      { headers: corsHeaders(isAllowed ? origin : "") }
    );

  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

// Handle preflight OPTIONS request
export async function OPTIONS(req: Request) {
  const origin = req.headers.get("origin") || "";
  return new NextResponse(null, {
    status: 204,
    headers: corsHeaders(origin),
  });
}

function corsHeaders(origin: string) {
  return {
    "Access-Control-Allow-Origin": origin,
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
  };
}
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { name, email } = await req.json();
    if (!name || !email) {
      return NextResponse.json({ success: false, error: "Missing fields" }, { status: 400 });
    }
    // Send email using your existing email API (Hostinger or other)
    const emailHtml = `<div style='font-family: Arial, sans-serif; max-width: 700px; margin: 0 auto;'>
      <div style='background: #0A8A80; padding: 30px; text-align: center; color: white;'>
        <h1 style='margin: 0; font-size: 32px;'>Registration Successful!</h1>
        <p style='margin: 10px 0 0; font-size: 18px; opacity: 0.9;'>Thank you for registering for Foldax</p>
      </div>
      <div style='padding: 25px; background: #F5F6F7; margin: 20px; border-radius: 10px;'>
        <h3 style='color: #0B3F44; margin-bottom: 15px; border-bottom: 2px solid #0A8A80; padding-bottom: 10px;'>User Details</h3>
        <div><strong>Name:</strong> ${name}</div>
        <div><strong>Email:</strong> ${email}</div>
      </div>
      <div style='text-align: center; padding: 25px; background: #0B3F44; color: white; margin: 20px; border-radius: 10px;'>
        <h3 style='margin: 0 0 15px; color: white;'>Need Assistance?</h3>
        <p style='margin: 0; opacity: 0.9; line-height: 1.6;'>Email: <span style='color: #0A8A80;'>support@logicology.in</span></p>
      </div>
      <div style='text-align: center; padding: 20px; color: #666; font-size: 12px; border-top: 1px solid #ddd;'>
        <p style='margin: 0;'>This is a system generated email. For any queries, please contact our support team.<br><strong>Logicology - Learn To Play. Play To Learn </strong></p>
      </div>
    </div>`;
    const emailRes = await fetch("/api/send-invoice", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        to: [email, "orders@logicology.in"],
        cc: ["orders@logicology.in"],
        subject: `Foldax Registration Successful`,
        html: emailHtml,
      }),
    });
    const emailResult = await emailRes.json();
    if (!emailResult.success) {
      return NextResponse.json({ success: false, error: "Failed to send email" }, { status: 500 });
    }
    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

"use client";
import { useState } from "react";

export default function FoldaxUserPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  const sendUserNotificationEmail = async (to: string, name: string) => {
    try {
      const subject = `Welcome to Foldax!`;
      const html = `
      <div style="font-family: Arial, sans-serif; max-width: 700px; margin: 0 auto;">
        <div style="background: #0A8A80; padding: 30px; text-align: center; color: white;">
          <h1 style="margin: 0; font-size: 32px;">Hi ${name},</h1>
          <p style="margin: 10px 0 0; font-size: 18px; opacity: 0.9;">We're pleased to have you as a Foldax user! 🎉</p>
        </div>
        <div style="padding: 25px; background: #F5F6F7; margin: 20px; border-radius: 10px; text-align: center;">
          <h3 style="color: #0B3F44; margin-bottom: 15px;">Thank you for registering.</h3>
          <p style="color: #333;">If you have any questions, reply to this email or contact our support team.</p>
        </div>
        <div style="text-align: center; padding: 20px; color: #666; font-size: 12px; border-top: 1px solid #ddd;">
          <p style="margin: 0;">Logicology - Learn To Play. Play To Learn</p>
        </div>
      </div>
    `;

      const response = await fetch("/api/send-user-notification-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          to,
          subject,
          html,
          cc: ["orders@logicology.in"],
        }),
      });

      const result = await response.json();

      // Check if the API returned success
      if (!result.success) {
        console.error("Email API error:", result.error);
        throw new Error(result.error || "Failed to send email");
      }

      return result;
    } catch (error: any) {
      console.error("Email function error:", error);
      throw error;
    }
  };

  // Interakt: track user, then send WhatsApp
  const sendInteraktWhatsAppMessage = async (name: string, email: string, phone: string) => {
    if (!phone) {
      return { messageSent: false, error: "No phone number provided" };
    }
    let cleanedPhoneNumber = phone.replace(/\D/g, "");
    if (cleanedPhoneNumber.startsWith("91") && cleanedPhoneNumber.length === 12) {
      cleanedPhoneNumber = cleanedPhoneNumber.substring(2);
    } else if (cleanedPhoneNumber.startsWith("+91")) {
      cleanedPhoneNumber = cleanedPhoneNumber.substring(3);
    }
    if (cleanedPhoneNumber.length !== 10) {
      return { messageSent: false, error: "Invalid phone number format" };
    }
    const countryCode = "+91";
    try {
      // Step 1: Track/Update user in Interakt
      const trackUserResponse = await fetch("https://api.interakt.ai/v1/public/track/users/", {
        method: "POST",
        headers: {
          Authorization: "Basic QTc1emFobGthSVpxRGp1aWtRNE5aaDdCU0xGNFk5LXRFZ3ZXYkRySDZjbzo=",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          phoneNumber: cleanedPhoneNumber,
          countryCode,
          traits: {
            name,
            email,
            registeredAt: new Date().toISOString(),
          },
        }),
      });
      const trackUserResult = await trackUserResponse.json();
      if (!trackUserResult.result) {
        // Continue with message sending even if tracking fails
        console.warn("Failed to track user:", trackUserResult.message);
      }
      // Step 2: Send WhatsApp message
      const messageResponse = await fetch("https://api.interakt.ai/v1/public/message/", {
        method: "POST",
        headers: {
          Authorization: "Basic QTc1emFobGthSVpxRGp1aWtRNE5aaDdCU0xGNFk5LXRFZ3ZXYkRySDZjbzo=",
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
      const messageResult = await messageResponse.json();
      if (!messageResult.id) {
        return { messageSent: false, error: "Failed to send WhatsApp message" };
      }
      return { messageSent: true };
    } catch (error: any) {
      return { messageSent: false, error: error.message };
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      // Save to MongoDB via API route
      const res = await fetch("/api/foldax-user", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, phone }),
      });
      const result = await res.json();
      if (!result.success) throw new Error(result.error || "Failed to save user");

      // Send WhatsApp message
      const waResult = await sendInteraktWhatsAppMessage(name, email, phone);
      if (!waResult.messageSent) {
        console.warn("WhatsApp warning:", waResult.error);
        // Continue even if WhatsApp fails
      }

      // Send notification email
      try {
        await sendUserNotificationEmail(email, name);
        console.log("Email sent successfully");
      } catch (emailError: any) {
        console.error("Email failed but continuing:", emailError.message);
        // You can decide whether to throw or continue
        // throw new Error(`Email failed: ${emailError.message}`);
      }

      setSuccess("User saved successfully! WhatsApp and email notifications sent.");
      setName("");
      setEmail("");
      setPhone("");
    } catch (err: any) {
      setError(err.message || "Error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50">
      <form className="w-full max-w-md rounded-xl bg-white p-8 shadow-md" onSubmit={handleSubmit}>
        <h2 className="mb-6 text-center text-2xl font-bold">Foldax User Registration</h2>
        <div className="mb-4">
          <label className="mb-1 block font-medium">Name</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className="w-full rounded border px-3 py-2"
          />
        </div>
        <div className="mb-4">
          <label className="mb-1 block font-medium">Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full rounded border px-3 py-2"
          />
        </div>
        <div className="mb-6">
          <label className="mb-1 block font-medium">Phone</label>
          <input
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            required
            className="w-full rounded border px-3 py-2"
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          className="w-full rounded bg-orange-500 py-3 font-semibold text-white transition hover:bg-orange-600"
        >
          {loading ? "Submitting..." : "Submit"}
        </button>
        {success && <p className="mt-4 text-center text-green-600">{success}</p>}
        {error && <p className="mt-4 text-center text-red-600">{error}</p>}
      </form>
    </div>
  );
}

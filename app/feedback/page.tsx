"use client";
import { useState } from "react";
import { trackFeedbackSubmission } from "@/lib/gtag";

export default function FeedbackPage() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    feedback: "",
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess(false);
    try {
      const res = await fetch("/api/feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const result = await res.json();
      if (result.success) {
        // Track feedback submission event
        trackFeedbackSubmission("feedback_page", form.email);

        setSuccess(true);
        setForm({ name: "", email: "", phone: "", feedback: "" });
      } else {
        setError(result.error || "Something went wrong");
      }
    } catch (err: any) {
      setError(err?.message || "Unknown error");
    }
    setLoading(false);
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-[linear-gradient(135deg,_#F5F6F7_0%,_#0A8A80_100%)] px-2">
      <div className="mb-4 w-full max-w-xs text-center">
        <img
          src="https://ik.imagekit.io/pratik2002/LOGICOLOGY%20NEW%20LOGO%20WHITE%20COLOR%20VERSION%20VARIATION%201.png?updatedAt=1757316882239"
          alt="Logicology Logo"
          className="mx-auto mb-2 rounded-full bg-[#0A8A80] p-2"
          style={{ width: 48, height: 48, objectFit: "contain", background: "#0A8A80" }}
        />
        <h2 className="text-xl font-extrabold tracking-tight text-[#0B3F44]">Feedback</h2>
        <p className="mt-1 text-xs text-[#E45C48]">We value your thoughts!</p>
      </div>
      <form
        className="w-full max-w-xs space-y-4 rounded-xl border border-[#D8AE4F] bg-white p-4 shadow-xl"
        onSubmit={handleSubmit}
      >
        <input
          type="text"
          placeholder="Name"
          required
          className="w-full rounded border border-[#0A8A80] bg-[#F5F6F7] px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#0A8A80]"
          value={form.name}
          onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
        />
        <input
          type="email"
          placeholder="Email"
          required
          className="w-full rounded border border-[#0A8A80] bg-[#F5F6F7] px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#0A8A80]"
          value={form.email}
          onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
        />
        <input
          type="tel"
          placeholder="Phone"
          required
          className="w-full rounded border border-[#0A8A80] bg-[#F5F6F7] px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#0A8A80]"
          value={form.phone}
          onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))}
        />
        <textarea
          placeholder="Your feedback..."
          required
          className="min-h-[70px] w-full rounded border border-[#E45C48] bg-[#F5F6F7] px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#E45C48]"
          value={form.feedback}
          onChange={(e) => setForm((f) => ({ ...f, feedback: e.target.value }))}
        />
        <button
          type="submit"
          disabled={loading}
          className="w-full rounded border border-[#D8AE4F] bg-[#0A8A80] py-1.5 font-semibold text-white shadow transition hover:bg-[#0B3F44]"
        >
          {loading ? "Submitting..." : "Submit"}
        </button>
        {error && (
          <div className="mt-2 text-center text-xs font-semibold text-[#E45C48]">{error}</div>
        )}
      </form>
      {success && (
        <div className="animate-fade-in mt-6 flex w-full max-w-xs flex-col items-center">
          <img
            src="https://ik.imagekit.io/pratik2002/LOGICOLOGY%20NEW%20LOGO%20WHITE%20COLOR%20VERSION%20VARIATION%201.png?updatedAt=1757316882239"
            alt="Logicology Logo"
            className="mx-auto mb-2 rounded-full bg-[#0A8A80] p-2"
            style={{ width: 56, height: 56, objectFit: "contain", background: "#0A8A80" }}
          />
          <div className="mb-1 text-center text-lg font-bold text-[#0B3F44]">
            Thanks from <span className="text-[#E45C48]">Logicology</span>!
          </div>
          <div className="text-center text-sm font-medium text-[#0A8A80]">
            Your feedback makes us better.
            <br />
            We appreciate your time and thoughts.
          </div>
          <div className="mt-2 text-center text-xs text-[#D8AE4F]">
            We'll review your feedback soon.
          </div>
        </div>
      )}
      <div className="mt-4 w-full max-w-xs text-center">
        <p className="text-xs text-[#0B3F44]">
          Logicology is dedicated to making your experience better. Your feedback helps us grow!
        </p>
      </div>
      <style>{`
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in { animation: fade-in 0.8s ease; }
      `}</style>
    </div>
  );
}

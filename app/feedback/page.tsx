"use client";
import { useState } from "react";

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
    <div className="min-h-screen flex flex-col items-center justify-center bg-[linear-gradient(135deg,_#F5F6F7_0%,_#0A8A80_100%)] px-2">
      <div className="max-w-xs w-full mb-4 text-center">
        <img
          src="https://ik.imagekit.io/pratik2002/LOGICOLOGY%20NEW%20LOGO%20WHITE%20COLOR%20VERSION%20VARIATION%201.png?updatedAt=1757316882239"
          alt="Logicology Logo"
          className="mx-auto mb-2 rounded-full bg-[#0A8A80] p-2"
          style={{ width: 48, height: 48, objectFit: 'contain', background: '#0A8A80' }}
        />
        <h2 className="text-xl font-extrabold text-[#0B3F44] tracking-tight">Feedback</h2>
        <p className="text-[#E45C48] text-xs mt-1">We value your thoughts!</p>
      </div>
      <form
        className="bg-white shadow-xl rounded-xl p-4 w-full max-w-xs space-y-4 border border-[#D8AE4F]"
        onSubmit={handleSubmit}
      >
        <input
          type="text"
          placeholder="Name"
          required
          className="w-full px-3 py-1.5 border border-[#0A8A80] rounded bg-[#F5F6F7] focus:outline-none focus:ring-2 focus:ring-[#0A8A80] text-sm"
          value={form.name}
          onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
        />
        <input
          type="email"
          placeholder="Email"
          required
          className="w-full px-3 py-1.5 border border-[#0A8A80] rounded bg-[#F5F6F7] focus:outline-none focus:ring-2 focus:ring-[#0A8A80] text-sm"
          value={form.email}
          onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
        />
        <input
          type="tel"
          placeholder="Phone"
          required
          className="w-full px-3 py-1.5 border border-[#0A8A80] rounded bg-[#F5F6F7] focus:outline-none focus:ring-2 focus:ring-[#0A8A80] text-sm"
          value={form.phone}
          onChange={e => setForm(f => ({ ...f, phone: e.target.value }))}
        />
        <textarea
          placeholder="Your feedback..."
          required
          className="w-full px-3 py-1.5 border border-[#E45C48] rounded bg-[#F5F6F7] focus:outline-none focus:ring-2 focus:ring-[#E45C48] min-h-[70px] text-sm"
          value={form.feedback}
          onChange={e => setForm(f => ({ ...f, feedback: e.target.value }))}
        />
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-[#0A8A80] text-white py-1.5 rounded font-semibold hover:bg-[#0B3F44] transition border border-[#D8AE4F] shadow"
        >
          {loading ? "Submitting..." : "Submit"}
        </button>
        {error && (
          <div className="text-[#E45C48] text-center font-semibold mt-2 text-xs">{error}</div>
        )}
      </form>
      {success && (
        <div className="flex flex-col items-center mt-6 animate-fade-in max-w-xs w-full">
          <img
            src="https://ik.imagekit.io/pratik2002/LOGICOLOGY%20NEW%20LOGO%20WHITE%20COLOR%20VERSION%20VARIATION%201.png?updatedAt=1757316882239"
            alt="Logicology Logo"
            className="mb-2 mx-auto rounded-full bg-[#0A8A80] p-2"
            style={{ width: 56, height: 56, objectFit: 'contain', background: '#0A8A80' }}
          />
          <div className="text-lg font-bold text-[#0B3F44] text-center mb-1">Thanks from <span className="text-[#E45C48]">Logicology</span>!</div>
          <div className="text-[#0A8A80] text-center font-medium text-sm">Your feedback makes us better.<br />We appreciate your time and thoughts.</div>
          <div className="mt-2 text-[#D8AE4F] text-xs text-center">We'll review your feedback soon.</div>
        </div>
      )}
      <div className="max-w-xs w-full mt-4 text-center">
        <p className="text-[#0B3F44] text-xs">Logicology is dedicated to making your experience better. Your feedback helps us grow!</p>
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

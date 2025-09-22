"use client";
import { useState } from "react";

export default function FeedbackForm({ onClose }: { onClose: () => void }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setSuccess(null);
    setError(null);
    try {
      const res = await fetch("/api/feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, message }),
      });
      const data = await res.json();
      if (data.success) {
        setSuccess("Thank you for your feedback!");
        setName("");
        setEmail("");
        setMessage("");
        setTimeout(() => {
          setSuccess(null);
          onClose();
        }, 1500);
      } else {
        setError("Failed to send feedback. Please try again later.");
      }
    } catch (err) {
      setError("Failed to send feedback. Please try again later.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form className="space-y-4" onSubmit={handleSubmit}>
      <input
        type="text"
        name="name"
        placeholder="Your Name"
        className="w-full border rounded px-3 py-2"
        value={name}
        onChange={e => setName(e.target.value)}
        required
      />
      <input
        type="email"
        name="email"
        placeholder="Your Email"
        className="w-full border rounded px-3 py-2"
        value={email}
        onChange={e => setEmail(e.target.value)}
        required
      />
      <textarea
        name="message"
        placeholder="Your Feedback"
        className="w-full border rounded px-3 py-2"
        rows={4}
        value={message}
        onChange={e => setMessage(e.target.value)}
        required
      />
      <button
        type="submit"
        className="bg-brand-gold text-white px-4 py-2 rounded hover:bg-brand-gold/90 w-full"
        disabled={loading}
      >
        {loading ? "Sending..." : "Submit"}
      </button>
      {success && <div className="text-green-600 text-center mt-2">{success}</div>}
      {error && <div className="text-red-600 text-center mt-2">{error}</div>}
    </form>
  );
}

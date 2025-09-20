"use client";
import { useState } from "react";

export default function FeedbackButton() {
  const [open, setOpen] = useState(false);

  return (
    <>
      {/* Feedback Button */}
      <button
        onClick={() => setOpen(true)}
        className="fixed right-0 top-1/2 z-50 -translate-y-1/2 rounded-l-lg bg-brand-gold px-4 py-2 text-white shadow-lg transition-all hover:bg-brand-gold/90"
        style={{ writingMode: "vertical-rl", textOrientation: "mixed" }}
        aria-label="Open feedback form"
      >
        Feedback
      </button>
      {/* Feedback Modal */}
      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="relative w-full max-w-md rounded-lg bg-white p-6 shadow-xl">
            <button
              onClick={() => setOpen(false)}
              className="absolute right-2 top-2 text-xl text-gray-500 hover:text-gray-800"
              aria-label="Close feedback form"
            >
              &times;
            </button>
            <h2 className="mb-4 text-xl font-bold">Feedback</h2>
            <form
              action="https://formspree.io/f/mzbqzqgk" // Replace with your Formspree or backend endpoint
              method="POST"
              className="space-y-4"
              onSubmit={() => setOpen(false)}
            >
              <input
                type="text"
                name="name"
                placeholder="Your Name"
                className="w-full rounded border px-3 py-2"
                required
              />
              <input
                type="email"
                name="email"
                placeholder="Your Email"
                className="w-full rounded border px-3 py-2"
                required
              />
              <textarea
                name="message"
                placeholder="Your Feedback"
                className="w-full rounded border px-3 py-2"
                rows={4}
                required
              />
              <button
                type="submit"
                className="w-full rounded bg-brand-gold px-4 py-2 text-white hover:bg-brand-gold/90"
              >
                Submit
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
}

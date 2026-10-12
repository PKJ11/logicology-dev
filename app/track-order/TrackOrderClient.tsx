"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import {
  TIMELINE_STEPS,
  TRACKING_STATUS_LABELS,
  TrackingHistoryEntry,
  TrackingStatus,
} from "@/lib/orders/tracking";

interface TrackedOrder {
  paymentId: string;
  placedAt: string;
  items: { name: string; quantity: number }[];
  deliverTo: string;
  tracking: {
    status: TrackingStatus;
    consignmentNo: string | null;
    history: TrackingHistoryEntry[];
    shippedAt: string | null;
    deliveredAt: string | null;
  };
  trackingUrl: string;
}

const formatDate = (value: string | Date) =>
  new Date(value).toLocaleString("en-IN", { dateStyle: "medium", timeStyle: "short" });

export default function TrackOrderClient() {
  const searchParams = useSearchParams();
  const [ref, setRef] = useState(searchParams.get("ref") || "");
  const [contact, setContact] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [order, setOrder] = useState<TrackedOrder | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const prefill = searchParams.get("ref");
    if (prefill) setRef(prefill);
  }, [searchParams]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    setOrder(null);
    try {
      const res = await fetch("/api/track-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ref, contact }),
      });
      const data = await res.json();
      if (data.success) setOrder(data.order);
      else setError(data.error || "Could not find your order.");
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const copyConsignment = async (value: string) => {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard can be blocked; the number is still visible to copy by hand
    }
  };

  return (
    <div className="space-y-6">
      <form
        onSubmit={handleSubmit}
        className="space-y-4 rounded-4xl bg-white p-6 shadow-soft sm:p-8"
      >
        <div>
          <label htmlFor="ref" className="mb-1 block text-sm font-semibold text-gray-700">
            Payment ID
          </label>
          <input
            id="ref"
            value={ref}
            onChange={(e) => setRef(e.target.value)}
            placeholder="pay_XXXXXXXXXXXXXX"
            required
            className="w-full rounded-xl border border-gray-300 px-4 py-3 focus:border-brand-teal focus:outline-none focus:ring-2 focus:ring-brand-teal/20"
          />
        </div>
        <div>
          <label htmlFor="contact" className="mb-1 block text-sm font-semibold text-gray-700">
            Email or phone number
          </label>
          <input
            id="contact"
            value={contact}
            onChange={(e) => setContact(e.target.value)}
            placeholder="you@example.com or 98XXXXXXXX"
            required
            className="w-full rounded-xl border border-gray-300 px-4 py-3 focus:border-brand-teal focus:outline-none focus:ring-2 focus:ring-brand-teal/20"
          />
        </div>
        {error && <p className="text-sm text-red-600">{error}</p>}
        <button
          type="submit"
          disabled={isLoading}
          className="w-full rounded-xl bg-orange-500 py-3 font-semibold text-white transition hover:bg-orange-600 disabled:opacity-60"
        >
          {isLoading ? "Checking..." : "Track Order"}
        </button>
      </form>

      {order && <OrderStatus order={order} copied={copied} onCopy={copyConsignment} />}
    </div>
  );
}

function OrderStatus({
  order,
  copied,
  onCopy,
}: {
  order: TrackedOrder;
  copied: boolean;
  onCopy: (value: string) => void;
}) {
  const { tracking } = order;
  const currentIndex = TIMELINE_STEPS.indexOf(tracking.status);
  const isReturned = tracking.status === "returned";
  const historyByStatus = new Map<TrackingStatus, TrackingHistoryEntry>();
  tracking.history.forEach((h) => historyByStatus.set(h.status, h));

  return (
    <div className="space-y-6 rounded-4xl bg-white p-6 shadow-soft sm:p-8">
      <div className="flex flex-wrap items-start justify-between gap-2">
        <div>
          <p className="text-sm text-gray-500">Payment ID</p>
          <p className="font-semibold text-gray-800">{order.paymentId}</p>
        </div>
        <span
          className={`rounded-full px-3 py-1 text-sm font-semibold ${
            isReturned
              ? "bg-red-100 text-red-700"
              : tracking.status === "delivered"
                ? "bg-green-100 text-green-700"
                : "bg-brand-teal/10 text-brand-teal"
          }`}
        >
          {TRACKING_STATUS_LABELS[tracking.status]}
        </span>
      </div>

      {isReturned && (
        <p className="rounded-xl bg-red-50 p-4 text-sm text-red-700">
          This parcel was returned to us. Please contact us at orders@logicology.in and we&apos;ll
          help you right away.
        </p>
      )}

      {/* Timeline */}
      {!isReturned && (
        <ol className="relative ml-3 border-l-2 border-gray-200">
          {TIMELINE_STEPS.map((step, i) => {
            const done = i <= currentIndex;
            const entry = historyByStatus.get(step);
            const at = step === "processing" ? order.placedAt : entry?.at;
            return (
              <li key={step} className="mb-6 ml-6 last:mb-0">
                <span
                  className={`absolute -left-[11px] flex h-5 w-5 items-center justify-center rounded-full text-[10px] text-white ${
                    done ? "bg-brand-teal" : "bg-gray-300"
                  }`}
                >
                  {done ? "✓" : ""}
                </span>
                <p className={`font-semibold ${done ? "text-gray-800" : "text-gray-400"}`}>
                  {TRACKING_STATUS_LABELS[step]}
                </p>
                {done && at && <p className="text-xs text-gray-500">{formatDate(at)}</p>}
                {done && entry?.note && <p className="mt-1 text-sm text-gray-600">{entry.note}</p>}
              </li>
            );
          })}
        </ol>
      )}

      {/* India Post */}
      {tracking.consignmentNo ? (
        <div className="rounded-xl border border-gray-200 bg-gray-50 p-4">
          <p className="text-sm text-gray-500">India Post consignment number</p>
          <div className="mt-1 flex flex-wrap items-center gap-3">
            <span className="font-mono text-lg font-bold tracking-wider text-gray-800">
              {tracking.consignmentNo}
            </span>
            <button
              type="button"
              onClick={() => onCopy(tracking.consignmentNo!)}
              className="rounded-lg border border-gray-300 px-3 py-1 text-sm text-gray-700 hover:bg-white"
            >
              {copied ? "Copied ✓" : "Copy"}
            </button>
          </div>
          <a
            href={order.trackingUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-4 block w-full rounded-xl bg-brand-teal py-3 text-center font-semibold text-white transition hover:bg-brand-tealDark"
          >
            Live tracking on India Post ↗
          </a>
          <p className="mt-2 text-xs text-gray-500">
            Paste the number into &quot;Track &apos;N&apos; Trace&quot; on the India Post homepage.
          </p>
        </div>
      ) : (
        <p className="rounded-xl bg-gray-50 p-4 text-sm text-gray-600">
          We&apos;re packing your order. You&apos;ll get an email with your India Post tracking
          number as soon as it ships.
        </p>
      )}

      {/* Order summary */}
      <div className="border-t pt-4 text-sm text-gray-700">
        {order.items.length > 0 && (
          <ul className="mb-2 space-y-1">
            {order.items.map((item, i) => (
              <li key={i} className="flex justify-between">
                <span>{item.name}</span>
                <span className="text-gray-500">× {item.quantity}</span>
              </li>
            ))}
          </ul>
        )}
        {order.deliverTo && (
          <p className="text-gray-500">
            Delivering to: <span className="text-gray-700">{order.deliverTo}</span>
          </p>
        )}
      </div>
    </div>
  );
}

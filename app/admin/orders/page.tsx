"use client";

import { useCallback, useEffect, useState } from "react";
import {
  OrderTracking,
  TRACKING_STATUSES,
  TRACKING_STATUS_LABELS,
  TrackingStatus,
  isValidConsignmentNo,
  normalizeConsignmentNo,
} from "@/lib/orders/tracking";

interface AdminOrder {
  _id: string;
  paymentId: string;
  orderId?: string;
  userInfo?: { name?: string; email?: string; phone?: string };
  shipping?: { name?: string; city?: string; state?: string; pin?: string };
  cart?: { name: string; quantity?: number }[];
  totalAmount?: number;
  createdAt?: string;
  tracking?: OrderTracking;
}

const STATUS_BADGE: Record<TrackingStatus, string> = {
  processing: "bg-gray-100 text-gray-700",
  shipped: "bg-blue-100 text-blue-700",
  in_transit: "bg-indigo-100 text-indigo-700",
  out_for_delivery: "bg-amber-100 text-amber-700",
  delivered: "bg-green-100 text-green-700",
  returned: "bg-red-100 text-red-700",
};

export default function AdminOrders() {
  const [orders, setOrders] = useState<AdminOrder[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<TrackingStatus | "all">("all");
  const [editing, setEditing] = useState<AdminOrder | null>(null);
  const [notice, setNotice] = useState("");

  const fetchOrders = useCallback(async () => {
    setIsLoading(true);
    try {
      const token = localStorage.getItem("adminToken");
      const params = new URLSearchParams();
      if (searchQuery.trim()) params.set("q", searchQuery.trim());
      if (statusFilter !== "all") params.set("status", statusFilter);
      const response = await fetch(`/api/admin/orders?${params}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await response.json();
      if (data.success) setOrders(data.orders);
    } catch (err) {
      console.error("Error fetching orders:", err);
    } finally {
      setIsLoading(false);
    }
  }, [searchQuery, statusFilter]);

  useEffect(() => {
    const t = setTimeout(fetchOrders, 300);
    return () => clearTimeout(t);
  }, [fetchOrders]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-800">Orders & Shipping</h1>
        <p className="text-sm text-gray-500">
          Add the India Post consignment number after booking, and update the status as it moves.
        </p>
      </div>

      {notice && (
        <p className="rounded-xl bg-amber-50 px-4 py-3 text-sm text-amber-700">{notice}</p>
      )}

      <div className="flex flex-col gap-3 sm:flex-row">
        <input
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search payment ID, name, email, phone, consignment no..."
          className="flex-1 rounded-xl border border-gray-200 bg-white px-4 py-2 text-sm focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-200"
        />
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value as TrackingStatus | "all")}
          className="rounded-xl border border-gray-200 bg-white px-4 py-2 text-sm"
        >
          <option value="all">All statuses</option>
          {TRACKING_STATUSES.map((s) => (
            <option key={s} value={s}>
              {TRACKING_STATUS_LABELS[s]}
            </option>
          ))}
        </select>
      </div>

      <div className="overflow-x-auto rounded-2xl bg-white shadow">
        <table className="w-full text-left text-sm">
          <thead className="bg-gray-50 text-xs uppercase text-gray-500">
            <tr>
              <th className="px-4 py-3">Date</th>
              <th className="px-4 py-3">Customer</th>
              <th className="px-4 py-3">Items</th>
              <th className="px-4 py-3">Deliver to</th>
              <th className="px-4 py-3">Amount</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Consignment</th>
              <th className="px-4 py-3"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {isLoading ? (
              <tr>
                <td colSpan={8} className="px-4 py-8 text-center text-gray-500">
                  Loading orders...
                </td>
              </tr>
            ) : orders.length === 0 ? (
              <tr>
                <td colSpan={8} className="px-4 py-8 text-center text-gray-500">
                  No orders found.
                </td>
              </tr>
            ) : (
              orders.map((order) => {
                const status = order.tracking?.status || "processing";
                return (
                  <tr key={order._id} className="hover:bg-gray-50">
                    <td className="whitespace-nowrap px-4 py-3 text-gray-600">
                      {order.createdAt
                        ? new Date(order.createdAt).toLocaleDateString("en-IN")
                        : "-"}
                    </td>
                    <td className="px-4 py-3">
                      <div className="font-medium text-gray-800">{order.userInfo?.name || "-"}</div>
                      <div className="text-xs text-gray-500">{order.userInfo?.phone}</div>
                      <div className="text-xs text-gray-400">{order.paymentId}</div>
                    </td>
                    <td className="px-4 py-3 text-gray-600">
                      {(order.cart || []).map((c) => `${c.name} ×${c.quantity ?? 1}`).join(", ")}
                    </td>
                    <td className="px-4 py-3 text-gray-600">
                      {[order.shipping?.city, order.shipping?.pin].filter(Boolean).join(" - ")}
                    </td>
                    <td className="whitespace-nowrap px-4 py-3">₹{order.totalAmount ?? "-"}</td>
                    <td className="px-4 py-3">
                      <span
                        className={`whitespace-nowrap rounded-full px-2 py-1 text-xs font-semibold ${STATUS_BADGE[status]}`}
                      >
                        {TRACKING_STATUS_LABELS[status]}
                      </span>
                    </td>
                    <td className="px-4 py-3 font-mono text-xs">
                      {order.tracking?.consignmentNo || "-"}
                    </td>
                    <td className="px-4 py-3">
                      <button
                        onClick={() => setEditing(order)}
                        className="rounded-lg bg-orange-500 px-3 py-1.5 text-xs font-semibold text-white hover:bg-orange-600"
                      >
                        Update
                      </button>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {editing && (
        <EditTrackingModal
          order={editing}
          onClose={() => setEditing(null)}
          onSaved={(tracking, emailFailed) => {
            setOrders((prev) => prev.map((o) => (o._id === editing._id ? { ...o, tracking } : o)));
            setNotice(
              emailFailed
                ? `Saved ${editing.paymentId}, but the shipping email could not be sent. Tick the box and save again to retry.`
                : ""
            );
            setEditing(null);
          }}
        />
      )}
    </div>
  );
}

function EditTrackingModal({
  order,
  onClose,
  onSaved,
}: {
  order: AdminOrder;
  onClose: () => void;
  onSaved: (tracking: OrderTracking, emailFailed: boolean) => void;
}) {
  const current = order.tracking;
  const [consignmentNo, setConsignmentNo] = useState(current?.consignmentNo || "");
  const [status, setStatus] = useState<TrackingStatus>(
    current?.status && current.status !== "processing" ? current.status : "shipped"
  );
  const [note, setNote] = useState("");
  const [notifyCustomer, setNotifyCustomer] = useState(!current?.shippedEmailSent);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState("");

  const normalized = normalizeConsignmentNo(consignmentNo);
  const formatWarning = normalized && !isValidConsignmentNo(normalized);

  const save = async () => {
    setIsSaving(true);
    setError("");
    try {
      const token = localStorage.getItem("adminToken");
      const res = await fetch("/api/admin/orders", {
        method: "PATCH",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({
          id: order._id,
          consignmentNo: normalized,
          status,
          note,
          notifyCustomer,
        }),
      });
      const data = await res.json();
      if (!data.success) {
        setError(data.error || "Failed to save");
        return;
      }
      const emailFailed =
        notifyCustomer && Boolean(normalized) && !current?.shippedEmailSent && !data.emailSent;
      onSaved(data.tracking, emailFailed);
    } catch {
      setError("Network error");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
      onClick={onClose}
    >
      <div
        className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-lg font-bold text-gray-800">Update shipping</h2>
        <p className="mb-4 text-xs text-gray-500">
          {order.userInfo?.name} · {order.paymentId}
        </p>

        <label className="mb-1 block text-sm font-semibold text-gray-700">
          India Post consignment no.
        </label>
        <input
          value={consignmentNo}
          onChange={(e) => setConsignmentNo(e.target.value)}
          placeholder="EE123456789IN"
          className="w-full rounded-xl border border-gray-300 px-4 py-2 font-mono uppercase focus:border-orange-500 focus:outline-none"
        />
        {formatWarning && (
          <p className="mt-1 text-xs text-red-600">Should be 2 letters + 9 digits + IN</p>
        )}

        <label className="mb-1 mt-4 block text-sm font-semibold text-gray-700">Status</label>
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value as TrackingStatus)}
          className="w-full rounded-xl border border-gray-300 px-4 py-2"
        >
          {TRACKING_STATUSES.map((s) => (
            <option key={s} value={s}>
              {TRACKING_STATUS_LABELS[s]}
            </option>
          ))}
        </select>

        <label className="mb-1 mt-4 block text-sm font-semibold text-gray-700">
          Note for customer (optional)
        </label>
        <input
          value={note}
          onChange={(e) => setNote(e.target.value)}
          placeholder="e.g. Reached Mumbai sorting hub"
          maxLength={300}
          className="w-full rounded-xl border border-gray-300 px-4 py-2 focus:border-orange-500 focus:outline-none"
        />

        <label className="mt-4 flex items-center gap-2 text-sm text-gray-700">
          <input
            type="checkbox"
            checked={notifyCustomer}
            disabled={current?.shippedEmailSent}
            onChange={(e) => setNotifyCustomer(e.target.checked)}
          />
          {current?.shippedEmailSent
            ? "Shipping email already sent"
            : `Email tracking number to ${order.userInfo?.email || "customer"}`}
        </label>

        {error && <p className="mt-3 text-sm text-red-600">{error}</p>}

        <div className="mt-6 flex justify-end gap-3">
          <button onClick={onClose} className="rounded-xl border border-gray-300 px-4 py-2 text-sm">
            Cancel
          </button>
          <button
            onClick={save}
            disabled={isSaving || Boolean(formatWarning)}
            className="rounded-xl bg-orange-500 px-4 py-2 text-sm font-semibold text-white hover:bg-orange-600 disabled:opacity-60"
          >
            {isSaving ? "Saving..." : "Save"}
          </button>
        </div>
      </div>
    </div>
  );
}

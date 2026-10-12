/**
 * Client-safe order tracking helpers (India Post), shared by the admin Orders page,
 * /api/admin/orders, /api/track-order and the public /track-order page.
 *
 * Tracking is entered manually by an admin after booking the parcel at the post office and is
 * stored on the order document as `tracking` (the existing `shipping` field is the delivery address).
 */

export const TRACKING_STATUSES = [
  "processing",
  "shipped",
  "in_transit",
  "out_for_delivery",
  "delivered",
  "returned",
] as const;

export type TrackingStatus = (typeof TRACKING_STATUSES)[number];

export const TRACKING_STATUS_LABELS: Record<TrackingStatus, string> = {
  processing: "Order placed",
  shipped: "Shipped",
  in_transit: "In transit",
  out_for_delivery: "Out for delivery",
  delivered: "Delivered",
  returned: "Returned to sender",
};

/** The happy-path steps shown on the customer timeline ("returned" is shown as a separate notice). */
export const TIMELINE_STEPS: TrackingStatus[] = [
  "processing",
  "shipped",
  "in_transit",
  "out_for_delivery",
  "delivered",
];

/**
 * India Post has no per-article deep link: the tracker lives on the homepage behind a CAPTCHA,
 * so customers copy the consignment number and paste it there.
 */
export const INDIA_POST_TRACKING_URL = "https://www.indiapost.gov.in/";

export interface TrackingHistoryEntry {
  status: TrackingStatus;
  note?: string;
  at: string | Date;
}

export interface OrderTracking {
  carrier: "indiapost";
  consignmentNo?: string;
  status: TrackingStatus;
  history: TrackingHistoryEntry[];
  shippedAt?: string | Date;
  deliveredAt?: string | Date;
  shippedEmailSent?: boolean;
  updatedAt?: string | Date;
}

export const isTrackingStatus = (value: unknown): value is TrackingStatus =>
  typeof value === "string" && (TRACKING_STATUSES as readonly string[]).includes(value);

/** "ee 123 456 789 in" -> "EE123456789IN" */
export const normalizeConsignmentNo = (value: string) => value.replace(/[\s-]/g, "").toUpperCase();

/** India Post article numbers: 2 letters + 9 digits + "IN", e.g. EE123456789IN. */
export const isValidConsignmentNo = (value: string) => /^[A-Z]{2}\d{9}IN$/.test(value);

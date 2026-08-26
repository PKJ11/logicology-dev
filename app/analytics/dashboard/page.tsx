"use client";

import React, { useState, useEffect } from "react";
import {
  Users,
  Eye,
  MousePointer,
  // Clock,
  // TrendingUp,
  Smartphone,
  Globe,
  // Send,
  RefreshCw,
  // AlertCircle,
  // CheckCircle,
  Download,
  Calendar,
  BarChart3,
  Activity,
  Target,
  ShoppingBag,
  IndianRupee,
  Gift,
} from "lucide-react";

// ── Logicology brand palette (tailwind.config.ts -> theme.colors.brand) ──────
const BRAND = {
  black: "#3d3b40",
  teal: "#0A8A80",
  tealDark: "#0B3F44",
  coral: "#E45C48",
  gold: "#D8AE4F",
  purple: "#5869b2",
  grayBg: "#F5F6F7",
};

interface AnalyticsData {
  totalUsers: number;
  totalSessions: number;
  pageViews: number;
  avgSessionDuration: number;
  bounceRate: number;
  topPages: Array<{ pageTitle: string; pageViews: number }>;
  topCountries: Array<{ country: string; sessions: number }>;
  devices: Array<{ device: string; sessions: number }>;
  realTimeUsers: number;
  userEvents: Array<{ eventName: string; eventCount: number; userCount: number }>;
  conversionRate: number;
  dateRange: { startDate: string; endDate: string };
}

interface MetaPixelData {
  pixelId: string;
  totalFires: number;
  events: Array<{ eventName: string; count: number }>;
}

interface OrderRow {
  id: string;
  paymentId: string;
  orderId: string;
  customerName: string;
  email: string;
  totalAmount: number;
  itemCount: number;
  isGift: boolean;
  createdAt: string;
}

export default function AnalyticsDashboard() {
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  // const [sendingToWhatsApp, setSendingToWhatsApp] = useState(false);
  const [dateRange, setDateRange] = useState<"today" | "yesterday" | "7days" | "30days" | "90days">(
    "7days"
  );
  // const [whatsappNumber] = useState<string>("7756916144");
  // const [whatsappStatus, setWhatsappStatus] = useState<{
  //   sending: boolean;
  //   success: boolean;
  //   message: string;
  // } | null>(null);
  const [error, setError] = useState<string>("");
  const [metaPixelData, setMetaPixelData] = useState<MetaPixelData | null>(null);
  const [metaPixelIsSample, setMetaPixelIsSample] = useState(false);
  const [orders, setOrders] = useState<OrderRow[]>([]);
  const [ordersRevenue, setOrdersRevenue] = useState(0);
  const [ordersLoading, setOrdersLoading] = useState(true);

  useEffect(() => {
    fetchAnalyticsData();
    fetchMetaPixelData();
  }, [dateRange]);

  // Orders aren't tied to the GA date-range picker — many order documents
  // predate the createdAt field, so we just show the most recent N instead
  // of filtering by date. Fetched once on mount and again on manual refresh.
  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchAnalyticsData = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await fetch(`/api/analytics/data?range=${dateRange}`);
      const data = await response.json();

      if (data.success) {
        setAnalyticsData(data.data);
      } else {
        setError(data.error || "Failed to fetch Google Analytics data");
        setAnalyticsData(null);
      }
    } catch (error: any) {
      console.error("Error fetching analytics:", error);
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const fetchMetaPixelData = async () => {
    try {
      const response = await fetch(`/api/analytics/meta-pixel?range=${dateRange}`);
      const data = await response.json();
      setMetaPixelData(data.data || null);
      setMetaPixelIsSample(!!data.sample);
    } catch (error) {
      console.error("Error fetching Meta Pixel data:", error);
      setMetaPixelIsSample(false);
    }
  };

  const fetchOrders = async () => {
    try {
      setOrdersLoading(true);
      const response = await fetch(`/api/analytics/orders?limit=7`);
      const data = await response.json();
      setOrders(data.data || []);
      setOrdersRevenue(data.totalRevenue || 0);
    } catch (error) {
      console.error("Error fetching orders:", error);
    } finally {
      setOrdersLoading(false);
    }
  };

  // WhatsApp send-to-admin is disabled here; the live implementation lives in
  // app/api/analytics/send-whatsapp/route.ts, which uses the ANALYTICS_REPORT
  // template via lib/notifications/whatsapp-service.ts.

  const exportToCSV = () => {
    if (!analyticsData) return;

    const csvContent = [
      ["Google Analytics Report", ""],
      ["Period", formatDateRange(analyticsData.dateRange)],
      ["Generated", new Date().toISOString()],
      [],
      ["METRIC", "VALUE"],
      ["Total Users", analyticsData.totalUsers],
      ["Total Sessions", analyticsData.totalSessions],
      ["Page Views", analyticsData.pageViews],
      [],
      ["TOP PAGES", "PAGE VIEWS"],
      ...analyticsData.topPages.map((p) => [p.pageTitle, p.pageViews]),
      [],
      ["TOP COUNTRIES", "SESSIONS"],
      ...analyticsData.topCountries.map((c) => [c.country, c.sessions]),
      [],
      ["DEVICES", "SESSIONS"],
      ...analyticsData.devices.map((d) => [d.device, d.sessions]),
    ]
      .map((row) => row.join(","))
      .join("\n");

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `analytics-${dateRange}-${new Date().toISOString().split("T")[0]}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const formatDateRange = (dateRange: { startDate: string; endDate: string }) => {
    const start = new Date(dateRange.startDate);
    const end = new Date(dateRange.endDate);
    return `${start.toLocaleDateString("en-IN", { day: "numeric", month: "short" })} – ${end.toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}`;
  };

  // const formatDuration = (seconds: number) => {
  //   const minutes = Math.floor(seconds / 60);
  //   const remainingSeconds = Math.floor(seconds % 60);
  //   return `${minutes}m ${remainingSeconds}s`;
  // };

  const dateRangeOptions = [
    { value: "today", label: "Today" },
    { value: "yesterday", label: "Yesterday" },
    { value: "7days", label: "7 Days" },
    { value: "30days", label: "30 Days" },
    { value: "90days", label: "90 Days" },
  ];

  if (loading) {
    return (
      <div
        className="flex min-h-screen items-center justify-center"
        style={{ background: BRAND.grayBg }}
      >
        <div className="text-center">
          <div
            className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl"
            style={{ background: BRAND.tealDark }}
          >
            <RefreshCw className="h-8 w-8 animate-spin text-white" />
          </div>
          <p
            className="text-sm font-medium uppercase tracking-widest"
            style={{ color: "#6B7280", letterSpacing: "0.12em" }}
          >
            Fetching analytics
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen" style={{ background: BRAND.grayBg }}>
      {/* ── Top Nav Bar ───────────────────────────────────────────────────── */}
      <header
        style={{
          background: `linear-gradient(135deg, ${BRAND.tealDark} 0%, #0A5A56 100%)`,
          borderBottom: `1px solid rgba(255,255,255,0.08)`,
        }}
      >
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-3">
            <div
              className="flex h-9 w-9 items-center justify-center rounded-lg"
              style={{ background: BRAND.teal }}
            >
              <BarChart3 className="h-5 w-5 text-white" />
            </div>
            <div>
              <h1 className="text-base font-semibold leading-none text-white">Analytics</h1>
              <p className="mt-0.5 text-xs" style={{ color: "rgba(255,255,255,0.6)" }}>
                Logicology Dashboard
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={exportToCSV}
              className="flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-colors hover:bg-white/[0.14]"
              style={{
                background: "rgba(255,255,255,0.08)",
                color: "rgba(255,255,255,0.9)",
                border: "1px solid rgba(255,255,255,0.16)",
              }}
            >
              <Download className="h-4 w-4" />
              Export CSV
            </button>
            <button
              onClick={() => {
                fetchAnalyticsData();
                fetchMetaPixelData();
                fetchOrders();
              }}
              className="flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium text-white transition-colors hover:opacity-90"
              style={{ background: BRAND.teal }}
            >
              <RefreshCw className="h-4 w-4" />
              Refresh
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-6 py-8">
        {/* ── Date Range + Period ───────────────────────────────────────────── */}
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-2" style={{ color: "#6B7280" }}>
            <Calendar className="h-4 w-4" />
            {analyticsData ? (
              <span className="text-sm font-medium">
                {formatDateRange(analyticsData.dateRange)}
              </span>
            ) : (
              <span className="text-sm">Select a range</span>
            )}
          </div>

          <div
            className="flex items-center gap-1 rounded-xl p-1"
            style={{ background: "#EDF3F2", border: "1px solid #DCEAE8" }}
          >
            {dateRangeOptions.map((opt) => (
              <button
                key={opt.value}
                onClick={() => setDateRange(opt.value as any)}
                className="rounded-lg px-4 py-1.5 text-sm font-medium transition-all"
                style={
                  dateRange === opt.value
                    ? {
                        background: BRAND.tealDark,
                        color: "#fff",
                        boxShadow: "0 1px 4px rgba(11,63,68,0.28)",
                      }
                    : { color: "#5C6B6A" }
                }
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>

        {/* ── Error Banner ─────────────────────────────────────────────────── */}
        {error && (
          <div
            className="mb-6 flex items-start gap-3 rounded-xl px-5 py-4 text-sm"
            style={{ background: "#FEF2F2", border: "1px solid #FECACA", color: "#991B1B" }}
          >
            <Activity className="mt-0.5 h-4 w-4 shrink-0" />
            <div>
              <p className="font-semibold">Google Analytics data unavailable</p>
              <p className="mt-0.5" style={{ color: "#B91C1C" }}>
                {error}
              </p>
            </div>
          </div>
        )}

        {/* ─── WhatsApp Section (commented out) ───────────────────────────── */}
        {/* <div className="mb-8 rounded-xl bg-white p-6 shadow">
          <div className="mb-6 flex items-center justify-between">
            <h2 className="text-xl font-semibold text-gray-900">Send to WhatsApp</h2>
            <div className="flex items-center space-x-4">
              <div className="rounded-lg bg-gray-100 px-3 py-1 text-sm text-gray-600">
                📱 {whatsappNumber}
              </div>
              <button
                onClick={sendToWhatsApp}
                disabled={sendingToWhatsApp || !analyticsData}
                className="flex items-center rounded-lg bg-green-600 px-6 py-2 text-white hover:bg-green-700 disabled:opacity-50"
              >
                <Send className="mr-2 h-4 w-4" />
                {sendingToWhatsApp ? "Sending..." : "Send Report"}
              </button>
            </div>
          </div>
          {whatsappStatus && (
            <div className={`mb-4 rounded-lg p-4 ${whatsappStatus.success ? "border border-green-200 bg-green-50 text-green-700" : "border border-red-200 bg-red-50 text-red-700"}`}>
              <div className="flex items-center">
                {whatsappStatus.success ? <CheckCircle className="mr-2 h-5 w-5" /> : <AlertCircle className="mr-2 h-5 w-5" />}
                {whatsappStatus.message}
              </div>
            </div>
          )}
        </div> */}

        <>
          {/* ── KPI Cards ───────────────────────────────────────────────── */}
          <div className="mb-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {/* Total Users */}
            <div
              className="flex items-center gap-5 rounded-2xl p-6"
              style={{
                background: "#fff",
                border: "1px solid #E6E9E8",
                boxShadow: "0 1px 3px rgba(11,63,68,0.06)",
              }}
            >
              <div
                className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl"
                style={{ background: "rgba(10,138,128,0.10)" }}
              >
                <Users className="h-6 w-6" style={{ color: BRAND.teal }} />
              </div>
              <div>
                <p
                  className="mb-1 text-xs font-semibold uppercase tracking-widest"
                  style={{ color: "#9CA3AF", letterSpacing: "0.1em" }}
                >
                  Total Users
                </p>
                <p
                  className="text-3xl font-bold leading-none"
                  style={{ color: analyticsData ? BRAND.black : "#D8DCDB" }}
                >
                  {analyticsData ? analyticsData.totalUsers.toLocaleString() : "—"}
                </p>
              </div>
            </div>

            {/* Total Sessions */}
            <div
              className="flex items-center gap-5 rounded-2xl p-6"
              style={{
                background: "#fff",
                border: "1px solid #E6E9E8",
                boxShadow: "0 1px 3px rgba(11,63,68,0.06)",
              }}
            >
              <div
                className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl"
                style={{ background: "rgba(216,174,79,0.16)" }}
              >
                <Eye className="h-6 w-6" style={{ color: "#B8860B" }} />
              </div>
              <div>
                <p
                  className="mb-1 text-xs font-semibold uppercase tracking-widest"
                  style={{ color: "#9CA3AF", letterSpacing: "0.1em" }}
                >
                  Total Sessions
                </p>
                <p
                  className="text-3xl font-bold leading-none"
                  style={{ color: analyticsData ? BRAND.black : "#D8DCDB" }}
                >
                  {analyticsData ? analyticsData.totalSessions.toLocaleString() : "—"}
                </p>
              </div>
            </div>

            {/* Page Views */}
            <div
              className="flex items-center gap-5 rounded-2xl p-6"
              style={{
                background: "#fff",
                border: "1px solid #E6E9E8",
                boxShadow: "0 1px 3px rgba(11,63,68,0.06)",
              }}
            >
              <div
                className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl"
                style={{ background: "rgba(88,105,178,0.10)" }}
              >
                <MousePointer className="h-6 w-6" style={{ color: BRAND.purple }} />
              </div>
              <div>
                <p
                  className="mb-1 text-xs font-semibold uppercase tracking-widest"
                  style={{ color: "#9CA3AF", letterSpacing: "0.1em" }}
                >
                  Page Views
                </p>
                <p
                  className="text-3xl font-bold leading-none"
                  style={{ color: analyticsData ? BRAND.black : "#D8DCDB" }}
                >
                  {analyticsData ? analyticsData.pageViews.toLocaleString() : "—"}
                </p>
              </div>
            </div>

            {/* Orders Revenue */}
            <div
              className="flex items-center gap-5 rounded-2xl p-6"
              style={{
                background: "#fff",
                border: "1px solid #E6E9E8",
                boxShadow: "0 1px 3px rgba(11,63,68,0.06)",
              }}
            >
              <div
                className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl"
                style={{ background: "rgba(228,92,72,0.10)" }}
              >
                <IndianRupee className="h-6 w-6" style={{ color: BRAND.coral }} />
              </div>
              <div>
                <p
                  className="mb-1 text-xs font-semibold uppercase tracking-widest"
                  style={{ color: "#9CA3AF", letterSpacing: "0.1em" }}
                >
                  Orders Revenue
                </p>
                <p className="text-3xl font-bold leading-none" style={{ color: BRAND.black }}>
                  ₹{ordersRevenue.toLocaleString("en-IN")}
                </p>
              </div>
            </div>

            {/* Removed: Conversion Rate, Avg Session Duration, Bounce Rate, Real-time Users */}
          </div>

          {/* ── Tables Row ──────────────────────────────────────────────── */}
          <div className="mb-6 grid grid-cols-1 gap-6 lg:grid-cols-2">
            {/* Top Pages */}
            <div
              className="overflow-hidden rounded-2xl"
              style={{
                background: "#fff",
                border: "1px solid #E6E9E8",
                boxShadow: "0 1px 3px rgba(11,63,68,0.06)",
              }}
            >
              <div
                className="flex items-center gap-3 px-6 py-4"
                style={{ borderBottom: "1px solid #F1F3F2" }}
              >
                <BarChart3 className="h-4 w-4" style={{ color: BRAND.teal }} />
                <div>
                  <h3 className="text-sm font-semibold" style={{ color: BRAND.black }}>
                    Top Pages
                  </h3>
                  <p className="text-xs" style={{ color: "#9CA3AF" }}>
                    Most viewed pages
                  </p>
                </div>
              </div>
              <div className="divide-y" style={{ borderColor: BRAND.grayBg }}>
                {!analyticsData ? (
                  <div className="px-6 py-8 text-center text-sm" style={{ color: "#9CA3AF" }}>
                    Google Analytics data unavailable
                  </div>
                ) : (
                  analyticsData.topPages.map((page, index) => (
                    <div key={index} className="flex items-center justify-between px-6 py-3">
                      <div className="flex min-w-0 items-center gap-3">
                        <span
                          className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md text-xs font-bold"
                          style={{ background: "rgba(10,138,128,0.10)", color: BRAND.teal }}
                        >
                          {index + 1}
                        </span>
                        <p className="truncate text-sm font-medium" style={{ color: "#374151" }}>
                          {page.pageTitle.length > 48
                            ? page.pageTitle.substring(0, 45) + "…"
                            : page.pageTitle}
                        </p>
                      </div>
                      <span
                        className="ml-4 shrink-0 text-sm font-semibold tabular-nums"
                        style={{ color: BRAND.black }}
                      >
                        {page.pageViews.toLocaleString()}
                      </span>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Top Countries */}
            <div
              className="overflow-hidden rounded-2xl"
              style={{
                background: "#fff",
                border: "1px solid #E6E9E8",
                boxShadow: "0 1px 3px rgba(11,63,68,0.06)",
              }}
            >
              <div
                className="flex items-center gap-3 px-6 py-4"
                style={{ borderBottom: "1px solid #F1F3F2" }}
              >
                <Globe className="h-4 w-4" style={{ color: BRAND.coral }} />
                <div>
                  <h3 className="text-sm font-semibold" style={{ color: BRAND.black }}>
                    Top Countries
                  </h3>
                  <p className="text-xs" style={{ color: "#9CA3AF" }}>
                    Visitor geography
                  </p>
                </div>
              </div>
              <div className="divide-y" style={{ borderColor: BRAND.grayBg }}>
                {!analyticsData ? (
                  <div className="px-6 py-8 text-center text-sm" style={{ color: "#9CA3AF" }}>
                    Google Analytics data unavailable
                  </div>
                ) : (
                  analyticsData.topCountries.map((country, index) => (
                    <div key={index} className="flex items-center justify-between px-6 py-3">
                      <div className="flex items-center gap-3">
                        <span
                          className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md text-xs font-bold"
                          style={{ background: "rgba(228,92,72,0.10)", color: BRAND.coral }}
                        >
                          {index + 1}
                        </span>
                        <p className="text-sm font-medium" style={{ color: "#374151" }}>
                          {country.country}
                        </p>
                      </div>
                      <span
                        className="text-sm font-semibold tabular-nums"
                        style={{ color: BRAND.black }}
                      >
                        {country.sessions.toLocaleString()}
                      </span>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>

          {/* ── Bottom Row ──────────────────────────────────────────────── */}
          <div className="mb-6 grid grid-cols-1 gap-6 lg:grid-cols-3">
            {/* Device Distribution */}
            <div
              className="overflow-hidden rounded-2xl"
              style={{
                background: "#fff",
                border: "1px solid #E6E9E8",
                boxShadow: "0 1px 3px rgba(11,63,68,0.06)",
              }}
            >
              <div
                className="flex items-center gap-3 px-6 py-4"
                style={{ borderBottom: "1px solid #F1F3F2" }}
              >
                <Smartphone className="h-4 w-4" style={{ color: BRAND.tealDark }} />
                <div>
                  <h3 className="text-sm font-semibold" style={{ color: BRAND.black }}>
                    Device Distribution
                  </h3>
                  <p className="text-xs" style={{ color: "#9CA3AF" }}>
                    How users access your site
                  </p>
                </div>
              </div>
              <div className="divide-y" style={{ borderColor: BRAND.grayBg }}>
                {!analyticsData ? (
                  <div className="px-6 py-8 text-center text-sm" style={{ color: "#9CA3AF" }}>
                    Google Analytics data unavailable
                  </div>
                ) : (
                  analyticsData.devices.map((device, index) => {
                    const pct = ((device.sessions / analyticsData.totalSessions) * 100).toFixed(1);
                    const barColor =
                      index === 0 ? BRAND.teal : index === 1 ? BRAND.coral : BRAND.gold;
                    return (
                      <div key={index} className="px-6 py-3">
                        <div className="mb-1.5 flex items-center justify-between">
                          <p className="text-sm font-medium" style={{ color: "#374151" }}>
                            {device.device}
                          </p>
                          <div className="flex items-center gap-3">
                            <span
                              className="text-sm font-semibold tabular-nums"
                              style={{ color: BRAND.black }}
                            >
                              {device.sessions.toLocaleString()}
                            </span>
                            <span
                              className="w-10 text-right text-xs font-medium tabular-nums"
                              style={{ color: "#9CA3AF" }}
                            >
                              {pct}%
                            </span>
                          </div>
                        </div>
                        <div className="h-1.5 w-full rounded-full" style={{ background: "#F1F3F2" }}>
                          <div
                            className="h-1.5 rounded-full"
                            style={{ width: `${pct}%`, background: barColor }}
                          />
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>

            {/* User Events */}
            <div
              className="overflow-hidden rounded-2xl"
              style={{
                background: "#fff",
                border: "1px solid #E6E9E8",
                boxShadow: "0 1px 3px rgba(11,63,68,0.06)",
              }}
            >
              <div
                className="flex items-center gap-3 px-6 py-4"
                style={{ borderBottom: "1px solid #F1F3F2" }}
              >
                <Activity className="h-4 w-4" style={{ color: BRAND.purple }} />
                <div>
                  <h3 className="text-sm font-semibold" style={{ color: BRAND.black }}>
                    User Events
                  </h3>
                  <p className="text-xs" style={{ color: "#9CA3AF" }}>
                    Tracked interactions
                  </p>
                </div>
              </div>
              <div className="divide-y" style={{ borderColor: BRAND.grayBg }}>
                {!analyticsData ? (
                  <div className="px-6 py-8 text-center text-sm" style={{ color: "#9CA3AF" }}>
                    Google Analytics data unavailable
                  </div>
                ) : (
                  analyticsData.userEvents.map((event, index) => (
                    <div key={index} className="flex items-center justify-between px-6 py-3">
                      <div className="flex items-center gap-3">
                        <span
                          className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md text-xs font-bold"
                          style={{ background: "rgba(88,105,178,0.10)", color: BRAND.purple }}
                        >
                          {index + 1}
                        </span>
                        <div>
                          <p className="text-sm font-medium" style={{ color: "#374151" }}>
                            {event.eventName}
                          </p>
                          <p className="text-xs" style={{ color: "#9CA3AF" }}>
                            {event.userCount.toLocaleString()} users
                          </p>
                        </div>
                      </div>
                      <span
                        className="text-sm font-semibold tabular-nums"
                        style={{ color: BRAND.black }}
                      >
                        {event.eventCount.toLocaleString()}
                      </span>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Meta Pixel Events */}
            <div
              className="overflow-hidden rounded-2xl"
              style={{
                background: "#fff",
                border: "1px solid #E6E9E8",
                boxShadow: "0 1px 3px rgba(11,63,68,0.06)",
              }}
            >
              <div
                className="flex items-center justify-between gap-3 px-6 py-4"
                style={{ borderBottom: "1px solid #F1F3F2" }}
              >
                <div className="flex items-center gap-3">
                  <Target className="h-4 w-4" style={{ color: "#1877F2" }} />
                  <div>
                    <h3 className="text-sm font-semibold" style={{ color: BRAND.black }}>
                      Meta Pixel Events
                    </h3>
                    <p className="text-xs" style={{ color: "#9CA3AF" }}>
                      {metaPixelData
                        ? `${metaPixelData.totalFires.toLocaleString()} total fires`
                        : "Facebook / Instagram pixel activity"}
                    </p>
                  </div>
                </div>
                {metaPixelIsSample && (
                  <span
                    className="shrink-0 rounded-md px-2 py-1 text-xs font-semibold uppercase tracking-wide"
                    style={{ background: "#FEF3C7", color: "#92400E" }}
                    title="The Meta Graph API call failed, so this is fallback sample data, not real pixel activity."
                  >
                    Dummy Data
                  </span>
                )}
              </div>
              <div className="divide-y" style={{ borderColor: BRAND.grayBg }}>
                {metaPixelIsSample && (
                  <div className="px-6 py-2 text-xs" style={{ background: "#FFFBEB", color: "#92400E" }}>
                    Showing sample data — Meta Graph API request failed.
                  </div>
                )}
                {metaPixelData && metaPixelData.events.length > 0 ? (
                  metaPixelData.events.map((event, index) => (
                    <div key={index} className="flex items-center justify-between px-6 py-3">
                      <div className="flex items-center gap-3">
                        <span
                          className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md text-xs font-bold"
                          style={{ background: "#EFF6FF", color: "#1877F2" }}
                        >
                          {index + 1}
                        </span>
                        <p className="text-sm font-medium" style={{ color: "#374151" }}>
                          {event.eventName}
                        </p>
                      </div>
                      <span
                        className="text-sm font-semibold tabular-nums"
                        style={{ color: BRAND.black }}
                      >
                        {event.count.toLocaleString()}
                      </span>
                    </div>
                  ))
                ) : (
                  <div className="px-6 py-8 text-center text-sm" style={{ color: "#9CA3AF" }}>
                    No pixel data for this period
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* ── Recent Orders ───────────────────────────────────────────── */}
          <div
            className="overflow-hidden rounded-2xl"
            style={{
              background: "#fff",
              border: "1px solid #E6E9E8",
              boxShadow: "0 1px 3px rgba(11,63,68,0.06)",
            }}
          >
            <div
              className="flex items-center justify-between gap-3 px-6 py-4"
              style={{ borderBottom: "1px solid #F1F3F2" }}
            >
              <div className="flex items-center gap-3">
                <ShoppingBag className="h-4 w-4" style={{ color: BRAND.coral }} />
                <div>
                  <h3 className="text-sm font-semibold" style={{ color: BRAND.black }}>
                    Recent Orders
                  </h3>
                  <p className="text-xs" style={{ color: "#9CA3AF" }}>
                    Most recent checkouts
                  </p>
                </div>
              </div>
              <span
                className="rounded-md px-2.5 py-1 text-xs font-semibold"
                style={{ background: BRAND.grayBg, color: "#6B7280" }}
              >
                {orders.length} orders
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr style={{ background: BRAND.grayBg }}>
                    {["Payment ID", "Customer", "Email", "Items", "Amount", "Date"].map((head) => (
                      <th
                        key={head}
                        className="whitespace-nowrap px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider"
                        style={{ color: "#9CA3AF", letterSpacing: "0.06em" }}
                      >
                        {head}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y" style={{ borderColor: BRAND.grayBg }}>
                  {ordersLoading ? (
                    <tr>
                      <td colSpan={6} className="px-6 py-8 text-center" style={{ color: "#9CA3AF" }}>
                        Loading orders…
                      </td>
                    </tr>
                  ) : orders.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="px-6 py-8 text-center" style={{ color: "#9CA3AF" }}>
                        No orders yet
                      </td>
                    </tr>
                  ) : (
                    orders.map((order) => (
                      <tr key={order.id}>
                        <td className="whitespace-nowrap px-6 py-3 font-medium" style={{ color: "#374151" }}>
                          {order.paymentId}
                        </td>
                        <td className="whitespace-nowrap px-6 py-3" style={{ color: "#374151" }}>
                          <span className="inline-flex items-center gap-1.5">
                            {order.customerName}
                            {order.isGift && (
                              <Gift className="h-3.5 w-3.5" style={{ color: BRAND.purple }} />
                            )}
                          </span>
                        </td>
                        <td className="whitespace-nowrap px-6 py-3" style={{ color: "#6B7280" }}>
                          {order.email}
                        </td>
                        <td className="whitespace-nowrap px-6 py-3 tabular-nums" style={{ color: "#6B7280" }}>
                          {order.itemCount}
                        </td>
                        <td
                          className="whitespace-nowrap px-6 py-3 font-semibold tabular-nums"
                          style={{ color: BRAND.black }}
                        >
                          ₹{order.totalAmount.toLocaleString("en-IN")}
                        </td>
                        <td className="whitespace-nowrap px-6 py-3" style={{ color: "#9CA3AF" }}>
                          {order.createdAt
                            ? new Date(order.createdAt).toLocaleDateString("en-IN", {
                                day: "numeric",
                                month: "short",
                                hour: "2-digit",
                                minute: "2-digit",
                              })
                            : "-"}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </>
      </main>
    </div>
  );
}

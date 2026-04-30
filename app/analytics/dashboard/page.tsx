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
} from "lucide-react";

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

  useEffect(() => {
    fetchAnalyticsData();
  }, [dateRange]);

  const fetchAnalyticsData = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await fetch(`/api/analytics/data?range=${dateRange}`);
      const data = await response.json();

      if (data.success) {
        setAnalyticsData(data.data);
      } else {
        setError(data.error || "Failed to fetch analytics");
        if (data.sample) {
          setAnalyticsData(data.data);
        }
      }
    } catch (error: any) {
      console.error("Error fetching analytics:", error);
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // ─── WhatsApp messaging function (commented out) ───────────────────────────
  // const sendInteraktWhatsAppMessage = async (
  //   phoneNumber: string,
  //   analyticsData: any,
  //   userName: string = "Logicology Admin",
  //   userEmail: string = "admin@logicology.in"
  // ) => {
  //   try {
  //     const INTERAKT_API_KEY = "QTc1emFobGthSVpxRGp1aWtRNE5aaDdCU0xGNFk5LXRFZ3ZXYkRySDZjbzo=";
  //     let cleanedPhoneNumber = phoneNumber.replace(/\D/g, "");
  //     if (cleanedPhoneNumber.startsWith("91") && cleanedPhoneNumber.length === 12) {
  //       cleanedPhoneNumber = cleanedPhoneNumber.substring(2);
  //     } else if (cleanedPhoneNumber.startsWith("+91")) {
  //       cleanedPhoneNumber = cleanedPhoneNumber.substring(3);
  //     }
  //     if (cleanedPhoneNumber.length !== 10) throw new Error("Invalid phone number format");
  //     const countryCode = "+91";
  //     const dateText = formatDateRange(analyticsData.dateRange);
  //     const templateValues = [
  //       userName,
  //       dateText,
  //       analyticsData.totalUsers.toLocaleString(),
  //       analyticsData.totalSessions.toLocaleString(),
  //       analyticsData.pageViews.toLocaleString(),
  //       analyticsData.conversionRate?.toFixed(1) || "0",
  //     ];
  //     const trackUserResponse = await fetch("https://api.interakt.ai/v1/public/track/users/", {
  //       method: "POST",
  //       headers: { Authorization: `Basic ${INTERAKT_API_KEY}`, "Content-Type": "application/json" },
  //       body: JSON.stringify({
  //         phoneNumber: cleanedPhoneNumber,
  //         countryCode,
  //         traits: { name: userName, email: userEmail, lastAnalyticsDate: new Date().toISOString(), userType: "admin", totalReports: 1 },
  //       }),
  //     });
  //     const trackUserResult = await trackUserResponse.json();
  //     const messageResponse = await fetch("https://api.interakt.ai/v1/public/message/", {
  //       method: "POST",
  //       headers: { Authorization: `Basic ${INTERAKT_API_KEY}`, "Content-Type": "application/json" },
  //       body: JSON.stringify({
  //         countryCode,
  //         phoneNumber: cleanedPhoneNumber,
  //         type: "Template",
  //         template: { name: "analytics_report", languageCode: "en", bodyValues: templateValues },
  //       }),
  //     });
  //     const messageResult = await messageResponse.json();
  //     if (!messageResult.id) throw new Error(`Failed to send WhatsApp message: ${JSON.stringify(messageResult)}`);
  //     return { userTracked: trackUserResult.result || false, messageSent: true, messageId: messageResult.id, phoneNumber: `+91${cleanedPhoneNumber}` };
  //   } catch (error: any) {
  //     return { userTracked: false, messageSent: false, messageId: null, error: error.message || "Unknown error" };
  //   }
  // };

  // const sendToWhatsApp = async () => {
  //   if (!analyticsData) return;
  //   setSendingToWhatsApp(true);
  //   setWhatsappStatus({ sending: true, success: false, message: "Sending to WhatsApp..." });
  //   try {
  //     const phoneNumbers = ["7756916144", "8080661208", "9860265047"];
  //     const results = [];
  //     for (const phoneNumber of phoneNumbers) {
  //       try {
  //         const result = await sendInteraktWhatsAppMessage(phoneNumber, analyticsData, "Logicology Admin", "admin@logicology.in");
  //         results.push({ phoneNumber, success: result.messageSent, messageId: result.messageId, error: result.error });
  //         await new Promise((resolve) => setTimeout(resolve, 500));
  //       } catch (error: any) {
  //         results.push({ phoneNumber, success: false, error: error.message });
  //       }
  //     }
  //     const successfulSends = results.filter((r) => r.success);
  //     const failedSends = results.filter((r) => !r.success);
  //     if (successfulSends.length === phoneNumbers.length) {
  //       setWhatsappStatus({ sending: false, success: true, message: `✅ Analytics report sent to ${successfulSends.length} numbers successfully!` });
  //     } else if (successfulSends.length > 0) {
  //       setWhatsappStatus({ sending: false, success: true, message: `✅ Sent to ${successfulSends.length}/${phoneNumbers.length} numbers. Failed: ${failedSends.map((f) => f.phoneNumber).join(", ")}` });
  //     } else {
  //       setWhatsappStatus({ sending: false, success: false, message: `❌ Failed to send to all numbers.` });
  //     }
  //   } catch (error: any) {
  //     setWhatsappStatus({ sending: false, success: false, message: `❌ Error: ${error.message}` });
  //   } finally {
  //     setSendingToWhatsApp(false);
  //   }
  // };
  // ───────────────────────────────────────────────────────────────────────────

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
      <div className="flex min-h-screen items-center justify-center" style={{ background: "#F8F9FC" }}>
        <div className="text-center">
          <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl" style={{ background: "#1A1F36" }}>
            <RefreshCw className="h-8 w-8 animate-spin text-white" />
          </div>
          <p className="text-sm font-medium tracking-widest uppercase" style={{ color: "#6B7280", letterSpacing: "0.12em" }}>
            Fetching analytics
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen" style={{ background: "#F8F9FC", fontFamily: "'Inter', sans-serif" }}>

      {/* ── Top Nav Bar ───────────────────────────────────────────────────── */}
      <header style={{ background: "#1A1F36", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
        <div className="mx-auto max-w-7xl px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg" style={{ background: "#3B5BDB" }}>
              <BarChart3 className="h-5 w-5 text-white" />
            </div>
            <div>
              <h1 className="text-base font-semibold text-white leading-none">Analytics</h1>
              <p className="text-xs mt-0.5" style={{ color: "#8892B0" }}>Logicology Dashboard</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={exportToCSV}
              className="flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-all"
              style={{ background: "rgba(255,255,255,0.08)", color: "#CCD6F6", border: "1px solid rgba(255,255,255,0.1)" }}
            >
              <Download className="h-4 w-4" />
              Export CSV
            </button>
            <button
              onClick={fetchAnalyticsData}
              className="flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-all"
              style={{ background: "#3B5BDB", color: "#fff" }}
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
              <span className="text-sm font-medium">{formatDateRange(analyticsData.dateRange)}</span>
            ) : (
              <span className="text-sm">Select a range</span>
            )}
          </div>

          <div className="flex items-center gap-1 rounded-xl p-1" style={{ background: "#EAECF4", border: "1px solid #D1D5E8" }}>
            {dateRangeOptions.map((opt) => (
              <button
                key={opt.value}
                onClick={() => setDateRange(opt.value as any)}
                className="rounded-lg px-4 py-1.5 text-sm font-medium transition-all"
                style={
                  dateRange === opt.value
                    ? { background: "#1A1F36", color: "#fff", boxShadow: "0 1px 4px rgba(0,0,0,0.18)" }
                    : { color: "#6B7280" }
                }
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>

        {/* ── Error Banner ─────────────────────────────────────────────────── */}
        {error && (
          <div className="mb-6 flex items-start gap-3 rounded-xl px-5 py-4 text-sm" style={{ background: "#FFF7ED", border: "1px solid #FDE68A", color: "#92400E" }}>
            <Activity className="mt-0.5 h-4 w-4 shrink-0" />
            {error}
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

        {analyticsData && (
          <>
            {/* ── KPI Cards ───────────────────────────────────────────────── */}
            <div className="mb-8 grid grid-cols-1 gap-5 sm:grid-cols-3">
              {/* Total Users */}
              <div className="rounded-2xl p-6 flex items-center gap-5" style={{ background: "#fff", border: "1px solid #E5E8F0", boxShadow: "0 1px 3px rgba(0,0,0,0.05)" }}>
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl" style={{ background: "#EEF2FF" }}>
                  <Users className="h-6 w-6" style={{ color: "#3B5BDB" }} />
                </div>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-widest mb-1" style={{ color: "#9CA3AF", letterSpacing: "0.1em" }}>Total Users</p>
                  <p className="text-3xl font-bold leading-none" style={{ color: "#1A1F36" }}>
                    {analyticsData.totalUsers.toLocaleString()}
                  </p>
                </div>
              </div>

              {/* Total Sessions */}
              <div className="rounded-2xl p-6 flex items-center gap-5" style={{ background: "#fff", border: "1px solid #E5E8F0", boxShadow: "0 1px 3px rgba(0,0,0,0.05)" }}>
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl" style={{ background: "#F0FDF4" }}>
                  <Eye className="h-6 w-6" style={{ color: "#16A34A" }} />
                </div>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-widest mb-1" style={{ color: "#9CA3AF", letterSpacing: "0.1em" }}>Total Sessions</p>
                  <p className="text-3xl font-bold leading-none" style={{ color: "#1A1F36" }}>
                    {analyticsData.totalSessions.toLocaleString()}
                  </p>
                </div>
              </div>

              {/* Page Views */}
              <div className="rounded-2xl p-6 flex items-center gap-5" style={{ background: "#fff", border: "1px solid #E5E8F0", boxShadow: "0 1px 3px rgba(0,0,0,0.05)" }}>
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl" style={{ background: "#FDF4FF" }}>
                  <MousePointer className="h-6 w-6" style={{ color: "#9333EA" }} />
                </div>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-widest mb-1" style={{ color: "#9CA3AF", letterSpacing: "0.1em" }}>Page Views</p>
                  <p className="text-3xl font-bold leading-none" style={{ color: "#1A1F36" }}>
                    {analyticsData.pageViews.toLocaleString()}
                  </p>
                </div>
              </div>

              {/* Removed: Conversion Rate, Avg Session Duration, Bounce Rate, Real-time Users */}
            </div>

            {/* ── Tables Row ──────────────────────────────────────────────── */}
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-2 mb-6">

              {/* Top Pages */}
              <div className="rounded-2xl overflow-hidden" style={{ background: "#fff", border: "1px solid #E5E8F0", boxShadow: "0 1px 3px rgba(0,0,0,0.05)" }}>
                <div className="px-6 py-4 flex items-center gap-3" style={{ borderBottom: "1px solid #F1F3F9" }}>
                  <BarChart3 className="h-4 w-4" style={{ color: "#3B5BDB" }} />
                  <div>
                    <h3 className="text-sm font-semibold" style={{ color: "#1A1F36" }}>Top Pages</h3>
                    <p className="text-xs" style={{ color: "#9CA3AF" }}>Most viewed pages</p>
                  </div>
                </div>
                <div className="divide-y" style={{ borderColor: "#F8F9FC" }}>
                  {analyticsData.topPages.map((page, index) => (
                    <div key={index} className="flex items-center justify-between px-6 py-3">
                      <div className="flex items-center gap-3 min-w-0">
                        <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md text-xs font-bold" style={{ background: "#F1F3F9", color: "#6B7280" }}>
                          {index + 1}
                        </span>
                        <p className="truncate text-sm font-medium" style={{ color: "#374151" }}>
                          {page.pageTitle.length > 48 ? page.pageTitle.substring(0, 45) + "…" : page.pageTitle}
                        </p>
                      </div>
                      <span className="ml-4 shrink-0 text-sm font-semibold tabular-nums" style={{ color: "#1A1F36" }}>
                        {page.pageViews.toLocaleString()}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Top Countries */}
              <div className="rounded-2xl overflow-hidden" style={{ background: "#fff", border: "1px solid #E5E8F0", boxShadow: "0 1px 3px rgba(0,0,0,0.05)" }}>
                <div className="px-6 py-4 flex items-center gap-3" style={{ borderBottom: "1px solid #F1F3F9" }}>
                  <Globe className="h-4 w-4" style={{ color: "#3B5BDB" }} />
                  <div>
                    <h3 className="text-sm font-semibold" style={{ color: "#1A1F36" }}>Top Countries</h3>
                    <p className="text-xs" style={{ color: "#9CA3AF" }}>Visitor geography</p>
                  </div>
                </div>
                <div className="divide-y" style={{ borderColor: "#F8F9FC" }}>
                  {analyticsData.topCountries.map((country, index) => (
                    <div key={index} className="flex items-center justify-between px-6 py-3">
                      <div className="flex items-center gap-3">
                        <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md text-xs font-bold" style={{ background: "#EEF2FF", color: "#3B5BDB" }}>
                          {index + 1}
                        </span>
                        <p className="text-sm font-medium" style={{ color: "#374151" }}>{country.country}</p>
                      </div>
                      <span className="text-sm font-semibold tabular-nums" style={{ color: "#1A1F36" }}>
                        {country.sessions.toLocaleString()}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* ── Bottom Row ──────────────────────────────────────────────── */}
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">

              {/* Device Distribution */}
              <div className="rounded-2xl overflow-hidden" style={{ background: "#fff", border: "1px solid #E5E8F0", boxShadow: "0 1px 3px rgba(0,0,0,0.05)" }}>
                <div className="px-6 py-4 flex items-center gap-3" style={{ borderBottom: "1px solid #F1F3F9" }}>
                  <Smartphone className="h-4 w-4" style={{ color: "#9333EA" }} />
                  <div>
                    <h3 className="text-sm font-semibold" style={{ color: "#1A1F36" }}>Device Distribution</h3>
                    <p className="text-xs" style={{ color: "#9CA3AF" }}>How users access your site</p>
                  </div>
                </div>
                <div className="divide-y" style={{ borderColor: "#F8F9FC" }}>
                  {analyticsData.devices.map((device, index) => {
                    const pct = ((device.sessions / analyticsData.totalSessions) * 100).toFixed(1);
                    return (
                      <div key={index} className="px-6 py-3">
                        <div className="flex items-center justify-between mb-1.5">
                          <p className="text-sm font-medium" style={{ color: "#374151" }}>{device.device}</p>
                          <div className="flex items-center gap-3">
                            <span className="text-sm font-semibold tabular-nums" style={{ color: "#1A1F36" }}>{device.sessions.toLocaleString()}</span>
                            <span className="text-xs font-medium w-10 text-right tabular-nums" style={{ color: "#9CA3AF" }}>{pct}%</span>
                          </div>
                        </div>
                        <div className="h-1.5 w-full rounded-full" style={{ background: "#F1F3F9" }}>
                          <div
                            className="h-1.5 rounded-full"
                            style={{ width: `${pct}%`, background: index === 0 ? "#9333EA" : index === 1 ? "#3B5BDB" : "#16A34A" }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* User Events */}
              <div className="rounded-2xl overflow-hidden" style={{ background: "#fff", border: "1px solid #E5E8F0", boxShadow: "0 1px 3px rgba(0,0,0,0.05)" }}>
                <div className="px-6 py-4 flex items-center gap-3" style={{ borderBottom: "1px solid #F1F3F9" }}>
                  <Activity className="h-4 w-4" style={{ color: "#16A34A" }} />
                  <div>
                    <h3 className="text-sm font-semibold" style={{ color: "#1A1F36" }}>User Events</h3>
                    <p className="text-xs" style={{ color: "#9CA3AF" }}>Tracked interactions</p>
                  </div>
                </div>
                <div className="divide-y" style={{ borderColor: "#F8F9FC" }}>
                  {analyticsData.userEvents.map((event, index) => (
                    <div key={index} className="flex items-center justify-between px-6 py-3">
                      <div className="flex items-center gap-3">
                        <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md text-xs font-bold" style={{ background: "#F0FDF4", color: "#16A34A" }}>
                          {index + 1}
                        </span>
                        <div>
                          <p className="text-sm font-medium" style={{ color: "#374151" }}>{event.eventName}</p>
                          <p className="text-xs" style={{ color: "#9CA3AF" }}>{event.userCount.toLocaleString()} users</p>
                        </div>
                      </div>
                      <span className="text-sm font-semibold tabular-nums" style={{ color: "#1A1F36" }}>
                        {event.eventCount.toLocaleString()}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </>
        )}
      </main>
    </div>
  );
}
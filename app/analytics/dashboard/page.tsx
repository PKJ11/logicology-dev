// app/analytics/dashboard/page.tsx
"use client";

import React, { useState, useEffect } from "react";
import {
  Users,
  Eye,
  MousePointer,
  Clock,
  TrendingUp,
  Smartphone,
  Globe,
  Send,
  RefreshCw,
  AlertCircle,
  CheckCircle,
  Download,
  Calendar,
  BarChart3,
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
  const [sendingToWhatsApp, setSendingToWhatsApp] = useState(false);
  const [dateRange, setDateRange] = useState<"today" | "yesterday" | "7days" | "30days" | "90days">(
    "7days"
  );
  const [whatsappNumber] = useState<string>("7756916144");
  const [whatsappStatus, setWhatsappStatus] = useState<{
    sending: boolean;
    success: boolean;
    message: string;
  } | null>(null);
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
          setAnalyticsData(data.data); // Use sample data
        }
      }
    } catch (error: any) {
      console.error("Error fetching analytics:", error);
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // In your dashboard page component, add this function:

  const sendInteraktWhatsAppMessage = async (
    phoneNumber: string,
    analyticsData: any,
    userName: string = "Logicology Admin",
    userEmail: string = "admin@logicology.in"
  ) => {
    try {
      // Use the same API key that works in cart page
      const INTERAKT_API_KEY = "QTc1emFobGthSVpxRGp1aWtRNE5aaDdCU0xGNFk5LXRFZ3ZXYkRySDZjbzo=";

      // Clean the phone number
      let cleanedPhoneNumber = phoneNumber.replace(/\D/g, "");

      // Remove country code if present
      if (cleanedPhoneNumber.startsWith("91") && cleanedPhoneNumber.length === 12) {
        cleanedPhoneNumber = cleanedPhoneNumber.substring(2);
      } else if (cleanedPhoneNumber.startsWith("+91")) {
        cleanedPhoneNumber = cleanedPhoneNumber.substring(3);
      }

      // Ensure the number is 10 digits
      if (cleanedPhoneNumber.length !== 10) {
        throw new Error("Invalid phone number format");
      }

      const countryCode = "+91";

      // Format date range
      const dateText = formatDateRange(analyticsData.dateRange);

      // Prepare template values - match exactly what works in cart
      const templateValues = [
        userName, // {{1}} Recipient name
        dateText, // {{2}} Period
        analyticsData.totalUsers.toLocaleString(), // {{3}} Total Users
        analyticsData.totalSessions.toLocaleString(), // {{4}} Total Sessions
        analyticsData.pageViews.toLocaleString(), // {{5}} Page Views
        analyticsData.conversionRate?.toFixed(1) || "0", // {{6}} Conversion Rate
      ];

      console.log("📱 Sending analytics to WhatsApp:");
      console.log("Phone:", cleanedPhoneNumber);
      console.log("Template Values:", templateValues);

      // Step 1: Track user in Interakt
      const trackUserResponse = await fetch("https://api.interakt.ai/v1/public/track/users/", {
        method: "POST",
        headers: {
          Authorization: `Basic ${INTERAKT_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          phoneNumber: cleanedPhoneNumber,
          countryCode: countryCode,
          traits: {
            name: userName,
            email: userEmail,
            lastAnalyticsDate: new Date().toISOString(),
            userType: "admin",
            totalReports: 1,
          },
        }),
      });

      const trackUserResult = await trackUserResponse.json();
      console.log("Track User Result:", trackUserResult);

      // Step 2: Send WhatsApp message
      const messageResponse = await fetch("https://api.interakt.ai/v1/public/message/", {
        method: "POST",
        headers: {
          Authorization: `Basic ${INTERAKT_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          countryCode: countryCode,
          phoneNumber: cleanedPhoneNumber,
          type: "Template",
          template: {
            name: "analytics_report", // Make sure this template exists
            languageCode: "en",
            bodyValues: templateValues,
          },
        }),
      });

      const messageResult = await messageResponse.json();
      console.log("Message Result:", messageResult);

      if (!messageResult.id) {
        throw new Error(`Failed to send WhatsApp message: ${JSON.stringify(messageResult)}`);
      }

      return {
        userTracked: trackUserResult.result || false,
        messageSent: true,
        messageId: messageResult.id,
        phoneNumber: `+91${cleanedPhoneNumber}`,
      };
    } catch (error: any) {
      console.error("Error in WhatsApp messaging:", error);
      return {
        userTracked: false,
        messageSent: false,
        messageId: null,
        error: error.message || "Unknown error",
      };
    }
  };
  const sendToWhatsApp = async () => {
    if (!analyticsData) return;

    setSendingToWhatsApp(true);
    setWhatsappStatus({
      sending: true,
      success: false,
      message: "Sending to WhatsApp...",
    });

    try {
      // Array of phone numbers to send to
      const phoneNumbers = ["7756916144", "8080661208", "9860265047"];
      const results = [];

      for (const phoneNumber of phoneNumbers) {
        try {
          // Use the direct function for each number
          const result = await sendInteraktWhatsAppMessage(
            phoneNumber,
            analyticsData,
            "Logicology Admin",
            "admin@logicology.in"
          );

          results.push({
            phoneNumber: phoneNumber,
            success: result.messageSent,
            messageId: result.messageId,
            error: result.error,
          });

          // Small delay between messages to avoid rate limiting
          await new Promise((resolve) => setTimeout(resolve, 500));
        } catch (error: any) {
          results.push({
            phoneNumber: phoneNumber,
            success: false,
            error: error.message,
          });
        }
      }

      // Check results
      const successfulSends = results.filter((r) => r.success);
      const failedSends = results.filter((r) => !r.success);

      if (successfulSends.length === phoneNumbers.length) {
        setWhatsappStatus({
          sending: false,
          success: true,
          message: `✅ Analytics report sent to ${successfulSends.length} numbers successfully!`,
        });
      } else if (successfulSends.length > 0) {
        setWhatsappStatus({
          sending: false,
          success: true,
          message: `✅ Sent to ${successfulSends.length}/${phoneNumbers.length} numbers. Failed: ${failedSends.map((f) => f.phoneNumber).join(", ")}`,
        });
      } else {
        setWhatsappStatus({
          sending: false,
          success: false,
          message: `❌ Failed to send to all numbers. Errors: ${results.map((r) => r.error).join(", ")}`,
        });
      }

      // Log detailed results
      console.log("WhatsApp sending results:", results);
    } catch (error: any) {
      setWhatsappStatus({
        sending: false,
        success: false,
        message: `❌ Error: ${error.message}`,
      });
    } finally {
      setSendingToWhatsApp(false);
    }
  };

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
      ["Avg Session Duration", formatDuration(analyticsData.avgSessionDuration)],
      ["Bounce Rate", `${analyticsData.bounceRate.toFixed(2)}%`],
      ["Conversion Rate", `${analyticsData.conversionRate.toFixed(2)}%`],
      ["Real-time Users", analyticsData.realTimeUsers],
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
    return `${start.toLocaleDateString("en-IN", { day: "numeric", month: "short" })} - ${end.toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}`;
  };

  const formatDuration = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `${minutes}m ${remainingSeconds}s`;
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <div className="text-center">
          <RefreshCw className="mx-auto mb-4 h-12 w-12 animate-spin text-blue-600" />
          <p className="text-gray-600">Loading analytics data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow">
        <div className="mx-auto max-w-7xl px-4 py-6">
          <div className="flex flex-col justify-between md:flex-row md:items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Google Analytics Dashboard</h1>
              <p className="text-gray-600">Real-time website analytics and insights</p>
            </div>
            <div className="mt-4 flex items-center space-x-4 md:mt-0">
              <button
                onClick={exportToCSV}
                className="flex items-center rounded-lg bg-green-600 px-4 py-2 text-white hover:bg-green-700"
              >
                <Download className="mr-2 h-4 w-4" />
                Export CSV
              </button>
              <button
                onClick={fetchAnalyticsData}
                className="flex items-center rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
              >
                <RefreshCw className="mr-2 h-4 w-4" />
                Refresh
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-8">
        {/* Date Range Selector */}
        <div className="mb-8 rounded-xl bg-white p-6 shadow">
          <div className="flex flex-col justify-between md:flex-row md:items-center">
            <h2 className="mb-4 text-xl font-semibold text-gray-900 md:mb-0">Select Date Range</h2>
            <div className="flex flex-wrap gap-2">
              {[
                { value: "today", label: "Today" },
                { value: "yesterday", label: "Yesterday" },
                { value: "7days", label: "Last 7 Days" },
                { value: "30days", label: "Last 30 Days" },
                { value: "90days", label: "Last 90 Days" },
              ].map((range) => (
                <button
                  key={range.value}
                  onClick={() => setDateRange(range.value as any)}
                  className={`rounded-lg px-4 py-2 transition-colors ${
                    dateRange === range.value
                      ? "bg-blue-600 text-white"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  {range.label}
                </button>
              ))}
            </div>
          </div>

          {analyticsData && (
            <div className="mt-4 flex items-center text-sm text-gray-600">
              <Calendar className="mr-2 h-4 w-4" />
              Period: {formatDateRange(analyticsData.dateRange)}
            </div>
          )}
        </div>

        {/* WhatsApp Section */}
        <div className="mb-8 rounded-xl bg-white p-6 shadow">
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
            <div
              className={`mb-4 rounded-lg p-4 ${
                whatsappStatus.success
                  ? "border border-green-200 bg-green-50 text-green-700"
                  : "border border-red-200 bg-red-50 text-red-700"
              }`}
            >
              <div className="flex items-center">
                {whatsappStatus.success ? (
                  <CheckCircle className="mr-2 h-5 w-5" />
                ) : (
                  <AlertCircle className="mr-2 h-5 w-5" />
                )}
                {whatsappStatus.message}
              </div>
            </div>
          )}

          {error && (
            <div className="mb-4 rounded-lg border border-yellow-200 bg-yellow-50 p-4 text-yellow-700">
              <div className="flex items-center">
                <AlertCircle className="mr-2 h-5 w-5" />
                {error}
              </div>
            </div>
          )}
        </div>

        {/* Key Metrics */}
        {analyticsData && (
          <>
            <div className="mb-8 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
              <div className="rounded-xl bg-white p-6 shadow">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Total Users</p>
                    <p className="text-3xl font-bold text-gray-900">
                      {analyticsData.totalUsers.toLocaleString()}
                    </p>
                  </div>
                  <div className="rounded-lg bg-blue-100 p-3">
                    <Users className="h-6 w-6 text-blue-600" />
                  </div>
                </div>
              </div>

              <div className="rounded-xl bg-white p-6 shadow">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Total Sessions</p>
                    <p className="text-3xl font-bold text-gray-900">
                      {analyticsData.totalSessions.toLocaleString()}
                    </p>
                  </div>
                  <div className="rounded-lg bg-green-100 p-3">
                    <Eye className="h-6 w-6 text-green-600" />
                  </div>
                </div>
              </div>

              <div className="rounded-xl bg-white p-6 shadow">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Page Views</p>
                    <p className="text-3xl font-bold text-gray-900">
                      {analyticsData.pageViews.toLocaleString()}
                    </p>
                  </div>
                  <div className="rounded-lg bg-purple-100 p-3">
                    <MousePointer className="h-6 w-6 text-purple-600" />
                  </div>
                </div>
              </div>

              <div className="rounded-xl bg-white p-6 shadow">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Conversion Rate</p>
                    <p className="text-3xl font-bold text-gray-900">
                      {analyticsData.conversionRate.toFixed(1)}%
                    </p>
                  </div>
                  <div className="rounded-lg bg-yellow-100 p-3">
                    <TrendingUp className="h-6 w-6 text-yellow-600" />
                  </div>
                </div>
              </div>
            </div>

            {/* Performance Metrics */}
            <div className="mb-8 grid grid-cols-1 gap-6 md:grid-cols-3">
              <div className="rounded-xl bg-white p-6 shadow">
                <div className="mb-4 flex items-center">
                  <Clock className="mr-2 h-5 w-5 text-gray-600" />
                  <span className="font-medium text-gray-900">Avg. Session Duration</span>
                </div>
                <p className="text-2xl font-bold text-gray-900">
                  {formatDuration(analyticsData.avgSessionDuration)}
                </p>
              </div>

              <div className="rounded-xl bg-white p-6 shadow">
                <div className="mb-4 flex items-center">
                  <TrendingUp className="mr-2 h-5 w-5 text-gray-600" />
                  <span className="font-medium text-gray-900">Bounce Rate</span>
                </div>
                <p className="text-2xl font-bold text-gray-900">
                  {analyticsData.bounceRate.toFixed(1)}%
                </p>
              </div>

              <div className="rounded-xl bg-white p-6 shadow">
                <div className="mb-4 flex items-center">
                  <Users className="mr-2 h-5 w-5 text-gray-600" />
                  <span className="font-medium text-gray-900">Real-time Users</span>
                </div>
                <p className="text-2xl font-bold text-gray-900">{analyticsData.realTimeUsers}</p>
              </div>
            </div>

            {/* Two-column Layout */}
            <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
              {/* Top Pages */}
              <div className="rounded-xl bg-white shadow">
                <div className="border-b p-6">
                  <h3 className="text-lg font-semibold text-gray-900">Top Pages</h3>
                  <p className="text-sm text-gray-600">Most viewed pages on your site</p>
                </div>
                <div className="p-6">
                  <div className="space-y-4">
                    {analyticsData.topPages.map((page, index) => (
                      <div key={index} className="flex items-center justify-between">
                        <div className="flex items-center">
                          <div className="mr-3 flex h-8 w-8 items-center justify-center rounded-lg bg-gray-100">
                            <span className="text-sm font-medium text-gray-700">{index + 1}</span>
                          </div>
                          <div className="truncate">
                            <p className="truncate font-medium text-gray-900">
                              {page.pageTitle.length > 50
                                ? page.pageTitle.substring(0, 47) + "..."
                                : page.pageTitle}
                            </p>
                          </div>
                        </div>
                        <span className="font-semibold text-gray-900">
                          {page.pageViews.toLocaleString()}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Top Countries */}
              <div className="rounded-xl bg-white shadow">
                <div className="border-b p-6">
                  <h3 className="text-lg font-semibold text-gray-900">Top Countries</h3>
                  <p className="text-sm text-gray-600">Where your visitors are from</p>
                </div>
                <div className="p-6">
                  <div className="space-y-4">
                    {analyticsData.topCountries.map((country, index) => (
                      <div key={index} className="flex items-center justify-between">
                        <div className="flex items-center">
                          <div className="mr-3 flex h-8 w-8 items-center justify-center rounded-lg bg-blue-100">
                            <Globe className="h-4 w-4 text-blue-600" />
                          </div>
                          <div>
                            <p className="font-medium text-gray-900">{country.country}</p>
                          </div>
                        </div>
                        <span className="font-semibold text-gray-900">
                          {country.sessions.toLocaleString()}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Devices & Events */}
            <div className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-2">
              {/* Device Distribution */}
              <div className="rounded-xl bg-white shadow">
                <div className="border-b p-6">
                  <h3 className="text-lg font-semibold text-gray-900">Device Distribution</h3>
                  <p className="text-sm text-gray-600">How users access your site</p>
                </div>
                <div className="p-6">
                  <div className="space-y-4">
                    {analyticsData.devices.map((device, index) => (
                      <div key={index} className="flex items-center justify-between">
                        <div className="flex items-center">
                          <div className="mr-3 flex h-8 w-8 items-center justify-center rounded-lg bg-purple-100">
                            <Smartphone className="h-4 w-4 text-purple-600" />
                          </div>
                          <div>
                            <p className="font-medium text-gray-900">{device.device}</p>
                          </div>
                        </div>
                        <div className="flex items-center">
                          <span className="mr-3 font-semibold text-gray-900">
                            {device.sessions.toLocaleString()}
                          </span>
                          <span className="text-sm text-gray-600">
                            ({((device.sessions / analyticsData.totalSessions) * 100).toFixed(1)}%)
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* User Events */}
              <div className="rounded-xl bg-white shadow">
                <div className="border-b p-6">
                  <h3 className="text-lg font-semibold text-gray-900">User Events</h3>
                  <p className="text-sm text-gray-600">Tracked user interactions</p>
                </div>
                <div className="p-6">
                  <div className="space-y-4">
                    {analyticsData.userEvents.map((event, index) => (
                      <div key={index} className="flex items-center justify-between">
                        <div className="flex items-center">
                          <div className="mr-3 flex h-8 w-8 items-center justify-center rounded-lg bg-green-100">
                            <span className="text-sm font-medium text-gray-700">{index + 1}</span>
                          </div>
                          <div>
                            <p className="font-medium text-gray-900">{event.eventName}</p>
                            <p className="text-sm text-gray-600">{event.userCount} users</p>
                          </div>
                        </div>
                        <span className="font-semibold text-gray-900">
                          {event.eventCount.toLocaleString()}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

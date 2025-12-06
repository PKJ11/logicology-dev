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
  BarChart3
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
  const [dateRange, setDateRange] = useState<"today" | "yesterday" | "7days" | "30days" | "90days">("7days");
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
    const INTERAKT_API_KEY = "Q75zahlkaIZqDjuikQ4NZh7BSLF4Y9-teGgvWbDrH6cko=";
    
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
    
    // Prepare template values
    const templateValues = [
      userName, // {{1}} Recipient name
      dateText, // {{2}} Period
      analyticsData.totalUsers.toLocaleString(), // {{3}} Total Users
      analyticsData.totalSessions.toLocaleString(), // {{4}} Total Sessions
      analyticsData.pageViews.toLocaleString(), // {{5}} Page Views
      analyticsData.conversionRate.toFixed(1), // {{6}} Conversion Rate
      new Date().toLocaleDateString("en-IN", { 
        day: "numeric", 
        month: "short", 
        year: "numeric" 
      }) // {{7}} Report Date
    ];

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
          name: "analytics_report",
          languageCode: "en",
          bodyValues: templateValues,
        },
      }),
    });

    const messageResult = await messageResponse.json();

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
    message: "Sending to WhatsApp..."
  });

  try {
    // Use the direct function
    const result = await sendInteraktWhatsAppMessage(
      whatsappNumber,
      analyticsData,
      "Logicology Admin",
      "admin@logicology.in"
    );

    if (result.messageSent) {
      setWhatsappStatus({
        sending: false,
        success: true,
        message: `✅ Analytics report sent to WhatsApp successfully! (Message ID: ${result.messageId})`
      });
    } else {
      setWhatsappStatus({
        sending: false,
        success: false,
        message: `❌ Failed to send: ${result.error || "Unknown error"}`
      });
    }
  } catch (error: any) {
    setWhatsappStatus({
      sending: false,
      success: false,
      message: `❌ Error: ${error.message}`
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
      ...analyticsData.topPages.map(p => [p.pageTitle, p.pageViews]),
      [],
      ["TOP COUNTRIES", "SESSIONS"],
      ...analyticsData.topCountries.map(c => [c.country, c.sessions]),
      [],
      ["DEVICES", "SESSIONS"],
      ...analyticsData.devices.map(d => [d.device, d.sessions]),
    ].map(row => row.join(",")).join("\n");

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
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <RefreshCw className="w-12 h-12 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600">Loading analytics data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Google Analytics Dashboard</h1>
              <p className="text-gray-600">Real-time website analytics and insights</p>
            </div>
            <div className="flex items-center space-x-4 mt-4 md:mt-0">
              <button
                onClick={exportToCSV}
                className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
              >
                <Download className="w-4 h-4 mr-2" />
                Export CSV
              </button>
              <button
                onClick={fetchAnalyticsData}
                className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                <RefreshCw className="w-4 h-4 mr-2" />
                Refresh
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Date Range Selector */}
        <div className="mb-8 bg-white rounded-xl shadow p-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between">
            <h2 className="text-xl font-semibold text-gray-900 mb-4 md:mb-0">Select Date Range</h2>
            <div className="flex flex-wrap gap-2">
              {[
                { value: "today", label: "Today" },
                { value: "yesterday", label: "Yesterday" },
                { value: "7days", label: "Last 7 Days" },
                { value: "30days", label: "Last 30 Days" },
                { value: "90days", label: "Last 90 Days" }
              ].map((range) => (
                <button
                  key={range.value}
                  onClick={() => setDateRange(range.value as any)}
                  className={`px-4 py-2 rounded-lg transition-colors ${
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
            <div className="mt-4 text-sm text-gray-600 flex items-center">
              <Calendar className="w-4 h-4 mr-2" />
              Period: {formatDateRange(analyticsData.dateRange)}
            </div>
          )}
        </div>

        {/* WhatsApp Section */}
        <div className="mb-8 bg-white rounded-xl shadow p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-900">Send to WhatsApp</h2>
            <div className="flex items-center space-x-4">
              <div className="text-sm text-gray-600 bg-gray-100 px-3 py-1 rounded-lg">
                📱 {whatsappNumber}
              </div>
              <button
                onClick={sendToWhatsApp}
                disabled={sendingToWhatsApp || !analyticsData}
                className="flex items-center px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50"
              >
                <Send className="w-4 h-4 mr-2" />
                {sendingToWhatsApp ? "Sending..." : "Send Report"}
              </button>
            </div>
          </div>

          {whatsappStatus && (
            <div className={`p-4 rounded-lg mb-4 ${
              whatsappStatus.success 
                ? "bg-green-50 text-green-700 border border-green-200"
                : "bg-red-50 text-red-700 border border-red-200"
            }`}>
              <div className="flex items-center">
                {whatsappStatus.success ? (
                  <CheckCircle className="w-5 h-5 mr-2" />
                ) : (
                  <AlertCircle className="w-5 h-5 mr-2" />
                )}
                {whatsappStatus.message}
              </div>
            </div>
          )}

          {error && (
            <div className="p-4 rounded-lg mb-4 bg-yellow-50 text-yellow-700 border border-yellow-200">
              <div className="flex items-center">
                <AlertCircle className="w-5 h-5 mr-2" />
                {error}
              </div>
            </div>
          )}
        </div>

        {/* Key Metrics */}
        {analyticsData && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <div className="bg-white rounded-xl shadow p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Total Users</p>
                    <p className="text-3xl font-bold text-gray-900">
                      {analyticsData.totalUsers.toLocaleString()}
                    </p>
                  </div>
                  <div className="p-3 bg-blue-100 rounded-lg">
                    <Users className="w-6 h-6 text-blue-600" />
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Total Sessions</p>
                    <p className="text-3xl font-bold text-gray-900">
                      {analyticsData.totalSessions.toLocaleString()}
                    </p>
                  </div>
                  <div className="p-3 bg-green-100 rounded-lg">
                    <Eye className="w-6 h-6 text-green-600" />
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Page Views</p>
                    <p className="text-3xl font-bold text-gray-900">
                      {analyticsData.pageViews.toLocaleString()}
                    </p>
                  </div>
                  <div className="p-3 bg-purple-100 rounded-lg">
                    <MousePointer className="w-6 h-6 text-purple-600" />
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Conversion Rate</p>
                    <p className="text-3xl font-bold text-gray-900">
                      {analyticsData.conversionRate.toFixed(1)}%
                    </p>
                  </div>
                  <div className="p-3 bg-yellow-100 rounded-lg">
                    <TrendingUp className="w-6 h-6 text-yellow-600" />
                  </div>
                </div>
              </div>
            </div>

            {/* Performance Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="bg-white rounded-xl shadow p-6">
                <div className="flex items-center mb-4">
                  <Clock className="w-5 h-5 text-gray-600 mr-2" />
                  <span className="font-medium text-gray-900">Avg. Session Duration</span>
                </div>
                <p className="text-2xl font-bold text-gray-900">
                  {formatDuration(analyticsData.avgSessionDuration)}
                </p>
              </div>

              <div className="bg-white rounded-xl shadow p-6">
                <div className="flex items-center mb-4">
                  <TrendingUp className="w-5 h-5 text-gray-600 mr-2" />
                  <span className="font-medium text-gray-900">Bounce Rate</span>
                </div>
                <p className="text-2xl font-bold text-gray-900">
                  {analyticsData.bounceRate.toFixed(1)}%
                </p>
              </div>

              <div className="bg-white rounded-xl shadow p-6">
                <div className="flex items-center mb-4">
                  <Users className="w-5 h-5 text-gray-600 mr-2" />
                  <span className="font-medium text-gray-900">Real-time Users</span>
                </div>
                <p className="text-2xl font-bold text-gray-900">
                  {analyticsData.realTimeUsers}
                </p>
              </div>
            </div>

            {/* Two-column Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Top Pages */}
              <div className="bg-white rounded-xl shadow">
                <div className="p-6 border-b">
                  <h3 className="text-lg font-semibold text-gray-900">Top Pages</h3>
                  <p className="text-sm text-gray-600">Most viewed pages on your site</p>
                </div>
                <div className="p-6">
                  <div className="space-y-4">
                    {analyticsData.topPages.map((page, index) => (
                      <div key={index} className="flex items-center justify-between">
                        <div className="flex items-center">
                          <div className="w-8 h-8 flex items-center justify-center bg-gray-100 rounded-lg mr-3">
                            <span className="text-sm font-medium text-gray-700">{index + 1}</span>
                          </div>
                          <div className="truncate">
                            <p className="font-medium text-gray-900 truncate">
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
              <div className="bg-white rounded-xl shadow">
                <div className="p-6 border-b">
                  <h3 className="text-lg font-semibold text-gray-900">Top Countries</h3>
                  <p className="text-sm text-gray-600">Where your visitors are from</p>
                </div>
                <div className="p-6">
                  <div className="space-y-4">
                    {analyticsData.topCountries.map((country, index) => (
                      <div key={index} className="flex items-center justify-between">
                        <div className="flex items-center">
                          <div className="w-8 h-8 flex items-center justify-center bg-blue-100 rounded-lg mr-3">
                            <Globe className="w-4 h-4 text-blue-600" />
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
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-8">
              {/* Device Distribution */}
              <div className="bg-white rounded-xl shadow">
                <div className="p-6 border-b">
                  <h3 className="text-lg font-semibold text-gray-900">Device Distribution</h3>
                  <p className="text-sm text-gray-600">How users access your site</p>
                </div>
                <div className="p-6">
                  <div className="space-y-4">
                    {analyticsData.devices.map((device, index) => (
                      <div key={index} className="flex items-center justify-between">
                        <div className="flex items-center">
                          <div className="w-8 h-8 flex items-center justify-center bg-purple-100 rounded-lg mr-3">
                            <Smartphone className="w-4 h-4 text-purple-600" />
                          </div>
                          <div>
                            <p className="font-medium text-gray-900">{device.device}</p>
                          </div>
                        </div>
                        <div className="flex items-center">
                          <span className="font-semibold text-gray-900 mr-3">
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
              <div className="bg-white rounded-xl shadow">
                <div className="p-6 border-b">
                  <h3 className="text-lg font-semibold text-gray-900">User Events</h3>
                  <p className="text-sm text-gray-600">Tracked user interactions</p>
                </div>
                <div className="p-6">
                  <div className="space-y-4">
                    {analyticsData.userEvents.map((event, index) => (
                      <div key={index} className="flex items-center justify-between">
                        <div className="flex items-center">
                          <div className="w-8 h-8 flex items-center justify-center bg-green-100 rounded-lg mr-3">
                            <span className="text-sm font-medium text-gray-700">{index + 1}</span>
                          </div>
                          <div>
                            <p className="font-medium text-gray-900">{event.eventName}</p>
                            <p className="text-sm text-gray-600">
                              {event.userCount} users
                            </p>
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
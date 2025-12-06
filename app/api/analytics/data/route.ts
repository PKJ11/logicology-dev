// app/api/analytics/data/route.ts
import { NextRequest, NextResponse } from "next/server";
import { google } from "googleapis";

// Direct configuration - NO environment variables
const PROPERTY_ID = "514184613";

// Your service account credentials directly
const SERVICE_ACCOUNT = {
  client_email: "logicology-serice-acc-ga@logicology-452511.iam.gserviceaccount.com",
  private_key: `-----BEGIN PRIVATE KEY-----
MIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQDpaNmHZw7YCUlt
YL1ExpuAw9Os1C00MtXNr/GQczJATS0JYs5llABD8glvQPZlAO+LvPu7Jp89q2x1
51MKEceKpykE22vTprGFlNhqjEIKGuy0na500FvbmDI894w04aYgt60IUyi51XCs
h372NMTSZnoqnVuySbDbQXp8KvW2NTdlsJuWyvPULQDkrmVc7jIj4g2fByuLo14/
zIim8qnq4Q8wjsTemF/pBMzBzK83c54HVzHYmsiYUwqql2JWeRVCpsXXWy2oASYg
Jd7G5G4aG/m/MQnZL64KQ/ufJF0C9UuDDcmCH8r05kY91cmPvDSc9/e7hVT6FCiW
M2Lld1PjAgMBAAECggEAEpkeLCHUFva2eRaqPh6tKVdxOGY3q98ZFiic0Ou8506+
9e5/j6x5UPCqO8krWOT4MWQ/kqwDKEDOhZ6HCVhdU/j51b8+GkFAB+rSS7sdT/zR
O5sM2ZX4m8jGyADZlSUdvaGlEfK+XgBZ2AV74lZWEIXF2jtroQsqIm5XOimaJoh0
ClfS+KPRze7NrSi1kGR8mBFbvFSC1nTh3ODrND+wlB20kVja8SYolpUi1hvculzw
PJiPJUbtU3XOaJKBfJs6qGEFS/a2OUOqLtwi/b31mj5OV3kc82H7D4QiHYVuad9L
habbPFtljkPKSuXA9gCNwPYCOJt3jvIohoHXxuga8QKBgQD3S7OjUVWFW1G2ceVG
iy6C7DBzhGcOteQvFa88d1rpAV7Jg876etsBdy/gRW8ab3D+4xUKT+YIR9jVv+ZT
MSv9Ix1Rc/2xzCz/qRBqPgF2sjiQsJqZHXmsKQXyTLdiYySZqKGJI6rwu5DCw9H1
q39hwhBEOw4b3KleMIVA/+NL7wKBgQDxoAZRX4AYypkHx0hymGOR+PI5cfkU8ZsW
XtNErVfJWor2/V8zTKUQ84+iGviNUZYN9Q8VspGF3ApXgjogJrycA+dNHwa0CmgI
JJxf82qx+pIZ2Jc0Ns/etKurtExuQWkWy4BOuOwt+PMMHrsumMPxqmIznmKgCzHA
2qHDvDVTTQKBgQDzlSxfXNjZH2bwR2Wnw6ZPrSfYUP1V/xHA0yIldAcm5YOhCGTS
UjrwSZ7t0FasekKZvcFWw/Z4B5TsjjXnkdKbZ4AUYCTugYd9V+DkVSkJ6mhPFLVi
xia3zjyeOrSTg8ZkWDasp2ZT8tyXC1z/GCrDduyg2G6AQSzOqwpGSQZxHwKBgFME
TUdmDYf3C+8NPEoLK6K6qtar3w2gGU3tVJ8zA4dt8XL9CNmCSvBxDnd+1skPMAQp
n34v9SnNuUvptXjYdlMQUEdCEraHIMkzcvrQkmcGFW6F6SWKc48r+hOrhdsX5Dht
wO7LQHJnJ3KRmHRhDmmYxdbAY1hjoDuHoq6ymou9AoGAVRa2DIrNs7ZStg1Dau3A
W451eg1dzuf3qM7uhlfK1k3LeLBu2bZBSA54/P5B8DXtBx6d8qxhUyLwaxxavd8/
AgGRJrBFWrKUeo3Mi4k65ZqDmN8QQt/Q9Cj37dB2tDl0Hk1D83sA1J0tq6BKDHP6
MFosW29NvFLcJf24GSqihEE=
-----END PRIVATE KEY-----`,
};

export async function GET(request: NextRequest) {
    const searchParams = request.nextUrl.searchParams;
    const range = searchParams.get("range") || "7days";
  try {
    

    // Calculate date range
    const { startDate, endDate } = getDateRange(range);

    // Authenticate and create analyticsData client
    const auth = new google.auth.JWT({
      email: SERVICE_ACCOUNT.client_email,
      key: SERVICE_ACCOUNT.private_key,
      scopes: ["https://www.googleapis.com/auth/analytics.readonly"],
    });

    const analyticsDataClient = google.analyticsdata({
      version: "v1beta",
      auth: auth,
    });

    const propertyPath = `properties/${PROPERTY_ID}`;

    // Fetch all metrics in parallel
    const [
      usersResponse,
      sessionsResponse,
      pageViewsResponse,
      durationResponse,
      bounceRateResponse,
      pagesResponse,
      countriesResponse,
      devicesResponse,
      eventsResponse,
      conversionsResponse,
    ] = await Promise.all([
      // Total Users
      analyticsDataClient.properties.runReport({
        property: propertyPath,
        requestBody: {
          dateRanges: [{ startDate, endDate }],
          metrics: [{ name: "totalUsers" }],
        },
      }),

      // Total Sessions
      analyticsDataClient.properties.runReport({
        property: propertyPath,
        requestBody: {
          dateRanges: [{ startDate, endDate }],
          metrics: [{ name: "sessions" }],
        },
      }),

      // Page Views
      analyticsDataClient.properties.runReport({
        property: propertyPath,
        requestBody: {
          dateRanges: [{ startDate, endDate }],
          metrics: [{ name: "screenPageViews" }],
        },
      }),

      // Average Session Duration
      analyticsDataClient.properties.runReport({
        property: propertyPath,
        requestBody: {
          dateRanges: [{ startDate, endDate }],
          metrics: [{ name: "averageSessionDuration" }],
        },
      }),

      // Bounce Rate
      analyticsDataClient.properties.runReport({
        property: propertyPath,
        requestBody: {
          dateRanges: [{ startDate, endDate }],
          metrics: [{ name: "bounceRate" }],
        },
      }),

      // Top Pages
      analyticsDataClient.properties.runReport({
        property: propertyPath,
        requestBody: {
          dateRanges: [{ startDate, endDate }],
          dimensions: [{ name: "pageTitle" }],
          metrics: [{ name: "screenPageViews" }],
          limit: "10",
          orderBys: [
            {
              metric: { metricName: "screenPageViews" },
              desc: true,
            },
          ],
        },
      }),

      // Top Countries
      analyticsDataClient.properties.runReport({
        property: propertyPath,
        requestBody: {
          dateRanges: [{ startDate, endDate }],
          dimensions: [{ name: "country" }],
          metrics: [{ name: "sessions" }],
          limit: "10",
          orderBys: [
            {
              metric: { metricName: "sessions" },
              desc: true,
            },
          ],
        },
      }),

      // Device Categories
      analyticsDataClient.properties.runReport({
        property: propertyPath,
        requestBody: {
          dateRanges: [{ startDate, endDate }],
          dimensions: [{ name: "deviceCategory" }],
          metrics: [{ name: "sessions" }],
          limit: "10",
        },
      }),
      // User Events
      analyticsDataClient.properties.runReport({
        property: propertyPath,
        requestBody: {
          dateRanges: [{ startDate, endDate }],
          dimensions: [{ name: "eventName" }],
          metrics: [{ name: "eventCount" }, { name: "totalUsers" }],
          limit: "10",
          orderBys: [
            {
              metric: { metricName: "eventCount" },
              desc: true,
            },
          ],
        },
      }),

      // Conversions
      analyticsDataClient.properties.runReport({
        property: propertyPath,
        requestBody: {
          dateRanges: [{ startDate, endDate }],
          metrics: [{ name: "conversions" }, { name: "sessions" }],
        },
      }),
    ]);

    // Process and structure the data
    const analyticsData = {
      totalUsers: Number(usersResponse.data.rows?.[0]?.metricValues?.[0]?.value || 0),
      totalSessions: Number(sessionsResponse.data.rows?.[0]?.metricValues?.[0]?.value || 0),
      pageViews: Number(pageViewsResponse.data.rows?.[0]?.metricValues?.[0]?.value || 0),
      avgSessionDuration: Number(durationResponse.data.rows?.[0]?.metricValues?.[0]?.value || 0),
      bounceRate: Number(bounceRateResponse.data.rows?.[0]?.metricValues?.[0]?.value || 0),
      topPages:
        pagesResponse.data.rows?.map((row) => ({
          pageTitle: row.dimensionValues?.[0]?.value || "Unknown",
          pageViews: Number(row.metricValues?.[0]?.value || 0),
        })) || [],
      topCountries:
        countriesResponse.data.rows?.map((row) => ({
          country: row.dimensionValues?.[0]?.value || "Unknown",
          sessions: Number(row.metricValues?.[0]?.value || 0),
        })) || [],
      devices:
        devicesResponse.data.rows?.map((row) => ({
          device: row.dimensionValues?.[0]?.value || "Unknown",
          sessions: Number(row.metricValues?.[0]?.value || 0),
        })) || [],
      realTimeUsers: 0, // Real-time users need different API call
      userEvents:
        eventsResponse.data.rows?.map((row) => ({
          eventName: row.dimensionValues?.[0]?.value || "Unknown",
          eventCount: Number(row.metricValues?.[0]?.value || 0),
          userCount: Number(row.metricValues?.[1]?.value || 0),
        })) || [],
      conversionRate: calculateConversionRate(
        conversionsResponse.data.rows?.[0]?.metricValues?.[0]?.value || "0",
        conversionsResponse.data.rows?.[0]?.metricValues?.[1]?.value || "0"
      ),
      dateRange: { startDate, endDate },
    };

    console.log("✅ Analytics Data Fetched Successfully");
    console.log("📊 Total Users:", analyticsData.totalUsers);
    console.log("📊 Total Sessions:", analyticsData.totalSessions);
    console.log("📊 Page Views:", analyticsData.pageViews);

    return NextResponse.json({
      success: true,
      data: analyticsData,
      timestamp: new Date().toISOString(),
    });
  } catch (error: any) {
    console.error("❌ Google Analytics API error:", error);
    console.error("Error details:", error.response?.data || error.message);

    // Return sample data for testing if API fails
    const sampleData = getSampleAnalyticsData(range);

    console.log("🔄 Using sample data for demonstration");

    return NextResponse.json({
      success: false,
      error: error.message,
      message: "Using sample data for demo",
      sample: true,
      data: sampleData,
    });
  }
}

// Helper functions
function getDateRange(range: string) {
  const now = new Date();
  const endDate = new Date();
  endDate.setHours(23, 59, 59, 999);

  let startDate = new Date();

  switch (range) {
    case "today":
      startDate.setHours(0, 0, 0, 0);
      break;
    case "yesterday":
      startDate.setDate(now.getDate() - 1);
      startDate.setHours(0, 0, 0, 0);
      endDate.setDate(now.getDate() - 1);
      endDate.setHours(23, 59, 59, 999);
      break;
    case "7days":
      startDate.setDate(now.getDate() - 7);
      break;
    case "30days":
      startDate.setDate(now.getDate() - 30);
      break;
    case "90days":
      startDate.setDate(now.getDate() - 90);
      break;
    default:
      startDate.setDate(now.getDate() - 7);
  }

  return {
    startDate: formatDate(startDate),
    endDate: formatDate(endDate),
  };
}

function formatDate(date: Date): string {
  return date.toISOString().split("T")[0];
}

function calculateConversionRate(conversions: string, sessions: string): number {
  const conv = Number(conversions) || 0;
  const sess = Number(sessions) || 1;
  return (conv / sess) * 100;
}

// Sample data for testing
function getSampleAnalyticsData(range: string) {
  const { startDate, endDate } = getDateRange(range);

  return {
    totalUsers: Math.floor(Math.random() * 1000) + 500,
    totalSessions: Math.floor(Math.random() * 1500) + 800,
    pageViews: Math.floor(Math.random() * 5000) + 3000,
    avgSessionDuration: Math.floor(Math.random() * 180) + 60,
    bounceRate: Math.random() * 60 + 30,
    topPages: [
      { pageTitle: "Home Page", pageViews: 1200 },
      { pageTitle: "Products", pageViews: 850 },
      { pageTitle: "Contact Us", pageViews: 650 },
      { pageTitle: "About", pageViews: 420 },
      { pageTitle: "Blog", pageViews: 380 },
    ],
    topCountries: [
      { country: "India", sessions: 1200 },
      { country: "United States", sessions: 450 },
      { country: "United Kingdom", sessions: 220 },
      { country: "Canada", sessions: 180 },
      { country: "Australia", sessions: 150 },
    ],
    devices: [
      { device: "Mobile", sessions: 1200 },
      { device: "Desktop", sessions: 800 },
      { device: "Tablet", sessions: 150 },
    ],
    realTimeUsers: Math.floor(Math.random() * 50) + 10,
    userEvents: [
      { eventName: "page_view", eventCount: 2500, userCount: 800 },
      { eventName: "click", eventCount: 1200, userCount: 450 },
      { eventName: "scroll", eventCount: 850, userCount: 320 },
      { eventName: "form_submit", eventCount: 120, userCount: 95 },
    ],
    conversionRate: Math.random() * 10 + 2,
    dateRange: { startDate, endDate },
  };
}

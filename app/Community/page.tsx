"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import SiteFooter from "@/components/Footer";
import Community from "@/components/Community";

interface UserData {
  id: string;
  name: string;
  email: string;
  phone: string;
}

interface Worksheet {
  id: number;
  title: string;
  description: string;
  pdfPath: string;
  imagePath: string;
  category: string;
  difficulty: string;
}

// Jio Interakt API configuration
const INTERAKT_API_KEY = "Basic QTc1emFobGthSVpxRGp1aWtRNE5aaDdCU0xGNFk5LXRFZ3ZXYkRySDZjbzo=";
const INTERAKT_BASE_URL = "https://api.interakt.ai/v1/public";

// WhatsApp template names - create these templates in Interakt under "Utility" category
const WHATSAPP_TEMPLATES = {
  COMMUNITY_INVITE: "community_invite", // Create this template in Interakt
  WELCOME: "community_welcome", // Optional: for welcoming new users
};

// Worksheets data with Worksheet001 to Worksheet005
const WORKSHEETS: Worksheet[] = [
  {
    id: 1,
    title: "Maze Games",
    description:
      "Navigate through challenging mazes and find the correct paths to develop problem-solving skills and spatial awareness.",
    pdfPath: "/pdfs/Community/Worksheet001.pdf",
    imagePath: "/Community/worksheet1-preview.jpg",
    category: "",
    difficulty: "",
  },
  {
    id: 2,
    title: "Country Word Search",
    description:
      "Discover countries from around the world in engaging word search puzzles that enhance vocabulary and geographical knowledge.",
    pdfPath: "/pdfs/Community/Worksheet002.pdf",
    imagePath: "/pdfs/Community/worksheet2-preview.jpg",
    category: "",
    difficulty: "",
  },
  {
    id: 3,
    title: "Colouring Activity",
    description:
      "Express creativity with beautiful coloring pages featuring animals, nature scenes, and fun characters for artistic development.",
    pdfPath: "/pdfs/Community/Worksheet003.pdf",
    imagePath: "/pdfs/Community/worksheet3-preview.jpg",
    category: "",
    difficulty: "",
  },
  {
    id: 4,
    title: "Find My Kite",
    description:
      "Help characters find their lost kites in visual search puzzles that improve observation skills and attention to detail.",
    pdfPath: "/pdfs/Community/Worksheet004.pdf",
    imagePath: "/Community/worksheet4-preview.jpg",
    category: "",
    difficulty: "",
  },
  {
    id: 5,
    title: "Crack The Zoo Codes",
    description:
      "Decipher secret codes and solve animal-themed puzzles to rescue zoo animals using logical thinking and pattern recognition.",
    pdfPath: "/pdfs/Community/Worksheet005.pdf",
    imagePath: "/Community/worksheet5-preview.jpg",
    category: "",
    difficulty: "",
  },
];

export default function CommunityPage() {
  const [userData, setUserData] = useState<UserData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showWhatsappForm, setShowWhatsappForm] = useState(false);
  const [friendName, setFriendName] = useState("");
  const [friendNumber, setFriendNumber] = useState("");
  const [copySuccess, setCopySuccess] = useState(false);
  const [sendingInvite, setSendingInvite] = useState(false);
  const [inviteStatus, setInviteStatus] = useState<{
    success: boolean;
    message: string;
  } | null>(null);
  const [previewPdf, setPreviewPdf] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const checkAuth = () => {
      if (typeof window === "undefined") return;

      const token = localStorage.getItem("communityToken");
      const userData = localStorage.getItem("userData");

      if (!token || !userData) {
        setIsLoading(false);
        return;
      }

      try {
        setUserData(JSON.parse(userData));
      } catch (error) {
        console.error("Error parsing user data:", error);
        localStorage.removeItem("communityToken");
        localStorage.removeItem("userData");
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem("communityToken");
    localStorage.removeItem("userData");
    localStorage.removeItem("otpVerified");
    localStorage.removeItem("otpSent");
    setUserData(null);
  };

  const copyCommunityLink = () => {
    const link = "https://www.logicology.in/Community";
    navigator.clipboard.writeText(link);
    setCopySuccess(true);
    setTimeout(() => setCopySuccess(false), 3000);
  };

  // Function to validate and clean phone number
  const cleanPhoneNumber = (phoneNumber: string): string => {
    return phoneNumber.replace(/\D/g, "");
  };

  // Function to extract country code (defaulting to +91 for India)
  const extractCountryCode = (
    phoneNumber: string
  ): { countryCode: string; cleanedNumber: string } => {
    const cleaned = cleanPhoneNumber(phoneNumber);

    // Check if number starts with country code
    if (cleaned.startsWith("91") && cleaned.length >= 12) {
      return {
        countryCode: "+91",
        cleanedNumber: cleaned.substring(2), // Remove country code
      };
    }

    // Default to Indian number without country code
    return {
      countryCode: "+91",
      cleanedNumber: cleaned.length > 10 ? cleaned.slice(-10) : cleaned, // Take last 10 digits
    };
  };

  // Function to send WhatsApp message via Jio Interakt
  const sendInteraktMessage = async (
    phoneNumber: string,
    templateName: string,
    bodyValues: string[]
  ): Promise<{ success: boolean; messageId?: string; error?: string }> => {
    try {
      const { countryCode, cleanedNumber } = extractCountryCode(phoneNumber);

      // Validate phone number
      if (cleanedNumber.length !== 10) {
        throw new Error("Invalid phone number. Please enter a 10-digit Indian mobile number.");
      }

      // Step 1: Track/Update user in Interakt
      const trackUserResponse = await fetch(`${INTERAKT_BASE_URL}/track/users/`, {
        method: "POST",
        headers: {
          Authorization: INTERAKT_API_KEY,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          phoneNumber: cleanedNumber,
          countryCode: countryCode,
          traits: {
            name: friendName,
            source: "community_invite",
            invitedBy: userData?.name || "PlayThinkers Community",
            invitedByEmail: userData?.email || "",
            inviteDate: new Date().toISOString(),
          },
        }),
      });

      const trackUserResult = await trackUserResponse.json();
      console.log("Track user result:", trackUserResult);

      // Step 2: Send WhatsApp message
      const messageResponse = await fetch(`${INTERAKT_BASE_URL}/message/`, {
        method: "POST",
        headers: {
          Authorization: INTERAKT_API_KEY,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          countryCode: countryCode,
          phoneNumber: cleanedNumber,
          type: "Template",
          template: {
            name: templateName,
            languageCode: "en",
            bodyValues: bodyValues,
          },
        }),
      });

      const messageResult = await messageResponse.json();
      console.log("Message result:", messageResult);

      if (!messageResult.id) {
        throw new Error(`Failed to send WhatsApp message: ${JSON.stringify(messageResult)}`);
      }

      return {
        success: true,
        messageId: messageResult.id,
      };
    } catch (error: any) {
      console.error("Error sending Interakt message:", error);
      return {
        success: false,
        error: error.message || "Failed to send WhatsApp message",
      };
    }
  };

  const handleWhatsappInvite = async () => {
    if (!friendName.trim() || !friendNumber.trim()) {
      setInviteStatus({
        success: false,
        message: "Please enter both name and phone number",
      });
      setTimeout(() => setInviteStatus(null), 3000);
      return;
    }

    setSendingInvite(true);
    setInviteStatus(null);

    try {
      // Prepare template variables
      const bodyValues = [
        friendName, // {{1}} - Friend's name
        userData?.name || "A friend", // {{2}} - Inviter's name
        "PlayThinkers Community", // {{3}} - Community name
        "https://www.logicology.in/Community", // {{4}} - Community link
      ];

      // Send message via Jio Interakt
      const result = await sendInteraktMessage(
        friendNumber,
        WHATSAPP_TEMPLATES.COMMUNITY_INVITE,
        bodyValues
      );

      if (result.success) {
        setInviteStatus({
          success: true,
          message: `Invitation sent successfully to ${friendName}!`,
        });

        // Reset form
        setShowWhatsappForm(false);
        setFriendName("");
        setFriendNumber("");

        // Clear success message after 5 seconds
        setTimeout(() => setInviteStatus(null), 5000);
      } else {
        setInviteStatus({
          success: false,
          message: result.error || "Failed to send invitation. Please try again.",
        });
      }
    } catch (error: any) {
      setInviteStatus({
        success: false,
        message: error.message || "An error occurred. Please try again.",
      });
    } finally {
      setSendingInvite(false);
    }
  };

  const downloadPDF = (pdfPath: string, title: string) => {
    const link = document.createElement("a");
    link.href = pdfPath;
    // Extract filename from path for download
    const filename = pdfPath.split("/").pop() || `${title.replace(/\s+/g, "_")}.pdf`;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const openPreview = (pdfPath: string) => {
    setPreviewPdf(pdfPath);
  };

  const closePreview = () => {
    setPreviewPdf(null);
  };

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-brand-grayBg">
        <div className="text-center">
          <div className="mx-auto h-16 w-16 animate-spin rounded-full border-b-2 border-brand-teal"></div>
          <p className="mt-4 text-brand-tealDark">Loading PlayThinkers Community...</p>
        </div>
      </div>
    );
  }

  // If user is not logged in, show the Community component
  if (!userData) {
    return (
      <div className="min-h-screen bg-brand-grayBg">
        {/* Header */}
        <header className="border-b border-gray-200 bg-gradient-to-r from-brand-teal to-brand-tealDark shadow-lg">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col items-center justify-between gap-4 py-6 sm:flex-row">
              <div className="flex flex-col items-center gap-4 sm:flex-row">
                <Link href="/" className="text-3xl font-bold text-white hover:opacity-90">
                  Logicology
                </Link>
                <div className="flex items-center gap-2">
                  <span className="rounded-full bg-white/20 px-4 py-1.5 text-sm font-medium text-white backdrop-blur-sm">
                    PlayThinkers Community
                  </span>
                  <button
                    onClick={() => router.push("/")}
                    className="ml-2 rounded-full bg-white/20 px-4 py-1.5 text-sm font-medium text-white backdrop-blur-sm transition-colors hover:bg-white/30"
                  >
                    ← Back to Homepage
                  </button>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Show the Community component below the header */}
        <Community />

        {/* Add some spacing and additional info */}
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
          <div className="rounded-3xl border border-brand-teal/10 bg-white p-8 shadow-lg">
            <h2 className="mb-6 text-center text-2xl font-bold text-brand-tealDark">
              What You'll Get as a Community Member
            </h2>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
              <div className="rounded-xl bg-brand-grayBg p-6 text-center">
                <div className="mb-4 inline-flex h-16 w-16 items-center justify-center rounded-full bg-brand-teal/10 text-2xl">
                  📚
                </div>
                <h3 className="mb-2 font-semibold text-brand-tealDark">Exclusive Worksheets</h3>
                <p className="text-sm text-gray-600">Monthly printable puzzles and activities</p>
              </div>
              <div className="rounded-xl bg-brand-grayBg p-6 text-center">
                <div className="mb-4 inline-flex h-16 w-16 items-center justify-center rounded-full bg-brand-coral/10 text-2xl">
                  🧩
                </div>
                <h3 className="mb-2 font-semibold text-brand-tealDark">Learning Games</h3>
                <p className="text-sm text-gray-600">
                  Interactive games to develop critical thinking
                </p>
              </div>
              <div className="rounded-xl bg-brand-grayBg p-6 text-center">
                <div className="mb-4 inline-flex h-16 w-16 items-center justify-center rounded-full bg-brand-gold/10 text-2xl">
                  🎯
                </div>
                <h3 className="mb-2 font-semibold text-brand-tealDark">Progress Tracking</h3>
                <p className="text-sm text-gray-600">Track your child's learning journey</p>
              </div>
              <div className="rounded-xl bg-brand-grayBg p-6 text-center">
                <div className="mb-4 inline-flex h-16 w-16 items-center justify-center rounded-full bg-brand-pink/10 text-2xl">
                  🏆
                </div>
                <h3 className="mb-2 font-semibold text-brand-tealDark">Achievements</h3>
                <p className="text-sm text-gray-600">Earn badges and certificates</p>
              </div>
            </div>

            <div className="mt-8 text-center">
              <p className="text-gray-600">
                Join the community to unlock all these benefits and more!
              </p>
            </div>
          </div>
        </div>

        <SiteFooter />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-brand-grayBg">
      {/* Header */}
      <header className="border-b border-gray-200 bg-gradient-to-r from-brand-teal to-brand-tealDark shadow-lg">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col items-center justify-between gap-4 py-6 sm:flex-row">
            <div className="flex flex-col items-center gap-4 sm:flex-row">
              <Link href="/" className="text-3xl font-bold text-white hover:opacity-90">
                Logicology
              </Link>
              <div className="flex items-center gap-2">
                <span className="rounded-full bg-white/20 px-4 py-1.5 text-sm font-medium text-white backdrop-blur-sm">
                  PlayThinkers Community
                </span>
                <button
                  onClick={() => router.push("/")}
                  className="ml-2 rounded-full bg-white/20 px-4 py-1.5 text-sm font-medium text-white backdrop-blur-sm transition-colors hover:bg-white/30"
                >
                  ← Back to Homepage
                </button>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <div className="text-right">
                <p className="text-sm font-medium text-white">{userData?.name}</p>
                <p className="text-xs text-white/80">{userData?.email}</p>
              </div>
              <button
                onClick={handleLogout}
                className="rounded-full border border-white/30 bg-white/10 px-4 py-2 text-sm text-white backdrop-blur-sm transition-colors hover:bg-white/20"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content - Show only when logged in */}
      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Welcome Section */}
        <section className="mb-12 text-center">
          <div className="mx-auto max-w-3xl">
            <h1 className="mb-6 bg-gradient-to-r from-brand-teal to-brand-coral bg-clip-text text-4xl font-bold text-transparent md:text-5xl">
              Welcome to the PlayThinkers Community
            </h1>
            <p className="mb-8 text-xl text-brand-tealDark">
              We're thrilled to have you on board, {userData?.name}! Get ready for exclusive content
              and premium worksheets.
            </p>
            <div className="mx-auto h-1 w-24 bg-gradient-to-r from-brand-teal to-brand-coral"></div>
          </div>
        </section>

        {/* Worksheet Section - Updated with Worksheet001 to Worksheet005 */}
        <section className="mb-12 rounded-3xl border border-brand-teal/10 bg-white p-8 shadow-xl">
          <div className="text-center">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-brand-teal to-brand-coral px-6 py-3 text-sm font-medium text-white shadow-md">
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
              Exclusive Worksheets Available!
            </div>
            <h2 className="mb-4 text-3xl font-bold text-brand-tealDark">
              Download Your Premium Worksheets
            </h2>
            <p className="mx-auto mb-8 max-w-2xl text-lg text-gray-600">
              Access our exclusive collection of PlayThinkers worksheets designed to enhance
              critical thinking and problem-solving skills for kids of all ages.
            </p>

            {/* Worksheets Grid - 3 per row */}
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
              {WORKSHEETS.slice(0, 3).map((worksheet) => (
                <WorksheetCard
                  key={worksheet.id}
                  worksheet={worksheet}
                  onDownload={downloadPDF}
                  onPreview={openPreview}
                />
              ))}
            </div>

            {/* Row for worksheets 4 and 5 - centered with 2 per row */}
            <div className="mx-auto mt-8 grid max-w-4xl grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-2">
              {WORKSHEETS.slice(3, 5).map((worksheet) => (
                <WorksheetCard
                  key={worksheet.id}
                  worksheet={worksheet}
                  onDownload={downloadPDF}
                  onPreview={openPreview}
                />
              ))}
            </div>
          </div>
        </section>

        {/* Community Guidelines */}
        <section className="rounded-3xl border border-brand-teal/10 bg-white p-8 shadow-xl">
          <div className="mx-auto max-w-4xl">
            <h2 className="mb-8 text-center text-3xl font-bold text-brand-tealDark">
              PlayThinkers Community Guidelines
            </h2>

            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <GuidelineItem
                title="Be Creative"
                description="Share unique ideas and creative solutions to puzzles."
              />
              <GuidelineItem
                title="Share Learning"
                description="Help fellow PlayThinkers learn and grow together."
              />
              <GuidelineItem
                title="Play Fair"
                description="Respect all community members in discussions and activities."
              />
              <GuidelineItem
                title="Keep it Fun"
                description="Maintain a positive and engaging learning environment."
              />
            </div>
          </div>
        </section>

        {/* Sharing Section */}
        <section className="mb-8 mt-16 text-center">
          <div className="rounded-3xl bg-gradient-to-r from-brand-teal to-brand-tealDark p-8 text-white shadow-xl">
            <h3 className="mb-4 text-2xl font-bold">Loving the PlayThinkers Experience?</h3>
            <p className="mb-6 text-lg opacity-90">
              Keep visiting this page for more printable worksheets and exciting content.
            </p>

            {/* Copy Link Option */}
            <div className="mb-8">
              <button
                onClick={copyCommunityLink}
                className="mb-3 inline-flex items-center gap-2 rounded-full bg-white/20 px-6 py-3 text-white backdrop-blur-sm transition-colors hover:bg-white/30"
              >
                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
                  />
                </svg>
                Share with your friends
              </button>
              {copySuccess && (
                <p className="text-sm text-green-200">
                  ✓ Community link copied! Share through WhatsApp or other platforms.
                </p>
              )}
            </div>

            {/* OR Divider */}
            <div className="mb-6 flex items-center justify-center">
              <div className="h-px w-16 bg-white/30"></div>
              <span className="mx-4 text-sm text-white/70">OR</span>
              <div className="h-px w-16 bg-white/30"></div>
            </div>

            {/* WhatsApp Invite Option */}
            {!showWhatsappForm ? (
              <button
                onClick={() => setShowWhatsappForm(true)}
                className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-green-500 to-green-600 px-6 py-3 text-white shadow-lg transition-all hover:scale-105 hover:shadow-xl"
              >
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" />
                </svg>
                Invite via WhatsApp
              </button>
            ) : (
              <div className="mx-auto max-w-md rounded-2xl bg-white/10 p-6 backdrop-blur-sm">
                <h4 className="mb-4 text-lg font-semibold">Invite Friend via WhatsApp</h4>

                {/* Status Message */}
                {inviteStatus && (
                  <div
                    className={`mb-4 rounded-lg p-3 text-sm ${
                      inviteStatus.success
                        ? "bg-green-500/20 text-green-100"
                        : "bg-red-500/20 text-red-100"
                    }`}
                  >
                    {inviteStatus.message}
                  </div>
                )}

                <div className="space-y-4">
                  <input
                    type="text"
                    placeholder="Friend's Name"
                    value={friendName}
                    onChange={(e) => setFriendName(e.target.value)}
                    className="w-full rounded-full border border-white/30 bg-white/20 px-4 py-3 text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-white/50"
                    disabled={sendingInvite}
                  />
                  <input
                    type="tel"
                    placeholder="Friend's 10-digit Phone Number"
                    value={friendNumber}
                    onChange={(e) => setFriendNumber(e.target.value)}
                    className="w-full rounded-full border border-white/30 bg-white/20 px-4 py-3 text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-white/50"
                    disabled={sendingInvite}
                  />
                  <div className="flex gap-3">
                    <button
                      onClick={handleWhatsappInvite}
                      disabled={sendingInvite}
                      className="flex-1 rounded-full bg-gradient-to-r from-green-500 to-green-600 px-6 py-3 text-white shadow-lg hover:scale-105 disabled:cursor-not-allowed disabled:opacity-70"
                    >
                      {sendingInvite ? (
                        <span className="flex items-center justify-center gap-2">
                          <div className="h-4 w-4 animate-spin rounded-full border-b-2 border-white"></div>
                          Sending...
                        </span>
                      ) : (
                        "Send Invite via Jio Interakt"
                      )}
                    </button>
                    <button
                      onClick={() => {
                        setShowWhatsappForm(false);
                        setInviteStatus(null);
                      }}
                      disabled={sendingInvite}
                      className="flex-1 rounded-full border border-white/30 bg-white/20 px-6 py-3 text-white backdrop-blur-sm hover:bg-white/30 disabled:cursor-not-allowed disabled:opacity-70"
                    >
                      Cancel
                    </button>
                  </div>

                  <p className="mt-4 text-center text-xs text-white/60">
                    Using Jio Interakt for reliable WhatsApp message delivery
                  </p>
                </div>
              </div>
            )}
          </div>
        </section>

        {/* More Coming Soon */}
        <section className="rounded-3xl border border-brand-teal/10 bg-white p-8 text-center shadow-xl">
          <h3 className="mb-4 text-2xl font-bold text-brand-tealDark">
            More Exciting Content Coming Soon!
          </h3>
          <p className="text-lg text-gray-600">
            Stay tuned for weekly puzzles, monthly challenges, and interactive learning games.
          </p>
        </section>
      </main>

      {/* PDF Preview Modal */}
      {previewPdf && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-75 p-4">
          <div className="relative w-full max-w-4xl rounded-lg bg-white p-4">
            <button
              onClick={closePreview}
              className="absolute right-4 top-4 z-10 rounded-full bg-white p-2 shadow-lg hover:bg-gray-100"
            >
              <svg
                className="h-6 w-6 text-gray-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
            <div className="h-[80vh]">
              <iframe src={previewPdf} className="h-full w-full rounded-md" title="PDF Preview" />
            </div>
            <div className="mt-4 flex justify-center">
              <button
                onClick={() =>
                  downloadPDF(
                    previewPdf,
                    previewPdf.split("/").pop()?.replace(".pdf", "") || "Worksheet"
                  )
                }
                className="mr-3 rounded-lg bg-brand-teal px-6 py-2 text-white hover:bg-brand-tealDark"
              >
                Download
              </button>
              <button
                onClick={closePreview}
                className="rounded-lg border border-gray-300 bg-white px-6 py-2 text-gray-700 hover:bg-gray-50"
              >
                Close Preview
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <SiteFooter />
    </div>
  );
}

// Worksheet Card Component
function WorksheetCard({
  worksheet,
  onDownload,
  onPreview,
}: {
  worksheet: Worksheet;
  onDownload: (pdfPath: string, title: string) => void;
  onPreview: (pdfPath: string) => void;
}) {
  // Function to get worksheet number from filename
  const getWorksheetNumber = (pdfPath: string) => {
    const filename = pdfPath.split("/").pop() || "";
    const match = filename.match(/Worksheet(\d+)/);
    return match ? match[1] : "";
  };

  const worksheetNumber = getWorksheetNumber(worksheet.pdfPath);

  return (
    <div className="flex flex-col overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm transition-all hover:shadow-md">
      {/* Worksheet Header with Number */}
      <div className="border-b border-gray-100 bg-gradient-to-r from-brand-teal/5 to-brand-coral/5 p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-r from-brand-teal to-brand-coral">
              <span className="text-sm font-bold text-white">WS</span>
            </div>
            <div>
              <div className="text-xs font-medium text-brand-tealDark opacity-80">Worksheet</div>
              <div className="text-lg font-bold text-brand-tealDark">#{worksheetNumber}</div>
            </div>
          </div>
          <div
            className={`rounded-full px-3 py-1 text-xs font-medium ${
              worksheet.difficulty === "Beginner"
                ? "bg-green-100 text-green-800"
                : worksheet.difficulty === "Intermediate"
                  ? "bg-yellow-100 text-yellow-800"
                  : "bg-red-100 text-red-800"
            }`}
          >
            {worksheet.difficulty}
          </div>
        </div>
      </div>

      {/* Worksheet Content */}
      <div className="flex flex-1 flex-col p-6">
        <h3 className="mb-3 text-xl font-bold text-brand-tealDark">{worksheet.title}</h3>
        <p className="mb-6 flex-1 text-sm leading-relaxed text-gray-600">{worksheet.description}</p>

        {/* Category */}
        <div className="mb-6">
          <div className="inline-flex items-center gap-2 rounded-full bg-gray-100 px-3 py-1">
            <svg className="h-3 w-3 text-brand-teal" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M17.707 9.293a1 1 0 010 1.414l-7 7a1 1 0 01-1.414 0l-7-7A.997.997 0 012 10V5a3 3 0 013-3h5c.256 0 .512.098.707.293l7 7zM5 6a1 1 0 100-2 1 1 0 000 2z"
                clipRule="evenodd"
              />
            </svg>
            <span className="text-xs font-medium text-gray-700">{worksheet.category}</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3">
          <button
            onClick={() => onPreview(worksheet.pdfPath)}
            className="flex-1 rounded-lg border border-brand-teal bg-white px-4 py-3 text-sm font-medium text-brand-teal transition-all hover:bg-brand-teal/5 hover:shadow-sm"
          >
            <div className="flex items-center justify-center gap-2">
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                />
              </svg>
              Preview
            </div>
          </button>
          <button
            onClick={() => onDownload(worksheet.pdfPath, worksheet.title)}
            className="flex-1 rounded-lg bg-gradient-to-r from-brand-teal to-brand-coral px-4 py-3 text-sm font-medium text-white shadow-sm transition-all hover:scale-105 hover:shadow-md"
          >
            <div className="flex items-center justify-center gap-2">
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                />
              </svg>
              Download
            </div>
          </button>
        </div>
      </div>
    </div>
  );
}

// Guideline Item Component
function GuidelineItem({ title, description }: { title: string; description: string }) {
  return (
    <div className="flex items-start space-x-4 rounded-xl bg-brand-grayBg p-4 shadow-sm">
      <div className="mt-1 flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-brand-teal">
        <svg className="h-4 w-4 text-white" fill="currentColor" viewBox="0 0 20 20">
          <path
            fillRule="evenodd"
            d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
            clipRule="evenodd"
          />
        </svg>
      </div>
      <div>
        <h4 className="mb-1 font-semibold text-brand-tealDark">{title}</h4>
        <p className="text-sm text-gray-600">{description}</p>
      </div>
    </div>
  );
}

"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import SiteFooter from "@/components/Footer";
import Community from "@/components/Community";
import Image from "next/image";
import Head from "next/head";

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

const INTERAKT_API_KEY = "Basic QTc1emFobGthSVpxRGp1aWtRNE5aaDdCU0xGNFk5LXRFZ3ZXYkRySDZjbzo=";
const INTERAKT_BASE_URL = "https://api.interakt.ai/v1/public";

const WHATSAPP_TEMPLATES = {
  COMMUNITY_INVITE: "community_invite",
  WELCOME: "community_welcome",
};

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

/* ============================================================
   SHARED HEAD / SEO COMPONENT
============================================================ */
function CommunityPageHead() {
  return (
    <Head>
      <title>PlayThinkers Community – Free Worksheets & Learning Activities | Logicology</title>
      <meta
        name="description"
        content="Join the PlayThinkers Community by Logicology to access exclusive printable worksheets, logic puzzles, maze games, word searches, and creative activities for kids. Free to join!"
      />
      <meta
        name="keywords"
        content="PlayThinkers community, free worksheets for kids, printable puzzles, maze games, word search, colouring activities, logic puzzles, Logicology, educational activities, kids learning, critical thinking worksheets"
      />
      <meta
        name="robots"
        content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1"
      />
      <meta name="author" content="Logicology" />
      <meta name="publisher" content="Logicology" />
      <link rel="canonical" href="https://www.logicology.in/Community" />

      {/* Open Graph */}
      <meta property="og:type" content="website" />
      <meta property="og:url" content="https://www.logicology.in/Community" />
      <meta property="og:site_name" content="Logicology" />
      <meta
        property="og:title"
        content="PlayThinkers Community – Free Worksheets & Kids Activities"
      />
      <meta
        property="og:description"
        content="Join thousands of families in the PlayThinkers Community. Get free printable worksheets, logic puzzles, and creative activities for kids of all ages."
      />
      <meta
        property="og:image"
        content="https://ik.imagekit.io/pratik2002/PLAY%20THINKERS%20LOGO%20WHITE%20VERSION.png?tr=w-1200,h-630,c-at_max"
      />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta
        property="og:image:alt"
        content="PlayThinkers Community by Logicology – free educational worksheets for kids"
      />
      <meta property="og:locale" content="en_IN" />

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:url" content="https://www.logicology.in/Community" />
      <meta name="twitter:title" content="PlayThinkers Community – Free Worksheets for Kids" />
      <meta
        name="twitter:description"
        content="Access exclusive printable worksheets, logic puzzles, and creative activities. Join the PlayThinkers Community today!"
      />
      <meta
        name="twitter:image"
        content="https://ik.imagekit.io/pratik2002/PLAY%20THINKERS%20LOGO%20WHITE%20VERSION.png?tr=w-1200,h-630,c-at_max"
      />
      <meta
        name="twitter:image:alt"
        content="PlayThinkers Community by Logicology – educational worksheets for kids"
      />

      {/* Schema.org — WebPage */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebPage",
            name: "PlayThinkers Community",
            url: "https://www.logicology.in/Community",
            description:
              "Join the PlayThinkers Community to access exclusive printable worksheets, logic puzzles, maze games, and creative activities for kids.",
            publisher: {
              "@type": "Organization",
              name: "Logicology",
              url: "https://www.logicology.in",
              logo: "https://ik.imagekit.io/pratik11/logicology-logo.png",
            },
            breadcrumb: {
              "@type": "BreadcrumbList",
              itemListElement: [
                {
                  "@type": "ListItem",
                  position: 1,
                  name: "Home",
                  item: "https://www.logicology.in",
                },
                {
                  "@type": "ListItem",
                  position: 2,
                  name: "Community",
                  item: "https://www.logicology.in/Community",
                },
              ],
            },
          }),
        }}
      />

      {/* Schema.org — ItemList of worksheets */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "ItemList",
            name: "PlayThinkers Community Worksheets",
            description:
              "Free printable worksheets for kids including maze games, word searches, colouring activities, and logic puzzles.",
            url: "https://www.logicology.in/Community",
            itemListElement: WORKSHEETS.map((ws, index) => ({
              "@type": "ListItem",
              position: index + 1,
              item: {
                "@type": "CreativeWork",
                name: `${ws.title} Worksheet`,
                description: ws.description,
                educationalUse: "Practice",
                learningResourceType: "Worksheet",
                publisher: { "@type": "Organization", name: "Logicology" },
              },
            })),
          }),
        }}
      />
    </Head>
  );
}

/* ============================================================
   SHARED HEADER COMPONENT
============================================================ */
function CommunityHeader({
  userData,
  onLogout,
}: {
  userData: UserData | null;
  onLogout?: () => void;
}) {
  const router = useRouter();

  return (
    <header className="border-b border-gray-200 bg-gradient-to-r from-brand-teal to-brand-tealDark shadow-lg">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center justify-between gap-4 py-6 sm:flex-row">
          <div className="flex flex-col items-center gap-4 sm:flex-row">
            <Link href="/" aria-label="Go to Logicology homepage">
              <div className="relative h-12 w-48">
                <Image
                  src="https://ik.imagekit.io/pratik2002/PLAY%20THINKERS%20LOGO%20WHITE%20VERSION.png?updatedAt=1767353542986"
                  alt="PlayThinkers by Logicology – community logo"
                  fill
                  className="object-contain"
                  priority
                />
              </div>
            </Link>
            <div className="flex items-center gap-2">
              <span className="rounded-full bg-white/20 px-4 py-1.5 text-sm font-medium text-white backdrop-blur-sm">
                PlayThinkers Community
              </span>
              <button
                onClick={() => router.push("/")}
                aria-label="Back to Logicology homepage"
                className="ml-2 rounded-full bg-white/20 px-4 py-1.5 text-sm font-medium text-white backdrop-blur-sm transition-colors hover:bg-white/30"
              >
                ← Back to Homepage
              </button>
            </div>
          </div>

          {userData && onLogout && (
            <div className="flex items-center space-x-4">
              <div className="text-right">
                <p className="text-sm font-medium text-white">{userData.name}</p>
                <p className="text-xs text-white/80">{userData.email}</p>
              </div>
              <button
                onClick={onLogout}
                aria-label="Log out of PlayThinkers Community"
                className="rounded-full border border-white/30 bg-white/10 px-4 py-2 text-sm text-white backdrop-blur-sm transition-colors hover:bg-white/20"
              >
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

/* ============================================================
   MAIN PAGE COMPONENT
============================================================ */
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
      const storedUserData = localStorage.getItem("userData");
      if (!token || !storedUserData) {
        setIsLoading(false);
        return;
      }
      try {
        setUserData(JSON.parse(storedUserData));
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

  const cleanPhoneNumber = (phoneNumber: string): string => phoneNumber.replace(/\D/g, "");

  const extractCountryCode = (
    phoneNumber: string
  ): { countryCode: string; cleanedNumber: string } => {
    const cleaned = cleanPhoneNumber(phoneNumber);
    if (cleaned.startsWith("91") && cleaned.length >= 12) {
      return { countryCode: "+91", cleanedNumber: cleaned.substring(2) };
    }
    return {
      countryCode: "+91",
      cleanedNumber: cleaned.length > 10 ? cleaned.slice(-10) : cleaned,
    };
  };

  const sendInteraktMessage = async (
    phoneNumber: string,
    templateName: string,
    bodyValues: string[]
  ): Promise<{ success: boolean; messageId?: string; error?: string }> => {
    try {
      const { countryCode, cleanedNumber } = extractCountryCode(phoneNumber);
      if (cleanedNumber.length !== 10) {
        throw new Error("Invalid phone number. Please enter a 10-digit Indian mobile number.");
      }

      const trackUserResponse = await fetch(`${INTERAKT_BASE_URL}/track/users/`, {
        method: "POST",
        headers: {
          Authorization: INTERAKT_API_KEY,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          phoneNumber: cleanedNumber,
          countryCode,
          traits: {
            name: friendName,
            source: "community_invite",
            invitedBy: userData?.name || "PlayThinkers Community",
            invitedByEmail: userData?.email || "",
            inviteDate: new Date().toISOString(),
          },
        }),
      });
      console.log("Track user result:", await trackUserResponse.json());

      const messageResponse = await fetch(`${INTERAKT_BASE_URL}/message/`, {
        method: "POST",
        headers: {
          Authorization: INTERAKT_API_KEY,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          countryCode,
          phoneNumber: cleanedNumber,
          type: "Template",
          template: {
            name: templateName,
            languageCode: "en",
            bodyValues,
          },
        }),
      });
      const messageResult = await messageResponse.json();
      console.log("Message result:", messageResult);

      if (!messageResult.id) {
        throw new Error(`Failed to send WhatsApp message: ${JSON.stringify(messageResult)}`);
      }
      return { success: true, messageId: messageResult.id };
    } catch (error: any) {
      console.error("Error sending Interakt message:", error);
      return { success: false, error: error.message || "Failed to send WhatsApp message" };
    }
  };

  const handleWhatsappInvite = async () => {
    if (!friendName.trim() || !friendNumber.trim()) {
      setInviteStatus({ success: false, message: "Please enter both name and phone number" });
      setTimeout(() => setInviteStatus(null), 3000);
      return;
    }
    setSendingInvite(true);
    setInviteStatus(null);
    try {
      const bodyValues = [
        friendName,
        userData?.name || "A friend",
        "PlayThinkers Community",
        "https://www.logicology.in/Community",
      ];
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
        setShowWhatsappForm(false);
        setFriendName("");
        setFriendNumber("");
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
    const filename = pdfPath.split("/").pop() || `${title.replace(/\s+/g, "_")}.pdf`;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const openPreview = (pdfPath: string) => setPreviewPdf(pdfPath);
  const closePreview = () => setPreviewPdf(null);

  const getPreviewTitle = (pdfPath: string) => {
    const filename = pdfPath.split("/").pop() || "Worksheet";
    return filename.replace(".pdf", "").replace(/Worksheet(\d+)/, "Worksheet $1");
  };

  /* ── Loading ── */
  if (isLoading) {
    return (
      <>
        <CommunityPageHead />
        <div className="flex min-h-screen items-center justify-center bg-brand-grayBg">
          <div className="text-center">
            <div
              className="mx-auto h-16 w-16 animate-spin rounded-full border-b-2 border-brand-teal"
              role="status"
              aria-label="Loading PlayThinkers Community"
            />
            <p className="mt-4 text-brand-tealDark">Loading PlayThinkers Community...</p>
          </div>
        </div>
      </>
    );
  }

  /* ── Logged-out view ── */
  if (!userData) {
    return (
      <div className="min-h-screen bg-brand-grayBg">
        <CommunityPageHead />
        <CommunityHeader userData={null} />
        <Community />

        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
          <section
            aria-labelledby="benefits-heading"
            className="rounded-3xl border border-brand-teal/10 bg-white p-8 shadow-lg"
          >
            <h2
              id="benefits-heading"
              className="mb-6 text-center text-2xl font-bold text-brand-tealDark"
            >
              What You'll Get as a Community Member
            </h2>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
              {[
                {
                  emoji: "📚",
                  bg: "bg-brand-teal/10",
                  title: "Exclusive Worksheets",
                  desc: "Monthly printable puzzles and activities",
                },
                {
                  emoji: "🧩",
                  bg: "bg-brand-coral/10",
                  title: "Learning Games",
                  desc: "Interactive games to develop critical thinking",
                },
                {
                  emoji: "🎯",
                  bg: "bg-brand-gold/10",
                  title: "Progress Tracking",
                  desc: "Track your child's learning journey",
                },
                {
                  emoji: "🏆",
                  bg: "bg-brand-pink/10",
                  title: "Achievements",
                  desc: "Earn badges and certificates",
                },
              ].map(({ emoji, bg, title, desc }) => (
                <div key={title} className="rounded-xl bg-brand-grayBg p-6 text-center">
                  <div
                    className={`mb-4 inline-flex h-16 w-16 items-center justify-center rounded-full ${bg} text-2xl`}
                    aria-hidden="true"
                  >
                    {emoji}
                  </div>
                  <h3 className="mb-2 font-semibold text-brand-tealDark">{title}</h3>
                  <p className="text-sm text-gray-600">{desc}</p>
                </div>
              ))}
            </div>
            <p className="mt-8 text-center text-gray-600">
              Join the community to unlock all these benefits and more!
            </p>
          </section>
        </div>

        <SiteFooter />
      </div>
    );
  }

  /* ── Logged-in view ── */
  return (
    <div className="min-h-screen bg-brand-grayBg">
      <CommunityPageHead />
      <CommunityHeader userData={userData} onLogout={handleLogout} />

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Welcome */}
        <section className="mb-12 text-center" aria-labelledby="welcome-heading">
          <div className="mx-auto max-w-3xl">
            <h1
              id="welcome-heading"
              className="mb-6 bg-gradient-to-r from-brand-teal to-brand-coral bg-clip-text text-4xl font-bold text-transparent md:text-5xl"
            >
              Welcome to the PlayThinkers Community
            </h1>
            <p className="mb-8 text-xl text-brand-tealDark">
              We're thrilled to have you on board, {userData.name}! Get ready for exclusive content
              and premium worksheets.
            </p>
            <div className="mx-auto h-1 w-24 bg-gradient-to-r from-brand-teal to-brand-coral" />
          </div>
        </section>

        {/* Worksheets */}
        <section
          aria-labelledby="worksheets-heading"
          className="mb-12 rounded-3xl border border-brand-teal/10 bg-white p-8 shadow-xl"
        >
          <div className="text-center">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-brand-teal to-brand-teal px-6 py-3 text-sm font-medium text-white shadow-md">
              <svg
                className="h-5 w-5"
                aria-hidden="true"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
              Exclusive Worksheets Available!
            </div>

            <h2 id="worksheets-heading" className="mb-4 text-3xl font-bold text-brand-tealDark">
              Download Your Premium Worksheets
            </h2>
            <p className="mx-auto mb-8 max-w-2xl text-lg text-gray-600">
              Access our exclusive collection of PlayThinkers worksheets designed to enhance
              critical thinking and problem-solving skills for kids of all ages.
            </p>

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
            <div className="mx-auto mt-8 grid max-w-4xl grid-cols-1 gap-6 md:grid-cols-2">
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
        <section
          aria-labelledby="guidelines-heading"
          className="rounded-3xl border border-brand-teal/10 bg-white p-8 shadow-xl"
        >
          <div className="mx-auto max-w-4xl">
            <h2
              id="guidelines-heading"
              className="mb-8 text-center text-3xl font-bold text-brand-tealDark"
            >
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

        {/* Sharing */}
        <section aria-labelledby="sharing-heading" className="mb-8 mt-16 text-center">
          <div className="rounded-3xl bg-gradient-to-r from-brand-teal to-brand-tealDark p-8 text-white shadow-xl">
            <h3 id="sharing-heading" className="mb-4 text-2xl font-bold">
              Loving the PlayThinkers Experience?
            </h3>
            <p className="mb-6 text-lg opacity-90">
              Keep visiting this page for more printable worksheets and exciting content.
            </p>

            <div className="mb-8">
              <button
                onClick={copyCommunityLink}
                aria-label="Copy community link to share with friends"
                className="mb-3 inline-flex items-center gap-2 rounded-full bg-white/20 px-6 py-3 text-white backdrop-blur-sm transition-colors hover:bg-white/30"
              >
                <svg
                  aria-hidden="true"
                  className="h-5 w-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
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
                <p role="status" className="text-sm text-green-200">
                  ✓ Community link copied! Share through WhatsApp or other platforms.
                </p>
              )}
            </div>

            <div className="mb-6 flex items-center justify-center">
              <div className="h-px w-16 bg-white/30" />
              <span className="mx-4 text-sm text-white/70">OR</span>
              <div className="h-px w-16 bg-white/30" />
            </div>

            {!showWhatsappForm ? (
              <button
                onClick={() => setShowWhatsappForm(true)}
                aria-label="Invite a friend to PlayThinkers Community via WhatsApp"
                className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-green-500 to-green-600 px-6 py-3 text-white shadow-lg transition-all hover:scale-105 hover:shadow-xl"
              >
                <svg aria-hidden="true" className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" />
                </svg>
                Invite via WhatsApp
              </button>
            ) : (
              <div className="mx-auto max-w-md rounded-2xl bg-white/10 p-6 backdrop-blur-sm">
                <h4 className="mb-4 text-lg font-semibold">Invite Friend via WhatsApp</h4>

                {inviteStatus && (
                  <div
                    role="status"
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
                    aria-label="Friend's name"
                    disabled={sendingInvite}
                    className="w-full rounded-full border border-white/30 bg-white/20 px-4 py-3 text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-white/50"
                  />
                  <input
                    type="tel"
                    placeholder="Friend's 10-digit Phone Number"
                    value={friendNumber}
                    onChange={(e) => setFriendNumber(e.target.value)}
                    aria-label="Friend's 10-digit phone number"
                    disabled={sendingInvite}
                    className="w-full rounded-full border border-white/30 bg-white/20 px-4 py-3 text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-white/50"
                  />
                  <div className="flex gap-3">
                    <button
                      onClick={handleWhatsappInvite}
                      disabled={sendingInvite}
                      aria-label="Send WhatsApp invitation"
                      className="flex-1 rounded-full bg-gradient-to-r from-green-500 to-green-600 px-6 py-3 text-white shadow-lg hover:scale-105 disabled:cursor-not-allowed disabled:opacity-70"
                    >
                      {sendingInvite ? (
                        <span className="flex items-center justify-center gap-2">
                          <div
                            className="h-4 w-4 animate-spin rounded-full border-b-2 border-white"
                            aria-hidden="true"
                          />
                          Sending...
                        </span>
                      ) : (
                        "Send Invite"
                      )}
                    </button>
                    <button
                      onClick={() => {
                        setShowWhatsappForm(false);
                        setInviteStatus(null);
                      }}
                      disabled={sendingInvite}
                      aria-label="Cancel WhatsApp invite"
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

        {/* Coming Soon */}
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
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-75 p-4"
          role="dialog"
          aria-modal="true"
          aria-label={`PDF preview: ${getPreviewTitle(previewPdf)}`}
        >
          <div className="relative w-full max-w-4xl rounded-lg bg-white p-4">
            <button
              onClick={closePreview}
              aria-label="Close PDF preview"
              className="absolute right-4 top-4 z-10 rounded-full bg-white p-2 shadow-lg hover:bg-gray-100"
            >
              <svg
                aria-hidden="true"
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
              <iframe
                src={previewPdf}
                className="h-full w-full rounded-md"
                title={`Preview of ${getPreviewTitle(previewPdf)}`}
              />
            </div>
            <div className="mt-4 flex justify-center gap-3">
              <button
                onClick={() => downloadPDF(previewPdf, getPreviewTitle(previewPdf))}
                aria-label={`Download ${getPreviewTitle(previewPdf)}`}
                className="rounded-lg bg-brand-teal px-6 py-2 text-white hover:bg-brand-tealDark"
              >
                Download
              </button>
              <button
                onClick={closePreview}
                aria-label="Close PDF preview"
                className="rounded-lg border border-gray-300 bg-white px-6 py-2 text-gray-700 hover:bg-gray-50"
              >
                Close Preview
              </button>
            </div>
          </div>
        </div>
      )}

      <SiteFooter />
    </div>
  );
}

/* ============================================================
   WORKSHEET CARD COMPONENT
============================================================ */
function WorksheetCard({
  worksheet,
  onDownload,
  onPreview,
}: {
  worksheet: Worksheet;
  onDownload: (pdfPath: string, title: string) => void;
  onPreview: (pdfPath: string) => void;
}) {
  const getWorksheetNumber = (pdfPath: string) => {
    const filename = pdfPath.split("/").pop() || "";
    const match = filename.match(/Worksheet(\d+)/);
    return match ? match[1] : "";
  };

  const worksheetNumber = getWorksheetNumber(worksheet.pdfPath);

  return (
    <article
      aria-label={`Worksheet ${worksheetNumber}: ${worksheet.title}`}
      className="flex flex-col overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm transition-all hover:shadow-md"
    >
      {/* Card Header */}
      <div className="border-b border-gray-100 bg-gradient-to-r from-brand-teal/5 to-brand-coral/5 p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div
              aria-hidden="true"
              className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-r from-brand-teal to-brand-teal"
            >
              <span className="text-sm font-bold text-white">WS</span>
            </div>
            <div>
              <div className="text-xs font-medium text-brand-tealDark opacity-80">Worksheet</div>
              <div className="text-lg font-bold text-brand-tealDark">#{worksheetNumber}</div>
            </div>
          </div>
          {worksheet.difficulty && (
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
          )}
        </div>
      </div>

      {/* Card Body */}
      <div className="flex flex-1 flex-col p-6">
        <h3 className="mb-3 text-xl font-bold text-brand-tealDark">{worksheet.title}</h3>
        <p className="mb-6 flex-1 text-sm leading-relaxed text-gray-600">{worksheet.description}</p>

        <div className="flex gap-3">
          <button
            onClick={() => onPreview(worksheet.pdfPath)}
            aria-label={`Preview ${worksheet.title} worksheet`}
            className="flex-1 rounded-lg border border-brand-teal bg-white px-4 py-3 text-sm font-medium text-brand-teal transition-all hover:bg-brand-teal/5 hover:shadow-sm"
          >
            <span className="flex items-center justify-center gap-2">
              <svg
                aria-hidden="true"
                className="h-4 w-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
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
            </span>
          </button>
          <button
            onClick={() => onDownload(worksheet.pdfPath, worksheet.title)}
            aria-label={`Download ${worksheet.title} worksheet as PDF`}
            className="flex-1 rounded-lg bg-gradient-to-r from-brand-teal to-brand-teal px-4 py-3 text-sm font-medium text-white shadow-sm transition-all hover:scale-105 hover:shadow-md"
          >
            <span className="flex items-center justify-center gap-2">
              <svg
                aria-hidden="true"
                className="h-4 w-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                />
              </svg>
              Download
            </span>
          </button>
        </div>
      </div>
    </article>
  );
}

/* ============================================================
   GUIDELINE ITEM COMPONENT
============================================================ */
function GuidelineItem({ title, description }: { title: string; description: string }) {
  return (
    <div className="flex items-start space-x-4 rounded-xl bg-brand-grayBg p-4 shadow-sm">
      <div
        aria-hidden="true"
        className="mt-1 flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-brand-teal"
      >
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

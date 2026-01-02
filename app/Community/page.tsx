"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import SiteFooter from "@/components/Footer";
import Community from "@/components/Community"; // Import your existing Community component

interface UserData {
  id: string;
  name: string;
  email: string;
  phone: string;
}

export default function CommunityPage() {
  const [userData, setUserData] = useState<UserData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showWhatsappForm, setShowWhatsappForm] = useState(false);
  const [friendName, setFriendName] = useState("");
  const [friendNumber, setFriendNumber] = useState("");
  const [copySuccess, setCopySuccess] = useState(false);
  const router = useRouter();

  useEffect(() => {
    // Check if user is authenticated
    const checkAuth = () => {
      if (typeof window === "undefined") return;

      const token = localStorage.getItem("communityToken");
      const userData = localStorage.getItem("userData");

      if (!token || !userData) {
        setIsLoading(false);
        return; // Don't redirect, just show Community component
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

  const handleLoginSuccess = (userData: UserData) => {
    setUserData(userData);
  };

  const copyCommunityLink = () => {
    const link = "https://www.logicology.in/Community";
    navigator.clipboard.writeText(link);
    setCopySuccess(true);
    setTimeout(() => setCopySuccess(false), 3000);
  };

  const handleWhatsappInvite = () => {
    if (!friendName.trim() || !friendNumber.trim()) {
      alert("Please enter both name and phone number");
      return;
    }

    const message = `Your friend ${friendName} has invited you to join the PlayThinkers community by Logicology. Join now to access fun learning worksheets and lots of other exciting content. Visit: https://www.logicology.in/Community`;
    const whatsappUrl = `https://wa.me/${friendNumber.replace(/\D/g, "")}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, "_blank");
    setShowWhatsappForm(false);
    setFriendName("");
    setFriendNumber("");
  };

  const downloadPDF = () => {
    // For now, create a dummy download - replace with actual PDF URL
    const pdfUrl = "/playthinkers-january-2026-worksheet.pdf";
    const link = document.createElement("a");
    link.href = pdfUrl;
    link.download = "PlayThinkers_January_2026_Worksheet.pdf";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
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
                <p className="text-sm text-gray-600">Interactive games to develop critical thinking</p>
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

  // If user is logged in, show the community content
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

        {/* Worksheet Section */}
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
              New Worksheet Available!
            </div>
            <h2 className="mb-4 text-3xl font-bold text-brand-tealDark">
              January 2026 Worksheet Set is available now!
            </h2>
            <p className="mx-auto mb-8 max-w-2xl text-lg text-gray-600">
              Download our exclusive PlayThinkers worksheet designed to enhance critical thinking
              and problem-solving skills for kids.
            </p>

            <button
              onClick={downloadPDF}
              className="group mb-8 inline-flex items-center gap-3 rounded-full bg-gradient-to-r from-brand-teal to-brand-coral px-8 py-4 text-lg font-semibold text-white shadow-lg transition-all hover:scale-105 hover:shadow-xl active:scale-95"
            >
              <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                />
              </svg>
              Download PDF Worksheet
            </button>

            {/* Preview of worksheet types */}
            <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
              <WorksheetType
                title="Pattern Recognition"
                icon="🔍"
                bgColor="bg-brand-teal/10"
                textColor="text-brand-tealDark"
              />
              <WorksheetType
                title="Logical Puzzles"
                icon="🧩"
                bgColor="bg-brand-coral/10"
                textColor="text-brand-coral"
              />
              <WorksheetType
                title="Memory Games"
                icon="🧠"
                bgColor="bg-brand-gold/10"
                textColor="text-brand-tealDark"
              />
              <WorksheetType
                title="Creative Thinking"
                icon="🎨"
                bgColor="bg-brand-pink/10"
                textColor="text-brand-maroon"
              />
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
                <div className="space-y-4">
                  <input
                    type="text"
                    placeholder="Friend's Name"
                    value={friendName}
                    onChange={(e) => setFriendName(e.target.value)}
                    className="w-full rounded-full border border-white/30 bg-white/20 px-4 py-3 text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-white/50"
                  />
                  <input
                    type="tel"
                    placeholder="Friend's Phone Number"
                    value={friendNumber}
                    onChange={(e) => setFriendNumber(e.target.value)}
                    className="w-full rounded-full border border-white/30 bg-white/20 px-4 py-3 text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-white/50"
                  />
                  <div className="flex gap-3">
                    <button
                      onClick={handleWhatsappInvite}
                      className="flex-1 rounded-full bg-gradient-to-r from-green-500 to-green-600 px-6 py-3 text-white shadow-lg hover:scale-105"
                    >
                      Send Invite
                    </button>
                    <button
                      onClick={() => setShowWhatsappForm(false)}
                      className="flex-1 rounded-full border border-white/30 bg-white/20 px-6 py-3 text-white backdrop-blur-sm hover:bg-white/30"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </section>

        {/* More Coming Soon */}
        <section className="rounded-3xl border border-brand-teal/10 bg-white p-8 text-center shadow-xl">
          <h3 className="mb-4 text-2xl font-bold text-brand-tealDark">More Exciting Content Coming Soon!</h3>
          <p className="text-lg text-gray-600">
            Stay tuned for weekly puzzles, monthly challenges, and interactive learning games.
          </p>
        </section>
      </main>

      {/* Footer */}
      <SiteFooter />
    </div>
  );
}

// Worksheet Type Component
function WorksheetType({ 
  title, 
  icon, 
  bgColor, 
  textColor 
}: { 
  title: string; 
  icon: string; 
  bgColor: string;
  textColor: string;
}) {
  return (
    <div className="rounded-xl border border-gray-100 bg-white p-4 shadow-sm transition-transform hover:scale-105">
      <div className={`mb-3 h-12 w-12 rounded-lg ${bgColor} flex items-center justify-center text-2xl`}>
        {icon}
      </div>
      <h4 className={`font-semibold ${textColor}`}>{title}</h4>
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
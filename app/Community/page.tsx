"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import SiteFooter from "@/components/Footer";
import { trackSignUp, trackEvent } from "@/lib/gtag";

interface UserData {
  id: string;
  name: string;
  email: string;
  phone: string;
}

export default function CommunityPage() {
  const [userData, setUserData] = useState<UserData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    // Check if user is authenticated
    const checkAuth = () => {
      if (typeof window === "undefined") return;

      const token = localStorage.getItem("communityToken");
      const userData = localStorage.getItem("userData");

      if (!token || !userData) {
        router.push("/");
        return;
      }

      try {
        const user = JSON.parse(userData);
        setUserData(user);

        // Track community signup event when user accesses community page
        trackSignUp("community_page", user.email);
        trackEvent("community_access", {
          user_email: user.email,
          user_name: user.name,
        });
      } catch (error) {
        console.error("Error parsing user data:", error);
        router.push("/");
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
    router.push("/");
  };

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-brand-grayBg">
        <div className="text-center">
          <div className="mx-auto h-16 w-16 animate-spin rounded-full border-b-2 border-brand-teal"></div>
          <p className="mt-4 text-brand-tealDark">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-brand-grayBg">
      {/* Header */}
      <header className="border-b border-gray-200 bg-white shadow-sm">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-4">
            <div className="flex items-center">
              <Link href="/" className="text-2xl font-bold text-brand-tealDark">
                Logicology
              </Link>
              <span className="ml-4 rounded-full bg-brand-teal/10 px-3 py-1 text-sm font-medium text-brand-teal">
                Community
              </span>
            </div>

            <div className="flex items-center space-x-4">
              <div className="text-right">
                <p className="text-sm font-medium text-brand-tealDark">{userData?.name}</p>
                <p className="text-xs text-gray-500">{userData?.email}</p>
              </div>
              <button
                onClick={handleLogout}
                className="rounded-lg border border-brand-coral/30 px-4 py-2 text-sm text-brand-coral transition-colors hover:bg-brand-coral/5"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Welcome Section */}
        <section className="mb-12 text-center">
          <div className="mx-auto max-w-3xl">
            <h1 className="mb-6 text-4xl font-bold text-brand-tealDark md:text-5xl">
              Welcome to Our Exclusive Community
            </h1>
            <p className="mb-8 text-xl text-gray-600">
              We're thrilled to have you on board, {userData?.name}! Get ready for exclusive content
              and premium experiences.
            </p>
            <div className="mx-auto h-1 w-24 bg-brand-gold"></div>
          </div>
        </section>

        {/* Countdown Section */}
        <section className="mb-12 rounded-2xl border border-brand-teal/10 bg-white p-8 shadow-lg">
          <div className="text-center">
            <div className="mb-6 inline-flex items-center rounded-full bg-brand-teal/10 px-4 py-2 text-sm font-medium text-brand-teal">
              <svg className="mr-2 h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z"
                  clipRule="evenodd"
                />
              </svg>
              Launching Soon
            </div>
            <h2 className="mb-4 text-3xl font-bold text-brand-tealDark">
              Exclusive Content Coming Soon
            </h2>
            <p className="mx-auto mb-8 max-w-2xl text-lg text-gray-600">
              We will be publishing exclusive content for our community members starting from
              <span className="font-semibold text-brand-teal"> 1st Nov 2025</span>. Stay tuned for
              premium resources, early access, and member-only benefits.
            </p>

            <CountdownTimer />
          </div>
        </section>

        {/* Features Grid */}
        {/* <section className="mb-12">
          <h2 className="text-3xl font-bold text-brand-tealDark text-center mb-12">
            What's Coming for Our Community
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <FeatureCard
              icon="📚"
              title="Exclusive Resources"
              description="Access to premium content, tutorials, and resources not available to the public."
              color="teal"
            />
            <FeatureCard
              icon="🚀"
              title="Early Access"
              description="Be the first to try new features and provide feedback that shapes our products."
              color="coral"
            />
            <FeatureCard
              icon="💬"
              title="Private Discussions"
              description="Engage in meaningful conversations with like-minded community members."
              color="gold"
            />
            <FeatureCard
              icon="🎯"
              title="Expert Sessions"
              description="Live Q&A sessions and workshops with industry experts and thought leaders."
              color="teal"
            />
            <FeatureCard
              icon="📊"
              title="Industry Insights"
              description="Get insider knowledge and market trends before anyone else."
              color="coral"
            />
            <FeatureCard
              icon="🤝"
              title="Networking"
              description="Connect with professionals and expand your network in our exclusive community."
              color="gold"
            />
          </div>
        </section> */}

        {/* Community Guidelines */}
        <section className="rounded-2xl border border-brand-teal/10 bg-white p-8 shadow-lg">
          <div className="mx-auto max-w-4xl">
            <h2 className="mb-8 text-center text-3xl font-bold text-brand-tealDark">
              Community Guidelines
            </h2>

            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <GuidelineItem
                title="Be Respectful"
                description="Treat all community members with respect and kindness."
              />
              <GuidelineItem
                title="Share Knowledge"
                description="Contribute valuable insights and help fellow members."
              />
              <GuidelineItem
                title="Stay Professional"
                description="Maintain professional conduct in all interactions."
              />
              <GuidelineItem
                title="Keep it Confidential"
                description="Respect the privacy and confidentiality of community discussions."
              />
            </div>
          </div>
        </section>

        {/* Footer CTA */}
        <section className="mb-8 mt-16 text-center">
          <div className="rounded-2xl bg-gradient-to-r from-brand-teal to-brand-tealDark p-8 text-white">
            <h3 className="mb-4 text-2xl font-bold">Ready for the Launch?</h3>
            <p className="mb-6 text-lg opacity-90">
              Mark your calendar for November 1st, 2025 and get ready for an amazing community
              experience.
            </p>
            <div className="flex flex-col justify-center gap-4 sm:flex-row">
              <button className="rounded-lg bg-white px-6 py-3 font-semibold text-brand-teal transition-colors hover:bg-gray-100">
                Set Reminder
              </button>
              <button className="rounded-lg border border-white px-6 py-3 font-semibold text-white transition-colors hover:bg-white/10">
                Share with Friends
              </button>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <SiteFooter />
    </div>
  );
}

// Countdown Timer Component
function CountdownTimer() {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  useEffect(() => {
    const calculateTimeLeft = () => {
      const launchDate = new Date("2025-11-01T00:00:00").getTime();
      const now = new Date().getTime();
      const difference = launchDate - now;

      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
          minutes: Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60)),
          seconds: Math.floor((difference % (1000 * 60)) / 1000),
        });
      }
    };

    calculateTimeLeft();
    const timer = setInterval(calculateTimeLeft, 1000);

    return () => clearInterval(timer);
  }, []);

  const TimeUnit = ({ value, label }: { value: number; label: string }) => (
    <div className="text-center">
      <div className="min-w-[80px] rounded-lg border border-brand-teal/20 bg-white p-4">
        <span className="text-2xl font-bold text-brand-tealDark">{value}</span>
      </div>
      <span className="mt-2 block text-sm text-gray-600">{label}</span>
    </div>
  );

  return (
    <div className="mb-8 flex justify-center space-x-4">
      <TimeUnit value={timeLeft.days} label="Days" />
      <TimeUnit value={timeLeft.hours} label="Hours" />
      <TimeUnit value={timeLeft.minutes} label="Minutes" />
      <TimeUnit value={timeLeft.seconds} label="Seconds" />
    </div>
  );
}

// Feature Card Component
function FeatureCard({
  icon,
  title,
  description,
  color,
}: {
  icon: string;
  title: string;
  description: string;
  color: string;
}) {
  const colorClasses = {
    teal: "bg-brand-teal/10 text-brand-teal",
    coral: "bg-brand-coral/10 text-brand-coral",
    gold: "bg-brand-gold/10 text-brand-gold",
  };

  return (
    <div className="rounded-xl border border-gray-100 bg-white p-6 shadow-md transition-shadow hover:shadow-lg">
      <div
        className={`h-12 w-12 rounded-lg ${colorClasses[color as keyof typeof colorClasses]} mb-4 flex items-center justify-center text-xl`}
      >
        {icon}
      </div>
      <h3 className="mb-2 text-xl font-semibold text-brand-tealDark">{title}</h3>
      <p className="text-gray-600">{description}</p>
    </div>
  );
}

// Guideline Item Component
function GuidelineItem({ title, description }: { title: string; description: string }) {
  return (
    <div className="flex items-start space-x-4 rounded-lg bg-brand-grayBg p-4">
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

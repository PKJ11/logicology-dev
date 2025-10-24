"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import SiteFooter from "@/components/Footer";

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
        setUserData(JSON.parse(userData));
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
      <div className="min-h-screen bg-brand-grayBg flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-brand-teal mx-auto"></div>
          <p className="mt-4 text-brand-tealDark">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-brand-grayBg">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center">
              <Link href="/" className="text-2xl font-bold text-brand-tealDark">
                Logicology
              </Link>
              <span className="ml-4 px-3 py-1 bg-brand-teal/10 text-brand-teal text-sm font-medium rounded-full">
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
                className="px-4 py-2 text-sm text-brand-coral border border-brand-coral/30 rounded-lg hover:bg-brand-coral/5 transition-colors"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <section className="text-center mb-12">
          <div className="max-w-3xl mx-auto">
            <h1 className="text-4xl md:text-5xl font-bold text-brand-tealDark mb-6">
              Welcome to Our Exclusive Community
            </h1>
            <p className="text-xl text-gray-600 mb-8">
              We're thrilled to have you on board, {userData?.name}! Get ready for exclusive content and premium experiences.
            </p>
            <div className="w-24 h-1 bg-brand-gold mx-auto"></div>
          </div>
        </section>

        {/* Countdown Section */}
        <section className="bg-white rounded-2xl shadow-lg p-8 mb-12 border border-brand-teal/10">
          <div className="text-center">
            <div className="inline-flex items-center px-4 py-2 bg-brand-teal/10 text-brand-teal rounded-full text-sm font-medium mb-6">
              <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
              </svg>
              Launching Soon
            </div>
            <h2 className="text-3xl font-bold text-brand-tealDark mb-4">
              Exclusive Content Coming Soon
            </h2>
            <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
              We will be publishing exclusive content for our community members starting from 
              <span className="font-semibold text-brand-teal"> 1st Nov 2025</span>. Stay tuned for premium resources, early access, and member-only benefits.
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
        <section className="bg-white rounded-2xl shadow-lg p-8 border border-brand-teal/10">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-brand-tealDark text-center mb-8">
              Community Guidelines
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
        <section className="text-center mt-16 mb-8">
          <div className="bg-gradient-to-r from-brand-teal to-brand-tealDark rounded-2xl p-8 text-white">
            <h3 className="text-2xl font-bold mb-4">
              Ready for the Launch?
            </h3>
            <p className="text-lg mb-6 opacity-90">
              Mark your calendar for November 1st, 2025 and get ready for an amazing community experience.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="px-6 py-3 bg-white text-brand-teal font-semibold rounded-lg hover:bg-gray-100 transition-colors">
                Set Reminder
              </button>
              <button className="px-6 py-3 border border-white text-white font-semibold rounded-lg hover:bg-white/10 transition-colors">
                Share with Friends
              </button>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <SiteFooter/>
    </div>
  );
}

// Countdown Timer Component
function CountdownTimer() {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  });

  useEffect(() => {
    const calculateTimeLeft = () => {
      const launchDate = new Date('2025-11-01T00:00:00').getTime();
      const now = new Date().getTime();
      const difference = launchDate - now;

      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
          minutes: Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60)),
          seconds: Math.floor((difference % (1000 * 60)) / 1000)
        });
      }
    };

    calculateTimeLeft();
    const timer = setInterval(calculateTimeLeft, 1000);

    return () => clearInterval(timer);
  }, []);

  const TimeUnit = ({ value, label }: { value: number; label: string }) => (
    <div className="text-center">
      <div className="bg-white border border-brand-teal/20 rounded-lg p-4 min-w-[80px]">
        <span className="text-2xl font-bold text-brand-tealDark">{value}</span>
      </div>
      <span className="text-sm text-gray-600 mt-2 block">{label}</span>
    </div>
  );

  return (
    <div className="flex justify-center space-x-4 mb-8">
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
  color 
}: { 
  icon: string;
  title: string;
  description: string;
  color: string;
}) {
  const colorClasses = {
    teal: "bg-brand-teal/10 text-brand-teal",
    coral: "bg-brand-coral/10 text-brand-coral",
    gold: "bg-brand-gold/10 text-brand-gold"
  };

  return (
    <div className="bg-white rounded-xl p-6 shadow-md border border-gray-100 hover:shadow-lg transition-shadow">
      <div className={`w-12 h-12 rounded-lg ${colorClasses[color as keyof typeof colorClasses]} flex items-center justify-center text-xl mb-4`}>
        {icon}
      </div>
      <h3 className="text-xl font-semibold text-brand-tealDark mb-2">{title}</h3>
      <p className="text-gray-600">{description}</p>
    </div>
  );
}

// Guideline Item Component
function GuidelineItem({ title, description }: { title: string; description: string }) {
  return (
    <div className="flex items-start space-x-4 p-4 rounded-lg bg-brand-grayBg">
      <div className="w-8 h-8 bg-brand-teal rounded-full flex items-center justify-center flex-shrink-0 mt-1">
        <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
        </svg>
      </div>
      <div>
        <h4 className="font-semibold text-brand-tealDark mb-1">{title}</h4>
        <p className="text-gray-600 text-sm">{description}</p>
      </div>
    </div>
  );
}
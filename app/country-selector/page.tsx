// app/country-selector/page.tsx
"use client";

import WorldMap, { CountryFeature } from "@/components/WorldMap";
import { useState, useEffect, useRef } from "react";

// List of countries for the game (using ISO A3 codes that match our map)
const COUNTRIES = [
  { name: "United States of America", code: "USA" },
  { name: "Canada", code: "CAN" },
  { name: "Brazil", code: "BRA" },
  { name: "Argentina", code: "ARG" },
  { name: "United Kingdom", code: "GBR" },
  { name: "France", code: "FRA" },
  { name: "Germany", code: "DEU" },
  { name: "Italy", code: "ITA" },
  { name: "Spain", code: "ESP" },
  { name: "Russia", code: "RUS" },
  { name: "China", code: "CHN" },
  { name: "India", code: "IND" },
  { name: "Japan", code: "JPN" },
  { name: "South Korea", code: "KOR" },
  { name: "Indonesia", code: "IDN" },
  { name: "Australia", code: "AUS" },
  { name: "Egypt", code: "EGY" },
  { name: "South Africa", code: "ZAF" },
  { name: "Nigeria", code: "NGA" },
  { name: "Mexico", code: "MEX" },
];

// Helper to get a random country
const getRandomCountry = () => {
  const randomIndex = Math.floor(Math.random() * COUNTRIES.length);
  return COUNTRIES[randomIndex];
};

export default function CountrySelectorPage() {
  const [currentCountry, setCurrentCountry] = useState(COUNTRIES[0]);
  const [score, setScore] = useState(0);
  const [attempts, setAttempts] = useState(0);
  const [message, setMessage] = useState<{ text: string; type: "success" | "error" | "info" } | null>(null);
  const [timeLeft, setTimeLeft] = useState(20);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const gameActiveRef = useRef(true);

  // Initialize game
  useEffect(() => {
    startNewRound();
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  const startNewRound = () => {
    // Pick a new country
    setCurrentCountry(getRandomCountry());
    setTimeLeft(20);
    setMessage(null);

    // Clear any existing timer
    if (timerRef.current) clearInterval(timerRef.current);

    // Start new 20-second countdown
    timerRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          // Time's up for this country
          handleTimeout();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const handleTimeout = () => {
    if (!gameActiveRef.current) return;

    // Show timeout message
    setMessage({
      text: `⏰ Time's up! That was ${currentCountry.name}. Next country...`,
      type: "info",
    });

    // Increment attempts (missed country counts as attempt)
    setAttempts((prev) => prev + 1);

    // Move to next country
    setTimeout(() => {
      startNewRound();
    }, 1500);
  };

  const handleCountryClick = (feature: CountryFeature) => {
    if (!gameActiveRef.current) return;
    
    // Get clicked country code and name
    const clickedCode = feature.id;
    const clickedName = feature.properties?.name;

    // Check if it matches current target
    if (clickedCode === currentCountry.code || clickedName === currentCountry.name) {
      // Correct!
      setScore((prev) => prev + 1);
      setAttempts((prev) => prev + 1);
      setMessage({
        text: `✅ Correct! ${currentCountry.name} it is!`,
        type: "success",
      });

      // Add confetti effect (using existing pulse animation from globals)
      if (typeof window !== "undefined") {
        document.body.classList.add("animate-pulse-soft");
        setTimeout(() => document.body.classList.remove("animate-pulse-soft"), 500);
      }

      // Move to next country
      if (timerRef.current) clearInterval(timerRef.current);
      setTimeout(() => {
        startNewRound();
      }, 1200);
    } else {
      // Wrong
      setMessage({
        text: `❌ That's ${clickedName || "not the right country"}. Try again!`,
        type: "error",
      });

      setAttempts((prev) => prev + 1);
    }
  };

  // Format time display
  const timePercentage = (timeLeft / 20) * 100;

  return (
    // Using section class and bg-gradient-deep from globals, plus custom container
    <section className="section min-h-screen bg-gradient-deep flex items-center justify-center p-5">
      <div className="w-full max-w-6xl bg-[#ffffff] backdrop-blur-sm rounded-4xl shadow-brand border border-[#e0e8f0]/40 p-6 md:p-8">
        {/* Header with VNIT branding */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
          <div>
            <h1 className="heading-xl text-fractional-navy">
              VNIT<span className="text-brand-teal">.</span> Country Clicker
            </h1>
            <p className="lead">
              Business Analytics · geography challenge
            </p>
          </div>

          {/* Scoreboard */}
          <div className="flex items-center gap-4 bg-fractional-cream px-5 py-2 rounded-2xl border border-fractional-grayMid/20">
            <div className="text-center">
              <div className="text-xs uppercase text-fractional-textMuted">Score</div>
              <div className="text-2xl font-bold text-brand-teal">{score}</div>
            </div>
            <div className="w-px h-8 bg-fractional-grayMid/30"></div>
            <div className="text-center">
              <div className="text-xs uppercase text-fractional-textMuted">Attempts</div>
              <div className="text-2xl font-bold text-fractional-navy">{attempts}</div>
            </div>
          </div>
        </div>

        {/* Game area */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Left column: target and timer */}
          <div className="lg:col-span-1 order-2 lg:order-1">
            <div className="bg-fractional-cream rounded-3xl p-5 border border-fractional-grayLight sticky top-6">
              <div className="text-sm uppercase tracking-wider text-fractional-textMuted mb-1">
                Find this country
              </div>
              <div className="heading-md text-fractional-navy mb-4">
                {currentCountry.name}
              </div>

              {/* Timer bar */}
              <div className="mb-3">
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-fractional-textMuted">Next country in</span>
                  <span className="font-mono font-bold text-brand-tealDark">{timeLeft}s</span>
                </div>
                <div className="w-full h-3 bg-fractional-grayLight rounded-full overflow-hidden">
                  <div
                    className="h-full bg-brand-teal transition-all duration-300 rounded-full"
                    style={{ width: `${timePercentage}%` }}
                  ></div>
                </div>
              </div>

              {/* Message display */}
              {message && (
                <div
                  className={`mt-4 p-3 rounded-xl text-sm font-medium animate-fade-in ${
                    message.type === "success"
                      ? "bg-brand-teal/20 text-brand-tealDark border border-brand-teal/30"
                      : message.type === "error"
                      ? "bg-brand-coral/20 text-brand-maroonDark border border-brand-coral/30"
                      : "bg-fractional-teal/20 text-fractional-navy border border-fractional-teal/30"
                  }`}
                >
                  {message.text}
                </div>
              )}

              <div className="mt-6 text-xs text-fractional-grayMid leading-relaxed">
                <span className="font-bold text-fractional-navy">How to play:</span> A country name appears above.
                Click on it in the map. You have 20 seconds. +1 point for correct clicks.
              </div>
            </div>
          </div>

          {/* Right column: world map (3/4 width) */}
          <div className="lg:col-span-3 order-1 lg:order-2">
            <div className="bg-fractional-cream/60 rounded-3xl p-4 border border-fractional-grayLight">
              <div className="aspect-[2/1] w-full relative">
                <WorldMap onCountryClick={handleCountryClick} />
              </div>
              <div className="flex justify-between items-center mt-3 text-xs text-fractional-grayMid">
                <span>🌍 Click any country to guess</span>
                <span className="font-mono">vnit·ba·game</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
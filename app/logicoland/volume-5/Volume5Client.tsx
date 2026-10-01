"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { Play, Trophy, BookOpen, Settings } from "lucide-react";
import Link from "next/link";
import Volume5Layout from "@/components/games/logicoland5/Volume5Layout";
import SectionTabs from "@/components/games/logicoland5/SectionTabs";
import PrimaryButton from "@/components/games/logicoland5/PrimaryButton";
import SecondaryButton from "@/components/games/logicoland5/SecondaryButton";

export default function Volume5LandingPage() {
  const [gameMode, setGameMode] = useState<"practice" | "challenge" | "adventure">("practice");

  return (
    <Volume5Layout
      title="Welcome to Logicoland Volume 5!"
      subtitle="Master the puzzles and become a logic wizard!"
    >
      {/* Hero Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="mb-12 text-center"
      >
        <div className="mb-6 inline-block rounded-3xl bg-gradient-to-r from-orange-500/10 to-amber-500/10 p-4">
          <div className="text-6xl">🧩</div>
        </div>
        <h2 className="mb-4 font-heading text-4xl font-black text-gray-900">
          Choose Your Adventure!
        </h2>
        <p className="mx-auto max-w-2xl text-xl text-gray-600">
          Explore 4 exciting sections of brain-teasing puzzles. Each section trains different
          logical thinking skills!
        </p>
      </motion.div>

      {/* Game Mode Selection */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="mb-12"
      >
        <h3 className="mb-6 text-center text-2xl font-bold text-gray-800">Select Game Mode</h3>
        <div className="mb-8 grid grid-cols-1 gap-4 md:grid-cols-3">
          {(["practice", "challenge", "adventure"] as const).map((mode) => (
            <motion.button
              key={mode}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setGameMode(mode)}
              className={`rounded-2xl p-6 text-center transition-all ${
                gameMode === mode
                  ? "scale-105 transform bg-gradient-to-r from-orange-500 to-amber-500 text-white"
                  : "bg-white text-gray-800 hover:bg-orange-50"
              } `}
            >
              <div className="mb-3 text-3xl">
                {mode === "practice" && "📚"}
                {mode === "challenge" && "🏆"}
                {mode === "adventure" && "🚀"}
              </div>
              <h4 className="mb-2 text-xl font-bold">
                {mode === "practice" && "Practice Mode"}
                {mode === "challenge" && "Challenge Mode"}
                {mode === "adventure" && "Adventure Mode"}
              </h4>
              <p className="text-sm opacity-90">
                {mode === "practice" && "Learn at your own pace with hints"}
                {mode === "challenge" && "Time-based puzzles for points"}
                {mode === "adventure" && "Story mode with progressive difficulty"}
              </p>
            </motion.button>
          ))}
        </div>
      </motion.div>

      {/* Section Tabs */}
      <div className="mb-12">
        <div className="mb-6 flex items-center justify-between">
          <h3 className="text-2xl font-bold text-gray-800">Game Sections</h3>
          <div className="rounded-full bg-orange-100 px-4 py-2 font-bold text-orange-800">
            4 Sections
          </div>
        </div>
        <SectionTabs currentSection={0} />
      </div>

      {/* Quick Stats */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="mb-12 rounded-2xl bg-gradient-to-r from-orange-50 to-amber-50 p-6"
      >
        <h3 className="mb-6 text-center text-2xl font-bold text-gray-800">Your Progress</h3>
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
          {[
            { label: "Total Puzzles", value: "32", color: "bg-orange-500" },
            { label: "Completed", value: "0", color: "bg-green-500" },
            { label: "High Score", value: "0", color: "bg-amber-500" },
            { label: "Best Streak", value: "0", color: "bg-pink-500" },
          ].map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.5 + index * 0.1 }}
              className="rounded-xl bg-white p-4 text-center shadow-soft"
            >
              <div
                className={`h-12 w-12 ${stat.color} mx-auto mb-3 flex items-center justify-center rounded-full`}
              >
                <span className="text-xl font-bold text-white">{stat.value}</span>
              </div>
              <div className="text-sm font-bold text-gray-600">{stat.label}</div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Action Buttons */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="flex flex-col justify-center gap-4 sm:flex-row"
      >
        <Link href="/logicoland/volume-5/section/1" className="flex-1">
          <PrimaryButton icon={Play} size="lg" fullWidth>
            Start Playing Section 1
          </PrimaryButton>
        </Link>

        <div className="flex-1">
          <SecondaryButton icon={BookOpen} size="lg" variant="outline">
            How to Play
          </SecondaryButton>
        </div>

        <div className="flex-1">
          <SecondaryButton icon={Settings} size="lg" variant="ghost">
            Game Settings
          </SecondaryButton>
        </div>
      </motion.div>

      {/* Footer Note */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.7 }}
        className="mt-12 border-t border-gray-200 pt-6 text-center"
      >
        <p className="text-sm text-gray-500">
          Logicoland Volume 5 • Designed for kids aged 8-12 • No ads, no in-app purchases
        </p>
        <p className="mt-2 text-xs text-gray-400">
          Tap any section card above to jump directly to that game!
        </p>
      </motion.div>
    </Volume5Layout>
  );
}

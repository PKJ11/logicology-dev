"use client";

import React from "react";
import { motion } from "framer-motion";
import { ArrowLeft, Trophy, Star, Home } from "lucide-react";
import Link from "next/link";

interface TopBarProps {
  onBack: () => void;
  title: string;
  score: number;
  progress: number;
  totalPuzzles: number;
  streak: number;
  sectionNumber: number;
}

export default function TopBar({
  onBack,
  title,
  score,
  progress,
  totalPuzzles,
  streak,
  sectionNumber,
}: TopBarProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="mb-6 rounded-2xl border border-orange-200/50 bg-gradient-to-r from-orange-500/10 to-amber-500/10 p-4 backdrop-blur-sm"
    >
      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
        {/* Left Section */}
        <div className="flex items-center gap-4">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onBack}
            className="rounded-xl border border-orange-200 bg-white p-3 shadow-soft transition-all hover:shadow-brand"
          >
            <ArrowLeft className="h-6 w-6 text-orange-500" />
          </motion.button>

          <div>
            <h2 className="font-heading text-2xl font-bold text-gray-800">{title}</h2>
            <div className="mt-1 flex items-center gap-2">
              <div className="rounded-full bg-orange-100 px-3 py-1 text-sm font-bold text-orange-800">
                Section {sectionNumber}
              </div>
            </div>
          </div>
        </div>

        {/* Stats Section */}
        <div className="flex flex-wrap gap-4">
          {/* Score */}
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="min-w-[120px] rounded-xl border border-amber-200 bg-gradient-to-r from-amber-100 to-yellow-100 p-3 shadow-soft"
          >
            <div className="flex items-center gap-2">
              <Trophy className="h-5 w-5 text-amber-600" />
              <span className="text-lg font-bold text-gray-800">Score</span>
            </div>
            <div className="mt-1 text-2xl font-black text-amber-700">{score}</div>
          </motion.div>

          {/* Progress */}
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="min-w-[120px] rounded-xl border border-blue-200 bg-gradient-to-r from-blue-100 to-sky-100 p-3 shadow-soft"
          >
            <div className="flex items-center gap-2">
              <div className="h-5 w-5 rounded-full bg-gradient-to-r from-blue-500 to-sky-500" />
              <span className="text-lg font-bold text-gray-800">Progress</span>
            </div>
            <div className="mt-1 text-2xl font-black text-blue-700">
              {progress}/{totalPuzzles}
            </div>
          </motion.div>

          {/* Streak */}
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="min-w-[120px] rounded-xl border border-pink-200 bg-gradient-to-r from-pink-100 to-rose-100 p-3 shadow-soft"
          >
            <div className="flex items-center gap-2">
              <Star className="h-5 w-5 fill-pink-600 text-pink-600" />
              <span className="text-lg font-bold text-gray-800">Streak</span>
            </div>
            <div className="mt-1 text-2xl font-black text-pink-700">{streak}</div>
          </motion.div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="mt-4">
        <div className="h-2 overflow-hidden rounded-full bg-gray-200">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${(progress / totalPuzzles) * 100}%` }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="h-full rounded-full bg-gradient-to-r from-orange-500 to-amber-500"
          />
        </div>
        <div className="mt-1 flex justify-between text-sm text-gray-600">
          <span>Keep going!</span>
          <span>{Math.round((progress / totalPuzzles) * 100)}% complete</span>
        </div>
      </div>
    </motion.div>
  );
}

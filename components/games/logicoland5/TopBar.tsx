'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Trophy, Star, Home } from 'lucide-react';
import Link from 'next/link';

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
  sectionNumber
}: TopBarProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-gradient-to-r from-orange-500/10 to-amber-500/10 backdrop-blur-sm rounded-2xl p-4 mb-6 border border-orange-200/50"
    >
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Left Section */}
        <div className="flex items-center gap-4">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onBack}
            className="bg-white rounded-xl p-3 shadow-soft border border-orange-200 hover:shadow-brand transition-all"
          >
            <ArrowLeft className="w-6 h-6 text-orange-500" />
          </motion.button>
          
          <div>
            <h2 className="text-2xl font-heading font-bold text-gray-800">{title}</h2>
            <div className="flex items-center gap-2 mt-1">
              <div className="px-3 py-1 bg-orange-100 text-orange-800 rounded-full text-sm font-bold">
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
            className="bg-gradient-to-r from-amber-100 to-yellow-100 rounded-xl p-3 shadow-soft border border-amber-200 min-w-[120px]"
          >
            <div className="flex items-center gap-2">
              <Trophy className="w-5 h-5 text-amber-600" />
              <span className="text-lg font-bold text-gray-800">Score</span>
            </div>
            <div className="text-2xl font-black text-amber-700 mt-1">{score}</div>
          </motion.div>

          {/* Progress */}
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="bg-gradient-to-r from-blue-100 to-sky-100 rounded-xl p-3 shadow-soft border border-blue-200 min-w-[120px]"
          >
            <div className="flex items-center gap-2">
              <div className="w-5 h-5 bg-gradient-to-r from-blue-500 to-sky-500 rounded-full" />
              <span className="text-lg font-bold text-gray-800">Progress</span>
            </div>
            <div className="text-2xl font-black text-blue-700 mt-1">
              {progress}/{totalPuzzles}
            </div>
          </motion.div>

          {/* Streak */}
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="bg-gradient-to-r from-pink-100 to-rose-100 rounded-xl p-3 shadow-soft border border-pink-200 min-w-[120px]"
          >
            <div className="flex items-center gap-2">
              <Star className="w-5 h-5 text-pink-600 fill-pink-600" />
              <span className="text-lg font-bold text-gray-800">Streak</span>
            </div>
            <div className="text-2xl font-black text-pink-700 mt-1">{streak}</div>
          </motion.div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="mt-4">
        <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${(progress / totalPuzzles) * 100}%` }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="h-full bg-gradient-to-r from-orange-500 to-amber-500 rounded-full"
          />
        </div>
        <div className="flex justify-between text-sm text-gray-600 mt-1">
          <span>Keep going!</span>
          <span>{Math.round((progress / totalPuzzles) * 100)}% complete</span>
        </div>
      </div>
    </motion.div>
  );
}
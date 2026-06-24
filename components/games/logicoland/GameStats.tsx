"use client";

import { motion } from "framer-motion";
import { Star, Target, TrendingUp } from "lucide-react";

interface GameStatsProps {
  score: number;
  streak: number;
  completedLevels: number;
  totalLevels: number;
}

export default function GameStats({ score, streak, completedLevels, totalLevels }: GameStatsProps) {
  return (
    <div className="rounded-4xl bg-white/90 p-6 shadow-soft">
      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex items-center gap-4"
        >
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-100">
            <Star className="h-6 w-6 text-amber-600" />
          </div>
          <div>
            <p className="font-roboto text-gray-600">Score</p>
            <p className="font-outfit text-2xl font-bold text-gray-800">{score}</p>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="flex items-center gap-4"
        >
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-teal/10">
            <Target className="h-6 w-6 text-brand-teal" />
          </div>
          <div>
            <p className="font-roboto text-gray-600">Streak</p>
            <p className="font-outfit text-2xl font-bold text-gray-800">{streak} 🔥</p>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="flex items-center gap-4"
        >
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-sky-100">
            <TrendingUp className="h-6 w-6 text-sky-600" />
          </div>
          <div>
            <p className="font-roboto text-gray-600">Progress</p>
            <p className="font-outfit text-2xl font-bold text-gray-800">
              {completedLevels}/{totalLevels}
            </p>
          </div>
        </motion.div>
      </div>

      {/* Progress bar */}
      <div className="mt-6">
        <div className="font-roboto mb-2 flex justify-between text-sm text-gray-600">
          <span>Progress</span>
          <span>{Math.round((completedLevels / totalLevels) * 100)}%</span>
        </div>
        <div className="h-3 overflow-hidden rounded-full bg-gray-200">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${(completedLevels / totalLevels) * 100}%` }}
            transition={{ duration: 1, ease: "easeOut" }}
            className="h-full bg-gradient-to-r from-brand-teal to-sky-400"
          />
        </div>
      </div>
    </div>
  );
}

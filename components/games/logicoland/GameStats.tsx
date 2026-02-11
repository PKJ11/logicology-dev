'use client';

import { motion } from 'framer-motion';
import { Star, Target, TrendingUp } from 'lucide-react';

interface GameStatsProps {
  score: number;
  streak: number;
  completedLevels: number;
  totalLevels: number;
}

export default function GameStats({ 
  score, 
  streak, 
  completedLevels,
  totalLevels 
}: GameStatsProps) {
  return (
    <div className="bg-white/90 rounded-4xl p-6 shadow-soft">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex items-center gap-4"
        >
          <div className="w-12 h-12 bg-amber-100 rounded-2xl flex items-center justify-center">
            <Star className="w-6 h-6 text-amber-600" />
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
          <div className="w-12 h-12 bg-brand-teal/10 rounded-2xl flex items-center justify-center">
            <Target className="w-6 h-6 text-brand-teal" />
          </div>
          <div>
            <p className="font-roboto text-gray-600">Streak</p>
            <p className="font-outfit text-2xl font-bold text-gray-800">
              {streak} 🔥
            </p>
          </div>
        </motion.div>
        
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="flex items-center gap-4"
        >
          <div className="w-12 h-12 bg-sky-100 rounded-2xl flex items-center justify-center">
            <TrendingUp className="w-6 h-6 text-sky-600" />
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
        <div className="flex justify-between text-sm font-roboto text-gray-600 mb-2">
          <span>Progress</span>
          <span>{Math.round((completedLevels / totalLevels) * 100)}%</span>
        </div>
        <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
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
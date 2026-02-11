'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Play, Trophy, BookOpen, Settings } from 'lucide-react';
import Link from 'next/link';
import Volume5Layout from '@/components/games/logicoland5/Volume5Layout';
import SectionTabs from '@/components/games/logicoland5/SectionTabs';
import PrimaryButton from '@/components/games/logicoland5/PrimaryButton';
import SecondaryButton from '@/components/games/logicoland5/SecondaryButton';

export default function Volume5LandingPage() {
  const [gameMode, setGameMode] = useState<'practice' | 'challenge' | 'adventure'>('practice');

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
        className="text-center mb-12"
      >
        <div className="inline-block p-4 bg-gradient-to-r from-orange-500/10 to-amber-500/10 rounded-3xl mb-6">
          <div className="text-6xl">🧩</div>
        </div>
        <h2 className="text-4xl font-black text-gray-900 mb-4 font-heading">
          Choose Your Adventure!
        </h2>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          Explore 4 exciting sections of brain-teasing puzzles. Each section trains different logical thinking skills!
        </p>
      </motion.div>

      {/* Game Mode Selection */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="mb-12"
      >
        <h3 className="text-2xl font-bold text-gray-800 mb-6 text-center">Select Game Mode</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          {(['practice', 'challenge', 'adventure'] as const).map((mode) => (
            <motion.button
              key={mode}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setGameMode(mode)}
              className={`
                rounded-2xl p-6 text-center transition-all
                ${gameMode === mode
                  ? 'bg-gradient-to-r from-orange-500 to-amber-500 text-white transform scale-105'
                  : 'bg-white text-gray-800 hover:bg-orange-50'
                }
              `}
            >
              <div className="text-3xl mb-3">
                {mode === 'practice' && '📚'}
                {mode === 'challenge' && '🏆'}
                {mode === 'adventure' && '🚀'}
              </div>
              <h4 className="text-xl font-bold mb-2">
                {mode === 'practice' && 'Practice Mode'}
                {mode === 'challenge' && 'Challenge Mode'}
                {mode === 'adventure' && 'Adventure Mode'}
              </h4>
              <p className="text-sm opacity-90">
                {mode === 'practice' && 'Learn at your own pace with hints'}
                {mode === 'challenge' && 'Time-based puzzles for points'}
                {mode === 'adventure' && 'Story mode with progressive difficulty'}
              </p>
            </motion.button>
          ))}
        </div>
      </motion.div>

      {/* Section Tabs */}
      <div className="mb-12">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-2xl font-bold text-gray-800">Game Sections</h3>
          <div className="px-4 py-2 bg-orange-100 text-orange-800 rounded-full font-bold">
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
        className="bg-gradient-to-r from-orange-50 to-amber-50 rounded-2xl p-6 mb-12"
      >
        <h3 className="text-2xl font-bold text-gray-800 mb-6 text-center">Your Progress</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: 'Total Puzzles', value: '32', color: 'bg-orange-500' },
            { label: 'Completed', value: '0', color: 'bg-green-500' },
            { label: 'High Score', value: '0', color: 'bg-amber-500' },
            { label: 'Best Streak', value: '0', color: 'bg-pink-500' }
          ].map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.5 + index * 0.1 }}
              className="bg-white rounded-xl p-4 text-center shadow-soft"
            >
              <div className={`w-12 h-12 ${stat.color} rounded-full flex items-center justify-center mx-auto mb-3`}>
                <span className="text-white text-xl font-bold">{stat.value}</span>
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
        className="flex flex-col sm:flex-row gap-4 justify-center"
      >
        <Link href="/logicoland/volume-5/section/1" className="flex-1">
          <PrimaryButton icon={Play} size="lg" fullWidth>
            Start Playing Section 1
          </PrimaryButton>
        </Link>
        
        <div className="flex-1">
          <SecondaryButton icon={BookOpen} size="lg"  variant="outline">
            How to Play
          </SecondaryButton>
        </div>
        
        <div className="flex-1">
          <SecondaryButton icon={Settings} size="lg"  variant="ghost">
            Game Settings
          </SecondaryButton>
        </div>
      </motion.div>

      {/* Footer Note */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.7 }}
        className="mt-12 pt-6 border-t border-gray-200 text-center"
      >
        <p className="text-gray-500 text-sm">
          Logicoland Volume 5 • Designed for kids aged 8-12 • No ads, no in-app purchases
        </p>
        <p className="text-gray-400 text-xs mt-2">
          Tap any section card above to jump directly to that game!
        </p>
      </motion.div>
    </Volume5Layout>
  );
}
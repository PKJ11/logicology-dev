'use client';

import { motion } from 'framer-motion';
import { ChevronDown } from 'lucide-react';
import { useState } from 'react';

interface LevelSelectProps {
  currentLevel: number;
  onLevelChange: (level: number) => void;
  totalLevels: number;
  completedLevels: number[];
}

export default function LevelSelect({ 
  currentLevel, 
  onLevelChange, 
  totalLevels,
  completedLevels 
}: LevelSelectProps) {
  const [isOpen, setIsOpen] = useState(false);

  const levels = Array.from({ length: totalLevels }, (_, i) => i + 1);

  return (
    <div className="relative inline-block">
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-4 py-3 bg-white rounded-2xl shadow-soft font-outfit font-semibold text-lg text-brand-teal"
      >
        Level {currentLevel}
        <ChevronDown className={`transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </motion.button>

      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="absolute top-full left-0 mt-2 bg-white rounded-2xl shadow-soft z-50 min-w-[120px]"
        >
          <div className="p-2 max-h-60 overflow-y-auto">
            {levels.map((level) => (
              <button
                key={level}
                onClick={() => {
                  onLevelChange(level);
                  setIsOpen(false);
                }}
                className={`
                  w-full text-left px-4 py-2 rounded-xl font-roboto text-base
                  transition-colors hover:bg-brand-grayBg
                  ${currentLevel === level ? 'bg-brand-teal text-white' : ''}
                  ${completedLevels.includes(level) ? 'text-green-600 font-semibold' : ''}
                `}
              >
                Level {level}
                {completedLevels.includes(level) && (
                  <span className="ml-2">✓</span>
                )}
              </button>
            ))}
          </div>
        </motion.div>
      )}
    </div>
  );
}
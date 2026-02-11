'use client';

import { motion } from 'framer-motion';
import { GameMode } from './data';

interface ModeTabsProps {
  currentMode: GameMode;
  onModeChange: (mode: GameMode) => void;
}

export default function ModeTabs({ currentMode, onModeChange }: ModeTabsProps) {
  const modes = [
    { id: 'encode', label: 'Secret Code – Encode' },
    { id: 'decode', label: 'Secret Code – Decode' },
    { id: 'crawl', label: 'Colour Crawl' },
  ] as const;

  return (
    <div className="flex flex-wrap justify-center gap-2 md:gap-4 p-2">
      {modes.map((mode) => (
        <motion.button
          key={mode.id}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => onModeChange(mode.id)}
          className={`
            px-6 py-3 rounded-2xl font-outfit font-semibold text-lg
            transition-all duration-200
            ${currentMode === mode.id 
              ? 'bg-brand-teal text-white shadow-brand' 
              : 'bg-brand-grayBg text-gray-700 hover:bg-gray-200'
            }
          `}
        >
          {mode.label}
        </motion.button>
      ))}
    </div>
  );
}
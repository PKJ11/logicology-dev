"use client";

import { motion } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { useState } from "react";

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
  completedLevels,
}: LevelSelectProps) {
  const [isOpen, setIsOpen] = useState(false);

  const levels = Array.from({ length: totalLevels }, (_, i) => i + 1);

  return (
    <div className="relative inline-block">
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(!isOpen)}
        className="font-outfit flex items-center gap-2 rounded-2xl bg-white px-4 py-3 text-lg font-semibold text-brand-teal shadow-soft"
      >
        Level {currentLevel}
        <ChevronDown className={`transition-transform ${isOpen ? "rotate-180" : ""}`} />
      </motion.button>

      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="absolute left-0 top-full z-50 mt-2 min-w-[120px] rounded-2xl bg-white shadow-soft"
        >
          <div className="max-h-60 overflow-y-auto p-2">
            {levels.map((level) => (
              <button
                key={level}
                onClick={() => {
                  onLevelChange(level);
                  setIsOpen(false);
                }}
                className={`font-roboto w-full rounded-xl px-4 py-2 text-left text-base transition-colors hover:bg-brand-grayBg ${currentLevel === level ? "bg-brand-teal text-white" : ""} ${completedLevels.includes(level) ? "font-semibold text-green-600" : ""} `}
              >
                Level {level}
                {completedLevels.includes(level) && <span className="ml-2">✓</span>}
              </button>
            ))}
          </div>
        </motion.div>
      )}
    </div>
  );
}

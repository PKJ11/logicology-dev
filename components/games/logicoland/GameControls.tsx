'use client';

import { motion } from 'framer-motion';
import { HelpCircle, Trash2, CheckCircle, SkipForward, Trophy } from 'lucide-react';

interface GameControlsProps {
  onHint: () => void;
  onClear: () => void;
  onCheck: () => void;
  onNext: () => void;
  hintsUsed: number;
  canCheck: boolean;
  canProceed: boolean;
  isCorrect?: boolean;
}

export default function GameControls({ 
  onHint, 
  onClear, 
  onCheck, 
  onNext,
  hintsUsed,
  canCheck,
  canProceed,
  isCorrect = false 
}: GameControlsProps) {
  return (
    <div className="flex flex-wrap gap-4 justify-center">
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={onHint}
        className="flex items-center gap-2 px-6 py-3 bg-sky-100 text-sky-700 rounded-2xl font-outfit font-semibold text-lg"
      >
        <HelpCircle />
        Hint ({3 - hintsUsed} left)
      </motion.button>
      
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={onClear}
        className="flex items-center gap-2 px-6 py-3 bg-amber-100 text-amber-700 rounded-2xl font-outfit font-semibold text-lg"
      >
        <Trash2 />
        Clear
      </motion.button>
      
      {!isCorrect ? (
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onCheck}
          disabled={!canCheck}
          className={`
            flex items-center gap-2 px-6 py-3 rounded-2xl font-outfit font-semibold text-lg
            ${canCheck 
              ? 'bg-brand-teal text-white hover:bg-teal-600' 
              : 'bg-gray-200 text-gray-500 cursor-not-allowed'
            }
          `}
        >
          <CheckCircle />
          Check Answer
        </motion.button>
      ) : (
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onNext}
          className="flex items-center gap-2 px-6 py-3 bg-green-500 text-white rounded-2xl font-outfit font-semibold text-lg"
        >
          <SkipForward />
          Next Level
        </motion.button>
      )}
    </div>
  );
}
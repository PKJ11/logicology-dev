"use client";

import { motion } from "framer-motion";
import { HelpCircle, Trash2, CheckCircle, SkipForward, Trophy } from "lucide-react";

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
  isCorrect = false,
}: GameControlsProps) {
  return (
    <div className="flex flex-wrap justify-center gap-4">
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={onHint}
        className="font-outfit flex items-center gap-2 rounded-2xl bg-sky-100 px-6 py-3 text-lg font-semibold text-sky-700"
      >
        <HelpCircle />
        Hint ({3 - hintsUsed} left)
      </motion.button>

      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={onClear}
        className="font-outfit flex items-center gap-2 rounded-2xl bg-amber-100 px-6 py-3 text-lg font-semibold text-amber-700"
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
          className={`font-outfit flex items-center gap-2 rounded-2xl px-6 py-3 text-lg font-semibold ${
            canCheck
              ? "bg-brand-teal text-white hover:bg-teal-600"
              : "cursor-not-allowed bg-gray-200 text-gray-500"
          } `}
        >
          <CheckCircle />
          Check Answer
        </motion.button>
      ) : (
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onNext}
          className="font-outfit flex items-center gap-2 rounded-2xl bg-green-500 px-6 py-3 text-lg font-semibold text-white"
        >
          <SkipForward />
          Next Level
        </motion.button>
      )}
    </div>
  );
}

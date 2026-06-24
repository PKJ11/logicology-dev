"use client";

import { motion } from "framer-motion";
import { ArrowRight, ArrowLeft, ArrowUp, ArrowDown } from "lucide-react";

interface MoveStripProps {
  moves: string[];
  currentMoveIndex?: number;
}

export default function MoveStrip({ moves, currentMoveIndex }: MoveStripProps) {
  const moveIcons = {
    R: <ArrowRight className="h-6 w-6" />,
    L: <ArrowLeft className="h-6 w-6" />,
    U: <ArrowUp className="h-6 w-6" />,
    D: <ArrowDown className="h-6 w-6" />,
  };

  return (
    <div className="rounded-3xl bg-white/90 p-6 shadow-soft">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="font-outfit text-xl font-semibold text-gray-700">Move Sequence</h3>
        <span className="font-roboto text-lg font-semibold text-brand-teal">
          {moves.length} moves
        </span>
      </div>

      <div className="flex flex-wrap justify-center gap-3">
        {moves.map((move, index) => (
          <motion.div
            key={index}
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: index * 0.1 }}
            className={`flex h-14 w-14 items-center justify-center rounded-2xl ${
              currentMoveIndex === index
                ? "animate-bounce bg-brand-teal text-white shadow-brand"
                : "bg-brand-grayBg text-gray-700"
            } border-2 border-white`}
          >
            {moveIcons[move as keyof typeof moveIcons]}
            <div className="absolute -right-2 -top-2 flex h-6 w-6 items-center justify-center rounded-full bg-brand-coral text-xs font-bold text-white">
              {index + 1}
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

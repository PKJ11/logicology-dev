'use client';

import { motion } from 'framer-motion';
import { ArrowRight, ArrowLeft, ArrowUp, ArrowDown } from 'lucide-react';

interface MoveStripProps {
  moves: string[];
  currentMoveIndex?: number;
}

export default function MoveStrip({ moves, currentMoveIndex }: MoveStripProps) {
  const moveIcons = {
    'R': <ArrowRight className="w-6 h-6" />,
    'L': <ArrowLeft className="w-6 h-6" />,
    'U': <ArrowUp className="w-6 h-6" />,
    'D': <ArrowDown className="w-6 h-6" />,
  };

  return (
    <div className="bg-white/90 rounded-3xl p-6 shadow-soft">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-outfit text-xl font-semibold text-gray-700">
          Move Sequence
        </h3>
        <span className="font-roboto text-lg text-brand-teal font-semibold">
          {moves.length} moves
        </span>
      </div>
      
      <div className="flex flex-wrap gap-3 justify-center">
        {moves.map((move, index) => (
          <motion.div
            key={index}
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: index * 0.1 }}
            className={`
              w-14 h-14 rounded-2xl
              flex items-center justify-center
              ${currentMoveIndex === index 
                ? 'bg-brand-teal text-white shadow-brand animate-bounce' 
                : 'bg-brand-grayBg text-gray-700'
              }
              border-2 border-white
            `}
          >
            {moveIcons[move as keyof typeof moveIcons]}
            <div className="absolute -top-2 -right-2 w-6 h-6 bg-brand-coral rounded-full flex items-center justify-center text-white text-xs font-bold">
              {index + 1}
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
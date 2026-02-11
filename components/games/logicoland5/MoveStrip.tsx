'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { ArrowUp, ArrowDown, ArrowLeft, ArrowRight, ChevronUp, ChevronDown, ChevronLeft, ChevronRight } from 'lucide-react';

interface MoveStripProps {
  moves: string[];
  currentMoveIndex: number;
  type: 'color' | 'arrow';
  onMoveClick?: (index: number) => void;
  isInteractive?: boolean;
}

export default function MoveStrip({
  moves,
  currentMoveIndex,
  type,
  onMoveClick,
  isInteractive = false
}: MoveStripProps) {
  const getMoveDisplay = (move: string) => {
    if (type === 'color') {
      const moveMap: Record<string, { label: string; textColor: string; icon: React.ReactNode }> = {
        'F': { label: 'Forward', textColor: 'text-green-600', icon: <ChevronUp className="w-6 h-6" /> },
        'B': { label: 'Backward', textColor: 'text-red-600', icon: <ChevronDown className="w-6 h-6" /> },
        'L': { label: 'Left', textColor: 'text-blue-600', icon: <ChevronLeft className="w-6 h-6" /> },
        'R': { label: 'Right', textColor: 'text-yellow-600', icon: <ChevronRight className="w-6 h-6" /> },
        'U': { label: 'Up', textColor: 'text-green-600', icon: <ArrowUp className="w-6 h-6" /> },
        'D': { label: 'Down', textColor: 'text-red-600', icon: <ArrowDown className="w-6 h-6" /> }
      };
      return moveMap[move] || { label: move, textColor: 'text-gray-600', icon: null };
    } else {
      const arrowMap: Record<string, { label: string; textColor: string; icon: React.ReactNode }> = {
        '↑': { label: 'Up', textColor: 'text-sky-600', icon: <ArrowUp className="w-8 h-8" /> },
        '↓': { label: 'Down', textColor: 'text-purple-600', icon: <ArrowDown className="w-8 h-8" /> },
        '←': { label: 'Left', textColor: 'text-pink-600', icon: <ArrowLeft className="w-8 h-8" /> },
        '→': { label: 'Right', textColor: 'text-amber-600', icon: <ArrowRight className="w-8 h-8" /> }
      };
      return arrowMap[move] || { label: move, textColor: 'text-gray-600', icon: null };
    }
  };

  return (
    <div className="bg-gradient-to-r from-orange-50 to-amber-50 rounded-2xl p-4 shadow-soft border border-orange-200">
      <div className="text-center mb-4">
        <h3 className="text-2xl font-bold text-gray-800 font-heading">
          {type === 'color' ? 'MOVEMENT CODE' : 'ARROW STEPS'}
        </h3>
        <p className="text-gray-600">Follow the sequence to find your destination</p>
      </div>
      
      <div className="flex flex-wrap justify-center gap-3">
        {moves.map((move, index) => {
          const { label, textColor, icon } = getMoveDisplay(move);
          const isCurrent = index === currentMoveIndex;
          const isPast = index < currentMoveIndex;

          return (
            <motion.div
              key={index}
              layoutId={`move-${index}`}
              whileHover={isInteractive ? { scale: 1.05 } : {}}
              whileTap={isInteractive ? { scale: 0.95 } : {}}
              onClick={() => isInteractive && onMoveClick?.(index)}
              animate={{
                scale: isCurrent ? [1, 1.1, 1] : 1,
                y: isCurrent ? [0, -5, 0] : 0
              }}
              transition={{ duration: 0.3 }}
              className={`
                relative
                rounded-xl
                bg-white
                border-2 border-gray-300
                flex flex-col items-center justify-center
                ${type === 'color' ? 'w-20 h-20' : 'w-24 h-24'}
                shadow-lg
                transition-all duration-200
                ${isCurrent ? 'ring-2 ring-orange-400 ring-offset-2 shadow-xl' : ''}
                ${isCurrent ? 'border-orange-400' : ''}
                ${isPast ? 'opacity-70' : ''}
                ${isInteractive ? 'cursor-pointer hover:border-gray-400 hover:shadow-md' : ''}
              `}
            >
              {/* Move number */}
              <div className="absolute -top-2 -right-2 bg-orange-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold shadow">
                {index + 1}
              </div>

              {/* Move icon/content */}
              <div className={`${textColor} font-bold`}>
                {icon || (
                  <span className="text-2xl">{move}</span>
                )}
              </div>

              {/* Move label */}
              <div className="text-xs font-bold mt-1 px-2 py-0.5 rounded-full bg-gray-100 text-gray-700">
                {label}
              </div>

              {/* Current indicator */}
              {isCurrent && (
                <motion.div
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ repeat: Infinity, duration: 1 }}
                  className="absolute -bottom-1 w-3 h-3 bg-orange-500 rounded-full"
                />
              )}
            </motion.div>
          );
        })}
      </div>

      {/* Progress indicator */}
      <div className="mt-6">
        <div className="flex items-center justify-between text-sm text-gray-600 mb-1">
          <span>Step {currentMoveIndex + 1} of {moves.length}</span>
          <span>{Math.round(((currentMoveIndex + 1) / moves.length) * 100)}%</span>
        </div>
        <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${((currentMoveIndex + 1) / moves.length) * 100}%` }}
            transition={{ duration: 0.5 }}
            className="h-full bg-gradient-to-r from-orange-500 to-amber-500 rounded-full"
          />
        </div>
      </div>
    </div>
  );
}
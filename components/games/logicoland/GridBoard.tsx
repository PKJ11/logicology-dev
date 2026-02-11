'use client';

import { motion } from 'framer-motion';
import { GridCell, Color } from './data';

interface GridBoardProps {
  grid: GridCell[][];
  currentPosition?: { row: number; col: number };
  onCellClick?: (row: number, col: number) => void;
  selectedColor?: Color | null;
  showPath?: boolean;
  path?: { row: number; col: number }[];
}

export default function GridBoard({ 
  grid, 
  currentPosition,
  onCellClick,
  selectedColor,
  showPath = false,
  path = []
}: GridBoardProps) {
  const gridSize = grid.length;

  return (
    <div className="inline-block bg-white/90 rounded-4xl p-6 shadow-soft">
      <div 
        className="grid gap-2"
        style={{ 
          gridTemplateColumns: `repeat(${gridSize}, minmax(0, 1fr))`
        }}
      >
        {grid.map((row, rowIndex) =>
          row.map((cell, colIndex) => {
            const isCurrent = currentPosition?.row === rowIndex && currentPosition?.col === colIndex;
            const isStart = cell.isStart;
            const isInPath = showPath && path.some(p => p.row === rowIndex && p.col === colIndex);
            const isSelectable = !!onCellClick;
            
            return (
              <motion.button
                key={`${rowIndex}-${colIndex}`}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: (rowIndex * gridSize + colIndex) * 0.02 }}
                whileHover={isSelectable ? { scale: 1.1 } : {}}
                whileTap={isSelectable ? { scale: 0.9 } : {}}
                onClick={() => onCellClick?.(rowIndex, colIndex)}
                className={`
                  w-16 h-16 md:w-20 md:h-20
                  rounded-2xl
                  flex items-center justify-center
                  relative
                  border-4
                  ${cell.color ? cell.color.bgClass : 'bg-gray-200'}
                  ${isCurrent 
                    ? 'border-brand-teal shadow-brand' 
                    : isStart 
                    ? 'border-brand-gold shadow-brand'
                    : isInPath
                    ? 'border-sky-400'
                    : 'border-white'
                  }
                  ${isSelectable ? 'cursor-pointer' : 'cursor-default'}
                  transition-all duration-200
                `}
              >
                {isStart && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="font-outfit font-bold text-2xl text-white bg-black/30 rounded-full w-10 h-10 flex items-center justify-center">
                      S
                    </span>
                  </div>
                )}
                
                {isCurrent && !isStart && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-8 h-8 rounded-full bg-white/30 animate-ping" />
                  </div>
                )}
                
                {selectedColor && isSelectable && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className={`absolute inset-2 rounded-xl ${selectedColor.bgClass} opacity-30`}
                  />
                )}
              </motion.button>
            );
          })
        )}
      </div>
    </div>
  );
}
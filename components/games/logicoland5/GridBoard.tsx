'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface GridBoardProps {
  type: 'color' | 'number';
  grid: string[][] | number[][];
  currentPosition: [number, number];
  visitedPositions?: [number, number][];
  highlightPosition?: [number, number];
  onCellClick?: (row: number, col: number) => void;
  showStart?: boolean;
  startPosition?: [number, number];
  targetPosition?: [number, number];
  isInteractive?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

export default function GridBoard({
  type,
  grid,
  currentPosition,
  visitedPositions = [],
  highlightPosition,
  onCellClick,
  showStart = true,
  startPosition,
  targetPosition,
  isInteractive = false,
  size = 'md'
}: GridBoardProps) {
  const [selectedCell, setSelectedCell] = useState<[number, number] | null>(null);

  const cellSize = {
    sm: 'w-12 h-12 md:w-14 md:h-14',
    md: 'w-14 h-14 md:w-16 md:h-16',
    lg: 'w-16 h-16 md:w-20 md:h-20'
  }[size];

  const textSize = {
    sm: 'text-sm md:text-base',
    md: 'text-base md:text-lg',
    lg: 'text-lg md:text-xl'
  }[size];

  const isColorGrid = type === 'color';

  // Get grid columns class based on actual grid width
  const getGridColsClass = () => {
    if (!grid || !grid[0]) return 'grid-cols-4';
    const cols = grid[0].length;
    
    // Return appropriate Tailwind class for the number of columns
    switch (cols) {
      case 1: return 'grid-cols-1';
      case 2: return 'grid-cols-2';
      case 3: return 'grid-cols-3';
      case 4: return 'grid-cols-4';
      case 5: return 'grid-cols-5';
      case 6: return 'grid-cols-6';
      case 7: return 'grid-cols-7';
      case 8: return 'grid-cols-8';
      default: return 'grid-cols-4';
    }
  };

  const getColorValue = (cell: string | number) => {
    if (isColorGrid) {
      const color = cell as string;
      const colorMap: Record<string, string> = {
        'red': 'bg-red-500',
        'blue': 'bg-blue-500',
        'green': 'bg-green-500',
        'yellow': 'bg-yellow-400',
        'pink': 'bg-pink-500',
        'orange': 'bg-orange-500',
        'purple': 'bg-purple-500',
        'teal': 'bg-teal-500',
        'brown': 'bg-amber-900',
        'sky': 'bg-sky-400',
        'lime': 'bg-lime-400',
        'cyan': 'bg-cyan-400',
        'magenta': 'bg-fuchsia-500',
        'gold': 'bg-yellow-500',
        'coral': 'bg-orange-400',
        'mint': 'bg-emerald-300',
        'lavender': 'bg-purple-300',
        'peach': 'bg-orange-300',
        'amber': 'bg-amber-400',
        'emerald': 'bg-emerald-500',
        'sapphire': 'bg-blue-600',
        'ruby': 'bg-red-600',
        'topaz': 'bg-yellow-600',
        'rose': 'bg-rose-400',
        'violet': 'bg-violet-500',
        'indigo': 'bg-indigo-500',
        'silver': 'bg-gray-400',
        'bronze': 'bg-amber-700',
        'copper': 'bg-orange-700',
        'empty': 'bg-gray-100',
        'block': 'bg-gray-800',
        'S': 'bg-gray-500',
        '⭐': 'bg-yellow-200'
      };
      return colorMap[color] || 'bg-gray-300';
    }
    return 'bg-white';
  };

  const getTextColor = (cell: string | number) => {
    if (isColorGrid) {
      const color = cell as string;
      // Dark colors need white text
      const darkColors = ['brown', 'purple', 'blue', 'teal', 'emerald', 'sapphire', 'ruby', 'indigo', 'bronze', 'copper', 'block'];
      return darkColors.includes(color) ? 'text-white' : 'text-gray-900';
    }
    return 'text-gray-900';
  };

  const handleCellClick = (row: number, col: number) => {
    if (isInteractive) {
      setSelectedCell([row, col]);
      onCellClick?.(row, col);
    }
  };

  const isCurrentPosition = (row: number, col: number) => {
    return row === currentPosition[0] && col === currentPosition[1];
  };

  const isVisited = (row: number, col: number) => {
    return visitedPositions.some(([r, c]) => r === row && c === col);
  };

  const isHighlighted = (row: number, col: number) => {
    return highlightPosition && row === highlightPosition[0] && col === highlightPosition[1];
  };

  const isStart = (row: number, col: number) => {
    return showStart && startPosition && row === startPosition[0] && col === startPosition[1];
  };

  const isTarget = (row: number, col: number) => {
    return targetPosition && row === targetPosition[0] && col === targetPosition[1];
  };

  const getCellContent = (cell: string | number, row: number, col: number) => {
    if (isStart(row, col)) {
      return 'S';
    } else if (isTarget(row, col)) {
      return '⭐';
    } else if (!isColorGrid) {
      return cell;
    }
    return null;
  };

  return (
    <div className="relative">
      <div className={`grid ${getGridColsClass()} gap-2 md:gap-3 mx-auto`}>
        {grid.map((row, rowIndex) => (
          <React.Fragment key={rowIndex}>
            {Array.isArray(row) && row.map((cell, colIndex) => {
              const isCurrent = isCurrentPosition(rowIndex, colIndex);
              const visited = isVisited(rowIndex, colIndex);
              const highlighted = isHighlighted(rowIndex, colIndex);
              const isStartCell = isStart(rowIndex, colIndex);
              const isTargetCell = isTarget(rowIndex, colIndex);
              const isSelected = selectedCell && selectedCell[0] === rowIndex && selectedCell[1] === colIndex;

              return (
                <motion.div
                  key={`${rowIndex}-${colIndex}`}
                  layoutId={`cell-${rowIndex}-${colIndex}`}
                  whileHover={isInteractive ? { scale: 1.05 } : {}}
                  whileTap={isInteractive ? { scale: 0.95 } : {}}
                  animate={{
                    scale: isCurrent ? [1, 1.1, 1] : highlighted ? [1, 1.05, 1] : 1,
                    transition: { duration: 0.3 }
                  }}
                  onClick={() => handleCellClick(rowIndex, colIndex)}
                  className={`
                    ${cellSize}
                    ${textSize}
                    rounded-xl
                    flex items-center justify-center
                    font-bold
                    transition-all duration-200
                    cursor-${isInteractive ? 'pointer' : 'default'}
                    relative
                    shadow-lg
                    ${isSelected ? 'ring-4 ring-orange-400 ring-offset-2' : ''}
                    ${isCurrent ? 'ring-4 ring-green-500 ring-offset-2 shadow-xl' : ''}
                    ${highlighted ? 'ring-4 ring-yellow-400 ring-offset-2 shadow-xl' : ''}
                    ${visited ? 'opacity-90' : ''}
                  `}
                  style={{
                    backgroundColor: isColorGrid ? undefined : 'white',
                  }}
                >
                  {/* Background color for color grids */}
                  {isColorGrid && (
                    <div className={`absolute inset-0 rounded-xl ${getColorValue(cell as string)}`} />
                  )}

                  {/* Content */}
                  <div className={`relative z-10 font-black ${getTextColor(cell)}`}>
                    {getCellContent(cell, rowIndex, colIndex)}
                  </div>

                  {/* Current position indicator */}
                  {isCurrent && !isStartCell && (
                    <motion.div
                      layoutId="current-indicator"
                      className="absolute top-1 right-1 w-3 h-3 bg-green-500 rounded-full"
                      animate={{ scale: [1, 1.5, 1] }}
                      transition={{ repeat: Infinity, duration: 1 }}
                    />
                  )}

                  {/* Visited indicator */}
                  {visited && !isCurrent && !isStartCell && (
                    <div className="absolute top-1 right-1 w-2 h-2 bg-blue-500 rounded-full" />
                  )}

                  {/* Selection indicator */}
                  {isSelected && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="absolute inset-0 border-4 border-orange-400 rounded-xl"
                    />
                  )}
                </motion.div>
              );
            })}
          </React.Fragment>
        ))}
      </div>

      {/* Legend */}
      <div className="flex flex-wrap gap-4 justify-center mt-6">
        {showStart && (
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-gradient-to-r from-gray-400 to-gray-500 rounded-lg flex items-center justify-center text-white font-bold">
              S
            </div>
            <span className="text-sm text-gray-600">Start</span>
          </div>
        )}
        
        {targetPosition && (
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-gradient-to-r from-yellow-400 to-amber-500 rounded-lg flex items-center justify-center text-white font-bold">
              ⭐
            </div>
            <span className="text-sm text-gray-600">Target</span>
          </div>
        )}
        
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 bg-green-500 rounded-full" />
          <span className="text-sm text-gray-600">Current</span>
        </div>

        <div className="flex items-center gap-2">
          <div className="w-6 h-6 bg-blue-500 rounded-full" />
          <span className="text-sm text-gray-600">Visited</span>
        </div>

        {isInteractive && (
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 border-4 border-orange-400 rounded-lg" />
            <span className="text-sm text-gray-600">Selected</span>
          </div>
        )}
      </div>
    </div>
  );
}
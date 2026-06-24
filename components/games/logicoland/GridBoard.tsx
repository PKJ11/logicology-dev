"use client";

import { motion } from "framer-motion";
import { GridCell, Color } from "./data";

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
  path = [],
}: GridBoardProps) {
  const gridSize = grid.length;

  return (
    <div className="inline-block rounded-4xl bg-white/90 p-6 shadow-soft">
      <div
        className="grid gap-2"
        style={{
          gridTemplateColumns: `repeat(${gridSize}, minmax(0, 1fr))`,
        }}
      >
        {grid.map((row, rowIndex) =>
          row.map((cell, colIndex) => {
            const isCurrent =
              currentPosition?.row === rowIndex && currentPosition?.col === colIndex;
            const isStart = cell.isStart;
            const isInPath = showPath && path.some((p) => p.row === rowIndex && p.col === colIndex);
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
                className={`relative flex h-16 w-16 items-center justify-center rounded-2xl border-4 md:h-20 md:w-20 ${cell.color ? cell.color.bgClass : "bg-gray-200"} ${
                  isCurrent
                    ? "border-brand-teal shadow-brand"
                    : isStart
                      ? "border-brand-gold shadow-brand"
                      : isInPath
                        ? "border-sky-400"
                        : "border-white"
                } ${isSelectable ? "cursor-pointer" : "cursor-default"} transition-all duration-200`}
              >
                {isStart && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="font-outfit flex h-10 w-10 items-center justify-center rounded-full bg-black/30 text-2xl font-bold text-white">
                      S
                    </span>
                  </div>
                )}

                {isCurrent && !isStart && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="h-8 w-8 animate-ping rounded-full bg-white/30" />
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

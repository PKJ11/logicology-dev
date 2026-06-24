/**
 * HidatoBoard Component
 * Displays the puzzle grid
 */

"use client";

import React from "react";
import { HidatoCell } from "./HidatoCell";

interface HidatoBoardProps {
  puzzle: number[][];
  board: (number | null)[][];
  onCellChange: (row: number, col: number, value: number | null) => void;
  selectedCell?: { row: number; col: number } | null;
  onCellSelect?: (row: number, col: number) => void;
  highlightedNumber?: number | null;
}

export const HidatoBoard: React.FC<HidatoBoardProps> = ({
  puzzle,
  board,
  onCellChange,
  selectedCell,
  onCellSelect,
  highlightedNumber,
}) => {
  const size = board.length;

  return (
    <div className="flex w-full justify-center">
      <div
        className="inline-block rounded-lg bg-gray-50 p-4 shadow-lg"
        style={{
          display: "inline-grid",
          gridTemplateColumns: `repeat(${size}, minmax(0, 1fr))`,
          gap: "0",
          border: "4px solid #1f2937",
        }}
      >
        {board.map((row, rowIdx) =>
          row.map((value, colIdx) => {
            const isClue = puzzle[rowIdx][colIdx] > 0;
            const isSelected = selectedCell?.row === rowIdx && selectedCell?.col === colIdx;
            const isHighlighted =
              highlightedNumber !== null &&
              highlightedNumber !== undefined &&
              value === highlightedNumber;

            return (
              <HidatoCell
                key={`${rowIdx}-${colIdx}`}
                row={rowIdx}
                col={colIdx}
                value={value}
                isClue={isClue}
                isSelected={isSelected}
                isHighlighted={isHighlighted}
                onValueChange={onCellChange}
                onSelect={onCellSelect}
              />
            );
          })
        )}
      </div>
    </div>
  );
};

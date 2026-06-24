/**
 * HidatoControls Component
 * Control buttons for the puzzle gameplay
 */

"use client";

import React from "react";

interface HidatoControlsProps {
  onReset: () => void;
  onHint: () => void;
  onCheck: () => void;
  onNextPuzzle: () => void;
  progress: number;
  hasHintAvailable: boolean;
  isCompleted: boolean;
  hasNextPuzzle: boolean;
  disabled?: boolean;
}

export const HidatoControls: React.FC<HidatoControlsProps> = ({
  onReset,
  onHint,
  onCheck,
  onNextPuzzle,
  progress,
  hasHintAvailable,
  isCompleted,
  hasNextPuzzle,
  disabled = false,
}) => {
  return (
    <div className="w-full space-y-6">
      {/* Progress Bar */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-sm font-semibold text-gray-700">Progress</span>
          <span className="text-sm font-bold text-blue-600">{progress}%</span>
        </div>
        <div className="h-3 w-full overflow-hidden rounded-full bg-gray-200">
          <div
            className="h-full rounded-full bg-gradient-to-r from-blue-500 to-blue-600 transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Main Controls Grid */}
      <div className="grid grid-cols-2 gap-3 sm:gap-4">
        <button
          onClick={onReset}
          disabled={disabled}
          className="rounded-lg bg-gray-500 px-4 py-2 text-sm font-semibold text-white transition-colors duration-200 hover:bg-gray-600 disabled:bg-gray-300 sm:py-3 sm:text-base"
        >
          🔄 Reset
        </button>

        <button
          onClick={onHint}
          disabled={disabled || !hasHintAvailable}
          className="rounded-lg bg-yellow-500 px-4 py-2 text-sm font-semibold text-white transition-colors duration-200 hover:bg-yellow-600 disabled:bg-yellow-300 sm:py-3 sm:text-base"
        >
          💡 Hint
        </button>

        <button
          onClick={onCheck}
          disabled={disabled || progress === 0}
          className="rounded-lg bg-purple-500 px-4 py-2 text-sm font-semibold text-white transition-colors duration-200 hover:bg-purple-600 disabled:bg-purple-300 sm:py-3 sm:text-base"
        >
          ✓ Check
        </button>

        {hasNextPuzzle && isCompleted && (
          <button
            onClick={onNextPuzzle}
            className="col-span-2 rounded-lg bg-green-500 px-4 py-2 text-sm font-semibold text-white transition-colors duration-200 hover:bg-green-600 sm:col-span-1 sm:py-3 sm:text-base"
          >
            ➜ Next
          </button>
        )}
      </div>

      {/* Info Message */}
      {isCompleted && (
        <div className="rounded border-l-4 border-green-500 bg-green-50 p-4">
          <p className="text-sm font-semibold text-green-800 sm:text-base">
            ✨ Puzzle solved! Great job!
          </p>
        </div>
      )}

      {!hasHintAvailable && progress < 100 && (
        <div className="rounded border-l-4 border-blue-500 bg-blue-50 p-4">
          <p className="text-xs text-blue-800 sm:text-sm">Fill all cells to solve the puzzle!</p>
        </div>
      )}
    </div>
  );
};

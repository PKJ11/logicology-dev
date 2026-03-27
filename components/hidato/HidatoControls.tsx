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
        <div className="flex justify-between items-center">
          <span className="text-sm font-semibold text-gray-700">Progress</span>
          <span className="text-sm font-bold text-blue-600">{progress}%</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
          <div
            className="bg-gradient-to-r from-blue-500 to-blue-600 h-full rounded-full transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Main Controls Grid */}
      <div className="grid grid-cols-2 gap-3 sm:gap-4">
        <button
          onClick={onReset}
          disabled={disabled}
          className="px-4 py-2 sm:py-3 bg-gray-500 hover:bg-gray-600 disabled:bg-gray-300 
            text-white font-semibold rounded-lg transition-colors duration-200 
            text-sm sm:text-base"
        >
          🔄 Reset
        </button>

        <button
          onClick={onHint}
          disabled={disabled || !hasHintAvailable}
          className="px-4 py-2 sm:py-3 bg-yellow-500 hover:bg-yellow-600 disabled:bg-yellow-300 
            text-white font-semibold rounded-lg transition-colors duration-200 
            text-sm sm:text-base"
        >
          💡 Hint
        </button>

        <button
          onClick={onCheck}
          disabled={disabled || progress === 0}
          className="px-4 py-2 sm:py-3 bg-purple-500 hover:bg-purple-600 disabled:bg-purple-300 
            text-white font-semibold rounded-lg transition-colors duration-200 
            text-sm sm:text-base"
        >
          ✓ Check
        </button>

        {hasNextPuzzle && isCompleted && (
          <button
            onClick={onNextPuzzle}
            className="px-4 py-2 sm:py-3 bg-green-500 hover:bg-green-600 
              text-white font-semibold rounded-lg transition-colors duration-200 
              text-sm sm:text-base col-span-2 sm:col-span-1"
          >
            ➜ Next
          </button>
        )}
      </div>

      {/* Info Message */}
      {isCompleted && (
        <div className="p-4 bg-green-50 border-l-4 border-green-500 rounded">
          <p className="text-green-800 font-semibold text-sm sm:text-base">
            ✨ Puzzle solved! Great job!
          </p>
        </div>
      )}

      {!hasHintAvailable && progress < 100 && (
        <div className="p-4 bg-blue-50 border-l-4 border-blue-500 rounded">
          <p className="text-blue-800 text-xs sm:text-sm">
            Fill all cells to solve the puzzle!
          </p>
        </div>
      )}
    </div>
  );
};

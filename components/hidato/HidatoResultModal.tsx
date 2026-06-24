/**
 * HidatoResultModal Component
 * Modal for showing puzzle results
 */

"use client";

import React from "react";

interface HidatoResultModalProps {
  isOpen: boolean;
  isCorrect: boolean;
  title: string;
  message: string;
  onClose: () => void;
  onNextPuzzle?: () => void;
  hasNextPuzzle?: boolean;
}

export const HidatoResultModal: React.FC<HidatoResultModalProps> = ({
  isOpen,
  isCorrect,
  title,
  message,
  onClose,
  onNextPuzzle,
  hasNextPuzzle = false,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
      <div className="w-full max-w-md space-y-6 rounded-xl bg-white p-6 shadow-2xl duration-300 animate-in fade-in zoom-in sm:p-8">
        {/* Icon and Title */}
        <div className="space-y-3 text-center">
          <div className="flex justify-center">
            <div
              className={`flex h-16 w-16 items-center justify-center rounded-full text-3xl sm:h-20 sm:w-20 sm:text-4xl ${
                isCorrect ? "animate-pulse bg-green-100" : "bg-red-100"
              }`}
            >
              {isCorrect ? "✨" : "❌"}
            </div>
          </div>

          <h2
            className={`text-2xl font-bold sm:text-3xl ${
              isCorrect ? "text-green-700" : "text-red-700"
            }`}
          >
            {title}
          </h2>
        </div>

        {/* Message */}
        <p className="text-center text-sm leading-relaxed text-gray-700 sm:text-base">{message}</p>

        {/* Actions */}
        <div className="flex flex-col gap-3">
          <button
            onClick={onClose}
            className="rounded-lg bg-gray-500 px-6 py-3 text-sm font-semibold text-white transition-colors duration-200 hover:bg-gray-600 sm:text-base"
          >
            {isCorrect ? "Back to Puzzle" : "Try Again"}
          </button>

          {isCorrect && hasNextPuzzle && onNextPuzzle && (
            <button
              onClick={onNextPuzzle}
              className="rounded-lg bg-green-500 px-6 py-3 text-sm font-semibold text-white transition-colors duration-200 hover:bg-green-600 sm:text-base"
            >
              Next Puzzle →
            </button>
          )}
        </div>

        {/* Decorative Elements */}
        {isCorrect && (
          <div className="flex animate-bounce justify-center gap-2 text-2xl">
            <span>🎉</span>
            <span>🎉</span>
            <span>🎉</span>
          </div>
        )}
      </div>
    </div>
  );
};

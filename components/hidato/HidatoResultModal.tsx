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
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6 sm:p-8 space-y-6 animate-in fade-in zoom-in duration-300">
        {/* Icon and Title */}
        <div className="text-center space-y-3">
          <div className="flex justify-center">
            <div
              className={`w-16 h-16 sm:w-20 sm:h-20 rounded-full flex items-center justify-center text-3xl sm:text-4xl ${
                isCorrect
                  ? "bg-green-100 animate-pulse"
                  : "bg-red-100"
              }`}
            >
              {isCorrect ? "✨" : "❌"}
            </div>
          </div>

          <h2
            className={`text-2xl sm:text-3xl font-bold ${
              isCorrect ? "text-green-700" : "text-red-700"
            }`}
          >
            {title}
          </h2>
        </div>

        {/* Message */}
        <p className="text-center text-gray-700 text-sm sm:text-base leading-relaxed">
          {message}
        </p>

        {/* Actions */}
        <div className="flex flex-col gap-3">
          <button
            onClick={onClose}
            className="px-6 py-3 bg-gray-500 hover:bg-gray-600 text-white font-semibold 
              rounded-lg transition-colors duration-200 text-sm sm:text-base"
          >
            {isCorrect ? "Back to Puzzle" : "Try Again"}
          </button>

          {isCorrect && hasNextPuzzle && onNextPuzzle && (
            <button
              onClick={onNextPuzzle}
              className="px-6 py-3 bg-green-500 hover:bg-green-600 text-white font-semibold 
                rounded-lg transition-colors duration-200 text-sm sm:text-base"
            >
              Next Puzzle →
            </button>
          )}
        </div>

        {/* Decorative Elements */}
        {isCorrect && (
          <div className="flex justify-center gap-2 text-2xl animate-bounce">
            <span>🎉</span>
            <span>🎉</span>
            <span>🎉</span>
          </div>
        )}
      </div>
    </div>
  );
};

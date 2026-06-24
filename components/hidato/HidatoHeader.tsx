/**
 * HidatoHeader Component
 * Displays puzzle title and metadata
 */

"use client";

import React from "react";

interface HidatoHeaderProps {
  title: string;
  difficulty: "easy" | "medium" | "hard";
  size: number;
  puzzleNumber?: number;
  totalPuzzles?: number;
}

const getDifficultyColor = (difficulty: "easy" | "medium" | "hard"): string => {
  switch (difficulty) {
    case "easy":
      return "bg-green-100 text-green-800";
    case "medium":
      return "bg-yellow-100 text-yellow-800";
    case "hard":
      return "bg-red-100 text-red-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
};

const getDifficultyEmoji = (difficulty: "easy" | "medium" | "hard"): string => {
  switch (difficulty) {
    case "easy":
      return "⭐";
    case "medium":
      return "⭐⭐";
    case "hard":
      return "⭐⭐⭐";
    default:
      return "";
  }
};

export const HidatoHeader: React.FC<HidatoHeaderProps> = ({
  title,
  difficulty,
  size,
  puzzleNumber,
  totalPuzzles,
}) => {
  return (
    <div className="w-full space-y-3 sm:space-y-4">
      {/* Title and Badge Container */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <h1 className="text-3xl font-bold text-gray-900 sm:text-4xl">{title}</h1>

        {puzzleNumber !== undefined && totalPuzzles !== undefined && (
          <span className="inline-block rounded-full bg-gray-100 px-3 py-1 text-sm font-semibold text-gray-600">
            {puzzleNumber} / {totalPuzzles}
          </span>
        )}
      </div>

      {/* Metadata Row */}
      <div className="flex flex-wrap items-center gap-2 sm:gap-4">
        {/* Difficulty Badge */}
        <span
          className={`inline-block rounded-full px-3 py-1 text-sm font-semibold sm:py-2 sm:text-base ${getDifficultyColor(
            difficulty
          )}`}
        >
          {getDifficultyEmoji(difficulty)}{" "}
          {difficulty.charAt(0).toUpperCase() + difficulty.slice(1)}
        </span>

        {/* Size Badge */}
        <span className="inline-block rounded-full bg-blue-100 px-3 py-1 text-sm font-semibold text-blue-800 sm:py-2 sm:text-base">
          {size}×{size}
        </span>

        {/* Info Text */}
        <span className="text-xs text-gray-600 sm:text-sm">
          Fill consecutive numbers (1-{size * size}) horizontally, vertically, or diagonally
        </span>
      </div>
    </div>
  );
};

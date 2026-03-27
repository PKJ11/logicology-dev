/**
 * HidatoCell Component
 * Individual cell in the Hidato puzzle board
 */

"use client";

import React, { useState, useEffect } from "react";
import { isAdjacentCell } from "@/app/lib/hidatoUtils";

interface HidatoCellProps {
  row: number;
  col: number;
  value: number | null;
  isClue: boolean;
  isHighlighted?: boolean;
  isSelected?: boolean;
  onValueChange: (row: number, col: number, value: number | null) => void;
  onSelect?: (row: number, col: number) => void;
}

export const HidatoCell: React.FC<HidatoCellProps> = ({
  row,
  col,
  value,
  isClue,
  isHighlighted = false,
  isSelected = false,
  onValueChange,
  onSelect,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [inputValue, setInputValue] = useState(value?.toString() || "");

  useEffect(() => {
    setInputValue(value?.toString() || "");
  }, [value]);

  const handleClick = () => {
    if (!isClue) {
      setIsEditing(true);
      onSelect?.(row, col);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const input = e.target.value;
    setInputValue(input);

    // Allow empty or valid numbers
    if (input === "") {
      onValueChange(row, col, null);
    } else if (/^\d+$/.test(input)) {
      const num = parseInt(input, 10);
      if (num >= 1 && num <= 999) {
        onValueChange(row, col, num);
      }
    }
  };

  const handleBlur = () => {
    setIsEditing(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      setIsEditing(false);
    } else if (e.key === "Backspace" && inputValue === "") {
      onValueChange(row, col, null);
      setIsEditing(false);
    }
  };

  return (
    <div
      onClick={handleClick}
      className={`
        relative w-12 h-12 sm:w-14 sm:h-14 flex items-center justify-center
        border-2 border-gray-300 font-bold text-lg rounded-md
        cursor-pointer transition-all duration-200
        ${isClue ? "bg-gray-100 cursor-default" : "bg-white hover:bg-blue-50"}
        ${isSelected ? "ring-2 ring-blue-500 ring-inset" : ""}
        ${isHighlighted ? "bg-yellow-100" : ""}
        ${value !== null && value > 0 ? "text-gray-800" : "text-gray-400"}
      `}
    >
      {isEditing && !isClue ? (
        <input
          type="text"
          inputMode="numeric"
          value={inputValue}
          onChange={handleInputChange}
          onBlur={handleBlur}
          onKeyDown={handleKeyDown}
          autoFocus
          className="w-10 h-10 text-center bg-blue-100 border-2 border-blue-400 rounded px-1 
            font-bold text-lg focus:outline-none"
          maxLength={3}
        />
      ) : (
        <span>{value && value > 0 ? value : ""}</span>
      )}
    </div>
  );
};

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
      className={`relative flex h-12 w-12 cursor-pointer items-center justify-center rounded-md border-2 border-gray-300 text-lg font-bold transition-all duration-200 sm:h-14 sm:w-14 ${isClue ? "cursor-default bg-gray-100" : "bg-white hover:bg-blue-50"} ${isSelected ? "ring-2 ring-inset ring-blue-500" : ""} ${isHighlighted ? "bg-yellow-100" : ""} ${value !== null && value > 0 ? "text-gray-800" : "text-gray-400"} `}
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
          className="h-10 w-10 rounded border-2 border-blue-400 bg-blue-100 px-1 text-center text-lg font-bold focus:outline-none"
          maxLength={3}
        />
      ) : (
        <span>{value && value > 0 ? value : ""}</span>
      )}
    </div>
  );
};

/**
 * HidatoGame Component
 * Main game component that orchestrates the puzzle experience
 */

"use client";

import React, { useState, useEffect } from "react";
import {
  initializeBoard,
  resetBoard,
  isSolutionCorrect,
  calculateProgress,
  getNextHint,
} from "@/app/lib/hidatoUtils";
import { HidatoBoard } from "./HidatoBoard";
import { HidatoControls } from "./HidatoControls";
import { HidatoHeader } from "./HidatoHeader";
import { HidatoResultModal } from "./HidatoResultModal";
import { hidatoPuzzles } from "data/hidatoPuzzles";

interface HidatoGameProps {
  initialPuzzleId?: string;
}

export const HidatoGame: React.FC<HidatoGameProps> = ({ initialPuzzleId }) => {
  const [currentPuzzleIndex, setCurrentPuzzleIndex] = useState(0);
  const [board, setBoard] = useState<(number | null)[][]>([]);
  const [selectedCell, setSelectedCell] = useState<{
    row: number;
    col: number;
  } | null>(null);
  const [isCompleted, setIsCompleted] = useState(false);
  const [showResultModal, setShowResultModal] = useState(false);
  const [resultMessage, setResultMessage] = useState("");
  const [resultIsCorrect, setResultIsCorrect] = useState(false);
  const [hintsUsed, setHintsUsed] = useState(0);
  const [highlightedNumber, setHighlightedNumber] = useState<number | null>(null);

  // Initialize puzzle on mount or when puzzle changes
  useEffect(() => {
    loadPuzzle(currentPuzzleIndex);
  }, [currentPuzzleIndex]);

  const currentPuzzle = hidatoPuzzles[currentPuzzleIndex];

  const loadPuzzle = (index: number) => {
    if (index >= 0 && index < hidatoPuzzles.length) {
      const puzzle = hidatoPuzzles[index];
      const newBoard = initializeBoard(puzzle.puzzle);
      setBoard(newBoard);
      setSelectedCell(null);
      setIsCompleted(false);
      setShowResultModal(false);
      setHintsUsed(0);
      setHighlightedNumber(null);
    }
  };

  const handleCellChange = (row: number, col: number, value: number | null) => {
    const newBoard = board.map((r) => [...r]);
    newBoard[row][col] = value;
    setBoard(newBoard);

    // Check if puzzle is completed
    const progress = calculateProgress(newBoard, currentPuzzle.puzzle);
    if (progress === 100) {
      const correct = isSolutionCorrect(newBoard, currentPuzzle.solution);
      if (correct) {
        setIsCompleted(true);
        setResultIsCorrect(true);
        setResultMessage(
          `Congratulations! You solved the puzzle in ${hintsUsed} hint${
            hintsUsed !== 1 ? "s" : ""
          }!`
        );
        setShowResultModal(true);
      }
    }
  };

  const handleReset = () => {
    const newBoard = resetBoard(currentPuzzle.puzzle);
    setBoard(newBoard);
    setSelectedCell(null);
    setIsCompleted(false);
    setHintsUsed(0);
    setHighlightedNumber(null);
  };

  const handleHint = () => {
    const hint = getNextHint(board, currentPuzzle.solution);
    if (hint) {
      const newBoard = board.map((r) => [...r]);
      newBoard[hint.row][hint.col] = hint.value;
      setBoard(newBoard);
      setHintsUsed(hintsUsed + 1);
      setSelectedCell({ row: hint.row, col: hint.col });
      setHighlightedNumber(hint.value);

      // Check if puzzle is now complete
      const progress = calculateProgress(newBoard, currentPuzzle.puzzle);
      if (progress === 100) {
        const correct = isSolutionCorrect(newBoard, currentPuzzle.solution);
        if (correct) {
          setIsCompleted(true);
          setResultIsCorrect(true);
          setResultMessage(`Congratulations! You solved the puzzle with hints!`);
          setShowResultModal(true);
        }
      }
    }
  };

  const handleCheck = () => {
    const progress = calculateProgress(board, currentPuzzle.puzzle);

    if (progress < 100) {
      setResultIsCorrect(false);
      setResultMessage(`You've filled ${progress}% of the puzzle. Keep going!`);
      setShowResultModal(true);
    } else {
      const correct = isSolutionCorrect(board, currentPuzzle.solution);
      if (correct) {
        setResultIsCorrect(true);
        setResultMessage(`Perfect! You solved the puzzle correctly! 🎉`);
        setIsCompleted(true);
      } else {
        setResultIsCorrect(false);
        setResultMessage(`Something's not quite right. Check the connections between numbers!`);
      }
      setShowResultModal(true);
    }
  };

  const handleNextPuzzle = () => {
    if (currentPuzzleIndex < hidatoPuzzles.length - 1) {
      setCurrentPuzzleIndex(currentPuzzleIndex + 1);
    }
  };

  const handlePreviousPuzzle = () => {
    if (currentPuzzleIndex > 0) {
      setCurrentPuzzleIndex(currentPuzzleIndex - 1);
    }
  };

  const handleCellSelect = (row: number, col: number) => {
    setSelectedCell({ row, col });
    setHighlightedNumber(board[row][col]);
  };

  const hasHintAvailable = calculateProgress(board, currentPuzzle.puzzle) < 100;
  const hasNextPuzzle = currentPuzzleIndex < hidatoPuzzles.length - 1;
  const hasPreviousPuzzle = currentPuzzleIndex > 0;
  const progress = calculateProgress(board, currentPuzzle.puzzle);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4 sm:p-6 lg:p-8">
      <div className="mx-auto max-w-2xl space-y-8">
        {/* Back Button */}
        <div className="flex justify-start">
          <a
            href="/"
            className="flex items-center gap-2 font-semibold text-blue-600 transition-colors hover:text-blue-700"
          >
            ← Back
          </a>
        </div>

        {/* Header */}
        <HidatoHeader
          title={currentPuzzle.title}
          difficulty={currentPuzzle.difficulty}
          size={currentPuzzle.size}
          puzzleNumber={currentPuzzleIndex + 1}
          totalPuzzles={hidatoPuzzles.length}
        />

        {/* Game Content */}
        <div className="space-y-8 rounded-xl bg-white p-6 shadow-lg sm:p-8">
          {/* Board */}
          {board.length > 0 && (
            <HidatoBoard
              puzzle={currentPuzzle.puzzle}
              board={board}
              onCellChange={handleCellChange}
              selectedCell={selectedCell}
              onCellSelect={handleCellSelect}
              highlightedNumber={highlightedNumber}
            />
          )}

          {/* Controls */}
          <HidatoControls
            onReset={handleReset}
            onHint={handleHint}
            onCheck={handleCheck}
            onNextPuzzle={handleNextPuzzle}
            progress={progress}
            hasHintAvailable={hasHintAvailable}
            isCompleted={isCompleted}
            hasNextPuzzle={hasNextPuzzle}
          />
        </div>

        {/* Navigation */}
        <div className="flex justify-between gap-4">
          <button
            onClick={handlePreviousPuzzle}
            disabled={!hasPreviousPuzzle}
            className="rounded-lg bg-blue-500 px-4 py-2 text-sm font-semibold text-white transition-colors duration-200 hover:bg-blue-600 disabled:bg-gray-300 sm:py-3 sm:text-base"
          >
            ← Previous
          </button>

          <div className="flex flex-1 items-center justify-center">
            <span className="text-sm font-medium text-gray-600 sm:text-base">
              Puzzle {currentPuzzleIndex + 1} of {hidatoPuzzles.length}
            </span>
          </div>

          <button
            onClick={handleNextPuzzle}
            disabled={!hasNextPuzzle}
            className="rounded-lg bg-blue-500 px-4 py-2 text-sm font-semibold text-white transition-colors duration-200 hover:bg-blue-600 disabled:bg-gray-300 sm:py-3 sm:text-base"
          >
            Next →
          </button>
        </div>

        {/* Result Modal */}
        <HidatoResultModal
          isOpen={showResultModal}
          isCorrect={resultIsCorrect}
          title={resultIsCorrect ? "Puzzle Solved!" : "Not Quite Right"}
          message={resultMessage}
          onClose={() => setShowResultModal(false)}
          onNextPuzzle={handleNextPuzzle}
          hasNextPuzzle={hasNextPuzzle && isCompleted}
        />
      </div>
    </div>
  );
};

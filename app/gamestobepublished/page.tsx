"use client";
import React from "react";
import { useEffect, useRef, useState, useMemo } from "react";
import { motion, useInView } from "framer-motion";

const page = () => {
  function AnagramGame() {
    const sectionRef = useRef(null);
    const isInView = useInView(sectionRef, { once: true, margin: "-100px" });

    const initialPuzzles = [
      {
        word: "apple",
        scrambled: "appel", // Only 2 letters are at the wrong place
        category: "Fruit",
      },
      {
        word: "tiger",
        scrambled: "riget",
        category: "Animal",
      },
      {
        word: "house",
        scrambled: "hoesu",
        category: "Home",
      },
      {
        word: "water",
        scrambled: "awter",
        category: "Nature",
      },
      {
        word: "smile",
        scrambled: "sile",
        category: "Emotion",
      },
    ];

    const [puzzles, setPuzzles] = useState(initialPuzzles);
    const [selectedCells, setSelectedCells] = useState<{ row: number; col: number }[]>([]);
    const [completedPuzzles, setCompletedPuzzles] = useState<number[]>([]);
    const [currentHint, setCurrentHint] = useState<number | null>(null);
    const [feedback, setFeedback] = useState<{
      message: string;
      type: "success" | "error" | "hint";
    } | null>(null);
    const [animations, setAnimations] = useState<{
      [key: string]: "swap" | "bounce" | "success" | null;
    }>({});

    // Create grid from puzzles
    const grid = puzzles.map((puzzle, rowIndex) =>
      puzzle.scrambled.split("").map((letter, colIndex) => ({
        letter,
        isCorrect: puzzle.scrambled[colIndex] === puzzle.word[colIndex],
        row: rowIndex,
        col: colIndex,
        id: `${rowIndex}-${colIndex}`,
      }))
    );

    const handleCellClick = (row: number, col: number) => {
      // Don't allow clicks on completed puzzles
      if (completedPuzzles.includes(row)) return;

      const cellId = `${row}-${col}`;

      // Add animation
      setAnimations((prev) => ({ ...prev, [cellId]: "bounce" }));
      setTimeout(() => setAnimations((prev) => ({ ...prev, [cellId]: null })), 600);

      // If this is the first selection
      if (selectedCells.length === 0) {
        setSelectedCells([{ row, col }]);

        // Show visual feedback for selection
        setAnimations((prev) => ({ ...prev, [cellId]: "swap" }));
      }
      // If this is the second selection and in same row
      else if (selectedCells.length === 1 && selectedCells[0].row === row) {
        const [firstCell] = selectedCells;

        // Don't allow swapping same cell
        if (firstCell.row === row && firstCell.col === col) {
          setSelectedCells([]);
          setAnimations((prev) => ({ ...prev, [cellId]: null }));
          return;
        }

        // Perform swap
        const newPuzzles = [...puzzles];
        const scrambled = newPuzzles[row].scrambled.split("");
        [scrambled[firstCell.col], scrambled[col]] = [scrambled[col], scrambled[firstCell.col]];
        newPuzzles[row].scrambled = scrambled.join("");

        setPuzzles(newPuzzles);

        // Check if word is now correct
        const isCorrect = newPuzzles[row].scrambled === newPuzzles[row].word;

        if (isCorrect) {
          // Mark puzzle as completed
          setCompletedPuzzles((prev) => [...prev, row]);

          // Add success animation to all cells in the row
          const newAnimations = { ...animations };
          for (let i = 0; i < scrambled.length; i++) {
            newAnimations[`${row}-${i}`] = "success";
          }
          setAnimations(newAnimations);

          // Show success message
          setFeedback({
            message: `🎉 Excellent! "${newPuzzles[row].word}" is correct!`,
            type: "success",
          });

          // Clear animations after delay
          setTimeout(() => {
            setAnimations((prev) => {
              const updated = { ...prev };
              for (let i = 0; i < scrambled.length; i++) {
                delete updated[`${row}-${i}`];
              }
              return updated;
            });
          }, 1500);
        } else {
          // Show swap animation
          const firstCellId = `${firstCell.row}-${firstCell.col}`;
          setAnimations((prev) => ({
            ...prev,
            [firstCellId]: "swap",
            [cellId]: "swap",
          }));

          // Check if only one swap away from solution
          const correctPositions = newPuzzles[row].scrambled
            .split("")
            .map((letter, idx) => letter === newPuzzles[row].word[idx])
            .filter(Boolean).length;

          if (correctPositions >= newPuzzles[row].word.length - 2) {
            setFeedback({
              message: "✓ You're getting close! Keep going!",
              type: "hint",
            });
          }
        }

        // Reset selection
        setTimeout(() => {
          setSelectedCells([]);
          const firstCellId = `${firstCell.row}-${firstCell.col}`;
          setAnimations((prev) => ({
            ...prev,
            [firstCellId]: null,
            [cellId]: null,
          }));
        }, 500);
      } else {
        // Different row selected, start new selection
        setSelectedCells([{ row, col }]);
        setAnimations((prev) => ({ ...prev, [cellId]: "swap" }));
      }
    };

    const getCellAnimationClass = (cellId: string) => {
      const animation = animations[cellId];
      if (!animation) return "";

      switch (animation) {
        case "bounce":
          return "animate-bounce-in";
        case "swap":
          return "animate-pulse scale-110 z-10";
        case "success":
          return "animate-success-spin";
        default:
          return "";
      }
    };

    const getHint = (row: number) => {
      if (completedPuzzles.includes(row)) return;

      setCurrentHint(row);

      // Find the first incorrect position
      const puzzle = puzzles[row];
      const scrambled = puzzle.scrambled.split("");
      const target = puzzle.word.split("");

      let hintIndex = -1;
      for (let i = 0; i < scrambled.length; i++) {
        if (scrambled[i] !== target[i]) {
          hintIndex = i;
          break;
        }
      }

      if (hintIndex !== -1) {
        const correctLetter = target[hintIndex];
        const currentIndex = scrambled.indexOf(correctLetter, hintIndex + 1);

        if (currentIndex !== -1) {
          // Highlight the cells that should be swapped
          setAnimations((prev) => ({
            ...prev,
            [`${row}-${hintIndex}`]: "bounce",
            [`${row}-${currentIndex}`]: "bounce",
          }));

          setFeedback({
            message: `💡 Try swapping position ${hintIndex + 1} with position ${currentIndex + 1}`,
            type: "hint",
          });

          setTimeout(() => {
            setAnimations((prev) => ({
              ...prev,
              [`${row}-${hintIndex}`]: null,
              [`${row}-${currentIndex}`]: null,
            }));
            setCurrentHint(null);
          }, 3000);
        }
      }
    };

    const resetPuzzle = (row: number) => {
      const newPuzzles = [...puzzles];
      newPuzzles[row].scrambled = initialPuzzles[row].scrambled;
      setPuzzles(newPuzzles);

      // Remove from completed if it was completed
      setCompletedPuzzles((prev) => prev.filter((r) => r !== row));

      // Clear animations for this row
      setAnimations((prev) => {
        const updated = { ...prev };
        for (let i = 0; i < 5; i++) {
          delete updated[`${row}-${i}`];
        }
        return updated;
      });

      setFeedback({
        message: "🔄 Puzzle reset! Try again!",
        type: "hint",
      });
    };

    const resetAll = () => {
      setPuzzles(initialPuzzles);
      setCompletedPuzzles([]);
      setSelectedCells([]);
      setAnimations({});
      setFeedback({
        message: "✨ All puzzles reset! Start fresh!",
        type: "hint",
      });
    };

    return (
      <section ref={sectionRef} className="w-full bg-brand-grayBg py-12 sm:py-16 md:py-20">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
          className="mx-auto max-w-[80vw] rounded-[22px] bg-gradient-to-br from-white to-blue-50 p-6 shadow-soft sm:p-10"
        >
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
            className="mb-8 text-center"
          >
            <h2 className="headingstyle mb-2 font-extrabold text-brand-teal">
              Anagram Swap Challenge
            </h2>
            <p className="textstyles mx-auto max-w-2xl text-brand-tealDark/80">
              Click two letters in the same row to swap them and form the correct word!
            </p>

            {/* Progress Bar */}
            <div className="mx-auto mt-4 max-w-md">
              <div className="mb-2 flex justify-between text-sm text-brand-tealDark/70">
                <span>Progress</span>
                <span>
                  {completedPuzzles.length} / {puzzles.length} completed
                </span>
              </div>
              <div className="h-3 overflow-hidden rounded-full bg-blue-100">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-brand-teal to-brand-coral transition-all duration-500"
                  style={{ width: `${(completedPuzzles.length / puzzles.length) * 100}%` }}
                />
              </div>
            </div>
          </motion.div>

          {/* Main Game Container */}
          <div className="mx-auto max-w-[60vw] md:max-w-[60vw] lg:max-w-[60vw]">
            {/* Game Container */}
            <div className="rounded-2xl bg-gradient-to-b from-white to-blue-50 p-6 shadow-inner">
              {/* Control Buttons */}
              <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <div className="flex gap-1">
                    <div className="h-4 w-4 rounded-md bg-gradient-to-br from-blue-100 to-blue-200 ring-2 ring-blue-300" />
                    <span className="text-xs text-brand-tealDark/70">Selected</span>
                  </div>
                  <div className="flex gap-1">
                    <div className="h-4 w-4 rounded-md bg-gradient-to-br from-green-100 to-green-200 ring-2 ring-green-300" />
                    <span className="text-xs text-brand-tealDark/70">Correct Position</span>
                  </div>
                </div>

                <button
                  onClick={resetAll}
                  className="rounded-full bg-gradient-to-r from-brand-teal to-brand-coral px-4 py-2 text-sm font-medium text-white transition-all duration-300 hover:scale-105 hover:shadow-md active:scale-95"
                >
                  Reset All Puzzles
                </button>
              </div>

              {/* Feedback Message */}
              {feedback && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`mb-4 rounded-lg px-4 py-3 text-center font-medium ${
                    feedback.type === "success"
                      ? "bg-gradient-to-r from-green-100 to-green-50 text-green-700 ring-1 ring-green-200"
                      : feedback.type === "error"
                        ? "bg-gradient-to-r from-red-100 to-red-50 text-red-700 ring-1 ring-red-200"
                        : "bg-gradient-to-r from-blue-100 to-blue-50 text-blue-700 ring-1 ring-blue-200"
                  }`}
                >
                  {feedback.message}
                </motion.div>
              )}

              {/* Puzzle Grid */}
              <div className="space-y-4">
                {grid.map((row, rowIndex) => {
                  const isCompleted = completedPuzzles.includes(rowIndex);
                  const puzzle = puzzles[rowIndex];

                  return (
                    <motion.div
                      key={rowIndex}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: rowIndex * 0.1 }}
                      className={`rounded-xl p-4 transition-all duration-300 ${
                        isCompleted
                          ? "bg-gradient-to-r from-green-50 to-emerald-50 ring-2 ring-green-200"
                          : selectedCells.some((cell) => cell.row === rowIndex)
                            ? "bg-gradient-to-r from-blue-50 to-indigo-50 ring-2 ring-blue-200"
                            : "bg-white ring-1 ring-black/10"
                      }`}
                    >
                      <div className="mb-3 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div
                            className={`flex h-8 w-8 items-center justify-center rounded-full ${
                              isCompleted
                                ? "bg-gradient-to-br from-green-400 to-green-500 text-white"
                                : "bg-gradient-to-br from-blue-100 to-blue-200 text-blue-700"
                            }`}
                          >
                            {rowIndex + 1}
                          </div>
                          <div>
                            <span className="text-sm font-medium text-brand-tealDark">
                              Category: {puzzle.category}
                            </span>
                            {isCompleted && (
                              <span className="ml-2 rounded-full bg-green-100 px-2 py-0.5 text-xs font-medium text-green-700">
                                ✓ Completed
                              </span>
                            )}
                          </div>
                        </div>

                        <div className="flex gap-2">
                          {!isCompleted && (
                            <button
                              onClick={() => getHint(rowIndex)}
                              disabled={currentHint === rowIndex}
                              className={`rounded-full px-3 py-1 text-xs font-medium transition-all duration-300 ${
                                currentHint === rowIndex
                                  ? "bg-yellow-100 text-yellow-700"
                                  : "bg-gradient-to-r from-yellow-100 to-amber-100 text-yellow-700 hover:scale-105"
                              }`}
                            >
                              💡 Hint
                            </button>
                          )}
                          <button
                            onClick={() => resetPuzzle(rowIndex)}
                            className="rounded-full bg-gradient-to-r from-gray-100 to-gray-200 px-3 py-1 text-xs font-medium text-gray-700 transition-all duration-300 hover:scale-105"
                          >
                            🔄 Reset
                          </button>
                        </div>
                      </div>

                      {/* Letter Cells */}
                      <div className="grid grid-cols-5 gap-3">
                        {row.map((cell, cellIndex) => {
                          const isSelected = selectedCells.some(
                            (selected) => selected.row === rowIndex && selected.col === cellIndex
                          );
                          const isCorrectPosition =
                            puzzle.scrambled[cellIndex] === puzzle.word[cellIndex];

                          return (
                            <motion.button
                              key={cellIndex}
                              onClick={() => handleCellClick(rowIndex, cellIndex)}
                              disabled={isCompleted}
                              whileHover={{ scale: isCompleted ? 1 : 1.05 }}
                              whileTap={{ scale: isCompleted ? 1 : 0.95 }}
                              className={`relative flex aspect-square w-full items-center justify-center rounded-xl text-2xl font-bold transition-all duration-300 ${getCellAnimationClass(`${rowIndex}-${cellIndex}`)} ${
                                isCompleted
                                  ? "shadow-green bg-gradient-to-br from-green-200 to-green-300 text-green-800"
                                  : isSelected
                                    ? "shadow-blue z-10 scale-110 bg-gradient-to-br from-blue-200 to-blue-300 text-blue-800"
                                    : isCorrectPosition
                                      ? "bg-gradient-to-br from-green-100 to-green-200 text-green-700 ring-2 ring-green-300"
                                      : "bg-gradient-to-br from-gray-100 to-gray-200 text-gray-700 hover:from-blue-50 hover:to-blue-100"
                              } ${isCompleted ? "cursor-default" : "cursor-pointer"} shadow-md hover:shadow-lg`}
                            >
                              <span className="select-none">{cell.letter.toUpperCase()}</span>

                              {/* Position indicator */}
                              <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-black/10 text-xs font-normal">
                                {cellIndex + 1}
                              </span>

                              {/* Selection indicator */}
                              {isSelected && (
                                <div className="absolute inset-0 rounded-xl ring-4 ring-blue-400/50" />
                              )}
                            </motion.button>
                          );
                        })}
                      </div>

                      {/* Word Length Indicator */}
                      <div className="mt-3 flex justify-center">
                        <div className="flex gap-2">
                          {puzzle.word.split("").map((_, idx) => (
                            <div
                              key={idx}
                              className={`h-1 w-8 rounded-full transition-all duration-300 ${
                                puzzle.scrambled[idx] === puzzle.word[idx]
                                  ? "bg-green-400"
                                  : "bg-gray-300"
                              }`}
                            />
                          ))}
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>

              {/* Instructions */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="mt-8 rounded-xl bg-gradient-to-r from-blue-50 to-indigo-50 p-4"
              >
                <h3 className="mb-2 text-sm font-semibold text-brand-tealDark">How to Play:</h3>
                <ul className="space-y-1 text-sm text-brand-tealDark/70">
                  <li className="flex items-center gap-2">
                    <div className="h-2 w-2 rounded-full bg-blue-400" />
                    Click one letter to select it (it will glow blue)
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="h-2 w-2 rounded-full bg-green-400" />
                    Click another letter in the same row to swap them
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="h-2 w-2 rounded-full bg-yellow-400" />
                    Form the correct word - the row will turn green when complete!
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="h-2 w-2 rounded-full bg-purple-400" />
                    Use hints if you're stuck, or reset a puzzle to start over
                  </li>
                </ul>
              </motion.div>
            </div>
          </div>
        </motion.div>

        {/* Add custom animations to global styles */}
        <style jsx global>{`
          @keyframes success-spin {
            0% {
              transform: rotateY(0) scale(1);
            }
            50% {
              transform: rotateY(180deg) scale(1.1);
            }
            100% {
              transform: rotateY(360deg) scale(1);
            }
          }

          .animate-success-spin {
            animation: success-spin 0.6s ease-out forwards;
          }

          .shadow-green {
            box-shadow: 0 4px 15px rgba(72, 187, 120, 0.3);
          }

          .shadow-blue {
            box-shadow: 0 4px 15px rgba(59, 130, 246, 0.3);
          }
        `}</style>
      </section>
    );
  }

  function WordFormationGame() {
    const sectionRef = useRef(null);
    const isInView = useInView(sectionRef, { once: true, margin: "-100px" });

    // Level 2 puzzles with scrambled letters from target words
    const level2Puzzles = [
      {
        id: 1,
        targetWord: "CAT",
        scrambledLetters: ["C", "A", "T"], // Only the letters needed for CAT
        category: "Pets",
        hint: "A common house pet that says 'meow'",
        difficulty: "Easy",
      },
      {
        id: 2,
        targetWord: "MOON",
        scrambledLetters: ["M", "O", "O", "N"], // Only the letters needed for MOON
        category: "Space",
        hint: "Shines bright in the night sky",
        difficulty: "Easy",
      },
      {
        id: 3,
        targetWord: "FLOWER",
        scrambledLetters: ["F", "L", "O", "W", "E", "R"], // Only FLOWER letters
        category: "Nature",
        hint: "Blooms in spring with colorful petals",
        difficulty: "Medium",
      },
      {
        id: 4,
        targetWord: "BOOK",
        scrambledLetters: ["B", "O", "O", "K"], // Only BOOK letters
        category: "School",
        hint: "You read stories from this",
        difficulty: "Easy",
      },
      {
        id: 5,
        targetWord: "WATER",
        scrambledLetters: ["W", "A", "T", "E", "R"], // Only WATER letters
        category: "Elements",
        hint: "You drink this to stay hydrated",
        difficulty: "Medium",
      },
    ];

    // Game state
    const [currentPuzzleIndex, setCurrentPuzzleIndex] = useState(0);
    const [draggedLetter, setDraggedLetter] = useState<{
      letter: string;
      sourceIndex: number;
    } | null>(null);
    const [wordCells, setWordCells] = useState<(string | null)[]>([]);
    const [availableLetters, setAvailableLetters] = useState<string[]>([]);
    const [isCompleted, setIsCompleted] = useState(false);
    const [showHint, setShowHint] = useState(false);
    const [score, setScore] = useState(0);
    const [animations, setAnimations] = useState<{
      [key: string]: "success" | "error" | "drop" | "pulse" | null;
    }>({});
    const [gameHistory, setGameHistory] = useState<Array<{ puzzleId: number; attempts: number }>>(
      []
    );
    const [isDragging, setIsDragging] = useState(false);
    const [hoveredDropIndex, setHoveredDropIndex] = useState<number | null>(null);
    const [feedback, setFeedback] = useState<{
      message: string;
      type: "success" | "error" | "hint";
    } | null>(null);

    // Initialize current puzzle
    useEffect(() => {
      const currentPuzzle = level2Puzzles[currentPuzzleIndex];
      // Initialize word cells as empty
      setWordCells(Array(currentPuzzle.targetWord.length).fill(null));
      // Shuffle available letters (using only letters from the target word)
      const shuffled = [...currentPuzzle.scrambledLetters].sort(() => Math.random() - 0.5);
      setAvailableLetters(shuffled);
      setIsCompleted(false);
      setDraggedLetter(null);
      setShowHint(false);
      setAnimations({});
      setHoveredDropIndex(null);
      setFeedback(null);
    }, [currentPuzzleIndex]);

    // Handle drag start from available letters
    const handleDragStart = (letter: string, index: number, e: React.DragEvent<HTMLDivElement>) => {
      e.dataTransfer.setData("text/plain", JSON.stringify({ letter, sourceIndex: index }));
      e.dataTransfer.effectAllowed = "copyMove";
      setDraggedLetter({ letter, sourceIndex: index });
      setIsDragging(true);

      // Add pulse animation to the dragged letter
      setAnimations((prev) => ({ ...prev, [`source-${index}`]: "pulse" }));

      // Make the dragged element transparent
      if (e.currentTarget) {
        e.currentTarget.style.opacity = "0.4";
      }
    };

    // Handle drag over word cells
    const handleDragOver = (index: number, e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      setHoveredDropIndex(index);

      if (wordCells[index] === null) {
        e.dataTransfer.dropEffect = "copy";
      } else {
        e.dataTransfer.dropEffect = "none";
      }
    };

    // Handle drag end
    const handleDragEnd = () => {
      setIsDragging(false);
      setHoveredDropIndex(null);

      // Reset opacity of all source letters
      setAnimations((prev) => {
        const newAnimations = { ...prev };
        availableLetters.forEach((_, index) => {
          if (newAnimations[`source-${index}`] === "pulse") {
            newAnimations[`source-${index}`] = null;
          }
        });
        return newAnimations;
      });
    };

    // Handle drop on word cells
    const handleDrop = (index: number, e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      setIsDragging(false);
      setHoveredDropIndex(null);

      if (wordCells[index] !== null) return;

      try {
        const data = JSON.parse(e.dataTransfer.getData("text/plain"));
        const { letter, sourceIndex } = data;

        // Update word cells
        const newWordCells = [...wordCells];
        newWordCells[index] = letter;
        setWordCells(newWordCells);

        // Remove letter from available letters
        const newAvailableLetters = [...availableLetters];
        newAvailableLetters[sourceIndex] = "";
        setAvailableLetters(newAvailableLetters);

        // Add drop animation
        setAnimations((prev) => ({ ...prev, [`target-${index}`]: "drop" }));

        // Check if word is complete
        setTimeout(() => {
          const isWordComplete = newWordCells.every((cell) => cell !== null);
          if (isWordComplete) {
            checkWord();
          }
        }, 300);
      } catch (error) {
        console.error("Drop error:", error);
      }

      setDraggedLetter(null);
    };

    // Handle drag leave from drop zone
    const handleDragLeave = () => {
      setHoveredDropIndex(null);
    };

    // Handle click to remove letter from word cell
    const handleWordCellClick = (index: number) => {
      const letter = wordCells[index];
      if (letter === null || isCompleted) return;

      // Return letter to available letters
      const newWordCells = [...wordCells];
      newWordCells[index] = null;
      setWordCells(newWordCells);

      // Find first empty spot in available letters
      const newAvailableLetters = [...availableLetters];
      const emptyIndex = newAvailableLetters.findIndex((l) => l === "");
      if (emptyIndex !== -1) {
        newAvailableLetters[emptyIndex] = letter;
        setAvailableLetters(newAvailableLetters);

        // Add animation for returning letter
        setAnimations((prev) => ({ ...prev, [`source-${emptyIndex}`]: "drop" }));
      }

      setIsCompleted(false);
      setFeedback(null);
    };

    // Check if formed word is correct
    const checkWord = () => {
      const currentPuzzle = level2Puzzles[currentPuzzleIndex];
      const formedWord = wordCells.join("");
      const isCorrect = formedWord === currentPuzzle.targetWord;

      if (isCorrect) {
        // Success animation for all letters
        const newAnimations: typeof animations = {};
        wordCells.forEach((_, index) => {
          newAnimations[`target-${index}`] = "success";
        });
        setAnimations(newAnimations);

        setIsCompleted(true);
        setScore((prev) => prev + 100 * currentPuzzle.targetWord.length);

        // Add to game history
        setGameHistory((prev) => [
          ...prev,
          {
            puzzleId: currentPuzzle.id,
            attempts: 1,
          },
        ]);

        // Celebration effect
        setTimeout(() => {
          setFeedback({
            message: `🎉 Excellent! You formed "${currentPuzzle.targetWord}"!`,
            type: "success",
          });
        }, 500);
      } else {
        // Error animation
        const newAnimations: typeof animations = {};
        wordCells.forEach((_, index) => {
          newAnimations[`target-${index}`] = "error";
        });
        setAnimations(newAnimations);

        setFeedback({
          message: "✗ Not quite right! Try rearranging the letters.",
          type: "error",
        });

        // Clear error animation after delay
        setTimeout(() => {
          setAnimations((prev) => {
            const newAnimations = { ...prev };
            wordCells.forEach((_, index) => {
              delete newAnimations[`target-${index}`];
            });
            return newAnimations;
          });
          setFeedback(null);
        }, 1500);
      }
    };

    // Reset current puzzle
    const resetPuzzle = () => {
      const currentPuzzle = level2Puzzles[currentPuzzleIndex];
      setWordCells(Array(currentPuzzle.targetWord.length).fill(null));
      const shuffled = [...currentPuzzle.scrambledLetters].sort(() => Math.random() - 0.5);
      setAvailableLetters(shuffled);
      setIsCompleted(false);
      setShowHint(false);
      setAnimations({});
      setFeedback(null);
    };

    // Move to next puzzle
    const nextPuzzle = () => {
      if (currentPuzzleIndex < level2Puzzles.length - 1) {
        setCurrentPuzzleIndex((prev) => prev + 1);
        setFeedback(null);
      }
    };

    // Move to previous puzzle
    const previousPuzzle = () => {
      if (currentPuzzleIndex > 0) {
        setCurrentPuzzleIndex((prev) => prev - 1);
        setFeedback(null);
      }
    };

    // Show solution
    const showSolution = () => {
      const currentPuzzle = level2Puzzles[currentPuzzleIndex];
      const solutionLetters = currentPuzzle.targetWord.split("");
      setWordCells(solutionLetters);
      setAvailableLetters(Array(solutionLetters.length).fill(""));

      // Add success animation
      const newAnimations: typeof animations = {};
      solutionLetters.forEach((_, index) => {
        newAnimations[`target-${index}`] = "success";
      });
      setAnimations(newAnimations);

      setIsCompleted(true);
      setScore((prev) => prev + 50);

      setTimeout(() => {
        setFeedback({
          message: `Here's the correct word: "${currentPuzzle.targetWord}"`,
          type: "hint",
        });
      }, 500);
    };

    // Get animation class
    const getAnimationClass = (key: string) => {
      const animation = animations[key];
      if (!animation) return "";

      switch (animation) {
        case "success":
          return "animate-success-pop";
        case "error":
          return "animate-error-shake";
        case "drop":
          return "animate-drop-bounce";
        case "pulse":
          return "animate-pulse";
        default:
          return "";
      }
    };

    const currentPuzzle = level2Puzzles[currentPuzzleIndex];
    const progress = ((currentPuzzleIndex + 1) / level2Puzzles.length) * 100;

    // Calculate cell size based on word length
    const getGridCols = (length: number) => {
      if (length <= 4) return "grid-cols-4";
      if (length <= 6) return "grid-cols-6";
      return "grid-cols-5";
    };

    const topGridCols = getGridCols(currentPuzzle.scrambledLetters.length);
    const bottomGridCols = getGridCols(currentPuzzle.targetWord.length);

    return (
      <section
        ref={sectionRef}
        className="w-full bg-gradient-to-b from-brand-grayBg to-blue-50 py-12 sm:py-16 md:py-20"
      >
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
          className="mx-auto max-w-[85vw] rounded-[22px] bg-gradient-to-br from-white to-purple-50 p-6 shadow-xl sm:p-10"
        >
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
            className="mb-8 text-center"
          >
            <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-purple-100 to-pink-100 px-4 py-1">
              <span className="text-sm font-semibold text-purple-700">Level 2</span>
              <span className="h-1 w-1 rounded-full bg-purple-400" />
              <span className="text-sm text-purple-600">Word Formation</span>
              <span className="ml-2 rounded-full bg-amber-100 px-2 py-0.5 text-xs font-medium text-amber-700">
                {currentPuzzle.difficulty}
              </span>
            </div>

            <h2 className="headingstyle mb-2 font-extrabold text-brand-teal">
              Drag & Drop Word Builder
            </h2>
            <p className="textstyles mx-auto max-w-2xl text-brand-tealDark/80">
              Drag letters to form the hidden word! Letters below are the same size as above.
            </p>

            {/* Progress and Score */}
            <div className="mx-auto mt-6 flex max-w-2xl flex-col items-center justify-between gap-4 sm:flex-row">
              <div className="flex-1">
                <div className="mb-1 flex justify-between text-sm text-brand-tealDark/70">
                  <span>
                    Puzzle {currentPuzzleIndex + 1} of {level2Puzzles.length}
                  </span>
                  <span>{Math.round(progress)}%</span>
                </div>
                <div className="h-3 overflow-hidden rounded-full bg-gray-200">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-brand-teal via-purple-500 to-pink-500 transition-all duration-500"
                    style={{ width: `${progress}%` }}
                  />
                </div>
              </div>

              <div className="rounded-xl bg-gradient-to-r from-blue-50 to-indigo-50 px-4 py-2">
                <div className="text-center text-sm text-brand-tealDark/70">Score</div>
                <div className="text-center text-3xl font-bold text-brand-teal">{score}</div>
              </div>
            </div>
          </motion.div>

          {/* Main Game Container */}
          <div className="mx-auto max-w-[70vw] md:max-w-[70vw] lg:max-w-[70vw]">
            <div className="rounded-2xl bg-gradient-to-b from-white to-blue-50 p-6 shadow-inner">
              {/* Puzzle Info */}
              <div className="mb-6 rounded-xl bg-gradient-to-r from-purple-50 to-pink-50 p-4">
                <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
                  <div>
                    <div className="text-lg font-bold text-brand-tealDark">
                      Category: <span className="text-purple-600">{currentPuzzle.category}</span>
                    </div>
                    <div className="mt-1 text-sm text-brand-tealDark/70">
                      Target: <span className="font-bold">{currentPuzzle.targetWord.length}</span>{" "}
                      letters
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <button
                      onClick={() => setShowHint(!showHint)}
                      className="rounded-full bg-gradient-to-r from-yellow-100 to-amber-100 px-4 py-2 text-sm font-medium text-yellow-700 transition-all duration-300 hover:scale-105 hover:shadow-md"
                    >
                      {showHint ? "Hide" : "Show"} Hint
                    </button>
                    <button
                      onClick={showSolution}
                      disabled={isCompleted}
                      className={`rounded-full px-4 py-2 text-sm font-medium transition-all duration-300 hover:scale-105 hover:shadow-md ${
                        isCompleted
                          ? "cursor-not-allowed bg-gray-100 text-gray-400"
                          : "bg-gradient-to-r from-blue-100 to-blue-200 text-blue-700"
                      }`}
                    >
                      Show Answer
                    </button>
                    <button
                      onClick={resetPuzzle}
                      className="rounded-full bg-gradient-to-r from-gray-100 to-gray-200 px-4 py-2 text-sm font-medium text-gray-700 transition-all duration-300 hover:scale-105 hover:shadow-md"
                    >
                      Reset
                    </button>
                  </div>
                </div>

                {/* Hint */}
                {showHint && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    className="mt-3 overflow-hidden"
                  >
                    <div className="rounded-lg bg-gradient-to-r from-blue-50 to-indigo-50 p-3">
                      <div className="flex items-start gap-2">
                        <span className="mt-0.5 text-xl">💡</span>
                        <div>
                          <div className="font-medium text-brand-tealDark">Hint:</div>
                          <div className="text-sm text-brand-tealDark/80">{currentPuzzle.hint}</div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </div>

              {/* Feedback Message */}
              {feedback && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`mb-6 rounded-lg px-4 py-3 text-center font-medium ${
                    feedback.type === "success"
                      ? "bg-gradient-to-r from-green-100 to-green-50 text-green-700 ring-1 ring-green-200"
                      : feedback.type === "error"
                        ? "bg-gradient-to-r from-red-100 to-red-50 text-red-700 ring-1 ring-red-200"
                        : "bg-gradient-to-r from-blue-100 to-blue-50 text-blue-700 ring-1 ring-blue-200"
                  }`}
                >
                  {feedback.message}
                </motion.div>
              )}

              {/* Available Letters Grid - UPPER SECTION */}
              <div className="mb-8">
                <h3 className="mb-4 text-center text-lg font-bold text-brand-tealDark">
                  Available Letters (Drag from here)
                </h3>
                <div className={`grid ${topGridCols} gap-4`}>
                  {availableLetters.map((letter, index) => (
                    <div
                      key={`source-${index}`}
                      className={`flex aspect-square items-center justify-center rounded-xl text-3xl font-bold transition-all duration-300 ${getAnimationClass(
                        `source-${index}`
                      )} ${
                        letter
                          ? "cursor-grab bg-gradient-to-br from-blue-200 to-blue-400 text-blue-900 shadow-lg hover:scale-105 hover:shadow-xl active:scale-95 active:cursor-grabbing"
                          : "cursor-default bg-gradient-to-br from-gray-100 to-gray-300 text-transparent"
                      } ${isDragging && letter ? "z-20 scale-110" : ""}`}
                      draggable={!!letter}
                      onDragStart={(e) => handleDragStart(letter, index, e)}
                      onDragEnd={handleDragEnd}
                      title={letter ? `Drag letter ${letter}` : "Used letter"}
                    >
                      {letter || "✓"}
                    </div>
                  ))}
                </div>
              </div>

              {/* Drag Indicator with Arrow */}
              <div className="mb-8 flex items-center justify-center">
                <div className="relative flex flex-col items-center">
                  <div className="mb-2 text-sm font-medium text-brand-tealDark/70">
                    Drag letters down to empty slots ↓
                  </div>
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-r from-blue-100 to-purple-100">
                    <svg
                      className="h-8 w-8 animate-bounce text-purple-500"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={3}
                        d="M19 14l-7 7m0 0l-7-7m7 7V3"
                      />
                    </svg>
                  </div>
                </div>
              </div>

              {/* Word Formation Area - SAME SIZE AS ABOVE */}
              <div className="mb-8">
                <h3 className="mb-4 text-center text-lg font-bold text-brand-tealDark">
                  Form the Word Here (Same size cells)
                </h3>
                <div className="flex justify-center">
                  <div className={`grid ${bottomGridCols} gap-4`}>
                    {wordCells.map((letter, index) => (
                      <div
                        key={`target-${index}`}
                        className={`flex aspect-square items-center justify-center rounded-xl text-3xl font-bold transition-all duration-300 ${getAnimationClass(
                          `target-${index}`
                        )} ${
                          letter === null
                            ? "ring-dashed cursor-pointer bg-gradient-to-br from-gray-100 to-gray-300 text-gray-500 ring-4 ring-gray-400 hover:bg-gradient-to-br hover:from-gray-200 hover:to-gray-400 hover:ring-gray-500"
                            : "bg-gradient-to-br from-green-200 to-green-400 text-green-900 shadow-lg"
                        } ${hoveredDropIndex === index && letter === null ? "scale-110 bg-gradient-to-br from-green-100 to-green-300 ring-8 ring-green-400/50" : ""}`}
                        onDragOver={(e) => handleDragOver(index, e)}
                        onDragLeave={handleDragLeave}
                        onDrop={(e) => handleDrop(index, e)}
                        onClick={() => handleWordCellClick(index)}
                        title={
                          letter === null
                            ? "Drop letter here (click to remove)"
                            : `Click to remove ${letter}`
                        }
                      >
                        {letter === null ? (
                          <div className="p-2 text-center md:p-10">
                            <div className="text-xl font-medium text-gray-600 md:text-3xl">?</div>
                            <div className="mt-1 text-xl text-gray-500 md:text-3xl">
                              Slot {index + 1}
                            </div>
                          </div>
                        ) : (
                          <span className="select-none text-4xl font-bold">{letter}</span>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Progress indicator */}
                <div className="mt-4 text-center">
                  <div className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-blue-50 to-indigo-50 px-4 py-2 shadow-sm">
                    <span className="text-sm text-gray-600">Letters placed:</span>
                    <span className="text-lg font-bold text-brand-teal">
                      {wordCells.filter((cell) => cell !== null).length}/
                      {currentPuzzle.targetWord.length}
                    </span>
                  </div>
                </div>
              </div>

              {/* Target Word Display (Revealed when completed) */}
              {isCompleted && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mb-6 rounded-2xl bg-gradient-to-r from-green-50 to-emerald-100 p-6 text-center shadow-lg"
                >
                  <div className="mb-3 flex items-center justify-center gap-3">
                    <span className="text-3xl">🎉</span>
                    <span className="text-xl font-bold text-green-800">Success! The word is:</span>
                    <span className="text-3xl">🎉</span>
                  </div>
                  <div className="animate-success-pop text-5xl font-bold tracking-widest text-green-900">
                    {currentPuzzle.targetWord}
                  </div>
                  <div className="mt-4 text-lg text-green-700">
                    +{100 * currentPuzzle.targetWord.length} points!
                  </div>
                </motion.div>
              )}

              {/* Action Buttons */}
              <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
                <div className="flex gap-3">
                  <button
                    onClick={previousPuzzle}
                    disabled={currentPuzzleIndex === 0}
                    className={`rounded-full px-5 py-3 font-medium transition-all duration-300 ${
                      currentPuzzleIndex === 0
                        ? "cursor-not-allowed bg-gray-100 text-gray-400"
                        : "bg-gradient-to-r from-blue-100 to-blue-200 text-blue-700 hover:scale-105 hover:shadow-md"
                    }`}
                  >
                    ← Previous
                  </button>
                  <button
                    onClick={nextPuzzle}
                    disabled={currentPuzzleIndex === level2Puzzles.length - 1 || !isCompleted}
                    className={`rounded-full px-5 py-3 font-medium transition-all duration-300 ${
                      currentPuzzleIndex === level2Puzzles.length - 1 || !isCompleted
                        ? "cursor-not-allowed bg-gray-100 text-gray-400"
                        : "bg-gradient-to-r from-green-100 to-green-200 text-green-700 hover:scale-105 hover:shadow-md"
                    }`}
                  >
                    Next Puzzle →
                  </button>
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={checkWord}
                    disabled={wordCells.some((cell) => cell === null) || isCompleted}
                    className={`rounded-full px-8 py-3 font-medium transition-all duration-300 ${
                      wordCells.some((cell) => cell === null) || isCompleted
                        ? "cursor-not-allowed bg-gray-100 text-gray-400"
                        : "bg-gradient-to-r from-brand-teal to-brand-coral text-lg text-white hover:scale-105 hover:shadow-xl"
                    }`}
                  >
                    {isCompleted ? "✓ Complete!" : "Check Word"}
                  </button>
                </div>
              </div>

              {/* Instructions */}
              <div className="mt-8 rounded-xl bg-gradient-to-r from-blue-50 to-indigo-50 p-4">
                <h3 className="mb-3 text-center text-lg font-bold text-brand-tealDark">
                  How to Play:
                </h3>
                <ul className="grid grid-cols-1 gap-3 text-sm text-brand-tealDark/80 sm:grid-cols-2">
                  <li className="flex items-center gap-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-r from-blue-200 to-blue-300">
                      <span className="font-bold">1</span>
                    </div>
                    <span>Drag letters from the top grid</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-r from-green-200 to-green-300">
                      <span className="font-bold">2</span>
                    </div>
                    <span>Drop them into any empty box below</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-r from-yellow-200 to-yellow-300">
                      <span className="font-bold">3</span>
                    </div>
                    <span>Boxes are same size for easy dragging</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-r from-purple-200 to-purple-300">
                      <span className="font-bold">4</span>
                    </div>
                    <span>Click on letters to return them</span>
                  </li>
                </ul>
              </div>

              {/* Game History */}
              {gameHistory.length > 0 && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="mt-8 rounded-xl bg-gradient-to-r from-blue-50 to-indigo-50 p-4"
                >
                  <h3 className="mb-3 text-center text-lg font-bold text-brand-tealDark">
                    Your Progress
                  </h3>
                  <div className="grid grid-cols-5 gap-3">
                    {level2Puzzles.map((puzzle) => {
                      const completed = gameHistory.some((h) => h.puzzleId === puzzle.id);
                      return (
                        <div
                          key={puzzle.id}
                          className={`flex flex-col items-center rounded-xl p-3 transition-all duration-300 ${
                            completed
                              ? "bg-gradient-to-br from-green-100 to-green-200 shadow-lg"
                              : currentPuzzle.id === puzzle.id
                                ? "bg-gradient-to-br from-blue-100 to-blue-200 ring-2 ring-blue-300"
                                : "bg-gradient-to-br from-gray-100 to-gray-200"
                          }`}
                        >
                          <div
                            className={`flex h-10 w-10 items-center justify-center rounded-full text-lg font-bold ${
                              completed
                                ? "bg-green-500 text-white"
                                : currentPuzzle.id === puzzle.id
                                  ? "bg-blue-500 text-white"
                                  : "bg-gray-300 text-gray-600"
                            }`}
                          >
                            {puzzle.id}
                          </div>
                          <div className="mt-2 text-center text-xs font-medium">
                            {completed ? "✓" : currentPuzzle.id === puzzle.id ? "→" : "○"}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </motion.div>
              )}
            </div>
          </div>
        </motion.div>

        {/* Add custom animations */}
        <style jsx global>{`
          @keyframes success-pop {
            0% {
              transform: scale(1);
            }
            50% {
              transform: scale(1.1);
            }
            100% {
              transform: scale(1);
            }
          }

          @keyframes error-shake {
            0%,
            100% {
              transform: translateX(0);
            }
            25% {
              transform: translateX(-8px);
            }
            75% {
              transform: translateX(8px);
            }
          }

          @keyframes drop-bounce {
            0% {
              transform: scale(1);
            }
            50% {
              transform: scale(0.95);
            }
            100% {
              transform: scale(1);
            }
          }

          @keyframes pulse {
            0%,
            100% {
              opacity: 1;
            }
            50% {
              opacity: 0.7;
            }
          }

          .animate-success-pop {
            animation: success-pop 0.5s ease-out forwards;
          }

          .animate-error-shake {
            animation: error-shake 0.5s ease-out forwards;
          }

          .animate-drop-bounce {
            animation: drop-bounce 0.3s ease-out forwards;
          }

          .animate-pulse {
            animation: pulse 0.5s ease-in-out infinite;
          }

          .ring-dashed {
            border-style: dashed;
          }

          /* Improved drag experience */
          .cursor-grab {
            cursor:
              url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='32' height='32' viewport='0 0 32 32' style='fill:black;font-size:24px;'><text y='50%'>👆</text></svg>")
                16 0,
              auto;
          }

          .cursor-grabbing {
            cursor:
              url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='32' height='32' viewport='0 0 32 32' style='fill:black;font-size:24px;'><text y='50%'>👇</text></svg>")
                16 0,
              auto;
          }
        `}</style>
      </section>
    );
  }

  return (
    <main className="bg-brand-grayBg text-brand-tealDark">
      {/* ================= HERO ================= */}

      <section id="anagram-game">
        <AnagramGame />
      </section>
      <section id="anagram-game-lv2">
        <WordFormationGame />
      </section>
    </main>
  );
};

export default page;

"use client";

import { useState, useEffect, useCallback } from "react";
import CloudHeader from "@/components/games/logicoland/CloudHeader";
import KeyRow from "@/components/games/logicoland/KeyRow";
import TaskCard from "@/components/games/logicoland/TaskCard";
import TileTray from "@/components/games/logicoland/TileTray";
import FeedbackToast from "@/components/games/logicoland/FeedbackToast";
import Confetti from "@/components/games/logicoland/Confetti";
import { levels, GameMode, Tile, Slot, Feedback } from "@/components/games/logicoland/types";

export default function LogicolandGame() {
  // Game state
  const [mode, setMode] = useState<GameMode>("encode");
  const [currentLevel, setCurrentLevel] = useState(0);
  const [currentWord, setCurrentWord] = useState("");
  const [promptTiles, setPromptTiles] = useState<Tile[]>([]);
  const [answerSlots, setAnswerSlots] = useState<Slot[]>([]);
  const [trayTiles, setTrayTiles] = useState<Tile[]>([]);
  const [selectedTile, setSelectedTile] = useState<Tile | null>(null);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [round, setRound] = useState(1);
  const [totalRounds, setTotalRounds] = useState(10);
  const [feedback, setFeedback] = useState<Feedback | null>(null);
  const [showConfetti, setShowConfetti] = useState(false);
  const [gameCompleted, setGameCompleted] = useState(false);

  // Initialize a new round
  const initRound = useCallback(() => {
    const level = levels[currentLevel];
    const levelLetters = level.letters;

    // Pick a random word from the level's word list
    const randomWord = level.words[Math.floor(Math.random() * level.words.length)];
    setCurrentWord(randomWord);

    if (mode === "encode") {
      // Encode mode: show letters, need to drag colors
      const letters = randomWord.split("");
      const promptTiles: Tile[] = letters.map((letter, index) => ({
        id: `prompt-${index}`,
        type: "letter",
        content: letter,
        color: level.colorMap[letter],
        position: "prompt",
        draggable: false,
      }));

      const answerSlots: Slot[] = letters.map((letter, index) => ({
        id: `slot-${index}`,
        type: "color",
        content: null,
        expected: level.colorMap[letter],
        position: index,
      }));

      const trayTiles: Tile[] = Array.from(new Set(level.colors)).map((color, index) => ({
        id: `tray-${color}-${index}`,
        type: "color",
        content: color,
        color: color,
        position: "tray",
        draggable: true,
      }));

      setPromptTiles(promptTiles);
      setAnswerSlots(answerSlots);
      setTrayTiles(trayTiles);
    } else {
      // Decode mode: show colors, need to drag letters
      const wordLetters = randomWord.split("");
      const colors = wordLetters.map((letter) => level.colorMap[letter]);

      const promptTiles: Tile[] = colors.map((color, index) => ({
        id: `prompt-${index}`,
        type: "color",
        content: color,
        color: color,
        position: "prompt",
        draggable: false,
      }));

      const answerSlots: Slot[] = colors.map((color, index) => ({
        id: `slot-${index}`,
        type: "letter",
        content: null,
        expected: wordLetters[index],
        position: index,
      }));

      const trayTiles: Tile[] = levelLetters.map((letter, index) => ({
        id: `tray-${letter}-${index}`,
        type: "letter",
        content: letter,
        color: level.colorMap[letter],
        position: "tray",
        draggable: true,
      }));

      setPromptTiles(promptTiles);
      setAnswerSlots(answerSlots);
      setTrayTiles(trayTiles);
    }

    setSelectedTile(null);
    setFeedback(null);
  }, [mode, currentLevel]);

  // Initialize first round
  useEffect(() => {
    initRound();
  }, [initRound]);

  // Handle tile selection
  const handleTileSelect = (tile: Tile) => {
    if (tile.draggable) {
      setSelectedTile(tile);
    }
  };

  // Handle slot click (for placing tiles)
  const handleSlotClick = (slotId: string) => {
    if (!selectedTile) return;

    const slotIndex = parseInt(slotId.split("-")[1]);
    const updatedSlots = [...answerSlots];
    updatedSlots[slotIndex] = {
      ...updatedSlots[slotIndex],
      content: selectedTile.content,
    };
    setAnswerSlots(updatedSlots);
    setSelectedTile(null);
  };

  // Clear current attempt
  const handleClear = () => {
    const clearedSlots = answerSlots.map((slot) => ({
      ...slot,
      content: null,
    }));
    setAnswerSlots(clearedSlots);
    setSelectedTile(null);
  };

  // Check answer
  const handleCheckAnswer = () => {
    const allFilled = answerSlots.every((slot) => slot.content !== null);
    if (!allFilled) {
      setFeedback({
        type: "warning",
        message: "Fill all slots first!",
      });
      return;
    }

    const isCorrect = answerSlots.every((slot) => slot.content === slot.expected);

    if (isCorrect) {
      setScore(score + 1);
      setStreak(streak + 1);
      setFeedback({
        type: "success",
        message: `Great job! +1 point`,
      });
      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 2000);
    } else {
      setStreak(0);
      setFeedback({
        type: "error",
        message: "Try again!",
      });
    }
  };

  // Get hint
  const handleHint = () => {
    const emptySlots = answerSlots.filter((slot) => slot.content === null);
    if (emptySlots.length > 0) {
      const randomSlot = emptySlots[Math.floor(Math.random() * emptySlots.length)];
      const slotIndex = answerSlots.findIndex((slot) => slot.id === randomSlot.id);
      const updatedSlots = [...answerSlots];
      updatedSlots[slotIndex] = {
        ...updatedSlots[slotIndex],
        content: randomSlot.expected,
      };
      setAnswerSlots(updatedSlots);

      setFeedback({
        type: "info",
        message: "Hint applied!",
      });
    }
  };

  // Next round
  const handleNext = () => {
    if (round >= totalRounds) {
      setGameCompleted(true);
      return;
    }

    setRound(round + 1);
    initRound();
  };

  // Restart game
  const handleRestart = () => {
    setScore(0);
    setStreak(0);
    setRound(1);
    setGameCompleted(false);
    setFeedback(null);
    initRound();
  };

  // Change level
  const handleLevelChange = (levelId: number) => {
    setCurrentLevel(levelId);
    setRound(1);
    setScore(0);
    setStreak(0);
    setGameCompleted(false);
    setFeedback(null);
  };

  // Change mode
  const handleModeChange = (newMode: GameMode) => {
    setMode(newMode);
    setRound(1);
    setScore(0);
    setStreak(0);
    setGameCompleted(false);
    setFeedback(null);
  };

  if (gameCompleted) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-sky-100 to-blue-50 p-4 md:p-8">
        <CloudHeader
          mode={mode}
          onModeChange={handleModeChange}
          currentLevel={currentLevel}
          onLevelChange={handleLevelChange}
        />

        <div className="mx-auto mt-8 max-w-4xl">
          <div className="rounded-3xl border-2 border-blue-100 bg-white p-8 shadow-soft">
            <div className="text-center">
              <div className="mx-auto mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-r from-green-400 to-emerald-500">
                <span className="text-4xl font-bold text-white">🎉</span>
              </div>

              <h2 className="mb-4 font-heading text-3xl font-bold text-blue-800 md:text-4xl">
                Mission Complete!
              </h2>

              <div className="mb-8 space-y-6">
                <div className="rounded-2xl bg-gradient-to-r from-blue-50 to-sky-50 p-6">
                  <p className="mb-2 text-2xl font-bold text-blue-700">Your Score</p>
                  <p className="text-5xl font-bold text-blue-800">
                    {score}/{totalRounds}
                  </p>
                </div>

                {streak > 3 && (
                  <div className="rounded-2xl bg-gradient-to-r from-yellow-50 to-amber-50 p-6">
                    <p className="mb-2 text-2xl font-bold text-amber-700">Best Streak</p>
                    <p className="text-5xl font-bold text-amber-800">{streak} in a row! 🔥</p>
                  </div>
                )}

                <div className="rounded-2xl bg-gradient-to-r from-purple-50 to-pink-50 p-6">
                  <p className="mb-2 text-2xl font-bold text-purple-700">Level Completed</p>
                  <p className="text-3xl font-bold text-purple-800">{levels[currentLevel].name}</p>
                </div>
              </div>

              <div className="flex flex-col justify-center gap-4 sm:flex-row">
                <button
                  onClick={handleRestart}
                  className="rounded-full bg-gradient-to-r from-blue-500 to-purple-500 px-8 py-4 text-lg font-bold text-white transition-all duration-300 hover:scale-105 hover:shadow-lg"
                >
                  Play Again
                </button>
                <button
                  onClick={() => {
                    handleLevelChange((currentLevel + 1) % levels.length);
                    setGameCompleted(false);
                  }}
                  className="rounded-full bg-gradient-to-r from-green-500 to-teal-500 px-8 py-4 text-lg font-bold text-white transition-all duration-300 hover:scale-105 hover:shadow-lg"
                >
                  Next Level
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-sky-100 to-blue-50 p-4 md:p-8">
      {showConfetti && <Confetti />}

      <CloudHeader
        mode={mode}
        onModeChange={handleModeChange}
        currentLevel={currentLevel}
        onLevelChange={handleLevelChange}
      />

      <main className="mx-auto max-w-4xl">
        {/* Score and Progress */}
        <div className="mb-6">
          <div className="flex items-center justify-between rounded-2xl bg-white/80 p-4 shadow-soft backdrop-blur-sm">
            <div>
              <p className="text-lg font-bold text-blue-800">
                Score: <span className="text-2xl">{score}</span>
              </p>
              {streak > 0 && (
                <p className="text-sm font-semibold text-green-600">Streak: {streak} 🔥</p>
              )}
            </div>
            <div className="text-center">
              <p className="text-lg font-bold text-blue-800">Round</p>
              <p className="text-2xl font-bold text-purple-700">
                {round}/{totalRounds}
              </p>
            </div>
            <div className="text-right">
              <p className="text-lg font-bold text-blue-800">Mode</p>
              <p className="text-xl font-bold capitalize text-pink-600">{mode}</p>
            </div>
          </div>
        </div>

        {/* Key Row */}
        <div className="mb-8">
          <KeyRow level={levels[currentLevel]} />
        </div>

        {/* Task Card */}
        <div className="mb-8">
          <TaskCard
            mode={mode}
            promptTiles={promptTiles}
            answerSlots={answerSlots}
            selectedTile={selectedTile}
            onSlotClick={handleSlotClick}
          />
        </div>

        {/* Tile Tray */}
        <div className="mb-8">
          <TileTray tiles={trayTiles} selectedTile={selectedTile} onTileSelect={handleTileSelect} />
        </div>

        {/* Action Buttons */}
        <div className="mb-8 rounded-3xl bg-white/80 p-6 shadow-soft backdrop-blur-sm">
          <div className="flex flex-wrap justify-center gap-4">
            <button
              onClick={handleCheckAnswer}
              className="rounded-full bg-gradient-to-r from-green-500 to-emerald-500 px-8 py-4 text-lg font-bold text-white transition-all duration-300 hover:scale-105 hover:shadow-lg"
            >
              Check Answer
            </button>
            <button
              onClick={handleHint}
              className="rounded-full bg-gradient-to-r from-yellow-500 to-amber-500 px-8 py-4 text-lg font-bold text-white transition-all duration-300 hover:scale-105 hover:shadow-lg"
            >
              💡 Hint
            </button>
            <button
              onClick={handleClear}
              className="rounded-full bg-gradient-to-r from-red-500 to-pink-500 px-8 py-4 text-lg font-bold text-white transition-all duration-300 hover:scale-105 hover:shadow-lg"
            >
              Clear
            </button>
            <button
              onClick={handleNext}
              className="rounded-full bg-gradient-to-r from-blue-500 to-purple-500 px-8 py-4 text-lg font-bold text-white transition-all duration-300 hover:scale-105 hover:shadow-lg"
            >
              Next ➔
            </button>
          </div>
        </div>

        {/* Instructions */}
        <div className="rounded-3xl border-2 border-blue-100 bg-gradient-to-r from-blue-50 to-sky-50 p-6 shadow-soft">
          <h3 className="mb-3 flex items-center gap-2 text-xl font-bold text-blue-800">
            <span className="text-2xl">📚</span> How to Play
          </h3>
          <div className="space-y-3 text-blue-700">
            <p className="flex items-center gap-2">
              <span className="text-lg">🔤</span>
              <strong>Encode Mode:</strong> Drag colors to match the letters above
            </p>
            <p className="flex items-center gap-2">
              <span className="text-lg">🎨</span>
              <strong>Decode Mode:</strong> Drag letters to match the colors above
            </p>
            <p className="flex items-center gap-2">
              <span className="text-lg">🔑</span>
              Use the <strong>Key Row</strong> at the top as your guide
            </p>
            <p className="flex items-center gap-2">
              <span className="text-lg">🏆</span>
              Complete {totalRounds} rounds to finish the mission!
            </p>
          </div>
        </div>

        {/* Feedback Toast */}
        {feedback && <FeedbackToast feedback={feedback} onClose={() => setFeedback(null)} />}
      </main>
    </div>
  );
}

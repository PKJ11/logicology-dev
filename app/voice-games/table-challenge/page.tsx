"use client";

import React, { useState } from "react";
import { Difficulty } from "@/app/voice-games/lib/types";
import { TableChallenge } from "@/components/voice-games/TableChallenge";

export default function TableChallengePage() {
  const [difficulty, setDifficulty] = useState<Difficulty>("medium");
  const [gameMode, setGameMode] = useState<"normal" | "speed">("normal");
  const [gameStarted, setGameStarted] = useState(false);

  if (!gameStarted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-100 to-pink-100 p-8">
        <div className="max-w-2xl mx-auto">
          <div className="bg-white rounded-2xl shadow-2xl p-12 text-center">
            <h1 className="text-5xl font-bold mb-4 text-purple-600">Table Challenge</h1>
            <p className="text-xl text-gray-600 mb-8">
              Solve multiplication problems by speaking the answer! 🎤✖️📊
            </p>

            <div className="mb-8">
              <h2 className="text-2xl font-bold mb-4">Select Difficulty</h2>
              <div className="flex gap-4 justify-center">
                {(["easy", "medium", "hard"] as Difficulty[]).map((level) => (
                  <button
                    key={level}
                    onClick={() => setDifficulty(level)}
                    className={`px-8 py-3 rounded-lg font-semibold text-lg transition-all ${
                      difficulty === level
                        ? "bg-purple-600 text-white scale-105"
                        : "bg-gray-200 text-gray-800 hover:bg-gray-300"
                    }`}
                  >
                    {level.charAt(0).toUpperCase() + level.slice(1)}
                  </button>
                ))}
              </div>
              <p className="text-gray-600 mt-3 text-sm">
                {difficulty === "easy" && "Tables 1–5 × 1–5"}
                {difficulty === "medium" && "Tables 1–10 × 1–10"}
                {difficulty === "hard" && "Tables 1–20 × 1–20"}
              </p>
            </div>

            <div className="mb-10">
              <h2 className="text-2xl font-bold mb-4">Select Mode</h2>
              <div className="flex gap-4 justify-center">
                {(["normal", "speed"] as const).map((mode) => (
                  <button
                    key={mode}
                    onClick={() => setGameMode(mode)}
                    className={`px-8 py-3 rounded-lg font-semibold text-lg transition-all ${
                      gameMode === mode
                        ? "bg-purple-600 text-white scale-105"
                        : "bg-gray-200 text-gray-800 hover:bg-gray-300"
                    }`}
                  >
                    {mode === "normal" ? "🎮 Normal" : "⚡ Speed"}
                  </button>
                ))}
              </div>
              <p className="text-gray-600 mt-3 text-sm">
                {gameMode === "normal"
                  ? "15 seconds to answer each question"
                  : "10 seconds per question"}
              </p>
            </div>

            <button
              onClick={() => setGameStarted(true)}
              className="bg-purple-600 hover:bg-purple-700 text-white text-xl py-4 px-12 rounded-lg font-bold transition-all transform hover:scale-105"
            >
              Start Game! 🚀
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-100 to-pink-100 p-8">
      <div className="max-w-4xl mx-auto">
        <button
          onClick={() => setGameStarted(false)}
          className="mb-6 text-purple-600 hover:text-purple-800 font-semibold underline text-lg"
        >
          ← Back to Settings
        </button>
        <TableChallenge difficulty={difficulty} gameMode={gameMode} maxTable={20} />
      </div>
    </div>
  );
}
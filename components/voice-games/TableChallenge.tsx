"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";
import { TableChallengeProps, GameStats } from "@/app/voice-games/lib/types";
import { generateTableQuestion, calculateScore, getStreakMessage } from "@/app/voice-games/lib/gameLogic";
import { useVoiceGame } from "@/app/voice-games/lib/useVoiceGame";
import { VoiceMicButton } from "@/components/voice-games/VoiceMicButton";

export const TableChallenge: React.FC<TableChallengeProps> = ({
  difficulty,
  gameMode,
  maxTable,
}) => {
  const [question, setQuestion] = useState(() =>
    generateTableQuestion(difficulty, maxTable)
  );
  const [stats, setStats] = useState<GameStats>({
    score: 0, streak: 0, totalAttempts: 0,
    correctAnswers: 0, wrongAnswers: 0, timeSpent: 0,
  });
  const [lastResult, setLastResult] = useState<"correct" | "wrong" | null>(null);
  const [showAnswer, setShowAnswer] = useState<number | null>(null);
  const questionStartRef = useRef(Date.now());

  const nextQuestion = useCallback(() => {
    setQuestion(generateTableQuestion(difficulty, maxTable));
    setLastResult(null);
    setShowAnswer(null);
    questionStartRef.current = Date.now();
  }, [difficulty, maxTable]);

  const { phase, transcript, secondsLeft, isSupported, askQuestion, abort } =
    useVoiceGame({
      listenWindowSeconds: gameMode === "speed" ? 10 : 15,
      resultDisplayMs: 2000,
      onCorrect: (ans) => {
        const timeSpent = Date.now() - questionStartRef.current;
        const pts = calculateScore(difficulty, timeSpent, gameMode === "speed");
        setLastResult("correct");
        setStats((s) => ({
          ...s,
          score: s.score + pts,
          streak: s.streak + 1,
          totalAttempts: s.totalAttempts + 1,
          correctAnswers: s.correctAnswers + 1,
          timeSpent: s.timeSpent + timeSpent,
        }));
      },
      onWrong: (_, correct) => {
        setLastResult("wrong");
        setShowAnswer(correct);
        setStats((s) => ({
          ...s,
          streak: 0,
          totalAttempts: s.totalAttempts + 1,
          wrongAnswers: s.wrongAnswers + 1,
        }));
      },
    });

  // Advance once result phase ends
  const prevPhase = useRef(phase);
  useEffect(() => {
    if (prevPhase.current === "result" && phase === "idle") {
      nextQuestion();
    }
    prevPhase.current = phase;
  }, [phase, nextQuestion]);

  // Ask whenever question changes and we're idle
  useEffect(() => {
    if (phase === "idle") {
      askQuestion(
        `What is ${question.question}?`,
        question.correctAnswer
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [question]);

  useEffect(() => () => abort(), [abort]);

  if (!isSupported) {
    return (
      <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
        <p className="text-red-500 text-xl">
          ⚠️ Speech recognition is not supported in this browser. Try Chrome or Edge.
        </p>
      </div>
    );
  }

  const accuracy =
    stats.totalAttempts > 0
      ? Math.round((stats.correctAnswers / stats.totalAttempts) * 100)
      : 0;

  return (
    <div className="space-y-6">
      {/* Stats bar */}
      <div className="bg-white rounded-2xl shadow-md p-4 flex justify-around text-center">
        <div><p className="text-2xl font-bold text-purple-600">{stats.score}</p><p className="text-xs text-gray-500 uppercase tracking-wide">Score</p></div>
        <div><p className="text-2xl font-bold text-orange-500">{stats.streak}🔥</p><p className="text-xs text-gray-500 uppercase tracking-wide">Streak</p></div>
        <div><p className="text-2xl font-bold text-green-600">{accuracy}%</p><p className="text-xs text-gray-500 uppercase tracking-wide">Accuracy</p></div>
        <div><p className="text-2xl font-bold text-gray-700">{stats.totalAttempts}</p><p className="text-xs text-gray-500 uppercase tracking-wide">Questions</p></div>
      </div>

      {/* Main card */}
      <div className="bg-white rounded-2xl shadow-xl p-8 text-center space-y-8">
        <p className="text-sm font-semibold text-gray-400 uppercase tracking-widest">
          {getStreakMessage(stats.streak)}
        </p>

        {/* Question */}
        <div className="bg-purple-50 rounded-xl p-6">
          <p className="text-lg text-gray-500 mb-2">What is</p>
          <p className="text-6xl font-black text-purple-700 tracking-tight">
            {question.question}
          </p>
        </div>

        {/* Mic — driven by phase only, no flicker */}
        <VoiceMicButton
          phase={phase}
          secondsLeft={secondsLeft}
          listenWindowSeconds={gameMode === "speed" ? 10 : 15}
          color="purple"
        />

        {/* Transcript */}
        {transcript && (
          <p className="text-gray-500 text-sm">
            You said: <span className="font-semibold text-gray-800">"{transcript}"</span>
          </p>
        )}

        {/* Result banner */}
        {phase === "result" && lastResult && (
          <div
            className={`rounded-xl p-4 text-lg font-bold ${
              lastResult === "correct"
                ? "bg-green-100 text-green-700"
                : "bg-red-100 text-red-700"
            }`}
          >
            {lastResult === "correct" ? (
              <>✅ Correct! +{calculateScore(difficulty, 0, gameMode === "speed")} pts</>
            ) : (
              <>❌ Wrong! Answer was <span className="underline">{showAnswer}</span></>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
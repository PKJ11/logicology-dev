import { Difficulty, GameQuestion } from "./types";

export const generateDigitSumQuestion = (difficulty: Difficulty): GameQuestion => {
  let min = 1, max = 10, count = 2;

  if (difficulty === "medium") { min = 1; max = 100; count = 2; }
  else if (difficulty === "hard") { min = 1; max = 100; count = 3; }

  const numbers: number[] = [];
  for (let i = 0; i < count; i++) {
    numbers.push(Math.floor(Math.random() * (max - min + 1)) + min);
  }

  return {
    question: numbers.join(" + "),
    correctAnswer: numbers.reduce((a, b) => a + b, 0),
    difficulty,
  };
};

export const generateTableQuestion = (
  difficulty: Difficulty,
  maxTable = 20
): GameQuestion => {
  let table: number, multiplier: number;

  if (difficulty === "easy") {
    table = Math.floor(Math.random() * 5) + 1;
    multiplier = Math.floor(Math.random() * 5) + 1;
  } else if (difficulty === "medium") {
    table = Math.floor(Math.random() * 10) + 1;
    multiplier = Math.floor(Math.random() * 10) + 1;
  } else {
    table = Math.floor(Math.random() * maxTable) + 1;
    multiplier = Math.floor(Math.random() * maxTable) + 1;
  }

  return {
    question: `${table} × ${multiplier}`,
    correctAnswer: table * multiplier,
    difficulty,
  };
};

export const validateAnswer = (
  userAnswer: number | null,
  correctAnswer: number,
  tolerance = 0
): boolean => {
  if (userAnswer === null) return false;
  return Math.abs(userAnswer - correctAnswer) <= tolerance;
};

export const calculateScore = (
  difficulty: Difficulty,
  timeSpent: number,
  speedMode: boolean
): number => {
  let base = difficulty === "hard" ? 20 : difficulty === "medium" ? 15 : 10;
  if (speedMode) base += Math.max(0, 10 - Math.floor(timeSpent / 1000));
  return Math.max(1, base);
};

export const getStreakMessage = (streak: number): string => {
  if (streak === 0) return "Let's get started! 🚀";
  if (streak === 1) return "Nice! Keep it up! 🔥";
  if (streak === 3) return "Great! 3 in a row! 🎯";
  if (streak === 5) return "Awesome! On fire! 🔥🔥";
  if (streak === 10) return "Incredible! 10 streak! 🏆";
  if (streak > 10) return `Amazing! ${streak} streak! 🌟`;
  return "Good job! Keep going! 💪";
};

export const getDifficultyLabel = (difficulty: Difficulty): string =>
  difficulty.charAt(0).toUpperCase() + difficulty.slice(1);
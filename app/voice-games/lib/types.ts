export type Difficulty = "easy" | "medium" | "hard";
export type GameMode = "normal" | "speed";
export type GamePhase = "idle" | "speaking" | "listening" | "result";

export interface GameStats {
  score: number;
  streak: number;
  totalAttempts: number;
  correctAnswers: number;
  wrongAnswers: number;
  timeSpent: number;
}

export interface VoiceGameState {
  isListening: boolean;
  transcript: string;
  isProcessing: boolean;
  feedback: string;
  feedbackType: "correct" | "incorrect" | "info" | null;
}

export interface DigitSumGameProps {
  difficulty: Difficulty;
  gameMode: GameMode;
}

export interface TableChallengeProps {
  difficulty: Difficulty;
  gameMode: GameMode;
  maxTable: number;
}

export interface GameQuestion {
  question: string;
  correctAnswer: number;
  difficulty: Difficulty;
}
// Personal bests for Speed Maths, kept on the player's device (no login).
// Storage can be unavailable (private windows, blocked site data), so every read and
// write is wrapped and the game works the same without it.

export type BestKind =
  | "race" // 10-question race: fastest time wins
  | "limit" // time limit per question: highest score wins
  | "practice" // no clock: best accuracy wins
  | "exam"; // exam mode: highest marks win

export interface PersonalBest {
  bestScore: number | null; // points, or marks in exam mode
  bestTimeS: number | null; // only from rounds where the time counts
  bestAccuracy: number | null; // 0–1
  bestStreak: number;
  plays: number;
}

export interface RoundSummary {
  score: number;
  timeS: number;
  accuracy: number;
  streak: number;
  /** A race time only counts as a best with enough right answers. */
  timeCounts: boolean;
}

/** A race time counts as a best only with at least this share right (8 of 10). */
export const RACE_ACCURACY_FOR_BEST = 0.8;

const PREFIX = "logicology:speed-maths:best:v1:";

export function readBest(key: string): PersonalBest | null {
  try {
    const raw = window.localStorage.getItem(PREFIX + key);
    if (!raw) return null;
    const v = JSON.parse(raw);
    if (!v || typeof v !== "object") return null;
    return {
      bestScore: typeof v.bestScore === "number" ? v.bestScore : null,
      bestTimeS: typeof v.bestTimeS === "number" ? v.bestTimeS : null,
      bestAccuracy: typeof v.bestAccuracy === "number" ? v.bestAccuracy : null,
      bestStreak: typeof v.bestStreak === "number" ? v.bestStreak : 0,
      plays: typeof v.plays === "number" ? v.plays : 0,
    };
  } catch {
    return null;
  }
}

export function mergeBest(prev: PersonalBest | null, round: RoundSummary): PersonalBest {
  const max = (a: number | null | undefined, b: number) => (a == null ? b : Math.max(a, b));
  return {
    bestScore: max(prev?.bestScore, round.score),
    bestTimeS: round.timeCounts
      ? prev?.bestTimeS == null
        ? round.timeS
        : Math.min(prev.bestTimeS, round.timeS)
      : prev?.bestTimeS ?? null,
    bestAccuracy: max(prev?.bestAccuracy, round.accuracy),
    bestStreak: Math.max(prev?.bestStreak ?? 0, round.streak),
    plays: (prev?.plays ?? 0) + 1,
  };
}

/** Saves the round and returns the best as it was before this round. */
export function saveRound(key: string, round: RoundSummary): PersonalBest | null {
  const prev = readBest(key);
  try {
    window.localStorage.setItem(PREFIX + key, JSON.stringify(mergeBest(prev, round)));
  } catch {
    // Storage unavailable: the round still shows its own results.
  }
  return prev;
}

const plural = (n: number, word: string) => `${n} ${word}${n === 1 ? "" : "s"}`;
const fmtMarks = (m: number) => (Number.isInteger(m) ? String(m) : m.toFixed(2).replace(/0$/, ""));

/** One line for the results screen comparing this round with the previous best. */
export function personalBestNote(
  kind: BestKind,
  prev: PersonalBest | null,
  round: RoundSummary
): string {
  switch (kind) {
    case "race": {
      if (!round.timeCounts) {
        return prev?.bestTimeS != null
          ? `Get 8 or more right for your time to count. Your best is ${Math.round(prev.bestTimeS)} seconds.`
          : "Get 8 or more right for your time to count as a best.";
      }
      if (prev?.bestTimeS == null) return "Your first counted time. That's the best to beat.";
      const diff = Math.round(prev.bestTimeS - round.timeS);
      if (diff >= 1) return `${plural(diff, "second")} faster than your best.`;
      if (diff === 0) return "Level with your best time.";
      return `${plural(-diff, "second")} off your best of ${Math.round(prev.bestTimeS)} seconds.`;
    }
    case "limit": {
      if (prev?.bestScore == null) return "Your first score. That's the best to beat.";
      if (round.score > prev.bestScore) return `New best score! You beat ${prev.bestScore}.`;
      if (round.score === prev.bestScore) return "Level with your best score.";
      return `Your best score is ${prev.bestScore}.`;
    }
    case "practice": {
      const pct = (a: number) => `${Math.round(a * 100)}%`;
      if (prev?.bestAccuracy == null) return "Your first practice round. Keep going!";
      if (round.accuracy > prev.bestAccuracy) return `New best accuracy: ${pct(round.accuracy)}.`;
      if (round.streak > prev.bestStreak) return `New longest streak: ${round.streak} in a row.`;
      return `Your best accuracy is ${pct(prev.bestAccuracy)}.`;
    }
    case "exam": {
      if (prev?.bestScore == null) return "Your first paper at this length. That's the best to beat.";
      const diff = round.score - prev.bestScore;
      if (diff > 0) return `${fmtMarks(diff)} marks more than your best.`;
      if (diff === 0) return "Level with your best marks.";
      return `Your best is ${fmtMarks(prev.bestScore)} marks.`;
    }
  }
}

/** Short line for setup screens, or null when there is no best yet. */
export function bestSummary(kind: BestKind, best: PersonalBest | null): string | null {
  if (!best || best.plays === 0) return null;
  const parts: string[] = [];
  if (kind === "race" && best.bestTimeS != null) parts.push(`${Math.round(best.bestTimeS)}s`);
  if ((kind === "limit" || kind === "exam") && best.bestScore != null)
    parts.push(kind === "exam" ? `${fmtMarks(best.bestScore)} marks` : `${best.bestScore} points`);
  if (best.bestAccuracy != null) parts.push(`${Math.round(best.bestAccuracy * 100)}% right`);
  if (best.bestStreak > 0) parts.push(`streak ${best.bestStreak}`);
  return parts.length ? `Your best: ${parts.join(" · ")}` : null;
}

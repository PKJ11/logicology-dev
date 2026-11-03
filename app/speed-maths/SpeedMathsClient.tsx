"use client";

import NavBar from "@/components/NavBar";
import { useState, useEffect, useCallback, useRef } from "react";
import { useHideFeedbackTab } from "@/lib/feedbackVisibility";
import {
  type BestKind,
  RACE_ACCURACY_FOR_BEST,
  bestSummary,
  personalBestNote,
  readBest,
  saveRound,
} from "@/lib/speedMathsBests";
import {
  type Challenge,
  type Question,
  generateMultiplicationRangeQuestion,
  generateQuestion,
  rand,
  shuffle,
} from "@/lib/speedMathsQuestions";

type AnswerMode = "Choose Option" | "Type Answer";
type TimeMode = "practice" | "timed" | "fixed-questions";
type GameState =
  | "splash"
  | "menu"
  | "mode-select"
  | "settings"
  | "playing"
  | "result"
  | "half-table"
  | "half-3step"
  | "square-step"
  | "friends-practice"
  | "mult-table-select"
  | "mult-table"
  | "exam-setup";

const PLAY_STATES = new Set<GameState>([
  "playing",
  "half-table",
  "half-3step",
  "square-step",
  "friends-practice",
  "mult-table",
]);

// Questions per round: Per Question mode used to run forever.
const ROUND_SIZE: Record<TimeMode, number> = { practice: 10, timed: 20, "fixed-questions": 10 };
// Time-limit presets (replace the old 2–30 s slider, which was hard to use by touch).
const TIME_PRESETS = [
  { label: "Relaxed", seconds: 15 },
  { label: "Fast", seconds: 10 },
  { label: "Extreme", seconds: 5 },
] as const;
// ── Exam Mode: mixed questions from every skill against one countdown ──
const EXAM_SKILLS: Challenge[] = ["Addition", "Subtraction", "Multiplication", "Half", "Squares", "Friends"];
const EXAM_MINUTES = [2, 5, 10] as const;
const NEGATIVE_MARK = 0.25; // marks lost per wrong answer when negative marking is on
const EXAM_COLORS = { bg: "#0A8A80", light: "#e8f9f8", dark: "#0B3F44" };
const examBestKey = (minutes: number, negative: boolean) =>
  `exam:${minutes}m:${negative ? "negative" : "plain"}`;
const BEST_KIND: Record<TimeMode, BestKind> = {
  practice: "practice",
  timed: "limit",
  "fixed-questions": "race",
};
const fmtMarks = (m: number) => String(Math.round(m * 100) / 100);
const fmtClock = (s: number) => `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`;

const ANSWER_LABEL: Record<AnswerMode, string> = {
  "Choose Option": "Tap the answer",
  "Type Answer": "Type the answer",
};
// Pause after a right answer before the next question (the clock is stopped meanwhile).
const CORRECT_PAUSE_MS = 700;
// In 10 Questions mode, an answer this fast or slower earns no speed bonus.
const SPEED_REFERENCE_S = 10;

function tableHalf(d: number): number {
  return Math.floor(d / 2);
}

function generateHalfPracticeNum() {
  return rand(100, 999);
}

function computeHalfSteps(n: number) {
  const digits = String(n).split("").map(Number);
  const step1 = digits.map((d) => tableHalf(d));
  const oddPositions = digits.map((d) => d % 2 !== 0);
  const step3 = [...step1];
  let carry = 0;
  for (let i = step3.length - 1; i >= 0; i--) {
    let val = step3[i] + carry;
    carry = 0;
    if (oddPositions[i]) val += 5;
    if (val >= 10) {
      carry = 1;
      val -= 10;
    }
    step3[i] = val;
  }
  const finalDigits = carry > 0 ? [carry, ...step3] : step3;
  return { digits, step1, oddPositions, step3: finalDigits, answer: n / 2 };
}

const BRAND_TEAL = "#0A8A80";
const BRAND_TEAL_DK = "#0B3F44";
const RACING = "'Racing Sans One', cursive";
const OUTFIT = "'Outfit', sans-serif";

const CHALLENGE_COLORS: Record<Challenge, { bg: string; light: string; dark: string }> = {
  Addition: { bg: "#26a9e0", light: "#eff9fd", dark: "#0e6a94" },
  Subtraction: { bg: "#d93b60", light: "#fcf1f4", dark: "#8a1535" },
  Multiplication: { bg: "#84c341", light: "#f6fbf1", dark: "#3d6b10" },
  Squares: { bg: "#c74498", light: "#fbf2f8", dark: "#7a1a5e" },
  Half: { bg: "#7784c1", light: "#ecedf6", dark: "#2e3875" },
  Friends: { bg: "#F5A623", light: "#FFF8EC", dark: "#7A4F00" },
};

const CHALLENGE_IMAGES: Record<Challenge, string> = {
  Addition: "/Images/speed-maths/SPEED MATHS WEBPAGE IMAGES/PNG RESOURCES/ADDITION@2x.png",
  Subtraction: "/Images/speed-maths/SPEED MATHS WEBPAGE IMAGES/PNG RESOURCES/SUBTRACTION@2x.png",
  Multiplication:
    "/Images/speed-maths/SPEED MATHS WEBPAGE IMAGES/PNG RESOURCES/MULTIPLICATION@2x.png",
  Half: "/Images/speed-maths/SPEED MATHS WEBPAGE IMAGES/PNG RESOURCES/FRACTION@2x.png",
  Squares: "/Images/speed-maths/SPEED MATHS WEBPAGE IMAGES/PNG RESOURCES/DIVISION@2x.png",
  Friends: "/Images/speed-maths/SPEED MATHS WEBPAGE IMAGES/PNG RESOURCES/ADDITION@2x.png",
};

const ROCKET_IMG = "/Images/speed-maths/SPEED MATHS WEBPAGE IMAGES/PNG RESOURCES/ROCKET@2x.png";
const CLOUDS_IMG = "/Images/speed-maths/SPEED MATHS WEBPAGE IMAGES/PNG RESOURCES/CLOUDS.png";
const CLOUDS_MOBILE_IMG =
  "/Images/speed-maths/SPEED MATHS WEBPAGE IMAGES/PNG RESOURCES/cloud_mobile.png";
const CORRECT_IMG = "https://ik.imagekit.io/pratik11/corrreect.png";
const WRONG_IMG = "https://ik.imagekit.io/pratik11/ohno.png";

const GLOBAL_STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Racing+Sans+One&family=Outfit:wght@400;600;700;900&display=swap');
  @keyframes rocketBob { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-10px)} }
  @keyframes fadeUp { from{opacity:0;transform:translateY(20px)} to{opacity:1;transform:translateY(0)} }
  @keyframes rocketFlyUp {
    0%{opacity:0;transform:translateY(100vh) scale(0.6);}
    40%{opacity:1;transform:translateY(35vh) scale(1.1);}
    100%{opacity:1;transform:translateY(0) scale(1);}
  }
  @keyframes rocketHover { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-8px)} }
  .sm-menu-cols { display: flex; }
  .sm-menu-grid { display: none; }
  @media (orientation: landscape) {
    .sm-menu-cols { display: none !important; }
    .sm-menu-grid { display: grid; }
  }

  /* Touch targets: 44px minimum at every width (the site rule stops at 768px) */
  .sm-tap { min-height: 44px; min-width: 44px; }

  /* ── Timed play: fit question and answers on one screen ── */
  .sm-play { min-height: 100vh; min-height: 100dvh !important; }
  /* Phones and short screens: compact question card and keypad */
  @media (max-width: 640px), (max-height: 760px) {
    .sm-play { padding: 12px 12px 14px !important; }
    .sm-play-head { margin-bottom: 6px !important; }
    .sm-play-timer { margin-bottom: 8px !important; height: 8px !important; }
    .sm-play .sm-scorebar { margin-bottom: 8px; gap: 8px; flex-wrap: nowrap; }
    .sm-play .sm-scorebar > div { padding: 2px 10px; gap: 4px; }
    .sm-play .sm-score-emoji { font-size: 1rem; line-height: 1.5rem; }
    .sm-play .sm-score-label { font-size: 0.85rem; }
    .sm-play-card { padding: 12px !important; margin-bottom: 10px !important; border-radius: 1.25rem !important; }
    .sm-play-card .sm-q-label { margin-bottom: 0 !important; font-size: 0.85rem !important; }
    .sm-play-card .sm-q { font-size: clamp(2.1rem, 10vw, 3rem) !important; }
    .sm-play-card .sm-q.sm-q-wrong { font-size: clamp(1.5rem, 7vw, 2.2rem) !important; }
    .sm-play-card .sm-feedback { margin-top: 4px !important; }
    .sm-play-card .sm-worked { font-size: clamp(1.5rem, 6.5vw, 2rem) !important; }
    .sm-play .sm-opt { padding-top: 10px !important; padding-bottom: 10px !important; font-size: 1.5rem !important; }
    .sm-play .sm-numpad-display { min-height: 44px; margin-bottom: 8px; padding-top: 0; padding-bottom: 0; font-size: 1.5rem !important; }
    .sm-play .sm-keys { gap: 6px; }
    .sm-play .sm-key { padding-top: 6px; padding-bottom: 6px; }
    .sm-play .sm-enter { margin-top: 8px; padding-top: 8px; padding-bottom: 8px; }
    .sm-play .sm-next { margin-top: 10px !important; padding-top: 12px !important; padding-bottom: 12px !important; }
  }
  /* Portrait phones: answers sit at the bottom of the screen, under the thumb */
  @media (max-width: 640px) and (orientation: portrait) {
    .sm-play-answers { margin-top: auto; }
  }
  /* Landscape phones: question on the left, answers on the right */
  @media (orientation: landscape) and (max-height: 500px) {
    .sm-play {
      display: grid !important;
      grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
      column-gap: 20px;
      align-content: center;
      align-items: center;
      justify-items: center;
    }
    .sm-play-main, .sm-play-answers { max-width: 26rem !important; margin-top: 0; }
  }
`;

// ─── MenuChallengeCard ────────────────────────────────────────────────────────
function MenuChallengeCard({
  ch,
  index,
  visible,
  onClick,
  compact = false,
}: {
  ch: Challenge;
  index: number;
  visible: boolean;
  onClick: () => void;
  compact?: boolean;
}) {
  const { bg, light } = CHALLENGE_COLORS[ch];
  const [hov, setHov] = useState(false);
  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      className="w-full focus:outline-none"
      style={{
        ...(compact ? { maxWidth: 136, width: "100%", margin: "0 auto" } : {}),
        opacity: visible ? 1 : 0,
        transform: visible
          ? hov
            ? "translateY(-8px) scale(1.04)"
            : "translateY(0) scale(1)"
          : "translateY(60px) scale(0.9)",
        transition: `opacity 0.55s cubic-bezier(.22,1,.36,1) ${index * 0.1 + 0.3}s,
                   transform ${hov ? "0.22s" : "0.55s"} cubic-bezier(.22,1,.36,1) ${hov ? "0s" : index * 0.1 + 0.3 + "s"},
                   box-shadow 0.22s ease`,
        boxShadow: hov ? `0 22px 44px ${bg}55` : "0 4px 20px rgba(0,0,0,0.13)",
        borderRadius: 20,
      }}
    >
      <div
        className="flex flex-col overflow-hidden rounded-2xl"
        style={{ background: light, border: `3px solid ${bg}` }}
      >
        <div
          className="flex w-full items-center justify-center overflow-hidden"
          style={{
            background: light,
            minHeight: compact ? 120 : 200,
            padding: compact ? "8px 4px 0" : "16px 8px 0",
          }}
        >
          <img
            src={CHALLENGE_IMAGES[ch]}
            alt={ch}
            style={{
              width: "100%",
              height: compact ? 115 : 190,
              objectFit: "contain",
              objectPosition: "bottom center",
              display: "block",
              transform: hov ? "scale(1.06)" : "scale(1)",
              transition: "transform 0.3s ease",
            }}
          />
        </div>
        <div style={{ padding: compact ? "6px 6px 8px" : "12px 12px 14px" }}>
          <div
            className="w-full rounded-2xl text-center text-white shadow"
            style={{
              background: bg,
              fontFamily: RACING,
              fontSize: compact ? "0.85rem" : "1.2rem",
              // "Multiplication" needs a little less spacing to fit the six-across row.
              letterSpacing: !compact && ch.length > 12 ? "0.005em" : "0.04em",
              padding: compact ? "8px 4px" : "16px 4px",
              transform: hov ? "scale(1.02)" : "scale(1)",
              transition: "transform 0.2s",
            }}
          >
            {ch}
          </div>
        </div>
      </div>
    </button>
  );
}

function Stars({ count = 6 }: { count?: number }) {
  return (
    <div className="pointer-events-none fixed inset-0 overflow-hidden">
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className="absolute rounded-full"
          style={{
            width: `${rand(4, 10)}px`,
            height: `${rand(4, 10)}px`,
            background: [BRAND_TEAL, "#E45C48", "#D8AE4F", "#2EC4B6", "#6ABF4B"][i % 5],
            top: `${rand(5, 90)}%`,
            left: `${rand(5, 90)}%`,
            opacity: 0.4,
          }}
        />
      ))}
    </div>
  );
}

// Brings a step that has just appeared into view (it used to open below the screen).
function revealStep(el: HTMLElement | null, block: ScrollLogicalPosition = "center") {
  if (!el) return;
  const reduce =
    typeof window !== "undefined" &&
    window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
  // Called from an effect, so the new step is already laid out.
  el.scrollIntoView({ behavior: reduce ? "auto" : "smooth", block });
}

// ─── Instruction copy ────────────────────────────────────────────────────────
// Every game opens with one line, one worked example and a "Show me how" panel.
const GAME_GUIDE: Record<Challenge, { line: string; example: string; how: string[] }> = {
  Addition: {
    line: "Add the tens, then the units.",
    example: "34 + 27: 30 + 20 = 50, 4 + 7 = 11, so 61.",
    how: [
      "Split both numbers into tens and units.",
      "Add the tens first: 30 + 20 = 50.",
      "Add the units: 4 + 7 = 11.",
      "Put them together: 50 + 11 = 61.",
    ],
  },
  Subtraction: {
    line: "Take away the tens, then the units.",
    example: "62 − 27: 62 − 20 = 42, then 42 − 7 = 35.",
    how: [
      "Take away the tens first: 62 − 20 = 42.",
      "Then take away the units: 42 − 7 = 35.",
      "Near a round number? Take away the round number and add back: 62 − 29 = 62 − 30 + 1 = 33.",
    ],
  },
  Multiplication: {
    line: "Know the 2 to 12 times tables by heart.",
    example: "7 × 8 = 56.",
    how: [
      "Stuck on a fact? Build it from one you know.",
      "7 × 8 is 7 × 4 doubled: 28 + 28 = 56.",
      "9 × 6 is 10 × 6 take away 6: 60 − 6 = 54.",
    ],
  },
  Half: {
    line: "Halve each digit, then fix the odd ones.",
    example: "347 gives 173.5.",
    how: [
      "Halve each digit and drop the remainder.",
      "If the digit before it is odd, add 5.",
      "If the last digit is odd, end with .5.",
      "Example: 347 gives 173.5",
    ],
  },
  Squares: {
    line: "Square numbers near 50 and 100 without long multiplication.",
    example: "47 is 3 below 50. 25 − 3 = 22. 3² = 09. Answer: 2209",
    how: [
      "Near 50: 47 is 3 below 50. 25 − 3 = 22. 3² = 09. Answer: 2209",
      "Near 100: 97 is 3 below 100. 97 − 3 = 94. 3² = 09. Answer: 9409",
      "If the last part has three digits, keep the last two and add the first to the front part. 38 is 12 below 50. 25 − 12 = 13. 12² = 144. Keep 44, 13 + 1 = 14. Answer: 1444",
    ],
  },
  Friends: {
    line: "Friends add up to 9, 10 or 100.",
    example: "37 and 63 make 100.",
    how: [
      "Friends add up to 9, 10 or 100.",
      "For 100, tens add to 9 and units add to 10: 37 and 63.",
      "If the number ends in 0, tens add to 10: 60 and 40.",
    ],
  },
};

function MethodSteps({ challenge, dark }: { challenge: Challenge; dark: string }) {
  return (
    <ol
      className="mt-3 list-decimal space-y-1.5 pl-5 text-left"
      style={{ color: dark, fontFamily: OUTFIT, fontWeight: 600, fontSize: "0.95rem" }}
    >
      {GAME_GUIDE[challenge].how.map((step) => (
        <li key={step}>{step}</li>
      ))}
    </ol>
  );
}

function GameIntro({
  challenge,
  bg,
  light,
  dark,
}: {
  challenge: Challenge;
  bg: string;
  light: string;
  dark: string;
}) {
  const [open, setOpen] = useState(false);
  const g = GAME_GUIDE[challenge];
  return (
    <div
      className="mb-6 w-full max-w-sm rounded-3xl border-2 bg-white p-5 text-center shadow"
      style={{ borderColor: `${bg}55` }}
    >
      <p style={{ color: dark, fontFamily: OUTFIT, fontWeight: 700, fontSize: "1.05rem" }}>
        {g.line}
      </p>
      <p className="mt-1" style={{ color: bg, fontFamily: OUTFIT, fontWeight: 600 }}>
        Example: {g.example}
      </p>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        className="mt-3 rounded-full px-4 py-2 text-sm active:scale-95"
        style={{
          background: light,
          color: bg,
          border: `2px solid ${bg}`,
          fontFamily: OUTFIT,
          fontWeight: 700,
        }}
      >
        {open ? "Hide" : "Show me how"}
      </button>
      {open && <MethodSteps challenge={challenge} dark={dark} />}
    </div>
  );
}

function ModeButton({
  word,
  sub,
  onClick,
  primary = false,
  bg,
  light,
}: {
  word: string;
  sub?: string;
  onClick: () => void;
  primary?: boolean;
  bg: string;
  light: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="rounded-3xl px-4 py-3 shadow-lg active:scale-95"
      style={{
        background: primary ? bg : light,
        border: `3px solid ${bg}`,
        color: primary ? "#fff" : bg,
      }}
    >
      <span className="block text-xl" style={{ fontFamily: RACING }}>
        {word}
      </span>
      {sub && (
        <span
          className="block text-sm"
          style={{ fontFamily: OUTFIT, fontWeight: 600, opacity: 0.85 }}
        >
          {sub}
        </span>
      )}
    </button>
  );
}

function ExamModeButton({
  onClick,
  visible,
  compact = false,
}: {
  onClick: () => void;
  visible: boolean;
  compact?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="mx-auto flex w-full items-center justify-center gap-3 rounded-3xl bg-white px-5 py-3 text-left shadow-lg transition hover:scale-[1.02] active:scale-95"
      style={{
        border: `3px solid ${BRAND_TEAL}`,
        maxWidth: compact ? 340 : 560,
        opacity: visible ? 1 : 0,
        transition: "opacity 0.55s ease 0.9s, transform 0.2s",
      }}
    >
      <span className={compact ? "text-2xl" : "text-3xl"} aria-hidden>
        🎓
      </span>
      <span>
        <span
          className="block"
          style={{ fontFamily: RACING, color: BRAND_TEAL_DK, fontSize: compact ? "1.15rem" : "1.4rem" }}
        >
          Exam Mode
        </span>
        <span className="block text-sm" style={{ fontFamily: OUTFIT, fontWeight: 600, color: BRAND_TEAL }}>
          Mixed questions against the clock
        </span>
      </span>
    </button>
  );
}

function ScoreBar({ score, streak, dark }: { score: number; streak: number; dark: string }) {
  return (
    <div className="sm-scorebar mb-4 flex flex-wrap justify-center gap-3">
      {[
        { label: "Score", value: score, emoji: "⭐", color: "#D8AE4F" },
        { label: "Streak", value: streak, emoji: "🔥", color: "#E45C48" },
      ].map(({ label, value, emoji, color }) => (
        <div
          key={label}
          className="flex items-center gap-2 rounded-2xl px-4 py-2 shadow"
          style={{
            background: "#fff",
            border: `2.5px solid ${color}`,
            color,
            fontFamily: OUTFIT,
            fontWeight: 700,
          }}
        >
          <span className="sm-score-emoji text-xl">{emoji}</span>
          <span className="sm-score-label text-base">{label}:</span>
          <span style={{ fontFamily: RACING, fontSize: "1.1rem" }}>{value}</span>
        </div>
      ))}
    </div>
  );
}

// Applies one NumPad key to the typed answer. ".5" finishes a half answer
// (296 → 296.5, empty → 0.5) instead of appending "0.5" to the digits.
function applyNumPadKey(value: string, key: string): string {
  if (key === ".5") {
    if (value.includes(".")) return value;
    return (value || "0") + ".5";
  }
  if (value.includes(".")) return value; // nothing can follow the .5
  if (value === "0") return key;
  if (value.length >= 6) return value;
  return value + key;
}

function NumPad({
  onDigit,
  onEnter,
  onErase,
  value,
  allowHalf = false,
}: {
  onDigit: (d: string) => void;
  onEnter: () => void;
  onErase: () => void;
  value: string;
  /** Show the ".5" key — only Half has non-whole answers. */
  allowHalf?: boolean;
}) {
  const canEnter = /^\d+(\.\d+)?$/.test(value);
  const keys = ["1", "2", "3", "4", "5", "6", "7", "8", "9", allowHalf ? ".5" : "", "0", "E"];
  return (
    <div className="mx-auto w-full max-w-xs">
      <div
        className="sm-numpad-display mb-3 flex min-h-[52px] items-center justify-center rounded-2xl border-4 bg-white px-4 py-2 text-center"
        style={{
          borderColor: BRAND_TEAL,
          color: BRAND_TEAL_DK,
          fontFamily: RACING,
          fontSize: "1.8rem",
        }}
      >
        {value || <span style={{ color: "#d1d5db", fontFamily: OUTFIT }}>?</span>}
      </div>
      <div className="sm-keys grid grid-cols-3 gap-2">
        {keys.map((d, i) =>
          d === "" ? (
            <span key={`blank-${i}`} aria-hidden />
          ) : (
          <button
            key={d}
            type="button"
            aria-label={d === "E" ? "Delete" : d === ".5" ? "Add .5" : d}
            onClick={() => (d === "E" ? onErase() : onDigit(d))}
            className="sm-key rounded-2xl py-3 shadow transition active:scale-95"
            style={{
              background: d === "E" ? "#E45C48" : "#e8f9f8",
              color: d === "E" ? "#fff" : BRAND_TEAL_DK,
              border: `2px solid ${BRAND_TEAL}44`,
              fontFamily: RACING,
              fontSize: "1.2rem",
            }}
          >
            {d === "E" ? "⌫" : d}
          </button>
          )
        )}
      </div>
      <button
        type="button"
        onClick={onEnter}
        disabled={!canEnter}
        className="sm-enter mt-3 w-full rounded-2xl py-3 shadow-lg transition active:scale-95 disabled:cursor-not-allowed disabled:opacity-40 disabled:active:scale-100"
        style={{ background: BRAND_TEAL, color: "#fff", fontFamily: RACING, fontSize: "1.2rem" }}
      >
        ✓ Enter
      </button>
    </div>
  );
}

// ─── Half Table Quiz ──────────────────────────────────────────────────────────
function HalfTableQuiz({
  bg,
  light,
  dark,
  onNext,
}: {
  bg: string;
  light: string;
  dark: string;
  onNext: () => void;
}) {
  const DIGITS = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
    TOTAL = 20;
  const [queue] = useState<number[]>(() => {
    const q: number[] = [];
    for (let i = 0; i < 2; i++) q.push(...shuffle(DIGITS));
    return q;
  });
  const [attempted, setAttempted] = useState(0);
  const [correct, setCorrect] = useState(0);
  const [inputVal, setInputVal] = useState("");
  const [feedback, setFeedback] = useState<"correct" | "wrong" | null>(null);
  const [done, setDone] = useState(false);
  const [showRef, setShowRef] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const currentDigit = queue[attempted] ?? 0;
  const expectedAnswer = Math.floor(currentDigit / 2);

  useEffect(() => {
    if (!done) inputRef.current?.focus();
  }, [attempted, done]);

  const checkAnswer = () => {
    if (inputVal === "" || feedback) return;
    const ok = parseInt(inputVal) === expectedAnswer;
    setFeedback(ok ? "correct" : "wrong");
    if (ok) setCorrect((c) => c + 1);
  };
  const next = () => {
    const n = attempted + 1;
    setAttempted(n);
    setInputVal("");
    setFeedback(null);
    if (n >= TOTAL) setDone(true);
  };
  const handleKey = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      if (feedback) next();
      else checkAnswer();
    }
  };
  const restart = () => {
    setAttempted(0);
    setCorrect(0);
    setInputVal("");
    setFeedback(null);
    setDone(false);
  };
  const refTable = [
    [0, 0],
    [1, 0],
    [2, 1],
    [3, 1],
    [4, 2],
    [5, 2],
    [6, 3],
    [7, 3],
    [8, 4],
    [9, 4],
  ];

  if (done) {
    const pct = Math.round((correct / TOTAL) * 100);
    return (
      <div
        className="mx-auto w-full max-w-sm rounded-3xl border-2 bg-white p-8 text-center shadow-xl"
        style={{ borderColor: bg }}
      >
        <div className="mb-3 text-6xl">{pct >= 90 ? "🌟" : pct >= 70 ? "👍" : "💪"}</div>
        <h3 className="mb-1 text-2xl" style={{ color: bg, fontFamily: RACING }}>
          Quiz Complete!
        </h3>
        <p className="mb-2 font-semibold" style={{ color: dark, fontFamily: OUTFIT }}>
          {correct}/{TOTAL} correct — {pct}%
        </p>
        <div className="mt-6 flex gap-3">
          <button
            onClick={restart}
            className="flex-1 rounded-2xl py-3 text-white active:scale-95"
            style={{ background: bg, fontFamily: RACING, fontSize: "1rem" }}
          >
            🔄 Retry
          </button>
          <button
            onClick={onNext}
            className="flex-1 rounded-2xl border-2 py-3 active:scale-95"
            style={{
              borderColor: bg,
              color: bg,
              background: light,
              fontFamily: RACING,
              fontSize: "1rem",
            }}
          >
            🪜 3-Step
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-sm space-y-4">
      <div className="flex items-center gap-3">
        <div
          className="h-2.5 flex-1 overflow-hidden rounded-full"
          style={{ background: "#e0f2f1" }}
        >
          <div
            className="h-full rounded-full transition-all duration-300"
            style={{ width: `${(attempted / TOTAL) * 100}%`, background: bg }}
          />
        </div>
        <span className="min-w-[48px] text-right text-sm" style={{ color: bg, fontFamily: RACING }}>
          {attempted}/{TOTAL}
        </span>
      </div>
      <div className="flex justify-center gap-4">
        <div
          className="flex items-center gap-2 rounded-2xl px-4 py-2 text-sm shadow"
          style={{
            background: "#fff",
            border: `2.5px solid ${bg}`,
            color: bg,
            fontFamily: OUTFIT,
            fontWeight: 700,
          }}
        >
          ✅ Correct: <span style={{ fontFamily: RACING }}>{correct}</span>
        </div>
        <div
          className="flex items-center gap-2 rounded-2xl px-4 py-2 text-sm shadow"
          style={{
            background: "#fff",
            border: "2.5px solid #e0f2f1",
            color: dark,
            fontFamily: OUTFIT,
            fontWeight: 700,
          }}
        >
          📝 Left: <span style={{ fontFamily: RACING }}>{TOTAL - attempted}</span>
        </div>
      </div>
      <div
        className="rounded-3xl border-2 bg-white p-6 text-center shadow-xl"
        style={{
          borderColor: feedback === "correct" ? "#22c55e" : feedback === "wrong" ? "#ef4444" : bg,
        }}
      >
        <p className="mb-1 text-sm font-semibold" style={{ color: bg, fontFamily: OUTFIT }}>
          Table half of
        </p>
        <div className="my-3 text-8xl" style={{ color: bg, fontFamily: RACING }}>
          {currentDigit}
        </div>
        <input
          ref={inputRef}
          type="text"
          inputMode="numeric"
          maxLength={2}
          pattern="[0-9]*"
          value={inputVal}
          onChange={(e) => {
            if (!feedback) setInputVal(e.target.value);
          }}
          onKeyDown={handleKey}
          disabled={!!feedback}
          placeholder="?"
          className="mb-3 w-32 rounded-2xl py-3 text-center outline-none transition-all"
          style={{
            border: `4px solid ${feedback === "correct" ? "#22c55e" : feedback === "wrong" ? "#ef4444" : bg}`,
            background:
              feedback === "correct" ? "#f0fdf4" : feedback === "wrong" ? "#fef2f2" : light,
            color: feedback === "correct" ? "#15803d" : feedback === "wrong" ? "#dc2626" : bg,
            fontFamily: RACING,
            fontSize: "2rem",
          }}
        />
        {feedback && (
          <div className="mb-3">
            <img
              src={feedback === "correct" ? CORRECT_IMG : WRONG_IMG}
              alt={feedback}
              style={{ width: "100%", maxWidth: "200px", margin: "0 auto", display: "block" }}
            />
          </div>
        )}
        {feedback === "correct" && (
          <p
            className="mb-2 text-lg text-green-500"
            style={{ fontFamily: OUTFIT, fontWeight: 800 }}
          >
            ✅ Correct!
          </p>
        )}
        {feedback === "wrong" && (
          <p
            className="mb-2 text-base text-red-400"
            style={{ fontFamily: OUTFIT, fontWeight: 800 }}
          >
            ❌ Table half of {currentDigit} is{" "}
            <span style={{ color: "#dc2626", fontFamily: RACING }}>{expectedAnswer}</span>
          </p>
        )}
        {!feedback ? (
          <button
            onClick={checkAnswer}
            disabled={inputVal === ""}
            className="w-full rounded-2xl py-3 text-lg text-white active:scale-95"
            style={{
              background: inputVal !== "" ? bg : "#ccc",
              cursor: inputVal !== "" ? "pointer" : "not-allowed",
              fontFamily: RACING,
            }}
          >
            Check ✓
          </button>
        ) : (
          <button
            onClick={next}
            className="w-full rounded-2xl py-3 text-lg text-white active:scale-95"
            style={{ background: bg, fontFamily: RACING }}
          >
            Next →
          </button>
        )}
      </div>
      <div className="rounded-3xl border-2 bg-white p-4" style={{ borderColor: `${bg}33` }}>
        <button
          onClick={() => setShowRef((v) => !v)}
          aria-expanded={showRef}
          className="sm-tap flex w-full items-center justify-between text-left text-sm"
          style={{ color: bg, fontFamily: OUTFIT, fontWeight: 700 }}
        >
          <span>📖 Reference Table</span>
          <span>{showRef ? "▲" : "▼"}</span>
        </button>
        {showRef && (
          <div className="mt-3 grid grid-cols-5 gap-2">
            {refTable.map(([d, h]) => (
              <div key={d} className="rounded-xl py-2 text-center" style={{ background: light }}>
                <div style={{ fontFamily: RACING, color: bg, fontSize: "1rem" }}>{d}</div>
                <div
                  style={{ fontFamily: OUTFIT, fontSize: "0.75rem", fontWeight: 600, color: dark }}
                >
                  → {h}
                </div>
              </div>
            ))}
          </div>
        )}
        {!showRef && (
          <p className="mt-1 text-xs" style={{ color: `${bg}99`, fontFamily: OUTFIT }}>
            0,1→0 | 2,3→1 | 4,5→2 | 6,7→3 | 8,9→4
          </p>
        )}
      </div>
    </div>
  );
}

// ─── Half 3-Step Interactive ──────────────────────────────────────────────────
type Half3StepPhase = "step1" | "step2" | "step3" | "done";

function Half3StepInteractive({
  practiceNum,
  onComplete,
  onNewNumber,
  bg,
  light,
  dark,
}: {
  practiceNum: number;
  onComplete: () => void;
  onNewNumber: () => void;
  bg: string;
  light: string;
  dark: string;
}) {
  const { digits, step1, oddPositions, answer } = computeHalfSteps(practiceNum);
  const [phase, setPhase] = useState<Half3StepPhase>("step1");
  const step2Ref = useRef<HTMLDivElement>(null);
  const step3Ref = useRef<HTMLDivElement>(null);
  const doneRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (phase === "step2") revealStep(step2Ref.current, "start");
    else if (phase === "step3") revealStep(step3Ref.current, "start");
    else if (phase === "done") revealStep(doneRef.current, "center");
  }, [phase]);

  const [userStep1, setUserStep1] = useState<(string | null)[]>(digits.map(() => null));
  const [step1Feedback, setStep1Feedback] = useState<(boolean | null)[]>(digits.map(() => null));

  const lastIsOdd = oddPositions[digits.length - 1];
  const totalCells = digits.length + (lastIsOdd ? 1 : 0);

  const isRightHighlight = (i: number): boolean => {
    if (i === 0) return false;
    if (i < digits.length) return oddPositions[i - 1];
    return lastIsOdd;
  };

  const [userOddSel, setUserOddSel] = useState<boolean[]>(Array(totalCells).fill(false));
  const [step2Feedback, setStep2Feedback] = useState<string | null>(null);

  const [step3Vals, setStep3Vals] = useState<Record<number, string>>({});
  const [step3Feedback, setStep3Feedback] = useState<Record<number, boolean | null>>({});
  const [step3DecimalVal, setStep3DecimalVal] = useState("");
  const [step3DecimalFb, setStep3DecimalFb] = useState<boolean | null>(null);
  const [step3AnyWrong, setStep3AnyWrong] = useState(false);

  const getFinalVal = (i: number): number => {
    let v = step1[i];
    if (isRightHighlight(i)) v += 5;
    if (v >= 10) v -= 10;
    return v;
  };

  const step2Cells: (number | null)[] = lastIsOdd ? [...step1, null] : [...step1];

  const baseCell = (bc: string, bgc: string, extra?: React.CSSProperties): React.CSSProperties => ({
    width: 52,
    height: 52,
    borderRadius: 14,
    border: `3px solid ${bc}`,
    background: bgc,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontFamily: RACING,
    fontSize: 22,
    color: BRAND_TEAL_DK,
    flexShrink: 0,
    ...extra,
  });

  const decDot: React.CSSProperties = {
    fontFamily: RACING,
    fontSize: 28,
    color: bg,
    alignSelf: "flex-end",
    marginBottom: 8,
    flexShrink: 0,
  };

  const upS1 = (idx: number, val: string) => {
    if (phase !== "step1") return;
    const n = [...userStep1];
    n[idx] = val === "" ? null : val;
    setUserStep1(n);
  };

  const chkS1 = () => {
    const fb = userStep1.map((v, i) => v !== null && parseInt(v) === step1[i]);
    setStep1Feedback(fb);
    if (fb.every(Boolean)) setTimeout(() => setPhase("step2"), 600);
  };

  const toggleHighlight = (idx: number) => {
    if (phase !== "step2") return;
    const ns = [...userOddSel];
    ns[idx] = !ns[idx];
    setUserOddSel(ns);
  };

  const checkStep2 = () => {
    const allCorrect = Array.from({ length: totalCells }, (_, i) => i).every(
      (i) => userOddSel[i] === isRightHighlight(i)
    );
    if (allCorrect) {
      setStep2Feedback("correct");
      setTimeout(() => setPhase("step3"), 800);
    } else {
      setStep2Feedback("wrong");
      setTimeout(() => {
        setStep2Feedback(null);
        setUserOddSel(Array(totalCells).fill(false));
      }, 1200);
    }
  };

  const upS3 = (idx: number, val: string) => {
    setStep3Vals((p) => ({ ...p, [idx]: val }));
  };

  const getExpectedS3 = (i: number): number => getFinalVal(i);

  const allS3Filled = (() => {
    const highlightedDigitIdxs = digits.map((_, i) => i).filter((i) => isRightHighlight(i));
    const digitsOk = highlightedDigitIdxs.every((i) => (step3Vals[i] ?? "") !== "");
    const decOk = !lastIsOdd || step3DecimalVal !== "";
    return digitsOk && decOk;
  })();

  const chkS3 = () => {
    const fb: Record<number, boolean> = {};
    let allOk = true;
    digits.forEach((_, i) => {
      if (isRightHighlight(i)) {
        const exp = getExpectedS3(i);
        const uv = parseInt(step3Vals[i] ?? "");
        const ok = uv === exp;
        fb[i] = ok;
        if (!ok) allOk = false;
      }
    });
    let decOk = true;
    if (lastIsOdd) {
      decOk = parseInt(step3DecimalVal) === 5;
      setStep3DecimalFb(decOk);
      if (!decOk) allOk = false;
    }
    setStep3Feedback(fb);
    setStep3AnyWrong(!allOk);
    if (allOk) {
      setTimeout(() => setPhase("done"), 600);
    }
  };

  return (
    <div className="mx-auto w-full max-w-sm space-y-4">
      <div className="flex gap-2">
        {(["step1", "step2", "step3", "done"] as Half3StepPhase[]).map((p, i) => {
          const order = ["step1", "step2", "step3", "done"];
          const phaseIdx = order.indexOf(phase);
          const pIdx = order.indexOf(p);
          return (
            <div
              key={p}
              className="h-2 flex-1 rounded-full transition-all duration-500"
              style={{ background: phaseIdx > pIdx ? bg : phase === p ? `${bg}99` : "#e0f2f1" }}
            />
          );
        })}
      </div>

      <div className="text-center">
        <span style={{ fontFamily: OUTFIT, fontWeight: 700, fontSize: "1rem", color: dark }}>
          Find half of
        </span>
        <div style={{ fontFamily: RACING, fontSize: "3rem", color: bg, marginTop: 4 }}>
          {practiceNum}
        </div>
      </div>

      <div
        className="overflow-hidden rounded-2xl border-2 bg-white shadow-sm"
        style={{ borderColor: `${bg}44` }}
      >
        <div
          className="px-3 py-1.5 text-center text-xs font-bold"
          style={{ background: bg, color: "#fff", fontFamily: OUTFIT }}
        >
          📖 Table Half Reference
        </div>
        <div className="grid grid-cols-10" style={{ borderBottom: `2px solid ${bg}44` }}>
          {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map((d) => (
            <div
              key={d}
              className="flex items-center justify-center py-2"
              style={{ fontFamily: RACING, fontSize: 15, color: bg, background: `${bg}10` }}
            >
              {d}
            </div>
          ))}
        </div>
        <div className="grid grid-cols-10">
          {[0, 0, 1, 1, 2, 2, 3, 3, 4, 4].map((h, d) => (
            <div
              key={d}
              className="flex items-center justify-center py-2"
              style={{ fontFamily: RACING, fontSize: 15, color: BRAND_TEAL_DK, background: "#fff" }}
            >
              {h}
            </div>
          ))}
        </div>
      </div>

      <div
        className="rounded-3xl border-2 bg-white p-5 shadow-lg"
        style={{ borderColor: phase === "step1" ? bg : "#e0f2f1" }}
      >
        <div className="mb-3 flex items-center gap-2">
          <div
            className="flex h-8 w-8 items-center justify-center rounded-full text-sm text-white"
            style={{ background: phase === "step1" ? bg : "#22c55e", fontFamily: RACING }}
          >
            {phase === "step1" ? "1" : "✓"}
          </div>
          <span style={{ fontFamily: OUTFIT, fontWeight: 700, color: bg }}>
            Halve each digit and drop the remainder
          </span>
        </div>

        <div className="mb-1 flex justify-center gap-2">
          {digits.map((d, i) => (
            <div key={i} style={{ ...baseCell(bg, light), color: bg }}>
              {d}
            </div>
          ))}
        </div>
        <div
          className="mb-1 text-center text-xs"
          style={{ color: dark, fontFamily: OUTFIT, fontWeight: 600 }}
        >
          ↓ half ↓
        </div>

        <div className="flex justify-center gap-2">
          {digits.map((_, i) =>
            phase === "step1" ? (
              <input
                key={i}
                type="text"
                inputMode="numeric"
                maxLength={2}
                pattern="[0-9]*"
                value={userStep1[i] ?? ""}
                onChange={(e) => upS1(i, e.target.value)}
                style={{
                  width: 52,
                  height: 52,
                  borderRadius: 14,
                  border: `3px solid ${step1Feedback[i] === null ? bg : step1Feedback[i] ? "#22c55e" : "#ef4444"}`,
                  background:
                    step1Feedback[i] === true
                      ? "#f0fdf4"
                      : step1Feedback[i] === false
                        ? "#fef2f2"
                        : "#fff",
                  textAlign: "center",
                  fontFamily: RACING,
                  fontSize: 22,
                  color: BRAND_TEAL_DK,
                  outline: "none",
                  flexShrink: 0,
                }}
                placeholder="?"
              />
            ) : (
              <div key={i} style={{ ...baseCell("#22c55e", "#f0fdf4"), color: "#15803d" }}>
                {step1[i]}
              </div>
            )
          )}
        </div>

        {phase === "step1" && (
          <button
            onClick={chkS1}
            disabled={!userStep1.every((v) => v !== null)}
            className="mt-4 w-full rounded-2xl py-3 text-white active:scale-95"
            style={{
              background: userStep1.every((v) => v !== null) ? bg : "#ccc",
              fontFamily: RACING,
              fontSize: "1rem",
            }}
          >
            Check ✓
          </button>
        )}
        {phase === "step1" && step1Feedback.some((f) => f === false) && (
          <div
            className="mt-2 text-center text-sm text-red-400"
            style={{ fontFamily: OUTFIT, fontWeight: 700 }}
          >
            Some wrong! (0,1→0 | 2,3→1 | 4,5→2 | 6,7→3 | 8,9→4)
          </div>
        )}
      </div>

      {(phase === "step2" || phase === "step3" || phase === "done") && (
        <div
          ref={step2Ref}
          className="scroll-mt-4 rounded-3xl border-2 bg-white p-5 shadow-lg"
          style={{ borderColor: phase === "done" ? "#22c55e" : bg }}
        >
          <div className="mb-3 flex items-center gap-2">
            <div
              className="flex h-8 w-8 items-center justify-center rounded-full text-sm text-white"
              style={{ background: phase === "done" ? "#22c55e" : bg, fontFamily: RACING }}
            >
              {phase === "done" ? "✓" : "2"}
            </div>
            <span style={{ fontFamily: OUTFIT, fontWeight: 700, color: bg }}>
              {phase === "step2" ? "Tap cells that need +5" : "Add +5 to highlighted cells"}
            </span>
          </div>

          <p className="mb-3 text-xs" style={{ color: dark, fontFamily: OUTFIT }}>
            {phase === "step2"
              ? "Tap the cell to the RIGHT of each odd digit. If the last digit is odd, also tap the extra decimal cell."
              : "🟡 cells get +5 added — type the result for each highlighted cell."}
          </p>

          <div
            className="mb-1 text-center text-xs"
            style={{ color: dark, fontFamily: OUTFIT, fontWeight: 600 }}
          >
            Original number
          </div>
          <div className="mb-3 flex items-center justify-center gap-2">
            {step2Cells.map((_, i) => {
              const isExtra = i === digits.length;
              return (
                <div key={i} style={{ display: "flex", alignItems: "center", flexShrink: 0 }}>
                  {isExtra && <div style={decDot}>.</div>}
                  <div
                    style={{
                      ...baseCell(`${bg}44`, light),
                      color: BRAND_TEAL_DK,
                      fontSize: isExtra ? 18 : 22,
                      borderStyle: isExtra ? "dashed" : "solid",
                      opacity: 0.65,
                    }}
                  >
                    {isExtra ? "·" : digits[i]}
                  </div>
                </div>
              );
            })}
          </div>

          <div
            className="mb-1 text-center text-xs"
            style={{ color: dark, fontFamily: OUTFIT, fontWeight: 600 }}
          >
            {phase === "step2"
              ? "Tap to highlight (cells that need +5)"
              : "Highlighted cells (step 1 values)"}
          </div>
          <div className="flex items-center justify-center gap-2">
            {step2Cells.map((v, i) => {
              const isExtra = i === digits.length;
              const shouldHighlight = isRightHighlight(i);
              const isHighlighted = phase === "step2" ? userOddSel[i] : shouldHighlight;
              const borderCol = isHighlighted
                ? "#f59e0b"
                : phase === "step2"
                  ? `${bg}66`
                  : `${bg}44`;
              const bgCol = isHighlighted ? "#fef3c7" : isExtra ? `${bg}08` : light;
              const txtCol = isHighlighted ? "#b45309" : BRAND_TEAL_DK;
              return (
                <div key={i} style={{ display: "flex", alignItems: "center", flexShrink: 0 }}>
                  {isExtra && <div style={decDot}>.</div>}
                  <div
                    onClick={() => phase === "step2" && toggleHighlight(i)}
                    style={{
                      width: 52,
                      height: 52,
                      borderRadius: 14,
                      border: `3px ${isExtra ? "dashed" : "solid"} ${borderCol}`,
                      background: bgCol,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontFamily: RACING,
                      fontSize: isExtra ? 18 : 22,
                      color: txtCol,
                      cursor: phase === "step2" ? "pointer" : "default",
                      transition: "all 0.2s",
                      boxShadow: isHighlighted ? "0 0 0 3px #fbbf2444" : "none",
                      flexShrink: 0,
                    }}
                  >
                    {isExtra ? "·" : step1[i]}
                  </div>
                </div>
              );
            })}
          </div>

          {phase === "step2" && (
            <>
              <button
                onClick={checkStep2}
                className="mt-4 w-full rounded-2xl py-3 text-white active:scale-95"
                style={{ background: bg, fontFamily: RACING, fontSize: "1rem" }}
              >
                Confirm ✓
              </button>
              {step2Feedback === "wrong" && (
                <div
                  className="mt-2 text-center text-sm text-red-400"
                  style={{ fontFamily: OUTFIT, fontWeight: 700 }}
                >
                  ❌ Not quite — tap the cells to the RIGHT of odd digits!
                </div>
              )}
              {step2Feedback === "correct" && (
                <div
                  className="mt-2 text-center text-sm text-green-500"
                  style={{ fontFamily: OUTFIT, fontWeight: 700 }}
                >
                  ✅ Correct!
                </div>
              )}
            </>
          )}

          {(phase === "step3" || phase === "done") && (
            <>
              <div
                ref={step3Ref}
                className="mt-4 scroll-mt-4 pt-4"
                style={{ borderTop: `2px dashed ${bg}33` }}
              >
                <div className="mb-2 flex items-center gap-2">
                  <div
                    className="flex h-8 w-8 items-center justify-center rounded-full text-sm text-white"
                    style={{ background: phase === "done" ? "#22c55e" : bg, fontFamily: RACING }}
                  >
                    {phase === "done" ? "✓" : "3"}
                  </div>
                  <span style={{ fontFamily: OUTFIT, fontWeight: 700, color: bg }}>
                    Add +5 to each 🟡 cell — type the result
                  </span>
                </div>

                <div
                  className="mb-3 text-center text-xs"
                  style={{ color: dark, fontFamily: OUTFIT, fontWeight: 600 }}
                >
                  ↓ type result after +5 for each 🟡 cell ↓
                </div>

                <div className="flex items-center justify-center gap-2">
                  {digits.map((_, i) => {
                    const shouldHighlight = isRightHighlight(i);
                    const exp = getExpectedS3(i);
                    const fb = step3Feedback[i] ?? null;

                    if (phase === "done") {
                      return (
                        <div
                          key={i}
                          style={{ ...baseCell("#22c55e", "#f0fdf4"), color: "#15803d" }}
                        >
                          {exp}
                        </div>
                      );
                    }

                    if (!shouldHighlight) {
                      return (
                        <div
                          key={i}
                          style={{
                            ...baseCell(`${bg}44`, light),
                            color: BRAND_TEAL_DK,
                            opacity: 0.7,
                          }}
                        >
                          {step1[i]}
                        </div>
                      );
                    }

                    return (
                      <input
                        key={i}
                        type="number"
                        value={step3Vals[i] ?? ""}
                        onChange={(e) => upS3(i, e.target.value)}
                        style={{
                          width: 52,
                          height: 52,
                          borderRadius: 14,
                          border: `3px solid ${fb === null ? "#f59e0b" : fb ? "#22c55e" : "#ef4444"}`,
                          background:
                            fb === true ? "#f0fdf4" : fb === false ? "#fef2f2" : "#fef3c7",
                          textAlign: "center",
                          fontFamily: RACING,
                          fontSize: 22,
                          color: fb === true ? "#15803d" : fb === false ? "#dc2626" : "#b45309",
                          outline: "none",
                          flexShrink: 0,
                        }}
                        placeholder="?"
                      />
                    );
                  })}

                  {lastIsOdd && (
                    <div style={{ display: "flex", alignItems: "center", flexShrink: 0 }}>
                      <div style={decDot}>.</div>
                      {phase === "done" ? (
                        <div
                          style={{
                            ...baseCell("#22c55e", "#f0fdf4"),
                            width: 40,
                            fontSize: 18,
                            color: "#15803d",
                          }}
                        >
                          5
                        </div>
                      ) : (
                        <input
                          type="text"
                          inputMode="numeric"
                          maxLength={1}
                          pattern="[0-9]*"
                          value={step3DecimalVal}
                          onChange={(e) => setStep3DecimalVal(e.target.value)}
                          style={{
                            width: 44,
                            height: 52,
                            borderRadius: 14,
                            border: `3px dashed ${step3DecimalFb === null ? "#f59e0b" : step3DecimalFb ? "#22c55e" : "#ef4444"}`,
                            background:
                              step3DecimalFb === true
                                ? "#f0fdf4"
                                : step3DecimalFb === false
                                  ? "#fef2f2"
                                  : "#fef3c7",
                            textAlign: "center",
                            fontFamily: RACING,
                            fontSize: 20,
                            color:
                              step3DecimalFb === true
                                ? "#15803d"
                                : step3DecimalFb === false
                                  ? "#dc2626"
                                  : "#b45309",
                            outline: "none",
                            flexShrink: 0,
                          }}
                          placeholder="?"
                        />
                      )}
                    </div>
                  )}
                </div>

                {phase === "step3" && (
                  <>
                    <button
                      onClick={chkS3}
                      disabled={!allS3Filled}
                      className="mt-4 w-full rounded-2xl py-3 text-white active:scale-95"
                      style={{
                        background: allS3Filled ? bg : "#ccc",
                        cursor: allS3Filled ? "pointer" : "not-allowed",
                        fontFamily: RACING,
                        fontSize: "1rem",
                      }}
                    >
                      Check ✓
                    </button>
                    {step3AnyWrong && (
                      <div
                        className="mt-2 text-center text-sm text-red-400"
                        style={{ fontFamily: OUTFIT, fontWeight: 700 }}
                      >
                        ❌ Not right — each 🟡 cell = its value + 5 (drop tens if ≥10)
                      </div>
                    )}
                  </>
                )}
              </div>
            </>
          )}
        </div>
      )}

      {phase === "done" && (
        <div
          ref={doneRef}
          className="rounded-3xl border-2 bg-white p-6 text-center shadow-xl"
          style={{ borderColor: "#22c55e" }}
        >
          <div className="mb-2 text-5xl">🎉</div>
          <div className="mb-1 text-2xl text-green-600" style={{ fontFamily: RACING }}>
            ½ of {practiceNum} = <span style={{ color: bg }}>{answer}</span>
          </div>
          <div className="mb-4" style={{ color: dark, fontFamily: OUTFIT, fontWeight: 600 }}>
            {Number.isInteger(answer) ? "Great work!" : "Notice the .5 — last digit was odd!"}
          </div>
          <div className="flex gap-3">
            <button
              onClick={onNewNumber}
              className="flex-1 rounded-2xl py-3 text-white active:scale-95"
              style={{ background: bg, fontFamily: RACING, fontSize: "1rem" }}
            >
              🔄 New Number
            </button>
            <button
              onClick={onComplete}
              className="flex-1 rounded-2xl border-2 py-3 active:scale-95"
              style={{
                borderColor: bg,
                color: bg,
                background: light,
                fontFamily: RACING,
                fontSize: "1rem",
              }}
            >
              ⚡ Race
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Square Step Row ──────────────────────────────────────────────────────────
function SquareStepRow({
  label,
  sublabel,
  placeholder,
  value,
  onChange,
  onSubmit,
  feedback,
  locked,
  confirmed,
  confirmedValue,
  wide = false,
  bg,
  dark,
}: {
  label: string;
  sublabel?: string;
  placeholder: string;
  value: string;
  onChange: (v: string) => void;
  onSubmit: () => void;
  feedback: "correct" | "wrong" | null;
  locked: boolean;
  confirmed: boolean;
  confirmedValue?: string | number;
  wide?: boolean;
  bg: string;
  dark: string;
}) {
  const ref = useRef<HTMLInputElement>(null);
  useEffect(() => {
    if (!locked && !confirmed) ref.current?.focus();
  }, [locked, confirmed]);
  const bc =
    feedback === "correct" ? "#22c55e" : feedback === "wrong" ? "#ef4444" : locked ? "#d1d5db" : bg;
  const bgc =
    feedback === "correct"
      ? "#f0fdf4"
      : feedback === "wrong"
        ? "#fef2f2"
        : locked
          ? "#f9fafb"
          : "#fff";
  const tc =
    feedback === "correct" ? "#15803d" : feedback === "wrong" ? "#dc2626" : locked ? "#9ca3af" : bg;
  const btnBg = locked ? "#aaa" : bg;
  return (
    <div className="flex w-full items-center gap-3">
      <button
        className="flex-1 rounded-2xl px-4 py-4 text-left text-white shadow-md"
        style={{ background: btnBg, opacity: locked ? 0.5 : 1, cursor: "default", minHeight: 64 }}
      >
        <div style={{ fontFamily: RACING, fontSize: "0.95rem", lineHeight: 1.2 }}>{label}</div>
        {sublabel && (
          <div
            style={{
              fontFamily: OUTFIT,
              fontSize: "0.75rem",
              fontWeight: 600,
              opacity: 0.8,
              marginTop: 2,
            }}
          >
            {sublabel}
          </div>
        )}
      </button>
      <div className={`${wide ? "min-w-[90px]" : "w-16"} flex-shrink-0`}>
        {confirmed ? (
          <div
            className="flex h-14 items-center justify-center rounded-2xl"
            style={{
              border: `3px solid ${bg}`,
              background: "#f0fdf4",
              color: "#15803d",
              minWidth: wide ? 90 : 64,
              fontFamily: RACING,
              fontSize: "1.3rem",
            }}
          >
            {confirmedValue}
          </div>
        ) : (
          <input
            ref={ref}
            type="text"
            inputMode="numeric"
            pattern="[0-9]*"
            value={value}
            onChange={(e) => !locked && onChange(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && !locked && onSubmit()}
            disabled={locked}
            placeholder={placeholder}
            className="h-14 w-full rounded-2xl text-center outline-none transition-all"
            style={{
              border: `3px solid ${bc}`,
              background: bgc,
              color: tc,
              minWidth: wide ? 90 : 64,
              fontFamily: RACING,
              fontSize: "1.3rem",
            }}
          />
        )}
      </div>
    </div>
  );
}

// ─── Square Step View ─────────────────────────────────────────────────────────
function SquareStepView({
  squareNum,
  onTryAnother,
  onRangeSelect,
  onGoSettings,
  bg,
  light,
  dark,
}: {
  squareNum: number;
  onTryAnother: () => void;
  onRangeSelect: (r: string) => void;
  onGoSettings: () => void;
  bg: string;
  light: string;
  dark: string;
}) {
  type RangeKey = "26-50" | "51-75" | "76-100" | "101-125";

  const getRange = (n: number): RangeKey => {
    if (n >= 26 && n <= 50) return "26-50";
    if (n >= 51 && n <= 75) return "51-75";
    if (n >= 76 && n <= 100) return "76-100";
    return "101-125";
  };
  const range = getRange(squareNum);

  const computeValues = (n: number, r: RangeKey) => {
    if (r === "26-50") {
      const x = 50 - n;
      const AB = 25 - x;
      const CD = x * x;
      return { x, AB, CD, base: 50, dir: "below" as const, method: "50-x" };
    }
    if (r === "51-75") {
      const x = n - 50;
      const AB = 25 + x;
      const CD = x * x;
      return { x, AB, CD, base: 50, dir: "above" as const, method: "50+x" };
    }
    if (r === "76-100") {
      const x = 100 - n;
      const AB = 100 - 2 * x;
      const CD = x * x;
      return { x, AB, CD, base: 100, dir: "below" as const, method: "100-2x" };
    }
    if (r === "101-125") {
      const x = n - 100;
      const AB = 100 + 2 * x;
      const CD = x * x;
      return { x, AB, CD, base: 100, dir: "above" as const, method: "100+2x" };
    }
    return { x: 0, AB: 0, CD: 0, base: 50, dir: "below" as const, method: "50-x" };
  };

  const { x, AB, CD, base, dir, method } = computeValues(squareNum, range);
  const hasMultiDigitCD = String(CD).length >= 3;
  const cdCarry = hasMultiDigitCD ? Math.floor(CD / 100) : 0;
  const newCD = hasMultiDigitCD ? CD % 100 : CD;
  const newAB = AB + cdCarry;
  const finalAnswer = newAB * 100 + newCD;
  const formattedCD = String(newCD).padStart(2, "0");

  // The "front part" is 25 ± gap near 50, and the number ± gap near 100.
  const frontOp = (gapText: string) =>
    base === 50
      ? `25 ${dir === "below" ? "−" : "+"} ${gapText}`
      : `${squareNum} ${dir === "below" ? "−" : "+"} ${gapText}`;

  // Each prompt explains the method; a number appears only once the step that
  // produces it has been answered (the old prompts printed the answers).
  const getSteps = () => {
    const base_ = [
      {
        id: "step1",
        label: "Step 1",
        sublabel: (_done: boolean[]) =>
          x === 0
            ? `${squareNum} is exactly ${base}, so the gap is 0`
            : `How far is ${squareNum} ${dir} ${base}?`,
        placeholder: "gap",
        wide: false,
        displayVal: x,
      },
      {
        id: "step2",
        label: "Step 2",
        sublabel: (done: boolean[]) => `Front part: ${frontOp(done[0] ? String(x) : "the gap")}`,
        placeholder: "front",
        wide: false,
        displayVal: AB,
      },
      {
        id: "step3",
        label: "Step 3",
        sublabel: (done: boolean[]) => `Last part: ${done[0] ? `${x}²` : "the gap squared"}`,
        placeholder: "last",
        wide: false,
        displayVal: CD,
      },
    ];

    if (hasMultiDigitCD) {
      return [
        ...base_,
        {
          id: "step3_1",
          label: "Step 4",
          sublabel: (done: boolean[]) =>
            done[2]
              ? `${CD} has three digits: keep the last two`
              : "Three digits? Keep the last two",
          placeholder: "last 2",
          wide: false,
          displayVal: newCD,
        },
        {
          id: "step3_2",
          label: "Step 5",
          sublabel: (done: boolean[]) =>
            done[2] && done[1]
              ? `Add the ${cdCarry} to the front part: ${AB} + ${cdCarry}`
              : "Add the extra digit to the front part",
          placeholder: "front",
          wide: false,
          displayVal: newAB,
        },
        {
          id: "answer",
          label: "Answer",
          sublabel: (done: boolean[]) =>
            done[4] && done[3]
              ? `Put them together: ${newAB} then ${formattedCD}`
              : "Put the front part and the last two digits together",
          placeholder: "answer",
          wide: true,
          displayVal: finalAnswer,
        },
      ];
    }
    return [
      ...base_,
      {
        id: "answer",
        label: "Answer",
        sublabel: (done: boolean[]) =>
          done[1] && done[2]
            ? `Put them together: ${AB} then ${formattedCD}`
            : "Put the front part and the last part together",
        placeholder: "answer",
        wide: true,
        displayVal: finalAnswer,
      },
    ];
  };

  const steps = getSteps();
  const correctAnswers = steps.map((s) => s.displayVal);

  const [currentStep, setCurrentStep] = useState(0);
  const [vals, setVals] = useState<string[]>(steps.map(() => ""));
  const [feedbacks, setFeedbacks] = useState<("correct" | "wrong" | null)[]>(steps.map(() => null));
  const [confirmed, setConfirmed] = useState<boolean[]>(steps.map(() => false));

  const handleChange = (i: number, v: string) => {
    const n = [...vals];
    n[i] = v;
    setVals(n);
  };
  const handleSubmit = (i: number) => {
    const uv = parseFloat(vals[i]),
      exp = correctAnswers[i];
    if (Math.abs(uv - exp) < 0.01) {
      const nf = [...feedbacks];
      nf[i] = "correct";
      setFeedbacks(nf);
      setTimeout(() => {
        const nc = [...confirmed];
        nc[i] = true;
        setConfirmed([...nc]);
        if (i < steps.length - 1) setCurrentStep(i + 1);
        else setCurrentStep(steps.length);
      }, 600);
    } else {
      const nf = [...feedbacks];
      nf[i] = "wrong";
      setFeedbacks(nf);
      setTimeout(() => {
        const nf2 = [...feedbacks];
        nf2[i] = null;
        setFeedbacks(nf2);
      }, 1000);
    }
  };

  const isDone = currentStep === steps.length;
  const stepRefs = useRef<(HTMLDivElement | null)[]>([]);
  const doneRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (currentStep === 0) return;
    revealStep(isDone ? doneRef.current : stepRefs.current[currentStep] ?? null);
  }, [currentStep, isDone]);
  const rangeBadge: Record<RangeKey, string> = {
    "26-50": "#26a9e0",
    "51-75": "#84c341",
    "76-100": "#d93b60",
    "101-125": "#7784c1",
  };
  const fmtVal = (val: number, id: string) =>
    id === "step3_1" && hasMultiDigitCD ? String(val).padStart(2, "0") : val;

  return (
    <div className="mx-auto w-full max-w-sm space-y-3">
      <div
        className="grid grid-cols-4 gap-1 rounded-2xl border-2 bg-white p-1 shadow"
        style={{ borderColor: `${bg}33` }}
      >
        {(["26-50", "51-75", "76-100", "101-125"] as RangeKey[]).map((r) => (
          <button
            key={r}
            onClick={() => onRangeSelect(r)}
            className="sm-tap rounded-xl py-2 transition-all active:scale-95"
            style={{
              background: range === r ? bg : "transparent",
              color: range === r ? "#fff" : bg,
              fontFamily: RACING,
              fontSize: "0.875rem",
              opacity: range === r ? 1 : 0.55,
              cursor: "pointer",
            }}
            title={`Practise ${r}`}
          >
            {r}
          </button>
        ))}
      </div>
      <div className="flex gap-1.5">
        {steps.map((_, i) => (
          <div
            key={i}
            className="h-2.5 flex-1 rounded-full transition-all duration-500"
            style={{ background: i < currentStep ? bg : i === currentStep ? `${bg}88` : "#e0f2f1" }}
          />
        ))}
      </div>
      <div className="text-center">
        <div
          className="mb-2 inline-block rounded-full px-3 py-1 text-xs text-white"
          style={{ background: rangeBadge[range], fontFamily: OUTFIT, fontWeight: 700 }}
        >
          {range} · {dir} {base}
        </div>
        <div style={{ fontFamily: OUTFIT, fontWeight: 700, fontSize: "0.85rem", color: dark }}>
          Find the square of
        </div>
        <div style={{ fontFamily: RACING, fontSize: "3.5rem", color: bg }}>{squareNum}</div>
      </div>
      <div
        className="space-y-3 rounded-3xl border-2 bg-white p-5 shadow-xl"
        style={{ borderColor: isDone ? "#22c55e" : bg }}
      >
        {steps.map((s, i) => (
          <div
            key={s.id}
            ref={(el) => {
              stepRefs.current[i] = el;
            }}
            className="space-y-2"
          >
            <SquareStepRow
              label={s.label}
              sublabel={s.sublabel(confirmed)}
              placeholder={s.placeholder}
              value={vals[i]}
              onChange={(v) => handleChange(i, v)}
              onSubmit={() => handleSubmit(i)}
              feedback={feedbacks[i]}
              locked={currentStep < i}
              confirmed={confirmed[i]}
              confirmedValue={confirmed[i] ? fmtVal(s.displayVal as number, s.id) : undefined}
              wide={s.wide}
              bg={bg}
              dark={dark}
            />
            {currentStep === i && !confirmed[i] && !isDone && (
              <button
                onClick={() => handleSubmit(i)}
                disabled={!vals[i]}
                className="w-full rounded-2xl py-2.5 text-white transition-all active:scale-95"
                style={{
                  background: vals[i] ? bg : "#ccc",
                  cursor: vals[i] ? "pointer" : "not-allowed",
                  fontFamily: RACING,
                  fontSize: "1rem",
                }}
              >
                Check ✓
              </button>
            )}
            {feedbacks[i] === "wrong" && !confirmed[i] && (
              <div
                className="text-center text-sm text-red-400"
                style={{ fontFamily: OUTFIT, fontWeight: 700 }}
              >
                ❌ Not quite — try again!
              </div>
            )}
          </div>
        ))}
        {isDone && (
          <div ref={doneRef} className="pt-2 text-center">
            <div className="mb-1 text-3xl">🎉</div>
            <div style={{ fontFamily: RACING, fontSize: "1.4rem", color: bg }}>
              {squareNum}² = {finalAnswer}
            </div>
            <div
              className="mb-4 mt-1"
              style={{ fontFamily: OUTFIT, fontWeight: 600, fontSize: "0.85rem", color: dark }}
            >
              {`${squareNum} is ${x} ${dir} ${base}. ${frontOp(String(x))} = ${AB}. ${x}² = ${
                hasMultiDigitCD ? `${CD}. Keep ${formattedCD}, ${AB} + ${cdCarry} = ${newAB}` : formattedCD
              }. Answer: ${finalAnswer}`}
            </div>
            <div className="flex gap-3">
              <button
                onClick={onTryAnother}
                className="flex-1 rounded-2xl py-3 text-white active:scale-95"
                style={{ background: bg, fontFamily: RACING, fontSize: "1rem" }}
              >
                🔄 Try Another
              </button>
              <button
                onClick={onGoSettings}
                className="flex-1 rounded-2xl border-2 py-3 active:scale-95"
                style={{
                  borderColor: bg,
                  color: bg,
                  background: light,
                  fontFamily: RACING,
                  fontSize: "1rem",
                }}
              >
                ⚡ Race
              </button>
            </div>
          </div>
        )}
      </div>
      <div className="rounded-3xl border-2 bg-white p-4" style={{ borderColor: `${bg}33` }}>
        <p className="mb-2 text-center text-sm" style={{ color: bg, fontFamily: RACING }}>
          📐 How it works
        </p>
        <div className="grid grid-cols-2 gap-2 text-xs">
          {[
            ["26–50", "47 is 3 below 50. 25 − 3 = 22. 3² = 09. Answer: 2209"],
            ["51–75", "53 is 3 above 50. 25 + 3 = 28. 3² = 09. Answer: 2809"],
            ["76–100", "97 is 3 below 100. 97 − 3 = 94. 3² = 09. Answer: 9409"],
            ["101–125", "103 is 3 above 100. 103 + 3 = 106. 3² = 09. Answer: 10609"],
          ].map(([t, d]) => {
            const active = range === t.replace("–", "-");
            return (
              <div
                key={t}
                className="rounded-xl p-2 text-center"
                style={{
                  background: active ? `${bg}18` : light,
                  border: active ? `1.5px solid ${bg}` : "none",
                }}
              >
                <div style={{ fontFamily: RACING, color: BRAND_TEAL_DK, fontSize: "0.85rem" }}>
                  {t}
                </div>
                <div style={{ fontFamily: OUTFIT, color: dark, fontWeight: 600 }}>{d}</div>
              </div>
            );
          })}
        </div>
        <div
          className="mt-3 rounded-xl p-2 text-center text-xs"
          style={{ background: `${bg}10`, border: `1px dashed ${bg}` }}
        >
          <span style={{ fontFamily: OUTFIT, fontWeight: 700, color: dark }}>
            If the last part has three digits, keep the last two and add the first to the front
            part. 38 is 12 below 50. 25 − 12 = 13. 12² = 144. Keep 44, 13 + 1 = 14. Answer: 1444
          </span>
        </div>
      </div>
    </div>
  );
}

// ─── Friends Practice (Tabbed) ────────────────────────────────────────
type FriendBase = 9 | 10 | 100;

interface FriendPair {
  a: number;
  b: number;
}
interface TabScore {
  score: number;
  total: number;
}

function generateFriendPair(base: FriendBase): FriendPair {
  if (base === 9) {
    const a = rand(1, 8);
    return { a, b: 9 - a };
  }
  if (base === 10) {
    const a = rand(1, 9);
    return { a, b: 10 - a };
  }
  const a = rand(11, 89);
  return { a, b: 100 - a };
}

// ─── FriendPanel — compact single-screen layout ───────────────────────────────
function FriendPanel({
  base,
  score,
  total,
  onScore,
  bg,
  light,
  dark,
}: {
  base: FriendBase;
  score: number;
  total: number;
  onScore: (correct: boolean) => void;
  bg: string;
  light: string;
  dark: string;
}) {
  const [pair, setPair] = useState<FriendPair>(() => generateFriendPair(base));
  const [feedback, setFeedback] = useState<"correct" | "wrong" | null>(null);

  // For base 100 - separate inputs for tens and units
  const [tensFriend, setTensFriend] = useState("");
  const [unitsFriend, setUnitsFriend] = useState("");
  const unitsInputRef = useRef<HTMLInputElement>(null);

  // For other bases - single input
  const [singleAnswer, setSingleAnswer] = useState("");

  const next = useCallback(() => {
    setPair(generateFriendPair(base));
    setFeedback(null);
    setTensFriend("");
    setUnitsFriend("");
    setSingleAnswer("");
  }, [base]);

  const handleSubmitFor100 = () => {
    if (feedback) return;
    const tens = parseInt(tensFriend);
    const units = parseInt(unitsFriend);
    const combined = parseInt(`${tens}${units}`);
    const correct = combined === pair.b;
    setFeedback(correct ? "correct" : "wrong");
    onScore(correct);
    setTimeout(next, 1500);
  };

  const handleSubmitForOthers = () => {
    if (feedback) return;
    const correct = parseInt(singleAnswer) === pair.b;
    setFeedback(correct ? "correct" : "wrong");
    onScore(correct);
    setTimeout(next, 1500);
  };

  const borderCol = feedback === "correct" ? "#22c55e" : feedback === "wrong" ? "#ef4444" : bg;

  // ── Base 100: two-input layout ──────────────────────────────────────────────
  if (base === 100) {
    const tensDigit = Math.floor(pair.a / 10);
    const unitsDigit = pair.a % 10;
    // Ends in 0: tens add to 10 and the units stay 0 (60 → 40).
    // Otherwise tens add to 9 and units add to 10 (37 → 63).
    const roundNumber = unitsDigit === 0;
    const expectedTensFriend = roundNumber ? 10 - tensDigit : 9 - tensDigit;
    const expectedUnitsFriend = roundNumber ? 0 : 10 - unitsDigit;
    const expectedCombined = expectedTensFriend * 10 + expectedUnitsFriend;

    return (
      <div
        style={{
          background: "#fff",
          border: `3px solid ${borderCol}`,
          borderRadius: 20,
          padding: "14px 16px 12px",
          transition: "border-color 0.25s ease",
          width: "100%",
        }}
      >
        {/* Question row */}
        <div
          style={{
            background:
              feedback === "correct" ? "#f0fdf4" : feedback === "wrong" ? "#fef2f2" : light,
            borderRadius: 14,
            padding: "12px 10px 10px",
            textAlign: "center",
            transition: "background 0.3s ease",
            marginBottom: 12,
          }}
        >
          <p
            style={{
              fontFamily: OUTFIT,
              fontWeight: 600,
              fontSize: "0.78rem",
              color: dark,
              margin: "0 0 2px",
            }}
          >
            Friend of
          </p>
          <div style={{ fontFamily: RACING, fontSize: "2.8rem", color: bg, lineHeight: 1 }}>
            {pair.a}
          </div>
          <div
            style={{
              fontFamily: OUTFIT,
              fontWeight: 700,
              fontSize: "0.72rem",
              color: `${bg}99`,
              marginTop: 2,
            }}
          >
            {pair.a} + ? = {base}
          </div>
        </div>

        {/* Hint row */}
        <div
          style={{
            display: "flex",
            gap: 6,
            justifyContent: "center",
            marginBottom: 10,
            fontFamily: OUTFIT,
            fontSize: "0.7rem",
            fontWeight: 600,
            color: dark,
          }}
        >
          <span style={{ background: `${bg}15`, borderRadius: 8, padding: "3px 8px" }}>
            Tens {tensDigit} → {roundNumber ? "10's" : "9's"} friend
          </span>
          <span style={{ background: `${bg}15`, borderRadius: 8, padding: "3px 8px" }}>
            {roundNumber ? "Units stay 0" : `Units ${unitsDigit} → 10's friend`}
          </span>
        </div>

        {/* Two inputs */}
        {!feedback ? (
          <div
            style={{
              display: "flex",
              gap: 10,
              justifyContent: "center",
              alignItems: "center",
              marginBottom: 12,
            }}
          >
            <input
              type="text"
              inputMode="numeric"
              maxLength={1}
              pattern="[0-9]*"
              value={tensFriend}
              onChange={(e) => setTensFriend(e.target.value)}
              placeholder="?"
              onKeyDown={(e) => {
                if (e.key === "Enter" && tensFriend) unitsInputRef.current?.focus();
              }}
              style={{
                width: 60,
                height: 60,
                textAlign: "center",
                fontSize: "1.8rem",
                fontFamily: RACING,
                border: `3px solid ${bg}`,
                borderRadius: 14,
                outline: "none",
                color: bg,
                background: "#fff",
              }}
            />
            <span style={{ fontSize: "1.6rem", fontFamily: RACING, color: bg }}>&</span>
            <input
              ref={unitsInputRef}
              type="text"
              inputMode="numeric"
              maxLength={1}
              pattern="[0-9]*"
              value={unitsFriend}
              onChange={(e) => setUnitsFriend(e.target.value)}
              placeholder="?"
              onKeyDown={(e) => {
                if (e.key === "Enter" && unitsFriend) handleSubmitFor100();
              }}
              style={{
                width: 60,
                height: 60,
                textAlign: "center",
                fontSize: "1.8rem",
                fontFamily: RACING,
                border: `3px solid ${bg}`,
                borderRadius: 14,
                outline: "none",
                color: bg,
                background: "#fff",
              }}
            />
          </div>
        ) : (
          <div
            style={{
              padding: "8px 10px",
              borderRadius: 12,
              marginBottom: 12,
              textAlign: "center",
              background: feedback === "correct" ? "#f0fdf4" : "#fef2f2",
              fontFamily: OUTFIT,
              fontWeight: 800,
              fontSize: "0.85rem",
              color: feedback === "correct" ? "#16a34a" : "#dc2626",
            }}
          >
            {feedback === "correct"
              ? `✅ ${pair.a} + ${expectedCombined} = ${base}`
              : `❌ It's ${expectedCombined}! (${tensDigit}→${expectedTensFriend}, ${unitsDigit}→${expectedUnitsFriend})`}
          </div>
        )}

        {/* Buttons */}
        <div style={{ display: "flex", gap: 8 }}>
          {!feedback && (
            <>
              <button
                onClick={handleSubmitFor100}
                disabled={!tensFriend || !unitsFriend}
                style={{
                  flex: 1,
                  background: tensFriend && unitsFriend ? bg : "#ccc",
                  border: "none",
                  borderRadius: 12,
                  padding: "11px",
                  fontFamily: RACING,
                  fontSize: "1rem",
                  color: "#fff",
                  cursor: tensFriend && unitsFriend ? "pointer" : "not-allowed",
                }}
              >
                Check ✓
              </button>
              <button
                onClick={next}
                style={{
                  background: "transparent",
                  border: `1.5px dashed ${bg}55`,
                  borderRadius: 12,
                  padding: "11px 14px",
                  fontFamily: OUTFIT,
                  fontWeight: 600,
                  fontSize: "0.78rem",
                  color: `${bg}99`,
                  cursor: "pointer",
                }}
              >
                Skip →
              </button>
            </>
          )}
        </div>
      </div>
    );
  }

  // ── Base 9 / 10: single-input layout ───────────────────────────────────────
  return (
    <div
      style={{
        background: "#fff",
        border: `3px solid ${borderCol}`,
        borderRadius: 20,
        padding: "14px 16px 12px",
        transition: "border-color 0.25s ease",
        width: "100%",
      }}
    >
      {/* Question */}
      <div
        style={{
          background: feedback === "correct" ? "#f0fdf4" : feedback === "wrong" ? "#fef2f2" : light,
          borderRadius: 14,
          padding: "12px 10px 10px",
          textAlign: "center",
          transition: "background 0.3s ease",
          marginBottom: 12,
        }}
      >
        <p
          style={{
            fontFamily: OUTFIT,
            fontWeight: 600,
            fontSize: "0.78rem",
            color: dark,
            margin: "0 0 2px",
          }}
        >
          Friend of
        </p>
        <div style={{ fontFamily: RACING, fontSize: "2.8rem", color: bg, lineHeight: 1 }}>
          {pair.a}
        </div>
        <div
          style={{
            fontFamily: OUTFIT,
            fontWeight: 700,
            fontSize: "0.72rem",
            color: `${bg}99`,
            marginTop: 2,
          }}
        >
          {pair.a} + ? = {base}
        </div>
      </div>

      {/* Input or feedback */}
      {!feedback ? (
        <input
          type="text"
          inputMode="numeric"
          maxLength={3}
          pattern="[0-9]*"
          value={singleAnswer}
          onChange={(e) => setSingleAnswer(e.target.value)}
          onKeyPress={(e) => e.key === "Enter" && singleAnswer && handleSubmitForOthers()}
          placeholder="?"
          style={{
            display: "block",
            width: "100%",
            maxWidth: 120,
            margin: "0 auto 12px",
            padding: "10px",
            textAlign: "center",
            fontSize: "1.8rem",
            fontFamily: RACING,
            border: `3px solid ${bg}`,
            borderRadius: 14,
            outline: "none",
            color: bg,
          }}
        />
      ) : (
        <div
          style={{
            padding: "8px 10px",
            borderRadius: 12,
            marginBottom: 12,
            textAlign: "center",
            background: feedback === "correct" ? "#f0fdf4" : "#fef2f2",
            fontFamily: OUTFIT,
            fontWeight: 800,
            fontSize: "0.85rem",
            color: feedback === "correct" ? "#16a34a" : "#dc2626",
          }}
        >
          {feedback === "correct"
            ? `✅ ${pair.a} + ${pair.b} = ${base}`
            : `❌ It's ${pair.b}! (${pair.a} + ${pair.b} = ${base})`}
        </div>
      )}

      {/* Buttons */}
      {!feedback && (
        <div style={{ display: "flex", gap: 8 }}>
          <button
            onClick={handleSubmitForOthers}
            disabled={!singleAnswer}
            style={{
              flex: 1,
              background: singleAnswer ? bg : "#ccc",
              border: "none",
              borderRadius: 12,
              padding: "11px",
              fontFamily: RACING,
              fontSize: "1rem",
              color: "#fff",
              cursor: singleAnswer ? "pointer" : "not-allowed",
            }}
          >
            Check ✓
          </button>
          <button
            onClick={next}
            style={{
              background: "transparent",
              border: `1.5px dashed ${bg}55`,
              borderRadius: 12,
              padding: "11px 14px",
              fontFamily: OUTFIT,
              fontWeight: 600,
              fontSize: "0.78rem",
              color: `${bg}99`,
              cursor: "pointer",
            }}
          >
            Skip →
          </button>
        </div>
      )}
    </div>
  );
}

// ─── FriendsPractice — full single-screen layout ──────────────────────────────
function FriendsPractice({
  bg,
  light,
  dark,
  onStartChallenge,
}: {
  bg: string;
  light: string;
  dark: string;
  onStartChallenge: () => void;
}) {
  const bases: FriendBase[] = [9, 10, 100];

  const [activeTab, setActiveTab] = useState<FriendBase>(9);
  const [tabScores, setTabScores] = useState<Record<FriendBase, TabScore>>({
    9: { score: 0, total: 0 },
    10: { score: 0, total: 0 },
    100: { score: 0, total: 0 },
  });

  const handleScore = (base: FriendBase, correct: boolean) => {
    setTabScores((prev) => ({
      ...prev,
      [base]: {
        score: prev[base].score + (correct ? 1 : 0),
        total: prev[base].total + 1,
      },
    }));
  };

  return (
    // Use flex-col with height:100% so children can fill the available space
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: 10,
        width: "100%",
        maxWidth: 420,
        margin: "0 auto",
      }}
    >
      {/* Reference strip — compact single-line */}
      <div
        style={{
          background: "#fff",
          borderRadius: 14,
          overflow: "hidden",
          border: `2px solid ${bg}33`,
          boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
          flexShrink: 0,
        }}
      >
        <div
          style={{
            background: bg,
            padding: "5px 12px",
            textAlign: "center",
            fontFamily: OUTFIT,
            fontWeight: 700,
            fontSize: "0.72rem",
            color: "#fff",
          }}
        >
          📖 Friends Reference
        </div>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr 1fr",
            borderTop: `1px solid ${bg}22`,
          }}
        >
          {[
            { base: 9, pairs: "1+8, 2+7, 3+6, 4+5" },
            { base: 10, pairs: "1+9, 2+8, 3+7, 4+6, 5+5" },
            { base: 100, pairs: "37+63, 60+40" },
          ].map(({ base, pairs }) => (
            <div
              key={base}
              style={{ padding: "6px 4px", textAlign: "center", borderRight: `1px solid ${bg}11` }}
            >
              <div style={{ fontFamily: RACING, color: bg, fontSize: "0.9rem" }}>of {base}</div>
              <div
                style={{
                  fontFamily: OUTFIT,
                  fontSize: "0.6rem",
                  fontWeight: 600,
                  color: dark,
                  marginTop: 1,
                  lineHeight: 1.3,
                }}
              >
                {pairs}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Tab pill bar */}
      <div
        style={{
          display: "flex",
          gap: 5,
          background: light,
          borderRadius: 99,
          padding: 4,
          boxShadow: `0 2px 8px ${bg}22`,
          flexShrink: 0,
        }}
      >
        {bases.map((base) => {
          const sc = tabScores[base];
          const isActive = activeTab === base;
          return (
            <button
              key={base}
              onClick={() => setActiveTab(base)}
              style={{
                flex: 1,
                border: "none",
                cursor: "pointer",
                fontFamily: OUTFIT,
                fontWeight: 700,
                fontSize: "0.82rem",
                padding: "8px 4px 5px",
                borderRadius: 99,
                transition: "all 0.22s ease",
                background: isActive ? bg : "transparent",
                color: isActive ? "#fff" : dark,
                boxShadow: isActive ? `0 4px 14px ${bg}44` : "none",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: 1,
              }}
            >
              <span>of {base}</span>
              <span
                style={{
                  fontFamily: RACING,
                  fontSize: "0.65rem",
                  color: isActive ? "#fff99c" : `${dark}88`,
                  lineHeight: 1,
                }}
              >
                {sc.score}/{sc.total}
              </span>
            </button>
          );
        })}
      </div>

      {/* Active panel — flex-1 so it takes remaining height */}
      <div style={{ flex: 1, minHeight: 0 }}>
        <FriendPanel
          key={activeTab}
          base={activeTab}
          score={tabScores[activeTab].score}
          total={tabScores[activeTab].total}
          onScore={(correct) => handleScore(activeTab, correct)}
          bg={bg}
          light={light}
          dark={dark}
        />
      </div>

      {/* CTA */}
      <button
        onClick={onStartChallenge}
        style={{
          width: "100%",
          borderRadius: 20,
          padding: "13px",
          background: bg,
          color: "#fff",
          fontFamily: RACING,
          fontSize: "1.15rem",
          border: "none",
          cursor: "pointer",
          boxShadow: `0 6px 20px ${bg}44`,
          flexShrink: 0,
        }}
      >
        ⚡ Race
      </button>
    </div>
  );
}

function useCloudImage() {
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);
  return isMobile ? CLOUDS_MOBILE_IMG : CLOUDS_IMG;
}

// ─── Main Component ───────────────────────────────────────────────────────────
export default function SpeedMathsPage() {
  const [gameState, setGameState] = useState<GameState>("splash");
  const [challenge, setChallenge] = useState<Challenge>("Addition");
  const [answerMode, setAnswerMode] = useState<AnswerMode>("Choose Option");
  const [timeMode, setTimeMode] = useState<TimeMode>("timed");
  const [secondsPerQ, setSecondsPerQ] = useState(10);
  const [question, setQuestion] = useState<Question | null>(null);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [feedback, setFeedback] = useState<"correct" | "incorrect" | null>(null);
  // What the player picked or typed for the current question (null = time ran out).
  const [lastPick, setLastPick] = useState<string | null>(null);
  const [showHow, setShowHow] = useState(false);
  const [bestStreak, setBestStreak] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);
  const [answeredCount, setAnsweredCount] = useState(0);
  const [roundTotal, setRoundTotal] = useState(10);
  // Exam Mode and personal bests
  const [examMode, setExamMode] = useState(false);
  const [examMinutes, setExamMinutes] = useState<number>(5);
  const [examNegative, setExamNegative] = useState(false);
  const [qChallenge, setQChallenge] = useState<Challenge>("Addition"); // skill of the current exam question
  const [wrongCount, setWrongCount] = useState(0);
  const [skippedCount, setSkippedCount] = useState(0);
  const [examMarks, setExamMarks] = useState(0);
  const [pbNote, setPbNote] = useState<string | null>(null);
  const [typedAnswer, setTypedAnswer] = useState("");
  const [timeLeft, setTimeLeft] = useState(0);
  const [questionsLeft, setQuestionsLeft] = useState(10);
  const [totalTime, setTotalTime] = useState(0);
  const [halfPracticeNum, setHalfPracticeNum] = useState(() => generateHalfPracticeNum());
  const [half3StepKey, setHalf3StepKey] = useState(0);
  const [squareNum, setSquareNum] = useState(() => rand(26, 50));
  const [squareViewKey, setSquareViewKey] = useState(0);
  const [minA, setMinA] = useState(2);
  const [maxA, setMaxA] = useState(12);
  // Table Challenge uses the chosen range; Quick Mix always uses the 2–12 tables.
  const [multUsesRange, setMultUsesRange] = useState(false);
  const [heroVisible, setHeroVisible] = useState(false);
  const [cardsVisible, setCardsVisible] = useState(false);
  const [decoVisible, setDecoVisible] = useState(false);
  const [cloudsVisible, setCloudsVisible] = useState(false);
  const [rocketVisible, setRocketVisible] = useState(false);

  // ── Round engine ──────────────────────────────────────────────────────────
  // Everything the timers read lives in refs, so a timer callback can never act on
  // stale React state (this caused the frozen timer after a 10 Questions game).
  const roundRef = useRef({
    challenge: "Addition" as Challenge,
    timeMode: "timed" as TimeMode,
    secondsPerQ: 10,
    minA: 2,
    maxA: 12,
    useRange: false,
    total: 10,
    left: 10,
    score: 0,
    streak: 0,
    best: 0,
    correct: 0,
    answered: 0,
    question: null as Question | null,
    exam: null as null | { durationMs: number; negative: boolean; wrong: number; skipped: number },
    bestKey: "",
    bestKind: "race" as BestKind,
  });
  const phaseRef = useRef<"idle" | "answering" | "feedback">("idle");
  // Clock for the current question. It only runs while the player can answer:
  // it stops during feedback and while the browser tab is hidden.
  const qAccumMsRef = useRef(0);
  const qStartRef = useRef<number | null>(null);
  const activeMsRef = useRef(0); // answering time across the round
  const tickRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const advanceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const clearRoundTimers = useCallback(() => {
    if (tickRef.current) {
      clearInterval(tickRef.current);
      tickRef.current = null;
    }
    if (advanceRef.current) {
      clearTimeout(advanceRef.current);
      advanceRef.current = null;
    }
  }, []);

  const stopTimers = useCallback(() => {
    clearRoundTimers();
    phaseRef.current = "idle";
    qStartRef.current = null;
  }, [clearRoundTimers]);

  const cloudImage = useCloudImage();

  // Keep the Feedback tab off active play screens (it overlapped answers and keys);
  // it still shows on the menu, mode/settings screens and results.
  useHideFeedbackTab(PLAY_STATES.has(gameState));

  useEffect(() => {
    const t = setTimeout(() => setGameState("menu"), 2200);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    if (gameState === "menu") {
      setHeroVisible(false);
      setCardsVisible(false);
      setDecoVisible(false);
      setCloudsVisible(false);
      setRocketVisible(false);
      const t1 = setTimeout(() => setHeroVisible(true), 100);
      const t2 = setTimeout(() => setRocketVisible(true), 200);
      const t3 = setTimeout(() => setCardsVisible(true), 320);
      const t4 = setTimeout(() => setDecoVisible(true), 560);
      const t5 = setTimeout(() => setCloudsVisible(true), 700);
      return () => {
        clearTimeout(t1);
        clearTimeout(t2);
        clearTimeout(t3);
        clearTimeout(t4);
        clearTimeout(t5);
      };
    }
  }, [gameState]);

  // These engine functions read only refs and stable setters, so it is safe for a
  // timer to hold on to an older copy of them.
  const pauseClock = () => {
    if (qStartRef.current !== null) {
      qAccumMsRef.current += performance.now() - qStartRef.current;
      qStartRef.current = null;
    }
  };
  const resumeClock = () => {
    if (qStartRef.current === null && phaseRef.current === "answering" && !document.hidden) {
      qStartRef.current = performance.now();
    }
  };
  const questionElapsedMs = () =>
    qAccumMsRef.current + (qStartRef.current !== null ? performance.now() - qStartRef.current : 0);

  const makeQuestion = () => {
    const r = roundRef.current;
    if (r.exam) {
      const skill = EXAM_SKILLS[Math.floor(Math.random() * EXAM_SKILLS.length)];
      setQChallenge(skill);
      return generateQuestion(skill);
    }
    return r.challenge === "Multiplication" && r.useRange
      ? generateMultiplicationRangeQuestion(r.minA, r.maxA)
      : generateQuestion(r.challenge);
  };

  const showQuestion = () => {
    const r = roundRef.current;
    const q = makeQuestion();
    r.question = q;
    setQuestion(q);
    setTypedAnswer("");
    setLastPick(null);
    setShowHow(false);
    setFeedback(null);
    if (r.timeMode === "timed") setTimeLeft(r.secondsPerQ);
    qAccumMsRef.current = 0;
    phaseRef.current = "answering";
    qStartRef.current = document.hidden ? null : performance.now();
  };

  const finishRound = () => {
    stopTimers();
    const r = roundRef.current;
    const timeS = activeMsRef.current / 1000;
    setTotalTime(timeS);
    const accuracy = r.answered > 0 ? r.correct / r.answered : 0;
    let roundScore = r.score;
    if (r.exam) {
      roundScore = r.correct - (r.exam.negative ? NEGATIVE_MARK * r.exam.wrong : 0);
      setExamMarks(roundScore);
    }
    // Save the personal best on this device and say how the round compares.
    const summary = {
      score: roundScore,
      timeS,
      accuracy,
      streak: r.best,
      timeCounts: r.bestKind === "race" && accuracy >= RACE_ACCURACY_FOR_BEST,
    };
    const prev = saveRound(r.bestKey, summary);
    setPbNote(personalBestNote(r.bestKind, prev, summary));
    setGameState("result");
  };

  // Called by the Next button after a wrong answer, and automatically after a right one.
  const goToNextQuestion = () => {
    if (advanceRef.current) {
      clearTimeout(advanceRef.current);
      advanceRef.current = null;
    }
    if (phaseRef.current !== "feedback") return;
    const r = roundRef.current;
    if (r.left <= 0 || (r.exam && activeMsRef.current >= r.exam.durationMs)) finishRound();
    else showQuestion();
  };

  const settleQuestion = (correct: boolean, pick: string | null) => {
    const r = roundRef.current;
    if (phaseRef.current !== "answering" || !r.question) return;
    pauseClock();
    phaseRef.current = "feedback";
    const ms = qAccumMsRef.current;
    activeMsRef.current += ms;

    r.answered++;
    r.left--;
    if (correct) {
      // Faster answers earn more: up to +10 for speed, plus a small streak bonus.
      const limitS = r.timeMode === "timed" ? r.secondsPerQ : SPEED_REFERENCE_S;
      const speedBonus =
        r.timeMode === "practice"
          ? 0
          : Math.max(0, Math.min(10, Math.round(10 * (1 - ms / 1000 / limitS))));
      r.score += 10 + speedBonus + Math.min(r.streak, 5) * 2;
      r.streak++;
      r.best = Math.max(r.best, r.streak);
      r.correct++;
    } else {
      r.streak = 0;
      if (r.exam) {
        r.exam.wrong++;
        setWrongCount(r.exam.wrong);
      }
    }

    setScore(r.score);
    setStreak(r.streak);
    setBestStreak(r.best);
    setCorrectCount(r.correct);
    setAnsweredCount(r.answered);
    setQuestionsLeft(r.left);
    setTotalTime(Math.floor(activeMsRef.current / 1000));
    setLastPick(pick);
    setFeedback(correct ? "correct" : "incorrect");

    // Right answers move on by themselves; wrong ones wait for the player to tap Next.
    if (correct) {
      advanceRef.current = setTimeout(() => {
        advanceRef.current = null;
        goToNextQuestion();
      }, CORRECT_PAUSE_MS);
    }
  };

  const tick = () => {
    if (phaseRef.current !== "answering") return;
    const r = roundRef.current;
    const ms = questionElapsedMs();
    if (r.exam) {
      // One countdown for the whole paper; it pauses during feedback like every clock here.
      const remaining = r.exam.durationMs - (activeMsRef.current + ms);
      setTimeLeft(Math.max(0, Math.ceil(remaining / 1000)));
      if (remaining <= 0) {
        pauseClock();
        activeMsRef.current = r.exam.durationMs;
        finishRound();
      }
      return;
    }
    if (r.timeMode === "timed") {
      setTimeLeft(Math.max(0, Math.ceil(r.secondsPerQ - ms / 1000)));
      if (ms >= r.secondsPerQ * 1000) settleQuestion(false, null);
    } else if (r.timeMode === "fixed-questions") {
      setTotalTime(Math.floor((activeMsRef.current + ms) / 1000));
    }
  };

  // Each game and setting keeps its own personal best.
  const bestKeyFor = () => {
    const variant =
      challenge === "Multiplication" ? (multUsesRange ? `:tables${minA}-${maxA}` : ":mix") : "";
    return `${challenge}${variant}:${timeMode}${timeMode === "timed" ? `:${secondsPerQ}s` : ""}`;
  };

  const beginGame = () => {
    stopTimers();
    const total = ROUND_SIZE[timeMode];
    roundRef.current = {
      challenge,
      timeMode,
      secondsPerQ,
      minA,
      maxA,
      useRange: challenge === "Multiplication" && multUsesRange,
      total,
      left: total,
      score: 0,
      streak: 0,
      best: 0,
      correct: 0,
      answered: 0,
      question: null,
      exam: null,
      bestKey: bestKeyFor(),
      bestKind: BEST_KIND[timeMode],
    };
    activeMsRef.current = 0;
    setExamMode(false);
    setWrongCount(0);
    setSkippedCount(0);
    setPbNote(null);
    setScore(0);
    setStreak(0);
    setBestStreak(0);
    setCorrectCount(0);
    setAnsweredCount(0);
    setRoundTotal(total);
    setQuestionsLeft(total);
    setTotalTime(0);
    setGameState("playing");
    showQuestion();
    tickRef.current = setInterval(tick, 200);
  };

  const beginExam = () => {
    stopTimers();
    const durationMs = examMinutes * 60_000;
    roundRef.current = {
      challenge: "Addition",
      timeMode: "fixed-questions",
      secondsPerQ,
      minA,
      maxA,
      useRange: false,
      total: Infinity,
      left: Infinity,
      score: 0,
      streak: 0,
      best: 0,
      correct: 0,
      answered: 0,
      question: null,
      exam: { durationMs, negative: examNegative, wrong: 0, skipped: 0 },
      bestKey: examBestKey(examMinutes, examNegative),
      bestKind: "exam",
    };
    activeMsRef.current = 0;
    setExamMode(true);
    setAnswerMode("Choose Option"); // exam papers are multiple choice
    setWrongCount(0);
    setSkippedCount(0);
    setExamMarks(0);
    setPbNote(null);
    setScore(0);
    setStreak(0);
    setBestStreak(0);
    setCorrectCount(0);
    setAnsweredCount(0);
    setRoundTotal(0);
    setQuestionsLeft(Infinity);
    setTimeLeft(durationMs / 1000);
    setTotalTime(0);
    setGameState("playing");
    showQuestion();
    tickRef.current = setInterval(tick, 200);
  };

  // Exam Mode only: move on without answering. Skips cost nothing, even with negative marking.
  const skipQuestion = () => {
    const r = roundRef.current;
    if (phaseRef.current !== "answering" || !r.exam) return;
    pauseClock();
    activeMsRef.current += qAccumMsRef.current;
    r.exam.skipped++;
    setSkippedCount(r.exam.skipped);
    phaseRef.current = "feedback";
    goToNextQuestion();
  };

  const handleAnswer = (chosen: number | string) => {
    const q = roundRef.current.question;
    if (phaseRef.current !== "answering" || !q) return;
    let userAns: number;
    if (typeof chosen === "number") {
      userAns = chosen;
    } else {
      const text = chosen.trim();
      // Ignore Enter on an empty or unfinished answer instead of marking it wrong.
      if (!/^\d+(\.\d+)?$/.test(text)) return;
      userAns = Number(text);
    }
    settleQuestion(Math.abs(userAns - q.answer) < 0.01, String(chosen));
  };

  // Pause the question clock while the browser tab is hidden.
  useEffect(() => {
    const onVisibility = () => {
      if (document.hidden) pauseClock();
      else resumeClock();
    };
    document.addEventListener("visibilitychange", onVisibility);
    return () => document.removeEventListener("visibilitychange", onVisibility);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    return () => stopTimers();
  }, [stopTimers]);

  const gameBg = "linear-gradient(160deg,#f0fdf9 0%,#fff 60%,#e8f9f8 100%)";
  const CHALLENGES = Object.keys(CHALLENGE_COLORS) as Challenge[];

  // ─── SPLASH ───────────────────────────────────────────────────────────────
  if (gameState === "splash")
    return (
      <div
        className="flex min-h-screen flex-col items-center justify-center"
        style={{
          background: `linear-gradient(170deg,${BRAND_TEAL_DK} 0%,${BRAND_TEAL} 60%,${BRAND_TEAL_DK} 100%)`,
        }}
      >
        <style dangerouslySetInnerHTML={{ __html: GLOBAL_STYLES }} />
        <div style={{ animation: "rocketBob 2s ease-in-out infinite", width: 120 }}>
          <img
            src={ROCKET_IMG}
            alt="Rocket"
            style={{
              width: "100%",
              height: "auto",
              filter: "drop-shadow(0 8px 24px rgba(0,0,0,0.35))",
            }}
          />
        </div>
        <p
          className="mt-5 text-white"
          style={{
            fontFamily: RACING,
            fontSize: "clamp(2.5rem,8vw,4rem)",
            textShadow: "0 4px 20px rgba(0,0,0,0.3)",
            animation: "fadeUp 0.7s ease 0.3s both",
          }}
        >
          Logicology
        </p>
        <p
          className="mt-1 text-xl text-white/75"
          style={{ fontFamily: RACING, animation: "fadeUp 0.7s ease 0.5s both" }}
        >
          Speed Maths ⚡
        </p>
        <p
          className="mt-4 text-sm text-white/45"
          style={{ fontFamily: OUTFIT, animation: "fadeUp 0.7s ease 0.7s both" }}
        >
          Loading your brain workout…
        </p>
      </div>
    );

  // ─── MENU ─────────────────────────────────────────────────────────────────
  if (gameState === "menu")
    return (
      <>
        <NavBar />
        <div className="flex min-h-screen flex-col overflow-hidden" style={{ fontFamily: OUTFIT }}>
          <style dangerouslySetInnerHTML={{ __html: GLOBAL_STYLES }} />

          {/* ── DESKTOP ── */}
          <section
            className="relative hidden flex-col items-center overflow-hidden bg-[#1b4552] md:flex"
            style={{
              minHeight: "88vh",
              backgroundImage: `linear-gradient(rgba(255,255,255,0.045) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,0.045) 1px,transparent 1px),linear-gradient(rgba(255,255,255,0.018) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,0.018) 1px,transparent 1px)`,
              backgroundSize: `80px 80px,80px 80px,20px 20px,20px 20px`,
              backgroundPosition: `-1px -1px,-1px -1px,-1px -1px,-1px -1px`,
            }}
          >
            {(
              [
                { t: "4²", s: { top: "9%", left: "5%", fontSize: 30 } },
                { t: "√", s: { top: "19%", left: "11%", fontSize: 38 } },
                { t: "1", s: { top: "53%", left: "4%", fontSize: 52 } },
                { t: "Z", s: { top: "69%", left: "8%", fontSize: 26 } },
                { t: "α²", s: { top: "8%", right: "7%", fontSize: 28 } },
                { t: "4²", s: { top: "23%", right: "4%", fontSize: 34 } },
                { t: "⬡", s: { top: "40%", left: "2%", fontSize: 26 } },
                { t: "⬡", s: { top: "14%", right: "19%", fontSize: 20 } },
                { t: "≈", s: { top: "59%", right: "5%", fontSize: 30 } },
              ] as { t: string; s: React.CSSProperties }[]
            ).map((sym, i) => (
              <span
                key={i}
                aria-hidden
                className="pointer-events-none absolute select-none font-bold text-white"
                style={{ ...sym.s, opacity: 0.18 }}
              >
                {sym.t}
              </span>
            ))}
            <div
              className="pointer-events-none absolute right-4 z-20 md:right-10"
              style={{
                top: "clamp(80px,15vh,120px)",
                opacity: rocketVisible ? 1 : 0,
                animation: rocketVisible
                  ? "rocketFlyUp 1.2s cubic-bezier(0.34,1.2,0.55,1) forwards, rocketHover 3s ease-in-out 1.2s infinite"
                  : "none",
                width: "clamp(130px,18vw,240px)",
              }}
            >
              <img
                src={ROCKET_IMG}
                alt="Rocket"
                style={{
                  width: "100%",
                  height: "auto",
                  filter: "drop-shadow(0 12px 28px rgba(0,0,0,0.38))",
                }}
              />
            </div>
            <div
              className="relative z-10 px-6 pt-14 text-center md:pt-16"
              style={{
                opacity: heroVisible ? 1 : 0,
                transform: heroVisible ? "translateY(0)" : "translateY(-28px)",
                transition: "opacity 0.75s ease 0.1s,transform 0.75s ease 0.1s",
              }}
            >
              <p
                className="mb-2 leading-none text-white"
                style={{
                  fontFamily: RACING,
                  fontSize: "clamp(2.8rem,7.5vw,5.2rem)",
                  textShadow: "0 4px 18px rgba(0,0,0,0.28)",
                }}
              >
                Speed Maths
              </p>
              <p
                className="text-lg text-white/80 md:text-xl"
                style={{ fontFamily: OUTFIT, fontWeight: 600 }}
              >
                Pick a skill. Beat your time.
              </p>
            </div>
            <div className="relative z-30 mx-auto mt-10 w-full max-w-3xl px-4 pb-6 md:mt-12 md:px-8 min-[1180px]:max-w-6xl">
              {/* 3×2 on tablets so labels like "Multiplication" aren't cut off; one row from 1180px */}
              <div className="grid grid-cols-3 gap-5 min-[1180px]:grid-cols-6">
                {CHALLENGES.map((ch, i) => (
                  <MenuChallengeCard
                    key={ch}
                    ch={ch}
                    index={i}
                    visible={cardsVisible}
                    onClick={() => {
                      setChallenge(ch);
                      setAnswerMode("Choose Option");
                      setGameState("mode-select");
                    }}
                  />
                ))}
              </div>
              <div className="mt-6">
                <ExamModeButton visible={cardsVisible} onClick={() => setGameState("exam-setup")} />
              </div>
            </div>
            <div
              className="pointer-events-none absolute bottom-0 left-0 z-10 w-full select-none"
              style={{
                height: "90vh",
                maxHeight: "90%",
                opacity: cloudsVisible ? 1 : 0,
                transform: cloudsVisible ? "translateY(0)" : "translateY(80px)",
                transition: "opacity 0.9s ease 0.7s,transform 0.9s cubic-bezier(.22,1,.36,1) 0.7s",
              }}
            >
              <img
                src={CLOUDS_IMG}
                alt=""
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                  objectPosition: "center bottom",
                  display: "block",
                }}
              />
            </div>
            <div className="pointer-events-none absolute bottom-0 left-0 right-0 z-20 flex select-none items-end justify-between px-6 pb-4 md:px-16">
              {[
                { src: "PENCIL@2x.png", h: 100, rot: "rotate(-20deg)" },
                { src: "SCALE@2x.png", h: 80, rot: "rotate(-8deg)" },
                { src: "BOOKS@2x.png", h: 100, rot: "" },
                { src: "CALCULATOR@2x.png", h: 90, rot: "" },
              ].map(({ src, h, rot }, idx) => (
                <div
                  key={src}
                  style={{
                    opacity: decoVisible ? 1 : 0,
                    transform: decoVisible ? rot || "translateY(0)" : `${rot} translateY(60px)`,
                    transition: `opacity 0.6s ease ${0.9 + idx * 0.1}s,transform 0.6s ease ${0.9 + idx * 0.1}s`,
                  }}
                >
                  <img
                    src={`/Images/speed-maths/SPEED MATHS WEBPAGE IMAGES/PNG RESOURCES/${src}`}
                    alt=""
                    style={{
                      width: "auto",
                      height: `${h}px`,
                      objectFit: "contain",
                      filter: "drop-shadow(0 4px 8px rgba(0,0,0,0.2))",
                    }}
                  />
                </div>
              ))}
            </div>
          </section>

          {/* ── MOBILE ── */}
          <section
            className="relative flex flex-col overflow-hidden bg-[#1b4552] md:hidden"
            style={{
              // min-height (not a fixed height) so the page scrolls when the tiles
              // are taller than the screen — short and landscape phones.
              minHeight: "100svh",
              backgroundImage: `linear-gradient(rgba(255,255,255,0.045) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,0.045) 1px,transparent 1px)`,
              backgroundSize: `60px 60px,60px 60px`,
            }}
          >
            {(
              [
                { t: "4²", s: { top: "6%", left: "4%", fontSize: 22 } },
                { t: "√", s: { top: "15%", left: "9%", fontSize: 28 } },
                { t: "α²", s: { top: "5%", right: "22%", fontSize: 20 } },
                { t: "≈", s: { top: "45%", right: "3%", fontSize: 22 } },
              ] as { t: string; s: React.CSSProperties }[]
            ).map((sym, i) => (
              <span
                key={i}
                aria-hidden
                className="pointer-events-none absolute select-none font-bold text-white"
                style={{ ...sym.s, opacity: 0.18 }}
              >
                {sym.t}
              </span>
            ))}
            <div
              className="pointer-events-none absolute z-20"
              style={{
                top: "8%",
                right: "4%",
                opacity: rocketVisible ? 1 : 0,
                animation: rocketVisible
                  ? "rocketFlyUp 1.2s cubic-bezier(0.34,1.2,0.55,1) forwards, rocketHover 3s ease-in-out 1.2s infinite"
                  : "none",
                width: "18vw",
                maxWidth: 80,
              }}
            >
              <img
                src={ROCKET_IMG}
                alt="Rocket"
                style={{
                  width: "100%",
                  height: "auto",
                  filter: "drop-shadow(0 8px 20px rgba(0,0,0,0.38))",
                }}
              />
            </div>
            <div
              className="relative z-10 flex-shrink-0 px-4 pt-6 text-center"
              style={{
                opacity: heroVisible ? 1 : 0,
                transform: heroVisible ? "translateY(0)" : "translateY(-20px)",
                transition: "opacity 0.75s ease 0.1s,transform 0.75s ease 0.1s",
              }}
            >
              <p
                className="mb-0.5 leading-none text-white"
                style={{
                  fontFamily: RACING,
                  fontSize: "clamp(1.9rem,7vw,2.6rem)",
                  textShadow: "0 4px 18px rgba(0,0,0,0.28)",
                }}
              >
                Speed Maths
              </p>
              <p className="text-sm text-white/75" style={{ fontFamily: OUTFIT, fontWeight: 600 }}>
                Pick a skill. Beat your time.
              </p>
            </div>
            {/* Landscape phones: all six tiles in a three-column grid */}
            <div className="sm-menu-grid relative z-30 mx-auto w-full max-w-[480px] grid-cols-3 gap-3 px-3 pb-6 pt-3">
              {CHALLENGES.map((ch, i) => (
                <MenuChallengeCard
                  key={ch}
                  ch={ch}
                  index={i}
                  visible={cardsVisible}
                  compact
                  onClick={() => {
                    setChallenge(ch);
                      setAnswerMode("Choose Option");
                    setGameState("mode-select");
                  }}
                />
              ))}
            </div>
            <div className="sm-menu-cols relative z-30 flex-1 items-start justify-center px-3 pb-6 pt-2">
              <div className="flex w-[44%] flex-col gap-2" style={{ marginTop: "2%" }}>
                {([CHALLENGES[0], CHALLENGES[2], CHALLENGES[3]] as Challenge[]).map((ch, i) => (
                  <MenuChallengeCard
                    key={ch}
                    ch={ch}
                    index={i}
                    visible={cardsVisible}
                    compact
                    onClick={() => {
                      setChallenge(ch);
                      setAnswerMode("Choose Option");
                      setGameState("mode-select");
                    }}
                  />
                ))}
              </div>
              <div className="w-[4%]" />
              <div className="flex w-[44%] flex-col gap-2" style={{ marginTop: "12%" }}>
                {([CHALLENGES[1], CHALLENGES[4], CHALLENGES[5]] as Challenge[]).map((ch, i) => (
                  <MenuChallengeCard
                    key={ch}
                    ch={ch}
                    index={i + 3}
                    visible={cardsVisible}
                    compact
                    onClick={() => {
                      setChallenge(ch);
                      setAnswerMode("Choose Option");
                      setGameState("mode-select");
                    }}
                  />
                ))}
              </div>
            </div>
            {/* Exam Mode — padded so it clears the pencil and calculator art */}
            <div className="relative z-30 px-4 pb-24 pt-2">
              <ExamModeButton compact visible={cardsVisible} onClick={() => setGameState("exam-setup")} />
            </div>
            <div
              className="pointer-events-none absolute bottom-0 left-0 z-10 w-full select-none"
              style={{
                height: "90%",
                opacity: cloudsVisible ? 1 : 0,
                transform: cloudsVisible ? "translateY(0)" : "translateY(60px)",
                transition: "opacity 0.9s ease 0.7s,transform 0.9s cubic-bezier(.22,1,.36,1) 0.7s",
              }}
            >
              <img
                src={CLOUDS_MOBILE_IMG}
                alt=""
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                  objectPosition: "center bottom",
                  display: "block",
                }}
              />
            </div>
            <div className="pointer-events-none absolute bottom-0 left-0 right-0 z-20 flex select-none items-end justify-between px-2 pb-1">
              <div
                style={{
                  opacity: decoVisible ? 1 : 0,
                  transform: decoVisible
                    ? "rotate(-20deg) translateY(0)"
                    : "rotate(-20deg) translateY(40px)",
                  transition: "opacity 0.6s ease 1.0s,transform 0.6s ease 1.0s",
                  transformOrigin: "bottom left",
                }}
              >
                <img
                  src="/Images/speed-maths/SPEED MATHS WEBPAGE IMAGES/PNG RESOURCES/PENCIL@2x.png"
                  alt="Pencil"
                  style={{
                    height: "80px",
                    width: "auto",
                    objectFit: "contain",
                    filter: "drop-shadow(0 4px 8px rgba(0,0,0,0.2))",
                  }}
                />
              </div>
              <div className="flex flex-col items-end">
                <div
                  style={{
                    opacity: decoVisible ? 1 : 0,
                    transform: decoVisible ? "translateY(0)" : "translateY(30px)",
                    transition: "opacity 0.6s ease 1.1s,transform 0.6s ease 1.1s",
                    fontFamily: RACING,
                    fontSize: "clamp(1.4rem,6vw,2rem)",
                    color: "#ffffff",
                    textShadow: "0 2px 8px rgba(0,0,0,0.4)",
                    marginBottom: "2px",
                    paddingRight: "6px",
                  }}
                >
                  96×7
                </div>
                <div
                  style={{
                    opacity: decoVisible ? 1 : 0,
                    transform: decoVisible ? "translateY(0)" : "translateY(40px)",
                    transition: "opacity 0.6s ease 1.2s,transform 0.6s ease 1.2s",
                  }}
                >
                  <img
                    src="/Images/speed-maths/SPEED MATHS WEBPAGE IMAGES/PNG RESOURCES/CALCULATOR@2x.png"
                    alt="Calculator"
                    style={{
                      height: "80px",
                      width: "auto",
                      objectFit: "contain",
                      filter: "drop-shadow(0 4px 8px rgba(0,0,0,0.2))",
                    }}
                  />
                </div>
              </div>
            </div>
          </section>
        </div>
      </>
    );

  // ─── EXAM SETUP ───────────────────────────────────────────────────────────
  if (gameState === "exam-setup") {
    const { bg, light, dark } = EXAM_COLORS;
    const best = bestSummary("exam", readBest(examBestKey(examMinutes, examNegative)));
    const choice = (on: boolean, label: string, sub: string, onClick: () => void) => (
      <button
        key={label}
        type="button"
        onClick={onClick}
        aria-pressed={on}
        className="sm-tap rounded-2xl px-2 py-2 transition"
        style={{ background: on ? bg : light, color: on ? "#fff" : bg, border: `2px solid ${bg}` }}
      >
        <span className="block" style={{ fontFamily: RACING, fontSize: "1.05rem" }}>
          {label}
        </span>
        <span className="block text-xs" style={{ fontFamily: OUTFIT, fontWeight: 600 }}>
          {sub}
        </span>
      </button>
    );
    return (
      <div
        className="flex min-h-screen flex-col items-center px-4 pb-10 pt-6"
        style={{ background: gameBg, fontFamily: OUTFIT }}
      >
        <style dangerouslySetInnerHTML={{ __html: GLOBAL_STYLES }} />
        <Stars count={6} />
        <div className="mb-2 flex w-full max-w-sm justify-start">
          <button
            className="sm-tap"
            onClick={() => setGameState("menu")}
            style={{ color: dark, fontFamily: RACING, fontSize: "1.1rem", background: "none", border: "none" }}
          >
            ✕ Exit
          </button>
        </div>
        <div className="text-5xl" aria-hidden>
          🎓
        </div>
        <h2 className="mb-2 text-3xl" style={{ color: bg, fontFamily: RACING }}>
          Exam Mode
        </h2>
        <p
          className="mb-6 max-w-sm text-center"
          style={{ color: dark, fontFamily: OUTFIT, fontWeight: 600 }}
        >
          Mixed questions from all six skills against one clock, like a real paper. Skip any
          question you&apos;re unsure of.
        </p>
        <div
          className="mb-4 w-full max-w-sm rounded-3xl border-2 bg-white p-6 shadow-xl"
          style={{ borderColor: bg }}
        >
          <p className="mb-2 text-lg" style={{ color: BRAND_TEAL_DK, fontFamily: RACING }}>
            ⏱ How long?
          </p>
          <div className="mb-5 grid grid-cols-3 gap-2">
            {EXAM_MINUTES.map((m) =>
              choice(examMinutes === m, `${m} min`, m === 2 ? "Quick" : m === 5 ? "Standard" : "Full", () =>
                setExamMinutes(m)
              )
            )}
          </div>
          <p className="mb-2 text-lg" style={{ color: BRAND_TEAL_DK, fontFamily: RACING }}>
            Negative marking
          </p>
          <div className="grid grid-cols-2 gap-2">
            {choice(!examNegative, "Off", "Wrong answers score 0", () => setExamNegative(false))}
            {choice(examNegative, "−¼ per wrong", "Like many real papers", () => setExamNegative(true))}
          </div>
          <p className="mt-3 text-sm" style={{ color: dark, fontFamily: OUTFIT, fontWeight: 600 }}>
            {examNegative
              ? "Each right answer is 1 mark and each wrong answer loses ¼ mark, so skip if you are only guessing."
              : "Each right answer is 1 mark. Skips and wrong answers score 0."}
          </p>
        </div>
        {best && (
          <p className="mb-4 text-center text-sm" style={{ color: dark, fontFamily: OUTFIT, fontWeight: 700 }}>
            {best}
          </p>
        )}
        <button
          onClick={beginExam}
          className="w-full max-w-sm rounded-3xl py-5 shadow-xl hover:scale-105 active:scale-95"
          style={{ background: bg, color: "#fff", fontFamily: RACING, fontSize: "1.6rem" }}
        >
          🚀 Start the paper
        </button>
      </div>
    );
  }

  // ─── MODE-SELECT ──────────────────────────────────────────────────────────
  // Same three words in every game: Learn (guided method), Practise (no clock), Race.
  if (gameState === "mode-select") {
    const { bg, light, dark } = CHALLENGE_COLORS[challenge];
    const toSettings = () => setGameState("settings");
    const race = { word: "Race", sub: "Timed questions", onClick: toSettings, primary: true };
    const modes: { word: string; sub?: string; onClick: () => void; primary?: boolean }[] =
      challenge === "Half"
        ? [
            {
              word: "Learn",
              sub: "The 3-step method",
              onClick: () => {
                setHalfPracticeNum(generateHalfPracticeNum());
                setHalf3StepKey((k) => k + 1);
                setGameState("half-3step");
              },
            },
            { word: "Practise", sub: "Half of each digit", onClick: () => setGameState("half-table") },
            race,
          ]
        : challenge === "Squares"
          ? [
              {
                word: "Learn",
                sub: "Step by step",
                onClick: () => {
                  setSquareNum(rand(26, 50));
                  setSquareViewKey((k) => k + 1);
                  setGameState("square-step");
                },
              },
              race,
            ]
          : challenge === "Friends"
            ? [
                {
                  word: "Practise",
                  sub: "Make 9, 10 and 100",
                  onClick: () => setGameState("friends-practice"),
                },
                race,
              ]
            : challenge === "Multiplication"
              ? [
                  {
                    word: "Practise",
                    sub: "Pick your tables",
                    onClick: () => {
                      setMultUsesRange(true);
                      setGameState("mult-table-select");
                    },
                  },
                  {
                    word: "Race",
                    sub: "Tables 2 to 12",
                    primary: true,
                    onClick: () => {
                      setMultUsesRange(false);
                      toSettings();
                    },
                  },
                ]
              : (["Choose Option", "Type Answer"] as AnswerMode[]).map((m) => ({
                  word: ANSWER_LABEL[m],
                  primary: answerMode === m,
                  onClick: () => {
                    setAnswerMode(m);
                    toSettings();
                  },
                }));
    return (
      <div
        className="flex min-h-screen flex-col items-center px-4 pb-10 pt-8"
        style={{ background: gameBg, fontFamily: OUTFIT }}
      >
        <style dangerouslySetInnerHTML={{ __html: GLOBAL_STYLES }} />
        <Stars count={6} />
        <h2 className="mb-4 text-3xl" style={{ color: bg, fontFamily: RACING }}>
          {challenge}
        </h2>
        <GameIntro challenge={challenge} bg={bg} light={light} dark={dark} />
        {(challenge === "Addition" || challenge === "Subtraction") && (
          <p className="mb-3 text-lg" style={{ color: dark, fontFamily: RACING }}>
            Race
          </p>
        )}
        <div className="flex w-full max-w-sm flex-col gap-3">
          {modes.map((m) => (
            <ModeButton key={m.word + (m.sub ?? "")} {...m} bg={bg} light={light} />
          ))}
        </div>
      </div>
    );
  }

  // ─── SETTINGS ─────────────────────────────────────────────────────────────
  if (gameState === "settings") {
    const { bg, light, dark } = CHALLENGE_COLORS[challenge];
    const modeOption = (mode: TimeMode, label: string, sub: string) => (
      <button
        key={mode}
        type="button"
        onClick={() => setTimeMode(mode)}
        aria-pressed={timeMode === mode}
        className="rounded-2xl px-4 py-3 text-left transition"
        style={{
          background: timeMode === mode ? bg : light,
          color: timeMode === mode ? "#fff" : bg,
          border: `2px solid ${bg}`,
        }}
      >
        <span className="block" style={{ fontFamily: RACING, fontSize: "1.1rem" }}>
          {label}
        </span>
        <span className="block text-sm" style={{ fontFamily: OUTFIT, fontWeight: 600, opacity: 0.85 }}>
          {sub}
        </span>
      </button>
    );
    return (
      <div
        className="flex min-h-screen flex-col items-center px-4 pb-10 pt-8"
        style={{ background: gameBg, fontFamily: OUTFIT }}
      >
        <style dangerouslySetInnerHTML={{ __html: GLOBAL_STYLES }} />
        <Stars count={5} />
        <h2 className="mb-1 text-3xl" style={{ color: bg, fontFamily: RACING }}>
          {challenge}
        </h2>
        <p className="mb-6" style={{ color: dark, fontFamily: OUTFIT, fontWeight: 600 }}>
          {ANSWER_LABEL[answerMode]}
        </p>
        <div
          className="mb-6 w-full max-w-sm rounded-3xl border-2 bg-white p-6 shadow-xl"
          style={{ borderColor: bg }}
        >
          <p className="mb-3 text-lg" style={{ color: BRAND_TEAL_DK, fontFamily: RACING }}>
            ⏱ How do you want to play?
          </p>
          <div className="mb-4 flex flex-col gap-2">
            {modeOption("practice", "Practice with no clock", `${ROUND_SIZE.practice} questions, no timer`)}
            {modeOption("fixed-questions", "10-question race", "Beat your best time")}
            {modeOption("timed", "Time limit", `${ROUND_SIZE.timed} questions against the clock`)}
          </div>
          {timeMode === "timed" && (
            <>
              <p className="mb-2" style={{ color: dark, fontFamily: OUTFIT, fontWeight: 700 }}>
                Time limit
              </p>
              <div className="grid grid-cols-3 gap-2">
                {TIME_PRESETS.map((p) => (
                  <button
                    key={p.label}
                    type="button"
                    onClick={() => setSecondsPerQ(p.seconds)}
                    aria-pressed={secondsPerQ === p.seconds}
                    className="rounded-2xl px-2 py-2 transition"
                    style={{
                      background: secondsPerQ === p.seconds ? bg : light,
                      color: secondsPerQ === p.seconds ? "#fff" : bg,
                      border: `2px solid ${bg}`,
                    }}
                  >
                    <span className="block" style={{ fontFamily: RACING }}>
                      {p.label}
                    </span>
                    <span className="block text-xs" style={{ fontFamily: OUTFIT, fontWeight: 600 }}>
                      {p.seconds}s each
                    </span>
                  </button>
                ))}
              </div>
            </>
          )}
        </div>
        {(() => {
          const best = bestSummary(BEST_KIND[timeMode], readBest(bestKeyFor()));
          return best ? (
            <p
              className="mb-4 text-center text-sm"
              style={{ color: dark, fontFamily: OUTFIT, fontWeight: 700 }}
            >
              {best}
            </p>
          ) : null;
        })()}
        <button
          onClick={beginGame}
          className="w-full max-w-sm rounded-3xl py-5 shadow-xl hover:scale-105 active:scale-95"
          style={{ background: bg, color: "#fff", fontFamily: RACING, fontSize: "1.6rem" }}
        >
          🚀 Start!
        </button>
      </div>
    );
  }

  // ─── HALF TABLE ───────────────────────────────────────────────────────────
  if (gameState === "half-table") {
    const { bg, light, dark } = CHALLENGE_COLORS["Half"];
    return (
      <div
        className="flex min-h-screen flex-col items-center px-4 pb-10 pt-8"
        style={{ background: gameBg }}
      >
        <style dangerouslySetInnerHTML={{ __html: GLOBAL_STYLES }} />
        <Stars count={6} />
        <div className="mb-2 flex w-full max-w-sm justify-start">
          <button
            className="sm-tap"
            onClick={() => setGameState("mode-select")}
            style={{
              color: dark,
              fontFamily: RACING,
              fontSize: "1.1rem",
              background: "none",
              border: "none",
              cursor: "pointer",
            }}
          >
            ✕ Exit
          </button>
        </div>
        <div style={{ fontFamily: RACING, fontSize: "2.5rem", color: bg }}>½</div>
        <h2 className="mb-1 text-3xl" style={{ color: bg, fontFamily: RACING }}>
          Practise: half of each digit
        </h2>
        <p className="mb-6" style={{ color: dark, fontFamily: OUTFIT, fontWeight: 600 }}>
          Halve each digit and drop the remainder: half of 7 is 3.
        </p>
        <HalfTableQuiz
          bg={bg}
          light={light}
          dark={dark}
          onNext={() => {
            setHalfPracticeNum(generateHalfPracticeNum());
            setHalf3StepKey((k) => k + 1);
            setGameState("half-3step");
          }}
        />
      </div>
    );
  }

  // ─── HALF 3-STEP ──────────────────────────────────────────────────────────
  if (gameState === "half-3step") {
    const { bg, light, dark } = CHALLENGE_COLORS["Half"];
    return (
      <div
        className="flex min-h-screen flex-col items-center overflow-y-auto px-4 pb-10 pt-8"
        style={{ background: gameBg }}
      >
        <style dangerouslySetInnerHTML={{ __html: GLOBAL_STYLES }} />
        <Stars count={5} />
        <div className="mb-2 flex w-full max-w-sm justify-start">
          <button
            className="sm-tap"
            onClick={() => setGameState("mode-select")}
            style={{
              color: dark,
              fontFamily: RACING,
              fontSize: "1.1rem",
              background: "none",
              border: "none",
              cursor: "pointer",
            }}
          >
            ✕ Exit
          </button>
        </div>
        <h2 className="mb-1 text-3xl" style={{ color: bg, fontFamily: RACING }}>
          Learn: the 3-step method
        </h2>
        <p
          className="mb-6 text-center text-sm"
          style={{ color: dark, fontFamily: OUTFIT, fontWeight: 600 }}
        >
          Follow the steps to find half of the number below!
        </p>
        <Half3StepInteractive
          key={half3StepKey}
          practiceNum={halfPracticeNum}
          bg={bg}
          light={light}
          dark={dark}
          onComplete={() => setGameState("settings")}
          onNewNumber={() => {
            setHalfPracticeNum(generateHalfPracticeNum());
            setHalf3StepKey((k) => k + 1);
          }}
        />
        <div
          className="mt-5 w-full max-w-sm rounded-3xl border-2 bg-white p-4"
          style={{ borderColor: `${bg}33` }}
        >
          <p className="mb-2 text-center text-sm" style={{ color: bg, fontFamily: RACING }}>
            📖 Table Half Reference
          </p>
          <div className="grid grid-cols-5 gap-1 text-center text-xs">
            {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map((d) => (
              <div
                key={d}
                className="rounded-lg py-1"
                style={{ background: light, color: dark, fontFamily: RACING }}
              >
                {d}→{Math.floor(d / 2)}
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // ─── SQUARE STEP ──────────────────────────────────────────────────────────
  if (gameState === "square-step") {
    const { bg, light, dark } = CHALLENGE_COLORS["Squares"];
    const randInRange = (r: string) => {
      if (r === "26-50") return rand(26, 50);
      if (r === "51-75") return rand(51, 75);
      if (r === "76-100") return rand(76, 100);
      return rand(101, 125);
    };
    return (
      <div
        className="flex min-h-screen flex-col items-center overflow-y-auto px-4 pb-10 pt-8"
        style={{ background: gameBg }}
      >
        <style dangerouslySetInnerHTML={{ __html: GLOBAL_STYLES }} />
        <Stars count={5} />
        <div className="mb-2 flex w-full max-w-sm justify-start">
          <button
            className="sm-tap"
            onClick={() => setGameState("mode-select")}
            style={{
              color: dark,
              fontFamily: RACING,
              fontSize: "1.1rem",
              background: "none",
              border: "none",
              cursor: "pointer",
            }}
          >
            ✕ Exit
          </button>
        </div>
        <div style={{ fontFamily: RACING, fontSize: "2.5rem", color: bg }}>²</div>
        <h2 className="mb-4 text-3xl" style={{ color: bg, fontFamily: RACING }}>
          Learn: step by step
        </h2>
        <SquareStepView
          key={squareViewKey}
          squareNum={squareNum}
          bg={bg}
          light={light}
          dark={dark}
          onTryAnother={() => {
            setSquareNum(rand(26, 50));
            setSquareViewKey((k) => k + 1);
          }}
          onRangeSelect={(r) => {
            setSquareNum(randInRange(r));
            setSquareViewKey((k) => k + 1);
          }}
          onGoSettings={() => setGameState("settings")}
        />
      </div>
    );
  }

  // ─── FRIENDS PRACTICE ─────────────────────────────────────────────────────
  if (gameState === "friends-practice") {
    const { bg, light, dark } = CHALLENGE_COLORS["Friends"];
    return (
      // At least one screen tall, but the page scrolls when the content is taller
      // (short and landscape phones), so Check, Skip and Start stay reachable.
      <div
        style={{
          minHeight: "100dvh",
          display: "flex",
          flexDirection: "column",
          background: gameBg,
        }}
      >
        <style dangerouslySetInnerHTML={{ __html: GLOBAL_STYLES }} />
        <Stars count={6} />

        {/* Compact header */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            paddingTop: 16,
            paddingBottom: 8,
            flexShrink: 0,
            position: "relative",
            width: "100%",
          }}
        >
          <button
            className="sm-tap"
            onClick={() => setGameState("mode-select")}
            style={{
              position: "absolute",
              left: 16,
              top: 16,
              color: dark,
              fontFamily: RACING,
              fontSize: "1.1rem",
              background: "none",
              border: "none",
              cursor: "pointer",
            }}
          >
            ✕ Exit
          </button>
          <div style={{ fontFamily: RACING, fontSize: "1.8rem", color: bg, lineHeight: 1 }}>🤝</div>
          <h2 style={{ color: bg, fontFamily: RACING, fontSize: "1.6rem", margin: "2px 0 0" }}>
            Friends
          </h2>
          <p
            style={{
              color: dark,
              fontFamily: OUTFIT,
              fontWeight: 600,
              fontSize: "0.75rem",
              margin: 0,
            }}
          >
            Friends add up to 9, 10 or 100.
          </p>
        </div>

        {/* Content area — fills remaining height and grows past it if needed */}
        <div
          style={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            padding: "0 16px 16px",
          }}
        >
          <FriendsPractice
            bg={bg}
            light={light}
            dark={dark}
            onStartChallenge={() => setGameState("settings")}
          />
        </div>
      </div>
    );
  }

  // ─── MULTIPLICATION TABLE SELECT ───────────────────────────────────────────
  if (gameState === "mult-table-select") {
    const { bg, light, dark } = CHALLENGE_COLORS["Multiplication"];
    const mid = Math.floor((minA + maxA) / 2);
    return (
      <div
        className="flex min-h-screen flex-col items-center px-4 pb-10 pt-8"
        style={{ background: gameBg, fontFamily: OUTFIT }}
      >
        <style dangerouslySetInnerHTML={{ __html: GLOBAL_STYLES }} />
        <Stars count={6} />
        <h2 className="mb-2 text-3xl" style={{ color: bg, fontFamily: RACING }}>
          Practise: pick your tables
        </h2>
        <p className="mb-6 text-lg" style={{ color: dark, fontFamily: OUTFIT, fontWeight: 600 }}>
          Set your number range
        </p>
        <div
          className="mb-6 w-full max-w-md rounded-3xl border-2 bg-white p-6 shadow-xl"
          style={{ borderColor: bg }}
        >
          <p style={{ color: bg, fontFamily: RACING, fontSize: "1.2rem", marginBottom: "8px" }}>
            Range (2 – 29)
          </p>
          <div className="mb-3 flex gap-2">
            <input
              type="number"
              min={2}
              max={29}
              value={minA}
              onChange={(e) => setMinA(Math.min(maxA - 1, Math.max(2, Number(e.target.value))))}
              className="flex-1 rounded-lg border-2 px-3 py-2 text-center"
              style={{ borderColor: bg, fontFamily: RACING, fontSize: "1.2rem", color: bg }}
            />
            <span
              style={{
                fontFamily: RACING,
                fontSize: "1.4rem",
                color: bg,
                display: "flex",
                alignItems: "center",
              }}
            >
              –
            </span>
            <input
              type="number"
              min={3}
              max={29}
              value={maxA}
              onChange={(e) => setMaxA(Math.max(minA + 1, Math.min(29, Number(e.target.value))))}
              className="flex-1 rounded-lg border-2 px-3 py-2 text-center"
              style={{ borderColor: bg, fontFamily: RACING, fontSize: "1.2rem", color: bg }}
            />
          </div>
          {/* Preset ranges (the old sliders were 16px tall and hard to use by touch) */}
          <div className="mb-4 grid grid-cols-3 gap-2">
            {(
              [
                [2, 5],
                [6, 9],
                [10, 12],
                [2, 12],
                [11, 15],
                [16, 20],
              ] as const
            ).map(([lo, hi]) => {
              const on = minA === lo && maxA === hi;
              return (
                <button
                  key={`${lo}-${hi}`}
                  type="button"
                  onClick={() => {
                    setMinA(lo);
                    setMaxA(hi);
                  }}
                  aria-pressed={on}
                  className="sm-tap rounded-2xl py-2 transition active:scale-95"
                  style={{
                    background: on ? bg : light,
                    color: on ? "#fff" : bg,
                    border: `2px solid ${bg}`,
                    fontFamily: RACING,
                    fontSize: "1rem",
                  }}
                >
                  {lo}–{hi}
                </button>
              );
            })}
          </div>

          {/* Visual split preview */}
          <div
            className="rounded-2xl p-4 text-center"
            style={{ background: light, border: `2px dashed ${bg}55` }}
          >
            <p
              style={{
                fontFamily: OUTFIT,
                fontWeight: 700,
                color: dark,
                fontSize: "0.85rem",
                marginBottom: 6,
              }}
            >
              How A × B will be picked:
            </p>
            <div className="flex items-center justify-center gap-3">
              <div className="rounded-xl px-4 py-2" style={{ background: bg, color: "#fff" }}>
                <div
                  style={{ fontFamily: OUTFIT, fontSize: "0.7rem", fontWeight: 600, opacity: 0.85 }}
                >
                  A (lower half)
                </div>
                <div style={{ fontFamily: RACING, fontSize: "1.1rem" }}>
                  {minA} – {mid}
                </div>
              </div>
              <span style={{ fontFamily: RACING, fontSize: "1.4rem", color: bg }}>×</span>
              <div className="rounded-xl px-4 py-2" style={{ background: bg, color: "#fff" }}>
                <div
                  style={{ fontFamily: OUTFIT, fontSize: "0.7rem", fontWeight: 600, opacity: 0.85 }}
                >
                  B (upper half)
                </div>
                <div style={{ fontFamily: RACING, fontSize: "1.1rem" }}>
                  {mid} – {maxA}
                </div>
              </div>
            </div>
          </div>

          <p
            style={{
              color: dark,
              fontFamily: OUTFIT,
              fontSize: "0.85rem",
              marginTop: "12px",
              textAlign: "center",
            }}
          >
            ✓ 10 questions with A from the lower half, B from the upper half
          </p>
        </div>
        <button
          onClick={() => setGameState("settings")}
          className="w-full max-w-sm rounded-3xl py-5 shadow-xl hover:scale-105 active:scale-95"
          style={{ background: bg, color: "#fff", fontFamily: RACING, fontSize: "1.6rem" }}
        >
          Next →
        </button>
      </div>
    );
  }

  // ─── RESULT ───────────────────────────────────────────────────────────────
  if (gameState === "result") {
    const { bg, dark } = examMode ? EXAM_COLORS : CHALLENGE_COLORS[challenge];
    const practice = !examMode && timeMode === "practice";
    const answered = Math.max(answeredCount, 1);
    const accuracy = correctCount / answered;
    const seconds = Math.round(totalTime);
    const secsPerCorrect = correctCount > 0 ? (totalTime / correctCount).toFixed(1) : null;
    const verdict =
      accuracy >= 0.9
        ? { emoji: "🏆", title: "Excellent!" }
        : accuracy >= 0.7
          ? { emoji: "🏆", title: "Well done!" }
          : accuracy >= 0.4
            ? { emoji: "👍", title: "Good effort!" }
            : { emoji: "💪", title: "Keep practising!" };
    return (
      <div
        className="flex min-h-screen flex-col items-center justify-center px-4 py-8"
        style={{ background: gameBg }}
      >
        <style dangerouslySetInnerHTML={{ __html: GLOBAL_STYLES }} />
        <Stars count={12} />
        <div className="mb-4 text-7xl">{verdict.emoji}</div>
        <h2 className="mb-2 text-4xl" style={{ color: bg, fontFamily: RACING }}>
          {verdict.title}
        </h2>
        <p
          className="mb-6 text-center text-lg"
          style={{ color: dark, fontFamily: OUTFIT, fontWeight: 700 }}
        >
          {examMode
            ? `${fmtMarks(examMarks)} marks in ${examMinutes} minutes: ${correctCount} right, ${wrongCount} wrong, ${skippedCount} skipped.`
            : `${correctCount} of ${answeredCount} right${practice ? "." : ` in ${seconds} second${seconds === 1 ? "" : "s"}.`}`}
        </p>
        {pbNote && (
          <p
            className="-mt-3 mb-6 rounded-full px-4 py-1.5 text-center text-sm"
            style={{ background: `${bg}18`, color: dark, fontFamily: OUTFIT, fontWeight: 700 }}
          >
            {pbNote}
          </p>
        )}
        <div
          className="mb-6 w-full max-w-sm rounded-3xl border-2 bg-white px-8 py-4 shadow-xl"
          style={{ borderColor: bg }}
        >
          {[
            ...(examMode
              ? [
                  { emoji: "📝", label: "Marks", value: fmtMarks(examMarks) },
                  { emoji: "✅", label: "Right", value: correctCount },
                  { emoji: "❌", label: "Wrong", value: wrongCount },
                  { emoji: "⏭", label: "Skipped", value: skippedCount },
                ]
              : [{ emoji: "✅", label: "Correct", value: `${correctCount} / ${answeredCount}` }]),
            { emoji: "🎯", label: "Accuracy", value: `${Math.round(accuracy * 100)}%` },
            ...(practice || examMode
              ? []
              : [
                  { emoji: "⏱", label: "Time", value: `${seconds}s` },
                  {
                    emoji: "⚡",
                    label: "Seconds per correct",
                    value: secsPerCorrect ? `${secsPerCorrect}s` : "—",
                  },
                ]),
            ...(examMode
              ? [
                  {
                    emoji: "⚡",
                    label: "Seconds per correct",
                    value: secsPerCorrect ? `${secsPerCorrect}s` : "—",
                  },
                ]
              : [{ emoji: "⭐", label: "Score", value: score }]),
            { emoji: "🔥", label: "Best Streak", value: bestStreak },
          ].map(({ emoji, label, value }) => (
            <div
              key={label}
              className="flex items-center justify-between gap-3 border-b border-gray-100 py-3 last:border-0"
            >
              <span className="text-2xl">{emoji}</span>
              <span
                className="flex-1"
                style={{ color: dark, fontFamily: OUTFIT, fontWeight: 700 }}
              >
                {label}
              </span>
              <span style={{ color: bg, fontFamily: RACING, fontSize: "1.4rem" }}>{value}</span>
            </div>
          ))}
        </div>
        <div className="flex w-full max-w-sm gap-3">
          <button
            onClick={examMode ? beginExam : beginGame}
            className="flex-1 rounded-3xl py-4 shadow-lg active:scale-95"
            style={{ background: bg, color: "#fff", fontFamily: RACING, fontSize: "1.2rem" }}
          >
            🔄 Again
          </button>
          <button
            onClick={() => setGameState("menu")}
            className="flex-1 rounded-3xl border-2 py-4 shadow-lg active:scale-95"
            style={{
              borderColor: bg,
              color: bg,
              background: "#fff",
              fontFamily: RACING,
              fontSize: "1.2rem",
            }}
          >
            🏠 Menu
          </button>
        </div>
      </div>
    );
  }

  // ─── PLAYING ──────────────────────────────────────────────────────────────
  if (gameState === "playing" && question) {
    // In Exam Mode each question has its own skill.
    const playChallenge = examMode ? qChallenge : challenge;
    const { bg, light, dark } = CHALLENGE_COLORS[playChallenge];
    const timerPct = examMode
      ? (timeLeft / (examMinutes * 60)) * 100
      : timeMode === "timed"
        ? (timeLeft / secondsPerQ) * 100
        : 100;
    const isWrong = feedback === "incorrect";
    const isRight = feedback === "correct";
    const worked = question.display.includes("?")
      ? question.display.replace("?", String(question.answer))
      : `${question.display} = ${question.answer}`;
    const lastQuestion = questionsLeft <= 0;
    return (
      <div
        className="sm-play flex min-h-screen flex-col items-center px-4 pb-8 pt-6 transition-all"
        style={{ background: feedback ? (isRight ? "#f0fdf4" : "#fef2f2") : gameBg }}
      >
        <style dangerouslySetInnerHTML={{ __html: GLOBAL_STYLES }} />
        {/* Question side */}
        <div className="sm-play-main flex w-full max-w-md flex-col items-center">
        <div className="sm-play-head mb-4 flex w-full max-w-md items-center justify-between">
          <button
            onClick={() => {
              stopTimers();
              setGameState("menu");
            }}
            aria-label="Exit to menu"
            className="sm-tap inline-flex items-center justify-center text-lg"
            style={{ color: dark, fontFamily: RACING }}
          >
            ✕
          </button>
          <h3 style={{ color: bg, fontFamily: RACING, fontSize: "1.3rem" }}>
            {examMode ? `Exam · ${playChallenge}` : challenge}
          </h3>
          <div className="flex gap-4">
            {examMode ? (
              <span style={{ color: dark, fontFamily: RACING }}>⏱ {fmtClock(timeLeft)}</span>
            ) : (
              timeMode !== "practice" && (
                <span style={{ color: dark, fontFamily: RACING }}>
                  ⏱ {timeMode === "timed" ? timeLeft : totalTime}s
                </span>
              )
            )}
            <span style={{ color: dark, fontFamily: RACING }}>
              {examMode
                ? `Q${answeredCount + skippedCount + (feedback ? 0 : 1)}`
                : `${roundTotal - questionsLeft + (feedback ? 0 : 1)}/${roundTotal}`}
            </span>
          </div>
        </div>
        {(examMode || timeMode === "timed") && (
          <div
            className="sm-play-timer mb-4 h-3 w-full max-w-md overflow-hidden rounded-full"
            style={{ background: "#e0f2f1" }}
          >
            <div
              className="h-full rounded-full transition-all duration-1000"
              style={{
                width: `${timerPct}%`,
                background: timerPct > 50 ? bg : timerPct > 25 ? "#D8AE4F" : "#E45C48",
              }}
            />
          </div>
        )}
        <ScoreBar score={score} streak={streak} dark={dark} />
        <div
          className="sm-play-card relative mb-6 w-full max-w-md overflow-hidden rounded-3xl p-8 text-center shadow-2xl"
          style={{
            background: isRight ? "#22c55e" : isWrong ? "#fff" : light,
            border: `4px solid ${isRight ? "#22c55e" : isWrong ? "#ef4444" : bg}`,
          }}
        >
          {isRight && (
            <div className="absolute inset-0 flex items-center justify-center">
              <img
                src={CORRECT_IMG}
                alt="Correct"
                style={{ width: "80%", maxWidth: "300px", height: "auto", objectFit: "contain" }}
              />
            </div>
          )}
          <div style={{ opacity: isRight ? 0.18 : 1 }}>
            {!isWrong && !question.display.includes("?") && (
              <p
                className="sm-q-label mb-2 text-base"
                style={{ color: dark, fontFamily: OUTFIT, fontWeight: 700 }}
              >
                What is
              </p>
            )}
            <div
              className={`sm-q${isWrong ? " sm-q-wrong" : ""}`}
              style={{
                color: bg,
                fontFamily: RACING,
                fontSize: isWrong ? "clamp(2rem,8vw,3rem)" : "clamp(3rem,12vw,5rem)",
                lineHeight: 1.1,
              }}
            >
              {question.display}
            </div>
          </div>
          {/* Wrong answer: the correct working at full contrast, outside any faded layer */}
          {isWrong && (
            <div role="status" aria-live="assertive" className="sm-feedback mt-4">
              <p style={{ color: "#b91c1c", fontFamily: OUTFIT, fontWeight: 800, fontSize: "1.1rem" }}>
                {lastPick === null ? "Time's up!" : "Not quite."}
              </p>
              <p
                className="sm-worked"
                style={{
                  color: "#7f1d1d",
                  fontFamily: RACING,
                  fontSize: "clamp(1.8rem,7vw,2.6rem)",
                  lineHeight: 1.15,
                }}
              >
                {worked}
              </p>
              {lastPick !== null && answerMode === "Type Answer" && (
                <p style={{ color: "#7f1d1d", fontFamily: OUTFIT, fontWeight: 600 }}>
                  You typed {lastPick}
                </p>
              )}
              {showHow && <MethodSteps challenge={playChallenge} dark="#7f1d1d" />}
            </div>
          )}
        </div>
        </div>

        {/* Answer side */}
        <div className="sm-play-answers w-full max-w-md">
        {answerMode === "Choose Option" && question.options && (
          <div className="grid w-full max-w-md grid-cols-2 gap-3">
            {question.options.map((opt) => {
              const isAnswer = Math.abs(opt - question.answer) < 0.01;
              const isPicked = lastPick !== null && Number(lastPick) === opt;
              let bgCol = "#fff";
              let fg = bg;
              let border = bg;
              let fade = 1;
              if (feedback) {
                if (isAnswer) {
                  bgCol = "#22c55e";
                  fg = "#fff";
                  border = "#16a34a";
                } else if (isPicked) {
                  bgCol = "#ef4444";
                  fg = "#fff";
                  border = "#dc2626";
                } else {
                  fade = 0.45;
                }
              }
              return (
                <button
                  key={opt}
                  onClick={() => handleAnswer(opt)}
                  disabled={!!feedback}
                  aria-label={
                    feedback
                      ? `${opt}${isAnswer ? ", correct answer" : isPicked ? ", your answer" : ""}`
                      : String(opt)
                  }
                  className={`sm-opt rounded-3xl py-5 shadow-lg ${feedback ? "" : "hover:scale-105 active:scale-95"}`}
                  style={{
                    background: bgCol,
                    border: `3px solid ${border}`,
                    color: fg,
                    opacity: fade,
                    fontFamily: RACING,
                    fontSize: "1.8rem",
                  }}
                >
                  {opt}
                </button>
              );
            })}
          </div>
        )}
        {examMode && !feedback && (
          <button
            type="button"
            onClick={skipQuestion}
            className="sm-tap sm-next mt-3 w-full max-w-md rounded-3xl border-2 py-3 active:scale-95"
            style={{ borderColor: `${bg}66`, color: bg, background: "#fff", fontFamily: RACING, fontSize: "1.1rem" }}
          >
            Skip →
          </button>
        )}
        {!feedback && answerMode === "Type Answer" && (
          <div className="w-full max-w-md">
            <NumPad
              value={typedAnswer}
              allowHalf={playChallenge === "Half"}
              onDigit={(d) => setTypedAnswer((v) => applyNumPadKey(v, d))}
              onErase={() => setTypedAnswer((v) => v.slice(0, -1))}
              onEnter={() => handleAnswer(typedAnswer)}
            />
          </div>
        )}
        {isWrong && (
          <div className="flex w-full max-w-md gap-3">
            <button
              type="button"
              onClick={() => setShowHow((v) => !v)}
              aria-expanded={showHow}
              className="sm-next mt-5 flex-1 rounded-3xl border-2 py-4 shadow-lg active:scale-95"
              style={{ borderColor: bg, background: "#fff", color: bg, fontFamily: RACING, fontSize: "1.1rem" }}
            >
              {showHow ? "Hide" : "Show me how"}
            </button>
            <button
              // Focused so Enter or Space also moves on.
              autoFocus
              onClick={goToNextQuestion}
              className="sm-next mt-5 flex-1 rounded-3xl py-4 shadow-lg active:scale-95"
              style={{ background: bg, color: "#fff", fontFamily: RACING, fontSize: "1.3rem" }}
            >
              {lastQuestion ? "See results →" : "Next →"}
            </button>
          </div>
        )}
        </div>
      </div>
    );
  }

  return null;
}

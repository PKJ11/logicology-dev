"use client";

import { useState, useCallback } from "react";

// ── Design tokens ─────────────────────────────────────────────────────────────
const BRAND_TEAL_DK = "#0B3F44";
const RACING  = "'Racing Sans One', cursive";
const OUTFIT  = "'Outfit', sans-serif";

const FRIENDS_COLOR = {
  bg:    "#F5A623",
  light: "#FFF8EC",
  dark:  "#7A4F00",
};

// ── Types ─────────────────────────────────────────────────────────────────────
type FriendBase = 9 | 10 | 100;

interface FriendPair {
  a: number;
  b: number;
}

interface TabScore {
  score: number;
  total: number;
}

// ── Helpers ───────────────────────────────────────────────────────────────────
function rand(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function shuffle<T>(arr: T[]): T[] {
  return [...arr].sort(() => Math.random() - 0.5);
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
  // For base 100: exclude multiples of 10
  let a = rand(11, 89);
  // Keep generating until a is not a multiple of 10 AND b is not a multiple of 10
  while (a % 10 === 0 || (100 - a) % 10 === 0) {
    a = rand(11, 89);
  }
  return { a, b: 100 - a };
}

function generateOptions(correct: number, base: FriendBase): number[] {
  const offsets = base === 100
    ? shuffle([correct + 10, correct - 10, correct + 1, correct - 1, correct + 9, correct - 9])
    : shuffle([correct + 1, correct - 1, correct + 2, correct - 2]);

  const wrongs = offsets
    .filter(v => v > 0 && v !== correct && v < base)
    .slice(0, 3);

  return shuffle([correct, ...wrongs]);
}

// ── Individual tab practice panel ─────────────────────────────────────────────
function FriendPanel({
  base,
  score,
  total,
  onScore,
}: {
  base: FriendBase;
  score: number;
  total: number;
  onScore: (correct: boolean) => void;
}) {
  const { bg, light, dark } = FRIENDS_COLOR;

  const [pair,     setPair]     = useState<FriendPair>(() => generateFriendPair(base));
  const [options,  setOptions]  = useState<number[]>(() => generateOptions(generateFriendPair(base).b, base));
  const [feedback, setFeedback] = useState<"correct" | "wrong" | null>(null);
  const [inputValue, setInputValue] = useState<string>("");

  const next = useCallback(() => {
    const newPair = generateFriendPair(base);
    setPair(newPair);
    setOptions(generateOptions(newPair.b, base));
    setFeedback(null);
    setInputValue("");
  }, [base]);

  const handleAnswer = (chosen: number) => {
    if (feedback) return;
    const correct = chosen === pair.b;
    setFeedback(correct ? "correct" : "wrong");
    onScore(correct);
    setTimeout(next, 1000);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    // maxLength and pattern will handle the restriction on the input level
    // but we still validate here to be safe
    if (/^[0-9]?$/.test(value)) {
      setInputValue(value);
    }
  };

  const handleInputSubmit = () => {
    if (feedback) return;
    if (!inputValue) return;
    const chosen = parseInt(inputValue, 10);
    if (!isNaN(chosen)) {
      handleAnswer(chosen);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleInputSubmit();
    }
  };

  const borderCol =
    feedback === "correct" ? "#22c55e" :
    feedback === "wrong"   ? "#ef4444" :
    bg;

  return (
    <div
      style={{
        background: "#fff",
        border: `3px solid ${borderCol}`,
        borderRadius: 24,
        padding: "20px 20px 16px",
        boxShadow: "0 4px 20px rgba(0,0,0,0.10)",
        display: "flex",
        flexDirection: "column",
        gap: 14,
        transition: "border-color 0.25s ease",
        maxWidth: 380,
        margin: "0 auto",
        width: "100%",
      }}
    >
      {/* Header */}
      <div style={{
        background: bg,
        borderRadius: 14,
        padding: "10px 14px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
      }}>
        <span style={{ fontFamily: RACING, fontSize: "1rem", color: "#fff", letterSpacing: "0.04em" }}>
          Friends of {base}
        </span>
        <span style={{ fontFamily: OUTFIT, fontSize: "0.85rem", fontWeight: 700, color: "#fff99c" }}>
          {score}/{total}
        </span>
      </div>

      {/* Question */}
      <div style={{
        background: feedback === "correct" ? "#f0fdf4" : feedback === "wrong" ? "#fef2f2" : light,
        borderRadius: 16,
        padding: "18px 12px",
        textAlign: "center",
        transition: "background 0.3s ease",
      }}>
        <p style={{ fontFamily: OUTFIT, fontWeight: 600, fontSize: "0.82rem", color: dark, margin: "0 0 4px" }}>
          What is the friend of
        </p>
        <div style={{ fontFamily: RACING, fontSize: "3.5rem", color: bg, lineHeight: 1 }}>
          {pair.a}
        </div>
        <div style={{ fontFamily: OUTFIT, fontWeight: 700, fontSize: "0.78rem", color: `${bg}99`, marginTop: 2 }}>
          {pair.a} + ? = {base}
        </div>
        {feedback && (
          <div style={{
            marginTop: 8,
            fontFamily: OUTFIT,
            fontWeight: 800,
            fontSize: "0.9rem",
            color: feedback === "correct" ? "#16a34a" : "#dc2626",
          }}>
            {feedback === "correct"
              ? `✅ Yes! ${pair.a} + ${pair.b} = ${base}`
              : `❌ It's ${pair.b}! (${pair.a} + ${pair.b} = ${base})`}
          </div>
        )}
      </div>

      {/* Input Field for Single Digit */}
      <div style={{
        display: "flex",
        gap: 10,
        alignItems: "center",
        justifyContent: "center",
      }}>
        <input
          type="text"
          inputMode="numeric"
          maxLength={1}
          pattern="[0-9]*"
          value={inputValue}
          onChange={handleInputChange}
          onKeyPress={handleKeyPress}
          disabled={!!feedback}
          placeholder="?"
          style={{
            width: "80px",
            padding: "12px",
            fontSize: "1.6rem",
            fontFamily: RACING,
            textAlign: "center",
            border: `2.5px solid ${bg}55`,
            borderRadius: 14,
            background: light,
            color: BRAND_TEAL_DK,
            outline: "none",
          }}
        />
        <button
          onClick={handleInputSubmit}
          disabled={!!feedback || !inputValue}
          style={{
            background: bg,
            border: "none",
            borderRadius: 14,
            padding: "12px 24px",
            fontFamily: OUTFIT,
            fontWeight: 700,
            fontSize: "1rem",
            color: "#fff",
            cursor: (!feedback && inputValue) ? "pointer" : "not-allowed",
            opacity: (!feedback && inputValue) ? 1 : 0.5,
            transition: "transform 0.15s",
          }}
          onMouseEnter={e => {
            if (!feedback && inputValue) {
              (e.currentTarget as HTMLButtonElement).style.transform = "scale(1.05)";
            }
          }}
          onMouseLeave={e => {
            (e.currentTarget as HTMLButtonElement).style.transform = "scale(1)";
          }}
        >
          Submit
        </button>
      </div>

      {/* Options Buttons */}
      <div style={{
        display: "grid",
        gridTemplateColumns: "1fr 1fr",
        gap: 10,
        opacity: feedback ? 0.5 : 1,
        transition: "opacity 0.2s",
        marginTop: 4,
      }}>
        {options.map(opt => (
          <button
            key={opt}
            onClick={() => handleAnswer(opt)}
            disabled={!!feedback}
            style={{
              background: light,
              border: `2.5px solid ${bg}55`,
              borderRadius: 14,
              padding: "12px 4px",
              fontFamily: RACING,
              fontSize: "1.6rem",
              color: BRAND_TEAL_DK,
              cursor: feedback ? "not-allowed" : "pointer",
              transition: "transform 0.15s, box-shadow 0.15s",
              boxShadow: "0 2px 6px rgba(0,0,0,0.06)",
            }}
            onMouseEnter={e => {
              if (!feedback) {
                (e.currentTarget as HTMLButtonElement).style.transform = "scale(1.06)";
                (e.currentTarget as HTMLButtonElement).style.boxShadow = `0 6px 18px ${bg}33`;
              }
            }}
            onMouseLeave={e => {
              (e.currentTarget as HTMLButtonElement).style.transform = "scale(1)";
              (e.currentTarget as HTMLButtonElement).style.boxShadow = "0 2px 6px rgba(0,0,0,0.06)";
            }}
          >
            {opt}
          </button>
        ))}
      </div>

      {/* Skip */}
      <button
        onClick={next}
        style={{
          background: "transparent",
          border: `1.5px dashed ${bg}55`,
          borderRadius: 12,
          padding: "7px",
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
  );
}

// ── Main FriendsChallenge component ──────────────────────────────────────────
export default function FriendsChallenge({
  onStartChallenge,
}: {
  onStartChallenge?: () => void;
}) {
  const { bg } = FRIENDS_COLOR;
  const bases: FriendBase[] = [9, 10, 100];

  const [activeTab, setActiveTab] = useState<FriendBase>(9);
  const [tabScores, setTabScores] = useState<Record<FriendBase, TabScore>>({
    9:   { score: 0, total: 0 },
    10:  { score: 0, total: 0 },
    100: { score: 0, total: 0 },
  });

  const handleScore = (base: FriendBase, correct: boolean) => {
    setTabScores(prev => ({
      ...prev,
      [base]: {
        score: prev[base].score + (correct ? 1 : 0),
        total: prev[base].total + 1,
      },
    }));
  };

  return (
    <div
      style={{
        width: "100%",
        maxWidth: 480,
        margin: "0 auto",
        padding: "0 0 24px",
        display: "flex",
        flexDirection: "column",
        gap: 20,
      }}
    >
      {/* Section header */}
      <div style={{ textAlign: "center" }}>
        <div style={{ fontFamily: RACING, fontSize: "2.2rem", color: bg, lineHeight: 1 }}>
          🤝 Friends Practice
        </div>
        <p style={{ fontFamily: OUTFIT, fontWeight: 600, color: "#7A4F00", marginTop: 4, fontSize: "0.95rem" }}>
          Number pairs that add up to 9, 10, or 100
        </p>
      </div>

      {/* Tabs */}
      <div style={{
        display: "flex",
        gap: 8,
        justifyContent: "center",
        background: "#FFF8EC",
        borderRadius: 99,
        padding: 4,
        maxWidth: 360,
        margin: "0 auto",
        width: "100%",
      }}>
        {bases.map(base => (
          <button
            key={base}
            onClick={() => setActiveTab(base)}
            style={{
              flex: 1,
              border: "none",
              cursor: "pointer",
              fontFamily: OUTFIT,
              fontWeight: 700,
              fontSize: "0.9rem",
              padding: "9px 0",
              borderRadius: 99,
              transition: "all 0.2s ease",
              background: activeTab === base ? bg : "transparent",
              color: activeTab === base ? "#fff" : "#7A4F00",
              boxShadow: activeTab === base ? `0 4px 12px ${bg}44` : "none",
            }}
          >
            {base === 9 ? "9" : base === 10 ? "10" : "100"}
          </button>
        ))}
      </div>

      {/* Active panel — keyed so state resets only when needed */}
      <FriendPanel
        key={activeTab}
        base={activeTab}
        score={tabScores[activeTab].score}
        total={tabScores[activeTab].total}
        onScore={(correct) => handleScore(activeTab, correct)}
      />

      {/* Optional timed challenge CTA */}
      {onStartChallenge && (
        <button
          onClick={onStartChallenge}
          style={{
            background: bg,
            color: "#fff",
            border: "none",
            borderRadius: 20,
            padding: "14px 0",
            fontFamily: RACING,
            fontSize: "1.2rem",
            letterSpacing: "0.04em",
            cursor: "pointer",
            boxShadow: `0 8px 24px ${bg}55`,
            transition: "transform 0.2s, box-shadow 0.2s",
          }}
          onMouseEnter={e => {
            (e.currentTarget as HTMLButtonElement).style.transform = "scale(1.03)";
          }}
          onMouseLeave={e => {
            (e.currentTarget as HTMLButtonElement).style.transform = "scale(1)";
          }}
        >
          ⚡ Start Timed Challenge
        </button>
      )}
    </div>
  );
}

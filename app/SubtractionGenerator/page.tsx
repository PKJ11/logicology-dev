"use client";
import { useState, useEffect, useRef } from "react";

interface Question {
  a: number;
  b: number;
}

function generateQuestion(): Question {
  let a: number, b: number;
  do {
    b = Math.floor(Math.random() * 9) + 1;
    const diff = Math.floor(Math.random() * 9) + 1;
    a = b + diff;
  } while (a > 18);
  return { a, b };
}

export default function SubtractionGenerator() {
  const [question, setQuestion] = useState<Question>(generateQuestion());
  const [answer, setAnswer] = useState("");
  const [feedback, setFeedback] = useState<"correct" | "wrong" | null>(null);
  const [score, setScore] = useState({ correct: 0, total: 0 });
  const [streak, setStreak] = useState(0);
  const [streakAnimate, setStreakAnimate] = useState(false);
  const [cardFlash, setCardFlash] = useState<"correct" | "wrong" | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const autoTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleNext = () => {
    if (autoTimer.current) {
      clearTimeout(autoTimer.current);
      autoTimer.current = null;
    }
    setQuestion(generateQuestion());
    setAnswer("");
    setFeedback(null);
    setCardFlash(null);
    setTimeout(() => inputRef.current?.focus(), 50);
  };

  const handleCheck = () => {
    if (feedback !== null) return;
    const isCorrect = parseInt(answer) === question.a - question.b;
    setFeedback(isCorrect ? "correct" : "wrong");
    setCardFlash(isCorrect ? "correct" : "wrong");
    setScore((s) => ({ correct: s.correct + (isCorrect ? 1 : 0), total: s.total + 1 }));
    setStreak((s) => {
      const next = isCorrect ? s + 1 : 0;
      return next;
    });
    if (isCorrect) {
      setStreakAnimate(false);
      setTimeout(() => setStreakAnimate(true), 10);
    }
    autoTimer.current = setTimeout(() => handleNext(), 1200);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      if (feedback !== null) handleNext();
      else if (answer !== "") handleCheck();
    }
  };

  useEffect(() => {
    inputRef.current?.focus();
    return () => {
      if (autoTimer.current) clearTimeout(autoTimer.current);
    };
  }, []);

  const flashBg =
    cardFlash === "correct"
      ? "rgba(34,197,94,0.08)"
      : cardFlash === "wrong"
        ? "rgba(239,68,68,0.07)"
        : "#fff";

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#f5f5f5",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontFamily: "sans-serif",
      }}
    >
      <div
        style={{
          background: flashBg,
          border: "1px solid #ddd",
          borderRadius: "12px",
          padding: "40px 48px",
          textAlign: "center",
          width: "320px",
          transition: "background 0.4s ease",
        }}
      >
        {/* Stats row */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "24px",
          }}
        >
          <p style={{ color: "#999", fontSize: "13px", margin: 0 }}>
            Score: {score.correct} / {score.total}
          </p>
          <span
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "4px",
              padding: "4px 10px",
              borderRadius: "20px",
              fontSize: "13px",
              fontWeight: 500,
              background: streak > 0 ? "#fef3c7" : "#f0f0f0",
              color: streak > 0 ? "#92400e" : "#aaa",
              transition: "background 0.3s, color 0.3s",
              animation:
                streakAnimate && streak > 0
                  ? "bounceIn 0.4s cubic-bezier(0.36,0.07,0.19,0.97)"
                  : "none",
            }}
          >
            🔥 {streak} streak
          </span>
        </div>

        {/* Question */}
        <div style={{ fontSize: "52px", fontWeight: "bold", color: "#222", marginBottom: "24px" }}>
          {question.a} − {question.b} =&nbsp;
          <input
            ref={inputRef}
            type="number"
            value={answer}
            onChange={(e) => {
              if (!feedback) setAnswer(e.target.value);
            }}
            onKeyDown={handleKeyDown}
            placeholder="?"
            style={{
              width: "60px",
              fontSize: "48px",
              fontWeight: "bold",
              textAlign: "center",
              border: "none",
              borderBottom: `3px solid ${
                feedback === "correct" ? "#22c55e" : feedback === "wrong" ? "#ef4444" : "#333"
              }`,
              outline: "none",
              background: "transparent",
              color: feedback === "correct" ? "#22c55e" : feedback === "wrong" ? "#ef4444" : "#222",
              transition: "border-color 0.2s, color 0.2s",
            }}
          />
        </div>

        {/* Feedback */}
        <div style={{ height: "24px", marginBottom: "20px", fontSize: "15px" }}>
          {feedback === "correct" && <span style={{ color: "#22c55e" }}>✓ Correct!</span>}
          {feedback === "wrong" && (
            <span style={{ color: "#ef4444" }}>✗ Answer: {question.a - question.b}</span>
          )}
        </div>

        {/* Buttons */}
        <div style={{ display: "flex", gap: "10px", justifyContent: "center" }}>
          {feedback === null ? (
            <button
              onClick={handleCheck}
              disabled={answer === ""}
              style={{
                padding: "10px 28px",
                fontSize: "14px",
                background: answer === "" ? "#e5e5e5" : "#3b82f6",
                color: answer === "" ? "#aaa" : "#fff",
                border: "none",
                borderRadius: "8px",
                cursor: answer === "" ? "not-allowed" : "pointer",
              }}
            >
              Check
            </button>
          ) : (
            <button
              onClick={handleNext}
              style={{
                padding: "10px 28px",
                fontSize: "14px",
                background: "#3b82f6",
                color: "#fff",
                border: "none",
                borderRadius: "8px",
                cursor: "pointer",
              }}
            >
              Next →
            </button>
          )}
          <button
            onClick={handleNext}
            style={{
              padding: "10px 20px",
              fontSize: "14px",
              background: "#fff",
              color: "#888",
              border: "1px solid #ddd",
              borderRadius: "8px",
              cursor: "pointer",
            }}
          >
            Skip
          </button>
        </div>

        <p style={{ color: "#ccc", fontSize: "11px", marginTop: "20px" }}>
          Press Enter to check / next
        </p>
      </div>

      <style>{`
        input::-webkit-inner-spin-button,
        input::-webkit-outer-spin-button { -webkit-appearance: none; }
        input[type=number] { -moz-appearance: textfield; }
        @keyframes bounceIn {
          0%   { transform: scale(1); }
          40%  { transform: scale(1.35); }
          70%  { transform: scale(0.9); }
          100% { transform: scale(1); }
        }
      `}</style>
    </div>
  );
}

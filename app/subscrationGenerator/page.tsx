"use client"
import { useState } from "react";

interface Question { a: number; b: number; }

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

  const handleCheck = () => {
    const isCorrect = parseInt(answer) === question.a - question.b;
    setFeedback(isCorrect ? "correct" : "wrong");
    setScore(s => ({ correct: s.correct + (isCorrect ? 1 : 0), total: s.total + 1 }));
  };

  const handleNext = () => {
    setQuestion(generateQuestion());
    setAnswer("");
    setFeedback(null);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      if (feedback !== null) handleNext();
      else if (answer !== "") handleCheck();
    }
  };

  return (
    <div style={{
      minHeight: "100vh",
      background: "#f5f5f5",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      fontFamily: "sans-serif",
    }}>
      <div style={{
        background: "#fff",
        border: "1px solid #ddd",
        borderRadius: "12px",
        padding: "40px 48px",
        textAlign: "center",
        width: "320px",
      }}>
        {/* Score */}
        <p style={{ color: "#999", fontSize: "13px", margin: "0 0 24px" }}>
          Score: {score.correct} / {score.total}
        </p>

        {/* Question */}
        <div style={{ fontSize: "52px", fontWeight: "bold", color: "#222", marginBottom: "24px" }}>
          {question.a} − {question.b} =&nbsp;
          <input
            type="number"
            value={answer}
            onChange={e => { if (!feedback) setAnswer(e.target.value); }}
            onKeyDown={handleKeyDown}
            placeholder="?"
            autoFocus
            style={{
              width: "60px",
              fontSize: "48px",
              fontWeight: "bold",
              textAlign: "center",
              border: "none",
              borderBottom: `3px solid ${
                feedback === "correct" ? "#22c55e" :
                feedback === "wrong" ? "#ef4444" : "#333"
              }`,
              outline: "none",
              background: "transparent",
              color: feedback === "correct" ? "#22c55e" : feedback === "wrong" ? "#ef4444" : "#222",
            }}
          />
        </div>

        {/* Feedback */}
        <div style={{ height: "24px", marginBottom: "20px", fontSize: "15px" }}>
          {feedback === "correct" && <span style={{ color: "#22c55e" }}>✓ Correct!</span>}
          {feedback === "wrong" && (
            <span style={{ color: "#ef4444" }}>
              ✗ Answer: {question.a - question.b}
            </span>
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
      `}</style>
    </div>
  );
}
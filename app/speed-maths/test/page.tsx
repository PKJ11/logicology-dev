"use client";

import { useState, useEffect, useCallback, useRef } from "react";

// ─── Constants & Helpers ─────────────────────────────────────────────────────
const BRAND_TEAL    = "#0A8A80";
const BRAND_TEAL_DK = "#0B3F44";
const RACING = "'Racing Sans One', cursive";
const OUTFIT = "'Outfit', sans-serif";
const TOTAL_TIME = 300;

const GLOBAL_STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Racing+Sans+One&family=Outfit:wght@400;600;700;900&display=swap');
  @keyframes fadeUp    { from{opacity:0;transform:translateY(20px)} to{opacity:1;transform:translateY(0)} }
  @keyframes rocketBob { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-8px)} }
  @keyframes pulse     { 0%,100%{transform:scale(1)} 50%{transform:scale(1.05)} }
  @keyframes slideIn   { from{opacity:0;transform:translateX(-20px)} to{opacity:1;transform:translateX(0)} }
  @keyframes shake     { 0%,100%{transform:translateX(0)} 25%{transform:translateX(-4px)} 75%{transform:translateX(4px)} }
  @keyframes blink     { 50%{opacity:0.35} }
  @keyframes popIn     { 0%{transform:scale(0.85);opacity:0} 100%{transform:scale(1);opacity:1} }
  @keyframes timerPulse{ 0%,100%{transform:scale(1);opacity:1} 50%{transform:scale(1.1);opacity:0.85} }
  @keyframes timerShake{ 0%,100%{transform:translateX(0)} 25%{transform:translateX(-3px)} 75%{transform:translateX(3px)} }
`;

function formatTime(s: number) {
  const m = Math.floor(s / 60);
  const sec = s % 60;
  return `${m}:${String(sec).padStart(2, "0")}`;
}

type QuestionStatus = "not-visited" | "not-answered" | "answered" | "review";

// ─── Question Bank ────────────────────────────────────────────────────────────
const QUESTIONS = [
  { id:1,  display:`13 + 14 + 15 + 16 + 17`,               answer: 75,    stage: 1 },
  { id:2,  display:`76 + 32 + 56 + 19`,                     answer: 183,   stage: 1 },
  { id:3,  display:`238 + 579`,                             answer: 817,   stage: 1 },
  { id:4,  display:`12 + 24 + 7 + 28 + 43 + 21 + 61 + 19`, answer: 215,   stage: 1 },
  { id:5,  display:`214 + 786`,                             answer: 1000,  stage: 1 },
  { id:6,  display:`96 − 19`,                               answer: 77,    stage: 1 },
  { id:7,  display:`843 − 567`,                             answer: 276,   stage: 1 },
  { id:8,  display:`621 − 279`,                             answer: 342,   stage: 1 },
  { id:9,  display:`123 + 376 − 39`,                        answer: 460,   stage: 1 },
  { id:10, display:`86 − 39`,                               answer: 47,    stage: 1 },
  { id:11, display:`112 × 25`,                              answer: 2800,  stage: 2 },
  { id:12, display:`452 × 11`,                              answer: 4972,  stage: 2 },
  { id:13, display:`91 × 93`,                               answer: 8463,  stage: 2 },
  { id:14, display:`343 ÷ 7`,                               answer: 49,    stage: 2 },
  { id:15, display:`1001 ÷ 77`,                             answer: 13,    stage: 2 },
  { id:16, display:`¼ of 36 + ⅙ of 66`,                    answer: 20,    stage: 2 },
  { id:17, display:`⅛ of 144 − ⅓ of 36`,                   answer: 6,     stage: 2 },
  { id:18, display:`40% of 240 − 30% of 120`,               answer: 60,    stage: 2 },
  { id:19, display:`⅙ + ⅛ − 1/12`,                         answer: 0.208, stage: 2 },
  { id:20, display:`20% of 750 − 60% of 500`,               answer: -150,  stage: 2 },
];

function getMarking(stage: number) {
  return stage === 1 ? { correct: 1, incorrect: -4 } : { correct: 2, incorrect: -8 };
}

// ─── Splash Screen ────────────────────────────────────────────────────────────
function Splash({ onDone }: { onDone: () => void }) {
  useEffect(() => {
    const t = setTimeout(onDone, 2400);
    return () => clearTimeout(t);
  }, [onDone]);

  return (
    <div style={{
      minHeight: "100vh", display: "flex", flexDirection: "column",
      alignItems: "center", justifyContent: "center",
      background: `linear-gradient(170deg,${BRAND_TEAL_DK} 0%,${BRAND_TEAL} 60%,${BRAND_TEAL_DK} 100%)`,
    }}>
      <style>{GLOBAL_STYLES}</style>
      <div style={{ animation: "rocketBob 2s ease-in-out infinite", fontSize: "4rem", marginBottom: 8 }}>🚀</div>
      <h1 style={{
        fontFamily: RACING, fontSize: "clamp(2.2rem,8vw,3.5rem)", color: "#fff",
        textShadow: "0 4px 20px rgba(0,0,0,0.3)", animation: "fadeUp 0.7s ease 0.3s both",
        margin: "12px 0 4px",
      }}>
        Logicology Test
      </h1>
      <p style={{
        fontFamily: RACING, color: "rgba(255,255,255,0.8)", fontSize: "1.3rem",
        animation: "fadeUp 0.7s ease 0.5s both", margin: 0,
      }}>
        Speed Mathematics ⚡
      </p>
    </div>
  );
}

// ─── Timer Display ────────────────────────────────────────────────────────────
function TimerDisplay({ timeLeft }: { timeLeft: number }) {
  const isCritical = timeLeft <= 30;
  const isWarning  = timeLeft <= 60;
  const pct = (timeLeft / TOTAL_TIME) * 100;
  const color = isCritical ? "#dc2626" : isWarning ? "#F5A623" : "#fff";
  const bg    = isCritical ? "rgba(220,38,38,0.25)" : isWarning ? "rgba(245,166,35,0.2)" : "rgba(255,255,255,0.12)";
  const anim  = isCritical ? "timerShake 0.4s ease-in-out infinite" : isWarning ? "timerPulse 1s ease-in-out infinite" : "none";

  return (
    <div style={{
      display: "flex", alignItems: "center", gap: 8,
      background: bg, border: `2px solid ${color}55`,
      borderRadius: 24, padding: "4px 14px 4px 10px", animation: anim,
    }}>
      <svg width="28" height="28" viewBox="0 0 28 28" style={{ flexShrink: 0 }}>
        <circle cx="14" cy="14" r="11" fill="none" stroke="rgba(255,255,255,0.15)" strokeWidth="3" />
        <circle cx="14" cy="14" r="11" fill="none" stroke={color} strokeWidth="3"
          strokeDasharray={`${2 * Math.PI * 11}`}
          strokeDashoffset={`${2 * Math.PI * 11 * (1 - pct / 100)}`}
          strokeLinecap="round" transform="rotate(-90 14 14)"
          style={{ transition: "stroke-dashoffset 1s linear, stroke 0.5s" }}
        />
        <text x="14" y="18" textAnchor="middle" fill={color} fontSize="8" fontFamily="Racing Sans One, cursive">
          {isCritical ? "!" : Math.ceil(timeLeft / 60)}
        </text>
      </svg>
      <span style={{
        fontFamily: RACING, fontSize: "1.1rem", color,
        letterSpacing: "0.04em", minWidth: 42, textAlign: "center",
      }}>
        {formatTime(timeLeft)}
      </span>
    </div>
  );
}

// ─── Status Bar ───────────────────────────────────────────────────────────────
function StatusBar({ statuses, markedReview }: {
  statuses: Record<number, QuestionStatus>;
  markedReview: Record<number, boolean>;
}) {
  let answered = 0, notAnswered = 0, notVisited = 0, review = 0;
  QUESTIONS.forEach(q => {
    if (markedReview[q.id]) { review++; return; }
    const st = statuses[q.id] || "not-visited";
    if      (st === "answered")     answered++;
    else if (st === "not-answered") notAnswered++;
    else                            notVisited++;
  });

  const pill = (label: string, count: number, bg: string) => (
    <div style={{
      display: "flex", alignItems: "center", gap: 5,
      background: bg, color: "#fff",
      padding: "3px 10px", borderRadius: 20,
      fontFamily: RACING, fontSize: "0.7rem",
    }}>
      <span style={{ fontSize: "0.85rem", fontWeight: 700 }}>{count}</span>
      &nbsp;{label}
    </div>
  );

  return (
    <div style={{
      background: "#fff", borderBottom: `2px solid ${BRAND_TEAL}`,
      padding: "6px 14px", display: "flex", alignItems: "center",
      gap: 8, flexWrap: "wrap",
    }}>
      {pill("Answered",    answered,    BRAND_TEAL)}
      {pill("Not Answered", notAnswered, "#dc2626")}
      {pill("Not Visited",  notVisited,  "#94a3b8")}
      {pill("For Review",   review,      "#7c3aed")}
      <div style={{ marginLeft: "auto", fontSize: "0.7rem", color: "#64748b" }}>
        Total: <strong>20 Q</strong>
      </div>
    </div>
  );
}

// ─── Question Palette ─────────────────────────────────────────────────────────
function QuestionPalette({
  currentIdx, statuses, markedReview, onJump,
}: {
  currentIdx: number;
  statuses: Record<number, QuestionStatus>;
  markedReview: Record<number, boolean>;
  onJump: (idx: number) => void;
}) {
  const getBg = (id: number, i: number) => {
    if (markedReview[id]) return "#7c3aed";
    const st = statuses[id] || "not-visited";
    if (st === "answered")     return BRAND_TEAL;
    if (st === "not-answered") return "#dc2626";
    return "#94a3b8";
  };

  return (
    <div style={{
      width: 188, background: "#f0fdf9",
      borderLeft: `2px solid ${BRAND_TEAL}33`,
      padding: 10, flexShrink: 0,
    }}>
      <div style={{
        background: BRAND_TEAL_DK, color: "#fff",
        fontFamily: RACING, fontSize: "0.7rem",
        textAlign: "center", padding: "5px",
        borderRadius: 6, marginBottom: 8, letterSpacing: "0.5px",
      }}>
        QUESTION PALETTE
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(5,1fr)", gap: 4, marginBottom: 10 }}>
        {QUESTIONS.map((q, i) => (
          <button key={q.id} onClick={() => onJump(i)} style={{
            width: 28, height: 28, border: "none", borderRadius: 5,
            background: getBg(q.id, i), color: "#fff",
            fontFamily: RACING, fontSize: "0.65rem", cursor: "pointer",
            outline: i === currentIdx ? `3px solid ${BRAND_TEAL_DK}` : "none",
            outlineOffset: 2,
          }}>
            {q.id}
          </button>
        ))}
      </div>

      {/* Legend */}
      {[
        { color: BRAND_TEAL, label: "Answered" },
        { color: "#dc2626",  label: "Not Answered" },
        { color: "#94a3b8",  label: "Not Visited" },
        { color: "#7c3aed",  label: "For Review" },
      ].map(({ color, label }) => (
        <div key={label} style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 4, fontSize: "0.65rem", color: BRAND_TEAL_DK }}>
          <div style={{ width: 14, height: 14, borderRadius: 3, background: color, flexShrink: 0 }} />
          {label}
        </div>
      ))}
    </div>
  );
}

// ─── Test Page ────────────────────────────────────────────────────────────────
function TestPage({
  onSubmit,
}: {
  onSubmit: (r: {
    score: number; answers: Record<number, string>;
    questions: typeof QUESTIONS; timeUp: boolean; timeLeft: number;
  }) => void;
}) {
  const [currentIdx,  setCurrentIdx]  = useState(0);
  const [answers,     setAnswers]     = useState<Record<number, string>>({});
  const [statuses,    setStatuses]    = useState<Record<number, QuestionStatus>>(() => {
    const s: Record<number, QuestionStatus> = {};
    QUESTIONS.forEach(q => { s[q.id] = "not-visited"; });
    return s;
  });
  const [markedReview, setMarkedReview] = useState<Record<number, boolean>>({});
  const [inputValue,   setInputValue]   = useState("");
  const [feedback,     setFeedback]     = useState<{ type: "correct" | "wrong"; message: string } | null>(null);
  const [isAnimating,  setIsAnimating]  = useState(false);
  const [timeLeft,     setTimeLeft]     = useState(TOTAL_TIME);
  const [timedOut,     setTimedOut]     = useState(false);
  const scoreRef = useRef(0);

  const q       = QUESTIONS[currentIdx];
  const marking = getMarking(q.stage);
  const isLast  = currentIdx === QUESTIONS.length - 1;
  const progress = (currentIdx / QUESTIONS.length) * 100;

  // Timer
  useEffect(() => {
    if (timedOut) return;
    if (timeLeft <= 0) {
      setTimedOut(true);
      onSubmit({ score: scoreRef.current, answers, questions: QUESTIONS, timeUp: true, timeLeft: 0 });
      return;
    }
    const id = setInterval(() => setTimeLeft(t => t - 1), 1000);
    return () => clearInterval(id);
  }, [timeLeft, timedOut]);

  // Focus input when question changes
  useEffect(() => {
    const el = document.getElementById("answer-input") as HTMLInputElement | null;
    if (el) el.focus();
  }, [currentIdx]);

  const setStatus = (id: number, st: QuestionStatus) =>
    setStatuses(prev => ({ ...prev, [id]: st }));

  const jumpTo = (idx: number) => {
    if (isAnimating) return;
    const cur = QUESTIONS[currentIdx];
    if ((statuses[cur.id] || "not-visited") === "not-visited") setStatus(cur.id, "not-answered");
    setCurrentIdx(idx);
    setInputValue(answers[QUESTIONS[idx].id] || "");
    setFeedback(null);
  };

  const handleSubmit = useCallback(() => {
    if (isAnimating || timedOut) return;
    const trimmed = inputValue.trim();
    if (!trimmed) {
      setFeedback({ type: "wrong", message: "Please enter an answer!" });
      setTimeout(() => setFeedback(null), 1500);
      return;
    }
    const parsed    = parseFloat(trimmed.replace(",", "."));
    const isCorrect = !isNaN(parsed) && Math.abs(parsed - q.answer) < 0.01;
    const points    = isCorrect ? marking.correct : marking.incorrect;

    scoreRef.current += points;
    const newAnswers = { ...answers, [q.id]: trimmed };
    setAnswers(newAnswers);
    setStatus(q.id, "answered");
    setMarkedReview(prev => ({ ...prev, [q.id]: false }));

    setFeedback({
      type: isCorrect ? "correct" : "wrong",
      message: isCorrect
        ? `✅ Correct! +${points} point${points !== 1 ? "s" : ""}`
        : `❌ Wrong! ${points} points. Answer: ${q.answer}`,
    });
    setIsAnimating(true);

    setTimeout(() => {
      if (isLast) {
        onSubmit({ score: scoreRef.current, answers: newAnswers, questions: QUESTIONS, timeUp: false, timeLeft });
      } else {
        const next = QUESTIONS[currentIdx + 1];
        setCurrentIdx(prev => prev + 1);
        setInputValue(answers[next.id] || "");
        setFeedback(null);
        setIsAnimating(false);
      }
    }, 1800);
  }, [inputValue, currentIdx, isAnimating, isLast, q, marking, answers, onSubmit, timedOut, timeLeft]);

  const toggleMark = () => {
    const isMarked = !!markedReview[q.id];
    setMarkedReview(prev => ({ ...prev, [q.id]: !isMarked }));
    if (!isMarked) setStatus(q.id, "review");
    else setStatus(q.id, answers[q.id] ? "answered" : "not-answered");
  };

  const clearAnswer = () => {
    setInputValue("");
    setAnswers(prev => { const n = { ...prev }; delete n[q.id]; return n; });
    setStatus(q.id, "not-answered");
  };

  const stageLabel = q.stage === 1 ? "Section A — Addition & Subtraction" : "Section B — Multiply / Divide / Fractions";
  const isMarked = !!markedReview[q.id];

  return (
    <div style={{ minHeight: "100vh", background: `linear-gradient(160deg,#f0fdf9 0%,#fff 60%,#e8f9f8 100%)`, fontFamily: OUTFIT, display: "flex", flexDirection: "column" }}>
      <style>{GLOBAL_STYLES}</style>

      {/* ── TOP HEADER ── */}
      <div style={{ background: `linear-gradient(135deg,${BRAND_TEAL_DK} 0%,${BRAND_TEAL} 100%)`, color: "#fff" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "8px 14px", borderBottom: "2px solid rgba(255,255,255,0.15)" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{ fontSize: "1.6rem", animation: "rocketBob 3s ease-in-out infinite" }}>🚀</div>
            <div>
              <div style={{ fontFamily: RACING, fontSize: "1rem", letterSpacing: "0.5px" }}>Logicology Test</div>
              <div style={{ fontSize: "0.6rem", color: "rgba(255,255,255,0.7)" }}>Computer Based Test &nbsp;|&nbsp; Numerical Value Questions</div>
            </div>
          </div>
          <TimerDisplay timeLeft={timeLeft} />
          <div style={{ background: "rgba(255,255,255,0.15)", borderRadius: 20, padding: "4px 12px", fontFamily: RACING, fontSize: "0.9rem" }}>
            Score: {scoreRef.current}
          </div>
        </div>
        {/* Progress bar */}
        <div style={{ padding: "6px 14px 8px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4, fontSize: "0.65rem", opacity: 0.8 }}>
            <span style={{ fontFamily: RACING }}>Question {currentIdx + 1} / 20</span>
            <span>Stage 1: +1/−4 &nbsp;|&nbsp; Stage 2: +2/−8</span>
          </div>
          <div style={{ height: 6, background: "rgba(255,255,255,0.2)", borderRadius: 99, overflow: "hidden" }}>
            <div style={{
              height: "100%", borderRadius: 99,
              width: `${progress}%`,
              background: q.stage === 1 ? "#26a9e0" : "#F5A623",
              transition: "width 0.4s ease",
            }} />
          </div>
        </div>
      </div>

      {/* ── STATUS BAR ── */}
      <StatusBar statuses={statuses} markedReview={markedReview} />

      {/* ── MAIN ── */}
      <div style={{ display: "flex", flex: 1 }}>

        {/* Question Panel */}
        <div style={{
          flex: 1, padding: "12px 14px", background: "#fff",
          borderRight: `2px solid ${BRAND_TEAL}22`,
          display: "flex", flexDirection: "column", gap: 10, minWidth: 0,
        }}>
          {/* Section tabs */}
          <div style={{ display: "flex", borderBottom: `2px solid ${BRAND_TEAL}`, marginBottom: 2 }}>
            {["Section A (Q1–10)  +1 / −4", "Section B (Q11–20)  +2 / −8"].map((label, i) => (
              <div key={i} style={{
                padding: "5px 14px", fontFamily: RACING, fontSize: "0.65rem",
                background: q.stage === i + 1 ? BRAND_TEAL : "#e8f9f8",
                color: q.stage === i + 1 ? "#fff" : BRAND_TEAL,
                border: `1px solid ${BRAND_TEAL}44`,
              }}>
                {label}
              </div>
            ))}
          </div>
          <div style={{ fontSize: "0.65rem", color: "#64748b", marginBottom: 2 }}>{stageLabel}</div>

          {/* Q header */}
          <div style={{
            background: `linear-gradient(90deg,#e8f9f8,#f0fdf9)`,
            border: `1px solid ${BRAND_TEAL}33`, borderRadius: 8,
            padding: "7px 12px", display: "flex", alignItems: "center", justifyContent: "space-between",
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <div style={{
                background: BRAND_TEAL_DK, color: "#fff",
                fontFamily: RACING, fontSize: "0.75rem",
                padding: "3px 12px", borderRadius: 20,
              }}>
                Q.{q.id}
              </div>
              <span style={{ fontSize: "0.65rem", color: "#64748b" }}>of 20</span>
            </div>
            <div style={{ fontSize: "0.65rem", color: "#555" }}>
              Marks: <span style={{ color: "#059669", fontWeight: 700 }}>+{marking.correct}</span>
              &nbsp;|&nbsp;
              Negative: <span style={{ color: "#dc2626", fontWeight: 700 }}>{marking.incorrect}</span>
            </div>
            {isMarked && (
              <div style={{
                background: "#7c3aed", color: "#fff",
                fontSize: "0.6rem", padding: "2px 8px",
                borderRadius: 12, fontWeight: 700,
              }}>
                MARKED FOR REVIEW
              </div>
            )}
          </div>

          {/* Question body */}
          <div style={{
            fontFamily: RACING, fontSize: "clamp(1.5rem,4vw,2.2rem)",
            textAlign: "center", padding: "22px 12px",
            background: `linear-gradient(135deg,#f0fdf9,#e8f9f8)`,
            border: `2px solid ${BRAND_TEAL}33`, borderRadius: 12,
            color: BRAND_TEAL_DK, minHeight: 90,
            display: "flex", alignItems: "center", justifyContent: "center",
            lineHeight: 1.3, animation: "slideIn 0.3s ease",
          }}>
            {q.display} &nbsp;= &nbsp;?
          </div>

          {/* Input */}
          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            <div style={{ fontSize: "0.7rem", color: BRAND_TEAL_DK, fontWeight: 700 }}>Enter your numerical answer:</div>
            <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
              <input
                id="answer-input"
                type="text"
                inputMode="numeric"
                value={inputValue}
                onChange={e => setInputValue(e.target.value)}
                onKeyDown={e => { if (e.key === "Enter") { e.preventDefault(); handleSubmit(); } }}
                placeholder="____"
                autoFocus
                style={{
                  border: `2px solid ${feedback ? (feedback.type === "correct" ? "#059669" : "#dc2626") : BRAND_TEAL}`,
                  borderRadius: 8, padding: "9px 14px",
                  fontSize: "1.2rem", fontFamily: RACING, textAlign: "center",
                  width: 160, color: BRAND_TEAL_DK, outline: "none",
                  background: feedback ? (feedback.type === "correct" ? "#ecfdf5" : "#fef2f2") : "#fff",
                  transition: "border-color 0.2s, background 0.2s",
                  animation: feedback?.type === "wrong" && !feedback.message.includes("Please") ? "shake 0.3s ease" : "none",
                }}
              />
              <button onClick={handleSubmit} disabled={isAnimating} style={{
                background: BRAND_TEAL, color: "#fff", border: "none",
                borderRadius: 8, padding: "9px 14px", fontSize: "0.7rem",
                fontWeight: 700, cursor: isAnimating ? "not-allowed" : "pointer",
                opacity: isAnimating ? 0.7 : 1, fontFamily: OUTFIT,
              }}>
                {isLast ? "🏁 SUBMIT" : "SAVE & NEXT"}
              </button>
              <button onClick={clearAnswer} style={{
                background: "#fff", color: "#dc2626",
                border: "2px solid #dc2626", borderRadius: 8,
                padding: "9px 12px", fontSize: "0.7rem", fontWeight: 700, cursor: "pointer",
              }}>
                CLEAR
              </button>
            </div>
            <div style={{ fontSize: "0.6rem", color: "#94a3b8" }}>Press Enter to save and proceed</div>
          </div>

          {/* Feedback */}
          {feedback && (
            <div style={{
              padding: "9px 14px", borderRadius: 10,
              fontFamily: RACING, fontSize: "0.8rem", textAlign: "center",
              animation: "popIn 0.25s ease",
              background: feedback.type === "correct" ? "#ecfdf5" : "#fef2f2",
              border: `1px solid ${feedback.type === "correct" ? "#059669" : "#dc2626"}`,
              color: feedback.type === "correct" ? "#065f46" : "#991b1b",
            }}>
              {feedback.message}
            </div>
          )}

          {/* Action row */}
          <div style={{
            display: "flex", gap: 6, flexWrap: "wrap",
            marginTop: "auto", paddingTop: 10, borderTop: "1px solid #e2e8f0",
          }}>
            <button onClick={toggleMark} style={{
              background: "#7c3aed", color: "#fff", border: "none",
              borderRadius: 8, padding: "7px 12px", fontSize: "0.65rem",
              fontWeight: 700, cursor: "pointer",
            }}>
              {isMarked ? "UNMARK" : "MARK FOR REVIEW"}
            </button>
            <button onClick={() => jumpTo(currentIdx - 1)} disabled={currentIdx === 0} style={{
              background: "#e2e8f0", color: BRAND_TEAL_DK, border: "none",
              borderRadius: 8, padding: "7px 12px", fontSize: "0.65rem",
              fontWeight: 700, cursor: currentIdx === 0 ? "not-allowed" : "pointer",
              opacity: currentIdx === 0 ? 0.4 : 1,
            }}>
              ← PREV
            </button>
            <button onClick={() => jumpTo(currentIdx + 1)} disabled={isLast} style={{
              background: BRAND_TEAL, color: "#fff", border: "none",
              borderRadius: 8, padding: "7px 12px", fontSize: "0.65rem",
              fontWeight: 700, cursor: isLast ? "not-allowed" : "pointer",
              opacity: isLast ? 0.4 : 1,
            }}>
              NEXT →
            </button>
            <button
              onClick={() => { if (window.confirm("Submit test? This cannot be undone.")) onSubmit({ score: scoreRef.current, answers, questions: QUESTIONS, timeUp: false, timeLeft }); }}
              style={{
                background: BRAND_TEAL_DK, color: "#fff", border: "none",
                borderRadius: 8, padding: "7px 14px", fontSize: "0.65rem",
                fontWeight: 700, cursor: "pointer", marginLeft: "auto",
                animation: "pulse 2s ease-in-out infinite",
              }}
            >
              SUBMIT TEST 🏁
            </button>
          </div>
        </div>

        {/* Palette */}
        <QuestionPalette
          currentIdx={currentIdx}
          statuses={statuses}
          markedReview={markedReview}
          onJump={jumpTo}
        />
      </div>
    </div>
  );
}

// ─── Results Page ─────────────────────────────────────────────────────────────
function ResultsPage({
  result, onRetry, onMenu,
}: {
  result: { score: number; answers: Record<number, string>; questions: typeof QUESTIONS; timeUp: boolean; timeLeft: number };
  onRetry: () => void;
  onMenu:  () => void;
}) {
  const [visible, setVisible] = useState(false);
  useEffect(() => { const t = setTimeout(() => setVisible(true), 80); return () => clearTimeout(t); }, []);

  const { score, answers, questions, timeUp, timeLeft } = result;
  const timeUsed = TOTAL_TIME - timeLeft;

  const detailed = questions.map(q => {
    const userAnswer = answers[q.id] ?? "";
    const parsed     = parseFloat(userAnswer.replace(",", "."));
    const attempted  = userAnswer !== "";
    const correct    = attempted && !isNaN(parsed) && Math.abs(parsed - q.answer) < 0.01;
    const m          = getMarking(q.stage);
    const points     = !attempted ? 0 : correct ? m.correct : m.incorrect;
    return { ...q, userAnswer, attempted, correct, points };
  });

  const attempted  = detailed.filter(d => d.attempted).length;
  const correct    = detailed.filter(d => d.correct).length;
  const wrong      = detailed.filter(d => d.attempted && !d.correct).length;
  const skipped    = 20 - attempted;
  const s1pts      = detailed.filter(d => d.stage === 1).reduce((s, d) => s + d.points, 0);
  const s2pts      = detailed.filter(d => d.stage === 2).reduce((s, d) => s + d.points, 0);
  const penalty    = detailed.reduce((s, d) => s + (d.attempted && !d.correct ? Math.abs(d.points) : 0), 0);

  const emoji = score >= 25 ? "🏆" : score >= 15 ? "🎉" : score >= 5 ? "👍" : "💪";
  const grade = score >= 25 ? "Outstanding!" : score >= 15 ? "Great Work!" : score >= 5 ? "Good Effort" : "Keep Practicing!";
  const gradeColor = score >= 25 ? "#059669" : score >= 15 ? BRAND_TEAL : score >= 5 ? "#d97706" : "#dc2626";

  return (
    <div style={{
      minHeight: "100vh",
      background: `linear-gradient(160deg,#f0fdf9 0%,#fff 60%,#e8f9f8 100%)`,
      fontFamily: OUTFIT,
    }}>
      <style>{GLOBAL_STYLES}</style>

      {/* Header */}
      <div style={{ background: `linear-gradient(135deg,${BRAND_TEAL_DK},${BRAND_TEAL})`, color: "#fff", padding: "10px 14px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{ fontSize: "1.6rem" }}>🚀</div>
          <div>
            <div style={{ fontFamily: RACING, fontSize: "1rem" }}>Logicology Test — Result Sheet</div>
            <div style={{ fontSize: "0.6rem", color: "rgba(255,255,255,0.7)" }}>Computer Based Test | Final Scorecard</div>
          </div>
          <div style={{
            marginLeft: "auto",
            background: timeUp ? "rgba(220,38,38,0.3)" : "rgba(5,150,105,0.3)",
            border: `1px solid ${timeUp ? "#dc2626" : "#059669"}`,
            borderRadius: 8, padding: "5px 12px", textAlign: "center",
          }}>
            <div style={{ fontSize: "0.6rem", color: "rgba(255,255,255,0.7)" }}>{timeUp ? "TIME UP" : "TIME USED"}</div>
            <div style={{ fontFamily: RACING, fontSize: "1rem" }}>{formatTime(timeUsed)}</div>
          </div>
        </div>
      </div>

      <div style={{
        maxWidth: 900, margin: "0 auto", padding: "16px 14px 48px",
        opacity: visible ? 1 : 0, transform: visible ? "translateY(0)" : "translateY(-16px)",
        transition: "opacity 0.7s, transform 0.7s",
      }}>
        {/* Score hero */}
        <div style={{
          background: "#fff", border: `2px solid ${BRAND_TEAL}33`,
          borderRadius: 16, padding: "16px 20px",
          display: "flex", alignItems: "center", gap: 16, marginBottom: 16,
        }}>
          <div style={{ fontSize: "3.5rem" }}>{emoji}</div>
          <div style={{ flex: 1 }}>
            <h1 style={{ fontFamily: RACING, fontSize: "clamp(1.4rem,4vw,2rem)", color: BRAND_TEAL, margin: "0 0 4px" }}>
              {grade}
            </h1>
            <p style={{ color: BRAND_TEAL_DK, margin: 0, fontSize: "0.9rem" }}>
              Final Score: <span style={{ fontFamily: RACING, fontSize: "1.8rem", color: gradeColor }}>{score > 0 ? `+${score}` : score}</span>
            </p>
            {timeUp && (
              <div style={{ display: "inline-block", background: "#dc2626", color: "#fff", fontFamily: RACING, fontSize: "0.7rem", padding: "3px 10px", borderRadius: 12, marginTop: 6 }}>
                ⏱ Time expired — test auto-submitted
              </div>
            )}
          </div>
          <div style={{ fontSize: "0.75rem", color: "#64748b", textAlign: "right", lineHeight: 1.8 }}>
            <div>Max possible: <strong style={{ color: "#059669" }}>+30</strong></div>
            <div>Min possible: <strong style={{ color: "#dc2626" }}>−120</strong></div>
            <div>Time: <strong>{formatTime(timeUsed)} / 5:00</strong></div>
          </div>
        </div>

        {/* Summary cards */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(150px,1fr))", gap: 12, marginBottom: 16 }}>
          {[
            { label: "ATTEMPTED",   val: `${attempted}/20`, color: BRAND_TEAL },
            { label: "CORRECT",     val: correct,           color: "#059669" },
            { label: "WRONG",       val: wrong,             color: "#dc2626" },
            { label: "SKIPPED",     val: skipped,           color: "#94a3b8" },
            { label: "STAGE 1 PTS", val: s1pts > 0 ? `+${s1pts}` : s1pts, color: "#26a9e0" },
            { label: "STAGE 2 PTS", val: s2pts > 0 ? `+${s2pts}` : s2pts, color: "#F5A623" },
            { label: "PENALTY",     val: `-${penalty}`,      color: "#dc2626" },
            { label: "TOTAL SCORE", val: score > 0 ? `+${score}` : score, color: gradeColor },
          ].map(({ label, val, color }) => (
            <div key={label} style={{
              background: "#fff", border: `1px solid ${BRAND_TEAL}22`,
              borderRadius: 10, padding: "10px 8px", textAlign: "center",
            }}>
              <div style={{ fontSize: "0.6rem", color: "#64748b", marginBottom: 4 }}>{label}</div>
              <div style={{ fontFamily: RACING, fontSize: "1.2rem", color }}>{val}</div>
            </div>
          ))}
        </div>

        {/* Review table */}
        <div style={{
          background: "#fff", border: `2px solid ${BRAND_TEAL}22`,
          borderRadius: 16, overflow: "hidden", marginBottom: 16,
        }}>
          {/* Table header */}
          <div style={{
            background: BRAND_TEAL_DK, color: "#fff",
            display: "grid", gridTemplateColumns: "48px 1fr 100px 100px 56px",
            padding: "8px 14px", fontFamily: RACING, fontSize: "0.65rem",
          }}>
            <div>Q#</div><div>Calculation</div><div>Your Answer</div><div>Correct</div><div>+/−</div>
          </div>

          {detailed.map((item, idx) => (
            <div key={item.id} style={{
              display: "grid", gridTemplateColumns: "48px 1fr 100px 100px 56px",
              padding: "7px 14px", alignItems: "center",
              background: !item.attempted ? "#f8f8f8" : idx % 2 === 0 ? "#fff" : "#f0fdf9",
              borderBottom: idx !== detailed.length - 1 ? `1px solid ${BRAND_TEAL}11` : "none",
              opacity: item.attempted ? 1 : 0.55,
            }}>
              <div style={{ fontFamily: RACING, fontSize: "0.75rem", color: BRAND_TEAL_DK }}>{item.id}</div>
              <div style={{ fontFamily: RACING, fontSize: "0.7rem" }}>{item.display} =</div>
              <div style={{
                textAlign: "center", fontWeight: 600, fontSize: "0.8rem",
                color: !item.attempted ? "#999" : item.correct ? "#059669" : "#dc2626",
              }}>
                {item.attempted ? item.userAnswer : "—"}
              </div>
              <div style={{ textAlign: "center", color: "#555", fontSize: "0.8rem" }}>{item.answer}</div>
              <div style={{
                textAlign: "center", fontFamily: RACING, fontSize: "0.75rem",
                color: !item.attempted ? "#999" : item.points > 0 ? "#059669" : "#dc2626",
              }}>
                {!item.attempted ? "—" : item.points > 0 ? `+${item.points}` : `${item.points}`}
              </div>
            </div>
          ))}

          {/* Total row */}
          <div style={{
            display: "grid", gridTemplateColumns: "48px 1fr 100px 100px 56px",
            padding: "8px 14px", background: BRAND_TEAL_DK, color: "#fff",
            fontFamily: RACING, fontSize: "0.75rem",
          }}>
            <div /><div>TOTAL SCORE</div><div /><div />
            <div style={{ textAlign: "center", color: score > 0 ? "#86efac" : "#fca5a5" }}>
              {score > 0 ? `+${score}` : score}
            </div>
          </div>
        </div>

        {/* Formula */}
        <div style={{
          background: "#e8f9f8", border: `1px solid ${BRAND_TEAL}44`,
          borderRadius: 12, padding: "10px 16px",
          textAlign: "center", fontSize: "0.8rem", color: BRAND_TEAL_DK,
          marginBottom: 20,
        }}>
          <span style={{ fontFamily: RACING }}>Scoring Formula:</span>
          {" "}Stage 1: +1/−4 &nbsp;•&nbsp; Stage 2: +2/−8<br />
          Score = (Correct₁ × 1) + (Correct₂ × 2) − (Wrong₁ × 4) − (Wrong₂ × 8)
        </div>

        {/* Buttons */}
        <div style={{ display: "flex", gap: 14, maxWidth: 400, margin: "0 auto" }}>
          <button onClick={onRetry} style={{
            flex: 1, background: BRAND_TEAL, color: "#fff",
            fontFamily: RACING, fontSize: "1rem", border: "none",
            borderRadius: 14, padding: "14px", cursor: "pointer",
          }}>
            🔄 Try Again
          </button>
          <button onClick={onMenu} style={{
            flex: 1, background: "#fff", color: BRAND_TEAL,
            fontFamily: RACING, fontSize: "1rem",
            border: `2px solid ${BRAND_TEAL}`,
            borderRadius: 14, padding: "14px", cursor: "pointer",
          }}>
            🏠 Menu
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Instructions Page ────────────────────────────────────────────────────────
function InstructionsPage({ onStart }: { onStart: () => void }) {
  const [visible, setVisible] = useState(false);
  useEffect(() => { const t = setTimeout(() => setVisible(true), 100); return () => clearTimeout(t); }, []);

  return (
    <div style={{
      minHeight: "100vh", background: `linear-gradient(160deg,#f0fdf9 0%,#fff 60%,#e8f9f8 100%)`,
      display: "flex", flexDirection: "column", alignItems: "center",
      padding: "32px 16px 48px", fontFamily: OUTFIT,
    }}>
      <style>{GLOBAL_STYLES}</style>

      <div style={{
        opacity: visible ? 1 : 0, transform: visible ? "translateY(0)" : "translateY(-20px)",
        transition: "opacity 0.7s, transform 0.7s", textAlign: "center", marginBottom: 28,
      }}>
        <div style={{ fontSize: "3rem", animation: "rocketBob 3s ease-in-out infinite" }}>🚀</div>
        <h1 style={{ fontFamily: RACING, fontSize: "clamp(2rem,6vw,3rem)", color: BRAND_TEAL, margin: "8px 0 4px" }}>
          Logicology Test
        </h1>
        <p style={{ color: BRAND_TEAL_DK, fontWeight: 600 }}>Speed Mathematics • Computer Based Test</p>
      </div>

      <div style={{
        width: "100%", maxWidth: 700, background: "#fff",
        borderRadius: 24, border: `3px solid ${BRAND_TEAL}`,
        boxShadow: `0 8px 40px rgba(10,138,128,0.10)`,
        padding: "clamp(20px,4vw,36px)",
        opacity: visible ? 1 : 0, transform: visible ? "translateY(0)" : "translateY(20px)",
        transition: "opacity 0.7s ease 0.2s, transform 0.7s ease 0.2s",
      }}>
        <h2 style={{ fontFamily: RACING, color: BRAND_TEAL, fontSize: "1.3rem", marginTop: 0, marginBottom: 16 }}>
          📋 General Instructions
        </h2>

        {[
          { num: "1", text: "20 questions in total. One appears at a time. You cannot go back to previous questions." },
          { num: "⏱", text: "You have 5 minutes for the entire test. When time expires, the test ends automatically and your score is calculated from answers given.", numBg: "#dc2626" },
          { num: "2", text: null, isScoring: true },
          { num: "3", text: "Your final score is the sum of all points earned. Negative scores are possible if many answers are wrong." },
          { num: "4", text: "Use the Question Palette (right panel) to navigate. Mark questions for review using the purple button." },
          { num: "5", text: "The timer starts immediately when you click Start. You will see instant feedback after each answer." },
        ].map((item, i) => (
          <div key={i} style={{ display: "flex", gap: 14, marginBottom: 18 }}>
            <div style={{
              minWidth: 30, height: 30, borderRadius: "50%",
              background: item.numBg || BRAND_TEAL, color: "#fff",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontFamily: RACING, fontSize: "0.75rem", flexShrink: 0,
            }}>
              {item.num}
            </div>
            {item.isScoring ? (
              <div style={{ flex: 1 }}>
                <p style={{ margin: "0 0 8px", color: BRAND_TEAL_DK, fontWeight: 700, fontSize: "0.9rem" }}>Marking Scheme:</p>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
                  <div style={{ background: "#eff9fd", borderRadius: 12, padding: "10px 14px", border: "1px solid #26a9e033" }}>
                    <p style={{ margin: "0 0 4px", fontFamily: RACING, color: "#26a9e0", fontSize: "0.75rem" }}>📘 Stage 1 (Q1–10)</p>
                    <p style={{ margin: 0, fontSize: "0.8rem" }}>✓ Correct: <strong>+1</strong> &nbsp;|&nbsp; ✗ Wrong: <strong>−4</strong></p>
                  </div>
                  <div style={{ background: "#FFF8EC", borderRadius: 12, padding: "10px 14px", border: "1px solid #F5A62333" }}>
                    <p style={{ margin: "0 0 4px", fontFamily: RACING, color: "#F5A623", fontSize: "0.75rem" }}>⭐ Stage 2 (Q11–20)</p>
                    <p style={{ margin: 0, fontSize: "0.8rem" }}>✓ Correct: <strong>+2</strong> &nbsp;|&nbsp; ✗ Wrong: <strong>−8</strong></p>
                  </div>
                </div>
              </div>
            ) : (
              <p style={{ margin: 0, color: BRAND_TEAL_DK, fontSize: "0.9rem", lineHeight: 1.5 }}>{item.text}</p>
            )}
          </div>
        ))}
      </div>

      <button onClick={onStart} style={{
        marginTop: 28, width: "100%", maxWidth: 340,
        background: BRAND_TEAL, color: "#fff",
        fontFamily: RACING, fontSize: "1.4rem",
        border: "none", borderRadius: 18, padding: "16px",
        cursor: "pointer", boxShadow: `0 8px 32px ${BRAND_TEAL}55`,
        animation: "pulse 2s ease-in-out infinite",
      }}>
        🚀 Start Test!
      </button>
    </div>
  );
}

// ─── Main App ─────────────────────────────────────────────────────────────────
export default function SpeedMathsTestPage() {
  const [page,   setPage]   = useState<"splash" | "instructions" | "test" | "results">("splash");
  const [result, setResult] = useState<{
    score: number; answers: Record<number, string>;
    questions: typeof QUESTIONS; timeUp: boolean; timeLeft: number;
  } | null>(null);

  if (page === "splash")
    return <Splash onDone={() => setPage("instructions")} />;
  if (page === "instructions")
    return <InstructionsPage onStart={() => setPage("test")} />;
  if (page === "test")
    return <TestPage onSubmit={res => { setResult(res); setPage("results"); }} />;
  if (page === "results" && result)
    return <ResultsPage result={result} onRetry={() => setPage("test")} onMenu={() => setPage("instructions")} />;
  return null;
}
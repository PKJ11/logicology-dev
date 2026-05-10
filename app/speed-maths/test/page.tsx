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
  @keyframes slideDown { from{opacity:0;transform:translateY(-12px)} to{opacity:1;transform:translateY(0)} }

  .palette-drawer { display: none; }
  .palette-sidebar { display: flex; }
  .palette-toggle-btn { display: none; }

  @media (max-width: 640px) {
    .palette-sidebar { display: none !important; }
    .palette-toggle-btn { display: flex !important; }
    .palette-drawer { display: block; }
  }
`;

function formatTime(s: number) {
  const m = Math.floor(s / 60);
  const sec = s % 60;
  return `${m}:${String(sec).padStart(2, "0")}`;
}

function parseFractionToDecimal(input: string): number | null {
  const trimmed = input.trim();
  
  // Handle fractions like "5/24", "1/2", "-3/4"
  if (trimmed.includes('/')) {
    const parts = trimmed.split('/');
    if (parts.length === 2) {
      const numerator = parseFloat(parts[0].trim());
      const denominator = parseFloat(parts[1].trim());
      
      if (!isNaN(numerator) && !isNaN(denominator) && denominator !== 0) {
        return numerator / denominator;
      }
    }
    return null;
  }
  
  // Handle decimal numbers (including comma as decimal separator)
  const decimalValue = parseFloat(trimmed.replace(",", "."));
  if (!isNaN(decimalValue)) {
    return decimalValue;
  }
  
  return null;
}

function isAnswerCorrect(userInput: string, correctAnswer: number): boolean {
  const numericValue = parseFractionToDecimal(userInput);
  if (numericValue === null) return false;
  
  // Use tolerance for floating point comparisons
  // For fractions like 5/24 = 0.208333..., tolerance of 0.001 is sufficient
  return Math.abs(numericValue - correctAnswer) < 0.001;
}

type QuestionStatus = "not-visited" | "not-answered" | "answered" | "review";

// ─── Question Banks (4 sets × 20 questions) ──────────────────────────────────
// Each set has questions indexed 0–19 (slot 0 = Q1, slot 19 = Q20)
// stage: 1 = Section A (slots 0–9), 2 = Section B (slots 10–19)

type QuestionDef = {
  display: string;
  answer: number;
};

const QUESTION_SETS: Record<"A" | "B" | "C" | "D", QuestionDef[]> = {
  A: [
    // Section A — slots 0–9
    { display: "13 + 14 + 15 + 16 + 17",               answer: 75    },
    { display: "76 + 32 + 56 + 19",                     answer: 183   },
    { display: "238 + 579",                             answer: 817   },
    { display: "12 + 24 + 7 + 28 + 43 + 21 + 61 + 19", answer: 215   },
    { display: "214 + 786",                             answer: 1000  },
    { display: "96 − 19",                               answer: 77    },
    { display: "719 − 587",                             answer: 132   },
    { display: "621 − 279",                             answer: 342   },
    { display: "123 + 376 − 39",                        answer: 460   },
    { display: "86 − 39",                               answer: 47    },
    // Section B — slots 10–19
    { display: "112 × 25",                              answer: 2800  },
    { display: "452 × 11",                              answer: 4972  },
    { display: "91 × 93",                               answer: 8463  },
    { display: "343 ÷ 7",                               answer: 49    },
    { display: "1001 ÷ 77",                             answer: 13    },
    { display: "¼ of 36 + ⅙ of 66",                    answer: 20    },
    { display: "⅛ of 144 − ⅓ of 36",                   answer: 6     },
    { display: "40% of 240 − 30% of 120",               answer: 60    },
    { display: "⅙ + ⅛ − 1/12",                         answer: 5/24  },
    { display: "20% of 750 − 60% of 500",               answer: -150  },
  ],
  B: [
    { display: "15 + 16 + 17 + 18 + 19",               answer: 85    },
    { display: "76 + 23 + 16 + 49",                     answer: 164   },
    { display: "438 + 379",                             answer: 817   },
    { display: "12 + 61 + 7 + 38 + 13 + 21 + 61 + 19", answer: 232   },
    { display: "314 + 486",                             answer: 800   },
    { display: "86 − 29",                               answer: 57    },
    { display: "819 − 387",                             answer: 432   },
    { display: "421 − 179",                             answer: 242   },
    { display: "723 + 416 − 39",                        answer: 1100  },
    { display: "86 − 39",                               answer: 47    },
    { display: "124 × 25",                              answer: 3100  },
    { display: "432 × 11",                              answer: 4752  },
    { display: "93 × 96",                               answer: 8928  },
    { display: "729 ÷ 9",                               answer: 81    },
    { display: "1001 ÷ 77",                             answer: 13    },
    { display: "¼ of 44 + ⅙ of 54",                    answer: 20    },
    { display: "⅛ of 128 − ⅓ of 42",                   answer: 2     },
    { display: "30% of 240 − 40% of 120",               answer: 24    },
    { display: "⅛ + 1/12 − 1/16",                      answer: 7/48 },
    { display: "20% of 450 − 50% of 150",               answer: 15    },
  ],
  C: [
    { display: "21 + 22 + 23 + 24 + 25",               answer: 115   },
    { display: "67 + 37 + 16 + 72",                     answer: 192   },
    { display: "257 + 638",                             answer: 895   },
    { display: "14 + 25 + 7 + 29 + 41 + 23 + 65 + 17", answer: 221   },
    { display: "234 + 897",                             answer: 1131  },
    { display: "94 − 18",                               answer: 76    },
    { display: "745 − 587",                             answer: 158   },
    { display: "621 − 285",                             answer: 336   },
    { display: "127 + 348 − 43",                        answer: 432   },
    { display: "88 − 39",                               answer: 49    },
    { display: "116 × 25",                              answer: 2900  },
    { display: "672 × 11",                              answer: 7392  },
    { display: "91 × 96",                               answer: 8736  },
    { display: "512 ÷ 8",                               answer: 64    },
    { display: "3003 ÷ 77",                             answer: 39    },
    { display: "⅕ of 45 + 1/7 of 77",                  answer: 20    },
    { display: "⅛ of 128 − ¼ of 36",                   answer: 7     },
    { display: "40% of 250 − 35% of 120",               answer: 58    },
    { display: "¼ + ⅛ − ⅙",                            answer: 5/24  },
    { display: "20% of 550 − 60% of 150",               answer: 20    },
  ],
  D: [
    { display: "23 + 24 + 25 + 26 + 27",               answer: 124   },
    { display: "78 + 23 + 14 + 57",                     answer: 172   },
    { display: "456 + 379",                             answer: 835   },
    { display: "13 + 68 + 9 + 37 + 16 + 24 + 62 + 19", answer: 248   },
    { display: "324 + 486",                             answer: 810   },
    { display: "94 − 28",                               answer: 66    },
    { display: "826 − 388",                             answer: 438   },
    { display: "467 − 198",                             answer: 269   },
    { display: "752 + 416 − 48",                        answer: 1120  },
    { display: "97 − 39",                               answer: 58    },
    { display: "132 × 25",                              answer: 3300  },
    { display: "451 × 11",                              answer: 4961  },
    { display: "93 × 97",                               answer: 9021  },
    { display: "512 ÷ 8",                               answer: 64    },
    { display: "3003 ÷ 77",                             answer: 39    },
    { display: "¼ of 48 + ⅙ of 66",                    answer: 23    },
    { display: "⅛ of 112 − ⅓ of 36",                   answer: 2     },
    { display: "30% of 250 − 40% of 150",               answer: 15    },
    { display: "⅓ + 1/9 − ⅙",                          answer: 5/18  },
    { display: "20% of 700 − 80% of 150",               answer: 20    },
  ],
};

const SET_KEYS: Array<"A" | "B" | "C" | "D"> = ["A", "B", "C", "D"];

/**
 * Build a randomised 20-question paper for one user.
 * For each slot (0–19) we pick a random set independently.
 * Returns an array of 20 question objects with id, display, answer, stage, and setLabel.
 */
function buildPaper(): Array<{
  id: number;
  display: string;
  answer: number;
  stage: 1 | 2;
  setLabel: "A" | "B" | "C" | "D";
}> {
  return Array.from({ length: 20 }, (_, slot) => {
    const setKey = SET_KEYS[Math.floor(Math.random() * 4)];
    const q = QUESTION_SETS[setKey][slot];
    return {
      id: slot + 1,
      display: q.display,
      answer: q.answer,
      stage: slot < 10 ? 1 : 2,
      setLabel: setKey,
    };
  });
}

function getMarking(stage: number) {
  return stage === 1 ? { correct: 1, incorrect: -1 } : { correct: 2, incorrect: -2 };
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

// ─── Username Collection Page ────────────────────────────────────────────────
function UsernamePage({ onSubmit }: { onSubmit: (username: string) => void }) {
  const [username, setUsername] = useState("");
  const [visible, setVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 100);
    return () => clearTimeout(t);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!username.trim()) return;
    setIsLoading(true);
    setTimeout(() => { onSubmit(username.trim()); setIsLoading(false); }, 500);
  };

  return (
    <div style={{
      minHeight: "100vh",
      background: `linear-gradient(160deg,#f0fdf9 0%,#fff 60%,#e8f9f8 100%)`,
      display: "flex", flexDirection: "column",
      alignItems: "center", justifyContent: "center",
      padding: "32px 16px", fontFamily: OUTFIT,
    }}>
      <style>{GLOBAL_STYLES}</style>
      <div style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(-20px)",
        transition: "opacity 0.7s, transform 0.7s",
        textAlign: "center", marginBottom: 28,
      }}>
        <div style={{ fontSize: "4rem", animation: "rocketBob 3s ease-in-out infinite" }}>🚀</div>
        <h1 style={{ fontFamily: RACING, fontSize: "clamp(2rem,6vw,3rem)", color: BRAND_TEAL, margin: "8px 0 4px" }}>
          Logicology Test
        </h1>
        <p style={{ color: BRAND_TEAL_DK, fontWeight: 600 }}>Speed Mathematics • Computer Based Test</p>
      </div>

      <div style={{
        width: "100%", maxWidth: 450, background: "#fff",
        borderRadius: 24, border: `3px solid ${BRAND_TEAL}`,
        boxShadow: `0 8px 40px rgba(10,138,128,0.10)`,
        padding: "clamp(20px,4vw,36px)",
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(20px)",
        transition: "opacity 0.7s ease 0.2s, transform 0.7s ease 0.2s",
      }}>
        <h2 style={{ fontFamily: RACING, color: BRAND_TEAL, fontSize: "1.2rem", marginTop: 0, marginBottom: 20, textAlign: "center" }}>
          Enter Your Name
        </h2>
        <form onSubmit={handleSubmit}>
          <input
            type="text" value={username}
            onChange={e => setUsername(e.target.value)}
            placeholder="Enter your full name"
            autoFocus disabled={isLoading}
            style={{
              width: "100%", padding: "14px 16px", fontSize: "1rem",
              fontFamily: OUTFIT, border: `2px solid ${BRAND_TEAL}88`,
              borderRadius: 12, outline: "none", transition: "border-color 0.2s",
              boxSizing: "border-box", background: isLoading ? "#f5f5f5" : "#fff",
              marginBottom: 20,
            }}
            onFocus={e => e.target.style.borderColor = BRAND_TEAL}
            onBlur={e => e.target.style.borderColor = `${BRAND_TEAL}88`}
          />
          <button
            type="submit" disabled={!username.trim() || isLoading}
            style={{
              width: "100%",
              background: username.trim() && !isLoading ? BRAND_TEAL : "#ccc",
              color: "#fff", fontFamily: RACING, fontSize: "1.2rem",
              border: "none", borderRadius: 12, padding: "14px",
              cursor: username.trim() && !isLoading ? "pointer" : "not-allowed",
              transition: "background 0.2s",
            }}
          >
            {isLoading ? "Loading..." : "Continue to Instructions →"}
          </button>
        </form>
      </div>
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
function StatusBar({ statuses, markedReview, questions }: {
  statuses: Record<number, QuestionStatus>;
  markedReview: Record<number, boolean>;
  questions: ReturnType<typeof buildPaper>;
}) {
  let answered = 0, notAnswered = 0, notVisited = 0, review = 0;
  questions.forEach(q => {
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
      {pill("Answered",     answered,    BRAND_TEAL)}
      {pill("Not Answered", notAnswered, "#dc2626")}
      {pill("Not Visited",  notVisited,  "#94a3b8")}
      {pill("For Review",   review,      "#7c3aed")}
      <div style={{ marginLeft: "auto", fontSize: "0.7rem", color: "#64748b" }}>
        Total: <strong>20 Q</strong>
      </div>
    </div>
  );
}

// ─── Palette Content ──────────────────────────────────────────────────────────
function PaletteContent({
  currentIdx, statuses, markedReview, onJump, questions,
}: {
  currentIdx: number;
  statuses: Record<number, QuestionStatus>;
  markedReview: Record<number, boolean>;
  onJump: (idx: number) => void;
  questions: ReturnType<typeof buildPaper>;
}) {
  const SET_COLORS: Record<string, string> = { A: "#0A8A80", B: "#7c3aed", C: "#d97706", D: "#059669" };

  const getBg = (id: number) => {
    if (markedReview[id]) return "#7c3aed";
    const st = statuses[id] || "not-visited";
    if (st === "answered")     return BRAND_TEAL;
    if (st === "not-answered") return "#dc2626";
    return "#94a3b8";
  };

  return (
    <>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(5,1fr)", gap: 4, marginBottom: 10 }}>
        {questions.map((q, i) => (
          <button key={q.id} onClick={() => onJump(i)} title={`Q${q.id} — Set ${q.setLabel}`} style={{
            width: 28, height: 28, border: "none", borderRadius: 5,
            background: getBg(q.id), color: "#fff",
            fontFamily: RACING, fontSize: "0.65rem", cursor: "pointer",
            outline: i === currentIdx ? `3px solid ${BRAND_TEAL_DK}` : "none",
            outlineOffset: 2, position: "relative",
          }}>
            {q.id}
            {/* tiny set badge */}
            {/* <span style={{
              position: "absolute", top: -4, right: -4,
              background: SET_COLORS[q.setLabel],
              border: "1px solid #fff",
              color: "#fff", fontSize: "0.45rem",
              borderRadius: 3, padding: "0 2px",
              fontFamily: OUTFIT, fontWeight: 700, lineHeight: 1.4,
            }}>
              {q.setLabel}
            </span> */}
          </button>
        ))}
      </div>

      {/* Legend */}
      <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 8 }}>
        {[
          { color: BRAND_TEAL, label: "Answered" },
          { color: "#dc2626",  label: "Not Answered" },
          { color: "#94a3b8",  label: "Not Visited" },
          { color: "#7c3aed",  label: "For Review" },
        ].map(({ color, label }) => (
          <div key={label} style={{ display: "flex", alignItems: "center", gap: 5, fontSize: "0.65rem", color: BRAND_TEAL_DK }}>
            <div style={{ width: 12, height: 12, borderRadius: 3, background: color, flexShrink: 0 }} />
            {label}
          </div>
        ))}
      </div>

      
      {/* <div style={{ borderTop: "1px solid #e2e8f0", paddingTop: 6 }}>
        <div style={{ fontSize: "0.6rem", color: "#64748b", marginBottom: 4 }}>Badge = Question Set</div>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
          {(["A","B","C","D"] as const).map(s => (
            <div key={s} style={{ display: "flex", alignItems: "center", gap: 4, fontSize: "0.6rem", color: BRAND_TEAL_DK }}>
              <div style={{ width: 14, height: 14, borderRadius: 3, background: { A: BRAND_TEAL, B: "#7c3aed", C: "#d97706", D: "#059669" }[s], flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontSize: "0.5rem", fontWeight: 700 }}>
                {s}
              </div>
              Set {s}
            </div>
          ))}
        </div>
      </div> */}
    </>
  );
}

// ─── Desktop Sidebar ──────────────────────────────────────────────────────────
function QuestionPalette(props: {
  currentIdx: number;
  statuses: Record<number, QuestionStatus>;
  markedReview: Record<number, boolean>;
  onJump: (idx: number) => void;
  questions: ReturnType<typeof buildPaper>;
}) {
  return (
    <div className="palette-sidebar" style={{
      width: 196, background: "#f0fdf9",
      borderLeft: `2px solid ${BRAND_TEAL}33`,
      padding: 10, flexShrink: 0, flexDirection: "column",
    }}>
      <div style={{
        background: BRAND_TEAL_DK, color: "#fff",
        fontFamily: RACING, fontSize: "0.7rem",
        textAlign: "center", padding: "5px",
        borderRadius: 6, marginBottom: 8, letterSpacing: "0.5px",
      }}>
        QUESTION PALETTE
      </div>
      <PaletteContent {...props} />
    </div>
  );
}

// ─── Mobile Drawer ────────────────────────────────────────────────────────────
function MobilePaletteDrawer(props: {
  open: boolean; onClose: () => void;
  currentIdx: number;
  statuses: Record<number, QuestionStatus>;
  markedReview: Record<number, boolean>;
  onJump: (idx: number) => void;
  questions: ReturnType<typeof buildPaper>;
}) {
  if (!props.open) return null;
  return (
    <div className="palette-drawer" style={{
      position: "absolute", top: 0, left: 0, right: 0, zIndex: 100,
      background: "#f0fdf9", borderBottom: `2px solid ${BRAND_TEAL}`,
      boxShadow: "0 8px 32px rgba(10,138,128,0.18)",
      animation: "slideDown 0.25s ease", padding: "10px 14px 14px",
    }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 10 }}>
        <div style={{
          background: BRAND_TEAL_DK, color: "#fff", fontFamily: RACING,
          fontSize: "0.7rem", padding: "5px 14px", borderRadius: 6, letterSpacing: "0.5px",
        }}>
          QUESTION PALETTE
        </div>
        <button onClick={props.onClose} style={{
          background: "#dc2626", color: "#fff", border: "none",
          borderRadius: 8, padding: "5px 12px", fontFamily: RACING, fontSize: "0.7rem", cursor: "pointer",
        }}>
          ✕ CLOSE
        </button>
      </div>
      <PaletteContent {...props} onJump={idx => { props.onJump(idx); props.onClose(); }} />
    </div>
  );
}

// ─── Test Page ────────────────────────────────────────────────────────────────
type Paper = ReturnType<typeof buildPaper>;
type SubmitPayload = {
  score: number;
  answers: Record<number, string>;
  questions: Paper;
  timeUp: boolean;
  timeLeft: number;
};

function TestPage({ onSubmit }: { onSubmit: (r: SubmitPayload) => void }) {
  // Build paper ONCE per mount (so it doesn't re-randomise on re-render)
  const [questions] = useState<Paper>(() => buildPaper());

  const [currentIdx,   setCurrentIdx]   = useState(0);
  const [answers,      setAnswers]      = useState<Record<number, string>>({});
  const [statuses,     setStatuses]     = useState<Record<number, QuestionStatus>>(() => {
    const s: Record<number, QuestionStatus> = {};
    // ids are 1–20
    for (let i = 1; i <= 20; i++) s[i] = "not-visited";
    return s;
  });
  const [markedReview, setMarkedReview] = useState<Record<number, boolean>>({});
  const [inputValue,   setInputValue]   = useState("");
  const [savedFeedback,setSavedFeedback]= useState(false);
  const [isAnimating,  setIsAnimating]  = useState(false);
  const [timeLeft,     setTimeLeft]     = useState(TOTAL_TIME);
  const [timedOut,     setTimedOut]     = useState(false);
  const [paletteOpen,  setPaletteOpen]  = useState(false);

  const answersRef  = useRef<Record<number, string>>({});
  const timedOutRef = useRef(false);

  const q       = questions[currentIdx];
  const marking = getMarking(q.stage);
  const isLast  = currentIdx === questions.length - 1;
  const progress = (currentIdx / questions.length) * 100;

  useEffect(() => { answersRef.current = answers; }, [answers]);

  // Timer + auto-submit
  useEffect(() => {
    if (timedOut) return;
    if (timeLeft <= 0) {
      timedOutRef.current = true;
      setTimedOut(true);
      let finalScore = 0;
      questions.forEach(q => {
        const ua = answersRef.current[q.id];
        if (ua !== undefined && ua !== "") {
          const ok = isAnswerCorrect(ua, q.answer);
          const m = getMarking(q.stage);
          finalScore += ok ? m.correct : m.incorrect;
        }
      });
      onSubmit({ score: finalScore, answers: answersRef.current, questions, timeUp: true, timeLeft: 0 });
      return;
    }
    const id = setInterval(() => setTimeLeft(t => t - 1), 1000);
    return () => clearInterval(id);
  }, [timeLeft, timedOut, onSubmit, questions]);

  useEffect(() => {
    const el = document.getElementById("answer-input") as HTMLInputElement | null;
    if (el) el.focus();
  }, [currentIdx]);

  const setStatus = (id: number, st: QuestionStatus) =>
    setStatuses(prev => ({ ...prev, [id]: st }));

  const jumpTo = (idx: number) => {
    if (isAnimating) return;
    const cur = questions[currentIdx];
    if ((statuses[cur.id] || "not-visited") === "not-visited") setStatus(cur.id, "not-answered");
    setCurrentIdx(idx);
    setInputValue(answers[questions[idx].id] || "");
    setSavedFeedback(false);
    setPaletteOpen(false);
  };

  const handleSubmit = useCallback(() => {
    if (isAnimating || timedOut) return;
    const trimmed = inputValue.trim();
    if (!trimmed) { setSavedFeedback(false); return; }

    const newAnswers = { ...answers, [q.id]: trimmed };
    setAnswers(newAnswers);
    answersRef.current = newAnswers;
    setStatus(q.id, "answered");
    setMarkedReview(prev => ({ ...prev, [q.id]: false }));
    setSavedFeedback(true);
    setIsAnimating(true);

    setTimeout(() => {
      if (isLast) {
        let finalScore = 0;
        questions.forEach(qq => {
          const ua = newAnswers[qq.id];
          if (ua !== undefined && ua !== "") {
            const ok = isAnswerCorrect(ua, qq.answer);
            const m = getMarking(qq.stage);
            finalScore += ok ? m.correct : m.incorrect;
          }
        });
        onSubmit({ score: finalScore, answers: newAnswers, questions, timeUp: false, timeLeft });
      } else {
        const next = questions[currentIdx + 1];
        setCurrentIdx(prev => prev + 1);
        setInputValue(answers[next.id] || "");
        setSavedFeedback(false);
        setIsAnimating(false);
      }
    }, 600);
  }, [inputValue, currentIdx, isAnimating, isLast, q, answers, onSubmit, timedOut, timeLeft, questions]);

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
    setSavedFeedback(false);
  };

  const stageLabel = q.stage === 1 ? "Section A — Addition & Subtraction" : "Section B — Multiply / Divide / Fractions";
  const isMarked = !!markedReview[q.id];
  const answeredCount = Object.values(statuses).filter(s => s === "answered").length;

  const handleFinalSubmit = () => {
    if (window.confirm("Submit test? This cannot be undone.")) {
      let finalScore = 0;
      questions.forEach(qq => {
        const ua = answers[qq.id];
        if (ua !== undefined && ua !== "") {
          const ok = isAnswerCorrect(ua, qq.answer);
          const m = getMarking(qq.stage);
          finalScore += ok ? m.correct : m.incorrect;
        }
      });
      onSubmit({ score: finalScore, answers, questions, timeUp: false, timeLeft });
    }
  };

  // Set badge colour
  const SET_COLORS: Record<string, string> = { A: "#26a9e0", B: "#7c3aed", C: "#d97706", D: "#059669" };
  const setColor = SET_COLORS[q.setLabel];

  return (
    <div style={{
      minHeight: "100vh",
      background: `linear-gradient(160deg,#f0fdf9 0%,#fff 60%,#e8f9f8 100%)`,
      fontFamily: OUTFIT, display: "flex", flexDirection: "column", position: "relative",
    }}>
      <style>{GLOBAL_STYLES}</style>

      {/* TOP HEADER */}
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
        </div>
        {/* Progress */}
        <div style={{ padding: "6px 14px 8px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4, fontSize: "0.65rem", opacity: 0.8 }}>
            <span style={{ fontFamily: RACING }}>Question {currentIdx + 1} / 20</span>
            <span>Stage 1: +1/−1 &nbsp;|&nbsp; Stage 2: +2/−2</span>
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

        {/* Mobile palette toggle */}
        <div className="palette-toggle-btn" style={{
          padding: "0 14px 10px", display: "none",
          alignItems: "center", justifyContent: "space-between", gap: 8,
        }}>
          <button onClick={() => setPaletteOpen(o => !o)} style={{
            background: paletteOpen ? BRAND_TEAL_DK : "rgba(255,255,255,0.2)",
            color: "#fff", border: "1.5px solid rgba(255,255,255,0.4)",
            borderRadius: 10, padding: "6px 14px", fontFamily: RACING,
            fontSize: "0.7rem", cursor: "pointer",
            display: "flex", alignItems: "center", gap: 6, transition: "background 0.2s",
          }}>
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <rect x="0" y="0" width="5" height="5" rx="1.2" fill="white" opacity="0.9"/>
              <rect x="6.5" y="0" width="5" height="5" rx="1.2" fill="white" opacity="0.9"/>
              <rect x="0" y="6.5" width="5" height="5" rx="1.2" fill="white" opacity="0.9"/>
              <rect x="6.5" y="6.5" width="5" height="5" rx="1.2" fill="white" opacity="0.9"/>
            </svg>
            {paletteOpen ? "HIDE PALETTE" : "QUESTION PALETTE"}
            <span style={{
              background: answeredCount > 0 ? "#26a9e0" : "rgba(255,255,255,0.3)",
              borderRadius: 10, padding: "1px 7px", fontSize: "0.65rem",
              fontFamily: RACING, minWidth: 22, textAlign: "center",
            }}>
              {answeredCount}/20
            </span>
            <span style={{ fontSize: "0.75rem", transition: "transform 0.2s", transform: paletteOpen ? "rotate(180deg)" : "none" }}>▼</span>
          </button>
        </div>
      </div>

      <StatusBar statuses={statuses} markedReview={markedReview} questions={questions} />

      {/* Mobile drawer */}
      <div className="palette-drawer" style={{ position: "relative" }}>
        <MobilePaletteDrawer
          open={paletteOpen} onClose={() => setPaletteOpen(false)}
          currentIdx={currentIdx} statuses={statuses}
          markedReview={markedReview} onJump={jumpTo} questions={questions}
        />
      </div>

      {/* MAIN */}
      <div style={{ display: "flex", flex: 1 }}>
        <div style={{
          flex: 1, padding: "12px 14px", background: "#fff",
          borderRight: `2px solid ${BRAND_TEAL}22`,
          display: "flex", flexDirection: "column", gap: 10, minWidth: 0,
        }}>
          {/* Section tabs */}
          <div style={{ display: "flex", borderBottom: `2px solid ${BRAND_TEAL}` }}>
            {["Section A (Q1–10)  +1 / −1", "Section B (Q11–20)  +2 / −2"].map((label, i) => (
              <div key={i} style={{
                padding: "5px 14px", fontFamily: RACING, fontSize: "0.65rem",
                background: q.stage === i + 1 ? BRAND_TEAL : "#e8f9f8",
                color: q.stage === i + 1 ? "#fff" : BRAND_TEAL,
                border: `1px solid ${BRAND_TEAL}44`,
              }}>{label}</div>
            ))}
          </div>
          <div style={{ fontSize: "0.65rem", color: "#64748b" }}>{stageLabel}</div>

          {/* Q header */}
          <div style={{
            background: `linear-gradient(90deg,#e8f9f8,#f0fdf9)`,
            border: `1px solid ${BRAND_TEAL}33`, borderRadius: 8,
            padding: "7px 12px", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 6,
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <div style={{
                background: BRAND_TEAL_DK, color: "#fff",
                fontFamily: RACING, fontSize: "0.75rem",
                padding: "3px 12px", borderRadius: 20,
              }}>Q.{q.id}</div>
              <span style={{ fontSize: "0.65rem", color: "#64748b" }}>of 20</span>
              {/* Set badge */}
              <div style={{
                background: setColor, color: "#fff",
                fontFamily: RACING, fontSize: "0.65rem",
                padding: "2px 10px", borderRadius: 12,
                letterSpacing: "0.5px",
              }}>
                Set {q.setLabel}
              </div>
            </div>
            <div style={{ fontSize: "0.65rem", color: "#555" }}>
              Marks: <span style={{ color: "#059669", fontWeight: 700 }}>+{marking.correct}</span>
              &nbsp;|&nbsp;
              Negative: <span style={{ color: "#dc2626", fontWeight: 700 }}>{marking.incorrect}</span>
            </div>
            {isMarked && (
              <div style={{
                background: "#7c3aed", color: "#fff",
                fontSize: "0.6rem", padding: "2px 8px", borderRadius: 12, fontWeight: 700,
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
                type="text" inputMode="numeric"
                value={inputValue}
                onChange={e => setInputValue(e.target.value)}
                onKeyDown={e => { if (e.key === "Enter") { e.preventDefault(); handleSubmit(); } }}
                placeholder="____" autoFocus
                style={{
                  border: `2px solid ${savedFeedback ? "#059669" : BRAND_TEAL}`,
                  borderRadius: 8, padding: "9px 14px",
                  fontSize: "1.2rem", fontFamily: RACING, textAlign: "center",
                  width: 160, color: BRAND_TEAL_DK, outline: "none",
                  background: savedFeedback ? "#ecfdf5" : "#fff",
                  transition: "border-color 0.2s, background 0.2s",
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

          {savedFeedback && (
            <div style={{
              padding: "9px 14px", borderRadius: 10,
              fontFamily: RACING, fontSize: "0.8rem", textAlign: "center",
              animation: "popIn 0.25s ease",
              background: "#ecfdf5", border: "1px solid #059669", color: "#065f46",
            }}>
              ✅ Answer saved! Moving to next question...
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
            }}>← PREV</button>
            <button onClick={() => jumpTo(currentIdx + 1)} disabled={isLast} style={{
              background: BRAND_TEAL, color: "#fff", border: "none",
              borderRadius: 8, padding: "7px 12px", fontSize: "0.65rem",
              fontWeight: 700, cursor: isLast ? "not-allowed" : "pointer",
              opacity: isLast ? 0.4 : 1,
            }}>NEXT →</button>
            <button onClick={handleFinalSubmit} style={{
              background: BRAND_TEAL_DK, color: "#fff", border: "none",
              borderRadius: 8, padding: "7px 14px", fontSize: "0.65rem",
              fontWeight: 700, cursor: "pointer", marginLeft: "auto",
              animation: "pulse 2s ease-in-out infinite",
            }}>
              SUBMIT TEST 🏁
            </button>
          </div>
        </div>

        {/* Desktop Palette Sidebar */}
        <QuestionPalette
          currentIdx={currentIdx} statuses={statuses}
          markedReview={markedReview} onJump={jumpTo} questions={questions}
        />
      </div>
    </div>
  );
}

// ─── Results Page ─────────────────────────────────────────────────────────────
function ResultsPage({
  result, username, onRetry, onMenu,
}: {
  result: SubmitPayload;
  username: string;
  onRetry: () => void;
  onMenu:  () => void;
}) {
  const [visible, setVisible]       = useState(false);
  const [saveStatus, setSaveStatus] = useState<"idle" | "saving" | "saved" | "error">("idle");

  useEffect(() => { const t = setTimeout(() => setVisible(true), 80); return () => clearTimeout(t); }, []);

  const { score, answers, questions, timeUp, timeLeft } = result;
  const timeUsed = TOTAL_TIME - timeLeft;

  const detailed = questions.map(q => {
    const userAnswer = answers[q.id] ?? "";
    const attempted  = userAnswer !== "";
    const correct    = attempted && isAnswerCorrect(userAnswer, q.answer);
    const m          = getMarking(q.stage);
    const points     = !attempted ? 0 : correct ? m.correct : m.incorrect;
    return { ...q, userAnswer, attempted, correct, points };
  });

  const attemptedCount = detailed.filter(d => d.attempted).length;
  const correctCount   = detailed.filter(d => d.correct).length;
  const wrongCount     = detailed.filter(d => d.attempted && !d.correct).length;
  const skippedCount   = 20 - attemptedCount;
  const stage1Points   = detailed.filter(d => d.stage === 1).reduce((s, d) => s + d.points, 0);
  const stage2Points   = detailed.filter(d => d.stage === 2).reduce((s, d) => s + d.points, 0);
  const penalty        = detailed.reduce((s, d) => s + (d.attempted && !d.correct ? Math.abs(d.points) : 0), 0);

  const emoji = score >= 25 ? "🏆" : score >= 15 ? "🎉" : score >= 5 ? "👍" : "💪";
  const grade = score >= 25 ? "Outstanding!" : score >= 15 ? "Great Work!" : score >= 5 ? "Good Effort" : "Keep Practicing!";
  const gradeColor = score >= 25 ? "#059669" : score >= 15 ? BRAND_TEAL : score >= 5 ? "#d97706" : "#dc2626";

  const SET_COLORS: Record<string, string> = { A: "#26a9e0", B: "#7c3aed", C: "#d97706", D: "#059669" };

  useEffect(() => {
    const saveToDatabase = async () => {
      if (saveStatus !== "idle") return;
      setSaveStatus("saving");
      try {
        const questionDetails = detailed.map(d => ({
          questionId:    d.id,
          questionText:  d.display,
          setLabel:      d.setLabel,
          userAnswer:    d.userAnswer || null,
          correctAnswer: d.answer,
          attempted:     d.attempted,
          isCorrect:     d.correct,
          points:        d.points,
          stage:         d.stage,
        }));
        const response = await fetch("/api/speed-maths-result", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            username, score, timeUsed, timeUp,
            attempted: attemptedCount, correct: correctCount,
            wrong: wrongCount, skipped: skippedCount,
            stage1Points, stage2Points, penalty,
            totalQuestions: 20, questionDetails,
          }),
        });
        setSaveStatus(response.ok ? "saved" : "error");
      } catch {
        setSaveStatus("error");
      }
    };
    saveToDatabase();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div style={{ minHeight: "100vh", background: `linear-gradient(160deg,#f0fdf9 0%,#fff 60%,#e8f9f8 100%)`, fontFamily: OUTFIT }}>
      <style>{GLOBAL_STYLES}</style>

      {/* Header */}
      <div style={{ background: `linear-gradient(135deg,${BRAND_TEAL_DK},${BRAND_TEAL})`, color: "#fff", padding: "10px 14px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{ fontSize: "1.6rem" }}>🚀</div>
          <div>
            <div style={{ fontFamily: RACING, fontSize: "1rem" }}>Logicology Test — Result Sheet</div>
            <div style={{ fontSize: "0.6rem", color: "rgba(255,255,255,0.7)" }}>
              {username} | Computer Based Test | Final Scorecard
            </div>
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

      {/* Save status toast */}
      {saveStatus !== "idle" && (
        <div style={{
          position: "fixed", bottom: 20, right: 20,
          background: saveStatus === "saved" ? "#059669" : saveStatus === "error" ? "#dc2626" : "#F5A623",
          color: "#fff", padding: "8px 16px", borderRadius: 8,
          fontSize: "0.8rem", fontFamily: RACING, zIndex: 1000, animation: "slideIn 0.3s ease",
        }}>
          {saveStatus === "saving" && "💾 Saving results..."}
          {saveStatus === "saved"  && "✅ Results saved!"}
          {saveStatus === "error"  && "⚠️ Auto-save failed"}
        </div>
      )}

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
              <div style={{
                display: "inline-block", background: "#dc2626", color: "#fff",
                fontFamily: RACING, fontSize: "0.7rem", padding: "3px 10px", borderRadius: 12, marginTop: 6,
              }}>
                ⏱ Time expired — test auto-submitted
              </div>
            )}
          </div>
          <div style={{ fontSize: "0.75rem", color: "#64748b", textAlign: "right", lineHeight: 1.8 }}>
            <div>Max possible: <strong style={{ color: "#059669" }}>+30</strong></div>
            <div>Min possible: <strong style={{ color: "#dc2626" }}>−20</strong></div>
            <div>Time: <strong>{formatTime(timeUsed)} / 5:00</strong></div>
          </div>
        </div>

        {/* Summary cards */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(150px,1fr))", gap: 12, marginBottom: 16 }}>
          {[
            { label: "ATTEMPTED",   val: `${attemptedCount}/20`, color: BRAND_TEAL },
            { label: "CORRECT",     val: correctCount,           color: "#059669" },
            { label: "WRONG",       val: wrongCount,             color: "#dc2626" },
            { label: "SKIPPED",     val: skippedCount,           color: "#94a3b8" },
            { label: "STAGE 1 PTS", val: stage1Points > 0 ? `+${stage1Points}` : stage1Points, color: "#26a9e0" },
            { label: "STAGE 2 PTS", val: stage2Points > 0 ? `+${stage2Points}` : stage2Points, color: "#F5A623" },
            { label: "PENALTY",     val: `-${penalty}`,          color: "#dc2626" },
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
          <div style={{
            background: BRAND_TEAL_DK, color: "#fff",
            display: "grid", gridTemplateColumns: "48px 36px 1fr 90px 90px 48px",
            padding: "8px 14px", fontFamily: RACING, fontSize: "0.65rem",
          }}>
            <div>Q#</div><div>Set</div><div>Calculation</div><div>Your Ans</div><div>Correct</div><div>+/−</div>
          </div>

          {detailed.map((item, idx) => (
            <div key={item.id} style={{
              display: "grid", gridTemplateColumns: "48px 36px 1fr 90px 90px 48px",
              padding: "7px 14px", alignItems: "center",
              background: !item.attempted ? "#f8f8f8" : idx % 2 === 0 ? "#fff" : "#f0fdf9",
              borderBottom: idx !== detailed.length - 1 ? `1px solid ${BRAND_TEAL}11` : "none",
              opacity: item.attempted ? 1 : 0.55,
            }}>
              <div style={{ fontFamily: RACING, fontSize: "0.75rem", color: BRAND_TEAL_DK }}>{item.id}</div>
              <div>
                <span style={{
                  background: SET_COLORS[item.setLabel], color: "#fff",
                  fontFamily: RACING, fontSize: "0.6rem",
                  padding: "1px 6px", borderRadius: 6,
                }}>
                  {item.setLabel}
                </span>
              </div>
              <div style={{ fontFamily: RACING, fontSize: "0.7rem" }}>{item.display} =</div>
              <div style={{
                textAlign: "center", fontWeight: 600, fontSize: "0.8rem",
                color: !item.attempted ? "#999" : item.correct ? "#059669" : "#dc2626",
              }}>
                {item.attempted
                  ? (isNaN(Number(item.userAnswer)) ? item.userAnswer : Number(item.userAnswer).toFixed(2))
                  : "—"}
              </div>
              <div style={{ textAlign: "center", color: "#555", fontSize: "0.8rem" }}>{Number(item.answer).toFixed(2)}</div>
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
            display: "grid", gridTemplateColumns: "48px 36px 1fr 90px 90px 48px",
            padding: "8px 14px", background: BRAND_TEAL_DK, color: "#fff",
            fontFamily: RACING, fontSize: "0.75rem",
          }}>
            <div /><div /><div>TOTAL SCORE</div><div /><div />
            <div style={{ textAlign: "center", color: score > 0 ? "#86efac" : "#fca5a5" }}>
              {score > 0 ? `+${score}` : score}
            </div>
          </div>
        </div>

        {/* Formula */}
        <div style={{
          background: "#e8f9f8", border: `1px solid ${BRAND_TEAL}44`,
          borderRadius: 12, padding: "10px 16px",
          textAlign: "center", fontSize: "0.8rem", color: BRAND_TEAL_DK, marginBottom: 20,
        }}>
          <span style={{ fontFamily: RACING }}>Scoring Formula:</span>
          {" "}Stage 1: +1/−1 &nbsp;•&nbsp; Stage 2: +2/−2<br />
          Score = (Correct₁ × 1) + (Correct₂ × 2) − (Wrong₁ × 1) − (Wrong₂ × 2)<br />
          <span style={{ fontSize: "0.7rem", color: "#64748b" }}>
            Each user gets a randomised mix of questions from Sets A, B, C & D
          </span>
        </div>

        {/* Buttons */}
        <div style={{ display: "flex", gap: 14, maxWidth: 400, margin: "0 auto" }}>
          <button onClick={onRetry} style={{
            flex: 1, background: BRAND_TEAL, color: "#fff",
            fontFamily: RACING, fontSize: "1rem", border: "none",
            borderRadius: 14, padding: "14px", cursor: "pointer",
          }}>🔄 Try Again</button>
          <button onClick={onMenu} style={{
            flex: 1, background: "#fff", color: BRAND_TEAL,
            fontFamily: RACING, fontSize: "1rem",
            border: `2px solid ${BRAND_TEAL}`, borderRadius: 14, padding: "14px", cursor: "pointer",
          }}>🏠 Menu</button>
        </div>
      </div>
    </div>
  );
}

// ─── Instructions Page ────────────────────────────────────────────────────────
function InstructionsPage({ username, onStart }: { username: string; onStart: () => void }) {
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
        <p style={{ color: BRAND_TEAL_DK, fontWeight: 600 }}>
          Welcome, {username}! • Speed Mathematics • Computer Based Test
        </p>
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
          { num: "1", text: "20 questions total. Each question appears one at a time. Navigate freely using PREV / NEXT or the Question Palette." },
          { num: "⏱", text: "You have 5 minutes. When time expires the test auto-submits.", numBg: "#dc2626" },
          { num: "2", isScoring: true },
          { num: "3", text: "Each question slot is independently drawn from one of four question Sets (A, B, C, D), so every user sees a unique mix." },
          { num: "4", text: "Use the Question Palette to navigate. Mark questions purple to revisit them." },
          { num: "5", text: "Correct answers are revealed only after the test ends. No live feedback during the test." },
        ].map((item, i) => (
          <div key={i} style={{ display: "flex", gap: 14, marginBottom: 18 }}>
            <div style={{
              minWidth: 30, height: 30, borderRadius: "50%",
              background: (item as any).numBg || BRAND_TEAL, color: "#fff",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontFamily: RACING, fontSize: "0.75rem", flexShrink: 0,
            }}>
              {item.num}
            </div>
            {(item as any).isScoring ? (
              <div style={{ flex: 1 }}>
                <p style={{ margin: "0 0 8px", color: BRAND_TEAL_DK, fontWeight: 700, fontSize: "0.9rem" }}>Marking Scheme:</p>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
                  <div style={{ background: "#eff9fd", borderRadius: 12, padding: "10px 14px", border: "1px solid #26a9e033" }}>
                    <p style={{ margin: "0 0 4px", fontFamily: RACING, color: "#26a9e0", fontSize: "0.75rem" }}>📘 Stage 1 (Q1–10)</p>
                    <p style={{ margin: 0, fontSize: "0.8rem" }}>✓ Correct: <strong>+1</strong> &nbsp;|&nbsp; ✗ Wrong: <strong>−1</strong></p>
                  </div>
                  <div style={{ background: "#FFF8EC", borderRadius: 12, padding: "10px 14px", border: "1px solid #F5A62333" }}>
                    <p style={{ margin: "0 0 4px", fontFamily: RACING, color: "#F5A623", fontSize: "0.75rem" }}>⭐ Stage 2 (Q11–20)</p>
                    <p style={{ margin: 0, fontSize: "0.8rem" }}>✓ Correct: <strong>+2</strong> &nbsp;|&nbsp; ✗ Wrong: <strong>−2</strong></p>
                  </div>
                </div>
              </div>
            ) : (
              <p style={{ margin: 0, color: BRAND_TEAL_DK, fontSize: "0.9rem", lineHeight: 1.5 }}>{(item as any).text}</p>
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
  const [page, setPage]     = useState<"splash" | "username" | "instructions" | "test" | "results">("splash");
  const [result, setResult] = useState<SubmitPayload | null>(null);
  const [username, setUsername] = useState<string>("");

  if (page === "splash")
    return <Splash onDone={() => setPage("username")} />;
  if (page === "username")
    return <UsernamePage onSubmit={name => { setUsername(name); setPage("instructions"); }} />;
  if (page === "instructions")
    return <InstructionsPage username={username} onStart={() => setPage("test")} />;
  if (page === "test")
    return <TestPage onSubmit={res => { setResult(res); setPage("results"); }} />;
  if (page === "results" && result)
    return <ResultsPage result={result} username={username} onRetry={() => setPage("test")} onMenu={() => setPage("instructions")} />;
  return null;
}
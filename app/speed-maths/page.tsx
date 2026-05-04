"use client";

import NavBar from "@/components/NavBar";
import { useState, useEffect, useCallback, useRef } from "react";

// ─── Types ───────────────────────────────────────────────────────────────────
type Challenge = "Addition" | "Subtraction" | "Multiplication" | "Half" | "Squares";
type AnswerMode = "Choose Option" | "Type Answer";
type TimeMode = "timed" | "fixed-questions";
type GameState =
  | "splash"
  | "menu"
  | "mode-select"
  | "settings"
  | "playing"
  | "result"
  | "half-table"
  | "half-3step"
  | "square-step";

interface Question {
  num1: number;
  num2?: number;
  answer: number;
  options?: number[];
  display: string;
}

// ─── Helpers ─────────────────────────────────────────────────────────────────
function shuffle<T>(arr: T[]): T[] {
  return [...arr].sort(() => Math.random() - 0.5);
}

function rand(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function tableHalf(d: number): number {
  return Math.floor(d / 2);
}

function generateQuestion(challenge: Challenge): Question {
  switch (challenge) {
    case "Addition": {
      const a = rand(1, 50), b = rand(1, 50);
      const ans = a + b;
      const wrongs = shuffle([ans + rand(1,5), ans - rand(1,5), ans + rand(6,12)]).slice(0,3);
      return { num1: a, num2: b, answer: ans, display: `${a} + ${b}`, options: shuffle([ans, ...wrongs]) };
    }
    case "Subtraction": {
      const a = rand(10, 99), b = rand(1, a);
      const ans = a - b;
      const wrongs = shuffle([ans + rand(1,5), ans - rand(1,4), ans + rand(6,10)]).slice(0,3);
      return { num1: a, num2: b, answer: ans, display: `${a} − ${b}`, options: shuffle([ans, ...wrongs]) };
    }
    case "Multiplication": {
      const a = rand(2, 12), b = rand(2, 12);
      const ans = a * b;
      const wrongs = shuffle([a*(b+1), a*(b-1), (a+1)*b]).filter(x=>x!==ans).slice(0,3);
      return { num1: a, num2: b, answer: ans, display: `${a} × ${b}`, options: shuffle([ans, ...wrongs]) };
    }
    case "Half": {
      const a = rand(1, 999);
      const ans = a / 2;
      const wrongs = [ans + 0.5, ans - 0.5, ans + 1].filter(x => x > 0 && x !== ans);
      return { num1: a, answer: ans, display: `½ of ${a}`, options: shuffle([ans, ...wrongs.slice(0,3)]) };
    }
    case "Squares": {
      const a = rand(11, 59);
      return { num1: a, answer: a * a, display: `${a}²` };
    }
  }
}

function generateHalfPracticeNum(): number {
  return rand(100, 999);
}

function computeHalfSteps(n: number) {
  const digits = String(n).split("").map(Number);
  const step1 = digits.map(d => tableHalf(d));
  const oddPositions = digits.map(d => d % 2 !== 0);
  const step3 = [...step1];
  let carry = 0;
  for (let i = step3.length - 1; i >= 0; i--) {
    let val = step3[i] + carry; carry = 0;
    if (oddPositions[i]) val += 5;
    if (val >= 10) { carry = 1; val -= 10; }
    step3[i] = val;
  }
  const finalDigits = carry > 0 ? [carry, ...step3] : step3;
  return { digits, step1, oddPositions, step3: finalDigits, answer: n / 2 };
}

// ─── Brand colors ─────────────────────────────────────────────────────────────
const BRAND_TEAL    = "#0A8A80";
const BRAND_TEAL_DK = "#0B3F44";

// ─── Font constants ───────────────────────────────────────────────────────────
const RACING = "'Racing Sans One', cursive";
const OUTFIT = "'Outfit', sans-serif";

// ─── Challenge palette ────────────────────────────────────────────────────────
const CHALLENGE_COLORS: Record<Challenge, { bg: string; light: string }> = {
  Addition:       { bg: "#26a9e0", light: "#eff9fd" },
  Subtraction:    { bg: "#d93b60", light: "#fcf1f4" },
  Multiplication: { bg: "#84c341", light: "#f6fbf1" },
  Half:           { bg: "#c74498", light: "#fbf2f8" },
  Squares:        { bg: "#7784c1", light: "#ecedf6" },
};

// ─── Image paths for challenge cards ─────────────────────────────────────────
const CHALLENGE_IMAGES: Record<Challenge, string> = {
  Addition:       "/Images/speed-maths/SPEED MATHS WEBPAGE IMAGES/PNG RESOURCES/ADDITION@2x.png",
  Subtraction:    "/Images/speed-maths/SPEED MATHS WEBPAGE IMAGES/PNG RESOURCES/SUBTRACTION@2x.png",
  Multiplication: "/Images/speed-maths/SPEED MATHS WEBPAGE IMAGES/PNG RESOURCES/MULTIPLICATION@2x.png",
  Half:           "/Images/speed-maths/SPEED MATHS WEBPAGE IMAGES/PNG RESOURCES/FRACTION@2x.png",
  Squares:        "/Images/speed-maths/SPEED MATHS WEBPAGE IMAGES/PNG RESOURCES/DIVISION@2x.png",
};

const ROCKET_IMG = "/Images/speed-maths/SPEED MATHS WEBPAGE IMAGES/PNG RESOURCES/ROCKET@2x.png";
const CLOUDS_IMG = "/Images/speed-maths/SPEED MATHS WEBPAGE IMAGES/PNG RESOURCES/CLOUDS.png";

// ─── Shared style tag ─────────────────────────────────────────────────────────
const GLOBAL_STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Racing+Sans+One&family=Outfit:wght@400;600;700;900&display=swap');
  @keyframes rocketBob { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-10px)} }
  @keyframes fadeUp { from{opacity:0;transform:translateY(20px)} to{opacity:1;transform:translateY(0)} }
  @keyframes rocketFlyUp {
    0% { opacity:0; transform:translateY(100vh) scale(0.6); }
    40% { opacity:1; transform:translateY(35vh) scale(1.1); }
    100% { opacity:1; transform:translateY(0) scale(1); }
  }
  @keyframes rocketHover { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-8px)} }
  @keyframes cloudSlideIn { from{opacity:0;transform:translateY(60px)} to{opacity:1;transform:translateY(0)} }
`;

// ─── Menu challenge card ──────────────────────────────────────────────────────
function MenuChallengeCard({ ch, index, visible, onClick }:
  { ch: Challenge; index: number; visible: boolean; onClick: () => void }) {
  const { bg, light } = CHALLENGE_COLORS[ch];
  const [hov, setHov] = useState(false);

  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      className="focus:outline-none w-full"
      style={{
        opacity: visible ? 1 : 0,
        transform: visible
          ? hov ? "translateY(-8px) scale(1.04)" : "translateY(0) scale(1)"
          : "translateY(60px) scale(0.9)",
        transition: `opacity 0.55s cubic-bezier(.22,1,.36,1) ${index * 0.1 + 0.3}s,
                     transform ${hov ? "0.22s" : "0.55s"} cubic-bezier(.22,1,.36,1) ${hov ? "0s" : index * 0.1 + 0.3 + "s"},
                     box-shadow 0.22s ease`,
        boxShadow: hov ? `0 22px 44px ${bg}55` : "0 4px 20px rgba(0,0,0,0.13)",
        borderRadius: 20,
      }}
    >
      <div
        className="rounded-2xl overflow-hidden flex flex-col"
        style={{ background: light, border: `3px solid ${bg}` }}
      >
        <div
          className="w-full flex items-center justify-center overflow-hidden"
          style={{ background: light, minHeight: 200, padding: "16px 8px 0" }}
        >
          <img
            src={CHALLENGE_IMAGES[ch]}
            alt={ch}
            style={{
              width: "100%",
              height: 190,
              objectFit: "contain",
              objectPosition: "bottom center",
              display: "block",
              transform: hov ? "scale(1.06)" : "scale(1)",
              transition: "transform 0.3s ease",
            }}
          />
        </div>
        <div style={{ padding: "12px 12px 14px" }}>
          <div
            className="w-full rounded-2xl py-4 text-center text-white shadow"
            style={{
              background: bg,
              fontFamily: RACING,
              fontSize: "1.2rem",
              letterSpacing: "0.04em",
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

// ─── Game sub-components ──────────────────────────────────────────────────────
function Stars({ count = 6 }: { count?: number }) {
  return (
    <div className="pointer-events-none fixed inset-0 overflow-hidden">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="absolute rounded-full" style={{
          width: `${rand(4, 10)}px`, height: `${rand(4, 10)}px`,
          background: [BRAND_TEAL, "#E45C48", "#D8AE4F", "#2EC4B6", "#6ABF4B"][i % 5],
          top: `${rand(5, 90)}%`, left: `${rand(5, 90)}%`, opacity: 0.4,
        }} />
      ))}
    </div>
  );
}

function ScoreBar({ score, streak, level }: { score: number; streak: number; level: number }) {
  return (
    <div className="flex gap-3 justify-center flex-wrap mb-4">
      {[
        { label: "Score",  value: score,  emoji: "⭐", color: "#D8AE4F" },
        { label: "Streak", value: streak, emoji: "🔥", color: "#E45C48" },
        { label: "Level",  value: level,  emoji: "🏆", color: BRAND_TEAL },
      ].map(({ label, value, emoji, color }) => (
        <div key={label} className="flex items-center gap-2 rounded-2xl px-4 py-2 shadow"
          style={{ background: "#fff", border: `2.5px solid ${color}`, color, fontFamily: OUTFIT, fontWeight: 700 }}>
          <span className="text-xl">{emoji}</span>
          <span className="text-base">{label}:</span>
          <span style={{ fontFamily: RACING, fontSize: "1.1rem" }}>{value}</span>
        </div>
      ))}
    </div>
  );
}

function NumPad({ onDigit, onEnter, onErase, value }:
  { onDigit: (d: string) => void; onEnter: () => void; onErase: () => void; value: string }) {
  return (
    <div className="w-full max-w-xs mx-auto">
      <div className="rounded-2xl border-4 bg-white px-4 py-2 text-center mb-3 min-h-[52px]"
        style={{ borderColor: BRAND_TEAL, color: BRAND_TEAL_DK, fontFamily: RACING, fontSize: "1.8rem" }}>
        {value || <span style={{ color: "#d1d5db", fontFamily: OUTFIT }}>?</span>}
      </div>
      <div className="grid grid-cols-3 gap-2">
        {["1", "2", "3", "4", "5", "6", "7", "8", "9", "0.5", "0", "E"].map(d => (
          <button key={d} onClick={() => d === "E" ? onErase() : onDigit(d)}
            className="rounded-2xl py-3 shadow transition active:scale-95"
            style={{
              background: d === "E" ? "#E45C48" : "#e8f9f8",
              color: d === "E" ? "#fff" : BRAND_TEAL_DK,
              border: `2px solid ${BRAND_TEAL}44`,
              fontFamily: RACING,
              fontSize: "1.2rem",
            }}>
            {d === "E" ? "⌫" : d}
          </button>
        ))}
      </div>
      <button onClick={onEnter} className="mt-3 w-full rounded-2xl py-3 shadow-lg transition active:scale-95"
        style={{ background: BRAND_TEAL, color: "#fff", fontFamily: RACING, fontSize: "1.2rem" }}>
        ✓ Enter
      </button>
    </div>
  );
}

// ─── Half Table Quiz ──────────────────────────────────────────────────────────
function HalfTableQuiz({ bg, light, onNext }: { bg: string; light: string; onNext: () => void }) {
  const DIGITS = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9], TOTAL = 20;
  const buildQ = () => { const q: number[] = []; for (let i = 0; i < 2; i++) q.push(...shuffle(DIGITS)); return q; };
  const [queue] = useState<number[]>(() => buildQ());
  const [attempted, setAttempted] = useState(0);
  const [correct, setCorrect] = useState(0);
  const [inputVal, setInputVal] = useState("");
  const [feedback, setFeedback] = useState<"correct" | "wrong" | null>(null);
  const [done, setDone] = useState(false);
  const [showRef, setShowRef] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const currentDigit = queue[attempted] ?? 0;
  const expectedAnswer = Math.floor(currentDigit / 2);

  useEffect(() => { if (!done) inputRef.current?.focus(); }, [attempted, done]);

  const checkAnswer = () => {
    if (inputVal === "" || feedback) return;
    const ok = parseInt(inputVal) === expectedAnswer;
    setFeedback(ok ? "correct" : "wrong");
    if (ok) setCorrect(c => c + 1);
  };
  const next = () => {
    const n = attempted + 1;
    setAttempted(n); setInputVal(""); setFeedback(null);
    if (n >= TOTAL) setDone(true);
  };
  const handleKey = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") { if (feedback) next(); else checkAnswer(); }
  };
  const restart = () => { setAttempted(0); setCorrect(0); setInputVal(""); setFeedback(null); setDone(false); };
  const refTable = [[0, 0], [1, 0], [2, 1], [3, 1], [4, 2], [5, 2], [6, 3], [7, 3], [8, 4], [9, 4]];

  if (done) {
    const pct = Math.round((correct / TOTAL) * 100);
    return (
      <div className="w-full max-w-sm mx-auto bg-white rounded-3xl shadow-xl p-8 border-2 text-center" style={{ borderColor: bg }}>
        <div className="text-6xl mb-3">{pct >= 90 ? "🌟" : pct >= 70 ? "👍" : "💪"}</div>
        <h3 className="text-2xl mb-1" style={{ color: bg, fontFamily: RACING }}>Quiz Complete!</h3>
        <p className="mb-2 font-semibold" style={{ color: BRAND_TEAL, fontFamily: OUTFIT }}>
          {correct}/{TOTAL} correct — {pct}%
        </p>
        <div className="flex gap-3 mt-6">
          <button onClick={restart} className="flex-1 rounded-2xl py-3 text-white active:scale-95"
            style={{ background: bg, fontFamily: RACING, fontSize: "1rem" }}>🔄 Retry</button>
          <button onClick={onNext} className="flex-1 rounded-2xl py-3 active:scale-95 border-2"
            style={{ borderColor: bg, color: bg, background: light, fontFamily: RACING, fontSize: "1rem" }}>🪜 3-Step</button>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-sm mx-auto space-y-4">
      <div className="flex items-center gap-3">
        <div className="flex-1 h-2.5 rounded-full overflow-hidden" style={{ background: "#e0f2f1" }}>
          <div className="h-full rounded-full transition-all duration-300" style={{ width: `${(attempted / TOTAL) * 100}%`, background: bg }} />
        </div>
        <span className="text-sm min-w-[48px] text-right" style={{ color: bg, fontFamily: RACING }}>{attempted}/{TOTAL}</span>
      </div>
      <div className="flex justify-center gap-4">
        <div className="flex items-center gap-2 rounded-2xl px-4 py-2 shadow text-sm"
          style={{ background: "#fff", border: `2.5px solid ${bg}`, color: bg, fontFamily: OUTFIT, fontWeight: 700 }}>
          ✅ Correct: <span style={{ fontFamily: RACING }}>{correct}</span>
        </div>
        <div className="flex items-center gap-2 rounded-2xl px-4 py-2 shadow text-sm"
          style={{ background: "#fff", border: "2.5px solid #e0f2f1", color: BRAND_TEAL, fontFamily: OUTFIT, fontWeight: 700 }}>
          📝 Left: <span style={{ fontFamily: RACING }}>{TOTAL - attempted}</span>
        </div>
      </div>
      <div className="bg-white rounded-3xl shadow-xl p-6 border-2 text-center"
        style={{ borderColor: feedback === "correct" ? "#22c55e" : feedback === "wrong" ? "#ef4444" : bg }}>
        <p className="font-semibold mb-1 text-sm" style={{ color: bg, fontFamily: OUTFIT }}>Table half of</p>
        <div className="text-8xl my-3" style={{ color: bg, fontFamily: RACING }}>{currentDigit}</div>
        <input ref={inputRef} type="number" min={0} max={4} value={inputVal}
          onChange={e => { if (!feedback) setInputVal(e.target.value); }}
          onKeyDown={handleKey} disabled={!!feedback} placeholder="?"
          className="w-32 text-center rounded-2xl py-3 outline-none transition-all mb-3"
          style={{
            border: `4px solid ${feedback === "correct" ? "#22c55e" : feedback === "wrong" ? "#ef4444" : bg}`,
            background: feedback === "correct" ? "#f0fdf4" : feedback === "wrong" ? "#fef2f2" : light,
            color: feedback === "correct" ? "#15803d" : feedback === "wrong" ? "#dc2626" : bg,
            fontFamily: RACING, fontSize: "2rem",
          }} />
        {feedback === "correct" && <p className="text-green-500 text-lg mb-2" style={{ fontFamily: OUTFIT, fontWeight: 800 }}>✅ Correct!</p>}
        {feedback === "wrong" && (
          <p className="text-red-400 text-base mb-2" style={{ fontFamily: OUTFIT, fontWeight: 800 }}>
            ❌ Table half of {currentDigit} is <span style={{ color: "#dc2626", fontFamily: RACING }}>{expectedAnswer}</span>
          </p>
        )}
        {!feedback
          ? <button onClick={checkAnswer} disabled={inputVal === ""} className="w-full rounded-2xl py-3 text-lg text-white active:scale-95"
            style={{ background: inputVal !== "" ? bg : "#ccc", cursor: inputVal !== "" ? "pointer" : "not-allowed", fontFamily: RACING }}>Check ✓</button>
          : <button onClick={next} className="w-full rounded-2xl py-3 text-lg text-white active:scale-95"
            style={{ background: bg, fontFamily: RACING }}>Next →</button>
        }
      </div>
      <div className="bg-white rounded-3xl p-4 border-2" style={{ borderColor: `${bg}33` }}>
        <button onClick={() => setShowRef(v => !v)} className="w-full text-left text-sm flex justify-between items-center"
          style={{ color: bg, fontFamily: OUTFIT, fontWeight: 700 }}>
          <span>📖 Reference Table</span><span>{showRef ? "▲" : "▼"}</span>
        </button>
        {showRef && (
          <div className="grid grid-cols-5 gap-2 mt-3">
            {refTable.map(([d, h]) => (
              <div key={d} className="rounded-xl py-2 text-center" style={{ background: light }}>
                <div style={{ fontFamily: RACING, color: bg, fontSize: "1rem" }}>{d}</div>
                <div style={{ fontFamily: OUTFIT, fontSize: "0.75rem", fontWeight: 600, color: BRAND_TEAL }}>→ {h}</div>
              </div>
            ))}
          </div>
        )}
        {!showRef && <p className="text-xs mt-1" style={{ color: `${bg}99`, fontFamily: OUTFIT }}>0,1→0 | 2,3→1 | 4,5→2 | 6,7→3 | 8,9→4</p>}
      </div>
    </div>
  );
}

// ─── Half 3-Step Interactive ──────────────────────────────────────────────────
type Half3StepPhase = "step1" | "step2" | "step3" | "done";

function Half3StepInteractive({ practiceNum, onComplete, onNewNumber, bg, light }:
  { practiceNum: number; onComplete: () => void; onNewNumber: () => void; bg: string; light: string }) {
  const { digits, step1, oddPositions, answer } = computeHalfSteps(practiceNum);
  const [phase, setPhase] = useState<Half3StepPhase>("step1");
  const [userStep1, setUserStep1] = useState<(string | null)[]>(digits.map(() => null));
  const [step1Feedback, setStep1Feedback] = useState<(boolean | null)[]>(digits.map(() => null));
  const [userOddSel, setUserOddSel] = useState<boolean[]>(digits.map(() => false));
  const [step2Checked, setStep2Checked] = useState(false);
  const [step2Feedback, setStep2Feedback] = useState<string | null>(null);
  const [step3UserVals, setStep3UserVals] = useState<Record<number, string>>({});
  const [step3Feedback, setStep3Feedback] = useState<Record<number, boolean | null>>({});
  // decimal cell: index = digits.length (extra cell after last)
  const [decimalVal, setDecimalVal]       = useState("");
  const [decimalFb,  setDecimalFb]        = useState<boolean | null>(null);
  const [step3Done, setStep3Done] = useState(false);

  const lastIsOdd = oddPositions[digits.length - 1];

  const upS1 = (idx: number, val: string) => {
    if (phase !== "step1") return;
    const n = [...userStep1]; n[idx] = val === "" ? null : val; setUserStep1(n);
  };
  const chkS1 = () => {
    const fb = userStep1.map((v, i) => v !== null && parseInt(v) === step1[i]);
    setStep1Feedback(fb);
    if (fb.every(Boolean)) setTimeout(() => setPhase("step2"), 600);
  };
  const togOdd = (idx: number) => {
    if (phase !== "step2" || step2Checked) return;
    const ns = [...userOddSel]; ns[idx] = !ns[idx]; setUserOddSel(ns);
  };
  const chkS2 = () => {
    const ok = oddPositions.every((v, i) => v === userOddSel[i]);
    setStep2Checked(true);
    if (ok) { setStep2Feedback("correct"); setTimeout(() => setPhase("step3"), 800); }
    else { setStep2Feedback("wrong"); setTimeout(() => { setStep2Checked(false); setStep2Feedback(null); setUserOddSel(digits.map(() => false)); }, 1200); }
  };
  const getFV = (i: number) => {
    let v = step1[i];
    if (i > 0 && oddPositions[i - 1]) v += 5;
    if (v >= 10) v -= 10;
    return v;
  };
  const upS3 = (idx: number, val: string) => {
    if (phase !== "step3" || step3Done) return;
    setStep3UserVals(p => ({ ...p, [idx]: val }));
  };
  const chkS3 = () => {
    // check main digit cells
    const fb: Record<number, boolean> = {};
    digits.forEach((_, i) => {
      const exp = getFV(i);
      const uv = step3UserVals[i] !== undefined ? parseInt(step3UserVals[i]) : NaN;
      fb[i] = uv === exp;
    });

    // check decimal cell if last digit is odd
    let decOk = true;
    if (lastIsOdd) {
      const dv = parseInt(decimalVal);
      decOk = dv === 5;
      setDecimalFb(decOk);
    }

    setStep3Feedback(fb);

    if (Object.values(fb).every(Boolean) && decOk) {
      setStep3Done(true);
      setTimeout(() => setPhase("done"), 600);
    }
  };

  // all main cells filled + decimal cell filled if needed
  const allS3 = digits.every((_, i) => step3UserVals[i] !== undefined && step3UserVals[i] !== "")
    && (!lastIsOdd || decimalVal !== "");

  const anyS3Wrong = Object.values(step3Feedback).some(v => v === false)
    || (lastIsOdd && decimalFb === false);

  const baseCell = (bc: string, bgc: string): React.CSSProperties => ({
    width: 56, height: 56, borderRadius: 14, border: `3px solid ${bc}`, background: bgc,
    display: "flex", alignItems: "center", justifyContent: "center",
    fontFamily: RACING, fontSize: 22, color: BRAND_TEAL_DK, flexShrink: 0,
  });
  const inpSty = (fb: boolean | null): React.CSSProperties => ({
    width: 56, height: 56, borderRadius: 14,
    border: `3px solid ${fb === null ? bg : fb ? "#22c55e" : "#ef4444"}`,
    background: fb === true ? "#f0fdf4" : fb === false ? "#fef2f2" : "#fff",
    textAlign: "center", fontFamily: RACING, fontSize: 22, color: BRAND_TEAL_DK,
    outline: "none", flexShrink: 0,
  });

  return (
    <div className="w-full max-w-sm mx-auto space-y-5">
      <div className="flex gap-2">
        {(["step1", "step2", "step3", "done"] as Half3StepPhase[]).map((p, i) => (
          <div key={p} className="flex-1 h-2 rounded-full transition-all duration-500"
            style={{ background: (["step1", "step2", "step3", "done"] as Half3StepPhase[]).indexOf(phase) > i ? bg : phase === p ? `${bg}99` : "#e0f2f1" }} />
        ))}
      </div>

      <div className="text-center">
        <span style={{ fontFamily: OUTFIT, fontWeight: 700, fontSize: "1rem", color: bg }}>Find half of</span>
        <div style={{ fontFamily: RACING, fontSize: "3rem", color: bg, marginTop: 4 }}>{practiceNum}</div>
      </div>

      {/* Step 1 */}
      <div className="bg-white rounded-3xl p-5 border-2 shadow-lg" style={{ borderColor: phase === "step1" ? bg : "#e0f2f1" }}>
        <div className="flex items-center gap-2 mb-3">
          <div className="rounded-full w-8 h-8 flex items-center justify-center text-sm text-white"
            style={{ background: phase === "step1" ? bg : "#22c55e", fontFamily: RACING }}>
            {phase === "step1" ? "1" : "✓"}
          </div>
          <span style={{ fontFamily: OUTFIT, fontWeight: 700, color: BRAND_TEAL_DK }}>Write table half of each digit</span>
        </div>
        <div className="flex gap-3 justify-center mb-2">
          {digits.map((d, i) => <div key={i} style={{ ...baseCell(bg, light), color: bg }}>{d}</div>)}
        </div>
        <div className="text-center text-sm mb-2" style={{ color: bg, fontFamily: OUTFIT, fontWeight: 600 }}>↓ table half ↓</div>
        <div className="flex gap-3 justify-center">
          {digits.map((_, i) => phase === "step1"
            ? <input key={i} type="number" min={0} max={4} value={userStep1[i] ?? ""}
                onChange={e => upS1(i, e.target.value)} style={inpSty(step1Feedback[i])} placeholder="?" />
            : <div key={i} style={{ ...baseCell("#22c55e", "#f0fdf4"), color: "#15803d" }}>{step1[i]}</div>
          )}
        </div>
        {phase === "step1" && (
          <button onClick={chkS1} disabled={!userStep1.every(v => v !== null)}
            className="mt-4 w-full rounded-2xl py-3 text-white active:scale-95"
            style={{ background: userStep1.every(v => v !== null) ? bg : "#ccc", fontFamily: RACING, fontSize: "1rem" }}>
            Check ✓
          </button>
        )}
        {phase === "step1" && step1Feedback.some(f => f === false) && (
          <div className="text-red-400 text-center mt-2 text-sm" style={{ fontFamily: OUTFIT, fontWeight: 700 }}>
            Some wrong! (0,1→0|2,3→1|4,5→2|6,7→3|8,9→4)
          </div>
        )}
      </div>

      {/* Step 2 */}
      {(phase === "step2" || phase === "step3" || phase === "done") && (
        <div className="bg-white rounded-3xl p-5 border-2 shadow-lg" style={{ borderColor: phase === "step2" ? bg : "#e0f2f1" }}>
          <div className="flex items-center gap-2 mb-3">
            <div className="rounded-full w-8 h-8 flex items-center justify-center text-sm text-white"
              style={{ background: phase === "step2" ? bg : "#22c55e", fontFamily: RACING }}>
              {phase === "step2" ? "2" : "✓"}
            </div>
            <span style={{ fontFamily: OUTFIT, fontWeight: 700, color: BRAND_TEAL_DK }}>
              {phase === "step2" ? "Tap the cells from odd digits 👇" : "Highlighted cells from odd digits"}
            </span>
          </div>
          <div className="flex gap-3 justify-center mb-3">
            {step1.map((v, i) => (
              <div key={i} onClick={() => togOdd(i)} style={{
                width: 56, height: 56, borderRadius: 14,
                border: `3px solid ${phase === "step2" ? (userOddSel[i] ? "#f59e0b" : bg) : (oddPositions[i] ? "#f59e0b" : bg)}`,
                background: phase === "step2" ? (userOddSel[i] ? "#fef3c7" : light) : (oddPositions[i] ? "#fef3c7" : light),
                display: "flex", alignItems: "center", justifyContent: "center",
                fontFamily: RACING, fontSize: 22,
                color: phase === "step2" ? (userOddSel[i] ? "#b45309" : BRAND_TEAL_DK) : (oddPositions[i] ? "#b45309" : BRAND_TEAL_DK),
                cursor: phase === "step2" && !step2Checked ? "pointer" : "default", transition: "all 0.2s",
                boxShadow: (phase === "step2" ? userOddSel[i] : oddPositions[i]) ? "0 0 0 3px #fbbf24" : "none",
              }}>
                {v}
              </div>
            ))}
          </div>
          {phase === "step2" && <>
            <p className="text-xs text-center mb-3" style={{ color: BRAND_TEAL, fontFamily: OUTFIT }}>
              Tap cells from <strong>odd</strong> digits
            </p>
            <button onClick={chkS2} className="w-full rounded-2xl py-3 text-white active:scale-95"
              style={{ background: bg, fontFamily: RACING, fontSize: "1rem" }}>Confirm Selection ✓</button>
            {step2Feedback === "wrong" && (
              <div className="text-red-400 text-center mt-2 text-sm" style={{ fontFamily: OUTFIT, fontWeight: 700 }}>❌ Not quite — try again!</div>
            )}
            {step2Feedback === "correct" && (
              <div className="text-green-500 text-center mt-2 text-sm" style={{ fontFamily: OUTFIT, fontWeight: 700 }}>✅ Correct!</div>
            )}
          </>}
          {phase !== "step2" && (
            <p className="text-center text-amber-600 text-sm" style={{ fontFamily: OUTFIT, fontWeight: 600 }}>
              🟡 Highlighted = odd → add +5 to cell on RIGHT!
            </p>
          )}
        </div>
      )}

      {/* Step 3 */}
      {(phase === "step3" || phase === "done") && (
        <div className="bg-white rounded-3xl p-5 border-2 shadow-lg" style={{ borderColor: phase === "step3" ? bg : "#e0f2f1" }}>
          <div className="flex items-center gap-2 mb-3">
            <div className="rounded-full w-8 h-8 flex items-center justify-center text-sm text-white"
              style={{ background: phase === "step3" ? bg : "#22c55e", fontFamily: RACING }}>
              {phase === "step3" ? "3" : "✓"}
            </div>
            <span style={{ fontFamily: OUTFIT, fontWeight: 700, color: BRAND_TEAL_DK }}>
              Add +5 from yellow cells to cell on the RIGHT
            </span>
          </div>
          <p className="text-xs mb-4" style={{ color: BRAND_TEAL, fontFamily: OUTFIT }}>
            For each yellow cell, add 5 to the cell to its RIGHT.
            {lastIsOdd && <span> Last digit is odd → the decimal cell gets <strong>5</strong>.</span>}
          </p>

          {/* Reference row: step1 cells with arrows */}
          <div className="flex items-center justify-center gap-2 mb-4">
            {step1.map((v, i) => (
              <div key={i} className="flex flex-col items-center">
                <div style={{
                  ...baseCell(oddPositions[i] ? "#f59e0b" : bg, oddPositions[i] ? "#fef3c7" : light),
                  color: oddPositions[i] ? "#b45309" : BRAND_TEAL_DK,
                }}>{v}</div>
                {oddPositions[i] && i < step1.length - 1 && (
                  <div className="text-xs text-amber-500 mt-1" style={{ fontFamily: OUTFIT }}>+5 →</div>
                )}
                {oddPositions[i] && i === step1.length - 1 && (
                  <div className="text-xs text-amber-500 mt-1" style={{ fontFamily: OUTFIT }}>→ .?</div>
                )}
              </div>
            ))}
          </div>

          <div className="text-center text-sm mb-2" style={{ color: bg, fontFamily: OUTFIT, fontWeight: 600 }}>↓ Result after +5 ↓</div>

          {/* Answer row: main digit cells + optional decimal cell */}
          <div className="flex gap-2 justify-center items-center">
            {digits.map((_, i) => {
              const exp = getFV(i);
              const fb  = step3Feedback[i] ?? null;
              const uv  = step3UserVals[i] ?? "";
              return (
                <div key={i} className="flex flex-col items-center">
                  {phase === "step3" && !step3Done
                    ? <input
                        type="number"
                        value={uv}
                        onChange={e => upS3(i, e.target.value)}
                        style={inpSty(fb)}
                        className="text-center"
                        placeholder="?"
                      />
                    : <div style={{ ...baseCell("#22c55e", "#f0fdf4"), color: "#15803d" }}>{exp}</div>
                  }
                </div>
              );
            })}

            {/* Decimal cell — only when last digit is odd */}
            {lastIsOdd && (
              <>
                {/* Decimal point separator */}
                <div style={{
                  fontFamily: RACING,
                  fontSize: 32,
                  color: bg,
                  lineHeight: 1,
                  alignSelf: "flex-end",
                  marginBottom: 10,
                  flexShrink: 0,
                }}>.</div>

                {/* The .5 input cell */}
                {phase === "step3" && !step3Done
                  ? <input
                      type="number"
                      min={0}
                      max={9}
                      value={decimalVal}
                      onChange={e => setDecimalVal(e.target.value)}
                      style={{
                        ...inpSty(decimalFb),
                        borderStyle: "dashed",
                      }}
                      className="text-center"
                      placeholder="?"
                    />
                  : <div style={{ ...baseCell("#22c55e", "#f0fdf4"), color: "#15803d" }}>5</div>
                }
              </>
            )}
          </div>

          {/* Hint label under decimal cell */}
          {lastIsOdd && phase === "step3" && !step3Done && (
            <p className="text-center text-xs mt-2 text-amber-600" style={{ fontFamily: OUTFIT, fontWeight: 600 }}>
              Last digit was odd → decimal cell = ?
            </p>
          )}

          {phase === "step3" && !step3Done && (
            <>
              <button
                onClick={chkS3}
                disabled={!allS3}
                className="mt-4 w-full rounded-2xl py-3 text-white active:scale-95"
                style={{
                  background: allS3 ? bg : "#ccc",
                  cursor: allS3 ? "pointer" : "not-allowed",
                  fontFamily: RACING,
                  fontSize: "1rem",
                }}>
                Check ✓
              </button>
              {anyS3Wrong && (
                <div className="text-red-400 text-center mt-2 text-sm" style={{ fontFamily: OUTFIT, fontWeight: 700 }}>
                  ❌ Not right — check your cells!
                </div>
              )}
            </>
          )}

          {phase === "step3" && step3Done && (
            <div className="mt-4 text-center text-green-600" style={{ fontFamily: RACING, fontSize: "1.1rem" }}>
              Final: {digits.map((_, i) => getFV(i)).join("")}{lastIsOdd ? ".5" : ""}
            </div>
          )}
        </div>
      )}

      {phase === "done" && (
        <div className="bg-white rounded-3xl p-6 border-2 shadow-xl text-center" style={{ borderColor: "#22c55e" }}>
          <div className="text-5xl mb-2">🎉</div>
          <div className="text-2xl text-green-600 mb-1" style={{ fontFamily: RACING }}>
            ½ of {practiceNum} = <span style={{ color: bg }}>{answer}</span>
          </div>
          <div className="mb-4" style={{ color: BRAND_TEAL, fontFamily: OUTFIT, fontWeight: 600 }}>
            {Number.isInteger(answer) ? "Great work!" : "Notice the .5 — last digit was odd!"}
          </div>
          <div className="flex gap-3">
            <button onClick={onNewNumber} className="flex-1 rounded-2xl py-3 text-white active:scale-95"
              style={{ background: bg, fontFamily: RACING, fontSize: "1rem" }}>🔄 New Number</button>
            <button onClick={onComplete} className="flex-1 rounded-2xl py-3 active:scale-95 border-2"
              style={{ borderColor: bg, color: bg, background: light, fontFamily: RACING, fontSize: "1rem" }}>⚡ Challenge</button>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Square Step Row ──────────────────────────────────────────────────────────
function SquareStepRow({ label, sublabel, placeholder, value, onChange, onSubmit, feedback, locked, confirmed, confirmedValue, wide = false, bg }:
  { label: string; sublabel?: string; placeholder: string; value: string; onChange: (v: string) => void; onSubmit: () => void;
    feedback: "correct" | "wrong" | null; locked: boolean; confirmed: boolean; confirmedValue?: string | number; wide?: boolean; bg: string }) {
  const ref = useRef<HTMLInputElement>(null);
  useEffect(() => { if (!locked && !confirmed) ref.current?.focus(); }, [locked, confirmed]);
  const bc = feedback === "correct" ? "#22c55e" : feedback === "wrong" ? "#ef4444" : locked ? "#d1d5db" : bg;
  const bgc = feedback === "correct" ? "#f0fdf4" : feedback === "wrong" ? "#fef2f2" : locked ? "#f9fafb" : "#fff";
  const tc = feedback === "correct" ? "#15803d" : feedback === "wrong" ? "#dc2626" : locked ? "#9ca3af" : bg;
  return (
    <div className="flex items-center gap-3 w-full">
      <button className="flex-1 rounded-2xl py-4 px-4 text-left text-white shadow-md"
        style={{ background: locked ? "#aaa" : `linear-gradient(135deg,${bg},${BRAND_TEAL_DK})`, opacity: locked ? 0.5 : 1, cursor: "default", minHeight: 64 }}>
        <div style={{ fontFamily: RACING, fontSize: "0.95rem", lineHeight: 1.2 }}>{label}</div>
        {sublabel && <div style={{ fontFamily: OUTFIT, fontSize: "0.75rem", fontWeight: 600, opacity: 0.8, marginTop: 2 }}>{sublabel}</div>}
      </button>
      <div className={`${wide ? "min-w-[90px]" : "w-16"} flex-shrink-0`}>
        {confirmed
          ? <div className="rounded-2xl flex items-center justify-center h-14"
            style={{ border: `3px solid ${bg}`, background: "#f0fdf4", color: "#15803d", minWidth: wide ? 90 : 64, fontFamily: RACING, fontSize: "1.3rem" }}>
            {confirmedValue}
          </div>
          : <input ref={ref} type="number" value={value} onChange={e => !locked && onChange(e.target.value)}
            onKeyDown={e => e.key === "Enter" && !locked && onSubmit()} disabled={locked} placeholder={placeholder}
            className="rounded-2xl h-14 text-center outline-none transition-all w-full"
            style={{ border: `3px solid ${bc}`, background: bgc, color: tc, minWidth: wide ? 90 : 64, fontFamily: RACING, fontSize: "1.3rem" }} />
        }
      </div>
    </div>
  );
}

// ─── Square Step View ─────────────────────────────────────────────────────────
function SquareStepView({ squareNum, onTryAnother, onRangeSelect, onGoSettings, bg, light }:
  { squareNum: number; onTryAnother: () => void; onRangeSelect: (range: string) => void; onGoSettings: () => void; bg: string; light: string }) {

  type RangeKey = "26-50" | "51-75" | "76-100" | "101-125";

  const getRange = (n: number): RangeKey => {
    if (n >= 26  && n <= 50)  return "26-50";
    if (n >= 51  && n <= 75)  return "51-75";
    if (n >= 76  && n <= 100) return "76-100";
    return "101-125";
  };

  const range = getRange(squareNum);

  const computeValues = (n: number, r: RangeKey) => {
    switch (r) {
      case "26-50":   { const x = 50  - n; const AB = 25 - x; const CD = x * x; return { x, AB, CD, base: 50,  dir: "below" as const }; }
      case "51-75":   { const x = n   - 50; const AB = 25 + x; const CD = x * x; return { x, AB, CD, base: 50,  dir: "above" as const }; }
      case "76-100":  { const x = 100 - n; const AB = 50 - x; const CD = x * x; return { x, AB, CD, base: 100, dir: "below" as const }; }
      case "101-125": { const x = n   - 100;const AB = 50 + x; const CD = x * x; return { x, AB, CD, base: 100, dir: "above" as const }; }
    }
  };

  const { x, AB, CD, base, dir } = computeValues(squareNum, range);
  const finalAnswer = AB * 100 + CD;
  const CDStr       = String(CD).padStart(2, "0");
  const ABCDStr     = String(finalAnswer);

  const step1Label = dir === "below" ? `${base} − ${squareNum}` : `${squareNum} − ${base}`;
  const step2Label = (() => {
    if (range === "26-50")   return `25 − ${x}`;
    if (range === "51-75")   return `25 + ${x}`;
    if (range === "76-100")  return `50 − ${x}`;
    return                          `50 + ${x}`;
  })();

  const steps = [
    {
      label:       "Step 1",
      sublabel:    `${squareNum} is ${dir} ${base} by  (${step1Label})`,
      placeholder: "x",
      wide:        false,
      displayVal:  x,
    },
    {
      label:       "Step 2",
      sublabel:    `${step2Label} = AB`,
      placeholder: "AB",
      wide:        false,
      displayVal:  AB,
    },
    {
      label:       "Step 3",
      sublabel:    `${x}² = CD`,
      placeholder: "CD",
      wide:        false,
      displayVal:  CD,
    },
    {
      label:       "Answer",
      sublabel:    `AB×100 + CD  =  ${AB}×100 + ${CD}`,
      placeholder: "Ans",
      wide:        true,
      displayVal:  finalAnswer,
    },
  ];

  const correctAnswers = [x, AB, CD, finalAnswer];

  const [currentStep, setCurrentStep] = useState(0);
  const [vals,        setVals]        = useState(["", "", "", ""]);
  const [feedbacks,   setFeedbacks]   = useState<("correct" | "wrong" | null)[]>([null, null, null, null]);
  const [confirmed,   setConfirmed]   = useState([false, false, false, false]);

  const handleChange = (i: number, v: string) => {
    const n = [...vals]; n[i] = v; setVals(n);
  };

  const handleSubmit = (i: number) => {
    const uv = parseFloat(vals[i]), exp = correctAnswers[i];
    if (Math.abs(uv - exp) < 0.01) {
      const nf = [...feedbacks]; nf[i] = "correct"; setFeedbacks(nf);
      setTimeout(() => {
        const nc = [...confirmed]; nc[i] = true; setConfirmed([...nc]);
        if (i < 3) setCurrentStep(i + 1); else setCurrentStep(4);
      }, 600);
    } else {
      const nf = [...feedbacks]; nf[i] = "wrong"; setFeedbacks(nf);
      setTimeout(() => {
        const nf2 = [...feedbacks]; nf2[i] = null; setFeedbacks(nf2);
      }, 1000);
    }
  };

  const isDone = currentStep === 4;

  const rangeBadgeColor: Record<RangeKey, string> = {
    "26-50":   "#26a9e0",
    "51-75":   "#84c341",
    "76-100":  "#d93b60",
    "101-125": "#7784c1",
  };

  return (
    <div className="w-full max-w-sm mx-auto space-y-3">

      {/* Range tabs */}
      <div className="grid grid-cols-4 gap-1 bg-white rounded-2xl p-1 shadow border-2"
        style={{ borderColor: `${bg}33` }}>
        {(["26-50", "51-75", "76-100", "101-125"] as RangeKey[]).map(r => (
          <button
            key={r}
            onClick={() => onRangeSelect(r)}
            className="rounded-xl py-2 transition-all active:scale-95"
            style={{
              background: range === r ? bg : "transparent",
              color:      range === r ? "#fff" : bg,
              fontFamily: RACING,
              fontSize:   "0.7rem",
              opacity:    range === r ? 1 : 0.55,
              cursor:     "pointer",
            }}
            title={`Practice ${r} range`}
          >
            {r}
          </button>
        ))}
      </div>

      {/* Progress bar */}
      <div className="flex gap-1.5">
        {[0, 1, 2, 3].map(i => (
          <div key={i} className="flex-1 h-2.5 rounded-full transition-all duration-500"
            style={{
              background: i < currentStep ? bg : i === currentStep ? `${bg}88` : "#e0f2f1",
            }} />
        ))}
      </div>

      {/* Header */}
      <div className="text-center">
        <div
          className="inline-block rounded-full px-3 py-1 text-xs text-white mb-2"
          style={{ background: rangeBadgeColor[range], fontFamily: OUTFIT, fontWeight: 700 }}>
          {range} range · {range === "26-50" ? "50−x" : range === "51-75" ? "50+x" : range === "76-100" ? "100−x" : "100+x"} method
        </div>
        <div style={{ fontFamily: OUTFIT, fontWeight: 700, fontSize: "0.85rem", color: bg }}>
          Find Square of
        </div>
        <div style={{ fontFamily: RACING, fontSize: "3.5rem", color: bg }}>{squareNum}</div>
      </div>

      {/* Step cards */}
      <div className="bg-white rounded-3xl shadow-xl border-2 p-5 space-y-3"
        style={{ borderColor: isDone ? "#22c55e" : bg }}>

        {steps.map((s, i) => (
          <div key={i} className="space-y-2">

            <SquareStepRow
              label={s.label}
              sublabel={s.sublabel}
              placeholder={s.placeholder}
              value={vals[i]}
              onChange={v => handleChange(i, v)}
              onSubmit={() => handleSubmit(i)}
              feedback={feedbacks[i]}
              locked={currentStep < i}
              confirmed={confirmed[i]}
              confirmedValue={confirmed[i] ? s.displayVal : undefined}
              wide={s.wide}
              bg={bg}
            />

            {/* Per-step Check button */}
            {currentStep === i && !confirmed[i] && !isDone && (
              <button
                onClick={() => handleSubmit(i)}
                disabled={!vals[i]}
                className="w-full rounded-2xl py-2.5 text-white active:scale-95 transition-all"
                style={{
                  background: vals[i]
                    ? `linear-gradient(135deg,${bg},${BRAND_TEAL_DK})`
                    : "#ccc",
                  cursor:     vals[i] ? "pointer" : "not-allowed",
                  fontFamily: RACING,
                  fontSize:   "1rem",
                }}
              >
                Check ✓
              </button>
            )}

            {/* Per-step wrong feedback */}
            {feedbacks[i] === "wrong" && !confirmed[i] && (
              <div className="text-red-400 text-center text-sm"
                style={{ fontFamily: OUTFIT, fontWeight: 700 }}>
                ❌ Not quite — try again!
              </div>
            )}

          </div>
        ))}

        {/* Done state */}
        {isDone && (
          <div className="text-center pt-2">
            <div className="text-3xl mb-1">🎉</div>
            <div style={{ fontFamily: RACING, fontSize: "1.4rem", color: bg }}>
              {squareNum}² = {finalAnswer}
            </div>
            <div className="mt-1 mb-4"
              style={{ fontFamily: OUTFIT, fontWeight: 600, fontSize: "0.85rem", color: BRAND_TEAL }}>
              AB={AB} | CD={CD} → {AB}×100 + {CD} = {finalAnswer}
            </div>
            <div className="flex gap-3">
              <button
                onClick={onTryAnother}
                className="flex-1 rounded-2xl py-3 text-white active:scale-95"
                style={{
                  background: `linear-gradient(135deg,${bg},${BRAND_TEAL_DK})`,
                  fontFamily: RACING,
                  fontSize:   "1rem",
                }}>
                🔄 Try Another
              </button>
              <button
                onClick={onGoSettings}
                className="flex-1 rounded-2xl py-3 active:scale-95 border-2"
                style={{ borderColor: bg, color: bg, background: light, fontFamily: RACING, fontSize: "1rem" }}>
                ⚡ Challenge
              </button>
            </div>
          </div>
        )}

      </div>

      {/* Formula reference */}
      <div className="bg-white rounded-3xl p-4 border-2" style={{ borderColor: `${bg}33` }}>
        <p className="mb-2 text-sm text-center" style={{ color: bg, fontFamily: RACING }}>
          📐 Formula Reference
        </p>
        <div className="grid grid-cols-2 gap-2 text-xs">
          {([
            ["26–50",   "x=50−n, AB=25−x, CD=x²"],
            ["51–75",   "x=n−50, AB=25+x, CD=x²"],
            ["76–100",  "x=100−n, AB=50−x, CD=x²"],
            ["101–125", "x=n−100, AB=50+x, CD=x²"],
          ] as [string, string][]).map(([t, d]) => {
            const active = range === t.replace("–", "-");
            return (
              <div key={t} className="rounded-xl p-2 text-center"
                style={{
                  background: active ? `${bg}18` : light,
                  border:     active ? `1.5px solid ${bg}` : "none",
                }}>
                <div style={{ fontFamily: RACING, color: BRAND_TEAL_DK, fontSize: "0.85rem" }}>{t}</div>
                <div style={{ fontFamily: OUTFIT, color: BRAND_TEAL, fontWeight: 600 }}>{d}</div>
              </div>
            );
          })}
        </div>
        <div className="mt-3 rounded-xl p-2 text-center text-xs"
          style={{ background: `${bg}10`, border: `1px dashed ${bg}` }}>
          <span style={{ fontFamily: OUTFIT, fontWeight: 700, color: bg }}>
            Always: Answer = AB × 100 + CD
          </span>
        </div>
      </div>

    </div>
  );
}




// ─── Bottom Decorations ───────────────────────────────────────────────────────
function BottomDecorations({ visible }: { visible: boolean }) {
  const base = (delay: string): React.CSSProperties => ({
    transition: `opacity 0.6s ease ${delay}, transform 0.6s ease ${delay}`,
    opacity: visible ? 1 : 0,
  });
  return (
    <div className="w-full flex items-end justify-between px-6 md:px-16 pb-4 pointer-events-none select-none overflow-hidden" style={{ minHeight: 110 }}>
      <div style={{ ...base("0.9s"), transform: visible ? "rotate(-20deg)" : "rotate(-20deg) translateY(60px)" }}>
        <img src="/Images/speed-maths/SPEED MATHS WEBPAGE IMAGES/PNG RESOURCES/PENCIL@2x.png" alt="Pencil"
          style={{ width: "auto", height: "100px", objectFit: "contain", filter: "drop-shadow(0 4px 8px rgba(0,0,0,0.15))" }} />
      </div>
      <div style={{ ...base("1.0s"), transform: visible ? "rotate(-8deg)" : "rotate(-8deg) translateY(60px)" }}>
        <img src="/Images/speed-maths/SPEED MATHS WEBPAGE IMAGES/PNG RESOURCES/SCALE@2x.png" alt="Scale"
          style={{ width: "auto", height: "80px", objectFit: "contain", filter: "drop-shadow(0 4px 8px rgba(0,0,0,0.15))" }} />
      </div>
      <div style={{ ...base("1.1s"), transform: visible ? "translateY(0)" : "translateY(60px)" }}>
        <img src="/Images/speed-maths/SPEED MATHS WEBPAGE IMAGES/PNG RESOURCES/BOOKS@2x.png" alt="Books"
          style={{ width: "auto", height: "100px", objectFit: "contain", filter: "drop-shadow(0 4px 8px rgba(0,0,0,0.15))" }} />
      </div>
      <div style={{ ...base("1.2s"), transform: visible ? "translateY(0)" : "translateY(60px)" }}>
        <img src="/Images/speed-maths/SPEED MATHS WEBPAGE IMAGES/PNG RESOURCES/CALCULATOR@2x.png" alt="Calculator"
          style={{ width: "auto", height: "90px", objectFit: "contain", filter: "drop-shadow(0 4px 8px rgba(0,0,0,0.15))" }} />
      </div>
    </div>
  );
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
  const [level, setLevel] = useState(1);
  const [feedback, setFeedback] = useState<"correct" | "incorrect" | null>(null);
  const [typedAnswer, setTypedAnswer] = useState("");
  const [timeLeft, setTimeLeft] = useState(0);
  const [questionsLeft, setQuestionsLeft] = useState(10);
  const [totalTime, setTotalTime] = useState(0);
  const [halfPracticeNum, setHalfPracticeNum] = useState(() => generateHalfPracticeNum());
  const [half3StepKey, setHalf3StepKey] = useState(0);
  const [squareNum, setSquareNum] = useState(() => rand(11, 59));
  const [squareViewKey, setSquareViewKey] = useState(0);

  const [heroVisible, setHeroVisible] = useState(false);
  const [cardsVisible, setCardsVisible] = useState(false);
  const [decoVisible, setDecoVisible] = useState(false);
  const [cloudsVisible, setCloudsVisible] = useState(false);
  const [rocketVisible, setRocketVisible] = useState(false);

  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const totalTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const stopTimers = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current);
    if (totalTimerRef.current) clearInterval(totalTimerRef.current);
  }, []);

  useEffect(() => { const t = setTimeout(() => setGameState("menu"), 2200); return () => clearTimeout(t); }, []);

  useEffect(() => {
    if (gameState === "menu") {
      setHeroVisible(false); setCardsVisible(false); setDecoVisible(false); setCloudsVisible(false); setRocketVisible(false);
      const t1 = setTimeout(() => setHeroVisible(true), 100);
      const t2 = setTimeout(() => setRocketVisible(true), 200);
      const t3 = setTimeout(() => setCardsVisible(true), 320);
      const t4 = setTimeout(() => setDecoVisible(true), 560);
      const t5 = setTimeout(() => setCloudsVisible(true), 700);
      return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); clearTimeout(t4); clearTimeout(t5); };
    }
  }, [gameState]);

  const beginGame = useCallback(() => {
    const q = generateQuestion(challenge);
    setQuestion(q); setScore(0); setStreak(0); setLevel(1);
    setFeedback(null); setTypedAnswer(""); setQuestionsLeft(10); setTotalTime(0);
    setGameState("playing"); stopTimers();
    if (timeMode === "timed") {
      setTimeLeft(secondsPerQ);
      timerRef.current = setInterval(() => {
        setTimeLeft(t => {
          if (t <= 1) {
            clearInterval(timerRef.current!); setFeedback("incorrect"); setStreak(0);
            setTimeout(() => {
              setQuestion(generateQuestion(challenge)); setTimeLeft(secondsPerQ); setFeedback(null); setTypedAnswer("");
              timerRef.current = setInterval(() => setTimeLeft(tt => tt - 1), 1000);
            }, 1400);
            return 0;
          }
          return t - 1;
        });
      }, 1000);
    } else { totalTimerRef.current = setInterval(() => setTotalTime(t => t + 1), 1000); }
  }, [challenge, timeMode, secondsPerQ, stopTimers]);

  const handleAnswer = useCallback((chosen: number | string) => {
    if (!question || feedback) return;
    const userAns = typeof chosen === "string" ? parseFloat(chosen) : chosen;
    const correct = Math.abs(userAns - question.answer) < 0.01;
    setFeedback(correct ? "correct" : "incorrect");
    if (correct) { setScore(s => s + 10 + streak * 2); setStreak(s => { const ns = s + 1; if (ns % 5 === 0) setLevel(l => l + 1); return ns; }); }
    else { setStreak(0); }
    setTimeout(() => {
      if (timeMode === "fixed-questions") { const next = questionsLeft - 1; if (next <= 0) { stopTimers(); setGameState("result"); return; } setQuestionsLeft(next); }
      setQuestion(generateQuestion(challenge)); setFeedback(null); setTypedAnswer("");
      if (timeMode === "timed") setTimeLeft(secondsPerQ);
    }, 1200);
  }, [question, feedback, streak, timeMode, questionsLeft, challenge, secondsPerQ, stopTimers]);

  useEffect(() => () => stopTimers(), [stopTimers]);

  const gameBg = "linear-gradient(160deg,#f0fdf9 0%,#fff 60%,#e8f9f8 100%)";

  // ─── SPLASH ───────────────────────────────────────────────────────────────
  if (gameState === "splash") return (
    <div className="min-h-screen flex flex-col items-center justify-center"
      style={{ background: `linear-gradient(170deg,${BRAND_TEAL_DK} 0%,${BRAND_TEAL} 60%,${BRAND_TEAL_DK} 100%)` }}>
      <style>{GLOBAL_STYLES}</style>
      <div style={{ animation: "rocketBob 2s ease-in-out infinite", width: 120 }}>
        <img src={ROCKET_IMG} alt="Rocket" style={{ width: "100%", height: "auto", filter: "drop-shadow(0 8px 24px rgba(0,0,0,0.35))" }} />
      </div>
      <h1 className="text-white mt-5" style={{ fontFamily: RACING, fontSize: "clamp(2.5rem,8vw,4rem)", textShadow: "0 4px 20px rgba(0,0,0,0.3)", animation: "fadeUp 0.7s ease 0.3s both" }}>
        Logicology
      </h1>
      <p className="text-white/75 text-xl mt-1" style={{ fontFamily: RACING, animation: "fadeUp 0.7s ease 0.5s both" }}>Speed Maths ⚡</p>
      <p className="text-white/45 mt-4 text-sm" style={{ fontFamily: OUTFIT, animation: "fadeUp 0.7s ease 0.7s both" }}>Loading your brain workout…</p>
    </div>
  );

  // ─── MENU ─────────────────────────────────────────────────────────────────
  if (gameState === "menu") return (
    <>
      <NavBar />
      <div className="min-h-screen flex flex-col overflow-hidden" style={{ fontFamily: OUTFIT }}>
        <style>{GLOBAL_STYLES}</style>

        <section
  className="relative overflow-hidden flex flex-col items-center bg-[#1b4552]"
  style={{
    minHeight: "88vh",
    backgroundImage: `
      linear-gradient(rgba(255,255,255,0.045) 1px, transparent 1px),
      linear-gradient(90deg, rgba(255,255,255,0.045) 1px, transparent 1px),
      linear-gradient(rgba(255,255,255,0.018) 1px, transparent 1px),
      linear-gradient(90deg, rgba(255,255,255,0.018) 1px, transparent 1px)
    `,
    backgroundSize: `80px 80px, 80px 80px, 20px 20px, 20px 20px`,
    backgroundPosition: `-1px -1px, -1px -1px, -1px -1px, -1px -1px`,
  }}
>  {/* Chalk math symbols */}
          {([
            { t: "4²", s: { top: "9%",  left: "5%",   fontSize: 30 } },
            { t: "√",  s: { top: "19%", left: "11%",  fontSize: 38 } },
            { t: "1",  s: { top: "53%", left: "4%",   fontSize: 52 } },
            { t: "Z",  s: { top: "69%", left: "8%",   fontSize: 26 } },
            { t: "α²", s: { top: "8%",  right: "7%",  fontSize: 28 } },
            { t: "4²", s: { top: "23%", right: "4%",  fontSize: 34 } },
            { t: "⬡",  s: { top: "40%", left: "2%",   fontSize: 26 } },
            { t: "⬡",  s: { top: "14%", right: "19%", fontSize: 20 } },
            { t: "≈",  s: { top: "59%", right: "5%",  fontSize: 30 } },
          ] as { t: string; s: React.CSSProperties }[]).map((sym, i) => (
            <span key={i} aria-hidden className="absolute select-none pointer-events-none font-bold text-white"
              style={{ ...sym.s, opacity: 0.18 }}>{sym.t}</span>
          ))}

          {/* Rocket */}
          <div className="absolute right-4 md:right-10 pointer-events-none z-20"
            style={{
              top: "clamp(80px, 15vh, 120px)",
              opacity: rocketVisible ? 1 : 0,
              animation: rocketVisible ? "rocketFlyUp 1.2s cubic-bezier(0.34, 1.2, 0.55, 1) forwards, rocketHover 3s ease-in-out 1.2s infinite" : "none",
              width: "clamp(130px, 18vw, 240px)",
            }}>
            <img src={ROCKET_IMG} alt="Rocket"
              style={{ width: "100%", height: "auto", filter: "drop-shadow(0 12px 28px rgba(0,0,0,0.38))" }} />
          </div>

          {/* Title */}
          <div className="relative z-10 text-center pt-14 md:pt-16 px-6"
            style={{
              opacity: heroVisible ? 1 : 0,
              transform: heroVisible ? "translateY(0)" : "translateY(-28px)",
              transition: "opacity 0.75s ease 0.1s, transform 0.75s ease 0.1s",
            }}>
            <h1 className="text-white leading-none mb-2"
              style={{ fontFamily: RACING, fontSize: "clamp(2.8rem,7.5vw,5.2rem)", textShadow: "0 4px 18px rgba(0,0,0,0.28)" }}>
              Speed Maths
            </h1>
            <p className="text-white/80 text-lg md:text-xl" style={{ fontFamily: OUTFIT, fontWeight: 600 }}>
              Choose your Challenge!
            </p>
          </div>

          {/* Cards */}
          <div className="relative z-30 w-full max-w-5xl mx-auto px-4 md:px-8 pb-6 mt-10 md:mt-12">
            <div className="hidden md:grid grid-cols-5 gap-5">
              {(Object.keys(CHALLENGE_COLORS) as Challenge[]).map((ch, i) => (
                <MenuChallengeCard key={ch} ch={ch} index={i} visible={cardsVisible}
                  onClick={() => { setChallenge(ch); setGameState("mode-select"); }} />
              ))}
            </div>
            <div className="md:hidden grid grid-cols-2 gap-4">
              {(Object.keys(CHALLENGE_COLORS) as Challenge[]).map((ch, i) => (
                <div key={ch} style={{ marginTop: i % 2 !== 0 ? 36 : 0 }}>
                  <MenuChallengeCard ch={ch} index={i} visible={cardsVisible}
                    onClick={() => { setChallenge(ch); setGameState("mode-select"); }} />
                </div>
              ))}
            </div>
          </div>

          {/* Clouds */}
          <div className="absolute bottom-0 left-0 w-full pointer-events-none select-none z-10"
            style={{
              opacity: cloudsVisible ? 1 : 0,
              transform: cloudsVisible ? "translateY(0)" : "translateY(80px)",
              transition: "opacity 0.9s ease 0.7s, transform 0.9s cubic-bezier(.22,1,.36,1) 0.7s",
            }}>
            <img src={CLOUDS_IMG} alt=""
              style={{ width: "100%", height: "auto", maxHeight: "45vh", objectFit: "fill", objectPosition: "bottom", display: "block" }} />
          </div>
        </section>

        <section className="bg-white relative overflow-hidden" style={{ minHeight: 120 }}>
          <BottomDecorations visible={decoVisible} />
        </section>
      </div>
    </>
  );

  // ─── MODE-SELECT ──────────────────────────────────────────────────────────
  if (gameState === "mode-select") {
    const { bg, light } = CHALLENGE_COLORS[challenge];
    return (
      <div className="min-h-screen flex flex-col items-center px-4 pt-8 pb-10" style={{ background: gameBg, fontFamily: OUTFIT }}>
        <style>{GLOBAL_STYLES}</style>
        <Stars count={6} />
        <button onClick={() => setGameState("menu")} className="self-start mb-4 text-lg"
          style={{ color: BRAND_TEAL, fontFamily: RACING }}>← Back</button>
        <h2 className="text-3xl mb-6" style={{ color: bg, fontFamily: RACING }}>{challenge}</h2>

        {challenge === "Half" && (<>
          <p className="mb-4 text-lg" style={{ color: BRAND_TEAL, fontFamily: OUTFIT, fontWeight: 700 }}>Choose Mode</p>
          <div className="flex flex-col gap-3 w-full max-w-sm">
            <button onClick={() => setGameState("half-table")} className="rounded-3xl py-4 text-xl shadow-lg active:scale-95"
              style={{ background: light, border: `3px solid ${bg}`, color: bg, fontFamily: RACING }}>📋 Table Practice</button>
            <button onClick={() => { setHalfPracticeNum(generateHalfPracticeNum()); setHalf3StepKey(k => k + 1); setGameState("half-3step"); }}
              className="rounded-3xl py-4 text-xl shadow-lg active:scale-95"
              style={{ background: light, border: `3px solid ${bg}`, color: bg, fontFamily: RACING }}>🪜 3-Step Practice</button>
            <button onClick={() => setGameState("settings")} className="rounded-3xl py-4 text-xl shadow-lg active:scale-95"
              style={{ background: bg, color: "#fff", fontFamily: RACING }}>⚡ Challenge</button>
          </div>
        </>)}

        {challenge === "Squares" && (<>
          <p className="mb-4 text-lg" style={{ color: BRAND_TEAL, fontFamily: OUTFIT, fontWeight: 700 }}>Choose Mode</p>
          <div className="flex flex-col gap-3 w-full max-w-sm">
            <button onClick={() => { setSquareNum(rand(11, 59)); setSquareViewKey(k => k + 1); setGameState("square-step"); }}
              className="rounded-3xl py-4 text-xl shadow-lg active:scale-95"
              style={{ background: light, border: `3px solid ${bg}`, color: bg, fontFamily: RACING }}>🪜 Step Practice</button>
            <button onClick={() => setGameState("settings")} className="rounded-3xl py-4 text-xl shadow-lg active:scale-95"
              style={{ background: bg, color: "#fff", fontFamily: RACING }}>⚡ Challenge</button>
          </div>
        </>)}

        {challenge !== "Half" && challenge !== "Squares" && (<>
          <p className="mb-4 text-lg" style={{ color: BRAND_TEAL, fontFamily: OUTFIT, fontWeight: 700 }}>How do you want to answer?</p>
          <div className="flex flex-col gap-3 w-full max-w-sm">
            <button onClick={() => { setAnswerMode("Choose Option"); setGameState("settings"); }}
              className="rounded-3xl py-4 text-xl shadow-lg active:scale-95"
              style={{ background: answerMode === "Choose Option" ? bg : light, border: `3px solid ${bg}`, color: answerMode === "Choose Option" ? "#fff" : bg, fontFamily: RACING }}>
              🎯 Choose Option
            </button>
            <button onClick={() => { setAnswerMode("Type Answer"); setGameState("settings"); }}
              className="rounded-3xl py-4 text-xl shadow-lg active:scale-95"
              style={{ background: answerMode === "Type Answer" ? bg : light, border: `3px solid ${bg}`, color: answerMode === "Type Answer" ? "#fff" : bg, fontFamily: RACING }}>
              ⌨️ Type Answer
            </button>
          </div>
        </>)}
      </div>
    );
  }

  // ─── SETTINGS ─────────────────────────────────────────────────────────────
  if (gameState === "settings") {
    const { bg, light } = CHALLENGE_COLORS[challenge];
    return (
      <div className="min-h-screen flex flex-col items-center px-4 pt-8 pb-10" style={{ background: gameBg, fontFamily: OUTFIT }}>
        <style>{GLOBAL_STYLES}</style>
        <Stars count={5} />
        <button onClick={() => setGameState("mode-select")} className="self-start mb-4 text-lg"
          style={{ color: BRAND_TEAL, fontFamily: RACING }}>← Back</button>
        <h2 className="text-3xl mb-1" style={{ color: bg, fontFamily: RACING }}>{challenge}</h2>
        <p className="mb-6" style={{ color: BRAND_TEAL, fontFamily: OUTFIT, fontWeight: 600 }}>{answerMode}</p>
        <div className="w-full max-w-sm bg-white rounded-3xl shadow-xl p-6 mb-6 border-2" style={{ borderColor: bg }}>
          <p className="text-lg mb-4" style={{ color: BRAND_TEAL_DK, fontFamily: RACING }}>⏱ Choose Time Mode</p>
          <div className="flex gap-3 mb-4">
            <button onClick={() => setTimeMode("timed")} className="flex-1 rounded-2xl py-3 transition"
              style={{ background: timeMode === "timed" ? bg : light, color: timeMode === "timed" ? "#fff" : bg, border: `2px solid ${bg}`, fontFamily: RACING }}>
              Per Question
            </button>
            <button onClick={() => setTimeMode("fixed-questions")} className="flex-1 rounded-2xl py-3 transition"
              style={{ background: timeMode === "fixed-questions" ? bg : light, color: timeMode === "fixed-questions" ? "#fff" : bg, border: `2px solid ${bg}`, fontFamily: RACING }}>
              10 Questions
            </button>
          </div>
          {timeMode === "timed" && (<>
            <p className="mb-2" style={{ color: BRAND_TEAL, fontFamily: OUTFIT, fontWeight: 700 }}>Seconds per Question</p>
            <input type="range" min={2} max={30} value={secondsPerQ} onChange={e => setSecondsPerQ(Number(e.target.value))}
              className="w-full mb-1" style={{ accentColor: bg }} />
            <div className="flex justify-between text-sm mb-2" style={{ color: `${bg}99`, fontFamily: OUTFIT }}>
              <span>2s</span><span>30s</span>
            </div>
            <div className="text-center" style={{ color: bg, fontFamily: RACING, fontSize: "1.6rem" }}>{secondsPerQ} seconds per question</div>
          </>)}
          {timeMode === "fixed-questions" && (
            <p className="text-center" style={{ color: BRAND_TEAL, fontFamily: OUTFIT, fontWeight: 700 }}>Solve 10 questions as fast as you can! ⚡</p>
          )}
        </div>
        <button onClick={beginGame} className="w-full max-w-sm rounded-3xl py-5 shadow-xl active:scale-95 hover:scale-105"
          style={{ background: `linear-gradient(135deg,${bg},${BRAND_TEAL_DK})`, color: "#fff", fontFamily: RACING, fontSize: "1.6rem" }}>
          🚀 Start!
        </button>
      </div>
    );
  }

  // ─── HALF TABLE ───────────────────────────────────────────────────────────
  if (gameState === "half-table") {
    const { bg, light } = CHALLENGE_COLORS["Half"];
    return (
      <div className="min-h-screen flex flex-col items-center px-4 pt-8 pb-10" style={{ background: gameBg }}>
        <style>{GLOBAL_STYLES}</style>
        <Stars count={6} />
        <button onClick={() => setGameState("mode-select")} className="self-start mb-4 text-lg"
          style={{ color: BRAND_TEAL, fontFamily: RACING }}>← Back</button>
        <div style={{ fontFamily: RACING, fontSize: "2.5rem", color: bg }}>½</div>
        <h2 className="text-3xl mb-1" style={{ color: bg, fontFamily: RACING }}>Half Table</h2>
        <p className="mb-6" style={{ color: BRAND_TEAL, fontFamily: OUTFIT, fontWeight: 600 }}>What is half of each digit?</p>
        <HalfTableQuiz bg={bg} light={light}
          onNext={() => { setHalfPracticeNum(generateHalfPracticeNum()); setHalf3StepKey(k => k + 1); setGameState("half-3step"); }} />
      </div>
    );
  }

  // ─── HALF 3-STEP ──────────────────────────────────────────────────────────
  if (gameState === "half-3step") {
    const { bg, light } = CHALLENGE_COLORS["Half"];
    return (
      <div className="min-h-screen flex flex-col items-center px-4 pt-8 pb-10 overflow-y-auto" style={{ background: gameBg }}>
        <style>{GLOBAL_STYLES}</style>
        <Stars count={5} />
        <button onClick={() => setGameState("mode-select")} className="self-start mb-4 text-lg"
          style={{ color: BRAND_TEAL, fontFamily: RACING }}>← Back</button>
        <h2 className="text-3xl mb-1" style={{ color: bg, fontFamily: RACING }}>Half 3-Step Method</h2>
        <p className="mb-6 text-sm text-center" style={{ color: BRAND_TEAL, fontFamily: OUTFIT, fontWeight: 600 }}>
          Follow the steps to find half of the number below!
        </p>
        <Half3StepInteractive key={half3StepKey} practiceNum={halfPracticeNum} bg={bg} light={light}
          onComplete={() => setGameState("settings")}
          onNewNumber={() => { setHalfPracticeNum(generateHalfPracticeNum()); setHalf3StepKey(k => k + 1); }} />
        <div className="w-full max-w-sm bg-white rounded-3xl p-4 border-2 mt-5" style={{ borderColor: `${bg}33` }}>
          <p className="mb-2 text-sm text-center" style={{ color: bg, fontFamily: RACING }}>📖 Table Half Reference</p>
          <div className="grid grid-cols-5 gap-1 text-center text-xs">
            {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map(d => (
              <div key={d} className="rounded-lg py-1" style={{ background: light, color: BRAND_TEAL, fontFamily: RACING }}>
                {d}→{Math.floor(d / 2)}
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // ─── SQUARE STEP game state section (inside SpeedMathsPage) ───────────────────
if (gameState === "square-step") {
  const { bg, light } = CHALLENGE_COLORS["Squares"];

  const randInRange = (r: string) => {
    if (r === "26-50")   return rand(26, 50);
    if (r === "51-75")   return rand(51, 75);
    if (r === "76-100")  return rand(76, 100);
    return rand(101, 125);
  };

  return (
    <div className="min-h-screen flex flex-col items-center px-4 pt-8 pb-10 overflow-y-auto"
      style={{ background: gameBg }}>
      <style>{GLOBAL_STYLES}</style>
      <Stars count={5} />
      <button
        onClick={() => setGameState("mode-select")}
        className="self-start mb-4 text-lg"
        style={{ color: BRAND_TEAL, fontFamily: RACING }}>
        ← Back
      </button>
      <div style={{ fontFamily: RACING, fontSize: "2.5rem", color: bg }}>²</div>
      <h2 className="text-3xl mb-4" style={{ color: bg, fontFamily: RACING }}>Square Steps</h2>
      <SquareStepView
        key={squareViewKey}
        squareNum={squareNum}
        bg={bg}
        light={light}
        onTryAnother={() => {
          setSquareNum(rand(26, 125));
          setSquareViewKey(k => k + 1);
        }}
        onRangeSelect={(r) => {
          setSquareNum(randInRange(r));
          setSquareViewKey(k => k + 1);
        }}
        onGoSettings={() => setGameState("settings")}
      />
    </div>
  );
}

  // ─── RESULT ───────────────────────────────────────────────────────────────
  if (gameState === "result") {
    const { bg } = CHALLENGE_COLORS[challenge];
    return (
      <div className="min-h-screen flex flex-col items-center justify-center px-4" style={{ background: gameBg }}>
        <style>{GLOBAL_STYLES}</style>
        <Stars count={12} />
        <div className="text-7xl mb-4">🏆</div>
        <h2 className="text-4xl mb-2" style={{ color: bg, fontFamily: RACING }}>Well Done!</h2>
        <div className="bg-white rounded-3xl shadow-xl p-8 w-full max-w-sm border-2 mb-6" style={{ borderColor: bg }}>
          {[
            { emoji: "⭐", label: "Score", value: score },
            { emoji: "🔥", label: "Best Streak", value: streak },
            { emoji: "🏆", label: "Level Reached", value: level },
            ...(timeMode === "fixed-questions" ? [{ emoji: "⏱", label: "Total Time", value: `${totalTime}s` }] : []),
          ].map(({ emoji, label, value }) => (
            <div key={label} className="flex justify-between items-center py-3 border-b border-gray-100 last:border-0">
              <span className="text-2xl">{emoji}</span>
              <span style={{ color: BRAND_TEAL, fontFamily: OUTFIT, fontWeight: 700 }}>{label}</span>
              <span style={{ color: bg, fontFamily: RACING, fontSize: "1.4rem" }}>{value}</span>
            </div>
          ))}
        </div>
        <div className="flex gap-3 w-full max-w-sm">
          <button onClick={beginGame} className="flex-1 rounded-3xl py-4 shadow-lg active:scale-95"
            style={{ background: bg, color: "#fff", fontFamily: RACING, fontSize: "1.2rem" }}>🔄 Again</button>
          <button onClick={() => setGameState("menu")} className="flex-1 rounded-3xl py-4 shadow-lg active:scale-95 border-2"
            style={{ borderColor: bg, color: bg, background: "#fff", fontFamily: RACING, fontSize: "1.2rem" }}>🏠 Menu</button>
        </div>
      </div>
    );
  }

  // ─── PLAYING ──────────────────────────────────────────────────────────────
  if (gameState === "playing" && question) {
    const { bg, light } = CHALLENGE_COLORS[challenge];
    const timerPct = timeMode === "timed" ? (timeLeft / secondsPerQ) * 100 : 100;
    const feedbackBg = feedback === "correct" ? "#22c55e" : feedback === "incorrect" ? "#ef4444" : bg;
    return (
      <div className="min-h-screen flex flex-col items-center px-4 pt-6 pb-8 transition-all"
        style={{ background: feedback ? (feedback === "correct" ? "#f0fdf4" : "#fef2f2") : gameBg }}>
        <style>{GLOBAL_STYLES}</style>
        <div className="w-full max-w-md flex items-center justify-between mb-4">
          <button onClick={() => { stopTimers(); setGameState("menu"); }} className="text-lg"
            style={{ color: BRAND_TEAL, fontFamily: RACING }}>✕</button>
          <h3 style={{ color: bg, fontFamily: RACING, fontSize: "1.3rem" }}>{challenge}</h3>
          {timeMode === "fixed-questions"
            ? <span style={{ color: BRAND_TEAL, fontFamily: RACING }}>{questionsLeft} left</span>
            : <span style={{ color: BRAND_TEAL, fontFamily: RACING }}>⏱ {timeLeft}s</span>
          }
        </div>
        {timeMode === "timed" && (
          <div className="w-full max-w-md h-3 rounded-full mb-4 overflow-hidden" style={{ background: "#e0f2f1" }}>
            <div className="h-full rounded-full transition-all duration-1000"
              style={{ width: `${timerPct}%`, background: timerPct > 50 ? bg : timerPct > 25 ? "#D8AE4F" : "#E45C48" }} />
          </div>
        )}
        <ScoreBar score={score} streak={streak} level={level} />
        <div className="w-full max-w-md rounded-3xl shadow-2xl p-8 mb-6 text-center relative overflow-hidden"
          style={{ background: feedback ? feedbackBg : light, border: `4px solid ${feedback ? feedbackBg : bg}` }}>
          {feedback && (
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-8xl">{feedback === "correct" ? "🎉" : "😅"}</span>
            </div>
          )}
          <div style={{ opacity: feedback ? 0.18 : 1 }}>
            <p className="mb-2 text-base" style={{ color: bg, fontFamily: OUTFIT, fontWeight: 700 }}>What is</p>
            <div style={{ color: bg, fontFamily: RACING, fontSize: "clamp(3rem,12vw,5rem)", lineHeight: 1.1 }}>
              {question.display}
            </div>
            {feedback === "incorrect" && (
              <div className="mt-2 text-lg text-white" style={{ fontFamily: RACING }}>Answer: {question.answer}</div>
            )}
          </div>
        </div>
        {!feedback && answerMode === "Choose Option" && question.options && (
          <div className="grid grid-cols-2 gap-3 w-full max-w-md">
            {question.options.map(opt => (
              <button key={opt} onClick={() => handleAnswer(opt)}
                className="rounded-3xl py-5 shadow-lg active:scale-95 hover:scale-105"
                style={{ background: "#fff", border: `3px solid ${bg}`, color: bg, fontFamily: RACING, fontSize: "1.8rem" }}>
                {opt}
              </button>
            ))}
          </div>
        )}
        {!feedback && answerMode === "Type Answer" && (
          <div className="w-full max-w-md">
            <NumPad value={typedAnswer}
              onDigit={d => setTypedAnswer(v => v === "0" ? d : v.includes(".") && d === "0.5" ? v : v + d)}
              onErase={() => setTypedAnswer(v => v.slice(0, -1))}
              onEnter={() => handleAnswer(typedAnswer)} />
          </div>
        )}
      </div>
    );
  }

  return null;
}
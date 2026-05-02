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

// ─── Challenge palette ────────────────────────────────────────────────────────
const CHALLENGE_COLORS: Record<Challenge, { bg: string; light: string; emoji: string; expr: string }> = {
  Addition:       { bg: "#2EC4B6", light: "#E8F9F8", emoji: "➕", expr: "5+1=?" },
  Subtraction:    { bg: "#E45C48", light: "#FDE8E5", emoji: "➖", expr: "10-5=?" },
  Multiplication: { bg: "#6ABF4B", light: "#EDF7E8", emoji: "✖️", expr: "6×3=?" },
  Half:           { bg: "#D8AE4F", light: "#FDF6E3", emoji: "½",  expr: "½ of n" },
  Squares:        { bg: "#9B8EC4", light: "#F0EEF9", emoji: "²",  expr: "n²=?" },
};

// ─── Image paths for challenge cards ─────────────────────────────────────────
const CHALLENGE_IMAGES: Record<Challenge, string> = {
  Addition:       "/Images/speed-maths/SPEED MATHS WEBPAGE IMAGES/PNG RESOURCES/ADDITION@2x.png",
  Subtraction:    "/Images/speed-maths/SPEED MATHS WEBPAGE IMAGES/PNG RESOURCES/SUBTRACTION@2x.png",
  Multiplication: "/Images/speed-maths/SPEED MATHS WEBPAGE IMAGES/PNG RESOURCES/MULTIPLICATION@2X.png",
  Half:           "/Images/speed-maths/SPEED MATHS WEBPAGE IMAGES/PNG RESOURCES/FRACTION@2x.png",
  Squares:        "/Images/speed-maths/SPEED MATHS WEBPAGE IMAGES/PNG RESOURCES/DIVISION@2x.png",
};

const ROCKET_IMG = "/Images/speed-maths/SPEED MATHS WEBPAGE IMAGES/PNG RESOURCES/ROCKET@2x.png";
const CLOUDS_IMG = "/Images/speed-maths/SPEED MATHS WEBPAGE IMAGES/PNG RESOURCES/CLOUDS.png";

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
        {/* Image area - taller and bigger */}
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
        {/* Label pill - bigger */}
        <div style={{ padding: "12px 12px 14px" }}>
          <div
            className="w-full rounded-2xl py-4 text-center text-white font-black text-lg tracking-wide shadow"
            style={{
              background: bg,
              transform: hov ? "scale(1.02)" : "scale(1)",
              transition: "transform 0.2s",
              fontSize: "1.2rem",
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
        <div key={label} className="flex items-center gap-2 rounded-2xl px-4 py-2 font-bold shadow"
          style={{ background: "#fff", border: `2.5px solid ${color}`, color }}>
          <span className="text-xl">{emoji}</span>
          <span className="text-base">{label}: {value}</span>
        </div>
      ))}
    </div>
  );
}

function NumPad({ onDigit, onEnter, onErase, value }:
  { onDigit: (d: string) => void; onEnter: () => void; onErase: () => void; value: string }) {
  return (
    <div className="w-full max-w-xs mx-auto">
      <div className="rounded-2xl border-4 bg-white px-4 py-2 text-center text-3xl font-bold mb-3 min-h-[52px]"
        style={{ borderColor: BRAND_TEAL, color: BRAND_TEAL_DK }}>
        {value || <span className="text-gray-300">?</span>}
      </div>
      <div className="grid grid-cols-3 gap-2">
        {["1", "2", "3", "4", "5", "6", "7", "8", "9", "0.5", "0", "E"].map(d => (
          <button key={d} onClick={() => d === "E" ? onErase() : onDigit(d)}
            className="rounded-2xl py-3 text-xl font-bold shadow transition active:scale-95"
            style={{ background: d === "E" ? "#E45C48" : "#e8f9f8", color: d === "E" ? "#fff" : BRAND_TEAL_DK, border: `2px solid ${BRAND_TEAL}44` }}>
            {d === "E" ? "⌫" : d}
          </button>
        ))}
      </div>
      <button onClick={onEnter} className="mt-3 w-full rounded-2xl py-3 text-xl font-bold shadow-lg transition active:scale-95"
        style={{ background: BRAND_TEAL, color: "#fff" }}>✓ Enter</button>
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
    setFeedback(ok ? "correct" : "wrong"); if (ok) setCorrect(c => c + 1);
  };
  const next = () => { const n = attempted + 1; setAttempted(n); setInputVal(""); setFeedback(null); if (n >= TOTAL) setDone(true); };
  const handleKey = (e: React.KeyboardEvent) => { if (e.key === "Enter") { if (feedback) next(); else checkAnswer(); } };
  const restart = () => { setAttempted(0); setCorrect(0); setInputVal(""); setFeedback(null); setDone(false); };
  const refTable = [[0, 0], [1, 0], [2, 1], [3, 1], [4, 2], [5, 2], [6, 3], [7, 3], [8, 4], [9, 4]];

  if (done) {
    const pct = Math.round((correct / TOTAL) * 100);
    return (
      <div className="w-full max-w-sm mx-auto bg-white rounded-3xl shadow-xl p-8 border-2 text-center" style={{ borderColor: bg }}>
        <div className="text-6xl mb-3">{pct >= 90 ? "🌟" : pct >= 70 ? "👍" : "💪"}</div>
        <h3 className="text-2xl font-black mb-1" style={{ color: bg }}>Quiz Complete!</h3>
        <p className="mb-2 font-semibold" style={{ color: BRAND_TEAL }}>{correct}/{TOTAL} correct — {pct}%</p>
        <div className="flex gap-3 mt-6">
          <button onClick={restart} className="flex-1 rounded-2xl py-3 font-bold text-white active:scale-95" style={{ background: bg }}>🔄 Retry</button>
          <button onClick={onNext} className="flex-1 rounded-2xl py-3 font-bold active:scale-95 border-2" style={{ borderColor: bg, color: bg, background: light }}>🪜 3-Step</button>
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
        <span className="text-sm font-bold min-w-[48px] text-right" style={{ color: bg }}>{attempted}/{TOTAL}</span>
      </div>
      <div className="flex justify-center gap-4">
        <div className="flex items-center gap-2 rounded-2xl px-4 py-2 font-bold shadow text-sm" style={{ background: "#fff", border: `2.5px solid ${bg}`, color: bg }}>✅ Correct: {correct}</div>
        <div className="flex items-center gap-2 rounded-2xl px-4 py-2 font-bold shadow text-sm" style={{ background: "#fff", border: "2.5px solid #e0f2f1", color: BRAND_TEAL }}>📝 Left: {TOTAL - attempted}</div>
      </div>
      <div className="bg-white rounded-3xl shadow-xl p-6 border-2 text-center" style={{ borderColor: feedback === "correct" ? "#22c55e" : feedback === "wrong" ? "#ef4444" : bg }}>
        <p className="font-semibold mb-1 text-sm" style={{ color: bg }}>Table half of</p>
        <div className="text-8xl font-black my-3" style={{ color: bg, fontFamily: "'Fredoka One',cursive" }}>{currentDigit}</div>
        <input ref={inputRef} type="number" min={0} max={4} value={inputVal}
          onChange={e => { if (!feedback) setInputVal(e.target.value); }} onKeyDown={handleKey} disabled={!!feedback} placeholder="?"
          className="w-32 text-center text-4xl font-black rounded-2xl py-3 outline-none transition-all mb-3"
          style={{
            border: `4px solid ${feedback === "correct" ? "#22c55e" : feedback === "wrong" ? "#ef4444" : bg}`,
            background: feedback === "correct" ? "#f0fdf4" : feedback === "wrong" ? "#fef2f2" : light,
            color: feedback === "correct" ? "#15803d" : feedback === "wrong" ? "#dc2626" : bg
          }} />
        {feedback === "correct" && <p className="text-green-500 font-black text-lg mb-2">✅ Correct!</p>}
        {feedback === "wrong" && <p className="text-red-400 font-black text-base mb-2">❌ Table half of {currentDigit} is <span className="text-red-600">{expectedAnswer}</span></p>}
        {!feedback
          ? <button onClick={checkAnswer} disabled={inputVal === ""} className="w-full rounded-2xl py-3 text-lg font-black text-white active:scale-95"
            style={{ background: inputVal !== "" ? bg : "#ccc", cursor: inputVal !== "" ? "pointer" : "not-allowed" }}>Check ✓</button>
          : <button onClick={next} className="w-full rounded-2xl py-3 text-lg font-black text-white active:scale-95" style={{ background: bg }}>Next →</button>
        }
      </div>
      <div className="bg-white rounded-3xl p-4 border-2" style={{ borderColor: `${bg}33` }}>
        <button onClick={() => setShowRef(v => !v)} className="w-full text-left text-sm font-bold flex justify-between items-center" style={{ color: bg }}>
          <span>📖 Reference Table</span><span>{showRef ? "▲" : "▼"}</span>
        </button>
        {showRef && (
          <div className="grid grid-cols-5 gap-2 mt-3">
            {refTable.map(([d, h]) => (
              <div key={d} className="rounded-xl py-2 text-center" style={{ background: light }}>
                <div className="text-sm font-bold" style={{ color: bg }}>{d}</div>
                <div className="text-xs font-semibold" style={{ color: BRAND_TEAL }}>→ {h}</div>
              </div>
            ))}
          </div>
        )}
        {!showRef && <p className="text-xs mt-1" style={{ color: `${bg}99` }}>0,1→0 | 2,3→1 | 4,5→2 | 6,7→3 | 8,9→4</p>}
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
  const [step3Done, setStep3Done] = useState(false);

  const upS1 = (idx: number, val: string) => { if (phase !== "step1") return; const n = [...userStep1]; n[idx] = val === "" ? null : val; setUserStep1(n); };
  const chkS1 = () => { const fb = userStep1.map((v, i) => v !== null && parseInt(v) === step1[i]); setStep1Feedback(fb); if (fb.every(Boolean)) setTimeout(() => setPhase("step2"), 600); };
  const togOdd = (idx: number) => { if (phase !== "step2" || step2Checked) return; const ns = [...userOddSel]; ns[idx] = !ns[idx]; setUserOddSel(ns); };
  const chkS2 = () => {
    const ok = oddPositions.every((v, i) => v === userOddSel[i]); setStep2Checked(true);
    if (ok) { setStep2Feedback("correct"); setTimeout(() => setPhase("step3"), 800); }
    else { setStep2Feedback("wrong"); setTimeout(() => { setStep2Checked(false); setStep2Feedback(null); setUserOddSel(digits.map(() => false)); }, 1200); }
  };
  const getFV = (i: number) => { let v = step1[i]; if (i > 0 && oddPositions[i - 1]) v += 5; if (v >= 10) v -= 10; return v; };
  const needsHalf = () => oddPositions[digits.length - 1];
  const upS3 = (idx: number, val: string) => { if (phase !== "step3" || step3Done) return; setStep3UserVals(p => ({ ...p, [idx]: val })); };
  const chkS3 = () => {
    const fb: Record<number, boolean> = {};
    digits.forEach((_, i) => { const exp = getFV(i); const uv = step3UserVals[i] !== undefined ? parseInt(step3UserVals[i]) : NaN; fb[i] = uv === exp; });
    setStep3Feedback(fb);
    if (Object.values(fb).every(Boolean)) { setStep3Done(true); setTimeout(() => setPhase("done"), 600); }
  };
  const allS3 = digits.every((_, i) => step3UserVals[i] !== undefined && step3UserVals[i] !== "");
  const anyS3Wrong = Object.values(step3Feedback).some(v => v === false);
  const baseCell = (bc: string, bgc: string): React.CSSProperties => ({ width: 56, height: 56, borderRadius: 14, border: `3px solid ${bc}`, background: bgc, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22, fontWeight: 900, color: BRAND_TEAL_DK, flexShrink: 0 });
  const inpSty = (fb: boolean | null): React.CSSProperties => ({ width: 56, height: 56, borderRadius: 14, border: `3px solid ${fb === null ? bg : fb ? "#22c55e" : "#ef4444"}`, background: fb === true ? "#f0fdf4" : fb === false ? "#fef2f2" : "#fff", textAlign: "center", fontSize: 22, fontWeight: 900, color: BRAND_TEAL_DK, outline: "none", flexShrink: 0 });

  return (
    <div className="w-full max-w-sm mx-auto space-y-5">
      <div className="flex gap-2">{(["step1", "step2", "step3", "done"] as Half3StepPhase[]).map((p, i) => (
        <div key={p} className="flex-1 h-2 rounded-full transition-all duration-500"
          style={{ background: (["step1", "step2", "step3", "done"] as Half3StepPhase[]).indexOf(phase) > i ? bg : phase === p ? `${bg}99` : "#e0f2f1" }} />
      ))}</div>
      <div className="text-center"><span className="font-bold text-base" style={{ color: bg }}>Find half of</span>
        <div className="text-5xl font-black mt-1" style={{ color: bg }}>{practiceNum}</div></div>

      {/* Step 1 */}
      <div className="bg-white rounded-3xl p-5 border-2 shadow-lg" style={{ borderColor: phase === "step1" ? bg : "#e0f2f1" }}>
        <div className="flex items-center gap-2 mb-3">
          <div className="rounded-full w-8 h-8 flex items-center justify-center text-sm font-black text-white" style={{ background: phase === "step1" ? bg : "#22c55e" }}>{phase === "step1" ? "1" : "✓"}</div>
          <span className="font-bold" style={{ color: BRAND_TEAL_DK }}>Write table half of each digit</span>
        </div>
        <div className="flex gap-3 justify-center mb-2">{digits.map((d, i) => <div key={i} style={{ ...baseCell(bg, light), color: bg }}>{d}</div>)}</div>
        <div className="text-center text-sm font-semibold mb-2" style={{ color: bg }}>↓ table half ↓</div>
        <div className="flex gap-3 justify-center">
          {digits.map((_, i) => phase === "step1"
            ? <input key={i} type="number" min={0} max={4} value={userStep1[i] ?? ""} onChange={e => upS1(i, e.target.value)} style={inpSty(step1Feedback[i])} placeholder="?" />
            : <div key={i} style={{ ...baseCell("#22c55e", "#f0fdf4"), color: "#15803d" }}>{step1[i]}</div>)}
        </div>
        {phase === "step1" && <button onClick={chkS1} disabled={!userStep1.every(v => v !== null)}
          className="mt-4 w-full rounded-2xl py-3 font-bold text-white active:scale-95"
          style={{ background: userStep1.every(v => v !== null) ? bg : "#ccc" }}>Check ✓</button>}
        {phase === "step1" && step1Feedback.some(f => f === false) && <div className="text-red-400 text-center font-bold mt-2 text-sm">Some wrong! (0,1→0|2,3→1|4,5→2|6,7→3|8,9→4)</div>}
      </div>

      {/* Step 2 */}
      {(phase === "step2" || phase === "step3" || phase === "done") && (
        <div className="bg-white rounded-3xl p-5 border-2 shadow-lg" style={{ borderColor: phase === "step2" ? bg : "#e0f2f1" }}>
          <div className="flex items-center gap-2 mb-3">
            <div className="rounded-full w-8 h-8 flex items-center justify-center text-sm font-black text-white" style={{ background: phase === "step2" ? bg : "#22c55e" }}>{phase === "step2" ? "2" : "✓"}</div>
            <span className="font-bold" style={{ color: BRAND_TEAL_DK }}>{phase === "step2" ? "Tap the cells from odd digits 👇" : "Highlighted cells from odd digits"}</span>
          </div>
          <div className="flex gap-3 justify-center mb-3">
            {step1.map((v, i) => (
              <div key={i} onClick={() => togOdd(i)} style={{
                width: 56, height: 56, borderRadius: 14,
                border: `3px solid ${phase === "step2" ? (userOddSel[i] ? "#f59e0b" : bg) : (oddPositions[i] ? "#f59e0b" : bg)}`,
                background: phase === "step2" ? (userOddSel[i] ? "#fef3c7" : light) : (oddPositions[i] ? "#fef3c7" : light),
                display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22, fontWeight: 900,
                color: phase === "step2" ? (userOddSel[i] ? "#b45309" : BRAND_TEAL_DK) : (oddPositions[i] ? "#b45309" : BRAND_TEAL_DK),
                cursor: phase === "step2" && !step2Checked ? "pointer" : "default", transition: "all 0.2s",
                boxShadow: (phase === "step2" ? userOddSel[i] : oddPositions[i]) ? "0 0 0 3px #fbbf24" : "none"
              }}>
                {v}
              </div>
            ))}
          </div>
          {phase === "step2" && <>
            <p className="text-xs text-center mb-3" style={{ color: BRAND_TEAL }}>Tap cells from <strong>odd</strong> digits</p>
            <button onClick={chkS2} className="w-full rounded-2xl py-3 font-bold text-white active:scale-95" style={{ background: bg }}>Confirm Selection ✓</button>
            {step2Feedback === "wrong" && <div className="text-red-400 text-center font-bold mt-2 text-sm">❌ Not quite — try again!</div>}
            {step2Feedback === "correct" && <div className="text-green-500 text-center font-bold mt-2 text-sm">✅ Correct!</div>}
          </>}
          {phase !== "step2" && <p className="text-center text-amber-600 font-semibold text-sm">🟡 Highlighted = odd → add +5 to cell on RIGHT!</p>}
        </div>
      )}

      {/* Step 3 */}
      {(phase === "step3" || phase === "done") && (
        <div className="bg-white rounded-3xl p-5 border-2 shadow-lg" style={{ borderColor: phase === "step3" ? bg : "#e0f2f1" }}>
          <div className="flex items-center gap-2 mb-3">
            <div className="rounded-full w-8 h-8 flex items-center justify-center text-sm font-black text-white" style={{ background: phase === "step3" ? bg : "#22c55e" }}>{phase === "step3" ? "3" : "✓"}</div>
            <span className="font-bold" style={{ color: BRAND_TEAL_DK }}>Add +5 from yellow cells to cell on the RIGHT</span>
          </div>
          <p className="text-xs mb-4" style={{ color: BRAND_TEAL }}>For each yellow cell, add 5 to the cell to its RIGHT.
            {oddPositions[digits.length - 1] && <span> Rightmost yellow → add .5 to final answer.</span>}</p>
          <div className="flex items-center justify-center gap-2 mb-4">
            {step1.map((v, i) => (
              <div key={i} className="flex flex-col items-center">
                <div style={{ ...baseCell(oddPositions[i] ? "#f59e0b" : bg, oddPositions[i] ? "#fef3c7" : light), color: oddPositions[i] ? "#b45309" : BRAND_TEAL_DK }}>{v}</div>
                {oddPositions[i] && i < step1.length - 1 && <div className="text-xs text-amber-500 mt-1">+5 →</div>}
                {oddPositions[i] && i === step1.length - 1 && <div className="text-xs text-amber-500 mt-1">+.5</div>}
              </div>
            ))}
          </div>
          <div className="text-center text-sm font-semibold mb-2" style={{ color: bg }}>↓ Result after +5 ↓</div>
          <div className="flex gap-2 justify-center">
            {digits.map((_, i) => {
              const exp = getFV(i), fb = step3Feedback[i] ?? null, uv = step3UserVals[i] ?? "";
              return <div key={i} className="flex flex-col items-center">
                {phase === "step3" && !step3Done
                  ? <input type="number" value={uv} onChange={e => upS3(i, e.target.value)} style={inpSty(fb)} className="text-center" placeholder="?" />
                  : <div style={{ ...baseCell("#22c55e", "#f0fdf4"), color: "#15803d" }}>{exp}</div>}
              </div>;
            })}
          </div>
          {needsHalf() && phase === "step3" && !step3Done && <div className="text-center mt-2 font-bold text-lg" style={{ color: bg }}>+ .5 at the end</div>}
          {phase === "step3" && !step3Done && <>
            <button onClick={chkS3} disabled={!allS3} className="mt-4 w-full rounded-2xl py-3 font-bold text-white active:scale-95"
              style={{ background: allS3 ? bg : "#ccc", cursor: allS3 ? "pointer" : "not-allowed" }}>Check ✓</button>
            {anyS3Wrong && <div className="text-red-400 text-center font-bold mt-2 text-sm">❌ Not right — add +5 from yellow to RIGHT!</div>}
          </>}
          {phase === "step3" && step3Done && <div className="mt-4 text-center font-bold text-green-600">
            Final: {digits.map((_, i) => getFV(i)).join("")}{needsHalf() ? ".5" : ""}
          </div>}
        </div>
      )}

      {phase === "done" && (
        <div className="bg-white rounded-3xl p-6 border-2 shadow-xl text-center" style={{ borderColor: "#22c55e" }}>
          <div className="text-5xl mb-2">🎉</div>
          <div className="text-2xl font-black text-green-600 mb-1">½ of {practiceNum} = <span style={{ color: bg }}>{answer}</span></div>
          <div className="font-semibold mb-4" style={{ color: BRAND_TEAL }}>{Number.isInteger(answer) ? "Great work!" : "Notice the .5 — last digit was odd!"}</div>
          <div className="flex gap-3">
            <button onClick={onNewNumber} className="flex-1 rounded-2xl py-3 font-bold text-white active:scale-95" style={{ background: bg }}>🔄 New Number</button>
            <button onClick={onComplete} className="flex-1 rounded-2xl py-3 font-bold active:scale-95 border-2" style={{ borderColor: bg, color: bg, background: light }}>⚡ Challenge</button>
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
      <button className="flex-1 rounded-2xl py-4 px-4 text-left font-bold text-white shadow-md"
        style={{ background: locked ? "#aaa" : `linear-gradient(135deg,${bg},${BRAND_TEAL_DK})`, opacity: locked ? 0.5 : 1, cursor: "default", minHeight: 64 }}>
        <div className="text-sm font-black leading-tight">{label}</div>
        {sublabel && <div className="text-xs font-semibold opacity-80 mt-0.5">{sublabel}</div>}
      </button>
      <div className={`${wide ? "min-w-[90px]" : "w-16"} flex-shrink-0`}>
        {confirmed
          ? <div className="rounded-2xl flex items-center justify-center font-black text-xl h-14"
            style={{ border: `3px solid ${bg}`, background: "#f0fdf4", color: "#15803d", minWidth: wide ? 90 : 64 }}>{confirmedValue}</div>
          : <input ref={ref} type="number" value={value} onChange={e => !locked && onChange(e.target.value)}
            onKeyDown={e => e.key === "Enter" && !locked && onSubmit()} disabled={locked} placeholder={placeholder}
            className="rounded-2xl font-black text-xl h-14 text-center outline-none transition-all w-full"
            style={{ border: `3px solid ${bc}`, background: bgc, color: tc, minWidth: wide ? 90 : 64 }} />
        }
      </div>
    </div>
  );
}

// ─── Square Step View ─────────────────────────────────────────────────────────
function SquareStepView({ squareNum, onTryAnother, onGoSettings, bg, light }:
  { squareNum: number; onTryAnother: () => void; onGoSettings: () => void; bg: string; light: string }) {
  const diff = 50 - squareNum, absDiff = Math.abs(diff), AB = 25 - absDiff, CD = absDiff * absDiff, finalAnswer = squareNum * squareNum;
  const CDStr = String(CD).padStart(2, "0"), ABCDStr = String(AB) + CDStr;
  const [currentStep, setCurrentStep] = useState(0);
  const [vals, setVals] = useState(["", "", "", ""]);
  const [feedbacks, setFeedbacks] = useState<("correct" | "wrong" | null)[]>([null, null, null, null]);
  const [confirmed, setConfirmed] = useState([false, false, false, false]);
  const correctAnswers = [absDiff, AB, CD, finalAnswer];

  const handleChange = (i: number, v: string) => { const n = [...vals]; n[i] = v; setVals(n); };
  const handleSubmit = (i: number) => {
    const uv = parseFloat(vals[i]), exp = correctAnswers[i];
    if (Math.abs(uv - exp) < 0.01) {
      const nf = [...feedbacks]; nf[i] = "correct"; setFeedbacks(nf);
      setTimeout(() => { const nc = [...confirmed]; nc[i] = true; setConfirmed([...nc]); if (i < 3) setCurrentStep(i + 1); else setCurrentStep(4); }, 600);
    } else {
      const nf = [...feedbacks]; nf[i] = "wrong"; setFeedbacks(nf);
      setTimeout(() => { const nf2 = [...feedbacks]; nf2[i] = null; setFeedbacks(nf2); }, 1000);
    }
  };
  const steps = [
    { label: "Step 1", sublabel: `${squareNum} is ${squareNum > 50 ? "more" : "less"} than 50 by`, placeholder: "x",    wide: false, displayVal: absDiff },
    { label: "Step 2", sublabel: `Subtract ${absDiff} from 25`,                               placeholder: "AB",  wide: false, displayVal: AB },
    { label: "Step 3", sublabel: `Square of ${absDiff} is`,                                   placeholder: "CD",  wide: false, displayVal: CDStr },
    { label: "Answer", sublabel: "Step 2 & 3 combined",                                        placeholder: "ABCD", wide: true, displayVal: ABCDStr },
  ];
  const isDone = currentStep === 4;
  return (
    <div className="w-full max-w-sm mx-auto space-y-3">
      <div className="flex gap-1.5 mb-2">{[0, 1, 2, 3].map(i => (
        <div key={i} className="flex-1 h-2.5 rounded-full transition-all duration-500"
          style={{ background: i < currentStep ? bg : i === currentStep ? `${bg}88` : "#e0f2f1" }} />
      ))}</div>
      <div className="text-center mb-4">
        <div className="font-bold text-sm" style={{ color: bg }}>Find Square of</div>
        <div className="text-6xl font-black" style={{ color: bg, fontFamily: "'Fredoka One',cursive" }}>{squareNum}</div>
        <div className="text-sm font-semibold mt-1" style={{ color: `${bg}88` }}>(50 − x method)</div>
      </div>
      <div className="bg-white rounded-3xl shadow-xl border-2 p-5 space-y-3" style={{ borderColor: isDone ? "#22c55e" : bg }}>
        {steps.map((s, i) => (
          <SquareStepRow key={i} label={s.label} sublabel={s.sublabel} placeholder={s.placeholder}
            value={vals[i]} onChange={v => handleChange(i, v)} onSubmit={() => handleSubmit(i)}
            feedback={feedbacks[i]} locked={currentStep < i} confirmed={confirmed[i]}
            confirmedValue={confirmed[i] ? s.displayVal : undefined} wide={s.wide} bg={bg} />
        ))}
        {!isDone && currentStep < 4 && (
          <button onClick={() => handleSubmit(currentStep)} disabled={!vals[currentStep]}
            className="w-full rounded-2xl py-3 font-black text-white text-lg mt-2 active:scale-95"
            style={{ background: vals[currentStep] ? `linear-gradient(135deg,${bg},${BRAND_TEAL_DK})` : "#ccc", cursor: vals[currentStep] ? "pointer" : "not-allowed" }}>
            Check ✓</button>
        )}
        {feedbacks[currentStep] === "wrong" && !isDone && <div className="text-red-400 text-center font-bold text-sm">❌ Not quite — try again!</div>}
        {isDone && (
          <div className="text-center pt-2">
            <div className="text-3xl mb-1">🎉</div>
            <div className="text-xl font-black" style={{ color: bg }}>{squareNum}² = {finalAnswer}</div>
            <div className="text-sm font-semibold mt-1 mb-4" style={{ color: BRAND_TEAL }}>{AB} | {CDStr} → {ABCDStr}</div>
            <div className="flex gap-3">
              <button onClick={onTryAnother} className="flex-1 rounded-2xl py-3 font-bold text-white active:scale-95"
                style={{ background: `linear-gradient(135deg,${bg},${BRAND_TEAL_DK})` }}>🔄 Try Another</button>
              <button onClick={onGoSettings} className="flex-1 rounded-2xl py-3 font-bold active:scale-95 border-2"
                style={{ borderColor: bg, color: bg, background: light }}>⚡ Challenge</button>
            </div>
          </div>
        )}
      </div>
      <div className="bg-white rounded-3xl p-4 border-2" style={{ borderColor: `${bg}33` }}>
        <p className="font-bold mb-2 text-sm text-center" style={{ color: bg }}>📐 Formula (50 − x method)</p>
        <div className="grid grid-cols-2 gap-2 text-xs font-semibold">
          {[["Step 1", "x = |50 − n|"], ["Step 2 (AB)", "25 − x"], ["Step 3 (CD)", "x² (2 digits)"], ["Answer", "AB + CD"]].map(([t, d]) => (
            <div key={t} className="rounded-xl p-2 text-center" style={{ background: light }}>
              <div className="font-black" style={{ color: BRAND_TEAL_DK }}>{t}</div>
              <div style={{ color: BRAND_TEAL }}>{d}</div>
            </div>
          ))}
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
      {/* Pencil Image */}
      <div style={{ ...base("0.9s"), transform: visible ? "rotate(-20deg)" : "rotate(-20deg) translateY(60px)" }}>
        <img 
          src="/Images/speed-maths/SPEED MATHS WEBPAGE IMAGES/PNG RESOURCES/PENCIL@2x.png" 
          alt="Pencil"
          style={{ width: "auto", height: "100px", objectFit: "contain", filter: "drop-shadow(0 4px 8px rgba(0,0,0,0.15))" }}
        />
      </div>
      
      {/* Scale Image */}
      <div style={{ ...base("1.0s"), transform: visible ? "rotate(-8deg)" : "rotate(-8deg) translateY(60px)" }}>
        <img 
          src="/Images/speed-maths/SPEED MATHS WEBPAGE IMAGES/PNG RESOURCES/SCALE@2x.png" 
          alt="Scale"
          style={{ width: "auto", height: "80px", objectFit: "contain", filter: "drop-shadow(0 4px 8px rgba(0,0,0,0.15))" }}
        />
      </div>
      
      {/* Books Image */}
      <div style={{ ...base("1.1s"), transform: visible ? "translateY(0)" : "translateY(60px)" }}>
        <img 
          src="/Images/speed-maths/SPEED MATHS WEBPAGE IMAGES/PNG RESOURCES/BOOKS@2x.png" 
          alt="Books"
          style={{ width: "auto", height: "100px", objectFit: "contain", filter: "drop-shadow(0 4px 8px rgba(0,0,0,0.15))" }}
        />
      </div>
      
      {/* Calculator Image */}
      <div style={{
        ...base("1.2s"), transform: visible ? "translateY(0)" : "translateY(60px)",
      }}>
        <img 
          src="/Images/speed-maths/SPEED MATHS WEBPAGE IMAGES/PNG RESOURCES/CALCULATOR@2x.png" 
          alt="Calculator"
          style={{ width: "auto", height: "90px", objectFit: "contain", filter: "drop-shadow(0 4px 8px rgba(0,0,0,0.15))" }}
        />
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

  // Menu animation state
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

  // Splash → menu
  useEffect(() => { const t = setTimeout(() => setGameState("menu"), 2200); return () => clearTimeout(t); }, []);

  // Trigger menu enter animations
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

  // ─── SPLASH ──────────────────────────────────────────────────────────────
  if (gameState === "splash") return (
    <div className="min-h-screen flex flex-col items-center justify-center"
      style={{ background: `linear-gradient(170deg,${BRAND_TEAL_DK} 0%,${BRAND_TEAL} 60%,${BRAND_TEAL_DK} 100%)` }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Fredoka+One&family=Outfit:wght@400;600;700;900&display=swap');
        @keyframes rocketBob{0%,100%{transform:translateY(0)}50%{transform:translateY(-10px)}}
        @keyframes fadeUp{from{opacity:0;transform:translateY(20px)}to{opacity:1;transform:translateY(0)}}
      `}</style>
      <div style={{ animation: "rocketBob 2s ease-in-out infinite", width: 120 }}>
        <img src={ROCKET_IMG} alt="Rocket" style={{ width: "100%", height: "auto", filter: "drop-shadow(0 8px 24px rgba(0,0,0,0.35))" }} />
      </div>
      <h1 className="text-white font-black mt-5 text-5xl" style={{ fontFamily: "'Fredoka One',cursive", textShadow: "0 4px 20px rgba(0,0,0,0.3)", animation: "fadeUp 0.7s ease 0.3s both" }}>
        Logicology
      </h1>
      <p className="text-white/75 text-xl font-semibold mt-1" style={{ fontFamily: "'Outfit',sans-serif", animation: "fadeUp 0.7s ease 0.5s both" }}>Speed Maths ⚡</p>
      <p className="text-white/45 mt-4 text-sm" style={{ animation: "fadeUp 0.7s ease 0.7s both" }}>Loading your brain workout…</p>
    </div>
  );

  // ─── MENU ─────────────────────────────────────────────────────────────────
  if (gameState === "menu") return (
    <>
      <NavBar />
      <div className="min-h-screen flex flex-col overflow-hidden" style={{ fontFamily: "'Outfit','Fredoka One',sans-serif" }}>
        <style>{`
          @import url('https://fonts.googleapis.com/css2?family=Fredoka+One&family=Outfit:wght@400;600;700;900&display=swap');
          @keyframes rocketFlyUp {
            0% { opacity: 0; transform: translateY(100vh) scale(0.6); }
            40% { opacity: 1; transform: translateY(35vh) scale(1.1); }
            100% { opacity: 1; transform: translateY(0) scale(1); }
          }
          @keyframes rocketHover{0%,100%{transform:translateY(0)}50%{transform:translateY(-8px)}}
          @keyframes cloudSlideIn{from{opacity:0;transform:translateY(60px)}to{opacity:1;transform:translateY(0)}}
        `}</style>

        {/* ── Hero / dark-teal section ── */}
        <section
          className="relative overflow-hidden flex flex-col items-center"
          style={{
            background: `linear-gradient(170deg,${BRAND_TEAL_DK} 0%,${BRAND_TEAL} 55%,${BRAND_TEAL_DK} 100%)`,
            minHeight: "88vh",
          }}
        >
          {/* Chalk math symbols */}
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

          {/* ── ROCKET — starts from bottom, flies up to top with gap from header ── */}
          <div
            className="absolute right-4 md:right-10 pointer-events-none z-20"
            style={{
              top: "clamp(80px, 15vh, 120px)",
              opacity: rocketVisible ? 1 : 0,
              animation: rocketVisible ? "rocketFlyUp 1.2s cubic-bezier(0.34, 1.2, 0.55, 1) forwards, rocketHover 3s ease-in-out 1.2s infinite" : "none",
              width: "clamp(130px, 18vw, 240px)",
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

          {/* Title */}
          <div
            className="relative z-10 text-center pt-14 md:pt-16 px-6"
            style={{
              opacity: heroVisible ? 1 : 0,
              transform: heroVisible ? "translateY(0)" : "translateY(-28px)",
              transition: "opacity 0.75s ease 0.1s, transform 0.75s ease 0.1s",
            }}
          >
            <h1
              className="text-white font-black leading-none mb-2"
              style={{
                fontFamily: "'Fredoka One',cursive",
                fontSize: "clamp(2.8rem,7.5vw,5.2rem)",
                textShadow: "0 4px 18px rgba(0,0,0,0.28)",
              }}
            >
              Speed Maths
            </h1>
            <p className="text-white/80 font-semibold text-lg md:text-xl" style={{ fontFamily: "'Outfit',sans-serif" }}>
              Choose your Challenge!
            </p>
          </div>

          {/* Cards - Higher z-index to ensure visibility above clouds */}
          <div className="relative z-30 w-full max-w-5xl mx-auto px-4 md:px-8 pb-6 mt-10 md:mt-12">
            {/* Desktop: 5 cols */}
            <div className="hidden md:grid grid-cols-5 gap-5">
              {(Object.keys(CHALLENGE_COLORS) as Challenge[]).map((ch, i) => (
                <MenuChallengeCard key={ch} ch={ch} index={i} visible={cardsVisible}
                  onClick={() => { setChallenge(ch); setGameState("mode-select"); }} />
              ))}
            </div>
            {/* Mobile: 2-col zigzag */}
            <div className="md:hidden grid grid-cols-2 gap-4">
              {(Object.keys(CHALLENGE_COLORS) as Challenge[]).map((ch, i) => (
                <div key={ch} style={{ marginTop: i % 2 !== 0 ? 36 : 0 }}>
                  <MenuChallengeCard ch={ch} index={i} visible={cardsVisible}
                    onClick={() => { setChallenge(ch); setGameState("mode-select"); }} />
                </div>
              ))}
            </div>
          </div>

          {/* ── Single CLOUDS image — bottom of hero, rising from bottom to mid, but behind cards ── */}
          <div
            className="absolute bottom-0 left-0 w-full pointer-events-none select-none z-10"
            style={{
              opacity: cloudsVisible ? 1 : 0,
              transform: cloudsVisible ? "translateY(0)" : "translateY(80px)",
              transition: "opacity 0.9s ease 0.7s, transform 0.9s cubic-bezier(.22,1,.36,1) 0.7s",
            }}
          >
            <img
              src={CLOUDS_IMG}
              alt=""
              style={{
                width: "100%",
                height: "auto",
                maxHeight: "45vh",
                objectFit: "fill",
                objectPosition: "bottom",
                display: "block",
              }}
            />
          </div>
        </section>

        {/* White bottom section with decorations */}
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
      <div className="min-h-screen flex flex-col items-center px-4 pt-8 pb-10" style={{ background: gameBg }}>
        <Stars count={6} />
        <button onClick={() => setGameState("menu")} className="self-start mb-4 font-bold text-lg" style={{ color: BRAND_TEAL }}>← Back</button>
        <div className="text-5xl mb-2">{CHALLENGE_COLORS[challenge].emoji}</div>
        <h2 className="text-3xl font-black mb-6" style={{ color: bg, fontFamily: "'Fredoka One',cursive" }}>{challenge}</h2>
        {challenge === "Half" && (<>
          <p className="font-bold mb-4 text-lg" style={{ color: BRAND_TEAL }}>Choose Mode</p>
          <div className="flex flex-col gap-3 w-full max-w-sm">
            <button onClick={() => setGameState("half-table")} className="rounded-3xl py-4 text-xl font-bold shadow-lg active:scale-95" style={{ background: light, border: `3px solid ${bg}`, color: bg }}>📋 Table Practice</button>
            <button onClick={() => { setHalfPracticeNum(generateHalfPracticeNum()); setHalf3StepKey(k => k + 1); setGameState("half-3step"); }} className="rounded-3xl py-4 text-xl font-bold shadow-lg active:scale-95" style={{ background: light, border: `3px solid ${bg}`, color: bg }}>🪜 3-Step Practice</button>
            <button onClick={() => setGameState("settings")} className="rounded-3xl py-4 text-xl font-bold shadow-lg active:scale-95" style={{ background: bg, color: "#fff" }}>⚡ Challenge</button>
          </div>
        </>)}
        {challenge === "Squares" && (<>
          <p className="font-bold mb-4 text-lg" style={{ color: BRAND_TEAL }}>Choose Mode</p>
          <div className="flex flex-col gap-3 w-full max-w-sm">
            <button onClick={() => { setSquareNum(rand(11, 59)); setSquareViewKey(k => k + 1); setGameState("square-step"); }} className="rounded-3xl py-4 text-xl font-bold shadow-lg active:scale-95" style={{ background: light, border: `3px solid ${bg}`, color: bg }}>🪜 Step Practice</button>
            <button onClick={() => setGameState("settings")} className="rounded-3xl py-4 text-xl font-bold shadow-lg active:scale-95" style={{ background: bg, color: "#fff" }}>⚡ Challenge</button>
          </div>
        </>)}
        {challenge !== "Half" && challenge !== "Squares" && (<>
          <p className="font-bold mb-4 text-lg" style={{ color: BRAND_TEAL }}>How do you want to answer?</p>
          <div className="flex flex-col gap-3 w-full max-w-sm">
            <button onClick={() => { setAnswerMode("Choose Option"); setGameState("settings"); }} className="rounded-3xl py-4 text-xl font-bold shadow-lg active:scale-95" style={{ background: answerMode === "Choose Option" ? bg : light, border: `3px solid ${bg}`, color: answerMode === "Choose Option" ? "#fff" : bg }}>🎯 Choose Option</button>
            <button onClick={() => { setAnswerMode("Type Answer"); setGameState("settings"); }} className="rounded-3xl py-4 text-xl font-bold shadow-lg active:scale-95" style={{ background: answerMode === "Type Answer" ? bg : light, border: `3px solid ${bg}`, color: answerMode === "Type Answer" ? "#fff" : bg }}>⌨️ Type Answer</button>
          </div>
        </>)}
      </div>
    );
  }

  // ─── SETTINGS ────────────────────────────────────────────────────────────
  if (gameState === "settings") {
    const { bg, light } = CHALLENGE_COLORS[challenge];
    return (
      <div className="min-h-screen flex flex-col items-center px-4 pt-8 pb-10" style={{ background: gameBg }}>
        <Stars count={5} />
        <button onClick={() => setGameState("mode-select")} className="self-start mb-4 font-bold text-lg" style={{ color: BRAND_TEAL }}>← Back</button>
        <div className="text-5xl mb-2">{CHALLENGE_COLORS[challenge].emoji}</div>
        <h2 className="text-3xl font-black mb-1" style={{ color: bg, fontFamily: "'Fredoka One',cursive" }}>{challenge}</h2>
        <p className="mb-6" style={{ color: BRAND_TEAL }}>{answerMode}</p>
        <div className="w-full max-w-sm bg-white rounded-3xl shadow-xl p-6 mb-6 border-2" style={{ borderColor: bg }}>
          <p className="font-black text-lg mb-4" style={{ color: BRAND_TEAL_DK }}>⏱ Choose Time Mode</p>
          <div className="flex gap-3 mb-4">
            <button onClick={() => setTimeMode("timed")} className="flex-1 rounded-2xl py-3 font-bold transition" style={{ background: timeMode === "timed" ? bg : light, color: timeMode === "timed" ? "#fff" : bg, border: `2px solid ${bg}` }}>Per Question</button>
            <button onClick={() => setTimeMode("fixed-questions")} className="flex-1 rounded-2xl py-3 font-bold transition" style={{ background: timeMode === "fixed-questions" ? bg : light, color: timeMode === "fixed-questions" ? "#fff" : bg, border: `2px solid ${bg}` }}>10 Questions</button>
          </div>
          {timeMode === "timed" && (<>
            <p className="font-bold mb-2" style={{ color: BRAND_TEAL }}>Seconds per Question</p>
            <input type="range" min={2} max={30} value={secondsPerQ} onChange={e => setSecondsPerQ(Number(e.target.value))} className="w-full mb-1" style={{ accentColor: bg }} />
            <div className="flex justify-between text-sm mb-2" style={{ color: `${bg}99` }}><span>2s</span><span>30s</span></div>
            <div className="text-center font-black text-2xl" style={{ color: bg }}>{secondsPerQ} seconds per question</div>
          </>)}
          {timeMode === "fixed-questions" && <p className="text-center font-bold" style={{ color: BRAND_TEAL }}>Solve 10 questions as fast as you can! ⚡</p>}
        </div>
        <button onClick={beginGame} className="w-full max-w-sm rounded-3xl py-5 text-2xl font-black shadow-xl active:scale-95 hover:scale-105"
          style={{ background: `linear-gradient(135deg,${bg},${BRAND_TEAL_DK})`, color: "#fff" }}>🚀 Start!</button>
      </div>
    );
  }

  // ─── HALF TABLE ───────────────────────────────────────────────────────────
  if (gameState === "half-table") {
    const { bg, light } = CHALLENGE_COLORS["Half"];
    return (
      <div className="min-h-screen flex flex-col items-center px-4 pt-8 pb-10" style={{ background: gameBg }}>
        <Stars count={6} />
        <button onClick={() => setGameState("mode-select")} className="self-start mb-4 font-bold text-lg" style={{ color: BRAND_TEAL }}>← Back</button>
        <div className="text-4xl mb-2">½</div>
        <h2 className="text-3xl font-black mb-1" style={{ color: bg, fontFamily: "'Fredoka One',cursive" }}>Half Table</h2>
        <p className="mb-6 font-semibold" style={{ color: BRAND_TEAL }}>What is half of each digit?</p>
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
        <Stars count={5} />
        <button onClick={() => setGameState("mode-select")} className="self-start mb-4 font-bold text-lg" style={{ color: BRAND_TEAL }}>← Back</button>
        <h2 className="text-3xl font-black mb-1" style={{ color: bg, fontFamily: "'Fredoka One',cursive" }}>Half 3-Step Method</h2>
        <p className="mb-6 font-semibold text-sm text-center" style={{ color: BRAND_TEAL }}>Follow the steps to find half of the number below!</p>
        <Half3StepInteractive key={half3StepKey} practiceNum={halfPracticeNum} bg={bg} light={light}
          onComplete={() => setGameState("settings")}
          onNewNumber={() => { setHalfPracticeNum(generateHalfPracticeNum()); setHalf3StepKey(k => k + 1); }} />
        <div className="w-full max-w-sm bg-white rounded-3xl p-4 border-2 mt-5" style={{ borderColor: `${bg}33` }}>
          <p className="font-bold mb-2 text-sm text-center" style={{ color: bg }}>📖 Table Half Reference</p>
          <div className="grid grid-cols-5 gap-1 text-center text-xs font-bold">
            {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map(d => (
              <div key={d} className="rounded-lg py-1" style={{ background: light, color: BRAND_TEAL }}>{d}→{Math.floor(d / 2)}</div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // ─── SQUARE STEP ──────────────────────────────────────────────────────────
  if (gameState === "square-step") {
    const { bg, light } = CHALLENGE_COLORS["Squares"];
    return (
      <div className="min-h-screen flex flex-col items-center px-4 pt-8 pb-10 overflow-y-auto" style={{ background: gameBg }}>
        <Stars count={5} />
        <button onClick={() => setGameState("mode-select")} className="self-start mb-4 font-bold text-lg" style={{ color: BRAND_TEAL }}>← Back</button>
        <div className="text-4xl mb-1">²</div>
        <h2 className="text-3xl font-black mb-4" style={{ color: bg, fontFamily: "'Fredoka One',cursive" }}>Square Steps</h2>
        <SquareStepView key={squareViewKey} squareNum={squareNum} bg={bg} light={light}
          onTryAnother={() => { setSquareNum(rand(11, 59)); setSquareViewKey(k => k + 1); }}
          onGoSettings={() => setGameState("settings")} />
      </div>
    );
  }

  // ─── RESULT ───────────────────────────────────────────────────────────────
  if (gameState === "result") {
    const { bg } = CHALLENGE_COLORS[challenge];
    return (
      <div className="min-h-screen flex flex-col items-center justify-center px-4" style={{ background: gameBg }}>
        <Stars count={12} />
        <div className="text-7xl mb-4">🏆</div>
        <h2 className="text-4xl font-black mb-2" style={{ color: bg, fontFamily: "'Fredoka One',cursive" }}>Well Done!</h2>
        <div className="bg-white rounded-3xl shadow-xl p-8 w-full max-w-sm border-2 mb-6" style={{ borderColor: bg }}>
          {[
            { emoji: "⭐", label: "Score", value: score },
            { emoji: "🔥", label: "Best Streak", value: streak },
            { emoji: "🏆", label: "Level Reached", value: level },
            ...(timeMode === "fixed-questions" ? [{ emoji: "⏱", label: "Total Time", value: `${totalTime}s` }] : []),
          ].map(({ emoji, label, value }) => (
            <div key={label} className="flex justify-between items-center py-3 border-b border-gray-100 last:border-0">
              <span className="text-2xl">{emoji}</span>
              <span className="font-bold" style={{ color: BRAND_TEAL }}>{label}</span>
              <span className="text-2xl font-black" style={{ color: bg }}>{value}</span>
            </div>
          ))}
        </div>
        <div className="flex gap-3 w-full max-w-sm">
          <button onClick={beginGame} className="flex-1 rounded-3xl py-4 text-xl font-black shadow-lg active:scale-95" style={{ background: bg, color: "#fff" }}>🔄 Again</button>
          <button onClick={() => setGameState("menu")} className="flex-1 rounded-3xl py-4 text-xl font-black shadow-lg active:scale-95 border-2" style={{ borderColor: bg, color: bg, background: "#fff" }}>🏠 Menu</button>
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
        <div className="w-full max-w-md flex items-center justify-between mb-4">
          <button onClick={() => { stopTimers(); setGameState("menu"); }} className="font-bold text-lg" style={{ color: BRAND_TEAL }}>✕</button>
          <h3 className="font-black text-xl" style={{ color: bg }}>{challenge}</h3>
          {timeMode === "fixed-questions"
            ? <span className="font-bold" style={{ color: BRAND_TEAL }}>{questionsLeft} left</span>
            : <span className="font-bold" style={{ color: BRAND_TEAL }}>⏱ {timeLeft}s</span>}
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
          {feedback && <div className="absolute inset-0 flex items-center justify-center"><span className="text-8xl">{feedback === "correct" ? "🎉" : "😅"}</span></div>}
          <div style={{ opacity: feedback ? 0.18 : 1 }}>
            <p className="font-bold mb-2 text-base" style={{ color: bg }}>What is</p>
            <div className="text-7xl font-black mb-2" style={{ color: bg, fontFamily: "'Fredoka One',cursive" }}>{question.display}</div>
            {feedback === "incorrect" && <div className="mt-2 text-lg font-black text-white">Answer: {question.answer}</div>}
          </div>
        </div>
        {!feedback && answerMode === "Choose Option" && question.options && (
          <div className="grid grid-cols-2 gap-3 w-full max-w-md">
            {question.options.map(opt => (
              <button key={opt} onClick={() => handleAnswer(opt)}
                className="rounded-3xl py-5 text-3xl font-black shadow-lg active:scale-95 hover:scale-105"
                style={{ background: "#fff", border: `3px solid ${bg}`, color: bg }}>{opt}</button>
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
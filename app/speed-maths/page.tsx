"use client";

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

// ─── Color config ─────────────────────────────────────────────────────────────
const LOGICOLOGY_PURPLE = "#CB6CE6";
const CHALLENGE_COLORS: Record<Challenge, { bg: string; light: string; emoji: string }> = {
  Addition:       { bg: "#FF6B6B", light: "#FFE8E8", emoji: "➕" },
  Subtraction:    { bg: "#FF9F43", light: "#FFF4E8", emoji: "➖" },
  Multiplication: { bg: "#54A0FF", light: "#E8F3FF", emoji: "✖️" },
  Half:           { bg: "#5F27CD", light: "#EEE6FF", emoji: "½" },
  Squares:        { bg: "#1DD1A1", light: "#E6FFF8", emoji: "²" },
};

// ─── Sub-components ───────────────────────────────────────────────────────────

function Stars({ count = 6 }: { count?: number }) {
  return (
    <div className="pointer-events-none fixed inset-0 overflow-hidden">
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className="absolute rounded-full animate-twinkle-delay"
          style={{
            width: `${rand(4,10)}px`, height: `${rand(4,10)}px`,
            background: [LOGICOLOGY_PURPLE,"#FF6B6B","#FFD93D","#54A0FF","#1DD1A1"][i%5],
            top: `${rand(5,90)}%`, left: `${rand(5,90)}%`,
            opacity: 0.4,
            animationDelay: `${i*0.4}s`,
            animationDuration: `${3+i*0.3}s`,
          }}
        />
      ))}
    </div>
  );
}

function ScoreBar({ score, streak, level }: { score: number; streak: number; level: number }) {
  return (
    <div className="flex gap-3 justify-center flex-wrap mb-4">
      {[
        { label: "Score", value: score, emoji: "⭐", color: "#FFD93D" },
        { label: "Streak", value: streak, emoji: "🔥", color: "#FF6B6B" },
        { label: "Level", value: level, emoji: "🏆", color: LOGICOLOGY_PURPLE },
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

function NumPad({ onDigit, onEnter, onErase, value }: { onDigit:(d:string)=>void; onEnter:()=>void; onErase:()=>void; value:string }) {
  return (
    <div className="w-full max-w-xs mx-auto">
      <div className="rounded-2xl border-4 border-purple-300 bg-white px-4 py-2 text-center text-3xl font-bold text-purple-700 mb-3 min-h-[52px]">
        {value || <span className="text-gray-300">?</span>}
      </div>
      <div className="grid grid-cols-3 gap-2">
        {["1","2","3","4","5","6","7","8","9","0.5","0","E"].map(d => (
          <button key={d}
            onClick={() => d==="E" ? onErase() : onDigit(d)}
            className="rounded-2xl py-3 text-xl font-bold shadow transition active:scale-95"
            style={{
              background: d==="E" ? "#FF6B6B" : "#f3e8ff",
              color: d==="E" ? "#fff" : "#7c3aed",
              border: "2px solid #c4b5fd",
            }}>
            {d==="E"?"⌫":d}
          </button>
        ))}
      </div>
      <button onClick={onEnter}
        className="mt-3 w-full rounded-2xl py-3 text-xl font-bold shadow-lg transition active:scale-95"
        style={{ background: LOGICOLOGY_PURPLE, color: "#fff" }}>
        ✓ Enter
      </button>
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────
export default function SpeedMathsPage() {
  // ── All hooks at the top level — never inside conditionals ──
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

  // Half 3-step example index — lifted from inside the conditional
  const [halfExampleIndex, setHalfExampleIndex] = useState(0);

  // Half table practice
  const [halfTableStep, setHalfTableStep] = useState(0);
  const [halfPracticeNum, setHalfPracticeNum] = useState(0);

  // Square step practice — all lifted from inside the conditional
  const [squareNum, setSquareNum] = useState(46);
  const [squareStep, setSquareStep] = useState(0);
  const [squareUserInputs, setSquareUserInputs] = useState<string[]>([]);
  const [squareInp, setSquareInp] = useState("");
  const [squareStepFeedback, setSquareStepFeedback] = useState<string | null>(null);

  const timerRef = useRef<ReturnType<typeof setInterval>|null>(null);
  const totalTimerRef = useRef<ReturnType<typeof setInterval>|null>(null);

  // ── Timer logic ──
  const stopTimers = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current);
    if (totalTimerRef.current) clearInterval(totalTimerRef.current);
  }, []);

  const beginGame = useCallback(() => {
    const q = generateQuestion(challenge);
    setQuestion(q);
    setScore(0); setStreak(0); setLevel(1);
    setFeedback(null); setTypedAnswer("");
    setQuestionsLeft(10);
    setTotalTime(0);
    setGameState("playing");
    stopTimers();

    if (timeMode === "timed") {
      setTimeLeft(secondsPerQ);
      timerRef.current = setInterval(() => {
        setTimeLeft(t => {
          if (t <= 1) {
            clearInterval(timerRef.current!);
            setFeedback("incorrect");
            setStreak(0);
            setTimeout(() => {
              setQuestion(generateQuestion(challenge));
              setTimeLeft(secondsPerQ);
              setFeedback(null);
              setTypedAnswer("");
              timerRef.current = setInterval(() => setTimeLeft(tt => tt - 1), 1000);
            }, 1400);
            return 0;
          }
          return t - 1;
        });
      }, 1000);
    } else {
      totalTimerRef.current = setInterval(() => setTotalTime(t => t+1), 1000);
    }
  }, [challenge, timeMode, secondsPerQ, stopTimers]);

  const handleAnswer = useCallback((chosen: number | string) => {
    if (!question || feedback) return;
    const userAns = typeof chosen === "string" ? parseFloat(chosen) : chosen;
    const correct = Math.abs(userAns - question.answer) < 0.01;
    setFeedback(correct ? "correct" : "incorrect");

    if (correct) {
      setScore(s => s + 10 + streak * 2);
      setStreak(s => { const ns = s+1; if (ns % 5 === 0) setLevel(l => l+1); return ns; });
    } else {
      setStreak(0);
    }

    setTimeout(() => {
      if (timeMode === "fixed-questions") {
        const next = questionsLeft - 1;
        if (next <= 0) { stopTimers(); setGameState("result"); return; }
        setQuestionsLeft(next);
      }
      setQuestion(generateQuestion(challenge));
      setFeedback(null);
      setTypedAnswer("");
      if (timeMode === "timed") setTimeLeft(secondsPerQ);
    }, 1200);
  }, [question, feedback, streak, timeMode, questionsLeft, challenge, secondsPerQ, stopTimers]);

  useEffect(() => () => stopTimers(), [stopTimers]);

  useEffect(() => {
    const t = setTimeout(() => setGameState("menu"), 2200);
    return () => clearTimeout(t);
  }, []);

  // ── Square step check — defined at top level, safe to call from JSX ──
  const checkSquareStep = useCallback(() => {
    const diff = 50 - squareNum;
    const steps = [
      Math.abs(diff),
      25 - Math.abs(diff),
      diff * diff,
    ];
    const expectedAnswer = steps[squareStep];

    if (parseFloat(squareInp) === expectedAnswer) {
      setSquareStepFeedback("correct");
      setTimeout(() => {
        if (squareStep < 2) {
          setSquareStep(s => s + 1);
          setSquareInp("");
          setSquareStepFeedback(null);
        } else {
          setSquareStepFeedback("done:" + squareNum * squareNum);
        }
      }, 900);
    } else {
      setSquareStepFeedback("wrong");
      setTimeout(() => setSquareStepFeedback(null), 900);
    }
  }, [squareNum, squareStep, squareInp]);

  // ─── RENDER ───────────────────────────────────────────────────────────────

  // SPLASH
  if (gameState === "splash") return (
    <div className="min-h-screen flex flex-col items-center justify-center"
      style={{ background: "linear-gradient(135deg,#f9f0ff 0%,#e0d7ff 50%,#ffd6f5 100%)" }}>
      <Stars count={12} />
      <div className="text-center animate-zoom-in">
        <div className="text-8xl mb-4 animate-bounce">🧮</div>
        <h1 className="text-5xl font-black mb-2" style={{ color: LOGICOLOGY_PURPLE, fontFamily:"'Fredoka One',cursive" }}>
          Logicology
        </h1>
        <h2 className="text-3xl font-bold text-purple-400">Speed Maths ⚡</h2>
        <p className="mt-4 text-lg text-purple-300 animate-pulse">Loading your brain workout…</p>
      </div>
    </div>
  );

  // MENU
  if (gameState === "menu") return (
    <div className="min-h-screen flex flex-col items-center justify-start px-4 pb-10 pt-8"
      style={{ background: "linear-gradient(160deg,#f9f0ff 0%,#fff 60%,#ffe8f6 100%)" }}>
      <Stars count={8} />
      <div className="mb-8 text-center">
        <div className="text-5xl mb-1">🧮</div>
        <h1 className="text-4xl font-black" style={{ color: LOGICOLOGY_PURPLE, fontFamily:"'Fredoka One',cursive" }}>Speed Maths</h1>
        <p className="text-purple-400 font-semibold mt-1">Choose your Challenge!</p>
      </div>
      <div className="grid grid-cols-1 gap-4 w-full max-w-sm">
        {(Object.keys(CHALLENGE_COLORS) as Challenge[]).map(ch => {
          const { bg, light, emoji } = CHALLENGE_COLORS[ch];
          return (
            <button key={ch}
              onClick={() => { setChallenge(ch); setGameState("mode-select"); }}
              className="flex items-center gap-4 rounded-3xl px-6 py-5 text-left shadow-lg font-bold text-xl transition active:scale-95 hover:scale-105"
              style={{ background: light, border: `3px solid ${bg}`, color: bg }}>
              <span className="text-4xl">{emoji}</span>
              <span>{ch}</span>
              <span className="ml-auto text-2xl">→</span>
            </button>
          );
        })}
      </div>
    </div>
  );

  // MODE SELECT
  if (gameState === "mode-select") {
    const { bg, light, emoji } = CHALLENGE_COLORS[challenge];
    return (
      <div className="min-h-screen flex flex-col items-center px-4 pt-8 pb-10"
        style={{ background: "linear-gradient(160deg,#f9f0ff 0%,#fff 60%,#ffe8f6 100%)" }}>
        <Stars count={6} />
        <button onClick={() => setGameState("menu")} className="self-start mb-4 text-purple-400 font-bold text-lg">← Back</button>
        <div className="text-5xl mb-2">{emoji}</div>
        <h2 className="text-3xl font-black mb-6" style={{ color: bg, fontFamily:"'Fredoka One',cursive" }}>{challenge}</h2>

        {challenge === "Half" && (
          <>
            <p className="text-purple-500 font-bold mb-4 text-lg">Choose Mode</p>
            <div className="flex flex-col gap-3 w-full max-w-sm">
              <button onClick={() => setGameState("half-table")}
                className="rounded-3xl py-4 text-xl font-bold shadow-lg transition active:scale-95"
                style={{ background: light, border:`3px solid ${bg}`, color: bg }}>
                📋 Table Practice
              </button>
              <button onClick={() => { setHalfExampleIndex(0); setGameState("half-3step"); }}
                className="rounded-3xl py-4 text-xl font-bold shadow-lg transition active:scale-95"
                style={{ background: light, border:`3px solid ${bg}`, color: bg }}>
                🪜 3-Step Practice
              </button>
              <button onClick={() => setGameState("settings")}
                className="rounded-3xl py-4 text-xl font-bold shadow-lg transition active:scale-95"
                style={{ background: bg, color: "#fff" }}>
                ⚡ Challenge
              </button>
            </div>
          </>
        )}
        {challenge === "Squares" && (
          <>
            <p className="text-purple-500 font-bold mb-4 text-lg">Choose Mode</p>
            <div className="flex flex-col gap-3 w-full max-w-sm">
              <button onClick={() => {
                  setSquareNum(rand(11,59));
                  setSquareStep(0);
                  setSquareInp("");
                  setSquareStepFeedback(null);
                  setSquareUserInputs([]);
                  setGameState("square-step");
                }}
                className="rounded-3xl py-4 text-xl font-bold shadow-lg transition active:scale-95"
                style={{ background: light, border:`3px solid ${bg}`, color: bg }}>
                🪜 Step Practice
              </button>
              <button onClick={() => setGameState("settings")}
                className="rounded-3xl py-4 text-xl font-bold shadow-lg transition active:scale-95"
                style={{ background: bg, color: "#fff" }}>
                ⚡ Challenge
              </button>
            </div>
          </>
        )}
        {challenge !== "Half" && challenge !== "Squares" && (
          <>
            <p className="text-purple-500 font-bold mb-4 text-lg">How do you want to answer?</p>
            <div className="flex flex-col gap-3 w-full max-w-sm">
              <button onClick={() => { setAnswerMode("Choose Option"); setGameState("settings"); }}
                className="rounded-3xl py-4 text-xl font-bold shadow-lg transition active:scale-95"
                style={{ background: answerMode==="Choose Option"?bg:light, border:`3px solid ${bg}`, color: answerMode==="Choose Option"?"#fff":bg }}>
                🎯 Choose Option
              </button>
              <button onClick={() => { setAnswerMode("Type Answer"); setGameState("settings"); }}
                className="rounded-3xl py-4 text-xl font-bold shadow-lg transition active:scale-95"
                style={{ background: answerMode==="Type Answer"?bg:light, border:`3px solid ${bg}`, color: answerMode==="Type Answer"?"#fff":bg }}>
                ⌨️ Type Answer
              </button>
            </div>
          </>
        )}
      </div>
    );
  }

  // SETTINGS
  if (gameState === "settings") {
    const { bg, light, emoji } = CHALLENGE_COLORS[challenge];
    return (
      <div className="min-h-screen flex flex-col items-center px-4 pt-8 pb-10"
        style={{ background: "linear-gradient(160deg,#f9f0ff 0%,#fff 60%,#ffe8f6 100%)" }}>
        <Stars count={5} />
        <button onClick={() => setGameState("mode-select")} className="self-start mb-4 text-purple-400 font-bold text-lg">← Back</button>
        <div className="text-5xl mb-2">{emoji}</div>
        <h2 className="text-3xl font-black mb-1" style={{ color: bg, fontFamily:"'Fredoka One',cursive" }}>{challenge}</h2>
        <p className="text-purple-400 mb-6">{answerMode}</p>

        <div className="w-full max-w-sm bg-white rounded-3xl shadow-xl p-6 mb-6 border-2" style={{ borderColor: bg }}>
          <p className="font-black text-purple-700 text-lg mb-4">⏱ Choose Time Mode</p>
          <div className="flex gap-3 mb-4">
            <button onClick={() => setTimeMode("timed")}
              className="flex-1 rounded-2xl py-3 font-bold transition"
              style={{ background: timeMode==="timed"?bg:light, color: timeMode==="timed"?"#fff":bg, border:`2px solid ${bg}` }}>
              Per Question
            </button>
            <button onClick={() => setTimeMode("fixed-questions")}
              className="flex-1 rounded-2xl py-3 font-bold transition"
              style={{ background: timeMode==="fixed-questions"?bg:light, color: timeMode==="fixed-questions"?"#fff":bg, border:`2px solid ${bg}` }}>
              10 Questions
            </button>
          </div>

          {timeMode === "timed" && (
            <>
              <p className="text-purple-500 font-bold mb-2">Seconds per Question</p>
              <input type="range" min={2} max={30} value={secondsPerQ}
                onChange={e => setSecondsPerQ(Number(e.target.value))}
                className="w-full mb-1 accent-purple-500" />
              <div className="flex justify-between text-sm text-purple-300 mb-2">
                <span>2s</span><span>30s</span>
              </div>
              <div className="text-center font-black text-2xl" style={{ color: bg }}>
                {secondsPerQ} seconds per question
              </div>
            </>
          )}
          {timeMode === "fixed-questions" && (
            <p className="text-center text-purple-500 font-bold">Solve 10 questions as fast as you can! ⚡</p>
          )}
        </div>

        <button onClick={beginGame}
          className="w-full max-w-sm rounded-3xl py-5 text-2xl font-black shadow-xl transition active:scale-95 hover:scale-105"
          style={{ background: `linear-gradient(135deg,${bg},${LOGICOLOGY_PURPLE})`, color: "#fff" }}>
          🚀 Start!
        </button>
      </div>
    );
  }

  // HALF TABLE PRACTICE
  if (gameState === "half-table") {
    const table = [
      [0,0],[1,0],[2,1],[3,1],[4,2],[5,2],[6,3],[7,3],[8,4],[9,4]
    ];
    const { bg, light } = CHALLENGE_COLORS["Half"];
    return (
      <div className="min-h-screen flex flex-col items-center px-4 pt-8 pb-10"
        style={{ background: "linear-gradient(160deg,#f9f0ff 0%,#fff 60%,#ffe8f6 100%)" }}>
        <button onClick={() => setGameState("mode-select")} className="self-start mb-4 text-purple-400 font-bold text-lg">← Back</button>
        <div className="text-4xl mb-2">½</div>
        <h2 className="text-3xl font-black mb-1" style={{ color: bg, fontFamily:"'Fredoka One',cursive" }}>Half Table</h2>
        <p className="text-purple-400 mb-6 font-semibold">What is half of each digit?</p>
        <div className="w-full max-w-sm bg-white rounded-3xl shadow-xl p-6 border-2" style={{ borderColor: bg }}>
          <div className="grid grid-cols-2 gap-3 mb-4">
            <div className="font-black text-center text-purple-700">Digit</div>
            <div className="font-black text-center" style={{ color: bg }}>Table Half</div>
            {table.map(([d, h]) => (
              <>
                <div key={`d${d}`} className="rounded-xl py-2 text-center text-xl font-bold"
                  style={{ background: "#f3e8ff", color: "#7c3aed" }}>{d}</div>
                <div key={`h${d}`} className="rounded-xl py-2 text-center text-xl font-bold"
                  style={{ background: light, color: bg }}>{h}</div>
              </>
            ))}
          </div>
          <p className="text-center text-purple-400 text-sm mt-2">
            Memorise: 0,1→0 | 2,3→1 | 4,5→2 | 6,7→3 | 8,9→4
          </p>
        </div>
        <button onClick={() => { setHalfExampleIndex(0); setGameState("half-3step"); }}
          className="mt-6 w-full max-w-sm rounded-3xl py-4 text-xl font-black shadow-lg transition active:scale-95"
          style={{ background: bg, color: "#fff" }}>
          Next: 3-Step Practice →
        </button>
      </div>
    );
  }

  // HALF 3-STEP PRACTICE
  if (gameState === "half-3step") {
    const examples = [
      { n: 768, step1: [3,3,4], step2: [3,3,4], step3: [3,8,4], answer: 384 },
      { n: 329, step1: [1,1,4], step2: [1,1,4], step3: [1,6,4.5], answer: 164.5 },
    ];
    const { bg, light } = CHALLENGE_COLORS["Half"];
    const current = examples[halfExampleIndex];

    return (
      <div className="min-h-screen flex flex-col items-center px-4 pt-8 pb-10"
        style={{ background: "linear-gradient(160deg,#f9f0ff 0%,#fff 60%,#ffe8f6 100%)" }}>
        <button onClick={() => setGameState("mode-select")} className="self-start mb-4 text-purple-400 font-bold text-lg">← Back</button>
        <h2 className="text-3xl font-black mb-1" style={{ color: bg, fontFamily:"'Fredoka One',cursive" }}>Half 3-Step Method</h2>
        <p className="text-purple-400 mb-4 font-semibold">Find Half of {current.n}</p>

        <div className="w-full max-w-sm bg-white rounded-3xl shadow-xl p-6 border-2 mb-4" style={{ borderColor: bg }}>
          <div className="space-y-4">
            {[
              { step:"Step 1", label:"Write table half of each digit", value: current.step1.join("") },
              { step:"Step 2", label:"Underline digit that came from odd number", value: current.step2.join("")+"_" },
              { step:"Step 3", label:"Resolve underline: add 5, carry if needed", value: current.step3.join("") },
              { step:"✅ Answer", label:"Final result", value: current.answer },
            ].map(({ step, label, value }) => (
              <div key={step} className="flex items-start gap-3">
                <div className="rounded-full px-3 py-1 text-sm font-black shrink-0" style={{ background: bg, color: "#fff" }}>{step}</div>
                <div>
                  <div className="text-purple-500 text-sm">{label}</div>
                  <div className="text-2xl font-black" style={{ color: bg }}>{value}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="flex gap-3 w-full max-w-sm mb-4">
          {examples.map((e, i) => (
            <button key={i} onClick={() => setHalfExampleIndex(i)}
              className="flex-1 rounded-2xl py-3 font-bold transition"
              style={{ background: halfExampleIndex===i?bg:light, color: halfExampleIndex===i?"#fff":bg, border:`2px solid ${bg}` }}>
              Example {i+1}: {e.n}
            </button>
          ))}
        </div>

        <button onClick={() => setGameState("settings")}
          className="w-full max-w-sm rounded-3xl py-4 text-xl font-black shadow-lg transition active:scale-95"
          style={{ background: bg, color: "#fff" }}>
          ⚡ Try Challenge Mode
        </button>
      </div>
    );
  }

  // SQUARE STEP PRACTICE
  if (gameState === "square-step") {
    const { bg, light } = CHALLENGE_COLORS["Squares"];
    const diff = 50 - squareNum;
    const absDiff = Math.abs(diff);
    const steps = [
      { label: `Step 1: How far is ${squareNum} from 50?`, answer: absDiff, hint: `50 − ${squareNum} = ${absDiff}` },
      { label: `Step 2: Subtract ${absDiff} from 25`, answer: 25 - absDiff, hint: `25 − ${absDiff} = ${25-absDiff}` },
      { label: `Step 3: Square of ${absDiff}`, answer: diff*diff, hint: `${absDiff} × ${absDiff} = ${diff*diff}` },
    ];
    const current = steps[squareStep];

    return (
      <div className="min-h-screen flex flex-col items-center px-4 pt-8 pb-10"
        style={{ background: "linear-gradient(160deg,#f9f0ff 0%,#fff 60%,#ffe8f6 100%)" }}>
        <button onClick={() => setGameState("mode-select")} className="self-start mb-4 text-purple-400 font-bold text-lg">← Back</button>
        <div className="text-4xl mb-1">²</div>
        <h2 className="text-3xl font-black mb-1" style={{ color: bg, fontFamily:"'Fredoka One',cursive" }}>Square Steps</h2>
        <p className="text-purple-400 mb-4 font-semibold">Find Square of {squareNum} (numbers near 50)</p>

        <div className="w-full max-w-sm bg-white rounded-3xl shadow-xl p-6 border-2 mb-4" style={{ borderColor: bg }}>
          <div className="flex gap-2 mb-5">
            {steps.map((_, i) => (
              <div key={i} className="flex-1 rounded-full h-3 transition"
                style={{ background: i < squareStep ? bg : i===squareStep ? `${bg}88` : "#e9d5ff" }} />
            ))}
          </div>

          <div className="text-lg font-black text-purple-700 mb-4">{current.label}</div>

          {squareStepFeedback?.startsWith("done:") ? (
            <div className="text-center">
              <div className="text-2xl font-black text-green-500 mb-2">🎉 {squareNum}² = {squareStepFeedback.split(":")[1]}</div>
              <button onClick={() => {
                  setSquareNum(rand(11,59));
                  setSquareStep(0);
                  setSquareInp("");
                  setSquareStepFeedback(null);
                }}
                className="rounded-2xl px-6 py-3 font-bold text-white mt-2 transition active:scale-95"
                style={{ background: bg }}>
                Try Another
              </button>
            </div>
          ) : (
            <>
              <div className="flex gap-2 mb-3">
                <input
                  value={squareInp}
                  onChange={e => setSquareInp(e.target.value)}
                  onKeyDown={e => e.key==="Enter" && checkSquareStep()}
                  className="flex-1 rounded-2xl border-2 px-4 py-3 text-xl font-bold text-purple-700 outline-none"
                  style={{ borderColor: squareStepFeedback==="correct"?"#22c55e":squareStepFeedback==="wrong"?"#ef4444":bg }}
                  placeholder="Your answer…"
                  type="number"
                />
                <button onClick={checkSquareStep}
                  className="rounded-2xl px-5 py-3 font-bold text-white transition active:scale-95"
                  style={{ background: bg }}>✓</button>
              </div>
              {squareStepFeedback==="correct" && <div className="text-green-500 font-bold text-center">✅ Correct!</div>}
              {squareStepFeedback==="wrong" && <div className="text-red-400 font-bold text-center">❌ Try again! Hint: {current.hint}</div>}
            </>
          )}
        </div>

        <div className="w-full max-w-sm bg-white rounded-3xl p-4 border-2 border-purple-200">
          <p className="font-bold text-purple-600 mb-2 text-sm">Formula for numbers near 50:</p>
          <div className="text-sm text-purple-500 space-y-1">
            <div>• Step 1: Find x (distance from 50)</div>
            <div>• Step 2: 25 − x = first part (AB)</div>
            <div>• Step 3: x² = second part (CD, 2 digits)</div>
            <div>• Answer: AB <span className="font-black">|</span> CD combined</div>
          </div>
        </div>
      </div>
    );
  }

  // RESULT SCREEN
  if (gameState === "result") {
    const { bg } = CHALLENGE_COLORS[challenge];
    return (
      <div className="min-h-screen flex flex-col items-center justify-center px-4"
        style={{ background: "linear-gradient(160deg,#f9f0ff 0%,#fff 60%,#ffe8f6 100%)" }}>
        <Stars count={12} />
        <div className="text-7xl mb-4 animate-bounce">🏆</div>
        <h2 className="text-4xl font-black mb-2" style={{ color: bg, fontFamily:"'Fredoka One',cursive" }}>Well Done!</h2>
        <div className="bg-white rounded-3xl shadow-xl p-8 w-full max-w-sm border-2 mb-6" style={{ borderColor: bg }}>
          {[
            { emoji:"⭐", label:"Score", value: score },
            { emoji:"🔥", label:"Best Streak", value: streak },
            { emoji:"🏆", label:"Level Reached", value: level },
            ...(timeMode==="fixed-questions"?[{ emoji:"⏱", label:"Total Time", value: `${totalTime}s` }]:[]),
          ].map(({ emoji, label, value }) => (
            <div key={label} className="flex justify-between items-center py-3 border-b border-purple-100 last:border-0">
              <span className="text-2xl">{emoji}</span>
              <span className="font-bold text-purple-600">{label}</span>
              <span className="text-2xl font-black" style={{ color: bg }}>{value}</span>
            </div>
          ))}
        </div>
        <div className="flex gap-3 w-full max-w-sm">
          <button onClick={beginGame}
            className="flex-1 rounded-3xl py-4 text-xl font-black shadow-lg transition active:scale-95"
            style={{ background: bg, color: "#fff" }}>
            🔄 Again
          </button>
          <button onClick={() => setGameState("menu")}
            className="flex-1 rounded-3xl py-4 text-xl font-black shadow-lg transition active:scale-95 border-2"
            style={{ borderColor: bg, color: bg, background:"#fff" }}>
            🏠 Menu
          </button>
        </div>
      </div>
    );
  }

  // PLAYING
  if (gameState === "playing" && question) {
    const { bg, light } = CHALLENGE_COLORS[challenge];
    const timerPct = timeMode==="timed" ? (timeLeft / secondsPerQ) * 100 : 100;
    const feedbackBg = feedback==="correct" ? "#22c55e" : feedback==="incorrect" ? "#ef4444" : bg;

    return (
      <div className="min-h-screen flex flex-col items-center px-4 pt-6 pb-8 transition-all"
        style={{ background: feedback ? (feedback==="correct"?"#f0fdf4":"#fef2f2") : "linear-gradient(160deg,#f9f0ff 0%,#fff 60%,#ffe8f6 100%)" }}>

        <div className="w-full max-w-md flex items-center justify-between mb-4">
          <button onClick={() => { stopTimers(); setGameState("menu"); }}
            className="text-purple-400 font-bold text-lg">✕</button>
          <h3 className="font-black text-xl" style={{ color: bg }}>{challenge}</h3>
          {timeMode==="fixed-questions"
            ? <span className="font-bold text-purple-400">{questionsLeft} left</span>
            : <span className="font-bold text-purple-400">⏱ {timeLeft}s</span>}
        </div>

        {timeMode === "timed" && (
          <div className="w-full max-w-md h-3 rounded-full mb-4 overflow-hidden bg-purple-100">
            <div className="h-full rounded-full transition-all duration-1000"
              style={{ width:`${timerPct}%`, background: timerPct>50?bg:timerPct>25?"#FFD93D":"#FF6B6B" }} />
          </div>
        )}

        <ScoreBar score={score} streak={streak} level={level} />

        <div className="w-full max-w-md rounded-4xl shadow-2xl p-8 mb-6 text-center relative overflow-hidden"
          style={{ background: feedback ? feedbackBg : light, border: `4px solid ${feedback?feedbackBg:bg}` }}>
          {feedback && (
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-8xl animate-zoom-in">{feedback==="correct"?"🎉":"😅"}</span>
            </div>
          )}
          <div className={`transition-opacity ${feedback?"opacity-20":"opacity-100"}`}>
            <p className="text-purple-400 font-bold mb-2 text-base">What is</p>
            <div className="text-7xl font-black mb-2" style={{ color: bg, fontFamily:"'Fredoka One',cursive" }}>
              {question.display}
            </div>
            {feedback==="incorrect" && (
              <div className="mt-2 text-lg font-black text-white">
                Answer: {question.answer}
              </div>
            )}
          </div>
        </div>

        {!feedback && answerMode === "Choose Option" && question.options && (
          <div className="grid grid-cols-2 gap-3 w-full max-w-md">
            {question.options.map(opt => (
              <button key={opt} onClick={() => handleAnswer(opt)}
                className="rounded-3xl py-5 text-3xl font-black shadow-lg transition active:scale-95 hover:scale-105"
                style={{ background: "#fff", border: `3px solid ${bg}`, color: bg }}>
                {opt}
              </button>
            ))}
          </div>
        )}

        {!feedback && answerMode === "Type Answer" && (
          <div className="w-full max-w-md">
            <NumPad
              value={typedAnswer}
              onDigit={d => setTypedAnswer(v => v==="0"?d:v.includes(".")&&d==="0.5"?v:v+d)}
              onErase={() => setTypedAnswer(v => v.slice(0,-1))}
              onEnter={() => handleAnswer(typedAnswer)}
            />
          </div>
        )}
      </div>
    );
  }

  return null;
}
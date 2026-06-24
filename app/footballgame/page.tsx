"use client";

import { useState, useCallback } from "react";

// ─── IMAGE PATHS ──────────────────────────────────────────────────────────────
const IMG = {
  bg: "/Images/interactive-games/footballgame/footballbackground.png",
  keeper: "/Images/interactive-games/footballgame/ideal-removebg-preview.png",
  diveLeft: "/Images/interactive-games/footballgame/leftdive-removebg-preview.png",
  diveRight: "/Images/interactive-games/footballgame/rightdive-removebg-preview.png",
  jumpUp: "/Images/interactive-games/footballgame/upjump-removebg-preview.png",
};

// ─── TYPES ────────────────────────────────────────────────────────────────────
interface Question {
  q: string;
  options: string[];
  answer: number;
}
type Screen = "menu" | "game" | "levelup" | "gameover" | "win";
type KeeperState = "idle" | "diveLeft" | "diveRight" | "jumpUp";
type Phase = "question" | "kicking" | "result";
type Result = "goal" | "saved" | null;

// ─── DATA ─────────────────────────────────────────────────────────────────────
const ALL_QUESTIONS: Question[] = [
  { q: "Nearest planet to the Sun?", options: ["Earth", "Venus", "Mercury", "Mars"], answer: 2 },
  { q: "Capital of France?", options: ["London", "Berlin", "Madrid", "Paris"], answer: 3 },
  { q: "Sides on a hexagon?", options: ["5", "6", "7", "8"], answer: 1 },
  { q: "What is 12 × 12?", options: ["124", "144", "134", "154"], answer: 1 },
  { q: "Largest ocean on Earth?", options: ["Atlantic", "Indian", "Arctic", "Pacific"], answer: 3 },
  {
    q: "Who painted the Mona Lisa?",
    options: ["Van Gogh", "Picasso", "Da Vinci", "Rembrandt"],
    answer: 2,
  },
  { q: "Chemical symbol for Gold?", options: ["Go", "Gd", "Au", "Ag"], answer: 2 },
  { q: "Bones in the human body?", options: ["196", "206", "216", "186"], answer: 1 },
  { q: "World War II ended in?", options: ["1943", "1944", "1946", "1945"], answer: 3 },
  { q: "Fastest land animal?", options: ["Lion", "Horse", "Cheetah", "Leopard"], answer: 2 },
  { q: "The Red Planet is?", options: ["Venus", "Jupiter", "Mars", "Saturn"], answer: 2 },
  { q: "Square root of 144?", options: ["11", "13", "14", "12"], answer: 3 },
  {
    q: "Who wrote Romeo and Juliet?",
    options: ["Dickens", "Shakespeare", "Twain", "Austen"],
    answer: 1,
  },
  { q: "Largest continent?", options: ["Africa", "Asia", "Europe", "Americas"], answer: 1 },
  { q: "Players on a football team?", options: ["9", "10", "11", "12"], answer: 2 },
];

// option index → color, label, keeper reaction, ball target (% inside goal)
const OPT = [
  {
    label: "A",
    color: "#ef4444",
    glow: "#ef444455",
    keeper: "diveLeft" as KeeperState,
    bx: -34,
    by: -70,
  },
  {
    label: "B",
    color: "#3b82f6",
    glow: "#3b82f655",
    keeper: "diveRight" as KeeperState,
    bx: 34,
    by: -70,
  },
  {
    label: "C",
    color: "#22c55e",
    glow: "#22c55e55",
    keeper: "diveLeft" as KeeperState,
    bx: -34,
    by: -20,
  },
  {
    label: "D",
    color: "#eab308",
    glow: "#eab30855",
    keeper: "diveRight" as KeeperState,
    bx: 34,
    by: -20,
  },
];

function shuffle<T>(arr: T[]): T[] {
  return [...arr].sort(() => Math.random() - 0.5);
}
const QPL = 5; // questions per level

// ─── ROOT COMPONENT ───────────────────────────────────────────────────────────
export default function FootballQuizGame() {
  const [screen, setScreen] = useState<Screen>("menu");
  const [qs, setQs] = useState<Question[]>([]);
  const [qi, setQi] = useState(0);
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(3);
  const [level, setLevel] = useState(1);
  const [selected, setSelected] = useState<number | null>(null);
  const [phase, setPhase] = useState<Phase>("question");
  const [result, setResult] = useState<Result>(null);
  const [keeper, setKeeper] = useState<KeeperState>("idle");
  const [ballPos, setBallPos] = useState<{ x: number; y: number } | null>(null);
  const [kicking, setKicking] = useState(false);
  const [showBanner, setShowBanner] = useState(false);
  const [paused, setPaused] = useState(false);

  const start = useCallback(() => {
    setQs(shuffle(ALL_QUESTIONS).slice(0, QPL * 3));
    setQi(0);
    setScore(0);
    setLives(3);
    setLevel(1);
    setSelected(null);
    setPhase("question");
    setResult(null);
    setKeeper("idle");
    setBallPos(null);
    setKicking(false);
    setShowBanner(false);
    setScreen("game");
  }, []);

  const q = qs[qi];
  const qLeft = QPL - (qi % QPL);

  function kick(idx: number) {
    if (phase !== "question" || paused || !q) return;
    const correct = idx === q.answer;
    const opt = OPT[idx];
    setSelected(idx);
    setPhase("kicking");
    setKicking(true);
    setBallPos({ x: opt.bx, y: opt.by });

    // keeper reacts 200ms after kick
    setTimeout(() => {
      const ks: KeeperState = correct && (idx === 0 || idx === 1) ? "jumpUp" : opt.keeper;
      setKeeper(ks);
    }, 200);

    // show result at 900ms
    setTimeout(() => {
      if (correct) {
        setScore((s) => s + 10 * level);
        setResult("goal");
      } else {
        setLives((l) => l - 1);
        setResult("saved");
      }
      setShowBanner(true);
      setPhase("result");
    }, 900);

    // advance at 2400ms
    setTimeout(() => {
      setShowBanner(false);
      setKicking(false);
      setBallPos(null);
      setKeeper("idle");
      const nl = correct ? lives : lives - 1;
      const ni = qi + 1;
      if (!correct && nl <= 0) {
        setScreen("gameover");
        return;
      }
      if (ni % QPL === 0 && ni < qs.length) {
        setLevel((l) => l + 1);
        setScreen("levelup");
        setTimeout(() => {
          setQi(ni);
          setSelected(null);
          setPhase("question");
          setResult(null);
          setScreen("game");
        }, 2500);
      } else if (ni >= qs.length) {
        setScreen("win");
      } else {
        setQi(ni);
        setSelected(null);
        setPhase("question");
        setResult(null);
      }
    }, 2400);
  }

  const keeperImg: Record<KeeperState, string> = {
    idle: IMG.keeper,
    diveLeft: IMG.diveLeft,
    diveRight: IMG.diveRight,
    jumpUp: IMG.jumpUp,
  };

  // ── SHARED BG ──
  const BG = () => (
    <div
      style={{
        position: "absolute",
        inset: 0,
        backgroundImage: `url(${IMG.bg})`,
        backgroundSize: "cover",
        backgroundPosition: "center bottom",
      }}
    >
      <div style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.45)" }} />
    </div>
  );

  // ── NON-GAME SCREENS ──────────────────────────────────────────────────────
  if (screen !== "game")
    return (
      <div
        style={{
          position: "relative",
          width: "100%",
          height: "100vh",
          overflow: "hidden",
          fontFamily: "'Bebas Neue',Impact,sans-serif",
        }}
      >
        <style>{CSS}</style>
        <BG />
        {screen === "win" &&
          Array.from({ length: 24 }).map((_, i) => (
            <div key={i} className="confetti" style={cStyle(i)} />
          ))}
        <div style={OV}>
          {screen === "menu" && <MenuContent onStart={start} />}
          {screen === "levelup" && <LevelupContent level={level} score={score} />}
          {screen === "gameover" && (
            <GameoverContent
              score={score}
              level={level}
              onRetry={start}
              onMenu={() => setScreen("menu")}
            />
          )}
          {screen === "win" && (
            <WinContent score={score} onPlay={start} onMenu={() => setScreen("menu")} />
          )}
        </div>
      </div>
    );

  if (!q) return null;

  // ── GAME SCREEN ───────────────────────────────────────────────────────────
  return (
    <div
      style={{
        position: "relative",
        width: "100%",
        height: "100vh",
        overflow: "hidden",
        fontFamily: "'Bebas Neue',Impact,sans-serif",
        userSelect: "none",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <style>{CSS}</style>

      {/* BACKGROUND */}
      <BG />

      {/* ── HUD ── */}
      <div
        style={{
          position: "relative",
          zIndex: 50,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "10px 18px",
          flexShrink: 0,
        }}
      >
        <Chip>SCORE: {score}</Chip>
        <Chip>LEVEL: {level}</Chip>
        <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
          <Chip>Q: {qLeft}</Chip>
          <button
            className="pauseBtn"
            onClick={() => setPaused((p) => !p)}
            style={{
              width: 38,
              height: 38,
              borderRadius: "50%",
              background: "rgba(5,15,35,0.85)",
              border: "1.5px solid rgba(255,255,255,0.2)",
              color: "#fff",
              fontSize: 16,
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            {paused ? "▶" : "⏸"}
          </button>
        </div>
      </div>

      {/* ── QUESTION ── */}
      <div
        style={{
          position: "relative",
          zIndex: 30,
          flexShrink: 0,
          margin: "0 auto",
          width: "min(680px,86%)",
          background: "rgba(5,15,35,0.88)",
          border: "2px solid rgba(255,255,255,0.14)",
          borderRadius: 12,
          padding: "11px 24px",
          textAlign: "center",
          color: "#fff",
          fontSize: "clamp(14px,2.2vw,20px)",
          letterSpacing: 1.5,
          boxShadow: "0 4px 32px rgba(0,0,0,0.6)",
          backdropFilter: "blur(8px)",
        }}
      >
        {q.q}
      </div>

      {/* ── SPACER pushes goal to lower portion ── */}
      <div style={{ flex: "1 1 auto" }} />

      {/* ── GOAL + KEEPER + OPTIONS – anchored at bottom of field ── */}
      <div
        style={{
          position: "relative",
          zIndex: 20,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          flexShrink: 0,
          /* goal sits right on the pitch line – 38% from bottom of viewport */
          marginBottom: "38vh",
        }}
      >
        {/* Goal frame wrapper */}
        <div
          style={{
            position: "relative",
            width: "min(700px,78vw)",
            /* height is 40% of its own width to keep proportions */
            aspectRatio: "7/3",
          }}
        >
          {/* Post */}
          <div
            style={{
              position: "absolute",
              inset: 0,
              border: "5px solid #e8e8e8",
              borderBottom: "none",
              borderRadius: "4px 4px 0 0",
              boxShadow: "0 0 20px rgba(255,255,255,0.18)",
            }}
          />
          {/* Net */}
          <div
            style={{
              position: "absolute",
              inset: "5px 5px 0 5px",
              backgroundImage: `
              repeating-linear-gradient(0deg,rgba(255,255,255,0.09) 0,rgba(255,255,255,0.09) 1px,transparent 1px,transparent 24px),
              repeating-linear-gradient(90deg,rgba(255,255,255,0.09) 0,rgba(255,255,255,0.09) 1px,transparent 1px,transparent 24px)
            `,
            }}
          />

          {/* ── 2×2 OPTION BUTTONS (compact) inside goal ── */}
          <div
            style={{
              position: "absolute",
              inset: "6px 6px 0 6px",
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gridTemplateRows: "1fr 1fr",
              gap: 6,
              padding: 6,
              zIndex: 10,
            }}
          >
            {q.options.map((opt, i) => {
              const o = OPT[i];
              const isSel = selected === i;
              const isCorr = i === q.answer;
              const showOk = phase === "result" && isCorr;
              const showBad = phase === "result" && isSel && !isCorr;
              return (
                <button
                  key={i}
                  onClick={() => kick(i)}
                  disabled={phase !== "question"}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 7,
                    justifyContent: i === 1 || i === 3 ? "flex-end" : "flex-start",
                    background: "transparent",
                    border: "none",
                    borderRadius: 8,
                    padding: "4px 10px",
                    cursor: phase === "question" ? "pointer" : "default",
                    transition: "all 0.22s",
                    transform: showOk ? "scale(1.04)" : "scale(1)",
                    boxShadow: "none",
                    backdropFilter: "none",
                    fontFamily: "'Bebas Neue',Impact,sans-serif",
                  }}
                  className="optBtn"
                >
                  <div
                    style={{
                      width: 24,
                      height: 24,
                      borderRadius: "50%",
                      background: o.color,
                      color: "#fff",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: 13,
                      fontWeight: 900,
                      flexShrink: 0,
                    }}
                  >
                    {o.label}
                  </div>
                  <span
                    style={{
                      color: "#fff",
                      fontSize: "clamp(11px,1.4vw,15px)",
                      letterSpacing: 1,
                      textShadow: "0 1px 4px rgba(0,0,0,0.9)",
                      whiteSpace: "nowrap",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      background: showOk
                        ? "rgba(34,197,94,0.6)"
                        : showBad
                          ? "rgba(239,68,68,0.6)"
                          : o.color,
                      padding: "6px 12px",
                      borderRadius: 6,
                      boxShadow: `0 0 12px ${o.glow}`,
                    }}
                  >
                    {opt}
                  </span>
                </button>
              );
            })}
          </div>

          {/* ── GOALKEEPER – sits at bottom-centre of goal, feet on the goal line ── */}
          <div
            style={{
              position: "absolute",
              bottom: 0 /* feet exactly on the goal baseline */,
              left: "50%",
              transform: "translateX(-50%)",
              zIndex: 15,
              pointerEvents: "none",
            }}
          >
            <img
              src={keeperImg[keeper]}
              alt="goalkeeper"
              className={keeper !== "idle" ? "keeperAnim" : ""}
              style={{
                height: "clamp(220px,35vh,380px)",
                objectFit: "contain",
                filter: "drop-shadow(0 6px 14px rgba(0,0,0,0.7))",
                transition: "height 0.3s",
              }}
            />
          </div>
        </div>
        {/* end goal wrapper */}
      </div>
      {/* end goal anchor */}

      {/* ── BALL – sits on pitch, below goal ── */}
      <div
        className={kicking ? "" : "ballIdle"}
        style={{
          position: "absolute",
          /* When idle: centred horizontally, 28vh from bottom */
          bottom: kicking && ballPos ? `calc(38vh + ${-ballPos.y * 0.3}vh)` : "28vh",
          left: kicking && ballPos ? `calc(50% + ${ballPos.x * 0.55}vw)` : "50%",
          transform: "translate(-50%,50%)",
          zIndex: 40,
          transition: kicking
            ? "bottom 0.72s cubic-bezier(.4,0,.15,1), left 0.72s cubic-bezier(.4,0,.15,1)"
            : "none",
          pointerEvents: "none",
        }}
      >
        <div
          className={kicking ? "spinBall" : ""}
          style={{
            width: 52,
            height: 52,
            borderRadius: "50%",
            background: "radial-gradient(circle at 35% 30%,#fff 0%,#ddd 45%,#999 100%)",
            boxShadow: "0 5px 20px rgba(0,0,0,0.75),inset -7px -4px 14px rgba(0,0,0,0.3)",
            position: "relative",
            overflow: "hidden",
          }}
        >
          {(
            [
              [22, 18, 28, 20],
              [44, 10, 20, 18],
              [10, 44, 22, 20],
              [48, 46, 26, 22],
              [26, 34, 18, 16],
            ] as number[][]
          ).map(([t, l, w, h], pi) => (
            <div
              key={pi}
              style={{
                position: "absolute",
                top: `${t}%`,
                left: `${l}%`,
                width: w,
                height: h,
                background: "#222",
                borderRadius: "40%",
                transform: "rotate(30deg)",
              }}
            />
          ))}
        </div>
      </div>

      {/* ── BOTTOM BAR: hint + lives ── */}
      <div
        style={{
          position: "absolute",
          bottom: 10,
          left: 0,
          right: 0,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          gap: 16,
          zIndex: 50,
          padding: "0 16px",
        }}
      >
        {phase === "question" && (
          <div
            style={{
              background: "rgba(5,15,35,0.82)",
              border: "1.5px solid rgba(255,255,255,0.12)",
              borderRadius: 10,
              padding: "6px 16px",
              color: "#ccc",
              fontSize: 12,
              letterSpacing: 2,
              backdropFilter: "blur(6px)",
            }}
          >
            👆 CLICK AN ANSWER TO SHOOT INTO THAT CORNER
          </div>
        )}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 5,
            background: "rgba(5,15,35,0.85)",
            border: "1.5px solid rgba(255,255,255,0.15)",
            borderRadius: 10,
            padding: "6px 12px",
          }}
        >
          <span style={{ color: "#fff", fontSize: 13, letterSpacing: 3, marginRight: 3 }}>
            LIVES
          </span>
          {[0, 1, 2].map((i) => (
            <span
              key={i}
              style={{
                fontSize: 18,
                filter: i < lives ? "drop-shadow(0 0 4px #ef4444)" : "grayscale(1) opacity(0.3)",
              }}
            >
              ❤️
            </span>
          ))}
        </div>
      </div>

      {/* ── RESULT BANNER ── */}
      {showBanner && result && (
        <div
          className="resultPop"
          style={{
            position: "absolute",
            top: "42%",
            left: "50%",
            transform: "translate(-50%,-50%)",
            fontSize: "clamp(44px,7vw,80px)",
            fontWeight: 900,
            letterSpacing: 6,
            color: result === "goal" ? "#22c55e" : "#ef4444",
            textShadow:
              result === "goal"
                ? "0 0 60px #22c55e,0 4px 8px rgba(0,0,0,0.9)"
                : "0 0 60px #ef4444,0 4px 8px rgba(0,0,0,0.9)",
            zIndex: 70,
            pointerEvents: "none",
            whiteSpace: "nowrap",
          }}
        >
          {result === "goal" ? "⚽ GOAL!" : "🧤 SAVED!"}
        </div>
      )}

      {/* confetti */}
      {showBanner &&
        result === "goal" &&
        Array.from({ length: 20 }).map((_, i) => (
          <div key={i} className="confetti" style={cStyle(i)} />
        ))}

      {/* ── PAUSE ── */}
      {paused && (
        <div style={{ ...OV, zIndex: 90 }}>
          <div style={{ fontSize: 60, color: "#fff", letterSpacing: 8 }}>PAUSED</div>
          <Btn color="#3b82f6" onClick={() => setPaused(false)}>
            RESUME
          </Btn>
          <Btn color="#ef4444" onClick={() => setScreen("menu")}>
            QUIT
          </Btn>
        </div>
      )}
    </div>
  );
}

// ── SCREEN CONTENT COMPONENTS ─────────────────────────────────────────────────
function MenuContent({ onStart }: { onStart: () => void }) {
  return (
    <>
      <div style={{ fontSize: 12, letterSpacing: 8, color: "#22c55e", marginBottom: 4 }}>
        ⚽ TRIVIA CHALLENGE ⚽
      </div>
      <div
        style={{
          fontSize: "clamp(44px,7vw,76px)",
          color: "#fff",
          letterSpacing: 8,
          textShadow: "0 0 60px #22c55e99,0 4px 16px #000",
          lineHeight: 1,
        }}
      >
        PENALTY QUIZ
      </div>
      <div style={{ fontSize: 16, color: "#bbb", letterSpacing: 5, marginTop: 4 }}>
        CLICK AN ANSWER · SHOOT INTO THAT CORNER · SCORE!
      </div>
      <div
        style={{
          display: "flex",
          gap: 32,
          marginTop: 10,
          color: "#aaa",
          fontSize: 15,
          letterSpacing: 3,
        }}
      >
        <span>⭐ 3 LEVELS</span>
        <span>❤️ 3 LIVES</span>
        <span>🎯 15 QUESTIONS</span>
      </div>
      <Btn color="#22c55e" onClick={onStart} pulse>
        KICK OFF!
      </Btn>
    </>
  );
}
function LevelupContent({ level, score }: { level: number; score: number }) {
  return (
    <>
      <div style={{ fontSize: 18, color: "#eab308", letterSpacing: 6 }}>LEVEL COMPLETE!</div>
      <div
        style={{
          fontSize: "clamp(56px,9vw,88px)",
          color: "#22c55e",
          textShadow: "0 0 60px #22c55e",
          letterSpacing: 8,
        }}
      >
        LEVEL {level}
      </div>
      <div style={{ fontSize: 20, color: "#aaa", letterSpacing: 4 }}>
        GET READY FOR LEVEL {level + 1}…
      </div>
      <div style={{ fontSize: 26, color: "#fff", letterSpacing: 4 }}>SCORE: {score}</div>
    </>
  );
}
function GameoverContent({
  score,
  level,
  onRetry,
  onMenu,
}: {
  score: number;
  level: number;
  onRetry: () => void;
  onMenu: () => void;
}) {
  return (
    <>
      <div
        style={{
          fontSize: "clamp(52px,8vw,80px)",
          color: "#ef4444",
          textShadow: "0 0 60px #ef4444",
          letterSpacing: 8,
        }}
      >
        GAME OVER
      </div>
      <div style={{ fontSize: 26, color: "#fff", letterSpacing: 4 }}>FINAL SCORE: {score}</div>
      <div style={{ fontSize: 17, color: "#aaa", letterSpacing: 3 }}>LEVEL REACHED: {level}</div>
      <Btn color="#ef4444" onClick={onRetry}>
        TRY AGAIN
      </Btn>
      <Btn color="transparent" onClick={onMenu} outline>
        MAIN MENU
      </Btn>
    </>
  );
}
function WinContent({
  score,
  onPlay,
  onMenu,
}: {
  score: number;
  onPlay: () => void;
  onMenu: () => void;
}) {
  return (
    <>
      <div style={{ fontSize: 20, color: "#eab308", letterSpacing: 6 }}>⭐ CHAMPION! ⭐</div>
      <div
        style={{
          fontSize: "clamp(52px,8vw,80px)",
          color: "#22c55e",
          textShadow: "0 0 60px #22c55e",
          letterSpacing: 8,
        }}
      >
        YOU WIN!
      </div>
      <div style={{ fontSize: 26, color: "#fff", letterSpacing: 4 }}>FINAL SCORE: {score}</div>
      <Btn color="#22c55e" onClick={onPlay}>
        PLAY AGAIN
      </Btn>
      <Btn color="transparent" onClick={onMenu} outline>
        MAIN MENU
      </Btn>
    </>
  );
}

// ── SHARED UI ATOMS ───────────────────────────────────────────────────────────
function Chip({ children }: { children: React.ReactNode }) {
  return (
    <div
      style={{
        background: "rgba(5,15,35,0.85)",
        border: "1.5px solid rgba(255,255,255,0.18)",
        borderRadius: 8,
        padding: "5px 14px",
        color: "#fff",
        fontSize: 15,
        letterSpacing: 2,
        backdropFilter: "blur(6px)",
        boxShadow: "0 2px 12px rgba(0,0,0,0.4)",
        fontFamily: "'Bebas Neue',Impact,sans-serif",
      }}
    >
      {children}
    </div>
  );
}

function Btn({
  color,
  onClick,
  children,
  pulse,
  outline,
}: {
  color: string;
  onClick: () => void;
  children: React.ReactNode;
  pulse?: boolean;
  outline?: boolean;
}) {
  return (
    <button
      onClick={onClick}
      className={`kickbtn${pulse ? "pulse" : ""}`}
      style={{
        background: outline ? "transparent" : color,
        border: outline ? "2px solid #666" : "none",
        borderRadius: 12,
        padding: "13px 42px",
        fontSize: 22,
        fontWeight: 900,
        color: "#fff",
        cursor: "pointer",
        letterSpacing: 3,
        fontFamily: "'Bebas Neue',Impact,sans-serif",
        boxShadow: !outline && color !== "transparent" ? `0 0 24px ${color}88` : "none",
      }}
    >
      {children}
    </button>
  );
}

const OV: React.CSSProperties = {
  position: "absolute",
  inset: 0,
  background: "rgba(0,0,0,0.68)",
  zIndex: 80,
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  gap: 18,
};

function cStyle(i: number): React.CSSProperties {
  return {
    position: "absolute",
    width: 10,
    height: 10,
    borderRadius: "50%",
    background: ["#22c55e", "#3b82f6", "#eab308", "#ef4444", "#a855f7"][i % 5],
    left: `${15 + ((i * 17) % 70)}%`,
    top: `${5 + ((i * 11) % 40)}%`,
    animation: "confettiFall 1.6s ease-out forwards",
    animationDelay: `${i * 0.055}s`,
    zIndex: 75,
    pointerEvents: "none",
  };
}

// ── CSS ───────────────────────────────────────────────────────────────────────
const CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&display=swap');

  @keyframes confettiFall {
    0%   { transform:translateY(0) scale(1) rotate(0deg); opacity:1; }
    100% { transform:translateY(260px) scale(0.4) rotate(400deg); opacity:0; }
  }
  @keyframes resultPop {
    0%  { transform:translate(-50%,-50%) scale(0.3) rotate(-8deg); opacity:0; }
    60% { transform:translate(-50%,-50%) scale(1.12) rotate(2deg); opacity:1; }
    100%{ transform:translate(-50%,-50%) scale(1) rotate(0deg);   opacity:1; }
  }
  @keyframes spinBall {
    from { transform:rotate(0deg); }
    to   { transform:rotate(720deg); }
  }
  @keyframes ballFloat {
    0%,100% { transform:translate(-50%,50%) translateY(0px); }
    50%     { transform:translate(-50%,50%) translateY(-7px); }
  }
  @keyframes pulse {
    0%,100% { transform:scale(1); }
    50%     { transform:scale(1.06); }
  }
  @keyframes keeperSlide {
    0%  { opacity:0.6; }
    100%{ opacity:1; }
  }

  .resultPop  { animation: resultPop 0.45s cubic-bezier(.2,.8,.3,1.2) forwards; }
  .spinBall   { animation: spinBall 0.72s linear forwards; }
  .ballIdle   { animation: ballFloat 2.2s ease-in-out infinite; }
  .keeperAnim { animation: keeperSlide 0.35s ease-out; }
  .pulse      { animation: pulse 1.8s ease-in-out infinite; }

  .kickbtn { transition: transform 0.15s, box-shadow 0.15s; }
  .kickbtn:hover { transform: scale(1.06) !important; }

  .optBtn { transition: transform 0.18s, background 0.18s, border-color 0.18s; }
  .optBtn:hover:not(:disabled) { transform: scale(1.04); filter: brightness(1.12); }
  .optBtn:disabled { cursor: default; }

  .pauseBtn { transition: transform 0.15s; }
  .pauseBtn:hover { transform: scale(1.1); }
`;

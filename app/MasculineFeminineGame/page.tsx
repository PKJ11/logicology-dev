"use client";
import { useState, useEffect, useRef, useCallback } from "react";

interface QAPair {
  id: number;
  masculine: string;
  feminine: string;
}

interface DecorComet {
  id: string;
  x: number;
  y: number;
  size: number;
  speed: number;
  imgIdx: number;
}

const QA_PAIRS: QAPair[] = [
  { id: 1, masculine: "horse", feminine: "mare" },
  { id: 2, masculine: "prince", feminine: "princess" },
  { id: 3, masculine: "cock", feminine: "hen" },
  { id: 4, masculine: "bull", feminine: "cow" },
  { id: 5, masculine: "grandfather", feminine: "grandmother" },
  { id: 6, masculine: "brother", feminine: "sister" },
  { id: 7, masculine: "uncle", feminine: "aunt" },
  { id: 8, masculine: "stag", feminine: "deer" },
  { id: 9, masculine: "groom", feminine: "bride" },
  { id: 10, masculine: "lion", feminine: "lioness" },
  { id: 11, masculine: "wizard", feminine: "witch" },
  { id: 12, masculine: "son", feminine: "daughter" },
  { id: 13, masculine: "husband", feminine: "wife" },
  { id: 14, masculine: "nephew", feminine: "niece" },
  { id: 15, masculine: "tiger", feminine: "tigress" },
  { id: 16, masculine: "gentleman", feminine: "lady" },
];

const COMET_IMGS = [
  "https://ik.imagekit.io/pratik2002/comet/comet_1.png?updatedAt=1779784835141",
  "https://ik.imagekit.io/pratik2002/comet/comet_2.png?updatedAt=1779784792687",
  "https://ik.imagekit.io/pratik2002/comet/comet_3.png?updatedAt=1779784840667",
  "https://ik.imagekit.io/pratik2002/comet/comet_4.png?updatedAt=1779784823906",
  "https://ik.imagekit.io/pratik2002/comet/comet_4.png?updatedAt=1779784823906",
  "https://ik.imagekit.io/pratik2002/comet/comet_6.png?updatedAt=1779784800489",
  "https://ik.imagekit.io/pratik2002/comet/comet_7.png?updatedAt=1779784814190",
];

// Mock leaderboard data for modal
const LEADERBOARD = [
  { rank: 1, name: "Aarav S.", score: 160, medal: "🥇" },
  { rank: 2, name: "Priya M.", score: 150, medal: "🥈" },
  { rank: 3, name: "Rohan K.", score: 140, medal: "🥉" },
  { rank: 4, name: "Sneha P.", score: 130, medal: "" },
  { rank: 5, name: "Arjun T.", score: 120, medal: "" },
];

function shuffle<T>(arr: T[]): T[] {
  return [...arr].sort(() => Math.random() - 0.5);
}
function rand(min: number, max: number) {
  return Math.random() * (max - min) + min;
}

type CometPhase = "entering" | "paused" | "exiting" | "resetting";

export default function MasculineFeminineGame() {
  const [phase, setPhase] = useState<"modal" | "video" | "game">("modal");

  const [pairs, setPairs] = useState<QAPair[]>([]);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [options, setOptions] = useState<string[]>([]);
  const [lives, setLives] = useState(3);
  const [score, setScore] = useState(0);
  const [done, setDone] = useState(false);
  const [timer, setTimer] = useState(300);
  const [feedback, setFeedback] = useState<{ id: string; correct: boolean } | null>(null);

  // Main comet — word is ALWAYS shown, no showWord toggle
  const [mainX, setMainX] = useState(-25);
  const [cometPhase, setCometPhase] = useState<CometPhase>("entering");

  const [decorComets, setDecorComets] = useState<DecorComet[]>([]);

  const containerRef = useRef<HTMLDivElement>(null);
  const animFrameRef = useRef<number>(0);
  const lastTimeRef = useRef<number>(0);
  // line 87
  const pauseTimerRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  // line 88
  const timerIntervalRef = useRef<ReturnType<typeof setInterval> | undefined>(undefined);
  const cometPhaseRef = useRef(cometPhase);
  cometPhaseRef.current = cometPhase;

  const goFullscreen = () => {
    const el = containerRef.current ?? document.documentElement;
    if (el.requestFullscreen) el.requestFullscreen();
  };

  const resetMainComet = useCallback(() => {
    setMainX(-25);
    setCometPhase("entering");
  }, []);

  useEffect(() => {
    if (phase !== "game") return;
    const shuffled = shuffle(QA_PAIRS);
    setPairs(shuffled);
    setCurrentIdx(0);
    setLives(3);
    setScore(0);
    setDone(false);
    setTimer(300);
    resetMainComet();
    const decors: DecorComet[] = Array.from({ length: 9 }).map((_, i) => ({
      id: `d-${i}`,
      x: rand(-10, 110),
      y: rand(8, 52),
      size: rand(55, 110),
      speed: rand(5, 12),
      imgIdx: (i % 6) + 1,
    }));
    setDecorComets(decors);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase]);

  useEffect(() => {
    if (!pairs.length || done) return;
    const pair = pairs[currentIdx];
    const distractors = shuffle(pairs.filter((p) => p.id !== pair.id).map((p) => p.feminine)).slice(
      0,
      15
    );
    setOptions(shuffle([pair.feminine, ...distractors]));
    setFeedback(null);
    resetMainComet();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pairs, currentIdx, done]);

  useEffect(() => {
    if (phase !== "game" || done) return;
    timerIntervalRef.current = setInterval(() => {
      setTimer((t) => {
        if (t <= 1) {
          setDone(true);
          return 0;
        }
        return t - 1;
      });
    }, 1000);
    return () => clearInterval(timerIntervalRef.current);
  }, [phase, done]);

  useEffect(() => {
    if (phase !== "game" || done) return;
    lastTimeRef.current = 0;
    const SPEED = 9;
    const CENTER_X = 32;
    const EXIT_END = 115;

    const tick = (ts: number) => {
      const dt = lastTimeRef.current ? (ts - lastTimeRef.current) / 1000 : 0;
      lastTimeRef.current = ts;
      const cp = cometPhaseRef.current;

      if (cp === "entering") {
        setMainX((prev) => {
          const nx = prev + SPEED * dt;
          if (nx >= CENTER_X) {
            setCometPhase("paused");
            cometPhaseRef.current = "paused";
            clearTimeout(pauseTimerRef.current);
            pauseTimerRef.current = setTimeout(() => {
              setCometPhase("exiting");
              cometPhaseRef.current = "exiting";
            }, 3000);
            return CENTER_X;
          }
          return nx;
        });
      } else if (cp === "exiting") {
        setMainX((prev) => {
          const nx = prev + SPEED * dt;
          if (nx >= EXIT_END) {
            setCometPhase("resetting");
            cometPhaseRef.current = "resetting";
            setTimeout(() => {
              setMainX(-25);
              setCometPhase("entering");
              cometPhaseRef.current = "entering";
            }, 200);
            return EXIT_END;
          }
          return nx;
        });
      }

      setDecorComets((prev) =>
        prev.map((c) => {
          let nx = c.x + c.speed * dt;
          if (nx > 115) nx = -20;
          return { ...c, x: nx };
        })
      );

      animFrameRef.current = requestAnimationFrame(tick);
    };

    animFrameRef.current = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(animFrameRef.current);
      clearTimeout(pauseTimerRef.current);
    };
  }, [phase, done]);

  const handleAnswer = useCallback(
    (word: string, idx: number) => {
      if (done || feedback) return;
      const pair = pairs[currentIdx];
      const isCorrect = word === pair.feminine;
      const key = `${idx}-${word}`;
      setFeedback({ id: key, correct: isCorrect });
      setTimeout(() => {
        if (isCorrect) {
          setScore((s) => s + 10);
          const next = currentIdx + 1;
          if (next >= pairs.length) setDone(true);
          else setCurrentIdx(next);
        } else {
          setLives((l) => {
            const nl = l - 1;
            if (nl <= 0) setDone(true);
            return nl;
          });
          setFeedback(null);
        }
      }, 700);
    },
    [done, feedback, pairs, currentIdx]
  );

  const formatTime = (s: number) => `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`;
  const currentPair = pairs[currentIdx];

  return (
    <div
      ref={containerRef}
      style={{
        position: "fixed",
        inset: 0,
        fontFamily: "'Orbitron','Exo 2',sans-serif",
        overflow: "hidden",
        background: "#0a0015",
      }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@700;900&family=Exo+2:wght@400;600;700;800;900&display=swap');
        * { box-sizing:border-box; margin:0; padding:0; }

        /* ── Answer buttons ── */
        .ans-btn {
          position:relative; cursor:pointer; border:none; padding:0; background:none;
          border-radius:12px; overflow:hidden;
          transition:transform 0.1s, filter 0.1s;
          user-select:none;
          display:flex; align-items:center; justify-content:center;
          height:clamp(56px,8vh,80px);
        }
        .ans-btn:hover:not(:disabled) { transform:translateY(-3px) scale(1.04); filter:brightness(1.14); }
        .ans-btn:active:not(:disabled) { transform:scale(0.96); }
        .ans-btn.correct .btn-face { background:linear-gradient(180deg,#4eff91 0%,#00b248 100%) !important; border-color:#007a30 !important; color:#fff !important; }
        .ans-btn.correct { animation:correctFlash 0.6s ease; }
        .ans-btn.wrong .btn-face   { background:linear-gradient(180deg,#ff6b6b 0%,#c0000a 100%) !important; border-color:#7a0000 !important; color:#fff !important; }
        .ans-btn.wrong   { animation:wrongShake 0.45s ease; }

        .btn-face {
          width:100%; height:100%;
          display:flex; align-items:center; justify-content:center;
          border-radius:12px;
          font-family:'Exo 2',sans-serif;
          font-weight:900;
          font-size:clamp(14px,1.9vw,22px);
          color:#1a0800;
          text-align:center;
          padding:0 12px;
          word-break:break-word;
          line-height:1.2;
          border:3px solid;
          position:relative;
        }
        .btn-face::before {
          content:'';
          position:absolute; top:0; left:0; right:0; height:42%;
          border-radius:9px 9px 50% 50% / 9px 9px 24px 24px;
          background:rgba(255,255,255,0.30);
          pointer-events:none;
        }
        .btn-gold .btn-face {
          background:linear-gradient(180deg,#ffe566 0%,#f5a800 52%,#c97900 100%);
          border-color:#9e5e00;
          box-shadow:0 5px 0 #7a3d00, inset 0 1px 0 rgba(255,255,255,0.45);
        }
        .btn-gray .btn-face {
          background:linear-gradient(180deg,#e8e8e8 0%,#b8b8b8 52%,#888 100%);
          border-color:#555;
          box-shadow:0 5px 0 #333, inset 0 1px 0 rgba(255,255,255,0.4);
        }

        @keyframes correctFlash {
          0%,100% { transform:scale(1); }
          40% { transform:scale(1.08); box-shadow:0 0 28px rgba(0,220,100,0.9); }
        }
        @keyframes wrongShake {
          0%,100% { transform:translateX(0); }
          20% { transform:translateX(-7px); }
          40% { transform:translateX(7px); }
          60% { transform:translateX(-5px); }
          80% { transform:translateX(5px); }
        }

        /* Modal */
        @keyframes fadeIn { from{opacity:0;transform:scale(0.88);}to{opacity:1;transform:scale(1);} }
        .modal-box { animation:fadeIn 0.4s ease; }

        /* Done */
        @keyframes doneIn { from{opacity:0;transform:translate(-50%,-50%) scale(0.7);}to{opacity:1;transform:translate(-50%,-50%) scale(1);} }
        .done-box { position:absolute;top:50%;left:50%; animation:doneIn 0.5s cubic-bezier(.2,1.5,.5,1) forwards; }

        .heart { display:inline-block; }
        .heart.lost { filter:grayscale(1) opacity(0.3); }

        /* Leaderboard rows */
        .lb-row {
          display:flex; align-items:center; gap:12px;
          padding:10px 16px; border-radius:10px;
          background:rgba(255,255,255,0.06);
          border:1px solid rgba(255,255,255,0.08);
          margin-bottom:6px;
          font-family:'Exo 2',sans-serif;
        }
        .lb-row.top3 { background:rgba(180,140,255,0.12); border-color:rgba(180,140,255,0.25); }
      `}</style>

      {/* BG */}
      {phase === "game" && (
        <img
          src="https://ik.imagekit.io/pratik2002/background.png"
          alt=""
          style={{
            position: "absolute",
            inset: 0,
            width: "100%",
            height: "100%",
            objectFit: "cover",
            zIndex: 0,
            opacity: 0.9,
          }}
          onError={(e) => {
            (e.currentTarget as HTMLImageElement).style.display = "none";
          }}
        />
      )}

      {/* ════════════ MODAL ════════════ */}
      {phase === "modal" && (
        <div
          style={{
            position: "absolute",
            inset: 0,
            zIndex: 50,
            background: "radial-gradient(ellipse at 40% 50%,#1a0040 0%,#05000f 100%)",
            display: "flex",
            alignItems: "stretch",
            justifyContent: "center",
            overflow: "hidden",
          }}
        >
          {/* Stars */}
          {Array.from({ length: 80 }).map((_, i) => (
            <div
              key={i}
              style={{
                position: "absolute",
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                width: Math.random() > 0.8 ? "3px" : "1.5px",
                height: Math.random() > 0.8 ? "3px" : "1.5px",
                borderRadius: "50%",
                background: "#fff",
                opacity: Math.random() * 0.7 + 0.2,
              }}
            />
          ))}

          {/* Two-column layout */}
          <div
            className="modal-box"
            style={{
              display: "flex",
              width: "100%",
              maxWidth: "1000px",
              margin: "auto",
              gap: "0",
              borderRadius: "24px",
              overflow: "hidden",
              border: "2px solid rgba(120,80,255,0.5)",
              boxShadow: "0 0 80px rgba(120,80,255,0.35)",
              background: "linear-gradient(135deg,rgba(22,0,60,0.97),rgba(0,8,50,0.97))",
            }}
          >
            {/* LEFT — Game info */}
            <div
              style={{
                flex: 1,
                padding: "44px 40px",
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                borderRight: "1px solid rgba(120,80,255,0.25)",
              }}
            >
              <div
                style={{
                  fontSize: "11px",
                  letterSpacing: "4px",
                  color: "#a78bfa",
                  textTransform: "uppercase",
                  marginBottom: "10px",
                  fontFamily: "'Exo 2',sans-serif",
                }}
              >
                Grade 2 · English
              </div>
              <h1
                style={{
                  fontSize: "clamp(24px,3.5vw,38px)",
                  fontWeight: 900,
                  color: "#fff",
                  lineHeight: 1.15,
                  marginBottom: "6px",
                  textShadow: "0 0 30px rgba(180,140,255,0.8)",
                }}
              >
                Find the Match
              </h1>
              <h2
                style={{
                  fontSize: "clamp(15px,2vw,22px)",
                  fontWeight: 600,
                  color: "#c4b5fd",
                  marginBottom: "24px",
                  fontFamily: "'Exo 2',sans-serif",
                }}
              >
                Masculine &amp; Feminine
              </h2>

              {/* Info cards */}
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: "10px",
                  marginBottom: "28px",
                }}
              >
                {[
                  { icon: "🚀", label: "16 pairs", sub: "to match" },
                  { icon: "⏱️", label: "5 minutes", sub: "time limit" },
                  { icon: "❤️", label: "3 lives", sub: "per game" },
                  { icon: "⭐", label: "10 pts", sub: "per answer" },
                ].map((c) => (
                  <div
                    key={c.label}
                    style={{
                      background: "rgba(255,255,255,0.06)",
                      border: "1px solid rgba(255,255,255,0.1)",
                      borderRadius: "12px",
                      padding: "12px 14px",
                      display: "flex",
                      alignItems: "center",
                      gap: "10px",
                    }}
                  >
                    <span style={{ fontSize: "22px" }}>{c.icon}</span>
                    <div>
                      <div
                        style={{
                          color: "#fff",
                          fontFamily: "'Exo 2',sans-serif",
                          fontWeight: 800,
                          fontSize: "15px",
                        }}
                      >
                        {c.label}
                      </div>
                      <div
                        style={{
                          color: "#9b8cc0",
                          fontFamily: "'Exo 2',sans-serif",
                          fontSize: "11px",
                        }}
                      >
                        {c.sub}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <p
                style={{
                  fontSize: "13px",
                  color: "#7a6d99",
                  lineHeight: 1.6,
                  fontFamily: "'Exo 2',sans-serif",
                  marginBottom: "28px",
                }}
              >
                A big comet flies across with a masculine word.
                <br />
                Tap its matching feminine answer from the grid!
              </p>

              <button
                onClick={() => setPhase("video")}
                style={{
                  display: "block",
                  width: "100%",
                  padding: "16px",
                  background: "linear-gradient(135deg,#7c3aed,#2563eb)",
                  border: "none",
                  borderRadius: "12px",
                  color: "#fff",
                  fontSize: "18px",
                  fontWeight: 800,
                  cursor: "pointer",
                  letterSpacing: "2px",
                  boxShadow: "0 4px 28px rgba(124,58,237,0.55)",
                  fontFamily: "'Exo 2',sans-serif",
                  marginBottom: "10px",
                }}
              >
                ▶ &nbsp;START GAME
              </button>
              <button
                onClick={goFullscreen}
                style={{
                  display: "block",
                  width: "100%",
                  padding: "11px",
                  background: "transparent",
                  border: "1.5px solid rgba(120,80,255,0.45)",
                  borderRadius: "12px",
                  color: "#a78bfa",
                  fontSize: "14px",
                  cursor: "pointer",
                  letterSpacing: "2px",
                  fontFamily: "'Exo 2',sans-serif",
                }}
              >
                ⛶ &nbsp;FULLSCREEN
              </button>
            </div>

            {/* RIGHT — Leaderboard */}
            <div
              style={{
                width: "320px",
                padding: "44px 32px",
                display: "flex",
                flexDirection: "column",
              }}
            >
              <div
                style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "20px" }}
              >
                <span style={{ fontSize: "22px" }}>🏆</span>
                <div>
                  <div
                    style={{
                      color: "#fff",
                      fontWeight: 800,
                      fontSize: "18px",
                      fontFamily: "'Exo 2',sans-serif",
                    }}
                  >
                    Leaderboard
                  </div>
                  <div
                    style={{ color: "#7a6d99", fontSize: "11px", fontFamily: "'Exo 2',sans-serif" }}
                  >
                    Top players this week
                  </div>
                </div>
              </div>

              {LEADERBOARD.map((row) => (
                <div key={row.rank} className={`lb-row${row.rank <= 3 ? "top3" : ""}`}>
                  <div
                    style={{ width: "24px", textAlign: "center", fontSize: "16px", flexShrink: 0 }}
                  >
                    {row.medal || (
                      <span
                        style={{
                          color: "#6b5d8a",
                          fontFamily: "'Exo 2',sans-serif",
                          fontWeight: 700,
                          fontSize: "14px",
                        }}
                      >
                        #{row.rank}
                      </span>
                    )}
                  </div>
                  <div
                    style={{
                      flex: 1,
                      color: "#e0d8ff",
                      fontFamily: "'Exo 2',sans-serif",
                      fontWeight: 700,
                      fontSize: "14px",
                    }}
                  >
                    {row.name}
                  </div>
                  <div
                    style={{
                      color: "#ffd700",
                      fontFamily: "'Exo 2',sans-serif",
                      fontWeight: 800,
                      fontSize: "15px",
                    }}
                  >
                    {row.score}
                  </div>
                </div>
              ))}

              <div
                style={{
                  marginTop: "auto",
                  paddingTop: "24px",
                  borderTop: "1px solid rgba(255,255,255,0.08)",
                }}
              >
                <div
                  style={{
                    color: "#7a6d99",
                    fontFamily: "'Exo 2',sans-serif",
                    fontSize: "11px",
                    textAlign: "center",
                    lineHeight: 1.6,
                  }}
                >
                  Complete all 16 pairs to
                  <br />
                  claim your spot on the board!
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ════════════ VIDEO ════════════ */}
      {phase === "video" && (
        <div style={{ position: "absolute", inset: 0, zIndex: 40, background: "#000" }}>
          <video
            src="https://ik.imagekit.io/pratik2002/first_video.mp4"
            style={{ width: "100%", height: "100%", objectFit: "cover" }}
            autoPlay
            onEnded={() => setPhase("game")}
          />
          <button
            onClick={() => setPhase("game")}
            style={{
              position: "absolute",
              bottom: "28px",
              right: "28px",
              background: "rgba(255,255,255,0.15)",
              border: "1px solid rgba(255,255,255,0.3)",
              color: "#fff",
              borderRadius: "8px",
              padding: "8px 20px",
              cursor: "pointer",
              fontFamily: "'Exo 2',sans-serif",
              fontSize: "13px",
            }}
          >
            Skip →
          </button>
        </div>
      )}

      {/* ════════════ GAME ════════════ */}
      {phase === "game" && !done && currentPair && (
        <>
          {/* HUD */}
          <div
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              zIndex: 30,
              padding: "10px 24px",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              background: "linear-gradient(to bottom,rgba(0,0,0,0.72) 0%,transparent 100%)",
            }}
          >
            <div
              style={{
                color: "#fff",
                fontSize: "clamp(18px,2.5vw,28px)",
                fontWeight: 700,
                letterSpacing: "2px",
              }}
            >
              {formatTime(timer)}
            </div>
            <div
              style={{
                color: "#e0d0ff",
                fontFamily: "'Exo 2',sans-serif",
                fontSize: "clamp(13px,1.8vw,18px)",
                fontWeight: 700,
              }}
            >
              Tap the matching tile
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <div style={{ fontSize: "clamp(18px,2.5vw,26px)" }}>
                {Array.from({ length: 3 }).map((_, i) => (
                  <span key={i} className={`heart${i >= lives ? "lost" : ""}`}>
                    {i < lives ? "❤️" : "🖤"}
                  </span>
                ))}
              </div>
              <span
                style={{
                  color: "#ffd700",
                  fontSize: "clamp(14px,2vw,20px)",
                  fontFamily: "'Exo 2',sans-serif",
                  fontWeight: 800,
                }}
              >
                ✓ {score}
              </span>
            </div>
          </div>

          {/* Decorative comets — upper zone only, no text */}
          {decorComets.map((c) => (
            <div
              key={c.id}
              style={{
                position: "absolute",
                left: `${c.x}vw`,
                top: `${c.y}vh`,
                width: c.size,
                height: c.size,
                transform: "translate(-50%,-50%)",
                zIndex: 2,
                pointerEvents: "none",
                opacity: 0.75,
              }}
            >
              <img
                src={COMET_IMGS[c.imgIdx]}
                alt=""
                style={{ width: "100%", height: "100%", objectFit: "contain" }}
                onError={(e) => {
                  (e.currentTarget as HTMLImageElement).style.display = "none";
                }}
              />
            </div>
          ))}

          {/* Main comet — word ALWAYS visible */}
          <div
            style={{
              position: "absolute",
              left: `${mainX}vw`,
              top: "27vh",
              transform: "translate(-50%,-50%)",
              width: "clamp(260px,36vw,460px)",
              height: "clamp(210px,30vw,380px)",
              zIndex: 15,
              pointerEvents: "none",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <img
              src={COMET_IMGS[0]}
              alt=""
              style={{
                position: "absolute",
                inset: 0,
                width: "100%",
                height: "100%",
                objectFit: "contain",
              }}
              onError={(e) => {
                (e.currentTarget as HTMLImageElement).style.display = "none";
              }}
            />
            {/* Word — always shown, no conditional */}
            <span
              style={{
                position: "relative",
                zIndex: 3,
                fontFamily: "'Exo 2',sans-serif",
                fontWeight: 900,
                fontSize: "clamp(28px,4.2vw,56px)",
                color: "#fff",
                textShadow: "0 3px 18px rgba(0,0,0,1),0 0 30px rgba(0,0,0,0.9)",
                letterSpacing: "1px",
                textAlign: "center",
                padding: "0 20px",
              }}
            >
              {currentPair.masculine}
            </span>
          </div>

          {/* Answer grid — bottom, bigger buttons */}
          <div
            style={{
              position: "absolute",
              bottom: 0,
              left: 0,
              right: 0,
              zIndex: 20,
              padding: "0 clamp(8px,2vw,28px) clamp(10px,2vh,22px)",
              background: "linear-gradient(to top,rgba(0,0,20,0.7) 0%,transparent 100%)",
            }}
          >
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(6,1fr)",
                gap: "clamp(7px,1vw,16px)",
                maxWidth: "1300px",
                margin: "0 auto",
              }}
            >
              {options.map((word, idx) => {
                const key = `${idx}-${word}`;
                const isFb = feedback?.id === key;
                const isOk = isFb && feedback?.correct;
                const isBd = isFb && !feedback?.correct;
                const isGold = idx % 2 === 0;
                return (
                  <button
                    key={key}
                    className={`ans-btn ${isGold ? "btn-gold" : "btn-gray"}${isOk ? "correct" : isBd ? "wrong" : ""}`}
                    onClick={() => handleAnswer(word, idx)}
                    disabled={!!feedback}
                  >
                    <div className="btn-face">
                      {idx + 1}. {word}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </>
      )}

      {/* ════════════ DONE ════════════ */}
      {phase === "game" && done && (
        <div
          style={{
            position: "absolute",
            inset: 0,
            zIndex: 60,
            background: "radial-gradient(ellipse at 50% 40%,#120030 0%,#03000a 100%)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <div
            className="done-box"
            style={{
              background: "linear-gradient(135deg,rgba(30,0,80,0.97),rgba(0,10,60,0.97))",
              border: "2px solid rgba(120,80,255,0.6)",
              borderRadius: "24px",
              padding: "52px 64px",
              textAlign: "center",
              maxWidth: "480px",
              width: "90%",
              boxShadow: "0 0 80px rgba(120,80,255,0.5)",
            }}
          >
            <div style={{ fontSize: "64px", marginBottom: "16px" }}>{lives > 0 ? "🎉" : "💫"}</div>
            <h2
              style={{
                color: "#fff",
                fontSize: "32px",
                fontWeight: 900,
                marginBottom: "8px",
                textShadow: "0 0 20px rgba(180,140,255,0.8)",
              }}
            >
              {lives > 0 ? "Great Job!" : "Game Over"}
            </h2>
            <p
              style={{
                color: "#a78bfa",
                fontSize: "20px",
                fontFamily: "'Exo 2',sans-serif",
                marginBottom: "32px",
              }}
            >
              Score: <strong style={{ color: "#ffd700" }}>{score}</strong>
            </p>
            <button
              onClick={() => {
                setPhase("modal");
                setDone(false);
              }}
              style={{
                padding: "14px 40px",
                background: "linear-gradient(135deg,#7c3aed,#2563eb)",
                border: "none",
                borderRadius: "12px",
                color: "#fff",
                fontSize: "16px",
                fontWeight: 700,
                cursor: "pointer",
                letterSpacing: "2px",
                boxShadow: "0 4px 24px rgba(124,58,237,0.5)",
              }}
            >
              ↩ Play Again
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

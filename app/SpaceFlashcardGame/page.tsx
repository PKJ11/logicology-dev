"use client";
import { useState, useEffect, useRef, useCallback } from "react";

interface Flashcard {
  id: number;
  clue: string;
  answer: string;
  image: string;
}

type Phase = "modal" | "video" | "game" | "done";
type AnswerState = "correct" | "wrong" | null;

const FLASHCARDS: Flashcard[] = [
  {
    id: 1,
    clue: "I am the largest planet in our Solar System.",
    answer: "Jupiter",
    image:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/2/2b/Jupiter_and_its_shrunken_Great_Red_Spot.jpg/290px-Jupiter_and_its_shrunken_Great_Red_Spot.jpg",
  },
  {
    id: 2,
    clue: "I was visited by the spacecraft Voyager 2 on August 25, 1989.",
    answer: "Neptune",
    image:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/6/63/Neptune_-_Voyager_2_%2829347980845%29_flatten_crop.jpg/280px-Neptune_-_Voyager_2_%2829347980845%29_flatten_crop.jpg",
  },
  {
    id: 3,
    clue: "I have beautiful rings made of ice and rock.",
    answer: "Saturn",
    image:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c7/Saturn_during_Equinox.jpg/280px-Saturn_during_Equinox.jpg",
  },
  {
    id: 4,
    clue: "I am the closest planet to the Sun.",
    answer: "Mercury",
    image:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/4/4a/Mercury_in_true_color.jpg/280px-Mercury_in_true_color.jpg",
  },
  {
    id: 5,
    clue: "I am known as the Red Planet.",
    answer: "Mars",
    image:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/0/02/OSIRIS_Mars_true_color.jpg/280px-OSIRIS_Mars_true_color.jpg",
  },
  {
    id: 6,
    clue: "I rotate on my side — my axis tilts 98 degrees!",
    answer: "Uranus",
    image:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/3/3d/Uranus2.jpg/280px-Uranus2.jpg",
  },
  {
    id: 7,
    clue: "I am the brightest planet visible from Earth.",
    answer: "Venus",
    image:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e5/Venus-real_color.jpg/280px-Venus-real_color.jpg",
  },
  {
    id: 8,
    clue: "I am home to all known life in the universe.",
    answer: "Earth",
    image:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/9/97/The_Earth_seen_from_Apollo_17.jpg/280px-The_Earth_seen_from_Apollo_17.jpg",
  },
  {
    id: 9,
    clue: "I am the hottest planet despite not being closest to the Sun.",
    answer: "Venus",
    image:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e5/Venus-real_color.jpg/280px-Venus-real_color.jpg",
  },
];

function shuffle(arr: Flashcard[]): Flashcard[] {
  return [...arr].sort(() => Math.random() - 0.5);
}

// Star data generated once outside component to avoid re-render flicker
const STARS = Array.from({ length: 100 }).map((_, i) => ({
  id: i,
  left: `${Math.random() * 100}%`,
  top: `${Math.random() * 100}%`,
  size: Math.random() > 0.85 ? "3px" : Math.random() > 0.6 ? "2px" : "1px",
  op: Math.random() * 0.6 + 0.3,
  dur: `${2 + Math.random() * 4}s`,
  delay: `${Math.random() * 4}s`,
}));

export default function SpaceFlashcardGame() {
  const [phase, setPhase] = useState<Phase>("modal");
  const [cards, setCards] = useState<Flashcard[]>([]);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [score, setScore] = useState(0);
  const [timer, setTimer] = useState(0);
  const [globalTimer, setGlobalTimer] = useState(0);
  const [answered, setAnswered] = useState<AnswerState>(null);
  const [showResult, setShowResult] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const timerRef = useRef<ReturnType<typeof setInterval> | undefined>(undefined);
  const globalTimerRef = useRef<ReturnType<typeof setInterval> | undefined>(undefined);
  const containerRef = useRef<HTMLDivElement>(null);

  // Auto-request fullscreen whenever phase changes (user gesture context)
  const tryFullscreen = useCallback(() => {
    const el = containerRef.current ?? document.documentElement;
    if (el.requestFullscreen && !document.fullscreenElement) {
      el.requestFullscreen().catch(() => {
        /* silently ignore if denied */
      });
    }
  }, []);

  // Track fullscreen state
  useEffect(() => {
    const onChange = () => setIsFullscreen(!!document.fullscreenElement);
    document.addEventListener("fullscreenchange", onChange);
    return () => document.removeEventListener("fullscreenchange", onChange);
  }, []);

  const goFullscreen = () => tryFullscreen();
  const exitFullscreen = () => {
    if (document.fullscreenElement) document.exitFullscreen();
  };

  // Start game
  useEffect(() => {
    if (phase !== "game") return;
    setCards(shuffle(FLASHCARDS));
    setCurrentIdx(0);
    setScore(0);
    setFlipped(false);
    setAnswered(null);
    setTimer(0);
    setGlobalTimer(0);
    setShowResult(false);
  }, [phase]);

  // Per-card timer
  useEffect(() => {
    if (phase !== "game") return;
    setTimer(0);
    clearInterval(timerRef.current);
    timerRef.current = setInterval(() => setTimer((t) => t + 1), 1000);
    return () => clearInterval(timerRef.current);
  }, [phase, currentIdx]);

  // Global timer
  useEffect(() => {
    if (phase !== "game") return;
    globalTimerRef.current = setInterval(() => setGlobalTimer((t) => t + 1), 1000);
    return () => clearInterval(globalTimerRef.current);
  }, [phase]);

  const formatTime = (s: number) => `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`;

  const handleFlip = () => {
    if (answered) return;
    setFlipped((f) => !f);
  };

  const handleAnswer = useCallback(
    (correct: boolean) => {
      if (answered) return;
      clearInterval(timerRef.current);
      setAnswered(correct ? "correct" : "wrong");
      setShowResult(true);
      if (correct) setScore((s) => s + 1);
      setTimeout(() => {
        setShowResult(false);
        setAnswered(null);
        setFlipped(false);
        const next = currentIdx + 1;
        if (next >= cards.length) {
          clearInterval(globalTimerRef.current);
          setPhase("done");
        } else {
          setCurrentIdx(next);
        }
      }, 1200);
    },
    [answered, currentIdx, cards.length]
  );

  const navigate = (dir: number) => {
    if (answered) return;
    const next = currentIdx + dir;
    if (next < 0 || next >= cards.length) return;
    setCurrentIdx(next);
    setFlipped(false);
    setAnswered(null);
  };

  const currentCard = cards[currentIdx] as Flashcard | undefined;

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

        .space-bg {
          position:absolute; inset:0; width:100%; height:100%;
          background: radial-gradient(ellipse at 30% 40%, #3b0a6b 0%, #1a004a 35%, #08001a 70%, #000 100%);
          overflow:hidden;
        }
        .star { position:absolute; border-radius:50%; background:#fff; }
        @keyframes twinkle { 0%,100%{opacity:var(--op,0.6)} 50%{opacity:0.1} }

        .planet-pink {
          position:absolute; right:8%; top:12%;
          width:clamp(40px,7vw,90px); height:clamp(40px,7vw,90px);
          border-radius:50%;
          background: radial-gradient(circle at 35% 35%, #ff88cc, #c0005a);
          box-shadow: 0 0 30px rgba(255,100,180,0.5);
          animation: floatPlanet 6s ease-in-out infinite;
        }
        @keyframes floatPlanet { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-12px)} }

        .card-scene {
          perspective: 1200px;
          width: clamp(300px, 55vw, 680px);
          height: clamp(260px, 42vh, 480px);
          cursor: pointer;
        }
        .card-inner {
          width:100%; height:100%;
          position:relative;
          transform-style: preserve-3d;
          transition: transform 0.65s cubic-bezier(0.4,0.2,0.2,1);
        }
        .card-inner.flipped { transform: rotateY(180deg); }

        .card-face {
          position:absolute; inset:0;
          backface-visibility: hidden;
          -webkit-backface-visibility: hidden;
          border-radius:18px;
          display:flex; flex-direction:column;
          align-items:center; justify-content:center;
          padding:clamp(18px,3vw,36px);
          background: linear-gradient(160deg, #d8d8e8 0%, #b0b0c8 30%, #e0e0f0 55%, #a8a8c0 80%, #c8c8e0 100%);
          border: 3px solid rgba(255,255,255,0.6);
          box-shadow: 0 0 0 1px rgba(0,0,0,0.3), 0 8px 40px rgba(0,0,0,0.6),
            inset 0 2px 0 rgba(255,255,255,0.8), inset 0 -2px 0 rgba(0,0,0,0.2);
        }
        .card-face::before, .card-face::after {
          content:''; position:absolute; width:22px; height:22px; border-radius:50%;
          background: radial-gradient(circle at 35% 35%, #e8e8f8, #9898b8);
          border: 2px solid rgba(255,255,255,0.5);
          box-shadow: inset 0 2px 4px rgba(0,0,0,0.3), 0 2px 4px rgba(255,255,255,0.4);
        }
        .card-face::before { top:14px; left:14px; }
        .card-face::after  { bottom:14px; right:14px; }

        .bolt-tr, .bolt-bl {
          position:absolute; width:22px; height:22px; border-radius:50%;
          background: radial-gradient(circle at 35% 35%, #e8e8f8, #9898b8);
          border: 2px solid rgba(255,255,255,0.5);
          box-shadow: inset 0 2px 4px rgba(0,0,0,0.3), 0 2px 4px rgba(255,255,255,0.4);
          pointer-events:none; z-index:5;
        }
        .bolt-tr { top:14px; right:14px; }
        .bolt-bl { bottom:14px; left:14px; }

        .card-antenna { position:absolute; top:-2px; left:50%; transform:translateX(-50%); display:flex; gap:8px; }
        .card-antenna span {
          width:6px; height:6px; border-radius:50%;
          background: radial-gradient(circle at 35% 35%, #ccc, #888);
          border:1px solid rgba(255,255,255,0.4);
        }
        .card-antenna-bar {
          position:absolute; top:-8px; left:50%; transform:translateX(-50%);
          width:60px; height:6px;
          background: linear-gradient(to right, #9090a8, #c0c0d8, #9090a8);
          border-radius:3px; border:1px solid rgba(255,255,255,0.4);
        }
        .card-back { transform: rotateY(180deg); }

        .clue-text {
          font-family:'Exo 2',sans-serif; font-weight:800;
          font-size:clamp(18px,2.8vw,32px); color:#111;
          text-align:center; line-height:1.4;
        }

        .flip-btn {
          background: linear-gradient(180deg, #555 0%, #2a2a2a 100%);
          border: 2px solid #888; border-radius:10px; color:#fff;
          font-family:'Exo 2',sans-serif; font-weight:700;
          font-size:clamp(14px,1.8vw,20px); padding:10px 40px;
          cursor:pointer; letter-spacing:2px;
          box-shadow: 0 4px 0 #111, 0 6px 16px rgba(0,0,0,0.5);
          transition: transform 0.1s, box-shadow 0.1s; user-select:none;
        }
        .flip-btn:hover { transform:translateY(-2px); filter:brightness(1.15); }
        .flip-btn:active { transform:translateY(2px); box-shadow:0 2px 0 #111; }

        .ans-btn {
          width:80px; height:80px;
          background: linear-gradient(160deg, #b8c8d8 0%, #9090a8 100%);
          border:3px solid rgba(255,255,255,0.5); border-radius:12px;
          cursor:pointer; display:flex; align-items:center; justify-content:center;
          box-shadow: 0 4px 0 #555, 0 8px 20px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.6);
          transition: transform 0.1s, filter 0.1s;
        }
        .ans-btn:hover { transform:scale(1.08); filter:brightness(1.1); }
        .ans-btn:active { transform:scale(0.94); }

        .nav-arrow {
          background:none; border:none; cursor:pointer;
          color:rgba(255,255,255,0.7); font-size:clamp(18px,2.5vw,28px);
          padding:6px 14px; transition:color 0.15s, transform 0.15s;
          user-select:none; font-family:'Exo 2',sans-serif; font-weight:700;
        }
        .nav-arrow:hover { color:#fff; transform:scale(1.15); }
        .nav-arrow:disabled { opacity:0.25; cursor:default; transform:none; }

        .hud {
          position:absolute; top:0; left:0; right:0; z-index:30;
          padding:14px 28px; display:flex; align-items:center; justify-content:space-between;
          background:linear-gradient(to bottom, rgba(0,0,0,0.65) 0%, transparent 100%);
        }
        .hud-time { font-size:clamp(20px,2.8vw,32px); font-weight:700; color:#fff; letter-spacing:2px; }
        .hud-center {
          display:flex; align-items:center; gap:10px; color:rgba(255,255,255,0.9);
          font-family:'Exo 2',sans-serif; font-size:clamp(14px,1.8vw,20px); font-weight:700; letter-spacing:1px;
        }
        .hud-score {
          color:#ffd700; font-size:clamp(18px,2.3vw,26px);
          font-family:'Exo 2',sans-serif; font-weight:800;
          display:flex; align-items:center; gap:6px;
        }

        .result-overlay {
          position:absolute; inset:0; z-index:50;
          display:flex; align-items:center; justify-content:center;
          pointer-events:none; animation: resultFade 1.2s ease forwards;
        }
        @keyframes resultFade {
          0%{opacity:0;transform:scale(0.7)} 20%{opacity:1;transform:scale(1.05)}
          70%{opacity:1;transform:scale(1)} 100%{opacity:0;transform:scale(0.8)}
        }
        .result-chip {
          padding:18px 40px; border-radius:16px;
          font-family:'Exo 2',sans-serif; font-size:clamp(22px,3vw,40px);
          font-weight:900; letter-spacing:3px; box-shadow:0 0 60px rgba(0,0,0,0.7);
        }
        .result-chip.correct { background:linear-gradient(135deg,#00d44f,#007a2a); color:#fff; box-shadow:0 0 50px rgba(0,220,80,0.7); }
        .result-chip.wrong   { background:linear-gradient(135deg,#ff4444,#a00010); color:#fff; box-shadow:0 0 50px rgba(255,50,50,0.7); }

        @keyframes fadeIn{from{opacity:0;transform:scale(0.88)}to{opacity:1;transform:scale(1)}}
        .modal-box{animation:fadeIn 0.4s ease;}
        .lb-row{
          display:flex;align-items:center;gap:12px;padding:10px 16px;border-radius:10px;
          background:rgba(255,255,255,0.06);border:1px solid rgba(255,255,255,0.08);
          margin-bottom:6px;font-family:'Exo 2',sans-serif;
        }
        .lb-row.top3{background:rgba(180,140,255,0.12);border-color:rgba(180,140,255,0.25);}

        @keyframes doneIn{from{opacity:0;transform:scale(0.7)}to{opacity:1;transform:scale(1)}}
        .done-box{animation:doneIn 0.5s cubic-bezier(.2,1.5,.5,1) forwards;}

        .bottom-bar {
          position:absolute; bottom:0; left:0; right:0; z-index:25;
          display:flex; justify-content:center; align-items:center;
          padding:0 0 clamp(16px,3vh,32px);
          background:linear-gradient(to top, rgba(0,0,0,0.55) 0%, transparent 100%);
        }
        .side-btns {
          position:absolute; right:clamp(16px,4vw,60px); top:50%;
          transform:translateY(-50%); z-index:25; display:flex; flex-direction:column; gap:14px;
        }

        /* Fullscreen toggle button */
        .fs-btn {
          position:fixed; bottom:16px; right:16px; z-index:100;
          background:rgba(255,255,255,0.1); border:1px solid rgba(255,255,255,0.25);
          color:rgba(255,255,255,0.7); border-radius:8px; padding:7px 12px;
          cursor:pointer; font-size:16px; transition:background 0.15s, color 0.15s;
          backdrop-filter:blur(4px);
        }
        .fs-btn:hover { background:rgba(255,255,255,0.2); color:#fff; }
      `}</style>

      {/* Always-visible fullscreen toggle */}
      <button
        className="fs-btn"
        onClick={isFullscreen ? exitFullscreen : goFullscreen}
        title={isFullscreen ? "Exit fullscreen" : "Enter fullscreen"}
      >
        {isFullscreen ? "⊠" : "⛶"}
      </button>

      {/* SPACE BACKGROUND */}
      <div className="space-bg">
        {STARS.map((s) => (
          <div
            key={s.id}
            className="star"
            style={
              {
                left: s.left,
                top: s.top,
                width: s.size,
                height: s.size,
                opacity: s.op,
                animation: `twinkle ${s.dur} ease-in-out infinite ${s.delay}`,
              } as React.CSSProperties
            }
          />
        ))}
        <div className="planet-pink" />
        <div
          style={{
            position: "absolute",
            left: "5%",
            bottom: "15%",
            width: "clamp(30px,5vw,60px)",
            height: "clamp(30px,5vw,60px)",
            borderRadius: "50%",
            background: "radial-gradient(circle at 35% 35%, #88aaff, #2233aa)",
            boxShadow: "0 0 24px rgba(80,120,255,0.5)",
            opacity: 0.6,
          }}
        />
      </div>

      {/* ════ MODAL ════ */}
      {phase === "modal" && (
        <div
          style={{
            position: "absolute",
            inset: 0,
            zIndex: 50,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <div
            className="modal-box"
            style={{
              display: "flex",
              width: "100%",
              maxWidth: "1000px",
              margin: "24px",
              borderRadius: "24px",
              overflow: "hidden",
              border: "2px solid rgba(120,80,255,0.5)",
              boxShadow: "0 0 80px rgba(120,80,255,0.35)",
              background: "linear-gradient(135deg,rgba(22,0,60,0.97),rgba(0,8,50,0.97))",
            }}
          >
            {/* Left */}
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
                Space Explorer · Science
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
                Planet Flashcards
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
                Read the clue · Flip to reveal
              </h2>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: "10px",
                  marginBottom: "28px",
                }}
              >
                {[
                  { icon: "🃏", label: "9 cards", sub: "to explore" },
                  { icon: "⏱️", label: "Timed", sub: "per card" },
                  { icon: "✅", label: "Flip & Judge", sub: "know it or not" },
                  { icon: "⭐", label: "1 pt", sub: "per correct" },
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
                Read the clue on the front of the card.
                <br />
                Tap <strong style={{ color: "#c4b5fd" }}>Flip</strong> to reveal the answer, then
                tap ✓ if you knew it or ✗ if you didn't!
              </p>
              <button
                onClick={() => {
                  tryFullscreen();
                  setPhase("video");
                }}
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
            {/* Right — leaderboard */}
            <div
              style={{
                width: "300px",
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
                    Top explorers this week
                  </div>
                </div>
              </div>
              {(
                [
                  { rank: 1, name: "Aarav S.", score: 9, medal: "🥇" },
                  { rank: 2, name: "Priya M.", score: 8, medal: "🥈" },
                  { rank: 3, name: "Rohan K.", score: 7, medal: "🥉" },
                  { rank: 4, name: "Sneha P.", score: 6, medal: "" },
                  { rank: 5, name: "Arjun T.", score: 5, medal: "" },
                ] as const
              ).map((row) => (
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
                  Complete all 9 cards to
                  <br />
                  claim your spot on the board!
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ════ VIDEO ════ */}
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

      {/* ════ GAME ════ */}
      {phase === "game" && currentCard && (
        <>
          <div className="hud">
            <div className="hud-time">{formatTime(timer)}</div>
            <div className="hud-center">
              <button
                className="nav-arrow"
                onClick={() => navigate(-1)}
                disabled={currentIdx === 0}
              >
                ◁
              </button>
              <span
                style={{
                  fontFamily: "'Exo 2',sans-serif",
                  fontWeight: 700,
                  fontSize: "clamp(14px,1.8vw,20px)",
                  color: "#fff",
                }}
              >
                {currentIdx + 1} of {cards.length}
              </span>
              <button
                className="nav-arrow"
                onClick={() => navigate(1)}
                disabled={currentIdx === cards.length - 1}
              >
                ▷
              </button>
            </div>
            <div className="hud-score">
              <span style={{ fontSize: "clamp(14px,1.5vw,18px)", color: "rgba(255,255,255,0.6)" }}>
                ✓
              </span>
              {score}
            </div>
          </div>

          <div
            style={{
              position: "absolute",
              inset: 0,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              zIndex: 10,
              paddingTop: "80px",
              paddingBottom: "80px",
            }}
          >
            <div className="card-scene" onClick={handleFlip}>
              <div className={`card-inner${flipped ? "flipped" : ""}`}>
                {/* FRONT */}
                <div className="card-face">
                  <div className="card-antenna-bar" />
                  <div className="card-antenna">
                    <span />
                    <span />
                    <span />
                  </div>
                  <div className="bolt-tr" />
                  <div className="bolt-bl" />
                  <p className="clue-text">{currentCard.clue}</p>
                </div>
                {/* BACK */}
                <div className="card-face card-back">
                  <div className="card-antenna-bar" />
                  <div className="card-antenna">
                    <span />
                    <span />
                    <span />
                  </div>
                  <div className="bolt-tr" />
                  <div className="bolt-bl" />
                  <img
                    src={currentCard.image}
                    alt={currentCard.answer}
                    style={{
                      width: "clamp(140px,22vw,240px)",
                      height: "clamp(120px,18vw,200px)",
                      objectFit: "cover",
                      borderRadius: "8px",
                      marginBottom: "14px",
                      border: "2px solid rgba(0,0,0,0.2)",
                      boxShadow: "0 4px 16px rgba(0,0,0,0.3)",
                    }}
                    onError={(e) => {
                      (e.currentTarget as HTMLImageElement).style.display = "none";
                    }}
                  />
                  <p
                    style={{
                      fontFamily: "'Exo 2',sans-serif",
                      fontWeight: 900,
                      fontSize: "clamp(24px,4vw,44px)",
                      color: "#111",
                      letterSpacing: "1px",
                    }}
                  >
                    {currentCard.answer}
                  </p>
                </div>
              </div>
            </div>

            {flipped && !answered && (
              <div className="side-btns">
                <button className="ans-btn" onClick={() => handleAnswer(true)} title="I knew it!">
                  <svg width="36" height="36" viewBox="0 0 36 36">
                    <path
                      d="M6 18 L14 27 L30 10"
                      stroke="#22cc55"
                      strokeWidth="5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      fill="none"
                    />
                  </svg>
                </button>
                <button
                  className="ans-btn"
                  onClick={() => handleAnswer(false)}
                  title="I didn't know"
                >
                  <svg width="36" height="36" viewBox="0 0 36 36">
                    <path
                      d="M8 8 L28 28 M28 8 L8 28"
                      stroke="#ff3333"
                      strokeWidth="5"
                      strokeLinecap="round"
                    />
                  </svg>
                </button>
              </div>
            )}
          </div>

          <div className="bottom-bar">
            <button className="flip-btn" onClick={handleFlip}>
              Flip
            </button>
          </div>

          {showResult && (
            <div className="result-overlay">
              <div className={`result-chip ${answered}`}>
                {answered === "correct" ? "✓  Correct!" : "✗  Wrong!"}
              </div>
            </div>
          )}
        </>
      )}

      {/* ════ DONE ════ */}
      {phase === "done" && (
        <div
          style={{
            position: "absolute",
            inset: 0,
            zIndex: 60,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background: "radial-gradient(ellipse at 50% 40%,#120030 0%,#03000a 100%)",
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
            <div style={{ fontSize: "64px", marginBottom: "16px" }}>
              {score >= 7 ? "🎉" : score >= 4 ? "⭐" : "💫"}
            </div>
            <h2
              style={{
                color: "#fff",
                fontSize: "32px",
                fontWeight: 900,
                marginBottom: "8px",
                textShadow: "0 0 20px rgba(180,140,255,0.8)",
              }}
            >
              {score >= 7 ? "Stellar Work!" : score >= 4 ? "Good Job!" : "Keep Exploring!"}
            </h2>
            <p
              style={{
                color: "#a78bfa",
                fontSize: "18px",
                fontFamily: "'Exo 2',sans-serif",
                marginBottom: "8px",
              }}
            >
              You knew <strong style={{ color: "#ffd700" }}>{score}</strong> out of{" "}
              <strong style={{ color: "#ffd700" }}>{cards.length}</strong> cards
            </p>
            <p
              style={{
                color: "#6b5d8a",
                fontSize: "14px",
                fontFamily: "'Exo 2',sans-serif",
                marginBottom: "32px",
              }}
            >
              Time: {formatTime(globalTimer)}
            </p>
            <button
              onClick={() => {
                setPhase("modal");
                setScore(0);
                setCurrentIdx(0);
                setFlipped(false);
                setAnswered(null);
                setGlobalTimer(0);
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
                fontFamily: "'Exo 2',sans-serif",
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

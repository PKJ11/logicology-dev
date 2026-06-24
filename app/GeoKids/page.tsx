"use client";
import { useState, useEffect, useRef, useCallback } from "react";
import { ComposableMap, Geographies, Geography } from "react-simple-maps";

// Types
type ScreenType = "menu" | "game" | "result";
type StatusType = "playing" | "correct" | "wrong" | "timeout";

interface GeographyType {
  rsmKey: string;
  properties: {
    name: string;
  };
}

const COUNTRY_FACTS: Record<string, string> = {
  India: "Has a floating post office on Dal Lake in Kashmir!",
  Pakistan: "Home to the Karakoram Highway, one of the world's highest roads!",
  Bangladesh: "Has the world's largest river delta — the Sundarbans!",
  China: "Invented paper, printing, gunpowder, and the compass!",
  Russia: "Stretches across 11 time zones — the world's largest country!",
  Kazakhstan: "The world's largest landlocked country!",
  Mongolia: "Has more horses than people!",
  Japan: "Has 5.5 million vending machines — one for every 23 people!",
  Indonesia: "World's largest archipelago with over 17,000 islands!",
  Malaysia: "Has the world's oldest rainforest, older than the Amazon!",
  Thailand: "Has over 40,000 temples!",
  Iran: "Has one of the world's oldest continuous civilizations!",
  "South Korea": "Made the world's first metal movable type printing press!",
  "Saudi Arabia": "Is larger than Western Europe and mostly desert!",
  Turkey: "Sits on two continents — Europe and Asia!",
  Australia: "Home to the oldest living culture on Earth — over 65,000 years old!",
  "New Zealand": "First country to give women the right to vote in 1893!",
  Algeria: "The largest country in Africa by area!",
  Egypt: "The Great Pyramid was the tallest structure on Earth for 3,800 years!",
  Kenya: "Home to the Great Rift Valley, visible from space!",
  Namibia: "Home to the world's oldest desert — the Namib!",
  Nigeria: "Has the highest rate of twin births in the world!",
  "South Africa": "Has three capital cities — Pretoria, Cape Town, and Bloemfontein!",
  Madagascar: "Home to 90% of wildlife found nowhere else on Earth!",
  "United Kingdom": "Invented the World Wide Web and the steam engine!",
  France: "The Eiffel Tower grows 15cm taller in summer due to heat!",
  Germany: "Has over 1,500 different types of beer!",
  Italy: "Home to more UNESCO World Heritage Sites than any other country!",
  Spain: "Home to La Tomatina — a festival where people throw tomatoes!",
  Ukraine: "Has the deepest metro station in the world — Arsenalna!",
  "United States of America": "Home to Yellowstone, the world's first national park!",
  Canada: "Has more lakes than the rest of the world combined!",
  Mexico: "Gave the world chocolate, corn, and chili peppers!",
  Brazil: "Home to the Amazon, the world's largest rainforest!",
  Argentina: "Has the highest peak in the Western Hemisphere — Mount Aconcagua!",
  Chile: "The longest country in the world from north to south!",
};

const COUNTRY_LIST = Object.keys(COUNTRY_FACTS);
const GEO_URL = "https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json";
const ROUNDS = 10;
const ROUND_TIME = 20;

const NAME_NORMALIZE: Record<string, string> = {
  "United States": "United States of America",
  "S. Korea": "South Korea",
  "N. Korea": "North Korea",
  "Dem. Rep. Congo": "Democratic Republic of the Congo",
  "Central African Rep.": "Central African Republic",
  "Côte d'Ivoire": "Ivory Coast",
};

function normalizeName(name: string): string {
  return NAME_NORMALIZE[name] || name;
}

function shuffle(arr: string[]): string[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function Stars({ correct, total }: { correct: number; total: number }) {
  const pct = correct / total;
  const stars = pct >= 0.85 ? 3 : pct >= 0.6 ? 2 : pct >= 0.3 ? 1 : 0;
  return (
    <div
      style={{ display: "flex", gap: 6, justifyContent: "center", fontSize: 44, marginBottom: 8 }}
    >
      {[0, 1, 2].map((i) => (
        <span
          key={i}
          style={{ opacity: i < stars ? 1 : 0.2, filter: i < stars ? "none" : "grayscale(1)" }}
        >
          ⭐
        </span>
      ))}
    </div>
  );
}

export default function GeoKids() {
  const [screen, setScreen] = useState<ScreenType>("menu");
  const [countries, setCountries] = useState<string[]>([]);
  const [roundIdx, setRoundIdx] = useState<number>(0);
  // correctAnswers: how many countries correctly identified (max = ROUNDS)
  const [correctAnswers, setCorrectAnswers] = useState<number>(0);
  // bonusPoints: extra points earned via streak (for fun display only)
  const [bonusPoints, setBonusPoints] = useState<number>(0);
  const [timeLeft, setTimeLeft] = useState<number>(ROUND_TIME);
  const [status, setStatus] = useState<StatusType>("playing");
  const [hoveredCountry, setHoveredCountry] = useState<string | null>(null);
  const [clickedWrong, setClickedWrong] = useState<string | null>(null);
  const [showFact, setShowFact] = useState<boolean>(false);
  const [streak, setStreak] = useState<number>(0);
  const [bestStreak, setBestStreak] = useState<number>(0);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const currentCountry = countries[roundIdx];

  const clearTimer = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  };

  const advanceRound = useCallback(() => {
    clearTimer();
    setTimeout(() => {
      setShowFact(false);
      setClickedWrong(null);
      if (roundIdx + 1 >= ROUNDS) {
        setScreen("result");
      } else {
        setRoundIdx((r) => r + 1);
        setTimeLeft(ROUND_TIME);
        setStatus("playing");
      }
    }, 2500);
  }, [roundIdx]);

  useEffect(() => {
    if (screen !== "game" || status !== "playing") return;
    clearTimer();
    timerRef.current = setInterval(() => {
      setTimeLeft((t) => {
        if (t <= 1) {
          clearTimer();
          setStatus("timeout");
          setStreak(0);
          setShowFact(true);
          advanceRound();
          return 0;
        }
        return t - 1;
      });
    }, 1000);
    return clearTimer;
  }, [screen, status, roundIdx, advanceRound]);

  const startGame = () => {
    const picked = shuffle(COUNTRY_LIST).slice(0, ROUNDS);
    setCountries(picked);
    setRoundIdx(0);
    setCorrectAnswers(0);
    setBonusPoints(0);
    setTimeLeft(ROUND_TIME);
    setStatus("playing");
    setStreak(0);
    setBestStreak(0);
    setShowFact(false);
    setClickedWrong(null);
    setScreen("game");
  };

  const handleCountryClick = (geoName: string) => {
    if (status !== "playing") return;
    const normalized = normalizeName(geoName);
    if (normalized === currentCountry) {
      clearTimer();
      const newStreak = streak + 1;
      // correctAnswers always increments by exactly 1 — no bonus inflation
      setCorrectAnswers((c) => c + 1);
      // streak bonus tracked separately so score display stays honest
      if (newStreak >= 3) {
        setBonusPoints((b) => b + 1); // +1 bonus on top of the correct answer
      }
      setStreak(newStreak);
      setBestStreak((b) => Math.max(b, newStreak));
      setStatus("correct");
      setShowFact(true);
      advanceRound();
    } else {
      setClickedWrong(geoName);
      setStatus("wrong");
      setTimeout(() => {
        setClickedWrong(null);
        setStatus("playing");
      }, 700);
    }
  };

  // ── MENU ──────────────────────────────────────────────────────────────────────
  if (screen === "menu") {
    return (
      <div
        style={{
          minHeight: "100vh",
          background: "linear-gradient(160deg, #dbeafe 0%, #fef9c3 50%, #fce7f3 100%)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontFamily: "'Nunito', 'Segoe UI', sans-serif",
          padding: 20,
        }}
      >
        <style>{`
          @keyframes floatGlobe { 0%,100%{transform:translateY(0) rotate(-4deg)} 50%{transform:translateY(-14px) rotate(4deg)} }
          @keyframes fadeUp { from{opacity:0;transform:translateY(20px)} to{opacity:1;transform:translateY(0)} }
        `}</style>
        <div style={{ width: "100%", maxWidth: 500, textAlign: "center" }}>
          <div
            style={{
              fontSize: 100,
              lineHeight: 1,
              marginBottom: 16,
              display: "inline-block",
              animation: "floatGlobe 4s ease-in-out infinite",
            }}
          >
            🌍
          </div>

          <h1
            style={{
              margin: "0 0 10px",
              fontSize: 60,
              fontWeight: 900,
              color: "#1e293b",
              letterSpacing: -2,
              lineHeight: 1,
              animation: "fadeUp 0.5s ease",
            }}
          >
            Geo<span style={{ color: "#3b82f6" }}>Kids</span>
          </h1>
          <p style={{ margin: "0 0 36px", color: "#64748b", fontSize: 22, fontWeight: 700 }}>
            Click the right country on the map! 🗺️
          </p>

          <div
            style={{
              display: "flex",
              gap: 12,
              justifyContent: "center",
              flexWrap: "wrap",
              marginBottom: 40,
            }}
          >
            {[
              {
                icon: "🎯",
                label: "10 Rounds",
                bg: "#eff6ff",
                border: "#bfdbfe",
                color: "#2563eb",
              },
              { icon: "⏱️", label: "20s Each", bg: "#fefce8", border: "#fde68a", color: "#d97706" },
              {
                icon: "🔥",
                label: "Streak Bonus",
                bg: "#fff7ed",
                border: "#fed7aa",
                color: "#ea580c",
              },
              {
                icon: "✨",
                label: "Fun Facts",
                bg: "#f5f3ff",
                border: "#ddd6fe",
                color: "#7c3aed",
              },
            ].map(({ icon, label, bg, border, color }) => (
              <div
                key={label}
                style={{
                  background: bg,
                  border: `2px solid ${border}`,
                  borderRadius: 18,
                  padding: "14px 18px",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: 5,
                  minWidth: 90,
                }}
              >
                <span style={{ fontSize: 32 }}>{icon}</span>
                <span style={{ fontSize: 13, fontWeight: 900, color }}>{label}</span>
              </div>
            ))}
          </div>

          <button
            onClick={startGame}
            style={{
              background: "linear-gradient(135deg, #3b82f6 0%, #6366f1 100%)",
              color: "white",
              border: "none",
              borderRadius: 28,
              padding: "22px 72px",
              fontSize: 28,
              fontWeight: 900,
              cursor: "pointer",
              fontFamily: "inherit",
              boxShadow: "0 8px 32px #3b82f655",
              transition: "transform 0.15s, box-shadow 0.15s",
            }}
            onMouseEnter={(e: React.MouseEvent<HTMLButtonElement>) => {
              e.currentTarget.style.transform = "translateY(-4px) scale(1.04)";
              e.currentTarget.style.boxShadow = "0 16px 48px #3b82f677";
            }}
            onMouseLeave={(e: React.MouseEvent<HTMLButtonElement>) => {
              e.currentTarget.style.transform = "none";
              e.currentTarget.style.boxShadow = "0 8px 32px #3b82f655";
            }}
          >
            🚀 Let's Play!
          </button>

          <p style={{ marginTop: 20, color: "#94a3b8", fontSize: 15, fontWeight: 600 }}>
            Hover over countries to see their names
          </p>
        </div>
      </div>
    );
  }

  // ── RESULT ────────────────────────────────────────────────────────────────────
  if (screen === "result") {
    const accuracy = Math.round((correctAnswers / ROUNDS) * 100); // always 0–100%
    const msg =
      accuracy >= 85
        ? "Amazing Explorer! 🎉"
        : accuracy >= 60
          ? "Great job! 🎊"
          : accuracy >= 30
            ? "Keep exploring! 💪"
            : "Try again! 🌱";
    return (
      <div
        style={{
          minHeight: "100vh",
          background: "linear-gradient(160deg, #dbeafe 0%, #fef9c3 50%, #fce7f3 100%)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontFamily: "'Nunito', 'Segoe UI', sans-serif",
          padding: 20,
        }}
      >
        <div style={{ width: "100%", maxWidth: 440, textAlign: "center" }}>
          <div style={{ fontSize: 96, marginBottom: 12 }}>🏆</div>
          <h2 style={{ margin: "0 0 8px", fontSize: 44, fontWeight: 900, color: "#1e293b" }}>
            Game Over!
          </h2>
          <p style={{ margin: "0 0 20px", color: "#64748b", fontSize: 24, fontWeight: 800 }}>
            {msg}
          </p>

          <Stars correct={correctAnswers} total={ROUNDS} />

          <div
            style={{
              background: "white",
              borderRadius: 28,
              padding: "28px 36px",
              margin: "16px 0 24px",
              boxShadow: "0 4px 32px #3b82f611",
              border: "2px solid #e0f2fe",
            }}
          >
            {[
              {
                label: "Score",
                // correctAnswers out of ROUNDS — never exceeds total
                value: `${correctAnswers} / ${ROUNDS}`,
                icon: "🎯",
                color: "#3b82f6",
              },
              {
                label: "Accuracy",
                // based on correct answers only, caps at 100%
                value: `${accuracy}%`,
                icon: "📊",
                color: "#8b5cf6",
              },
              {
                label: "Bonus Points",
                // streak bonuses shown separately so they're transparent
                value: bonusPoints > 0 ? `+${bonusPoints} 🔥` : "—",
                icon: "⚡",
                color: "#f59e0b",
              },
              {
                label: "Best Streak",
                value: `${bestStreak} 🔥`,
                icon: "🌟",
                color: "#ea580c",
              },
            ].map(({ label, value, icon, color }, idx, arr) => (
              <div
                key={label}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 14,
                  padding: "14px 0",
                  borderBottom: idx < arr.length - 1 ? "1.5px solid #f1f5f9" : "none",
                }}
              >
                <span style={{ fontSize: 30, width: 40 }}>{icon}</span>
                <span
                  style={{
                    flex: 1,
                    textAlign: "left",
                    color: "#64748b",
                    fontSize: 20,
                    fontWeight: 700,
                  }}
                >
                  {label}
                </span>
                <span style={{ fontWeight: 900, fontSize: 24, color }}>{value}</span>
              </div>
            ))}
          </div>

          <div style={{ display: "flex", gap: 12 }}>
            <button
              onClick={startGame}
              style={{
                flex: 1,
                padding: "20px 0",
                background: "linear-gradient(135deg, #3b82f6, #6366f1)",
                color: "white",
                border: "none",
                borderRadius: 20,
                fontWeight: 900,
                fontSize: 22,
                cursor: "pointer",
                fontFamily: "inherit",
                boxShadow: "0 4px 20px #3b82f644",
              }}
            >
              🔄 Play Again
            </button>
            <button
              onClick={() => setScreen("menu")}
              style={{
                flex: 1,
                padding: "20px 0",
                background: "white",
                color: "#64748b",
                border: "2.5px solid #e2e8f0",
                borderRadius: 20,
                fontWeight: 800,
                fontSize: 22,
                cursor: "pointer",
                fontFamily: "inherit",
              }}
            >
              🏠 Menu
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ── GAME ──────────────────────────────────────────────────────────────────────
  const timePct = (timeLeft / ROUND_TIME) * 100;
  const timerColor = timePct > 50 ? "#22c55e" : timePct > 25 ? "#f59e0b" : "#ef4444";
  const fact = COUNTRY_FACTS[currentCountry] || "A wonderful country to explore!";

  return (
    <div
      style={{
        height: "100vh",
        display: "flex",
        flexDirection: "column",
        fontFamily: "'Nunito', 'Segoe UI', sans-serif",
        background: "#e8f4fd",
        overflow: "hidden",
      }}
    >
      {/* TOP BAR */}
      <div
        style={{
          background: "white",
          borderBottom: "2.5px solid #dbeafe",
          padding: "10px 20px",
          display: "flex",
          alignItems: "center",
          gap: 10,
          flexShrink: 0,
          boxShadow: "0 2px 16px #3b82f61a",
        }}
      >
        <button
          onClick={() => setScreen("menu")}
          style={{
            background: "#eff6ff",
            border: "none",
            cursor: "pointer",
            fontSize: 20,
            padding: "7px 13px",
            color: "#3b82f6",
            borderRadius: 12,
            fontWeight: 900,
          }}
        >
          ←
        </button>

        <div style={{ display: "flex", gap: 5, alignItems: "center" }}>
          {Array.from({ length: ROUNDS }).map((_, i) => (
            <div
              key={i}
              style={{
                width: i === roundIdx ? 26 : 10,
                height: 10,
                borderRadius: 99,
                background: i < roundIdx ? "#3b82f6" : i === roundIdx ? "#3b82f6" : "#dbeafe",
                transition: "all 0.35s cubic-bezier(.4,0,.2,1)",
              }}
            />
          ))}
        </div>

        <div style={{ flex: 1 }} />

        {streak >= 2 && (
          <div
            style={{
              background: "#fff7ed",
              color: "#ea580c",
              fontWeight: 900,
              fontSize: 17,
              padding: "7px 16px",
              borderRadius: 99,
              border: "2px solid #fed7aa",
            }}
          >
            🔥 ×{streak}
          </div>
        )}

        {/* Show correct answers / total during gameplay — always honest */}
        <div
          style={{
            background: "#eff6ff",
            color: "#3b82f6",
            fontWeight: 900,
            fontSize: 20,
            padding: "7px 18px",
            borderRadius: 99,
            border: "2px solid #bfdbfe",
          }}
        >
          ⭐ {correctAnswers}/{ROUNDS}
        </div>
      </div>

      {/* CHALLENGE BANNER */}
      <div
        style={{
          background:
            status === "correct"
              ? "linear-gradient(90deg, #f0fdf4, #dcfce7)"
              : status === "timeout"
                ? "linear-gradient(90deg, #fef2f2, #fee2e2)"
                : "white",
          borderBottom: "2.5px solid #dbeafe",
          padding: "16px 28px",
          textAlign: "center",
          flexShrink: 0,
          transition: "background 0.3s",
          minHeight: 90,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {status === "correct" ? (
          <div>
            <div style={{ fontSize: 28, fontWeight: 900, color: "#16a34a" }}>
              ✅ Found it! {streak >= 3 ? `🔥 Streak ×${streak} — Bonus point!` : ""}
            </div>
            {showFact && (
              <div style={{ fontSize: 17, color: "#166534", marginTop: 6, fontWeight: 700 }}>
                ✨ {fact}
              </div>
            )}
          </div>
        ) : status === "timeout" ? (
          <div>
            <div style={{ fontSize: 26, fontWeight: 900, color: "#dc2626" }}>
              ⏰ Time's up! Answer:{" "}
              <span style={{ textDecoration: "underline" }}>{currentCountry}</span>
            </div>
            {showFact && (
              <div style={{ fontSize: 17, color: "#991b1b", marginTop: 6, fontWeight: 700 }}>
                ✨ {fact}
              </div>
            )}
          </div>
        ) : (
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 28 }}>
            <div>
              <div
                style={{
                  color: "#94a3b8",
                  fontSize: 15,
                  fontWeight: 800,
                  textTransform: "uppercase",
                  letterSpacing: 1,
                }}
              >
                🔍 Find this country
              </div>
              <div style={{ fontSize: 36, fontWeight: 900, color: "#1e293b", lineHeight: 1.1 }}>
                {currentCountry}
              </div>
            </div>
            {/* Circular timer */}
            <div
              style={{
                width: 64,
                height: 64,
                borderRadius: "50%",
                flexShrink: 0,
                background: `conic-gradient(${timerColor} ${timePct * 3.6}deg, #e2e8f0 0deg)`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                boxShadow: `0 0 0 4px ${timerColor}33`,
              }}
            >
              <div
                style={{
                  width: 48,
                  height: 48,
                  borderRadius: "50%",
                  background: "white",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontWeight: 900,
                  fontSize: 20,
                  color: timerColor,
                }}
              >
                {timeLeft}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* MAP */}
      <div style={{ flex: 1, overflow: "hidden", position: "relative", background: "#dbeafe" }}>
        {hoveredCountry && (
          <div
            style={{
              position: "absolute",
              top: 14,
              left: "50%",
              transform: "translateX(-50%)",
              background: "rgba(15,23,42,0.9)",
              color: "white",
              padding: "9px 22px",
              borderRadius: 99,
              fontSize: 17,
              fontWeight: 900,
              zIndex: 10,
              pointerEvents: "none",
              backdropFilter: "blur(6px)",
              boxShadow: "0 4px 24px #0004",
              whiteSpace: "nowrap",
            }}
          >
            📍 {hoveredCountry}
          </div>
        )}

        <ComposableMap
          projectionConfig={{ scale: 175, center: [10, 5] }}
          style={{ width: "100%", height: "100%", display: "block" }}
        >
          <Geographies geography={GEO_URL}>
            {({ geographies }) =>
              geographies.map((geo: GeographyType) => {
                const geoName = geo.properties.name;
                const normalized = normalizeName(geoName);
                const isTarget = normalized === currentCountry;
                const isWrong = clickedWrong === geoName;
                const isFound = status === "correct" && isTarget;
                const isReveal = status === "timeout" && isTarget;

                let fill = "#93c5fd";
                if (isFound) fill = "#4ade80";
                else if (isWrong) fill = "#f87171";
                else if (isReveal) fill = "#fb923c";

                return (
                  <Geography
                    key={geo.rsmKey}
                    geography={geo}
                    onMouseEnter={() => setHoveredCountry(geoName)}
                    onMouseLeave={() => setHoveredCountry(null)}
                    onClick={() => handleCountryClick(geoName)}
                    style={{
                      default: {
                        fill,
                        stroke: "white",
                        strokeWidth: 0.6,
                        outline: "none",
                        cursor: status === "playing" ? "pointer" : "default",
                        transition: "fill 0.12s",
                      },
                      hover: {
                        fill: isFound || isWrong || isReveal ? fill : "#60a5fa",
                        stroke: "white",
                        strokeWidth: 1,
                        outline: "none",
                        cursor: status === "playing" ? "pointer" : "default",
                      },
                      pressed: { fill: "#2563eb", outline: "none" },
                    }}
                  />
                );
              })
            }
          </Geographies>
        </ComposableMap>
      </div>

      {/* BOTTOM BAR */}
      <div
        style={{
          background: "white",
          borderTop: "2.5px solid #dbeafe",
          padding: "10px 24px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexShrink: 0,
        }}
      >
        <span style={{ fontSize: 16, fontWeight: 900, color: "#475569" }}>
          Round {roundIdx + 1} of {ROUNDS}
        </span>
        <span style={{ fontSize: 14, color: "#94a3b8", fontWeight: 700 }}>
          🌍 Hover to see country names
        </span>
        <span style={{ fontSize: 16, fontWeight: 900, color: "#3b82f6" }}>GeoKids</span>
      </div>
    </div>
  );
}

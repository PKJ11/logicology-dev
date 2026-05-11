"use client";

import NavBar from "@/components/NavBar";
import { useState, useEffect, useRef } from "react";

// ─── Constants ────────────────────────────────────────────────────────────────
const BRAND_TEAL    = "#0A8A80";
const BRAND_TEAL_DK = "#0B3F44";
const RACING        = "'Racing Sans One', cursive";
const OUTFIT        = "'Outfit', sans-serif";

const ROCKET_IMG        = "/Images/speed-maths/SPEED MATHS WEBPAGE IMAGES/PNG RESOURCES/ROCKET@2x.png";
const CLOUDS_IMG        = "/Images/speed-maths/SPEED MATHS WEBPAGE IMAGES/PNG RESOURCES/CLOUDS.png";
const CLOUDS_MOBILE_IMG = "/Images/speed-maths/SPEED MATHS WEBPAGE IMAGES/PNG RESOURCES/cloud_mobile.png";
const PENCIL_IMG        = "/Images/speed-maths/SPEED MATHS WEBPAGE IMAGES/PNG RESOURCES/PENCIL@2x.png";
const SCALE_IMG         = "/Images/speed-maths/SPEED MATHS WEBPAGE IMAGES/PNG RESOURCES/SCALE@2x.png";
const BOOKS_IMG         = "/Images/speed-maths/SPEED MATHS WEBPAGE IMAGES/PNG RESOURCES/BOOKS@2x.png";
const CALC_IMG          = "/Images/speed-maths/SPEED MATHS WEBPAGE IMAGES/PNG RESOURCES/CALCULATOR@2x.png";

const GLOBAL_STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Racing+Sans+One&family=Outfit:wght@400;600;700;900&display=swap');

  @keyframes fadeUp {
    from { opacity: 0; transform: translateY(24px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  @keyframes rocketFlyUp {
    0%   { opacity: 0; transform: translateY(80px) scale(0.7); }
    40%  { opacity: 1; transform: translateY(-10px) scale(1.05); }
    100% { opacity: 1; transform: translateY(0) scale(1); }
  }
  @keyframes rocketHover {
    0%, 100% { transform: translateY(0); }
    50%       { transform: translateY(-10px); }
  }
  @keyframes cardReveal {
    from { opacity: 0; transform: translateY(40px) scale(0.95); }
    to   { opacity: 1; transform: translateY(0) scale(1); }
  }
  @keyframes decoSlideUp {
    from { opacity: 0; transform: translateY(60px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  @keyframes cloudsRise {
    from { opacity: 0; transform: translateY(80px); }
    to   { opacity: 1; transform: translateY(0); }
  }

  .game-card-hover {
    transition: transform 0.28s cubic-bezier(.22,1,.36,1), box-shadow 0.28s ease, border-color 0.28s ease;
  }
  .game-card-hover:hover {
    transform: translateY(-6px) scale(1.015);
    box-shadow: 0 20px 48px rgba(0,0,0,0.35);
    border-color: rgba(255,255,255,0.3) !important;
  }
  .tab-pill-hover {
    transition: all 0.22s ease;
  }
  .tab-pill-hover:hover {
    background: rgba(255,255,255,0.15) !important;
    color: #fff !important;
  }
  .iframe-wrapper iframe {
    display: block;
    width: 100%;
    border: none;
    border-radius: 14px;
    background: #fff;
  }
`;

// ─── Types ────────────────────────────────────────────────────────────────────
type FilterCategory = "all" | "addition" | "subtraction" | "multiplication" | "mixed" | "friends";

interface GameCard {
  id: string;
  title: string;
  category: FilterCategory;
  badgeLabel: string;
  badgeColor: string;
  emoji: string;
  iframeSrc: string;
}

// ─── Game data ────────────────────────────────────────────────────────────────
const GAME_CARDS: GameCard[] = [
  {
    id: "g1",
    title: "Speed Addition Challenge",
    category: "addition",
    badgeLabel: "Addition",
    badgeColor: "#26a9e0",
    emoji: "➕",
    iframeSrc: "https://wordwall.net/embed/play/32103/509/199",
  },
  {
    id: "g2",
    title: "Subtraction Blitz",
    category: "subtraction",
    badgeLabel: "Subtraction",
    badgeColor: "#d93b60",
    emoji: "➖",
    iframeSrc: "https://wordwall.net/embed/play/31980/661/871",
  },
  {
    id: "g3",
    title: "Times Tables Race",
    category: "multiplication",
    badgeLabel: "Multiplication",
    badgeColor: "#84c341",
    emoji: "✖️",
    iframeSrc: "https://wordwall.net/embed/play/31980/549/816",
  },
  {
    id: "g4",
    title: "Maths Mixer",
    category: "mixed",
    badgeLabel: "Mixed",
    badgeColor: "#F5A623",
    emoji: "🔀",
    iframeSrc: "https://wordwall.net/embed/play/31980/419/497",
  },
  {
    id: "g5",
    title: "Quick Fire Addition",
    category: "addition",
    badgeLabel: "Addition",
    badgeColor: "#26a9e0",
    emoji: "⚡",
    iframeSrc: "https://wordwall.net/embed/play/31980/303/737",
  },
  {
    id: "g6",
    title: "Multiply Mayhem",
    category: "multiplication",
    badgeLabel: "Multiplication",
    badgeColor: "#84c341",
    emoji: "🏆",
    iframeSrc: "https://wordwall.net/embed/play/31980/285/313",
  },
  {
    id: "g7",
    title: "Ultimate Maths Challenge",
    category: "mixed",
    badgeLabel: "Challenge",
    badgeColor: "#7784c1",
    emoji: "🚀",
    iframeSrc: "https://wordwall.net/embed/play/31980/241/226",
  },
];

const FILTER_TABS: { label: string; value: FilterCategory; emoji: string }[] = [
  { label: "All Games",       value: "all",            emoji: "🎮" },
  { label: "Addition",        value: "addition",       emoji: "➕" },
  { label: "Subtraction",     value: "subtraction",    emoji: "➖" },
  { label: "Multiplication",  value: "multiplication", emoji: "✖️" },
  { label: "Mixed",           value: "mixed",          emoji: "🔀" },
];

const MATH_SYMBOLS = [
  { t: "4²",  style: { top: "9%",  left: "5%",   fontSize: 30 } },
  { t: "√",   style: { top: "19%", left: "11%",  fontSize: 38 } },
  { t: "1",   style: { top: "53%", left: "4%",   fontSize: 52 } },
  { t: "Z",   style: { top: "69%", left: "8%",   fontSize: 26 } },
  { t: "α²",  style: { top: "8%",  right: "7%",  fontSize: 28 } },
  { t: "4²",  style: { top: "23%", right: "4%",  fontSize: 34 } },
  { t: "⬡",   style: { top: "40%", left: "2%",   fontSize: 26 } },
  { t: "⬡",   style: { top: "14%", right: "19%", fontSize: 20 } },
  { t: "≈",   style: { top: "59%", right: "5%",  fontSize: 30 } },
  { t: "÷",   style: { top: "75%", left: "15%",  fontSize: 24 } },
  { t: "∑",   style: { top: "82%", right: "12%", fontSize: 28 } },
];

// ─── Sub-components ───────────────────────────────────────────────────────────

function FloatingSymbols() {
  return (
    <>
      {MATH_SYMBOLS.map((sym, i) => (
        <span
          key={i}
          aria-hidden
          className="absolute select-none pointer-events-none font-bold text-white"
          style={{ ...sym.style, opacity: 0.12, fontFamily: RACING, position: "fixed", zIndex: 0 }}
        >
          {sym.t}
        </span>
      ))}
    </>
  );
}

function GameCardItem({ card, index }: { card: GameCard; index: number }) {
  return (
    <div
      className="game-card-hover"
      style={{
        background: "rgba(255,255,255,0.06)",
        border: "2px solid rgba(255,255,255,0.12)",
        borderRadius: 24,
        overflow: "hidden",
        backdropFilter: "blur(8px)",
        animation: `cardReveal 0.6s cubic-bezier(.22,1,.36,1) ${0.3 + index * 0.08}s both`,
      }}
    >
      {/* Card Header */}
      <div
        style={{
          padding: "14px 18px 10px",
          display: "flex",
          alignItems: "center",
          gap: 10,
          borderBottom: "1px solid rgba(255,255,255,0.08)",
        }}
      >
        <span
          style={{
            fontFamily: OUTFIT,
            fontWeight: 700,
            fontSize: "0.72rem",
            letterSpacing: "0.06em",
            padding: "5px 12px",
            borderRadius: 99,
            background: card.badgeColor,
            color: "#fff",
            flexShrink: 0,
          }}
        >
          {card.badgeLabel}
        </span>
        <span
          style={{
            fontFamily: RACING,
            fontSize: "1rem",
            color: "#fff",
            letterSpacing: "0.04em",
            flex: 1,
          }}
        >
          {card.title}
        </span>
        <span style={{ fontSize: "1.25rem" }}>{card.emoji}</span>
      </div>

      {/* Iframe */}
      <div className="iframe-wrapper" style={{ padding: 14 }}>
        <iframe
          src={card.iframeSrc}
          allowFullScreen
          title={card.title}
          style={{ height: 380, width: "100%", border: "none", borderRadius: 14, background: "#fff", display: "block" }}
        />
      </div>
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function SpeedMathsGamesPage() {
  const [activeFilter, setActiveFilter] = useState<FilterCategory>("all");
  const [heroVisible,  setHeroVisible]  = useState(false);
  const [rocketVisible, setRocketVisible] = useState(false);
  const [cardsVisible,  setCardsVisible]  = useState(false);
  const [decoVisible,   setDecoVisible]   = useState(false);
  const [cloudsVisible, setCloudsVisible] = useState(false);
  const [isMobile,      setIsMobile]      = useState(false);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  useEffect(() => {
    const t1 = setTimeout(() => setHeroVisible(true),  80);
    const t2 = setTimeout(() => setRocketVisible(true), 180);
    const t3 = setTimeout(() => setCardsVisible(true),  300);
    const t4 = setTimeout(() => setDecoVisible(true),   500);
    const t5 = setTimeout(() => setCloudsVisible(true), 650);
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); clearTimeout(t4); clearTimeout(t5); };
  }, []);

  const filteredCards = activeFilter === "all"
    ? GAME_CARDS
    : GAME_CARDS.filter((c) => c.category === activeFilter);

  const cloudSrc = isMobile ? CLOUDS_MOBILE_IMG : CLOUDS_IMG;

  return (
    <>
      <NavBar />
      <style>{GLOBAL_STYLES}</style>

      <div
        className="min-h-screen flex flex-col overflow-x-hidden"
        style={{
          background: "#1b4552",
          fontFamily: OUTFIT,
          backgroundImage: `
            linear-gradient(rgba(255,255,255,0.045) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.045) 1px, transparent 1px),
            linear-gradient(rgba(255,255,255,0.018) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.018) 1px, transparent 1px)
          `,
          backgroundSize: "80px 80px, 80px 80px, 20px 20px, 20px 20px",
        }}
      >
        {/* ── Floating Math Symbols ── */}
        <FloatingSymbols />

        {/* ── Hero ── */}
        <section className="relative z-10 overflow-hidden">

          {/* Rocket */}
          <div
            className="absolute pointer-events-none z-20"
            style={{
              top: isMobile ? "8%" : "clamp(40px, 10vh, 80px)",
              right: isMobile ? "4%" : "clamp(16px, 4vw, 60px)",
              width: isMobile ? "18vw" : "clamp(110px, 16vw, 210px)",
              maxWidth: isMobile ? 80 : 210,
              opacity: rocketVisible ? 1 : 0,
              animation: rocketVisible
                ? "rocketFlyUp 1.2s cubic-bezier(0.34,1.2,0.55,1) forwards, rocketHover 3s ease-in-out 1.2s infinite"
                : "none",
            }}
          >
            <img
              src={ROCKET_IMG}
              alt="Rocket"
              style={{ width: "100%", height: "auto", filter: "drop-shadow(0 12px 28px rgba(0,0,0,0.38))" }}
            />
          </div>

          {/* Hero text */}
          <div
            className="relative z-10 text-center px-6"
            style={{
              paddingTop: isMobile ? "5vh" : "6vh",
              paddingBottom: isMobile ? "2vh" : "3vh",
              opacity: heroVisible ? 1 : 0,
              transform: heroVisible ? "translateY(0)" : "translateY(-24px)",
              transition: "opacity 0.75s ease 0.1s, transform 0.75s ease 0.1s",
            }}
          >
            <h1
              className="text-white leading-none mb-2"
              style={{
                fontFamily: RACING,
                fontSize: "clamp(2.4rem, 6.5vw, 4.8rem)",
                textShadow: "0 4px 18px rgba(0,0,0,0.28)",
                letterSpacing: "0.02em",
              }}
            >
              Speed Maths Games ⚡
            </h1>
            <p
              className="text-white/80"
              style={{ fontFamily: OUTFIT, fontWeight: 600, fontSize: "clamp(0.95rem, 2vw, 1.2rem)" }}
            >
              Practice your skills with these interactive games!
            </p>
          </div>

          {/* Clouds overlay at bottom of hero */}
          {/* <div
            className="relative w-full pointer-events-none select-none"
            style={{
              height: isMobile ? 80 : 110,
              opacity: cloudsVisible ? 1 : 0,
              transform: cloudsVisible ? "translateY(0)" : "translateY(60px)",
              transition: "opacity 0.9s ease 0.65s, transform 0.9s cubic-bezier(.22,1,.36,1) 0.65s",
              marginBottom: -2,
            }}
          >
            <img
              src={cloudSrc}
              alt=""
              style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "center bottom", display: "block" }}
            />
          </div> */}
        </section>

        {/* ── Games Section ── */}
        <section
          className="relative z-10 flex-1"
          style={{ padding: isMobile ? "24px 16px 60px" : "32px 32px 80px" }}
        >

          {/* Section label */}
          <div
            className="text-center mb-2"
            style={{
              opacity: cardsVisible ? 1 : 0,
              transform: cardsVisible ? "translateY(0)" : "translateY(20px)",
              transition: "opacity 0.6s ease 0.3s, transform 0.6s ease 0.3s",
            }}
          >
            <p style={{ fontFamily: RACING, fontSize: "clamp(1.3rem,3vw,1.7rem)", color: "rgba(255,255,255,0.9)", letterSpacing: "0.05em" }}>
              🎮 Play &amp; Practice
            </p>
            <p style={{ fontFamily: OUTFIT, fontWeight: 600, fontSize: "0.88rem", color: "rgba(255,255,255,0.45)", marginTop: 4 }}>
              Pick a game below — sharpen your mental maths!
            </p>
          </div>

          {/* Filter tabs */}
          <div
            className="flex flex-wrap gap-2 justify-center mb-8"
            style={{
              marginTop: 20,
              opacity: cardsVisible ? 1 : 0,
              transform: cardsVisible ? "translateY(0)" : "translateY(16px)",
              transition: "opacity 0.6s ease 0.38s, transform 0.6s ease 0.38s",
            }}
          >
            {FILTER_TABS.map((tab) => {
              const isActive = activeFilter === tab.value;
              return (
                <button
                  key={tab.value}
                  className="tab-pill-hover"
                  onClick={() => setActiveFilter(tab.value)}
                  style={{
                    fontFamily: RACING,
                    fontSize: "0.82rem",
                    letterSpacing: "0.05em",
                    padding: "9px 20px",
                    borderRadius: 99,
                    border: isActive ? `2.5px solid ${BRAND_TEAL}` : "2.5px solid rgba(255,255,255,0.18)",
                    color: isActive ? "#fff" : "rgba(255,255,255,0.6)",
                    background: isActive ? BRAND_TEAL : "rgba(255,255,255,0.06)",
                    cursor: "pointer",
                    boxShadow: isActive ? `0 4px 18px ${BRAND_TEAL}55` : "none",
                  }}
                >
                  {tab.emoji} {tab.label}
                </button>
              );
            })}
          </div>

          {/* Game grid */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(min(100%, 460px), 1fr))",
              gap: 28,
              maxWidth: 1240,
              margin: "0 auto",
            }}
          >
            {filteredCards.map((card, i) => (
              <GameCardItem key={card.id} card={card} index={i} />
            ))}
          </div>

          {filteredCards.length === 0 && (
            <div className="text-center mt-20" style={{ color: "rgba(255,255,255,0.4)", fontFamily: OUTFIT, fontWeight: 600 }}>
              No games found for this category.
            </div>
          )}
        </section>

        {/* ── Bottom decorative strip ── */}
        <div
          className="relative z-20 pointer-events-none select-none flex items-end justify-between"
          style={{
            padding: isMobile ? "0 8px 4px" : "0 64px 16px",
            opacity: decoVisible ? 1 : 0,
            transition: "opacity 0.6s ease 0.9s",
          }}
        >
          <div
            style={{
              transform: decoVisible ? "rotate(-20deg) translateY(0)" : "rotate(-20deg) translateY(60px)",
              transition: "transform 0.6s ease 1.0s",
              transformOrigin: "bottom left",
            }}
          >
            <img
              src={PENCIL_IMG}
              alt=""
              style={{ height: isMobile ? 70 : 100, width: "auto", objectFit: "contain", filter: "drop-shadow(0 4px 8px rgba(0,0,0,0.2))" }}
            />
          </div>

          {!isMobile && (
            <div
              style={{
                transform: decoVisible ? "rotate(-8deg) translateY(0)" : "rotate(-8deg) translateY(60px)",
                transition: "transform 0.6s ease 1.1s",
              }}
            >
              <img src={SCALE_IMG} alt="" style={{ height: 80, width: "auto", objectFit: "contain", filter: "drop-shadow(0 4px 8px rgba(0,0,0,0.2))" }} />
            </div>
          )}

          {!isMobile && (
            <div
              style={{
                transform: decoVisible ? "translateY(0)" : "translateY(60px)",
                transition: "transform 0.6s ease 1.15s",
              }}
            >
              <img src={BOOKS_IMG} alt="" style={{ height: 100, width: "auto", objectFit: "contain", filter: "drop-shadow(0 4px 8px rgba(0,0,0,0.2))" }} />
            </div>
          )}

          <div className="flex flex-col items-end">
            <div
              style={{
                fontFamily: RACING,
                fontSize: isMobile ? "clamp(1.3rem,6vw,1.8rem)" : "clamp(1.6rem,3vw,2.2rem)",
                color: "#ffffff",
                textShadow: "0 2px 8px rgba(0,0,0,0.4)",
                marginBottom: 2,
                paddingRight: 6,
                transform: decoVisible ? "translateY(0)" : "translateY(30px)",
                transition: "transform 0.6s ease 1.2s",
              }}
            >
              96×7
            </div>
            <div
              style={{
                transform: decoVisible ? "translateY(0)" : "translateY(40px)",
                transition: "transform 0.6s ease 1.25s",
              }}
            >
              <img
                src={CALC_IMG}
                alt=""
                style={{ height: isMobile ? 70 : 90, width: "auto", objectFit: "contain", filter: "drop-shadow(0 4px 8px rgba(0,0,0,0.2))" }}
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
} 
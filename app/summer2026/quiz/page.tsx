"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import NavBar from "@/components/NavBar";
import SiteFooter from "@/components/Footer";

// ── Scroll animation hook ──────────────────────────────────────────────────────
function useReveal() {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setVisible(true);
          obs.disconnect();
        }
      },
      { threshold: 0.12 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);
  return { ref, visible };
}

// ── Hero ──────────────────────────────────────────────────────────────────────
function HeroSection() {
  return (
    <section
      style={{
        minHeight: "52vh",
        background: "#0A8A80",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        position: "relative",
        overflow: "hidden",
        paddingTop: 80,
      }}
    >
      {/* Background blobs */}
      <div
        style={{
          position: "absolute",
          top: -120,
          right: -120,
          width: 500,
          height: 500,
          borderRadius: "50%",
          background: "rgba(216,174,79,0.12)",
          filter: "blur(60px)",
        }}
      />
      <div
        style={{
          position: "absolute",
          bottom: -80,
          left: -80,
          width: 400,
          height: 400,
          borderRadius: "50%",
          background: "rgba(228,92,72,0.10)",
          filter: "blur(60px)",
        }}
      />

      {/* Floating dots */}
      {[
        { top: "20%", left: "8%", size: 12, color: "#D8AE4F", delay: "0s" },
        { top: "70%", left: "5%", size: 8, color: "#E45C48", delay: "0.4s" },
        { top: "15%", right: "10%", size: 16, color: "#D8AE4F", delay: "0.8s" },
        { top: "80%", right: "8%", size: 10, color: "#E45C48", delay: "0.2s" },
        { top: "50%", left: "15%", size: 6, color: "#ffffff", delay: "1.2s" },
      ].map((d, i) => (
        <div
          key={i}
          style={{
            position: "absolute",
            top: d.top,
            left: d.left,
            right: d.right,
            width: d.size,
            height: d.size,
            borderRadius: "50%",
            background: d.color,
            opacity: 0.7,
            animation: `float 4s ease-in-out ${d.delay} infinite`,
          }}
        />
      ))}

      <div
        style={{
          maxWidth: 760,
          margin: "0 auto",
          padding: "80px 24px 64px",
          textAlign: "center",
          position: "relative",
          zIndex: 1,
        }}
      >
        <div
          style={{
            display: "inline-block",
            background: "rgba(255,255,255,0.82)",
            border: "1px solid rgba(216,174,79,0.5)",
            borderRadius: 100,
            padding: "6px 20px",
            marginBottom: 28,
            fontFamily: "'Outfit', sans-serif",
            fontSize: 13,
            fontWeight: 600,
            letterSpacing: "0.08em",
            textTransform: "uppercase",
            color: "#0B3F44",
          }}
        >
          Summer 2026 · Brain Games
        </div>
        <h1
          style={{
            color: "#ffffff",
            margin: "0 0 24px",
            fontFamily: "'Outfit', sans-serif",
            fontWeight: 800,
            fontSize: "clamp(32px, 5vw, 52px)",
            lineHeight: 1.15,
          }}
        >
          Warm Up Your Brain
          <br />
          <span style={{ color: "#D8AE4F" }}>Before the Workshop!</span>
        </h1>
        <p
          style={{
            color: "rgba(255,255,255,0.82)",
            maxWidth: 560,
            margin: "0 auto",
            lineHeight: 1.75,
            fontFamily: "'Outfit', sans-serif",
            fontSize: 18,
          }}
        >
          Play these fun logic and quiz games designed to get your child's mind thinking. Perfect
          preparation for the Logicology Summer Workshop.
        </p>

        {/* Stats row */}
        <div
          style={{
            display: "flex",
            gap: 48,
            justifyContent: "center",
            flexWrap: "wrap",
            marginTop: 56,
            paddingTop: 40,
            borderTop: "1px solid rgba(255,255,255,0.15)",
          }}
        >
          {[
            { num: "3", label: "Brain Games" },
            { num: "∞", label: "Plays" },
            { num: "6–14", label: "Age Range" },
          ].map((s) => (
            <div key={s.label} style={{ textAlign: "center" }}>
              <div
                style={{
                  fontFamily: "'Outfit', sans-serif",
                  fontWeight: 800,
                  fontSize: 32,
                  color: "#D8AE4F",
                }}
              >
                {s.num}
              </div>
              <div
                style={{
                  fontFamily: "'Outfit', sans-serif",
                  fontSize: 13,
                  fontWeight: 500,
                  color: "rgba(255,255,255,0.65)",
                  marginTop: 4,
                }}
              >
                {s.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ── Game Card ─────────────────────────────────────────────────────────────────
function GameCard({ game, index }: { game: any; index: number }) {
  const { ref, visible } = useReveal();

  // Check if this is the GeoKids game that should navigate to a separate page
  const isGeoKidsPage = game.title === "GeoKids" && game.navigateTo;

  return (
    <div
      ref={ref}
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(48px)",
        transition: `all 0.75s ease ${index * 180}ms`,
      }}
    >
      <div
        style={{
          background: "#fff",
          borderRadius: 24,
          overflow: "hidden",
          boxShadow: "0 8px 48px rgba(11,63,68,0.12)",
          border: "1.5px solid rgba(10,138,128,0.10)",
          position: "relative",
        }}
      >
        {/* Top accent bar */}
        <div
          style={{
            height: 5,
            background: `linear-gradient(90deg, ${game.color}, ${game.colorEnd})`,
          }}
        />

        {/* Card header */}
        <div
          style={{
            padding: "28px 32px 20px",
            display: "flex",
            alignItems: "flex-start",
            gap: 18,
          }}
        >
          <div
            style={{
              width: 52,
              height: 52,
              borderRadius: 14,
              background: `${game.color}15`,
              border: `1.5px solid ${game.color}30`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 26,
              flexShrink: 0,
            }}
          >
            {game.emoji}
          </div>
          <div style={{ flex: 1 }}>
            <div
              style={{
                display: "inline-block",
                background: `${game.color}15`,
                border: `1px solid ${game.color}30`,
                borderRadius: 100,
                padding: "3px 12px",
                fontFamily: "'Outfit', sans-serif",
                fontSize: 11,
                fontWeight: 700,
                color: game.color,
                letterSpacing: "0.08em",
                textTransform: "uppercase",
                marginBottom: 8,
              }}
            >
              {game.tag}
            </div>
            <h3
              style={{
                fontFamily: "'Outfit', sans-serif",
                fontWeight: 800,
                fontSize: 22,
                color: "#0B3F44",
                margin: "0 0 6px",
                lineHeight: 1.2,
              }}
            >
              {game.title}
            </h3>
            <p
              style={{
                fontFamily: "'Outfit', sans-serif",
                fontSize: 14,
                color: "#777",
                margin: 0,
                lineHeight: 1.6,
              }}
            >
              {game.desc}
            </p>
          </div>
        </div>

        {/* Game frame area */}
        <div style={{ padding: "0 32px 32px" }}>
          {isGeoKidsPage ? (
            /* Link to separate GeoKids page */
            <Link href={game.navigateTo} target="_blank" style={{ textDecoration: "none" }}>
              <div
                style={{
                  background: `linear-gradient(135deg, ${game.color}10, ${game.colorEnd}18)`,
                  border: `2px dashed ${game.color}30`,
                  borderRadius: 16,
                  height: 280,
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 16,
                  cursor: "pointer",
                  transition: "all 0.3s ease",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = `linear-gradient(135deg, ${game.color}18, ${game.colorEnd}28)`;
                  e.currentTarget.style.borderColor = `${game.color}55`;
                  e.currentTarget.style.transform = "scale(1.01)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = `linear-gradient(135deg, ${game.color}10, ${game.colorEnd}18)`;
                  e.currentTarget.style.borderColor = `${game.color}30`;
                  e.currentTarget.style.transform = "scale(1)";
                }}
              >
                <div
                  style={{
                    width: 72,
                    height: 72,
                    borderRadius: "50%",
                    background: game.color,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: 28,
                    boxShadow: `0 8px 28px ${game.color}50`,
                    transition: "transform 0.2s",
                  }}
                >
                  ▶
                </div>
                <div style={{ textAlign: "center" }}>
                  <div
                    style={{
                      fontFamily: "'Outfit', sans-serif",
                      fontWeight: 700,
                      fontSize: 17,
                      color: "#0B3F44",
                      marginBottom: 4,
                    }}
                  >
                    Click to Play
                  </div>
                  <div
                    style={{
                      fontFamily: "'Outfit', sans-serif",
                      fontSize: 13,
                      color: "#888",
                    }}
                  >
                    Opens in new tab
                  </div>
                </div>
              </div>
            </Link>
          ) : (
            /* Thumbnail with iframe for other games */
            <div
              style={{
                background: `linear-gradient(135deg, ${game.color}10, ${game.colorEnd}18)`,
                border: `2px dashed ${game.color}30`,
                borderRadius: 16,
                height: 280,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                gap: 16,
                cursor: "pointer",
                transition: "all 0.3s ease",
              }}
              onClick={() => window.open(game.src, "_blank")}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = `linear-gradient(135deg, ${game.color}18, ${game.colorEnd}28)`;
                e.currentTarget.style.borderColor = `${game.color}55`;
                e.currentTarget.style.transform = "scale(1.01)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = `linear-gradient(135deg, ${game.color}10, ${game.colorEnd}18)`;
                e.currentTarget.style.borderColor = `${game.color}30`;
                e.currentTarget.style.transform = "scale(1)";
              }}
            >
              <div
                style={{
                  width: 72,
                  height: 72,
                  borderRadius: "50%",
                  background: game.color,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 28,
                  boxShadow: `0 8px 28px ${game.color}50`,
                  transition: "transform 0.2s",
                }}
              >
                ▶
              </div>
              <div style={{ textAlign: "center" }}>
                <div
                  style={{
                    fontFamily: "'Outfit', sans-serif",
                    fontWeight: 700,
                    fontSize: 17,
                    color: "#0B3F44",
                    marginBottom: 4,
                  }}
                >
                  Click to Play
                </div>
                <div
                  style={{
                    fontFamily: "'Outfit', sans-serif",
                    fontSize: 13,
                    color: "#888",
                  }}
                >
                  Interactive game will load here
                </div>
              </div>
            </div>
          )}

          {/* Metadata chips */}
          <div
            style={{
              display: "flex",
              gap: 10,
              marginTop: 18,
              flexWrap: "wrap",
            }}
          >
            {game.chips.map((chip: any) => (
              <span
                key={chip}
                style={{
                  fontFamily: "'Outfit', sans-serif",
                  fontSize: 12,
                  fontWeight: 600,
                  color: "#666",
                  background: "#F5F6F7",
                  borderRadius: 100,
                  padding: "5px 14px",
                  border: "1px solid rgba(0,0,0,0.06)",
                }}
              >
                {chip}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Games Data ─────────────────────────────────────────────────────────────────
const GAMES = [
  {
    title: "GeoKids",
    tag: "Geography Game",
    emoji: "🌍",
    desc: "Click the right country on the map! Learn geography while having fun with this interactive world map game.",
    src: "", // Not needed for navigation
    navigateTo: "/GeoKids", // Navigates to local GeoKids page
    color: "#0A8A80",
    colorEnd: "#0B3F44",
    chips: ["Ages 6–14", "Geography", "World Map", "Quiz"],
  },
  {
    title: "Logic Quiz Challenge",
    tag: "Quiz Game",
    emoji: "🧠",
    desc: "Test your knowledge with this fun interactive quiz. How many can you get right?",
    src: "https://wordwall.net/embed/play/19006/661/636",
    color: "#0A8A80",
    colorEnd: "#0B3F44",
    chips: ["Ages 6–14", "Quiz", "Multiple Rounds"],
  },
  {
    title: "Word & Logic Puzzles",
    tag: "Puzzle Game",
    emoji: "🔡",
    desc: "Sharpen your reasoning with word-based logic puzzles — great for building vocabulary and critical thinking.",
    src: "https://wordwall.net/embed/play/12049/049/726",
    color: "#E45C48",
    colorEnd: "#AB4637",
    chips: ["Ages 6–14", "Logic", "Wordplay"],
  },
];

// ── CTA Strip ─────────────────────────────────────────────────────────────────
function CTAStrip() {
  const { ref, visible } = useReveal();
  return (
    <section
      style={{
        background: "#E45C48",
        padding: "80px 24px",
        position: "relative",
        overflow: "hidden",
      }}
    >
      <div
        style={{
          position: "absolute",
          top: -80,
          right: -80,
          width: 320,
          height: 320,
          borderRadius: "50%",
          background: "rgba(255,255,255,0.07)",
          filter: "blur(60px)",
        }}
      />
      <div
        ref={ref}
        style={{
          maxWidth: 720,
          margin: "0 auto",
          textAlign: "center",
          position: "relative",
          zIndex: 1,
          opacity: visible ? 1 : 0,
          transform: visible ? "translateY(0)" : "translateY(32px)",
          transition: "all 0.7s ease",
        }}
      >
        <h2
          style={{
            fontFamily: "'Outfit', sans-serif",
            fontWeight: 800,
            fontSize: "clamp(26px, 4vw, 42px)",
            color: "#fff",
            margin: "0 0 16px",
            lineHeight: 1.2,
          }}
        >
          Enjoyed the Games?
          <br />
          <span style={{ color: "rgba(255,255,255,0.82)" }}>Join the Full Summer Workshop!</span>
        </h2>
        <p
          style={{
            fontFamily: "'Outfit', sans-serif",
            fontSize: 17,
            color: "rgba(255,255,255,0.85)",
            margin: "0 0 40px",
            lineHeight: 1.7,
          }}
        >
          These games are just a taste. At Logicology Summer Workshop, your child gets 5 days of
          structured, hands-on learning in logical reasoning, critical thinking & more.
        </p>
        <a
          href="/summer2026#enroll"
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 8,
            background: "#fff",
            color: "#AB4637",
            padding: "16px 36px",
            borderRadius: 100,
            fontFamily: "'Outfit', sans-serif",
            fontWeight: 700,
            fontSize: 17,
            textDecoration: "none",
            boxShadow: "0 8px 32px rgba(0,0,0,0.15)",
            transition: "all 0.2s ease",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = "#0B3F44";
            e.currentTarget.style.color = "#fff";
            e.currentTarget.style.transform = "translateY(-2px)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = "#fff";
            e.currentTarget.style.color = "#AB4637";
            e.currentTarget.style.transform = "translateY(0)";
          }}
        >
          Enroll Now →
        </a>
      </div>
    </section>
  );
}

// ── Games Section ─────────────────────────────────────────────────────────────
function GamesSection() {
  const { ref, visible } = useReveal();
  return (
    <section
      style={{
        background: "#F5F6F7",
        padding: "100px 24px",
        position: "relative",
      }}
    >
      {/* subtle teal wash */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: 8,
          background: "linear-gradient(90deg, #0A8A80, #D8AE4F, #E45C48)",
        }}
      />

      <div style={{ maxWidth: 960, margin: "0 auto" }}>
        {/* Section heading */}
        <div
          ref={ref}
          style={{
            textAlign: "center",
            marginBottom: 64,
            opacity: visible ? 1 : 0,
            transform: visible ? "translateY(0)" : "translateY(32px)",
            transition: "all 0.7s ease",
          }}
        >
          <div
            style={{
              display: "inline-block",
              background: "rgba(10,138,128,0.10)",
              border: "1px solid rgba(10,138,128,0.25)",
              borderRadius: 100,
              padding: "5px 18px",
              marginBottom: 20,
              fontFamily: "'Outfit', sans-serif",
              fontSize: 14,
              fontWeight: 700,
              color: "#0A8A80",
              letterSpacing: "0.10em",
              textTransform: "uppercase",
            }}
          >
            Play & Learn
          </div>
          <h2
            style={{
              fontFamily: "'Outfit', sans-serif",
              fontWeight: 800,
              fontSize: "clamp(28px, 4vw, 44px)",
              color: "#0B3F44",
              margin: "0 0 16px",
              lineHeight: 1.2,
            }}
          >
            3 Games. Infinite Fun.
          </h2>
          <p
            style={{
              fontFamily: "'Outfit', sans-serif",
              fontSize: 17,
              color: "#666",
              maxWidth: 520,
              margin: "0 auto",
              lineHeight: 1.7,
            }}
          >
            Click any game below to launch it. Challenge your friends — who scores higher?
          </p>
        </div>

        {/* Game cards */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(340px, 1fr))",
            gap: 28,
          }}
        >
          {GAMES.map((game, i) => (
            <GameCard key={game.title} game={game} index={i} />
          ))}
        </div>

        {/* Tip box */}
        <div
          style={{
            marginTop: 48,
            background: "rgba(10,138,128,0.07)",
            border: "1.5px solid rgba(10,138,128,0.18)",
            borderRadius: 16,
            padding: "20px 28px",
            display: "flex",
            alignItems: "center",
            gap: 16,
            flexWrap: "wrap",
          }}
        >
          <span style={{ fontSize: 28 }}>💡</span>
          <div>
            <div
              style={{
                fontFamily: "'Outfit', sans-serif",
                fontWeight: 700,
                fontSize: 15,
                color: "#0B3F44",
                marginBottom: 2,
              }}
            >
              Pro Tip
            </div>
            <div
              style={{
                fontFamily: "'Outfit', sans-serif",
                fontSize: 14,
                color: "#555",
                lineHeight: 1.6,
              }}
            >
              Play all three games before the workshop to warm up your brain. Children who play
              first tend to pick up workshop concepts faster!
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// ── Main Page ─────────────────────────────────────────────────────────────────
export default function SummerQuizPage() {
  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700;800&display=swap');
        * { box-sizing: border-box; }
        html { scroll-behavior: smooth; }
        body { margin: 0; font-family: 'Outfit', sans-serif; }
        @keyframes float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-12px); }
        }
      `}</style>
      <NavBar />
      <HeroSection />
      <GamesSection />
      <CTAStrip />
      <SiteFooter />
    </>
  );
}

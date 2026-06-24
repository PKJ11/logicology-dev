"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";

// ─── Icon Components ───────────────────────────────────────────────────────────

function ResearchIcon() {
  return (
    <div style={{ color: "#3d3b40" }}>
      <Image
        src="https://ik.imagekit.io/pratik11/WHY%20LOGICOLOGY%20SECTION%20NEW%20WITH%20ICONS%20COLOR/WHY%20LOGICOLOGY%20SECTION%20NEW%20WITH%20ICONS%20COLOR/research.svg"
        alt="Research icon"
        width={40}
        height={40}
        style={{ color: "#3d3b40" }}
      />
    </div>
  );
}

function ConceptIcon() {
  return (
    <div style={{ color: "#3d3b40" }}>
      <Image
        src="https://ik.imagekit.io/pratik11/WHY%20LOGICOLOGY%20SECTION%20NEW%20WITH%20ICONS%20COLOR/WHY%20LOGICOLOGY%20SECTION%20NEW%20WITH%20ICONS%20COLOR/concept.svg"
        alt="Concept icon"
        width={40}
        height={40}
        style={{ color: "#3d3b40" }}
      />
    </div>
  );
}

function WinIcon() {
  return (
    <div style={{ color: "#3d3b40" }}>
      <Image
        src="https://ik.imagekit.io/pratik11/WHY%20LOGICOLOGY%20SECTION%20NEW%20WITH%20ICONS%20COLOR/WHY%20LOGICOLOGY%20SECTION%20NEW%20WITH%20ICONS%20COLOR/win.svg"
        alt="Win icon"
        width={40}
        height={40}
        style={{ color: "#3d3b40" }}
      />
    </div>
  );
}

function SkillIcon() {
  return (
    <div style={{ color: "#3d3b40" }}>
      <Image
        src="https://ik.imagekit.io/pratik11/WHY%20LOGICOLOGY%20SECTION%20NEW%20WITH%20ICONS%20COLOR/WHY%20LOGICOLOGY%20SECTION%20NEW%20WITH%20ICONS%20COLOR/skill.svg"
        alt="Skill icon"
        width={40}
        height={40}
        style={{ color: "#3d3b40" }}
      />
    </div>
  );
}

// ─── Card Data ─────────────────────────────────────────────────────────────────

const cards = [
  {
    id: 1,
    icon: <ResearchIcon />,
    title: (
      <>
        Researched, not <br /> rebranded
      </>
    ),
    body: "Every concept tested until a child can start solo. Shows them that they are important.",
    side: "left",
  },
  {
    id: 2,
    icon: <ConceptIcon />,
    title: "Concept-first",
    body: (
      <>
        The learning is the foundation, not a label <br /> on the box.
      </>
    ),
    side: "right",
  },
  {
    id: 3,
    icon: <WinIcon />,
    title: "Small wins, built in",
    body: "Kids win early and often, so they keep going.",
    side: "left",
  },
  {
    id: 4,
    icon: <SkillIcon />,
    title: (
      <>
        Skills that outlast <br /> the screen
      </>
    ),
    body: "Reasoning, number sense, problem-solving.",
    side: "right",
  },
];

// ─── Card Component ────────────────────────────────────────────────────────────

function TrustCard({
  icon,
  title,
  body,
  visible,
  delay,
  side,
}: {
  icon: React.ReactNode;
  title: React.ReactNode;
  body: React.ReactNode;
  visible: boolean;
  delay: number;
  side: "left" | "right";
}) {
  return (
    <div
      className="w-full overflow-hidden rounded-2xl bg-white shadow-md"
      style={{
        opacity: visible ? 1 : 0,
        transform: visible
          ? "translateX(0) translateY(0)"
          : side === "left"
            ? "translateX(-48px) translateY(20px)"
            : "translateX(48px) translateY(20px)",
        transition: `opacity 0.55s ease ${delay}ms, transform 0.55s ease ${delay}ms`,
      }}
    >
      {/* Yellow header bar */}
      <div
        className="mx-3 mt-3 flex items-center justify-center gap-3 rounded-xl px-4 py-3"
        style={{ backgroundColor: "#fbb041" }}
      >
        <div className="shrink-0 text-[#3d3b40]">{icon}</div>
        <h3 className="text-left font-heading text-[24px] font-bold leading-snug text-[#3d3b40]">
          {title}
        </h3>
      </div>

      {/* Body text */}
      <p className="px-5 py-4 text-center font-sans leading-relaxed text-gray-700">{body}</p>
    </div>
  );
}

// ─── Main Section ──────────────────────────────────────────────────────────────

export default function WhyImportant() {
  const sectionRef = useRef<HTMLElement>(null);
  const [triggered, setTriggered] = useState(false);

  // Randomise the order in which the 4 cards reveal (computed once on mount)
  const [cardOrder] = useState<number[]>(() => {
    const order = [0, 1, 2, 3];
    for (let i = order.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [order[i], order[j]] = [order[j], order[i]];
    }
    return order;
  });

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setTriggered(true);
        } else {
          setTriggered(false); // ← reset when section leaves viewport
        }
      },
      { threshold: 0.15 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  // Timing constants (ms)
  const HEADING_DELAY = 0;
  const IMAGE_DELAY = 300;
  // Each card gets its own delay based on its random reveal position
  // Cards start appearing after the image begins its animation
  const CARD_BASE_DELAY = 500;
  const CARD_STAGGER = 150;

  // Build a map: cardId → delay
  const cardDelayMap: Record<number, number> = {};
  cards.forEach((card) => {
    const position = cardOrder.indexOf(cards.indexOf(card));
    cardDelayMap[card.id] = CARD_BASE_DELAY + position * CARD_STAGGER;
  });

  const leftCards = cards.filter((c) => c.side === "left");
  const rightCards = cards.filter((c) => c.side === "right");

  return (
    <section
      ref={sectionRef}
      className="relative w-full overflow-hidden bg-brand-coral px-4 pt-16 md:px-8"
    >
      <div className="relative mx-auto max-w-6xl">
        {/* ── HEADING ── */}
        <div className="mb-12 text-center">
          <h2
            className="headingstyle text-center font-heading font-extrabold leading-tight text-white"
            style={{
              opacity: triggered ? 1 : 0,
              transform: triggered ? "translateY(0)" : "translateY(-28px)",
              transition: `opacity 0.6s ease ${HEADING_DELAY}ms, transform 0.6s ease ${HEADING_DELAY}ms`,
            }}
          >
            Why parents trust us over the toy aisle.
          </h2>
        </div>

        {/* 3-column grid */}
        <div className="grid grid-cols-1 items-start gap-6 md:grid-cols-[1fr_300px_1fr]">
          {/* ── LEFT CARDS ── */}
          <div className="flex flex-col items-center gap-5 md:items-end">
            {leftCards.map((card) => (
              <TrustCard
                key={card.id}
                icon={card.icon}
                title={card.title}
                body={card.body}
                visible={triggered}
                delay={cardDelayMap[card.id]}
                side="left"
              />
            ))}
          </div>

          {/* ── CENTER IMAGE ── */}
          <div className="order-first flex flex-col items-center justify-start md:order-none">
            <div
              className="relative h-[340px] w-[300px] md:h-[400px] md:w-[500px]"
              style={{
                opacity: triggered ? 1 : 0,
                transform: triggered ? "translateY(0)" : "translateY(64px)",
                zIndex: 10,
                transition: `opacity 0.65s ease ${IMAGE_DELAY}ms, transform 0.65s ease ${IMAGE_DELAY}ms`,
              }}
            >
              <Image
                src="https://ik.imagekit.io/pratik11/why-parent-cropped?updatedAt=1781173936236"
                alt="Happy parents giving thumbs up"
                fill
                className="object-contain"
                sizes="(max-width: 768px) 260px, 300px"
              />
            </div>
          </div>

          {/* ── RIGHT CARDS ── */}
          <div className="mb-8 flex flex-col items-center gap-5 md:mb-0 md:items-start">
            {rightCards.map((card) => (
              <TrustCard
                key={card.id}
                icon={card.icon}
                title={card.title}
                body={card.body}
                visible={triggered}
                delay={cardDelayMap[card.id]}
                side="right"
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

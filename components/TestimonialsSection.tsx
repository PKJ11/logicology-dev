"use client";

import { useState, useEffect, useRef, useCallback } from "react";

// ── Types ─────────────────────────────────────────────────────────────────────
interface TestimonialData {
  quote: string;
  name: string;
  role: string;
  photo?: string;
}

// ── Data ──────────────────────────────────────────────────────────────────────
const TESTIMONIALS: TestimonialData[] = [
  {
    quote:
      "As a Computer Science professor, I have always believed that logic and problem-solving should be nurtured from a very early age. When I came across Logicology, it stood out as perhaps the only summer workshop that truly focuses on building these foundational skills in a structured and engaging way. I was extremely satisfied with the Summer workshop 2025 experience for my daughter. I would strongly recommend Logicology to every parent.",
    name: "Dr. Swati Jaiswal",
    role: "Computer Science Professor, VNIT",
    photo: "https://ik.imagekit.io/pratik2002/swati.jpeg",
  },
  {
    quote:
      "As a software professional, I strongly believe that logical thinking is one of the most important skills to build early. Logicology Summer workshop was exactly what I was looking for. It's rare to find something that combines fun with deep thinking so effectively. My son Vish absolutely loved it, and I could see his confidence and problem-solving skills grow. It truly felt like a blessing.",
    name: "Chinmay Phadke",
    role: "AI Professional",
    photo: "https://ik.imagekit.io/pratik2002/passport-removebg-preview.png",
  },
  {
    quote:
      "As a doctor, my time is extremely limited, and I'm very mindful about how my children spend theirs. I wanted something more meaningful than the usual arts and dance workshops. Logicology Summer workshop stood out immediately. While it may seem more premium than average workshops, the value it delivers is truly unmatched. My child was deeply engaged, and I could see real learning happening every day. Absolutely worth it.",
    name: "Dr. Rita Bang",
    role: "Gynaecologist",
    photo: "https://ik.imagekit.io/pratik2002/rita.jpeg",
  },
  {
    quote:
      "What I loved most about Logicology Summer workshop was the incredible mix of skills it covers. It wasn't just learning — it was engaging, hands-on, and thoughtfully designed. Their original games and books are a big differentiator; this is not something you find just anywhere. It made the entire experience unique and memorable for my child.",
    name: "Sayali Bokare",
    role: "Company Secretary",
    photo: "https://ik.imagekit.io/pratik2002/syali.jpeg",
  },
  {
    quote:
      "I have twins, and I was looking for something truly different to engage them this summer. Most workshops for 5–6 year olds focus only on dancing, coloring, and painting. What impressed me about Logicology was how these very activities were used in such an innovative and purposeful way. I was genuinely amazed to see my young sons pick up so much about world geography in such a short span of time. I would strongly recommend Logicology Summer Workshops to any parent.",
    name: "Dr. Chetan Rathi",
    role: "Cardiologist",
    photo: "https://ik.imagekit.io/pratik2002/chetan-removebg-preview.png",
  },
  {
    quote:
      "Having recently moved back from the US, I was honestly unsure about the quality of workshops available here in Nagpur. I've had some bad experiences but Logicology was a pleasant surprise. The structure, depth, and delivery were at par with global standards. More importantly, my child learned skills that are incredibly relevant in today's world. I'm genuinely impressed and very happy with the experience.",
    name: "Ms. Meenakshi",
    role: "Architect",
    photo: undefined,
  },
];

// ── Slot style map ─────────────────────────────────────────────────────────────
const SLOT_STYLES: Record<string, React.CSSProperties & { background: string; boxShadow: string }> =
  {
    "-3": {
      transform: "translateX(-130%) rotateY(70deg) scale(0.55)",
      opacity: 0,
      zIndex: 1,
      pointerEvents: "none",
      background: "rgba(255,255,255,0.38)",
      boxShadow: "none",
    },
    "-2": {
      transform: "translateX(-105%) rotateY(60deg) scale(0.68)",
      opacity: 0.25,
      zIndex: 2,
      pointerEvents: "auto",
      background: "rgba(255,255,255,0.38)",
      boxShadow: "none",
    },
    "-1": {
      transform: "translateX(-62%)  rotateY(42deg) scale(0.82)",
      opacity: 0.55,
      zIndex: 3,
      pointerEvents: "auto",
      background: "rgba(255,255,255,0.38)",
      boxShadow: "none",
    },
    "0": {
      transform: "translateX(0)    rotateY(0deg)  scale(1)",
      opacity: 1,
      zIndex: 5,
      pointerEvents: "auto",
      background: "rgba(255,255,255,0.88)",
      boxShadow: "0 28px 70px rgba(11,63,68,0.22)",
    },
    "1": {
      transform: "translateX(62%)  rotateY(-42deg) scale(0.82)",
      opacity: 0.55,
      zIndex: 3,
      pointerEvents: "auto",
      background: "rgba(255,255,255,0.38)",
      boxShadow: "none",
    },
    "2": {
      transform: "translateX(105%) rotateY(-60deg) scale(0.68)",
      opacity: 0.25,
      zIndex: 2,
      pointerEvents: "auto",
      background: "rgba(255,255,255,0.38)",
      boxShadow: "none",
    },
    "3": {
      transform: "translateX(130%) rotateY(-70deg) scale(0.55)",
      opacity: 0,
      zIndex: 1,
      pointerEvents: "none",
      background: "rgba(255,255,255,0.38)",
      boxShadow: "none",
    },
  };

// ── Avatar ────────────────────────────────────────────────────────────────────
function TestimonialAvatar({ photo, name }: { photo?: string; name: string }) {
  const [err, setErr] = useState(false);

  if (photo && !err) {
    return (
      <img
        src={photo}
        alt={name}
        onError={() => setErr(true)}
        style={{
          width: 52,
          height: 52,
          borderRadius: "50%",
          objectFit: "cover",
          objectPosition: "top center",
          border: "2.5px solid rgba(255,255,255,0.70)",
          flexShrink: 0,
          background: "rgba(255,255,255,0.5)",
        }}
      />
    );
  }

  return (
    <div
      style={{
        width: 52,
        height: 52,
        borderRadius: "50%",
        background: "#0B3F44",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        color: "#D8AE4F",
        fontWeight: 800,
        fontSize: 20,
        fontFamily: "'Outfit', sans-serif",
        flexShrink: 0,
        border: "2.5px solid rgba(255,255,255,0.50)",
      }}
    >
      {name[0]}
    </div>
  );
}

// ── Fan Card ──────────────────────────────────────────────────────────────────
function FanCard({ t, slot, onClick }: { t: TestimonialData; slot: number; onClick: () => void }) {
  const clampedSlot = Math.max(-3, Math.min(3, slot));
  const style = SLOT_STYLES[String(clampedSlot)];
  const isActive = slot === 0;

  return (
    <div
      onClick={!isActive ? onClick : undefined}
      style={{
        position: "absolute",
        width: 420,
        maxWidth: "88vw",
        top: "50%",
        left: "50%",
        transform: `translate(-50%, -50%) ${style.transform}`,
        opacity: style.opacity,
        zIndex: style.zIndex,
        pointerEvents: style.pointerEvents as React.CSSProperties["pointerEvents"],
        background: style.background,
        boxShadow: style.boxShadow,
        border: "1px solid rgba(255,255,255,0.60)",
        borderRadius: 20,
        padding: "32px 28px 26px",
        backdropFilter: "blur(12px)",
        WebkitBackdropFilter: "blur(12px)",
        display: "flex",
        flexDirection: "column",
        cursor: isActive ? "default" : "pointer",
        transition:
          "transform 0.55s cubic-bezier(.34,1.1,.64,1), opacity 0.45s ease, box-shadow 0.45s ease, background 0.35s ease",
        willChange: "transform, opacity",
        boxSizing: "border-box",
      }}
    >
      {/* Opening quote mark */}
      <div
        style={{
          fontFamily: "Georgia, serif",
          fontSize: 72,
          color: "#3d3b40",
          lineHeight: 0.7,
          marginBottom: 14,
          opacity: 1,
          userSelect: "none",
        }}
      >
        "
      </div>

      {/* Quote body */}
      <p
        style={{
          fontFamily: "'Outfit', sans-serif",
          fontSize: 14.5,
          color: "#2d2200",
          lineHeight: 1.82,
          fontStyle: "italic",
          margin: 0,
          display: "-webkit-box",
          WebkitLineClamp: isActive ? 7 : 5,
          WebkitBoxOrient: "vertical",
          overflow: "hidden",
        }}
      >
        {t.quote}
      </p>

      <div style={{ flexGrow: 1, minHeight: 14 }} />

      {/* Divider */}
      <div style={{ height: 1, background: "rgba(11,63,68,0.14)", marginBottom: 16 }} />

      {/* Author */}
      <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
        <TestimonialAvatar photo={t.photo} name={t.name} />
        <div>
          <div
            style={{
              fontFamily: "'Outfit', sans-serif",
              fontWeight: 700,
              fontSize: 14,
              color: "#2d2200",
              marginBottom: 3,
            }}
          >
            {t.name}
          </div>
          <div
            style={{
              fontFamily: "'Outfit', sans-serif",
              fontSize: 12,
              color: "rgba(45,34,0,0.58)",
              fontWeight: 500,
            }}
          >
            {t.role}
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Main Section ──────────────────────────────────────────────────────────────
export default function TestimonialsSection() {
  const N = TESTIMONIALS.length;
  const [current, setCurrent] = useState(0);
  const [animating, setAnimating] = useState(false);
  const autoRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const touchStartX = useRef<number | null>(null);

  const goTo = useCallback(
    (idx: number) => {
      if (animating) return;
      const next = ((idx % N) + N) % N;
      if (next === current) return;
      setAnimating(true);
      setCurrent(next);
      setTimeout(() => setAnimating(false), 580);
    },
    [animating, current, N]
  );

  const startAuto = useCallback(() => {
    if (autoRef.current) clearInterval(autoRef.current);
    autoRef.current = setInterval(() => {
      setCurrent((c) => (c + 1) % N);
    }, 4500);
  }, [N]);

  useEffect(() => {
    startAuto();
    return () => {
      if (autoRef.current) clearInterval(autoRef.current);
    };
  }, [startAuto]);

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };
  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return;
    const dx = e.changedTouches[0].clientX - touchStartX.current;
    if (Math.abs(dx) > 40) goTo(dx < 0 ? current + 1 : current - 1);
    touchStartX.current = null;
  };

  const getSlot = (cardIdx: number) => {
    let off = cardIdx - current;
    if (off > N / 2) off -= N;
    if (off < -N / 2) off += N;
    return off;
  };

  return (
    <>
      <style>{`
        .t-fan-stage {
          position: relative; width: 100%; height: 420px;
          perspective: 1200px; transform-style: preserve-3d;
        }
        @media (max-width: 640px) {
          .t-fan-stage { height: 500px; perspective: 800px; }
        }
        .t-nav-btn:hover {
          background: rgba(255,255,255,0.95) !important;
          box-shadow: 0 4px 16px rgba(11,63,68,0.15) !important;
        }
        .t-nav-btn:active { transform: scale(0.95); }
        .t-dot-active {
  background: #ffffff !important;  /* was #0B3F44 */
  transform: scale(1.8) !important;
}
      `}</style>

      <section
        id="testimonials"
        className="bg-brand-buttonYellowBefore"
        style={{
          padding: "100px 24px",
          overflow: "hidden",
          position: "relative",
        }}
      >
        {/* Background blobs */}
        <div
          style={{
            position: "absolute",
            bottom: -60,
            right: -60,
            width: 300,
            height: 300,
            borderRadius: "50%",
            background: "rgba(255,255,255,0.12)",
            filter: "blur(70px)",
            pointerEvents: "none",
          }}
        />
        <div
          style={{
            position: "absolute",
            top: -50,
            left: -80,
            width: 240,
            height: 240,
            borderRadius: "50%",
            background: "rgba(11,63,68,0.08)",
            filter: "blur(60px)",
            pointerEvents: "none",
          }}
        />

        <div style={{ maxWidth: 1160, margin: "0 auto", position: "relative", zIndex: 1 }}>
          {/* Section heading */}
          <div style={{ textAlign: "center", marginBottom: 56 }}>
            {/* <div
              className="text-brand-black"
              style={{
                display: "inline-block",
                fontFamily: "'Outfit', sans-serif",
                fontSize: 25,
                fontWeight: 700,
                letterSpacing: "0.10em",
                textTransform: "uppercase",
              }}
            >
              Testimonials
            </div> */}
            <h2 className="headingstyle mt-4 font-heading font-extrabold text-brand-black">
              Don't Take Our Word for It.
              <br />
              Take Theirs.
            </h2>
          </div>

          {/* Fan stage */}
          <div
            ref={stageRef}
            className="t-fan-stage"
            onMouseEnter={() => {
              if (autoRef.current) clearInterval(autoRef.current);
            }}
            onMouseLeave={startAuto}
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
          >
            {TESTIMONIALS.map((t, i) => (
              <FanCard key={t.name} t={t} slot={getSlot(i)} onClick={() => goTo(i)} />
            ))}
          </div>

          {/* Navigation */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 20,
              marginTop: 32,
            }}
          >
            <button
              className="t-nav-btn"
              onClick={() => goTo(current - 1)}
              aria-label="Previous"
              style={{
                width: 48,
                height: 48,
                borderRadius: "50%",
                background: "rgba(255,255,255,0.65)",
                border: "1.5px solid rgba(255,255,255,0.75)",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 18,
                color: "#3d3b40",
                fontWeight: 900,
                backdropFilter: "blur(8px)",
                transition: "background 0.2s, box-shadow 0.2s",
              }}
            >
              ←
            </button>

            {/* Dots */}
            <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
              {TESTIMONIALS.map((_, i) => (
                <button
                  key={i}
                  onClick={() => goTo(i)}
                  className={i === current ? "t-dot-active" : ""}
                  style={{
                    width: 7,
                    height: 7,
                    minWidth: 7,
                    minHeight: 7,
                    borderRadius: "50%",
                    background: "#3d3b40",
                    border: "none",
                    cursor: "pointer",
                    padding: 0,
                    transition: "background 0.2s, transform 0.2s",
                    transform: "scale(1)",
                    WebkitAppearance: "none",
                    appearance: "none",
                  }}
                />
              ))}
            </div>

            <button
              className="t-nav-btn"
              onClick={() => goTo(current + 1)}
              aria-label="Next"
              style={{
                width: 48,
                height: 48,
                borderRadius: "50%",
                background: "rgba(255,255,255,0.65)",
                border: "1.5px solid rgba(255,255,255,0.75)",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 18,
                color: "#3d3b40",
                fontWeight: 900,
                backdropFilter: "blur(8px)",
                transition: "background 0.2s, box-shadow 0.2s",
              }}
            >
              →
            </button>
          </div>
        </div>
      </section>
    </>
  );
}

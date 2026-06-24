"use client";
import Link from "next/link";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import type { SlideProps } from "../HeroSlider";
import HeroCheckoutModal from "@/components/HeroCheckoutModal";
import { SLIDE1_PRODUCT } from "./heroProductConfigs";

const CARD_BACK_SRC = "https://ik.imagekit.io/pratik2002/PRIME%20TIME%20CARD%20BACK.png";

interface CardConfig {
  src: string;
  style: {
    top?: string;
    bottom?: string;
    left?: string;
    right?: string;
    width: number;
    rotate: string;
    zIndex?: number;
  };
  swingDelay?: number;
  stickSide?: "left" | "right";
}

const DESKTOP_CARDS: CardConfig[] = [
  {
    src: "/Images/primetimecardImages/PRIME TIME CARD 42.png",
    style: { top: "0%", left: "30%", width: 110, rotate: "12deg", zIndex: 10 },
    swingDelay: 0,
    stickSide: "right",
  },
  {
    src: "/Images/primetimecardImages/PRIME TIME SKIP CARD.png",
    style: { top: "18%", right: "8%", width: 110, rotate: "8deg", zIndex: 10 },
    swingDelay: 0.4,
    stickSide: "left",
  },
  {
    src: "/Images/primetimecardImages/PRIME TIME CARD 7.png",
    style: { bottom: "8%", left: "0%", width: 110, rotate: "-6deg", zIndex: 10 },
    swingDelay: 0.8,
    stickSide: "right",
  },
  {
    src: "/Images/primetimecardImages/PRIME TIME CARD 2.png",
    style: { bottom: "10%", right: "6%", width: 110, rotate: "14deg", zIndex: 10 },
    swingDelay: 1.2,
    stickSide: "left",
  },
  {
    src: "/Images/primetimecardImages/PRIME TIME CARD 3.png",
    style: { bottom: "0%", left: "45%", width: 110, rotate: "10deg", zIndex: 10 },
    swingDelay: 1.0,
    stickSide: "left",
  },
  {
    src: "/Images/primetimecardImages/PRIME TIME MAGIC CARD.png",
    style: { top: "20%", left: "0%", width: 110, rotate: "12deg", zIndex: 10 },
    swingDelay: 0.2,
    stickSide: "right",
  },
];

const MOBILE_CARDS: CardConfig[] = [
  {
    src: "/Images/primetimecardImages/PRIME TIME CARD 3.png",
    style: { top: "12%", left: "2%", width: 68, rotate: "30deg" },
    swingDelay: 0,
    stickSide: "right",
  },
  {
    src: "/Images/primetimecardImages/PRIME TIME MAGIC CARD.png",
    style: { top: "8%", left: "35%", width: 62, rotate: "-14deg" },
    swingDelay: 0.5,
    stickSide: "right",
  },
  {
    src: "/Images/primetimecardImages/PRIME TIME SKIP CARD.png",
    style: { top: "10%", right: "2%", width: 70, rotate: "-30deg" },
    swingDelay: 1.0,
    stickSide: "left",
  },
  {
    src: "/Images/primetimecardImages/PRIME TIME CARD 7.png",
    style: { bottom: "8%", left: "3%", width: 64, rotate: "-12deg" },
    swingDelay: 1.5,
    stickSide: "right",
  },
  {
    src: "/Images/primetimecardImages/PRIME TIME CARD 42.png",
    style: { bottom: "6%", right: "3%", width: 62, rotate: "16deg" },
    swingDelay: 2.0,
    stickSide: "left",
  },
];

// Cards that use the flip animation
const FLIP_CARD_SRCS = [
  "/Images/primetimecardImages/PRIME TIME SKIP CARD.png",
  "/Images/primetimecardImages/PRIME TIME MAGIC CARD.png",
  "/Images/primetimecardImages/PRIME TIME CARD 3.png",
];

// ── SwingingCard — 180° front-to-back flip with real back face ──
function SwingingCard({
  card,
  isInView,
  popDelay,
}: {
  card: CardConfig;
  isInView: boolean;
  popDelay: number;
}) {
  return (
    <motion.div
      className="absolute"
      style={{
        top: card.style.top,
        bottom: card.style.bottom,
        left: card.style.left,
        right: card.style.right,
        width: card.style.width,
        zIndex: card.style.zIndex ?? 10,
        perspective: 800,
        rotate: card.style.rotate,
      }}
      initial={{ scale: 0, opacity: 0 }}
      animate={isInView ? { scale: 1, opacity: 1 } : { scale: 0, opacity: 0 }}
      transition={{
        scale: { duration: 0.5, delay: popDelay, ease: "backOut" },
        opacity: { duration: 0.4, delay: popDelay },
      }}
    >
      {/* Inner wrapper — this is what actually flips */}
      <motion.div
        style={{
          position: "relative",
          width: "100%",
          transformStyle: "preserve-3d",
          boxShadow: "0 8px 24px rgba(0,0,0,0.28), 0 2px 8px rgba(0,0,0,0.18)",
          borderRadius: "12px",
        }}
        animate={isInView ? { rotateY: [0, 180, 360] } : {}}
        transition={
          isInView
            ? {
                rotateY: {
                  duration: 2.5,
                  delay: popDelay + 0.5 + (card.swingDelay ?? 0),
                  repeat: Infinity,
                  repeatDelay: 1.5,
                  ease: "easeInOut",
                },
              }
            : {}
        }
      >
        {/* Front face */}
        <img
          src={card.src}
          alt="Prime Time Card"
          className="w-full object-contain"
          style={{
            borderRadius: "12px",
            display: "block",
            backfaceVisibility: "hidden",
            WebkitBackfaceVisibility: "hidden",
          }}
        />
        {/* Back face */}
        <img
          src={CARD_BACK_SRC}
          alt="Prime Time Card Back"
          className="w-full object-contain"
          style={{
            borderRadius: "12px",
            position: "absolute",
            inset: 0,
            backfaceVisibility: "hidden",
            WebkitBackfaceVisibility: "hidden",
            transform: "rotateY(180deg)",
          }}
        />
      </motion.div>
    </motion.div>
  );
}

// ── SwingingCardPendulum — pendulum swing (all other cards) ──
function SwingingCardPendulum({
  card,
  isInView,
  popDelay,
}: {
  card: CardConfig;
  isInView: boolean;
  popDelay: number;
}) {
  const originX = card.stickSide === "left" ? "0% 50%" : "100% 50%";
  const swingAngles = card.stickSide === "left" ? [-8, 8, -8] : [8, -8, 8];

  return (
    <motion.div
      className="absolute"
      style={{
        top: card.style.top,
        bottom: card.style.bottom,
        left: card.style.left,
        right: card.style.right,
        width: card.style.width,
        zIndex: card.style.zIndex ?? 10,
        transformOrigin: originX,
      }}
      initial={{ scale: 0, opacity: 0, rotate: 0 }}
      animate={
        isInView
          ? { scale: 1, opacity: 1, rotate: swingAngles }
          : { scale: 0, opacity: 0, rotate: 0 }
      }
      transition={
        isInView
          ? {
              scale: { duration: 0.5, delay: popDelay, ease: "backOut" },
              opacity: { duration: 0.4, delay: popDelay },
              rotate: {
                duration: 3.0,
                delay: popDelay + 0.5 + (card.swingDelay ?? 0),
                repeat: Infinity,
                repeatType: "mirror",
                ease: "easeInOut",
              },
            }
          : {}
      }
    >
      <img
        src={card.src}
        alt="Prime Time Card"
        className="w-full object-contain"
        style={{
          borderRadius: "12px",
          boxShadow: "0 8px 24px rgba(0,0,0,0.28), 0 2px 8px rgba(0,0,0,0.18)",
          rotate: card.style.rotate,
        }}
      />
    </motion.div>
  );
}

// ── SmartCard — routes to the correct animation based on card src ──
function SmartCard({
  card,
  isInView,
  popDelay,
}: {
  card: CardConfig;
  isInView: boolean;
  popDelay: number;
}) {
  const useFlip = FLIP_CARD_SRCS.includes(card.src);
  return useFlip ? (
    <SwingingCard card={card} isInView={isInView} popDelay={popDelay} />
  ) : (
    <SwingingCardPendulum card={card} isInView={isInView} popDelay={popDelay} />
  );
}

export default function HeroSlide1({ isInView }: SlideProps) {
  const [isMobile, setIsMobile] = useState<boolean>(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);

  useEffect(() => {
    const checkScreenSize = () => setIsMobile(window.innerWidth < 768);
    checkScreenSize();
    window.addEventListener("resize", checkScreenSize);
    return () => window.removeEventListener("resize", checkScreenSize);
  }, []);

  return (
    <>
      {/* Button hover styles - unified hover color */}
      <style>{`
        .hs1-buy-btn {
          background-color: #fbb041;
          color: #3d3b40;
          border: 2px solid transparent;
          transition: all 0.3s ease, transform 0.15s ease;
        }
        .hs1-buy-btn:hover {
          background-color: #fa9e15;
          transform: scale(1.05);
          box-shadow: 0 6px 20px rgba(250,158,21,0.4);
        }
        .hs1-buy-btn:active { transform: scale(0.95); }

        .hs1-details-btn {
          background-color: transparent;
          border: 2px solid #ffffff;
          color: #ffffff;
          transition: all 0.3s ease, transform 0.15s ease;
        }
        .hs1-details-btn:hover {
          background-color: #fa9e15;
          border-color: #fa9e15;
          color: #3d3b40;
          transform: scale(1.05);
          box-shadow: 0 6px 20px rgba(250,158,21,0.4);
        }
        .hs1-details-btn:active { transform: scale(0.95); }
        
        .hs1-details-btn .hs1-label {
          position: relative;
          z-index: 1;
        }
      `}</style>

      <HeroCheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        product={SLIDE1_PRODUCT}
      />

      <div
        className="relative w-full overflow-hidden"
        style={{
          backgroundImage: `url('https://ik.imagekit.io/pratik11/PRIME-TIME-BACKGROUND-DESIGN.png?updatedAt=1780450730151')`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
          minHeight: isMobile ? 720 : 680,
        }}
      >
        {/* ══ DESKTOP LAYOUT ══ */}
        <div className="hidden min-h-[680px] w-full items-center md:flex">
          {/* Left — Text block */}
          <div className="relative z-20 flex flex-1 flex-col justify-center py-12 pl-[6vw] pr-4">
            {/* 
            <SmartCard card={TEXT_COLUMN_CARDS[0]} isInView={isInView} popDelay={0.4} />
            <SmartCard card={TEXT_COLUMN_CARDS[1]} isInView={isInView} popDelay={0.48} /> */}

            <motion.h1
              className="mb-5 uppercase leading-[1.1] text-white"
              style={{
                fontFamily: "var(--font-outfit), sans-serif",
                fontSize: "50px",
                fontWeight: 800,
              }}
              initial={{ y: 40, opacity: 0 }}
              animate={isInView ? { y: 0, opacity: 1 } : {}}
              transition={{ duration: 0.7, delay: 0.25 }}
            >
              The math game that secretly teaches number sense and strategy.
            </motion.h1>

            <motion.p
              className="mb-8 max-w-[420px] text-[18px] leading-7 text-white lg:text-[26px]"
              style={{ fontFamily: "var(--font-outfit), sans-serif" }}
              initial={{ y: 30, opacity: 0 }}
              animate={isInView ? { y: 0, opacity: 1 } : {}}
              transition={{ duration: 0.6, delay: 0.38 }}
            >
              Prime numbers turned into a battle of wits. Ages 8+.
            </motion.p>

            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={isInView ? { y: 0, opacity: 1 } : {}}
              transition={{ duration: 0.5, delay: 0.5 }}
              className="flex flex-row gap-3"
            >
              {/* Buy Now — white bg → amber on hover */}
              <button
                onClick={() => setIsCheckoutOpen(true)}
                className="hs1-buy-btn inline-block rounded-full px-8 py-4 text-center text-[18px] font-semibold"
                style={{ fontFamily: "var(--font-outfit), sans-serif", cursor: "pointer" }}
              >
                Buy Now ₹1,499
              </button>

              {/* View details — transparent with white border, becomes amber on hover */}
              <Link
                href="/games/prime-time"
                className="hs1-details-btn inline-block rounded-full px-8 py-4 text-center text-[18px] font-semibold"
                style={{ fontFamily: "var(--font-outfit), sans-serif" }}
              >
                <span className="hs1-label">View details →</span>
              </Link>
            </motion.div>
          </div>

          {/* Right — Circle + hero image + cards */}
          <div className="relative z-10 flex flex-1 items-center justify-center py-8 pr-[3vw]">
            <div
              className="relative flex items-center justify-center rounded-full"
              style={{
                width: "clamp(340px, 38vw, 520px)",
                height: "clamp(340px, 38vw, 520px)",
                background: "radial-gradient(circle, #ffffff 72%, transparent 73%)",
                border: "10px solid #fbb041",
                boxShadow: "0 0 0 6px rgba(251,176,65,0.25)",
              }}
            >
              <motion.img
                src="https://ik.imagekit.io/pratik11/primetime-heroimg-cropped"
                alt="Prime Time Game"
                className="object-contain"
                style={{ width: "80%", height: "80%", position: "relative", zIndex: 5 }}
                initial={{ scale: 0.85, opacity: 0 }}
                animate={isInView ? { scale: 1, opacity: 1 } : {}}
                transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
              />
            </div>

            {DESKTOP_CARDS.map((card, i) => (
              <SmartCard key={i} card={card} isInView={isInView} popDelay={0.4 + i * 0.08} />
            ))}
          </div>
        </div>

        {/* ══ MOBILE LAYOUT ══ */}
        <div className="flex w-full flex-col md:hidden" style={{ minHeight: 720 }}>
          <div
            className="relative flex items-center justify-center pb-4 pt-10"
            style={{ minHeight: 340 }}
          >
            <div
              className="relative flex items-center justify-center rounded-full"
              style={{
                width: 260,
                height: 260,
                background: "radial-gradient(circle, #ffffff 72%, transparent 73%)",
                border: "8px solid #fbb041",
                boxShadow: "0 0 0 4px rgba(251,176,65,0.25)",
              }}
            >
              <motion.img
                src="https://ik.imagekit.io/pratik11/PRIME-TIME-HERO-IMAGE.png?updatedAt=1780453409054"
                alt="Prime Time Game"
                className="object-contain"
                style={{ width: "70%", height: "70%", position: "relative", zIndex: 5 }}
                initial={{ scale: 0.85, opacity: 0 }}
                animate={isInView ? { scale: 1, opacity: 1 } : {}}
                transition={{ duration: 0.8, delay: 0.2 }}
              />
            </div>

            {MOBILE_CARDS.map((card, i) => (
              <SmartCard key={i} card={card} isInView={isInView} popDelay={0.3 + i * 0.07} />
            ))}
          </div>

          <div className="relative z-20 flex flex-col items-center px-6 pb-20 pt-2 text-center">
            {/* <motion.p
              className="text-white text-[16px] font-normal mb-2"
              style={{ fontFamily: "var(--font-outfit), sans-serif" }}
              initial={{ y: 20, opacity: 0 }}
              animate={isInView ? { y: 0, opacity: 1 } : {}}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              Empowering Minds
            </motion.p> */}

            <motion.h1
              className="mb-4 font-bold uppercase leading-[1.15] text-white"
              style={{
                fontFamily: "var(--font-outfit), sans-serif",
                cursor: "pointer",
                fontSize: "clamp(28px, 8vw, 36px)",
                fontWeight: 800,
              }}
              initial={{ y: 30, opacity: 0 }}
              animate={isInView ? { y: 0, opacity: 1 } : {}}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              The math game
              <br />
              that secretly
              <br />
              teaches number
              <br />
              sense & strategy.
            </motion.h1>

            <motion.p
              className="mb-6 max-w-[300px] text-[14px] uppercase leading-relaxed text-white"
              style={{ fontFamily: "var(--font-outfit), sans-serif" }}
              initial={{ y: 20, opacity: 0 }}
              animate={isInView ? { y: 0, opacity: 1 } : {}}
              transition={{ duration: 0.5, delay: 0.5 }}
            >
              Prime numbers turned into a battle of wits. Ages 8+.
            </motion.p>

            <motion.div
              initial={{ y: 15, opacity: 0 }}
              animate={isInView ? { y: 0, opacity: 1 } : {}}
              transition={{ duration: 0.45, delay: 0.6 }}
              className="flex w-full flex-col items-center gap-3"
            >
              {/* Mobile Buy Now */}
              <button
                onClick={() => setIsCheckoutOpen(true)}
                className="hs1-buy-btn w-[260px] rounded-full py-4 text-center text-[16px] font-semibold"
                style={{ fontFamily: "var(--font-outfit), sans-serif", cursor: "pointer" }}
              >
                Buy Now ₹1,499
              </button>

              {/* Mobile View details */}
              <Link
                href="/philosophy"
                className="hs1-details-btn inline-block w-[260px] rounded-full py-4 text-center text-[16px] font-semibold"
                style={{ fontFamily: "var(--font-outfit), sans-serif" }}
              >
                <span className="hs1-label">Learn more →</span>
              </Link>
            </motion.div>
          </div>
        </div>
      </div>
    </>
  );
}

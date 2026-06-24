"use client";
import Link from "next/link";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import type { SlideProps } from "../HeroSlider";
import HeroCheckoutModal from "@/components/HeroCheckoutModal";
import { SLIDE3_PRODUCT } from "./heroProductConfigs";

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

const MOBILE_CARDS: CardConfig[] = [
  {
    src: "https://ik.imagekit.io/pratik11/CARDS/TURN-THE-TABLE-CARD-UP-.png?updatedAt=1780466365467",
    style: { top: "20%", left: "10%", width: 48, rotate: "30deg" },
    swingDelay: 0,
    stickSide: "right",
  },
  {
    src: "https://ik.imagekit.io/pratik11/CARDS/TURN-THE-TABLE-CARD-25-.png?updatedAt=1780466365576",
    style: { top: "10%", right: "20%", width: 50, rotate: "-30deg" },
    swingDelay: 0.5,
    stickSide: "left",
  },
  {
    src: "https://ik.imagekit.io/pratik11/CARDS/TURN-THE-TABLE-CARD-8.png?updatedAt=1780466365677",
    style: { bottom: "20%", left: "10%", width: 48, rotate: "8deg" },
    swingDelay: 1.0,
    stickSide: "right",
  },
  {
    src: "https://ik.imagekit.io/pratik11/CARDS/TURN-THE-TABLE-CARD-DOWN-.png?updatedAt=1780466365581",
    style: { bottom: "30%", right: "5%", width: 50, rotate: "8deg" },
    swingDelay: 1.5,
    stickSide: "left",
  },
  {
    src: "https://ik.imagekit.io/pratik11/CARDS/TURN-THE-TABLE-CARD-54-.png?updatedAt=1780466365580",
    style: { bottom: "3%", right: "50%", width: 49, rotate: "14deg" },
    swingDelay: 2.0,
    stickSide: "right",
  },
];

const TEXT_COLUMN_CARDS: CardConfig[] = [
  {
    src: "https://ik.imagekit.io/pratik11/CARDS/TURN-THE-TABLE-CARD-UP-.png?updatedAt=1780466365467",
    style: { top: "-25%", left: "70%", width: 80, rotate: "60deg", zIndex: 10 },
    swingDelay: 0.2,
    stickSide: "right",
  },
  {
    src: "https://ik.imagekit.io/pratik11/CARDS/TURN-THE-TABLE-CARD-DOWN-.png?updatedAt=1780466365581",
    style: { bottom: "4%", right: "0%", width: 80, rotate: "-10deg", zIndex: 10 },
    swingDelay: 1.0,
    stickSide: "left",
  },
];

const RIGHT_CARDS: CardConfig[] = [
  {
    src: "https://ik.imagekit.io/pratik11/CARDS/TURN-THE-TABLE-CARD-25-.png?updatedAt=1780466365576",
    style: { top: "4%", left: "14%", width: 85, rotate: "10deg" },
    swingDelay: 0.3,
    stickSide: "right",
  },
  {
    src: "https://ik.imagekit.io/pratik11/CARDS/TURN-THE-TABLE-CARD-8.png?updatedAt=1780466365677",
    style: { top: "8%", right: "15%", width: 82, rotate: "8deg" },
    swingDelay: 0.7,
    stickSide: "left",
  },
];

const ACCENT = "#fbb041";

// ── SwingingCard — pendulum swing ──
function SwingingCard({
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
        alt="Card"
        className="w-full object-contain"
        style={{
          borderRadius: "10px",
          boxShadow: "0 8px 24px rgba(0,0,0,0.28), 0 2px 8px rgba(0,0,0,0.18)",
          rotate: card.style.rotate,
        }}
      />
    </motion.div>
  );
}

export default function HeroSlide3({ isInView }: SlideProps) {
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
        .hs3-buy-btn {
          background-color: #fbb041;
          color: #3d3b40;
          border: 2px solid transparent;
          transition: all 0.3s ease, transform 0.15s ease;
          box-shadow: 0 4px 16px rgba(251,176,65,0.35);
        }
        .hs3-buy-btn:hover {
          background-color: #fa9e15;
          transform: scale(1.05);
          box-shadow: 0 6px 20px rgba(250,158,21,0.4);
        }
        .hs3-buy-btn:active { transform: scale(0.95); }

        .hs3-details-btn {
          background-color: transparent;
          border: 2px solid #ffffff;
          color: #ffffff;
          transition: all 0.3s ease, transform 0.15s ease;
        }
        .hs3-details-btn:hover {
          background-color: #fa9e15;
          border-color: #fa9e15;
          color: #3d3b40;
          transform: scale(1.05);
          box-shadow: 0 6px 20px rgba(250,158,21,0.4);
        }
        .hs3-details-btn:active { transform: scale(0.95); }
        
        .hs3-details-btn .hs3-label {
          position: relative;
          z-index: 1;
        }
      `}</style>

      <HeroCheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        product={SLIDE3_PRODUCT}
      />

      <div
        className="relative w-full overflow-hidden"
        style={{
          backgroundImage: isMobile
            ? `url('https://ik.imagekit.io/pratik11/TURN-THE-TABLE-BACKGROUND-FOR-MOBILE.png?updatedAt=1781940668843')`
            : `url('https://ik.imagekit.io/pratik11/TURN-THE-TABLE-BACKGROUND-DESIGN.png?updatedAt=1780465227631')`,
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
            <SwingingCard card={TEXT_COLUMN_CARDS[0]} isInView={isInView} popDelay={0.42} />
            <SwingingCard card={TEXT_COLUMN_CARDS[1]} isInView={isInView} popDelay={0.5} />

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
              Multiplication that
              <br />
              finally clicks.
            </motion.h1>

            <motion.p
              className="mb-8 max-w-[420px] text-[18px] leading-7 text-white lg:text-[26px]"
              style={{ fontFamily: "var(--font-outfit), sans-serif" }}
              initial={{ y: 30, opacity: 0 }}
              animate={isInView ? { y: 0, opacity: 1 } : {}}
              transition={{ duration: 0.6, delay: 0.38 }}
            >
              The times-tables practice kids actually ask for.
            </motion.p>

            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={isInView ? { y: 0, opacity: 1 } : {}}
              transition={{ duration: 0.5, delay: 0.5 }}
              className="flex flex-row gap-3"
            >
              {/* Buy Now — amber bg → darker amber on hover */}
              <button
                onClick={() => setIsCheckoutOpen(true)}
                className="hs3-buy-btn inline-block rounded-full px-8 py-4 text-center text-[18px] font-semibold"
                style={{ fontFamily: "var(--font-outfit), sans-serif", cursor: "pointer" }}
              >
                Buy Now {SLIDE3_PRODUCT.price}
              </button>

              {/* View details — transparent with white border, becomes amber on hover */}
              <Link
                href="/games/turn-the-tables"
                className="hs3-details-btn inline-block rounded-full px-8 py-4 text-center text-[18px] font-semibold"
                style={{ fontFamily: "var(--font-outfit), sans-serif" }}
              >
                <span className="hs3-label">View details →</span>
              </Link>
            </motion.div>
          </div>

          {/* Right — Circle + hero image + swinging cards */}
          <div className="relative z-10 flex flex-1 items-center justify-center py-8 pr-[3vw]">
            <div
              className="relative flex items-center justify-center rounded-full"
              style={{
                width: "clamp(340px, 38vw, 520px)",
                height: "clamp(340px, 38vw, 520px)",
                background: "radial-gradient(circle, #ffffff 72%, transparent 73%)",
                border: `10px solid ${ACCENT}`,
                boxShadow: "0 0 0 6px rgba(251,176,65,0.25)",
              }}
            >
              <motion.img
                src="https://ik.imagekit.io/pratik11/TURN-THE-TABLE-HERO-IMAGE.png?updatedAt=1780465309198"
                alt="Turn the Tables Game"
                className="object-contain"
                style={{ width: "85%", height: "85%", position: "relative", zIndex: 5 }}
                initial={{ scale: 0.85, opacity: 0 }}
                animate={isInView ? { scale: 1, opacity: 1 } : {}}
                transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
              />
            </div>

            {RIGHT_CARDS.map((card, i) => (
              <SwingingCard key={i} card={card} isInView={isInView} popDelay={0.4 + i * 0.09} />
            ))}

            <SwingingCard
              card={{
                src: "https://ik.imagekit.io/pratik11/CARDS/TURN-THE-TABLE-CARD-54-.png?updatedAt=1780466365580",
                style: { bottom: "10%", right: "15%", width: 85, rotate: "-44deg" },
                swingDelay: 1.2,
                stickSide: "left",
              }}
              isInView={isInView}
              popDelay={0.58}
            />
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
                border: `8px solid ${ACCENT}`,
                boxShadow: "0 0 0 4px rgba(251,176,65,0.25)",
              }}
            >
              <motion.img
                src="https://ik.imagekit.io/pratik11/TURN-THE-TABLE-HERO-IMAGE.png?updatedAt=1780465309198"
                alt="Turn the Tables Game"
                className="object-contain"
                style={{ width: "82%", height: "82%", position: "relative", zIndex: 5 }}
                initial={{ scale: 0.85, opacity: 0 }}
                animate={isInView ? { scale: 1, opacity: 1 } : {}}
                transition={{ duration: 0.8, delay: 0.2 }}
              />
            </div>

            {MOBILE_CARDS.map((card, i) => (
              <SwingingCard key={i} card={card} isInView={isInView} popDelay={0.3 + i * 0.07} />
            ))}
          </div>

          <div className="relative z-20 flex flex-col items-center px-6 pb-20 pt-2 text-center">
            <motion.h1
              className="my-4 uppercase leading-[1.15] text-white"
              style={{
                fontFamily: "var(--font-outfit), sans-serif",
                fontSize: "clamp(28px, 8vw, 36px)",
                fontWeight: 800,
              }}
              initial={{ y: 30, opacity: 0 }}
              animate={isInView ? { y: 0, opacity: 1 } : {}}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              Multiplication
              <br />
              that finally
              <br />
              clicks.
            </motion.h1>

            <motion.p
              className="mb-6 max-w-[300px] text-[16px] leading-relaxed text-white"
              style={{ fontFamily: "var(--font-outfit), sans-serif" }}
              initial={{ y: 20, opacity: 0 }}
              animate={isInView ? { y: 0, opacity: 1 } : {}}
              transition={{ duration: 0.5, delay: 0.5 }}
            >
              The times-tables practice kids actually ask for.
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
                className="hs3-buy-btn w-[260px] rounded-full py-4 text-center text-[16px] font-semibold"
                style={{ fontFamily: "var(--font-outfit), sans-serif", cursor: "pointer" }}
              >
                Buy Now {SLIDE3_PRODUCT.price}
              </button>

              {/* Mobile View details */}
              <Link
                href="/games/turn-the-tables"
                className="hs3-details-btn inline-block w-[260px] rounded-full py-4 text-center text-[16px] font-semibold"
                style={{ fontFamily: "var(--font-outfit), sans-serif" }}
              >
                <span className="hs3-label">View details →</span>
              </Link>
            </motion.div>
          </div>
        </div>
      </div>
    </>
  );
}

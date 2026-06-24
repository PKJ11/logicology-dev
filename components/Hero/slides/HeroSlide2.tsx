"use client";
import Link from "next/link";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import type { SlideProps } from "../HeroSlider";
import HeroCheckoutModal from "@/components/HeroCheckoutModal";
import { SLIDE2_PRODUCT } from "./heroProductConfigs";

interface IconConfig {
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

const DESKTOP_ICONS: IconConfig[] = [
  {
    src: "https://ik.imagekit.io/pratik11/ICONS/PNG/LOGICOLAND%20SECTION%20ICON%202@2x.png?updatedAt=1780463172541",
    style: { top: "5%", right: "20%", width: 105, rotate: "10deg", zIndex: 10 },
    swingDelay: 0.5,
    stickSide: "left",
  },
  {
    src: "https://ik.imagekit.io/pratik11/ICONS/PNG/LOGICOLAND%20SECTION%20ICON%203@2x.png?updatedAt=1780463172854",
    style: { bottom: "0%", left: "30%", width: 105, rotate: "6deg", zIndex: 10 },
    swingDelay: 0.9,
    stickSide: "right",
  },
  {
    src: "https://ik.imagekit.io/pratik11/ICONS/PNG/LOGICOLAND%20SECTION%20ICON%204@2x.png?updatedAt=1780463172963",
    style: { bottom: "12%", right: "20%", width: 105, rotate: "-8deg", zIndex: 10 },
    swingDelay: 1.3,
    stickSide: "left",
  },
];

const MOBILE_ICONS: IconConfig[] = [
  {
    src: "https://ik.imagekit.io/pratik11/ICONS/PNG/LOGICOLAND%20SECTION%20ICON%205@2x.png?updatedAt=1780463173006",
    style: { top: "15%", left: "5%", width: 70, rotate: "-10deg" },
    swingDelay: 0,
    stickSide: "right",
  },
  {
    src: "https://ik.imagekit.io/pratik11/ICONS/PNG/LOGICOLAND%20SECTION%20ICON%204@2x.png?updatedAt=1780463172963",
    style: { top: "15%", right: "5%", width: 74, rotate: "8deg" },
    swingDelay: 0.5,
    stickSide: "left",
  },
  {
    src: "https://ik.imagekit.io/pratik11/ICONS/PNG/LOGICOLAND%20SECTION%20ICON%203@2x.png?updatedAt=1780463172854",
    style: { bottom: "15%", left: "5%", width: 68, rotate: "12deg" },
    swingDelay: 1.0,
    stickSide: "right",
  },
  {
    src: "https://ik.imagekit.io/pratik11/ICONS/PNG/LOGICOLAND%20SECTION%20ICON%202@2x.png?updatedAt=1780463172541",
    style: { bottom: "15%", right: "5%", width: 72, rotate: "-14deg" },
    swingDelay: 1.5,
    stickSide: "left",
  },
  {
    src: "https://ik.imagekit.io/pratik11/ICONS/PNG/LOGICOLAND%20SECTION%20ICON%201@2x.png?updatedAt=1780463172607",
    style: { bottom: "0%", right: "40%", width: 72, rotate: "-14deg" },
    swingDelay: 1.5,
    stickSide: "left",
  },
];

const ACCENT = "#fbb041";
const CARD_SHADOW = "-7px 9px 0px 0px rgba(0,0,0,0.5), 0 14px 36px rgba(0,0,0,0.2)";

function IconCard({
  src,
  alt,
  containerWidth,
}: {
  src: string;
  alt: string;
  containerWidth: number;
}) {
  return (
    <div
      style={{
        width: containerWidth,
        height: containerWidth,
        background: "#ffffff",
        borderRadius: "14px",
        boxShadow: CARD_SHADOW,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "14%",
      }}
    >
      <img
        src={src}
        alt={alt}
        style={{ width: "100%", height: "100%", objectFit: "contain", display: "block" }}
      />
    </div>
  );
}

// ── SwingingIconCard — pendulum swing ──
function SwingingIconCard({
  icon,
  isInView,
  popDelay,
}: {
  icon: IconConfig;
  isInView: boolean;
  popDelay: number;
}) {
  const originX = icon.stickSide === "left" ? "0% 50%" : "100% 50%";
  const swingAngles = icon.stickSide === "left" ? [-8, 8, -8] : [8, -8, 8];

  return (
    <motion.div
      style={{ ...icon.style, position: "absolute", transformOrigin: originX }}
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
                delay: popDelay + 0.5 + (icon.swingDelay ?? 0),
                repeat: Infinity,
                repeatType: "mirror",
                ease: "easeInOut",
              },
            }
          : {}
      }
    >
      <IconCard src={icon.src} alt="Logicoland Icon" containerWidth={icon.style.width} />
    </motion.div>
  );
}

export default function HeroSlide2({ isInView }: SlideProps) {
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
        .hs2-buy-btn {
           background-color: #fbb041;
          color: #3d3b40;
          border: 2px solid transparent;
          transition: all 0.3s ease, transform 0.15s ease;
        }
        .hs2-buy-btn:hover {
          background-color: #fa9e15;
          transform: scale(1.05);
          box-shadow: 0 6px 20px rgba(250,158,21,0.4);
        }
        .hs2-buy-btn:active { transform: scale(0.95); }

        .hs2-details-btn {
          background-color: transparent;
          border: 2px solid #ffffff;
          color: #ffffff;
          transition: all 0.3s ease, transform 0.15s ease;
        }
        .hs2-details-btn:hover {
          background-color: #fa9e15;
          border-color: #fa9e15;
          color: #3d3b40;
          transform: scale(1.05);
          box-shadow: 0 6px 20px rgba(250,158,21,0.4);
        }
        .hs2-details-btn:active { transform: scale(0.95); }
        
        .hs2-details-btn .hs2-label {
          position: relative;
          z-index: 1;
        }
      `}</style>

      <HeroCheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        product={SLIDE2_PRODUCT}
      />

      <div
        className="relative w-full overflow-hidden"
        style={{
          backgroundImage: isMobile
            ? `url('https://ik.imagekit.io/pratik11/LOGICOLAND-BACKGROUND-FRO-MOBILE.png?updatedAt=1781940668867')`
            : `url('https://ik.imagekit.io/pratik11/LOGICOLAND-BACKGROUND-DESIGN-3.png')`,
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
            <SwingingIconCard
              icon={{
                src: "https://ik.imagekit.io/pratik11/ICONS/PNG/LOGICOLAND%20SECTION%20ICON%201@2x.png?updatedAt=1780463172607",
                style: { top: "-8%", right: "0%", width: 105, rotate: "15deg", zIndex: 10 },
                swingDelay: 0.2,
                stickSide: "right",
              }}
              isInView={isInView}
              popDelay={0.42}
            />

            <SwingingIconCard
              icon={{
                src: "https://ik.imagekit.io/pratik11/ICONS/PNG/LOGICOLAND%20SECTION%20ICON%205@2x.png?updatedAt=1780463173006",
                style: { bottom: "-10%", right: "0%", width: 105, rotate: "12deg", zIndex: 10 },
                swingDelay: 1.0,
                stickSide: "left",
              }}
              isInView={isInView}
              popDelay={0.5}
            />

            <motion.h1
              className="mb-5 leading-[1.1] text-white"
              style={{
                fontFamily: "var(--font-outfit), sans-serif",
                fontSize: "50px",
                fontWeight: 800,
              }}
              initial={{ y: 40, opacity: 0 }}
              animate={isInView ? { y: 0, opacity: 1 } : {}}
              transition={{ duration: 0.7, delay: 0.25 }}
            >
              BIG IDEAS TURNED
              <br />
              INTO CHILD&apos;S PLAY.
            </motion.h1>

            <motion.p
              className="mb-8 max-w-[420px] text-[18px] leading-7 text-white lg:text-[26px]"
              style={{ fontFamily: "var(--font-outfit), sans-serif" }}
              initial={{ y: 30, opacity: 0 }}
              animate={isInView ? { y: 0, opacity: 1 } : {}}
              transition={{ duration: 0.6, delay: 0.38 }}
            >
              Looks like colouring, works like logic.
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
                className="hs2-buy-btn inline-block rounded-full px-8 py-4 text-center text-[18px] font-semibold"
                style={{ fontFamily: "var(--font-outfit), sans-serif", cursor: "pointer" }}
              >
                Buy Now {SLIDE2_PRODUCT.price}
              </button>

              {/* View details — transparent with white border, becomes amber on hover */}
              <Link
                href="/books/logicoland-series"
                className="hs2-details-btn inline-block rounded-full px-8 py-4 text-center text-[18px] font-semibold"
                style={{ fontFamily: "var(--font-outfit), sans-serif" }}
              >
                <span className="hs2-label">View details →</span>
              </Link>
            </motion.div>
          </div>

          {/* Right — Circle + hero image + swinging icon cards */}
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
                src="https://ik.imagekit.io/pratik11/Logicoland-hero-img-cropped"
                alt="Logicoland Books"
                className="object-contain"
                style={{ width: "80%", height: "80%", position: "relative", zIndex: 5 }}
                initial={{ scale: 0.85, opacity: 0 }}
                animate={isInView ? { scale: 1, opacity: 1 } : {}}
                transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
              />
            </div>

            {DESKTOP_ICONS.map((icon, i) => (
              <SwingingIconCard key={i} icon={icon} isInView={isInView} popDelay={0.4 + i * 0.08} />
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
                border: `8px solid ${ACCENT}`,
                boxShadow: "0 0 0 4px rgba(251,176,65,0.25)",
              }}
            >
              <motion.img
                src="https://ik.imagekit.io/pratik11/Logicoland-hero-img-cropped?updatedAt=1781163959580"
                alt="Logicoland Books"
                className="object-contain"
                style={{ width: "70%", height: "70%", position: "relative", zIndex: 5 }}
                initial={{ scale: 0.85, opacity: 0 }}
                animate={isInView ? { scale: 1, opacity: 1 } : {}}
                transition={{ duration: 0.8, delay: 0.2 }}
              />
            </div>

            {MOBILE_ICONS.map((icon, i) => (
              <SwingingIconCard key={i} icon={icon} isInView={isInView} popDelay={0.3 + i * 0.07} />
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
              Big ideas
              <br />
              turned into
              <br />
              child's play.
            </motion.h1>

            <motion.p
              className="mb-6 max-w-[300px] text-[18px] leading-relaxed text-white"
              style={{ fontFamily: "var(--font-outfit), sans-serif" }}
              initial={{ y: 20, opacity: 0 }}
              animate={isInView ? { y: 0, opacity: 1 } : {}}
              transition={{ duration: 0.5, delay: 0.5 }}
            >
              Looks like colouring, works like logic.
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
                className="hs2-buy-btn w-[260px] rounded-full py-4 text-center text-[16px] font-semibold"
                style={{ fontFamily: "var(--font-outfit), sans-serif", cursor: "pointer" }}
              >
                Buy Now {SLIDE2_PRODUCT.price}
              </button>

              {/* Mobile View details */}
              <Link
                href="/books"
                className="hs2-details-btn inline-block w-[260px] rounded-full py-4 text-center text-[16px] font-semibold"
                style={{ fontFamily: "var(--font-outfit), sans-serif" }}
              >
                <span className="hs2-label">View details →</span>
              </Link>
            </motion.div>
          </div>
        </div>
      </div>
    </>
  );
}

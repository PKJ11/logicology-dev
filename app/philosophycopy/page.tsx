"use client";

import React, { useEffect, useState, useRef } from "react";
import { motion, useInView } from "framer-motion";
import NavBar from "@/components/NavBar";
import Footer from "@/components/Footer";
import CTAButton from "@/components/CTAButton";
import MediaLayout from "@/components/MediaLayout";
import Tribe from "@/components/Tribe";
import Head from "next/head";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination, Navigation } from "swiper/modules";
import Community from "@/components/Community";
import Image from "next/image";

// ─────────────────────────────────────────────────────────────────
// PAGE
// ─────────────────────────────────────────────────────────────────
export default function Philosophy() {
  return (
    <>
      <Head>
        <title>Our Philosophy — Learn to Play. Play to Learn. | Logicology</title>
        <meta
          name="description"
          content="We're not a toy company that added learning. We're a learning company that made it fun. Discover the philosophy behind Logicology's games, books and learning experiences."
        />
        <meta
          name="keywords"
          content="logicology philosophy, fun learning, game based learning, educational philosophy, kids learning games, learn through play"
        />
        <meta property="og:type" content="website" />
        <meta
          property="og:title"
          content="Our Philosophy — Learn to Play. Play to Learn. | Logicology"
        />
        <meta
          property="og:description"
          content="We're not a toy company that added learning. We're a learning company that made it fun."
        />
        <meta name="robots" content="index, follow" />
        <meta name="author" content="Logicology Team" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta name="theme-color" content="#6A294D" />
        <link rel="canonical" href="https://logicology.in/philosophy" />
      </Head>

      <main className="min-h-screen bg-brand-hero">
        <NavBar />
        <PhilosophyHero />
        <WhyWeExist />
        <CaseForThinking />
        <ResearchedNotRebranded />
        <HowWeDesign />
        <TheWinWin />
        <CloseSection />
        <Community />
        <Footer />
      </main>
    </>
  );
}

// ─────────────────────────────────────────────────────────────────
// Video side-panel modal (shared)
// ─────────────────────────────────────────────────────────────────
function VideoModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-end" onClick={onClose}>
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
      <div
        className="relative z-10 flex h-full w-full max-w-xl flex-col bg-[#1a1a1a] shadow-2xl"
        onClick={(e) => e.stopPropagation()}
        style={{ animation: "slideInRight 0.35s cubic-bezier(0.22,1,0.36,1)" }}
      >
        <div className="flex items-center justify-between border-b border-white/10 px-6 py-4">
          <h3 className="font-heading text-lg font-extrabold text-white">Our Philosophy</h3>
          <button
            onClick={onClose}
            className="flex h-9 w-9 items-center justify-center rounded-full bg-white/10 text-white transition hover:bg-white/20"
          >
            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>
        <div className="flex flex-1 items-center justify-center p-6">
          <video
            src="https://ik.imagekit.io/pratik11/Kartik%20-%20Philosophy.mp4?updatedAt=1758433043493"
            className="w-full rounded-2xl"
            controls
            autoPlay
          />
        </div>
      </div>
      <style>{`
        @keyframes slideInRight {
          from { transform: translateX(100%); opacity: 0; }
          to   { transform: translateX(0);    opacity: 1; }
        }
      `}</style>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────
// SECTION 1 — HERO  (mirrors Prime Time hero exactly)
// ─────────────────────────────────────────────────────────────────
function PhilosophyHero() {
  const [isMobile, setIsMobile] = useState(false);
  const [isVideoOpen, setIsVideoOpen] = useState(false);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  return (
    <>
      <style>{`
        .ph-cta-primary {
          background-color: #fbb041;
          color: #3d3b40;
          border: 2px solid transparent;
          transition: all 0.3s ease, transform 0.15s ease;
          box-shadow: 0 4px 16px rgba(251,176,65,0.35);
        }
        .ph-cta-primary:hover {
          background-color: #fa9e15;
          transform: scale(1.05);
          box-shadow: 0 6px 20px rgba(250,158,21,0.4);
        }
        .ph-cta-primary:active { transform: scale(0.95); }

        .ph-cta-secondary {
          background-color: transparent;
          border: 2px solid rgba(255,255,255,0.85);
          color: #ffffff;
          transition: all 0.3s ease, transform 0.15s ease;
        }
        .ph-cta-secondary:hover {
          background-color: #fa9e15;
          border-color: #fa9e15;
          color: #3d3b40;
          transform: scale(1.05);
        }
        .ph-cta-secondary:active { transform: scale(0.95); }

        .ph-trust-item {
          display: inline-flex;
          align-items: center;
          gap: 5px;
          background: rgba(255,255,255,0.12);
          border: 1px solid rgba(255,255,255,0.25);
          border-radius: 999px;
          padding: 4px 12px;
          font-size: 13px;
          color: #ffffff;
          white-space: nowrap;
          backdrop-filter: blur(4px);
        }
        @media (max-width: 767px) {
          .ph-trust-item { font-size: 11px; padding: 3px 9px; }
        }

        .ph-hero-swiper { width: 100%; height: 100%; }
        .ph-hero-swiper .swiper-slide { height: auto; min-height: 700px; overflow: hidden; }
        @media (max-width: 767px) {
          .ph-hero-swiper .swiper-slide { min-height: 600px; }
        }
      `}</style>

      <section className="section my-10">
        <div className="container-padding">
          <div className="section-rounded relative overflow-hidden">
            <Swiper
              spaceBetween={0}
              slidesPerView={1}
              loop
              autoplay={{ delay: 15000, disableOnInteraction: false }}
              pagination={{
                clickable: true,
                bulletClass: "custom-bullet",
                bulletActiveClass: "custom-bullet-active",
                renderBullet: (_index: number, className: string) =>
                  `<span class="${className}"><i></i></span>`,
              }}
              modules={[Autoplay, Pagination, Navigation]}
              className="ph-hero-swiper"
            >
              <SwiperSlide>
                {/* Background image */}
                <div
                  className="absolute inset-0 z-0"
                  style={{
                    backgroundImage: isMobile
                      ? "url('https://ik.imagekit.io/pratik11/PRIME-TIME-SLIDER-1-NEW-MOBILE-VIEW.png?updatedAt=1758442535388')"
                      : "url('https://ik.imagekit.io/pratik11/PRIME-TIME-SLIDER-1-NEW-DESKTOP-VIEW.png?updatedAt=1758442535210')",
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                    backgroundRepeat: "no-repeat",
                  }}
                />
                {/* Overlay */}
                <div className="absolute inset-0 z-0 bg-black/45" />

                <div className="relative z-10 flex min-h-[700px] items-center">
                  <div className="md:mx-auto md:w-[75vw] md:max-w-[75vw] lg:mx-auto lg:w-[75vw] lg:max-w-[75vw]">
                    <div className="flex">
                      <div className="p-8 sm:p-12">
                        {/* Eyebrow */}
                        <motion.div
                          initial={{ opacity: 0, y: 30 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.6, delay: 0.2 }}
                          className="font-heading text-[20px] font-bold text-white sm:text-[22px] md:text-[24px] lg:text-[24px]"
                        >
                          Our Philosophy
                        </motion.div>

                        {/* Headline */}
                        <motion.h1
                          initial={{ opacity: 0, y: 30 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.6, delay: 0.3 }}
                          className="mt-2 font-heading text-[38px] font-bold uppercase leading-tight text-white sm:text-[44px] md:text-[50px] lg:text-[50px]"
                        >
                          We're not a toy company that added learning.
                          <span className="block font-heading text-[38px] leading-tight text-white sm:text-[44px] md:text-[50px] lg:text-[50px]">
                            We're a learning company that made it fun.
                          </span>
                        </motion.h1>

                        {/* Subhead */}
                        <motion.p
                          initial={{ opacity: 0, y: 30 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.6, delay: 0.4 }}
                          className="mt-6 max-w-md font-heading text-[20px] leading-7 text-white sm:text-[22px] md:text-[26px] lg:text-[26px]"
                        >
                          That one distinction explains everything we make.
                        </motion.p>

                        {/* CTAs */}
                        <motion.div
                          initial={{ opacity: 0, y: 30 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.6, delay: 0.5 }}
                          className="mt-8 flex flex-wrap items-center gap-3"
                        >
                          <button
                            onClick={() => setIsVideoOpen(true)}
                            className="ph-cta-primary inline-block rounded-full px-8 py-4 text-center text-[18px] font-semibold"
                          >
                            Watch Our Philosophy
                          </button>
                          <a
                            href="/products"
                            className="ph-cta-secondary inline-block rounded-full px-8 py-4 text-center text-[18px] font-semibold"
                          >
                            Explore the Games
                          </a>
                        </motion.div>

                        {/* Trust strip */}
                        <motion.div
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.5, delay: 0.6 }}
                          className="mt-5 flex flex-wrap gap-2"
                        >
                          {[
                            "Fun is the delivery system",
                            "Made in India",
                            "Built for curious minds",
                            "Ages 6–16",
                          ].map((text, i) => (
                            <span key={i} className="ph-trust-item">
                              {text}
                            </span>
                          ))}
                        </motion.div>
                      </div>
                    </div>
                  </div>
                </div>
              </SwiperSlide>
            </Swiper>
          </div>
        </div>
      </section>

      <VideoModal isOpen={isVideoOpen} onClose={() => setIsVideoOpen(false)} />
    </>
  );
}

// ─────────────────────────────────────────────────────────────────
// SECTION 2 — WHY WE EXIST  (brand-gold)
// Image LEFT · Text RIGHT — same as OurStory / BrandPromise
// ─────────────────────────────────────────────────────────────────
function WhyWeExist() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const [isVideoOpen, setIsVideoOpen] = useState(false);

  return (
    <>
      <section id="why" className="w-full bg-brand-coral" ref={ref}>
        <div className="px-4 py-12 md:mx-auto md:max-w-[75vw] lg:mx-auto lg:max-w-[75vw] lg:px-8">
          <div className="flex flex-col items-center md:flex-row">
            {/* LEFT — MediaLayout image */}
            <motion.div
              className="order-1 flex w-full items-center justify-center py-6 md:w-1/2 md:py-0"
              initial={{ x: -50, opacity: 0, scale: 0.9 }}
              animate={
                isInView ? { x: 0, opacity: 1, scale: 1 } : { x: -50, opacity: 0, scale: 0.9 }
              }
              transition={{ duration: 0.8, delay: 0.3 }}
            >
              <MediaLayout
                image="https://ik.imagekit.io/pratik11/LOGICOLAND-HERO-IMAGE.png?updatedAt=1781163914607"
                videoSrc=""
              />
            </motion.div>

            {/* RIGHT — Text */}
            <motion.div
              className="order-2 flex w-full flex-col justify-center p-8 sm:p-12 md:w-1/2 md:pr-2"
              initial={{ x: 50, opacity: 0 }}
              animate={isInView ? { x: 0, opacity: 1 } : { x: 50, opacity: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
            >
              <motion.h2
                className="headingstyle font-heading font-extrabold leading-tight text-[#ffffff]"
                initial={{ y: 20, opacity: 0 }}
                animate={isInView ? { y: 0, opacity: 1 } : { y: 20, opacity: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                Children learn the most when they're having the most fun.
              </motion.h2>

              <motion.p
                className="textstyles mt-4 max-w-xl font-sans text-[#fff]"
                initial={{ y: 20, opacity: 0 }}
                animate={isInView ? { y: 0, opacity: 1 } : { y: 20, opacity: 0 }}
                transition={{ duration: 0.6, delay: 0.35 }}
              >
                It sounds simple, yet much of education is built around the opposite assumption. Too
                often, learning comes first and engagement is added later. We believe the order
                matters. We start with curiosity, play and discovery, then design the learning so
                deeply into the experience that it feels natural. That's why Logicology exists.
              </motion.p>

              <motion.div
                className="mt-6"
                initial={{ y: 20, opacity: 0 }}
                animate={isInView ? { y: 0, opacity: 1 } : { y: 20, opacity: 0 }}
                transition={{ duration: 0.6, delay: 0.5 }}
              >
                <CTAButton
                  text="Watch Our Philosophy"
                  onClick={() => setIsVideoOpen(true)}
                  bg="#fbb041"
                  color="#3d3b40"
                  hoverBg="#fa9e15"
                  hoverColor="#3d3b40"
                  size="md"
                  showShadow
                  showScaleOnHover
                  showScaleOnActive
                />
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      <VideoModal isOpen={isVideoOpen} onClose={() => setIsVideoOpen(false)} />
    </>
  );
}

// ─────────────────────────────────────────────────────────────────
// SECTION 3 — THE CASE FOR THINKING  (brand-tealDark)
// Text LEFT · Image RIGHT
// ─────────────────────────────────────────────────────────────────
function CaseForThinking() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section className="w-full bg-brand-tealDark" ref={ref}>
      <div className="px-4 py-12 md:mx-auto md:max-w-[75vw] lg:mx-auto lg:max-w-[75vw] lg:px-8">
        <div className="flex flex-col items-center md:flex-row">
          {/* LEFT — Text */}
          <motion.div
            className="order-2 flex w-full flex-col justify-center p-8 sm:p-12 md:order-1 md:w-1/2 md:pl-2"
            initial={{ x: -50, opacity: 0 }}
            animate={isInView ? { x: 0, opacity: 1 } : { x: -50, opacity: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <motion.h2
              className="headingstyle font-heading font-extrabold leading-tight text-white"
              initial={{ y: 20, opacity: 0 }}
              animate={isInView ? { y: 0, opacity: 1 } : { y: 20, opacity: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              In an AI World, Thinking Is the Real Advantage.
            </motion.h2>

            <motion.p
              className="textstyles mt-4 max-w-xl font-sans text-white/80"
              initial={{ y: 20, opacity: 0 }}
              animate={isInView ? { y: 0, opacity: 1 } : { y: 20, opacity: 0 }}
              transition={{ duration: 0.6, delay: 0.35 }}
            >
              Information has never been easier to access. What matters increasingly is the ability
              to reason, spot patterns, make connections and solve unfamiliar problems. Those skills
              aren't downloaded overnight. They develop through exploration, practice and meaningful
              challenges—especially when children enjoy the process enough to keep coming back to
              it.
            </motion.p>
          </motion.div>

          {/* RIGHT — MediaLayout image */}
          <motion.div
            className="order-1 flex w-full items-center justify-center py-6 md:order-2 md:w-1/2 md:py-0"
            initial={{ x: 50, opacity: 0, scale: 0.9 }}
            animate={isInView ? { x: 0, opacity: 1, scale: 1 } : { x: 50, opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.8, delay: 0.3 }}
          >
            <MediaLayout
              image="https://ik.imagekit.io/pratik2002/primetime_imag1.png?updatedAt=1757032084370"
              videoSrc=""
            />
          </motion.div>
        </div>
      </div>
    </section>
  );
}

// ─────────────────────────────────────────────────────────────────
// SECTION 4 — RESEARCHED, NOT REBRANDED  (brand-grayBg)
// Image LEFT · Text RIGHT
// ─────────────────────────────────────────────────────────────────
function ResearchedNotRebranded() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section className="w-full bg-brand-coral" ref={ref}>
      <div className="px-4 py-12 md:mx-auto md:max-w-[75vw] lg:mx-auto lg:max-w-[75vw] lg:px-8">
        <div className="flex flex-col items-center md:flex-row">
          {/* LEFT — MediaLayout image */}
          <motion.div
            className="order-1 flex w-full items-center justify-center py-6 md:w-1/2 md:py-0"
            initial={{ x: -50, opacity: 0, scale: 0.9 }}
            animate={isInView ? { x: 0, opacity: 1, scale: 1 } : { x: -50, opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.8, delay: 0.3 }}
          >
            <MediaLayout image="https://ik.imagekit.io/pratik2002/allbooks.JPG" videoSrc="" />
          </motion.div>

          {/* RIGHT — Text */}
          <motion.div
            className="order-2 flex w-full flex-col justify-center p-8 sm:p-12 md:w-1/2 md:pr-2"
            initial={{ x: 50, opacity: 0 }}
            animate={isInView ? { x: 0, opacity: 1 } : { x: 50, opacity: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <motion.h2
              className="headingstyle font-heading font-extrabold leading-tight text-white"
              initial={{ y: 20, opacity: 0 }}
              animate={isInView ? { y: 0, opacity: 1 } : { y: 20, opacity: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              The Hard Part Is Making Hard Things Feel Easy.
            </motion.h2>

            <motion.p
              className="textstyles mt-4 max-w-xl font-sans text-white"
              initial={{ y: 20, opacity: 0 }}
              animate={isInView ? { y: 0, opacity: 1 } : { y: 20, opacity: 0 }}
              transition={{ duration: 0.6, delay: 0.35 }}
            >
              Every Logicology game and book begins with an idea worth learning. From there, we
              simplify, test, refine and simplify again until children can take the first step with
              confidence. What feels abstract on paper should become approachable through play.
              Creating that experience takes far more work than adding a learning label to a
              product—but that's exactly the work we believe matters.
            </motion.p>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

// ─────────────────────────────────────────────────────────────────
// SECTION 5 — HOW WE DESIGN  (brand-coral)
// Principles grid LEFT · Image RIGHT
// ─────────────────────────────────────────────────────────────────
const cards = [
  {
    id: 1,
    icon: "💡",
    title: "Concept First, Never an Afterthought",
    body: "The learning is the foundation, not a label. Every product starts with an idea worth teaching — everything else is built around it.",
    side: "left",
  },
  {
    id: 2,
    icon: "🏆",
    title: "Small Wins, Stacked",
    body: "Confidence grows fastest when children experience success early and often. We design for that first moment of 'I got it.'",
    side: "right",
  },
  {
    id: 3,
    icon: "✋",
    title: "No Overwhelm",
    body: "If a child needs constant guidance to begin, we haven't simplified enough. The first step should always feel within reach.",
    side: "left",
  },
  {
    id: 4,
    icon: "🎯",
    title: "Fun Is the Delivery System",
    body: "Engagement isn't the reward for learning. It's how learning happens. We never ask children to earn the fun.",
    side: "right",
  },
];

const CARD_COLORS = ["#009a88", "#f26c3f", "#fbb041", "#1b4552"];
const CARD_TEXT_COLORS = ["#ffffff", "#ffffff", "#3d3b40", "#ffffff"];

function TrustCard({
  icon,
  title,
  body,
  visible,
  delay,
  side,
  colorIndex,
}: {
  icon: React.ReactNode;
  title: React.ReactNode;
  body: React.ReactNode;
  visible: boolean;
  delay: number;
  side: "left" | "right";
  colorIndex: number;
}) {
  const textColor = CARD_TEXT_COLORS[colorIndex % CARD_TEXT_COLORS.length];

  return (
    <div
      className="flex w-full max-w-[280px] flex-col justify-center rounded-[20px] p-6"
      style={{
        backgroundColor: CARD_COLORS[colorIndex % CARD_COLORS.length],
        minHeight: 200,
        opacity: visible ? 1 : 0,
        transform: visible
          ? "translateX(0)"
          : side === "left"
            ? "translateX(-40px)"
            : "translateX(40px)",
        transition: `opacity 0.55s ease ${delay}ms, transform 0.55s ease ${delay}ms`,
      }}
    >
      {/* Title */}
      <h3
        className="text-center font-heading text-[17px] font-extrabold leading-snug"
        style={{ color: textColor }}
      >
        {title}
      </h3>

      {/* Body */}
      <p
        className="mt-3 text-center font-sans text-[14px] leading-relaxed"
        style={{ color: textColor, opacity: colorIndex === 2 ? 0.85 : 0.9 }}
      >
        {body}
      </p>
    </div>
  );
}

export function HowWeDesign() {
  const sectionRef = useRef<HTMLElement>(null);
  const [triggered, setTriggered] = useState(false);

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
        if (entry.isIntersecting) setTriggered(true);
        else setTriggered(false);
      },
      { threshold: 0.15 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const IMAGE_DELAY = 300;
  const CARD_BASE_DELAY = 500;
  const CARD_STAGGER = 150;

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
      className="relative w-full overflow-hidden bg-white px-4 py-16 md:px-8"
    >
      <div className="relative mx-auto max-w-6xl">
        <h2
        className="mb-12 text-center font-heading text-[32px] font-extrabold leading-tight md:text-[40px] text-brand-black"
        
      >
        The Principles Behind Every Product
      </h2>
        <div className="grid grid-cols-1 items-center gap-6 md:grid-cols-[1fr_420px_1fr]">
          {/* ── LEFT CARDS ── */}
          <div className="flex flex-col items-center gap-5 md:items-end">
            {leftCards.map((card, idx) => (
              <TrustCard
                key={card.id}
                icon={card.icon}
                title={card.title}
                body={card.body}
                visible={triggered}
                delay={cardDelayMap[card.id]}
                side="left"
                colorIndex={idx}
              />
            ))}
          </div>

          {/* ── CENTER IMAGE ── */}
          <div className="order-first flex flex-col items-center justify-center md:order-none">
            <div
              className="relative w-full overflow-hidden rounded-[28px]"
              style={{
                aspectRatio: "1 / 1",
                border: "12px solid #4BBFDC",
                opacity: triggered ? 1 : 0,
                transform: triggered ? "translateY(0)" : "translateY(48px)",
                transition: `opacity 0.65s ease ${IMAGE_DELAY}ms, transform 0.65s ease ${IMAGE_DELAY}ms`,
              }}
            >
              <Image
                src="https://ik.imagekit.io/pratik11/TURN-THE-TABLE-HERO-IMAGE_withbackground_d0b4XcVqQ.png"
                alt="Turn The Tables card game"
                fill
                className="object-cover"
                sizes="(max-width: 768px) 90vw, 420px"
              />
            </div>
          </div>

          {/* ── RIGHT CARDS ── */}
          <div className="flex flex-col items-center gap-5 md:items-start">
            {rightCards.map((card, idx) => (
              <TrustCard
                key={card.id}
                icon={card.icon}
                title={card.title}
                body={card.body}
                visible={triggered}
                delay={cardDelayMap[card.id]}
                side="right"
                colorIndex={idx + 2}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

// ─────────────────────────────────────────────────────────────────
// SECTION 6 — THE WIN-WIN  (brand-gold)
// Image LEFT · Text RIGHT  (same as BrandPromise)
// ─────────────────────────────────────────────────────────────────
function TheWinWin() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section className="w-full bg-brand-gold" ref={ref}>
      <div className="px-4 py-12 md:mx-auto md:max-w-[75vw] lg:mx-auto lg:max-w-[75vw] lg:px-8">
        <div className="flex flex-col items-center md:flex-row">
          {/* LEFT — MediaLayout image */}
          <motion.div
            className="order-1 flex w-full items-center justify-center py-6 md:w-1/2 md:py-0"
            initial={{ x: -50, opacity: 0, scale: 0.9 }}
            animate={isInView ? { x: 0, opacity: 1, scale: 1 } : { x: -50, opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.8, delay: 0.3 }}
          >
            <MediaLayout
              image="https://ik.imagekit.io/pratik11/CHILDREN-THINK-THEY-ARE-PALYING.png"
              videoSrc=""
            />
          </motion.div>

          {/* RIGHT — Text */}
          <motion.div
            className="order-2 flex w-full flex-col justify-center p-8 sm:p-12 md:w-1/2 md:pr-2"
            initial={{ x: 50, opacity: 0 }}
            animate={isInView ? { x: 0, opacity: 1 } : { x: 50, opacity: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <motion.h2
              className="headingstyle font-heading font-extrabold leading-tight text-[#3F2F14]"
              initial={{ y: 20, opacity: 0 }}
              animate={isInView ? { y: 0, opacity: 1 } : { y: 20, opacity: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              Children Think They're Playing. Parents Know They're Learning.
            </motion.h2>

            <motion.p
              className="textstyles mt-4 max-w-xl font-sans text-[#3F2F14]/80"
              initial={{ y: 20, opacity: 0 }}
              animate={isInView ? { y: 0, opacity: 1 } : { y: 20, opacity: 0 }}
              transition={{ duration: 0.6, delay: 0.35 }}
            >
              The best learning experiences don't ask children to choose between fun and growth.
              They get the challenge, adventure and excitement they're looking for. Parents get the
              confidence that something meaningful is happening underneath it all. That's the only
              kind of product we're interested in creating.
            </motion.p>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

// ─────────────────────────────────────────────────────────────────
// SECTION 7 — CLOSE  (brand-tealDark)
// ─────────────────────────────────────────────────────────────────
function CloseSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section className="w-full bg-brand-tealDark" ref={ref}>
      <div className="mx-auto px-4 py-24 sm:px-6 lg:max-w-[80vw] lg:px-8">
        <motion.div
          className="text-center"
          initial={{ opacity: 0, y: 36 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 36 }}
          transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
        >
          <h2 className="headingstyle font-heading font-extrabold text-white">
            Learn to Play. Play to Learn.
          </h2>
          <p className="textstyles mx-auto mt-4 max-w-2xl font-sans text-white/60">
            A simple idea that guides every game, every book and every experience we create.
          </p>

          <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
            <CTAButton
              text="Explore the Games"
              href="/products?tab=games"
              bg="#fbb041"
              color="#3d3b40"
              hoverBg="#fa9e15"
              hoverColor="#3d3b40"
              size="md"
              showShadow
              showScaleOnHover
              showScaleOnActive
              rightIcon={
                <svg
                  className="h-4 w-4 transition-transform group-hover:translate-x-1"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2.5}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              }
            />
            <CTAButton
              text="Explore the Books"
              href="/products?tab=books"
              bg="transparent"
              color="#ffffff"
              hoverBg="#fbb041"
              hoverColor="#3d3b40"
              size="md"
              showScaleOnHover
              showScaleOnActive
              className="border-2 border-white/60"
              rightIcon={
                <svg
                  className="h-4 w-4 transition-transform group-hover:translate-x-1"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2.5}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              }
            />
          </div>
        </motion.div>
      </div>
    </section>
  );
}

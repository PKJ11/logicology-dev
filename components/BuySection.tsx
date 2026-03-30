"use client";

import Image from "next/image";
import { useEffect, useMemo, useState, useRef, createContext, useContext } from "react";
import { motion, Variants, useReducedMotion, AnimatePresence } from "framer-motion";
import Link from "next/link";

type ScrollDir = "down" | "up";
const ScrollAnimationContext = createContext<ScrollDir>("down");

function useScrollDirection() {
  const [scrollDirection, setScrollDirection] = useState<ScrollDir>("down");
  const lastY = useRef(0);
  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY;
      const dir: ScrollDir = y > lastY.current ? "down" : "up";
      if (Math.abs(y - lastY.current) > 10) setScrollDirection(dir);
      lastY.current = y > 0 ? y : 0;
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  return scrollDirection;
}

function useWindowWidth() {
  const [width, setWidth] = useState(0);
  useEffect(() => {
    setWidth(window.innerWidth);
    const onResize = () => setWidth(window.innerWidth);
    window.addEventListener("resize", onResize, { passive: true });
    return () => window.removeEventListener("resize", onResize);
  }, []);
  return width;
}

function useSliderHeight(): string | null {
  const width = useWindowWidth();
  if (width === 0) return null;
  if (width <= 1800) return "min(460px, 60vh)";
  if (width <= 2100) return "min(660px, 67vh)";
  return "min(800px, 75vh)";
}

function useViewportAnimation<T extends HTMLElement>() {
  const [isInView, setIsInView] = useState(false);
  const ref = useRef<T | null>(null);
  const scrollDirection = useContext(ScrollAnimationContext);
  useEffect(() => {
    if (typeof window === "undefined" || !("IntersectionObserver" in window)) {
      setIsInView(true);
      return;
    }
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (scrollDirection === "down") setIsInView(entry.isIntersecting);
        else setIsInView(entry.intersectionRatio >= 0.1);
      },
      { threshold: [0, 0.1, 0.25, 0.5, 0.75, 1], rootMargin: "0px 0px -10% 0px" }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [scrollDirection]);
  return [ref, isInView] as const;
}

type Bullet = { title: string; desc: string; icon: string };
const BULLET_ICON = "https://ik.imagekit.io/pratik2002/bullter.JPG?updatedAt=1756384008169";
const BASE_BULLETS: Bullet[] = [
  { title: "STEM Skills", desc: "Strengthens problem-solving ability.", icon: "https://ik.imagekit.io/pratik2002/ICON-1.png?updatedAt=1757300409075" },
  { title: "Engaging Puzzles", desc: "Makes logic fun and interactive.", icon: "https://ik.imagekit.io/pratik2002/ICON-2.png?updatedAt=1757300409672" },
  { title: "Creative Learning", desc: "Develops imagination with logic.", icon: "https://ik.imagekit.io/pratik2002/ICON-3.png?updatedAt=1757300409119" },
  { title: "Fun for All", desc: "Perfect for group or solo play.", icon: "https://ik.imagekit.io/pratik2002/ICON-4.png?updatedAt=1757300408971" },
];

function shuffle<T>(arr: T[]) {
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}
const isDesktop = () =>
  typeof window !== "undefined" && window.matchMedia("(min-width: 768px)").matches;

const containerStagger: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.12, delayChildren: 0.1 } },
};
const bulletDesktop = (side: "left" | "right"): Variants => ({
  hidden: { opacity: 0, x: side === "left" ? -40 : 40 },
  show: { opacity: 1, x: 0, transition: { type: "spring", stiffness: 350, damping: 28 } },
});
const bulletMobile: Variants = {
  hidden: { opacity: 0, y: 10 },
  show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 320, damping: 26 } },
};

function BulletWithLine({ side, title, desc, icon }: { side: "left" | "right"; title: string; desc: string; icon: string }) {
  const prefersReduced = useReducedMotion();
  const [ref, isInView] = useViewportAnimation<HTMLDivElement>();
  return (
    <motion.div
      ref={ref}
      variants={bulletDesktop(side)}
      initial="hidden"
      animate={isInView ? "show" : "hidden"}
      className={`md:flex md:items-center md:gap-0 ${side === "left" ? "md:flex-row" : "md:flex-row-reverse"}`}
    >
      <motion.div
        className="relative hidden h-0 border-t-2 border-dashed border-brand-teal md:block ml-1 mr-1 w-8 lg:w-10 translate-y-4"
        style={{ transformOrigin: side === "left" ? "left center" : "right center" }}
        initial={{ opacity: 0, scaleX: 0 }}
        animate={isInView && !prefersReduced ? { opacity: 1, scaleX: 1 } : { opacity: 0, scaleX: 0 }}
        transition={{ duration: 1, ease: "easeOut", delay: 0.1 }}
      >
        <span className={`absolute -top-[4px] h-1.5 w-1.5 rounded-full bg-brand-teal ${side === "left" ? "right-0" : "left-0"}`} />
      </motion.div>
      <motion.div
        whileHover={prefersReduced ? undefined : { scale: isDesktop() ? 1.06 : 1 }}
        transition={{ type: "spring", stiffness: 400, damping: 24 }}
        className="shrink-0"
      >
        <div className="flex h-14 w-14 items-center justify-center rounded-full bg-brand-teal shadow">
          <Image src={icon || BULLET_ICON} alt="" width={40} height={40} className="h-9 w-9 bg-brand-teal object-contain" />
        </div>
      </motion.div>
      <div className={`ml-3 max-w-[200px] ${side === "right" ? "md:ml-0 md:mr-3 md:text-right" : ""}`}>
        <div className="text-sm font-semibold leading-tight text-brand-tealDark">{title}</div>
        <p className="mt-0.5 text-xs leading-snug text-brand-tealDark/80">{desc}</p>
      </div>
    </motion.div>
  );
}

function MobileBulletItem({ title, desc, icon }: { title: string; desc: string; icon: string }) {
  const prefersReduced = useReducedMotion();
  const [ref, isInView] = useViewportAnimation<HTMLDivElement>();
  return (
    <motion.div ref={ref} variants={bulletMobile} initial="hidden" animate={isInView ? "show" : "hidden"} className="flex flex-col items-center p-2 text-center">
      <motion.div whileHover={prefersReduced ? undefined : { scale: 1.05 }} transition={{ type: "spring", stiffness: 400, damping: 24 }} className="mb-2 shrink-0">
        <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-full bg-brand-teal shadow">
          <Image src={icon || BULLET_ICON} alt="" width={24} height={24} className="h-6 w-6 bg-brand-teal object-contain" />
        </div>
      </motion.div>
      <div className="text-xs mb-0.5 font-semibold leading-tight text-brand-tealDark">{title}</div>
      <p className="text-xs leading-snug text-brand-tealDark/80">{desc}</p>
    </motion.div>
  );
}

function ContentSlider({ children }: { children: React.ReactNode[] }) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [direction, setDirection] = useState(0);
  const windowWidth = useWindowWidth();
  const isMobile = windowWidth > 0 && windowWidth < 768;
  const desktopHeight = useSliderHeight();

  const slideVariants = {
    enter: (direction: number) => ({ x: direction > 0 ? "100%" : "-100%", opacity: 0 }),
    center: { x: 0, opacity: 1 },
    exit: (direction: number) => ({ x: direction < 0 ? "100%" : "-100%", opacity: 0 }),
  };

  const containerStyle: React.CSSProperties = isMobile
    ? { minHeight: "520px" }
    : desktopHeight
      ? { height: desktopHeight }
      : { height: "min(460px, 60vh)" };

  return (
    <div className="flex flex-col">
      <div className="relative overflow-hidden" style={containerStyle}>
        <AnimatePresence initial={false} custom={direction} mode="wait">
          <motion.div
            key={currentSlide}
            custom={direction}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ x: { type: "spring", stiffness: 300, damping: 30 }, opacity: { duration: 0.2 } }}
            className={isMobile ? "relative w-full" : "absolute inset-0 w-full h-full"}
          >
            {children[currentSlide]}
          </motion.div>
        </AnimatePresence>
      </div>
      <div className="flex justify-center gap-2 pt-2 pb-1">
        {children.map((_, idx) => (
          <button
            key={idx}
            onClick={() => { setDirection(idx > currentSlide ? 1 : -1); setCurrentSlide(idx); }}
            className={`transition-all duration-300 ${
              idx === currentSlide
                ? isMobile ? "w-5 h-1 bg-brand-teal rounded-full" : "w-6 h-1.5 bg-brand-teal rounded-full"
                : isMobile ? "w-1 h-1 bg-brand-teal/40 rounded-full hover:bg-brand-teal/60" : "w-1.5 h-1.5 bg-brand-teal/40 rounded-full hover:bg-brand-teal/60"
            }`}
            aria-label={`Go to slide ${idx + 1}`}
          />
        ))}
      </div>
    </div>
  );
}

function ShopNowButton() {
  return (
    <Link href="/products">
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="inline-flex items-center rounded-full bg-brand-teal px-5 md:px-7 py-2 md:py-2.5 font-semibold text-white shadow-lg transition-all duration-300 hover:bg-brand-tealDark hover:shadow-xl"
      >
        <span className="text-sm md:text-base">Shop Now</span>
        <svg className="ml-2 h-3.5 w-3.5 md:h-4 md:w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </motion.button>
    </Link>
  );
}

export default function BuySection() {
  const [bullets, setBullets] = useState<Bullet[]>(BASE_BULLETS);
  const [isMounted, setIsMounted] = useState(false);
  const scrollDirection = useScrollDirection();

  useEffect(() => {
    setIsMounted(true);
    setBullets((prev) => shuffle(prev));
  }, []);

  const { leftBullets, rightBullets } = useMemo(() => {
    const mid = Math.ceil(bullets.length / 2);
    return { leftBullets: bullets.slice(0, mid), rightBullets: bullets.slice(mid) };
  }, [bullets]);

  const [containerRef, isContainerInView] = useViewportAnimation<HTMLDivElement>();

  const FirstSlideContent = () => (
    <div className="h-full flex flex-col">
      {/*
        ── DESKTOP: 3-column flex row with explicit proportions ────────────
          Left  column → flex: 1  (1 share  = ~25% of row)
          Centre column → flex: 2  (2 shares = ~50% of row)  ← book image
          Right column → flex: 1  (1 share  = ~25% of row)

        This gives the book image exactly twice the width of each bullet
        panel, which is visually equivalent to "centre = 2/4, sides = 1/4".

        On mobile (<md) bullet panels are hidden; a 2×2 MobileBulletItem
        grid appears below the image instead (flex-col stacking).
        ────────────────────────────────────────────────────────────────────
      */}
      <div className="flex-1 flex flex-col md:flex-row md:items-center md:gap-2">

        {/* LEFT bullets — 1 flex share */}
        <motion.div
          variants={containerStagger}
          initial="hidden"
          animate={isContainerInView ? "show" : "hidden"}
          className="hidden md:flex md:flex-col md:justify-center md:space-y-8"
          style={{ flex: "1 1 0%", minWidth: 0 }}
        >
          {leftBullets.map((b, i) => (
            <BulletWithLine key={`L-${i}-${b.title}`} side="right" title={b.title} desc={b.desc} icon={b.icon} />
          ))}
        </motion.div>

        {/* CENTRE image — 2 flex shares (twice as wide as each side) */}
        <div
          className="flex items-center justify-center"
          style={{ flex: "2 1 0%", minWidth: 0 }}
        >
          <div className="relative w-full max-w-[260px] sm:max-w-[300px] md:max-w-none">
            <Image
              src="https://ik.imagekit.io/pratik2002/ALL%20BOOK%20COVER%20MOCKUP.png"
              alt="Logicoland Book"
              width={620}
              height={560}
              className="h-full w-full object-contain"
              priority
            />
          </div>
        </div>

        {/* RIGHT bullets — 1 flex share */}
        <motion.div
          variants={containerStagger}
          initial="hidden"
          animate={isContainerInView ? "show" : "hidden"}
          className="hidden md:flex md:flex-col md:justify-center md:space-y-8"
          style={{ flex: "1 1 0%", minWidth: 0 }}
        >
          {rightBullets.map((b, i) => (
            <BulletWithLine key={`R-${i}-${b.title}`} side="left" title={b.title} desc={b.desc} icon={b.icon} />
          ))}
        </motion.div>

        {/* MOBILE: 2×2 bullet grid */}
        <motion.div
          variants={containerStagger}
          initial="hidden"
          animate={isContainerInView ? "show" : "hidden"}
          className="mt-3 grid grid-cols-2 gap-2 md:hidden"
        >
          {bullets.map((b, i) => (
            <MobileBulletItem key={`M-${i}-${b.title}`} title={b.title} desc={b.desc} icon={b.icon} />
          ))}
        </motion.div>

      </div>
    </div>
  );

  const SecondSlideContent = () => {
    const windowWidth = useWindowWidth();
    const isMobile = windowWidth > 0 && windowWidth < 768;
    const imageSrc = isMobile
      ? "/Images/Books/LOGICOLAND-ALL-BOOK-COVER-SLIDER 2 MOBILE VIEW.png"
      : "https://ik.imagekit.io/pratik2002/LOGICOLAND-ALL-BOOK-COVER-SLIDER%202%20(1).png";
    return (
      <div className="h-full flex items-center justify-center w-full py-2">
        <div className="relative w-full">
          <Image src={imageSrc} alt="Logicoland All Books Collection" width={1200} height={800} className="h-auto w-full object-contain" priority />
        </div>
      </div>
    );
  };

  if (!isMounted) {
    return (
      <section id="buy" className="w-full bg-brand-gold">
        <div className="mx-auto px-3 py-4 sm:px-5 sm:py-5">
          <div className="h-72 animate-pulse rounded-[22px] bg-white p-4 shadow-soft" />
        </div>
      </section>
    );
  }

  return (
    <ScrollAnimationContext.Provider value={scrollDirection}>
      <section id="buy" className="w-full bg-brand-gold">
        <div className="mx-auto px-3 py-4 sm:px-5 sm:py-5 md:py-6">
          <div
            ref={containerRef}
            className="rounded-[22px] bg-white px-4 py-4 shadow-soft sm:px-6 sm:py-5 flex flex-col w-[95%] mx-auto"
          >
            <div className="text-center mb-3">
              <h2 className="headingstyle font-heading font-extrabold text-brand-teal">
                Logicoland Book Series
              </h2>
              <p className="textstyles mt-1 font-sans text-brand-tealDark/80">
                Logic through coloring!
              </p>
            </div>

            <div className="w-[75vw] mx-auto">
              <ContentSlider>
                <FirstSlideContent />
                <SecondSlideContent />
              </ContentSlider>
            </div>

            <div className="text-center mt-3 mb-1">
              <ShopNowButton />
            </div>
          </div>
        </div>
      </section>
    </ScrollAnimationContext.Provider>
  );
}
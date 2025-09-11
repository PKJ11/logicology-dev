"use client";

import Image from "next/image";
import Link from "next/link";
import {
  useEffect,
  useMemo,
  useState,
  useRef,
  createContext,
  useContext,
} from "react";
import { motion, Variants, useReducedMotion } from "framer-motion";

/* ------------------------- Scroll Direction Context ------------------------ */

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

/* ----------------------- In-viewport animation helper ---------------------- */

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
        if (scrollDirection === "down") {
          setIsInView(entry.isIntersecting);
        } else {
          setIsInView(entry.intersectionRatio >= 0.1);
        }
      },
      {
        threshold: [0, 0.1, 0.25, 0.5, 0.75, 1],
        rootMargin: "0px 0px -10% 0px",
      }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [scrollDirection]);

  return [ref, isInView] as const;
}

/* --------------------------------- Data ----------------------------------- */

type Bullet = { title: string; desc: string; icon: string };

const BULLET_ICON =
  "https://ik.imagekit.io/pratik2002/bullter.JPG?updatedAt=1756384008169";

const BASE_BULLETS: Bullet[] = [
  {
    title: "STEM Skills",
    desc: "Strengthens problem-solving ability.",
    icon: "https://ik.imagekit.io/pratik2002/ICON-1.png?updatedAt=1757300409075",
  },
  {
    title: "Engaging Puzzles",
    desc: "Makes logic fun and interactive.",
    icon: "https://ik.imagekit.io/pratik2002/ICON-2.png?updatedAt=1757300409672",
  },
  {
    title: "Creative Learning",
    desc: "Develops imagination with logic.",
    icon: "https://ik.imagekit.io/pratik2002/ICON-3.png?updatedAt=1757300409119",
  },
  {
    title: "Fun for All",
    desc: "Perfect for group or solo play.",
    icon: "https://ik.imagekit.io/pratik2002/ICON-4.png?updatedAt=1757300408971",
  },
];


/* --------------------------------- Utils ---------------------------------- */

function shuffle<T>(arr: T[]) {
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

const isDesktop = () =>
  typeof window !== "undefined" &&
  window.matchMedia("(min-width: 768px)").matches;

/* -------------------------------- Variants -------------------------------- */

const containerStagger: Variants = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.12, delayChildren: 0.1 },
  },
};

const bulletDesktop = (side: "left" | "right"): Variants => ({
  hidden: { opacity: 0, x: side === "left" ? -40 : 40 },
  show: {
    opacity: 1,
    x: 0,
    transition: { type: "spring", stiffness: 350, damping: 28 },
  },
});

const bulletMobile: Variants = {
  hidden: { opacity: 0, x: 24 },
  show: {
    opacity: 1,
    x: 0,
    transition: { type: "spring", stiffness: 320, damping: 26 },
  },
};

const bookDesktop: Variants = {
  hidden: { opacity: 0, y: 30, rotate: -2 },
  show: {
    opacity: 1,
    y: 0,
    rotate: 0,
    transition: { type: "spring", stiffness: 220, damping: 22 },
  },
};

const bookMobile: Variants = {
  hidden: { opacity: 0, x: -24, rotate: -2 },
  show: {
    opacity: 1,
    x: 0,
    rotate: 0,
    transition: { type: "spring", stiffness: 220, damping: 22 },
  },
};

/* ----------------------------- Bullet Component ---------------------------- */

function BulletWithLine({
  side,
  title,
  desc,
  icon,
  mobile = false,
}: {
  side: "left" | "right";
  title: string;
  desc: string;
  icon: string;
  mobile?: boolean;
}) {
  const prefersReduced = useReducedMotion();
  const [ref, isInView] = useViewportAnimation<HTMLDivElement>();

  return (
    <motion.div
      ref={ref}
      variants={mobile ? bulletMobile : bulletDesktop(side)}
      initial="hidden"
      animate={isInView ? "show" : "hidden"}
      className={`md:flex md:items-start md:gap-0 ${
        side === "left" ? "md:flex-row" : "md:flex-row-reverse"
      }`}
    >
      {/* dashed connector line (desktop only) - SHORTER LINES */}
      <motion.div
        className={`relative hidden md:block h-0 border-t-2 border-dashed border-brand-teal/40 ${
          side === "left" ? "ml-2 mr-3 w-24 lg:w-32" : "mr-2 ml-3 w-24 lg:w-32"
        } translate-y-6`}
        style={{
          transformOrigin: side === "left" ? "left center" : "right center",
        }}
        initial={{ opacity: 0, scaleX: 0 }}
        animate={
          isInView && !prefersReduced
            ? { opacity: 1, scaleX: 1 }
            : { opacity: 0, scaleX: 0 }
        }
        transition={{ duration: 0.5, ease: "easeOut", delay: 0.1 }}
      >
        <span
          className={`absolute -top-[5px] h-2 w-2 rounded-full bg-brand-teal/60 ${
            side === "left" ? "right-0" : "left-0"
          }`}
        />
      </motion.div>

      {/* icon */}
      <motion.div
        whileHover={
          prefersReduced ? undefined : { scale: isDesktop() ? 1.06 : 1 }
        }
        transition={{ type: "spring", stiffness: 400, damping: 24 }}
        className="shrink-0"
      >
        <div className="h-12 w-12 rounded-full bg-[#1EB6E9] flex items-center justify-center shadow">
          <Image
            src={icon || BULLET_ICON}
            alt=""
            width={28}
            height={28}
            className="h-7 w-7 object-contain bg-[#1EB6E9]"
          />
        </div>
      </motion.div>

      {/* text */}
      <div className="ml-4 max-w-[280px]">
        <div className="textstyles font-semibold text-brand-tealDark leading-tight">
          {title}
        </div>
        <p className="mt-2 text-sm leading-relaxed text-brand-tealDark/80">
          {desc}
        </p>
      </div>
    </motion.div>
  );
}


/* ------------------------------- Main Section ------------------------------ */

export default function BuySection() {
  const [bullets, setBullets] = useState<Bullet[]>(BASE_BULLETS);
  const [isMounted, setIsMounted] = useState(false);
  const scrollDirection = useScrollDirection();

  // Randomize once on client (avoid SSR mismatch by shuffling after mount)
  useEffect(() => {
    setIsMounted(true);
    setBullets((prev) => shuffle(prev));
  }, []);

  const { leftBullets, rightBullets } = useMemo(() => {
    const mid = Math.ceil(bullets.length / 2);
    return {
      leftBullets: bullets.slice(0, mid),
      rightBullets: bullets.slice(mid),
    };
  }, [bullets]);

  const desktop = isDesktop();
  const [containerRef, isContainerInView] =
    useViewportAnimation<HTMLDivElement>();

  // Skeleton during SSR to avoid hydration mismatch
  if (!isMounted) {
    return (
      <section id="buy" className="w-full bg-brand-gold">
        <div className="lg:max-w-[80vw] mx-auto py-6 sm:py-8 md:py-10 px-3 sm:px-5">
          <div className="rounded-[22px] bg-white p-5 sm:p-8 shadow-soft animate-pulse h-96" />
        </div>
      </section>
    );
  }

  return (
    <ScrollAnimationContext.Provider value={scrollDirection}>
      <section id="buy" className="w-full bg-brand-gold">
        <div className="lg:max-w-[80vw] mx-auto py-6 sm:py-8 md:py-10 px-3 sm:px-5">
          <div
            ref={containerRef}
            className="rounded-[22px] bg-white p-5 sm:p-8 shadow-soft"
          >
            <div className="text-center mb-8">
              <h2
                className="headingstyle font-extrabold text-brand-teal font-heading"
                
              >
                Logicoland Volume 1
              </h2>
              <p
                className="textstyles text-brand-tealDark/80 mt-2 font-sans"
                
              >
                Logic through coloring!
              </p>
            </div>

            {/* Desktop: 3 cols; Mobile: 2 cols (image left, bullets right) */}
            <div className="grid grid-cols-2 md:grid-cols-3 items-center gap-y-10">
              {/* LEFT (desktop only) */}
              <motion.div
                variants={containerStagger}
                initial="hidden"
                animate={isContainerInView ? "show" : "hidden"}
                className="hidden md:block space-y-[150px] order-1"
              >
                {leftBullets.map((b, i) => (
                  <BulletWithLine
                    key={`L-${i}-${b.title}`}
                    side="right"
                    title={b.title}
                    desc={b.desc}
                    icon={b.icon}
                  />
                ))}
              </motion.div>

              {/* IMAGE (center on desktop, left on mobile) */}
              <div
                className="flex items-center justify-center order-1 md:order-2"
              >
                <div className="relative w-full max-w-[160px] sm:max-w-[240px] md:max-w-[500px] aspect-[3/4]">
                  <Image
                    src="https://ik.imagekit.io/pratik2002/logicolandv2_4oprmp0lO?updatedAt=1756947338913"
                    alt="Logicoland Book"
                    width={500}
                    height={667}
                    className="object-contain w-full h-full"
                    priority
                  />
                </div>
              </div>

              {/* RIGHT (desktop only) */}
              <motion.div
                variants={containerStagger}
                initial="hidden"
                animate={isContainerInView ? "show" : "hidden"}
                className="hidden md:block space-y-[150px] order-3"
              >
                {rightBullets.map((b, i) => (
                  <BulletWithLine
                    key={`R-${i}-${b.title}`}
                    side="left"
                    title={b.title}
                    desc={b.desc}
                    icon={b.icon}
                  />
                ))}
              </motion.div>

              {/* MOBILE bullets (right column) */}
              <motion.div
                variants={containerStagger}
                initial="hidden"
                animate={isContainerInView ? "show" : "hidden"}
                className="block md:hidden order-2 space-y-6"
              >
                {bullets.map((b, i) => (
                  <BulletWithLine
                    key={`M-${i}-${b.title}`}
                    side="right"
                    title={b.title}
                    desc={b.desc}
                    icon={b.icon}
                    mobile
                  />
                ))}
              </motion.div>
            </div>

            {/* CTA */}
            <div className="text-center mt-10">
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={
                  isContainerInView
                    ? { opacity: 1, y: 0 }
                    : { opacity: 0, y: 12 }
                }
                transition={{
                  type: "spring",
                  stiffness: 240,
                  damping: 20,
                  delay: 0.1,
                }}
                className="mt-6"
              >
                <Link
                  href="#buy"
                  className="group inline-flex items-center gap-2 rounded-full
                    border border-[#D7AD57] bg-transparent
                    px-6 py-3 font-semibold
                    text-[#D7AD57]
                    transition-colors
                    hover:bg-[#D7AD57] hover:text-white"
                >
                  Buy Now
                  <svg
                    className="w-4 h-4 transition-transform group-hover:translate-x-1"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </Link>
              </motion.div>
            </div>
          </div>
        </div>
      </section>
    </ScrollAnimationContext.Provider>
  );
}
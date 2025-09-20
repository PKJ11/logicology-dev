"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useState, useRef, createContext, useContext } from "react";
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

const BULLET_ICON = "https://ik.imagekit.io/pratik2002/bullter.JPG?updatedAt=1756384008169";

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
  typeof window !== "undefined" && window.matchMedia("(min-width: 768px)").matches;

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
  hidden: { opacity: 0, y: 20 },
  show: {
    opacity: 1,
    y: 0,
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
      className={`md:flex md:items-center md:gap-0 ${
        side === "left" ? "md:flex-row" : "md:flex-row-reverse"
      }`}
    >
      {/* dashed connector line (desktop only) - EVEN SHORTER LINES */}
      <motion.div
        className={`relative hidden h-0 border-t-2 border-dashed border-brand-teal/40 md:block ${
          side === "left" ? "ml-2 mr-2 w-12 lg:w-16" : "ml-2 mr-2 w-12 lg:w-16"
        } translate-y-6`}
        style={{
          transformOrigin: side === "left" ? "left center" : "right center",
        }}
        initial={{ opacity: 0, scaleX: 0 }}
        animate={
          isInView && !prefersReduced ? { opacity: 1, scaleX: 1 } : { opacity: 0, scaleX: 0 }
        }
        transition={{ duration: 0.5, ease: "easeOut", delay: 0.1 }}
      >
        <span
          className={`absolute -top-[5px] h-2 w-2 rounded-full bg-brand-teal/60 ${
            side === "left" ? "right-0" : "left-0"
          }`}
        />
      </motion.div>

      {/* icon - BIGGER */}
      <motion.div
        whileHover={prefersReduced ? undefined : { scale: isDesktop() ? 1.06 : 1 }}
        transition={{ type: "spring", stiffness: 400, damping: 24 }}
        className="shrink-0"
      >
        <div className="flex h-20 w-20 items-center justify-center rounded-full bg-[#1EB6E9] shadow">
          <Image
            src={icon || BULLET_ICON}
            alt=""
            width={64}
            height={64}
            className="h-14 w-14 bg-[#1EB6E9] object-contain"
          />
        </div>
      </motion.div>

      {/* text - right align for left bullets on desktop */}
      <div
        className={`ml-4 max-w-[280px] ${side === "right" ? "md:ml-0 md:mr-4 md:text-right" : ""}`}
      >
        <div className="textstyles font-semibold leading-tight text-brand-tealDark">{title}</div>
        <p className="mt-2 text-base leading-relaxed text-brand-tealDark/80">{desc}</p>
      </div>
    </motion.div>
  );
}

/* ----------------------------- Mobile Bullet Component ---------------------------- */

function MobileBulletItem({ title, desc, icon }: { title: string; desc: string; icon: string }) {
  const prefersReduced = useReducedMotion();
  const [ref, isInView] = useViewportAnimation<HTMLDivElement>();

  return (
    <motion.div
      ref={ref}
      variants={bulletMobile}
      initial="hidden"
      animate={isInView ? "show" : "hidden"}
      className="flex flex-col items-center p-4 text-center"
    >
      {/* icon on top */}
      <motion.div
        whileHover={prefersReduced ? undefined : { scale: 1.05 }}
        transition={{ type: "spring", stiffness: 400, damping: 24 }}
        className="mb-4 shrink-0"
      >
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-[#1EB6E9] shadow">
          <Image
            src={icon || BULLET_ICON}
            alt=""
            width={32}
            height={32}
            className="h-8 w-8 bg-[#1EB6E9] object-contain"
          />
        </div>
      </motion.div>

      {/* title below icon */}
      <div className="textstyles mb-2 font-semibold leading-tight text-brand-tealDark">{title}</div>

      {/* description below title */}
      <p className="text-base leading-relaxed text-brand-tealDark/80">{desc}</p>
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
  const [containerRef, isContainerInView] = useViewportAnimation<HTMLDivElement>();

  // Skeleton during SSR to avoid hydration mismatch
  if (!isMounted) {
    return (
      <section id="buy" className="w-full bg-brand-gold">
        <div className="mx-auto px-3 py-6 sm:px-5 sm:py-8 md:py-10 lg:max-w-[80vw]">
          <div className="h-96 animate-pulse rounded-[22px] bg-white p-5 shadow-soft sm:p-8" />
        </div>
      </section>
    );
  }

  return (
    <ScrollAnimationContext.Provider value={scrollDirection}>
      <section id="buy" className="w-full bg-brand-gold">
        <div className="mx-auto px-3 py-6 sm:px-5 sm:py-8 md:py-10 lg:max-w-[80vw]">
          <div ref={containerRef} className="rounded-[22px] bg-white p-5 shadow-soft sm:p-8">
            <div className="mb-8 text-center">
              <h2 className="headingstyle font-heading font-extrabold text-brand-teal">
                Logicoland Volume 1
              </h2>
              <p className="textstyles mt-2 font-sans text-brand-tealDark/80">
                Logic through coloring!
              </p>
            </div>

            {/* Desktop: 3 cols; Mobile: image on top, 2x2 grid below */}
            <div className="items-center gap-y-10 md:grid md:grid-cols-3">
              {/* LEFT (desktop only) */}
              <motion.div
                variants={containerStagger}
                initial="hidden"
                animate={isContainerInView ? "show" : "hidden"}
                className="order-1 hidden space-y-[150px] md:block"
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

              {/* IMAGE (center on desktop, top on mobile) */}
              <div className="order-1 mb-8 flex items-center justify-center md:order-2 md:mb-0">
                <div className="relative aspect-[4/3] w-full max-w-full sm:aspect-[3/4] sm:max-w-[240px] md:max-w-[500px]">
                  <Image
                    src="https://ik.imagekit.io/pratik2002/logicolandv2_4oprmp0lO?updatedAt=1756947338913"
                    alt="Logicoland Book"
                    width={500}
                    height={667}
                    className="h-full w-full object-contain"
                    priority
                  />
                </div>
              </div>

              {/* RIGHT (desktop only) */}
              <motion.div
                variants={containerStagger}
                initial="hidden"
                animate={isContainerInView ? "show" : "hidden"}
                className="order-3 hidden space-y-[150px] md:block"
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

              {/* MOBILE: 2x2 grid below the image */}
              <motion.div
                variants={containerStagger}
                initial="hidden"
                animate={isContainerInView ? "show" : "hidden"}
                className="order-2 mt-6 grid grid-cols-2 gap-4 md:hidden"
              >
                {bullets.map((b, i) => (
                  <MobileBulletItem
                    key={`M-${i}-${b.title}`}
                    title={b.title}
                    desc={b.desc}
                    icon={b.icon}
                  />
                ))}
              </motion.div>
            </div>

            {/* CTA */}
            <div className="mt-10 text-center">
              <div className="mt-6">
                <span className="inline-flex items-center rounded-full bg-brand-teal px-6 py-3 font-semibold text-white">
                  Volumes 2 to 5 coming soon…
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>
    </ScrollAnimationContext.Provider>
  );
}

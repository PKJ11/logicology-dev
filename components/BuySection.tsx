"use client";

import Image from "next/image";
import { useEffect, useMemo, useState, useRef, createContext, useContext } from "react";
import { motion, Variants, useReducedMotion, AnimatePresence } from "framer-motion";
import Link from "next/link";

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
  hidden: { opacity: 0, y: 10},
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
        className={`relative hidden h-0 border-t-2 border-dashed border-[#1EB6E9] md:block ${
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
          className={`absolute -top-[5px] h-2 w-2 rounded-full bg-[#1EB6E9] ${
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

/* ------------------------------- Slider Component ------------------------------ */

function Slider({ children }: { children: React.ReactNode[] }) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [direction, setDirection] = useState(0);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    setIsMobile(window.innerWidth < 768);
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const slideVariants = {
    enter: (direction: number) => ({
      x: direction > 0 ? "100%" : "-100%",
      opacity: 0,
    }),
    center: {
      x: 0,
      opacity: 1,
    },
    exit: (direction: number) => ({
      x: direction < 0 ? "100%" : "-100%",
      opacity: 0,
    }),
  };

  const nextSlide = () => {
    setDirection(1);
    setCurrentSlide((prev) => (prev + 1) % children.length);
  };

  const prevSlide = () => {
    setDirection(-1);
    setCurrentSlide((prev) => (prev - 1 + children.length) % children.length);
  };

  useEffect(() => {
    const timer = setInterval(() => {
      nextSlide();
    }, 5000); // Auto-advance every 5 seconds

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="relative overflow-hidden pb-16 md:pb-12">
      <AnimatePresence initial={false} custom={direction} mode="wait">
        <motion.div
          key={currentSlide}
          custom={direction}
          variants={slideVariants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{
            x: { type: "spring", stiffness: 300, damping: 30 },
            opacity: { duration: 0.2 },
          }}
          className="w-full"
        >
          {children[currentSlide]}
        </motion.div>
      </AnimatePresence>

      {/* Navigation Dots - Responsive sizing */}
      <div className="absolute bottom-0 left-0 right-0 flex justify-center gap-2 md:gap-3 pb-2">
        {children.map((_, idx) => (
          <button
            key={idx}
            onClick={() => {
              setDirection(idx > currentSlide ? 1 : -1);
              setCurrentSlide(idx);
            }}
            className={`transition-all duration-300 ${
              idx === currentSlide 
                ? isMobile 
                  ? "w-6 h-1.5 bg-brand-teal rounded-full" 
                  : "w-8 h-2 bg-brand-teal rounded-full"
                : isMobile
                  ? "w-1.5 h-1.5 bg-brand-teal/40 rounded-full hover:bg-brand-teal/60"
                  : "w-2 h-2 bg-brand-teal/40 rounded-full hover:bg-brand-teal/60"
            }`}
            aria-label={`Go to slide ${idx + 1}`}
          />
        ))}
      </div>
    </div>
  );
}

/* ------------------------------- Shop Now Button Component ------------------------------ */

function ShopNowButton() {
  return (
    <Link href="/products">
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="inline-flex items-center rounded-full bg-brand-teal px-6 md:px-8 py-2.5 md:py-3 font-semibold text-white shadow-lg transition-all duration-300 hover:bg-brand-tealDark hover:shadow-xl"
      >
        <span className="text-base md:text-lg">Shop Now</span>
        <svg
          className="ml-2 h-4 w-4 md:h-5 md:w-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 5l7 7-7 7"
          />
        </svg>
      </motion.button>
    </Link>
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

  // Slide 1: Original content with bullets and book image
  const FirstSlide = () => (
    <div>
      <div className="text-center">
        <h2 className="headingstyle font-heading font-extrabold text-brand-teal">
          Logicoland Book Series
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
              src="https://ik.imagekit.io/pratik2002/ALL%20BOOK%20COVER%20MOCKUP.png"
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
      
      {/* Shop Now Button for First Slide - Added extra margin on mobile */}
      <div className="mt-12 md:mt-8 text-center">
        <ShopNowButton />
      </div>
    </div>
  );

  // Slide 2: Full book cover image with same heading
  const SecondSlide = () => {
    const [isMobile, setIsMobile] = useState(false);
    
    useEffect(() => {
      setIsMobile(window.innerWidth < 768);
      const handleResize = () => setIsMobile(window.innerWidth < 768);
      window.addEventListener('resize', handleResize);
      return () => window.removeEventListener('resize', handleResize);
    }, []);
    
    const imageSrc = isMobile
      ? "/Images/Books/LOGICOLAND-ALL-BOOK-COVER-SLIDER 2 MOBILE VIEW.png" // Local public folder image for mobile
      : "https://ik.imagekit.io/pratik2002/LOGICOLAND-ALL-BOOK-COVER-SLIDER%202%20(1).png";

    return (
      <div className="flex flex-col items-center justify-center">
        <div className="text-center">
          <h2 className="headingstyle font-heading font-extrabold text-brand-teal">
            Logicoland Book Series
          </h2>
          <p className="textstyles mt-2 font-sans text-brand-tealDark/80">
            Logic through coloring!
          </p>
        </div>
        
        <div className="mt-8 flex w-full items-center justify-center">
          <div className="relative w-full max-w-3xl">
            <Image
              src={imageSrc}
              alt="Logicoland All Books Collection"
              width={1200}
              height={800}
              className="h-auto w-full object-contain"
              priority
            />
          </div>
        </div>
        
        {/* Shop Now Button for Second Slide */}
        <div className="mt-12 md:mt-8 text-center">
          <ShopNowButton />
        </div>
      </div>
    );
  };

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
            <Slider>
              <FirstSlide />
              <SecondSlide />
            </Slider>
          </div>
        </div>
      </section>
    </ScrollAnimationContext.Provider>
  );
}
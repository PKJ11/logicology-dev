"use client";
import { useState, useEffect, useRef, useCallback, ComponentType } from "react";
import { useInView, AnimatePresence, motion } from "framer-motion";
import HeroSlide1 from "./slides/HeroSlide1";
import HeroSlide2 from "./slides/HeroSlide2";
import HeroSlide3 from "./slides/HeroSlide3";

export interface SlideProps {
  isInView: boolean;
}

const SLIDES: ComponentType<SlideProps>[] = [HeroSlide1, HeroSlide2, HeroSlide3];
const AUTO_PLAY_MS = 5000;
const DRAG_THRESHOLD = 50;

export default function HeroSlider() {
  const [active, setActive] = useState<number>(0);
  const [direction, setDirection] = useState<"next" | "prev">("next");
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const dragStartX = useRef<number | null>(null);
  const isDragging = useRef(false);

  const startTimer = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      setDirection("next");
      setActive((prev) => (prev + 1) % SLIDES.length);
    }, AUTO_PLAY_MS);
  }, []);

  useEffect(() => {
    startTimer();
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [startTimer]);

  const goTo = useCallback(
    (idx: number) => {
      const normalised = (idx + SLIDES.length) % SLIDES.length;
      setDirection(
        normalised > active || (active === SLIDES.length - 1 && normalised === 0)
          ? "next"
          : "prev"
      );
      setActive(normalised);
      startTimer();
    },
    [active, startTimer]
  );

  const onPointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    dragStartX.current = e.clientX;
    isDragging.current = false;
    e.currentTarget.setPointerCapture(e.pointerId);
  };

  const onPointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (dragStartX.current === null) return;
    if (Math.abs(e.clientX - dragStartX.current) > 5) isDragging.current = true;
  };

  const onPointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    if (dragStartX.current === null) return;
    const delta = e.clientX - dragStartX.current;
    dragStartX.current = null;
    if (!isDragging.current) return;
    if (delta < -DRAG_THRESHOLD) goTo(active + 1);
    else if (delta > DRAG_THRESHOLD) goTo(active - 1);
    isDragging.current = false;
  };

  const onPointerCancel = () => {
    dragStartX.current = null;
    isDragging.current = false;
  };

  const ActiveSlide = SLIDES[active];

  const variants = {
    enter: (dir: "next" | "prev") => ({
      x: dir === "next" ? "100%" : "-100%",
    }),
    center: {
      x: "0%",
    },
    exit: (dir: "next" | "prev") => ({
      x: dir === "next" ? "-30%" : "30%",
    }),
  };

  return (
    <div
      className="relative overflow-hidden select-none"
      ref={ref}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onPointerCancel={onPointerCancel}
      style={{ cursor: "grab", touchAction: "pan-y" }}
    >
      {/*
        ✅ No fixed height — wrapper sizes naturally to the entering slide.
           The entering slide is position: relative (takes up space).
           The exiting slide is position: absolute (removed from flow, no height impact).
           This works at any screen size automatically.
      */}
      <div style={{ position: "relative" }}>
        <AnimatePresence mode="sync" initial={false} custom={direction}>
          <motion.div
            key={active}
            custom={direction}
            variants={variants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{
              x: {
                type: "tween",
                duration: 0.45,
                ease: [0.32, 0, 0.16, 1],
              },
            }}
            style={{
              // ✅ Entering slide: relative so it drives the wrapper height
              // ✅ Exiting slide: Framer Motion applies position:absolute automatically
              //    via its internal exit handling with mode="sync"
              width: "100%",
              willChange: "transform",
            }}
          >
            <ActiveSlide isInView={isInView} />
          </motion.div>
        </AnimatePresence>
      </div>

      <style>{`
        .hs-bullet {
          width: 12px; height: 12px; border-radius: 50%;
          background: rgba(255,255,255,0.6); border: none;
          padding: 0; margin: 0; cursor: pointer;
          transition: all 0.3s ease; position: relative;
          display: inline-flex; align-items: center; justify-content: center;
          flex-shrink: 0; -webkit-appearance: none; appearance: none;
          outline: none; -webkit-tap-highlight-color: transparent;
          touch-action: manipulation; min-width: unset; min-height: unset;
          line-height: 1; font-size: 0;
        }
        .hs-bullet-inner {
          width: 6px; height: 6px; border-radius: 50%;
          background: white; opacity: 0; transition: opacity 0.3s ease;
          pointer-events: none; display: block; flex-shrink: 0;
        }
        .hs-bullet--active {
          background: transparent; border: 2px solid white;
          width: 16px; height: 16px;
        }
        .hs-bullet--active .hs-bullet-inner { opacity: 1; }
      `}</style>

      {/* Dot navigation */}
      <div
        className="absolute left-1/2 z-30 flex -translate-x-1/2 items-center gap-2"
        style={{ bottom: "16px" }}
      >
        {SLIDES.map((_, i) => (
          <button
            key={i}
            onClick={() => goTo(i)}
            onPointerDown={(e) => e.stopPropagation()}
            onPointerUp={(e) => e.stopPropagation()}
            aria-label={`Go to slide ${i + 1}`}
            className={`hs-bullet ${i === active ? "hs-bullet--active" : ""}`}
          >
            <span className="hs-bullet-inner" />
          </button>
        ))}
      </div>
    </div>
  );
}
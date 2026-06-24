"use client";
import { useState, useEffect, useRef, useCallback, ComponentType } from "react";
import { useInView } from "framer-motion";
import HeroSlide1 from "./slides/HeroSlide1";
import HeroSlide2 from "./slides/HeroSlide2";
import HeroSlide3 from "./slides/HeroSlide3";

export interface SlideProps {
  isInView: boolean;
}

const SLIDES: ComponentType<SlideProps>[] = [HeroSlide1, HeroSlide2, HeroSlide3];
const AUTO_PLAY_MS = 5000;

export default function HeroSlider() {
  const [active, setActive] = useState<number>(0);
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const startTimer = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      setActive((prev) => (prev + 1) % SLIDES.length);
    }, AUTO_PLAY_MS);
  }, []);

  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [startTimer]);

  const handleDotClick = (idx: number) => setActive(idx);

  const ActiveSlide = SLIDES[active];

  return (
    <div className="relative" ref={ref}>
      <ActiveSlide isInView={isInView} />

      <style>{`
  .hs-bullet {
    width: 12px;
    height: 12px;
    border-radius: 50%;
    background: rgba(255, 255, 255, 0.6);
    border: none;
    padding: 0;
    margin: 0;
    cursor: pointer;
    transition: all 0.3s ease;
    position: relative;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
    -webkit-appearance: none;
    appearance: none;
    outline: none;
    -webkit-tap-highlight-color: transparent;
    touch-action: manipulation;
    min-width: unset;
    min-height: unset;
    line-height: 1;
    font-size: 0;
  }
  .hs-bullet-inner {
    width: 6px;
    height: 6px;
    border-radius: 50%;
    background: white;
    opacity: 0;
    transition: opacity 0.3s ease;
    pointer-events: none;
    display: block;
    flex-shrink: 0;
  }
  .hs-bullet--active {
    background: transparent;
    border: 2px solid white;
    width: 16px;
    height: 16px;
  }
  .hs-bullet--active .hs-bullet-inner {
    opacity: 1;
  }
`}</style>

      <div
        className="absolute left-1/2 z-30 flex -translate-x-1/2 items-center gap-2"
        style={{ bottom: "16px" }}
      >
        {SLIDES.map((_, i) => (
          <button
            key={i}
            onClick={() => handleDotClick(i)}
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

"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useInView } from "framer-motion";
import { Bot, PartyPopper, X } from "lucide-react";

type Puzzle = {
  word: string;
  scrambled: string;
  category: string;
  image: string;
};

const IMAGE_DIR = "/Images/anagram%20images";

const INITIAL_PUZZLES: Puzzle[] = [
  { word: "cake", scrambled: "kace", category: "Food", image: `${IMAGE_DIR}/cake.svg` },
  { word: "bird", scrambled: "brid", category: "Animal", image: `${IMAGE_DIR}/bird.svg` },
  { word: "jump", scrambled: "jupm", category: "Action", image: `${IMAGE_DIR}/jump.svg` },
  { word: "star", scrambled: "srat", category: "Sky", image: `${IMAGE_DIR}/star.svg` },
  { word: "dance", scrambled: "cande", category: "Activity", image: `${IMAGE_DIR}/dance.svg` },
  { word: "apple", scrambled: "alppe", category: "Fruit", image: `${IMAGE_DIR}/apple.svg` },
  { word: "fruit", scrambled: "urfit", category: "Food", image: `${IMAGE_DIR}/fruit.svg` },
  { word: "horse", scrambled: "sorhe", category: "Animal", image: `${IMAGE_DIR}/horse.svg` },
  { word: "shirt", scrambled: "thirs", category: "Clothing", image: `${IMAGE_DIR}/shirt.svg` },
  { word: "green", scrambled: "geern", category: "Color", image: `${IMAGE_DIR}/green.svg` },
  { word: "friend", scrambled: "feirnd", category: "People", image: `${IMAGE_DIR}/friend.svg` },
  { word: "bottle", scrambled: "tobtle", category: "Object", image: `${IMAGE_DIR}/bottle.svg` },
  { word: "burger", scrambled: "gurber", category: "Food", image: `${IMAGE_DIR}/burger.svg` },
  { word: "pencil", scrambled: "pecnil", category: "School", image: `${IMAGE_DIR}/pencil.svg` },
  { word: "orange", scrambled: "roange", category: "Fruit", image: `${IMAGE_DIR}/orange.svg` },
  { word: "school", scrambled: "lchoos", category: "Place", image: `${IMAGE_DIR}/school.svg` },
  { word: "rainbow", scrambled: "roinbaw", category: "Nature", image: `${IMAGE_DIR}/rainbow.svg` },
  { word: "tuesday", scrambled: "suetday", category: "Day", image: `${IMAGE_DIR}/tuesday.svg` },
  { word: "teacher", scrambled: "reachet", category: "People", image: `${IMAGE_DIR}/teacher.svg` },
  { word: "pumpkin", scrambled: "punpkim", category: "Food", image: `${IMAGE_DIR}/pumpkin.svg` },
];

// Palette matched to the "Word Builder" design system.
const NAVY = "#1B4552";
const TEAL = "#009A88";
const ORANGE = "#FA9E15";
const ORANGE_LIGHT = "#FBB041";
const GRAY_TEXT = "#707070";
const GRAY_LIGHT = "#F2F2F2";
const OFFWHITE = "#FCFCFC";

const FONT_IMPORT = `@import url('https://fonts.googleapis.com/css2?family=Alfa+Slab+One&display=swap');`;

export default function AnagramPage() {
  return (
    <main className="h-screen w-full overflow-hidden" style={{ backgroundColor: NAVY }}>
      <style dangerouslySetInnerHTML={{ __html: FONT_IMPORT }} />
      <section id="anagram-game" className="h-full w-full">
        <AnagramGame />
      </section>
    </main>
  );
}

function AnagramGame() {
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-100px" });

  const [puzzles, setPuzzles] = useState<Puzzle[]>(INITIAL_PUZZLES);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedCol, setSelectedCol] = useState<number | null>(null);
  const [completed, setCompleted] = useState<boolean[]>(() => INITIAL_PUZZLES.map(() => false));
  const [showHint, setShowHint] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const puzzle = puzzles[currentIndex];
  const letters = puzzle.scrambled.split("");
  const isCompleted = completed[currentIndex];

  useEffect(() => {
    setSelectedCol(null);
    setShowHint(false);
    setShowSuccess(false);
  }, [currentIndex]);

  function handleCellClick(col: number) {
    if (isCompleted) return;

    if (selectedCol === null) {
      setSelectedCol(col);
      return;
    }

    if (selectedCol === col) {
      setSelectedCol(null);
      return;
    }

    // Two letters are now selected — swap them.
    const chars = puzzle.scrambled.split("");
    [chars[selectedCol], chars[col]] = [chars[col], chars[selectedCol]];
    const newScrambled = chars.join("");

    setPuzzles((prev) => {
      const next = [...prev];
      next[currentIndex] = { ...next[currentIndex], scrambled: newScrambled };
      return next;
    });
    setSelectedCol(null);

    if (newScrambled === puzzle.word) {
      setCompleted((prev) => {
        const next = [...prev];
        next[currentIndex] = true;
        return next;
      });
      setShowSuccess(true);
    }
  }

  function resetPuzzle() {
    setPuzzles((prev) => {
      const next = [...prev];
      next[currentIndex] = { ...INITIAL_PUZZLES[currentIndex] };
      return next;
    });
    setCompleted((prev) => {
      const next = [...prev];
      next[currentIndex] = false;
      return next;
    });
    setSelectedCol(null);
    setShowSuccess(false);
  }

  function resetAll() {
    setPuzzles(INITIAL_PUZZLES);
    setCompleted(INITIAL_PUZZLES.map(() => false));
    setCurrentIndex(0);
    setSelectedCol(null);
    setShowSuccess(false);
  }

  function goNext() {
    if (currentIndex < puzzles.length - 1) setCurrentIndex((i) => i + 1);
  }

  function goPrev() {
    if (currentIndex > 0) setCurrentIndex((i) => i - 1);
  }

  const completedCount = completed.filter(Boolean).length;
  const progress = completedCount / puzzles.length;
  const RING_RADIUS = 19;
  const RING_CIRCUMFERENCE = 2 * Math.PI * RING_RADIUS;

  return (
    <div
      ref={sectionRef}
      className="flex h-full w-full items-center justify-center px-3 py-3 sm:px-6 sm:py-6"
    >
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.5 }}
        className="relative mx-auto w-full max-w-[640px] rounded-[28px] p-4 shadow-soft ring-1 ring-black/5 sm:p-8"
        style={{ backgroundColor: OFFWHITE, maxHeight: "calc(100vh - 24px)", overflow: "hidden" }}
      >
        {/* Close button */}
        <button
          aria-label="Exit game"
          className="absolute right-4 top-4 flex h-8 w-8 items-center justify-center rounded-full text-white shadow-sm transition-transform duration-200 hover:scale-110 sm:right-6 sm:top-6 sm:h-9 sm:w-9"
          style={{ backgroundColor: ORANGE }}
        >
          <X className="h-4 w-4 sm:h-5 sm:w-5" strokeWidth={3} />
        </button>

        {/* Puzzle counter — top-left */}
        <div className="mb-3 flex items-center justify-start gap-2.5 pr-10 sm:mb-2 sm:pr-12">
          <div
            className="relative flex h-11 w-11 shrink-0 items-center justify-center rounded-full"
            style={{ backgroundColor: NAVY }}
          >
            <svg viewBox="0 0 44 44" className="absolute inset-0 h-11 w-11 -rotate-90">
              <circle
                cx={22}
                cy={22}
                r={RING_RADIUS}
                fill="none"
                stroke="rgba(255,255,255,0.2)"
                strokeWidth={3}
              />
              <circle
                cx={22}
                cy={22}
                r={RING_RADIUS}
                fill="none"
                stroke={ORANGE_LIGHT}
                strokeWidth={3}
                strokeLinecap="round"
                strokeDasharray={RING_CIRCUMFERENCE}
                strokeDashoffset={RING_CIRCUMFERENCE * (1 - progress)}
              />
            </svg>
            <span className="relative text-xs font-bold text-white sm:text-sm">{currentIndex + 1}</span>
          </div>
          <span className="text-[11px] font-medium sm:text-xs" style={{ color: GRAY_TEXT }}>
            Puzzle {currentIndex + 1} of {puzzles.length}
          </span>
        </div>

        {/* Mascot logo */}
        <div
          className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-full sm:h-20 sm:w-20"
          style={{ backgroundColor: TEAL }}
        >
          <Bot className="h-7 w-7 text-white sm:h-10 sm:w-10" strokeWidth={2} />
        </div>

        {/* Title */}
        <h2
          className="text-center text-2xl sm:text-4xl"
          style={{ fontFamily: "'Alfa Slab One', serif", color: TEAL }}
        >
          Letter Swap
        </h2>
        <p className="mx-auto mt-2 max-w-sm text-center text-xs sm:text-base" style={{ color: GRAY_TEXT }}>
          Select Two Letters To Swap Them And Form The Correct Word.
        </p>

        {/* Category pill, with HINT / RESET buttons outside it */}
        <div className="mb-6 mt-5 flex flex-wrap items-center justify-between gap-2.5 sm:mt-7 sm:gap-3">
          <div
            className="w-fit max-w-full rounded-full px-4 py-2.5"
            style={{ backgroundColor: GRAY_LIGHT }}
          >
            <span className="whitespace-nowrap text-xs font-semibold sm:text-sm" style={{ color: NAVY }}>
              Category: {puzzle.category}
            </span>
          </div>

          <div className="flex shrink-0 gap-2">
            <button
              onClick={() => setShowHint(true)}
              disabled={isCompleted}
              className="rounded-full px-3.5 py-1.5 text-[11px] font-bold tracking-wide transition-transform duration-200 hover:scale-105 disabled:cursor-not-allowed disabled:opacity-40 sm:px-4 sm:text-xs"
              style={{ backgroundColor: ORANGE_LIGHT, color: NAVY }}
            >
              HINT
            </button>
            <button
              onClick={resetPuzzle}
              className="rounded-full px-3.5 py-1.5 text-[11px] font-bold tracking-wide text-white transition-transform duration-200 hover:scale-105 sm:px-4 sm:text-xs"
              style={{ backgroundColor: TEAL }}
            >
              RESET
            </button>
          </div>
        </div>

        {/* Letter tiles (click two to swap) */}
        <p
          className="mb-2 text-center text-[11px] font-semibold uppercase tracking-wide sm:text-xs"
          style={{ color: GRAY_TEXT }}
        >
          Click to swap the letter
        </p>
        <div className="mb-8 flex flex-wrap justify-center gap-2 sm:gap-3">
          {letters.map((letter, col) => {
            const isSelected = selectedCol === col;
            return (
              <motion.button
                key={col}
                onClick={() => handleCellClick(col)}
                disabled={isCompleted}
                whileTap={{ scale: isCompleted ? 1 : 0.92 }}
                className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border-2 text-xl font-bold transition-all duration-150 sm:h-16 sm:w-16 sm:text-2xl ${
                  isCompleted ? "cursor-default" : "cursor-pointer"
                }`}
                style={{
                  borderColor: TEAL,
                  backgroundColor: isSelected ? "rgba(0,154,136,0.14)" : OFFWHITE,
                  color: TEAL,
                  transform: isSelected ? "scale(1.08)" : "scale(1)",
                }}
              >
                {letter.toUpperCase()}
              </motion.button>
            );
          })}
        </div>

        {/* Navigation */}
        <div className="flex items-center justify-between gap-2 sm:gap-3">
          <button
            onClick={goPrev}
            disabled={currentIndex === 0}
            className="rounded-full px-3.5 py-1.5 text-[11px] font-bold tracking-wide text-white transition-transform duration-200 hover:scale-105 disabled:cursor-not-allowed disabled:opacity-30 disabled:hover:scale-100 sm:px-6 sm:py-2 sm:text-sm"
            style={{ backgroundColor: ORANGE_LIGHT }}
          >
            PREVIOUS
          </button>

          <button
            onClick={resetAll}
            className="text-[11px] font-medium underline-offset-2 hover:underline sm:text-xs"
            style={{ color: GRAY_TEXT }}
          >
            RESET ALL
          </button>

          <button
            onClick={goNext}
            disabled={!isCompleted || currentIndex === puzzles.length - 1}
            className="rounded-full px-5 py-1.5 text-[11px] font-bold tracking-wide text-white transition-transform duration-200 hover:scale-105 disabled:cursor-not-allowed disabled:opacity-30 disabled:hover:scale-100 sm:px-7 sm:py-2 sm:text-sm"
            style={{ backgroundColor: TEAL }}
          >
            NEXT
          </button>
        </div>
      </motion.div>

      {/* Success modal */}
      <AnimatePresence>
        {showSuccess && (
          <ModalBackdrop onClose={() => setShowSuccess(false)}>
            <p className="text-lg font-semibold sm:text-xl" style={{ color: NAVY }}>
              Well done
            </p>
            <div
              className="mx-auto my-4 flex h-24 w-24 items-center justify-center rounded-2xl sm:h-28 sm:w-28"
              style={{ backgroundColor: GRAY_LIGHT }}
            >
              <PartyPopper className="h-10 w-10 sm:h-12 sm:w-12" style={{ color: ORANGE }} />
            </div>
            <p className="text-sm sm:text-base" style={{ color: GRAY_TEXT }}>
              &ldquo;{puzzle.word.toUpperCase()}&rdquo; is correct
            </p>
          </ModalBackdrop>
        )}
      </AnimatePresence>

      {/* Hint modal */}
      <AnimatePresence>
        {showHint && (
          <ModalBackdrop onClose={() => setShowHint(false)}>
            <p
              className="text-xs font-bold uppercase tracking-[0.15em] sm:text-sm"
              style={{ color: NAVY }}
            >
              Hint
            </p>
            <div
              className="mx-auto my-4 flex h-24 w-24 items-center justify-center rounded-2xl p-4 sm:h-28 sm:w-28"
              style={{ backgroundColor: GRAY_LIGHT }}
            >
              <img src={puzzle.image} alt={puzzle.category} className="h-full w-full object-contain" />
            </div>
            <p className="text-sm sm:text-base" style={{ color: GRAY_TEXT }}>
              It&apos;s a {puzzle.word.length}-letter word — a {puzzle.category.toLowerCase()}.
            </p>
          </ModalBackdrop>
        )}
      </AnimatePresence>
    </div>
  );
}

function ModalBackdrop({ children, onClose }: { children: React.ReactNode; onClose: () => void }) {
  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.3, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.3, opacity: 0 }}
        transition={{ type: "spring", stiffness: 300, damping: 22 }}
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-[280px] rounded-2xl p-6 text-center shadow-2xl sm:max-w-xs"
        style={{ backgroundColor: OFFWHITE }}
      >
        <button
          onClick={onClose}
          aria-label="Close"
          className="absolute right-3 top-3 flex h-7 w-7 items-center justify-center rounded-full text-white transition-transform duration-200 hover:scale-110"
          style={{ backgroundColor: ORANGE }}
        >
          <X className="h-3.5 w-3.5" strokeWidth={3} />
        </button>
        {children}
      </motion.div>
    </motion.div>
  );
}
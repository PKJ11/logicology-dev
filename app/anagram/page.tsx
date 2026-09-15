"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useInView } from "framer-motion";

type Puzzle = {
  word: string;
  scrambled: string;
  category: string;
};

const INITIAL_PUZZLES: Puzzle[] = [
  { word: "cake", scrambled: "kace", category: "Food" },
  { word: "bird", scrambled: "brid", category: "Animal" },
  { word: "jump", scrambled: "jupm", category: "Action" },
  { word: "star", scrambled: "srat", category: "Sky" },
  { word: "dance", scrambled: "cande", category: "Activity" },
  { word: "apple", scrambled: "alppe", category: "Fruit" },
  { word: "fruit", scrambled: "urfit", category: "Food" },
  { word: "horse", scrambled: "sorhe", category: "Animal" },
  { word: "shirt", scrambled: "thirs", category: "Clothing" },
  { word: "green", scrambled: "geern", category: "Color" },
  { word: "friend", scrambled: "feirnd", category: "People" },
  { word: "bottle", scrambled: "tobtle", category: "Object" },
  { word: "burger", scrambled: "gurber", category: "Food" },
  { word: "pencil", scrambled: "pecnil", category: "School" },
  { word: "orange", scrambled: "roange", category: "Fruit" },
  { word: "school", scrambled: "lchoos", category: "Place" },
  { word: "rainbow", scrambled: "roinbaw", category: "Nature" },
  { word: "tuesday", scrambled: "suetday", category: "Day" },
  { word: "teacher", scrambled: "reachet", category: "People" },
  { word: "pumpkin", scrambled: "punpkim", category: "Food" },
];

// Brand palette (see tailwind.config.ts -> theme.colors.brand)
const TEAL = "#0A8A80";
const TEAL_DARK = "#0B3F44";
const CORAL = "#E45C48";
const GOLD = "#fbb041";
const BLACK = "#3d3b40";

// Uniform grey-silver tile colors — cells never shift to blue/green, only
// their ring/border communicates state.
const SILVER = "#D7DADC";
const SILVER_LIGHT = "#E9EBEC";

export default function AnagramPage() {
  return (
    <main className="min-h-screen bg-brand-grayBg text-brand-tealDark">
      <section id="anagram-game">
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
  const [feedback, setFeedback] = useState<string | null>(null);
  const [showHint, setShowHint] = useState(false);

  const puzzle = puzzles[currentIndex];
  const letters = puzzle.scrambled.split("");
  const isCompleted = completed[currentIndex];

  useEffect(() => {
    setSelectedCol(null);
    setFeedback(null);
    setShowHint(false);
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
      setFeedback(`Well done — "${puzzle.word.toUpperCase()}" is correct.`);
    } else {
      setFeedback(null);
    }
  }

  function getHint() {
    if (isCompleted) return;
    setShowHint(true);
    window.setTimeout(() => setShowHint(false), 3000);
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
    setFeedback(null);
  }

  function resetAll() {
    setPuzzles(INITIAL_PUZZLES);
    setCompleted(INITIAL_PUZZLES.map(() => false));
    setCurrentIndex(0);
    setSelectedCol(null);
    setFeedback(null);
  }

  function goNext() {
    if (currentIndex < puzzles.length - 1) setCurrentIndex((i) => i + 1);
  }

  function goPrev() {
    if (currentIndex > 0) setCurrentIndex((i) => i - 1);
  }

  // First mismatched letter and the position it needs to swap with.
  const hintIndices = (() => {
    const scrambled = puzzle.scrambled.split("");
    const target = puzzle.word.split("");
    let a = -1;
    for (let i = 0; i < scrambled.length; i++) {
      if (scrambled[i] !== target[i]) {
        a = i;
        break;
      }
    }
    if (a === -1) return null;
    const b = scrambled.indexOf(target[a], a + 1);
    if (b === -1) return null;
    return [a, b] as const;
  })();

  const completedCount = completed.filter(Boolean).length;
  const progress = (completedCount / puzzles.length) * 100;

  return (
    <section
      ref={sectionRef}
      className="w-full bg-brand-grayBg px-3 py-10 sm:px-6 sm:py-16 md:py-20"
    >
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.5 }}
        className="mx-auto w-full max-w-[560px] rounded-[22px] bg-white p-4 shadow-soft ring-1 ring-black/5 sm:p-10"
      >
        {/* Header */}
        <div className="mb-6 text-center sm:mb-7">
          <h2 className="headingstyle mb-2 font-extrabold text-brand-tealDark">
            Anagram Swap Challenge
          </h2>
          <p className="textstyles mx-auto max-w-sm text-sm text-brand-tealDark/70 sm:text-base">
            Select two letters to swap them and form the correct word.
          </p>

          <div className="mx-auto mt-4 max-w-xs sm:mt-5">
            <div className="mb-1.5 flex justify-between text-[11px] font-medium text-brand-tealDark/60 sm:text-xs">
              <span>
                Puzzle {currentIndex + 1} of {puzzles.length}
              </span>
              <span>
                {completedCount} / {puzzles.length} completed
              </span>
            </div>
            <div className="h-1.5 overflow-hidden rounded-full bg-black/10">
              <div
                className="h-full rounded-full transition-all duration-500"
                style={{ width: `${progress}%`, backgroundColor: TEAL }}
              />
            </div>
          </div>
        </div>

        {/* Category + controls */}
        <div className="mb-5 flex flex-wrap items-center justify-between gap-2.5 rounded-xl bg-brand-grayBg px-3 py-2.5 sm:mb-6 sm:gap-3 sm:px-4 sm:py-3">
          <div>
            <span className="text-xs font-semibold text-brand-tealDark sm:text-sm">
              Category: {puzzle.category}
            </span>
            {isCompleted && (
              <span
                className="ml-2 rounded-full px-2 py-0.5 text-[10px] font-semibold sm:text-xs"
                style={{ backgroundColor: "rgba(10,138,128,0.12)", color: TEAL }}
              >
                Completed
              </span>
            )}
          </div>

          <div className="flex gap-2">
            <button
              onClick={getHint}
              disabled={isCompleted}
              className="rounded-full px-3.5 py-1.5 text-[11px] font-semibold text-brand-black transition-all duration-200 hover:scale-105 disabled:cursor-not-allowed disabled:opacity-40 sm:px-4 sm:text-xs"
              style={{ backgroundColor: GOLD }}
            >
              Hint
            </button>
            <button
              onClick={resetPuzzle}
              className="rounded-full border px-3.5 py-1.5 text-[11px] font-semibold transition-all duration-200 hover:scale-105 sm:px-4 sm:text-xs"
              style={{ borderColor: TEAL, color: TEAL }}
            >
              Reset
            </button>
          </div>
        </div>

        {/* Feedback */}
        {feedback && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-5 rounded-lg px-4 py-2.5 text-center text-sm font-medium"
            style={{ backgroundColor: "rgba(10,138,128,0.1)", color: TEAL_DARK }}
          >
            {feedback}
          </motion.div>
        )}

        {/* Letter cells */}
        <div className="mb-5 flex flex-wrap justify-center gap-1.5 sm:gap-3">
          {letters.map((letter, col) => {
            const isSelected = selectedCol === col;
            return (
              <motion.button
                key={col}
                onClick={() => handleCellClick(col)}
                disabled={isCompleted}
                whileTap={{ scale: isCompleted ? 1 : 0.92 }}
                className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-sm font-bold transition-all duration-200 sm:h-12 sm:w-12 sm:text-lg ${
                  isCompleted ? "cursor-default" : "cursor-pointer"
                }`}
                style={{
                  backgroundColor: isSelected || isCompleted ? SILVER_LIGHT : SILVER,
                  color: BLACK,
                  boxShadow: isSelected
                    ? `0 0 0 2px ${TEAL}`
                    : isCompleted
                      ? `0 0 0 2px ${TEAL}`
                      : "0 1px 2px rgba(0,0,0,0.08)",
                }}
              >
                {letter.toUpperCase()}
              </motion.button>
            );
          })}
        </div>

        {/* Word length indicator */}
        <div className="mb-6 flex flex-wrap justify-center gap-1 sm:mb-7 sm:gap-1.5">
          {puzzle.word.split("").map((_, idx) => (
            <div
              key={idx}
              className="h-1 w-4 rounded-full transition-all duration-300 sm:w-6"
              style={{
                backgroundColor: puzzle.scrambled[idx] === puzzle.word[idx] ? TEAL : "rgba(0,0,0,0.12)",
              }}
            />
          ))}
        </div>

        {/* Navigation */}
        <div className="flex items-center justify-between gap-2 sm:gap-3">
          <button
            onClick={goPrev}
            disabled={currentIndex === 0}
            className="rounded-full border px-3 py-1.5 text-xs font-semibold transition-all duration-200 hover:scale-105 disabled:cursor-not-allowed disabled:opacity-30 disabled:hover:scale-100 sm:px-4 sm:py-2 sm:text-sm"
            style={{ borderColor: TEAL_DARK, color: TEAL_DARK }}
          >
            Previous
          </button>

          <button
            onClick={resetAll}
            className="text-[11px] font-medium text-brand-tealDark/50 underline-offset-2 hover:underline sm:text-xs"
          >
            Reset all
          </button>

          <button
            onClick={goNext}
            disabled={!isCompleted || currentIndex === puzzles.length - 1}
            className="rounded-full px-4 py-1.5 text-xs font-semibold text-white transition-all duration-200 hover:scale-105 disabled:cursor-not-allowed disabled:opacity-30 disabled:hover:scale-100 sm:px-5 sm:py-2 sm:text-sm"
            style={{ backgroundColor: CORAL }}
          >
            Next
          </button>
        </div>
      </motion.div>

      {/* Hint modal */}
      <AnimatePresence>
        {showHint && hintIndices && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowHint(false)}
          >
            <motion.div
              initial={{ scale: 0.3, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.3, opacity: 0 }}
              transition={{ type: "spring", stiffness: 300, damping: 22 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-[300px] rounded-2xl bg-white p-5 text-center shadow-2xl sm:max-w-xs sm:p-6"
            >
              <p className="mb-4 text-xs font-bold uppercase tracking-[0.15em]" style={{ color: TEAL }}>
                Hint
              </p>
              <div className="flex flex-wrap items-center justify-center gap-1.5 sm:gap-2.5">
                {letters.map((letter, i) => {
                  const isHintCell = hintIndices.includes(i);
                  return (
                    <div
                      key={i}
                      className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-sm font-bold sm:h-11 sm:w-11 sm:text-base"
                      style={{
                        backgroundColor: isHintCell ? "#FBE8C6" : SILVER,
                        boxShadow: isHintCell ? `0 0 0 2px ${GOLD}` : "none",
                        color: BLACK,
                      }}
                    >
                      {letter.toUpperCase()}
                    </div>
                  );
                })}
              </div>
              <p className="mt-4 text-sm text-brand-tealDark/70">
                Swap the two highlighted letters to complete the word.
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}

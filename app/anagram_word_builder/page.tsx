"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import Link from "next/link";
import { PartyPopper, X } from "lucide-react";

type Difficulty = "Easy" | "Medium" | "Hard";

type Puzzle = {
  id: number;
  word: string;
  category: string;
  difficulty: Difficulty;
  image: string;
};

const IMAGE_DIR = "/Images/anagram%20images";

const PUZZLES: Puzzle[] = [
  { id: 1, word: "CAT", category: "Animal", difficulty: "Easy", image: `${IMAGE_DIR}/cat.svg` },
  { id: 2, word: "SUN", category: "Sky", difficulty: "Easy", image: `${IMAGE_DIR}/sun.svg` },
  { id: 3, word: "BOAT", category: "Vehicle", difficulty: "Easy", image: `${IMAGE_DIR}/boat.svg` },
  { id: 4, word: "BOOK", category: "School", difficulty: "Easy", image: `${IMAGE_DIR}/book.svg` },
  { id: 5, word: "CAKE", category: "Food", difficulty: "Easy", image: `${IMAGE_DIR}/cake.svg` },
  { id: 6, word: "FISH", category: "Animal", difficulty: "Easy", image: `${IMAGE_DIR}/fish.svg` },
  { id: 7, word: "KITE", category: "Toy", difficulty: "Easy", image: `${IMAGE_DIR}/kite.svg` },
  { id: 8, word: "MOON", category: "Sky", difficulty: "Easy", image: `${IMAGE_DIR}/moon.svg` },
  { id: 9, word: "STAR", category: "Sky", difficulty: "Easy", image: `${IMAGE_DIR}/star.svg` },
  { id: 10, word: "TREE", category: "Nature", difficulty: "Easy", image: `${IMAGE_DIR}/tree.svg` },
  { id: 11, word: "APPLE", category: "Fruit", difficulty: "Medium", image: `${IMAGE_DIR}/apple.svg` },
  { id: 12, word: "CLOCK", category: "Object", difficulty: "Medium", image: `${IMAGE_DIR}/clock.svg` },
  { id: 13, word: "HOUSE", category: "Home", difficulty: "Medium", image: `${IMAGE_DIR}/house.svg` },
  { id: 14, word: "CRAYON", category: "School", difficulty: "Medium", image: `${IMAGE_DIR}/crayon.svg` },
  { id: 15, word: "FLOWER", category: "Nature", difficulty: "Medium", image: `${IMAGE_DIR}/flower.svg` },
  { id: 16, word: "ROCKET", category: "Space", difficulty: "Medium", image: `${IMAGE_DIR}/rocket.svg` },
  { id: 17, word: "WINDOW", category: "Home", difficulty: "Medium", image: `${IMAGE_DIR}/window.svg` },
  { id: 18, word: "BALLOON", category: "Object", difficulty: "Hard", image: `${IMAGE_DIR}/balloon.svg` },
  { id: 19, word: "COMPUTER", category: "Object", difficulty: "Hard", image: `${IMAGE_DIR}/computer.svg` },
  { id: 20, word: "UMBRELLA", category: "Object", difficulty: "Hard", image: `${IMAGE_DIR}/umbrella.svg` },
];

// Palette pulled from the "Word Builder" Adobe XD spec.
const NAVY = "#1B4552";
const TEAL = "#009A88";
const ORANGE = "#FA9E15";
const ORANGE_LIGHT = "#FBB041";
const GRAY_TEXT = "#707070";
const GRAY_LIGHT = "#F2F2F2";
const OFFWHITE = "#FCFCFC";

// Mascot logo shown at the top of the card.
const LOGO_URL =
  "https://ik.imagekit.io/pratik2002/logo-logicology-removebg-preview.png?updatedAt=1760432002538";

const FONT_IMPORT = `@import url('https://fonts.googleapis.com/css2?family=Alfa+Slab+One&display=swap');`;

function shuffleWord(word: string): string[] {
  const letters = word.split("");
  if (letters.length <= 1) return letters;
  let shuffled = letters;
  do {
    shuffled = [...letters].sort(() => Math.random() - 0.5);
  } while (shuffled.join("") === word);
  return shuffled;
}

export default function AnagramWordBuilderPage() {
  return (
    <main
      className="h-screen w-full overflow-hidden text-brand-tealDark"
      style={{ backgroundColor: NAVY }}
    >
      <style dangerouslySetInnerHTML={{ __html: FONT_IMPORT }} />
      <section id="anagram-word-builder" className="h-full w-full">
        <WordBuilderGame />
      </section>
    </main>
  );
}

function WordBuilderGame() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [trayLetters, setTrayLetters] = useState<string[]>([]);
  const [wordCells, setWordCells] = useState<(string | null)[]>([]);
  const [selectedTrayIndex, setSelectedTrayIndex] = useState<number | null>(null);
  const [hoveredCellIndex, setHoveredCellIndex] = useState<number | null>(null);
  const [completed, setCompleted] = useState<boolean[]>(() => PUZZLES.map(() => false));
  const [showHint, setShowHint] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const puzzle = PUZZLES[currentIndex];
  const isCompleted = completed[currentIndex];

  useEffect(() => {
    setupPuzzle(currentIndex);
    setSelectedTrayIndex(null);
    setHoveredCellIndex(null);
    setShowHint(false);
    setShowSuccess(false);
  }, [currentIndex]);

  function setupPuzzle(index: number) {
    const target = PUZZLES[index];
    setTrayLetters(shuffleWord(target.word));
    setWordCells(Array(target.word.length).fill(null));
  }

  function placeLetter(sourceIndex: number, slotIndex: number) {
    const letter = trayLetters[sourceIndex];
    if (!letter || wordCells[slotIndex] !== null) return;

    const nextWordCells = [...wordCells];
    nextWordCells[slotIndex] = letter;

    const nextTray = [...trayLetters];
    nextTray[sourceIndex] = "";

    setWordCells(nextWordCells);
    setTrayLetters(nextTray);
    setSelectedTrayIndex(null);

    if (nextWordCells.every((cell) => cell !== null)) {
      checkWord(nextWordCells.join(""));
    }
  }

  function checkWord(formedWord: string) {
    if (formedWord === puzzle.word) {
      setCompleted((prev) => {
        const next = [...prev];
        next[currentIndex] = true;
        return next;
      });
      setShowSuccess(true);
    }
  }

  function handleTrayClick(index: number) {
    if (isCompleted || !trayLetters[index]) return;
    setSelectedTrayIndex((prev) => (prev === index ? null : index));
  }

  function handleCellClick(index: number) {
    if (isCompleted) return;
    const letter = wordCells[index];

    if (letter === null) {
      if (selectedTrayIndex !== null) placeLetter(selectedTrayIndex, index);
      return;
    }

    const nextWordCells = [...wordCells];
    nextWordCells[index] = null;
    setWordCells(nextWordCells);

    const emptyTraySlot = trayLetters.findIndex((l) => l === "");
    if (emptyTraySlot !== -1) {
      const nextTray = [...trayLetters];
      nextTray[emptyTraySlot] = letter;
      setTrayLetters(nextTray);
    }
  }

  function handleDragStart(index: number, e: React.DragEvent) {
    e.dataTransfer.setData("text/plain", String(index));
    e.dataTransfer.effectAllowed = "move";
  }

  function handleDragOver(index: number, e: React.DragEvent) {
    e.preventDefault();
    if (wordCells[index] === null) setHoveredCellIndex(index);
  }

  function handleDrop(index: number, e: React.DragEvent) {
    e.preventDefault();
    setHoveredCellIndex(null);
    if (isCompleted || wordCells[index] !== null) return;

    const sourceIndex = Number(e.dataTransfer.getData("text/plain"));
    if (!Number.isNaN(sourceIndex)) placeLetter(sourceIndex, index);
  }

  function resetPuzzle() {
    setupPuzzle(currentIndex);
    setSelectedTrayIndex(null);
    setShowSuccess(false);
    setCompleted((prev) => {
      const next = [...prev];
      next[currentIndex] = false;
      return next;
    });
  }

  function resetAll() {
    setCompleted(PUZZLES.map(() => false));
    setCurrentIndex(0);
  }

  function goNext() {
    if (currentIndex < PUZZLES.length - 1) setCurrentIndex((i) => i + 1);
  }

  function goPrev() {
    if (currentIndex > 0) setCurrentIndex((i) => i - 1);
  }

  const completedCount = completed.filter(Boolean).length;
  const progress = completedCount / PUZZLES.length;
  const RING_RADIUS = 19;
  const RING_CIRCUMFERENCE = 2 * Math.PI * RING_RADIUS;

  return (
    <div className="flex h-full w-full items-center justify-center px-3 py-3 sm:px-6 sm:py-6">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative mx-auto w-full max-w-[640px] rounded-[28px] p-4 shadow-soft ring-1 ring-black/5 sm:p-8"
        style={{ backgroundColor: OFFWHITE, maxHeight: "calc(100vh - 24px)", overflow: "hidden" }}
      >
        {/* Close button */}
        <Link
          href="/games"
          aria-label="Exit game"
          className="absolute right-4 top-4 flex h-8 w-8 items-center justify-center rounded-full text-white shadow-sm transition-transform duration-200 hover:scale-110 sm:right-6 sm:top-6 sm:h-9 sm:w-9"
          style={{ backgroundColor: ORANGE }}
        >
          <X className="h-4 w-4 sm:h-5 sm:w-5" strokeWidth={3} />
        </Link>

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
            Puzzle {currentIndex + 1} of {PUZZLES.length}
          </span>
        </div>

        {/* Mascot logo */}
        <div
          className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-full sm:h-20 sm:w-20"
          
        >
          <img
            src={LOGO_URL}
            alt="Logicology logo"
            className="h-[100%] w-[100%] object-contain"
          />
        </div>

        {/* Title */}
        <h2
          className="text-center text-2xl sm:text-4xl"
          style={{ fontFamily: "'Alfa Slab One', serif", color: TEAL }}
        >
          Word Builder
        </h2>
        <p className="mx-auto mt-2 max-w-sm text-center text-xs sm:text-base" style={{ color: GRAY_TEXT }}>
          Tap A Letter Then Tap A Box (Or Drag It) To Spell The Word. Stuck? Tap Hint For A Picture
          Clue.
        </p>

        {/* Category + level pill, with HINT / RESET buttons outside it */}
        <div className="mb-6 mt-5 flex flex-wrap items-center justify-between gap-2.5 sm:mt-7 sm:gap-3">
          <div
            className="w-fit max-w-full rounded-full px-4 py-2.5"
            style={{ backgroundColor: GRAY_LIGHT }}
          >
            <span
              className="whitespace-nowrap text-xs font-semibold sm:text-sm"
              style={{ color: NAVY }}
            >
              Category: {puzzle.category} | Level: {puzzle.difficulty}
            </span>
          </div>

          <div className="flex shrink-0 gap-2">
            <button
              onClick={() => setShowHint(true)}
              className="rounded-full px-3.5 py-1.5 text-[11px] font-bold tracking-wide transition-transform duration-200 hover:scale-105 sm:px-4 sm:text-xs"
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

        {/* Letter tray (source) */}
        <p
          className="mb-2 text-center text-[11px] font-semibold uppercase tracking-wide sm:text-xs"
          style={{ color: GRAY_TEXT }}
        >
          Drag from here
        </p>
        <div className="mb-6 flex flex-wrap justify-center gap-2 sm:gap-3">
          {trayLetters.map((letter, index) => (
            <button
              key={`tray-${index}`}
              draggable={!!letter && !isCompleted}
              onDragStart={(e) => handleDragStart(index, e)}
              onClick={() => handleTrayClick(index)}
              disabled={isCompleted || !letter}
              className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border-2 text-xl font-bold transition-all duration-150 sm:h-16 sm:w-16 sm:text-2xl ${
                letter ? "cursor-pointer sm:cursor-grab" : "pointer-events-none opacity-0"
              }`}
              style={{
                borderColor: TEAL,
                backgroundColor: selectedTrayIndex === index ? "rgba(0,154,136,0.14)" : OFFWHITE,
                color: TEAL,
                transform: selectedTrayIndex === index ? "scale(1.08)" : "scale(1)",
              }}
            >
              {letter}
            </button>
          ))}
        </div>

        {/* Word slots (target) */}
        <p
          className="mb-2 text-center text-[11px] font-semibold uppercase tracking-wide sm:text-xs"
          style={{ color: GRAY_TEXT }}
        >
          Drop here
        </p>
        <div className="mb-8 flex flex-wrap justify-center gap-2 sm:gap-3">
          {wordCells.map((letter, index) => (
            <button
              key={`cell-${index}`}
              onDragOver={(e) => handleDragOver(index, e)}
              onDragLeave={() => setHoveredCellIndex(null)}
              onDrop={(e) => handleDrop(index, e)}
              onClick={() => handleCellClick(index)}
              disabled={isCompleted && !letter}
              className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border-2 text-xl font-bold transition-all duration-150 sm:h-16 sm:w-16 sm:text-2xl"
              style={{
                borderColor: TEAL,
                borderStyle: letter ? "solid" : "dashed",
                backgroundColor: letter ? OFFWHITE : GRAY_LIGHT,
                color: TEAL,
                transform: hoveredCellIndex === index ? "scale(1.08)" : "scale(1)",
              }}
            >
              {letter}
            </button>
          ))}
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
            disabled={!isCompleted || currentIndex === PUZZLES.length - 1}
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
              &ldquo;{puzzle.word}&rdquo; is correct
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
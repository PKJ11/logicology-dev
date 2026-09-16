"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion, useInView } from "framer-motion";
import { useRef } from "react";

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

// Brand palette (see tailwind.config.ts -> theme.colors.brand)
const TEAL = "#0A8A80";
const TEAL_DARK = "#0B3F44";
const CORAL = "#E45C48";
const GOLD = "#fbb041";
const BLACK = "#3d3b40";

// Uniform grey-silver tile colors — cells never shift to blue/green, only
// their ring/border communicates state.
const SILVER = "#D7DADC";
const BAR_GREY = "#9CA3AF";
const SILVER_LIGHT = "#E9EBEC";

export default function AnagramWordBuilderPage() {
  return (
    <main className="min-h-screen bg-brand-grayBg text-brand-tealDark">
      <section id="anagram-word-builder">
        <WordBuilderGame />
      </section>
    </main>
  );
}

function WordBuilderGame() {
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-100px" });

  const [currentIndex, setCurrentIndex] = useState(0);
  const [wordCells, setWordCells] = useState<(string | null)[]>([]);
  const [availableLetters, setAvailableLetters] = useState<string[]>([]);
  const [completed, setCompleted] = useState<boolean[]>(() => PUZZLES.map(() => false));
  const [feedback, setFeedback] = useState<string | null>(null);
  const [hoveredDropIndex, setHoveredDropIndex] = useState<number | null>(null);
  const [showHint, setShowHint] = useState(false);
  const [selectedLetterIndex, setSelectedLetterIndex] = useState<number | null>(null);

  const puzzle = PUZZLES[currentIndex];
  const isCompleted = completed[currentIndex];
  const completedCount = completed.filter(Boolean).length;

  useEffect(() => {
    setupPuzzle(currentIndex);
    setFeedback(null);
    setShowHint(false);
    setHoveredDropIndex(null);
    setSelectedLetterIndex(null);
  }, [currentIndex]);

  function setupPuzzle(index: number) {
    const target = PUZZLES[index];
    setWordCells(Array(target.word.length).fill(null));
    setAvailableLetters([...target.word.split("")].sort(() => Math.random() - 0.5));
  }

  // Places the letter sitting at `sourceIndex` in the tray into word slot
  // `slotIndex` — shared by desktop drag-and-drop and the tap-to-place
  // fallback that mobile/touch devices need (HTML5 DnD doesn't fire there).
  function placeLetter(sourceIndex: number, slotIndex: number) {
    const letter = availableLetters[sourceIndex];
    if (!letter || wordCells[slotIndex] !== null) return;

    const nextWordCells = [...wordCells];
    nextWordCells[slotIndex] = letter;

    const nextAvailable = [...availableLetters];
    nextAvailable[sourceIndex] = "";

    setWordCells(nextWordCells);
    setAvailableLetters(nextAvailable);
    setSelectedLetterIndex(null);

    if (nextWordCells.every((cell) => cell !== null)) {
      checkWord(nextWordCells.join(""));
    }
  }

  function handleDragStart(letter: string, index: number, e: React.DragEvent) {
    e.dataTransfer.setData("text/plain", JSON.stringify({ letter, sourceIndex: index }));
    e.dataTransfer.effectAllowed = "move";
  }

  function handleDragOver(index: number, e: React.DragEvent) {
    e.preventDefault();
    if (wordCells[index] === null) setHoveredDropIndex(index);
  }

  function handleDrop(index: number, e: React.DragEvent) {
    e.preventDefault();
    setHoveredDropIndex(null);
    if (wordCells[index] !== null) return;

    try {
      const { sourceIndex } = JSON.parse(e.dataTransfer.getData("text/plain"));
      placeLetter(sourceIndex, index);
    } catch {
      // ignore malformed drag payloads
    }
  }

  function handleTrayLetterClick(index: number) {
    if (isCompleted || !availableLetters[index]) return;
    setSelectedLetterIndex((prev) => (prev === index ? null : index));
  }

  function handleWordCellClick(index: number) {
    if (isCompleted) return;
    const letter = wordCells[index];

    if (letter === null) {
      if (selectedLetterIndex !== null) placeLetter(selectedLetterIndex, index);
      return;
    }

    const nextWordCells = [...wordCells];
    nextWordCells[index] = null;
    setWordCells(nextWordCells);

    const emptySlot = availableLetters.findIndex((l) => l === "");
    if (emptySlot !== -1) {
      const nextAvailable = [...availableLetters];
      nextAvailable[emptySlot] = letter;
      setAvailableLetters(nextAvailable);
    }
    setFeedback(null);
  }

  function checkWord(formedWord: string) {
    if (formedWord === puzzle.word) {
      setCompleted((prev) => {
        const next = [...prev];
        next[currentIndex] = true;
        return next;
      });
      setFeedback(`Well done — "${puzzle.word}" is correct.`);
    } else {
      setFeedback("Not quite — try rearranging the letters.");
      window.setTimeout(() => setFeedback(null), 1500);
    }
  }

  function resetPuzzle() {
    setupPuzzle(currentIndex);
    setCompleted((prev) => {
      const next = [...prev];
      next[currentIndex] = false;
      return next;
    });
    setFeedback(null);
  }

  function goNext() {
    if (currentIndex < PUZZLES.length - 1) setCurrentIndex((i) => i + 1);
  }

  function goPrev() {
    if (currentIndex > 0) setCurrentIndex((i) => i - 1);
  }

  function getHint() {
    setShowHint(true);
    window.setTimeout(() => setShowHint(false), 3000);
  }

  const progress = (completedCount / PUZZLES.length) * 100;

  return (
    <section ref={sectionRef} className="w-full bg-brand-grayBg px-3 py-10 sm:px-6 sm:py-16 md:py-20">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.5 }}
        className="mx-auto w-full max-w-[640px] rounded-[22px] bg-white p-4 shadow-soft ring-1 ring-black/5 sm:p-10"
      >
        {/* Header */}
        <div className="mb-6 text-center sm:mb-7">
          <h2 className="headingstyle mb-2 font-extrabold text-brand-tealDark">Word Builder</h2>
          <p className="textstyles mx-auto max-w-sm text-sm text-brand-tealDark/70 sm:text-base">
            Tap a letter then tap a box (or drag it) to spell the word. Stuck? Tap Hint for a
            picture clue.
          </p>

          <div className="mx-auto mt-4 max-w-xs sm:mt-5">
            <div className="mb-1.5 flex justify-between text-[11px] font-medium text-brand-tealDark/60 sm:text-xs">
              <span>
                Puzzle {currentIndex + 1} of {PUZZLES.length}
              </span>
              <span>
                {completedCount} / {PUZZLES.length} completed
              </span>
            </div>
            <div className="h-1.5 overflow-hidden rounded-full bg-black/10">
              <div
                className="h-full rounded-full transition-all duration-500"
                style={{ width: `${progress}%`, backgroundColor: BAR_GREY }}
              />
            </div>
          </div>
        </div>

        {/* Category + controls */}
        <div className="mb-5 flex flex-wrap items-center justify-between gap-2.5 rounded-xl bg-brand-grayBg px-3 py-2.5 sm:mb-6 sm:gap-3 sm:px-4 sm:py-3">
          <div>
            <span className="text-xs font-semibold text-brand-tealDark sm:text-sm">
              {puzzle.category} &middot; {puzzle.difficulty}
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
              className="rounded-full px-3.5 py-1.5 text-[11px] font-semibold text-brand-black transition-all duration-200 hover:scale-105 sm:px-4 sm:text-xs"
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

        {/* Available letters */}
        <p className="mb-2 text-center text-[11px] font-semibold uppercase tracking-wide text-brand-tealDark/50 sm:text-xs">
          Drag from here
        </p>
        <div className="mb-6 flex flex-wrap justify-center gap-1.5 sm:gap-3">
          {availableLetters.map((letter, index) => (
            <div
              key={`source-${index}`}
              draggable={!!letter}
              onDragStart={(e) => handleDragStart(letter, index, e)}
              onClick={() => handleTrayLetterClick(index)}
              className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-sm font-bold transition-all duration-200 sm:h-12 sm:w-12 sm:text-lg ${
                letter ? "cursor-pointer sm:cursor-grab" : "pointer-events-none opacity-0"
              }`}
              style={{
                backgroundColor: selectedLetterIndex === index ? SILVER_LIGHT : SILVER,
                color: BLACK,
                boxShadow:
                  selectedLetterIndex === index
                    ? `0 0 0 2px ${TEAL}`
                    : "0 1px 2px rgba(0,0,0,0.08)",
              }}
            >
              {letter}
            </div>
          ))}
        </div>

        {/* Word slots */}
        <p className="mb-2 text-center text-[11px] font-semibold uppercase tracking-wide text-brand-tealDark/50 sm:text-xs">
          Drop here
        </p>
        <div className="mb-7 flex flex-wrap justify-center gap-1.5 sm:gap-3">
          {wordCells.map((letter, index) => (
            <div
              key={`target-${index}`}
              onDragOver={(e) => handleDragOver(index, e)}
              onDragLeave={() => setHoveredDropIndex(null)}
              onDrop={(e) => handleDrop(index, e)}
              onClick={() => handleWordCellClick(index)}
              className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-sm font-bold transition-all duration-200 sm:h-12 sm:w-12 sm:text-lg ${
                letter ? "cursor-pointer" : "cursor-pointer"
              }`}
              style={{
                backgroundColor: letter ? SILVER_LIGHT : SILVER,
                color: BLACK,
                boxShadow:
                  hoveredDropIndex === index || (selectedLetterIndex !== null && !letter)
                    ? `0 0 0 2px ${TEAL}`
                    : letter
                      ? isCompleted
                        ? `0 0 0 2px ${TEAL}`
                        : "0 1px 2px rgba(0,0,0,0.08)"
                      : "inset 0 0 0 1.5px rgba(11,63,68,0.25)",
              }}
            >
              {letter}
            </div>
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
            onClick={() => {
              setCompleted(PUZZLES.map(() => false));
              setCurrentIndex(0);
            }}
            className="text-[11px] font-medium text-brand-tealDark/50 underline-offset-2 hover:underline sm:text-xs"
          >
            Reset all
          </button>

          <button
            onClick={goNext}
            disabled={!isCompleted || currentIndex === PUZZLES.length - 1}
            className="rounded-full px-4 py-1.5 text-xs font-semibold text-white transition-all duration-200 hover:scale-105 disabled:cursor-not-allowed disabled:opacity-30 disabled:hover:scale-100 sm:px-5 sm:py-2 sm:text-sm"
            style={{ backgroundColor: CORAL }}
          >
            Next
          </button>
        </div>
      </motion.div>

      {/* Hint modal */}
      <AnimatePresence>
        {showHint && (
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
              className="w-full max-w-[280px] rounded-2xl bg-white p-6 text-center shadow-2xl sm:max-w-xs"
            >
              <p className="mb-4 text-xs font-bold uppercase tracking-[0.15em]" style={{ color: TEAL }}>
                Hint
              </p>
              <div
                className="mx-auto flex h-32 w-32 items-center justify-center rounded-2xl bg-brand-grayBg p-4 sm:h-36 sm:w-36"
              >
                <img src={puzzle.image} alt={puzzle.category} className="h-full w-full object-contain" />
              </div>
              <p className="mt-4 text-sm text-brand-tealDark/70">
                It's a {puzzle.word.length}-letter word — a {puzzle.category.toLowerCase()}.
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}

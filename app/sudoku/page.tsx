"use client";

import { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Bot, PartyPopper, X } from "lucide-react";

// Palette matched to the "Word Builder" / "Letter Swap" design system.
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

export default function SudokuPage() {
  return (
    <main className="h-screen w-full overflow-hidden" style={{ backgroundColor: NAVY }}>
      <style dangerouslySetInnerHTML={{ __html: FONT_IMPORT }} />
      <section id="sudoku-game" className="h-full w-full">
        <SudokuSlider />
      </section>
    </main>
  );
}

/* ============================================================
   COLOR SUDOKU (4×4) – exactly 4 colors
============================================================ */
type ColorKey = "R" | "G" | "B" | "Y";
type Cell = { value: ColorKey | null; locked?: boolean };

const COLOR_KEYS: ColorKey[] = ["R", "G", "B", "Y"];

const COLOR_META: Record<ColorKey, { label: string; hex: string }> = {
  R: { label: "Red", hex: "#E45C48" },
  G: { label: "Green", hex: "#4CAF50" },
  B: { label: "Blue", hex: "#4C8BD9" },
  Y: { label: "Yellow", hex: "#DDB24D" },
};

type Puzzle = {
  name: string;
  start: (ColorKey | null)[][];
  solution: ColorKey[][];
};

const SOL1: ColorKey[][] = [
  ["Y", "R", "G", "B"],
  ["B", "G", "R", "Y"],
  ["R", "Y", "B", "G"],
  ["G", "B", "Y", "R"],
];

const SOL2: ColorKey[][] = [
  ["B", "R", "Y", "G"],
  ["G", "Y", "B", "R"],
  ["Y", "G", "R", "B"],
  ["R", "B", "G", "Y"],
];

const SOL3: ColorKey[][] = [
  ["B", "G", "Y", "R"],
  ["R", "Y", "G", "B"],
  ["G", "B", "R", "Y"],
  ["Y", "R", "B", "G"],
];

const PUZZLES: Puzzle[] = [
  {
    name: "Puzzle 1",
    start: [
      ["Y", "R", null, null],
      [null, null, null, null],
      [null, "Y", "B", null],
      ["G", null, null, "R"],
    ],
    solution: SOL1,
  },
  {
    name: "Puzzle 2",
    start: [
      ["B", null, null, "G"],
      [null, "Y", "B", null],
      [null, "G", null, null],
      ["R", null, null, null],
    ],
    solution: SOL2,
  },
  {
    name: "Puzzle 3",
    start: [
      [null, null, "Y", null],
      ["R", null, "G", null],
      [null, "B", null, "Y"],
      [null, "R", null, null],
    ],
    solution: SOL3,
  },
];

function cellBorders(r: number, c: number) {
  const top = r === 0 || r === 2 ? "border-t-[3px]" : "border-t";
  const bottom = r === 3 ? "border-b-[3px]" : "border-b";
  const left = c === 0 || c === 2 ? "border-l-[3px]" : "border-l";
  const right = c === 3 ? "border-r-[3px]" : "border-r";
  return `${top} ${right} ${bottom} ${left} border-black/25`;
}

function computeConflicts(grid: Cell[][]): Record<string, boolean> {
  const size = 4;
  const box = 2;
  const conflicts: Record<string, boolean> = {};
  for (let r = 0; r < size; r++) for (let c = 0; c < size; c++) conflicts[`${r}-${c}`] = false;

  for (let r = 0; r < size; r++) {
    const seen = new Map<ColorKey, number[]>();
    for (let c = 0; c < size; c++) {
      const v = grid[r][c].value;
      if (v) seen.set(v, [...(seen.get(v) || []), c]);
    }
    seen.forEach((cols) => cols.length > 1 && cols.forEach((cc) => (conflicts[`${r}-${cc}`] = true)));
  }
  for (let c = 0; c < size; c++) {
    const seen = new Map<ColorKey, number[]>();
    for (let r = 0; r < size; r++) {
      const v = grid[r][c].value;
      if (v) seen.set(v, [...(seen.get(v) || []), r]);
    }
    seen.forEach((rows) => rows.length > 1 && rows.forEach((rr) => (conflicts[`${rr}-${c}`] = true)));
  }
  for (let br = 0; br < size; br += box) {
    for (let bc = 0; bc < size; bc += box) {
      const seen = new Map<ColorKey, [number, number][]>();
      for (let r = br; r < br + box; r++) {
        for (let c = bc; c < bc + box; c++) {
          const v = grid[r][c].value;
          if (v) seen.set(v, [...(seen.get(v) || []), [r, c]]);
        }
      }
      seen.forEach(
        (coords) => coords.length > 1 && coords.forEach(([r, c]) => (conflicts[`${r}-${c}`] = true))
      );
    }
  }
  return conflicts;
}

function SudokuSlider() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const total = PUZZLES.length;

  const goNext = () => setCurrentIndex((i) => Math.min(i + 1, total - 1));
  const goPrev = () => setCurrentIndex((i) => Math.max(i - 1, 0));

  return (
    <div className="flex h-full w-full items-center justify-center px-3 py-[clamp(6px,2vh,20px)]">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative mx-auto flex w-full max-w-[640px] flex-col rounded-[28px] px-[clamp(16px,4vw,32px)] py-[clamp(14px,2.2vh,28px)] shadow-soft ring-1 ring-black/5"
        style={{ backgroundColor: OFFWHITE, maxHeight: "calc(100vh - 16px)", overflow: "hidden" }}
      >
        {/* Close button */}
        <button
          aria-label="Exit game"
          className="absolute right-[clamp(12px,2vw,24px)] top-[clamp(12px,2vh,24px)] flex h-[clamp(28px,4vh,34px)] w-[clamp(28px,4vh,34px)] items-center justify-center rounded-full text-white shadow-sm transition-transform duration-200 hover:scale-110"
          style={{ backgroundColor: ORANGE }}
        >
          <X className="h-[45%] w-[45%]" strokeWidth={3} />
        </button>

        {/* Puzzle label — top-left */}
        <div className="mb-[clamp(2px,0.8vh,8px)] pr-[clamp(34px,5vh,44px)] text-left">
          <span className="text-[clamp(11px,1.5vh,13px)] font-medium" style={{ color: GRAY_TEXT }}>
            {PUZZLES[currentIndex].name}
          </span>
        </div>

        {/* Mascot logo */}
        <div
          className="mx-auto mb-[clamp(4px,1vh,10px)] flex h-[clamp(44px,7vh,72px)] w-[clamp(44px,7vh,72px)] items-center justify-center rounded-full"
        >
          <img src={LOGO_URL} alt="Logicology logo" className="h-full w-full object-contain" />
        </div>

        {/* Title */}
        <h2
          className="text-center text-[clamp(20px,3.6vh,34px)]"
          style={{ fontFamily: "'Alfa Slab One', serif", color: TEAL }}
        >
          Colour Sudoku
        </h2>
        <p
          className="mx-auto mt-[clamp(2px,0.8vh,8px)] max-w-md text-center text-[clamp(10px,1.4vh,14px)]"
          style={{ color: GRAY_TEXT }}
        >
          Fill The 4×4 Grid So That Every Row, Column, And 2×2 Box Contains All Four Colours Exactly
          Once.
        </p>

        <ColorSudoku
          key={currentIndex}
          start={PUZZLES[currentIndex].start}
          solution={PUZZLES[currentIndex].solution}
        />

        {/* Navigation */}
        <div className="mt-[clamp(10px,2vh,20px)] flex items-center justify-between gap-2">
          <button
            onClick={goPrev}
            disabled={currentIndex === 0}
            className="rounded-full px-[clamp(14px,3vw,22px)] py-[clamp(6px,1.2vh,9px)] text-[clamp(10px,1.4vh,13px)] font-bold tracking-wide text-white transition-transform duration-200 hover:scale-105 disabled:cursor-not-allowed disabled:opacity-30 disabled:hover:scale-100"
            style={{ backgroundColor: ORANGE_LIGHT }}
          >
            PREVIOUS
          </button>
          <button
            onClick={goNext}
            disabled={currentIndex === total - 1}
            className="rounded-full px-[clamp(14px,3vw,22px)] py-[clamp(6px,1.2vh,9px)] text-[clamp(10px,1.4vh,13px)] font-bold tracking-wide text-white transition-transform duration-200 hover:scale-105 disabled:cursor-not-allowed disabled:opacity-30 disabled:hover:scale-100"
            style={{ backgroundColor: TEAL }}
          >
            NEXT
          </button>
        </div>
      </motion.div>
    </div>
  );
}

function ColorSudoku({ start, solution }: { start: (ColorKey | null)[][]; solution: ColorKey[][] }) {
  const [grid, setGrid] = useState<Cell[][]>(() =>
    start.map((row) => row.map((v) => ({ value: v, locked: v !== null })))
  );
  const [activeCell, setActiveCell] = useState<{ r: number; c: number } | null>(null);
  const [showSuccess, setShowSuccess] = useState(false);

  const conflicts = useMemo(() => computeConflicts(grid), [grid]);
  const won = useMemo(() => {
    const allFilled = grid.every((row) => row.every((cell) => cell.value !== null));
    const hasConflict = Object.values(conflicts).some(Boolean);
    return allFilled && !hasConflict;
  }, [grid, conflicts]);

  useEffect(() => {
    if (won) setShowSuccess(true);
  }, [won]);

  function setCellValue(r: number, c: number, color: ColorKey | null) {
    setGrid((old) =>
      old.map((row, ri) =>
        row.map((cell, ci) => {
          if (ri !== r || ci !== c || cell.locked) return cell;
          return { ...cell, value: color };
        })
      )
    );
  }

  function handleCellClick(r: number, c: number) {
    const cell = grid[r][c];
    if (cell.locked) return;

    // Open (or close) the floating palette right above this cell — the only way to place a color.
    setActiveCell((prev) => (prev && prev.r === r && prev.c === c ? null : { r, c }));
  }

  function pickFromPopover(color: ColorKey) {
    if (!activeCell) return;
    setCellValue(activeCell.r, activeCell.c, color);
    setActiveCell(null);
  }

  function resetPuzzle() {
    setGrid(start.map((row) => row.map((v) => ({ value: v, locked: v !== null }))));
    setActiveCell(null);
    setShowSuccess(false);
  }

  function hint() {
    for (let r = 0; r < 4; r++) {
      for (let c = 0; c < 4; c++) {
        if (grid[r][c].value !== null || grid[r][c].locked) continue;
        setCellValue(r, c, solution[r][c]);
        return;
      }
    }
  }

  return (
    <div className="relative mx-auto mt-[clamp(8px,1.8vh,20px)] w-full max-w-[520px]">
      <div className="flex w-full items-start justify-center gap-[clamp(8px,2vw,20px)]">
        {/* Vertical color legend — view-only, roughly 3/4 the grid's height, aligned to its top */}
        <div
          className="flex min-h-[clamp(140px,27vh,225px)] flex-col items-center justify-start gap-[clamp(10px,2.2vh,20px)] rounded-full px-[clamp(7px,1.4vw,14px)] py-[clamp(12px,2.6vh,24px)]"
          style={{ backgroundColor: GRAY_LIGHT }}
        >
          {COLOR_KEYS.map((k) => (
            <span
              key={k}
              aria-label={COLOR_META[k].label}
              title={COLOR_META[k].label}
              className="h-[clamp(22px,4vh,36px)] w-[clamp(22px,4vh,36px)] shrink-0 rounded-full shadow"
              style={{
                backgroundColor: COLOR_META[k].hex,
                boxShadow: "0 1px 2px rgba(0,0,0,0.15)",
              }}
            />
          ))}
        </div>

        {/* Grid */}
        <div className="relative w-full max-w-[clamp(160px,36vh,300px)]">
          <div
            className="grid w-full touch-manipulation select-none grid-cols-4 gap-0 overflow-hidden rounded-2xl ring-1 ring-black/10"
            style={{ backgroundColor: GRAY_LIGHT }}
          >
            {grid.map((row, r) =>
              row.map((cell, c) => {
                const key = `${r}-${c}`;
                const hasConflict = conflicts[key];
                return (
                  <div
                    key={key}
                    onClick={() => handleCellClick(r, c)}
                    className={`relative aspect-square w-full ${cellBorders(r, c)} flex items-center justify-center transition-all duration-200 ${
                      cell.locked ? "cursor-not-allowed" : "cursor-pointer hover:brightness-95"
                    }`}
                    style={{ backgroundColor: cell.value ? COLOR_META[cell.value].hex : GRAY_LIGHT }}
                    role="button"
                    aria-label={`Row ${r + 1} column ${c + 1}${cell.value ? ` ${COLOR_META[cell.value].label}` : " empty"}`}
                  >
                    {hasConflict && (
                      <span className="pointer-events-none absolute inset-0 ring-2 ring-inset ring-black/50" />
                    )}
                  </div>
                );
              })
            )}
          </div>

          {/* Floating color popover above the active cell */}
          <AnimatePresence>
            {activeCell && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8, y: 6 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.8, y: 6 }}
                transition={{ duration: 0.15 }}
                className="absolute z-10 flex items-center gap-1.5 rounded-full px-[clamp(8px,1.6vw,12px)] py-[clamp(4px,1vh,7px)] shadow-lg ring-1 ring-black/10"
                style={{
                  backgroundColor: OFFWHITE,
                  left: `${(activeCell.c + 0.5) * 25}%`,
                  top: `${activeCell.r * 25}%`,
                  transform: "translate(-50%, calc(-100% - 8px))",
                }}
              >
                {COLOR_KEYS.map((k) => (
                  <button
                    key={k}
                    onClick={() => pickFromPopover(k)}
                    aria-label={`Place ${COLOR_META[k].label}`}
                    className="h-[clamp(14px,2.4vh,22px)] w-[clamp(14px,2.4vh,22px)] shrink-0 rounded-full transition-transform duration-150 hover:scale-125"
                    style={{ backgroundColor: COLOR_META[k].hex }}
                  />
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* HINT / RESET — stacked on the right */}
        <div className="flex flex-col gap-[clamp(4px,1vh,8px)]">
          <button
            onClick={hint}
            className="rounded-full px-[clamp(10px,2.2vw,16px)] py-[clamp(5px,1.1vh,8px)] text-[clamp(10px,1.3vh,12px)] font-bold tracking-wide transition-transform duration-200 hover:scale-105"
            style={{ backgroundColor: ORANGE_LIGHT, color: NAVY }}
          >
            HINT
          </button>
          <button
            onClick={resetPuzzle}
            className="rounded-full px-[clamp(10px,2.2vw,16px)] py-[clamp(5px,1.1vh,8px)] text-[clamp(10px,1.3vh,12px)] font-bold tracking-wide text-white transition-transform duration-200 hover:scale-105"
            style={{ backgroundColor: TEAL }}
          >
            RESET
          </button>
        </div>
      </div>

      <p
        className="mt-[clamp(6px,1.4vh,12px)] text-center text-[clamp(10px,1.3vh,12px)]"
        style={{ color: GRAY_TEXT }}
      >
        Select box and fill color
      </p>

      {/* Success modal */}
      <AnimatePresence>
        {showSuccess && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowSuccess(false)}
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
                onClick={() => setShowSuccess(false)}
                aria-label="Close"
                className="absolute right-3 top-3 flex h-7 w-7 items-center justify-center rounded-full text-white transition-transform duration-200 hover:scale-110"
                style={{ backgroundColor: ORANGE }}
              >
                <X className="h-3.5 w-3.5" strokeWidth={3} />
              </button>

              <p className="text-lg font-semibold sm:text-xl" style={{ color: NAVY }}>
                Great job!
              </p>
              <div
                className="mx-auto my-4 flex h-24 w-24 items-center justify-center rounded-2xl sm:h-28 sm:w-28"
                style={{ backgroundColor: GRAY_LIGHT }}
              >
                <PartyPopper className="h-10 w-10 sm:h-12 sm:w-12" style={{ color: ORANGE }} />
              </div>
              <p className="text-sm sm:text-base" style={{ color: GRAY_TEXT }}>
                You solved it.
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
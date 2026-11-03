"use client";

import { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Eraser, PartyPopper, X } from "lucide-react";

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

// Landscape phones are short, so put the title block and the game side by side.
const LAYOUT_CSS = `
  @media (orientation: landscape) and (max-height: 560px) {
    .sudoku-card {
      display: grid !important;
      grid-template-columns: minmax(0, 1fr) minmax(0, 1.25fr);
      grid-template-areas: "head game" "nav game";
      column-gap: 24px;
      align-items: center;
      max-width: 880px !important;
    }
    .sudoku-head { grid-area: head; }
    .sudoku-game { grid-area: game; }
    .sudoku-nav { grid-area: nav; align-self: end; }
  }
`;

export default function SudokuPage() {
  return (
    // min-height (not h-screen + overflow-hidden) so short screens can scroll to every control.
    <main className="min-h-[100dvh] w-full" style={{ backgroundColor: NAVY }}>
      <style dangerouslySetInnerHTML={{ __html: FONT_IMPORT + LAYOUT_CSS }} />
      <section id="sudoku-game" className="w-full">
        <SudokuSlider />
      </section>
    </main>
  );
}

/* ============================================================
   COLOUR SUDOKU (4×4) – exactly 4 colours
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
    <div className="flex min-h-[100dvh] w-full items-center justify-center px-3 py-[clamp(6px,2vh,20px)]">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="sudoku-card relative mx-auto flex w-full max-w-[640px] flex-col rounded-[28px] px-[clamp(16px,4vw,32px)] py-[clamp(14px,2.2vh,28px)] shadow-soft ring-1 ring-black/5"
        style={{ backgroundColor: OFFWHITE }}
      >
        {/* Close button */}
        <button
          aria-label="Exit game"
          className="absolute right-[clamp(12px,2vw,24px)] top-[clamp(12px,2vh,24px)] z-10 flex h-[clamp(28px,4vh,34px)] min-h-[44px] w-[clamp(28px,4vh,34px)] min-w-[44px] items-center justify-center rounded-full text-white shadow-sm transition-transform duration-200 hover:scale-110"
          style={{ backgroundColor: ORANGE }}
        >
          <X className="h-[45%] w-[45%]" strokeWidth={3} />
        </button>

        <div className="sudoku-head">
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
          className="mx-auto mt-[clamp(2px,0.8vh,8px)] max-w-md text-center text-[15px] leading-snug"
          style={{ color: GRAY_TEXT }}
        >
          Fill the grid. Every row, column and 2×2 box needs all four colours.
        </p>
        </div>

        <div className="sudoku-game">
          <ColorSudoku
            key={currentIndex}
            start={PUZZLES[currentIndex].start}
            solution={PUZZLES[currentIndex].solution}
          />
        </div>

        {/* Navigation */}
        <div className="sudoku-nav mt-[clamp(10px,2vh,20px)] flex items-center justify-between gap-2">
          <button
            onClick={goPrev}
            disabled={currentIndex === 0}
            className="min-h-[44px] rounded-full px-[clamp(14px,3vw,22px)] py-[clamp(6px,1.2vh,9px)] text-[14px] font-bold tracking-wide text-white transition-transform duration-200 hover:scale-105 disabled:cursor-not-allowed disabled:opacity-30 disabled:hover:scale-100"
            style={{ backgroundColor: ORANGE_LIGHT }}
          >
            PREVIOUS
          </button>
          <button
            onClick={goNext}
            disabled={currentIndex === total - 1}
            className="min-h-[44px] rounded-full px-[clamp(14px,3vw,22px)] py-[clamp(6px,1.2vh,9px)] text-[14px] font-bold tracking-wide text-white transition-transform duration-200 hover:scale-105 disabled:cursor-not-allowed disabled:opacity-30 disabled:hover:scale-100"
            style={{ backgroundColor: TEAL }}
          >
            NEXT
          </button>
        </div>
      </motion.div>
    </div>
  );
}

type Tool = ColorKey | "erase";

function ColorSudoku({ start, solution }: { start: (ColorKey | null)[][]; solution: ColorKey[][] }) {
  const [grid, setGrid] = useState<Cell[][]>(() =>
    start.map((row) => row.map((v) => ({ value: v, locked: v !== null })))
  );
  // Colour tray: the selected colour (or eraser) is applied to each square the player taps.
  const [tool, setTool] = useState<Tool | null>(null);
  // Highlighted square. If it was picked before any colour, the next tray tap fills it.
  const [activeCell, setActiveCell] = useState<{ r: number; c: number } | null>(null);
  const [awaitingColour, setAwaitingColour] = useState(false);
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

  function clearSelection() {
    setActiveCell(null);
    setAwaitingColour(false);
  }

  // Esc drops the selected colour and square.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== "Escape") return;
      setTool(null);
      setActiveCell(null);
      setAwaitingColour(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  function handleCellClick(r: number, c: number) {
    if (grid[r][c].locked) return;

    if (tool) {
      // Colour-first: paint (or erase) this square and keep the tool for the next one.
      setCellValue(r, c, tool === "erase" ? null : tool);
      setActiveCell({ r, c });
      setAwaitingColour(false);
      return;
    }

    // Square-first: highlight it and wait for a colour from the tray.
    const same = activeCell && activeCell.r === r && activeCell.c === c;
    if (same) {
      clearSelection();
    } else {
      setActiveCell({ r, c });
      setAwaitingColour(true);
    }
  }

  function handleTrayClick(next: Tool) {
    if (activeCell && awaitingColour) {
      setCellValue(activeCell.r, activeCell.c, next === "erase" ? null : next);
      setAwaitingColour(false);
      setTool(next);
      return;
    }
    setTool((prev) => (prev === next ? null : next));
  }

  function resetPuzzle() {
    setGrid(start.map((row) => row.map((v) => ({ value: v, locked: v !== null }))));
    setTool(null);
    clearSelection();
    setShowSuccess(false);
  }

  function hint() {
    clearSelection();
    for (let r = 0; r < 4; r++) {
      for (let c = 0; c < 4; c++) {
        if (grid[r][c].value !== null || grid[r][c].locked) continue;
        setCellValue(r, c, solution[r][c]);
        return;
      }
    }
  }

  const helperText = awaitingColour
    ? "Now tap a colour for this square."
    : tool === "erase"
      ? "Eraser on. Tap a square to clear it."
      : tool
        ? `${COLOR_META[tool].label} selected. Tap a square to fill it.`
        : "Tap a colour, then tap a square.";

  return (
    <div className="relative mx-auto mt-[clamp(8px,1.8vh,20px)] w-full max-w-[520px]">
      <div className="flex w-full items-start justify-center gap-[clamp(8px,2vw,20px)]">
        {/* Colour tray — tap a colour (or the eraser), then tap squares */}
        <div
          role="toolbar"
          aria-label="Colours"
          className="flex flex-col items-center justify-start gap-[clamp(8px,1.6vh,14px)] rounded-full px-[clamp(6px,1.2vw,10px)] py-[clamp(10px,2vh,18px)]"
          style={{ backgroundColor: GRAY_LIGHT }}
        >
          {COLOR_KEYS.map((k) => {
            const on = tool === k;
            return (
              <button
                key={k}
                type="button"
                onClick={() => handleTrayClick(k)}
                aria-pressed={on}
                aria-label={COLOR_META[k].label}
                title={COLOR_META[k].label}
                className="h-11 w-11 shrink-0 rounded-full transition-transform duration-150 hover:scale-110"
                style={{
                  backgroundColor: COLOR_META[k].hex,
                  boxShadow: on
                    ? `0 0 0 3px ${OFFWHITE}, 0 0 0 6px ${NAVY}`
                    : "0 1px 2px rgba(0,0,0,0.15)",
                  transform: on ? "scale(1.08)" : undefined,
                }}
              />
            );
          })}
          <button
            type="button"
            onClick={() => handleTrayClick("erase")}
            aria-pressed={tool === "erase"}
            aria-label="Eraser"
            title="Eraser"
            className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-white transition-transform duration-150 hover:scale-110"
            style={{
              color: NAVY,
              boxShadow:
                tool === "erase"
                  ? `0 0 0 3px ${OFFWHITE}, 0 0 0 6px ${NAVY}`
                  : "0 1px 2px rgba(0,0,0,0.15)",
              transform: tool === "erase" ? "scale(1.08)" : undefined,
            }}
          >
            <Eraser className="h-[50%] w-[50%]" strokeWidth={2.25} />
          </button>
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
                const isActive = activeCell?.r === r && activeCell?.c === c;
                return (
                  <button
                    key={key}
                    type="button"
                    onClick={() => handleCellClick(r, c)}
                    disabled={cell.locked}
                    aria-pressed={isActive}
                    className={`relative aspect-square w-full ${cellBorders(r, c)} flex items-center justify-center transition-all duration-200 ${
                      cell.locked ? "cursor-not-allowed" : "cursor-pointer hover:brightness-95"
                    }`}
                    style={{ backgroundColor: cell.value ? COLOR_META[cell.value].hex : GRAY_LIGHT }}
                    aria-label={`Row ${r + 1} column ${c + 1}${cell.value ? ` ${COLOR_META[cell.value].label}` : " empty"}${cell.locked ? ", fixed" : ""}`}
                  >
                    {hasConflict && (
                      <span className="pointer-events-none absolute inset-0 ring-2 ring-inset ring-black/50" />
                    )}
                    {isActive && (
                      <span
                        className="pointer-events-none absolute inset-0"
                        style={{ boxShadow: `inset 0 0 0 3px ${NAVY}, inset 0 0 0 5px #FFFFFF` }}
                      />
                    )}
                  </button>
                );
              })
            )}
          </div>
        </div>

        {/* HINT / RESET — stacked on the right */}
        <div className="flex flex-col gap-[clamp(4px,1vh,8px)]">
          <button
            onClick={hint}
            className="min-h-[44px] rounded-full px-[clamp(10px,2.2vw,16px)] py-[clamp(5px,1.1vh,8px)] text-[14px] font-bold tracking-wide transition-transform duration-200 hover:scale-105"
            style={{ backgroundColor: ORANGE_LIGHT, color: NAVY }}
          >
            HINT
          </button>
          <button
            onClick={resetPuzzle}
            className="min-h-[44px] rounded-full px-[clamp(10px,2.2vw,16px)] py-[clamp(5px,1.1vh,8px)] text-[14px] font-bold tracking-wide text-white transition-transform duration-200 hover:scale-105"
            style={{ backgroundColor: TEAL }}
          >
            RESET
          </button>
        </div>
      </div>

      <p
        aria-live="polite"
        className="mt-[clamp(6px,1.4vh,12px)] text-center text-[15px]"
        style={{ color: GRAY_TEXT }}
      >
        {helperText}
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
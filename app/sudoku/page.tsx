"use client";

import NavBar from "@/components/NavBar";
import SiteFooter from "@/components/Footer";
import { useEffect, useMemo, useState } from "react";

export default function SudokuPage() {
  return (
    <main className="bg-brand-grayBg text-brand-tealDark">
      <NavBar />
      <section id="sudoku-game" className="w-full overflow-hidden">
        <div className="mx-auto px-4 py-12 sm:px-5 sm:py-16 md:max-w-[75vw] md:py-20 lg:mx-auto lg:max-w-[75vw]">
          <div className="mb-8 text-center">
            <h1 className="headingstyle font-heading font-extrabold text-brand-teal">
              Color Sudoku
            </h1>
            <p className="textstyles mx-auto mt-3 max-w-xl font-sans text-brand-tealDark/80">
              Fill the 4×4 grid so that every row, column, and 2×2 box contains all four colours
              exactly once.
            </p>
          </div>

          <div className="rounded-[26px] bg-white p-3">
            <div className="relative overflow-hidden rounded-[20px] bg-brand-grayBg p-4">
              <SudokuSlider isActive={true} />
            </div>
          </div>
        </div>
      </section>
      <SiteFooter />
    </main>
  );
}

/* ============================================================
   COLOR SUDOKU (4×4) – constants and types
============================================================ */
type ColorKey = "R" | "G" | "B" | "Y";
type Cell = { value: ColorKey | null; locked?: boolean };

const COLOR_META: Record<ColorKey, { label: string; class: string; hex: string }> = {
  R: { label: "Red", class: "bg-[#E45C48]", hex: "#E45C48" },
  G: { label: "Green", class: "bg-[#4CAF50]", hex: "#4CAF50" },
  B: { label: "Blue", class: "bg-[#4C8BD9]", hex: "#4C8BD9" },
  Y: { label: "Yellow", class: "bg-[#DDB24D]", hex: "#DDB24D" },
};

/* ============================================================
   MULTI-PUZZLE SLIDER (3 games)
============================================================ */
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

function SudokuSlider({ isActive }: { isActive: boolean }) {
  const [idx, setIdx] = useState(0);
  const [direction, setDirection] = useState<"left" | "right">("right");
  const total = PUZZLES.length;

  const next = () => {
    setDirection("right");
    setIdx((i) => (i + 1) % total);
  };

  const prev = () => {
    setDirection("left");
    setIdx((i) => (i - 1 + total) % total);
  };

  return (
    <div className="w-full">
      <div className="mb-3 flex items-center justify-between">
        <div className="font-semibold text-brand-tealDark">{PUZZLES[idx].name}</div>
        <div className="flex items-center gap-2">
          <button
            onClick={prev}
            className="rounded-full bg-white px-3 py-1.5 text-brand-tealDark ring-1 ring-black/10 transition-all duration-300 hover:scale-110 hover:bg-white/90 active:scale-95"
          >
            ◀
          </button>
          <button
            onClick={next}
            className="rounded-full bg-white px-3 py-1.5 text-brand-tealDark ring-1 ring-black/10 transition-all duration-300 hover:scale-110 hover:bg-white/90 active:scale-95"
          >
            ▶
          </button>
        </div>
      </div>

      <div
        className={`transition-all duration-500 ${
          direction === "right" ? "animate-slide-in-right" : "animate-slide-in-left"
        }`}
      >
        <ColorSudoku
          key={idx}
          start={PUZZLES[idx].start}
          solution={PUZZLES[idx].solution}
          isActive={isActive}
        />
      </div>

      <div className="mt-3 flex justify-center gap-2">
        {PUZZLES.map((_, i) => (
          <button
            key={i}
            aria-label={`Go to puzzle ${i + 1}`}
            onClick={() => setIdx(i)}
            className={`h-2.5 w-2.5 rounded-full transition-all duration-300 ${
              i === idx ? "scale-125 bg-brand-tealDark" : "bg-black/20 hover:bg-black/40"
            }`}
          />
        ))}
      </div>
    </div>
  );
}

/* ============================================================
   Grid border helper (THICK 2×2 sub-grids + outer frame)
============================================================ */
function cellBorders(r: number, c: number) {
  const top = r === 0 ? "border-t-4" : r === 2 ? "border-t-4" : "border-t";
  const bottom = r === 3 ? "border-b-4" : "border-b";
  const left = c === 0 ? "border-l-4" : c === 2 ? "border-l-4" : "border-l";
  const right = c === 3 ? "border-r-4" : "border-r";
  return `${top} ${right} ${bottom} ${left} border-black/30`;
}

/* ============================================================
   COLOR SUDOKU component
============================================================ */
function ColorSudoku({
  start,
  solution,
  isActive,
}: {
  start: (ColorKey | null)[][];
  solution: ColorKey[][];
  isActive: boolean;
}) {
  const [grid, setGrid] = useState<Cell[][]>(() =>
    start.map((row) => row.map((v) => ({ value: v, locked: v !== null })))
  );
  const [selectedColor, setSelectedColor] = useState<ColorKey | null>(null);
  const [showMistakes, setShowMistakes] = useState(true);
  const [won, setWon] = useState(false);

  const conflicts = useMemo(() => computeConflicts(grid), [grid]);

  useEffect(() => {
    const allFilled = grid.every((r) => r.every((c) => c.value !== null));
    const hasConflict = Object.values(conflicts).some(Boolean);
    setWon(allFilled && !hasConflict);
  }, [grid, conflicts]);

  function onDropCell(r: number, c: number, color: ColorKey | null) {
    setGrid((old) =>
      old.map((row, ri) =>
        row.map((cell, ci) => {
          if (ri !== r || ci !== c) return cell;
          if (cell.locked) return cell;
          return { ...cell, value: color };
        })
      )
    );
  }

  function handleDragStart(e: React.DragEvent, k: ColorKey) {
    e.dataTransfer.setData("text/color", k);
    e.dataTransfer.setData("text/plain", k);
  }

  function handleCellDrop(e: React.DragEvent, r: number, c: number) {
    e.preventDefault();
    const data = (e.dataTransfer.getData("text/color") || e.dataTransfer.getData("text/plain")) as
      | ColorKey
      | "";
    if (!data) return;
    if (!["R", "G", "B", "Y"].includes(data)) return;
    onDropCell(r, c, data as ColorKey);
  }

  function handleCellClick(r: number, c: number) {
    setGrid((old) =>
      old.map((row, ri) =>
        row.map((cell, ci) => {
          if (ri !== r || ci !== c) return cell;
          if (cell.locked) return cell;
          if (selectedColor) return { ...cell, value: selectedColor };
          return { ...cell, value: null };
        })
      )
    );
  }

  function reset() {
    setGrid(start.map((row) => row.map((v) => ({ value: v, locked: v !== null }))));
    setSelectedColor(null);
    setShowMistakes(true);
    setWon(false);
  }

  function fillComplete() {
    setGrid(
      solution.map((row, r) =>
        row.map((color, c) => ({
          value: color,
          locked: start[r][c] !== null,
        }))
      )
    );
  }

  return (
    <div className="mx-auto w-full max-w-[min(92vw,520px)]">
      {/* palette */}
      <div className="mb-4 flex flex-wrap items-center gap-3">
        {(["R", "G", "B", "Y"] as ColorKey[]).map((k, index) => {
          const active = selectedColor === k;
          return (
            <button
              key={k}
              draggable
              onDragStart={(e) => handleDragStart(e, k)}
              onClick={() => setSelectedColor((prev) => (prev === k ? null : k))}
              className={`h-8 w-8 rounded-full shadow ring-2 ring-white sm:h-10 sm:w-10 ${
                COLOR_META[k].class
              } cursor-grab outline-offset-2 transition-all duration-300 hover:scale-110 active:cursor-grabbing ${
                active ? "scale-110 outline outline-2 outline-black/70" : ""
              }`}
              style={{
                transitionDelay: isActive ? `${index * 100}ms` : "0ms",
                transform: isActive ? "scale(1)" : "scale(0)",
                opacity: isActive ? 1 : 0,
              }}
              title={`Drag or tap ${COLOR_META[k].label}`}
              aria-pressed={active}
              aria-label={`Select ${COLOR_META[k].label}`}
            />
          );
        })}

        <div
          className="ml-auto flex gap-2 transition-all delay-700 duration-500"
          style={{
            transform: isActive ? "translateX(0)" : "translateX(50px)",
            opacity: isActive ? 1 : 0,
          }}
        >
          <button
            onClick={() => setShowMistakes((s) => !s)}
            className="rounded-full bg-black/70 px-3 py-1 text-xs text-white transition-all duration-300 hover:scale-105 active:scale-95"
          >
            {showMistakes ? "Hide Mistakes" : "Show Mistakes"}
          </button>
          <button
            onClick={fillComplete}
            className="rounded-full bg-white px-3 py-1 text-xs text-brand-tealDark transition-all duration-300 hover:scale-105 active:scale-95"
          >
            Fill Complete
          </button>
          <button
            onClick={reset}
            className="rounded-full bg-black/70 px-3 py-1 text-xs text-white transition-all duration-300 hover:scale-105 active:scale-95"
          >
            Reset
          </button>
        </div>
      </div>

      {/* board */}
      <div
        className="grid w-full touch-manipulation select-none grid-cols-4 gap-0 overflow-hidden rounded-[20px] bg-white ring-1 ring-black/10 transition-all delay-300 duration-500"
        style={{
          transform: isActive ? "scale(1)" : "scale(0.9)",
          opacity: isActive ? 1 : 0,
        }}
      >
        {grid.map((row, r) =>
          row.map((cell, c) => {
            const key = `${r}-${c}`;
            const hasConflict = showMistakes && conflicts[key];

            return (
              <div
                key={key}
                onDragOver={(e) => e.preventDefault()}
                onDrop={(e) => handleCellDrop(e, r, c)}
                onClick={() => handleCellClick(r, c)}
                className={`relative aspect-square w-full ${cellBorders(
                  r,
                  c
                )} flex items-center justify-center transition-all duration-300 ${
                  cell.locked ? "cursor-not-allowed" : "cursor-pointer hover:brightness-95"
                } ${
                  cell.value
                    ? COLOR_META[cell.value].class
                    : cell.locked
                      ? "bg-brand-grayBg/50"
                      : "bg-white"
                }`}
                role="button"
                aria-label={`Row ${r + 1} column ${c + 1}${
                  cell.value ? ` ${COLOR_META[cell.value].label}` : " empty"
                }`}
                title={cell.locked ? "Locked cell" : "Click to place/clear or drop a color"}
              >
                {cell.value && (
                  <span
                    className={`h-3/5 w-3/5 rounded-xl shadow-inner transition-all duration-300 ${
                      COLOR_META[cell.value].class
                    }`}
                  />
                )}

                {!cell.value && !cell.locked && (
                  <span className="text-[10px] text-black/40 transition-all duration-300 sm:text-xs">
                    Drop / Tap
                  </span>
                )}

                {cell.locked && (
                  <span className="absolute right-1 top-1 text-[8px] text-black/40">•</span>
                )}

                {/* conflict highlight */}
                {hasConflict && (
                  <span className="pointer-events-none absolute inset-0 border-4 border-black bg-black/35 transition-all duration-300" />
                )}
              </div>
            );
          })
        )}
      </div>

      {won && (
        <div
          className="mt-4 rounded-xl bg-[#DDB24D] px-4 py-3 text-center font-semibold text-white transition-all delay-500 duration-500"
          style={{
            transform: isActive ? "scale(1)" : "scale(0)",
            opacity: isActive ? 1 : 0,
          }}
        >
          🎉 Great job! You solved it.
        </div>
      )}

      <p
        className="mt-3 text-xs text-black/50 transition-all delay-700 duration-500"
        style={{
          transform: isActive ? "translateY(0)" : "translateY(20px)",
          opacity: isActive ? 1 : 0,
        }}
      >
        Rule: Fill the 4×4 grid so that each row, column, and 2×2 box contains all four colors
        exactly once. Drag a color from the palette or tap a color, then tap a cell to place it.{" "}
        {showMistakes && "Conflicts are highlighted with a black ring and dark overlay."}
      </p>
    </div>
  );
}

/* ============================================================
   Conflict detection
============================================================ */
function computeConflicts(grid: Cell[][]): Record<string, boolean> {
  const size = 4;
  const box = 2;
  const conflicts: Record<string, boolean> = {};

  for (let r = 0; r < size; r++) {
    for (let c = 0; c < size; c++) {
      conflicts[`${r}-${c}`] = false;
    }
  }

  // rows
  for (let r = 0; r < size; r++) {
    const seen = new Map<ColorKey, number[]>();
    for (let c = 0; c < size; c++) {
      const v = grid[r][c].value;
      if (v) {
        const arr = seen.get(v) || [];
        arr.push(c);
        seen.set(v, arr);
      }
    }
    seen.forEach((cols) => {
      if (cols.length > 1) cols.forEach((cc) => (conflicts[`${r}-${cc}`] = true));
    });
  }

  // cols
  for (let c = 0; c < size; c++) {
    const seen = new Map<ColorKey, number[]>();
    for (let r = 0; r < size; r++) {
      const v = grid[r][c].value;
      if (v) {
        const arr = seen.get(v) || [];
        arr.push(r);
        seen.set(v, arr);
      }
    }
    seen.forEach((rows) => {
      if (rows.length > 1) rows.forEach((rr) => (conflicts[`${rr}-${c}`] = true));
    });
  }

  // boxes
  for (let br = 0; br < size; br += box) {
    for (let bc = 0; bc < size; bc += box) {
      const seen = new Map<ColorKey, [number, number][]>();
      for (let r = br; r < br + box; r++) {
        for (let c = bc; c < bc + box; c++) {
          const v = grid[r][c].value;
          if (v) {
            const arr = seen.get(v) || [];
            arr.push([r, c]);
            seen.set(v, arr);
          }
        }
      }
      seen.forEach((coords) => {
        if (coords.length > 1) coords.forEach(([r, c]) => (conflicts[`${r}-${c}`] = true));
      });
    }
  }
  return conflicts;
}

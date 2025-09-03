"use client";

import Image from "next/image";
import Link from "next/link";
import NavBar from "@/components/NavBar";
import { useEffect, useRef, useState, useMemo } from "react";
import CommunitySignupModal from "@/components/CommunitySignupModal";
import SiteFooter from "@/components/Footer";

/* ============================================================
   PAGE
============================================================ */
export default function Logicoland1Page() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const toggleFullscreen = () => {
    if (!videoRef.current) return;
    if (!document.fullscreenElement) {
      videoRef.current.requestFullscreen().catch(() => {});
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  return (
    <>
      <NavBar />

      <main className="bg-brand-grayBg text-brand-tealDark">
        {/* ================= HERO ================= */}
        <section className="relative px-3 sm:px-5 pt-4">
          <div className="relative rounded-[28px] bg-white p-2">
            <div className="relative rounded-[22px] overflow-hidden">
              <video
                ref={videoRef}
                autoPlay
                loop
                playsInline
                className="w-full h-[62vh] min-h-[420px] max-h-[780px] object-cover"
              >
                <source
                  src="https://ik.imagekit.io/pratik2002/Logicoland%201_3.mp4?updatedAt=1755475486495"
                  type="video/mp4"
                />
              </video>

              <div className="absolute inset-0 bg-gradient-to-r from-black/55 via-black/35 to-transparent" />
              <div className="absolute left-6 sm:left-10 top-8 sm:top-14 max-w-xl text-white">
                <p className="text-sm sm:text-base mb-3">Empowering Minds</p>
                <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold leading-tight">
                  Through STEM Play and
                  <br /> Logic-Based Learning
                </h1>
                <p className="mt-4 max-w-md text-white/90">
                  At Logicology we endeavour to make learning fun so that
                  children learn while they play.
                </p>
                <Link
                  href="#buy"
                  className="inline-block mt-6 bg-white text-brand-tealDark px-5 py-3 rounded-2xl font-semibold hover:bg-white/90"
                >
                  Learn more
                </Link>
              </div>

              <button
                onClick={toggleFullscreen}
                className="absolute bottom-4 right-4 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full"
                aria-label={
                  isFullscreen ? "Exit fullscreen" : "Enter fullscreen"
                }
              >
                {!isFullscreen ? (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M4 8h4V4m12 4h-4V4M4 16h4v4m12-4h-4v4"
                    />
                  </svg>
                ) : (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M6 16h12v4H6zm4-4V8m0 0H6m4 0h4"
                    />
                  </svg>
                )}
              </button>
            </div>
          </div>
        </section>

        {/* ================= LOGICOLAND V1 ================= */}
        <section
          id="buy"
          className="py-6 sm:py-8 md:py-10 px-3 sm:px-5 bg-brand-gold"
        >
          <div className="max-w-6xl mx-auto rounded-[22px] bg-white p-5 sm:p-8 shadow-soft">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-extrabold text-brand-tealDark">
                Logicoland Volume 1
              </h2>
              <p className="text-brand-tealDark/80 mt-2">
                Logic through coloring!
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-10 items-center">
              <div className="space-y-10">
                <BulletWithLine
                  side="left"
                  title="50+ brain-boosting challenges"
                  desc="Blend logic puzzles with creative coloring fun."
                />
                <BulletWithLine
                  side="left"
                  title="Intro to Sudoku"
                  desc="A playful, visual way to ease kids into logical thinking."
                />
              </div>

              <div className="flex items-center justify-center">
                <div className="relative w-56 sm:w-64 md:w-72 aspect-[3/4]">
                  <Image
                    src="https://ik.imagekit.io/pratik2002/logicolandbook.jpg?updatedAt=1756384482628"
                    alt="Logicoland Book"
                    fill
                    className="object-contain"
                    priority
                  />
                </div>
              </div>

              <div className="space-y-10">
                <BulletWithLine
                  side="right"
                  title="Skill-building disguised as fun"
                  desc="Sharpens deduction, focus, and pattern recognition."
                />
                <BulletWithLine
                  side="right"
                  title="Perfect for ages 6–12"
                  desc="Great for home learning, travel, or screen-free entertainment."
                />
              </div>
            </div>

            <div className="text-center mt-10">
              <Link
                href="#"
                className="inline-block bg-brand-gold text-white px-6 py-3 rounded-2xl font-semibold"
              >
                Buy now
              </Link>
            </div>
          </div>
        </section>

        {/* ================= INTERACTIVE PUZZLES ================= */}
        <section className="bg-brand-coral text-white mt-6">
          <div className="max-w-6xl mx-auto px-3 sm:px-5 py-12 sm:py-16 md:py-20 grid md:grid-cols-2 gap-12 items-center">
            <div>
              <p className="text-lg">Interactive</p>
              <h3 className="text-4xl font-extrabold">Puzzles</h3>

              <p className="mt-4 text-white/90">
                Solve the 4×4 Sudoku puzzles given here. The rules that you need
                to follow are:
              </p>
              <ol className="mt-3 list-decimal space-y-2 pl-6 text-white/90">
                <li>
                  Each standing line should have all 4 colours appearing exactly
                  once.
                </li>
                <li>
                  Each sleeping line should have all 4 colours appearing exactly
                  once.
                </li>
                <li>
                  Each 2×2 grid should have all 4 colours appearing exactly
                  once.
                </li>
              </ol>

              <a
                href="#puzzle"
                className="inline-block mt-6 bg-white/90 text-brand-tealDark px-5 py-3 rounded-2xl font-semibold hover:bg-white"
              >
                Solve now
              </a>
            </div>

            <div id="puzzle" className="relative">
              <div className="rounded-[26px] bg-white p-3">
                <div className="relative rounded-[20px] bg-brand-grayBg p-4 overflow-hidden">
                  {/* ▶▶ SLIDER WITH MULTIPLE SUDOKU GAMES ◀◀ */}
                  <SudokuSlider />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ================= PRINTABLES ================= */}
        <section className="py-12 sm:py-16 md:py-20 px-3 sm:px-5">
          <div className="max-w-6xl mx-auto rounded-[22px] bg-white p-6 sm:p-10 shadow-soft">
            <h3 className="text-center text-3xl font-extrabold text-brand-tealDark">
              Printables
            </h3>
            <p className="text-center text-brand-tealDark/80 mt-2">
              Done with Logicoland 1 already? Here are a few more 4×4 Sudoku
              puzzles to color.
            </p>

            <div className="grid md:grid-cols-2 gap-8 mt-10">
              <PrintableCard colorClass="bg-[#DDB24D]" />
              <PrintableCard colorClass="bg-[#E45C48]" />
            </div>

            <p className="text-center mt-8 text-brand-tealDark/70">
              For more join our community
            </p>
          </div>
        </section>

        {/* ================= COMMUNITY ================= */}
        <section className="bg-brand-teal py-12 sm:py-16 md:py-20">
          <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-10 items-center px-3 sm:px-5">
            <div className="rounded-[26px] bg-white p-3 w-full max-w-xl">
              <div className="relative rounded-[20px] overflow-hidden aspect-[4/3]">
                <Image
                  src="https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?q=80&w=1200&auto=format&fit=crop"
                  alt="Kids community"
                  fill
                  className="object-cover"
                />
              </div>
            </div>

            <div className="text-white">
              <p>Join the</p>
              <h3 className="text-4xl font-extrabold">Community</h3>
              <p className="mt-4 text-white/90">
                At Logicology we endeavour to make learning fun so that children
                learn while the play.
              </p>
              <button
                onClick={() => setIsModalOpen(true)}
                className="mt-6 bg-white text-brand-tealDark px-5 py-3 rounded-2xl font-semibold hover:bg-white/90"
              >
                Join Community
              </button>
            </div>
          </div>
        </section>

        <SiteFooter />
      </main>

      <CommunitySignupModal
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </>
  );
}

/* ============================================================
   COLOR SUDOKU (4×4) – constants and types
============================================================ */
type ColorKey = "R" | "G" | "B" | "Y";
type Cell = { value: ColorKey | null; locked?: boolean };

const COLOR_META: Record<
  ColorKey,
  { label: string; class: string; hex: string }
> = {
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
      ["Y", "R", null, null], // row 1: Y, R are colored givens
      [null, null, null, null],
      [null, "Y", "B", null], // row 3: Y and B are colored givens
      ["G", null, null, "R"], // row 4: G and R are colored givens
    ],
    solution: SOL1,
  },
  {
    name: "Puzzle 2",
    start: [
      ["B", null, null, "G"], // row 1: solid B and G
      [null, "Y", "B", null], // row 2: solid Y and B
      [null, "G", null, null], // row 3: solid G
      ["R", null, null, null], // row 4: solid R
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
    solution: [
      ["B", "G", "Y", "R"],
      ["R", "Y", "G", "B"],
      ["G", "B", "R", "Y"],
      ["Y", "R", "B", "G"],
    ],
  },
];

function SudokuSlider() {
  const [idx, setIdx] = useState(0);
  const total = PUZZLES.length;

  const next = () => setIdx((i) => (i + 1) % total);
  const prev = () => setIdx((i) => (i - 1 + total) % total);

  return (
    <div className="w-full">
      <div className="mb-3 flex items-center justify-between">
        <div className="font-semibold text-brand-tealDark">
          {PUZZLES[idx].name}
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={prev}
            className="px-3 py-1.5 rounded-full bg-white text-brand-tealDark ring-1 ring-black/10 hover:bg-white/90"
          >
            ◀
          </button>
          <button
            onClick={next}
            className="px-3 py-1.5 rounded-full bg-white text-brand-tealDark ring-1 ring-black/10 hover:bg-white/90"
          >
            ▶
          </button>
        </div>
      </div>

      <ColorSudoku
        key={idx}
        start={PUZZLES[idx].start}
        solution={PUZZLES[idx].solution}
      />

      <div className="mt-3 flex justify-center gap-2">
        {PUZZLES.map((_, i) => (
          <button
            key={i}
            aria-label={`Go to puzzle ${i + 1}`}
            onClick={() => setIdx(i)}
            className={`h-2.5 w-2.5 rounded-full ${
              i === idx ? "bg-brand-tealDark" : "bg-black/20"
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
   - Black conflict ring + dark overlay on wrong cells
============================================================ */
function ColorSudoku({
  start,
  solution,
}: {
  start: (ColorKey | null)[][];
  solution: ColorKey[][];
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
    const data = (e.dataTransfer.getData("text/color") ||
      e.dataTransfer.getData("text/plain")) as ColorKey | "";
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
    setGrid(
      start.map((row) => row.map((v) => ({ value: v, locked: v !== null })))
    );
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
    <div className="w-full max-w-[min(92vw,520px)] mx-auto">
      {/* palette */}
      <div className="mb-4 flex flex-wrap items-center gap-3">
        {(["R", "G", "B", "Y"] as ColorKey[]).map((k) => {
          const active = selectedColor === k;
          return (
            <button
              key={k}
              draggable
              onDragStart={(e) => handleDragStart(e, k)}
              onClick={() =>
                setSelectedColor((prev) => (prev === k ? null : k))
              }
              className={`h-8 w-8 sm:h-10 sm:w-10 rounded-full ring-2 ring-white shadow ${
                COLOR_META[k].class
              } cursor-grab active:cursor-grabbing outline-offset-2 ${
                active ? "outline outline-2 outline-black/70" : ""
              }`}
              title={`Drag or tap ${COLOR_META[k].label}`}
              aria-pressed={active}
              aria-label={`Select ${COLOR_META[k].label}`}
            />
          );
        })}

        <div className="ml-auto flex gap-2">
          <button
            onClick={() => setShowMistakes((s) => !s)}
            className="text-xs rounded-full px-3 py-1 bg-black/70 text-white"
          >
            {showMistakes ? "Hide Mistakes" : "Show Mistakes"}
          </button>
          <button
            onClick={fillComplete}
            className="text-xs rounded-full px-3 py-1 bg-white text-brand-tealDark"
          >
            Fill Complete
          </button>
          <button
            onClick={reset}
            className="text-xs rounded-full px-3 py-1 bg-black/70 text-white"
          >
            Reset
          </button>
        </div>
      </div>

      {/* board */}
      <div className="grid grid-cols-4 gap-0 rounded-[20px] overflow-hidden bg-white ring-1 ring-black/10 select-none w-full touch-manipulation">
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
                className={`relative w-full aspect-square ${cellBorders(
                  r,
                  c
                )} flex items-center justify-center transition-colors ${
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
                title={
                  cell.locked
                    ? "Locked cell"
                    : "Click to place/clear or drop a color"
                }
              >
                {cell.value && (
                  <span
                    className={`w-3/5 h-3/5 rounded-xl shadow-inner ${
                      COLOR_META[cell.value].class
                    }`}
                  />
                )}

                {!cell.value && !cell.locked && (
                  <span className="text-[10px] sm:text-xs text-black/40">
                    Drop / Tap
                  </span>
                )}

                {cell.locked && (
                  <span className="absolute top-1 right-1 text-[10px] px-1.5 py-0.5 rounded bg-black/10 text-black/60">
                    •
                  </span>
                )}

                {/* conflict highlight: black border on all sides + dark overlay */}
                {hasConflict && (
                  <span className="pointer-events-none absolute inset-0 border-4 border-black bg-black/35" />
                )}
              </div>
            );
          })
        )}
      </div>

      {won && (
        <div className="mt-4 rounded-xl bg-[#DDB24D] text-white px-4 py-3 text-center font-semibold">
          🎉 Great job! You solved it.
        </div>
      )}

      <p className="mt-3 text-xs text-black/50">
        Rule: Fill the 4×4 grid so that each row, column, and 2×2 box contains
        all four colors exactly once. Drag a color from the palette or tap a
        color, then tap a cell to place it.{" "}
        {showMistakes &&
          "Conflicts are highlighted with a black ring and dark overlay."}
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
      if (cols.length > 1)
        cols.forEach((cc) => (conflicts[`${r}-${cc}`] = true));
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
      if (rows.length > 1)
        rows.forEach((rr) => (conflicts[`${rr}-${c}`] = true));
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
        if (coords.length > 1)
          coords.forEach(([r, c]) => (conflicts[`${r}-${c}`] = true));
      });
    }
  }
  return conflicts;
}

/* ============================================================
   Little helpers
============================================================ */
const BULLET_ICON =
  "https://ik.imagekit.io/pratik2002/bullter.JPG?updatedAt=1756384008169";

function BulletWithLine({
  side,
  title,
  desc,
}: {
  side: "left" | "right";
  title: string;
  desc: string;
}) {
  const isLeft = side === "left";
  return (
    <div
      className={`md:flex md:items-start md:gap-0 ${
        isLeft ? "md:flex-row" : "md:flex-row-reverse"
      }`}
    >
      <div className="shrink-0">
        <Image
          src={BULLET_ICON}
          alt=""
          width={48}
          height={48}
          className="h-12 w-12 rounded-full object-contain"
        />
      </div>
      <div
        className={`relative hidden md:block h-0 border-t-2 border-dashed border-brand-teal/40 w-28 lg:w-40 ${
          isLeft ? "ml-3 mr-4" : "mr-3 ml-4"
        } translate-y-6`}
      >
        <span
          className={`absolute -top-[5px] h-2 w-2 rounded-full bg-brand-teal/60 ${
            isLeft ? "right-0" : "left-0"
          }`}
        />
      </div>
      <div
        className={`${isLeft ? "md:ml-0" : "md:mr-0"} ${
          isLeft ? "ml-4" : "mr-4"
        } md:ml-0 md:mr-0 max-w-[320px]`}
      >
        <div className="text-sm font-semibold text-brand-tealDark leading-tight">
          {title}
        </div>
        <p className="mt-2 text-sm leading-relaxed text-brand-tealDark/80">
          {desc}
        </p>
      </div>
    </div>
  );
}

function PrintableCard({ colorClass }: { colorClass: string }) {
  return (
    <div className="rounded-[18px] bg-white p-3 shadow-soft">
      <div className={`rounded-[14px] h-64 ${colorClass} relative`}>
        <button className="absolute bottom-3 left-1/2 -translate-x-1/2 bg-black/70 text-white text-xs px-3 py-1 rounded-full">
          Download pdf
        </button>
      </div>
    </div>
  );
}

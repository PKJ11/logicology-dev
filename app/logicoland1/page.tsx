"use client";

import Image from "next/image";
import Link from "next/link";
import NavBar from "@/components/NavBar";
import { useEffect, useRef, useState } from "react";
import CommunitySignupModal from "@/components/CommunitySignupModal";
import SiteFooter from "@/components/Footer";

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

  /* ================= COLOR SUDOKU (drag & drop) ================= */

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

  // A nice, solvable 4x4 puzzle (null = empty). Locked cells can’t be changed.
  const START: (ColorKey | null)[][] = [
    // rows: 0..3, cols: 0..3
    ["G", null, "B", null],
    [null, "B", null, "Y"],
    ["Y", null, "G", null],
    [null, "Y", null, "R"],
  ];

  function ColorSudoku() {
    // Define the correct solution
    const SOLUTION: (ColorKey | null)[][] = [
      ["G", "Y", "B", "R"],
      ["R", "B", "G", "Y"],
      ["Y", "R", "G", "B"],
      ["B", "Y", "R", "G"],
    ];

    const [grid, setGrid] = useState<Cell[][]>(() =>
      START.map((row) => row.map((v) => ({ value: v, locked: v !== null })))
    );
    const [dragColor, setDragColor] = useState<ColorKey | null>(null);
    const [won, setWon] = useState(false);
    const [showMistakes, setShowMistakes] = useState(true);

    // Check if the current grid matches the solution
    useEffect(() => {
      const isCorrect = grid.every((row, r) =>
        row.every((cell, c) => cell.value === SOLUTION[r][c])
      );
      setWon(isCorrect);
    }, [grid]);

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

    function handleDragStart(color: ColorKey) {
      setDragColor(color);
    }

    function handleDragEnd() {
      setDragColor(null);
    }

    function handleCellDrop(e: React.DragEvent, r: number, c: number) {
      e.preventDefault();
      const data = e.dataTransfer.getData("text/plain") as ColorKey | "";
      if (!data) return;
      onDropCell(r, c, data as ColorKey);
    }

    function handleCellClick(r: number, c: number) {
      // Click to clear (only if not locked)
      if (!grid[r][c].locked) {
        setGrid((old) =>
          old.map((row, ri) =>
            row.map((cell, ci) => {
              if (ri !== r || ci !== c) return cell;
              return { ...cell, value: null };
            })
          )
        );
      }
    }

    function reset() {
      setGrid(
        START.map((row) => row.map((v) => ({ value: v, locked: v !== null })))
      );
      setWon(false);
    }

    function fillComplete() {
      // Fill all cells with the correct colors from the solution
      setGrid(
        SOLUTION.map((row, r) =>
          row.map((color, c) => ({
            value: color,
            locked: START[r][c] !== null, // Keep original locked status
          }))
        )
      );
    }

    // Check if a cell is correct
    function isCellCorrect(r: number, c: number): boolean {
      return grid[r][c].value === SOLUTION[r][c];
    }

    return (
      <div className="w-full">
        {/* palette */}
        <div className="mb-4 flex items-center gap-3">
          {(["R", "G", "B", "Y"] as ColorKey[]).map((k) => (
            <div
              key={k}
              draggable
              onDragStart={(e) => {
                e.dataTransfer.setData("text/plain", k);
                handleDragStart(k);
              }}
              onDragEnd={handleDragEnd}
              className={`h-10 w-10 rounded-full ring-2 ring-white shadow ${COLOR_META[k].class} cursor-grab active:cursor-grabbing`}
              title={`Drag ${COLOR_META[k].label}`}
              aria-label={`Drag ${COLOR_META[k].label}`}
            />
          ))}

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
        <div
          className="
          grid grid-cols-4 gap-0
          rounded-[20px] overflow-hidden bg-white
          ring-1 ring-black/10
        "
        >
          {grid.map((row, r) =>
            row.map((cell, c) => {
              const key = `${r}-${c}`;
              const isCorrect = isCellCorrect(r, c);
              const showIncorrect = showMistakes && cell.value && !isCorrect;
              const thickBorder = `
              ${r % 2 === 0 ? "border-t-2" : "border-t"}
              ${c % 2 === 0 ? "border-l-2" : "border-l"}
              ${r === 3 ? "border-b-2" : "border-b"}
              ${c === 3 ? "border-r-2" : "border-r"}
            `;
              return (
                <div
                  key={key}
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={(e) => handleCellDrop(e, r, c)}
                  onClick={() => handleCellClick(r, c)}
                  className={`
                  relative h-20 sm:h-24 md:h-28
                  ${thickBorder} border-black/20
                  flex items-center justify-center
                  transition-colors
                  ${cell.locked ? "bg-brand-grayBg/50" : "bg-white"}
                  ${showIncorrect ? "outline outline-2 outline-red-500/70" : ""}
                  ${isCorrect ? "outline outline-2 outline-green-500/70" : ""}
                `}
                  role="button"
                  aria-label={`Row ${r + 1} column ${c + 1}${
                    cell.value ? ` ${COLOR_META[cell.value].label}` : " empty"
                  }`}
                  title={
                    cell.locked
                      ? "Locked cell"
                      : "Click to clear / drop a color"
                  }
                >
                  {cell.value && (
                    <span
                      className={`h-12 w-12 sm:h-14 sm:w-14 rounded-xl shadow-inner ${
                        COLOR_META[cell.value].class
                      }`}
                    />
                  )}
                  {!cell.value && !cell.locked && (
                    <span className="text-xs text-black/40">Drop color</span>
                  )}
                  {cell.locked && (
                    <span className="absolute top-1 right-1 text-[10px] px-1.5 py-0.5 rounded bg-black/10 text-black/60">
                      •
                    </span>
                  )}
                  {isCorrect && (
                    <span className="absolute top-1 left-1 text-green-500">
                      ✓
                    </span>
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
          Rule: Fill the 4×4 so each row, column, and each 2×2 box has all four
          colors once. Drag a color from the palette; click a cell to clear it.
          {showMistakes && " Incorrect placements are highlighted in red."}
        </p>
      </div>
    );
  }

  function getConflicts(grid: Cell[][]): Record<string, boolean> {
    const conflicts: Record<string, boolean> = {};
    for (let r = 0; r < 4; r++)
      for (let c = 0; c < 4; c++) conflicts[`${r}-${c}`] = false;

    // No iterators; use Map.forEach and typed tuples.
    const markDup = (coords: Array<[number, number]>) => {
      const seen = new Map<ColorKey, Array<[number, number]>>();
      coords.forEach(([rr, cc]: [number, number]) => {
        const v = grid[rr][cc].value;
        if (!v) return;
        const arr = seen.get(v) ?? [];
        arr.push([rr, cc]);
        seen.set(v, arr);
      });
      seen.forEach((arr) => {
        if (arr.length > 1) {
          arr.forEach(([rr, cc]: [number, number]) => {
            conflicts[`${rr}-${cc}`] = true;
          });
        }
      });
    };

    for (let r = 0; r < 4; r++)
      markDup([
        [r, 0],
        [r, 1],
        [r, 2],
        [r, 3],
      ]);
    for (let c = 0; c < 4; c++)
      markDup([
        [0, c],
        [1, c],
        [2, c],
        [3, c],
      ]);

    for (let br = 0; br < 4; br += 2) {
      for (let bc = 0; bc < 4; bc += 2) {
        markDup([
          [br, bc],
          [br, bc + 1],
          [br + 1, bc],
          [br + 1, bc + 1],
        ]);
      }
    }
    return conflicts;
  }

  function isAllowed(grid: Cell[][], r: number, c: number, v: ColorKey) {
    // row
    for (let i = 0; i < 4; i++)
      if (i !== c && grid[r][i].value === v) return false;
    // col
    for (let i = 0; i < 4; i++)
      if (i !== r && grid[i][c].value === v) return false;
    // box
    const br = Math.floor(r / 2) * 2;
    const bc = Math.floor(c / 2) * 2;
    const coords: Array<[number, number]> = [
      [br, bc],
      [br, bc + 1],
      [br + 1, bc],
      [br + 1, bc + 1],
    ];
    for (let k = 0; k < coords.length; k++) {
      const rr = coords[k][0];
      const cc = coords[k][1];
      if (!(rr === r && cc === c) && grid[rr][cc].value === v) return false;
    }
    return true;
  }

  return (
    <>
      <NavBar />

      <main className="bg-brand-grayBg text-brand-tealDark">
        {/* ================= HERO (Video with rounded white frame) ================= */}
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

              {/* gradient + text block, left-aligned like the mock */}
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

              {/* fullscreen button */}
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

        {/* ================= LOGICOLAND VOLUME 1 (White card) ================= */}
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
              {/* Left column */}
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

              {/* Center book image */}
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

              {/* Right column */}
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

        {/* ================= INTERACTIVE PUZZLES (Coral band + framed media) ================= */}
        <section className="bg-brand-coral text-white mt-6">
          <div className="max-w-6xl mx-auto px-3 sm:px-5 py-12 sm:py-16 md:py-20 grid md:grid-cols-2 gap-12 items-center">
            <div>
              <p className="text-lg">Interactive</p>
              <h3 className="text-4xl font-extrabold">Puzzles</h3>
              <p className="mt-4 text-white/90">
                Solve the following drag and drop puzzles
              </p>
              <a
                href="#puzzle"
                className="inline-block mt-6 bg-white/90 text-brand-tealDark px-5 py-3 rounded-2xl font-semibold hover:bg-white"
              >
                Solve now
              </a>
            </div>

            {/* Framed game */}
            <div id="puzzle" className="relative">
              <div className="rounded-[26px] bg-white p-3">
                <div className="relative rounded-[20px] bg-brand-grayBg p-4 overflow-hidden">
                  <ColorSudoku />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ================= PRINTABLES (White card with two tiles) ================= */}
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

        {/* ================= COMMUNITY (Teal split) ================= */}
        <section className="bg-brand-teal py-12 sm:py-16 md:py-20">
          <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-10 items-center px-3 sm:px-5">
            {/* Left framed image */}
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

            {/* Right copy */}
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

      {/* Modal */}
      <CommunitySignupModal
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </>
  );
}

/* ============== little helpers ============== */

// --- drop this in place of your current BulletWithLine ---
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
      className={`
        md:flex md:items-start md:gap-0
        ${isLeft ? "md:flex-row" : "md:flex-row-reverse"}
      `}
    >
      {/* icon */}
      <div className="shrink-0">
        <Image
          src={BULLET_ICON}
          alt=""
          width={48}
          height={48}
          className="h-12 w-12 rounded-full object-contain"
        />
      </div>

      {/* dashed connector (only md+) */}
      <div
        className={`
          relative hidden md:block h-0 border-t-2 border-dashed border-brand-teal/40
          w-28 lg:w-40 ${isLeft ? "ml-3 mr-4" : "mr-3 ml-4"}
          translate-y-6
        `}
      >
        {/* terminal dot */}
        <span
          className={`
            absolute -top-[5px] h-2 w-2 rounded-full bg-brand-teal/60
            ${isLeft ? "right-0" : "left-0"}
          `}
        />
      </div>

      {/* text block (title + desc) */}
      <div
        className={`
          ${isLeft ? "md:ml-0" : "md:mr-0"}
          ${isLeft ? "ml-4" : "mr-4"} md:ml-0 md:mr-0
          max-w-[320px]
        `}
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

function Feature({ title, desc }: { title: string; desc: string }) {
  return (
    <div className="flex items-start">
      <div className="h-9 w-9 rounded-xl bg-brand-teal/10 text-brand-teal flex items-center justify-center mr-3">
        ★
      </div>
      <div>
        <h4 className="font-semibold">{title}</h4>
        <p className="text-sm text-brand-tealDark/80">{desc}</p>
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

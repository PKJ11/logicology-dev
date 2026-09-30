"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { PartyPopper, X } from "lucide-react";

// Palette matched to the rest of the design system (Word Builder / Letter Swap / Color Sudoku).
const NAVY = "#1B4552";
const TEAL = "#009A88";
const ORANGE = "#FA9E15";
const ORANGE_LIGHT = "#FBB041";
const GRAY_TEXT = "#707070";
const GRAY_LIGHT = "#F2F2F2";
const OFFWHITE = "#FCFCFC";

const LOGO_URL =
  "https://ik.imagekit.io/pratik2002/logo-logicology-removebg-preview.png?updatedAt=1760432002538";

const FONT_IMPORT = `@import url('https://fonts.googleapis.com/css2?family=Alfa+Slab+One&display=swap');`;

export default function SymmetryPatternPage() {
  return (
    <main className="h-screen w-full overflow-hidden" style={{ backgroundColor: NAVY }}>
      <style dangerouslySetInnerHTML={{ __html: FONT_IMPORT }} />
      <section id="symmetry-game" className="h-full w-full">
        <SymmetryPatternGame />
      </section>
    </main>
  );
}

function SymmetryPatternGame() {
  const gridSize = 6;
  const BLANK_CELL_COLOR = GRAY_LIGHT;

  // Legend / picker colors — ordered to match the reference design.
  const colors = ["#e74c3c", "#2ecc71", "#3498db", "#f1c40f", "#ff8c00", "#9b59b6"];

  const [isSymmetric, setIsSymmetric] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [activeCell, setActiveCell] = useState<{ row: number; col: number } | null>(null);
  const [showRules, setShowRules] = useState(false);
  const popupRef = useRef<HTMLDivElement | null>(null);

  const solutionGrid = [
    ["#e74c3c", "#f1c40f", "#2ecc71", "#2ecc71", "#f1c40f", "#e74c3c"],
    ["#f1c40f", "#3498db", "#9b59b6", "#9b59b6", "#3498db", "#f1c40f"],
    ["#2ecc71", "#9b59b6", "#ff8c00", "#ff8c00", "#9b59b6", "#2ecc71"],
    ["#2ecc71", "#9b59b6", "#ff8c00", "#ff8c00", "#9b59b6", "#2ecc71"],
    ["#f1c40f", "#3498db", "#9b59b6", "#9b59b6", "#3498db", "#f1c40f"],
    ["#e74c3c", "#f1c40f", "#2ecc71", "#2ecc71", "#f1c40f", "#e74c3c"],
  ];

  const initialGrid = [
    [BLANK_CELL_COLOR, BLANK_CELL_COLOR, BLANK_CELL_COLOR, BLANK_CELL_COLOR, "#f1c40f", "#e74c3c"],
    ["#f1c40f", "#3498db", "#9b59b6", "#9b59b6", BLANK_CELL_COLOR, BLANK_CELL_COLOR],
    [BLANK_CELL_COLOR, "#9b59b6", "#ff8c00", BLANK_CELL_COLOR, BLANK_CELL_COLOR, "#2ecc71"],
    ["#2ecc71", BLANK_CELL_COLOR, BLANK_CELL_COLOR, BLANK_CELL_COLOR, "#9b59b6", BLANK_CELL_COLOR],
    [
      "#f1c40f",
      BLANK_CELL_COLOR,
      BLANK_CELL_COLOR,
      BLANK_CELL_COLOR,
      BLANK_CELL_COLOR,
      BLANK_CELL_COLOR,
    ],
    [BLANK_CELL_COLOR, "#f1c40f", "#2ecc71", "#2ecc71", BLANK_CELL_COLOR, BLANK_CELL_COLOR],
  ];

  const [grid, setGrid] = useState(initialGrid);

  // A cell is "locked" (a fixed given) if it started with a real color — this never changes,
  // regardless of what the user later places in the cells that started blank.
  const lockedMask = initialGrid.map((row) => row.map((c) => c !== BLANK_CELL_COLOR));

  const isLocked = (row: number, col: number) => lockedMask[row][col];
  const isEditable = (row: number, col: number) => !isLocked(row, col);
  const isDraggable = (row: number, col: number) => grid[row][col] !== BLANK_CELL_COLOR;
  const isBlankCell = (row: number, col: number) => grid[row][col] === BLANK_CELL_COLOR;

  const checkSolution = (currentGrid: string[][]) => {
    for (let i = 0; i < gridSize; i++)
      for (let j = 0; j < gridSize; j++) if (currentGrid[i][j] !== solutionGrid[i][j]) return false;
    return true;
  };

  const handleDragStart = (row: number, col: number, e: React.DragEvent) => {
    if (!isDraggable(row, col)) return;
    e.dataTransfer.setData("text/plain", JSON.stringify({ row, col, color: grid[row][col] }));
    e.dataTransfer.effectAllowed = "copy";
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "copy";
  };

  const handleDrop = (row: number, col: number, e: React.DragEvent) => {
    e.preventDefault();
    if (!isEditable(row, col)) return;
    try {
      const data = JSON.parse(e.dataTransfer.getData("text/plain"));
      const newGrid = grid.map((r) => [...r]);
      newGrid[row][col] = data.color;
      setGrid(newGrid);
      setIsSymmetric(checkSolution(newGrid));
    } catch (error) {
      console.error("Drop error:", error);
    }
  };

  const handleCellClick = (row: number, col: number) => {
    if (!isEditable(row, col)) return;
    setActiveCell((prev) => (prev && prev.row === row && prev.col === col ? null : { row, col }));
  };

  const handleColorPick = (row: number, col: number, color: string) => {
    const newGrid = grid.map((r) => [...r]);
    newGrid[row][col] = color;
    setGrid(newGrid);
    setIsSymmetric(checkSolution(newGrid));
    setActiveCell(null);
  };

  const handleReset = () => {
    setGrid(initialGrid);
    setIsSymmetric(false);
    setActiveCell(null);
    setShowSuccess(false);
  };

  useEffect(() => {
    if (isSymmetric) setShowSuccess(true);
  }, [isSymmetric]);

  useEffect(() => {
    if (!activeCell) return;
    const handleClickOutside = (e: MouseEvent) => {
      if (popupRef.current && !popupRef.current.contains(e.target as Node)) {
        setActiveCell(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [activeCell]);

  const getPopoverPosition = (row: number, col: number, size: number): React.CSSProperties => {
    const cellPct = 100 / size;
    const top = `${row * cellPct}%`;
    // The top row has no room to open upward inside the card, so it opens downward instead
    // (anchored to the bottom of that row) while every other row opens above the cell as usual.
    const verticalTransform = row === 0 ? `calc(${cellPct}% + 8px)` : "calc(-100% - 8px)";

    if (col === 0) {
      return { left: "0%", top, transform: `translate(0, ${verticalTransform})` };
    }
    if (col === size - 1) {
      return { left: "100%", top, transform: `translate(-100%, ${verticalTransform})` };
    }
    return { left: `${(col + 0.5) * cellPct}%`, top, transform: `translate(-50%, ${verticalTransform})` };
  };

  const getBorderClass = (i: number, j: number) => {
    const classes: string[] = [];
    if (i === 0) classes.push("border-t");
    if (i === gridSize - 1) classes.push("border-b");
    if (j === 0) classes.push("border-l");
    if (j === gridSize - 1) classes.push("border-r");
    if (i < gridSize - 1) classes.push("border-b");
    if (j < gridSize - 1) classes.push("border-r");
    if (i === 2) classes.push("border-b-[3px]");
    if (j === 2) classes.push("border-r-[3px]");
    return classes.join(" ") + " border-black/25";
  };

  return (
    <div className="flex h-full w-full items-center justify-center px-3 py-[clamp(6px,2vh,20px)]">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative mx-auto flex w-full max-w-[720px] flex-col rounded-[28px] px-[clamp(16px,4vw,32px)] py-[clamp(14px,2.2vh,28px)] shadow-soft ring-1 ring-black/5"
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
            Puzzle 1
          </span>
        </div>

        {/* Mascot logo */}
        <div
          className="mx-auto mb-[clamp(4px,1vh,10px)] flex h-[clamp(44px,7vh,72px)] w-[clamp(44px,7vh,72px)] items-center justify-center rounded-full"
        >
          <img src={LOGO_URL} alt="Logicology logo" className="h-[100%] w-[100%] object-contain" />
        </div>

        {/* Title */}
        <h2
          className="text-center text-[clamp(20px,3.6vh,34px)]"
          style={{ fontFamily: "'Alfa Slab One', serif", color: TEAL }}
        >
          Symmetric Pattern
        </h2>
        <p
          className="mx-auto mt-[clamp(2px,0.8vh,8px)] max-w-md text-center text-[clamp(10px,1.4vh,14px)]"
          style={{ color: GRAY_TEXT }}
        >
          Fill In The Blank Cells To Complete The Perfectly Symmetric Colour Pattern.
        </p>

        {/* Game row: legend | grid | rules/reset */}
        <div className="relative mx-auto mt-[clamp(8px,1.8vh,20px)] w-full max-w-[600px]">
          <div className="flex w-full items-start justify-center gap-[clamp(8px,2vw,20px)]">
            {/* Vertical color legend — view-only */}
            <div
              className="flex min-h-[clamp(160px,32vh,260px)] flex-col items-center justify-start gap-[clamp(8px,1.8vh,16px)] rounded-full px-[clamp(7px,1.4vw,14px)] py-[clamp(12px,2.6vh,24px)]"
              style={{ backgroundColor: GRAY_LIGHT }}
            >
              {colors.map((color) => (
                <span
                  key={color}
                  className="h-[clamp(18px,3.2vh,28px)] w-[clamp(18px,3.2vh,28px)] shrink-0 rounded-full shadow"
                  style={{ backgroundColor: color, boxShadow: "0 1px 2px rgba(0,0,0,0.15)" }}
                />
              ))}
            </div>

            {/* Grid */}
            <div className="relative w-full max-w-[clamp(220px,42vh,340px)]">
              <div
                className="grid w-full touch-manipulation select-none grid-cols-6 gap-0 overflow-hidden rounded-2xl ring-1 ring-black/10"
                style={{ backgroundColor: GRAY_LIGHT }}
              >
                {grid.map((row, i) =>
                  row.map((cell, j) => {
                    const cellDraggable = isDraggable(i, j);
                    const cellEditable = isEditable(i, j);

                    return (
                      <div
                        key={`${i}-${j}`}
                        draggable={cellDraggable}
                        onDragStart={(e) => handleDragStart(i, j, e)}
                        onDragOver={cellEditable ? handleDragOver : undefined}
                        onDrop={cellEditable ? (e) => handleDrop(i, j, e) : undefined}
                        onClick={() => handleCellClick(i, j)}
                        style={{ backgroundColor: cell }}
                        className={`relative flex aspect-square w-full items-center justify-center transition-all duration-200 ${getBorderClass(
                          i,
                          j
                        )} ${
                          cellEditable
                            ? "cursor-pointer hover:brightness-95"
                            : cellDraggable
                              ? "cursor-grab hover:opacity-90 active:cursor-grabbing"
                              : "cursor-default"
                        }`}
                        role="button"
                        aria-label={
                          isBlankCell(i, j)
                            ? `Row ${i + 1} col ${j + 1} - empty`
                            : `Row ${i + 1} col ${j + 1} - ${cell}${cellEditable ? " (tap to change)" : ""}`
                        }
                      />
                    );
                  })
                )}
              </div>

              {/* Floating color popover above the active cell — a sibling of the grid so the
                  grid's own overflow-hidden (used for rounded corners) never clips it. */}
              {activeCell && (
                <div
                  ref={popupRef}
                  onClick={(e) => e.stopPropagation()}
                  className="absolute z-10 flex items-center gap-1.5 rounded-full px-[clamp(8px,1.6vw,12px)] py-[clamp(4px,1vh,7px)] shadow-lg ring-1 ring-black/10"
                  style={{
                    backgroundColor: OFFWHITE,
                    ...getPopoverPosition(activeCell.row, activeCell.col, gridSize),
                  }}
                >
                  {colors.map((color) => (
                    <button
                      key={color}
                      onClick={() => handleColorPick(activeCell.row, activeCell.col, color)}
                      aria-label={`Fill with ${color}`}
                      className="h-[clamp(14px,2.4vh,22px)] w-[clamp(14px,2.4vh,22px)] shrink-0 rounded-full transition-transform duration-150 hover:scale-125"
                      style={{ backgroundColor: color }}
                    />
                  ))}
                </div>
              )}
            </div>

            {/* RULES / RESET — stacked on the right */}
            <div className="flex flex-col gap-[clamp(4px,1vh,8px)]">
              <button
                onClick={() => setShowRules(true)}
                className="rounded-full px-[clamp(10px,2.2vw,16px)] py-[clamp(5px,1.1vh,8px)] text-[clamp(10px,1.3vh,12px)] font-bold tracking-wide transition-transform duration-200 hover:scale-105"
                style={{ backgroundColor: ORANGE_LIGHT, color: NAVY }}
              >
                RULES
              </button>
              <button
                onClick={handleReset}
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
        </div>

        {/* Navigation — single puzzle, so both ends are disabled */}
        <div className="mt-[clamp(10px,2vh,20px)] flex items-center justify-between gap-2">
          <button
            disabled
            className="rounded-full px-[clamp(14px,3vw,22px)] py-[clamp(6px,1.2vh,9px)] text-[clamp(10px,1.4vh,13px)] font-bold tracking-wide text-white opacity-30"
            style={{ backgroundColor: ORANGE_LIGHT }}
          >
            PREVIOUS
          </button>
          <button
            disabled
            className="rounded-full px-[clamp(14px,3vw,22px)] py-[clamp(6px,1.2vh,9px)] text-[clamp(10px,1.4vh,13px)] font-bold tracking-wide text-white opacity-30"
            style={{ backgroundColor: TEAL }}
          >
            NEXT
          </button>
        </div>
      </motion.div>

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
                Perfect symmetry — you solved it.
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Rules modal */}
      <AnimatePresence>
        {showRules && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowRules(false)}
          >
            <motion.div
              initial={{ scale: 0.3, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.3, opacity: 0 }}
              transition={{ type: "spring", stiffness: 300, damping: 22 }}
              onClick={(e) => e.stopPropagation()}
              className="relative w-full max-w-sm rounded-2xl p-6 text-center shadow-2xl sm:max-w-md"
              style={{ backgroundColor: OFFWHITE }}
            >
              <button
                onClick={() => setShowRules(false)}
                aria-label="Close"
                className="absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-full text-white transition-transform duration-200 hover:scale-110"
                style={{ backgroundColor: ORANGE }}
              >
                <X className="h-4 w-4" strokeWidth={3} />
              </button>

              <p className="text-sm font-bold uppercase tracking-[0.15em] sm:text-base" style={{ color: NAVY }}>
                Rules
              </p>

              <div className="mt-5 space-y-4 text-left sm:text-center">
                <p className="text-sm sm:text-base" style={{ color: GRAY_TEXT }}>
                  The pattern must be symmetric along the vertical axis (left ↔ right).
                </p>
                <p className="text-sm sm:text-base" style={{ color: GRAY_TEXT }}>
                  The pattern must be symmetric along the horizontal axis (top ↔ bottom).
                </p>
                <p className="text-sm sm:text-base" style={{ color: GRAY_TEXT }}>
                  Drag a colour from any filled cell onto a blank cell — or click a blank cell to
                  pick a colour from the palette that pops up above it.
                </p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
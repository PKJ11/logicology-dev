"use client";

import NavBar from "@/components/NavBar";
import SiteFooter from "@/components/Footer";
import { useEffect, useRef, useState } from "react";

export default function SymmetryPatternPage() {
  return (
    <main className="bg-brand-grayBg text-brand-tealDark">
      <NavBar />
      <section id="symmetry-game">
        <SymmetryPatternGame />
      </section>
      <SiteFooter />
    </main>
  );
}

function SymmetryPatternGame() {
  const sectionRef = useRef(null);

  const gridSize = 6;
  const BLANK_CELL_COLOR = "#f5deb3";

  const colors = ["#e74c3c", "#f1c40f", "#2ecc71", "#3498db", "#9b59b6", "#ff8c00"];

  const [isSymmetric, setIsSymmetric] = useState(false);
  const [draggedColor, setDraggedColor] = useState<string | null>(null);
  const [activeCell, setActiveCell] = useState<{ row: number; col: number } | null>(null);
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

  const isBlankCell = (row: number, col: number) => grid[row][col] === BLANK_CELL_COLOR;
  const isColorCell = (row: number, col: number) => !isBlankCell(row, col);

  const checkSolution = (currentGrid: string[][]) => {
    for (let i = 0; i < gridSize; i++)
      for (let j = 0; j < gridSize; j++) if (currentGrid[i][j] !== solutionGrid[i][j]) return false;
    return true;
  };

  const handleDragStart = (row: number, col: number, e: React.DragEvent) => {
    if (!isColorCell(row, col)) return;
    e.dataTransfer.setData("text/plain", JSON.stringify({ row, col, color: grid[row][col] }));
    e.dataTransfer.effectAllowed = "copy";
    setDraggedColor(grid[row][col]);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "copy";
  };

  const handleDrop = (row: number, col: number, e: React.DragEvent) => {
    e.preventDefault();
    if (!isBlankCell(row, col)) return;
    try {
      const data = JSON.parse(e.dataTransfer.getData("text/plain"));
      const newGrid = grid.map((r) => [...r]);
      newGrid[row][col] = data.color;
      setGrid(newGrid);
      setIsSymmetric(checkSolution(newGrid));
    } catch (error) {
      console.error("Drop error:", error);
    }
    setDraggedColor(null);
  };

  const handleCellClick = (row: number, col: number) => {
    if (!isBlankCell(row, col)) return;
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
  };

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

  return (
    <section ref={sectionRef} className="w-full overflow-hidden bg-brand-grayBg">
      <div className="mx-auto px-3 py-12 sm:px-5 sm:py-16 md:max-w-[75vw] md:py-20 lg:mx-auto lg:max-w-[75vw]">
        <div className="grid items-center gap-12 md:grid-cols-2">
          {/* ── LEFT: Text Content ── */}
          <div className="space-y-6 sm:px-4">
            <h3 className="headingstyle font-heading font-extrabold text-brand-teal">
              Complete the Symmetric Pattern
            </h3>

            <div>
              <p className="textstyles mt-4 font-sans text-brand-tealDark/80">
                Fill in the blank cells to complete the perfectly symmetric colour pattern. The
                rules you need to follow are:
              </p>
              <ol className="mt-3 list-decimal space-y-2 pl-6 text-brand-tealDark/90">
                <li>The pattern must be symmetric along the vertical axis (left ↔ right).</li>
                <li>The pattern must be symmetric along the horizontal axis (top ↔ bottom).</li>
                <li>
                  Drag a colour from any filled cell onto a blank cell — or click a blank cell to
                  pick a colour from the palette that pops up above it.
                </li>
              </ol>
            </div>

            <div className="space-y-4">
              <div className="flex gap-4">
                <button
                  onClick={handleReset}
                  className="group inline-flex max-w-[220px] items-center justify-center gap-2 rounded-full border-2 border-brand-teal bg-transparent px-6 py-3 text-[16px] font-semibold text-brand-teal transition-colors hover:bg-brand-teal hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-coral/40 active:scale-[.99]"
                >
                  Reset Pattern
                </button>
              </div>
            </div>

            <p className="text-sm text-brand-tealDark/80">
              Blank cells remaining:{" "}
              <span className="font-semibold text-brand-tealDark">
                {grid.flat().filter((c) => c === BLANK_CELL_COLOR).length}
              </span>
            </p>
          </div>

          {/* ── RIGHT: Game Grid ── */}
          <div className="rounded-[26px] bg-white p-3 transition-transform duration-500 hover:scale-[1.02]">
            <div className="relative overflow-visible rounded-[20px] bg-brand-grayBg p-4">
              <div className="w-full">
                <div className="grid w-full touch-manipulation select-none grid-cols-6 gap-0 overflow-visible rounded-lg">
                  {grid.map((row, i) =>
                    row.map((cell, j) => {
                      const isDraggable = isColorCell(i, j);
                      const isEditable = isBlankCell(i, j);
                      const isActive = activeCell?.row === i && activeCell?.col === j;

                      const getPopupAlignClass = () => {
                        if (j === 0) return "left-0";
                        if (j === gridSize - 1) return "right-0";
                        return "left-1/2 -translate-x-1/2";
                      };

                      const getBorderClass = () => {
                        let classes: string[] = [];
                        if (i === 0) classes.push("border-t border-black/30");
                        if (i === gridSize - 1) classes.push("border-b border-black/30");
                        if (j === 0) classes.push("border-l border-black/30");
                        if (j === gridSize - 1) classes.push("border-r border-black/30");
                        if (i < gridSize - 1) classes.push("border-b border-black/30");
                        if (j < gridSize - 1) classes.push("border-r border-black/30");
                        if (i === 2) classes.push("border-b-2 border-black/40");
                        if (j === 2) classes.push("border-r-2 border-black/40");
                        return classes.join(" ");
                      };

                      return (
                        <div
                          key={`${i}-${j}`}
                          draggable={isDraggable}
                          onDragStart={(e) => handleDragStart(i, j, e)}
                          onDragOver={isEditable ? handleDragOver : undefined}
                          onDrop={isEditable ? (e) => handleDrop(i, j, e) : undefined}
                          onClick={() => handleCellClick(i, j)}
                          style={{ backgroundColor: cell }}
                          className={`relative flex aspect-square w-full items-center justify-center transition-all duration-300 ${getBorderClass()} ${
                            isEditable
                              ? "cursor-pointer hover:brightness-95"
                              : isDraggable
                                ? "cursor-grab hover:opacity-90 active:cursor-grabbing"
                                : "cursor-default"
                          }`}
                          role="button"
                          aria-label={
                            isEditable
                              ? `Row ${i + 1} col ${j + 1} - empty`
                              : `Row ${i + 1} col ${j + 1} - ${cell}`
                          }
                        >
                          {cell === BLANK_CELL_COLOR && (
                            <span className="text-[10px] text-gray-500 opacity-60">+</span>
                          )}

                          {isActive && (
                            <div
                              ref={popupRef}
                              onClick={(e) => e.stopPropagation()}
                              className={`absolute bottom-full z-50 mb-2 flex gap-1.5 rounded-full border border-black/10 bg-white p-2 shadow-lg ${getPopupAlignClass()}`}
                            >
                              {colors.map((color) => (
                                <button
                                  key={color}
                                  onClick={() => handleColorPick(i, j, color)}
                                  className="h-6 w-6 shrink-0 rounded-full ring-1 ring-black/10 transition-transform hover:scale-110"
                                  style={{ backgroundColor: color }}
                                  aria-label={`Fill with ${color}`}
                                />
                              ))}
                            </div>
                          )}
                        </div>
                      );
                    })
                  )}
                </div>
              </div>

              {isSymmetric && (
                <div className="mt-4 rounded-xl bg-[#4CAF50] px-4 py-3 text-center text-sm font-semibold text-white">
                  🎉 Perfect symmetry! Well done!
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

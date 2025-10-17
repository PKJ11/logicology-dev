"use client";

import NavBar from "@/components/NavBar";
import { useEffect, useRef, useState, useMemo } from "react";
import CommunitySignupModal from "@/components/CommunitySignupModal";
import SiteFooter from "@/components/Footer";
import CTAButton from "@/components/CTAButton";
import Community from "@/components/Community";
import BuySection from "@/components/BuySection";

/* ============================================================
   MAIN PAGE COMPONENT
============================================================ */
export default function Logicoland1Page() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('hero');

  useEffect(() => {
    const sections = ['hero', 'buy', 'puzzles', 'printables', 'community'];
    
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        });
      },
      { 
        threshold: 0.3,
        rootMargin: '-10% 0px -10% 0px'
      }
    );

    sections.forEach(section => {
      const element = document.getElementById(section);
      if (element) observer.observe(element);
    });

    return () => observer.disconnect();
  }, []);

  return (
    <>
      <NavBar  />

      <main className="bg-brand-grayBg text-brand-tealDark">
        {/* ================= HERO ================= */}
        <section id="hero">
          <HeroVideo isActive={activeSection === 'hero'} />
        </section>

        {/* ================= LOGICOLAND V1 ================= */}
        <section id="buy">
          <BuySection />
        </section>

        {/* ================= INTERACTIVE PUZZLES ================= */}
        <section id="puzzles">
          <InteractivePuzzlesSection isActive={activeSection === 'puzzles'} />
        </section>

        {/* ================= PRINTABLES ================= */}
        <section id="printables">
          <PrintablesSection isActive={activeSection === 'printables'} />
        </section>

        {/* ================= COMMUNITY ================= */}
        <section id="community">
          <Community  />
        </section>

        <SiteFooter />
      </main>

      <CommunitySignupModal open={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </>
  );
}

/* ============================================================
   HERO VIDEO SECTION
============================================================ */
function HeroVideo({ isActive }: { isActive: boolean }) {
  // iOS fullscreen support
  interface ExtendedHTMLVideoElement extends HTMLVideoElement {
    webkitEnterFullscreen?: () => void;
    webkitRequestFullscreen?: () => Promise<void>;
  }
  const videoRef = useRef<ExtendedHTMLVideoElement | null>(null);
  const [isMuted, setIsMuted] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isIOS, setIsIOS] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const isIOSDevice = /iPad|iPhone|iPod/.test(navigator.userAgent);
    setIsIOS(isIOSDevice);
  }, []);

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  const toggleFullscreen = async () => {
    if (!videoRef.current) return;
    try {
      if (isIOS) {
        videoRef.current.removeAttribute('playsInline');
        videoRef.current.setAttribute('controls', 'true');
        if (videoRef.current.webkitEnterFullscreen) {
          videoRef.current.webkitEnterFullscreen();
          setIsFullscreen(true);
        }
      } else {
        if (!document.fullscreenElement) {
          await videoRef.current.requestFullscreen?.();
          setIsFullscreen(true);
        } else {
          await document.exitFullscreen?.();
          setIsFullscreen(false);
        }
      }
    } catch (error) {
      console.error('Fullscreen error:', error);
    }
  };

  return (
    <section className="w-full bg-white overflow-hidden" ref={sectionRef}>
      <div className="px-3 py-10 sm:px-5">
        <div className={`relative rounded-[28px] bg-white px-2 transition-all duration-1000 ${
          isActive ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
        }`}>
          <div className="relative overflow-hidden rounded-[22px]">
            <video
              ref={videoRef}
              autoPlay
              loop
              muted={isMuted}
              playsInline={!isIOS || !isFullscreen}
              controls={isIOS && isFullscreen}
              className="h-[90vh] w-full object-cover sm:h-[62vh] sm:max-h-[780px] sm:min-h-[420px] md:h-[75vh] lg:h-[85vh]"
            >
              <source
                src="https://ik.imagekit.io/pratik2002/Logicoland%201_3.mp4?updatedAt=1755475486495"
                type="video/mp4"
              />
            </video>

            {/* gradient under text */}
            <div className="absolute inset-0 z-10 bg-gradient-to-r from-black/55 via-black/35 to-transparent" />

            {/* centered overlay content */}
            <div className="absolute inset-0 z-20 flex items-start sm:items-center">
              <div className={`mx-auto w-[75vw] max-w-[75vw] px-6 py-8 text-white sm:px-10 sm:py-14 transition-all duration-1000 ${
                isActive ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
              }`}>
                <p className="textstyles mb-3 transition-all duration-500 delay-200" style={{
                  transform: isActive ? 'translateY(0)' : 'translateY(20px)',
                  opacity: isActive ? 1 : 0
                }}>Empowering Minds</p>
                <h1 className="headingstyle font-extrabold leading-tight transition-all duration-500 delay-400" style={{
                  transform: isActive ? 'translateY(0)' : 'translateY(20px)',
                  opacity: isActive ? 1 : 0
                }}>
                  Through STEM Play
                  <br /> and Logic-Based Learning
                </h1>
                <p className="textstyles mt-4 max-w-md text-white/90 transition-all duration-500 delay-600" style={{
                  transform: isActive ? 'translateY(0)' : 'translateY(20px)',
                  opacity: isActive ? 1 : 0
                }}>
                  At Logicology we endeavour to make learning fun so that children learn while they
                  play.
                </p>
                <div className="mt-6 transition-all duration-500 delay-800" style={{
                  transform: isActive ? 'translateY(0)' : 'translateY(20px)',
                  opacity: isActive ? 1 : 0
                }}>
                  <CTAButton
                    text="Learn More"
                    href="#buy"
                    bg="#FFFFFF"
                    color="#0A8A80"
                    hoverBg="#0A8A80"
                    hoverColor="#FFFFFF"
                    size="md"
                    rightIcon={
                      <svg
                        className="h-4 w-4 transition-transform group-hover:translate-x-1"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 5l7 7-7 7"
                        />
                      </svg>
                    }
                  />
                </div>
              </div>
            </div>

            {/* Controls group (bottom-right) */}
            <div className={`absolute bottom-4 right-4 z-30 flex items-center gap-2 transition-all duration-500 delay-1000 ${
              isActive ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
            }`}>
              {/* Mute/Unmute */}
              <button
                onClick={toggleMute}
                className="rounded-full bg-black/50 p-2 text-white hover:bg-black/70 transition-all duration-300 hover:scale-110"
                aria-label={isMuted ? "Unmute video" : "Mute video"}
              >
                {isMuted ? (
                  // Muted icon
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
                      d="M9 9l6 6M15 9l-6 6M5 9v6h4l5 5V4l-5 5H5z"
                    />
                  </svg>
                ) : (
                  // Unmuted icon
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
                      d="M11 5L6 9H3v6h3l5 4V5z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M15.54 8.46a5 5 0 010 7.07m2.83-9.9a9 9 0 010 12.73"
                    />
                  </svg>
                )}
              </button>

              {/* Fullscreen */}
              <button
                onClick={toggleFullscreen}
                className="rounded-full bg-black/50 p-2 text-white hover:bg-black/70 transition-all duration-300 hover:scale-110"
                aria-label={isFullscreen ? "Exit fullscreen" : "Enter fullscreen"}
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
        </div>
      </div>
    </section>
  );
}

/* ============================================================
   INTERACTIVE PUZZLES SECTION
============================================================ */
function InteractivePuzzlesSection({ isActive }: { isActive: boolean }) {
  const [isOpen, setIsOpen] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);

  return (
    <section ref={sectionRef} className="w-full bg-brand-coral text-white overflow-hidden">
      <div className="mx-auto px-3 py-12 sm:px-5 sm:py-16 md:py-20 lg:max-w-[80vw]">
        <div className={`grid items-center gap-12 md:grid-cols-2 transition-all duration-1000 ${
          isActive ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
        }`}>
          {/* Text Content */}
          <div className="sm:px-4 space-y-6">
            <div className="transition-all duration-500 delay-200" style={{
              transform: isActive ? 'translateX(0)' : 'translateX(-50px)',
              opacity: isActive ? 1 : 0
            }}>
              <h3 className="headingstyle font-heading font-extrabold">Interactive Puzzles</h3>
            </div>

            <div className="transition-all duration-500 delay-400" style={{
              transform: isActive ? 'translateX(0)' : 'translateX(-50px)',
              opacity: isActive ? 1 : 0
            }}>
              <p className="textstyles mt-4 font-sans text-white/90">
                Solve the 4×4 Sudoku puzzles given here. The rules that you need to follow are:
              </p>
              <ol className="mt-3 list-decimal space-y-2 pl-6 text-white/90">
                <li>Each standing line should have all 4 colours appearing exactly once.</li>
                <li>Each sleeping line should have all 4 colours appearing exactly once.</li>
                <li>Each 2×2 grid should have all 4 colours appearing exactly once.</li>
              </ol>
            </div>

            <div className="transition-all duration-500 delay-600" style={{
              transform: isActive ? 'translateX(0)' : 'translateX(-50px)',
              opacity: isActive ? 1 : 0
            }}>
              <div className="mt-6 flex gap-4">
                <CTAButton
                  text="Watch Demo"
                  onClick={() => setIsOpen(true)}
                  bg="#FFFFFF"
                  color="#AB4637"
                  hoverBg="#AB4637"
                  hoverColor="#FFFFFF"
                  size="md"
                />
              </div>
            </div>
          </div>

          {/* Puzzle Content */}
          <div className={`transition-all duration-1000 delay-500 ${
            isActive ? 'opacity-100 scale-100 rotate-0' : 'opacity-0 scale-75 rotate-3'
          }`}>
            <div className="rounded-[26px] bg-white p-3 hover:scale-[1.02] transition-transform duration-500">
              <div className="relative overflow-hidden rounded-[20px] bg-brand-grayBg p-4">
                <SudokuSlider isActive={isActive} />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ---- Modal ---- */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 animate-fade-in">
          <div className="relative w-full max-w-lg rounded-lg bg-white p-4 animate-scale-in">
            <button
              className="absolute right-3 top-3 text-gray-600 hover:text-black transition-colors duration-200 hover:scale-110"
              onClick={() => setIsOpen(false)}
            >
              ✕
            </button>
            <img
              src="https://res.cloudinary.com/deunonql5/image/upload/v1758625737/Untitled_design_2_hldysm.gif"
              alt="Puzzle Demo"
              className="w-full rounded-lg"
            />
          </div>
        </div>
      )}
    </section>
  );
}

/* ============================================================
   PRINTABLES SECTION
============================================================ */
function PrintablesSection({ isActive }: { isActive: boolean }) {
  return (
    <section className="w-full bg-brand-grayBg overflow-hidden">
      <div className="mx-auto px-3 py-12 sm:px-5 sm:py-16 md:py-20 lg:max-w-[80vw]">
        <div className={`rounded-[22px] bg-white p-6 shadow-soft sm:p-10 transition-all duration-1000 ${
          isActive ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
        }`}>
          {/* Header */}
          <div className="transition-all duration-500 delay-200" style={{
            transform: isActive ? 'translateY(0)' : 'translateY(-30px)',
            opacity: isActive ? 1 : 0
          }}>
            <h3 className="headingstyle text-center font-extrabold text-brand-teal">Printables</h3>
            <p className="textstyles mt-2 text-center text-brand-teal">
              Done with Logicoland 1 already? Here are a few more worksheets for your practice.
            </p>
          </div>

          {/* Cards Grid */}
          <div className="mt-10 grid gap-8 md:grid-cols-2">
            <div className="transition-all duration-500 delay-400" style={{
              transform: isActive ? 'translateX(0)' : 'translateX(-50px)',
              opacity: isActive ? 1 : 0
            }}>
              <PrintableCard
                bgImage="https://ik.imagekit.io/pratik11/logicaoldandpdf1.JPG?updatedAt=1758342080344"
                buttonColor="#7E5C2E"
                filePath="/pdfs/downloadable/LogicolandVolume1Worksheet1.pdf"
                downloadName="Logicoland-Volume1-Worksheet1.pdf"
                overlayClass="bg-black/15"
                isActive={isActive}
              />
            </div>

            <div className="transition-all duration-500 delay-600" style={{
              transform: isActive ? 'translateX(0)' : 'translateX(50px)',
              opacity: isActive ? 1 : 0
            }}>
              <PrintableCard
                bgImage="https://ik.imagekit.io/pratik11/logicolandpdf2.JPG?updatedAt=1758342079963"
                buttonColor="#AB4637"
                filePath="/pdfs/downloadable/LogicolandVolume1Worksheet2.pdf"
                downloadName="Logicoland-Volume1-Worksheet2.pdf"
                overlayClass="bg-black/15"
                isActive={isActive}
              />
            </div>
          </div>

          {/* Footer Text */}
          <div className="transition-all duration-500 delay-800" style={{
            transform: isActive ? 'translateY(0)' : 'translateY(30px)',
            opacity: isActive ? 1 : 0
          }}>
            <p className="mt-8 text-center text-brand-tealDark/70">
              For more such printables, join our community.
            </p>
          </div>
        </div>
      </div>
    </section>
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
  const [direction, setDirection] = useState<'left' | 'right'>('right');
  const total = PUZZLES.length;

  const next = () => {
    setDirection('right');
    setIdx((i) => (i + 1) % total);
  };
  
  const prev = () => {
    setDirection('left');
    setIdx((i) => (i - 1 + total) % total);
  };

  return (
    <div className={`w-full transition-all duration-500 ${isActive ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}`}>
      <div className="mb-3 flex items-center justify-between">
        <div className="font-semibold text-brand-tealDark transition-all duration-300 delay-200" style={{
          transform: isActive ? 'translateX(0)' : 'translateX(-20px)',
          opacity: isActive ? 1 : 0
        }}>
          {PUZZLES[idx].name}
        </div>
        <div className="flex items-center gap-2 transition-all duration-300 delay-400" style={{
          transform: isActive ? 'translateX(0)' : 'translateX(20px)',
          opacity: isActive ? 1 : 0
        }}>
          <button
            onClick={prev}
            className="rounded-full bg-white px-3 py-1.5 text-brand-tealDark ring-1 ring-black/10 hover:bg-white/90 transition-all duration-300 hover:scale-110 active:scale-95"
          >
            ◀
          </button>
          <button
            onClick={next}
            className="rounded-full bg-white px-3 py-1.5 text-brand-tealDark ring-1 ring-black/10 hover:bg-white/90 transition-all duration-300 hover:scale-110 active:scale-95"
          >
            ▶
          </button>
        </div>
      </div>

      <div className={`transition-all duration-500 ${
        direction === 'right' ? 'animate-slide-in-right' : 'animate-slide-in-left'
      }`}>
        <ColorSudoku key={idx} start={PUZZLES[idx].start} solution={PUZZLES[idx].solution} isActive={isActive} />
      </div>

      <div className="mt-3 flex justify-center gap-2 transition-all duration-300 delay-600" style={{
        transform: isActive ? 'translateY(0)' : 'translateY(20px)',
        opacity: isActive ? 1 : 0
      }}>
        {PUZZLES.map((_, i) => (
          <button
            key={i}
            aria-label={`Go to puzzle ${i + 1}`}
            onClick={() => setIdx(i)}
            className={`h-2.5 w-2.5 rounded-full transition-all duration-300 ${
              i === idx ? "bg-brand-tealDark scale-125" : "bg-black/20 hover:bg-black/40"
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
  isActive
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
              } cursor-grab outline-offset-2 active:cursor-grabbing transition-all duration-300 hover:scale-110 ${
                active ? "outline outline-2 outline-black/70 scale-110" : ""
              }`}
              style={{
                transitionDelay: isActive ? `${index * 100}ms` : '0ms',
                transform: isActive ? 'scale(1)' : 'scale(0)',
                opacity: isActive ? 1 : 0
              }}
              title={`Drag or tap ${COLOR_META[k].label}`}
              aria-pressed={active}
              aria-label={`Select ${COLOR_META[k].label}`}
            />
          );
        })}

        <div className="ml-auto flex gap-2 transition-all duration-500 delay-700" style={{
          transform: isActive ? 'translateX(0)' : 'translateX(50px)',
          opacity: isActive ? 1 : 0
        }}>
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
      <div className="grid w-full touch-manipulation select-none grid-cols-4 gap-0 overflow-hidden rounded-[20px] bg-white ring-1 ring-black/10 transition-all duration-500 delay-300" style={{
        transform: isActive ? 'scale(1)' : 'scale(0.9)',
        opacity: isActive ? 1 : 0
      }}>
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
                  cell.locked ? 'cursor-not-allowed' : 'cursor-pointer hover:brightness-95'
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
                  <span className="text-[10px] text-black/40 sm:text-xs transition-all duration-300">
                    Drop / Tap
                  </span>
                )}

                {cell.locked && (
                  <span className="absolute right-1 top-1 rounded bg-black/10 px-1.5 py-0.5 text-[10px] text-black/60">
                    •
                  </span>
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
        <div className="mt-4 rounded-xl bg-[#DDB24D] px-4 py-3 text-center font-semibold text-white transition-all duration-500 delay-500" style={{
          transform: isActive ? 'scale(1)' : 'scale(0)',
          opacity: isActive ? 1 : 0
        }}>
          🎉 Great job! You solved it.
        </div>
      )}

      <p className="mt-3 text-xs text-black/50 transition-all duration-500 delay-700" style={{
        transform: isActive ? 'translateY(0)' : 'translateY(20px)',
        opacity: isActive ? 1 : 0
      }}>
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

/* ============================================================
   PRINTABLE CARD COMPONENT
============================================================ */
type PrintableCardProps = {
  colorClass?: string;
  buttonColor: string;
  filePath: string;
  downloadName?: string;
  bgImage?: string;
  overlayClass?: string;
  isActive?: boolean;
};

function PrintableCard({
  colorClass,
  buttonColor,
  filePath,
  downloadName,
  bgImage,
  overlayClass = "bg-black/10",
  isActive = false
}: PrintableCardProps) {
  const useImage = !!bgImage;

  return (
    <div className="rounded-[18px] bg-white p-3 shadow-soft h-full flex flex-col transition-all duration-500 hover:scale-[1.02]">
      <div
        className={[
          "relative h-64 overflow-hidden rounded-[14px] flex items-end justify-center transition-all duration-700",
          useImage ? "bg-cover bg-center" : (colorClass ?? ""),
        ].join(" ")}
        style={{ 
          backgroundImage: useImage ? `url(${bgImage})` : undefined,
          transform: isActive ? 'scale(1)' : 'scale(0.8)',
          opacity: isActive ? 1 : 0
        }}
      >
        {/* Optional contrast overlay for text/button legibility */}
        {useImage && <div className={`absolute inset-0 ${overlayClass} transition-all duration-500 hover:bg-black/5`} />}

        <div className="relative z-10 mb-4 transform transition-all duration-500 hover:scale-105" style={{
          transform: isActive ? 'translateY(0) scale(1)' : 'translateY(20px) scale(0.9)',
          opacity: isActive ? 1 : 0
        }}>
          {/* anchor to force download */}
          <a href={filePath} download={downloadName || ""} className="block">
            <CTAButton
              text="Download PDF"
              href={filePath}
              bg="#FFFFFF"
              color={buttonColor}
              hoverBg={buttonColor}
              hoverColor="#FFFFFF"
              size="md"
              rightIcon={
                <svg
                  className="h-4 w-4 transition-transform group-hover:translate-x-1"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              }
            />
          </a>
        </div>
      </div>
    </div>
  );
}

/* ============================================================
   GLOBAL STYLES FOR ANIMATIONS (Add to your global CSS)
============================================================ */
const globalStyles = `
@keyframes fade-in-up {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes fade-in {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

@keyframes scale-in {
  from {
    opacity: 0;
    transform: scale(0.9);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}

@keyframes bounce-in {
  0% {
    opacity: 0;
    transform: scale(0.3);
  }
  50% {
    opacity: 1;
    transform: scale(1.05);
  }
  70% {
    transform: scale(0.9);
  }
  100% {
    opacity: 1;
    transform: scale(1);
  }
}

@keyframes slide-in-right {
  from {
    opacity: 0;
    transform: translateX(30px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

@keyframes slide-in-left {
  from {
    opacity: 0;
    transform: translateX(-30px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

.animate-fade-in-up {
  animation: fade-in-up 0.6s ease-out forwards;
}

.animate-fade-in {
  animation: fade-in 0.6s ease-out forwards;
}

.animate-scale-in {
  animation: scale-in 0.4s ease-out forwards;
}

.animate-bounce-in {
  animation: bounce-in 0.6s ease-out forwards;
}

.animate-slide-in-right {
  animation: slide-in-right 0.5s ease-out forwards;
}

.animate-slide-in-left {
  animation: slide-in-left 0.5s ease-out forwards;
}

.animation-delay-200 {
  animation-delay: 200ms;
}

.animation-delay-400 {
  animation-delay: 400ms;
}

.animation-delay-600 {
  animation-delay: 600ms;
}

/* Smooth scrolling */
html {
  scroll-behavior: smooth;
}

/* Custom scrollbar */
::-webkit-scrollbar {
  width: 8px;
}

::-webkit-scrollbar-track {
  background: #f1f1f1;
}

::-webkit-scrollbar-thumb {
  background: #0A8A80;
  border-radius: 4px;
}

::-webkit-scrollbar-thumb:hover {
  background: #066a63;
}
`;

// Add global styles to document
if (typeof document !== 'undefined') {
  const styleSheet = document.createElement("style");
  styleSheet.innerText = globalStyles;
  document.head.appendChild(styleSheet);
}
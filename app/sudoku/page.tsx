import type { Metadata } from "next";
import Link from "next/link";
import JsonLd from "@/components/JsonLd";
import { SITE_URL, breadcrumbSchema, pageMetadata } from "@/lib/seo";
import SudokuClient from "./SudokuClient";

export const metadata: Metadata = pageMetadata({
  title: "Colour Sudoku for Kids – Free 4×4 Logic Puzzle | Logicology",
  description:
    "Play free colour sudoku online: fill a 4×4 grid so every row, column and box has all four colours. A gentle first logic puzzle for kids, with no numbers needed.",
  path: "/sudoku",
  ogTitle: "Colour Sudoku for Kids – Free 4×4 Logic Puzzle",
});

// Update isAccessibleForFree and offers if the puzzle stops being free.
const appSchema = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "Colour Sudoku",
  url: `${SITE_URL}/sudoku`,
  applicationCategory: "EducationalApplication",
  operatingSystem: "Any",
  isAccessibleForFree: true,
  offers: { "@type": "Offer", price: "0", priceCurrency: "INR" },
  teaches: "Logical reasoning through a 4×4 colour sudoku",
  publisher: { "@id": `${SITE_URL}/#organization` },
};

// Server-rendered description for crawlers and screen readers; visually hidden so the
// game screen looks exactly as before.
function SudokuIntro() {
  return (
    <section className="sr-only" aria-labelledby="sudoku-intro">
      <h1 id="sudoku-intro">Colour Sudoku: a free 4×4 logic puzzle for kids</h1>
      <p>
        Colour Sudoku is a free online logic puzzle from Logicology. Fill the 4×4 grid so that
        every row, every column and every 2×2 box has all four colours, red, green, blue and
        yellow, exactly once. Because it uses colours instead of numbers, children can start
        before they are confident with digits, and it builds the same reasoning as a full number
        sudoku.
      </p>
      <h2>How to play</h2>
      <p>
        Tap a colour in the tray, then tap a square to fill it. Use the eraser to clear a square,
        Hint to fill one square for you and Reset to start again. There are three puzzles to
        solve.
      </p>
      <p>
        For more puzzles like this, see the <Link href="/books">Logicoland puzzle books</Link>,
        or build calculation speed with the free <Link href="/speed-maths">Speed Maths games</Link>
        .
      </p>
    </section>
  );
}

export default function SudokuPage() {
  return (
    <>
      <JsonLd data={[appSchema, breadcrumbSchema([["Colour Sudoku", "/sudoku"]])]} />
      <SudokuIntro />
      <SudokuClient />
    </>
  );
}

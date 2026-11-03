import type { Metadata } from "next";
import Link from "next/link";
import JsonLd from "@/components/JsonLd";
import { SITE_URL, breadcrumbSchema, pageMetadata } from "@/lib/seo";
import SpeedMathsClient from "./SpeedMathsClient";

export const metadata: Metadata = pageMetadata({
  title: "Free Speed Maths Games for Competitive Exams | Logicology",
  description:
    "Build calculation speed and accuracy with free maths games for students preparing for competitive exams. Practise addition, subtraction, multiplication, squares, halves and number pairs.",
  path: "/speed-maths",
  ogTitle: "Free Speed Maths Games for Competitive Exams",
});

// Update isAccessibleForFree and offers if the games stop being free.
const appSchema = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "Speed Maths",
  url: `${SITE_URL}/speed-maths`,
  applicationCategory: "EducationalApplication",
  operatingSystem: "Any",
  isAccessibleForFree: true,
  offers: { "@type": "Offer", price: "0", priceCurrency: "INR" },
  teaches: "Mental calculation speed and accuracy for competitive exams",
  publisher: { "@id": `${SITE_URL}/#organization` },
};

const GAMES: [name: string, what: string][] = [
  ["Addition", "add two numbers against the clock."],
  ["Subtraction", "subtract quickly and accurately, including borrowing."],
  [
    "Multiplication",
    "Quick Mix covers the 2 to 12 times tables, and Table Challenge drills any range up to 29.",
  ],
  [
    "Half",
    "halve numbers up to 999 by halving each digit, with a step-by-step practice mode.",
  ],
  ["Squares", "square numbers near 50 and 100 with a short method instead of long multiplication."],
  ["Friends", "find number pairs that add up to 9, 10 or 100."],
];

// Server-rendered description of the page so crawlers and screen readers get real
// content instead of the game's loading screen. Visually hidden: the page looks
// exactly as before (site rule: SEO changes must not alter the design).
function SpeedMathsIntro() {
  return (
    <section className="sr-only" aria-labelledby="speed-maths-intro">
      <h1 id="speed-maths-intro">Free Speed Maths Games for Competitive Exams</h1>
      <p>
        Speed Maths is a free online training tool from Logicology that builds calculation speed
        and accuracy for students preparing for competitive exams, where every second saved on
        arithmetic goes back to reasoning. It runs in the browser on phones, tablets and
        computers, with no sign-up.
      </p>
      <h2>The six games</h2>
      <ul>
        {GAMES.map(([name, what]) => (
          <li key={name}>
            {name}: {what}
          </li>
        ))}
      </ul>
      <h2>How a round works</h2>
      <p>
        Pick a game, choose whether to tap the answer or type it, then race through 10 questions
        or 20 timed questions. The results show how many you got right, your accuracy, your time
        and your seconds per correct answer, so you can see yourself getting faster.
      </p>
      <p>
        Also try <Link href="/sudoku">Colour Sudoku</Link>, a free 4×4 logic puzzle, and
        Logicology&apos;s <Link href="/games">screen-free maths board games</Link>.
      </p>
    </section>
  );
}

export default function SpeedMathsPage() {
  return (
    <>
      <JsonLd data={[appSchema, breadcrumbSchema([["Speed Maths", "/speed-maths"]])]} />
      <SpeedMathsIntro />
      <SpeedMathsClient />
    </>
  );
}

import type { Metadata } from "next";
import PrimeTimeClient from "../games/prime-time/PrimeTimeClient";
import { pageMetadata } from "@/lib/seo";

// Duplicate of /games/prime-time (kept working for printed links); canonical points there.
export const metadata: Metadata = pageMetadata({
  title: "Prime Time – Math Board Game for Kids 8+ | Logicology",
  description:
    "Prime Time is a patent-pending math board game for 2–6 players, ages 8+. Kids master primes, factors and strategy without it feeling like a lesson.",
  path: "/games/prime-time",
});

const page = () => {
  return (
    <div>
      <PrimeTimeClient />
    </div>
  );
};

export default page;

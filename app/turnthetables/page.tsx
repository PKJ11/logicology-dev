import type { Metadata } from "next";
import TurnTheTablesClient from "../games/turn-the-tables/TurnTheTablesClient";
import { pageMetadata } from "@/lib/seo";

// Duplicate of /games/turn-the-tables (kept working for printed/shared links); canonical points there.
export const metadata: Metadata = pageMetadata({
  title: "Turn the Tables – Multiplication Card Game for Kids | Logicology",
  description:
    "A fast-paced multiplication card game with strategy twists. Turn the Tables builds times-table fluency through play, not drills.",
  path: "/games/turn-the-tables",
  ogTitle: "Turn the Tables – Multiplication Card Game for Kids",
  image:
    "https://ik.imagekit.io/pratik11/TURN%20THE%20TABLE%20%20BOX%20MOCKUP.png?tr=w-1200,h-630,c-at_max",
  imageAlt: "Turn the Tables multiplication card game box",
});

const page = () => {
  return <TurnTheTablesClient />;
};

export default page;

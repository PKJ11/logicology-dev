/**
 * Hidato Game Page
 * Main page for the Hidato puzzle game
 */

import React from "react";
import { HidatoGame } from "@/components/hidato/HidatoGame";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Hidato Puzzle Game | Logicology",
  description:
    "Play Hidato puzzles online. Fill consecutive numbers horizontally, vertically, or diagonally. Challenge yourself with easy, medium, and hard puzzles.",
  keywords: ["puzzle", "hidato", "number", "game", "brain teaser"],
  openGraph: {
    title: "Hidato Puzzle Game",
    description:
      "Play Hidato puzzles online with multiple difficulty levels.",
    type: "website",
  },
};

export default function HidatoPage() {
  return (
    <main>
      <HidatoGame />
    </main>
  );
}

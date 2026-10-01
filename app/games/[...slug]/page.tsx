import { notFound } from "next/navigation";

// Unknown game URLs return a real 404 (not a 200 "under construction" soft-404).
export default function GamesCatchAll() {
  notFound();
}

import type { Metadata } from "next";
import TurnTheTablesClient from "./TurnTheTablesClient";

export const metadata: Metadata = {
  title: "Turn The Tables – Multiplication Card Game | Logicology",
  description:
    "Turn The Tables makes times tables fun — a fast, screen-free card game that builds multiplication fluency and quick thinking in kids. Shop at Logicology.",
};

export default function TurnTheTablesPage() {
  return <TurnTheTablesClient />;
}

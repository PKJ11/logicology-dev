import type { Metadata } from "next";
import LogicolandSeriesClient from "../books/logicoland-series/LogicolandSeriesClient";
import { pageMetadata } from "@/lib/seo";

// Same content as /books/logicoland-series, so it points its canonical there.
// TODO (audit §5.3): turn /logicoland into the index of free online puzzles.
export const metadata: Metadata = pageMetadata({
  title: "Logicoland – Logic Puzzle Books for Kids 6–16 | Logicology",
  description:
    "Five volumes of logic puzzles and brain challenges for ages 6–16. Buy single volumes or the complete Logicoland set.",
  path: "/books/logicoland-series",
});

export default function Logicoland() {
  return <LogicolandSeriesClient />;
}

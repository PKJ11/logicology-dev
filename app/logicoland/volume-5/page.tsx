import type { Metadata } from "next";
import JsonLd from "@/components/JsonLd";
import { breadcrumbSchema, pageMetadata } from "@/lib/seo";
import Volume5Client from "./Volume5Client";

export const metadata: Metadata = pageMetadata({
  title: "Free Logic Puzzles for Kids – Play Online | Logicoland Vol 5",
  description:
    "Play free logic puzzles for kids online: Colour Crawl, Arrows Address, Right Route and Knowing Knight from Logicoland Volume 5.",
  path: "/logicoland/volume-5",
  ogTitle: "Free Logic Puzzles for Kids – Play Online | Logicoland Vol 5",
});

export default function Page() {
  return (
    <>
      <JsonLd data={breadcrumbSchema([["Logicoland", "/books/logicoland-series"], ["Volume 5 Puzzles", "/logicoland/volume-5"]])} />
      <Volume5Client />
    </>
  );
}

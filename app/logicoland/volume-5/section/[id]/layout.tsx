import type { Metadata } from "next";
import { notFound } from "next/navigation";
import JsonLd from "@/components/JsonLd";
import { breadcrumbSchema, pageMetadata } from "@/lib/seo";

// page.tsx is a client component, so each section's title, description and canonical live here.
// Names and blurbs match components/games/logicoland5/SectionTabs.tsx.
const SECTIONS: Record<string, { name: string; description: string }> = {
  "1": {
    name: "Colour Crawl",
    description:
      "Play Colour Crawl free online: follow the colour codes to find your way through the grid. A logic puzzle for kids from Logicoland Volume 5.",
  },
  "2": {
    name: "Arrows Address",
    description:
      "Play Arrows Address free online: navigate numbered grids by following the arrows. A logic puzzle for kids from Logicoland Volume 5.",
  },
  "3": {
    name: "Right Route",
    description:
      "Play Right Route free online: choose the correct path through each grid. A logic puzzle for kids from Logicoland Volume 5.",
  },
  "4": {
    name: "Knowing Knight",
    description:
      "Play Knowing Knight free online: master the chess knight's moves to solve each grid. A logic puzzle for kids from Logicoland Volume 5.",
  },
};

export function generateStaticParams() {
  return Object.keys(SECTIONS).map((id) => ({ id }));
}

export function generateMetadata({ params }: { params: { id: string } }): Metadata {
  const section = SECTIONS[params.id];
  if (!section) return {};
  return pageMetadata({
    title: `${section.name} – Free Logic Puzzle for Kids | Logicoland Vol 5`,
    description: section.description,
    path: `/logicoland/volume-5/section/${params.id}`,
    ogTitle: `${section.name} – Free Logic Puzzle for Kids`,
  });
}

export default function SectionLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { id: string };
}) {
  const section = SECTIONS[params.id];
  if (!section) notFound();
  return (
    <>
      <JsonLd
        data={breadcrumbSchema([
          ["Logicoland", "/books/logicoland-series"],
          ["Volume 5 Puzzles", "/logicoland/volume-5"],
          [section.name, `/logicoland/volume-5/section/${params.id}`],
        ])}
      />
      {children}
    </>
  );
}

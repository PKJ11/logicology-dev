import type { Metadata } from "next";
import JsonLd from "@/components/JsonLd";
import { SITE_URL, breadcrumbSchema, pageMetadata } from "@/lib/seo";
import LogicolandSeriesClient from "./LogicolandSeriesClient";

export const metadata: Metadata = pageMetadata({
  title: "Logicoland – Logic Puzzle Books for Kids 6–16 | Logicology",
  description:
    "Five volumes of logic puzzles and brain challenges for ages 6–16. Buy single volumes or the complete Logicoland set.",
  path: "/books/logicoland-series",
  ogTitle: "Logicoland – Logic Puzzle Books for Kids 6–16",
  image: "https://ik.imagekit.io/pratik11/LOGICOLAND-ALL-5-BOOK-COVERS.png?tr=w-1200,h-630,c-at_max",
});

// Series sold as single volumes (₹249) or the complete set (₹999). ISBN / page count can be
// added here once available. No aggregateRating until reviews are published on the page.
const productSchema = {
  "@context": "https://schema.org",
  "@type": "Product",
  name: "Logicoland – Logic Puzzle Book Series for Kids (Volumes 1–5)",
  image: ["https://ik.imagekit.io/pratik11/LOGICOLAND-ALL-5-BOOK-COVERS.png"],
  description:
    "Five volumes of logic puzzles and brain challenges for kids: colour Sudoku, patterns, symmetry, mazes and path puzzles that build reasoning and problem-solving skills.",
  brand: { "@type": "Brand", name: "Logicology" },
  category: "Books > Children's Activity Books",
  audience: { "@type": "PeopleAudience", suggestedMinAge: 6 },
  offers: {
    "@type": "AggregateOffer",
    url: `${SITE_URL}/books/logicoland-series`,
    priceCurrency: "INR",
    lowPrice: "249",
    highPrice: "999",
    offerCount: 6,
    availability: "https://schema.org/InStock",
  },
};

const bookSeriesSchema = {
  "@context": "https://schema.org",
  "@type": "BookSeries",
  name: "Logicoland",
  author: { "@type": "Organization", name: "Logicology" },
  publisher: { "@id": `${SITE_URL}/#organization` },
  hasPart: [1, 2, 3, 4, 5].map((n) => ({
    "@type": "Book",
    name: `Logicoland Volume ${n}`,
    bookFormat: "https://schema.org/Paperback",
    inLanguage: "en",
  })),
};

export default function Page() {
  return (
    <>
      <JsonLd
        data={[
          productSchema,
          bookSeriesSchema,
          breadcrumbSchema([
            ["Books", "/books"],
            ["Logicoland", "/books/logicoland-series"],
          ]),
        ]}
      />
      <LogicolandSeriesClient />
    </>
  );
}

import type { Metadata } from "next";
import JsonLd from "@/components/JsonLd";
import { SITE_URL, breadcrumbSchema, pageMetadata } from "@/lib/seo";
import TurnTheTablesClient from "./TurnTheTablesClient";

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

const productSchema = {
  "@context": "https://schema.org",
  "@type": "Product",
  name: "Turn the Tables – Multiplication Card Game for Kids",
  image: ["https://ik.imagekit.io/pratik11/TURN%20THE%20TABLE%20%20BOX%20MOCKUP.png"],
  description:
    "A fast-paced multiplication card game with strategy cards (Wild, Up, Down, Turn, Streak) that builds times-table fluency through play. 2–6 players, ages 6+.",
  brand: { "@type": "Brand", name: "Logicology" },
  sku: "TTT-001",
  audience: { "@type": "PeopleAudience", suggestedMinAge: 6 },
  offers: {
    "@type": "Offer",
    url: `${SITE_URL}/games/turn-the-tables`,
    priceCurrency: "INR",
    price: "299",
    availability: "https://schema.org/InStock",
    itemCondition: "https://schema.org/NewCondition",
    seller: { "@id": `${SITE_URL}/#organization` },
  },
};

export default function TurnTheTablesPage() {
  return (
    <>
      <JsonLd
        data={[
          productSchema,
          breadcrumbSchema([
            ["Games", "/games"],
            ["Turn the Tables", "/games/turn-the-tables"],
          ]),
        ]}
      />
      <TurnTheTablesClient />
    </>
  );
}

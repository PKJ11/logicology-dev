import type { Metadata } from "next";
import JsonLd from "@/components/JsonLd";
import { SITE_URL, breadcrumbSchema, pageMetadata } from "@/lib/seo";
import PrimeTimeClient from "./PrimeTimeClient";

const URL = `${SITE_URL}/games/prime-time`;

export const metadata: Metadata = pageMetadata({
  title: "Prime Time – Math Board Game for Kids 8+ | Logicology",
  description:
    "Prime Time is a patent-pending math board game for 2–6 players, ages 8+. Kids master primes, factors and strategy without it feeling like a lesson.",
  path: "/games/prime-time",
  ogTitle: "Prime Time – Math Board Game for Kids 8+",
  image:
    "https://ik.imagekit.io/pratik11/PRIME-TIME-SLIDER-1-NEW-DESKTOP-VIEW.png?tr=w-1200,h-630,c-at_max",
  imageAlt: "Prime Time math board game box and cards",
});

// No aggregateRating: individual reviews are not published on this page (audit §4.1).
const productSchema = {
  "@context": "https://schema.org",
  "@type": "Product",
  name: "Prime Time™ – Math Board Game for Kids",
  image: [
    "https://ik.imagekit.io/pratik11/PRIME-TIME-SLIDER-1-NEW-DESKTOP-VIEW.png",
    "https://ik.imagekit.io/pratik11/PRIME-TIME-SLIDER-2-DESKTOPVIEW-.png",
    "https://ik.imagekit.io/pratik11/PRIME-TIME-SLIDER-3-DESKTOPVIEW-.png",
  ],
  description:
    "Patent-pending math strategy board game for 2–6 players, ages 8+. Builds understanding of prime numbers, composite numbers and factors through play.",
  brand: { "@type": "Brand", name: "Logicology" },
  sku: "PT-001",
  audience: { "@type": "PeopleAudience", suggestedMinAge: 8 },
  offers: {
    "@type": "Offer",
    url: URL,
    priceCurrency: "INR",
    price: "1499",
    availability: "https://schema.org/InStock",
    itemCondition: "https://schema.org/NewCondition",
    seller: { "@id": `${SITE_URL}/#organization` },
  },
};

const videoSchema = {
  "@context": "https://schema.org",
  "@type": "VideoObject",
  name: "Prime Time Explainer | Understand the rules of the game",
  description:
    "How to play Prime Time, the math board game by Logicology: setup, turns and how prime and composite numbers win the game.",
  thumbnailUrl: "https://i.ytimg.com/vi/2qLAo-AydUc/hqdefault.jpg",
  uploadDate: "2025-10-12T11:19:06-07:00",
  duration: "PT6M30S",
  embedUrl: "https://www.youtube.com/embed/2qLAo-AydUc",
  contentUrl: "https://www.youtube.com/watch?v=2qLAo-AydUc",
};

export default function Page() {
  return (
    <>
      <JsonLd
        data={[
          productSchema,
          videoSchema,
          breadcrumbSchema([
            ["Games", "/games"],
            ["Prime Time", "/games/prime-time"],
          ]),
        ]}
      />
      <PrimeTimeClient />
    </>
  );
}

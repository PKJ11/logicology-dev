import type { Metadata } from "next";
import JsonLd from "@/components/JsonLd";
import CollectionGuide, { GuideLink, type Faq } from "@/components/seo/CollectionGuide";
import SpecTable from "@/components/seo/SpecTable";
import { SITE_URL, breadcrumbSchema, faqSchema, pageMetadata } from "@/lib/seo";
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
    price: "1799",
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


// Every fact here is taken from copy already on the Prime Time page (PrimeTimeClient.tsx).
// Keep them in sync if the game details change. Box contents are left out until confirmed.
const faqs: Faq[] = [
  {
    q: "Does my child need to know prime numbers before playing Prime Time?",
    a: "No. You don't need to teach prime numbers first. As children play, experiment and build strategies, factors, multiples, primes and composites start to make sense naturally.",
  },
  {
    q: "What age is Prime Time for?",
    a: "Prime Time is for ages 8 and up. It is designed to be fun for children and adults, so the whole family can play together.",
  },
  {
    q: "How many people can play, and how long does a game take?",
    a: "Prime Time is for 2 to 6 players, and a game takes about 15 to 30 minutes.",
  },
  {
    q: "Can Prime Time be used in a classroom?",
    a: "Yes. Teachers use Prime Time to bring mathematical ideas to life, and with 2 to 6 players per game a class can play in small groups. For school sets, see our bulk order page.",
  },
  {
    q: "Is Prime Time a game of luck or strategy?",
    a: "Both. A little luck keeps every round exciting, while strategy rewards thoughtful decisions, so no two games play out the same way.",
  },
  {
    q: "How is Prime Time different from other maths board games?",
    a: "Prime Time wasn't built around an existing game mechanic. It was created from scratch to make number sense enjoyable, and its gameplay system has patent-pending mechanics.",
  },
  {
    q: "Should I choose Prime Time or Turn the Tables?",
    a: "Choose Prime Time for ages 8+ if you want to build understanding of primes, factors and multiples through strategy. Choose Turn the Tables for ages 6+ if your child is working on multiplication and times tables.",
  },
  {
    q: "I have lost a Prime Time card. How can I check which one it is?",
    a: "Use the lost card helper on this page: enter the card number, from 1 to 60, to see exactly what that card looks like.",
  },
];

function PrimeTimeGuide() {
  return (
    <div className="px-4 pb-14 sm:px-6 sm:pb-16 lg:px-8">
      <CollectionGuide
        faqs={faqs}
        faqHeading="Prime Time: frequently asked questions"
        sections={[
          {
            heading: "Prime Time at a glance",
            body: (
              <SpecTable
                caption="Prime Time game specifications"
                specs={[
                  { label: "Age", value: "8+, fun for children and adults" },
                  { label: "Players", value: "2 to 6" },
                  { label: "Play time", value: "15 to 30 minutes" },
                  {
                    label: "Skills",
                    value: "Prime and composite numbers, factors, multiples, number patterns and strategy",
                  },
                  { label: "Type", value: "Screen-free maths board game with a patent-pending design" },
                  { label: "Maths needed", value: "None. Children learn the ideas by playing" },
                  { label: "Learn to play", value: "Watch the 6½-minute explainer video on this page" },
                  { label: "Price", value: "₹1,799 (MRP ₹1,999)" },
                ]}
              />
            ),
          },
          {
            heading: "What children learn from Prime Time",
            body: (
              <>
                <p>
                  Prime Time turns number theory into a game of choices. While players compete and
                  try to outsmart each other, factors, multiples, primes and composites start to
                  make sense naturally. What feels abstract on paper becomes meaningful through
                  play, challenge and friendly competition.
                </p>
                <p>
                  It works at home and at school. Families enjoy the challenge and conversation it
                  creates around the table, and teachers use it to bring mathematical ideas to life.
                  For younger children who are starting multiplication, try{" "}
                  <GuideLink href="/games/turn-the-tables">Turn the Tables</GuideLink>. For school
                  and party orders, visit our <GuideLink href="/bulk-order">bulk order page</GuideLink>.
                </p>
              </>
            ),
          },
        ]}
      />
    </div>
  );
}

export default function Page() {
  return (
    <>
      <JsonLd
        data={[
          productSchema,
          videoSchema,
          faqSchema(faqs),
          breadcrumbSchema([
            ["Games", "/games"],
            ["Prime Time", "/games/prime-time"],
          ]),
        ]}
      />
      <PrimeTimeClient>
        <PrimeTimeGuide />
      </PrimeTimeClient>
    </>
  );
}

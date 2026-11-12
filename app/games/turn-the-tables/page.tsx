import type { Metadata } from "next";
import JsonLd from "@/components/JsonLd";
import CollectionGuide, { GuideLink, type Faq } from "@/components/seo/CollectionGuide";
import SpecTable from "@/components/seo/SpecTable";
import { SITE_URL, breadcrumbSchema, faqSchema, pageMetadata } from "@/lib/seo";
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

const videoSchema = {
  "@context": "https://schema.org",
  "@type": "VideoObject",
  name: "How to Play Turn the Tables | Rules, Card Matches & Special Cards",
  description:
    "How to play Turn the Tables, the multiplication card game by Logicology: the rules, matching cards and how the special cards work.",
  thumbnailUrl: "https://i.ytimg.com/vi/dD9NqngVWHE/hqdefault.jpg",
  uploadDate: "2026-10-09T05:30:36-07:00",
  duration: "PT2M34S",
  embedUrl: "https://www.youtube.com/embed/dD9NqngVWHE",
  contentUrl: "https://www.youtube.com/watch?v=dD9NqngVWHE",
};


// Every fact here is taken from copy already on the Turn the Tables page (TurnTheTablesClient.tsx).
// Keep them in sync if the game details change.
const faqs: Faq[] = [
  {
    q: "What age is Turn the Tables for?",
    a: "Turn the Tables is for ages 6 and up.",
  },
  {
    q: "Does my child need to know their times tables first?",
    a: "No maths knowledge is needed. Children focus on the game, and confidence with times tables grows through play. The same multiplication facts come up again and again, so tables that once needed thinking start to feel automatic.",
  },
  {
    q: "How many people can play, and how long does a game take?",
    a: "Turn the Tables is for 2 to 6 players, and a game takes about 15 to 20 minutes.",
  },
  {
    q: "What's in the box?",
    a: "64 number cards and 26 special cards.",
  },
  {
    q: "How do you win Turn the Tables?",
    a: "Play a matching card on each turn and be the first to empty your hand. Special cards add twists and surprises, so every game feels a little different. The explainer video on this page shows the full rules.",
  },
  {
    q: "Is Turn the Tables a good return gift?",
    a: "Yes. The Return-Gift Bundle includes 20 copies of Turn the Tables for ₹4,000, and bulk pricing is available for larger orders.",
  },
  {
    q: "Should I choose Turn the Tables or Prime Time?",
    a: "Choose Turn the Tables for ages 6+ if your child is working on multiplication and times tables. Choose Prime Time for ages 8+ to build understanding of primes, factors and multiples through strategy.",
  },
];

function TurnTheTablesGuide() {
  return (
    <div className="px-4 pb-14 sm:px-6 sm:pb-16 lg:px-8">
      <CollectionGuide
        faqs={faqs}
        faqHeading="Turn the Tables: frequently asked questions"
        sections={[
          {
            heading: "Turn the Tables at a glance",
            body: (
              <SpecTable
                caption="Turn the Tables game specifications"
                specs={[
                  { label: "Age", value: "6+" },
                  { label: "Players", value: "2 to 6" },
                  { label: "Play time", value: "15 to 20 minutes" },
                  { label: "Skills", value: "Multiplication facts, times-table fluency and strategy" },
                  { label: "Contents", value: "64 number cards and 26 special cards" },
                  { label: "Type", value: "Screen-free multiplication card game" },
                  { label: "Maths needed", value: "None" },
                  { label: "Price", value: "₹299 (MRP ₹399)" },
                  { label: "Return gifts", value: "Return-Gift Bundle: 20 copies for ₹4,000" },
                ]}
              />
            ),
          },
          {
            heading: "How Turn the Tables works",
            body: (
              <>
                <p>
                  On each turn, play a matching card. The first player to empty their hand wins.
                  Every match reinforces a multiplication fact, and special cards create twists,
                  surprises and new opportunities, so no two games feel the same.
                </p>
                <p>
                  Because the same facts keep coming up during play, times tables that once needed
                  thinking start to feel automatic. For older children ready for strategy with
                  primes and factors, try <GuideLink href="/games/prime-time">Prime Time</GuideLink>.
                  For parties and schools, see our <GuideLink href="/bulk-order">bulk order page</GuideLink>.
                </p>
              </>
            ),
          },
        ]}
      />
    </div>
  );
}

export default function TurnTheTablesPage() {
  return (
    <>
      <JsonLd
        data={[
          productSchema,
          videoSchema,
          faqSchema(faqs),
          breadcrumbSchema([
            ["Games", "/games"],
            ["Turn the Tables", "/games/turn-the-tables"],
          ]),
        ]}
      />
      <TurnTheTablesClient>
        <TurnTheTablesGuide />
      </TurnTheTablesClient>
    </>
  );
}

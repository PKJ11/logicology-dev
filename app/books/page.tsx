import type { Metadata } from "next";
import JsonLd from "@/components/JsonLd";
import CollectionGuide, { GuideLink, type Faq } from "@/components/seo/CollectionGuide";
import { breadcrumbSchema, faqSchema, pageMetadata } from "@/lib/seo";
import BooksClient from "./BooksClient";

export const metadata: Metadata = pageMetadata({
  title: "Logic Puzzle Books for Kids | Logicoland Series | Logicology",
  description:
    "Logic puzzle and activity books for kids aged 6–16. The five-volume Logicoland series builds reasoning, pattern spotting and problem-solving skills.",
  path: "/books",
  ogTitle: "Logic Puzzle Books for Kids – Logicoland Series",
  image: "https://ik.imagekit.io/pratik11/LOGICOLAND-ALL-5-BOOK-COVERS.png?tr=w-1200,h-630,c-at_max",
});

const faqs: Faq[] = [
  {
    q: "What age are the Logicoland books for?",
    a: "Logicoland starts gently for children from about 6 years old and the later volumes stretch older children well into their teens. Each volume steps up in difficulty, so children can grow through the series.",
  },
  {
    q: "Do the volumes need to be done in order?",
    a: "We recommend starting with Volume 1 because it introduces the puzzle types step by step, but every volume can be enjoyed on its own.",
  },
  {
    q: "Can I buy a single volume or the full set?",
    a: "Both. Each volume is available on its own, and the complete Logicoland set gives you all five volumes at a lower price.",
  },
  {
    q: "Are there free Logicoland puzzles online?",
    a: "Yes. Puzzles from Logicoland Volume 5, including Colour Crawl, Arrows Address, Right Route and Knowing Knight, can be played free online.",
  },
];

function BooksGuide() {
  return (
    <CollectionGuide
      faqs={faqs}
      sections={[
        {
          heading: "What logic puzzles build in children",
          body: (
            <>
              <p>
                Logic puzzles ask children to use clues, rules and patterns to reach an answer that
                can be checked, not guessed. That simple loop of noticing, reasoning and testing is
                the foundation of problem-solving in maths, science and everyday life.
              </p>
              <p>
                Regular puzzle practice strengthens focus, working memory and patience, and teaches
                children that being stuck is part of thinking, not a sign of failure. Because every
                solved puzzle is a small win, confidence grows page by page.
              </p>
            </>
          ),
        },
        {
          heading: "Inside the Logicoland series",
          body: (
            <>
              <p>
                <GuideLink href="/books/logicoland-series">Logicoland</GuideLink> is a five-volume
                series of logic puzzle books created by educators at Logicology. Each activity uses
                clear, colour-coded hints and bite-sized steps so children learn <em>how</em> to
                think rather than how to guess.
              </p>
              <p>
                <strong>Volume 1</strong> introduces the core ideas with colour Sudoku, anagrams,
                patterns and symmetry: perfect for first-time puzzlers.{" "}
                <strong>Volumes 2 to 4</strong> add new puzzle types, more rules and longer chains
                of reasoning, including code-breaking challenges. <strong>Volume 5</strong> brings
                path and movement puzzles such as Colour Crawl and Knowing Knight that ask children
                to plan several steps ahead.
              </p>
              <p>
                Buy the volume that matches your child today, or choose the complete set so they
                can keep progressing as their skills grow.
              </p>
            </>
          ),
        },
        {
          heading: "Choosing the right logic book by age",
          body: (
            <p>
              For ages 6–8, begin with Volume 1 and work through it together at first. Children aged
              8–12 usually move quickly through Volumes 1 and 2 and enjoy the challenge of Volumes 3
              and 4. Confident older children and teens can start anywhere, and often head straight
              for Volume 5. If your child enjoys numbers, pair the books with our{" "}
              <GuideLink href="/games">brain games for kids</GuideLink>.
            </p>
          ),
        },
        {
          heading: "Books and online puzzles work together",
          body: (
            <p>
              Logicoland is screen-free first, but some puzzles also come to life online. Try the{" "}
              <GuideLink href="/logicoland/volume-5">free Logicoland Volume 5 puzzles</GuideLink>,
              then continue with dozens more in the printed book, where children can take their
              time, make notes and see their progress.
            </p>
          ),
        },
      ]}
    />
  );
}

export default function Page() {
  return (
    <>
      <JsonLd data={[breadcrumbSchema([["Books", "/books"]]), faqSchema(faqs)]} />
      <BooksClient>
        <BooksGuide />
      </BooksClient>
    </>
  );
}

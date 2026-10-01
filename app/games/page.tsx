import type { Metadata } from "next";
import JsonLd from "@/components/JsonLd";
import CollectionGuide, { GuideLink, type Faq } from "@/components/seo/CollectionGuide";
import { breadcrumbSchema, faqSchema, pageMetadata } from "@/lib/seo";
import GamesClient from "./GamesClient";

export const metadata: Metadata = pageMetadata({
  title: "Brain Games for Kids – Math & Logic Board Games | Logicology",
  description:
    "Brain games for kids that build logic, number sense and strategy. Shop Prime Time and Turn the Tables, screen-free math games the whole family enjoys.",
  path: "/games",
  ogTitle: "Brain Games for Kids – Math & Logic Board Games",
  image: "https://ik.imagekit.io/pratik2002/primetime_imag1.png?tr=w-1200,h-630,c-at_max",
});

const faqs: Faq[] = [
  {
    q: "What age is Prime Time suitable for?",
    a: "Prime Time is designed for ages 8 and up and plays with 2–6 players. Younger children can join in on a team with an adult, and adults genuinely enjoy the strategy too.",
  },
  {
    q: "Do kids need to know prime numbers before playing Prime Time?",
    a: "No. The game introduces prime and composite numbers as part of play, so children learn the idea by using it. Most kids are confidently spotting primes after a couple of rounds.",
  },
  {
    q: "What age is Turn the Tables for?",
    a: "Turn the Tables suits children from about 6 years old who are starting to learn multiplication, and stays fun for older kids who want to get faster with their times tables.",
  },
  {
    q: "Are these games good for classrooms?",
    a: "Yes. Both games play in 15–40 minutes with up to 6 players, which fits a class period or a math lab rotation. Schools also use them for math clubs and inter-house tournaments. Contact us for bulk and school orders.",
  },
  {
    q: "Are Logicology games screen-free?",
    a: "Yes. Every Logicology game is a physical card or board game. Our online puzzles are optional extras, never a requirement to play.",
  },
];

function GamesGuide() {
  return (
    <CollectionGuide
      faqs={faqs}
      sections={[
        {
          heading: "What are brain games for kids?",
          body: (
            <>
              <p>
                Brain games are games where winning depends on thinking: spotting patterns,
                planning ahead, working with numbers and adapting when the situation changes. Unlike
                worksheets, children play them because they want to, which means they practise
                those thinking skills far more often and for far longer.
              </p>
              <p>
                At Logicology we design brain games as educators first. Each game is built around a
                real concept from the school curriculum, like prime numbers or multiplication, and
                then tested with children until the learning is hidden inside the fun.
              </p>
            </>
          ),
        },
        {
          heading: "What skills do brain games build?",
          body: (
            <>
              <p>
                <strong>Logic and reasoning:</strong> every move asks “what happens if I play this?”,
                which is the habit at the heart of logical thinking.
              </p>
              <p>
                <strong>Number sense:</strong> in{" "}
                <GuideLink href="/games/prime-time">Prime Time</GuideLink>, children work with
                primes, composites and factors again and again, so the ideas become intuitive
                instead of memorised.
              </p>
              <p>
                <strong>Strategy:</strong> choosing which card to hold back and when to strike
                teaches planning and weighing options.
              </p>
              <p>
                <strong>Focus and fluency:</strong>{" "}
                <GuideLink href="/games/turn-the-tables">Turn the Tables</GuideLink> rewards quick,
                accurate multiplication, so times tables get faster through play rather than drills.
              </p>
            </>
          ),
        },
        {
          heading: "Choosing a brain game by age",
          body: (
            <>
              <p>
                <strong>Ages 6–8:</strong> start with games that make one skill feel like a race.
                Turn the Tables is ideal once your child begins multiplication, and the{" "}
                <GuideLink href="/books">Logicoland puzzle books</GuideLink> build early logic with
                colourful, step-by-step puzzles.
              </p>
              <p>
                <strong>Ages 8–12:</strong> this is the sweet spot for Prime Time. Children are
                ready for strategy, and the game strengthens the number work they meet in classes 4
                to 7.
              </p>
              <p>
                <strong>Ages 12+ and adults:</strong> both games scale up with smarter play. Older
                children use deeper strategy, which is why families keep playing together.
              </p>
            </>
          ),
        },
        {
          heading: "How to get the most out of brain games at home",
          body: (
            <>
              <p>
                Short and regular beats long and rare. Two or three 20-minute games a week do more
                for a child&apos;s thinking than one marathon session a month. Keep a game on the
                dining table or in the car bag so it is easy to say yes to “one more round”.
              </p>
              <p>
                Play alongside your child rather than just supervising. Think out loud about your
                own moves (“I&apos;ll keep this card because 7 is prime”) so they hear what
                strategic thinking sounds like. Then ask them to explain their move. Putting
                reasoning into words is where much of the learning happens.
              </p>
              <p>
                Finally, let them lose sometimes. Learning to recover from a bad hand, spot what went
                wrong and try a new plan is a thinking skill in its own right.
              </p>
            </>
          ),
        },
        {
          heading: "Why screen-free games work better than apps",
          body: (
            <p>
              Learning apps can hold attention, but they often reward fast tapping over careful
              thinking. A card or board game slows things down: children talk through their moves,
              explain their reasoning, lose gracefully and try again. Playing face to face with
              parents, siblings or friends also builds the patience and communication skills that
              no screen can teach.
            </p>
          ),
        },
        {
          heading: "How schools use Logicology games",
          body: (
            <p>
              Teachers use Prime Time and Turn the Tables in math labs, activity periods and math
              clubs, and as the basis for inter-school tournaments. Because each game needs only a
              table and a few minutes to learn, a whole class can be playing in one period. For
              school sets and bulk pricing, visit our{" "}
              <GuideLink href="/bulk-order">bulk order page</GuideLink> or{" "}
              <GuideLink href="/contact-us">get in touch</GuideLink>.
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
      <JsonLd data={[breadcrumbSchema([["Games", "/games"]]), faqSchema(faqs)]} />
      <GamesClient>
        <GamesGuide />
      </GamesClient>
    </>
  );
}

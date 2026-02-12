"use client";
import { useState } from "react";
import Image from "next/image";
import Head from "next/head";
import NavBar from "@/components/NavBar";
import { useRouter } from "next/navigation";
import SiteFooter from "@/components/Footer";

interface Game {
  id: number;
  title: string;
  imageUrl: string;
  description: string;
  author: string;
  rating: number;
  category: string;
  players?: string;
  duration?: string;
}

const toSlug = (title: string) =>
  title
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-");

export default function GamesPage() {
  const [selectedGame, setSelectedGame] = useState<Game | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const router = useRouter();

  const games: Game[] = [
    {
      id: 1,
      title: "Prime Time™",
      imageUrl: "https://ik.imagekit.io/pratik2002/primetime_imag1.png?updatedAt=1757032084370",
      description:
        "A thrilling math-based card game that challenges players to create prime numbers from their hand. Combine strategy and arithmetic skills to outsmart your opponents in this engaging educational game.",
      author: "Logicology",
      rating: 4.9,
      category: "Math Strategy",
      players: "2-6",
      duration: "15-30 min",
    },
    {
      id: 2,
      title: "Turn the Tables",
      imageUrl:
        "https://ik.imagekit.io/pratik11/TURN%20THE%20TABLE%20%20BOX%20MOCKUP.png?updatedAt=1757747148360",
      description:
        "An exciting multiplication-based card game where players match numbers on cards to outplay their opponents. Special strategy cards like Wild, Up, Down, Turn, and Streak add twists that keep the game fresh and unpredictable.",
      author: "Logicology",
      rating: 4.8,
      category: "Math Strategy",
      players: "2-6",
      duration: "20-40 min",
    },
  ];

  const isPrimeTime = (g: Game) => g.title === "Prime Time™";

  const openModal = (game: Game) => {
    setSelectedGame(game);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedGame(null);
  };

  const handleGetStarted = () => {
    if (!selectedGame) return;
    if (isPrimeTime(selectedGame)) {
      router.push(`/games/${toSlug(selectedGame.title)}`);
    }
  };

  return (
    <>
      <NavBar />
      <div className="min-h-screen bg-brand-hero p-6 text-brand-tealDark sm:p-8 md:p-10">
        <Head>
          <title>Games Collection</title>
        </Head>

        <header className="mb-6 sm:mb-8">
          <h1 className="text-center text-3xl font-extrabold tracking-tight text-brand-teal sm:text-4xl md:text-5xl">
            Games Collection
          </h1>
          <p className="mt-2 text-center text-brand-tealDark/75">
            Handpicked games to spark curiosity, learning, and fun.
          </p>
        </header>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:gap-7 lg:grid-cols-3 xl:grid-cols-4">
          {games.map((game) => (
            <div
              key={game.id}
              className="group relative cursor-pointer transition-all duration-300 hover:z-10"
              onClick={() => openModal(game)}
            >
              <div className="relative flex h-full flex-col overflow-hidden rounded-3xl bg-white p-3 shadow-soft ring-1 ring-black/5 transition-shadow hover:shadow-brand">
                {/* Coming Soon badge removed */}

                <div className="relative mb-3 aspect-[3/4] max-h-[48vh] w-full overflow-hidden rounded-2xl">
                  <Image
                    src={game.imageUrl}
                    alt={game.title}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 33vw"
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                </div>

                <div className="flex flex-1 flex-col">
                  <h3 className="mb-1 text-xl font-bold text-brand-tealDark">{game.title}</h3>
                  <p className="mb-2 text-xs text-brand-tealDark/70">by {game.author}</p>

                  <div className="mb-3">
                    <span className="inline-block rounded-full bg-brand-teal/10 px-2 py-1 text-xs font-medium text-brand-teal">
                      {game.category}
                    </span>
                  </div>

                  <div className="mt-auto flex items-center justify-between">
                    <span className="inline-flex items-center rounded-full bg-brand-coral px-2.5 py-1 text-xs font-semibold text-white">
                      ★ {game.rating}
                    </span>
                    <button
                      className="text-xs font-semibold text-brand-teal transition-colors hover:text-brand-coral"
                      onClick={(e) => {
                        e.stopPropagation();
                        openModal(game);
                      }}
                    >
                      View details →
                    </button>
                  </div>
                </div>

                <div className="pointer-events-none absolute inset-0 rounded-3xl ring-0 transition-all group-hover:ring-2 group-hover:ring-brand-teal/35" />
              </div>
            </div>
          ))}
        </div>

        {/* Modal for all games */}
        {isModalOpen && selectedGame && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
            <div className="max-h-[92vh] w-full max-w-5xl overflow-y-auto rounded-4xl bg-white text-brand-tealDark shadow-brand">
              <div className="relative">
                <button
                  onClick={closeModal}
                  className="absolute right-4 top-4 z-10 rounded-full bg-brand-teal p-2 text-white transition-colors hover:bg-brand-coral"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>

                <div className="grid md:grid-cols-2">
                  <div className="relative h-72 md:h-full">
                    <Image
                      src={selectedGame.imageUrl}
                      alt={selectedGame.title}
                      fill
                      className="rounded-t-4xl object-cover md:rounded-l-4xl md:rounded-tr-none"
                    />
                    {/* Coming Soon overlay removed */}
                  </div>

                  <div className="p-6 sm:p-8">
                    <h2 className="mb-1 text-3xl font-extrabold text-brand-teal">
                      {selectedGame.title}
                    </h2>
                    <p className="mb-2 text-brand-tealDark/75">by {selectedGame.author}</p>

                    <div className="mb-4 flex items-center">
                      <span className="inline-block rounded-full bg-brand-teal/15 px-3 py-1 text-sm font-medium text-brand-teal">
                        {selectedGame.category}
                      </span>
                    </div>

                    <div className="mb-6 flex items-center">
                      <div className="flex text-brand-gold">
                        {[...Array(5)].map((_, i) => (
                          <svg
                            key={i}
                            xmlns="http://www.w3.org/2000/svg"
                            className={`h-5 w-5 ${
                              i < Math.floor(selectedGame.rating)
                                ? "fill-current"
                                : "fill-none stroke-current"
                            }`}
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
                            />
                          </svg>
                        ))}
                      </div>
                      <span className="ml-2 text-brand-tealDark/70">{selectedGame.rating}/5</span>
                    </div>

                    <div className="mb-6 grid grid-cols-2 gap-4">
                      <div className="rounded-2xl bg-brand-teal/5 p-3 text-center">
                        <p className="text-sm text-brand-tealDark/70">Players</p>
                        <p className="font-semibold text-brand-teal">{selectedGame.players}</p>
                      </div>
                      <div className="rounded-2xl bg-brand-teal/5 p-3 text-center">
                        <p className="text-sm text-brand-tealDark/70">Duration</p>
                        <p className="font-semibold text-brand-teal">{selectedGame.duration}</p>
                      </div>
                    </div>

                    <p className="mb-8 text-brand-tealDark/85">{selectedGame.description}</p>

                    {isPrimeTime(selectedGame) ? (
                      <button
                        className="group inline-flex w-full items-center justify-center gap-2 rounded-full border-2 border-brand-coral bg-transparent px-6 py-3 font-semibold text-brand-coral transition-colors hover:bg-brand-coral hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-coral/40 active:scale-[.99]"
                        onClick={handleGetStarted}
                      >
                        Know More about {selectedGame.title}
                      </button>
                    ) : (
                      <button
                        className="group inline-flex w-full items-center justify-center gap-2 rounded-full border-2 border-brand-teal bg-transparent px-6 py-3 font-semibold text-brand-teal transition-colors hover:bg-brand-teal hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-teal/40 active:scale-[.99]"
                        onClick={() => {
                          // You can add functionality for other games here
                          console.log(`View details for ${selectedGame.title}`);
                        }}
                      >
                        View Game Details
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
      <SiteFooter />
    </>
  );
}
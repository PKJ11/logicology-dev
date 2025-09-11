"use client";
import { useState } from 'react';
import Image from 'next/image';
import Head from 'next/head';
import NavBar from '@/components/NavBar';
import { useRouter } from 'next/navigation';
import SiteFooter from '@/components/Footer';

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

export default function GamesPage() {
  const [selectedGame, setSelectedGame] = useState<Game | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const router = useRouter();

  const games: Game[] = [
    {
      id: 1,
      title: 'PrimeTime',
      imageUrl: 'https://ik.imagekit.io/pratik2002/primetime_imag1.png?updatedAt=1757032084370',
      description: 'A thrilling math-based card game that challenges players to create prime numbers from their hand. Combine strategy and arithmetic skills to outsmart your opponents in this engaging educational game.',
      author: 'Gayatri',
      rating: 4.9,
      category: 'Math Strategy',
      players: '2-6',
      duration: '15-30 min'
    },
    
  ];

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

    if (selectedGame.title === "Logicoland") {
      router.push("/games/logicoland1");
    } else if (selectedGame.title === "PrimeTime") {
      router.push("/games/primetime");
    } else {
      router.push(`/games/${selectedGame.title.toLowerCase().replace(/\s+/g, "-")}`);
    }
  };

  return (
    <>
      <NavBar />
      {/* Page shell */}
      <div className="min-h-screen text-brand-tealDark bg-brand-hero p-6 sm:p-8 md:p-10">
        <Head>
          <title>Games Collection</title>
        </Head>

        <header className="mb-6 sm:mb-8">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-brand-teal">
            Games Collection
          </h1>
          <p className="mt-2 text-brand-tealDark/75">
            Handpicked games to spark curiosity, learning, and fun.
          </p>
        </header>

        {/* Bigger cards: fewer cols + larger min width */}
        <div
          className="
            grid gap-7 md:gap-8
            grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4
          "
        >
          {games.map((game) => (
            <div
              key={game.id}
              className="relative group cursor-pointer transition-all duration-300 hover:z-10"
              onClick={() => openModal(game)}
            >
              <div className="
                relative overflow-hidden rounded-4xl bg-white shadow-soft ring-1 ring-black/5
                p-4 hover:shadow-brand transition-shadow
              ">
                {/* Larger cover area with fixed aspect ratio */}
                <div className="relative w-full aspect-[3/4] rounded-3xl overflow-hidden">
                  <Image
                    src={game.imageUrl}
                    alt={game.title}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 33vw"
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                </div>

                <div className="pt-5">
                  <h3 className="text-2xl font-bold text-brand-tealDark">{game.title}</h3>
                  <p className="text-sm text-brand-tealDark/70">by {game.author}</p>
                  
                  <div className="mt-2 flex items-center">
                    <span className="inline-block px-2 py-1 bg-brand-teal/10 text-brand-teal text-xs font-medium rounded-full">
                      {game.category}
                    </span>
                  </div>

                  <div className="mt-4 flex items-center justify-between">
                    <span className="inline-flex items-center rounded-full bg-brand-coral text-white text-xs font-semibold px-2.5 py-1">
                      ★ {game.rating}
                    </span>
                    <button
                      className="text-sm font-semibold text-brand-teal hover:text-brand-coral transition-colors"
                      onClick={(e) => {
                        e.stopPropagation();
                        openModal(game);
                      }}
                    >
                      View details →
                    </button>
                  </div>
                </div>

                {/* subtle brand ring on hover */}
                <div className="pointer-events-none absolute inset-0 rounded-4xl ring-0 group-hover:ring-2 group-hover:ring-brand-teal/35 transition-all" />
              </div>
            </div>
          ))}
        </div>

        {/* Modal */}
        {isModalOpen && selectedGame && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white text-brand-tealDark rounded-4xl max-w-5xl w-full max-h-[92vh] overflow-y-auto shadow-brand">
              <div className="relative">
                <button
                  onClick={closeModal}
                  className="absolute top-4 right-4 bg-brand-teal text-white rounded-full p-2 z-10 hover:bg-brand-coral transition-colors"
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
                      className="object-cover rounded-t-4xl md:rounded-l-4xl md:rounded-tr-none"
                    />
                  </div>

                  <div className="p-6 sm:p-8">
                    <h2 className="text-3xl font-extrabold text-brand-teal mb-1">
                      {selectedGame.title}
                    </h2>
                    <p className="text-brand-tealDark/75 mb-2">by {selectedGame.author}</p>
                    
                    <div className="flex items-center mb-4">
                      <span className="inline-block px-3 py-1 bg-brand-teal/15 text-brand-teal text-sm font-medium rounded-full">
                        {selectedGame.category}
                      </span>
                    </div>

                    <div className="flex items-center mb-6">
                      <div className="flex text-brand-gold">
                        {[...Array(5)].map((_, i) => (
                          <svg
                            key={i}
                            xmlns="http://www.w3.org/2000/svg"
                            className={`h-5 w-5 ${
                              i < Math.floor(selectedGame.rating)
                                ? 'fill-current'
                                : 'stroke-current fill-none'
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
                      <span className="ml-2 text-brand-tealDark/70">
                        {selectedGame.rating}/5
                      </span>
                    </div>
                    
                    {/* Game-specific details */}
                    <div className="grid grid-cols-2 gap-4 mb-6">
                      <div className="bg-brand-teal/5 rounded-2xl p-3 text-center">
                        <p className="text-sm text-brand-tealDark/70">Players</p>
                        <p className="font-semibold text-brand-teal">{selectedGame.players}</p>
                      </div>
                      <div className="bg-brand-teal/5 rounded-2xl p-3 text-center">
                        <p className="text-sm text-brand-tealDark/70">Duration</p>
                        <p className="font-semibold text-brand-teal">{selectedGame.duration}</p>
                      </div>
                    </div>

                    <p className="text-brand-tealDark/85 mb-8">{selectedGame.description}</p>

                    <button className="group inline-flex w-full items-center justify-center gap-2
             rounded-full border-2 border-brand-coral bg-transparent
             px-6 py-3 font-semibold text-brand-coral
             transition-colors hover:bg-brand-coral hover:text-white
             focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-coral/40
             active:scale-[.99]" onClick={handleGetStarted}>
                      Know More about {selectedGame.title}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
      <SiteFooter/>
    </>
  );
}
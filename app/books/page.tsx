"use client";
import { useState } from "react";
import Image from "next/image";
import Head from "next/head";
import NavBar from "@/components/NavBar";
import { useRouter } from "next/navigation";
import SiteFooter from "@/components/Footer";

interface Book {
  id: number;
  title: string;
  imageUrl: string;
  description: string;
  author: string;
  rating: number;
}

const toSlug = (title: string) =>
  title
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-");

export default function BooksPage() {
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const router = useRouter();

  const books: Book[] = [
    {
      id: 1,
      title: "Logicoland Series",
      imageUrl:
        "https://ik.imagekit.io/pratik11/LOGICOLAND-ALL-5-BOOK-COVERS.png?updatedAt=1757748175426",
      description:
        "Welcome to Logicoland, a vibrant puzzle world that makes logic feel simple and fun. Each activity uses clear, color-coded hints and bite-sized steps so kids learn how to think, not just guess. From matching and patterns to starter Sudoku, children build focus, reasoning, and confidence—one colorful challenge at a time.",
      author: "Logicology",
      rating: 4.8,
    },
    {
      id: 2,
      title: "Speed Maths",
      imageUrl:
        "https://ik.imagekit.io/pratik11/SPEED%20MATHS%20COVER%20MOCKUP.png?updatedAt=1757748179754",
      description:
        "Sharpen your mental math skills with Speed Maths! Packed with fun drills, rapid challenges, and clever tricks, this book trains children to calculate faster while enjoying the thrill of beating the clock. A perfect blend of practice and play to build confidence in arithmetic.",
      author: "Logicology",
      rating: 4.7,
    },
    {
      id: 3,
      title: "Hidden in the Jungle",
      imageUrl:
        "https://ik.imagekit.io/pratik11/HIDDEN%20IN%20THE%20JUNGLE%20MOCKUP.png?updatedAt=1757748179906",
      description:
        "A fast-paced observation and deduction card game where players race to spot hidden animals camouflaged in the jungle. Quick eyes and sharp focus are the key to winning in this exciting family-friendly adventure.",
      author: "Logicology",
      rating: 4.7,
    },
  ];

  const isLogicoland = (b: Book) => b.title.toLowerCase().startsWith("logicoland");

  const openModal = (book: Book) => {
    setSelectedBook(book);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedBook(null);
  };

  const handleGetStarted = () => {
    if (!selectedBook) return;

    if (isLogicoland(selectedBook)) {
      // direct route for Logicoland
      router.push("/books/logicoland-series");
    } else {
      // Others are Coming Soon — do nothing (or keep generic route if you want later)
      // router.push(`/books/${toSlug(selectedBook.title)}`);
    }
  };

  return (
    <>
      <NavBar />
      {/* Page shell */}
      <div className="min-h-screen bg-brand-hero p-6 text-brand-tealDark sm:p-8 md:p-10">
        <Head>
          <title>Books Collection</title>
        </Head>

        <header className="mb-6 sm:mb-8">
          <h1 className="text-center font-heading text-3xl font-extrabold tracking-tight text-brand-teal sm:text-4xl md:text-5xl">
            Books Collection
          </h1>
          <p className="textstyles mt-2 text-center text-brand-tealDark/75">
            Handpicked titles to spark curiosity and learning.
          </p>
        </header>

        <div className="grid grid-cols-1 gap-7 sm:grid-cols-2 md:gap-8 lg:grid-cols-3 xl:grid-cols-4">
          {books.map((book) => (
            <div
              key={book.id}
              className="group relative cursor-pointer transition-all duration-300 hover:z-10"
              onClick={() => openModal(book)}
            >
              <div className="relative overflow-hidden rounded-4xl bg-white p-4 shadow-soft ring-1 ring-black/5 transition-shadow hover:shadow-brand">
                {/* Coming Soon badge for all EXCEPT Logicoland */}
                {!isLogicoland(book) && (
                  <div className="absolute right-4 top-4 z-10">
                    <span className="inline-flex items-center rounded-full bg-brand-coral px-2.5 py-1 text-xs font-medium text-white">
                      Coming Soon
                    </span>
                  </div>
                )}

                {/* Larger cover area with fixed aspect ratio */}
                <div className="relative aspect-[3/4] max-h-[48vh] w-full overflow-hidden rounded-3xl">
                  <Image
                    src={book.imageUrl}
                    alt={book.title}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 33vw"
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                </div>

                <div className="pt-5">
                  <h3 className="text-xl font-bold text-brand-tealDark">{book.title}</h3>
                  <p className="text-sm text-brand-tealDark/70">by {book.author}</p>

                  <div className="mt-4 flex items-center justify-between">
                    <span className="inline-flex items-center rounded-full bg-brand-coral px-2.5 py-1 text-xs font-semibold text-white">
                      ★ {book.rating}
                    </span>
                    <button
                      className="text-sm font-semibold text-brand-teal transition-colors hover:text-brand-coral"
                      onClick={(e) => {
                        e.stopPropagation();
                        openModal(book);
                      }}
                    >
                      View details →
                    </button>
                  </div>
                </div>

                {/* subtle brand ring on hover */}
                <div className="pointer-events-none absolute inset-0 rounded-4xl ring-0 transition-all group-hover:ring-2 group-hover:ring-brand-teal/35" />
              </div>
            </div>
          ))}
        </div>

        {/* Modal */}
        {isModalOpen && selectedBook && (
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
                      src={selectedBook.imageUrl}
                      alt={selectedBook.title}
                      fill
                      className="block h-auto w-full rounded-t-4xl object-cover md:rounded-l-4xl md:rounded-tr-none"
                    />
                    {/* Coming Soon overlay for NON-Logicoland */}
                    {!isLogicoland(selectedBook) && (
                      <div className="absolute inset-0 flex items-center justify-center rounded-t-4xl bg-black/70 md:rounded-l-4xl md:rounded-tr-none">
                        <div className="p-6 text-center">
                          <span className="mb-4 inline-flex items-center rounded-full bg-brand-coral px-4 py-2 text-lg font-bold text-white">
                            Coming Soon
                          </span>
                          <p className="text-sm text-white">This title will be available shortly</p>
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="p-6 sm:p-8">
                    <h2 className="mb-1 text-3xl font-extrabold text-brand-teal">
                      {selectedBook.title}
                    </h2>
                    <p className="mb-4 text-brand-tealDark/75">by {selectedBook.author}</p>

                    <div className="mb-6 flex items-center">
                      <div className="flex text-brand-gold">
                        {[...Array(5)].map((_, i) => (
                          <svg
                            key={i}
                            xmlns="http://www.w3.org/2000/svg"
                            className={`h-5 w-5 ${
                              i < Math.floor(selectedBook.rating)
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
                      <span className="ml-2 text-brand-tealDark/70">{selectedBook.rating}/5</span>
                    </div>

                    <p className="mb-8 text-brand-tealDark/85">{selectedBook.description}</p>

                    {isLogicoland(selectedBook) ? (
                      <button
                        onClick={handleGetStarted}
                        className="group inline-flex w-full items-center justify-center gap-2 rounded-full border-2 border-brand-coral bg-transparent px-6 py-3 font-semibold text-brand-coral transition-colors hover:bg-brand-coral hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-coral/40 active:scale-[.99]"
                      >
                        Know More about {selectedBook.title}
                        <svg
                          className="h-4 w-4 transition-transform group-hover:translate-x-1"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9 5l7 7-7 7"
                          />
                        </svg>
                      </button>
                    ) : (
                      <div className="rounded-2xl bg-brand-teal/5 p-4 text-center">
                        <p className="mb-2 font-semibold text-brand-coral">Coming Soon</p>
                        <p className="text-sm text-brand-tealDark/70">
                          This title will be available shortly. Stay tuned!
                        </p>
                      </div>
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

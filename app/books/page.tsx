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

export default function BooksPage() {
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const router = useRouter();

  const books: Book[] = [
    {
      id: 1,
      title: "Logicoland 1",
      imageUrl:
        "https://ik.imagekit.io/pratik2002/LOGICOLAND-CONTAINER-1-IMAGE.png?updatedAt=1757035431658",
      description:
        "Welcome to Logicoland, a vibrant puzzle world that makes logic feel simple and fun. Each activity uses clear, color-coded hints and bite-sized steps so kids learn how to think, not just guess. From matching and patterns to starter Sudoku, children build focus, reasoning, and confidence—one colorful challenge at a time.",
      author: "Logicology",
      rating: 4.8,
    },
    {
      id: 1,
      title: "Logicoland 2",
      imageUrl:
        "https://ik.imagekit.io/pratik2002/LOGICOLAND-CONTAINER-1-IMAGE.png?updatedAt=1757035431658",
      description:
        "Welcome to Logicoland, a vibrant puzzle world that makes logic feel simple and fun. Each activity uses clear, color-coded hints and bite-sized steps so kids learn how to think, not just guess. From matching and patterns to starter Sudoku, children build focus, reasoning, and confidence—one colorful challenge at a time.",
      author: "Logicology",
      rating: 4.8,
    },
    {
      id: 1,
      title: "Logicoland 3",
      imageUrl:
        "https://ik.imagekit.io/pratik2002/LOGICOLAND-CONTAINER-1-IMAGE.png?updatedAt=1757035431658",
      description:
        "Welcome to Logicoland, a vibrant puzzle world that makes logic feel simple and fun. Each activity uses clear, color-coded hints and bite-sized steps so kids learn how to think, not just guess. From matching and patterns to starter Sudoku, children build focus, reasoning, and confidence—one colorful challenge at a time.",
      author: "Logicology",
      rating: 4.8,
    },
    {
      id: 1,
      title: "Logicoland 4",
      imageUrl:
        "https://ik.imagekit.io/pratik2002/LOGICOLAND-CONTAINER-1-IMAGE.png?updatedAt=1757035431658",
      description:
        "Welcome to Logicoland, a vibrant puzzle world that makes logic feel simple and fun. Each activity uses clear, color-coded hints and bite-sized steps so kids learn how to think, not just guess. From matching and patterns to starter Sudoku, children build focus, reasoning, and confidence—one colorful challenge at a time.",
      author: "Logicology",
      rating: 4.8,
    },
    {
      id: 1,
      title: "Logicoland 5",
      imageUrl:
        "https://ik.imagekit.io/pratik2002/LOGICOLAND-CONTAINER-1-IMAGE.png?updatedAt=1757035431658",
      description:
        "Welcome to Logicoland, a vibrant puzzle world that makes logic feel simple and fun. Each activity uses clear, color-coded hints and bite-sized steps so kids learn how to think, not just guess. From matching and patterns to starter Sudoku, children build focus, reasoning, and confidence—one colorful challenge at a time.",
      author: "Logicology",
      rating: 4.8,
    },
  ];

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

    if (selectedBook.title === "Logicoland") {
      router.push("/books/logicoland1");
    } else {
      // fallback: you could route to a generic /books/[slug]
      router.push(
        `/books/${selectedBook.title.toLowerCase().replace(/\s+/g, "-")}`
      );
    }
  };

  return (
    <>
      <NavBar />
      {/* Page shell */}
      <div className="min-h-screen text-brand-tealDark bg-brand-hero p-6 sm:p-8 md:p-10">
        <Head>
          <title>Books Collection</title>
        </Head>

        <header className="mb-6 sm:mb-8">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-brand-teal text-center font-heading">
            Books Collection
          </h1>
          <p className="mt-2 textstyles text-brand-tealDark/75 text-center">
            Handpicked titles to spark curiosity and learning.
          </p>
        </header>

        <div
          className="
            grid gap-7 md:gap-8
            grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4
          "
        >
          {books.map((book) => (
            <div
              key={book.id}
              className="relative group cursor-pointer transition-all duration-300 hover:z-10"
              onClick={() => openModal(book)}
            >
              <div
                className="
                relative overflow-hidden rounded-4xl bg-white shadow-soft ring-1 ring-black/5
                p-4 hover:shadow-brand transition-shadow
              "
              >
                {/* Larger cover area with fixed aspect ratio */}
                <div className="relative w-full max-h-[48vh] aspect-[3/4] rounded-3xl overflow-hidden">
                  <Image
                    src={book.imageUrl}
                    alt={book.title}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 33vw"
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                </div>

                <div className="pt-5">
                  <h3 className="text-xl font-bold text-brand-tealDark">
                    {book.title}
                  </h3>
                  <p className="text-sm text-brand-tealDark/70">
                    by {book.author}
                  </p>

                  <div className="mt-4 flex items-center justify-between">
                    <span className="inline-flex items-center rounded-full bg-brand-coral text-white text-xs font-semibold px-2.5 py-1">
                      ★ {book.rating}
                    </span>
                    <button
                      className="text-sm font-semibold text-brand-teal hover:text-brand-coral transition-colors"
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
                <div className="pointer-events-none absolute inset-0 rounded-4xl ring-0 group-hover:ring-2 group-hover:ring-brand-teal/35 transition-all" />
              </div>
            </div>
          ))}
        </div>

        {/* Modal */}
        {isModalOpen && selectedBook && (
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
                      src="https://ik.imagekit.io/pratik2002/LOGICOLAND-CONTAINER-2-IMAGE.png?updatedAt=1757035431654"
                      alt={selectedBook.title}
                      fill
                      className="block w-full h-auto"
                    />
                  </div>

                  <div className="p-6 sm:p-8">
                    <h2 className="text-3xl font-extrabold text-brand-teal mb-1">
                      {selectedBook.title}
                    </h2>
                    <p className="text-brand-tealDark/75 mb-4">
                      by {selectedBook.author}
                    </p>

                    <div className="flex items-center mb-6">
                      <div className="flex text-brand-gold">
                        {[...Array(5)].map((_, i) => (
                          <svg
                            key={i}
                            xmlns="http://www.w3.org/2000/svg"
                            className={`h-5 w-5 ${
                              i < Math.floor(selectedBook.rating)
                                ? "fill-current"
                                : "stroke-current fill-none"
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
                        {selectedBook.rating}/5
                      </span>
                    </div>

                    <p className="text-brand-tealDark/85 mb-8">
                      {selectedBook.description}
                    </p>

                    <button
                      onClick={handleGetStarted}
                      className="group inline-flex w-full items-center justify-center gap-2
             rounded-full border-2 border-brand-coral bg-transparent
             px-6 py-3 font-semibold text-brand-coral
             transition-colors hover:bg-brand-coral hover:text-white
             focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-coral/40
             active:scale-[.99]"
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

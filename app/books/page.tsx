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

  const openModal = (book: Book) => {
    setSelectedBook(book);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedBook(null);
  };

  const handleLearnMore = () => {
    if (!selectedBook) return;
    router.push(`/books/${toSlug(selectedBook.title)}`);
  };

  return (
    <>
      <Head>
        <title>Books Collection | Logicology – Educational Books for Kids</title>
        <meta
          name="description"
          content="Explore Logicology's collection of educational books for kids — Logicoland Series, Speed Maths, and Hidden in the Jungle. Fun, engaging, and designed to build logical thinking and math skills."
        />
        <meta
          name="keywords"
          content="educational books for kids, Logicoland series, Speed Maths book, Hidden in the Jungle, logic books for children, kids puzzle books, math books for kids, Logicology books, learning books India"
        />
        <meta
          name="robots"
          content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1"
        />
        <meta name="author" content="Logicology" />
        <meta name="publisher" content="Logicology" />
        <link rel="canonical" href="https://www.logicology.in/books" />

        {/* Open Graph / Facebook */}
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://www.logicology.in/books" />
        <meta property="og:site_name" content="Logicology" />
        <meta
          property="og:title"
          content="Books Collection | Logicology – Educational Books for Kids"
        />
        <meta
          property="og:description"
          content="Discover Logicology's educational books — Logicoland Series, Speed Maths, and Hidden in the Jungle. Designed to make learning fun for children."
        />
        <meta
          property="og:image"
          content="https://ik.imagekit.io/pratik11/LOGICOLAND-ALL-5-BOOK-COVERS.png?tr=w-1200,h-630,c-at_max"
        />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta property="og:locale" content="en_IN" />

        {/* Twitter */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:url" content="https://www.logicology.in/books" />
        <meta
          name="twitter:title"
          content="Books Collection | Logicology – Educational Books for Kids"
        />
        <meta
          name="twitter:description"
          content="Explore Logicology's educational books for kids. Fun, engaging, and designed to build logical thinking and math skills."
        />
        <meta
          name="twitter:image"
          content="https://ik.imagekit.io/pratik11/LOGICOLAND-ALL-5-BOOK-COVERS.png?tr=w-1200,h-630,c-at_max"
        />

        {/* Schema.org — ItemList of Books */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "ItemList",
              name: "Logicology Books Collection",
              url: "https://www.logicology.in/books",
              description:
                "Educational books for kids by Logicology covering logic, math, and observation skills.",
              itemListElement: books.map((book, index) => ({
                "@type": "ListItem",
                position: index + 1,
                item: {
                  "@type": "Book",
                  name: book.title,
                  author: {
                    "@type": "Organization",
                    name: book.author,
                  },
                  description: book.description,
                  image: book.imageUrl,
                  url: `https://www.logicology.in/books/${toSlug(book.title)}`,
                  aggregateRating: {
                    "@type": "AggregateRating",
                    ratingValue: book.rating,
                    bestRating: "5",
                    worstRating: "1",
                    ratingCount: "50",
                  },
                  publisher: {
                    "@type": "Organization",
                    name: "Logicology",
                    url: "https://www.logicology.in",
                  },
                },
              })),
            }),
          }}
        />

        {/* Schema.org — BreadcrumbList */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "BreadcrumbList",
              itemListElement: [
                {
                  "@type": "ListItem",
                  position: 1,
                  name: "Home",
                  item: "https://www.logicology.in",
                },
                {
                  "@type": "ListItem",
                  position: 2,
                  name: "Books",
                  item: "https://www.logicology.in/books",
                },
              ],
            }),
          }}
        />
      </Head>

      <NavBar />
      <div className="min-h-screen bg-brand-hero p-6 text-brand-tealDark sm:p-8 md:p-10">
        <header className="mb-6 sm:mb-8">
          <h1 className="text-center text-3xl font-extrabold tracking-tight text-brand-teal sm:text-4xl md:text-5xl">
            Books Collection
          </h1>
          <p className="mt-2 text-center text-brand-tealDark/75">
            Discover our collection of engaging books that make learning fun.
          </p>
        </header>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:gap-7 lg:grid-cols-3 xl:grid-cols-4">
          {books.map((book) => {
            const isComingSoon =
              book.title === "Speed Maths" || book.title === "Hidden in the Jungle";
            return (
              <div
                key={book.id}
                className="group relative cursor-pointer transition-all duration-300 hover:z-10"
                onClick={() => {
                  if (!isComingSoon) openModal(book);
                }}
              >
                <div className="relative flex h-full flex-col overflow-hidden rounded-3xl bg-white p-3 shadow-soft ring-1 ring-black/5 transition-shadow hover:shadow-brand">
                  <div className="relative mb-3 aspect-[3/4] max-h-[48vh] w-full overflow-hidden rounded-2xl">
                    <Image
                      src={book.imageUrl}
                      alt={`${book.title} by ${book.author} – educational book cover`}
                      fill
                      sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 33vw"
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    {isComingSoon && (
                      <span className="absolute left-2 top-2 z-10 rounded-full bg-brand-coral px-3 py-1 text-xs font-bold text-white shadow">
                        Coming Soon
                      </span>
                    )}
                  </div>

                  <div className="flex flex-1 flex-col">
                    <h3 className="mb-1 text-xl font-bold text-brand-tealDark">{book.title}</h3>
                    <p className="mb-2 text-xs text-brand-tealDark/70">by {book.author}</p>

                    <div className="mt-auto flex items-center justify-between">
                      <span className="inline-flex items-center rounded-full bg-brand-coral px-2.5 py-1 text-xs font-semibold text-white">
                        ★ {book.rating}
                      </span>
                      <button
                        className={`text-xs font-semibold transition-colors ${
                          isComingSoon
                            ? "cursor-not-allowed text-gray-400"
                            : "text-brand-teal hover:text-brand-coral"
                        }`}
                        onClick={(e) => {
                          e.stopPropagation();
                          if (!isComingSoon) openModal(book);
                        }}
                        disabled={isComingSoon}
                        aria-label={
                          isComingSoon
                            ? `${book.title} coming soon`
                            : `View details for ${book.title}`
                        }
                      >
                        {isComingSoon ? "Coming Soon" : "View details →"}
                      </button>
                    </div>
                  </div>

                  <div className="pointer-events-none absolute inset-0 rounded-3xl ring-0 transition-all group-hover:ring-2 group-hover:ring-brand-teal/35" />
                </div>
              </div>
            );
          })}
        </div>

        {/* Book Modal */}
        {isModalOpen && selectedBook && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm"
            role="dialog"
            aria-modal="true"
            aria-labelledby="modal-title"
          >
            <div className="max-h-[92vh] w-full max-w-5xl overflow-y-auto rounded-4xl bg-white text-brand-tealDark shadow-brand">
              <div className="relative">
                <button
                  onClick={closeModal}
                  aria-label="Close book details"
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
                      alt={`${selectedBook.title} by ${selectedBook.author} – full book cover`}
                      fill
                      className="rounded-t-4xl object-cover md:rounded-l-4xl md:rounded-tr-none"
                    />
                  </div>

                  <div className="p-6 sm:p-8">
                    <h2 id="modal-title" className="mb-1 text-3xl font-extrabold text-brand-teal">
                      {selectedBook.title}
                    </h2>
                    <p className="mb-4 text-brand-tealDark/75">by {selectedBook.author}</p>

                    <div className="mb-6 flex items-center">
                      <div
                        className="flex text-brand-gold"
                        aria-label={`Rating: ${selectedBook.rating} out of 5`}
                      >
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

                    <div className="mb-8">
                      <h3 className="mb-2 text-sm font-semibold uppercase tracking-wide text-brand-tealDark/60">
                        About this book
                      </h3>
                      <p className="leading-relaxed text-brand-tealDark/85">
                        {selectedBook.description}
                      </p>
                    </div>

                    {["Speed Maths", "Hidden in the Jungle"].includes(selectedBook.title) ? (
                      <button
                        className="group inline-flex w-full cursor-not-allowed items-center justify-center gap-2 rounded-full border-2 border-gray-400 bg-gray-200 px-6 py-3 font-semibold text-gray-400"
                        disabled
                        aria-disabled="true"
                      >
                        Coming Soon
                      </button>
                    ) : (
                      <button
                        className="group inline-flex w-full items-center justify-center gap-2 rounded-full border-2 border-brand-coral bg-transparent px-6 py-3 font-semibold text-brand-coral transition-colors hover:bg-brand-coral hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-coral/40 active:scale-[.99]"
                        onClick={handleLearnMore}
                        aria-label={`Learn more about ${selectedBook.title}`}
                      >
                        Know More about {selectedBook.title}
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

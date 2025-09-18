"use client";

import Link from "next/link";
import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { FiMenu, FiX, FiShoppingCart, FiSearch, FiLogIn, FiChevronDown } from "react-icons/fi";
import Image from "next/image";

/* ================= Types ================= */

type Game = {
  id: number;
  title: string;
  imageUrl: string;
  description: string;
  author: string;
  rating: number;
  category: string;
  players: string;
  duration: string;
};

type Book = {
  id: number;
  title: string;
  imageUrl: string;
  description: string;
  author: string;
  rating: number;
};

/* ================= Data ================= */

const games: Game[] = [
  {
    id: 1,
    title: "PrimeTime",
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

const navItems = [
  { name: "Home", href: "/" },
  { name: "Games", href: "/games", hasDropdown: true, type: "games" },
  { name: "Books", href: "/books", hasDropdown: true, type: "books" },
  { name: "Products", href: "/products" },
  { name: "About Us", href: "/about" },
];

/* ================= Utils ================= */

const generateSlug = (title: string) =>
  title
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^\w\-]+/g, "")
    .replace(/\-\-+/g, "-")
    .replace(/^-+/, "")
    .replace(/-+$/, "");

/* ================= Component ================= */

export default function NavBar() {
  const router = useRouter();

  const [open, setOpen] = useState(false);
  const [isDesktop, setIsDesktop] = useState(false);
  const [gamesDropdownOpen, setGamesDropdownOpen] = useState(false);
  const [booksDropdownOpen, setBooksDropdownOpen] = useState(false);

  // Refs only for desktop hover dropdowns
  const gamesDropdownRef = useRef<HTMLDivElement>(null);
  const booksDropdownRef = useRef<HTMLDivElement>(null);
  const gamesTriggerRef = useRef<HTMLDivElement>(null);
  const booksTriggerRef = useRef<HTMLDivElement>(null);

  // Detect desktop once and on resize
  useEffect(() => {
    const mq = window.matchMedia("(min-width: 768px)");
    const set = () => setIsDesktop(mq.matches);
    set();
    mq.addEventListener("change", set);
    return () => mq.removeEventListener("change", set);
  }, []);

  // Only attach outside-click handler on DESKTOP
  useEffect(() => {
    if (!isDesktop) return;
    const handleClickOutside = (event: MouseEvent) => {
      if (
        gamesDropdownRef.current &&
        !gamesDropdownRef.current.contains(event.target as Node) &&
        gamesTriggerRef.current &&
        !gamesTriggerRef.current.contains(event.target as Node)
      ) {
        setGamesDropdownOpen(false);
      }
      if (
        booksDropdownRef.current &&
        !booksDropdownRef.current.contains(event.target as Node) &&
        booksTriggerRef.current &&
        !booksTriggerRef.current.contains(event.target as Node)
      ) {
        setBooksDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isDesktop]);

  // Desktop hover open/close (no effect on mobile)
  const handleDropdownHover = (type: "games" | "books", open: boolean) => {
    if (!isDesktop) return;
    if (type === "games") {
      setGamesDropdownOpen(open);
      if (open) setBooksDropdownOpen(false);
    } else {
      setBooksDropdownOpen(open);
      if (open) setGamesDropdownOpen(false);
    }
  };

  // Navigate without closing (as requested)
  const goto = (href: string) => {
    router.push(href);
    // do NOT close menu or dropdowns
  };

  // Close everything (used only for simple links where closing is OK)
  const closeAll = () => {
    setOpen(false);
    setGamesDropdownOpen(false);
    setBooksDropdownOpen(false);
  };

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200 bg-white/80 backdrop-blur">
      <div className="px-4 md:mx-auto md:max-w-[75vw] lg:mx-auto lg:max-w-[75vw] lg:px-8">
        <div className="flex justify-between py-3">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <div className="relative h-auto w-[150px]">
              <Image
                src="https://ik.imagekit.io/pratik2002/logicology-logo_74-P-ICfG?updatedAt=1756257433107"
                alt="Logicology Logo"
                width={150}
                height={60}
                className="object-contain"
              />
            </div>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden items-center gap-6 font-heading text-sm text-slate-700 md:flex">
            {navItems.map((item) => (
              <div
                key={item.name}
                className="relative"
                ref={
                  item.type === "games"
                    ? gamesTriggerRef
                    : item.type === "books"
                      ? booksTriggerRef
                      : null
                }
                onMouseEnter={() =>
                  item.hasDropdown && handleDropdownHover(item.type as "games" | "books", true)
                }
                onMouseLeave={() =>
                  item.hasDropdown && handleDropdownHover(item.type as "games" | "books", false)
                }
              >
                <Link
                  href={item.href}
                  onClick={closeAll}
                  className="relative flex items-center gap-1 py-1 text-[16px] text-[#0B3F44] transition-colors duration-200 after:absolute after:bottom-[-2px] after:left-1/2 after:h-[2px] after:w-full after:origin-center after:-translate-x-1/2 after:scale-x-0 after:rounded-full after:bg-brand-teal after:transition-transform after:duration-300 after:content-[''] hover:text-brand-teal hover:after:scale-x-100"
                >
                  {item.name}
                  {item.hasDropdown && (
                    <FiChevronDown
                      className={`text-sm transition-transform ${
                        (item.type === "games" && gamesDropdownOpen) ||
                        (item.type === "books" && booksDropdownOpen)
                          ? "rotate-180"
                          : ""
                      }`}
                    />
                  )}
                </Link>

                {/* Desktop Dropdowns */}
                {item.type === "games" && gamesDropdownOpen && (
                  <div
                    ref={gamesDropdownRef}
                    className="absolute left-0 top-full z-50 mt-2 w-80 overflow-hidden rounded-lg border border-slate-200 bg-white shadow-xl"
                  >
                    <div className="p-4">
                      <h3 className="mb-2 font-semibold text-slate-800">Our Games</h3>
                      <div className="space-y-3">
                        {games.map((game) => (
                          <Link
                            key={game.id}
                            href={`/games/${generateSlug(game.title)}`}
                            className="flex gap-3 rounded-md p-2 transition-colors hover:bg-slate-50"
                            onClick={closeAll}
                          >
                            <div className="relative h-16 w-16 flex-shrink-0">
                              <Image
                                src={game.imageUrl}
                                alt={game.title}
                                fill
                                className="rounded-md object-cover"
                              />
                            </div>
                            <div>
                              <h4 className="font-medium text-slate-800">{game.title}</h4>
                              <p className="line-clamp-1 text-sm text-slate-500">
                                {game.description}
                              </p>
                              <div className="mt-1 flex items-center">
                                <span className="rounded-full bg-brand-teal/10 px-2 py-0.5 text-xs text-brand-teal">
                                  {game.rating} ★
                                </span>
                                <span className="ml-2 text-xs text-slate-500">
                                  {game.players} players
                                </span>
                              </div>
                            </div>
                          </Link>
                        ))}
                      </div>
                      <Link
                        href="/games"
                        className="mt-3 block border-t border-slate-100 py-2 text-center font-medium text-brand-teal hover:text-brand-tealDark"
                        onClick={closeAll}
                      >
                        View All Games
                      </Link>
                    </div>
                  </div>
                )}

                {item.type === "books" && booksDropdownOpen && (
                  <div
                    ref={booksDropdownRef}
                    className="absolute left-0 top-full z-50 mt-2 w-80 overflow-hidden rounded-lg border border-slate-200 bg-white shadow-xl"
                  >
                    <div className="p-4">
                      <h3 className="mb-2 font-semibold text-slate-800">Our Books</h3>
                      <div className="space-y-3">
                        {books.map((book) => (
                          <Link
                            key={book.id}
                            href={`/books/${generateSlug(book.title)}`}
                            className="flex gap-3 rounded-md p-2 transition-colors hover:bg-slate-50"
                            onClick={closeAll}
                          >
                            <div className="relative h-16 w-16 flex-shrink-0">
                              <Image
                                src={book.imageUrl}
                                alt={book.title}
                                fill
                                className="rounded-md object-cover"
                              />
                            </div>
                            <div>
                              <h4 className="font-medium text-slate-800">{book.title}</h4>
                              <p className="line-clamp-1 text-sm text-slate-500">
                                {book.description}
                              </p>
                              <div className="mt-1 flex items-center">
                                <span className="rounded-full bg-brand-teal/10 px-2 py-0.5 text-xs text-brand-teal">
                                  {book.rating} ★
                                </span>
                                <span className="ml-2 text-xs text-slate-500">
                                  by {book.author}
                                </span>
                              </div>
                            </div>
                          </Link>
                        ))}
                      </div>
                      <Link
                        href="/books"
                        className="mt-3 block border-t border-slate-100 py-2 text-center font-medium text-brand-teal hover:text-brand-tealDark"
                        onClick={closeAll}
                      >
                        View All Books
                      </Link>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </nav>

          {/* Right actions (desktop) */}
          <div className="hidden items-center gap-5 text-slate-700 md:flex">
            <Link
              href="/login"
              className="relative py-1 text-[16px] text-[#0B3F44] transition-colors duration-200 after:absolute after:bottom-[-2px] after:left-1/2 after:h-[2px] after:w-full after:origin-center after:-translate-x-1/2 after:scale-x-0 after:rounded-full after:bg-brand-teal after:transition-transform after:duration-300 after:content-[''] hover:text-brand-teal hover:after:scale-x-100"
            >
              <span>Login</span>
            </Link>
            <Link
              href="/search"
              aria-label="Search"
              className="text-brand-teal hover:text-brand-tealDark"
            >
              <FiSearch />
            </Link>
            <Link
              href="/cart"
              aria-label="Cart"
              className="text-brand-teal hover:text-brand-tealDark"
            >
              <FiShoppingCart />
            </Link>
          </div>

          {/* Mobile toggle */}
          <button
            onClick={() => setOpen((s) => !s)}
            className="ml-2 p-2 text-2xl md:hidden"
            aria-label="Toggle menu"
          >
            {open ? <FiX /> : <FiMenu />}
          </button>
        </div>
      </div>

      {/* ================= Mobile Nav ================= */}
      {open && (
        <div className="border-t border-slate-200 bg-white md:hidden">
          <div className="flex flex-col gap-4 px-4 py-4">
            {/* Simple links */}
            <Link
              href="/"
              onClick={closeAll}
              className="relative block py-1 after:absolute after:bottom-[-2px] after:left-0 after:h-[2px] after:w-0 after:bg-brand-tealDark after:transition-all after:duration-300 after:content-[''] hover:text-brand-tealDark hover:after:w-full"
            >
              Home
            </Link>

            {/* Games Accordion (mobile only) */}
            <div className="flex flex-col">
              <button
                onClick={() => setGamesDropdownOpen((v) => !v)}
                className="flex w-full items-center justify-between py-1 text-left hover:text-brand-tealDark"
                aria-expanded={gamesDropdownOpen}
                aria-controls="mobile-games-panel"
              >
                <span>Games</span>
                <FiChevronDown
                  className={`transition-transform ${gamesDropdownOpen ? "rotate-180" : ""}`}
                />
              </button>

              {gamesDropdownOpen && (
                <div
                  id="mobile-games-panel"
                  className="ml-2 mt-2 space-y-3 border-l border-slate-200 pl-4"
                >
                  {games.map((g) => {
                    const href = `/games/${generateSlug(g.title)}`;
                    return (
                      <Link
                        key={g.id}
                        href={href}
                        prefetch={false}
                        onClick={(e) => {
                          // keep dropdown/menu open, just navigate
                          e.stopPropagation();
                          goto(href);
                        }}
                        className="block py-2 text-slate-600 hover:text-brand-tealDark"
                      >
                        {g.title}
                      </Link>
                    );
                  })}
                  <Link
                    href="/games"
                    prefetch={false}
                    onClick={(e) => {
                      e.stopPropagation();
                      goto("/games");
                    }}
                    className="block py-2 font-medium text-brand-teal hover:text-brand-tealDark"
                  >
                    View All Games
                  </Link>
                </div>
              )}
            </div>

            {/* Books Accordion (mobile only) */}
            <div className="flex flex-col">
              <button
                onClick={() => setBooksDropdownOpen((v) => !v)}
                className="flex w-full items-center justify-between py-1 text-left hover:text-brand-tealDark"
                aria-expanded={booksDropdownOpen}
                aria-controls="mobile-books-panel"
              >
                <span>Books</span>
                <FiChevronDown
                  className={`transition-transform ${booksDropdownOpen ? "rotate-180" : ""}`}
                />
              </button>

              {booksDropdownOpen && (
                <div
                  id="mobile-books-panel"
                  className="ml-2 mt-2 space-y-3 border-l border-slate-200 pl-4"
                >
                  {books.map((b) => {
                    const href = `/books/${generateSlug(b.title)}`;
                    return (
                      <Link
                        key={b.id}
                        href={href}
                        prefetch={false}
                        onClick={(e) => {
                          e.stopPropagation();
                          goto(href);
                        }}
                        className="block py-2 text-slate-600 hover:text-brand-tealDark"
                      >
                        {b.title}
                      </Link>
                    );
                  })}
                  <Link
                    href="/books"
                    prefetch={false}
                    onClick={(e) => {
                      e.stopPropagation();
                      goto("/books");
                    }}
                    className="block py-2 font-medium text-brand-teal hover:text-brand-tealDark"
                  >
                    View All Books
                  </Link>
                </div>
              )}
            </div>

            {/* Rest simple links */}
            <Link
              href="/products"
              onClick={closeAll}
              className="relative block py-1 after:absolute after:bottom-[-2px] after:left-0 after:h-[2px] after:w-0 after:bg-brand-tealDark after:transition-all after:duration-300 after:content-[''] hover:text-brand-tealDark hover:after:w-full"
            >
              Products
            </Link>
            <Link
              href="/about"
              onClick={closeAll}
              className="relative block py-1 after:absolute after:bottom-[-2px] after:left-0 after:h-[2px] after:w-0 after:bg-brand-tealDark after:transition-all after:duration-300 after:content-[''] hover:text-brand-tealDark hover:after:w-full"
            >
              About Us
            </Link>

            {/* Actions */}
            <div className="flex items-center gap-5 pt-2 text-slate-700">
              <Link
                href="/login"
                className="flex items-center gap-2 hover:text-brand-tealDark"
                onClick={closeAll}
              >
                <FiLogIn /> <span>Login</span>
              </Link>
              <Link
                href="/search"
                aria-label="Search"
                className="hover:text-brand-tealDark"
                onClick={closeAll}
              >
                <FiSearch />
              </Link>
              <Link
                href="/cart"
                aria-label="Cart"
                className="hover:text-brand-tealDark"
                onClick={closeAll}
              >
                <FiShoppingCart />
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}

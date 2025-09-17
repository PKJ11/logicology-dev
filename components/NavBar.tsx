"use client";

import Link from "next/link";
import { useState, useRef, useEffect } from "react";
import { FiMenu, FiX, FiShoppingCart, FiSearch, FiLogIn, FiChevronDown } from "react-icons/fi";
import Image from "next/image";

// Game data
const games: Game[] = [
  {
    id: 1,
    title: "PrimeTime",
    imageUrl:
      "https://ik.imagekit.io/pratik2002/primetime_imag1.png?updatedAt=1757032084370",
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

// Book data
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

// Type definitions
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

const navItems = [
  { name: "Home", href: "/" },
  { name: "Games", href: "/games", hasDropdown: true, type: "games" },
  { name: "Books", href: "/books", hasDropdown: true, type: "books" },
  { name: "Subscriptions", href: "/subscriptions" },
  { name: "About Us", href: "/about" },
];

export default function NavBar() {
  const [open, setOpen] = useState(false);
  const [gamesDropdownOpen, setGamesDropdownOpen] = useState(false);
  const [booksDropdownOpen, setBooksDropdownOpen] = useState(false);
  const gamesDropdownRef = useRef<HTMLDivElement>(null);
  const booksDropdownRef = useRef<HTMLDivElement>(null);
  const gamesTriggerRef = useRef<HTMLDivElement>(null);
  const booksTriggerRef = useRef<HTMLDivElement>(null);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      // Games dropdown
      if (gamesDropdownRef.current && !gamesDropdownRef.current.contains(event.target as Node) &&
          gamesTriggerRef.current && !gamesTriggerRef.current.contains(event.target as Node)) {
        setGamesDropdownOpen(false);
      }
      
      // Books dropdown
      if (booksDropdownRef.current && !booksDropdownRef.current.contains(event.target as Node) &&
          booksTriggerRef.current && !booksTriggerRef.current.contains(event.target as Node)) {
        setBooksDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Function to generate slug from title
  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/\s+/g, '-')
      .replace(/[^\w\-]+/g, '')
      .replace(/\-\-+/g, '-')
      .replace(/^-+/, '')
      .replace(/-+$/, '');
  };

  // Handle dropdown hover
  const handleDropdownHover = (type: string, isOpen: boolean) => {
    if (type === "games") {
      setGamesDropdownOpen(isOpen);
      if (isOpen) setBooksDropdownOpen(false);
    } else if (type === "books") {
      setBooksDropdownOpen(isOpen);
      if (isOpen) setGamesDropdownOpen(false);
    }
  };

  return (
    <header className="sticky top-0 z-50 bg-white/80 backdrop-blur border-b border-slate-200">
      <div className="lg:max-w-[75vw] lg:mx-auto md:max-w-[75vw] md:mx-auto px-4 lg:px-8 ">
        <div className="flex justify-between py-3">
          {/* LEFT CLUSTER: Logo + Nav */}
          <div className="flex ">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2">
              <div className="w-[150px] h-auto relative">
                <Image
                  src="https://ik.imagekit.io/pratik2002/logicology-logo_74-P-ICfG?updatedAt=1756257433107"
                  alt="Logicology Logo"
                  width={150}
                  height={60}
                  className="object-contain"
                />
              </div>
            </Link>  
          </div>
          
          <div className="py-3">
            {/* Nav Items */}
            <nav className="hidden md:flex items-center gap-6 text-sm text-slate-700 font-heading">
              {navItems.map((item) => (
                <div
                  key={item.name}
                  className="relative"
                  ref={item.type === "games" ? gamesTriggerRef : item.type === "books" ? booksTriggerRef : null}
                  onMouseEnter={() => item.hasDropdown && handleDropdownHover(item.type, true)}
                  onMouseLeave={() => item.hasDropdown && setTimeout(() => handleDropdownHover(item.type, false), 100)}
                >
                  <Link
                    href={item.href}
                    onClick={() => {
                      setOpen(false);
                      setGamesDropdownOpen(false);
                      setBooksDropdownOpen(false);
                    }}
                    className="py-1 text-[16px] text-[#0B3F44] relative transition-colors duration-200 hover:text-brand-teal
                      after:content-[''] after:absolute after:left-1/2 after:-translate-x-1/2 after:bottom-[-2px]
                      after:h-[2px] after:w-full after:bg-brand-teal after:rounded-full
                      after:origin-center after:scale-x-0 after:transition-transform after:duration-300
                      hover:after:scale-x-100 flex items-center gap-1"
                  >
                    {item.name}
                    {item.hasDropdown && (
                      <FiChevronDown className={`text-sm transition-transform ${
                        (item.type === "games" && gamesDropdownOpen) || 
                        (item.type === "books" && booksDropdownOpen) ? 'rotate-180' : ''
                      }`} />
                    )}
                  </Link>
                  
                  {/* Invisible spacer to prevent gap between nav item and dropdown */}
                  {item.hasDropdown && (
                    <div className="absolute left-0 w-full h-4 bg-transparent" />
                  )}
                  
                  {/* Games Dropdown */}
                  {item.type === "games" && gamesDropdownOpen && (
                    <div 
                      ref={gamesDropdownRef}
                      className="absolute top-full left-0 mt-2 w-80 bg-white rounded-lg shadow-xl border border-slate-200 overflow-hidden z-50"
                      onMouseEnter={() => setGamesDropdownOpen(true)}
                      onMouseLeave={() => setTimeout(() => setGamesDropdownOpen(false), 100)}
                    >
                      <div className="p-4">
                        <h3 className="font-semibold text-slate-800 mb-2">Our Games</h3>
                        <div className="space-y-3">
                          {games.map((game) => (
                            <Link
                              key={game.id}
                              href={`/games/${generateSlug(game.title)}`}
                              className="flex gap-3 p-2 rounded-md hover:bg-slate-50 transition-colors"
                              onClick={() => setGamesDropdownOpen(false)}
                            >
                              <div className="w-16 h-16 relative flex-shrink-0">
                                <Image
                                  src={game.imageUrl}
                                  alt={game.title}
                                  fill
                                  className="object-cover rounded-md"
                                />
                              </div>
                              <div>
                                <h4 className="font-medium text-slate-800">{game.title}</h4>
                                <p className="text-sm text-slate-500 line-clamp-1">{game.description}</p>
                                <div className="flex items-center mt-1">
                                  <span className="text-xs bg-brand-teal/10 text-brand-teal px-2 py-0.5 rounded-full">
                                    {game.rating} ★
                                  </span>
                                  <span className="text-xs text-slate-500 ml-2">
                                    {game.players} players
                                  </span>
                                </div>
                              </div>
                            </Link>
                          ))}
                        </div>
                        <Link
                          href="/games"
                          className="block mt-3 text-center text-brand-teal hover:text-brand-tealDark font-medium py-2 border-t border-slate-100"
                          onClick={() => setGamesDropdownOpen(false)}
                        >
                          View All Games
                        </Link>
                      </div>
                    </div>
                  )}
                  
                  {/* Books Dropdown */}
                  {item.type === "books" && booksDropdownOpen && (
                    <div 
                      ref={booksDropdownRef}
                      className="absolute top-full left-0 mt-2 w-80 bg-white rounded-lg shadow-xl border border-slate-200 overflow-hidden z-50"
                      onMouseEnter={() => setBooksDropdownOpen(true)}
                      onMouseLeave={() => setTimeout(() => setBooksDropdownOpen(false), 100)}
                    >
                      <div className="p-4">
                        <h3 className="font-semibold text-slate-800 mb-2">Our Books</h3>
                        <div className="space-y-3">
                          {books.map((book) => (
                            <Link
                              key={book.id}
                              href={`/books/${generateSlug(book.title)}`}
                              className="flex gap-3 p-2 rounded-md hover:bg-slate-50 transition-colors"
                              onClick={() => setBooksDropdownOpen(false)}
                            >
                              <div className="w-16 h-16 relative flex-shrink-0">
                                <Image
                                  src={book.imageUrl}
                                  alt={book.title}
                                  fill
                                  className="object-cover rounded-md"
                                />
                              </div>
                              <div>
                                <h4 className="font-medium text-slate-800">{book.title}</h4>
                                <p className="text-sm text-slate-500 line-clamp-1">{book.description}</p>
                                <div className="flex items-center mt-1">
                                  <span className="text-xs bg-brand-teal/10 text-brand-teal px-2 py-0.5 rounded-full">
                                    {book.rating} ★
                                  </span>
                                  <span className="text-xs text-slate-500 ml-2">
                                    by {book.author}
                                  </span>
                                </div>
                              </div>
                            </Link>
                          ))}
                        </div>
                        <Link
                          href="/books"
                          className="block mt-3 text-center text-brand-teal hover:text-brand-tealDark font-medium py-2 border-t border-slate-100"
                          onClick={() => setBooksDropdownOpen(false)}
                        >
                          View All Books
                        </Link>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </nav>
          </div>

          {/* RIGHT CLUSTER: Actions */}
          <div className="hidden md:flex items-center gap-5 text-slate-700">
            <Link
              href="/login"
              className="text-[16px] text-[#0B3F44] py-1 relative transition-colors duration-200 hover:text-brand-teal
             after:content-[''] after:absolute after:left-1/2 after:-translate-x-1/2 after:bottom-[-2px]
             after:h-[2px] after:w-full after:bg-brand-teal after:rounded-full
             after:origin-center after:scale-x-0 after:transition-transform after:duration-300
             hover:after:scale-x-100"
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
            className="md:hidden text-2xl p-2 ml-2"
            aria-label="Toggle menu"
          >
            {open ? <FiX /> : <FiMenu />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="md:hidden border-t border-slate-200 bg-white">
          <div className="container-padding py-4 flex flex-col gap-4">
            {navItems.map((item) => (
              <div key={item.name}>
                {item.hasDropdown ? (
                  <div className="flex flex-col">
                    <button 
                      onClick={() => {
                        if (item.type === "games") {
                          setGamesDropdownOpen(!gamesDropdownOpen);
                          setBooksDropdownOpen(false);
                        } else if (item.type === "books") {
                          setBooksDropdownOpen(!booksDropdownOpen);
                          setGamesDropdownOpen(false);
                        }
                      }}
                      className="py-1 relative hover:text-brand-tealDark flex items-center justify-between"
                    >
                      <span>{item.name}</span>
                      <FiChevronDown className={`transition-transform ${
                        (item.type === "games" && gamesDropdownOpen) || 
                        (item.type === "books" && booksDropdownOpen) ? 'rotate-180' : ''
                      }`} />
                    </button>
                    
                    {((item.type === "games" && gamesDropdownOpen) || (item.type === "books" && booksDropdownOpen)) && (
                      <div className="pl-4 mt-2 space-y-3 border-l border-slate-200 ml-2">
                        {(item.type === "games" ? games : books).map((product) => (
                          <Link
                            key={product.id}
                            href={`/${item.type}/${generateSlug(product.title)}`}
                            className="block py-2 text-slate-600 hover:text-brand-tealDark"
                            onClick={() => {
                              setOpen(false);
                              setGamesDropdownOpen(false);
                              setBooksDropdownOpen(false);
                            }}
                          >
                            {product.title}
                          </Link>
                        ))}
                        <Link
                          href={item.href}
                          className="block py-2 text-brand-teal hover:text-brand-tealDark font-medium"
                          onClick={() => {
                            setOpen(false);
                            setGamesDropdownOpen(false);
                            setBooksDropdownOpen(false);
                          }}
                        >
                          View All {item.type === "games" ? "Games" : "Books"}
                        </Link>
                      </div>
                    )}
                  </div>
                ) : (
                  <Link
                    href={item.href}
                    onClick={() => {
                      setOpen(false);
                      setGamesDropdownOpen(false);
                      setBooksDropdownOpen(false);
                    }}
                    className="py-1 relative hover:text-brand-tealDark
                               after:content-[''] after:absolute after:left-0 after:bottom-[-2px]
                               after:h-[2px] after:w-0 after:bg-brand-tealDark
                               after:transition-all after:duration-300 hover:after:w-full"
                  >
                    {item.name}
                  </Link>
                )}
              </div>
            ))}

            <div className="flex items-center gap-5 pt-2 text-slate-700">
              <Link
                href="/login"
                className="hover:text-brand-tealDark flex items-center gap-2"
              >
                <FiLogIn /> <span>Login</span>
              </Link>
              <Link
                href="/search"
                aria-label="Search"
                className="hover:text-brand-tealDark"
              >
                <FiSearch />
              </Link>
              <Link
                href="/cart"
                aria-label="Cart"
                className="hover:text-brand-tealDark"
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
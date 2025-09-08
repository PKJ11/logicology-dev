"use client";

import Link from "next/link";
import { useState } from "react";
import { FiMenu, FiX, FiShoppingCart, FiSearch, FiLogIn } from "react-icons/fi";
import Image from "next/image";

const navItems = [
  { name: "Home", href: "/" },
  { name: "Games", href: "/games" },
  { name: "Books", href: "/books" },
  { name: "Subscriptions", href: "/subscriptions" },
  { name: "About Us", href: "/about" },
];

export default function NavBar() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-white/80 backdrop-blur border-b border-slate-200">
      <div className="lg:max-w-[80vw] lg:mx-auto md:max-w-[80vw] md:mx-auto px-4">
        <div className="flex items-center py-3">
          {/* LEFT CLUSTER: Logo + Nav */}
          <div className="flex items-center gap-6 flex-1">
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

            {/* Nav Items */}
            <nav className="hidden md:flex items-center gap-6 text-sm text-slate-700 font-heading">
              {navItems.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className="relative hover:text-brand-tealDark transition-colors duration-200
                         after:content-[''] after:absolute after:left-0 after:bottom-[-2px]
                         after:h-[2px] after:w-0 after:bg-brand-teal
                         after:transition-all after:duration-300 hover:after:w-full font-heading"
                >
                  {item.name}
                </Link>
              ))}
            </nav>
          </div>

          {/* RIGHT CLUSTER: Actions */}
          <div className="hidden md:flex items-center gap-5 text-slate-700">
            <Link
              href="/login"
              className="hover:text-brand-tealDark flex items-center gap-1 font-heading"
            >
              <span>Login</span>
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
              <Link
                key={item.name}
                href={item.href}
                onClick={() => setOpen(false)}
                className="py-1 relative hover:text-brand-tealDark
                           after:content-[''] after:absolute after:left-0 after:bottom-[-2px]
                           after:h-[2px] after:w-0 after:bg-brand-tealDark
                           after:transition-all after:duration-300 hover:after:w-full"
              >
                {item.name}
              </Link>
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

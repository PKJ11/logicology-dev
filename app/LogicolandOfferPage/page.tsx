"use client";

import React, { useState, useCallback, useEffect, useRef } from "react";
import type { FC, ReactNode, SVGProps } from "react";
import toast from "react-hot-toast";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";
import Link from "next/link";
import Head from "next/head";
import MediaLayoutRight from "@/components/MediaLayoutRight";
import { useCart } from "@/components/CartContext";
import BuySection from "@/components/BuySection";
import { motion, useInView } from "framer-motion";
import HeroCheckoutModal, { HeroProductConfig } from "@/components/HeroCheckoutModal";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

/* =========================================================================
   LOGICOLAND × SWANIL FOUNDATION — Exclusive Offer Landing Page
   Next.js (App Router) + TypeScript, single-file, component-wise.
   Drop this in app/logicoland-offer/page.tsx (or any route folder).
   ========================================================================= */

/* ---------------------------------------------------------------------- */
/*  Types                                                                  */
/* ---------------------------------------------------------------------- */

interface BenefitItem {
  icon: ReactNode;
  title: string;
  body: string;
}

interface StepItem {
  num: number;
  title: string;
  body: string;
}

interface PriceCardProps {
  title: string;
  price: string;
  wasPrice: string;
  description: string;
  ctaLabel: string;
  ctaHref: string;
  featured?: boolean;
}

/* ---------------------------------------------------------------------- */
/*  Icons (inline SVG, no external icon package required)                 */
/* ---------------------------------------------------------------------- */

const IconBase: FC<SVGProps<SVGSVGElement>> = (props) => (
  <svg
    width={24}
    height={24}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={2.2}
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  />
);

const IconBrain: FC = () => (
  <IconBase>
    <path d="M12 3a4 4 0 0 0-4 4c-2 .5-3.5 2-3.5 4A3.5 3.5 0 0 0 8 14.5V19a2 2 0 0 0 4 0V7a4 4 0 0 1 4-4 4 4 0 0 1 4 4c0 2-1.5 3.5-3.5 4" />
    <path d="M16 14.5V19a2 2 0 0 1-2 2" />
  </IconBase>
);

const IconNoScreen: FC = () => (
  <IconBase>
    <rect x={3} y={5} width={18} height={13} rx={2} />
    <line x1={2} y1={2} x2={22} y2={22} />
    <line x1={9} y1={21} x2={15} y2={21} />
  </IconBase>
);

const IconTrophy: FC = () => (
  <IconBase>
    <path d="M8 21h8" />
    <path d="M12 17v4" />
    <path d="M7 4h10v6a5 5 0 0 1-10 0V4z" />
    <path d="M7 6H4a2 2 0 0 0 2 5" />
    <path d="M17 6h3a2 2 0 0 1-2 5" />
  </IconBase>
);

const IconSteps: FC = () => (
  <IconBase>
    <path d="M4 20h4v-4h4v-4h4V8h4" />
    <path d="M4 20V10" />
  </IconBase>
);

/* ---------------------------------------------------------------------- */
/*  Static content (kept as data so components stay presentational)       */
/* ---------------------------------------------------------------------- */

const BENEFITS: BenefitItem[] = [
  {
    icon: <IconBrain />,
    title: "Sharpens logical thinking",
    body: "Puzzles that build reasoning step by step, not rote answers.",
  },
  {
    icon: <IconNoScreen />,
    title: "Screen-free focus",
    body: "Hands-on activity that holds attention without a device.",
  },
  {
    icon: <IconTrophy />,
    title: "Grows confidence & patience",
    body: "The quiet satisfaction of cracking a tricky problem.",
  },
  {
    icon: <IconSteps />,
    title: "Graded difficulty",
    body: "Five books that move from easy to challenging, so your child is always at the right level.",
  },
];

const STEPS: StepItem[] = [
  { num: 1, title: "Choose", body: "Pick your book or the full set of 5." },
  { num: 2, title: "Apply the code", body: "Enter LOGIC40SWANIL at checkout." },
  { num: 3, title: "Done!", body: "Your Swanil Foundation price is applied." },
];

const COUPON_CODE = "LOGIC40SWANIL";
const OFFER_DEADLINE = "10th July";

/* ---------------------------------------------------------------------- */
/*  Layout primitives                                                      */
/* ---------------------------------------------------------------------- */

const DeadlineStrip: FC = () => (
  <div className="deadline-strip">
    <span className="dot" aria-hidden="true" />
    <span>
      Up to 40% off for Swanil Foundation families — valid only till{" "}
      <strong>{OFFER_DEADLINE}</strong>
    </span>
  </div>
);

const SiteHeader: FC = () => (
  <header className="site-header">
    <img src="/logicology-logo.svg" alt="Logicology" />
    <a href="#pricing" className="btn btn-primary btn-md">
      Grab the Offer
    </a>
  </header>
);

/* ---------------------------------------------------------------------- */
/*  Hero                                                                    */
/* ---------------------------------------------------------------------- */

const Hero: FC = () => (
  <section className="hero">
    <div className="container hero-grid">
      <div className="hero-copy">
        <span className="hero-badge">
          EXCLUSIVE FOR SWANIL FOUNDATION MEMBERS
        </span>
        <h1>
          Build Your Child&apos;s Logical Thinking —{" "}
          <span className="accent">One Puzzle at a Time</span>
        </h1>
        <p className="sub">
          Logicoland is a 5-book series that turns problem-solving into play.
          Screen-free, hands-on, and made for curious young minds.
        </p>
        <p className="offer-flash">
          Up to 40% off — this week only, for Swanil Foundation families.
        </p>
        <div className="hero-ctas">
          <a href="#pricing" className="btn btn-primary btn-lg">
            Grab the Offer
          </a>
        </div>
      </div>
      <div className="hero-visual">
        <div className="img-placeholder">Photo of the 5 Logicoland books</div>
        {/* <img src="/assets/logicoland-books.jpg" alt="The 5-book Logicoland series" /> */}
      </div>
    </div>
  </section>
);

/* ---------------------------------------------------------------------- */
/*  About / What is Logicoland                                             */
/* ---------------------------------------------------------------------- */

const AboutSection: FC = () => (
  <section className="section about" id="books">
    <div className="about-inner">
      <div className="eyebrow">What is Logicoland</div>
      <h2>Play That Makes Them Think</h2>
      <p>
        Logicoland is a carefully graded series of activity books from
        Logicology, designed to grow your child&apos;s reasoning, patience,
        and problem-solving — all through the joy of solving puzzles. Every
        page invites your child to observe, think, and figure it out for
        themselves.
      </p>
      <p className="strong-line">
        No apps. No screens. Just a pencil, a book, and a mind that&apos;s
        genuinely engaged.
      </p>
      <p className="belief">Our belief is simple: Learn to Play, Play to Learn.</p>
    </div>
  </section>
);

const LOGICOLAND_SET: HeroProductConfig = {
  name: "Logicoland Set (All Volumes)",
  price: "₹999",
  initialprice: undefined,
  razorpayItemId: "item_SSxJhDUqb7HTiy",
  description: "Every volume in one box — the complete thinking skills collection.",
  image: "https://ik.imagekit.io/pratik11/LOGICOLAND-HERO-IMAGE.png?updatedAt=1781163914607",
  rating: 5,
  specialOffer: "",
  category: "set",
};

type VolumeProduct = HeroProductConfig & {
  displayName: string;
  volumeNumber: number;
  bundleRazorpayItemId: string;
  bundleImage: string;
};

const VOLUMES: VolumeProduct[] = [
  {
    name: "Logicoland - Volume 1",
    displayName: "Volume 1",
    volumeNumber: 1,
    price: "₹249",
    initialprice: "₹299",
    razorpayItemId: "item_S4UBymXQ91Vmk4",
    bundleRazorpayItemId: "item_RVa7Osutc07pfB",
    description: "Logicoland Volume 1",
    image: "https://ik.imagekit.io/pratik11/VERTICAL%20BOOK%20COVER%20MOCKUP%20VOLUNE%201.png",
    bundleImage: "https://ik.imagekit.io/pratik2002/logicolandv2_4oprmp0lO?updatedAt=1756947338913",
    rating: 5,
    specialOffer: "",
    category: "books",
  },
  {
    name: "Logicoland - Volume 2",
    displayName: "Volume 2",
    volumeNumber: 2,
    price: "₹249",
    initialprice: "₹299",
    razorpayItemId: "item_RNn0h9rGIq8zOL",
    bundleRazorpayItemId: "item_S4UDQe8qCtOp21",
    description: "Logicoland Volume 2",
    image: "https://ik.imagekit.io/pratik11/VERTICAL%20BOOK%20COVER%20MOCKUP%20VOLUNE%202.png",
    bundleImage:
      "https://ik.imagekit.io/pratik2002/VOLUMNE%202/LOGICOLAND%20SUDOKU%20VOLUMNE%202%20STACK%20COVER%20MOCKUP.png?updatedAt=1773906051069",
    rating: 5,
    specialOffer: "",
    category: "books",
  },
  {
    name: "Logicoland - Volume 3",
    displayName: "Volume 3",
    volumeNumber: 3,
    price: "₹249",
    initialprice: "₹299",
    razorpayItemId: "item_SSxGzOM6REipuz",
    bundleRazorpayItemId: "item_ST2GJDox7LUaVH",
    description: "Logicoland Volume 3",
    image: "https://ik.imagekit.io/pratik11/VERTICAL%20BOOK%20COVER%20MOCKUP%20VOLUNE%203.png",
    bundleImage:
      "https://ik.imagekit.io/pratik2002/VOLUMNE%203/LOGICOLAND%20SUDOKU%20VOLUMNE%203%20STACK%20COVER%20MOCKUP.png?updatedAt=1773906081265",
    rating: 5,
    specialOffer: "",
    category: "books",
  },
  {
    name: "Logicoland - Volume 4",
    displayName: "Volume 4",
    volumeNumber: 4,
    price: "₹249",
    initialprice: "₹299",
    razorpayItemId: "item_SSxHO3cngCSldC",
    bundleRazorpayItemId: "item_ST2GnU6n3qjAEc",
    description: "Logicoland Volume 4",
    image: "https://ik.imagekit.io/pratik11/VERTICAL%20BOOK%20COVER%20MOCKUP%20VOLUNE%204.png",
    bundleImage:
      "https://ik.imagekit.io/pratik2002/VOLUMNE%204/LOGICOLAND%20SUDOKU%20VOLUMNE%204%20STACK%20COVER%20MOCKUP.png?updatedAt=1773906115914",
    rating: 5,
    specialOffer: "",
    category: "books",
  },
  {
    name: "Logicoland - Volume 5",
    displayName: "Volume 5",
    volumeNumber: 5,
    price: "₹249",
    initialprice: "₹299",
    razorpayItemId: "item_SSxHltEcqtYsJ1",
    bundleRazorpayItemId: "item_ST2HEofqR6OCm6",
    description: "Logicoland Volume 5",
    image: "https://ik.imagekit.io/pratik11/VERTICAL%20BOOK%20COVER%20MOCKUP%20VOLUNE%205.png",
    bundleImage:
      "https://ik.imagekit.io/pratik2002/VOLUMNE%205/LOGICOLAND%20SUDOKU%20VOLUMNE%205%20STACK%20COVER%20MOCKUP.png?updatedAt=1773906134668",
    rating: 5,
    specialOffer: "",
    category: "books",
  },
];

// ─────────────────────────────────────────────────────────────────
// Palette — mirrors PrimeTimeBuyBlock exactly
// ─────────────────────────────────────────────────────────────────
const GOLD = "#E45C48";
const TAG_COLOR = "#fbb041";
const TEXT_DARK = "#3d3b40";
const BUY_DEFAULT = "#fbb041";
const BUY_HOVER = "#fa9e15";
const CART_DEFAULT = "#E45C48";
const CART_HOVER = "#c94433";

// ─────────────────────────────────────────────────────────────────
// Shared button CSS
// ─────────────────────────────────────────────────────────────────
const llbStyles = `
  .llb-buy-btn {
    background-color: ${BUY_DEFAULT};
    color: ${TEXT_DARK};
    border: 2px solid transparent;
    transition: all 0.3s ease, transform 0.15s ease;
    box-shadow: 0 4px 16px rgba(251,176,65,0.35);
  }
  .llb-buy-btn:hover {
    background-color: ${BUY_HOVER};
    transform: scale(1.05);
    box-shadow: 0 6px 20px rgba(250,158,21,0.4);
  }
  .llb-buy-btn:active { transform: scale(0.95); }
 
  .llb-cart-btn {
    background-color: ${CART_DEFAULT};
    color: #fff;
    border: 2px solid transparent;
    transition: all 0.3s ease, transform 0.15s ease;
    box-shadow: 0 4px 16px rgba(228,92,72,0.30);
  }
  .llb-cart-btn:hover {
    background-color: ${CART_HOVER};
    transform: scale(1.05);
    box-shadow: 0 6px 20px rgba(201,68,51,0.38);
  }
  .llb-cart-btn:active { transform: scale(0.95); }
  .llb-cart-btn--added {
    background-color: ${CART_HOVER} !important;
    color: #fff !important;
  }
 
  .llb-bundle-btn {
    background-color: transparent;
    color: #0A8A80;
    border: 2px solid #0A8A80;
    transition: all 0.3s ease, transform 0.15s ease;
  }
  .llb-bundle-btn:hover {
    background-color: #0A8A80;
    color: #fff;
    transform: scale(1.03);
  }
  .llb-bundle-btn:active { transform: scale(0.97); }

  /* Swiper navigation arrows */
  .llb-swiper .swiper-button-next,
  .llb-swiper .swiper-button-prev {
    color: #3d3b40;
    background: #fbb041;
    backdrop-filter: blur(4px);
    width: 40px;
    height: 40px;
    border-radius: 50%;
    box-shadow: 0 2px 8px rgba(0,0,0,0.12);
  }

  .llb-swiper .swiper-button-next::after,
  .llb-swiper .swiper-button-prev::after {
    font-size: 14px;
    font-weight: 800;
  }

  .llb-swiper .swiper-button-next:hover,
  .llb-swiper .swiper-button-prev:hover {
    background: #fa9e15;
    box-shadow: 0 4px 16px rgba(0,0,0,0.18);
  }
    .llb-swiper .swiper-pagination {
    display: none;
  }
`;

// ─────────────────────────────────────────────────────────────────
// Volume Card
// ─────────────────────────────────────────────────────────────────
function VolumeCard({
  volume,
  index,
  onBuyNow,
  onBuyBundle,
}: {
  volume: VolumeProduct;
  index: number;
  onBuyNow: (p: HeroProductConfig) => void;
  onBuyBundle: (p: HeroProductConfig) => void;
}) {
  const { addToCart } = useCart();
  const [addedToCart, setAddedToCart] = useState(false);
  const [showBundle, setShowBundle] = useState(false);

  function handleAddToCart() {
    addToCart({
      name: volume.name,
      price: volume.price,
      initialprice: volume.initialprice,
      razorpayItemId: volume.razorpayItemId,
      description: volume.description,
      image: volume.image,
      rating: volume.rating ?? 5,
    });
    toast.success(`${volume.displayName} added to cart!`);
    setAddedToCart(true);
    setTimeout(() => setAddedToCart(false), 2000);
  }

  const bundleProduct: HeroProductConfig = {
    name: `Logicoland Volume ${volume.volumeNumber} Bundle - 20 Books`,
    price: "₹4,000",
    initialprice: undefined,
    razorpayItemId: volume.bundleRazorpayItemId,
    description: `Perfect return gift — 20 copies of Volume ${volume.volumeNumber} for just ₹4,000 (₹200/copy).`,
    image: volume.bundleImage,
    rating: 5,
    specialOffer: "",
    category: "bundles",
  };

  return (
    <motion.div
      className="group relative flex w-full flex-col overflow-hidden rounded-[32px] bg-white"
      style={{
        boxShadow: "0 2px 16px 0 rgba(11,63,68,0.08), 0 1px 3px 0 rgba(11,63,68,0.06)",
      }}
      initial={{ opacity: 0, y: 48 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.55, delay: index * 0.08, ease: [0.22, 1, 0.36, 1] }}
      whileHover={{
        y: -6,
        boxShadow: "0 20px 48px 0 rgba(11,63,68,0.18), 0 4px 12px 0 rgba(11,63,68,0.10)",
        transition: { duration: 0.25, ease: "easeOut" },
      }}
    >
      {/* Volume number badge */}

      {/* ── IMAGE ZONE ── */}
      <div
        className="relative overflow-hidden"
        style={{
          height: 260,
          border: "16px solid #e0e0e3",
          borderTopLeftRadius: "32px",
          borderTopRightRadius: "32px",
        }}
      >
        <img
          src={showBundle ? volume.bundleImage : volume.image}
          alt={volume.displayName}
          className="h-full w-full object-cover transition-all duration-700 group-hover:scale-[1.06]"
        />
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            background: "linear-gradient(to bottom, transparent 45%, rgba(255,255,255,0.18) 100%)",
          }}
        />
        {/* Tag pill */}
        <div
          className="absolute left-4 top-4 z-10 flex items-center rounded-full px-3.5 py-1.5 text-[11px] font-extrabold uppercase tracking-[0.08em] text-[#3d3b40] shadow-lg"
          style={{ backgroundColor: TAG_COLOR }}
        >
          {showBundle ? "Bundle ×20" : `Vol. ${volume.volumeNumber}`}
        </div>
      </div>

      {/* ── CONTENT ZONE ── */}
      <div className="flex flex-1 flex-col px-5 pb-5 pt-4">
        <h3
          className="font-heading text-[18px] font-extrabold leading-tight tracking-tight"
          style={{ color: TEXT_DARK }}
        >
          {volume.displayName}
        </h3>

        <p
          className="mt-1.5 line-clamp-2 font-sans text-[13.5px] leading-relaxed"
          style={{ color: TEXT_DARK, opacity: 0.65 }}
        >
          {volume.description}
        </p>

        {/* Stars */}
        <div className="mt-3 flex items-center gap-2">
          <div className="flex items-center gap-0.5">
            {Array.from({ length: 5 }).map((_, i) => (
              <svg key={i} className="h-3.5 w-3.5" viewBox="0 0 20 20" fill={GOLD}>
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
            ))}
          </div>
          <span className="font-sans text-xs" style={{ color: TEXT_DARK, opacity: 0.5 }}>
            5.0
          </span>
        </div>

        {/* Price + Bundle toggle */}
        <div className="mt-4 flex items-baseline justify-between gap-2">
          <div className="flex items-baseline gap-2">
            <span
              className="font-heading text-[26px] font-extrabold leading-none tracking-tight"
              style={{ color: TEXT_DARK }}
            >
              {showBundle ? "₹4,000" : volume.price}
            </span>
            {!showBundle && volume.initialprice && (
              <span
                className="font-sans text-sm line-through"
                style={{ color: TEXT_DARK, opacity: 0.35 }}
              >
                {volume.initialprice}
              </span>
            )}
            {showBundle && (
              <span className="font-sans text-[11px]" style={{ color: TEXT_DARK, opacity: 0.5 }}>
                / 20 books
              </span>
            )}
          </div>

          {/* Single / Bundle toggle */}
          <button
            onClick={() => setShowBundle((s) => !s)}
            className="rounded-full px-2.5 py-1 font-sans text-[10px] font-bold uppercase tracking-wide transition-all"
            style={{
              backgroundColor: showBundle ? "rgba(10,138,128,0.12)" : "rgba(251,176,65,0.18)",
              color: showBundle ? "#0A8A80" : "#7a5c00",
              border: showBundle
                ? "1px solid rgba(10,138,128,0.3)"
                : "1px solid rgba(251,176,65,0.4)",
            }}
          >
            {showBundle ? "→ Single" : "Bundle ×20"}
          </button>
        </div>

        <div className="min-h-[12px] flex-1" />

        {/* ── BUTTONS ── */}
        <div className="mt-4 flex flex-col gap-2.5">
          <button
            onClick={() => (showBundle ? onBuyBundle(bundleProduct) : onBuyNow(volume))}
            className="llb-buy-btn relative flex w-full items-center justify-center rounded-full py-3 text-[14px] font-extrabold"
          >
            <span className="relative flex items-center gap-2">
              {showBundle ? "Buy Bundle" : "Buy Now"}
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2.5}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </span>
          </button>

          {showBundle ? (
            <button
              onClick={() => alert("Enquiry submitted! We'll contact you shortly.")}
              className="llb-cart-btn flex w-full items-center justify-center gap-2 rounded-full py-3 text-[14px] font-extrabold"
            >
              Enquire for Big Deals
            </button>
          ) : (
            <button
              onClick={handleAddToCart}
              className={`llb-cart-btn flex w-full items-center justify-center gap-2 rounded-full py-3 text-[14px] font-extrabold ${addedToCart ? "llb-cart-btn--added" : ""}`}
            >
              {addedToCart ? (
                <>
                  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2.5}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                  Added to Cart!
                </>
              ) : (
                <>Add to Cart</>
              )}
            </button>
          )}
        </div>
      </div>
    </motion.div>
  );
}

// ─────────────────────────────────────────────────────────────────
// LogicolandBuyBlock — main section
// ─────────────────────────────────────────────────────────────────
function LogicolandBuyBlock() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });
  const { addToCart } = useCart();

  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [checkoutProduct, setCheckoutProduct] = useState<HeroProductConfig>(LOGICOLAND_SET);
  const [addedToCart, setAddedToCart] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  function handleBuyNow(p: HeroProductConfig = LOGICOLAND_SET) {
    setCheckoutProduct(p);
    setIsCheckoutOpen(true);
  }

  function handleAddToCart() {
    addToCart({
      name: LOGICOLAND_SET.name,
      price: LOGICOLAND_SET.price,
      initialprice: LOGICOLAND_SET.initialprice,
      razorpayItemId: LOGICOLAND_SET.razorpayItemId,
      description: LOGICOLAND_SET.description,
      image: LOGICOLAND_SET.image,
      rating: LOGICOLAND_SET.rating ?? 5,
    });
    toast.success("Logicoland Complete Set added to cart!");
    if (typeof window !== "undefined" && (window as any).fbq) {
      (window as any).fbq("track", "AddToCart", {
        content_name: LOGICOLAND_SET.name,
        value: 999,
        currency: "INR",
      });
    }
    setAddedToCart(true);
    setTimeout(() => setAddedToCart(false), 2000);
  }

  return (
    <>
      <style>{llbStyles}</style>

      <section id="buy" ref={ref} className="relative w-full overflow-hidden bg-brand-tealDark">
        <div className="relative px-4 py-20 md:mx-auto md:max-w-[82vw] lg:mx-auto lg:max-w-[82vw] lg:px-8">
          {/* ── Hero buy card — Complete Set ── */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            className="mx-auto mb-16 flex flex-col items-stretch rounded-[28px] bg-white md:flex-row lg:max-w-[70vw]"
            style={{ boxShadow: "0 8px 48px 0 rgba(0,0,0,0.18)" }}
          >
            {/* LEFT — image */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={isInView ? { opacity: 1, scale: 1 } : {}}
              transition={{ duration: 0.7, delay: 0.15 }}
              className="relative w-full flex-shrink-0 self-stretch md:w-[45%]"
              style={{
                border: "16px solid #e0e0e3",
                borderTopLeftRadius: "28px",
                borderBottomLeftRadius: isMobile ? "0px" : "28px",
                borderTopRightRadius: isMobile ? "28px" : "0px",
                borderBottomRightRadius: "0px",
                margin: "0px",
              }}
            >
              <img
                src={LOGICOLAND_SET.image}
                alt="Logicoland Complete Set"
                className="h-full w-full object-contain"
                style={{
                  borderTopLeftRadius: "14px",
                  borderBottomLeftRadius: "14px",
                }}
              />
            </motion.div>

            {/* RIGHT — Text + CTAs */}
            <div className="flex flex-1 flex-col p-8 sm:p-12">
              <motion.p
                initial={{ opacity: 0, y: 16 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="mb-2 font-sans text-xs font-bold uppercase tracking-[0.2em]"
                style={{ color: TEXT_DARK }}
              >
                Best Value · Complete Series
              </motion.p>

              <motion.h2
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: 0.25 }}
                className="headingstyle font-heading font-extrabold leading-tight"
                style={{ color: TEXT_DARK }}
              >
                Logicoland — All 5 Volumes
              </motion.h2>

              <motion.div
                initial={{ opacity: 0 }}
                animate={isInView ? { opacity: 1 } : {}}
                transition={{ duration: 0.5, delay: 0.3 }}
                className="mt-2 flex items-center gap-2"
              >
                <div className="flex gap-0.5">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <svg key={i} className="h-4 w-4" viewBox="0 0 20 20" fill={GOLD}>
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
                <span className="font-sans text-sm" style={{ color: TEXT_DARK, opacity: 0.45 }}>
                  4.8 · 150 reviews
                </span>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: 0.35 }}
                className="mt-4 flex items-baseline gap-3"
              >
                <span
                  className="font-heading text-[38px] font-extrabold leading-none"
                  style={{ color: TEXT_DARK }}
                >
                  ₹999
                </span>
                <span
                  className="rounded-full px-2.5 py-1 font-sans text-[11px] font-bold uppercase tracking-wide"
                  style={{ backgroundColor: TAG_COLOR, color: TEXT_DARK }}
                >
                  Best Value
                </span>
              </motion.div>

              <motion.p
                initial={{ opacity: 0 }}
                animate={isInView ? { opacity: 1 } : {}}
                transition={{ duration: 0.5, delay: 0.4 }}
                className="mt-1 font-sans text-xs"
                style={{ color: TEXT_DARK, opacity: 0.4 }}
              >
                All prices include GST &nbsp;·&nbsp; Detailed invoice sent after purchase
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.55, delay: 0.45 }}
                className="mt-6 flex flex-wrap gap-3"
              >
                <button
                  onClick={() => handleBuyNow()}
                  className="llb-buy-btn relative flex items-center justify-center overflow-hidden rounded-full px-8 py-3.5 text-[15px] font-extrabold"
                >
                  <span className="relative flex items-center gap-2">
                    Buy Now — ₹999
                    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2.5}
                        d="M9 5l7 7-7 7"
                      />
                    </svg>
                  </span>
                </button>

                <button
                  onClick={handleAddToCart}
                  className={`llb-cart-btn flex items-center gap-2 rounded-full px-8 py-3.5 text-[15px] font-extrabold ${addedToCart ? "llb-cart-btn--added" : ""}`}
                >
                  {addedToCart ? (
                    <>
                      <svg
                        className="h-4 w-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2.5}
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                      Added to Cart!
                    </>
                  ) : (
                    <>Add to Cart</>
                  )}
                </button>
              </motion.div>

              <motion.div
                initial={{ opacity: 0 }}
                animate={isInView ? { opacity: 1 } : {}}
                transition={{ duration: 0.5, delay: 0.55 }}
                className="mt-5 flex flex-wrap gap-2"
              >
                {[
                  { text: "All 5 volumes included" },
                  { text: "Ages 5–8" },
                  { text: "Logic & critical thinking" },
                  { text: "No prior knowledge needed" },
                ].map((b) => (
                  <span
                    key={b.text}
                    className="inline-flex items-center gap-1.5 rounded-full border px-3 py-1 font-sans text-[12px]"
                    style={{
                      borderColor: "rgba(10,138,128,0.25)",
                      color: TEXT_DARK,
                      opacity: 0.75,
                      backgroundColor: "rgba(10,138,128,0.04)",
                    }}
                  >
                    {b.text}
                  </span>
                ))}
              </motion.div>
            </div>
          </motion.div>

          {/* ── Individual Volumes heading ── */}
          <motion.div
            className="mb-8 text-center"
            initial={{ opacity: 0, y: 24 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 24 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <p className="mb-3 font-sans text-[25px] font-bold uppercase tracking-[0.2em] text-white">
              Or pick a volume
            </p>
            <h3 className="headingstyle font-heading font-extrabold text-white">
              Individual Volumes · ₹249 each
            </h3>
            <p className="mt-2 font-sans text-sm text-white/50">
              Each card has a <strong className="text-white/70">Bundle ×20</strong> toggle — flip it
              to order 20 copies at ₹4,000 (₹200/copy), perfect for classrooms and return gifts.
            </p>
          </motion.div>

          {/* ── Volume cards — Swiper with external nav buttons ── */}
          <div className="relative px-8">
            {/* Prev Button */}
            <button
              className="llb-swiper-prev absolute -left-4 top-1/2 z-10 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-brand-buttonYellowBefore shadow-lg transition hover:scale-110 hover:bg-brand-buttonYellowAfter hover:shadow-xl disabled:opacity-30"
              style={{ color: TEXT_DARK }}
            >
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2.5}
                  d="M15 19l-7-7 7-7"
                />
              </svg>
            </button>

            <Swiper
              modules={[Navigation, Pagination]}
              navigation={{
                prevEl: ".llb-swiper-prev",
                nextEl: ".llb-swiper-next",
              }}
              pagination={{ clickable: true }}
              spaceBetween={20}
              slidesPerView={1}
              breakpoints={{
                480: { slidesPerView: 2, spaceBetween: 16 },
                768: { slidesPerView: 3, spaceBetween: 20 },
                1024: { slidesPerView: 4, spaceBetween: 20 },
              }}
              className="llb-swiper w-full pb-10"
            >
              {VOLUMES.map((volume, i) => (
                <SwiperSlide key={volume.razorpayItemId} className="!h-auto py-2">
                  <VolumeCard
                    volume={volume}
                    index={i}
                    onBuyNow={handleBuyNow}
                    onBuyBundle={handleBuyNow}
                  />
                </SwiperSlide>
              ))}
            </Swiper>

            {/* Next Button */}
            <button
              className="llb-swiper-next absolute -right-4 top-1/2 z-10 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-brand-buttonYellowBefore shadow-lg transition hover:scale-110 hover:bg-brand-buttonYellowAfter hover:shadow-xl disabled:opacity-30"
              style={{ color: TEXT_DARK }}
            >
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2.5}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </button>
          </div>

          {/* ── Footer note ── */}
          <motion.p
            className="mt-12 text-center font-sans text-xs text-white/35"
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : { opacity: 0 }}
            transition={{ delay: 0.8, duration: 0.5 }}
          >
            All prices include GST &nbsp;·&nbsp; Free shipping on orders above ₹499 &nbsp;·&nbsp;
            Bulk pricing available on request
          </motion.p>
        </div>
      </section>

      <HeroCheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        product={checkoutProduct}
      />
    </>
  );
}

/* ---------------------------------------------------------------------- */
/*  Benefits grid                                                          */
/* ---------------------------------------------------------------------- */

const BenefitCard: FC<BenefitItem> = ({ icon, title, body }) => (
  <div className="benefit-card">
    <span className="icon">{icon}</span>
    <h3>{title}</h3>
    <p>{body}</p>
  </div>
);

const BenefitsSection: FC = () => (
  <section className="section benefits">
    <div className="container">
      <div className="section-head">
        <div className="eyebrow">Why parents love it</div>
        <h2>Why It Works</h2>
      </div>
      <div className="benefit-grid">
        {BENEFITS.map((b) => (
          <BenefitCard key={b.title} {...b} />
        ))}
      </div>
    </div>
  </section>
);

/* ---------------------------------------------------------------------- */
/*  Audience / Who it's for                                                 */
/* ---------------------------------------------------------------------- */

const AudienceSection: FC = () => (
  <section className="audience">
    <div className="audience-inner">
      <img src="/child-illustration.svg" alt="" aria-hidden="true" />
      <div>
        <h2>Made for Curious Minds</h2>
        <p>
          Perfect for children who love a good challenge — and for parents
          looking for a meaningful alternative to screen time. The series
          grows with your child, from first puzzles to genuinely satisfying
          brain-teasers.
        </p>
      </div>
    </div>
  </section>
);

/* ---------------------------------------------------------------------- */
/*  Pricing                                                                 */
/* ---------------------------------------------------------------------- */

const PriceCard: FC<PriceCardProps> = ({
  title,
  price,
  wasPrice,
  description,
  ctaLabel,
  ctaHref,
  featured = false,
}) => (
  <div className={`price-card${featured ? " featured" : ""}`}>
    {featured && <span className="best-value">BEST VALUE</span>}
    <div className="card-title">{title}</div>
    <div className="price-row">
      <span className="price">{price}</span>
      <span className="price-was">{wasPrice}</span>
    </div>
    <p>{description}</p>
    <div className="card-cta">
      <a
        href={ctaHref}
        className={`btn btn-lg btn-block ${
          featured ? "btn-primary" : "btn-outline"
        }`}
      >
        {ctaLabel}
      </a>
    </div>
  </div>
);

const PricingSection: FC = () => (
  <section className="section pricing" id="pricing">
    <div className="pricing-inner">
      <div className="section-head">
        <div className="eyebrow">The offer</div>
        <h2>Your Exclusive Swanil Foundation Pricing</h2>
      </div>
      <div className="pricing-grid">
        <PriceCard
          title="Single Book"
          price="₹180"
          wasPrice="₹299"
          description="Pick any one book from the series."
          ctaLabel="Buy a Book"
          ctaHref="#"
        />
        <PriceCard
          title="Complete Set of 5"
          price="₹650"
          wasPrice="₹999"
          description="All five books — the full graded journey."
          ctaLabel="Buy the Full Set"
          ctaHref="#"
          featured
        />
      </div>
      <div className="bulk-strip">
        <p>
          <strong>Buying 25 or more?</strong> Logicoland makes a wonderful
          return gift for birthdays and events. Contact us for a special bulk
          price.
        </p>
        <a href="#" className="btn btn-yellow btn-md">
          Enquire About Bulk
        </a>
      </div>
    </div>
  </section>
);

/* ---------------------------------------------------------------------- */
/*  Claim steps + coupon code (interactive: copy-to-clipboard)             */
/* ---------------------------------------------------------------------- */

const Step: FC<StepItem> = ({ num, title, body }) => (
  <div className="step">
    <span className="num">{num}</span>
    <h3>{title}</h3>
    <p>{body}</p>
  </div>
);

const CouponCodeBox: FC = () => {
  const [copied, setCopied] = useState(false);

  const handleCopy = useCallback(() => {
    const done = () => {
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    };
    if (navigator.clipboard?.writeText) {
      navigator.clipboard.writeText(COUPON_CODE).then(done, done);
    } else {
      done();
    }
  }, []);

  return (
    <div className="code-box">
      <span className="label">Your code</span>
      <span className="code">{COUPON_CODE}</span>
      <button type="button" className="btn btn-secondary btn-sm" onClick={handleCopy}>
        {copied ? "Copied!" : "Copy code"}
      </button>
    </div>
  );
};

const ClaimSection: FC = () => (
  <section className="section claim">
    <div className="claim-inner">
      <h2>Claim Your Offer in 3 Steps</h2>
      <div className="steps">
        {STEPS.map((s) => (
          <Step key={s.num} {...s} />
        ))}
      </div>
      <CouponCodeBox />
      <div className="urgency">
        Hurry — this offer is valid only till {OFFER_DEADLINE}.
      </div>
    </div>
  </section>
);

/* ---------------------------------------------------------------------- */
/*  Return gift band                                                        */
/* ---------------------------------------------------------------------- */

const GiftSection: FC = () => (
  <section className="gift">
    <div className="gift-inner">
      <div className="gift-copy">
        <h2>The Return Gift That Actually Gets Used</h2>
        <p>
          Move over party favours that end up forgotten. Logicoland is a gift
          that keeps children busy, thinking, and coming back for more — long
          after the celebration ends. Ask us about bulk pricing for 25+ books.
        </p>
        <a href="#" className="btn btn-yellow btn-lg">
          Talk to Us About Bulk
        </a>
      </div>
      <div className="img-placeholder">Party / gifting photo</div>
      {/* <img src="/assets/gift-photo.jpg" alt="Logicoland books as return gifts" /> */}
    </div>
  </section>
);

/* ---------------------------------------------------------------------- */
/*  Final CTA                                                               */
/* ---------------------------------------------------------------------- */

const FinalCta: FC = () => (
  <section className="final-cta">
    <div className="final-cta-inner">
      <h2>Give Their Thinking a Head Start</h2>
      <p className="sub">
        Exclusive Swanil Foundation pricing ends {OFFER_DEADLINE}. Don&apos;t
        miss it.
      </p>
      <a href="#pricing" className="btn btn-yellow btn-lg">
        Grab the Offer Now
      </a>
      <p className="reminder">
        Use code <span className="code">{COUPON_CODE}</span> at checkout.
      </p>
    </div>
  </section>
);

/* ---------------------------------------------------------------------- */
/*  Footer                                                                  */
/* ---------------------------------------------------------------------- */

const SiteFooter: FC = () => (
  <footer className="site-footer">
    <div className="footer-inner">
      <div className="footer-cols">
        <div className="footer-about">
          <img src="/logicology-logo-light.svg" alt="Logicology" />
          <p>
            Logicoland is created by <strong>Logicology</strong>, a
            Pune-based educational brand building screen-free, thinking-first
            products for children.
          </p>
        </div>
        <div className="footer-contact">
          <div className="head">Questions or bulk enquiries?</div>
          <div>
            Call / WhatsApp: <strong>[phone number]</strong>
          </div>
          <div>
            Email: <strong>[email]</strong>
          </div>
        </div>
      </div>
      <div className="footer-terms">
        Offer exclusive to Swanil Foundation members. Valid till{" "}
        {OFFER_DEADLINE}. Code {COUPON_CODE} required at checkout.
      </div>
    </div>
  </footer>
);

/* ---------------------------------------------------------------------- */
/*  Page-level design tokens & styles                                       */
/*  (kept as one global stylesheet to preserve the original design 1:1)    */
/* ---------------------------------------------------------------------- */

const PageStyles: FC = () => (
  <style jsx global>{`
    @import url("https://fonts.googleapis.com/css2?family=Outfit:wght@400;600;700;800&family=Roboto:wght@400;500;700&display=swap");

    :root {
      --teal-800: #00665c;
      --teal-700: #007a6e;
      --teal-600: #009888;
      --teal-400: #4fbfb0;
      --teal-100: #dff4f0;
      --teal-50: #effaf8;
      --navy-900: #0c2c32;
      --navy-700: #184850;
      --navy-600: #2a5c64;
      --navy-300: #93aeb2;
      --yellow: #ffc42e;
      --yellow-dark: #f0a500;
      --yellow-soft: #fff1cb;
      --coral-dark: #e23e3e;
      --white: #ffffff;
      --paper: #f6faf9;
      --grey-200: #dce2e2;
      --grey-500: #6b7878;
      --grey-700: #3c4848;
      --text-on-dark: #eaf4f2;
      --font-display: "Outfit", sans-serif;
      --font-body: "Roboto", sans-serif;
    }

    * {
      box-sizing: border-box;
    }
    html {
      scroll-behavior: smooth;
    }
    body {
      margin: 0;
      font-family: var(--font-body);
      color: var(--grey-700);
      background: var(--paper);
      font-size: 16px;
      line-height: 1.6;
    }
    h1,
    h2,
    h3 {
      font-family: var(--font-display);
      color: var(--navy-700);
      letter-spacing: -0.02em;
      margin: 0;
    }
    p {
      margin: 0;
    }
    img {
      display: block;
      max-width: 100%;
    }

    .container {
      max-width: 1200px;
      margin: 0 auto;
    }

    /* Buttons */
    .btn {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      gap: 8px;
      font-family: var(--font-display);
      font-weight: 700;
      line-height: 1;
      letter-spacing: 0.01em;
      border: 2.5px solid transparent;
      border-radius: 999px;
      cursor: pointer;
      text-decoration: none;
      user-select: none;
      transition: transform 0.14s ease-out, box-shadow 0.14s ease-out,
        background 0.14s ease-out;
    }
    .btn-md {
      padding: 12px 22px;
      min-height: 46px;
      font-size: 1rem;
    }
    .btn-lg {
      padding: 15px 30px;
      min-height: 54px;
      font-size: 1.0625rem;
    }
    .btn-sm {
      padding: 8px 16px;
      min-height: 36px;
      font-size: 0.875rem;
    }
    .btn-block {
      display: flex;
      width: 100%;
    }

    .btn-primary {
      background: var(--teal-600);
      color: var(--white);
      box-shadow: 0 4px 0 0 var(--teal-800);
    }
    .btn-secondary {
      background: var(--navy-700);
      color: var(--white);
      box-shadow: 0 4px 0 0 var(--navy-900);
    }
    .btn-yellow {
      background: var(--yellow);
      color: var(--navy-900);
      box-shadow: 0 4px 0 0 var(--yellow-dark);
    }
    .btn-primary:active,
    .btn-secondary:active,
    .btn-yellow:active {
      transform: translateY(3px);
      box-shadow: 0 1px 0 0 rgba(0, 0, 0, 0.25);
    }
    .btn-primary:hover {
      background: var(--teal-700);
    }
    .btn-outline {
      background: var(--white);
      color: var(--teal-700);
      border-color: var(--teal-600);
    }
    .btn-outline:hover {
      background: var(--teal-50);
    }
    .btn:focus-visible {
      outline: 3px solid var(--teal-400);
      outline-offset: 2px;
    }

    .eyebrow {
      font-family: var(--font-display);
      font-weight: 700;
      font-size: 14px;
      letter-spacing: 0.14em;
      text-transform: uppercase;
      color: var(--teal-700);
    }

    /* Deadline strip */
    .deadline-strip {
      background: var(--navy-700);
      color: var(--text-on-dark);
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 10px;
      padding: 10px 24px;
      font-family: var(--font-display);
      font-weight: 600;
      font-size: 15px;
      text-align: center;
    }
    .deadline-strip .dot {
      width: 8px;
      height: 8px;
      border-radius: 50%;
      background: var(--yellow);
      flex: none;
    }
    .deadline-strip strong {
      color: var(--yellow);
    }

    /* Header */
    .site-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 18px 56px;
      background: var(--white);
      border-bottom: 1.5px solid var(--grey-200);
    }
    .site-header img {
      height: 44px;
    }

    /* Hero */
    .hero {
      background: var(--white);
      padding: 64px 56px 80px;
    }
    .hero-grid {
      display: grid;
      grid-template-columns: 1.1fr 0.9fr;
      gap: 64px;
      align-items: center;
    }
    .hero-copy {
      display: flex;
      flex-direction: column;
      align-items: flex-start;
      gap: 22px;
    }
    .hero-badge {
      display: inline-flex;
      padding: 6px 16px;
      font-family: var(--font-display);
      font-weight: 700;
      font-size: 13px;
      letter-spacing: 0.04em;
      color: var(--navy-900);
      background: var(--yellow);
      border-radius: 999px;
    }
    .hero h1 {
      font-weight: 800;
      font-size: clamp(36px, 4.5vw, 60px);
      line-height: 1.06;
      text-wrap: balance;
    }
    .hero h1 .accent {
      color: var(--teal-600);
    }
    .hero .sub {
      font-size: 19px;
      max-width: 540px;
      text-wrap: pretty;
    }
    .hero .offer-flash {
      font-family: var(--font-display);
      font-weight: 700;
      font-size: 20px;
      color: var(--coral-dark);
    }
    .hero-ctas {
      display: flex;
      gap: 16px;
      align-items: center;
      margin-top: 6px;
      flex-wrap: wrap;
    }

    .hero-visual {
      position: relative;
    }
    .hero-visual::before {
      content: "";
      position: absolute;
      inset: 24px -18px -18px 24px;
      background: var(--teal-100);
      border-radius: 28px;
    }
    .hero-visual img,
    .hero-visual .img-placeholder {
      position: relative;
      width: 100%;
      height: 440px;
      object-fit: cover;
      border-radius: 24px;
    }
    .img-placeholder {
      display: flex;
      align-items: center;
      justify-content: center;
      background: var(--teal-50);
      border: 2.5px dashed var(--teal-400);
      color: var(--teal-700);
      font-family: var(--font-display);
      font-weight: 600;
      text-align: center;
      padding: 24px;
    }

    /* Generic section */
    .section {
      padding: 88px 56px;
    }
    .section-head {
      text-align: center;
      display: flex;
      flex-direction: column;
      gap: 14px;
      margin-bottom: 44px;
    }
    .section h2 {
      font-weight: 800;
      font-size: clamp(30px, 3.5vw, 42px);
    }

    /* About */
    .about {
      background: var(--paper);
    }
    .about-inner {
      max-width: 880px;
      margin: 0 auto;
      text-align: center;
      display: flex;
      flex-direction: column;
      gap: 20px;
      align-items: center;
    }
    .about p {
      font-size: 18px;
      line-height: 1.7;
      max-width: 760px;
      text-wrap: pretty;
    }
    .about .strong-line {
      font-weight: 500;
      color: var(--navy-700);
    }
    .about .belief {
      font-family: var(--font-display);
      font-style: italic;
      font-weight: 600;
      font-size: 20px;
      color: var(--teal-700);
      margin-top: 8px;
    }

    /* Benefits */
    .benefits {
      background: var(--white);
    }
    .benefit-grid {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 24px;
    }
    .benefit-card {
      background: var(--white);
      border: 2.5px solid var(--yellow);
      border-radius: 20px;
      padding: 28px 24px;
      display: flex;
      flex-direction: column;
      gap: 14px;
      transition: transform 0.14s ease-out;
    }
    .benefit-card:hover {
      transform: translateY(-4px);
    }
    .benefit-card .icon {
      display: inline-flex;
      width: 48px;
      height: 48px;
      border-radius: 14px;
      background: var(--yellow-soft);
      color: var(--yellow-dark);
      align-items: center;
      justify-content: center;
    }
    .benefit-card h3 {
      font-size: 19px;
      font-weight: 700;
    }
    .benefit-card p {
      font-size: 15px;
    }

    /* Audience */
    .audience {
      background: var(--teal-50);
      padding: 80px 56px;
    }
    .audience-inner {
      max-width: 980px;
      margin: 0 auto;
      display: grid;
      grid-template-columns: auto 1fr;
      gap: 40px;
      align-items: center;
    }
    .audience img {
      width: 130px;
      height: 130px;
    }
    .audience h2 {
      font-weight: 800;
      font-size: clamp(28px, 3vw, 38px);
      margin-bottom: 14px;
    }
    .audience p {
      font-size: 18px;
      line-height: 1.7;
      text-wrap: pretty;
    }

    /* Pricing */
    .pricing {
      background: var(--paper);
    }
    .pricing-inner {
      max-width: 1040px;
      margin: 0 auto;
    }
    .pricing-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 28px;
      align-items: stretch;
    }
    .price-card {
      background: var(--white);
      border: 1.5px solid var(--grey-200);
      border-radius: 20px;
      padding: 40px 36px;
      display: flex;
      flex-direction: column;
      gap: 18px;
    }
    .price-card.featured {
      position: relative;
      border: 2.5px solid var(--teal-600);
      box-shadow: 0 12px 32px -8px rgba(24, 72, 80, 0.18);
    }
    .best-value {
      position: absolute;
      top: -14px;
      left: 36px;
      display: inline-flex;
      padding: 5px 14px;
      font-family: var(--font-display);
      font-weight: 700;
      font-size: 12px;
      letter-spacing: 0.06em;
      color: var(--white);
      background: var(--teal-600);
      border-radius: 999px;
    }
    .price-card .card-title {
      font-family: var(--font-display);
      font-weight: 700;
      font-size: 22px;
      color: var(--navy-700);
    }
    .price-row {
      display: flex;
      align-items: baseline;
      gap: 12px;
    }
    .price {
      font-family: var(--font-display);
      font-weight: 800;
      font-size: 52px;
      letter-spacing: -0.02em;
      color: var(--navy-700);
    }
    .price-card.featured .price {
      color: var(--teal-700);
    }
    .price-was {
      font-size: 20px;
      color: var(--grey-500);
      text-decoration: line-through;
    }
    .price-card .card-cta {
      margin-top: auto;
    }

    .bulk-strip {
      background: var(--yellow-soft);
      border-radius: 20px;
      padding: 24px 36px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 24px;
      margin-top: 44px;
    }
    .bulk-strip p {
      font-size: 17px;
      color: var(--navy-700);
    }
    .bulk-strip strong {
      font-family: var(--font-display);
    }
    .bulk-strip .btn {
      flex: none;
    }

    /* Claim */
    .claim {
      background: var(--white);
    }
    .claim-inner {
      max-width: 1040px;
      margin: 0 auto;
      display: flex;
      flex-direction: column;
      gap: 44px;
      align-items: center;
    }
    .steps {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 24px;
      width: 100%;
    }
    .step {
      background: var(--paper);
      border-radius: 20px;
      padding: 28px 26px;
      display: flex;
      flex-direction: column;
      gap: 12px;
      align-items: flex-start;
    }
    .step .num {
      display: inline-flex;
      width: 42px;
      height: 42px;
      border-radius: 50%;
      background: var(--teal-600);
      color: var(--white);
      align-items: center;
      justify-content: center;
      font-family: var(--font-display);
      font-weight: 800;
      font-size: 19px;
    }
    .step h3 {
      font-size: 19px;
      font-weight: 700;
    }
    .step p {
      font-size: 15px;
    }

    .code-box {
      display: flex;
      align-items: center;
      gap: 16px;
      background: var(--teal-50);
      border: 2.5px dashed var(--teal-400);
      border-radius: 20px;
      padding: 20px 28px;
      flex-wrap: wrap;
      justify-content: center;
    }
    .code-box .label {
      font-family: var(--font-display);
      font-weight: 600;
      font-size: 15px;
      color: var(--navy-700);
    }
    .code-box .code {
      font-family: var(--font-display);
      font-weight: 800;
      font-size: 28px;
      letter-spacing: 0.06em;
      color: var(--teal-700);
    }
    .urgency {
      font-family: var(--font-display);
      font-weight: 700;
      font-size: 18px;
      color: var(--coral-dark);
      text-align: center;
    }

    /* Gift band */
    .gift {
      background: var(--navy-700);
      padding: 80px 56px;
    }
    .gift-inner {
      max-width: 1100px;
      margin: 0 auto;
      display: grid;
      grid-template-columns: 1fr auto;
      gap: 56px;
      align-items: center;
    }
    .gift-copy {
      display: flex;
      flex-direction: column;
      gap: 18px;
      align-items: flex-start;
    }
    .gift h2 {
      color: var(--white);
      font-weight: 800;
      font-size: clamp(28px, 3vw, 38px);
      text-wrap: balance;
    }
    .gift p {
      font-size: 17px;
      line-height: 1.7;
      color: var(--text-on-dark);
      max-width: 560px;
      text-wrap: pretty;
    }
    .gift .img-placeholder,
    .gift img {
      width: 340px;
      height: 280px;
      border-radius: 24px;
      object-fit: cover;
    }

    /* Final CTA */
    .final-cta {
      background: var(--teal-600);
      padding: 96px 56px;
    }
    .final-cta-inner {
      max-width: 760px;
      margin: 0 auto;
      text-align: center;
      display: flex;
      flex-direction: column;
      gap: 20px;
      align-items: center;
    }
    .final-cta h2 {
      color: var(--white);
      font-weight: 800;
      font-size: clamp(32px, 4vw, 48px);
      text-wrap: balance;
    }
    .final-cta .sub {
      font-size: 18px;
      color: var(--teal-100);
    }
    .final-cta .reminder {
      font-family: var(--font-display);
      font-weight: 600;
      font-size: 15px;
      color: var(--teal-100);
    }
    .final-cta .reminder .code {
      color: var(--yellow);
      font-weight: 800;
      letter-spacing: 0.06em;
    }

    /* Footer */
    .site-footer {
      background: var(--navy-900);
      padding: 56px;
      color: var(--text-on-dark);
    }
    .footer-inner {
      max-width: 1100px;
      margin: 0 auto;
      display: flex;
      flex-direction: column;
      gap: 28px;
    }
    .footer-cols {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      gap: 40px;
      flex-wrap: wrap;
    }
    .footer-about {
      display: flex;
      flex-direction: column;
      gap: 16px;
      max-width: 480px;
    }
    .footer-about img {
      height: 40px;
      width: fit-content;
    }
    .footer-about p,
    .footer-contact {
      font-size: 15px;
      line-height: 1.7;
    }
    .footer-contact .head {
      font-family: var(--font-display);
      font-weight: 700;
      color: var(--white);
    }
    .footer-contact strong {
      color: var(--white);
    }
    .footer-terms {
      border-top: 1px solid var(--navy-600);
      padding-top: 20px;
      font-size: 12.5px;
      color: var(--navy-300);
    }

    /* Responsive */
    @media (max-width: 960px) {
      .hero,
      .section,
      .audience,
      .gift,
      .final-cta {
        padding-left: 24px;
        padding-right: 24px;
      }
      .site-header,
      .site-footer {
        padding: 18px 24px;
      }
      .site-footer {
        padding-top: 48px;
        padding-bottom: 48px;
      }
      .hero-grid {
        grid-template-columns: 1fr;
        gap: 40px;
      }
      .hero-visual img,
      .hero-visual .img-placeholder {
        height: 320px;
      }
      .benefit-grid {
        grid-template-columns: repeat(2, 1fr);
      }
      .steps {
        grid-template-columns: 1fr;
      }
      .pricing-grid {
        grid-template-columns: 1fr;
      }
      .audience-inner {
        grid-template-columns: 1fr;
        text-align: center;
        justify-items: center;
      }
      .gift-inner {
        grid-template-columns: 1fr;
      }
      .gift .img-placeholder,
      .gift img {
        width: 100%;
      }
      .bulk-strip {
        flex-direction: column;
        text-align: center;
      }
    }
    @media (max-width: 560px) {
      .benefit-grid {
        grid-template-columns: 1fr;
      }
      .hero {
        padding-top: 40px;
        padding-bottom: 56px;
      }
      .section {
        padding-top: 64px;
        padding-bottom: 64px;
      }
    }

    @media (prefers-reduced-motion: reduce) {
      html {
        scroll-behavior: auto;
      }
      .btn,
      .benefit-card {
        transition: none;
      }
    }
  `}</style>
);

/* ---------------------------------------------------------------------- */
/*  Page (default export)                                                   */
/* ---------------------------------------------------------------------- */

export default function LogicolandOfferPage() {
  return (
    <>
      <PageStyles />
      <DeadlineStrip />
      <SiteHeader />
      <Hero />
      <AboutSection />
      <BenefitsSection />
      <AudienceSection />
      <LogicolandBuyBlock />
      <ClaimSection />
      <GiftSection />
      <FinalCta />
      <SiteFooter />
    </>
  );
}
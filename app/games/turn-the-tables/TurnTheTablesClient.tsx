"use client";

import NavBar from "@/components/NavBar";
import Community from "@/components/Community";
import Footer from "@/components/Footer";
import { motion, useInView } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import toast from "react-hot-toast";
import Link from "next/link";
import { useCart } from "@/components/CartContext";
import HeroCheckoutModal, { HeroProductConfig } from "@/components/HeroCheckoutModal";
import {
  Navigation,
  Autoplay,
  Keyboard,
  FreeMode,
  EffectCoverflow,
  Pagination,
} from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { Swiper, SwiperSlide } from "swiper/react";
import CTAButton from "@/components/CTAButton";
import MediaLayoutRight from "@/components/MediaLayoutRight";
// ─────────────────────────────────────────────
// Shared Design Tokens
// ─────────────────────────────────────────────
const AMBER = "#fbb041";
const AMBER_HOVER = "#fa9e15";
const DARK = "#3d3b40";
const CORAL = "#e8533a";
const GREEN = "#7bb83a";
const WHITE = "#ffffff";
const CART_DEFAULT = "#E45C48"; // Add to Cart default bg
const CART_HOVER = "#c94433";

// ─────────────────────────────────────────────
// Reusable Buttons
// ─────────────────────────────────────────────
function PrimaryBtn({ children, onClick }: { children: React.ReactNode; onClick?: () => void }) {
  return (
    <button
      onClick={onClick}
      style={{
        backgroundColor: AMBER,
        color: DARK,
        border: "2px solid transparent",
        fontFamily: "var(--font-outfit), sans-serif",
        fontWeight: 600,
        fontSize: 18,
        borderRadius: 9999,
        padding: "14px 32px",
        cursor: "pointer",
        transition: "all 0.25s ease",
        display: "inline-block",
      }}
      onMouseEnter={(e) => {
        const el = e.currentTarget as HTMLButtonElement;
        el.style.backgroundColor = AMBER_HOVER;
        el.style.transform = "scale(1.05)";
        el.style.boxShadow = "0 6px 20px rgba(250,158,21,0.4)";
      }}
      onMouseLeave={(e) => {
        const el = e.currentTarget as HTMLButtonElement;
        el.style.backgroundColor = AMBER;
        el.style.transform = "scale(1)";
        el.style.boxShadow = "none";
      }}
      onMouseDown={(e) => {
        (e.currentTarget as HTMLButtonElement).style.transform = "scale(0.95)";
      }}
      onMouseUp={(e) => {
        (e.currentTarget as HTMLButtonElement).style.transform = "scale(1.05)";
      }}
    >
      {children}
    </button>
  );
}

function SecondaryBtn({
  children,
  href,
  onClick,
}: {
  children: React.ReactNode;
  href?: string;
  onClick?: () => void;
}) {
  const baseStyle: React.CSSProperties = {
    backgroundColor: "transparent",
    color: WHITE,
    border: `2px solid ${WHITE}`,
    fontFamily: "var(--font-outfit), sans-serif",
    fontWeight: 600,
    fontSize: 18,
    borderRadius: 9999,
    padding: "14px 32px",
    cursor: "pointer",
    transition: "all 0.25s ease",
    display: "inline-block",
    textDecoration: "none",
  };

  const hoverHandlers = {
    onMouseEnter: (e: React.MouseEvent<HTMLElement>) => {
      const el = e.currentTarget as HTMLElement;
      el.style.backgroundColor = AMBER_HOVER;
      el.style.borderColor = AMBER_HOVER;
      el.style.color = DARK;
      el.style.transform = "scale(1.05)";
      el.style.boxShadow = "0 6px 20px rgba(250,158,21,0.4)";
    },
    onMouseLeave: (e: React.MouseEvent<HTMLElement>) => {
      const el = e.currentTarget as HTMLElement;
      el.style.backgroundColor = "transparent";
      el.style.borderColor = WHITE;
      el.style.color = WHITE;
      el.style.transform = "scale(1)";
      el.style.boxShadow = "none";
    },
    onMouseDown: (e: React.MouseEvent<HTMLElement>) => {
      (e.currentTarget as HTMLElement).style.transform = "scale(0.95)";
    },
    onMouseUp: (e: React.MouseEvent<HTMLElement>) => {
      (e.currentTarget as HTMLElement).style.transform = "scale(1.05)";
    },
  };

  if (href) {
    return (
      <Link href={href} style={baseStyle} {...hoverHandlers}>
        {children}
      </Link>
    );
  }
  return (
    <button style={baseStyle} onClick={onClick} {...hoverHandlers}>
      {children}
    </button>
  );
}

// ─────────────────────────────────────────────
// Section 1 — Hero
// ─────────────────────────────────────────────
const ACCENT = "#fbb041";

function TurnTablesHero() {
  const [isMobile, setIsMobile] = useState(false);
  const { addToCart } = useCart();
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [checkoutProduct, setCheckoutProduct] = useState<HeroProductConfig>({
    name: "Turn Tables",
    price: "₹299",
    initialprice: "₹399",
    razorpayItemId: "item_RsD9AhoF8idQ21",
    description:
      "A fast-paced card game built around multiplication, strategy and friendly competition.",
    image: "https://ik.imagekit.io/pratik2002/primetime_imag1.png?updatedAt=1757032084370",
    rating: 5,
    specialOffer: "",
    category: "games",
  });
  const [addedToCart, setAddedToCart] = useState(false);

  useEffect(() => {
    const checkScreenSize = () => setIsMobile(window.innerWidth < 768);
    checkScreenSize();
    window.addEventListener("resize", checkScreenSize);
    return () => window.removeEventListener("resize", checkScreenSize);
  }, []);

  const TRUST_ITEMS = [
    { text: "4.8 · Designed by educators" },
    { text: "Patent-pending design" },
    { text: "2–6 players" },
    { text: "Card game" },
    { text: "No maths knowledge needed" },
  ];

  const slides = [
    {
      id: 1,
      pretitle: "Fast Turns. Smart Moves. • Ages 6+",
      title: "Multiplication",
      subtitle: "that finally clicks.",
      description:
        "A fast-paced card game built around multiplication, strategy and friendly competition. Children focus on the game, while confidence with times tables grows naturally through play.",
      supporting: "",
      showTrust: true,
    },
  ];

  function handleBuyNow() {
    setCheckoutProduct({
      name: "Turn Tables",
      price: "₹299",
      initialprice: "₹399",
      razorpayItemId: "item_RsD9AhoF8idQ21",
      description:
        "A fast-paced card game built around multiplication, strategy and friendly competition.",
      image: "https://ik.imagekit.io/pratik2002/primetime_imag1.png?updatedAt=1757032084370",
      rating: 5,
      specialOffer: "",
      category: "games",
    });
    setIsCheckoutOpen(true);
  }

  function handleAddToCart() {
    addToCart({
      name: "Turn Tables",
      price: "₹299",
      initialprice: "₹399",
      razorpayItemId: "item_RsD9AhoF8idQ21",
      description:
        "A fast-paced card game built around multiplication, strategy and friendly competition.",
      image: "https://ik.imagekit.io/pratik2002/primetime_imag1.png?updatedAt=1757032084370",
      rating: 5,
    });
    toast.success("Turn Tables added to cart!");
    if (typeof window !== "undefined" && (window as any).fbq) {
      (window as any).fbq("track", "AddToCart", {
        content_name: "Turn Tables",
        value: 299,
        currency: "INR",
      });
    }
    setAddedToCart(true);
    setTimeout(() => setAddedToCart(false), 2000);
  }

  return (
    <>
      <style>{`
        .tth-buy-btn {
          background-color: #fbb041;
          color: #3d3b40;
          border: 2px solid transparent;
          transition: all 0.3s ease, transform 0.15s ease;
          box-shadow: 0 4px 16px rgba(251,176,65,0.35);
        }
        .tth-buy-btn:hover {
          background-color: #fa9e15;
          transform: scale(1.05);
          box-shadow: 0 6px 20px rgba(250,158,21,0.4);
        }
        .tth-buy-btn:active { transform: scale(0.95); }
 
        .tth-cart-btn {
          background-color: transparent;
          border: 2px solid #ffffff;
          color: #ffffff;
          transition: all 0.3s ease, transform 0.15s ease;
        }
        .tth-cart-btn:hover {
          background-color: #fa9e15;
          border-color: #fa9e15;
          color: #3d3b40;
          transform: scale(1.05);
          box-shadow: 0 6px 20px rgba(250,158,21,0.4);
        }
        .tth-cart-btn:active { transform: scale(0.95); }
        .tth-cart-btn .tth-label {
          position: relative;
          z-index: 1;
        }
 
        .tth-trust-item {
          display: inline-flex;
          align-items: center;
          gap: 5px;
          background: rgba(255, 255, 255, 0.12);
          border: 1px solid rgba(255, 255, 255, 0.25);
          border-radius: 999px;
          padding: 4px 12px;
          font-size: 13px;
          color: #ffffff;
          white-space: nowrap;
          backdrop-filter: blur(4px);
          font-family: inherit;
        }
        @media (max-width: 767px) {
          .tth-trust-item { font-size: 11px; padding: 3px 9px; }
        }
      `}</style>

      {/* ── OUTER WRAPPER — matches HeroSlide3 / HeroSlider structure ── */}
      <section className="section my-10">
        <div className="container-padding">
          <div className="section-rounded relative overflow-hidden">
            {/* Background — same as HeroSlide3 */}
            <div
              className="relative w-full overflow-hidden"
              style={{
                backgroundImage: isMobile
                  ? `url('https://ik.imagekit.io/pratik11/TURN-THE-TABLE-BACKGROUND-FOR-MOBILE.png?updatedAt=1781940668843')`
                  : `url('https://ik.imagekit.io/pratik11/TURN-THE-TABLE-BACKGROUND-DESIGN.png?updatedAt=1780465227631')`,
                backgroundSize: "cover",
                backgroundPosition: "center",
                backgroundRepeat: "no-repeat",
                minHeight: isMobile ? 720 : 680,
              }}
            >
              {/* ══ DESKTOP LAYOUT ══ */}
              <div className="hidden min-h-[680px] w-full items-center md:flex">
                {/* Left — Text block */}
                <div className="relative z-20 flex flex-1 flex-col justify-center py-12 pl-[6vw] pr-4">
                  <motion.p
                    className="mb-2 text-[20px] font-bold text-white md:text-[24px] uppercase"
                    style={{ fontFamily: "var(--font-outfit), sans-serif" }}
                    initial={{ y: 30, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                  >
                    {slides[0].pretitle}
                  </motion.p>

                  <motion.h1
                    className="mb-4 uppercase leading-[1.1] text-white"
                    style={{
                      fontFamily: "var(--font-outfit), sans-serif",
                      fontSize: "50px",
                      fontWeight: 800,
                    }}
                    initial={{ y: 40, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ duration: 0.7, delay: 0.25 }}
                  >
                    {slides[0].title}
                    <span className="block">{slides[0].subtitle}</span>
                  </motion.h1>

                  {/* Price flag */}
                  {/* <motion.div
                    className="mb-6 flex items-center gap-3"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.32 }}
                  >
                    <span style={{ color: ACCENT, fontSize: "24px", fontWeight: 700, fontFamily: "var(--font-outfit), sans-serif" }}>₹299</span>
                    <span style={{ textDecoration: "line-through", color: "rgba(255,255,255,0.6)", fontSize: "18px", fontFamily: "var(--font-outfit), sans-serif" }}>₹399</span>
                    <span style={{ background: ACCENT, color: "#3d3b40", borderRadius: "20px", padding: "4px 12px", fontSize: "13px", fontWeight: 600, fontFamily: "var(--font-outfit), sans-serif" }}>Save ₹100</span>
                  </motion.div> */}

                  <motion.p
                    className="mb-8 max-w-[420px] text-[18px] leading-7 text-white lg:text-[22px]"
                    style={{ fontFamily: "var(--font-outfit), sans-serif" }}
                    initial={{ y: 30, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ duration: 0.6, delay: 0.4 }}
                  >
                    {slides[0].description}
                  </motion.p>

                  <motion.div
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ duration: 0.5, delay: 0.5 }}
                    className="flex flex-row gap-3"
                  >
                    <button
                      onClick={handleBuyNow}
                      className="tth-buy-btn inline-block rounded-full px-8 py-4 text-center text-[18px] font-semibold"
                      style={{ fontFamily: "var(--font-outfit), sans-serif", cursor: "pointer" }}
                    >
                      Buy Now ₹299
                    </button>

                    <button
                      onClick={handleAddToCart}
                      className="tth-cart-btn inline-block rounded-full px-8 py-4 text-center text-[18px] font-semibold"
                      style={{ fontFamily: "var(--font-outfit), sans-serif", cursor: "pointer" }}
                    >
                      <span className="tth-label">
                        {addedToCart ? "Added to Cart! ✓" : "Add to Cart"}
                      </span>
                    </button>
                  </motion.div>

                  {/* Trust strip */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.6 }}
                    className="mt-5 flex flex-col gap-2"
                  >
                    <div className="flex flex-wrap gap-2">
                      {TRUST_ITEMS.slice(0, 3).map((item, i) => (
                        <span key={i} className="tth-trust-item">
                          {item.text}
                        </span>
                      ))}
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {TRUST_ITEMS.slice(3).map((item, i) => (
                        <span key={i + 3} className="tth-trust-item">
                          {item.text}
                        </span>
                      ))}
                    </div>
                  </motion.div>
                </div>

                {/* Right — Amber circle + hero image */}
                <div className="relative z-10 flex flex-1 items-center justify-center py-8 pr-[3vw]">
                  <div
                    className="relative flex items-center justify-center rounded-full"
                    style={{
                      width: "clamp(340px, 38vw, 520px)",
                      height: "clamp(340px, 38vw, 520px)",
                      background: "radial-gradient(circle, #ffffff 72%, transparent 73%)",
                      border: `10px solid ${ACCENT}`,
                      boxShadow: "0 0 0 6px rgba(251,176,65,0.25)",
                    }}
                  >
                    <motion.img
                      src="https://ik.imagekit.io/pratik11/TURN-THE-TABLE-HERO-IMAGE.png?updatedAt=1780465309198"
                      alt="Turn the Tables Game"
                      className="object-contain"
                      style={{ width: "85%", height: "85%", position: "relative", zIndex: 5 }}
                      initial={{ scale: 0.85, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
                    />
                  </div>
                </div>
              </div>

              {/* ══ MOBILE LAYOUT ══ */}
              <div className="flex w-full flex-col md:hidden" style={{ minHeight: 720 }}>
                {/* Amber circle + hero image */}
                <div
                  className="relative flex items-center justify-center pb-4 pt-10"
                  style={{ minHeight: 300 }}
                >
                  <div
                    className="relative flex items-center justify-center rounded-full"
                    style={{
                      width: 260,
                      height: 260,
                      background: "radial-gradient(circle, #ffffff 72%, transparent 73%)",
                      border: `8px solid ${ACCENT}`,
                      boxShadow: "0 0 0 4px rgba(251,176,65,0.25)",
                    }}
                  >
                    <motion.img
                      src="https://ik.imagekit.io/pratik11/TURN-THE-TABLE-HERO-IMAGE.png?updatedAt=1780465309198"
                      alt="Turn the Tables Game"
                      className="object-contain"
                      style={{ width: "82%", height: "82%", position: "relative", zIndex: 5 }}
                      initial={{ scale: 0.85, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ duration: 0.8, delay: 0.2 }}
                    />
                  </div>
                </div>

                {/* Text + CTAs */}
                <div className="relative z-20 flex flex-col items-center px-6 pb-20 pt-2 text-center">
                  <motion.p
                    className="mb-1 text-[16px] font-bold text-white"
                    style={{ fontFamily: "var(--font-outfit), sans-serif" }}
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ duration: 0.5, delay: 0.3 }}
                  >
                    {slides[0].pretitle}
                  </motion.p>

                  <motion.h1
                    className="my-4 uppercase leading-[1.15] text-white"
                    style={{
                      fontFamily: "var(--font-outfit), sans-serif",
                      fontSize: "clamp(28px, 8vw, 36px)",
                      fontWeight: 800,
                    }}
                    initial={{ y: 30, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ duration: 0.6, delay: 0.4 }}
                  >
                    Multiplication
                    <br />
                    that finally
                    <br />
                    clicks.
                  </motion.h1>

                  {/* Mobile price flag */}
                  <motion.div
                    className="mb-4 flex items-center gap-2"
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.45 }}
                  >
                    <span
                      style={{
                        color: ACCENT,
                        fontSize: "20px",
                        fontWeight: 700,
                        fontFamily: "var(--font-outfit), sans-serif",
                      }}
                    >
                      ₹299
                    </span>
                    <span
                      style={{
                        textDecoration: "line-through",
                        color: "rgba(255,255,255,0.6)",
                        fontSize: "14px",
                        fontFamily: "var(--font-outfit), sans-serif",
                      }}
                    >
                      ₹399
                    </span>
                    <span
                      style={{
                        background: ACCENT,
                        color: "#3d3b40",
                        borderRadius: "20px",
                        padding: "3px 10px",
                        fontSize: "11px",
                        fontWeight: 600,
                        fontFamily: "var(--font-outfit), sans-serif",
                      }}
                    >
                      Save ₹100
                    </span>
                  </motion.div>

                  <motion.p
                    className="mb-6 max-w-[300px] text-[14px] leading-relaxed text-white"
                    style={{ fontFamily: "var(--font-outfit), sans-serif" }}
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ duration: 0.5, delay: 0.5 }}
                  >
                    {slides[0].description}
                  </motion.p>

                  <motion.div
                    initial={{ y: 15, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ duration: 0.45, delay: 0.6 }}
                    className="flex w-full flex-col items-center gap-3"
                  >
                    <button
                      onClick={handleBuyNow}
                      className="tth-buy-btn w-[260px] rounded-full py-4 text-center text-[16px] font-semibold"
                      style={{ fontFamily: "var(--font-outfit), sans-serif", cursor: "pointer" }}
                    >
                      Buy Now ₹299
                    </button>

                    <button
                      onClick={handleAddToCart}
                      className="tth-cart-btn inline-block w-[260px] rounded-full py-4 text-center text-[16px] font-semibold"
                      style={{ fontFamily: "var(--font-outfit), sans-serif", cursor: "pointer" }}
                    >
                      <span className="tth-label">
                        {addedToCart ? "Added to Cart! ✓" : "Add to Cart"}
                      </span>
                    </button>
                  </motion.div>

                  {/* Mobile trust strip */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.7 }}
                    className="mt-5 flex flex-col items-center gap-2"
                  >
                    <div className="flex flex-wrap justify-center gap-2">
                      {TRUST_ITEMS.slice(0, 3).map((item, i) => (
                        <span key={i} className="tth-trust-item">
                          {item.text}
                        </span>
                      ))}
                    </div>
                    <div className="flex flex-wrap justify-center gap-2">
                      {TRUST_ITEMS.slice(3).map((item, i) => (
                        <span key={i + 3} className="tth-trust-item">
                          {item.text}
                        </span>
                      ))}
                    </div>
                  </motion.div>
                </div>
              </div>
            </div>
            {/* end background div */}
          </div>
          {/* end section-rounded */}
        </div>
        {/* end container-padding */}
      </section>

      <HeroCheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        product={checkoutProduct}
      />
    </>
  );
}

// ─────────────────────────────────────────────
// Section 2 — "The drilling that doesn't feel like drilling"
// ─────────────────────────────────────────────
function GameDetails() {
  const [open, setOpen] = useState(false);
  const YT = "https://youtu.be/2qLAo-AydUc";
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-100px" });

  return (
    <section ref={sectionRef} id="GameDetails" className="w-full bg-brand-coral">
      <div className="mx-auto px-4 py-14 sm:px-6 lg:max-w-[80vw] lg:px-8">
        <div className="flex flex-col items-center md:flex-row">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -50 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="order-1 flex w-full items-center py-6 md:order-1 md:w-1/2 md:py-0"
          >
            <MediaLayoutRight
              image="https://ik.imagekit.io/pratik11/PRIME-TIME-FOLD-2-IMAGE.png?updatedAt=1758352229897"
              videoSrc=""
              text="Turn The Tables™"
            />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: 50 }}
            transition={{ duration: 0.7, delay: 0.3 }}
            className="order-2 w-full px-4 py-8 sm:p-12 md:order-2 md:w-1/2"
          >
            <motion.h2
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
              transition={{ duration: 0.6 }}
              className="headingstyle font-heading font-extrabold leading-tight text-white"
            >
              The drilling that doesn't feel like drilling.
            </motion.h2>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="textstyles mt-3 max-w-xl font-sans text-white"
            >
              Mastering times tables takes practice. Turn The Tables simply makes that practice more
              engaging. As children play, compete and make quick decisions, confidence with
              multiplication grows naturally. Fluency arrives as a side effect of having fun.
            </motion.p>
            <motion.div
              className="mt-6"
              initial={{ y: 20, opacity: 0 }}
              animate={isInView ? { y: 0, opacity: 1 } : { y: 20, opacity: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
            >
              <CTAButton
                text="Explore the Promise"
                bg="#fbb041"
                color="#3d3b40"
                hoverBg="#fa9e15"
                hoverColor="#3d3b40"
                showShadow={true}
                showScaleOnHover={true}
                showScaleOnActive={true}
              />
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

// ─────────────────────────────────────────────
// Section 3 — Feature grid (2×2)
// ─────────────────────────────────────────────

function MatchIcon() {
  return (
    <div style={{ color: "#3d3b40", width: 40, height: 40 }}>
      <svg
        width="40"
        height="40"
        viewBox="0 0 40 40"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Cards matching symbol - two overlapping cards with a star */}
        <rect
          x="10"
          y="14"
          width="18"
          height="24"
          rx="3"
          fill="#fbb041"
          stroke="#3d3b40"
          strokeWidth="1.5"
        />
        <rect
          x="14"
          y="10"
          width="18"
          height="24"
          rx="3"
          fill="#FFD966"
          stroke="#3d3b40"
          strokeWidth="1.5"
        />
        {/* Multiplication symbol */}
        <text x="23" y="28" fontSize="14" fontWeight="bold" fill="#3d3b40" textAnchor="middle">
          ×
        </text>
        {/* Match checkmark */}
        <path
          d="M30 8L33 11L38 5"
          stroke="#2e7d32"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
        />
      </svg>
    </div>
  );
}

function TwistIcon() {
  return (
    <div style={{ color: "#3d3b40", width: 40, height: 40 }}>
      <svg
        width="40"
        height="40"
        viewBox="0 0 40 40"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Curved arrow / twist symbol */}
        <path
          d="M12 20C12 14.5 16.5 10 22 10C27.5 10 32 14.5 32 20"
          stroke="#fbb041"
          strokeWidth="2.5"
          strokeLinecap="round"
          fill="none"
        />
        <path
          d="M28 16L32 20L28 24"
          stroke="#fbb041"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
        />
        {/* Special card spark */}
        <path
          d="M22 5L23 9L27 10L23 11L22 15L21 11L17 10L21 9L22 5Z"
          fill="#FFD966"
          stroke="#3d3b40"
          strokeWidth="0.8"
        />
        {/* Question mark for surprise */}
        <text x="25" y="32" fontSize="12" fontWeight="bold" fill="#3d3b40" textAnchor="middle">
          ?!
        </text>
      </svg>
    </div>
  );
}

function BoxIcon() {
  return (
    <div style={{ color: "#3d3b40", width: 40, height: 40 }}>
      <svg
        width="40"
        height="40"
        viewBox="0 0 40 40"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Gift/Box symbol */}
        <rect
          x="8"
          y="14"
          width="24"
          height="18"
          rx="2"
          fill="#fbb041"
          stroke="#3d3b40"
          strokeWidth="1.5"
        />
        {/* Box lid */}
        <path
          d="M8 14L20 8L32 14"
          stroke="#3d3b40"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="#FFD966"
        />
        {/* Ribbon */}
        <line x1="20" y1="8" x2="20" y2="32" stroke="#3d3b40" strokeWidth="1.5" />
        <line x1="14" y1="14" x2="20" y2="20" stroke="#3d3b40" strokeWidth="1.5" />
        <line x1="26" y1="14" x2="20" y2="20" stroke="#3d3b40" strokeWidth="1.5" />
        {/* Card peeking out */}
        <rect
          x="14"
          y="22"
          width="12"
          height="8"
          rx="1"
          fill="white"
          stroke="#3d3b40"
          strokeWidth="1"
        />
        <text x="20" y="29" fontSize="7" fontWeight="bold" fill="#3d3b40" textAnchor="middle">
          4×3
        </text>
      </svg>
    </div>
  );
}

const cards = [
  {
    id: 1,
    icon: "🔄",
    title: (
      <>
        Match. Multiply.
        <br /> Turn The Tables.
      </>
    ),
    body: "Play a matching card and be the first to empty your hand. Every match reinforces multiplication facts.",
    side: "left",
  },
  {
    id: 2,
    icon: "⚡",
    title: "Always a New Move",
    body: "Special cards create twists, surprises and opportunities, making every game feel a little different from the last.",
    side: "right",
  },
  {
    id: 3,
    icon: "🃏",
    title: "What's in the Box",
    body: (
      <>
        64 Number Cards · 26 Special Cards · <br />
        Endless Fun!
      </>
    ),
    side: "left",
  },
  {
    id: 4,
    icon: "✨",
    title: "When It Finally Clicks",
    body: "The same multiplication facts appear naturally throughout the game. Before long, the tables that once needed thinking start to feel automatic.",
    side: "right",
  },
];

const CARD_COLORS = ["#009a88", "#f26c3f", "#fbb041", "#1b4552"];
const CARD_TEXT_COLORS = ["#ffffff", "#ffffff", "#3d3b40", "#ffffff"];

function TrustCard({
  icon,
  title,
  body,
  visible,
  delay,
  side,
  colorIndex,
}: {
  icon: React.ReactNode;
  title: React.ReactNode;
  body: React.ReactNode;
  visible: boolean;
  delay: number;
  side: "left" | "right";
  colorIndex: number;
}) {
  const textColor = CARD_TEXT_COLORS[colorIndex % CARD_TEXT_COLORS.length];

  return (
    <div
      className="flex w-full max-w-[280px] flex-col justify-center rounded-[20px] p-6"
      style={{
        backgroundColor: CARD_COLORS[colorIndex % CARD_COLORS.length],
        minHeight: 200,
        opacity: visible ? 1 : 0,
        transform: visible
          ? "translateX(0)"
          : side === "left"
            ? "translateX(-40px)"
            : "translateX(40px)",
        transition: `opacity 0.55s ease ${delay}ms, transform 0.55s ease ${delay}ms`,
      }}
    >
      {/* Title */}
      <h3
        className="text-center font-heading text-[17px] font-extrabold leading-snug"
        style={{ color: textColor }}
      >
        {title}
      </h3>

      {/* Body */}
      <p
        className="mt-3 text-center font-sans text-[14px] leading-relaxed"
        style={{ color: textColor, opacity: colorIndex === 2 ? 0.85 : 0.9 }}
      >
        {body}
      </p>
    </div>
  );
}

export function WhyImportant() {
  const sectionRef = useRef<HTMLElement>(null);
  const [triggered, setTriggered] = useState(false);

  const [cardOrder] = useState<number[]>(() => {
    const order = [0, 1, 2, 3];
    for (let i = order.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [order[i], order[j]] = [order[j], order[i]];
    }
    return order;
  });

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setTriggered(true);
        else setTriggered(false);
      },
      { threshold: 0.15 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const IMAGE_DELAY = 300;
  const CARD_BASE_DELAY = 500;
  const CARD_STAGGER = 150;

  const cardDelayMap: Record<number, number> = {};
  cards.forEach((card) => {
    const position = cardOrder.indexOf(cards.indexOf(card));
    cardDelayMap[card.id] = CARD_BASE_DELAY + position * CARD_STAGGER;
  });

  const leftCards = cards.filter((c) => c.side === "left");
  const rightCards = cards.filter((c) => c.side === "right");

  return (
    <section
      ref={sectionRef}
      className="relative w-full overflow-hidden bg-white px-4 py-16 md:px-8"
    >
      <div className="relative mx-auto max-w-6xl">
        <div className="grid grid-cols-1 items-center gap-6 md:grid-cols-[1fr_420px_1fr]">
          {/* ── LEFT CARDS ── */}
          <div className="flex flex-col items-center gap-5 md:items-end">
            {leftCards.map((card, idx) => (
              <TrustCard
                key={card.id}
                icon={card.icon}
                title={card.title}
                body={card.body}
                visible={triggered}
                delay={cardDelayMap[card.id]}
                side="left"
                colorIndex={idx}
              />
            ))}
          </div>

          {/* ── CENTER IMAGE ── */}
          <div className="order-first flex flex-col items-center justify-center md:order-none">
            <div
              className="relative w-full overflow-hidden rounded-[28px]"
              style={{
                aspectRatio: "1 / 1",
                border: "12px solid #4BBFDC",
                opacity: triggered ? 1 : 0,
                transform: triggered ? "translateY(0)" : "translateY(48px)",
                transition: `opacity 0.65s ease ${IMAGE_DELAY}ms, transform 0.65s ease ${IMAGE_DELAY}ms`,
              }}
            >
              <Image
                src="https://ik.imagekit.io/pratik11/TURN-THE-TABLE-HERO-IMAGE_withbackground_d0b4XcVqQ.png"
                alt="Turn The Tables card game"
                fill
                className="object-cover"
                sizes="(max-width: 768px) 90vw, 420px"
              />
            </div>
          </div>

          {/* ── RIGHT CARDS ── */}
          <div className="flex flex-col items-center gap-5 md:items-start">
            {rightCards.map((card, idx) => (
              <TrustCard
                key={card.id}
                icon={card.icon}
                title={card.title}
                body={card.body}
                visible={triggered}
                delay={cardDelayMap[card.id]}
                side="right"
                colorIndex={idx + 2}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

// Product configuration for Turn The Tables
const TURN_TABLES = {
  name: "Turn The Tables",
  price: "₹299",
  initialprice: "₹399",
  razorpayItemId: "item_RsD9AhoF8idQ21",
  description: "Fast turns. Smart moves. Multiplication that finally clicks.",
  image: "https://ik.imagekit.io/pratik11/TURN-THE-TABLE-BOX-IMAGE.png?updatedAt=1781172932797",
  rating: 5,
  specialOffer: "Save ₹100",
  category: "games",
};

// Return Gift Bundle product
const RETURN_GIFT_BUNDLE = {
  name: "Return-Gift Bundle",
  price: "₹4,000",
  initialprice: "",
  razorpayItemId: "item_T5LdlReGC0M9YJ",
  description: "Perfect for Birthdays, Competitions & Events",
  image: "https://ik.imagekit.io/pratik11/TURN-THE-TABLE-BOX-IMAGE.png?updatedAt=1781172932797",
  rating: 5,
  specialOffer: "Perfect for Birthdays, Competitions & Events",
  category: "bundles",
};

// Cross-sell products (if needed, otherwise empty)
const CROSS_SELL = [];

// Styles - matching PrimeTimeBuyBlock
const ptbStyles = `
  .ptb-buy-btn {
    background-color: #fbb041;
    color: #3d3b40;
    border: none;
    transition: all 0.3s ease, transform 0.15s ease;
  }
  .ptb-buy-btn:hover {
    background-color: #fa9e15;
    transform: scale(1.02);
    box-shadow: 0 6px 20px rgba(250,158,21,0.4);
  }
  .ptb-buy-btn:active { transform: scale(0.98); }
  
  .ptb-cart-btn {
    background-color: ${CART_DEFAULT};
    color: #fff;
    border: 2px solid transparent;
    transition: all 0.3s ease, transform 0.15s ease;
    box-shadow: 0 4px 16px rgba(228,92,72,0.30);
  }
  .ptb-cart-btn:hover {
    background-color: ${CART_HOVER};
    transform: scale(1.05);
    box-shadow: 0 6px 20px rgba(201,68,51,0.38);
  }
  .ptb-cart-btn:active { transform: scale(0.95); }

  .ptb-cart-btn--added {
    background-color: ${CART_HOVER} !important;
    color: #fff !important;
  }
  .ptb-cart-btn--added {
    background-color: #fbb041;
    color: #3d3b40;
    border-color: #fbb041;
  }
  
  .ptb-enquire-btn {
    background-color: transparent;
    border: 2px solid #fbb041;
    color: #fbb041;
    transition: all 0.3s ease, transform 0.15s ease;
  }
  .ptb-enquire-btn:hover {
    background-color: #fbb041;
    color: #3d3b40;
    transform: scale(1.02);
    box-shadow: 0 6px 20px rgba(250,158,21,0.2);
  }
  .ptb-enquire-btn:active { transform: scale(0.98); }
`;

const TEXT_DARK = "#1a2a2c";
const GOLD = "#fbb041";
const TAG_COLOR = "#fbb041";

// Stub for VideoModal — replace with your real import

export function TurnTablesBuyBlock() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });
  const { addToCart } = useCart();

  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [checkoutProduct, setCheckoutProduct] = useState(TURN_TABLES);
  const [addedToCart, setAddedToCart] = useState(false);
  const [bundleAddedToCart, setBundleAddedToCart] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  function handleBuyNow(p = TURN_TABLES) {
    setCheckoutProduct(p);
    setIsCheckoutOpen(true);
  }

  function handleAddToCart() {
    addToCart({
      name: TURN_TABLES.name,
      price: TURN_TABLES.price,
      initialprice: TURN_TABLES.initialprice,
      razorpayItemId: TURN_TABLES.razorpayItemId,
      description: TURN_TABLES.description,
      image: TURN_TABLES.image,
      rating: TURN_TABLES.rating ?? 5,
    });
    toast.success("Turn The Tables added to cart!");
    if (typeof window !== "undefined" && (window as any).fbq) {
      (window as any).fbq("track", "AddToCart", {
        content_name: TURN_TABLES.name,
        value: 299,
        currency: "INR",
      });
    }
    setAddedToCart(true);
    setTimeout(() => setAddedToCart(false), 2000);
  }

  function handleAddBundleToCart() {
    addToCart({
      name: RETURN_GIFT_BUNDLE.name,
      price: RETURN_GIFT_BUNDLE.price,
      initialprice: RETURN_GIFT_BUNDLE.initialprice,
      razorpayItemId: RETURN_GIFT_BUNDLE.razorpayItemId,
      description: RETURN_GIFT_BUNDLE.description,
      image: RETURN_GIFT_BUNDLE.image,
      rating: RETURN_GIFT_BUNDLE.rating ?? 5,
    });
    toast.success("Return-Gift Bundle added to cart!");
    if (typeof window !== "undefined" && (window as any).fbq) {
      (window as any).fbq("track", "AddToCart", {
        content_name: RETURN_GIFT_BUNDLE.name,
        value: 4000,
        currency: "INR",
      });
    }
    setBundleAddedToCart(true);
    setTimeout(() => setBundleAddedToCart(false), 2000);
  }

  function handleEnquire() {
    window.location.href = "mailto:hello@logicoland.in?subject=Bulk Enquiry for Return-Gift Bundle";
  }

  return (
    <>
      <style>{ptbStyles}</style>

      <section id="buy" ref={ref} className="relative w-full overflow-hidden bg-brand-tealDark">
        <div className="relative px-4 py-20 md:mx-auto md:max-w-[82vw] lg:mx-auto lg:max-w-[82vw] lg:px-8">
          {/* Section Title */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="mb-12 text-center"
          >
            <h2
              className="font-heading text-4xl font-extrabold text-white md:text-5xl lg:text-6xl"
              style={{ fontFamily: "var(--font-outfit), sans-serif" }}
            >
              Time to Turn the Tables
            </h2>
            <p className="mt-3 font-sans text-lg text-white/70">Bring Home the Fun</p>
          </motion.div>

          {/* ── Card 1 — Turn The Tables Single ── */}
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
                src={TURN_TABLES.image}
                alt="Turn The Tables"
                className="h-full w-full object-contain"
                style={{ borderTopLeftRadius: "14px", borderBottomLeftRadius: "14px" }}
              />
            </motion.div>

            {/* RIGHT — content */}
            <div className="flex flex-1 flex-col p-8 sm:p-12">
              {/* Eyebrow */}
              <motion.p
                initial={{ opacity: 0, y: 16 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="mb-2 font-sans text-xs font-bold uppercase tracking-[0.2em]"
                style={{ color: TEXT_DARK }}
              >
                The Multiplication Card Game
              </motion.p>

              {/* Name */}
              <motion.h2
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: 0.25 }}
                className="headingstyle font-heading font-extrabold leading-tight"
                style={{ color: TEXT_DARK }}
              >
                Turn The Tables
              </motion.h2>

              {/* Stars */}
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
                  5.0 · New arrival
                </span>
              </motion.div>

              {/* Price */}
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
                  ₹299
                </span>
                <span
                  className="font-sans text-lg line-through"
                  style={{ color: TEXT_DARK, opacity: 0.4 }}
                >
                  ₹399
                </span>
                <span
                  className="rounded-full px-2.5 py-1 font-sans text-[11px] font-bold uppercase tracking-wide"
                  style={{ backgroundColor: TAG_COLOR, color: TEXT_DARK }}
                >
                  Save ₹100
                </span>
              </motion.div>

              {/* Description */}
              <motion.p
                initial={{ opacity: 0 }}
                animate={isInView ? { opacity: 1 } : {}}
                transition={{ duration: 0.5, delay: 0.38 }}
                className="mt-3 font-sans text-sm leading-relaxed"
                style={{ color: TEXT_DARK, opacity: 0.7 }}
              >
                Fast turns. Smart moves. Multiplication that finally clicks.
              </motion.p>

              {/* Microcopy */}
              <motion.p
                initial={{ opacity: 0 }}
                animate={isInView ? { opacity: 1 } : {}}
                transition={{ duration: 0.5, delay: 0.4 }}
                className="mt-1 font-sans text-xs"
                style={{ color: TEXT_DARK, opacity: 0.4 }}
              >
                All prices include GST &nbsp;·&nbsp; Detailed invoice sent after purchase
              </motion.p>

              {/* CTA buttons */}
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.55, delay: 0.45 }}
                className="mt-6 flex flex-wrap gap-3"
              >
                <button
                  onClick={() => handleBuyNow()}
                  className="ptb-buy-btn relative flex items-center justify-center overflow-hidden rounded-full px-8 py-3.5 text-[15px] font-extrabold"
                >
                  <span className="relative flex items-center gap-2">
                    Buy Now — ₹299
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
                  className={`ptb-cart-btn flex items-center gap-2 rounded-full px-8 py-3.5 text-[15px] font-extrabold${addedToCart ? "ptb-cart-btn--added" : ""}`}
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

              {/* Trust badges */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={isInView ? { opacity: 1 } : {}}
                transition={{ duration: 0.5, delay: 0.55 }}
                className="mt-5 flex flex-wrap gap-2"
              >
                {[
                  { text: "2–6 players" },
                  { text: "Ages 6+" },
                  { text: "15–20 minutes" },
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

          {/* ── Card 2 — Return Gift Bundle ── */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1], delay: 0.1 }}
            className="mx-auto mb-16 flex flex-col items-stretch rounded-[28px] bg-white md:flex-row lg:max-w-[70vw]"
            style={{ boxShadow: "0 8px 48px 0 rgba(0,0,0,0.18)" }}
          >
            {/* LEFT — image */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={isInView ? { opacity: 1, scale: 1 } : {}}
              transition={{ duration: 0.7, delay: 0.2 }}
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
                src={RETURN_GIFT_BUNDLE.image}
                alt="Return Gift Bundle"
                className="h-full w-full object-contain"
                style={{ borderTopLeftRadius: "14px", borderBottomLeftRadius: "14px" }}
              />
            </motion.div>

            {/* RIGHT — content */}
            <div className="flex flex-1 flex-col p-8 sm:p-12">
              {/* Eyebrow */}
              <motion.p
                initial={{ opacity: 0, y: 16 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: 0.25 }}
                className="mb-2 font-sans text-xs font-bold uppercase tracking-[0.2em]"
                style={{ color: TEXT_DARK }}
              >
                Perfect for Birthdays, Competitions &amp; Events
              </motion.p>

              {/* Name */}
              <motion.h2
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="headingstyle font-heading font-extrabold leading-tight"
                style={{ color: TEXT_DARK }}
              >
                Return-Gift Bundle
              </motion.h2>

              {/* Subheading */}
              <motion.p
                initial={{ opacity: 0, y: 16 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: 0.33 }}
                className="mt-2 font-sans text-base font-semibold"
                style={{ color: TEXT_DARK, opacity: 0.8 }}
              >
                Make Every Guest a Winner
              </motion.p>

              {/* Description */}
              <motion.p
                initial={{ opacity: 0 }}
                animate={isInView ? { opacity: 1 } : {}}
                transition={{ duration: 0.5, delay: 0.36 }}
                className="mt-1.5 font-sans text-sm leading-relaxed"
                style={{ color: TEXT_DARK, opacity: 0.65 }}
              >
                A return gift children will enjoy today and remember long after the party ends.
              </motion.p>

              {/* Price */}
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: 0.38 }}
                className="mt-4 flex items-baseline gap-3"
              >
                <span
                  className="font-heading text-[38px] font-extrabold leading-none"
                  style={{ color: TEXT_DARK }}
                >
                  ₹4,000
                </span>
                <span
                  className="rounded-full px-2.5 py-1 font-sans text-[11px] font-bold uppercase tracking-wide"
                  style={{ backgroundColor: TAG_COLOR, color: TEXT_DARK }}
                >
                  20 copies · ₹200/copy
                </span>
              </motion.div>

              {/* Microcopy */}
              <motion.p
                initial={{ opacity: 0 }}
                animate={isInView ? { opacity: 1 } : {}}
                transition={{ duration: 0.5, delay: 0.4 }}
                className="mt-1 font-sans text-xs"
                style={{ color: TEXT_DARK, opacity: 0.4 }}
              >
                All prices include GST &nbsp;·&nbsp; Detailed invoice provided after purchase
              </motion.p>

              {/* CTA buttons */}
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.55, delay: 0.45 }}
                className="mt-6 flex flex-wrap gap-3"
              >
                <button
                  onClick={() => handleBuyNow(RETURN_GIFT_BUNDLE)}
                  className="ptb-buy-btn relative flex items-center justify-center overflow-hidden rounded-full px-8 py-3.5 text-[15px] font-extrabold"
                >
                  <span className="relative flex items-center gap-2">
                    Buy Bundle — ₹4,000
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
                  onClick={handleEnquire}
                  className={`ptb-cart-btn flex items-center gap-2 rounded-full px-8 py-3.5 text-[15px] font-extrabold${bundleAddedToCart ? "ptb-cart-btn--added" : ""}`}
                >
                  Enquire for Bulk Deals
                </button>
              </motion.div>

              {/* Trust badges */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={isInView ? { opacity: 1 } : {}}
                transition={{ duration: 0.5, delay: 0.55 }}
                className="mt-5 flex flex-wrap gap-2"
              >
                {[
                  { text: "20 copies included" },
                  { text: "Ages 8+" },
                  { text: "Perfect for parties" },
                  { text: "Bulk pricing available" },
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

          {/* ── Footer note ── */}
          <motion.p
            className="mt-12 text-center font-sans text-xs text-white/35"
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : { opacity: 0 }}
            transition={{ delay: 0.8, duration: 0.5 }}
          >
            All prices include GST &nbsp;·&nbsp; Free shipping on orders above ₹499
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
// ─────────────────────────────────────────────
// Section 5 — "Not a toy company" (mirrors Benefit.tsx exactly)
// ─────────────────────────────────────────────
function WhyLogicologySection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section
      ref={ref}
      style={{
        backgroundColor: GREEN,
        width: "100%",
        borderTop: "1px solid rgba(255,255,255,0.15)",
      }}
    >
      <div style={{ padding: "60px 32px", maxWidth: "75vw", margin: "0 auto" }}>
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            alignItems: "center",
            gap: 40,
            color: WHITE,
          }}
        >
          {/* Text left */}
          <motion.div
            style={{ flex: "1 1 340px" }}
            initial={{ x: -50, opacity: 0 }}
            animate={isInView ? { x: 0, opacity: 1 } : { x: -50, opacity: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <motion.p
              className="headingstyle font-heading"
              initial={{ y: 20, opacity: 0 }}
              animate={isInView ? { y: 0, opacity: 1 } : { y: 20, opacity: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              We're not a toy company that added learning.
            </motion.p>
            <motion.p
              className="textstyles font-sans"
              style={{ marginTop: 16, maxWidth: 480, color: "rgba(255,255,255,0.9)" }}
              initial={{ y: 20, opacity: 0 }}
              animate={isInView ? { y: 0, opacity: 1 } : { y: 20, opacity: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              We're a learning company that made it fun. One distinction explains why we do what we
              do.
            </motion.p>
            <motion.div
              style={{ marginTop: 24 }}
              initial={{ y: 20, opacity: 0 }}
              animate={isInView ? { y: 0, opacity: 1 } : { y: 20, opacity: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
            >
              <Link
                href="/philosophy"
                style={{
                  backgroundColor: AMBER,
                  color: DARK,
                  fontFamily: "var(--font-outfit), sans-serif",
                  fontWeight: 600,
                  fontSize: 18,
                  borderRadius: 9999,
                  padding: "14px 32px",
                  display: "inline-block",
                  textDecoration: "none",
                  transition: "all 0.25s ease",
                }}
                onMouseEnter={(e) => {
                  const el = e.currentTarget as HTMLAnchorElement;
                  el.style.backgroundColor = AMBER_HOVER;
                  el.style.transform = "scale(1.05)";
                }}
                onMouseLeave={(e) => {
                  const el = e.currentTarget as HTMLAnchorElement;
                  el.style.backgroundColor = AMBER;
                  el.style.transform = "scale(1)";
                }}
              >
                Explore the Promise
              </Link>
            </motion.div>
          </motion.div>

          {/* Image right */}
          <motion.div
            style={{ flex: "1 1 300px", display: "flex", justifyContent: "center" }}
            initial={{ x: 50, opacity: 0, scale: 0.9 }}
            animate={isInView ? { x: 0, opacity: 1, scale: 1 } : { x: 50, opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.8, delay: 0.3 }}
          >
            <div
              style={{
                position: "relative",
                width: 340,
                height: 280,
                borderRadius: 24,
                overflow: "hidden",
              }}
            >
              <Image
                src="https://ik.imagekit.io/pratik11/WE-ARE-NOT-TOY-COMPANY-NEW.png"
                alt="We are not a toy company"
                fill
                style={{ objectFit: "cover" }}
                sizes="340px"
              />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

// ─────────────────────────────────────────────
// Root Client Component
// ─────────────────────────────────────────────
export default function TurnTheTablesClient() {
  return (
    <main>
      <NavBar />
      <TurnTablesHero />
      <GameDetails />
      <WhyImportant />
      <TurnTablesBuyBlock />
      {/* <WhyLogicologySection /> */}
      <Community />
      <Footer />
    </main>
  );
}

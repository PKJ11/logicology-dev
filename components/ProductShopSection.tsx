"use client";

import { useState, useRef } from "react";
import { motion, useInView } from "framer-motion";
import toast from "react-hot-toast";
import { useCart } from "@/components/CartContext";
import HeroCheckoutModal, { HeroProductConfig } from "@/components/HeroCheckoutModal";

// ─────────────────────────────────────────────────────────────────
// Data
// ─────────────────────────────────────────────────────────────────
type FeaturedProduct = HeroProductConfig & {
  displayName: string;
  tag: string;
  tagHex: string;
  isSeries?: boolean;
  discount?: string;
};

const FEATURED: FeaturedProduct[] = [
  {
    name: "Prime Time",
    displayName: "PrimeTime™",
    price: "₹1,499",
    initialprice: undefined,
    razorpayItemId: "item_RNn1BJlJAJ9sM8",
    description: "The addictive numbers board game that makes prime thinking second nature.",
    image: "https://ik.imagekit.io/pratik11/PRIME-TIME-HERO-IMAGE.png",
    rating: 5,
    specialOffer: "",
    category: "games",
    tag: "Best Seller",
    tagHex: "#D8AE4F",
  },
  {
    name: "Turn the Tables",
    displayName: "Turn the Tables",
    price: "₹299",
    initialprice: "₹399",
    razorpayItemId: "item_RsD9AhoF8idQ21",
    description: "A fast-paced multiplication card game with wild strategy twists.",
    image: "https://ik.imagekit.io/pratik11/TURN-THE-TABLE-BOX-IMAGE.png",
    rating: 5,
    specialOffer: "",
    category: "games",
    tag: "25% Off",
    tagHex: "#D8AE4F",
    discount: "",
  },
  {
    name: "Logicoland - Volume 1",
    displayName: "Logicoland Series",
    price: "₹249",
    initialprice: "₹299",
    razorpayItemId: "item_S4UBymXQ91Vmk4",
    description: "Five volumes of logic puzzles and brain challenges for ages 6–16.",
    image:
      "https://ik.imagekit.io/pratik2002/VOLUMNE%201/VERTICAL%20BOOK%20COVER%20MOCKUP%20VOLUNE%201.png?updatedAt=1773912123121",
    rating: 5,
    specialOffer: "",
    category: "books",
    tag: "Series",
    tagHex: "#D8AE4F",
    isSeries: true,
  },
  {
    name: "Logicoland Set (All Volumes)",
    displayName: "Complete Set",
    price: "₹999",
    initialprice: undefined,
    razorpayItemId: "item_SSxJhDUqb7HTiy",
    description: "Every volume in one box — the complete thinking skills collection.",
    image: "https://ik.imagekit.io/pratik11/LOGICOLAND-HERO-IMAGE.png?updatedAt=1781163914607",
    rating: 5,
    specialOffer: "",
    category: "set",
    tag: "Best Value",
    tagHex: "#D8AE4F",
  },
];

const REVIEWS: Record<string, number> = {
  item_RNn1BJlJAJ9sM8: 124,
  item_RsD9AhoF8idQ21: 87,
  item_S4UBymXQ91Vmk4: 210,
  item_SSxJhDUqb7HTiy: 56,
};

// Palette
const GOLD = "#E45C48"; // stars accent (unchanged)
const TAG_COLOR = "#fbb041"; // tag pills
const TEXT_DARK = "#3d3b40"; // all text
const BUY_DEFAULT = "#fbb041"; // Buy Now default bg
const BUY_HOVER = "#fa9e15"; // Buy Now hover bg
const CART_DEFAULT = "#E45C48"; // Add to Cart default (orange)
const CART_HOVER = "#c94433"; // Add to Cart hover (dark orange)

// ─────────────────────────────────────────────────────────────────
// Injected styles (button hover handled via CSS class)
// ─────────────────────────────────────────────────────────────────
const cardStyles = `
  .hs3-buy-btn {
    background-color: ${BUY_DEFAULT};
    color: ${TEXT_DARK};
    border: 2px solid transparent;
    transition: all 0.3s ease, transform 0.15s ease;
    box-shadow: 0 4px 16px rgba(251,176,65,0.35);
  }
  .hs3-buy-btn:hover {
    background-color: ${BUY_HOVER};
    transform: scale(1.05);
    box-shadow: 0 6px 20px rgba(250,158,21,0.4);
  }
  .hs3-buy-btn:active { transform: scale(0.95); }

  .hs3-cart-btn {
    background-color: ${CART_DEFAULT};
    color: #fff;
    border: 2px solid transparent;
    transition: all 0.3s ease, transform 0.15s ease;
    box-shadow: 0 4px 16px rgba(228,92,72,0.30);
  }
  .hs3-cart-btn:hover {
    background-color: ${CART_HOVER};
    transform: scale(1.05);
    box-shadow: 0 6px 20px rgba(201,68,51,0.38);
  }
  .hs3-cart-btn:active { transform: scale(0.95); }

  .hs3-cart-btn--added {
    background-color: ${CART_HOVER} !important;
    color: #fff !important;
  }
`;

// ─────────────────────────────────────────────────────────────────
// Card
// ─────────────────────────────────────────────────────────────────
function ProductCard({
  product,
  index,
  onBuyNow,
}: {
  product: FeaturedProduct;
  index: number;
  onBuyNow: (p: HeroProductConfig) => void;
}) {
  const { addToCart } = useCart();
  const [addedToCart, setAddedToCart] = useState(false);
  const reviews = REVIEWS[product.razorpayItemId] ?? 50;

  function handleAddToCart() {
    addToCart({
      name: product.name,
      price: product.price,
      initialprice: product.initialprice,
      razorpayItemId: product.razorpayItemId,
      description: product.description,
      image: product.image,
      rating: product.rating ?? 5,
    });
    toast.success(`${product.displayName} added to cart!`);
    if (typeof window !== "undefined" && (window as any).fbq) {
      (window as any).fbq("track", "AddToCart", {
        content_name: product.name,
        value: parseFloat(product.price.replace(/[^\d.]/g, "")),
        currency: "INR",
      });
    }
    setAddedToCart(true);
    setTimeout(() => setAddedToCart(false), 2000);
  }

  function handleBuyNow() {
    onBuyNow({
      name: product.name,
      price: product.price,
      initialprice: product.initialprice,
      razorpayItemId: product.razorpayItemId,
      description: product.description,
      image: product.image,
      rating: product.rating ?? 5,
    });
  }

  return (
    <motion.div
      className="group relative flex flex-col overflow-hidden rounded-[32px] bg-white"
      style={{
        boxShadow: "0 2px 16px 0 rgba(11,63,68,0.08), 0 1px 3px 0 rgba(11,63,68,0.06)",
      }}
      initial={{ opacity: 0, y: 48 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.55, delay: index * 0.1, ease: [0.22, 1, 0.36, 1] }}
      whileHover={{
        y: -6,
        boxShadow: "0 20px 48px 0 rgba(11,63,68,0.18), 0 4px 12px 0 rgba(11,63,68,0.10)",
        transition: { duration: 0.25, ease: "easeOut" },
      }}
    >
      {/* ── IMAGE ZONE ──────────────────────────────────── */}
      {/* overflow-hidden only on the image container so the card border stays visible */}
      <div
        className="relative overflow-hidden"
        style={{
          height: 260,
          border: "16px solid #e0e0e3",
          borderTopLeftRadius: "32px",
          borderTopRightRadius: "32px",
        }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={product.image}
          alt={product.displayName}
          className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.06]"
        />

        {/* Bottom scrim */}
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            background: "linear-gradient(to bottom, transparent 45%, rgba(255,255,255,0.18) 100%)",
          }}
        />

        {/* Tag pill — top-left */}
        <div
          className="absolute left-4 top-4 z-10 flex items-center rounded-full px-3.5 py-1.5 text-[11px] font-extrabold uppercase tracking-[0.08em] text-[#3d3b40] shadow-lg"
          style={{ backgroundColor: TAG_COLOR }}
        >
          {product.tag}
        </div>

        {/* Discount bubble — top-right */}
        {product.discount && (
          <div
            className="absolute right-4 top-4 z-10 flex h-12 w-12 items-center justify-center rounded-full text-center text-[11px] font-extrabold leading-tight text-[#3d3b40] shadow-lg"
            style={{ backgroundColor: TAG_COLOR }}
          >
            25%
            <br />
            off
          </div>
        )}
      </div>

      {/* ── CONTENT ZONE ────────────────────────────────── */}
      <div className="flex flex-1 flex-col px-5 pb-5 pt-4">
        {/* Name */}
        <h3
          className="font-heading text-[18px] font-extrabold leading-tight tracking-tight"
          style={{ color: TEXT_DARK }}
        >
          {product.displayName}
        </h3>

        {/* Description */}
        <p
          className="mt-1.5 line-clamp-2 font-sans text-[13.5px] leading-relaxed"
          style={{ color: TEXT_DARK, opacity: 0.65 }}
        >
          {product.description}
        </p>

        {/* Stars — keep original gold color, review count in TEXT_DARK */}
        <div className="mt-3 flex items-center gap-2">
          <div className="flex items-center gap-0.5">
            {Array.from({ length: 5 }).map((_, i) => (
              <svg key={i} className="h-3.5 w-3.5" viewBox="0 0 20 20" fill={GOLD}>
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
            ))}
          </div>
          <span className="font-sans text-xs" style={{ color: TEXT_DARK, opacity: 0.5 }}>
            ({reviews})
          </span>
        </div>

        {/* Price */}
        <div className="mt-4 flex items-baseline gap-2">
          {product.isSeries && (
            <span
              className="font-sans text-sm font-medium"
              style={{ color: TEXT_DARK, opacity: 0.5 }}
            ></span>
          )}
          <span
            className="font-heading text-[26px] font-extrabold leading-none tracking-tight"
            style={{ color: TEXT_DARK }}
          >
            {product.isSeries ? "₹249" : product.price}
          </span>
          {product.initialprice && !product.isSeries && (
            <span
              className="font-sans text-sm line-through"
              style={{ color: TEXT_DARK, opacity: 0.35 }}
            >
              {product.initialprice}
            </span>
          )}
        </div>

        <div className="min-h-[12px] flex-1" />

        {/* ── BUTTONS ─────────────────────────────────── */}
        <div className="mt-4 flex flex-col gap-2.5">
          {/* Buy Now */}
          <button
            onClick={handleBuyNow}
            className="hs3-buy-btn relative flex w-full items-center justify-center rounded-full py-3 text-[14px] font-extrabold"
          >
            <span className="relative flex items-center gap-2">
              Buy Now
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

          {/* Add to Cart */}
          <button
            onClick={handleAddToCart}
            className={`hs3-cart-btn flex w-full items-center justify-center gap-2 rounded-full py-3 text-[14px] font-extrabold${addedToCart ? "hs3-cart-btn--added" : ""}`}
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
        </div>
      </div>
    </motion.div>
  );
}

// ─────────────────────────────────────────────────────────────────
// Section
// ─────────────────────────────────────────────────────────────────
export default function ProductShopSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });

  const [checkoutProduct, setCheckoutProduct] = useState<HeroProductConfig | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  function handleBuyNow(p: HeroProductConfig) {
    setCheckoutProduct(p);
    setIsModalOpen(true);
  }

  function handleModalClose() {
    setIsModalOpen(false);
    setTimeout(() => setCheckoutProduct(null), 300);
  }

  return (
    <>
      {/* Inject button styles */}
      <style>{cardStyles}</style>

      <section
        id="shop"
        className="relative w-full overflow-hidden bg-brand-tealDark"
        // brand-teal-dark color
        ref={ref}
      >
        {/* No other background colors - only brand-teal-dark */}

        <div className="relative px-4 py-20 md:mx-auto md:max-w-[82vw] lg:mx-auto lg:max-w-[82vw] lg:px-8">
          {/* ── Heading ── */}
          <motion.div
            className="mb-14 text-center"
            initial={{ opacity: 0, y: 32 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 32 }}
            transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
          >
            <p className="mb-3 font-sans text-[25px] font-bold uppercase tracking-[0.2em] text-[#ffffff]">
              Shop the Range
            </p>
            <h2 className="headingstyle font-heading font-extrabold text-white">
              Pick your kind of fun.
            </h2>
            <p className="textstyles mx-auto mt-3 max-w-lg font-sans text-white/55">
              Every game and book builds real thinking skills. Choose what fits your child best.
            </p>
          </motion.div>

          {/* ── Grid ── */}
          <div className="grid grid-cols-1 gap-7 sm:grid-cols-2 xl:grid-cols-4">
            {FEATURED.map((product, i) => (
              <ProductCard
                key={product.razorpayItemId}
                product={product}
                index={i}
                onBuyNow={handleBuyNow}
              />
            ))}
          </div>

          {/* ── Footer note ── */}
          <motion.p
            className="mt-12 text-center font-sans text-xs text-white/35"
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : { opacity: 0 }}
            transition={{ delay: 0.7, duration: 0.5 }}
          >
            All prices include GST &nbsp;·&nbsp; Free shipping on orders above ₹499
          </motion.p>
        </div>
      </section>

      {checkoutProduct && (
        <HeroCheckoutModal
          isOpen={isModalOpen}
          onClose={handleModalClose}
          product={checkoutProduct}
        />
      )}
    </>
  );
}

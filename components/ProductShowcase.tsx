"use client";

declare global {
  interface Window {
    Razorpay?: any;
    fbq?: (...args: any[]) => void;
  }
}

import Image from "next/image";
import React from "react";
import Script from "next/script";
import { useCart } from "@/components/CartContext";
import toast from "react-hot-toast";
import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import HeroCheckoutModal, { HeroProductConfig } from "@/components/HeroCheckoutModal";

const products = [
  {
    name: "Prime Time",
    price: "₹1,499",
    initialprice: undefined,
    razorpayItemId: "item_RNn1BJlJAJ9sM8",
    description: "Prime Time Board Game",
    image: "https://ik.imagekit.io/pratik11/PRIME-TIME-HERO-IMAGE.png?updatedAt=1781163250655",
    rating: 5,
    specialOffer: "",
    category: "games",
  },
  {
    name: "Turn the Tables",
    price: "₹299",
    initialprice: "₹399",
    razorpayItemId: "item_RsD9AhoF8idQ21",
    description:
      "An exciting multiplication-based card game where players match numbers on cards to outplay their opponents.",
    image: "https://ik.imagekit.io/pratik11/TURN-THE-TABLE-BOX-IMAGE.png?updatedAt=1781172932797",
    rating: 5,
    specialOffer: "",
    category: "games",
  },
  {
    name: "Logicoland Set (All Volumes)",
    price: "₹999",
    initialprice: undefined,
    razorpayItemId: "item_SSxJhDUqb7HTiy",
    description: "Complete Logicoland set including all volumes for holistic learning.",
    image: "https://ik.imagekit.io/pratik11/LOGICOLAND-HERO-IMAGE.png?updatedAt=1781163914607",
    rating: 5,
    specialOffer: "",
    category: "set",
  },
  {
    name: "Logicoland - Volume 1",
    price: "₹249",
    initialprice: "₹299",
    razorpayItemId: "item_S4UBymXQ91Vmk4",
    description: "Logicoland Volume 1",
    image:
      "https://ik.imagekit.io/pratik11/VERTICAL%20BOOK%20COVER%20MOCKUP%20VOLUNE%201.png?updatedAt=1781593082057",
    rating: 5,
    specialOffer: "",
    category: "books",
  },
  {
    name: "Logicoland - Volume 2",
    price: "₹249",
    initialprice: "₹299",
    razorpayItemId: "item_RNn0h9rGIq8zOL",
    description: "Logicoland Volume 2",
    image:
      "https://ik.imagekit.io/pratik11/VERTICAL%20BOOK%20COVER%20MOCKUP%20VOLUNE%202.png?updatedAt=1781593082057",
    rating: 5,
    specialOffer: "",
    category: "books",
  },
  {
    name: "Logicoland - Volume 3",
    price: "₹249",
    initialprice: "₹299",
    razorpayItemId: "item_SSxGzOM6REipuz",
    description: "Logicoland Volume 3",
    image:
      "https://ik.imagekit.io/pratik11/VERTICAL%20BOOK%20COVER%20MOCKUP%20VOLUNE%203.png?updatedAt=1781593082057",
    rating: 5,
    specialOffer: "",
    category: "books",
  },
  {
    name: "Logicoland - Volume 4",
    price: "₹249",
    initialprice: "₹299",
    razorpayItemId: "item_SSxHO3cngCSldC",
    description: "Logicoland Volume 4",
    image:
      "https://ik.imagekit.io/pratik11/VERTICAL%20BOOK%20COVER%20MOCKUP%20VOLUNE%204.png?updatedAt=1781593082057",
    rating: 5,
    specialOffer: "",
    category: "books",
  },
  {
    name: "Logicoland - Volume 5",
    price: "₹249",
    initialprice: "₹299",
    razorpayItemId: "item_SSxHltEcqtYsJ1",
    description: "Logicoland Volume 5",
    image:
      "https://ik.imagekit.io/pratik11/VERTICAL%20BOOK%20COVER%20MOCKUP%20VOLUNE%205.png?updatedAt=1781593082057",
    rating: 5,
    specialOffer: "",
    category: "books",
  },
  {
    name: "Logicoland Volume 1 Bundle - 20 Books",
    price: "₹4000",
    initialprice: undefined,
    razorpayItemId: "item_RVa7Osutc07pfB",
    description:
      "Perfect return gift, buy a set of 20 Logicoland books together for just 4000, which is 200 per copy.",
    image: "https://ik.imagekit.io/pratik2002/logicolandv2_4oprmp0lO?updatedAt=1756947338913",
    rating: 5,
    specialOffer: "",
    category: "bundles",
  },
  {
    name: "Logicoland Volume 2 Bundle - 20 Books",
    price: "₹4000",
    initialprice: undefined,
    razorpayItemId: "item_S4UDQe8qCtOp21",
    description:
      "Perfect return gift, buy a set of 20 Logicoland Volume 2 books together for just 4000, which is 200 per copy.",
    image:
      "https://ik.imagekit.io/pratik2002/VOLUMNE%202/LOGICOLAND%20SUDOKU%20VOLUMNE%202%20STACK%20COVER%20MOCKUP.png?updatedAt=1773906051069",
    rating: 5,
    specialOffer: "",
    category: "bundles",
  },
  {
    name: "Logicoland Volume 3 Bundle - 20 Books",
    price: "₹4000",
    initialprice: undefined,
    razorpayItemId: "item_ST2GJDox7LUaVH",
    description:
      "Perfect return gift, buy a set of 20 Logicoland Volume 3 books together for just 4000, which is 200 per copy.",
    image:
      "https://ik.imagekit.io/pratik2002/VOLUMNE%203/LOGICOLAND%20SUDOKU%20VOLUMNE%203%20STACK%20COVER%20MOCKUP.png?updatedAt=1773906081265",
    rating: 5,
    specialOffer: "",
    category: "bundles",
  },
  {
    name: "Logicoland Volume 4 Bundle - 20 Books",
    price: "₹4000",
    initialprice: undefined,
    razorpayItemId: "item_ST2GnU6n3qjAEc",
    description:
      "Perfect return gift, buy a set of 20 Logicoland Volume 4 books together for just 4000, which is 200 per copy.",
    image:
      "https://ik.imagekit.io/pratik2002/VOLUMNE%204/LOGICOLAND%20SUDOKU%20VOLUMNE%204%20STACK%20COVER%20MOCKUP.png?updatedAt=1773906115914",
    rating: 5,
    specialOffer: "",
    category: "bundles",
  },
  {
    name: "Logicoland Volume 5 Bundle - 20 Books",
    price: "₹4000",
    initialprice: undefined,
    razorpayItemId: "item_ST2HEofqR6OCm6",
    description:
      "Perfect return gift, buy a set of 20 Logicoland Volume 5 books together for just 4000, which is 200 per copy.",
    image:
      "https://ik.imagekit.io/pratik2002/VOLUMNE%205/LOGICOLAND%20SUDOKU%20VOLUMNE%205%20STACK%20COVER%20MOCKUP.png?updatedAt=1773906134668",
    rating: 5,
    specialOffer: "",
    category: "bundles",
  },
];

const tabs = [
  { key: "all", label: "All Products" },
  { key: "games", label: "Games" },
  { key: "books", label: "Logicoland Books" },
  { key: "bundles", label: "Bundles" },
  { key: "set", label: "Complete Set" },
];



const ProductShowcase = () => {
  const { addToCart } = useCart();
  const [itemDetails, setItemDetails] = useState<
    Record<string, { tax_rate?: number; hsn_code?: string }>
  >({});
  const [activeTab, setActiveTab] = useState("all");
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  const [checkoutProduct, setCheckoutProduct] = useState<HeroProductConfig | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  function handleBuyNow(product: (typeof products)[0]) {
    setCheckoutProduct({
      name: product.name,
      price: product.price,
      initialprice: product.initialprice,
      razorpayItemId: product.razorpayItemId,
      description: product.description,
      image: product.image,
      rating: product.rating,
    });
    setIsModalOpen(true);
  }

  function handleModalClose() {
    setIsModalOpen(false);
    setTimeout(() => setCheckoutProduct(null), 300);
  }

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    async function fetchAllItems() {
      try {
        const res = await fetch("/api/razorpay-items");
        const data = await res.json();
        if (data.success && Array.isArray(data.items)) {
          const details: Record<string, { tax_rate?: number; hsn_code?: string }> = {};
          for (const item of data.items) {
            details[item.id] = { tax_rate: item.tax_rate, hsn_code: item.hsn_code };
          }
          setItemDetails(details);
        }
      } catch (e) {
        console.error("[Razorpay API Error]", e);
      }
    }
    fetchAllItems();
  }, []);

  const handleImageClick = (productName: string) => {
    if (productName === "Prime Time") {
      router.push("products/691ae2894bd7d41a1fd0c785");
    }
  };

  const filteredProducts =
    activeTab === "all" ? products : products.filter((p) => p.category === activeTab);

  const activeLabel = tabs.find((t) => t.key === activeTab)?.label ?? "All Products";

  return (
    <>
      <Script src="https://checkout.razorpay.com/v1/checkout.js" strategy="afterInteractive" />

      <section className="bg-[#6A294D] py-16 text-center text-white">
        <div className="mx-auto w-[80vw]">
          <h2 className="mb-4 text-4xl font-bold">Our Products</h2>
          <p className="mx-auto mb-8 max-w-xl text-lg">
            At Logicology we endeavour to make learning fun so that children learn while they play.
          </p>

          {/* ── DESKTOP: pill tabs (unchanged) ─────────────────────────── */}
          <div className="mx-auto mb-10 hidden max-w-2xl flex-wrap justify-center gap-2 px-4 sm:flex">
            {tabs.map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`rounded-full px-6 py-2 text-sm font-medium transition-all ${
                  activeTab === tab.key
                    ? "bg-white text-[#6A294D] shadow-lg"
                    : "bg-white/20 text-white hover:bg-white/30"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* ── MOBILE: custom dropdown ────────────────────────────────── */}
          <div className="mb-6 sm:hidden" ref={dropdownRef}>
            {/* Trigger */}
            <button
              onClick={() => setDropdownOpen((o) => !o)}
              className="flex w-full items-center justify-between rounded-2xl border border-white/20 bg-white/10 px-4 py-3.5 text-left text-white backdrop-blur-sm transition active:bg-white/20"
            >
              <div className="flex items-center gap-3">
                <div>
                  <p className="text-[11px] font-medium uppercase tracking-widest text-white/50">
                    Filter by
                  </p>
                  <p className="text-[15px] font-bold leading-tight">{activeLabel}</p>
                </div>
              </div>
              {/* Chevron */}
              <svg
                className={`h-5 w-5 text-white/70 transition-transform duration-200 ${dropdownOpen ? "rotate-180" : ""}`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            {/* Dropdown panel */}
            {dropdownOpen && (
              <div className="relative z-50 mt-2 overflow-hidden rounded-2xl border border-white/10 bg-[#52163a] shadow-2xl">
                {tabs.map((tab, i) => (
                  <button
                    key={tab.key}
                    onClick={() => {
                      setActiveTab(tab.key);
                      setDropdownOpen(false);
                    }}
                    className={`flex w-full items-center gap-3 px-4 py-3.5 text-left transition
                      ${i !== tabs.length - 1 ? "border-b border-white/10" : ""}
                      ${activeTab === tab.key ? "bg-white/15" : "hover:bg-white/10"}
                    `}
                  >
                    <span className="text-[15px] font-semibold text-white">{tab.label}</span>
                    {activeTab === tab.key && (
                      <svg
                        className="ml-auto h-4 w-4 flex-shrink-0 text-[#fbb041]"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* ── Product Cards Grid ─────────────────────────────────────── */}
          {/*  Mobile: 2 cols · Desktop: 3 cols (unchanged layout logic)   */}
          <div className="grid grid-cols-2 gap-3 px-0 sm:grid-cols-2 sm:gap-7 sm:px-4 md:px-8 lg:grid-cols-3">
            {filteredProducts.map((product, index) => (
              <div
                key={index}
                className="group relative flex w-full flex-col overflow-hidden rounded-2xl bg-white sm:max-w-[300px] sm:rounded-[32px]"
                style={{
                  boxShadow: "0 2px 16px 0 rgba(11,63,68,0.08), 0 1px 3px 0 rgba(11,63,68,0.06)",
                }}
              >
                {/* IMAGE ZONE */}
                <div
                  className="relative cursor-pointer overflow-hidden"
                  style={{
                    border: "10px solid #e0e0e3",
                    borderTopLeftRadius: "inherit",
                    borderTopRightRadius: "inherit",
                  }}
                  onClick={() => handleImageClick(product.name)}
                >
                  {/* Aspect-ratio container: square on mobile, fixed height on desktop */}
                  <div className="relative aspect-square sm:aspect-auto sm:h-[260px]">
                    <Image
                      src={product.image}
                      alt={product.name}
                      fill
                      className="object-cover transition-transform duration-700 group-hover:scale-[1.06]"
                    />
                    <div
                      className="pointer-events-none absolute inset-0"
                      style={{
                        background:
                          "linear-gradient(to bottom, transparent 45%, rgba(255,255,255,0.18) 100%)",
                      }}
                    />
                    {product.specialOffer && (
                      <div className="absolute left-2 top-2 z-10 flex items-center rounded-full bg-[#fbb041] px-2 py-1 text-[9px] font-extrabold uppercase tracking-wide text-[#3d3b40] shadow-lg sm:left-4 sm:top-4 sm:px-3.5 sm:py-1.5 sm:text-[11px]">
                        🎁 OFFER
                      </div>
                    )}
                  </div>
                </div>

                {/* CONTENT ZONE */}
                <div className="flex flex-1 flex-col px-3 pb-3 pt-2.5 text-left sm:px-5 sm:pb-5 sm:pt-4">
                  {/* Name */}
                  <h3 className="font-heading text-[12px] font-extrabold leading-tight tracking-tight text-[#3d3b40] sm:text-[18px]">
                    {product.name}
                  </h3>

                  {/* Description — desktop only */}
                  <p className="mt-1.5 hidden line-clamp-2 font-sans text-[13.5px] leading-relaxed text-[#3d3b40] opacity-65 sm:block">
                    {product.description}
                  </p>

                  {/* Stars */}
                  <div className="mt-1.5 flex items-center gap-0.5 sm:mt-3">
                    {Array.from({ length: product.rating }).map((_, i) => (
                      <svg
                        key={i}
                        className="h-2.5 w-2.5 sm:h-3.5 sm:w-3.5"
                        viewBox="0 0 20 20"
                        fill="#E45C48"
                      >
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                  </div>

                  {/* Price */}
                  <div className="mt-2 flex items-baseline gap-1.5 sm:mt-4 sm:gap-2">
                    <span className="font-heading text-[16px] font-extrabold leading-none tracking-tight text-[#3d3b40] sm:text-[26px]">
                      {product.price}
                    </span>
                    {product.initialprice && (
                      <span className="font-sans text-[10px] text-[#3d3b40] line-through opacity-35 sm:text-sm">
                        {product.initialprice}
                      </span>
                    )}
                  </div>

                  <div className="flex-1" />

                  {/* BUTTONS */}
                  <div className="mt-2.5 flex flex-col gap-1.5 sm:mt-4 sm:gap-2.5">
                    <button
                      className="flex w-full items-center justify-center gap-1 rounded-full bg-[#fbb041] px-2 py-2 text-[11px] font-extrabold text-[#3d3b40] transition hover:bg-[#fa9e15] sm:gap-1.5 sm:px-3 sm:py-3 sm:text-sm"
                      onClick={() => handleBuyNow(product)}
                    >
                      Buy Now
                      <svg
                        className="h-3 w-3 sm:h-4 sm:w-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2.5}
                          d="M9 5l7 7-7 7"
                        />
                      </svg>
                    </button>
                    <button
                      className="w-full rounded-full bg-[#EB6A42] px-2 py-2 text-[11px] font-extrabold text-white transition hover:bg-[#d85b36] sm:px-3 sm:py-3 sm:text-sm"
                      onClick={() => {
                        addToCart(product);
                        toast.success(`${product.name} added to cart!`);
                        if (typeof window !== "undefined" && window.fbq) {
                          window.fbq("track", "AddToCart", {
                            content_name: product.name,
                            value: parseFloat(product.price.replace(/[^\d.]/g, "")),
                            currency: "INR",
                          });
                        }
                      }}
                    >
                      Add to Cart
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <p className="mt-16 text-lg">
            All prices include GST. You will receive a detailed GST invoice after purchase.
          </p>
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
};

export default ProductShowcase;
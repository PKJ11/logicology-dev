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
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import HeroCheckoutModal, { HeroProductConfig } from "@/components/HeroCheckoutModal";

// Sample product data - reordered as requested
const products = [
  {
    name: "Prime Time",
    price: "₹1,499",
    initialprice: undefined,
    razorpayItemId: "item_RNn1BJlJAJ9sM8",
    description: "Prime Time Board Game",
    image: "https://ik.imagekit.io/pratik2002/primetime_imag1.png?updatedAt=1757032084370",
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
      "An exciting multiplication-based card game where players match numbers on cards to outplay their opponents. Special strategy cards like Wild, Up, Down, Turn, and Streak add twists that keep the game fresh and unpredictable.",
    image:
      "https://ik.imagekit.io/pratik11/TURN%20THE%20TABLE%20%20BOX%20MOCKUP.png?updatedAt=1757747148360",
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
    image: "https://ik.imagekit.io/pratik2002/allbooks.JPG",
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
      "https://ik.imagekit.io/pratik2002/VOLUMNE%201/VERTICAL%20BOOK%20COVER%20MOCKUP%20VOLUNE%201.png?updatedAt=1773912123121",
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
      "https://ik.imagekit.io/pratik2002/VOLUMNE%202/VERTICAL%20BOOK%20COVER%20MOCKUP%20VOLUNE%202.png?updatedAt=1773911827421",
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
      "https://ik.imagekit.io/pratik2002/VOLUMNE%203/VERTICAL%20BOOK%20COVER%20MOCKUP%20VOLUNE%203.png?updatedAt=1773906661637",
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
      "https://ik.imagekit.io/pratik2002/VOLUMNE%204/VERTICAL%20BOOK%20COVER%20MOCKUP%20VOLUNE%204.png?updatedAt=1773906764701",
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
      "https://ik.imagekit.io/pratik2002/VOLUMNE%205/VERTICAL%20BOOK%20COVER%20MOCKUP%20VOLUNE%205.png?updatedAt=1773906863478",
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

const ProductShowcase = () => {
  const { addToCart } = useCart();
  const [itemDetails, setItemDetails] = useState<
    Record<string, { tax_rate?: number; hsn_code?: string }>
  >({});
  const [activeTab, setActiveTab] = useState("all");
  const router = useRouter();

  // ── Buy Now modal state ──────────────────────────────────
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
  // ────────────────────────────────────────────────────────

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
    activeTab === "all" ? products : products.filter((product) => product.category === activeTab);

  const tabs = [
    { key: "all", label: "All Products" },
    { key: "games", label: "Games" },
    { key: "books", label: "Logicoland Books" },
    { key: "bundles", label: "Bundles" },
    { key: "set", label: "Complete Set" },
  ];

  return (
    <>
      <Script src="https://checkout.razorpay.com/v1/checkout.js" strategy="afterInteractive" />

      <section className="bg-[#6A294D] py-16 text-center text-white">
        <div className="mx-auto w-[80vw]">
          <h2 className="mb-4 text-4xl font-bold">Our Products</h2>
          <p className="mx-auto mb-8 max-w-xl text-lg">
            At Logicology we endeavour to make learning fun so that children learn while they play.
          </p>

          {/* Tab Navigation */}
          <div className="mx-auto mb-10 flex max-w-2xl flex-wrap justify-center gap-2 px-4">
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

          {/* Product Cards Grid */}
          <div className="grid grid-cols-1 gap-7 px-4 sm:grid-cols-2 md:px-8 lg:grid-cols-3">
            {filteredProducts.map((product, index) => (
              <div
                key={index}
                className="group relative flex w-full max-w-[300px] flex-col overflow-hidden rounded-[32px] bg-white"
                style={{
                  boxShadow: "0 2px 16px 0 rgba(11,63,68,0.08), 0 1px 3px 0 rgba(11,63,68,0.06)",
                }}
              >
                {/* IMAGE ZONE */}
                <div
                  className="relative cursor-pointer overflow-hidden"
                  style={{
                    height: 260,
                    border: "16px solid #e0e0e3",
                    borderTopLeftRadius: "32px",
                    borderTopRightRadius: "32px",
                  }}
                  onClick={() => handleImageClick(product.name)}
                >
                  <Image
                    src={product.image}
                    alt={product.name}
                    width={400}
                    height={260}
                    className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.06]"
                  />
                  <div
                    className="pointer-events-none absolute inset-0"
                    style={{
                      background:
                        "linear-gradient(to bottom, transparent 45%, rgba(255,255,255,0.18) 100%)",
                    }}
                  />
                  {product.specialOffer && (
                    <div className="absolute left-4 top-4 z-10 flex items-center rounded-full bg-[#fbb041] px-3.5 py-1.5 text-[11px] font-extrabold uppercase tracking-[0.08em] text-[#3d3b40] shadow-lg">
                      🎁 SPECIAL OFFER
                    </div>
                  )}
                </div>

                {/* CONTENT ZONE */}
                <div className="flex flex-1 flex-col px-5 pb-5 pt-4 text-left">
                  <h3 className="font-heading text-[18px] font-extrabold leading-tight tracking-tight text-[#3d3b40]">
                    {product.name}
                  </h3>

                  <p className="mt-1.5 line-clamp-2 font-sans text-[13.5px] leading-relaxed text-[#3d3b40] opacity-65">
                    {product.description}
                  </p>

                  {/* Stars */}
                  <div className="mt-3 flex items-center gap-2">
                    <div className="flex items-center gap-0.5">
                      {Array.from({ length: product.rating }).map((_, i) => (
                        <svg key={i} className="h-3.5 w-3.5" viewBox="0 0 20 20" fill="#E45C48">
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                      ))}
                    </div>
                  </div>

                  {/* Price */}
                  <div className="mt-4 flex items-baseline gap-2">
                    <span className="font-heading text-[26px] font-extrabold leading-none tracking-tight text-[#3d3b40]">
                      {product.price}
                    </span>
                    {product.initialprice && (
                      <span className="font-sans text-sm text-[#3d3b40] line-through opacity-35">
                        {product.initialprice}
                      </span>
                    )}
                  </div>

                  <div className="min-h-[12px] flex-1" />

                  {/* BUTTONS */}
                  <div className="mt-4 flex flex-col gap-2.5">
                    {/* Buy Now */}
                    <button
                      className="flex w-full items-center justify-center gap-1.5 rounded-full bg-[#fbb041] px-3 py-3 text-sm font-extrabold text-[#3d3b40] transition hover:bg-[#fa9e15]"
                      onClick={() => handleBuyNow(product)}
                    >
                      Buy Now
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
                          d="M9 5l7 7-7 7"
                        />
                      </svg>
                    </button>

                    {/* Add to Cart */}
                    <button
                      className="w-full rounded-full bg-[#EB6A42] px-3 py-3 text-sm font-extrabold text-white transition hover:bg-[#d85b36]"
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

      {/* Buy Now Modal */}
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

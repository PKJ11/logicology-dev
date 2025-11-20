"use client";

import { useState } from "react";
import Image from "next/image";
import NavBar from "@/components/NavBar";
import SiteFooter from "@/components/Footer";
import { useCart } from "@/components/CartContext";

// ======================================================
// MAIN PAGE WRAPPER
// ======================================================
export default function PrimeTimeProductPage() {
  return (
    <div className="min-h-screen bg-brand-maroon font-sans text-white">
      <NavBar />
      <main className="space-y-0 pb-20 pt-10">
        <ProductSection />
        <VideoShowcase />
        <ReviewSection />
        <BigAddToCartBanner />
        <CustomerReviews />
      </main>
      <SiteFooter />
    </div>
  );
}

// ======================================================
// 1️⃣ PRODUCT HERO SECTION (MAROON)
// ======================================================
const ProductSection = () => {
  const { addToCart } = useCart();
  const [added, setAdded] = useState(false);

  // ✅ PRODUCT DETAILS (needed for the hero section)
  const product = {
    name: "Prime Time™ – Math Strategy Game",
    description:
      "A lightning-quick numbers game that rewards smart matching and prime-factor insights. Perfect for 2–6 players, ages 8+.",
    price: "₹1,499",
    initialprice: "₹2,499",
    discount: "40%",
    razorpayItemId: "prime-time-logicology-01",
    images: [
      "https://ik.imagekit.io/pratik11/PRIME-TIME-SLIDER-1-NEW-DESKTOP-VIEW.png",
      "https://ik.imagekit.io/pratik11/PRIME-TIME-FOLD-2-IMAGE.png",
      "https://ik.imagekit.io/pratik11/g3.jpg",
      "https://ik.imagekit.io/pratik11/g4.jpg",
      "https://ik.imagekit.io/pratik11/g2.jpg",
    ],
  };

  // ✅ MAIN IMAGE STATE (required for switching thumbnails)
  const [mainImage, setMainImage] = useState(product.images[0]);

  const handleAddToCart = () => {
    addToCart({
      name: product.name,
      price: product.price,
      initialprice: product.initialprice,
      description: product.description,
      image: mainImage,
      razorpayItemId: product.razorpayItemId,
      rating: 5,
    });

    setAdded(true);
    setTimeout(() => setAdded(false), 2500);
  };

  return (
    <section className="w-full border-b-4 border-gray-300 bg-[#6d2e46] py-16">
      <div className="mx-auto grid max-w-[90vw] grid-cols-1 items-center gap-12 md:grid-cols-2">
        {/* LEFT — WHITE OUTER FRAME WITH REAL IMAGES */}
        <div className="flex justify-center">
          {/* OUTER WHITE FRAME */}
          <div className="aspect-[4/5] w-[95%] overflow-hidden rounded-[40px] border-[20px] border-white bg-white">
            {/* INNER TWO-COLUMN LAYOUT */}
            <div className="flex h-full w-full gap-4 p-4">
              {/* LEFT: MAIN IMAGE CONTAINER (≈80%) */}
              <div className="relative flex-[4] overflow-hidden rounded-[30px]">
                <Image src={mainImage} alt="Prime Time Game Image" fill className="object-cover" />
              </div>

              {/* RIGHT: THUMBNAIL COLUMN (≈15%) */}
              <div className="flex flex-[1] flex-col gap-4">
                {product.images.slice(0, 4).map((src, i) => (
                  <button
                    key={i}
                    onClick={() => setMainImage(src)}
                    className={`relative w-full flex-1 overflow-hidden rounded-[25px] border-[3px] transition-all ${
                      mainImage === src
                        ? "scale-105 border-[#b44b73]"
                        : "border-white hover:border-[#b44b73]"
                    } `}
                  >
                    <div className="relative h-full w-full overflow-hidden rounded-[25px] bg-white">
                      <Image src={src} alt={`thumbnail-${i}`} fill className="object-cover" />
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT SIDE — TEXT + PRICING */}
        <div className="text-white">
          <h1 className="font-heading text-4xl font-bold leading-tight">
            Prime Time™ – Where Kids Learn Effortlessly and Adults Get Hooked
          </h1>

          <p className="mt-4 font-sans text-lg opacity-90">{product.description}</p>

          <div className="mb-6 mt-6 w-full border-t border-white/30"></div>

          {/* PRICE ROW */}
          <div className="flex items-center gap-4">
            <p className="font-heading text-4xl font-bold">{product.price}</p>
            <p className="font-sans text-xl text-gray-300 line-through">{product.initialprice}</p>
            <span className="rounded-md bg-white px-3 py-1 font-sans text-sm font-bold text-[#6d2e46]">
              SAVE {product.discount}
            </span>
          </div>

          <p className="mt-1 font-sans text-sm text-white/80">(Inclusive of all taxes)</p>

          <button
            onClick={handleAddToCart}
            className={`mt-6 rounded-full px-10 py-3 font-sans text-lg font-semibold shadow-lg transition-all ${
              added
                ? "scale-105 bg-[#b44b73] text-white"
                : "bg-[#b44b73] text-white hover:bg-white hover:text-[#6d2e46]"
            }`}
          >
            {added ? "✓ Added to cart" : "Add to cart"}
          </button>

          <p className="mt-3 font-sans text-sm text-white">
            🚚 Free shipping • Delivers in 3–5 days
          </p>

          <div className="mb-6 mt-6 w-full border-t border-white/30"></div>

          {/* ICON ROW */}
          <div className="flex gap-10">
            {["Ages 8+", "2–6 players", "Ages 8+", "2–6 players"].map((label, i) => (
              <div key={i} className="flex flex-col items-center text-center">
                <div className="flex h-[65px] w-[65px] items-center justify-center rounded-full bg-[#b44b73] text-3xl text-white">
                  👥
                </div>
                <p className="mt-2 font-sans text-sm">{label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

// ======================================================
// 2️⃣ VIDEO SHOWCASE (GREY)
// ======================================================
const VideoShowcase = () => {
  const [activeVideo, setActiveVideo] = useState<string | null>(null);

  const videos = [
    {
      video: "https://ik.imagekit.io/pratik/Prime%20Numbers%20(Reel%201)_2.mp4",
      thumbnail: "https://ik.imagekit.io/pratik11/1.1.jpg",
    },
    {
      video: "https://ik.imagekit.io/pratik/Prime%20Numbers%20(Reel%201)_1.mp4",
      thumbnail: "https://ik.imagekit.io/pratik11/1.2.jpg",
    },
    {
      video: "https://ik.imagekit.io/pratik/Prime%20Numbers%20(Reel%201)_3.mp4",
      thumbnail: "https://ik.imagekit.io/pratik11/1.3.jpg",
    },
  ];

  return (
    <section className="w-full border-b-4 border-gray-300 bg-gray-100 py-16">
      <div className="mx-auto max-w-[85vw]">
        {/* WHITE CONTAINER */}
        <div className="rounded-3xl bg-white p-12 shadow-lg">
          <h2 className="headingstyle mb-10 text-center font-heading font-bold text-gray-800">
            Watch Prime Time™ in Action
          </h2>

          <div className="flex snap-x gap-6 overflow-x-auto pb-4">
            {videos.map((v, idx) => (
              <div
                key={idx}
                className="rounded-card relative aspect-[9/16] w-64 flex-shrink-0 snap-center overflow-hidden border-2 border-gray-200 bg-gray-100 shadow-xl md:w-72"
              >
                {activeVideo === v.video ? (
                  <video
                    src={v.video}
                    controls
                    autoPlay
                    playsInline
                    className="absolute inset-0 h-full w-full object-cover"
                    onEnded={() => setActiveVideo(null)}
                  />
                ) : (
                  <>
                    <Image
                      src={v.thumbnail}
                      alt={`Video ${idx + 1}`}
                      fill
                      className="object-cover"
                    />
                    <button
                      onClick={() => setActiveVideo(v.video)}
                      className="absolute inset-0 flex items-center justify-center bg-black/40 transition hover:bg-black/50"
                    >
                      <span className="text-4xl text-white">▶</span>
                    </button>
                  </>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

// ======================================================
// 3️⃣ SHORT REVIEWS SECTION (MAROON)
// =====================================================

const ReviewSection = () => {
  const reviews = [
    {
      id: 1,
      name: "Riya",
      text: "Prime Time™ makes math fun and interactive. My kids actually compete to find factors!",
    },
    {
      id: 2,
      name: "Arjun",
      text: "A brilliant blend of learning and laughter. Family game nights got a whole new twist!",
    },
    {
      id: 3,
      name: "Meera",
      text: "No screens, just logic and fun. It's addictive and educational — perfect combo!",
    },
    {
      id: 4,
      name: "Riya",
      text: "Prime Time™ makes math fun and interactive. My kids actually compete to find factors!",
    },
  ];

  return (
    <section className="w-full border-b-4 border-gray-300 bg-[#6d2e46] py-20">
      <div className="mx-auto flex w-[60%] flex-col gap-16">
        {/* ⭐ ROW 1 — two reviews */}
        <div className="flex justify-around">
          <ReviewCard review={reviews[0]} />
          <ReviewCard review={reviews[1]} />
        </div>

        {/* ⭐ ROW 2 — review, center heading, review */}
        <div className="flex items-center justify-around">
          <ReviewCard review={reviews[2]} />

          {/* CENTER HEADING */}
          <h2 className="mx-6 text-center font-heading text-3xl font-bold text-white">
            Quotes from <br /> Real Customers
          </h2>

          <ReviewCard review={reviews[3]} />
        </div>

        {/* ⭐ ROW 3 — two reviews */}
        <div className="flex justify-around">
          <ReviewCard review={reviews[0]} />
          <ReviewCard review={reviews[1]} />
        </div>
      </div>
    </section>
  );
};

type ReviewProps = {
  review: {
    name: string;
    text: string;
  };
};

/* ⭐ Reusable Review Card Component */
const ReviewCard = ({ review }: ReviewProps) => (
  <div className="flex w-[350px] gap-4 rounded-3xl border border-white/20 bg-white/10 p-5 text-white shadow-lg">
    {/* LEFT — USER ICON (WHITE CIRCLE WITH OUTLINE STYLE) */}
    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white/20">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth={1.8}
        stroke="white"
        className="h-7 w-7 opacity-90"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14c-4 0-7 2-7 4v1h14v-1c0-2-3-4-7-4z"
        />
      </svg>
    </div>

    {/* RIGHT — NAME, TEXT, STARS */}
    <div className="flex flex-col">
      <p className="font-sans text-sm font-semibold text-white">{review.name}</p>

      <p className="mt-1 w-[85%] font-sans text-xs leading-snug text-white/80">{review.text}</p>

      <div className="mt-3 flex gap-1 text-base text-yellow-300">★★★★☆</div>
    </div>
  </div>
);

// ======================================================
// 4️⃣ BIG ADD-TO-CART CTA (GREY)
// ======================================================
const BigAddToCartBanner = () => {
  const img = "https://ik.imagekit.io/pratik11/PRIME-TIME-SLIDER-1-NEW-DESKTOP-VIEW.png";

  return (
    <section className="w-full border-b-4 border-gray-300 bg-gray-100 py-20">
      <div className="mx-auto max-w-[85vw]">
        {/* WHITE CONTAINER */}
        <div className="rounded-3xl bg-white p-12 shadow-lg">
          <div className="grid grid-cols-1 items-center gap-10 md:grid-cols-2">
            {/* LEFT SIDE — TEXT + BUTTON */}
            <div className="text-left">
              <h2 className="font-heading text-3xl font-bold text-gray-900">
                How you
                <br />
                Benefit?
              </h2>

              <p className="mt-4 max-w-sm font-sans text-gray-600">
                At Logicology we endeavour to make learning fun so that children learn while they
                play.
              </p>

              <button className="mt-6 rounded-full bg-[#6d2e46] px-6 py-2 font-sans text-white transition hover:bg-[#b44b73]">
                Learn more
              </button>
            </div>

            {/* RIGHT SIDE — MAROON BORDER FRAME WITH IMAGE INSIDE */}
            <div className="flex justify-center">
              <div className="aspect-square w-[90%] overflow-hidden rounded-[35px] border-[12px] border-[#6d2e46] p-3">
                <div className="relative h-full w-full overflow-hidden rounded-[25px] bg-white">
                  <Image src={img} alt="Benefit Image" fill className="object-cover" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

// ======================================================
// 5️⃣ DETAILED REVIEWS SECTION (MAROON)
// ======================================================
const CustomerReviews = () => {
  const overallRating = 4.8;
  const totalReviews = 181;

  const ratingBreakdown = [
    { stars: 5, count: 126 },
    { stars: 4, count: 54 },
    { stars: 3, count: 1 },
    { stars: 2, count: 0 },
    { stars: 1, count: 0 },
  ];

  const reviews = [
    {
      name: "Shaheen Taj",
      verified: true,
      rating: 5,
      date: "10/04/2025",
      text: "Prime Time™ is an amazing educational board game — teaches math logic playfully.",
    },
    {
      name: "Karishma",
      verified: true,
      rating: 5,
      date: "10/01/2025",
      text: "Very enjoyable for kids and adults. Smooth gameplay and clever concept!",
    },
  ];

  return (
    <section className="w-full bg-[#6d2e46] py-16">
      <div className="mx-auto max-w-[85vw]">
        <h2 className="mb-14 text-center font-heading text-3xl font-bold">Customer Reviews</h2>

        <div className="rounded-card mb-16 border border-gray-300 bg-white/10 p-10 shadow-xl">
          <div className="flex flex-col items-center gap-10 md:flex-row">
            <div className="flex-1 text-center md:text-left">
              <div className="mb-2 flex justify-center gap-2 text-2xl text-brand-yellow md:justify-start">
                {"★★★★★"}
              </div>
              <p className="font-heading text-xl font-semibold">{overallRating} out of 5</p>
              <p className="mt-1 font-sans text-sm text-white/70">
                Based on {totalReviews} reviews
              </p>
            </div>

            <div className="w-full flex-1 space-y-2">
              {ratingBreakdown.map((item, i) => (
                <div key={i} className="flex items-center gap-3">
                  <span className="w-12 font-sans text-sm">{item.stars}★</span>

                  <div className="h-3 w-full overflow-hidden rounded-full bg-white/20">
                    <div
                      className="h-3 bg-brand-yellow"
                      style={{ width: `${(item.count / totalReviews) * 100}%` }}
                    ></div>
                  </div>

                  <span className="w-10 font-sans text-sm">{item.count}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* INDIVIDUAL REVIEWS */}
        <div className="space-y-10">
          {reviews.map((r, i) => (
            <div
              key={i}
              className="flex flex-col justify-between border-b border-white/20 pb-8 md:flex-row"
            >
              <div>
                <div className="mb-1 flex items-center gap-2 text-brand-yellow">
                  {"★★★★★"}
                  <span className="ml-2 font-sans font-semibold text-white">{r.name}</span>
                  {r.verified && (
                    <span className="rounded bg-white px-2 py-0.5 font-sans text-xs font-bold text-brand-maroon">
                      Verified
                    </span>
                  )}
                </div>

                <p className="max-w-3xl font-sans text-sm text-white/90">{r.text}</p>
              </div>

              <p className="mt-4 font-sans text-sm text-white/70 md:mt-0">{r.date}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

"use client";

import { useState } from "react";
import Image from "next/image";
import NavBar from "@/components/NavBar";
import SiteFooter from "@/components/Footer";
import { useCart } from "@/components/CartContext";

// ---------- MAIN PAGE ----------
export default function PrimeTimeProductPage() {
  return (
    <div className="bg-brand-grayBg min-h-screen font-sans">
      <NavBar />
      <main className="space-y-20">
        <ProductSection />
        <VideoShowcase />
        <ReviewSection />
        <BigAddToCartBanner/>
        <CustomerReviews />
      </main>
      <SiteFooter />
    </div>
  );
}

// ---------- 1️⃣ PRODUCT SECTION ----------

const ProductSection = () => {
  const { addToCart } = useCart();
  const [added, setAdded] = useState(false);

  const product = {
    name: "Prime Time™ – Math Strategy Game",
    price: "₹1,499",
    initialprice: "₹2,499",
    discount: "40%",
    description:
      "A lightning-quick numbers game that rewards smart matching and prime-factor insights. Perfect for 2–6 players, ages 8+.",
    images: [
      "https://ik.imagekit.io/pratik11/PRIME-TIME-SLIDER-1-NEW-DESKTOP-VIEW.png?updatedAt=1758442535210",
      "https://ik.imagekit.io/pratik11/PRIME-TIME-FOLD-2-IMAGE.png?updatedAt=1758352229897",
      "https://ik.imagekit.io/pratik11/g3.jpg?updatedAt=1758632390325",
      "https://ik.imagekit.io/pratik11/g4.jpg?updatedAt=1758632390353",
    ],
    razorpayItemId: "prime-time-logicology-01",
  };

  // ✅ Main Image State
  const [mainImage, setMainImage] = useState(product.images[0]);

  const handleAddToCart = () => {
    addToCart({
      name: product.name,
      price: product.price,
      initialprice: product.initialprice,
      description: product.description,
      image: mainImage, // ✅ will add the current main image
      razorpayItemId: product.razorpayItemId,
      rating: 5,
    });

    setAdded(true);
    setTimeout(() => setAdded(false), 2500);
  };

  return (
    <section className="max-w-[80vw] mx-auto grid md:grid-cols-2 gap-10 pt-16">
      {/* LEFT: GALLERY */}
      <div>
        {/* MAIN IMAGE */}
        <div className="relative w-full aspect-square rounded-3xl overflow-hidden shadow-xl group">
          <Image
            src={mainImage}
            alt={product.name}
            fill
            className="object-cover transition-opacity duration-300 group-hover:opacity-95"
            priority
          />
        </div>

        {/* THUMBNAIL GRID */}
        <div className="grid grid-cols-4 gap-3 mt-3">
          {product.images.map((src, i) => (
            <div
              key={i}
              onClick={() => setMainImage(src)}
              className={`relative aspect-square rounded-xl overflow-hidden cursor-pointer border transition-all duration-200 ${
                mainImage === src ? "border-brand-teal scale-105" : "border-gray-200 hover:border-gray-400"
              }`}
            >
              <Image
                src={src}
                alt={`thumbnail-${i}`}
                fill
                className={`object-cover transition-transform duration-200 ${
                  mainImage === src ? "scale-105" : "hover:scale-105"
                }`}
              />
            </div>
          ))}
        </div>
      </div>

      {/* RIGHT: INFO */}
      <div className="flex flex-col justify-center">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3 leading-snug">
          Prime Time™ – Where Kids Learn Effortlessly and Adults Get Hooked
        </h1>
        <p className="text-gray-700 text-lg mb-4">{product.description}</p>

        <div className="bg-white rounded-3xl p-5 shadow-soft w-full md:max-w-sm">
          <div className="flex items-end gap-2">
            <p className="text-3xl font-bold text-brand-teal">{product.price}</p>
            <p className="text-gray-400 line-through text-lg">{product.initialprice}</p>
            <span className="text-brand-coral font-semibold">SAVE {product.discount}</span>
          </div>
          <p className="text-gray-500 text-sm mt-1">(Inclusive of all taxes)</p>

          <button
            onClick={handleAddToCart}
            className={`mt-5 w-full rounded-full py-3 font-medium shadow-soft transition ${
              added
                ? "bg-brand-coral text-white"
                : "bg-black text-white hover:bg-brand-teal"
            }`}
          >
            {added ? "✅ Added to Cart" : "Add to Cart"}
          </button>
          <p className="text-sm text-gray-600 mt-3 text-center">
            🚚 Free shipping • Delivers in 3–5 days
          </p>
        </div>

        {/* GAME DETAILS */}
        <div className="mt-8 space-y-3">
          <div className="bg-white rounded-3xl p-4 shadow-soft flex items-center gap-3">
            <span className="text-2xl">🎲</span>
            <p className="font-medium text-gray-800">
              Suitable for 2–6 players | Ages 8+
            </p>
          </div>
          <div className="bg-white rounded-3xl p-4 shadow-soft flex items-center gap-3">
            <span className="text-2xl">📦</span>
            <p className="font-medium text-gray-800">
              Includes game cards, instruction booklet + blank cards for lost ones
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};



// ---------- 3️⃣ BIG ADD-TO-CART CTA SECTION ----------
const  BigAddToCartBanner=() => {
  const { addToCart } = useCart();
  const [added, setAdded] = useState(false);

  const product = {
    name: "Prime Time™ – Math Strategy Game",
    price: "₹1,499",
    initialprice: "₹2,499",
    discount: "40%",
    image:
      "https://ik.imagekit.io/pratik11/PRIME-TIME-SLIDER-1-NEW-DESKTOP-VIEW.png?updatedAt=1758442535210",
    razorpayItemId: "prime-time-logicology-01",
  };

  const handleAdd = () => {
    addToCart({
  name: product.name,
  price: product.price,
  initialprice: product.initialprice,
  description:
    "A lightning-quick numbers game that rewards smart matching and prime-factor insights.",
  image: product.image,
  razorpayItemId: product.razorpayItemId,
  rating: 5, // ✅ Added
});

    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  return (
    <section className="w-full bg-white text-center overflow-hidden py-12">
      {/* --- Centered wrapper --- */}
      <div className="max-w-[80vw] mx-auto">
        {/* --- Product Image Hero --- */}
        <div className="relative w-full bg-white">
          <Image
            src={product.image}
            alt="Prime Time Board Game"
            width={1600}
            height={700}
            priority
            className="w-full h-auto object-contain mx-auto rounded-3xl shadow-soft"
          />
        </div>

        {/* --- Title (White Area) --- */}
        <div className="bg-white py-8">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 tracking-tight">
            Learn Logic. Play Prime Time™
          </h2>
        </div>

        {/* --- Black CTA Strip --- */}
        <div className="bg-black text-white rounded-3xl py-12 px-6 shadow-xl">
          <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center justify-between gap-8">
            {/* Left: Ratings */}
            <div className="flex flex-col items-center md:items-start">
              <div className="flex gap-1 text-yellow-400 text-2xl mb-2">
                {"★★★★★".split("").map((star, i) => (
                  <span key={i}>{star}</span>
                ))}
              </div>
              <p className="text-5xl font-extrabold text-white leading-none">98%</p>
              <p className="text-lg text-gray-300 font-medium">
                Positive Feedback
              </p>
            </div>

            {/* Center: Headline */}
            <div className="text-center flex-1">
              <h3 className="text-3xl md:text-4xl font-bold leading-tight">
                Join{" "}
                <span className="text-brand-teal">100,000+</span> Satisfied Customers
              </h3>
              <p className="text-gray-400 mt-2 text-sm md:text-base">
                Trusted by families across India for making math fun again.
              </p>
            </div>

            {/* Right: Button */}
            <div className="flex justify-center md:justify-end">
              <button
                onClick={handleAdd}
                className={`px-10 py-4 rounded-full text-lg font-semibold shadow-xl transition-all ${
                  added
                    ? "bg-brand-coral text-white scale-105"
                    : "bg-white text-black hover:bg-brand-teal hover:text-white hover:scale-105"
                }`}
              >
                {added ? "✅ Added to Cart" : "Add to Cart"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
// ---------- 2️⃣ VIDEO SHOWCASE ----------
const VideoShowcase = () => {
  const [activeVideo, setActiveVideo] = useState<string | null>(null);

  const videos = [
    {
      video:
        "https://ik.imagekit.io/pratik2002/Prime%20Numbers%20(Reel%201)_2.mp4?updatedAt=1756253482407",
      thumbnail:
        "https://ik.imagekit.io/pratik11/1.1.jpg?updatedAt=1758361316632",
    },
    {
      video:
        "https://ik.imagekit.io/pratik2002/Prime%20Numbers%20(Reel%201)_1.mp4?updatedAt=1756253492642",
      thumbnail:
        "https://ik.imagekit.io/pratik11/1.2.jpg?updatedAt=1758361316632",
    },
    {
      video:
        "https://ik.imagekit.io/pratik2002/Prime%20Numbers%20(Reel%201)_3.mp4?updatedAt=1756253493297",
      thumbnail:
        "https://ik.imagekit.io/pratik11/1.3.jpg?updatedAt=1758361316632",
    },
    {
      video:
        "https://ik.imagekit.io/pratik2002/Prime%20Numbers%20(Reel%202)_1.mp4?updatedAt=1756253537445",
      thumbnail:
        "https://ik.imagekit.io/pratik11/2.1.jpg?updatedAt=1758361316632",
    },
    {
      video:
        "https://ik.imagekit.io/pratik2002/Prime%20Numbers%20(Reel%202)_2.mp4?updatedAt=1756253535887",
      thumbnail:
        "https://ik.imagekit.io/pratik11/2.2.jpg?updatedAt=1758361316632",
    },
  ];

  return (
    <section className="max-w-[80vw] mx-auto py-16">
      <h2 className="text-center text-2xl md:text-3xl font-bold text-gray-900 mb-8">
        Watch Prime Time™ in Action
      </h2>

      <div className="flex overflow-x-auto gap-5 pb-4 snap-x">
        {videos.map((v, idx) => (
          <div
            key={idx}
            className="relative flex-shrink-0 w-64 md:w-72 aspect-[9/16] rounded-2xl overflow-hidden shadow-soft bg-gray-100 snap-center"
          >
            {activeVideo === v.video ? (
              <video
                src={v.video}
                controls
                autoPlay
                playsInline
                className="absolute inset-0 w-full h-full object-cover"
                onEnded={() => setActiveVideo(null)}
              />
            ) : (
              <>
                <div className="absolute inset-0">
                  <Image
                    src={v.thumbnail}
                    alt={`Prime Time Video ${idx + 1}`}
                    fill
                    className="object-cover"
                  />
                </div>
                <button
                  onClick={() => setActiveVideo(v.video)}
                  className="absolute inset-0 flex items-center justify-center bg-black/40 hover:bg-black/50 transition"
                  aria-label="Play video"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-12 w-12 text-white"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M8 5v14l11-7z" />
                  </svg>
                </button>
              </>
            )}
          </div>
        ))}
      </div>

      {/* subtle caption */}
      <p className="text-center text-sm text-gray-600 mt-4">
        🎬 Swipe to explore short demo reels of Prime Time™ gameplay
      </p>
    </section>
  );
};


// ---------- 3️⃣ SHORT REVIEW CARDS ----------
const ReviewSection = () => {
  const reviews = [
    {
      id: 1,
      name: "Riya",
      text: "Prime Time™ makes math fun and interactive. My kids actually compete to find factors!",
      img: "https://ik.imagekit.io/pratik11/rev1.jpg?updatedAt=1758361316632",
    },
    {
      id: 2,
      name: "Arjun",
      text: "A brilliant blend of learning and laughter. Family game nights got a whole new twist!",
      img: "https://ik.imagekit.io/pratik11/rev2.jpg?updatedAt=1758361316632",
    },
    {
      id: 3,
      name: "Meera",
      text: "No screens, just logic and fun. It's addictive and educational — perfect combo!",
      img: "https://ik.imagekit.io/pratik11/rev3.jpg?updatedAt=1758361316632",
    },
  ];

  return (
    <section className="max-w-[80vw] mx-auto py-16">
      <h2 className="text-3xl md:text-4xl font-bold text-center mb-10 text-gray-900">
        Reviews from Real Customers
      </h2>

      <div className="flex flex-col md:flex-row justify-center gap-6 overflow-x-auto snap-x px-2">
        {reviews.map((r) => (
          <div
            key={r.id}
            className="bg-brand-teal/90 text-white rounded-3xl px-6 pt-16 pb-8 w-full md:w-1/3 min-w-[320px] relative flex-shrink-0 shadow-xl snap-center"
          >
            <div className="absolute -top-10 left-1/2 transform -translate-x-1/2">
              <div className="relative w-20 h-20 rounded-full border-4 border-white overflow-hidden shadow-lg">
                <Image src={r.img} alt={r.name} fill className="object-cover" />
              </div>
            </div>
            <p className="text-center text-base leading-relaxed mt-4">{r.text}</p>
            <p className="text-center font-semibold text-white mt-6">{r.name}</p>
            <div className="flex justify-center mt-2 text-yellow-400">
              {Array(5)
                .fill(0)
                .map((_, i) => (
                  <svg
                    key={i}
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    className="w-5 h-5"
                  >
                    <path d="M12 .587l3.668 7.431 8.2 1.193-5.934 5.782 1.402 8.174L12 18.896l-7.336 3.855 1.402-8.174L.132 9.211l8.2-1.193z" />
                  </svg>
                ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

// ---------- 4️⃣ DETAILED CUSTOMER REVIEWS ----------
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
      text: "Prime Time™ is an amazing educational board game — teaches math logic playfully. Highly recommend!",
    },
    {
      name: "Karishma",
      verified: true,
      rating: 5,
      date: "10/01/2025",
      text: "Very enjoyable for kids and adults. Smooth gameplay and clever concept!",
    },
  ];

  const getBarWidth = (count: number) => (count / totalReviews) * 100;

  return (
    <section className="w-full bg-brand-teal/90 text-white py-16">
      <div className="max-w-[80vw] mx-auto px-4">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-10">
          Customer Reviews
        </h2>

        <div className="flex flex-col md:flex-row justify-between items-center gap-8 bg-white/10 rounded-2xl p-6 mb-10">
          <div className="text-center md:text-left flex-1">
            <div className="flex justify-center md:justify-start items-center gap-2 mb-2">
              <div className="flex text-yellow-400 text-xl">
                {Array(5)
                  .fill(0)
                  .map((_, i) => (
                    <svg
                      key={i}
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                      className={`w-5 h-5 ${
                        i + 1 > Math.round(overallRating)
                          ? "opacity-50"
                          : "opacity-100"
                      }`}
                    >
                      <path d="M12 .587l3.668 7.431 8.2 1.193-5.934 5.782 1.402 8.174L12 18.896l-7.336 3.855 1.402-8.174L.132 9.211l8.2-1.193z" />
                    </svg>
                  ))}
              </div>
              <p className="text-lg font-semibold">
                {overallRating.toFixed(2)} out of 5
              </p>
            </div>
            <p className="text-sm text-white/80">
              Based on {totalReviews} reviews ✅
            </p>
          </div>

          <div className="flex-1 w-full">
            {ratingBreakdown.map((item) => (
              <div key={item.stars} className="flex items-center gap-3 mb-1">
                <div className="flex text-yellow-300 w-16">
                  {Array(item.stars)
                    .fill(0)
                    .map((_, i) => (
                      <svg
                        key={i}
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                        className="w-4 h-4"
                      >
                        <path d="M12 .587l3.668 7.431 8.2 1.193-5.934 5.782 1.402 8.174L12 18.896l-7.336 3.855 1.402-8.174L.132 9.211l8.2-1.193z" />
                      </svg>
                    ))}
                </div>
                <div className="w-full bg-white/20 h-3 rounded-full overflow-hidden">
                  <div
                    className="bg-yellow-400 h-3 rounded-full"
                    style={{ width: `${getBarWidth(item.count)}%` }}
                  />
                </div>
                <p className="text-sm text-white/80 w-8">{item.count}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Individual Reviews */}
        <div className="space-y-6">
          {reviews.map((r, i) => (
            <div
              key={i}
              className="border-b border-white/20 pb-6 pt-4 flex flex-col md:flex-row justify-between"
            >
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <div className="flex text-yellow-400">
                    {Array(r.rating)
                      .fill(0)
                      .map((_, i) => (
                        <svg
                          key={i}
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 24 24"
                          fill="currentColor"
                          className="w-4 h-4"
                        >
                          <path d="M12 .587l3.668 7.431 8.2 1.193-5.934 5.782 1.402 8.174L12 18.896l-7.336 3.855 1.402-8.174L.132 9.211l8.2-1.193z" />
                        </svg>
                      ))}
                  </div>
                  <p className="font-semibold">{r.name}</p>
                  {r.verified && (
                    <span className="bg-white text-brand-teal text-xs font-bold rounded-md px-2 py-0.5">
                      Verified
                    </span>
                  )}
                </div>
                <p className="text-white/90 text-sm max-w-3xl leading-relaxed">
                  {r.text}
                </p>
              </div>
              <p className="text-sm text-white/70 mt-2 md:mt-0">{r.date}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

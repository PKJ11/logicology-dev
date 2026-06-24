"use client";
import NavBar from "@/components/NavBar";
import Footer from "@/components/Footer";
import React, { useEffect, useState, useRef } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import Image from "next/image";
import Community from "@/components/Community";
import MediaLayout from "@/components/MediaLayout";
import CTAButton from "@/components/CTAButton";
import toast from "react-hot-toast";
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
import MediaLayoutRight from "@/components/MediaLayoutRight";
import VideoModal from "@/components/VideoModal";
import { motion, useInView } from "framer-motion";
import Head from "next/head";

export default function PrimeTimeLanding() {
  return (
    <>
      <Head>
        <title>Prime Time™ - Fun Math Board Game for Kids & Adults | Logicology</title>
        <meta
          name="description"
          content="A fast, addictive board game that turns prime numbers, composites and factorization into strategy kids play for fun. 2–6 players, ages 8+. No maths needed to start."
        />
        <meta
          name="keywords"
          content="A fast, addictive board game that turns prime numbers, composites and factorization into strategy kids play for fun. 2–6 players, ages 8+. No maths needed to start."
        />

        {/* Open Graph / Facebook */}
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://www.logicology.in/games/prime-time" />
        <meta property="og:title" content="Prime Time™ - Where Kids Learn Numbers Effortlessly" />
        <meta
          property="og:description"
          content="A lightning-quick numbers game that rewards smart matching and prime-factor insights. Perfect for 2–6 players, ages 8+."
        />
        <meta
          property="og:image"
          content="https://ik.imagekit.io/pratik11/PRIME-TIME-SLIDER-1-NEW-DESKTOP-VIEW.png?tr=w-1200,h-630,c-at_max"
        />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta property="og:site_name" content="Logicology" />

        {/* Twitter */}
        <meta property="twitter:card" content="summary_large_image" />
        <meta property="twitter:url" content="https://www.logicology.in/games/prime-time" />
        <meta property="twitter:title" content="Prime Time™ - Fun Math Board Game" />
        <meta
          property="twitter:description"
          content="Make numbers exciting with Prime Time™ - the addictive board game that teaches prime numbers naturally."
        />
        <meta
          property="twitter:image"
          content="https://ik.imagekit.io/pratik11/PRIME-TIME-SLIDER-1-NEW-DESKTOP-VIEW.png?tr=w-1200,h-630,c-at_max"
        />

        {/* Additional SEO meta tags */}
        <meta
          name="robots"
          content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1"
        />
        <meta name="author" content="Logicology" />
        <meta name="publisher" content="Logicology" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="canonical" href="https://www.logicology.in/games/prime-time" />

        {/* Schema.org markup for Google - Enhanced Product Schema */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Product",
              name: "Prime Time™ — Math Strategy Board Game, Ages 8+ | Logicology",
              description:
                "A fast, addictive board game that turns prime numbers, composites and factorization into strategy kids play for fun. 2–6 players, ages 8+. No maths needed to start.",
              image: [
                "https://ik.imagekit.io/pratik11/PRIME-TIME-SLIDER-1-NEW-DESKTOP-VIEW.png",
                "https://ik.imagekit.io/pratik11/PRIME-TIME-SLIDER-2-DESKTOPVIEW-.png",
                "https://ik.imagekit.io/pratik11/PRIME-TIME-SLIDER-3-DESKTOPVIEW-.png",
              ],
              sku: "PT-001",
              brand: {
                "@type": "Brand",
                name: "Logicology",
              },
              offers: {
                "@type": "Offer",
                url: "https://www.logicology.in/products",
                priceCurrency: "INR",
                availability: "https://schema.org/InStock",
              },
              aggregateRating: {
                "@type": "AggregateRating",
                ratingValue: "4.8",
                ratingCount: "127",
                bestRating: "5",
                worstRating: "1",
              },
              numberOfPlayers: {
                "@type": "QuantitativeValue",
                minValue: 2,
                maxValue: 6,
              },
              audience: {
                "@type": "PeopleAudience",
                suggestedMinAge: 8,
                suggestedMaxAge: 99,
              },
              educationalAlignment: {
                "@type": "AlignmentObject",
                educationalFramework: "Mathematics",
                targetName: "Prime Numbers, Composite Numbers, Factorization",
              },
              keywords:
                "prime numbers, composite numbers, factorization, number game, educational board game",
            }),
          }}
        />

        {/* FAQ Schema for Instruction/FAQ section */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "FAQPage",
              mainEntity: [
                {
                  "@type": "Question",
                  name: "Who is Prime Time™ suitable for?",
                  acceptedAnswer: {
                    "@type": "Answer",
                    text: "Prime Time™ is designed for ages 8 and up, making it perfect for kids learning about prime numbers and composite numbers, as well as adults who enjoy strategic number games. It's suitable for 2-6 players.",
                  },
                },
                {
                  "@type": "Question",
                  name: "How does Prime Time™ teach mathematics?",
                  acceptedAnswer: {
                    "@type": "Answer",
                    text: "Prime Time™ reinforces understanding of prime numbers, composite numbers, and factorization through interactive gameplay. Players naturally learn these concepts as they play and make strategic matching decisions.",
                  },
                },
                {
                  "@type": "Question",
                  name: "How long does a game of Prime Time™ take?",
                  acceptedAnswer: {
                    "@type": "Answer",
                    text: "A typical game of Prime Time™ is fast-paced and plays in approximately 15-25 minutes, making it perfect for family game nights or classroom use.",
                  },
                },
              ],
            }),
          }}
        />

        {/* Organization Schema */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Organization",
              name: "Logicology",
              url: "https://www.logicology.in",
              logo: "https://ik.imagekit.io/pratik11/logicology-logo.png",
              description:
                "Logicology creates innovative educational games and products that make learning enjoyable for kids and families.",
              sameAs: [
                "https://www.facebook.com/logicology",
                "https://www.instagram.com/logicology",
                "https://www.twitter.com/logicology",
              ],
            }),
          }}
        />
      </Head>
      <main className="min-h-screen bg-brand-hero">
        <NavBar />
        <Hero />
        <GameDetails />
        <GameDetails2 />
        <GameDetails3 />
        <GameDetails4 />
        <GameDetails5 />
        <InstructionVideos />
        <InteractiveGames />
        <LostCardHelper />
        <PrimeTimeBuyBlock />
        <GallerySection />
        <Community />
        <Footer />
      </main>
    </>
  );
}

function Hero() {
  const [isMobile, setIsMobile] = useState(false);
  const { addToCart } = useCart();
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [checkoutProduct, setCheckoutProduct] = useState<HeroProductConfig>({
    name: "Prime Time™",
    price: "₹1,499",
    initialprice: "₹1,999",
    razorpayItemId: "item_RNn1BJlJAJ9sM8",
    description: "The addictive numbers board game that makes prime thinking second nature.",
    image: "https://ik.imagekit.io/pratik2002/primetime_imag1.png?updatedAt=1757032084370",
    rating: 5,
    specialOffer: "",
    category: "games",
  });
  const [addedToCart, setAddedToCart] = useState(false);

  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkScreenSize();
    window.addEventListener("resize", checkScreenSize);
    return () => window.removeEventListener("resize", checkScreenSize);
  }, []);

  const TRUST_ITEMS = [
    { icon: "", text: "4.9 · Our highest-rated game" },
    { icon: "", text: "Patent-pending design" },
    { icon: "", text: "2–6 players" },
    { icon: "", text: "Ages 8+" },
    { icon: "", text: "No maths knowledge needed" },
  ];

  const slides = [
    {
      id: 1,
      pretitle: "Introducing Prime Time™",
      title: "The math game that secretly teaches",
      subtitle: "number sense and strategy.",
      description:
        "Players compete, strategize and try to outsmart each other. As the game unfolds, primes, factors and number patterns begin to make sense naturally, without ever feeling like a maths lesson.",
      supporting: "",
      cta: "Buy Now ₹1,499",
      ctaLink: "/products",
      secondaryCta: "Add to Cart",
      secondaryCtaLink: "/products",
      showTrust: true,
    },
  ];

  function handleBuyNow() {
    setCheckoutProduct({
      name: "Prime Time™",
      price: "₹1,499",
      initialprice: "₹1,999",
      razorpayItemId: "item_RNn1BJlJAJ9sM8",
      description: "The addictive numbers board game that makes prime thinking second nature.",
      image: "https://ik.imagekit.io/pratik2002/primetime_imag1.png?updatedAt=1757032084370",
      rating: 5,
      specialOffer: "",
      category: "games",
    });
    setIsCheckoutOpen(true);
  }

  function handleAddToCart() {
    addToCart({
      name: "Prime Time™",
      price: "₹1,499",
      initialprice: "₹1,999",
      razorpayItemId: "item_RNn1BJlJAJ9sM8",
      description: "The addictive numbers board game that makes prime thinking second nature.",
      image: "https://ik.imagekit.io/pratik2002/primetime_imag1.png?updatedAt=1757032084370",
      rating: 5,
    });
    toast.success("Prime Time™ added to cart!");
    if (typeof window !== "undefined" && (window as any).fbq) {
      (window as any).fbq("track", "AddToCart", {
        content_name: "Prime Time™",
        value: 1499,
        currency: "INR",
      });
    }
    setAddedToCart(true);
    setTimeout(() => setAddedToCart(false), 2000);
  }

  return (
    <>
      <style>{`
        .hs1-buy-btn {
          background-color: #fbb041;
          color: #3d3b40;
          border: 2px solid transparent;
          transition: all 0.3s ease, transform 0.15s ease;
        }
        .hs1-buy-btn:hover {
          background-color: #fa9e15;
          transform: scale(1.05);
          box-shadow: 0 6px 20px rgba(250,158,21,0.4);
        }
        .hs1-buy-btn:active { transform: scale(0.95); }
 
        .hs1-details-btn {
          background-color: transparent;
          border: 2px solid #ffffff;
          color: #ffffff;
          transition: all 0.3s ease, transform 0.15s ease;
        }
        .hs1-details-btn:hover {
          background-color: #fa9e15;
          border-color: #fa9e15;
          color: #3d3b40;
          transform: scale(1.05);
          box-shadow: 0 6px 20px rgba(250,158,21,0.4);
        }
        .hs1-details-btn:active { transform: scale(0.95); }
 
        .hs1-details-btn .hs1-label {
          position: relative;
          z-index: 1;
        }
      `}</style>

      {/* ── OUTER WRAPPER — matches HeroSlider's section > container-padding > section-rounded ── */}
      <section className="section my-10">
        <div className="container-padding">
          <div className="section-rounded relative overflow-hidden">
            {/* ── DESKTOP LAYOUT ── */}
            <div
              className="relative hidden w-full overflow-hidden md:flex"
              style={{
                backgroundImage: `url('https://ik.imagekit.io/pratik11/PRIME-TIME-BACKGROUND-DESIGN.png?updatedAt=1780450730151')`,
                backgroundSize: "cover",
                backgroundPosition: "center",
                backgroundRepeat: "no-repeat",
                minHeight: 680,
              }}
            >
              <div className="flex min-h-[680px] w-full items-center">
                {/* Left — Text block */}
                <div className="relative z-20 flex flex-1 flex-col justify-center py-12 pl-[6vw] pr-4">
                  <motion.p
                    className="mb-2 text-[20px] font-bold text-white md:text-[24px]"
                    style={{ fontFamily: "var(--font-outfit), sans-serif" }}
                    initial={{ y: 30, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                  >
                    {slides[0].pretitle}
                  </motion.p>

                  <motion.h1
                    className="mb-5 uppercase leading-[1.1] text-white text-[28px] md:text-[36px] lg:text-[4.4162rem]"
                    style={{
                      fontFamily: "var(--font-outfit), sans-serif",
                      
                      fontWeight: 800,
                    }}
                    initial={{ y: 40, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ duration: 0.7, delay: 0.3 }}
                  >
                    {slides[0].title}
                    <span className="block">{slides[0].subtitle}</span>
                  </motion.h1>

                  <motion.p
                    className="mb-8 max-w-[420px] text-[18px] leading-7 text-white lg:text-[26px]"
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
                      className="hs1-buy-btn inline-block rounded-full px-8 py-4 text-center text-[18px] font-semibold"
                      style={{ fontFamily: "var(--font-outfit), sans-serif", cursor: "pointer" }}
                    >
                      Buy Now ₹1,499
                    </button>

                    <button
                      onClick={handleAddToCart}
                      className="hs1-details-btn inline-block rounded-full px-8 py-4 text-center text-[18px] font-semibold"
                      style={{ fontFamily: "var(--font-outfit), sans-serif", cursor: "pointer" }}
                    >
                      <span className="hs1-label">
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
                        <span key={i} className="hero-trust-item">
                          {item.text}
                        </span>
                      ))}
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {TRUST_ITEMS.slice(3).map((item, i) => (
                        <span key={i + 3} className="hero-trust-item">
                          {item.text}
                        </span>
                      ))}
                    </div>
                  </motion.div>
                </div>

                {/* Right — Circle + hero image */}
                <div className="relative z-10 flex flex-1 items-center justify-center py-8 pr-[3vw]">
                  <div
                    className="relative flex items-center justify-center rounded-full"
                    style={{
                      width: "clamp(340px, 38vw, 520px)",
                      height: "clamp(340px, 38vw, 520px)",
                      background: "radial-gradient(circle, #ffffff 72%, transparent 73%)",
                      border: "10px solid #fbb041",
                      boxShadow: "0 0 0 6px rgba(251,176,65,0.25)",
                    }}
                  >
                    <motion.img
                      src="https://ik.imagekit.io/pratik11/PRIME-TIME-IMAGE-CIRCLE.png?updatedAt=1782280451964"
                      alt="Prime Time Game"
                      className="object-cover"
                      style={{ width: "100%", height: "100%", position: "relative", zIndex: 5 }}
                      initial={{ scale: 0.85, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* ── MOBILE LAYOUT ── */}
            <div
              className="relative flex w-full flex-col overflow-hidden md:hidden"
              style={{
                backgroundImage: `url('https://ik.imagekit.io/pratik11/PRIME-TIME-BACKGROUND-DESIGN.png?updatedAt=1780450730151')`,
                backgroundSize: "cover",
                backgroundPosition: "center",
                backgroundRepeat: "no-repeat",
                minHeight: 720,
              }}
            >
              {/* Circle + hero image */}
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
                    border: "8px solid #fbb041",
                    boxShadow: "0 0 0 4px rgba(251,176,65,0.25)",
                  }}
                >
                  <motion.img
                    src="https://ik.imagekit.io/pratik11/PRIME-TIME-HERO-IMAGE.png?updatedAt=1780453409054"
                    alt="Prime Time Game"
                    className="object-contain"
                    style={{ width: "70%", height: "70%", position: "relative", zIndex: 5 }}
                    initial={{ scale: 0.85, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                  />
                </div>
              </div>

              {/* Text + CTAs */}
              <div className="relative z-20 flex flex-col items-center px-6 pb-20 pt-2 text-center">
                <motion.p
                  className="mb-1 text-[18px] font-bold text-white"
                  style={{ fontFamily: "var(--font-outfit), sans-serif" }}
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ duration: 0.5, delay: 0.3 }}
                >
                  {slides[0].pretitle}
                </motion.p>

                <motion.h1
                  className="mb-4 font-bold uppercase leading-[1.15] text-white text-[28px] md:text-[36px] lg:text-[50px]"
                  style={{
                    fontFamily: "var(--font-outfit), sans-serif",
                    
                    fontWeight: 800,
                  }}
                  initial={{ y: 30, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ duration: 0.6, delay: 0.4 }}
                >
                  {slides[0].title}
                  <br />
                  {slides[0].subtitle}
                </motion.h1>

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
                    className="hs1-buy-btn w-[260px] rounded-full py-4 text-center text-[16px] font-semibold"
                    style={{ fontFamily: "var(--font-outfit), sans-serif", cursor: "pointer" }}
                  >
                    Buy Now ₹1,499
                  </button>

                  <button
                    onClick={handleAddToCart}
                    className="hs1-details-btn inline-block w-[260px] rounded-full py-4 text-center text-[16px] font-semibold"
                    style={{ fontFamily: "var(--font-outfit), sans-serif", cursor: "pointer" }}
                  >
                    <span className="hs1-label">
                      {addedToCart ? "Added to Cart! ✓" : "Add to Cart"}
                    </span>
                  </button>
                </motion.div>

                {/* Trust strip */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.7 }}
                  className="mt-5 flex flex-col items-center gap-2"
                >
                  <div className="flex flex-wrap justify-center gap-2">
                    {TRUST_ITEMS.slice(0, 3).map((item, i) => (
                      <span key={i} className="hero-trust-item">
                        {item.text}
                      </span>
                    ))}
                  </div>
                  <div className="flex flex-wrap justify-center gap-2">
                    {TRUST_ITEMS.slice(3).map((item, i) => (
                      <span key={i + 3} className="hero-trust-item">
                        {item.text}
                      </span>
                    ))}
                  </div>
                </motion.div>
              </div>
            </div>
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

      <style jsx global>{`
        .hero-trust-item {
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
          .hero-trust-item {
            font-size: 11px;
            padding: 3px 9px;
          }
        }
      `}</style>
    </>
  );
}

// --------------------- Game Details (Gold) ---------------------
function GameDetails() {
  const [open, setOpen] = useState(false);
  const YT = "https://youtu.be/2qLAo-AydUc";
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-100px" });

  return (
    <section ref={sectionRef} id="GameDetails" className="w-full bg-brand-red">
      <div className="mx-auto px-4 py-14 sm:px-6 lg:max-w-[80vw] lg:px-8">
        <div className="flex flex-col items-center md:flex-row">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -50 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="order-1 flex w-full items-center py-6 md:order-1 md:w-1/2 md:py-0"
          >
            <MediaLayoutRight
              image="https://ik.imagekit.io/pratik11/MATHS-THAT-MAKE-SENSE.png?updatedAt=1781520602044"
              videoSrc=""
              text="Prime Time™"
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
              Maths That Makes Sense Through Play
            </motion.h2>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="textstyles mt-3 max-w-xl font-sans text-white"
            >
              You don't need to teach your child prime numbers before introducing Prime Time™. As
              they play, experiment and develop strategies, concepts like factors, multiples, primes
              and composites start to make sense naturally. What feels abstract on paper becomes
              meaningful through play, challenge and friendly competition.
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

      <VideoModal
        open={open}
        onClose={() => setOpen(false)}
        youtubeUrl={YT}
        title="Details About The Game"
      />
    </section>
  );
}

function GameDetails2() {
  const [open, setOpen] = useState(false);
  const YT = "https://youtu.be/2qLAo-AydUc";
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-100px" });

  return (
    <section ref={sectionRef} id="GameDetails2" className="w-full bg-brand-teal">
      <div className="mx-auto px-4 py-14 sm:px-6 lg:max-w-[80vw] lg:px-8">
        <div className="flex flex-col items-center md:flex-row">
          {/* Text — left on desktop, below image on mobile */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -50 }}
            transition={{ duration: 0.7, delay: 0.3 }}
            className="order-2 w-full px-4 py-8 sm:p-12 md:order-1 md:w-1/2"
          >
            <motion.h2
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
              transition={{ duration: 0.6 }}
              className="headingstyle font-heading font-extrabold leading-tight text-white"
            >
              From classrooms to living rooms
            </motion.h2>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="textstyles mt-3 max-w-xl font-sans text-white"
              style={{ opacity: 0.9 }}
            >
              Prime Time™ feels equally at home in classrooms and living rooms. Teachers use it to
              bring mathematical ideas to life, while families enjoy the challenge, conversation and
              friendly competition it creates around the table. With 2 to 6 players, there's room
              for everyone to join in.
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

          {/* Image — right on desktop, top on mobile */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: 50 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="order-1 flex w-full items-center py-6 md:order-2 md:w-1/2 md:py-0"
          >
            <MediaLayoutRight
              image="https://ik.imagekit.io/pratik11/FROM-CLASS-ROOM-TO-LIVING-ROOM.png"
              videoSrc=""
              text="Prime Time™"
            />
          </motion.div>
        </div>
      </div>

      <VideoModal
        open={open}
        onClose={() => setOpen(false)}
        youtubeUrl={YT}
        title="From Classrooms to Living Rooms"
      />
    </section>
  );
}

function GameDetails3() {
  const [open, setOpen] = useState(false);
  const YT = "https://youtu.be/2qLAo-AydUc";
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-100px" });

  return (
    <section ref={sectionRef} id="GameDetails3" className="w-full bg-brand-tealDark">
      <div className="mx-auto px-4 py-14 sm:px-6 lg:max-w-[80vw] lg:px-8">
        <div className="flex flex-col items-center md:flex-row">
          {/* Image — left on desktop, top on mobile */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -50 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="order-1 flex w-full items-center py-6 md:order-1 md:w-1/2 md:py-0"
          >
            <MediaLayoutRight
              image="https://ik.imagekit.io/pratik11/FACTOR-IN-FUN.png"
              videoSrc=""
              text="Prime Time™"
            />
          </motion.div>

          {/* Text — right on desktop, below image on mobile */}
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
              className="headingstyle font-heading font-extrabold leading-tight text-[#ffffff]"
            >
              Factor in Fun in Every Turn
            </motion.h2>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="textstyles mt-3 max-w-xl font-sans text-[#ffffff]"
              style={{ opacity: 0.88 }}
            >
              A little luck keeps every round exciting, while strategy rewards thoughtful decisions
              along the way. With new patterns to spot, challenges to solve and approaches to
              explore, every game feels familiar enough to jump into, yet different enough to stay
              interesting.
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

      <VideoModal
        open={open}
        onClose={() => setOpen(false)}
        youtubeUrl={YT}
        title="Factor in Fun in Every Turn"
      />
    </section>
  );
}

function GameDetails4() {
  const [open, setOpen] = useState(false);
  const YT = "https://youtu.be/2qLAo-AydUc";
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-100px" });

  return (
    <section ref={sectionRef} id="GameDetails4" className="w-full bg-brand-coral">
      <div className="mx-auto px-4 py-14 sm:px-6 lg:max-w-[80vw] lg:px-8">
        <div className="flex flex-col items-center md:flex-row">
          {/* Text — left on desktop, below image on mobile */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -50 }}
            transition={{ duration: 0.7, delay: 0.3 }}
            className="order-2 w-full px-4 py-8 sm:p-12 md:order-1 md:w-1/2"
          >
            <motion.h2
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
              transition={{ duration: 0.6 }}
              className="headingstyle font-heading font-extrabold leading-tight text-white"
            >
              Innovation at <br className="hidden md:block" /> Its Core
            </motion.h2>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="textstyles mt-3 max-w-xl font-sans text-white"
              style={{ opacity: 0.9 }}
            >
              Prime Time™ wasn't built around an existing game mechanic. It was created from
              scratch with a simple goal: making number sense genuinely enjoyable. That journey led
              to a unique gameplay system with patent-pending mechanics – a true reflection of the
              originality and innovation at the heart of the game.
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

          {/* Image — right on desktop, top on mobile */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: 50 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="order-1 flex w-full items-center py-6 md:order-2 md:w-1/2 md:py-0"
          >
            <MediaLayoutRight
              image="https://ik.imagekit.io/pratik11/INNOVATION.png"
              videoSrc=""
              text="Prime Time™"
            />
          </motion.div>
        </div>
      </div>

      <VideoModal
        open={open}
        onClose={() => setOpen(false)}
        youtubeUrl={YT}
        title="Innovation at Its Core"
      />
    </section>
  );
}

export function GameDetails5() {
  const [open, setOpen] = useState(false);
  const YT = "https://youtu.be/2qLAo-AydUc";
  const YT_ID = "2qLAo-AydUc";
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-100px" });

  const specs = [
    {
      line1: "Ages",
      line2: "8+",
      bg: "#009a88",
      iconSize: 52,
      icon: (
        <img
          src="https://ik.imagekit.io/pratik11/ICONS/AGES.svg"
          alt="Ages"
          style={{ width: "100%", height: "100%", objectFit: "contain" }}
        />
      ),
    },
    {
      line1: "2–6",
      line2: "Players",
      bg: "#fbb041",
      iconSize: 52,
      textColor: "#3d3b40",
      icon: (
        <img
          src="https://ik.imagekit.io/pratik11/ICONS/PLAYERS.svg"
          alt="Players"
          style={{ width: "100%", height: "100%", objectFit: "contain" }}
        />
      ),
    },
    {
      line1: "15–30",
      line2: "Minutes",
      bg: "#f26c3f",
      iconSize: 52,
      icon: (
        <img
          src="https://ik.imagekit.io/pratik11/clock.svg"
          alt="Minutes"
          style={{ width: "100%", height: "100%", objectFit: "contain" }}
        />
      ),
    },
    {
      line1: "Easy to",
      line2: "Learn",
      bg: "#1b4552",
      iconSize: 52,
      icon: (
        <img
          src="https://ik.imagekit.io/pratik11/ICONS/IDEA.svg"
          alt="Easy to Learn"
          style={{ width: "100%", height: "100%", objectFit: "contain" }}
        />
      ),
    },
    {
      line1: "Fun for Children",
      line2: "and Adults",
      bg: "#d93b60",
      iconSize: 62,
      icon: (
        <img
          src="https://ik.imagekit.io/pratik11/ICONS/FUN%202.svg"
          alt="Fun for Children and Adults"
          style={{ width: "100%", height: "100%", objectFit: "contain" }}
        />
      ),
    },
  ];
  return (
    <section
      ref={sectionRef}
      id="GameDetails5"
      style={{ width: "100%", background: "#ffffff", padding: "48px 16px 64px" }}
    >
      <div className="mx-auto w-full max-w-6xl">
        {/* Heading */}
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.5 }}
          className="headingstyle text-center font-heading font-extrabold leading-tight text-brand-black md:text-center"
        >
          Everything You Need to Get Started
        </motion.h2>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 12 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          style={{
            textAlign: "center",
          }}
          className="textstyles mb-5 text-brand-black"
        >
          Watch the short video below to see Prime Time™ in action
          <br />
          and learn the rules in just a few minutes.
        </motion.p>

        {/* Video thumbnail — full width */}
        <motion.button
          onClick={() => setOpen(true)}
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          whileHover={{ scale: 1.01 }}
          whileTap={{ scale: 0.99 }}
          style={{
            display: "block",
            width: "100%",
            aspectRatio: "16 / 7",
            position: "relative",
            overflow: "hidden",
            borderRadius: 16,
            border: "none",
            cursor: "pointer",
            padding: 0,
            marginBottom: 28,
            boxShadow: "0 4px 24px rgba(0,0,0,0.12)",
          }}
          aria-label="Watch How to Play Prime Time™"
        >
          {/* YouTube thumbnail */}
          <img
            src={`https://img.youtube.com/vi/${YT_ID}/maxresdefault.jpg`}
            alt="How to Play Prime Time™"
            style={{
              position: "absolute",
              inset: 0,
              width: "100%",
              height: "100%",
              objectFit: "cover",
            }}
          />

          {/* Dark scrim */}
          <div
            style={{
              position: "absolute",
              inset: 0,
              background: "rgba(0,0,0,0.30)",
            }}
          />

          {/* Play button + label */}
          <div
            style={{
              position: "absolute",
              inset: 0,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              gap: 12,
            }}
          >
            <div
              style={{
                width: 68,
                height: 68,
                background: "rgba(255,255,255,0.92)",
                borderRadius: "50%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                boxShadow: "0 4px 20px rgba(0,0,0,0.25)",
              }}
            >
              <svg
                style={{ width: 28, height: 28, marginLeft: 4, color: "#555" }}
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M8 5v14l11-7z" />
              </svg>
            </div>
            <span
              style={{
                color: "#fff",
                fontWeight: 700,
                fontSize: 15,
                letterSpacing: "0.03em",
                textShadow: "0 1px 4px rgba(0,0,0,0.5)",
                fontFamily: "Arial, sans-serif",
              }}
            >
              Watch How to Play
            </span>
          </div>
        </motion.button>

        {/* Spec cards — horizontal row */}
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: 12,
            justifyContent: "space-between",
          }}
        >
          {specs.map((spec, i) => (
            <motion.div
              key={spec.line1}
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              transition={{ duration: 0.45, delay: 0.3 + i * 0.07 }}
              style={{
                background: spec.bg,
                borderRadius: 14,
                padding: "18px 14px 14px",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                gap: 10,
                flex: "1 1 130px",
                maxWidth: 160,
                minWidth: 110,
                boxShadow: "0 2px 8px rgba(0,0,0,0.10)",
              }}
            >
              {/* Icon circle */}
              <div
                style={{
                  width: 62,
                  height: 62,

                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <div style={{ width: spec.iconSize, height: spec.iconSize }}>{spec.icon}</div>
              </div>

              {/* Two-line label */}
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: 1,
                }}
              >
                <span
                  style={{
                    color: spec.textColor ?? "#ffffff",
                    fontWeight: 700,
                    fontSize: "clamp(11px, 1.4vw, 13px)",
                    textAlign: "center",
                    lineHeight: 1.3,
                    fontFamily: "Arial, sans-serif",
                  }}
                >
                  {spec.line1}
                </span>
                <span
                  style={{
                    color: spec.textColor ?? "#ffffff",
                    fontWeight: 700,
                    fontSize: "clamp(11px, 1.4vw, 13px)",
                    textAlign: "center",
                    lineHeight: 1.3,
                    fontFamily: "Arial, sans-serif",
                  }}
                >
                  {spec.line2}
                </span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      <VideoModal
        open={open}
        onClose={() => setOpen(false)}
        youtubeUrl={YT}
        title="How to Play Prime Time™"
      />
    </section>
  );
}

// --------------------- Instruction Videos (Coral) ---------------------
function InstructionVideos() {
  const videos = [
    {
      video:
        "https://ik.imagekit.io/pratik2002/Prime%20Numbers%20(Reel%201)_2.mp4?updatedAt=1756253482407",
      thumbnail: "https://ik.imagekit.io/pratik11/1.1.jpg?updatedAt=1758361316632",
    },
    {
      video:
        "https://ik.imagekit.io/pratik2002/Prime%20Numbers%20(Reel%201)_1.mp4?updatedAt=1756253492642",
      thumbnail: "https://ik.imagekit.io/pratik11/1.2.jpg?updatedAt=1758361316632",
    },
    {
      video:
        "https://ik.imagekit.io/pratik2002/Prime%20Numbers%20(Reel%201)_3.mp4?updatedAt=1756253493297",
      thumbnail: "https://ik.imagekit.io/pratik11/1.3.jpg?updatedAt=1758361316632",
    },
    {
      video:
        "https://ik.imagekit.io/pratik2002/Prime%20Numbers%20(Reel%202)_1.mp4?updatedAt=1756253537445",
      thumbnail: "https://ik.imagekit.io/pratik11/2.1.jpg?updatedAt=1758361316632",
    },
    {
      video:
        "https://ik.imagekit.io/pratik2002/Prime%20Numbers%20(Reel%202)_2.mp4?updatedAt=1756253535887",
      thumbnail: "https://ik.imagekit.io/pratik11/2.2.jpg?updatedAt=1758361316632",
    },
    {
      video:
        "https://ik.imagekit.io/pratik2002/Prime%20Numbers%20(Reel%202)_3.mp4?updatedAt=1756253528805",
      thumbnail: "https://ik.imagekit.io/pratik11/2.3.jpg?updatedAt=1758361316632",
    },
  ];

  const [active, setActive] = useState<number | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [hoveredVideo, setHoveredVideo] = useState<number | null>(null);
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-100px" });

  const handleVideoClick = (index: number) => {
    setActive(index);
    setIsPlaying(true);
  };

  const handleCloseModal = () => {
    setActive(null);
    setIsPlaying(false);
  };

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") handleCloseModal();
    };
    if (active !== null) {
      document.addEventListener("keydown", handleEscape);
      document.body.style.overflow = "hidden";
    }
    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "unset";
    };
  }, [active]);

  return (
    <>
      <style>{`
  .iv-swiper.swiper .swiper-button-next,
  .iv-swiper.swiper .swiper-button-prev {
    color: #3d3b40 !important;
    background: #ffffff !important;
    width: 40px !important;
    height: 40px !important;
    border-radius: 50% !important;
    box-shadow: 0 2px 8px rgba(0,0,0,0.12) !important;
    top: 50% !important;
    transform: translateY(-50%) !important;
    margin-top: 0 !important;
    transition: all 0.2s ease !important;
  }

  .iv-swiper.swiper .swiper-button-next:hover,
  .iv-swiper.swiper .swiper-button-prev:hover {
    background: #ffffff !important;
    box-shadow: 0 4px 16px rgba(0,0,0,0.18) !important;
  }

  .iv-swiper.swiper .swiper-button-next::after,
  .iv-swiper.swiper .swiper-button-prev::after {
    font-size: 13px !important;
    font-weight: 900 !important;
  }

  .iv-swiper.swiper .swiper-pagination-bullet {
    display:none
  }

  .iv-swiper.swiper .swiper-pagination-bullet-active {
    display:none
  }
`}</style>

      <section ref={sectionRef} className="relative w-full bg-brand-buttonYellowBefore">
        <div className="mx-auto px-4 py-14 sm:px-6 lg:max-w-[80vw] lg:px-8">
          {/* Heading */}
          <div className="mb-10 flex flex-col items-center text-center">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
              transition={{ duration: 0.7, delay: 0.2 }}
            >
              <motion.h2
                initial={{ opacity: 0, y: 30 }}
                animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
                transition={{ duration: 0.6 }}
                className="headingstyle font-heading font-extrabold text-brand-black"
              >
                Still Curious?
              </motion.h2>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                transition={{ duration: 0.6, delay: 0.1 }}
                className="textstyles mt-3 max-w-prose text-brand-black"
              >
                From setting up your first game to mastering the finer details, these short videos
                answer the questions players ask most often about Prime Time™.
              </motion.p>
            </motion.div>
          </div>

          {/* Swiper */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
            transition={{ duration: 0.7, delay: 0.35 }}
          >
            <Swiper
              modules={[Navigation, Pagination, FreeMode]}
              navigation
              pagination={{ clickable: true }}
              freeMode={{ enabled: true, momentum: true }}
              spaceBetween={16}
              slidesPerView={2}
              breakpoints={{
                480: { slidesPerView: 3, spaceBetween: 16 },
                768: { slidesPerView: 4, spaceBetween: 20 },
                1024: { slidesPerView: 5, spaceBetween: 20 },
              }}
              className="iv-swiper w-full pb-10"
            >
              {videos.map((item, i) => (
                <SwiperSlide key={i} className="!h-auto">
                  <motion.div
                    initial={{ opacity: 0, scale: 0.85, y: 24 }}
                    animate={
                      isInView ? { opacity: 1, scale: 1, y: 0 } : { opacity: 0, scale: 0.85, y: 24 }
                    }
                    transition={{ duration: 0.45, delay: 0.1 * i }}
                    whileHover={{ scale: 1.04, y: -4 }}
                    onClick={() => handleVideoClick(i)}
                    onMouseEnter={() => setHoveredVideo(i)}
                    onMouseLeave={() => setHoveredVideo(null)}
                    className="group relative aspect-[9/16] w-full cursor-pointer overflow-hidden rounded-2xl bg-gray-100 shadow-md ring-1 ring-black/5"
                    style={{ boxShadow: "0 4px 20px rgba(0,0,0,0.10)" }}
                  >
                    {/* Thumbnail or hover video */}
                    {hoveredVideo === i ? (
                      <video
                        src={item.video}
                        muted
                        loop
                        playsInline
                        autoPlay
                        preload="metadata"
                        className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                      />
                    ) : (
                      <img
                        src={item.thumbnail}
                        alt={`Prime Time™ FAQ video ${i + 1}`}
                        className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                      />
                    )}

                    {/* Gradient overlay */}
                    <div
                      className="pointer-events-none absolute inset-0"
                      style={{
                        background:
                          "linear-gradient(to bottom, transparent 40%, rgba(0,0,0,0.35) 100%)",
                      }}
                    />

                    {/* Scrim */}
                    <div className="absolute inset-0 bg-black/10 transition-all group-hover:bg-black/20" />

                    {/* Play button */}
                    <div className="absolute inset-0 flex items-end justify-center pb-4">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white/90 shadow-lg transition-transform group-hover:scale-110">
                        <svg
                          viewBox="0 0 24 24"
                          fill="currentColor"
                          className="ml-0.5 h-5 w-5 text-gray-900"
                        >
                          <path
                            fillRule="evenodd"
                            d="M4.5 5.653c0-1.426 1.529-2.33 2.779-1.643l11.54 6.348c1.295.712 1.295 2.573 0 3.285L7.28 19.991c-1.25.687-2.779-.217-2.779-1.643V5.653z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </div>
                    </div>

                    {/* Video number badge */}
                    <div
                      className="absolute left-2 top-2 flex h-6 w-6 items-center justify-center rounded-full font-sans text-[11px] font-extrabold shadow"
                      style={{ backgroundColor: "#ffffff", color: "#3d3b40" }}
                    >
                      {i + 1}
                    </div>
                  </motion.div>
                </SwiperSlide>
              ))}
            </Swiper>
          </motion.div>
        </div>

        {/* Modal */}
        {active !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4 backdrop-blur-sm"
            onClick={handleCloseModal}
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: "spring", damping: 25 }}
              className="relative mx-4 w-full max-w-sm"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={handleCloseModal}
                className="absolute -top-12 right-0 z-10 rounded-full bg-white/20 p-2 transition-colors hover:bg-white/30"
                aria-label="Close video"
              >
                <svg viewBox="0 0 24 24" fill="currentColor" className="h-6 w-6 text-white">
                  <path
                    fillRule="evenodd"
                    d="M5.47 5.47a.75.75 0 011.06 0L12 10.94l5.47-5.47a.75.75 0 111.06 1.06L13.06 12l5.47 5.47a.75.75 0 11-1.06 1.06L12 13.06l-5.47 5.47a.75.75 0 01-1.06-1.06L10.94 12 5.47 6.53a.75.75 0 010-1.06z"
                    clipRule="evenodd"
                  />
                </svg>
              </button>
              <div
                className="overflow-hidden rounded-2xl bg-black shadow-2xl"
                style={{ maxHeight: "85vh" }}
              >
                <video
                  src={videos[active].video}
                  autoPlay={isPlaying}
                  controls
                  className="h-full w-full object-contain"
                  style={{ maxHeight: "85vh" }}
                />
              </div>
            </motion.div>
          </motion.div>
        )}
      </section>
    </>
  );
}

// --------------------- Interactive Games (Gray) ---------------------
function InteractiveGames() {
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-100px" });

  return (
    <section ref={sectionRef} className="w-full bg-brand-grayBg">
      <div className="mx-auto px-3 py-12 sm:px-5 sm:py-16 md:py-20 lg:max-w-[80vw]">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
          transition={{ duration: 0.7 }}
          className="rounded-[22px] bg-white p-6 shadow-soft sm:p-10"
        >
          {/* Heading block */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
            transition={{ duration: 0.6 }}
            className="mb-12 text-center"
          >
            <h2 className="headingstyle mb-4 font-extrabold text-brand-black">
              A Little Taste of Prime Time™
            </h2>
            <p className="textstyles mx-auto max-w-3xl text-brand-black/80">
              The fun doesn't have to wait for the box to arrive. Try these quick interactive games
              inspired by the same mathematical ideas that make Prime Time™ so engaging. Explore
              prime numbers, uncover patterns and challenge yourself along the way.
            </p>
          </motion.div>

          {/* Game cards */}
          <div className="grid gap-8 md:grid-cols-2">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -50 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              whileHover={{ y: -5, scale: 1.02 }}
              className="overflow-hidden rounded-4xl bg-white p-6 shadow-soft transition-all duration-300"
            >
              <h3 className="mb-4 text-center text-xl font-bold text-brand-teal">
                Prime Number Explorer
              </h3>
              <div className="aspect-video h-[300px] overflow-hidden rounded-3xl bg-brand-grayBg sm:h-auto">
                <iframe
                  className="h-full w-full max-w-[300px] md:max-w-full lg:max-w-full"
                  src="https://wordwall.net/embed/play/96298/037/880"
                  frameBorder="0"
                  allowFullScreen
                />
              </div>
              <p className="mt-4 text-center text-brand-tealDark/80">
                Identify prime numbers and sharpen your number sense.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: 50 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              whileHover={{ y: -5, scale: 1.02 }}
              className="overflow-hidden rounded-4xl bg-white p-6 shadow-soft transition-all duration-300"
            >
              <h3 className="mb-4 text-center text-xl font-bold text-brand-teal">
                Composite Number Challenge
              </h3>
              <div className="aspect-video h-[300px] overflow-hidden rounded-3xl bg-brand-grayBg sm:h-auto">
                <iframe
                  src="https://wordwall.net/embed/play/96298/689/270"
                  frameBorder="0"
                  allowFullScreen
                  className="h-full w-full max-w-[300px] md:max-w-full lg:max-w-full"
                />
              </div>
              <p className="mt-4 text-center text-brand-tealDark/80">
                Spot composite numbers and uncover the patterns behind them.
              </p>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

// ─────────────────────────────────────────────────────────────────
// Product configs
// ─────────────────────────────────────────────────────────────────
const PRIME_TIME: HeroProductConfig = {
  name: "Prime Time™",
  price: "₹1,499",
  initialprice: "₹1,999",
  razorpayItemId: "item_RNn1BJlJAJ9sM8",
  description: "The addictive numbers board game that makes prime thinking second nature.",
  image: "https://ik.imagekit.io/pratik11/primetime-heroimg-cropped?updatedAt=1781163639552",
  rating: 5,
  specialOffer: "",
  category: "games",
};

type CrossSellProduct = HeroProductConfig & {
  displayName: string;
  tag: string;
  blurb: string;
};

const CROSS_SELL: CrossSellProduct[] = [
  {
    name: "Logicoland Set (All Volumes)",
    displayName: "Complete Logicoland Set",
    price: "₹999",
    initialprice: undefined,
    razorpayItemId: "item_SSxJhDUqb7HTiy",
    description: "Every volume in one box — the complete thinking skills collection.",
    blurb: "Five volumes of logic puzzles for ages 6–16. The full collection in one box.",
    image: "https://ik.imagekit.io/pratik11/LOGICOLAND-HERO-IMAGE.png?updatedAt=1781163914607",
    rating: 5,
    specialOffer: "",
    category: "set",
    tag: "Best Value",
  },
  {
    name: "Turn the Tables",
    displayName: "Turn the Tables",
    price: "₹299",
    initialprice: "₹399",
    razorpayItemId: "item_RsD9AhoF8idQ21",
    description: "A fast-paced multiplication card game with wild strategy twists.",
    blurb: "A fast-paced multiplication card game. Pairs brilliantly with Prime Time™.",
    image: "https://ik.imagekit.io/pratik11/TURN-THE-TABLE-BOX-IMAGE.png?updatedAt=1781172932797",
    rating: 5,
    specialOffer: "",
    category: "games",
    tag: "25% Off",
  },
];

// ─────────────────────────────────────────────────────────────────
// Palette — matches ProductShopSection exactly
// ─────────────────────────────────────────────────────────────────
const GOLD = "#E45C48"; // stars accent
const TAG_COLOR = "#fbb041"; // tag pills
const TEXT_DARK = "#3d3b40"; // all text / headings
const BUY_DEFAULT = "#fbb041"; // Buy Now default bg
const BUY_HOVER = "#fa9e15"; // Buy Now hover bg
const CART_DEFAULT = "#E45C48"; // Add to Cart default bg
const CART_HOVER = "#c94433"; // Add to Cart hover bg

// ─────────────────────────────────────────────────────────────────
// Shared button CSS — identical to ProductShopSection cardStyles
// ─────────────────────────────────────────────────────────────────
const ptbStyles = `
  .ptb-buy-btn {
    background-color: ${BUY_DEFAULT};
    color: ${TEXT_DARK};
    border: 2px solid transparent;
    transition: all 0.3s ease, transform 0.15s ease;
    box-shadow: 0 4px 16px rgba(251,176,65,0.35);
  }
  .ptb-buy-btn:hover {
    background-color: ${BUY_HOVER};
    transform: scale(1.05);
    box-shadow: 0 6px 20px rgba(250,158,21,0.4);
  }
  .ptb-buy-btn:active { transform: scale(0.95); }

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
`;

// ─────────────────────────────────────────────────────────────────
// Cross-sell card — fully matched to ProductShopSection ProductCard
// ─────────────────────────────────────────────────────────────────
function CrossSellCard({
  product,
  index,
  onBuyNow,
}: {
  product: CrossSellProduct;
  index: number;
  onBuyNow: (p: HeroProductConfig) => void;
}) {
  const { addToCart } = useCart();
  const [addedToCart, setAddedToCart] = useState(false);

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
    setAddedToCart(true);
    setTimeout(() => setAddedToCart(false), 2000);
  }

  return (
    <motion.div
      className="group relative flex max-w-[300px] flex-col overflow-hidden rounded-[32px] bg-white"
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
      {/* Image zone */}
      <div
        className="relative overflow-hidden"
        style={{
          height: 260,
          border: "14px solid #e0e0e3",
          borderTopLeftRadius: "32px",
          borderTopRightRadius: "32px",
        }}
      >
        <img
          src={product.image}
          alt={product.displayName}
          className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.06]"
        />
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            background: "linear-gradient(to bottom, transparent 45%, rgba(255,255,255,0.18) 100%)",
          }}
        />
        {/* Tag pill */}
        <div
          className="absolute left-4 top-4 z-10 flex items-center rounded-full px-3.5 py-1.5 text-[11px] font-extrabold uppercase tracking-[0.08em] shadow-lg"
          style={{ backgroundColor: TAG_COLOR, color: TEXT_DARK }}
        >
          {product.tag}
        </div>
      </div>

      {/* Content zone */}
      <div className="flex flex-1 flex-col px-5 pb-5 pt-4">
        <h4
          className="font-heading text-[17px] font-extrabold leading-tight tracking-tight"
          style={{ color: TEXT_DARK }}
        >
          {product.displayName}
        </h4>

        <p
          className="mt-1.5 line-clamp-2 font-sans text-[13px] leading-relaxed"
          style={{ color: TEXT_DARK, opacity: 0.65 }}
        >
          {product.blurb}
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

        {/* Price */}
        <div className="mt-4 flex items-baseline gap-2">
          <span
            className="font-heading text-[24px] font-extrabold leading-none tracking-tight"
            style={{ color: TEXT_DARK }}
          >
            {product.price}
          </span>
          {product.initialprice && (
            <span
              className="font-sans text-sm line-through"
              style={{ color: TEXT_DARK, opacity: 0.35 }}
            >
              {product.initialprice}
            </span>
          )}
        </div>

        <div className="min-h-[12px] flex-1" />

        {/* Buttons */}
        <div className="mt-4 flex flex-col gap-2.5">
          <button
            onClick={() => onBuyNow(product)}
            className="ptb-buy-btn relative flex w-full items-center justify-center rounded-full py-3 text-[14px] font-extrabold"
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

          <button
            onClick={handleAddToCart}
            className={`ptb-cart-btn flex w-full items-center justify-center gap-2 rounded-full py-3 text-[14px] font-extrabold${addedToCart ? "ptb-cart-btn--added" : ""}`}
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
                Added!
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
// PrimeTimeBuyBlock — main section
// ─────────────────────────────────────────────────────────────────
export function PrimeTimeBuyBlock() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });
  const { addToCart } = useCart();

  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [checkoutProduct, setCheckoutProduct] = useState<HeroProductConfig>(PRIME_TIME);
  const [addedToCart, setAddedToCart] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  function handleBuyNow(p: HeroProductConfig = PRIME_TIME) {
    setCheckoutProduct(p);
    setIsCheckoutOpen(true);
  }

  function handleAddToCart() {
    addToCart({
      name: PRIME_TIME.name,
      price: PRIME_TIME.price,
      initialprice: PRIME_TIME.initialprice,
      razorpayItemId: PRIME_TIME.razorpayItemId,
      description: PRIME_TIME.description,
      image: PRIME_TIME.image,
      rating: PRIME_TIME.rating ?? 5,
    });
    toast.success("Prime Time™ added to cart!");
    if (typeof window !== "undefined" && (window as any).fbq) {
      (window as any).fbq("track", "AddToCart", {
        content_name: PRIME_TIME.name,
        value: 1499,
        currency: "INR",
      });
    }
    setAddedToCart(true);
    setTimeout(() => setAddedToCart(false), 2000);
  }

  return (
    <>
      {/* Inject button styles */}
      <style>{ptbStyles}</style>

      <section id="buy" ref={ref} className="relative w-full overflow-hidden bg-brand-tealDark">
        <div className="relative px-4 py-20 md:mx-auto md:max-w-[82vw] lg:mx-auto lg:max-w-[82vw] lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            className="mx-auto mb-16 flex flex-col items-stretch rounded-[28px] bg-white md:flex-row lg:max-w-[70vw]"
            style={{ boxShadow: "0 8px 48px 0 rgba(0,0,0,0.18)" }}
          >
            {/* LEFT — image with overlapping gray border */}
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
                src={PRIME_TIME.image}
                alt="Prime Time™"
                className="h-full w-full object-contain"
                style={{
                  borderTopLeftRadius: "14px",
                  borderBottomLeftRadius: "14px",
                }}
              />
            </motion.div>

            {/* RIGHT — Text + CTAs */}
            <div className="flex flex-1 flex-col p-8 sm:p-12">
              {/* Eyebrow */}
              <motion.p
                initial={{ opacity: 0, y: 16 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="mb-2 font-sans text-xs font-bold uppercase tracking-[0.2em]"
                style={{ color: TEXT_DARK }}
              >
                The Numbers Game
              </motion.p>

              {/* Name */}
              <motion.h2
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: 0.25 }}
                className="headingstyle font-heading font-extrabold leading-tight"
                style={{ color: TEXT_DARK }}
              >
                Prime Time™
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
                  4.9 · 124 reviews
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
                  ₹1,499
                </span>
                <span
                  className="font-sans text-lg line-through"
                  style={{ color: TEXT_DARK, opacity: 0.4 }}
                >
                  ₹1,999
                </span>
                <span
                  className="rounded-full px-2.5 py-1 font-sans text-[11px] font-bold uppercase tracking-wide"
                  style={{ backgroundColor: TAG_COLOR, color: TEXT_DARK }}
                >
                  Save ₹500
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
                    Buy Now — ₹1,499
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
                  { icon: "", text: "Patent-pending design" },
                  { icon: "", text: "2–6 players" },
                  { icon: "", text: "Ages 8+" },
                  { icon: "", text: "No maths knowledge needed" },
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
                    <span>{b.icon}</span>
                    {b.text}
                  </span>
                ))}
              </motion.div>
            </div>
          </motion.div>

          {/* ── Cross-sell heading ── */}
          <motion.div
            className="mb-8 text-center"
            initial={{ opacity: 0, y: 24 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 24 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <p className="mb-3 font-sans text-[25px] font-bold uppercase tracking-[0.2em] text-[#ffffff]">
              Building a collection?
            </p>
            <h3 className="headingstyle font-heading font-extrabold text-white">
              These pair perfectly with Prime Time™
            </h3>
          </motion.div>

          {/* ── Cross-sell cards ── */}
          <div className="flex flex-wrap items-center justify-center gap-6">
            {CROSS_SELL.map((product, i) => (
              <CrossSellCard
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

// --------------------- Gallery Section ---------------------
function GallerySection() {
  const raw = [
    "https://ik.imagekit.io/pratik11/WhatsApp%20Image%202025-09-24%20at%2010.01.02_76a91c95.jpg?updatedAt=1758690489687",
    "https://ik.imagekit.io/pratik11/IMG_3932.HEIC?updatedAt=1758632392086",
    "https://ik.imagekit.io/pratik11/g1.jpg?updatedAt=1758632390713",
    "https://ik.imagekit.io/pratik11/g3.jpg?updatedAt=1758632390325",
    "https://ik.imagekit.io/pratik11/g4.jpg?updatedAt=1758632390353",
    "https://ik.imagekit.io/pratik11/g2.jpg?updatedAt=1758632414740",
    "https://ik.imagekit.io/pratik11/WhatsApp%20Image%202025-09-24%20at%2010.04.31_a1802bf2.jpg?updatedAt=1758690948555",
    "https://res.cloudinary.com/degjey666/image/upload/v1758691881/imggg_ew9vkx.jpg",
    "https://ik.imagekit.io/pratik11/imageprimetime.jpg?updatedAt=1758691422812",
  ];
  const images = raw.map((u) => (u.includes("?") ? `${u}&tr=f-auto,q-70` : `${u}?tr=f-auto,q-70`));

  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-100px" });

  const closeModal = () => setSelectedIndex(null);
  const showPrev = () => setSelectedIndex((prev) => (prev === 0 ? images.length - 1 : prev! - 1));
  const showNext = () => setSelectedIndex((prev) => (prev === images.length - 1 ? 0 : prev! + 1));

  return (
    <>
      <style>{`
        .gallery-swiper.swiper .swiper-button-next,
        .gallery-swiper.swiper .swiper-button-prev {
          color: #3d3b40 !important;
          background: #fbb041 !important;
          width: 40px !important;
          height: 40px !important;
          border-radius: 50% !important;
          box-shadow: 0 2px 8px rgba(0,0,0,0.12) !important;
          top: 50% !important;
          transform: translateY(-50%) !important;
          margin-top: 0 !important;
          transition: all 0.2s ease !important;
        }

        .gallery-swiper.swiper .swiper-button-next:hover,
        .gallery-swiper.swiper .swiper-button-prev:hover {
          background: #fa9e15 !important;
          box-shadow: 0 4px 16px rgba(0,0,0,0.18) !important;
        }

        .gallery-swiper.swiper .swiper-button-next::after,
        .gallery-swiper.swiper .swiper-button-prev::after {
          font-size: 13px !important;
          font-weight: 900 !important;
        }
      `}</style>

      <section
        ref={sectionRef}
        className="relative w-full bg-gradient-to-b from-white to-brand-grayBg/40 py-16"
      >
        <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top,rgba(10,138,128,0.08),transparent_60%)]" />
        <div className="mx-auto px-4 sm:px-6 lg:max-w-[80vw] lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
            transition={{ duration: 0.6 }}
            className="mb-8 flex items-center justify-center text-center"
          >
            <h2 className="headingstyle text-center font-extrabold text-brand-black">Gallery</h2>
          </motion.div>

          <Swiper
            modules={[Navigation, Autoplay, Keyboard, FreeMode, EffectCoverflow]}
            navigation
            keyboard={{ enabled: true }}
            freeMode={{ enabled: true, momentum: true }}
            autoplay={{ delay: 2500, disableOnInteraction: false }}
            loop
            centeredSlides={false}
            spaceBetween={18}
            slidesPerView={1.2}
            breakpoints={{
              480: { slidesPerView: 2.2, spaceBetween: 18 },
              768: { slidesPerView: 3.2, spaceBetween: 20 },
              1024: { slidesPerView: 4.2, spaceBetween: 22 },
              1280: { slidesPerView: 5.2, spaceBetween: 24 },
            }}
            className="gallery-swiper w-full"
          >
            {images.map((src, i) => (
              <SwiperSlide key={`${src}-${i}`} className="!h-auto select-none">
                <motion.div
                  initial={{ opacity: 0, scale: 0.8, y: 30 }}
                  animate={
                    isInView ? { opacity: 1, scale: 1, y: 0 } : { opacity: 0, scale: 0.8, y: 30 }
                  }
                  transition={{ duration: 0.5, delay: i * 0.1 }}
                  whileHover={{ scale: 1.05, y: -5 }}
                  className="group relative h-full w-full cursor-pointer overflow-hidden rounded-2xl bg-white/60 shadow-[0_8px_24px_rgba(0,0,0,0.08)] ring-1 ring-black/5 backdrop-blur-sm transition-all duration-300 hover:shadow-[0_16px_40px_rgba(0,0,0,0.12)]"
                  onClick={() => setSelectedIndex(i)}
                >
                  <div className="relative aspect-[4/3] w-full">
                    <img
                      src={src}
                      alt={`Prime Time™ board game in action – gallery photo ${i + 1}`}
                      loading="lazy"
                      className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                    />
                  </div>
                </motion.div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>

        {selectedIndex !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm"
            onClick={closeModal}
          >
            <motion.button
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={(e) => {
                e.stopPropagation();
                showPrev();
              }}
              className="absolute left-4 top-1/2 -translate-y-1/2 rounded-full bg-white/20 p-2 text-white shadow-lg transition-all duration-200 hover:bg-white/40"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
              </svg>
            </motion.button>

            <motion.img
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: "spring", damping: 25 }}
              src={images[selectedIndex].replace("&tr=f-auto,q-70", "&tr=f-auto,q-90")}
              alt={`Prime Time™ gallery photo ${selectedIndex + 1} – full view`}
              className="max-h-[90vh] max-w-[90vw] rounded-lg shadow-lg"
              onClick={(e) => e.stopPropagation()}
            />

            <motion.button
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={(e) => {
                e.stopPropagation();
                showNext();
              }}
              className="absolute right-4 top-1/2 -translate-y-1/2 rounded-full bg-white/20 p-2 text-white shadow-lg transition-all duration-200 hover:bg-white/40"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
              </svg>
            </motion.button>
          </motion.div>
        )}
      </section>
    </>
  );
}

// --------------------- Lost Card Helper ---------------------
function LostCardHelper() {
  const trayImages = [
    "https://res.cloudinary.com/deunonql5/image/upload/v1757381453/TRAY_1_hsi9wt.png",
  ];
  const randomTray = () => trayImages[Math.floor(Math.random() * trayImages.length)];
  const buildCardUrl = (n: number) => `/Images/primetimecardImages/PrimeTime CARD ${n}.png`;

  const [cardNo, setCardNo] = React.useState("");
  const [imgSrc, setImgSrc] = React.useState<string>(randomTray());
  const [isTray, setIsTray] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);
  const [loading, setLoading] = React.useState(false);
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-100px" });

  const resetToTray = () => {
    const t = randomTray();
    setImgSrc(t);
    setIsTray(true);
    setCardNo("");
    setError(null);
    setLoading(false);
  };

  const showCard = () => {
    setError(null);

    if (!cardNo.trim()) {
      resetToTray();
      return;
    }

    if (!/^\d+$/.test(cardNo.trim())) return setError("Card number should be numeric.");
    const num = Number(cardNo);
    if (num < 1 || num > 60) return setError("Enter a number between 1 and 60.");

    setLoading(true);
    const nextUrl = buildCardUrl(num);

    const probe = new window.Image();
    probe.onload = () => {
      setImgSrc(nextUrl);
      setIsTray(false);
      setLoading(false);
    };
    probe.onerror = () => {
      setLoading(false);
      setError("That card image is not available. Check the number or filename.");
    };
    probe.src = nextUrl;
  };

  const onKeyDown: React.KeyboardEventHandler<HTMLInputElement> = (e) => {
    if (e.key === "Enter") showCard();
  };

  return (
    <section ref={sectionRef} className="w-full bg-[#84C341]">
      <div className="mx-auto px-4 py-14 sm:px-6 lg:max-w-[80vw] lg:px-8">
        <div className="rounded-[22px] p-6 sm:p-6">
          <div className="flex flex-col items-center gap-8 md:flex-row lg:gap-16">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -50 }}
              transition={{ duration: 0.7, delay: 0.2 }}
              className="order-2 flex w-full items-center justify-start py-6 md:order-1 md:w-1/2 md:py-0"
            >
              <motion.div
                whileHover={{ scale: 1.02 }}
                transition={{ type: "spring", stiffness: 300 }}
                className="relative aspect-square w-[95%] max-w-[700px] rounded-[28px] border-[12px] border-white bg-white p-2 shadow-soft md:border-[14px]"
              >
                <div className="relative flex h-full w-full items-center justify-center overflow-hidden rounded-[22px]">
                  {isTray ? (
                    <Image
                      src={imgSrc}
                      alt="Prime Time™ card tray showing all cards organized by number"
                      fill
                      sizes="(min-width: 768px) 600px, 100vw"
                      className={`object-cover transition-opacity ${
                        loading ? "opacity-60" : "opacity-100"
                      }`}
                      priority={false}
                    />
                  ) : (
                    <motion.div
                      initial={{ scale: 0.8, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ type: "spring", stiffness: 200 }}
                    >
                      <Image
                        src={imgSrc}
                        alt={`Prime Time™ card number ${cardNo}`}
                        width={180}
                        height={240}
                        className={`rounded-xl object-contain shadow-2xl transition-opacity ${
                          loading ? "opacity-60" : "opacity-100"
                        }`}
                        priority={false}
                      />
                    </motion.div>
                  )}
                </div>
              </motion.div>

              {loading && <p className="mt-3 text-center text-sm text-gray-200">Loading image…</p>}
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: 50 }}
              transition={{ duration: 0.7, delay: 0.3 }}
              className="order-1 w-full text-white md:order-2 md:w-1/2"
            >
              <motion.h2
                initial={{ opacity: 0, y: 30 }}
                animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
                transition={{ duration: 0.6 }}
                className="headingstyle font-heading font-extrabold text-white/90"
              >
                Lost a Card?
              </motion.h2>

              <motion.h3
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                transition={{ duration: 0.6, delay: 0.05 }}
                className="text-2xl font-semibold text-white md:text-3xl"
              >
                We've Got You Covered
              </motion.h3>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                transition={{ duration: 0.6, delay: 0.1 }}
                className="textstyles mt-3 max-w-prose font-sans"
              >
                Prime Time™ is meant to be played often, and sometimes that means a card goes
                missing. Every box includes four blank replacement cards for exactly this reason.
                Enter the card number below and we'll show you exactly what belongs on it.
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="mt-6 flex flex-col gap-3 sm:flex-row"
              >
                <motion.input
                  whileFocus={{ scale: 1.02 }}
                  id="card-number"
                  type="text"
                  inputMode="numeric"
                  pattern="[0-9]*"
                  placeholder="Enter the card number between 1–60"
                  value={cardNo}
                  onChange={(e) => {
                    setCardNo(e.target.value);
                    if (error) setError(null);
                  }}
                  onKeyDown={onKeyDown}
                  className="w-full rounded-full border border-gray-300 bg-white px-5 py-3 text-sm text-gray-900 outline-none ring-0 focus:bg-white focus:ring-2 focus:ring-brand-teal/40 sm:max-w-xs"
                />

                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={showCard}
                  className="group min-w-[120px] rounded-full bg-brand-buttonYellowBefore px-2 py-3 font-sans text-[14px] font-medium text-brand-black transition-colors hover:bg-brand-buttonYellowAfter hover:text-brand-black focus:outline-none"
                >
                  Show card
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={resetToTray}
                  type="button"
                  className="group min-w-[100px] rounded-full bg-brand-buttonYellowBefore px-6 py-3 text-[14px] font-medium text-brand-black transition-colors hover:bg-brand-buttonYellowAfter hover:text-brand-black focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-teal/40"
                >
                  Reset
                </motion.button>
              </motion.div>

              {error && (
                <motion.p
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-white-200 mt-3 text-sm"
                >
                  {error}
                </motion.p>
              )}
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}

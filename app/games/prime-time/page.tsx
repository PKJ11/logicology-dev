"use client";
import NavBar from "@/components/NavBar";
import Footer from "@/components/Footer";
import React, { useEffect, useState, useRef } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import Image from "next/image";
import Community from "@/components/Community";
import MediaLayout from "@/components/MediaLayout";
import CTAButton from "@/components/CTAButton";
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
        <title>Prime Time™ - Fun Math Board Game for Kids & Adults | Logicoland</title>
        <meta name="description" content="Prime Time™ is a fun, fast-paced board game that makes learning numbers exciting for kids (and surprisingly addictive for adults!). Reinforces prime numbers, composites, and factorization through gameplay." />
        <meta name="keywords" content="prime time board game, math game for kids, logical reasoning game, number game, educational board game, prime numbers game, family board game, learning through play, Logicoland" />
        
        {/* Open Graph / Facebook */}
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://yourdomain.com/primetime" />
        <meta property="og:title" content="Prime Time™ - Where Kids Learn Numbers Effortlessly" />
        <meta property="og:description" content="A lightning‑quick numbers game that rewards smart matching and prime‑factor insights. Perfect for 2–6 players, ages 8+." />
        <meta property="og:image" content="https://ik.imagekit.io/pratik11/PRIME-TIME-SLIDER-1-NEW-DESKTOP-VIEW.png" />
        
        {/* Twitter */}
        <meta property="twitter:card" content="summary_large_image" />
        <meta property="twitter:url" content="https://yourdomain.com/primetime" />
        <meta property="twitter:title" content="Prime Time™ - Fun Math Board Game" />
        <meta property="twitter:description" content="Make numbers exciting with Prime Time™ - the addictive board game that teaches prime numbers naturally." />
        <meta property="twitter:image" content="https://ik.imagekit.io/pratik11/PRIME-TIME-SLIDER-1-NEW-DESKTOP-VIEW.png" />
        
        {/* Additional SEO meta tags */}
        <meta name="robots" content="index, follow" />
        <meta name="author" content="Logicoland" />
        <link rel="canonical" href="https://yourdomain.com/primetime" />
        
        {/* Schema.org markup for Google */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Product",
              "name": "Prime Time™ Board Game",
              "description": "A fun, fast-paced board game that makes learning numbers exciting for kids and adults.",
              "brand": {
                "@type": "Brand",
                "name": "Logicoland"
              },
              "offers": {
                "@type": "Offer",
                "price": "29.99",
                "priceCurrency": "USD",
                "availability": "https://schema.org/InStock"
              },
              "audience": {
                "@type": "Audience",
                "suggestedMinAge": 8,
                "suggestedMaxAge": 99
              },
              "educationalAlignment": {
                "@type": "AlignmentObject",
                "educationalFramework": "Mathematics",
                "targetName": "Prime Numbers, Composites, Factorization"
              }
            })
          }}
        />
      </Head>
    <main className="min-h-screen bg-brand-hero">
      <NavBar />
      <Hero />
      <GameDetails />
      <InstructionVideos />
      <InteractiveGames />
      <LostCardHelper />
      <GallerySection />
      <Community />
      <Footer />
    </main>
    </>
  );
}

// --------------------- Hero ---------------------
function Hero() {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkScreenSize();
    window.addEventListener("resize", checkScreenSize);
    return () => window.removeEventListener("resize", checkScreenSize);
  }, []);

  const slides = [
    {
      id: 1,
      pretitle: "Introducing Prime Time™",
      title: "Where kids learn effortlessly",
      subtitle: "and adults get hooked.",
      description:
        "Prime Time™ is a fun, fast-paced board game that makes numbers exciting for kids. (and is surprisingly addictive for adults too!)",
      image: {
        desktop:
          "https://ik.imagekit.io/pratik11/PRIME-TIME-SLIDER-1-NEW-DESKTOP-VIEW.png?updatedAt=1758442535210",
        mobile:
          "https://ik.imagekit.io/pratik11/PRIME-TIME-SLIDER-1-NEW-MOBILE-VIEW.png?updatedAt=1758442535388",
      },
      cta: "Buy Now",
      ctaLink: "/products",
    },
    {
      id: 2,
      pretitle: "From classrooms to living rooms",
      title: "Prime Time™ makes numbers",
      subtitle: "fun for everyone.",
      description:
        "Reinforces concept of Prime and Composite numbers, factorization through gameplay",
      image: {
        desktop:
          "https://ik.imagekit.io/pratik11/PRIME-TIME-SLIDER-2-DESKTOPVIEW-.png?updatedAt=1758359620883",
        mobile:
          "https://ik.imagekit.io/pratik11/PRIME-TIME-SLIDER-2-MOBILE-VIEW.png?updatedAt=1758359620876",
      },
      cta: "Buy Now",
      ctaLink: "/products",
    },
    {
      id: 3,
      pretitle: "Say hello to Prime Time™",
      title: "Where numbers, luck & strategy",
      subtitle: "all come together!",
      description:
        "You don't need to know anything about primes, composites, or factorization to start playing — the game's clever design teaches it naturally as you go.",
      image: {
        desktop:
          "https://ik.imagekit.io/pratik11/PRIME-TIME-SLIDER-3-DESKTOPVIEW-.png?updatedAt=1758359630962",
        mobile:
          "https://ik.imagekit.io/pratik11/PRIME-TIME-SLIDER-3-MOBILE-VIEW.png?updatedAt=1758359662353",
      },
      cta: "Buy Now",
      ctaLink: "/products",
    },
  ];

  return (
    <section className="section my-10">
      <div className="container-padding">
        <div className="section-rounded relative overflow-hidden">
          <Swiper
            spaceBetween={0}
            slidesPerView={1}
            loop
            autoplay={{ delay: 15000, disableOnInteraction: false }}
            pagination={{
              clickable: true,
              bulletClass: "custom-bullet",
              bulletActiveClass: "custom-bullet-active",
              renderBullet: (index, className) => `<span class="${className}"><i></i></span>`,
            }}
            navigation={{
              nextEl: ".swiper-button-next",
              prevEl: ".swiper-button-prev",
            }}
            modules={[Autoplay, Pagination, Navigation]}
            className="hero-swiper"
          >
            {slides.map((slide, index) => (
              <SwiperSlide key={slide.id}>
                <div
                  className="absolute inset-0 z-0"
                  style={{
                    backgroundImage: `url('${isMobile ? slide.image.mobile : slide.image.desktop}')`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                    backgroundRepeat: "no-repeat",
                    transform: "scale(1)",
                  }}
                />

                <div className="relative z-10 flex min-h-[700px] items-center">
                  <div className="md:mx-auto md:w-[75vw] md:max-w-[75vw] lg:mx-auto lg:w-[75vw] lg:max-w-[75vw]">
                    <div className="flex">
                      <div className="p-8 sm:p-12">
                        <motion.h1
                          initial={{ opacity: 0, y: 30 }}
                          whileInView={{ opacity: 1, y: 0 }}
                          viewport={{ once: true, margin: "-50px" }}
                          transition={{ duration: 0.6, delay: 0.2 }}
                          className="font-heading text-[20px] font-bold text-white sm:text-[22px] md:text-[24px] lg:text-[24px]"
                        >
                          {slide.pretitle}
                        </motion.h1>
                        <motion.h1
                          initial={{ opacity: 0, y: 30 }}
                          whileInView={{ opacity: 1, y: 0 }}
                          viewport={{ once: true, margin: "-50px" }}
                          transition={{ duration: 0.6, delay: 0.3 }}
                          className="mt-2 font-heading text-[41px] font-bold leading-tight text-white sm:text-[44px] md:text-[50px] lg:text-[50px]"
                        >
                          {slide.title}
                          <span className="block font-heading text-[41px] leading-tight text-white sm:text-[44px] md:text-[50px] lg:text-[50px]">
                            {slide.subtitle}
                          </span>
                        </motion.h1>
                        <motion.p
                          initial={{ opacity: 0, y: 30 }}
                          whileInView={{ opacity: 1, y: 0 }}
                          viewport={{ once: true, margin: "-50px" }}
                          transition={{ duration: 0.6, delay: 0.4 }}
                          className="mt-6 max-w-md font-heading text-[20px] text-white sm:text-[22px] md:text-[24px] lg:text-[24px]"
                        >
                          {slide.description}
                        </motion.p>
                        <motion.div
                          initial={{ opacity: 0, y: 30 }}
                          whileInView={{ opacity: 1, y: 0 }}
                          viewport={{ once: true, margin: "-50px" }}
                          transition={{ duration: 0.6, delay: 0.5 }}
                          className="mt-6"
                        >
                          <CTAButton
                            text={slide.cta}
                            href={slide.ctaLink}
                            bg="#FFFFFF"
                            color="#0A8A80"
                            hoverBg="#0A8A80"
                            hoverColor="#FFFFFF"
                            size="md"
                            rightIcon={
                              <svg
                                className="h-4 w-4 transition-transform group-hover:translate-x-1"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M9 5l7 7-7 7"
                                />
                              </svg>
                            }
                          />
                        </motion.div>
                      </div>
                    </div>
                  </div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </div>

      <style jsx global>{`
        .hero-swiper {
          width: 100%;
          height: 100%;
        }
        .hero-swiper .swiper-slide {
          height: auto;
          min-height: 700px;
          overflow: hidden;
        }
        .swiper-pagination {
          bottom: 20px !important;
          display: flex;
          justify-content: center;
          align-items: center;
          gap: 8px;
          z-index: 20;
        }
        .custom-bullet {
          width: 12px;
          height: 12px;
          display: inline-block;
          border-radius: 50%;
          background: rgba(255, 255, 255, 0.6);
          cursor: pointer;
          transition: all 0.3s ease;
          position: relative;
        }
        .custom-bullet i {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background: white;
          opacity: 0;
          transition: opacity 0.3s ease;
        }
        .custom-bullet-active {
          background: transparent;
          border: 2px solid white;
          width: 16px;
          height: 16px;
        }
        .custom-bullet-active i {
          opacity: 1;
        }
        .swiper-button-next,
        .swiper-button-prev {
          color: #3f2f14;
          background: rgba(255, 255, 255, 0.8);
          width: 48px;
          height: 48px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
          transition: all 0.3s ease;
          z-index: 20;
        }
        .swiper-button-next:after,
        .swiper-button-prev:after {
          content: none;
        }
        .swiper-button-next:hover,
        .swiper-button-prev:hover {
          background: white;
          transform: scale(1.05);
        }
        @media (max-width: 767px) {
          .swiper-pagination {
            bottom: 10px !important;
          }
          .hero-swiper .swiper-slide {
            min-height: 600px;
          }
        }
      `}</style>
    </section>
  );
}

// --------------------- Game Details (Gold) ---------------------
function GameDetails() {
  const [open, setOpen] = useState(false);
  const YT = "https://youtu.be/2qLAo-AydUc";
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-100px" });

  return (
    <section ref={sectionRef} id="GameDetails" className="w-full bg-brand-gold">
      <div className="mx-auto px-4 py-14 sm:px-6 lg:max-w-[80vw] lg:px-8">
        <div className="flex flex-col items-center md:flex-row">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -50 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="order-1 flex w-full items-center justify-center py-6 md:order-1 md:w-1/2 md:py-0"
          >
            <MediaLayoutRight
              image="https://ik.imagekit.io/pratik11/PRIME-TIME-FOLD-2-IMAGE.png?updatedAt=1758352229897"
              videoSrc=""
              text="PrimeTime™"
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
              className="headingstyle font-heading font-extrabold leading-tight text-[#3F2F14]"
            >
              Details About The Game
            </motion.h2>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="textstyles mt-3 max-w-xl font-sans text-[#3F2F14]"
            >
              A lightning‑quick numbers game that rewards smart matching and prime‑factor insights.
              Perfect for 2–6 players, ages 8+.
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="mt-6"
            >
              <CTAButton
                text="Watch How to play Video"
                onClick={() => setOpen(true)}
                bg="#FFFFFF"
                color="#7E5C2E"
                hoverBg="#7E5C2E"
                hoverColor="#FFFFFF"
                size="md"
                ariaLabel="Open Game Details video"
                rightIcon={
                  <svg
                    className="h-4 w-4 transition-transform group-hover:translate-x-1"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                }
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

  const handleStartWatching = () => {
    setActive(0);
    setIsPlaying(true);
  };

  const handleCloseModal = () => {
    setActive(null);
    setIsPlaying(false);
  };

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        handleCloseModal();
      }
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
    <section ref={sectionRef} className="relative w-full bg-brand-coral">
      <div className="mx-auto px-4 py-14 sm:px-6 lg:max-w-[80vw] lg:px-8">
        <div className="grid items-center gap-10 md:grid-cols-[1.1fr,1fr]">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -50 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="px-0 sm:px-8"
          >
            <motion.h2
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
              transition={{ duration: 0.6 }}
              className="headingstyle font-heading font-extrabold text-white/90"
            >
              Frequently Asked Question about Prime Time™
            </motion.h2>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="textstyles mt-3 max-w-prose text-white/90"
            >
              Watch these to get answers to all your questions about Prime Time™
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="mt-6"
            >
              <CTAButton
                text="Start watching"
                onClick={handleStartWatching}
                bg="#FFFFFF"
                color="#AB4637"
                hoverBg="rgba(0,0,0,0.25)"
                hoverColor="#FFFFFF"
                roundedClass="rounded-full"
                size="md"
                className="font-medium transition-colors"
                ariaLabel="Start watching the first video"
                rightIcon={
                  <svg
                    className="h-4 w-4 transition-transform group-hover:translate-x-1"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                }
              />
            </motion.div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: 50 }}
            transition={{ duration: 0.7, delay: 0.3 }}
            className="rounded-4xl bg-white p-4 shadow-soft sm:p-0 md:p-5"
          >
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 md:gap-5">
              {videos.map((item, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, scale: 0.8, y: 30 }}
                  animate={
                    isInView ? { opacity: 1, scale: 1, y: 0 } : { opacity: 0, scale: 0.8, y: 30 }
                  }
                  transition={{ duration: 0.5, delay: 0.1 * i }}
                  whileHover={{ scale: 1.05, y: -5 }}
                  onClick={() => handleVideoClick(i)}
                  onMouseEnter={() => setHoveredVideo(i)}
                  onMouseLeave={() => setHoveredVideo(null)}
                  className="group relative aspect-[9/16] cursor-pointer overflow-hidden rounded-xl bg-gray-100 ring-1 ring-gray-200"
                >
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
                      alt={`Video thumbnail ${i + 1}`}
                      className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                  )}

                  <div className="absolute inset-0 flex items-center justify-center bg-black/10 transition-all group-hover:bg-black/20">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white/90 transition-transform group-hover:scale-110 sm:h-12 sm:w-12">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                        className="ml-0.5 h-5 w-5 text-gray-900 sm:h-6 sm:w-6"
                      >
                        <path
                          fillRule="evenodd"
                          d="M4.5 5.653c0-1.426 1.529-2.33 2.779-1.643l11.54 6.348c1.295.712 1.295 2.573 0 3.285L7.28 19.991c-1.25.687-2.779-.217-2.779-1.643V5.653z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>

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
            className="relative mx-4 w-full max-w-4xl"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={handleCloseModal}
              className="absolute -top-12 right-0 z-10 rounded-full bg-white/20 p-2 transition-colors hover:bg-white/30"
              aria-label="Close video"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="h-6 w-6 text-white"
              >
                <path
                  fillRule="evenodd"
                  d="M5.47 5.47a.75.75 0 011.06 0L12 10.94l5.47-5.47a.75.75 0 111.06 1.06L13.06 12l5.47 5.47a.75.75 0 11-1.06 1.06L12 13.06l-5.47 5.47a.75.75 0 01-1.06-1.06L10.94 12 5.47 6.53a.75.75 0 010-1.06z"
                  clipRule="evenodd"
                />
              </svg>
            </button>
            <div
              className="flex items-center justify-center overflow-hidden rounded-2xl bg-black shadow-2xl"
              style={{ maxHeight: "80vh" }}
            >
              <video
                src={videos[active].video}
                autoPlay={isPlaying}
                controls
                className="h-full w-full object-contain"
                style={{ maxHeight: "80vh" }}
              />
            </div>
          </motion.div>
        </motion.div>
      )}
    </section>
  );
}

// --------------------- Interactive Games (Gray) ---------------------
function InteractiveGames() {
  const [isModalOpen, setIsModalOpen] = useState(false);
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
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
            transition={{ duration: 0.6 }}
            className="mb-12 text-center"
          >
            <h2 className="headingstyle mb-4 font-extrabold text-brand-teal">
              Interactive Learning Games
            </h2>
            <p className="textstyles mx-auto max-w-3xl text-brand-tealDark/80">
              Try these fun games that complement the Logicoland experience and help develop logical
              thinking skills.
            </p>
          </motion.div>

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
                ></iframe>
              </div>
              <p className="mt-4 text-center text-brand-tealDark/80">Identify Prime Number...</p>
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
                ></iframe>
              </div>
              <p className="mt-4 text-center text-brand-tealDark/80">Find Composite Number...</p>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
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
          className="mb-8 flex items-center justify-between"
        >
          <h2 className="headingstyle font-extrabold text-brand-teal">Gallery</h2>
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
          className="w-full"
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
                    alt={`Gallery ${i + 1}`}
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
            alt="Full View"
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
  );
}

// --------------------- Lost Card Helper ---------------------
function LostCardHelper() {
  const trayImages = [
    "https://res.cloudinary.com/deunonql5/image/upload/v1757381453/TRAY_1_hsi9wt.png",
  ];
  const randomTray = () => trayImages[Math.floor(Math.random() * trayImages.length)];
  const buildCardUrl = (n: number) => `/Images/primetimecardImages/PRIME TIME CARD ${n}.png`;

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
                      alt="Tray"
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
                        alt="Card"
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
                Lost a card?
              </motion.h2>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                transition={{ duration: 0.6, delay: 0.1 }}
                className="textstyles mt-3 max-w-prose font-sans"
              >
                Worry not! We've got you covered - The game box comes with four blank cards just for
                this purpose.
              </motion.p>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="textstyles mt-3 max-w-prose font-sans"
              >
                Enter the card number below.
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
                  placeholder="1–60 (or leave empty)"
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
                  className="group min-w-[120px] rounded-full bg-white px-2 py-3 font-sans text-[14px] font-medium text-[#557f28] transition-colors hover:bg-[#557f28] hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-teal/40"
                >
                  Show card
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={resetToTray}
                  type="button"
                  className="group min-w-[100px] rounded-full bg-white px-6 py-3 text-[14px] font-medium text-[#557f28] transition-colors hover:bg-[#557f28] hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-teal/40"
                >
                  Reset
                </motion.button>
              </motion.div>

              {error && (
                <motion.p
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-3 text-sm text-red-200"
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

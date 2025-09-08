"use client";
import NavBar from "@/components/NavBar";
import Footer from "@/components/Footer";
import React, { useEffect, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination, Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Community from "@/components/Community";
import MediaLayout from "@/components/MediaLayout";
import CTAButton from "@/components/CTAButton";

export default function PrimeTimeLanding() {
  return (
    <main className="min-h-screen bg-brand-hero">
      <NavBar />
      <Hero />
      <GameDetails />
      <InstructionVideos />
      <InteractiveGames />
      <LostCardHelper />
      <Community />
      <Footer />
    </main>
  );
}

// --------------------- Hero ---------------------
function Hero() {
  const slides = [
    {
      id: 1,
      pretitle: "Introducing Prime Time",
      title: "Where kids learn effortlessly",
      subtitle: "and adults get hooked.",
      description:
        "Prime Time is a fun, fast-paced board game that makes numbers exciting for kids. (and is surprisingly addictive for adults too!)",
      image:
        "https://ik.imagekit.io/pratik2002/thumbnail2.png?updatedAt=1756264541926",
      cta: "Learn more",
      ctaLink: "/philosophy",
    },
    {
      id: 2,
      pretitle: "From classrooms to living rooms",
      title: "Prime Time makes numbers",
      subtitle: "fun for everyone.",
      description:
        "Reinforces concept of Prime and Composite numbers, factorization through gameplay",
      image:
        "https://ik.imagekit.io/pratik2002/thumbnail3.png?updatedAt=1756264542776",
      cta: "Discover how",
      ctaLink: "/how-it-works",
    },
    {
      id: 3,
      pretitle: "Say hello to Prime Time",
      title: "Where numbers, luck & strategy",
      subtitle: "all come together!",
      description:
        "You don't need to know anything about primes, composites, or factorization to start playing — the game's clever design teaches it naturally as you go.",
      image:
        "https://ik.imagekit.io/pratik2002/logicology-img1.png?updatedAt=1757034142387",
      cta: "Get started",
      ctaLink: "/get-started",
    },
  ];

  return (
    <section className="section my-10">
      <div className="container-padding">
        <div className="section-rounded overflow-hidden relative">
          <Swiper
            spaceBetween={0}
            slidesPerView={1}
            loop={true}
            autoplay={{ delay: 5000, disableOnInteraction: false }}
            pagination={{
              clickable: true,
              bulletClass: "custom-bullet",
              bulletActiveClass: "custom-bullet-active",
              renderBullet: (i, c) => `<span class="${c}"><i></i></span>`,
            }}
            navigation={{
              nextEl: ".swiper-button-next",
              prevEl: ".swiper-button-prev",
            }}
            modules={[Autoplay, Pagination, Navigation]}
            className="hero-swiper"
          >
            {slides.map((slide) => (
              <SwiperSlide key={slide.id}>
                {/* Full-bleed background */}
                <div
                  className="absolute inset-0 z-0"
                  style={{
                    backgroundImage: `url('${slide.image}')`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                    backgroundRepeat: "no-repeat",
                  }}
                />

                {/* Centered content, max 80vw */}
                <div className="relative z-10 min-h-[700px] flex items-center">
                  <div className="lg:mx-auto lg:w-[80vw] lg:max-w-[80vw] md:mx-auto md:w-[80vw] md:max-w-[80vw]">
                    <div className="flex">
                      <div className="p-8 sm:p-12">
                        <p className="text-white font-semibold textstyles tracking-wide">
                          {slide.pretitle}
                        </p>
                        <h1 className="headingstyle font-bold mt-2 text-white leading-tight">
                          {slide.title}
                          <span className="block text-white">
                            {slide.subtitle}
                          </span>
                        </h1>
                        <p className="text-white mt-4 textstyles max-w-md">
                          {slide.description}
                        </p>
                        <div className="mt-6">
                          <CTAButton
                            text={slide.cta}
                            href={slide.ctaLink}
                            bg="#FFFFFF"
                            color="#0A8A80" // brand teal text
                            hoverBg="#0A8A80" // brand teal bg on hover
                            hoverColor="#FFFFFF" // white text on hover
                            size="md"
                            rightIcon={
                              <svg
                                className="w-4 h-4 transition-transform group-hover:translate-x-1"
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
                        </div>
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
          background: #fff;
          opacity: 0;
          transition: opacity 0.3s ease;
        }
        .custom-bullet-active {
          background: transparent;
          border: 2px solid #fff;
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
          background: #fff;
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
  return (
    <section className="w-full bg-brand-gold/90">
      <div className="lg:max-w-[80vw] mx-auto px-4 sm:px-6 lg:px-8 py-14">
        {/* Flex container replacing grid */}
        <div className="flex flex-col md:flex-row items-center">
          {/* MediaLayout on left for larger screens, top for mobile */}
          <div className="w-full md:w-1/2 order-1 md:order-1 flex justify-center items-center py-6 md:py-0">
            <MediaLayout
              image="https://ik.imagekit.io/pratik2002/ChatGPT%20Image%20Aug%2018,%202025,%2005_37_03%20AM.png?updatedAt=1755475680524"
              videoSrc="https://ik.imagekit.io/pratik2002/Prime%20Numbers%20(Reel%202)_1.mp4?updatedAt=1756253537445"
            />
          </div>

          {/* Content on right for larger screens, bottom for mobile */}
          <div className="w-full md:w-1/2 p-8 sm:p-12 order-2 md:order-2">
            <h2 className="headingstyle leading-tight text-[#3F2F14] font-extrabold font-heading">
              Details About The Game
            </h2>

            <p className="mt-3 textstyles text-[#3F2F14] max-w-2xl font-sans">
              A lightning‑quick numbers game that rewards smart matching and
              prime‑factor insights. Perfect for 2–6 players, ages 8+.
            </p>
            <div className="mt-6">
              <CTAButton
                text="Learn more"
                href=""
                bg="#FFFFFF"
                color="#7E5C2E" // brand teal text
                hoverBg="#7E5C2E" // brand teal bg on hover
                hoverColor="#FFFFFF" // white text on hover
                size="md"
                rightIcon={
                  <svg
                    className="w-4 h-4 transition-transform group-hover:translate-x-1"
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
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function InstructionVideos() {
  const videos = [
    "https://ik.imagekit.io/pratik2002/Prime%20Numbers%20(Reel%201)_2.mp4?updatedAt=1756253482407",
    "https://ik.imagekit.io/pratik2002/Prime%20Numbers%20(Reel%201)_1.mp4?updatedAt=1756253492642",
    "https://ik.imagekit.io/pratik2002/Prime%20Numbers%20(Reel%201)_3.mp4?updatedAt=1756253493297",
    "https://ik.imagekit.io/pratik2002/Prime%20Numbers%20(Reel%202)_3.mp4?updatedAt=1756253528805",
    "https://ik.imagekit.io/pratik2002/Prime%20Numbers%20(Reel%202)_2.mp4?updatedAt=1756253535887",
    "https://ik.imagekit.io/pratik2002/Prime%20Numbers%20(Reel%202)_1.mp4?updatedAt=1756253537445",
  ];

  const [active, setActive] = useState<number | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  const handleVideoClick = (index: number) => {
    setActive(index);
    setIsPlaying(true);
  };

  const handleCloseModal = () => {
    setActive(null);
    setIsPlaying(false);
  };

  // Close modal when pressing Escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        handleCloseModal();
      }
    };

    if (active !== null) {
      document.addEventListener("keydown", handleEscape);
      document.body.style.overflow = "hidden"; // Prevent scrolling when modal is open
    }

    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "unset";
    };
  }, [active]);

  return (
    <section className="w-full bg-brand-coral relative">
      <div className="lg:max-w-[80vw] mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid md:grid-cols-[1.1fr,1fr] gap-10 items-center">
          <div>
            <h2 className="headingstyle text-white/90 font-extrabold font-heading">
              How to play Instruction Videos
            </h2>

            <p className="mt-3 textstyles text-white/90 max-w-prose">
              Short, punchy walkthroughs so you can learn while you play.
            </p>

            <div className="mt-6">
              <CTAButton
                text="Start watching"
                href="#videos"
                bg="#FFFFFF" // matches bg-black/20
                color="#AB4637" 
                hoverBg="rgba(0,0,0,0.25)" // matches hover:bg-black/25
                hoverColor="#FFFFFF"
                roundedClass="rounded-full"
                size="md"
                className="font-medium transition-colors"
                ariaLabel="Jump to videos section"
                rightIcon={
                  <svg
                    className="w-4 h-4 transition-transform group-hover:translate-x-1"
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
            </div>
          </div>

          {/* White background container only for videos */}
          <div className="bg-white rounded-4xl p-0 sm:p-0 md:p-5 shadow-soft">
            {/* 2 cols on phones, 3 cols from sm/md up */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 sm:gap-2 md:gap-4">
              {videos.map((src, i) => (
                <div
                  key={i}
                  onClick={() => handleVideoClick(i)}
                  className="relative aspect-[9/16] min-h-[200px] sm:min-h-[220px] md:min-h-[260px]
                   rounded-xl overflow-hidden bg-gray-100 ring-1 ring-gray-200
                   cursor-pointer group"
                >
                  <video
                    src={src}
                    muted
                    loop
                    playsInline
                    preload="metadata"
                    className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                  {/* Play overlay */}
                  <div className="absolute inset-0 flex items-center justify-center bg-black/10 group-hover:bg-black/20 transition-all">
                    <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-white/90 flex items-center justify-center group-hover:scale-110 transition-transform">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                        className="w-5 h-5 sm:w-6 sm:h-6 text-gray-900 ml-0.5"
                      >
                        <path
                          fillRule="evenodd"
                          d="M4.5 5.653c0-1.426 1.529-2.33 2.779-1.643l11.54 6.348c1.295.712 1.295 2.573 0 3.285L7.28 19.991c-1.25.687-2.779-.217-2.779-1.643V5.653z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {active !== null && (
        <div
          className="fixed inset-0 bg-black/90 flex items-center justify-center z-50 p-4 backdrop-blur-sm"
          onClick={handleCloseModal}
        >
          <div
            className="relative max-w-4xl w-full mx-4"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={handleCloseModal}
              className="absolute -top-12 right-0 bg-white/20 rounded-full p-2 hover:bg-white/30 transition-colors z-10"
              aria-label="Close video"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="w-6 h-6 text-white"
              >
                <path
                  fillRule="evenodd"
                  d="M5.47 5.47a.75.75 0 011.06 0L12 10.94l5.47-5.47a.75.75 0 111.06 1.06L13.06 12l5.47 5.47a.75.75 0 11-1.06 1.06L12 13.06l-5.47 5.47a.75.75 0 01-1.06-1.06L10.94 12 5.47 6.53a.75.75 0 010-1.06z"
                  clipRule="evenodd"
                />
              </svg>
            </button>
            <div
              className="rounded-2xl overflow-hidden shadow-2xl bg-black flex items-center justify-center"
              style={{ maxHeight: "80vh" }}
            >
              <video
                src={videos[active]}
                autoPlay={isPlaying}
                controls
                className="w-full h-full object-contain"
                style={{ maxHeight: "80vh" }}
              />
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
// --------------------- Interactive Games (Gray) ---------------------
function InteractiveGames() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  return (
    <section className="w-full bg-brand-grayBg">
      <div className="lg:max-w-[80vw] mx-auto px-3 sm:px-5 py-12 sm:py-16 md:py-20">
        <div className="rounded-[22px] bg-white p-6 sm:p-10 shadow-soft">
          <div className="text-center mb-12">
            <h2 className="headingstyle font-extrabold text-brand-teal mb-4">
              Interactive Learning Games
            </h2>
            <p className="textstyles text-brand-tealDark/80 max-w-3xl mx-auto">
              Try these fun games that complement the Logicoland experience and
              help develop logical thinking skills.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {/* Game 1 */}
            <div className="bg-white rounded-4xl p-6 shadow-soft overflow-hidden">
              <h3 className="text-xl font-bold text-brand-teal mb-4 text-center">
                Prime Number Explorer
              </h3>
              <div className="aspect-video bg-brand-grayBg rounded-3xl overflow-hidden">
                <iframe
                  style={{ maxWidth: "100%" }}
                  src="https://wordwall.net/embed/play/96298/037/880"
                  width="100%"
                  height="100%"
                  frameBorder="0"
                  allowFullScreen
                  className="w-full h-full"
                ></iframe>
              </div>
              <p className="mt-4 text-center text-brand-tealDark/80">
                Identify Prime Number......
              </p>
            </div>

            {/* Game 2 */}
            <div className="bg-white rounded-4xl p-6 shadow-soft overflow-hidden">
              <h3 className="text-xl font-bold text-brand-teal mb-4 text-center">
                Composite Number Challenge
              </h3>
              <div className="aspect-video bg-brand-grayBg rounded-3xl overflow-hidden">
                <iframe
                  style={{ maxWidth: "100%" }}
                  src="https://wordwall.net/embed/play/96298/689/270"
                  width="100%"
                  height="100%"
                  frameBorder="0"
                  allowFullScreen
                  className="w-full h-full"
                ></iframe>
              </div>
              <p className="mt-4 text-center text-brand-tealDark/80">
                Find Composite Number....
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function LostCardHelper() {
  const trayImages = [
    "https://ik.imagekit.io/pratik2002/primetime_imag2.png?updatedAt=1757032084405",
  ];
  const randomTray = () =>
    trayImages[Math.floor(Math.random() * trayImages.length)];
  const buildCardUrl = (n: number) => `/Images/primetimecardImages/PRIME TIME CARD ${n}.png`;

  const [cardNo, setCardNo] = React.useState("");
  const [imgSrc, setImgSrc] = React.useState<string>(randomTray());
  const [isTray, setIsTray] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);
  const [loading, setLoading] = React.useState(false);

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

    if (!/^\d+$/.test(cardNo.trim()))
      return setError("Card number should be numeric.");
    const num = Number(cardNo);
    if (num < 1 || num > 60)
      return setError("Enter a number between 1 and 60.");

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
      setError(
        "That card image is not available. Check the number or filename."
      );
    };
    probe.src = nextUrl;
  };

  const onKeyDown: React.KeyboardEventHandler<HTMLInputElement> = (e) => {
    if (e.key === "Enter") showCard();
  };

  return (
    <section className="w-full bg-[#84C341]">
      <div className="lg:max-w-[80vw] mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="rounded-[22px] p-6 sm:p-10">
          <div className="grid md:grid-cols-[1fr,1.2fr] gap-8 items-center">
            {/* Left: Image container */}
            <div className="order-2 md:order-1">
              <div
                className="relative w-full h-[320px] md:h-[420px] rounded-2xl 
                              overflow-hidden bg-white flex items-center justify-center 
                              border-8 border-gray-200 shadow-soft"
              >
                {isTray ? (
                  // TRAY: fill container fully
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
                  // CARD: smaller image with shadow
                  <Image
                    src={imgSrc}
                    alt="Card"
                    width={180}
                    height={240}
                    className={`object-contain rounded-xl shadow-2xl transition-opacity ${
                      loading ? "opacity-60" : "opacity-100"
                    }`}
                    priority={false}
                  />
                )}
              </div>

              {loading && (
                <p className="mt-3 text-sm text-gray-200 text-center">
                  Loading image…
                </p>
              )}
            </div>

            {/* Right: Controls & Text */}
            <div className="order-1 md:order-2 text-white">
              <h2 className="textstyles  text-white/90 font-extrabold font-heading">
                Card replacement helper
              </h2>
              <h2 className="headingstyle text-white/90 font-extrabold font-heading">
                Lost a card? We’ve got you covered.
              </h2>
              <p className="textstyles mt-3 max-w-prose font-sans">
                Enter a card number to preview it.
              </p>

              <div className="mt-6 flex flex-col sm:flex-row gap-3">
                <label className="sr-only" htmlFor="card-number">
                  Card number
                </label>
                <input
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
                  className="w-full sm:max-w-xs rounded-full border border-gray-300 
                             px-5 py-3 text-sm outline-none text-gray-900
                             focus:ring-2 focus:ring-brand-teal/40"
                />
                <button
  onClick={showCard}
  className="group rounded-full px-6 py-3 font-medium
             border-2 border-brand-teal bg-white text-brand-teal
             transition-colors hover:bg-brand-teal hover:text-white
             focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-teal/40"
>
  Show card
</button>

<button
  onClick={resetToTray}
  type="button"
  className="group rounded-full px-6 py-3 font-medium
             border-2 border-brand-teal bg-white text-brand-teal
             transition-colors hover:bg-brand-teal hover:text-white
             focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-teal/40"
>
  Reset
</button>

              </div>

              {error && <p className="mt-3 text-sm text-red-200">{error}</p>}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

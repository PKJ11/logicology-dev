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

  const [isMobile, setIsMobile] = useState(false);

  // Effect to check screen size and set mobile state
  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    // Initial check
    checkScreenSize();

    // Add event listener for window resize
    window.addEventListener("resize", checkScreenSize);

    // Cleanup
    return () => window.removeEventListener("resize", checkScreenSize);
  }, []);
  const slides = [
    {
      id: 1,
      pretitle: "Introducing Prime Time",
      title: "Where kids learn effortlessly",
      subtitle: "and adults get hooked.",
      description:
        "Prime Time is a fun, fast-paced board game that makes numbers exciting for kids. (and is surprisingly addictive for adults too!)",
      image: {
        desktop:
          "https://ik.imagekit.io/pratik11/PRIME-TIME-SLIDER-1-DESKTOPVIEW-.png?updatedAt=1758359616937",
        mobile:
          "https://ik.imagekit.io/pratik11/PRIME-TIME-SLIDER-1-MOBILE-VIEW.png?updatedAt=1758359620797",
      },
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
        image: {
        desktop:
          "https://ik.imagekit.io/pratik11/PRIME-TIME-SLIDER-2-DESKTOPVIEW-.png?updatedAt=1758359620883",
        mobile:
          "https://ik.imagekit.io/pratik11/PRIME-TIME-SLIDER-2-MOBILE-VIEW.png?updatedAt=1758359620876",
      },
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
        image: {
        desktop:
          "https://ik.imagekit.io/pratik11/PRIME-TIME-SLIDER-3-DESKTOPVIEW-.png?updatedAt=1758359630962",
        mobile:
          "https://ik.imagekit.io/pratik11/PRIME-TIME-SLIDER-3-MOBILE-VIEW.png?updatedAt=1758359662353",
      },
      cta: "Get started",
      ctaLink: "/get-started",
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
                autoplay={{ delay: 5000, disableOnInteraction: false }}
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
                {slides.map((slide) => (
                  <SwiperSlide key={slide.id}>
                    {/* Full-bleed background */}
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
    
                    {/* Content: centered, max 80vw */}
                    <div className="relative z-10 flex min-h-[700px] items-center">
                      <div className="md:mx-auto md:w-[75vw] md:max-w-[75vw] lg:mx-auto lg:w-[75vw] lg:max-w-[75vw]">
                        <div className="flex">
                          <div className="p-8 sm:p-12">
                            <h1 className="font-heading text-[20px] font-bold text-white sm:text-[22px] md:text-[24px] lg:text-[24px]">
                              {slide.pretitle}
                            </h1>
                            <h1 className="mt-2 font-heading text-[41px] font-bold leading-tight text-white sm:text-[44px] md:text-[50px] lg:text-[50px]">
                              {slide.title}
    
                              <span className="block font-heading text-[41px] leading-tight text-white sm:text-[44px] md:text-[50px] lg:text-[50px]">
                                {slide.subtitle}
                              </span>
                            </h1>
                            <p className="mt-6 max-w-md font-heading text-[20px] text-white sm:text-[22px] md:text-[24px] lg:text-[24px]">
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
  return (
    <section className="w-full bg-brand-gold">
      <div className="mx-auto px-4 py-14 sm:px-6 lg:max-w-[80vw] lg:px-8">
        {/* Flex container replacing grid */}
        <div className="flex flex-col items-center md:flex-row">
          {/* MediaLayout on left for larger screens, top for mobile */}
          <div className="order-1 flex w-full items-center justify-center py-6 md:order-1 md:w-1/2 md:py-0">
            <MediaLayout
              image="https://ik.imagekit.io/pratik11/PRIME-TIME-FOLD-2-IMAGE.png?updatedAt=1758352229897"
              videoSrc=""
            />
          </div>

          {/* Content on right for larger screens, bottom for mobile */}
          <div className="order-2 w-full px-4 py-8 sm:p-12 md:order-2 md:w-1/2">
            <h2 className="headingstyle font-heading font-extrabold leading-tight text-[#3F2F14]">
              Details About The Game
            </h2>

            <p className="textstyles mt-3 max-w-xl font-sans text-[#3F2F14]">
              A lightning‑quick numbers game that rewards smart matching and prime‑factor insights.
              Perfect for 2–6 players, ages 8+.
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
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function InstructionVideos() {
  const videos = [
    {
      video: "https://ik.imagekit.io/pratik2002/Prime%20Numbers%20(Reel%201)_2.mp4?updatedAt=1756253482407",
      thumbnail: "https://ik.imagekit.io/pratik11/1.jpg?updatedAt=1758357418282"
    },
    {
      video: "https://ik.imagekit.io/pratik2002/Prime%20Numbers%20(Reel%201)_1.mp4?updatedAt=1756253492642",
      thumbnail: "https://ik.imagekit.io/pratik11/2.jpg?updatedAt=1758357418802"
    },
    {
      video: "https://ik.imagekit.io/pratik2002/Prime%20Numbers%20(Reel%201)_3.mp4?updatedAt=1756253493297",
      thumbnail: "https://ik.imagekit.io/pratik11/1.jpg?updatedAt=1758357418282"
    },
    {
      video: "https://ik.imagekit.io/pratik2002/Prime%20Numbers%20(Reel%202)_1.mp4?updatedAt=1756253537445",
      thumbnail: "https://ik.imagekit.io/pratik11/2.jpg?updatedAt=1758357418802"
    },
    {
      video: "https://ik.imagekit.io/pratik2002/Prime%20Numbers%20(Reel%202)_2.mp4?updatedAt=1756253535887",
      thumbnail: "https://ik.imagekit.io/pratik11/1.jpg?updatedAt=1758357418282"
    },
    {
      video: "https://ik.imagekit.io/pratik2002/Prime%20Numbers%20(Reel%202)_3.mp4?updatedAt=1756253528805",
      thumbnail: "https://ik.imagekit.io/pratik11/2.jpg?updatedAt=1758357418802"
    },
  ];

  const [active, setActive] = useState<number | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [hoveredVideo, setHoveredVideo] = useState<number | null>(null);

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
    <section className="relative w-full bg-brand-coral">
      <div className="mx-auto px-4 py-14 sm:px-6 lg:max-w-[80vw] lg:px-8">
        <div className="grid items-center gap-10 md:grid-cols-[1.1fr,1fr]">
          <div className="px-0 sm:px-8">
            <h2 className="headingstyle font-heading font-extrabold text-white/90">
              Frequently Asked Question about Prime Time
            </h2>

            <p className="textstyles mt-3 max-w-prose text-white/90">
              Watch these to get answers to all your questions about Prime Time™
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
            </div>
          </div>

          {/* White background container only for videos */}
          <div className="rounded-4xl bg-white p-4 shadow-soft sm:p-0 md:p-5">
            {/* 2 cols on phones, 3 cols from sm/md up */}
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 sm:gap-2 md:gap-4">
              {videos.map((item, i) => (
                <div
                  key={i}
                  onClick={() => handleVideoClick(i)}
                  onMouseEnter={() => setHoveredVideo(i)}
                  onMouseLeave={() => setHoveredVideo(null)}
                  className="group relative aspect-[9/16] min-h-[200px] cursor-pointer overflow-hidden rounded-xl bg-gray-100 ring-1 ring-gray-200 sm:min-h-[220px] md:min-h-[260px]"
                >
                  {/* Show video on hover, thumbnail by default */}
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
                  
                  {/* Play overlay */}
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
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {active !== null && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4 backdrop-blur-sm"
          onClick={handleCloseModal}
        >
          <div className="relative mx-4 w-full max-w-4xl" onClick={(e) => e.stopPropagation()}>
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
      <div className="mx-auto px-3 py-12 sm:px-5 sm:py-16 md:py-20 lg:max-w-[80vw]">
        <div className="rounded-[22px] bg-white p-6 shadow-soft sm:p-10">
          <div className="mb-12 text-center">
            <h2 className="headingstyle mb-4 font-extrabold text-brand-teal">
              Interactive Learning Games
            </h2>
            <p className="textstyles mx-auto max-w-3xl text-brand-tealDark/80">
              Try these fun games that complement the Logicoland experience and help develop logical
              thinking skills.
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-2">
            {/* Game 1 */}
            <div className="overflow-hidden rounded-4xl bg-white p-6 shadow-soft">
              <h3 className="mb-4 text-center text-xl font-bold text-brand-teal">
                Prime Number Explorer
              </h3>
              <div className="aspect-video h-[300px] overflow-hidden rounded-3xl bg-brand-grayBg">
                <iframe
                  className="h-full w-full max-w-[300px] md:max-w-full lg:max-w-full"
                  src="https://wordwall.net/embed/play/96298/037/880"
                  frameBorder="0"
                  allowFullScreen
                ></iframe>
              </div>
              <p className="mt-4 text-center text-brand-tealDark/80">Identify Prime Number......</p>
            </div>

            {/* Game 2 */}
            <div className="overflow-hidden rounded-4xl bg-white p-6 shadow-soft">
              <h3 className="mb-4 text-center text-xl font-bold text-brand-teal">
                Composite Number Challenge
              </h3>
              <div className="aspect-video h-[300px] overflow-hidden rounded-3xl bg-brand-grayBg">
                <iframe
                  src="https://wordwall.net/embed/play/96298/689/270"
                  frameBorder="0"
                  allowFullScreen
                  className="h-full w-full max-w-[300px] md:max-w-full lg:max-w-full"
                ></iframe>
              </div>
              <p className="mt-4 text-center text-brand-tealDark/80">Find Composite Number....</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

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
    <section className="w-full bg-[#84C341]">
      <div className="mx-auto px-4 py-14 sm:px-6 lg:max-w-[80vw] lg:px-8">
        <div className="rounded-[22px] p-6 sm:p-6">
          {/* Flex container replacing grid */}
          <div className="flex flex-col items-center gap-8 md:flex-row lg:gap-16">
            {/* Left: Image container */}
            <div className="order-2 flex w-full items-center justify-start py-6 md:order-1 md:w-1/2 md:py-0">
              <div className="relative aspect-square w-[95%] max-w-[700px] rounded-[28px] border-[12px] border-white bg-white p-2 shadow-soft md:border-[14px]">
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
                  )}
                </div>
              </div>

              {loading && <p className="mt-3 text-center text-sm text-gray-200">Loading image…</p>}
            </div>

            {/* Right: Controls & Text */}
            <div className="order-1 w-full text-white md:order-2 md:w-1/2">
              {/* <h2 className="textstyles text-white/90 font-extrabold font-heading">
                Card replacement helper
              </h2> */}
              <h2 className="headingstyle font-heading font-extrabold text-white/90">
                Lost a card?
              </h2>
              <p className="textstyles mt-3 max-w-prose font-sans">
                Worry not! We've got you covered - The game box comes with four blank cards just for
                this purpose.
              </p>
              <p className="textstyles mt-3 max-w-prose font-sans">Enter the card number below.</p>

              <div className="mt-6 flex flex-col gap-3 sm:flex-row">
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
                  className="/* keep same bg */ w-full rounded-full border border-gray-300 bg-gray-50 px-5 py-3 text-sm text-gray-900 outline-none ring-0 focus:bg-gray-50 focus:ring-2 focus:ring-brand-teal/40 sm:max-w-xs"
                />

                <button
                  onClick={showCard}
                  className="group rounded-full bg-white px-2 py-3 font-sans text-[14px] font-medium text-[#557f28] transition-colors hover:bg-[#557f28] hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-teal/40"
                >
                  Show card
                </button>
                <button
                  onClick={resetToTray}
                  type="button"
                  className="group rounded-full bg-white px-6 py-3 text-[14px] font-medium text-[#557f28] transition-colors hover:bg-[#557f28] hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-teal/40"
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

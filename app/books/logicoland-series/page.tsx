"use client";

import NavBar from "@/components/NavBar";
import { useEffect, useRef, useState, useMemo } from "react";
import CommunitySignupModal from "@/components/CommunitySignupModal";
import SiteFooter from "@/components/Footer";
import CTAButton from "@/components/CTAButton";
import Community from "@/components/Community";
import BuySection from "@/components/BuySection";
import { motion, useInView } from "framer-motion";
import Head from "next/head";
import MediaLayoutRight from "@/components/MediaLayoutRight";
import { useCart } from "@/components/CartContext";
import HeroCheckoutModal, { HeroProductConfig } from "@/components/HeroCheckoutModal";
import toast from "react-hot-toast";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";
import Link from "next/link";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
/* ============================================================
   MAIN PAGE COMPONENT
============================================================ */
export default function Logicoland1Page() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("hero");

  useEffect(() => {
    const sections = ["hero", "buy", "puzzles", "printables", "community"];

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        });
      },
      {
        threshold: 0.3,
        rootMargin: "-10% 0px -10% 0px",
      }
    );

    sections.forEach((section) => {
      const element = document.getElementById(section);
      if (element) observer.observe(element);
    });

    return () => observer.disconnect();
  }, []);

  return (
    <>
      <Head>
        <title>Logicoland Volume 1 – STEM Logic & Puzzles for Kids | Logicology</title>
        <meta
          name="description"
          content="Logicoland Volume 1 is an interactive logic-based learning book for kids ages 6–12. Solve colorful Sudoku puzzles, play anagram games, complete symmetry patterns, and develop critical thinking skills through play."
        />
        <meta
          name="keywords"
          content="logicoland volume 1, logic puzzles for kids, STEM learning book, sudoku for kids, anagram games, symmetry patterns, logical reasoning, brain teasers for children, printable worksheets, math puzzles, critical thinking, educational book India, Logicology"
        />
        <meta
          name="robots"
          content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1"
        />
        <meta name="author" content="Logicology" />
        <meta name="publisher" content="Logicology" />
        <meta name="theme-color" content="#0A8A80" />
        <link rel="canonical" href="https://www.logicology.in/books/logicoland-volume-1" />

        {/* Open Graph / Facebook */}
        <meta property="og:type" content="book" />
        <meta property="og:url" content="https://www.logicology.in/books/logicoland-volume-1" />
        <meta property="og:site_name" content="Logicology" />
        <meta
          property="og:title"
          content="Logicoland Volume 1 – Empowering Minds Through STEM Play"
        />
        <meta
          property="og:description"
          content="Interactive logic puzzles, anagram games, symmetry patterns, and printable worksheets for kids aged 6–12. Learn while having fun with Logicoland!"
        />
        <meta
          property="og:image"
          content="https://ik.imagekit.io/pratik11/LOGICOLAND-ALL-5-BOOK-COVERS.png?tr=w-1200,h-630,c-at_max"
        />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta
          property="og:image:alt"
          content="Logicoland Volume 1 book cover – educational logic puzzles for kids"
        />
        <meta property="og:locale" content="en_IN" />

        {/* Twitter */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:url" content="https://www.logicology.in/books/logicoland-volume-1" />
        <meta name="twitter:title" content="Logicoland Volume 1 – Logic Puzzles for Kids" />
        <meta
          name="twitter:description"
          content="Make learning fun with Logicoland! Interactive puzzles, games, and printables that develop logical thinking in kids aged 6–12."
        />
        <meta
          name="twitter:image"
          content="https://ik.imagekit.io/pratik11/LOGICOLAND-ALL-5-BOOK-COVERS.png?tr=w-1200,h-630,c-at_max"
        />
        <meta
          name="twitter:image:alt"
          content="Logicoland Volume 1 – educational STEM book for kids"
        />

        {/* Schema.org — Book */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Book",
              name: "Logicoland Volume 1",
              url: "https://www.logicology.in/books/logicoland-volume-1",
              description:
                "Interactive logic-based learning book with colorful Sudoku puzzles, anagram games, symmetry patterns, and printable worksheets for kids aged 6–12.",
              image: "https://ik.imagekit.io/pratik11/LOGICOLAND-ALL-5-BOOK-COVERS.png",
              author: {
                "@type": "Organization",
                name: "Logicology",
                url: "https://www.logicology.in",
              },
              publisher: {
                "@type": "Organization",
                name: "Logicology",
                url: "https://www.logicology.in",
                logo: "https://ik.imagekit.io/pratik11/logicology-logo.png",
              },
              inLanguage: "en",
              audience: {
                "@type": "PeopleAudience",
                suggestedMinAge: 6,
                suggestedMaxAge: 12,
              },
              educationalAlignment: {
                "@type": "AlignmentObject",
                educationalFramework: "STEM",
                targetName: "Logical Reasoning, Pattern Recognition, Problem Solving",
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
                ratingCount: "150",
                bestRating: "5",
                worstRating: "1",
              },
            }),
          }}
        />

        {/* Schema.org — BreadcrumbList */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "BreadcrumbList",
              itemListElement: [
                {
                  "@type": "ListItem",
                  position: 1,
                  name: "Home",
                  item: "https://www.logicology.in",
                },
                {
                  "@type": "ListItem",
                  position: 2,
                  name: "Books",
                  item: "https://www.logicology.in/books",
                },
                {
                  "@type": "ListItem",
                  position: 3,
                  name: "Logicoland Volume 1",
                  item: "https://www.logicology.in/books/logicoland-volume-1",
                },
              ],
            }),
          }}
        />

        {/* Schema.org — FAQPage */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "FAQPage",
              mainEntity: [
                {
                  "@type": "Question",
                  name: "What age is Logicoland Volume 1 suitable for?",
                  acceptedAnswer: {
                    "@type": "Answer",
                    text: "Logicoland Volume 1 is designed for children aged 6 to 12 years. It uses colorful, visual puzzles that are easy for beginners while still challenging enough to keep older kids engaged.",
                  },
                },
                {
                  "@type": "Question",
                  name: "What kind of puzzles are in Logicoland Volume 1?",
                  acceptedAnswer: {
                    "@type": "Answer",
                    text: "The book includes 4×4 color Sudoku puzzles, anagram games, symmetry pattern challenges, and downloadable printable worksheets — all designed to build logical thinking and problem-solving skills.",
                  },
                },
                {
                  "@type": "Question",
                  name: "Does Logicoland Volume 1 come with printable worksheets?",
                  acceptedAnswer: {
                    "@type": "Answer",
                    text: "Yes! Logicoland Volume 1 includes free downloadable PDF worksheets for extra practice, available directly on the product page.",
                  },
                },
              ],
            }),
          }}
        />
      </Head>

      <main className="bg-brand-grayBg text-brand-tealDark">
        {/* ================= HERO ================= */}
        <NavBar />
        <section id="hero">
          <HeroVideo isActive={activeSection === "hero"} />
        </section>

        <section id="book-details">
          <BookDetails />
        </section>

        {/* ================= LOGICOLAND V1 ================= */}
        <section id="buysection">
          <BuySection />
        </section>

        {/* ================= INTERACTIVE PUZZLES ================= */}
        <section id="puzzles">
          <InteractivePuzzlesSection isActive={activeSection === "puzzles"} />
        </section>

        {/* ================= PRINTABLES ================= */}
        <section id="printables">
          <PrintablesSection isActive={activeSection === "printables"} />
        </section>

        {/* <section id="symmetry-game">
          <SymmetryPatternGame />
        </section> */}
        <section id="buy-block">
          <LogicolandBuyBlock />
        </section>
        {/* ================= COMMUNITY ================= */}
        <section id="community">
          <Community />
        </section>

        <SiteFooter />
      </main>

      <CommunitySignupModal open={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </>
  );
}

/* ============================================================
   HERO VIDEO SECTION
============================================================ */
function HeroVideo({ isActive }: { isActive: boolean }) {
  interface ExtendedHTMLVideoElement extends HTMLVideoElement {
    webkitEnterFullscreen?: () => void;
    webkitRequestFullscreen?: () => Promise<void>;
  }
  const videoRef = useRef<ExtendedHTMLVideoElement | null>(null);
  const [isMuted, setIsMuted] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isIOS, setIsIOS] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const isIOSDevice = /iPad|iPhone|iPod/.test(navigator.userAgent);
    setIsIOS(isIOSDevice);
  }, []);

  useEffect(() => {
    const checkScreenSize = () => setIsMobile(window.innerWidth < 768);
    checkScreenSize();
    window.addEventListener("resize", checkScreenSize);
    return () => window.removeEventListener("resize", checkScreenSize);
  }, []);

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  const toggleFullscreen = async () => {
    if (!videoRef.current) return;
    try {
      if (isIOS) {
        videoRef.current.removeAttribute("playsInline");
        videoRef.current.setAttribute("controls", "true");
        if (videoRef.current.webkitEnterFullscreen) {
          videoRef.current.webkitEnterFullscreen();
          setIsFullscreen(true);
        }
      } else {
        if (!document.fullscreenElement) {
          await videoRef.current.requestFullscreen?.();
          setIsFullscreen(true);
        } else {
          await document.exitFullscreen?.();
          setIsFullscreen(false);
        }
      }
    } catch (error) {
      console.error("Fullscreen error:", error);
    }
  };

  const scrollToBuySection = () => {
    const buySection = document.getElementById("buy-block");
    if (buySection) {
      buySection.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  };
  const ACCENT = "#fbb041";
  return (
    <>
      <style>{`
        .hv-buy-btn {
          background-color: #fbb041;
          color: #3d3b40;
          border: 2px solid transparent;
          transition: all 0.3s ease, transform 0.15s ease;
        }
        .hv-buy-btn:hover {
          background-color: #fa9e15;
          transform: scale(1.05);
          box-shadow: 0 6px 20px rgba(250,158,21,0.4);
        }
        .hv-buy-btn:active { transform: scale(0.95); }
 
        .hv-details-btn {
          background-color: transparent;
          border: 2px solid #ffffff;
          color: #ffffff;
          transition: all 0.3s ease, transform 0.15s ease;
        }
        .hv-details-btn:hover {
          background-color: #fa9e15;
          border-color: #fa9e15;
          color: #3d3b40;
          transform: scale(1.05);
          box-shadow: 0 6px 20px rgba(250,158,21,0.4);
        }
        .hv-details-btn:active { transform: scale(0.95); }
        .hv-details-btn .hv-label {
          position: relative;
          z-index: 1;
        }
      `}</style>

      {/* ── OUTER WRAPPER — matches HeroSlide2 / HeroSlider structure ── */}
      <section className="section my-10" ref={sectionRef}>
        <div className="container-padding">
          <div className="section-rounded relative overflow-hidden">
            {/* Background — same as HeroSlide2 */}
            <div
              className="relative w-full overflow-hidden"
              style={{
                backgroundImage: isMobile
                  ? `url('https://ik.imagekit.io/pratik11/LOGICOLAND-BACKGROUND-FRO-MOBILE.png?updatedAt=1781940668867')`
                  : `url('https://ik.imagekit.io/pratik11/LOGICOLAND-BACKGROUND-DESIGN-3.png')`,
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
                    className="mb-2 text-[20px] font-bold text-white md:text-[24px]"
                    style={{ fontFamily: "var(--font-outfit), sans-serif" }}
                    initial={{ y: 30, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                  >
                    The Logicoland Series • Ages 5+
                  </motion.p>

                  <motion.h1
                    className="mb-5 uppercase leading-[1.1] text-white"
                    style={{
                      fontFamily: "var(--font-outfit), sans-serif",
                      fontSize: "50px",
                      fontWeight: 800,
                    }}
                    initial={{ y: 40, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ duration: 0.7, delay: 0.25 }}
                  >
                    Big ideas turned
                    <br />
                    into child&apos;s play.
                  </motion.h1>

                  <motion.p
                    className="mb-3 max-w-[420px] text-[18px] font-bold leading-7 text-white lg:text-[26px]"
                    style={{ fontFamily: "var(--font-outfit), sans-serif" }}
                    initial={{ y: 30, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ duration: 0.6, delay: 0.35 }}
                  >
                    Looks like coloring, works like logic.
                  </motion.p>

                  <motion.p
                    className="mb-8 max-w-[420px] text-[18px] leading-7 text-white lg:text-[22px]"
                    style={{ fontFamily: "var(--font-outfit), sans-serif" }}
                    initial={{ y: 30, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ duration: 0.6, delay: 0.42 }}
                  >
                    Five books. Five topics. Endless possibilities. Perfect for children aged 5–8.
                  </motion.p>

                  <motion.div
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ duration: 0.5, delay: 0.5 }}
                    className="flex flex-row gap-3"
                  >
                    <button
                      onClick={scrollToBuySection}
                      className="hv-buy-btn inline-flex items-center gap-2 rounded-full px-8 py-4 text-center text-[18px] font-semibold"
                      style={{ fontFamily: "var(--font-outfit), sans-serif", cursor: "pointer" }}
                    >
                      Shop the series
                      <svg
                        className="h-4 w-4"
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
                    </button>

                    <Link
                      href="/books/logicoland-series"
                      className="hv-details-btn inline-block rounded-full px-8 py-4 text-center text-[18px] font-semibold"
                      style={{ fontFamily: "var(--font-outfit), sans-serif" }}
                    >
                      <span className="hv-label">View details →</span>
                    </Link>
                  </motion.div>
                </div>

                {/* Right — Amber circle + video */}
                <div className="relative z-10 flex flex-1 items-center justify-center py-8 pr-[3vw]">
                  <div
                    className="relative flex items-center justify-center overflow-hidden rounded-full"
                    style={{
                      width: "clamp(340px, 38vw, 520px)",
                      height: "clamp(340px, 38vw, 520px)",
                      border: `10px solid ${ACCENT}`,
                      boxShadow: "0 0 0 6px rgba(251,176,65,0.25)",
                      background: "#ffffff",
                    }}
                  >
                    <motion.img
                      src="https://ik.imagekit.io/pratik11/LOGICOLAND-IMAGE-CIRCLE.png?updatedAt=1782280451275"
                      alt="Logicoland Series"
                      className="object-cover"
                      style={{
                        width: "100%",
                        height: "100%",
                        position: "absolute",
                        inset: 0,
                        zIndex: 5,
                      }}
                      initial={{ scale: 0.85, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
                    />
                  </div>
                </div>
              </div>

              {/* ══ MOBILE LAYOUT ══ */}
              <div className="flex w-full flex-col md:hidden" style={{ minHeight: 720 }}>
                {/* Amber circle + video */}
                <div
                  className="relative flex items-center justify-center pb-4 pt-10"
                  style={{ minHeight: 300 }}
                >
                  <div
                    className="relative flex items-center justify-center overflow-hidden rounded-full"
                    style={{
                      width: 260,
                      height: 260,
                      background: "#ffffff",
                      border: `8px solid ${ACCENT}`,
                      boxShadow: "0 0 0 4px rgba(251,176,65,0.25)",
                    }}
                  >
                    <motion.img
                      src="https://ik.imagekit.io/pratik11/LOGICOLAND-IMAGE-CIRCLE.png?updatedAt=1782280451275"
                      alt="Logicoland Series"
                      className="object-cover"
                      style={{
                        width: "100%",
                        height: "100%",
                        position: "absolute",
                        inset: 0,
                        zIndex: 5,
                      }}
                      initial={{ scale: 0.85, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
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
                    The Logicoland Series • Ages 5+
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
                    Big ideas
                    <br />
                    turned into
                    <br />
                    child&apos;s play.
                  </motion.h1>

                  <motion.p
                    className="mb-2 max-w-[300px] text-[16px] font-bold leading-relaxed text-white"
                    style={{ fontFamily: "var(--font-outfit), sans-serif" }}
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ duration: 0.5, delay: 0.5 }}
                  >
                    Looks like coloring, works like logic.
                  </motion.p>

                  <motion.p
                    className="mb-6 max-w-[300px] text-[14px] leading-relaxed text-white"
                    style={{ fontFamily: "var(--font-outfit), sans-serif" }}
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ duration: 0.5, delay: 0.52 }}
                  >
                    Five books. Five topics. Endless possibilities. Perfect for children aged 5–8.
                  </motion.p>

                  <motion.div
                    initial={{ y: 15, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ duration: 0.45, delay: 0.6 }}
                    className="flex w-full flex-col items-center gap-3"
                  >
                    <button
                      onClick={scrollToBuySection}
                      className="hv-buy-btn inline-flex w-[260px] items-center justify-center gap-2 rounded-full py-4 text-center text-[16px] font-semibold"
                      style={{ fontFamily: "var(--font-outfit), sans-serif", cursor: "pointer" }}
                    >
                      Shop the series
                      <svg
                        className="h-4 w-4"
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
                    </button>

                    <Link
                      href="/books/logicoland-series"
                      className="hv-details-btn inline-block w-[260px] rounded-full py-4 text-center text-[16px] font-semibold"
                      style={{ fontFamily: "var(--font-outfit), sans-serif" }}
                    >
                      <span className="hv-label">View details →</span>
                    </Link>
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
    </>
  );
}

function BookDetails() {
  const [open, setOpen] = useState(false);
  const YT = "https://youtu.be/2qLAo-AydUc";
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-100px" });

  return (
    <section ref={sectionRef} id="BookDetails" className="w-full bg-brand-purple">
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
              className="headingstyle font-heading font-extrabold leading-tight text-white"
            >
              The trick? <br /> It never feels hard.
            </motion.h2>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="textstyles mt-3 max-w-xl font-sans text-white"
            >
              Big ideas become approachable when they're broken into small, enjoyable challenges.
              Every puzzle builds on the last, helping children gain confidence as they explore
              logic, patterns and problem-solving. Before they know it, they're tackling ideas that
              once seemed far beyond their reach.
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

/* ============================================================
   INTERACTIVE PUZZLES SECTION
============================================================ */
function InteractivePuzzlesSection({ isActive }: { isActive: boolean }) {
  const [isOpen, setIsOpen] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);

  return (
    <section ref={sectionRef} className="w-full overflow-hidden bg-brand-coral text-white">
      <div className="mx-auto px-4 py-12 sm:px-5 sm:py-16 md:max-w-[75vw] md:py-20 lg:mx-auto lg:max-w-[75vw]">
        <div className="grid items-center gap-12 px-4 md:grid-cols-2">
          {/* Text Content */}
          <div className="space-y-6 sm:px-4">
            <div>
              <h3 className="headingstyle font-heading font-extrabold">
                Start small.
                <br /> Think big.{" "}
              </h3>
            </div>

            <div>
              <p className="textstyles mt-4 font-sans text-white/90">
                No numbers. No pressure. Just colours, patterns and a simple challenge. It's exactly
                how Volume 1 introduces Sudoku—and how confidence starts to grow.
              </p>
              <p className="textstyles mt-4 font-sans text-white/90">
                The rules that you need to follow are:
              </p>
              <ol className="mt-3 list-decimal space-y-2 pl-6 text-white/90">
                <li>
                  Each standing line should have all 4 colours appearing <br /> exactly once.
                </li>
                <li>
                  Each sleeping line should have all 4 colours appearing <br /> exactly once.
                </li>
                <li>
                  Each 2×2 grid should have all 4 colours appearing <br /> exactly once.
                </li>
              </ol>
            </div>

            <div>
              <div className="mt-6 flex gap-4">
                <CTAButton
                  text="Watch Demo"
                  onClick={() => setIsOpen(true)}
                  bg="#fbb041"
                  color="#3d3b40"
                  hoverBg="#fa9e15"
                  hoverColor="#3d3b40"
                  showShadow={true}
                  showScaleOnHover={true}
                  showScaleOnActive={true}
                />
              </div>
            </div>
          </div>

          {/* Puzzle Content */}
          <div>
            <div className="rounded-[26px] bg-white p-3 transition-transform duration-500 hover:scale-[1.02]">
              <div className="relative overflow-hidden rounded-[20px] bg-brand-grayBg p-4">
                <SudokuSlider isActive={isActive} />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ---- Modal ---- */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex animate-fade-in items-center justify-center bg-black/70 p-4">
          <div className="animate-scale-in relative w-full max-w-lg rounded-lg bg-white p-4">
            <button
              className="absolute right-3 top-3 text-gray-600 transition-colors duration-200 hover:scale-110 hover:text-black"
              onClick={() => setIsOpen(false)}
            >
              ✕
            </button>
            <img
              src="https://res.cloudinary.com/deunonql5/image/upload/v1758625737/Untitled_design_2_hldysm.gif"
              alt="Logicoland Volume 1 – animated demo showing how to solve the 4×4 color Sudoku puzzle"
              className="w-full rounded-lg"
            />
          </div>
        </div>
      )}
    </section>
  );
}

/* ============================================================
   PRINTABLES SECTION
============================================================ */
function PrintablesSection({ isActive }: { isActive: boolean }) {
  return (
    <section className="w-full overflow-hidden bg-brand-buttonYellowBefore">
      <div className="mx-auto px-3 py-12 sm:px-5 sm:py-16 md:py-20 lg:max-w-[80vw]">
        <div className="rounded-[22px] p-6 sm:p-10">
          {/* Header */}
          <div>
            <h3 className="headingstyle text-center font-extrabold text-brand-black">
              Keep the Curiosity Going
            </h3>
            <p className="textstyles mt-2 text-center text-brand-black">
              Free worksheets filled with puzzles, patterns and playful challenges. For the complete
              collection, join the community.
            </p>
          </div>

          {/* Cards Grid */}
          <div className="mt-10 grid gap-8 md:grid-cols-2">
            <div>
              <PrintableCard
                bgImage="https://ik.imagekit.io/pratik11/logicaoldandpdf1.JPG?updatedAt=1758342080344"
                buttonColor="#7E5C2E"
                filePath="/pdfs/downloadable/LogicolandVolume1Worksheet1.pdf"
                downloadName="Logicoland-Volume1-Worksheet1.pdf"
                overlayClass="bg-black/15"
                isActive={isActive}
              />
            </div>

            <div>
              <PrintableCard
                bgImage="https://ik.imagekit.io/pratik11/logicolandpdf2.JPG?updatedAt=1758342079963"
                buttonColor="#AB4637"
                filePath="/pdfs/downloadable/LogicolandVolume1Worksheet2.pdf"
                downloadName="Logicoland-Volume1-Worksheet2.pdf"
                overlayClass="bg-black/15"
                isActive={isActive}
              />
            </div>
          </div>

          {/* Footer Text */}
          <div>
            <p className="mt-8 text-center text-brand-black">
              For more such printables, join our community.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

const LOGICOLAND_SET: HeroProductConfig = {
  name: "Logicoland Set (All Volumes)",
  price: "₹999",
  initialprice: undefined,
  razorpayItemId: "item_SSxJhDUqb7HTiy",
  description: "Every volume in one box — the complete thinking skills collection.",
  image: "https://ik.imagekit.io/pratik11/LOGICOLAND-HERO-IMAGE.png?updatedAt=1781163914607",
  rating: 5,
  specialOffer: "",
  category: "set",
};

type VolumeProduct = HeroProductConfig & {
  displayName: string;
  volumeNumber: number;
  bundleRazorpayItemId: string;
  bundleImage: string;
};

const VOLUMES: VolumeProduct[] = [
  {
    name: "Logicoland - Volume 1",
    displayName: "Volume 1",
    volumeNumber: 1,
    price: "₹249",
    initialprice: "₹299",
    razorpayItemId: "item_S4UBymXQ91Vmk4",
    bundleRazorpayItemId: "item_RVa7Osutc07pfB",
    description: "Logicoland Volume 1",
    image: "https://ik.imagekit.io/pratik11/VERTICAL%20BOOK%20COVER%20MOCKUP%20VOLUNE%201.png",
    bundleImage: "https://ik.imagekit.io/pratik2002/logicolandv2_4oprmp0lO?updatedAt=1756947338913",
    rating: 5,
    specialOffer: "",
    category: "books",
  },
  {
    name: "Logicoland - Volume 2",
    displayName: "Volume 2",
    volumeNumber: 2,
    price: "₹249",
    initialprice: "₹299",
    razorpayItemId: "item_RNn0h9rGIq8zOL",
    bundleRazorpayItemId: "item_S4UDQe8qCtOp21",
    description: "Logicoland Volume 2",
    image: "https://ik.imagekit.io/pratik11/VERTICAL%20BOOK%20COVER%20MOCKUP%20VOLUNE%202.png",
    bundleImage:
      "https://ik.imagekit.io/pratik2002/VOLUMNE%202/LOGICOLAND%20SUDOKU%20VOLUMNE%202%20STACK%20COVER%20MOCKUP.png?updatedAt=1773906051069",
    rating: 5,
    specialOffer: "",
    category: "books",
  },
  {
    name: "Logicoland - Volume 3",
    displayName: "Volume 3",
    volumeNumber: 3,
    price: "₹249",
    initialprice: "₹299",
    razorpayItemId: "item_SSxGzOM6REipuz",
    bundleRazorpayItemId: "item_ST2GJDox7LUaVH",
    description: "Logicoland Volume 3",
    image: "https://ik.imagekit.io/pratik11/VERTICAL%20BOOK%20COVER%20MOCKUP%20VOLUNE%203.png",
    bundleImage:
      "https://ik.imagekit.io/pratik2002/VOLUMNE%203/LOGICOLAND%20SUDOKU%20VOLUMNE%203%20STACK%20COVER%20MOCKUP.png?updatedAt=1773906081265",
    rating: 5,
    specialOffer: "",
    category: "books",
  },
  {
    name: "Logicoland - Volume 4",
    displayName: "Volume 4",
    volumeNumber: 4,
    price: "₹249",
    initialprice: "₹299",
    razorpayItemId: "item_SSxHO3cngCSldC",
    bundleRazorpayItemId: "item_ST2GnU6n3qjAEc",
    description: "Logicoland Volume 4",
    image: "https://ik.imagekit.io/pratik11/VERTICAL%20BOOK%20COVER%20MOCKUP%20VOLUNE%204.png",
    bundleImage:
      "https://ik.imagekit.io/pratik2002/VOLUMNE%204/LOGICOLAND%20SUDOKU%20VOLUMNE%204%20STACK%20COVER%20MOCKUP.png?updatedAt=1773906115914",
    rating: 5,
    specialOffer: "",
    category: "books",
  },
  {
    name: "Logicoland - Volume 5",
    displayName: "Volume 5",
    volumeNumber: 5,
    price: "₹249",
    initialprice: "₹299",
    razorpayItemId: "item_SSxHltEcqtYsJ1",
    bundleRazorpayItemId: "item_ST2HEofqR6OCm6",
    description: "Logicoland Volume 5",
    image: "https://ik.imagekit.io/pratik11/VERTICAL%20BOOK%20COVER%20MOCKUP%20VOLUNE%205.png",
    bundleImage:
      "https://ik.imagekit.io/pratik2002/VOLUMNE%205/LOGICOLAND%20SUDOKU%20VOLUMNE%205%20STACK%20COVER%20MOCKUP.png?updatedAt=1773906134668",
    rating: 5,
    specialOffer: "",
    category: "books",
  },
];

// ─────────────────────────────────────────────────────────────────
// Palette — mirrors PrimeTimeBuyBlock exactly
// ─────────────────────────────────────────────────────────────────
const GOLD = "#E45C48";
const TAG_COLOR = "#fbb041";
const TEXT_DARK = "#3d3b40";
const BUY_DEFAULT = "#fbb041";
const BUY_HOVER = "#fa9e15";
const CART_DEFAULT = "#E45C48";
const CART_HOVER = "#c94433";

// ─────────────────────────────────────────────────────────────────
// Shared button CSS
// ─────────────────────────────────────────────────────────────────
const llbStyles = `
  .llb-buy-btn {
    background-color: ${BUY_DEFAULT};
    color: ${TEXT_DARK};
    border: 2px solid transparent;
    transition: all 0.3s ease, transform 0.15s ease;
    box-shadow: 0 4px 16px rgba(251,176,65,0.35);
  }
  .llb-buy-btn:hover {
    background-color: ${BUY_HOVER};
    transform: scale(1.05);
    box-shadow: 0 6px 20px rgba(250,158,21,0.4);
  }
  .llb-buy-btn:active { transform: scale(0.95); }
 
  .llb-cart-btn {
    background-color: ${CART_DEFAULT};
    color: #fff;
    border: 2px solid transparent;
    transition: all 0.3s ease, transform 0.15s ease;
    box-shadow: 0 4px 16px rgba(228,92,72,0.30);
  }
  .llb-cart-btn:hover {
    background-color: ${CART_HOVER};
    transform: scale(1.05);
    box-shadow: 0 6px 20px rgba(201,68,51,0.38);
  }
  .llb-cart-btn:active { transform: scale(0.95); }
  .llb-cart-btn--added {
    background-color: ${CART_HOVER} !important;
    color: #fff !important;
  }
 
  .llb-bundle-btn {
    background-color: transparent;
    color: #0A8A80;
    border: 2px solid #0A8A80;
    transition: all 0.3s ease, transform 0.15s ease;
  }
  .llb-bundle-btn:hover {
    background-color: #0A8A80;
    color: #fff;
    transform: scale(1.03);
  }
  .llb-bundle-btn:active { transform: scale(0.97); }

  /* Swiper navigation arrows */
  .llb-swiper .swiper-button-next,
  .llb-swiper .swiper-button-prev {
    color: #3d3b40;
    background: #fbb041;
    backdrop-filter: blur(4px);
    width: 40px;
    height: 40px;
    border-radius: 50%;
    box-shadow: 0 2px 8px rgba(0,0,0,0.12);
  }

  .llb-swiper .swiper-button-next::after,
  .llb-swiper .swiper-button-prev::after {
    font-size: 14px;
    font-weight: 800;
  }

  .llb-swiper .swiper-button-next:hover,
  .llb-swiper .swiper-button-prev:hover {
    background: #fa9e15;
    box-shadow: 0 4px 16px rgba(0,0,0,0.18);
  }
    .llb-swiper .swiper-pagination {
    display: none;
  }
`;

// ─────────────────────────────────────────────────────────────────
// Volume Card
// ─────────────────────────────────────────────────────────────────
function VolumeCard({
  volume,
  index,
  onBuyNow,
  onBuyBundle,
}: {
  volume: VolumeProduct;
  index: number;
  onBuyNow: (p: HeroProductConfig) => void;
  onBuyBundle: (p: HeroProductConfig) => void;
}) {
  const { addToCart } = useCart();
  const [addedToCart, setAddedToCart] = useState(false);
  const [showBundle, setShowBundle] = useState(false);

  function handleAddToCart() {
    addToCart({
      name: volume.name,
      price: volume.price,
      initialprice: volume.initialprice,
      razorpayItemId: volume.razorpayItemId,
      description: volume.description,
      image: volume.image,
      rating: volume.rating ?? 5,
    });
    toast.success(`${volume.displayName} added to cart!`);
    setAddedToCart(true);
    setTimeout(() => setAddedToCart(false), 2000);
  }

  const bundleProduct: HeroProductConfig = {
    name: `Logicoland Volume ${volume.volumeNumber} Bundle - 20 Books`,
    price: "₹4,000",
    initialprice: undefined,
    razorpayItemId: volume.bundleRazorpayItemId,
    description: `Perfect return gift — 20 copies of Volume ${volume.volumeNumber} for just ₹4,000 (₹200/copy).`,
    image: volume.bundleImage,
    rating: 5,
    specialOffer: "",
    category: "bundles",
  };

  return (
    <motion.div
      className="group relative flex w-full flex-col overflow-hidden rounded-[32px] bg-white"
      style={{
        boxShadow: "0 2px 16px 0 rgba(11,63,68,0.08), 0 1px 3px 0 rgba(11,63,68,0.06)",
      }}
      initial={{ opacity: 0, y: 48 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.55, delay: index * 0.08, ease: [0.22, 1, 0.36, 1] }}
      whileHover={{
        y: -6,
        boxShadow: "0 20px 48px 0 rgba(11,63,68,0.18), 0 4px 12px 0 rgba(11,63,68,0.10)",
        transition: { duration: 0.25, ease: "easeOut" },
      }}
    >
      {/* Volume number badge */}

      {/* ── IMAGE ZONE ── */}
      <div
        className="relative overflow-hidden"
        style={{
          height: 260,
          border: "16px solid #e0e0e3",
          borderTopLeftRadius: "32px",
          borderTopRightRadius: "32px",
        }}
      >
        <img
          src={showBundle ? volume.bundleImage : volume.image}
          alt={volume.displayName}
          className="h-full w-full object-cover transition-all duration-700 group-hover:scale-[1.06]"
        />
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            background: "linear-gradient(to bottom, transparent 45%, rgba(255,255,255,0.18) 100%)",
          }}
        />
        {/* Tag pill */}
        <div
          className="absolute left-4 top-4 z-10 flex items-center rounded-full px-3.5 py-1.5 text-[11px] font-extrabold uppercase tracking-[0.08em] text-[#3d3b40] shadow-lg"
          style={{ backgroundColor: TAG_COLOR }}
        >
          {showBundle ? "Bundle ×20" : `Vol. ${volume.volumeNumber}`}
        </div>
      </div>

      {/* ── CONTENT ZONE ── */}
      <div className="flex flex-1 flex-col px-5 pb-5 pt-4">
        <h3
          className="font-heading text-[18px] font-extrabold leading-tight tracking-tight"
          style={{ color: TEXT_DARK }}
        >
          {volume.displayName}
        </h3>

        <p
          className="mt-1.5 line-clamp-2 font-sans text-[13.5px] leading-relaxed"
          style={{ color: TEXT_DARK, opacity: 0.65 }}
        >
          {volume.description}
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

        {/* Price + Bundle toggle */}
        <div className="mt-4 flex items-baseline justify-between gap-2">
          <div className="flex items-baseline gap-2">
            <span
              className="font-heading text-[26px] font-extrabold leading-none tracking-tight"
              style={{ color: TEXT_DARK }}
            >
              {showBundle ? "₹4,000" : volume.price}
            </span>
            {!showBundle && volume.initialprice && (
              <span
                className="font-sans text-sm line-through"
                style={{ color: TEXT_DARK, opacity: 0.35 }}
              >
                {volume.initialprice}
              </span>
            )}
            {showBundle && (
              <span className="font-sans text-[11px]" style={{ color: TEXT_DARK, opacity: 0.5 }}>
                / 20 books
              </span>
            )}
          </div>

          {/* Single / Bundle toggle */}
          <button
            onClick={() => setShowBundle((s) => !s)}
            className="rounded-full px-2.5 py-1 font-sans text-[10px] font-bold uppercase tracking-wide transition-all"
            style={{
              backgroundColor: showBundle ? "rgba(10,138,128,0.12)" : "rgba(251,176,65,0.18)",
              color: showBundle ? "#0A8A80" : "#7a5c00",
              border: showBundle
                ? "1px solid rgba(10,138,128,0.3)"
                : "1px solid rgba(251,176,65,0.4)",
            }}
          >
            {showBundle ? "→ Single" : "Bundle ×20"}
          </button>
        </div>

        <div className="min-h-[12px] flex-1" />

        {/* ── BUTTONS ── */}
        <div className="mt-4 flex flex-col gap-2.5">
          <button
            onClick={() => (showBundle ? onBuyBundle(bundleProduct) : onBuyNow(volume))}
            className="llb-buy-btn relative flex w-full items-center justify-center rounded-full py-3 text-[14px] font-extrabold"
          >
            <span className="relative flex items-center gap-2">
              {showBundle ? "Buy Bundle" : "Buy Now"}
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

          {showBundle ? (
            <button
              onClick={() => alert("Enquiry submitted! We'll contact you shortly.")}
              className="llb-cart-btn flex w-full items-center justify-center gap-2 rounded-full py-3 text-[14px] font-extrabold"
            >
              Enquire for Big Deals
            </button>
          ) : (
            <button
              onClick={handleAddToCart}
              className={`llb-cart-btn flex w-full items-center justify-center gap-2 rounded-full py-3 text-[14px] font-extrabold ${addedToCart ? "llb-cart-btn--added" : ""}`}
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
          )}
        </div>
      </div>
    </motion.div>
  );
}

// ─────────────────────────────────────────────────────────────────
// LogicolandBuyBlock — main section
// ─────────────────────────────────────────────────────────────────
export function LogicolandBuyBlock() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });
  const { addToCart } = useCart();

  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [checkoutProduct, setCheckoutProduct] = useState<HeroProductConfig>(LOGICOLAND_SET);
  const [addedToCart, setAddedToCart] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  function handleBuyNow(p: HeroProductConfig = LOGICOLAND_SET) {
    setCheckoutProduct(p);
    setIsCheckoutOpen(true);
  }

  function handleAddToCart() {
    addToCart({
      name: LOGICOLAND_SET.name,
      price: LOGICOLAND_SET.price,
      initialprice: LOGICOLAND_SET.initialprice,
      razorpayItemId: LOGICOLAND_SET.razorpayItemId,
      description: LOGICOLAND_SET.description,
      image: LOGICOLAND_SET.image,
      rating: LOGICOLAND_SET.rating ?? 5,
    });
    toast.success("Logicoland Complete Set added to cart!");
    if (typeof window !== "undefined" && (window as any).fbq) {
      (window as any).fbq("track", "AddToCart", {
        content_name: LOGICOLAND_SET.name,
        value: 999,
        currency: "INR",
      });
    }
    setAddedToCart(true);
    setTimeout(() => setAddedToCart(false), 2000);
  }

  return (
    <>
      <style>{llbStyles}</style>

      <section id="buy" ref={ref} className="relative w-full overflow-hidden bg-brand-tealDark">
        <div className="relative px-4 py-20 md:mx-auto md:max-w-[82vw] lg:mx-auto lg:max-w-[82vw] lg:px-8">
          {/* ── Hero buy card — Complete Set ── */}
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
                src={LOGICOLAND_SET.image}
                alt="Logicoland Complete Set"
                className="h-full w-full object-contain"
                style={{
                  borderTopLeftRadius: "14px",
                  borderBottomLeftRadius: "14px",
                }}
              />
            </motion.div>

            {/* RIGHT — Text + CTAs */}
            <div className="flex flex-1 flex-col p-8 sm:p-12">
              <motion.p
                initial={{ opacity: 0, y: 16 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="mb-2 font-sans text-xs font-bold uppercase tracking-[0.2em]"
                style={{ color: TEXT_DARK }}
              >
                Best Value · Complete Series
              </motion.p>

              <motion.h2
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: 0.25 }}
                className="headingstyle font-heading font-extrabold leading-tight"
                style={{ color: TEXT_DARK }}
              >
                Logicoland — All 5 Volumes
              </motion.h2>

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
                  4.8 · 150 reviews
                </span>
              </motion.div>

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
                  ₹999
                </span>
                <span
                  className="rounded-full px-2.5 py-1 font-sans text-[11px] font-bold uppercase tracking-wide"
                  style={{ backgroundColor: TAG_COLOR, color: TEXT_DARK }}
                >
                  Best Value
                </span>
              </motion.div>

              <motion.p
                initial={{ opacity: 0 }}
                animate={isInView ? { opacity: 1 } : {}}
                transition={{ duration: 0.5, delay: 0.4 }}
                className="mt-1 font-sans text-xs"
                style={{ color: TEXT_DARK, opacity: 0.4 }}
              >
                All prices include GST &nbsp;·&nbsp; Detailed invoice sent after purchase
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.55, delay: 0.45 }}
                className="mt-6 flex flex-wrap gap-3"
              >
                <button
                  onClick={() => handleBuyNow()}
                  className="llb-buy-btn relative flex items-center justify-center overflow-hidden rounded-full px-8 py-3.5 text-[15px] font-extrabold"
                >
                  <span className="relative flex items-center gap-2">
                    Buy Now — ₹999
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
                  className={`llb-cart-btn flex items-center gap-2 rounded-full px-8 py-3.5 text-[15px] font-extrabold ${addedToCart ? "llb-cart-btn--added" : ""}`}
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

              <motion.div
                initial={{ opacity: 0 }}
                animate={isInView ? { opacity: 1 } : {}}
                transition={{ duration: 0.5, delay: 0.55 }}
                className="mt-5 flex flex-wrap gap-2"
              >
                {[
                  { text: "All 5 volumes included" },
                  { text: "Ages 5–16" },
                  { text: "Logic & critical thinking" },
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

          {/* ── Individual Volumes heading ── */}
          <motion.div
            className="mb-8 text-center"
            initial={{ opacity: 0, y: 24 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 24 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <p className="mb-3 font-sans text-[25px] font-bold uppercase tracking-[0.2em] text-white">
              Or pick a volume
            </p>
            <h3 className="headingstyle font-heading font-extrabold text-white">
              Individual Volumes · ₹249 each
            </h3>
            <p className="mt-2 font-sans text-sm text-white/50">
              Each card has a <strong className="text-white/70">Bundle ×20</strong> toggle — flip it
              to order 20 copies at ₹4,000 (₹200/copy), perfect for classrooms and return gifts.
            </p>
          </motion.div>

          {/* ── Volume cards — Swiper with external nav buttons ── */}
          <div className="relative px-8">
            {/* Prev Button */}
            <button
              className="llb-swiper-prev absolute -left-4 top-1/2 z-10 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-brand-buttonYellowBefore shadow-lg transition hover:scale-110 hover:bg-brand-buttonYellowAfter hover:shadow-xl disabled:opacity-30"
              style={{ color: TEXT_DARK }}
            >
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2.5}
                  d="M15 19l-7-7 7-7"
                />
              </svg>
            </button>

            <Swiper
              modules={[Navigation, Pagination]}
              navigation={{
                prevEl: ".llb-swiper-prev",
                nextEl: ".llb-swiper-next",
              }}
              pagination={{ clickable: true }}
              spaceBetween={20}
              slidesPerView={1}
              breakpoints={{
                480: { slidesPerView: 2, spaceBetween: 16 },
                768: { slidesPerView: 3, spaceBetween: 20 },
                1024: { slidesPerView: 4, spaceBetween: 20 },
              }}
              className="llb-swiper w-full pb-10"
            >
              {VOLUMES.map((volume, i) => (
                <SwiperSlide key={volume.razorpayItemId} className="!h-auto py-2">
                  <VolumeCard
                    volume={volume}
                    index={i}
                    onBuyNow={handleBuyNow}
                    onBuyBundle={handleBuyNow}
                  />
                </SwiperSlide>
              ))}
            </Swiper>

            {/* Next Button */}
            <button
              className="llb-swiper-next absolute -right-4 top-1/2 z-10 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-brand-buttonYellowBefore shadow-lg transition hover:scale-110 hover:bg-brand-buttonYellowAfter hover:shadow-xl disabled:opacity-30"
              style={{ color: TEXT_DARK }}
            >
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2.5}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </button>
          </div>

          {/* ── Footer note ── */}
          <motion.p
            className="mt-12 text-center font-sans text-xs text-white/35"
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : { opacity: 0 }}
            transition={{ delay: 0.8, duration: 0.5 }}
          >
            All prices include GST &nbsp;·&nbsp; Free shipping on orders above ₹499 &nbsp;·&nbsp;
            Bulk pricing available on request
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

function SymmetryPatternGame() {
  const sectionRef = useRef(null);

  const gridSize = 6;
  const BLANK_CELL_COLOR = "#f5deb3";

  const colors = ["#e74c3c", "#f1c40f", "#2ecc71", "#3498db", "#9b59b6", "#ff8c00"];

  const [selectedColor, setSelectedColor] = useState(colors[0]);
  const [isSymmetric, setIsSymmetric] = useState(false);
  const [draggedColor, setDraggedColor] = useState<string | null>(null);

  const solutionGrid = [
    ["#e74c3c", "#f1c40f", "#2ecc71", "#2ecc71", "#f1c40f", "#e74c3c"],
    ["#f1c40f", "#3498db", "#9b59b6", "#9b59b6", "#3498db", "#f1c40f"],
    ["#2ecc71", "#9b59b6", "#ff8c00", "#ff8c00", "#9b59b6", "#2ecc71"],
    ["#2ecc71", "#9b59b6", "#ff8c00", "#ff8c00", "#9b59b6", "#2ecc71"],
    ["#f1c40f", "#3498db", "#9b59b6", "#9b59b6", "#3498db", "#f1c40f"],
    ["#e74c3c", "#f1c40f", "#2ecc71", "#2ecc71", "#f1c40f", "#e74c3c"],
  ];

  const initialGrid = [
    [BLANK_CELL_COLOR, BLANK_CELL_COLOR, BLANK_CELL_COLOR, BLANK_CELL_COLOR, "#f1c40f", "#e74c3c"],
    ["#f1c40f", "#3498db", "#9b59b6", "#9b59b6", BLANK_CELL_COLOR, BLANK_CELL_COLOR],
    [BLANK_CELL_COLOR, "#9b59b6", "#ff8c00", BLANK_CELL_COLOR, BLANK_CELL_COLOR, "#2ecc71"],
    ["#2ecc71", BLANK_CELL_COLOR, BLANK_CELL_COLOR, BLANK_CELL_COLOR, "#9b59b6", BLANK_CELL_COLOR],
    [
      "#f1c40f",
      BLANK_CELL_COLOR,
      BLANK_CELL_COLOR,
      BLANK_CELL_COLOR,
      BLANK_CELL_COLOR,
      BLANK_CELL_COLOR,
    ],
    [BLANK_CELL_COLOR, "#f1c40f", "#2ecc71", "#2ecc71", BLANK_CELL_COLOR, BLANK_CELL_COLOR],
  ];

  const [grid, setGrid] = useState(initialGrid);

  const isBlankCell = (row: number, col: number) => grid[row][col] === BLANK_CELL_COLOR;
  const isColorCell = (row: number, col: number) => !isBlankCell(row, col);

  const checkSolution = (currentGrid: string[][]) => {
    for (let i = 0; i < gridSize; i++)
      for (let j = 0; j < gridSize; j++) if (currentGrid[i][j] !== solutionGrid[i][j]) return false;
    return true;
  };

  const handleDragStart = (row: number, col: number, e: React.DragEvent) => {
    if (!isColorCell(row, col)) return;
    e.dataTransfer.setData("text/plain", JSON.stringify({ row, col, color: grid[row][col] }));
    e.dataTransfer.effectAllowed = "copy";
    setDraggedColor(grid[row][col]);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "copy";
  };

  const handleDrop = (row: number, col: number, e: React.DragEvent) => {
    e.preventDefault();
    if (!isBlankCell(row, col)) return;
    try {
      const data = JSON.parse(e.dataTransfer.getData("text/plain"));
      const newGrid = grid.map((r) => [...r]);
      newGrid[row][col] = data.color;
      setGrid(newGrid);
      setIsSymmetric(checkSolution(newGrid));
    } catch (error) {
      console.error("Drop error:", error);
    }
    setDraggedColor(null);
  };

  const handleCellClick = (row: number, col: number) => {
    if (!isBlankCell(row, col)) return;
    const newGrid = grid.map((r) => [...r]);
    newGrid[row][col] = selectedColor;
    setGrid(newGrid);
    setIsSymmetric(checkSolution(newGrid));
  };

  const handleReset = () => {
    setGrid(initialGrid);
    setIsSymmetric(false);
  };

  return (
    <section ref={sectionRef} className="w-full overflow-hidden bg-brand-grayBg">
      <div className="mx-auto px-3 py-12 sm:px-5 sm:py-16 md:max-w-[75vw] md:py-20 lg:mx-auto lg:max-w-[75vw]">
        <div className="grid items-center gap-12 md:grid-cols-2">
          {/* ── LEFT: Text Content ── */}
          <div className="space-y-6 sm:px-4">
            <h3 className="headingstyle font-heading font-extrabold text-brand-teal">
              Complete the Symmetric Pattern
            </h3>

            <div>
              <p className="textstyles mt-4 font-sans text-brand-tealDark/80">
                Fill in the blank cells to complete the perfectly symmetric colour pattern. The
                rules you need to follow are:
              </p>
              <ol className="mt-3 list-decimal space-y-2 pl-6 text-brand-tealDark/90">
                <li>The pattern must be symmetric along the vertical axis (left ↔ right).</li>
                <li>The pattern must be symmetric along the horizontal axis (top ↔ bottom).</li>
                <li>
                  Drag a colour from any filled cell onto a blank cell — or pick from the palette
                  and click.
                </li>
              </ol>
            </div>

            <div className="space-y-4">
              {/* Colour palette */}
              <div className="flex flex-wrap items-center gap-3">
                {colors.map((color, index) => (
                  <button
                    key={color}
                    onClick={() => setSelectedColor(color)}
                    className={`h-10 w-10 cursor-pointer rounded-full shadow outline-offset-2 ring-2 ring-white/40 transition-all duration-300 hover:scale-110 ${
                      selectedColor === color ? "scale-110 outline outline-2 outline-white" : ""
                    }`}
                    style={{ backgroundColor: color }}
                    aria-pressed={selectedColor === color}
                    aria-label={`Select color ${index + 1}`}
                  />
                ))}
              </div>

              {/* <p className="text-sm text-white/70">
                Selected:{" "}
                <span
                  className="inline-block h-3 w-3 rounded-full align-middle"
                  style={{ backgroundColor: selectedColor }}
                />{" "}
                <span className="font-semibold" style={{ color: selectedColor }}>
                  {selectedColor}
                </span>
              </p> */}

              <div className="flex gap-4">
                <button
                  onClick={handleReset}
                  className="group inline-flex max-w-[220px] items-center justify-center gap-2 rounded-full border-2 border-brand-teal bg-transparent px-6 py-3 text-[16px] font-semibold text-brand-teal transition-colors hover:bg-brand-teal hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-coral/40 active:scale-[.99]"
                >
                  Reset Pattern
                </button>
              </div>
            </div>

            <p className="text-sm text-brand-tealDark/80">
              Blank cells remaining:{" "}
              <span className="font-semibold text-brand-tealDark">
                {grid.flat().filter((c) => c === BLANK_CELL_COLOR).length}
              </span>
            </p>
          </div>

          {/* ── RIGHT: Game Grid ── */}
          <div className="rounded-[26px] bg-white p-3 transition-transform duration-500 hover:scale-[1.02]">
            <div className="relative overflow-hidden rounded-[20px] bg-brand-grayBg p-4">
              <div className="w-full">
                <div className="grid w-full touch-manipulation select-none grid-cols-6 gap-0 overflow-hidden rounded-lg">
                  {grid.map((row, i) =>
                    row.map((cell, j) => {
                      const isDraggable = isColorCell(i, j);
                      const isEditable = isBlankCell(i, j);

                      const getBorderClass = () => {
                        let classes: string[] = [];
                        if (i === 0) classes.push("border-t border-black/30");
                        if (i === gridSize - 1) classes.push("border-b border-black/30");
                        if (j === 0) classes.push("border-l border-black/30");
                        if (j === gridSize - 1) classes.push("border-r border-black/30");
                        if (i < gridSize - 1) classes.push("border-b border-black/30");
                        if (j < gridSize - 1) classes.push("border-r border-black/30");
                        if (i === 2) classes.push("border-b-2 border-black/40");
                        if (j === 2) classes.push("border-r-2 border-black/40");
                        return classes.join(" ");
                      };

                      return (
                        <div
                          key={`${i}-${j}`}
                          draggable={isDraggable}
                          onDragStart={(e) => handleDragStart(i, j, e)}
                          onDragOver={isEditable ? handleDragOver : undefined}
                          onDrop={isEditable ? (e) => handleDrop(i, j, e) : undefined}
                          onClick={() => handleCellClick(i, j)}
                          style={{ backgroundColor: cell }}
                          className={`relative flex aspect-square w-full items-center justify-center transition-all duration-300 ${getBorderClass()} ${
                            isEditable
                              ? "cursor-pointer hover:brightness-95"
                              : isDraggable
                                ? "cursor-grab hover:opacity-90 active:cursor-grabbing"
                                : "cursor-default"
                          }`}
                          role="button"
                          aria-label={
                            isEditable
                              ? `Row ${i + 1} col ${j + 1} - empty`
                              : `Row ${i + 1} col ${j + 1} - ${cell}`
                          }
                        >
                          {cell === BLANK_CELL_COLOR && (
                            <span className="text-[10px] text-gray-500 opacity-60">+</span>
                          )}
                        </div>
                      );
                    })
                  )}
                </div>
              </div>

              {isSymmetric && (
                <div className="mt-4 rounded-xl bg-[#4CAF50] px-4 py-3 text-center text-sm font-semibold text-white">
                  🎉 Perfect symmetry! Well done!
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
/* ============================================================
   COLOR SUDOKU (4×4) – constants and types
============================================================ */
type ColorKey = "R" | "G" | "B" | "Y";
type Cell = { value: ColorKey | null; locked?: boolean };

const COLOR_META: Record<ColorKey, { label: string; class: string; hex: string }> = {
  R: { label: "Red", class: "bg-[#E45C48]", hex: "#E45C48" },
  G: { label: "Green", class: "bg-[#4CAF50]", hex: "#4CAF50" },
  B: { label: "Blue", class: "bg-[#4C8BD9]", hex: "#4C8BD9" },
  Y: { label: "Yellow", class: "bg-[#DDB24D]", hex: "#DDB24D" },
};

/* ============================================================
   MULTI-PUZZLE SLIDER (3 games)
============================================================ */
type Puzzle = {
  name: string;
  start: (ColorKey | null)[][];
  solution: ColorKey[][];
};

const SOL1: ColorKey[][] = [
  ["Y", "R", "G", "B"],
  ["B", "G", "R", "Y"],
  ["R", "Y", "B", "G"],
  ["G", "B", "Y", "R"],
];

const SOL2: ColorKey[][] = [
  ["B", "R", "Y", "G"],
  ["G", "Y", "B", "R"],
  ["Y", "G", "R", "B"],
  ["R", "B", "G", "Y"],
];

const SOL3: ColorKey[][] = [
  ["B", "G", "Y", "R"],
  ["R", "Y", "G", "B"],
  ["G", "B", "R", "Y"],
  ["Y", "R", "B", "G"],
];

const PUZZLES: Puzzle[] = [
  {
    name: "Puzzle 1",
    start: [
      ["Y", "R", null, null],
      [null, null, null, null],
      [null, "Y", "B", null],
      ["G", null, null, "R"],
    ],
    solution: SOL1,
  },
  {
    name: "Puzzle 2",
    start: [
      ["B", null, null, "G"],
      [null, "Y", "B", null],
      [null, "G", null, null],
      ["R", null, null, null],
    ],
    solution: SOL2,
  },
  {
    name: "Puzzle 3",
    start: [
      [null, null, "Y", null],
      ["R", null, "G", null],
      [null, "B", null, "Y"],
      [null, "R", null, null],
    ],
    solution: SOL3,
  },
];

function SudokuSlider({ isActive }: { isActive: boolean }) {
  const [idx, setIdx] = useState(0);
  const [direction, setDirection] = useState<"left" | "right">("right");
  const total = PUZZLES.length;

  const next = () => {
    setDirection("right");
    setIdx((i) => (i + 1) % total);
  };

  const prev = () => {
    setDirection("left");
    setIdx((i) => (i - 1 + total) % total);
  };

  return (
    <div className="w-full">
      <div className="mb-3 flex items-center justify-between">
        <div className="font-semibold text-brand-tealDark">{PUZZLES[idx].name}</div>
        <div className="flex items-center gap-2">
          <button
            onClick={prev}
            className="rounded-full bg-white px-3 py-1.5 text-brand-tealDark ring-1 ring-black/10 transition-all duration-300 hover:scale-110 hover:bg-white/90 active:scale-95"
          >
            ◀
          </button>
          <button
            onClick={next}
            className="rounded-full bg-white px-3 py-1.5 text-brand-tealDark ring-1 ring-black/10 transition-all duration-300 hover:scale-110 hover:bg-white/90 active:scale-95"
          >
            ▶
          </button>
        </div>
      </div>

      <div
        className={`transition-all duration-500 ${
          direction === "right" ? "animate-slide-in-right" : "animate-slide-in-left"
        }`}
      >
        <ColorSudoku
          key={idx}
          start={PUZZLES[idx].start}
          solution={PUZZLES[idx].solution}
          isActive={isActive}
        />
      </div>

      <div className="mt-3 flex justify-center gap-2">
        {PUZZLES.map((_, i) => (
          <button
            key={i}
            aria-label={`Go to puzzle ${i + 1}`}
            onClick={() => setIdx(i)}
            className={`h-2.5 w-2.5 rounded-full transition-all duration-300 ${
              i === idx ? "scale-125 bg-brand-tealDark" : "bg-black/20 hover:bg-black/40"
            }`}
          />
        ))}
      </div>
    </div>
  );
}

/* ============================================================
   Grid border helper (THICK 2×2 sub-grids + outer frame)
============================================================ */
function cellBorders(r: number, c: number) {
  const top = r === 0 ? "border-t-4" : r === 2 ? "border-t-4" : "border-t";
  const bottom = r === 3 ? "border-b-4" : "border-b";
  const left = c === 0 ? "border-l-4" : c === 2 ? "border-l-4" : "border-l";
  const right = c === 3 ? "border-r-4" : "border-r";
  return `${top} ${right} ${bottom} ${left} border-black/30`;
}

/* ============================================================
   COLOR SUDOKU component
============================================================ */
function ColorSudoku({
  start,
  solution,
  isActive,
}: {
  start: (ColorKey | null)[][];
  solution: ColorKey[][];
  isActive: boolean;
}) {
  const [grid, setGrid] = useState<Cell[][]>(() =>
    start.map((row) => row.map((v) => ({ value: v, locked: v !== null })))
  );
  const [selectedColor, setSelectedColor] = useState<ColorKey | null>(null);
  const [showMistakes, setShowMistakes] = useState(true);
  const [won, setWon] = useState(false);

  const conflicts = useMemo(() => computeConflicts(grid), [grid]);

  useEffect(() => {
    const allFilled = grid.every((r) => r.every((c) => c.value !== null));
    const hasConflict = Object.values(conflicts).some(Boolean);
    setWon(allFilled && !hasConflict);
  }, [grid, conflicts]);

  function onDropCell(r: number, c: number, color: ColorKey | null) {
    setGrid((old) =>
      old.map((row, ri) =>
        row.map((cell, ci) => {
          if (ri !== r || ci !== c) return cell;
          if (cell.locked) return cell;
          return { ...cell, value: color };
        })
      )
    );
  }

  function handleDragStart(e: React.DragEvent, k: ColorKey) {
    e.dataTransfer.setData("text/color", k);
    e.dataTransfer.setData("text/plain", k);
  }

  function handleCellDrop(e: React.DragEvent, r: number, c: number) {
    e.preventDefault();
    const data = (e.dataTransfer.getData("text/color") || e.dataTransfer.getData("text/plain")) as
      | ColorKey
      | "";
    if (!data) return;
    if (!["R", "G", "B", "Y"].includes(data)) return;
    onDropCell(r, c, data as ColorKey);
  }

  function handleCellClick(r: number, c: number) {
    setGrid((old) =>
      old.map((row, ri) =>
        row.map((cell, ci) => {
          if (ri !== r || ci !== c) return cell;
          if (cell.locked) return cell;
          if (selectedColor) return { ...cell, value: selectedColor };
          return { ...cell, value: null };
        })
      )
    );
  }

  function reset() {
    setGrid(start.map((row) => row.map((v) => ({ value: v, locked: v !== null }))));
    setSelectedColor(null);
    setShowMistakes(true);
    setWon(false);
  }

  function fillComplete() {
    setGrid(
      solution.map((row, r) =>
        row.map((color, c) => ({
          value: color,
          locked: start[r][c] !== null,
        }))
      )
    );
  }

  return (
    <div className="mx-auto w-full max-w-[min(92vw,520px)]">
      {/* palette */}
      <div className="mb-4 flex flex-wrap items-center gap-3">
        {(["R", "G", "B", "Y"] as ColorKey[]).map((k, index) => {
          const active = selectedColor === k;
          return (
            <button
              key={k}
              draggable
              onDragStart={(e) => handleDragStart(e, k)}
              onClick={() => setSelectedColor((prev) => (prev === k ? null : k))}
              className={`h-8 w-8 rounded-full shadow ring-2 ring-white sm:h-10 sm:w-10 ${
                COLOR_META[k].class
              } cursor-grab outline-offset-2 transition-all duration-300 hover:scale-110 active:cursor-grabbing ${
                active ? "scale-110 outline outline-2 outline-black/70" : ""
              }`}
              style={{
                transitionDelay: isActive ? `${index * 100}ms` : "0ms",
                transform: isActive ? "scale(1)" : "scale(0)",
                opacity: isActive ? 1 : 0,
              }}
              title={`Drag or tap ${COLOR_META[k].label}`}
              aria-pressed={active}
              aria-label={`Select ${COLOR_META[k].label}`}
            />
          );
        })}

        <div
          className="ml-auto flex gap-2 transition-all delay-700 duration-500"
          style={{
            transform: isActive ? "translateX(0)" : "translateX(50px)",
            opacity: isActive ? 1 : 0,
          }}
        >
          <button
            onClick={() => setShowMistakes((s) => !s)}
            className="rounded-full bg-black/70 px-3 py-1 text-xs text-white transition-all duration-300 hover:scale-105 active:scale-95"
          >
            {showMistakes ? "Hide Mistakes" : "Show Mistakes"}
          </button>
          <button
            onClick={fillComplete}
            className="rounded-full bg-white px-3 py-1 text-xs text-brand-tealDark transition-all duration-300 hover:scale-105 active:scale-95"
          >
            Fill Complete
          </button>
          <button
            onClick={reset}
            className="rounded-full bg-black/70 px-3 py-1 text-xs text-white transition-all duration-300 hover:scale-105 active:scale-95"
          >
            Reset
          </button>
        </div>
      </div>

      {/* board */}
      <div
        className="grid w-full touch-manipulation select-none grid-cols-4 gap-0 overflow-hidden rounded-[20px] bg-white ring-1 ring-black/10 transition-all delay-300 duration-500"
        style={{
          transform: isActive ? "scale(1)" : "scale(0.9)",
          opacity: isActive ? 1 : 0,
        }}
      >
        {grid.map((row, r) =>
          row.map((cell, c) => {
            const key = `${r}-${c}`;
            const hasConflict = showMistakes && conflicts[key];

            return (
              <div
                key={key}
                onDragOver={(e) => e.preventDefault()}
                onDrop={(e) => handleCellDrop(e, r, c)}
                onClick={() => handleCellClick(r, c)}
                className={`relative aspect-square w-full ${cellBorders(
                  r,
                  c
                )} flex items-center justify-center transition-all duration-300 ${
                  cell.locked ? "cursor-not-allowed" : "cursor-pointer hover:brightness-95"
                } ${
                  cell.value
                    ? COLOR_META[cell.value].class
                    : cell.locked
                      ? "bg-brand-grayBg/50"
                      : "bg-white"
                }`}
                role="button"
                aria-label={`Row ${r + 1} column ${c + 1}${
                  cell.value ? ` ${COLOR_META[cell.value].label}` : " empty"
                }`}
                title={cell.locked ? "Locked cell" : "Click to place/clear or drop a color"}
              >
                {cell.value && (
                  <span
                    className={`h-3/5 w-3/5 rounded-xl shadow-inner transition-all duration-300 ${
                      COLOR_META[cell.value].class
                    }`}
                  />
                )}

                {!cell.value && !cell.locked && (
                  <span className="text-[10px] text-black/40 transition-all duration-300 sm:text-xs">
                    Drop / Tap
                  </span>
                )}

                {cell.locked && (
                  <span className="absolute right-1 top-1 rounded bg-black/10 px-1.5 py-0.5 text-[10px] text-black/60">
                    •
                  </span>
                )}

                {/* conflict highlight */}
                {hasConflict && (
                  <span className="pointer-events-none absolute inset-0 border-4 border-black bg-black/35 transition-all duration-300" />
                )}
              </div>
            );
          })
        )}
      </div>

      {won && (
        <div
          className="mt-4 rounded-xl bg-[#DDB24D] px-4 py-3 text-center font-semibold text-white transition-all delay-500 duration-500"
          style={{
            transform: isActive ? "scale(1)" : "scale(0)",
            opacity: isActive ? 1 : 0,
          }}
        >
          🎉 Great job! You solved it.
        </div>
      )}

      <p
        className="mt-3 text-xs text-black/50 transition-all delay-700 duration-500"
        style={{
          transform: isActive ? "translateY(0)" : "translateY(20px)",
          opacity: isActive ? 1 : 0,
        }}
      >
        Rule: Fill the 4×4 grid so that each row, column, and 2×2 box contains all four colors
        exactly once. Drag a color from the palette or tap a color, then tap a cell to place it.{" "}
        {showMistakes && "Conflicts are highlighted with a black ring and dark overlay."}
      </p>
    </div>
  );
}

/* ============================================================
   Conflict detection
============================================================ */
function computeConflicts(grid: Cell[][]): Record<string, boolean> {
  const size = 4;
  const box = 2;
  const conflicts: Record<string, boolean> = {};

  for (let r = 0; r < size; r++) {
    for (let c = 0; c < size; c++) {
      conflicts[`${r}-${c}`] = false;
    }
  }

  // rows
  for (let r = 0; r < size; r++) {
    const seen = new Map<ColorKey, number[]>();
    for (let c = 0; c < size; c++) {
      const v = grid[r][c].value;
      if (v) {
        const arr = seen.get(v) || [];
        arr.push(c);
        seen.set(v, arr);
      }
    }
    seen.forEach((cols) => {
      if (cols.length > 1) cols.forEach((cc) => (conflicts[`${r}-${cc}`] = true));
    });
  }

  // cols
  for (let c = 0; c < size; c++) {
    const seen = new Map<ColorKey, number[]>();
    for (let r = 0; r < size; r++) {
      const v = grid[r][c].value;
      if (v) {
        const arr = seen.get(v) || [];
        arr.push(r);
        seen.set(v, arr);
      }
    }
    seen.forEach((rows) => {
      if (rows.length > 1) rows.forEach((rr) => (conflicts[`${rr}-${c}`] = true));
    });
  }

  // boxes
  for (let br = 0; br < size; br += box) {
    for (let bc = 0; bc < size; bc += box) {
      const seen = new Map<ColorKey, [number, number][]>();
      for (let r = br; r < br + box; r++) {
        for (let c = bc; c < bc + box; c++) {
          const v = grid[r][c].value;
          if (v) {
            const arr = seen.get(v) || [];
            arr.push([r, c]);
            seen.set(v, arr);
          }
        }
      }
      seen.forEach((coords) => {
        if (coords.length > 1) coords.forEach(([r, c]) => (conflicts[`${r}-${c}`] = true));
      });
    }
  }
  return conflicts;
}

/* ============================================================
   PRINTABLE CARD COMPONENT
============================================================ */
type PrintableCardProps = {
  colorClass?: string;
  buttonColor: string;
  filePath: string;
  downloadName?: string;
  bgImage?: string;
  overlayClass?: string;
  isActive?: boolean;
};

function PrintableCard({
  colorClass,
  buttonColor,
  filePath,
  downloadName,
  bgImage,
  overlayClass = "bg-black/10",
  isActive = false,
}: PrintableCardProps) {
  const useImage = !!bgImage;

  return (
    <div className="flex h-full flex-col rounded-[18px] bg-white p-3 shadow-soft transition-all duration-500 hover:scale-[1.02]">
      <div
        className={[
          "relative flex h-64 items-end justify-center overflow-hidden rounded-[14px] transition-all duration-700",
          useImage ? "bg-cover bg-center" : (colorClass ?? ""),
        ].join(" ")}
        style={{
          backgroundImage: useImage ? `url(${bgImage})` : undefined,
          transform: isActive ? "scale(1)" : "scale(0.8)",
          opacity: isActive ? 1 : 0,
        }}
      >
        {/* Optional contrast overlay for text/button legibility */}
        {useImage && (
          <div
            className={`absolute inset-0 ${overlayClass} transition-all duration-500 hover:bg-black/5`}
          />
        )}

        <div
          className="relative z-10 mb-4 transform transition-all duration-500 hover:scale-105"
          style={{
            transform: isActive ? "translateY(0) scale(1)" : "translateY(20px) scale(0.9)",
            opacity: isActive ? 1 : 0,
          }}
        >
          {/* anchor to force download */}
          <a href={filePath} download={downloadName || ""} className="block">
            <CTAButton
              text="Download PDF"
              href={filePath}
              bg={CART_DEFAULT}
              color="#FFFFFF"
              hoverBg={CART_HOVER}
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
          </a>
        </div>
      </div>
    </div>
  );
}

function AnagramGame() {
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-100px" });

  const initialPuzzles = [
    {
      word: "apple",
      scrambled: "appel", // Only 2 letters are at the wrong place
      category: "Fruit",
    },
    {
      word: "tiger",
      scrambled: "riget",
      category: "Animal",
    },
    {
      word: "house",
      scrambled: "hoesu",
      category: "Home",
    },
    {
      word: "water",
      scrambled: "awter",
      category: "Nature",
    },
    {
      word: "smile",
      scrambled: "sile",
      category: "Emotion",
    },
  ];

  const [puzzles, setPuzzles] = useState(initialPuzzles);
  const [selectedCells, setSelectedCells] = useState<{ row: number; col: number }[]>([]);
  const [completedPuzzles, setCompletedPuzzles] = useState<number[]>([]);
  const [currentHint, setCurrentHint] = useState<number | null>(null);
  const [feedback, setFeedback] = useState<{
    message: string;
    type: "success" | "error" | "hint";
  } | null>(null);
  const [animations, setAnimations] = useState<{
    [key: string]: "swap" | "bounce" | "success" | null;
  }>({});

  // Create grid from puzzles
  const grid = puzzles.map((puzzle, rowIndex) =>
    puzzle.scrambled.split("").map((letter, colIndex) => ({
      letter,
      isCorrect: puzzle.scrambled[colIndex] === puzzle.word[colIndex],
      row: rowIndex,
      col: colIndex,
      id: `${rowIndex}-${colIndex}`,
    }))
  );

  const handleCellClick = (row: number, col: number) => {
    // Don't allow clicks on completed puzzles
    if (completedPuzzles.includes(row)) return;

    const cellId = `${row}-${col}`;

    // Add animation
    setAnimations((prev) => ({ ...prev, [cellId]: "bounce" }));
    setTimeout(() => setAnimations((prev) => ({ ...prev, [cellId]: null })), 600);

    // If this is the first selection
    if (selectedCells.length === 0) {
      setSelectedCells([{ row, col }]);

      // Show visual feedback for selection
      setAnimations((prev) => ({ ...prev, [cellId]: "swap" }));
    }
    // If this is the second selection and in same row
    else if (selectedCells.length === 1 && selectedCells[0].row === row) {
      const [firstCell] = selectedCells;

      // Don't allow swapping same cell
      if (firstCell.row === row && firstCell.col === col) {
        setSelectedCells([]);
        setAnimations((prev) => ({ ...prev, [cellId]: null }));
        return;
      }

      // Perform swap
      const newPuzzles = [...puzzles];
      const scrambled = newPuzzles[row].scrambled.split("");
      [scrambled[firstCell.col], scrambled[col]] = [scrambled[col], scrambled[firstCell.col]];
      newPuzzles[row].scrambled = scrambled.join("");

      setPuzzles(newPuzzles);

      // Check if word is now correct
      const isCorrect = newPuzzles[row].scrambled === newPuzzles[row].word;

      if (isCorrect) {
        // Mark puzzle as completed
        setCompletedPuzzles((prev) => [...prev, row]);

        // Add success animation to all cells in the row
        const newAnimations = { ...animations };
        for (let i = 0; i < scrambled.length; i++) {
          newAnimations[`${row}-${i}`] = "success";
        }
        setAnimations(newAnimations);

        // Show success message
        setFeedback({
          message: `🎉 Excellent! "${newPuzzles[row].word}" is correct!`,
          type: "success",
        });

        // Clear animations after delay
        setTimeout(() => {
          setAnimations((prev) => {
            const updated = { ...prev };
            for (let i = 0; i < scrambled.length; i++) {
              delete updated[`${row}-${i}`];
            }
            return updated;
          });
        }, 1500);
      } else {
        // Show swap animation
        const firstCellId = `${firstCell.row}-${firstCell.col}`;
        setAnimations((prev) => ({
          ...prev,
          [firstCellId]: "swap",
          [cellId]: "swap",
        }));

        // Check if only one swap away from solution
        const correctPositions = newPuzzles[row].scrambled
          .split("")
          .map((letter, idx) => letter === newPuzzles[row].word[idx])
          .filter(Boolean).length;

        if (correctPositions >= newPuzzles[row].word.length - 2) {
          setFeedback({
            message: "✓ You're getting close! Keep going!",
            type: "hint",
          });
        }
      }

      // Reset selection
      setTimeout(() => {
        setSelectedCells([]);
        const firstCellId = `${firstCell.row}-${firstCell.col}`;
        setAnimations((prev) => ({
          ...prev,
          [firstCellId]: null,
          [cellId]: null,
        }));
      }, 500);
    } else {
      // Different row selected, start new selection
      setSelectedCells([{ row, col }]);
      setAnimations((prev) => ({ ...prev, [cellId]: "swap" }));
    }
  };

  const getCellAnimationClass = (cellId: string) => {
    const animation = animations[cellId];
    if (!animation) return "";

    switch (animation) {
      case "bounce":
        return "animate-bounce-in";
      case "swap":
        return "animate-pulse scale-110 z-10";
      case "success":
        return "animate-success-spin";
      default:
        return "";
    }
  };

  const getHint = (row: number) => {
    if (completedPuzzles.includes(row)) return;

    setCurrentHint(row);

    // Find the first incorrect position
    const puzzle = puzzles[row];
    const scrambled = puzzle.scrambled.split("");
    const target = puzzle.word.split("");

    let hintIndex = -1;
    for (let i = 0; i < scrambled.length; i++) {
      if (scrambled[i] !== target[i]) {
        hintIndex = i;
        break;
      }
    }

    if (hintIndex !== -1) {
      const correctLetter = target[hintIndex];
      const currentIndex = scrambled.indexOf(correctLetter, hintIndex + 1);

      if (currentIndex !== -1) {
        // Highlight the cells that should be swapped
        setAnimations((prev) => ({
          ...prev,
          [`${row}-${hintIndex}`]: "bounce",
          [`${row}-${currentIndex}`]: "bounce",
        }));

        setFeedback({
          message: `💡 Try swapping position ${hintIndex + 1} with position ${currentIndex + 1}`,
          type: "hint",
        });

        setTimeout(() => {
          setAnimations((prev) => ({
            ...prev,
            [`${row}-${hintIndex}`]: null,
            [`${row}-${currentIndex}`]: null,
          }));
          setCurrentHint(null);
        }, 3000);
      }
    }
  };

  const resetPuzzle = (row: number) => {
    const newPuzzles = [...puzzles];
    newPuzzles[row].scrambled = initialPuzzles[row].scrambled;
    setPuzzles(newPuzzles);

    // Remove from completed if it was completed
    setCompletedPuzzles((prev) => prev.filter((r) => r !== row));

    // Clear animations for this row
    setAnimations((prev) => {
      const updated = { ...prev };
      for (let i = 0; i < 5; i++) {
        delete updated[`${row}-${i}`];
      }
      return updated;
    });

    setFeedback({
      message: "🔄 Puzzle reset! Try again!",
      type: "hint",
    });
  };

  const resetAll = () => {
    setPuzzles(initialPuzzles);
    setCompletedPuzzles([]);
    setSelectedCells([]);
    setAnimations({});
    setFeedback({
      message: "✨ All puzzles reset! Start fresh!",
      type: "hint",
    });
  };

  return (
    <section ref={sectionRef} className="w-full bg-brand-grayBg py-12 sm:py-16 md:py-20">
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.7 }}
        className="mx-auto max-w-[80vw] rounded-[22px] bg-gradient-to-br from-white to-blue-50 p-6 shadow-soft sm:p-10"
      >
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="mb-8 text-center"
        >
          <h2 className="headingstyle mb-2 font-extrabold text-brand-teal">
            Anagram Swap Challenge
          </h2>
          <p className="textstyles mx-auto max-w-2xl text-brand-tealDark/80">
            Click two letters in the same row to swap them and form the correct word!
          </p>

          {/* Progress Bar */}
          <div className="mx-auto mt-4 max-w-md">
            <div className="mb-2 flex justify-between text-sm text-brand-tealDark/70">
              <span>Progress</span>
              <span>
                {completedPuzzles.length} / {puzzles.length} completed
              </span>
            </div>
            <div className="h-3 overflow-hidden rounded-full bg-blue-100">
              <div
                className="h-full rounded-full bg-gradient-to-r from-brand-teal to-brand-coral transition-all duration-500"
                style={{ width: `${(completedPuzzles.length / puzzles.length) * 100}%` }}
              />
            </div>
          </div>
        </motion.div>

        {/* Main Game Container */}
        <div className="mx-auto max-w-[60vw] md:max-w-[60vw] lg:max-w-[60vw]">
          {/* Game Container */}
          <div className="rounded-2xl bg-gradient-to-b from-white to-blue-50 p-6 shadow-inner">
            {/* Control Buttons */}
            <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <div className="flex gap-1">
                  <div className="h-4 w-4 rounded-md bg-gradient-to-br from-blue-100 to-blue-200 ring-2 ring-blue-300" />
                  <span className="text-xs text-brand-tealDark/70">Selected</span>
                </div>
                <div className="flex gap-1">
                  <div className="h-4 w-4 rounded-md bg-gradient-to-br from-green-100 to-green-200 ring-2 ring-green-300" />
                  <span className="text-xs text-brand-tealDark/70">Correct Position</span>
                </div>
              </div>

              <button
                onClick={resetAll}
                className="rounded-full bg-gradient-to-r from-brand-teal to-brand-coral px-4 py-2 text-sm font-medium text-white transition-all duration-300 hover:scale-105 hover:shadow-md active:scale-95"
              >
                Reset All Puzzles
              </button>
            </div>

            {/* Feedback Message */}
            {feedback && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`mb-4 rounded-lg px-4 py-3 text-center font-medium ${
                  feedback.type === "success"
                    ? "bg-gradient-to-r from-green-100 to-green-50 text-green-700 ring-1 ring-green-200"
                    : feedback.type === "error"
                      ? "bg-gradient-to-r from-red-100 to-red-50 text-red-700 ring-1 ring-red-200"
                      : "bg-gradient-to-r from-blue-100 to-blue-50 text-blue-700 ring-1 ring-blue-200"
                }`}
              >
                {feedback.message}
              </motion.div>
            )}

            {/* Puzzle Grid */}
            <div className="space-y-4">
              {grid.map((row, rowIndex) => {
                const isCompleted = completedPuzzles.includes(rowIndex);
                const puzzle = puzzles[rowIndex];

                return (
                  <motion.div
                    key={rowIndex}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: rowIndex * 0.1 }}
                    className={`rounded-xl p-4 transition-all duration-300 ${
                      isCompleted
                        ? "bg-gradient-to-r from-green-50 to-emerald-50 ring-2 ring-green-200"
                        : selectedCells.some((cell) => cell.row === rowIndex)
                          ? "bg-gradient-to-r from-blue-50 to-indigo-50 ring-2 ring-blue-200"
                          : "bg-white ring-1 ring-black/10"
                    }`}
                  >
                    <div className="mb-3 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div
                          className={`flex h-8 w-8 items-center justify-center rounded-full ${
                            isCompleted
                              ? "bg-gradient-to-br from-green-400 to-green-500 text-white"
                              : "bg-gradient-to-br from-blue-100 to-blue-200 text-blue-700"
                          }`}
                        >
                          {rowIndex + 1}
                        </div>
                        <div>
                          <span className="text-sm font-medium text-brand-tealDark">
                            Category: {puzzle.category}
                          </span>
                          {isCompleted && (
                            <span className="ml-2 rounded-full bg-green-100 px-2 py-0.5 text-xs font-medium text-green-700">
                              ✓ Completed
                            </span>
                          )}
                        </div>
                      </div>

                      <div className="flex gap-2">
                        {!isCompleted && (
                          <button
                            onClick={() => getHint(rowIndex)}
                            disabled={currentHint === rowIndex}
                            className={`rounded-full px-3 py-1 text-xs font-medium transition-all duration-300 ${
                              currentHint === rowIndex
                                ? "bg-yellow-100 text-yellow-700"
                                : "bg-gradient-to-r from-yellow-100 to-amber-100 text-yellow-700 hover:scale-105"
                            }`}
                          >
                            💡 Hint
                          </button>
                        )}
                        <button
                          onClick={() => resetPuzzle(rowIndex)}
                          className="rounded-full bg-gradient-to-r from-gray-100 to-gray-200 px-3 py-1 text-xs font-medium text-gray-700 transition-all duration-300 hover:scale-105"
                        >
                          🔄 Reset
                        </button>
                      </div>
                    </div>

                    {/* Letter Cells */}
                    <div className="grid grid-cols-5 gap-3">
                      {row.map((cell, cellIndex) => {
                        const isSelected = selectedCells.some(
                          (selected) => selected.row === rowIndex && selected.col === cellIndex
                        );
                        const isCorrectPosition =
                          puzzle.scrambled[cellIndex] === puzzle.word[cellIndex];

                        return (
                          <motion.button
                            key={cellIndex}
                            onClick={() => handleCellClick(rowIndex, cellIndex)}
                            disabled={isCompleted}
                            whileHover={{ scale: isCompleted ? 1 : 1.05 }}
                            whileTap={{ scale: isCompleted ? 1 : 0.95 }}
                            className={`relative flex aspect-square w-full items-center justify-center rounded-xl text-2xl font-bold transition-all duration-300 ${getCellAnimationClass(`${rowIndex}-${cellIndex}`)} ${
                              isCompleted
                                ? "shadow-green bg-gradient-to-br from-green-200 to-green-300 text-green-800"
                                : isSelected
                                  ? "shadow-blue z-10 scale-110 bg-gradient-to-br from-blue-200 to-blue-300 text-blue-800"
                                  : isCorrectPosition
                                    ? "bg-gradient-to-br from-green-100 to-green-200 text-green-700 ring-2 ring-green-300"
                                    : "bg-gradient-to-br from-gray-100 to-gray-200 text-gray-700 hover:from-blue-50 hover:to-blue-100"
                            } ${isCompleted ? "cursor-default" : "cursor-pointer"} shadow-md hover:shadow-lg`}
                          >
                            <span className="select-none">{cell.letter.toUpperCase()}</span>

                            {/* Position indicator */}
                            <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-black/10 text-xs font-normal">
                              {cellIndex + 1}
                            </span>

                            {/* Selection indicator */}
                            {isSelected && (
                              <div className="absolute inset-0 rounded-xl ring-4 ring-blue-400/50" />
                            )}
                          </motion.button>
                        );
                      })}
                    </div>

                    {/* Word Length Indicator */}
                    <div className="mt-3 flex justify-center">
                      <div className="flex gap-2">
                        {puzzle.word.split("").map((_, idx) => (
                          <div
                            key={idx}
                            className={`h-1 w-8 rounded-full transition-all duration-300 ${
                              puzzle.scrambled[idx] === puzzle.word[idx]
                                ? "bg-green-400"
                                : "bg-gray-300"
                            }`}
                          />
                        ))}
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>

            {/* Instructions */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="mt-8 rounded-xl bg-gradient-to-r from-blue-50 to-indigo-50 p-4"
            >
              <h3 className="mb-2 text-sm font-semibold text-brand-tealDark">How to Play:</h3>
              <ul className="space-y-1 text-sm text-brand-tealDark/70">
                <li className="flex items-center gap-2">
                  <div className="h-2 w-2 rounded-full bg-blue-400" />
                  Click one letter to select it (it will glow blue)
                </li>
                <li className="flex items-center gap-2">
                  <div className="h-2 w-2 rounded-full bg-green-400" />
                  Click another letter in the same row to swap them
                </li>
                <li className="flex items-center gap-2">
                  <div className="h-2 w-2 rounded-full bg-yellow-400" />
                  Form the correct word - the row will turn green when complete!
                </li>
                <li className="flex items-center gap-2">
                  <div className="h-2 w-2 rounded-full bg-purple-400" />
                  Use hints if you're stuck, or reset a puzzle to start over
                </li>
              </ul>
            </motion.div>
          </div>
        </div>
      </motion.div>

      {/* Add custom animations to global styles */}
      <style jsx global>{`
        @keyframes success-spin {
          0% {
            transform: rotateY(0) scale(1);
          }
          50% {
            transform: rotateY(180deg) scale(1.1);
          }
          100% {
            transform: rotateY(360deg) scale(1);
          }
        }

        .animate-success-spin {
          animation: success-spin 0.6s ease-out forwards;
        }

        .shadow-green {
          box-shadow: 0 4px 15px rgba(72, 187, 120, 0.3);
        }

        .shadow-blue {
          box-shadow: 0 4px 15px rgba(59, 130, 246, 0.3);
        }
      `}</style>
    </section>
  );
}

function WordFormationGame() {
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-100px" });

  // Level 2 puzzles with scrambled letters from target words
  const level2Puzzles = [
    {
      id: 1,
      targetWord: "CAT",
      scrambledLetters: ["C", "A", "T"], // Only the letters needed for CAT
      category: "Pets",
      hint: "A common house pet that says 'meow'",
      difficulty: "Easy",
    },
    {
      id: 2,
      targetWord: "MOON",
      scrambledLetters: ["M", "O", "O", "N"], // Only the letters needed for MOON
      category: "Space",
      hint: "Shines bright in the night sky",
      difficulty: "Easy",
    },
    {
      id: 3,
      targetWord: "FLOWER",
      scrambledLetters: ["F", "L", "O", "W", "E", "R"], // Only FLOWER letters
      category: "Nature",
      hint: "Blooms in spring with colorful petals",
      difficulty: "Medium",
    },
    {
      id: 4,
      targetWord: "BOOK",
      scrambledLetters: ["B", "O", "O", "K"], // Only BOOK letters
      category: "School",
      hint: "You read stories from this",
      difficulty: "Easy",
    },
    {
      id: 5,
      targetWord: "WATER",
      scrambledLetters: ["W", "A", "T", "E", "R"], // Only WATER letters
      category: "Elements",
      hint: "You drink this to stay hydrated",
      difficulty: "Medium",
    },
  ];

  // Game state
  const [currentPuzzleIndex, setCurrentPuzzleIndex] = useState(0);
  const [draggedLetter, setDraggedLetter] = useState<{
    letter: string;
    sourceIndex: number;
  } | null>(null);
  const [wordCells, setWordCells] = useState<(string | null)[]>([]);
  const [availableLetters, setAvailableLetters] = useState<string[]>([]);
  const [isCompleted, setIsCompleted] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const [score, setScore] = useState(0);
  const [animations, setAnimations] = useState<{
    [key: string]: "success" | "error" | "drop" | "pulse" | null;
  }>({});
  const [gameHistory, setGameHistory] = useState<Array<{ puzzleId: number; attempts: number }>>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [hoveredDropIndex, setHoveredDropIndex] = useState<number | null>(null);
  const [feedback, setFeedback] = useState<{
    message: string;
    type: "success" | "error" | "hint";
  } | null>(null);

  // Initialize current puzzle
  useEffect(() => {
    const currentPuzzle = level2Puzzles[currentPuzzleIndex];
    // Initialize word cells as empty
    setWordCells(Array(currentPuzzle.targetWord.length).fill(null));
    // Shuffle available letters (using only letters from the target word)
    const shuffled = [...currentPuzzle.scrambledLetters].sort(() => Math.random() - 0.5);
    setAvailableLetters(shuffled);
    setIsCompleted(false);
    setDraggedLetter(null);
    setShowHint(false);
    setAnimations({});
    setHoveredDropIndex(null);
    setFeedback(null);
  }, [currentPuzzleIndex]);

  // Handle drag start from available letters
  const handleDragStart = (letter: string, index: number, e: React.DragEvent<HTMLDivElement>) => {
    e.dataTransfer.setData("text/plain", JSON.stringify({ letter, sourceIndex: index }));
    e.dataTransfer.effectAllowed = "copyMove";
    setDraggedLetter({ letter, sourceIndex: index });
    setIsDragging(true);

    // Add pulse animation to the dragged letter
    setAnimations((prev) => ({ ...prev, [`source-${index}`]: "pulse" }));

    // Make the dragged element transparent
    if (e.currentTarget) {
      e.currentTarget.style.opacity = "0.4";
    }
  };

  // Handle drag over word cells
  const handleDragOver = (index: number, e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setHoveredDropIndex(index);

    if (wordCells[index] === null) {
      e.dataTransfer.dropEffect = "copy";
    } else {
      e.dataTransfer.dropEffect = "none";
    }
  };

  // Handle drag end
  const handleDragEnd = () => {
    setIsDragging(false);
    setHoveredDropIndex(null);

    // Reset opacity of all source letters
    setAnimations((prev) => {
      const newAnimations = { ...prev };
      availableLetters.forEach((_, index) => {
        if (newAnimations[`source-${index}`] === "pulse") {
          newAnimations[`source-${index}`] = null;
        }
      });
      return newAnimations;
    });
  };

  // Handle drop on word cells
  const handleDrop = (index: number, e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    setHoveredDropIndex(null);

    if (wordCells[index] !== null) return;

    try {
      const data = JSON.parse(e.dataTransfer.getData("text/plain"));
      const { letter, sourceIndex } = data;

      // Update word cells
      const newWordCells = [...wordCells];
      newWordCells[index] = letter;
      setWordCells(newWordCells);

      // Remove letter from available letters
      const newAvailableLetters = [...availableLetters];
      newAvailableLetters[sourceIndex] = "";
      setAvailableLetters(newAvailableLetters);

      // Add drop animation
      setAnimations((prev) => ({ ...prev, [`target-${index}`]: "drop" }));

      // Check if word is complete
      setTimeout(() => {
        const isWordComplete = newWordCells.every((cell) => cell !== null);
        if (isWordComplete) {
          checkWord();
        }
      }, 300);
    } catch (error) {
      console.error("Drop error:", error);
    }

    setDraggedLetter(null);
  };

  // Handle drag leave from drop zone
  const handleDragLeave = () => {
    setHoveredDropIndex(null);
  };

  // Handle click to remove letter from word cell
  const handleWordCellClick = (index: number) => {
    const letter = wordCells[index];
    if (letter === null || isCompleted) return;

    // Return letter to available letters
    const newWordCells = [...wordCells];
    newWordCells[index] = null;
    setWordCells(newWordCells);

    // Find first empty spot in available letters
    const newAvailableLetters = [...availableLetters];
    const emptyIndex = newAvailableLetters.findIndex((l) => l === "");
    if (emptyIndex !== -1) {
      newAvailableLetters[emptyIndex] = letter;
      setAvailableLetters(newAvailableLetters);

      // Add animation for returning letter
      setAnimations((prev) => ({ ...prev, [`source-${emptyIndex}`]: "drop" }));
    }

    setIsCompleted(false);
    setFeedback(null);
  };

  // Check if formed word is correct
  const checkWord = () => {
    const currentPuzzle = level2Puzzles[currentPuzzleIndex];
    const formedWord = wordCells.join("");
    const isCorrect = formedWord === currentPuzzle.targetWord;

    if (isCorrect) {
      // Success animation for all letters
      const newAnimations: typeof animations = {};
      wordCells.forEach((_, index) => {
        newAnimations[`target-${index}`] = "success";
      });
      setAnimations(newAnimations);

      setIsCompleted(true);
      setScore((prev) => prev + 100 * currentPuzzle.targetWord.length);

      // Add to game history
      setGameHistory((prev) => [
        ...prev,
        {
          puzzleId: currentPuzzle.id,
          attempts: 1,
        },
      ]);

      // Celebration effect
      setTimeout(() => {
        setFeedback({
          message: `🎉 Excellent! You formed "${currentPuzzle.targetWord}"!`,
          type: "success",
        });
      }, 500);
    } else {
      // Error animation
      const newAnimations: typeof animations = {};
      wordCells.forEach((_, index) => {
        newAnimations[`target-${index}`] = "error";
      });
      setAnimations(newAnimations);

      setFeedback({
        message: "✗ Not quite right! Try rearranging the letters.",
        type: "error",
      });

      // Clear error animation after delay
      setTimeout(() => {
        setAnimations((prev) => {
          const newAnimations = { ...prev };
          wordCells.forEach((_, index) => {
            delete newAnimations[`target-${index}`];
          });
          return newAnimations;
        });
        setFeedback(null);
      }, 1500);
    }
  };

  // Reset current puzzle
  const resetPuzzle = () => {
    const currentPuzzle = level2Puzzles[currentPuzzleIndex];
    setWordCells(Array(currentPuzzle.targetWord.length).fill(null));
    const shuffled = [...currentPuzzle.scrambledLetters].sort(() => Math.random() - 0.5);
    setAvailableLetters(shuffled);
    setIsCompleted(false);
    setShowHint(false);
    setAnimations({});
    setFeedback(null);
  };

  // Move to next puzzle
  const nextPuzzle = () => {
    if (currentPuzzleIndex < level2Puzzles.length - 1) {
      setCurrentPuzzleIndex((prev) => prev + 1);
      setFeedback(null);
    }
  };

  // Move to previous puzzle
  const previousPuzzle = () => {
    if (currentPuzzleIndex > 0) {
      setCurrentPuzzleIndex((prev) => prev - 1);
      setFeedback(null);
    }
  };

  // Show solution
  const showSolution = () => {
    const currentPuzzle = level2Puzzles[currentPuzzleIndex];
    const solutionLetters = currentPuzzle.targetWord.split("");
    setWordCells(solutionLetters);
    setAvailableLetters(Array(solutionLetters.length).fill(""));

    // Add success animation
    const newAnimations: typeof animations = {};
    solutionLetters.forEach((_, index) => {
      newAnimations[`target-${index}`] = "success";
    });
    setAnimations(newAnimations);

    setIsCompleted(true);
    setScore((prev) => prev + 50);

    setTimeout(() => {
      setFeedback({
        message: `Here's the correct word: "${currentPuzzle.targetWord}"`,
        type: "hint",
      });
    }, 500);
  };

  // Get animation class
  const getAnimationClass = (key: string) => {
    const animation = animations[key];
    if (!animation) return "";

    switch (animation) {
      case "success":
        return "animate-success-pop";
      case "error":
        return "animate-error-shake";
      case "drop":
        return "animate-drop-bounce";
      case "pulse":
        return "animate-pulse";
      default:
        return "";
    }
  };

  const currentPuzzle = level2Puzzles[currentPuzzleIndex];
  const progress = ((currentPuzzleIndex + 1) / level2Puzzles.length) * 100;

  // Calculate cell size based on word length
  const getGridCols = (length: number) => {
    if (length <= 4) return "grid-cols-4";
    if (length <= 6) return "grid-cols-6";
    return "grid-cols-5";
  };

  const topGridCols = getGridCols(currentPuzzle.scrambledLetters.length);
  const bottomGridCols = getGridCols(currentPuzzle.targetWord.length);

  return (
    <section
      ref={sectionRef}
      className="w-full bg-gradient-to-b from-brand-grayBg to-blue-50 py-12 sm:py-16 md:py-20"
    >
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.7 }}
        className="mx-auto max-w-[85vw] rounded-[22px] bg-gradient-to-br from-white to-purple-50 p-6 shadow-xl sm:p-10"
      >
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="mb-8 text-center"
        >
          <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-purple-100 to-pink-100 px-4 py-1">
            <span className="text-sm font-semibold text-purple-700">Level 2</span>
            <span className="h-1 w-1 rounded-full bg-purple-400" />
            <span className="text-sm text-purple-600">Word Formation</span>
            <span className="ml-2 rounded-full bg-amber-100 px-2 py-0.5 text-xs font-medium text-amber-700">
              {currentPuzzle.difficulty}
            </span>
          </div>

          <h2 className="headingstyle mb-2 font-extrabold text-brand-teal">
            Drag & Drop Word Builder
          </h2>
          <p className="textstyles mx-auto max-w-2xl text-brand-tealDark/80">
            Drag letters to form the hidden word! Letters below are the same size as above.
          </p>

          {/* Progress and Score */}
          <div className="mx-auto mt-6 flex max-w-2xl flex-col items-center justify-between gap-4 sm:flex-row">
            <div className="flex-1">
              <div className="mb-1 flex justify-between text-sm text-brand-tealDark/70">
                <span>
                  Puzzle {currentPuzzleIndex + 1} of {level2Puzzles.length}
                </span>
                <span>{Math.round(progress)}%</span>
              </div>
              <div className="h-3 overflow-hidden rounded-full bg-gray-200">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-brand-teal via-purple-500 to-pink-500 transition-all duration-500"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>

            <div className="rounded-xl bg-gradient-to-r from-blue-50 to-indigo-50 px-4 py-2">
              <div className="text-center text-sm text-brand-tealDark/70">Score</div>
              <div className="text-center text-3xl font-bold text-brand-teal">{score}</div>
            </div>
          </div>
        </motion.div>

        {/* Main Game Container */}
        <div className="mx-auto max-w-[70vw] md:max-w-[70vw] lg:max-w-[70vw]">
          <div className="rounded-2xl bg-gradient-to-b from-white to-blue-50 p-6 shadow-inner">
            {/* Puzzle Info */}
            <div className="mb-6 rounded-xl bg-gradient-to-r from-purple-50 to-pink-50 p-4">
              <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
                <div>
                  <div className="text-lg font-bold text-brand-tealDark">
                    Category: <span className="text-purple-600">{currentPuzzle.category}</span>
                  </div>
                  <div className="mt-1 text-sm text-brand-tealDark/70">
                    Target: <span className="font-bold">{currentPuzzle.targetWord.length}</span>{" "}
                    letters
                  </div>
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={() => setShowHint(!showHint)}
                    className="rounded-full bg-gradient-to-r from-yellow-100 to-amber-100 px-4 py-2 text-sm font-medium text-yellow-700 transition-all duration-300 hover:scale-105 hover:shadow-md"
                  >
                    {showHint ? "Hide" : "Show"} Hint
                  </button>
                  <button
                    onClick={showSolution}
                    disabled={isCompleted}
                    className={`rounded-full px-4 py-2 text-sm font-medium transition-all duration-300 hover:scale-105 hover:shadow-md ${
                      isCompleted
                        ? "cursor-not-allowed bg-gray-100 text-gray-400"
                        : "bg-gradient-to-r from-blue-100 to-blue-200 text-blue-700"
                    }`}
                  >
                    Show Answer
                  </button>
                  <button
                    onClick={resetPuzzle}
                    className="rounded-full bg-gradient-to-r from-gray-100 to-gray-200 px-4 py-2 text-sm font-medium text-gray-700 transition-all duration-300 hover:scale-105 hover:shadow-md"
                  >
                    Reset
                  </button>
                </div>
              </div>

              {/* Hint */}
              {showHint && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  className="mt-3 overflow-hidden"
                >
                  <div className="rounded-lg bg-gradient-to-r from-blue-50 to-indigo-50 p-3">
                    <div className="flex items-start gap-2">
                      <span className="mt-0.5 text-xl">💡</span>
                      <div>
                        <div className="font-medium text-brand-tealDark">Hint:</div>
                        <div className="text-sm text-brand-tealDark/80">{currentPuzzle.hint}</div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </div>

            {/* Feedback Message */}
            {feedback && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`mb-6 rounded-lg px-4 py-3 text-center font-medium ${
                  feedback.type === "success"
                    ? "bg-gradient-to-r from-green-100 to-green-50 text-green-700 ring-1 ring-green-200"
                    : feedback.type === "error"
                      ? "bg-gradient-to-r from-red-100 to-red-50 text-red-700 ring-1 ring-red-200"
                      : "bg-gradient-to-r from-blue-100 to-blue-50 text-blue-700 ring-1 ring-blue-200"
                }`}
              >
                {feedback.message}
              </motion.div>
            )}

            {/* Available Letters Grid - UPPER SECTION */}
            <div className="mb-8">
              <h3 className="mb-4 text-center text-lg font-bold text-brand-tealDark">
                Available Letters (Drag from here)
              </h3>
              <div className={`grid ${topGridCols} gap-4`}>
                {availableLetters.map((letter, index) => (
                  <div
                    key={`source-${index}`}
                    className={`flex aspect-square items-center justify-center rounded-xl text-3xl font-bold transition-all duration-300 ${getAnimationClass(
                      `source-${index}`
                    )} ${
                      letter
                        ? "cursor-grab bg-gradient-to-br from-blue-200 to-blue-400 text-blue-900 shadow-lg hover:scale-105 hover:shadow-xl active:scale-95 active:cursor-grabbing"
                        : "cursor-default bg-gradient-to-br from-gray-100 to-gray-300 text-transparent"
                    } ${isDragging && letter ? "z-20 scale-110" : ""}`}
                    draggable={!!letter}
                    onDragStart={(e) => handleDragStart(letter, index, e)}
                    onDragEnd={handleDragEnd}
                    title={letter ? `Drag letter ${letter}` : "Used letter"}
                  >
                    {letter || "✓"}
                  </div>
                ))}
              </div>
            </div>

            {/* Drag Indicator with Arrow */}
            <div className="mb-8 flex items-center justify-center">
              <div className="relative flex flex-col items-center">
                <div className="mb-2 text-sm font-medium text-brand-tealDark/70">
                  Drag letters down to empty slots ↓
                </div>
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-r from-blue-100 to-purple-100">
                  <svg
                    className="h-8 w-8 animate-bounce text-purple-500"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={3}
                      d="M19 14l-7 7m0 0l-7-7m7 7V3"
                    />
                  </svg>
                </div>
              </div>
            </div>

            {/* Word Formation Area - SAME SIZE AS ABOVE */}
            <div className="mb-8">
              <h3 className="mb-4 text-center text-lg font-bold text-brand-tealDark">
                Form the Word Here (Same size cells)
              </h3>
              <div className="flex justify-center">
                <div className={`grid ${bottomGridCols} gap-4`}>
                  {wordCells.map((letter, index) => (
                    <div
                      key={`target-${index}`}
                      className={`flex aspect-square items-center justify-center rounded-xl text-3xl font-bold transition-all duration-300 ${getAnimationClass(
                        `target-${index}`
                      )} ${
                        letter === null
                          ? "ring-dashed cursor-pointer bg-gradient-to-br from-gray-100 to-gray-300 text-gray-500 ring-4 ring-gray-400 hover:bg-gradient-to-br hover:from-gray-200 hover:to-gray-400 hover:ring-gray-500"
                          : "bg-gradient-to-br from-green-200 to-green-400 text-green-900 shadow-lg"
                      } ${hoveredDropIndex === index && letter === null ? "scale-110 bg-gradient-to-br from-green-100 to-green-300 ring-8 ring-green-400/50" : ""}`}
                      onDragOver={(e) => handleDragOver(index, e)}
                      onDragLeave={handleDragLeave}
                      onDrop={(e) => handleDrop(index, e)}
                      onClick={() => handleWordCellClick(index)}
                      title={
                        letter === null
                          ? "Drop letter here (click to remove)"
                          : `Click to remove ${letter}`
                      }
                    >
                      {letter === null ? (
                        <div className="p-2 text-center md:p-10">
                          <div className="text-xl font-medium text-gray-600 md:text-3xl">?</div>
                          <div className="mt-1 text-xl text-gray-500 md:text-3xl">
                            Slot {index + 1}
                          </div>
                        </div>
                      ) : (
                        <span className="select-none text-4xl font-bold">{letter}</span>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Progress indicator */}
              <div className="mt-4 text-center">
                <div className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-blue-50 to-indigo-50 px-4 py-2 shadow-sm">
                  <span className="text-sm text-gray-600">Letters placed:</span>
                  <span className="text-lg font-bold text-brand-teal">
                    {wordCells.filter((cell) => cell !== null).length}/
                    {currentPuzzle.targetWord.length}
                  </span>
                </div>
              </div>
            </div>

            {/* Target Word Display (Revealed when completed) */}
            {isCompleted && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-6 rounded-2xl bg-gradient-to-r from-green-50 to-emerald-100 p-6 text-center shadow-lg"
              >
                <div className="mb-3 flex items-center justify-center gap-3">
                  <span className="text-3xl">🎉</span>
                  <span className="text-xl font-bold text-green-800">Success! The word is:</span>
                  <span className="text-3xl">🎉</span>
                </div>
                <div className="animate-success-pop text-5xl font-bold tracking-widest text-green-900">
                  {currentPuzzle.targetWord}
                </div>
                <div className="mt-4 text-lg text-green-700">
                  +{100 * currentPuzzle.targetWord.length} points!
                </div>
              </motion.div>
            )}

            {/* Action Buttons */}
            <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
              <div className="flex gap-3">
                <button
                  onClick={previousPuzzle}
                  disabled={currentPuzzleIndex === 0}
                  className={`rounded-full px-5 py-3 font-medium transition-all duration-300 ${
                    currentPuzzleIndex === 0
                      ? "cursor-not-allowed bg-gray-100 text-gray-400"
                      : "bg-gradient-to-r from-blue-100 to-blue-200 text-blue-700 hover:scale-105 hover:shadow-md"
                  }`}
                >
                  ← Previous
                </button>
                <button
                  onClick={nextPuzzle}
                  disabled={currentPuzzleIndex === level2Puzzles.length - 1 || !isCompleted}
                  className={`rounded-full px-5 py-3 font-medium transition-all duration-300 ${
                    currentPuzzleIndex === level2Puzzles.length - 1 || !isCompleted
                      ? "cursor-not-allowed bg-gray-100 text-gray-400"
                      : "bg-gradient-to-r from-green-100 to-green-200 text-green-700 hover:scale-105 hover:shadow-md"
                  }`}
                >
                  Next Puzzle →
                </button>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={checkWord}
                  disabled={wordCells.some((cell) => cell === null) || isCompleted}
                  className={`rounded-full px-8 py-3 font-medium transition-all duration-300 ${
                    wordCells.some((cell) => cell === null) || isCompleted
                      ? "cursor-not-allowed bg-gray-100 text-gray-400"
                      : "bg-gradient-to-r from-brand-teal to-brand-coral text-lg text-white hover:scale-105 hover:shadow-xl"
                  }`}
                >
                  {isCompleted ? "✓ Complete!" : "Check Word"}
                </button>
              </div>
            </div>

            {/* Instructions */}
            <div className="mt-8 rounded-xl bg-gradient-to-r from-blue-50 to-indigo-50 p-4">
              <h3 className="mb-3 text-center text-lg font-bold text-brand-tealDark">
                How to Play:
              </h3>
              <ul className="grid grid-cols-1 gap-3 text-sm text-brand-tealDark/80 sm:grid-cols-2">
                <li className="flex items-center gap-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-r from-blue-200 to-blue-300">
                    <span className="font-bold">1</span>
                  </div>
                  <span>Drag letters from the top grid</span>
                </li>
                <li className="flex items-center gap-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-r from-green-200 to-green-300">
                    <span className="font-bold">2</span>
                  </div>
                  <span>Drop them into any empty box below</span>
                </li>
                <li className="flex items-center gap-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-r from-yellow-200 to-yellow-300">
                    <span className="font-bold">3</span>
                  </div>
                  <span>Boxes are same size for easy dragging</span>
                </li>
                <li className="flex items-center gap-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-r from-purple-200 to-purple-300">
                    <span className="font-bold">4</span>
                  </div>
                  <span>Click on letters to return them</span>
                </li>
              </ul>
            </div>

            {/* Game History */}
            {gameHistory.length > 0 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="mt-8 rounded-xl bg-gradient-to-r from-blue-50 to-indigo-50 p-4"
              >
                <h3 className="mb-3 text-center text-lg font-bold text-brand-tealDark">
                  Your Progress
                </h3>
                <div className="grid grid-cols-5 gap-3">
                  {level2Puzzles.map((puzzle) => {
                    const completed = gameHistory.some((h) => h.puzzleId === puzzle.id);
                    return (
                      <div
                        key={puzzle.id}
                        className={`flex flex-col items-center rounded-xl p-3 transition-all duration-300 ${
                          completed
                            ? "bg-gradient-to-br from-green-100 to-green-200 shadow-lg"
                            : currentPuzzle.id === puzzle.id
                              ? "bg-gradient-to-br from-blue-100 to-blue-200 ring-2 ring-blue-300"
                              : "bg-gradient-to-br from-gray-100 to-gray-200"
                        }`}
                      >
                        <div
                          className={`flex h-10 w-10 items-center justify-center rounded-full text-lg font-bold ${
                            completed
                              ? "bg-green-500 text-white"
                              : currentPuzzle.id === puzzle.id
                                ? "bg-blue-500 text-white"
                                : "bg-gray-300 text-gray-600"
                          }`}
                        >
                          {puzzle.id}
                        </div>
                        <div className="mt-2 text-center text-xs font-medium">
                          {completed ? "✓" : currentPuzzle.id === puzzle.id ? "→" : "○"}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </motion.div>
            )}
          </div>
        </div>
      </motion.div>

      {/* Add custom animations */}
      <style jsx global>{`
        @keyframes success-pop {
          0% {
            transform: scale(1);
          }
          50% {
            transform: scale(1.1);
          }
          100% {
            transform: scale(1);
          }
        }

        @keyframes error-shake {
          0%,
          100% {
            transform: translateX(0);
          }
          25% {
            transform: translateX(-8px);
          }
          75% {
            transform: translateX(8px);
          }
        }

        @keyframes drop-bounce {
          0% {
            transform: scale(1);
          }
          50% {
            transform: scale(0.95);
          }
          100% {
            transform: scale(1);
          }
        }

        @keyframes pulse {
          0%,
          100% {
            opacity: 1;
          }
          50% {
            opacity: 0.7;
          }
        }

        .animate-success-pop {
          animation: success-pop 0.5s ease-out forwards;
        }

        .animate-error-shake {
          animation: error-shake 0.5s ease-out forwards;
        }

        .animate-drop-bounce {
          animation: drop-bounce 0.3s ease-out forwards;
        }

        .animate-pulse {
          animation: pulse 0.5s ease-in-out infinite;
        }

        .ring-dashed {
          border-style: dashed;
        }

        /* Improved drag experience */
        .cursor-grab {
          cursor:
            url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='32' height='32' viewport='0 0 32 32' style='fill:black;font-size:24px;'><text y='50%'>👆</text></svg>")
              16 0,
            auto;
        }

        .cursor-grabbing {
          cursor:
            url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='32' height='32' viewport='0 0 32 32' style='fill:black;font-size:24px;'><text y='50%'>👇</text></svg>")
              16 0,
            auto;
        }
      `}</style>
    </section>
  );
}

/* ============================================================
   GLOBAL STYLES FOR ANIMATIONS (Add to your global CSS)
============================================================ */
const globalStyles = `
@keyframes fade-in-up {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes fade-in {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

@keyframes scale-in {
  from {
    opacity: 0;
    transform: scale(0.9);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}

@keyframes bounce-in {
  0% {
    opacity: 0;
    transform: scale(0.3);
  }
  50% {
    opacity: 1;
    transform: scale(1.05);
  }
  70% {
    transform: scale(0.9);
  }
  100% {
    opacity: 1;
    transform: scale(1);
  }
}

@keyframes slide-in-right {
  from {
    opacity: 0;
    transform: translateX(30px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

@keyframes slide-in-left {
  from {
    opacity: 0;
    transform: translateX(-30px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

.animate-fade-in-up {
  animation: fade-in-up 0.6s ease-out forwards;
}

.animate-fade-in {
  animation: fade-in 0.6s ease-out forwards;
}

.animate-scale-in {
  animation: scale-in 0.4s ease-out forwards;
}

.animate-bounce-in {
  animation: bounce-in 0.6s ease-out forwards;
}

.animate-slide-in-right {
  animation: slide-in-right 0.5s ease-out forwards;
}

.animate-slide-in-left {
  animation: slide-in-left 0.5s ease-out forwards;
}

.animation-delay-200 {
  animation-delay: 200ms;
}

.animation-delay-400 {
  animation-delay: 400ms;
}

.animation-delay-600 {
  animation-delay: 600ms;
}

/* Smooth scrolling */
html {
  scroll-behavior: smooth;
}

/* Custom scrollbar */
::-webkit-scrollbar {
  width: 8px;
}

::-webkit-scrollbar-track {
  background: #f1f1f1;
}

::-webkit-scrollbar-thumb {
  background: #0A8A80;
  border-radius: 4px;
}

::-webkit-scrollbar-thumb:hover {
  background: #066a63;
}
`;

// Add global styles to document
if (typeof document !== "undefined") {
  const styleSheet = document.createElement("style");
  styleSheet.innerText = globalStyles;
  document.head.appendChild(styleSheet);
}

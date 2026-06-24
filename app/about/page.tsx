"use client";
import React, { useEffect, useState, useRef } from "react";
import NavBar from "@/components/NavBar";
import Footer from "@/components/Footer";
import CTAButton from "@/components/CTAButton";
import MediaLayout from "@/components/MediaLayout";
import Tribe from "@/components/Tribe";
import VideoLayout from "@/components/VideoLayout";
import Head from "next/head";
import Community from "@/components/Community";
import Image from "next/image";
import toast from "react-hot-toast";
import { motion } from "framer-motion";
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

export default function AboutUs() {
  return (
    <>
      <Head>
        <title>About Logicology - Our Story, Team & Vision | Educational Games for Kids</title>
        <meta
          name="description"
          content="Learn about Logicology's mission to create engaging gamified educational content for children. Meet our passionate team of designers, developers, and educators dedicated to making learning fun through innovative games and books."
        />
        <meta
          name="keywords"
          content="about logicology, educational games company, kids learning games, STEM education company, game-based learning, educational content creators, childrens educational books, logic games for kids, learning through play, educational startup"
        />

        {/* Open Graph / Facebook */}
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://yourdomain.com/about" />
        <meta property="og:title" content="About Logicology - Empowering Minds Through Play" />
        <meta
          property="og:description"
          content="Discover the story behind Logicology. We create innovative gamified content to help children develop 21st century skills through fun learning."
        />
        <meta
          property="og:image"
          content="https://ik.imagekit.io/pratik11/Kartik%20-%20Philosophy.mp4?updatedAt=1758433043493"
        />

        {/* Twitter */}
        <meta property="twitter:card" content="summary_large_image" />
        <meta property="twitter:url" content="https://yourdomain.com/about" />
        <meta property="twitter:title" content="About Logicology - Our Story & Team" />
        <meta
          property="twitter:description"
          content="Meet the team behind Logicology - passionate creators making learning fun through games."
        />
        <meta
          property="twitter:image"
          content="https://ik.imagekit.io/pratik11/Kartik%20-%20Philosophy.mp4?updatedAt=1758433043493"
        />

        {/* Additional SEO meta tags */}
        <meta name="robots" content="index, follow" />
        <meta name="author" content="Logicology Team" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta name="theme-color" content="#0A8A80" />
        <link rel="canonical" href="https://yourdomain.com/about" />

        {/* Schema.org markup for Organization */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Organization",
              name: "Logicology",
              url: "https://yourdomain.com",
              logo: "https://ik.imagekit.io/pratik11/logo.png",
              description:
                "We create engaging gamified educational content for children to develop 21st century skills through fun learning.",
              address: {
                "@type": "PostalAddress",
                streetAddress: "Ameya Towers, 25, Humpyard Road, Dhantoli",
                addressLocality: "Nagpur",
                addressRegion: "Maharashtra",
                postalCode: "440012",
                addressCountry: "IN",
              },
              contactPoint: [
                {
                  "@type": "ContactPoint",
                  telephone: "+91-8446980747",
                  contactType: "customer service",
                  email: "learn@logicology.in",
                },
              ],
              sameAs: [
                "https://www.facebook.com/logicology",
                "https://www.instagram.com/logicology",
                "https://www.linkedin.com/company/logicology",
              ],
              founders: [
                {
                  "@type": "Person",
                  name: "Gayatri Phadnis",
                  jobTitle: "Co-Founder",
                },
                {
                  "@type": "Person",
                  name: "Kartik Girish Vyas",
                  jobTitle: "Co-Founder",
                },
              ],
              foundingDate: "2020",
              foundingLocation: "Nagpur, India",
              areaServed: "Worldwide",
              knowsAbout: [
                "Educational Games",
                "STEM Education",
                "Child Development",
                "Game-Based Learning",
              ],
            }),
          }}
        />

        {/* Schema.org for Team Members */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "ItemList",
              itemListElement: [
                {
                  "@type": "Person",
                  name: "Gayatri Phadnis",
                  jobTitle: "Co-Founder",
                  worksFor: {
                    "@type": "Organization",
                    name: "Logicology",
                  },
                },
                {
                  "@type": "Person",
                  name: "Kartik Girish Vyas",
                  jobTitle: "Co-Founder",
                  worksFor: {
                    "@type": "Organization",
                    name: "Logicology",
                  },
                },
                {
                  "@type": "Person",
                  name: "Jasneet Singh Babra",
                  jobTitle: "Head of Design",
                  worksFor: {
                    "@type": "Organization",
                    name: "Logicology",
                  },
                },
                {
                  "@type": "Person",
                  name: "Pratik Kumar Jha",
                  jobTitle: "Head of Technology",
                  worksFor: {
                    "@type": "Organization",
                    name: "Logicology",
                  },
                },
              ],
            }),
          }}
        />
      </Head>
      <main className="min-h-screen bg-brand-hero">
        <NavBar />
        <Hero />
        <OurStory />
        <OurVision />

        <OurTeam />
        <ContactUs />
        <Community />
        <Footer />
      </main>
    </>
  );
}

/* --------------------- Hero (Video instead of Swiper) --------------------- */
// Extend the type definitions for cross-browser support
interface ExtendedHTMLVideoElement extends HTMLVideoElement {
  webkitEnterFullscreen?: () => void;
  webkitRequestFullscreen?: () => Promise<void>;
}

interface ExtendedDocument extends Document {
  webkitExitFullscreen?: () => Promise<void>;
  webkitFullscreenElement?: Element;
}

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
      pretitle: "About Us",
      title: "Learn to Play.",
      subtitle: "Play to Learn.",
      description:
        "A small team with a simple belief: children learn best when they're genuinely having fun.",
    },
  ];

  return (
    <>
      <style>{``}</style>

      {/* ── OUTER WRAPPER ── */}
      <section className="section my-10">
        <div className="container-padding">
          <div className="section-rounded relative overflow-hidden">

            {/* ── DESKTOP LAYOUT ── */}
            <div
              className="relative hidden w-full overflow-hidden md:flex"
              style={{
                backgroundColor: "#1aaa8a", // brand teal
                minHeight: 680,
              }}
            >
              <div className="flex min-h-[680px] w-full items-center">
                {/* Left — Text block */}
                <div className="relative z-20 flex flex-1 flex-col justify-center py-12 pl-[6vw] pr-4">
                  <motion.p
                    className="mb-2 text-[20px] font-semibold text-white uppercase tracking-widest md:text-[22px]"
                    style={{ fontFamily: "var(--font-outfit), sans-serif" }}
                    initial={{ y: 30, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                  >
                    {slides[0].pretitle}
                  </motion.p>

                  <motion.h1
                    className="mb-5 uppercase leading-[1.1] text-white text-[36px] md:text-[48px] lg:text-[64px]"
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
                    className="max-w-[420px] text-[18px] leading-7 text-white lg:text-[22px]"
                    style={{ fontFamily: "var(--font-outfit), sans-serif" }}
                    initial={{ y: 30, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ duration: 0.6, delay: 0.4 }}
                  >
                    {slides[0].description}
                  </motion.p>
                </div>

                {/* Right — Circle + hero image */}
                <div className="relative z-10 flex flex-1 items-center justify-center py-8 pr-[3vw]">
                  <div
                    className="relative flex items-center justify-center rounded-full overflow-hidden"
                    style={{
                      width: "clamp(340px, 38vw, 520px)",
                      height: "clamp(340px, 38vw, 520px)",
                      border: "10px solid #fbb041",
                      boxShadow: "0 0 0 6px rgba(251,176,65,0.25)",
                    }}
                  >
                    <motion.img
                      src="https://ik.imagekit.io/pratik11/PRIME-TIME-IMAGE-NEW.png"
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
                backgroundColor: "#1aaa8a", // brand teal
                minHeight: 680,
              }}
            >
              {/* Circle + hero image */}
              <div
                className="relative flex items-center justify-center pb-4 pt-10"
                style={{ minHeight: 300 }}
              >
                <div
                  className="relative flex items-center justify-center rounded-full overflow-hidden"
                  style={{
                    width: 260,
                    height: 260,
                    border: "8px solid #fbb041",
                    boxShadow: "0 0 0 4px rgba(251,176,65,0.25)",
                  }}
                >
                  <motion.img
                    src="https://ik.imagekit.io/pratik11/PRIME-TIME-IMAGE-NEW.png"
                    alt="Prime Time Game"
                    className="object-cover"
                    style={{ width: "100%", height: "100%", position: "relative", zIndex: 5 }}
                    initial={{ scale: 0.85, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                  />
                </div>
              </div>

              {/* Text */}
              <div className="relative z-20 flex flex-col items-center px-6 pb-20 pt-2 text-center">
                <motion.p
                  className="mb-1 text-[16px] font-semibold uppercase tracking-widest text-white"
                  style={{ fontFamily: "var(--font-outfit), sans-serif" }}
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ duration: 0.5, delay: 0.3 }}
                >
                  {slides[0].pretitle}
                </motion.p>

                <motion.h1
                  className="mb-4 uppercase leading-[1.15] text-white text-[32px] md:text-[44px]"
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
                  className="max-w-[300px] text-[15px] leading-relaxed text-white"
                  style={{ fontFamily: "var(--font-outfit), sans-serif" }}
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ duration: 0.5, delay: 0.5 }}
                >
                  {slides[0].description}
                </motion.p>
              </div>
            </div>
          </div>
          {/* end section-rounded */}
        </div>
        {/* end container-padding */}
      </section>
    </>
  );
}
/* --------------------- Our Story (Gold) --------------------- */
function OurStory() {
  return (
    <section id="story" className="w-full bg-brand-tealDark">
      <div className="mx-auto px-4 py-14 sm:px-6 lg:max-w-[80vw] lg:px-8">
        <div className="flex flex-col items-center md:flex-row">
          <div className="order-1 flex w-full items-center justify-center py-6 md:order-1 md:w-1/2 md:py-0">
            <VideoLayout videoSrc="https://res.cloudinary.com/deunonql5/video/upload/v1759543919/Logicology_JourneyVideo_Compressed_1_iwbg1f.mp4" />
          </div>

          <div className="order-2 w-full px-4 py-8 sm:p-12 md:order-2 md:w-1/2">
            <h2 className="headingstyle font-heading font-extrabold leading-tight text-white">
              Our Story
            </h2>

            <p className="textstyles mt-3 max-w-xl font-sans text-white">
              Logicology began with a simple observation: children learn more when they're engaged,
              curious and eager to keep going.
              <br />
              That belief led us to create games and books that develop real skills through play.
              Whether it's logic, problem-solving, mathematical thinking or creativity, our goal has
              always been the same—to make big ideas approachable, meaningful and enjoyable.
              <br />
              What started as a single idea has grown into a family of products finding homes in
              classrooms, living rooms and everywhere in between.
            </p>

            {/* <div className="mt-6">
              <CTAButton
                text="View our journey"
                href="#story"
                bg="#FFFFFF"
                color="#7E5C2E"
                hoverBg="#7E5C2E"
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
            </div> */}
          </div>
        </div>
      </div>
    </section>
  );
}

/* --------------------- Our Team (Coral) --------------------- */
function OurTeam() {
  const teamMembers = [
    {
      name: "Gayatri Phadnis",
      role: "Co-Founder",
      image: "https://ik.imagekit.io/pratik11/1.png?updatedAt=1758540542961",
      bio: "Creative force behind Logicology’s content. Leads innovation, strategy, and development with a parent’s perspective.",
    },
    {
      name: "Kartik Girish Vyas",
      role: "Co-Founder",
      image: "https://ik.imagekit.io/pratik11/4.png?updatedAt=1758540542961",
      bio: "Marketing and partnerships lead. A teacher at heart who refines ideas and drives community growth.",
    },
    {
      name: "Jasneet Singh Babra",
      role: "Head of Design",
      image: "https://ik.imagekit.io/pratik11/3.png?updatedAt=1758540542961",
      bio: "Owns all design projects at Logicology. Brings sleek, modern visuals across books, games, and digital media.",
    },
    {
      name: "Pratik Kumar Jha",
      role: "Head of Technology",
      image: "https://ik.imagekit.io/pratik11/3.png?updatedAt=1758540542961",
      bio: "Drives the entire tech stack—from website and e-shop to interactive games and modules.",
    },

    {
      name: "Gauri Bhople",
      role: "Designer",
      image: "https://ik.imagekit.io/pratik11/1.png?updatedAt=1758540542961",
      bio: "We’re always on the lookout for passionate designers to join Logicology’s creative journey.",
    },
    {
      name: "You could be the next!",
      role: "",
      image: "https://ik.imagekit.io/pratik11/2.png?updatedAt=1758540542961",
      bio: "",
    },
  ];

  const [active, setActive] = useState<number | null>(null);

  useEffect(() => {
    const onEsc = (e: KeyboardEvent) => e.key === "Escape" && setActive(null);
    if (active !== null) {
      document.addEventListener("keydown", onEsc);
      document.body.style.overflow = "hidden";
    }
    return () => {
      document.removeEventListener("keydown", onEsc);
      document.body.style.overflow = "unset";
    };
  }, [active]);

  return (
    <section className="relative w-full bg-brand-coral">
      <div className="mx-auto px-4 py-14 sm:px-6 lg:max-w-[80vw] lg:px-8">
        <div className="grid items-center gap-10 md:grid-cols-[1.1fr,1fr]">
          <div className="px-0 sm:px-8">
            <h2 className="headingstyle font-heading font-extrabold text-white/90">
              Meet Our Team
            </h2>

            <p className="textstyles mt-3 max-w-prose text-white/90">
              Our team is an eclectic mix of personnel whose passion is their profession. In
              addition to these full-time members we engage with multiple contract associates to
              deliver world-class content for our&nbsp;stakeholders.
            </p>

            <div className="mt-6">
              <CTAButton
                text="View all team members"
                href="/about/teamMembers"
                bg="#fbb041"
                color="#3d3b40"
                hoverBg="#fa9e15"
                hoverColor="#3d3b40"
                roundedClass="rounded-full"
                size="md"
                className="font-medium transition-colors"
                ariaLabel="View team members"
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

          <div className="rounded-2xl bg-white p-4 shadow-soft sm:rounded-3xl sm:p-6">
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 md:gap-5">
              {teamMembers.map((m, i) => (
                <button
                  key={i}
                  onClick={() => setActive(i)}
                  className="group relative aspect-square w-full overflow-hidden rounded-lg bg-gray-100 ring-1 ring-gray-200 transition-transform duration-200 hover:scale-[1.02] active:scale-[0.98] sm:rounded-xl"
                  aria-label={`Open profile: ${m.name}`}
                >
                  <img
                    src={m.image}
                    alt={m.name}
                    className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 flex items-end bg-black/0 transition-all duration-300 group-hover:bg-black/10">
                    <div className="w-full bg-gradient-to-t from-black/80 via-black/40 to-transparent p-2">
                      <p className="truncate text-xs font-semibold text-white sm:text-sm">
                        {m.name}
                      </p>
                      <p className="truncate text-[11px] text-white/80 sm:text-xs">{m.role}</p>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {active !== null && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4 backdrop-blur-sm">
          <div className="relative mx-4 w-full max-w-2xl">
            <button
              onClick={() => setActive(null)}
              className="absolute -top-12 right-0 z-10 rounded-full bg-white/20 p-2 transition-colors hover:bg-white/30"
              aria-label="Close profile"
            >
              <svg
                className="h-6 w-6 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
            <div className="rounded-2xl bg-white p-6">
              <img
                src={teamMembers[active].image}
                alt={teamMembers[active].name}
                className="mx-auto mb-4 h-32 w-32 rounded-full object-cover"
              />
              <h3 className="text-center text-2xl font-bold text-gray-900">
                {teamMembers[active].name}
              </h3>
              <p className="mb-4 text-center text-gray-600">{teamMembers[active].role}</p>
              <p className="text-center text-gray-700">{teamMembers[active].bio}</p>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}

/* --------------------- Our Vision (Gray) --------------------- */
function OurVision() {
  const cards = [
    {
      title: "Vision",
      text: "To build a world where learning feels less like work and more like discovery.",
      bg: "bg-brand-teal",       // teal
      circleBg: "bg-brand-teal",
      icon: "https://ik.imagekit.io/pratik11/OUR%20VISION%20ICONS/VISSION.svg"
    },
    {
      title: "Mission",
      text: "To create world-class games, books and learning experiences that turn big ideas into child's play. Made in India. Built for curious minds everywhere. patterns begin to make sense naturally, without ever feeling like a maths lesson.",
      bg: "bg-brand-buttonYellowBefore",       // amber/yellow
      circleBg: "bg-brand-buttonYellowBefore",
      icon: "https://ik.imagekit.io/pratik11/OUR%20VISION%20ICONS/MISSION.svg"
    },
    {
      title: "Goal",
      text: "To build the world's most loved fun-learning brand—creating products that children enjoy, parents trust and educators value.",
      bg: "bg-brand-coral",       // orange-red
      circleBg: "bg-brand-coral",
      icon: "https://ik.imagekit.io/pratik11/OUR%20VISION%20ICONS/GOAL.svg"
    },
  ];

  return (
    <section id="vision" className="w-full bg-white py-16">
      <div className="mx-auto px-3 sm:px-5 lg:max-w-[80vw]">
        <div className="mb-16 text-center">
          <h2 className="headingstyle mb-2 font-extrabold text-brand-black">Our Vision</h2>
        </div>

        <div className="grid gap-8 md:grid-cols-3">
          {cards.map((card) => (
            <div key={card.title} className="flex flex-col items-center">
              {/* Card */}
              <div className={`relative w-full rounded-3xl ${card.bg} flex flex-col items-center px-8 pb-20 pt-10 min-h-[380px]`}>
                <h3 className="mb-4 text-2xl font-bold text-brand-black">{card.title}</h3>
                <p className="text-center textstyles text-[20px] text-brand-black">{card.text}</p>

                {/* Circle icon — half outside bottom */}
                {/* Circle icon — half outside bottom */}
<div className={`absolute -bottom-12 left-1/2 -translate-x-1/2 flex h-24 w-24 items-center justify-center rounded-full ${card.circleBg} border-4 border-white shadow-lg`}>
  <img src={card.icon} alt={card.title} className="h-12 w-12" />
</div>
              </div>

              {/* Spacer for the protruding circle */}
              <div className="h-14" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* --------------------- Contact Us (Maroon) --------------------- */
function ContactUs() {
  return (
    <section className="w-full bg-brand-buttonYellowBefore">
      <div className="mx-auto px-4 py-14 sm:px-6 lg:max-w-[80vw] lg:px-8">
        <div className="grid items-center gap-10 md:grid-cols-2">
          {/* Left: text & contact details */}
          <div className="text-brand-black">
            <h2 className="headingstyle mb-10 font-extrabold">Contact Us</h2>

            <ul className="space-y-8">
              {/* Phone */}
              <li className="flex items-center gap-5">
                <span className="flex h-16 w-16 items-center justify-center rounded-full bg-white/10 ring-1 ring-white/30">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-7 w-7"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.8}
                      d="M3 5a2 2 0 012-2h1.2a1 1 0 01.95.684l1.2 3.272a1 1 0 01-.27 1.07L7.9 9.93a14.5 14.5 0 006.17 6.17l1.905-1.18a1 1 0 011.07-.27l3.272 1.2A1 1 0 0121 17.8V19a2 2 0 01-2 2h-.5C9.492 21 3 14.508 3 6.5V6a2 2 0 010-1z"
                    />
                  </svg>
                </span>
                <a
                  href="tel:+918446980747"
                  className="text-xl font-semibold leading-tight hover:underline"
                >
                  +91 8446980747
                </a>
              </li>

              {/* Email */}
              <li className="flex items-center gap-5">
                <span className="flex h-16 w-16 items-center justify-center rounded-full bg-white/10 ring-1 ring-white/30">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-7 w-7"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.8}
                      d="M3 8l9 6 9-6M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                    />
                  </svg>
                </span>
                <a
                  href="mailto:learn@logicology.in"
                  className="text-xl font-semibold leading-tight hover:underline"
                >
                  learn@logicology.in
                </a>
              </li>

              {/* Address */}
              <li className="flex items-start gap-5">
                <span className="mt-1 flex h-16 w-16 items-center justify-center rounded-full bg-white/10 ring-1 ring-white/30">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-7 w-7"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.8}
                      d="M12 11a3 3 0 100-6 3 3 0 000 6zm0 0c4.418 0 8 3.134 8 7a1 1 0 01-1 1H5a1 1 0 01-1-1c0-3.866 3.582-7 8-7z"
                    />
                  </svg>
                </span>
                <p className="text-xl font-semibold leading-snug">
                  Regd Office: Ameya Towers, 25,
                  <br />
                  Humpyard Road, Dhantoli,
                  <br />
                  Nagpur, India – 440012
                </p>
              </li>
            </ul>

            <p className="mt-10 max-w-xl text-sm text-brand-black">
              We operate fully online. Our registered office is used for official communication and
              correspondence.
            </p>
          </div>

          {/* Right: framed collage */}
          <div className="flex items-center justify-center">
            <MediaLayout
              image="https://ik.imagekit.io/pratik11/CONTACT-US-SECTION-IMAGE.png"
              videoSrc=""
            />
          </div>
        </div>
      </div>
    </section>
  );
}

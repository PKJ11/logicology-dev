"use client";
import React, { useEffect, useState, useRef } from "react";
import NavBar from "@/components/NavBar";
import Footer from "@/components/Footer";
import CTAButton from "@/components/CTAButton";
import MediaLayout from "@/components/MediaLayout";
import Tribe from "@/components/Tribe";

export default function AboutUs() {
  return (
    <main className="min-h-screen bg-brand-hero">
      <NavBar />
      <HeroVideo />
      <OurStory />
      <OurTeam />
      <OurVision />
      <Tribe />
      <Footer />
    </main>
  );
}

/* --------------------- Hero (Video instead of Swiper) --------------------- */
function HeroVideo() {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [isMuted, setIsMuted] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  const toggleFullscreen = () => {
    if (!videoRef.current) return;
    if (!document.fullscreenElement) {
      videoRef.current.requestFullscreen?.();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen?.();
      setIsFullscreen(false);
    }
  };

  return (
    <section className="w-full bg-white">
      <div className="px-3 sm:px-5 pt-4">
        <div className="relative rounded-[28px] bg-white p-2">
          <div className="relative rounded-[22px] overflow-hidden">
            <video
              ref={videoRef}
              autoPlay
              loop
              playsInline
              muted={isMuted}
              className="w-full h-[90vh] sm:h-[62vh] sm:min-h-[420px] sm:max-h-[780px] object-cover"
            >
              <source
                src="https://ik.imagekit.io/pratik2002/Logicoland%201_3.mp4?updatedAt=1755475486495"
                type="video/mp4"
              />
            </video>

            {/* gradient under text */}
            <div className="absolute inset-0 z-10 bg-gradient-to-r from-black/55 via-black/35 to-transparent" />

            {/* centered overlay content */}
            <div className="absolute inset-0 z-20 flex items-start sm:items-center">
              <div className="mx-auto w-[75vw] max-w-[75vw] px-6 sm:px-10 py-8 sm:py-14 text-white">
                <p className="textstyles mb-3">Empowering Minds</p>
                <h1 className="headingstyle font-extrabold leading-tight">
                  Through STEM Play
                  <br /> and Logic-Based Learning
                </h1>
                <p className="textstyles mt-4 max-w-md text-white/90">
                  At Logicology we endeavour to make learning fun so that
                  children learn while they play.
                </p>
                <div className="mt-6">
                  <CTAButton
                    text="Learn More"
                    href="#vision"
                    bg="#FFFFFF"
                    color="#0A8A80"
                    hoverBg="#0A8A80"
                    hoverColor="#FFFFFF"
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

            {/* Controls (bottom-right) */}
            <div className="absolute bottom-4 right-4 z-30 flex items-center gap-2">
              {/* Mute/Unmute */}
              <button
                onClick={toggleMute}
                className="bg-black/50 hover:bg-black/70 text-white p-2 rounded-full"
                aria-label={isMuted ? "Unmute video" : "Mute video"}
              >
                {isMuted ? (
                  // Muted icon
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M9 9l6 6M15 9l-6 6M5 9v6h4l5 5V4l-5 5H5z"
                    />
                  </svg>
                ) : (
                  // Unmuted icon
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M11 5L6 9H3v6h3l5 4V5z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M15.54 8.46a5 5 0 010 7.07m2.83-9.9a9 9 0 010 12.73"
                    />
                  </svg>
                )}
              </button>

              {/* Fullscreen */}
              <button
                onClick={toggleFullscreen}
                className="bg-black/50 hover:bg-black/70 text-white p-2 rounded-full"
                aria-label={
                  isFullscreen ? "Exit fullscreen" : "Enter fullscreen"
                }
              >
                {!isFullscreen ? (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M4 8h4V4m12 4h-4V4M4 16h4v4m12-4h-4v4"
                    />
                  </svg>
                ) : (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M6 16h12v4H6zm4-4V8m0 0H6m4 0h4"
                    />
                  </svg>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* --------------------- Our Story (Gold) --------------------- */
function OurStory() {
  return (
    <section className="w-full bg-brand-gold">
      <div className="lg:max-w-[80vw] mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="flex flex-col md:flex-row items-center">
          <div className="w-full md:w-1/2 order-1 md:order-1 flex justify-center items-center py-6 md:py-0">
            <MediaLayout
              image="https://ik.imagekit.io/pratik2002/ChatGPT%20Image%20Aug%2018,%202025,%2005_37_03%20AM.png?updatedAt=1755475680524"
              videoSrc="https://ik.imagekit.io/pratik2002/Prime%20Numbers%20(Reel%202)_1.mp4?updatedAt=1756253537445"
            />
          </div>

          <div className="w-full md:w-1/2 py-8 px-4 sm:p-12 order-2 md:order-2">
            <h2 className="headingstyle leading-tight text-[#3F2F14] font-extrabold font-heading">
              Our Story
            </h2>

            <p className="mt-3 textstyles text-[#3F2F14] max-w-xl font-sans">
              We believe that children learn the most when they are engaged. At
              Logicology we strive to create innovative gamified content to help
              children develop 21st&nbsp;century&nbsp;skills.
            </p>

            <div className="mt-6">
              <CTAButton
                text="Read our journey"
                href="#story"
                bg="#FFFFFF"
                color="#7E5C2E"
                hoverBg="#7E5C2E"
                hoverColor="#FFFFFF"
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

/* --------------------- Our Team (Coral) --------------------- */
function OurTeam() {
  const teamMembers = [
    {
      name: "Kartik Vyas",
      role: "Co-Founder",
      image: "https://ik.imagekit.io/pratik2002/kartik.jpg?updatedAt=1758090824010",
    },
    {
      name: "Gayatri Phadnis",
      role: "Co-Founder",
      image: "https://ik.imagekit.io/pratik2002/team-gayatri.jpg",
    },
    {
      name: "Jasneet Singh",
      role: "Head of Design",
      image: "https://ik.imagekit.io/pratik2002/team-jasneet.jpg",
    },
    {
      name: "Pratik Kumar Jha",
      role: "Head of Technology",
      image: "https://ik.imagekit.io/pratik2002/team-pratik.jpg",
    },
    {
      name: "Simran Kaur",
      role: "Designer",
      image: "https://ik.imagekit.io/pratik2002/team-simran.jpg",
    },
    {
      name: "Gauri Bhopale",
      role: "Designer",
      image: "https://ik.imagekit.io/pratik2002/team-gauri.jpg",
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
    <section className="w-full bg-brand-coral relative">
      <div className="lg:max-w-[80vw] mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid md:grid-cols-[1.1fr,1fr] gap-10 items-center">
          <div className="px-0 sm:px-8">
            <h2 className="headingstyle text-white/90 font-extrabold font-heading">
              Meet Our Team
            </h2>

            <p className="mt-3 textstyles text-white/90 max-w-prose">
              Our team is an eclectic mix of personnel whose passion is their
              profession. In addition to these full-time members we engage with
              multiple contract associates to deliver world-class content for
              our&nbsp;stakeholders.
            </p>

            <div className="mt-6">
              <CTAButton
                text="View all team members"
                href="/about/teamMembers"
                bg="#FFFFFF"
                color="#AB4637"
                hoverBg="rgba(0,0,0,0.25)"
                hoverColor="#FFFFFF"
                roundedClass="rounded-full"
                size="md"
                className="font-medium transition-colors"
                ariaLabel="View team members"
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

          <div className="bg-white rounded-2xl sm:rounded-3xl p-4 sm:p-6 shadow-soft">
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4 md:gap-5">
              {teamMembers.map((m, i) => (
                <button
                  key={i}
                  onClick={() => setActive(i)}
                  className="relative aspect-square w-full
                   rounded-lg sm:rounded-xl overflow-hidden bg-gray-100 ring-1 ring-gray-200 group
                   transition-transform duration-200 hover:scale-[1.02] active:scale-[0.98]"
                  aria-label={`Open profile: ${m.name}`}
                >
                  <img
                    src={m.image}
                    alt={m.name}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-all duration-300 flex items-end">
                    <div className="p-2 w-full bg-gradient-to-t from-black/80 via-black/40 to-transparent">
                      <p className="text-white text-xs sm:text-sm font-semibold truncate">
                        {m.name}
                      </p>
                      <p className="text-white/80 text-[11px] sm:text-xs truncate">
                        {m.role}
                      </p>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {active !== null && (
        <div className="fixed inset-0 bg-black/90 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
          <div className="relative max-w-2xl w-full mx-4">
            <button
              onClick={() => setActive(null)}
              className="absolute -top-12 right-0 bg-white/20 rounded-full p-2 hover:bg-white/30 transition-colors z-10"
              aria-label="Close profile"
            >
              <svg
                className="w-6 h-6 text-white"
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
            <div className="bg-white rounded-2xl p-6">
              <img
                src={teamMembers[active].image}
                alt={teamMembers[active].name}
                className="w-32 h-32 rounded-full mx-auto mb-4 object-cover"
              />
              <h3 className="text-2xl font-bold text-center text-gray-900">
                {teamMembers[active].name}
              </h3>
              <p className="text-gray-600 text-center mb-4">
                {teamMembers[active].role}
              </p>
              <p className="text-gray-700 text-center">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do
                eiusmod tempor incididunt ut labore.
              </p>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}

/* --------------------- Our Vision (Gray) --------------------- */
function OurVision() {
  return (
    <section id="vision" className="w-full bg-brand-grayBg">
      <div className="lg:max-w-[80vw] mx-auto px-3 sm:px-5 py-12 sm:py-16 md:py-20">
        <div className="rounded-[22px] bg-white p-6 sm:p-10 shadow-soft">
          <div className="text-center mb-12">
            <h2 className="headingstyle font-extrabold text-brand-teal mb-2">
              Our Vision
            </h2>
            <p className="textstyles font-semibold text-brand-tealDark/90">
              Learn to Play — Play to Learn
            </p>
            <p className="textstyles text-brand-tealDark/80 max-w-3xl mx-auto mt-4">
              At Logicology, our vision is to create engaging gamified content
              that teaches children concepts. We believe if the children have
              fun while learning, they learn in a much better way. Each of our
              books and games aims at helping children learn real-life
              concepts/skills through a gamified, fun-learning way.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {/* Mission (left) */}
            <div className="bg-white rounded-4xl p-6 shadow-soft">
              <h3 className="text-xl font-bold text-brand-teal mb-3">
                Mission
              </h3>
              <div className="rounded-3xl bg-brand-grayBg p-5">
                <p className="text-lg text-gray-700">
                  To create world class educational content that is engaging,
                  gamified and concept based. Our mission is to make top class
                  educational content that is made in India,
                  made&nbsp;for&nbsp;the&nbsp;world.
                </p>
              </div>
            </div>

            {/* Goal (right) */}
            <div className="bg-white rounded-4xl p-6 shadow-soft">
              <h3 className="text-xl font-bold text-brand-teal mb-3">Goal</h3>
              <div className="rounded-3xl bg-brand-grayBg p-5">
                <p className="text-lg text-gray-700">
                  Our goal is to create a world class brand of educational
                  products that focuses on fun learning. We want to develop best
                  in class educational content for children that is fun
                  and&nbsp;easy&nbsp;to&nbsp;learn.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

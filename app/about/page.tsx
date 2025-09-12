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

export default function AboutUs() {
  return (
    <main className="min-h-screen bg-brand-hero">
      <NavBar />
      <Hero />
      <OurStory />
      <OurTeam />
      <OurMission />
      {/* <Values /> */}
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
      pretitle: "Welcome to Our Story",
      title: "Where passion meets purpose",
      subtitle: "and innovation drives impact.",
      description:
        "We are a dedicated team committed to creating meaningful experiences through education, technology, and creative solutions that make a difference in people's lives.",
      image:
        "https://images.unsplash.com/photo-1570126646281-5ec88111777f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwxMjA3fDB8MXxzZWFyY2h8NHx8Y29uZmVyZW5jZSUyMHJvb218fDB8fHx8MTYyOTI4OTM0Mw&ixlib=rb-1.2.1&q=80&w=1080",
      cta: "Learn our story",
      ctaLink: "/about",
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
                  <div className="lg:mx-auto lg:w-[75vw] lg:max-w-[75vw] md:mx-auto md:w-[75vw] md:max-w-[75vw]">
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

// --------------------- Our Story (Gold) ---------------------
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
              Founded with a vision to transform education through innovation, 
              our journey began with a simple belief: learning should be engaging, 
              accessible, and transformative for everyone.
            </p>
            <div className="mt-6">
              <CTAButton
                text="Read our journey"
                href=""
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

// --------------------- Our Team (Coral) ---------------------
function OurTeam() {
  const teamMembers = [
    {
      name: "John Doe",
      role: "Founder & CEO",
      image: "https://ik.imagekit.io/pratik2002/team1.jpg?updatedAt=1756264541926"
    },
    {
      name: "Jane Smith",
      role: "Creative Director",
      image: "https://ik.imagekit.io/pratik2002/team2.jpg?updatedAt=1756264541926"
    },
    {
      name: "Mike Johnson",
      role: "Lead Developer",
      image: "https://ik.imagekit.io/pratik2002/team3.jpg?updatedAt=1756264541926"
    },
    {
      name: "Sarah Wilson",
      role: "Education Specialist",
      image: "https://ik.imagekit.io/pratik2002/team4.jpg?updatedAt=1756264541926"
    },
    {
      name: "David Brown",
      role: "Product Manager",
      image: "https://ik.imagekit.io/pratik2002/team5.jpg?updatedAt=1756264541926"
    },
    {
      name: "Emily Davis",
      role: "Content Creator",
      image: "https://ik.imagekit.io/pratik2002/team6.jpg?updatedAt=1756264541926"
    },
  ];

  const [active, setActive] = useState<number | null>(null);

  const handleMemberClick = (index: number) => {
    setActive(index);
  };

  const handleCloseModal = () => {
    setActive(null);
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
    <section className="w-full bg-brand-coral relative">
      <div className="lg:max-w-[80vw] mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid md:grid-cols-[1.1fr,1fr] gap-10 items-center">
          <div className="px-0 sm:px-8">
            <h2 className="headingstyle text-white/90 font-extrabold font-heading">
              Meet Our Team
            </h2>

            <p className="mt-3 textstyles text-white/90 max-w-prose">
              Passionate individuals dedicated to creating exceptional learning 
              experiences and driving innovation in education.
            </p>

            <div className="mt-6">
              <CTAButton
                text="View all team members"
                href="#team"
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

          <div className="bg-white rounded-4xl p-4 sm:p-0 md:p-5 shadow-soft">
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 sm:gap-2 md:gap-4">
              {teamMembers.map((member, i) => (
                <div
                  key={i}
                  onClick={() => handleMemberClick(i)}
                  className="relative aspect-square min-h-[120px] sm:min-h-[140px] md:min-h-[160px]
                   rounded-xl overflow-hidden bg-gray-100 ring-1 ring-gray-200
                   cursor-pointer group"
                >
                  <img
                    src={member.image}
                    alt={member.name}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-black/10 group-hover:bg-black/20 transition-all flex items-end">
                    <div className="p-2 w-full bg-gradient-to-t from-black/80 to-transparent">
                      <p className="text-white text-xs font-semibold truncate">{member.name}</p>
                      <p className="text-white/80 text-xs truncate">{member.role}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {active !== null && (
        <div className="fixed inset-0 bg-black/90 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
          <div className="relative max-w-2xl w-full mx-4">
            <button
              onClick={handleCloseModal}
              className="absolute -top-12 right-0 bg-white/20 rounded-full p-2 hover:bg-white/30 transition-colors z-10"
            >
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            <div className="bg-white rounded-2xl p-6">
              <img
                src={teamMembers[active].image}
                alt={teamMembers[active].name}
                className="w-32 h-32 rounded-full mx-auto mb-4 object-cover"
              />
              <h3 className="text-2xl font-bold text-center text-gray-900">{teamMembers[active].name}</h3>
              <p className="text-gray-600 text-center mb-4">{teamMembers[active].role}</p>
              <p className="text-gray-700 text-center">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore.
              </p>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}

// --------------------- Our Mission (Gray) ---------------------
function OurMission() {
  return (
    <section className="w-full bg-brand-grayBg">
      <div className="lg:max-w-[80vw] mx-auto px-3 sm:px-5 py-12 sm:py-16 md:py-20">
        <div className="rounded-[22px] bg-white p-6 sm:p-10 shadow-soft">
          <div className="text-center mb-12">
            <h2 className="headingstyle font-extrabold text-brand-teal mb-4">
              Our Mission
            </h2>
            <p className="textstyles text-brand-tealDark/80 max-w-3xl mx-auto">
              To revolutionize education by creating engaging, accessible, and transformative 
              learning experiences that empower individuals to reach their full potential.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-white rounded-4xl p-6 shadow-soft">
              <h3 className="text-xl font-bold text-brand-teal mb-4 text-center">
                Vision
              </h3>
              <div className="aspect-video bg-brand-grayBg rounded-3xl flex items-center justify-center">
                <p className="text-lg text-gray-700 text-center p-4">
                  A world where everyone has access to quality education that 
                  inspires curiosity, fosters creativity, and builds confidence.
                </p>
              </div>
            </div>

            <div className="bg-white rounded-4xl p-6 shadow-soft">
              <h3 className="text-xl font-bold text-brand-teal mb-4 text-center">
                Impact
              </h3>
              <div className="aspect-video bg-brand-grayBg rounded-3xl flex items-center justify-center">
                <p className="text-lg text-gray-700 text-center p-4">
                  Reaching thousands of learners worldwide with innovative 
                  educational solutions that make learning enjoyable and effective.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

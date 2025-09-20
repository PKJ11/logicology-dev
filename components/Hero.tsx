"use client";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination, Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import Link from "next/link";
import { useRouter } from "next/navigation";
import CTAButton from "./CTAButton";
import { useState, useEffect } from "react";

export default function Hero() {
  const router = useRouter();
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
      pretitle: "Welcome to Logicology",
      title: "Learn to Play",
      subtitle: "Play to Learn",
      description:
        "At Logicology we endeavour to make learning fun so that children learn while they play.",
      image: {
        desktop:
          "https://ik.imagekit.io/pratik2002/LOGICOLOGY-WEBSITE-DESIGN-SLIDER-1.png?updatedAt=1756275673250",
        mobile:
          "https://ik.imagekit.io/pratik11/LOGICOLOGIC-WEB-PAGE-SLIDER-2-FOR-MOBILE.png?updatedAt=1758289596077",
      },
      cta: "Learn more",
      ctaLink: "/philosophy",
    },
    {
      id: 2,
      pretitle: "",
      title: "Conceptual Understanding",
      subtitle: "Through Engaging Content",
      description:
        "In an AI-powered world deep conceptual understanding gives humans a chance. Develop it through our highly engaging fun learning content.",
      image: {
        desktop:
          "https://ik.imagekit.io/pratik11/LOGICOLOGIC-WEB-PAGE-SLIDER-2-FOR-DESKTOP.png?updatedAt=1758289595445",
        mobile:
          "https://ik.imagekit.io/pratik11/LOGICOLOGIC-WEB-PAGE-SLIDER-2-FOR-MOBILE.png?updatedAt=1758289596077",
      },
      cta: "Explore",
      ctaLink: "/concepts",
    },
    {
      id: 3,
      pretitle: "",
      title: "AI Proof Your Children",
      subtitle: "With 21st Century Skills",
      description:
        "Our content focuses on 21st century skills like Logical Reasoning, Problem Solving, Lateral Thinking etc.",
      image: {
        desktop:
          "https://ik.imagekit.io/pratik2002/LOGICOLOGY-WEBSITE-DESIGN-SLIDER-1.png?updatedAt=1756275673250",
        mobile:
          "https://ik.imagekit.io/pratik11/LOGICOLOGIC-WEB-PAGE-SLIDER-2-FOR-MOBILE.png?updatedAt=1758289596077",
      },
      cta: "Get Started",
      ctaLink: "/skills",
    },
  ];

  return (
    <section className="section mt-10">
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

"use client";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination, Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function Hero() {
  const router = useRouter();
  const slides = [
    {
      id: 1,
      pretitle: "Welcome to Logicology",
      title: "Through STEM Play and",
      subtitle: "Logic-Based Learning",
      description:
        "At Logicology we endeavour to make learning fun so that children learn while they play.",
      image:
        "https://ik.imagekit.io/pratik2002/LOGICOLOGY-WEBSITE-DESIGN-SLIDER-1.png?updatedAt=1756275673250",
      cta: "Learn more",
      ctaLink: "/philosophy",
    },
  ];

  return (
    <section className="section mt-10">
      <div className="container-padding">
        <div className="section-rounded overflow-hidden relative">
          <Swiper
            spaceBetween={0}
            slidesPerView={1}
            loop={true}
            autoplay={{
              delay: 5000,
              disableOnInteraction: false,
            }}
            pagination={{
              clickable: true,
              bulletClass: "custom-bullet",
              bulletActiveClass: "custom-bullet-active",
              renderBullet: function (index, className) {
                return `<span class="${className}"><i></i></span>`;
              },
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
                {/* Full background image container with zoom effect */}
                <div
                  className="absolute inset-0 z-0 flex items-center justify-center"
                  style={{
                    backgroundImage: `url('${slide.image}')`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                    backgroundRepeat: "no-repeat",
                    transform: "scale(1)", // This creates the zoom effect
                  }}
                ></div>

                {/* Semi-transparent overlay for better text readability */}
                {/* <div className="absolute inset-0 bg-black/40 z-1"></div> */}

                <div className="grid md:grid-cols-2 gap-6 items-center relative z-10 min-h-[700px]">
                  <div className="p-8 sm:p-12">
                    <p className="text-white font-semibold text-sm sm:text-base tracking-wide">
                      {slide.pretitle}
                    </p>
                    <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mt-2 text-white">
                      {slide.title}
                      <span className="block text-white">
                        {slide.subtitle}
                      </span>
                    </h1>
                    <p className="text-white mt-4 text-base sm:text-lg max-w-md">
                      {slide.description}
                    </p>
                    <div className="mt-6">
                      <Link
                        href={slide.ctaLink}
                        className="btn btn-dark inline-flex items-center group"
                      >
                        {slide.cta}
                        <svg
                          className="w-4 h-4 ml-2 transition-transform group-hover:translate-x-1"
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
                      </Link>
                    </div>
                  </div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>

          {/* Custom Navigation Arrows */}
        </div>
      </div>

      <style jsx global>{`
        .hero-swiper {
          width: 100%;
          height: 100%;
        }

        /* Ensure swiper slide takes full height */
        .hero-swiper .swiper-slide {
          height: auto;
          min-height: 700px;
          overflow: hidden; /* Prevent the zoomed image from overflowing */
        }

        /* Pagination Styles */
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

        /* Navigation Styles */
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

        /* Responsive adjustments */
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

"use client";
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination, Navigation } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';
import Image from 'next/image';
import Link from 'next/link';

export default function Hero() {
  const slides = [
    {
      id: 1,
      title: "Through STEM Play and",
      subtitle: "Logic-Based Learning",
      description: "At Logicology we endeavour to make learning fun so that children learn while they play.",
      image: "https://ik.imagekit.io/pratik2002/logicology-hero-image.png?updatedAt=1755272201669",
      cta: "Learn more"
    },
    {
      id: 2,
      title: "Interactive Learning",
      subtitle: "Through Play",
      description: "Our innovative approach combines education with entertainment for maximum engagement.",
      image: "https://ik.imagekit.io/pratik2002/logiology-img1.JPG?updatedAt=1755268314939",
      cta: "Discover more"
    },
    // Add more slides as needed
  ];

  return (
    <section className="section mt-10">
      <div className="container-padding">
        <div className="bg-brand-grayBg section-rounded overflow-hidden">
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
              renderBullet: (index, className) => {
                return `<span class="${className} custom-bullet"></span>`;
              },
            }}
            modules={[Autoplay, Pagination, Navigation]}
            className="hero-swiper"
          >
            {slides.map((slide) => (
              <SwiperSlide key={slide.id}>
                <div className="grid md:grid-cols-2 gap-6 items-center">
                  <div className="p-8 sm:p-12">
                    <p className="text-brand-tealDark font-semibold">Empowering Minds</p>
                    <h1 className="heading-xl mt-2">
                      {slide.title}
                      <span className="block">{slide.subtitle}</span>
                    </h1>
                    <p className="lead mt-4">{slide.description}</p>
                    <div className="mt-6">
                      <Link href="#why" className="btn btn-dark">{slide.cta}</Link>
                    </div>
                  </div>
                  <div className="relative min-h-[320px] md:min-h-[520px]">
                    <Image
                      src={slide.image}
                      alt="Kids playing"
                      fill
                      className="object-cover"
                      priority
                    />
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
        .swiper-pagination {
          bottom: 20px !important;
        }
        .swiper-pagination-bullet {
          width: 8px;
          height: 8px;
          background: white;
          opacity: 0.5;
          transition: all 0.3s ease;
        }
        .swiper-pagination-bullet-active {
          opacity: 1;
          background: transparent;
          border: 2px solid white;
          width: 12px;
          height: 12px;
          position: relative;
          top: 1px;
        }
        .swiper-button-next,
        .swiper-button-prev {
          color: #3F2F14;
          background: rgba(255, 255, 255, 0.7);
          width: 40px;
          height: 40px;
          border-radius: 50%;
          display: none;
        }
        .swiper-button-next:after,
        .swiper-button-prev:after {
          font-size: 20px;
        }
        @media (min-width: 768px) {
          .swiper-button-next,
          .swiper-button-prev {
            display: flex;
          }
        }
      `}</style>
    </section>
  );
}
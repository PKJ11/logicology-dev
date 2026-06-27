// ─── TESTIMONIALS SECTION ───────────────────────────────────────────────────
// Drop-in replacement. Uses the same color tokens as the rest of the site.
// Requires: Swiper (npm i swiper), your existing useReveal hook, GoldCard, etc.
// Photos: pass the imported image (or URL string) via the `photo` field.
// ────────────────────────────────────────────────────────────────────────────

import React, { useRef, useState } from "react";
// Swiper v11 modular imports
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Navigation, Pagination } from "swiper/modules";

// ─── PASTE YOUR PHOTO IMPORTS HERE ──────────────────────────────────────────
// import swatiPhoto from "./assets/swati.jpeg";
// import chinmayPhoto from "./assets/chinmay.jpeg";
// For the demo we use placeholder strings — replace with your real imports.
const swatiPhoto = "/assets/swati.jpeg"; // Dr. Swati Jaiswal
const chinmayPhoto = "/assets/chinmay.jpeg"; // Chinmay Phadke
// ────────────────────────────────────────────────────────────────────────────

// ─── TYPE ────────────────────────────────────────────────────────────────────
interface Testimonial {
  quote: string;
  name: string;
  role: string;
  photo?: string; // URL / import — optional; falls back to initial avatar
}

// ─── DATA ────────────────────────────────────────────────────────────────────
const testimonials: Testimonial[] = [
  {
    quote:
      "As a Computer Science professor, I have always believed that logic and problem-solving should be nurtured from a very early age. When I came across Logicology, it stood out as perhaps the only summer camp that truly focuses on building these foundational skills in a structured and engaging way. My daughter thoroughly enjoyed the experience, and I was equally impressed with the depth of learning. We were both extremely satisfied with the Summer Camp 2025, and I would strongly recommend Logicology to every parent.",
    name: "Dr. Swati Jaiswal",
    role: "Computer Science Professor, VNIT",
    photo: swatiPhoto,
  },
  {
    quote:
      "As a software professional, I strongly believe that logical thinking is one of the most important skills to build early. Logicology Summer Camp was exactly what I was looking for. It's rare to find something that combines fun with deep thinking so effectively. My son Vish absolutely loved it, and I could see his confidence and problem-solving skills grow. It truly felt like a blessing.",
    name: "Chinmay Phadke",
    role: "AI Professional",
    photo: chinmayPhoto,
  },
  {
    quote:
      "As a doctor, my time is extremely limited, and I'm very mindful about how my children spend theirs. I wanted something more meaningful than the usual arts and dance camps. Logicology Summer Camp stood out immediately. While it may seem more premium than average camps, the value it delivers is truly unmatched. My child was deeply engaged, and I could see real learning happening every day. Absolutely worth it.",
    name: "Dr. Rita Bang",
    role: "Gynaecologist",
  },
  {
    quote:
      "What I loved most about Logicology Summer Camp was the incredible mix of skills it covers. It wasn't just learning — it was engaging, hands-on, and thoughtfully designed. Their original games and books are a big differentiator; this is not something you find just anywhere. It made the entire experience unique and memorable for my child.",
    name: "Sayali Bokare",
    role: "Company Secretary",
  },
  {
    quote:
      "I have twins, and I was looking for something truly different to engage them this summer. Most camps for 5–6 year olds focus only on dancing, coloring, and painting. What impressed me about Logicology was how these very activities were used in such an innovative and purposeful way. I was genuinely amazed to see my young sons pick up so much about world geography in such a short span of time. I would strongly recommend Logicology Summer Camps to any parent looking for meaningful and engaging learning.",
    name: "Dr. Chetan Rathi",
    role: "Cardiologist",
  },
  {
    quote:
      "Having recently moved back from the US, I was honestly unsure about the quality of workshops available here in Nagpur. I've had some bad experiences but Logicology was a pleasant surprise. The structure, depth, and delivery were at par with global standards. More importantly, my child learned skills that are incredibly relevant in today's world. I'm genuinely impressed and very happy with the experience.",
    name: "Ms. Meenakshi",
    role: "Architect",
  },
];

// ─── AVATAR ──────────────────────────────────────────────────────────────────
function Avatar({ photo, name }: { photo?: string; name: string }) {
  const [err, setErr] = useState(false);

  if (photo && !err) {
    return (
      <img
        src={photo}
        alt={name}
        onError={() => setErr(true)}
        style={{
          width: 56,
          height: 56,
          borderRadius: "50%",
          objectFit: "cover",
          border: "2.5px solid #D8AE4F",
          flexShrink: 0,
        }}
      />
    );
  }

  // Fallback: coloured initial circle
  return (
    <div
      style={{
        width: 56,
        height: 56,
        borderRadius: "50%",
        background: "#0B3F44",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        color: "#D8AE4F",
        fontWeight: 800,
        fontSize: 20,
        fontFamily: "'Outfit', sans-serif",
        flexShrink: 0,
        border: "2.5px solid rgba(255,255,255,0.30)",
      }}
    >
      {name[0]}
    </div>
  );
}

// ─── CARD ─────────────────────────────────────────────────────────────────────
function TestimonialCard({ t }: { t: Testimonial }) {
  return (
    <div
      className="t-card"
      style={{
        background: "rgba(255,255,255,0.38)",
        border: "1px solid rgba(255,255,255,0.55)",
        borderRadius: 20,
        padding: "32px 28px 28px",
        backdropFilter: "blur(10px)",
        WebkitBackdropFilter: "blur(10px)",
        display: "flex",
        flexDirection: "column",
        height: "100%",
        boxSizing: "border-box",
        transition:
          "transform 0.35s cubic-bezier(.34,1.56,.64,1), box-shadow 0.35s ease, background 0.25s ease",
        cursor: "default",
        willChange: "transform",
      }}
    >
      {/* Big decorative quote mark */}
      <div
        style={{
          fontFamily: "Georgia, serif",
          fontSize: 72,
          color: "#0B3F44",
          lineHeight: 0.8,
          marginBottom: 16,
          opacity: 0.18,
          userSelect: "none",
        }}
      >
        "
      </div>

      {/* Quote body */}
      <p
        style={{
          fontFamily: "'Outfit', sans-serif",
          fontSize: 15,
          color: "#2d2200",
          lineHeight: 1.75,
          margin: "0 0 28px",
          fontStyle: "italic",
          flexGrow: 1,
        }}
      >
        {t.quote}
      </p>

      {/* Divider */}
      <div
        style={{
          height: 1,
          background: "rgba(11,63,68,0.15)",
          marginBottom: 20,
        }}
      />

      {/* Author row */}
      <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
        <Avatar photo={t.photo} name={t.name} />
        <div>
          <div
            style={{
              fontFamily: "'Outfit', sans-serif",
              fontWeight: 700,
              fontSize: 15,
              color: "#2d2200",
              marginBottom: 2,
            }}
          >
            {t.name}
          </div>
          <div
            style={{
              fontFamily: "'Outfit', sans-serif",
              fontSize: 12,
              color: "rgba(45,34,0,0.60)",
              fontWeight: 500,
            }}
          >
            {t.role}
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── SECTION ─────────────────────────────────────────────────────────────────
export default function TestimonialsSection() {
  return (
    <>
      {/* Scoped styles — hover enlarge + swiper nav overrides */}
      <style>{`
        .t-card:hover {
          transform: scale(1.045) translateY(-6px) !important;
          box-shadow: 0 24px 56px rgba(11,63,68,0.18) !important;
          background: rgba(255,255,255,0.60) !important;
          z-index: 10;
          position: relative;
        }

        /* Navigation arrows */
        .t-swiper .swiper-button-prev,
        .t-swiper .swiper-button-next {
          color: #0B3F44;
          background: rgba(255,255,255,0.60);
          border: 1.5px solid rgba(255,255,255,0.70);
          border-radius: 50%;
          width: 44px;
          height: 44px;
          backdrop-filter: blur(8px);
          top: 50%;
          transform: translateY(-50%);
          transition: background 0.2s ease, box-shadow 0.2s ease;
        }
        .t-swiper .swiper-button-prev { left: 0; }
        .t-swiper .swiper-button-next { right: 0; }
        .t-swiper .swiper-button-prev:hover,
        .t-swiper .swiper-button-next:hover {
          background: rgba(255,255,255,0.85);
          box-shadow: 0 4px 16px rgba(11,63,68,0.14);
        }
        .t-swiper .swiper-button-prev::after,
        .t-swiper .swiper-button-next::after {
          font-size: 14px;
          font-weight: 900;
        }

        /* Pagination dots */
        .t-swiper .swiper-pagination-bullet {
          background: rgba(11,63,68,0.30);
          opacity: 1;
          width: 8px;
          height: 8px;
          transition: background 0.2s ease, transform 0.2s ease;
        }
        .t-swiper .swiper-pagination-bullet-active {
          background: #0B3F44;
          transform: scale(1.35);
        }

        /* Give swiper a little horizontal breathing room for the arrows */
        .t-swiper {
          padding: 12px 52px 48px !important;
        }

        /* Smooth slide height */
        .t-swiper .swiper-slide {
          height: auto;
          transition: opacity 0.3s ease;
        }
      `}</style>

      <section
        id="testimonials"
        style={{
          background: "#D8AE4F",
          padding: "100px 24px",
          overflow: "hidden",
          position: "relative",
        }}
      >
        {/* Decorative blur blobs */}
        <div
          style={{
            position: "absolute",
            bottom: -60,
            right: -60,
            width: 280,
            height: 280,
            borderRadius: "50%",
            background: "rgba(255,255,255,0.12)",
            filter: "blur(70px)",
            pointerEvents: "none",
          }}
        />
        <div
          style={{
            position: "absolute",
            top: -40,
            left: -80,
            width: 220,
            height: 220,
            borderRadius: "50%",
            background: "rgba(11,63,68,0.08)",
            filter: "blur(60px)",
            pointerEvents: "none",
          }}
        />

        <div style={{ maxWidth: 1160, margin: "0 auto", position: "relative", zIndex: 1 }}>
          {/* Header */}
          <div style={{ textAlign: "center", marginBottom: 56 }}>
            {/* <div
              style={{
                display: "inline-block",
                background: "rgba(255,255,255,0.30)",
                border: "1px solid rgba(255,255,255,0.50)",
                borderRadius: 100,
                padding: "5px 18px",
                marginBottom: 20,
                fontFamily: "'Outfit', sans-serif",
                fontSize: 12,
                fontWeight: 700,
                color: "#5a3c00",
                letterSpacing: "0.10em",
                textTransform: "uppercase",
              }}
            >
              Testimonials
            </div> */}
            <h2
              style={{
                fontFamily: "'Outfit', sans-serif",
                fontWeight: 800,
                fontSize: "clamp(28px, 4vw, 48px)",
                color: "#2d2200",
                margin: 0,
                lineHeight: 1.2,
              }}
            >
              Don't Take Our Word for It.
              <br />
              Take Theirs.
            </h2>
          </div>

          {/* Slider */}
          <Swiper
            className="t-swiper"
            modules={[Autoplay, Navigation, Pagination]}
            spaceBetween={24}
            slidesPerView={1}
            centeredSlides={false}
            loop={true}
            autoplay={{ delay: 4500, disableOnInteraction: false, pauseOnMouseEnter: true }}
            navigation={true}
            pagination={{ clickable: true }}
            breakpoints={{
              640: { slidesPerView: 1 },
              768: { slidesPerView: 2 },
              1024: { slidesPerView: 3 },
            }}
          >
            {testimonials.map((t) => (
              <SwiperSlide key={t.name}>
                <TestimonialCard t={t} />
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </section>
    </>
  );
}

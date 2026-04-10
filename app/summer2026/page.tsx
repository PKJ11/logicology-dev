"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Script from "next/script";
import Link from "next/link";
import Image from "next/image";
import SiteFooter from "@/components/Footer";

// ── Types ────────────────────────────────────────────────────────────────────
interface FormData {
  parentName: string;
  email: string;
  phone: string;
  childName: string;
  childAge: string;
  childGrade: string;
  preferredBatch: string;
  allergies: string;
  referral: string;
  consent: boolean;
}

// ── Constants ─────────────────────────────────────────────────────────────────
const BATCHES = [
  "Logicoland A — 20 Apr – 24 Apr (10:00 – 1:00)",
  "Logicoland B — 27 Apr – 1 May (10:00 – 1:00)",
  "Logicoland A — 11 May – 15 May (9:30 – 12:30)",
  "Logicoland B — 18 May – 22 May (9:30 – 12:30)",
  "Quizzing — 27 Apr – 1 May (9:30 – 10:30)",
  "Speed Maths — 4 May – 8 May (9:30 – 11:00)",
  "Logical Reasoning — 4 May – 8 May (11:00 – 12:30)",
  "Speed Maths — 18 May – 22 May (9:30 – 11:00)",
  "Logical Reasoning — 25 May – 29 May (11:00 – 12:30)",
];

const BATCH_PRICES: Record<string, number> = {
  "Logicoland A — 20 Apr – 24 Apr (10:00 – 1:00)": 2000,
  "Logicoland B — 27 Apr – 1 May (10:00 – 1:00)": 2000,
  "Logicoland A — 11 May – 15 May (9:30 – 12:30)": 2000,
  "Logicoland B — 18 May – 22 May (9:30 – 12:30)": 2000,
  "Quizzing — 27 Apr – 1 May (9:30 – 10:30)": 1000,
  "Speed Maths — 4 May – 8 May (9:30 – 11:00)": 2500,
  "Logical Reasoning — 4 May – 8 May (11:00 – 12:30)": 2500,
  "Speed Maths — 18 May – 22 May (9:30 – 11:00)": 2500,
  "Logical Reasoning — 25 May – 29 May (11:00 – 12:30)": 2500,
};

const REFERRAL_OPTIONS = [
  "Social Media",
  "Friend / Family Referral",
  "School",
  "Google Search",
  "Newspaper / Magazine",
  "Other",
];

const CAMP_FEE = 8999;
const RAZORPAY_KEY_ID = process.env.RAZORPAY_KEY_ID || "rzp_live_RNIwt54hh7eqmk";

// ── Scroll animation hook ──────────────────────────────────────────────────────
function useReveal() {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setVisible(true);
          obs.disconnect();
        }
      },
      { threshold: 0.12 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);
  return { ref, visible };
}

// ── Load Razorpay Script Dynamically ──────────────────────────────────────────
const loadRazorpayScript = (): Promise<boolean> => {
  return new Promise((resolve) => {
    if ((window as any).Razorpay) {
      resolve(true);
      return;
    }
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
};

// ── NavBar ────────────────────────────────────────────────────────────────────
function NavBar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navItems = ["Why Workshops", "Why Logicology", "Take-Aways", "How to Enroll", "FAQs","Offerings"];

  return (
    <header className="fixed top-0 left-0 right-0 z-50 border-b border-slate-200 bg-white/80 backdrop-blur">
      <div className="px-4 md:mx-auto md:max-w-[75vw] lg:mx-auto lg:max-w-[75vw] lg:px-8">
        <div className="flex justify-between py-3">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <div className="relative h-auto w-[150px]">
              <Image
                src="https://ik.imagekit.io/pratik2002/logicology-logo_74-P-ICfG?updatedAt=1756257433107"
                alt="Logicology Logo"
                width={150}
                height={60}
                className="object-contain"
              />
            </div>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden items-center gap-6 font-heading text-sm text-slate-700 md:flex">
            {navItems.map((item) => (
              <a
                key={item}
                href={`#${item.toLowerCase().replace(/\s+/g, "-")}`}
                className="relative flex items-center gap-1 py-1 text-[16px] text-[#0B3F44] transition-colors duration-200 after:absolute after:bottom-[-2px] after:left-1/2 after:h-[2px] after:w-full after:origin-center after:-translate-x-1/2 after:scale-x-0 after:rounded-full after:bg-brand-teal after:transition-transform after:duration-300 after:content-[''] hover:text-brand-teal hover:after:scale-x-100"
              >
                {item}
              </a>
            ))}
          </nav>

          {/* Right actions */}
          <div className="flex items-center gap-5 text-slate-700">
            <button
              onClick={() => setMobileMenuOpen((s) => !s)}
              className="p-2 text-2xl md:hidden"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? "✕" : "☰"}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Nav */}
      {mobileMenuOpen && (
        <div className="border-t border-slate-200 bg-white md:hidden">
          <div className="flex flex-col gap-4 px-4 py-4">
            {navItems.map((item) => (
              <a
                key={item}
                href={`#${item.toLowerCase().replace(/\s+/g, "-")}`}
                onClick={() => setMobileMenuOpen(false)}
                className="relative block py-1 text-[#0B3F44] after:absolute after:bottom-[-2px] after:left-0 after:h-[2px] after:w-0 after:bg-brand-tealDark after:transition-all after:duration-300 after:content-[''] hover:text-brand-tealDark hover:after:w-full"
              >
                {item}
              </a>
            ))}
            <a
              href="#how-to-enroll"
              onClick={() => setMobileMenuOpen(false)}
              style={{
                background: "linear-gradient(135deg, #E45C48, #c94836)",
                color: "#fff",
                padding: "12px 24px",
                borderRadius: 100,
                fontFamily: "'Outfit', sans-serif",
                fontWeight: 700,
                fontSize: 14,
                textDecoration: "none",
                boxShadow: "0 4px 16px rgba(228,92,72,0.35)",
                display: "inline-block",
                textAlign: "center",
                marginTop: 8,
              }}
            >
              Enroll Now →
            </a>
          </div>
        </div>
      )}
    </header>
  );
}

// ── Hero ──────────────────────────────────────────────────────────────────────
function HeroSection() {
  return (
    <section
      style={{
        minHeight: "100vh",
        background: "#0A8A80",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        position: "relative",
        overflow: "hidden",
        paddingTop: 80,
      }}
    >
      <div
        style={{
          position: "absolute",
          top: -120,
          right: -120,
          width: 500,
          height: 500,
          borderRadius: "50%",
          background: "rgba(216,174,79,0.12)",
          filter: "blur(60px)",
        }}
      />
      <div
        style={{
          position: "absolute",
          bottom: -80,
          left: -80,
          width: 400,
          height: 400,
          borderRadius: "50%",
          background: "rgba(228,92,72,0.10)",
          filter: "blur(60px)",
        }}
      />
      {[
        { top: "20%", left: "8%", size: 12, color: "#D8AE4F", delay: "0s" },
        { top: "70%", left: "5%", size: 8, color: "#E45C48", delay: "0.4s" },
        { top: "15%", right: "10%", size: 16, color: "#D8AE4F", delay: "0.8s" },
        { top: "80%", right: "8%", size: 10, color: "#E45C48", delay: "0.2s" },
        { top: "50%", left: "15%", size: 6, color: "#ffffff", delay: "1.2s" },
      ].map((d, i) => (
        <div
          key={i}
          style={{
            position: "absolute",
            top: d.top,
            left: (d as any).left,
            right: (d as any).right,
            width: d.size,
            height: d.size,
            borderRadius: "50%",
            background: d.color,
            opacity: 0.7,
            animation: `float 4s ease-in-out ${d.delay} infinite`,
          }}
        />
      ))}
      <div
        style={{
          maxWidth: 900,
          margin: "0 auto",
          padding: "80px 24px",
          textAlign: "center",
          position: "relative",
          zIndex: 1,
        }}
      >
        <div
          style={{
            display: "inline-block",
            background: "rgba(255,255,255,0.82)",
            border: "1px solid rgba(216,174,79,0.5)",
            borderRadius: 100,
            padding: "6px 20px",
            marginBottom: 28,
            fontFamily: "'Outfit', sans-serif",
            fontSize: 13,
            fontWeight: 600,
            color: "#D8AE4F",
            letterSpacing: "0.08em",
            textTransform: "uppercase",
          }}
        >
          Summer 2026 · Ages 6–14
        </div>
        <h1
          style={{
            color: "#ffffff",
            margin: "0 0 28px",
          }}
          className="font-heading text-[41px] font-bold leading-tight text-white sm:text-[44px] md:text-[50px] lg:text-[50px]"
        >
          This Summer, Introduce Your Child
          <br />
          <span style={{}}>To the world of Logic </span>
        </h1>
        <p
          style={{
            color: "rgba(255,255,255,0.80)",
            maxWidth: 640,
            margin: "0 auto 48px",
            lineHeight: 1.7,
          }}
          className="font-heading text-[20px] text-white sm:text-[22px] md:text-[24px] lg:text-[24px]"
        >
          With Logicology Summer Workshops. These workshops are designed for holistic development of
          your child. If you want something beyond just drawing, painting and art while keeping your
          child engaged, join Logicology. We have a range of fun learning workshops.
        </p>
        <div style={{ display: "flex", gap: 16, justifyContent: "center", flexWrap: "wrap" }}>
          <a
            href="#enroll"
            className="group inline-flex max-w-[220px] items-center justify-center gap-2 rounded-full border-2 border-white bg-transparent px-6 py-3 text-[16px] font-semibold text-white transition-colors hover:bg-white hover:text-brand-teal focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-coral/40 active:scale-[.99] mt-2"
          >
            Enroll Now →
          </a>
        </div>
        <div
          style={{
            display: "flex",
            gap: 48,
            justifyContent: "center",
            flexWrap: "wrap",
            marginTop: 72,
            paddingTop: 48,
            borderTop: "1px solid rgba(255,255,255,0.15)",
          }}
        >
          {[
            { num: "10+", label: "Years of Summer Workshops" },
            { num: "1000+", label: "Children Trained" },
            { num: "6", label: "Workshop Options" },
            { num: "1", label: "Community Access to Logicology Online" },
          ].map((s) => (
            <div key={s.label} style={{ textAlign: "center" }}>
              <div
                style={{
                  fontFamily: "'Outfit', sans-serif",
                  fontWeight: 800,
                  fontSize: 32,
                  color: "#D8AE4F",
                }}
              >
                {s.num}
              </div>
              <div
                style={{
                  fontFamily: "'Outfit', sans-serif",
                  fontSize: 13,
                  fontWeight: 500,
                  color: "rgba(255,255,255,0.65)",
                  marginTop: 4,
                }}
              >
                {s.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ── Why Camps ─────────────────────────────────────────────────────────────────
function WhyCampsSection() {
  const { ref, visible } = useReveal();
  const benefits = [
    {
      icon: "🧠",
      title: "They Learn How to Think, Not Just What to Think",
      desc: "Summer workshops expose children to challenges that classrooms rarely offer. Problem-solving in real time, working with limited resources, and figuring things out without a textbook — these experiences build the kind of thinking skills that last far beyond the summer.",
    },
    {
      icon: "🤝",
      title: "They Build Social Skills That Screens Can't Teach",
      desc: "A workshop is one of the few places where children collaborate face-to-face, navigate disagreements, and learn to work with people who think differently from them. These are the skills that matter most in adulthood — and they can only be built through real interaction.",
    },
    {
      icon: "☀️",
      title: "They Get a Healthy Break from Screens",
      desc: "The average child spends over four hours a day on screens during summer. workshop replaces passive consumption with active engagement — building, experimenting, debating, and creating. Children come home energised, not drained.",
    },
    {
      icon: "⭐",
      title: "They Return More Confident",
      desc: "There's a specific kind of confidence that comes from solving a problem nobody gave you the answer to. workshop gives children repeated opportunities to succeed through their own effort, and that changes how they see themselves.",
    },
  ];

  return (
    <section
      id="why-camps"
      style={{
        background: "#E45C48",
        padding: "100px 24px",
        position: "relative",
        overflow: "hidden",
      }}
    >
      <div
        style={{
          position: "absolute",
          top: -80,
          right: -80,
          width: 320,
          height: 320,
          borderRadius: "50%",
          background: "rgba(255,255,255,0.07)",
          filter: "blur(60px)",
        }}
      />
      <div
        style={{
          position: "absolute",
          bottom: -60,
          left: -60,
          width: 260,
          height: 260,
          borderRadius: "50%",
          background: "rgba(0,0,0,0.06)",
          filter: "blur(50px)",
        }}
      />
      <div style={{ maxWidth: 1100, margin: "0 auto", position: "relative", zIndex: 1 }}>
        <div
          ref={ref}
          style={{
            textAlign: "center",
            marginBottom: 64,
            opacity: visible ? 1 : 0,
            transform: visible ? "translateY(0)" : "translateY(32px)",
            transition: "all 0.7s ease",
          }}
        >
          <div
            style={{
              display: "inline-block",
              background: "rgba(255,255,255,0.20)",
              border: "1px solid rgba(255,255,255,0.35)",
              borderRadius: 100,
              padding: "5px 18px",
              marginBottom: 20,
              fontFamily: "'Outfit', sans-serif",
              fontSize: 14,
              fontWeight: 700,
              color: "#fff",
              letterSpacing: "0.10em",
              textTransform: "uppercase",
            }}
          >
            Why Summer Workshops?
          </div>
          <h2 className="font-heading text-white text-[36px] md:text-[44px] font-bold leading-tight" style={{ margin: 0 }}>
            Why a Summer Workshop
            <br />
            Changes Everything
          </h2>
          <p
            style={{
              fontFamily: "'Outfit', sans-serif",
              fontSize: 18,
              color: "rgba(255,255,255,0.88)",
              maxWidth: 580,
              margin: "20px auto 0",
              lineHeight: 1.7,
            }}
          >
            Summer breaks are long. Without structure, children often default to screens and idle
            hours. A well-designed summer workshop fills that gap — not with busy work, but with
            meaningful experiences that shape how a child thinks, connects, and grows.
          </p>
        </div>
        <div style={{ textAlign: "center", marginTop: 56 }}>
          <div className="mt-6">
            <a
              href="#enroll"
              className="group inline-flex max-w-[220px] items-center justify-center gap-2 rounded-full bg-white px-6 py-3 text-[16px] font-semibold text-[#AB4637] transition-colors hover:bg-[#AB4637] hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-coral/40 active:scale-[.99]"
            >
              Enroll Now
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
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

// ── Why Logicology ────────────────────────────────────────────────────────────
function WhyLogicologySection() {
  const { ref, visible } = useReveal();
  const diffs = [
    {
      icon: "/Images/logicology_camps/WHY LOGICOLOGY/oc.svg",
      title: "Original Content",
      desc: "Our programme is a structured learning journey developed by educators with experience in cognitive development, STEM education, and child psychology.",
    },
    {
      icon: "/Images/logicology_camps/WHY LOGICOLOGY/QUALIFIED INSTRUCTERS.svg",
      title: "Highly Qualified Instructors",
      desc: "All our Instructors are highly qualified, more than half have already published their books. Our instructors are professionals who are teachers at heart.",
    },
    {
      icon: "/Images/logicology_camps/WHY LOGICOLOGY/SECURE PREMISES.svg",
      title: "Comfortable & Secure Environment",
      desc: "We have a fully air-conditioned premises with CCTV-monitored spaces to ensure that your child gets the safe environment she deserves.",
    },
  ];

  return (
    <section
      id="why-logicology"
      style={{
        background: "#D8AE4F",
        padding: "100px 24px",
        position: "relative",
        overflow: "hidden",
      }}
    >
      <div
        style={{
          position: "absolute",
          top: -80,
          right: -80,
          width: 320,
          height: 320,
          borderRadius: "50%",
          background: "rgba(255,255,255,0.12)",
          filter: "blur(70px)",
        }}
      />
      <div
        style={{
          position: "absolute",
          bottom: -60,
          left: -60,
          width: 260,
          height: 260,
          borderRadius: "50%",
          background: "rgba(0,0,0,0.05)",
          filter: "blur(50px)",
        }}
      />
      <div style={{ maxWidth: 1100, margin: "0 auto", position: "relative", zIndex: 1 }}>
        <div
          ref={ref}
          style={{
            textAlign: "center",
            marginBottom: 64,
            opacity: visible ? 1 : 0,
            transform: visible ? "translateY(0)" : "translateY(32px)",
            transition: "all 0.7s ease",
          }}
        >
          <div
            style={{
              display: "inline-block",
              background: "rgba(255,255,255,0.30)",
              border: "1px solid rgba(255,255,255,0.50)",
              borderRadius: 100,
              padding: "5px 18px",
              marginBottom: 20,
              fontFamily: "'Outfit', sans-serif",
              fontSize: 14,
              fontWeight: 700,
              color: "#5a3c00",
              letterSpacing: "0.10em",
              textTransform: "uppercase",
            }}
          >
            Why Logicology?
          </div>
          <h2 className="font-heading text-[#2d2200] text-[36px] md:text-[44px] font-bold leading-tight" style={{ margin: 0 }}>
            Not All Workshops Are
            <br />
            Created Equal.
          </h2>
          <p
            style={{
              fontFamily: "'Outfit', sans-serif",
              fontSize: 18,
              color: "rgba(45,34,0,0.78)",
              maxWidth: 560,
              margin: "20px auto 0",
              lineHeight: 1.7,
            }}
          >
            There are hundreds of summer workshops out there. Many are fun. A few are transformative.
            Logicology is designed to be the latter.
          </p>
        </div>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
            gap: 24,
          }}
        >
          {diffs.map((d, i) => (
            <GoldCard key={d.title} delay={i * 100}>
              <img src={d.icon} alt={d.title} style={{ width: 48, height: 48, marginBottom: 16, objectFit: "contain" }} />
              <h3
                style={{
                  fontFamily: "'Outfit', sans-serif",
                  fontWeight: 700,
                  fontSize: 18,
                  color: "#2d2200",
                  margin: "0 0 10px",
                }}
              >
                {d.title}
              </h3>
              <p
                style={{
                  fontFamily: "'Outfit', sans-serif",
                  fontSize: 15,
                  color: "rgba(45,34,0,0.75)",
                  lineHeight: 1.7,
                  margin: 0,
                }}
              >
                {d.desc}
              </p>
            </GoldCard>
          ))}
        </div>
        <div style={{ textAlign: "center", marginTop: 56 }}>
          <div className="mt-6">
            <a
              href="#enroll"
              className="group inline-flex max-w-[220px] items-center justify-center gap-2 rounded-full bg-white px-6 py-3 text-[16px] font-semibold text-[#7E5C2E] transition-colors hover:bg-[#7E5C2E] hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-[#7E5C2E]/40 active:scale-[.99]"
            >
              Enroll Now
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
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

// ── Module Card Component ────────────────────────────────────────────────────────
function ModuleCard({ module, index }: { module: any; index: number }) {
  const { ref, visible } = useReveal();
  return (
    <div
      key={module.title}
      ref={ref}
      style={{
        background: "#F5F6F7",
        borderRadius: 20,
        padding: 32,
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(40px)",
        transition: `all 0.7s ease ${index * 100}ms`,
        position: "relative",
        overflow: "hidden",
      }}
      onMouseEnter={(e) => {
        (e.currentTarget as HTMLDivElement).style.boxShadow = `0 12px 40px ${module.color}22`;
        (e.currentTarget as HTMLDivElement).style.transform = "translateY(-4px)";
      }}
      onMouseLeave={(e) => {
        (e.currentTarget as HTMLDivElement).style.boxShadow = "none";
        (e.currentTarget as HTMLDivElement).style.transform = "translateY(0)";
      }}
    >
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: 4,
          background: module.color,
          borderRadius: "20px 20px 0 0",
        }}
      />
      <img src={module.icon} alt={module.title} style={{ width: 48, height: 48, marginBottom: 12, objectFit: "contain" }} />
      <div
        style={{
          display: "inline-block",
          background: module.color + "22",
          borderRadius: 100,
          padding: "3px 14px",
          marginBottom: 12,
          fontFamily: "'Outfit', sans-serif",
          fontSize: 11,
          fontWeight: 700,
          color: module.color,
          letterSpacing: "0.08em",
          textTransform: "uppercase",
        }}
      >
        {module.tag}
      </div>
      <h3
        style={{
          fontFamily: "'Outfit', sans-serif",
          fontWeight: 700,
          fontSize: 18,
          color: "#0B3F44",
          margin: "0 0 10px",
        }}
      >
        {module.title}
      </h3>
      <p
        style={{
          fontFamily: "'Outfit', sans-serif",
          fontSize: 15,
          color: "#666",
          lineHeight: 1.7,
          margin: 0,
        }}
      >
        {module.desc}
      </p>
    </div>
  );
}

// ── Bonus Card Component ──────────────────────────────────────────────────────
function BonusCard({ bonus, index }: { bonus: any; index: number }) {
  const { ref, visible } = useReveal();
  return (
    <div
      key={bonus.title}
      ref={ref}
      style={{
        background: "#F5F6F7",
        borderRadius: 20,
        padding: 32,
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(40px)",
        transition: `all 0.7s ease ${index * 100}ms`,
        position: "relative",
        overflow: "hidden",
      }}
      onMouseEnter={(e) => {
        (e.currentTarget as HTMLDivElement).style.boxShadow = `0 12px 40px ${bonus.color}22`;
        (e.currentTarget as HTMLDivElement).style.transform = "translateY(-4px)";
      }}
      onMouseLeave={(e) => {
        (e.currentTarget as HTMLDivElement).style.boxShadow = "none";
        (e.currentTarget as HTMLDivElement).style.transform = "translateY(0)";
      }}
    >
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: 4,
          background: bonus.color,
          borderRadius: "20px 20px 0 0",
        }}
      />
      <img src={bonus.icon} alt={bonus.title} style={{ width: 48, height: 48, marginBottom: 12, objectFit: "contain" }} />
      <h3
        style={{
          fontFamily: "'Outfit', sans-serif",
          fontWeight: 700,
          fontSize: 18,
          color: "#0B3F44",
          margin: "0 0 10px",
        }}
      >
        {bonus.title}
      </h3>
      <p
        style={{
          fontFamily: "'Outfit', sans-serif",
          fontSize: 15,
          color: "#666",
          lineHeight: 1.7,
          margin: 0,
        }}
      >
        {bonus.desc}
      </p>
    </div>
  );
}

// ── Curriculum ────────────────────────────────────────────────────────────────
function CurriculumSection() {
  const { ref, visible } = useReveal();
  const modules = [
    {
      icon: "/Images/logicology_camps/TAKE AWAYS/LOGICAL REASONING.svg",
      tag: "Core Skill",
      title: "Logical Reasoning",
      desc: "Using a Logical approach to solve problems that can not be learned by rote",
      color: "#0A8A80",
    },
    {
      icon: "/Images/logicology_camps/TAKE AWAYS/CRITICAL THINKING.svg",
      tag: "Core Skill",
      title: "Critical Thinking",
      desc: "Using a step-by-step approach, choosing the best option in given context, evaluating options.",
      color: "#E45C48",
    },
    {
      icon: "/Images/logicology_camps/TAKE AWAYS/PROBLEM SOLVING.svg",
      tag: "Core Skill",
      title: "Problem Solving",
      desc: "Learning to solve problems that they haven't seen before, learning to use trial and error approach.",
      color: "#D8AE4F",
    },
  ];

  const bonuses = [
    {
      icon: "/Images/logicology_camps/WHAT MORE YOU GET/FREE ACCESS.svg",
      title: "Free Access to Logicology Subscription",
      desc: "Get free 1-month access to Logicology.online subscription where you get printable worksheets, online games and more",
      color: "#0A8A80",
    },
    {
      icon: "/Images/logicology_camps/WHAT MORE YOU GET/ONLINE LEARNING GAMES.svg",
      title: "Logicology Online Learning Games",
      desc: "Channelise screentime of your children on learning based games, exciting and effective these games are designed for skill development",
      color: "#E45C48",
    },
    {
      icon: "/Images/logicology_camps/WHAT MORE YOU GET/DISCOUNTED OFFER.svg",
      title: "Discounted Pricing for Logicology Products",
      desc: "Buy our World Class Board Games, Card Games and books with exclusive special summer workshop pricing.",
      color: "#D8AE4F",
    },
  ];

  return (
    <section id="curriculum" style={{ background: "#fff", padding: "100px 24px" }}>
      <div style={{ maxWidth: 1100, margin: "0 auto" }}>
        <div
          ref={ref}
          style={{
            textAlign: "center",
            marginBottom: 64,
            opacity: visible ? 1 : 0,
            transform: visible ? "translateY(0)" : "translateY(32px)",
            transition: "all 0.7s ease",
          }}
        >
          <div
            style={{
              display: "inline-block",
              background: "rgba(10,138,128,0.10)",
              border: "1px solid rgba(10,138,128,0.25)",
              borderRadius: 100,
              padding: "5px 18px",
              marginBottom: 20,
              fontFamily: "'Outfit', sans-serif",
              fontSize: 14,
              fontWeight: 700,
              color: "#0A8A80",
              letterSpacing: "0.10em",
              textTransform: "uppercase",
            }}
          >
            Take-aways
          </div>
          <h2 className="font-heading text-brand-teal text-[36px] md:text-[44px] font-bold leading-tight" style={{ margin: 0 }}>
            What Your Child Will Actually
            <br />
            Walk Away With
          </h2>
          <p
            style={{
              fontFamily: "'Outfit', sans-serif",
              fontSize: 18,
              color: "#555",
              maxWidth: 580,
              margin: "20px auto 0",
              lineHeight: 1.7,
            }}
          >
            Logicology's curriculum is built around skills that matter — the kind that schools often
            don't have the time or structure to teach.
          </p>
        </div>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
            gap: 24,
          }}
        >
          {modules.map((m, i) => (
            <ModuleCard key={m.title} module={m} index={i} />
          ))}
        </div>

        <div
          style={{ marginTop: 80, paddingTop: 80, borderTop: "2px solid rgba(10,138,128,0.10)" }}
        >
          <div style={{ textAlign: "center", marginBottom: 56 }}>
            <h3 className="font-heading text-brand-teal text-[28px] md:text-[32px] font-bold" style={{ margin: 0 }}>
              What's More You Also Get:
            </h3>
          </div>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
              gap: 24,
            }}
          >
            {bonuses.map((b, i) => (
              <BonusCard key={b.title} bonus={b} index={i} />
            ))}
          </div>
        </div>
        <div style={{ textAlign: "center", marginTop: 56 }}>
          <div className="mt-6">
            <a
              href="#enroll"
              className="group inline-flex max-w-[220px] items-center justify-center gap-2 rounded-full bg-brand-teal px-6 py-3 text-[16px] font-semibold text-white transition-colors hover:bg-brand-tealDark hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-[#7E5C2E]/40 active:scale-[.99]"
            >
              Enroll Now
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
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

// ── Enrollment Step Component ─────────────────────────────────────────────────
function EnrollmentStep({ step, index }: { step: any; index: number }) {
  const { ref, visible } = useReveal();
  return (
    <div
      key={step.title}
      ref={ref}
      style={{
        background: "rgba(255,255,255,0.18)",
        border: "1px solid rgba(255,255,255,0.30)",
        borderRadius: 20,
        padding: "28px 32px",
        display: "flex",
        alignItems: "center",
        gap: 28,
        backdropFilter: "blur(8px)",
        opacity: visible ? 1 : 0,
        transform: visible ? "translateX(0)" : "translateX(-32px)",
        transition: `all 0.7s ease ${index * 150}ms`,
      }}
      onMouseEnter={(e) => {
        (e.currentTarget as HTMLDivElement).style.background = "rgba(255,255,255,0.26)";
        (e.currentTarget as HTMLDivElement).style.transform = "translateX(6px)";
      }}
      onMouseLeave={(e) => {
        (e.currentTarget as HTMLDivElement).style.background = "rgba(255,255,255,0.18)";
        (e.currentTarget as HTMLDivElement).style.transform = "translateX(0)";
      }}
    >
      <div
        style={{
          minWidth: 64,
          height: 64,
          borderRadius: 16,
          background: "#fff",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontFamily: "'Outfit', sans-serif",
          fontWeight: 800,
          fontSize: 20,
          color: "#E45C48",
        }}
      >
        {step.num}
      </div>
      <div style={{ flex: 1 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 6 }}>
          <img src={step.icon} alt={step.title} style={{ width: 24, height: 24, objectFit: "contain" }} />
          <h3
            style={{
              fontFamily: "'Outfit', sans-serif",
              fontWeight: 700,
              fontSize: 20,
              color: "#fff",
              margin: 0,
            }}
          >
            {step.title}
          </h3>
        </div>
        <p
          style={{
            fontFamily: "'Outfit', sans-serif",
            fontSize: 15,
            color: "rgba(255,255,255,0.88)",
            margin: 0,
            lineHeight: 1.6,
          }}
        >
          {step.desc}
        </p>
      </div>
    </div>
  );
}

// ── How to Enroll ─────────────────────────────────────────────────────────────
function HowToEnrollSection() {
  const { ref, visible } = useReveal();
  const steps = [
    {
      num: "01",
      icon: "/Images/logicology_camps/ENROLLMENT/FILL FORM.svg",
      title: "Fill Out the Enrollment Form",
      desc: "Tell us about your child — name, age, and any details we should know. Takes less than three minutes.",
    },
    {
      num: "02",
      icon: "/Images/logicology_camps/ENROLLMENT/SELECT BATCH.svg",
      title: "Choose Your Batch",
      desc: "Select the dates and batch that work best for your family. We run multiple batches throughout the summer.",
    },
    {
      num: "03",
      icon: "/Images/logicology_camps/ENROLLMENT/MAKE PAYMENT.svg",
      title: "Make the Payment & You're In",
      desc: "Complete a secure online payment to confirm your child's spot. Confirmation email and all prep details arrive within minutes.",
    },
  ];

  return (
    <section
      id="how-to-enroll"
      style={{
        background: "#E45C48",
        padding: "100px 24px",
        position: "relative",
        overflow: "hidden",
      }}
    >
      <div
        style={{
          position: "absolute",
          top: -80,
          left: -80,
          width: 280,
          height: 280,
          borderRadius: "50%",
          background: "rgba(255,255,255,0.07)",
          filter: "blur(60px)",
        }}
      />
      <div style={{ maxWidth: 900, margin: "0 auto", position: "relative", zIndex: 1 }}>
        <div
          ref={ref}
          style={{
            textAlign: "center",
            marginBottom: 64,
            opacity: visible ? 1 : 0,
            transform: visible ? "translateY(0)" : "translateY(32px)",
            transition: "all 0.7s ease",
          }}
        >
          <div
            style={{
              display: "inline-block",
              background: "rgba(255,255,255,0.20)",
              border: "1px solid rgba(255,255,255,0.35)",
              borderRadius: 100,
              padding: "5px 18px",
              marginBottom: 20,
              fontFamily: "'Outfit', sans-serif",
              fontSize: 14,
              fontWeight: 700,
              color: "#fff",
              letterSpacing: "0.10em",
              textTransform: "uppercase",
            }}
          >
            Enrollment
          </div>
          <h2 className="font-heading text-white text-[36px] md:text-[44px] font-bold leading-tight" style={{ margin: "0 0 12px" }}>
            Getting Started Is Simple
          </h2>
          <p
            style={{
              fontFamily: "'Outfit', sans-serif",
              fontSize: 18,
              color: "rgba(255,255,255,0.88)",
            }}
          >
            Three steps. Five minutes. One decision that could shape your child's summer.
          </p>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          {steps.map((s, i) => (
            <EnrollmentStep key={s.title} step={s} index={i} />
          ))}
        </div>
        <div style={{ textAlign: "center", marginTop: 56 }}>
          <div className="mt-6">
            <a
              href="#enroll"
              className="group inline-flex max-w-[220px] items-center justify-center gap-2 rounded-full bg-white px-6 py-3 text-[16px] font-semibold text-[#AB4637] transition-colors hover:bg-[#AB4637] hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-coral/40 active:scale-[.99]"
            >
              Enroll Now
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
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

// ── Testimonials ──────────────────────────────────────────────────────────────

interface TestimonialData {
  quote: string;
  name: string;
  role: string;
  photo?: string;
}

const TESTIMONIALS: TestimonialData[] = [
  {
    quote:
      "As a Computer Science professor, I have always believed that logic and problem-solving should be nurtured from a very early age. When I came across Logicology, it stood out as perhaps the only summer workshop that truly focuses on building these foundational skills in a structured and engaging way. I was extremely satisfied with the Summer workshop 2025 experience for my daughter. I would strongly recommend Logicology to every parent.",
    name: "Dr. Swati Jaiswal",
    role: "Computer Science Professor, VNIT",
    photo: "https://ik.imagekit.io/pratik2002/swati.jpeg",
  },
  {
    quote:
      "As a software professional, I strongly believe that logical thinking is one of the most important skills to build early. Logicology Summer workshop was exactly what I was looking for. It's rare to find something that combines fun with deep thinking so effectively. My son Vish absolutely loved it, and I could see his confidence and problem-solving skills grow. It truly felt like a blessing.",
    name: "Chinmay Phadke",
    role: "AI Professional",
    photo: "https://ik.imagekit.io/pratik2002/passport-removebg-preview.png",
  },
  {
    quote:
      "As a doctor, my time is extremely limited, and I'm very mindful about how my children spend theirs. I wanted something more meaningful than the usual arts and dance workshops. Logicology Summer workshop stood out immediately. While it may seem more premium than average workshops, the value it delivers is truly unmatched. My child was deeply engaged, and I could see real learning happening every day. Absolutely worth it.",
    name: "Dr. Rita Bang",
    role: "Gynaecologist",
    photo: "https://ik.imagekit.io/pratik2002/rita.jpeg",
  },
  {
    quote:
      "What I loved most about Logicology Summer workshop was the incredible mix of skills it covers. It wasn't just learning — it was engaging, hands-on, and thoughtfully designed. Their original games and books are a big differentiator; this is not something you find just anywhere. It made the entire experience unique and memorable for my child.",
    name: "Sayali Bokare",
    role: "Company Secretary",
    photo: "https://ik.imagekit.io/pratik2002/syali.jpeg",
  },
  {
    quote:
      "I have twins, and I was looking for something truly different to engage them this summer. Most workshops for 5–6 year olds focus only on dancing, coloring, and painting. What impressed me about Logicology was how these very activities were used in such an innovative and purposeful way. I was genuinely amazed to see my young sons pick up so much about world geography in such a short span of time. I would strongly recommend Logicology Summer Workshops to any parent.",
    name: "Dr. Chetan Rathi",
    role: "Cardiologist",
    photo: "https://ik.imagekit.io/pratik2002/chetan-removebg-preview.png",
  },
  {
    quote:
      "Having recently moved back from the US, I was honestly unsure about the quality of workshops available here in Nagpur. I've had some bad experiences but Logicology was a pleasant surprise. The structure, depth, and delivery were at par with global standards. More importantly, my child learned skills that are incredibly relevant in today's world. I'm genuinely impressed and very happy with the experience.",
    name: "Ms. Meenakshi",
    role: "Architect",
    photo: undefined,
  },
];

// ── Position config (slots: -3 … +3) ─────────────────────────────────────────
const SLOT_STYLES: Record<string, React.CSSProperties & { background: string; boxShadow: string }> = {
  "-3": {
    transform: "translateX(-130%) rotateY(70deg) scale(0.55)",
    opacity: 0,
    zIndex: 1,
    pointerEvents: "none",
    background: "rgba(255,255,255,0.38)",
    boxShadow: "none",
  },
  "-2": {
    transform: "translateX(-105%) rotateY(60deg) scale(0.68)",
    opacity: 0.25,
    zIndex: 2,
    pointerEvents: "auto",
    background: "rgba(255,255,255,0.38)",
    boxShadow: "none",
  },
  "-1": {
    transform: "translateX(-62%) rotateY(42deg) scale(0.82)",
    opacity: 0.55,
    zIndex: 3,
    pointerEvents: "auto",
    background: "rgba(255,255,255,0.38)",
    boxShadow: "none",
  },
  "0": {
    transform: "translateX(0) rotateY(0deg) scale(1)",
    opacity: 1,
    zIndex: 5,
    pointerEvents: "auto",
    background: "rgba(255,255,255,0.88)",
    boxShadow: "0 28px 70px rgba(11,63,68,0.22)",
  },
  "1": {
    transform: "translateX(62%) rotateY(-42deg) scale(0.82)",
    opacity: 0.55,
    zIndex: 3,
    pointerEvents: "auto",
    background: "rgba(255,255,255,0.38)",
    boxShadow: "none",
  },
  "2": {
    transform: "translateX(105%) rotateY(-60deg) scale(0.68)",
    opacity: 0.25,
    zIndex: 2,
    pointerEvents: "auto",
    background: "rgba(255,255,255,0.38)",
    boxShadow: "none",
  },
  "3": {
    transform: "translateX(130%) rotateY(-70deg) scale(0.55)",
    opacity: 0,
    zIndex: 1,
    pointerEvents: "none",
    background: "rgba(255,255,255,0.38)",
    boxShadow: "none",
  },
};

/** Avatar: shows photo if available, falls back to teal initial circle */
function TestimonialAvatar({ photo, name }: { photo?: string; name: string }) {
  const [err, setErr] = useState(false);
  if (photo && !err) {
    return (
      <img
        src={photo}
        alt={name}
        onError={() => setErr(true)}
        style={{
          width: 52,
          height: 52,
          borderRadius: "50%",
          objectFit: "cover",
          objectPosition: "top center",
          border: "2.5px solid rgba(255,255,255,0.70)",
          flexShrink: 0,
          background: "rgba(255,255,255,0.5)",
        }}
      />
    );
  }
  return (
    <div
      style={{
        width: 52,
        height: 52,
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
        border: "2.5px solid rgba(255,255,255,0.50)",
      }}
    >
      {name[0]}
    </div>
  );
}

/** Single fan card */
function FanCard({
  t,
  slot,
  onClick,
}: {
  t: TestimonialData;
  slot: number;
  onClick: () => void;
}) {
  const clampedSlot = Math.max(-3, Math.min(3, slot));
  const style = SLOT_STYLES[String(clampedSlot)];
  const isActive = slot === 0;

  return (
    <div
      onClick={!isActive ? onClick : undefined}
      style={{
        position: "absolute",
        width: 420,
        maxWidth: "88vw",
        top: "50%",
        left: "50%",
        marginLeft: 0,
        marginTop: 0,
        transform: `translate(-50%, -50%) ${style.transform}`,
        opacity: style.opacity,
        zIndex: style.zIndex,
        pointerEvents: style.pointerEvents as React.CSSProperties["pointerEvents"],
        background: style.background,
        boxShadow: style.boxShadow,
        border: "1px solid rgba(255,255,255,0.60)",
        borderRadius: 20,
        padding: "32px 28px 26px",
        backdropFilter: "blur(12px)",
        WebkitBackdropFilter: "blur(12px)",
        display: "flex",
        flexDirection: "column",
        cursor: isActive ? "default" : "pointer",
        transition:
          "transform 0.55s cubic-bezier(.34,1.1,.64,1), opacity 0.45s ease, box-shadow 0.45s ease, background 0.35s ease",
        willChange: "transform, opacity",
        boxSizing: "border-box",
      }}
    >
      {/* Decorative quote mark */}
      <div
        style={{
          fontFamily: "Georgia, serif",
          fontSize: 72,
          color: "#0B3F44",
          lineHeight: 0.7,
          marginBottom: 14,
          opacity: 0.13,
          userSelect: "none",
        }}
      >
        "
      </div>

      {/* Quote */}
      <p
        style={{
          fontFamily: "'Outfit', sans-serif",
          fontSize: 14.5,
          color: "#2d2200",
          lineHeight: 1.82,
          fontStyle: "italic",
          margin: 0,
          display: "-webkit-box",
          WebkitLineClamp: isActive ? 7 : 5,
          WebkitBoxOrient: "vertical",
          overflow: "hidden",
        }}
      >
        {t.quote}
      </p>

      <div style={{ flexGrow: 1, minHeight: 14 }} />

      {/* Divider */}
      <div
        style={{
          height: 1,
          background: "rgba(11,63,68,0.14)",
          marginBottom: 16,
        }}
      />

      {/* Author row */}
      <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
        <TestimonialAvatar photo={t.photo} name={t.name} />
        <div>
          <div
            style={{
              fontFamily: "'Outfit', sans-serif",
              fontWeight: 700,
              fontSize: 14,
              color: "#2d2200",
              marginBottom: 3,
            }}
          >
            {t.name}
          </div>
          <div
            style={{
              fontFamily: "'Outfit', sans-serif",
              fontSize: 12,
              color: "rgba(45,34,0,0.58)",
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

/** Full testimonials section — fan/spread carousel */
function TestimonialsSection() {
  const { ref, visible } = useReveal();
  const N = TESTIMONIALS.length;
  const [current, setCurrent] = useState(0);
  const [animating, setAnimating] = useState(false);
  const autoRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const touchStartX = useRef<number | null>(null);

  const goTo = useCallback(
    (idx: number) => {
      if (animating) return;
      const next = ((idx % N) + N) % N;
      if (next === current) return;
      setAnimating(true);
      setCurrent(next);
      setTimeout(() => setAnimating(false), 580);
    },
    [animating, current, N]
  );

  const startAuto = useCallback(() => {
    if (autoRef.current) clearInterval(autoRef.current);
    autoRef.current = setInterval(() => {
      setCurrent((c) => (c + 1) % N);
    }, 4500);
  }, [N]);

  useEffect(() => {
    startAuto();
    return () => {
      if (autoRef.current) clearInterval(autoRef.current);
    };
  }, [startAuto]);

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };
  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return;
    const dx = e.changedTouches[0].clientX - touchStartX.current;
    if (Math.abs(dx) > 40) goTo(dx < 0 ? current + 1 : current - 1);
    touchStartX.current = null;
  };

  /** Slot offset for a given card index relative to current */
  const getSlot = (cardIdx: number) => {
    let off = cardIdx - current;
    if (off > N / 2) off -= N;
    if (off < -N / 2) off += N;
    return off;
  };

  return (
    <>
      <style>{`
        .t-fan-stage {
          position: relative;
          width: 100%;
          height: 420px;
          perspective: 1200px;
          transform-style: preserve-3d;
        }
        @media (max-width: 640px) {
          .t-fan-stage { height: 500px; perspective: 800px; }
        }
        .t-nav-btn:hover {
          background: rgba(255,255,255,0.95) !important;
          box-shadow: 0 4px 16px rgba(11,63,68,0.15) !important;
        }
        .t-nav-btn:active { transform: scale(0.95); }
        .t-cta-btn:hover { background: #7E5C2E !important; color: #fff !important; }
        .t-cta-btn:hover .t-cta-arrow { transform: translateX(4px); }
        .t-cta-arrow { display: inline-block; transition: transform 0.2s; }
        .t-dot-active {
          background: #0B3F44 !important;
          transform: scale(1.3) !important;
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
        {/* Decorative blobs */}
        <div
          style={{
            position: "absolute",
            bottom: -60,
            right: -60,
            width: 300,
            height: 300,
            borderRadius: "50%",
            background: "rgba(255,255,255,0.12)",
            filter: "blur(70px)",
            pointerEvents: "none",
          }}
        />
        <div
          style={{
            position: "absolute",
            top: -50,
            left: -80,
            width: 240,
            height: 240,
            borderRadius: "50%",
            background: "rgba(11,63,68,0.08)",
            filter: "blur(60px)",
            pointerEvents: "none",
          }}
        />

        <div style={{ maxWidth: 1160, margin: "0 auto", position: "relative", zIndex: 1 }}>
          {/* Section header */}
          <div
            ref={ref}
            style={{
              textAlign: "center",
              marginBottom: 56,
              opacity: visible ? 1 : 0,
              transform: visible ? "translateY(0)" : "translateY(32px)",
              transition: "all 0.7s ease",
            }}
          >
            <div
              style={{
                display: "inline-block",
                background: "rgba(255,255,255,0.30)",
                border: "1px solid rgba(255,255,255,0.50)",
                borderRadius: 100,
                padding: "5px 18px",
                marginBottom: 20,
                fontFamily: "'Outfit', sans-serif",
                fontSize: 14,
                fontWeight: 700,
                color: "#5a3c00",
                letterSpacing: "0.10em",
                textTransform: "uppercase",
              }}
            >
              Testimonials
            </div>
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

          {/* Fan carousel stage */}
          <div
            ref={stageRef}
            className="t-fan-stage"
            onMouseEnter={() => { if (autoRef.current) clearInterval(autoRef.current); }}
            onMouseLeave={startAuto}
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
          >
            {TESTIMONIALS.map((t, i) => (
              <FanCard
                key={t.name}
                t={t}
                slot={getSlot(i)}
                onClick={() => goTo(i)}
              />
            ))}
          </div>

          {/* Navigation */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 20,
              marginTop: 32,
            }}
          >
            {/* Prev */}
            <button
              className="t-nav-btn"
              onClick={() => goTo(current - 1)}
              aria-label="Previous"
              style={{
                width: 48,
                height: 48,
                borderRadius: "50%",
                background: "rgba(255,255,255,0.65)",
                border: "1.5px solid rgba(255,255,255,0.75)",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 18,
                color: "#0B3F44",
                fontWeight: 900,
                backdropFilter: "blur(8px)",
                transition: "background 0.2s, box-shadow 0.2s",
              }}
            >
              ←
            </button>

            {/* Dots */}
            <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
              {TESTIMONIALS.map((_, i) => (
                <button
                  key={i}
                  onClick={() => goTo(i)}
                  className={i === current ? "t-dot-active" : ""}
                  style={{
                    width: 7,
                    height: 7,
                    minWidth: 7,
                    minHeight: 7,
                    borderRadius: "50%",
                    background: "rgba(11,63,68,0.28)",
                    border: "none",
                    cursor: "pointer",
                    padding: 0,
                    transition: "background 0.2s, transform 0.2s",
                    transform: "scale(1)",
                    WebkitAppearance: "none",
                    appearance: "none",
                  }}
                />
              ))}
            </div>

            {/* Next */}
            <button
              className="t-nav-btn"
              onClick={() => goTo(current + 1)}
              aria-label="Next"
              style={{
                width: 48,
                height: 48,
                borderRadius: "50%",
                background: "rgba(255,255,255,0.65)",
                border: "1.5px solid rgba(255,255,255,0.75)",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 18,
                color: "#0B3F44",
                fontWeight: 900,
                backdropFilter: "blur(8px)",
                transition: "background 0.2s, box-shadow 0.2s",
              }}
            >
              →
            </button>
          </div>

          {/* CTA */}
          <div style={{ textAlign: "center", marginTop: 56 }}>
            <div className="mt-6">
              <a
                href="#enroll"
                className="group inline-flex max-w-[220px] items-center justify-center gap-2 rounded-full bg-white px-6 py-3 text-[16px] font-semibold text-[#7E5C2E] transition-colors hover:bg-[#7E5C2E] hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-[#7E5C2E]/40 active:scale-[.99]"
              >
                Enroll Now
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
              </a>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

// ── FAQ ───────────────────────────────────────────────────────────────────────
function FAQSection() {
  const { ref, visible } = useReveal();
  const [open, setOpen] = useState<number | null>(null);
  const faqs = [
    {
      q: "What age group is the workshop designed for?",
      a: "Logicology Summer workshop is designed for children aged 6 to 14. Activities and curriculum are tailored to two age groups — Juniors (6–9 years) and Seniors (10–14 years) — so every child gets an experience appropriate to their level.",
    },
    {
      q: "Where is the workshop located?",
      a: "Humpyard Road, Dhantoli, Near Dinanath High School. The venue is fully air-conditioned, CCTV-monitored, and equipped with dedicated learning and activity spaces. Directions will be shared in your confirmation message. Please note there isn't ample 4-wheeler parking available near the center, you may have to park on the Humpyard road.",
    },
    {
      q: "What are the workshop dates and timings?",
      a: "We run multiple batches throughout the summer. Each batch runs for 5 or 10 days, the timings are 10 am to 1 pm. You can choose your preferred batch during enrollment. Senior workshops are 60/90 minutes and junior workshops are for 180 minutes.",
    },
    {
      q: "How much does it cost?",
      a: "The workshop fee ranges from INR 1000–INR 6000 per child based on the programme. This includes GST and accompanying worksheets, material and access to one month of Logicology.online subscription. Sibling discount of 10% is available to both siblings (for fees more than INR 3000). Group discounts are available for groups of 5 or more.",
    },
    {
      q: "What is the refund and cancellation policy?",
      a: "Full refunds are available if the batch gets cancelled. Cancellation after the first day of the workshop is possible with 80% refund. No refunds are issued after child attends 2nd day of the workshop. If you enrol and need to travel before the batch begins, we will make a full refund (after deducting INR 200 as registration charges).",
    },
    {
      q: "What safety measures are in place?",
      a: "Safety is our top priority: secured premises with controlled entry and exit, CCTV monitoring across all common areas, verified background checks for all instructors. We request you to not drop the children on the ground floor when our team members are not present. Our team members may ask for identity card of the person coming to pick up the child.",
    },
    {
      q: "Does my child need any specific skills or capabilities?",
      a: "Your child should be able to read, write and communicate in English, Hindi or Marathi. We DO NOT possess the capabilities to manage children with special needs during our workshops. If your child has any specific special needs, please contact us before enrolling.",
    },
    {
      q: "What should my child bring to a workshop?",
      a: "Children should bring a water bottle, a light snack (if they have specific dietary needs), and comfortable clothing. We DO NOT provide any food items. All learning materials, worksheets, books (wherever applicable) are provided by Logicology.",
    },
    {
      q: "How will I know what my child is doing at the workshop?",
      a: "You can take a look at the worksheets. We have online games and assessments which will provide you a peek into the performance of your child. For summer workshops we DO NOT provide personalized written feedback.",
    },
    {
      q: "How do I contact you if I have more questions?",
      a: "You can reach us on WhatsApp at 8446980747. Our team typically responds within a few hours during business hours. If you need to talk to one of our instructors, send us a WhatsApp specifying the nature of the query and we will call you back.",
    },
    {
      q: "How can I buy Logicology Games and Books?",
      a: 'Our games and books are available for sale at our centre and on our website. If your child is attending the summer workshop, we recommend you buy our Games and Books at our center itself. Please ask for "Summer workshop Special" pricing when buying at our centre.',
    },
    {
      q: "The age range is 6–9, how do you ensure age-appropriate material?",
      a: "Our content is based on Logic and does not tie to any specific class in school. In rare cases where some children may not be aware of a specific concept, our instructor will teach that concept and move on. We try to segregate students from one age group in one batch as far as possible.",
    },
  ];

  return (
    <section id="faqs" style={{ background: "#F5F6F7", padding: "100px 24px" }}>
      <div style={{ maxWidth: 760, margin: "0 auto" }}>
        <div
          ref={ref}
          style={{
            textAlign: "center",
            marginBottom: 56,
            opacity: visible ? 1 : 0,
            transform: visible ? "translateY(0)" : "translateY(32px)",
            transition: "all 0.7s ease",
          }}
        >
          <div
            style={{
              display: "inline-block",
              background: "rgba(10,138,128,0.10)",
              border: "1px solid rgba(10,138,128,0.25)",
              borderRadius: 100,
              padding: "5px 18px",
              marginBottom: 20,
              fontFamily: "'Outfit', sans-serif",
              fontSize: 14,
              fontWeight: 700,
              color: "#0A8A80",
              letterSpacing: "0.10em",
              textTransform: "uppercase",
            }}
          >
            FAQ
          </div>
          <h2
            className="font-heading text-brand-teal text-[28px] md:text-[44px] font-bold"
            style={{ margin: 0 }}
          >
            Got Questions? We've Got Answers.
          </h2>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {faqs.map((f, i) => (
            <div
              key={i}
              style={{
                background: "#fff",
                borderRadius: 16,
                border: `1px solid ${open === i ? "rgba(10,138,128,0.3)" : "rgba(10,138,128,0.08)"}`,
                overflow: "hidden",
                boxShadow: open === i ? "0 4px 20px rgba(10,138,128,0.10)" : "none",
                transition: "all 0.3s ease",
              }}
            >
              <button
                onClick={() => setOpen(open === i ? null : i)}
                style={{
                  width: "100%",
                  padding: "20px 24px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  textAlign: "left",
                }}
              >
                <span
                  style={{
                    fontFamily: "'Outfit', sans-serif",
                    fontWeight: 600,
                    fontSize: 16,
                    color: open === i ? "#0A8A80" : "#0B3F44",
                  }}
                >
                  {f.q}
                </span>
                <span
                  style={{
                    fontSize: 20,
                    color: "#0A8A80",
                    flexShrink: 0,
                    marginLeft: 16,
                    transform: open === i ? "rotate(45deg)" : "rotate(0)",
                    transition: "transform 0.3s ease",
                    display: "inline-block",
                  }}
                >
                  +
                </span>
              </button>
              {open === i && (
                <div style={{ padding: "0 24px 20px" }}>
                  <p
                    style={{
                      fontFamily: "'Outfit', sans-serif",
                      fontSize: 15,
                      color: "#666",
                      lineHeight: 1.7,
                      margin: 0,
                    }}
                  >
                    {f.a}
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ── Enrollment Form ───────────────────────────────────────────────────────────
function EnrollmentSection({ selectedBatch, selectedPrice }: { selectedBatch: string; selectedPrice: number | null }) {
  const { ref, visible } = useReveal();
  const [form, setForm] = useState<FormData>({
    parentName: "",
    email: "",
    phone: "",
    childName: "",
    childAge: "",
    childGrade: "",
    preferredBatch: "",
    allergies: "",
    referral: "",
    consent: false,
  });
  const [errors, setErrors] = useState<Partial<Record<keyof FormData, string>>>({});
  const [isProcessing, setIsProcessing] = useState(false);
  const [isPaymentProcessing, setIsPaymentProcessing] = useState(false);
  const [showPricingTable, setShowPricingTable] = useState(false);

  useEffect(() => {
    if (selectedBatch) {
      setForm((f) => ({ ...f, preferredBatch: selectedBatch }));
    }
  }, [selectedBatch]);

  const activeFee =
    selectedPrice !== null && form.preferredBatch === selectedBatch
      ? selectedPrice
      : BATCH_PRICES[form.preferredBatch] ?? 1000;

  const activeFeeRef = useRef(activeFee);
  useEffect(() => {
    activeFeeRef.current = activeFee;
  }, [activeFee]);

  const validate = () => {
    const e: Partial<Record<keyof FormData, string>> = {};
    if (!form.parentName.trim()) e.parentName = "This field is required.";
    if (!form.email.trim() || !/\S+@\S+\.\S+/.test(form.email))
      e.email = "Please enter a valid email address.";
    if (!form.phone.trim() || form.phone.replace(/\D/g, "").length !== 10)
      e.phone = "Please enter a valid 10-digit phone number.";
    if (!form.childName.trim()) e.childName = "This field is required.";
    if (!form.childAge) e.childAge = "This field is required.";
    if (!form.childGrade) e.childGrade = "This field is required.";
    if (!form.preferredBatch) e.preferredBatch = "This field is required.";
    if (!form.consent) e.consent = "Please accept the Terms & Conditions to proceed.";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const sendWhatsApp = async (paymentId: string) => {
    const cleanedPhone = form.phone.replace(/\D/g, "").slice(-10);
    try {
      await fetch("https://api.interakt.ai/v1/public/track/users/", {
        method: "POST",
        headers: {
          Authorization: "Basic QTc1emFobGthSVpxRGp1aWtRNE5aaDdCU0xGNFk5LXRFZ3ZXYkRySDZjbzo=",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          phoneNumber: cleanedPhone,
          countryCode: "+91",
          traits: {
            name: form.parentName,
            email: form.email,
            lastPaymentId: paymentId,
            campBatch: form.preferredBatch,
          },
        }),
      });
      await fetch("https://api.interakt.ai/v1/public/message/", {
        method: "POST",
        headers: {
          Authorization: "Basic QTc1emFobGthSVpxRGp1aWtRNE5aaDdCU0xGNFk5LXRFZ3ZXYkRySDZjbzo=",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          countryCode: "+91",
          phoneNumber: cleanedPhone,
          type: "Template",
          template: {
            name: "purchase",
            languageCode: "en",
            bodyValues: [
              form.parentName,
              `Logicology Summer workshop — ${form.preferredBatch}`,
              CAMP_FEE.toString(),
              "Logicology workshop Venue",
              paymentId,
            ],
          },
        }),
      });
    } catch (err) {
      console.error("WhatsApp error:", err);
    }
  };

  const handleSubmit = useCallback(async () => {
    if (!validate() || isProcessing) return;
    setIsProcessing(true);
    try {
      const isScriptLoaded = await loadRazorpayScript();
      if (!isScriptLoaded) {
        alert("Failed to load payment gateway. Please refresh and try again.");
        setIsProcessing(false);
        return;
      }
      await new Promise((resolve) => setTimeout(resolve, 100));
      const res = await fetch("/api/razorpay-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount: activeFeeRef.current, currency: "INR", receipt: `camp_${Date.now()}` }),
      });
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || "Failed to create order");
      }
      const { order } = await res.json();
      if (!order) {
        alert("Failed to create order. Please try again.");
        setIsProcessing(false);
        return;
      }
      const orderDescription = `Summer workshop Enrollment — ${form.preferredBatch} for ${form.childName}`;
      const options = {
        key: RAZORPAY_KEY_ID,
        amount: order.amount,
        currency: order.currency,
        name: "Logicology",
        description: orderDescription,
        order_id: order.id,
        handler: async function (response: any) {
          setIsPaymentProcessing(true);
          try {
            await fetch("/api/save-summer-camp-registration", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                customerInfo: { name: form.parentName, email: form.email, phone: form.phone },
                items: [
                  {
                    name: `Logicology Summer workshop — ${form.preferredBatch}`,
                    price: activeFeeRef.current,
                    quantity: 1,
                    itemId: "summer-camp",
                  },
                ],
                paymentInfo: {
                  paymentId: response.razorpay_payment_id,
                  orderId: response.razorpay_order_id,
                  amount: activeFeeRef.current,
                  currency: "INR",
                  status: "completed",
                  description: orderDescription,
                },
                totals: { subtotal: activeFeeRef.current, discount: 0, total: activeFeeRef.current },
                discountCode: null,
                campDetails: {
                  childName: form.childName,
                  childAge: form.childAge,
                  childGrade: form.childGrade,
                  batch: form.preferredBatch,
                  allergies: form.allergies,
                  referral: form.referral,
                },
              }),
            });
            await sendWhatsApp(response.razorpay_payment_id);
            alert(
              `🎉 Enrollment confirmed! Payment ID: ${response.razorpay_payment_id}. Check your email and WhatsApp for details.`
            );
            setForm({
              parentName: "",
              email: "",
              phone: "",
              childName: "",
              childAge: "",
              childGrade: "",
              preferredBatch: "",
              allergies: "",
              referral: "",
              consent: false,
            });
            setErrors({});
          } catch (err) {
            console.error("Post-payment error:", err);
            alert(
              "Payment was successful but there was an issue saving your enrollment. Please contact support with your Payment ID: " +
                response.razorpay_payment_id
            );
          } finally {
            setIsPaymentProcessing(false);
            setIsProcessing(false);
          }
        },
        prefill: { name: form.parentName, email: form.email, contact: form.phone },
        notes: {
          child_name: form.childName,
          batch: form.preferredBatch,
          grade: form.childGrade,
          child_age: form.childAge,
        },
        theme: { color: "#0A8A80" },
        modal: { ondismiss: () => setIsProcessing(false) },
      };
      const razorpay = new (window as any).Razorpay(options);
      razorpay.open();
    } catch (err) {
      console.error("Checkout error:", err);
      alert(err instanceof Error ? err.message : "An error occurred. Please try again.");
      setIsProcessing(false);
    }
  }, [form, isProcessing]);

  const inp = (hasError?: boolean): React.CSSProperties => ({
    width: "100%",
    padding: "14px 18px",
    borderRadius: 12,
    border: `1.5px solid ${hasError ? "#E45C48" : "rgba(10,138,128,0.2)"}`,
    fontFamily: "'Outfit', sans-serif",
    fontSize: 15,
    color: "#0B3F44",
    background: "#fff",
    outline: "none",
    boxSizing: "border-box",
    transition: "border-color 0.2s",
  });
  const lbl: React.CSSProperties = {
    display: "block",
    fontFamily: "'Outfit', sans-serif",
    fontWeight: 600,
    fontSize: 14,
    color: "#0B3F44",
    marginBottom: 6,
  };
  const err: React.CSSProperties = {
    fontFamily: "'Outfit', sans-serif",
    fontSize: 12,
    color: "#E45C48",
    marginTop: 4,
  };

  const juniorRows = [
    { name: "Logicoland A", dates: "20 Apr – 24 Apr", time: "10:00 – 1:00", fee: 2000 },
    { name: "Logicoland B", dates: "27 Apr – 1 May", time: "10:00 – 1:00", fee: 2000 },
    { name: "Logicoland A", dates: "11 May – 15 May", time: "9:30 – 12:30", fee: 2000 },
    { name: "Logicoland B", dates: "18 May – 22 May", time: "9:30 – 12:30", fee: 2000 },
  ];

  const seniorRows = [
    { name: "Quizzing", dates: "27 Apr – 1 May", time: "9:30 – 10:30", fee: 1000 },
    { name: "Speed Maths", dates: "4 May – 8 May", time: "9:30 – 11:00", fee: 2500 },
    { name: "Logical Reasoning", dates: "4 May – 8 May", time: "11:00 – 12:30", fee: 2500 },
    { name: "Speed Maths", dates: "18 May – 22 May", time: "9:30 – 11:00", fee: 2500 },
    { name: "Logical Reasoning", dates: "25 May – 29 May", time: "11:00 – 12:30", fee: 2500 },
  ];

  const categoryRowStyle: React.CSSProperties = {
    padding: "8px 14px",
    fontSize: 11,
    fontWeight: 700,
    textTransform: "uppercase",
    letterSpacing: "0.1em",
    color: "rgba(255,255,255,0.55)",
  };

  const badgeStyle = (variant: "teal" | "amber"): React.CSSProperties => ({
    display: "inline-block",
    borderRadius: 100,
    padding: "2px 10px",
    fontSize: 12,
    fontWeight: 700,
    ...(variant === "teal"
      ? {
          background: "rgba(10,138,128,0.35)",
          border: "1px solid rgba(127,255,244,0.2)",
          color: "#7ffff4",
        }
      : {
          background: "rgba(216,174,79,0.2)",
          border: "1px solid rgba(216,174,79,0.35)",
          color: "#D8AE4F",
        }),
  });

  return (
    <section
      id="enroll"
      style={{
        background: "#0A8A80",
        padding: "100px 24px",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {isPaymentProcessing && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 999,
            background: "rgba(11,63,68,0.85)",
            backdropFilter: "blur(12px)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <div
            style={{
              background: "#fff",
              borderRadius: 24,
              padding: "48px 40px",
              textAlign: "center",
              maxWidth: 380,
            }}
          >
            <div
              style={{
                width: 64,
                height: 64,
                borderRadius: "50%",
                border: "4px solid #0A8A80",
                borderTopColor: "transparent",
                margin: "0 auto 24px",
                animation: "spin 1s linear infinite",
              }}
            />
            <h3
              style={{
                fontFamily: "'Outfit', sans-serif",
                fontWeight: 700,
                fontSize: 22,
                color: "#0B3F44",
                margin: "0 0 10px",
              }}
            >
              Processing Enrollment
            </h3>
            <p
              style={{
                fontFamily: "'Outfit', sans-serif",
                fontSize: 15,
                color: "#666",
                margin: "0 0 20px",
              }}
            >
              Confirming your payment and sending enrollment details...
            </p>
            <div
              style={{
                background: "#FFF9E6",
                border: "1px solid #D8AE4F",
                borderRadius: 12,
                padding: "12px 16px",
                fontFamily: "'Outfit', sans-serif",
                fontSize: 13,
                color: "#8B6914",
                fontWeight: 600,
              }}
            >
              ⚠️ Do not close or refresh this page
            </div>
          </div>
        </div>
      )}

      <div
        style={{
          position: "absolute",
          top: -80,
          right: -80,
          width: 360,
          height: 360,
          borderRadius: "50%",
          background: "rgba(216,174,79,0.08)",
          filter: "blur(80px)",
        }}
      />

      <div style={{ maxWidth: 720, margin: "0 auto", position: "relative", zIndex: 1 }}>
        {/* ── Heading ── */}
        <div
          ref={ref}
          style={{
            textAlign: "center",
            marginBottom: 48,
            opacity: visible ? 1 : 0,
            transform: visible ? "translateY(0)" : "translateY(32px)",
            transition: "all 0.7s ease",
          }}
        >
          <div
            style={{
              display: "inline-block",
              background: "rgba(255,255,255,0.30)",
              border: "1px solid rgba(216,174,79,0.4)",
              borderRadius: 100,
              padding: "5px 18px",
              marginBottom: 20,
              fontFamily: "'Outfit', sans-serif",
              fontSize: 14,
              fontWeight: 700,
              color: "#D8AE4F",
              letterSpacing: "0.10em",
              textTransform: "uppercase",
            }}
          >
            Enrollment Open
          </div>
          <h2
            style={{
              fontFamily: "'Outfit', sans-serif",
              fontWeight: 800,
              fontSize: "clamp(28px, 4vw, 48px)",
              color: "#fff",
              margin: "0 0 12px",
            }}
          >
            Enroll Your Child Today
          </h2>
          <p
            style={{
              fontFamily: "'Outfit', sans-serif",
              fontSize: 17,
              color: "rgba(255,255,255,0.75)",
              margin: 0,
            }}
          >
            Fill in the details below and secure your child's spot at Logicology Summer Workshop.
          </p>
        </div>

        {/* ── Fee banner + Pricing table ── */}
        <div
          style={{
            background: "rgba(255,255,255,0.12)",
            border: "2px solid rgba(216,174,79,0.35)",
            borderRadius: 16,
            padding: "20px 28px",
            marginBottom: 36,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            flexWrap: "wrap",
            gap: 16,
          }}
        >
          {/* Fee display */}
          <div>
            <div
              style={{
                fontFamily: "'Outfit', sans-serif",
                fontSize: 13,
                color: "rgba(255,255,255,0.7)",
                fontWeight: 600,
                textTransform: "uppercase",
                letterSpacing: "0.07em",
              }}
            >
              Workshop Fee
            </div>
            <div
              style={{
                fontFamily: "'Outfit', sans-serif",
                fontWeight: 800,
                fontSize: 32,
                color: "#D8AE4F",
                transition: "all 0.3s ease",
              }}
            >
              ₹{activeFee.toLocaleString("en-IN")}
            </div>
            <div
              style={{
                fontFamily: "'Outfit', sans-serif",
                fontSize: 13,
                color: "rgba(255,255,255,0.6)",
              }}
            >
              {form.preferredBatch
                ? `Selected: ${form.preferredBatch}`
                : "Please select a batch below"}
            </div>
          </div>

          {/* Pricing button */}
          <button
            onClick={() => setShowPricingTable(true)}
            style={{
              background: "rgba(216,174,79,0.2)",
              border: "1.5px solid rgba(216,174,79,0.6)",
              borderRadius: 12,
              padding: "10px 18px",
              fontFamily: "'Outfit', sans-serif",
              fontSize: 13,
              color: "#D8AE4F",
              fontWeight: 600,
              cursor: "pointer",
              transition: "all 0.2s ease",
              whiteSpace: "nowrap",
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLButtonElement).style.background = "rgba(216,174,79,0.35)";
              (e.currentTarget as HTMLButtonElement).style.borderColor = "rgba(216,174,79,0.8)";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLButtonElement).style.background = "rgba(216,174,79,0.2)";
              (e.currentTarget as HTMLButtonElement).style.borderColor = "rgba(216,174,79,0.6)";
            }}
          >
            📊 View Pricing Table
          </button>
        </div>

        {/* ── Pricing Table Modal ── */}
        {showPricingTable && (
          <div
            style={{
              position: "fixed",
              inset: 0,
              background: "rgba(0,0,0,0.7)",
              backdropFilter: "blur(4px)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              zIndex: 999,
              padding: "20px",
            }}
            onClick={() => setShowPricingTable(false)}
          >
            {/* Modal content */}
            <div
              style={{
                background: "linear-gradient(135deg, #0B3F44 0%, #1A5A5F 100%)",
                borderRadius: 20,
                padding: "40px 36px",
                maxWidth: "900px",
                width: "100%",
                maxHeight: "85vh",
                overflowY: "auto",
                boxShadow: "0 20px 100px rgba(0,0,0,0.4)",
                border: "2px solid rgba(216,174,79,0.3)",
              }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Modal header */}
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 28 }}>
                <h3
                  style={{
                    fontFamily: "'Outfit', sans-serif",
                    fontSize: 28,
                    fontWeight: 800,
                    color: "#fff",
                    margin: 0,
                  }}
                >
                  Workshop Pricing Details
                </h3>
                <button
                  onClick={() => setShowPricingTable(false)}
                  style={{
                    background: "rgba(216,174,79,0.2)",
                    border: "1.5px solid rgba(216,174,79,0.5)",
                    borderRadius: 10,
                    width: 40,
                    height: 40,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "#D8AE4F",
                    fontSize: 20,
                    cursor: "pointer",
                    transition: "all 0.2s ease",
                  }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLButtonElement).style.background = "rgba(216,174,79,0.35)";
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLButtonElement).style.background = "rgba(216,174,79,0.2)";
                  }}
                >
                  ✕
                </button>
              </div>

              {/* Pricing table */}
              <table
                style={{
                  width: "100%",
                  borderCollapse: "collapse",
                  fontFamily: "'Outfit', sans-serif",
                }}
              >
                <thead>
                  <tr>
                    {["Programme", "Dates", "Timings", "Fee"].map((h) => (
                      <th
                        key={h}
                        style={{
                          padding: "14px 14px",
                          background: "rgba(11,63,68,0.6)",
                          color: "rgba(255,255,255,0.6)",
                          fontSize: 12,
                          fontWeight: 700,
                          textTransform: "uppercase",
                          letterSpacing: "0.07em",
                          textAlign: h === "Fee" ? "right" : "left",
                          whiteSpace: "nowrap",
                          borderBottom: "1px solid rgba(216,174,79,0.2)",
                        }}
                      >
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {/* Juniors category header */}
                  <tr>
                    <td
                      colSpan={4}
                      style={{
                        ...categoryRowStyle,
                        background: "rgba(10,138,128,0.25)",
                      }}
                    >
                      Logicoland — Juniors (Grade 1–4) &amp; Seniors (Grade 5–9)
                    </td>
                  </tr>
                  {juniorRows.map((row, i) => (
                    <tr
                      key={i}
                      style={{
                        background:
                          i % 2 === 0 ? "rgba(255,255,255,0.05)" : "rgba(255,255,255,0.09)",
                      }}
                    >
                      <td style={{ padding: "12px 14px" }}>
                        <span style={badgeStyle("teal")}>{row.name}</span>
                      </td>
                      <td style={{ padding: "12px 14px", fontSize: 13, color: "rgba(255,255,255,0.85)", whiteSpace: "nowrap" }}>
                        {row.dates}
                      </td>
                      <td style={{ padding: "12px 14px", fontSize: 13, color: "rgba(255,255,255,0.85)", whiteSpace: "nowrap" }}>
                        {row.time}
                      </td>
                      <td style={{ padding: "12px 14px", fontSize: 14, fontWeight: 700, color: "#D8AE4F", textAlign: "right", whiteSpace: "nowrap" }}>
                        ₹{row.fee.toLocaleString("en-IN")}
                      </td>
                    </tr>
                  ))}

                  {/* Seniors category header */}
                  <tr>
                    <td
                      colSpan={4}
                      style={{
                        ...categoryRowStyle,
                        background: "rgba(216,174,79,0.15)",
                      }}
                    >
                      Quizzing / Speed Maths / Logical Reasoning — Seniors (Grade 5–9)
                    </td>
                  </tr>
                  {seniorRows.map((row, i) => (
                    <tr
                      key={i}
                      style={{
                        background:
                          i % 2 === 0 ? "rgba(255,255,255,0.05)" : "rgba(255,255,255,0.09)",
                      }}
                    >
                      <td style={{ padding: "12px 14px" }}>
                        <span style={badgeStyle("amber")}>{row.name}</span>
                      </td>
                      <td style={{ padding: "12px 14px", fontSize: 13, color: "rgba(255,255,255,0.85)", whiteSpace: "nowrap" }}>
                        {row.dates}
                      </td>
                      <td style={{ padding: "12px 14px", fontSize: 13, color: "rgba(255,255,255,0.85)", whiteSpace: "nowrap" }}>
                        {row.time}
                      </td>
                      <td style={{ padding: "12px 14px", fontSize: 14, fontWeight: 700, color: "#D8AE4F", textAlign: "right", whiteSpace: "nowrap" }}>
                        ₹{row.fee.toLocaleString("en-IN")}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ── Form card ── */}
        <div
          style={{
            background: "#fff",
            borderRadius: 24,
            padding: "40px 40px",
            boxShadow: "0 24px 80px rgba(0,0,0,0.20)",
          }}
        >
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
            <div style={{ gridColumn: "1 / -1" }}>
              <label style={lbl}>Parent / Guardian Full Name *</label>
              <input
                type="text"
                value={form.parentName}
                onChange={(e) => setForm((f) => ({ ...f, parentName: e.target.value }))}
                placeholder="Your full name"
                style={inp(!!errors.parentName)}
                onFocus={(e) => (e.target.style.borderColor = "#0A8A80")}
                onBlur={(e) =>
                  (e.target.style.borderColor = errors.parentName ? "#E45C48" : "rgba(10,138,128,0.2)")
                }
              />
              {errors.parentName && <div style={err}>{errors.parentName}</div>}
            </div>

            <div>
              <label style={lbl}>Email Address *</label>
              <input
                type="email"
                value={form.email}
                onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                placeholder="you@email.com"
                style={inp(!!errors.email)}
                onFocus={(e) => (e.target.style.borderColor = "#0A8A80")}
                onBlur={(e) =>
                  (e.target.style.borderColor = errors.email ? "#E45C48" : "rgba(10,138,128,0.2)")
                }
              />
              {errors.email && <div style={err}>{errors.email}</div>}
            </div>

            <div>
              <label style={lbl}>Phone Number (WhatsApp) *</label>
              <input
                type="tel"
                value={form.phone}
                onChange={(e) =>
                  setForm((f) => ({ ...f, phone: e.target.value.replace(/\D/g, "").slice(0, 10) }))
                }
                placeholder="10-digit mobile number"
                style={inp(!!errors.phone)}
                onFocus={(e) => (e.target.style.borderColor = "#0A8A80")}
                onBlur={(e) =>
                  (e.target.style.borderColor = errors.phone ? "#E45C48" : "rgba(10,138,128,0.2)")
                }
              />
              {errors.phone && <div style={err}>{errors.phone}</div>}
            </div>

            <div>
              <label style={lbl}>Child's Full Name *</label>
              <input
                type="text"
                value={form.childName}
                onChange={(e) => setForm((f) => ({ ...f, childName: e.target.value }))}
                placeholder="Child's full name"
                style={inp(!!errors.childName)}
                onFocus={(e) => (e.target.style.borderColor = "#0A8A80")}
                onBlur={(e) =>
                  (e.target.style.borderColor = errors.childName ? "#E45C48" : "rgba(10,138,128,0.2)")
                }
              />
              {errors.childName && <div style={err}>{errors.childName}</div>}
            </div>

            <div>
              <label style={lbl}>Child's Age *</label>
              <select
                value={form.childAge}
                onChange={(e) => setForm((f) => ({ ...f, childAge: e.target.value }))}
                style={inp(!!errors.childAge)}
                onFocus={(e) => (e.target.style.borderColor = "#0A8A80")}
                onBlur={(e) =>
                  (e.target.style.borderColor = errors.childAge ? "#E45C48" : "rgba(10,138,128,0.2)")
                }
              >
                <option value="">Select age</option>
                {Array.from({ length: 9 }, (_, i) => i + 6).map((a) => (
                  <option key={a} value={a}>{a} years</option>
                ))}
              </select>
              {errors.childAge && <div style={err}>{errors.childAge}</div>}
            </div>

            <div style={{ gridColumn: "1 / -1" }}>
              <label style={lbl}>Preferred Batch *</label>
              <select
                value={form.preferredBatch}
                onChange={(e) => setForm((f) => ({ ...f, preferredBatch: e.target.value, childGrade: "" }))}
                style={inp(!!errors.preferredBatch)}
                onFocus={(e) => (e.target.style.borderColor = "#0A8A80")}
                onBlur={(e) =>
                  (e.target.style.borderColor = errors.preferredBatch ? "#E45C48" : "rgba(10,138,128,0.2)")
                }
              >
                <option value="">Select your preferred batch</option>
                <optgroup label="— Juniors: Grade 1–4 —">
                  {BATCHES.filter((b) => b.startsWith("Logicoland")).map((b) => (
                    <option key={b} value={b}>
                      {b} · ₹{BATCH_PRICES[b].toLocaleString("en-IN")}
                    </option>
                  ))}
                </optgroup>
                <optgroup label="— Seniors: Grade 5–9 —">
                  {BATCHES.filter((b) => !b.startsWith("Logicoland")).map((b) => (
                    <option key={b} value={b}>
                      {b} · ₹{BATCH_PRICES[b].toLocaleString("en-IN")}
                    </option>
                  ))}
                </optgroup>
              </select>
              {errors.preferredBatch && <div style={err}>{errors.preferredBatch}</div>}
            </div>

            <div>
              <label style={lbl}>Child's Grade / Class *</label>
              <select
                value={form.childGrade}
                onChange={(e) => setForm((f) => ({ ...f, childGrade: e.target.value }))}
                disabled={!form.preferredBatch}
                style={{
                  ...inp(!!errors.childGrade),
                  opacity: form.preferredBatch ? 1 : 0.6,
                  cursor: form.preferredBatch ? "pointer" : "not-allowed",
                  backgroundColor: form.preferredBatch ? "transparent" : "rgba(0,0,0,0.05)",
                }}
                onFocus={(e) => {
                  if (form.preferredBatch) (e.target as HTMLSelectElement).style.borderColor = "#0A8A80";
                }}
                onBlur={(e) =>
                  ((e.target as HTMLSelectElement).style.borderColor = errors.childGrade ? "#E45C48" : "rgba(10,138,128,0.2)")
                }
              >
                <option value="">
                  {form.preferredBatch ? "Select grade" : "Select a batch first"}
                </option>
                {form.preferredBatch && form.preferredBatch.startsWith("Logicoland")
                  ? Array.from({ length: 4 }, (_, i) => i + 1).map((g) => (
                      <option key={g} value={`Grade ${g}`}>Grade {g}</option>
                    ))
                  : form.preferredBatch
                  ? Array.from({ length: 5 }, (_, i) => i + 5).map((g) => (
                      <option key={g} value={`Grade ${g}`}>Grade {g}</option>
                    ))
                  : null}
              </select>
              {!form.preferredBatch && (
                <div style={{ fontSize: 12, color: "#888", marginTop: 6, fontFamily: "'Outfit', sans-serif" }}>
                  Please select a preferred batch above to unlock grade options
                </div>
              )}
              {errors.childGrade && <div style={err}>{errors.childGrade}</div>}
            </div>

            <div style={{ gridColumn: "1 / -1" }}>
              <label style={lbl}>How Did You Hear About Us?</label>
              <select
                value={form.referral}
                onChange={(e) => setForm((f) => ({ ...f, referral: e.target.value }))}
                style={inp()}
                onFocus={(e) => (e.target.style.borderColor = "#0A8A80")}
                onBlur={(e) => (e.target.style.borderColor = "rgba(10,138,128,0.2)")}
              >
                <option value="">Select an option</option>
                {REFERRAL_OPTIONS.map((r) => (
                  <option key={r} value={r}>{r}</option>
                ))}
              </select>
            </div>

            <div style={{ gridColumn: "1 / -1" }}>
              <label style={{ display: "flex", alignItems: "flex-start", gap: 12, cursor: "pointer" }}>
                <input
                  type="checkbox"
                  checked={form.consent}
                  onChange={(e) => setForm((f) => ({ ...f, consent: e.target.checked }))}
                  style={{ marginTop: 2, width: 18, height: 18, accentColor: "#0A8A80", flexShrink: 0 }}
                />
                <span
                  style={{
                    fontFamily: "'Outfit', sans-serif",
                    fontSize: 14,
                    color: "#555",
                    lineHeight: 1.5,
                  }}
                >
                  I agree to the{" "}
                  <a href="/terms" style={{ color: "#0A8A80", fontWeight: 600 }}>Terms & Conditions</a>
                  {" "}and{" "}
                  <a href="/privacy" style={{ color: "#0A8A80", fontWeight: 600 }}>Privacy Policy</a>
                  {" "}and confirm that the information provided above is accurate.
                </span>
              </label>
              {errors.consent && <div style={err}>{errors.consent}</div>}
            </div>
          </div>

          <button
            onClick={handleSubmit}
            disabled={isProcessing}
            style={{
              width: "100%",
              marginTop: 28,
              background: isProcessing ? "#aaa" : "linear-gradient(135deg, #E45C48, #c94836)",
              color: "#fff",
              padding: "18px",
              borderRadius: 100,
              border: "none",
              fontFamily: "'Outfit', sans-serif",
              fontWeight: 700,
              fontSize: 18,
              cursor: isProcessing ? "not-allowed" : "pointer",
              boxShadow: isProcessing ? "none" : "0 6px 28px rgba(228,92,72,0.35)",
              transition: "transform 0.2s, box-shadow 0.2s",
            }}
            onMouseEnter={(e) => {
              if (!isProcessing) {
                (e.currentTarget as HTMLButtonElement).style.transform = "translateY(-2px)";
                (e.currentTarget as HTMLButtonElement).style.boxShadow = "0 10px 36px rgba(228,92,72,0.45)";
              }
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLButtonElement).style.transform = "translateY(0)";
              (e.currentTarget as HTMLButtonElement).style.boxShadow = "0 6px 28px rgba(228,92,72,0.35)";
            }}
          >
            {isProcessing ? "Processing..." : `Enroll Now — Pay ₹${activeFee.toLocaleString("en-IN")} →`}
          </button>

          <div
            style={{
              marginTop: 16,
              textAlign: "center",
              fontFamily: "'Outfit', sans-serif",
              fontSize: 13,
              color: "#888",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 8,
            }}
          >
            🔒 Secure payment via Razorpay · 256-bit SSL encrypted
          </div>
        </div>
      </div>
    </section>
  );
}



// ── Offerings Section ──────────────────────────────────────────────────────────
// ── Offerings Data ─────────────────────────────────────────────────────────────
const OFFERINGS = [
  // Junior (6–9 years)
  {
    ageGroup: "6–9 years",
    name: "Logicoland A",
    dates: "20 Apr – 24 Apr",
    time: "10:00 – 1:00",
    price: 2000,
    tag: "Includes 2 Books",
    color: "#0A8A80",
    accentColor: "#0B3F44",
  },
  {
    ageGroup: "6–9 years",
    name: "Logicoland B",
    dates: "27 Apr – 1 May",
    time: "10:00 – 1:00",
    price: 2000,
    tag: "Includes 2 Books",
    color: "#0A8A80",
    accentColor: "#0B3F44",
  },
  {
    ageGroup: "6–9 years",
    name: "Logicoland A",
    dates: "11 May – 15 May",
    time: "9:30 – 12:30",
    price: 2000,
    tag: "Includes 2 Books",
    color: "#0A8A80",
    accentColor: "#0B3F44",
  },
  {
    ageGroup: "6–9 years",
    name: "Logicoland B",
    dates: "18 May – 22 May",
    time: "9:30 – 12:30",
    price: 2000,
    tag: "Includes 2 Books",
    color: "#0A8A80",
    accentColor: "#0B3F44",
  },
  // Senior (10–14 years)
  {
    ageGroup: "10–14 years",
    name: "Quizzing",
    dates: "27 Apr – 1 May",
    time: "9:30 – 10:30",
    price: 1000,
    tag: null,
    color: "#E45C48",
    accentColor: "#AB4637",
  },
  {
    ageGroup: "10–14 years",
    name: "Speed Maths",
    dates: "4 May – 8 May",
    time: "9:30 – 11:00",
    price: 2500,
    tag: null,
    color: "#E45C48",
    accentColor: "#AB4637",
  },
  {
    ageGroup: "10–14 years",
    name: "Logical Reasoning",
    dates: "4 May – 8 May",
    time: "11:00 – 12:30",
    price: 2500,
    tag: null,
    color: "#E45C48",
    accentColor: "#AB4637",
  },
  {
    ageGroup: "10–14 years",
    name: "Speed Maths",
    dates: "18 May – 22 May",
    time: "9:30 – 11:00",
    price: 2500,
    tag: null,
    color: "#E45C48",
    accentColor: "#AB4637",
  },
  {
    ageGroup: "10–14 years",
    name: "Logical Reasoning",
    dates: "25 May – 29 May",
    time: "11:00 – 12:30",
    price: 2500,
    tag: null,
    color: "#E45C48",
    accentColor: "#AB4637",
  },
];

// ── Offering Card Component ───────────────────────────────────────────────────
function OfferingCard({ offering, index, isJunior, onEnroll }: { offering: any; index: number; isJunior: boolean; onEnroll?: (batch: string, price: number) => void }) {
  const { ref, visible } = useReveal();
  const batchLabel = `${offering.name} — ${offering.dates} (${offering.time})`;
  return (
    <div
      key={`${offering.name}-${offering.dates}-${index}`}
      ref={ref}
      className="bg-brand-tealDark"
      style={{
        border: `1px solid ${isJunior ? "rgba(10,138,128,0.35)" : "rgba(228,92,72,0.35)"}`,
        borderRadius: 20,
        padding: "28px 24px",
        position: "relative",
        overflow: "hidden",
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(40px)",
        transition: `all 0.6s ease ${index * 80}ms`,
        backdropFilter: "blur(8px)",
        cursor: "default",
      }}
     
    >
      {/* Top accent bar */}
      <div style={{
        position: "absolute", top: 0, left: 0, right: 0, height: 3,
        background: `linear-gradient(90deg, ${offering.color}, transparent)`,
        borderRadius: "20px 20px 0 0",
      }} />

      {/* Age badge */}
      <div style={{
        display: "inline-flex", alignItems: "center", gap: 6,
        background: `${offering.color}22`,
        border: `1px solid ${offering.color}44`,
        borderRadius: 100, padding: "4px 12px",
        marginBottom: 16,
        fontFamily: "'Outfit', sans-serif", fontSize: 11,
        fontWeight: 700, color: offering.color,
        letterSpacing: "0.07em", textTransform: "uppercase",
      }}>
        {offering.ageGroup}
      </div>

      {/* Workshop name */}
      <h3 style={{
        fontFamily: "'Outfit', sans-serif", fontWeight: 800,
        fontSize: 22, color: "#fff", margin: "0 0 20px", lineHeight: 1.2,
      }}>
        {offering.name}
      </h3>

      {/* Details */}
      <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 20 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{
            width: 32, height: 32, borderRadius: 8,
            background: "rgba(255,255,255,0.08)",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 14, flexShrink: 0,
          }}>📅</div>
          <span style={{
            fontFamily: "'Outfit', sans-serif", fontSize: 14,
            color: "rgba(255,255,255,0.80)", fontWeight: 500,
          }}>
            {offering.dates}
          </span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{
            width: 32, height: 32, borderRadius: 8,
            background: "rgba(255,255,255,0.08)",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 14, flexShrink: 0,
          }}>⏰</div>
          <span style={{
            fontFamily: "'Outfit', sans-serif", fontSize: 14,
            color: "rgba(255,255,255,0.80)", fontWeight: 500,
          }}>
            {offering.time}
          </span>
        </div>
      </div>

      {/* Book tag */}
      {offering.tag && (
        <div style={{
          display: "inline-flex", alignItems: "center", gap: 6,
          background: "rgba(216,174,79,0.15)",
          border: "1px solid rgba(216,174,79,0.30)",
          borderRadius: 8, padding: "6px 12px", marginBottom: 20,
          fontFamily: "'Outfit', sans-serif", fontSize: 12,
          fontWeight: 600, color: "#D8AE4F",
        }}>
          📚 {offering.tag}
        </div>
      )}

      {/* Divider */}
      <div style={{
        height: 1, background: "rgba(255,255,255,0.08)", marginBottom: 16,
      }} />

      {/* Price + Enroll button */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div>
          <div style={{
            fontFamily: "'Outfit', sans-serif", fontSize: 11,
            color: "rgba(255,255,255,0.4)", fontWeight: 600,
            textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 2,
          }}>
            Fee
          </div>
          <div style={{
            fontFamily: "'Outfit', sans-serif", fontWeight: 800,
            fontSize: 24, color: "#D8AE4F",
          }}>
            ₹{offering.price.toLocaleString("en-IN")}
          </div>
        </div>
        {onEnroll && (
          <button
            onClick={() => onEnroll(batchLabel, offering.price)}
            style={{
              background: offering.color,
              color: "#fff",
              border: "none",
              padding: "10px 20px",
              borderRadius: 100,
              fontFamily: "'Outfit', sans-serif",
              fontWeight: 700,
              fontSize: 13,
              cursor: "pointer",
              boxShadow: `0 4px 16px ${offering.color}44`,
              transition: "transform 0.2s, box-shadow 0.2s",
              whiteSpace: "nowrap",
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLButtonElement).style.transform = "translateY(-2px)";
              (e.currentTarget as HTMLButtonElement).style.boxShadow = `0 8px 24px ${offering.color}66`;
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLButtonElement).style.transform = "translateY(0)";
              (e.currentTarget as HTMLButtonElement).style.boxShadow = `0 4px 16px ${offering.color}44`;
            }}
          >
            Enroll →
          </button>
        )}
      </div>
    </div>
  );
}

// ── Offerings Section ─────────────────────────────────────────────────────────
function OfferingsSection({ onEnroll }: { onEnroll?: (batch: string, price: number) => void }) {
  const { ref, visible } = useReveal();
  const [activeTab, setActiveTab] = useState<"junior" | "senior">("junior");

  const juniorOfferings = OFFERINGS.filter((o) => o.ageGroup === "6–9 years");
  const seniorOfferings = OFFERINGS.filter((o) => o.ageGroup === "10–14 years");
  const displayed = activeTab === "junior" ? juniorOfferings : seniorOfferings;

  return (
    <section
      id="offerings"
      style={{
        padding: "100px 24px",
        position: "relative",
        overflow: "hidden",
      }}
      className="bg-brand-teal"
    >
      {/* Decorative blobs */}
      <div style={{
        position: "absolute", top: -100, right: -100,
        width: 400, height: 400, borderRadius: "50%",
        background: "rgba(216,174,79,0.07)", filter: "blur(80px)",
      }} />
      <div style={{
        position: "absolute", bottom: -80, left: -80,
        width: 320, height: 320, borderRadius: "50%",
        background: "rgba(228,92,72,0.06)", filter: "blur(60px)",
      }} />

      <div style={{ maxWidth: 1100, margin: "0 auto", position: "relative", zIndex: 1 }}>
        {/* Header */}
        <div
          ref={ref}
          style={{
            textAlign: "center",
            marginBottom: 56,
            opacity: visible ? 1 : 0,
            transform: visible ? "translateY(0)" : "translateY(32px)",
            transition: "all 0.7s ease",
          }}
        >
          <div style={{
            display: "inline-block",
            background: "rgba(216,255,255,0.15)",
            border: "1px solid rgba(216,174,79,0.35)",
            borderRadius: 100, padding: "5px 18px", marginBottom: 20,
            fontFamily: "'Outfit', sans-serif", fontSize: 14, fontWeight: 700,
            color: "#D8AE4F", letterSpacing: "0.10em", textTransform: "uppercase",
          }}>
            Summer 2026 Schedule
          </div>
          <h2
            className="font-heading text-white text-[36px] md:text-[44px] font-bold leading-tight"
            style={{ margin: "0 0 16px" }}
          >
            Choose Your Workshop
          </h2>
          <p style={{
            fontFamily: "'Outfit', sans-serif", fontSize: 18,
            color: "rgba(255,255,255,0.65)", maxWidth: 520,
            margin: "0 auto 40px", lineHeight: 1.7,
          }}>
            Multiple workshops across age groups — pick the one that fits your child's schedule and interests.
          </p>

          {/* Tab switcher */}
          <div style={{
            display: "inline-flex",
            background: "rgba(255,255,255,0.08)",
            border: "1px solid rgba(255,255,255,0.12)",
            borderRadius: 100, padding: 4, gap: 4,
          }}>
            {(["junior", "senior"] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                style={{
                  padding: "10px 28px",
                  borderRadius: 100, border: "none", cursor: "pointer",
                  fontFamily: "'Outfit', sans-serif", fontWeight: 700, fontSize: 15,
                  transition: "all 0.3s ease",
                  background: activeTab === tab
                    ? (tab === "junior" ? "#0A8A80" : "#E45C48")
                    : "transparent",
                  color: activeTab === tab ? "#fff" : "rgba(255,255,255,0.55)",
                  boxShadow: activeTab === tab ? "0 4px 16px rgba(0,0,0,0.2)" : "none",
                }}
              >
                {tab === "junior" ? " Ages 6–9" : " Ages 10–14"}
              </button>
            ))}
          </div>
        </div>

        {/* Cards grid */}
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
          gap: 20,
        }}>
          {displayed.map((offering:any, i:number) => (
            <OfferingCard key={`${offering.name}-${offering.dates}-${i}`} offering={offering} index={i} isJunior={activeTab === "junior"} onEnroll={onEnroll} />
          ))}
        </div>

        {/* Bottom note */}
        
      </div>
    </section>
  );
}

// ── Shared card primitives ────────────────────────────────────────────────────
function CoralCard({ children, delay }: { children: React.ReactNode; delay: number }) {
  const { ref, visible } = useReveal();
  return (
    <div
      ref={ref}
      style={{
        background: "rgba(255,255,255,0.16)",
        border: "1px solid rgba(255,255,255,0.28)",
        borderRadius: 20,
        padding: 32,
        backdropFilter: "blur(8px)",
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(40px)",
        transition: `all 0.7s ease ${delay}ms`,
      }}
      onMouseEnter={(e) => {
        (e.currentTarget as HTMLDivElement).style.background = "rgba(255,255,255,0.24)";
        (e.currentTarget as HTMLDivElement).style.transform = "translateY(-4px)";
      }}
      onMouseLeave={(e) => {
        (e.currentTarget as HTMLDivElement).style.background = "rgba(255,255,255,0.16)";
        (e.currentTarget as HTMLDivElement).style.transform = "translateY(0)";
      }}
    >
      {children}
    </div>
  );
}

function GoldCard({ children, delay }: { children: React.ReactNode; delay: number }) {
  const { ref, visible } = useReveal();
  return (
    <div
      ref={ref}
      style={{
        background: "rgba(255,255,255,0.38)",
        border: "1px solid rgba(255,255,255,0.55)",
        borderRadius: 20,
        padding: 32,
        backdropFilter: "blur(8px)",
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(40px)",
        transition: `all 0.7s ease ${delay}ms`,
      }}
      onMouseEnter={(e) => {
        (e.currentTarget as HTMLDivElement).style.background = "rgba(255,255,255,0.52)";
        (e.currentTarget as HTMLDivElement).style.transform = "translateY(-4px)";
        (e.currentTarget as HTMLDivElement).style.boxShadow = "0 12px 36px rgba(0,0,0,0.09)";
      }}
      onMouseLeave={(e) => {
        (e.currentTarget as HTMLDivElement).style.background = "rgba(255,255,255,0.38)";
        (e.currentTarget as HTMLDivElement).style.transform = "translateY(0)";
        (e.currentTarget as HTMLDivElement).style.boxShadow = "none";
      }}
    >
      {children}
    </div>
  );
}

// ── Shared CTA buttons ────────────────────────────────────────────────────────
function CoralBtn() {
  return (
    <a
      href="#enroll"
      style={{
        background: "linear-gradient(135deg, #E45C48, #c94836)",
        color: "#fff",
        padding: "18px 44px",
        borderRadius: 100,
        fontFamily: "'Outfit', sans-serif",
        fontWeight: 700,
        fontSize: 18,
        textDecoration: "none",
        boxShadow: "0 6px 32px rgba(228,92,72,0.35)",
        display: "inline-block",
        transition: "transform 0.2s, box-shadow 0.2s",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = "translateY(-3px)";
        e.currentTarget.style.boxShadow = "0 12px 40px rgba(228,92,72,0.45)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = "translateY(0)";
        e.currentTarget.style.boxShadow = "0 6px 32px rgba(228,92,72,0.35)";
      }}
    >
      Enroll Now →
    </a>
  );
}

function WhiteOnCoralBtn() {
  return (
    <a
      href="#enroll"
      style={{
        background: "#fff",
        color: "#E45C48",
        padding: "18px 44px",
        borderRadius: 100,
        fontFamily: "'Outfit', sans-serif",
        fontWeight: 700,
        fontSize: 18,
        textDecoration: "none",
        boxShadow: "0 6px 24px rgba(0,0,0,0.14)",
        display: "inline-block",
        transition: "transform 0.2s",
      }}
      onMouseEnter={(e) => (e.currentTarget.style.transform = "translateY(-3px)")}
      onMouseLeave={(e) => (e.currentTarget.style.transform = "translateY(0)")}
    >
      Enroll Now →
    </a>
  );
}

function DarkOnGoldBtn() {
  return (
    <a
      href="#enroll"
      style={{
        background: "#0B3F44",
        color: "#fff",
        padding: "18px 44px",
        borderRadius: 100,
        fontFamily: "'Outfit', sans-serif",
        fontWeight: 700,
        fontSize: 18,
        textDecoration: "none",
        boxShadow: "0 6px 28px rgba(11,63,68,0.30)",
        display: "inline-block",
        transition: "transform 0.2s",
      }}
      onMouseEnter={(e) => (e.currentTarget.style.transform = "translateY(-3px)")}
      onMouseLeave={(e) => (e.currentTarget.style.transform = "translateY(0)")}
    >
      Enroll Now →
    </a>
  );
}

// ── Main Page ─────────────────────────────────────────────────────────────────
export default function SummerCampPage() {
  const [selectedBatch, setSelectedBatch] = useState("");
  const [selectedPrice, setSelectedPrice] = useState<number | null>(null);

  const handleEnroll = (batch: string, price: number) => {
    setSelectedBatch(batch);
    setSelectedPrice(price);
    setTimeout(() => {
      document.getElementById("enroll")?.scrollIntoView({ behavior: "smooth" });
    }, 100);
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700;800&display=swap');
        * { box-sizing: border-box; }
        html { scroll-behavior: smooth; }
        body { margin: 0; font-family: 'Outfit', sans-serif; }
        @keyframes float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-12px); }
        }
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
      <NavBar />
      <HeroSection />
      <WhyCampsSection />
      <WhyLogicologySection />
      <CurriculumSection />
      <HowToEnrollSection />
      <TestimonialsSection />
      
      <OfferingsSection onEnroll={handleEnroll} />
      <FAQSection />
      <EnrollmentSection selectedBatch={selectedBatch} selectedPrice={selectedPrice} />
      <SiteFooter />
    </>
  );
}
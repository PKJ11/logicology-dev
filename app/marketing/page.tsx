// app/marketing/page.tsx
"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";

export default function MarketingPage() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [currentVideoSlide, setCurrentVideoSlide] = useState(0);
  const [activeTab, setActiveTab] = useState("strategy");
  const videoTrackRef = useRef<HTMLDivElement>(null);

  const videoSlides = [
    {
      src: "/videos/Foldax long_[Final].mp4",
      badge: "Brand Film",
      title: "Foldax — Long Form",
      description: "Full-length brand video showcasing Foldax's product story and visual identity.",
    },
    {
      src: "/videos/Foldax_Video_Ad_1.mp4",
      badge: "Video Ad",
      title: "Foldax — Video Ad 1",
      description: "Short-form video advertisement crafted for digital campaign performance.",
    },
    {
      src: "/videos/Foldax_Video_Ad_2.mp4",
      badge: "Video Ad",
      title: "Foldax — Video Ad 2",
      description: "Alternate cut for A/B testing across social and paid channels.",
    },
  ];

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    // Animation observer removed
  }, []);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleVideoSlide = (direction: "prev" | "next") => {
    let newSlide = direction === "next" ? currentVideoSlide + 1 : currentVideoSlide - 1;
    if (newSlide >= videoSlides.length) newSlide = 0;
    if (newSlide < 0) newSlide = videoSlides.length - 1;
    setCurrentVideoSlide(newSlide);
  };

  const toggleVideoPlay = (e: React.MouseEvent<HTMLButtonElement>) => {
    const btn = e.currentTarget;
    const wrap = btn.closest(".video-thumb-wrap");
    const vid = wrap?.querySelector("video");

    if (!vid) return;

    // Pause all other videos
    document.querySelectorAll(".video-thumb-wrap video").forEach((v) => {
      if (v !== vid && !(v as HTMLVideoElement).paused) {
        (v as HTMLVideoElement).pause();
        const ob = v.closest(".video-thumb-wrap")?.querySelector(".play-btn");
        if (ob) resetPlayBtn(ob as HTMLButtonElement);
      }
    });

    if (vid.paused) {
      vid.play();
      btn.classList.add("playing");
      btn.innerHTML = '<span class="text-white text-sm tracking-widest">❚❚</span>';
    } else {
      vid.pause();
      resetPlayBtn(btn);
    }

    vid.onended = () => resetPlayBtn(btn);
  };

  const resetPlayBtn = (btn: HTMLButtonElement) => {
    btn.classList.remove("playing");
    btn.innerHTML = `<svg viewBox="0 0 24 24" fill="currentColor" class="w-5 h-5 ml-0.5"><polygon points="5,3 19,12 5,21"/></svg>`;
  };

  const handleSubmit = (e: React.MouseEvent<HTMLButtonElement>) => {
    const btn = e.currentTarget;
    btn.textContent = "Message Sent ✓";
    btn.style.backgroundColor = "#047FFF";
    btn.style.color = "white";
    setTimeout(() => {
      btn.textContent = "Send Message";
      btn.style.backgroundColor = "";
      btn.style.color = "";
    }, 3000);
  };

  return (
    <main className="min-h-screen bg-[#F6FAFA] text-[#17224C]">
      {/* Custom styles to match the new design with updated color scheme */}
      <style jsx global>{`
        :root {
          --brand-navy: #17224c;
          --brand-blue: #047fff;
          --brand-cyan: #19e9e3;
          --brand-bg: #f6fafa;
          --brand-bg-alt: #e0e4ee;
          --brand-white: #ffffff;
          --brand-gray-light: #e0e4ee;
          --brand-gray-mid: #8a9ab0;
          --brand-gray-dark: #3a4a60;
          --brand-text-primary: #17224c;
          --brand-text-muted: #5a6e88;
        }

        body {
          font-family: "Inter", sans-serif;
          background-color: #f6fafa;
        }

        h1,
        h2,
        h3,
        h4,
        h5,
        h6,
        .font-heading {
          font-family: "Barlow", sans-serif;
          font-weight: 600;
          line-height: 1.2;
          letter-spacing: -0.02em;
        }

        .font-heading-bold {
          font-family: "Barlow", sans-serif;
          font-weight: 700;
          letter-spacing: -0.02em;
        }

        .hero-card-stack {
          position: relative;
          width: 380px;
          height: 420px;
        }

        @media (max-width: 900px) {
          .hero-visual {
            display: none;
          }
        }

        .hero-bg-gradient {
          background: #e0e4ee;
        }

        .hero-isometric-overlay {
          display: none;
        }

        .hero-grid-overlay {
          display: none;
        }

        .glow-blue {
          box-shadow:
            0 0 40px rgba(4, 127, 255, 0.25),
            0 20px 60px rgba(23, 34, 76, 0.15);
        }

        .glow-cyan {
          box-shadow:
            0 0 30px rgba(25, 233, 227, 0.2),
            0 20px 60px rgba(23, 34, 76, 0.12);
        }

        .btn-primary {
          background: #047fff;
          border-radius: 50px;
          transition: all 0.25s ease;
        }
        .btn-primary:hover {
          background: #0066dd;
          box-shadow: 0 0 24px rgba(4, 127, 255, 0.45);
          transform: translateY(-1px);
        }

        .btn-secondary {
          border: 2px solid rgba(23, 34, 76, 0.25);
          color: #17224c;
          border-radius: 50px;
          transition: all 0.25s ease;
        }
        .btn-secondary:hover {
          border-color: #047fff;
          color: #047fff;
          background: rgba(4, 127, 255, 0.06);
        }

        /* Hero image styles */
        .hero-image-container {
          position: relative;
          width: 100%;
          max-width: 500px;
          height: auto;
          animation: float 6s ease-in-out infinite;
        }

        @keyframes float {
          0%,
          100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-20px);
          }
        }

        .card-hover {
          transition: all 0.25s ease;
        }
        .card-hover:hover {
          border-color: #047fff !important;
          box-shadow: 0 16px 48px rgba(4, 127, 255, 0.12);
          transform: translateY(-2px);
        }

        .tab-fade-in {
          animation: none;
        }

        .accent-line {
          display: inline-block;
          width: 28px;
          height: 2px;
          background: linear-gradient(90deg, #047fff, #19e9e3);
          margin-right: 10px;
          vertical-align: middle;
        }

        .section-tag {
          display: inline-flex;
          align-items: center;
          font-size: 0.65rem;
          letter-spacing: 0.15em;
          text-transform: uppercase;
          font-weight: 600;
          color: #047fff;
          margin-bottom: 1rem;
          font-family: "Inter", sans-serif;
        }

        .cyan-tag {
          color: #19e9e3;
        }

        .scrollbar-none::-webkit-scrollbar {
          display: none;
        }
      `}</style>

      {/* Google Fonts - Updated to Inter and Barlow */}
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      <link
        href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&family=Barlow:wght@400;500;600;700;800&display=swap"
        rel="stylesheet"
      />

      {/* NAVBAR */}
      <nav
        className={`fixed left-0 right-0 top-0 z-50 flex h-[72px] items-center justify-between bg-[rgba(224,228,238,0.95)] px-[5%] backdrop-blur-[14px] ${
          scrolled ? "border-b border-[#c8cedd] shadow-[0_4px_32px_rgba(23,34,76,0.08)]" : ""
        }`}
      >
        <Image
          src="https://ik.imagekit.io/pratik2002/logicology-marketing-removebg-preview.png"
          alt="Logicology Marketing Logo"
          width={120}
          height={40}
          className="h-10 w-auto"
          priority
        />
        <ul className="hidden list-none gap-8 lg:flex">
          {[
            "Why Us",
            "The Numbers Speak",
            "Is This for You",
            "Start-up Packs",
            "Examples of Work",
            "About Us",
          ].map((item, i) => (
            <li key={i} className={i >= 4 ? "hidden xl:block" : ""}>
              <a
                href={`#${item.toLowerCase().replace(/\s+/g, "-")}`}
                className="text-xs font-medium uppercase tracking-widest text-[#3a4a60] no-underline transition-colors hover:text-[#047FFF]"
                style={{ fontFamily: "Inter, sans-serif" }}
              >
                {item}
              </a>
            </li>
          ))}
        </ul>
        <div className="flex items-center gap-8">
          <a
            href="#contact"
            className="hidden whitespace-nowrap rounded-sm bg-[#17224C] px-5 py-2.5 text-xs font-semibold uppercase tracking-widest text-white transition-colors hover:bg-[#047FFF] lg:block"
            style={{ fontFamily: "Inter, sans-serif" }}
          >
            Book a Consultation
          </a>
          <button
            className="flex flex-col gap-1 p-1 lg:hidden"
            onClick={toggleMenu}
            aria-label="Toggle menu"
          >
            <span className="block h-0.5 w-6 bg-[#17224C] transition-transform"></span>
            <span className="block h-0.5 w-6 bg-[#17224C] transition-opacity"></span>
            <span className="block h-0.5 w-6 bg-[#17224C] transition-transform"></span>
          </button>
        </div>
      </nav>

      {/* Mobile Menu */}
      <div
        className={`fixed left-0 right-0 top-[72px] z-40 border-b border-[#E0E4EE] bg-[#F6FAFA] px-[5%] py-6 shadow-lg ${
          isMenuOpen ? "block" : "hidden"
        }`}
      >
        {[
          "Why Outsourced",
          "Cost Comparison",
          "Is This for You",
          "Offerings",
          "Pricing",
          "Process",
          "Work",
          "Book a Consultation",
        ].map((item, i) => (
          <a
            key={i}
            href={`#${item.toLowerCase().replace(/\s+/g, "-")}`}
            className="block border-b border-[#E0E4EE] py-3 text-[#17224C] no-underline last:border-b-0"
            onClick={toggleMenu}
            style={{ fontFamily: "Inter, sans-serif" }}
          >
            {item}
          </a>
        ))}
      </div>

      {/* HERO SECTION — Light theme with single image */}
      <section
        id="home"
        className="hero-bg-gradient relative flex min-h-screen items-center overflow-hidden px-[5%] py-20"
      >
        <div className="relative z-10 mx-auto grid w-full max-w-[1160px] grid-cols-1 items-center gap-12 lg:grid-cols-2">
          {/* Left: Text Content */}
          <div>
            <h1
              className="font-heading-bold mb-4 leading-tight text-[#17224C]"
              style={{ fontSize: "clamp(2.8rem, 5vw, 4.5rem)" }}
            >
              <span style={{ color: "#047FFF", fontWeight: 500, fontFamily: "Barlow, sans-serif" }}>
                Strategic
              </span>
              <br />
              <span
                style={{
                  fontFamily: "Barlow, sans-serif",
                  fontWeight: 800,
                  fontSize: "1.18em",
                  color: "#17224C",
                  letterSpacing: "-0.02em",
                }}
              >
                Marketing
              </span>
            </h1>
            <p
              className="mb-8 max-w-[480px] text-base leading-relaxed text-[#5a6e88]"
              style={{ fontFamily: "Inter, sans-serif" }}
            >
              Don't have a Marketing team or need to supplement your lean Marketing team? We are here to help! Be it Strategy, ABM, Content Marketing, Branding, Digital Presence, or Execution we do it all without the overhead of a full in-house department. Premium outcomes. Flexible engagements.
            </p>
            <div className="flex flex-wrap items-center gap-4">
              <a
                href="#contact"
                className="btn-primary px-8 py-3 text-sm font-semibold text-white no-underline"
                style={{ fontFamily: "Inter, sans-serif" }}
              >
                Know more
              </a>
              <a
                href="#offerings"
                className="btn-secondary bg-transparent px-8 py-3 text-sm font-semibold no-underline"
                style={{ fontFamily: "Inter, sans-serif" }}
              >
                Explore Services
              </a>
            </div>
          </div>

          {/* Right: Single Image */}
          <div className="hero-visual relative flex items-center justify-center pr-4">
            <div className="hero-image-container">
              <Image
                src="/Images/HIGHHEROIMAGE.png"
                alt="Marketing Strategy Illustration"
                width={500}
                height={500}
                className="h-auto w-full object-contain"
                priority
              />
            </div>
          </div>
        </div>
      </section>

      {/* WHY OUTSOURCED */}
      <section id="why-us" className="bg-white px-[5%] py-24">
        <div className="mx-auto max-w-[1160px]">
          <div className="section-tag">
            <span className="accent-line"></span>The Case for Outsourcing
          </div>
          <h2 className="mb-5 font-heading text-4xl text-[#17224C] sm:text-5xl">
            Why Outsourced
            <br />
            Marketing Services?
          </h2>
          <p
            className="max-w-[540px] text-base leading-relaxed text-[#5a6e88]"
            style={{ fontFamily: "Inter, sans-serif" }}
          >
            World-class quality with high RoI. Proven expertise, high pace execution, and full flexibility. We work as your partners to provide premium services.
          </p>
          <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {[
              {
                title: "Senior-Level Expertise",
                desc: "Access strategic marketing leadership and deep cross-functional expertise — without the full-time overhead of a CMO salary.",
              },
              {
                title: "Higher ROI",
                desc: "Optimize spend by investing in outcomes, not headcount. Every rupee goes toward results, not operational bloat.",
              },
              {
                title: "Execution + Strategy",
                desc: "Get both high-level strategic direction and practical, polished implementation — from the same trusted partner.",
              },
              {
                title: "Flexibility",
                desc: "Scale support up or down based on your business stage, priorities, and growth trajectory. No long-term lock-in.",
              },
            ].map((item, i) => (
              <div
                key={i}
                className="card-hover rounded-lg border-2 border-[#E0E4EE] bg-[#F6FAFA] p-8"
              >
                <h3 className="mb-2 font-heading text-xl text-[#17224C]">{item.title}</h3>
                <p
                  className="text-sm leading-relaxed text-[#5a6e88]"
                  style={{ fontFamily: "Inter, sans-serif" }}
                >
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* COST COMPARISON */}
      <section id="the-numbers-speak" className="bg-white px-[5%] py-24">
        <div className="mx-auto max-w-[1160px]">
          <div className="section-tag">
            <span className="accent-line"></span>The Numbers
          </div>
          <h2 className="mb-5 font-heading text-4xl text-[#17224C] sm:text-5xl">
            Typical Marketing Team Cost (USD)
          </h2>
          <p
            className="mx-auto mb-12 max-w-[700px] rounded-full px-8 py-5 text-center font-heading text-xl italic text-white sm:text-2xl"
            style={{ background: "linear-gradient(135deg, #17224C, #047FFF)" }}
          >
            "A Marketing Team in the US costs you at least $30,000 per month"
          </p>

          <div className="mx-auto grid max-w-[960px] grid-cols-1 gap-8 lg:grid-cols-2">
            {/* In-House Card */}
            <div className="rounded-lg border-2 border-[#E0E4EE] bg-[#F6FAFA] p-8">
              <h3 className="mb-5 font-heading text-xl text-[#17224C]">In-House Marketing Team</h3>
              {[
                { role: "Head of Marketing / Manager", amount: "$120,000" },
                { role: "Copywriting & Content Expert", amount: "$60,000" },
                { role: "Graphic Designer", amount: "$36,000" },
                { role: "Video Editor", amount: "$25,000" },
                { role: "Campaign / Social Media Mgr", amount: "$40,000" },
                { role: "Cold Outreach Support", amount: "$20,000" },
                { role: "Pre-sales / Pitch Deck Support", amount: "$60,000" },
              ].map((item, i) => (
                <div
                  key={i}
                  className="flex items-start justify-between border-b border-[#E0E4EE] py-2 text-sm"
                >
                  <span className="text-[#3a4a60]" style={{ fontFamily: "Inter, sans-serif" }}>
                    {item.role}
                  </span>
                  <span
                    className="ml-4 whitespace-nowrap font-bold text-[#17224C]"
                    style={{ fontFamily: "Inter, sans-serif" }}
                  >
                    {item.amount}
                  </span>
                </div>
              ))}
              <div className="mt-2 flex items-start justify-between border-t-2 border-[#17224C] pt-4 font-semibold">
                <span
                  className="font-bold text-[#17224C]"
                  style={{ fontFamily: "Inter, sans-serif" }}
                >
                  Total Annual (Lower Bound)
                </span>
                <span
                  className="font-bold text-[#17224C]"
                  style={{ fontFamily: "Inter, sans-serif" }}
                >
                  $360,000
                </span>
              </div>
              <p
                className="mt-3 text-xs leading-relaxed text-[#8a9ab0]"
                style={{ fontFamily: "Inter, sans-serif" }}
              >
                Does not include tool licenses, hiring delays, management overhead, or employee
                benefits.
              </p>
            </div>

            {/* Fractional Card */}
            <div
              className="rounded-lg border-2 p-8"
              style={{
                background: "linear-gradient(145deg, #17224C 0%, #0d1a3d 100%)",
                borderColor: "#047FFF",
              }}
            >
              <h3 className="mb-5 font-heading text-xl text-white">
                Fractional CMO + Outsourced Marketing
              </h3>
              {[
                "Significantly lower monthly commitment",
                "Specialized expertise across all functions",
                "Faster execution, no hiring delays",
                "Minimal management overhead from your side",
                "All tool and license costs covered",
                "Scalable and fully focused support",
                "Strategic clarity built-in from day one",
                "Flexible pay-as-you-go model — pause anytime",
              ].map((item, i) => (
                <div key={i} className="flex items-start gap-3 py-2 text-sm text-white/85">
                  <span
                    className="flex-shrink-0 font-bold"
                    style={{ color: "#19E9E3", fontFamily: "Inter, sans-serif" }}
                  >
                    ✦
                  </span>
                  <span style={{ fontFamily: "Inter, sans-serif" }}>{item}</span>
                </div>
              ))}
              <div
                className="mt-6 rounded-lg p-5 text-center"
                style={{
                  background: "rgba(4, 127, 255, 0.15)",
                  border: "1px solid rgba(4, 127, 255, 0.3)",
                }}
              >
                <div
                  className="mb-1 text-xs uppercase tracking-widest"
                  style={{ color: "#19E9E3", fontFamily: "Inter, sans-serif" }}
                >
                  Save Up To
                </div>
                <div className="font-heading text-4xl font-bold" style={{ color: "#047FFF" }}>
                  70%
                </div>
                <div className="text-sm text-white/60" style={{ fontFamily: "Inter, sans-serif" }}>
                  compared to full in-house team
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FIT SECTION */}
      <section id="is-this-for-you" className="bg-[#F6FAFA] px-[5%] py-24">
        <div className="mx-auto max-w-[1160px]">
          <div className="section-tag">
            <span className="accent-line"></span>Ideal Fit
          </div>
          <h2 className="mb-5 font-heading text-4xl text-[#17224C] sm:text-5xl">
            Is This for You?
          </h2>
          <p
            className="max-w-[540px] text-base leading-relaxed text-[#5a6e88]"
            style={{ fontFamily: "Inter, sans-serif" }}
          >
            This will work for you if:
          </p>

          <div className="mt-10 grid max-w-[820px] grid-cols-1 gap-3 md:grid-cols-2">
            {[
              "You are a small or medium business with variable, patchy marketing demands",
              "You need world-class collaterals and deal with stakeholders who have high quality expectations",
              "You want to spend less time on marketing and stay focused on your core business",
              "You are convinced that top-quality design and marketing communication is a differentiator",
              "You want senior-level strategic thinking without the cost of a full-time hire",
              "You need support across brand, digital presence, and communication assets",
            ].map((text, i) => (
              <div
                key={i}
                className="card-hover flex items-start gap-3 rounded-lg border-2 border-[#E0E4EE] bg-white p-4"
              >
                <div
                  className="mt-0.5 flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full"
                  style={{ background: "linear-gradient(135deg, #047FFF, #19E9E3)" }}
                >
                  <svg viewBox="0 0 12 12" className="h-3 w-3">
                    <polyline points="2,6 5,9 10,3" stroke="white" fill="none" strokeWidth="2.5" />
                  </svg>
                </div>
                <p
                  className="text-sm leading-relaxed text-[#3a4a60]"
                  style={{ fontFamily: "Inter, sans-serif" }}
                >
                  {text}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* STRATEGY COMPARISON */}
      <section
        id="strategy"
        className="px-[5%] py-24"
        style={{ background: "linear-gradient(160deg, #17224C 0%, #0d1a3d 100%)" }}
      >
        <div className="mx-auto max-w-[1160px]">
          <div className="section-tag cyan-tag">
            <span className="accent-line"></span>Strategic Choice
          </div>
          <h2 className="mb-5 font-heading text-4xl text-white sm:text-5xl">
            In-House vs Outsourced
          </h2>
          <p
            className="max-w-[540px] text-base leading-relaxed text-white/55"
            style={{ fontFamily: "Inter, sans-serif" }}
          >
            Schedule a call to understand how we help our customers deliver world-class outcomes. We work only on high value, long term engagements. If you are looking for a low value one time project, look elsewhere.
          </p>

          <div className="mt-12 overflow-x-auto">
            <table className="w-full max-w-[900px] border-collapse">
              <thead>
                <tr>
                  <th
                    className="p-4 text-left text-xs font-medium uppercase tracking-widest text-white/45"
                    style={{ fontFamily: "Inter, sans-serif" }}
                  >
                    Dimension
                  </th>
                  <th
                    className="p-4 text-left text-xs font-medium uppercase tracking-widest text-white/45"
                    style={{ fontFamily: "Inter, sans-serif" }}
                  >
                    In-House Team
                  </th>
                  <th
                    className="p-4 text-left text-xs font-medium uppercase tracking-widest"
                    style={{ color: "#19E9E3", fontFamily: "Inter, sans-serif" }}
                  >
                    Fractional CMO / Outsourced ✦
                  </th>
                </tr>
              </thead>
              <tbody>
                {[
                  { dim: "Monthly Cost", lose: "$30,000+ USD", win: "70% Less", winTag: true },
                  {
                    dim: "Speed to Start",
                    lose: "Weeks to months of hiring",
                    win: "Immediate kickoff",
                    winTag: true,
                  },
                  {
                    dim: "Flexibility",
                    lose: "Long-term salary commitment",
                    win: "Pay-as-you-go, pause anytime",
                    winTag: true,
                  },
                  {
                    dim: "Senior Expertise",
                    lose: "Depends on who you hire",
                    win: "Built-in from day one",
                    winTag: true,
                  },
                  {
                    dim: "Execution Breadth",
                    lose: "Siloed — each role limited",
                    win: "Full-spectrum delivery",
                    winTag: true,
                  },
                  {
                    dim: "Overhead",
                    lose: "Tools, benefits, management",
                    win: "All included, zero overhead",
                    winTag: true,
                  },
                  {
                    dim: "Scalability",
                    lose: "Headcount-bound growth",
                    win: "Scale scope, not staff",
                    winTag: true,
                  },
                  {
                    dim: "Focus on ROI",
                    lose: "Effort measured, not outcomes",
                    win: "Outcome-driven by design",
                    winTag: true,
                  },
                ].map((row, i) => (
                  <tr key={i} className="transition-colors hover:bg-white/5">
                    <td
                      className="border-t border-white/5 p-4 text-xs uppercase tracking-widest text-white/40"
                      style={{ fontFamily: "Inter, sans-serif" }}
                    >
                      {row.dim}
                    </td>
                    <td
                      className="border-t border-white/5 p-4 text-sm italic text-white/30"
                      style={{ fontFamily: "Inter, sans-serif" }}
                    >
                      {row.lose}
                    </td>
                    <td className="border-t border-white/5 p-4 text-sm text-white">
                      {row.winTag ? (
                        <span
                          className="inline-block rounded px-2 py-0.5 text-xs font-semibold uppercase tracking-widest"
                          style={{
                            background: "rgba(4, 127, 255, 0.2)",
                            color: "#19E9E3",
                            fontFamily: "Inter, sans-serif",
                          }}
                        >
                          {row.win}
                        </span>
                      ) : (
                        <span style={{ fontFamily: "Inter, sans-serif" }}>{row.win}</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* OFFERINGS WITH TABS */}
      <section id="offerings" className="bg-white px-[5%] py-24">
        <div className="mx-auto max-w-[1160px]">
          <div className="section-tag">
            <span className="accent-line"></span>Services
          </div>
          <h2 className="mb-5 font-heading text-4xl text-[#17224C] sm:text-5xl">Our Offerings</h2>
          <p
            className="max-w-[540px] text-base leading-relaxed text-[#5a6e88]"
            style={{ fontFamily: "Inter, sans-serif" }}
          >
            A comprehensive suite of marketing services designed to cover every dimension of your
            growth.
          </p>

          {/* Tab Bar */}
          <div className="mt-12 flex flex-wrap gap-2 rounded-t-xl border-2 border-b-0 border-[#E0E4EE] bg-[#F6FAFA] p-2 pb-0">
            {[
              { id: "strategy", label: "Strategy & Brand" },
              { id: "digital", label: "Digital Presence" },
              { id: "sales", label: "Sales & Collateral" },
              { id: "content", label: "Content & Visibility" },
            ].map((tab) => (
              <button
                key={tab.id}
                className={`flex items-center gap-2 whitespace-nowrap rounded-t-lg px-5 py-2.5 text-sm font-semibold transition-all ${
                  activeTab === tab.id
                    ? "border-2 border-[#E0E4EE] border-b-white bg-white text-[#17224C]"
                    : "bg-transparent text-[#5a6e88] hover:bg-[rgba(4,127,255,0.05)] hover:text-[#17224C]"
                }`}
                style={
                  activeTab === tab.id
                    ? { borderBottomColor: "white", fontFamily: "Inter, sans-serif" }
                    : { fontFamily: "Inter, sans-serif" }
                }
                onClick={() => setActiveTab(tab.id)}
              >
                <span>{tab.label}</span>
              </button>
            ))}
          </div>

          {/* Tab Panels */}
          <div className="rounded-b-xl border-2 border-t-0 border-[#E0E4EE] bg-white p-8 md:p-10">
            {/* Strategy & Brand */}
            {activeTab === "strategy" && (
              <div className="tab-fade-in">
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {[
                    {
                      title: "Fractional CMO Consultation",
                      desc: "Brand positioning, GTM strategies, ABM, lead gen, and brand storyboarding.",
                    },
                    {
                      title: "Brand Guidelines",
                      desc: "Brand identity, brand book, rebranding after M&A, and complete brand storytelling.",
                    },
                    {
                      title: "LinkedIn Branding",
                      desc: "Full turnkey social media brand management with monthly reporting and LinkedIn strategy.",
                    },
                  ].map((item, i) => (
                    <div
                      key={i}
                      className="card-hover rounded-lg border-2 border-[#E0E4EE] bg-[#F6FAFA] p-6"
                    >
                      <h4 className="mb-1 font-heading font-semibold text-[#17224C]">
                        {item.title}
                      </h4>
                      <p
                        className="text-xs leading-relaxed text-[#5a6e88]"
                        style={{ fontFamily: "Inter, sans-serif" }}
                      >
                        {item.desc}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Digital Presence */}
            {activeTab === "digital" && (
              <div className="tab-fade-in">
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {[
                    {
                      title: "Website Development",
                      desc: "End-to-end website development with a full turnkey solution and modern design.",
                    },
                    {
                      title: "Website Maintenance",
                      desc: "Ongoing updates, design changes, and technical upkeep to keep your site performing.",
                    },
                    {
                      title: "Typeform Integration",
                      desc: "Seamless integration of lead capture forms and surveys into your digital presence.",
                    },
                  ].map((item, i) => (
                    <div
                      key={i}
                      className="card-hover rounded-lg border-2 border-[#E0E4EE] bg-[#F6FAFA] p-6"
                    >
                      <h4 className="mb-1 font-heading font-semibold text-[#17224C]">
                        {item.title}
                      </h4>
                      <p
                        className="text-xs leading-relaxed text-[#5a6e88]"
                        style={{ fontFamily: "Inter, sans-serif" }}
                      >
                        {item.desc}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Sales & Collateral */}
            {activeTab === "sales" && (
              <div className="tab-fade-in">
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                  {[
                    {
                      title: "PowerPoint Decks",
                      desc: "Pitch decks, corporate overviews, and product decks — 15–20 polished slides each.",
                    },
                    {
                      title: "PowerPoint Template",
                      desc: "Custom branded templates your team can use for any internal or external deck.",
                    },
                    {
                      title: "Marketing Collateral",
                      desc: "Single-pagers, two-pagers, and four-pagers for sales enablement and outreach.",
                    },
                    {
                      title: "Creative Print Designs",
                      desc: "Business cards, letterheads, banners, and event-ready print collateral.",
                    },
                  ].map((item, i) => (
                    <div
                      key={i}
                      className="card-hover rounded-lg border-2 border-[#E0E4EE] bg-[#F6FAFA] p-6"
                    >
                      <h4 className="mb-1 font-heading font-semibold text-[#17224C]">
                        {item.title}
                      </h4>
                      <p
                        className="text-xs leading-relaxed text-[#5a6e88]"
                        style={{ fontFamily: "Inter, sans-serif" }}
                      >
                        {item.desc}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Content & Visibility with Video Slider */}
            {activeTab === "content" && (
              <div className="tab-fade-in">
                <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2">
                  {[
                    {
                      title: "Explainer Videos",
                      desc: "End-to-end animated, 3D, and stock-footage-based video production.",
                    },
                    {
                      title: "Tradeshow Support",
                      desc: "Booth designs, print collateral, videos, and end-to-end tradeshow management.",
                    },
                  ].map((item, i) => (
                    <div
                      key={i}
                      className="card-hover rounded-lg border-2 border-[#E0E4EE] bg-[#F6FAFA] p-6"
                    >
                      <h4 className="mb-1 font-heading font-semibold text-[#17224C]">
                        {item.title}
                      </h4>
                      <p
                        className="text-xs leading-relaxed text-[#5a6e88]"
                        style={{ fontFamily: "Inter, sans-serif" }}
                      >
                        {item.desc}
                      </p>
                    </div>
                  ))}
                </div>

                {/* Video Slider */}
                <div
                  className="overflow-hidden rounded-xl p-6 md:p-8"
                  style={{ background: "linear-gradient(145deg, #17224C, #0d1a3d)" }}
                >
                  <div className="mb-6 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
                    <div>
                      <div
                        className="mb-1 text-xs font-semibold uppercase tracking-widest"
                        style={{ color: "#047FFF", fontFamily: "Inter, sans-serif" }}
                      >
                        Work in Action
                      </div>
                      <p
                        className="text-sm text-white/50"
                        style={{ fontFamily: "Inter, sans-serif" }}
                      >
                        Sample video productions — Foldax brand campaign
                      </p>
                    </div>
                    <div className="flex items-center gap-3">
                      <button
                        className="flex h-9 w-9 items-center justify-center rounded-full border text-white transition-all hover:border-[#047FFF]"
                        style={{
                          background: "rgba(255,255,255,0.08)",
                          borderColor: "rgba(255,255,255,0.2)",
                        }}
                        onClick={() => handleVideoSlide("prev")}
                        aria-label="Previous video"
                      >
                        ←
                      </button>
                      <div className="flex gap-1.5">
                        {videoSlides.map((_, i) => (
                          <button
                            key={i}
                            className="h-1.5 w-1.5 rounded-full transition-all"
                            style={{
                              background:
                                currentVideoSlide === i ? "#047FFF" : "rgba(255,255,255,0.25)",
                            }}
                            onClick={() => setCurrentVideoSlide(i)}
                            aria-label={`Go to slide ${i + 1}`}
                          />
                        ))}
                      </div>
                      <button
                        className="flex h-9 w-9 items-center justify-center rounded-full border text-white transition-all hover:border-[#047FFF]"
                        style={{
                          background: "rgba(255,255,255,0.08)",
                          borderColor: "rgba(255,255,255,0.2)",
                        }}
                        onClick={() => handleVideoSlide("next")}
                        aria-label="Next video"
                      >
                        →
                      </button>
                    </div>
                  </div>

                  <div className="overflow-hidden rounded-lg">
                    <div
                      ref={videoTrackRef}
                      className="flex transition-transform duration-500"
                      style={{ transform: `translateX(-${currentVideoSlide * 100}%)` }}
                    >
                      {videoSlides.map((slide, i) => (
                        <div key={i} className="min-w-full">
                          <div className="grid grid-cols-1 gap-0 overflow-hidden rounded-lg bg-white md:grid-cols-2">
                            <div className="video-thumb-wrap relative bg-black">
                              <video
                                src={slide.src}
                                preload="metadata"
                                playsInline
                                className="h-full w-full object-cover opacity-85 transition-opacity hover:opacity-100"
                              />
                              <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-transparent via-transparent to-black/15"></div>
                              <button
                                className="play-btn absolute left-1/2 top-1/2 z-10 flex h-14 w-14 -translate-x-1/2 -translate-y-1/2 transform items-center justify-center rounded-full border-none text-white transition-all"
                                style={{
                                  background: "linear-gradient(135deg, #047FFF, #19E9E3)",
                                  boxShadow: "0 4px 24px rgba(4, 127, 255, 0.45)",
                                }}
                                onClick={toggleVideoPlay}
                              >
                                <svg
                                  viewBox="0 0 24 24"
                                  fill="currentColor"
                                  className="ml-0.5 h-5 w-5"
                                >
                                  <polygon points="5,3 19,12 5,21" />
                                </svg>
                              </button>
                            </div>
                            <div className="flex flex-col justify-center p-6 md:p-8">
                              <span
                                className="mb-3 inline-block w-fit rounded border px-2 py-0.5 text-xs font-bold uppercase tracking-widest"
                                style={{
                                  background: "#F6FAFA",
                                  color: "#047FFF",
                                  borderColor: "#047FFF",
                                  fontFamily: "Inter, sans-serif",
                                }}
                              >
                                {slide.badge}
                              </span>
                              <h4 className="mb-2 font-heading text-xl font-semibold text-[#17224C] md:text-2xl">
                                {slide.title}
                              </h4>
                              <p
                                className="text-sm leading-relaxed text-[#5a6e88]"
                                style={{ fontFamily: "Inter, sans-serif" }}
                              >
                                {slide.description}
                              </p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* PRICING */}
      <section id="start-up-packs" className="bg-[#F6FAFA] px-[5%] py-24">
        <div className="mx-auto max-w-[1160px]">
          <div className="section-tag">
            <span className="accent-line"></span>Startup Plans
          </div>
          <h2 className="mb-5 font-heading text-4xl text-[#17224C] sm:text-5xl">Suggested Plans</h2>
          <p
            className="max-w-[540px] text-base leading-relaxed text-[#5a6e88]"
            style={{ fontFamily: "Inter, sans-serif" }}
          >
            Structured to match where you are — and where you're heading.
          </p>

          <div className="mt-12 grid max-w-[1060px] grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {/* Starter */}
            <div className="flex h-full flex-col rounded-lg border-2 border-[#E0E4EE] bg-white p-8 transition-all hover:shadow-[0_20px_60px_rgba(4,127,255,0.10)]">
              <div
                className="mb-2 text-xs font-semibold uppercase tracking-widest"
                style={{ color: "#047FFF", fontFamily: "Inter, sans-serif" }}
              >
                Bronze
              </div>
              <h3 className="mb-2 font-heading text-2xl text-[#17224C]">Starter</h3>
              <p
                className="mb-5 border-b border-[#E0E4EE] pb-5 text-sm leading-relaxed text-[#5a6e88]"
                style={{ fontFamily: "Inter, sans-serif" }}
              >
                For pre-seed startups at the idea stage who need core marketing fundamentals.
              </p>
              <ul className="mb-0 flex-1 list-none">
                {[
                  "Logo design",
                  "WordPress website development",
                  "2 monthly website updates (48hr SLA)",
                  "1 pitch deck (15–20 slides)",
                  "Logo reveal video (10 sec)",
                  "4 creative print designs",
                  "3-month engagement",
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-2 py-1 text-sm text-[#3a4a60]">
                    <span
                      className="flex-shrink-0 font-bold"
                      style={{ color: "#047FFF", fontFamily: "Inter, sans-serif" }}
                    >
                      ✦
                    </span>
                    <span style={{ fontFamily: "Inter, sans-serif" }}>{item}</span>
                  </li>
                ))}
              </ul>
              <a
                href="#contact"
                className="block rounded py-3 text-center text-xs font-semibold uppercase tracking-widest text-white no-underline transition-all hover:opacity-90"
                style={{ background: "#17224C", fontFamily: "Inter, sans-serif" }}
              >
                Request Proposal
              </a>
            </div>

            {/* Growth - Popular */}
            <div
              className="relative flex h-full flex-col rounded-lg border-2 bg-white p-8 transition-all hover:shadow-[0_20px_60px_rgba(4,127,255,0.18)]"
              style={{ borderColor: "#047FFF" }}
            >
              <div
                className="absolute -top-3 left-1/2 -translate-x-1/2 transform whitespace-nowrap rounded-full px-4 py-1 text-xs font-semibold uppercase tracking-widest text-white"
                style={{
                  background: "linear-gradient(135deg, #047FFF, #19E9E3)",
                  fontFamily: "Inter, sans-serif",
                }}
              >
                Most Popular
              </div>
              <div
                className="mb-2 text-xs font-semibold uppercase tracking-widest"
                style={{ color: "#047FFF", fontFamily: "Inter, sans-serif" }}
              >
                Silver
              </div>
              <h3 className="mb-2 font-heading text-2xl text-[#17224C]">Growth</h3>
              <p
                className="mb-5 border-b border-[#E0E4EE] pb-5 text-sm leading-relaxed text-[#5a6e88]"
                style={{ fontFamily: "Inter, sans-serif" }}
              >
                For startups with a clear product vision needing broader marketing and positioning.
              </p>
              <ul className="mb-0 flex-1 list-none">
                {[
                  "Logo + WordPress website",
                  "Pitch deck + 1 additional deck",
                  "Logo reveal + 1 animated video (60 sec)",
                  "LinkedIn branding (10 posts/designs)",
                  "1 single-pager, 1 two-pager, 1 four-pager",
                  "7 print designs",
                  "1-month marketing collateral support",
                  "16 hrs Fractional CMO consultation",
                  "6-month engagement",
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-2 py-1 text-sm text-[#3a4a60]">
                    <span
                      className="flex-shrink-0 font-bold"
                      style={{ color: "#047FFF", fontFamily: "Inter, sans-serif" }}
                    >
                      ✦
                    </span>
                    <span style={{ fontFamily: "Inter, sans-serif" }}>{item}</span>
                  </li>
                ))}
              </ul>
              <a
                href="#contact"
                className="block rounded py-3 text-center text-xs font-semibold uppercase tracking-widest text-white no-underline transition-all hover:opacity-90"
                style={{
                  background: "linear-gradient(135deg, #047FFF, #19E9E3)",
                  color: "#fff",
                  fontFamily: "Inter, sans-serif",
                }}
              >
                Request Proposal
              </a>
            </div>

            {/* Scale */}
            <div className="flex h-full flex-col rounded-lg border-2 border-[#E0E4EE] bg-white p-8 transition-all hover:shadow-[0_20px_60px_rgba(4,127,255,0.10)]">
              <div
                className="mb-2 text-xs font-semibold uppercase tracking-widest"
                style={{ color: "#047FFF", fontFamily: "Inter, sans-serif" }}
              >
                Gold
              </div>
              <h3 className="mb-2 font-heading text-2xl text-[#17224C]">Scale</h3>
              <p
                className="mb-5 border-b border-[#E0E4EE] pb-5 text-sm leading-relaxed text-[#5a6e88]"
                style={{ fontFamily: "Inter, sans-serif" }}
              >
                For growth-stage startups with seed funding ready to build a full marketing engine.
              </p>
              <ul className="mb-0 flex-1 list-none">
                {[
                  "Full brand book + logo",
                  "Pitch deck + 2 decks + custom PPT template",
                  "2 animated videos + logo reveal",
                  "LinkedIn full brand management",
                  "2× single, two, & four-pagers",
                  "10 creative print designs",
                  "Tradeshow collateral support",
                  "24 hrs Fractional CMO consultation",
                  "1-year engagement",
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-2 py-1 text-sm text-[#3a4a60]">
                    <span
                      className="flex-shrink-0 font-bold"
                      style={{ color: "#047FFF", fontFamily: "Inter, sans-serif" }}
                    >
                      ✦
                    </span>
                    <span style={{ fontFamily: "Inter, sans-serif" }}>{item}</span>
                  </li>
                ))}
              </ul>
              <a
                href="#contact"
                className="block rounded py-3 text-center text-xs font-semibold uppercase tracking-widest text-white no-underline transition-all hover:opacity-90"
                style={{ background: "#17224C", fontFamily: "Inter, sans-serif" }}
              >
                Request Proposal
              </a>
            </div>

            {/* Bespoke */}
            <div className="flex h-full flex-col rounded-lg border-2 border-[#E0E4EE] bg-white p-8 transition-all hover:shadow-[0_20px_60px_rgba(4,127,255,0.10)]">
              <div
                className="mb-2 text-xs font-semibold uppercase tracking-widest"
                style={{ color: "#047FFF", fontFamily: "Inter, sans-serif" }}
              >
                Custom
              </div>
              <h3 className="mb-2 font-heading text-2xl text-[#17224C]">Bespoke</h3>
              <p
                className="mb-5 border-b border-[#E0E4EE] pb-5 text-sm leading-relaxed text-[#5a6e88]"
                style={{ fontFamily: "Inter, sans-serif" }}
              >
                Tailored scope for businesses with specific needs beyond standard packages.
              </p>
              <ul className="mb-0 flex-1 list-none">
                {[
                  "Full Fractional CMO advisory",
                  "Strategic planning & positioning",
                  "Cross-functional marketing direction",
                  "Curated service selection",
                  "Flexible timelines & milestones",
                  "Scope defined collaboratively",
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-2 py-1 text-sm text-[#3a4a60]">
                    <span
                      className="flex-shrink-0 font-bold"
                      style={{ color: "#047FFF", fontFamily: "Inter, sans-serif" }}
                    >
                      ✦
                    </span>
                    <span style={{ fontFamily: "Inter, sans-serif" }}>{item}</span>
                  </li>
                ))}
              </ul>
              <a
                href="#contact"
                className="block rounded py-3 text-center text-xs font-semibold uppercase tracking-widest text-white no-underline transition-all hover:opacity-90"
                style={{ background: "#17224C", fontFamily: "Inter, sans-serif" }}
              >
                Request Proposal
              </a>
            </div>
          </div>

          <p
            className="mt-8 text-center text-sm text-[#5a6e88]"
            style={{ fontFamily: "Inter, sans-serif" }}
          >
            Additional Fractional CMO consultation and design retainer contracts available on
            request.
          </p>
        </div>
      </section>

      {/* PROCESS */}
      <section
        id="process"
        className="px-[5%] py-24"
        style={{ background: "linear-gradient(160deg, #17224C 0%, #0d1a3d 100%)" }}
      >
        <div className="mx-auto max-w-[1160px]">
          <div className="section-tag cyan-tag">
            <span className="accent-line"></span>How We Work
          </div>
          <h2 className="mb-5 font-heading text-4xl text-white sm:text-5xl">Next Steps</h2>

          <div className="mt-12 grid grid-cols-1 gap-0 sm:grid-cols-2 lg:grid-cols-4">
            {[
              {
                num: "01",
                title: "Explore",
                desc: "Set up a call to understand our capabilities in depth, review samples of our work, and assess alignment.",
              },
              {
                num: "02",
                title: "Experiment",
                desc: "Start with a fixed-cost short-term project of 3–4 weeks to get a real flavor of working with us.",
              },
              {
                num: "03",
                title: "Enrich",
                desc: "Based on mutual experience of the short-term project, we structure the long-term engagement with clear milestones.",
              },
              {
                num: "04",
                title: "Execute",
                desc: "Full execution with accountability, regular reporting, and a transparent delivery framework.",
              },
            ].map((step, i) => (
              <div key={i} className="relative border-r border-white/5 p-8 last:border-r-0">
                <div
                  className="mb-2 font-heading text-5xl font-bold leading-none"
                  style={{ color: "rgba(4, 127, 255, 0.12)" }}
                >
                  {step.num}
                </div>
                <h3 className="mb-2 font-heading text-xl" style={{ color: "#19E9E3" }}>
                  {step.title}
                </h3>
                <p
                  className="text-sm leading-relaxed text-white/55"
                  style={{ fontFamily: "Inter, sans-serif" }}
                >
                  {step.desc}
                </p>
                {i < 3 && (
                  <div
                    className="absolute -right-3 top-1/2 z-10 flex hidden h-6 w-6 -translate-y-1/2 transform items-center justify-center rounded-full text-xs text-white lg:block"
                    style={{ background: "linear-gradient(135deg, #047FFF, #19E9E3)" }}
                  >
                    ›
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PORTFOLIO */}
      <section id="examples-of-work" className="bg-[#F6FAFA] px-[5%] py-24">
        <div className="mx-auto max-w-[1160px]">
          <div className="section-tag">
            <span className="accent-line"></span>Portfolio
          </div>
          <h2 className="mb-5 font-heading text-4xl text-[#17224C] sm:text-5xl">
            Examples of Our Work
          </h2>
          <p
            className="max-w-[540px] text-base leading-relaxed text-[#5a6e88]"
            style={{ fontFamily: "Inter, sans-serif" }}
          >
            Here are publicly available examples of our work across websites, thought leadership,
            and brand assets.
          </p>

          <div className="mt-12 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {[
              {
                bg: 'url("https://ik.imagekit.io/pratik2002/stlec.JPG")',
                bgSize: "cover",
                bgPosition: "center",
                icon: "🏢",
                badge: "Website",
                title: "stsllc.tech",
                desc: "Corporate website for a technology and consulting firm — clean, professional, enterprise-grade.",
                link: "https://stsllc.tech",
              },
              {
                bg: "linear-gradient(135deg, #047FFF, #19E9E3)",
                icon: "🤖",
                badge: "Website",
                title: "konverge.ai",
                desc: "AI-focused brand and web presence — modern, conversion-optimized, and forward-looking.",
                link: "https://konverge.ai",
              },
              {
                bg: 'url("https://ik.imagekit.io/pratik2002/ridethenextwave.JPG?updatedAt=1774062392875")',
                bgSize: "cover",
                bgPosition: "center",
                icon: "",
                badge: "Website",
                title: "ridethenextwave.com",
                desc: "Bold, expressive web presence for a next-generation consulting and advisory brand.",
                link: "https://ridethenextwave.com",
              },
              {
                bg: "linear-gradient(135deg, #19E9E3, #047FFF)",
                icon: "📚",
                badge: "Thought Leadership",
                title: "Thought Leadership e-books",
                desc: "Long-form strategic content and beautifully designed e-books for B2B positioning.",
                link: "#contact",
              },
            ].map((item, i) => (
              <div
                key={i}
                className="overflow-hidden rounded-lg border border-[#E0E4EE] bg-white transition-all hover:shadow-[0_20px_50px_rgba(4,127,255,0.12)]"
              >
                <div
                  className="relative flex h-[180px] items-center justify-center overflow-hidden"
                  style={{
                    background: item.bg,
                    backgroundSize: item.bgSize || "auto",
                    backgroundPosition: item.bgPosition || "center",
                  }}
                >
                  <div
                    className="absolute left-0 right-0 top-0 flex h-7 items-center gap-1 px-3"
                    style={{ background: "rgba(255,255,255,0.1)" }}
                  >
                    <div className="h-2 w-2 rounded-full bg-white/35"></div>
                    <div className="h-2 w-2 rounded-full bg-white/35"></div>
                    <div className="h-2 w-2 rounded-full bg-white/35"></div>
                  </div>
                  <div className="mt-4 text-5xl opacity-80">{item.icon}</div>
                </div>
                <div className="p-5">
                  <span
                    className="mb-2 inline-block rounded bg-[#F6FAFA] px-2 py-0.5 text-xs font-semibold uppercase tracking-widest"
                    style={{ color: "#047FFF", fontFamily: "Inter, sans-serif" }}
                  >
                    {item.badge}
                  </span>
                  <h4 className="mb-1 font-heading font-semibold text-[#17224C]">{item.title}</h4>
                  <p
                    className="mb-4 text-xs leading-relaxed text-[#5a6e88]"
                    style={{ fontFamily: "Inter, sans-serif" }}
                  >
                    {item.desc}
                  </p>
                  <a
                    href={item.link}
                    target={item.link.startsWith("http") ? "_blank" : undefined}
                    rel={item.link.startsWith("http") ? "noopener" : undefined}
                    className="inline-block border-b pb-0.5 text-xs font-semibold uppercase tracking-widest no-underline transition-all hover:opacity-70"
                    style={{
                      color: "#047FFF",
                      borderColor: "#047FFF",
                      fontFamily: "Inter, sans-serif",
                    }}
                  >
                    {item.link === "#contact" ? "Request Samples →" : "View Project →"}
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CONTACT */}
      <section
        id="about-us"
        className="px-[5%] py-24 pb-32"
        style={{ background: "linear-gradient(160deg, #17224C 0%, #0d1a3d 100%)" }}
      >
        <div className="mx-auto max-w-[1160px]">
          <div className="section-tag cyan-tag">
            <span className="accent-line"></span>Get in Touch
          </div>
          <h2 className="mb-5 font-heading text-4xl text-white sm:text-5xl">Thank You</h2>

          <div className="mx-auto mt-12 grid max-w-[1000px] grid-cols-1 items-start gap-12 lg:grid-cols-2">
            {/* Contact Info */}
            <div>
              <h3 className="mb-4 font-heading text-2xl" style={{ color: "#19E9E3" }}>
                Logicology Marketing Team
              </h3>
              <p
                className="mb-8 text-sm leading-relaxed text-white/60"
                style={{ fontFamily: "Inter, sans-serif" }}
              >
                Let's build a smarter, more efficient marketing engine for your business — one that
                delivers world-class results without the full-time overhead.
              </p>
              <div className="mb-3 flex items-center gap-3 text-sm text-white/80">
                <span className="text-base" style={{ color: "#19E9E3" }}>
                  ✉
                </span>
                <a
                  href="mailto:marketing@logicology.com"
                  className="text-white/80 no-underline transition-colors hover:text-white"
                  style={{ fontFamily: "Inter, sans-serif" }}
                >
                  marketing@logicology.com
                </a>
              </div>
              
              <div className="flex flex-wrap gap-4">
                <a
                  href="https://calendly.com"
                  target="_blank"
                  rel="noopener"
                  className="rounded px-6 py-3 text-xs font-bold uppercase tracking-widest text-white no-underline transition-all hover:opacity-90"
                  style={{
                    background: "linear-gradient(135deg, #047FFF, #19E9E3)",
                    color: "#17224C",
                    fontFamily: "Inter, sans-serif",
                  }}
                >
                  Schedule a Call
                </a>
                <a
                  href="mailto:marketing@logicology.com"
                  className="btn-secondary rounded bg-transparent px-6 py-3 text-xs font-semibold uppercase tracking-widest text-white no-underline"
                  style={{ fontFamily: "Inter, sans-serif" }}
                >
                  Send an Email
                </a>
              </div>
            </div>

            {/* Contact Form */}
            <div>
              {[
                { type: "text", placeholder: "Your Name" },
                { type: "email", placeholder: "Email Address" },
                { type: "text", placeholder: "Company / Organisation" },
              ].map((field, i) => (
                <div key={i} className="mb-4">
                  <input
                    type={field.type}
                    placeholder={field.placeholder}
                    className="w-full rounded p-3 text-sm text-white placeholder-white/35 transition-colors focus:outline-none"
                    style={{
                      background: "rgba(255,255,255,0.07)",
                      border: "1px solid rgba(255,255,255,0.15)",
                      fontFamily: "Inter, sans-serif",
                    }}
                    onFocus={(e) => (e.target.style.borderColor = "#047FFF")}
                    onBlur={(e) => (e.target.style.borderColor = "rgba(255,255,255,0.15)")}
                  />
                </div>
              ))}
              <div className="mb-4">
                <textarea
                  placeholder="Tell me about your marketing goals and challenges…"
                  rows={4}
                  className="resize-vertical w-full rounded p-3 text-sm text-white placeholder-white/35 transition-colors focus:outline-none"
                  style={{
                    background: "rgba(255,255,255,0.07)",
                    border: "1px solid rgba(255,255,255,0.15)",
                    fontFamily: "Inter, sans-serif",
                  }}
                  onFocus={(e) => (e.target.style.borderColor = "#047FFF")}
                  onBlur={(e) => (e.target.style.borderColor = "rgba(255,255,255,0.15)")}
                ></textarea>
              </div>
              <button
                className="w-full rounded py-3 text-xs font-bold uppercase tracking-widest text-white transition-all hover:opacity-90"
                style={{
                  background: "linear-gradient(135deg, #047FFF, #19E9E3)",
                  fontFamily: "Inter, sans-serif",
                }}
                onClick={handleSubmit}
              >
                Send Message
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer
        className="px-[5%] py-8 text-center text-xs tracking-wider text-white/35"
        style={{ background: "#070f18" }}
      >
        <p style={{ fontFamily: "Inter, sans-serif" }}>
          © 2025 Logicology Marketing Team · Premium Marketing Solutions ·{" "}
          <a
            href="mailto:marketing@logicology.com"
            className="text-white/35 transition-colors hover:text-white/55"
            style={{ fontFamily: "Inter, sans-serif" }}
          >
            marketing@logicology.com
          </a>
        </p>
      </footer>
    </main>
  );
}

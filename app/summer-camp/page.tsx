"use client";

import { useState, useEffect, useRef } from "react";
import Script from "next/script";
import Link from "next/link";
import Image from "next/image";

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
  "Batch A — May 12–23, 2025 (9 AM – 1 PM)",
  "Batch B — May 26 – June 6, 2025 (9 AM – 1 PM)",
  "Batch C — June 9–20, 2025 (2 PM – 6 PM)",
  "Batch D — June 23 – July 4, 2025 (9 AM – 1 PM)",
];

const REFERRAL_OPTIONS = [
  "Social Media",
  "Friend / Family Referral",
  "School",
  "Google Search",
  "Newspaper / Magazine",
  "Other",
];

const CAMP_FEE = 8999;
// const RAZORPAY_KEY_ID = "rzp_live_RNIwt54hh7eqmk";
const RAZORPAY_KEY_ID = "rzp_test_RM7EaWFSnW9Fod";

// ── Scroll animation hook ──────────────────────────────────────────────────────
function useReveal() {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setVisible(true); obs.disconnect(); } },
      { threshold: 0.12 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);
  return { ref, visible };
}

// ── NavBar ────────────────────────────────────────────────────────────────────
function NavBar() {
  return (
    <nav style={{
      position: "fixed", top: 0, left: 0, right: 0, zIndex: 100,
      background: "rgba(255,255,255,0.97)",
      boxShadow: "0 2px 20px rgba(10,138,128,0.10)",
      backdropFilter: "blur(12px)",
    }}>
      <div style={{
        maxWidth: 1200, margin: "0 auto", padding: "0 24px",
        display: "flex", alignItems: "center", justifyContent: "space-between",
        height: 72,
      }}>
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
        <div style={{ display: "flex", alignItems: "center", gap: 28 }}>
          {["Why Camps", "Why Logicology", "Curriculum", "How to Enroll", "FAQs"].map((l) => (
            <a
              key={l}
              href={`#${l.toLowerCase().replace(/\s+/g, "-")}`}
              style={{
                fontFamily: "'Outfit', sans-serif", fontSize: 14, fontWeight: 600,
                color: "#0B3F44", textDecoration: "none", opacity: 0.85,
                transition: "opacity 0.2s",
              }}
              onMouseEnter={e => (e.currentTarget.style.opacity = "1")}
              onMouseLeave={e => (e.currentTarget.style.opacity = "0.85")}
            >{l}</a>
          ))}
          <a
            href="#enroll"
            style={{
              background: "linear-gradient(135deg, #E45C48, #c94836)",
              color: "#fff", padding: "10px 24px", borderRadius: 100,
              fontFamily: "'Outfit', sans-serif", fontWeight: 700, fontSize: 14,
              textDecoration: "none", boxShadow: "0 4px 16px rgba(228,92,72,0.35)",
              transition: "transform 0.2s, box-shadow 0.2s",
              display: "inline-block",
            }}
            onMouseEnter={e => {
              e.currentTarget.style.transform = "translateY(-2px)";
              e.currentTarget.style.boxShadow = "0 8px 24px rgba(228,92,72,0.40)";
            }}
            onMouseLeave={e => {
              e.currentTarget.style.transform = "translateY(0)";
              e.currentTarget.style.boxShadow = "0 4px 16px rgba(228,92,72,0.35)";
            }}
          >Enroll Now →</a>
        </div>
      </div>
    </nav>
  );
}

// ── Hero — Dark teal gradient ─────────────────────────────────────────────────
function HeroSection() {
  return (
    <section style={{
      minHeight: "100vh",
      background: "linear-gradient(160deg, #0B3F44 0%, #0A8A80 50%, #0B3F44 100%)",
      display: "flex", alignItems: "center", justifyContent: "center",
      position: "relative", overflow: "hidden", paddingTop: 80,
    }}>
      <div style={{ position: "absolute", top: -120, right: -120, width: 500, height: 500, borderRadius: "50%", background: "rgba(216,174,79,0.12)", filter: "blur(60px)" }} />
      <div style={{ position: "absolute", bottom: -80, left: -80, width: 400, height: 400, borderRadius: "50%", background: "rgba(228,92,72,0.10)", filter: "blur(60px)" }} />
      {[
        { top: "20%", left: "8%", size: 12, color: "#D8AE4F", delay: "0s" },
        { top: "70%", left: "5%", size: 8, color: "#E45C48", delay: "0.4s" },
        { top: "15%", right: "10%", size: 16, color: "#D8AE4F", delay: "0.8s" },
        { top: "80%", right: "8%", size: 10, color: "#E45C48", delay: "0.2s" },
        { top: "50%", left: "15%", size: 6, color: "#ffffff", delay: "1.2s" },
      ].map((d, i) => (
        <div key={i} style={{
          position: "absolute", top: d.top, left: (d as any).left, right: (d as any).right,
          width: d.size, height: d.size, borderRadius: "50%",
          background: d.color, opacity: 0.7,
          animation: `float 4s ease-in-out ${d.delay} infinite`,
        }} />
      ))}
      <div style={{ maxWidth: 900, margin: "0 auto", padding: "80px 24px", textAlign: "center", position: "relative", zIndex: 1 }}>
        <div style={{
          display: "inline-block", background: "rgba(216,174,79,0.2)",
          border: "1px solid rgba(216,174,79,0.5)",
          borderRadius: 100, padding: "6px 20px", marginBottom: 28,
          fontFamily: "'Outfit', sans-serif", fontSize: 13, fontWeight: 600,
          color: "#D8AE4F", letterSpacing: "0.08em", textTransform: "uppercase",
        }}>Summer 2025 · Ages 6–14</div>
        <h1 style={{
          fontFamily: "'Outfit', sans-serif", fontWeight: 800,
          fontSize: "clamp(36px, 6vw, 72px)", lineHeight: 1.1,
          color: "#ffffff", margin: "0 0 28px",
        }}>
          This Summer, Your Child<br />
          <span style={{ color: "#D8AE4F" }}>Doesn't Just Play —</span><br />
          They Level Up.
        </h1>
        <p style={{
          fontFamily: "'Outfit', sans-serif", fontSize: "clamp(16px, 2vw, 20px)",
          color: "rgba(255,255,255,0.80)", maxWidth: 640, margin: "0 auto 48px", lineHeight: 1.7,
        }}>
          Logicology Summer Camp brings together logic, creativity, and hands-on learning
          for children aged 6–14. Two weeks that spark curiosity, build confidence,
          and plant the seeds of lifelong thinking skills.
        </p>
        <div style={{ display: "flex", gap: 16, justifyContent: "center", flexWrap: "wrap" }}>
          <a href="#enroll" style={{
            background: "#E45C48", color: "#fff",
            padding: "18px 44px", borderRadius: 100,
            fontFamily: "'Outfit', sans-serif", fontWeight: 700, fontSize: 18,
            textDecoration: "none", boxShadow: "0 6px 32px rgba(228,92,72,0.45)",
            transition: "transform 0.2s, box-shadow 0.2s", display: "inline-block",
          }}
            onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-3px)"; e.currentTarget.style.boxShadow = "0 12px 40px rgba(228,92,72,0.5)"; }}
            onMouseLeave={e => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "0 6px 32px rgba(228,92,72,0.45)"; }}
          >Enroll Now →</a>
          <a href="#why-camps" style={{
            background: "rgba(255,255,255,0.12)", border: "2px solid rgba(255,255,255,0.3)",
            color: "#fff", padding: "18px 44px", borderRadius: 100,
            fontFamily: "'Outfit', sans-serif", fontWeight: 600, fontSize: 18,
            textDecoration: "none", backdropFilter: "blur(8px)",
            transition: "background 0.2s", display: "inline-block",
          }}
            onMouseEnter={e => (e.currentTarget.style.background = "rgba(255,255,255,0.20)")}
            onMouseLeave={e => (e.currentTarget.style.background = "rgba(255,255,255,0.12)")}
          >Learn More</a>
        </div>
        <div style={{
          display: "flex", gap: 48, justifyContent: "center", flexWrap: "wrap",
          marginTop: 72, paddingTop: 48, borderTop: "1px solid rgba(255,255,255,0.15)",
        }}>
          {[
            { num: "500+", label: "Children Enrolled" },
            { num: "1:8", label: "Instructor Ratio" },
            { num: "6", label: "Learning Modules" },
            { num: "2 Weeks", label: "Transformative Camp" },
          ].map((s) => (
            <div key={s.label} style={{ textAlign: "center" }}>
              <div style={{ fontFamily: "'Outfit', sans-serif", fontWeight: 800, fontSize: 32, color: "#D8AE4F" }}>{s.num}</div>
              <div style={{ fontFamily: "'Outfit', sans-serif", fontSize: 13, fontWeight: 500, color: "rgba(255,255,255,0.65)", marginTop: 4 }}>{s.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ── Why Camps — CORAL (#E45C48) ───────────────────────────────────────────────
function WhyCampsSection() {
  const { ref, visible } = useReveal();
  const benefits = [
    { icon: "🧠", title: "They Learn How to Think, Not Just What to Think", desc: "Summer camps expose children to challenges that classrooms rarely offer. Problem-solving in real time, working with limited resources, and figuring things out without a textbook — these experiences build the kind of thinking skills that last far beyond the summer." },
    { icon: "🤝", title: "They Build Social Skills That Screens Can't Teach", desc: "Camp is one of the few places where children collaborate face-to-face, navigate disagreements, and learn to work with people who think differently from them. These are the skills that matter most in adulthood — and they can only be built through real interaction." },
    { icon: "☀️", title: "They Get a Healthy Break from Screens", desc: "The average child spends over four hours a day on screens during summer. Camp replaces passive consumption with active engagement — building, experimenting, debating, and creating. Children come home energised, not drained." },
    { icon: "⭐", title: "They Return More Confident", desc: "There's a specific kind of confidence that comes from solving a problem nobody gave you the answer to. Camp gives children repeated opportunities to succeed through their own effort, and that changes how they see themselves." },
  ];

  return (
    <section id="why-camps" style={{ background: "#E45C48", padding: "100px 24px", position: "relative", overflow: "hidden" }}>
      <div style={{ position: "absolute", top: -80, right: -80, width: 320, height: 320, borderRadius: "50%", background: "rgba(255,255,255,0.07)", filter: "blur(60px)" }} />
      <div style={{ position: "absolute", bottom: -60, left: -60, width: 260, height: 260, borderRadius: "50%", background: "rgba(0,0,0,0.06)", filter: "blur(50px)" }} />
      <div style={{ maxWidth: 1100, margin: "0 auto", position: "relative", zIndex: 1 }}>
        <div ref={ref} style={{ textAlign: "center", marginBottom: 64, opacity: visible ? 1 : 0, transform: visible ? "translateY(0)" : "translateY(32px)", transition: "all 0.7s ease" }}>
          <div style={{ display: "inline-block", background: "rgba(255,255,255,0.20)", border: "1px solid rgba(255,255,255,0.35)", borderRadius: 100, padding: "5px 18px", marginBottom: 20, fontFamily: "'Outfit', sans-serif", fontSize: 12, fontWeight: 700, color: "#fff", letterSpacing: "0.10em", textTransform: "uppercase" }}>Why Summer Camps?</div>
          <h2 style={{ fontFamily: "'Outfit', sans-serif", fontWeight: 800, fontSize: "clamp(28px, 4vw, 48px)", color: "#fff", margin: 0 }}>
            Why a Summer Camp<br />Changes Everything
          </h2>
          <p style={{ fontFamily: "'Outfit', sans-serif", fontSize: 18, color: "rgba(255,255,255,0.88)", maxWidth: 580, margin: "20px auto 0", lineHeight: 1.7 }}>
            Summer breaks are long. Without structure, children often default to screens and idle hours. A well-designed summer camp fills that gap — not with busy work, but with meaningful experiences that shape how a child thinks, connects, and grows.
          </p>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: 24 }}>
          {benefits.map((b, i) => (
            <CoralCard key={b.title} delay={i * 120}>
              <div style={{ fontSize: 32, marginBottom: 16 }}>{b.icon}</div>
              <h3 style={{ fontFamily: "'Outfit', sans-serif", fontWeight: 700, fontSize: 18, color: "#fff", margin: "0 0 12px" }}>{b.title}</h3>
              <p style={{ fontFamily: "'Outfit', sans-serif", fontSize: 15, color: "rgba(255,255,255,0.88)", lineHeight: 1.7, margin: 0 }}>{b.desc}</p>
            </CoralCard>
          ))}
        </div>

        <div style={{ textAlign: "center", marginTop: 56 }}>
          <WhiteOnCoralBtn />
        </div>
      </div>
    </section>
  );
}

// ── Why Logicology — GOLD (#D8AE4F) ──────────────────────────────────────────
function WhyLogicologySection() {
  const { ref, visible } = useReveal();
  const diffs = [
    { icon: "📚", title: "Curriculum by Educators, Not Entertainers", desc: "Our programme is a structured learning journey developed by educators with experience in cognitive development, STEM education, and child psychology. Every day builds on the last." },
    { icon: "🏅", title: "Trained, Vetted Instructors", desc: "Every Logicology instructor goes through a rigorous selection process including background verification, subject-matter assessment, and training focused on child engagement techniques. We hire mentors." },
    { icon: "🔒", title: "Safety Is Non-Negotiable", desc: "Secured premises, CCTV-monitored spaces, and a strict 1:8 instructor-to-child ratio. Parents receive daily updates, and our emergency protocols are documented and rehearsed." },
    { icon: "👥", title: "Small Batches, Big Impact", desc: "We cap each batch at 24 children. This isn't a mass programme — it's an intentional learning environment where every child is seen, heard, and guided individually." },
    { icon: "⚙️", title: "Hands-On, Not Lecture-Based", desc: "Children learn by doing at Logicology. Every concept is taught through activities, experiments, and collaborative projects. No PowerPoint slides. No long lectures. Just real learning through real doing." },
    { icon: "📈", title: "Proven Track Record", desc: "Hundreds of children have attended Logicology camps. The vast majority of parents report noticeable improvement in their child's problem-solving ability within weeks of camp completion." },
  ];

  return (
    <section id="why-logicology" style={{ background: "#D8AE4F", padding: "100px 24px", position: "relative", overflow: "hidden" }}>
      <div style={{ position: "absolute", top: -80, right: -80, width: 320, height: 320, borderRadius: "50%", background: "rgba(255,255,255,0.12)", filter: "blur(70px)" }} />
      <div style={{ position: "absolute", bottom: -60, left: -60, width: 260, height: 260, borderRadius: "50%", background: "rgba(0,0,0,0.05)", filter: "blur(50px)" }} />
      <div style={{ maxWidth: 1100, margin: "0 auto", position: "relative", zIndex: 1 }}>
        <div ref={ref} style={{ textAlign: "center", marginBottom: 64, opacity: visible ? 1 : 0, transform: visible ? "translateY(0)" : "translateY(32px)", transition: "all 0.7s ease" }}>
          <div style={{ display: "inline-block", background: "rgba(255,255,255,0.30)", border: "1px solid rgba(255,255,255,0.50)", borderRadius: 100, padding: "5px 18px", marginBottom: 20, fontFamily: "'Outfit', sans-serif", fontSize: 12, fontWeight: 700, color: "#5a3c00", letterSpacing: "0.10em", textTransform: "uppercase" }}>Why Logicology?</div>
          <h2 style={{ fontFamily: "'Outfit', sans-serif", fontWeight: 800, fontSize: "clamp(28px, 4vw, 48px)", color: "#2d2200", margin: 0 }}>
            Not All Camps Are<br />Created Equal.
          </h2>
          <p style={{ fontFamily: "'Outfit', sans-serif", fontSize: 18, color: "rgba(45,34,0,0.78)", maxWidth: 560, margin: "20px auto 0", lineHeight: 1.7 }}>
            There are hundreds of summer camps out there. Many are fun. A few are transformative. Logicology is designed to be the latter.
          </p>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: 24 }}>
          {diffs.map((d, i) => (
            <GoldCard key={d.title} delay={i * 100}>
              <div style={{ fontSize: 32, marginBottom: 16 }}>{d.icon}</div>
              <h3 style={{ fontFamily: "'Outfit', sans-serif", fontWeight: 700, fontSize: 18, color: "#2d2200", margin: "0 0 10px" }}>{d.title}</h3>
              <p style={{ fontFamily: "'Outfit', sans-serif", fontSize: 15, color: "rgba(45,34,0,0.75)", lineHeight: 1.7, margin: 0 }}>{d.desc}</p>
            </GoldCard>
          ))}
        </div>

        <div style={{ textAlign: "center", marginTop: 56 }}>
          <DarkOnGoldBtn />
        </div>
      </div>
    </section>
  );
}

// ── Curriculum — White ────────────────────────────────────────────────────────
function CurriculumSection() {
  const { ref, visible } = useReveal();
  const modules = [
    { icon: "💻", tag: "Juniors & Seniors", title: "Logical Thinking & Coding Fundamentals", desc: "Visual block-based coding and logic puzzles for younger campers (6–9). Introductory Python and Scratch, building simple apps, and debugging challenges for older campers (10–14).", color: "#0A8A80" },
    { icon: "🤖", tag: "Hands-On Building", title: "Robotics & Tinkering", desc: "Using kits and components, children design, build, and programme simple robots — learning circuits, sensors, motors, and the logic that ties them all together.", color: "#E45C48" },
    { icon: "🔍", tag: "Life Skills", title: "Critical Thinking & Problem Solving", desc: "Through carefully designed puzzles, debates, and scenario-based challenges, children learn how to break complex problems into manageable parts and make reasoned decisions.", color: "#D8AE4F" },
    { icon: "🎨", tag: "Creative Side", title: "Creative Design & Storytelling", desc: "Children explore digital art, story creation, and design thinking workshops — developing both analytical and creative sides of the brain in equal measure.", color: "#0B3F44" },
    { icon: "🌱", tag: "Science", title: "Science Experiments & Exploration", desc: "Hands-on science experiments bring textbook concepts to life — from chemistry reactions to physics experiments to basic electronics.", color: "#0A8A80" },
    { icon: "🗣️", tag: "Teamwork", title: "Teamwork & Communication", desc: "Deliberately designed team challenges teach children to delegate, listen, disagree constructively, and present ideas to a group.", color: "#E45C48" },
  ];

  return (
    <section id="curriculum" style={{ background: "#fff", padding: "100px 24px" }}>
      <div style={{ maxWidth: 1100, margin: "0 auto" }}>
        <div ref={ref} style={{ textAlign: "center", marginBottom: 64, opacity: visible ? 1 : 0, transform: visible ? "translateY(0)" : "translateY(32px)", transition: "all 0.7s ease" }}>
          <div style={{ display: "inline-block", background: "rgba(10,138,128,0.10)", border: "1px solid rgba(10,138,128,0.25)", borderRadius: 100, padding: "5px 18px", marginBottom: 20, fontFamily: "'Outfit', sans-serif", fontSize: 12, fontWeight: 700, color: "#0A8A80", letterSpacing: "0.10em", textTransform: "uppercase" }}>Curriculum</div>
          <h2 style={{ fontFamily: "'Outfit', sans-serif", fontWeight: 800, fontSize: "clamp(28px, 4vw, 48px)", color: "#0B3F44", margin: 0 }}>
            What Your Child Will Actually<br />Walk Away With
          </h2>
          <p style={{ fontFamily: "'Outfit', sans-serif", fontSize: 18, color: "#555", maxWidth: 580, margin: "20px auto 0", lineHeight: 1.7 }}>
            Logicology's curriculum is built around skills that matter — the kind that schools often don't have the time or structure to teach.
          </p>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: 24 }}>
          {modules.map((m, i) => {
            const { ref: mRef, visible: mVis } = useReveal();
            return (
              <div key={m.title} ref={mRef} style={{ background: "#F5F6F7", borderRadius: 20, padding: 32, opacity: mVis ? 1 : 0, transform: mVis ? "translateY(0)" : "translateY(40px)", transition: `all 0.7s ease ${i * 100}ms`, position: "relative", overflow: "hidden" }}
                onMouseEnter={e => { (e.currentTarget as HTMLDivElement).style.boxShadow = `0 12px 40px ${m.color}22`; (e.currentTarget as HTMLDivElement).style.transform = "translateY(-4px)"; }}
                onMouseLeave={e => { (e.currentTarget as HTMLDivElement).style.boxShadow = "none"; (e.currentTarget as HTMLDivElement).style.transform = "translateY(0)"; }}
              >
                <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 4, background: m.color, borderRadius: "20px 20px 0 0" }} />
                <div style={{ fontSize: 36, marginBottom: 12 }}>{m.icon}</div>
                <div style={{ display: "inline-block", background: m.color + "22", borderRadius: 100, padding: "3px 14px", marginBottom: 12, fontFamily: "'Outfit', sans-serif", fontSize: 11, fontWeight: 700, color: m.color, letterSpacing: "0.08em", textTransform: "uppercase" }}>{m.tag}</div>
                <h3 style={{ fontFamily: "'Outfit', sans-serif", fontWeight: 700, fontSize: 18, color: "#0B3F44", margin: "0 0 10px" }}>{m.title}</h3>
                <p style={{ fontFamily: "'Outfit', sans-serif", fontSize: 15, color: "#666", lineHeight: 1.7, margin: 0 }}>{m.desc}</p>
              </div>
            );
          })}
        </div>

        <div style={{ textAlign: "center", marginTop: 56 }}>
          <CoralBtn />
        </div>
      </div>
    </section>
  );
}

// ── How to Enroll — CORAL ────────────────────────────────────────────────────
function HowToEnrollSection() {
  const { ref, visible } = useReveal();
  const steps = [
    { num: "01", icon: "📋", title: "Fill Out the Enrollment Form", desc: "Tell us about your child — name, age, and any details we should know. Takes less than three minutes." },
    { num: "02", icon: "🗓️", title: "Choose Your Batch", desc: "Select the dates and batch that work best for your family. We run multiple batches throughout the summer." },
    { num: "03", icon: "✅", title: "Make the Payment & You're In", desc: "Complete a secure online payment to confirm your child's spot. Confirmation email and all prep details arrive within minutes." },
  ];

  return (
    <section id="how-to-enroll" style={{ background: "#E45C48", padding: "100px 24px", position: "relative", overflow: "hidden" }}>
      <div style={{ position: "absolute", top: -80, left: -80, width: 280, height: 280, borderRadius: "50%", background: "rgba(255,255,255,0.07)", filter: "blur(60px)" }} />
      <div style={{ maxWidth: 900, margin: "0 auto", position: "relative", zIndex: 1 }}>
        <div ref={ref} style={{ textAlign: "center", marginBottom: 64, opacity: visible ? 1 : 0, transform: visible ? "translateY(0)" : "translateY(32px)", transition: "all 0.7s ease" }}>
          <div style={{ display: "inline-block", background: "rgba(255,255,255,0.20)", border: "1px solid rgba(255,255,255,0.35)", borderRadius: 100, padding: "5px 18px", marginBottom: 20, fontFamily: "'Outfit', sans-serif", fontSize: 12, fontWeight: 700, color: "#fff", letterSpacing: "0.10em", textTransform: "uppercase" }}>Enrollment</div>
          <h2 style={{ fontFamily: "'Outfit', sans-serif", fontWeight: 800, fontSize: "clamp(28px, 4vw, 48px)", color: "#fff", margin: "0 0 12px" }}>Getting Started Is Simple</h2>
          <p style={{ fontFamily: "'Outfit', sans-serif", fontSize: 18, color: "rgba(255,255,255,0.88)" }}>Three steps. Five minutes. One decision that could shape your child's summer.</p>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          {steps.map((s, i) => {
            const { ref: sRef, visible: sVis } = useReveal();
            return (
              <div key={s.title} ref={sRef} style={{ background: "rgba(255,255,255,0.18)", border: "1px solid rgba(255,255,255,0.30)", borderRadius: 20, padding: "28px 32px", display: "flex", alignItems: "center", gap: 28, backdropFilter: "blur(8px)", opacity: sVis ? 1 : 0, transform: sVis ? "translateX(0)" : "translateX(-32px)", transition: `all 0.7s ease ${i * 150}ms` }}
                onMouseEnter={e => { (e.currentTarget as HTMLDivElement).style.background = "rgba(255,255,255,0.26)"; (e.currentTarget as HTMLDivElement).style.transform = "translateX(6px)"; }}
                onMouseLeave={e => { (e.currentTarget as HTMLDivElement).style.background = "rgba(255,255,255,0.18)"; (e.currentTarget as HTMLDivElement).style.transform = "translateX(0)"; }}
              >
                <div style={{ minWidth: 64, height: 64, borderRadius: 16, background: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'Outfit', sans-serif", fontWeight: 800, fontSize: 20, color: "#E45C48" }}>{s.num}</div>
                <div style={{ flex: 1 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 6 }}>
                    <span style={{ fontSize: 22 }}>{s.icon}</span>
                    <h3 style={{ fontFamily: "'Outfit', sans-serif", fontWeight: 700, fontSize: 20, color: "#fff", margin: 0 }}>{s.title}</h3>
                  </div>
                  <p style={{ fontFamily: "'Outfit', sans-serif", fontSize: 15, color: "rgba(255,255,255,0.88)", margin: 0, lineHeight: 1.6 }}>{s.desc}</p>
                </div>
              </div>
            );
          })}
        </div>

        <div style={{ textAlign: "center", marginTop: 56 }}>
          <WhiteOnCoralBtn />
        </div>
      </div>
    </section>
  );
}

// ── Testimonials — GOLD ───────────────────────────────────────────────────────
function TestimonialsSection() {
  const { ref, visible } = useReveal();
  const testimonials = [
    { quote: "My son came back from Logicology and built a small app on his own within a week. He's 10. This wasn't babysitting — this was genuinely transformative.", name: "Priya M.", child: "Mother of Arjun, Age 10" },
    { quote: "We've tried three different summer camps over the past two years. Logicology is the only one my daughter has asked to go back to. Worth every rupee.", name: "Rahul S.", child: "Father of Ananya, Age 8" },
    { quote: "I was sceptical at first. The balance between technology, hands-on projects, and teamwork was exactly what my son needed. He came home more confident and curious.", name: "Sneha K.", child: "Mother of Vivaan, Age 12" },
    { quote: "What impressed me most was the safety. Daily updates, photos, and a dedicated point of contact for parents. My daughter loved every minute of it.", name: "Amit D.", child: "Father of Isha, Age 7" },
    { quote: "My twins are very different — one is quiet, the other is loud. Both of them thrived at Logicology. The small batch size made a real difference.", name: "Meera R.", child: "Mother of Rohan & Riya, Age 9" },
  ];

  return (
    <section id="testimonials" style={{ background: "#D8AE4F", padding: "100px 24px", overflow: "hidden", position: "relative" }}>
      <div style={{ position: "absolute", bottom: -60, right: -60, width: 260, height: 260, borderRadius: "50%", background: "rgba(255,255,255,0.10)", filter: "blur(60px)" }} />
      <div style={{ maxWidth: 1100, margin: "0 auto", position: "relative", zIndex: 1 }}>
        <div ref={ref} style={{ textAlign: "center", marginBottom: 64, opacity: visible ? 1 : 0, transform: visible ? "translateY(0)" : "translateY(32px)", transition: "all 0.7s ease" }}>
          <div style={{ display: "inline-block", background: "rgba(255,255,255,0.30)", border: "1px solid rgba(255,255,255,0.50)", borderRadius: 100, padding: "5px 18px", marginBottom: 20, fontFamily: "'Outfit', sans-serif", fontSize: 12, fontWeight: 700, color: "#5a3c00", letterSpacing: "0.10em", textTransform: "uppercase" }}>Testimonials</div>
          <h2 style={{ fontFamily: "'Outfit', sans-serif", fontWeight: 800, fontSize: "clamp(28px, 4vw, 48px)", color: "#2d2200", margin: 0 }}>
            Don't Take Our Word for It.<br />Take Theirs.
          </h2>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: 24 }}>
          {testimonials.map((t, i) => (
            <GoldCard key={t.name} delay={i * 100}>
              <div style={{ fontFamily: "'Outfit', sans-serif", fontSize: 48, color: "#2d2200", lineHeight: 1, marginBottom: 12, opacity: 0.20 }}>"</div>
              <p style={{ fontFamily: "'Outfit', sans-serif", fontSize: 16, color: "#2d2200", lineHeight: 1.7, margin: "0 0 24px", fontStyle: "italic" }}>{t.quote}</p>
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <div style={{ width: 44, height: 44, borderRadius: "50%", background: "#0B3F44", display: "flex", alignItems: "center", justifyContent: "center", color: "#D8AE4F", fontWeight: 700, fontSize: 16, fontFamily: "'Outfit', sans-serif" }}>{t.name[0]}</div>
                <div>
                  <div style={{ fontFamily: "'Outfit', sans-serif", fontWeight: 700, fontSize: 15, color: "#2d2200" }}>{t.name}</div>
                  <div style={{ fontFamily: "'Outfit', sans-serif", fontSize: 13, color: "rgba(45,34,0,0.65)" }}>{t.child}</div>
                </div>
              </div>
            </GoldCard>
          ))}
        </div>

        <div style={{ textAlign: "center", marginTop: 56 }}>
          <DarkOnGoldBtn />
        </div>
      </div>
    </section>
  );
}

// ── FAQ — Light grey ──────────────────────────────────────────────────────────
function FAQSection() {
  const { ref, visible } = useReveal();
  const [open, setOpen] = useState<number | null>(null);
  const faqs = [
    { q: "What age group is the camp designed for?", a: "Logicology Summer Camp is designed for children aged 6 to 14. Activities and curriculum are tailored to two age groups — Juniors (6–9 years) and Seniors (10–14 years) — so every child gets an experience appropriate to their level." },
    { q: "Where is the camp located?", a: "Humpyard Road, Dhantoli, Near Dinanath High School. The venue is fully air-conditioned, CCTV-monitored, and equipped with dedicated learning and activity spaces. Directions will be shared in your confirmation message. Please note there isn't ample 4-wheeler parking available near the center, you may have to park on the Humpyard road." },
    { q: "What are the camp dates and timings?", a: "We run multiple batches throughout the summer. Each batch runs for 5 or 10 days, the timings are 10 am to 1 pm. You can choose your preferred batch during enrollment. Senior camps are 60/90 minutes and junior camps are for 180 minutes." },
    { q: "How much does it cost?", a: "The camp fee ranges from INR 1000–INR 6000 per child based on the programme. This includes GST and accompanying worksheets, material and access to one month of Logicology.online subscription. Sibling discount of 10% is available to both siblings (for fees more than INR 3000). Group discounts are available for groups of 5 or more." },
    { q: "What is the refund and cancellation policy?", a: "Full refunds are available if the batch gets cancelled. Cancellation after the first day of the workshop is possible with 80% refund. No refunds are issued after child attends 2nd day of the camp. If you enrol and need to travel before the batch begins, we will make a full refund (after deducting INR 200 as registration charges)." },
    { q: "What safety measures are in place?", a: "Safety is our top priority: secured premises with controlled entry and exit, CCTV monitoring across all common areas, verified background checks for all instructors. We request you to not drop the children on the ground floor when our team members are not present. Our team members may ask for identity card of the person coming to pick up the child." },
    { q: "Does my child need any specific skills or capabilities?", a: "Your child should be able to read, write and communicate in English, Hindi or Marathi. We DO NOT possess the capabilities to manage children with special needs during our camps. If your child has any specific special needs, please contact us before enrolling." },
    { q: "What should my child bring to camp?", a: "Children should bring a water bottle, a light snack (if they have specific dietary needs), and comfortable clothing. We DO NOT provide any food items. All learning materials, worksheets, books (wherever applicable) are provided by Logicology." },
    { q: "How will I know what my child is doing at camp?", a: "You can take a look at the worksheets. We have online games and assessments which will provide you a peek into the performance of your child. For summer camps we DO NOT provide personalized written feedback." },
    { q: "How do I contact you if I have more questions?", a: "You can reach us on WhatsApp at 8446980747. Our team typically responds within a few hours during business hours. If you need to talk to one of our instructors, send us a WhatsApp specifying the nature of the query and we will call you back." },
    { q: "How can I buy Logicology Games and Books?", a: "Our games and books are available for sale at our centre and on our website. If your child is attending the summer camp, we recommend you buy our Games and Books at our center itself. Please ask for \"Summer Camp Special\" pricing when buying at our centre." },
    { q: "The age range is 6–9, how do you ensure age-appropriate material?", a: "Our content is based on Logic and does not tie to any specific class in school. In rare cases where some children may not be aware of a specific concept, our instructor will teach that concept and move on. We try to segregate students from one age group in one batch as far as possible." },
  ];

  return (
    <section id="faqs" style={{ background: "#F5F6F7", padding: "100px 24px" }}>
      <div style={{ maxWidth: 760, margin: "0 auto" }}>
        <div ref={ref} style={{ textAlign: "center", marginBottom: 56, opacity: visible ? 1 : 0, transform: visible ? "translateY(0)" : "translateY(32px)", transition: "all 0.7s ease" }}>
          <div style={{ display: "inline-block", background: "rgba(10,138,128,0.10)", border: "1px solid rgba(10,138,128,0.25)", borderRadius: 100, padding: "5px 18px", marginBottom: 20, fontFamily: "'Outfit', sans-serif", fontSize: 12, fontWeight: 700, color: "#0A8A80", letterSpacing: "0.10em", textTransform: "uppercase" }}>FAQ</div>
          <h2 style={{ fontFamily: "'Outfit', sans-serif", fontWeight: 800, fontSize: "clamp(28px, 4vw, 44px)", color: "#0B3F44", margin: 0 }}>Got Questions? We've Got Answers.</h2>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {faqs.map((f, i) => (
            <div key={i} style={{ background: "#fff", borderRadius: 16, border: `1px solid ${open === i ? "rgba(10,138,128,0.3)" : "rgba(10,138,128,0.08)"}`, overflow: "hidden", boxShadow: open === i ? "0 4px 20px rgba(10,138,128,0.10)" : "none", transition: "all 0.3s ease" }}>
              <button onClick={() => setOpen(open === i ? null : i)} style={{ width: "100%", padding: "20px 24px", display: "flex", alignItems: "center", justifyContent: "space-between", background: "none", border: "none", cursor: "pointer", textAlign: "left" }}>
                <span style={{ fontFamily: "'Outfit', sans-serif", fontWeight: 600, fontSize: 16, color: open === i ? "#0A8A80" : "#0B3F44" }}>{f.q}</span>
                <span style={{ fontSize: 20, color: "#0A8A80", flexShrink: 0, marginLeft: 16, transform: open === i ? "rotate(45deg)" : "rotate(0)", transition: "transform 0.3s ease", display: "inline-block" }}>+</span>
              </button>
              {open === i && (
                <div style={{ padding: "0 24px 20px" }}>
                  <p style={{ fontFamily: "'Outfit', sans-serif", fontSize: 15, color: "#666", lineHeight: 1.7, margin: 0 }}>{f.a}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ── Enrollment Form — Teal gradient ───────────────────────────────────────────
function EnrollmentSection() {
  const { ref, visible } = useReveal();
  const [form, setForm] = useState<FormData>({
    parentName: "", email: "", phone: "", childName: "",
    childAge: "", childGrade: "", preferredBatch: "",
    allergies: "", referral: "", consent: false,
  });
  const [errors, setErrors] = useState<Partial<Record<keyof FormData, string>>>({});
  const [isProcessing, setIsProcessing] = useState(false);
  const [isPaymentProcessing, setIsPaymentProcessing] = useState(false);

  const validate = () => {
    const e: Partial<Record<keyof FormData, string>> = {};
    if (!form.parentName.trim()) e.parentName = "This field is required.";
    if (!form.email.trim() || !/\S+@\S+\.\S+/.test(form.email)) e.email = "Please enter a valid email address.";
    if (!form.phone.trim() || form.phone.replace(/\D/g, "").length !== 10) e.phone = "Please enter a valid 10-digit phone number.";
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
        headers: { Authorization: "Basic QTc1emFobGthSVpxRGp1aWtRNE5aaDdCU0xGNFk5LXRFZ3ZXYkRySDZjbzo=", "Content-Type": "application/json" },
        body: JSON.stringify({ phoneNumber: cleanedPhone, countryCode: "+91", traits: { name: form.parentName, email: form.email, lastPaymentId: paymentId, campBatch: form.preferredBatch } }),
      });
      await fetch("https://api.interakt.ai/v1/public/message/", {
        method: "POST",
        headers: { Authorization: "Basic QTc1emFobGthSVpxRGp1aWtRNE5aaDdCU0xGNFk5LXRFZ3ZXYkRySDZjbzo=", "Content-Type": "application/json" },
        body: JSON.stringify({ countryCode: "+91", phoneNumber: cleanedPhone, type: "Template", template: { name: "purchase", languageCode: "en", bodyValues: [form.parentName, `Logicology Summer Camp — ${form.preferredBatch}`, CAMP_FEE.toString(), "Logicology Camp Venue", paymentId] } }),
      });
    } catch (err) { console.error("WhatsApp error:", err); }
  };

  const handleSubmit = async () => {
    if (!validate() || isProcessing) return;
    setIsProcessing(true);
    try {
      const res = await fetch("/api/razorpay-order", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount: CAMP_FEE, currency: "INR", receipt: `camp_${Date.now()}` }),
      });
      const { order } = await res.json();
      if (!order) { alert("Failed to create order. Please try again."); setIsProcessing(false); return; }

      const options = {
        key: RAZORPAY_KEY_ID, amount: order.amount, currency: order.currency,
        name: "Logicology", description: `Summer Camp Enrollment — ${form.preferredBatch}`, order_id: order.id,
        handler: async function (response: any) {
          setIsPaymentProcessing(true);
          try {
            await fetch("/api/save-order-info", {
              method: "POST", headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                userInfo: { name: form.parentName, email: form.email, phone: form.phone },
                shipping: { name: form.childName, address: "Summer Camp", building: "", street: "", landmark: "", pin: "", city: "", state: "", phone: form.phone, email: form.email, isGift: false, isDifferentFromBiller: false },
                cart: [{ name: `Logicology Summer Camp — ${form.preferredBatch}`, price: `₹${CAMP_FEE}`, quantity: 1, razorpayItemId: "summer-camp" }],
                paymentId: response.razorpay_payment_id, orderId: response.razorpay_order_id,
                razorpayDesc: `Summer Camp — ${form.childName}, Batch: ${form.preferredBatch}`,
                totalAmount: CAMP_FEE, discountAmount: 0, appliedPromo: null,
                isGift: false, isDifferentFromBiller: false,
                campDetails: { childName: form.childName, childAge: form.childAge, childGrade: form.childGrade, batch: form.preferredBatch, allergies: form.allergies, referral: form.referral },
              }),
            });
            await sendWhatsApp(response.razorpay_payment_id);
          } catch (err) { console.error("Post-payment error:", err); }
          finally {
            setIsPaymentProcessing(false); setIsProcessing(false);
            alert(`🎉 Enrollment confirmed! Payment ID: ${response.razorpay_payment_id}. Check your email and WhatsApp for details.`);
          }
        },
        prefill: { name: form.parentName, email: form.email, contact: form.phone },
        notes: { child_name: form.childName, batch: form.preferredBatch, grade: form.childGrade },
        theme: { color: "#0A8A80" },
        modal: { ondismiss: () => setIsProcessing(false) },
      };
      if (typeof window !== "undefined" && (window as any).Razorpay) {
        new (window as any).Razorpay(options).open();
      } else { alert("Payment gateway not loaded. Please refresh and try again."); setIsProcessing(false); }
    } catch (err) { console.error("Checkout error:", err); alert("An error occurred. Please try again."); setIsProcessing(false); }
  };

  const inp = (hasError?: boolean): React.CSSProperties => ({
    width: "100%", padding: "14px 18px", borderRadius: 12,
    border: `1.5px solid ${hasError ? "#E45C48" : "rgba(10,138,128,0.2)"}`,
    fontFamily: "'Outfit', sans-serif", fontSize: 15, color: "#0B3F44",
    background: "#fff", outline: "none", boxSizing: "border-box", transition: "border-color 0.2s",
  });
  const lbl: React.CSSProperties = { display: "block", fontFamily: "'Outfit', sans-serif", fontWeight: 600, fontSize: 14, color: "#0B3F44", marginBottom: 6 };
  const err: React.CSSProperties = { fontFamily: "'Outfit', sans-serif", fontSize: 12, color: "#E45C48", marginTop: 4 };

  return (
    <section id="enroll" style={{ background: "linear-gradient(160deg, #0B3F44 0%, #0A8A80 100%)", padding: "100px 24px", position: "relative", overflow: "hidden" }}>
      {isPaymentProcessing && (
        <div style={{ position: "fixed", inset: 0, zIndex: 999, background: "rgba(11,63,68,0.85)", backdropFilter: "blur(12px)", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <div style={{ background: "#fff", borderRadius: 24, padding: "48px 40px", textAlign: "center", maxWidth: 380 }}>
            <div style={{ width: 64, height: 64, borderRadius: "50%", border: "4px solid #0A8A80", borderTopColor: "transparent", margin: "0 auto 24px", animation: "spin 1s linear infinite" }} />
            <h3 style={{ fontFamily: "'Outfit', sans-serif", fontWeight: 700, fontSize: 22, color: "#0B3F44", margin: "0 0 10px" }}>Processing Enrollment</h3>
            <p style={{ fontFamily: "'Outfit', sans-serif", fontSize: 15, color: "#666", margin: "0 0 20px" }}>Confirming your payment and sending enrollment details...</p>
            <div style={{ background: "#FFF9E6", border: "1px solid #D8AE4F", borderRadius: 12, padding: "12px 16px", fontFamily: "'Outfit', sans-serif", fontSize: 13, color: "#8B6914", fontWeight: 600 }}>⚠️ Do not close or refresh this page</div>
          </div>
        </div>
      )}

      <div style={{ position: "absolute", top: -80, right: -80, width: 360, height: 360, borderRadius: "50%", background: "rgba(216,174,79,0.08)", filter: "blur(80px)" }} />
      <div style={{ maxWidth: 720, margin: "0 auto", position: "relative", zIndex: 1 }}>
        <div ref={ref} style={{ textAlign: "center", marginBottom: 48, opacity: visible ? 1 : 0, transform: visible ? "translateY(0)" : "translateY(32px)", transition: "all 0.7s ease" }}>
          <div style={{ display: "inline-block", background: "rgba(216,174,79,0.15)", border: "1px solid rgba(216,174,79,0.4)", borderRadius: 100, padding: "5px 18px", marginBottom: 20, fontFamily: "'Outfit', sans-serif", fontSize: 12, fontWeight: 700, color: "#D8AE4F", letterSpacing: "0.10em", textTransform: "uppercase" }}>Enrollment Open</div>
          <h2 style={{ fontFamily: "'Outfit', sans-serif", fontWeight: 800, fontSize: "clamp(28px, 4vw, 48px)", color: "#fff", margin: "0 0 12px" }}>Enroll Your Child Today</h2>
          <p style={{ fontFamily: "'Outfit', sans-serif", fontSize: 17, color: "rgba(255,255,255,0.75)", margin: 0 }}>Fill in the details below and secure your child's spot at Logicology Summer Camp.</p>
        </div>

        <div style={{ background: "rgba(216,174,79,0.15)", border: "2px solid rgba(216,174,79,0.35)", borderRadius: 16, padding: "20px 28px", marginBottom: 36, display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 16 }}>
          <div>
            <div style={{ fontFamily: "'Outfit', sans-serif", fontSize: 13, color: "rgba(255,255,255,0.7)", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.07em" }}>Camp Fee (Full Programme)</div>
            <div style={{ fontFamily: "'Outfit', sans-serif", fontWeight: 800, fontSize: 32, color: "#D8AE4F" }}>₹{CAMP_FEE.toLocaleString("en-IN")}</div>
            <div style={{ fontFamily: "'Outfit', sans-serif", fontSize: 13, color: "rgba(255,255,255,0.6)" }}>Includes all materials, kits, snacks, t-shirt & certificate</div>
          </div>
          <div style={{ background: "rgba(255,255,255,0.1)", borderRadius: 12, padding: "10px 18px", fontFamily: "'Outfit', sans-serif", fontSize: 13, color: "#fff", fontWeight: 600 }}>🏷️ Sibling discounts available</div>
        </div>

        <div style={{ background: "#fff", borderRadius: 24, padding: "40px 40px", boxShadow: "0 24px 80px rgba(0,0,0,0.20)" }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
            <div style={{ gridColumn: "1 / -1" }}>
              <label style={lbl}>Parent / Guardian Full Name *</label>
              <input type="text" value={form.parentName} onChange={e => setForm(f => ({ ...f, parentName: e.target.value }))} placeholder="Your full name" style={inp(!!errors.parentName)} onFocus={e => (e.target.style.borderColor = "#0A8A80")} onBlur={e => (e.target.style.borderColor = errors.parentName ? "#E45C48" : "rgba(10,138,128,0.2)")} />
              {errors.parentName && <div style={err}>{errors.parentName}</div>}
            </div>
            <div>
              <label style={lbl}>Email Address *</label>
              <input type="email" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} placeholder="you@email.com" style={inp(!!errors.email)} onFocus={e => (e.target.style.borderColor = "#0A8A80")} onBlur={e => (e.target.style.borderColor = errors.email ? "#E45C48" : "rgba(10,138,128,0.2)")} />
              {errors.email && <div style={err}>{errors.email}</div>}
            </div>
            <div>
              <label style={lbl}>Phone Number (WhatsApp) *</label>
              <input type="tel" value={form.phone} onChange={e => setForm(f => ({ ...f, phone: e.target.value.replace(/\D/g, "").slice(0, 10) }))} placeholder="10-digit mobile number" style={inp(!!errors.phone)} onFocus={e => (e.target.style.borderColor = "#0A8A80")} onBlur={e => (e.target.style.borderColor = errors.phone ? "#E45C48" : "rgba(10,138,128,0.2)")} />
              {errors.phone && <div style={err}>{errors.phone}</div>}
            </div>
            <div>
              <label style={lbl}>Child's Full Name *</label>
              <input type="text" value={form.childName} onChange={e => setForm(f => ({ ...f, childName: e.target.value }))} placeholder="Child's full name" style={inp(!!errors.childName)} onFocus={e => (e.target.style.borderColor = "#0A8A80")} onBlur={e => (e.target.style.borderColor = errors.childName ? "#E45C48" : "rgba(10,138,128,0.2)")} />
              {errors.childName && <div style={err}>{errors.childName}</div>}
            </div>
            <div>
              <label style={lbl}>Child's Age *</label>
              <select value={form.childAge} onChange={e => setForm(f => ({ ...f, childAge: e.target.value }))} style={inp(!!errors.childAge)} onFocus={e => (e.target.style.borderColor = "#0A8A80")} onBlur={e => (e.target.style.borderColor = errors.childAge ? "#E45C48" : "rgba(10,138,128,0.2)")}>
                <option value="">Select age</option>
                {Array.from({ length: 9 }, (_, i) => i + 6).map(a => <option key={a} value={a}>{a} years</option>)}
              </select>
              {errors.childAge && <div style={err}>{errors.childAge}</div>}
            </div>
            <div>
              <label style={lbl}>Child's Grade / Class *</label>
              <select value={form.childGrade} onChange={e => setForm(f => ({ ...f, childGrade: e.target.value }))} style={inp(!!errors.childGrade)} onFocus={e => (e.target.style.borderColor = "#0A8A80")} onBlur={e => (e.target.style.borderColor = errors.childGrade ? "#E45C48" : "rgba(10,138,128,0.2)")}>
                <option value="">Select grade</option>
                {Array.from({ length: 9 }, (_, i) => i + 1).map(g => <option key={g} value={`Grade ${g}`}>Grade {g}</option>)}
              </select>
              {errors.childGrade && <div style={err}>{errors.childGrade}</div>}
            </div>
            <div style={{ gridColumn: "1 / -1" }}>
              <label style={lbl}>Preferred Batch *</label>
              <select value={form.preferredBatch} onChange={e => setForm(f => ({ ...f, preferredBatch: e.target.value }))} style={inp(!!errors.preferredBatch)} onFocus={e => (e.target.style.borderColor = "#0A8A80")} onBlur={e => (e.target.style.borderColor = errors.preferredBatch ? "#E45C48" : "rgba(10,138,128,0.2)")}>
                <option value="">Select your preferred batch</option>
                {BATCHES.map(b => <option key={b} value={b}>{b}</option>)}
              </select>
              {errors.preferredBatch && <div style={err}>{errors.preferredBatch}</div>}
            </div>
            <div style={{ gridColumn: "1 / -1" }}>
              <label style={lbl}>Allergies or Medical Conditions</label>
              <textarea value={form.allergies} onChange={e => setForm(f => ({ ...f, allergies: e.target.value }))} placeholder="Please mention any allergies, medical conditions, or special needs we should be aware of." rows={3} style={{ ...inp(), resize: "vertical" }} onFocus={e => (e.target.style.borderColor = "#0A8A80")} onBlur={e => (e.target.style.borderColor = "rgba(10,138,128,0.2)")} />
            </div>
            <div style={{ gridColumn: "1 / -1" }}>
              <label style={lbl}>How Did You Hear About Us?</label>
              <select value={form.referral} onChange={e => setForm(f => ({ ...f, referral: e.target.value }))} style={inp()} onFocus={e => (e.target.style.borderColor = "#0A8A80")} onBlur={e => (e.target.style.borderColor = "rgba(10,138,128,0.2)")}>
                <option value="">Select an option</option>
                {REFERRAL_OPTIONS.map(r => <option key={r} value={r}>{r}</option>)}
              </select>
            </div>
            <div style={{ gridColumn: "1 / -1" }}>
              <label style={{ display: "flex", alignItems: "flex-start", gap: 12, cursor: "pointer" }}>
                <input type="checkbox" checked={form.consent} onChange={e => setForm(f => ({ ...f, consent: e.target.checked }))} style={{ marginTop: 2, width: 18, height: 18, accentColor: "#0A8A80", flexShrink: 0 }} />
                <span style={{ fontFamily: "'Outfit', sans-serif", fontSize: 14, color: "#555", lineHeight: 1.5 }}>
                  I agree to the <a href="/terms" style={{ color: "#0A8A80", fontWeight: 600 }}>Terms & Conditions</a> and{" "}
                  <a href="/privacy" style={{ color: "#0A8A80", fontWeight: 600 }}>Privacy Policy</a> and confirm that the information provided above is accurate.
                </span>
              </label>
              {errors.consent && <div style={err}>{errors.consent}</div>}
            </div>
          </div>

          <button onClick={handleSubmit} disabled={isProcessing}
            style={{ width: "100%", marginTop: 28, background: isProcessing ? "#aaa" : "linear-gradient(135deg, #E45C48, #c94836)", color: "#fff", padding: "18px", borderRadius: 100, border: "none", fontFamily: "'Outfit', sans-serif", fontWeight: 700, fontSize: 18, cursor: isProcessing ? "not-allowed" : "pointer", boxShadow: isProcessing ? "none" : "0 6px 28px rgba(228,92,72,0.35)", transition: "transform 0.2s, box-shadow 0.2s" }}
            onMouseEnter={e => { if (!isProcessing) { (e.currentTarget as HTMLButtonElement).style.transform = "translateY(-2px)"; (e.currentTarget as HTMLButtonElement).style.boxShadow = "0 10px 36px rgba(228,92,72,0.45)"; } }}
            onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.transform = "translateY(0)"; (e.currentTarget as HTMLButtonElement).style.boxShadow = "0 6px 28px rgba(228,92,72,0.35)"; }}
          >
            {isProcessing ? "Processing..." : `Enroll Now — Pay ₹${CAMP_FEE.toLocaleString("en-IN")} →`}
          </button>

          <div style={{ marginTop: 16, textAlign: "center", fontFamily: "'Outfit', sans-serif", fontSize: 13, color: "#888", display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
            🔒 Secure payment via Razorpay · 256-bit SSL encrypted
          </div>
        </div>
      </div>
    </section>
  );
}

// ── Footer ─────────────────────────────────────────────────────────────────────
function Footer() {
  return (
    <footer style={{ background: "#0B3F44", padding: "60px 24px 32px", borderTop: "1px solid rgba(255,255,255,0.08)" }}>
      <div style={{ maxWidth: 1100, margin: "0 auto" }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 40, marginBottom: 48 }}>
          <div>
            <div style={{ marginBottom: 16 }}>
              <Image src="https://ik.imagekit.io/pratik2002/logicology-logo_74-P-ICfG?updatedAt=1756257433107" alt="Logicology" width={130} height={52} style={{ objectFit: "contain", filter: "brightness(0) invert(1)" }} />
            </div>
            <p style={{ fontFamily: "'Outfit', sans-serif", fontSize: 14, color: "rgba(255,255,255,0.55)", lineHeight: 1.7 }}>Empowering children to think clearly, creatively, and independently.</p>
          </div>
          <div>
            <h4 style={{ fontFamily: "'Outfit', sans-serif", fontWeight: 700, fontSize: 14, color: "#D8AE4F", marginBottom: 16, textTransform: "uppercase", letterSpacing: "0.08em" }}>Contact</h4>
            {[{ label: "📧", val: "logicologymeta@gmail.com" }, { label: "📱", val: "8446980747" }].map(c => (
              <div key={c.val} style={{ fontFamily: "'Outfit', sans-serif", fontSize: 14, color: "rgba(255,255,255,0.65)", marginBottom: 8 }}>{c.label} {c.val}</div>
            ))}
          </div>
          <div>
            <h4 style={{ fontFamily: "'Outfit', sans-serif", fontWeight: 700, fontSize: 14, color: "#D8AE4F", marginBottom: 16, textTransform: "uppercase", letterSpacing: "0.08em" }}>Quick Links</h4>
            {["About Logicology", "Terms & Conditions", "Privacy Policy", "Refund Policy"].map(l => (
              <div key={l} style={{ marginBottom: 8 }}>
                <a href="#" style={{ fontFamily: "'Outfit', sans-serif", fontSize: 14, color: "rgba(255,255,255,0.65)", textDecoration: "none" }} onMouseEnter={e => (e.currentTarget.style.color = "#D8AE4F")} onMouseLeave={e => (e.currentTarget.style.color = "rgba(255,255,255,0.65)")}>{l}</a>
              </div>
            ))}
          </div>
          <div>
            <h4 style={{ fontFamily: "'Outfit', sans-serif", fontWeight: 700, fontSize: 14, color: "#D8AE4F", marginBottom: 16, textTransform: "uppercase", letterSpacing: "0.08em" }}>Follow Us</h4>
            <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
              {["Instagram", "Facebook", "YouTube"].map(s => (
                <a key={s} href="#" style={{ fontFamily: "'Outfit', sans-serif", fontSize: 13, fontWeight: 600, color: "#0B3F44", background: "#D8AE4F", padding: "6px 16px", borderRadius: 100, textDecoration: "none", transition: "transform 0.2s" }} onMouseEnter={e => (e.currentTarget.style.transform = "translateY(-2px)")} onMouseLeave={e => (e.currentTarget.style.transform = "translateY(0)")}>{s}</a>
              ))}
            </div>
          </div>
        </div>
        <div style={{ borderTop: "1px solid rgba(255,255,255,0.10)", paddingTop: 24, textAlign: "center", fontFamily: "'Outfit', sans-serif", fontSize: 13, color: "rgba(255,255,255,0.4)" }}>
          © {new Date().getFullYear()} Logicology. All rights reserved.
        </div>
      </div>
    </footer>
  );
}

// ── Shared card primitives ────────────────────────────────────────────────────
function CoralCard({ children, delay }: { children: React.ReactNode; delay: number }) {
  const { ref, visible } = useReveal();
  return (
    <div ref={ref} style={{ background: "rgba(255,255,255,0.16)", border: "1px solid rgba(255,255,255,0.28)", borderRadius: 20, padding: 32, backdropFilter: "blur(8px)", opacity: visible ? 1 : 0, transform: visible ? "translateY(0)" : "translateY(40px)", transition: `all 0.7s ease ${delay}ms` }}
      onMouseEnter={e => { (e.currentTarget as HTMLDivElement).style.background = "rgba(255,255,255,0.24)"; (e.currentTarget as HTMLDivElement).style.transform = "translateY(-4px)"; }}
      onMouseLeave={e => { (e.currentTarget as HTMLDivElement).style.background = "rgba(255,255,255,0.16)"; (e.currentTarget as HTMLDivElement).style.transform = "translateY(0)"; }}
    >{children}</div>
  );
}

function GoldCard({ children, delay }: { children: React.ReactNode; delay: number }) {
  const { ref, visible } = useReveal();
  return (
    <div ref={ref} style={{ background: "rgba(255,255,255,0.38)", border: "1px solid rgba(255,255,255,0.55)", borderRadius: 20, padding: 32, backdropFilter: "blur(8px)", opacity: visible ? 1 : 0, transform: visible ? "translateY(0)" : "translateY(40px)", transition: `all 0.7s ease ${delay}ms` }}
      onMouseEnter={e => { (e.currentTarget as HTMLDivElement).style.background = "rgba(255,255,255,0.52)"; (e.currentTarget as HTMLDivElement).style.transform = "translateY(-4px)"; (e.currentTarget as HTMLDivElement).style.boxShadow = "0 12px 36px rgba(0,0,0,0.09)"; }}
      onMouseLeave={e => { (e.currentTarget as HTMLDivElement).style.background = "rgba(255,255,255,0.38)"; (e.currentTarget as HTMLDivElement).style.transform = "translateY(0)"; (e.currentTarget as HTMLDivElement).style.boxShadow = "none"; }}
    >{children}</div>
  );
}

// ── Shared CTA buttons ────────────────────────────────────────────────────────
function CoralBtn() {
  return (
    <a href="#enroll" style={{ background: "linear-gradient(135deg, #E45C48, #c94836)", color: "#fff", padding: "18px 44px", borderRadius: 100, fontFamily: "'Outfit', sans-serif", fontWeight: 700, fontSize: 18, textDecoration: "none", boxShadow: "0 6px 32px rgba(228,92,72,0.35)", display: "inline-block", transition: "transform 0.2s, box-shadow 0.2s" }}
      onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-3px)"; e.currentTarget.style.boxShadow = "0 12px 40px rgba(228,92,72,0.45)"; }}
      onMouseLeave={e => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "0 6px 32px rgba(228,92,72,0.35)"; }}
    >Enroll Now →</a>
  );
}

function WhiteOnCoralBtn() {
  return (
    <a href="#enroll" style={{ background: "#fff", color: "#E45C48", padding: "18px 44px", borderRadius: 100, fontFamily: "'Outfit', sans-serif", fontWeight: 700, fontSize: 18, textDecoration: "none", boxShadow: "0 6px 24px rgba(0,0,0,0.14)", display: "inline-block", transition: "transform 0.2s" }}
      onMouseEnter={e => (e.currentTarget.style.transform = "translateY(-3px)")}
      onMouseLeave={e => (e.currentTarget.style.transform = "translateY(0)")}
    >Enroll Now →</a>
  );
}

function DarkOnGoldBtn() {
  return (
    <a href="#enroll" style={{ background: "#0B3F44", color: "#fff", padding: "18px 44px", borderRadius: 100, fontFamily: "'Outfit', sans-serif", fontWeight: 700, fontSize: 18, textDecoration: "none", boxShadow: "0 6px 28px rgba(11,63,68,0.30)", display: "inline-block", transition: "transform 0.2s" }}
      onMouseEnter={e => (e.currentTarget.style.transform = "translateY(-3px)")}
      onMouseLeave={e => (e.currentTarget.style.transform = "translateY(0)")}
    >Enroll Now →</a>
  );
}

// ── Main Page ─────────────────────────────────────────────────────────────────
export default function SummerCampPage() {
  return (
    <>
      <Script src="https://checkout.razorpay.com/v1/checkout.js" strategy="afterInteractive" />
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
      <HeroSection />          {/* Dark teal gradient */}
      <WhyCampsSection />      {/* 🔴 Coral #E45C48 */}
      <WhyLogicologySection /> {/* 🟡 Gold #D8AE4F */}
      <CurriculumSection />    {/* ⬜ White */}
      <HowToEnrollSection />   {/* 🔴 Coral #E45C48 */}
      <TestimonialsSection />  {/* 🟡 Gold #D8AE4F */}
      <FAQSection />           {/* 🩶 Light grey */}
      <EnrollmentSection />    {/* 🟢 Teal gradient */}
      <Footer />               {/* 🟢 Dark teal */}
    </>
  );
}
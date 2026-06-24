"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";

// ── Types ────────────────────────────────────────────────────────────────────
interface FormData {
  studentName: string;
  school: string;
  branch: string;
  parentName: string;
  phone: string;
  email: string;
  area: string;
  consent: boolean;
}

const DEMO_SESSIONS = [
  { date: "June 1", day: "Sun", time: "5:30 – 6:30 PM" },
  { date: "June 3", day: "Tue", time: "5:30 – 6:30 PM" },
  { date: "June 5", day: "Thu", time: "5:30 – 6:30 PM" },
];

// ── Scroll reveal hook ────────────────────────────────────────────────────────
function useReveal(threshold = 0.12) {
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
      { threshold }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);
  return { ref, visible };
}

// ── NavBar ────────────────────────────────────────────────────────────────────
function NavBar() {
  return (
    <header
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        zIndex: 100,
        background: "rgba(255,255,255,0.95)",
        backdropFilter: "blur(12px)",
        borderBottom: "1px solid rgba(10,138,128,0.12)",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "12px 32px",
      }}
    >
      <Link
        href="/"
        style={{ display: "flex", alignItems: "center", gap: 10, textDecoration: "none" }}
      >
        <img
          src="https://ik.imagekit.io/pratik2002/Mathology_Logo.png"
          alt="Mathology by Logicology"
          style={{ width: 80, height: 32, objectFit: "contain" }}
        />
      </Link>
      <a
        href="#register"
        style={{
          background: "linear-gradient(135deg, #0A8A80, #0B6B63)",
          color: "#fff",
          padding: "10px 22px",
          borderRadius: 100,
          fontFamily: "'Outfit', sans-serif",
          fontWeight: 700,
          fontSize: 14,
          textDecoration: "none",
          boxShadow: "0 4px 14px rgba(10,138,128,0.30)",
        }}
      >
        Register Now →
      </a>
    </header>
  );
}

// ── Hero ──────────────────────────────────────────────────────────────────────
function HeroSection() {
  return (
    <section
      style={{
        minHeight: "100vh",
        background: "linear-gradient(150deg, #0B3F44 0%, #0A8A80 60%, #0D9E93 100%)",
        display: "flex",
        alignItems: "center",
        position: "relative",
        overflow: "hidden",
        paddingTop: 80,
      }}
    >
      {/* Decorative blobs */}
      <div
        style={{
          position: "absolute",
          top: -100,
          right: -80,
          width: 480,
          height: 480,
          borderRadius: "50%",
          background: "rgba(255,255,255,0.05)",
          filter: "blur(60px)",
        }}
      />
      <div
        style={{
          position: "absolute",
          bottom: -60,
          left: -80,
          width: 360,
          height: 360,
          borderRadius: "50%",
          background: "rgba(11,107,99,0.4)",
          filter: "blur(50px)",
        }}
      />
      {/* Grid pattern overlay */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          opacity: 0.04,
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.8) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.8) 1px, transparent 1px)",
          backgroundSize: "40px 40px",
        }}
      />

      <div
        style={{
          maxWidth: 1100,
          margin: "0 auto",
          padding: "80px 32px",
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: 64,
          alignItems: "center",
          position: "relative",
          zIndex: 1,
          width: "100%",
        }}
      >
        {/* Left: Text */}
        <div>
          <h1
            style={{
              fontFamily: "'Outfit', sans-serif",
              fontWeight: 900,
              fontSize: "clamp(40px, 5vw, 68px)",
              color: "#fff",
              margin: "0 0 8px",
              lineHeight: 1.05,
            }}
          >
            Maths &amp;
            <br />
            <span style={{ color: "#7FFDF4" }}>Science</span>
          </h1>
          <h2
            style={{
              fontFamily: "'Outfit', sans-serif",
              fontWeight: 400,
              fontSize: "clamp(18px, 2.5vw, 26px)",
              color: "rgba(255,255,255,0.78)",
              margin: "0 0 32px",
            }}
          >
            Grade 8 Foundation Classes
          </h2>
          <p
            style={{
              fontFamily: "'Outfit', sans-serif",
              fontSize: 17,
              color: "rgba(255,255,255,0.70)",
              lineHeight: 1.7,
              margin: "0 0 40px",
              maxWidth: 440,
            }}
          >
            Personalised attention for Grade 8 students. Small batches of only{" "}
            <strong style={{ color: "#7FFDF4" }}>25 seats</strong> ensure every student gets the
            focus they deserve.
          </p>

          {/* Stats row */}
          <div
            style={{
              display: "flex",
              gap: 40,
              flexWrap: "wrap",
              marginBottom: 48,
              paddingBottom: 48,
              borderBottom: "1px solid rgba(255,255,255,0.12)",
            }}
          >
            {[
              { num: "25", label: "Seats Per Batch" },
              { num: "8th", label: "Grade" },
              { num: "3", label: "Demo Sessions" },
            ].map((s) => (
              <div key={s.label} style={{ textAlign: "left" }}>
                <div
                  style={{
                    fontFamily: "'Outfit', sans-serif",
                    fontWeight: 800,
                    fontSize: 36,
                    color: "#7FFDF4",
                  }}
                >
                  {s.num}
                </div>
                <div
                  style={{
                    fontFamily: "'Outfit', sans-serif",
                    fontSize: 13,
                    color: "rgba(255,255,255,0.55)",
                    fontWeight: 500,
                    marginTop: 2,
                  }}
                >
                  {s.label}
                </div>
              </div>
            ))}
          </div>

          {/* Demo sessions */}
          <div>
            <div
              style={{
                fontFamily: "'Outfit', sans-serif",
                fontSize: 12,
                fontWeight: 700,
                color: "rgba(255,255,255,0.45)",
                letterSpacing: "0.12em",
                textTransform: "uppercase",
                marginBottom: 14,
              }}
            >
              Free Demo Sessions
            </div>
            <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
              {DEMO_SESSIONS.map((s) => (
                <div
                  key={s.date}
                  style={{
                    background: "rgba(255,255,255,0.12)",
                    border: "1px solid rgba(255,255,255,0.22)",
                    borderRadius: 12,
                    padding: "10px 18px",
                    textAlign: "center",
                    backdropFilter: "blur(8px)",
                  }}
                >
                  <div
                    style={{
                      fontFamily: "'Outfit', sans-serif",
                      fontWeight: 800,
                      fontSize: 16,
                      color: "#fff",
                    }}
                  >
                    {s.date}
                  </div>
                  <div
                    style={{
                      fontFamily: "'Outfit', sans-serif",
                      fontSize: 11,
                      color: "rgba(255,255,255,0.55)",
                      fontWeight: 500,
                    }}
                  >
                    {s.day} · {s.time}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right: Info card */}
        <div
          style={{
            background: "rgba(255,255,255,0.10)",
            border: "1.5px solid rgba(255,255,255,0.22)",
            borderRadius: 24,
            padding: "36px 32px",
            backdropFilter: "blur(16px)",
          }}
        >
          <div style={{ marginBottom: 28 }}></div>
          <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
            {[
              {
                icon: "📍",
                label: "Location",
                value: "Ameya Towers, Near Dinanath High School, Humpyard Road, Dhantoli",
              },
              { icon: "📅", label: "Demo Dates", value: "June 1, 3, 5 · 5:30–6:30 PM" },
              { icon: "🎓", label: "For Grade", value: "Grade 8 only" },
              { icon: "👥", label: "Batch Size", value: "Only 25 seats per batch" },
              { icon: "📞", label: "Contact", value: "8552007285 · 8446980747" },
            ].map((item) => (
              <div key={item.label} style={{ display: "flex", gap: 14, alignItems: "flex-start" }}>
                <div
                  style={{
                    width: 36,
                    height: 36,
                    borderRadius: 10,
                    background: "rgba(255,255,255,0.12)",
                    flexShrink: 0,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: 16,
                  }}
                >
                  {item.icon}
                </div>
                <div>
                  <div
                    style={{
                      fontFamily: "'Outfit', sans-serif",
                      fontSize: 11,
                      fontWeight: 700,
                      color: "rgba(255,255,255,0.45)",
                      letterSpacing: "0.09em",
                      textTransform: "uppercase",
                      marginBottom: 2,
                    }}
                  >
                    {item.label}
                  </div>
                  <div
                    style={{
                      fontFamily: "'Outfit', sans-serif",
                      fontSize: 14,
                      color: "rgba(255,255,255,0.88)",
                      lineHeight: 1.5,
                    }}
                  >
                    {item.value}
                  </div>
                </div>
              </div>
            ))}
          </div>
          <a
            href="#register"
            style={{
              display: "block",
              marginTop: 28,
              textAlign: "center",
              background: "linear-gradient(135deg, #fff, #e6fffe)",
              color: "#0B3F44",
              padding: "14px 28px",
              borderRadius: 100,
              fontFamily: "'Outfit', sans-serif",
              fontWeight: 800,
              fontSize: 15,
              textDecoration: "none",
              boxShadow: "0 6px 24px rgba(0,0,0,0.15)",
            }}
          >
            Register for Free Demo →
          </a>
        </div>
      </div>
    </section>
  );
}

// ── Registration Form ─────────────────────────────────────────────────────────
function RegistrationSection() {
  const { ref, visible } = useReveal();
  const [form, setForm] = useState<FormData>({
    studentName: "",
    school: "",
    branch: "",
    parentName: "",
    phone: "",
    email: "",
    area: "",
    consent: false,
  });
  const [errors, setErrors] = useState<Partial<Record<keyof FormData, string>>>({});
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);

  const validate = () => {
    const e: Partial<Record<keyof FormData, string>> = {};
    if (!form.studentName.trim()) e.studentName = "Please enter the student's name.";
    if (!form.school.trim()) e.school = "Please enter the school name.";
    if (!form.branch) e.branch = "Please select a branch.";
    if (!form.phone.trim() || form.phone.replace(/\D/g, "").length !== 10)
      e.phone = "Please enter a valid 10-digit number.";
    if (!form.area.trim()) e.area = "Please tell us where you live in Nagpur.";
    if (!form.consent) e.consent = "Please accept the terms to proceed.";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate() || submitting) return;
    setSubmitting(true);
    setApiError(null);

    try {
      // ── API call matching /api/save-summer-camp-registration shape ────────
      const res = await fetch("/api/mathology/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.studentName,
          className: "Grade 8",
          school: form.school,
          branch: form.branch,
          parentName: form.parentName,
          mobile: form.phone,
          email: form.email,
          area: form.area,
        }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.error || "Registration failed. Please try again.");
      }

      setSubmitted(true);
    } catch (err: any) {
      console.error("Registration error:", err);
      setApiError(err?.message || "Something went wrong. Please try again or call us directly.");
    } finally {
      setSubmitting(false);
    }
  };

  const inp = (hasError?: boolean): React.CSSProperties => ({
    width: "100%",
    padding: "14px 18px",
    borderRadius: 12,
    border: `1.5px solid ${hasError ? "#E45C48" : "rgba(10,138,128,0.22)"}`,
    fontFamily: "'Outfit', sans-serif",
    fontSize: 15,
    color: "#0B3F44",
    background: "#fff",
    outline: "none",
    boxSizing: "border-box",
    transition: "border-color 0.2s, box-shadow 0.2s",
  });
  const lbl: React.CSSProperties = {
    display: "block",
    fontFamily: "'Outfit', sans-serif",
    fontWeight: 600,
    fontSize: 14,
    color: "#0B3F44",
    marginBottom: 6,
  };
  const errStyle: React.CSSProperties = {
    fontFamily: "'Outfit', sans-serif",
    fontSize: 12,
    color: "#E45C48",
    marginTop: 4,
  };

  // ── Success screen ─────────────────────────────────────────────────────────
  if (submitted) {
    return (
      <section id="register" style={{ background: "#F5F6F7", padding: "100px 24px" }}>
        <div
          style={{
            maxWidth: 560,
            margin: "0 auto",
            textAlign: "center",
            background: "#fff",
            borderRadius: 24,
            padding: "60px 40px",
            boxShadow: "0 24px 80px rgba(10,138,128,0.12)",
            border: "2px solid rgba(10,138,128,0.15)",
          }}
        >
          <div style={{ fontSize: 64, marginBottom: 20 }}>🎉</div>
          <h2
            style={{
              fontFamily: "'Outfit', sans-serif",
              fontWeight: 800,
              fontSize: 32,
              color: "#0B3F44",
              margin: "0 0 12px",
            }}
          >
            You're Registered!
          </h2>
          <p
            style={{
              fontFamily: "'Outfit', sans-serif",
              fontSize: 16,
              color: "#555",
              lineHeight: 1.7,
              margin: "0 0 28px",
            }}
          >
            Thank you, <strong>{form.parentName}</strong>! We've received {form.studentName}'s
            registration for the free demo session. Our team will reach out on{" "}
            <strong>{form.phone}</strong> with further details shortly.
          </p>
          <div
            style={{
              background: "rgba(10,138,128,0.07)",
              border: "1px solid rgba(10,138,128,0.18)",
              borderRadius: 14,
              padding: "18px 24px",
              fontFamily: "'Outfit', sans-serif",
              fontSize: 14,
              color: "#0B3F44",
              lineHeight: 1.9,
              textAlign: "left",
            }}
          >
            <strong>📅 Demo Sessions:</strong> June 1, 3, 5 · 5:30–6:30 PM
            <br />
            <strong>📍 Venue:</strong> Ameya Towers, Humpyard Road, Dhantoli
            <br />
            <strong>🎓 Grade:</strong> Grade 8 only
            <br />
            <strong>📞 Questions?</strong> Call 8552007285 / 8446980747
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="register" style={{ background: "#F5F6F7", padding: "100px 24px" }}>
      <div style={{ maxWidth: 760, margin: "0 auto" }}>
        {/* Header */}
        <div
          ref={ref}
          style={{
            textAlign: "center",
            marginBottom: 52,
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
              fontSize: 13,
              fontWeight: 700,
              color: "#0A8A80",
              letterSpacing: "0.10em",
              textTransform: "uppercase",
            }}
          >
            Free Demo Registration · Grade 8
          </div>
          <h2
            style={{
              fontFamily: "'Outfit', sans-serif",
              fontWeight: 900,
              fontSize: "clamp(28px, 4vw, 44px)",
              color: "#0B3F44",
              margin: "0 0 12px",
            }}
          >
            Secure Your Child's Spot
          </h2>
          <p
            style={{
              fontFamily: "'Outfit', sans-serif",
              fontSize: 17,
              color: "#666",
              maxWidth: 520,
              margin: "0 auto",
              lineHeight: 1.7,
            }}
          >
            Fill in the details below and we'll confirm your registration for the free demo session.
            Only <strong style={{ color: "#0A8A80" }}>25 seats per batch</strong> — register early.
          </p>
        </div>

        {/* Demo session chips */}
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            gap: 12,
            flexWrap: "wrap",
            marginBottom: 40,
          }}
        >
          {DEMO_SESSIONS.map((s) => (
            <div
              key={s.date}
              style={{
                background: "#0A8A80",
                color: "#fff",
                borderRadius: 100,
                padding: "8px 20px",
                fontFamily: "'Outfit', sans-serif",
                fontWeight: 700,
                fontSize: 14,
                boxShadow: "0 4px 14px rgba(10,138,128,0.25)",
              }}
            >
              {s.date} · {s.time}
            </div>
          ))}
        </div>

        {/* Form card */}
        <div
          style={{
            background: "#fff",
            borderRadius: 24,
            padding: "44px 44px",
            boxShadow: "0 24px 80px rgba(0,0,0,0.09)",
            border: "1.5px solid rgba(10,138,128,0.10)",
          }}
        >
          {/* ── Section 01: Student Details ── */}
          <div style={{ marginBottom: 36 }}>
            <SectionHeader num="01" title="Student Details" />
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
              {/* Student Name */}
              <div style={{ gridColumn: "1 / -1" }}>
                <label style={lbl}>Student's Full Name *</label>
                <input
                  type="text"
                  value={form.studentName}
                  onChange={(e) => setForm((f) => ({ ...f, studentName: e.target.value }))}
                  placeholder="Enter student's full name"
                  style={inp(!!errors.studentName)}
                  onFocus={(e) => (e.target.style.borderColor = "#0A8A80")}
                  onBlur={(e) =>
                    (e.target.style.borderColor = errors.studentName
                      ? "#E45C48"
                      : "rgba(10,138,128,0.22)")
                  }
                />
                {errors.studentName && <div style={errStyle}>{errors.studentName}</div>}
              </div>

              {/* Grade — locked to Grade 8 */}
              <div>
                <label style={lbl}>Grade / Class</label>
                <div
                  style={{
                    ...inp(),
                    background: "rgba(10,138,128,0.06)",
                    border: "1.5px solid rgba(10,138,128,0.22)",
                    color: "#0A8A80",
                    fontWeight: 700,
                    display: "flex",
                    alignItems: "center",
                    gap: 8,
                  }}
                >
                  <span>🎓</span> Grade 8
                </div>
                <div
                  style={{
                    fontFamily: "'Outfit', sans-serif",
                    fontSize: 12,
                    color: "#888",
                    marginTop: 4,
                  }}
                >
                  Mathology is currently open for Grade 8 only.
                </div>
              </div>

              {/* School */}
              <div>
                <label style={lbl}>School Name *</label>
                <input
                  type="text"
                  value={form.school}
                  onChange={(e) => setForm((f) => ({ ...f, school: e.target.value }))}
                  placeholder="Name of school"
                  style={inp(!!errors.school)}
                  onFocus={(e) => (e.target.style.borderColor = "#0A8A80")}
                  onBlur={(e) =>
                    (e.target.style.borderColor = errors.school
                      ? "#E45C48"
                      : "rgba(10,138,128,0.22)")
                  }
                />
                {errors.school && <div style={errStyle}>{errors.school}</div>}
              </div>

              {/* Branch */}
              <div style={{ gridColumn: "1 / -1" }}>
                <label style={lbl}>School Branch *</label>
                <input
                  type="text"
                  value={form.branch}
                  onChange={(e) => setForm((f) => ({ ...f, branch: e.target.value }))}
                  placeholder="e.g. Science, Commerce, Arts…"
                  style={inp(!!errors.branch)}
                  onFocus={(e) => (e.target.style.borderColor = "#0A8A80")}
                  onBlur={(e) =>
                    (e.target.style.borderColor = errors.branch
                      ? "#E45C48"
                      : "rgba(10,138,128,0.22)")
                  }
                />
                {errors.branch && <div style={errStyle}>{errors.branch}</div>}
              </div>
            </div>
          </div>

          {/* ── Section 02: Parent / Guardian Details ── */}
          <div style={{ marginBottom: 36 }}>
            <SectionHeader num="02" title="Parent / Guardian Details" />
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
              <div style={{ gridColumn: "1 / -1" }}>
                <label style={lbl}>
                  Parent / Guardian Name{" "}
                  <span style={{ fontWeight: 400, color: "#999" }}>(optional)</span>
                </label>
                <input
                  type="text"
                  value={form.parentName}
                  onChange={(e) => setForm((f) => ({ ...f, parentName: e.target.value }))}
                  placeholder="Parent or guardian's full name"
                  style={inp()}
                  onFocus={(e) => (e.target.style.borderColor = "#0A8A80")}
                  onBlur={(e) => (e.target.style.borderColor = "rgba(10,138,128,0.22)")}
                />
              </div>

              <div>
                <label style={lbl}>Phone (WhatsApp) *</label>
                <input
                  type="tel"
                  value={form.phone}
                  onChange={(e) =>
                    setForm((f) => ({
                      ...f,
                      phone: e.target.value.replace(/\D/g, "").slice(0, 10),
                    }))
                  }
                  placeholder="10-digit mobile number"
                  style={inp(!!errors.phone)}
                  onFocus={(e) => (e.target.style.borderColor = "#0A8A80")}
                  onBlur={(e) =>
                    (e.target.style.borderColor = errors.phone
                      ? "#E45C48"
                      : "rgba(10,138,128,0.22)")
                  }
                />
                {errors.phone && <div style={errStyle}>{errors.phone}</div>}
              </div>

              <div>
                <label style={lbl}>
                  Email Address <span style={{ fontWeight: 400, color: "#999" }}>(optional)</span>
                </label>
                <input
                  type="email"
                  value={form.email}
                  onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                  placeholder="your@email.com"
                  style={inp()}
                  onFocus={(e) => (e.target.style.borderColor = "#0A8A80")}
                  onBlur={(e) => (e.target.style.borderColor = "rgba(10,138,128,0.22)")}
                />
              </div>
            </div>
          </div>

          {/* ── Section 03: Area Question ── */}
          <div style={{ marginBottom: 32 }}>
            <SectionHeader num="03" title="Just One More Thing" />
            <label style={{ ...lbl, marginBottom: 4 }}>Where do you live in Nagpur? *</label>
            <p
              style={{
                fontFamily: "'Outfit', sans-serif",
                fontSize: 13,
                color: "#888",
                margin: "0 0 10px",
              }}
            >
              This helps us understand where our students come from and plan future branches.
            </p>
            <input
              type="text"
              value={form.area}
              onChange={(e) => setForm((f) => ({ ...f, area: e.target.value }))}
              placeholder="e.g. Dharampeth, Sitabuldi, Bajaj Nagar, Ramdaspeth…"
              style={inp(!!errors.area)}
              onFocus={(e) => (e.target.style.borderColor = "#0A8A80")}
              onBlur={(e) =>
                (e.target.style.borderColor = errors.area ? "#E45C48" : "rgba(10,138,128,0.22)")
              }
            />
            {errors.area && <div style={errStyle}>{errors.area}</div>}
          </div>

          {/* Consent */}
          <div style={{ marginBottom: 28 }}>
            <label
              style={{ display: "flex", alignItems: "flex-start", gap: 12, cursor: "pointer" }}
            >
              <input
                type="checkbox"
                checked={form.consent}
                onChange={(e) => setForm((f) => ({ ...f, consent: e.target.checked }))}
                style={{
                  marginTop: 3,
                  width: 18,
                  height: 18,
                  accentColor: "#0A8A80",
                  flexShrink: 0,
                }}
              />
              <span
                style={{
                  fontFamily: "'Outfit', sans-serif",
                  fontSize: 14,
                  color: "#555",
                  lineHeight: 1.6,
                }}
              >
                I confirm that the information provided is accurate and I agree to be contacted by
                Mathology by Logicology regarding the demo session and admission process.
              </span>
            </label>
            {errors.consent && <div style={{ ...errStyle, marginTop: 6 }}>{errors.consent}</div>}
          </div>

          {/* API Error Banner */}
          {apiError && (
            <div
              style={{
                background: "#FFF0EE",
                border: "1.5px solid #E45C48",
                borderRadius: 12,
                padding: "14px 18px",
                marginBottom: 20,
                fontFamily: "'Outfit', sans-serif",
                fontSize: 14,
                color: "#c0392b",
                display: "flex",
                alignItems: "flex-start",
                gap: 10,
              }}
            >
              <span style={{ flexShrink: 0 }}>⚠️</span>
              <span>{apiError}</span>
            </div>
          )}

          {/* Submit */}
          <button
            onClick={handleSubmit}
            disabled={submitting}
            style={{
              width: "100%",
              background: submitting ? "#aaa" : "linear-gradient(135deg, #0A8A80, #0B6B63)",
              color: "#fff",
              padding: "18px",
              borderRadius: 100,
              border: "none",
              fontFamily: "'Outfit', sans-serif",
              fontWeight: 800,
              fontSize: 18,
              cursor: submitting ? "not-allowed" : "pointer",
              boxShadow: submitting ? "none" : "0 6px 28px rgba(10,138,128,0.35)",
              transition: "transform 0.2s, box-shadow 0.2s",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 10,
            }}
            onMouseEnter={(e) => {
              if (!submitting) {
                (e.currentTarget as HTMLButtonElement).style.transform = "translateY(-2px)";
                (e.currentTarget as HTMLButtonElement).style.boxShadow =
                  "0 10px 36px rgba(10,138,128,0.45)";
              }
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLButtonElement).style.transform = "translateY(0)";
              (e.currentTarget as HTMLButtonElement).style.boxShadow =
                "0 6px 28px rgba(10,138,128,0.35)";
            }}
          >
            {submitting ? (
              <>
                <span
                  style={{
                    display: "inline-block",
                    width: 18,
                    height: 18,
                    border: "2.5px solid rgba(255,255,255,0.4)",
                    borderTopColor: "#fff",
                    borderRadius: "50%",
                    animation: "spin 0.8s linear infinite",
                  }}
                />
                Registering…
              </>
            ) : (
              "Register for Free Demo →"
            )}
          </button>

          <div
            style={{
              marginTop: 14,
              textAlign: "center",
              fontFamily: "'Outfit', sans-serif",
              fontSize: 13,
              color: "#999",
            }}
          >
            🔒 Your details are safe with us · No spam, we promise
          </div>
        </div>
      </div>
    </section>
  );
}

// ── Section header helper ─────────────────────────────────────────────────────
function SectionHeader({ num, title }: { num: string; title: string }) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 12,
        marginBottom: 24,
        paddingBottom: 16,
        borderBottom: "2px solid rgba(10,138,128,0.10)",
      }}
    >
      <div
        style={{
          width: 32,
          height: 32,
          borderRadius: 8,
          background: "#0A8A80",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "#fff",
          fontWeight: 800,
          fontSize: 14,
          fontFamily: "'Outfit', sans-serif",
          flexShrink: 0,
        }}
      >
        {num}
      </div>
      <h3
        style={{
          fontFamily: "'Outfit', sans-serif",
          fontWeight: 700,
          fontSize: 18,
          color: "#0B3F44",
          margin: 0,
        }}
      >
        {title}
      </h3>
    </div>
  );
}

// ── Footer ────────────────────────────────────────────────────────────────────
function Footer() {
  return (
    <footer
      style={{
        background: "#0B3F44",
        color: "rgba(255,255,255,0.6)",
        padding: "48px 32px",
        textAlign: "center",
      }}
    >
      <p style={{ fontFamily: "'Outfit', sans-serif", fontSize: 14, margin: "0 0 8px" }}>
        Ameya Towers, Near Dinanath High School, Humpyard Road, Dhantoli, Nagpur
      </p>
      <p style={{ fontFamily: "'Outfit', sans-serif", fontSize: 14, margin: 0 }}>
        📞 8552007285 · 8446980747 &nbsp;|&nbsp; A{" "}
        <strong style={{ color: "rgba(255,255,255,0.85)" }}>Logicology</strong> initiative
      </p>
    </footer>
  );
}

// ── Page ──────────────────────────────────────────────────────────────────────
export default function MathologyRegistrationPage() {
  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700;800;900&display=swap');
        *, *::before, *::after { box-sizing: border-box; }
        html { scroll-behavior: smooth; }
        body { margin: 0; background: #F5F6F7; font-family: 'Outfit', sans-serif; }
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        select { cursor: pointer; }
        input::placeholder, textarea::placeholder { color: #bbb; }
        @media (max-width: 768px) {
          .hero-grid { grid-template-columns: 1fr !important; padding: 40px 20px !important; }
          .form-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
      <NavBar />
      <HeroSection />
      <RegistrationSection />
      <Footer />
    </>
  );
}

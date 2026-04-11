"use client";

// app/summercamp2026/myCourseDeatil/CourseDetailContent.tsx
// This component is a "use client" component that safely uses useSearchParams()
// because it is always rendered inside a <Suspense> boundary in page.tsx.

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";

// ── Types ─────────────────────────────────────────────────────────────────────
interface Registration {
  _id: string;
  customerInfo: { name: string; email: string; phone: string };
  campDetails: {
    childName: string;
    childAge: string;
    childGrade: string;
    batch: string;
    allergies?: string;
    referral?: string;
  };
  paymentInfo: {
    paymentId: string;
    orderId: string;
    amount: number;
    currency?: string;
    status: string;
    description?: string;
  };
  // Flexible — handles old schema (subtotal) and new schema (baseAmount + gstAmount)
  totals?: {
    baseAmount?: number;
    gstAmount?: number;
    gstRate?: number;
    total?: number;
    subtotal?: number;
    discount?: number;
  };
  items?: Array<{ name: string; price: number; quantity: number }>;
  createdAt: string | { $date: string };
}

// ── Normalise totals across old + new schema ──────────────────────────────────
function normaliseTotals(reg: Registration) {
  const t = reg.totals ?? {};
  const paid = reg.paymentInfo.amount ?? 0;

  if (t.baseAmount !== undefined) {
    return {
      baseAmount: t.baseAmount,
      gstAmount: t.gstAmount ?? 0,
      gstRate: t.gstRate ?? 18,
      total: t.total ?? paid,
    };
  }

  // Old schema: back-calculate from stored total
  const total = t.total ?? t.subtotal ?? paid;
  const gstRate = 18;
  const baseAmount = Math.round((total / (1 + gstRate / 100)) * 100) / 100;
  const gstAmount = Math.round((total - baseAmount) * 100) / 100;
  return { baseAmount, gstAmount, gstRate, total };
}

// ── Parse createdAt (ISO string or Mongo { $date } export object) ─────────────
function parseCreatedAt(v: unknown): string {
  if (!v) return "";
  if (typeof v === "string") return v;
  if (typeof v === "object" && v !== null && "$date" in v) return (v as { $date: string }).$date;
  return "";
}

// ── parseBatch ────────────────────────────────────────────────────────────────
function parseBatch(batch: string) {
  const nameMatch = batch.match(/^([^—–]+)/);
  const datesMatch = batch.match(/[—–]\s*(.+?)\s*\(/);
  const timeMatch = batch.match(/\((.+?)\)/);
  return {
    name: nameMatch?.[1]?.trim() ?? batch,
    dates: datesMatch?.[1]?.trim() ?? "",
    time: timeMatch?.[1]?.trim() ?? "",
  };
}

function formatDate(iso: string) {
  if (!iso) return "—";
  try {
    return new Date(iso).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "long",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch {
    return iso;
  }
}

function formatINR(n: number) {
  return `₹${Number(n).toLocaleString("en-IN", { maximumFractionDigits: 2 })}`;
}

// ── Countdown ─────────────────────────────────────────────────────────────────
function useCountdown(batch: string) {
  const [t, setT] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    if (!batch) return;
    const m = batch.match(/[—–]\s*(\d+\s+\w+)\s*[–-]/);
    if (!m) return;
    const target = new Date(`${m[1].trim()} ${new Date().getFullYear()} 10:00:00`);
    if (isNaN(target.getTime())) return;

    const tick = () => {
      const diff = target.getTime() - Date.now();
      if (diff <= 0) {
        setT({ days: 0, hours: 0, minutes: 0, seconds: 0 });
        return;
      }
      setT({
        days: Math.floor(diff / 86400000),
        hours: Math.floor((diff % 86400000) / 3600000),
        minutes: Math.floor((diff % 3600000) / 60000),
        seconds: Math.floor((diff % 60000) / 1000),
      });
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [batch]);

  return t;
}

// ── Small UI pieces ───────────────────────────────────────────────────────────
function InfoRow({ label, value, icon }: { label: string; value: string; icon: string }) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "flex-start",
        gap: 14,
        padding: "14px 0",
        borderBottom: "1px solid rgba(10,138,128,0.08)",
      }}
    >
      <span style={{ fontSize: 20, flexShrink: 0, marginTop: 1 }}>{icon}</span>
      <div>
        <div
          style={{
            fontFamily: "'Outfit',sans-serif",
            fontSize: 11,
            fontWeight: 700,
            color: "#0A8A80",
            textTransform: "uppercase",
            letterSpacing: "0.08em",
            marginBottom: 3,
          }}
        >
          {label}
        </div>
        <div
          style={{
            fontFamily: "'Outfit',sans-serif",
            fontSize: 15,
            color: "#0B3F44",
            fontWeight: 600,
          }}
        >
          {value || "—"}
        </div>
      </div>
    </div>
  );
}

function CountdownBox({ value, label }: { value: number; label: string }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 6 }}>
      <div
        style={{
          background: "rgba(255,255,255,0.15)",
          border: "1px solid rgba(255,255,255,0.25)",
          borderRadius: 14,
          width: 72,
          height: 72,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontFamily: "'Outfit',sans-serif",
          fontWeight: 800,
          fontSize: 28,
          color: "#fff",
          backdropFilter: "blur(8px)",
        }}
      >
        {String(value).padStart(2, "0")}
      </div>
      <span
        style={{
          fontFamily: "'Outfit',sans-serif",
          fontSize: 11,
          fontWeight: 600,
          color: "rgba(255,255,255,0.60)",
          textTransform: "uppercase",
          letterSpacing: "0.10em",
        }}
      >
        {label}
      </span>
    </div>
  );
}

function Skeleton({
  w = "100%",
  h = 20,
  radius = 8,
}: {
  w?: string | number;
  h?: number;
  radius?: number;
}) {
  return (
    <div
      style={{
        width: w,
        height: h,
        borderRadius: radius,
        background: "linear-gradient(90deg,#e8f5f4 25%,#d0ebe9 50%,#e8f5f4 75%)",
        backgroundSize: "200% 100%",
        animation: "shimmer 1.4s infinite",
      }}
    />
  );
}

// ── Main component ────────────────────────────────────────────────────────────
export default function CourseDetailContent() {
  // ✅ Safe: this component is always inside <Suspense> from page.tsx
  const searchParams = useSearchParams();
  const id = searchParams.get("id");

  const [reg, setReg] = useState<Registration | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!id) {
      setError("No enrollment ID found in the URL.");
      setLoading(false);
      return;
    }

    console.log("[CourseDetail] fetching ?id=", id);

    fetch(`/api/save-summer-camp-registration?id=${encodeURIComponent(id)}`)
      .then(async (r) => {
        const text = await r.text();
        console.log("[CourseDetail] response status:", r.status, "body:", text);
        return JSON.parse(text);
      })
      .then((data) => {
        if (data.success) {
          setReg(data.registration);
        } else {
          setError(data.error ?? "Registration not found.");
        }
      })
      .catch((e) => {
        console.error("[CourseDetail] fetch failed:", e);
        setError("Network error — please refresh or contact support.");
      })
      .finally(() => setLoading(false));
  }, [id]);

  const batch = reg ? parseBatch(reg.campDetails.batch) : null;
  const countdown = useCountdown(reg?.campDetails.batch ?? "");
  const totals = reg ? normaliseTotals(reg) : null;
  const createdAt = parseCreatedAt(reg?.createdAt);
  const isJunior = reg?.campDetails.batch.toLowerCase().includes("logicoland");

  const venueLines = [
    "Logicology Learning Centre",
    "First Floor, Ameya Towers",
    "Plot No 25, Humpyard Road",
    "Near Dinanath High School, Dhantoli",
    "Nagpur – 440012, Maharashtra",
  ];
  const bringItems = [
    { icon: "💧", text: "Water bottle" },
    { icon: "🍎", text: "Light snack (if you have dietary needs)" },
    { icon: "👟", text: "Comfortable clothing" },
    { icon: "📋", text: "All worksheets & materials provided by Logicology" },
  ];

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700;800&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        html { scroll-behavior: smooth; }
        body { font-family:'Outfit',sans-serif; background:#f0f9f8; }
        @keyframes shimmer { 0%{background-position:200% 0} 100%{background-position:-200% 0} }
        @keyframes fadeUp { from{opacity:0;transform:translateY(24px)} to{opacity:1;transform:translateY(0)} }
        @keyframes pulse { 0%,100%{transform:scale(1)} 50%{transform:scale(1.05)} }
        @keyframes spin { to{transform:rotate(360deg)} }
        .card{animation:fadeUp 0.55s ease both}
        .card:nth-child(1){animation-delay:.05s}.card:nth-child(2){animation-delay:.12s}
        .card:nth-child(3){animation-delay:.19s}.card:nth-child(4){animation-delay:.26s}
        .card:nth-child(5){animation-delay:.33s}.card:nth-child(6){animation-delay:.40s}
        .hover-lift{transition:transform 0.2s,box-shadow 0.2s}
        .hover-lift:hover{transform:translateY(-3px);box-shadow:0 12px 40px rgba(10,138,128,0.12)!important}
        .copy-btn:hover{background:rgba(10,138,128,0.10)!important}
      `}</style>

      {/* Nav */}
      <header
        style={{
          position: "sticky",
          top: 0,
          zIndex: 50,
          background: "rgba(255,255,255,0.92)",
          backdropFilter: "blur(12px)",
          borderBottom: "1px solid rgba(10,138,128,0.10)",
          padding: "0 24px",
        }}
      >
        <div
          style={{
            maxWidth: 1100,
            margin: "0 auto",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            height: 64,
          }}
        >
          <Link href="/">
            <Image
              src="https://ik.imagekit.io/pratik2002/logicology-logo_74-P-ICfG?updatedAt=1756257433107"
              alt="Logicology"
              width={130}
              height={52}
              style={{ objectFit: "contain" }}
            />
          </Link>
          <div
            style={{
              fontFamily: "'Outfit',sans-serif",
              fontSize: 13,
              fontWeight: 600,
              color: "#0A8A80",
              background: "rgba(10,138,128,0.08)",
              border: "1px solid rgba(10,138,128,0.18)",
              borderRadius: 100,
              padding: "5px 14px",
            }}
          >
            My Enrollment
          </div>
        </div>
      </header>

      <main style={{ minHeight: "100vh", paddingBottom: 80 }}>
        {/* Hero */}
        <div
          style={{
            background: "linear-gradient(135deg,#0A8A80 0%,#0B3F44 100%)",
            padding: "60px 24px 80px",
            position: "relative",
            overflow: "hidden",
          }}
        >
          <div
            style={{
              position: "absolute",
              top: -60,
              right: -60,
              width: 280,
              height: 280,
              borderRadius: "50%",
              background: "rgba(216,174,79,0.10)",
              filter: "blur(60px)",
              pointerEvents: "none",
            }}
          />
          <div
            style={{
              position: "absolute",
              bottom: -40,
              left: -40,
              width: 200,
              height: 200,
              borderRadius: "50%",
              background: "rgba(228,92,72,0.08)",
              filter: "blur(50px)",
              pointerEvents: "none",
            }}
          />

          <div
            style={{
              maxWidth: 760,
              margin: "0 auto",
              textAlign: "center",
              position: "relative",
              zIndex: 1,
            }}
          >
            <div
              style={{
                width: 80,
                height: 80,
                borderRadius: "50%",
                background: "rgba(255,255,255,0.12)",
                border: "2px solid rgba(255,255,255,0.25)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                margin: "0 auto 24px",
                fontSize: 36,
                animation: "pulse 3s ease-in-out infinite",
              }}
            >
              🎉
            </div>

            {loading && (
              <div
                style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 14 }}
              >
                <Skeleton w={320} h={44} radius={12} />
                <Skeleton w={240} h={22} radius={8} />
              </div>
            )}

            {!loading && error && (
              <>
                <h1
                  style={{
                    fontFamily: "'Outfit',sans-serif",
                    fontWeight: 800,
                    fontSize: "clamp(22px,4vw,36px)",
                    color: "#fff",
                    marginBottom: 12,
                  }}
                >
                  Could not load enrollment
                </h1>
                <p
                  style={{
                    fontFamily: "'Outfit',sans-serif",
                    fontSize: 16,
                    color: "rgba(255,255,255,0.70)",
                  }}
                >
                  {error}
                </p>
              </>
            )}

            {!loading && reg && batch && (
              <>
                <h1
                  style={{
                    fontFamily: "'Outfit',sans-serif",
                    fontWeight: 800,
                    fontSize: "clamp(26px,4vw,44px)",
                    color: "#fff",
                    marginBottom: 12,
                    lineHeight: 1.2,
                  }}
                >
                  You're Enrolled, {reg.campDetails.childName.split(" ")[0]}! 🌟
                </h1>
                <p
                  style={{
                    fontFamily: "'Outfit',sans-serif",
                    fontSize: 18,
                    color: "rgba(255,255,255,0.72)",
                    marginBottom: 36,
                    lineHeight: 1.7,
                  }}
                >
                  <strong style={{ color: "#fff" }}>{reg.campDetails.childName}</strong> is all set
                  for&nbsp;
                  <strong style={{ color: "#D8AE4F" }}>{batch.name}</strong>.
                  <br />
                  See you on <strong style={{ color: "#D8AE4F" }}>{batch.dates}</strong>!
                </p>
                <div>
                  <div
                    style={{
                      fontFamily: "'Outfit',sans-serif",
                      fontSize: 12,
                      fontWeight: 700,
                      color: "rgba(255,255,255,0.50)",
                      textTransform: "uppercase",
                      letterSpacing: "0.10em",
                      marginBottom: 16,
                    }}
                  >
                    Workshop Starts In
                  </div>
                  <div
                    style={{ display: "flex", gap: 16, justifyContent: "center", flexWrap: "wrap" }}
                  >
                    <CountdownBox value={countdown.days} label="Days" />
                    <CountdownBox value={countdown.hours} label="Hours" />
                    <CountdownBox value={countdown.minutes} label="Min" />
                    <CountdownBox value={countdown.seconds} label="Sec" />
                  </div>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Cards */}
        <div
          style={{
            maxWidth: 1100,
            margin: "-48px auto 0",
            padding: "0 24px",
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit,minmax(320px,1fr))",
            gap: 20,
            position: "relative",
            zIndex: 2,
          }}
        >
          {/* Workshop Details */}
          <div
            className="card hover-lift"
            style={{
              background: "#fff",
              borderRadius: 20,
              padding: 28,
              boxShadow: "0 4px 24px rgba(10,138,128,0.08)",
              border: "1px solid rgba(10,138,128,0.08)",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 20 }}>
              <div
                style={{
                  width: 38,
                  height: 38,
                  borderRadius: 10,
                  background: "linear-gradient(135deg,#0A8A80,#0B3F44)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 18,
                }}
              >
                📚
              </div>
              <h2
                style={{
                  fontFamily: "'Outfit',sans-serif",
                  fontWeight: 700,
                  fontSize: 17,
                  color: "#0B3F44",
                }}
              >
                Workshop Details
              </h2>
            </div>
            {loading && (
              <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                {[90, 150, 110, 130].map((w, i) => (
                  <Skeleton key={i} w={w} h={16} />
                ))}
              </div>
            )}
            {!loading && reg && batch && (
              <>
                <div
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 6,
                    background: isJunior ? "rgba(10,138,128,0.10)" : "rgba(228,92,72,0.10)",
                    border: `1px solid ${isJunior ? "rgba(10,138,128,0.25)" : "rgba(228,92,72,0.25)"}`,
                    borderRadius: 100,
                    padding: "4px 14px",
                    marginBottom: 16,
                    fontFamily: "'Outfit',sans-serif",
                    fontSize: 12,
                    fontWeight: 700,
                    color: isJunior ? "#0A8A80" : "#E45C48",
                    textTransform: "uppercase",
                    letterSpacing: "0.07em",
                  }}
                >
                  {isJunior ? "Ages 6–9 · Juniors" : "Ages 10–14 · Seniors"}
                </div>
                <InfoRow label="Programme" value={batch.name} icon="🎓" />
                <InfoRow label="Dates" value={batch.dates} icon="📅" />
                <InfoRow label="Daily Timings" value={batch.time} icon="⏰" />
                <InfoRow label="Child's Grade" value={reg.campDetails.childGrade} icon="🏫" />
              </>
            )}
          </div>

          {/* Enrollment Info */}
          <div
            className="card hover-lift"
            style={{
              background: "#fff",
              borderRadius: 20,
              padding: 28,
              boxShadow: "0 4px 24px rgba(10,138,128,0.08)",
              border: "1px solid rgba(10,138,128,0.08)",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 20 }}>
              <div
                style={{
                  width: 38,
                  height: 38,
                  borderRadius: 10,
                  background: "linear-gradient(135deg,#D8AE4F,#c4962a)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 18,
                }}
              >
                👨‍👧
              </div>
              <h2
                style={{
                  fontFamily: "'Outfit',sans-serif",
                  fontWeight: 700,
                  fontSize: 17,
                  color: "#0B3F44",
                }}
              >
                Enrollment Info
              </h2>
            </div>
            {loading && (
              <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                {[120, 180, 140, 100].map((w, i) => (
                  <Skeleton key={i} w={w} h={16} />
                ))}
              </div>
            )}
            {!loading && reg && (
              <>
                <InfoRow label="Student Name" value={reg.campDetails.childName} icon="🧒" />
                <InfoRow label="Age" value={`${reg.campDetails.childAge} years`} icon="🎂" />
                <InfoRow label="Parent / Guardian" value={reg.customerInfo.name} icon="👤" />
                <InfoRow label="Email" value={reg.customerInfo.email} icon="📧" />
                <InfoRow label="WhatsApp" value={reg.customerInfo.phone} icon="📱" />
                <InfoRow label="Enrolled On" value={formatDate(createdAt)} icon="🗓️" />
              </>
            )}
          </div>

          {/* Payment Summary */}
          <div
            className="card hover-lift"
            style={{
              background: "#fff",
              borderRadius: 20,
              padding: 28,
              boxShadow: "0 4px 24px rgba(10,138,128,0.08)",
              border: "1px solid rgba(10,138,128,0.08)",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 20 }}>
              <div
                style={{
                  width: 38,
                  height: 38,
                  borderRadius: 10,
                  background: "linear-gradient(135deg,#E45C48,#c94836)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 18,
                }}
              >
                🧾
              </div>
              <h2
                style={{
                  fontFamily: "'Outfit',sans-serif",
                  fontWeight: 700,
                  fontSize: 17,
                  color: "#0B3F44",
                }}
              >
                Payment Summary
              </h2>
            </div>
            {loading && (
              <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                {[160, 120, 100, 80, 200].map((w, i) => (
                  <Skeleton key={i} w={w} h={16} />
                ))}
              </div>
            )}
            {!loading && reg && totals && (
              <>
                <div
                  style={{
                    padding: "14px 0",
                    borderBottom: "1px solid rgba(10,138,128,0.08)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    gap: 8,
                  }}
                >
                  <div style={{ minWidth: 0 }}>
                    <div
                      style={{
                        fontFamily: "'Outfit',sans-serif",
                        fontSize: 11,
                        fontWeight: 700,
                        color: "#0A8A80",
                        textTransform: "uppercase",
                        letterSpacing: "0.08em",
                        marginBottom: 3,
                      }}
                    >
                      Payment ID
                    </div>
                    <div
                      style={{
                        fontFamily: "'Outfit',sans-serif",
                        fontSize: 13,
                        color: "#0B3F44",
                        fontWeight: 600,
                        wordBreak: "break-all",
                      }}
                    >
                      {reg.paymentInfo.paymentId}
                    </div>
                  </div>
                  <button
                    className="copy-btn"
                    onClick={() => {
                      navigator.clipboard.writeText(reg.paymentInfo.paymentId);
                      setCopied(true);
                      setTimeout(() => setCopied(false), 2000);
                    }}
                    style={{
                      flexShrink: 0,
                      background: "transparent",
                      border: "1px solid rgba(10,138,128,0.20)",
                      borderRadius: 8,
                      padding: "6px 12px",
                      fontFamily: "'Outfit',sans-serif",
                      fontSize: 12,
                      fontWeight: 600,
                      color: "#0A8A80",
                      cursor: "pointer",
                      transition: "background 0.2s",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {copied ? "✓ Copied" : "Copy"}
                  </button>
                </div>
                <div
                  style={{
                    padding: "14px 0",
                    borderBottom: "1px solid rgba(10,138,128,0.08)",
                    display: "flex",
                    alignItems: "center",
                    gap: 10,
                  }}
                >
                  <span style={{ fontSize: 20 }}>✅</span>
                  <div>
                    <div
                      style={{
                        fontFamily: "'Outfit',sans-serif",
                        fontSize: 11,
                        fontWeight: 700,
                        color: "#0A8A80",
                        textTransform: "uppercase",
                        letterSpacing: "0.08em",
                        marginBottom: 3,
                      }}
                    >
                      Status
                    </div>
                    <div
                      style={{
                        display: "inline-flex",
                        alignItems: "center",
                        gap: 6,
                        background: "rgba(34,197,94,0.10)",
                        border: "1px solid rgba(34,197,94,0.25)",
                        borderRadius: 100,
                        padding: "3px 12px",
                      }}
                    >
                      <span
                        style={{
                          width: 6,
                          height: 6,
                          borderRadius: "50%",
                          background: "#22c55e",
                          display: "inline-block",
                        }}
                      />
                      <span
                        style={{
                          fontFamily: "'Outfit',sans-serif",
                          fontSize: 13,
                          fontWeight: 700,
                          color: "#16a34a",
                        }}
                      >
                        Payment Confirmed
                      </span>
                    </div>
                  </div>
                </div>
                <div style={{ padding: "16px 0 0" }}>
                  {totals.gstAmount > 0 ? (
                    [
                      { label: "Base Fee", value: formatINR(totals.baseAmount) },
                      {
                        label: `CGST @ ${totals.gstRate / 2}%`,
                        value: formatINR(totals.gstAmount / 2),
                      },
                      {
                        label: `SGST @ ${totals.gstRate / 2}%`,
                        value: formatINR(totals.gstAmount / 2),
                      },
                    ].map((row) => (
                      <div
                        key={row.label}
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          marginBottom: 8,
                          fontFamily: "'Outfit',sans-serif",
                          fontSize: 14,
                          color: "#666",
                        }}
                      >
                        <span>{row.label}</span>
                        <span>{row.value}</span>
                      </div>
                    ))
                  ) : (
                    <div
                      style={{
                        fontFamily: "'Outfit',sans-serif",
                        fontSize: 13,
                        color: "#999",
                        marginBottom: 8,
                      }}
                    >
                      GST invoice sent to your email.
                    </div>
                  )}
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      paddingTop: 12,
                      borderTop: "2px solid rgba(10,138,128,0.12)",
                      fontFamily: "'Outfit',sans-serif",
                      fontWeight: 800,
                      fontSize: 18,
                      color: "#0A8A80",
                    }}
                  >
                    <span>Total Paid</span>
                    <span>{formatINR(totals.total)}</span>
                  </div>
                </div>
              </>
            )}
          </div>

          {/* Venue */}
          <div
            className="card hover-lift"
            style={{
              background: "#fff",
              borderRadius: 20,
              padding: 28,
              boxShadow: "0 4px 24px rgba(10,138,128,0.08)",
              border: "1px solid rgba(10,138,128,0.08)",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 20 }}>
              <div
                style={{
                  width: 38,
                  height: 38,
                  borderRadius: 10,
                  background: "linear-gradient(135deg,#0A8A80,#D8AE4F)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 18,
                }}
              >
                📍
              </div>
              <h2
                style={{
                  fontFamily: "'Outfit',sans-serif",
                  fontWeight: 700,
                  fontSize: 17,
                  color: "#0B3F44",
                }}
              >
                Venue & Location
              </h2>
            </div>
            <div style={{ borderRadius: 12, overflow: "hidden", marginBottom: 16, height: 160 }}>
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3721.559045788271!2d79.08508107590762!3d21.134124080533966!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bd4c0a7c1e0b0b1%3A0x1a2b3c4d5e6f7a8b!2sAmeya%20Towers%2C%20Humpyard%20Rd%2C%20Dhantoli%2C%20Nagpur%2C%20Maharashtra%20440012!5e0!3m2!1sen!2sin!4v1713000000000!5m2!1sen!2sin"
                width="100%"
                height="160"
                style={{ border: 0, display: "block" }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Logicology Location"
              />
            </div>
            {venueLines.map((line, i) => (
              <div
                key={i}
                style={{
                  fontFamily: "'Outfit',sans-serif",
                  fontSize: i === 0 ? 15 : 14,
                  fontWeight: i === 0 ? 700 : 500,
                  color: i === 0 ? "#0B3F44" : "#666",
                  lineHeight: 1.7,
                }}
              >
                {line}
              </div>
            ))}
            <a
              href="https://maps.google.com/?q=Dhantoli+Nagpur"
              target="_blank"
              rel="noreferrer"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 6,
                marginTop: 14,
                fontFamily: "'Outfit',sans-serif",
                fontSize: 13,
                fontWeight: 700,
                color: "#0A8A80",
                textDecoration: "none",
                background: "rgba(10,138,128,0.08)",
                border: "1px solid rgba(10,138,128,0.18)",
                borderRadius: 8,
                padding: "8px 14px",
                transition: "background 0.2s",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(10,138,128,0.14)")}
              onMouseLeave={(e) => (e.currentTarget.style.background = "rgba(10,138,128,0.08)")}
            >
              🗺️ Open in Google Maps
            </a>
            <div
              style={{
                marginTop: 10,
                background: "rgba(228,92,72,0.06)",
                border: "1px solid rgba(228,92,72,0.22)",
                borderRadius: 10,
                padding: "10px 14px",
                fontFamily: "'Outfit',sans-serif",
                fontSize: 13,
                color: "#AB4637",
                lineHeight: 1.6,
                fontWeight: 600,
              }}
            >
              🚪 Please note: the entrance to our office is from the lane behind, not from the main
              road.
            </div>
          </div>

          {/* What to Bring */}
          <div
            className="card hover-lift"
            style={{
              background: "#fff",
              borderRadius: 20,
              padding: 28,
              boxShadow: "0 4px 24px rgba(10,138,128,0.08)",
              border: "1px solid rgba(10,138,128,0.08)",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 20 }}>
              <div
                style={{
                  width: 38,
                  height: 38,
                  borderRadius: 10,
                  background: "linear-gradient(135deg,#E45C48,#D8AE4F)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 18,
                }}
              >
                🎒
              </div>
              <h2
                style={{
                  fontFamily: "'Outfit',sans-serif",
                  fontWeight: 700,
                  fontSize: 17,
                  color: "#0B3F44",
                }}
              >
                What to Bring
              </h2>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {bringItems.map((item) => (
                <div
                  key={item.text}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 12,
                    padding: "10px 14px",
                    background: "rgba(10,138,128,0.04)",
                    borderRadius: 10,
                  }}
                >
                  <span style={{ fontSize: 20 }}>{item.icon}</span>
                  <span
                    style={{
                      fontFamily: "'Outfit',sans-serif",
                      fontSize: 14,
                      color: "#0B3F44",
                      fontWeight: 500,
                    }}
                  >
                    {item.text}
                  </span>
                </div>
              ))}
            </div>
            {/* <div
              style={{
                marginTop: 16,
                background: "rgba(228,92,72,0.06)",
                border: "1px solid rgba(228,92,72,0.20)",
                borderRadius: 10,
                padding: "10px 14px",
                fontFamily: "'Outfit',sans-serif",
                fontSize: 13,
                color: "#AB4637",
                lineHeight: 1.6,
              }}
            >
              🪪 Our team may ask for ID of the person picking up your child. Please carry a valid
              ID.
            </div> */}
          </div>

          {/* Need Help */}
          <div
            className="card"
            style={{
              background: "linear-gradient(135deg,#0B3F44,#0A8A80)",
              borderRadius: 20,
              padding: "32px 28px",
              boxShadow: "0 4px 24px rgba(10,138,128,0.15)",
              position: "relative",
              overflow: "hidden",
            }}
          >
            <div
              style={{
                position: "absolute",
                top: -30,
                right: -30,
                width: 140,
                height: 140,
                borderRadius: "50%",
                background: "rgba(216,174,79,0.12)",
                filter: "blur(30px)",
                pointerEvents: "none",
              }}
            />
            <div style={{ position: "relative", zIndex: 1 }}>
              <div
                style={{
                  width: 42,
                  height: 42,
                  borderRadius: 12,
                  background: "rgba(255,255,255,0.15)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 22,
                  marginBottom: 16,
                }}
              >
                💬
              </div>
              <h2
                style={{
                  fontFamily: "'Outfit',sans-serif",
                  fontWeight: 700,
                  fontSize: 18,
                  color: "#fff",
                  marginBottom: 8,
                }}
              >
                Need Help?
              </h2>
              <p
                style={{
                  fontFamily: "'Outfit',sans-serif",
                  fontSize: 14,
                  color: "rgba(255,255,255,0.70)",
                  lineHeight: 1.7,
                  marginBottom: 24,
                }}
              >
                Our team is here for any questions before your workshop begins.
              </p>
              <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                {[
                  {
                    href: "mailto:support@logicology.in",
                    icon: "📧",
                    label: "Email",
                    value: "support@logicology.in",
                  },
                  {
                    href: "https://wa.me/918446980747",
                    icon: "📱",
                    label: "WhatsApp",
                    value: "8446980747",
                  },
                ].map((c) => (
                  <a
                    key={c.label}
                    href={c.href}
                    target="_blank"
                    rel="noreferrer"
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 12,
                      background: "rgba(255,255,255,0.10)",
                      border: "1px solid rgba(255,255,255,0.18)",
                      borderRadius: 12,
                      padding: "12px 16px",
                      textDecoration: "none",
                      transition: "background 0.2s",
                    }}
                    onMouseEnter={(e) =>
                      (e.currentTarget.style.background = "rgba(255,255,255,0.18)")
                    }
                    onMouseLeave={(e) =>
                      (e.currentTarget.style.background = "rgba(255,255,255,0.10)")
                    }
                  >
                    <span style={{ fontSize: 18 }}>{c.icon}</span>
                    <div>
                      <div
                        style={{
                          fontFamily: "'Outfit',sans-serif",
                          fontSize: 11,
                          fontWeight: 700,
                          color: "rgba(255,255,255,0.50)",
                          textTransform: "uppercase",
                          letterSpacing: "0.08em",
                        }}
                      >
                        {c.label}
                      </div>
                      <div
                        style={{
                          fontFamily: "'Outfit',sans-serif",
                          fontSize: 14,
                          fontWeight: 600,
                          color: "#D8AE4F",
                        }}
                      >
                        {c.value}
                      </div>
                    </div>
                  </a>
                ))}
              </div>
              {reg && (
                <div
                  style={{
                    marginTop: 16,
                    fontFamily: "'Outfit',sans-serif",
                    fontSize: 12,
                    color: "rgba(255,255,255,0.40)",
                  }}
                >
                  Please mention Payment ID&nbsp;
                  <strong style={{ color: "rgba(255,255,255,0.65)" }}>
                    {reg.paymentInfo.paymentId}
                  </strong>
                </div>
              )}
            </div>
          </div>
        </div>
        {/* /grid */}

        {/* Bottom CTAs */}
        {!loading && !error && (
          <div
            style={{
              maxWidth: 1100,
              margin: "32px auto 0",
              padding: "0 24px",
              display: "flex",
              gap: 14,
              flexWrap: "wrap",
              justifyContent: "center",
            }}
          >
            <Link
              href="/summer2026"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 8,
                background: "rgba(10,138,128,0.08)",
                border: "1.5px solid rgba(10,138,128,0.22)",
                borderRadius: 100,
                padding: "12px 24px",
                fontFamily: "'Outfit',sans-serif",
                fontWeight: 700,
                fontSize: 14,
                color: "#0A8A80",
                textDecoration: "none",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(10,138,128,0.14)")}
              onMouseLeave={(e) => (e.currentTarget.style.background = "rgba(10,138,128,0.08)")}
            >
              ← Back to Workshop Page
            </Link>
            <Link
              href="/"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 8,
                background: "#0A8A80",
                borderRadius: 100,
                padding: "12px 24px",
                fontFamily: "'Outfit',sans-serif",
                fontWeight: 700,
                fontSize: 14,
                color: "#fff",
                textDecoration: "none",
                boxShadow: "0 4px 16px rgba(10,138,128,0.30)",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.background = "#0B3F44")}
              onMouseLeave={(e) => (e.currentTarget.style.background = "#0A8A80")}
            >
              Visit Logicology →
            </Link>
          </div>
        )}

        {/* Error state */}
        {!loading && error && (
          <div
            style={{ maxWidth: 480, margin: "60px auto", padding: "0 24px", textAlign: "center" }}
          >
            <div style={{ fontSize: 48, marginBottom: 16 }}>😕</div>
            <h2
              style={{
                fontFamily: "'Outfit',sans-serif",
                fontWeight: 700,
                fontSize: 22,
                color: "#0B3F44",
                marginBottom: 10,
              }}
            >
              Enrollment Not Found
            </h2>
            <p
              style={{
                fontFamily: "'Outfit',sans-serif",
                fontSize: 15,
                color: "#666",
                lineHeight: 1.7,
                marginBottom: 24,
              }}
            >
              {error}
              <br />
              If you completed payment, contact us with your Payment ID.
            </p>
            <a
              href="https://wa.me/918446980747"
              target="_blank"
              rel="noreferrer"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 8,
                background: "#0A8A80",
                borderRadius: 100,
                padding: "12px 24px",
                fontFamily: "'Outfit',sans-serif",
                fontWeight: 700,
                fontSize: 14,
                color: "#fff",
                textDecoration: "none",
              }}
            >
              Contact Support on WhatsApp
            </a>
          </div>
        )}
      </main>

      <footer style={{ background: "#0B3F44", padding: "32px 24px", textAlign: "center" }}>
        <div
          style={{
            fontFamily: "'Outfit',sans-serif",
            fontSize: 13,
            color: "rgba(255,255,255,0.45)",
            lineHeight: 1.8,
          }}
        >
          <div style={{ marginBottom: 6, color: "rgba(255,255,255,0.65)", fontWeight: 600 }}>
            Logicology – Learn To Play. Play To Learn.
          </div>
          <div>Logicology Ventures Private Limited · GSTIN: 27AAFCL1234F1ZR</div>
        </div>
      </footer>
    </>
  );
}

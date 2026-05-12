"use client";
import React, { useEffect, useState, useRef, useCallback } from "react";
import { initializeApp, getApps } from "firebase/app";
import {
  getAuth,
  RecaptchaVerifier,
  signInWithPhoneNumber,
  ConfirmationResult,
} from "firebase/auth";

/* ─── Firebase ─────────────────────────────────────────────── */
const firebaseConfig = {
  apiKey: "AIzaSyC71SM0SmwZUIjGw0vNXjdOfxzD7DJjMlA",
  authDomain: "logicology-1f4e9.firebaseapp.com",
  projectId: "logicology-1f4e9",
  storageBucket: "logicology-1f4e9.firebasestorage.app",
  messagingSenderId: "459695194150",
  appId: "1:459695194150:web:6005630525769d5d0c26e7",
  measurementId: "G-QJ8BT8V2YD",
};
const firebaseApp = getApps().length
  ? getApps()[0]
  : initializeApp(firebaseConfig);
const auth = getAuth(firebaseApp);

/* ─── API helpers ───────────────────────────────────────────── */
const API = "/api/community";
async function apiFetch(path: string, opts?: RequestInit) {
  const res = await fetch(`${API}${path}`, {
    headers: { "Content-Type": "application/json" },
    ...opts,
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: res.statusText }));
    throw new Error(err.error || "Request failed");
  }
  return res.json();
}

/* ─── Types ─────────────────────────────────────────────────── */
interface Session {
  _id: string;
  title: string;
  date: string;          // ISO
  time: string;
  venue: string;
  description: string;
  totalSeats: number;
  bookedSeats: string[]; // array of phone numbers
  isActive: boolean;
}
interface UserDoc {
  phone: string;
  tokens: number;
  bookings: string[];    // session IDs
  name?: string;
}

/* ═══════════════════════════════════════════════════════════════
   ROOT COMPONENT
═══════════════════════════════════════════════════════════════ */
export default function CommunityBooking() {
  const [user, setUser] = useState<UserDoc | null>(null);
  const [view, setView] = useState<"login" | "home" | "admin">("login");
  const ADMIN_PHONE = "+919999999999"; // change to real admin phone

  const handleLogin = (u: UserDoc) => {
    setUser(u);
    setView(u.phone === ADMIN_PHONE ? "admin" : "home");
  };

  return (
    <div className="lc-root">
      <style>{STYLES}</style>

      {/* Nav */}
      <header className="lc-nav">
        <div className="lc-nav-inner">
          <span className="lc-logo">
            <span className="lc-logo-dot" />
            Logicology
          </span>
          <nav className="lc-nav-links">
            <span className="lc-nav-tag">Offline Community</span>
            {user && (
              <button
                className="lc-btn lc-btn-ghost"
                onClick={() => { setUser(null); setView("login"); }}
              >
                Sign out
              </button>
            )}
          </nav>
        </div>
      </header>

      <main className="lc-main">
        {view === "login" && <LoginPanel onLogin={handleLogin} />}
        {view === "home" && user && (
          <HomePanel
            user={user}
            setUser={setUser}
            onAdmin={() => setView("admin")}
            adminPhone={ADMIN_PHONE}
          />
        )}
        {view === "admin" && user && (
          <AdminPanel user={user} onBack={() => setView("home")} />
        )}
      </main>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   LOGIN PANEL — Firebase OTP
═══════════════════════════════════════════════════════════════ */
function LoginPanel({ onLogin }: { onLogin: (u: UserDoc) => void }) {
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [step, setStep] = useState<"phone" | "otp">("phone");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const confirmRef = useRef<ConfirmationResult | null>(null);
  const recaptchaRef = useRef<RecaptchaVerifier | null>(null);

  useEffect(() => {
    recaptchaRef.current = new RecaptchaVerifier(auth, "recaptcha-container", {
      size: "invisible",
    });
    return () => recaptchaRef.current?.clear();
  }, []);

  const sendOtp = async () => {
    setError("");
    if (!/^\d{10}$/.test(phone)) {
      setError("Enter a valid 10-digit mobile number.");
      return;
    }
    setLoading(true);
    try {
      const fullPhone = `+91${phone}`;
      confirmRef.current = await signInWithPhoneNumber(
        auth,
        fullPhone,
        recaptchaRef.current!
      );
      setStep("otp");
    } catch (e: any) {
      setError(e.message || "Failed to send OTP");
    }
    setLoading(false);
  };

  const verifyOtp = async () => {
    setError("");
    setLoading(true);
    try {
      await confirmRef.current!.confirm(otp);
      const fullPhone = `+91${phone}`;
      // Upsert user in DB
      const userData = await apiFetch("/user", {
        method: "POST",
        body: JSON.stringify({ phone: fullPhone }),
      });
      onLogin(userData);
    } catch (e: any) {
      setError(e.message || "Invalid OTP");
    }
    setLoading(false);
  };

  return (
    <div className="lc-login-wrap">
      <div className="lc-login-card">
        <div className="lc-login-badge">Community Access</div>
        <h1 className="lc-login-title">Welcome back.</h1>
        <p className="lc-login-sub">
          Sign in with your mobile number to access offline sessions.
        </p>

        <div id="recaptcha-container" />

        {step === "phone" ? (
          <div className="lc-field-group">
            <div className="lc-phone-input">
              <span className="lc-phone-prefix">+91</span>
              <input
                className="lc-input"
                type="tel"
                maxLength={10}
                placeholder="98XXXXXXXX"
                value={phone}
                onChange={(e) => setPhone(e.target.value.replace(/\D/, ""))}
                onKeyDown={(e) => e.key === "Enter" && sendOtp()}
              />
            </div>
            {error && <p className="lc-error">{error}</p>}
            <button className="lc-btn lc-btn-primary" onClick={sendOtp} disabled={loading}>
              {loading ? <Spinner /> : "Send OTP →"}
            </button>
          </div>
        ) : (
          <div className="lc-field-group">
            <p className="lc-otp-hint">OTP sent to +91 {phone}</p>
            <input
              className="lc-input lc-input-otp"
              type="text"
              maxLength={6}
              placeholder="• • • • • •"
              value={otp}
              onChange={(e) => setOtp(e.target.value.replace(/\D/, ""))}
              onKeyDown={(e) => e.key === "Enter" && verifyOtp()}
            />
            {error && <p className="lc-error">{error}</p>}
            <button className="lc-btn lc-btn-primary" onClick={verifyOtp} disabled={loading}>
              {loading ? <Spinner /> : "Verify & Enter →"}
            </button>
            <button
              className="lc-btn lc-btn-ghost"
              onClick={() => { setStep("phone"); setOtp(""); setError(""); }}
            >
              ← Change number
            </button>
          </div>
        )}
      </div>

      {/* Decorative side panel */}
      <div className="lc-login-deco">
        <div className="lc-deco-rings">
          {[1,2,3].map(i => <span key={i} className={`lc-ring lc-ring-${i}`} />)}
        </div>
        <div className="lc-deco-content">
          <p className="lc-deco-label">Your Token Balance</p>
          <p className="lc-deco-number">20</p>
          <p className="lc-deco-sub">bookings available on signup</p>
          <div className="lc-deco-divider" />
          <p className="lc-deco-feature">✦ 30 seats per session</p>
          <p className="lc-deco-feature">✦ 1 token per booking</p>
          <p className="lc-deco-feature">✦ Cancel anytime</p>
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   HOME PANEL — Sessions + Bookings
═══════════════════════════════════════════════════════════════ */
function HomePanel({
  user, setUser, onAdmin, adminPhone,
}: {
  user: UserDoc;
  setUser: (u: UserDoc) => void;
  onAdmin: () => void;
  adminPhone: string;
}) {
  const [sessions, setSessions] = useState<Session[]>([]);
  const [loading, setLoading] = useState(true);
  const [bookingId, setBookingId] = useState<string | null>(null);
  const [toast, setToast] = useState("");

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(""), 3500);
  };

  const fetchSessions = useCallback(async () => {
    setLoading(true);
    try {
      const data = await apiFetch("/sessions?active=true");
      setSessions(data);
    } catch (e: any) {
      showToast(e.message);
    }
    setLoading(false);
  }, []);

  useEffect(() => { fetchSessions(); }, [fetchSessions]);

  const book = async (sessionId: string) => {
    setBookingId(sessionId);
    try {
      const { user: updatedUser } = await apiFetch("/book", {
        method: "POST",
        body: JSON.stringify({ phone: user.phone, sessionId }),
      });
      setUser(updatedUser);
      showToast("🎉 Seat booked successfully!");
      fetchSessions();
    } catch (e: any) {
      showToast(`✗ ${e.message}`);
    }
    setBookingId(null);
  };

  const cancel = async (sessionId: string) => {
    setBookingId(sessionId);
    try {
      const { user: updatedUser } = await apiFetch("/cancel", {
        method: "POST",
        body: JSON.stringify({ phone: user.phone, sessionId }),
      });
      setUser(updatedUser);
      showToast("Booking cancelled. Token refunded.");
      fetchSessions();
    } catch (e: any) {
      showToast(`✗ ${e.message}`);
    }
    setBookingId(null);
  };

  const upcoming = sessions.filter(
    (s) => new Date(s.date) >= new Date(new Date().setHours(0,0,0,0))
  );
  const past = sessions.filter(
    (s) => new Date(s.date) < new Date(new Date().setHours(0,0,0,0))
  );

  return (
    <div className="lc-home">
      {/* Toast */}
      {toast && <div className="lc-toast">{toast}</div>}

      {/* Header row */}
      <div className="lc-home-header">
        <div>
          <h2 className="lc-page-title">Offline Sessions</h2>
          <p className="lc-page-sub">
            Reserve your seat for upcoming community gatherings.
          </p>
        </div>
        <div className="lc-wallet-badge">
          <span className="lc-wallet-icon">◈</span>
          <div>
            <p className="lc-wallet-label">Token Balance</p>
            <p className="lc-wallet-count">{user.tokens}</p>
          </div>
          {user.phone === adminPhone && (
            <button className="lc-btn lc-btn-outline lc-admin-btn" onClick={onAdmin}>
              Admin ↗
            </button>
          )}
        </div>
      </div>

      {loading ? (
        <div className="lc-center"><Spinner large /></div>
      ) : upcoming.length === 0 ? (
        <div className="lc-empty">
          <p className="lc-empty-icon">◎</p>
          <p>No upcoming sessions scheduled yet.</p>
          <p className="lc-empty-sub">Check back soon!</p>
        </div>
      ) : (
        <div className="lc-sessions-grid">
          {upcoming.map((s) => (
            <SessionCard
              key={s._id}
              session={s}
              userPhone={user.phone}
              tokens={user.tokens}
              onBook={book}
              onCancel={cancel}
              loading={bookingId === s._id}
            />
          ))}
        </div>
      )}

      {past.length > 0 && (
        <div className="lc-past-section">
          <p className="lc-section-label">Past Sessions</p>
          <div className="lc-sessions-grid lc-sessions-past">
            {past.map((s) => (
              <SessionCard
                key={s._id}
                session={s}
                userPhone={user.phone}
                tokens={user.tokens}
                onBook={book}
                onCancel={cancel}
                loading={bookingId === s._id}
                isPast
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

/* ─── Session Card ──────────────────────────────────────────── */
function SessionCard({
  session, userPhone, tokens, onBook, onCancel, loading, isPast = false,
}: {
  session: Session;
  userPhone: string;
  tokens: number;
  onBook: (id: string) => void;
  onCancel: (id: string) => void;
  loading: boolean;
  isPast?: boolean;
}) {
  const booked = session.bookedSeats.includes(userPhone);
  const filled = session.bookedSeats.length;
  const total = session.totalSeats;
  const pct = Math.round((filled / total) * 100);
  const soldOut = filled >= total && !booked;
  const noTokens = tokens <= 0 && !booked;

  const dateObj = new Date(session.date);
  const dateStr = dateObj.toLocaleDateString("en-IN", {
    weekday: "short", day: "numeric", month: "long", year: "numeric",
  });

  return (
    <div className={`lc-card ${booked ? "lc-card-booked" : ""} ${isPast ? "lc-card-past" : ""}`}>
      {booked && <span className="lc-card-badge">✓ Booked</span>}
      {soldOut && !booked && <span className="lc-card-badge lc-badge-sold">Sold Out</span>}

      <div className="lc-card-body">
        <p className="lc-card-date">{dateStr}</p>
        <h3 className="lc-card-title">{session.title}</h3>
        <p className="lc-card-time">🕐 {session.time} &nbsp;·&nbsp; 📍 {session.venue}</p>
        {session.description && (
          <p className="lc-card-desc">{session.description}</p>
        )}

        {/* Seat meter */}
        <div className="lc-seat-meter">
          <div className="lc-seat-bar">
            <div
              className="lc-seat-fill"
              style={{ width: `${pct}%`, background: pct > 80 ? "#e45c48" : "#0a8a80" }}
            />
          </div>
          <p className="lc-seat-label">
            {filled}/{total} seats filled
          </p>
        </div>

        {/* Seat grid */}
        <div className="lc-seat-grid">
          {Array.from({ length: total }).map((_, i) => {
            const occupant = session.bookedSeats[i];
            const isMe = occupant === userPhone;
            return (
              <div
                key={i}
                className={`lc-seat ${
                  !occupant ? "lc-seat-free" :
                  isMe ? "lc-seat-mine" : "lc-seat-taken"
                }`}
                title={isMe ? "Your seat" : occupant ? "Taken" : "Available"}
              />
            );
          })}
        </div>
      </div>

      {!isPast && (
        <div className="lc-card-footer">
          {booked ? (
            <button
              className="lc-btn lc-btn-cancel"
              onClick={() => onCancel(session._id)}
              disabled={loading}
            >
              {loading ? <Spinner /> : "Cancel Booking"}
            </button>
          ) : soldOut ? (
            <button className="lc-btn lc-btn-disabled" disabled>Fully Booked</button>
          ) : noTokens ? (
            <button className="lc-btn lc-btn-disabled" disabled>No Tokens Left</button>
          ) : (
            <button
              className="lc-btn lc-btn-primary"
              onClick={() => onBook(session._id)}
              disabled={loading}
            >
              {loading ? <Spinner /> : "Book Seat  —  1 Token"}
            </button>
          )}
        </div>
      )}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   ADMIN PANEL
═══════════════════════════════════════════════════════════════ */
function AdminPanel({ user, onBack }: { user: UserDoc; onBack: () => void }) {
  const [sessions, setSessions] = useState<Session[]>([]);
  const [tab, setTab] = useState<"sessions" | "users" | "create">("sessions");
  const [users, setUsers] = useState<UserDoc[]>([]);
  const [toast, setToast] = useState("");
  const [loading, setLoading] = useState(false);

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(""), 3500);
  };

  // Form state
  const blank = {
    title: "", date: "", time: "", venue: "", description: "", totalSeats: "30",
  };
  const [form, setForm] = useState(blank);
  const [editId, setEditId] = useState<string | null>(null);

  const fetchAll = useCallback(async () => {
    setLoading(true);
    try {
      const [s, u] = await Promise.all([
        apiFetch("/sessions"),
        apiFetch("/users"),
      ]);
      setSessions(s);
      setUsers(u);
    } catch (e: any) {
      showToast(e.message);
    }
    setLoading(false);
  }, []);

  useEffect(() => { fetchAll(); }, [fetchAll]);

  const saveSession = async () => {
    if (!form.title || !form.date || !form.time || !form.venue) {
      showToast("Please fill all required fields.");
      return;
    }
    setLoading(true);
    try {
      if (editId) {
        await apiFetch(`/sessions/${editId}`, {
          method: "PUT",
          body: JSON.stringify({ ...form, totalSeats: Number(form.totalSeats) }),
        });
        showToast("Session updated.");
      } else {
        await apiFetch("/sessions", {
          method: "POST",
          body: JSON.stringify({ ...form, totalSeats: Number(form.totalSeats) }),
        });
        showToast("Session created!");
      }
      setForm(blank);
      setEditId(null);
      setTab("sessions");
      fetchAll();
    } catch (e: any) {
      showToast(e.message);
    }
    setLoading(false);
  };

  const deleteSession = async (id: string) => {
    if (!confirm("Delete this session?")) return;
    setLoading(true);
    try {
      await apiFetch(`/sessions/${id}`, { method: "DELETE" });
      showToast("Session deleted.");
      fetchAll();
    } catch (e: any) {
      showToast(e.message);
    }
    setLoading(false);
  };

  const toggleActive = async (s: Session) => {
    await apiFetch(`/sessions/${s._id}`, {
      method: "PUT",
      body: JSON.stringify({ isActive: !s.isActive }),
    });
    fetchAll();
  };

  const editSession = (s: Session) => {
    setEditId(s._id);
    setForm({
      title: s.title,
      date: s.date.split("T")[0],
      time: s.time,
      venue: s.venue,
      description: s.description,
      totalSeats: String(s.totalSeats),
    });
    setTab("create");
  };

  const addTokens = async (phone: string, amount: number) => {
    await apiFetch("/user/tokens", {
      method: "POST",
      body: JSON.stringify({ phone, amount }),
    });
    showToast(`Added ${amount} tokens to ${phone}`);
    fetchAll();
  };

  return (
    <div className="lc-admin">
      {toast && <div className="lc-toast">{toast}</div>}

      <div className="lc-admin-header">
        <button className="lc-btn lc-btn-ghost" onClick={onBack}>← Back</button>
        <h2 className="lc-page-title">Admin Console</h2>
        <div className="lc-admin-stats">
          <div className="lc-stat">
            <span>{sessions.length}</span> Sessions
          </div>
          <div className="lc-stat">
            <span>{users.length}</span> Members
          </div>
          <div className="lc-stat">
            <span>{sessions.filter(s => s.isActive).length}</span> Active
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="lc-tabs">
        {(["sessions", "users", "create"] as const).map((t) => (
          <button
            key={t}
            className={`lc-tab ${tab === t ? "lc-tab-active" : ""}`}
            onClick={() => { setTab(t); if (t !== "create") { setEditId(null); setForm(blank); } }}
          >
            {t === "sessions" ? "📅 Sessions" : t === "users" ? "👥 Members" : editId ? "✏️ Edit Session" : "＋ New Session"}
          </button>
        ))}
      </div>

      {/* Sessions Tab */}
      {tab === "sessions" && (
        <div className="lc-admin-list">
          {loading && <div className="lc-center"><Spinner large /></div>}
          {!loading && sessions.length === 0 && (
            <div className="lc-empty">
              <p className="lc-empty-icon">◎</p>
              <p>No sessions yet. Create one!</p>
            </div>
          )}
          {sessions.map((s) => (
            <div key={s._id} className={`lc-admin-row ${!s.isActive ? "lc-admin-row-inactive" : ""}`}>
              <div className="lc-admin-row-info">
                <p className="lc-admin-row-title">{s.title}</p>
                <p className="lc-admin-row-meta">
                  {new Date(s.date).toLocaleDateString("en-IN", {
                    day: "numeric", month: "short", year: "numeric",
                  })}
                  &nbsp;·&nbsp; {s.time} &nbsp;·&nbsp; {s.venue}
                </p>
                <div className="lc-admin-row-seats">
                  <div
                    className="lc-seat-fill-sm"
                    style={{ width: `${(s.bookedSeats.length / s.totalSeats) * 100}%` }}
                  />
                  <span>{s.bookedSeats.length}/{s.totalSeats} booked</span>
                </div>
              </div>
              <div className="lc-admin-row-actions">
                <button
                  className={`lc-pill ${s.isActive ? "lc-pill-active" : "lc-pill-inactive"}`}
                  onClick={() => toggleActive(s)}
                >
                  {s.isActive ? "Active" : "Inactive"}
                </button>
                <button className="lc-btn lc-btn-sm" onClick={() => editSession(s)}>Edit</button>
                <button className="lc-btn lc-btn-sm lc-btn-danger" onClick={() => deleteSession(s._id)}>Delete</button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Users Tab */}
      {tab === "users" && (
        <div className="lc-admin-list">
          {loading && <div className="lc-center"><Spinner large /></div>}
          {users.map((u) => (
            <div key={u.phone} className="lc-admin-row">
              <div className="lc-admin-row-info">
                <p className="lc-admin-row-title">{u.phone}</p>
                <p className="lc-admin-row-meta">
                  {u.bookings?.length || 0} bookings &nbsp;·&nbsp;
                  <strong style={{ color: "#0a8a80" }}>{u.tokens} tokens</strong>
                </p>
              </div>
              <div className="lc-admin-row-actions">
                <button className="lc-btn lc-btn-sm" onClick={() => addTokens(u.phone, 5)}>+5 Tokens</button>
                <button className="lc-btn lc-btn-sm" onClick={() => addTokens(u.phone, 10)}>+10 Tokens</button>
                <button className="lc-btn lc-btn-sm lc-btn-danger" onClick={() => addTokens(u.phone, -1)}>–1 Token</button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Create / Edit Tab */}
      {tab === "create" && (
        <div className="lc-form-wrap">
          <div className="lc-form">
            <h3 className="lc-form-title">{editId ? "Edit Session" : "Create New Session"}</h3>

            <div className="lc-form-grid">
              <div className="lc-field">
                <label>Session Title *</label>
                <input
                  className="lc-input"
                  placeholder="e.g. Monthly Logic Workshop"
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                />
              </div>
              <div className="lc-field">
                <label>Venue *</label>
                <input
                  className="lc-input"
                  placeholder="e.g. Ameya Towers, Nagpur"
                  value={form.venue}
                  onChange={(e) => setForm({ ...form, venue: e.target.value })}
                />
              </div>
              <div className="lc-field">
                <label>Date *</label>
                <input
                  className="lc-input"
                  type="date"
                  value={form.date}
                  onChange={(e) => setForm({ ...form, date: e.target.value })}
                />
              </div>
              <div className="lc-field">
                <label>Time *</label>
                <input
                  className="lc-input"
                  type="time"
                  value={form.time}
                  onChange={(e) => setForm({ ...form, time: e.target.value })}
                />
              </div>
              <div className="lc-field">
                <label>Total Seats</label>
                <input
                  className="lc-input"
                  type="number"
                  min={1}
                  max={30}
                  value={form.totalSeats}
                  onChange={(e) => setForm({ ...form, totalSeats: e.target.value })}
                />
              </div>
              <div className="lc-field lc-field-full">
                <label>Description</label>
                <textarea
                  className="lc-input lc-textarea"
                  placeholder="Briefly describe this session…"
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                />
              </div>
            </div>

            <div className="lc-form-actions">
              <button
                className="lc-btn lc-btn-primary"
                onClick={saveSession}
                disabled={loading}
              >
                {loading ? <Spinner /> : editId ? "Update Session" : "Create Session"}
              </button>
              {editId && (
                <button
                  className="lc-btn lc-btn-ghost"
                  onClick={() => { setEditId(null); setForm(blank); setTab("sessions"); }}
                >
                  Cancel
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/* ─── Spinner ───────────────────────────────────────────────── */
function Spinner({ large = false }: { large?: boolean }) {
  return <span className={`lc-spinner${large ? " lc-spinner-lg" : ""}`} />;
}

/* ═══════════════════════════════════════════════════════════════
   STYLES
═══════════════════════════════════════════════════════════════ */
const STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800&family=DM+Mono:wght@400;500&display=swap');

  .lc-root {
    --teal: #0A8A80;
    --teal-dark: #0B3F44;
    --coral: #E45C48;
    --gold: #D8AE4F;
    --bg: #F5F6F7;
    --white: #ffffff;
    --ink: #0B3F44;
    --ink-light: #4a6670;
    --border: rgba(11,63,68,0.12);
    --shadow: 0 4px 24px rgba(11,63,68,0.10);
    --radius: 16px;
    --radius-sm: 10px;
    font-family: 'Outfit', sans-serif;
    background: var(--bg);
    min-height: 100vh;
    color: var(--ink);
  }

  /* NAV */
  .lc-nav {
    position: sticky; top: 0; z-index: 100;
    background: rgba(255,255,255,0.92);
    backdrop-filter: blur(12px);
    border-bottom: 1px solid var(--border);
  }
  .lc-nav-inner {
    max-width: 1100px; margin: 0 auto;
    padding: 0 24px;
    height: 64px;
    display: flex; align-items: center; justify-content: space-between;
  }
  .lc-logo {
    font-size: 1.3rem; font-weight: 800; color: var(--teal-dark);
    display: flex; align-items: center; gap: 8px; letter-spacing: -0.02em;
  }
  .lc-logo-dot {
    width: 10px; height: 10px; border-radius: 50%;
    background: var(--teal); display: inline-block;
  }
  .lc-nav-links { display: flex; align-items: center; gap: 16px; }
  .lc-nav-tag {
    font-size: 0.78rem; font-weight: 600; letter-spacing: 0.08em;
    text-transform: uppercase; color: var(--teal);
    background: rgba(10,138,128,0.08);
    padding: 4px 12px; border-radius: 999px;
  }
  .lc-main { max-width: 1100px; margin: 0 auto; padding: 40px 24px 80px; }

  /* BUTTONS */
  .lc-btn {
    display: inline-flex; align-items: center; justify-content: center; gap: 8px;
    font-family: 'Outfit', sans-serif; font-weight: 600; font-size: 0.9rem;
    padding: 12px 24px; border-radius: 999px; cursor: pointer;
    border: none; transition: all 0.2s; white-space: nowrap;
  }
  .lc-btn:disabled { opacity: 0.5; cursor: not-allowed; }
  .lc-btn-primary {
    background: var(--teal); color: white;
    box-shadow: 0 4px 16px rgba(10,138,128,0.3);
  }
  .lc-btn-primary:not(:disabled):hover {
    background: var(--teal-dark);
    box-shadow: 0 6px 20px rgba(10,138,128,0.4);
    transform: translateY(-1px);
  }
  .lc-btn-ghost {
    background: transparent; color: var(--ink-light); border: 1px solid var(--border);
  }
  .lc-btn-ghost:hover { background: var(--bg); }
  .lc-btn-outline {
    background: transparent; color: var(--teal); border: 1.5px solid var(--teal);
  }
  .lc-btn-outline:hover { background: rgba(10,138,128,0.06); }
  .lc-btn-cancel {
    background: rgba(228,92,72,0.08); color: var(--coral); border: 1.5px solid rgba(228,92,72,0.2);
  }
  .lc-btn-cancel:hover { background: rgba(228,92,72,0.16); }
  .lc-btn-disabled {
    background: #e0e4e8; color: #9aacb0; cursor: not-allowed;
  }
  .lc-btn-sm { padding: 6px 14px; font-size: 0.8rem; border-radius: 8px; border: 1px solid var(--border); background: white; color: var(--ink); }
  .lc-btn-sm:hover { border-color: var(--teal); color: var(--teal); }
  .lc-btn-danger { color: var(--coral) !important; border-color: rgba(228,92,72,0.3) !important; }
  .lc-btn-danger:hover { background: rgba(228,92,72,0.06) !important; }

  /* LOGIN */
  .lc-login-wrap {
    display: grid; grid-template-columns: 1fr 1fr; gap: 0;
    background: white; border-radius: 24px;
    box-shadow: 0 20px 60px rgba(11,63,68,0.12);
    overflow: hidden; min-height: 520px;
    max-width: 840px; margin: 0 auto;
  }
  @media (max-width: 680px) {
    .lc-login-wrap { grid-template-columns: 1fr; }
    .lc-login-deco { display: none; }
  }
  .lc-login-card {
    padding: 48px 40px;
    display: flex; flex-direction: column; justify-content: center;
  }
  .lc-login-badge {
    display: inline-block;
    background: rgba(10,138,128,0.1); color: var(--teal);
    font-size: 0.72rem; font-weight: 700; letter-spacing: 0.1em; text-transform: uppercase;
    padding: 4px 12px; border-radius: 999px; margin-bottom: 20px; width: fit-content;
  }
  .lc-login-title {
    font-size: 2.2rem; font-weight: 800; letter-spacing: -0.03em;
    color: var(--teal-dark); margin: 0 0 8px;
  }
  .lc-login-sub { color: var(--ink-light); font-size: 0.95rem; margin: 0 0 32px; }
  .lc-field-group { display: flex; flex-direction: column; gap: 12px; }
  .lc-phone-input {
    display: flex; align-items: center;
    background: var(--bg); border-radius: var(--radius-sm);
    border: 1.5px solid var(--border); overflow: hidden;
  }
  .lc-phone-prefix {
    padding: 0 14px; font-weight: 600; color: var(--teal-dark);
    border-right: 1.5px solid var(--border); background: rgba(10,138,128,0.06);
    height: 48px; display: flex; align-items: center; white-space: nowrap;
  }
  .lc-input {
    width: 100%; padding: 12px 16px; font-family: 'Outfit', sans-serif;
    font-size: 1rem; font-weight: 500; color: var(--ink);
    background: var(--bg); border: 1.5px solid var(--border);
    border-radius: var(--radius-sm); outline: none; transition: border-color 0.2s;
  }
  .lc-phone-input .lc-input {
    border: none; background: transparent; border-radius: 0;
  }
  .lc-input:focus { border-color: var(--teal); }
  .lc-input-otp {
    text-align: center; font-family: 'DM Mono', monospace;
    font-size: 1.6rem; letter-spacing: 0.25em;
  }
  .lc-otp-hint { font-size: 0.85rem; color: var(--ink-light); }
  .lc-error { color: var(--coral); font-size: 0.85rem; font-weight: 500; }
  .lc-login-deco {
    background: linear-gradient(145deg, var(--teal-dark) 0%, #0a5550 100%);
    padding: 48px 36px; position: relative; overflow: hidden;
    display: flex; flex-direction: column; justify-content: center;
  }
  .lc-deco-rings { position: absolute; inset: 0; pointer-events: none; }
  .lc-ring {
    position: absolute; border-radius: 50%;
    border: 1.5px solid rgba(255,255,255,0.08);
  }
  .lc-ring-1 { width: 280px; height: 280px; top: -80px; right: -80px; }
  .lc-ring-2 { width: 180px; height: 180px; top: -20px; right: -20px; }
  .lc-ring-3 { width: 360px; height: 360px; bottom: -120px; left: -120px; }
  .lc-deco-content { position: relative; z-index: 1; }
  .lc-deco-label { font-size: 0.78rem; font-weight: 600; letter-spacing: 0.1em; text-transform: uppercase; color: rgba(255,255,255,0.5); margin: 0 0 8px; }
  .lc-deco-number { font-size: 5rem; font-weight: 800; color: white; letter-spacing: -0.05em; line-height: 1; margin: 0 0 4px; }
  .lc-deco-sub { color: rgba(255,255,255,0.6); font-size: 0.9rem; margin: 0 0 28px; }
  .lc-deco-divider { height: 1px; background: rgba(255,255,255,0.12); margin: 0 0 20px; }
  .lc-deco-feature { color: rgba(255,255,255,0.75); font-size: 0.9rem; margin: 0 0 10px; }

  /* HOME */
  .lc-home-header {
    display: flex; align-items: flex-start; justify-content: space-between;
    flex-wrap: wrap; gap: 16px; margin-bottom: 36px;
  }
  .lc-page-title { font-size: 2rem; font-weight: 800; letter-spacing: -0.03em; color: var(--teal-dark); margin: 0 0 4px; }
  .lc-page-sub { color: var(--ink-light); font-size: 0.95rem; margin: 0; }
  .lc-wallet-badge {
    display: flex; align-items: center; gap: 16px;
    background: white; border-radius: var(--radius); padding: 14px 20px;
    box-shadow: var(--shadow); border: 1px solid var(--border);
  }
  .lc-wallet-icon { font-size: 1.6rem; color: var(--teal); }
  .lc-wallet-label { font-size: 0.72rem; font-weight: 600; letter-spacing: 0.08em; text-transform: uppercase; color: var(--ink-light); margin: 0; }
  .lc-wallet-count { font-size: 2rem; font-weight: 800; color: var(--teal); letter-spacing: -0.04em; margin: 0; line-height: 1; }
  .lc-admin-btn { font-size: 0.78rem !important; padding: 8px 16px !important; }

  .lc-sessions-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); gap: 20px; }
  .lc-sessions-past { opacity: 0.6; }

  /* CARD */
  .lc-card {
    background: white; border-radius: var(--radius);
    box-shadow: var(--shadow); border: 1.5px solid var(--border);
    overflow: hidden; position: relative;
    transition: transform 0.2s, box-shadow 0.2s;
  }
  .lc-card:hover { transform: translateY(-2px); box-shadow: 0 8px 32px rgba(11,63,68,0.14); }
  .lc-card-booked { border-color: rgba(10,138,128,0.3); background: rgba(10,138,128,0.02); }
  .lc-card-badge {
    position: absolute; top: 14px; right: 14px;
    font-size: 0.72rem; font-weight: 700; padding: 4px 10px; border-radius: 999px;
    background: rgba(10,138,128,0.12); color: var(--teal);
  }
  .lc-badge-sold { background: rgba(228,92,72,0.12) !important; color: var(--coral) !important; }
  .lc-card-body { padding: 24px; }
  .lc-card-date {
    font-size: 0.72rem; font-weight: 700; letter-spacing: 0.08em; text-transform: uppercase;
    color: var(--teal); margin: 0 0 8px;
  }
  .lc-card-title { font-size: 1.15rem; font-weight: 700; margin: 0 0 6px; color: var(--ink); }
  .lc-card-time { font-size: 0.85rem; color: var(--ink-light); margin: 0 0 10px; }
  .lc-card-desc { font-size: 0.85rem; color: var(--ink-light); margin: 0 0 16px; line-height: 1.5; }
  .lc-seat-meter { margin-bottom: 14px; }
  .lc-seat-bar {
    height: 4px; background: rgba(11,63,68,0.08); border-radius: 2px; overflow: hidden; margin-bottom: 6px;
  }
  .lc-seat-fill { height: 100%; border-radius: 2px; transition: width 0.6s; }
  .lc-seat-label { font-size: 0.78rem; color: var(--ink-light); font-weight: 500; }

  /* Seat grid */
  .lc-seat-grid {
    display: grid; grid-template-columns: repeat(10, 1fr); gap: 4px; margin-bottom: 4px;
  }
  .lc-seat {
    aspect-ratio: 1; border-radius: 3px;
  }
  .lc-seat-free { background: rgba(10,138,128,0.15); }
  .lc-seat-taken { background: rgba(228,92,72,0.25); }
  .lc-seat-mine { background: var(--teal); }

  .lc-card-footer { padding: 0 24px 20px; }

  .lc-empty { text-align: center; padding: 64px 24px; color: var(--ink-light); }
  .lc-empty-icon { font-size: 3rem; margin-bottom: 12px; }
  .lc-empty-sub { font-size: 0.85rem; margin-top: 4px; }
  .lc-past-section { margin-top: 48px; }
  .lc-section-label { font-size: 0.8rem; font-weight: 700; letter-spacing: 0.1em; text-transform: uppercase; color: var(--ink-light); margin-bottom: 16px; }

  /* ADMIN */
  .lc-admin { }
  .lc-admin-header {
    display: flex; align-items: center; gap: 24px; flex-wrap: wrap; margin-bottom: 32px;
  }
  .lc-admin-stats { display: flex; gap: 16px; margin-left: auto; }
  .lc-stat {
    background: white; border: 1px solid var(--border); border-radius: var(--radius-sm);
    padding: 10px 18px; font-size: 0.85rem; color: var(--ink-light);
  }
  .lc-stat span { font-size: 1.4rem; font-weight: 800; color: var(--teal); display: block; }

  .lc-tabs { display: flex; gap: 8px; margin-bottom: 28px; flex-wrap: wrap; }
  .lc-tab {
    font-family: 'Outfit', sans-serif; font-size: 0.88rem; font-weight: 600;
    padding: 10px 20px; border-radius: 999px; cursor: pointer;
    border: 1.5px solid var(--border); background: white; color: var(--ink-light);
    transition: all 0.2s;
  }
  .lc-tab:hover { border-color: var(--teal); color: var(--teal); }
  .lc-tab-active { background: var(--teal); color: white; border-color: var(--teal); }

  .lc-admin-list { display: flex; flex-direction: column; gap: 12px; }
  .lc-admin-row {
    background: white; border: 1px solid var(--border); border-radius: var(--radius-sm);
    padding: 16px 20px; display: flex; align-items: center; gap: 16px; flex-wrap: wrap;
  }
  .lc-admin-row-inactive { opacity: 0.55; }
  .lc-admin-row-info { flex: 1; min-width: 180px; }
  .lc-admin-row-title { font-weight: 700; font-size: 0.95rem; margin: 0 0 4px; }
  .lc-admin-row-meta { font-size: 0.82rem; color: var(--ink-light); margin: 0 0 8px; }
  .lc-admin-row-seats {
    display: flex; align-items: center; gap: 10px;
    font-size: 0.78rem; color: var(--ink-light);
  }
  .lc-seat-fill-sm {
    height: 4px; background: var(--teal); border-radius: 2px;
    flex: 1; max-width: 120px;
  }
  .lc-admin-row-actions { display: flex; gap: 8px; align-items: center; flex-wrap: wrap; }
  .lc-pill {
    font-size: 0.72rem; font-weight: 700; padding: 4px 12px; border-radius: 999px;
    cursor: pointer; border: none; font-family: 'Outfit', sans-serif;
  }
  .lc-pill-active { background: rgba(10,138,128,0.1); color: var(--teal); }
  .lc-pill-inactive { background: rgba(228,92,72,0.1); color: var(--coral); }

  /* FORM */
  .lc-form-wrap { display: flex; justify-content: center; }
  .lc-form {
    background: white; border-radius: var(--radius); box-shadow: var(--shadow);
    border: 1px solid var(--border); padding: 36px; width: 100%; max-width: 680px;
  }
  .lc-form-title { font-size: 1.3rem; font-weight: 700; margin: 0 0 28px; color: var(--teal-dark); }
  .lc-form-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; margin-bottom: 24px; }
  @media (max-width: 600px) { .lc-form-grid { grid-template-columns: 1fr; } }
  .lc-field { display: flex; flex-direction: column; gap: 6px; }
  .lc-field-full { grid-column: 1 / -1; }
  .lc-field label { font-size: 0.8rem; font-weight: 600; color: var(--ink-light); }
  .lc-textarea { min-height: 90px; resize: vertical; }
  .lc-form-actions { display: flex; gap: 12px; }

  /* TOAST */
  .lc-toast {
    position: fixed; bottom: 28px; left: 50%; transform: translateX(-50%);
    background: var(--teal-dark); color: white;
    padding: 12px 24px; border-radius: 999px; font-weight: 600; font-size: 0.88rem;
    box-shadow: 0 8px 24px rgba(11,63,68,0.3); z-index: 9999; white-space: nowrap;
    animation: toastIn 0.3s ease;
  }
  @keyframes toastIn {
    from { opacity: 0; transform: translateX(-50%) translateY(8px); }
    to { opacity: 1; transform: translateX(-50%) translateY(0); }
  }

  /* SPINNER */
  .lc-spinner {
    display: inline-block; width: 16px; height: 16px; border-radius: 50%;
    border: 2.5px solid rgba(255,255,255,0.3);
    border-top-color: white; animation: spin 0.7s linear infinite;
  }
  .lc-spinner-lg { width: 32px; height: 32px; border-color: rgba(10,138,128,0.2); border-top-color: var(--teal); }
  @keyframes spin { to { transform: rotate(360deg); } }

  .lc-center { display: flex; justify-content: center; padding: 48px; }
`;
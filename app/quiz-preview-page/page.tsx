"use client";

import { useState, useEffect } from "react";

// ─── Brand Tokens ─────────────────────────────────────────────────────────────
const B = {
  teal:       "#0A8A80",
  tealDark:   "#0B3F44",
  coral:      "#E45C48",
  gold:       "#D8AE4F",
  grayBg:     "#F5F6F7",
  maroon:     "#6d2e46",
  maroonDark: "#5a2438",
  pink:       "#b44b73",
  yellow:     "#fddf5c",
  whiteText:  "#f7f7f7",
};

// Sample questions for testing (use this until APIs are ready)
const SAMPLE_QUESTIONS = [
  {
    id: 1,
    question: "🐘 Ellie has 5 peanuts. She finds 3 more. How many peanuts does she have?",
    options: ["6", "7", "8", "9"],
    correct: 2,
    animal: "Ellie the Elephant",
    animalEmoji: "🐘",
    color: B.teal,
    bgColor: "#e6f5f4",
    accentLight: "#b2e0dd",
    fact: "Elephants can remember faces for 20+ years!",
  },
  {
    id: 2,
    question: "🦁 Leo has 12 bones. He gives 4 to his friends. How many are left?",
    options: ["6", "7", "8", "9"],
    correct: 2,
    animal: "Leo the Lion",
    animalEmoji: "🦁",
    color: B.coral,
    bgColor: "#fdf0ee",
    accentLight: "#f5c4bc",
    fact: "A lion's roar can be heard 8 km away!",
  },
  {
    id: 3,
    question: "🐸 Froggy jumps 3 times. Each jump is 4 lily pads. How far did he go?",
    options: ["10", "12", "14", "7"],
    correct: 1,
    animal: "Froggy the Frog",
    animalEmoji: "🐸",
    color: B.maroon,
    bgColor: "#f5eaee",
    accentLight: "#ddb8c6",
    fact: "Frogs can jump 20x their body length!",
  },
];

interface User {
  id: string;
  phoneNumber: string;
  name: string;
  currentQuestionId: number;
  totalScore: number;
}

// ─── Login Screen ─────────────────────────────────────────────────────────────
function LoginScreen({ onLogin }: { onLogin: (phoneNumber: string, name: string) => void }) {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [name, setName] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!phoneNumber || !name) {
      setError("Please fill in all fields");
      return;
    }
    if (!/^\d{10}$/.test(phoneNumber)) {
      setError("Please enter a valid 10-digit phone number");
      return;
    }
    onLogin(phoneNumber, name);
  };

  return (
    <div style={{
      minHeight: "100vh",
      background: `linear-gradient(135deg, ${B.tealDark}, ${B.maroonDark})`,
      display: "flex", alignItems: "center", justifyContent: "center",
      padding: "20px",
    }}>
      <div style={{
        background: "white", borderRadius: "48px", padding: "48px 40px",
        maxWidth: "480px", width: "100%", textAlign: "center",
        boxShadow: "0 32px 80px rgba(0,0,0,0.3)",
      }}>
        <div style={{ fontSize: "72px", marginBottom: "16px" }}>🧮</div>
        <h1 style={{
          fontFamily: "'Fredoka One', cursive", fontSize: "32px",
          color: B.tealDark, marginBottom: "8px",
        }}> Math Quest</h1>
        <p style={{ fontFamily: "'Nunito', sans-serif", color: B.maroon, marginBottom: "32px" }}>
          Enter to begin your adventure!
        </p>
        
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Your Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            style={{
              width: "100%", padding: "16px 20px", marginBottom: "16px",
              borderRadius: "24px", border: `2px solid ${B.teal}40`,
              fontSize: "16px", fontFamily: "'Nunito', sans-serif",
              outline: "none",
            }}
          />
          <input
            type="tel"
            placeholder="Phone Number (10 digits)"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value.replace(/\D/g, "").slice(0,10))}
            style={{
              width: "100%", padding: "16px 20px", marginBottom: "16px",
              borderRadius: "24px", border: `2px solid ${B.teal}40`,
              fontSize: "16px", fontFamily: "'Nunito', sans-serif",
              outline: "none",
            }}
          />
          {error && <p style={{ color: B.coral, marginBottom: "16px", fontSize: "14px" }}>{error}</p>}
          <button
            type="submit"
            style={{
              width: "100%", padding: "16px", borderRadius: "999px",
              border: "none", background: `linear-gradient(135deg, ${B.teal}, ${B.tealDark})`,
              color: "white", fontSize: "18px", fontFamily: "'Fredoka One', cursive",
              cursor: "pointer",
            }}
          >
            Start Quest! 🚀
          </button>
        </form>
      </div>
    </div>
  );
}

// ─── Leaderboard Component ────────────────────────────────────────────────────
function Leaderboard({ entries, onClose }: { entries: any[]; onClose: () => void }) {
  return (
    <div style={{
      position: "fixed", top: 0, left: 0, right: 0, bottom: 0,
      background: "rgba(0,0,0,0.8)", backdropFilter: "blur(8px)",
      display: "flex", alignItems: "center", justifyContent: "center",
      zIndex: 1000, padding: "20px",
    }} onClick={onClose}>
      <div style={{
        background: "white", borderRadius: "32px", maxWidth: "600px",
        width: "100%", maxHeight: "80vh", overflow: "auto",
        padding: "32px",
      }} onClick={(e) => e.stopPropagation()}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px" }}>
          <h2 style={{ fontFamily: "'Fredoka One', cursive", fontSize: "28px", color: B.tealDark }}>
            🏆 Leaderboard 🏆
          </h2>
          <button onClick={onClose} style={{
            background: "none", border: "none", fontSize: "24px",
            cursor: "pointer", color: B.maroon,
          }}>✕</button>
        </div>
        
        <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
          {entries.length === 0 ? (
            <p style={{ textAlign: "center", color: B.maroon }}>No entries yet. Be the first to play!</p>
          ) : (
            entries.map((entry, idx) => (
              <div key={idx} style={{
                display: "flex", alignItems: "center", gap: "16px",
                padding: "16px", background: idx < 3 ? `${B.gold}20` : B.grayBg,
                borderRadius: "20px",
              }}>
                <div style={{
                  width: "40px", height: "40px", borderRadius: "50%",
                  background: idx === 0 ? B.gold : idx === 1 ? "#C0C0C0" : idx === 2 ? "#CD7F32" : B.teal,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: "20px", fontWeight: "bold", color: "white",
                }}>{idx + 1}</div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: "bold", fontSize: "16px", color: B.tealDark }}>{entry.name}</div>
                  <div style={{ fontSize: "12px", color: B.maroon }}>{entry.phoneNumber}</div>
                </div>
                <div style={{ textAlign: "right" }}>
                  <div style={{ fontWeight: "bold", fontSize: "20px", color: B.teal }}>{entry.score}</div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

// ─── Main Quiz Component ──────────────────────────────────────────────────────
export default function QuizPage() {
  const [user, setUser] = useState<User | null>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [showFact, setShowFact] = useState(false);
  const [score, setScore] = useState(0);
  const [completed, setCompleted] = useState(false);
  const [leaderboard, setLeaderboard] = useState<any[]>([]);
  const [showLeaderboard, setShowLeaderboard] = useState(false);
  const [attempts, setAttempts] = useState(0);

  const currentQuestion = SAMPLE_QUESTIONS[currentQuestionIndex];
  const isCorrect = selected === currentQuestion?.correct;

  const handleLogin = (phoneNumber: string, name: string) => {
    setUser({
      id: Date.now().toString(),
      phoneNumber,
      name,
      currentQuestionId: 1,
      totalScore: 0,
    });
    // Load leaderboard from localStorage
    const savedLeaderboard = localStorage.getItem('quizLeaderboard');
    if (savedLeaderboard) {
      setLeaderboard(JSON.parse(savedLeaderboard));
    }
  };

  const updateLeaderboard = (userName: string, userPhone: string, userScore: number) => {
    const newEntry = { name: userName, phoneNumber: `+${userPhone.slice(-4)}`, score: userScore };
    const updatedLeaderboard = [...leaderboard, newEntry]
      .sort((a, b) => b.score - a.score)
      .slice(0, 10);
    setLeaderboard(updatedLeaderboard);
    localStorage.setItem('quizLeaderboard', JSON.stringify(updatedLeaderboard));
  };

  const handleSelect = (index: number) => {
    if (selected !== null || completed) return;
    setSelected(index);
    setAttempts(prev => prev + 1);
    
    if (index === currentQuestion.correct) {
      const newScore = score + 10;
      setScore(newScore);
      if (user) {
        const updatedUser = { ...user, totalScore: newScore };
        setUser(updatedUser);
        updateLeaderboard(user.name, user.phoneNumber, newScore);
      }
    }
    
    setTimeout(() => setShowFact(true), 380);
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex + 1 < SAMPLE_QUESTIONS.length) {
      setCurrentQuestionIndex(prev => prev + 1);
      setSelected(null);
      setShowFact(false);
    } else {
      setCompleted(true);
    }
  };

  const handleTryAgain = () => {
    setSelected(null);
    setShowFact(false);
  };

  const handleRestart = () => {
    setCurrentQuestionIndex(0);
    setSelected(null);
    setShowFact(false);
    setScore(0);
    setCompleted(false);
    setUser(null);
    setAttempts(0);
  };

  if (!user) {
    return <LoginScreen onLogin={handleLogin} />;
  }

  if (completed) {
    return (
      <div style={{
        minHeight: "100vh",
        background: `linear-gradient(135deg, ${B.tealDark}, ${B.maroonDark})`,
        display: "flex", alignItems: "center", justifyContent: "center",
        padding: "20px",
      }}>
        <div style={{
          background: "white", borderRadius: "48px", padding: "48px",
          maxWidth: "500px", width: "100%", textAlign: "center",
        }}>
          <div style={{ fontSize: "64px", marginBottom: "20px" }}>🎉</div>
          <h2 style={{ fontFamily: "'Fredoka One', cursive", fontSize: "32px", color: B.tealDark }}>
            Congratulations!
          </h2>
          <p style={{ fontSize: "18px", marginTop: "16px" }}>You've completed all questions!</p>
          <p style={{ fontSize: "24px", fontWeight: "bold", color: B.teal, marginTop: "16px" }}>
            Total Score: {score}
          </p>
          <p style={{ fontSize: "14px", color: B.maroon, marginTop: "8px" }}>
            Total Attempts: {attempts}
          </p>
          <button
            onClick={() => setShowLeaderboard(true)}
            style={{
              marginTop: "20px", padding: "12px 24px", borderRadius: "999px",
              background: B.gold, border: "none", cursor: "pointer",
              fontFamily: "'Fredoka One', cursive", marginRight: "12px",
            }}
          >
            View Leaderboard 🏆
          </button>
          <button
            onClick={handleRestart}
            style={{
              marginTop: "20px", padding: "12px 24px", borderRadius: "999px",
              background: B.teal, color: "white", border: "none", cursor: "pointer",
              fontFamily: "'Fredoka One', cursive",
            }}
          >
            Play Again 🔄
          </button>
        </div>
        {showLeaderboard && <Leaderboard entries={leaderboard} onClose={() => setShowLeaderboard(false)} />}
      </div>
    );
  }

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Fredoka+One&family=Nunito:wght@400;600;700;800;900&display=swap');
        @keyframes zoomIn{from{opacity:0;transform:scale(0.95)}to{opacity:1;transform:scale(1)}}
        @keyframes slideIn{from{opacity:0;transform:translateX(30px)}to{opacity:1;transform:translateX(0)}}
        @keyframes floatSlow{0%,100%{transform:translateY(0)}50%{transform:translateY(-10px)}}
      `}</style>

      <div style={{
        minHeight: "100vh",
        background: `radial-gradient(ellipse at top, ${B.teal}40, transparent),
                     radial-gradient(ellipse at bottom, ${B.maroon}40, transparent),
                     linear-gradient(135deg, ${B.tealDark}, ${B.maroonDark})`,
        padding: "20px",
      }}>
        {/* Header */}
        <div style={{
          maxWidth: "800px", margin: "0 auto", marginBottom: "20px",
          display: "flex", justifyContent: "space-between", alignItems: "center",
          flexWrap: "wrap", gap: "16px",
        }}>
          <div style={{ background: "rgba(255,255,255,0.15)", borderRadius: "999px", padding: "8px 20px" }}>
            <span style={{ color: "white", fontWeight: "bold" }}>👋 {user.name}</span>
          </div>
          <div style={{ background: "rgba(255,255,255,0.15)", borderRadius: "999px", padding: "8px 20px" }}>
            <span style={{ color: "white", fontWeight: "bold" }}>⭐ Score: {score}</span>
          </div>
          <div style={{ background: "rgba(255,255,255,0.15)", borderRadius: "999px", padding: "8px 20px" }}>
            <span style={{ color: "white", fontWeight: "bold" }}>
              📊 Question: {currentQuestionIndex + 1}/{SAMPLE_QUESTIONS.length}
            </span>
          </div>
          <div style={{ background: "rgba(255,255,255,0.15)", borderRadius: "999px", padding: "8px 20px" }}>
            <span style={{ color: "white", fontWeight: "bold" }}>📝 Attempts: {attempts}</span>
          </div>
          <button
            onClick={() => setShowLeaderboard(true)}
            style={{
              background: B.gold, border: "none", borderRadius: "999px",
              padding: "8px 20px", fontWeight: "bold", cursor: "pointer",
            }}
          >
            🏆 Leaderboard
          </button>
        </div>

        {/* Question Card */}
        <div style={{ maxWidth: "700px", margin: "0 auto" }}>
          <div style={{
            background: "white", borderRadius: "48px", overflow: "hidden",
            boxShadow: "0 32px 80px rgba(0,0,0,0.3)",
            animation: "slideIn 0.5s ease-out",
          }}>
            {/* Animal Banner */}
            <div style={{
              background: currentQuestion.bgColor,
              padding: "30px",
            }}>
              <div style={{ display: "flex", gap: "20px", alignItems: "center" }}>
                <div style={{ fontSize: "80px", animation: "floatSlow 3s ease-in-out infinite" }}>
                  {currentQuestion.animalEmoji}
                </div>
                <div>
                  <div style={{
                    display: "inline-block", background: currentQuestion.color,
                    color: "white", padding: "4px 12px", borderRadius: "999px",
                    fontSize: "12px", marginBottom: "8px",
                  }}>
                    {currentQuestion.animal}
                  </div>
                  <h2 style={{ fontSize: "24px", fontWeight: "bold", color: B.tealDark }}>
                    {currentQuestion.question}
                  </h2>
                </div>
              </div>
            </div>

            {/* Options */}
            <div style={{ padding: "30px" }}>
              <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                {currentQuestion.options.map((opt, i) => {
                  let buttonStyle: React.CSSProperties = {
                    padding: "16px 20px",
                    borderRadius: "20px",
                    border: "2px solid #e2e8f0",
                    background: "white",
                    fontSize: "16px",
                    fontWeight: "bold",
                    cursor: selected !== null ? "default" : "pointer",
                    transition: "all 0.3s",
                    textAlign: "left",
                  };

                  if (selected !== null) {
                    if (i === currentQuestion.correct) {
                      buttonStyle.background = `${B.teal}20`;
                      buttonStyle.border = `2px solid ${B.teal}`;
                    } else if (i === selected && i !== currentQuestion.correct) {
                      buttonStyle.background = `${B.coral}20`;
                      buttonStyle.border = `2px solid ${B.coral}`;
                    }
                  }

                  return (
                    <button
                      key={i}
                      onClick={() => handleSelect(i)}
                      disabled={selected !== null}
                      style={buttonStyle}
                      onMouseEnter={(e) => {
                        if (selected === null) {
                          e.currentTarget.style.transform = "scale(1.02)";
                          e.currentTarget.style.borderColor = currentQuestion.color;
                        }
                      }}
                      onMouseLeave={(e) => {
                        if (selected === null) {
                          e.currentTarget.style.transform = "scale(1)";
                          e.currentTarget.style.borderColor = "#e2e8f0";
                        }
                      }}
                    >
                      {opt}
                    </button>
                  );
                })}
              </div>

              {showFact && (
                <div style={{
                  marginTop: "20px", padding: "16px", borderRadius: "20px",
                  background: isCorrect ? `${B.teal}20` : `${B.coral}20`,
                  border: `2px solid ${isCorrect ? B.teal : B.coral}`,
                  animation: "zoomIn 0.4s ease-out",
                }}>
                  <p style={{ fontWeight: "bold", marginBottom: "8px" }}>
                    {isCorrect ? "🎉 Correct! +10 points!" : "💪 Not quite right! Keep trying!"}
                  </p>
                  <p>{currentQuestion.fact}</p>
                  {selected !== null && (
                    <>
                      {isCorrect ? (
                        <button
                          onClick={handleNextQuestion}
                          style={{
                            marginTop: "12px", padding: "8px 16px", borderRadius: "999px",
                            background: B.teal, color: "white", border: "none", cursor: "pointer",
                          }}
                        >
                          {currentQuestionIndex + 1 < SAMPLE_QUESTIONS.length ? "Next Question →" : "Finish Quiz 🎉"}
                        </button>
                      ) : (
                        <button
                          onClick={handleTryAgain}
                          style={{
                            marginTop: "12px", padding: "8px 16px", borderRadius: "999px",
                            background: B.coral, color: "white", border: "none", cursor: "pointer",
                          }}
                        >
                          Try Again 🔄
                        </button>
                      )}
                    </>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {showLeaderboard && <Leaderboard entries={leaderboard} onClose={() => setShowLeaderboard(false)} />}
    </>
  );
}
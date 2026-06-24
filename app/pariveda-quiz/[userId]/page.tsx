// app/pariveda-quiz/[userId]/page.tsx
"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";

interface Question {
  id: number;
  text: string;
  type: "single" | "multi";
  graded: boolean;
  options: Option[];
  correctAnswer?: string | string[];
}

interface Option {
  id: string;
  text: string;
}

interface QuizResponse {
  _id: string;
  userId: string;
  userName: string;
  isGuest: boolean;
  answers: Record<number, any>;
  score: number;
  totalQuestions: number;
  percentage: number;
  createdAt: string;
}

interface User {
  _id: string;
  name: string;
  isGuest: boolean;
  firstResponse?: any;
  createdAt?: string;
}

interface OtherUserResponse {
  userName: string;
  userId: string;
  answer: any;
  isCorrect?: boolean;
}

const QUESTIONS: Question[] = [
  {
    id: 1,
    text: "How would you rate your ABM understanding?",
    type: "single",
    graded: false,
    options: [
      { id: "A", text: "Novice – I have just very basic idea" },
      { id: "B", text: "Competent – I understand some concepts well but some I don't" },
      { id: "C", text: "Proficient – I understand most concepts but not all" },
      { id: "D", text: "Expert – I have mastered all ABM concepts" },
    ],
  },
  {
    id: 2,
    text: "Which of the following terms in ABM do you understand well?",
    type: "multi",
    graded: false,
    options: [
      { id: "A", text: "Buying Committee" },
      { id: "B", text: "Customer Intent Data" },
      { id: "C", text: "Pipeline velocity" },
      { id: "D", text: "Account Scoring" },
      { id: "E", text: "Content Personalization" },
    ],
  },
  {
    id: 3,
    text: "Which of the following tools is NOT a part of typical ABM tech stack?",
    type: "single",
    graded: true,
    options: [
      { id: "A", text: "6Sense for Intent Data" },
      { id: "B", text: "Tableau for Data Visualization" },
      { id: "C", text: "Demandbase for tracking Intent Data" },
      { id: "D", text: "Clay for CRM data augmentation" },
      { id: "E", text: "Mailchimp for e-mail" },
    ],
    correctAnswer: "E",
  },
  {
    id: 4,
    text: "When designing ABM campaigns, why is buying committee mapping critical?",
    type: "single",
    graded: true,
    options: [
      {
        id: "A",
        text: "Because B2B purchase decisions involve multiple stakeholders with different concerns",
      },
      { id: "B", text: "Because marketing teams need more contacts in the CRM" },
      { id: "C", text: "Because procurement departments mandate it as a mandatory requirement" },
      { id: "D", text: "Because it reduces campaign costs by adding more target personas" },
    ],
    correctAnswer: "A",
  },
  {
    id: 5,
    text: "In ABM, what are the three common tiers of account targeting?",
    type: "single",
    graded: true,
    options: [
      { id: "A", text: "Small, Medium, Large accounts by revenue" },
      { id: "B", text: "Strategic, Lite and Programmatic" },
      { id: "C", text: "Inbound, Outbound, and Hybrid tiers" },
      { id: "D", text: "Awareness, Consideration, and Decision tiers" },
    ],
    correctAnswer: "B",
  },
  {
    id: 6,
    text: "Which of the following tools would be MOST relevant to an ABM tech stack?",
    type: "single",
    graded: true,
    options: [
      { id: "A", text: "A general-purpose graphic design tool like Canva" },
      {
        id: "B",
        text: "An ABM platform like Demandbase or 6sense that provides account identification, intent data, and targeted advertising",
      },
      { id: "C", text: "A consumer email marketing tool like Mailchimp" },
      { id: "D", text: "A personal project management tool like Trello or Todoist" },
    ],
    correctAnswer: "B",
  },
  {
    id: 7,
    text: "What is the primary purpose of a 'personalized microsite' in ABM?",
    type: "single",
    graded: true,
    options: [
      { id: "A", text: "To replace the company's main website entirely" },
      {
        id: "B",
        text: "To create an account-specific or industry-specific web experience that speaks directly to a target's needs",
      },
      { id: "C", text: "To collect as many email addresses as possible from anonymous visitors" },
      { id: "D", text: "To host the company's blog content in a different format" },
    ],
    correctAnswer: "B",
  },
  {
    id: 8,
    text: "How does ABM differ from traditional lead generation?",
    type: "single",
    graded: true,
    options: [
      { id: "A", text: "ABM targets a broader audience to generate more leads" },
      {
        id: "B",
        text: "ABM focuses on specific high-value accounts rather than casting a wide net",
      },
      { id: "C", text: "ABM replaces the need for a sales team entirely" },
      { id: "D", text: "ABM only works for B2C companies" },
      { id: "E", text: "All of the above points are true" },
    ],
    correctAnswer: "B",
  },
  {
    id: 9,
    text: "Which of the following is the MOST critical success factor for ABM?",
    type: "single",
    graded: true,
    options: [
      { id: "A", text: "Having the most sophisticated ABM software platform" },
      { id: "B", text: "Alignment between sales and marketing teams" },
      { id: "C", text: "Sending the highest volume of emails possible" },
      { id: "D", text: "Having a large social media following" },
      { id: "E", text: "None of these" },
    ],
    correctAnswer: "B",
  },
];

const GRADED_QUESTIONS = QUESTIONS.filter((q) => q.graded);

// Correct answers for reference
const CORRECT_ANSWERS = {
  "3": "E",
  "4": "A",
  "5": "B",
  "6": "B",
  "7": "B",
  "8": "B",
  "9": "B",
};

// Component to show other users' responses
const OtherResponsesList = ({
  responses,
  currentUserId,
}: {
  responses: OtherUserResponse[];
  currentUserId: string;
}) => {
  if (responses.length === 0) return null;

  return (
    <div className="mt-4 space-y-2">
      <p className="text-sm font-medium text-[#636D8C]">Other users' responses:</p>
      <div className="custom-scrollbar max-h-40 space-y-1 overflow-y-auto">
        {responses.map((response, idx) => (
          <div key={idx} className="flex items-center gap-2 rounded-lg bg-[#1A2F88]/30 p-2 text-xs">
            <span className="font-medium text-[#AA5D8B]">{response.userName}:</span>
            <span className={response.isCorrect ? "text-[#2A72F7]" : "text-[#E0505D]"}>
              {Array.isArray(response.answer)
                ? response.answer.join(", ")
                : response.answer || "Not answered"}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default function UserDetailPage() {
  const params = useParams();
  const userId = params.userId as string;

  const [user, setUser] = useState<User | null>(null);
  const [userResponses, setUserResponses] = useState<QuizResponse[]>([]);
  const [allResponses, setAllResponses] = useState<QuizResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedResponseIndex, setSelectedResponseIndex] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        // Fetch user data
        const userRes = await fetch(`/api/guest-user?userId=${userId}`);
        const userData = await userRes.json();

        if (userData.success) {
          setUser(userData.data);
        } else {
          setError("User not found");
        }

        // Fetch all quiz responses (API now returns formatted data)
        const allResponsesRes = await fetch("/api/quiz-res");
        const allResponsesData = await allResponsesRes.json();

        if (allResponsesData.success) {
          setAllResponses(allResponsesData.data);

          // Filter responses for current user
          const userSpecificResponses = allResponsesData.data.filter(
            (r: QuizResponse) => r.userId === userId
          );
          setUserResponses(userSpecificResponses);
        }
      } catch (err) {
        console.error("Error fetching data:", err);
        setError("Failed to load data");
      } finally {
        setLoading(false);
      }
    };

    if (userId) {
      fetchData();
    }
  }, [userId]);

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#020B39]">
        <div className="text-center">
          <div className="mx-auto h-16 w-16 animate-spin rounded-full border-b-2 border-t-2 border-[#2A72F7]"></div>
          <p className="mt-4 text-[#636D8C]">Loading user data...</p>
        </div>
      </main>
    );
  }

  if (error || !user) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#020B39]">
        <div className="text-center">
          <p className="mb-4 text-xl text-[#E0505D]">{error || "User not found"}</p>
          <Link
            href="/pariveda-quiz"
            className="inline-flex items-center gap-2 rounded-xl bg-[#2A72F7] px-6 py-3 text-white transition-colors hover:bg-[#2A72F7]/90"
          >
            Back to Quiz
          </Link>
        </div>
      </main>
    );
  }

  const currentResponse = userResponses[selectedResponseIndex];
  const totalResponses = userResponses.length;

  const getScoreColor = (score: number) => {
    if (score <= 2) return "text-[#E0505D]";
    if (score <= 5) return "text-[#FB6A31]";
    return "text-[#2A72F7]";
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // Get other users' responses for a specific question (excluding current user)
  const getOtherUserResponses = (questionId: number): OtherUserResponse[] => {
    return allResponses
      .filter((r) => r.userId !== userId && r.answers[questionId] !== undefined)
      .map((r) => ({
        userName: r.userName,
        userId: r.userId,
        answer: r.answers[questionId],
        isCorrect:
          r.answers[questionId] ===
          CORRECT_ANSWERS[questionId.toString() as keyof typeof CORRECT_ANSWERS],
      }))
      .slice(0, 5); // Limit to 5 responses to keep UI clean
  };

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#020B39]">
      {/* Background gradient shapes */}
      <div className="pointer-events-none fixed inset-0">
        <div className="absolute left-0 top-0 h-[800px] w-[800px] animate-float rounded-full bg-[#1A2F88] opacity-20 blur-[120px] filter" />
        <div
          className="absolute bottom-0 right-0 h-[600px] w-[600px] animate-float rounded-full bg-[#2A72F7] opacity-20 blur-[100px] filter"
          style={{ animationDelay: "2s" }}
        />
      </div>

      {/* Header */}
      <header className="relative z-20 border-b border-white/5 px-4 py-6 md:px-8">
        <div className="container mx-auto">
          <div className="flex items-center justify-between">
            <div className="relative h-10 w-32 md:h-12 md:w-40">
              <Image
                src="https://ik.imagekit.io/pratik2002/pariveda.svg"
                alt="Pariveda"
                fill
                className="object-contain brightness-0 invert"
              />
            </div>

            <div className="flex items-center gap-4">
              <Link
                href="/pariveda-quiz"
                className="flex items-center gap-2 text-[#636D8C] transition-colors hover:text-[#E2E3E8]"
              >
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 19l-7-7 7-7"
                  />
                </svg>
                Back to Quiz
              </Link>
              <span className="text-sm font-medium text-[#2A72F7]">Enterprise</span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="container relative z-10 mx-auto px-4 py-8 md:py-16">
        <div className="mx-auto max-w-4xl">
          {/* User Header */}
          <div className="mb-8">
            <h1 className="font-display mb-2 text-4xl text-[#E2E3E8] md:text-5xl">{user.name}</h1>
            <div className="flex items-center gap-4 text-[#636D8C]">
              <span
                className={`rounded-full px-3 py-1 text-xs ${
                  user.isGuest ? "bg-[#FB6A31]/20 text-[#FB6A31]" : "bg-[#2A72F7]/20 text-[#2A72F7]"
                }`}
              >
                {user.isGuest ? "Guest User" : "Team Member"}
              </span>
              {user.createdAt && (
                <span>Member since: {new Date(user.createdAt).toLocaleDateString()}</span>
              )}
            </div>
          </div>

          {userResponses.length === 0 ? (
            <div className="rounded-[2rem] border border-white/5 bg-[#16256F]/30 p-12 text-center backdrop-blur-sm">
              <p className="text-lg text-[#636D8C]">No quiz attempts yet</p>
            </div>
          ) : (
            <>
              {/* Response Selector */}
              {totalResponses > 1 && (
                <div className="mb-6 flex items-center justify-between">
                  <h2 className="font-display text-xl text-[#E2E3E8]">
                    Quiz Attempts ({totalResponses})
                  </h2>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setSelectedResponseIndex((prev) => Math.max(0, prev - 1))}
                      disabled={selectedResponseIndex === 0}
                      className="rounded-lg border border-white/10 p-2 transition-colors hover:bg-white/5 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      <svg
                        className="h-5 w-5"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M15 19l-7-7 7-7"
                        />
                      </svg>
                    </button>
                    <span className="rounded-lg bg-[#16256F]/50 px-4 py-2 text-[#636D8C]">
                      {selectedResponseIndex + 1} of {totalResponses}
                    </span>
                    <button
                      onClick={() =>
                        setSelectedResponseIndex((prev) => Math.min(totalResponses - 1, prev + 1))
                      }
                      disabled={selectedResponseIndex === totalResponses - 1}
                      className="rounded-lg border border-white/10 p-2 transition-colors hover:bg-white/5 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      <svg
                        className="h-5 w-5"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 5l7 7-7 7"
                        />
                      </svg>
                    </button>
                  </div>
                </div>
              )}

              {/* Score Summary */}
              {currentResponse && (
                <>
                  <div className="mb-8 grid gap-4 md:grid-cols-3">
                    <div className="rounded-2xl border border-white/5 bg-[#16256F]/30 p-6 backdrop-blur-sm">
                      <p className="mb-1 text-sm text-[#636D8C]">Score</p>
                      <p
                        className={`font-display text-3xl ${getScoreColor(currentResponse.score)}`}
                      >
                        {currentResponse.score}/{currentResponse.totalQuestions}
                      </p>
                    </div>
                    <div className="rounded-2xl border border-white/5 bg-[#16256F]/30 p-6 backdrop-blur-sm">
                      <p className="mb-1 text-sm text-[#636D8C]">Percentage</p>
                      <p className="font-display text-3xl text-[#2A72F7]">
                        {Math.round(currentResponse.percentage)}%
                      </p>
                    </div>
                    <div className="rounded-2xl border border-white/5 bg-[#16256F]/30 p-6 backdrop-blur-sm">
                      <p className="mb-1 text-sm text-[#636D8C]">Completed</p>
                      <p className="text-sm text-[#E2E3E8]">
                        {formatDate(currentResponse.createdAt)}
                      </p>
                    </div>
                  </div>

                  {/* Detailed Review with Comparisons */}
                  <div className="space-y-6">
                    <h2 className="font-display mb-6 text-2xl text-[#E2E3E8]">Detailed Review</h2>

                    {QUESTIONS.map((question, index) => {
                      const userAnswer = currentResponse.answers[question.id];
                      const isCorrect = question.graded && userAnswer === question.correctAnswer;
                      const correctAnswerText = question.graded
                        ? question.options.find((o) => o.id === question.correctAnswer)?.text
                        : null;

                      // Get other users' responses for this question
                      const otherResponses = getOtherUserResponses(question.id);

                      return (
                        <div
                          key={question.id}
                          className={`rounded-2xl border-l-4 bg-[#16256F]/30 p-6 backdrop-blur-sm transition-all duration-200 ${
                            question.graded
                              ? isCorrect
                                ? "border-l-[#2A72F7] bg-[#2A72F7]/5"
                                : "border-l-[#E0505D] bg-[#E0505D]/5"
                              : "border-l-[#636D8C]"
                          } `}
                        >
                          <div className="flex items-start gap-4">
                            <div
                              className={`flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg font-bold ${
                                question.graded
                                  ? isCorrect
                                    ? "bg-[#2A72F7]/20 text-[#2A72F7]"
                                    : "bg-[#E0505D]/20 text-[#E0505D]"
                                  : "bg-[#636D8C]/20 text-[#636D8C]"
                              } `}
                            >
                              {index + 1}
                            </div>

                            <div className="flex-1">
                              <div className="mb-3 flex items-start justify-between">
                                <p className="font-medium text-[#E2E3E8]">{question.text}</p>
                                {!question.graded && (
                                  <span className="rounded-full bg-[#AA5D8B]/20 px-2 py-1 text-xs text-[#AA5D8B]">
                                    Not graded
                                  </span>
                                )}
                              </div>

                              <div className="space-y-3 text-sm">
                                {/* Current user's answer */}
                                <div className="flex items-start gap-2">
                                  <span className="min-w-[80px] text-[#636D8C]">Your answer:</span>
                                  <span
                                    className={
                                      question.graded
                                        ? isCorrect
                                          ? "text-[#2A72F7]"
                                          : "text-[#E0505D]"
                                        : "text-[#E2E3E8]"
                                    }
                                  >
                                    {Array.isArray(userAnswer)
                                      ? userAnswer
                                          .map(
                                            (id) => question.options.find((o) => o.id === id)?.text
                                          )
                                          .join(", ")
                                      : question.options.find((o) => o.id === userAnswer)?.text ||
                                        "Not answered"}
                                  </span>
                                </div>

                                {/* Correct answer for graded questions */}
                                {question.graded && (
                                  <div className="flex items-start gap-2">
                                    <span className="min-w-[80px] text-[#636D8C]">
                                      Correct answer:
                                    </span>
                                    <span className="font-medium text-[#2A72F7]">
                                      {correctAnswerText} ({question.correctAnswer})
                                    </span>
                                  </div>
                                )}

                                {/* Other users' responses */}
                                {otherResponses.length > 0 && (
                                  <div className="mt-4 border-t border-white/5 pt-4">
                                    <p className="mb-2 text-sm font-medium text-[#636D8C]">
                                      Other users' responses ({otherResponses.length}):
                                    </p>
                                    <div className="custom-scrollbar max-h-60 space-y-2 overflow-y-auto pr-2">
                                      {otherResponses.map((response, idx) => (
                                        <div
                                          key={idx}
                                          className="flex items-center gap-2 rounded-lg bg-[#1A2F88]/30 p-2 text-xs transition-colors hover:bg-[#1A2F88]/50"
                                        >
                                          <span className="min-w-[100px] truncate font-medium text-[#AA5D8B]">
                                            {response.userName}:
                                          </span>
                                          <span
                                            className={
                                              response.isCorrect
                                                ? "text-[#2A72F7]"
                                                : "text-[#E0505D]"
                                            }
                                          >
                                            {Array.isArray(response.answer)
                                              ? response.answer
                                                  .map(
                                                    (id) =>
                                                      question.options.find((o) => o.id === id)
                                                        ?.text || id
                                                  )
                                                  .join(", ")
                                              : question.options.find(
                                                  (o) => o.id === response.answer
                                                )?.text ||
                                                response.answer ||
                                                "Not answered"}
                                          </span>
                                          {response.isCorrect && (
                                            <span className="ml-auto rounded-full bg-[#2A72F7]/20 px-2 py-0.5 text-xs text-[#2A72F7]">
                                              Correct
                                            </span>
                                          )}
                                        </div>
                                      ))}
                                    </div>
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </>
              )}
            </>
          )}
        </div>
      </div>

      {/* Footer */}
      <footer className="relative z-20 mt-auto px-4 py-8">
        <div className="container mx-auto">
          <div className="pointer-events-none absolute bottom-0 left-1/2 h-96 w-96 -translate-x-1/2 opacity-5">
            <Image
              src="https://ik.imagekit.io/pratik2002/pariveda.svg"
              alt=""
              fill
              className="object-contain"
            />
          </div>
          <div className="text-center text-sm text-[#636D8C]">
            © 2024 Pariveda Solutions. All rights reserved.
          </div>
        </div>
      </footer>

      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: #1a2f88;
          border-radius: 2px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #2a72f7;
          border-radius: 2px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #aa5d8b;
        }
      `}</style>
    </main>
  );
}

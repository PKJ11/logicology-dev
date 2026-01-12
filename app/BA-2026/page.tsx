"use client";

import { useState } from "react";
import Select from "react-select";
import toast from "react-hot-toast";
import {
  Check,
  ChevronRight,
  Sparkles,
  Users,
  Brain,
  Target,
  Star,
  Zap,
  Send,
  ArrowRight,
  TrendingUp,
  BookOpen,
  Search,
  GraduationCap,
  MessageSquare,
  Hash,
} from "lucide-react";

// Updated student data from your list
const STUDENTS = [
  { id: 29887, enrollmentNo: "BT23CIV033", name: "AYUSH CHARDE" },
  { id: 30305, enrollmentNo: "BT23CIV061", name: "SAMBA BHANU PRAKASH" },
  { id: 29614, enrollmentNo: "BT23ECE006", name: "PATEL RAJASHREE KALYAN" },
  { id: 29640, enrollmentNo: "BT23ECE012", name: "MULAY ADITYA MANGESH" },
  { id: 29664, enrollmentNo: "BT23ECE015", name: "BASWADE SWARAJ BALAJI" },
  { id: 29674, enrollmentNo: "BT23ECE017", name: "SUJAL KUMAR BIRENDRA" },
  { id: 29811, enrollmentNo: "BT23ECE036", name: "ISHAAN RAJESH SANGTANI" },
  { id: 29895, enrollmentNo: "BT23ECE047", name: "ROHIT SINGH" },
  { id: 29940, enrollmentNo: "BT23ECE054", name: "AMAN VERMA" },
  { id: 29951, enrollmentNo: "BT23ECE055", name: "TAYADE OM RAJESH" },
  { id: 29958, enrollmentNo: "BT23ECE057", name: "KALE SOHAM PANDHARI" },
  { id: 30008, enrollmentNo: "BT23ECE066", name: "JINTURKAR SIDDHANT ASHISH" },
  { id: 30193, enrollmentNo: "BT23ECE076", name: "TIWARI AKASH GAURISHANKAR" },
  { id: 30272, enrollmentNo: "BT23ECE084", name: "SAMARTH CHIKATE" },
  { id: 30281, enrollmentNo: "BT23ECE085", name: "CHINCHOLKAR AKASH GOVIND" },
  { id: 30425, enrollmentNo: "BT23ECE101", name: "DINKAR KUMAR" },
  { id: 30485, enrollmentNo: "BT23ECE106", name: "NISHANT RAMESH KADU" },
  { id: 30643, enrollmentNo: "BT23ECE114", name: "SHETTY ARAV RAJESH" },
  { id: 29883, enrollmentNo: "BT23MEC036", name: "VALLABH YERNE" },
  { id: 30222, enrollmentNo: "BT23MIN017", name: "SAYANI THRINAY" },
  { id: 30234, enrollmentNo: "BT23MIN018", name: "ARYAN RICHHARIYA" },
  { id: 30236, enrollmentNo: "BT23MIN019", name: "KURUGANTI RAGHUVARAPRASAD" },
  { id: 30332, enrollmentNo: "BT23MIN027", name: "PRINCE KUMAR" },
  { id: 30423, enrollmentNo: "BT23MIN032", name: "SANJIT SUNIL KONDEKAR" },
  { id: 29793, enrollmentNo: "BT23MME013", name: "PIYUSH MISHRA" },
  { id: 29848, enrollmentNo: "BT23MME021", name: "RABADE GAURAV VIJAYSING" },
  { id: 29918, enrollmentNo: "BT23MME029", name: "LAKSHAYPREET SINGH" },
  { id: 29962, enrollmentNo: "BT23MME035", name: "PARTHIK OMER" },
  { id: 30494, enrollmentNo: "BT23MME094", name: "PRATIK RAJ OM PRAKASH" },
  { id: 30752, enrollmentNo: "BT23MME112", name: "ARPIT KUMAR" },
  { id: 29790, enrollmentNo: "BT23CME019", name: "TARUNI SURESH BABU" },
  { id: 29907, enrollmentNo: "BT23CME036", name: "BORKUTE PRATYUSH DILIP" },
  { id: 29943, enrollmentNo: "BT23CME045", name: "BADAL MANOHAR SAKHARKAR" },
  { id: 30026, enrollmentNo: "BT23CME055", name: "DEEPU KUMAR" },
  { id: 30267, enrollmentNo: "BT23CME071", name: "MEET SHASHIKANT VYAS" },
  { id: 30586, enrollmentNo: "BT23CME098", name: "TANISH RAGHUVANSHI" },
  { id: 30670, enrollmentNo: "BT23CME106", name: "PATIL VISHAL RAMAKANT" },
];

// Steve Jobs Quiz Questions
const QUIZ_QUESTIONS = [
  {
    id: 1,
    question: "How many stories does Steve Jobs tell in the commencement video? (Write numeric answer)",
    type: "numeric",
    answer: "3",
    icon: <Hash className="h-5 w-5" />,
  },
  {
    id: 2,
    question: "Which university/college did Steve Jobs go to?",
    type: "multiple-choice",
    options: [
      { id: "a", text: "Stanford" },
      { id: "b", text: "Harvard" },
      { id: "c", text: "Reed College" },
      { id: "d", text: "Oxford" },
      { id: "e", text: "Princeton" },
    ],
    correctAnswer: "c",
    icon: <GraduationCap className="h-5 w-5" />,
  },
  {
    id: 3,
    question: "Which of these is a phrase used in the Steve Jobs video?",
    type: "multiple-choice",
    options: [
      { id: "a", text: "Sometimes to win something you need to lose" },
      { id: "b", text: "Truth alone prevails always" },
      { id: "c", text: "The death given by someone is extremely butchersome" },
      { id: "d", text: "Stay Hungry. Stay Foolish." },
      { id: "e", text: "If something is not good, the film is not over yet" },
    ],
    correctAnswer: "d",
    icon: <MessageSquare className="h-5 w-5" />,
  },
];

const STEP_ICONS = [
  <Users className="h-5 w-5" />,
  <Brain className="h-5 w-5" />,
  <Target className="h-5 w-5" />,
  <Star className="h-5 w-5" />,
  <BookOpen className="h-5 w-5" />,
  <Zap className="h-5 w-5" />,
];

const STEPS = [
  "Select Student",
  "Quiz Question 1",
  "Quiz Question 2", 
  "Quiz Question 3",
  "Review Answers",
  "Submit Quiz",
];

export default function SteveJobsQuiz() {
  const [step, setStep] = useState(0);
  const [student, setStudent] = useState<{ id: number; enrollmentNo: string; name: string } | null>(null);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [submitting, setSubmitting] = useState(false);

  const handleAnswerChange = (questionId: number, answer: string) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: answer
    }));
  };

  const handleSubmit = async () => {
    setSubmitting(true);
    
    // Calculate score
    let score = 0;
    QUIZ_QUESTIONS.forEach(question => {
      if (question.type === "numeric" && answers[question.id] === question.answer) {
        score++;
      } else if (question.type === "multiple-choice" && answers[question.id] === question.correctAnswer) {
        score++;
      }
    });

    const payload = {
      studentId: student?.id,
      enrollmentNo: student?.enrollmentNo,
      studentName: student?.name,
      answers,
      score,
      totalQuestions: QUIZ_QUESTIONS.length,
      submittedAt: new Date().toISOString(),
    };

    try {
      const res = await fetch("/api/mica-ai-feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (data.success) {
        toast.success("Quiz submitted successfully!");
        setStep(99);
      } else {
        toast.error(data.error || "Submission failed");
      }
    } catch (err: any) {
      toast.error(err.message || "Submission error");
    } finally {
      setSubmitting(false);
    }
  };

  const getProgressPercentage = () => {
    if (step === 99) return 100;
    return ((step + 1) / STEPS.length) * 100;
  };

  const customSelectStyles = {
    control: (base: any) => ({
      ...base,
      border: "2px solid #e2e8f0",
      borderRadius: "12px",
      padding: "8px",
      backgroundColor: "#f8fafc",
      "&:hover": {
        borderColor: "#3b82f6",
      },
      boxShadow: "none",
    }),
    option: (base: any, state: any) => ({
      ...base,
      backgroundColor: state.isSelected ? "#3b82f6" : state.isFocused ? "#eff6ff" : "white",
      color: state.isSelected ? "white" : "#334155",
      padding: "12px 16px",
      "&:active": {
        backgroundColor: "#3b82f6",
        color: "white",
      },
    }),
    menu: (base: any) => ({
      ...base,
      borderRadius: "12px",
      border: "1px solid #e2e8f0",
      boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)",
      zIndex: 50,
    }),
    placeholder: (base: any) => ({
      ...base,
      color: "#64748b",
    }),
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 px-4 py-8">
      <div className="mx-auto max-w-4xl">
        {/* Header */}
        <div className="mb-8 text-center">
          <div className="mb-4 inline-flex items-center gap-3 rounded-full bg-gradient-to-r from-blue-600 to-violet-600 px-6 py-3 text-white shadow-lg">
            <Sparkles className="h-6 w-6" />
            <h1 className="text-3xl font-bold tracking-tight">BA Quiz</h1>
            <Sparkles className="h-6 w-6" />
          </div>
          {/* <p className="text-lg text-slate-600">Test your knowledge about Steve Jobs' famous Stanford speech</p> */}
        </div>

        {/* Progress Bar */}
        <div className="mb-10">
          <div className="mb-2 flex items-center justify-between">
            {STEPS.map((stepName, index) => (
              <div key={index} className="relative flex flex-col items-center">
                <div
                  className={`flex h-10 w-10 items-center justify-center rounded-full transition-all duration-300 ${step >= index ? "bg-gradient-to-br from-blue-500 to-violet-500 text-white shadow-lg" : "bg-slate-200 text-slate-500"}`}
                >
                  {STEP_ICONS[index]}
                </div>
                <span
                  className={`mt-2 text-sm font-medium ${step >= index ? "text-blue-600" : "text-slate-400"}`}
                >
                  {stepName}
                </span>
              </div>
            ))}
          </div>
          <div className="mt-4 h-2 overflow-hidden rounded-full bg-slate-200">
            <div
              className="h-full bg-gradient-to-r from-blue-500 to-violet-500 transition-all duration-500 ease-out"
              style={{ width: `${getProgressPercentage()}%` }}
            />
          </div>
        </div>

        {/* Main Content */}
        <div className="mb-8 rounded-2xl border border-slate-200 bg-white p-8 shadow-2xl">
          {/* Step 0 - Student Selection */}
          {step === 0 && (
            <div className="animate-fadeIn">
              <div className="mb-8 flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-blue-100 to-violet-100">
                  <Users className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-slate-800">Welcome! Let's Begin</h2>
                  <p className="text-slate-600">Please select your name from the list</p>
                </div>
              </div>

              <div className="mb-6">
                <label className="mb-2 block text-sm font-medium text-slate-700">
                  Search and select your name
                </label>
                <Select
                  options={STUDENTS.map(s => ({
                    value: s.id,
                    label: `${s.enrollmentNo} - ${s.name}`,
                    ...s
                  }))}
                  value={student ? { 
                    value: student.id, 
                    label: `${student.enrollmentNo} - ${student.name}`,
                    ...student 
                  } : null}
                  onChange={(selected: any) => setStudent(selected)}
                  placeholder="Type to search..."
                  isSearchable
                  styles={customSelectStyles}
                  components={{
                    DropdownIndicator: () => (
                      <div className="mr-3">
                        <Search className="h-5 w-5 text-slate-400" />
                      </div>
                    ),
                  }}
                />
              </div>

              <button
                className={`w-full transform rounded-xl py-4 text-lg font-semibold transition-all hover:scale-[1.02] ${student ? "bg-gradient-to-r from-blue-600 to-violet-600 text-white shadow-lg hover:shadow-xl" : "cursor-not-allowed bg-slate-100 text-slate-400"}`}
                disabled={!student}
                onClick={() => setStep(1)}
              >
                {student ? (
                  <span className="flex items-center justify-center gap-2">
                    Start Quiz <ChevronRight className="h-5 w-5" />
                  </span>
                ) : (
                  "Select your name to continue"
                )}
              </button>
            </div>
          )}

          {/* Step 1-3 - Quiz Questions */}
          {step >= 1 && step <= 3 && (
            <div className="animate-fadeIn">
              {(() => {
                const questionIndex = step - 1;
                const question = QUIZ_QUESTIONS[questionIndex];
                
                return (
                  <>
                    <div className="mb-8 flex items-center gap-3">
                      <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-blue-100 to-violet-100">
                        {question.icon}
                      </div>
                      <div>
                        <h2 className="text-2xl font-bold text-slate-800">Question {step}</h2>
                        <p className="text-slate-600">{step} of {QUIZ_QUESTIONS.length} questions</p>
                      </div>
                    </div>

                    <div className="mb-8">
                      <div className="mb-6 rounded-xl bg-gradient-to-r from-blue-50 to-violet-50 p-6">
                        <h3 className="text-lg font-semibold text-slate-800">{question.question}</h3>
                      </div>

                      {question.type === "numeric" ? (
                        <div>
                          <label className="mb-2 block text-sm font-medium text-slate-700">
                            Enter your answer (numeric only)
                          </label>
                          <input
                            type="number"
                            value={answers[question.id] || ""}
                            onChange={(e) => handleAnswerChange(question.id, e.target.value)}
                            className="w-full rounded-xl border-2 border-slate-200 p-4 text-center text-2xl font-bold transition-all focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                            placeholder="Enter number"
                          />
                        </div>
                      ) : (
                        <div className="space-y-3">
                          {question.options?.map((option) => {
                            const isSelected = answers[question.id] === option.id;
                            return (
                              <button
                                key={option.id}
                                className={`w-full transform rounded-xl border-2 p-5 text-left transition-all hover:scale-[1.01] ${isSelected ? "border-blue-500 bg-gradient-to-r from-blue-50 to-violet-50 shadow-md" : "border-slate-200 hover:border-blue-200"}`}
                                onClick={() => handleAnswerChange(question.id, option.id)}
                              >
                                <div className="flex items-center justify-between">
                                  <div className="flex items-center gap-4">
                                    <div className={`flex h-8 w-8 items-center justify-center rounded-full ${isSelected ? "bg-blue-500 text-white" : "bg-slate-100 text-slate-600"}`}>
                                      {option.id.toUpperCase()}
                                    </div>
                                    <span className="font-medium text-slate-800">{option.text}</span>
                                  </div>
                                  {isSelected && (
                                    <div className="rounded-full bg-gradient-to-r from-blue-500 to-violet-500 p-2 text-white">
                                      <Check className="h-4 w-4" />
                                    </div>
                                  )}
                                </div>
                              </button>
                            );
                          })}
                        </div>
                      )}
                    </div>

                    <div className="flex gap-4">
                      <button
                        className="rounded-xl border-2 border-slate-200 px-6 py-3 font-medium text-slate-700 transition-colors hover:bg-slate-50"
                        onClick={() => setStep(step - 1)}
                        disabled={step === 1}
                      >
                        Back
                      </button>
                      <button
                        className="flex-1 transform rounded-xl bg-gradient-to-r from-blue-600 to-violet-600 py-3 font-semibold text-white transition-all hover:scale-[1.02] disabled:cursor-not-allowed disabled:opacity-50"
                        disabled={!answers[question.id]}
                        onClick={() => {
                          if (step < 3) {
                            setStep(step + 1);
                          } else {
                            setStep(4); // Go to review
                          }
                        }}
                      >
                        {step < 3 ? (
                          <>
                            Next Question <ArrowRight className="ml-2 inline h-5 w-5" />
                          </>
                        ) : (
                          "Review Answers"
                        )}
                      </button>
                    </div>
                  </>
                );
              })()}
            </div>
          )}

          {/* Step 4 - Review Answers */}
          {step === 4 && (
            <div className="animate-fadeIn">
              <div className="mb-8 flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-green-100 to-teal-100">
                  <BookOpen className="h-6 w-6 text-green-600" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-slate-800">Review Your Answers</h2>
                  <p className="text-slate-600">Please review your answers before submitting</p>
                </div>
              </div>

              <div className="mb-8 space-y-6">
                {QUIZ_QUESTIONS.map((question, index) => (
                  <div key={question.id} className="rounded-xl border border-slate-200 p-6">
                    <div className="mb-4 flex items-start justify-between">
                      <div>
                        <h3 className="font-semibold text-slate-800">Question {index + 1}</h3>
                        <p className="mt-1 text-slate-700">{question.question}</p>
                      </div>
                      <button
                        className="text-sm font-medium text-blue-600 hover:text-blue-700"
                        onClick={() => setStep(index + 1)}
                      >
                        Edit
                      </button>
                    </div>
                    <div className="rounded-lg bg-slate-50 p-4">
                      <span className="font-medium text-slate-800">
                        Your answer: {answers[question.id] || "Not answered"}
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex gap-4">
                <button
                  className="rounded-xl border-2 border-slate-200 px-6 py-3 font-medium text-slate-700 transition-colors hover:bg-slate-50"
                  onClick={() => setStep(3)}
                >
                  Back
                </button>
                <button
                  className="flex-1 transform rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 py-3 font-semibold text-white transition-all hover:scale-[1.02] hover:shadow-lg"
                  onClick={() => setStep(5)}
                >
                  Proceed to Submit
                </button>
              </div>
            </div>
          )}

          {/* Step 5 - Final Submit */}
          {step === 5 && (
            <div className="animate-fadeIn">
              <div className="mb-8 flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-orange-100 to-red-100">
                  <Zap className="h-6 w-6 text-orange-600" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-slate-800">Submit Your Quiz</h2>
                  <p className="text-slate-600">Ready to submit your answers?</p>
                </div>
              </div>

              <div className="mb-8 rounded-xl bg-gradient-to-r from-blue-50 to-violet-50 p-6">
                <div className="mb-4 flex items-center justify-between">
                  <span className="font-medium text-slate-700">Student:</span>
                  <span className="font-bold text-slate-900">{student?.name}</span>
                </div>
                <div className="mb-4 flex items-center justify-between">
                  <span className="font-medium text-slate-700">Enrollment No:</span>
                  <span className="font-bold text-slate-900">{student?.enrollmentNo}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="font-medium text-slate-700">Questions Answered:</span>
                  <span className="font-bold text-slate-900">
                    {Object.keys(answers).length} of {QUIZ_QUESTIONS.length}
                  </span>
                </div>
              </div>

              <div className="flex gap-4">
                <button
                  className="rounded-xl border-2 border-slate-200 px-6 py-3 font-medium text-slate-700 transition-colors hover:bg-slate-50"
                  onClick={() => setStep(4)}
                >
                  Back to Review
                </button>
                <button
                  className="flex-1 transform rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 py-3 font-semibold text-white transition-all hover:scale-[1.02] hover:shadow-lg disabled:cursor-not-allowed disabled:opacity-50"
                  onClick={handleSubmit}
                  disabled={submitting}
                >
                  {submitting ? (
                    <span className="flex items-center justify-center gap-2">
                      <div className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent" />
                      Submitting...
                    </span>
                  ) : (
                    <span className="flex items-center justify-center gap-2">
                      Submit Quiz <Send className="h-5 w-5" />
                    </span>
                  )}
                </button>
              </div>
            </div>
          )}

          {/* Success Screen */}
          {step === 99 && (
            <div className="animate-fadeIn py-12 text-center">
              <div className="mx-auto mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-r from-emerald-100 to-teal-100">
                <Check className="h-12 w-12 text-emerald-600" />
              </div>
              <h2 className="mb-4 text-3xl font-bold text-slate-800">Quiz Submitted Successfully!</h2>
              <p className="mx-auto mb-8 max-w-md text-lg text-slate-600">
                Your quiz responses have been recorded. Thank you for participating.
              </p>
              <div className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-emerald-50 to-teal-50 px-6 py-3">
                <Sparkles className="h-5 w-5 text-emerald-600" />
                <span className="font-medium text-emerald-700">
                  Quiz ID: {Math.random().toString(36).substr(2, 9).toUpperCase()}
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="text-center text-sm text-slate-500">
          <p>BA Quiz • All responses are confidential</p>
        </div>
      </div>

      <style jsx global>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }
      `}</style>
    </div>
  );
}
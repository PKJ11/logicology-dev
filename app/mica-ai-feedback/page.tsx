"use client";

import { useState } from "react";
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
  BookOpen
} from "lucide-react";

const STUDENTS = [
  { id: 1, name: "R Rahul Manickam" },
  { id: 2, name: "Nikhil Pashae" },
  { id: 3, name: "Bhavna Lumigar" },
  { id: 4, name: "Pratik Suratiwala" },
  { id: 5, name: "Avankana Karnekar" },
  { id: 6, name: "Kaustubh Misalodkar" },
  { id: 7, name: "Abhishek Werd" },
  { id: 8, name: "Rajitha Bomma" },
  { id: 9, name: "Sagal Bambie" },
  { id: 10, name: "Nusrat Saghir" },
  { id: 11, name: "Nitin Junghare" },
  { id: 12, name: "Mohan Waghmare" },
  { id: 13, name: "Manish Prasad" },
  { id: 14, name: "Surbhi Koltishterkar" },
  { id: 15, name: "Vishal Sharma" },
  { id: 16, name: "Jeetendra Inje" },
  { id: 17, name: "Sindeep Naik" },
  { id: 18, name: "Arpita Vaidya" },
  { id: 19, name: "Prajaka Kedam" },
  { id: 20, name: "SNEHA JIGAR CHHEDA" },
  { id: 21, name: "WILMA D'SOUZA" },
  { id: 22, name: "Jayshri Bhalerao" },
  { id: 23, name: "Sagar More" },
  { id: 24, name: "VISHAL MAHAJAN" },
  { id: 25, name: "Devashree Suvarna" },
  { id: 26, name: "Kinnar Mehta" },
  { id: 27, name: "Ayushi Singh" },
  { id: 28, name: "Vedika Koli" },
  { id: 29, name: "Nikita Arun Mohite" },
  { id: 30, name: "Pratik Chauhan" },
  { id: 31, name: "Shubham Dubey" },
  { id: 32, name: "Nidhi Gandhi" },
  { id: 33, name: "Kinnar Mehta" },
  { id: 34, name: "Pratik Vachher" },
  { id: 35, name: "Smeshal Bando" },
  { id: 36, name: "Neha Panvkar" },
  { id: 37, name: "Akansha Agarwal" },
  { id: 38, name: "Payal Ghose" },
];

const AI_LEVELS = [
  { label: "Novice", icon: "🌱", color: "from-emerald-100 to-emerald-50", description: "Just getting started" },
  { label: "Some Understanding", icon: "📚", color: "from-blue-100 to-blue-50", description: "Basic knowledge" },
  { label: "Fair Understanding", icon: "🎯", color: "from-purple-100 to-purple-50", description: "Confident with basics" },
  { label: "Very Conversant", icon: "🚀", color: "from-violet-100 to-violet-50", description: "Advanced knowledge" },
];

const AI_CONCEPTS = [
  "LLM",
  "Generative AI",
  "Hallucination",
  "Co-pilot",
  "MCP",
  "Hyperparameter Tuning",
  "Attention Mechanism",
];

const AI_TOPICS = [
  "Use of AI for video generation",
  "AI for personalization",
  "How an AI powered chatbot works?",
  "How to leverage AI to improve your productivity",
];

const AI_TOOLS = [
  "Chat GPT",
  "Gemini",
  "Sora",
  "Perplexity",
  "Others",
];

const STEP_ICONS = [
  <Users className="w-5 h-5" />,
  <Brain className="w-5 h-5" />,
  <Target className="w-5 h-5" />,
  <Star className="w-5 h-5" />,
  <BookOpen className="w-5 h-5" />,
  <Zap className="w-5 h-5" />,
];

const STEPS = [
  "Select Student",
  "AI Understanding",
  "AI Concepts",
  "Awareness Level",
  "Topics of Interest",
  "Tools Used"
];

export default function MicaAIFeedback() {
  const [step, setStep] = useState(0);
  const [student, setStudent] = useState<{ id: number; name: string } | null>(null);
  const [aiLevel, setAiLevel] = useState("");
  const [concepts, setConcepts] = useState<string[]>([]);
  const [awareness, setAwareness] = useState(5);
  const [topics, setTopics] = useState<string[]>([]);
  const [tools, setTools] = useState<string[]>([]);
  const [otherTool, setOtherTool] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleConceptChange = (concept: string) => {
    setConcepts((prev) =>
      prev.includes(concept)
        ? prev.filter((c) => c !== concept)
        : [...prev, concept]
    );
  };

  const handleTopicChange = (topic: string) => {
    setTopics((prev) =>
      prev.includes(topic)
        ? prev.filter((t) => t !== topic)
        : [...prev, topic]
    );
  };

  const handleToolChange = (tool: string) => {
    setTools((prev) =>
      prev.includes(tool)
        ? prev.filter((t) => t !== tool)
        : [...prev, tool]
    );
  };

  const handleSubmit = async () => {
    setSubmitting(true);
    const payload = {
      studentId: student?.id,
      studentName: student?.name,
      aiLevel,
      concepts,
      awareness,
      topics,
      tools,
      otherTool: tools.includes("Others") ? otherTool : undefined,
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
        toast.success("Feedback submitted successfully!");
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-3 bg-gradient-to-r from-blue-600 to-violet-600 text-white px-6 py-3 rounded-full mb-4 shadow-lg">
            <Sparkles className="w-6 h-6" />
            <h1 className="text-3xl font-bold tracking-tight">MICA AI Feedback Quiz</h1>
            <Sparkles className="w-6 h-6" />
          </div>
          <p className="text-slate-600 text-lg">Help us understand your AI knowledge journey</p>
        </div>

        {/* Progress Bar */}
        <div className="mb-10">
          <div className="flex items-center justify-between mb-2">
            {STEPS.map((stepName, index) => (
              <div key={index} className="flex flex-col items-center relative">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 ${step >= index ? 'bg-gradient-to-br from-blue-500 to-violet-500 text-white shadow-lg' : 'bg-slate-200 text-slate-500'}`}>
                  {STEP_ICONS[index]}
                </div>
                <span className={`text-sm mt-2 font-medium ${step >= index ? 'text-blue-600' : 'text-slate-400'}`}>{stepName}</span>
              </div>
            ))}
          </div>
          <div className="h-2 bg-slate-200 rounded-full overflow-hidden mt-4">
            <div 
              className="h-full bg-gradient-to-r from-blue-500 to-violet-500 transition-all duration-500 ease-out"
              style={{ width: `${getProgressPercentage()}%` }}
            />
          </div>
        </div>

        {/* Main Content */}
        <div className="bg-white rounded-2xl shadow-2xl p-8 mb-8 border border-slate-200">
          {/* Step 0 - Student Selection */}
          {step === 0 && (
            <div className="animate-fadeIn">
              <div className="flex items-center gap-3 mb-8">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-100 to-violet-100 flex items-center justify-center">
                  <Users className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-slate-800">Welcome! Let's Begin</h2>
                  <p className="text-slate-600">Please select your name from the list</p>
                </div>
              </div>
              
              <div className="relative mb-6">
                <select
                  className="w-full p-4 pl-12 bg-slate-50 border-2 border-slate-200 rounded-xl text-slate-700 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all appearance-none"
                  value={student?.id || ""}
                  onChange={(e) => {
                    const id = Number(e.target.value);
                    const found = STUDENTS.find((s) => s.id === id) || null;
                    setStudent(found);
                  }}
                >
                  <option value="">-- Select your name --</option>
                  {STUDENTS.map((s) => (
                    <option key={s.id} value={s.id}>{s.name}</option>
                  ))}
                </select>
                <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400">
                  <Users className="w-5 h-5" />
                </div>
              </div>
              
              <button
                className={`w-full py-4 rounded-xl font-semibold text-lg transition-all transform hover:scale-[1.02] ${student ? 'bg-gradient-to-r from-blue-600 to-violet-600 text-white shadow-lg hover:shadow-xl' : 'bg-slate-100 text-slate-400 cursor-not-allowed'}`}
                disabled={!student}
                onClick={() => setStep(1)}
              >
                {student ? (
                  <span className="flex items-center justify-center gap-2">
                    Continue <ChevronRight className="w-5 h-5" />
                  </span>
                ) : (
                  "Select your name to continue"
                )}
              </button>
            </div>
          )}

          {/* Step 1 - AI Understanding Level */}
          {step === 1 && (
            <div className="animate-fadeIn">
              <div className="flex items-center gap-3 mb-8">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-100 to-teal-100 flex items-center justify-center">
                  <Brain className="w-6 h-6 text-emerald-600" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-slate-800">AI Understanding Level</h2>
                  <p className="text-slate-600">How well do you understand AI concepts?</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                {AI_LEVELS.map(({ label, icon, color, description }) => (
                  <button
                    key={label}
                    className={`p-6 rounded-xl border-2 transition-all transform hover:scale-[1.02] ${aiLevel === label ? 'border-blue-500 bg-gradient-to-br from-blue-50 to-white shadow-lg' : 'border-slate-200 hover:border-blue-200'}`}
                    onClick={() => setAiLevel(label)}
                  >
                    <div className="flex items-start gap-4">
                      <span className="text-2xl">{icon}</span>
                      <div className="text-left">
                        <h3 className="font-bold text-slate-800">{label}</h3>
                        <p className="text-sm text-slate-600 mt-1">{description}</p>
                      </div>
                      {aiLevel === label && (
                        <div className="ml-auto bg-blue-500 text-white p-1 rounded-full">
                          <Check className="w-4 h-4" />
                        </div>
                      )}
                    </div>
                  </button>
                ))}
              </div>

              <div className="flex gap-4">
                <button
                  className="px-6 py-3 border-2 border-slate-200 text-slate-700 rounded-xl font-medium hover:bg-slate-50 transition-colors"
                  onClick={() => setStep(0)}
                >
                  Back
                </button>
                <button
                  className="flex-1 py-3 bg-gradient-to-r from-blue-600 to-violet-600 text-white rounded-xl font-semibold disabled:opacity-50 disabled:cursor-not-allowed transition-all transform hover:scale-[1.02]"
                  disabled={!aiLevel}
                  onClick={() => setStep(2)}
                >
                  Continue <ArrowRight className="inline ml-2 w-5 h-5" />
                </button>
              </div>
            </div>
          )}

          {/* Step 2 - AI Concepts */}
          {step === 2 && (
            <div className="animate-fadeIn">
              <div className="flex items-center gap-3 mb-8">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-100 to-orange-100 flex items-center justify-center">
                  <Target className="w-6 h-6 text-amber-600" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-slate-800">AI Concepts Knowledge</h2>
                  <p className="text-slate-600">Select all concepts you understand</p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 mb-8">
                {AI_CONCEPTS.map((concept) => {
                  const isSelected = concepts.includes(concept);
                  return (
                    <button
                      key={concept}
                      className={`p-4 rounded-xl border-2 transition-all transform hover:scale-[1.02] ${isSelected ? 'border-blue-500 bg-gradient-to-br from-blue-50 to-white shadow-lg' : 'border-slate-200 hover:border-blue-200'}`}
                      onClick={() => handleConceptChange(concept)}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-medium text-slate-800">{concept}</span>
                        {isSelected && (
                          <div className="bg-blue-500 text-white p-1 rounded-full">
                            <Check className="w-3 h-3" />
                          </div>
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>

              <div className="flex gap-4">
                <button
                  className="px-6 py-3 border-2 border-slate-200 text-slate-700 rounded-xl font-medium hover:bg-slate-50 transition-colors"
                  onClick={() => setStep(1)}
                >
                  Back
                </button>
                <button
                  className="flex-1 py-3 bg-gradient-to-r from-blue-600 to-violet-600 text-white rounded-xl font-semibold transition-all transform hover:scale-[1.02]"
                  onClick={() => setStep(3)}
                >
                  Continue <ArrowRight className="inline ml-2 w-5 h-5" />
                </button>
              </div>
            </div>
          )}

          {/* Step 3 - AI Awareness Slider */}
          {step === 3 && (
            <div className="animate-fadeIn">
              <div className="flex items-center gap-3 mb-8">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-100 to-pink-100 flex items-center justify-center">
                  <Star className="w-6 h-6 text-purple-600" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-slate-800">AI Awareness Level</h2>
                  <p className="text-slate-600">Rate your awareness on a scale of 1-10</p>
                </div>
              </div>

              <div className="mb-12">
                <div className="text-center mb-6">
                  <div className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-100 to-violet-100 px-6 py-3 rounded-full">
                    <TrendingUp className="w-5 h-5 text-blue-600" />
                    <span className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-violet-600 bg-clip-text text-transparent">
                      {awareness}
                    </span>
                    <span className="text-slate-600">/ 10</span>
                  </div>
                </div>
                
                <div className="px-4">
                  <input
                    type="range"
                    min={1}
                    max={10}
                    value={awareness}
                    onChange={(e) => setAwareness(Number(e.target.value))}
                    className="w-full h-3 bg-gradient-to-r from-blue-200 via-violet-200 to-purple-200 rounded-full appearance-none [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-8 [&::-webkit-slider-thumb]:w-8 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-gradient-to-r [&::-webkit-slider-thumb]:from-blue-600 [&::-webkit-slider-thumb]:to-violet-600 [&::-webkit-slider-thumb]:cursor-pointer [&::-webkit-slider-thumb]:shadow-lg"
                  />
                  <div className="flex justify-between text-sm text-slate-500 mt-2">
                    <span>Beginner</span>
                    <span>Expert</span>
                  </div>
                </div>
              </div>

              <div className="flex gap-4">
                <button
                  className="px-6 py-3 border-2 border-slate-200 text-slate-700 rounded-xl font-medium hover:bg-slate-50 transition-colors"
                  onClick={() => setStep(2)}
                >
                  Back
                </button>
                <button
                  className="flex-1 py-3 bg-gradient-to-r from-blue-600 to-violet-600 text-white rounded-xl font-semibold transition-all transform hover:scale-[1.02]"
                  onClick={() => setStep(4)}
                >
                  Continue <ArrowRight className="inline ml-2 w-5 h-5" />
                </button>
              </div>
            </div>
          )}

          {/* Step 4 - Topics of Interest */}
          {step === 4 && (
            <div className="animate-fadeIn">
              <div className="flex items-center gap-3 mb-8">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-green-100 to-teal-100 flex items-center justify-center">
                  <BookOpen className="w-6 h-6 text-green-600" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-slate-800">Topics of Interest</h2>
                  <p className="text-slate-600">Select topics that interest you</p>
                </div>
              </div>

              <div className="space-y-3 mb-8">
                {AI_TOPICS.map((topic) => {
                  const isSelected = topics.includes(topic);
                  return (
                    <button
                      key={topic}
                      className={`w-full p-5 rounded-xl border-2 text-left transition-all transform hover:scale-[1.01] ${isSelected ? 'border-blue-500 bg-gradient-to-r from-blue-50 to-violet-50 shadow-md' : 'border-slate-200 hover:border-blue-200'}`}
                      onClick={() => handleTopicChange(topic)}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-medium text-slate-800">{topic}</span>
                        {isSelected && (
                          <div className="bg-gradient-to-r from-blue-500 to-violet-500 text-white p-2 rounded-full">
                            <Check className="w-4 h-4" />
                          </div>
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>

              <div className="flex gap-4">
                <button
                  className="px-6 py-3 border-2 border-slate-200 text-slate-700 rounded-xl font-medium hover:bg-slate-50 transition-colors"
                  onClick={() => setStep(3)}
                >
                  Back
                </button>
                <button
                  className="flex-1 py-3 bg-gradient-to-r from-blue-600 to-violet-600 text-white rounded-xl font-semibold transition-all transform hover:scale-[1.02]"
                  onClick={() => setStep(5)}
                >
                  Continue <ArrowRight className="inline ml-2 w-5 h-5" />
                </button>
              </div>
            </div>
          )}

          {/* Step 5 - Tools Used */}
          {step === 5 && (
            <div className="animate-fadeIn">
              <div className="flex items-center gap-3 mb-8">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-orange-100 to-red-100 flex items-center justify-center">
                  <Zap className="w-6 h-6 text-orange-600" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-slate-800">AI Tools Experience</h2>
                  <p className="text-slate-600">Which AI tools have you used?</p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 mb-8">
                {AI_TOOLS.map((tool) => {
                  const isSelected = tools.includes(tool);
                  return (
                    <button
                      key={tool}
                      className={`p-5 rounded-xl border-2 transition-all transform hover:scale-[1.02] ${isSelected ? 'border-blue-500 bg-gradient-to-r from-blue-50 to-violet-50 shadow-md' : 'border-slate-200 hover:border-blue-200'}`}
                      onClick={() => handleToolChange(tool)}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-medium text-slate-800">{tool}</span>
                        {isSelected && (
                          <div className="bg-gradient-to-r from-blue-500 to-violet-500 text-white p-2 rounded-full">
                            <Check className="w-4 h-4" />
                          </div>
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>

              {tools.includes("Others") && (
                <div className="mb-8">
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Please specify other tool(s)
                  </label>
                  <input
                    type="text"
                    placeholder="e.g., Claude, Midjourney, etc."
                    value={otherTool}
                    onChange={(e) => setOtherTool(e.target.value)}
                    className="w-full p-4 border-2 border-slate-200 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all"
                  />
                </div>
              )}

              <div className="flex gap-4">
                <button
                  className="px-6 py-3 border-2 border-slate-200 text-slate-700 rounded-xl font-medium hover:bg-slate-50 transition-colors"
                  onClick={() => setStep(4)}
                >
                  Back
                </button>
                <button
                  className="flex-1 py-3 bg-gradient-to-r from-emerald-500 to-teal-600 text-white rounded-xl font-semibold disabled:opacity-50 disabled:cursor-not-allowed transition-all transform hover:scale-[1.02] hover:shadow-lg"
                  onClick={handleSubmit}
                  disabled={submitting}
                >
                  {submitting ? (
                    <span className="flex items-center justify-center gap-2">
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Submitting...
                    </span>
                  ) : (
                    <span className="flex items-center justify-center gap-2">
                      Submit Feedback <Send className="w-5 h-5" />
                    </span>
                  )}
                </button>
              </div>
            </div>
          )}

          {/* Success Screen */}
          {step === 99 && (
            <div className="text-center py-12 animate-fadeIn">
              <div className="w-24 h-24 bg-gradient-to-r from-emerald-100 to-teal-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Check className="w-12 h-12 text-emerald-600" />
              </div>
              <h2 className="text-3xl font-bold text-slate-800 mb-4">Thank You!</h2>
              <p className="text-slate-600 text-lg mb-8 max-w-md mx-auto">
                Your feedback has been successfully submitted. Your insights will help us improve the AI learning experience.
              </p>
              <div className="inline-flex items-center gap-2 bg-gradient-to-r from-emerald-50 to-teal-50 px-6 py-3 rounded-full">
                <Sparkles className="w-5 h-5 text-emerald-600" />
                <span className="text-emerald-700 font-medium">
                  Feedback ID: {Math.random().toString(36).substr(2, 9).toUpperCase()}
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="text-center text-slate-500 text-sm">
          <p>MICA AI Feedback Quiz • All responses are confidential</p>
        </div>
      </div>

      <style jsx global>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }
      `}</style>
    </div>
  );
}
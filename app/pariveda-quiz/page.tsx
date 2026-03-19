// app/quiz/page.tsx
'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'

// ============== DATA MODELS ==============
interface Question {
  id: number
  text: string
  type: 'single' | 'multi'
  graded: boolean
  options: Option[]
  correctAnswer?: string | string[]
}

interface Option {
  id: string
  text: string
}

interface User {
  _id: string
  name: string
  isGuest: boolean
}

const QUESTIONS: Question[] = [
  {
    id: 1,
    text: "How would you rate your ABM understanding?",
    type: 'single',
    graded: false,
    options: [
      { id: 'A', text: 'Novice – I have just very basic idea' },
      { id: 'B', text: 'Competent – I understand some concepts well but some I don\'t' },
      { id: 'C', text: 'Proficient – I understand most concepts but not all' },
      { id: 'D', text: 'Expert – I have mastered all ABM concepts' },
    ],
  },
  {
    id: 2,
    text: "Which of the following terms in ABM do you understand well?",
    type: 'multi',
    graded: false,
    options: [
      { id: 'A', text: 'Buying Committee' },
      { id: 'B', text: 'Customer Intent Data' },
      { id: 'C', text: 'Pipeline velocity' },
      { id: 'D', text: 'Account Scoring' },
      { id: 'E', text: 'Content Personalization' },
    ],
  },
  {
    id: 3,
    text: "Which of the following tools is NOT a part of typical ABM tech stack?",
    type: 'single',
    graded: true,
    options: [
      { id: 'A', text: '6Sense for Intent Data' },
      { id: 'B', text: 'Tableau for Data Visualization' },
      { id: 'C', text: 'Demandbase for tracking Intent Data' },
      { id: 'D', text: 'Clay for CRM data augmentation' },
      { id: 'E', text: 'Mailchimp for e-mail' },
    ],
    correctAnswer: 'E',
  },
  {
    id: 4,
    text: "When designing ABM campaigns, why is buying committee mapping critical?",
    type: 'single',
    graded: true,
    options: [
      { id: 'A', text: 'Because B2B purchase decisions involve multiple stakeholders with different concerns' },
      { id: 'B', text: 'Because marketing teams need more contacts in the CRM' },
      { id: 'C', text: 'Because procurement departments mandate it as a mandatory requirement' },
      { id: 'D', text: 'Because it reduces campaign costs by adding more target personas' },
    ],
    correctAnswer: 'A',
  },
  {
    id: 5,
    text: "In ABM, what are the three common tiers of account targeting?",
    type: 'single',
    graded: true,
    options: [
      { id: 'A', text: 'Small, Medium, Large accounts by revenue' },
      { id: 'B', text: 'Strategic, Lite and Programmatic' },
      { id: 'C', text: 'Inbound, Outbound, and Hybrid tiers' },
      { id: 'D', text: 'Awareness, Consideration, and Decision tiers' },
    ],
    correctAnswer: 'B',
  },
  {
    id: 6,
    text: "Which of the following tools would be MOST relevant to an ABM tech stack?",
    type: 'single',
    graded: true,
    options: [
      { id: 'A', text: 'A general-purpose graphic design tool like Canva' },
      { id: 'B', text: 'An ABM platform like Demandbase or 6sense that provides account identification, intent data, and targeted advertising' },
      { id: 'C', text: 'A consumer email marketing tool like Mailchimp' },
      { id: 'D', text: 'A personal project management tool like Trello or Todoist' },
    ],
    correctAnswer: 'B',
  },
  {
    id: 7,
    text: "What is the primary purpose of a 'personalized microsite' in ABM?",
    type: 'single',
    graded: true,
    options: [
      { id: 'A', text: 'To replace the company\'s main website entirely' },
      { id: 'B', text: 'To create an account-specific or industry-specific web experience that speaks directly to a target\'s needs' },
      { id: 'C', text: 'To collect as many email addresses as possible from anonymous visitors' },
      { id: 'D', text: 'To host the company\'s blog content in a different format' },
    ],
    correctAnswer: 'B',
  },
  {
    id: 8,
    text: "How does ABM differ from traditional lead generation?",
    type: 'single',
    graded: true,
    options: [
      { id: 'A', text: 'ABM targets a broader audience to generate more leads' },
      { id: 'B', text: 'ABM focuses on specific high-value accounts rather than casting a wide net' },
      { id: 'C', text: 'ABM replaces the need for a sales team entirely' },
      { id: 'D', text: 'ABM only works for B2C companies' },
      { id: 'E', text: 'All of the above points are true' },
    ],
    correctAnswer: 'B',
  },
  {
    id: 9,
    text: "Which of the following is the MOST critical success factor for ABM?",
    type: 'single',
    graded: true,
    options: [
      { id: 'A', text: 'Having the most sophisticated ABM software platform' },
      { id: 'B', text: 'Alignment between sales and marketing teams' },
      { id: 'C', text: 'Sending the highest volume of emails possible' },
      { id: 'D', text: 'Having a large social media following' },
      { id: 'E', text: 'None of these' },
    ],
    correctAnswer: 'B',
  },
]

const GRADED_QUESTIONS = QUESTIONS.filter(q => q.graded)
const NAMES = ['Neha Kalantri', 'Madeline House', 'Anabeth Fuller', 'Kate Frye', 'Hitha Gudipati', 'Guest']

// ============== API FUNCTIONS ==============
const createOrGetUser = async (name: string, isGuest: boolean) => {
  try {
    const response = await fetch('/api/guest-user', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ name, isGuest }),
    });

    const data = await response.json();
    
    if (data.success) {
      return data.data;
    } else {
      console.error('Failed to create/get user:', data.error);
      return null;
    }
  } catch (error) {
    console.error('Error creating/getting user:', error);
    return null;
  }
};

const saveQuizResponse = async (
  userId: string,
  userName: string,
  isGuest: boolean,
  answers: Record<number, any>
) => {
  try {
    const response = await fetch('/api/quiz-res', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        userId,
        userName,
        isGuest,
        answers,
      }),
    });

    const data = await response.json();
    
    if (data.success) {
      console.log('Quiz response saved successfully:', data.data);
      return data.data;
    } else {
      console.error('Failed to save quiz response:', data.error);
      return null;
    }
  } catch (error) {
    console.error('Error saving quiz response:', error);
    return null;
  }
};

// ============== PDF DOCUMENT COMPONENT ==============
const PdfReport = ({ userName, answers }: { userName: string; answers: Record<number, any> }) => {
  const [pdfModule, setPdfModule] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  
  useEffect(() => {
    import('@react-pdf/renderer').then(mod => {
      setPdfModule(mod)
      setLoading(false)
    })
  }, [])

  if (loading || !pdfModule) {
    return null
  }

  const { Document, Page, Text, View } = pdfModule

  const date = new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })

  const gradedResults = GRADED_QUESTIONS.map(q => ({
    question: q,
    userAnswer: answers[q.id],
    isCorrect: answers[q.id] === q.correctAnswer,
    correctAnswer: q.correctAnswer,
  }))

  const score = gradedResults.filter(r => r.isCorrect).length
  const totalGraded = GRADED_QUESTIONS.length

  // Styles as plain objects
  const styles = {
    page: {
      padding: 30,
      backgroundColor: '#020B39',
    },
    header: {
      flexDirection: 'row' as const,
      justifyContent: 'space-between' as const,
      alignItems: 'center' as const,
      marginBottom: 30,
      paddingBottom: 20,
      borderBottomWidth: 1,
      borderBottomColor: '#2A72F7',
    },
    title: {
      fontSize: 24,
      color: '#E2E3E8',
      fontFamily: 'Helvetica-Bold',
    },
    subtitle: {
      fontSize: 14,
      color: '#636D8C',
      marginTop: 5,
    },
    section: {
      marginBottom: 20,
    },
    sectionTitle: {
      fontSize: 18,
      color: '#2A72F7',
      marginBottom: 10,
      fontFamily: 'Helvetica-Bold',
    },
    question: {
      fontSize: 12,
      color: '#E2E3E8',
      marginBottom: 5,
    },
    answer: {
      fontSize: 10,
      color: '#636D8C',
      marginLeft: 10,
      marginBottom: 3,
    },
    correct: {
      color: '#2A72F7',
    },
    incorrect: {
      color: '#E0505D',
    },
    score: {
      fontSize: 32,
      color: '#2A72F7',
      textAlign: 'center' as const,
      marginVertical: 20,
      fontFamily: 'Helvetica-Bold',
    },
    footer: {
      position: 'absolute' as const,
      bottom: 30,
      left: 30,
      right: 30,
      textAlign: 'center' as const,
      color: '#4F556F',
      fontSize: 10,
    },
  }

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.header}>
          <View>
            <Text style={styles.title}>ABM Assessment Report</Text>
            <Text style={styles.subtitle}>{userName} • {date}</Text>
          </View>
          <Text style={styles.title}>Pariveda</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Final Score</Text>
          <Text style={styles.score}>{score}/{totalGraded}</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Non-Graded Questions</Text>
          {QUESTIONS.filter(q => !q.graded).map(q => (
            <View key={q.id} style={{ marginBottom: 10 }}>
              <Text style={styles.question}>Q{q.id}: {q.text}</Text>
              <Text style={styles.answer}>
                Answer: {Array.isArray(answers[q.id]) 
                  ? answers[q.id]?.join(', ') 
                  : q.options.find(o => o.id === answers[q.id])?.text || 'Not answered'}
              </Text>
            </View>
          ))}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Graded Questions</Text>
          {gradedResults.map((result, idx) => (
            <View key={idx} style={{ marginBottom: 10 }}>
              <Text style={styles.question}>Q{result.question.id}: {result.question.text}</Text>
              <Text style={[styles.answer, result.isCorrect ? styles.correct : styles.incorrect]}>
                Your answer: {result.question.options.find(o => o.id === result.userAnswer)?.text || 'Not answered'}
              </Text>
              {!result.isCorrect && (
                <Text style={[styles.answer, styles.correct]}>
                  Correct answer: {result.question.options.find(o => o.id === result.correctAnswer)?.text}
                </Text>
              )}
            </View>
          ))}
        </View>

        <Text style={styles.footer}>Generated by Pariveda ABM Assessment Tool</Text>
      </Page>
    </Document>
  )
}

// ============== GUEST MODAL COMPONENT ==============
const GuestNameModal = ({ onClose, onConfirm }: { onClose: () => void; onConfirm: (name: string) => void }) => {
  const [name, setName] = useState('')
  const [error, setError] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim()) {
      setError('Name is required')
      return
    }
    onConfirm(name.trim())
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#020B39]/80 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-md bg-[#16256F] rounded-[2rem] p-8 shadow-card border border-white/10">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-[#636D8C] hover:text-[#E2E3E8] transition-colors"
          aria-label="Close modal"
        >
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <h2 className="font-display text-2xl md:text-3xl mb-2 text-[#E2E3E8]">Welcome, Guest</h2>
        <p className="text-[#636D8C] mb-6">Please enter your name to continue</p>

        <form onSubmit={handleSubmit}>
          <div className="mb-6">
            <label htmlFor="guest-name" className="block text-sm font-medium text-[#E2E3E8] mb-2">
              Your Name
            </label>
            <input
              type="text"
              id="guest-name"
              value={name}
              onChange={(e) => {
                setName(e.target.value)
                setError('')
              }}
              className={`
                w-full px-4 py-3 rounded-xl
                bg-[#1A2F88] border
                text-[#E2E3E8] placeholder-[#636D8C]
                focus:outline-none focus:ring-2 focus:ring-[#2A72F7]/50
                transition-all duration-200
                ${error ? 'border-[#E0505D]' : 'border-white/10'}
              `}
              placeholder="Enter your full name"
              autoFocus
            />
            {error && (
              <p className="mt-2 text-sm text-[#E0505D]">{error}</p>
            )}
          </div>

          <div className="flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-6 py-3 rounded-xl border border-white/10 text-[#E2E3E8] hover:bg-white/5 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 px-6 py-3 rounded-xl bg-[#2A72F7] text-white font-medium hover:bg-[#2A72F7]/90 transition-colors"
            >
              Continue
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

// ============== PROGRESS BAR COMPONENT ==============
const ProgressBar = ({ progress }: { progress: number }) => (
  <div className="w-full h-2 bg-[#1A2F88] rounded-full overflow-hidden">
    <div 
      className="h-full bg-gradient-to-r from-[#2A72F7] to-[#AA5D8B] transition-all duration-500 ease-out"
      style={{ width: `${progress}%` }}
    />
  </div>
)

// ============== QUESTION CARD COMPONENT ==============
const QuestionCard = ({ 
  question, 
  selectedOption, 
  onAnswer 
}: { 
  question: Question; 
  selectedOption: any; 
  onAnswer: (answer: any) => void;
}) => {
  const handleSingleSelect = (optionId: string) => {
    onAnswer(optionId)
  }

  const handleMultiSelect = (optionId: string) => {
    const currentSelection = selectedOption || []
    const newSelection = currentSelection.includes(optionId)
      ? currentSelection.filter((id: string) => id !== optionId)
      : [...currentSelection, optionId]
    onAnswer(newSelection)
  }

  const isSelected = (optionId: string) => {
    if (question.type === 'multi') {
      return selectedOption?.includes(optionId) || false
    }
    return selectedOption === optionId
  }

  return (
    <div className="bg-[#16256F]/30 backdrop-blur-sm rounded-[2rem] p-6 md:p-8 border border-white/5 shadow-card animate-fade-in">
      <h2 className="font-display text-2xl md:text-3xl mb-8 text-[#E2E3E8]">
        {question.text}
      </h2>

      <div className="space-y-3">
        {question.options.map((option) => (
          <button
            key={option.id}
            onClick={() => question.type === 'single' 
              ? handleSingleSelect(option.id)
              : handleMultiSelect(option.id)
            }
            className={`
              w-full text-left p-4 md:p-6 rounded-2xl
              border-2 transition-all duration-200
              hover:scale-[1.02] active:scale-[0.98]
              ${isSelected(option.id)
                ? 'border-[#2A72F7] bg-[#2A72F7]/10 shadow-glow'
                : 'border-white/5 bg-[#1A2F88]/30 hover:bg-[#1A2F88]/50'
              }
            `}
          >
            <div className="flex items-start gap-4">
              <span className={`
                flex-shrink-0 w-8 h-8 rounded-lg
                flex items-center justify-center
                font-medium text-sm
                ${isSelected(option.id)
                  ? 'bg-[#2A72F7] text-white'
                  : 'bg-[#4F556F]/30 text-[#636D8C]'
                }
              `}>
                {option.id}
              </span>
              
              <span className="flex-1 text-[#E2E3E8]/90 text-base md:text-lg">
                {option.text}
              </span>

              {question.type === 'multi' && isSelected(option.id) && (
                <svg className="w-6 h-6 text-[#2A72F7] flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                </svg>
              )}
            </div>
          </button>
        ))}
      </div>

      {question.type === 'multi' && (
        <p className="mt-4 text-sm text-[#636D8C]">
          Select all that apply
        </p>
      )}
    </div>
  )
}

// ============== PDF DOWNLOAD LINK COMPONENT ==============
const PDFDownloadLinkComponent = ({ 
  document, 
  fileName, 
  children,
  className 
}: { 
  document: React.ReactElement; 
  fileName: string; 
  children: (props: { loading: boolean }) => React.ReactNode;
  className: string;
}) => {
  const [pdfModule, setPdfModule] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  
  useEffect(() => {
    import('@react-pdf/renderer').then(mod => {
      setPdfModule(mod)
      setLoading(false)
    })
  }, [])

  if (loading || !pdfModule) {
    return (
      <button className={className}>
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
        </svg>
        Loading PDF...
      </button>
    )
  }

  const { PDFDownloadLink } = pdfModule

  return (
    <PDFDownloadLink document={document} fileName={fileName} className={className}>
      {children}
    </PDFDownloadLink>
  )
}

// ============== RESULTS SCREEN ==============
const ResultsScreen = ({ 
  userName, 
  answers, 
  onRestart 
}: { 
  userName: string; 
  answers: Record<number, any>; 
  onRestart: () => void;
}) => {
  const [isClient, setIsClient] = useState(false)
  
  useEffect(() => {
    setIsClient(true)
  }, [])

  const gradedResults = GRADED_QUESTIONS.map(q => {
    const userAnswer = answers[q.id]
    const isCorrect = Array.isArray(q.correctAnswer)
      ? JSON.stringify(userAnswer?.sort()) === JSON.stringify(q.correctAnswer?.sort())
      : userAnswer === q.correctAnswer
    
    return {
      question: q,
      userAnswer,
      isCorrect,
      correctAnswer: q.correctAnswer
    }
  })

  const score = gradedResults.filter(r => r.isCorrect).length
  const totalGraded = GRADED_QUESTIONS.length

  const getScoreMessage = () => {
    if (score <= 2) return "Keep learning! ABM mastery takes time."
    if (score <= 5) return "Good foundation! You're on the right track."
    return "Excellent! You have strong ABM knowledge."
  }

  const getScoreColor = () => {
    if (score <= 2) return 'text-[#E0505D]'
    if (score <= 5) return 'text-[#FB6A31]'
    return 'text-[#2A72F7]'
  }

  return (
    <div className="max-w-3xl mx-auto">
      <div className="text-center mb-12">
        <h1 className="font-display text-4xl md:text-5xl mb-4 text-[#E2E3E8]">
          Results for <span className="text-[#2A72F7]">{userName}</span>
        </h1>
        
        <div className="inline-block bg-[#16256F]/50 backdrop-blur-sm rounded-[2rem] p-8 border border-white/5">
          <div className={`text-7xl md:text-8xl font-display mb-2 ${getScoreColor()}`}>
            {score}/{totalGraded}
          </div>
          <p className="text-xl text-[#636D8C]">
            {getScoreMessage()}
          </p>
        </div>
      </div>

      <div className="space-y-6 mb-12">
        <h2 className="font-display text-2xl mb-6 text-[#E2E3E8]">Detailed Review</h2>
        
        {gradedResults.map((result, index) => (
          <div
            key={result.question.id}
            className={`
              bg-[#16256F]/30 backdrop-blur-sm rounded-2xl p-6
              border-l-4 transition-all duration-200
              ${result.isCorrect 
                ? 'border-l-[#2A72F7] bg-[#2A72F7]/5' 
                : 'border-l-[#E0505D] bg-[#E0505D]/5'
              }
            `}
          >
            <div className="flex items-start gap-4">
              <div className={`
                flex-shrink-0 w-8 h-8 rounded-lg
                flex items-center justify-center font-bold
                ${result.isCorrect 
                  ? 'bg-[#2A72F7]/20 text-[#2A72F7]' 
                  : 'bg-[#E0505D]/20 text-[#E0505D]'
                }
              `}>
                {index + 1}
              </div>
              
              <div className="flex-1">
                <p className="font-medium mb-3 text-[#E2E3E8]">{result.question.text}</p>
                
                <div className="space-y-2 text-sm">
                  <div className="flex items-start gap-2">
                    <span className="text-[#636D8C] min-w-[80px]">Your answer:</span>
                    <span className={result.isCorrect ? 'text-[#2A72F7]' : 'text-[#E0505D]'}>
                      {Array.isArray(result.userAnswer)
                        ? result.userAnswer.map(id => 
                            result.question.options.find(o => o.id === id)?.text
                          ).join(', ')
                        : result.question.options.find(o => o.id === result.userAnswer)?.text || 'Not answered'
                      }
                    </span>
                  </div>
                  
                  {!result.isCorrect && (
                    <div className="flex items-start gap-2">
                      <span className="text-[#636D8C] min-w-[80px]">Correct:</span>
                      <span className="text-[#2A72F7]">
                        {result.question.options.find(o => o.id === result.correctAnswer)?.text}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="flex flex-col md:flex-row gap-4 justify-center">
        {isClient && (
          <PDFDownloadLinkComponent
            document={<PdfReport userName={userName} answers={answers} />}
            fileName={`abm-assessment-${userName.toLowerCase().replace(/\s+/g, '-')}.pdf`}
            className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl bg-[#2A72F7] text-white font-medium hover:bg-[#2A72F7]/90 transition-colors shadow-glow"
          >
            {({ loading }) => (
              <>
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
                {loading ? 'Generating PDF...' : 'Download PDF Report'}
              </>
            )}
          </PDFDownloadLinkComponent>
        )}

        <button
          onClick={onRestart}
          className="px-8 py-4 rounded-xl border border-white/10 text-[#E2E3E8] hover:bg-white/5 transition-colors"
        >
          Start New Assessment
        </button>
      </div>
    </div>
  )
}

// ============== MAIN PAGE COMPONENT ==============
export default function QuizPage() {
  const [currentScreen, setCurrentScreen] = useState<'name' | 'quiz' | 'results'>('name')
  const [user, setUser] = useState<User | null>(null)
  const [showGuestModal, setShowGuestModal] = useState(false)
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [answers, setAnswers] = useState<Record<number, any>>({})
  const [selectedOption, setSelectedOption] = useState<any>(null)
  const [isSaving, setIsSaving] = useState(false)

  const currentQuestion = QUESTIONS[currentQuestionIndex]
  const totalQuestions = QUESTIONS.length
  const progress = ((currentQuestionIndex + 1) / totalQuestions) * 100

  useEffect(() => {
    if (currentQuestion) {
      const savedAnswer = answers[currentQuestion.id]
      setSelectedOption(savedAnswer || null)
    }
  }, [currentQuestionIndex, currentQuestion?.id, answers])

  const handleNameSelect = async (name: string, isGuest: boolean) => {
    const userData = await createOrGetUser(name, isGuest);
    if (userData) {
      setUser({
        _id: userData._id,
        name: userData.name,
        isGuest: userData.isGuest
      });
      setCurrentScreen('quiz');
    }
  }

  const handleAnswer = (answer: any) => {
    setSelectedOption(answer)
    setAnswers(prev => ({
      ...prev,
      [currentQuestion.id]: answer
    }))
  }

  const handleNext = () => {
    if (currentQuestionIndex < totalQuestions - 1) {
      setCurrentQuestionIndex(prev => prev + 1)
    }
  }

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prev => prev - 1)
    }
  }

  // Update the handleFinish function in your quiz/page.tsx

const handleFinish = async () => {
  if (!user) return;
  
  setIsSaving(true);
  
  try {
    // Save the quiz response to database
    const savedResponse = await saveQuizResponse(
      user._id,
      user.name,
      user.isGuest,
      answers
    );
    
    if (savedResponse) {
      console.log('Quiz response saved with score:', savedResponse.score);
    }
    
    // Redirect to user detail page
    window.location.href = `/pariveda-quiz/${user._id}`;
  } catch (error) {
    console.error('Error saving quiz response:', error);
    // Still redirect even if save fails
    window.location.href = `/pariveda-quiz/${user._id}`;
  } finally {
    setIsSaving(false);
  }
};

  const handleRestart = () => {
    setUser(null)
    setCurrentScreen('name')
    setCurrentQuestionIndex(0)
    setAnswers({})
    setSelectedOption(null)
  }

  const isNextDisabled = () => {
    if (!currentQuestion) return true
    if (currentQuestion.type === 'multi') return false
    return !selectedOption
  }

  return (
    <main className="min-h-screen bg-[#020B39] relative overflow-hidden">
      {/* Background gradient shapes */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 left-0 w-[800px] h-[800px] bg-[#1A2F88] rounded-full filter blur-[120px] opacity-20 animate-float" />
        <div className="absolute bottom-0 right-0 w-[600px] h-[600px] bg-[#2A72F7] rounded-full filter blur-[100px] opacity-20 animate-float" style={{ animationDelay: '2s' }} />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[1000px] h-[1000px] bg-gradient-to-r from-[#FB6A31] via-[#E0505D] to-[#AA5D8B] rounded-full filter blur-[150px] opacity-10 animate-pulse-soft" />
      </div>

      {/* Header */}
      <header className="relative z-20 py-6 px-4 md:px-8 border-b border-white/5">
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
            
            <div className="hidden md:flex items-center gap-2">
              <span className="text-[#636D8C]/60 text-sm">ABM Mastery Assessment</span>
              <div className="h-4 w-px bg-[#4F556F] mx-2" />
              <span className="text-[#2A72F7] text-sm font-medium">Enterprise</span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="relative z-10 container mx-auto px-4 py-8 md:py-16">
        {currentScreen === 'name' && (
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="font-display text-4xl md:text-5xl lg:text-6xl mb-6 bg-gradient-to-r from-[#E2E3E8] to-[#E2E3E8]/80 bg-clip-text text-transparent">
              Select Your Name
            </h1>
            <p className="text-[#636D8C] text-lg mb-12 max-w-2xl mx-auto">
              Choose your profile to begin the ABM Mastery Assessment
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
              {NAMES.map((name, index) => (
                <button
                  key={name}
                  onClick={() => name === 'Guest' 
                    ? setShowGuestModal(true) 
                    : handleNameSelect(name, false)
                  }
                  className={`
                    group relative p-6 md:p-8 rounded-3xl
                    bg-[#16256F]/30 backdrop-blur-sm
                    border border-white/5
                    shadow-soft hover:shadow-glow
                    transition-all duration-300
                    animate-slide-up
                  `}
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-[#2A72F7]/0 via-[#2A72F7]/5 to-[#AA5D8B]/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  
                  <span className="relative z-10 text-xl md:text-2xl font-medium text-[#E2E3E8]">
                    {name}
                  </span>
                  
                  {name !== 'Guest' && (
                    <div className="absolute top-3 right-3 w-2 h-2 rounded-full bg-[#2A72F7] animate-pulse-soft" />
                  )}
                </button>
              ))}
            </div>
            
            <div className="mt-12 text-sm text-[#636D8C]">
              <span className="inline-flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[#2A72F7]"></span>
                Team members
              </span>
              <span className="inline-flex items-center gap-2 ml-6">
                <span className="w-1.5 h-1.5 rounded-full bg-[#FB6A31]"></span>
                Guest access
              </span>
            </div>
          </div>
        )}

        {currentScreen === 'quiz' && user && (
          <div className="max-w-3xl mx-auto">
            <div className="mb-8">
              <div className="flex items-center justify-between mb-4">
                <button
                  onClick={() => setCurrentScreen('name')}
                  className="text-[#636D8C] hover:text-[#E2E3E8] transition-colors flex items-center gap-2"
                >
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                  Back
                </button>
                
                <div className="text-sm text-[#636D8C]">
                  Welcome, <span className="text-[#2A72F7]">{user.name}</span>
                </div>
              </div>

              <ProgressBar progress={progress} />
              
              <div className="text-center mt-4">
                <span className="text-[#636D8C]">
                  Question {currentQuestionIndex + 1} of {totalQuestions}
                </span>
                {!currentQuestion.graded && (
                  <span className="ml-3 text-xs bg-[#AA5D8B]/20 text-[#AA5D8B] px-2 py-1 rounded-full">
                    Not graded
                  </span>
                )}
              </div>
            </div>

            <QuestionCard
              question={currentQuestion}
              selectedOption={selectedOption}
              onAnswer={handleAnswer}
            />

            <div className="fixed bottom-0 left-0 right-0 md:relative md:bottom-auto bg-[#16256F]/80 backdrop-blur-md md:bg-transparent border-t border-white/5 md:border-0 p-4 md:p-0 mt-8">
              <div className="container mx-auto max-w-3xl">
                <div className="flex gap-3 md:justify-between">
                  <button
                    onClick={handlePrevious}
                    disabled={currentQuestionIndex === 0}
                    className={`
                      flex-1 md:flex-none px-6 py-3 rounded-xl border
                      transition-all duration-200
                      ${currentQuestionIndex === 0
                        ? 'border-white/5 text-[#4F556F] cursor-not-allowed'
                        : 'border-white/10 text-[#E2E3E8] hover:bg-white/5'
                      }
                    `}
                  >
                    Previous
                  </button>
                  
                  {currentQuestionIndex === totalQuestions - 1 ? (
                    <button
                      onClick={handleFinish}
                      disabled={isSaving}
                      className={`
                        flex-1 md:flex-none px-8 py-3 rounded-xl
                        font-medium transition-all duration-200
                        bg-[#2A72F7] text-white hover:bg-[#2A72F7]/90 shadow-glow
                        disabled:bg-[#4F556F]/30 disabled:text-[#636D8C] disabled:cursor-not-allowed
                      `}
                    >
                      {isSaving ? (
                        <span className="flex items-center gap-2">
                          <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                          </svg>
                          Saving...
                        </span>
                      ) : (
                        'Finish'
                      )}
                    </button>
                  ) : (
                    <button
                      onClick={handleNext}
                      disabled={isNextDisabled()}
                      className={`
                        flex-1 md:flex-none px-8 py-3 rounded-xl
                        font-medium transition-all duration-200
                        ${isNextDisabled()
                          ? 'bg-[#4F556F]/30 text-[#636D8C] cursor-not-allowed'
                          : 'bg-[#2A72F7] text-white hover:bg-[#2A72F7]/90 shadow-glow'
                        }
                      `}
                    >
                      Next
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {currentScreen === 'results' && user && (
          <ResultsScreen
            userName={user.name}
            answers={answers}
            onRestart={handleRestart}
          />
        )}
      </div>

      {/* Footer with watermark */}
      <footer className="relative z-20 mt-auto py-8 px-4">
        <div className="container mx-auto">
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 opacity-5 pointer-events-none w-96 h-96">
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

      {/* Guest Modal */}
      {showGuestModal && (
        <GuestNameModal
          onClose={() => setShowGuestModal(false)}
          onConfirm={(name) => {
            handleNameSelect(name, true)
            setShowGuestModal(false)
          }}
        />
      )}
    </main>
  )
}
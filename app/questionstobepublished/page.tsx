"use client";
import React, { useState, useEffect, useRef } from 'react';
import confetti from 'canvas-confetti';

import NavBar from '@/components/NavBar';
import SiteFooter from '@/components/Footer';

const TOTAL_QUESTIONS = 100;
const TIMER_DURATION = 15; // seconds
const OPTIONS = ['A', 'B', 'C', 'D'];
const CORRECT_SCORE = 5;

// Pre-defined correct answers for all 100 questions (1-indexed)
const CORRECT_OPTIONS = [
  'A', 'B', 'C', 'D', 'A', 'B', 'C', 'D', 'A', 'B', // 1-10
  'C', 'D', 'A', 'B', 'C', 'D', 'A', 'B', 'C', 'D', // 11-20
  'A', 'B', 'C', 'D', 'A', 'B', 'C', 'D', 'A', 'B', // 21-30
  'C', 'D', 'A', 'B', 'C', 'D', 'A', 'B', 'C', 'D', // 31-40
  'A', 'B', 'C', 'D', 'A', 'B', 'C', 'D', 'A', 'B', // 41-50
  'C', 'D', 'A', 'B', 'C', 'D', 'A', 'B', 'C', 'D', // 51-60
  'A', 'B', 'C', 'D', 'A', 'B', 'C', 'D', 'A', 'B', // 61-70
  'C', 'D', 'A', 'B', 'C', 'D', 'A', 'B', 'C', 'D', // 71-80
  'A', 'B', 'C', 'D', 'A', 'B', 'C', 'D', 'A', 'B', // 81-90
  'C', 'D', 'A', 'B', 'C', 'D', 'A', 'B', 'C', 'D', // 91-100
];

const QuestionQuiz = () => {
  const [current, setCurrent] = useState(1);
  const [timer, setTimer] = useState(TIMER_DURATION);
  const [score, setScore] = useState(0);
  const [selected, setSelected] = useState<string | null>(null);
  const [correctOption, setCorrectOption] = useState(CORRECT_OPTIONS[0]);
  const [showResult, setShowResult] = useState(false);
  const [questionAnimation, setQuestionAnimation] = useState('fade-in');
  const [scoreAnimation, setScoreAnimation] = useState(false);
  const [isFullScreen, setIsFullScreen] = useState(false);
  const quizRef = useRef<HTMLDivElement>(null);
  const timerRef = useRef<HTMLDivElement>(null);

  // Toggle full screen
  const toggleFullScreen = () => {
    if (!document.fullscreenElement) {
      if (quizRef.current?.requestFullscreen) {
        quizRef.current.requestFullscreen();
        setIsFullScreen(true);
      }
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
        setIsFullScreen(false);
      }
    }
  };

  // Listen for full screen change
  useEffect(() => {
    const handleFullScreenChange = () => {
      setIsFullScreen(!!document.fullscreenElement);
    };

    document.addEventListener('fullscreenchange', handleFullScreenChange);
    return () => {
      document.removeEventListener('fullscreenchange', handleFullScreenChange);
    };
  }, []);

  useEffect(() => {
    if (timer === 0) {
      handleNext();
      return;
    }
    const interval = setInterval(() => {
      setTimer((t) => t - 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [timer]);

  useEffect(() => {
    // Animation for new question
    setQuestionAnimation('slide-out');
    setTimeout(() => {
      setCorrectOption(CORRECT_OPTIONS[current - 1]);
      setSelected(null);
      setTimer(TIMER_DURATION);
      setQuestionAnimation('slide-in');
    }, 300);
  }, [current]);

  const handleOptionClick = (option: string) => {
    if (selected) return;
    
    setSelected(option);
    if (option === correctOption) {
      // Add score with animation
      const newScore = score + CORRECT_SCORE;
      setScore(newScore);
      setScoreAnimation(true);
      
      // Launch confetti for correct answer
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
      });
      
      // Play success sound (optional)
      if (typeof Audio !== 'undefined') {
        const audio = new Audio('/sounds/correct.mp3'); // Add your own sound file
        audio.play().catch(() => {}); // Silent fail if no sound
      }
    } else {
      // Play wrong sound (optional)
      if (typeof Audio !== 'undefined') {
        const audio = new Audio('/sounds/wrong.mp3');
        audio.play().catch(() => {});
      }
    }
    
    setTimeout(() => {
      setScoreAnimation(false);
      handleNext();
    }, 1500);
  };

  const handleNext = () => {
    if (current < TOTAL_QUESTIONS) {
      setCurrent((c) => c + 1);
    } else {
      setShowResult(true);
    }
  };

  if (showResult) {
    return (
      <>
        <NavBar />
        <div className="min-h-screen bg-gradient-to-b from-brand-grayBg to-white flex flex-col items-center justify-center p-4">
          <div className="max-w-2xl w-full bg-white rounded-4xl shadow-brand p-8 text-center animate-fade-in">
            <div className="mb-6">
              <div className="text-6xl mb-4">🎉</div>
              <h2 className="text-3xl font-heading font-bold text-brand-tealDark mb-2">
                Quiz Complete!
              </h2>
              <p className="text-gray-600 mb-6">You did an amazing job!</p>
            </div>
            
            <div className="bg-gradient-to-r from-brand-teal to-brand-yellow p-1 rounded-2xl mb-6">
              <div className="bg-white rounded-xl p-6">
                <div className="text-sm text-gray-500 mb-2">Your Final Score</div>
                <div className="text-5xl font-bold font-heading text-brand-maroon mb-2">
                  {score}
                </div>
                <div className="text-gray-600">
                  Out of {TOTAL_QUESTIONS * CORRECT_SCORE} possible points
                </div>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4 mb-8">
              <div className="bg-brand-grayBg p-4 rounded-xl">
                <div className="text-2xl font-bold text-brand-teal">{TOTAL_QUESTIONS}</div>
                <div className="text-sm text-gray-600">Questions</div>
              </div>
              <div className="bg-brand-grayBg p-4 rounded-xl">
                <div className="text-2xl font-bold text-brand-yellow">
                  {Math.round((score / (TOTAL_QUESTIONS * CORRECT_SCORE)) * 100)}%
                </div>
                <div className="text-sm text-gray-600">Accuracy</div>
              </div>
            </div>
            
            <button
              onClick={() => window.location.reload()}
              className="bg-gradient-to-r from-brand-teal to-brand-tealDark text-white font-bold py-3 px-8 rounded-xl hover:shadow-lg transition-all duration-300 hover:scale-105"
            >
              Play Again
            </button>
          </div>
        </div>
        <SiteFooter />
      </>
    );
  }

  return (
    <>
      <NavBar />
      <div className="min-h-screen bg-gradient-to-b from-brand-grayBg to-white flex flex-col">
        {/* Full Screen Toggle Button - Fixed Position */}
        <button
          onClick={toggleFullScreen}
          className="fixed top-20 right-4 z-50 bg-gradient-to-r from-brand-teal to-brand-tealDark text-white p-2 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110"
          title={isFullScreen ? "Exit Full Screen" : "Enter Full Screen"}
        >
          {isFullScreen ? (
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 9V4.5a.5.5 0 00-.5-.5h-4a.5.5 0 00-.5.5v4a.5.5 0 00.5.5H9m6-6h4a.5.5 0 01.5.5v4a.5.5 0 01-.5.5H15m-6 6h4a.5.5 0 01.5.5v4a.5.5 0 01-.5.5h-4a.5.5 0 01-.5-.5V15" />
            </svg>
          ) : (
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-5h-4m4 0v4m0-4l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5h-4m4 0v-4m0 4l-5-5" />
            </svg>
          )}
        </button>

        {/* Progress Bar */}
        <div className="w-full bg-gray-200 h-2">
          <div 
            className="h-2 bg-gradient-to-r from-brand-teal via-brand-yellow to-brand-teal transition-all duration-1000 ease-linear"
            style={{ width: `${(current / TOTAL_QUESTIONS) * 100}%` }}
          />
        </div>

        {/* Main Quiz Container - Allow scrolling in full screen */}
        <div 
          ref={quizRef} 
          className={`flex-1 ${isFullScreen ? 'h-[calc(100vh-4rem)] overflow-y-auto' : 'flex flex-col items-center p-4 md:p-6'}`}
        >
          {/* Header with Score and Timer */}
          <div className={`flex flex-col md:flex-row justify-between items-center ${isFullScreen ? 'sticky top-0 bg-white/95 backdrop-blur-sm z-10 p-4 shadow-md' : 'w-full max-w-6xl mb-6'}`}>
            <div className="flex items-center mb-4 md:mb-0">
              <div className={`relative ${scoreAnimation ? 'animate-bounce' : ''}`}>
                <div className="bg-gradient-to-br from-brand-yellow to-brand-gold w-16 h-16 rounded-xl flex items-center justify-center shadow-soft">
                  <span className="text-2xl font-bold font-heading text-brand-maroon">
                    {score}
                  </span>
                </div>
                {scoreAnimation && (
                  <div className="absolute -top-2 -right-2 bg-brand-coral text-white text-xs px-2 py-1 rounded-full animate-ping">
                    +5
                  </div>
                )}
              </div>
              <div className="ml-4">
                <div className="text-sm text-gray-500">Current Score</div>
                <div className="text-lg font-bold font-heading text-brand-tealDark">
                  Question {current} of {TOTAL_QUESTIONS}
                </div>
              </div>
            </div>

            {/* Timer Circle */}
            <div className="relative" ref={timerRef}>
              <div className="w-24 h-24">
                <svg className="w-full h-full transform -rotate-90">
                  <circle
                    cx="48"
                    cy="48"
                    r="40"
                    stroke="#e5e7eb"
                    strokeWidth="8"
                    fill="none"
                  />
                  <circle
                    cx="48"
                    cy="48"
                    r="40"
                    stroke={timer > 10 ? "#0A8A80" : timer > 5 ? "#fddf5c" : "#E45C48"}
                    strokeWidth="8"
                    fill="none"
                    strokeDasharray={251}
                    strokeDashoffset={251 - (timer / TIMER_DURATION) * 251}
                    className="transition-all duration-1000 ease-linear"
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center">
                    <div className="text-2xl font-bold font-heading text-brand-maroon">
                      {timer}s
                    </div>
                    <div className="text-xs text-gray-500">Time Left</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Question Container - Scrollable content */}
          <div className={`${isFullScreen ? 'p-4' : 'w-full max-w-6xl'}`}>
            <div className={`bg-white rounded-4xl shadow-soft ${isFullScreen ? 'p-4 md:p-8' : 'p-4 md:p-8 mb-6'}`}>
              <div className="flex justify-center mb-4">
                <span className="bg-brand-teal text-white px-4 py-1 rounded-full text-sm font-semibold">
                  Find the Correct Answer
                </span>
              </div>
              
              {/* Image Container - Full width */}
              <div className="flex justify-center mb-8">
                <div className="relative w-full max-w-5xl h-[60vh] bg-gray-100 rounded-2xl overflow-hidden border-4 border-white shadow-brand">
                  <img
                    src={`/questions/${current}.png`}
                    alt={`Question ${current}`}
                    className="w-full h-full object-contain p-8"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = 'https://placehold.co/800x600/F5F6F7/0B3F44?text=Question+Image';
                    }}
                  />
                  <div className="absolute top-4 right-4 bg-brand-maroon text-white px-3 py-1 rounded-lg font-bold text-lg">
                    Q{current}
                  </div>
                </div>
              </div>

              {/* Options Grid - Takes full width */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-4xl mx-auto">
                {OPTIONS.map((option) => (
                  <button
                    key={option}
                    onClick={() => handleOptionClick(option)}
                    disabled={!!selected}
                    className={`
                      relative overflow-hidden
                      transition-all duration-500 transform
                      min-h-[120px]
                      ${!selected ? 'hover:scale-[1.02] hover:shadow-brand' : ''}
                      ${selected === option
                        ? option === correctOption
                          ? 'bg-gradient-to-r from-green-400 to-brand-teal text-white shadow-lg scale-[1.02]'
                          : 'bg-gradient-to-r from-red-400 to-brand-coral text-white shadow-lg scale-[1.02]'
                        : 'bg-gradient-to-b from-white to-brand-grayBg'
                      }
                      ${selected && option === correctOption && option !== selected
                        ? 'bg-gradient-to-r from-brand-teal to-green-400 text-white shadow-lg animate-pulse'
                        : ''
                      }
                      border-2
                      ${!selected ? 'border-gray-200 hover:border-brand-teal' : ''}
                      ${selected === option
                        ? option === correctOption
                          ? 'border-green-500'
                          : 'border-red-500'
                        : ''
                      }
                      rounded-2xl
                      p-6
                      text-left
                      group
                    `}
                  >
                    <div className="flex items-center justify-between h-full">
                      <div className="flex items-center">
                        <div className={`
                          w-12 h-12 rounded-xl flex items-center justify-center mr-4
                          ${selected === option
                            ? option === correctOption
                              ? 'bg-white text-green-600'
                              : 'bg-white text-red-600'
                            : 'bg-gradient-to-br from-brand-teal to-brand-tealDark text-white'
                          }
                          ${selected && option === correctOption && option !== selected
                            ? 'bg-white text-green-600 animate-pulse'
                            : ''
                          }
                          font-bold text-xl shadow-md
                        `}>
                          {option}
                        </div>
                        <div className="text-lg font-semibold font-heading">
                          Option {option}
                        </div>
                      </div>
                      
                      {/* Feedback Icon */}
                      {selected && option === selected && (
                        <div className="ml-4">
                          {option === correctOption ? (
                            <div className="text-3xl animate-bounce">✅</div>
                          ) : (
                            <div className="text-3xl animate-bounce">❌</div>
                          )}
                        </div>
                      )}
                      
                      {/* Correct Answer Indicator */}
                      {selected && option === correctOption && option !== selected && (
                        <div className="ml-4 text-3xl animate-pulse">
                          ✓
                        </div>
                      )}
                    </div>
                  </button>
                ))}
              </div>

              {/* Instructions */}
              {!selected && (
                <div className="text-center mt-8 text-gray-500 text-sm">
                  ⚡ Click an option to answer! Correct answers earn +{CORRECT_SCORE} points
                </div>
              )}
            </div>
          </div>

          {/* Next Question Button - Fixed at bottom in full screen */}
          {selected && (
            <div className={`${isFullScreen ? 'sticky bottom-0 bg-white/95 backdrop-blur-sm z-10 p-4 shadow-lg' : ''}`}>
              <div className={`${isFullScreen ? 'max-w-4xl mx-auto' : ''}`}>
                <button
                  onClick={handleNext}
                  className={`bg-gradient-to-r from-brand-maroon to-brand-pink text-white font-bold py-3 px-8 rounded-xl shadow-brand hover:shadow-lg transition-all duration-300 hover:scale-105 animate-fade-in
                    ${isFullScreen ? 'w-full' : ''}
                  `}
                >
                  {current < TOTAL_QUESTIONS ? 'Next Question →' : 'See Results'}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
      <SiteFooter />
      
      <style jsx global>{`
        @keyframes slide-in {
          from {
            opacity: 0;
            transform: translateX(30px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
        
        @keyframes slide-out {
          from {
            opacity: 1;
            transform: translateX(0);
          }
          to {
            opacity: 0;
            transform: translateX(-30px);
          }
        }
        
        .animate-slide-in {
          animation: slide-in 0.3s ease-out forwards;
        }
        
        .animate-slide-out {
          animation: slide-out 0.3s ease-out forwards;
        }
        
        .animate-fade-in {
          animation: fadeIn 0.5s ease-out;
        }
        
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        
        @keyframes bounce {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }
        
        .animate-bounce {
          animation: bounce 0.5s ease infinite;
        }
        
        @keyframes ping {
          75%, 100% {
            transform: scale(2);
            opacity: 0;
          }
        }
        
        .animate-ping {
          animation: ping 1s cubic-bezier(0, 0, 0.2, 1) infinite;
        }
        
        .animate-pulse {
          animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
        }
        
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
        
        /* Full screen styles - ALLOW SCROLLING */
        :fullscreen {
          background: linear-gradient(to bottom, #F5F6F7, #FFFFFF);
        }
        
        :fullscreen .min-h-screen {
          min-height: 100vh;
        }
        
        /* Sticky header in full screen */
        :fullscreen .sticky {
          position: -webkit-sticky;
          position: sticky;
        }
      `}</style>
    </>
  );
};

export default QuestionQuiz;
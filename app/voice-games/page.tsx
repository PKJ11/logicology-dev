"use client";

import React from "react";
import Link from "next/link";
import { Mic, Calculator, Copy } from "lucide-react";
import NavBar from "@/components/NavBar";
import Footer from "@/components/Footer";

export default function VoiceGamesHub() {
  return (
    <>
      <NavBar />
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 py-12">
        <div className="max-w-6xl mx-auto px-4">
          {/* Header */}
          <div className="text-center mb-16">
            <h1 className="text-5xl font-bold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
              Voice Games 🎤
            </h1>
            <p className="text-xl text-gray-700">
              Practice math skills with voice interaction. Speak your answers and get instant feedback!
            </p>
          </div>

          {/* Games Grid */}
          <div className="grid md:grid-cols-2 gap-8 mb-12">
            {/* Digit Sum Game Card */}
            <Link href="/voice-games/digit-sum">
              <div className="h-full bg-white rounded-2xl shadow-lg hover:shadow-2xl hover:scale-105 transition-all cursor-pointer overflow-hidden group">
                <div className="bg-gradient-to-br from-blue-400 to-blue-600 p-8 text-white">
                  <div className="flex items-center justify-center gap-3 mb-4">
                    <Calculator className="w-12 h-12" />
                    <Mic className="w-12 h-12" />
                  </div>
                  <h2 className="text-3xl font-bold text-center mb-2">Digit Sum Game</h2>
                </div>
                <div className="p-8">
                  <p className="text-gray-700 mb-6 text-lg">
                    Listen to numbers and speak their sum! 🔢➕
                  </p>
                  <div className="space-y-3 mb-6">
                    <div className="flex items-center gap-2 text-gray-600">
                      <span className="text-blue-600 font-bold">✓</span>
                      Medium: Add 2 numbers (1-100)
                    </div>
                    <div className="flex items-center gap-2 text-gray-600">
                      <span className="text-blue-600 font-bold">✓</span>
                      Normal & Speed modes
                    </div>
                    <div className="flex items-center gap-2 text-gray-600">
                      <span className="text-blue-600 font-bold">✓</span>
                      Score tracking & streaks
                    </div>
                  </div>
                  <button className="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white py-3 rounded-lg font-bold transition-all transform group-hover:scale-105">
                    Play Now →
                  </button>
                </div>
              </div>
            </Link>

            {/* Table Challenge Card */}
            <Link href="/voice-games/table-challenge">
              <div className="h-full bg-white rounded-2xl shadow-lg hover:shadow-2xl hover:scale-105 transition-all cursor-pointer overflow-hidden group">
                <div className="bg-gradient-to-br from-purple-400 to-purple-600 p-8 text-white">
                  <div className="flex items-center justify-center gap-3 mb-4">
                    <Copy className="w-12 h-12" />
                    <Mic className="w-12 h-12" />
                  </div>
                  <h2 className="text-3xl font-bold text-center mb-2">Table Challenge</h2>
                </div>
                <div className="p-8">
                  <p className="text-gray-700 mb-6 text-lg">
                    Master multiplication tables with voice answers! ✖️📊
                  </p>
                  <div className="space-y-3 mb-6">
                    <div className="flex items-center gap-2 text-gray-600">
                      <span className="text-purple-600 font-bold">✓</span>
                      Tables 1-20
                    </div>
                    <div className="flex items-center gap-2 text-gray-600">
                      <span className="text-purple-600 font-bold">✓</span>
                      Easy, Medium & Hard levels
                    </div>
                    <div className="flex items-center gap-2 text-gray-600">
                      <span className="text-purple-600 font-bold">✓</span>
                      Real-time score & accuracy tracking
                    </div>
                  </div>
                  <button className="w-full bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white py-3 rounded-lg font-bold transition-all transform group-hover:scale-105">
                    Play Now →
                  </button>
                </div>
              </div>
            </Link>
          </div>

          {/* Features Section */}
          <div className="bg-white rounded-2xl shadow-lg p-12">
            <h2 className="text-3xl font-bold mb-8 text-center text-gray-800">Key Features</h2>
            <div className="grid md:grid-cols-2 gap-8">
              <div className="space-y-4">
                <h3 className="text-xl font-bold text-blue-600 flex items-center gap-2">
                  <Mic className="w-6 h-6" /> Voice Recognition
                </h3>
                <p className="text-gray-700">
                  Speak your answers naturally. Advanced speech recognition converts your voice to text and validates your answer.
                </p>
              </div>

              <div className="space-y-4">
                <h3 className="text-xl font-bold text-purple-600 flex items-center gap-2">
                  <Calculator className="w-6 h-6" /> Multiple Difficulties
                </h3>
                <p className="text-gray-700">
                  Choose from Easy, Medium, and Hard levels to match your skill level and progressively improve.
                </p>
              </div>

              <div className="space-y-4">
                <h3 className="text-xl font-bold text-green-600 flex items-center gap-2">
                  ⚡ Speed Mode
                </h3>
                <p className="text-gray-700">
                  Race against the clock! Answer questions within 30 seconds and earn bonus points for speed.
                </p>
              </div>

              <div className="space-y-4">
                <h3 className="text-xl font-bold text-orange-600 flex items-center gap-2">
                  🏆 Instant Feedback
                </h3>
                <p className="text-gray-700">
                  Get immediate feedback on your answers with encouraging messages, streak counters, and score tracking.
                </p>
              </div>
            </div>
          </div>

          {/* How to Play */}
          <div className="mt-12 bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl p-12">
            <h2 className="text-3xl font-bold mb-8 text-gray-800">How to Play</h2>
            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="bg-blue-600 text-white rounded-full w-10 h-10 flex items-center justify-center font-bold flex-shrink-0">
                  1
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-800 mb-2">Select Your Game</h3>
                  <p className="text-gray-700">
                    Choose between Digit Sum Game or Table Challenge
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="bg-blue-600 text-white rounded-full w-10 h-10 flex items-center justify-center font-bold flex-shrink-0">
                  2
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-800 mb-2">Pick Difficulty & Mode</h3>
                  <p className="text-gray-700">
                    Choose your difficulty level (Easy, Medium, Hard) and game mode (Normal or Speed)
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="bg-blue-600 text-white rounded-full w-10 h-10 flex items-center justify-center font-bold flex-shrink-0">
                  3
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-800 mb-2">Read or Hear the Question</h3>
                  <p className="text-gray-700">
                    Questions are displayed on screen. You can click the speaker icon to hear them read aloud.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="bg-blue-600 text-white rounded-full w-10 h-10 flex items-center justify-center font-bold flex-shrink-0">
                  4
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-800 mb-2">Speak Your Answer</h3>
                  <p className="text-gray-700">
                    Click the microphone button and clearly speak your answer. Your voice will be transcribed.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="bg-blue-600 text-white rounded-full w-10 h-10 flex items-center justify-center font-bold flex-shrink-0">
                  5
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-800 mb-2">Get Instant Feedback</h3>
                  <p className="text-gray-700">
                    See if you're correct or incorrect. Track your score, streak, and accuracy in real-time.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}

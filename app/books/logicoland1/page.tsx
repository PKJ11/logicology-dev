"use client";

import Image from 'next/image';
import Link from 'next/link';
import NavBar from '@/components/NavBar';
import { useState, useRef } from 'react';
import CommunitySignupModal from '@/components/CommunitySignupModal';

export default function Logicoland1Page() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const toggleFullscreen = () => {
    if (!videoRef.current) return;

    if (!document.fullscreenElement) {
      videoRef.current.requestFullscreen().catch(err => {
        console.error(`Error attempting to enable fullscreen: ${err.message}`);
      });
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  return (
    <>
      <NavBar />
      
      <div className="min-h-screen text-brand-tealDark bg-brand-grayBg">
        {/* Hero Section - Full width video */}
        <section className="w-full relative">
          <div className="relative w-full h-[60vh] min-h-[400px] max-h-[800px] bg-black">
            <video
              ref={videoRef}
              autoPlay
              loop
              muted
              playsInline
              className="w-full h-full object-cover"
            >
              <source 
                src="https://ik.imagekit.io/pratik2002/Logicoland%201_3.mp4?updatedAt=1755475486495" 
                type="video/mp4" 
              />
              Your browser does not support the video tag.
            </video>
            
            {/* Fullscreen toggle button */}
            <button
              onClick={toggleFullscreen}
              className="absolute bottom-4 right-4 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition-colors"
              aria-label={isFullscreen ? "Exit fullscreen" : "Enter fullscreen"}
            >
              {isFullscreen ? (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 16h12v4H6zm4-4V8m0 0H6m4 0h4" />
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8h4V4m12 4h-4V4M4 16h4v4m12-4h-4v4" />
                </svg>
              )}
            </button>
          </div>
        </section>

        {/* Content Section */}
        <section className="max-w-6xl mx-auto px-6 py-12 sm:py-16 md:py-20">
          <div className="grid md:grid-cols-2 gap-12">
            {/* Left column - Features */}
            <div>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-brand-teal mb-8">
                What's Inside Logicoland?
              </h2>
              
              <ul className="space-y-6">
                <li className="flex items-start">
                  <span className="text-2xl mr-4 text-brand-coral">🧩</span>
                  <div>
                    <h3 className="text-xl font-bold text-brand-tealDark mb-1">
                      Logic through coloring
                    </h3>
                    <p className="text-brand-tealDark/80">
                      Each puzzle must be solved to know what and where to color!
                    </p>
                  </div>
                </li>
                
                <li className="flex items-start">
                  <span className="text-2xl mr-4 text-brand-coral">🎨</span>
                  <div>
                    <h3 className="text-xl font-bold text-brand-tealDark mb-1">
                      50+ unique brain-boosting challenges
                    </h3>
                    <p className="text-brand-tealDark/80">
                      That blend logic puzzles with creative coloring fun
                    </p>
                  </div>
                </li>
                
                <li className="flex items-start">
                  <span className="text-2xl mr-4 text-brand-coral">🔢</span>
                  <div>
                    <h3 className="text-xl font-bold text-brand-tealDark mb-1">
                      Intro to Sudoku
                    </h3>
                    <p className="text-brand-tealDark/80">
                      A playful and visual way to ease kids into grid-based thinking
                    </p>
                  </div>
                </li>
                
                <li className="flex items-start">
                  <span className="text-2xl mr-4 text-brand-coral">📚</span>
                  <div>
                    <h3 className="text-xl font-bold text-brand-tealDark mb-1">
                      Skill-building disguised as fun
                    </h3>
                    <p className="text-brand-tealDark/80">
                      Sharpens deduction, focus, and pattern recognition
                    </p>
                  </div>
                </li>
                
                <li className="flex items-start">
                  <span className="text-2xl mr-4 text-brand-coral">🚀</span>
                  <div>
                    <h3 className="text-xl font-bold text-brand-tealDark mb-1">
                      Perfect for ages 6–12
                    </h3>
                    <p className="text-brand-tealDark/80">
                      Great for home learning, travel, or screen-free entertainment
                    </p>
                  </div>
                </li>
              </ul>
            </div>
            
            {/* Right column - Community CTA */}
            <div className="bg-white rounded-4xl p-8 shadow-soft h-fit sticky top-8">
              <div className="text-center">
                <h3 className="text-2xl font-bold text-brand-teal mb-4">
                  Join Our Learning Community
                </h3>
                <p className="text-brand-tealDark/80 mb-6">
                  Connect with other parents and educators to share tips and get support on making learning fun!
                </p>
                <button
                  onClick={() => setIsModalOpen(true)}
                  className="inline-block bg-brand-coral hover:bg-[#d55241] text-white font-bold py-3 px-8 rounded-2xl transition-colors"
                >
                  Join Now
                </button>
              </div>
            </div>
          </div>
        </section>
      </div>

      {/* Community Signup Modal */}
      <CommunitySignupModal 
        open={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
      />
    </>
  );
}
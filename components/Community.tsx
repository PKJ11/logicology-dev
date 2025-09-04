"use client";
import { useState } from 'react';
import CommunitySignupModal from './CommunitySignupModal'; // Adjust the path as needed
import MediaLayout from "./MediaLayout";

// --------------------- Community ---------------------
export default function Community() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  return (
    <section id="community" className="w-full bg-brand-teal">
      <div className="lg:max-w-[80vw] mx-auto">
        <div className="text-white overflow-hidden py-12">
          {/* Flex container replacing grid */}
          <div className="flex flex-col md:flex-row items-center">
            {/* MediaLayout on left for larger screens, top for mobile */}
            <div className="w-full md:w-1/2 order-1 md:order-1 flex justify-center items-center py-6 md:py-0">
              <MediaLayout
                image="https://images.unsplash.com/photo-1543269664-76bc3997d9ea?q=80&w=1200&auto=format&fit=crop"
                videoSrc="https://ik.imagekit.io/pratik2002/Prime%20Numbers%20(Reel%202)_1.mp4?updatedAt=1756253537445"
              />
            </div>

            {/* Content on right for larger screens, bottom for mobile */}
            <div className="w-full md:w-1/2 p-8 sm:p-12 order-2 md:order-2">
              <h2 className="text-3xl font-bold">Join the Community</h2>
              <p className="mt-3 text-white/90 max-w-prose">
                A makers' community for smart learning fun. Share house rules, new
                modes, and tournament ideas.
              </p>
              <div className="mt-6">
                <button
                  onClick={() => setIsModalOpen(true)}
                  className="rounded-full bg-white/10 px-5 py-3 font-medium hover:bg-white/15 transition-colors"
                >
                  Join Now
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <CommunitySignupModal 
        open={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
      />
    </section>
  );
}
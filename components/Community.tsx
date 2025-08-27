"use client";
import { useState } from 'react';
import CommunitySignupModal from './CommunitySignupModal'; // Adjust the path as needed

// --------------------- Community ---------------------
export default function Community() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  return (
    <section id="community" className="bg-brand-teal">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid md:grid-cols-[1fr,1.2fr] gap-10 items-center">
          <div className="max-w-md mx-auto md:mx-0 w-full">
            <div className="rounded-4xl overflow-hidden shadow-brand ring-1 ring-black/10">
              <div className="aspect-[4/3] bg-[url('https://images.unsplash.com/photo-1543269664-76bc3997d9ea?q=80&w=1200&auto=format&fit=crop')] bg-cover bg-center" />
            </div>
          </div>
          <div className="text-white">
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
      
      <CommunitySignupModal 
        open={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
      />
    </section>
  );
}
"use client";
import { useState } from "react";
import CommunitySignupModal from "./CommunitySignupModal"; // Adjust the path as needed
import MediaLayout from "./MediaLayout";

export default function Tribe() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <section id="community" className="w-full bg-brand-teal">
      <div className="mx-auto lg:max-w-[80vw]">
        <div className="overflow-hidden py-12 text-white">
          <div className="flex flex-col items-center md:flex-row">
            {/* MediaLayout on left */}
            <div className="flex w-full items-center justify-center py-6 md:w-1/2 md:py-0">
              <MediaLayout
                image="https://ik.imagekit.io/pratik11/FOLD-4.1-COMMUNITY-IMAGE.png?updatedAt=1757748945765"
                videoSrc=""
              />
            </div>

            {/* Content on right */}
            <div className="w-full p-8 sm:p-12 md:w-1/2">
              <h2 className="headingstyle font-extrabold">Our Tribe</h2>
              <p className="textstyles mt-3 max-w-prose text-white/90">
                A community of parents and learners who believe in developing conceptual thinking
                using gamified content that is engaging and fun&nbsp;to&nbsp;learn.
              </p>
              <div className="mt-6">
                <button
                  className="group inline-flex max-w-[220px] items-center justify-center gap-2 rounded-full border-2 border-white bg-transparent px-6 py-3 text-[16px] font-semibold text-white transition-colors hover:bg-white hover:text-brand-teal focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-coral/40 active:scale-[.99]"
                  onClick={() => setIsModalOpen(true)}
                >
                  Join Now
                  <svg
                    className="h-4 w-4 transition-transform group-hover:translate-x-1"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
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
          </div>
        </div>
      </div>

      <CommunitySignupModal open={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </section>
  );
}

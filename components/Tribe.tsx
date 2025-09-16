"use client";
import { useState } from "react";
import CommunitySignupModal from "./CommunitySignupModal"; // Adjust the path as needed
import MediaLayout from "./MediaLayout";

export default function Tribe() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <section id="community" className="w-full bg-brand-teal">
      <div className="lg:max-w-[80vw] mx-auto">
        <div className="text-white overflow-hidden py-12">
          <div className="flex flex-col md:flex-row items-center">
            {/* MediaLayout on left */}
            <div className="w-full md:w-1/2 flex justify-center items-center py-6 md:py-0">
              <MediaLayout
                image="https://ik.imagekit.io/pratik11/FOLD-4.1-COMMUNITY-IMAGE.png?updatedAt=1757748945765"
                videoSrc=""
              />
            </div>

            {/* Content on right */}
            <div className="w-full md:w-1/2 p-8 sm:p-12">
              <h2 className="headingstyle font-extrabold">
                Our Tribe
              </h2>
              <p className="textstyles mt-3 text-white/90 max-w-prose">
                A community of parents and learners who believe in developing
                conceptual thinking using gamified content that is engaging and
                fun&nbsp;to&nbsp;learn.
              </p>
              <div className="mt-6">
                <button
                  className="text-[16px] group inline-flex items-center justify-center gap-2 max-w-[220px]
             rounded-full border-2 border-white bg-transparent
             px-6 py-3 font-semibold text-white
             transition-colors hover:bg-white hover:text-brand-teal
             focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-coral/40
             active:scale-[.99]"
                  onClick={() => setIsModalOpen(true)}
                >
                  Join Now
                  <svg
                    className="w-4 h-4 transition-transform group-hover:translate-x-1"
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

      <CommunitySignupModal
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </section>
  );
}

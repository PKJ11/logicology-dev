"use client";
import { useState } from "react";
import CommunitySignupModal from "./CommunitySignupModal"; // Adjust the path as needed
import MediaLayout from "./MediaLayout";
import CTAButton from "./CTAButton";

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
                image="https://ik.imagekit.io/pratik2002/community-img.png?updatedAt=1757216326184"
                videoSrc="https://ik.imagekit.io/pratik2002/Prime%20Numbers%20(Reel%202)_1.mp4?updatedAt=1756253537445"
              />
            </div>

            {/* Content on right for larger screens, bottom for mobile */}
            <div className="w-full md:w-1/2 p-8 sm:p-12 order-2 md:order-2">
              <h2 className="headingstyle font-extrabold ">Join the Community</h2>
              <p className="textstyles mt-3 text-white/90 max-w-prose">
                A makers' community for smart learning fun. Share house rules,
                new modes, and tournament ideas.
              </p>
              <div className="mt-6">
                <CTAButton
                  text="Join Community"
                  href=""
                  onClick={() => setIsModalOpen(true)}
                  bg="#FFFFFF"
                  color="#0A8A80" // brand teal text
                  hoverBg="#FFFFFF" // brand teal bg on hover
                  hoverColor="#0A8A80" // white text on hover
                  size="md"
                  rightIcon={
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
                  }
                />
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

"use client";
import { useState } from "react";
import CTAButton from "./CTAButton";
import MediaLayoutRight from "./MediaLayoutRight";
import VideoModal from "./VideoModal";

export default function WhyImportant() {
  const [open, setOpen] = useState(false);

  const YT = "https://youtu.be/oLktBpxN6qw?si=AVuR7nCiCqaA4HHG";

  return (
    <section id="why" className="mt-10 w-full bg-[#D8AE4F]">
      <div className="mx-auto lg:max-w-[80vw]">
        <div className="overflow-hidden py-12 text-[#3F2F14]">
          <div className="flex flex-col items-center md:flex-row">
            {/* Media (left) */}
            <div className="order-1 flex w-full items-center justify-center py-6 md:order-1 md:w-1/2 md:py-0">
              <MediaLayoutRight
                image="https://ik.imagekit.io/pratik11/WHY-LOGICOLOGY.png?updatedAt=1758439747708"
                videoSrc="https://ik.imagekit.io/pratik11/Kartik%20-%20Philosophy.mp4?updatedAt=1758433043493"
              />
            </div>

            {/* Content (right) */}
            <div className="order-2 w-full p-8 sm:p-12 md:order-2 md:w-1/2">
              <p className="headingstyle font-heading text-[#3F2F14]">Why Logicology?</p>
              <p className="textstyles mt-4 max-w-xl font-sans">
                Children learn the best when they are engaged. Our thoroughly researched and tested
                content is crafted to engage children. Gamification helps children learn in a fun
                way. At Logicology we want to make learning fun and engaging—that&apos;s why we exist.
              </p>

              <div className="mt-6">
                {/* If CTAButton supports onClick, use it and omit href */}
                <CTAButton
                  text="Learn more"
                  onClick={() => setOpen(true)}
                  bg="#FFFFFF"
                  color="#7E5C2E"
                  hoverBg="#7E5C2E"
                  hoverColor="#FFFFFF"
                  size="md"
                  ariaLabel="Open Why Logicology video"
                  rightIcon={
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
                  }
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modal */}
      <VideoModal
        open={open}
        onClose={() => setOpen(false)}
        youtubeUrl={YT}
        title="Why Logicology?"
      />
    </section>
  );
}

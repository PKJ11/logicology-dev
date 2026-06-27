"use client";
import { useState } from "react";
import CommunitySignupModal from "./CommunitySignupModal";
import MediaLayout from "./MediaLayout";
import CTAButton from "./CTAButton";

export default function Community() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <section id="community" className="w-full bg-brand-teal">
      <div className="px-4 md:mx-auto md:max-w-[75vw] lg:mx-auto lg:max-w-[75vw] lg:px-8">
        <div className="overflow-hidden py-12 text-white">
          <div className="flex flex-col items-center md:flex-row">
            <div className="order-1 flex w-full items-center py-6 md:order-1 md:w-1/2 md:py-0">
              <MediaLayout image="https://ik.imagekit.io/pratik11/COMMUNITY.png" videoSrc="" />
            </div>

            <div className="order-2 w-full p-8 sm:p-12 md:order-2 md:w-1/2 text-center lg:text-left">
              <h2 className="headingstyle font-heading">
                Join the <br /> fun-learning revolution.
              </h2>
              <p className="textstyles mt-3 max-w-prose text-white/90">
                Parents and learners who'd rather build thinkers than memorize facts. Free
                printables, early access and access to like-minded people.
              </p>
              <div className="mt-6">
                <button
                  onClick={() => setIsModalOpen(true)}
                  style={{
                    ["--btn-bg" as any]: "#fbb041",
                    ["--btn-color" as any]: "#3d3b40",
                    ["--btn-hover-bg" as any]: "#fa9e15",
                    ["--btn-hover-color" as any]: "#3d3b40",
                    boxShadow: "0 4px 16px rgba(251,176,65,0.35)",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.boxShadow = "0 6px 20px rgba(250,158,21,0.4)";
                    e.currentTarget.style.transform = "scale(1.05)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.boxShadow = "0 4px 16px rgba(251,176,65,0.35)";
                    e.currentTarget.style.transform = "scale(1)";
                  }}
                  onMouseDown={(e) => {
                    e.currentTarget.style.transform = "scale(0.95)";
                  }}
                  onMouseUp={(e) => {
                    e.currentTarget.style.transform = "scale(1.05)";
                  }}
                  className="ease inline-flex items-center justify-center gap-2 rounded-full border-2 border-transparent bg-[var(--btn-bg)] px-6 py-3 text-base font-medium text-[var(--btn-color)] transition-all duration-300 hover:bg-[var(--btn-hover-bg)] hover:text-[var(--btn-hover-color)] focus:outline-none focus:ring-2 focus:ring-white/70"
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

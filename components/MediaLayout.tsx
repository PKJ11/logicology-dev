"use client";

import Image from "next/image";
import { useState, useRef } from "react";

export default function MediaLayout({ videoSrc, image }: { videoSrc: string; image: string }) {
  const [isVideoExpanded, setIsVideoExpanded] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  const handleVideoToggle = () => {
    if (!isVideoExpanded) {
      // Expanding - play the video
      setIsVideoExpanded(true);
      if (videoRef.current) {
        videoRef.current.play().catch(console.error);
      }
    } else {
      // Collapsing - pause the video
      if (videoRef.current) {
        videoRef.current.pause();
        videoRef.current.currentTime = 0; // Reset to beginning
      }
      setIsVideoExpanded(false);
    }
  };

  // Check if videoSrc is provided and not empty
  const hasVideo = videoSrc && videoSrc.trim() !== "";

  return (
    <div className="relative mx-2 my-2 aspect-square max-h-[500px] w-[95%] max-w-[500px]">
      {/* Main content container */}
      <div className="h-full rounded-[28px] bg-white p-4 shadow-lg sm:p-5 md:p-6">
        <div className="relative h-full overflow-hidden rounded-[22px]">
          <div className="relative h-full w-full">
            <Image
              src={image}
              alt="Main visual"
              fill
              className="object-cover"
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 90vw, 980px"
              priority
            />
          </div>
        </div>
      </div>

      {/* Video container - only show if videoSrc exists */}
      {hasVideo && (
        <div
          className={`absolute left-0 top-0 z-20 transition-all duration-500 ease-in-out ${
            isVideoExpanded
              ? "h-full w-full !rounded-[22px]"
              : "rounded-br-[22px] rounded-tl-[22px]"
          } aspect-square cursor-pointer overflow-hidden bg-white p-5`}
          onClick={handleVideoToggle}
        >
          <div
            className={`overflow-hidden rounded-[18px] transition-all duration-500 ease-in-out ${
              isVideoExpanded ? "h-full w-full" : "w-40 sm:w-56"
            } aspect-square bg-white`}
          >
            <video
              ref={videoRef}
              src={videoSrc}
              muted
              loop
              playsInline
              className="h-full w-full object-cover"
              // Initially paused (no autoPlay attribute)
            />

            {/* Play/Close button overlay */}
            <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-0 transition-all duration-300">
              <div
                className={`flex items-center justify-center rounded-full bg-white bg-opacity-90 transition-all duration-300 ${
                  isVideoExpanded
                    ? "h-16 w-16 opacity-100"
                    : "h-12 w-12 opacity-0 hover:opacity-100"
                } `}
              >
                {isVideoExpanded ? (
                  <svg className="h-8 w-8 text-gray-800" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" />
                  </svg>
                ) : (
                  <svg
                    className="ml-1 h-6 w-6 text-gray-800"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                  >
                    <path d="M8 5v14l11-7z" />
                  </svg>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

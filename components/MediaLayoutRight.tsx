"use client";

import Image from "next/image";
import { useState, useRef, useEffect } from "react";

export default function MediaLayoutRight({ videoSrc, image }: { videoSrc: string; image: string }) {
  const [isVideoExpanded, setIsVideoExpanded] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const [showCenterClose, setShowCenterClose] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    let timeoutId: NodeJS.Timeout;

    if (isVideoExpanded) {
      // Show center close button initially
      setShowCenterClose(true);

      // Hide it after 2 seconds
      timeoutId = setTimeout(() => {
        setShowCenterClose(false);
      }, 2000);
    } else {
      // Reset when video is collapsed
      setShowCenterClose(false);
    }

    return () => {
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, [isVideoExpanded]);

  const handleVideoToggle = () => {
    if (isAnimating) return;

    if (!isVideoExpanded) {
      // Expanding - play the video
      setIsAnimating(true);
      setIsVideoExpanded(true);
      if (videoRef.current) {
        videoRef.current.play().catch(console.error);
      }
      // Reset animation state after transition completes
      setTimeout(() => setIsAnimating(false), 500);
    } else {
      // Collapsing - pause the video
      setIsAnimating(true);
      if (videoRef.current) {
        videoRef.current.pause();
        videoRef.current.currentTime = 0;
      }
      setIsVideoExpanded(false);
      // Reset animation state after transition completes
      setTimeout(() => setIsAnimating(false), 500);
    }
  };

  const handleVideoHover = () => {
    if (isVideoExpanded) {
      setShowCenterClose(true);
    }
  };

  const handleVideoLeave = () => {
    if (isVideoExpanded) {
      // Hide after a short delay when mouse leaves
      setTimeout(() => {
        setShowCenterClose(false);
      }, 1000);
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
          className={`absolute right-0 top-0 z-20 cursor-pointer overflow-hidden bg-white p-5 ${
            isVideoExpanded
              ? "h-full w-full rounded-[22px]"
              : "h-1/2 w-1/2 rounded-bl-[22px] rounded-tr-[22px]"
          } transition-all duration-500 ease-in-out`}
          onClick={handleVideoToggle}
          onMouseEnter={handleVideoHover}
          onMouseLeave={handleVideoLeave}
        >
          <div
            className={`relative h-full w-full overflow-hidden rounded-[18px] transition-all duration-500 ease-in-out ${
              isVideoExpanded ? "scale-100" : "scale-100"
            }`}
          >
            <video
              ref={videoRef}
              src={videoSrc}
              muted
              loop
              playsInline
              className="h-full w-full object-cover"
            />

            {/* Play/Close button overlay - disappears after delay */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div
                className={`flex items-center justify-center rounded-full bg-white bg-opacity-90 transition-all duration-300 ${
                  isVideoExpanded && showCenterClose
                    ? "h-16 w-16 opacity-100"
                    : "h-12 w-12 opacity-0"
                } ${!isVideoExpanded ? "opacity-0 hover:opacity-100" : ""}`}
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

            {/* Mini close button when expanded - always visible in corner */}
            {isVideoExpanded && (
              <div className="absolute right-3 top-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-black bg-opacity-50">
                  <svg className="h-5 w-5 text-white" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" />
                  </svg>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

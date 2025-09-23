"use client";

import Image from "next/image";
import { useState, useRef, useEffect } from "react";

export default function MediaLayout({ videoSrc, image }: { videoSrc: string; image: string }) {
  const [isVideoExpanded, setIsVideoExpanded] = useState(false);
  const [showCenterClose, setShowCenterClose] = useState(false);
  const [isMuted, setIsMuted] = useState(true); // Start muted
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
    if (!isVideoExpanded) {
      // Expanding - play the video and unmute
      setIsVideoExpanded(true);
      setIsMuted(false); // Unmute when expanding
      if (videoRef.current) {
        videoRef.current.play().catch(console.error);
      }
    } else {
      // Collapsing - pause the video and reset to muted
      if (videoRef.current) {
        videoRef.current.pause();
        videoRef.current.currentTime = 0; // Reset to beginning
      }
      setIsVideoExpanded(false);
      setIsMuted(true); // Mute again when collapsing
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
          className={`absolute left-0 top-0 z-20 transition-all duration-500 ease-in-out ${
            isVideoExpanded
              ? "h-full w-full !rounded-[22px]"
              : "rounded-br-[22px] rounded-tl-[22px]"
          } aspect-square cursor-pointer overflow-hidden bg-white p-5`}
          onClick={handleVideoToggle}
          onMouseEnter={handleVideoHover}
          onMouseLeave={handleVideoLeave}
        >
          <div
            className={`overflow-hidden rounded-[18px] transition-all duration-500 ease-in-out ${
              isVideoExpanded ? "h-full w-full" : "w-40 sm:w-56"
            } aspect-square bg-white`}
          >
            <video
              ref={videoRef}
              src={videoSrc}
              muted={isMuted} // Controlled mute state
              loop
              playsInline
              className="h-full w-full object-cover"
            />

            {/* Play/Close button overlay */}
            <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-0 transition-all duration-300">
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

            {/* Mute/Unmute button when expanded */}
            {isVideoExpanded && (
              <div
                className="absolute bottom-3 left-3 flex h-8 w-8 items-center justify-center rounded-full bg-black bg-opacity-50"
                onClick={(e) => {
                  e.stopPropagation(); // Prevent triggering the main click handler
                  setIsMuted(!isMuted);
                }}
              >
                {isMuted ? (
                  <svg className="h-5 w-5 text-white" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M3.63 3.63a.996.996 0 000 1.41L7.29 8.7 7 9H4c-.55 0-1 .45-1 1v4c0 .55.45 1 1 1h3l3.29 3.29c.63.63 1.71.18 1.71-.71v-4.17l4.18 4.18c-.49.37-1.02.68-1.6.91-.36.15-.58.53-.58.92 0 .72.73 1.18 1.39.91.8-.33 1.55-.77 2.22-1.31l1.34 1.34a.996.996 0 101.41-1.41L5.05 3.63c-.39-.39-1.02-.39-1.42 0zM19 12c0 .82-.15 1.61-.41 2.34l1.53 1.53c.56-1.17.88-2.48.88-3.87 0-3.83-2.4-7.11-5.78-8.4-.59-.23-1.22.23-1.22.86v.19c0 .38.25.71.61.85C17.18 6.54 19 9.06 19 12zm-8.71-6.29l-.17.17L12 7.76V6.41c0-.89-1.08-1.33-1.71-.7zM16.5 12A4.5 4.5 0 0014 7.97v1.79l2.48 2.48c.01-.08.02-.16.02-.24z" />
                  </svg>
                ) : (
                  <svg className="h-5 w-5 text-white" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M3 10v4c0 .55.45 1 1 1h3l3.29 3.29c.63.63 1.71.18 1.71-.71V6.41c0-.89-1.08-1.34-1.71-.71L7 9H4c-.55 0-1 .45-1 1zm13.5 2A4.5 4.5 0 0014 7.97v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 4.45v.2c0 .38.25.71.6.85C17.18 6.53 19 9.06 19 12s-1.82 5.47-4.4 6.5c-.36.14-.6.47-.6.85v.2c0 .63.63 1.07 1.21.85C18.6 19.11 21 15.84 21 12s-2.4-7.11-5.79-8.4c-.58-.23-1.21.22-1.21.85z" />
                  </svg>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

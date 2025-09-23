"use client";

import Image from "next/image";
import { useState, useRef, useEffect } from "react";

export default function MediaLayout({
  videoSrc,
  image,
}: {
  videoSrc: string;
  image: string;
}) {
  const [isVideoExpanded, setIsVideoExpanded] = useState(false);
  const [showCenterClose, setShowCenterClose] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    let timeoutId: NodeJS.Timeout;
    if (isVideoExpanded) {
      setShowCenterClose(true);
      timeoutId = setTimeout(() => setShowCenterClose(false), 2000);
    } else {
      setShowCenterClose(false);
    }
    return () => timeoutId && clearTimeout(timeoutId);
  }, [isVideoExpanded]);

  const handleVideoToggle = () => {
    if (!isVideoExpanded) {
      setIsVideoExpanded(true);
      setIsMuted(false);
      videoRef.current?.play().catch(console.error);
    } else {
      if (videoRef.current) {
        videoRef.current.pause();
        videoRef.current.currentTime = 0;
      }
      setIsVideoExpanded(false);
      setIsMuted(true);
    }
  };

  const handleVideoHover = () => {
    if (isVideoExpanded) setShowCenterClose(true);
  };

  const handleVideoLeave = () => {
    if (isVideoExpanded) setTimeout(() => setShowCenterClose(false), 1000);
  };

  const hasVideo = videoSrc && videoSrc.trim() !== "";

  return (
    <div className="relative mx-2 my-2 aspect-square max-h-[500px] w-[95%] max-w-[500px]">
      {/* Image card */}
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

      {/* Video overlay (only if a video exists) */}
      {hasVideo && (
        <div
          className={`absolute left-0 top-0 z-20 aspect-square cursor-pointer overflow-hidden bg-white p-5 transition-all duration-500 ease-in-out
            ${
              isVideoExpanded
                ? "h-full w-full !rounded-[22px]"
                : "rounded-br-[22px] rounded-tl-[22px]"
            }`}
          onClick={handleVideoToggle}
          onMouseEnter={handleVideoHover}
          onMouseLeave={handleVideoLeave}
        >
          <div
            className={`relative overflow-hidden rounded-[18px] bg-white transition-all duration-500 ease-in-out
              ${isVideoExpanded ? "h-full w-full" : "w-40 sm:w-56"} aspect-square`}
          >
            <video
              ref={videoRef}
              src={videoSrc}
              muted={isMuted}
              loop
              playsInline
              className="h-full w-full object-cover"
            />

            {/* Always show PLAY in the center when collapsed */}
            {!isVideoExpanded && (
              <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white/90 shadow">
                  <svg
                    className="ml-0.5 h-6 w-6 text-gray-900"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                  >
                    <path d="M8 5v14l11-7z" />
                  </svg>
                </div>
              </div>
            )}

            {/* Show CLOSE in the center briefly after expanding */}
            {isVideoExpanded && (
              <div className="absolute inset-0 flex items-center justify-center">
                <div
                  className={`flex items-center justify-center rounded-full bg-white/90 transition-all duration-300
                    ${showCenterClose ? "h-16 w-16 opacity-100" : "h-12 w-12 opacity-0"}`}
                >
                  <svg className="h-8 w-8 text-gray-800" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M19 6.41 17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" />
                  </svg>
                </div>
              </div>
            )}

            {/* Corner close (always visible when expanded) */}
            {isVideoExpanded && (
              <div className="absolute right-3 top-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-black/50">
                  <svg className="h-5 w-5 text-white" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M19 6.41 17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" />
                  </svg>
                </div>
              </div>
            )}

            {/* Mute / Unmute when expanded */}
            {isVideoExpanded && (
              <button
                className="absolute bottom-3 left-3 flex h-8 w-8 items-center justify-center rounded-full bg-black/50"
                onClick={(e) => {
                  e.stopPropagation();
                  setIsMuted((m) => !m);
                }}
                aria-label={isMuted ? "Unmute" : "Mute"}
              >
                {isMuted ? (
                  <svg className="h-5 w-5 text-white" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M3.63 3.63a.996.996 0 000 1.41L7.29 8.7 7 9H4c-.55 0-1 .45-1 1v4c0 .55.45 1 1 1h3l3.29 3.29c.63.63 1.71.18 1.71-.71v-4.17l4.18 4.18c-.49.37-1.02.68-1.6.91-.36.15-.58.53-.58.92 0 .72.73 1.18 1.39.91.8-.33 1.55-.77 2.22-1.31l1.34 1.34a.996.996 0 101.41-1.41L5.05 3.63c-.39-.39-1.02-.39-1.42 0z" />
                  </svg>
                ) : (
                  <svg className="h-5 w-5 text-white" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M3 10v4c0 .55.45 1 1 1h3l3.29 3.29c.63.63 1.71.18 1.71-.71V6.41c0-.89-1.08-1.34-1.71-.71L7 9H4c-.55 0-1 .45-1 1zm13.5 2A4.5 4.5 0 0014 7.97v8.05c1.48-.73 2.5-2.25 2.5-4.02z" />
                  </svg>
                )}
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

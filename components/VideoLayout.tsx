"use client";

import { useState, useRef, useEffect } from "react";

export default function VideoLayout({ videoSrc }: { videoSrc: string }) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const videoContainerRef = useRef<HTMLDivElement>(null);

  const handleVideoClick = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
        setIsPlaying(false);
      } else {
        videoRef.current.play().catch(console.error);
        setIsPlaying(true);
        setIsMuted(false);
      }
    }
  };

  // Fullscreen logic
  const handleFullscreen = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    const el = videoContainerRef.current;
    const video = videoRef.current;
    // iOS Safari only supports fullscreen for <video> elements
    if (video && typeof (video as any).webkitEnterFullscreen === "function") {
      (video as any).webkitEnterFullscreen();
      setIsFullscreen(true);
      return;
    }
    if (!el) return;
    if (document.fullscreenElement) {
      document.exitFullscreen();
    } else {
      if (el.requestFullscreen) {
        el.requestFullscreen();
        setIsFullscreen(true);
      } else if ((el as any).webkitRequestFullscreen) {
        (el as any).webkitRequestFullscreen();
        setIsFullscreen(true);
      } else if ((el as any).msRequestFullscreen) {
        (el as any).msRequestFullscreen();
        setIsFullscreen(true);
      }
    }
  };

  // Restore initial position when exiting fullscreen
  useEffect(() => {
    function onFullscreenChange() {
      const video = videoRef.current;
      if (!document.fullscreenElement && isFullscreen) {
        setIsFullscreen(false);
        setIsPlaying(false);
        setIsMuted(true);
        if (video) {
          video.pause();
          video.currentTime = 0;
        }
      }
    }
    document.addEventListener("fullscreenchange", onFullscreenChange);
    return () => document.removeEventListener("fullscreenchange", onFullscreenChange);
  }, [isFullscreen]);

  // Check if videoSrc is provided and not empty
  const hasVideo = videoSrc && videoSrc.trim() !== "";

  return (
    <div className="relative mx-2 my-2 aspect-square max-h-[500px] w-[95%] max-w-[500px]">
      {/* Video container - only show if videoSrc exists */}
      {hasVideo ? (
        <div ref={videoContainerRef} className="h-full rounded-[28px] bg-white p-4 shadow-lg sm:p-5 md:p-6">
          <div
            className="relative h-full cursor-pointer overflow-hidden rounded-[22px]"
            onClick={handleVideoClick}
          >
            <video
              ref={videoRef}
              src={videoSrc}
              muted={isMuted}
              loop
              playsInline
              className="h-full w-full object-cover"
            />

            {/* Play/Pause overlay */}
            <div
              className={`absolute inset-0 flex items-center justify-center transition-opacity duration-300 ${
                isPlaying ? "opacity-0 hover:opacity-100" : "opacity-100"
              }`}
            >
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-black bg-opacity-50">
                {isPlaying ? (
                  <svg className="h-8 w-8 text-white" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" />
                  </svg>
                ) : (
                  <svg className="ml-1 h-8 w-8 text-white" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M8 5v14l11-7z" />
                  </svg>
                )}
              </div>
            </div>

            {/* Mute/Unmute button */}
            {isPlaying && (
              <div
                className="absolute bottom-3 right-3 flex h-8 w-8 items-center justify-center rounded-full bg-black bg-opacity-50"
                onClick={(e) => {
                  e.stopPropagation();
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

            {/* Fullscreen button */}
            {isPlaying && (
              <button
                className="absolute bottom-3 left-3 flex h-8 w-8 items-center justify-center rounded-full bg-black bg-opacity-50"
                onClick={handleFullscreen}
                aria-label="Fullscreen"
              >
                <svg className="h-5 w-5 text-white" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M7 14H5v5h5v-2H7v-3zm0-4h2V7h3V5H7v5zm10 7h-3v2h5v-5h-2v3zm0-12h-5v2h3v3h2V5z" />
                </svg>
              </button>
            )}

            {/* Close button in fullscreen */}
            {isFullscreen && (
              <button
                className="absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-full bg-black bg-opacity-50"
                onClick={e => {
                  e.stopPropagation();
                  const video = videoRef.current;
                  // iOS Safari: exit fullscreen for video
                  if (video && typeof (video as any).webkitExitFullscreen === "function") {
                    (video as any).webkitExitFullscreen();
                  } else if (document.fullscreenElement) {
                    document.exitFullscreen();
                  } else {
                    setIsFullscreen(false);
                    setIsPlaying(false);
                    setIsMuted(true);
                    if (video) {
                      video.pause();
                      video.currentTime = 0;
                    }
                  }
                }}
                aria-label="Close"
              >
                <svg className="h-5 w-5 text-white" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M19 6.41 17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" />
                </svg>
              </button>
            )}
          </div>
        </div>
      ) : (
        // Placeholder if no video is provided
        <div className="flex h-full w-full items-center justify-center rounded-[28px] bg-gray-200 p-4 shadow-lg sm:p-5 md:p-6">
          <div className="relative flex h-full w-full items-center justify-center overflow-hidden rounded-[22px] bg-gray-300">
            <p className="text-gray-500">No video available</p>
          </div>
        </div>
      )}
    </div>
  );
}

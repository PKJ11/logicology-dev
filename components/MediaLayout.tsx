"use client";

import Image from "next/image";
import { useState } from "react";

export default function MediaLayout({
  videoSrc,
  image,
}: {
  videoSrc: string;
  image: string;
}) {
  const [isVideoExpanded, setIsVideoExpanded] = useState(false);

  return (
    <div className="relative max-w-[500px] max-h-[500px] w-[95%] my-2 mx-2">
      {/* Main content container */}
      <div className="rounded-[28px] bg-white p-5 shadow-lg">
        <div className="relative rounded-[22px] overflow-hidden">
          <div className="relative w-full h-0 pb-[66.666%]">
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

      {/* Video container positioned at bottom right */}
      <div
        className={`
          absolute z-20 
          transition-all duration-500 ease-in-out
          ${
            isVideoExpanded
              ? "w-full h-full top-0 left-0 rounded-[22px] bg-white"
              : "w-40 sm:w-56 h-auto bottom-5 right-5 rounded-[18px] bg-white/90 backdrop-blur-sm"
          }
          shadow-lg cursor-pointer
          overflow-hidden
          flex items-center justify-center
        `}
        onClick={() => setIsVideoExpanded(!isVideoExpanded)}
      >
        <div
          className={`
            transition-all duration-500 ease-in-out
            ${
              isVideoExpanded
                ? "w-full h-full"
                : "w-full aspect-video"
            }
            flex items-center justify-center
          `}
        >
          <video
            src={videoSrc}
            autoPlay
            muted
            loop
            playsInline
            className={`
              ${isVideoExpanded ? "w-full h-full" : "w-full"}
              object-contain
            `}
          />

          {/* Play/Close button overlay */}
          <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-0 hover:bg-opacity-20 transition-all duration-300">
            <div
              className={`
              flex items-center justify-center rounded-full bg-white bg-opacity-90
              transition-all duration-200
              ${
                isVideoExpanded
                  ? "w-16 h-16 opacity-100"
                  : "w-10 h-10 opacity-70 hover:opacity-100"
              }
            `}
            >
              {isVideoExpanded ? (
                <svg
                  className="w-8 h-8 text-gray-800"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" />
                </svg>
              ) : (
                <svg
                  className="w-5 h-5 text-gray-800 ml-1"
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
    </div>
  );
}

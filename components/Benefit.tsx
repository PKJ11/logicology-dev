"use client";
import MediaLayout from "./MediaLayout";
import { motion, AnimatePresence } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef, useState, useEffect } from "react";

const VIDEO_URL =
  "https://ik.imagekit.io/pratik11/Kartik%20-%20Philosophy.mp4?updatedAt=1758433043493";

function VideoModal({ onClose }: { onClose: () => void }) {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = ""; };
  }, []);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onClose]);

  const handleFullscreen = () => {
    const v = videoRef.current;
    if (!v) return;
    if (v.requestFullscreen) v.requestFullscreen();
    else if ((v as any).webkitEnterFullscreen) (v as any).webkitEnterFullscreen();
  };

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-[200] flex items-center justify-center p-4 sm:p-8"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.25 }}
        onClick={onClose}
      >
        <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" />

        <motion.div
          className="relative z-10 w-full max-w-3xl overflow-hidden rounded-2xl bg-black shadow-2xl"
          initial={{ scale: 0.92, opacity: 0, y: 24 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.92, opacity: 0, y: 24 }}
          transition={{ duration: 0.35, ease: [0.32, 0, 0.16, 1] }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Top bar */}
          <div className="flex items-center justify-between bg-black/60 px-4 py-3">
            <p className="text-sm font-semibold tracking-wide text-white/80">Our Philosophy</p>
            <div className="flex items-center gap-2">
              <button
                onClick={handleFullscreen}
                className="flex items-center justify-center rounded-lg p-2 text-white/70 transition hover:bg-white/10 hover:text-white"
                aria-label="Enter fullscreen"
              >
                <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4 8V4m0 0h4M4 4l5 5m11-5h-4m4 0v4m0-4l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
                </svg>
              </button>
              <button
                onClick={onClose}
                className="flex items-center justify-center rounded-lg p-2 text-white/70 transition hover:bg-white/10 hover:text-white"
                aria-label="Close video"
              >
                <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>

          {/* 16:9 video */}
          <div className="relative w-full" style={{ paddingBottom: "56.25%" }}>
            <video
              ref={videoRef}
              src={VIDEO_URL}
              className="absolute inset-0 h-full w-full object-cover"
              controls
              autoPlay
              playsInline
            />
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

export default function Benefit() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const [videoOpen, setVideoOpen] = useState(false);

  return (
    <>
      <section id="benefit" className="w-full bg-[#7bb83a]" ref={ref}>
        <div className="px-4 md:mx-auto md:max-w-[75vw] lg:mx-auto lg:max-w-[75vw] lg:px-8">
          <div className="overflow-hidden py-12 text-white">
            <div className="flex flex-col items-center md:flex-row">
              <motion.div
                className="order-2 flex w-full flex-col justify-end p-8 sm:p-12 md:order-1 md:w-1/2 md:pl-2"
                initial={{ x: -50, opacity: 0 }}
                animate={isInView ? { x: 0, opacity: 1 } : { x: -50, opacity: 0 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
              >
                <motion.p
                  className="headingstyle font-heading"
                  initial={{ y: 20, opacity: 0 }}
                  animate={isInView ? { y: 0, opacity: 1 } : { y: 20, opacity: 0 }}
                  transition={{ duration: 0.6, delay: 0.2 }}
                >
                  We're not a toy company that added learning.
                </motion.p>
                <motion.p
                  className="textstyles mt-4 max-w-xl font-sans text-white/90"
                  initial={{ y: 20, opacity: 0 }}
                  animate={isInView ? { y: 0, opacity: 1 } : { y: 20, opacity: 0 }}
                  transition={{ duration: 0.6, delay: 0.4 }}
                >
                  We're a learning company that made it fun. One distinction explains why we do what
                  we do.
                </motion.p>
                <motion.div
                  className="mt-6"
                  initial={{ y: 20, opacity: 0 }}
                  animate={isInView ? { y: 0, opacity: 1 } : { y: 20, opacity: 0 }}
                  transition={{ duration: 0.6, delay: 0.6 }}
                >
                  <button
                    onClick={() => setVideoOpen(true)}
                    className="inline-flex items-center gap-3 rounded-full border-2 border-transparent bg-[#fbb041] px-6 py-3 text-base font-medium text-[#3d3b40] shadow-[0_4px_16px_rgba(251,176,65,0.35)] transition-all duration-300 hover:scale-105 hover:bg-[#fa9e15] hover:shadow-[0_6px_20px_rgba(250,158,21,0.4)] active:scale-95 focus:outline-none focus:ring-2 focus:ring-white/70"
                  >
                    <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[#3d3b40]/15">
                      <svg className="h-3 w-3 translate-x-[1px]" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M8 5v14l11-7z" />
                      </svg>
                    </span>
                    Explore the Philosophy
                  </button>
                </motion.div>
              </motion.div>

              <motion.div
                className="order-1 flex w-full items-center justify-center md:order-2 md:w-1/2 md:py-0"
                initial={{ x: 50, opacity: 0, scale: 0.9 }}
                animate={
                  isInView ? { x: 0, opacity: 1, scale: 1 } : { x: 50, opacity: 0, scale: 0.9 }
                }
                transition={{ duration: 0.8, delay: 0.3 }}
              >
                <MediaLayout
                  image="https://ik.imagekit.io/pratik11/WE-ARE-NOT-TOY-COMPANY-NEW.png"
                  videoSrc=""
                />
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {videoOpen && <VideoModal onClose={() => setVideoOpen(false)} />}
    </>
  );
}
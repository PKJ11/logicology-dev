"use client";
import { useState, useRef } from "react";
import CTAButton from "./CTAButton";
import MediaLayoutRight from "./MediaLayoutRight";
import VideoModal from "./VideoModal";
import { motion } from "framer-motion";
import { useInView } from "framer-motion";

export default function WhyImportant() {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  const YT = "https://youtu.be/oLktBpxN6qw?si=AVuR7nCiCqaA4HHG";

  return (
    <section id="why" className="mt-10 w-full bg-[#D8AE4F]" ref={ref}>
      <div className="mx-auto lg:max-w-[80vw]">
        <div className="overflow-hidden py-12 text-[#3F2F14]">
          <div className="flex flex-col items-center md:flex-row">
            {/* Media (left) */}
            <motion.div 
              className="order-1 flex w-full items-center justify-center py-6 md:order-1 md:w-1/2 md:py-0"
              initial={{ x: -50, opacity: 0, scale: 0.9 }}
              animate={isInView ? { x: 0, opacity: 1, scale: 1 } : { x: -50, opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.8, delay: 0.3 }}
            >
              <MediaLayoutRight
                image="https://ik.imagekit.io/pratik11/WHY-LOGICOLOGY.png?updatedAt=1758439747708"
                videoSrc="https://ik.imagekit.io/pratik11/Kartik%20-%20Philosophy.mp4?updatedAt=1758433043493"
              />
            </motion.div>

            {/* Content (right) */}
            <motion.div 
              className="order-2 w-full p-8 sm:p-12 md:order-2 md:w-1/2"
              initial={{ x: 50, opacity: 0 }}
              animate={isInView ? { x: 0, opacity: 1 } : { x: 50, opacity: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
            >
              <motion.p 
                className="headingstyle font-heading text-[#3F2F14]"
                initial={{ y: 20, opacity: 0 }}
                animate={isInView ? { y: 0, opacity: 1 } : { y: 20, opacity: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                Why Logicology?
              </motion.p>
              <motion.p 
                className="textstyles mt-4 max-w-xl font-sans"
                initial={{ y: 20, opacity: 0 }}
                animate={isInView ? { y: 0, opacity: 1 } : { y: 20, opacity: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
              >
                Children learn the best when they are engaged. Our thoroughly researched and tested
                content is crafted to engage children. Gamification helps children learn in a fun
                way. At Logicology, we want to make learning fun and engaging—that&apos;s why we
                exist.
              </motion.p>

              <motion.div 
                className="mt-6"
                initial={{ y: 20, opacity: 0 }}
                animate={isInView ? { y: 0, opacity: 1 } : { y: 20, opacity: 0 }}
                transition={{ duration: 0.6, delay: 0.6 }}
              >
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
              </motion.div>
            </motion.div>
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
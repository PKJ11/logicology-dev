"use client"
import Link from "next/link";
import MediaLayout from "./MediaLayout";
import CTAButton from "./CTAButton";
import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";

export default function Benefit() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section id="benefit" className="w-full bg-brand-coral" ref={ref}>
      <div className="mx-auto lg:max-w-[80vw]">
        <div className="overflow-hidden py-12 text-white">
          {/* Flex container */}
          <div className="flex flex-col items-center md:flex-row">
            {/* Content on left for larger screens, top for mobile */}
            <motion.div 
              className="order-2 flex w-full flex-col justify-end p-8 sm:p-12 md:order-1 md:w-1/2"
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
                How we Help?
              </motion.p>
              <motion.p 
                className="textstyles mt-4 max-w-xl font-sans text-white/90"
                initial={{ y: 20, opacity: 0 }}
                animate={isInView ? { y: 0, opacity: 1 } : { y: 20, opacity: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
              >
                At Logicology we have a bouquet of products and subscriptions that help your child
                develop Logical Reasoning and Critical Thinking Skills. You can choose from our
                offerings (see below) to choose the one that suits you the best.
              </motion.p>
              <motion.div 
                className="mt-6"
                initial={{ y: 20, opacity: 0 }}
                animate={isInView ? { y: 0, opacity: 1 } : { y: 20, opacity: 0 }}
                transition={{ duration: 0.6, delay: 0.6 }}
              >
                <CTAButton
                  text="Learn more"
                  href="#offerings"
                  bg="#FFFFFF"
                  color="#AB4637"
                  hoverBg="#AB4637"
                  hoverColor="#FFFFFF"
                  size="md"
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

            {/* MediaLayout on right for larger screens, bottom for mobile */}
            <motion.div 
              className="order-1 flex w-full items-center justify-center md:order-2 md:w-1/2 md:py-0"
              initial={{ x: 50, opacity: 0, scale: 0.9 }}
              animate={isInView ? { x: 0, opacity: 1, scale: 1 } : { x: 50, opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.8, delay: 0.3 }}
            >
              <MediaLayout
                image="https://ik.imagekit.io/pratik11/HOW-WE-HELP.png?updatedAt=1758439842222"
                videoSrc=""
              />
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
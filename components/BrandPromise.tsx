"use client";
import MediaLayout from "./MediaLayout";
import CTAButton from "./CTAButton";
import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";

export default function BrandPromise() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section id="brand-promise" className="w-full bg-brand-teal" ref={ref}>
      <div className="px-4 md:mx-auto md:max-w-[75vw] lg:mx-auto lg:max-w-[75vw] lg:px-8">
        <div className="overflow-hidden py-12 text-white">
          <div className="flex flex-col items-center md:flex-row">
            {/* ── LEFT: Image ─────────────────────────── */}
            <motion.div
              className="order-1 flex w-full items-center justify-center md:w-1/2 md:py-0"
              initial={{ x: -50, opacity: 0, scale: 0.9 }}
              animate={
                isInView ? { x: 0, opacity: 1, scale: 1 } : { x: -50, opacity: 0, scale: 0.9 }
              }
              transition={{ duration: 0.8, delay: 0.3 }}
            >
              <MediaLayout
                image="https://ik.imagekit.io/pratik11/CHILDREN-THINK-THEY-ARE-PALYING.png"
                videoSrc=""
              />
            </motion.div>

            {/* ── RIGHT: Text ──────────────────────────── */}
            <motion.div
              className="order-2 flex w-full flex-col justify-center p-8 sm:p-12 md:order-2 md:w-1/2 md:pr-2"
              initial={{ x: 50, opacity: 0 }}
              animate={isInView ? { x: 0, opacity: 1 } : { x: 50, opacity: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
            >
              <motion.p
                className="headingstyle font-heading"
                initial={{ y: 20, opacity: 0 }}
                animate={isInView ? { y: 0, opacity: 1 } : { y: 20, opacity: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                Children think they're playing. Parents know they're learning.
              </motion.p>

              <motion.p
                className="textstyles mt-4 max-w-xl font-sans text-white/90"
                initial={{ y: 20, opacity: 0 }}
                animate={isInView ? { y: 0, opacity: 1 } : { y: 20, opacity: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
              >
                Deeply researched games and books where learning is disguised as fun — not another
                STEM toy, this is the real thing.
              </motion.p>

              <motion.div
                className="mt-6"
                initial={{ y: 20, opacity: 0 }}
                animate={isInView ? { y: 0, opacity: 1 } : { y: 20, opacity: 0 }}
                transition={{ duration: 0.6, delay: 0.6 }}
              >
                <CTAButton
                  text="Explore the Promise"
                  bg="#fbb041"
                  color="#3d3b40"
                  hoverBg="#fa9e15"
                  hoverColor="#3d3b40"
                  showShadow={true}
                  showScaleOnHover={true}
                  showScaleOnActive={true}
                />
              </motion.div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}

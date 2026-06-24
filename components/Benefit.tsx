"use client";
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
  );
}

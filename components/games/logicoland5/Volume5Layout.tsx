"use client";

import React from "react";
import { motion } from "framer-motion";

interface Volume5LayoutProps {
  children: React.ReactNode;
  title?: string;
  subtitle?: string;
  sectionNumber?: number;
  sectionName?: string;
}

export default function Volume5Layout({
  children,
  title = "Logicoland Volume 5",
  subtitle = "Playful Puzzles for Young Minds",
  sectionNumber,
  sectionName,
}: Volume5LayoutProps) {
  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-50">
      {/* Background Rays */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-orange-200/20 via-transparent to-transparent" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_right,_var(--tw-gradient-stops))] from-amber-200/15 via-transparent to-transparent" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,_var(--tw-gradient-stops))] from-yellow-200/10 via-transparent to-transparent" />

      {/* Main Content Container */}
      <div className="container relative z-10 mx-auto px-4 py-8">
        {/* Cloud Container */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="rounded-4xl border border-white/80 bg-white/95 p-6 shadow-2xl shadow-orange-200/50 backdrop-blur-sm md:p-8"
        >
          {/* Header */}
          <div className="mb-8 text-center">
            <motion.h1
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.1 }}
              className="mb-2 bg-gradient-to-r from-orange-500 to-amber-500 bg-clip-text font-heading text-4xl font-black text-transparent md:text-5xl"
            >
              {title}
            </motion.h1>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="mb-6 text-lg text-gray-600"
            >
              {subtitle}
            </motion.p>

            {sectionNumber && sectionName && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="inline-block"
              >
                <div className="rounded-full bg-gradient-to-r from-orange-500 to-amber-500 px-6 py-2 text-lg font-bold text-white shadow-lg shadow-orange-200">
                  Section {sectionNumber}: {sectionName}
                </div>
              </motion.div>
            )}
          </div>

          {/* Content */}
          <div className="mx-auto max-w-6xl">{children}</div>
        </motion.div>
      </div>
    </div>
  );
}

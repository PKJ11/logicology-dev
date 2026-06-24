"use client";

import { motion } from "framer-motion";
import { ReactNode } from "react";

interface CloudHeaderProps {
  title: string;
  subtitle?: string;
  children?: ReactNode;
}

export default function CloudHeader({ title, subtitle, children }: CloudHeaderProps) {
  return (
    <div className="relative">
      {/* Cloud shape background */}
      <div className="absolute inset-0 -z-10 rounded-4xl bg-white shadow-soft" />

      {/* Decorative cloud curves */}
      <div className="absolute -top-6 left-1/4 -z-10 h-8 w-16 rounded-full bg-white" />
      <div className="absolute -top-8 right-1/3 -z-10 h-10 w-20 rounded-full bg-white" />
      <div className="absolute -top-4 left-1/3 -z-10 h-12 w-24 rounded-full bg-white" />

      <div className="relative z-10 p-6 md:p-8">
        <motion.h1
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="font-outfit text-center text-4xl font-bold text-brand-teal md:text-5xl"
        >
          {title}
        </motion.h1>

        {subtitle && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="font-roboto mt-2 text-center text-lg text-gray-600 md:text-xl"
          >
            {subtitle}
          </motion.p>
        )}

        {children && <div className="mt-6">{children}</div>}
      </div>
    </div>
  );
}

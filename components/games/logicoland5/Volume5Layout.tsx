'use client';

import React from 'react';
import { motion } from 'framer-motion';

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
  sectionName
}: Volume5LayoutProps) {
  return (
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-50">
      {/* Background Rays */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-orange-200/20 via-transparent to-transparent" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_right,_var(--tw-gradient-stops))] from-amber-200/15 via-transparent to-transparent" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,_var(--tw-gradient-stops))] from-yellow-200/10 via-transparent to-transparent" />
      
      {/* Main Content Container */}
      <div className="relative z-10 container mx-auto px-4 py-8">
        {/* Cloud Container */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="bg-white/95 backdrop-blur-sm rounded-4xl shadow-2xl shadow-orange-200/50 border border-white/80 p-6 md:p-8"
        >
          {/* Header */}
          <div className="text-center mb-8">
            <motion.h1
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.1 }}
              className="text-4xl md:text-5xl font-heading font-black bg-gradient-to-r from-orange-500 to-amber-500 bg-clip-text text-transparent mb-2"
            >
              {title}
            </motion.h1>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="text-lg text-gray-600 mb-6"
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
                <div className="bg-gradient-to-r from-orange-500 to-amber-500 text-white px-6 py-2 rounded-full font-bold text-lg shadow-lg shadow-orange-200">
                  Section {sectionNumber}: {sectionName}
                </div>
              </motion.div>
            )}
          </div>
          
          {/* Content */}
          <div className="max-w-6xl mx-auto">
            {children}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
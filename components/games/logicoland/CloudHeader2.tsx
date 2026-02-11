'use client';

import { motion } from 'framer-motion';
import { ReactNode } from 'react';

interface CloudHeaderProps {
  title: string;
  subtitle?: string;
  children?: ReactNode;
}

export default function CloudHeader({ title, subtitle, children }: CloudHeaderProps) {
  return (
    <div className="relative">
      {/* Cloud shape background */}
      <div className="absolute inset-0 bg-white rounded-4xl -z-10 shadow-soft" />
      
      {/* Decorative cloud curves */}
      <div className="absolute -top-6 left-1/4 w-16 h-8 bg-white rounded-full -z-10" />
      <div className="absolute -top-8 right-1/3 w-20 h-10 bg-white rounded-full -z-10" />
      <div className="absolute -top-4 left-1/3 w-24 h-12 bg-white rounded-full -z-10" />
      
      <div className="relative z-10 p-6 md:p-8">
        <motion.h1 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="font-outfit text-4xl md:text-5xl font-bold text-center text-brand-teal"
        >
          {title}
        </motion.h1>
        
        {subtitle && (
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="font-roboto text-lg md:text-xl text-center text-gray-600 mt-2"
          >
            {subtitle}
          </motion.p>
        )}
        
        {children && (
          <div className="mt-6">
            {children}
          </div>
        )}
      </div>
    </div>
  );
}
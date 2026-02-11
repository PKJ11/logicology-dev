'use client';

import { motion } from 'framer-motion';
import { ReactNode } from 'react';

interface CloudPanelProps {
  children: ReactNode;
  className?: string;
  padding?: 'sm' | 'md' | 'lg' | 'xl';
  animate?: boolean;
}

export default function CloudPanel({ 
  children, 
  className = '', 
  padding = 'lg',
  animate = false 
}: CloudPanelProps) {
  const paddingClasses = {
    sm: 'p-4',
    md: 'p-6',
    lg: 'p-8',
    xl: 'p-10'
  };

  const baseClasses = `
    relative bg-white rounded-4xl shadow-soft
    ${paddingClasses[padding]}
    ${className}
  `;

  if (animate) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className={baseClasses}
      >
        {children}
      </motion.div>
    );
  }

  return (
    <div className={baseClasses}>
      {children}
    </div>
  );
}
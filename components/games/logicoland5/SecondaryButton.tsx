'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { LucideIcon } from 'lucide-react';

interface SecondaryButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  icon?: LucideIcon;
  disabled?: boolean;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'outline' | 'ghost' | 'soft';
}

export default function SecondaryButton({
  children,
  onClick,
  icon: Icon,
  disabled = false,
  size = 'md',
  variant = 'outline'
}: SecondaryButtonProps) {
  const sizeClasses = {
    sm: 'px-4 py-2 text-sm rounded-xl',
    md: 'px-6 py-3 text-base rounded-2xl',
    lg: 'px-8 py-4 text-lg rounded-3xl'
  }[size];

  const variantClasses = {
    outline: 'border-2 border-orange-300 text-orange-600 hover:bg-orange-50 hover:border-orange-400',
    ghost: 'text-gray-600 hover:bg-gray-100 hover:text-gray-800',
    soft: 'bg-orange-50 text-orange-600 hover:bg-orange-100'
  }[variant];

  return (
    <motion.button
      whileHover={!disabled ? { scale: 1.05 } : {}}
      whileTap={!disabled ? { scale: 0.95 } : {}}
      onClick={onClick}
      disabled={disabled}
      className={`
        ${sizeClasses}
        ${variantClasses}
        font-bold
        transition-all duration-200
        flex items-center justify-center gap-2
        disabled:opacity-50 disabled:cursor-not-allowed
        disabled:hover:scale-100
      `}
    >
      {Icon && <Icon className="w-5 h-5" />}
      {children}
    </motion.button>
  );
}
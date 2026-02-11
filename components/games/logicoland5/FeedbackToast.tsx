'use client';

import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, XCircle, Star, Trophy, Sparkles } from 'lucide-react';
import confetti from 'canvas-confetti';

interface FeedbackToastProps {
  type: 'success' | 'error' | 'hint' | 'streak';
  message: string;
  streak?: number;
  score?: number;
  onClose?: () => void;
  duration?: number;
}

export default function FeedbackToast({
  type,
  message,
  streak = 0,
  score = 0,
  onClose,
  duration = 3000
}: FeedbackToastProps) {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    if (type === 'success') {
      // Trigger confetti
      confetti({
        particleCount: 150,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#f97316', '#f59e0b', '#eab308', '#84cc16', '#22c55e']
      });

      // Additional burst
      setTimeout(() => {
        confetti({
          particleCount: 100,
          angle: 60,
          spread: 55,
          origin: { x: 0 },
          colors: ['#f97316', '#f59e0b', '#eab308']
        });
      }, 250);

      setTimeout(() => {
        confetti({
          particleCount: 100,
          angle: 120,
          spread: 55,
          origin: { x: 1 },
          colors: ['#84cc16', '#22c55e', '#0ea5e9']
        });
      }, 500);
    }

    const timer = setTimeout(() => {
      setIsVisible(false);
      setTimeout(() => onClose?.(), 300);
    }, duration);

    return () => clearTimeout(timer);
  }, [type, duration, onClose]);

  const getConfig = () => {
    switch (type) {
      case 'success':
        return {
          icon: <CheckCircle className="w-8 h-8 text-green-500" />,
          bg: 'bg-gradient-to-r from-green-50 to-emerald-50',
          border: 'border-green-200',
          accent: 'text-green-700'
        };
      case 'error':
        return {
          icon: <XCircle className="w-8 h-8 text-red-500" />,
          bg: 'bg-gradient-to-r from-red-50 to-rose-50',
          border: 'border-red-200',
          accent: 'text-red-700'
        };
      case 'hint':
        return {
          icon: <Sparkles className="w-8 h-8 text-blue-500" />,
          bg: 'bg-gradient-to-r from-blue-50 to-sky-50',
          border: 'border-blue-200',
          accent: 'text-blue-700'
        };
      case 'streak':
        return {
          icon: <Trophy className="w-8 h-8 text-amber-500" />,
          bg: 'bg-gradient-to-r from-amber-50 to-yellow-50',
          border: 'border-amber-200',
          accent: 'text-amber-700'
        };
    }
  };

  const config = getConfig();

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: 50, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 50, scale: 0.9 }}
          transition={{ type: 'spring', damping: 20 }}
          className="fixed bottom-8 left-1/2 transform -translate-x-1/2 z-50"
        >
          <div className={`${config.bg} border ${config.border} rounded-2xl shadow-2xl p-6 max-w-md mx-4`}>
            <div className="flex items-center gap-4">
              <motion.div
                animate={type === 'success' ? {
                  scale: [1, 1.2, 1],
                  rotate: [0, 10, -10, 0]
                } : {}}
                transition={{ duration: 0.5 }}
              >
                {config.icon}
              </motion.div>
              
              <div className="flex-1">
                <h3 className="text-xl font-bold text-gray-800 mb-1">{message}</h3>
                
                {(streak > 0 || score > 0) && (
                  <div className="flex gap-4 mt-2">
                    {streak > 0 && (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="flex items-center gap-1"
                      >
                        <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
                        <span className="font-bold text-amber-700">Streak: {streak}</span>
                      </motion.div>
                    )}
                    {score > 0 && (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: 0.1 }}
                        className="flex items-center gap-1"
                      >
                        <Trophy className="w-4 h-4 text-amber-500" />
                        <span className="font-bold text-amber-700">+{score} points</span>
                      </motion.div>
                    )}
                  </div>
                )}
              </div>

              {type === 'success' && (
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                  className="text-3xl"
                >
                  🎉
                </motion.div>
              )}
            </div>

            {type === 'success' && (
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: '100%' }}
                transition={{ delay: 0.2, duration: 0.5 }}
                className="h-1 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full mt-4"
              />
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
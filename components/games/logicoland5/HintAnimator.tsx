'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Pause, SkipForward, SkipBack } from 'lucide-react';

/* ------------------------------------------------------------------ */
/*  TYPES — discriminated union (CRITICAL FIX)                          */
/* ------------------------------------------------------------------ */

type Speed = 'slow' | 'normal' | 'fast';

type HintAnimatorProps =
  | {
      type: 'path';
      moves: [number, number][];
      onStepChange?: (step: number) => void;
      onComplete?: () => void;
      autoPlay?: boolean;
      speed?: Speed;
    }
  | {
      type: 'sequence';
      moves: string[];
      onStepChange?: (step: number) => void;
      onComplete?: () => void;
      autoPlay?: boolean;
      speed?: Speed;
    };

/* ------------------------------------------------------------------ */
/*  COMPONENT                                                          */
/* ------------------------------------------------------------------ */

export default function HintAnimator(props: HintAnimatorProps) {
  const {
    moves,
    type,
    onStepChange,
    onComplete,
    autoPlay = false,
    speed: initialSpeed = 'normal',
  } = props;

  const [currentStep, setCurrentStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(autoPlay);
  const [isComplete, setIsComplete] = useState(false);
  const [speed, setSpeed] = useState<Speed>(initialSpeed);

  const speedDelay: Record<Speed, number> = {
    slow: 1500,
    normal: 1000,
    fast: 500,
  };

  /* ------------------------------------------------------------------ */
  /*  AUTOPLAY LOGIC                                                     */
  /* ------------------------------------------------------------------ */

  useEffect(() => {
    if (!isPlaying || currentStep >= moves.length) return;

    const timer = setTimeout(() => {
      const next = currentStep + 1;
      setCurrentStep(next);
      onStepChange?.(next);

      if (next >= moves.length) {
        setIsPlaying(false);
        setIsComplete(true);
        onComplete?.();
      }
    }, speedDelay[speed]);

    return () => clearTimeout(timer);
  }, [isPlaying, currentStep, moves.length, speed, onStepChange, onComplete]);

  /* ------------------------------------------------------------------ */
  /*  CONTROLS                                                          */
  /* ------------------------------------------------------------------ */

  const handlePlayPause = () => setIsPlaying((p) => !p);

  const handleStep = (direction: 'prev' | 'next') => {
    setIsPlaying(false);

    if (direction === 'prev') {
      const step = Math.max(0, currentStep - 1);
      setCurrentStep(step);
      onStepChange?.(step);
      setIsComplete(false);
    } else {
      const step = Math.min(moves.length, currentStep + 1);
      setCurrentStep(step);
      onStepChange?.(step);

      if (step >= moves.length) {
        setIsComplete(true);
        onComplete?.();
      }
    }
  };

  const handleReset = () => {
    setCurrentStep(0);
    setIsPlaying(false);
    setIsComplete(false);
    onStepChange?.(0);
  };

  const handleComplete = () => {
    setCurrentStep(moves.length);
    setIsPlaying(false);
    setIsComplete(true);
    onStepChange?.(moves.length);
    onComplete?.();
  };

  /* ------------------------------------------------------------------ */
  /*  RENDER                                                            */
  /* ------------------------------------------------------------------ */

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-gradient-to-r from-blue-50 to-sky-50 rounded-2xl p-6 shadow-soft"
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xl font-bold text-gray-800 font-heading">
          {isComplete ? '🎉 Path Complete!' : '🔍 Hint Animation'}
        </h3>
        <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-bold">
          Step {Math.min(currentStep, moves.length)} of {moves.length}
        </span>
      </div>

      {/* Progress */}
      <div className="mb-6">
        <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
          <motion.div
            animate={{ width: `${(currentStep / moves.length) * 100}%` }}
            transition={{ duration: 0.3 }}
            className="h-full bg-gradient-to-r from-blue-500 to-sky-500"
          />
        </div>
      </div>

      {/* Controls */}
      <div className="flex flex-wrap gap-3 justify-center mb-6">
        <ControlButton
          onClick={() => handleStep('prev')}
          disabled={currentStep === 0}
        >
          <SkipBack className="w-5 h-5" /> Prev
        </ControlButton>

        <ControlButton primary onClick={handlePlayPause}>
          {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
          {isPlaying ? 'Pause' : currentStep === 0 ? 'Start' : 'Continue'}
        </ControlButton>

        <ControlButton
          onClick={() => handleStep('next')}
          disabled={currentStep >= moves.length}
        >
          Next <SkipForward className="w-5 h-5" />
        </ControlButton>

        <ControlButton
          primary
          amber
          onClick={handleComplete}
          disabled={currentStep >= moves.length}
        >
          Show All
        </ControlButton>

        <ControlButton onClick={handleReset}>Reset</ControlButton>
      </div>

      {/* Step Display */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentStep}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          className="bg-white rounded-xl p-4 shadow-inner text-center"
        >
          {type === 'path' ? (
            (() => {
              const pos =
                moves[Math.min(currentStep, moves.length - 1)];
              if (!pos) return null;
              return (
                <div className="text-lg font-bold text-gray-800">
                  Move to: Row {pos[0] + 1}, Column {pos[1] + 1}
                </div>
              );
            })()
          ) : (
            <div className="flex items-center justify-center gap-4">
              <div className="text-4xl font-bold text-gray-800">
                {moves[Math.min(currentStep, moves.length - 1)] ?? ''}
              </div>
              <div className="text-gray-600">
                Step {Math.min(currentStep + 1, moves.length)}
              </div>
            </div>
          )}
        </motion.div>
      </AnimatePresence>

      {/* Speed Control */}
      <div className="mt-6 pt-4 border-t border-gray-200 flex justify-between items-center">
        <span className="text-gray-600">Animation Speed:</span>
        <div className="flex gap-2">
          {(['slow', 'normal', 'fast'] as Speed[]).map((s) => (
            <motion.button
              key={s}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setSpeed(s)}
              className={`px-3 py-1 rounded-lg font-bold ${
                speed === s
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-100 text-gray-600'
              }`}
            >
              {s.charAt(0).toUpperCase() + s.slice(1)}
            </motion.button>
          ))}
        </div>
      </div>
    </motion.div>
  );
}

/* ------------------------------------------------------------------ */
/*  SMALL BUTTON COMPONENT                                             */
/* ------------------------------------------------------------------ */

function ControlButton({
  children,
  onClick,
  disabled,
  primary,
  amber,
}: {
  children: React.ReactNode;
  onClick: () => void;
  disabled?: boolean;
  primary?: boolean;
  amber?: boolean;
}) {
  return (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={onClick}
      disabled={disabled}
      className={`flex items-center gap-2 px-4 py-3 rounded-xl font-bold shadow-soft
        ${primary
          ? amber
            ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-white'
            : 'bg-gradient-to-r from-green-500 to-emerald-500 text-white'
          : 'bg-white text-gray-800'}
        disabled:opacity-50 disabled:cursor-not-allowed`}
    >
      {children}
    </motion.button>
  );
}

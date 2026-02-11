'use client';

import { motion } from 'framer-motion';
import { Color } from './data';

interface TileProps {
  value: string | Color;
  type: 'letter' | 'color';
  onClick?: () => void;
  isSelected?: boolean;
  isPlaced?: boolean;
  isCorrect?: boolean;
  isWrong?: boolean;
  size?: 'sm' | 'md' | 'lg';
  draggable?: boolean;
  onDragStart?: (e: React.DragEvent) => void;
  onDragEnd?: (e: React.DragEvent) => void;
}

export default function Tile({ 
  value, 
  type, 
  onClick, 
  isSelected = false,
  isPlaced = false,
  isCorrect = false,
  isWrong = false,
  size = 'md',
  draggable = false,
  onDragStart,
  onDragEnd
}: TileProps) {
  const sizeClasses = {
    sm: 'w-12 h-12 text-xl',
    md: 'w-16 h-16 text-2xl',
    lg: 'w-20 h-20 text-3xl',
  };

  const content = type === 'letter' 
    ? value as string
    : (value as Color).name.charAt(0).toUpperCase();

  const bgColor = type === 'color' 
    ? (value as Color).bgClass 
    : 'bg-white';

  const textColor = type === 'color' 
    ? (value as Color).textClass 
    : 'text-gray-800';

  const borderColor = isSelected 
    ? 'border-4 border-brand-teal' 
    : isCorrect 
    ? 'border-4 border-green-400' 
    : isWrong 
    ? 'border-4 border-red-400' 
    : 'border-2 border-gray-300';

  // Helper functions to handle both gesture and native drag events
  const handleGestureDragStart = (e: any) => {
    // For Framer Motion gesture drag, we need to trigger native drag
    if (draggable && onDragStart) {
      // Create a synthetic drag event for the native handler
      const syntheticEvent = {
        dataTransfer: new DataTransfer(),
        ...e,
        nativeEvent: e,
        persist: () => {},
        isDefaultPrevented: () => false,
        isPropagationStopped: () => false,
      } as React.DragEvent;
      onDragStart(syntheticEvent);
    }
  };

  const handleGestureDragEnd = (e: any) => {
    if (draggable && onDragEnd) {
      const syntheticEvent = {
        dataTransfer: new DataTransfer(),
        ...e,
        nativeEvent: e,
        persist: () => {},
        isDefaultPrevented: () => false,
        isPropagationStopped: () => false,
      } as React.DragEvent;
      onDragEnd(syntheticEvent);
    }
  };

  return (
    <motion.div
      whileHover={{ scale: draggable && !isPlaced ? 1.1 : 1 }}
      whileTap={{ scale: draggable && !isPlaced ? 0.9 : 1 }}
      drag={draggable && !isPlaced}
      dragConstraints={{ left: 0, right: 0, top: 0, bottom: 0 }}
      onDragStart={handleGestureDragStart}
      onDragEnd={handleGestureDragEnd}
      onClick={onClick}
      className={`
        ${sizeClasses[size]}
        ${bgColor}
        ${textColor}
        ${borderColor}
        rounded-2xl
        flex items-center justify-center
        font-outfit font-bold
        cursor-pointer
        select-none
        touch-none
        shadow-soft
        transition-all duration-200
        ${draggable && !isPlaced ? 'animate-float' : ''}
        ${isPlaced ? 'opacity-100' : 'opacity-100'}
      `}
      draggable={false} // Disable native drag when using Framer Motion
      data-tile-type={type}
      data-tile-value={type === 'letter' ? value : (value as Color).hex}
    >
      {content}
    </motion.div>
  );
}
'use client';

import { motion } from 'framer-motion';
import { Color } from './data';
import Tile from './Tile2';

interface SlotRowProps {
  slots: Array<{
    id: string;
    tile: { type: 'letter' | 'color'; value: string | Color } | null;
    correctValue: string | Color;
  }>;
  onSlotClick?: (slotId: string) => void;
  onDrop?: (slotId: string, e: React.DragEvent) => void;
  onDragOver?: (e: React.DragEvent) => void;
  showCorrectness?: boolean;
}

export default function SlotRow({ 
  slots, 
  onSlotClick, 
  onDrop, 
  onDragOver,
  showCorrectness = false 
}: SlotRowProps) {
  return (
    <div className="flex gap-4 justify-center flex-wrap">
      {slots.map((slot) => {
        const isCorrect = showCorrectness && slot.tile 
          ? (slot.tile.type === 'letter' 
              ? slot.tile.value === slot.correctValue
              : (slot.tile.value as Color).hex === (slot.correctValue as Color).hex)
          : false;

        return (
          <motion.div
            key={slot.id}
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            className={`
              w-20 h-20 rounded-2xl
              flex items-center justify-center
              border-4 border-dashed
              ${slot.tile ? 'border-transparent' : 'border-brand-grayBg'}
              transition-all duration-200
              hover:border-brand-teal
            `}
            onClick={() => onSlotClick?.(slot.id)}
            onDrop={(e) => onDrop?.(slot.id, e)}
            onDragOver={onDragOver}
            onDragEnter={(e) => e.preventDefault()}
          >
            {slot.tile ? (
              <Tile
                value={slot.tile.value}
                type={slot.tile.type}
                isPlaced={true}
                isCorrect={isCorrect && showCorrectness}
                size="md"
              />
            ) : (
              <div className="w-full h-full rounded-2xl bg-brand-grayBg opacity-30" />
            )}
          </motion.div>
        );
      })}
    </div>
  );
}
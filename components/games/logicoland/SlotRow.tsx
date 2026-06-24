"use client";

import { motion } from "framer-motion";
import { Color } from "./data";
import Tile from "./Tile2";

interface SlotRowProps {
  slots: Array<{
    id: string;
    tile: { type: "letter" | "color"; value: string | Color } | null;
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
  showCorrectness = false,
}: SlotRowProps) {
  return (
    <div className="flex flex-wrap justify-center gap-4">
      {slots.map((slot) => {
        const isCorrect =
          showCorrectness && slot.tile
            ? slot.tile.type === "letter"
              ? slot.tile.value === slot.correctValue
              : (slot.tile.value as Color).hex === (slot.correctValue as Color).hex
            : false;

        return (
          <motion.div
            key={slot.id}
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            className={`flex h-20 w-20 items-center justify-center rounded-2xl border-4 border-dashed ${slot.tile ? "border-transparent" : "border-brand-grayBg"} transition-all duration-200 hover:border-brand-teal`}
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
              <div className="h-full w-full rounded-2xl bg-brand-grayBg opacity-30" />
            )}
          </motion.div>
        );
      })}
    </div>
  );
}

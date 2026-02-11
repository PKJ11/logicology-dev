'use client';

import { motion } from 'framer-motion';
import Tile from './Tile2';
import { Color } from './data';

interface TileTrayProps {
  tiles: Array<{
    id: string;
    type: 'letter' | 'color';
    value: string | Color;
    isUsed: boolean;
  }>;
  onTileSelect?: (tileId: string) => void;
  selectedTileId?: string;
  draggable?: boolean;
  onDragStart?: (tileId: string, e: React.DragEvent) => void;
}

export default function TileTray({ 
  tiles, 
  onTileSelect, 
  selectedTileId,
  draggable = false,
  onDragStart 
}: TileTrayProps) {
  const availableTiles = tiles.filter(tile => !tile.isUsed);

  return (
    <div className="p-6 bg-white/90 rounded-4xl shadow-soft">
      <h3 className="font-outfit text-xl font-semibold text-center text-gray-700 mb-4">
        Drag or Tap Tiles
      </h3>
      <div className="flex flex-wrap gap-4 justify-center">
        {availableTiles.map((tile) => (
          <motion.div
            key={tile.id}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
          >
            <Tile
              value={tile.value}
              type={tile.type}
              onClick={() => onTileSelect?.(tile.id)}
              isSelected={selectedTileId === tile.id}
              draggable={draggable && !tile.isUsed}
              onDragStart={(e) => onDragStart?.(tile.id, e)}
              size="md"
            />
          </motion.div>
        ))}
      </div>
    </div>
  );
}
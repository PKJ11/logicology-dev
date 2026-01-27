import { Tile } from './types';
import { COLORS } from './types';

interface TileTrayProps {
  tiles: Tile[];
  selectedTile: Tile | null;
  onTileSelect: (tile: Tile) => void;
}

export default function TileTray({ tiles, selectedTile, onTileSelect }: TileTrayProps) {
  return (
    <div className="bg-gradient-to-r from-blue-50 to-sky-50 rounded-3xl p-6 shadow-soft border-2 border-blue-100">
      <h3 className="text-xl font-bold text-blue-800 mb-4 flex items-center gap-2">
        <span className="text-2xl">🎯</span> Tile Tray
        {selectedTile && (
          <span className="text-sm font-normal text-blue-600 ml-2">
            (Selected: {selectedTile.content})
          </span>
        )}
      </h3>
      
      <div className="grid grid-cols-4 md:grid-cols-8 gap-4">
        {tiles.map((tile) => (
          <button
            key={tile.id}
            onClick={() => onTileSelect(tile)}
            className={`w-16 h-16 md:w-20 md:h-20 rounded-2xl flex items-center justify-center shadow-md transition-all duration-300 transform hover:scale-105 ${
              selectedTile?.id === tile.id
                ? 'ring-4 ring-blue-400 ring-offset-2 scale-110'
                : 'hover:shadow-lg'
            }`}
            style={tile.type === 'color' ? { 
              backgroundColor: COLORS[tile.color as keyof typeof COLORS] 
            } : {}}
            aria-label={`${tile.type} tile: ${tile.content}`}
          >
            {tile.type === 'letter' ? (
              <span className="text-3xl md:text-4xl font-bold text-blue-800">{tile.content}</span>
            ) : (
              <span className="text-lg font-bold text-white">{tile.content}</span>
            )}
          </button>
        ))}
      </div>
      
      <div className="mt-4 text-center text-blue-600 text-sm">
        <p>Click a tile to select it, then click a slot to place it!</p>
        <p className="text-xs mt-1">You can also drag tiles on desktop</p>
      </div>
    </div>
  );
}
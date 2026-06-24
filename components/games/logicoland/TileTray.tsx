import { Tile } from "./types";
import { COLORS } from "./types";

interface TileTrayProps {
  tiles: Tile[];
  selectedTile: Tile | null;
  onTileSelect: (tile: Tile) => void;
}

export default function TileTray({ tiles, selectedTile, onTileSelect }: TileTrayProps) {
  return (
    <div className="rounded-3xl border-2 border-blue-100 bg-gradient-to-r from-blue-50 to-sky-50 p-6 shadow-soft">
      <h3 className="mb-4 flex items-center gap-2 text-xl font-bold text-blue-800">
        <span className="text-2xl">🎯</span> Tile Tray
        {selectedTile && (
          <span className="ml-2 text-sm font-normal text-blue-600">
            (Selected: {selectedTile.content})
          </span>
        )}
      </h3>

      <div className="grid grid-cols-4 gap-4 md:grid-cols-8">
        {tiles.map((tile) => (
          <button
            key={tile.id}
            onClick={() => onTileSelect(tile)}
            className={`flex h-16 w-16 transform items-center justify-center rounded-2xl shadow-md transition-all duration-300 hover:scale-105 md:h-20 md:w-20 ${
              selectedTile?.id === tile.id
                ? "scale-110 ring-4 ring-blue-400 ring-offset-2"
                : "hover:shadow-lg"
            }`}
            style={
              tile.type === "color"
                ? {
                    backgroundColor: COLORS[tile.color as keyof typeof COLORS],
                  }
                : {}
            }
            aria-label={`${tile.type} tile: ${tile.content}`}
          >
            {tile.type === "letter" ? (
              <span className="text-3xl font-bold text-blue-800 md:text-4xl">{tile.content}</span>
            ) : (
              <span className="text-lg font-bold text-white">{tile.content}</span>
            )}
          </button>
        ))}
      </div>

      <div className="mt-4 text-center text-sm text-blue-600">
        <p>Click a tile to select it, then click a slot to place it!</p>
        <p className="mt-1 text-xs">You can also drag tiles on desktop</p>
      </div>
    </div>
  );
}

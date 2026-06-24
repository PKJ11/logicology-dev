import { GameMode, Tile, Slot } from "./types";
import { COLORS } from "./types";

interface TaskCardProps {
  mode: GameMode;
  promptTiles: Tile[];
  answerSlots: Slot[];
  selectedTile: Tile | null;
  onSlotClick: (slotId: string) => void;
}

export default function TaskCard({
  mode,
  promptTiles,
  answerSlots,
  selectedTile,
  onSlotClick,
}: TaskCardProps) {
  return (
    <div className="rounded-3xl border-2 border-blue-100 bg-white p-6 shadow-soft md:p-8">
      <h3 className="mb-6 text-center text-2xl font-bold text-blue-800">
        {mode === "encode" ? "🔤 Encode the Word" : "🎨 Decode the Colors"}
      </h3>

      {/* Prompt Tiles */}
      <div className="mb-8 flex flex-wrap justify-center gap-4">
        {promptTiles.map((tile) => (
          <div
            key={tile.id}
            className={`flex h-20 w-20 items-center justify-center rounded-2xl shadow-md md:h-24 md:w-24 ${
              tile.type === "letter" ? "bg-gradient-to-r from-blue-100 to-sky-100" : ""
            }`}
            style={
              tile.type === "color"
                ? { backgroundColor: COLORS[tile.color as keyof typeof COLORS] }
                : {}
            }
          >
            {tile.type === "letter" ? (
              <span className="text-4xl font-bold text-blue-800 md:text-5xl">{tile.content}</span>
            ) : (
              <div className="flex h-full w-full items-center justify-center rounded-2xl">
                <span className="rounded bg-black/20 px-2 py-1 text-sm font-bold text-white">
                  {tile.content}
                </span>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Arrow */}
      <div className="mb-8 flex justify-center">
        <div className="h-2 w-16 rounded-full bg-gradient-to-r from-blue-400 to-purple-400"></div>
      </div>

      {/* Answer Slots */}
      <div className="flex flex-wrap justify-center gap-4">
        {answerSlots.map((slot) => (
          <div key={slot.id} className="relative">
            {/* Slot */}
            <button
              onClick={() => onSlotClick(slot.id)}
              className={`flex h-20 w-20 items-center justify-center rounded-2xl transition-all duration-300 md:h-24 md:w-24 ${
                selectedTile
                  ? "border-4 border-dashed border-blue-400 bg-blue-50 hover:bg-blue-100"
                  : slot.content
                    ? "shadow-md"
                    : "border-4 border-dashed border-gray-300 bg-gray-50 hover:bg-gray-100"
              }`}
              style={
                slot.content && slot.type === "color"
                  ? {
                      backgroundColor: COLORS[slot.content as keyof typeof COLORS],
                    }
                  : {}
              }
              aria-label={`Slot ${slot.position + 1}`}
            >
              {slot.content ? (
                slot.type === "letter" ? (
                  <span className="text-4xl font-bold text-blue-800 md:text-5xl">
                    {slot.content}
                  </span>
                ) : (
                  <span className="text-3xl font-bold text-white drop-shadow">
                    {slot.content?.charAt(0).toUpperCase()}
                  </span>
                )
              ) : (
                <span className="text-3xl text-gray-400">?</span>
              )}
            </button>

            {/* Slot indicator */}
            <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 transform text-sm font-semibold text-blue-700">
              {slot.position + 1}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

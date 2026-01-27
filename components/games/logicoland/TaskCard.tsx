import { GameMode, Tile, Slot } from './types';
import { COLORS } from './types';

interface TaskCardProps {
  mode: GameMode;
  promptTiles: Tile[];
  answerSlots: Slot[];
  selectedTile: Tile | null;
  onSlotClick: (slotId: string) => void;
}

export default function TaskCard({ mode, promptTiles, answerSlots, selectedTile, onSlotClick }: TaskCardProps) {
  return (
    <div className="bg-white rounded-3xl p-6 md:p-8 shadow-soft border-2 border-blue-100">
      <h3 className="text-2xl font-bold text-blue-800 mb-6 text-center">
        {mode === 'encode' ? '🔤 Encode the Word' : '🎨 Decode the Colors'}
      </h3>
      
      {/* Prompt Tiles */}
      <div className="flex justify-center flex-wrap gap-4 mb-8">
        {promptTiles.map((tile) => (
          <div
            key={tile.id}
            className={`w-20 h-20 md:w-24 md:h-24 rounded-2xl flex items-center justify-center shadow-md ${
              tile.type === 'letter' ? 'bg-gradient-to-r from-blue-100 to-sky-100' : ''
            }`}
            style={tile.type === 'color' ? { backgroundColor: COLORS[tile.color as keyof typeof COLORS] } : {}}
          >
            {tile.type === 'letter' ? (
              <span className="text-4xl md:text-5xl font-bold text-blue-800">{tile.content}</span>
            ) : (
              <div className="w-full h-full rounded-2xl flex items-center justify-center">
                <span className="text-sm font-bold text-white bg-black/20 px-2 py-1 rounded">
                  {tile.content}
                </span>
              </div>
            )}
          </div>
        ))}
      </div>
      
      {/* Arrow */}
      <div className="flex justify-center mb-8">
        <div className="w-16 h-2 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full"></div>
      </div>
      
      {/* Answer Slots */}
      <div className="flex justify-center flex-wrap gap-4">
        {answerSlots.map((slot) => (
          <div key={slot.id} className="relative">
            {/* Slot */}
            <button
              onClick={() => onSlotClick(slot.id)}
              className={`w-20 h-20 md:w-24 md:h-24 rounded-2xl flex items-center justify-center transition-all duration-300 ${
                selectedTile
                  ? 'border-4 border-dashed border-blue-400 bg-blue-50 hover:bg-blue-100'
                  : slot.content
                  ? 'shadow-md'
                  : 'border-4 border-dashed border-gray-300 bg-gray-50 hover:bg-gray-100'
              }`}
              style={slot.content && slot.type === 'color' ? { 
                backgroundColor: COLORS[slot.content as keyof typeof COLORS] 
              } : {}}
              aria-label={`Slot ${slot.position + 1}`}
            >
              {slot.content ? (
                slot.type === 'letter' ? (
                  <span className="text-4xl md:text-5xl font-bold text-blue-800">{slot.content}</span>
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
            <div className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 text-sm font-semibold text-blue-700">
              {slot.position + 1}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
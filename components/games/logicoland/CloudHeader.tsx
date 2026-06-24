import { GameMode } from "./types";
import { levels } from "./types";

interface CloudHeaderProps {
  mode: GameMode;
  onModeChange: (mode: GameMode) => void;
  currentLevel: number;
  onLevelChange: (levelId: number) => void;
}

export default function CloudHeader({
  mode,
  onModeChange,
  currentLevel,
  onLevelChange,
}: CloudHeaderProps) {
  return (
    <header className="relative mb-8">
      {/* Cloud shape */}
      <div className="relative rounded-[40px] bg-white px-4 py-6 shadow-soft md:px-8">
        {/* Cloud bumps */}
        <div className="absolute -top-4 left-1/4 h-16 w-16 rounded-full bg-white"></div>
        <div className="absolute -top-4 right-1/4 h-16 w-16 rounded-full bg-white"></div>
        <div className="absolute -top-6 left-1/2 h-20 w-20 -translate-x-1/2 transform rounded-full bg-white"></div>

        <div className="relative z-10">
          {/* Title */}
          <div className="mb-6 text-center">
            <h1 className="mb-2 font-heading text-3xl font-bold text-blue-800 md:text-4xl">
              Logicoland: Secret Code Mission
            </h1>
            <p className="text-lg text-blue-600">Can you crack the code?</p>
          </div>

          {/* Mode Toggle */}
          <div className="mb-6 flex justify-center">
            <div className="inline-flex rounded-full bg-gradient-to-r from-blue-50 to-sky-50 p-1">
              <button
                onClick={() => onModeChange("encode")}
                className={`rounded-full px-6 py-3 text-lg font-bold transition-all duration-300 ${
                  mode === "encode"
                    ? "bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-md"
                    : "text-blue-700 hover:bg-blue-100"
                }`}
              >
                🔤 Encode
              </button>
              <button
                onClick={() => onModeChange("decode")}
                className={`rounded-full px-6 py-3 text-lg font-bold transition-all duration-300 ${
                  mode === "decode"
                    ? "bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-md"
                    : "text-purple-700 hover:bg-purple-100"
                }`}
              >
                🎨 Decode
              </button>
            </div>
          </div>

          {/* Level Selector */}
          <div className="flex flex-wrap justify-center gap-2">
            {levels.map((level) => (
              <button
                key={level.id}
                onClick={() => onLevelChange(level.id)}
                className={`rounded-full px-4 py-2 font-bold transition-all duration-300 ${
                  currentLevel === level.id
                    ? "scale-105 bg-gradient-to-r from-green-500 to-teal-500 text-white shadow-md"
                    : "bg-gradient-to-r from-gray-100 to-gray-200 text-gray-700 hover:shadow-md"
                }`}
              >
                {level.name}
              </button>
            ))}
          </div>
        </div>
      </div>
    </header>
  );
}

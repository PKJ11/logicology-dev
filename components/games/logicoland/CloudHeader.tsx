import { GameMode } from './types';
import { levels } from './types';

interface CloudHeaderProps {
  mode: GameMode;
  onModeChange: (mode: GameMode) => void;
  currentLevel: number;
  onLevelChange: (levelId: number) => void;
}

export default function CloudHeader({ mode, onModeChange, currentLevel, onLevelChange }: CloudHeaderProps) {
  return (
    <header className="relative mb-8">
      {/* Cloud shape */}
      <div className="relative bg-white rounded-[40px] shadow-soft py-6 px-4 md:px-8">
        {/* Cloud bumps */}
        <div className="absolute -top-4 left-1/4 w-16 h-16 bg-white rounded-full"></div>
        <div className="absolute -top-4 right-1/4 w-16 h-16 bg-white rounded-full"></div>
        <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 w-20 h-20 bg-white rounded-full"></div>
        
        <div className="relative z-10">
          {/* Title */}
          <div className="text-center mb-6">
            <h1 className="text-3xl md:text-4xl font-heading font-bold text-blue-800 mb-2">
              Logicoland: Secret Code Mission
            </h1>
            <p className="text-blue-600 text-lg">Can you crack the code?</p>
          </div>
          
          {/* Mode Toggle */}
          <div className="flex justify-center mb-6">
            <div className="bg-gradient-to-r from-blue-50 to-sky-50 rounded-full p-1 inline-flex">
              <button
                onClick={() => onModeChange('encode')}
                className={`px-6 py-3 rounded-full font-bold text-lg transition-all duration-300 ${
                  mode === 'encode'
                    ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-md'
                    : 'text-blue-700 hover:bg-blue-100'
                }`}
              >
                🔤 Encode
              </button>
              <button
                onClick={() => onModeChange('decode')}
                className={`px-6 py-3 rounded-full font-bold text-lg transition-all duration-300 ${
                  mode === 'decode'
                    ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-md'
                    : 'text-purple-700 hover:bg-purple-100'
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
                className={`px-4 py-2 rounded-full font-bold transition-all duration-300 ${
                  currentLevel === level.id
                    ? 'bg-gradient-to-r from-green-500 to-teal-500 text-white shadow-md scale-105'
                    : 'bg-gradient-to-r from-gray-100 to-gray-200 text-gray-700 hover:shadow-md'
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
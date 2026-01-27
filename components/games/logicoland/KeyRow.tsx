import { Level } from './types';
import { COLORS } from './types';

interface KeyRowProps {
  level: Level;
}

export default function KeyRow({ level }: KeyRowProps) {
  return (
    <div className="bg-gradient-to-r from-blue-50 to-sky-50 rounded-3xl p-6 shadow-soft border-2 border-blue-100">
      <h3 className="text-xl font-bold text-blue-800 mb-4 flex items-center gap-2">
        <span className="text-2xl">🔑</span> Decoding Key
      </h3>
      <div className="grid grid-cols-4 md:grid-cols-8 gap-4">
        {level.letters.map((letter, index) => (
          <div key={letter} className="text-center">
            <div className="w-16 h-16 md:w-20 md:h-20 rounded-2xl flex items-center justify-center mx-auto mb-2 shadow-md"
                 style={{ backgroundColor: COLORS[level.colorMap[letter] as keyof typeof COLORS] }}>
              <span className="text-3xl md:text-4xl font-bold text-white">{letter}</span>
            </div>
            <div className="w-12 h-4 rounded-full mx-auto mb-2"
                 style={{ backgroundColor: COLORS[level.colorMap[letter] as keyof typeof COLORS] }}></div>
            <span className="text-sm font-semibold text-blue-700">
              {level.colorMap[letter].charAt(0).toUpperCase() + level.colorMap[letter].slice(1)}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
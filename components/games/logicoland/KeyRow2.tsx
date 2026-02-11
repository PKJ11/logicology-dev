'use client';

import { Color } from './data';

interface KeyRowProps {
  colorMap: Record<string, Color>;
}

export default function KeyRow({ colorMap }: KeyRowProps) {
  return (
    <div className="bg-white/80 rounded-3xl p-4 md:p-6 shadow-soft">
      <h4 className="font-outfit text-lg font-semibold text-center text-gray-700 mb-4">
        Color Key
      </h4>
      <div className="flex flex-wrap gap-3 md:gap-4 justify-center">
        {Object.entries(colorMap).map(([letter, color]) => (
          <div 
            key={letter}
            className="flex items-center gap-2 px-3 py-2 rounded-xl bg-brand-grayBg"
          >
            <div 
              className={`w-8 h-8 rounded-xl ${color.bgClass} border-2 border-white shadow-soft`}
            />
            <span className="font-outfit font-bold text-lg text-gray-800">
              {letter}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
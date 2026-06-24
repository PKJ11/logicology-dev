"use client";

import { Color } from "./data";

interface KeyRowProps {
  colorMap: Record<string, Color>;
}

export default function KeyRow({ colorMap }: KeyRowProps) {
  return (
    <div className="rounded-3xl bg-white/80 p-4 shadow-soft md:p-6">
      <h4 className="font-outfit mb-4 text-center text-lg font-semibold text-gray-700">
        Color Key
      </h4>
      <div className="flex flex-wrap justify-center gap-3 md:gap-4">
        {Object.entries(colorMap).map(([letter, color]) => (
          <div
            key={letter}
            className="flex items-center gap-2 rounded-xl bg-brand-grayBg px-3 py-2"
          >
            <div
              className={`h-8 w-8 rounded-xl ${color.bgClass} border-2 border-white shadow-soft`}
            />
            <span className="font-outfit text-lg font-bold text-gray-800">{letter}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

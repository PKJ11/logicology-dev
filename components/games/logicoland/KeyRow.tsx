import { Level } from "./types";
import { COLORS } from "./types";

interface KeyRowProps {
  level: Level;
}

export default function KeyRow({ level }: KeyRowProps) {
  return (
    <div className="rounded-3xl border-2 border-blue-100 bg-gradient-to-r from-blue-50 to-sky-50 p-6 shadow-soft">
      <h3 className="mb-4 flex items-center gap-2 text-xl font-bold text-blue-800">
        <span className="text-2xl">🔑</span> Decoding Key
      </h3>
      <div className="grid grid-cols-4 gap-4 md:grid-cols-8">
        {level.letters.map((letter, index) => (
          <div key={letter} className="text-center">
            <div
              className="mx-auto mb-2 flex h-16 w-16 items-center justify-center rounded-2xl shadow-md md:h-20 md:w-20"
              style={{ backgroundColor: COLORS[level.colorMap[letter] as keyof typeof COLORS] }}
            >
              <span className="text-3xl font-bold text-white md:text-4xl">{letter}</span>
            </div>
            <div
              className="mx-auto mb-2 h-4 w-12 rounded-full"
              style={{ backgroundColor: COLORS[level.colorMap[letter] as keyof typeof COLORS] }}
            ></div>
            <span className="text-sm font-semibold text-blue-700">
              {level.colorMap[letter].charAt(0).toUpperCase() + level.colorMap[letter].slice(1)}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

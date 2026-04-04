"use client";

import React from "react";
import { GamePhase } from "@/app/voice-games/lib/types";

interface VoiceMicButtonProps {
  phase: GamePhase;
  secondsLeft: number;
  listenWindowSeconds?: number;
  color?: "blue" | "purple" | "green";
}

const COLORS = {
  blue:   { ring: "#3b82f6", pulse: "bg-blue-400",   btn: "bg-blue-600"   },
  purple: { ring: "#9333ea", pulse: "bg-purple-400",  btn: "bg-purple-600" },
  green:  { ring: "#22c55e", pulse: "bg-green-400",   btn: "bg-green-600"  },
};

export const VoiceMicButton: React.FC<VoiceMicButtonProps> = ({
  phase,
  secondsLeft,
  listenWindowSeconds = 10,
  color = "blue",
}) => {
  const c = COLORS[color];
  const R = 44;
  const circ = 2 * Math.PI * R;
  const dash = circ * (secondsLeft / listenWindowSeconds);

  return (
    <div className="flex flex-col items-center gap-3 select-none">
      <div className="relative w-28 h-28">
        {/* Countdown ring — only rendered while listening */}
        {phase === "listening" && (
          <svg
            className="absolute inset-0 w-full h-full -rotate-90"
            viewBox="0 0 100 100"
          >
            <circle cx="50" cy="50" r={R} fill="none" stroke="#e5e7eb" strokeWidth="6" />
            <circle
              cx="50" cy="50" r={R} fill="none"
              stroke={c.ring} strokeWidth="6" strokeLinecap="round"
              strokeDasharray={`${dash} ${circ}`}
              style={{ transition: "stroke-dasharray 0.95s linear" }}
            />
          </svg>
        )}

        {/* Button disc */}
        <div
          className={`
            absolute inset-3 rounded-full flex items-center justify-center shadow-lg
            transition-colors duration-300
            ${phase === "listening" ? c.btn : "bg-gray-300"}
            ${phase === "result" ? "!bg-transparent" : ""}
          `}
        >
          {phase === "result"   && <span className="text-4xl">🎯</span>}
          {phase === "speaking" && <span className="text-3xl">🔊</span>}
          {phase === "listening" && (
            <svg xmlns="http://www.w3.org/2000/svg" className="w-10 h-10 text-white" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 15a3 3 0 003-3V6a3 3 0 00-6 0v6a3 3 0 003 3z" />
              <path d="M19 11a1 1 0 10-2 0 5 5 0 01-10 0 1 1 0 10-2 0 7 7 0 0014 0z" />
            </svg>
          )}
          {phase === "idle" && (
            <svg xmlns="http://www.w3.org/2000/svg" className="w-10 h-10 text-gray-400" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 15a3 3 0 003-3V6a3 3 0 00-6 0v6a3 3 0 003 3z" />
              <path d="M19 11a1 1 0 10-2 0 5 5 0 01-10 0 1 1 0 10-2 0 7 7 0 0014 0z" />
            </svg>
          )}
        </div>

        {/* Pulse animation — only while listening */}
        {phase === "listening" && (
          <span className={`absolute inset-3 rounded-full ${c.pulse} opacity-20 animate-ping`} />
        )}
      </div>

      {/* Status label */}
      <p className="text-sm font-semibold text-gray-500 tracking-widest uppercase">
        {phase === "idle"      && "Ready"}
        {phase === "speaking"  && "Listen…"}
        {phase === "listening" && `Speak now — ${secondsLeft}s`}
        {phase === "result"    && "Checking…"}
      </p>
    </div>
  );
};
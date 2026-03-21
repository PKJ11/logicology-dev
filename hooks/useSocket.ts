"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { io, Socket } from "socket.io-client";

export type GameMode = "free-for-all" | "first-click" | "race";

export interface Player {
  id: string;
  name: string;
  score: number;
  color: string;
}

export interface Room {
  id: string;
  players: Player[];
  host: string;
  mode: GameMode;
  status: "waiting" | "playing" | "finished";
  currentCountry: { name: string; code: string } | null;
  roundStartedAt: number | null;
  roundNum: number;
  totalRounds: number;
}

export interface ClickResult {
  correct: boolean;
  countryName: string;
  playerName: string;
  points?: number;
  color?: string;
  late?: boolean;
}

let socketSingleton: Socket | null = null;

function getSocket(): Socket {
  if (!socketSingleton) {
    const SOCKET_URL = "https://logicology-map-socket.onrender.com";

    socketSingleton = io(SOCKET_URL, {
      // NO path — the Render server listens at root, not /api/socket
      transports: ["websocket", "polling"],
    });
  }
  return socketSingleton;
}

export function useSocket() {
  const socketRef = useRef<Socket | null>(null);
  const [connected, setConnected] = useState(false);
  const [room, setRoom] = useState<Room | null>(null);
  const [playerId, setPlayerId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [lastResult, setLastResult] = useState<ClickResult | null>(null);
  const [gameOver, setGameOver] = useState<{ players: Player[]; reason?: string } | null>(null);
  const [roundCountry, setRoundCountry] = useState<{ name: string; code: string } | null>(null);
  const [roundTimeout, setRoundTimeout] = useState(false);
  const [gameStarted, setGameStarted] = useState(false);

  useEffect(() => {
    const socket = getSocket();
    socketRef.current = socket;

    const onConnect = () => setConnected(true);
    const onDisconnect = () => setConnected(false);

    socket.on("connect", onConnect);
    socket.on("disconnect", onDisconnect);
    if (socket.connected) setConnected(true);

    socket.on("room:update", (r: Room) => setRoom(r));

    socket.on("room:created", ({ roomId, playerId: pid }: { roomId: string; playerId: string }) => {
      setPlayerId(pid);
      setError(null);
    });

    socket.on("room:joined", ({ playerId: pid }: { playerId: string }) => {
      setPlayerId(pid);
      setError(null);
    });

    socket.on("game:started", () => {
      setGameStarted(true);
      setGameOver(null);
      setRoundTimeout(false);
    });

    socket.on("round:start", ({ country }: { country: { name: string; code: string } }) => {
      setRoundCountry(country);
      setRoundTimeout(false);
      setLastResult(null);
    });

    socket.on("round:timeout", () => setRoundTimeout(true));

    socket.on("click:result", (result: ClickResult) => setLastResult(result));

    socket.on("game:over", (data: { players: Player[]; reason?: string }) => {
      setGameOver(data);
      setGameStarted(false);
    });

    socket.on("error", ({ message }: { message: string }) => setError(message));

    return () => {
      socket.off("connect", onConnect);
      socket.off("disconnect", onDisconnect);
      socket.off("room:update");
      socket.off("room:created");
      socket.off("room:joined");
      socket.off("game:started");
      socket.off("round:start");
      socket.off("round:timeout");
      socket.off("click:result");
      socket.off("game:over");
      socket.off("error");
    };
  }, []);

  const createRoom = useCallback((playerName: string, mode: GameMode, totalRounds: number) => {
    socketRef.current?.emit("room:create", { playerName, mode, totalRounds });
  }, []);

  const joinRoom = useCallback((roomId: string, playerName: string) => {
    socketRef.current?.emit("room:join", { roomId, playerName });
  }, []);

  const startGame = useCallback(() => {
    socketRef.current?.emit("game:start");
  }, []);

  const clickCountry = useCallback((countryCode: string, countryName: string) => {
    socketRef.current?.emit("country:click", { countryCode, countryName });
  }, []);

  const resetGame = useCallback(() => {
    setGameOver(null);
    setGameStarted(false);
    setRoundCountry(null);
    setLastResult(null);
    setRoundTimeout(false);
    // Reset singleton so next game gets a fresh connection
    if (socketSingleton) {
      socketSingleton.disconnect();
      socketSingleton = null;
    }
  }, []);

  return {
    connected,
    room,
    playerId,
    error,
    lastResult,
    gameOver,
    roundCountry,
    roundTimeout,
    gameStarted,
    createRoom,
    joinRoom,
    startGame,
    clickCountry,
    resetGame,
    setError,
  };
}
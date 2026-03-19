// app/api/socket/route.ts
// Socket.IO server — Next.js App Router custom server integration.
// Install: npm install socket.io socket.io-client

import { NextRequest } from "next/server";
import { Server as SocketIOServer } from "socket.io";

// ─── Types ────────────────────────────────────────────────────────────────────

export type GameMode = "free-for-all" | "first-click" | "race";

interface Player {
  id: string;
  name: string;
  score: number;
  color: string;
}

interface Room {
  id: string;
  players: Player[];
  host: string;
  mode: GameMode;
  status: "waiting" | "playing" | "finished";
  currentCountry: { name: string; code: string } | null;
  roundStartedAt: number | null;
  roundWon: boolean; // for first-click / race: was this round already claimed?
  roundNum: number;
  totalRounds: number;
}

// ─── Country List ─────────────────────────────────────────────────────────────

const COUNTRIES = [
  { name: "United States of America", code: "USA" },
  { name: "Canada", code: "CAN" },
  { name: "Brazil", code: "BRA" },
  { name: "Argentina", code: "ARG" },
  { name: "United Kingdom", code: "GBR" },
  { name: "France", code: "FRA" },
  { name: "Germany", code: "DEU" },
  { name: "Italy", code: "ITA" },
  { name: "Spain", code: "ESP" },
  { name: "Russia", code: "RUS" },
  { name: "China", code: "CHN" },
  { name: "India", code: "IND" },
  { name: "Japan", code: "JPN" },
  { name: "South Korea", code: "KOR" },
  { name: "Indonesia", code: "IDN" },
  { name: "Australia", code: "AUS" },
  { name: "Egypt", code: "EGY" },
  { name: "South Africa", code: "ZAF" },
  { name: "Nigeria", code: "NGA" },
  { name: "Mexico", code: "MEX" },
];

const PLAYER_COLORS = ["#00b4a6", "#FF6B6B", "#FFD93D", "#6BCB77", "#4D96FF", "#C77DFF"];

const randomCountry = () => COUNTRIES[Math.floor(Math.random() * COUNTRIES.length)];
const generateRoomId = () => Math.random().toString(36).substring(2, 7).toUpperCase();

// ─── Global state (survives hot-reload via globalThis) ────────────────────────

declare global {
  // eslint-disable-next-line no-var
  var _socketIO: SocketIOServer | undefined;
  // eslint-disable-next-line no-var
  var _rooms: Map<string, Room> | undefined;
  // eslint-disable-next-line no-var
  var _roundTimers: Map<string, ReturnType<typeof setTimeout>> | undefined;
}

const rooms: Map<string, Room> = (globalThis._rooms ??= new Map());
const roundTimers: Map<string, ReturnType<typeof setTimeout>> = (globalThis._roundTimers ??= new Map());

// ─── Socket.IO init (singleton) ───────────────────────────────────────────────

function initSocketServer() {
  if (globalThis._socketIO) return globalThis._socketIO;

  const io = new SocketIOServer({
    cors: { origin: "*", methods: ["GET", "POST"] },
  });

  // ── Helpers ──

  function broadcastRoom(roomId: string) {
    const room = rooms.get(roomId);
    if (room) io.to(roomId).emit("room:update", room);
  }

  function startRound(roomId: string) {
    const room = rooms.get(roomId);
    if (!room || room.status !== "playing") return;

    clearRoundTimer(roomId);

    room.currentCountry = randomCountry();
    room.roundStartedAt = Date.now();
    room.roundWon = false;

    broadcastRoom(roomId);
    io.to(roomId).emit("round:start", {
      country: room.currentCountry,
      roundNum: room.roundNum,
      totalRounds: room.totalRounds,
    });

    // 20-second auto-advance
    const timer = setTimeout(() => {
      const r = rooms.get(roomId);
      if (!r || r.status !== "playing") return;
      io.to(roomId).emit("round:timeout", { country: r.currentCountry });
      advanceRound(roomId);
    }, 20_000);

    roundTimers.set(roomId, timer);
  }

  function advanceRound(roomId: string) {
    clearRoundTimer(roomId);
    const room = rooms.get(roomId);
    if (!room) return;

    room.roundNum += 1;

    if (room.roundNum > room.totalRounds) {
      room.status = "finished";
      broadcastRoom(roomId);
      io.to(roomId).emit("game:over", { players: room.players });
      return;
    }

    setTimeout(() => startRound(roomId), 1_500);
  }

  function clearRoundTimer(roomId: string) {
    const t = roundTimers.get(roomId);
    if (t) { clearTimeout(t); roundTimers.delete(roomId); }
  }

  // ── Connection ──

  io.on("connection", (socket) => {
    // ── Create room ──
    socket.on("room:create", ({ playerName, mode, totalRounds }: { playerName: string; mode: GameMode; totalRounds: number }) => {
      const roomId = generateRoomId();
      const player: Player = {
        id: socket.id,
        name: playerName,
        score: 0,
        color: PLAYER_COLORS[0],
      };
      const room: Room = {
        id: roomId,
        players: [player],
        host: socket.id,
        mode,
        status: "waiting",
        currentCountry: null,
        roundStartedAt: null,
        roundWon: false,
        roundNum: 1,
        totalRounds: totalRounds ?? 10,
      };
      rooms.set(roomId, room);
      socket.join(roomId);
      socket.data.roomId = roomId;
      socket.emit("room:created", { roomId, playerId: socket.id });
      broadcastRoom(roomId);
    });

    // ── Join room ──
    socket.on("room:join", ({ roomId, playerName }: { roomId: string; playerName: string }) => {
      const room = rooms.get(roomId.toUpperCase());
      if (!room) { socket.emit("error", { message: "Room not found" }); return; }
      if (room.players.length >= 4) { socket.emit("error", { message: "Room is full (max 4 players)" }); return; }
      if (room.status !== "waiting") { socket.emit("error", { message: "Game already in progress" }); return; }

      const player: Player = {
        id: socket.id,
        name: playerName,
        score: 0,
        color: PLAYER_COLORS[room.players.length % PLAYER_COLORS.length],
      };
      room.players.push(player);
      socket.join(roomId.toUpperCase());
      socket.data.roomId = roomId.toUpperCase();
      socket.emit("room:joined", { roomId: roomId.toUpperCase(), playerId: socket.id });
      broadcastRoom(roomId.toUpperCase());
    });

    // ── Start game (host only) ──
    socket.on("game:start", () => {
      const roomId = socket.data.roomId;
      const room = rooms.get(roomId);
      if (!room || room.host !== socket.id) return;
      if (room.players.length < 2) { socket.emit("error", { message: "Need at least 2 players to start" }); return; }

      room.status = "playing";
      room.roundNum = 1;
      room.players.forEach((p) => (p.score = 0));
      broadcastRoom(roomId);
      io.to(roomId).emit("game:started");
      startRound(roomId);
    });

    // ── Country click ──
    socket.on("country:click", ({ countryCode, countryName }: { countryCode: string; countryName: string }) => {
      const roomId = socket.data.roomId;
      const room = rooms.get(roomId);
      if (!room || room.status !== "playing" || !room.currentCountry) return;

      const isCorrect =
        countryCode === room.currentCountry.code ||
        countryName === room.currentCountry.name;

      const player = room.players.find((p) => p.id === socket.id);
      if (!player) return;

      if (!isCorrect) {
        socket.emit("click:result", { correct: false, countryName, playerName: player.name });
        return;
      }

      // ── Score by mode ──
      if (room.mode === "free-for-all") {
        // Everyone can score independently each round
        player.score += 1;
        io.to(roomId).emit("click:result", { correct: true, countryName: room.currentCountry.name, playerName: player.name, points: 1 });
        broadcastRoom(roomId);
        advanceRound(roomId);

      } else if (room.mode === "first-click") {
        // Only first correct click wins the round
        if (room.roundWon) {
          socket.emit("click:result", { correct: true, countryName: room.currentCountry.name, playerName: player.name, points: 0, late: true });
          return;
        }
        room.roundWon = true;
        player.score += 1;
        io.to(roomId).emit("click:result", { correct: true, countryName: room.currentCountry.name, playerName: player.name, points: 1 });
        broadcastRoom(roomId);
        advanceRound(roomId);

      } else if (room.mode === "race") {
        // Faster = more points (10 at 0s → 1 at 20s)
        if (room.roundWon) {
          socket.emit("click:result", { correct: true, countryName: room.currentCountry.name, playerName: player.name, points: 0, late: true });
          return;
        }
        room.roundWon = true;
        const elapsed = (Date.now() - (room.roundStartedAt ?? Date.now())) / 1000;
        const points = Math.max(1, Math.round(10 - (elapsed / 20) * 9));
        player.score += points;
        io.to(roomId).emit("click:result", { correct: true, countryName: room.currentCountry.name, playerName: player.name, points });
        broadcastRoom(roomId);
        advanceRound(roomId);
      }
    });

    // ── Disconnect ──
    socket.on("disconnect", () => {
      const roomId = socket.data.roomId;
      if (!roomId) return;
      const room = rooms.get(roomId);
      if (!room) return;

      room.players = room.players.filter((p) => p.id !== socket.id);

      if (room.players.length === 0) {
        clearRoundTimer(roomId);
        rooms.delete(roomId);
        return;
      }

      // Transfer host if needed
      if (room.host === socket.id) room.host = room.players[0].id;

      // End game if not enough players mid-game
      if (room.status === "playing" && room.players.length < 2) {
        clearRoundTimer(roomId);
        room.status = "finished";
        io.to(roomId).emit("game:over", { players: room.players, reason: "Not enough players" });
      }

      broadcastRoom(roomId);
    });
  });

  globalThis._socketIO = io;
  return io;
}

// ─── Route handler ─────────────────────────────────────────────────────────────
// Next.js App Router doesn't support raw WebSocket upgrades natively.
// We use a custom server (server.ts/server.js) instead.
// This route is a placeholder — the real Socket.IO server is attached in server.ts.

export async function GET(_req: NextRequest) {
  initSocketServer(); // ensure singleton is alive
  return new Response("Socket.IO server running", { status: 200 });
}
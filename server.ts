// server.ts  ← place at project root, alongside package.json
// Run with: npx ts-node --project tsconfig.server.json server.ts
// Or add to package.json scripts: "dev": "ts-node server.ts"
//
// Install deps: npm install socket.io socket.io-client

import { createServer } from "http";
import { parse } from "url";
import next from "next";
import { Server as SocketIOServer } from "socket.io";

const dev = process.env.NODE_ENV !== "production";
const app = next({ dev });
const handle = app.getRequestHandler();

// ─── Types ────────────────────────────────────────────────────────────────────

type GameMode = "free-for-all" | "first-click" | "race";

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
  roundWon: boolean;
  roundNum: number;
  totalRounds: number;
}

// ─── Data ─────────────────────────────────────────────────────────────────────

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

const rooms = new Map<string, Room>();
const roundTimers = new Map<string, ReturnType<typeof setTimeout>>();

// ─── Boot ─────────────────────────────────────────────────────────────────────

app.prepare().then(() => {
  const httpServer = createServer((req, res) => {
    const parsedUrl = parse(req.url!, true);
    handle(req, res, parsedUrl);
  });

  const io = new SocketIOServer(httpServer, {
    path: "/api/socket",
    cors: { origin: "*", methods: ["GET", "POST"] },
  });

  // ── Helpers ──

  function broadcastRoom(roomId: string) {
    const room = rooms.get(roomId);
    if (room) io.to(roomId).emit("room:update", room);
  }

  function clearRoundTimer(roomId: string) {
    const t = roundTimers.get(roomId);
    if (t) { clearTimeout(t); roundTimers.delete(roomId); }
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
    const timer = setTimeout(() => {
      const r = rooms.get(roomId);
      if (!r || r.status !== "playing") return;
      io.to(roomId).emit("round:timeout", { country: r.currentCountry });
      advanceRound(roomId);
    }, 20_000);
    roundTimers.set(roomId, timer);
  }

  // ── Socket events ──

  io.on("connection", (socket) => {
    console.log("connected:", socket.id);

    socket.on("room:create", ({ playerName, mode, totalRounds }: { playerName: string; mode: GameMode; totalRounds: number }) => {
      const roomId = generateRoomId();
      const player: Player = { id: socket.id, name: playerName, score: 0, color: PLAYER_COLORS[0] };
      rooms.set(roomId, {
        id: roomId, players: [player], host: socket.id, mode,
        status: "waiting", currentCountry: null, roundStartedAt: null,
        roundWon: false, roundNum: 1, totalRounds: totalRounds ?? 10,
      });
      socket.join(roomId);
      socket.data.roomId = roomId;
      socket.emit("room:created", { roomId, playerId: socket.id });
      broadcastRoom(roomId);
    });

    socket.on("room:join", ({ roomId, playerName }: { roomId: string; playerName: string }) => {
      const id = roomId.toUpperCase();
      const room = rooms.get(id);
      if (!room) { socket.emit("error", { message: "Room not found" }); return; }
      if (room.players.length >= 4) { socket.emit("error", { message: "Room is full" }); return; }
      if (room.status !== "waiting") { socket.emit("error", { message: "Game already started" }); return; }
      const player: Player = { id: socket.id, name: playerName, score: 0, color: PLAYER_COLORS[room.players.length % PLAYER_COLORS.length] };
      room.players.push(player);
      socket.join(id);
      socket.data.roomId = id;
      socket.emit("room:joined", { roomId: id, playerId: socket.id });
      broadcastRoom(id);
    });

    socket.on("game:start", () => {
      const roomId = socket.data.roomId;
      const room = rooms.get(roomId);
      if (!room || room.host !== socket.id) return;
      if (room.players.length < 2) { socket.emit("error", { message: "Need at least 2 players" }); return; }
      room.status = "playing";
      room.roundNum = 1;
      room.players.forEach((p) => (p.score = 0));
      broadcastRoom(roomId);
      io.to(roomId).emit("game:started");
      startRound(roomId);
    });

    socket.on("country:click", ({ countryCode, countryName }: { countryCode: string; countryName: string }) => {
      const roomId = socket.data.roomId;
      const room = rooms.get(roomId);
      if (!room || room.status !== "playing" || !room.currentCountry) return;

      const isCorrect = countryCode === room.currentCountry.code || countryName === room.currentCountry.name;
      const player = room.players.find((p) => p.id === socket.id);
      if (!player) return;

      if (!isCorrect) {
        socket.emit("click:result", { correct: false, countryName, playerName: player.name });
        return;
      }

      if (room.mode === "free-for-all") {
        player.score += 1;
        io.to(roomId).emit("click:result", { correct: true, countryName: room.currentCountry.name, playerName: player.name, points: 1, color: player.color });
        broadcastRoom(roomId);
        advanceRound(roomId);

      } else if (room.mode === "first-click") {
        if (room.roundWon) { socket.emit("click:result", { correct: true, late: true, points: 0, countryName: room.currentCountry.name, playerName: player.name }); return; }
        room.roundWon = true;
        player.score += 1;
        io.to(roomId).emit("click:result", { correct: true, countryName: room.currentCountry.name, playerName: player.name, points: 1, color: player.color });
        broadcastRoom(roomId);
        advanceRound(roomId);

      } else if (room.mode === "race") {
        if (room.roundWon) { socket.emit("click:result", { correct: true, late: true, points: 0, countryName: room.currentCountry.name, playerName: player.name }); return; }
        room.roundWon = true;
        const elapsed = (Date.now() - (room.roundStartedAt ?? Date.now())) / 1000;
        const points = Math.max(1, Math.round(10 - (elapsed / 20) * 9));
        player.score += points;
        io.to(roomId).emit("click:result", { correct: true, countryName: room.currentCountry.name, playerName: player.name, points, color: player.color });
        broadcastRoom(roomId);
        advanceRound(roomId);
      }
    });

    socket.on("disconnect", () => {
      const roomId = socket.data.roomId;
      if (!roomId) return;
      const room = rooms.get(roomId);
      if (!room) return;
      room.players = room.players.filter((p) => p.id !== socket.id);
      if (room.players.length === 0) { clearRoundTimer(roomId); rooms.delete(roomId); return; }
      if (room.host === socket.id) room.host = room.players[0].id;
      if (room.status === "playing" && room.players.length < 2) {
        clearRoundTimer(roomId);
        room.status = "finished";
        io.to(roomId).emit("game:over", { players: room.players, reason: "Not enough players" });
      }
      broadcastRoom(roomId);
    });
  });

  const PORT = process.env.PORT || 3000;
  httpServer.listen(PORT, () => {
    console.log(`> Ready on http://localhost:${PORT}`);
  });
});
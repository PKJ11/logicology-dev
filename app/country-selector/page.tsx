// app/country-selector/page.tsx
"use client";

import WorldMap, { CountryFeature } from "@/components/WorldMap";
import { GameMode, useSocket, Player } from "hooks/useSocket";
import { useState, useEffect, useRef } from "react";

// ─── Mode meta with softer kid-friendly colors ────────────────────────────────

const MODES: { key: GameMode; label: string; icon: string; desc: string; color: string; bgColor: string }[] = [
  {
    key: "free-for-all",
    label: "Everyone Wins",
    icon: "🌈",
    desc: "Everybody gets a point when they find the country!",
    color: "#4A90E2", // Soft blue
    bgColor: "#E8F0FE",
  },
  {
    key: "first-click",
    label: "Super Speedy",
    icon: "⚡",
    desc: "Only the fastest explorer gets the point!",
    color: "#F5A623", // Soft orange
    bgColor: "#FFF0D9",
  },
  {
    key: "race",
    label: "Race Around",
    icon: "🏁",
    desc: "Quick clicks = more points!",
    color: "#7ED321", // Soft green
    bgColor: "#E9F7D9",
  },
];

// ─── Simple Animal Avatars ─────────────────────────────────────────────────

const ANIMAL_AVATARS = [
  { emoji: "🐼", name: "Panda" },
  { emoji: "🦁", name: "Lion" },
  { emoji: "🐧", name: "Penguin" },
  { emoji: "🦊", name: "Fox" },
];

// ─── Fun Facts for Countries ─────────────────────────────────────────────────

const COUNTRY_FACTS: Record<string, string> = {
  // Americas
  "United States of America": "Home to Yellowstone, the world's first national park!",
  "Canada": "Has more lakes than the rest of the world combined!",
  "Brazil": "Home to the Amazon, the world's largest rainforest!",
  "Argentina": "Has the highest peak in the Western Hemisphere — Mount Aconcagua!",
  "Mexico": "Gave the world chocolate, corn, and chili peppers!",
  "Colombia": "Is the only country in South America with both Pacific and Caribbean coasts!",
  "Peru": "Home to Machu Picchu, built high in the Andes mountains!",
  "Chile": "Is the longest country in the world from north to south!",
  "Venezuela": "Has the world's highest waterfall — Angel Falls!",
  "Ecuador": "Is one of the few countries named after a geographical feature — the Equator!",
  "Bolivia": "Has two capital cities — Sucre and La Paz!",
  "Paraguay": "Is one of only two landlocked countries in South America!",
  "Uruguay": "Was the first country in the world to legalize marijuana!",
  "Cuba": "Has one of the highest literacy rates in the world at over 99%!",
  "Jamaica": "Is the birthplace of reggae music and Bob Marley!",
  "Costa Rica": "Has no army and abolished its military in 1948!",
  "Panama": "Has a canal that connects the Atlantic and Pacific Oceans!",
  "Guatemala": "Home to over 30 volcanoes, many of which are still active!",
  "Honduras": "Has the second largest coral reef in the world!",
  "Haiti": "Was the first Black republic in the world, independent since 1804!",

  // Europe
  "United Kingdom": "Invented the World Wide Web and the steam engine!",
  "France": "The Eiffel Tower grows 15cm taller in summer due to heat!",
  "Germany": "Has over 1,500 different types of beer and 1,500 sausages!",
  "Italy": "Is home to more UNESCO World Heritage Sites than any other country!",
  "Spain": "Home to La Tomatina, a festival where people throw tomatoes at each other!",
  "Russia": "Stretches across 11 time zones and is the world's largest country!",
  "Netherlands": "Has more bicycles than people!",
  "Sweden": "Invented the safety match, zipper, and Bluetooth!",
  "Norway": "Has a town called Hell that freezes over every winter!",
  "Denmark": "Is the happiest country in the world according to many surveys!",
  "Finland": "Has more saunas than cars — about 3 million saunas!",
  "Switzerland": "Has enough nuclear bunkers to shelter its entire population!",
  "Austria": "Is the birthplace of Mozart, Freud, and Arnold Schwarzenegger!",
  "Belgium": "Invented French fries — not France!",
  "Portugal": "Has the oldest bookshop in the world, open since 1732!",
  "Greece": "Is the birthplace of democracy, the Olympics, and Western philosophy!",
  "Poland": "Is home to the world's largest castle by land area — Malbork Castle!",
  "Ukraine": "Has the largest territory of any country entirely within Europe!",
  "Czech Republic": "Czechs drink more beer per capita than any other nation!",
  "Hungary": "Invented the Rubik's Cube, the ballpoint pen, and the helicopter!",
  "Romania": "Home to Transylvania and the legend of Dracula!",
  "Croatia": "Invented the necktie — Cravat comes from the word Croat!",
  "Iceland": "Runs almost entirely on renewable geothermal and hydro energy!",
  "Ireland": "Has more Nobel Prize winners per capita than almost any country!",
  "Luxembourg": "Is the world's only Grand Duchy and one of the richest countries!",

  // Asia
  "China": "Invented paper, printing, gunpowder, and the compass!",
  "India": "Has a floating post office on Dal Lake in Kashmir!",
  "Japan": "Has 5.5 million vending machines — one for every 23 people!",
  "South Korea": "Made the world's first metal movable type printing press!",
  "Indonesia": "Is the world's largest archipelago with over 17,000 islands!",
  "Saudi Arabia": "Is larger than Western Europe and mostly desert!",
  "Turkey": "Sits on two continents — Europe and Asia!",
  "Iran": "Was once the center of the world's largest empire — the Persian Empire!",
  "Thailand": "Has over 40,000 temples and the head is considered sacred!",
  "Vietnam": "Is home to the world's largest cave — Son Doong!",
  "Philippines": "Is an archipelago of over 7,600 islands!",
  "Malaysia": "Has the world's oldest rainforest, older than the Amazon!",
  "Pakistan": "Has the second largest salt mine in the world — Khewra Salt Mine!",
  "Bangladesh": "Is one of the most densely populated countries in the world!",
  "Myanmar": "Has over 2,000 ancient temples and pagodas in Bagan!",
  "Cambodia": "Home to Angkor Wat, the world's largest religious monument!",
  "Nepal": "Has 8 of the world's 10 highest mountains including Everest!",
  "Sri Lanka": "Is the world's largest tea exporter and known as the Pearl of the Indian Ocean!",
  "United Arab Emirates": "Dubai has the world's tallest building — the Burj Khalifa!",
  "Israel": "Has the lowest point on Earth's surface — the Dead Sea!",
  "Jordan": "Home to Petra, an ancient city carved entirely into rose-red rock!",
  "Iraq": "Is home to Mesopotamia, where writing was first invented!",
  "Kazakhstan": "Is the world's largest landlocked country!",
  "Mongolia": "Has more horses than people and invented the world's largest empire!",
  "Singapore": "Is one of only three city-states in the world!",

  // Africa
  "Egypt": "The Great Pyramid was the tallest structure on Earth for 3,800 years!",
  "South Africa": "Has three capital cities — Pretoria, Cape Town, and Bloemfontein!",
  "Nigeria": "Has the highest rate of twin births in the world!",
  "Ethiopia": "Is the only African country never colonized by a European power!",
  "Kenya": "Is home to the Great Rift Valley, visible from space!",
  "Tanzania": "Has Africa's highest mountain — Mount Kilimanjaro!",
  "Morocco": "Has the world's oldest continuously operating university, founded in 859 AD!",
  "Ghana": "Was the first sub-Saharan African country to gain independence in 1957!",
  "Senegal": "Has a pink lake — Lac Rose — colored by algae and bacteria!",
  "Madagascar": "Is home to 90% of wildlife found nowhere else on Earth!",
  "Zimbabwe": "Home to Victoria Falls, one of the Seven Natural Wonders of the World!",
  "Zambia": "Shares Victoria Falls with Zimbabwe — the largest waterfall in the world!",
  "Uganda": "Is home to almost half of the world's remaining mountain gorillas!",
  "Rwanda": "Banned plastic bags in 2008 and is one of the cleanest countries in Africa!",
  "Tunisia": "Star Wars' Tatooine desert scenes were actually filmed here!",
  "Algeria": "Is the largest country in Africa by total area!",
  "Libya": "Has the Sahara Desert covering 90% of its territory!",
  "Cameroon": "Is known as Africa in miniature due to its incredible geographic diversity!",
  "Ivory Coast": "Is the world's largest producer of cocoa beans!",
  "Democratic Republic of the Congo": "Has the world's second largest tropical rainforest!",

  // Oceania & Pacific
  "Australia": "Home to the oldest living culture on Earth — over 65,000 years old!",
  "New Zealand": "Was the first country to give women the right to vote in 1893!",
  "Papua New Guinea": "Has over 800 languages — more than any other country!",
  "Fiji": "Has 333 islands and is known as the Soft Coral Capital of the World!",
  "Samoa": "Is one of the first places on Earth to see the New Year each day!",
};

// ─── Simple Loading Spinner ─────────────────────────────────────────────────

function LoadingSpinner({ message = "Loading..." }) {
  return (
    <div className="flex flex-col items-center justify-center p-8">
      <div className="relative w-16 h-16">
        <div className="absolute inset-0 border-4 border-[#E8F0FE] border-t-[#4A90E2] rounded-full animate-spin"></div>
        <div className="absolute inset-2 flex items-center justify-center">
          <span className="text-2xl">🌍</span>
        </div>
      </div>
      <p className="mt-4 text-[#4A90E2] font-medium">{message}</p>
    </div>
  );
}

// ─── Lobby Screen (Clean Kid-Friendly) ─────────────────────────────────────

function LobbyScreen({
  onCreate,
  onJoin,
  error,
  clearError,
}: {
  onCreate: (name: string, mode: GameMode, rounds: number) => void;
  onJoin: (roomId: string, name: string) => void;
  error: string | null;
  clearError: () => void;
}) {
  const [tab, setTab] = useState<"create" | "join">("create");
  const [name, setName] = useState("");
  const [roomId, setRoomId] = useState("");
  const [mode, setMode] = useState<GameMode>("free-for-all");
  const [rounds, setRounds] = useState(10);
  const [avatarIndex, setAvatarIndex] = useState(0);

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#F0F7FF] to-[#FFFFFF] flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Simple Header */}
        <div className="text-center mb-8">
          <div className="flex justify-center gap-3 mb-3">
            <span className="text-3xl">🐼</span>
            <span className="text-3xl">🦊</span>
            <span className="text-3xl">🐧</span>
          </div>
          <h1 className="text-4xl font-bold text-[#2C3E50] mb-1">
            Geo<span className="text-[#4A90E2]">Kids</span>
          </h1>
          <p className="text-[#7F8C8D]">Learn geography with friends!</p>
        </div>

        {/* Simple Tab Switcher */}
        <div className="flex bg-[#F5F7FA] rounded-xl p-1 mb-6">
          {(["create", "join"] as const).map((t) => (
            <button
              key={t}
              onClick={() => { setTab(t); clearError(); }}
              className={`flex-1 py-2 rounded-lg font-medium transition-all ${
                tab === t 
                  ? "bg-white text-[#4A90E2] shadow-sm" 
                  : "text-[#7F8C8D] hover:text-[#4A90E2]"
              }`}
            >
              {t === "create" ? "🎮 New Game" : "🚪 Join Game"}
            </button>
          ))}
        </div>

        {/* Clean Form */}
        <div className="bg-white rounded-2xl shadow-lg p-6 space-y-5 border border-[#E5E9F0]">
          {/* Name with avatar */}
          <div>
            <label className="text-sm font-medium text-[#2C3E50] mb-2 block">
              Your Name
            </label>
            <div className="flex gap-3">
              <button
                onClick={() => setAvatarIndex((prev) => (prev + 1) % ANIMAL_AVATARS.length)}
                className="w-12 h-12 bg-[#F5F7FA] rounded-xl flex items-center justify-center text-2xl hover:bg-[#E8F0FE] transition-colors"
              >
                {ANIMAL_AVATARS[avatarIndex].emoji}
              </button>
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter your name"
                maxLength={16}
                className="flex-1 bg-[#F5F7FA] rounded-xl px-4 py-2 text-[#2C3E50] placeholder-[#BDC3C7] outline-none focus:ring-2 focus:ring-[#4A90E2] transition-all"
              />
            </div>
          </div>

          {tab === "create" ? (
            <>
              {/* Simple Mode Selector */}
              <div>
                <label className="text-sm font-medium text-[#2C3E50] mb-2 block">
                  Game Mode
                </label>
                <div className="space-y-2">
                  {MODES.map((m) => (
                    <button
                      key={m.key}
                      onClick={() => setMode(m.key)}
                      className={`w-full text-left rounded-xl p-3 border-2 transition-all ${
                        mode === m.key 
                          ? 'border-[#4A90E2] bg-[#E8F0FE]' 
                          : 'border-[#E5E9F0] hover:border-[#BDC3C7]'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-2xl">{m.icon}</span>
                        <div>
                          <div className="font-medium text-[#2C3E50]">{m.label}</div>
                          <div className="text-xs text-[#7F8C8D]">{m.desc}</div>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Simple Round Slider */}
              <div>
                <label className="text-sm font-medium text-[#2C3E50] mb-2 block">
                  Rounds: <span className="text-[#4A90E2]">{rounds}</span>
                </label>
                <input
                  type="range" min={3} max={15} value={rounds}
                  onChange={(e) => setRounds(Number(e.target.value))}
                  className="w-full h-2 bg-[#E5E9F0] rounded-lg appearance-none cursor-pointer"
                  style={{
                    background: `linear-gradient(90deg, #4A90E2 0%, #4A90E2 ${(rounds-3)*8.33}%, #E5E9F0 ${(rounds-3)*8.33}%)`,
                  }}
                />
                <div className="flex justify-between text-xs text-[#7F8C8D] mt-1">
                  <span>3</span>
                  <span>8</span>
                  <span>15</span>
                </div>
              </div>
            </>
          ) : (
            <div>
              <label className="text-sm font-medium text-[#2C3E50] mb-2 block">
                Room Code
              </label>
              <input
                value={roomId}
                onChange={(e) => setRoomId(e.target.value.toUpperCase())}
                placeholder="Enter 5-letter code"
                maxLength={5}
                className="w-full bg-[#F5F7FA] rounded-xl px-4 py-3 text-[#2C3E50] placeholder-[#BDC3C7] outline-none focus:ring-2 focus:ring-[#4A90E2] transition-all text-center uppercase tracking-widest"
              />
            </div>
          )}

          {/* Simple Error */}
          {error && (
            <div className="bg-[#FFE5E5] rounded-xl px-4 py-3 text-[#E74C3C] text-sm text-center">
              ⚠️ {error}
            </div>
          )}

          {/* Submit Button */}
          <button
            onClick={() => {
              if (!name.trim()) { 
                alert("Please enter your name!");
                return;
              }
              if (tab === "create") onCreate(name.trim(), mode, rounds);
              else onJoin(roomId.trim(), name.trim());
            }}
            disabled={!name.trim() || (tab === "join" && !roomId.trim())}
            className="w-full py-3 bg-[#4A90E2] text-white rounded-xl font-medium hover:bg-[#357ABD] transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {tab === "create" ? "Start Game" : "Join Game"}
          </button>
        </div>

        {/* Simple Footer */}
        <p className="text-center mt-6 text-xs text-[#BDC3C7]">
          2-4 players • Learn geography • Have fun!
        </p>
      </div>
    </div>
  );
}

// ─── Waiting Room (Clean) ─────────────────────────────────────────────────

function WaitingRoom({
  room,
  playerId,
  onStart,
}: {
  room: NonNullable<ReturnType<typeof useSocket>["room"]>;
  playerId: string | null;
  onStart: () => void;
}) {
  const isHost = room.host === playerId;
  const modeInfo = MODES.find((m) => m.key === room.mode)!;
  const [copied, setCopied] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#F0F7FF] to-[#FFFFFF] flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold text-[#2C3E50] mb-2">Waiting Room</h2>
          <p className="text-[#7F8C8D]">Share this code with friends</p>
        </div>

        {/* Room Code */}
        <div
          className="bg-white rounded-2xl p-6 mb-4 text-center cursor-pointer border-2 border-[#E5E9F0] hover:border-[#4A90E2] transition-colors"
          onClick={() => { navigator.clipboard.writeText(room.id); setCopied(true); setTimeout(() => setCopied(false), 2000); }}
        >
          <div className="text-sm text-[#7F8C8D] mb-2">
            {copied ? "✨ Copied!" : "Click to copy"}
          </div>
          <div className="text-4xl font-bold text-[#2C3E50] tracking-widest">{room.id}</div>
        </div>

        {/* Mode Badge */}
        <div className="bg-white rounded-xl px-4 py-3 mb-4 flex items-center gap-3 border border-[#E5E9F0]">
          <span className="text-2xl">{modeInfo.icon}</span>
          <div>
            <div className="font-medium text-[#2C3E50]">{modeInfo.label}</div>
            <div className="text-xs text-[#7F8C8D]">{room.totalRounds} rounds</div>
          </div>
        </div>

        {/* Players List */}
        <div className="bg-white rounded-2xl p-5 mb-5 border border-[#E5E9F0]">
          <div className="text-sm font-medium text-[#7F8C8D] mb-3">
            Players ({room.players.length}/4)
          </div>
          <div className="space-y-2">
            {room.players.map((p: any, index: number) => (
              <div key={p.id} className="flex items-center gap-3 bg-[#F5F7FA] rounded-xl p-2">
                <span className="text-2xl">{ANIMAL_AVATARS[index % ANIMAL_AVATARS.length].emoji}</span>
                <span className="text-[#2C3E50] flex-1">{p.name}</span>
                {p.id === room.host && (
                  <span className="text-xs bg-[#4A90E2] text-white px-2 py-1 rounded-full">HOST</span>
                )}
                {p.id === playerId && p.id !== room.host && (
                  <span className="text-xs text-[#7F8C8D]">(you)</span>
                )}
              </div>
            ))}
            {Array.from({ length: 4 - room.players.length }).map((_, i) => (
              <div key={i} className="flex items-center gap-3 bg-[#F5F7FA] rounded-xl p-2 opacity-50">
                <span className="text-2xl">❓</span>
                <span className="text-[#7F8C8D]">Waiting...</span>
              </div>
            ))}
          </div>
        </div>

        {isHost ? (
          <button
            onClick={onStart}
            disabled={room.players.length < 2}
            className="w-full py-3 bg-[#4A90E2] text-white rounded-xl font-medium hover:bg-[#357ABD] transition-colors disabled:opacity-40"
          >
            {room.players.length < 2 ? "Need 1 more player" : "Start Game"}
          </button>
        ) : (
          <div className="text-center py-3 text-[#7F8C8D]">
            Waiting for host to start...
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Game Over Screen (Clean) ─────────────────────────────────────────────

function GameOverScreen({ players, reason, onBack }: { players: Player[]; reason?: string; onBack: () => void }) {
  const sorted = [...players].sort((a, b) => b.score - a.score);

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#F0F7FF] to-[#FFFFFF] flex items-center justify-center p-4">
      <div className="w-full max-w-md text-center">
        <div className="text-6xl mb-3">🏆</div>
        <h2 className="text-3xl font-bold text-[#2C3E50] mb-2">Game Over!</h2>
        <p className="text-[#7F8C8D] mb-6">{reason || "Great job everyone!"}</p>

        <div className="bg-white rounded-2xl p-6 mb-6 border border-[#E5E9F0] space-y-2">
          {sorted.map((p, i) => (
            <div key={p.id} className="flex items-center gap-3 bg-[#F5F7FA] rounded-xl p-3">
              <span className="text-xl w-8">{["🥇", "🥈", "🥉", "🎮"][i]}</span>
              <span className="text-[#2C3E50] flex-1 text-left">{p.name}</span>
              <span className="font-bold text-[#4A90E2]">{p.score}</span>
            </div>
          ))}
        </div>

        {/* <button
          onClick={onBack}
          className="w-full py-3 bg-[#4A90E2] text-white rounded-xl font-medium hover:bg-[#357ABD] transition-colors"
        >
          Play Again
        </button> */}
      </div>
    </div>
  );
}

// ─── Active Game (Clean) ─────────────────────────────────────────────────

function ActiveGame({
  room,
  playerId,
  roundCountry,
  lastResult,
  roundTimeout,
  onCountryClick,
}: {
  room: NonNullable<ReturnType<typeof useSocket>["room"]>;
  playerId: string | null;
  roundCountry: { name: string; code: string } | null;
  lastResult: ReturnType<typeof useSocket>["lastResult"];
  roundTimeout: boolean;
  onCountryClick: (code: string, name: string) => void;
}) {
  const [timeLeft, setTimeLeft] = useState(20);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const modeInfo = MODES.find((m) => m.key === room.mode)!;
  const sorted = [...room.players].sort((a, b) => b.score - a.score);
  const myPlayer = room.players.find((p: any) => p.id === playerId);
  const [showFunFact, setShowFunFact] = useState(false);

  const funFact = roundCountry?.name ? COUNTRY_FACTS[roundCountry.name] : "";

  useEffect(() => {
    if (!roundCountry) return;
    setTimeLeft(20);
    setShowFunFact(false);
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) { 
          if (timerRef.current) clearInterval(timerRef.current); 
          setShowFunFact(true);
          return 0; 
        }
        return prev - 1;
      });
    }, 1000);
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [roundCountry]);

  const handleClick = (feature: CountryFeature) => {
    onCountryClick(feature.id ?? "", feature.properties?.name ?? "");
    if (feature.properties?.name === roundCountry?.name) {
      setShowFunFact(true);
    }
  };

  const timePercent = (timeLeft / 20) * 100;

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#F0F7FF] to-[#FFFFFF] flex flex-col">
      {/* Simple Top Bar */}
      <div className="bg-white border-b border-[#E5E9F0] px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-xl">🌍</span>
          <span className="font-bold text-[#2C3E50]">GeoKids</span>
          <span className="ml-2 px-2 py-0.5 rounded-full text-xs border" style={{ borderColor: modeInfo.color, color: modeInfo.color }}>
            {modeInfo.icon} {modeInfo.label}
          </span>
        </div>
        <div className="text-sm text-[#7F8C8D]">
          Round {room.roundNum}/{room.totalRounds}
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <div className="w-64 bg-white border-r border-[#E5E9F0] p-4 flex flex-col gap-4 overflow-y-auto">
          {/* Target Country */}
          <div className="bg-[#F5F7FA] rounded-xl p-4">
            <div className="text-xs text-[#7F8C8D] mb-1">Find this country</div>
            <div className="text-xl font-bold text-[#2C3E50]">
              {roundCountry?.name ?? "..."}
            </div>
            {showFunFact && funFact && (
              <div className="mt-2 text-xs text-[#4A90E2] bg-[#E8F0FE] rounded-lg p-2">
                ✨ {funFact}
              </div>
            )}
          </div>

          {/* Timer */}
          <div className="bg-[#F5F7FA] rounded-xl p-4">
            <div className="flex justify-between text-sm mb-2">
              <span className="text-[#7F8C8D]">Time</span>
              <span className="font-bold text-[#4A90E2]">{timeLeft}s</span>
            </div>
            <div className="h-2 bg-[#E5E9F0] rounded-full overflow-hidden">
              <div
                className="h-full bg-[#4A90E2] rounded-full transition-all duration-300"
                style={{ width: `${timePercent}%` }}
              />
            </div>
          </div>

          {/* Feedback */}
          {(lastResult || roundTimeout) && (
            <div
              className={`rounded-xl p-3 text-sm font-medium ${
                roundTimeout
                  ? "bg-[#FFE5E5] text-[#E74C3C]"
                  : lastResult?.correct
                  ? "bg-[#E8F0FE] text-[#4A90E2]"
                  : "bg-[#FFE5E5] text-[#E74C3C]"
              }`}
            >
              {roundTimeout ? (
                "⏰ Time's up!"
              ) : lastResult?.correct ? (
                `🎉 ${lastResult.playerName} found it!`
              ) : (
                `❌ Try again!`
              )}
            </div>
          )}

          {/* Leaderboard */}
          <div className="bg-[#F5F7FA] rounded-xl p-4">
            <div className="text-xs text-[#7F8C8D] mb-3">Leaderboard</div>
            <div className="space-y-2">
              {sorted.map((p, i) => (
                <div key={p.id} className="flex items-center gap-2">
                  <span className="text-sm w-6">{["🥇", "🥈", "🥉", "🎮"][i]}</span>
                  <span className="text-sm text-[#2C3E50] flex-1 truncate">{p.name}</span>
                  <span className="font-bold text-[#4A90E2]">{p.score}</span>
                </div>
              ))}
            </div>
          </div>

          {/* My Score */}
          {myPlayer && (
            <div className="bg-[#E8F0FE] rounded-xl p-3 text-center">
              <div className="text-xs text-[#7F8C8D] mb-1">Your Score</div>
              <div className="text-2xl font-bold text-[#4A90E2]">{myPlayer.score}</div>
            </div>
          )}
        </div>

        {/* Map Area */}
        <div className="flex-1 p-4 flex flex-col">
          <div className="flex-1 bg-white rounded-2xl border border-[#E5E9F0] overflow-hidden">
            <div className="w-full h-full">
              <WorldMap onCountryClick={handleClick} />
            </div>
          </div>
          <div className="flex justify-between items-center mt-2 text-xs text-[#BDC3C7]">
            <span>Click on the country to find it</span>
            <span>Room: {room.id}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Main Page ─────────────────────────────────────────────────────────────

export default function CountrySelectorPage() {
  const {
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
  } = useSocket();

  // Simple connection indicator
  const connectionDot = (
    <div className="fixed top-3 right-3 z-50 flex items-center gap-2 bg-white px-3 py-1 rounded-full shadow-sm border border-[#E5E9F0]">
      <div
        className="w-2 h-2 rounded-full"
        style={{ background: connected ? "#7ED321" : "#E74C3C" }}
      />
      <span className="text-xs text-[#7F8C8D]">
        {connected ? "Connected" : "Connecting..."}
      </span>
    </div>
  );

  if (!connected) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-[#F0F7FF] to-[#FFFFFF] flex items-center justify-center">
        {connectionDot}
        <LoadingSpinner message="Getting ready..." />
      </div>
    );
  }

  if (gameOver) {
    return (
      <>
        {connectionDot}
        <GameOverScreen
          players={gameOver.players}
          reason={gameOver.reason}
          onBack={resetGame}
        />
      </>
    );
  }

  if (room && gameStarted) {
    return (
      <>
        {connectionDot}
        <ActiveGame
          room={room}
          playerId={playerId}
          roundCountry={roundCountry}
          lastResult={lastResult}
          roundTimeout={roundTimeout}
          onCountryClick={clickCountry}
        />
      </>
    );
  }

  if (room && room.status === "waiting") {
    return (
      <>
        {connectionDot}
        <WaitingRoom room={room} playerId={playerId} onStart={startGame} />
      </>
    );
  }

  return (
    <>
      {connectionDot}
      <LobbyScreen
        onCreate={createRoom}
        onJoin={joinRoom}
        error={error}
        clearError={() => setError(null)}
      />
    </>
  );
}
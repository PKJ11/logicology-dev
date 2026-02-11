// Levels data for all game modes

export interface Level {
  id: number;
  letters: string[];
  colorMap: Record<string, { name: string; hex: string; }>;
  wordBank: string[];
  gridSize?: number;
  movesLength?: number;
  colorsCount?: number;
}

export interface Color {
  name: string;
  hex: string;
  bgClass: string;
  textClass: string;
}

export interface GridCell {
  row: number;
  col: number;
  color: Color | null;
  isStart: boolean;
}

export const AVAILABLE_COLORS: Color[] = [
  { name: 'teal', hex: '#0d9488', bgClass: 'bg-brand-teal', textClass: 'text-brand-teal' },
  { name: 'coral', hex: '#f87171', bgClass: 'bg-brand-coral', textClass: 'text-brand-coral' },
  { name: 'gold', hex: '#fbbf24', bgClass: 'bg-brand-gold', textClass: 'text-brand-gold' },
  { name: 'sky', hex: '#38bdf8', bgClass: 'bg-sky-400', textClass: 'text-sky-400' },
  { name: 'green', hex: '#4ade80', bgClass: 'bg-green-400', textClass: 'text-green-400' },
  { name: 'purple', hex: '#a855f7', bgClass: 'bg-purple-400', textClass: 'text-purple-400' },
  { name: 'pink', hex: '#f472b6', bgClass: 'bg-pink-400', textClass: 'text-pink-400' },
  { name: 'blue', hex: '#60a5fa', bgClass: 'bg-blue-400', textClass: 'text-blue-400' },
];

// Encoding/Decoding levels
export const CODING_LEVELS: Level[] = [
  {
    id: 1,
    letters: ['A', 'C', 'D', 'G', 'I', 'L', 'N', 'O'],
    colorMap: {
      'A': AVAILABLE_COLORS[0],
      'C': AVAILABLE_COLORS[1],
      'D': AVAILABLE_COLORS[2],
      'G': AVAILABLE_COLORS[3],
      'I': AVAILABLE_COLORS[4],
      'L': AVAILABLE_COLORS[5],
      'N': AVAILABLE_COLORS[6],
      'O': AVAILABLE_COLORS[7],
    },
    wordBank: ['DOG', 'LION', 'COLD', 'GOLD', 'AND', 'LOG', 'CAN', 'GOAL']
  },
  {
    id: 2,
    letters: ['A', 'B', 'E', 'G', 'I', 'M', 'O', 'T'],
    colorMap: {
      'A': AVAILABLE_COLORS[1],
      'B': AVAILABLE_COLORS[2],
      'E': AVAILABLE_COLORS[3],
      'G': AVAILABLE_COLORS[4],
      'I': AVAILABLE_COLORS[5],
      'M': AVAILABLE_COLORS[6],
      'O': AVAILABLE_COLORS[7],
      'T': AVAILABLE_COLORS[0],
    },
    wordBank: ['GAME', 'TIME', 'BEAT', 'MATE', 'BAG', 'TEA', 'GET', 'BIT']
  },
  {
    id: 3,
    letters: ['E', 'H', 'I', 'L', 'M', 'O', 'S', 'U'],
    colorMap: {
      'E': AVAILABLE_COLORS[2],
      'H': AVAILABLE_COLORS[3],
      'I': AVAILABLE_COLORS[4],
      'L': AVAILABLE_COLORS[5],
      'M': AVAILABLE_COLORS[6],
      'O': AVAILABLE_COLORS[7],
      'S': AVAILABLE_COLORS[0],
      'U': AVAILABLE_COLORS[1],
    },
    wordBank: ['HOME', 'MUSE', 'SOIL', 'HELP', 'USE', 'SHE', 'HIM', 'SUM']
  },
  {
    id: 4,
    letters: ['E', 'G', 'I', 'L', 'N', 'R', 'S', 'T'],
    colorMap: {
      'E': AVAILABLE_COLORS[3],
      'G': AVAILABLE_COLORS[4],
      'I': AVAILABLE_COLORS[5],
      'L': AVAILABLE_COLORS[6],
      'N': AVAILABLE_COLORS[7],
      'R': AVAILABLE_COLORS[0],
      'S': AVAILABLE_COLORS[1],
      'T': AVAILABLE_COLORS[2],
    },
    wordBank: ['STAR', 'GIRL', 'TREE', 'SING', 'NET', 'SIT', 'GET', 'LET']
  },
  {
    id: 5,
    letters: ['A', 'D', 'F', 'H', 'K', 'P', 'R', 'U'],
    colorMap: {
      'A': AVAILABLE_COLORS[4],
      'D': AVAILABLE_COLORS[5],
      'F': AVAILABLE_COLORS[6],
      'H': AVAILABLE_COLORS[7],
      'K': AVAILABLE_COLORS[0],
      'P': AVAILABLE_COLORS[1],
      'R': AVAILABLE_COLORS[2],
      'U': AVAILABLE_COLORS[3],
    },
    wordBank: ['PARK', 'HARD', 'DUCK', 'FARM', 'HAT', 'RUG', 'DAD', 'RUN']
  }
];

// Colour Crawl levels
export const CRAWL_LEVELS: Level[] = [
  {
    id: 1,
    letters: [],
    colorMap: {},
    wordBank: [],
    gridSize: 4,
    movesLength: 2,
    colorsCount: 4,
  },
  {
    id: 2,
    letters: [],
    colorMap: {},
    wordBank: [],
    gridSize: 4,
    movesLength: 3,
    colorsCount: 4,
  },
  {
    id: 3,
    letters: [],
    colorMap: {},
    wordBank: [],
    gridSize: 5,
    movesLength: 3,
    colorsCount: 4,
  },
  {
    id: 4,
    letters: [],
    colorMap: {},
    wordBank: [],
    gridSize: 5,
    movesLength: 4,
    colorsCount: 5,
  },
  {
    id: 5,
    letters: [],
    colorMap: {},
    wordBank: [],
    gridSize: 5,
    movesLength: 5,
    colorsCount: 5,
  },
  {
    id: 6,
    letters: [],
    colorMap: {},
    wordBank: [],
    gridSize: 6,
    movesLength: 5,
    colorsCount: 5,
  },
  {
    id: 7,
    letters: [],
    colorMap: {},
    wordBank: [],
    gridSize: 6,
    movesLength: 6,
    colorsCount: 6,
  },
  {
    id: 8,
    letters: [],
    colorMap: {},
    wordBank: [],
    gridSize: 6,
    movesLength: 7,
    colorsCount: 6,
  },
  {
    id: 9,
    letters: [],
    colorMap: {},
    wordBank: [],
    gridSize: 6,
    movesLength: 8,
    colorsCount: 6,
  },
  {
    id: 10,
    letters: [],
    colorMap: {},
    wordBank: [],
    gridSize: 6,
    movesLength: 9,
    colorsCount: 6,
  },
];

export type GameMode = 'encode' | 'decode' | 'crawl';

export interface GameState {
  mode: GameMode;
  currentLevel: number;
  score: number;
  streak: number;
  completedLevels: number[];
}

export const INITIAL_GAME_STATE: GameState = {
  mode: 'encode',
  currentLevel: 1,
  score: 0,
  streak: 0,
  completedLevels: [],
};
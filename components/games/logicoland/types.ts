export type GameMode = 'encode' | 'decode';

export interface Tile {
  id: string;
  type: 'letter' | 'color';
  content: string;
  color: string;
  position: 'prompt' | 'tray' | 'slot';
  draggable: boolean;
}

export interface Slot {
  id: string;
  type: 'letter' | 'color';
  content: string | null;
  expected: string;
  position: number;
}

export interface Level {
  id: number;
  name: string;
  letters: string[];
  colors: string[];
  colorMap: Record<string, string>;
  words: string[];
}

export interface Feedback {
  type: 'success' | 'error' | 'warning' | 'info';
  message: string;
}

// Color definitions
export const COLORS = {
  blue: '#3B82F6',
  purple: '#8B5CF6',
  green: '#10B981',
  yellow: '#FBBF24',
  orange: '#F97316',
  pink: '#EC4899',
  brown: '#92400E',
  red: '#EF4444',
} as const;

// Level definitions
export const levels: Level[] = [
  {
    id: 0,
    name: 'Level 1: Starter',
    letters: ['A', 'C', 'D', 'G', 'I', 'L', 'N', 'O'],
    colors: ['blue', 'purple', 'green', 'yellow'],
    colorMap: {
      'A': 'blue',
      'C': 'purple',
      'D': 'green',
      'G': 'yellow',
      'I': 'blue',
      'L': 'purple',
      'N': 'green',
      'O': 'yellow',
    },
    words: ['ADD', 'CAN', 'DOG', 'OLD', 'OIL', 'AID', 'COLD', 'GOAL', 'LOAD', 'LION'],
  },
  {
    id: 1,
    name: 'Level 2: Explorer',
    letters: ['A', 'B', 'E', 'G', 'I', 'M', 'O', 'T'],
    colors: ['green', 'orange', 'pink', 'brown'],
    colorMap: {
      'A': 'green',
      'B': 'orange',
      'E': 'pink',
      'G': 'brown',
      'I': 'green',
      'M': 'orange',
      'O': 'pink',
      'T': 'brown',
    },
    words: ['BAG', 'TEA', 'GOT', 'ATE', 'BIG', 'AIM', 'BOAT', 'GAME', 'TIME', 'MATE'],
  },
  {
    id: 2,
    name: 'Level 3: Adventurer',
    letters: ['E', 'H', 'I', 'L', 'M', 'O', 'S', 'U'],
    colors: ['yellow', 'pink', 'brown', 'red'],
    colorMap: {
      'E': 'yellow',
      'H': 'pink',
      'I': 'brown',
      'L': 'red',
      'M': 'yellow',
      'O': 'pink',
      'S': 'brown',
      'U': 'red',
    },
    words: ['HIS', 'USE', 'SOUL', 'HOME', 'MILE', 'SHE', 'HIM', 'SUE', 'MOLE', 'SLIM'],
  },
  {
    id: 3,
    name: 'Level 4: Master',
    letters: ['E', 'G', 'I', 'L', 'N', 'R', 'S', 'T'],
    colors: ['blue', 'orange', 'red', 'purple'],
    colorMap: {
      'E': 'blue',
      'G': 'orange',
      'I': 'red',
      'L': 'purple',
      'N': 'blue',
      'R': 'orange',
      'S': 'red',
      'T': 'purple',
    },
    words: ['SING', 'REST', 'LIST', 'TILE', 'GREEN', 'SENT', 'RING', 'TENT', 'LENS', 'STIR'],
  },
];

export interface SkyPalette {
  50: string;
  100: string;
  200: string;
  300: string;
  400: string;
  500: string;
  600: string;
  700: string;
  800: string;
  900: string;
}

export interface BrandColors {
  teal: string;
  coral: string;
  gold: string;
  grayBg: string;
}

export interface Color {
  name: string;
  hex: string;
  bgClass: string;
  textClass: string;
}

export interface GameTile {
  id: string;
  type: 'color' | 'letter';
  value: string | Color;
  isPlaced: boolean;
}

export interface GameSlot {
  id: string;
  tile: GameTile | null;
  correctValue: string | Color;
}
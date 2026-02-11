// Volume 5 Data - Logicoland puzzles
export type Direction = 'F' | 'B' | 'L' | 'R' | 'U' | 'D';
export type ArrowDirection = '↑' | '↓' | '←' | '→';

export interface PuzzleColorCrawl {
  id: number;
  title: string;
  grid: string[][]; // colors
  start: [number, number]; // [row, col]
  moves: Direction[];
  answer: string; // color name
  answerPosition: [number, number];
  difficulty: 'easy' | 'medium' | 'hard';
}

export interface PuzzleArrowsAddress {
  id: number;
  title: string;
  grid: number[][]; // numbers
  startNumber: number;
  moves: ArrowDirection[];
  answer: number;
  answerPosition: [number, number];
  gridSize: [number, number];
  difficulty: 'easy' | 'medium' | 'hard';
}

export interface PuzzleRightRoute {
  id: number;
  title: string;
  grid: string[][]; // obstacles and path
  start: [number, number];
  target: [number, number];
  routes: {
    id: string;
    name: string;
    moves: ArrowDirection[];
    isCorrect: boolean;
  }[];
  answer: string; // route id
}

export interface PuzzleKnight {
  id: number;
  title: string;
  grid: string[][]; // chess board
  start: [number, number];
  target: [number, number];
  answer: [number, number]; // knight move position
  difficulty: 'easy' | 'medium' | 'hard';
}

// Section 1: Colour Crawl Puzzles
export const colourCrawlPuzzles: PuzzleColorCrawl[] = [
  {
    id: 1,
    title: "Easy Start",
    grid: [
      ['red', 'blue', 'green', 'yellow'],
      ['yellow', 'red', 'blue', 'green'],
      ['green', 'yellow', 'red', 'blue'],
      ['blue', 'green', 'yellow', 'red']
    ],
    start: [0, 0],
    moves: ['R', 'D', 'R', 'U'],
    answer: 'blue',
    answerPosition: [1, 2],
    difficulty: 'easy'
  },
  {
    id: 2,
    title: "Square Dance",
    grid: [
      ['pink', 'orange', 'purple', 'teal'],
      ['teal', 'pink', 'orange', 'purple'],
      ['purple', 'teal', 'pink', 'orange'],
      ['orange', 'purple', 'teal', 'pink']
    ],
    start: [2, 1],
    moves: ['U', 'R', 'D', 'L', 'U'],
    answer: 'pink',
    answerPosition: [1, 1],
    difficulty: 'easy'
  },
  {
    id: 3,
    title: "Rainbow Walk",
    grid: [
      ['red', 'orange', 'yellow', 'green', 'blue'],
      ['blue', 'red', 'orange', 'yellow', 'green'],
      ['green', 'blue', 'red', 'orange', 'yellow'],
      ['yellow', 'green', 'blue', 'red', 'orange'],
      ['orange', 'yellow', 'green', 'blue', 'red']
    ],
    start: [4, 2],
    moves: ['U', 'U', 'L', 'L', 'D'],
    answer: 'red',
    answerPosition: [2, 0],
    difficulty: 'medium'
  },
  {
    id: 4,
    title: "Color Maze",
    grid: [
      ['brown', 'yellow', 'pink', 'sky', 'green'],
      ['green', 'brown', 'yellow', 'pink', 'sky'],
      ['sky', 'green', 'brown', 'yellow', 'pink'],
      ['pink', 'sky', 'green', 'brown', 'yellow'],
      ['yellow', 'pink', 'sky', 'green', 'brown']
    ],
    start: [0, 4],
    moves: ['D', 'L', 'U', 'R', 'D', 'L', 'U'],
    answer: 'yellow',
    answerPosition: [1, 1],
    difficulty: 'hard'
  },
  {
    id: 5,
    title: "Forward March",
    grid: [
      ['red', 'blue', 'green'],
      ['yellow', 'pink', 'orange'],
      ['purple', 'teal', 'brown']
    ],
    start: [0, 0],
    moves: ['D', 'R', 'U', 'L', 'D', 'R'],
    answer: 'orange',
    answerPosition: [1, 2],
    difficulty: 'medium'
  },
  {
    id: 6,
    title: "Diagonal Dream",
    grid: [
      ['lime', 'cyan', 'magenta', 'gold'],
      ['gold', 'lime', 'cyan', 'magenta'],
      ['magenta', 'gold', 'lime', 'cyan'],
      ['cyan', 'magenta', 'gold', 'lime']
    ],
    start: [3, 3],
    moves: ['U', 'L', 'U', 'L', 'D', 'R'],
    answer: 'cyan',
    answerPosition: [1, 1],
    difficulty: 'medium'
  },
  {
    id: 7,
    title: "Twisty Path",
    grid: [
      ['coral', 'mint', 'lavender', 'peach'],
      ['peach', 'coral', 'mint', 'lavender'],
      ['lavender', 'peach', 'coral', 'mint'],
      ['mint', 'lavender', 'peach', 'coral']
    ],
    start: [1, 0],
    moves: ['R', 'D', 'D', 'L', 'U', 'R', 'U'],
    answer: 'peach',
    answerPosition: [0, 1],
    difficulty: 'hard'
  },
  {
    id: 8,
    title: "Simple Steps",
    grid: [
      ['red', 'blue'],
      ['green', 'yellow']
    ],
    start: [0, 0],
    moves: ['R', 'D'],
    answer: 'yellow',
    answerPosition: [1, 1],
    difficulty: 'easy'
  },
  {
    id: 9,
    title: "Long Journey",
    grid: [
      ['amber', 'emerald', 'sapphire', 'ruby', 'topaz'],
      ['topaz', 'amber', 'emerald', 'sapphire', 'ruby'],
      ['ruby', 'topaz', 'amber', 'emerald', 'sapphire'],
      ['sapphire', 'ruby', 'topaz', 'amber', 'emerald'],
      ['emerald', 'sapphire', 'ruby', 'topaz', 'amber']
    ],
    start: [2, 2],
    moves: ['U', 'R', 'D', 'L', 'U', 'R', 'D', 'L'],
    answer: 'amber',
    answerPosition: [2, 2],
    difficulty: 'hard'
  },
  {
    id: 10,
    title: "Quick Trip",
    grid: [
      ['rose', 'violet', 'indigo'],
      ['indigo', 'rose', 'violet'],
      ['violet', 'indigo', 'rose']
    ],
    start: [0, 2],
    moves: ['D', 'L', 'U'],
    answer: 'rose',
    answerPosition: [0, 0],
    difficulty: 'easy'
  },
  {
    id: 11,
    title: "Zig Zag",
    grid: [
      ['red', 'blue', 'green', 'yellow', 'pink'],
      ['pink', 'red', 'blue', 'green', 'yellow'],
      ['yellow', 'pink', 'red', 'blue', 'green'],
      ['green', 'yellow', 'pink', 'red', 'blue'],
      ['blue', 'green', 'yellow', 'pink', 'red']
    ],
    start: [0, 0],
    moves: ['R', 'D', 'L', 'D', 'R', 'U', 'R', 'D'],
    answer: 'green',
    answerPosition: [3, 1],
    difficulty: 'hard'
  },
  {
    id: 12,
    title: "Final Challenge",
    grid: [
      ['gold', 'silver', 'bronze', 'copper'],
      ['copper', 'gold', 'silver', 'bronze'],
      ['bronze', 'copper', 'gold', 'silver'],
      ['silver', 'bronze', 'copper', 'gold']
    ],
    start: [3, 0],
    moves: ['U', 'R', 'D', 'R', 'U', 'L', 'U', 'R', 'D'],
    answer: 'silver',
    answerPosition: [2, 3],
    difficulty: 'hard'
  }
];

// Section 2: Arrows Address Puzzles
export const arrowsAddressPuzzles: PuzzleArrowsAddress[] = [
  {
    id: 1,
    title: "Simple Start",
    grid: [
      [1, 2, 3, 4],
      [5, 6, 7, 8],
      [9, 10, 11, 12],
      [13, 14, 15, 16]
    ],
    startNumber: 1,
    moves: ['→', '↓', '→', '↑'],
    answer: 7,
    answerPosition: [1, 2],
    gridSize: [4, 4],
    difficulty: 'easy'
  },
  {
    id: 2,
    title: "Number Maze",
    grid: [
      [10, 20, 30, 40, 50],
      [60, 70, 80, 90, 100],
      [110, 120, 130, 140, 150],
      [160, 170, 180, 190, 200],
      [210, 220, 230, 240, 250]
    ],
    startNumber: 130,
    moves: ['↑', '→', '↓', '←', '↓', '→'],
    answer: 240,
    answerPosition: [4, 3],
    gridSize: [5, 5],
    difficulty: 'medium'
  },
  {
    id: 3,
    title: "Arrow Path",
    grid: [
      [5, 10, 15, 20],
      [25, 30, 35, 40],
      [45, 50, 55, 60],
      [65, 70, 75, 80]
    ],
    startNumber: 45,
    moves: ['→', '→', '↑', '←', '↓'],
    answer: 50,
    answerPosition: [2, 1],
    gridSize: [4, 4],
    difficulty: 'easy'
  },
  {
    id: 4,
    title: "Long Route",
    grid: [
      [1, 2, 3],
      [4, 5, 6],
      [7, 8, 9]
    ],
    startNumber: 5,
    moves: ['↑', '→', '↓', '↓', '←', '↑', '→'],
    answer: 6,
    answerPosition: [1, 2],
    gridSize: [3, 3],
    difficulty: 'medium'
  },
  {
    id: 5,
    title: "Diagonal Move",
    grid: [
      [11, 12, 13, 14, 15],
      [21, 22, 23, 24, 25],
      [31, 32, 33, 34, 35],
      [41, 42, 43, 44, 45],
      [51, 52, 53, 54, 55]
    ],
    startNumber: 33,
    moves: ['↑', '←', '↓', '→', '→', '↓', '←'],
    answer: 43,
    answerPosition: [3, 2],
    gridSize: [5, 5],
    difficulty: 'hard'
  },
  {
    id: 6,
    title: "Quick Steps",
    grid: [
      [100, 200, 300],
      [400, 500, 600],
      [700, 800, 900]
    ],
    startNumber: 400,
    moves: ['→', '↓', '←'],
    answer: 700,
    answerPosition: [2, 0],
    gridSize: [3, 3],
    difficulty: 'easy'
  },
  {
    id: 7,
    title: "Circular Path",
    grid: [
      [2, 4, 6, 8],
      [10, 12, 14, 16],
      [18, 20, 22, 24],
      [26, 28, 30, 32]
    ],
    startNumber: 14,
    moves: ['←', '↑', '→', '↓', '→', '↓', '←'],
    answer: 20,
    answerPosition: [2, 1],
    gridSize: [4, 4],
    difficulty: 'hard'
  },
  {
    id: 8,
    title: "Final Arrow Challenge",
    grid: [
      [1, 3, 5, 7, 9],
      [2, 4, 6, 8, 10],
      [11, 13, 15, 17, 19],
      [12, 14, 16, 18, 20],
      [21, 23, 25, 27, 29]
    ],
    startNumber: 15,
    moves: ['↓', '→', '↑', '←', '↓', '→', '↑', '→'],
    answer: 27,
    answerPosition: [4, 3],
    gridSize: [5, 5],
    difficulty: 'hard'
  }
];

// Section 3: Right Route (1 sample)
export const rightRoutePuzzles: PuzzleRightRoute[] = [
  {
    id: 1,
    title: "Find the Right Path",
    grid: [
      ['S', 'empty', 'empty', 'empty', 'empty'],
      ['empty', 'block', 'block', 'empty', 'empty'],
      ['empty', 'empty', 'empty', 'block', 'empty'],
      ['empty', 'block', 'empty', 'empty', 'empty'],
      ['empty', 'empty', 'empty', 'empty', '⭐']
    ],
    start: [0, 0],
    target: [4, 4],
    routes: [
      {
        id: 'A',
        name: 'Route A',
        moves: ['→', '→', '↓', '↓', '→', '→', '↓', '↓'],
        isCorrect: false
      },
      {
        id: 'B',
        name: 'Route B',
        moves: ['→', '↓', '→', '↓', '→', '↓', '→', '↓'],
        isCorrect: false
      },
      {
        id: 'C',
        name: 'Route C',
        moves: ['↓', '↓', '→', '→', '↓', '↓', '→', '→'],
        isCorrect: true
      }
    ],
    answer: 'C'
  }
];

// Section 4: Knowing Knight (1 sample)
export const knightPuzzles: PuzzleKnight[] = [
  {
    id: 1,
    title: "Knight's First Move",
    grid: [
      ['empty', 'empty', 'empty', 'empty', 'empty'],
      ['empty', 'empty', 'empty', 'empty', 'empty'],
      ['empty', 'empty', 'S', 'empty', 'empty'],
      ['empty', 'empty', 'empty', 'empty', 'empty'],
      ['empty', 'empty', 'empty', 'empty', '⭐']
    ],
    start: [2, 2],
    target: [4, 4],
    answer: [4, 3],
    difficulty: 'easy'
  }
];

// Utility function to find position by number in grid
// Change this function to always return a tuple
export function findPositionByNumber(grid: number[][], number: number): [number, number] {
  for (let row = 0; row < grid.length; row++) {
    for (let col = 0; col < grid[row].length; col++) {
      if (grid[row][col] === number) {
        return [row, col];
      }
    }
  }
  // Return a default position if not found (shouldn't happen with valid data)
  return [0, 0];
}

// Utility function to get color name from hex or other representation
export function getColorDisplayName(color: string): string {
  const colorMap: Record<string, string> = {
    'red': 'Red',
    'blue': 'Blue',
    'green': 'Green',
    'yellow': 'Yellow',
    'pink': 'Pink',
    'orange': 'Orange',
    'purple': 'Purple',
    'teal': 'Teal',
    'brown': 'Brown',
    'sky': 'Sky Blue',
    'lime': 'Lime',
    'cyan': 'Cyan',
    'magenta': 'Magenta',
    'gold': 'Gold',
    'coral': 'Coral',
    'mint': 'Mint',
    'lavender': 'Lavender',
    'peach': 'Peach',
    'amber': 'Amber',
    'emerald': 'Emerald',
    'sapphire': 'Sapphire',
    'ruby': 'Ruby',
    'topaz': 'Topaz',
    'rose': 'Rose',
    'violet': 'Violet',
    'indigo': 'Indigo',
    'silver': 'Silver',
    'bronze': 'Bronze',
    'copper': 'Copper'
  };
  return colorMap[color] || color.charAt(0).toUpperCase() + color.slice(1);
}
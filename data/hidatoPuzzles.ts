/**
 * Hidato Puzzle Data
 * Collection of puzzles with solutions
 */

export type HidatoPuzzle = {
  id: string;
  title: string;
  size: number;
  difficulty: "easy" | "medium" | "hard";
  puzzle: number[][];
  solution: number[][];
};

export const hidatoPuzzles: HidatoPuzzle[] = [
  {
    id: "puzzle-1",
    title: "Hidato 6x6 - Medium 1",
    size: 6,
    difficulty: "medium",
    puzzle: [
      [0,15,0,0,19,0],
      [11,0,17,0,0,21],
      [0,12,7,24,0,29],
      [9,0,0,0,27,0],
      [1,5,0,0,33,31],
      [0,0,36,35,0,0]
    ],
    solution: [
      [14,15,16,18,19,20],
      [11,13,17,23,22,21],
      [10,12,7,24,28,29],
      [9,8,6,25,27,30],
      [1,5,4,26,33,31],
      [2,3,36,35,34,32]
    ]
  },
  {
    id: "puzzle-2",
    title: "Hidato 6x6 - Medium 2",
    size: 6,
    difficulty: "medium",
    puzzle: [
      [0,22,0,0,1,7],
      [0,0,20,0,6,0],
      [25,27,0,5,10,0],
      [0,0,18,0,0,0],
      [36,0,29,30,0,12],
      [34,33,0,0,0,13]
    ],
    solution: [
      [23,22,3,2,1,7],
      [24,21,20,4,6,8],
      [25,27,19,5,10,9],
      [26,28,18,17,16,11],
      [36,35,29,30,15,12],
      [34,33,32,31,14,13]
    ]
  }
];

export const getPuzzleById = (id: string): HidatoPuzzle | undefined => {
  return hidatoPuzzles.find((puzzle) => puzzle.id === id);
};

export const getPuzzlesByDifficulty = (difficulty: HidatoPuzzle["difficulty"]): HidatoPuzzle[] => {
  return hidatoPuzzles.filter((puzzle) => puzzle.difficulty === difficulty);
};
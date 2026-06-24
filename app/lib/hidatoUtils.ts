/**
 * Hidato Puzzle Utilities
 * Validation, checking, and helper functions
 */

/**
 * Check if the user's current board state is valid
 * (all filled numbers are consecutive and adjacent)
 */
export const isValidBoard = (board: (number | null)[][]): boolean => {
  const size = board.length;
  const numbers: Set<number> = new Set();

  for (let i = 0; i < size; i++) {
    for (let j = 0; j < size; j++) {
      const cell = board[i][j];
      if (cell !== null && cell !== 0) {
        numbers.add(cell); // ✅ TypeScript now knows cell is number
      }
    }
  }

  if (numbers.size === 0) return false;

  const sorted = Array.from(numbers).sort((a, b) => a - b);
  for (let i = 0; i < sorted.length; i++) {
    if (sorted[i] !== i + 1) return false;
  }

  const maxNumber = Math.max(...Array.from(numbers));

  for (let i = 0; i < size; i++) {
    for (let j = 0; j < size; j++) {
      const current = board[i][j];
      if (current !== null && current > 0) {
        const next = current + 1;
        let found = false;

        for (let di = -1; di <= 1; di++) {
          for (let dj = -1; dj <= 1; dj++) {
            if (di === 0 && dj === 0) continue;
            const ni = i + di;
            const nj = j + dj;

            if (ni >= 0 && ni < size && nj >= 0 && nj < size) {
              if (board[ni][nj] === next) {
                found = true;
              }
            }
          }
        }

        if (next <= maxNumber && !found) {
          return false;
        }
      }
    }
  }

  return true;
};
/**
 * Check if the board is completely filled and correct
 */
export const isSolutionCorrect = (board: (number | null)[][], solution: number[][]): boolean => {
  const size = board.length;

  // Check if all cells are filled
  for (let i = 0; i < size; i++) {
    for (let j = 0; j < size; j++) {
      if (board[i][j] === null || board[i][j] === 0) {
        return false;
      }
    }
  }

  // Check if board matches solution
  for (let i = 0; i < size; i++) {
    for (let j = 0; j < size; j++) {
      if ((board[i][j] as number) !== solution[i][j]) {
        return false;
      }
    }
  }

  return true;
};

/**
 * Get hint for the next empty cell
 */
export const getNextHint = (
  board: (number | null)[][],
  solution: number[][]
): { row: number; col: number; value: number } | null => {
  const size = board.length;

  for (let i = 0; i < size; i++) {
    for (let j = 0; j < size; j++) {
      if (board[i][j] === null || board[i][j] === 0) {
        return {
          row: i,
          col: j,
          value: solution[i][j],
        };
      }
    }
  }

  return null;
};

/**
 * Calculate progress as percentage
 */
export const calculateProgress = (board: (number | null)[][], puzzle: number[][]): number => {
  const size = board.length;
  let filled = 0;
  let total = 0;

  for (let i = 0; i < size; i++) {
    for (let j = 0; j < size; j++) {
      if (puzzle[i][j] === 0) {
        total++;
        if (board[i][j] !== null && board[i][j] !== 0) {
          filled++;
        }
      }
    }
  }

  return total === 0 ? 0 : Math.round((filled / total) * 100);
};

/**
 * Initialize board from puzzle
 */
export const initializeBoard = (puzzle: number[][]): (number | null)[][] => {
  return puzzle.map((row) => row.map((cell) => (cell === 0 ? null : cell)));
};

/**
 * Reset board to initial state (keeping clues)
 */
export const resetBoard = (puzzle: number[][]): (number | null)[][] => {
  return puzzle.map((row) => row.map((cell) => (cell === 0 ? null : cell)));
};

/**
 * Check if adjacent cells form a valid sequence
 */
export const isAdjacentCell = (row1: number, col1: number, row2: number, col2: number): boolean => {
  const rowDiff = Math.abs(row1 - row2);
  const colDiff = Math.abs(col1 - col2);
  return rowDiff <= 1 && colDiff <= 1 && !(rowDiff === 0 && colDiff === 0);
};

/**
 * Get all adjacent cells
 */
export const getAdjacentCells = (
  row: number,
  col: number,
  size: number
): Array<{ row: number; col: number }> => {
  const adjacent = [];

  for (let i = row - 1; i <= row + 1; i++) {
    for (let j = col - 1; j <= col + 1; j++) {
      if (i >= 0 && i < size && j >= 0 && j < size) {
        if (!(i === row && j === col)) {
          adjacent.push({ row: i, col: j });
        }
      }
    }
  }

  return adjacent;
};

/**
 * Get number of clues (given numbers) in puzzle
 */
export const getClueCount = (puzzle: number[][]): number => {
  let count = 0;
  for (const row of puzzle) {
    for (const cell of row) {
      if (cell > 0) count++;
    }
  }
  return count;
};

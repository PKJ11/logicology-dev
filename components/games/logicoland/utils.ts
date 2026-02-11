import { Level, AVAILABLE_COLORS, GridCell, Color } from './data';

// Pick a random word from wordBank
export function pickRandomWord(level: Level): string {
  const randomIndex = Math.floor(Math.random() * level.wordBank.length);
  return level.wordBank[randomIndex];
}

// Encode word to colors
export function encodeWord(word: string, colorMap: Record<string, Color>): Color[] {
  return word.split('').map(letter => colorMap[letter]);
}

// Decode colors to word
export function decodeWord(colors: Color[], colorMap: Record<string, Color>): string {
  const letterMap: Record<string, string> = {};
  Object.entries(colorMap).forEach(([letter, color]) => {
    letterMap[color.hex] = letter;
  });
  
  return colors.map(color => letterMap[color.hex]).join('');
}

// Generate a grid for Colour Crawl
export function generateGridLevel(level: Level): { grid: GridCell[][]; colors: Color[] } {
  const gridSize = level.gridSize || 4;
  const colorsCount = level.colorsCount || 4;
  
  const colors = AVAILABLE_COLORS.slice(0, colorsCount);
  const grid: GridCell[][] = [];
  
  // Create empty grid
  for (let row = 0; row < gridSize; row++) {
    const rowCells: GridCell[] = [];
    for (let col = 0; col < gridSize; col++) {
      rowCells.push({
        row,
        col,
        color: null,
        isStart: false
      });
    }
    grid.push(rowCells);
  }
  
  // Assign colors randomly to each cell
  for (let row = 0; row < gridSize; row++) {
    for (let col = 0; col < gridSize; col++) {
      const randomColorIndex = Math.floor(Math.random() * colorsCount);
      grid[row][col].color = colors[randomColorIndex];
    }
  }
  
  return { grid, colors };
}

// Generate valid moves that stay within grid bounds
export function generateValidMoves(gridSize: number, steps: number): string[] {
  const moves = ['R', 'L', 'U', 'D'];
  const sequence: string[] = [];
  
  // Simulate moves to ensure they stay in bounds
  let currentRow = Math.floor(Math.random() * gridSize);
  let currentCol = Math.floor(Math.random() * gridSize);
  
  for (let i = 0; i < steps; i++) {
    let validMove = false;
    let move: string;
    let attempts = 0;
    
    // Try to find a valid move
    while (!validMove && attempts < 10) {
      move = moves[Math.floor(Math.random() * moves.length)];
      
      // Check if move keeps us in bounds
      let newRow = currentRow;
      let newCol = currentCol;
      
      switch (move) {
        case 'R': newCol++; break;
        case 'L': newCol--; break;
        case 'U': newRow--; break;
        case 'D': newRow++; break;
      }
      
      if (newRow >= 0 && newRow < gridSize && newCol >= 0 && newCol < gridSize) {
        sequence.push(move);
        currentRow = newRow;
        currentCol = newCol;
        validMove = true;
      }
      
      attempts++;
    }
    
    // If we couldn't find a valid move, break
    if (!validMove) break;
  }
  
  return sequence;
}

// Calculate final position from moves
export function calculateFinalPosition(
  startRow: number,
  startCol: number,
  moves: string[],
  gridSize: number
): { row: number; col: number } | null {
  let row = startRow;
  let col = startCol;
  
  for (const move of moves) {
    switch (move) {
      case 'R': col++; break;
      case 'L': col--; break;
      case 'U': row--; break;
      case 'D': row++; break;
    }
    
    // Check bounds
    if (row < 0 || row >= gridSize || col < 0 || col >= gridSize) {
      return null;
    }
  }
  
  return { row, col };
}

// Fisher-Yates shuffle
export function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}
// Game logic utilities for Logicoland Volume 5

import { Direction, ArrowDirection, findPositionByNumber } from "@/app/data/volume5";

export class GameLogic {
  // Calculate final position for Colour Crawl
  static calculateColorCrawlPosition(
    start: [number, number],
    moves: Direction[],
    grid: string[][]
  ): { position: [number, number]; path: [number, number][]; isValid: boolean } {
    const path: [number, number][] = [start];
    let current = [...start] as [number, number];

    for (const move of moves) {
      const next = this.getNextPosition(current, move);

      // Check if position is within grid bounds
      if (next[0] < 0 || next[0] >= grid.length || next[1] < 0 || next[1] >= grid[0].length) {
        return { position: current, path, isValid: false };
      }

      current = next;
      path.push([...current]);
    }

    return { position: current, path, isValid: true };
  }

  // Calculate final position for Arrows Address
  // In GameLogic.ts, update calculateArrowsAddressPosition to use the updated function
  static calculateArrowsAddressPosition(
    startNumber: number,
    moves: ArrowDirection[],
    grid: number[][]
  ): { position: [number, number]; path: [number, number][]; number: number; isValid: boolean } {
    // Find start position using the utility function
    const startPos = findPositionByNumber(grid, startNumber);

    const path: [number, number][] = [startPos];
    let current = [...startPos] as [number, number];

    for (const move of moves) {
      const next = this.getNextArrowPosition(current, move);

      // Check if position is within grid bounds
      if (next[0] < 0 || next[0] >= grid.length || next[1] < 0 || next[1] >= grid[0].length) {
        return { position: current, path, number: grid[current[0]][current[1]], isValid: false };
      }

      current = next;
      path.push([...current]);
    }

    return {
      position: current,
      path,
      number: grid[current[0]][current[1]],
      isValid: true,
    };
  }

  // Get next position based on direction
  private static getNextPosition(
    current: [number, number],
    direction: Direction
  ): [number, number] {
    const [row, col] = current;

    switch (direction) {
      case "F":
      case "U":
        return [row - 1, col];
      case "B":
      case "D":
        return [row + 1, col];
      case "L":
        return [row, col - 1];
      case "R":
        return [row, col + 1];
      default:
        return [row, col];
    }
  }

  // Get next position based on arrow direction
  private static getNextArrowPosition(
    current: [number, number],
    direction: ArrowDirection
  ): [number, number] {
    const [row, col] = current;

    switch (direction) {
      case "↑":
        return [row - 1, col];
      case "↓":
        return [row + 1, col];
      case "←":
        return [row, col - 1];
      case "→":
        return [row, col + 1];
      default:
        return [row, col];
    }
  }

  // Calculate knight moves (for Section 4)
  static getKnightMoves(
    position: [number, number],
    gridSize: [number, number]
  ): [number, number][] {
    const moves: [number, number][] = [];
    const [row, col] = position;
    const [maxRows, maxCols] = gridSize;

    const knightOffsets = [
      [-2, -1],
      [-2, 1],
      [-1, -2],
      [-1, 2],
      [1, -2],
      [1, 2],
      [2, -1],
      [2, 1],
    ];

    for (const [rowOffset, colOffset] of knightOffsets) {
      const newRow = row + rowOffset;
      const newCol = col + colOffset;

      if (newRow >= 0 && newRow < maxRows && newCol >= 0 && newCol < maxCols) {
        moves.push([newRow, newCol]);
      }
    }

    return moves;
  }

  // Check if path is valid (for Section 3)
  static validateRoute(
    start: [number, number],
    moves: ArrowDirection[],
    grid: string[][],
    target: [number, number]
  ): { isValid: boolean; path: [number, number][]; reachedTarget: boolean } {
    const path: [number, number][] = [start];
    let current = [...start] as [number, number];

    for (const move of moves) {
      const next = this.getNextArrowPosition(current, move);

      // Check bounds
      if (next[0] < 0 || next[0] >= grid.length || next[1] < 0 || next[1] >= grid[0].length) {
        return { isValid: false, path, reachedTarget: false };
      }

      // Check if cell is blocked
      if (grid[next[0]][next[1]] === "block") {
        return { isValid: false, path, reachedTarget: false };
      }

      current = next;
      path.push([...current]);
    }

    const reachedTarget = current[0] === target[0] && current[1] === target[1];
    return { isValid: true, path, reachedTarget };
  }
}

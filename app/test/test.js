class HidatoValidator {
    constructor(grid) {
        this.grid = grid;
        this.rows = grid.length;
        this.cols = grid[0].length;
        this.solutions = [];
        this.maxSolutions = 2;

        // Collect all pre-placed numbers and find the max
        this.givenNumbers = this.collectGivenNumbers();
        this.maxNumber = this.givenNumbers.length > 0
            ? Math.max(...this.givenNumbers.map(g => g.num))
            : 0;

        // totalCells = number of cells we need to fill (1..N)
        this.totalCells = this.rows * this.cols;

        // Build a fast lookup: number -> {row, col}
        this.givenMap = new Map();
        for (const g of this.givenNumbers) {
            this.givenMap.set(g.num, { row: g.row, col: g.col });
        }
    }

    collectGivenNumbers() {
        const numbers = [];
        for (let i = 0; i < this.rows; i++) {
            for (let j = 0; j < this.cols; j++) {
                if (this.grid[i][j] !== 0) {
                    numbers.push({ num: this.grid[i][j], row: i, col: j });
                }
            }
        }
        return numbers.sort((a, b) => a.num - b.num);
    }

    validate() {
        // 1. Basic structural checks
        const basic = this.validateBasic();
        if (!basic.isValid) return basic;

        // 2. Number range / duplicate checks
        const numCheck = this.validateGivenNumbers();
        if (!numCheck.isValid) return numCheck;

        // 3. Must have 1 and N
        const start = this.givenMap.get(1);
        const end   = this.givenMap.get(this.totalCells);

        if (!start) return { isValid: false, isUnique: false, message: "Puzzle must contain number 1" };
        if (!end)   return { isValid: false, isUnique: false, message: `Puzzle must contain number ${this.totalCells}` };

        // 4. Consecutive given numbers must be reachable from each other
        const reach = this.validateReachability();
        if (!reach.isValid) return reach;

        // 5. Backtracking search
        this.solutions = [];
        const gridCopy = this.grid.map(r => [...r]);
        this.findSolutions(gridCopy, start.row, start.col, 1);

        if (this.solutions.length === 0) {
            return { isValid: false, isUnique: false, message: "No valid solution exists for this puzzle" };
        } else if (this.solutions.length === 1) {
            return { isValid: true, isUnique: true, message: "Valid Hidato puzzle with a unique solution", solution: this.solutions[0] };
        } else {
            return { isValid: true, isUnique: false, message: `Puzzle has multiple solutions (not unique)`, solutions: this.solutions };
        }
    }

    validateBasic() {
        const colCount = this.cols;
        for (let i = 1; i < this.rows; i++) {
            if (this.grid[i].length !== colCount)
                return { isValid: false, isUnique: false, message: "Grid is not rectangular" };
        }
        if (this.rows > 9 || this.cols > 9)
            return { isValid: false, isUnique: false, message: "Grid too large (max 9x9)" };
        return { isValid: true };
    }

    validateGivenNumbers() {
        const seen = new Set();
        const N = this.totalCells;
        for (let i = 0; i < this.rows; i++) {
            for (let j = 0; j < this.cols; j++) {
                const v = this.grid[i][j];
                if (v === 0) continue;
                if (v < 1 || v > N)
                    return { isValid: false, isUnique: false, message: `Number ${v} at (${i},${j}) out of range [1..${N}]` };
                if (seen.has(v))
                    return { isValid: false, isUnique: false, message: `Duplicate number ${v}` };
                seen.add(v);
            }
        }
        return { isValid: true };
    }

    validateReachability() {
        const given = this.givenNumbers;
        for (let i = 0; i < given.length - 1; i++) {
            const a = given[i], b = given[i + 1];
            const steps = b.num - a.num;
            const minDist = this.chebyshevDist(a, b);

            if (minDist > steps) {
                return {
                    isValid: false, isUnique: false,
                    message: `Numbers ${a.num} and ${b.num} are too far apart (need ${minDist} steps, have ${steps})`
                };
            }

            // If parity check: (steps - minDist) must be achievable.
            // A simple necessary condition: enough free cells exist in the region.
            // We do a BFS reachability with step count on the ORIGINAL grid.
            if (!this.bfsCanReach(this.grid, a.row, a.col, b.row, b.col, steps)) {
                return {
                    isValid: false, isUnique: false,
                    message: `Cannot reach from ${a.num} to ${b.num} in ${steps} steps given current layout`
                };
            }
        }
        return { isValid: true };
    }

    /**
     * BFS reachability: can we get from (sr,sc) to (tr,tc) in exactly `steps` moves,
     * only passing through empty (0) cells (and the target cell)?
     * We track (row, col, stepsUsed) and allow revisiting cells at different step counts
     * but prune states that can't possibly reach target in remaining steps.
     */
    bfsCanReach(grid, sr, sc, tr, tc, steps) {
        // State: [row, col, stepsLeft]
        // We use BFS and prune by parity + Chebyshev lower bound
        const visited = new Set();
        const queue = [[sr, sc, steps]];
        visited.add(`${sr},${sc},${steps}`);

        const dirs = [[-1,-1],[-1,0],[-1,1],[0,-1],[0,1],[1,-1],[1,0],[1,1]];

        while (queue.length > 0) {
            const [r, c, left] = queue.shift();

            if (r === tr && c === tc && left === 0) return true;
            if (left === 0) continue;

            for (const [dr, dc] of dirs) {
                const nr = r + dr, nc = c + dc;
                if (nr < 0 || nr >= this.rows || nc < 0 || nc >= this.cols) continue;

                const cell = grid[nr][nc];
                // Can step on empty cells OR the target cell
                if (cell !== 0 && !(nr === tr && nc === tc)) continue;

                const newLeft = left - 1;
                const minDist = this.chebyshevDist({ row: nr, col: nc }, { row: tr, col: tc });
                if (minDist > newLeft) continue; // Can't reach target in time

                const key = `${nr},${nc},${newLeft}`;
                if (!visited.has(key)) {
                    visited.add(key);
                    queue.push([nr, nc, newLeft]);
                }
            }
        }
        return false;
    }

    chebyshevDist(a, b) {
        return Math.max(Math.abs(a.row - b.row), Math.abs(a.col - b.col));
    }

    // ─── Core Backtracking ────────────────────────────────────────────────────

    findSolutions(grid, row, col, currentNum) {
        if (this.solutions.length >= this.maxSolutions) return;

        if (currentNum === this.totalCells) {
            this.solutions.push(grid.map(r => [...r]));
            return;
        }

        const nextNum = currentNum + 1;

        // If next number is pre-placed, we MUST go there and it MUST be adjacent
        const prePos = this.givenMap.get(nextNum);
        if (prePos) {
            if (this.isAdjacent(row, col, prePos.row, prePos.col)) {
                this.findSolutions(grid, prePos.row, prePos.col, nextNum);
            }
            // Either we recurse or we don't — no backtracking needed for pre-placed
            return;
        }

        // Try all 8 neighbours that are empty
        const dirs = [[-1,-1],[-1,0],[-1,1],[0,-1],[0,1],[1,-1],[1,0],[1,1]];
        const moves = [];

        for (const [dr, dc] of dirs) {
            const nr = row + dr, nc = col + dc;
            if (nr < 0 || nr >= this.rows || nc < 0 || nc >= this.cols) continue;
            if (grid[nr][nc] !== 0) continue;
            moves.push([nr, nc]);
        }

        // Heuristic: sort moves closer to the next given number first
        const nextGiven = this.nextGivenAfter(nextNum);
        if (nextGiven) {
            moves.sort((a, b) =>
                this.chebyshevDist({ row: a[0], col: a[1] }, nextGiven) -
                this.chebyshevDist({ row: b[0], col: b[1] }, nextGiven)
            );
        }

        for (const [nr, nc] of moves) {
            // Pruning: after placing nextNum here, can we still reach the next given?
            if (nextGiven) {
                const stepsLeft = nextGiven.num - nextNum;
                const dist = this.chebyshevDist({ row: nr, col: nc }, nextGiven);
                if (dist > stepsLeft) continue;
            }

            grid[nr][nc] = nextNum;

            // Deeper pruning: BFS reachability to next given from (nr,nc)
            // Only do this when the next given is fairly close (performance guard)
            let prune = false;
            if (nextGiven && (nextGiven.num - nextNum) <= 12) {
                grid[nr][nc] = nextNum; // already set
                prune = !this.bfsCanReachOnGrid(grid, nr, nc, nextGiven.row, nextGiven.col, nextGiven.num - nextNum, nextNum);
            }

            if (!prune) {
                this.findSolutions(grid, nr, nc, nextNum);
            }

            grid[nr][nc] = 0; // backtrack
        }
    }

    /**
     * BFS reachability on a live (partially filled) grid.
     * Cells with values > currentNum but < targetNum are treated as blocked
     * (they're pre-placed givens that the path can't use).
     * The target cell itself (a given) is always passable.
     */
    bfsCanReachOnGrid(grid, sr, sc, tr, tc, steps, currentNum) {
        const visited = new Set();
        const queue = [[sr, sc, steps]];
        visited.add(`${sr},${sc},${steps}`);
        const dirs = [[-1,-1],[-1,0],[-1,1],[0,-1],[0,1],[1,-1],[1,0],[1,1]];

        while (queue.length > 0) {
            const [r, c, left] = queue.shift();
            if (r === tr && c === tc && left === 0) return true;
            if (left === 0) continue;

            for (const [dr, dc] of dirs) {
                const nr = r + dr, nc = c + dc;
                if (nr < 0 || nr >= this.rows || nc < 0 || nc >= this.cols) continue;

                const cell = grid[nr][nc];
                const isTarget = nr === tr && nc === tc;

                // Passable if: empty (0) OR is the target cell
                // Blocked if: already filled with something that's not the target
                if (!isTarget && cell !== 0) continue;

                const newLeft = left - 1;
                const minDist = this.chebyshevDist({ row: nr, col: nc }, { row: tr, col: tc });
                if (minDist > newLeft) continue;

                const key = `${nr},${nc},${newLeft}`;
                if (!visited.has(key)) {
                    visited.add(key);
                    queue.push([nr, nc, newLeft]);
                }
            }
        }
        return false;
    }

    nextGivenAfter(num) {
        for (const g of this.givenNumbers) {
            if (g.num > num) return g;
        }
        return null;
    }

    isAdjacent(r1, c1, r2, c2) {
        return Math.abs(r1 - r2) <= 1 && Math.abs(c1 - c2) <= 1 && !(r1 === r2 && c1 === c2);
    }

    // ─── Utility ──────────────────────────────────────────────────────────────

    static printGrid(grid, title = "") {
        if (title) console.log(title);
        const rows = grid.length, cols = grid[0].length;
        let maxLen = 2;
        for (const row of grid) for (const v of row) if (v) maxLen = Math.max(maxLen, String(v).length);
        let out = "";
        for (let i = 0; i < rows; i++) {
            out += "|";
            for (let j = 0; j < cols; j++) {
                const v = grid[i][j];
                out += (v === 0 ? "·" : String(v)).padStart(maxLen + 1) + "  |";
            }
            out += "\n" + "-".repeat(cols * (maxLen + 4) + 1) + "\n";
        }
        console.log(out);
        return out;
    }
}

// ─── Test Harness ─────────────────────────────────────────────────────────────

function testHidatoPuzzle(puzzle, name) {
    console.log(`\n${"=".repeat(60)}`);
    console.log(`🧩 TESTING: ${name}`);
    console.log("=".repeat(60));
    HidatoValidator.printGrid(puzzle, "Puzzle (0 = empty):");

    const v = new HidatoValidator(puzzle);
    const result = v.validate();

    console.log(`Valid:   ${result.isValid  ? "✅ YES" : "❌ NO"}`);
    console.log(`Unique:  ${result.isUnique ? "✅ YES" : "❌ NO"}`);
    console.log(`Message: ${result.message}`);

    if (result.solution) {
        HidatoValidator.printGrid(result.solution, "\n✨ Solution:");
        verifySolution(puzzle, result.solution);
    } else if (result.solutions) {
        console.log("First solution:");
        HidatoValidator.printGrid(result.solutions[0]);
        HidatoValidator.printGrid(result.solutions[1], "Second solution:");
    }
    return result;
}

function verifySolution(original, solution) {
    const rows = original.length, cols = original[0].length;
    const N = rows * cols;
    let ok = true;
    const fail = msg => { console.log("   ❌ " + msg); ok = false; };

    // All cells filled
    for (let i = 0; i < rows; i++)
        for (let j = 0; j < cols; j++)
            if (!solution[i][j]) fail(`Cell (${i},${j}) is empty`);

    // Givens preserved
    for (let i = 0; i < rows; i++)
        for (let j = 0; j < cols; j++)
            if (original[i][j] !== 0 && original[i][j] !== solution[i][j])
                fail(`Given ${original[i][j]} at (${i},${j}) changed to ${solution[i][j]}`);

    // All numbers 1..N present
    const seen = new Set();
    for (let i = 0; i < rows; i++) for (let j = 0; j < cols; j++) seen.add(solution[i][j]);
    for (let n = 1; n <= N; n++) if (!seen.has(n)) fail(`Number ${n} missing`);

    // Consecutive adjacency
    const pos = num => {
        for (let i = 0; i < rows; i++)
            for (let j = 0; j < cols; j++)
                if (solution[i][j] === num) return { r: i, c: j };
        return null;
    };
    for (let n = 1; n < N; n++) {
        const a = pos(n), b = pos(n + 1);
        if (!a || !b) continue;
        if (Math.abs(a.r - b.r) > 1 || Math.abs(a.c - b.c) > 1)
            fail(`${n} and ${n+1} not adjacent: (${a.r},${a.c}) vs (${b.r},${b.c})`);
    }

    console.log(ok ? "   ✅ Solution verified!" : "   ⚠️  Verification failed.");
    return ok;
}

// ─── Test Cases ───────────────────────────────────────────────────────────────

// Your 4x4 puzzle
testHidatoPuzzle( [
  [0, 21, 35, 36, 0, 32],
  [0, 23, 24, 0, 31, 0],
  [19, 0, 0, 0, 0, 29],
  [18, 13, 0, 0, 4, 1],
  [14, 0, 11, 0, 0, 0],
  [0, 16, 10, 8, 0, 0]
], "Your 4x4 Puzzle");

// Simple 3x3 — should be unique

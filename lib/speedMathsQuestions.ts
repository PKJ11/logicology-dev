// Question and answer-option generation for Speed Maths.
//
// Wrong options are built from the mistakes students actually make (carry and borrow
// slips, swapped digits, neighbouring table facts, a forgotten ".5"), so the right
// answer can't be spotted from the shape of the options. The rule that every option
// set follows:
//   • always exactly four options, all different;
//   • never zero or negative;
//   • the correct answer's rank among the options is random, so "pick the middle one"
//     or "pick the one between two options 20 apart" doesn't work;
//   • options are shown in a fair (Fisher–Yates) random order.

export type Challenge =
  | "Addition"
  | "Subtraction"
  | "Multiplication"
  | "Half"
  | "Squares"
  | "Friends";

export interface Question {
  num1: number;
  num2?: number;
  answer: number;
  options?: number[];
  display: string;
}

/** Fair Fisher–Yates shuffle (sort(() => Math.random() - 0.5) is biased). */
export function shuffle<T>(arr: readonly T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export function rand(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

/** Reverse the digits of a whole number (47 → 74). Returns null if nothing changes. */
function swapDigits(n: number): number | null {
  if (!Number.isInteger(n) || n < 10) return null;
  const r = Number(String(n).split("").reverse().join(""));
  return r !== n ? r : null;
}

const OPTION_COUNT = 4;

/**
 * Builds the four options for a question.
 * `mistakes` lists plausible wrong answers, most realistic first; invalid ones
 * (≤ 0, equal to the answer, outside `max`, duplicates) are dropped and the set is
 * topped up with nearby numbers so there are always four options.
 */
export function buildOptions(
  answer: number,
  mistakes: number[],
  { max = Infinity }: { max?: number } = {}
): number[] {
  const ok = (x: number) =>
    Number.isFinite(x) && x > 0 && x < max && Math.abs(x - answer) > 1e-9;
  const pool = Array.from(new Set(mistakes.filter(ok)));
  const below = shuffle(pool.filter((x) => x < answer));
  const above = shuffle(pool.filter((x) => x > answer));

  // Pick how many wrong options sit below the answer, uniformly from what is possible,
  // so the answer's rank (smallest, 2nd, 3rd, largest) gives nothing away.
  const need = OPTION_COUNT - 1;
  const feasible: number[] = [];
  for (let k = 0; k <= need; k++) {
    if (below.length >= k && above.length >= need - k) feasible.push(k);
  }
  let picked: number[];
  if (feasible.length > 0) {
    const k = feasible[Math.floor(Math.random() * feasible.length)];
    picked = [...below.slice(0, k), ...above.slice(0, need - k)];
  } else {
    picked = shuffle(pool).slice(0, need);
  }

  // Top up with nearby numbers, varying the gap, if the mistakes ran out.
  const step = Number.isInteger(answer) ? 1 : 0.5;
  for (let gap = step; picked.length < need && gap < 1000; gap += step) {
    for (const x of shuffle([answer + gap, answer - gap])) {
      if (picked.length < need && ok(x) && !picked.includes(x)) picked.push(x);
    }
  }
  return shuffle([answer, ...picked]);
}

// ── Mistake lists per skill ──────────────────────────────────────────────────

function additionMistakes(a: number, b: number) {
  const ans = a + b;
  return [
    ans + 10, ans - 10, // carry slip
    ans + 1, ans - 1, // counting slip
    ans + 2, ans - 2,
    swapDigits(ans) ?? ans + 11,
    ans + 9, ans - 9,
  ];
}

function subtractionMistakes(a: number, b: number) {
  const ans = a - b;
  // "Smaller from larger" in each column instead of borrowing: 52 − 17 → 45.
  const ta = Math.floor(a / 10), ua = a % 10, tb = Math.floor(b / 10), ub = b % 10;
  const noBorrow = Math.abs(ta - tb) * 10 + Math.abs(ua - ub);
  return [
    noBorrow,
    ans + 10, ans - 10, // borrow slip
    ans + 1, ans - 1,
    ans + 2, ans - 2,
    swapDigits(ans) ?? ans + 11,
  ];
}

function multiplicationMistakes(a: number, b: number) {
  const ans = a * b;
  return [
    (a + 1) * b, (a - 1) * b, // neighbouring table facts
    a * (b + 1), a * (b - 1),
    ans + 10, ans - 10,
    swapDigits(ans) ?? ans + 2,
    ans + 2, ans - 2,
  ];
}

function halfMistakes(n: number) {
  const ans = n / 2;
  const list = [
    ans + 5, ans - 5, // the "add 5 for an odd digit" step slipped
    ans + 10, ans - 10,
    ans + 50, ans - 50, // halved the hundreds wrongly
    ans + 1, ans - 1,
  ];
  // Forgetting the ".5", or adding one where there is none.
  if (!Number.isInteger(ans)) list.unshift(Math.floor(ans), Math.ceil(ans));
  else list.push(ans + 0.5, ans - 0.5);
  return list;
}

function squareMistakes(a: number) {
  const ans = a * a;
  return [
    (a + 1) * (a + 1), (a - 1) * (a - 1),
    a * (a + 1), a * (a - 1),
    ans + 100, ans - 100, // carry into the front part slipped
    ans + 10, ans - 10,
  ];
}

function friendMistakes(a: number, base: number) {
  const ans = base - a;
  if (base === 100) {
    return [ans + 10, ans - 10, ans + 1, ans - 1, ans + 9, ans - 9, ans + 11, ans - 11];
  }
  return [ans + 1, ans - 1, ans + 2, ans - 2, ans + 3, ans - 3];
}

// ── Question generators ─────────────────────────────────────────────────────

/** Multiplication tables used by Quick Mix: 2 to 12, never 0 or 1. */
export const QUICK_MIX_MIN = 2;
export const QUICK_MIX_MAX = 12;

export function generateQuestion(challenge: Challenge): Question {
  switch (challenge) {
    case "Addition": {
      const a = rand(1, 50),
        b = rand(1, 50),
        ans = a + b;
      return { num1: a, num2: b, answer: ans, display: `${a} + ${b}`, options: buildOptions(ans, additionMistakes(a, b)) };
    }
    case "Subtraction": {
      const a = rand(10, 99),
        b = rand(1, a - 1), // answer is always at least 1
        ans = a - b;
      return { num1: a, num2: b, answer: ans, display: `${a} − ${b}`, options: buildOptions(ans, subtractionMistakes(a, b)) };
    }
    case "Multiplication":
      return generateMultiplicationRangeQuestion(QUICK_MIX_MIN, QUICK_MIX_MAX, { split: false });
    case "Half": {
      const a = rand(1, 999),
        ans = a / 2;
      return { num1: a, answer: ans, display: `½ of ${a}`, options: buildOptions(ans, halfMistakes(a)) };
    }
    case "Squares": {
      const a = rand(11, 59),
        ans = a * a;
      return { num1: a, answer: ans, display: `${a}²`, options: buildOptions(ans, squareMistakes(a)) };
    }
    case "Friends": {
      const base = shuffle([9, 10, 100])[0];
      const a = base === 100 ? rand(11, 89) : rand(1, base - 1);
      const ans = base - a;
      return {
        num1: a,
        answer: ans,
        display: `${a} + ? = ${base}`,
        options: buildOptions(ans, friendMistakes(a, base), { max: base }),
      };
    }
  }
}

/**
 * A × B with both factors from [minVal, maxVal] (never below 2).
 * With `split`, A comes from the lower half of the range and B from the upper half,
 * as Table Challenge describes on its setup screen.
 */
export function generateMultiplicationRangeQuestion(
  minVal: number,
  maxVal: number,
  { split = true }: { split?: boolean } = {}
): Question {
  const lo = Math.max(2, Math.min(minVal, maxVal));
  const hi = Math.max(lo, maxVal);
  const mid = Math.floor((lo + hi) / 2);
  const a = split ? rand(lo, mid) : rand(lo, hi);
  const b = split ? rand(mid, hi) : rand(lo, hi);
  const ans = a * b;
  return {
    num1: a,
    num2: b,
    answer: ans,
    display: `${a} × ${b}`,
    options: buildOptions(ans, multiplicationMistakes(a, b)),
  };
}

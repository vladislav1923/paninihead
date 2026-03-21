export function parseCommaSeparatedNumbers(value: string): number[] {
  if (!value || !value.trim()) return [];
  return value
    .split(",")
    .map(s => s.trim())
    .filter(Boolean)
    .map(s => parseInt(s, 10))
    .filter(n => !Number.isNaN(n));
}

/** Count occurrences of each sticker number in a collected list (order not preserved in the map). */
export function collectedToCounts(arr: number[]): Map<number, number> {
  const m = new Map<number, number>();
  for (const n of arr) {
    m.set(n, (m.get(n) ?? 0) + 1);
  }
  return m;
}

/** Expand per-number counts into a sorted multiset array for slots 1..total (for persistence). */
export function countsToCollected(counts: Map<number, number>, total: number): number[] {
  const arr: number[] = [];
  for (let n = 1; n <= total; n++) {
    const c = counts.get(n) ?? 0;
    for (let i = 0; i < c; i++) arr.push(n);
  }
  return arr;
}

/**
 * Numbers that the exchanger has and we don't have in collected (we could receive).
 */
export function getInNumbers(has: number[], collected: number[]): number[] {
  const collectedSet = new Set(collected);
  return has.filter(n => !collectedSet.has(n));
}

/**
 * Numbers that the exchanger needs and we have more than 1 of in collected (duplicates we can give).
 */
export function getOutNumbers(needs: number[], collected: number[]): number[] {
  const collectedCounts = collectedToCounts(collected);
  const needSet = new Set(needs);
  return [...needSet].filter(n => (collectedCounts.get(n) ?? 0) > 1);
}

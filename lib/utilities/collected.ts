export function parseCommaSeparatedNumbers(value: string): number[] {
  if (!value || !value.trim()) return [];
  return value
    .split(",")
    .map(s => s.trim())
    .filter(Boolean)
    .map(s => parseInt(s, 10))
    .filter(n => !Number.isNaN(n));
}

function countBy(arr: number[]): Map<number, number> {
  const m = new Map<number, number>();
  for (const n of arr) m.set(n, (m.get(n) ?? 0) + 1);
  return m;
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
  const collectedCounts = countBy(collected);
  const needSet = new Set(needs);
  return [...needSet].filter(n => (collectedCounts.get(n) ?? 0) > 1);
}

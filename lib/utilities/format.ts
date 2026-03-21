/**
 * Normalizes pasted or free-typed number lists for comma-separated fields:
 * strips parenthetical notes, keeps only digits/commas/spaces, turns runs of spaces into commas, dedupes separators.
 */
export function formatNumbersText(text: string): string {
  if (!text.trim()) return "";
  // 1. Remove content in parenthesis
  let s = text.replace(/\([^)]*\)/g, "");
  // 2. Remove all symbols that are not numbers, commas, or spaces
  s = s.replace(/[^0-9,\s]/g, "");
  // 3. Numbers divided by spaces → replace spaces with commas
  s = s.replace(/\s+/g, ",");
  // 4. Normalize: split by comma, trim, drop empty, join with single comma
  const parts = s
    .split(",")
    .map(p => p.trim())
    .filter(p => p.length > 0);
  return parts.join(",");
}

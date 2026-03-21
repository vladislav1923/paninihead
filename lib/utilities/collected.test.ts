import {
  collectedToCounts,
  countsToCollected,
  getInNumbers,
  getOutNumbers,
  parseCommaSeparatedNumbers,
} from "./collected";

describe("collectedToCounts", () => {
  it("returns empty map for empty array", () => {
    expect([...collectedToCounts([])]).toEqual([]);
  });

  it("counts duplicates", () => {
    const m = collectedToCounts([1, 2, 2, 3]);
    expect(m.get(1)).toBe(1);
    expect(m.get(2)).toBe(2);
    expect(m.get(3)).toBe(1);
  });
});

describe("countsToCollected", () => {
  it("returns empty array when total is 0", () => {
    expect(countsToCollected(new Map(), 0)).toEqual([]);
  });

  it("expands counts in order 1..total", () => {
    const m = new Map<number, number>([
      [1, 2],
      [2, 0],
      [3, 1],
    ]);
    expect(countsToCollected(m, 3)).toEqual([1, 1, 3]);
  });

  it("round-trips with collectedToCounts for valid range", () => {
    const collected = [1, 1, 2, 4, 4, 4];
    const total = 4;
    expect(countsToCollected(collectedToCounts(collected), total)).toEqual(collected);
  });
});

describe("parseCommaSeparatedNumbers", () => {
  it("returns empty array for empty or whitespace-only string", () => {
    expect(parseCommaSeparatedNumbers("")).toEqual([]);
    expect(parseCommaSeparatedNumbers("   ")).toEqual([]);
  });

  it("parses single integer", () => {
    expect(parseCommaSeparatedNumbers("42")).toEqual([42]);
  });

  it("parses comma-separated integers with optional spaces", () => {
    expect(parseCommaSeparatedNumbers("1, 2, 3")).toEqual([1, 2, 3]);
  });

  it("drops empty segments from repeated commas", () => {
    expect(parseCommaSeparatedNumbers("1,,2")).toEqual([1, 2]);
  });

  it("filters out NaN from non-numeric tokens", () => {
    expect(parseCommaSeparatedNumbers("1, x, 3")).toEqual([1, 3]);
  });

  it("parses negative integers", () => {
    expect(parseCommaSeparatedNumbers("-1, 2")).toEqual([-1, 2]);
  });
});

describe("getInNumbers", () => {
  it("returns has numbers not already in collected", () => {
    expect(getInNumbers([1, 2, 3], [2])).toEqual([1, 3]);
  });

  it("returns empty when all has values are collected", () => {
    expect(getInNumbers([1, 2], [1, 2])).toEqual([]);
  });

  it("returns full has when collected is empty", () => {
    expect(getInNumbers([10, 20], [])).toEqual([10, 20]);
  });
});

describe("getOutNumbers", () => {
  it("returns needs where we hold more than one copy", () => {
    expect(getOutNumbers([5, 6], [5, 5, 5])).toEqual([5]);
  });

  it("returns empty when we only have one of a needed number", () => {
    expect(getOutNumbers([1], [1])).toEqual([]);
  });

  it("dedupes needs before filtering", () => {
    expect(getOutNumbers([7, 7], [7, 7, 7])).toEqual([7]);
  });

  it("returns empty when need is not in collected", () => {
    expect(getOutNumbers([9], [1, 1])).toEqual([]);
  });
});

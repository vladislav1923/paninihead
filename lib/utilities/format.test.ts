import { formatNumbersText } from "./format";

describe("formatNumbersText", () => {
  it("returns empty string for empty or whitespace-only input", () => {
    expect(formatNumbersText("")).toBe("");
    expect(formatNumbersText("   ")).toBe("");
  });

  it("normalizes comma-separated numbers with spaces", () => {
    expect(formatNumbersText("1, 2, 3")).toBe("1,2,3");
  });

  it("strips parenthetical segments and joins numbers", () => {
    expect(formatNumbersText("1 (spare) 2")).toBe("1,2");
  });

  it("turns runs of spaces into comma-separated numbers", () => {
    expect(formatNumbersText("1  2   3")).toBe("1,2,3");
  });

  it("keeps digits and commas from mixed alphanumeric input", () => {
    expect(formatNumbersText("a1b, 2c")).toBe("1,2");
  });

  it("collapses repeated commas into a single separator", () => {
    expect(formatNumbersText("1,,,2")).toBe("1,2");
  });

  it("trims outer whitespace and empty comma segments", () => {
    expect(formatNumbersText(" 1 , , 2 ")).toBe("1,2");
  });
});

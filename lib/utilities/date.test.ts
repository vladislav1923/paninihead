import { formatDate } from "./date";

describe("formatDate", () => {
  it("formats with en-US medium date style", () => {
    const d = new Date(2024, 2, 15);
    expect(formatDate(d)).toBe(
      new Intl.DateTimeFormat("en-US", { dateStyle: "medium" }).format(d),
    );
  });
});

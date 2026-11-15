import { describe, expect, test } from "vitest";
import { formatDecimal, formatUsd } from "./format";

describe("formatUsd", () => {
  test("formats whole dollars with separators", () => {
    expect(formatUsd(1200)).toBe("$1,200");
  });

  test("rounds only for presentation", () => {
    expect(formatUsd(599.6)).toBe("$600");
  });

  test("uses a true minus sign for negative values", () => {
    expect(formatUsd(-300)).toBe("−$300");
  });

  test("does not show a minus sign for values that round to zero", () => {
    expect(formatUsd(-0.2)).toBe("$0");
  });
});

describe("formatDecimal", () => {
  test("shows at most one decimal place", () => {
    expect(formatDecimal(2)).toBe("2");
    expect(formatDecimal(2.46)).toBe("2.5");
  });
});

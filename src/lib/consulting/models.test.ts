import { describe, expect, test } from "vitest";
import { PACK_BASE, captureScore, packCost, packsPerYear, tornado, type ScoredFact } from "./models";

describe("ABS battery pack cost model (reproduces the engagement's numbers)", () => {
  test("base case: about $0.32M per truck, 8% of a US-built ultra-class truck", () => {
    const result = packCost(PACK_BASE);
    expect(result.chinaPack).toBeCloseTo(546_000, 0);
    expect(result.absPack).toBeCloseTo(864_864, 0);
    expect(result.gap).toBeCloseTo(318_864, 0);
    expect(result.gapPctOfTruck).toBeCloseTo(8.27, 2);
  });

  test("sensitivity bounds match the speaker notes", () => {
    const rows = Object.fromEntries(tornado(PACK_BASE).map((r) => [r.input, [Math.round(r.low), Math.round(r.high)]]));
    expect(rows.miningMultiplier).toEqual([191_318, 446_410]);
    expect(rows.absPremium).toEqual([240_240, 944_580]);
    expect(rows.packMwh).toEqual([171_696, 392_448]);
  });

  test("the ABS premium swings the gap the most, so it sorts first", () => {
    expect(tornado(PACK_BASE)[0].input).toBe("absPremium");
  });

  test("the 6–25% range is the premium's low and high bounds", () => {
    const [premium] = tornado(PACK_BASE);
    expect((premium.low / PACK_BASE.truckValue) * 100).toBeCloseTo(6.2, 1);
    expect((premium.high / PACK_BASE.truckValue) * 100).toBeCloseTo(24.5, 1);
  });

  test("capacity: 2.6 GWh × 50% ÷ 2.6 MWh ≈ 500 packs a year", () => {
    expect(packsPerYear(2.6, 0.5, 2.6)).toBe(500);
  });
});

describe("evidence-weighted capture score", () => {
  const fact = (direction: "for" | "against", impact: 1 | 2 | 3, confidence: "A" | "B" | "C" | "D", relevance: 0 | 0.5 | 1 = 1): ScoredFact => ({
    direction,
    impact,
    confidence,
    relevance,
  });

  test("evenly split evidence scores zero", () => {
    expect(captureScore([fact("for", 2, "A"), fact("against", 2, "A")]).score).toBe(0);
  });

  test("a single weak fact cannot produce an extreme score", () => {
    const result = captureScore([fact("for", 1, "D")]);
    expect(result.balance).toBe(1);
    expect(result.score).toBeCloseTo(2 * (0.25 / 3), 5);
  });

  test("strong one-sided evidence reaches the ±2 bounds and no further", () => {
    expect(captureScore([fact("for", 3, "A"), fact("for", 3, "A")]).score).toBe(2);
    expect(captureScore([fact("against", 3, "A"), fact("against", 3, "B")]).score).toBe(-2);
  });

  test("facts that don't bear on the horizon carry no weight", () => {
    expect(captureScore([fact("for", 3, "A", 0)]).score).toBe(0);
  });
});

import { describe, expect, it } from "vitest";
import { PORTRAIT_LAYERS, PORTRAIT_SIZE } from "./portrait-vector";

const coordinates = (d: string) => (d.match(/-?\d+(\.\d+)?/g) ?? []).map(Number);

describe("generated vector portrait", () => {
  it("has six tonal layers, each a closed path", () => {
    expect(PORTRAIT_LAYERS).toHaveLength(6);
    for (const d of PORTRAIT_LAYERS) expect(d).toMatch(/^M[\s\S]*Z$/);
  });

  it("keeps every point inside the canvas (curve control points may overshoot slightly)", () => {
    const margin = 10; // control points at the frame edge reach a few px out; a wrong scale would be far off
    for (const d of PORTRAIT_LAYERS) {
      for (const value of coordinates(d)) {
        expect(value).toBeGreaterThanOrEqual(-margin);
        expect(value).toBeLessThanOrEqual(PORTRAIT_SIZE + margin);
      }
    }
  });

  it("stays small enough to inline in the home page", () => {
    const bytes = PORTRAIT_LAYERS.reduce((total, d) => total + d.length, 0);
    expect(bytes).toBeLessThan(80_000);
  });
});

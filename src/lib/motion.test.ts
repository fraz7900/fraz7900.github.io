import { describe, expect, test } from "vitest";
import {
  activeSectionIndex,
  approach,
  decodeFrame,
  HEADER_HIDE_AFTER_PX,
  isSettled,
  MAGNET_MAX_PX,
  magneticOffset,
  nextHeaderHidden,
} from "./motion";

describe("cursor ring easing", () => {
  test("moves a fixed fraction of the way to the pointer each frame", () => {
    expect(approach({ x: 0, y: 0 }, { x: 100, y: -50 }, 0.2)).toEqual({ x: 20, y: -10 });
  });

  test("counts as settled once within a tenth of a pixel", () => {
    expect(isSettled({ x: 10.05, y: 5 }, { x: 10, y: 5 })).toBe(true);
    expect(isSettled({ x: 10.5, y: 5 }, { x: 10, y: 5 })).toBe(false);
  });
});

describe("magnetic buttons", () => {
  const button = { left: 100, top: 100, width: 200, height: 40 };

  test("a pointer at the centre leaves the button where it is", () => {
    expect(magneticOffset({ x: 200, y: 120 }, button)).toEqual({ x: 0, y: 0 });
  });

  test("leans a fraction of the pointer's offset toward it", () => {
    expect(magneticOffset({ x: 220, y: 110 }, button)).toEqual({ x: 4, y: -2 });
  });

  test("never leans further than the cap", () => {
    const far = magneticOffset({ x: 300, y: 140 }, button);
    expect(far.x).toBe(MAGNET_MAX_PX);
    expect(far.y).toBe(4);
  });
});

describe("auto-hiding header", () => {
  test("always shows near the top of the page", () => {
    expect(nextHeaderHidden(200, HEADER_HIDE_AFTER_PX - 1, true)).toBe(false);
  });

  test("hides while scrolling down past the threshold", () => {
    expect(nextHeaderHidden(400, 420, false)).toBe(true);
  });

  test("returns on a deliberate scroll up", () => {
    expect(nextHeaderHidden(800, 780, true)).toBe(false);
  });

  test("ignores jitter of a few pixels", () => {
    expect(nextHeaderHidden(800, 802, true)).toBe(true);
    expect(nextHeaderHidden(800, 798, false)).toBe(false);
  });
});

describe("decode text", () => {
  const glyph = () => "#";

  test("scrambles every non-space character at the start", () => {
    expect(decodeFrame("ab c", 0, glyph).map((c) => c.char).join("")).toBe("## #");
  });

  test("resolves left to right", () => {
    const frame = decodeFrame("abcd", 0.4, glyph);
    expect(frame.map((c) => c.scrambled)).toEqual([false, false, true, true]);
  });

  test("ends on the real text", () => {
    expect(decodeFrame("// about", 1, glyph)).toEqual(Array.from("// about").map((char) => ({ char, scrambled: false })));
  });
});

describe("section rail", () => {
  test("highlights the first section before any has reached the line", () => {
    expect(activeSectionIndex([500, 1500, 2500], 1000)).toBe(0);
  });

  test("highlights the last section whose top has passed 40% of the viewport", () => {
    expect(activeSectionIndex([-900, -100, 390, 1200], 1000)).toBe(2);
  });
});

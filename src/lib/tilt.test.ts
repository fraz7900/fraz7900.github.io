import { describe, expect, it } from "vitest";
import {
  HOVER_MAX_DEG,
  DRAG_MAX_DEG,
  KEY_STEP_DEG,
  REST,
  dragTilt,
  inHoverZone,
  isTiltSettled,
  keyTilt,
  pointerTilt,
  stepSpring,
  stepTilt,
  type Spring,
} from "./tilt";

const box = { left: 100, top: 100, width: 200, height: 200 };
const run = (spring: Spring, target: number, seconds: number, dt = 1 / 60) => {
  let s = spring;
  let peak = s.value;
  for (let t = 0; t < seconds; t += dt) {
    s = stepSpring(s, target, dt);
    peak = Math.max(peak, s.value);
  }
  return { s, peak };
};

describe("spring", () => {
  it("settles on its target", () => {
    const { s } = run({ value: 0, velocity: 0 }, 10, 2);
    expect(s.value).toBeCloseTo(10, 2);
    expect(Math.abs(s.velocity)).toBeLessThan(0.05);
  });

  it("overshoots a little, like a physical object, but not much", () => {
    const { peak } = run({ value: 0, velocity: 0 }, 10, 2);
    expect(peak).toBeGreaterThan(10);
    expect(peak).toBeLessThan(11.5);
  });

  it("stays stable when a frame is very late (tab switch)", () => {
    const s = stepSpring({ value: 0, velocity: 0 }, 10, 5);
    expect(Number.isFinite(s.value)).toBe(true);
    expect(Math.abs(s.value)).toBeLessThan(10);
  });

  it("carries a fling's velocity before coming back", () => {
    const { peak, s } = run({ value: 0, velocity: 200 }, 0, 2);
    expect(peak).toBeGreaterThan(5);
    expect(s.value).toBeCloseTo(0, 1);
  });

  it("does not mutate the spring it is given", () => {
    const spring = { value: 0, velocity: 0 };
    stepSpring(spring, 10, 1 / 60);
    expect(spring).toEqual({ value: 0, velocity: 0 });
  });
});

describe("tilt targets", () => {
  it("leans toward the pointer: right turns about Y, up tips back about X", () => {
    expect(pointerTilt({ x: 300, y: 200 }, box)).toEqual({ rx: 0, ry: HOVER_MAX_DEG });
    expect(pointerTilt({ x: 200, y: 100 }, box)).toEqual({ rx: HOVER_MAX_DEG, ry: 0 });
    expect(pointerTilt({ x: 200, y: 200 }, box)).toEqual({ rx: 0, ry: 0 });
  });

  it("caps the hover tilt however far the pointer is", () => {
    const far = pointerTilt({ x: 5000, y: -5000 }, box);
    expect(far.ry).toBe(HOVER_MAX_DEG);
    expect(far.rx).toBe(HOVER_MAX_DEG);
  });

  it("counts the pointer as hovering a little outside the portrait, not across the page", () => {
    expect(inHoverZone({ x: 200, y: 200 }, box)).toBe(true);
    expect(inHoverZone({ x: 330, y: 200 }, box)).toBe(true);
    expect(inHoverZone({ x: 700, y: 200 }, box)).toBe(false);
  });

  it("turns further when dragged, up to a limit", () => {
    const start = { rx: 0, ry: 0 };
    expect(dragTilt(start, { x: 40, y: 0 }, box).ry).toBeGreaterThan(HOVER_MAX_DEG);
    expect(dragTilt(start, { x: 10_000, y: 10_000 }, box)).toEqual({ rx: -DRAG_MAX_DEG, ry: DRAG_MAX_DEG });
  });

  it("nudges with arrow keys and resets with Home or Escape", () => {
    expect(keyTilt(REST, "ArrowRight")).toEqual({ rx: 0, ry: KEY_STEP_DEG });
    expect(keyTilt(REST, "ArrowUp")).toEqual({ rx: KEY_STEP_DEG, ry: 0 });
    expect(keyTilt({ rx: 9, ry: 9 }, "Escape")).toEqual(REST);
    expect(keyTilt({ rx: 9, ry: 9 }, "Home")).toEqual(REST);
    expect(keyTilt(REST, "Enter")).toBeNull();
    let pose = REST;
    for (let i = 0; i < 50; i++) pose = keyTilt(pose, "ArrowLeft") ?? pose;
    expect(pose.ry).toBe(-DRAG_MAX_DEG);
  });
});

describe("tilt state", () => {
  it("moves both axes toward the target and reports when it has settled", () => {
    let state = { rx: { value: 0, velocity: 0 }, ry: { value: 0, velocity: 0 } };
    const target = { rx: 5, ry: -8 };
    expect(isTiltSettled(state, target)).toBe(false);
    for (let i = 0; i < 180; i++) state = stepTilt(state, target, 1 / 60);
    expect(state.rx.value).toBeCloseTo(5, 1);
    expect(state.ry.value).toBeCloseTo(-8, 1);
    expect(isTiltSettled(state, target)).toBe(true);
  });
});

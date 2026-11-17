import { describe, expect, it } from "vitest";
import {
  NEUTRAL_MOTION,
  TILT_X_MAX_DEG,
  TILT_Y_MAX_DEG,
  MOTION_EASE,
  approachMotion,
  easeForElapsed,
  isMotionSettled,
  linkState,
  objectState,
  previewArea,
  sceneMotion,
  stepStage,
  type WorkbenchFocus,
} from "./workbench";

const NONE: WorkbenchFocus = { hovered: null, focused: null, selected: null, lens: null };
const BOX = { left: 100, top: 50, width: 800, height: 600 };

describe("workbench interaction states", () => {
  it("rests every object when nothing is previewed or chosen", () => {
    expect(objectState("consulting", NONE)).toBe("idle");
    expect(linkState("consulting", NONE)).toBe("idle");
  });

  it("prefers the hovered area over the focused one for the preview", () => {
    expect(previewArea({ ...NONE, hovered: "product", focused: "advising" })).toBe("product");
    expect(previewArea({ ...NONE, focused: "advising" })).toBe("advising");
  });

  it("keeps the selection when another area is hovered", () => {
    const focus = { ...NONE, selected: "consulting" as const, hovered: "product" as const };
    expect(objectState("consulting", focus)).toBe("selected");
    expect(objectState("product", focus)).toBe("preview");
    expect(objectState("advising", focus)).toBe("dimmed");
  });

  it("never dims the research notebook, the source of every connection", () => {
    expect(objectState("research", { ...NONE, selected: "public-finance" })).toBe("idle");
  });

  it("highlights the lens area and its connection only while research is chosen", () => {
    const focus = { ...NONE, selected: "research" as const, lens: "advising" as const };
    expect(objectState("advising", focus)).toBe("lens");
    expect(linkState("advising", focus)).toBe("active");
    expect(linkState("product", focus)).toBe("faint");
    expect(objectState("advising", { ...focus, selected: "product" })).toBe("dimmed");
  });
});

describe("sceneMotion", () => {
  it("is neutral with the pointer at the centre", () => {
    expect(sceneMotion({ x: 500, y: 350 }, BOX)).toEqual(NEUTRAL_MOTION);
  });

  it("reaches the tilt limits at the edges and tips toward the pointer", () => {
    expect(sceneMotion({ x: 900, y: 50 }, BOX)).toEqual({ rx: TILT_X_MAX_DEG, ry: TILT_Y_MAX_DEG, px: 1, py: -1 });
  });

  it("clamps a pointer outside the scene", () => {
    expect(sceneMotion({ x: -2000, y: 5000 }, BOX)).toEqual({ rx: -TILT_X_MAX_DEG, ry: -TILT_Y_MAX_DEG, px: -1, py: 1 });
  });

  it("stays neutral for an unmeasured box", () => {
    expect(sceneMotion({ x: 10, y: 10 }, { left: 0, top: 0, width: 0, height: 0 })).toEqual(NEUTRAL_MOTION);
  });

  it("eases toward the target and settles", () => {
    const target = sceneMotion({ x: 900, y: 650 }, BOX);
    let current = NEUTRAL_MOTION;
    const first = approachMotion(current, target);
    expect(first.ry).toBeGreaterThan(0);
    expect(first.ry).toBeLessThan(target.ry);
    for (let frame = 0; frame < 120 && !isMotionSettled(current, target); frame += 1) current = approachMotion(current, target);
    expect(isMotionSettled(current, target)).toBe(true);
  });
});

describe("easeForElapsed", () => {
  it("matches the per-frame ease at 60 Hz and covers more ground on slower frames", () => {
    expect(easeForElapsed(1000 / 60)).toBeCloseTo(MOTION_EASE, 6);
    expect(easeForElapsed(1000 / 15)).toBeGreaterThan(easeForElapsed(1000 / 60));
    expect(easeForElapsed(0)).toBe(0);
  });

  it("caps a long stall so the scene never jumps", () => {
    expect(easeForElapsed(5000)).toBe(easeForElapsed(100));
    expect(easeForElapsed(5000)).toBeLessThan(1);
  });
});

describe("stepStage", () => {
  it("moves in both directions without wrapping", () => {
    expect(stepStage(0, 1, 5)).toBe(1);
    expect(stepStage(4, 1, 5)).toBe(4);
    expect(stepStage(2, -1, 5)).toBe(1);
    expect(stepStage(0, -1, 5)).toBe(0);
    expect(stepStage(3, 1, 0)).toBe(0);
  });
});

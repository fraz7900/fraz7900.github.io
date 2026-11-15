/**
 * Pure helpers behind the 3D portrait's movement (component: src/components/home/PortraitTilt.tsx).
 *
 * Angles are CSS degrees in a "looks at the pointer" convention: positive ry turns the face to the
 * right, positive rx tips it up. Motion runs through a damped spring, so the portrait eases in,
 * overshoots a touch and settles, instead of snapping to the pointer. The idle sway is a CSS
 * animation (globals.css, portrait-sway), so no script runs while nobody is interacting.
 */

import { clamp, type Box, type Point } from "./motion";

export interface Spring {
  readonly value: number;
  readonly velocity: number;
}

export interface Tilt {
  readonly rx: number;
  readonly ry: number;
}

export interface TiltState {
  readonly rx: Spring;
  readonly ry: Spring;
}

export const REST: Tilt = { rx: 0, ry: 0 };

/** Largest tilt from hovering, in degrees. */
export const HOVER_MAX_DEG = 14;
/** Largest tilt from dragging or the arrow keys, in degrees. */
export const DRAG_MAX_DEG = 26;
/** Degrees of turn for dragging across half the portrait. */
const DRAG_GAIN_DEG = 45;
export const KEY_STEP_DEG = 4;
/** The hover zone reaches this multiple of the portrait's half-size from its centre. */
const HOVER_ZONE = 1.35;

/** Spring constants: under-damped (about 7% overshoot) and settled within a second or so. */
const STIFFNESS = 120;
const DAMPING = 14;
/** Longest step the spring integrates at once, so a late frame can't make it jump or blow up. */
const MAX_STEP_S = 1 / 30;
const SETTLE_EPSILON = 0.02;

/** Avoids -0, which reads oddly in CSS and in test output. */
const tidy = (value: number) => value + 0 || 0;

/** One semi-implicit Euler step of a damped spring pulling `spring` toward `target`. */
export function stepSpring(spring: Spring, target: number, dt: number): Spring {
  const step = Math.min(Math.max(dt, 0), MAX_STEP_S);
  const acceleration = -STIFFNESS * (spring.value - target) - DAMPING * spring.velocity;
  const velocity = spring.velocity + acceleration * step;
  return { value: spring.value + velocity * step, velocity };
}

export function stepTilt(state: TiltState, target: Tilt, dt: number): TiltState {
  return { rx: stepSpring(state.rx, target.rx, dt), ry: stepSpring(state.ry, target.ry, dt) };
}

export function isTiltSettled(state: TiltState, target: Tilt): boolean {
  const near = (spring: Spring, goal: number) => Math.abs(spring.value - goal) < SETTLE_EPSILON && Math.abs(spring.velocity) < SETTLE_EPSILON;
  return near(state.rx, target.rx) && near(state.ry, target.ry);
}

const centre = (box: Box): Point => ({ x: box.left + box.width / 2, y: box.top + box.height / 2 });

/** Hover target: turn to face the pointer, in proportion to its offset from the centre, capped. */
export function pointerTilt(pointer: Point, box: Box): Tilt {
  const c = centre(box);
  const nx = clamp((pointer.x - c.x) / (box.width / 2), 1);
  const ny = clamp((pointer.y - c.y) / (box.height / 2), 1);
  return { rx: tidy(-ny * HOVER_MAX_DEG), ry: tidy(nx * HOVER_MAX_DEG) };
}

/** Whether the pointer is over the portrait or just around it (not anywhere on the page). */
export function inHoverZone(pointer: Point, box: Box): boolean {
  const c = centre(box);
  return Math.abs(pointer.x - c.x) <= (box.width / 2) * HOVER_ZONE && Math.abs(pointer.y - c.y) <= (box.height / 2) * HOVER_ZONE;
}

/** Drag target: like grabbing the front of the portrait and turning it; dragging right turns it right. */
export function dragTilt(start: Tilt, delta: Point, box: Box): Tilt {
  return {
    rx: tidy(clamp(start.rx - (delta.y / (box.height / 2)) * DRAG_GAIN_DEG, DRAG_MAX_DEG)),
    ry: tidy(clamp(start.ry + (delta.x / (box.width / 2)) * DRAG_GAIN_DEG, DRAG_MAX_DEG)),
  };
}

const KEY_NUDGE: Readonly<Record<string, Tilt>> = {
  ArrowRight: { rx: 0, ry: KEY_STEP_DEG },
  ArrowLeft: { rx: 0, ry: -KEY_STEP_DEG },
  ArrowUp: { rx: KEY_STEP_DEG, ry: 0 },
  ArrowDown: { rx: -KEY_STEP_DEG, ry: 0 },
};

/** Keyboard target: arrows nudge from the current pose, Home or Escape return to rest; other keys aren't ours (null). */
export function keyTilt(current: Tilt, key: string): Tilt | null {
  if (key === "Home" || key === "Escape") return REST;
  const nudge = KEY_NUDGE[key];
  if (!nudge) return null;
  return { rx: tidy(clamp(current.rx + nudge.rx, DRAG_MAX_DEG)), ry: tidy(clamp(current.ry + nudge.ry, DRAG_MAX_DEG)) };
}

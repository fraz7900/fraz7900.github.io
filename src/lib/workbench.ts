/**
 * Pure logic behind the About page's Decision Workbench (components: src/components/about/workbench/).
 *
 * Interaction model: hover and keyboard focus are previews; a click, Enter or Space selects. A
 * preview never replaces the selection, so the detail panel only changes on a deliberate choice.
 * Pointer movement drives a small tilt and parallax through CSS variables, never React state.
 */

import type { AreaId, PracticeAreaId } from "@/content/workbench";
import { clamp, lerp, type Box, type Point } from "./motion";

/** idle: resting; preview: hovered or focused; selected: chosen; lens: highlighted from the research panel; dimmed: something else is chosen. */
export type ObjectState = "idle" | "preview" | "selected" | "lens" | "dimmed";
/** A connection from the notebook: active when its area is previewed, chosen or highlighted; faint when research itself is in view. */
export type LinkState = "idle" | "faint" | "active";

export interface WorkbenchFocus {
  readonly hovered: AreaId | null;
  readonly focused: AreaId | null;
  readonly selected: AreaId | null;
  /** The practice area chosen in the research panel's "how research informs" control. */
  readonly lens: PracticeAreaId | null;
}

export const AREA_IDS: readonly AreaId[] = ["research", "product", "consulting", "public-finance", "advising"];
export const PRACTICE_IDS: readonly PracticeAreaId[] = ["product", "consulting", "public-finance", "advising"];

/** The area being previewed: the pointer wins over keyboard focus, as it's the more recent intent. */
export const previewArea = (focus: WorkbenchFocus): AreaId | null => focus.hovered ?? focus.focused;

export function objectState(area: AreaId, focus: WorkbenchFocus): ObjectState {
  if (area === focus.selected) return "selected";
  if (area === previewArea(focus)) return "preview";
  if (focus.selected === "research" && area === focus.lens) return "lens";
  // The notebook is the source of every connection, so it never fades.
  if (focus.selected !== null && area !== "research") return "dimmed";
  return "idle";
}

export function linkState(area: PracticeAreaId, focus: WorkbenchFocus): LinkState {
  const state = objectState(area, focus);
  if (state === "selected" || state === "preview" || state === "lens") return "active";
  const researchInView = focus.selected === "research" || previewArea(focus) === "research";
  return researchInView ? "faint" : "idle";
}

// ---------- Pointer tilt and parallax ----------

/** Largest scene tilt, in degrees: deliberately small, so targets never drift far from the pointer. */
export const TILT_X_MAX_DEG = 3;
export const TILT_Y_MAX_DEG = 4;
/** Fraction of the remaining distance covered per 60 Hz frame: settles in about half a second. */
export const MOTION_EASE = 0.14;
const FRAME_MS = 1000 / 60;
/** Longest gap one step accounts for, so a stalled tab doesn't snap on its next frame. */
const MAX_STEP_MS = 100;
const SETTLE_EPSILON = 0.002;

/** Tilt in degrees (rx, ry) and parallax offsets normalised to -1…1 (px, py). */
export interface SceneMotion {
  readonly rx: number;
  readonly ry: number;
  readonly px: number;
  readonly py: number;
}

export const NEUTRAL_MOTION: SceneMotion = { rx: 0, ry: 0, px: 0, py: 0 };

/** Avoids -0, which reads oddly in CSS and in test output. */
const tidy = (value: number) => value + 0 || 0;

/** Normalises the pointer within the scene (-1…1 from the centre, clamped) and maps it to tilt and parallax. */
export function sceneMotion(pointer: Point, box: Box): SceneMotion {
  if (box.width <= 0 || box.height <= 0) return NEUTRAL_MOTION;
  const nx = clamp((pointer.x - (box.left + box.width / 2)) / (box.width / 2), 1);
  const ny = clamp((pointer.y - (box.top + box.height / 2)) / (box.height / 2), 1);
  return { rx: tidy(-ny * TILT_X_MAX_DEG), ry: tidy(nx * TILT_Y_MAX_DEG), px: tidy(nx), py: tidy(ny) };
}

export function approachMotion(current: SceneMotion, target: SceneMotion, ease = MOTION_EASE): SceneMotion {
  return {
    rx: lerp(current.rx, target.rx, ease),
    ry: lerp(current.ry, target.ry, ease),
    px: lerp(current.px, target.px, ease),
    py: lerp(current.py, target.py, ease),
  };
}

/** The easing for `elapsedMs` since the last frame, so the motion takes the same time at any frame rate. */
export function easeForElapsed(elapsedMs: number): number {
  const frames = Math.min(Math.max(elapsedMs, 0), MAX_STEP_MS) / FRAME_MS;
  return 1 - (1 - MOTION_EASE) ** frames;
}

export function isMotionSettled(current: SceneMotion, target: SceneMotion, epsilon = SETTLE_EPSILON): boolean {
  return (
    Math.abs(current.rx - target.rx) < epsilon * TILT_X_MAX_DEG &&
    Math.abs(current.ry - target.ry) < epsilon * TILT_Y_MAX_DEG &&
    Math.abs(current.px - target.px) < epsilon &&
    Math.abs(current.py - target.py) < epsilon
  );
}

// ---------- Research stages ----------

/** Moves through the research stages without wrapping, so "previous" at the start stays put. */
export function stepStage(current: number, delta: number, count: number): number {
  if (count <= 0) return 0;
  return Math.min(Math.max(current + delta, 0), count - 1);
}

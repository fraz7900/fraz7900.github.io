/** Pure helpers behind the pointer and scroll effects (components in src/components/motion). */

export interface Point {
  readonly x: number;
  readonly y: number;
}

export interface Box {
  readonly left: number;
  readonly top: number;
  readonly width: number;
  readonly height: number;
}

export const lerp = (from: number, to: number, t: number) => from + (to - from) * t;

/** Moves `current` a fraction of the way toward `target`; used for the cursor ring's lag. */
export function approach(current: Point, target: Point, ease: number): Point {
  return { x: lerp(current.x, target.x, ease), y: lerp(current.y, target.y, ease) };
}

export const isSettled = (a: Point, b: Point, epsilon = 0.1) => Math.abs(a.x - b.x) < epsilon && Math.abs(a.y - b.y) < epsilon;

const clamp = (value: number, limit: number) => Math.max(-limit, Math.min(limit, value));

export const MAGNET_STRENGTH = 0.2;
export const MAGNET_MAX_PX = 8;

/**
 * How far a magnetic button leans toward the pointer: a fraction of the pointer's distance from
 * the button's resting centre, capped so the button never slides out from under the pointer.
 */
export function magneticOffset(pointer: Point, rest: Box, strength = MAGNET_STRENGTH, maxPx = MAGNET_MAX_PX): Point {
  const dx = pointer.x - (rest.left + rest.width / 2);
  const dy = pointer.y - (rest.top + rest.height / 2);
  return { x: clamp(dx * strength, maxPx), y: clamp(dy * strength, maxPx) };
}

export const HEADER_HIDE_AFTER_PX = 320;
export const HEADER_SCROLL_TOLERANCE_PX = 4;

/** Header hides while scrolling down past the threshold and returns on any deliberate scroll up. */
export function nextHeaderHidden(previousY: number, y: number, hidden: boolean): boolean {
  if (y < HEADER_HIDE_AFTER_PX) return false;
  if (y > previousY + HEADER_SCROLL_TOLERANCE_PX) return true;
  if (y < previousY - HEADER_SCROLL_TOLERANCE_PX) return false;
  return hidden;
}

export const DECODE_GLYPHS = "!<>-_/[]{}=+*^?#01";

export interface DecodeChar {
  readonly char: string;
  readonly scrambled: boolean;
}

/**
 * One frame of the decode effect at `progress` (0…1): characters resolve left to right, spaces
 * never scramble, and every character is resolved by the end.
 */
export function decodeFrame(text: string, progress: number, glyphAt: (index: number) => string): DecodeChar[] {
  const chars = Array.from(text);
  return chars.map((char, index) => {
    const revealAt = (index / chars.length) * 0.75 + 0.1;
    const resolved = char.trim() === "" || progress >= 1 || progress >= revealAt;
    return resolved ? { char, scrambled: false } : { char: glyphAt(index), scrambled: true };
  });
}

/** Index of the section whose top has passed `ratio` of the viewport height; 0 before any has. */
export function activeSectionIndex(sectionTops: readonly number[], viewportHeight: number, ratio = 0.4): number {
  const line = viewportHeight * ratio;
  const passed = sectionTops.reduce((active, top, index) => (top <= line ? index : active), -1);
  return Math.max(0, passed);
}

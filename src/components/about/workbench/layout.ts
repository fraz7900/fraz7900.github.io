/**
 * Where each object sits on the bench, for the wide scene (tablet and up) and the tall phone
 * scene. Coordinates are SVG user units in each scene's viewBox. The HTML buttons laid over the
 * wide scene use the same numbers as percentages, so labels and targets stay on their objects.
 */

import type { AreaId, PracticeAreaId } from "@/content/workbench";

export interface Placement {
  readonly x: number;
  readonly y: number;
  readonly scale: number;
}

export interface Mat {
  readonly top: number;
  readonly bottom: number;
  readonly topLeft: number;
  readonly topRight: number;
  readonly bottomLeft: number;
  readonly bottomRight: number;
  readonly edge: number;
}

export interface SceneLayout {
  readonly width: number;
  readonly height: number;
  readonly mat: Mat;
  readonly place: Readonly<Record<AreaId, Placement>>;
  /** Cubic path from the notebook's edge to each object (drawn beneath the objects). */
  readonly links: Readonly<Record<PracticeAreaId, string>>;
  /** Number markers, matching the numbered selectors under the phone scene. */
  readonly markers?: Readonly<Record<AreaId, { readonly x: number; readonly y: number }>>;
}

/** A button's target area over the wide scene, in viewBox units; `chip` is where its label sits. */
export interface HitRegion {
  readonly x: number;
  readonly y: number;
  readonly w: number;
  readonly h: number;
  readonly chip: "top" | "bottom";
}

export const WIDE: SceneLayout = {
  width: 960,
  height: 760,
  mat: { top: 104, bottom: 690, topLeft: 120, topRight: 840, bottomLeft: 16, bottomRight: 944, edge: 16 },
  place: {
    research: { x: 480, y: 412, scale: 1 },
    product: { x: 262, y: 220, scale: 0.84 },
    consulting: { x: 700, y: 220, scale: 0.84 },
    "public-finance": { x: 240, y: 596, scale: 0.9 },
    advising: { x: 722, y: 600, scale: 0.9 },
  },
  links: {
    product: "M 256 372 C 206 366 186 326 200 284",
    consulting: "M 704 372 C 754 366 774 326 760 284",
    "public-finance": "M 256 452 C 206 458 186 494 196 532",
    advising: "M 704 452 C 754 458 778 494 770 536",
  },
};

export const WIDE_REGIONS: Readonly<Record<AreaId, HitRegion>> = {
  research: { x: 262, y: 270, w: 436, h: 242, chip: "top" },
  product: { x: 100, y: 106, w: 318, h: 162, chip: "top" },
  consulting: { x: 542, y: 106, w: 318, h: 162, chip: "top" },
  "public-finance": { x: 46, y: 520, w: 372, h: 232, chip: "bottom" },
  advising: { x: 552, y: 520, w: 352, h: 232, chip: "bottom" },
};

export const TALL: SceneLayout = {
  width: 600,
  height: 740,
  mat: { top: 66, bottom: 690, topLeft: 40, topRight: 560, bottomLeft: 6, bottomRight: 594, edge: 14 },
  place: {
    research: { x: 300, y: 392, scale: 0.84 },
    product: { x: 162, y: 186, scale: 0.64 },
    consulting: { x: 438, y: 186, scale: 0.64 },
    "public-finance": { x: 162, y: 594, scale: 0.62 },
    advising: { x: 440, y: 598, scale: 0.66 },
  },
  links: {
    product: "M 120 350 C 92 330 96 290 116 254",
    consulting: "M 480 350 C 508 330 504 290 484 254",
    "public-finance": "M 120 440 C 92 462 96 500 114 534",
    advising: "M 480 440 C 508 462 506 500 488 540",
  },
  markers: {
    research: { x: 300, y: 292 },
    product: { x: 34, y: 112 },
    consulting: { x: 566, y: 112 },
    "public-finance": { x: 34, y: 520 },
    advising: { x: 566, y: 520 },
  },
};

const percent = (value: number, total: number) => `${((value / total) * 100).toFixed(3)}%`;

/** CSS position for a button over the wide scene. */
export function regionStyle(region: HitRegion): Record<string, string> {
  return {
    "--wb-x": percent(region.x, WIDE.width),
    "--wb-y": percent(region.y, WIDE.height),
    "--wb-w": percent(region.w, WIDE.width),
    "--wb-h": percent(region.h, WIDE.height),
  };
}

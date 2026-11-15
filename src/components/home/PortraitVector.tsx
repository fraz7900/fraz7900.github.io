import type { CSSProperties } from "react";
import { PORTRAIT_LAYERS, PORTRAIT_SIZE } from "@/content/portrait-vector";
import { SITE } from "@/content/site";
import { PortraitMotion } from "./PortraitMotion";

/** Tone ramp for the traced layers, darkest first: navy shadows through blue and teal to near-white. */
const TONES = ["#0f1e33", "#1a3a63", "#2b6aa0", "#2fa7b4", "#5fe0c8", "#e9f6f4"] as const;

/**
 * Out-of-focus lights behind the figure, placed roughly where the city lights sit in the original
 * photo. Each drifts slowly by (dx, dy) over `dur` seconds.
 */
const LIGHTS = [
  { cx: 120, cy: 95, r: 62, color: "var(--color-amber)", opacity: 0.55, dx: 10, dy: 6, dur: 14 },
  { cx: 210, cy: 30, r: 26, color: "var(--color-sky)", opacity: 0.45, dx: -8, dy: 8, dur: 11 },
  { cx: 55, cy: 285, r: 34, color: "var(--color-accent)", opacity: 0.45, dx: 8, dy: -10, dur: 13 },
  { cx: 75, cy: 405, r: 28, color: "var(--color-danger)", opacity: 0.35, dx: 6, dy: -6, dur: 16 },
  { cx: 430, cy: 120, r: 30, color: "var(--color-sky)", opacity: 0.4, dx: -10, dy: 6, dur: 12 },
  { cx: 405, cy: 245, r: 18, color: "var(--color-accent)", opacity: 0.55, dx: 6, dy: 8, dur: 10 },
  { cx: 455, cy: 300, r: 44, color: "var(--color-amber)", opacity: 0.5, dx: -8, dy: -8, dur: 15 },
] as const;

type Vars = CSSProperties & Record<`--${string}`, string | number>;

/** The headshot as a layered vector: tones build up on load, lights drift, and both follow the pointer. */
export function PortraitVector() {
  return (
    <PortraitMotion>
      <svg viewBox={`0 0 ${PORTRAIT_SIZE} ${PORTRAIT_SIZE}`} role="img" aria-labelledby="portrait-title" className="size-full">
        <title id="portrait-title">{`Portrait of ${SITE.name}, drawn as a layered vector from a photograph`}</title>
        <defs>
          <filter id="portrait-glow" x="-60%" y="-60%" width="220%" height="220%">
            <feGaussianBlur stdDeviation="12" />
          </filter>
        </defs>
        <g className="portrait-lights" filter="url(#portrait-glow)">
          {LIGHTS.map((light) => (
            <circle
              key={`${light.cx}-${light.cy}`}
              className="portrait-light"
              cx={light.cx}
              cy={light.cy}
              r={light.r}
              fill={light.color}
              style={{ "--o": light.opacity, "--dx": `${light.dx}px`, "--dy": `${light.dy}px`, "--dur": `${light.dur}s` } as Vars}
            />
          ))}
        </g>
        <g className="portrait-figure">
          {PORTRAIT_LAYERS.map((d, index) => (
            <path
              key={index}
              className="portrait-tone"
              d={d}
              fill={TONES[Math.min(index, TONES.length - 1)]}
              fillRule="evenodd"
              style={{ "--i": index } as Vars}
            />
          ))}
        </g>
      </svg>
    </PortraitMotion>
  );
}

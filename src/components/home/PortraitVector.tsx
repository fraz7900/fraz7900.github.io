import { useId, type CSSProperties } from "react";
import { PORTRAIT_LAYERS, PORTRAIT_SIZE } from "@/content/portrait-vector";
import { SITE } from "@/content/site";
import { PortraitTilt } from "./PortraitTilt";

/** Tone ramp for the traced layers, darkest first: navy shadows through blue and teal to near-white. */
const TONES = ["#0f1e33", "#1a3a63", "#2b6aa0", "#2fa7b4", "#5fe0c8", "#e9f6f4"] as const;

/** Distance from the viewer to the portrait, in px (CSS perspective). */
const PERSPECTIVE_PX = 900;

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

/**
 * The headshot as one rigid 3D medallion: the gradient ring, then a single picture (drifting city
 * lights and the six traced tones, drawn flat together so no feature moves on its own), and a soft
 * highlight. PortraitTilt turns the whole piece; the highlight and shadow follow the turn.
 */
export function PortraitVector() {
  const glowId = useId();
  return (
    <PortraitTilt
      perspective={PERSPECTIVE_PX}
      label={`Portrait of ${SITE.name}, drawn as a vector from a photograph`}
      hint="Interactive: it turns toward your pointer. Drag it, or use the arrow keys, to turn it further; Escape resets it."
    >
      <div aria-hidden="true" className="portrait-ring absolute inset-0 rounded-full">
        <svg viewBox={`0 0 ${PORTRAIT_SIZE} ${PORTRAIT_SIZE}`} focusable="false" className="size-full rounded-full">
          <defs>
            <filter id={glowId} x="-60%" y="-60%" width="220%" height="220%">
              <feGaussianBlur stdDeviation="12" />
            </filter>
          </defs>
          {/* The dark ground the lights blend against. */}
          <rect width={PORTRAIT_SIZE} height={PORTRAIT_SIZE} fill="var(--color-card)" />
          <g className="portrait-lights" filter={`url(#${glowId})`}>
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
          {PORTRAIT_LAYERS.map((d, index) => (
            <path
              key={index}
              className={`portrait-tone${index === 0 ? " portrait-silhouette" : ""}`}
              d={d}
              fill={TONES[Math.min(index, TONES.length - 1)]}
              fillRule="evenodd"
              style={{ "--i": index } as Vars}
            />
          ))}
        </svg>
        <div className="portrait-glare absolute inset-[3px] rounded-full" />
      </div>
    </PortraitTilt>
  );
}

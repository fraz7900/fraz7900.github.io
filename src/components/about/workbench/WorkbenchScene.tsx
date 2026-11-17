import { memo, useId, useMemo } from "react";
import { WORKBENCH_AREAS, type AreaId, type PracticeAreaId } from "@/content/workbench";
import { lerp } from "@/lib/motion";
import { PRACTICE_IDS, type LinkState, type ObjectState } from "@/lib/workbench";
import { ART, OBJECT_ART, type ArtIds, type ArtPart } from "./art";
import { TALL, WIDE, type Mat, type SceneLayout } from "./layout";

/** Back to front, so nearer objects overlap farther ones. */
const DRAW_ORDER: readonly AreaId[] = ["product", "consulting", "research", "public-finance", "advising"];
/** The same numbers as the selectors under the phone scene. */
const MARKER_NUMBERS = Object.fromEntries(WORKBENCH_AREAS.map((area) => [area.id, String(Number(area.index))])) as Readonly<Record<AreaId, string>>;

/** Gradient IDs unique to one SVG, safe inside url(#…). */
function useArtIds(): ArtIds {
  const raw = useId().replace(/[^a-zA-Z0-9_-]/g, "");
  return useMemo(
    () => ({
      mat: `${raw}-mat`,
      glow: `${raw}-glow`,
      shadow: `${raw}-shadow`,
      pageL: `${raw}-page-l`,
      pageR: `${raw}-page-r`,
      spine: `${raw}-spine`,
    }),
    [raw],
  );
}

function Defs({ ids }: { ids: ArtIds }) {
  return (
    <defs>
      <linearGradient id={ids.mat} x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#0b1626" />
        <stop offset="1" stopColor="#10203a" />
      </linearGradient>
      <radialGradient id={ids.glow}>
        <stop offset="0" stopColor={ART.teal} stopOpacity="0.26" />
        <stop offset="0.6" stopColor={ART.teal} stopOpacity="0.08" />
        <stop offset="1" stopColor={ART.teal} stopOpacity="0" />
      </radialGradient>
      <radialGradient id={ids.shadow}>
        <stop offset="0" stopColor="#000" stopOpacity="0.55" />
        <stop offset="0.55" stopColor="#000" stopOpacity="0.3" />
        <stop offset="1" stopColor="#000" stopOpacity="0" />
      </radialGradient>
      <linearGradient id={ids.pageL} x1="0" y1="0" x2="1" y2="0.3">
        <stop offset="0" stopColor="#dbe4ed" />
        <stop offset="0.8" stopColor="#c4d0dd" />
        <stop offset="1" stopColor="#a3b3c5" />
      </linearGradient>
      <linearGradient id={ids.pageR} x1="1" y1="0" x2="0" y2="0.3">
        <stop offset="0" stopColor="#d3dde8" />
        <stop offset="0.8" stopColor="#bfcbd9" />
        <stop offset="1" stopColor="#9fb0c2" />
      </linearGradient>
      <linearGradient id={ids.spine} x1="0" y1="0" x2="1" y2="0">
        <stop offset="0" stopColor="#0a1423" stopOpacity="0" />
        <stop offset="0.5" stopColor="#0a1423" stopOpacity="0.4" />
        <stop offset="1" stopColor="#0a1423" stopOpacity="0" />
      </linearGradient>
    </defs>
  );
}

/** The work surface: a mat seen in perspective, with a converging grid and a lit centre. */
function MatArt({ mat, ids, glowAt }: { mat: Mat; ids: ArtIds; glowAt: { x: number; y: number } }) {
  const { top, bottom, topLeft, topRight, bottomLeft, bottomRight, edge } = mat;
  const columns = Array.from({ length: 11 }, (_, i) => (i + 1) / 12);
  const rows = Array.from({ length: 8 }, (_, i) => ((i + 1) / 9) ** 1.35);
  const width = bottomRight - bottomLeft;
  return (
    <g>
      <ellipse cx={(bottomLeft + bottomRight) / 2} cy={bottom + edge} rx={width * 0.52} ry={30} fill={`url(#${ids.shadow})`} />
      <path d={`M ${bottomLeft} ${bottom} L ${bottomRight} ${bottom} L ${bottomRight - 2} ${bottom + edge} L ${bottomLeft + 2} ${bottom + edge} Z`} fill="#050b15" />
      <path
        d={`M ${topLeft} ${top} L ${topRight} ${top} L ${bottomRight} ${bottom} L ${bottomLeft} ${bottom} Z`}
        fill={`url(#${ids.mat})`}
        stroke="#1f2d42"
        strokeWidth={1.5}
        strokeLinejoin="round"
      />
      <g stroke={ART.teal} strokeOpacity={0.07} strokeWidth={1}>
        {columns.map((t) => (
          <line key={t} x1={lerp(topLeft, topRight, t)} y1={top} x2={lerp(bottomLeft, bottomRight, t)} y2={bottom} />
        ))}
        {rows.map((s) => (
          <line key={s} x1={lerp(topLeft, bottomLeft, s)} x2={lerp(topRight, bottomRight, s)} y1={lerp(top, bottom, s)} y2={lerp(top, bottom, s)} />
        ))}
      </g>
      <ellipse cx={glowAt.x} cy={glowAt.y} rx={width * 0.36} ry={(bottom - top) * 0.42} fill={`url(#${ids.glow})`} />
      <line x1={bottomLeft + 4} x2={bottomRight - 4} y1={bottom} y2={bottom} stroke={ART.teal} strokeOpacity={0.22} strokeWidth={1.2} />
    </g>
  );
}

const endpoints = (d: string) => {
  const numbers = (d.match(/-?\d+(?:\.\d+)?/g) ?? []).map(Number);
  return { start: numbers.slice(0, 2), end: numbers.slice(-2) };
};

function Links({ layout, linkStates }: { layout: SceneLayout; linkStates: Readonly<Record<PracticeAreaId, LinkState>> }) {
  return (
    <g>
      {PRACTICE_IDS.map((id) => {
        const d = layout.links[id];
        const { start, end } = endpoints(d);
        return (
          <g key={id} className="wb-link" data-area={id} data-state={linkStates[id]}>
            <path d={d} className="wb-link-glow" />
            <path d={d} className="wb-link-base" />
            <path d={d} className="wb-link-active" pathLength={1} />
            <circle className="wb-link-node" cx={start[0]} cy={start[1]} r={4} />
            <circle className="wb-link-node" cx={end[0]} cy={end[1]} r={4} />
          </g>
        );
      })}
    </g>
  );
}

const ObjectArt = memo(function ObjectArt({ id, part, ids }: { id: AreaId; part: ArtPart; ids: ArtIds }) {
  const Art = OBJECT_ART[id];
  return <Art part={part} ids={ids} />;
});

function Objects({ layout, ids, part, states }: { layout: SceneLayout; ids: ArtIds; part: ArtPart; states: Readonly<Record<AreaId, ObjectState>> }) {
  return (
    <g>
      {DRAW_ORDER.map((id) => {
        const { x, y, scale } = layout.place[id];
        return (
          <g key={id} className={part === "shadow" ? "wb-shadow" : "wb-object"} data-area={id} data-state={states[id]} transform={`translate(${x} ${y}) scale(${scale})`}>
            {part === "body" ? (
              <g className="wb-body">
                <ObjectArt id={id} part="body" ids={ids} />
              </g>
            ) : (
              <ObjectArt id={id} part="shadow" ids={ids} />
            )}
          </g>
        );
      })}
    </g>
  );
}

function Markers({ layout }: { layout: SceneLayout }) {
  if (!layout.markers) return null;
  return (
    <g className="wb-markers">
      {DRAW_ORDER.map((id) => {
        const { x, y } = layout.markers![id];
        return (
          <g key={id} data-area={id} transform={`translate(${x} ${y})`}>
            <circle r={17} fill="#0c1524" stroke={ART.teal} strokeOpacity={0.75} strokeWidth={1.6} />
            <text textAnchor="middle" dominantBaseline="central" fill="#e6edf5" fontSize={17} className="font-mono">
              {MARKER_NUMBERS[id]}
            </text>
          </g>
        );
      })}
    </g>
  );
}

interface SceneProps {
  readonly states: Readonly<Record<AreaId, ObjectState>>;
  readonly linkStates: Readonly<Record<PracticeAreaId, LinkState>>;
}

const viewBox = (layout: SceneLayout) => `0 0 ${layout.width} ${layout.height}`;

/**
 * The illustration, twice: a wide composition from tablet width up (desk and objects on separate
 * layers, so they can drift apart a few pixels for parallax) and a taller one for phones, with
 * numbers that match the selectors beneath it. Both are decorative: aria-hidden and inert.
 */
export const WorkbenchScene = memo(function WorkbenchScene({ states, linkStates }: SceneProps) {
  const backIds = useArtIds();
  const frontIds = useArtIds();
  const tallIds = useArtIds();
  const svgProps = { "aria-hidden": true, focusable: false, className: "absolute inset-0 size-full overflow-visible" } as const;
  return (
    <>
      <div className="wb-canvas relative hidden md:block" style={{ aspectRatio: `${WIDE.width} / ${WIDE.height}` }}>
        <div className="wb-depth-back absolute inset-0">
          <svg {...svgProps} viewBox={viewBox(WIDE)}>
            <Defs ids={backIds} />
            <MatArt mat={WIDE.mat} ids={backIds} glowAt={WIDE.place.research} />
          </svg>
        </div>
        <div className="wb-depth-front absolute inset-0">
          <svg {...svgProps} viewBox={viewBox(WIDE)}>
            <Defs ids={frontIds} />
            <Objects layout={WIDE} ids={frontIds} part="shadow" states={states} />
            <Links layout={WIDE} linkStates={linkStates} />
            <Objects layout={WIDE} ids={frontIds} part="body" states={states} />
          </svg>
        </div>
      </div>
      <div className="wb-canvas wb-canvas-tall relative md:hidden" style={{ aspectRatio: `${TALL.width} / ${TALL.height}` }}>
        <svg {...svgProps} viewBox={viewBox(TALL)}>
          <Defs ids={tallIds} />
          <MatArt mat={TALL.mat} ids={tallIds} glowAt={TALL.place.research} />
          <Objects layout={TALL} ids={tallIds} part="shadow" states={states} />
          <Links layout={TALL} linkStates={linkStates} />
          <Objects layout={TALL} ids={tallIds} part="body" states={states} />
          <Markers layout={TALL} />
        </svg>
      </div>
    </>
  );
});

/**
 * Artwork for the Decision Workbench: five objects lying on one work surface.
 *
 * Each object is drawn top-down around its own origin and then squashed vertically (SQUASH), which
 * is how a flat surface looks from about 38° above: every object shares the same viewpoint and
 * light (from the upper left, so shadows fall to the lower right). Thickness is the same outline
 * drawn again a few units lower in a darker tone. Objects render in two passes: shadows first
 * (beneath the connections), bodies last, so a lifted body never drags its shadow with it.
 * Nothing here is interactive; the controls are HTML buttons laid over the scene.
 */

import type { ReactNode } from "react";

export const SQUASH = 0.62;

export const ART = {
  paper: "#192842",
  paperHi: "#20314e",
  side: "#070e1a",
  edge: "#2c3f5b",
  ink: "#9aa8ba",
  inkDim: "#5f7089",
  teal: "#36d1bb",
  sky: "#6cb6ff",
  amber: "#f2b45a",
  nbInk: "#34465f",
  nbTeal: "#1d8a7b",
} as const;

export interface ArtIds {
  readonly mat: string;
  readonly glow: string;
  readonly shadow: string;
  readonly pageL: string;
  readonly pageR: string;
  readonly spine: string;
}

export type ArtPart = "shadow" | "body";

interface SheetSpec {
  readonly x: number;
  readonly y: number;
  readonly w: number;
  readonly h: number;
  readonly r?: number;
  readonly rot?: number;
  /** Thickness in screen units. */
  readonly depth?: number;
  readonly fill: string;
  readonly stroke?: string;
  readonly side?: string;
  readonly content?: ReactNode;
}

const plane = `scale(1 ${SQUASH})`;
const at = (x: number, y: number, rot = 0) => `translate(${x} ${y}) rotate(${rot})`;

function Sheet({ x, y, w, h, r = 3, rot = 0, depth = 2, fill, stroke = ART.edge, side = ART.side, content }: SheetSpec) {
  const box = { x: -w / 2, y: -h / 2, width: w, height: h, rx: r };
  return (
    <>
      {depth > 0 && <rect {...box} fill={side} transform={at(x, y + depth / SQUASH, rot)} />}
      <g transform={at(x, y, rot)}>
        <rect {...box} fill={fill} stroke={stroke} strokeWidth={1.4} />
        {content}
      </g>
    </>
  );
}

/** A soft cast shadow (radial falloff) plus a tight contact shadow for each sheet. */
function SheetShadows({ sheets, ids }: { sheets: readonly SheetSpec[]; ids: ArtIds }) {
  return (
    <g transform={plane}>
      {sheets.map(({ x, y, w, h, r = 3, rot = 0, depth = 2 }, index) => {
        const spread = 12 + depth * 1.6;
        return (
          <g key={index}>
            <rect
              x={-w / 2 - spread}
              y={-h / 2 - spread}
              width={w + spread * 2}
              height={h + spread * 2}
              rx={r + spread}
              fill={`url(#${ids.shadow})`}
              transform={at(x + 6 + depth, y + 12 + depth * 2.4, rot)}
            />
            <rect x={-w / 2} y={-h / 2} width={w} height={h} rx={r} fill="#000" opacity={0.32} transform={at(x + 2, y + 4 + depth / SQUASH, rot)} />
          </g>
        );
      })}
    </g>
  );
}

interface ObjectArtProps {
  readonly part: ArtPart;
  readonly ids: ArtIds;
}

/** Shared frame: a teal pool of light (shown when active) and shadows, or the object itself. */
function ObjectParts({
  part,
  ids,
  sheets,
  halo,
  decor,
  float,
  floatShadow,
}: ObjectArtProps & {
  sheets: readonly SheetSpec[];
  halo: { rx: number; ry: number; cx?: number; cy?: number };
  decor?: ReactNode;
  float?: ReactNode;
  floatShadow?: ReactNode;
}) {
  if (part === "shadow") {
    return (
      <>
        <ellipse className="wb-halo" cx={halo.cx ?? 0} cy={halo.cy ?? 0} rx={halo.rx} ry={halo.ry} fill={`url(#${ids.glow})`} />
        <g className="wb-cast">
          <SheetShadows sheets={sheets} ids={ids} />
          {floatShadow}
        </g>
      </>
    );
  }
  return (
    <>
      <g transform={plane}>
        {sheets.map((sheet, index) => (
          <Sheet key={index} {...sheet} />
        ))}
        {decor}
      </g>
      {float}
    </>
  );
}

const line = (x1: number, x2: number, y: number, stroke: string = ART.inkDim, width = 2.6) => (
  <line x1={x1} x2={x2} y1={y} y2={y} stroke={stroke} strokeWidth={width} strokeLinecap="round" />
);

// ---------- Product management: product sketch, workflow cards, release checklist ----------

const FLOW_GLYPHS: readonly ReactNode[] = [
  // Problem framing: a magnifier.
  <g key="frame" fill="none" stroke={ART.amber} strokeWidth={2.2} strokeLinecap="round">
    <circle cx={-3} cy={4} r={7} />
    <line x1={2} y1={9} x2={9} y2={15} />
  </g>,
  // Prioritisation: ranked bars.
  <g key="rank" stroke={ART.sky} strokeWidth={3} strokeLinecap="round">
    <line x1={-14} x2={14} y1={-1} y2={-1} />
    <line x1={-14} x2={6} y1={6} y2={6} />
    <line x1={-14} x2={-2} y1={13} y2={13} />
  </g>,
  // Evaluation: a gauge.
  <g key="gauge" fill="none" stroke={ART.teal} strokeWidth={2.2} strokeLinecap="round">
    <path d="M -12 13 A 12 12 0 0 1 12 13" />
    <line x1={0} y1={13} x2={6} y2={2} />
  </g>,
  // Rollout: a flag.
  <g key="flag" strokeLinecap="round">
    <line x1={-8} y1={15} x2={-8} y2={-9} stroke={ART.ink} strokeWidth={2.2} />
    <path d="M -8 -9 L 11 -3 L -8 3 Z" fill={ART.ink} opacity={0.7} />
  </g>,
];

const FLOW_STRIPES = [ART.amber, ART.sky, ART.teal, ART.ink] as const;

const PRODUCT_SHEETS: readonly SheetSpec[] = [
  {
    x: -40,
    y: -30,
    w: 210,
    h: 150,
    rot: -5,
    fill: ART.paper,
    content: (
      <g fill="none" stroke={ART.sky} strokeLinecap="round" strokeLinejoin="round">
        <rect x={-88} y={-58} width={176} height={116} rx={5} strokeWidth={2.2} opacity={0.75} />
        <line x1={-88} x2={88} y1={-42} y2={-42} strokeWidth={1.8} opacity={0.6} />
        <line x1={-50} x2={-50} y1={-42} y2={58} strokeWidth={1.8} opacity={0.45} />
        {[-30, -18, -6].map((y) => (
          <line key={y} x1={-80} x2={-60} y1={y} y2={y} stroke={ART.inkDim} strokeWidth={2.6} />
        ))}
        <rect x={-40} y={-34} width={120} height={34} rx={4} fill={ART.sky} fillOpacity={0.12} strokeWidth={2} opacity={0.8} />
        <rect x={-40} y={8} width={56} height={34} rx={4} strokeWidth={1.8} opacity={0.55} />
        <rect x={24} y={8} width={56} height={34} rx={4} strokeWidth={1.8} opacity={0.55} />
        <rect x={40} y={44} width={40} height={10} rx={5} fill={ART.sky} fillOpacity={0.35} stroke="none" />
      </g>
    ),
  },
  ...[-148, -82, -16, 50].map(
    (x, index): SheetSpec => ({
      x,
      y: 84 + (index % 2) * 6,
      w: 56,
      h: 44,
      r: 4,
      rot: [-4, 3, -2, 4][index],
      depth: 3,
      fill: ART.paperHi,
      content: (
        <>
          <rect x={-28} y={-22} width={56} height={8} rx={3} fill={FLOW_STRIPES[index]} opacity={0.75} />
          <g transform="translate(0 4)">{FLOW_GLYPHS[index]}</g>
        </>
      ),
    }),
  ),
  {
    x: 128,
    y: -18,
    w: 96,
    h: 136,
    r: 4,
    rot: 6,
    depth: 3,
    fill: ART.paperHi,
    content: (
      <g strokeLinecap="round" strokeLinejoin="round">
        <rect x={-18} y={-74} width={36} height={13} rx={3} fill="#3b4d68" />
        {line(-34, 12, -48, ART.ink, 3)}
        {[-26, -4, 18, 40].map((y, row) => (
          <g key={y}>
            <rect x={-36} y={y - 6} width={12} height={12} rx={2} fill="none" stroke={ART.inkDim} strokeWidth={1.6} />
            {row < 3 && <path d={`M -33 ${y} l 3 3.5 l 6 -8`} fill="none" stroke={ART.teal} strokeWidth={2.6} />}
            {line(-16, row % 2 ? 22 : 32, y, row < 3 ? ART.inkDim : ART.ink)}
          </g>
        ))}
      </g>
    ),
  },
];

const PRODUCT_ARROWS = (
  <g fill="none" stroke={ART.inkDim} strokeWidth={2.2} strokeLinecap="round" strokeLinejoin="round">
    {[-115, -49, 17].map((x) => (
      <path key={x} d={`M ${x - 3} 82 l 5 5 l -5 5`} />
    ))}
  </g>
);

export function ProductArt(props: ObjectArtProps) {
  return <ObjectParts {...props} sheets={PRODUCT_SHEETS} halo={{ rx: 200, ry: 92 }} decor={PRODUCT_ARROWS} />;
}

// ---------- Consulting: issue tree, evidence cards, recommendation memo ----------

const CONSULTING_SHEETS: readonly SheetSpec[] = [
  {
    x: -55,
    y: -30,
    w: 220,
    h: 150,
    rot: 4,
    fill: ART.paper,
    content: (
      <g fill="none" strokeLinecap="round" strokeLinejoin="round">
        <rect x={-98} y={-12} width={34} height={24} rx={4} stroke={ART.amber} strokeWidth={2.2} fill={ART.amber} fillOpacity={0.15} />
        <path d="M -64 0 H -48 V -36 H -36 M -48 0 V 36 H -36" stroke={ART.inkDim} strokeWidth={2} />
        <rect x={-36} y={-46} width={30} height={20} rx={3} stroke={ART.ink} strokeWidth={1.8} />
        <rect x={-36} y={26} width={30} height={20} rx={3} stroke={ART.ink} strokeWidth={1.8} />
        <path d="M -6 -36 H 6 V -54 H 16 M 6 -36 V -20 H 16 M -6 36 H 6 V 20 H 16 M 6 36 V 52 H 16" stroke={ART.inkDim} strokeWidth={1.8} />
        {[-62, -28, 12, 44].map((y, index) => (
          <rect
            key={y}
            x={16}
            y={y}
            width={74}
            height={17}
            rx={3}
            stroke={index === 1 ? ART.teal : ART.inkDim}
            strokeWidth={index === 1 ? 2.2 : 1.6}
            fill={index === 1 ? ART.teal : ART.ink}
            fillOpacity={index === 1 ? 0.16 : 0.05}
          />
        ))}
      </g>
    ),
  },
  { x: 122, y: -70, w: 88, h: 60, r: 3, rot: 13, depth: 2, fill: ART.paper },
  { x: 116, y: -62, w: 88, h: 60, r: 3, rot: 6, depth: 2, fill: ART.paper },
  {
    x: 110,
    y: -54,
    w: 88,
    h: 60,
    r: 3,
    rot: -2,
    depth: 2,
    fill: ART.paperHi,
    content: (
      <g strokeLinecap="round">
        <rect x={-38} y={-24} width={22} height={8} rx={2} fill={ART.amber} opacity={0.55} />
        {[
          [-32, 14],
          [-20, 22],
          [-8, 30],
        ].map(([x, h]) => (
          <rect key={x} x={x} y={18 - h} width={8} height={h} rx={1.5} fill={ART.sky} opacity={0.55} />
        ))}
        {line(8, 32, -10, ART.ink, 2.4)}
        {line(8, 26, -1, ART.inkDim, 2.4)}
        <circle cx={28} cy={13} r={5} fill={ART.teal} />
      </g>
    ),
  },
  {
    x: 52,
    y: 74,
    w: 140,
    h: 104,
    r: 4,
    rot: -4,
    depth: 3,
    fill: ART.paperHi,
    content: (
      <g strokeLinecap="round" strokeLinejoin="round">
        <rect x={-70} y={-52} width={140} height={20} rx={3} fill={ART.amber} opacity={0.22} />
        {line(-60, 0, -42, ART.amber, 2.8)}
        {[-16, 6, 28].map((y, index) => (
          <g key={y}>
            <circle cx={-54} cy={y} r={5.5} fill="none" stroke={ART.ink} strokeWidth={1.6} />
            {line(-40, [40, 28, 18][index], y, ART.ink)}
          </g>
        ))}
        <circle cx={46} cy={34} r={11} fill={ART.teal} fillOpacity={0.2} stroke={ART.teal} strokeWidth={1.8} />
        <path d="M 41 34 l 4 4 l 7 -9" fill="none" stroke={ART.teal} strokeWidth={2.6} />
      </g>
    ),
  },
];

export function ConsultingArt(props: ObjectArtProps) {
  return <ObjectParts {...props} sheets={CONSULTING_SHEETS} halo={{ rx: 196, ry: 92 }} />;
}

// ---------- Public finance: budget ledger, analytical model, institutional diagram ----------

function LedgerPage({ x }: { x: number }) {
  return (
    <g transform={`translate(${x} 0)`} strokeLinecap="round">
      <rect x={-57} y={-74} width={114} height={148} rx={3} fill="#1d2d47" />
      {line(-46, 0, -60, ART.ink, 2.6)}
      {[-44, -28, -12, 4, 20, 36, 52].map((y) => (
        <line key={y} x1={-50} x2={50} y1={y + 6} y2={y + 6} stroke="#2f4361" strokeWidth={1.2} />
      ))}
      <line x1={-18} x2={-18} y1={-50} y2={62} stroke="#2f4361" strokeWidth={1.2} />
      <line x1={22} x2={22} y1={-50} y2={62} stroke="#2f4361" strokeWidth={1.2} />
      {[-44, -28, -12, 4, 20, 36].map((y, row) => (
        <g key={y}>
          {line(-46, -26 - (row % 3) * 4, y, ART.inkDim, 2.2)}
          {line(30 + (row % 2) * 6, 46, y, ART.ink, 2.2)}
        </g>
      ))}
      <line x1={26} x2={48} y1={57} y2={57} stroke={ART.amber} strokeWidth={1.6} />
      <line x1={26} x2={48} y1={61} y2={61} stroke={ART.amber} strokeWidth={1.6} />
    </g>
  );
}

const FINANCE_SHEETS: readonly SheetSpec[] = [
  {
    x: -40,
    y: -25,
    w: 250,
    h: 164,
    r: 6,
    rot: -3,
    depth: 8,
    fill: "#163453",
    stroke: "#24496d",
    content: (
      <>
        <rect x={-119} y={-74} width={236} height={152} rx={3} fill="#2a3b55" />
        <LedgerPage x={-59} />
        <LedgerPage x={59} />
        <line x1={0} x2={0} y1={-74} y2={74} stroke="#0b1a2c" strokeWidth={3} />
      </>
    ),
  },
  {
    x: 128,
    y: 48,
    w: 112,
    h: 84,
    r: 4,
    rot: -7,
    depth: 3,
    fill: ART.paperHi,
    content: (
      <g fill="none" strokeLinecap="round">
        <path d="M -42 -30 V 28 H 46" stroke={ART.inkDim} strokeWidth={1.8} />
        <path d="M -40 22 C -10 18 10 0 44 -30 L 44 0 C 14 10 -10 18 -40 22 Z" fill={ART.amber} fillOpacity={0.12} stroke="none" />
        <path d="M -40 22 C -10 18 10 0 44 -30" stroke={ART.amber} strokeWidth={2.2} strokeDasharray="5 4" />
        <path d="M -40 22 C -10 18 14 10 44 0" stroke={ART.teal} strokeWidth={2.6} />
      </g>
    ),
  },
  {
    x: -150,
    y: 72,
    w: 100,
    h: 92,
    r: 4,
    rot: 6,
    depth: 3,
    fill: ART.paperHi,
    content: (
      <g strokeLinecap="round" strokeLinejoin="round">
        <path d="M -26 -26 L 0 -40 L 26 -26 Z" fill={ART.ink} fillOpacity={0.25} stroke={ART.ink} strokeWidth={1.6} />
        {[-18, -6, 6, 18].map((x) => (
          <line key={x} x1={x} x2={x} y1={-24} y2={-10} stroke={ART.ink} strokeWidth={2.6} />
        ))}
        {line(-28, 28, -7, ART.ink, 2.8)}
        <path d="M 0 -7 V 6 M -30 6 H 30 M -30 6 V 14 M 0 6 V 14 M 30 6 V 14" fill="none" stroke={ART.inkDim} strokeWidth={1.6} />
        {[-40, -10, 20].map((x) => (
          <rect key={x} x={x} y={14} width={20} height={16} rx={2} fill={ART.teal} fillOpacity={0.14} stroke={ART.teal} strokeOpacity={0.8} strokeWidth={1.6} />
        ))}
      </g>
    ),
  },
];

export function FinanceArt(props: ObjectArtProps) {
  return <ObjectParts {...props} sheets={FINANCE_SHEETS} halo={{ rx: 210, ry: 92, cy: 4 }} />;
}

// ---------- Career advising: annotated résumé, application roadmap, conversation ----------

/** A rounded speech bubble with its tail on the lower left or lower right. */
function bubblePath(w: number, h: number, r: number, tail: "left" | "right"): string {
  const t = tail === "left" ? `H 24 L 12 ${h + 11} L 14 ${h}` : `H ${w - 14} L ${w - 12} ${h + 11} L ${w - 24} ${h}`;
  return tail === "left"
    ? `M ${r} 0 H ${w - r} Q ${w} 0 ${w} ${r} V ${h - r} Q ${w} ${h} ${w - r} ${h} ${t} H ${r} Q 0 ${h} 0 ${h - r} V ${r} Q 0 0 ${r} 0 Z`
    : `M ${r} 0 H ${w - r} Q ${w} 0 ${w} ${r} V ${h - r} Q ${w} ${h} ${w - r} ${h} ${t} H ${r} Q 0 ${h} 0 ${h - r} V ${r} Q 0 0 ${r} 0 Z`;
}

const ADVISING_SHEETS: readonly SheetSpec[] = [
  {
    x: -60,
    y: -14,
    w: 150,
    h: 196,
    rot: -4,
    fill: ART.paper,
    content: (
      <g strokeLinecap="round" fill="none">
        <circle cx={-48} cy={-72} r={13} fill={ART.ink} fillOpacity={0.18} stroke={ART.ink} strokeWidth={1.4} />
        {line(-28, 30, -76, ART.ink, 3.2)}
        {line(-28, 8, -63)}
        {[
          [-40, [-28, -18]],
          [4, [16, 26, 36]],
          [56, [68, 78]],
        ].map(([heading, rows]) => (
          <g key={heading as number}>
            {line(-60, -30, heading as number, ART.sky, 2.6)}
            {(rows as number[]).map((y, index) => (
              <g key={y}>{line(-60, index % 2 ? 36 : 54, y)}</g>
            ))}
          </g>
        ))}
        <ellipse cx={12} cy={-28} rx={46} ry={9} stroke={ART.amber} strokeWidth={1.8} />
        <path d="M -60 41 q 5 4 10 0 t 10 0 t 10 0 t 10 0 t 10 0 t 10 0" stroke={ART.amber} strokeWidth={1.8} />
        <path d="M 60 18 l 4 4 l 7 -8" stroke={ART.amber} strokeWidth={2.4} />
        <path d="M 58 -52 q 10 -4 12 8" stroke={ART.amber} strokeWidth={1.8} />
      </g>
    ),
  },
  {
    x: 104,
    y: 40,
    w: 156,
    h: 112,
    r: 4,
    rot: 6,
    depth: 3,
    fill: ART.paperHi,
    content: (
      <g strokeLinecap="round" strokeLinejoin="round">
        <path d="M -58 36 Q -40 30 -20 18 T 18 0 T 56 -30" fill="none" stroke={ART.inkDim} strokeWidth={2} strokeDasharray="4 5" />
        {(
          [
            [-58, 36, ART.amber],
            [-20, 18, ART.sky],
            [18, 0, ART.teal],
          ] as const
        ).map(([x, y, color]) => (
          <circle key={x} cx={x} cy={y} r={6.5} fill={ART.paperHi} stroke={color} strokeWidth={2.4} />
        ))}
        <line x1={56} x2={56} y1={-28} y2={-52} stroke={ART.ink} strokeWidth={2.2} />
        <path d="M 56 -52 L 74 -46 L 56 -40 Z" fill={ART.teal} />
      </g>
    ),
  },
];

const ADVISING_FLOAT = (
  <g className="wb-float">
    <g transform="translate(-28 -122)">
      <path d={bubblePath(78, 40, 10, "left")} fill="#22344f" stroke={ART.edge} strokeWidth={1.4} />
      {[22, 39, 56].map((x) => (
        <circle key={x} cx={x} cy={20} r={3.4} fill={ART.ink} />
      ))}
    </g>
    <g transform="translate(36 -96)">
      <path d={bubblePath(66, 34, 9, "right")} fill="#173a40" stroke={ART.teal} strokeOpacity={0.7} strokeWidth={1.4} />
      {line(14, 52, 13, ART.teal, 2.6)}
      {line(14, 38, 22, ART.teal, 2.6)}
    </g>
  </g>
);

const ADVISING_FLOAT_SHADOW = <ellipse cx={18} cy={-46} rx={58} ry={11} fill="#000" opacity={0.28} />;

export function AdvisingArt(props: ObjectArtProps) {
  return (
    <ObjectParts
      {...props}
      sheets={ADVISING_SHEETS}
      halo={{ rx: 190, ry: 96 }}
      float={ADVISING_FLOAT}
      floatShadow={ADVISING_FLOAT_SHADOW}
    />
  );
}

// ---------- Research: the open notebook at the centre ----------

/** The five research stages, highlighted on the notebook pages as the reader steps through them. */
function Region({ stage, x, y, w, h }: { stage: string; x: number; y: number; w: number; h: number }) {
  return <rect className="wb-region" data-stage={stage} x={x} y={y} width={w} height={h} rx={7} />;
}

function NotebookPages({ ids }: { ids: ArtIds }) {
  return (
    <g strokeLinecap="round" strokeLinejoin="round">
      {[4, 2].map((offset) => (
        <g key={offset} fill="#9fb0c3" opacity={0.9}>
          <rect x={-208 - offset} y={-134 + offset} width={206} height={268} rx={4} />
          <rect x={2 + offset} y={-134 + offset} width={206} height={268} rx={4} />
        </g>
      ))}
      <rect x={-208} y={-134} width={206} height={268} rx={4} fill={`url(#${ids.pageL})`} />
      <rect x={2} y={-134} width={206} height={268} rx={4} fill={`url(#${ids.pageR})`} />
      <rect x={-18} y={-134} width={36} height={268} fill={`url(#${ids.spine})`} />

      <Region stage="question" x={-198} y={-124} w={182} h={64} />
      <Region stage="method" x={-198} y={-52} w={182} h={96} />
      <Region stage="evidence" x={14} y={-124} w={184} h={98} />
      <Region stage="findings" x={14} y={-18} w={184} h={84} />
      <Region stage="implications" x={14} y={72} w={184} h={54} />

      {/* Question: a "Q", two lines and a decorative, non-referential citation bracket. */}
      <g fill="none">
        <circle cx={-178} cy={-98} r={9} stroke={ART.nbTeal} strokeWidth={2.6} />
        <line x1={-172} y1={-92} x2={-165} y2={-85} stroke={ART.nbTeal} strokeWidth={2.6} />
        {line(-154, -36, -102, ART.nbInk, 3.4)}
        {line(-154, -78, -84, ART.nbInk, 3.4)}
        <path d="M -64 -92 h -4 v 15 h 4 M -50 -92 h 4 v 15 h -4" stroke={ART.nbTeal} strokeWidth={2} />
        <circle cx={-57} cy={-84.5} r={2} fill={ART.nbTeal} stroke="none" />
      </g>
      {/* Method: three stages. */}
      <g fill="none">
        {[-188, -130, -72].map((x) => (
          <rect key={x} x={x} y={-36} width={44} height={30} rx={5} stroke={ART.nbInk} strokeWidth={2.2} fill="#ffffff" fillOpacity={0.3} />
        ))}
        <path d="M -142 -21 h 8 m -4 -4 l 4 4 l -4 4 M -84 -21 h 8 m -4 -4 l 4 4 l -4 4" stroke={ART.nbInk} strokeWidth={2} />
        {line(-188, -40, 14, ART.nbInk, 2.8)}
        {line(-188, -90, 28, ART.nbInk, 2.8)}
      </g>
      {/* Notes and another decorative bracket. */}
      <g opacity={0.55}>
        {line(-188, -50, 74, ART.nbInk, 2.8)}
        {line(-188, -70, 90, ART.nbInk, 2.8)}
        {line(-188, -110, 106, ART.nbInk, 2.8)}
        <path d="M -60 82 h -4 v 15 h 4 M -46 82 h 4 v 15 h -4" fill="none" stroke={ART.nbTeal} strokeWidth={2} />
      </g>
      {/* Evidence: three layered sources. */}
      <rect x={28} y={-114} width={110} height={56} rx={4} fill={ART.sky} fillOpacity={0.28} stroke="#4f86c6" strokeWidth={1.6} />
      <rect x={48} y={-102} width={110} height={56} rx={4} fill={ART.amber} fillOpacity={0.26} stroke="#c38a2e" strokeWidth={1.6} />
      <rect x={68} y={-90} width={110} height={56} rx={4} fill={ART.teal} fillOpacity={0.24} stroke={ART.nbTeal} strokeWidth={1.6} />
      <g stroke={ART.nbTeal} strokeWidth={1.2} opacity={0.7}>
        <line x1={104} x2={104} y1={-90} y2={-34} />
        <line x1={140} x2={140} y1={-90} y2={-34} />
        <line x1={68} x2={178} y1={-70} y2={-70} />
        <line x1={68} x2={178} y1={-52} y2={-52} />
      </g>
      {/* Findings: points and a fitted line. */}
      <path d="M 30 -8 V 54 H 186" fill="none" stroke={ART.nbInk} strokeWidth={1.8} />
      {[
        [46, 42],
        [62, 34],
        [78, 38],
        [96, 24],
        [114, 27],
        [132, 14],
        [150, 10],
        [168, 2],
      ].map(([x, y]) => (
        <circle key={x} cx={x} cy={y} r={3.4} fill={ART.nbInk} opacity={0.75} />
      ))}
      <line x1={38} y1={46} x2={180} y2={-2} stroke={ART.nbTeal} strokeWidth={2.6} />
      {/* Implications: carried outward. */}
      <g fill="none">
        <path d="M 30 99 H 108 M 99 91 l 10 8 l -10 8" stroke={ART.nbTeal} strokeWidth={2.8} />
        {line(122, 184, 92, ART.nbInk, 2.8)}
        {line(122, 166, 106, ART.nbInk, 2.8)}
      </g>
      {/* Ribbon bookmark, hanging over the front edge. */}
      <path d="M 150 40 h 11 v 112 l -5.5 -7 l -5.5 7 Z" fill={ART.teal} opacity={0.9} />
    </g>
  );
}

const NOTEBOOK_SHEETS = (ids: ArtIds): readonly SheetSpec[] => [
  { x: 0, y: 0, w: 436, h: 286, r: 10, rot: -2, depth: 10, fill: "#0f3a3b", stroke: "#1a5a57", side: "#061a1c", content: <NotebookPages ids={ids} /> },
];

export function NotebookArt(props: ObjectArtProps) {
  return <ObjectParts {...props} sheets={NOTEBOOK_SHEETS(props.ids)} halo={{ rx: 300, ry: 150, cy: 6 }} />;
}

export const OBJECT_ART = {
  research: NotebookArt,
  product: ProductArt,
  consulting: ConsultingArt,
  "public-finance": FinanceArt,
  advising: AdvisingArt,
} as const;

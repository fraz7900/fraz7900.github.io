/**
 * Small force-directed layout for the strategy map. Pure functions: each step
 * returns new node objects. Fine for the few dozen nodes on this site.
 */

export interface LayoutNode {
  readonly id: string;
  readonly x: number;
  readonly y: number;
  readonly vx: number;
  readonly vy: number;
  readonly pinned?: boolean;
}

export interface LayoutSize {
  readonly width: number;
  readonly height: number;
}

const REPULSION = 9000;
const SPRING = 0.03;
const REST_LENGTH = 110;
const GRAVITY = 0.007;
const DAMPING = 0.82;
const MAX_SPEED = 12;
const MARGIN = 24;
const GOLDEN_ANGLE = Math.PI * (3 - Math.sqrt(5));

/** Deterministic spiral seed so the first frame (and tests) are stable. */
export function seedLayout(ids: readonly string[], size: LayoutSize): LayoutNode[] {
  const cx = size.width / 2;
  const cy = size.height / 2;
  const spread = Math.min(size.width, size.height) * 0.42;
  return ids.map((id, i) => {
    const r = spread * Math.sqrt((i + 0.5) / ids.length);
    const angle = i * GOLDEN_ANGLE;
    return { id, x: cx + r * Math.cos(angle), y: cy + r * Math.sin(angle) * 0.85, vx: 0, vy: 0 };
  });
}

const clamp = (v: number, lo: number, hi: number) => Math.max(lo, Math.min(hi, v));

export function stepLayout(
  nodes: readonly LayoutNode[],
  links: readonly (readonly [string, string])[],
  size: LayoutSize,
): LayoutNode[] {
  const index = new Map(nodes.map((n, i) => [n.id, i]));
  const fx = new Float64Array(nodes.length);
  const fy = new Float64Array(nodes.length);

  for (let i = 0; i < nodes.length; i += 1) {
    for (let j = i + 1; j < nodes.length; j += 1) {
      const dx = nodes[i].x - nodes[j].x;
      const dy = nodes[i].y - nodes[j].y;
      const d2 = Math.max(dx * dx + dy * dy, 25);
      const d = Math.sqrt(d2);
      const f = REPULSION / d2;
      fx[i] += (dx / d) * f;
      fy[i] += (dy / d) * f;
      fx[j] -= (dx / d) * f;
      fy[j] -= (dy / d) * f;
    }
  }

  for (const [from, to] of links) {
    const i = index.get(from);
    const j = index.get(to);
    if (i === undefined || j === undefined) continue;
    const dx = nodes[j].x - nodes[i].x;
    const dy = nodes[j].y - nodes[i].y;
    const d = Math.max(Math.hypot(dx, dy), 0.01);
    const f = SPRING * (d - REST_LENGTH);
    fx[i] += (dx / d) * f;
    fy[i] += (dy / d) * f;
    fx[j] -= (dx / d) * f;
    fy[j] -= (dy / d) * f;
  }

  const cx = size.width / 2;
  const cy = size.height / 2;
  // Weaker pull along the wider axis so the map fills a landscape box.
  const aspect = size.width / Math.max(size.height, 1);

  return nodes.map((n, i) => {
    if (n.pinned) return { ...n, vx: 0, vy: 0 };
    const ax = fx[i] + (cx - n.x) * (GRAVITY / aspect);
    const ay = fy[i] + (cy - n.y) * GRAVITY;
    const vx = clamp((n.vx + ax) * DAMPING, -MAX_SPEED, MAX_SPEED);
    const vy = clamp((n.vy + ay) * DAMPING, -MAX_SPEED, MAX_SPEED);
    return {
      ...n,
      vx,
      vy,
      x: clamp(n.x + vx, MARGIN, size.width - MARGIN),
      y: clamp(n.y + vy, MARGIN, size.height - MARGIN),
    };
  });
}

export function settle(
  nodes: readonly LayoutNode[],
  links: readonly (readonly [string, string])[],
  size: LayoutSize,
  steps: number,
): LayoutNode[] {
  let current = [...nodes];
  for (let i = 0; i < steps; i += 1) current = stepLayout(current, links, size);
  return current;
}

export function neighbours(id: string, links: readonly (readonly [string, string])[]): Set<string> {
  const result = new Set([id]);
  for (const [a, b] of links) {
    if (a === id) result.add(b);
    if (b === id) result.add(a);
  }
  return result;
}

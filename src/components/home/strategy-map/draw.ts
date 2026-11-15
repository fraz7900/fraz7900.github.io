import type { GraphNode, GraphNodeType } from "@/content/graph";
import type { LayoutNode } from "@/lib/forceGraph";

export const NODE_STYLE: Record<GraphNodeType, { readonly color: string; readonly radius: number; readonly glow: boolean }> = {
  work: { color: "#f2b45a", radius: 9, glow: true },
  domain: { color: "#36d1bb", radius: 7, glow: true },
  method: { color: "#6cb6ff", radius: 5, glow: false },
  tool: { color: "#9aa8ba", radius: 4, glow: false },
};

export interface DrawState {
  readonly layout: readonly LayoutNode[];
  readonly nodes: ReadonlyMap<string, GraphNode>;
  readonly links: readonly (readonly [string, string])[];
  readonly hidden: ReadonlySet<GraphNodeType>;
  /** Node ids to emphasise (hovered node plus its neighbours); null when nothing is focused. */
  readonly focus: ReadonlySet<string> | null;
  readonly width: number;
  readonly height: number;
}

const isVisible = (state: DrawState, id: string) => {
  const node = state.nodes.get(id);
  return Boolean(node && !state.hidden.has(node.type));
};

export function drawGraph(ctx: CanvasRenderingContext2D, state: DrawState): void {
  ctx.clearRect(0, 0, state.width, state.height);
  const positions = new Map(state.layout.map((n) => [n.id, n]));

  for (const [from, to] of state.links) {
    if (!isVisible(state, from) || !isVisible(state, to)) continue;
    const a = positions.get(from);
    const b = positions.get(to);
    if (!a || !b) continue;
    const lit = state.focus?.has(from) && state.focus?.has(to);
    ctx.strokeStyle = lit ? "rgba(54, 209, 187, 0.75)" : state.focus ? "rgba(154, 168, 186, 0.07)" : "rgba(154, 168, 186, 0.2)";
    ctx.lineWidth = lit ? 1.6 : 1;
    ctx.beginPath();
    ctx.moveTo(a.x, a.y);
    ctx.lineTo(b.x, b.y);
    ctx.stroke();
  }

  const visibleNodes = state.layout.flatMap((point) => {
    const node = state.nodes.get(point.id);
    return node && !state.hidden.has(node.type) ? [{ point, node }] : [];
  });
  const isDimmed = (id: string) => state.focus !== null && !state.focus.has(id);

  for (const { point, node } of visibleNodes) {
    const style = NODE_STYLE[node.type];
    const dimmed = isDimmed(node.id);
    ctx.globalAlpha = dimmed ? 0.22 : 1;
    ctx.shadowColor = style.color;
    ctx.shadowBlur = style.glow && !dimmed ? 16 : 0;
    ctx.fillStyle = style.color;
    ctx.beginPath();
    ctx.arc(point.x, point.y, style.radius, 0, Math.PI * 2);
    ctx.fill();
    ctx.shadowBlur = 0;
  }

  // Labels after all nodes, focused ones last, each with a dark outline so crossings stay legible.
  const ordered = [...visibleNodes].sort((a, b) => Number(!isDimmed(a.node.id)) - Number(!isDimmed(b.node.id)));
  ctx.textBaseline = "middle";
  ctx.lineJoin = "round";
  for (const { point, node } of ordered) {
    const style = NODE_STYLE[node.type];
    const strong = node.type === "work" || node.type === "domain";
    const onRight = point.x < state.width - 150;
    const x = point.x + (onRight ? style.radius + 6 : -style.radius - 6);
    ctx.globalAlpha = isDimmed(node.id) ? 0.3 : 1;
    ctx.font = `${strong ? 600 : 400} ${strong ? 12.5 : 11}px Inter, ui-sans-serif, sans-serif`;
    ctx.textAlign = onRight ? "left" : "right";
    ctx.strokeStyle = "rgba(6, 11, 20, 0.9)";
    ctx.lineWidth = 4;
    ctx.strokeText(node.label, x, point.y);
    ctx.fillStyle = strong ? "#e6edf5" : "#9aa8ba";
    ctx.fillText(node.label, x, point.y);
  }
  ctx.globalAlpha = 1;
}

/** Nearest visible node under the pointer, within a small touch-friendly slop. */
export function pickNode(state: DrawState, x: number, y: number): LayoutNode | null {
  let best: LayoutNode | null = null;
  let bestDistance = Infinity;
  for (const point of state.layout) {
    const node = state.nodes.get(point.id);
    if (!node || state.hidden.has(node.type)) continue;
    const distance = Math.hypot(point.x - x, point.y - y);
    if (distance <= NODE_STYLE[node.type].radius + 8 && distance < bestDistance) {
      best = point;
      bestDistance = distance;
    }
  }
  return best;
}

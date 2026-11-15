"use client";

import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { GRAPH_LINKS, GRAPH_NODES, GRAPH_TYPES, type GraphNodeType } from "@/content/graph";
import { neighbours, seedLayout, settle, stepLayout, type LayoutNode, type LayoutSize } from "@/lib/forceGraph";
import { NODE_STYLE, drawGraph, pickNode, type DrawState } from "./draw";
import { FOCUS_EVENT } from "./focus";
import { StrategyList } from "./StrategyList";

const NODES_BY_ID = new Map(GRAPH_NODES.map((n) => [n.id, n]));
const IDS = GRAPH_NODES.map((n) => n.id);
const SETTLE_STEPS = 320;
const DRAG_THRESHOLD_PX = 4;

interface Tip {
  readonly id: string;
  readonly x: number;
  readonly y: number;
}

interface Drag {
  readonly id: string;
  readonly startX: number;
  readonly startY: number;
  readonly moved: boolean;
}

const heightFor = (width: number) => (width < 640 ? 420 : 470);
const fitInside = (layout: readonly LayoutNode[], size: LayoutSize) =>
  layout.map((n) => ({ ...n, x: Math.min(Math.max(n.x, 24), size.width - 24), y: Math.min(Math.max(n.y, 24), size.height - 24) }));

export function StrategyMap() {
  const router = useRouter();
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const layoutRef = useRef<LayoutNode[]>([]);
  const sizeRef = useRef<LayoutSize>({ width: 0, height: 0 });
  const hoverRef = useRef<string | null>(null);
  const externalRef = useRef<string | null>(null);
  const hiddenRef = useRef<ReadonlySet<GraphNodeType>>(new Set());
  const dragRef = useRef<Drag | null>(null);
  const drawRef = useRef<() => void>(() => {});
  const [hidden, setHidden] = useState<ReadonlySet<GraphNodeType>>(new Set());
  const [tip, setTip] = useState<Tip | null>(null);

  useEffect(() => {
    hiddenRef.current = hidden;
    drawRef.current();
  }, [hidden]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !container || !ctx) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let frame = 0;
    let visible = false;

    const state = (): DrawState => {
      const focusId = hoverRef.current ?? externalRef.current;
      return {
        layout: layoutRef.current,
        nodes: NODES_BY_ID,
        links: GRAPH_LINKS,
        hidden: hiddenRef.current,
        focus: focusId ? neighbours(focusId, GRAPH_LINKS) : null,
        width: sizeRef.current.width,
        height: sizeRef.current.height,
      };
    };
    drawRef.current = () => drawGraph(ctx, state());

    const resize = () => {
      const width = container.clientWidth;
      const size = { width, height: heightFor(width) };
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.round(size.width * dpr);
      canvas.height = Math.round(size.height * dpr);
      canvas.style.height = `${size.height}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      sizeRef.current = size;
      layoutRef.current =
        layoutRef.current.length === 0
          ? settle(seedLayout(IDS, size), GRAPH_LINKS, size, reduced ? SETTLE_STEPS : 60)
          : fitInside(layoutRef.current, size);
      drawRef.current();
    };

    const loop = () => {
      layoutRef.current = stepLayout(layoutRef.current, GRAPH_LINKS, sizeRef.current);
      drawRef.current();
      frame = requestAnimationFrame(loop);
    };
    const setRunning = (run: boolean) => {
      cancelAnimationFrame(frame);
      if (run && !reduced) frame = requestAnimationFrame(loop);
    };

    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(container);
    const visibility = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      setRunning(visible);
    });
    visibility.observe(canvas);
    const onFocusEvent = (event: Event) => {
      externalRef.current = (event as CustomEvent<string | null>).detail;
      drawRef.current();
    };
    window.addEventListener(FOCUS_EVENT, onFocusEvent);
    canvas.dataset.ready = "true";

    return () => {
      cancelAnimationFrame(frame);
      resizeObserver.disconnect();
      visibility.disconnect();
      window.removeEventListener(FOCUS_EVENT, onFocusEvent);
    };
  }, []);

  const local = (event: React.PointerEvent<HTMLCanvasElement>) => {
    const rect = event.currentTarget.getBoundingClientRect();
    return { x: event.clientX - rect.left, y: event.clientY - rect.top };
  };

  const currentState = (): DrawState => ({
    layout: layoutRef.current,
    nodes: NODES_BY_ID,
    links: GRAPH_LINKS,
    hidden: hiddenRef.current,
    focus: null,
    width: sizeRef.current.width,
    height: sizeRef.current.height,
  });

  const moveNode = (id: string, x: number, y: number, pinned: boolean) => {
    layoutRef.current = layoutRef.current.map((n) => (n.id === id ? { ...n, x, y, vx: 0, vy: 0, pinned } : n));
  };

  const onPointerDown = (event: React.PointerEvent<HTMLCanvasElement>) => {
    const { x, y } = local(event);
    const hit = pickNode(currentState(), x, y);
    if (!hit) return;
    event.currentTarget.setPointerCapture(event.pointerId);
    dragRef.current = { id: hit.id, startX: x, startY: y, moved: false };
    moveNode(hit.id, hit.x, hit.y, true);
  };

  const onPointerMove = (event: React.PointerEvent<HTMLCanvasElement>) => {
    const { x, y } = local(event);
    const drag = dragRef.current;
    if (drag) {
      const moved = drag.moved || Math.hypot(x - drag.startX, y - drag.startY) > DRAG_THRESHOLD_PX;
      dragRef.current = { ...drag, moved };
      moveNode(drag.id, x, y, true);
      hoverRef.current = drag.id;
      setTip({ id: drag.id, x, y });
      drawRef.current();
      return;
    }
    const hit = pickNode(currentState(), x, y);
    event.currentTarget.style.cursor = hit ? "pointer" : "grab";
    if (hit?.id !== hoverRef.current) {
      hoverRef.current = hit?.id ?? null;
      drawRef.current();
    }
    setTip(hit ? { id: hit.id, x, y } : null);
  };

  const onPointerUp = () => {
    const drag = dragRef.current;
    dragRef.current = null;
    if (!drag) return;
    const point = layoutRef.current.find((n) => n.id === drag.id);
    if (point) moveNode(drag.id, point.x, point.y, false);
    const href = NODES_BY_ID.get(drag.id)?.href;
    if (!drag.moved && href) router.push(href);
  };

  const onPointerLeave = () => {
    if (dragRef.current) return;
    hoverRef.current = null;
    setTip(null);
    drawRef.current();
  };

  const toggleType = (type: GraphNodeType) =>
    setHidden((current) => {
      const next = new Set(current);
      if (next.has(type)) next.delete(type);
      else next.add(type);
      return next;
    });

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <ul aria-label="Show or hide node types" className="flex flex-wrap gap-2">
          {GRAPH_TYPES.map(({ type, label }) => (
            <li key={type}>
              <button
                type="button"
                aria-pressed={!hidden.has(type)}
                onClick={() => toggleType(type)}
                className="flex items-center gap-2 rounded-full border border-line-strong px-3 py-1 font-mono text-xs text-ink transition-opacity aria-[pressed=false]:opacity-45"
              >
                <span aria-hidden="true" className="size-2 rounded-full" style={{ background: NODE_STYLE[type].color }} />
                {label}
              </button>
            </li>
          ))}
        </ul>
        <p className="font-mono text-[0.7rem] text-faint">Drag nodes · hover to trace · click work to open</p>
      </div>

      <div ref={containerRef} className="glass relative overflow-hidden rounded-xl">
        <canvas
          ref={canvasRef}
          role="img"
          aria-label={`Strategy map: ${GRAPH_NODES.length} items connecting my work to domains, methods and tools. A text version follows.`}
          className="block w-full touch-none"
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={onPointerUp}
          onPointerCancel={onPointerUp}
          onPointerLeave={onPointerLeave}
        />
        {tip && <MapTip tip={tip} />}
      </div>

      <StrategyList />
    </div>
  );
}

function MapTip({ tip }: { tip: Tip }) {
  const node = NODES_BY_ID.get(tip.id);
  if (!node) return null;
  const connections = neighbours(node.id, GRAPH_LINKS).size - 1;
  const typeLabel = GRAPH_TYPES.find((t) => t.type === node.type)?.label ?? node.type;

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute z-10 max-w-56 rounded-lg border border-line-strong bg-paper/95 px-3 py-2 text-xs shadow-lg"
      style={{ left: Math.max(8, tip.x + 14), top: Math.max(8, tip.y + 14) }}
    >
      <p className="font-medium text-ink">{node.label}</p>
      <p className="mt-0.5 text-muted">
        {typeLabel} · {connections} connection{connections === 1 ? "" : "s"}
      </p>
      {node.href && <p className="mt-1 text-accent">Click to open</p>}
    </div>
  );
}

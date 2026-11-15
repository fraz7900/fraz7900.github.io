import { describe, expect, test } from "vitest";
import { GRAPH_LINKS, GRAPH_NODES } from "@/content/graph";
import { neighbours, seedLayout, settle, stepLayout, type LayoutNode } from "./forceGraph";

const SIZE = { width: 800, height: 420 };
const LINKS: readonly (readonly [string, string])[] = [
  ["a", "b"],
  ["b", "c"],
];

describe("graph content", () => {
  test("every link points at existing nodes and node ids are unique", () => {
    const ids = new Set(GRAPH_NODES.map((n) => n.id));
    expect(ids.size).toBe(GRAPH_NODES.length);
    for (const [from, to] of GRAPH_LINKS) {
      expect(ids.has(from), from).toBe(true);
      expect(ids.has(to), to).toBe(true);
    }
  });

  test("every node is connected to something", () => {
    for (const node of GRAPH_NODES) {
      expect(GRAPH_LINKS.some(([a, b]) => a === node.id || b === node.id), node.id).toBe(true);
    }
  });
});

describe("seedLayout", () => {
  test("is deterministic and places every node inside the box", () => {
    const first = seedLayout(["a", "b", "c"], SIZE);
    const second = seedLayout(["a", "b", "c"], SIZE);

    expect(first).toEqual(second);
    for (const node of first) {
      expect(node.x).toBeGreaterThan(0);
      expect(node.x).toBeLessThan(SIZE.width);
      expect(node.y).toBeGreaterThan(0);
      expect(node.y).toBeLessThan(SIZE.height);
    }
  });
});

describe("stepLayout", () => {
  test("returns new node objects without mutating the input", () => {
    const nodes = seedLayout(["a", "b", "c"], SIZE);
    const snapshot = structuredClone(nodes);

    const next = stepLayout(nodes, LINKS, SIZE);

    expect(nodes).toEqual(snapshot);
    expect(next).not.toBe(nodes);
    expect(next[0]).not.toBe(nodes[0]);
  });

  test("leaves pinned nodes where they are", () => {
    const nodes = seedLayout(["a", "b", "c"], SIZE).map((n, i): LayoutNode => (i === 0 ? { ...n, pinned: true } : n));

    const next = stepLayout(nodes, LINKS, SIZE);

    expect(next[0].x).toBe(nodes[0].x);
    expect(next[0].y).toBe(nodes[0].y);
  });

  test("settle converges to a stable layout that keeps nodes in bounds", () => {
    const settled = settle(seedLayout(["a", "b", "c"], SIZE), LINKS, SIZE, 400);
    const after = stepLayout(settled, LINKS, SIZE);

    const movement = after.reduce((sum, n, i) => sum + Math.hypot(n.x - settled[i].x, n.y - settled[i].y), 0);
    expect(movement).toBeLessThan(1);
    for (const node of settled) {
      expect(node.x).toBeGreaterThanOrEqual(0);
      expect(node.x).toBeLessThanOrEqual(SIZE.width);
    }
  });

  test("linked nodes end up closer than unlinked ones", () => {
    const settled = settle(seedLayout(["a", "b", "c"], SIZE), [["a", "b"]], SIZE, 400);
    const [a, b, c] = settled;

    expect(Math.hypot(a.x - b.x, a.y - b.y)).toBeLessThan(Math.hypot(a.x - c.x, a.y - c.y));
  });
});

describe("neighbours", () => {
  test("returns the node and everything directly linked to it", () => {
    expect([...neighbours("b", LINKS)].sort()).toEqual(["a", "b", "c"]);
    expect([...neighbours("a", LINKS)].sort()).toEqual(["a", "b"]);
  });
});

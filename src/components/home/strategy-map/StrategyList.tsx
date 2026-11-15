"use client";

import Link from "next/link";
import { GRAPH_LINKS, GRAPH_NODES, GRAPH_TYPES } from "@/content/graph";
import { neighbours } from "@/lib/forceGraph";
import { focusStrategyNode } from "./focus";

const LABELS = new Map(GRAPH_NODES.map((n) => [n.id, n.label]));

/** Text version of the strategy map for keyboard and screen-reader users (and anyone who prefers a list). */
export function StrategyList() {
  return (
    <details className="group rounded-xl border border-line px-4 py-3 text-sm">
      <summary className="cursor-pointer font-medium text-ink marker:text-accent">Browse the map as a list</summary>
      <div className="mt-4 grid gap-6 sm:grid-cols-2">
        {GRAPH_TYPES.map(({ type, label }) => (
          <section key={type} aria-label={label}>
            <h3 className="font-mono text-xs text-accent">{label}</h3>
            <ul className="mt-2 flex flex-col gap-2">
              {GRAPH_NODES.filter((n) => n.type === type).map((node) => {
                const linked = [...neighbours(node.id, GRAPH_LINKS)].filter((id) => id !== node.id).map((id) => LABELS.get(id));
                return (
                  <li
                    key={node.id}
                    onMouseEnter={() => focusStrategyNode(node.id)}
                    onMouseLeave={() => focusStrategyNode(null)}
                  >
                    {node.href ? (
                      <Link
                        href={node.href}
                        className="link-accent"
                        onFocus={() => focusStrategyNode(node.id)}
                        onBlur={() => focusStrategyNode(null)}
                      >
                        {node.label}
                      </Link>
                    ) : (
                      <span className="text-ink">{node.label}</span>
                    )}
                    <span className="block text-xs text-muted">Connected to {linked.join(", ")}</span>
                  </li>
                );
              })}
            </ul>
          </section>
        ))}
      </div>
    </details>
  );
}

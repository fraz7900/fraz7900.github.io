"use client";

import { useId, useRef, useState } from "react";

const MOVES: Record<string, (i: number, last: number) => number> = {
  ArrowRight: (i, last) => (i >= last ? 0 : i + 1),
  ArrowDown: (i, last) => (i >= last ? 0 : i + 1),
  ArrowLeft: (i, last) => (i <= 0 ? last : i - 1),
  ArrowUp: (i, last) => (i <= 0 ? last : i - 1),
  Home: () => 0,
  End: (_i, last) => last,
};

interface TabsProps<T> {
  readonly label: string;
  readonly items: readonly T[];
  readonly tabLabel: (item: T, index: number) => React.ReactNode;
  readonly keyOf: (item: T) => string;
  readonly renderPanel: (item: T, index: number) => React.ReactNode;
  /** "pills" for a role selector, "steps" for a numbered sequence. */
  readonly variant: "pills" | "steps";
}

/** Accessible tabs (ARIA tablist, roving focus, arrow/Home/End keys). All panels are server-rendered. */
export function Tabs<T>({ label, items, tabLabel, keyOf, renderPanel, variant }: TabsProps<T>) {
  const [active, setActive] = useState(0);
  const baseId = useId();
  const refs = useRef<(HTMLButtonElement | null)[]>([]);
  const last = items.length - 1;

  const select = (index: number, focus: boolean) => {
    setActive(index);
    if (focus) refs.current[index]?.focus();
  };

  return (
    <div className="flex flex-col gap-5">
      <div
        role="tablist"
        aria-label={label}
        onKeyDown={(event) => {
          const move = MOVES[event.key];
          if (!move) return;
          event.preventDefault();
          select(move(active, last), true);
        }}
        className={variant === "pills" ? "flex flex-wrap gap-2" : "-mx-4 flex gap-1 overflow-x-auto px-4 sm:mx-0 sm:px-0"}
      >
        {items.map((item, index) => {
          const selected = index === active;
          return (
            <button
              key={keyOf(item)}
              ref={(node) => {
                refs.current[index] = node;
              }}
              type="button"
              role="tab"
              id={`${baseId}-tab-${keyOf(item)}`}
              aria-selected={selected}
              aria-controls={`${baseId}-panel-${keyOf(item)}`}
              tabIndex={selected ? 0 : -1}
              onClick={() => select(index, false)}
              className={
                variant === "pills"
                  ? `rounded-full border px-4 py-2 text-sm font-medium transition-colors ${
                      selected ? "border-accent bg-accent text-paper" : "border-line-strong text-ink hover:border-accent/70"
                    }`
                  : `flex shrink-0 items-center gap-2 border-b-2 px-3 py-2 font-mono text-xs transition-colors ${
                      selected ? "border-accent text-accent" : "border-line text-muted hover:text-ink"
                    }`
              }
            >
              {tabLabel(item, index)}
            </button>
          );
        })}
      </div>
      {items.map((item, index) => (
        <div
          key={keyOf(item)}
          role="tabpanel"
          id={`${baseId}-panel-${keyOf(item)}`}
          aria-labelledby={`${baseId}-tab-${keyOf(item)}`}
          hidden={index !== active}
          className="min-w-0"
        >
          {renderPanel(item, index)}
        </div>
      ))}
    </div>
  );
}

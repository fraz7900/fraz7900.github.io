"use client";

import { useEffect, useState } from "react";
import { activeSectionIndex } from "@/lib/motion";

export interface RailSection {
  readonly id: string;
  readonly label: string;
}

/**
 * Dot rail on wide screens showing which homepage section you're in; each dot jumps to its
 * section, and its label appears on hover or keyboard focus.
 */
export function SectionRail({ sections }: { sections: readonly RailSection[] }) {
  const [active, setActive] = useState(0);

  useEffect(() => {
    let frame = 0;
    const update = () => {
      frame = 0;
      const tops = sections.map(({ id }) => document.getElementById(id)?.getBoundingClientRect().top ?? Infinity);
      setActive(activeSectionIndex(tops, window.innerHeight));
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [sections]);

  return (
    <nav aria-label="Page sections" className="fixed right-5 top-1/2 z-30 hidden -translate-y-1/2 xl:block">
      <ul className="flex flex-col items-end gap-3.5">
        {sections.map((section, index) => {
          const current = index === active;
          return (
            <li key={section.id}>
              <a
                href={`#${section.id}`}
                aria-current={current ? "true" : undefined}
                className="group flex items-center gap-3 rounded-full py-0.5 pl-2 font-mono text-xs"
              >
                <span
                  className={`rounded bg-paper/85 px-2 py-0.5 transition-opacity duration-200 ${
                    current ? "text-accent" : "text-muted"
                  } opacity-0 group-hover:opacity-100 group-focus-visible:opacity-100`}
                >
                  {section.label}
                </span>
                <span
                  aria-hidden="true"
                  className={`block rounded-full transition-all duration-300 ${
                    current ? "h-6 w-1.5 bg-accent" : "h-1.5 w-1.5 bg-line-strong group-hover:bg-muted"
                  }`}
                />
              </a>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}

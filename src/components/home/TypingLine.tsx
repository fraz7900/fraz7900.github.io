"use client";

import { useEffect, useRef } from "react";

const TYPE_MS = 55;
const ERASE_MS = 28;
const HOLD_MS = 1700;

/**
 * Types each phrase, holds, erases, moves on. Server render shows the first phrase,
 * reduced motion keeps it static, and screen readers get the full list once.
 */
export function TypingLine({ phrases }: { phrases: readonly string[] }) {
  const textRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const el = textRef.current;
    if (!el || phrases.length < 2) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let phrase = 0;
    let chars = phrases[0].length;
    let erasing = true;
    let timer = window.setTimeout(function tick() {
      if (erasing) {
        chars -= 1;
        if (chars <= 0) {
          erasing = false;
          phrase = (phrase + 1) % phrases.length;
        }
      } else {
        chars += 1;
      }
      el.textContent = phrases[phrase].slice(0, Math.max(chars, 0));
      const done = !erasing && chars >= phrases[phrase].length;
      if (done) erasing = true;
      timer = window.setTimeout(tick, done ? HOLD_MS : erasing ? ERASE_MS : TYPE_MS);
    }, HOLD_MS);

    return () => window.clearTimeout(timer);
  }, [phrases]);

  return (
    <p className="font-mono text-base text-ink sm:text-lg">
      <span className="sr-only">{phrases.join(", ")}</span>
      <span aria-hidden="true">
        <span className="text-accent">&gt; </span>
        <span ref={textRef}>{phrases[0]}</span>
        <span className="ml-1 inline-block h-[1.1em] w-[0.55em] translate-y-[0.18em] animate-blink bg-accent" />
      </span>
    </p>
  );
}

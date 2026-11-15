"use client";

import { Fragment, useEffect, useRef, useState } from "react";
import { DECODE_GLYPHS, decodeFrame, type DecodeChar } from "@/lib/motion";
import { useMotionPreferences } from "./useMotionPreferences";

const randomGlyph = () => DECODE_GLYPHS[Math.floor(Math.random() * DECODE_GLYPHS.length)];

/**
 * Text that briefly shows random symbols and resolves left to right the first time it scrolls into
 * view. Meant for short monospace labels, where swapping glyphs doesn't shift the layout. Screen
 * readers always get the real text; with reduced motion it never animates.
 */
export function DecodeText({ text, durationMs = 900 }: { text: string; durationMs?: number }) {
  const ref = useRef<HTMLSpanElement>(null);
  const [frame, setFrame] = useState<DecodeChar[] | null>(null);
  const { reducedMotion } = useMotionPreferences();

  useEffect(() => {
    const el = ref.current;
    if (!el || reducedMotion || !("IntersectionObserver" in window)) return;
    let raf = 0;
    const run = () => {
      const start = performance.now();
      const step = (now: number) => {
        const progress = (now - start) / durationMs;
        if (progress >= 1) {
          setFrame(null);
          return;
        }
        setFrame(decodeFrame(text, progress, randomGlyph));
        raf = requestAnimationFrame(step);
      };
      raf = requestAnimationFrame(step);
    };
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry?.isIntersecting) return;
        observer.disconnect();
        run();
      },
      { threshold: 0.6 },
    );
    observer.observe(el);
    return () => {
      observer.disconnect();
      cancelAnimationFrame(raf);
    };
  }, [text, durationMs, reducedMotion]);

  if (!frame) return <span ref={ref}>{text}</span>;
  return (
    <span ref={ref}>
      <span className="sr-only">{text}</span>
      <span aria-hidden="true">
        {frame.map((c, index) =>
          c.scrambled ? (
            <span key={index} className="text-accent/60">
              {c.char}
            </span>
          ) : (
            <Fragment key={index}>{c.char}</Fragment>
          ),
        )}
      </span>
    </span>
  );
}

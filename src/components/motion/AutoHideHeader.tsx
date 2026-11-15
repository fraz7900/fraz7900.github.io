"use client";

import { useEffect, useRef, useState } from "react";
import { nextHeaderHidden } from "@/lib/motion";

/**
 * Sticky header that slides away while you scroll down and comes back as soon as you scroll up,
 * or the moment anything inside it gets keyboard focus.
 */
export function AutoHideHeader({ children }: { children: React.ReactNode }) {
  const [hidden, setHidden] = useState(false);
  const hiddenRef = useRef(false);

  useEffect(() => {
    let lastY = window.scrollY;
    let frame = 0;
    const update = () => {
      frame = 0;
      const y = window.scrollY;
      const next = nextHeaderHidden(lastY, y, hiddenRef.current);
      lastY = y;
      if (next === hiddenRef.current) return;
      hiddenRef.current = next;
      setHidden(next);
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  const reveal = () => {
    hiddenRef.current = false;
    setHidden(false);
  };

  return (
    <header
      data-hidden={hidden}
      onFocusCapture={reveal}
      className="sticky top-0 z-40 border-b border-line/80 bg-paper/70 backdrop-blur-md transition-transform duration-300 ease-out data-[hidden=true]:-translate-y-full"
    >
      {children}
    </header>
  );
}

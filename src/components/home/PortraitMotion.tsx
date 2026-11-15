"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { useMotionPreferences } from "@/components/motion/useMotionPreferences";

const clamp = (value: number) => Math.max(-1, Math.min(1, value));

/**
 * Feeds the pointer's position to the vector portrait as --px / --py (each -1 to 1, measured from
 * the portrait's centre against half the viewport), so its figure and lights can shift at different
 * depths. Fine pointers with motion allowed only; otherwise the portrait stays still.
 */
export function PortraitMotion({ children }: { children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  const { pointerMotion } = useMotionPreferences();

  useEffect(() => {
    const el = ref.current;
    if (!el || !pointerMotion) return;
    let frame = 0;
    let pending: PointerEvent | null = null;

    const apply = () => {
      frame = 0;
      if (!pending) return;
      const box = el.getBoundingClientRect();
      const x = (pending.clientX - (box.left + box.width / 2)) / (window.innerWidth / 2);
      const y = (pending.clientY - (box.top + box.height / 2)) / (window.innerHeight / 2);
      el.style.setProperty("--px", clamp(x).toFixed(3));
      el.style.setProperty("--py", clamp(y).toFixed(3));
    };
    const onMove = (event: PointerEvent) => {
      if (event.pointerType === "touch") return;
      pending = event;
      if (!frame) frame = requestAnimationFrame(apply);
    };

    window.addEventListener("pointermove", onMove, { passive: true });
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("pointermove", onMove);
      el.style.removeProperty("--px");
      el.style.removeProperty("--py");
    };
  }, [pointerMotion]);

  return (
    <div ref={ref} className="portrait-vector size-full">
      {children}
    </div>
  );
}

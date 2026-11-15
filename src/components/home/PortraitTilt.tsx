"use client";

import { useEffect, useId, useRef, useSyncExternalStore, type CSSProperties, type ReactNode } from "react";
import { useMotionPreferences } from "@/components/motion/useMotionPreferences";
import { attachTilt } from "./tiltController";

const noSubscription = () => () => {};
/** True once hydrated: the static HTML never claims an interactivity that needs JavaScript. */
const useHydrated = () =>
  useSyncExternalStore(
    noSubscription,
    () => true,
    () => false,
  );

/**
 * The 3D stage for the vector portrait. attachTilt (tiltController.ts) turns the whole picture in
 * perspective with the pointer, drag and arrow keys, and a CSS animation adds a slow sway. With
 * reduced motion, or before JavaScript runs, it is a still image with no controls.
 */
export function PortraitTilt({ perspective, label, hint, children }: { perspective: number; label: string; hint: string; children: ReactNode }) {
  const stageRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<HTMLDivElement>(null);
  const hintId = useId();
  const { reducedMotion } = useMotionPreferences();
  const interactive = useHydrated() && !reducedMotion;

  useEffect(() => {
    const stage = stageRef.current;
    const scene = sceneRef.current;
    if (!stage || !scene || !interactive) return;
    return attachTilt(stage, scene);
  }, [interactive]);

  return (
    <div ref={stageRef} className="portrait-stage size-full" style={{ perspective: `${perspective}px` } as CSSProperties}>
      <div
        ref={sceneRef}
        role="img"
        aria-label={label}
        aria-describedby={interactive ? hintId : undefined}
        tabIndex={interactive ? 0 : undefined}
        data-interactive={interactive ? "" : undefined}
        className="portrait-scene size-full rounded-full"
      >
        {children}
      </div>
      {interactive && (
        <p id={hintId} className="sr-only">
          {hint}
        </p>
      )}
    </div>
  );
}

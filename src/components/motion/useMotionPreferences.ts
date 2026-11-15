"use client";

import { useSyncExternalStore } from "react";

const FINE_POINTER = "(pointer: fine)";
const REDUCED_MOTION = "(prefers-reduced-motion: reduce)";

function subscribeTo(query: string) {
  return (onChange: () => void) => {
    const list = window.matchMedia(query);
    list.addEventListener("change", onChange);
    return () => list.removeEventListener("change", onChange);
  };
}

const subscribeFinePointer = subscribeTo(FINE_POINTER);
const subscribeReducedMotion = subscribeTo(REDUCED_MOTION);
const finePointerNow = () => window.matchMedia(FINE_POINTER).matches;
const reducedMotionNow = () => window.matchMedia(REDUCED_MOTION).matches;
const offOnServer = () => false;

/**
 * Live pointer and motion preferences. Both read false in the static HTML, so effects only
 * switch on after hydration, and they follow the visitor's settings if those change.
 */
export function useMotionPreferences() {
  const finePointer = useSyncExternalStore(subscribeFinePointer, finePointerNow, offOnServer);
  const reducedMotion = useSyncExternalStore(subscribeReducedMotion, reducedMotionNow, offOnServer);
  return { finePointer, reducedMotion, pointerMotion: finePointer && !reducedMotion };
}

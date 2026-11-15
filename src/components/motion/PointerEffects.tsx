"use client";

import { useEffect } from "react";
import { magneticOffset, type Point } from "@/lib/motion";
import { useMotionPreferences } from "./useMotionPreferences";

const MAGNETIC = ".btn-primary, .btn-ghost";
const SPOTLIGHT = ".glass";

/**
 * Two delegated mouse effects, so no component has to opt in:
 * - spotlight: a glow on a card's border follows the pointer (fine pointers);
 * - magnetic: buttons lean slightly toward the pointer (fine pointers, motion allowed).
 */
export function PointerEffects() {
  const { finePointer, pointerMotion } = useMotionPreferences();

  useEffect(() => {
    if (!finePointer) return;
    const root = document.documentElement;
    const offsets = new WeakMap<HTMLElement, Point>();
    let magnet: HTMLElement | null = null;
    let pending: PointerEvent | null = null;
    let frame = 0;

    const release = () => {
      if (!magnet) return;
      magnet.style.removeProperty("--mag-x");
      magnet.style.removeProperty("--mag-y");
      offsets.delete(magnet);
      magnet = null;
    };

    const spotlight = (el: Element, event: PointerEvent) => {
      const card = el.closest<HTMLElement>(SPOTLIGHT);
      if (!card) return;
      const box = card.getBoundingClientRect();
      card.style.setProperty("--spot-x", `${event.clientX - box.left}px`);
      card.style.setProperty("--spot-y", `${event.clientY - box.top}px`);
    };

    const attract = (el: Element, event: PointerEvent) => {
      const button = el.closest<HTMLElement>(MAGNETIC);
      if (button !== magnet) release();
      if (!button) return;
      // Measure from where the button rests, not where it has already leaned to.
      const current = offsets.get(button) ?? { x: 0, y: 0 };
      const box = button.getBoundingClientRect();
      const rest = { left: box.left - current.x, top: box.top - current.y, width: box.width, height: box.height };
      const next = magneticOffset({ x: event.clientX, y: event.clientY }, rest);
      offsets.set(button, next);
      button.style.setProperty("--mag-x", `${next.x}px`);
      button.style.setProperty("--mag-y", `${next.y}px`);
      magnet = button;
    };

    const apply = () => {
      frame = 0;
      const event = pending;
      const el = event?.target instanceof Element ? event.target : null;
      if (!event || !el) return;
      spotlight(el, event);
      if (pointerMotion) attract(el, event);
    };

    const onMove = (event: PointerEvent) => {
      if (event.pointerType === "touch") return;
      pending = event;
      if (!frame) frame = requestAnimationFrame(apply);
    };
    const onLeave = (event: MouseEvent) => {
      if (!event.relatedTarget) release();
    };

    root.classList.add("fx-pointer");
    window.addEventListener("pointermove", onMove, { passive: true });
    document.addEventListener("mouseout", onLeave);
    return () => {
      cancelAnimationFrame(frame);
      release();
      root.classList.remove("fx-pointer");
      window.removeEventListener("pointermove", onMove);
      document.removeEventListener("mouseout", onLeave);
    };
  }, [finePointer, pointerMotion]);

  return null;
}

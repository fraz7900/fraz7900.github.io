"use client";

import { useEffect, useRef } from "react";
import { approach, isSettled, type Point } from "@/lib/motion";
import { useMotionPreferences } from "./useMotionPreferences";

const RING_EASE = 0.18;
/** The ring grows over anything you can click or drag. */
const INTERACTIVE = "a, button, summary, label, select, canvas, [role='button'], [role='tab'], [data-interactive], input[type='range'], input[type='checkbox'], input[type='radio']";
/** Text fields keep the system I-beam so you can see where you'll type. */
const NATIVE = "input:not([type='range']):not([type='checkbox']):not([type='radio']), textarea, [contenteditable='true']";

/** Dot that tracks the mouse plus a ring that trails it. Mouse and pen only; off with reduced motion. */
export function CustomCursor() {
  const { pointerMotion } = useMotionPreferences();
  return pointerMotion ? <CursorLayer /> : null;
}

function CursorLayer() {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const body = document.body;
    const setState = (name: string, on: boolean) => body.classList.toggle(name, on);
    let target: Point = { x: 0, y: 0 };
    let ring: Point = target;
    let seen = false;
    let frame = 0;

    const place = (el: HTMLDivElement | null, point: Point) => {
      if (el) el.style.translate = `${point.x}px ${point.y}px`;
    };
    const render = () => {
      ring = approach(ring, target, RING_EASE);
      place(dotRef.current, target);
      place(ringRef.current, ring);
      frame = isSettled(ring, target) ? 0 : requestAnimationFrame(render);
    };
    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(render);
    };

    const onMove = (event: PointerEvent) => {
      if (event.pointerType === "touch") {
        setState("cursor-hidden", true);
        return;
      }
      target = { x: event.clientX, y: event.clientY };
      if (!seen) {
        ring = target;
        seen = true;
      }
      const el = event.target instanceof Element ? event.target : null;
      setState("cursor-native", Boolean(el?.closest(NATIVE)));
      setState("cursor-hover", Boolean(el?.closest(INTERACTIVE)));
      setState("cursor-hidden", false);
      schedule();
    };
    const onDown = () => setState("cursor-down", true);
    const onUp = () => setState("cursor-down", false);
    const onLeave = (event: MouseEvent) => {
      if (!event.relatedTarget) setState("cursor-hidden", true);
    };

    body.classList.add("has-cursor", "cursor-hidden");
    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("pointerdown", onDown, { passive: true });
    window.addEventListener("pointerup", onUp, { passive: true });
    document.addEventListener("mouseout", onLeave);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerdown", onDown);
      window.removeEventListener("pointerup", onUp);
      document.removeEventListener("mouseout", onLeave);
      body.classList.remove("has-cursor", "cursor-hidden", "cursor-native", "cursor-hover", "cursor-down");
    };
  }, []);

  return (
    <div aria-hidden="true" className="cursor-layer">
      <div ref={ringRef} className="cursor-ring" />
      <div ref={dotRef} className="cursor-dot" />
    </div>
  );
}

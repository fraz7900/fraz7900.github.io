/**
 * Pointer tilt and parallax for the workbench scene. The pointer is read once per animation frame
 * and the result written to CSS variables on the stage (--wb-rx/--wb-ry in degrees, --wb-px/--wb-py
 * from -1 to 1); globals.css turns those into transforms. No React state changes while the pointer
 * moves. Only mouse and pen pointers count, only from tablet width up, and only over the scene: it
 * eases back to neutral when the pointer leaves. Callers attach this only without reduced motion.
 */

import type { Point } from "@/lib/motion";
import { NEUTRAL_MOTION, approachMotion, easeForElapsed, isMotionSettled, sceneMotion, type SceneMotion } from "@/lib/workbench";

const WIDE_SCENE = "(min-width: 768px)";
const VARS = ["--wb-rx", "--wb-ry", "--wb-px", "--wb-py"] as const;

export function attachSceneMotion(stage: HTMLElement): () => void {
  const wide = window.matchMedia(WIDE_SCENE);
  let current: SceneMotion = NEUTRAL_MOTION;
  let pointer: Point | null = null;
  let frame = 0;
  let last = 0;

  const render = () => {
    stage.style.setProperty("--wb-rx", current.rx.toFixed(3));
    stage.style.setProperty("--wb-ry", current.ry.toFixed(3));
    stage.style.setProperty("--wb-px", current.px.toFixed(3));
    stage.style.setProperty("--wb-py", current.py.toFixed(3));
  };
  const tick = (now: number) => {
    frame = 0;
    const target = pointer && wide.matches ? sceneMotion(pointer, stage.getBoundingClientRect()) : NEUTRAL_MOTION;
    const settled = isMotionSettled(current, target);
    current = settled ? target : approachMotion(current, target, easeForElapsed(last ? now - last : 1000 / 60));
    render();
    if (settled) last = 0;
    else {
      last = now;
      frame = requestAnimationFrame(tick);
    }
  };
  const wake = () => {
    if (!frame) frame = requestAnimationFrame(tick);
  };
  const onMove = (event: PointerEvent) => {
    if (event.pointerType === "touch") return;
    pointer = { x: event.clientX, y: event.clientY };
    wake();
  };
  const onLeave = () => {
    pointer = null;
    wake();
  };

  stage.addEventListener("pointermove", onMove, { passive: true });
  stage.addEventListener("pointerleave", onLeave);
  return () => {
    cancelAnimationFrame(frame);
    stage.removeEventListener("pointermove", onMove);
    stage.removeEventListener("pointerleave", onLeave);
    for (const name of VARS) stage.style.removeProperty(name);
  };
}

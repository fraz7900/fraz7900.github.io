/**
 * Wires the 3D portrait to the pointer and keyboard (used by PortraitTilt). Split into small parts
 * that share one spring loop:
 * - loop: integrates the springs once per frame and writes the pose (--rx/--ry), highlight (--gx/--gy)
 *   and shadow (--sx/--sy); it only runs while
 *   the pose is moving and the portrait is on screen in a visible tab;
 * - hover: mouse or pen near the portrait turns it to face the pointer (read once per frame, and
 *   re-checked on scroll, since the portrait can move under a still pointer);
 * - drag: any pointer, touch included, grabs and turns it; it springs back on release;
 * - keys: arrows turn it, Home or Escape reset, only when it has keyboard focus.
 * The idle sway is a CSS animation, so nothing here runs while nobody is interacting.
 */

import type { Point } from "@/lib/motion";
import { REST, dragTilt, inHoverZone, isTiltSettled, keyTilt, pointerTilt, stepTilt, type Tilt, type TiltState } from "@/lib/tilt";

type Mode = "rest" | "hover" | "drag" | "keys";

interface Loop {
  readonly target: () => Tilt;
  readonly mode: () => Mode;
  readonly set: (next: Tilt, mode: Mode) => void;
  readonly setVisible: (visible: boolean) => void;
  readonly stop: () => void;
}

/** How far the highlight slides across the face per degree of turn, in percent. */
const GLARE_PER_DEG = 1.8;
/** How far the drop shadow slides away from the turn, in px per degree. */
const SHADOW_PER_DEG = 0.9;
const SCENE_VARS = ["--rx", "--ry", "--gx", "--gy", "--sx", "--sy"] as const;

function createLoop(scene: HTMLElement): Loop {
  let state: TiltState = { rx: { value: 0, velocity: 0 }, ry: { value: 0, velocity: 0 } };
  let target: Tilt = REST;
  let mode: Mode = "rest";
  let visible = true;
  let frame = 0;
  let last = 0;

  const render = () => {
    const { value: rx } = state.rx;
    const { value: ry } = state.ry;
    scene.style.setProperty("--rx", `${rx.toFixed(2)}deg`);
    scene.style.setProperty("--ry", `${ry.toFixed(2)}deg`);
    scene.style.setProperty("--gx", `${(50 - ry * GLARE_PER_DEG).toFixed(1)}%`);
    scene.style.setProperty("--gy", `${(35 - rx * GLARE_PER_DEG).toFixed(1)}%`);
    scene.style.setProperty("--sx", `${(-ry * SHADOW_PER_DEG).toFixed(1)}px`);
    scene.style.setProperty("--sy", `${(rx * SHADOW_PER_DEG).toFixed(1)}px`);
  };
  const tick = (now: number) => {
    frame = 0;
    state = stepTilt(state, target, last ? (now - last) / 1000 : 0);
    last = now;
    render();
    if (visible && !isTiltSettled(state, target)) frame = requestAnimationFrame(tick);
    else last = 0;
  };
  const wake = () => {
    if (!frame && visible) frame = requestAnimationFrame(tick);
  };

  return {
    target: () => target,
    mode: () => mode,
    set: (next, nextMode) => {
      target = next;
      mode = nextMode;
      wake();
    },
    setVisible: (next) => {
      visible = next;
      wake();
    },
    stop: () => {
      cancelAnimationFrame(frame);
      for (const name of SCENE_VARS) scene.style.removeProperty(name);
    },
  };
}

/** Pauses the loop while the portrait is off screen or the tab is hidden. */
function watchVisibility(stage: HTMLElement, loop: Loop): () => void {
  let onScreen = true;
  let tabShown = document.visibilityState === "visible";
  const update = () => loop.setVisible(onScreen && tabShown);
  const observer = new IntersectionObserver((entries) => {
    onScreen = Boolean(entries.at(-1)?.isIntersecting); // the latest change wins
    update();
  });
  const onVisibility = () => {
    tabShown = document.visibilityState === "visible";
    update();
  };
  observer.observe(stage);
  document.addEventListener("visibilitychange", onVisibility);
  return () => {
    observer.disconnect();
    document.removeEventListener("visibilitychange", onVisibility);
  };
}

function trackHover(stage: HTMLElement, loop: Loop): () => void {
  let pointer: Point | null = null;
  let moved = false;
  let frame = 0;

  const evaluate = () => {
    frame = 0;
    // A drag owns the pose; a keyboard pose yields only to the pointer actually moving, not to a scroll.
    const yields = loop.mode() !== "drag" && (loop.mode() !== "keys" || moved);
    moved = false;
    if (!yields) return;
    const box = stage.getBoundingClientRect();
    if (pointer && inHoverZone(pointer, box)) loop.set(pointerTilt(pointer, box), "hover");
    else if (loop.mode() === "hover") loop.set(REST, "rest");
  };
  const schedule = () => {
    if (!frame) frame = requestAnimationFrame(evaluate);
  };
  const onMove = (event: PointerEvent) => {
    if (event.pointerType === "touch") return;
    pointer = { x: event.clientX, y: event.clientY };
    moved = true;
    schedule();
  };
  const onOut = (event: PointerEvent) => {
    if (event.relatedTarget) return;
    pointer = null; // left the window: no more moves will come
    schedule();
  };

  window.addEventListener("pointermove", onMove, { passive: true });
  window.addEventListener("pointerout", onOut);
  window.addEventListener("scroll", schedule, { passive: true });
  return () => {
    cancelAnimationFrame(frame);
    window.removeEventListener("pointermove", onMove);
    window.removeEventListener("pointerout", onOut);
    window.removeEventListener("scroll", schedule);
  };
}

function enableDrag(stage: HTMLElement, scene: HTMLElement, loop: Loop): () => void {
  let drag: { id: number; origin: Point; start: Tilt } | null = null;

  const onDown = (event: PointerEvent) => {
    if (event.button !== 0) return;
    drag = { id: event.pointerId, origin: { x: event.clientX, y: event.clientY }, start: loop.target() };
    scene.setPointerCapture(event.pointerId);
    loop.set(drag.start, "drag");
  };
  const onMove = (event: PointerEvent) => {
    if (drag?.id !== event.pointerId) return;
    const delta = { x: event.clientX - drag.origin.x, y: event.clientY - drag.origin.y };
    loop.set(dragTilt(drag.start, delta, stage.getBoundingClientRect()), "drag");
  };
  // Released or taken over by a scroll: spring back, keeping the drag's momentum on the way.
  const onRelease = (event: PointerEvent) => {
    if (drag?.id !== event.pointerId) return;
    drag = null;
    loop.set(REST, "rest");
  };

  scene.addEventListener("pointerdown", onDown);
  scene.addEventListener("pointermove", onMove);
  scene.addEventListener("pointerup", onRelease);
  scene.addEventListener("pointercancel", onRelease);
  return () => {
    scene.removeEventListener("pointerdown", onDown);
    scene.removeEventListener("pointermove", onMove);
    scene.removeEventListener("pointerup", onRelease);
    scene.removeEventListener("pointercancel", onRelease);
  };
}

function enableKeys(scene: HTMLElement, loop: Loop): () => void {
  // Focus from a click or drag shouldn't capture the page's arrow keys or Home. (:focus-visible
  // can't tell: Chromium turns it on at the very keydown we'd be checking.)
  let focusedByPointer = false;
  const onPointerDown = () => {
    focusedByPointer = true;
  };
  const onKey = (event: KeyboardEvent) => {
    // Never with modifiers, so shortcuts such as Alt+Left still reach the browser.
    if (focusedByPointer || event.altKey || event.ctrlKey || event.metaKey || event.shiftKey) return;
    const next = keyTilt(loop.target(), event.key);
    if (!next) return;
    event.preventDefault();
    loop.set(next, next === REST ? "rest" : "keys");
  };
  const onBlur = () => {
    focusedByPointer = false;
    if (loop.mode() === "keys") loop.set(REST, "rest");
  };
  scene.addEventListener("pointerdown", onPointerDown);
  scene.addEventListener("keydown", onKey);
  scene.addEventListener("blur", onBlur);
  return () => {
    scene.removeEventListener("pointerdown", onPointerDown);
    scene.removeEventListener("keydown", onKey);
    scene.removeEventListener("blur", onBlur);
  };
}

/** Attaches every behaviour; returns one function that detaches them and clears the pose. */
export function attachTilt(stage: HTMLElement, scene: HTMLElement): () => void {
  const loop = createLoop(scene);
  const detach = [watchVisibility(stage, loop), trackHover(stage, loop), enableDrag(stage, scene, loop), enableKeys(scene, loop)];
  return () => {
    for (const off of detach) off();
    loop.stop();
  };
}

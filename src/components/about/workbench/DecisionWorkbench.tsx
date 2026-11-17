"use client";

import { useCallback, useEffect, useId, useMemo, useRef, useState, type KeyboardEvent } from "react";
import { useHydrated, useMotionPreferences } from "@/components/motion/useMotionPreferences";
import { WORKBENCH_AREAS, areaById, type AreaId, type PracticeAreaId } from "@/content/workbench";
import { AREA_IDS, PRACTICE_IDS, linkState, objectState, previewArea, stepStage, type WorkbenchFocus } from "@/lib/workbench";
import { attachSceneMotion } from "./sceneMotion";
import { WorkbenchControls } from "./WorkbenchControls";
import { WorkbenchDetail } from "./WorkbenchDetail";
import { WorkbenchScene } from "./WorkbenchScene";

const RESEARCH_STEPS = areaById("research").steps;

function caption(focus: WorkbenchFocus): string {
  const shown = previewArea(focus) ?? focus.selected;
  if (!shown) return "hover or tab to an object to preview it · click, Enter or Space opens it";
  const area = areaById(shown);
  return `${area.title.toLowerCase()}: ${area.steps.map((step) => step.name.toLowerCase()).join(" → ")}`;
}

/**
 * The About page's Decision Workbench. Owns the interaction state: hover and focus preview an
 * area, a click, Enter or Space selects it (selecting it again, Escape or "Reset exploration"
 * returns to the overview). The scene is decorative; the buttons and the detail panel carry
 * everything. The static HTML is the overview with plain labels in place of the buttons, so
 * without JavaScript it reads as a complete text version and offers no controls that do nothing.
 */
export function DecisionWorkbench() {
  const idPrefix = useId().replace(/[^a-zA-Z0-9_-]/g, "");
  const detailId = `${idPrefix}-detail`;
  const [hovered, setHovered] = useState<AreaId | null>(null);
  const [focused, setFocused] = useState<AreaId | null>(null);
  const [selected, setSelected] = useState<AreaId | null>(null);
  const [stage, setStage] = useState(0);
  const [lens, setLens] = useState<PracticeAreaId | null>(null);
  const [announcement, setAnnouncement] = useState("");
  const stageRef = useRef<HTMLDivElement>(null);
  const { pointerMotion } = useMotionPreferences();
  const interactive = useHydrated();

  useEffect(() => {
    const stageElement = stageRef.current;
    if (!stageElement || !pointerMotion) return;
    return attachSceneMotion(stageElement);
  }, [pointerMotion]);

  const focus = useMemo<WorkbenchFocus>(() => ({ hovered, focused, selected, lens }), [hovered, focused, selected, lens]);
  const states = useMemo(() => Object.fromEntries(AREA_IDS.map((id) => [id, objectState(id, focus)])) as Record<AreaId, ReturnType<typeof objectState>>, [focus]);
  const linkStates = useMemo(
    () => Object.fromEntries(PRACTICE_IDS.map((id) => [id, linkState(id, focus)])) as Record<PracticeAreaId, ReturnType<typeof linkState>>,
    [focus],
  );

  const reset = useCallback(() => {
    setSelected(null);
    setLens(null);
    setAnnouncement("Overview restored.");
  }, []);

  const select = useCallback(
    (id: AreaId) => {
      if (selected === id) {
        reset();
        return;
      }
      setSelected(id);
      setLens(null);
      if (id === "research") setStage(0);
      setAnnouncement(`${areaById(id).title} details shown.`);
    },
    [selected, reset],
  );

  const goToStage = useCallback((next: number) => {
    const index = stepStage(next, 0, RESEARCH_STEPS.length);
    setStage(index);
    setAnnouncement(`Stage ${index + 1} of ${RESEARCH_STEPS.length}: ${RESEARCH_STEPS[index].name}.`);
  }, []);

  const toggleLens = useCallback((id: PracticeAreaId) => setLens((current) => (current === id ? null : id)), []);

  const onKeyDown = (event: KeyboardEvent) => {
    if (event.key === "Escape" && selected !== null) reset();
  };

  return (
    <div
      className="wb-root grid grid-cols-[minmax(0,1fr)] gap-6 lg:grid-cols-[minmax(0,7fr)_minmax(0,5fr)] lg:items-start lg:gap-8"
      data-stage={selected === "research" ? RESEARCH_STEPS[stage].name.toLowerCase() : undefined}
      onKeyDown={onKeyDown}
    >
      {/* Stays in view on wide screens while the (often taller) detail panel is read. */}
      <div className="flex min-w-0 flex-col gap-3 lg:sticky lg:top-24">
        <div ref={stageRef} className="wb-stage" data-motion={pointerMotion ? "" : undefined}>
          <div className="wb-tilt relative">
            <WorkbenchScene states={states} linkStates={linkStates} />
            <WorkbenchControls
              interactive={interactive}
              areas={WORKBENCH_AREAS}
              selected={selected}
              detailId={detailId}
              idPrefix={idPrefix}
              onSelect={select}
              onHover={setHovered}
              onFocusArea={setFocused}
            />
          </div>
        </div>
        <p aria-hidden="true" className="hidden min-h-10 font-mono text-xs leading-5 text-muted md:block">
          <span className="text-accent">&gt;</span> {caption(focus)}
        </p>
      </div>
      <WorkbenchDetail
        interactive={interactive}
        id={detailId}
        headingId={`${idPrefix}-detail-title`}
        selected={selected}
        stage={stage}
        lens={lens}
        onStage={goToStage}
        onLens={toggleLens}
        onReset={reset}
      />
      <p className="sr-only" aria-live="polite">
        {announcement}
      </p>
    </div>
  );
}

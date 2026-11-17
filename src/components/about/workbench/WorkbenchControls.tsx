import { Fragment, type CSSProperties, type FocusEvent, type PointerEvent } from "react";
import type { AreaId, WorkbenchArea } from "@/content/workbench";
import { WIDE_REGIONS, regionStyle } from "./layout";

interface ControlsProps {
  /** False in the static HTML: the areas render as plain labels until JavaScript can act on them. */
  readonly interactive: boolean;
  readonly areas: readonly WorkbenchArea[];
  readonly selected: AreaId | null;
  readonly detailId: string;
  readonly idPrefix: string;
  readonly onSelect: (id: AreaId) => void;
  readonly onHover: (id: AreaId | null) => void;
  readonly onFocusArea: (id: AreaId | null) => void;
}

/** Touch has no hover: a tap is a selection, never a lingering preview. */
const isHoverPointer = (event: PointerEvent) => event.pointerType !== "touch";
/** Keyboard focus previews an area; focus that comes from a click or tap doesn't linger as one. */
const isKeyboardFocus = (event: FocusEvent<HTMLElement>) => event.currentTarget.matches(":focus-visible");

/**
 * One native toggle button per area. From tablet width up each button covers its object on the
 * scene, with its label pinned above or below it; on phones the same buttons form a numbered
 * list beneath the scene. Either way there's one set of controls, in one tab order.
 */
export function WorkbenchControls({ interactive, areas, selected, detailId, idPrefix, onSelect, onHover, onFocusArea }: ControlsProps) {
  return (
    <ul aria-label="Areas on the workbench" className="wb-controls mt-5 flex flex-col gap-2 md:absolute md:inset-0 md:mt-0 md:block">
      {areas.map((area) => {
        const region = WIDE_REGIONS[area.id];
        const stepsId = `${idPrefix}-${area.id}-steps`;
        const titleId = `${idPrefix}-${area.id}-title`;
        const Target = interactive ? "button" : "span";
        return (
          <li
            key={area.id}
            style={regionStyle(region) as CSSProperties}
            className="md:absolute md:top-(--wb-y) md:left-(--wb-x) md:h-(--wb-h) md:w-(--wb-w)"
          >
            <Target
              data-area={area.id}
              data-chip={region.chip}
              {...(interactive && {
                type: "button" as const,
                "aria-pressed": selected === area.id,
                "aria-controls": detailId,
                "aria-labelledby": titleId,
                "aria-describedby": stepsId,
                onClick: () => onSelect(area.id),
                onPointerEnter: (event: PointerEvent) => isHoverPointer(event) && onHover(area.id),
                onPointerLeave: (event: PointerEvent) => isHoverPointer(event) && onHover(null),
                onFocus: (event: FocusEvent<HTMLElement>) => isKeyboardFocus(event) && onFocusArea(area.id),
                onBlur: () => onFocusArea(null),
              })}
              className="wb-target group flex min-h-14 w-full items-center gap-3 rounded-xl border border-line bg-card/60 px-4 py-3 text-left hover:border-line-strong focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent aria-pressed:border-accent aria-pressed:bg-accent-soft/40 motion-safe:transition-colors md:relative md:block md:size-full md:rounded-2xl md:border-0 md:bg-transparent md:p-0 md:aria-pressed:bg-transparent"
            >
              <span
                aria-hidden="true"
                className="grid size-8 shrink-0 place-items-center rounded-full border border-accent/70 font-mono text-sm text-ink md:hidden"
              >
                {Number(area.index)}
              </span>
              <span className="flex min-w-0 flex-1 flex-col gap-0.5 md:contents">
                <span className="wb-chip flex items-center gap-2 font-display text-base font-medium text-ink md:absolute md:left-1/2 md:-translate-x-1/2 md:rounded-full md:border md:border-line-strong md:bg-paper/85 md:px-3 md:py-1.5 md:text-sm md:whitespace-nowrap md:shadow-[0_8px_24px_-12px_rgb(0_0_0/0.8)] md:backdrop-blur-sm md:group-hover:border-accent/70 md:group-focus-visible:border-accent md:group-aria-pressed:border-accent md:group-aria-pressed:bg-accent-soft md:group-data-[chip=bottom]:bottom-1 md:group-data-[chip=top]:top-1 motion-safe:md:transition-colors">
                  <span aria-hidden="true" className="wb-pip text-accent" />
                  <span id={titleId}>{area.title}</span>
                </span>
                <span id={stepsId} className="text-sm leading-snug text-muted md:sr-only">
                  {area.steps.map((step, index) => (
                    <Fragment key={step.name}>
                      {index > 0 && (
                        <>
                          <span aria-hidden="true"> → </span>
                          <span className="sr-only">, </span>
                        </>
                      )}
                      {step.name}
                    </Fragment>
                  ))}
                </span>
              </span>
            </Target>
          </li>
        );
      })}
    </ul>
  );
}

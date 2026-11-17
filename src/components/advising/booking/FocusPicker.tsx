"use client";

import type { BookingFocus, FocusId } from "@/content/advising/bookingFocus";

/**
 * The four focuses as a native radio group: arrow keys move between cards, Space selects,
 * and screen readers announce "radio, 1 of 4". The whole card is the click target.
 */
export function FocusPicker({
  focuses,
  selected,
  onSelect,
}: {
  focuses: readonly BookingFocus[];
  selected: FocusId | null;
  onSelect: (id: FocusId) => void;
}) {
  return (
    <fieldset className="min-w-0">
      <legend className="eyebrow flex items-center gap-3 lowercase">
        <span aria-hidden="true" className="h-px w-8 bg-accent/70" />
        <span>
          <span className="text-faint">01 </span>
          {"// choose a focus"}
        </span>
      </legend>
      <div className="mt-5 grid grid-cols-[minmax(0,1fr)] gap-3 sm:grid-cols-2 lg:grid-cols-[minmax(0,1fr)]">
        {focuses.map((focus, index) => {
          const titleId = `focus-${focus.id}-title`;
          const taglineId = `focus-${focus.id}-tagline`;
          return (
            <label
              key={focus.id}
              className="glass group flex cursor-pointer items-start gap-4 rounded-xl p-4 hover:border-line-strong has-[:checked]:border-accent has-[:checked]:bg-accent-soft/40 has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-accent motion-safe:transition-colors motion-safe:duration-200 sm:p-5"
            >
              <input
                type="radio"
                name="booking-focus"
                value={focus.id}
                checked={selected === focus.id}
                onChange={() => onSelect(focus.id)}
                aria-labelledby={titleId}
                aria-describedby={taglineId}
                className="sr-only"
              />
              <span aria-hidden="true" className="pt-1 font-mono text-xs text-faint group-has-[:checked]:text-accent">
                {String(index + 1).padStart(2, "0")}
              </span>
              <span className="flex min-w-0 flex-col gap-1">
                <span id={titleId} className="font-display text-lg font-semibold text-ink">
                  {focus.title}
                </span>
                <span id={taglineId} className="text-sm leading-relaxed text-muted">
                  {focus.tagline}
                </span>
              </span>
              <span
                aria-hidden="true"
                className="mt-1.5 ml-auto grid size-4 shrink-0 place-items-center rounded-full border border-line-strong group-has-[:checked]:border-accent motion-safe:transition-colors"
              >
                <span className="size-2 rounded-full bg-accent opacity-0 group-has-[:checked]:opacity-100 motion-safe:transition-opacity" />
              </span>
            </label>
          );
        })}
      </div>
    </fieldset>
  );
}

"use client";

import { useId, useRef, useState } from "react";
import { STEPS, type MockupKey, type WalkthroughStep } from "@/content/caretrak";
import { Pin } from "./mockup-kit";
import { CodingReview } from "./mockups/CodingReview";
import { EvaluationScorecard } from "./mockups/EvaluationScorecard";
import { IntegrationFlow } from "./mockups/IntegrationFlow";
import { OpsDashboard } from "./mockups/OpsDashboard";
import { ReadinessTracker } from "./mockups/ReadinessTracker";

const MOCKUPS: Record<MockupKey, () => React.ReactElement> = {
  integration: IntegrationFlow,
  readiness: ReadinessTracker,
  evaluation: EvaluationScorecard,
  review: CodingReview,
  operations: OpsDashboard,
};

const NAV_KEYS: Record<string, (index: number, last: number) => number> = {
  ArrowDown: (i, last) => (i >= last ? 0 : i + 1),
  ArrowRight: (i, last) => (i >= last ? 0 : i + 1),
  ArrowUp: (i, last) => (i <= 0 ? last : i - 1),
  ArrowLeft: (i, last) => (i <= 0 ? last : i - 1),
  Home: () => 0,
  End: (_i, last) => last,
};

export function CaseWalkthrough() {
  const [active, setActive] = useState(0);
  const baseId = useId();
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const last = STEPS.length - 1;

  const select = (index: number, focus: boolean) => {
    setActive(index);
    if (focus) tabRefs.current[index]?.focus();
  };

  const onKeyDown = (event: React.KeyboardEvent) => {
    const move = NAV_KEYS[event.key];
    if (!move) return;
    event.preventDefault();
    select(move(active, last), true);
  };

  return (
    <div className="grid gap-6 lg:grid-cols-[17rem_minmax(0,1fr)] lg:gap-10">
      <div
        role="tablist"
        aria-label="Walkthrough steps"
        aria-orientation="vertical"
        onKeyDown={onKeyDown}
        className="-mx-4 flex gap-2 overflow-x-auto px-4 pb-1 lg:sticky lg:top-6 lg:mx-0 lg:flex-col lg:self-start lg:overflow-visible lg:px-0"
      >
        {STEPS.map((step, index) => (
          <button
            key={step.id}
            ref={(node) => {
              tabRefs.current[index] = node;
            }}
            type="button"
            role="tab"
            id={`${baseId}-tab-${step.id}`}
            aria-selected={index === active}
            aria-controls={`${baseId}-panel-${step.id}`}
            tabIndex={index === active ? 0 : -1}
            onClick={() => select(index, false)}
            className={`flex shrink-0 items-start gap-3 rounded-md border px-3 py-2.5 text-left transition-colors lg:shrink ${
              index === active
                ? "border-ink bg-card text-ink"
                : "border-transparent text-muted hover:border-line hover:text-ink"
            }`}
          >
            <span
              className={`flex size-6 shrink-0 items-center justify-center rounded-full text-xs font-semibold ${
                index === active ? "bg-ink text-paper" : "bg-line/70 text-ink"
              }`}
            >
              {index + 1}
            </span>
            <span className="flex flex-col">
              <span className="text-sm font-medium whitespace-nowrap lg:whitespace-normal">{step.title}</span>
              <span className="hidden text-xs leading-snug text-muted lg:block">{step.summary}</span>
            </span>
          </button>
        ))}
      </div>

      {STEPS.map((step, index) => (
        <StepPanel
          key={step.id}
          step={step}
          index={index}
          total={STEPS.length}
          hidden={index !== active}
          panelId={`${baseId}-panel-${step.id}`}
          tabId={`${baseId}-tab-${step.id}`}
          onNavigate={(target) => select(target, true)}
        />
      ))}
    </div>
  );
}

interface StepPanelProps {
  readonly step: WalkthroughStep;
  readonly index: number;
  readonly total: number;
  readonly hidden: boolean;
  readonly panelId: string;
  readonly tabId: string;
  readonly onNavigate: (index: number) => void;
}

function StepPanel({ step, index, total, hidden, panelId, tabId, onNavigate }: StepPanelProps) {
  const Mockup = MOCKUPS[step.mockup];

  return (
    <div role="tabpanel" id={panelId} aria-labelledby={tabId} hidden={hidden} className="flex min-w-0 flex-col gap-6">
      <div>
        <p className="text-sm text-muted">
          Step {index + 1} of {total}
        </p>
        <h3 className="mt-1 font-display text-3xl text-ink sm:text-4xl">{step.title}</h3>
      </div>

      <figure className="flex flex-col gap-2">
        <Mockup />
        <figcaption className="text-xs text-muted">{step.mockupLabel}. Original illustration, synthetic data.</figcaption>
      </figure>

      <div className="grid gap-6 md:grid-cols-2">
        <div>
          <h4 className="text-sm font-semibold text-ink">What I did</h4>
          <ul className="mt-2 flex list-disc flex-col gap-2 pl-5 text-[0.9375rem] leading-relaxed text-ink">
            {step.myWork.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </div>
        <div>
          <h4 className="text-sm font-semibold text-ink">What you’re looking at</h4>
          <ol className="mt-2 flex flex-col gap-2 text-[0.9375rem] leading-relaxed text-ink">
            {step.notes.map((note) => (
              <li key={note.pin} className="flex gap-2.5">
                <Pin n={note.pin} />
                <span>
                  <span className="sr-only">Marker {note.pin}: </span>
                  {note.text}
                </span>
              </li>
            ))}
          </ol>
        </div>
      </div>

      <p className="border-l-2 border-accent pl-4 text-[0.9375rem] leading-relaxed text-ink">
        <span className="font-semibold">Why it matters. </span>
        {step.whyItMatters}
      </p>

      <div className="flex flex-wrap justify-between gap-3 border-t border-line pt-4 text-sm">
        {index > 0 ? (
          <button type="button" className="link-accent" onClick={() => onNavigate(index - 1)}>
            Previous: {stepTitle(index - 1)}
          </button>
        ) : (
          <span />
        )}
        {index < total - 1 && (
          <button type="button" className="link-accent" onClick={() => onNavigate(index + 1)}>
            Next: {stepTitle(index + 1)}
          </button>
        )}
      </div>
    </div>
  );
}

function stepTitle(index: number): string {
  return STEPS[index].title;
}

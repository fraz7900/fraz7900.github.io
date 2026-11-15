"use client";

import { useId, useRef, useState } from "react";
import type { WalkthroughStep } from "@/content/walkthrough";
import { Pin } from "./mockup-kit";

const NAV_KEYS: Record<string, (index: number, last: number) => number> = {
  ArrowDown: (i, last) => (i >= last ? 0 : i + 1),
  ArrowRight: (i, last) => (i >= last ? 0 : i + 1),
  ArrowUp: (i, last) => (i <= 0 ? last : i - 1),
  ArrowLeft: (i, last) => (i <= 0 ? last : i - 1),
  Home: () => 0,
  End: (_i, last) => last,
};

interface CaseWalkthroughProps {
  readonly steps: readonly WalkthroughStep[];
  /** One pre-rendered visual per step, in the same order as `steps`. */
  readonly visuals: readonly React.ReactNode[];
  /** Appended to every visual's caption, e.g. "Original illustration, synthetic data." */
  readonly captionSuffix: string;
}

export function CaseWalkthrough({ steps, visuals, captionSuffix }: CaseWalkthroughProps) {
  const [active, setActive] = useState(0);
  const baseId = useId();
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const last = steps.length - 1;

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
    <div className="grid grid-cols-[minmax(0,1fr)] gap-6 lg:grid-cols-[17rem_minmax(0,1fr)] lg:gap-10">
      <div
        role="tablist"
        aria-label="Walkthrough steps"
        aria-orientation="vertical"
        onKeyDown={onKeyDown}
        className="-mx-4 flex gap-2 overflow-x-auto px-4 pb-1 lg:sticky lg:top-24 lg:mx-0 lg:flex-col lg:self-start lg:overflow-visible lg:px-0"
      >
        {steps.map((step, index) => (
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
            className={`flex shrink-0 items-start gap-3 rounded-lg border px-3 py-2.5 text-left transition-colors lg:shrink ${
              index === active
                ? "border-accent/60 bg-card/80 text-ink"
                : "border-transparent text-muted hover:border-line-strong hover:text-ink"
            }`}
          >
            <span
              className={`flex size-6 shrink-0 items-center justify-center rounded-full font-mono text-xs font-semibold ${
                index === active ? "bg-accent text-paper" : "bg-line-strong text-ink"
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

      {steps.map((step, index) => (
        <StepPanel
          key={step.id}
          step={step}
          visual={visuals[index]}
          captionSuffix={captionSuffix}
          index={index}
          total={steps.length}
          prevTitle={steps[index - 1]?.title}
          nextTitle={steps[index + 1]?.title}
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
  readonly visual: React.ReactNode;
  readonly captionSuffix: string;
  readonly index: number;
  readonly total: number;
  readonly prevTitle?: string;
  readonly nextTitle?: string;
  readonly hidden: boolean;
  readonly panelId: string;
  readonly tabId: string;
  readonly onNavigate: (index: number) => void;
}

function StepPanel(props: StepPanelProps) {
  const { step, visual, captionSuffix, index, total, prevTitle, nextTitle, hidden, panelId, tabId, onNavigate } = props;

  return (
    <div role="tabpanel" id={panelId} aria-labelledby={tabId} hidden={hidden} className="flex min-w-0 flex-col gap-6">
      <div>
        <p className="eyebrow">
          step {index + 1} of {total}
        </p>
        <h3 className="mt-2 font-display text-3xl font-semibold text-ink sm:text-4xl">{step.title}</h3>
      </div>

      <figure className="flex flex-col gap-2">
        {visual}
        <figcaption className="text-xs text-faint">
          {step.mockupLabel}. {captionSuffix}
        </figcaption>
      </figure>

      <div className="grid gap-6 md:grid-cols-2">
        <div>
          <h4 className="font-mono text-xs text-accent">What I did</h4>
          <ul className="mt-3 flex list-disc flex-col gap-2 pl-5 text-[0.9375rem] leading-relaxed text-ink/90 marker:text-accent">
            {step.myWork.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </div>
        <div>
          <h4 className="font-mono text-xs text-accent">What you’re looking at</h4>
          <ol className="mt-3 flex flex-col gap-2 text-[0.9375rem] leading-relaxed text-ink/90">
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

      <p className="glass rounded-lg border-l-2 border-l-accent px-4 py-3 text-[0.9375rem] leading-relaxed text-ink/90">
        <span className="font-semibold text-ink">Why it matters. </span>
        {step.whyItMatters}
      </p>

      <div className="flex flex-wrap justify-between gap-3 border-t border-line pt-4 text-sm">
        {prevTitle ? (
          <button type="button" className="link-accent" onClick={() => onNavigate(index - 1)}>
            Previous: {prevTitle}
          </button>
        ) : (
          <span />
        )}
        {nextTitle && (
          <button type="button" className="link-accent" onClick={() => onNavigate(index + 1)}>
            Next: {nextTitle}
          </button>
        )}
      </div>
    </div>
  );
}

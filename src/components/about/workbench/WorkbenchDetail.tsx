import Link from "next/link";
import { Fragment } from "react";
import {
  PRACTICE_AREAS,
  RESEARCH_INFORMS,
  SCENE_DESCRIPTION,
  WORKBENCH_AREAS,
  areaById,
  type AreaId,
  type PracticeAreaId,
  type WorkbenchArea,
  type WorkbenchLink,
} from "@/content/workbench";

interface DetailProps {
  /** False in the static HTML, where the overview stands alone and there is nothing to reset. */
  readonly interactive: boolean;
  readonly id: string;
  readonly headingId: string;
  readonly selected: AreaId | null;
  readonly stage: number;
  readonly lens: PracticeAreaId | null;
  readonly onStage: (stage: number) => void;
  readonly onLens: (lens: PracticeAreaId) => void;
  readonly onReset: () => void;
}

/** Steps joined by arrows on screen and by commas for screen readers. */
function StepTrail({ names }: { names: readonly string[] }) {
  return (
    <>
      {names.map((name, index) => (
        <Fragment key={name}>
          {index > 0 && (
            <>
              <span aria-hidden="true" className="text-faint">
                {" → "}
              </span>
              <span className="sr-only">, </span>
            </>
          )}
          {name}
        </Fragment>
      ))}
    </>
  );
}

function Links({ links }: { links: readonly WorkbenchLink[] }) {
  return (
    <ul className="flex flex-col gap-1.5 text-sm">
      {links.map((link) => (
        <li key={link.href}>
          <Link href={link.href} className="link-accent">
            {link.label}
          </Link>
        </li>
      ))}
    </ul>
  );
}

function Heading({ area, headingId }: { area: WorkbenchArea; headingId: string }) {
  return (
    <div className="flex flex-col gap-2">
      <p className="eyebrow lowercase">
        <span className="text-faint">{area.index}</span> {"// "}
        {area.tag}
      </p>
      <h3 id={headingId} className="font-display text-2xl font-semibold tracking-tight text-ink">
        {area.title}
      </h3>
      <p className="text-sm text-muted">On the bench: {area.objects}.</p>
    </div>
  );
}

function Overview({ headingId }: { headingId: string }) {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-2">
        <p className="eyebrow lowercase">{"// overview"}</p>
        <h3 id={headingId} className="font-display text-2xl font-semibold tracking-tight text-ink">
          One notebook, four settings
        </h3>
      </div>
      <p className="text-sm leading-relaxed text-muted">{SCENE_DESCRIPTION}</p>
      <ul className="flex flex-col divide-y divide-line border-y border-line">
        {WORKBENCH_AREAS.map((area) => (
          <li key={area.id} className="flex flex-col gap-1 py-2.5">
            <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
              <p className="font-display font-medium text-ink">
                <span className="font-mono text-xs text-accent">{area.index}</span> {area.title}
              </p>
              <Link href={area.links[0].href} className="link-accent text-sm">
                {area.links[0].label}
              </Link>
            </div>
            {/* On phones the numbered selectors above already show each process. */}
            <p className="hidden text-sm text-muted md:block">
              <StepTrail names={area.steps.map((step) => step.name)} />
            </p>
          </li>
        ))}
      </ul>
    </div>
  );
}

function PracticeDetail({ area, headingId }: { area: WorkbenchArea; headingId: string }) {
  return (
    <div className="flex flex-col gap-5">
      <Heading area={area} headingId={headingId} />
      <p className="leading-relaxed text-ink/90">{area.purpose}</p>
      {area.example && (
        <div className="flex flex-col gap-1 border-l-2 border-accent/60 pl-4">
          <p className="font-mono text-xs text-accent">example</p>
          <p className="font-display font-medium text-ink">{area.example.title}</p>
          <p className="text-sm text-muted">{area.example.context}</p>
        </div>
      )}
      <ol className="flex flex-col gap-3">
        {area.steps.map((step, index) => (
          <li key={step.name} className="grid grid-cols-[1.75rem_1fr] gap-x-2">
            <span aria-hidden="true" className="font-mono text-xs leading-6 text-accent">
              {String(index + 1).padStart(2, "0")}
            </span>
            <div>
              <p className="font-display font-medium text-ink">{step.name}</p>
              <p className="text-sm leading-relaxed text-muted">{step.detail}</p>
            </div>
          </li>
        ))}
      </ol>
      {area.note && <p className="rounded-lg border border-line bg-card/60 px-4 py-3 text-sm text-muted">{area.note}</p>}
      <Links links={area.links} />
    </div>
  );
}

function ResearchStages({ area, stage, onStage }: { area: WorkbenchArea; stage: number; onStage: (stage: number) => void }) {
  const steps = area.steps;
  const current = steps[stage];
  const atStart = stage === 0;
  const atEnd = stage === steps.length - 1;
  const step = (delta: number, blocked: boolean) => () => {
    if (!blocked) onStage(stage + delta);
  };
  return (
    <div className="flex flex-col gap-3">
      <p className="font-display font-medium text-ink">Step through a working paper</p>
      <ol aria-label="Research stages" className="flex flex-wrap gap-1.5">
        {steps.map((s, index) => (
          <li key={s.name}>
            <button
              type="button"
              aria-current={index === stage ? "step" : undefined}
              onClick={() => onStage(index)}
              className="rounded-full border border-line px-3 py-1.5 text-xs text-muted hover:border-line-strong hover:text-ink aria-[current=step]:border-accent aria-[current=step]:bg-accent-soft aria-[current=step]:text-ink motion-safe:transition-colors"
            >
              <span className="font-mono text-faint">{index + 1}</span> {s.name}
            </button>
          </li>
        ))}
      </ol>
      <div className="rounded-lg border border-line bg-card/60 px-4 py-3">
        <p className="font-mono text-xs text-accent">
          stage {stage + 1} of {steps.length}
        </p>
        <p className="mt-1 font-display text-lg font-medium text-ink">{current.name}</p>
        <p className="mt-1 text-sm leading-relaxed text-ink/90">{current.detail}</p>
      </div>
      <div className="flex gap-2">
        <button type="button" aria-disabled={atStart} onClick={step(-1, atStart)} className="btn-ghost px-3 py-2 text-sm aria-disabled:cursor-not-allowed aria-disabled:opacity-45">
          <span aria-hidden="true">←</span> Previous
          {!atStart && <span className="sr-only">: {steps[stage - 1].name}</span>}
        </button>
        <button type="button" aria-disabled={atEnd} onClick={step(1, atEnd)} className="btn-ghost px-3 py-2 text-sm aria-disabled:cursor-not-allowed aria-disabled:opacity-45">
          Next
          {!atEnd && <span className="sr-only">: {steps[stage + 1].name}</span>} <span aria-hidden="true">→</span>
        </button>
      </div>
    </div>
  );
}

function ResearchLens({ lens, onLens, idPrefix }: { lens: PracticeAreaId | null; onLens: (lens: PracticeAreaId) => void; idPrefix: string }) {
  const labelId = `${idPrefix}-lens-label`;
  return (
    <div className="flex flex-col gap-3">
      <p id={labelId} className="font-display font-medium text-ink">
        How research informs each setting
      </p>
      <div role="group" aria-labelledby={labelId} className="flex flex-wrap gap-1.5">
        {PRACTICE_AREAS.map((area) => (
          <button
            key={area.id}
            type="button"
            aria-pressed={lens === area.id}
            onClick={() => onLens(area.id)}
            className="flex items-center gap-2 rounded-full border border-line px-3 py-1.5 text-xs text-muted hover:border-line-strong hover:text-ink aria-pressed:border-accent aria-pressed:bg-accent-soft aria-pressed:text-ink motion-safe:transition-colors"
          >
            <span aria-hidden="true" className="wb-pip text-accent" />
            {area.title}
          </button>
        ))}
      </div>
      <p className="min-h-[4.5rem] text-sm leading-relaxed text-muted">
        {lens ? RESEARCH_INFORMS[lens] : "Choose a setting to light up its connection on the bench and see one example."}
      </p>
    </div>
  );
}

function ResearchDetail({ headingId, stage, lens, onStage, onLens }: Omit<DetailProps, "id" | "selected" | "onReset" | "interactive">) {
  const area = areaById("research");
  return (
    <div className="flex flex-col gap-5">
      <Heading area={area} headingId={headingId} />
      <p className="leading-relaxed text-ink/90">{area.purpose}</p>
      {area.example && (
        <div className="flex flex-col gap-1 border-l-2 border-accent/60 pl-4">
          <p className="font-mono text-xs text-accent">working paper</p>
          <p className="font-display font-medium text-ink">{area.example.title}</p>
          <p className="text-sm text-muted">{area.example.context}</p>
        </div>
      )}
      <ResearchStages area={area} stage={stage} onStage={onStage} />
      <ResearchLens lens={lens} onLens={onLens} idPrefix={headingId} />
      <Links links={area.links} />
    </div>
  );
}

/** The detail panel: always present, in normal page flow, outside the moving scene. */
export function WorkbenchDetail({ interactive, id, headingId, selected, stage, lens, onStage, onLens, onReset }: DetailProps) {
  return (
    <section id={id} aria-labelledby={headingId} className="glass flex flex-col gap-5 rounded-xl p-5 sm:p-6">
      {selected === null ? (
        <Overview headingId={headingId} />
      ) : selected === "research" ? (
        <ResearchDetail headingId={headingId} stage={stage} lens={lens} onStage={onStage} onLens={onLens} />
      ) : (
        <PracticeDetail area={areaById(selected)} headingId={headingId} />
      )}
      {interactive && (
        <button
          type="button"
          aria-disabled={selected === null}
          onClick={() => selected !== null && onReset()}
          className="btn-ghost self-start px-3 py-2 text-sm aria-disabled:cursor-not-allowed aria-disabled:opacity-45"
        >
          <span aria-hidden="true">↺</span> Reset exploration
        </button>
      )}
    </section>
  );
}

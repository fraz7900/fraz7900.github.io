import Link from "next/link";
import { AFTER_STEPS, ARTIFACT_NOTE, BEFORE_STEPS, EHR_CASE_PATH, EHR_INTRO, QUICK_SCAN, type CaseItem, type WorkflowStep } from "@/content/ehr";
import { PendingNote, SourceTag } from "./Evidence";

/** One quick-scan row: label, the statement, and where it comes from. */
function ScanRow({ item }: { item: CaseItem }) {
  if (item.kind === "pending") {
    return (
      <div className="border-b border-line py-3 last:border-0">
        <dt className="sr-only">{item.label}</dt>
        <dd>
          <PendingNote item={item} compact />
        </dd>
      </div>
    );
  }
  return (
    <div className="grid grid-cols-[minmax(0,1fr)] gap-1.5 border-b border-line py-3 last:border-0 sm:grid-cols-[6rem_minmax(0,1fr)_auto] sm:gap-4">
      <dt className="font-mono text-xs text-accent sm:pt-0.5">{item.label}</dt>
      <dd className="text-[0.9375rem] leading-relaxed text-ink">{item.text}</dd>
      <dd className="sm:pt-0.5">
        <SourceTag source={item.source} />
      </dd>
    </div>
  );
}

/** The quick-scan facts on their own, for the case page. */
export function QuickScanList() {
  return (
    <dl className="glass flex flex-col rounded-xl px-5 py-1">
      {QUICK_SCAN.map((item) => (
        <ScanRow key={item.kind === "fact" ? item.label : item.id} item={item} />
      ))}
    </dl>
  );
}

/** Featured healthcare SaaS case on the Product Management tab: everything a quick scan needs, plus the way in. */
export function EhrFeature() {
  return (
    <article aria-labelledby="ehr-feature-title" className="glass grid grid-cols-[minmax(0,1fr)] gap-8 rounded-2xl p-5 sm:p-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.35fr)] lg:gap-10">
      <div className="flex flex-col gap-4">
        <p className="font-mono text-xs text-accent">Featured case · {EHR_INTRO.context}</p>
        <h3 id="ehr-feature-title" className="font-display text-2xl font-semibold leading-snug text-ink sm:text-3xl">
          {EHR_INTRO.title}
        </h3>
        <p className="leading-relaxed text-muted">
          The facts here are the quick version. The full case covers the original workflow, the options, the decision, how I worked
          with engineering, QA and implementation, and what happened next.
        </p>
        <div className="mt-auto flex flex-wrap gap-3 pt-2">
          <Link href={EHR_CASE_PATH} className="btn-primary">
            Read the full case
          </Link>
          <Link href="/work/caretrak/" className="btn-ghost">
            See the launch walkthrough
          </Link>
        </div>
      </div>
      <dl className="flex flex-col">
        {QUICK_SCAN.map((item) => (
          <ScanRow key={item.kind === "fact" ? item.label : item.id} item={item} />
        ))}
      </dl>
    </article>
  );
}

/** A numbered, connected list of workflow steps, each tagged with its source. */
function StepList({ label, steps, tone }: { label: string; steps: readonly WorkflowStep[]; tone: "before" | "after" }) {
  const marker = tone === "after" ? "border-accent/70 text-accent" : "border-line-strong text-muted";
  return (
    <div className="flex flex-col gap-3">
      <h4 className={`font-mono text-xs font-normal ${tone === "after" ? "text-accent" : "text-muted"}`}>{label}</h4>
      <ol aria-label={label} className="flex flex-col">
        {steps.map((step, index) => (
          <li key={step.title} className="relative flex gap-4 pb-5 last:pb-0">
            <span aria-hidden="true" className="flex flex-col items-center">
              <span className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full border font-mono text-xs ${marker}`}>{index + 1}</span>
              {index < steps.length - 1 && <span className="mt-1 w-px flex-1 bg-line-strong" />}
            </span>
            <div className="flex min-w-0 flex-1 flex-col gap-1.5 sm:flex-row sm:items-start sm:gap-4">
              <div className="min-w-0 flex-1">
                <p className="font-medium text-ink">{step.title}</p>
                <p className="text-sm leading-relaxed text-muted">{step.detail}</p>
              </div>
              <SourceTag source={step.source} />
            </div>
          </li>
        ))}
      </ol>
    </div>
  );
}

/** Recreated artifact: how a new health system gets connected, before and after the API-first change. */
export function ConnectionWorkflow() {
  return (
    <figure className="flex flex-col gap-3">
      <div className="glass grid grid-cols-[minmax(0,1fr)] gap-8 rounded-xl p-5 sm:p-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.4fr)]">
        <StepList label="before: flat files" steps={BEFORE_STEPS} tone="before" />
        <StepList label="after: API-first" steps={AFTER_STEPS} tone="after" />
      </div>
      <figcaption className="max-w-3xl text-sm text-muted">{ARTIFACT_NOTE}</figcaption>
    </figure>
  );
}

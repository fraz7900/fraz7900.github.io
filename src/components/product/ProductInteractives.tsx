"use client";

import Link from "next/link";
import { CARETRAK_CANVAS, HIRING_LENSES, SOURCE_NOTE, type Evidence, type EvidenceSource } from "@/content/product";
import { Tabs } from "./Tabs";

const SOURCE_STYLE: Record<EvidenceSource, string> = {
  CV: "border-accent/60 text-accent",
  "Case study": "border-sky/60 text-sky",
  "Reported metric": "border-amber/60 text-amber",
  Retrospective: "border-line-strong text-muted",
  "Live tool": "border-accent/60 text-accent",
  Coursework: "border-sky/60 text-sky",
};

function SourceTag({ source }: { source: EvidenceSource }) {
  return (
    <span title={SOURCE_NOTE[source]} className={`w-max shrink-0 rounded border px-1.5 py-0.5 text-center font-mono text-[0.65rem] sm:w-24 ${SOURCE_STYLE[source]}`}>
      {source}
      <span className="sr-only">: {SOURCE_NOTE[source]}</span>
    </span>
  );
}

function EvidenceRow({ item }: { item: Evidence }) {
  return (
    <li className="flex flex-col gap-1.5 border-b border-line py-3.5 last:border-0 sm:flex-row sm:items-start sm:gap-4">
      <SourceTag source={item.source} />
      <div className="min-w-0 flex-1">
        <p className="font-medium text-ink">{item.claim}</p>
        <p className="mt-0.5 text-sm leading-relaxed text-muted">{item.detail}</p>
      </div>
      {item.href && (
        <Link href={item.href} className="shrink-0 font-mono text-xs text-accent hover:underline">
          see it
        </Link>
      )}
    </li>
  );
}

/** "What are you hiring for?" One role lens at a time, each with sourced evidence. */
export function HiringLensExplorer() {
  return (
    <Tabs
      label="What are you hiring for?"
      variant="pills"
      items={HIRING_LENSES}
      keyOf={(lens) => lens.id}
      tabLabel={(lens) => lens.role}
      renderPanel={(lens) => (
        <div className="glass rounded-xl p-5 sm:p-6">
          <p className="font-display text-xl font-semibold text-ink">{lens.question}</p>
          <ul className="mt-3">
            {lens.evidence.map((item) => (
              <EvidenceRow key={item.claim} item={item} />
            ))}
          </ul>
        </div>
      )}
    />
  );
}

/** CareTrak through a product-thinking lens: Problem → Users → Constraints → Bets → Measures → Outcome. */
export function ProductCanvas() {
  return (
    <Tabs
      label="CareTrak product thinking, step by step"
      variant="steps"
      items={CARETRAK_CANVAS}
      keyOf={(stage) => stage.id}
      tabLabel={(stage, index) => (
        <>
          <span className="text-faint">{String(index + 1).padStart(2, "0")}</span>
          {stage.label.toLowerCase()}
        </>
      )}
      renderPanel={(stage, index) => (
        <div className="grid grid-cols-[minmax(0,1fr)] gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.2fr)]">
          <div className="flex flex-col gap-4">
            <p className="eyebrow">
              {index + 1} / {CARETRAK_CANVAS.length} · {stage.label.toLowerCase()}
            </p>
            <h3 className="font-display text-2xl font-semibold leading-snug text-ink sm:text-3xl">{stage.headline}</h3>
            <p className="glass rounded-lg border-l-2 border-l-accent px-4 py-3 leading-relaxed text-ink/90">
              <span className="font-mono text-xs text-accent">product thinking · </span>
              {stage.thinking}
            </p>
          </div>
          <ul className="glass rounded-xl px-5 py-1">
            {stage.points.map((item) => (
              <EvidenceRow key={item.claim} item={item} />
            ))}
          </ul>
        </div>
      )}
    />
  );
}

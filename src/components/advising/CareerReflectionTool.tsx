"use client";

import Link from "next/link";
import { useState } from "react";
import {
  DECISIONS,
  STAGES,
  USEFUL,
  reflect,
  reflectionSummary,
  type ReflectionAnswers,
} from "@/lib/advising/careerReflection";
import { CopyDownload } from "./ClientUtils";

type Partial3 = { stage?: ReflectionAnswers["stage"]; decision?: ReflectionAnswers["decision"]; useful?: ReflectionAnswers["useful"] };

function Question<T extends string>({
  name,
  legend,
  options,
  value,
  onChange,
}: {
  name: string;
  legend: string;
  options: readonly { id: T; label: string }[];
  value?: T;
  onChange: (value: T) => void;
}) {
  return (
    <fieldset className="min-w-0">
      <legend className="mb-2.5 font-medium text-ink">{legend}</legend>
      <div className="flex flex-wrap gap-2">
        {options.map((option) => (
          <label
            key={option.id}
            className="cursor-pointer rounded-full border border-line-strong px-3 py-1.5 text-sm text-ink/90 transition-colors has-[:checked]:border-accent has-[:checked]:bg-accent-soft has-[:checked]:text-ink has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-accent hover:border-accent/60"
          >
            <input
              type="radio"
              name={name}
              value={option.id}
              checked={value === option.id}
              onChange={() => onChange(option.id)}
              className="sr-only"
            />
            {option.label}
          </label>
        ))}
      </div>
    </fieldset>
  );
}

/** Three questions → a transparent, rule-based suggested focus. Answers stay in the browser. */
export function CareerReflectionTool() {
  const [answers, setAnswers] = useState<Partial3>({});
  const complete = answers.stage && answers.decision && answers.useful;
  const full = complete ? (answers as ReflectionAnswers) : null;
  const result = full ? reflect(full) : null;

  return (
    <div className="glass flex flex-col gap-7 rounded-xl p-5 sm:p-6">
      <Question name="stage" legend="1. What stage are you at?" options={STAGES} value={answers.stage} onChange={(stage) => setAnswers((a) => ({ ...a, stage }))} />
      <Question name="decision" legend="2. What decision are you trying to make?" options={DECISIONS} value={answers.decision} onChange={(decision) => setAnswers((a) => ({ ...a, decision }))} />
      <Question name="useful" legend="3. What would make the next conversation useful?" options={USEFUL} value={answers.useful} onChange={(useful) => setAnswers((a) => ({ ...a, useful }))} />

      <div aria-live="polite" className="border-t border-line pt-6">
        {result && full ? (
          <div className="flex flex-col gap-5">
            <div>
              <p className="font-mono text-xs text-accent">suggested session focus</p>
              <p className="mt-1 font-display text-2xl font-semibold text-ink">{result.focus}</p>
            </div>
            <div className="grid grid-cols-[minmax(0,1fr)] gap-5 md:grid-cols-2">
              <div>
                <h3 className="text-sm font-semibold text-ink">Why this suggestion</h3>
                <ul className="mt-2 flex list-disc flex-col gap-1.5 pl-5 text-sm text-muted marker:text-accent">
                  {result.why.map((reason) => (
                    <li key={reason}>{reason}</li>
                  ))}
                </ul>
              </div>
              <div>
                <h3 className="text-sm font-semibold text-ink">Prepare before we talk</h3>
                <ul className="mt-2 flex flex-col gap-1.5 text-sm text-ink/90">
                  {result.checklist.map((item) => (
                    <li key={item} className="flex gap-2">
                      <span aria-hidden="true" className="text-accent">
                        ☐
                      </span>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            <CopyDownload text={reflectionSummary(full, result)} filename="career-reflection.txt" />
            <div className="flex flex-wrap items-center gap-3">
              <Link href={`/advising/book/?topic=${result.service}`} className="btn-primary">
                Book a conversation about this
              </Link>
              <button type="button" onClick={() => setAnswers({})} className="link-accent text-sm">
                Start over
              </button>
            </div>
            <p className="text-xs text-faint">
              A reflection prompt built from fixed rules, not an assessment or AI diagnosis. Change any answer above to update it.
            </p>
          </div>
        ) : (
          <p className="text-sm text-muted">Answer all three questions to see a suggested focus and a short preparation checklist.</p>
        )}
      </div>
    </div>
  );
}

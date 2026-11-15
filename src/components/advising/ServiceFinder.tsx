"use client";

import Link from "next/link";
import { useId, useState } from "react";
import { FINDER_OPTIONS, findService } from "@/lib/advising/serviceFinder";

interface ServiceLink {
  readonly id: string;
  readonly title: string;
  readonly href: string;
}

/** "Where should I start?" A one-question, rule-based pointer to the right service page. */
export function ServiceFinder({ services }: { services: readonly ServiceLink[] }) {
  const [choice, setChoice] = useState<string>("");
  const groupId = useId();
  const match = choice ? findService(choice) : null;
  const service = match ? services.find((s) => s.id === match.service) : undefined;

  return (
    <div className="glass grid gap-6 rounded-xl p-5 sm:p-6 md:grid-cols-[minmax(0,1.3fr)_minmax(0,1fr)]">
      <fieldset className="min-w-0">
        <legend id={groupId} className="mb-3 font-medium text-ink">
          What brings you here?
        </legend>
        <div className="flex flex-col gap-2">
          {FINDER_OPTIONS.map((option) => (
            <label
              key={option.id}
              className="flex cursor-pointer items-center gap-3 rounded-lg border border-line px-3 py-2.5 text-sm text-ink/90 transition-colors has-[:checked]:border-accent/70 has-[:checked]:bg-accent-soft/50 hover:border-line-strong"
            >
              <input
                type="radio"
                name="service-finder"
                value={option.id}
                checked={choice === option.id}
                onChange={() => setChoice(option.id)}
                className="accent-[var(--color-accent)]"
              />
              {option.label}
            </label>
          ))}
        </div>
      </fieldset>
      <div aria-live="polite" className="flex flex-col justify-center gap-3 rounded-lg border border-dashed border-line-strong p-5">
        {service && match ? (
          <>
            <p className="font-mono text-xs text-accent">suggested starting point</p>
            <p className="font-display text-2xl font-semibold text-ink">{service.title}</p>
            <p className="text-sm text-muted">{match.why}</p>
            <Link href={service.href} className="btn-primary w-max">
              Go to {service.title.toLowerCase()}
            </Link>
          </>
        ) : (
          <p className="text-sm text-muted">Choose the option closest to your situation and I’ll point you to the right page.</p>
        )}
      </div>
    </div>
  );
}

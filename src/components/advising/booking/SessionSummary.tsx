import Link from "next/link";
import { SectionLabel } from "@/components/SectionLabel";
import { GENERAL_PREPARATION, type BookingFocus } from "@/content/advising/bookingFocus";
import type { BookingConfig } from "@/content/advising/config";
import { sessionFacts } from "@/lib/advising/bookingFlow";

/** What the chosen session covers, its facts from configuration, and how to prepare. */
export function SessionSummary({ focus, config }: { focus: BookingFocus | null; config: BookingConfig }) {
  return (
    <section aria-labelledby="session-heading" className="glass rounded-xl p-5 sm:p-6">
      <SectionLabel index="02">session</SectionLabel>
      <h2 id="session-heading" className="mt-3 font-display text-2xl font-semibold tracking-tight text-ink">
        {focus ? focus.title : "Your session"}
      </h2>
      <p className="mt-2 leading-relaxed text-muted">
        {focus ? focus.summary : "Choose a focus to see what we’ll cover and how to prepare."}
      </p>

      <dl className="mt-5 grid grid-cols-[minmax(0,1fr)] gap-4 border-y border-line py-4 sm:grid-cols-3">
        {sessionFacts(config).map((fact) => (
          <div key={fact.term} className="flex flex-col gap-1">
            <dt className="font-mono text-xs text-faint">{fact.term.toLowerCase()}</dt>
            <dd className="text-sm text-ink">{fact.detail}</dd>
          </div>
        ))}
      </dl>
      {config.sessionNote && <p className="mt-4 text-sm leading-relaxed text-muted">{config.sessionNote}</p>}

      {focus && (
        <details className="group mt-4 rounded-lg border border-line px-4 py-3">
          <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-sm font-medium text-ink">
            What should I prepare?
            <span aria-hidden="true" className="font-mono text-accent motion-safe:transition-transform group-open:rotate-45">
              +
            </span>
          </summary>
          <ul className="mt-3 flex flex-col gap-2 text-sm leading-relaxed text-ink/90">
            {[...focus.prepare, ...GENERAL_PREPARATION].map((tip) => (
              <li key={tip} className="flex gap-3">
                <span aria-hidden="true" className="text-accent">
                  →
                </span>
                {tip}
              </li>
            ))}
          </ul>
          <p className="mt-3 text-sm">
            <Link href={focus.guide.href} className="link-accent">
              {focus.guide.label}
            </Link>
          </p>
        </details>
      )}
    </section>
  );
}

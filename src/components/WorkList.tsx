import Link from "next/link";
import { IN_PREPARATION, PUBLISHED_WORK, type WorkEntry } from "@/content/work";

export function WorkList() {
  return (
    <ol className="flex flex-col gap-4">
      {PUBLISHED_WORK.map((entry, index) => (
        <li key={entry.href}>
          <WorkCard entry={entry} index={index} />
        </li>
      ))}
    </ol>
  );
}

function WorkCard({ entry, index }: { entry: WorkEntry; index: number }) {
  return (
    <article className="glass group relative grid gap-5 rounded-xl p-5 transition-colors hover:border-accent/60 sm:p-6 md:grid-cols-[3rem_minmax(0,1fr)]">
      <span aria-hidden="true" className="font-mono text-sm text-faint">
        {String(index + 1).padStart(2, "0")}
      </span>
      <div className="flex min-w-0 flex-col gap-4">
        <div>
          <p className="font-mono text-xs text-accent">{entry.kind}</p>
          <h3 className="mt-2 font-display text-2xl font-semibold text-ink">
            <Link href={entry.href} className="after:absolute after:inset-0 after:content-['']">
              {entry.title}
            </Link>
          </h3>
        </div>
        <dl className="grid gap-4 text-sm sm:grid-cols-3">
          <div>
            <dt className="font-mono text-xs text-faint">decision</dt>
            <dd className="mt-1 leading-relaxed text-ink/90">{entry.decision}</dd>
          </div>
          <div>
            <dt className="font-mono text-xs text-faint">role</dt>
            <dd className="mt-1 leading-relaxed text-ink/90">{entry.role}</dd>
          </div>
          <div>
            <dt className="font-mono text-xs text-faint">what you can inspect</dt>
            <dd className="mt-1 leading-relaxed text-ink/90">{entry.inspect}</dd>
          </div>
        </dl>
        <p aria-hidden="true" className="font-mono text-xs text-accent group-hover:underline">
          open
        </p>
      </div>
    </article>
  );
}

export function InPreparationList() {
  if (IN_PREPARATION.length === 0) return null;
  return (
    <ul className="flex flex-col divide-y divide-line border-y border-line">
      {IN_PREPARATION.map((item) => (
        <li key={item.title} className="flex flex-col gap-1 py-3 sm:flex-row sm:items-baseline sm:gap-4">
          <span className="font-mono text-xs text-accent sm:w-56 sm:shrink-0">{item.kind}</span>
          <span className="text-sm text-ink">
            <span className="font-medium">{item.title}.</span> {item.decision}{" "}
            <span className="text-muted">In preparation, not yet published.</span>
          </span>
        </li>
      ))}
    </ul>
  );
}

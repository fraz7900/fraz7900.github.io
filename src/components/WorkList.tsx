import Link from "next/link";
import { IN_PREPARATION, PUBLISHED_WORK, type WorkEntry } from "@/content/work";

export function WorkList() {
  return (
    <ul className="flex flex-col gap-4">
      {PUBLISHED_WORK.map((entry) => (
        <li key={entry.href}>
          <WorkCard entry={entry} />
        </li>
      ))}
    </ul>
  );
}

function WorkCard({ entry }: { entry: WorkEntry }) {
  return (
    <article className="group relative rounded-lg border border-line bg-card p-5 transition-colors hover:border-ink sm:p-6">
      <p className="font-mono text-xs uppercase tracking-wider text-muted">{entry.kind}</p>
      <h3 className="mt-2 font-display text-2xl text-ink">
        <Link href={entry.href} className="after:absolute after:inset-0 after:content-['']">
          {entry.title}
        </Link>
      </h3>
      <dl className="mt-4 grid gap-3 text-sm sm:grid-cols-3">
        <div>
          <dt className="font-mono text-xs text-muted">Decision</dt>
          <dd className="mt-1 text-ink">{entry.decision}</dd>
        </div>
        <div>
          <dt className="font-mono text-xs text-muted">Role</dt>
          <dd className="mt-1 text-ink">{entry.role}</dd>
        </div>
        <div>
          <dt className="font-mono text-xs text-muted">What you can inspect</dt>
          <dd className="mt-1 text-ink">{entry.inspect}</dd>
        </div>
      </dl>
      <p aria-hidden="true" className="mt-4 font-mono text-xs text-accent group-hover:underline">
        Open →
      </p>
    </article>
  );
}

export function InPreparationList() {
  return (
    <ul className="flex flex-col divide-y divide-line border-y border-line">
      {IN_PREPARATION.map((item) => (
        <li key={item.title} className="flex flex-col gap-1 py-3 sm:flex-row sm:items-baseline sm:gap-4">
          <span className="font-mono text-xs uppercase tracking-wider text-muted sm:w-56 sm:shrink-0">
            {item.kind}
          </span>
          <span className="text-sm text-ink">
            <span className="font-medium">{item.title}.</span> {item.decision}{" "}
            <span className="text-muted">In preparation, not yet published.</span>
          </span>
        </li>
      ))}
    </ul>
  );
}

import Link from "next/link";

/** Shared building blocks for case-study pages (CareTrak, pension reform). */

export function CaseHeader({
  crumb,
  track,
  title,
  lede,
  facts,
}: {
  crumb: string;
  track: { readonly id: string; readonly href: string };
  title: string;
  lede: string;
  facts: readonly { readonly term: string; readonly detail: string }[];
}) {
  return (
    <header className="page-container grid grid-cols-[minmax(0,1fr)] gap-10 py-14 sm:py-20 lg:grid-cols-[minmax(0,1.6fr)_minmax(0,1fr)] lg:gap-16">
      <div className="flex flex-col gap-6">
        <nav aria-label="Breadcrumb" className="font-mono text-xs text-muted">
          <Link href="/work/" className="hover:text-accent">
            ~/work
          </Link>
          <span aria-hidden="true"> / </span>
          <Link href={track.href} className="hover:text-accent">
            {track.id}
          </Link>
          <span aria-hidden="true"> / </span>
          <span aria-current="page" className="text-accent">
            {crumb}
          </span>
        </nav>
        <h1 className="font-display text-4xl font-semibold leading-[1.08] tracking-tight text-ink sm:text-6xl">{title}</h1>
        <p className="prose-body text-lg text-ink/85">{lede}</p>
        <p>
          <a href="#walkthrough" className="btn-primary">
            Start the walkthrough
          </a>
        </p>
      </div>
      <dl className="glass flex flex-col self-start rounded-xl px-5 py-2 lg:mt-10">
        {facts.map((item) => (
          <div key={item.term} className="grid grid-cols-[6.5rem_1fr] gap-3 border-b border-line py-3 text-sm last:border-0">
            <dt className="font-mono text-xs text-accent">{item.term}</dt>
            <dd className="text-ink">{item.detail}</dd>
          </div>
        ))}
      </dl>
    </header>
  );
}

export function CaseSection({
  id,
  index,
  title,
  children,
}: {
  id: string;
  index: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section id={id} aria-labelledby={`${id}-heading`} className="scroll-mt-20 border-t border-line/70">
      <div className="page-container py-16 sm:py-20">
        <p className="eyebrow mb-3 flex items-center gap-3">
          <span aria-hidden="true" className="h-px w-10 bg-accent/70" />
          <span>
            <span className="text-faint">{index}</span>
            {` // ${id.replaceAll("-", " ")}`}
          </span>
        </p>
        <h2 id={`${id}-heading`} className="mb-8 font-display text-3xl font-semibold tracking-tight text-ink sm:text-4xl">
          {title}
        </h2>
        {children}
      </div>
    </section>
  );
}

export function ProblemStatement({ problem, context }: { problem: string; context: string }) {
  return (
    <>
      <p className="max-w-3xl font-display text-2xl leading-snug text-ink sm:text-3xl">{problem}</p>
      <p className="prose-body mt-6 text-ink/80">{context}</p>
    </>
  );
}

export function ResultsGrid({ results, note }: { results: readonly { value: string; label: string }[]; note: string }) {
  return (
    <>
      <dl className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        {results.map((result) => (
          <div key={result.label} className="glass flex flex-col-reverse gap-2 rounded-xl p-5">
            <dt className="text-sm leading-snug text-muted">{result.label}</dt>
            <dd className="font-display text-3xl font-semibold leading-none text-gradient sm:text-4xl">{result.value}</dd>
          </div>
        ))}
      </dl>
      <p className="mt-4 max-w-3xl text-sm text-muted">{note}</p>
    </>
  );
}

export function Tensions({ items, intro }: { items: readonly { pull: string; against: string }[]; intro: string }) {
  return (
    <>
      <p className="prose-body text-ink/85">{intro}</p>
      <ul className="mt-6 flex max-w-3xl flex-col divide-y divide-line border-y border-line">
        {items.map((tension) => (
          <li
            key={tension.pull}
            className="grid grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] items-center gap-3 py-3 text-[0.9375rem] sm:grid-cols-[15rem_auto_minmax(0,1fr)] sm:gap-5"
          >
            <span className="text-ink">{tension.pull}</span>
            <span aria-hidden="true" className="text-accent">
              ⟷
            </span>
            <span className="text-ink">
              <span className="sr-only">versus </span>
              {tension.against}
            </span>
          </li>
        ))}
      </ul>
    </>
  );
}

export function Lessons({ items }: { items: readonly { title: string; body: string }[] }) {
  return (
    <ol className="grid gap-4 md:grid-cols-2">
      {items.map((lesson, index) => (
        <li key={lesson.title} className="glass flex flex-col gap-2 rounded-xl p-5">
          <span className="font-mono text-xs text-accent">{String(index + 1).padStart(2, "0")}</span>
          <h3 className="font-display text-lg font-semibold text-ink">{lesson.title}</h3>
          <p className="leading-relaxed text-muted">{lesson.body}</p>
        </li>
      ))}
    </ol>
  );
}

export function CaseFooter({ note, children }: { note: string; children?: React.ReactNode }) {
  return (
    <footer className="border-t border-line/70">
      <div className="page-container flex flex-col gap-4 py-10">
        <p className="max-w-3xl text-sm text-muted">{note}</p>
        <p className="flex flex-wrap gap-3 text-sm">
          <Link href="/work/" className="btn-ghost">
            Back to all work
          </Link>
          {children}
        </p>
      </div>
    </footer>
  );
}

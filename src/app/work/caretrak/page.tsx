import type { Metadata } from "next";
import Link from "next/link";
import { CaseWalkthrough } from "@/components/case/CaseWalkthrough";
import { FoundationMap } from "@/components/case/FoundationMap";
import {
  CASE_FILE,
  FOUNDATION,
  INTRO,
  LESSONS,
  RESULTS,
  RESULTS_NOTE,
  TENSIONS,
  VISUALS_NOTE,
} from "@/content/caretrak";

export const metadata: Metadata = {
  title: "CareTrak case study",
  description:
    "How Fraz Ahmed, as product manager at Persivia, took CareTrak's EHR-integrated clinical AI from integration to production on a platform serving 50+ facilities.",
};

export default function CareTrakPage() {
  return (
    <article className="flex flex-col">
      <CaseHeader />
      <Section id="problem" title="The problem">
        <p className="max-w-3xl font-display text-2xl leading-snug text-ink sm:text-3xl">{INTRO.problem}</p>
        <p className="prose-body mt-5 text-ink/85">{INTRO.problemContext}</p>
      </Section>
      <Section id="walkthrough" title="Walkthrough" tinted>
        <p className="prose-body mb-8 text-ink/85">
          Five steps, in the order a facility went through them. Each one shows a mockup of the product surface,
          what I did, and the numbered details worth noticing.
        </p>
        <CaseWalkthrough />
      </Section>
      <Section id="results" title="Results">
        <dl className="grid gap-x-8 gap-y-6 border-y border-line py-6 sm:grid-cols-2 lg:grid-cols-4">
          {RESULTS.map((result) => (
            <div key={result.label} className="flex flex-col-reverse">
              <dt className="mt-2 text-sm leading-snug text-ink/85">{result.label}</dt>
              <dd className="font-display text-5xl leading-none text-ink">{result.value}</dd>
            </div>
          ))}
        </dl>
        <p className="mt-4 max-w-3xl text-sm text-muted">{RESULTS_NOTE}</p>
      </Section>
      <Section id="trade-offs" title="Trade-offs in the rollout">
        <p className="prose-body text-ink/85">
          Looking back, four tensions run through the work. Each release question came down to where a cohort sat
          on these lines.
        </p>
        <ul className="mt-6 flex max-w-3xl flex-col divide-y divide-line border-y border-line">
          {TENSIONS.map((tension) => (
            <li
              key={tension.pull}
              className="grid grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] items-center gap-3 py-3 text-[0.9375rem] sm:grid-cols-[13rem_auto_minmax(0,1fr)] sm:gap-5"
            >
              <span className="text-ink">{tension.pull}</span>
              <span aria-hidden="true" className="text-accent">⟷</span>
              <span className="text-ink">
                <span className="sr-only">versus </span>
                {tension.against}
              </span>
            </li>
          ))}
        </ul>
      </Section>
      <Section id="foundation" title="What it set up" tinted>
        <figure className="flex flex-col gap-3">
          <FoundationMap />
          <figcaption className="max-w-3xl text-sm text-muted">{FOUNDATION.caption}</figcaption>
        </figure>
      </Section>
      <Section id="lessons" title="What I took from it">
        <ol className="grid gap-x-10 gap-y-6 md:grid-cols-2">
          {LESSONS.map((lesson) => (
            <li key={lesson.title} className="flex flex-col gap-1.5">
              <h3 className="text-lg font-semibold text-ink">{lesson.title}</h3>
              <p className="leading-relaxed text-ink/85">{lesson.body}</p>
            </li>
          ))}
        </ol>
      </Section>
      <footer className="border-t border-line">
        <div className="page-container flex flex-col gap-4 py-10">
          <p className="max-w-3xl text-sm text-muted">{VISUALS_NOTE}</p>
          <p className="flex flex-wrap gap-x-6 gap-y-2 text-sm">
            <Link href="/work/" className="link-accent">
              Back to all work
            </Link>
            <Link href="/tools/workflow-roi/" className="link-accent">
              Try the workflow ROI calculator
            </Link>
          </p>
        </div>
      </footer>
    </article>
  );
}

function CaseHeader() {
  return (
    <header className="page-container grid gap-10 py-12 sm:py-16 lg:grid-cols-[minmax(0,1.6fr)_minmax(0,1fr)] lg:gap-16">
      <div className="flex flex-col gap-5">
        <nav aria-label="Breadcrumb" className="text-sm text-muted">
          <Link href="/work/" className="hover:text-ink hover:underline">
            Work
          </Link>
          <span aria-hidden="true"> / </span>
          <span aria-current="page">CareTrak</span>
        </nav>
        <h1 className="font-display text-[2.6rem] leading-[1.05] text-ink sm:text-6xl">{INTRO.title}</h1>
        <p className="prose-body text-lg text-ink/85">{INTRO.lede}</p>
        <p>
          <a href="#walkthrough" className="btn-primary">
            Start the walkthrough
          </a>
        </p>
      </div>
      <dl className="flex flex-col self-start border-t-2 border-ink lg:mt-12">
        {CASE_FILE.map((item) => (
          <div key={item.term} className="grid grid-cols-[6.5rem_1fr] gap-3 border-b border-line py-3 text-sm">
            <dt className="text-muted">{item.term}</dt>
            <dd className="text-ink">{item.detail}</dd>
          </div>
        ))}
      </dl>
    </header>
  );
}

function Section({
  id,
  title,
  tinted = false,
  children,
}: {
  id: string;
  title: string;
  tinted?: boolean;
  children: React.ReactNode;
}) {
  return (
    <section
      id={id}
      aria-labelledby={`${id}-heading`}
      className={`scroll-mt-4 border-t border-line ${tinted ? "bg-card/70" : ""}`}
    >
      <div className="page-container py-12 sm:py-16">
        <h2 id={`${id}-heading`} className="mb-6 font-display text-4xl text-ink">
          {title}
        </h2>
        {children}
      </div>
    </section>
  );
}

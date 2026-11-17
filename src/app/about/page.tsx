import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { DecisionWorkbench } from "@/components/about/workbench/DecisionWorkbench";
import { SectionLabel } from "@/components/SectionLabel";
import { SITE, SOCIAL_LINKS } from "@/content/site";

export const metadata: Metadata = {
  title: "About",
  description:
    "Fraz Ahmed works across product strategy, analytics and enterprise strategy, from public finance to healthcare SaaS, and studies at Carnegie Mellon’s Heinz College as a Fulbright Scholar.",
};

const QUICK_FACTS = [
  { term: "now", detail: "MSPPM–Data Analytics, CMU Heinz College · Fulbright Scholar · graduating May 2027" },
  { term: "teaching", detail: "TA, Time Series Forecasting in Python" },
  { term: "2022–2025", detail: "Section Officer, Ministry of Finance, Pakistan" },
  { term: "2020–2022", detail: "Product Manager, CareTrak, Persivia" },
  { term: "tools", detail: "Python, R, Stata, SQL, Excel, Tableau, Power BI" },
] as const;

export default function AboutPage() {
  return (
    <div className="page-container grid grid-cols-[minmax(0,1fr)] gap-12 py-14 sm:py-20 lg:grid-cols-[minmax(0,1.5fr)_minmax(0,1fr)] lg:gap-x-16 lg:gap-y-16">
      <div className="flex flex-col gap-10 lg:col-start-1 lg:row-start-1">
        <header className="flex max-w-2xl flex-col gap-5">
          <SectionLabel>about</SectionLabel>
          <h1 className="font-display text-5xl font-semibold tracking-tight text-ink sm:text-6xl">
            Fraz <span className="text-gradient">Ahmed</span>
          </h1>
          <p className="text-lg leading-relaxed text-muted">
            Product strategy, analytics and enterprise strategy across public finance and healthcare SaaS, in a way
            that carries over to enterprise software, consulting and other regulated industries.
          </p>
        </header>

        <div className="prose-body text-ink/90">
          <p>
            I work on the questions that come before and after a build: what a team should make, how it will know the
            work is succeeding, and how to roll it out to the people who have to use it.
          </p>
        </div>

        {/* Heads the workbench below; it sits here so it fills the space beside the quick facts on wide screens. */}
        <div className="mt-6 flex max-w-2xl flex-col gap-4">
          <SectionLabel>workbench</SectionLabel>
          <h2 id="workbench-title" className="font-display text-3xl font-semibold tracking-tight text-ink sm:text-4xl">
            Different settings. A consistent approach.
          </h2>
          <p className="text-lg leading-relaxed text-muted">
            I work across different settings, using evidence to turn complex questions into decisions and practical next
            steps.
          </p>
          <p className="text-sm text-faint">Explore the objects to see how I work.</p>
        </div>
      </div>

      <section aria-labelledby="workbench-title" className="lg:col-span-2 lg:row-start-2">
        <DecisionWorkbench />
      </section>

      <div className="lg:col-start-1 lg:row-start-3">
        <div className="prose-body text-ink/90">
          <p>
            <strong className="font-semibold text-ink">Public finance.</strong> From 2022 to 2025 I was a Section
            Officer in the Regulations Wing of Pakistan’s Ministry of Finance. I ran the actuarial revaluation of
            federal pension liabilities (PKR 12.0 trillion), co-drafted the pension commitments for the US$7 billion
            IMF Extended Fund Facility, costed parametric reforms for 1.8 million pensioners, and drafted the legal
            framework for a funded defined-contribution scheme invested by licensed private fund managers.{" "}
            <Link href="/work/pension-reform/" className="link-accent">
              Read the pension reform case study
            </Link>
            .
          </p>
          <p>
            <strong className="font-semibold text-ink">Digital pensions.</strong> In an independent research project
            with the World Bank (December 2025 – April 2026), I led the digital pension-system design for Jamaica:
            digital ID enrolment, data exchange and mobile payments that extend coverage to informal workers. The
            government announced it in May 2026.
          </p>
          <p>
            <strong className="font-semibold text-ink">Healthcare SaaS.</strong> From 2020 to 2022 I was Product
            Manager on CareTrak at Persivia, a population health and value-based care platform serving 50+
            facilities. I led a team of 10 engineers and 3 QA analysts on EHR interoperability, and worked on CMS-HCC
            risk adjustment, chronic care management and predictive cost models.{" "}
            <Link href="/work/caretrak/" className="link-accent">
              Read the CareTrak case study
            </Link>
            .
          </p>
          <p>
            <strong className="font-semibold text-ink">Carnegie Mellon.</strong> I’m a Fulbright Scholar in the
            MSPPM–Data Analytics programme at Carnegie Mellon’s Heinz College (graduating May 2027), and a teaching
            assistant for Time Series Forecasting in Python.
          </p>
          <p>
            A small example of how I approach these decisions is the{" "}
            <Link href="/tools/workflow-roi/" className="link-accent">
              workflow ROI calculator
            </Link>
            , which shows how much time a change must save to cover its recurring cost.
          </p>
        </div>
      </div>

      <aside aria-label="Quick facts" className="flex flex-col gap-6 lg:col-start-2 lg:row-start-1 lg:self-start">
        {SITE.headshotSrc && (
          <div className="relative mx-auto aspect-square w-56 rounded-full bg-[conic-gradient(from_200deg,var(--color-accent),var(--color-sky),var(--color-amber),var(--color-accent))] p-[3px] lg:mx-0">
            <Image
              src={SITE.headshotSrc}
              alt={`Portrait of ${SITE.name}`}
              width={224}
              height={224}
              unoptimized
              className="size-full rounded-full object-cover"
            />
          </div>
        )}
        <dl className="glass flex flex-col rounded-xl px-5 py-2">
          {QUICK_FACTS.map((fact) => (
            <div key={fact.term} className="grid grid-cols-[6rem_1fr] gap-3 border-b border-line py-3 text-sm last:border-0">
              <dt className="font-mono text-xs text-accent">{fact.term}</dt>
              <dd className="text-ink">{fact.detail}</dd>
            </div>
          ))}
        </dl>
        <ul className="flex flex-wrap gap-2">
          {SOCIAL_LINKS.map((link) => (
            <li key={link.href}>
              <a href={link.href} className="btn-ghost text-sm">
                {link.label}
              </a>
            </li>
          ))}
        </ul>
      </aside>
    </div>
  );
}

import type { Metadata } from "next";
import Link from "next/link";
import { SectionLabel } from "@/components/SectionLabel";

export const metadata: Metadata = {
  title: "About",
  description:
    "Fraz Ahmed works across product strategy, analytics and enterprise strategy, from healthcare SaaS to public finance, and studies at Carnegie Mellon’s Heinz College.",
};

export default function AboutPage() {
  return (
    <div className="page-container flex flex-col gap-10 py-12 sm:py-16">
      <header className="flex max-w-2xl flex-col gap-4">
        <SectionLabel>About</SectionLabel>
        <h1 className="font-display text-5xl text-ink">Fraz Ahmed</h1>
        <p className="text-lg leading-relaxed text-ink/85">
          Product strategy, analytics and enterprise strategy across public finance and healthcare
          SaaS, in a way that carries over to enterprise software, consulting and other regulated
          industries.
        </p>
      </header>

      <div className="prose-body text-ink">
        <p>
          I work on the questions that come before and after a build: what a team should make, how
          it will know the work is succeeding, and how to roll it out to the people who have to
          use it.
        </p>
        <p>
          <strong className="font-semibold">Public finance.</strong> From 2022 to 2025 I was a Section
          Officer in the Regulations Wing of Pakistan’s Ministry of Finance. I ran the actuarial
          revaluation of federal pension liabilities (PKR 12.0 trillion), co-drafted the pension
          commitments for the US$7 billion IMF Extended Fund Facility, costed parametric reforms for
          1.8 million pensioners, and drafted the legal framework for a funded defined-contribution
          scheme invested by licensed private fund managers.
        </p>
        <p>
          <strong className="font-semibold">Digital pensions.</strong> In an independent research
          project with the World Bank (December 2025 – April 2026), I led the digital pension-system
          design for Jamaica: digital ID enrolment, data exchange and mobile payments that extend
          coverage to informal workers. The government announced it in May 2026.
        </p>
        <p>
          <strong className="font-semibold">Healthcare SaaS.</strong> From 2020 to 2022 I was Product
          Manager on CareTrak at Persivia, a population health and value-based care platform serving
          50+ facilities. I led a team of 10 engineers and 3 QA analysts on EHR interoperability, and
          worked on CMS-HCC risk adjustment, chronic care management and predictive cost models.{" "}
          <Link href="/work/caretrak/" className="link-accent">
            Read the CareTrak case study
          </Link>
          .
        </p>
        <p>
          <strong className="font-semibold">Carnegie Mellon.</strong> I’m a Fulbright Scholar in the
          MSPPM–Data Analytics programme at Carnegie Mellon’s Heinz College (graduating May 2027), and a
          teaching assistant for Time Series Forecasting in Python.
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
  );
}

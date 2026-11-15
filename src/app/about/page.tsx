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
          Product strategy, analytics and enterprise strategy. Strongest in healthcare SaaS, and
          working in a way that carries over to enterprise software, consulting and regulated
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
          <strong className="font-semibold">Healthcare SaaS.</strong> My healthcare experience comes
          from Persivia and its CareTrak platform, with a focus on EHR integrations and population
          health.
        </p>
        <p>
          <strong className="font-semibold">Public finance.</strong> My public finance work includes
          pension reform, where the same approach applies: frame the decision, make the trade-offs
          explicit and measure what changes.
        </p>
        <p>
          <strong className="font-semibold">Carnegie Mellon.</strong> I’m studying for the MSPPM in
          Data Analytics at Carnegie Mellon’s Heinz College, building on that experience with applied
          economics, machine learning and product analytics.
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

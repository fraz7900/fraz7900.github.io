import type { Metadata } from "next";
import Link from "next/link";
import { CaseFooter, CaseHeader, CaseSection, Lessons, ProblemStatement, ResultsGrid, Tensions } from "@/components/case/CaseLayout";
import { CaseWalkthrough } from "@/components/case/CaseWalkthrough";
import { StatTiles } from "@/components/case/exhibits/Exhibit";
import {
  DcFlowExhibit,
  FiscalRiskExhibit,
  FiscalSpaceExhibit,
  RevaluationExhibit,
  RulesExhibit,
} from "@/components/case/exhibits/PensionExhibits";
import {
  JAMAICA,
  PENSION_CASE_FILE,
  PENSION_INTRO,
  PENSION_LESSONS,
  PENSION_RESULTS,
  PENSION_SOURCE_NOTE,
  PENSION_STEPS,
  PENSION_TENSIONS,
  PENSIONFISC,
} from "@/content/pension";

export const metadata: Metadata = {
  title: "Pension reform case study",
  description:
    "How Fraz Ahmed, at Pakistan's Ministry of Finance, revalued federal pension liabilities at PKR 12.0 trillion, co-drafted IMF programme pension commitments and built the legal framework for a funded defined-contribution scheme.",
};

/** One exhibit per walkthrough step, in PENSION_STEPS order. */
const VISUALS = [
  <FiscalRiskExhibit key="diagnose" />,
  <RevaluationExhibit key="revalue" />,
  <RulesExhibit key="rules" />,
  <DcFlowExhibit key="dc" />,
  <FiscalSpaceExhibit key="fiscal-space" />,
];

export default function PensionReformPage() {
  return (
    <article className="flex flex-col">
      <CaseHeader crumb="pension-reform" title={PENSION_INTRO.title} lede={PENSION_INTRO.lede} facts={PENSION_CASE_FILE} />
      <CaseSection id="problem" index="01" title="The problem">
        <ProblemStatement problem={PENSION_INTRO.problem} context={PENSION_INTRO.problemContext} />
      </CaseSection>
      <CaseSection id="walkthrough" index="02" title="Walkthrough">
        <p className="prose-body mb-10 text-ink/85">
          Five steps, from measuring the problem to building the replacement. Each step shows an exhibit with the
          figures behind it, what I did, and the numbered details worth noticing.
        </p>
        <CaseWalkthrough steps={PENSION_STEPS} visuals={VISUALS} captionSuffix="Figures from my CV; exhibit drawn for this page." />
      </CaseSection>
      <CaseSection id="results" index="03" title="Results">
        <ResultsGrid
          results={PENSION_RESULTS}
          note="Policy outcomes are collective: these are the parts I conducted, co-drafted, costed or drafted, as described in each step."
        />
      </CaseSection>
      <CaseSection id="jamaica" index="04" title={JAMAICA.title}>
        <p className="mb-6 font-mono text-xs text-muted">{JAMAICA.dates}</p>
        <div className="prose-body mb-8 text-ink/85">
          {JAMAICA.body.map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}
        </div>
        <StatTiles items={JAMAICA.stats} />
      </CaseSection>
      <CaseSection id="trade-offs" index="05" title="Trade-offs in the reform">
        <Tensions
          items={PENSION_TENSIONS}
          intro="Looking back, four tensions shaped the reform. Most decisions were about where to sit on these lines."
        />
      </CaseSection>
      <CaseSection id="building-now" index="06" title={PENSIONFISC.title}>
        <div className="glass flex max-w-3xl flex-col gap-3 rounded-xl p-5">
          <p className="leading-relaxed text-ink/90">{PENSIONFISC.body}</p>
          <p className="flex items-start gap-2 text-sm text-amber">
            <span aria-hidden="true">◆</span>
            {PENSIONFISC.status}
          </p>
        </div>
      </CaseSection>
      <CaseSection id="lessons" index="07" title="What I took from it">
        <Lessons items={PENSION_LESSONS} />
      </CaseSection>
      <CaseFooter note={PENSION_SOURCE_NOTE}>
        <Link href="/work/caretrak/" className="btn-ghost">
          Next: CareTrak
        </Link>
      </CaseFooter>
    </article>
  );
}

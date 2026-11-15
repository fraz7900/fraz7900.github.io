import type { Metadata } from "next";
import Link from "next/link";
import { CaseFooter, CaseHeader, CaseSection, Lessons, ProblemStatement, ResultsGrid, Tensions } from "@/components/case/CaseLayout";
import { CaseWalkthrough } from "@/components/case/CaseWalkthrough";
import { FoundationMap } from "@/components/case/FoundationMap";
import { CodingReview } from "@/components/case/mockups/CodingReview";
import { EvaluationScorecard } from "@/components/case/mockups/EvaluationScorecard";
import { IntegrationFlow } from "@/components/case/mockups/IntegrationFlow";
import { OpsDashboard } from "@/components/case/mockups/OpsDashboard";
import { ReadinessTracker } from "@/components/case/mockups/ReadinessTracker";
import { CASE_FILE, FOUNDATION, INTRO, LESSONS, RESULTS, RESULTS_NOTE, STEPS, TENSIONS, VISUALS_NOTE } from "@/content/caretrak";

export const metadata: Metadata = {
  title: "CareTrak case study",
  description:
    "How Fraz Ahmed, as product manager at Persivia, took CareTrak's EHR-integrated clinical AI from integration to production on a platform serving 50+ facilities.",
};

/** One visual per walkthrough step, in STEPS order. */
const VISUALS = [
  <IntegrationFlow key="integration" />,
  <ReadinessTracker key="readiness" />,
  <EvaluationScorecard key="evaluation" />,
  <CodingReview key="review" />,
  <OpsDashboard key="operations" />,
];

export default function CareTrakPage() {
  return (
    <article className="flex flex-col">
      <CaseHeader track={{ id: "product-management", href: "/work/product-management/" }} crumb="caretrak" title={INTRO.title} lede={INTRO.lede} facts={CASE_FILE} />
      <CaseSection id="problem" index="01" title="The problem">
        <ProblemStatement problem={INTRO.problem} context={INTRO.problemContext} />
      </CaseSection>
      <CaseSection id="walkthrough" index="02" title="Walkthrough">
        <p className="prose-body mb-10 text-ink/85">
          Five steps, in the order a facility went through them. Each one shows a mockup of the product surface,
          what I did, and the numbered details worth noticing.
        </p>
        <CaseWalkthrough steps={STEPS} visuals={VISUALS} captionSuffix="Original illustration, synthetic data." />
      </CaseSection>
      <CaseSection id="results" index="03" title="Results">
        <ResultsGrid results={RESULTS} note={RESULTS_NOTE} />
      </CaseSection>
      <CaseSection id="trade-offs" index="04" title="Trade-offs in the rollout">
        <Tensions
          items={TENSIONS}
          intro="Looking back, four tensions run through the work. Each release question came down to where a cohort sat on these lines."
        />
      </CaseSection>
      <CaseSection id="foundation" index="05" title="What it set up">
        <figure className="flex flex-col gap-3">
          <FoundationMap />
          <figcaption className="max-w-3xl text-sm text-muted">{FOUNDATION.caption}</figcaption>
        </figure>
      </CaseSection>
      <CaseSection id="lessons" index="06" title="What I took from it">
        <Lessons items={LESSONS} />
      </CaseSection>
      <CaseFooter note={VISUALS_NOTE}>
        <Link href="/work/pension-reform/" className="btn-ghost">
          Next: pension reform
        </Link>
      </CaseFooter>
    </article>
  );
}

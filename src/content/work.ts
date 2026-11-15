/**
 * Work index content. Only entries with `href` are public, inspectable work.
 * Entries in IN_PREPARATION are named without links until their content is verified.
 */

export interface WorkEntry {
  readonly title: string;
  readonly kind: string;
  /** The decision or problem the work addresses. */
  readonly decision: string;
  readonly role: string;
  /** What a visitor can open and check. */
  readonly inspect: string;
  readonly href: string;
}

export interface PlannedWork {
  readonly title: string;
  readonly kind: string;
  readonly decision: string;
}

export const PUBLISHED_WORK: readonly WorkEntry[] = [
  {
    title: "CareTrak: clinical AI from integration to production",
    kind: "Case study · Healthcare SaaS · Persivia",
    decision:
      "How to bring an EHR-integrated, AI-supported workflow into production on a platform serving 50+ facilities without letting data readiness, evaluation or performance slip.",
    role: "Product Manager, 2020–2022. Led a team of 10 engineers and 3 QA analysts; led the operational launch, NLP evaluation criteria and operational analytics.",
    inspect: "A five-step walkthrough with annotated product mockups, results, trade-offs and lessons.",
    href: "/work/caretrak/",
  },
  {
    title: "Workflow ROI calculator",
    kind: "Tool",
    decision: "Is a workflow change worth its recurring cost, and how much time must it save to break even?",
    // Confirmed by Fraz (2026-11-14): he designed the model.
    role: "Designed the model and built the tool.",
    inspect: "Editable assumptions, the formula, a worked example and the break-even threshold.",
    href: "/tools/workflow-roi/",
  },
];

export const IN_PREPARATION: readonly PlannedWork[] = [
  {
    title: "Pension reform at Pakistan’s Ministry of Finance",
    kind: "Case study · Public finance",
    decision:
      "Moving federal pensions from an unfunded defined-benefit scheme toward a funded defined-contribution scheme: the PKR 12.0 trillion revaluation, the IMF EFF pension commitments and the DC legal framework.",
  },
  {
    title: "Jamaica digital pension-system design",
    kind: "Research · World Bank",
    decision:
      "Extending pension coverage to 174,000 informal workers through digital ID enrolment, data exchange, mobile payments, auto-enrolment and micro-pensions.",
  },
];

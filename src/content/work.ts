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
    title: "Pension reform: from an unfunded promise to a funded scheme",
    kind: "Case study · Public finance · Ministry of Finance",
    decision:
      "How to reform a federal pension promise costing 14% of net revenue: revalue the liability, turn it into IMF programme rules, and build a funded defined-contribution scheme.",
    role: "Section Officer, Regulations Wing, 2022–2025. Conducted the PKR 12.0tn revaluation, co-drafted the IMF EFF pension commitments and drafted the DC legal framework.",
    inspect: "A five-step walkthrough with sourced exhibits, the Jamaica follow-on with the World Bank, trade-offs and lessons.",
    href: "/work/pension-reform/",
  },
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

/** Work named without links until it is ready. Empty lists hide the section. */
export const IN_PREPARATION: readonly PlannedWork[] = [];

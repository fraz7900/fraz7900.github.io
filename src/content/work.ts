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
    title: "Workflow ROI calculator",
    kind: "Tool",
    decision: "Is a workflow change worth its recurring cost, and how much time must it save to break even?",
    // Keep this wording until Fraz confirms how to describe his authorship of the model.
    role: "Built for this site to show how I frame a workflow investment decision.",
    inspect: "Editable assumptions, the formula, a worked example and the break-even threshold.",
    href: "/tools/workflow-roi/",
  },
];

export const IN_PREPARATION: readonly PlannedWork[] = [
  {
    title: "EHR integration and rollout",
    kind: "Case study · Healthcare SaaS",
    decision: "Product delivery for an EHR integration at Persivia (CareTrak).",
  },
  {
    title: "Pension reform",
    kind: "Case study · Public finance",
    decision: "Enterprise strategy for a pension reform effort.",
  },
];

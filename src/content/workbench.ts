/**
 * Decision Workbench (About page): one record per area, shared by the scene labels, the controls
 * and the detail panel. Every sentence restates something already published on this site:
 * - Product management: src/content/ehr.ts (EHR interoperability case)
 * - Consulting: src/content/wabtec.ts (Wabtec Mining case)
 * - Public finance: src/content/pension.ts and the About narrative
 * - Career advising: src/content/advising/services.ts and faq.ts (no client stories are published)
 * - Research: the "Pricing Firms Back onto the Grid" working paper summary in src/content/work.ts
 * Don't add figures, findings, citations or results that aren't already sourced there.
 */

export type AreaId = "research" | "product" | "consulting" | "public-finance" | "advising";
export type PracticeAreaId = Exclude<AreaId, "research">;

export interface WorkbenchLink {
  readonly label: string;
  readonly href: string;
}

export interface ProcessStep {
  readonly name: string;
  /** What this step looked like in the example (or, without one, in a session). */
  readonly detail: string;
}

export interface WorkbenchExample {
  readonly title: string;
  readonly context: string;
}

export interface WorkbenchArea {
  readonly id: AreaId;
  readonly index: string;
  readonly title: string;
  /** Short terminal-style tag shown with the title. */
  readonly tag: string;
  /** What the object on the bench is, in words: the scene's text equivalent. */
  readonly objects: string;
  readonly purpose: string;
  readonly steps: readonly ProcessStep[];
  readonly example: WorkbenchExample | null;
  /** A caveat that must travel with the area (e.g. no guarantees). */
  readonly note: string | null;
  readonly links: readonly WorkbenchLink[];
}

export const RESEARCH_INFORMS: Readonly<Record<PracticeAreaId, string>> = {
  product:
    "On CareTrak the case for API-first started with evidence: our own audit found data missing from what health systems sent us, before any client had to escalate it.",
  consulting:
    "On the Wabtec engagement every figure carried an evidence ID and a grade, and a script checked all 50 slide claims against archived sources.",
  "public-finance":
    "Diagnosing the pension bill in revenue terms (14.3% of federal net revenue) made the trade-off visible to decision-makers who don’t read actuarial reports.",
  advising:
    "Admissions and scholarship updates on this site link to their official source and say when I last checked it; anything I couldn’t check is labelled that way.",
};

export const WORKBENCH_AREAS: readonly WorkbenchArea[] = [
  {
    id: "research",
    index: "01",
    title: "Research",
    tag: "evidence notebook",
    objects: "an open notebook with a question, a staged method, layered evidence and a chart of findings",
    purpose:
      "Applied economics with administrative data: how policy actually changes behaviour, and how to measure it honestly. The notebook sits at the centre because the same habit feeds every other setting.",
    steps: [
      {
        name: "Question",
        detail:
          "Can a levy on captive power, Pakistan’s 2025 Captive Power Levy, price firms back onto the grid, and how should that be evaluated when infrastructure is constrained?",
      },
      { name: "Method", detail: "A staged method for evaluating industrial policy under infrastructure constraints." },
      { name: "Evidence", detail: "Registry, meter and feeder data." },
      {
        name: "Findings",
        detail: "31.0% of licensed gas/RLNG capacity is unclassified, and grid switching depends on reliable service and utility finances.",
      },
      {
        name: "Implications",
        detail:
          "Because grid switching depends on reliable service and utility finances, the levy can’t be judged on price alone; an honest evaluation has to look at the grid too.",
      },
    ],
    example: {
      title: "Pricing Firms Back onto the Grid: A Staged Method for Evaluating Industrial Policy under Infrastructure Constraints",
      context: "Working paper with A. A. Janjua and Z. Ahmad, 2026. Drafts aren’t posted here.",
    },
    note: null,
    links: [{ label: "Research and working papers", href: "/work/research/" }],
  },
  {
    id: "product",
    index: "02",
    title: "Product management",
    tag: "product sketch",
    objects: "a product sketch, a row of workflow cards and a release checklist",
    purpose:
      "Deciding what a team should build, how it will know the work is succeeding, and how to roll it out to the people who have to use it.",
    steps: [
      { name: "Problem framing", detail: "Missing data turned up in our own audits of what health systems’ EHRs sent as flat files." },
      {
        name: "Prioritisation",
        detail: "Standardised flat files and API-first came out about even on data quality; API-first made each new connection repeatable.",
      },
      { name: "Evaluation", detail: "I wrote CareTrak’s go-live acceptance criteria and tracked data-readiness milestones." },
      { name: "Rollout", detail: "Performance testing, then production; implementation time fell by a reported 30%." },
    ],
    example: {
      title: "Closing EHR interoperability gaps across 50+ health systems",
      context: "Persivia · CareTrak · 2020–2022",
    },
    note: null,
    links: [
      { label: "EHR interoperability case study", href: "/work/product-management/ehr-interoperability/" },
      { label: "CareTrak case study", href: "/work/caretrak/" },
    ],
  },
  {
    id: "consulting",
    index: "03",
    title: "Consulting",
    tag: "issue tree",
    objects: "an issue tree, a stack of evidence cards and a recommendation memo",
    purpose:
      "Strategy work with a quantitative core: build the model, show its sensitivity, and say plainly what the evidence can’t support.",
    steps: [
      { name: "Question", detail: "How exposed is Wabtec to Chinese haul trucks, and what should it do now?" },
      {
        name: "Structured analysis",
        detail: "Financial statements of Komatsu and XCMG, a battery-pack cost model with sensitivity, and a UN Comtrade trade-data pipeline.",
      },
      {
        name: "Options",
        detail: "Three pathways: retain the drive on Chinese diesel-electric trucks, be displaced where battery trucks use miner- or OEM-owned powertrains, or coexist through OEM-agnostic collision avoidance.",
      },
      {
        name: "Recommendation",
        detail: "Win the drive on Chinese diesel-electric trucks now, get into battery powertrains before specifications lock, and sell OEM-agnostic collision avoidance.",
      },
    ],
    example: {
      title: "The China question in mining: should Wabtec worry about Chinese haul trucks?",
      context: "CMU × Kearney student consulting lab for Wabtec Mining · 2026",
    },
    note: null,
    links: [
      { label: "Wabtec mining case study", href: "/work/consulting/wabtec-mining/" },
      { label: "Consulting work", href: "/work/consulting/" },
    ],
  },
  {
    id: "public-finance",
    index: "04",
    title: "Public finance",
    tag: "government service",
    objects: "a budget ledger, an analytical model and an institutional diagram",
    purpose: "Size the problem, turn it into rules, and get the institutions to deliver.",
    steps: [
      {
        name: "Policy question",
        detail: "How do you reform a pension promise already costing 14% of federal net revenue without breaking faith with 1.8 million pensioners or the budget?",
      },
      { name: "Fiscal analysis", detail: "The actuarial revaluation of federal pension liabilities (July 2023): PKR 12.0 trillion." },
      { name: "Trade-offs", detail: "Costed parametric reforms for 1.8 million pensioners." },
      {
        name: "Implementation",
        detail: "Co-drafted the pension commitments for the IMF Extended Fund Facility and drafted the legal framework for a funded defined-contribution scheme.",
      },
    ],
    example: {
      title: "Pension reform: from an unfunded promise to a funded scheme",
      context: "Ministry of Finance, Pakistan · 2022–2025",
    },
    note: null,
    links: [
      { label: "Pension reform case study", href: "/work/pension-reform/" },
      { label: "Public finance work", href: "/work/public-finance/" },
    ],
  },
  {
    id: "advising",
    index: "05",
    title: "Career advising",
    tag: "roadmap",
    objects: "an annotated résumé, an application roadmap and a conversation",
    purpose: "One-to-one guidance for students and professionals planning their next move: careers, admissions, scholarships and test preparation.",
    steps: [
      { name: "Goals", detail: "Clarify what you’re aiming for: a direction, a programme shortlist or a test date." },
      { name: "Preparation", detail: "Plan the milestones: applications, recommendation requests, or a study plan that fits your weeks." },
      { name: "Feedback", detail: "Feedback on your CV or LinkedIn profile, or on a statement of purpose that is genuinely yours." },
      { name: "Next steps", detail: "Leave with one practical next step." },
    ],
    example: null,
    note: "Guidance, not a guarantee: I can’t promise an admission, a scholarship, a score or a job. Client stories appear only with consent on file, and none are published yet.",
    links: [
      { label: "Advising", href: "/advising/" },
      { label: "Book a conversation", href: "/advising/book/" },
    ],
  },
];

/** The scene in words, for the overview and for anyone not looking at the illustration. */
export const SCENE_DESCRIPTION =
  "The illustration is a workbench. An open research notebook sits at the centre, and lines run from it to four objects: a product sketch with workflow cards and a release checklist; an issue tree with evidence cards and a recommendation memo; a budget ledger with an analytical model and an institutional diagram; and an annotated résumé with an application roadmap and a conversation. Each line stands for research informing that setting; it’s a way of working, not a system diagram.";

export function areaById(id: AreaId): WorkbenchArea {
  const area = WORKBENCH_AREAS.find((candidate) => candidate.id === id);
  if (!area) throw new Error(`Unknown workbench area ${id}`);
  return area;
}

export const PRACTICE_AREAS = WORKBENCH_AREAS.filter((area): area is WorkbenchArea & { id: PracticeAreaId } => area.id !== "research");

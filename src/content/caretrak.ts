/**
 * CareTrak case study content. Sources: "CareTrak — Consolidated Case Study.md" and
 * Fraz's Persivia CV bullets (both supplied by Fraz, Nov 2026). Every figure here is
 * self-reported; keep the "reported" framing until baselines and periods are documented.
 * Mockups are original illustrations with synthetic data, not Persivia screenshots.
 */

import type { WalkthroughStep } from "./walkthrough";

export type { WalkthroughNote, WalkthroughStep } from "./walkthrough";

export const CASE_FILE = [
  { term: "Role", detail: "Product Manager, CareTrak population health and value-based care platform" },
  { term: "Company", detail: "Persivia" },
  { term: "Dates", detail: "September 2020 – October 2022" },
  { term: "Team", detail: "Led 10 software engineers and 3 quality assurance analysts" },
  { term: "Worked with", detail: "Data Engineering, Statistics and Clinical teams" },
  { term: "Tools", detail: "R and RStudio Workbench, Databricks, SQL" },
] as const;

export const INTRO = {
  title: "CareTrak: taking clinical AI from integration to production",
  lede:
    "At Persivia I led the operational launch of CareTrak, an AI-supported clinical workflow and population health platform serving 50+ facilities. This walkthrough follows the work in the order a facility experienced it: connecting EHR data, agreeing on what the data means, evaluating the NLP, putting review inside the clinician’s workflow, and measuring the launch.",
  problem:
    "How do you bring an EHR-integrated, AI-supported workflow into production, and keep adding facility cohorts, without letting data readiness, evaluation or performance slip?",
  problemContext:
    "An AI finding is only useful when the data behind it is available, everyone agrees what it means, and the workflow delivers it reliably while a clinician is working. So the delivery problem spanned integration, clinical interpretation, evaluation, operational readiness and adoption at once.",
} as const;

export const STEPS: readonly WalkthroughStep[] = [
  {
    id: "connect",
    title: "Connect the data",
    summary: "API-first interoperability brought EHR data from 50+ health systems into CareTrak.",
    myWork: [
      "Led a team of 10 software engineers and 3 QA analysts to close EHR interoperability gaps with an API-first architecture across 50+ health systems, replacing flat-file feeds.",
      "Implementation time fell by a reported 30%.",
    ],
    whyItMatters:
      "Every later step depends on this one. A repeatable integration pattern is what makes adding the next facility cohort a project rather than a rebuild.",
    mockupLabel: "Integration flow, illustrative",
    notes: [
      { pin: 1, text: "Each source system connects through the same API layer instead of a one-off interface." },
      { pin: 2, text: "Clinical, claims and registry data land in one patient-centred model." },
      { pin: 3, text: "Downstream modules (risk adjustment, care management, analytics) read from that one model." },
    ],
  },
  {
    id: "ready",
    title: "Agree on what the data means",
    summary: "Readiness milestones and shared definitions across Data Engineering, Statistics and Clinical.",
    myWork: [
      "Tracked data-readiness milestones for each facility cohort.",
      "Kept definitions consistent across Data Engineering, Statistics and Clinical teams, so a metric meant the same thing in every review.",
    ],
    whyItMatters:
      "Without shared definitions, a cohort can look ready to engineering and not ready to clinicians. One definition per metric, with an owner, turns that argument into a checklist.",
    mockupLabel: "Cohort readiness tracker, illustrative",
    notes: [
      { pin: 1, text: "Each cohort moves through the same milestones, so readiness is comparable across facilities." },
      { pin: 2, text: "A blocked milestone names what is missing and who owns it." },
      { pin: 3, text: "Every metric has one written definition and one owning team." },
    ],
  },
  {
    id: "evaluate",
    title: "Evaluate the NLP before it reaches users",
    summary: "Test sets, acceptance criteria and performance metrics for NLP that reads clinical notes.",
    myWork: [
      "Contributed to clinical NLP evaluation frameworks: defined test sets, acceptance criteria and performance metrics.",
      "Used those criteria to support adoption across new facility cohorts.",
    ],
    whyItMatters:
      "A note that mentions a condition isn’t the same as a documented diagnosis. Evaluation has to test the cases that fool a model, like negation and history, against the task clinicians actually do.",
    mockupLabel: "Evaluation scorecard, illustrative",
    notes: [
      { pin: 1, text: "The test set is built to include the hard cases, not just typical notes." },
      { pin: 2, text: "Each acceptance criterion names the failure it guards against." },
      { pin: 3, text: "A cohort is cleared only when every criterion is met for its documentation." },
    ],
  },
  {
    id: "review",
    title: "Keep the clinician in the loop",
    summary: "NLP-supported candidates for HCC coding, reviewed inside the clinical workflow.",
    myWork: [
      "Coordinated delivery of CareTrak’s EHR-integrated clinical decision support, where NLP-supported algorithms read patient notes to support HCC (Hierarchical Condition Category) coding.",
      "Managed the risk-adjustment analytics (CMS-HCC) and chronic care management modules.",
    ],
    whyItMatters:
      "The output is a candidate, not a code. Showing the supporting text next to each candidate, and making uncertain ones visible, keeps the decision with the person accountable for documentation.",
    mockupLabel: "Coding review workspace, illustrative",
    notes: [
      { pin: 1, text: "Candidates arrive as a review queue, not as codes written into the record." },
      { pin: 2, text: "The note text that triggered each candidate sits beside it." },
      { pin: 3, text: "A likely negated mention is flagged for review, which is exactly what evaluation is meant to catch." },
      { pin: 4, text: "The reviewer accepts, rejects or asks for clarification. The decision stays human." },
    ],
  },
  {
    id: "launch",
    title: "Launch, then measure what happened",
    summary: "Performance testing, production rollout and one dashboard for quality, uptime and use.",
    myWork: [
      "Led performance testing and took CareTrak into production.",
      "Built a unified operations dashboard in R (RStudio Workbench) combining clinical quality metrics, system uptime and workflow KPIs.",
      "Used Databricks and SQL window functions to analyse encounters, chronic disease registries and claims histories, surfacing cohort insights for care coordination.",
    ],
    whyItMatters:
      "Quality, reliability and use each tell part of the story. Putting them in one view lets a release review ask one question: is this cohort working, for clinicians and for the system?",
    mockupLabel: "Operations dashboard, illustrative",
    notes: [
      { pin: 1, text: "Clinical quality, system reliability and workflow adoption sit side by side." },
      { pin: 2, text: "Each panel states its definition and owner, using the shared definitions from step 2." },
      { pin: 3, text: "Status is read per cohort, which is how rollout decisions were made." },
    ],
  },
];

export const RESULTS = [
  { value: "50+", label: "facilities served by the CareTrak platform" },
  { value: "30%", label: "shorter implementation time from API-first interoperability" },
  { value: "+22%", label: "clinician productivity" },
  { value: "+20%", label: "active user engagement" },
] as const;

export const RESULTS_NOTE =
  "These are the figures as reported on the project. The dashboard tracked them alongside the rest of the rollout work, so I don’t attribute them to any single change.";

export const TENSIONS = [
  { pull: "Expansion pace", against: "readiness in each cohort" },
  { pull: "Earlier release", against: "complete, consistently defined data" },
  { pull: "Broader NLP capture", against: "fewer unsupported suggestions" },
  { pull: "Locally useful KPIs", against: "measures comparable across facilities" },
] as const;

export const FOUNDATION = {
  layers: {
    data: ["Patient encounters", "Chronic disease registries", "Claims histories"],
    foundation: [
      "EHR integration",
      "Data readiness",
      "Clinical NLP evaluation",
      "Operational analytics",
      "Performance and production rollout",
    ],
    experiences: [
      { name: "Clinician assistants", task: "Clinical workflow support" },
      { name: "Patient-facing assistant", task: "A different audience and task" },
      { name: "Revenue cycle assistants", task: "Documentation and coding workflows" },
    ],
  },
  caption:
    "The groundwork from this period later supported clinician assistants, a patient-facing assistant and revenue cycle assistants. The map shows capability reuse, not system architecture, and I don’t claim ownership of those later products.",
} as const;

export const LESSONS = [
  {
    title: "Invest in foundations that more than one product can use",
    body: "Integration, data readiness, evaluation and measurement outlived the first launch. That reuse is why the background work mattered.",
  },
  {
    title: "Treat evaluation as part of the product",
    body: "Test sets and acceptance criteria tie model performance to a specific task and a specific cohort. They should gate expansion, not end after the demo.",
  },
  {
    title: "Put quality, reliability and use in one view",
    body: "Each tells a different part of the story. Seeing them together makes a release decision a single conversation.",
  },
  {
    title: "Expand by audience and task",
    body: "Clinicians, patients and revenue cycle teams need different information, permissions and success measures. A shared foundation doesn’t mean one evaluation fits all three.",
  },
] as const;

export const VISUALS_NOTE =
  "Every screen on this page is an original illustration drawn for this case study with synthetic data. None is a Persivia screenshot, and none shows the historical product’s exact features, codes or numbers.";

/**
 * Product management portfolio content. Sources: Fraz's CV (Assets/Fraz_Ahmed_CV_ADB_YPP.pdf),
 * the CareTrak consolidated case study, and the site's own ROI calculator.
 * Every evidence item names its source so employers can tell facts from interpretation.
 */

export type EvidenceSource = "CV" | "Case study" | "Reported metric" | "Retrospective" | "Live tool" | "Coursework";

export const SOURCE_NOTE: Record<EvidenceSource, string> = {
  CV: "Stated in my CV",
  "Case study": "Documented in the CareTrak case study",
  "Reported metric": "Figure as reported on the project; baseline and period not shown",
  Retrospective: "My reading of the work, looking back",
  "Live tool": "Something you can use on this site",
  Coursework: "Current graduate coursework",
};

export interface Evidence {
  readonly claim: string;
  readonly detail: string;
  readonly source: EvidenceSource;
  readonly href?: string;
}

export const PRODUCT_INTRO = {
  title: "Product management portfolio",
  positioning:
    "I’m a product manager for regulated, data-heavy products. I took an EHR-integrated clinical NLP workflow into production on a platform serving 50+ healthcare facilities, and I bring a public-finance analyst’s discipline to product strategy: frame the decision, make the trade-offs explicit, and measure what changes.",
  roles: ["Product Manager", "AI Product Manager", "Product strategy"],
} as const;

export const PRODUCT_FACTS = [
  { value: "2020–2022", label: "Product Manager, CareTrak, Persivia" },
  { value: "10 + 3", label: "software engineers and QA analysts led" },
  { value: "50+", label: "healthcare facilities on the platform" },
  { value: "30%", label: "shorter EHR implementation time" },
] as const;

// ---------- Hiring lenses: what each kind of employer is looking for, and the evidence ----------

export interface HiringLens {
  readonly id: string;
  readonly role: string;
  readonly question: string;
  readonly evidence: readonly Evidence[];
}

export const HIRING_LENSES: readonly HiringLens[] = [
  {
    id: "pm",
    role: "Product Manager",
    question: "Can this person own a product from integration to adoption?",
    evidence: [
      {
        claim: "Led a cross-functional delivery team",
        detail: "Led 10 software engineers and 3 QA analysts to close EHR interoperability gaps across 50+ health systems.",
        source: "CV",
      },
      {
        claim: "Owned the launch, not just the backlog",
        detail: "Led CareTrak’s operational launch: performance testing, production rollout and adoption across new facility cohorts.",
        source: "Case study",
        href: "/work/caretrak/#walkthrough",
      },
      {
        claim: "Made readiness a gate",
        detail: "Tracked data-readiness milestones per cohort and kept metric definitions consistent across Data Engineering, Statistics and Clinical teams.",
        source: "Case study",
        href: "/work/caretrak/#walkthrough",
      },
      {
        claim: "Measured adoption, quality and reliability together",
        detail: "Built an operations dashboard in R combining clinical quality metrics, system uptime and workflow KPIs.",
        source: "CV",
      },
      {
        claim: "Moved the numbers that mattered",
        detail: "Implementation time down 30%; clinician productivity up 22% and active user engagement up 20%.",
        source: "Reported metric",
      },
    ],
  },
  {
    id: "ai-pm",
    role: "AI Product Manager",
    question: "Does this person know how to ship AI that people can trust?",
    evidence: [
      {
        claim: "Treated evaluation as part of the product",
        detail: "Defined test sets, acceptance criteria and performance metrics for clinical NLP that reads patient notes to support HCC coding.",
        source: "Case study",
        href: "/work/caretrak/#walkthrough",
      },
      {
        claim: "Designed for the cases that fool models",
        detail: "A note that mentions a condition isn’t a diagnosis: negation, historical conditions and conflicting notes belong in the test set and in the review experience.",
        source: "Case study",
        href: "/work/caretrak/#walkthrough",
      },
      {
        claim: "Kept the human accountable",
        detail: "NLP output arrives as candidates with their supporting note text; the reviewer accepts, rejects or asks for clarification.",
        source: "Retrospective",
        href: "/work/caretrak/#walkthrough",
      },
      {
        claim: "Separated model quality from application performance",
        detail: "Model evaluation and application performance testing are different questions: a good model on a slow screen still fails users.",
        source: "Retrospective",
      },
      {
        claim: "Built predictive models for value-based care",
        detail: "Developed predictive models for patient risk, utilisation and cost burden from claims and clinical data.",
        source: "CV",
      },
      {
        claim: "Current LLM work",
        detail: "The CareTrak work was classical clinical NLP (2020–2022), not LLMs. I’m now studying LLM applications at CMU: Application of NLX and LLMs, and Making Products Count (Data Science for Product Managers).",
        source: "Coursework",
      },
    ],
  },
  {
    id: "strategy",
    role: "Product strategy",
    question: "Can this person frame investment decisions and think in platforms?",
    evidence: [
      {
        claim: "Invested in a reusable foundation",
        detail: "Integration, readiness, evaluation and measurement outlived the first launch and later supported clinician, patient-facing and revenue-cycle assistants.",
        source: "Case study",
        href: "/work/caretrak/#foundation",
      },
      {
        claim: "Understood the business model",
        detail: "Managed health-financing analytics, including CMS-HCC risk adjustment for Medicare Advantage, aligning payments with patient risk.",
        source: "CV",
      },
      {
        claim: "Frames investments as break-even questions",
        detail: "Designed the workflow ROI model: how much time a change must save before it covers its recurring cost.",
        source: "Live tool",
        href: "/tools/workflow-roi/",
      },
      {
        claim: "Makes trade-offs explicit under constraints",
        detail: "At Pakistan’s Ministry of Finance I turned a PKR 12.0 trillion pension liability into rules, financing paths and a funded scheme, the same discipline I bring to product decisions.",
        source: "CV",
        href: "/work/pension-reform/",
      },
    ],
  },
];

// ---------- The CareTrak product-thinking canvas ----------

export interface CanvasStage {
  readonly id: string;
  readonly label: string;
  readonly headline: string;
  readonly thinking: string;
  readonly points: readonly Evidence[];
}

export const CARETRAK_CANVAS: readonly CanvasStage[] = [
  {
    id: "problem",
    label: "Problem",
    headline: "Get clinical NLP working inside real EHR workflows, and keep it working as each new cohort of facilities came on.",
    thinking: "The product wasn’t the model. It was a dependable workflow that clinicians would trust and facilities could switch on quickly.",
    points: [
      { claim: "AI in the workflow", detail: "NLP read patient notes to support HCC coding inside an EHR-integrated clinical decision support product.", source: "Case study" },
      { claim: "Scale by cohort", detail: "The platform served 50+ facilities, so every new cohort had to reach the same bar.", source: "CV" },
    ],
  },
  {
    id: "users",
    label: "Users",
    headline: "Four groups with different jobs to be done.",
    thinking: "Each group judged success differently, so the product had to serve all four without trading one off silently.",
    points: [
      { claim: "Clinicians and coders", detail: "Need candidates they can verify quickly, with the evidence in front of them.", source: "Case study" },
      { claim: "Care coordination teams", detail: "Need cohort insights from encounters, registries and claims.", source: "CV" },
      { claim: "Health systems and implementation teams", detail: "Need their EHR data connected without a bespoke project each time.", source: "CV" },
      { claim: "Internal Data, Statistics and Clinical teams", detail: "Need one shared meaning for every metric.", source: "Case study" },
    ],
  },
  {
    id: "constraints",
    label: "Constraints",
    headline: "Heterogeneous data, clinical nuance and a regulated payment model.",
    thinking: "Constraints were the strategy input: each one became a gate, a test or a design rule.",
    points: [
      { claim: "Many EHRs", detail: "Interoperability gaps across 50+ health systems.", source: "CV" },
      { claim: "Clinical language", detail: "Negated, historical and conflicting mentions can look like diagnoses.", source: "Case study" },
      { claim: "Production reality", detail: "Performance under real use, not just model accuracy.", source: "Case study" },
      { claim: "Regulated economics", detail: "CMS-HCC risk adjustment ties documentation to payment, so unsupported suggestions carry real cost.", source: "CV" },
    ],
  },
  {
    id: "bets",
    label: "Bets",
    headline: "Five product bets, each answering a constraint.",
    thinking: "Invest in the boring layers (integration, readiness, evaluation, measurement) because every later feature depends on them.",
    points: [
      { claim: "API-first interoperability", detail: "One connection pattern reused per source type.", source: "CV" },
      { claim: "Readiness as a release gate", detail: "Milestones and shared definitions per cohort.", source: "Case study" },
      { claim: "Evaluation as a product capability", detail: "Test sets with hard cases; acceptance criteria before go-live.", source: "Case study" },
      { claim: "Human-in-the-loop review", detail: "Candidates with evidence; uncertain ones flagged; the reviewer decides.", source: "Retrospective" },
      { claim: "One operating view", detail: "Quality, uptime and workflow KPIs on one R dashboard.", source: "CV" },
    ],
  },
  {
    id: "measures",
    label: "Measures",
    headline: "Quality, reliability and use, read per cohort.",
    thinking: "No single number tells you a clinical AI product is working. Three views together turn a release review into one conversation.",
    points: [
      { claim: "Clinical quality", detail: "Clinical quality metrics on the operations dashboard.", source: "CV" },
      { claim: "Reliability", detail: "System uptime and performance testing before production.", source: "CV" },
      { claim: "Adoption", detail: "Workflow KPIs and active engagement.", source: "CV" },
    ],
  },
  {
    id: "outcome",
    label: "Outcome",
    headline: "Faster implementations, more productive clinicians, and a foundation for what came next.",
    thinking: "The groundwork outlived the launch, which is the test of a good platform bet.",
    points: [
      { claim: "30% shorter implementation time", detail: "From API-first interoperability.", source: "CV" },
      { claim: "+22% clinician productivity", detail: "With the operations dashboard tracking it.", source: "Reported metric" },
      { claim: "+20% active user engagement", detail: "Alongside workflow and analytics work.", source: "Reported metric" },
      { claim: "Foundation reused", detail: "Later supported clinician, patient-facing and revenue-cycle assistants (I don’t claim ownership of those).", source: "Case study" },
    ],
  },
];

// ---------- Product work list (add new PM experience here) ----------

export interface ProductWork {
  readonly title: string;
  readonly kind: string;
  readonly years: string;
  readonly summary: string;
  readonly href: string;
  readonly cta: string;
}

export const PRODUCT_WORK: readonly ProductWork[] = [
  {
    title: "CareTrak: clinical AI from integration to production",
    kind: "Case study · Healthcare SaaS · Persivia",
    years: "2020–2022",
    summary: "A five-step walkthrough with annotated product mockups: integration, data readiness, NLP evaluation, clinician review and launch metrics.",
    href: "/work/caretrak/",
    cta: "Read the full case study",
  },
  {
    title: "Workflow ROI calculator",
    kind: "Live tool · Product strategy",
    years: "2026",
    summary: "A break-even model for workflow investments that I designed and built: change the assumptions and see what a change must save to pay for itself.",
    href: "/tools/workflow-roi/",
    cta: "Use the calculator",
  },
];

export const PRODUCT_TOOLKIT = [
  "Problem framing and trade-off analysis",
  "Release gates and cohort rollout",
  "AI evaluation design",
  "Metric definitions and dashboards",
  "Interoperability and data pipelines",
  "Python · R · SQL · Databricks",
] as const;

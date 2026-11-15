/**
 * Work, organised into tracks. Sources: Fraz's CV (Assets/Fraz_Ahmed_CV_ADB_YPP.pdf) and the
 * case studies on this site. Add new work by appending a WorkItem with the right `track`.
 * Items without `href` are listed but have no page yet. Never add unverified work.
 */

export type TrackId = "product-management" | "public-finance" | "consulting" | "research" | "guidance";

export interface Track {
  readonly id: TrackId;
  readonly title: string;
  readonly href: string;
  readonly summary: string;
  /** Who this track is most useful for. */
  readonly forWhom: string;
}

export type WorkStatus = "case-study" | "tool" | "listed" | "in-development" | "service" | "working-paper";

export const STATUS_LABEL: Record<WorkStatus, string> = {
  "case-study": "Case study",
  tool: "Live tool",
  listed: "Summary",
  "in-development": "In development",
  service: "Service",
  "working-paper": "Working paper",
};

export interface WorkItem {
  readonly track: TrackId;
  readonly title: string;
  readonly context: string;
  readonly years?: string;
  readonly summary: string;
  readonly status: WorkStatus;
  readonly href?: string;
}

export const TRACKS: readonly Track[] = [
  {
    id: "product-management",
    title: "Product management",
    href: "/work/product-management/",
    summary: "Healthcare SaaS and clinical AI: taking an EHR-integrated NLP workflow from integration to production.",
    forWhom: "Hiring for product manager, AI product manager or product strategy roles",
  },
  {
    id: "public-finance",
    title: "Public finance",
    href: "/work/public-finance/",
    summary: "Pension reform at Pakistan’s Ministry of Finance, digital pension design with the World Bank, and export-competitiveness schemes.",
    forWhom: "Public sector, development finance and policy roles",
  },
  {
    id: "consulting",
    title: "Consulting",
    href: "/work/consulting/",
    summary: "Quant-heavy strategy work: financial-statement analysis, cost modelling and trade data on Chinese disruption in mining equipment, for Wabtec with Kearney.",
    forWhom: "Strategy and management consulting roles",
  },
  {
    id: "research",
    title: "Research",
    href: "/work/research/",
    summary: "Working papers on industrial policy, digital public infrastructure and trade, plus an open-source pension costing toolkit.",
    forWhom: "Research, economics and data science roles",
  },
  {
    id: "guidance",
    title: "Career counselling and admissions/scholarship guidance",
    href: "/advising/",
    summary: "One-to-one career guidance, admissions and scholarship planning, and test-preparation planning.",
    forWhom: "Students and professionals planning their next move",
  },
];

export const WORK_ITEMS: readonly WorkItem[] = [
  // Product management
  {
    track: "product-management",
    title: "CareTrak: clinical AI from integration to production",
    context: "Persivia · Healthcare SaaS",
    years: "2020–2022",
    summary: "Led a team of 10 engineers and 3 QA analysts and the operational launch of an EHR-integrated clinical NLP workflow on a platform serving 50+ facilities.",
    status: "case-study",
    href: "/work/caretrak/",
  },
  {
    track: "product-management",
    title: "Workflow ROI calculator",
    context: "Product strategy tool",
    years: "2026",
    summary: "A break-even model for workflow investments that I designed and built.",
    status: "tool",
    href: "/tools/workflow-roi/",
  },
  // Public finance
  {
    track: "public-finance",
    title: "Pension reform: from an unfunded promise to a funded scheme",
    context: "Ministry of Finance, Pakistan",
    years: "2022–2025",
    summary: "Revalued federal pension liabilities at PKR 12.0 trillion, co-drafted the IMF EFF pension commitments and drafted the legal framework for a funded defined-contribution scheme.",
    status: "case-study",
    href: "/work/pension-reform/",
  },
  {
    track: "public-finance",
    title: "Jamaica digital pension-system design",
    context: "World Bank, LAC Digital Development · independent research project",
    years: "2025–2026",
    summary: "Led the design extending pension coverage to informal workers through digital ID enrolment, data exchange and mobile payments; announced by the government in May 2026.",
    status: "listed",
    href: "/work/pension-reform/#jamaica",
  },
  {
    track: "public-finance",
    title: "Export-competitiveness schemes",
    context: "Ministry of Finance, Pakistan",
    years: "2022–2023",
    summary: "Designed duty drawback and tax holiday schemes during the 2022–23 balance-of-payments crisis, identifying about 30% compliance-cost savings for 500+ exporters.",
    status: "listed",
  },
  // Consulting
  {
    track: "consulting",
    title: "The China question in mining: should Wabtec worry about Chinese haul trucks?",
    context: "CMU × Kearney student consulting lab for Wabtec Mining",
    years: "2026",
    summary: "Financial-statement analysis of Komatsu and XCMG, a battery-pack cost model with sensitivity, a UN Comtrade pipeline and evidence-weighted regional scoring, ending in three moves for Wabtec.",
    status: "case-study",
    href: "/work/consulting/wabtec-mining/",
  },
  // Research
  {
    track: "research",
    title: "Pricing Firms Back onto the Grid: A Staged Method for Evaluating Industrial Policy under Infrastructure Constraints",
    context: "With A. A. Janjua and Z. Ahmad",
    years: "2026",
    summary: "Evaluates Pakistan’s 2025 Captive Power Levy with registry, meter and feeder data; finds 31.0% of licensed gas/RLNG capacity unclassified and shows that grid switching depends on reliable service and utility finances.",
    status: "working-paper",
  },
  {
    track: "research",
    title: "From Turnkey Systems to Digital Public Infrastructure: A Comparative Analysis of Jamaica and Uruguay",
    context: "With Yolanda Martínez, Practice Manager, Digital Development, World Bank",
    summary: "A comparative analysis of how two governments moved from turnkey systems to digital public infrastructure.",
    status: "working-paper",
  },
  {
    track: "research",
    title: "Causal Impact of Barter Trade Policy during a Foreign Exchange Crisis",
    context: "With U. Sohail, University of Delaware",
    summary: "A quasi-experimental evaluation of firm export behaviour under severe foreign-exchange constraints, using administrative microdata.",
    status: "working-paper",
  },
  {
    track: "research",
    title: "pensionfisc: an open-source toolkit for costing pension reform",
    context: "Python · public sources only",
    years: "2026",
    summary: "Every scheme rule stored with its legal citation and effective date, every figure backed by a test. Pre-release and not yet validated against outturns.",
    status: "in-development",
    href: "/work/pension-reform/#building-now",
  },
  // Guidance (lives in the Advising section)
  {
    track: "guidance",
    title: "Career guidance",
    context: "Advising",
    summary: "Direction, transitions, CV and LinkedIn feedback, and interview preparation, with a reflection tool to prepare.",
    status: "service",
    href: "/advising/career/",
  },
  {
    track: "guidance",
    title: "Admissions and scholarship guidance",
    context: "Advising",
    summary: "Shortlists, statements, recommendations and scholarship planning, with a readiness checklist and source-checked guides.",
    status: "service",
    href: "/advising/admissions/",
  },
  {
    track: "guidance",
    title: "Test preparation planning",
    context: "Advising",
    summary: "A week-by-week study plan builder and practical preparation support.",
    status: "service",
    href: "/advising/test-prep/",
  },
];

export function itemsFor(track: TrackId): readonly WorkItem[] {
  return WORK_ITEMS.filter((item) => item.track === track);
}

export function trackById(id: TrackId): Track {
  const track = TRACKS.find((t) => t.id === id);
  if (!track) throw new Error(`Unknown track ${id}`);
  return track;
}

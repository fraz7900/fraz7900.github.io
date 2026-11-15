/**
 * EHR interoperability case (Persivia / CareTrak). Featured on the Product Management tab and at
 * /work/product-management/ehr-interoperability/.
 *
 * Sources, each named on every Fact:
 * - CV: Assets/Fraz_Ahmed_CV_ADB_YPP.pdf (dates confirmed 2026-11-14).
 * - Case study: the CareTrak consolidated case study Fraz supplied.
 * - My account: Fraz's answers of 2026-11-15 (API-first was his call; flat files before; missing data
 *   and an internal audit surfaced the gaps; he wrote the go-live acceptance criteria; client names
 *   and this level of detail are cleared for public use).
 * - Public record: Persivia's own announcements and press releases, linked from the row.
 * - Retrospective: framing written for this page at Fraz's request (the alternative, the trade-off,
 *   the reading of why it mattered). Not a contemporaneous document.
 *
 * Anything still unconfirmed is a Pending item: it renders as a visible "to confirm" note carrying
 * data-to-confirm, which makes `npm run check:publish` (and the Pages deploy) fail until it is
 * replaced with confirmed copy. Do not fill a Pending item from inference.
 */

import type { EvidenceSource } from "./product";

export const EHR_CASE_PATH = "/work/product-management/ehr-interoperability/";

const CERNER_ANNOUNCEMENT = "https://persivia.com/2022/10/17/persivia-caretrak-is-now-available-on-cerner-marketplace/";
const BLUESTONE_RELEASE =
  "https://www.prnewswire.com/news-releases/bluestone-physician-services-selects-persivias-carespace-hybrid-care-and-population-health-platform-301318200.html";

/** A confirmed statement and where it comes from. */
export interface Fact {
  readonly kind: "fact";
  readonly label: string;
  readonly text: string;
  readonly source: EvidenceSource;
  /** Public page that backs the statement, for Public record facts. */
  readonly href?: string;
}

/** Copy that can't be written until Fraz answers a specific question. */
export interface Pending {
  readonly kind: "pending";
  /** Stable id, used in data-to-confirm so the publish check can name it. */
  readonly id: string;
  readonly label: string;
  /** The exact question that resolves it. */
  readonly question: string;
}

export type CaseItem = Fact | Pending;

const fact = (label: string, text: string, source: EvidenceSource, href?: string): Fact =>
  href ? { kind: "fact", label, text, source, href } : { kind: "fact", label, text, source };

// ---------- Open questions (one per gap; reused wherever the gap shows) ----------

/** Every open question, in the order they matter to the case. Empty once everything is confirmed. */
export const OPEN_QUESTIONS: readonly Pending[] = [];

// ---------- Quick scan (Product Management tab and the case header) ----------

export const EHR_INTRO = {
  title: "Closing EHR interoperability gaps across 50+ health systems",
  shortTitle: "CareTrak EHR interoperability",
  context: "Persivia · Healthcare SaaS · 2020–2022",
  lede: "At Persivia I was the product manager for CareTrak, a population health and value-based care platform. Health systems sent us their EHR data as flat files, and data went missing. I made the call to move to an API-first architecture, led the 10 software engineers and 3 QA analysts who built it, and wrote the acceptance criteria for go-live. Across 50+ health systems, implementation time fell by a reported 30%.",
} as const;

export const QUICK_SCAN: readonly CaseItem[] = [
  fact(
    "Problem",
    "Health systems sent their EHR data to CareTrak as flat files. Data went missing, and every new connection was slow, across 50+ health systems.",
    "My account",
  ),
  fact("My role", "Product Manager, CareTrak. Led 10 software engineers and 3 QA analysts.", "CV"),
  fact("Decision", "Replacing flat files with an API-first architecture was my call.", "My account"),
  fact("Delivered", "An API-first architecture for EHR interoperability, in use across 50+ health systems.", "CV"),
  fact("Result", "Implementation time cut by a reported 30%.", "Reported metric"),
];

export const EHR_CASE_FILE = [
  { term: "Role", detail: "Product Manager, CareTrak population health and value-based care platform" },
  { term: "Company", detail: "Persivia, Lahore" },
  { term: "Dates", detail: "September 2020 – October 2022" },
  { term: "Team", detail: "10 software engineers and 3 QA analysts, whom I led" },
  { term: "Scope", detail: "EHR interoperability across 50+ health systems" },
] as const;

// ---------- Detailed read ----------

export interface CaseChapter {
  readonly id: string;
  readonly title: string;
  readonly items: readonly CaseItem[];
}

export const CHAPTERS: readonly CaseChapter[] = [
  {
    id: "original-workflow",
    title: "The original workflow",
    items: [
      fact("How data arrived", "Each health system exported its EHR data and sent it to CareTrak as flat files.", "My account"),
      fact(
        "Why it mattered",
        "CareTrak’s risk adjustment (CMS-HCC for Medicare Advantage) and chronic care management depend on data from each health system’s EHR, so an incomplete connection limits everything built on top of it.",
        "Retrospective",
      ),
    ],
  },
  {
    id: "finding-the-problem",
    title: "How we found the problem",
    items: [
      fact("Missing data", "The gaps showed up as data missing from what health systems’ EHRs sent us.", "My account"),
      fact("Our own audit", "We audited the system ourselves, so we found the gaps before any client had to escalate them.", "My account"),
    ],
  },
  {
    id: "options",
    title: "The options and the trade-off",
    items: [
      fact(
        "Standardise the flat files",
        "Keep file feeds, but put every health system on one file specification, a fixed delivery schedule and a mapping per site. The data would have served risk adjustment and quality reporting about as well, because those run on periodic batches. But each new site would still need its own extract, mapping and validation cycle, and data would only be as fresh as the last file.",
        "Retrospective",
      ),
      fact(
        "Go API-first",
        "Connect to each health system’s EHR through APIs. More build work up front, and it depends on how well each EHR vendor supports its APIs. In return, connecting a new site becomes repeatable, and data arrives as it changes rather than file by file.",
        "Retrospective",
      ),
      fact(
        "The trade-off",
        "On data quality the two came out about even. The difference was efficiency: how fast a new health system could be connected, and how soon missing data would show. API-first gave up a cheaper start for a faster, repeatable connection.",
        "Retrospective",
      ),
    ],
  },
  {
    id: "decision",
    title: "The decision I owned",
    items: [
      fact("The call", "Moving EHR connections from flat files to an API-first architecture was my decision.", "My account"),
      fact("What was adopted", "An API-first architecture for EHR interoperability, applied across 50+ health systems.", "CV"),
      fact(
        "In both directions",
        "Persivia’s October 2022 Cerner Marketplace announcement describes CareTrak connecting to the Cerner EHR through FHIR APIs, with SAML 2.0 single sign-on, and a bi-directional flow of patient information to and from the EHR.",
        "Public record",
        CERNER_ANNOUNCEMENT,
      ),
    ],
  },
  {
    id: "delivery",
    title: "Working with engineering, QA and implementation",
    items: [
      fact("Team", "I led 10 software engineers and 3 QA analysts. The engineering and testing were theirs; this case doesn’t claim I built the interfaces myself.", "CV"),
      fact("Acceptance criteria", "I wrote CareTrak’s acceptance criteria for go-live.", "My account"),
      fact("Readiness", "I tracked data-readiness milestones.", "Case study"),
      fact("Shared definitions", "I kept metric definitions consistent across the Data Engineering, Statistics and Clinical teams.", "Case study"),
      fact("Launch", "I led performance testing and took CareTrak into production.", "Case study"),
    ],
  },
  {
    id: "after-delivery",
    title: "What happened after delivery",
    items: [
      fact(
        "Implementation time",
        "Fell by a reported 30%, measured from kickoff to go-live for a new health system and compared with implementations on flat-file feeds.",
        "Reported metric",
      ),
      fact(
        "Data connection",
        "The data-connection step on its own became about 8× faster than with flat files. The 30% is smaller because it covers the whole implementation, not just the connection.",
        "My account",
      ),
      fact(
        "Bluestone",
        "In June 2021, Bluestone Physician Services, which cares for 22,000+ high-risk, chronically ill patients in senior living and home settings across four states, selected Persivia’s CareSpace platform for its value-based care programs.",
        "Public record",
        BLUESTONE_RELEASE,
      ),
      fact("CareTrak and CareSpace", "Bluestone was the client for CareSpace, and we built CareTrak within CareSpace.", "My account"),
      fact(
        "What it set up",
        "The groundwork from my CareTrak work later supported clinician, patient-facing and revenue-cycle assistants. I don’t claim ownership of those.",
        "Case study",
      ),
    ],
  },
];

// ---------- Artifact: how a new health system gets connected (recreated) ----------

export interface WorkflowStep {
  readonly title: string;
  readonly detail: string;
  readonly source: EvidenceSource;
}

/** The connection workflow before the change, from Fraz's account. */
export const BEFORE_STEPS: readonly WorkflowStep[] = [
  { title: "Export", detail: "The health system exports EHR data as flat files.", source: "My account" },
  { title: "Send", detail: "The files are sent to CareTrak and loaded.", source: "My account" },
  { title: "Find the gaps", detail: "Missing data turns up afterwards, in our own audits.", source: "My account" },
];

/** The connection workflow after the API-first change, step by step, from confirmed facts only. */
export const AFTER_STEPS: readonly WorkflowStep[] = [
  { title: "Connect", detail: "The health system’s EHR data comes in through the API-first architecture.", source: "CV" },
  { title: "Check readiness", detail: "Data-readiness milestones are tracked, using definitions shared by Data Engineering, Statistics and Clinical.", source: "Case study" },
  { title: "Test", detail: "Performance testing before production.", source: "Case study" },
  { title: "Sign off", detail: "Go-live is judged against the acceptance criteria I wrote.", source: "My account" },
  { title: "Go live", detail: "Implementation time fell by a reported 30%.", source: "Reported metric" },
];

export const ARTIFACT_NOTE =
  "Recreated diagram, drawn for this page from my CV, case-study notes and my own account. The order of the steps is my reconstruction. Not a Persivia document or system architecture, and it names no client.";

/**
 * Editable site copy. Everything public about Fraz lives in src/content/.
 * Only add links (résumé, email, LinkedIn) once the real asset or address is verified.
 * Anything marked `toConfirm` renders as a visible placeholder and blocks deploys
 * (see scripts/check-publish-ready.mjs).
 */

export type CommandKind = "go" | "case" | "tool" | "link" | "pdf";

export interface NavItem {
  readonly href: string;
  readonly label: string;
  readonly description: string;
  readonly kind?: CommandKind;
}

export const SITE = {
  name: "Fraz Ahmed",
  handle: "fraz@heinz",
  practiceAreas: ["Product strategy", "Analytics", "Enterprise strategy"],
  headline: "I help teams decide what to build, how to measure it, and how to roll it out.",
  supportingCopy:
    "My work spans healthcare SaaS and public finance, from EHR integrations and population health to pension reform. At Carnegie Mellon’s Heinz College, I’m building on that experience with applied economics, machine learning, and product analytics.",
  description:
    "Fraz Ahmed: product strategy, analytics, and enterprise strategy across healthcare SaaS and public finance.",
  /** Set to a path under /public (e.g. "/fraz-ahmed-resume.pdf") once a verified file is supplied. */
  resumeHref: null as string | null,
  /** Set to a path under /public once an approved headshot is supplied. */
  headshotSrc: null as string | null,
  copyrightYear: 2026,
} as const;

/** Phrases the hero types out, one after another. */
export const TAGLINES = [
  "deciding what to build",
  "measuring what shipped",
  "taking clinical AI into production",
  "evaluating clinical NLP before go-live",
] as const;

/** Scrolling credentials strip under the hero. */
export const TICKER = [
  "Product Manager · Persivia, 2019–2021",
  "CareTrak · 50+ facilities",
  "Clinical NLP evaluation",
  "CMS-HCC risk adjustment",
  "EHR interoperability",
  "MSPPM–Data Analytics · CMU Heinz",
  "Pension reform",
  "R · Databricks · SQL",
] as const;

export const STATUS_LOG: readonly { readonly text: string; readonly toConfirm?: boolean }[] = [
  { text: "Studying applied economics, machine learning and product analytics at CMU Heinz College." },
  { text: "Previously Product Manager on CareTrak at Persivia, June 2019 – August 2021." },
  { text: "Open to product strategy and analytics roles in healthcare, enterprise software and consulting." , toConfirm: true },
];

export const COUNTERS = [
  { value: 50, suffix: "+", label: "facilities on CareTrak" },
  { value: 26, suffix: "", label: "months as PM at Persivia" },
  { value: 30, suffix: "%", label: "shorter EHR implementation time" },
  { value: 22, suffix: "%", label: "clinician productivity gain (reported)" },
] as const;

/** Add verified profiles here; the footer and command menu pick them up. */
export const SOCIAL_LINKS: readonly NavItem[] = [];

export const NAV_ITEMS: readonly NavItem[] = [
  { href: "/work/", label: "Work", description: "Case studies and tools", kind: "go" },
  { href: "/#map", label: "Strategy map", description: "How the work connects, as a live graph", kind: "go" },
  {
    href: "/tools/workflow-roi/",
    label: "ROI calculator",
    description: "Estimate the monthly value of a workflow change",
    kind: "tool",
  },
  { href: "/about/", label: "About", description: "Healthcare SaaS, public finance and CMU", kind: "go" },
];

export const HOME_ITEM: NavItem = { href: "/", label: "Home", description: "Introduction", kind: "go" };

/** Everything the command menu can jump to. */
export const COMMANDS: readonly NavItem[] = [
  HOME_ITEM,
  ...NAV_ITEMS,
  {
    href: "/work/caretrak/",
    label: "CareTrak case study",
    description: "Clinical AI from integration to production",
    kind: "case",
  },
  ...SOCIAL_LINKS,
  ...(SITE.resumeHref
    ? [{ href: SITE.resumeHref, label: "Download CV (PDF)", description: "Résumé", kind: "pdf" as const }]
    : []),
];

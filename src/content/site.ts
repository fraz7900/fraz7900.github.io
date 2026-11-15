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
  /** Other path prefixes that should highlight this nav item (e.g. a track's case studies). */
  readonly activeFor?: readonly string[];
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
  headshotSrc: "/images/fraz-ahmed.jpg" as string | null,
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
  "Fulbright Scholar · CMU Heinz",
  "PKR 12.0tn pension revaluation",
  "IMF EFF pension commitments",
  "Ministry of Finance, Pakistan · 2022–2025",
  "World Bank · Jamaica pension design",
  "Product Manager · Persivia, 2020–2022",
  "CareTrak · 50+ facilities",
  "Clinical NLP evaluation",
  "CMS-HCC risk adjustment",
  "Python · R · SQL · Stata",
] as const;

export const STATUS_LOG: readonly { readonly text: string; readonly toConfirm?: boolean }[] = [
  { text: "MSPPM–Data Analytics at Carnegie Mellon’s Heinz College as a Fulbright Scholar, graduating May 2027." },
  { text: "Teaching assistant for Time Series Forecasting in Python since January 2026." },
  { text: "Previously Section Officer at Pakistan’s Ministry of Finance (2022–2025), working on pension reform." },
  { text: "Before that, Product Manager on CareTrak at Persivia (2020–2022)." },
];

export const COUNTERS = [
  { value: 12, suffix: "tn", label: "PKR of federal pension liabilities revalued (2023)" },
  { value: 174, suffix: "k", label: "informal workers in scope of the Jamaica pension design" },
  { value: 50, suffix: "+", label: "healthcare facilities on CareTrak" },
  { value: 30, suffix: "%", label: "shorter EHR implementation time" },
] as const;

/** Verified profiles; the footer and command menu pick them up. */
export const SOCIAL_LINKS: readonly NavItem[] = [
  { href: "mailto:frazahmed79@gmail.com", label: "Email", description: "frazahmed79@gmail.com", kind: "link" },
  {
    href: "https://www.linkedin.com/in/fraz-ahmed-383396b0/",
    label: "LinkedIn",
    description: "linkedin.com/in/fraz-ahmed-383396b0",
    kind: "link",
  },
  { href: "https://github.com/fraz7900", label: "GitHub", description: "github.com/fraz7900", kind: "link" },
];

export const NAV_ITEMS: readonly NavItem[] = [
  {
    href: "/work/product-management/",
    label: "Product",
    description: "Product management portfolio: PM, AI PM and product strategy",
    kind: "go",
    activeFor: ["/work/caretrak/", "/tools/workflow-roi/"],
  },
  { href: "/work/", label: "Work", description: "All work: five tracks", kind: "go" },
  { href: "/about/", label: "About", description: "Public finance, healthcare SaaS and CMU", kind: "go" },
  { href: "/advising/", label: "Advising", description: "One-to-one career, admissions and test-prep guidance", kind: "go" },
];

/** Portfolio destinations reachable from the command menu without crowding the top nav. */
const PORTFOLIO_COMMANDS: readonly NavItem[] = [
  { href: "/work/public-finance/", label: "Public finance work", description: "Pension reform, World Bank, export schemes", kind: "go" },
  { href: "/work/research/", label: "Research", description: "Working papers and the pensionfisc toolkit", kind: "go" },
  { href: "/work/consulting/", label: "Consulting", description: "Case studies in preparation", kind: "go" },
  { href: "/#map", label: "Strategy map", description: "How the work connects, as a live graph", kind: "go" },
  { href: "/tools/workflow-roi/", label: "ROI calculator", description: "Estimate the monthly value of a workflow change", kind: "tool" },
];

/** Advising sub-pages: in the command menu, but kept out of the top-level navigation. */
const ADVISING_COMMANDS: readonly NavItem[] = [
  { href: "/advising/book/", label: "Book an advising conversation", description: "Introductory conversations are currently free", kind: "go" },
  { href: "/advising/career/", label: "Career guidance", description: "Direction, transitions, CV and interview preparation", kind: "go" },
  { href: "/advising/admissions/", label: "Admissions support", description: "Shortlists, statements and readiness checklist", kind: "tool" },
  { href: "/advising/test-prep/", label: "Test preparation planning", description: "Build a week-by-week study plan", kind: "tool" },
  { href: "/advising/scholarships/", label: "Scholarship guides", description: "Fulbright (Pakistan), Chevening, Australia Awards", kind: "go" },
  { href: "/advising/updates/", label: "Admissions and scholarship updates", description: "Source-checked dates and guidance", kind: "go" },
];

export const HOME_ITEM: NavItem = { href: "/", label: "Home", description: "Introduction", kind: "go" };

/** Everything the command menu can jump to. */
export const COMMANDS: readonly NavItem[] = [
  HOME_ITEM,
  ...NAV_ITEMS,
  ...PORTFOLIO_COMMANDS,
  {
    href: "/work/pension-reform/",
    label: "Pension reform case study",
    description: "Ministry of Finance: revaluation, IMF commitments, funded DC scheme",
    kind: "case",
  },
  {
    href: "/work/caretrak/",
    label: "CareTrak case study",
    description: "Clinical AI from integration to production",
    kind: "case",
  },
  ...ADVISING_COMMANDS,
  ...SOCIAL_LINKS,
  ...(SITE.resumeHref
    ? [{ href: SITE.resumeHref, label: "Download CV (PDF)", description: "Résumé", kind: "pdf" as const }]
    : []),
];

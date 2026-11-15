/**
 * Editable site copy. Everything public about Fraz lives here or in work.ts.
 * Only add links (résumé, email, LinkedIn) once the real asset or address is verified.
 */

export interface NavItem {
  readonly href: string;
  readonly label: string;
  readonly description: string;
}

export const SITE = {
  name: "Fraz Ahmed",
  practiceAreas: ["Product strategy", "Analytics", "Enterprise strategy"],
  headline: "I help teams decide what to build, how to measure it, and how to roll it out.",
  supportingCopy:
    "My work spans healthcare SaaS and public finance, from EHR integrations and population health to pension reform. At Carnegie Mellon’s Heinz College, I’m building on that experience with applied economics, machine learning, and product analytics.",
  description:
    "Fraz Ahmed: product strategy, analytics, and enterprise strategy across healthcare SaaS and public finance.",
  /** Set to a path under /public (e.g. "/fraz-ahmed-resume.pdf") once a verified file is supplied. */
  resumeHref: null as string | null,
  copyrightYear: 2026,
} as const;

export const NAV_ITEMS: readonly NavItem[] = [
  { href: "/work/", label: "Work", description: "Published case studies and tools" },
  {
    href: "/tools/workflow-roi/",
    label: "ROI calculator",
    description: "Estimate the monthly value of a workflow change",
  },
  { href: "/about/", label: "About", description: "Healthcare SaaS, public finance and CMU" },
];

export const HOME_ITEM: NavItem = { href: "/", label: "Home", description: "Introduction" };

/** Dated career log for the homepage. Newest first. `toConfirm` entries are visible placeholders. */

export interface LogEntry {
  readonly date: string;
  readonly kind: string;
  readonly text: string;
  readonly href?: string;
  readonly linkText?: string;
  readonly toConfirm?: boolean;
}

export const LOG: readonly LogEntry[] = [
  {
    date: "2026.11",
    kind: "Case study",
    text: "Published the CareTrak walkthrough: clinical AI from integration to production.",
    href: "/work/caretrak/",
    linkText: "Read it",
  },
  {
    date: "2026.11",
    kind: "Tool",
    text: "Launched the workflow ROI calculator, a break-even model for workflow changes.",
    href: "/tools/workflow-roi/",
    linkText: "Try it",
  },
  {
    date: "Date?",
    kind: "New chapter",
    text: "Started the MSPPM in Data Analytics at Carnegie Mellon’s Heinz College.",
    toConfirm: true,
  },
  {
    date: "Date?",
    kind: "Public finance",
    text: "Pension reform work. Add where, when and your role.",
    toConfirm: true,
  },
  {
    date: "2021.08",
    kind: "Milestone",
    text: "Wrapped 26 months as Product Manager on CareTrak, a platform serving 50+ facilities.",
  },
  {
    date: "2019.06",
    kind: "New role",
    text: "Joined Persivia as Product Manager for CareTrak, its population health and value-based care platform.",
  },
];

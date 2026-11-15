/**
 * Dated career log for the homepage. Newest first. `toConfirm` entries are visible placeholders.
 * Source: Fraz's CV (Assets/Fraz_Ahmed_CV_ADB_YPP.pdf) and the published site work.
 */

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
    date: "2026.05",
    kind: "Announced",
    text: "Jamaica’s government announced the digital pension-system design I led with the World Bank, extending coverage to informal workers through auto-enrolment and micro-pensions.",
  },
  {
    date: "2026.01",
    kind: "Teaching",
    text: "Teaching assistant for Time Series Forecasting in Python at CMU.",
  },
  {
    date: "2025.12",
    kind: "Research",
    text: "Started an independent research project with the World Bank’s LAC Digital Development team on Jamaica’s pension system.",
  },
  {
    date: "Fall 2025",
    kind: "New chapter",
    text: "Started the MSPPM in Data Analytics at Carnegie Mellon’s Heinz College as a Fulbright Scholar.",
  },
  {
    date: "2025",
    kind: "Regulation",
    text: "Drafted the legal framework for Pakistan’s funded defined-contribution pension scheme (S.R.O. 1728(I)/2025).",
  },
  {
    date: "2024",
    kind: "IMF programme",
    text: "Co-drafted the pension commitments in the MEFP for the US$7 billion IMF Extended Fund Facility.",
  },
  {
    date: "2023.07",
    kind: "Valuation",
    text: "Ran the actuarial revaluation of federal pension liabilities: PKR 12.0 trillion.",
  },
  {
    date: "2022.11",
    kind: "New role",
    text: "Joined Pakistan’s Ministry of Finance as Section Officer (BS-17) in the Regulations Wing.",
  },
  {
    date: "2020.09",
    kind: "New role",
    text: "Joined Persivia as Product Manager for CareTrak, its population health and value-based care platform, through October 2022.",
  },
];

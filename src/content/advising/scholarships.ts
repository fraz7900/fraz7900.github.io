/**
 * Scholarship programme guides (category A: programme information).
 * Facts are only those read on the official page on `lastChecked`. Re-check before editing,
 * and label country scope: requirements differ by country.
 */

export interface SourcedFact {
  readonly text: string;
}

export interface ScholarshipGuide {
  readonly id: string;
  readonly name: string;
  readonly scope: string;
  readonly summary: string;
  readonly officialLinks: readonly { readonly label: string; readonly href: string }[];
  /** Facts verified on the official page on `lastChecked`. Empty when it couldn't be checked. */
  readonly facts: readonly SourcedFact[];
  /** ISO date the official source was read, or null if it couldn't be checked. */
  readonly lastChecked: string | null;
  readonly verificationNote: string;
  readonly howICanHelp: readonly string[];
}

export const SCHOLARSHIP_GUIDES: readonly ScholarshipGuide[] = [
  {
    id: "fulbright",
    name: "Fulbright Degree Program",
    scope: "Pakistan only: run by USEFP for Pakistani citizens. Fulbright rules differ in other countries.",
    summary: "Fully funded Master’s and PhD study at U.S. universities, managed in Pakistan by the United States Educational Foundation in Pakistan (USEFP).",
    officialLinks: [{ label: "USEFP: Fulbright PhD & Masters", href: "https://www.usefp.org/scholarships/fulbright-degree.cfm" }],
    facts: [
      { text: "For Pakistani citizens who live in Pakistan throughout the process and are committed to returning to serve Pakistan." },
      { text: "Master’s applicants need 16 years of formal education; PhD applicants need at least 18." },
      { text: "MBA and Public Policy/Administration applicants need 2 years of relevant work experience." },
      { text: "The GRE General Test is required; selected candidates must take the TOEFL." },
      { text: "Covers tuition, required textbooks, airfare, a living stipend and health insurance." },
      { text: "Applications are online only; incomplete applications are not considered." },
      { text: "The cycle with an April 1, 2026 deadline is listed as closed." },
    ],
    lastChecked: "2026-11-14",
    verificationNote: "Read on the USEFP page on 14 November 2026. Check the page for the current cycle before applying.",
    howICanHelp: [
      "Working out whether your goals fit the programme",
      "Planning the application, references and test timeline",
      "Feedback on your own statements",
    ],
  },
  {
    id: "chevening",
    name: "Chevening Scholarships",
    scope: "Global: open to Chevening-eligible countries and territories. Deadlines are set per country page.",
    summary: "The UK government’s scholarship for a one-year master’s degree at a UK university, supported by the FCDO and partner organisations.",
    officialLinks: [
      { label: "Chevening Scholarships", href: "https://www.chevening.org/scholarships/" },
      { label: "Application timeline", href: "https://www.chevening.org/scholarships/application-timeline/" },
      { label: "Who can apply", href: "https://www.chevening.org/scholarships/who-can-apply/" },
    ],
    facts: [
      { text: "Fully funded study for a one-year master’s degree at a UK university." },
      { text: "Supported by the Foreign, Commonwealth and Development Office (FCDO) and partner organisations." },
      { text: "There is no upper age limit." },
      { text: "For the 2027–28 intake, applications opened in August 2026 and closed in October 2026 (exact day on each country page, at 11:00 UTC)." },
      { text: "Successful candidates must hold an unconditional UK university offer by 17:00 BST on 8 July 2027." },
    ],
    lastChecked: "2026-11-14",
    verificationNote:
      "Read on chevening.org on 14 November 2026. Detailed eligibility and work-experience rules are on the official eligibility pages.",
    howICanHelp: ["Clarifying your leadership and career story", "Planning UK course choices and timelines", "Interview preparation"],
  },
  {
    id: "australia-awards",
    name: "Australia Awards",
    scope: "Participating countries only. Eligibility and dates are set per country.",
    summary: "The Australian Government’s international scholarship programme, managed by the Department of Foreign Affairs and Trade (DFAT).",
    officialLinks: [
      {
        label: "DFAT: Australia Awards Scholarships",
        href: "https://www.dfat.gov.au/people-to-people/australia-awards/australia-awards-scholarships",
      },
    ],
    facts: [],
    lastChecked: null,
    verificationNote:
      "The official page couldn’t be reached when this guide was written, so no requirements or dates are listed here. Use the official page and your country’s Australia Awards page.",
    howICanHelp: ["Planning your application around your country’s cycle", "Feedback on your own application answers"],
  },
];

/** Category B: my own experience, limited to what is verified. */
export const PERSONAL_EXPERIENCE = {
  programme: "Fulbright",
  text: "I’m a Fulbright Scholar studying for the MSPPM–Data Analytics at Carnegie Mellon’s Heinz College. That gives me a personal perspective on applying and moving countries for study. It is my experience, not an official guide, and it doesn’t mean I have advised Fulbright winners.",
} as const;

/**
 * The four conversation focuses offered on /advising/book/. Ids are the `?topic=` values used by
 * links across the site (the three service ids plus "scholarships"), so existing links keep working.
 */

import type { ServiceId } from "./services";

export type FocusId = ServiceId | "scholarships";

export interface BookingFocus {
  readonly id: FocusId;
  readonly title: string;
  /** One line under the title on the card. */
  readonly tagline: string;
  /** What the session covers, shown in the session summary. */
  readonly summary: string;
  /** Focus-specific preparation; the general tips are added after these. */
  readonly prepare: readonly string[];
  readonly guide: { readonly href: string; readonly label: string };
}

export const BOOKING_FOCUSES: readonly BookingFocus[] = [
  {
    id: "career",
    title: "Career advising",
    tagline: "Clarify your direction and next move.",
    summary: "We’ll look at where you are now, the directions you’re weighing, and one practical next step you can take.",
    prepare: [
      "Your current CV, résumé or LinkedIn profile",
      "Two or three roles or directions you’re considering",
    ],
    guide: { href: "/advising/career/", label: "Try the career reflection tool" },
  },
  {
    id: "test-prep",
    title: "Test preparation",
    tagline: "Build a focused preparation plan.",
    summary: "We’ll turn your test date into a realistic plan: your starting point, weekly priorities and how to review practice.",
    prepare: [
      "Which test you’re taking and your target date",
      "Any recent practice or diagnostic scores",
      "How many hours a week you can realistically study",
    ],
    guide: { href: "/advising/test-prep/", label: "Build a study plan first" },
  },
  {
    id: "admissions",
    title: "Admissions support",
    tagline: "Strengthen your application approach.",
    summary: "We’ll work on your shortlist, your application timeline and how to present your goals in your own words.",
    prepare: [
      "The programmes you’re considering and their deadlines",
      "A draft statement of purpose or CV, if you have one",
    ],
    guide: { href: "/advising/admissions/", label: "Check your application readiness" },
  },
  {
    id: "scholarships",
    title: "Scholarship guidance",
    tagline: "Navigate opportunities and preparation.",
    summary: "We’ll go through the scholarships that fit your plans, their eligibility rules and deadlines, and how to prepare.",
    prepare: [
      "Scholarships you’re considering and their deadlines",
      "Your intended field and level of study",
      "Any eligibility questions, such as citizenship or work experience",
    ],
    guide: { href: "/advising/scholarships/", label: "Read the scholarship guides" },
  },
];

/** Tips that apply whatever the focus. */
export const GENERAL_PREPARATION: readonly string[] = [
  "The one decision you most want help with",
  "Any document you’d like feedback on, open and ready to share on screen",
];

export function focusById(id: string | null | undefined): BookingFocus | undefined {
  return BOOKING_FOCUSES.find((focus) => focus.id === id);
}

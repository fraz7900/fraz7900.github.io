/**
 * Standardized tests. Only `confirmed: true` tests are offered in production; the rest stay
 * visible in development so the planner can be previewed. Formats change: link the official
 * provider rather than restating rules here.
 */

export interface SupportedTest {
  readonly id: string;
  readonly name: string;
  /** Set true only once you have decided to offer support for this test. */
  readonly confirmed: boolean;
  readonly officialUrl: string | null;
  readonly areas: readonly string[];
}

/** Always available: general planning that doesn't depend on a specific test. */
export const GENERAL_TEST: SupportedTest = {
  id: "general",
  name: "General planning (test not decided yet)",
  confirmed: true,
  officialUrl: null,
  areas: ["Quantitative skills", "Verbal and reading", "Writing", "Listening and speaking", "Timing and strategy"],
};

export const TESTS: readonly SupportedTest[] = [
  GENERAL_TEST,
  {
    id: "gre",
    name: "GRE General Test",
    confirmed: false,
    officialUrl: "https://www.ets.org/gre.html",
    areas: ["Verbal Reasoning", "Quantitative Reasoning", "Analytical Writing"],
  },
  {
    id: "gmat",
    name: "GMAT Focus Edition",
    confirmed: false,
    officialUrl: "https://www.mba.com/exams/gmat-exam",
    areas: ["Quantitative Reasoning", "Verbal Reasoning", "Data Insights"],
  },
  {
    id: "ielts",
    name: "IELTS",
    confirmed: false,
    officialUrl: "https://ielts.org/",
    areas: ["Listening", "Reading", "Writing", "Speaking"],
  },
  {
    id: "toefl",
    name: "TOEFL iBT",
    confirmed: false,
    officialUrl: "https://www.ets.org/toefl.html",
    areas: ["Reading", "Listening", "Writing", "Speaking"],
  },
];

/** Tests offered in this build: confirmed ones always, unconfirmed ones only in development. */
export function offeredTests(isProduction = process.env.NODE_ENV === "production"): readonly SupportedTest[] {
  return TESTS.filter((test) => test.confirmed || !isProduction);
}

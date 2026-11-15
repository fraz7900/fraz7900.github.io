/**
 * DEVELOPMENT FIXTURE ONLY. Not a real person, quote or outcome.
 * Loaded only under `next dev` so the story templates can be reviewed.
 * scripts/check-publish-ready.mjs fails the deploy if this marker reaches the build:
 * DEV-FIXTURE-MARKER
 */

import type { Story } from "./stories";

export const DEV_STORY_FIXTURES: readonly Story[] = [
  {
    slug: "dev-sample-story",
    title: "DEV SAMPLE: template preview (not a real story)",
    status: "published",
    displayName: "Sample applicant (fictional, DEV-FIXTURE-MARKER)",
    isPseudonym: true,
    programme: "Sample scholarship",
    relationship: "guest",
    startingPoint: "Placeholder text to preview the starting-point section.",
    mainChallenge: "Placeholder text to preview the main-challenge section.",
    preparation: "Placeholder text to preview the preparation section.",
    timeline: [
      { when: "Month 1", what: "Placeholder milestone." },
      { when: "Month 4", what: "Placeholder milestone." },
    ],
    lessons: ["Placeholder lesson one.", "Placeholder lesson two."],
    outcome: { text: "Placeholder outcome (fictional).", verified: false },
    quotes: [],
    publishedOn: "2026-11-14",
    consent: { status: "on-file", reference: "C-0000-000" },
    devFixture: true,
  },
];

/**
 * Scholarship and admissions stories (categories B, C, D).
 *
 * Publication rules (enforced by validateStory):
 * - Only `status: "published"` stories with `consent.status: "on-file"` are built.
 * - `consent.reference` is a non-identifying ID (e.g. "C-2026-001"). The consent record
 *   itself is kept outside this repository; see docs/advising-setup.md.
 * - "advised" stories must have a verified outcome; guest stories never imply coaching.
 * - Never invent people, quotes, outcomes or photos.
 */

import { DEV_STORY_FIXTURES } from "./stories.dev-fixtures";

export type StoryRelationship = "personal" | "guest" | "advised";

export const RELATIONSHIP_LABEL: Record<StoryRelationship, string> = {
  personal: "My own experience",
  guest: "Guest scholar story (not advised by me)",
  advised: "Someone I advised",
};

export interface StoryMilestone {
  readonly when: string;
  readonly what: string;
}

export interface Story {
  readonly slug: string;
  readonly title: string;
  readonly status: "draft" | "published";
  readonly displayName: string;
  readonly isPseudonym: boolean;
  readonly programme: string;
  readonly country?: string;
  readonly university?: string;
  readonly year?: number;
  readonly relationship: StoryRelationship;
  readonly startingPoint: string;
  readonly mainChallenge: string;
  readonly preparation: string;
  readonly timeline: readonly StoryMilestone[];
  readonly lessons: readonly string[];
  readonly outcome: { readonly text: string; readonly verified: boolean };
  readonly quotes: readonly { readonly text: string; readonly approved: boolean }[];
  readonly image?: { readonly src: string; readonly alt: string; readonly approved: boolean };
  readonly publishedOn: string;
  readonly updatedOn?: string;
  readonly consent: { readonly status: "on-file" | "pending" | "withdrawn"; readonly reference: string };
  /** Marks development-only sample content. Never true in production data. */
  readonly devFixture?: boolean;
}

const CONSENT_REFERENCE = /^C-\d{4}-\d{3}$/;
const ISO_DATE = /^\d{4}-\d{2}-\d{2}$/;

export function validateStory(story: Story): string[] {
  const errors: string[] = [];
  const at = `story "${story.slug}"`;
  if (!/^[a-z0-9]+(-[a-z0-9]+)*$/.test(story.slug)) errors.push(`${at}: slug must be kebab-case`);
  if (!ISO_DATE.test(story.publishedOn)) errors.push(`${at}: publishedOn must be YYYY-MM-DD`);
  if (!CONSENT_REFERENCE.test(story.consent.reference)) errors.push(`${at}: consent.reference must look like C-2026-001`);
  if (story.status === "published") {
    if (story.consent.status !== "on-file") errors.push(`${at}: published stories need consent on file`);
    if (story.quotes.some((q) => !q.approved)) errors.push(`${at}: every published quote must be approved`);
    if (story.image && (!story.image.approved || story.image.alt.trim() === "")) {
      errors.push(`${at}: published images need approval and alt text`);
    }
  }
  if (story.relationship === "advised" && !story.outcome.verified) {
    errors.push(`${at}: advised stories must have a verified outcome`);
  }
  if (story.timeline.length === 0) errors.push(`${at}: add at least one timeline milestone`);
  return errors;
}

/** Real stories go here. Keep this list honest: empty is fine. */
const STORIES: readonly Story[] = [];

const isDevelopment = process.env.NODE_ENV === "development";
const ALL = isDevelopment ? [...STORIES, ...DEV_STORY_FIXTURES] : STORIES;

const problems = ALL.flatMap(validateStory);
if (problems.length > 0) throw new Error(`Invalid story content:\n${problems.join("\n")}`);
if (!isDevelopment && STORIES.some((s) => s.devFixture)) throw new Error("Dev fixtures must not be in STORIES");

/** Stories that may appear on the public site (dev fixtures only in `next dev`). */
export const PUBLISHED_STORIES: readonly Story[] = ALL.filter(
  (story) => story.status === "published" && story.consent.status === "on-file",
);

export function storyBySlug(slug: string): Story | undefined {
  return PUBLISHED_STORIES.find((story) => story.slug === slug);
}

/** Filters appear once there are enough stories to need them. */
export const STORY_FILTER_THRESHOLD = 6;

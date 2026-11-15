import { describe, expect, test } from "vitest";
import type { BookingConfig } from "@/content/advising/config";
import { BOOKING } from "@/content/advising/config";
import { PUBLISHED_STORIES, validateStory, type Story } from "@/content/advising/stories";
import { SERVICES } from "@/content/advising/services";
import { GENERAL_TEST, offeredTests } from "@/content/advising/tests";
import { bookingHref, bookingState } from "./booking";
import { DECISIONS, STAGES, USEFUL, reflect, reflectionSummary } from "./careerReflection";
import { ALL_ITEM_IDS, parseStored, progressOf } from "./readiness";
import { FINDER_OPTIONS, findService } from "./serviceFinder";
import { buildStudyPlan, validatePlanInput } from "./studyPlan";

describe("service finder", () => {
  test("every option maps to an existing, active service", () => {
    for (const option of FINDER_OPTIONS) {
      const match = findService(option.id);
      expect(SERVICES.find((s) => s.id === match?.service)?.active, option.id).toBe(true);
    }
    expect(findService("nope")).toBeNull();
  });
});

describe("career reflection", () => {
  test("every answer combination yields a focus, reasons and a non-empty checklist", () => {
    for (const stage of STAGES) {
      for (const decision of DECISIONS) {
        for (const useful of USEFUL) {
          const result = reflect({ stage: stage.id, decision: decision.id, useful: useful.id });
          expect(result.focus.length).toBeGreaterThan(0);
          expect(result.why).toHaveLength(3);
          expect(result.checklist.length).toBeGreaterThanOrEqual(2);
        }
      }
    }
  });

  test("a study-versus-work decision points to admissions support", () => {
    expect(reflect({ stage: "early", decision: "study", useful: "options" }).service).toBe("admissions");
    expect(reflect({ stage: "early", decision: "search", useful: "options" }).service).toBe("career");
  });

  test("the summary includes the answers and says it isn't an assessment", () => {
    const answers = { stage: "changing", decision: "switch", useful: "materials" } as const;
    const text = reflectionSummary(answers, reflect(answers));
    expect(text).toContain("Changing sector or role");
    expect(text).toContain("not an assessment");
  });
});

describe("readiness checklist", () => {
  test("progress counts completed items only, per group and overall", () => {
    const progress = progressOf(new Set([ALL_ITEM_IDS[0], ALL_ITEM_IDS[1], "not-a-real-item"]));
    expect(progress.done).toBe(2);
    expect(progress.total).toBe(ALL_ITEM_IDS.length);
    expect(progress.percent).toBe(Math.round((2 / ALL_ITEM_IDS.length) * 100));
    expect(progress.byGroup[0]).toEqual({ id: "goals", done: 2, total: 2 });
  });

  test("stored progress is parsed defensively", () => {
    expect([...parseStored(JSON.stringify([ALL_ITEM_IDS[0], 42, "bogus"]))]).toEqual([ALL_ITEM_IDS[0]]);
    expect(parseStored("{not json").size).toBe(0);
    expect(parseStored(JSON.stringify({ a: 1 })).size).toBe(0);
    expect(parseStored(null).size).toBe(0);
  });
});

describe("study plan", () => {
  const areas = GENERAL_TEST.areas;

  test("keeps every week's hours equal to the hours available", () => {
    for (const weeks of [1, 2, 3, 8, 12, 52]) {
      for (const hoursPerWeek of [1, 2.5, 7, 15, 40]) {
        const plan = buildStudyPlan({ areas, focus: [areas[0]], weeks, hoursPerWeek });
        expect(plan).toHaveLength(weeks);
        for (const week of plan) {
          expect(week.total).toBeCloseTo(Math.round(hoursPerWeek * 2) / 2, 5);
          expect(week.allocations.every((a) => a.hours > 0)).toBe(true);
        }
      }
    }
  });

  test("starts with a baseline, ends with a light final week, and weights focus areas", () => {
    const plan = buildStudyPlan({ areas, focus: ["Writing"], weeks: 8, hoursPerWeek: 10 });
    expect(plan[0].phase).toBe("Baseline");
    expect(plan.at(-1)!.phase).toBe("Final week");
    expect(plan.some((w) => w.phase === "Practice")).toBe(true);
    const build = plan.find((w) => w.phase === "Build")!;
    const hoursFor = (name: string) => build.allocations.find((a) => a.activity === name)?.hours ?? 0;
    expect(hoursFor("Writing")).toBeGreaterThan(hoursFor("Listening and speaking"));
  });

  test("rejects out-of-range inputs with readable messages", () => {
    expect(validatePlanInput({ areas, focus: [], weeks: 0, hoursPerWeek: 50 })).toHaveLength(2);
    expect(validatePlanInput({ areas, focus: [], weeks: 6, hoursPerWeek: 8 })).toEqual([]);
  });
});

describe("tests on offer", () => {
  test("production offers only confirmed tests; development previews the rest", () => {
    expect(offeredTests(true).every((t) => t.confirmed)).toBe(true);
    expect(offeredTests(true).map((t) => t.id)).toContain("general");
    expect(offeredTests(false).length).toBeGreaterThan(offeredTests(true).length);
  });
});

describe("booking boundary", () => {
  const ready: BookingConfig = {
    ...BOOKING,
    enabled: true,
    provider: "google-calendar",
    bookingUrl: "https://calendar.app.google/abc123",
    embedUrl: "https://calendar.google.com/calendar/appointments/schedules/XYZ?gv=true",
  };

  test("the shipped config is disabled and falls back to a verified email", () => {
    expect(bookingState(BOOKING).kind).toBe("disabled");
    expect(bookingHref(BOOKING)).toBeNull();
    expect(BOOKING.fallback.href.startsWith("mailto:")).toBe(true);
  });

  test("a provider URL is accepted; anything else is misconfigured", () => {
    expect(bookingState(ready).kind).toBe("ready");
    expect(bookingState({ ...ready, bookingUrl: "https://evil.example/booking" }).kind).toBe("misconfigured");
    expect(bookingState({ ...ready, embedUrl: "https://example.org/embed" }).kind).toBe("misconfigured");
    expect(bookingState({ ...ready, provider: null }).kind).toBe("misconfigured");
  });

  test("topics are passed only through Calendly's documented parameter", () => {
    expect(bookingHref(ready, "Career guidance")).toBe(ready.bookingUrl);
    expect(bookingState({ ...ready, topicParam: "a1" }).kind).toBe("misconfigured");
    const calendly: BookingConfig = { ...ready, provider: "calendly", bookingUrl: "https://calendly.com/fraz/intro", embedUrl: null, topicParam: "a1" };
    expect(bookingHref(calendly, "Career guidance")).toBe("https://calendly.com/fraz/intro?a1=Career+guidance");
  });
});

describe("stories", () => {
  const story: Story = {
    slug: "a-story",
    title: "A story",
    status: "published",
    displayName: "A. N.",
    isPseudonym: true,
    programme: "Programme",
    relationship: "advised",
    startingPoint: "s",
    mainChallenge: "c",
    preparation: "p",
    timeline: [{ when: "2026", what: "x" }],
    lessons: ["l"],
    outcome: { text: "o", verified: true },
    quotes: [{ text: "q", approved: true }],
    publishedOn: "2026-11-14",
    consent: { status: "on-file", reference: "C-2026-001" },
  };

  test("valid published stories pass; consent, verification and approvals are enforced", () => {
    expect(validateStory(story)).toEqual([]);
    expect(validateStory({ ...story, consent: { status: "pending", reference: "C-2026-001" } })).not.toEqual([]);
    expect(validateStory({ ...story, consent: { status: "on-file", reference: "Jane Doe" } })).not.toEqual([]);
    expect(validateStory({ ...story, outcome: { text: "o", verified: false } })).not.toEqual([]);
    expect(validateStory({ ...story, quotes: [{ text: "q", approved: false }] })).not.toEqual([]);
    expect(validateStory({ ...story, image: { src: "/x.jpg", alt: "", approved: true } })).not.toEqual([]);
  });

  test("no development fixture is publishable outside development", () => {
    expect(PUBLISHED_STORIES.some((s) => s.devFixture)).toBe(false);
  });
});

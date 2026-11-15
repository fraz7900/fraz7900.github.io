import { describe, expect, it } from "vitest";
import { AFTER_STEPS, BEFORE_STEPS, CHAPTERS, OPEN_QUESTIONS, QUICK_SCAN, type CaseItem, type Pending } from "./ehr";
import { SOURCE_NOTE } from "./product";

const allItems: readonly CaseItem[] = [...QUICK_SCAN, ...CHAPTERS.flatMap((chapter) => chapter.items)];
const pendingShown = allItems.filter((item): item is Pending => item.kind === "pending");

describe("EHR interoperability case content", () => {
  it("lists every open question it shows, and shows every open question it lists", () => {
    const shown = new Set(pendingShown.map((item) => item.id));
    const listed = new Set(OPEN_QUESTIONS.map((item) => item.id));

    expect([...shown].sort()).toEqual([...listed].sort());
  });

  it("gives each open question a unique id and an actual question", () => {
    const ids = OPEN_QUESTIONS.map((item) => item.id);

    expect(new Set(ids).size).toBe(ids.length);
    for (const item of OPEN_QUESTIONS) expect(item.question).toMatch(/\?/);
  });

  it("tags every confirmed statement and workflow step with a known source", () => {
    const sources = [
      ...allItems.flatMap((item) => (item.kind === "fact" ? [item.source] : [])),
      ...[...BEFORE_STEPS, ...AFTER_STEPS].map((step) => step.source),
    ];

    expect(sources.length).toBeGreaterThan(0);
    for (const source of sources) expect(Object.keys(SOURCE_NOTE)).toContain(source);
  });

  it("states the quick-scan essentials: problem, role, decision, delivery and result", () => {
    const labels = QUICK_SCAN.flatMap((item) => (item.kind === "fact" ? [item.label] : []));

    expect(labels).toEqual(["Problem", "My role", "Decision", "Delivered", "Result"]);
  });

  it("links every public-record statement to its public source", () => {
    const publicFacts = allItems.filter((item) => item.kind === "fact" && item.source === "Public record");

    expect(publicFacts.length).toBeGreaterThan(0);
    for (const item of publicFacts) expect(item).toMatchObject({ href: expect.stringMatching(/^https:\/\//) });
  });

  it("keeps the reported metric labelled as reported", () => {
    const result = QUICK_SCAN.find((item) => item.kind === "fact" && item.label === "Result");

    expect(result).toMatchObject({ source: "Reported metric", text: expect.stringContaining("reported") });
  });
});

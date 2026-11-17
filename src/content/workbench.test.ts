import { existsSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { PRACTICE_AREAS, RESEARCH_INFORMS, SCENE_DESCRIPTION, WORKBENCH_AREAS, areaById } from "./workbench";

const APP_DIR = join(__dirname, "..", "app");

/** Whether a site-relative href is a page this static export actually builds. */
function isBuiltRoute(href: string): boolean {
  const path = href.split("#")[0];
  if (!path.startsWith("/") || !path.endsWith("/")) return false;
  return existsSync(join(APP_DIR, path, "page.tsx"));
}

describe("workbench content", () => {
  it("has the five areas once each, research first", () => {
    expect(WORKBENCH_AREAS.map((area) => area.id)).toEqual(["research", "product", "consulting", "public-finance", "advising"]);
    expect(new Set(WORKBENCH_AREAS.map((area) => area.index)).size).toBe(5);
  });

  it("follows each field's process", () => {
    const names = (id: Parameters<typeof areaById>[0]) => areaById(id).steps.map((step) => step.name);
    expect(names("research")).toEqual(["Question", "Method", "Evidence", "Findings", "Implications"]);
    expect(names("product")).toEqual(["Problem framing", "Prioritisation", "Evaluation", "Rollout"]);
    expect(names("consulting")).toEqual(["Question", "Structured analysis", "Options", "Recommendation"]);
    expect(names("public-finance")).toEqual(["Policy question", "Fiscal analysis", "Trade-offs", "Implementation"]);
    expect(names("advising")).toEqual(["Goals", "Preparation", "Feedback", "Next steps"]);
  });

  it("links only to pages the site builds", () => {
    const hrefs = WORKBENCH_AREAS.flatMap((area) => area.links.map((link) => link.href));
    expect(hrefs.length).toBeGreaterThan(0);
    expect(hrefs.filter((href) => !isBuiltRoute(href))).toEqual([]);
  });

  it("says how research informs every practice area", () => {
    for (const area of PRACTICE_AREAS) expect(RESEARCH_INFORMS[area.id].length).toBeGreaterThan(40);
  });

  it("keeps the advising caveat and claims no advising example", () => {
    const advising = areaById("advising");
    expect(advising.example).toBeNull();
    expect(advising.note).toMatch(/not a guarantee/);
  });

  it("has no empty copy", () => {
    const strings = [
      SCENE_DESCRIPTION,
      ...WORKBENCH_AREAS.flatMap((area) => [area.title, area.tag, area.objects, area.purpose, ...area.steps.flatMap((s) => [s.name, s.detail])]),
    ];
    expect(strings.filter((text) => text.trim() === "")).toEqual([]);
  });

  it("throws for an unknown area", () => {
    expect(() => areaById("nope" as never)).toThrow(/Unknown workbench area/);
  });
});

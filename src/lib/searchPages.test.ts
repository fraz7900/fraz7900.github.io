import { describe, expect, test } from "vitest";
import { COMMANDS, type NavItem } from "@/content/site";
import { searchPages } from "./searchPages";

/** Fixed fixture so these tests check the ranking rules, not the current site navigation. */
const PAGES: readonly NavItem[] = [
  { href: "/", label: "Home", description: "Introduction" },
  { href: "/a/", label: "About", description: "Who I am" },
  { href: "/r/", label: "ROI calculator", description: "Estimate value" },
];
const labels = (query: string) => searchPages(PAGES, query).map((page) => page.label);

describe("searchPages", () => {
  test("returns every page for an empty or blank query", () => {
    expect(labels("  ")).toEqual(PAGES.map((page) => page.label));
  });

  test("matches labels case-insensitively", () => {
    expect(labels("ABOUT")).toEqual(["About"]);
  });

  test("ranks label matches above description-only matches", () => {
    expect(labels("ro")).toEqual(["ROI calculator", "Home"]);
  });

  test("returns nothing when no page matches", () => {
    expect(labels("zzz")).toEqual([]);
  });

  test("the live command list has unique destinations and finds the product portfolio", () => {
    const hrefs = COMMANDS.map((command) => command.href);
    expect(new Set(hrefs).size).toBe(hrefs.length);
    expect(searchPages(COMMANDS, "product")[0].href).toBe("/work/product-management/");
  });
});

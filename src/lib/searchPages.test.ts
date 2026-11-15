import { describe, expect, test } from "vitest";
import { HOME_ITEM, NAV_ITEMS } from "@/content/site";
import { searchPages } from "./searchPages";

const PAGES = [HOME_ITEM, ...NAV_ITEMS];
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
});

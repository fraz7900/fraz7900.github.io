import { describe, expect, test } from "vitest";
import type { Update } from "@/content/advising/updates";
import { PUBLISHED_UPDATES, validateUpdate } from "@/content/advising/updates";
import { buildDeadlineIcs } from "./ics";
import {
  EMPTY_QUERY,
  browseUpdates,
  canAddToCalendar,
  effectiveStatus,
  isPast,
  isStale,
  parseQuery,
  queryToParams,
} from "./updateStatus";

const base: Update = {
  slug: "sample",
  title: "Sample opportunity",
  type: "scholarship-opportunity",
  summary: "Summary",
  body: ["Body"],
  programme: "Sample programme",
  destination: "Somewhere",
  applicantScope: "Everyone",
  degreeLevels: ["Master’s"],
  cycle: "2027 intake",
  sourceUrl: "https://example.org/official",
  sourceLabel: "Official",
  publishedOn: "2026-11-01",
  lastChecked: "2026-11-01",
  declaredStatus: "open",
  state: "published",
};
const at = (iso: string) => Date.parse(iso);

describe("date-only deadlines", () => {
  const update: Update = { ...base, deadline: { kind: "date", date: "2026-12-01", label: "Deadline" } };

  test("are not past while the date is still running anywhere on Earth", () => {
    expect(isPast(update.deadline!, at("2026-12-02T11:59:00Z"))).toBe(false);
    expect(effectiveStatus(update, at("2026-12-02T11:59:00Z"))).toBe("open");
  });

  test("expire once the date has ended everywhere, and never stay open", () => {
    expect(isPast(update.deadline!, at("2026-12-02T12:00:00Z"))).toBe(true);
    expect(effectiveStatus(update, at("2026-12-02T12:00:00Z"))).toBe("closed");
  });
});

describe("exact deadlines", () => {
  const update: Update = {
    ...base,
    deadline: { kind: "instant", instant: "2026-12-01T11:00:00Z", timezoneLabel: "11:00 UTC", label: "Deadline" },
  };

  test("expire at the stated instant", () => {
    expect(effectiveStatus(update, at("2026-12-01T10:59:59Z"))).toBe("open");
    expect(effectiveStatus(update, at("2026-12-01T11:00:00Z"))).toBe("closed");
  });

  test("calendar files are offered only before the deadline", () => {
    expect(canAddToCalendar(update, at("2026-11-30T00:00:00Z"))).toBe(true);
    expect(canAddToCalendar(update, at("2026-12-02T00:00:00Z"))).toBe(false);
  });
});

describe("verification", () => {
  test("unchecked items are unverified, never open", () => {
    expect(effectiveStatus({ ...base, lastChecked: null, declaredStatus: "unverified" }, at("2026-11-14T00:00:00Z"))).toBe("unverified");
  });

  test("an upcoming item past its opening date is not inferred to be open", () => {
    const update: Update = { ...base, declaredStatus: "upcoming", opens: { kind: "date", date: "2026-11-01", label: "Opens" } };
    expect(effectiveStatus(update, at("2026-11-10T00:00:00Z"))).toBe("unverified");
  });

  test("items without a status show none", () => {
    const guidance: Update = { ...base, declaredStatus: undefined };
    expect(effectiveStatus(guidance, at("2026-11-14T00:00:00Z"))).toBe("none");
  });

  test("items not re-checked for 60 days are stale", () => {
    expect(isStale(base, at("2026-12-15T00:00:00Z"))).toBe(false);
    expect(isStale(base, at("2027-01-15T00:00:00Z"))).toBe(true);
  });

  test("validation rejects dates without a check date and exact times without a timezone", () => {
    expect(validateUpdate({ ...base, lastChecked: null, deadline: { kind: "date", date: "2026-12-01", label: "x" } })).not.toEqual([]);
    expect(validateUpdate({ ...base, deadline: { kind: "instant", instant: "2026-12-01T11:00", timezoneLabel: "", label: "x" } })).toHaveLength(2);
    expect(validateUpdate({ ...base, declaredStatus: "open", lastChecked: null })).not.toEqual([]);
  });

  test("seed content is valid and the past Fulbright cycle shows as closed", () => {
    expect(PUBLISHED_UPDATES.flatMap(validateUpdate)).toEqual([]);
    const fulbright = PUBLISHED_UPDATES.find((u) => u.slug.startsWith("fulbright"))!;
    expect(effectiveStatus(fulbright, at("2026-11-14T00:00:00Z"))).toBe("closed");
  });
});

describe("browsing", () => {
  const items: Update[] = [
    { ...base, slug: "a", title: "Alpha grant", lastChecked: "2026-10-01", deadline: { kind: "date", date: "2027-03-01", label: "d" } },
    { ...base, slug: "b", title: "Beta award", type: "application-guidance", lastChecked: "2026-11-10", degreeLevels: ["PhD"] },
    { ...base, slug: "c", title: "Gamma fellowship", lastChecked: "2026-09-01", deadline: { kind: "date", date: "2027-01-15", label: "d" } },
  ];
  const now = at("2026-11-14T00:00:00Z");

  test("search, filters and combinations narrow the list; nothing matching returns empty", () => {
    expect(browseUpdates(items, { ...EMPTY_QUERY, q: "beta" }, now).map((u) => u.slug)).toEqual(["b"]);
    expect(browseUpdates(items, { ...EMPTY_QUERY, level: "PhD" }, now).map((u) => u.slug)).toEqual(["b"]);
    expect(browseUpdates(items, { ...EMPTY_QUERY, type: "application-guidance", q: "alpha" }, now)).toEqual([]);
  });

  test("sorts by recent update or by soonest verified deadline", () => {
    expect(browseUpdates(items, EMPTY_QUERY, now).map((u) => u.slug)).toEqual(["b", "a", "c"]);
    expect(browseUpdates(items, { ...EMPTY_QUERY, sort: "deadline" }, now).map((u) => u.slug)).toEqual(["c", "a", "b"]);
  });

  test("URL state round-trips and ignores unknown values", () => {
    const query = { ...EMPTY_QUERY, q: "grant", type: "scholarship-opportunity" as const, sort: "deadline" as const };
    expect(parseQuery(new URLSearchParams(queryToParams(query)))).toEqual(query);
    expect(parseQuery(new URLSearchParams("type=hack&status=<x>&sort=zzz"))).toEqual(EMPTY_QUERY);
    expect(queryToParams(EMPTY_QUERY)).toBe("");
  });
});

describe("calendar files", () => {
  test("date-only deadlines become all-day events with no invented time zone", () => {
    const ics = buildDeadlineIcs({ ...base, deadline: { kind: "date", date: "2026-12-31", label: "Deadline" } }, at("2026-11-14T00:00:00Z"));
    expect(ics).toContain("DTSTART;VALUE=DATE:20261231");
    expect(ics).toContain("DTEND;VALUE=DATE:20270101");
    expect(ics).not.toContain("TZID");
  });

  test("exact deadlines are written in UTC and text is escaped", () => {
    const ics = buildDeadlineIcs(
      { ...base, programme: "A, B; C", deadline: { kind: "instant", instant: "2027-07-08T16:00:00Z", timezoneLabel: "17:00 BST", label: "Offer" } },
      at("2026-11-14T00:00:00Z"),
    );
    expect(ics).toContain("DTSTART:20270708T160000Z");
    expect(ics).toContain("SUMMARY:A\\, B\\; C: Offer");
    expect(ics.split("\r\n").every((line) => line.length <= 75)).toBe(true);
  });
});

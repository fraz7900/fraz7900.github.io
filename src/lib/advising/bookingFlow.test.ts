import { describe, expect, test } from "vitest";
import { BOOKING_FOCUSES, GENERAL_PREPARATION, focusById } from "@/content/advising/bookingFocus";
import { BOOKING } from "@/content/advising/config";
import { SERVICES } from "@/content/advising/services";
import { bookingSteps, costText, fallbackHref, sessionFacts } from "./bookingFlow";

describe("bookingSteps", () => {
  test("starts on choosing a focus", () => {
    expect(bookingSteps(false, "ready").map((s) => s.status)).toEqual(["current", "upcoming", "upcoming"]);
  });

  test("moves to picking a time once a focus is chosen", () => {
    expect(bookingSteps(true, "ready").map((s) => s.status)).toEqual(["done", "current", "upcoming"]);
  });

  test("never marks the booking confirmed: only the provider or an email reply can", () => {
    for (const kind of ["ready", "disabled", "misconfigured"] as const) {
      expect(bookingSteps(true, kind)[2].status).toBe("upcoming");
    }
  });

  test("says where each step happens, online or by email", () => {
    expect(bookingSteps(true, "ready").map((s) => s.note)).toEqual(["", "in the calendar", "by the provider’s email"]);
    expect(bookingSteps(true, "disabled").map((s) => s.note)).toEqual(["", "by email", "when I reply"]);
  });

  test("keeps the labels the page promises", () => {
    expect(bookingSteps(false, "ready").map((s) => s.label)).toEqual(["Choose focus", "Pick time", "Confirm"]);
  });
});

describe("sessionFacts and costText", () => {
  test("come from configuration only", () => {
    expect(sessionFacts(BOOKING)).toEqual([
      { term: "Duration", detail: `${BOOKING.sessionMinutes} minutes` },
      { term: "Format", detail: BOOKING.format },
      { term: "Cost", detail: "Currently free" },
    ]);
  });

  test("show a configured price, or ask about pricing when it is incomplete", () => {
    expect(costText({ mode: "paid", amount: 40, currency: "USD" })).toBe("$40.00");
    expect(costText({ mode: "paid", amount: 40 })).toBe("Ask about pricing");
    expect(costText({ mode: "contact" })).toBe("Ask about pricing");
  });
});

describe("fallbackHref", () => {
  const base = "mailto:frazahmed79@gmail.com?subject=Advising%20conversation";

  test("adds only the focus name to the email subject", () => {
    expect(fallbackHref(base, "Scholarship guidance")).toBe(
      "mailto:frazahmed79@gmail.com?subject=Advising%20conversation%3A%20Scholarship%20guidance",
    );
  });

  test("leaves the link unchanged without a focus", () => {
    expect(fallbackHref(base)).toBe(base);
  });

  test("adds a subject when the link has none", () => {
    expect(fallbackHref("mailto:a@b.co", "Career advising")).toBe("mailto:a@b.co?subject=Career%20advising");
    expect(fallbackHref("mailto:a@b.co?cc=c@d.co", "Career advising")).toBe("mailto:a@b.co?cc=c@d.co&subject=Career%20advising");
  });
});

describe("booking focuses", () => {
  test("offers the four focuses in order, each with preparation and a guide", () => {
    expect(BOOKING_FOCUSES.map((f) => f.title)).toEqual(["Career advising", "Test preparation", "Admissions support", "Scholarship guidance"]);
    for (const focus of BOOKING_FOCUSES) {
      expect(focus.prepare.length).toBeGreaterThan(0);
      expect(focus.guide.href).toMatch(/^\/advising\/[a-z-]+\/$/);
    }
    expect(GENERAL_PREPARATION.length).toBeGreaterThan(0);
  });

  test("every service id used in ?topic= links elsewhere is a focus", () => {
    for (const service of SERVICES) expect(focusById(service.id)?.id).toBe(service.id);
  });

  test("unknown or missing topics select nothing", () => {
    expect(focusById("astrology")).toBeUndefined();
    expect(focusById(null)).toBeUndefined();
  });
});

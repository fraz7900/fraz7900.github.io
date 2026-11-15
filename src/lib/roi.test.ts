import { describe, expect, test } from "vitest";
import {
  DEFAULT_ROI_INPUTS,
  ROI_FIELDS,
  calculateRoi,
  parseRoiInputs,
  toRawInputs,
  type RoiInputs,
} from "./roi";

const BRIEF_EXAMPLE: RoiInputs = {
  monthlyCases: 800,
  adoptionPercent: 75,
  minutesSavedPerCase: 4,
  hourlyCostUsd: 30,
  monthlyCostUsd: 600,
};

describe("calculateRoi", () => {
  test("reproduces the published worked example", () => {
    const result = calculateRoi(BRIEF_EXAMPLE);

    expect(result.adoptedCases).toBe(600);
    expect(result.hoursSaved).toBe(40);
    expect(result.grossMonthlyValue).toBe(1200);
    expect(result.netMonthlyValue).toBe(600);
    expect(result.breakEvenMinutes).toBe(2);
  });

  test("uses the worked example as the default inputs", () => {
    expect(DEFAULT_ROI_INPUTS).toEqual(BRIEF_EXAMPLE);
  });

  test("returns no break-even threshold when case volume is zero", () => {
    const result = calculateRoi({ ...BRIEF_EXAMPLE, monthlyCases: 0 });

    expect(result.grossMonthlyValue).toBe(0);
    expect(result.netMonthlyValue).toBe(-600);
    expect(result.breakEvenMinutes).toBeNull();
  });

  test("returns no break-even threshold when adoption is zero", () => {
    const result = calculateRoi({ ...BRIEF_EXAMPLE, adoptionPercent: 0 });

    expect(result.adoptedCases).toBe(0);
    expect(result.breakEvenMinutes).toBeNull();
  });

  test("returns no break-even threshold when hourly cost is zero", () => {
    const result = calculateRoi({ ...BRIEF_EXAMPLE, hourlyCostUsd: 0 });

    expect(result.grossMonthlyValue).toBe(0);
    expect(result.breakEvenMinutes).toBeNull();
  });

  test("break-even is zero minutes when there is no recurring cost", () => {
    const result = calculateRoi({ ...BRIEF_EXAMPLE, monthlyCostUsd: 0 });

    expect(result.netMonthlyValue).toBe(1200);
    expect(result.breakEvenMinutes).toBe(0);
  });

  test("reports a negative net value when recurring cost exceeds labor value", () => {
    const result = calculateRoi({ ...BRIEF_EXAMPLE, minutesSavedPerCase: 1 });

    expect(result.grossMonthlyValue).toBe(300);
    expect(result.netMonthlyValue).toBe(-300);
    expect(result.breakEvenMinutes).toBe(2);
  });

  test("does not round intermediate values", () => {
    const result = calculateRoi({ ...BRIEF_EXAMPLE, monthlyCases: 7, adoptionPercent: 33 });

    expect(result.grossMonthlyValue).toBeCloseTo(7 * 0.33 * (4 / 60) * 30, 10);
  });
});

describe("parseRoiInputs", () => {
  test("accepts the default inputs as strings", () => {
    const parsed = parseRoiInputs(toRawInputs(DEFAULT_ROI_INPUTS));

    expect(parsed).toEqual({ ok: true, values: DEFAULT_ROI_INPUTS });
  });

  test("accepts thousands separators and surrounding spaces", () => {
    const parsed = parseRoiInputs({ ...toRawInputs(DEFAULT_ROI_INPUTS), monthlyCases: " 1,200 " });

    expect(parsed.ok && parsed.values.monthlyCases).toBe(1200);
  });

  test("flags an empty field", () => {
    const parsed = parseRoiInputs({ ...toRawInputs(DEFAULT_ROI_INPUTS), hourlyCostUsd: "  " });

    expect(parsed.ok).toBe(false);
    expect(!parsed.ok && parsed.errors.hourlyCostUsd).toMatch(/enter/i);
  });

  test.each(["1,000", "1,000,000", "12,345.5"])("accepts well-formed thousands separators in %s", (raw) => {
    const parsed = parseRoiInputs({ ...toRawInputs(DEFAULT_ROI_INPUTS), monthlyCases: raw });

    expect(parsed.ok && parsed.values.monthlyCases).toBe(Number(raw.replaceAll(",", "")));
  });

  test.each(["1,,2", "12,34", ",5", "1,0000", "1,000,", "1.5,000"])(
    "rejects malformed thousands separators in %s",
    (raw) => {
      const parsed = parseRoiInputs({ ...toRawInputs(DEFAULT_ROI_INPUTS), adoptionPercent: raw });

      expect(parsed.ok).toBe(false);
      expect(!parsed.ok && parsed.errors.adoptionPercent).toMatch(/number/i);
    },
  );

  test.each(["abc", "12abc", "1e3", "--4", "Infinity", "NaN", "0x10"])(
    "flags non-numeric input %s",
    (raw) => {
      const parsed = parseRoiInputs({ ...toRawInputs(DEFAULT_ROI_INPUTS), monthlyCases: raw });

      expect(parsed.ok).toBe(false);
      expect(!parsed.ok && parsed.errors.monthlyCases).toMatch(/number/i);
    },
  );

  test("flags values above the field maximum", () => {
    const parsed = parseRoiInputs({ ...toRawInputs(DEFAULT_ROI_INPUTS), adoptionPercent: "101" });

    expect(parsed.ok).toBe(false);
    expect(!parsed.ok && parsed.errors.adoptionPercent).toMatch(/between 0 and 100/);
  });

  test("flags negative values", () => {
    const parsed = parseRoiInputs({ ...toRawInputs(DEFAULT_ROI_INPUTS), monthlyCostUsd: "-1" });

    expect(parsed.ok).toBe(false);
    expect(!parsed.ok && parsed.errors.monthlyCostUsd).toMatch(/between/);
  });

  test("reports every invalid field at once", () => {
    const parsed = parseRoiInputs({
      ...toRawInputs(DEFAULT_ROI_INPUTS),
      monthlyCases: "",
      minutesSavedPerCase: "x",
    });

    expect(!parsed.ok && Object.keys(parsed.errors).sort()).toEqual([
      "minutesSavedPerCase",
      "monthlyCases",
    ]);
  });

  test("every field has a label, unit and a sane range", () => {
    for (const field of ROI_FIELDS) {
      expect(field.label.length).toBeGreaterThan(0);
      expect(field.unit.length).toBeGreaterThan(0);
      expect(field.min).toBeLessThan(field.max);
      expect(DEFAULT_ROI_INPUTS[field.key]).toBeGreaterThanOrEqual(field.min);
      expect(DEFAULT_ROI_INPUTS[field.key]).toBeLessThanOrEqual(field.max);
    }
  });
});

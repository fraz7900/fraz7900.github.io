/**
 * Workflow ROI model — the single source of truth for both calculator views.
 *
 * The model values staff time at a loaded hourly cost and nets out a recurring
 * monthly cost. It is illustrative: it does not establish realised cash savings.
 * All values are unrounded here; round only when presenting.
 */

export type RoiFieldKey =
  | "monthlyCases"
  | "adoptionPercent"
  | "minutesSavedPerCase"
  | "hourlyCostUsd"
  | "monthlyCostUsd";

export type RoiInputs = Readonly<Record<RoiFieldKey, number>>;
export type RawRoiInputs = Readonly<Record<RoiFieldKey, string>>;

export interface RoiField {
  readonly key: RoiFieldKey;
  readonly label: string;
  readonly unit: string;
  readonly min: number;
  readonly max: number;
  readonly hint: string;
}

export interface RoiResult {
  readonly adoptedCases: number;
  readonly hoursSaved: number;
  readonly grossMonthlyValue: number;
  readonly netMonthlyValue: number;
  /** Minutes saved per adopted case needed to cover the recurring cost; null when undefined. */
  readonly breakEvenMinutes: number | null;
}

export type ParseResult =
  | { readonly ok: true; readonly values: RoiInputs }
  | { readonly ok: false; readonly errors: Partial<Record<RoiFieldKey, string>> };

const MINUTES_PER_HOUR = 60;
const PERCENT = 100;

export const ROI_FIELDS: readonly RoiField[] = [
  {
    key: "monthlyCases",
    label: "Monthly case volume",
    unit: "cases / month",
    min: 0,
    max: 1_000_000,
    hint: "Cases that pass through the workflow each month.",
  },
  {
    key: "adoptionPercent",
    label: "Adoption",
    unit: "% of cases",
    min: 0,
    max: 100,
    hint: "Share of cases that actually use the new workflow.",
  },
  {
    key: "minutesSavedPerCase",
    label: "Minutes saved per adopted case",
    unit: "minutes",
    min: 0,
    max: 480,
    hint: "Staff time saved each time the new workflow is used.",
  },
  {
    key: "hourlyCostUsd",
    label: "Loaded hourly labor cost",
    unit: "USD / hour",
    min: 0,
    max: 1_000,
    hint: "Wage plus benefits and overhead for the staff doing the work.",
  },
  {
    key: "monthlyCostUsd",
    label: "Recurring monthly cost",
    unit: "USD / month",
    min: 0,
    max: 10_000_000,
    hint: "License, support or other cost that recurs every month.",
  },
];

/** The verified worked example: 800 cases, 75% adoption, 4 min, $30/h, $600/month. */
export const DEFAULT_ROI_INPUTS: RoiInputs = {
  monthlyCases: 800,
  adoptionPercent: 75,
  minutesSavedPerCase: 4,
  hourlyCostUsd: 30,
  monthlyCostUsd: 600,
};

export function calculateRoi(inputs: RoiInputs): RoiResult {
  const adoptionFraction = inputs.adoptionPercent / PERCENT;
  const adoptedCases = inputs.monthlyCases * adoptionFraction;
  const hoursSaved = (adoptedCases * inputs.minutesSavedPerCase) / MINUTES_PER_HOUR;
  const grossMonthlyValue = hoursSaved * inputs.hourlyCostUsd;
  const netMonthlyValue = grossMonthlyValue - inputs.monthlyCostUsd;
  const valuePerAdoptedHour = adoptedCases * inputs.hourlyCostUsd;
  const breakEvenMinutes =
    valuePerAdoptedHour === 0
      ? null
      : (MINUTES_PER_HOUR * inputs.monthlyCostUsd) / valuePerAdoptedHour;

  return { adoptedCases, hoursSaved, grossMonthlyValue, netMonthlyValue, breakEvenMinutes };
}

// Plain digits, or digits grouped in threes with commas (1,000,000); optional decimal part.
const NUMBER_PATTERN = /^-?(\d+|\d{1,3}(,\d{3})+)?(\.\d*)?$/;

function parseField(field: RoiField, raw: string): { value: number } | { error: string } {
  const trimmed = raw.trim();
  if (trimmed === "") return { error: `Enter ${field.label.toLowerCase()}.` };
  if (!NUMBER_PATTERN.test(trimmed) || !/\d/.test(trimmed)) {
    return { error: "Enter a number, for example 800, 1,200 or 4.5." };
  }
  const cleaned = trimmed.replaceAll(",", "");

  const value = Number(cleaned);
  if (value < field.min || value > field.max) {
    return {
      error: `Enter a value between ${field.min.toLocaleString("en-US")} and ${field.max.toLocaleString("en-US")}.`,
    };
  }
  return { value };
}

export function parseRoiInputs(raw: RawRoiInputs): ParseResult {
  const parsed = ROI_FIELDS.map((field) => [field.key, parseField(field, raw[field.key])] as const);
  const errors = Object.fromEntries(
    parsed.flatMap(([key, result]) => ("error" in result ? [[key, result.error]] : [])),
  );

  if (Object.keys(errors).length > 0) return { ok: false, errors };

  const values = Object.fromEntries(
    parsed.map(([key, result]) => [key, "value" in result ? result.value : 0]),
  ) as RoiInputs;
  return { ok: true, values };
}

export function toRawInputs(inputs: RoiInputs): RawRoiInputs {
  return Object.fromEntries(
    ROI_FIELDS.map((field) => [field.key, String(inputs[field.key])]),
  ) as RawRoiInputs;
}

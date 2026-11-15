/**
 * Study-plan builder: a planning estimate that splits available hours across weeks and areas.
 * It predicts nothing about scores.
 */

export interface StudyPlanInput {
  readonly areas: readonly string[];
  readonly focus: readonly string[];
  readonly weeks: number;
  readonly hoursPerWeek: number;
}

export interface PlanWeek {
  readonly week: number;
  readonly phase: "Baseline" | "Build" | "Practice" | "Final week";
  readonly allocations: readonly { readonly activity: string; readonly hours: number }[];
  readonly total: number;
}

export const LIMITS = { weeks: { min: 1, max: 52 }, hours: { min: 1, max: 40 } } as const;

export function validatePlanInput(input: StudyPlanInput): string[] {
  const errors: string[] = [];
  if (!Number.isInteger(input.weeks) || input.weeks < LIMITS.weeks.min || input.weeks > LIMITS.weeks.max) {
    errors.push(`Choose between ${LIMITS.weeks.min} and ${LIMITS.weeks.max} weeks.`);
  }
  if (!Number.isFinite(input.hoursPerWeek) || input.hoursPerWeek < LIMITS.hours.min || input.hoursPerWeek > LIMITS.hours.max) {
    errors.push(`Choose between ${LIMITS.hours.min} and ${LIMITS.hours.max} hours a week.`);
  }
  if (input.areas.length === 0) errors.push("This test has no areas configured.");
  return errors;
}

const roundHalf = (value: number) => Math.round(value * 2) / 2;

/** Split `total` across weighted keys in half-hour steps, keeping the exact total. */
function split(total: number, weights: readonly (readonly [string, number])[]): { activity: string; hours: number }[] {
  const sum = weights.reduce((acc, [, w]) => acc + w, 0);
  const rows = weights.map(([activity, w]) => ({ activity, hours: roundHalf((total * w) / sum) }));
  const drift = roundHalf(total - rows.reduce((acc, r) => acc + r.hours, 0));
  if (drift !== 0 && rows.length > 0) {
    // Absorb rounding drift in the largest row so no row can go negative.
    const largest = rows.reduce((best, row, i) => (row.hours > rows[best].hours ? i : best), 0);
    return rows
      .map((row, i) => (i === largest ? { ...row, hours: roundHalf(row.hours + drift) } : row))
      .filter((r) => r.hours > 0);
  }
  return rows.filter((r) => r.hours > 0);
}

function phaseFor(week: number, weeks: number): PlanWeek["phase"] {
  if (weeks === 1) return "Final week";
  if (week === weeks) return "Final week";
  if (week === 1) return "Baseline";
  const practiceWeeks = Math.max(1, Math.round(weeks * 0.25));
  return week > weeks - 1 - practiceWeeks ? "Practice" : "Build";
}

export function buildStudyPlan(input: StudyPlanInput): PlanWeek[] {
  const focus = input.focus.filter((f) => input.areas.includes(f));
  const areaWeights = input.areas.map((area) => [area, focus.length === 0 || focus.includes(area) ? 2 : 1] as const);
  const h = roundHalf(input.hoursPerWeek);

  return Array.from({ length: input.weeks }, (_, i) => {
    const week = i + 1;
    const phase = phaseFor(week, input.weeks);
    const allocations =
      phase === "Baseline"
        ? split(h, [["Diagnostic practice and review", 2], ...areaWeights.map(([a, w]) => [a, w] as const)])
        : phase === "Build"
          ? split(h, areaWeights)
          : phase === "Practice"
            ? split(h, [["Full-length timed practice", 2], ["Reviewing mistakes", 2], ...areaWeights.map(([a, w]) => [a, w / 2] as const)])
            : split(h, [["Light review of weak areas", 2], ["Test-day logistics and rest", 1]]);
    return { week, phase, allocations, total: allocations.reduce((acc, a) => acc + a.hours, 0) };
  });
}

export const PLAN_CHECKLIST = [
  "Read the official test-taker information for format, rules and scoring",
  "Book your test date first, then plan backwards from it",
  "Use the official practice material from the test provider",
  "Keep a mistakes log and review it every week",
  "Confirm ID requirements and the test-day check-in process on the official site",
] as const;

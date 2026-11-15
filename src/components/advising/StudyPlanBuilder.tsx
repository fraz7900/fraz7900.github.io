"use client";

import { useId, useState } from "react";
import type { SupportedTest } from "@/content/advising/tests";
import { LIMITS, PLAN_CHECKLIST, buildStudyPlan, validatePlanInput } from "@/lib/advising/studyPlan";

/** Weekly study allocation from test, weeks, hours and focus areas. A planning estimate only. */
export function StudyPlanBuilder({ tests }: { tests: readonly SupportedTest[] }) {
  const id = useId();
  const [testId, setTestId] = useState(tests[0]?.id ?? "");
  const [weeks, setWeeks] = useState("8");
  const [hours, setHours] = useState("8");
  const [focus, setFocus] = useState<readonly string[]>([]);
  const test = tests.find((t) => t.id === testId) ?? tests[0];
  const input = { areas: test?.areas ?? [], focus, weeks: Number(weeks), hoursPerWeek: Number(hours) };
  const errors = validatePlanInput(input);
  const plan = errors.length === 0 ? buildStudyPlan(input) : [];

  const toggleFocus = (area: string) =>
    setFocus((current) => (current.includes(area) ? current.filter((a) => a !== area) : [...current, area]));

  return (
    <div className="glass flex flex-col gap-6 rounded-xl p-5 sm:p-6">
      <div className="grid grid-cols-[minmax(0,1fr)] gap-5 md:grid-cols-3">
        <label className="flex flex-col gap-1.5 text-sm font-medium text-ink" htmlFor={`${id}-test`}>
          Test
          <select
            id={`${id}-test`}
            value={testId}
            onChange={(event) => {
              setTestId(event.target.value);
              setFocus([]);
            }}
            className="w-full min-w-0 rounded-md border border-line-strong bg-card px-3 py-2 text-base font-normal text-ink"
          >
            {tests.map((t) => (
              <option key={t.id} value={t.id}>
                {t.name}
                {t.confirmed ? "" : " (dev preview)"}
              </option>
            ))}
          </select>
        </label>
        <label className="flex flex-col gap-1.5 text-sm font-medium text-ink" htmlFor={`${id}-weeks`}>
          Weeks until your test
          <input
            id={`${id}-weeks`}
            type="number"
            inputMode="numeric"
            min={LIMITS.weeks.min}
            max={LIMITS.weeks.max}
            value={weeks}
            onChange={(event) => setWeeks(event.target.value)}
            aria-invalid={errors.some((e) => e.includes("weeks")) || undefined}
            aria-describedby={`${id}-errors`}
            className="rounded-md border border-line-strong bg-card px-3 py-2 font-mono text-base font-normal text-ink"
          />
        </label>
        <label className="flex flex-col gap-1.5 text-sm font-medium text-ink" htmlFor={`${id}-hours`}>
          Study hours per week
          <input
            id={`${id}-hours`}
            type="number"
            inputMode="decimal"
            min={LIMITS.hours.min}
            max={LIMITS.hours.max}
            step={0.5}
            value={hours}
            onChange={(event) => setHours(event.target.value)}
            aria-invalid={errors.some((e) => e.includes("hours")) || undefined}
            aria-describedby={`${id}-errors`}
            className="rounded-md border border-line-strong bg-card px-3 py-2 font-mono text-base font-normal text-ink"
          />
        </label>
      </div>

      {test && (
        <fieldset className="min-w-0">
          <legend className="mb-2.5 text-sm font-medium text-ink">Areas to focus on (optional; they get twice the time)</legend>
          <div className="flex flex-wrap gap-2">
            {test.areas.map((area) => (
              <label
                key={area}
                className="cursor-pointer rounded-full border border-line-strong px-3 py-1.5 text-sm text-ink/90 has-[:checked]:border-accent has-[:checked]:bg-accent-soft has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-accent"
              >
                <input type="checkbox" checked={focus.includes(area)} onChange={() => toggleFocus(area)} className="sr-only" />
                {area}
              </label>
            ))}
          </div>
          {test.officialUrl && (
            <p className="mt-3 text-xs text-muted">
              Format and rules change. Check the{" "}
              <a href={test.officialUrl} className="link-accent" target="_blank" rel="noreferrer">
                official {test.name} site
              </a>
              .
            </p>
          )}
        </fieldset>
      )}

      <div id={`${id}-errors`} role="alert" className="text-sm text-danger empty:hidden">
        {errors.join(" ")}
      </div>

      {plan.length > 0 && (
        <div className="flex flex-col gap-4 border-t border-line pt-5">
          <p className="font-mono text-xs text-amber">
            planning estimate · {plan.length} week{plan.length === 1 ? "" : "s"} ·{" "}
            {plan.reduce((sum, week) => sum + week.total, 0)} hours in total · no score prediction
          </p>
          <div tabIndex={0} role="region" aria-label="Weekly study plan (scrolls sideways)" className="max-h-[28rem] overflow-auto rounded-lg border border-line">
            <table className="w-full min-w-[32rem] border-collapse text-left text-sm">
              <thead className="sticky top-0 bg-card text-xs text-muted">
                <tr>
                  <th scope="col" className="px-3 py-2 font-medium">Week</th>
                  <th scope="col" className="px-3 py-2 font-medium">Phase</th>
                  <th scope="col" className="px-3 py-2 font-medium">Hours by activity</th>
                </tr>
              </thead>
              <tbody>
                {plan.map((week) => (
                  <tr key={week.week} className="border-t border-line align-top">
                    <th scope="row" className="px-3 py-2 font-mono font-normal text-ink">{week.week}</th>
                    <td className="px-3 py-2 text-ink">{week.phase}</td>
                    <td className="px-3 py-2 text-muted">
                      {week.allocations.map((a) => `${a.activity} ${a.hours}h`).join(" · ")}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-ink">Preparation checklist</h3>
            <ul className="mt-2 grid gap-1.5 text-sm text-ink/90 sm:grid-cols-2">
              {PLAN_CHECKLIST.map((item) => (
                <li key={item} className="flex gap-2">
                  <span aria-hidden="true" className="text-accent">
                    ☐
                  </span>
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}

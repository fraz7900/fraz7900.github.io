import type { Metadata } from "next";
import { RoiCalculator } from "@/components/RoiCalculator";
import { SectionLabel } from "@/components/SectionLabel";
import { formatDecimal, formatUsd } from "@/lib/format";
import { DEFAULT_ROI_INPUTS, ROI_FIELDS, calculateRoi } from "@/lib/roi";

export const metadata: Metadata = {
  title: "Workflow ROI calculator",
  description:
    "An illustrative calculator for the monthly value of a workflow change: gross labor value, net value and the break-even minutes saved per case.",
};

const ALL_FIELDS = ROI_FIELDS.map((field) => field.key);
const example = DEFAULT_ROI_INPUTS;
const exampleResult = calculateRoi(example);

const FORMULAS = [
  {
    name: "Monthly gross labor value",
    expression: "case volume × adoption fraction × minutes saved ÷ 60 × loaded hourly labor cost",
  },
  {
    name: "Estimated monthly net value",
    expression: "gross labor value − recurring monthly cost",
  },
  {
    name: "Break-even minutes saved per adopted case",
    expression: "60 × recurring monthly cost ÷ (case volume × adoption fraction × loaded hourly labor cost)",
  },
] as const;

export default function WorkflowRoiPage() {
  return (
    <div className="page-container flex flex-col gap-12 py-12 sm:py-16">
      <header className="flex max-w-2xl flex-col gap-4">
        <SectionLabel>Tool</SectionLabel>
        <h1 className="font-display text-5xl text-ink">Workflow ROI calculator</h1>
        <p className="text-lg leading-relaxed text-ink/85">
          Before a team commits to a new workflow, it helps to know how much staff time the change has
          to save to pay for itself. Change any assumption to see the monthly value and the break-even
          point.
        </p>
      </header>

      <section
        aria-labelledby="calculator-heading"
        className="grid grid-cols-[minmax(0,1fr)] gap-10 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)]"
      >
        <div className="rounded-lg border border-line bg-card p-5 sm:p-6">
          <h2 id="calculator-heading" className="mb-5 font-display text-2xl text-ink">
            Assumptions
          </h2>
          <RoiCalculator editable={ALL_FIELDS} />
        </div>

        <div className="flex flex-col gap-8">
          <section aria-labelledby="formula-heading" className="flex flex-col gap-3">
            <SectionLabel as="h2" id="formula-heading" index="01">
              Formula
            </SectionLabel>
            <dl className="flex flex-col gap-4">
              {FORMULAS.map((formula) => (
                <div key={formula.name}>
                  <dt className="text-sm font-medium text-ink">{formula.name}</dt>
                  <dd className="mt-1 font-mono text-sm leading-relaxed text-muted">{formula.expression}</dd>
                </div>
              ))}
            </dl>
            <p className="text-sm text-muted">
              Adoption fraction is the adoption percentage divided by 100. If the break-even
              denominator is zero (no case volume, no adoption or no labor cost), the threshold
              can’t be calculated.
            </p>
          </section>

          <section aria-labelledby="assumptions-heading" className="flex flex-col gap-3">
            <SectionLabel as="h2" id="assumptions-heading" index="02">
              What the model assumes
            </SectionLabel>
            <ul className="flex list-disc flex-col gap-2 pl-5 text-sm leading-relaxed text-ink">
              <li>
                It values staff time at a loaded hourly cost. Time saved becomes cash only if it is
                redeployed or reduces paid hours.
              </li>
              <li>It counts recurring monthly costs only. One-time implementation cost is not included.</li>
              <li>Results are illustrative and do not establish realized cash savings.</li>
              <li>Everything runs in your browser. Nothing you enter is sent anywhere.</li>
            </ul>
          </section>
        </div>
      </section>

      <section aria-labelledby="example-heading" className="flex max-w-3xl flex-col gap-4">
        <SectionLabel as="h2" id="example-heading" index="03">
          Worked example
        </SectionLabel>
        <p className="text-ink">
          {example.monthlyCases.toLocaleString("en-US")} cases a month, {example.adoptionPercent}%
          adoption, {example.minutesSavedPerCase} minutes saved per adopted case,{" "}
          {formatUsd(example.hourlyCostUsd)}/hour loaded labor cost and a{" "}
          {formatUsd(example.monthlyCostUsd)} recurring monthly cost. These are the calculator’s
          starting values.
        </p>
        <ol className="flex flex-col gap-2 rounded-lg border border-line bg-card p-5 font-mono text-sm leading-relaxed text-ink">
          <li>
            Gross: {example.monthlyCases} × {example.adoptionPercent / 100} × {example.minutesSavedPerCase} ÷
            60 × {example.hourlyCostUsd} = <strong>{formatUsd(exampleResult.grossMonthlyValue)}</strong>
          </li>
          <li>
            Net: {formatUsd(exampleResult.grossMonthlyValue)} − {formatUsd(example.monthlyCostUsd)} ={" "}
            <strong>{formatUsd(exampleResult.netMonthlyValue)}</strong>
          </li>
          <li>
            Break-even: 60 × {example.monthlyCostUsd} ÷ ({example.monthlyCases} ×{" "}
            {example.adoptionPercent / 100} × {example.hourlyCostUsd}) ={" "}
            <strong>
              {exampleResult.breakEvenMinutes === null
                ? "not calculable"
                : `${formatDecimal(exampleResult.breakEvenMinutes)} minutes`}
            </strong>
          </li>
        </ol>
        {exampleResult.breakEvenMinutes !== null && (
          <p className="text-sm text-muted">
            The change saves {example.minutesSavedPerCase} minutes per adopted case against a{" "}
            {formatDecimal(exampleResult.breakEvenMinutes)}-minute break-even threshold, so under these
            assumptions it {exampleResult.netMonthlyValue >= 0 ? "covers" : "does not cover"} its
            recurring cost.
          </p>
        )}
      </section>
    </div>
  );
}

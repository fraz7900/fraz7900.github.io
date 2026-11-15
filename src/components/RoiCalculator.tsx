"use client";

import Link from "next/link";
import { useId, useState } from "react";
import { formatDecimal, formatUsd } from "@/lib/format";
import {
  DEFAULT_ROI_INPUTS,
  ROI_FIELDS,
  calculateRoi,
  parseRoiInputs,
  toRawInputs,
  type RawRoiInputs,
  type RoiField,
  type RoiFieldKey,
  type RoiResult,
} from "@/lib/roi";

interface RoiCalculatorProps {
  /** Fields the visitor can edit; the rest are shown as fixed assumptions. */
  readonly editable: readonly RoiFieldKey[];
  /** Show the link to the full tool (used by the homepage preview). */
  readonly linkToFullTool?: boolean;
}

const DEFAULT_RAW = toRawInputs(DEFAULT_ROI_INPUTS);

export function RoiCalculator({ editable, linkToFullTool = false }: RoiCalculatorProps) {
  const [raw, setRaw] = useState<RawRoiInputs>(DEFAULT_RAW);
  const idPrefix = useId();
  const parsed = parseRoiInputs(raw);
  const editableFields = ROI_FIELDS.filter((field) => editable.includes(field.key));
  const fixedFields = ROI_FIELDS.filter((field) => !editable.includes(field.key));
  const isEdited = ROI_FIELDS.some((field) => raw[field.key] !== DEFAULT_RAW[field.key]);

  const updateField = (key: RoiFieldKey, value: string) => {
    setRaw((current) => ({ ...current, [key]: value }));
  };

  return (
    <form
      className="flex flex-col gap-5"
      noValidate
      onSubmit={(event) => event.preventDefault()}
      aria-label="Workflow ROI calculator"
    >
      <fieldset className="flex min-w-0 flex-col gap-4">
        <legend className="sr-only">Assumptions you can change</legend>
        {editableFields.map((field) => (
          <RoiInput
            key={field.key}
            field={field}
            id={`${idPrefix}-${field.key}`}
            value={raw[field.key]}
            error={parsed.ok ? undefined : parsed.errors[field.key]}
            onChange={(value) => updateField(field.key, value)}
          />
        ))}
      </fieldset>

      {fixedFields.length > 0 && <FixedAssumptions fields={fixedFields} raw={raw} />}

      <RoiResults result={parsed.ok ? calculateRoi(parsed.values) : null} />

      <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-sm">
        {isEdited && (
          <button
            type="button"
            className="font-mono text-xs uppercase tracking-wider text-accent underline-offset-4 hover:underline"
            onClick={() => setRaw(DEFAULT_RAW)}
          >
            Reset to example
          </button>
        )}
        {linkToFullTool && (
          <Link href="/tools/workflow-roi/" className="link-accent">
            Edit all assumptions and see the formula
          </Link>
        )}
      </div>
    </form>
  );
}

interface RoiInputProps {
  readonly field: RoiField;
  readonly id: string;
  readonly value: string;
  readonly error?: string;
  readonly onChange: (value: string) => void;
}

function RoiInput({ field, id, value, error, onChange }: RoiInputProps) {
  const hintId = `${id}-hint`;
  const errorId = `${id}-error`;

  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={id} className="text-sm font-medium text-ink">
        {field.label}
      </label>
      <div className="flex items-stretch">
        <input
          id={id}
          name={field.key}
          type="text"
          inputMode="decimal"
          autoComplete="off"
          value={value}
          onChange={(event) => onChange(event.target.value)}
          aria-invalid={error ? true : undefined}
          aria-describedby={error ? `${errorId} ${hintId}` : hintId}
          className={`min-w-0 flex-1 rounded-l-md border bg-card px-3 py-2 font-mono text-base text-ink ${
            error ? "border-danger" : "border-line"
          }`}
        />
        <span className="flex items-center rounded-r-md border border-l-0 border-line bg-paper px-3 font-mono text-xs text-muted">
          {field.unit}
        </span>
      </div>
      {error && (
        <p id={errorId} className="text-sm text-danger">
          {error}
        </p>
      )}
      <p id={hintId} className="text-xs text-muted">
        {field.hint} Range {field.min.toLocaleString("en-US")}–{field.max.toLocaleString("en-US")}.
      </p>
    </div>
  );
}

function FixedAssumptions({ fields, raw }: { fields: readonly RoiField[]; raw: RawRoiInputs }) {
  return (
    <div>
      <p className="font-mono text-xs uppercase tracking-wider text-muted">Held constant</p>
      <dl className="mt-2 flex flex-col gap-1 text-sm">
        {fields.map((field) => (
          <div key={field.key} className="flex flex-wrap justify-between gap-x-3">
            <dt className="text-muted">{field.label}</dt>
            <dd className="font-mono text-ink">
              {raw[field.key]} <span className="text-muted">{field.unit}</span>
            </dd>
          </div>
        ))}
      </dl>
    </div>
  );
}

function RoiResults({ result }: { result: RoiResult | null }) {
  return (
    <div aria-live="polite" aria-atomic="true" className="rounded-md border border-line bg-paper p-4">
      <h3 className="font-mono text-xs uppercase tracking-wider text-muted">Estimated result</h3>
      {result ? (
        <ResultList result={result} />
      ) : (
        <p className="mt-2 text-sm text-ink">Fix the highlighted fields to see a result.</p>
      )}
    </div>
  );
}

function ResultList({ result }: { result: RoiResult }) {
  const isNegative = result.netMonthlyValue < 0;

  return (
    <>
      <dl className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-3">
        <ResultItem label="Gross labor value" value={`${formatUsd(result.grossMonthlyValue)}/mo`} />
        <ResultItem
          label="Estimated net value"
          value={`${formatUsd(result.netMonthlyValue)}/mo`}
          tone={isNegative ? "danger" : "accent"}
        />
        <ResultItem
          label="Break-even"
          value={
            result.breakEvenMinutes === null
              ? "Not calculable"
              : `${formatDecimal(result.breakEvenMinutes)} min/case`
          }
        />
      </dl>
      <p className="mt-3 text-xs text-muted">
        {result.breakEvenMinutes === null
          ? "With zero adopted cases or a zero labor cost, time saved has no labor value under these assumptions, so a break-even threshold can’t be calculated."
          : isNegative
            ? "The recurring cost exceeds the value of staff time saved under these assumptions."
            : `${formatDecimal(result.hoursSaved)} staff hours saved per month. Illustrative only: values staff time, not realized cash savings.`}
      </p>
    </>
  );
}

function ResultItem({
  label,
  value,
  tone = "ink",
}: {
  label: string;
  value: string;
  tone?: "ink" | "accent" | "danger";
}) {
  const toneClass = { ink: "text-ink", accent: "text-accent", danger: "text-danger" }[tone];

  return (
    <div>
      <dt className="text-xs text-muted">{label}</dt>
      <dd className={`mt-0.5 font-mono text-lg font-semibold [overflow-wrap:anywhere] ${toneClass}`}>
        {value}
      </dd>
    </div>
  );
}

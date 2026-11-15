"use client";

import { useState } from "react";
import { Chip, MockFrame, Pin } from "../mockup-kit";

interface Candidate {
  readonly code: string;
  readonly description: string;
  readonly category: string;
  readonly flag?: string;
  readonly note: { readonly before: string; readonly evidence: string; readonly after: string };
}

/** Synthetic patient, synthetic note text. ICD-10-CM codes are public; nothing here is real patient data. */
const CANDIDATES: readonly Candidate[] = [
  {
    code: "E11.22",
    description: "Type 2 diabetes mellitus with diabetic chronic kidney disease",
    category: "Diabetes with chronic complications",
    note: {
      before: "A1c 8.1% today. eGFR 52, ",
      evidence: "consistent with CKD stage 3a attributed to diabetic nephropathy",
      after: ". Continue current regimen; recheck renal panel in 3 months.",
    },
  },
  {
    code: "I50.22",
    description: "Chronic systolic (congestive) heart failure",
    category: "Heart failure",
    flag: "Likely negated",
    note: {
      before: "Denies orthopnea or leg swelling. Echo 2019: EF 55%. ",
      evidence: "No history of heart failure",
      after: ". Lungs clear to auscultation.",
    },
  },
  {
    code: "F33.1",
    description: "Major depressive disorder, recurrent, moderate",
    category: "Major depression",
    note: {
      before: "PHQ-9 of 14 today. ",
      evidence: "Recurrent depressive episodes, moderate, managed with sertraline",
      after: "; follow up with behavioral health in 4 weeks.",
    },
  },
  {
    code: "J44.9",
    description: "Chronic obstructive pulmonary disease, unspecified",
    category: "COPD",
    note: {
      before: "Former smoker, 30 pack-years. ",
      evidence: "COPD, stable on inhaled maintenance therapy",
      after: ". No exacerbations since last visit.",
    },
  },
];

const NEGATED_INDEX = 1;

export function CodingReview() {
  const [selected, setSelected] = useState(0);
  const candidate = CANDIDATES[selected];

  return (
    <MockFrame title="CareTrak" context="Clinical decision support">
      <div className="flex flex-col gap-3">
        <PatientBar />
        <div className="grid gap-3 lg:grid-cols-[1.05fr_1fr]">
          <div>
            <div className="mb-2 flex items-center gap-2">
              <p className="text-[13px] font-semibold">Candidates to review</p>
              <Pin n={1} />
              <span className="ml-auto text-[11px] text-ui-muted">Select one to see its evidence</span>
            </div>
            <ul className="flex flex-col gap-1.5">
              {CANDIDATES.map((item, index) => (
                <li key={item.code}>
                  <button
                    type="button"
                    aria-pressed={index === selected}
                    onClick={() => setSelected(index)}
                    className={`flex w-full items-start gap-2.5 rounded border px-2.5 py-2 text-left transition-colors ${
                      index === selected ? "border-accent bg-accent-soft/60" : "border-ui-line hover:border-ink/40"
                    }`}
                  >
                    <span className="mt-px w-[3.25rem] shrink-0 font-mono text-[12px] font-semibold text-ink">
                      {item.code}
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block font-medium">{item.description}</span>
                      <span className="block text-[12px] text-ui-muted">HCC category: {item.category}</span>
                    </span>
                    <span className="flex shrink-0 items-center gap-1.5">
                      {item.flag ? <Chip tone="warn">{item.flag}</Chip> : <Chip tone="neutral">Pending</Chip>}
                      {index === NEGATED_INDEX && <Pin n={3} />}
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          </div>
          <EvidencePanel candidate={candidate} />
        </div>
      </div>
    </MockFrame>
  );
}

function PatientBar() {
  return (
    <div className="flex flex-wrap items-center gap-x-4 gap-y-1 rounded bg-ui-sub px-3 py-2">
      <span className="font-semibold">Demo patient (synthetic)</span>
      <span className="text-ui-muted">67 · F</span>
      <span className="font-mono text-[12px] text-ui-muted">DEMO-0042</span>
      <span className="flex gap-3 text-[12px] sm:ml-auto" aria-hidden="true">
        <span className="border-b-2 border-accent pb-0.5 font-semibold text-ink">Coding review</span>
        <span className="text-ui-muted">Care gaps</span>
        <span className="text-ui-muted">Notes</span>
      </span>
    </div>
  );
}

function EvidencePanel({ candidate }: { candidate: Candidate }) {
  const isFlagged = Boolean(candidate.flag);

  return (
    <div className="flex flex-col gap-3 rounded border border-ui-line p-3" aria-live="polite">
      <div className="flex items-center gap-2">
        <p className="text-[13px] font-semibold">Supporting note text</p>
        <Pin n={2} />
        <span className="ml-auto font-mono text-[12px] text-ui-muted">{candidate.code}</span>
      </div>
      <blockquote className="rounded bg-ui-sub px-3 py-2.5 text-[13px] leading-relaxed">
        <p className="mb-1 text-[11px] text-ui-muted">Progress note, synthetic</p>
        {candidate.note.before}
        <mark className={`rounded-sm px-0.5 ${isFlagged ? "bg-warn-soft text-warn" : "bg-accent-soft text-ink"}`}>
          {candidate.note.evidence}
        </mark>
        {candidate.note.after}
      </blockquote>
      {isFlagged && (
        <p className="rounded border border-warn-soft bg-warn-soft/50 px-2.5 py-2 text-[12px]">
          The condition is mentioned only to rule it out. Flagged for a reviewer instead of suggested as a code.
        </p>
      )}
      <div className="mt-auto flex flex-wrap items-center gap-2" aria-hidden="true">
        <span className="rounded bg-accent px-3 py-1.5 text-[12px] font-medium text-white">Accept</span>
        <span className="rounded border border-ui-line px-3 py-1.5 text-[12px] font-medium">Reject</span>
        <span className="rounded border border-ui-line px-3 py-1.5 text-[12px] font-medium">Ask for clarification</span>
        <Pin n={4} />
      </div>
    </div>
  );
}

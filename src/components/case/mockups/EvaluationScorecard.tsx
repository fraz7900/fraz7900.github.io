import { Chip, MockFrame, PanelTitle } from "../mockup-kit";

const TEST_SET = [
  { slice: "Typical documentation", purpose: "Baseline task performance" },
  { slice: "Negated mentions", purpose: "“No history of heart failure”" },
  { slice: "Historical conditions", purpose: "Resolved vs. currently managed" },
  { slice: "Conflicting notes", purpose: "Two notes that disagree" },
  { slice: "Documentation styles", purpose: "Templates vs. free text, by facility" },
];

const CRITERIA: readonly { criterion: string; guards: string; status: "ok" | "warn" }[] = [
  { criterion: "Precision per condition group", guards: "Unsupported suggestions", status: "ok" },
  { criterion: "Recall per condition group", guards: "Missed documented conditions", status: "ok" },
  { criterion: "Negation handled", guards: "Denied conditions surfacing", status: "warn" },
  { criterion: "Active vs. historical", guards: "Resolved conditions surfacing", status: "ok" },
  { criterion: "Evidence shown", guards: "Candidates reviewers can’t verify", status: "ok" },
];

export function EvaluationScorecard() {
  return (
    <MockFrame title="Clinical NLP evaluation" context="Cohort B release check">
      <div className="grid gap-4 md:grid-cols-[1fr_1.35fr]">
        <div>
          <PanelTitle pin={1}>Test set composition</PanelTitle>
          <ul className="flex flex-col divide-y divide-ui-line rounded border border-ui-line">
            {TEST_SET.map((item) => (
              <li key={item.slice} className="px-2.5 py-2">
                <p className="font-medium">{item.slice}</p>
                <p className="text-[12px] text-ui-muted">{item.purpose}</p>
              </li>
            ))}
          </ul>
        </div>
        <div className="flex flex-col gap-3">
          <div>
            <PanelTitle pin={2}>Acceptance criteria</PanelTitle>
            <ul className="flex flex-col divide-y divide-ui-line rounded border border-ui-line">
              {CRITERIA.map((item) => (
                <li key={item.criterion} className="flex items-start justify-between gap-3 px-2.5 py-2">
                  <div className="min-w-0">
                    <p className="font-medium">{item.criterion}</p>
                    <p className="text-[12px] text-ui-muted">Guards against: {item.guards}</p>
                  </div>
                  <Chip tone={item.status}>{item.status === "ok" ? "Met" : "Re-test"}</Chip>
                </li>
              ))}
            </ul>
          </div>
          <div className="rounded border border-warn-soft bg-warn-soft/60 p-2.5">
            <PanelTitle pin={3}>Release decision: hold Cohort B</PanelTitle>
            <p className="text-[12px]">
              One criterion needs a re-test on this cohort’s notes before go-live. Thresholds are set per condition
              group and aren’t shown here.
            </p>
          </div>
        </div>
      </div>
    </MockFrame>
  );
}

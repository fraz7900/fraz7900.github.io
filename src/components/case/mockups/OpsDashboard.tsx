import { Chip, MockFrame, Pin } from "../mockup-kit";

type Tone = "ok" | "warn" | "neutral";

interface Panel {
  readonly name: string;
  readonly definition: string;
  readonly owner: string;
  readonly cohorts: readonly { readonly name: string; readonly tone: Tone; readonly label: string }[];
}

const PANELS: readonly Panel[] = [
  {
    name: "Clinical quality",
    definition: "Quality measures tracked for the cohort’s patients, per the shared definition",
    owner: "Clinical",
    cohorts: [
      { name: "A", tone: "ok", label: "On track" },
      { name: "B", tone: "warn", label: "Watch" },
      { name: "C", tone: "neutral", label: "Not live" },
    ],
  },
  {
    name: "System reliability",
    definition: "Uptime and response time against the release targets",
    owner: "Data Engineering",
    cohorts: [
      { name: "A", tone: "ok", label: "On track" },
      { name: "B", tone: "ok", label: "On track" },
      { name: "C", tone: "neutral", label: "Not live" },
    ],
  },
  {
    name: "Workflow adoption",
    definition: "Active users and reviewed candidates, per the shared definitions",
    owner: "Statistics",
    cohorts: [
      { name: "A", tone: "ok", label: "On track" },
      { name: "B", tone: "warn", label: "Watch" },
      { name: "C", tone: "neutral", label: "Not live" },
    ],
  },
];

export function OpsDashboard() {
  return (
    <MockFrame title="Operations dashboard" context="R / RStudio Workbench">
      <div className="flex flex-col gap-3">
        <div className="flex flex-wrap items-center gap-2 text-[12px]">
          <span className="text-ui-muted">View by</span>
          <span className="rounded border border-ink px-2 py-0.5 font-medium">Cohort</span>
          <span className="rounded border border-ui-line px-2 py-0.5 text-ui-muted">Facility</span>
          <Pin n={3} />
        </div>
        <div className="grid gap-3 md:grid-cols-3">
          {PANELS.map((panel, index) => (
            <div key={panel.name} className="flex flex-col gap-2.5 rounded border border-ui-line p-3">
              <div className="flex items-center gap-2">
                <p className="text-[13px] font-semibold">{panel.name}</p>
                {index === 0 && <Pin n={1} />}
              </div>
              <ul className="flex flex-col gap-1.5">
                {panel.cohorts.map((cohort) => (
                  <li key={cohort.name} className="flex items-center justify-between gap-2">
                    <span>Cohort {cohort.name}</span>
                    <Chip tone={cohort.tone}>{cohort.label}</Chip>
                  </li>
                ))}
              </ul>
              <div className="mt-auto border-t border-ui-line pt-2 text-[12px] text-ui-muted">
                <div className="flex items-start gap-2">
                  <p className="flex-1">{panel.definition}</p>
                  {index === 1 && <Pin n={2} />}
                </div>
                <p className="mt-1 text-ink">Owner: {panel.owner}</p>
              </div>
            </div>
          ))}
        </div>
        <p className="text-[11px] text-ui-muted">
          Layout only. The original dashboard isn’t reproduced, and no measurements are shown.
        </p>
      </div>
    </MockFrame>
  );
}

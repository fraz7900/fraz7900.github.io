import { Chip, MockFrame, PanelTitle, Pin } from "../mockup-kit";

type Status = "done" | "active" | "blocked" | "todo";

const MILESTONES = ["Feeds live", "Definitions signed off", "Data quality checks", "NLP evaluation", "Go-live"];

const COHORTS: readonly { name: string; statuses: readonly Status[] }[] = [
  { name: "Cohort A", statuses: ["done", "done", "done", "done", "done"] },
  { name: "Cohort B", statuses: ["done", "done", "done", "active", "todo"] },
  { name: "Cohort C", statuses: ["done", "blocked", "todo", "todo", "todo"] },
];

const STATUS_CHIP: Record<Status, { tone: "ok" | "warn" | "stop" | "neutral"; label: string }> = {
  done: { tone: "ok", label: "Done" },
  active: { tone: "warn", label: "In progress" },
  blocked: { tone: "stop", label: "Blocked" },
  todo: { tone: "neutral", label: "Not started" },
};

const DEFINITIONS = [
  { metric: "Cohort go-live", definition: "Every milestone done and the NLP release check passed", owner: "Statistics" },
  { metric: "Feed freshness", definition: "Hours since the last successful load per source", owner: "Data Engineering" },
  { metric: "Reviewed candidate", definition: "Candidate with an accept, reject or clarify decision", owner: "Clinical" },
];

export function ReadinessTracker() {
  return (
    <MockFrame title="Rollout readiness" context="Facility cohorts">
      <div className="flex flex-col gap-4">
        <div>
          <div className="flex items-baseline justify-between gap-2">
            <PanelTitle pin={1}>Milestones by cohort</PanelTitle>
            <span className="text-[11px] text-ui-muted md:hidden">Scroll sideways for all</span>
          </div>
          <div
            tabIndex={0}
            role="region"
            aria-label="Milestones by cohort (scrolls sideways)"
            className="overflow-x-auto rounded border border-ui-line"
          >
            <table className="w-full min-w-[520px] border-collapse text-left">
              <thead className="bg-ui-sub text-[11px] text-ui-muted">
                <tr>
                  <th scope="col" className="px-2.5 py-2 font-medium">Cohort</th>
                  {MILESTONES.map((milestone) => (
                    <th key={milestone} scope="col" className="px-2 py-2 font-medium">{milestone}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {COHORTS.map((cohort) => (
                  <tr key={cohort.name} className="border-t border-ui-line">
                    <th scope="row" className="px-2.5 py-2 font-medium">{cohort.name}</th>
                    {cohort.statuses.map((status, index) => (
                      <td key={MILESTONES[index]} className="px-2 py-2">
                        <Chip tone={STATUS_CHIP[status].tone}>{STATUS_CHIP[status].label}</Chip>
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="mt-2 flex items-start gap-2 rounded border border-stop-soft bg-stop-soft/50 px-2.5 py-2 text-[12px]">
            <Pin n={2} />
            <p>
              <span className="font-semibold">Cohort C blocked:</span> “active patient” counted differently in two
              source systems. Owner: Data Engineering with Clinical.
            </p>
          </div>
        </div>
        <div>
          <PanelTitle pin={3}>Shared definitions</PanelTitle>
          <dl className="grid gap-2 sm:grid-cols-3">
            {DEFINITIONS.map((item) => (
              <div key={item.metric} className="rounded border border-ui-line p-2.5">
                <dt className="font-semibold">{item.metric}</dt>
                <dd className="mt-1 text-[12px] text-ui-muted">{item.definition}</dd>
                <dd className="mt-1.5 text-[11px]">Owner: {item.owner}</dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </MockFrame>
  );
}

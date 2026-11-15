import { MockFrame, Pin } from "../mockup-kit";

const SOURCES = ["EHR system A", "EHR system B", "EHR system C", "Claims feed", "Disease registry"];
const MODULES = ["Risk adjustment (HCC)", "Chronic care management", "Population analytics"];

function Connector() {
  return (
    <div aria-hidden="true" className="flex items-center justify-center text-ui-muted md:px-1">
      <span className="md:hidden">↓</span>
      <span className="hidden md:inline">→</span>
    </div>
  );
}

function Column({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex min-w-0 flex-col gap-2">
      <p className="text-[11px] font-medium text-ui-muted">{label}</p>
      {children}
    </div>
  );
}

export function IntegrationFlow() {
  return (
    <MockFrame title="Facility onboarding" context="Data connections">
      <div className="grid grid-cols-1 gap-2 md:grid-cols-[1fr_auto_1fr_auto_1fr_auto_1fr] md:items-center">
        <Column label="Source systems">
          <ul className="flex flex-col gap-1.5">
            {SOURCES.map((source) => (
              <li key={source} className="rounded border border-ui-line bg-ui-sub px-2.5 py-1.5">
                {source}
              </li>
            ))}
          </ul>
        </Column>
        <Connector />
        <Column label="Interoperability">
          <div className="flex flex-col gap-2 rounded-md border-2 border-accent bg-accent-soft p-3">
            <div className="flex items-center justify-between gap-2">
              <span className="font-semibold text-ink">API layer</span>
              <Pin n={1} />
            </div>
            <p className="text-[12px] text-ui-muted">One connection pattern per source type, reused for every facility</p>
          </div>
        </Column>
        <Connector />
        <Column label="CareTrak">
          <div className="flex flex-col gap-2 rounded-md border border-ink/70 bg-ui p-3">
            <div className="flex items-center justify-between gap-2">
              <span className="font-semibold text-ink">Patient data model</span>
              <Pin n={2} />
            </div>
            <ul className="flex flex-col gap-1 text-[12px] text-ui-muted">
              <li>Encounters and notes</li>
              <li>Claims history</li>
              <li>Registry membership</li>
            </ul>
          </div>
        </Column>
        <Connector />
        <Column label="Modules">
          <ul className="flex flex-col gap-1.5">
            {MODULES.map((module, index) => (
              <li key={module} className="flex items-center justify-between gap-2 rounded border border-ui-line px-2.5 py-1.5">
                <span>{module}</span>
                {index === 0 && <Pin n={3} />}
              </li>
            ))}
          </ul>
        </Column>
      </div>
    </MockFrame>
  );
}

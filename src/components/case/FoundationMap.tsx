import { FOUNDATION } from "@/content/caretrak";

/** Capability-reuse map: data → shared CareTrak foundation → later experiences. Not system architecture. */
export function FoundationMap() {
  const { data, foundation, experiences } = FOUNDATION.layers;

  return (
    <div className="flex flex-col gap-2 rounded-lg border border-line bg-card p-4 sm:p-6">
      <Layer label="Later experiences">
        <ul className="grid gap-2 sm:grid-cols-3">
          {experiences.map((item) => (
            <li key={item.name} className="rounded-md border border-dashed border-ink/35 px-3 py-2.5">
              <p className="font-medium text-ink">{item.name}</p>
              <p className="text-sm text-muted">{item.task}</p>
            </li>
          ))}
        </ul>
      </Layer>
      <Arrow label="supported by" />
      <Layer label="CareTrak foundation, 2019–2021">
        <ul className="grid gap-2 rounded-md bg-ink p-2.5 sm:grid-cols-5">
          {foundation.map((item) => (
            <li key={item} className="rounded bg-paper/10 px-3 py-2.5 text-sm font-medium text-paper">
              {item}
            </li>
          ))}
        </ul>
      </Layer>
      <Arrow label="built on" />
      <Layer label="Population health data">
        <ul className="grid gap-2 sm:grid-cols-3">
          {data.map((item) => (
            <li key={item} className="rounded-md bg-accent-soft px-3 py-2.5 text-sm text-ink">
              {item}
            </li>
          ))}
        </ul>
      </Layer>
    </div>
  );
}

function Layer({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="grid gap-2 sm:grid-cols-[9.5rem_1fr] sm:items-center sm:gap-4">
      <p className="text-sm font-medium text-muted">{label}</p>
      {children}
    </div>
  );
}

function Arrow({ label }: { label: string }) {
  return (
    <div aria-hidden="true" className="grid sm:grid-cols-[9.5rem_1fr] sm:gap-4">
      <span />
      <span className="flex items-center justify-center gap-2 text-xs text-muted">
        <span className="text-accent">↑</span> {label}
      </span>
    </div>
  );
}

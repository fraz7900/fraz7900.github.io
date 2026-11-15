import { Pin } from "../mockup-kit";

/** Frame for an analytical exhibit: a titled glass panel with its source line. */
export function Exhibit({ title, source, children }: { title: string; source: string; children: React.ReactNode }) {
  return (
    <div className="glass overflow-hidden rounded-xl">
      <div className="flex items-center justify-between gap-3 border-b border-line px-4 py-2.5">
        <p className="text-sm font-semibold text-ink">{title}</p>
        <span className="shrink-0 font-mono text-[0.65rem] text-faint">exhibit</span>
      </div>
      <div className="p-4 sm:p-5">{children}</div>
      <p className="border-t border-line px-4 py-2 text-[0.7rem] text-faint">Source: {source}</p>
    </div>
  );
}

export type BarKind = "reported" | "projected" | "derived";

export interface BarRow {
  readonly label: string;
  readonly value: number;
  readonly display: string;
  readonly kind: BarKind;
  readonly note?: string;
  readonly pin?: number;
}

const KIND_LABEL: Record<BarKind, string> = { reported: "Reported", projected: "Projected", derived: "Derived" };

/**
 * One-hue horizontal bar comparison. Projected and derived values are hatched so the
 * distinction never relies on colour alone, and each bar carries a direct value label.
 */
export function BarCompare({ rows, unit }: { rows: readonly BarRow[]; unit: string }) {
  const max = Math.max(...rows.map((r) => r.value));

  return (
    <div className="flex flex-col gap-5">
      <ul className="flex flex-col gap-5">
        {rows.map((row) => {
          const width = `${Math.max((row.value / max) * 100, 1.5)}%`;
          const hatched = row.kind !== "reported";
          return (
            <li key={row.label} className="flex flex-col gap-1.5">
              <div className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1">
                <span className="flex items-center gap-2 text-sm text-ink">
                  {row.pin !== undefined && <Pin n={row.pin} />}
                  {row.label}
                </span>
                <span className="font-mono text-sm font-semibold text-ink">{row.display}</span>
              </div>
              <div className="h-5 w-full rounded-r bg-line/50" title={`${row.label}: ${row.display} (${KIND_LABEL[row.kind].toLowerCase()})`}>
                <div
                  className={`h-full rounded-r ${hatched ? "border border-sky" : "bg-sky"}`}
                  style={{
                    width,
                    backgroundImage: hatched
                      ? "repeating-linear-gradient(135deg, var(--color-sky) 0 2px, transparent 2px 7px)"
                      : undefined,
                  }}
                />
              </div>
              {row.note && <span className="text-xs text-muted">{row.note}</span>}
            </li>
          );
        })}
      </ul>
      <p className="flex flex-wrap gap-x-5 gap-y-1 text-xs text-muted">
        <span className="flex items-center gap-2">
          <span aria-hidden="true" className="inline-block h-3 w-5 rounded-sm bg-sky" /> Reported
        </span>
        <span className="flex items-center gap-2">
          <span
            aria-hidden="true"
            className="inline-block h-3 w-5 rounded-sm border border-sky"
            style={{ backgroundImage: "repeating-linear-gradient(135deg, var(--color-sky) 0 2px, transparent 2px 7px)" }}
          />
          Projected or derived
        </span>
        <span>Unit: {unit}</span>
      </p>
    </div>
  );
}

export function StatTiles({ items }: { items: readonly { value: string; label: string; pin?: number }[] }) {
  return (
    <dl className="grid gap-3 sm:grid-cols-3">
      {items.map((item) => (
        <div key={item.label} className="flex flex-col-reverse gap-1 rounded-lg border border-line bg-paper/50 p-4">
          <dt className="text-sm leading-snug text-muted">{item.label}</dt>
          <dd className="flex items-center gap-2 font-display text-3xl font-semibold text-ink">
            {item.value}
            {item.pin !== undefined && <Pin n={item.pin} />}
          </dd>
        </div>
      ))}
    </dl>
  );
}

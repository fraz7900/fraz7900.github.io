/** Shared building blocks for the case-study product mockups (original, synthetic content). */

export function MockFrame({
  title,
  context,
  children,
}: {
  title: string;
  context?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="overflow-hidden rounded-lg border border-ui-line bg-ui text-[13px] leading-snug text-ink shadow-[0_18px_40px_-24px_rgb(21_35_59/0.45)]">
      <div className="flex items-center justify-between gap-3 border-b border-ui-line bg-ink px-4 py-2.5 text-paper">
        <div className="flex min-w-0 items-center gap-2">
          <span aria-hidden="true" className="flex gap-1">
            <span className="size-2 rounded-full bg-paper/30" />
            <span className="size-2 rounded-full bg-paper/30" />
            <span className="size-2 rounded-full bg-paper/30" />
          </span>
          <span className="truncate font-medium">{title}</span>
          {context && <span className="hidden truncate text-paper/70 sm:inline">{context}</span>}
        </div>
        <span className="shrink-0 rounded-sm bg-paper/12 px-1.5 py-0.5 text-[11px] text-paper/85">
          <span className="sm:hidden">Synthetic</span>
          <span className="hidden sm:inline">Illustrative, synthetic data</span>
        </span>
      </div>
      <div className="p-3 sm:p-4">{children}</div>
    </div>
  );
}

/** Numbered marker that ties a spot in a mockup to the matching note in the text. */
export function Pin({ n }: { n: number }) {
  return (
    <span
      aria-hidden="true"
      className="inline-flex size-5 shrink-0 items-center justify-center rounded-full bg-accent text-[11px] font-semibold text-white ring-2 ring-white"
    >
      {n}
    </span>
  );
}

type Tone = "ok" | "warn" | "stop" | "neutral";

const TONE_CLASS: Record<Tone, string> = {
  ok: "bg-accent-soft text-accent",
  warn: "bg-warn-soft text-warn",
  stop: "bg-stop-soft text-danger",
  neutral: "bg-ui-sub text-ui-muted",
};

export function Chip({ tone, children }: { tone: Tone; children: React.ReactNode }) {
  return (
    <span className={`inline-flex items-center rounded px-1.5 py-0.5 text-[11px] font-medium whitespace-nowrap ${TONE_CLASS[tone]}`}>
      {children}
    </span>
  );
}

export function PanelTitle({ children, pin }: { children: React.ReactNode; pin?: number }) {
  return (
    <div className="mb-2 flex items-center gap-2">
      <p className="text-[13px] font-semibold text-ink">{children}</p>
      {pin !== undefined && <Pin n={pin} />}
    </div>
  );
}

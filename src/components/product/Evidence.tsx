import Link from "next/link";
import type { CaseItem, Pending } from "@/content/ehr";
import { SOURCE_NOTE, type Evidence, type EvidenceSource } from "@/content/product";

/** Source labels shared by the Product Management tab and the product case studies. */

const SOURCE_STYLE: Record<EvidenceSource, string> = {
  CV: "border-accent/60 text-accent",
  "Case study": "border-sky/60 text-sky",
  "Reported metric": "border-amber/60 text-amber",
  Retrospective: "border-line-strong text-muted",
  "Live tool": "border-accent/60 text-accent",
  Coursework: "border-sky/60 text-sky",
  "My account": "border-line-strong text-ink/80",
  "Public record": "border-sky/60 text-sky",
};

export function SourceTag({ source }: { source: EvidenceSource }) {
  return (
    <span title={SOURCE_NOTE[source]} className={`w-max shrink-0 rounded border px-1.5 py-0.5 text-center font-mono text-[0.65rem] sm:w-24 ${SOURCE_STYLE[source]}`}>
      {source}
      <span className="sr-only">: {SOURCE_NOTE[source]}</span>
    </span>
  );
}

export function EvidenceRow({ item }: { item: Evidence }) {
  return (
    <li className="flex flex-col gap-1.5 border-b border-line py-3.5 last:border-0 sm:flex-row sm:items-start sm:gap-4">
      <SourceTag source={item.source} />
      <div className="min-w-0 flex-1">
        <p className="font-medium text-ink">{item.claim}</p>
        <p className="mt-0.5 text-sm leading-relaxed text-muted">{item.detail}</p>
      </div>
      {item.href &&
        (item.href.startsWith("https://") ? (
          <a href={item.href} rel="noreferrer" className="shrink-0 font-mono text-xs text-accent hover:underline">
            read the source<span className="sr-only"> for “{item.claim}” (external site)</span>
          </a>
        ) : (
          <Link href={item.href} className="shrink-0 font-mono text-xs text-accent hover:underline">
            see it
          </Link>
        ))}
    </li>
  );
}

/**
 * Copy that is waiting for Fraz's confirmation. Visible on purpose in local previews; the
 * data-to-confirm marker makes `npm run check:publish` fail, so it can never be deployed.
 */
export function PendingNote({ item, compact = false }: { item: Pending; compact?: boolean }) {
  return (
    <div data-to-confirm={`ehr-${item.id}`} className="rounded-lg border border-dashed border-amber/60 px-4 py-3">
      <p className="font-mono text-xs text-amber">to confirm · {item.label.toLowerCase()}</p>
      {!compact && <p className="mt-1 text-sm leading-relaxed text-ink/85">{item.question}</p>}
    </div>
  );
}

/** A list of confirmed facts and pending notes, in order. */
export function CaseItems({ items }: { items: readonly CaseItem[] }) {
  return (
    <ul className="flex flex-col">
      {items.map((item) =>
        item.kind === "fact" ? (
          <EvidenceRow
            key={item.label}
            item={{ claim: item.label, detail: item.text, source: item.source, ...(item.href ? { href: item.href } : {}) }}
          />
        ) : (
          <li key={item.id} className="border-b border-line py-3.5 last:border-0">
            <PendingNote item={item} />
          </li>
        ),
      )}
    </ul>
  );
}

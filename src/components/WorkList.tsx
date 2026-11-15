import Link from "next/link";
import { STATUS_LABEL, type WorkItem } from "@/content/work";

/** Cards for the items in a work track. Items without a page are shown as summaries. */
export function WorkList({ items }: { items: readonly WorkItem[] }) {
  return (
    <ol className="flex flex-col gap-4">
      {items.map((item, index) => (
        <li key={item.title}>
          <article
            className={`glass group relative grid grid-cols-[minmax(0,1fr)] gap-4 rounded-xl p-5 transition-colors sm:p-6 md:grid-cols-[3rem_minmax(0,1fr)] ${
              item.href ? "hover:border-accent/60" : ""
            }`}
          >
            <span aria-hidden="true" className="font-mono text-sm text-faint">
              {String(index + 1).padStart(2, "0")}
            </span>
            <div className="flex min-w-0 flex-col gap-2">
              <p className="flex flex-wrap items-center gap-x-3 gap-y-1 font-mono text-xs">
                <span className="rounded border border-line-strong px-1.5 py-0.5 text-accent">{STATUS_LABEL[item.status]}</span>
                <span className="text-muted">
                  {item.context}
                  {item.years ? ` · ${item.years}` : ""}
                </span>
              </p>
              <h3 className="font-display text-xl font-semibold text-ink sm:text-2xl">
                {item.href ? (
                  <Link href={item.href} className="after:absolute after:inset-0 after:content-['']">
                    {item.title}
                  </Link>
                ) : (
                  item.title
                )}
              </h3>
              <p className="leading-relaxed text-ink/85">{item.summary}</p>
              {item.href && (
                <p aria-hidden="true" className="font-mono text-xs text-accent group-hover:underline">
                  open
                </p>
              )}
            </div>
          </article>
        </li>
      ))}
    </ol>
  );
}

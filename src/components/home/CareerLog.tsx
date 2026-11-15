import Link from "next/link";
import { LOG } from "@/content/log";

export function CareerLog() {
  return (
    <ol className="relative flex flex-col gap-6 border-l border-line-strong pl-6">
      {LOG.map((entry) => (
        <li
          key={`${entry.date}-${entry.text}`}
          data-to-confirm={entry.toConfirm ? "log-entry" : undefined}
          className="relative grid gap-1 sm:grid-cols-[6.5rem_1fr] sm:gap-6"
        >
          <span
            aria-hidden="true"
            className={`absolute -left-[1.85rem] top-1.5 size-2.5 rounded-full ring-4 ring-paper ${entry.toConfirm ? "bg-amber" : "bg-accent"}`}
          />
          <span className={`font-mono text-xs ${entry.toConfirm ? "text-amber" : "text-accent"}`}>{entry.date}</span>
          <p className={`leading-relaxed ${entry.toConfirm ? "text-amber/90" : "text-ink/90"}`}>
            <span className="font-semibold text-ink">{entry.kind}.</span> {entry.text}{" "}
            {entry.href && (
              <Link href={entry.href} className="link-accent">
                {entry.linkText}
              </Link>
            )}
            {entry.toConfirm && (
              <span className="ml-1 rounded border border-dashed border-amber/60 px-1.5 py-0.5 font-mono text-[0.65rem] text-amber">
                to confirm
              </span>
            )}
          </p>
        </li>
      ))}
    </ol>
  );
}

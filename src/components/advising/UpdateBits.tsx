"use client";

import type { Update } from "@/content/advising/updates";
import { buildDeadlineIcs } from "@/lib/advising/ics";
import { STATUS_LABEL, canAddToCalendar, effectiveStatus, isStale } from "@/lib/advising/updateStatus";
import { downloadFile, useNow } from "./ClientUtils";

const STATUS_STYLE: Record<string, string> = {
  open: "border-accent/70 text-accent",
  upcoming: "border-sky/70 text-sky",
  rolling: "border-sky/70 text-sky",
  closed: "border-line-strong text-muted",
  unverified: "border-amber/70 text-amber",
};

/** Status chip computed at build time, then re-evaluated against the visitor's clock after hydration. */
export function StatusBadge({ update, buildTimeMs }: { update: Update; buildTimeMs: number }) {
  const now = useNow(buildTimeMs);
  const status = effectiveStatus(update, now);
  if (status === "none") return null;
  return (
    <span className={`inline-flex items-center rounded-full border px-2.5 py-0.5 font-mono text-[0.7rem] ${STATUS_STYLE[status]}`}>
      {STATUS_LABEL[status]}
    </span>
  );
}

export function StaleNotice({ update, buildTimeMs }: { update: Update; buildTimeMs: number }) {
  const now = useNow(buildTimeMs);
  if (!isStale(update, now)) return null;
  return (
    <p className="text-xs text-amber">
      {update.lastChecked === null
        ? "Not checked against the official source. Use the source link for current information."
        : "Last checked more than 60 days ago. Confirm on the official source."}
    </p>
  );
}

export function AddToCalendar({ update, buildTimeMs }: { update: Update; buildTimeMs: number }) {
  const now = useNow(buildTimeMs);
  if (!canAddToCalendar(update, now)) return null;
  return (
    <button
      type="button"
      className="btn-ghost text-sm"
      onClick={() => downloadFile(`${update.slug}-deadline.ics`, buildDeadlineIcs(update, Date.now()), "text/calendar;charset=utf-8")}
    >
      Add deadline to calendar (.ics)
    </button>
  );
}

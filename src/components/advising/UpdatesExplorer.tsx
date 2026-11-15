"use client";

import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useId, useState } from "react";
import { UPDATE_TYPE_LABEL, type Update, type UpdateType } from "@/content/advising/updates";
import { EMPTY_QUERY, browseUpdates, formatKeyDate, parseQuery, queryToParams, type UpdateQuery } from "@/lib/advising/updateStatus";
import { useNow } from "./ClientUtils";
import { StaleNotice, StatusBadge } from "./UpdateBits";

const STATUS_OPTIONS = [
  ["", "Any status"],
  ["open", "Open"],
  ["upcoming", "Upcoming"],
  ["rolling", "Rolling"],
  ["closed", "Closed"],
  ["unverified", "Not verified"],
] as const;

/** Search, filter and sort updates; the state lives in shareable URL query parameters. */
export function UpdatesExplorer({ updates, buildTimeMs }: { updates: readonly Update[]; buildTimeMs: number }) {
  const router = useRouter();
  const pathname = usePathname();
  const params = useSearchParams();
  const now = useNow(buildTimeMs);
  const id = useId();
  // Local state is the source of truth; the URL mirrors it. Reading the URL on every change
  // would race with Next's asynchronous router.replace and drop rapid successive edits.
  const [query, setQuery] = useState<UpdateQuery>(() => parseQuery(new URLSearchParams(params.toString())));
  useEffect(() => {
    const target = queryToParams(query);
    if (target !== queryToParams(parseQuery(new URLSearchParams(window.location.search)))) {
      router.replace(`${pathname}${target}`, { scroll: false });
    }
  }, [query, pathname, router]);
  const results = browseUpdates(updates, query, now);
  const types = [...new Set(updates.map((u) => u.type))];
  const levels = [...new Set(updates.flatMap((u) => u.degreeLevels))];
  const isFiltered = queryToParams(query) !== "";

  const set = (patch: Partial<UpdateQuery>) => setQuery((current) => ({ ...current, ...patch }));

  return (
    <div className="flex flex-col gap-6">
      <form role="search" onSubmit={(event) => event.preventDefault()} className="glass grid gap-4 rounded-xl p-4 sm:grid-cols-2 lg:grid-cols-[2fr_1fr_1fr_1fr_1fr] lg:items-end">
        <label htmlFor={`${id}-q`} className="flex flex-col gap-1.5 text-xs font-medium text-muted">
          Search
          <input
            id={`${id}-q`}
            type="search"
            value={query.q}
            onChange={(event) => set({ q: event.target.value })}
            placeholder="Programme, country or keyword"
            className="rounded-md border border-line-strong bg-card px-3 py-2 text-sm text-ink placeholder:text-faint"
          />
        </label>
        <Select label="Type" id={`${id}-type`} value={query.type} onChange={(type) => set({ type: type as UpdateType | "" })}
          options={[["", "Any type"], ...types.map((t) => [t, UPDATE_TYPE_LABEL[t]] as const)]} />
        <Select label="Status" id={`${id}-status`} value={query.status} onChange={(status) => set({ status: status as UpdateQuery["status"] })} options={STATUS_OPTIONS} />
        <Select label="Degree level" id={`${id}-level`} value={query.level} onChange={(level) => set({ level })}
          options={[["", "Any level"], ...levels.map((l) => [l, l] as const)]} />
        <Select label="Sort by" id={`${id}-sort`} value={query.sort} onChange={(sort) => set({ sort: sort === "deadline" ? "deadline" : "recent" })}
          options={[["recent", "Recently updated"], ["deadline", "Verified deadline"]]} />
      </form>

      <div className="flex flex-wrap items-center justify-between gap-3 text-sm">
        <p role="status" className="text-muted">
          {results.length} of {updates.length} update{updates.length === 1 ? "" : "s"}
        </p>
        {isFiltered && (
          <button type="button" onClick={() => setQuery(EMPTY_QUERY)} className="link-accent">
            Clear search and filters
          </button>
        )}
      </div>

      {results.length === 0 ? (
        <div className="glass rounded-xl p-6 text-center">
          <p className="font-medium text-ink">No updates match these filters.</p>
          <p className="mt-1 text-sm text-muted">Try a broader search, or clear the filters to see everything.</p>
        </div>
      ) : (
        <ul className="flex flex-col gap-4">
          {results.map((update) => (
            <li key={update.slug} className="glass relative flex flex-col gap-3 rounded-xl p-5 transition-colors hover:border-accent/60">
              <div className="flex flex-wrap items-center gap-2">
                <span className="font-mono text-xs text-accent">{UPDATE_TYPE_LABEL[update.type]}</span>
                <StatusBadge update={update} buildTimeMs={buildTimeMs} />
              </div>
              <h3 className="font-display text-xl font-semibold text-ink">
                <Link href={`/advising/updates/${update.slug}/`} className="after:absolute after:inset-0 after:content-['']">
                  {update.title}
                </Link>
              </h3>
              <p className="text-sm leading-relaxed text-muted">{update.summary}</p>
              <dl className="flex flex-wrap gap-x-5 gap-y-1 text-xs text-faint">
                <div><dt className="sr-only">Destination</dt><dd>{update.destination}</dd></div>
                <div><dt className="sr-only">Applicants</dt><dd>{update.applicantScope}</dd></div>
                {update.deadline && (
                  <div><dt className="inline">Deadline: </dt><dd className="inline text-ink/80">{formatKeyDate(update.deadline)}</dd></div>
                )}
                <div><dt className="inline">Checked: </dt><dd className="inline">{update.lastChecked ?? "not checked"}</dd></div>
              </dl>
              <StaleNotice update={update} buildTimeMs={buildTimeMs} />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

function Select({ label, id, value, onChange, options }: {
  label: string; id: string; value: string; onChange: (value: string) => void; options: readonly (readonly [string, string])[];
}) {
  return (
    <label htmlFor={id} className="flex flex-col gap-1.5 text-xs font-medium text-muted">
      {label}
      <select id={id} value={value} onChange={(event) => onChange(event.target.value)}
        className="rounded-md border border-line-strong bg-card px-3 py-2 text-sm text-ink">
        {options.map(([optionValue, optionLabel]) => (
          <option key={optionValue} value={optionValue}>{optionLabel}</option>
        ))}
      </select>
    </label>
  );
}

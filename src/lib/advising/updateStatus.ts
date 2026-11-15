import type { DeclaredStatus, KeyDate, Update, UpdateType } from "@/content/advising/updates";

export type EffectiveStatus = DeclaredStatus | "none";

const HOUR_MS = 3_600_000;
/** A date-only deadline is over everywhere once it has ended in UTC−12 (12:00 UTC the next day). */
const LATEST_TIMEZONE_OFFSET_MS = 12 * HOUR_MS;
const DAY_MS = 24 * HOUR_MS;
export const STALE_AFTER_DAYS = 60;

/** Milliseconds after which the key date has passed everywhere. No timezone is assumed for date-only values. */
export function keyDatePassesAt(value: KeyDate): number {
  if (value.kind === "instant") return Date.parse(value.instant);
  const [y, m, d] = value.date.split("-").map(Number);
  return Date.UTC(y, m - 1, d) + DAY_MS + LATEST_TIMEZONE_OFFSET_MS;
}

export function isPast(value: KeyDate, nowMs: number): boolean {
  return nowMs >= keyDatePassesAt(value);
}

/**
 * Status shown to visitors. Never upgrades an item to "open" by inference:
 * - unchecked items are "unverified";
 * - open/upcoming/rolling items whose verified deadline has passed become "closed";
 * - "upcoming" items whose opening date has passed become "unverified" (check the source).
 */
export function effectiveStatus(update: Update, nowMs: number): EffectiveStatus {
  if (update.declaredStatus === undefined) return "none";
  if (update.lastChecked === null || update.declaredStatus === "unverified") return "unverified";
  if (update.deadline && isPast(update.deadline, nowMs) && update.declaredStatus !== "closed") return "closed";
  if (update.declaredStatus === "upcoming" && update.opens && isPast(update.opens, nowMs)) return "unverified";
  return update.declaredStatus;
}

export function isStale(update: Update, nowMs: number): boolean {
  if (update.lastChecked === null) return true;
  return nowMs - Date.parse(`${update.lastChecked}T00:00:00Z`) > STALE_AFTER_DAYS * DAY_MS;
}

/** An add-to-calendar file is offered only for a source-stated deadline that hasn't passed. */
export function canAddToCalendar(update: Update, nowMs: number): boolean {
  return Boolean(update.deadline && update.lastChecked !== null && !isPast(update.deadline, nowMs));
}

export const STATUS_LABEL: Record<EffectiveStatus, string> = {
  open: "Open",
  upcoming: "Upcoming",
  closed: "Closed",
  rolling: "Rolling",
  unverified: "Not verified: check the official source",
  none: "",
};

export function formatKeyDate(value: KeyDate): string {
  if (value.kind === "date") {
    const [y, m, d] = value.date.split("-").map(Number);
    const date = new Date(Date.UTC(y, m - 1, d)).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric", timeZone: "UTC" });
    return `${date} (date only; no time zone stated)`;
  }
  const date = new Date(value.instant).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric", timeZone: "UTC" });
  return `${date}, ${value.timezoneLabel}`;
}

// ---------- browsing: search, filters, sort, URL state ----------

export type SortKey = "recent" | "deadline";

export interface UpdateQuery {
  readonly q: string;
  readonly type: UpdateType | "";
  readonly status: EffectiveStatus | "";
  readonly level: string;
  readonly sort: SortKey;
}

export const EMPTY_QUERY: UpdateQuery = { q: "", type: "", status: "", level: "", sort: "recent" };

const TYPES = new Set<string>([
  "admissions-announcement",
  "scholarship-opportunity",
  "application-guidance",
  "test-policy",
  "advising-event",
]);
const STATUSES = new Set<string>(["open", "upcoming", "closed", "rolling", "unverified"]);

/** Parse URL search params, ignoring anything unknown so shared links can't break the page. */
export function parseQuery(params: URLSearchParams): UpdateQuery {
  const type = params.get("type") ?? "";
  const status = params.get("status") ?? "";
  const sort = params.get("sort");
  return {
    q: (params.get("q") ?? "").slice(0, 100),
    type: TYPES.has(type) ? (type as UpdateType) : "",
    status: STATUSES.has(status) ? (status as EffectiveStatus) : "",
    level: (params.get("level") ?? "").slice(0, 40),
    sort: sort === "deadline" ? "deadline" : "recent",
  };
}

export function queryToParams(query: UpdateQuery): string {
  const params = new URLSearchParams();
  if (query.q) params.set("q", query.q);
  if (query.type) params.set("type", query.type);
  if (query.status) params.set("status", query.status);
  if (query.level) params.set("level", query.level);
  if (query.sort !== "recent") params.set("sort", query.sort);
  const text = params.toString();
  return text ? `?${text}` : "";
}

const lastTouched = (u: Update) => [u.publishedOn, u.lastChecked ?? ""].sort().at(-1) ?? u.publishedOn;

export function browseUpdates(updates: readonly Update[], query: UpdateQuery, nowMs: number): Update[] {
  const needle = query.q.trim().toLowerCase();
  const matches = updates.filter((u) => {
    if (query.type && u.type !== query.type) return false;
    if (query.status && effectiveStatus(u, nowMs) !== query.status) return false;
    if (query.level && !u.degreeLevels.includes(query.level)) return false;
    if (!needle) return true;
    return [u.title, u.summary, u.programme, u.destination, u.applicantScope].join(" ").toLowerCase().includes(needle);
  });
  const byRecent = (a: Update, b: Update) => lastTouched(b).localeCompare(lastTouched(a));
  if (query.sort === "recent") return [...matches].sort(byRecent);
  // Deadline sort: upcoming verified deadlines first (soonest), then everything else by recency.
  const upcoming = (u: Update) => (u.deadline && u.lastChecked !== null && !isPast(u.deadline, nowMs) ? keyDatePassesAt(u.deadline) : Infinity);
  return [...matches].sort((a, b) => upcoming(a) - upcoming(b) || byRecent(a, b));
}

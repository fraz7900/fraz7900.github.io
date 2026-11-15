/**
 * Admissions and scholarship updates. Editorial records, not imported announcements.
 *
 * Rules (enforced by validateUpdate):
 * - `sourceUrl` must be an official https source.
 * - `lastChecked` is the date YOU read the official source; null means not checked.
 * - Deadlines/openings only when stated on the source. Date-only deadlines have NO timezone;
 *   exact times need an ISO instant (with Z or offset) plus the source's timezone label.
 * - Don't confuse the intake year with the application year: name the cycle as the source does.
 */

export type UpdateType =
  | "admissions-announcement"
  | "scholarship-opportunity"
  | "application-guidance"
  | "test-policy"
  | "advising-event";

export const UPDATE_TYPE_LABEL: Record<UpdateType, string> = {
  "admissions-announcement": "Admissions announcement",
  "scholarship-opportunity": "Scholarship opportunity",
  "application-guidance": "Application guidance",
  "test-policy": "Test-policy change",
  "advising-event": "Workshop or event",
};

export type DeclaredStatus = "open" | "upcoming" | "closed" | "rolling" | "unverified";

export type KeyDate =
  | { readonly kind: "date"; readonly date: string; readonly label: string }
  | { readonly kind: "instant"; readonly instant: string; readonly timezoneLabel: string; readonly label: string };

export interface Update {
  readonly slug: string;
  readonly title: string;
  readonly type: UpdateType;
  readonly summary: string;
  readonly body: readonly string[];
  readonly programme: string;
  readonly destination: string;
  readonly applicantScope: string;
  readonly degreeLevels: readonly string[];
  /** As named on the source, e.g. "2027–28 intake" or "cycle with an April 1, 2026 deadline". */
  readonly cycle: string;
  readonly sourceUrl: string;
  readonly sourceLabel: string;
  readonly publishedOn: string;
  readonly lastChecked: string | null;
  readonly opens?: KeyDate;
  readonly deadline?: KeyDate;
  /** Omit for guidance that isn't an opportunity (no status is shown). */
  readonly declaredStatus?: DeclaredStatus;
  readonly state: "draft" | "published";
}

const ISO_DATE = /^\d{4}-\d{2}-\d{2}$/;
const ISO_INSTANT = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}(:\d{2})?(Z|[+-]\d{2}:\d{2})$/;

function validateKeyDate(at: string, name: string, value: KeyDate | undefined): string[] {
  if (!value) return [];
  if (value.kind === "date") return ISO_DATE.test(value.date) ? [] : [`${at}: ${name}.date must be YYYY-MM-DD`];
  const errors: string[] = [];
  if (!ISO_INSTANT.test(value.instant)) errors.push(`${at}: ${name}.instant needs a Z or ±hh:mm offset`);
  if (value.timezoneLabel.trim() === "") errors.push(`${at}: ${name} with an exact time needs the source’s timezone label`);
  return errors;
}

export function validateUpdate(update: Update): string[] {
  const at = `update "${update.slug}"`;
  const errors: string[] = [];
  if (!/^[a-z0-9]+(-[a-z0-9]+)*$/.test(update.slug)) errors.push(`${at}: slug must be kebab-case`);
  if (!update.sourceUrl.startsWith("https://")) errors.push(`${at}: sourceUrl must be an https official source`);
  if (!ISO_DATE.test(update.publishedOn)) errors.push(`${at}: publishedOn must be YYYY-MM-DD`);
  if (update.lastChecked !== null && !ISO_DATE.test(update.lastChecked)) errors.push(`${at}: lastChecked must be YYYY-MM-DD or null`);
  if ((update.deadline || update.opens) && update.lastChecked === null) {
    errors.push(`${at}: dates require lastChecked (the day you read them on the source)`);
  }
  if (update.declaredStatus !== "unverified" && update.lastChecked === null) {
    errors.push(`${at}: only "unverified" is allowed when the source wasn’t checked`);
  }
  return [...errors, ...validateKeyDate(at, "deadline", update.deadline), ...validateKeyDate(at, "opens", update.opens)];
}

const UPDATES: readonly Update[] = [
  {
    slug: "chevening-2027-28-applications-closed",
    title: "Chevening 2027–28: applications have closed; what happens next",
    type: "application-guidance",
    summary:
      "The application window for Chevening study starting in 2027–28 ran from August to October 2026. Here are the next milestones as the official timeline states them.",
    body: [
      "Chevening’s official timeline says applications for this cycle opened in August 2026 and closed in October 2026, at 11:00 UTC on the date given on each country page.",
      "Next, applications are checked against eligibility, then assessed by independent reading committees (mid-October 2026 to January 2027). British embassies and high commissions shortlist candidates in mid-February 2027, and interviews run from March to April 2027.",
      "Results are announced from mid-June 2027. Successful candidates must hold at least one unconditional offer from a UK university by 17:00 BST on 8 July 2027, and studies begin in September or October 2027.",
      "If you missed this cycle, use the time to strengthen your course choices and your leadership and networking examples; the next cycle’s dates will appear on the official timeline.",
    ],
    programme: "Chevening Scholarships",
    destination: "United Kingdom",
    applicantScope: "Chevening-eligible countries and territories",
    degreeLevels: ["Master’s"],
    cycle: "2027–28 intake (applications August–October 2026)",
    sourceUrl: "https://www.chevening.org/scholarships/application-timeline/",
    sourceLabel: "Chevening application timeline",
    publishedOn: "2026-11-14",
    lastChecked: "2026-11-14",
    deadline: {
      kind: "instant",
      instant: "2027-07-08T16:00:00Z",
      timezoneLabel: "17:00 BST (UK time)",
      label: "Unconditional UK university offer deadline (for successful candidates)",
    },
    declaredStatus: "closed",
    state: "published",
  },
  {
    slug: "fulbright-pakistan-cycle-april-2026-closed",
    title: "Fulbright Degree Program (Pakistan): the April 2026 cycle is closed",
    type: "scholarship-opportunity",
    summary:
      "USEFP lists the Fulbright Master’s and PhD cycle with an April 1, 2026 deadline as closed. The next cycle’s dates aren’t on the page yet.",
    body: [
      "On the USEFP page, the Fulbright Degree Program for Pakistani citizens shows a status of “Closed” with a deadline of April 1, 2026.",
      "The page doesn’t yet give dates for the next cycle, so this site doesn’t either. Check USEFP directly before planning around a date.",
      "As listed on the page when checked: the GRE General Test is required, selected candidates take the TOEFL, and applications are online only. See the Fulbright guide on the scholarships page for the eligibility points listed by USEFP.",
    ],
    programme: "Fulbright Degree Program (USEFP)",
    destination: "United States",
    applicantScope: "Pakistani citizens residing in Pakistan",
    degreeLevels: ["Master’s", "PhD"],
    cycle: "Cycle with an April 1, 2026 deadline",
    sourceUrl: "https://www.usefp.org/scholarships/fulbright-degree.cfm",
    sourceLabel: "USEFP: Fulbright PhD & Masters",
    publishedOn: "2026-11-14",
    lastChecked: "2026-11-14",
    deadline: { kind: "date", date: "2026-04-01", label: "Application deadline (past cycle)" },
    declaredStatus: "closed",
    state: "published",
  },
  {
    slug: "australia-awards-official-resource",
    title: "Australia Awards Scholarships: start from the official page",
    type: "scholarship-opportunity",
    summary:
      "Eligibility and dates for Australia Awards are set by country. This entry points to the official DFAT page; it makes no claim about current availability.",
    body: [
      "Australia Awards is the Australian Government’s scholarship programme, managed by the Department of Foreign Affairs and Trade.",
      "The official page couldn’t be checked when this entry was written, so no dates or requirements are given here. Start from the DFAT page and your country’s Australia Awards page.",
    ],
    programme: "Australia Awards",
    destination: "Australia",
    applicantScope: "Participating countries (varies)",
    degreeLevels: ["Master’s", "PhD"],
    cycle: "Not stated",
    sourceUrl: "https://www.dfat.gov.au/people-to-people/australia-awards/australia-awards-scholarships",
    sourceLabel: "DFAT: Australia Awards Scholarships",
    publishedOn: "2026-11-14",
    lastChecked: null,
    declaredStatus: "unverified",
    state: "published",
  },
  {
    slug: "reading-scholarship-deadlines",
    title: "Reading scholarship deadlines: intake year, application year and time zones",
    type: "application-guidance",
    summary:
      "A scholarship “for 2027–28” usually closes in 2026, and a deadline with a time is only exact in its stated time zone. A short guide to reading dates correctly.",
    body: [
      "The year in a scholarship’s name is usually the year you start studying, not the year you apply. Chevening’s 2027–28 cycle, for example, took applications from August to October 2026.",
      "When a deadline includes a time, read the time zone: Chevening states 11:00 UTC for applications and 17:00 BST for its offer deadline. Convert it to your own time zone and aim to submit a day early.",
      "When a source gives only a date, treat it as ending at the earliest reasonable time where you are, and confirm on the official page; this site never assigns a time zone the source didn’t give.",
    ],
    programme: "General",
    destination: "Any",
    applicantScope: "All applicants",
    degreeLevels: ["Master’s", "PhD"],
    cycle: "Evergreen",
    sourceUrl: "https://www.chevening.org/scholarships/application-timeline/",
    sourceLabel: "Example source: Chevening application timeline",
    publishedOn: "2026-11-14",
    lastChecked: "2026-11-14",
    state: "published",
  },
];

const problems = UPDATES.flatMap(validateUpdate);
const slugs = UPDATES.map((u) => u.slug);
if (new Set(slugs).size !== slugs.length) problems.push("updates: duplicate slugs");
if (problems.length > 0) throw new Error(`Invalid update content:\n${problems.join("\n")}`);

/** Published updates only; drafts never reach pages, bundles or static params. */
export const PUBLISHED_UPDATES: readonly Update[] = UPDATES.filter((u) => u.state === "published");

export function updateBySlug(slug: string): Update | undefined {
  return PUBLISHED_UPDATES.find((u) => u.slug === slug);
}

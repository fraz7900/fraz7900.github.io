import type { Update } from "@/content/advising/updates";

/** RFC 5545 text escaping. */
function escapeText(value: string): string {
  return value.replace(/\\/g, "\\\\").replace(/;/g, "\\;").replace(/,/g, "\\,").replace(/\r?\n/g, "\\n");
}

/** Fold lines longer than 75 octets (approximated by characters for ASCII-heavy content). */
function fold(line: string): string {
  const chunks: string[] = [];
  for (let i = 0; i < line.length; i += 74) chunks.push((i === 0 ? "" : " ") + line.slice(i, i + 74));
  return chunks.join("\r\n");
}

const compactUtc = (ms: number) => new Date(ms).toISOString().replace(/[-:]/g, "").replace(/\.\d{3}/, "");

/**
 * Calendar file for an update's verified deadline. Date-only deadlines become all-day events
 * (no time zone invented); exact deadlines are written in UTC.
 */
export function buildDeadlineIcs(update: Update, stampMs: number): string {
  const deadline = update.deadline;
  if (!deadline) throw new Error(`update "${update.slug}" has no deadline`);

  const timing =
    deadline.kind === "date"
      ? (() => {
          const start = deadline.date.replace(/-/g, "");
          const [y, m, d] = deadline.date.split("-").map(Number);
          const end = new Date(Date.UTC(y, m - 1, d + 1)).toISOString().slice(0, 10).replace(/-/g, "");
          return [`DTSTART;VALUE=DATE:${start}`, `DTEND;VALUE=DATE:${end}`];
        })()
      : (() => {
          const at = Date.parse(deadline.instant);
          return [`DTSTART:${compactUtc(at)}`, `DTEND:${compactUtc(at + 15 * 60_000)}`];
        })();

  const description = [
    `${deadline.label}.`,
    deadline.kind === "instant" ? `Source time: ${deadline.timezoneLabel}.` : "The source gives a date only, with no time zone.",
    `Checked on ${update.lastChecked}. Confirm on the official source before relying on it: ${update.sourceUrl}`,
  ].join(" ");

  const lines = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//fraz7900.github.io//Advising updates//EN",
    "CALSCALE:GREGORIAN",
    "BEGIN:VEVENT",
    `UID:${update.slug}-deadline@fraz7900.github.io`,
    `DTSTAMP:${compactUtc(stampMs)}`,
    ...timing,
    `SUMMARY:${escapeText(`${update.programme}: ${deadline.label}`)}`,
    `DESCRIPTION:${escapeText(description)}`,
    `URL:${update.sourceUrl}`,
    "END:VEVENT",
    "END:VCALENDAR",
  ];
  return lines.map(fold).join("\r\n") + "\r\n";
}

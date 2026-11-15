import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { BookingCta, PageIntro } from "@/components/advising/AdvisingBlocks";
import { AddToCalendar, StaleNotice, StatusBadge } from "@/components/advising/UpdateBits";
import { PUBLISHED_UPDATES, UPDATE_TYPE_LABEL, updateBySlug } from "@/content/advising/updates";
import { formatKeyDate } from "@/lib/advising/updateStatus";

export const dynamicParams = false;
const BUILD_TIME_MS = Date.now();

export function generateStaticParams() {
  return PUBLISHED_UPDATES.map((update) => ({ slug: update.slug }));
}

export async function generateMetadata({ params }: PageProps<"/advising/updates/[slug]">): Promise<Metadata> {
  const update = updateBySlug((await params).slug);
  return update ? { title: update.title, description: update.summary } : {};
}

export default async function UpdatePage({ params }: PageProps<"/advising/updates/[slug]">) {
  const update = updateBySlug((await params).slug);
  if (!update) notFound();

  const facts: [string, string][] = [
    ["Programme", update.programme],
    ["Destination", update.destination],
    ["Who can apply", update.applicantScope],
    ["Degree level", update.degreeLevels.join(", ")],
    ["Cycle", update.cycle],
    ...(update.opens ? ([[update.opens.label, formatKeyDate(update.opens)]] as [string, string][]) : []),
    ...(update.deadline ? ([[update.deadline.label, formatKeyDate(update.deadline)]] as [string, string][]) : []),
    ["Published", update.publishedOn],
    ["Last checked", update.lastChecked ?? "Not checked against the source"],
  ];

  return (
    <>
      <PageIntro label={`advising / updates / ${UPDATE_TYPE_LABEL[update.type].toLowerCase()}`} title={update.title} lede={update.summary}>
        <StatusBadge update={update} buildTimeMs={BUILD_TIME_MS} />
      </PageIntro>

      <div className="grid grid-cols-[minmax(0,1fr)] gap-10 lg:grid-cols-[minmax(0,1.5fr)_minmax(0,1fr)]">
        <div className="prose-body text-ink/90">
          {update.body.map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}
        </div>
        <aside className="flex flex-col gap-4">
          <dl className="glass flex flex-col rounded-xl px-5 py-2 text-sm">
            {facts.map(([term, detail]) => (
              <div key={term} className="grid grid-cols-[7.5rem_1fr] gap-3 border-b border-line py-2.5 last:border-0">
                <dt className="font-mono text-xs text-accent">{term}</dt>
                <dd className="text-ink">{detail}</dd>
              </div>
            ))}
          </dl>
          <StaleNotice update={update} buildTimeMs={BUILD_TIME_MS} />
          <a href={update.sourceUrl} target="_blank" rel="noreferrer" className="btn-primary self-start">
            Official source: {update.sourceLabel}
          </a>
          <AddToCalendar update={update} buildTimeMs={BUILD_TIME_MS} />
          <p className="text-xs text-faint">Always confirm dates and requirements on the official source before acting.</p>
        </aside>
      </div>

      <div className="flex flex-wrap items-center gap-4 border-t border-line pt-8">
        <Link href="/advising/updates/" className="btn-ghost">
          All updates
        </Link>
        <BookingCta service="admissions" label="Plan your application" />
      </div>
    </>
  );
}

import type { Metadata } from "next";
import Link from "next/link";
import { BookingCta, PageIntro } from "@/components/advising/AdvisingBlocks";
import { PUBLISHED_STORIES, RELATIONSHIP_LABEL, STORY_FILTER_THRESHOLD } from "@/content/advising/stories";

export const metadata: Metadata = {
  title: "Scholarship and admissions stories",
  description: "Real scholarship and admissions journeys, published only with consent and clearly labelled by relationship.",
};

export default function StoriesPage() {
  return (
    <>
      <PageIntro
        label="advising / stories"
        title="Scholarship and admissions stories"
        lede="Real journeys, shared with consent. Each story says whether it’s my own experience, a guest scholar’s, or someone I advised, so a guest story is never presented as a coaching result."
      />

      {PUBLISHED_STORIES.length === 0 ? (
        <div className="glass flex max-w-2xl flex-col gap-4 rounded-xl p-6">
          <p className="font-display text-xl font-semibold text-ink">No stories published yet.</p>
          <p className="leading-relaxed text-muted">
            I’m only publishing stories that people have agreed to share, in their own words. Until then, the scholarship
            guides link to official information, and you’re welcome to talk your plans through with me.
          </p>
          <div className="flex flex-wrap gap-3">
            <Link href="/advising/scholarships/" className="btn-ghost">
              Read the scholarship guides
            </Link>
            <BookingCta service="admissions" />
          </div>
        </div>
      ) : (
        <>
          {PUBLISHED_STORIES.length >= STORY_FILTER_THRESHOLD && (
            <p className="text-xs text-faint">Filters by programme, country and category appear here as the collection grows.</p>
          )}
          <ul className="grid grid-cols-[minmax(0,1fr)] gap-4 md:grid-cols-2">
            {PUBLISHED_STORIES.map((story) => (
              <li key={story.slug} className="glass relative flex flex-col gap-2 rounded-xl p-5">
                <p className="font-mono text-xs text-accent">{RELATIONSHIP_LABEL[story.relationship]}</p>
                <h2 className="font-display text-xl font-semibold text-ink">
                  <Link href={`/advising/stories/${story.slug}/`} className="after:absolute after:inset-0 after:content-['']">
                    {story.title}
                  </Link>
                </h2>
                <p className="text-sm text-muted">
                  {story.displayName} · {story.programme}
                  {story.country ? ` · ${story.country}` : ""}
                  {story.year ? ` · ${story.year}` : ""}
                </p>
              </li>
            ))}
          </ul>
        </>
      )}
    </>
  );
}

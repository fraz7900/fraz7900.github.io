import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { BookingCta, PageIntro, Section } from "@/components/advising/AdvisingBlocks";
import { PUBLISHED_STORIES, RELATIONSHIP_LABEL, storyBySlug } from "@/content/advising/stories";

export const dynamicParams = false;

/**
 * Static export requires at least one generated path. While no story is published, a single
 * sentinel path is built that renders the not-found page (noindex) and is linked from nowhere.
 * It disappears automatically once a real story is published.
 */
export const NO_STORIES_SENTINEL = "none";

export function generateStaticParams() {
  return PUBLISHED_STORIES.length > 0
    ? PUBLISHED_STORIES.map((story) => ({ slug: story.slug }))
    : [{ slug: NO_STORIES_SENTINEL }];
}

export async function generateMetadata({ params }: PageProps<"/advising/stories/[slug]">): Promise<Metadata> {
  const story = storyBySlug((await params).slug);
  return story
    ? { title: story.title, description: `${story.programme}: ${story.mainChallenge}` }
    : { title: "Page not found", robots: { index: false, follow: false } };
}

export default async function StoryPage({ params }: PageProps<"/advising/stories/[slug]">) {
  const story = storyBySlug((await params).slug);
  if (!story) notFound();

  return (
    <>
      <PageIntro label={`advising / stories / ${story.slug}`} title={story.title} lede={story.startingPoint} />

      <dl className="glass grid gap-x-6 gap-y-3 rounded-xl p-5 text-sm sm:grid-cols-2 lg:grid-cols-4">
        {[
          ["Relationship to me", RELATIONSHIP_LABEL[story.relationship]],
          ["Name", `${story.displayName}${story.isPseudonym ? " (pseudonym)" : ""}`],
          ["Programme", story.programme],
          ["Where and when", [story.university, story.country, story.year].filter(Boolean).join(" · ") || "Not stated"],
        ].map(([term, detail]) => (
          <div key={term}>
            <dt className="font-mono text-xs text-accent">{term}</dt>
            <dd className="mt-1 text-ink">{detail}</dd>
          </div>
        ))}
      </dl>

      {story.image?.approved && (
        <Image src={story.image.src} alt={story.image.alt} width={640} height={420} unoptimized className="rounded-xl" />
      )}

      <Section id="challenge" index="01" title="The main challenge">
        <p className="prose-body text-ink/90">{story.mainChallenge}</p>
      </Section>

      <Section id="journey" index="02" title="The journey">
        <p className="prose-body mb-6 text-ink/90">{story.preparation}</p>
        <ol className="relative flex flex-col gap-5 border-l border-line-strong pl-6">
          {story.timeline.map((milestone) => (
            <li key={`${milestone.when}-${milestone.what}`} className="relative">
              <span aria-hidden="true" className="absolute -left-[1.85rem] top-1.5 size-2.5 rounded-full bg-accent ring-4 ring-paper" />
              <p className="font-mono text-xs text-accent">{milestone.when}</p>
              <p className="text-ink/90">{milestone.what}</p>
            </li>
          ))}
        </ol>
      </Section>

      <Section id="lessons" index="03" title="Lessons">
        <ul className="flex max-w-3xl list-disc flex-col gap-2 pl-5 text-ink/90 marker:text-accent">
          {story.lessons.map((lesson) => (
            <li key={lesson}>{lesson}</li>
          ))}
        </ul>
        {story.quotes.filter((q) => q.approved).map((quote) => (
          <blockquote key={quote.text} className="mt-6 max-w-3xl border-l-2 border-accent pl-4 text-lg text-ink">
            “{quote.text}”
          </blockquote>
        ))}
      </Section>

      <Section id="outcome" index="04" title="Outcome">
        <p className="prose-body text-ink/90">{story.outcome.text}</p>
        <p className="mt-2 text-xs text-faint">{story.outcome.verified ? "Outcome verified." : "Outcome as described by the author."}</p>
      </Section>

      <div className="flex flex-wrap items-center gap-4">
        <Link href="/advising/scholarships/" className="btn-ghost">
          Scholarship guides
        </Link>
        <BookingCta service="admissions" label="Talk about your own application" />
      </div>
      <p className="text-xs text-faint">
        Published {story.publishedOn}
        {story.updatedOn ? `, updated ${story.updatedOn}` : ""}. Shared with the author’s consent.
      </p>
    </>
  );
}

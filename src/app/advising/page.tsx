import type { Metadata } from "next";
import Link from "next/link";
import { BookingCta, Faq, PageIntro, ProcessSteps, Section, ServiceCards } from "@/components/advising/AdvisingBlocks";
import { ServiceFinder } from "@/components/advising/ServiceFinder";
import { FAQ } from "@/content/advising/faq";
import { PERSONAL_EXPERIENCE } from "@/content/advising/scholarships";
import { ACTIVE_SERVICES } from "@/content/advising/services";
import { PUBLISHED_STORIES } from "@/content/advising/stories";
import { PUBLISHED_UPDATES } from "@/content/advising/updates";

export const metadata: Metadata = {
  title: "Advising",
  description:
    "One-to-one guidance from Fraz Ahmed for career decisions, university applications, scholarship preparation and standardized tests.",
};

const RECENT_UPDATES = [...PUBLISHED_UPDATES]
  .sort((a, b) => (b.lastChecked ?? b.publishedOn).localeCompare(a.lastChecked ?? a.publishedOn))
  .slice(0, 3);

export default function AdvisingPage() {
  return (
    <>
      <PageIntro
        label="advising"
        title="Make your next move with a clearer plan."
        lede="One-to-one guidance for career decisions, university applications, scholarship preparation, and standardized tests."
      >
        <BookingCta />
        <a href="#services" className="btn-ghost self-start">
          Explore how I can help
        </a>
      </PageIntro>

      <Section id="services" index="01" title="Three ways I can help">
        <ServiceCards services={ACTIVE_SERVICES} />
      </Section>

      <Section id="where-to-start" index="02" title="Not sure where to start?">
        <ServiceFinder services={ACTIVE_SERVICES.map(({ id, title, href }) => ({ id, title, href }))} />
      </Section>

      <Section id="approach" index="03" title="How I work">
        <div className="grid grid-cols-[minmax(0,1fr)] gap-8 lg:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)]">
          <div className="prose-body text-ink/90">
            <p>
              I’ve made the kinds of moves many people ask about: from a product role in healthcare SaaS, to public
              service at Pakistan’s Ministry of Finance, to graduate study in the United States. I’ll share what I learned, ask
              direct questions, and help you plan; the decisions and the writing stay yours.
            </p>
            <p>
              Conversations are practical. You leave with a clearer view of your options and one or two next steps,
              not a script or a promise.
            </p>
          </div>
          <aside className="glass flex flex-col gap-2 rounded-xl p-5 text-sm">
            <p className="font-mono text-xs text-accent">my own background</p>
            <p className="leading-relaxed text-ink/90">{PERSONAL_EXPERIENCE.text}</p>
            <Link href="/about/" className="link-accent">
              Read more about me
            </Link>
          </aside>
        </div>
      </Section>

      <Section id="process" index="04" title="The process">
        <ProcessSteps />
      </Section>

      <Section id="stories" index="05" title="Scholarship and admissions stories">
        {PUBLISHED_STORIES.length > 0 ? (
          <p className="text-muted">
            <Link href="/advising/stories/" className="link-accent">
              Read {PUBLISHED_STORIES.length} published {PUBLISHED_STORIES.length === 1 ? "story" : "stories"}
            </Link>
          </p>
        ) : (
          <p className="max-w-2xl leading-relaxed text-muted">
            Stories will appear here once people have agreed to share them. In the meantime, the{" "}
            <Link href="/advising/scholarships/" className="link-accent">
              scholarship guides
            </Link>{" "}
            link straight to official sources.
          </p>
        )}
      </Section>

      <Section id="updates" index="06" title="Recent updates">
        <ul className="grid grid-cols-[minmax(0,1fr)] gap-4 md:grid-cols-3">
          {RECENT_UPDATES.map((update) => (
            <li key={update.slug} className="glass relative flex flex-col gap-2 rounded-xl p-5">
              <p className="font-mono text-xs text-faint">checked {update.lastChecked ?? "—"}</p>
              <h3 className="font-display text-lg font-semibold text-ink">
                <Link href={`/advising/updates/${update.slug}/`} className="after:absolute after:inset-0 after:content-['']">
                  {update.title}
                </Link>
              </h3>
            </li>
          ))}
        </ul>
        <p className="mt-5">
          <Link href="/advising/updates/" className="btn-ghost">
            All updates
          </Link>
        </p>
      </Section>

      <Section id="faq" index="07" title="Questions">
        <Faq items={FAQ} />
      </Section>

      <div className="glass flex flex-col items-start gap-4 rounded-2xl p-6 sm:p-10">
        <h2 className="font-display text-3xl font-semibold text-ink">Ready to talk it through?</h2>
        <BookingCta />
      </div>
    </>
  );
}

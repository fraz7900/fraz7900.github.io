import type { Metadata } from "next";
import Link from "next/link";
import { BookingCta, PageIntro, Section } from "@/components/advising/AdvisingBlocks";
import { PERSONAL_EXPERIENCE, SCHOLARSHIP_GUIDES } from "@/content/advising/scholarships";

export const metadata: Metadata = {
  title: "Scholarship guides",
  description: "Source-linked guides to Fulbright (Pakistan), Chevening and Australia Awards, with country scope and check dates.",
};

const CATEGORIES = [
  ["Programme guides", "What the official sources say, with country scope and the date I checked."],
  ["My experience", "My own perspective as a Fulbright Scholar. Personal, not official."],
  ["Guest stories", "Scholars sharing their own journeys. Not people I advised."],
  ["People I advised", "Outcomes only where I actually advised someone and the outcome is verified."],
] as const;

export default function ScholarshipsPage() {
  return (
    <>
      <PageIntro
        label="advising / scholarships"
        title="Scholarship guides"
        lede="Starting points for three major programmes, each linked to its official source. Requirements differ by country, so every guide states its scope."
      >
        <BookingCta service="scholarships" label="Plan a scholarship application" />
      </PageIntro>

      <section aria-label="How to read this section" className="grid grid-cols-[minmax(0,1fr)] gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {CATEGORIES.map(([title, text], index) => (
          <div key={title} className="rounded-lg border border-line px-4 py-3">
            <p className="font-mono text-xs text-accent">{String.fromCharCode(65 + index)} · {title.toLowerCase()}</p>
            <p className="mt-1 text-sm text-muted">{text}</p>
          </div>
        ))}
      </section>

      {SCHOLARSHIP_GUIDES.map((guide, index) => (
        <Section key={guide.id} id={guide.id} index={String(index + 1).padStart(2, "0")} title={guide.name}>
          <div className="grid grid-cols-[minmax(0,1fr)] gap-8 lg:grid-cols-[minmax(0,1.5fr)_minmax(0,1fr)]">
            <div className="flex flex-col gap-5">
              <p className="rounded-md border border-sky/40 bg-sky/5 px-3 py-2 text-sm text-ink">
                <span className="font-mono text-xs text-sky">scope · </span>
                {guide.scope}
              </p>
              <p className="leading-relaxed text-ink/90">{guide.summary}</p>
              {guide.facts.length > 0 ? (
                <div>
                  <h3 className="text-sm font-semibold text-ink">From the official source</h3>
                  <ul className="mt-2 flex list-disc flex-col gap-1.5 pl-5 text-sm leading-relaxed text-ink/90 marker:text-accent">
                    {guide.facts.map((fact) => (
                      <li key={fact.text}>{fact.text}</li>
                    ))}
                  </ul>
                </div>
              ) : null}
              <p className={`text-xs ${guide.lastChecked ? "text-faint" : "text-amber"}`}>{guide.verificationNote}</p>
            </div>
            <aside className="glass flex flex-col gap-4 rounded-xl p-5">
              <div>
                <p className="font-mono text-xs text-accent">official sources</p>
                <ul className="mt-2 flex flex-col gap-1.5 text-sm">
                  {guide.officialLinks.map((link) => (
                    <li key={link.href}>
                      <a href={link.href} target="_blank" rel="noreferrer" className="link-accent">
                        {link.label}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <p className="font-mono text-xs text-accent">how I can help</p>
                <ul className="mt-2 flex flex-col gap-1 text-sm text-ink/90">
                  {guide.howICanHelp.map((item) => (
                    <li key={item}>→ {item}</li>
                  ))}
                </ul>
              </div>
              {guide.id === "fulbright" && (
                <div className="border-t border-line pt-3">
                  <p className="font-mono text-xs text-accent">B · my experience</p>
                  <p className="mt-1 text-sm leading-relaxed text-muted">{PERSONAL_EXPERIENCE.text}</p>
                </div>
              )}
            </aside>
          </div>
        </Section>
      ))}

      <p className="text-muted">
        Looking for dates? See{" "}
        <Link href="/advising/updates/" className="link-accent">
          source-checked updates
        </Link>
        , and read{" "}
        <Link href="/advising/stories/" className="link-accent">
          stories
        </Link>{" "}
        as they’re published.
      </p>
    </>
  );
}

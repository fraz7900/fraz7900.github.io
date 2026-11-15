import type { Metadata } from "next";
import Link from "next/link";
import { SectionLabel } from "@/components/SectionLabel";
import { TRACKS, itemsFor } from "@/content/work";

export const metadata: Metadata = {
  title: "Work",
  description:
    "Fraz Ahmed’s work in five tracks: product management, public finance, consulting, research, and career and admissions guidance.",
};

export default function WorkPage() {
  return (
    <div className="page-container flex flex-col gap-12 py-14 sm:py-20">
      <header className="flex max-w-2xl flex-col gap-5">
        <SectionLabel>work_archive</SectionLabel>
        <h1 className="font-display text-5xl font-semibold tracking-tight text-ink sm:text-6xl">Work</h1>
        <p className="text-lg leading-relaxed text-muted">
          Five tracks. Hiring for product? Start with{" "}
          <Link href="/work/product-management/" className="link-accent">
            product management
          </Link>
          .
        </p>
      </header>

      <ol className="grid grid-cols-[minmax(0,1fr)] gap-4 md:grid-cols-2">
        {TRACKS.map((track, index) => {
          const items = itemsFor(track.id);
          const featured = index === 0;
          return (
            <li key={track.id} className={featured ? "md:col-span-2" : undefined}>
              <article
                className={`glass group relative flex h-full flex-col gap-4 rounded-xl p-5 transition-colors hover:border-accent/60 sm:p-6 ${
                  featured ? "border-accent/50" : ""
                }`}
              >
                <p className="flex flex-wrap items-center justify-between gap-2 font-mono text-xs">
                  <span className="text-faint">{String(index + 1).padStart(2, "0")}</span>
                  <span className="text-muted">{items.length > 0 ? `${items.length} item${items.length === 1 ? "" : "s"}` : "in preparation"}</span>
                </p>
                <h2 className={`font-display font-semibold text-ink ${featured ? "text-3xl sm:text-4xl" : "text-2xl"}`}>
                  <Link href={track.href} className="after:absolute after:inset-0 after:content-['']">
                    {track.title}
                  </Link>
                </h2>
                <p className="leading-relaxed text-ink/85">{track.summary}</p>
                <p className="text-sm text-muted">
                  <span className="font-mono text-xs text-accent">for · </span>
                  {track.forWhom}
                </p>
                {items.length > 0 && (
                  <ul className="mt-auto flex flex-col gap-1 border-t border-line pt-3 text-sm text-muted">
                    {items.slice(0, 3).map((item) => (
                      <li key={item.title} className="truncate">
                        → {item.title}
                      </li>
                    ))}
                  </ul>
                )}
              </article>
            </li>
          );
        })}
      </ol>
    </div>
  );
}

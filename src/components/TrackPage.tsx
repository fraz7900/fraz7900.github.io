import Link from "next/link";
import { SectionLabel } from "@/components/SectionLabel";
import { WorkList } from "@/components/WorkList";
import { itemsFor, trackById, type TrackId } from "@/content/work";

/** Standard page for a work track: header, items, and an honest empty state. */
export function TrackPage({ id, intro, children }: { id: TrackId; intro: string; children?: React.ReactNode }) {
  const track = trackById(id);
  const items = itemsFor(id);

  return (
    <div className="page-container flex flex-col gap-10 py-14 sm:py-20">
      <header className="flex max-w-3xl flex-col gap-5">
        <nav aria-label="Breadcrumb" className="font-mono text-xs text-muted">
          <Link href="/work/" className="hover:text-accent">
            ~/work
          </Link>
          <span aria-hidden="true"> / </span>
          <span aria-current="page" className="text-accent">
            {id}
          </span>
        </nav>
        <SectionLabel>{track.forWhom}</SectionLabel>
        <h1 className="font-display text-4xl font-semibold tracking-tight text-ink sm:text-6xl">{track.title}</h1>
        <p className="text-lg leading-relaxed text-muted">{intro}</p>
      </header>

      {items.length > 0 ? (
        <WorkList items={items} />
      ) : (
        <div className="glass flex max-w-2xl flex-col gap-3 rounded-xl p-6">
          <p className="font-display text-xl font-semibold text-ink">Case studies are being prepared.</p>
          <p className="leading-relaxed text-muted">
            Nothing is published in this track yet. In the meantime, the{" "}
            <Link href="/work/product-management/" className="link-accent">
              product management
            </Link>{" "}
            and{" "}
            <Link href="/work/public-finance/" className="link-accent">
              public finance
            </Link>{" "}
            tracks show how I work.
          </p>
        </div>
      )}

      {children}

      <p>
        <Link href="/work/" className="btn-ghost">
          All work tracks
        </Link>
      </p>
    </div>
  );
}

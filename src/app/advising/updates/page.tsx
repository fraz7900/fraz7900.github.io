import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { PageIntro } from "@/components/advising/AdvisingBlocks";
import { UpdatesExplorer } from "@/components/advising/UpdatesExplorer";
import { PUBLISHED_UPDATES } from "@/content/advising/updates";

export const metadata: Metadata = {
  title: "Admissions and scholarship updates",
  description: "Source-checked admissions and scholarship updates, each linked to its official source with the date it was checked.",
};

/** Time the static page was built; statuses are re-evaluated against the visitor's clock after load. */
const BUILD_TIME_MS = Date.now();

/** Static, no-JavaScript list shown until the interactive explorer loads. */
function StaticList() {
  return (
    <ul className="flex flex-col gap-3">
      {PUBLISHED_UPDATES.map((update) => (
        <li key={update.slug} className="glass rounded-xl p-5">
          <Link href={`/advising/updates/${update.slug}/`} className="font-display text-lg font-semibold text-ink hover:text-accent">
            {update.title}
          </Link>
          <p className="mt-1 text-sm text-muted">{update.summary}</p>
        </li>
      ))}
    </ul>
  );
}

export default function UpdatesPage() {
  return (
    <>
      <PageIntro
        label="advising / updates"
        title="Admissions and scholarship updates"
        lede="Each update links to its official source and says when I last checked it. Dates appear only when the source states them; anything I couldn’t check is labelled that way."
      />
      <Suspense fallback={<StaticList />}>
        <UpdatesExplorer updates={PUBLISHED_UPDATES} buildTimeMs={BUILD_TIME_MS} />
      </Suspense>
    </>
  );
}

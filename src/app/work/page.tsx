import type { Metadata } from "next";
import { SectionLabel } from "@/components/SectionLabel";
import { InPreparationList, WorkList } from "@/components/WorkList";
import { IN_PREPARATION, PUBLISHED_WORK } from "@/content/work";

export const metadata: Metadata = {
  title: "Work",
  description: "Published work by Fraz Ahmed: the decision each piece addresses, his role, and what you can inspect.",
};

export default function WorkPage() {
  return (
    <div className="page-container flex flex-col gap-12 py-14 sm:py-20">
      <header className="flex max-w-2xl flex-col gap-5">
        <SectionLabel>work_archive</SectionLabel>
        <h1 className="font-display text-5xl font-semibold tracking-tight text-ink sm:text-6xl">Work</h1>
        <p className="text-lg leading-relaxed text-muted">
          Public finance, healthcare SaaS and the tools in between. Each entry names the decision it addresses, my
          role, and what you can open and check.
        </p>
      </header>

      <section aria-labelledby="published-heading" className="flex flex-col gap-5">
        <h2 id="published-heading" className="font-mono text-xs text-faint">
          published · {String(PUBLISHED_WORK.length).padStart(2, "0")}
        </h2>
        <WorkList />
      </section>

      {IN_PREPARATION.length > 0 && (
        <section aria-labelledby="preparing-heading" className="flex flex-col gap-4">
          <h2 id="preparing-heading" className="font-mono text-xs text-faint">
            in preparation
          </h2>
          <InPreparationList />
        </section>
      )}
    </div>
  );
}

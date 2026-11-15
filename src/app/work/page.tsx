import type { Metadata } from "next";
import { SectionLabel } from "@/components/SectionLabel";
import { InPreparationList, WorkList } from "@/components/WorkList";

export const metadata: Metadata = {
  title: "Work",
  description: "Published work by Fraz Ahmed: the decision each piece addresses, his role, and what you can inspect.",
};

export default function WorkPage() {
  return (
    <div className="page-container flex flex-col gap-10 py-12 sm:py-16">
      <header className="flex max-w-2xl flex-col gap-4">
        <SectionLabel>Work index</SectionLabel>
        <h1 className="font-display text-5xl text-ink">Work</h1>
        <p className="text-lg leading-relaxed text-ink/85">
          Each entry names the decision it addresses, my role, and what you can open and check.
        </p>
      </header>

      <section aria-labelledby="published-heading" className="flex flex-col gap-4">
        <h2 id="published-heading" className="font-mono text-xs uppercase tracking-wider text-muted">
          Published
        </h2>
        <WorkList />
      </section>

      <section aria-labelledby="preparing-heading" className="flex flex-col gap-4">
        <h2 id="preparing-heading" className="font-mono text-xs uppercase tracking-wider text-muted">
          In preparation
        </h2>
        <InPreparationList />
      </section>
    </div>
  );
}

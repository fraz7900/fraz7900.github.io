import Link from "next/link";
import { RoiCalculator } from "@/components/RoiCalculator";
import { SectionLabel } from "@/components/SectionLabel";
import { InPreparationList, WorkList } from "@/components/WorkList";
import { SITE } from "@/content/site";

const PREVIEW_FIELDS = ["adoptionPercent", "minutesSavedPerCase"] as const;

export default function HomePage() {
  return (
    <>
      <section
        aria-labelledby="intro-heading"
        className="page-container grid gap-10 py-12 sm:py-16 lg:grid-cols-[1.1fr_1fr] lg:gap-14"
      >
        <div className="flex flex-col gap-6">
          <SectionLabel>{SITE.practiceAreas.join(" · ")}</SectionLabel>
          <h1
            id="intro-heading"
            className="font-display text-[2.6rem] leading-[1.05] text-ink sm:text-6xl"
          >
            {SITE.headline}
          </h1>
          <p className="max-w-xl text-lg leading-relaxed text-ink/85">{SITE.supportingCopy}</p>
          <div className="flex flex-wrap items-center gap-x-6 gap-y-3">
            <Link href="/work/" className="btn-primary">
              View selected work <span aria-hidden="true">→</span>
            </Link>
            <Link href="/tools/workflow-roi/" className="link-accent text-[0.9375rem]">
              Try the ROI calculator
            </Link>
          </div>
        </div>

        <aside
          aria-labelledby="calculator-heading"
          className="rounded-lg border border-line bg-card p-5 sm:p-6"
        >
          <SectionLabel>Live tool</SectionLabel>
          <h2 id="calculator-heading" className="mt-2 font-display text-2xl text-ink">
            Workflow ROI calculator
          </h2>
          <p className="mt-1 mb-5 text-sm text-muted">
            What is a workflow change worth each month? Change adoption and time saved.
          </p>
          <RoiCalculator editable={PREVIEW_FIELDS} linkToFullTool />
        </aside>
      </section>

      <section aria-labelledby="work-heading" className="border-t border-line bg-card/60">
        <div className="page-container flex flex-col gap-6 py-12 sm:py-16">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <SectionLabel index="01">Selected work</SectionLabel>
              <h2 id="work-heading" className="mt-2 font-display text-4xl text-ink">
                Work you can inspect
              </h2>
            </div>
            <Link href="/work/" className="link-accent text-sm">
              All work
            </Link>
          </div>
          <WorkList />
          <div className="mt-4 flex flex-col gap-3">
            <SectionLabel as="h2" index="02">
              In preparation
            </SectionLabel>
            <InPreparationList />
          </div>
        </div>
      </section>
    </>
  );
}

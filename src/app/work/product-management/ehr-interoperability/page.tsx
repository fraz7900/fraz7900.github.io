import type { Metadata } from "next";
import Link from "next/link";
import { CaseFooter, CaseHeader, CaseSection } from "@/components/case/CaseLayout";
import { ConnectionWorkflow, QuickScanList } from "@/components/product/EhrCase";
import { CaseItems } from "@/components/product/Evidence";
import { CHAPTERS, EHR_CASE_FILE, EHR_INTRO, OPEN_QUESTIONS } from "@/content/ehr";

export const metadata: Metadata = {
  title: "EHR interoperability case study",
  description:
    "How Fraz Ahmed, as CareTrak product manager at Persivia, led 10 engineers and 3 QA analysts to close EHR interoperability gaps across 50+ health systems.",
};

const CHAPTER_START = 2;

export default function EhrInteroperabilityPage() {
  return (
    <article className="flex flex-col">
      {OPEN_QUESTIONS.length > 0 && (
        <p data-to-confirm="ehr-draft" className="page-container pt-6 font-mono text-xs text-amber">
          Draft: {OPEN_QUESTIONS.length} details are waiting for my confirmation and are marked below. Deploys are blocked until they are resolved.
        </p>
      )}
      <CaseHeader
        track={{ id: "product-management", href: "/work/product-management/" }}
        crumb="ehr-interoperability"
        title={EHR_INTRO.title}
        lede={EHR_INTRO.lede}
        facts={EHR_CASE_FILE}
        cta={{ href: "#at-a-glance", label: "Start with the quick version" }}
      />

      <CaseSection id="at-a-glance" index="01" title="The quick version">
        <div className="max-w-3xl">
          <QuickScanList />
        </div>
      </CaseSection>

      {CHAPTERS.map((chapter, index) => (
        <CaseSection key={chapter.id} id={chapter.id} index={String(index + CHAPTER_START).padStart(2, "0")} title={chapter.title}>
          <div className="glass max-w-3xl rounded-xl px-5 py-1">
            <CaseItems items={chapter.items} />
          </div>
          {chapter.id === "original-workflow" && (
            <div className="mt-10 flex flex-col gap-4">
              <h3 className="font-display text-2xl font-semibold text-ink">How a new health system gets connected</h3>
              <ConnectionWorkflow />
            </div>
          )}
        </CaseSection>
      ))}

      <CaseFooter note="Every statement is tagged with its source: my CV, the CareTrak case study, my own account, Persivia’s public announcements (linked), a figure reported on the project, or my reading of the work looking back. The diagram is a recreation, not a Persivia document.">
        <Link href="/work/product-management/" className="btn-ghost">
          Back to product management
        </Link>
        <Link href="/work/caretrak/" className="btn-ghost">
          CareTrak launch walkthrough
        </Link>
      </CaseFooter>
    </article>
  );
}

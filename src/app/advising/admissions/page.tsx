import type { Metadata } from "next";
import Link from "next/link";
import { BookingCta, HelpsWith, Note, PageIntro, Section } from "@/components/advising/AdvisingBlocks";
import { ReadinessChecklist } from "@/components/advising/ReadinessChecklist";
import { serviceById } from "@/content/advising/services";

const SERVICE = serviceById("admissions")!;

export const metadata: Metadata = { title: "Admissions support", description: SERVICE.summary };

export default function AdmissionsPage() {
  return (
    <>
      <PageIntro label="advising / admissions" title="Admissions support" lede={SERVICE.summary}>
        <BookingCta service="admissions" />
      </PageIntro>

      <Section id="what-we-can-cover" index="01" title="What we can cover">
        <HelpsWith items={SERVICE.helpsWith} />
      </Section>

      <Note>
        <strong className="text-ink">Your application stays yours.</strong> I give feedback, ask questions and help you
        plan. I don’t ghostwrite statements, write recommendation letters, or contact universities on your behalf.
      </Note>

      <Section id="readiness" index="02" title="Application readiness checklist">
        <p className="mb-6 max-w-2xl leading-relaxed text-muted">
          Tick off what you’ve done. Progress is counted from completed tasks only. Saving is optional and stays in your
          browser; this checklist never asks for transcripts, passports or financial records.
        </p>
        <ReadinessChecklist />
      </Section>

      <p className="text-muted">
        Applying for funding too? See the{" "}
        <Link href="/advising/scholarships/" className="link-accent">
          scholarship guides
        </Link>{" "}
        and{" "}
        <Link href="/advising/updates/" className="link-accent">
          source-checked updates
        </Link>
        .
      </p>
    </>
  );
}

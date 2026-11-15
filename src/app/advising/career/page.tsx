import type { Metadata } from "next";
import { BookingCta, HelpsWith, Note, PageIntro, Section } from "@/components/advising/AdvisingBlocks";
import { CareerReflectionTool } from "@/components/advising/CareerReflectionTool";
import { serviceById } from "@/content/advising/services";

const SERVICE = serviceById("career")!;

export const metadata: Metadata = { title: "Career guidance", description: SERVICE.summary };

export default function CareerPage() {
  return (
    <>
      <PageIntro label="advising / career" title="Career guidance" lede={SERVICE.summary}>
        <BookingCta service="career" />
      </PageIntro>

      <Section id="what-we-can-cover" index="01" title="What we can cover">
        <HelpsWith items={SERVICE.helpsWith} />
      </Section>

      <Section id="reflection" index="02" title="Reflect before we talk">
        <p className="mb-6 max-w-2xl leading-relaxed text-muted">
          Three quick questions turn into a suggested focus for our conversation and a short preparation checklist.
          Nothing is sent anywhere, and you don’t need an account or email to see the result.
        </p>
        <CareerReflectionTool />
      </Section>

      <Note>
        This is career guidance, not licensed psychological counselling, and it can’t guarantee a job or promotion. If
        you’re struggling with your wellbeing, please reach out to a qualified professional.
      </Note>
    </>
  );
}

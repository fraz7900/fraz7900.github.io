import type { Metadata } from "next";
import { BookingCta, Note, PageIntro, ProcessSteps, Section } from "@/components/advising/AdvisingBlocks";
import { StudyPlanBuilder } from "@/components/advising/StudyPlanBuilder";
import { serviceById } from "@/content/advising/services";
import { offeredTests } from "@/content/advising/tests";

const SERVICE = serviceById("test-prep")!;
const TESTS = offeredTests();

export const metadata: Metadata = { title: "Test preparation planning", description: SERVICE.summary };

const STEPS = [
  { title: "Starting point", text: "Take an official practice test to see where you are, before planning anything." },
  { title: "Study plan", text: "Fit preparation into the weeks and hours you actually have." },
  { title: "Section work", text: "Spend more time on the sections that need it, without abandoning the rest." },
  { title: "Practice review", text: "Treat every practice test as data: log mistakes and look for patterns." },
  { title: "Test day", text: "Confirm logistics, ID rules and timing, and rest." },
] as const;

export default function TestPrepPage() {
  return (
    <>
      <PageIntro label="advising / test prep" title="Test preparation planning" lede={SERVICE.summary}>
        <BookingCta service="test-prep" />
      </PageIntro>

      <Section id="approach" index="01" title="How preparation is structured">
        <ProcessSteps steps={STEPS} />
      </Section>

      <Section id="plan-builder" index="02" title="Build a study plan">
        <p className="mb-6 max-w-2xl leading-relaxed text-muted">
          Choose your weeks and weekly hours, pick the areas you want to emphasise, and get a week-by-week allocation.
          It’s a planning estimate: it doesn’t predict scores or promise improvements.
        </p>
        <StudyPlanBuilder tests={TESTS} />
      </Section>

      <Note>
        I help you plan and review your preparation. I don’t provide official test questions or score guarantees. For
        current formats, rules and official practice material, always use the test provider’s own website.
      </Note>
    </>
  );
}

import type { Metadata } from "next";
import { Suspense } from "react";
import { PageIntro, Section, priceText } from "@/components/advising/AdvisingBlocks";
import { BookingPanel } from "@/components/advising/BookingPanel";
import { BOOKING } from "@/content/advising/config";
import { ACTIVE_SERVICES } from "@/content/advising/services";

export const metadata: Metadata = {
  title: "Book a conversation",
  description: "Book a one-to-one advising conversation with Fraz Ahmed about careers, admissions, scholarships or test preparation.",
};

const TOPICS = ACTIVE_SERVICES.map(({ id, topic }) => ({ id, topic }));

export default function BookPage() {
  return (
    <>
      <PageIntro
        label="advising / book"
        title="Book a conversation"
        lede={`${priceText()}. ${BOOKING.format}. Pick a topic, then choose a time with the booking provider.`}
      />

      <div className="grid grid-cols-[minmax(0,1fr)] gap-10 lg:grid-cols-[minmax(0,1.6fr)_minmax(0,1fr)]">
        <Suspense fallback={<p className="text-muted">Loading booking options…</p>}>
          <BookingPanel config={BOOKING} topics={TOPICS} />
        </Suspense>

        <aside className="flex flex-col gap-6">
          <Section id="prepare" index="01" title="Before we meet">
            <ul className="flex flex-col gap-2 text-sm leading-relaxed text-ink/90">
              <li>→ Use the planning tool on the relevant service page and copy its summary.</li>
              <li>→ Have any document you want feedback on open and ready to share on screen.</li>
              <li>→ Think about the one decision you most want help with.</li>
            </ul>
          </Section>
          <Section id="format" index="02" title="Format and changes">
            <ul className="flex flex-col gap-2 text-sm leading-relaxed text-ink/90">
              <li>→ {BOOKING.format}, {BOOKING.sessionMinutes} minutes.</li>
              {BOOKING.enabled ? (
                <>
                  <li>→ To cancel or reschedule, use the link in your booking confirmation email, or reply to it.</li>
                  <li>
                    → The booking provider collects your name, email, topic and an optional short question, and sends the
                    confirmation. This site doesn’t store them.
                  </li>
                </>
              ) : (
                <>
                  <li>→ For now, times are arranged by email. A time is confirmed only when I reply to agree it.</li>
                  <li>→ To change or cancel, reply to the same email thread.</li>
                </>
              )}
            </ul>
          </Section>
        </aside>
      </div>
    </>
  );
}

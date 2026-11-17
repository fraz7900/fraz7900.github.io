import type { Metadata } from "next";
import { Suspense } from "react";
import { PageIntro } from "@/components/advising/AdvisingBlocks";
import { BookingExperience } from "@/components/advising/booking/BookingExperience";
import { BOOKING_FOCUSES } from "@/content/advising/bookingFocus";
import { BOOKING } from "@/content/advising/config";
import { bookingState } from "@/lib/advising/booking";

export const metadata: Metadata = {
  title: "Book a conversation",
  description: "Book a one-to-one advising conversation with Fraz Ahmed about careers, admissions, scholarships or test preparation.",
};

export default function BookPage() {
  return (
    <>
      <PageIntro
        label="advising / book"
        title="A conversation. A clearer next step."
        lede="Let’s work through your career direction, applications, test preparation, or scholarship plans."
      />
      <Suspense fallback={<StaticBooking />}>
        <BookingExperience config={BOOKING} focuses={BOOKING_FOCUSES} />
      </Suspense>
    </>
  );
}

/**
 * Rendered into the static HTML and replaced once JavaScript runs. Without JavaScript it stays,
 * so it offers a working route on its own rather than saying "loading".
 */
function StaticBooking() {
  const state = bookingState(BOOKING);
  return (
    <div className="glass flex flex-col gap-3 rounded-xl p-5 sm:p-6">
      <p className="text-muted">
        {state.kind === "ready"
          ? "Choose a time on the booking page, and mention what you’d like to discuss in its form."
          : "Email me with what you’d like to discuss, and I’ll reply with times."}
      </p>
      <p>
        {state.kind === "ready" ? (
          <a href={state.bookingUrl} target="_blank" rel="noreferrer" className="btn-primary">
            Open the booking page <span aria-hidden="true">↗</span>
            <span className="sr-only">(opens in a new tab)</span>
          </a>
        ) : (
          <a href={BOOKING.fallback.href} className="btn-primary">
            {BOOKING.fallback.label}
          </a>
        )}
      </p>
    </div>
  );
}

/**
 * Advising configuration: booking provider, session format and pricing modes.
 * Edit this file to switch booking on, change provider, or introduce paid sessions later.
 * See docs/advising-setup.md before changing anything here.
 */

import { SOCIAL_LINKS } from "@/content/site";

export type PricingMode = "free" | "paid" | "contact";

export interface Pricing {
  readonly mode: PricingMode;
  /** Only for mode "paid". Amount in the currency's major unit, e.g. 40 = 40.00. */
  readonly amount?: number;
  /** ISO 4217 code, required with `amount`. */
  readonly currency?: string;
}

export type BookingProvider = "google-calendar" | "calendly";

export interface BookingConfig {
  /** Master switch. Keep false until a real, tested booking page exists. */
  readonly enabled: boolean;
  readonly provider: BookingProvider | null;
  /** Public booking page URL from the provider (the same link you share directly). */
  readonly bookingUrl: string | null;
  /** Official embed URL from the provider's own share/embed option; null to show only the link. */
  readonly embedUrl: string | null;
  /**
   * Calendly only: the documented custom-answer parameter (e.g. "a1") whose question is "Topic".
   * Google appointment schedules have no documented prefill, so leave null for Google.
   */
  readonly topicParam: string | null;
  readonly sessionMinutes: number;
  readonly format: string;
  readonly pricing: Pricing;
  /** Shown under the session details, e.g. how sessions are recorded. null to show nothing. */
  readonly sessionNote: string | null;
  /** Shown whenever online booking is unavailable. Must be a verified contact route. */
  readonly fallback: { readonly label: string; readonly href: string };
}

const EMAIL = SOCIAL_LINKS.find((link) => link.href.startsWith("mailto:"));
if (!EMAIL) throw new Error("advising/config: a verified email link is required in SOCIAL_LINKS for the booking fallback");

export const BOOKING: BookingConfig = {
  enabled: true,
  provider: "google-calendar",
  bookingUrl: "https://calendar.app.google/bvLSH73fMxBTyPsx8",
  embedUrl: "https://calendar.google.com/calendar/appointments/schedules/AcZssZ0sZlEKmrmLWtAVbbtzMrKPdD2xTpDZgFGd2NR9JJkPNygYkEuwlWUFyfbn6h7W_Ps6b72f4sip?gv=true",
  topicParam: null,
  sessionMinutes: 30,
  format: "One-to-one video call (Google Meet)",
  pricing: { mode: "free" },
  sessionNote: "Sessions are recorded and summarised with Gemini notes so I can follow up accurately. You’ll be asked for consent before we begin.",
  fallback: { label: "Email me to arrange a time", href: `${EMAIL.href}?subject=Advising%20conversation` },
};

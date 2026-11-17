/**
 * Pure logic behind the booking page: progress steps, session facts and the email fallback link.
 * The progress never reaches "confirmed": only the booking provider (or an email reply) confirms.
 */

import type { BookingConfig, Pricing } from "@/content/advising/config";
import type { BookingState } from "./booking";

export type StepStatus = "done" | "current" | "upcoming";

export interface StepView {
  readonly label: string;
  readonly status: StepStatus;
  /** Where the step happens, e.g. "in the calendar" or "by email". */
  readonly note: string;
}

export function bookingSteps(focusChosen: boolean, booking: BookingState["kind"]): readonly StepView[] {
  const online = booking === "ready";
  return [
    { label: "Choose focus", status: focusChosen ? "done" : "current", note: "" },
    { label: "Pick time", status: focusChosen ? "current" : "upcoming", note: online ? "in the calendar" : "by email" },
    { label: "Confirm", status: "upcoming", note: online ? "by the provider’s email" : "when I reply" },
  ];
}

export interface SessionFact {
  readonly term: string;
  readonly detail: string;
}

/** Duration, format and cost, all from configuration. */
export function sessionFacts(config: Pick<BookingConfig, "sessionMinutes" | "format" | "pricing">): readonly SessionFact[] {
  return [
    { term: "Duration", detail: `${config.sessionMinutes} minutes` },
    { term: "Format", detail: config.format },
    { term: "Cost", detail: costText(config.pricing) },
  ];
}

export function costText(pricing: Pricing): string {
  if (pricing.mode === "free") return "Currently free";
  if (pricing.mode === "paid" && pricing.amount !== undefined && pricing.currency) {
    return new Intl.NumberFormat("en-US", { style: "currency", currency: pricing.currency }).format(pricing.amount);
  }
  return "Ask about pricing";
}

/**
 * Adds the chosen focus to the fallback email's subject. Only the focus name is added,
 * never anything the visitor typed.
 */
export function fallbackHref(href: string, focusTitle?: string): string {
  if (!focusTitle) return href;
  const match = /([?&]subject=)([^&]*)/.exec(href);
  if (!match) {
    const separator = href.includes("?") ? "&" : "?";
    return `${href}${separator}subject=${encodeURIComponent(focusTitle)}`;
  }
  const subject = `${decodeURIComponent(match[2])}: ${focusTitle}`;
  return href.replace(match[0], `${match[1]}${encodeURIComponent(subject)}`);
}

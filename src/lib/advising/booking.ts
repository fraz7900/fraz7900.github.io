import type { BookingConfig } from "@/content/advising/config";

/** Official URL prefixes for each provider; anything else is treated as misconfigured. */
const ALLOWED_PREFIXES: Record<NonNullable<BookingConfig["provider"]>, readonly string[]> = {
  "google-calendar": ["https://calendar.google.com/calendar/appointments/", "https://calendar.app.google/"],
  calendly: ["https://calendly.com/"],
};

export type BookingState =
  | { readonly kind: "ready"; readonly bookingUrl: string; readonly embedUrl: string | null }
  | { readonly kind: "disabled" }
  | { readonly kind: "misconfigured"; readonly reason: string };

export function bookingState(config: BookingConfig): BookingState {
  if (!config.enabled) return { kind: "disabled" };
  if (!config.provider) return { kind: "misconfigured", reason: "No provider is set." };
  const allowed = ALLOWED_PREFIXES[config.provider];
  if (!config.bookingUrl || !allowed.some((prefix) => config.bookingUrl!.startsWith(prefix))) {
    return { kind: "misconfigured", reason: "The booking URL is missing or isn’t from the provider." };
  }
  if (config.embedUrl && !allowed.some((prefix) => config.embedUrl!.startsWith(prefix))) {
    return { kind: "misconfigured", reason: "The embed URL isn’t from the provider." };
  }
  if (config.topicParam && config.provider !== "calendly") {
    return { kind: "misconfigured", reason: "Topic prefill is only documented for Calendly." };
  }
  return { kind: "ready", bookingUrl: config.bookingUrl, embedUrl: config.embedUrl };
}

/**
 * Link to the provider's booking page. A topic is added only through Calendly's documented
 * custom-answer parameter; it carries the service name, never a visitor's own answers.
 */
export function bookingHref(config: BookingConfig, topic?: string): string | null {
  const state = bookingState(config);
  if (state.kind !== "ready") return null;
  if (!topic || !config.topicParam) return state.bookingUrl;
  const url = new URL(state.bookingUrl);
  url.searchParams.set(config.topicParam, topic);
  return url.toString();
}

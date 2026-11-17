import type { BookingConfig } from "@/content/advising/config";

/** Official URL prefixes for each provider; anything else is treated as misconfigured. */
const ALLOWED_PREFIXES: Record<NonNullable<BookingConfig["provider"]>, readonly string[]> = {
  "google-calendar": ["https://calendar.google.com/calendar/appointments/", "https://calendar.app.google/"],
  calendly: ["https://calendly.com/"],
};

/**
 * Embeds must use the provider's frameable address. Google's calendar.app.google short link redirects
 * and can't be framed, so only the appointments URL from Google's own embed code is accepted.
 */
const EMBED_PREFIXES: Record<NonNullable<BookingConfig["provider"]>, readonly string[]> = {
  "google-calendar": ["https://calendar.google.com/calendar/appointments/"],
  calendly: ["https://calendly.com/"],
};

export type BookingState =
  | { readonly kind: "ready"; readonly bookingUrl: string; readonly embedUrl: string | null }
  | { readonly kind: "disabled" }
  | { readonly kind: "misconfigured"; readonly reason: string };

/** Placeholder text copied from the setup guide, such as "…" or "...". */
const PLACEHOLDER = /…|\.\.\.|<|>|REPLACE|YOUR[-_ ]?/i;

/** A real provider address: one of its prefixes, followed by an actual ID, with no placeholder text. */
function isProviderUrl(url: string, prefixes: readonly string[]): boolean {
  const prefix = prefixes.find((candidate) => url.startsWith(candidate));
  if (!prefix || url.length <= prefix.length || PLACEHOLDER.test(url)) return false;
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
}

export function bookingState(config: BookingConfig): BookingState {
  if (!config.enabled) return { kind: "disabled" };
  if (!config.provider) return { kind: "misconfigured", reason: "No provider is set." };
  const allowed = ALLOWED_PREFIXES[config.provider];
  if (!config.bookingUrl || !isProviderUrl(config.bookingUrl, allowed)) {
    return { kind: "misconfigured", reason: "The booking URL is missing, still a placeholder, or isn’t from the provider." };
  }
  if (config.embedUrl && !isProviderUrl(config.embedUrl, EMBED_PREFIXES[config.provider])) {
    return { kind: "misconfigured", reason: "The embed URL isn’t the provider’s embed address (use the src from its embed code)." };
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
  return withTopic(state.bookingUrl, config.topicParam, topic);
}

/** The embed address, carrying the topic the same way as the direct link so both say the same thing. */
export function embedSrc(config: BookingConfig, topic?: string): string | null {
  const state = bookingState(config);
  if (state.kind !== "ready" || !state.embedUrl) return null;
  return withTopic(state.embedUrl, config.topicParam, topic);
}

function withTopic(address: string, topicParam: string | null, topic?: string): string {
  if (!topic || !topicParam) return address;
  const url = new URL(address);
  url.searchParams.set(topicParam, topic);
  return url.toString();
}

"use client";

import { useSearchParams } from "next/navigation";
import { useState } from "react";
import type { BookingConfig } from "@/content/advising/config";
import { bookingHref, bookingState } from "@/lib/advising/booking";

interface TopicOption {
  readonly id: string;
  readonly topic: string;
}

/**
 * The booking boundary. With a configured provider it shows the provider's own embed plus a
 * persistent direct link; the provider owns availability, time zones and confirmation.
 * Without one, it shows the verified contact fallback. It never simulates time slots.
 */
export function BookingPanel({ config, topics }: { config: BookingConfig; topics: readonly TopicOption[] }) {
  const params = useSearchParams();
  const requested = params.get("topic");
  const [topicId, setTopicId] = useState(() => (topics.some((t) => t.id === requested) ? (requested as string) : ""));
  const [embedLoaded, setEmbedLoaded] = useState(false);
  const state = bookingState(config);
  const topic = topics.find((t) => t.id === topicId)?.topic;
  const directHref = bookingHref(config, topic);

  return (
    <div className="flex flex-col gap-6">
      <fieldset className="glass min-w-0 rounded-xl p-5">
        <legend className="px-1 text-sm font-medium text-ink">What would you like to talk about?</legend>
        <div className="mt-2 flex flex-wrap gap-2">
          {topics.map((option) => (
            <label key={option.id} className="cursor-pointer rounded-full border border-line-strong px-3 py-1.5 text-sm text-ink/90 has-[:checked]:border-accent has-[:checked]:bg-accent-soft has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-accent">
              <input type="radio" name="booking-topic" value={option.id} checked={topicId === option.id} onChange={() => setTopicId(option.id)} className="sr-only" />
              {option.topic}
            </label>
          ))}
        </div>
        <p className="mt-3 text-xs text-muted">
          {config.topicParam
            ? "Your topic is passed to the booking form."
            : "Choose the same topic in the booking form, and paste the summary from a planning tool into its question box if you have one."}
        </p>
      </fieldset>

      {state.kind === "ready" && directHref ? (
        <div className="flex flex-col gap-4">
          <p className="flex flex-wrap items-center gap-3">
            <a href={directHref} target="_blank" rel="noreferrer" className="btn-primary">
              Open the booking page
            </a>
            <span className="text-sm text-muted">Times are shown in your time zone by the booking provider.</span>
          </p>
          {state.embedUrl && (
            <div className="glass relative overflow-hidden rounded-xl">
              {!embedLoaded && (
                <p role="status" className="absolute inset-0 flex items-center justify-center text-sm text-muted">
                  Loading the booking calendar… If it doesn’t appear, use the button above.
                </p>
              )}
              <iframe
                src={state.embedUrl}
                title="Book a conversation (scheduling provider)"
                loading="lazy"
                onLoad={() => setEmbedLoaded(true)}
                className="relative h-[680px] w-full border-0 bg-white"
              />
            </div>
          )}
          <p className="text-xs text-faint">
            Your booking is confirmed only by the provider’s confirmation screen and email, not by this page.
          </p>
        </div>
      ) : (
        <div className="glass flex flex-col gap-3 rounded-xl border-l-2 border-l-amber p-5">
          <p className="font-medium text-ink">Online booking isn’t open yet.</p>
          <p className="text-sm leading-relaxed text-muted">
            Email me with your topic and a few lines about what you’d like to discuss, and I’ll reply with times. No
            appointment exists until we’ve agreed a time.
          </p>
          <p>
            <a href={config.fallback.href} className="btn-primary">
              {config.fallback.label}
            </a>
          </p>
          {state.kind === "misconfigured" && process.env.NODE_ENV !== "production" && (
            <p className="text-xs text-danger">Booking configuration problem (shown in development only): {state.reason}</p>
          )}
        </div>
      )}
    </div>
  );
}

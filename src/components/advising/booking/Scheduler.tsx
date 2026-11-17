"use client";

import { useEffect, useRef, useState } from "react";
import { SectionLabel } from "@/components/SectionLabel";
import type { BookingFocus } from "@/content/advising/bookingFocus";
import type { BookingConfig } from "@/content/advising/config";
import { bookingHref, embedSrc, type BookingState } from "@/lib/advising/booking";
import { fallbackHref } from "@/lib/advising/bookingFlow";

/** Once the calendar is on screen, after this long without a load event offer the alternatives. */
const SLOW_LOAD_MS = 20_000;
const COPY_FEEDBACK_MS = 2_000;
const PROVIDER_NAMES: Record<NonNullable<BookingConfig["provider"]>, string> = {
  "google-calendar": "Google Calendar",
  calendly: "Calendly",
};

/**
 * The booking boundary. With a configured provider: an always-visible direct link and the provider's own
 * embed, which owns availability, time zones and confirmation. Without one: the verified email fallback.
 * Nothing here simulates time slots or confirms a booking.
 */
export function Scheduler({ config, state, focus }: { config: BookingConfig; state: BookingState; focus: BookingFocus | null }) {
  if (state.kind !== "ready") return <EmailFallback config={config} state={state} focus={focus} />;
  const provider = config.provider ? PROVIDER_NAMES[config.provider] : "the booking provider";
  const href = bookingHref(config, focus?.title) ?? state.bookingUrl;
  const src = embedSrc(config, focus?.title);
  const email = fallbackHref(config.fallback.href, focus?.title);

  return (
    <section id="book-time" aria-labelledby="time-heading" className="glass scroll-mt-28 rounded-xl p-5 sm:p-6">
      <SectionLabel index="03">pick a time</SectionLabel>
      <h2 id="time-heading" className="mt-3 font-display text-2xl font-semibold tracking-tight text-ink">
        Pick a time
      </h2>
      <p className="mt-2 leading-relaxed text-muted">
        Times appear in your own time zone. Availability and confirmation are handled by {provider}.
      </p>
      <p className="mt-4">
        <a href={href} target="_blank" rel="noreferrer" className="btn-primary">
          Open the booking page <span aria-hidden="true">↗</span>
          <span className="sr-only">(opens in a new tab)</span>
        </a>
      </p>
      {focus && <FocusHint config={config} focus={focus} />}

      {src &&
        (focus ? (
          <>
            <ProviderEmbed key={src} src={src} provider={provider} email={email} />
            <p className="mt-3 text-sm text-muted">
              Calendar not showing? Use “Open the booking page” above, or{" "}
              <a href={email} className="link-accent">
                email me
              </a>
              .
            </p>
          </>
        ) : (
          <p className="mt-5 rounded-lg border border-dashed border-line-strong px-4 py-8 text-center text-sm text-muted">
            Choose a focus to open the calendar here, or use the booking page link above.
          </p>
        ))}

      <ul className="mt-5 flex flex-col gap-1.5 text-xs leading-relaxed text-faint">
        <li>Your booking is confirmed only by {provider}’s confirmation screen and email, not by this page.</li>
        <li>To cancel or reschedule, use the link in your confirmation email.</li>
        <li>{provider} collects your name, email and answers to send the confirmation. This site doesn’t store them.</li>
      </ul>
    </section>
  );
}

/** Calendly receives the focus through its documented parameter; Google can't, so it's offered to copy. */
function FocusHint({ config, focus }: { config: BookingConfig; focus: BookingFocus }) {
  if (config.topicParam) {
    return <p className="mt-3 text-sm text-muted">Your focus, {focus.title}, is filled in on the booking form for you.</p>;
  }
  return (
    <p className="mt-4 flex flex-wrap items-center gap-x-3 gap-y-2 rounded-lg border border-line bg-card/50 px-3 py-2 text-sm">
      <span className="text-muted">In the booking form, enter your focus:</span>
      <span className="font-mono text-ink">{focus.title}</span>
      <CopyButton key={focus.title} text={focus.title} />
    </p>
  );
}

function CopyButton({ text }: { text: string }) {
  const [status, setStatus] = useState<"idle" | "copied" | "failed">("idle");
  const resetTimer = useRef<number | undefined>(undefined);
  useEffect(() => () => window.clearTimeout(resetTimer.current), []);

  async function copy() {
    window.clearTimeout(resetTimer.current);
    try {
      await navigator.clipboard.writeText(text);
      setStatus("copied");
      resetTimer.current = window.setTimeout(() => setStatus("idle"), COPY_FEEDBACK_MS);
    } catch {
      setStatus("failed");
    }
  }

  return (
    <>
      <button
        type="button"
        onClick={copy}
        aria-label={`Copy focus name: ${text}`}
        className="rounded-md border border-line-strong px-2 py-0.5 font-mono text-xs text-accent hover:border-accent"
      >
        {status === "copied" ? "copied" : "copy"}
      </button>
      <span role="status" className={status === "failed" ? "text-xs text-muted" : "sr-only"}>
        {status === "copied" ? `${text} copied` : status === "failed" ? "Copying isn’t available here; please type it in." : ""}
      </span>
    </>
  );
}

function ProviderEmbed({ src, provider, email }: { src: string; provider: string; email: string }) {
  const [status, setStatus] = useState<"loading" | "ready" | "slow">("loading");
  const frameBox = useRef<HTMLDivElement>(null);

  // The iframe is lazy, so the slow-load timer starts only once it is actually on screen.
  useEffect(() => {
    const box = frameBox.current;
    if (!box) return;
    let timer: number | undefined;
    const observer = new IntersectionObserver((entries) => {
      if (!entries.some((entry) => entry.isIntersecting) || timer !== undefined) return;
      timer = window.setTimeout(() => setStatus((current) => (current === "loading" ? "slow" : current)), SLOW_LOAD_MS);
      observer.disconnect();
    });
    observer.observe(box);
    return () => {
      observer.disconnect();
      window.clearTimeout(timer);
    };
  }, []);

  return (
    <div ref={frameBox} className="relative mt-5 overflow-hidden rounded-lg border border-line bg-white">
      {status !== "ready" && (
        <div role="status" className="absolute inset-0 flex items-center justify-center bg-card p-6 text-center text-sm leading-relaxed text-muted">
          {status === "loading" ? (
            <span>
              Loading {provider}
              <span className="motion-safe:animate-blink">…</span>
            </span>
          ) : (
            <span>
              The calendar is taking longer than usual to load. Use “Open the booking page” above, or{" "}
              <a href={email} className="link-accent">
                email me
              </a>{" "}
              to arrange a time.
            </span>
          )}
        </div>
      )}
      <iframe
        src={src}
        title={`Booking calendar (${provider})`}
        loading="lazy"
        onLoad={() => setStatus("ready")}
        className="block h-[min(720px,85dvh)] w-full border-0"
      />
    </div>
  );
}

function EmailFallback({ config, state, focus }: { config: BookingConfig; state: BookingState; focus: BookingFocus | null }) {
  return (
    <section id="book-time" aria-labelledby="time-heading" className="glass scroll-mt-28 rounded-xl border-l-2 border-l-amber p-5 sm:p-6">
      <SectionLabel index="03">pick a time</SectionLabel>
      <h2 id="time-heading" className="mt-3 font-display text-2xl font-semibold tracking-tight text-ink">
        Online booking isn’t open yet
      </h2>
      <p className="mt-2 leading-relaxed text-muted">
        Email me with {focus ? "your focus" : "the focus you’d like"} and a few lines about what you’d like to discuss, and
        I’ll reply with times. No appointment exists until we’ve agreed a time.
      </p>
      <p className="mt-4">
        <a href={fallbackHref(config.fallback.href, focus?.title)} className="btn-primary">
          {config.fallback.label}
        </a>
      </p>
      <p className="mt-4 text-xs leading-relaxed text-faint">To change or cancel, reply to the same email thread.</p>
      {state.kind === "misconfigured" && process.env.NODE_ENV !== "production" && (
        <p className="mt-3 text-xs text-danger">Booking configuration problem (shown in development only): {state.reason}</p>
      )}
    </section>
  );
}

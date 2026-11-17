"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { focusById, type BookingFocus, type FocusId } from "@/content/advising/bookingFocus";
import type { BookingConfig } from "@/content/advising/config";
import { bookingState } from "@/lib/advising/booking";
import { bookingSteps } from "@/lib/advising/bookingFlow";
import { BookingProgress } from "./BookingProgress";
import { FocusPicker } from "./FocusPicker";
import { Scheduler } from "./Scheduler";
import { SessionSummary } from "./SessionSummary";

const TOPIC_PARAM = "topic";
/** Arrowing through the cards selects each one; announce only where the visitor settles. */
const ANNOUNCE_DELAY_MS = 700;

/**
 * Left: choose the conversation. Right: review the session and pick a time.
 * The URL (?topic=…) is the single source of truth: direct links preselect a focus, Back/Forward and
 * in-site links to another topic are reflected immediately, and a shared link shows what you saw.
 */
export function BookingExperience({ config, focuses }: { config: BookingConfig; focuses: readonly BookingFocus[] }) {
  const params = useSearchParams();
  const focusId = focusById(params.get(TOPIC_PARAM))?.id ?? null;
  const focus = focuses.find((f) => f.id === focusId) ?? null;
  const state = bookingState(config);
  const [announcement, setAnnouncement] = useState("");
  const announceTimer = useRef<number | undefined>(undefined);
  useEffect(() => () => window.clearTimeout(announceTimer.current), []);

  function choose(id: FocusId) {
    const next = new URLSearchParams(window.location.search);
    next.set(TOPIC_PARAM, id);
    // Next.js syncs history.replaceState into useSearchParams, so this re-renders with the new focus.
    window.history.replaceState(null, "", `?${next.toString()}${window.location.hash}`);
    window.clearTimeout(announceTimer.current);
    announceTimer.current = window.setTimeout(
      () => setAnnouncement(`Session details updated for ${focusById(id)?.title ?? "your focus"}.`),
      ANNOUNCE_DELAY_MS,
    );
  }

  return (
    <div className="flex flex-col gap-8">
      <BookingProgress steps={bookingSteps(focus !== null, state.kind)} />
      <div className="grid grid-cols-[minmax(0,1fr)] gap-10 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)]">
        <div className="flex flex-col gap-4">
          <FocusPicker focuses={focuses} selected={focusId} onSelect={choose} />
          {focus && (
            <a href="#book-time" className="link-accent w-max font-mono text-xs lg:hidden">
              next: pick a time ↓
            </a>
          )}
        </div>
        <div className="flex min-w-0 flex-col gap-6">
          <SessionSummary focus={focus} config={config} />
          <Scheduler config={config} state={state} focus={focus} />
        </div>
      </div>
      <p className="sr-only" aria-live="polite">
        {announcement}
      </p>
    </div>
  );
}

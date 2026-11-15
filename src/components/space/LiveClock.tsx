"use client";

import { useSyncExternalStore } from "react";

const formatter = new Intl.DateTimeFormat("en-US", {
  timeZone: "America/New_York",
  hour: "2-digit",
  minute: "2-digit",
  second: "2-digit",
  hourCycle: "h23",
});

const subscribe = (onTick: () => void) => {
  const id = window.setInterval(onTick, 1000);
  return () => window.clearInterval(id);
};
const getTime = () => formatter.format(new Date());
const getServerTime = () => "";

/** Live Eastern-time clock for the footer (Carnegie Mellon’s time zone). */
export function LiveClock() {
  const time = useSyncExternalStore(subscribe, getTime, getServerTime);

  return (
    <span className="inline-flex items-center gap-2">
      <span aria-hidden="true" className="size-1.5 rounded-full bg-accent shadow-[0_0_8px] shadow-accent" />
      <span>Eastern time</span>
      <time className="min-w-[8ch] tabular-nums text-accent">{time}</time>
    </span>
  );
}

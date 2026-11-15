"use client";

import { useState, useSyncExternalStore } from "react";

const MINUTE_MS = 60_000;

/**
 * Current time for status display without hydration mismatches: the server snapshot is the
 * build time (what the static HTML was rendered with); after hydration the client's clock takes over.
 */
export function useNow(buildTimeMs: number): number {
  return useSyncExternalStore(
    (onChange) => {
      const id = window.setInterval(onChange, MINUTE_MS);
      return () => window.clearInterval(id);
    },
    () => Math.floor(Date.now() / MINUTE_MS) * MINUTE_MS,
    () => buildTimeMs,
  );
}

function download(filename: string, content: string, type: string) {
  const url = URL.createObjectURL(new Blob([content], { type }));
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
}

/** Copy / download buttons for a plain-text summary that never leaves the browser otherwise. */
export function CopyDownload({ text, filename }: { text: string; filename: string }) {
  const [status, setStatus] = useState("");

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setStatus("Summary copied.");
    } catch {
      setStatus("Copy didn’t work in this browser. Use Download instead.");
    }
  };

  return (
    <div className="flex flex-wrap items-center gap-3">
      <button type="button" onClick={copy} className="btn-ghost text-sm">
        Copy summary
      </button>
      <button type="button" onClick={() => download(filename, text, "text/plain;charset=utf-8")} className="btn-ghost text-sm">
        Download .txt
      </button>
      <span role="status" className="text-sm text-muted">
        {status}
      </span>
    </div>
  );
}

export function downloadFile(filename: string, content: string, type: string) {
  download(filename, content, type);
}

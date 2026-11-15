"use client";

import { useEffect, useState } from "react";
import { READINESS_GROUPS, READINESS_STORAGE_KEY, parseStored, progressOf } from "@/lib/advising/readiness";

function readStorage(): Set<string> | null {
  try {
    const raw = window.localStorage.getItem(READINESS_STORAGE_KEY);
    return raw === null ? null : parseStored(raw);
  } catch {
    return null;
  }
}

/** Application readiness checklist. Progress = tasks done; saving to this device is opt-in. */
export function ReadinessChecklist() {
  const [done, setDone] = useState<ReadonlySet<string>>(new Set());
  const [save, setSave] = useState(false);
  const [notice, setNotice] = useState("");

  // Restore only if the visitor previously opted in (the key exists only then).
  useEffect(() => {
    const stored = readStorage();
    if (stored === null) return;
    // eslint-disable-next-line react-hooks/set-state-in-effect -- one-time restore from the browser after hydration
    setDone(stored);
    setSave(true);
  }, []);

  const persist = (next: ReadonlySet<string>, enabled: boolean) => {
    try {
      if (enabled) window.localStorage.setItem(READINESS_STORAGE_KEY, JSON.stringify([...next]));
      else window.localStorage.removeItem(READINESS_STORAGE_KEY);
    } catch {
      setNotice("This browser blocked saving, so progress will last only while the page is open.");
    }
  };

  const toggle = (id: string) => {
    const next = new Set(done);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    setDone(next);
    persist(next, save);
  };

  const progress = progressOf(done);

  return (
    <div className="glass flex flex-col gap-6 rounded-xl p-5 sm:p-6">
      <div className="flex flex-col gap-2">
        <div className="flex flex-wrap items-baseline justify-between gap-2">
          <p className="font-display text-2xl font-semibold text-ink">
            {progress.done} of {progress.total} tasks done
          </p>
          <p className="font-mono text-sm text-accent">{progress.percent}%</p>
        </div>
        <div
          role="progressbar"
          aria-label="Checklist tasks completed"
          aria-valuemin={0}
          aria-valuemax={progress.total}
          aria-valuenow={progress.done}
          aria-valuetext={`${progress.done} of ${progress.total} tasks done`}
          className="h-2 overflow-hidden rounded-full bg-line"
        >
          <div className="h-full rounded-full bg-gradient-to-r from-accent to-sky transition-[width] duration-300" style={{ width: `${progress.percent}%` }} />
        </div>
        <p className="text-xs text-faint">This measures tasks you’ve completed, not your chances of admission.</p>
      </div>

      <div className="grid grid-cols-[minmax(0,1fr)] gap-5 md:grid-cols-2">
        {READINESS_GROUPS.map((group, index) => {
          const groupProgress = progress.byGroup[index];
          return (
            <fieldset key={group.id} className="min-w-0 rounded-lg border border-line p-4">
              <legend className="px-1 font-mono text-xs text-accent">
                {group.title.toLowerCase()} · {groupProgress.done}/{groupProgress.total}
              </legend>
              <ul className="flex flex-col gap-2">
                {group.items.map((item) => (
                  <li key={item.id}>
                    <label className="flex cursor-pointer items-start gap-3 text-sm text-ink/90">
                      <input
                        type="checkbox"
                        checked={done.has(item.id)}
                        onChange={() => toggle(item.id)}
                        className="mt-0.5 size-4 shrink-0 accent-[var(--color-accent)]"
                      />
                      <span className={done.has(item.id) ? "text-muted line-through" : undefined}>{item.label}</span>
                    </label>
                  </li>
                ))}
              </ul>
            </fieldset>
          );
        })}
      </div>

      <div className="flex flex-wrap items-center gap-4 border-t border-line pt-5 text-sm">
        <label className="flex cursor-pointer items-center gap-2 text-ink/90">
          <input
            type="checkbox"
            checked={save}
            onChange={(event) => {
              setSave(event.target.checked);
              persist(done, event.target.checked);
              setNotice(event.target.checked ? "Progress will be saved in this browser only." : "Saved progress removed from this browser.");
            }}
            className="size-4 accent-[var(--color-accent)]"
          />
          Save my progress on this device
        </label>
        <button
          type="button"
          onClick={() => {
            setDone(new Set());
            persist(new Set(), save);
            setNotice("Checklist reset.");
          }}
          className="btn-ghost text-sm"
        >
          Reset checklist
        </button>
        <span role="status" className="text-muted">
          {notice}
        </span>
      </div>
    </div>
  );
}

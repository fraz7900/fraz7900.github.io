"use client";

import { useRouter } from "next/navigation";
import { useCallback, useEffect, useId, useRef, useState, useSyncExternalStore } from "react";
import { HOME_ITEM, NAV_ITEMS, type NavItem } from "@/content/site";
import { searchPages } from "@/lib/searchPages";

const PAGES: readonly NavItem[] = [HOME_ITEM, ...NAV_ITEMS];
const APPLE_PLATFORM = /Mac|iPhone|iPad|iPod/;

const subscribeNothing = () => () => {};
const getShortcutLabel = () => (APPLE_PLATFORM.test(navigator.userAgent) ? "⌘K" : "Ctrl K");
const getServerShortcutLabel = () => "Ctrl K";

export function CommandMenu() {
  const router = useRouter();
  const dialogRef = useRef<HTMLDialogElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const openerRef = useRef<HTMLElement | null>(null);
  const [query, setQuery] = useState("");
  const [activeIndex, setActiveIndex] = useState(0);
  const shortcutLabel = useSyncExternalStore(
    subscribeNothing,
    getShortcutLabel,
    getServerShortcutLabel,
  );
  const listId = useId();
  const results = searchPages(PAGES, query);
  const safeIndex = Math.min(activeIndex, Math.max(results.length - 1, 0));

  const open = useCallback(() => {
    const dialog = dialogRef.current;
    if (!dialog || dialog.open) return;
    openerRef.current = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    setQuery("");
    setActiveIndex(0);
    dialog.showModal();
    inputRef.current?.focus();
  }, []);

  const close = useCallback(() => dialogRef.current?.close(), []);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (!(event.metaKey || event.ctrlKey) || event.key.toLowerCase() !== "k") return;
      event.preventDefault();
      if (dialogRef.current?.open) close();
      else open();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open, close]);

  const goTo = (page: NavItem | undefined) => {
    if (!page) return;
    close();
    router.push(page.href);
  };

  const onInputKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    const last = results.length - 1;
    const moves: Record<string, number> = {
      ArrowDown: safeIndex >= last ? 0 : safeIndex + 1,
      ArrowUp: safeIndex <= 0 ? last : safeIndex - 1,
      Home: 0,
      End: last,
    };
    if (event.key in moves && results.length > 0) {
      event.preventDefault();
      setActiveIndex(moves[event.key]);
    } else if (event.key === "Enter") {
      event.preventDefault();
      goTo(results[safeIndex]);
    }
  };

  return (
    <>
      <button
        type="button"
        onClick={open}
        aria-haspopup="dialog"
        className="inline-flex items-center gap-2 rounded-md border border-line bg-card px-2.5 py-1.5 font-mono text-xs text-muted hover:border-ink hover:text-ink"
      >
        <span>Jump to</span>
        <kbd className="hidden rounded border border-line px-1 py-px text-[0.7rem] sm:inline">
          {shortcutLabel}
        </kbd>
      </button>

      <dialog
        ref={dialogRef}
        aria-label="Jump to a page"
        onClose={() => openerRef.current?.focus()}
        onClick={(event) => {
          if (event.target === event.currentTarget) close();
        }}
        className="command-menu"
      >
        <div className="flex flex-col">
          <label htmlFor={`${listId}-input`} className="sr-only">
            Search pages
          </label>
          <input
            ref={inputRef}
            id={`${listId}-input`}
            type="text"
            role="combobox"
            aria-expanded="true"
            aria-controls={listId}
            aria-autocomplete="list"
            aria-activedescendant={results.length > 0 ? `${listId}-${safeIndex}` : undefined}
            placeholder="Search pages…"
            autoComplete="off"
            value={query}
            onChange={(event) => {
              setQuery(event.target.value);
              setActiveIndex(0);
            }}
            onKeyDown={onInputKeyDown}
            className="border-b border-line bg-transparent px-4 py-3 text-base text-ink placeholder:text-muted focus-visible:outline-none"
          />
          <ul id={listId} role="listbox" aria-label="Pages" className="max-h-72 overflow-y-auto p-2">
            {results.map((page, index) => (
              <li
                key={page.href}
                id={`${listId}-${index}`}
                role="option"
                aria-selected={index === safeIndex}
                onClick={() => goTo(page)}
                onMouseMove={() => setActiveIndex(index)}
                className="flex cursor-pointer flex-col rounded px-3 py-2 aria-selected:bg-accent-soft"
              >
                <span className="text-sm font-medium text-ink">{page.label}</span>
                <span className="text-xs text-muted">{page.description}</span>
              </li>
            ))}
          </ul>
          {results.length === 0 && (
            <p className="px-5 pb-4 text-sm text-muted" role="status">
              No pages match “{query}”.
            </p>
          )}
          <p className="border-t border-line px-4 py-2 font-mono text-[0.7rem] text-muted">
            ↑↓ to move · Enter to open · Esc to close
          </p>
        </div>
      </dialog>
    </>
  );
}

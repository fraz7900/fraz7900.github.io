"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { NAV_ITEMS } from "@/content/site";

/** The single nav item whose href (or activeFor prefix) is the longest match for the path. */
function currentHref(pathname: string): string | null {
  const path = pathname.endsWith("/") ? pathname : `${pathname}/`;
  let best: { href: string; length: number } | null = null;
  for (const item of NAV_ITEMS) {
    for (const prefix of [item.href, ...(item.activeFor ?? [])]) {
      if (path.startsWith(prefix) && (!best || prefix.length > best.length)) best = { href: item.href, length: prefix.length };
    }
  }
  return best?.href ?? null;
}

export function NavLinks() {
  const active = currentHref(usePathname());

  return (
    <ul className="flex flex-wrap items-center gap-x-5 gap-y-1 text-sm">
      {NAV_ITEMS.map((item) => {
        const current = item.href === active;
        return (
          <li key={item.href}>
            <Link
              href={item.href}
              aria-current={current ? "page" : undefined}
              className={`underline-offset-4 hover:underline ${
                current ? "text-ink underline decoration-accent decoration-2" : "text-muted"
              }`}
            >
              {item.label}
            </Link>
          </li>
        );
      })}
    </ul>
  );
}

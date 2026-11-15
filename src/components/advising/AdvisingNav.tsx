"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export const ADVISING_SECTIONS = [
  { href: "/advising/", label: "Overview" },
  { href: "/advising/career/", label: "Career" },
  { href: "/advising/admissions/", label: "Admissions" },
  { href: "/advising/test-prep/", label: "Test prep" },
  { href: "/advising/scholarships/", label: "Scholarships" },
  { href: "/advising/stories/", label: "Stories" },
  { href: "/advising/updates/", label: "Updates" },
  { href: "/advising/book/", label: "Book" },
] as const;

/** Section navigation for /advising/*: keeps service pages out of the top-level nav. */
export function AdvisingNav() {
  const pathname = usePathname();
  const normalized = pathname.endsWith("/") ? pathname : `${pathname}/`;
  const isCurrent = (href: string) => (href === "/advising/" ? normalized === href : normalized.startsWith(href));

  return (
    <nav aria-label="Advising" className="border-b border-line/70 bg-paper/50 backdrop-blur-sm">
      <ul className="page-container flex gap-1 overflow-x-auto py-2 font-mono text-xs">
        {ADVISING_SECTIONS.map((section) => {
          const current = isCurrent(section.href);
          return (
            <li key={section.href} className="shrink-0">
              <Link
                href={section.href}
                aria-current={current ? "page" : undefined}
                className={`inline-block rounded-md px-2.5 py-1.5 transition-colors ${
                  current ? "bg-accent-soft text-accent" : "text-muted hover:text-ink"
                }`}
              >
                {section.label.toLowerCase()}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}

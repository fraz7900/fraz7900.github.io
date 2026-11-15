"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { NAV_ITEMS } from "@/content/site";

function isCurrent(pathname: string, href: string): boolean {
  const normalized = pathname.endsWith("/") ? pathname : `${pathname}/`;
  return normalized === href || normalized.startsWith(href);
}

export function NavLinks() {
  const pathname = usePathname();

  return (
    <ul className="flex flex-wrap items-center gap-x-5 gap-y-1 text-sm">
      {NAV_ITEMS.map((item) => {
        const current = isCurrent(pathname, item.href);
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

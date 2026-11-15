import Link from "next/link";
import { SITE } from "@/content/site";
import { CommandMenu } from "./CommandMenu";
import { NavLinks } from "./NavLinks";

export function SiteHeader() {
  return (
    <header className="border-b border-line">
      <nav
        aria-label="Primary"
        className="page-container flex flex-wrap items-center justify-between gap-x-6 gap-y-3 py-4"
      >
        <Link href="/" className="flex items-baseline gap-2 text-ink">
          <span className="font-display text-2xl leading-none">{SITE.name}</span>
          <span className="hidden font-mono text-xs text-muted sm:inline">/ strategy · analytics</span>
        </Link>
        <div className="flex flex-wrap items-center gap-x-5 gap-y-2">
          <NavLinks />
          {SITE.resumeHref && (
            <a href={SITE.resumeHref} className="link-accent text-sm">
              Résumé
            </a>
          )}
          <CommandMenu />
        </div>
      </nav>
    </header>
  );
}

import { SITE } from "@/content/site";
import { CommandMenu } from "./CommandMenu";
import { AutoHideHeader } from "./motion/AutoHideHeader";
import { NavLinks } from "./NavLinks";
import { TerminalLogo } from "./space/TerminalLogo";

export function SiteHeader() {
  return (
    <AutoHideHeader>
      <nav aria-label="Primary" className="page-container flex flex-wrap items-center justify-between gap-x-6 gap-y-3 py-3.5">
        <TerminalLogo />
        <div className="flex flex-wrap items-center gap-x-5 gap-y-2">
          <NavLinks />
          {SITE.resumeHref && (
            <a href={SITE.resumeHref} className="text-sm text-muted hover:text-ink">
              CV
            </a>
          )}
          <CommandMenu />
        </div>
      </nav>
    </AutoHideHeader>
  );
}

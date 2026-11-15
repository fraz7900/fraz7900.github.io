import { SITE, SOCIAL_LINKS } from "@/content/site";
import { LiveClock } from "./space/LiveClock";

export function SiteFooter() {
  return (
    <footer className="mt-auto border-t border-line/80 bg-paper/60 backdrop-blur-sm">
      <div className="page-container flex flex-col gap-4 py-8 text-sm sm:flex-row sm:items-center sm:justify-between">
        {SOCIAL_LINKS.length > 0 ? (
          <ul className="flex flex-wrap gap-x-5 gap-y-2">
            {SOCIAL_LINKS.map((link) => (
              <li key={link.href}>
                <a href={link.href} className="text-muted hover:text-ink">
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        ) : (
          <p data-to-confirm="social-links" className="rounded border border-dashed border-amber/60 px-2 py-1 text-xs text-amber">
            To confirm: email, LinkedIn and GitHub links
          </p>
        )}
        <p className="flex flex-wrap items-center gap-x-3 gap-y-1 font-mono text-xs text-faint">
          <span>
            © {SITE.copyrightYear} {SITE.name}
          </span>
          <span aria-hidden="true">·</span>
          <span>Press Ctrl/⌘ K to navigate</span>
          <span aria-hidden="true">·</span>
          <LiveClock />
        </p>
      </div>
    </footer>
  );
}

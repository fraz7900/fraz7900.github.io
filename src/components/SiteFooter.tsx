import { SITE } from "@/content/site";

export function SiteFooter() {
  return (
    <footer className="mt-auto border-t border-line">
      <div className="page-container flex flex-col gap-1 py-6 text-xs text-muted sm:flex-row sm:justify-between">
        <p>
          © {SITE.copyrightYear} {SITE.name}
        </p>
        <p className="font-mono">Static site · no tracking · calculator runs in your browser</p>
      </div>
    </footer>
  );
}

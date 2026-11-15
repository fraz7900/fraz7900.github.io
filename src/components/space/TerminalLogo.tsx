import Link from "next/link";
import { SITE } from "@/content/site";

const [USER, HOST] = SITE.handle.split("@");

/** `fraz@heinz:~$▊` — the site's identity mark, linking home. */
export function TerminalLogo() {
  return (
    <Link href="/" aria-label={`${SITE.name}, home`} className="font-mono text-[0.95rem] font-semibold tracking-tight">
      <span aria-hidden="true">
        <span className="text-accent">{USER}</span>
        <span className="text-faint">@</span>
        <span className="text-ink">{HOST}</span>
        <span className="text-faint">:~$</span>
        <span className="ml-0.5 inline-block w-[0.55em] animate-blink bg-accent text-transparent">▊</span>
      </span>
    </Link>
  );
}

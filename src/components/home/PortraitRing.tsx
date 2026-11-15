import Image from "next/image";
import { SITE } from "@/content/site";

/** Headshot in a gradient ring with viewfinder corners. Shows a monogram until a headshot is approved. */
export function PortraitRing() {
  return (
    <div className="relative mx-auto aspect-square w-full max-w-[22rem] p-6">
      {["left-0 top-0 border-l border-t", "right-0 top-0 border-r border-t", "bottom-0 left-0 border-b border-l", "bottom-0 right-0 border-b border-r"].map(
        (corner) => (
          <span key={corner} aria-hidden="true" className={`absolute size-6 border-accent/70 ${corner}`} />
        ),
      )}
      <div className="relative size-full rounded-full bg-[conic-gradient(from_200deg,var(--color-accent),var(--color-sky),var(--color-amber),var(--color-accent))] p-[3px] shadow-[0_0_60px_-10px] shadow-accent/50">
        <div className="flex size-full items-center justify-center overflow-hidden rounded-full bg-card">
          {SITE.headshotSrc ? (
            <Image src={SITE.headshotSrc} alt={`Portrait of ${SITE.name}`} width={320} height={320} className="size-full object-cover" unoptimized />
          ) : (
            <div data-to-confirm="headshot" className="flex flex-col items-center gap-2 text-center">
              <span className="font-display text-7xl font-semibold text-gradient">FA</span>
              <span className="rounded border border-dashed border-amber/60 px-2 py-0.5 font-mono text-[0.65rem] text-amber">
                headshot to confirm
              </span>
            </div>
          )}
        </div>
      </div>
      <p className="absolute inset-x-0 -bottom-2 mx-auto w-max rounded-full border border-line-strong bg-paper/90 px-3 py-1 font-mono text-[0.65rem] tracking-[0.14em] text-muted">
        HEINZ COLLEGE <span className="text-faint">·</span> <span className="text-accent">CARNEGIE MELLON</span>
      </p>
    </div>
  );
}

import { PortraitVector } from "./PortraitVector";

/** The 3D vector portrait in a gradient ring with viewfinder corners. */
export function PortraitRing() {
  return (
    <div className="relative mx-auto aspect-square w-full max-w-[22rem] p-6">
      {["left-0 top-0 border-l border-t", "right-0 top-0 border-r border-t", "bottom-0 left-0 border-b border-l", "bottom-0 right-0 border-b border-r"].map(
        (corner) => (
          <span key={corner} aria-hidden="true" className={`absolute size-6 border-accent/70 ${corner}`} />
        ),
      )}
      <PortraitVector />
      <p className="absolute inset-x-0 -bottom-2 mx-auto w-max rounded-full border border-line-strong bg-paper/90 px-3 py-1 font-mono text-[0.65rem] tracking-[0.14em] text-muted">
        HEINZ COLLEGE <span className="text-faint">·</span> <span className="text-accent">CARNEGIE MELLON</span>
      </p>
    </div>
  );
}

import { DecodeText } from "@/components/motion/DecodeText";

/** Numbered section heading: a rule, `01 // about`, then the title. The homepage really is a sequence. */
export function SectionHeading({
  index,
  label,
  title,
  id,
}: {
  index: string;
  label: string;
  title: React.ReactNode;
  id: string;
}) {
  return (
    <div className="mb-10 flex flex-col gap-3">
      <p className="eyebrow flex items-center gap-3">
        <span aria-hidden="true" className="h-px w-10 bg-accent/70" />
        <span>
          <span className="text-faint">{index}</span>
          {" "}
          <DecodeText text={`// ${label}`} />
        </span>
      </p>
      <h2 id={id} className="font-display text-4xl font-semibold tracking-tight text-ink sm:text-5xl">
        {title}
      </h2>
    </div>
  );
}

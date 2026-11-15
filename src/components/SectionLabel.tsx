interface SectionLabelProps {
  readonly index?: string;
  readonly children: React.ReactNode;
  /** Render as a real heading when the label is the only title of its section. */
  readonly as?: "p" | "h2";
  readonly id?: string;
}

/** Terminal-style eyebrow (`01 // formula`) matching the homepage section headings. */
export function SectionLabel({ index, children, as: Tag = "p", id }: SectionLabelProps) {
  return (
    <Tag id={id} className="eyebrow flex items-center gap-3 lowercase">
      <span aria-hidden="true" className="h-px w-8 bg-accent/70" />
      <span>
        {index && <span className="text-faint">{index} </span>}
        {"// "}
        {children}
      </span>
    </Tag>
  );
}

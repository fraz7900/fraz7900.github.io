interface SectionLabelProps {
  readonly index?: string;
  readonly children: React.ReactNode;
  /** Render as a real heading when the label is the only title of its section. */
  readonly as?: "p" | "h2";
  readonly id?: string;
}

/** Small monospace eyebrow used to give every section the same technical accent. */
export function SectionLabel({ index, children, as: Tag = "p", id }: SectionLabelProps) {
  return (
    <Tag id={id} className="font-mono text-xs uppercase tracking-[0.14em] text-accent">
      {index && <span className="text-muted">{index} · </span>}
      {children}
    </Tag>
  );
}

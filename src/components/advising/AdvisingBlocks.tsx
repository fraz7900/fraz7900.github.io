import Link from "next/link";
import { SectionLabel } from "@/components/SectionLabel";
import { BOOKING } from "@/content/advising/config";
import type { FaqItem } from "@/content/advising/faq";
import type { AdvisingService, ServiceId } from "@/content/advising/services";

/** Server-side building blocks shared by the advising pages. */

export function PageIntro({
  label,
  title,
  lede,
  children,
}: {
  label: string;
  title: string;
  lede: string;
  children?: React.ReactNode;
}) {
  return (
    <header className="flex max-w-3xl flex-col gap-5">
      <SectionLabel>{label}</SectionLabel>
      <h1 className="font-display text-4xl font-semibold leading-[1.08] tracking-tight text-ink sm:text-6xl">{title}</h1>
      <p className="text-lg leading-relaxed text-muted">{lede}</p>
      {children && <div className="flex flex-wrap items-center gap-3 pt-1">{children}</div>}
    </header>
  );
}

export function Section({ id, index, title, children }: { id: string; index: string; title: string; children: React.ReactNode }) {
  return (
    <section id={id} aria-labelledby={`${id}-heading`} className="scroll-mt-28">
      <SectionLabel index={index}>{id.replaceAll("-", " ")}</SectionLabel>
      <h2 id={`${id}-heading`} className="mt-3 mb-6 font-display text-3xl font-semibold tracking-tight text-ink">
        {title}
      </h2>
      {children}
    </section>
  );
}

export function priceText(): string {
  if (BOOKING.pricing.mode === "free") return `Introductory conversations are currently free · ${BOOKING.sessionMinutes} minutes`;
  if (BOOKING.pricing.mode === "paid" && BOOKING.pricing.amount !== undefined && BOOKING.pricing.currency) {
    const price = new Intl.NumberFormat("en-US", { style: "currency", currency: BOOKING.pricing.currency }).format(BOOKING.pricing.amount);
    return `${price} · ${BOOKING.sessionMinutes} minutes`;
  }
  return `${BOOKING.sessionMinutes} minutes · get in touch for pricing`;
}

/** Contextual booking link. Carries only the service id, never a visitor's answers. */
export function BookingCta({ service, label = "Book a conversation" }: { service?: ServiceId; label?: string }) {
  const href = service ? `/advising/book/?topic=${service}` : "/advising/book/";
  return (
    <span className="flex flex-col gap-1.5">
      <Link href={href} className="btn-primary w-max">
        {label}
      </Link>
      <span className="font-mono text-[0.7rem] text-faint">{priceText()}</span>
    </span>
  );
}

export function ServiceCards({ services }: { services: readonly AdvisingService[] }) {
  return (
    <ol className="grid grid-cols-[minmax(0,1fr)] gap-4 md:grid-cols-3">
      {services.map((service, index) => (
        <li key={service.id} className="glass group relative flex flex-col gap-3 rounded-xl p-5 transition-colors hover:border-accent/60">
          <span className="font-mono text-xs text-faint">{String(index + 1).padStart(2, "0")}</span>
          <h3 className="font-display text-xl font-semibold text-ink">
            <Link href={service.href} className="after:absolute after:inset-0 after:content-['']">
              {service.title}
            </Link>
          </h3>
          <p className="text-sm leading-relaxed text-muted">{service.summary}</p>
          <p aria-hidden="true" className="mt-auto font-mono text-xs text-accent group-hover:underline">
            explore
          </p>
        </li>
      ))}
    </ol>
  );
}

export function HelpsWith({ items }: { items: readonly string[] }) {
  return (
    <ul className="grid grid-cols-[minmax(0,1fr)] gap-3 sm:grid-cols-2">
      {items.map((item) => (
        <li key={item} className="flex gap-3 rounded-lg border border-line bg-card/50 px-4 py-3 text-ink/90">
          <span aria-hidden="true" className="text-accent">
            →
          </span>
          {item}
        </li>
      ))}
    </ul>
  );
}

export const PROCESS = [
  { title: "Explore", text: "Read the service page and use its planning tool to see where you stand." },
  { title: "Prepare", text: "Copy your summary and gather anything you’d like feedback on." },
  { title: "Meet", text: "Book a one-to-one conversation and bring your summary." },
  { title: "Decide next steps", text: "Leave with one or two concrete actions you own." },
] as const;

export function ProcessSteps({ steps = PROCESS }: { steps?: readonly { title: string; text: string }[] }) {
  return (
    <ol className="grid grid-cols-[minmax(0,1fr)] gap-3 sm:grid-cols-2 lg:grid-cols-4">
      {steps.map((step, index) => (
        <li key={step.title} className="glass flex flex-col gap-2 rounded-xl p-5">
          <span className="font-mono text-xs text-accent">
            {String(index + 1).padStart(2, "0")}
            <span aria-hidden="true">{index < steps.length - 1 ? " →" : ""}</span>
          </span>
          <h3 className="font-display text-lg font-semibold text-ink">{step.title}</h3>
          <p className="text-sm leading-relaxed text-muted">{step.text}</p>
        </li>
      ))}
    </ol>
  );
}

export function Faq({ items }: { items: readonly FaqItem[] }) {
  return (
    <div className="flex max-w-3xl flex-col divide-y divide-line border-y border-line">
      {items.map((item) => (
        <details key={item.question} className="group py-4">
          <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-medium text-ink">
            {item.question}
            <span aria-hidden="true" className="font-mono text-accent transition-transform group-open:rotate-45">
              +
            </span>
          </summary>
          <p className="mt-3 leading-relaxed text-muted">{item.answer}</p>
        </details>
      ))}
    </div>
  );
}

export function Note({ children }: { children: React.ReactNode }) {
  return <p className="glass rounded-lg border-l-2 border-l-amber px-4 py-3 text-sm leading-relaxed text-ink/90">{children}</p>;
}

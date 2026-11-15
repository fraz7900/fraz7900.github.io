import type { Metadata } from "next";
import Link from "next/link";
import { SectionLabel } from "@/components/SectionLabel";
import { HiringLensExplorer, ProductCanvas } from "@/components/product/ProductInteractives";
import { PRODUCT_FACTS, PRODUCT_INTRO, PRODUCT_TOOLKIT, PRODUCT_WORK, SOURCE_NOTE, type EvidenceSource } from "@/content/product";
import { SITE, SOCIAL_LINKS } from "@/content/site";

export const metadata: Metadata = {
  title: "Product management portfolio",
  description:
    "Fraz Ahmed’s product management portfolio: taking an EHR-integrated clinical NLP workflow to production, with the product thinking behind each decision.",
};

const EMAIL = SOCIAL_LINKS.find((link) => link.href.startsWith("mailto:"));
const LINKEDIN = SOCIAL_LINKS.find((link) => link.label === "LinkedIn");

function Block({ id, index, title, children }: { id: string; index: string; title: string; children: React.ReactNode }) {
  return (
    <section id={id} aria-labelledby={`${id}-heading`} className="scroll-mt-24">
      <SectionLabel index={index}>{id.replaceAll("-", " ")}</SectionLabel>
      <h2 id={`${id}-heading`} className="mt-3 mb-6 font-display text-3xl font-semibold tracking-tight text-ink sm:text-4xl">
        {title}
      </h2>
      {children}
    </section>
  );
}

export default function ProductManagementPage() {
  return (
    <div className="page-container flex flex-col gap-20 py-14 sm:py-20">
      <header className="grid grid-cols-[minmax(0,1fr)] gap-10 lg:grid-cols-[minmax(0,1.5fr)_minmax(0,1fr)] lg:gap-14">
        <div className="flex flex-col gap-6">
          <nav aria-label="Breadcrumb" className="font-mono text-xs text-muted">
            <Link href="/work/" className="hover:text-accent">
              ~/work
            </Link>
            <span aria-hidden="true"> / </span>
            <span aria-current="page" className="text-accent">
              product-management
            </span>
          </nav>
          <p className="flex flex-wrap gap-2">
            {PRODUCT_INTRO.roles.map((role) => (
              <span key={role} className="rounded-full border border-accent/50 px-3 py-1 font-mono text-xs text-accent">
                {role}
              </span>
            ))}
          </p>
          <h1 className="font-display text-5xl font-semibold leading-[1.05] tracking-tight text-ink sm:text-6xl">
            Product management <span className="text-gradient">portfolio</span>
          </h1>
          <p className="max-w-2xl text-lg leading-relaxed text-ink/85">{PRODUCT_INTRO.positioning}</p>
          <div className="flex flex-wrap gap-3">
            <a href="#hiring-lens" className="btn-primary">
              See the evidence for your role
            </a>
            <Link href="/work/caretrak/" className="btn-ghost">
              Read the CareTrak case study
            </Link>
          </div>
        </div>
        <dl className="grid grid-cols-2 gap-3 self-start">
          {PRODUCT_FACTS.map((fact) => (
            <div key={fact.label} className="glass flex flex-col-reverse gap-2 rounded-xl p-4">
              <dt className="text-sm leading-snug text-muted">{fact.label}</dt>
              <dd className="font-display text-3xl font-semibold leading-none text-gradient">{fact.value}</dd>
            </div>
          ))}
        </dl>
      </header>

      <Block id="hiring-lens" index="01" title="What are you hiring for?">
        <p className="mb-6 max-w-2xl leading-relaxed text-muted">
          Pick the role you’re hiring for. Each item is tagged with where it comes from, so you can tell documented facts
          from my own reading of the work.
        </p>
        <HiringLensExplorer />
        <ul className="mt-5 flex flex-wrap gap-x-5 gap-y-1 text-xs text-faint">
          {(Object.keys(SOURCE_NOTE) as EvidenceSource[]).map((source) => (
            <li key={source}>
              <span className="font-mono text-muted">{source}</span>: {SOURCE_NOTE[source]}
            </li>
          ))}
        </ul>
      </Block>

      <Block id="product-thinking" index="02" title="How I approached CareTrak as a product">
        <p className="mb-6 max-w-2xl leading-relaxed text-muted">
          The problem, the people, the constraints, the bets I made, how we measured them, and what happened. Step through
          it, or read the{" "}
          <Link href="/work/caretrak/" className="link-accent">
            full case study
          </Link>{" "}
          with annotated product mockups.
        </p>
        <ProductCanvas />
      </Block>

      <Block id="product-work" index="03" title="Product work">
        <ol className="grid grid-cols-[minmax(0,1fr)] gap-4 md:grid-cols-2">
          {PRODUCT_WORK.map((work) => (
            <li key={work.title} className="glass group relative flex flex-col gap-3 rounded-xl p-5 transition-colors hover:border-accent/60 sm:p-6">
              <p className="font-mono text-xs text-accent">
                {work.kind} · {work.years}
              </p>
              <h3 className="font-display text-xl font-semibold text-ink">
                <Link href={work.href} className="after:absolute after:inset-0 after:content-['']">
                  {work.title}
                </Link>
              </h3>
              <p className="text-sm leading-relaxed text-muted">{work.summary}</p>
              <p aria-hidden="true" className="mt-auto font-mono text-xs text-accent group-hover:underline">
                {work.cta.toLowerCase()}
              </p>
            </li>
          ))}
        </ol>
      </Block>

      <Block id="toolkit" index="04" title="Toolkit">
        <ul className="flex flex-wrap gap-2">
          {PRODUCT_TOOLKIT.map((skill) => (
            <li key={skill} className="rounded-full border border-line-strong px-3 py-1.5 text-sm text-ink/90">
              {skill}
            </li>
          ))}
        </ul>
      </Block>

      <section aria-labelledby="hire-heading" className="glass flex flex-col items-start gap-4 rounded-2xl p-6 sm:p-10">
        <h2 id="hire-heading" className="font-display text-3xl font-semibold text-ink">
          Hiring for product?
        </h2>
        <p className="max-w-2xl leading-relaxed text-muted">
          I’m finishing the MSPPM–Data Analytics at Carnegie Mellon as a Fulbright Scholar (May 2027). I’d be glad to talk
          about product, AI product and product strategy roles.
        </p>
        <div className="flex flex-wrap gap-3">
          {EMAIL && (
            <a href={`${EMAIL.href}?subject=Product%20role%20for%20${encodeURIComponent(SITE.name)}`} className="btn-primary">
              Email me
            </a>
          )}
          {LINKEDIN && (
            <a href={LINKEDIN.href} className="btn-ghost">
              LinkedIn
            </a>
          )}
        </div>
      </section>
    </div>
  );
}

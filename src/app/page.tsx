import Link from "next/link";
import { CareerLog } from "@/components/home/CareerLog";
import { CountUp } from "@/components/home/CountUp";
import { FeaturedWork } from "@/components/home/FeaturedWork";
import { PortraitRing } from "@/components/home/PortraitRing";
import { SectionHeading } from "@/components/home/SectionHeading";
import { StrategyMap } from "@/components/home/strategy-map/StrategyMap";
import { Ticker } from "@/components/home/Ticker";
import { TypingLine } from "@/components/home/TypingLine";
import { DecodeText } from "@/components/motion/DecodeText";
import { SectionRail } from "@/components/motion/SectionRail";
import { RoiCalculator } from "@/components/RoiCalculator";
import { COUNTERS, SITE, STATUS_LOG, TAGLINES, TICKER } from "@/content/site";

const PREVIEW_FIELDS = ["adoptionPercent", "minutesSavedPerCase"] as const;

const SECTIONS = [
  { id: "intro", label: "Intro" },
  { id: "about", label: "About" },
  { id: "log", label: "Career log" },
  { id: "work", label: "Work" },
  { id: "side-quest", label: "ROI calculator" },
] as const;

export default function HomePage() {
  return (
    <>
      <Hero />
      <Ticker items={TICKER} />
      <About />
      <Log />
      <Work />
      <SideQuest />
      <SectionRail sections={SECTIONS} />
    </>
  );
}

function Hero() {
  return (
    <section
      id="intro"
      aria-labelledby="intro-heading"
      className="page-container grid min-h-[calc(100svh-4rem)] grid-cols-[minmax(0,1fr)] items-center gap-12 py-16 lg:grid-cols-[minmax(0,1.25fr)_minmax(0,1fr)]"
    >
      <div className="flex flex-col gap-6">
        <p className="eyebrow">{`// ${SITE.practiceAreas.join(" · ").toLowerCase()}`}</p>
        <h1 id="intro-heading" className="font-display text-6xl font-semibold tracking-tight text-ink sm:text-7xl lg:text-8xl">
          Fraz <span className="text-gradient">Ahmed</span>
        </h1>
        <TypingLine phrases={TAGLINES} />
        <p className="max-w-xl text-lg leading-relaxed text-muted">{SITE.headline}</p>
        <div className="flex flex-wrap items-center gap-3 pt-2">
          <Link href="/work/product-management/" className="btn-primary">
            See my product portfolio
          </Link>
          <Link href="/work/" className="btn-ghost">
            All work
          </Link>
          {SITE.resumeHref && (
            <a href={SITE.resumeHref} className="btn-ghost">
              Download CV
            </a>
          )}
        </div>
      </div>
      <PortraitRing />
    </section>
  );
}

function About() {
  return (
    <section id="about" data-reveal="" aria-labelledby="about-heading" className="page-container scroll-mt-20 py-24">
      <SectionHeading index="01" label="about" id="about-heading" title="Hi, I’m Fraz." />
      <div className="grid grid-cols-[minmax(0,1fr)] gap-12 lg:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)]">
        <div className="prose-body text-ink/90">
          <p>{SITE.supportingCopy}</p>
          <p>
            At Pakistan’s Ministry of Finance I worked on pension reform: the PKR 12.0 trillion revaluation of
            federal pension liabilities, the pension commitments under the IMF Extended Fund Facility, and the legal
            framework for a funded defined-contribution scheme. Before that, at Persivia, I was Product Manager on
            CareTrak, leading the operational launch of an EHR-integrated clinical AI workflow.{" "}
            <Link href="/about/" className="link-accent">
              More about me
            </Link>
          </p>
        </div>
        <div>
          <p className="eyebrow">status_log</p>
          <ul className="mt-4 flex flex-col gap-3">
            {STATUS_LOG.map((item) => (
              <li
                key={item.text}
                data-to-confirm={item.toConfirm ? "status" : undefined}
                className={`flex gap-3 leading-relaxed ${item.toConfirm ? "text-amber" : "text-ink/90"}`}
              >
                <span aria-hidden="true" className="text-accent">
                  →
                </span>
                <span>
                  {item.text}
                  {item.toConfirm && <span className="ml-1 font-mono text-[0.65rem]">(to confirm)</span>}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>
      <dl className="mt-14 grid grid-cols-2 gap-3 lg:grid-cols-4">
        {COUNTERS.map((counter) => (
          <div key={counter.label} className="glass flex flex-col-reverse items-center gap-2 rounded-xl px-4 py-6 text-center">
            <dt className="font-mono text-[0.7rem] leading-snug text-muted">{counter.label}</dt>
            <dd className="font-display text-4xl font-semibold text-gradient sm:text-5xl">
              <CountUp value={counter.value} suffix={counter.suffix} />
            </dd>
          </div>
        ))}
      </dl>
    </section>
  );
}

function Log() {
  return (
    <section id="log" data-reveal="" aria-labelledby="log-heading" className="page-container scroll-mt-20 py-24">
      <SectionHeading index="02" label="career log" id="log-heading" title="Recent milestones" />
      <CareerLog />
    </section>
  );
}

function Work() {
  return (
    <section id="work" data-reveal="" aria-labelledby="work-heading" className="page-container scroll-mt-20 py-24">
      <SectionHeading index="03" label="work" id="work-heading" title="Product delivery in regulated software" />
      <p className="-mt-4 mb-10 max-w-2xl text-lg leading-relaxed text-muted">
        Integration, evaluation and measurement: the work that decides whether a product actually reaches the people
        it’s for.
      </p>
      <FeaturedWork />
      <div id="map" className="mt-16 scroll-mt-20">
        <p className="eyebrow mb-2">map // the strategy graph, drag it around</p>
        <p className="mb-6 max-w-2xl text-muted">
          Every piece of work, the domains it sits in, and the methods and tools behind it. Hover a card above to light
          up its corner of the map.
        </p>
        <StrategyMap />
      </div>
      <p className="mt-8">
        <Link href="/work/" className="btn-ghost">
          All work
        </Link>
      </p>
    </section>
  );
}

function SideQuest() {
  return (
    <section id="side-quest" data-reveal="" aria-labelledby="side-quest-heading" className="page-container scroll-mt-20 py-24">
      <div className="glass grid grid-cols-[minmax(0,1fr)] gap-10 rounded-2xl p-5 sm:p-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)]">
        <div className="flex flex-col gap-4">
          <p className="eyebrow">
            <DecodeText text="04 // side quest" />
          </p>
          <h2 id="side-quest-heading" className="font-display text-4xl font-semibold text-ink">
            Workflow <span className="text-gradient">ROI calculator</span>
          </h2>
          <p className="leading-relaxed text-muted">
            What is a workflow change worth each month, and how much time does it have to save to pay for itself?
            Change adoption and time saved; the full tool lets you edit every assumption and shows the formula.
          </p>
          <p>
            <Link href="/tools/workflow-roi/" className="btn-primary">
              Open the full calculator
            </Link>
          </p>
        </div>
        <div className="min-w-0 rounded-xl border border-line bg-paper/60 p-4 sm:p-5">
          <RoiCalculator editable={PREVIEW_FIELDS} />
        </div>
      </div>
    </section>
  );
}

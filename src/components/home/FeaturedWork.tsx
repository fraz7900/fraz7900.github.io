"use client";

import Link from "next/link";
import { focusStrategyNode } from "./strategy-map/focus";

interface Feature {
  readonly mapId: string;
  readonly badges: readonly string[];
  readonly title: string;
  readonly summary: string;
  readonly href?: string;
  readonly status?: string;
}

const FEATURES: readonly Feature[] = [
  {
    mapId: "caretrak",
    badges: ["Case study", "Persivia · 2020–2022"],
    title: "CareTrak: clinical AI from integration to production",
    summary:
      "How an EHR-integrated, NLP-supported workflow reached production on a platform serving 50+ facilities: integration, data readiness, evaluation, clinician review and launch metrics.",
    href: "/work/caretrak/",
  },
  {
    mapId: "roi",
    badges: ["Tool", "Interactive"],
    title: "Workflow ROI calculator",
    summary: "A break-even model for workflow changes: how much time a change must save before it pays for its recurring cost.",
    href: "/tools/workflow-roi/",
  },
  {
    mapId: "pension",
    badges: ["Public finance", "Ministry of Finance · 2022–2025"],
    title: "Pension reform at Pakistan’s Ministry of Finance",
    summary:
      "Revalued federal pension liabilities at PKR 12.0 trillion, co-drafted the pension commitments for the US$7 billion IMF Extended Fund Facility, and drafted the legal framework for a funded defined-contribution scheme run by licensed private fund managers.",
    status: "Full case study coming soon",
  },
];

export function FeaturedWork() {
  return (
    <ul className="grid gap-4 md:grid-cols-3">
      {FEATURES.map((feature) => (
        <li
          key={feature.mapId}
          onMouseEnter={() => focusStrategyNode(feature.mapId)}
          onMouseLeave={() => focusStrategyNode(null)}
          onFocus={() => focusStrategyNode(feature.mapId)}
          onBlur={() => focusStrategyNode(null)}
          className="glass group relative flex flex-col gap-3 rounded-xl p-5 transition-colors hover:border-accent/60"
        >
          <p className="flex flex-wrap gap-2">
            {feature.badges.map((badge) => (
              <span key={badge} className="rounded border border-line-strong px-2 py-0.5 font-mono text-[0.65rem] text-accent">
                {badge}
              </span>
            ))}
          </p>
          <h3 className="font-display text-xl font-semibold text-ink">
            {feature.href ? (
              <Link href={feature.href} className="after:absolute after:inset-0 after:content-['']">
                {feature.title}
              </Link>
            ) : (
              feature.title
            )}
          </h3>
          <p className="text-sm leading-relaxed text-muted">{feature.summary}</p>
          <p className="mt-auto font-mono text-xs text-accent">
            {feature.status ?? <span className="group-hover:underline">Open</span>}
          </p>
        </li>
      ))}
    </ul>
  );
}

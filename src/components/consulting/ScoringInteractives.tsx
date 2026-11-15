"use client";

import { useState } from "react";
import { REGION_SCORES } from "@/content/wabtec";
import { CONFIDENCE_WEIGHT, captureScore, factWeight, type Confidence, type ScoredFact } from "@/lib/consulting/models";

/** Diverging bar chart of the team's 5-year Chinese-capture score; select a region to see why. */
export function RegionScoreChart() {
  const [selected, setSelected] = useState(0);
  const region = REGION_SCORES[selected];

  return (
    <div className="grid grid-cols-[minmax(0,1fr)] gap-6 lg:grid-cols-[minmax(0,1.3fr)_minmax(0,1fr)]">
      <div className="glass rounded-xl p-5">
        <p className="mb-1 flex justify-between font-mono text-[0.7rem] text-faint">
          <span>← incumbents hold</span>
          <span>Chinese capture →</span>
        </p>
        <ul className="flex flex-col gap-1.5" role="list">
          {REGION_SCORES.map((row, index) => {
            const pct = (Math.abs(row.score) / 1) * 50; // axis shown −1…+1 for legibility
            const positive = row.score > 0;
            return (
              <li key={row.region}>
                <button
                  type="button"
                  aria-pressed={index === selected}
                  onClick={() => setSelected(index)}
                  className={`grid w-full grid-cols-[7.5rem_1fr_3rem] items-center gap-3 rounded-md px-2 py-1.5 text-left text-sm transition-colors sm:grid-cols-[9rem_1fr_3rem] ${
                    index === selected ? "bg-accent-soft/60" : "hover:bg-card"
                  }`}
                >
                  <span className="truncate text-ink">{row.region}</span>
                  <span className="relative h-4">
                    <span aria-hidden="true" className="absolute inset-y-[-2px] left-1/2 w-px bg-line-strong" />
                    <span
                      aria-hidden="true"
                      className={`absolute inset-y-0 ${positive ? "left-1/2 rounded-r bg-amber/80" : "right-1/2 rounded-l bg-sky/80"}`}
                      style={{ width: `${pct}%` }}
                    />
                  </span>
                  <span className="text-right font-mono text-ink">{row.score > 0 ? `+${row.score.toFixed(1)}` : row.score.toFixed(1)}</span>
                </button>
              </li>
            );
          })}
        </ul>
        <p className="mt-3 text-xs text-faint">Axis shown from −1 to +1 for legibility; the scale runs −2 to +2. Team model; scores are proposals.</p>
      </div>
      <div aria-live="polite" className="glass flex flex-col gap-2 rounded-xl p-5">
        <p className="font-mono text-xs text-accent">why this score</p>
        <p className="font-display text-2xl font-semibold text-ink">
          {region.region} <span className="font-mono text-lg text-muted">{region.score > 0 ? `+${region.score.toFixed(1)}` : region.score.toFixed(1)}</span>
        </p>
        <p className="leading-relaxed text-ink/90">{region.why}</p>
      </div>
    </div>
  );
}

const IMPACTS = [1, 2, 3] as const;
const CONFIDENCES: Confidence[] = ["A", "B", "C", "D"];
const RELEVANCES = [1, 0.5, 0] as const;

const START: ScoredFact[] = [
  { direction: "for", impact: 3, confidence: "B", relevance: 1 },
  { direction: "for", impact: 2, confidence: "A", relevance: 1 },
  { direction: "against", impact: 2, confidence: "B", relevance: 0.5 },
];

/** Method demo: edit illustrative facts and watch the score respond. */
export function ScoreCalculator() {
  const [facts, setFacts] = useState<ScoredFact[]>(START);
  const result = captureScore(facts);
  const update = (index: number, patch: Partial<ScoredFact>) =>
    setFacts((current) => current.map((fact, i) => (i === index ? { ...fact, ...patch } : fact)));

  return (
    <div className="glass flex flex-col gap-5 rounded-xl p-5 sm:p-6">
      <div tabIndex={0} role="region" aria-label="Illustrative facts (scrolls sideways)" className="overflow-x-auto">
        <table className="w-full min-w-[36rem] border-collapse text-left text-sm">
          <thead>
            <tr className="border-b border-line-strong text-xs text-muted">
              <th scope="col" className="py-2 pr-2 font-medium">Fact</th>
              <th scope="col" className="py-2 pr-2 font-medium">Direction</th>
              <th scope="col" className="py-2 pr-2 font-medium">Impact</th>
              <th scope="col" className="py-2 pr-2 font-medium">Confidence</th>
              <th scope="col" className="py-2 pr-2 font-medium">Relevance</th>
              <th scope="col" className="py-2 font-medium">Weight</th>
            </tr>
          </thead>
          <tbody>
            {facts.map((fact, index) => (
              <tr key={index} className="border-b border-line">
                <th scope="row" className="py-2 pr-2 font-mono font-normal text-faint">#{index + 1}</th>
                <td className="py-2 pr-2">
                  <select aria-label={`Fact ${index + 1} direction`} value={fact.direction} onChange={(e) => update(index, { direction: e.target.value as ScoredFact["direction"] })} className="rounded border border-line-strong bg-card px-2 py-1 text-ink">
                    <option value="for">For capture</option>
                    <option value="against">Against</option>
                  </select>
                </td>
                <td className="py-2 pr-2">
                  <select aria-label={`Fact ${index + 1} impact`} value={fact.impact} onChange={(e) => update(index, { impact: Number(e.target.value) as ScoredFact["impact"] })} className="rounded border border-line-strong bg-card px-2 py-1 text-ink">
                    {IMPACTS.map((v) => <option key={v} value={v}>{v}</option>)}
                  </select>
                </td>
                <td className="py-2 pr-2">
                  <select aria-label={`Fact ${index + 1} confidence`} value={fact.confidence} onChange={(e) => update(index, { confidence: e.target.value as Confidence })} className="rounded border border-line-strong bg-card px-2 py-1 text-ink">
                    {CONFIDENCES.map((v) => <option key={v} value={v}>{v} ({CONFIDENCE_WEIGHT[v]})</option>)}
                  </select>
                </td>
                <td className="py-2 pr-2">
                  <select aria-label={`Fact ${index + 1} relevance`} value={fact.relevance} onChange={(e) => update(index, { relevance: Number(e.target.value) as ScoredFact["relevance"] })} className="rounded border border-line-strong bg-card px-2 py-1 text-ink">
                    {RELEVANCES.map((v) => <option key={v} value={v}>{v}</option>)}
                  </select>
                </td>
                <td className="py-2 font-mono text-ink">{factWeight(fact).toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="flex flex-wrap gap-3 text-sm">
        <button type="button" disabled={facts.length >= 6} onClick={() => setFacts((c) => [...c, { direction: "against", impact: 1, confidence: "C", relevance: 1 }])} className="btn-ghost text-sm disabled:opacity-40">
          Add a fact
        </button>
        <button type="button" disabled={facts.length <= 1} onClick={() => setFacts((c) => c.slice(0, -1))} className="btn-ghost text-sm disabled:opacity-40">
          Remove last
        </button>
        <button type="button" onClick={() => setFacts(START)} className="link-accent">
          Reset
        </button>
      </div>
      <dl aria-live="polite" className="grid grid-cols-2 gap-3 font-mono text-sm sm:grid-cols-4">
        {[
          ["For − Against", `${result.forWeight.toFixed(2)} − ${result.againstWeight.toFixed(2)}`],
          ["Balance", result.balance.toFixed(2)],
          ["Sufficiency", result.sufficiency.toFixed(2)],
          ["Score", `${result.score > 0 ? "+" : ""}${result.score.toFixed(2)}`],
        ].map(([label, value]) => (
          <div key={label} className="rounded-lg border border-line p-3">
            <dt className="text-xs text-muted">{label}</dt>
            <dd className={`mt-1 text-lg ${label === "Score" ? "text-accent" : "text-ink"}`}>{value}</dd>
          </div>
        ))}
      </dl>
      <p className="text-xs text-faint">
        Illustrative facts, not the engagement’s evidence base. Weight = Impact × Confidence × Relevance; Balance = (For − Against) ÷ (For + Against);
        Sufficiency = min(1, total ÷ 3); Score = 2 × Balance × Sufficiency, so one weak fact can’t produce ±2.
      </p>
    </div>
  );
}

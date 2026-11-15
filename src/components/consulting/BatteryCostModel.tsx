"use client";

import { useId, useState } from "react";
import { PACK_BASE, PACK_RANGES, packCost, tornado, type PackInputs, type SensitiveInput } from "@/lib/consulting/models";

const usdK = (value: number) => `$${Math.round(value / 1000).toLocaleString("en-US")}k`;
const usdM = (value: number) => `$${(value / 1_000_000).toFixed(2)}M`;

/** Live version of the ABS battery-pack cost model, with a one-at-a-time sensitivity (tornado) chart. */
export function BatteryCostModel() {
  const id = useId();
  const [inputs, setInputs] = useState<PackInputs>(PACK_BASE);
  const result = packCost(inputs);
  const rows = tornado(inputs);
  const maxGap = Math.max(...rows.map((r) => r.high), result.gap);
  const isBase = (Object.keys(PACK_RANGES) as SensitiveInput[]).every((key) => inputs[key] === PACK_BASE[key]);

  return (
    <div className="grid grid-cols-[minmax(0,1fr)] gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.15fr)]">
      <div className="glass flex flex-col gap-5 rounded-xl p-5 sm:p-6">
        <p className="text-sm text-muted">
          Start: China pack <span className="font-mono text-ink">$84/kWh</span> (BloombergNEF 2025, observed). Truck value{" "}
          <span className="font-mono text-ink">{usdM(inputs.truckValue)}</span>: average customs value of 349 US-built ultra-class
          trucks shipped to Chile and Peru, 2024–25.
        </p>
        {(Object.keys(PACK_RANGES) as SensitiveInput[]).map((key) => {
          const range = PACK_RANGES[key];
          return (
            <div key={key} className="flex flex-col gap-1.5">
              <label htmlFor={`${id}-${key}`} className="flex items-baseline justify-between gap-3 text-sm font-medium text-ink">
                {range.label}
                <span className="font-mono text-accent">
                  {inputs[key].toFixed(key === "absPremium" ? 2 : 1)}
                  {range.unit === "×" ? "×" : ` ${range.unit}`}
                </span>
              </label>
              <input
                id={`${id}-${key}`}
                type="range"
                min={range.min}
                max={range.max}
                step={range.step}
                value={inputs[key]}
                onChange={(event) => setInputs((current) => ({ ...current, [key]: Number(event.target.value) }))}
                className="accent-[var(--color-accent)]"
              />
              <p className="flex justify-between text-xs text-faint">
                <span>{range.min}</span>
                <span>{range.source}</span>
                <span>{range.max}</span>
              </p>
            </div>
          );
        })}
        {!isBase && (
          <button type="button" onClick={() => setInputs(PACK_BASE)} className="link-accent self-start text-sm">
            Reset to the base case
          </button>
        )}
      </div>

      <div className="flex flex-col gap-5">
        <dl aria-live="polite" className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {[
            ["Chinese pack", usdK(result.chinaPack)],
            ["ABS pack", usdK(result.absPack)],
            ["Gap per truck", usdK(result.gap)],
            ["Of truck value", `${result.gapPctOfTruck.toFixed(1)}%`],
          ].map(([label, value], index) => (
            <div key={label} className={`glass flex flex-col-reverse gap-1 rounded-lg p-3 ${index >= 2 ? "border-accent/50" : ""}`}>
              <dt className="text-xs text-muted">{label}</dt>
              <dd className={`font-display text-2xl font-semibold ${index >= 2 ? "text-accent" : "text-ink"}`}>{value}</dd>
            </div>
          ))}
        </dl>

        <figure className="glass rounded-xl p-5">
          <figcaption className="mb-4 text-sm font-medium text-ink">
            Sensitivity: gap per truck when each input moves across its range (others held at the values on the left)
          </figcaption>
          <ul className="flex flex-col gap-4">
            {rows.map((row) => (
              <li key={row.input} className="flex flex-col gap-1.5">
                <span className="text-xs text-muted">{PACK_RANGES[row.input].label}</span>
                <div className="relative h-5 rounded bg-line/50" title={`${usdK(row.low)} to ${usdK(row.high)}`}>
                  <div
                    className="absolute inset-y-0 rounded bg-sky/80"
                    style={{ left: `${(row.low / maxGap) * 100}%`, width: `${((row.high - row.low) / maxGap) * 100}%` }}
                  />
                  <div aria-hidden="true" className="absolute inset-y-[-3px] w-0.5 bg-amber" style={{ left: `${(result.gap / maxGap) * 100}%` }} />
                </div>
                <span className="flex justify-between font-mono text-xs text-ink">
                  <span>{usdK(row.low)}</span>
                  <span>{usdK(row.high)}</span>
                </span>
              </li>
            ))}
          </ul>
          <p className="mt-4 flex items-center gap-2 text-xs text-muted">
            <span aria-hidden="true" className="inline-block h-3 w-0.5 bg-amber" /> current gap · bars span each input’s low to high
          </p>
        </figure>
        <p className="text-xs leading-relaxed text-faint">
          Pack cost only: power prices, charging and downtime matter more to a miner’s total cost. No public mining-pack price exists, so
          the multiplier is an assumption; prices are held flat. Truck values are customs values, not prices paid.
        </p>
      </div>
    </div>
  );
}

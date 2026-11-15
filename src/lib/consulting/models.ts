/**
 * Models from the CMU × Kearney engagement for Wabtec Mining, reproduced exactly.
 * Battery model: Fraz's ABS pack-cost model. Scoring: the team's evidence-weighted method.
 */

// ---------- Battery pack cost gap (Komatsu/ABS vs Chinese pack) ----------

export interface PackInputs {
  /** BloombergNEF 2025 average Chinese pack price, USD per kWh (observed). */
  readonly chinaPricePerKwh: number;
  /** Rugged, low-volume mining-pack multiplier on the average price (assumption). */
  readonly miningMultiplier: number;
  /** ABS price relative to a Chinese pack: 1.44 US premium × 1.10 scale penalty = 1.584. */
  readonly absPremium: number;
  /** Pack size per truck, MWh. */
  readonly packMwh: number;
  /** Denominator: average customs value of a US-built ultra-class truck, USD. */
  readonly truckValue: number;
}

export const PACK_BASE: PackInputs = {
  chinaPricePerKwh: 84,
  miningMultiplier: 2.5,
  absPremium: 1.44 * 1.1,
  packMwh: 2.6,
  truckValue: 3_853_527,
};

export const PACK_RANGES = {
  miningMultiplier: { min: 1.5, max: 3.5, step: 0.1, label: "Mining-pack multiplier", unit: "×", source: "Assumption (IDTechEx-anchored)" },
  absPremium: { min: 1.44, max: 2.73, step: 0.01, label: "ABS premium over a Chinese pack", unit: "×", source: "44% observed (BNEF) + scale penalty (assumption)" },
  packMwh: { min: 1.4, max: 3.2, step: 0.1, label: "Pack size per truck", unit: "MWh", source: "1.4 Fortescue 240t design · 3.2 Liebherr T 264" },
} as const;

export interface PackResult {
  readonly chinaPack: number;
  readonly absPack: number;
  readonly gap: number;
  readonly gapPctOfTruck: number;
}

export function packCost(inputs: PackInputs): PackResult {
  const kwh = inputs.packMwh * 1000;
  const chinaPack = inputs.chinaPricePerKwh * inputs.miningMultiplier * kwh;
  const absPack = chinaPack * inputs.absPremium;
  const gap = absPack - chinaPack;
  return { chinaPack, absPack, gap, gapPctOfTruck: (gap / inputs.truckValue) * 100 };
}

export type SensitiveInput = keyof typeof PACK_RANGES;

/** One-at-a-time sensitivity: the gap at each input's low and high bound, others at base. */
export function tornado(base: PackInputs): { input: SensitiveInput; low: number; high: number }[] {
  return (Object.keys(PACK_RANGES) as SensitiveInput[])
    .map((input) => ({
      input,
      low: packCost({ ...base, [input]: PACK_RANGES[input].min }).gap,
      high: packCost({ ...base, [input]: PACK_RANGES[input].max }).gap,
    }))
    .sort((a, b) => b.high - b.low - (a.high - a.low));
}

/** ABS capacity: planned GWh × share to mining ÷ MWh per pack. */
export function packsPerYear(plannedGwh: number, miningShare: number, packMwh: number): number {
  return (plannedGwh * 1000 * miningShare) / packMwh;
}

// ---------- Evidence-weighted Chinese-capture score ----------

export type Confidence = "A" | "B" | "C" | "D";
export const CONFIDENCE_WEIGHT: Record<Confidence, number> = { A: 1, B: 0.75, C: 0.5, D: 0.25 };

export interface ScoredFact {
  readonly direction: "for" | "against";
  /** 1 background · 2 changes the conditions · 3 directly decides who wins orders. */
  readonly impact: 1 | 2 | 3;
  readonly confidence: Confidence;
  /** 1 bears fully on the horizon · 0.5 partly · 0 not yet / no longer. */
  readonly relevance: 0 | 0.5 | 1;
}

export const factWeight = (fact: ScoredFact) => fact.impact * CONFIDENCE_WEIGHT[fact.confidence] * fact.relevance;

/** Score = 2 × Balance × Sufficiency, where Balance = (For − Against)/(For + Against) and Sufficiency = min(1, total/3). */
export function captureScore(facts: readonly ScoredFact[]): { forWeight: number; againstWeight: number; balance: number; sufficiency: number; score: number } {
  const forWeight = facts.filter((f) => f.direction === "for").reduce((sum, f) => sum + factWeight(f), 0);
  const againstWeight = facts.filter((f) => f.direction === "against").reduce((sum, f) => sum + factWeight(f), 0);
  const total = forWeight + againstWeight;
  const balance = total === 0 ? 0 : (forWeight - againstWeight) / total;
  const sufficiency = Math.min(1, total / 3);
  return { forWeight, againstWeight, balance, sufficiency, score: 2 * balance * sufficiency };
}

import type { Metadata } from "next";
import Link from "next/link";
import { CaseFooter, CaseHeader, CaseSection, Lessons, ResultsGrid } from "@/components/case/CaseLayout";
import { BatteryCostModel } from "@/components/consulting/BatteryCostModel";
import { RegionScoreChart, ScoreCalculator } from "@/components/consulting/ScoringInteractives";
import {
  CLEARANCE_CONFIRMED,
  DRIVE_CONTENT,
  FINANCIAL_READS,
  IMPORTS,
  KOMATSU_EXPOSURE,
  KOMATSU_FINANCIALS,
  KOMATSU_LEVERS,
  PATHWAYS,
  RECOMMENDATION,
  RIGOR,
  TARIFFS,
  TECHNOLOGY_RESETS,
  WABTEC_CASE_FILE,
  WABTEC_INTRO,
  WABTEC_RESULTS,
  XCMG_FINANCIALS,
} from "@/content/wabtec";

export const metadata: Metadata = {
  title: "Wabtec mining strategy case study",
  description:
    "Strategy consulting case (CMU × Kearney for Wabtec Mining): financial-statement analysis, a battery-pack cost model with sensitivity, trade-data analysis and evidence-weighted scoring on Chinese haul-truck disruption.",
};

function Sub({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-4">
      <h3 className="font-display text-2xl font-semibold text-ink">{title}</h3>
      {children}
    </div>
  );
}

function DataTable({ caption, head, rows }: { caption: string; head: readonly string[]; rows: readonly (readonly string[])[] }) {
  return (
    <div tabIndex={0} role="region" aria-label={`${caption} (scrolls sideways)`} className="glass overflow-x-auto rounded-xl">
      <table className="w-full min-w-[34rem] border-collapse text-left text-sm">
        <caption className="px-4 pt-3 text-left text-xs text-muted">{caption}</caption>
        <thead>
          <tr className="border-b border-line-strong text-xs text-muted">
            {head.map((h) => (
              <th key={h} scope="col" className="px-4 py-2 font-medium">
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.join("|")} className="border-b border-line last:border-0">
              {row.map((cell, i) =>
                i === 0 ? (
                  <th key={i} scope="row" className="px-4 py-2.5 font-medium text-ink">
                    {cell}
                  </th>
                ) : (
                  <td key={i} className="px-4 py-2.5 font-mono text-ink/90">
                    {cell}
                  </td>
                ),
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default function WabtecCasePage() {
  return (
    <article className="flex flex-col">
      {!CLEARANCE_CONFIRMED && (
        <p data-to-confirm="consulting-clearance" className="page-container pt-6 font-mono text-xs text-amber">
          Draft: permission to publish this client engagement is not yet confirmed. Deploys are blocked until it is.
        </p>
      )}
      <CaseHeader
        track={{ id: "consulting", href: "/work/consulting/" }}
        crumb="wabtec-mining"
        title={WABTEC_INTRO.title}
        lede={WABTEC_INTRO.lede}
        facts={WABTEC_CASE_FILE}
      />

      <CaseSection id="problem" index="01" title="The question, and the answer">
        <p className="max-w-3xl font-display text-2xl leading-snug text-ink sm:text-3xl">
          How vulnerable are Caterpillar and Komatsu to Chinese OEMs in 220–240t haul trucks, and what should Wabtec do now?
        </p>
        <p className="glass mt-6 max-w-3xl rounded-xl border-l-2 border-l-accent px-5 py-4 text-lg leading-relaxed text-ink">
          <span className="font-mono text-xs text-accent">the answer · </span>
          {WABTEC_INTRO.answer}
        </p>
        <p className="prose-body mt-6 text-ink/80">
          By client direction the analysis used public evidence only: company filings, official trade and tariff data, OEM technical documents
          and trade press. Priority markets: Australia, Chile, Peru and South Africa.
        </p>
      </CaseSection>

      <CaseSection id="walkthrough" index="02" title="The analysis">
        <div className="flex flex-col gap-14">
          <Sub title="1. Can anyone keep Chinese trucks out? Market access">
            <p className="prose-body text-ink/85">
              No legal barrier in any priority market. Duties apply to every origin; the worst case is 6% × US$4.63m ≈ US$0.28m per truck in
              Chile. Incumbents still supply nearly all large-truck import value; Chinese imports so far are small units.
            </p>
            <DataTable caption="Import duty on off-highway dumpers (HS 8704.10), 2023 MFN rate" head={["Market", "Rate", "Note"]} rows={TARIFFS.map((t) => [t.market, t.rate, t.note])} />
            <DataTable
              caption="HS 8704.10 imports (UN Comtrade): value shares, not 220–240t market shares; value per unit is not a realised price"
              head={["Market", "Import value", "China share", "China / unit", "US share", "US / unit"]}
              rows={IMPORTS.map((r) => [r.market, r.total, r.china, r.chinaUnit, r.us, r.usUnit])}
            />
          </Sub>

          <Sub title="2. Who can afford to fight? Financial-statement analysis">
            <div className="grid grid-cols-[minmax(0,1fr)] gap-4 lg:grid-cols-2">
              <DataTable caption={`Komatsu (${KOMATSU_FINANCIALS.unit})`} head={["Line", ...KOMATSU_FINANCIALS.years]} rows={KOMATSU_FINANCIALS.rows.map((r) => [r.line, ...r.values])} />
              <DataTable caption={`XCMG (${XCMG_FINANCIALS.unit})`} head={["Line", ...XCMG_FINANCIALS.years]} rows={XCMG_FINANCIALS.rows.map((r) => [r.line, ...r.values])} />
            </div>
            <ul className="flex max-w-3xl list-disc flex-col gap-2 pl-5 leading-relaxed text-ink/90 marker:text-accent">
              {FINANCIAL_READS.map((read) => (
                <li key={read}>{read}</li>
              ))}
            </ul>
          </Sub>

          <Sub title="3. What does a battery truck cost Komatsu? A pack-cost model">
            <p className="prose-body text-ink/85">
              Komatsu owns US battery maker American Battery Solutions (ABS). I built a model that prices the same pack twice, Chinese and
              ABS, and takes the difference. Move the assumptions and watch the gap and the sensitivity respond.
            </p>
            <BatteryCostModel />
            <p className="max-w-3xl text-sm leading-relaxed text-muted">
              Capacity: ABS plans 2.6 GWh a year; if half went to mining, that is about 500 packs a year, enough for early volumes. Timing is
              the real gap: ABS samples in 2027 and production in early 2028, exactly when XCMG starts delivering battery trucks to Fortescue.
            </p>
          </Sub>

          <Sub title="4. Is the Chinese price gap real? Trade data">
            <p className="prose-body text-ink/85">
              I built a UN Comtrade pipeline for HS 8704.10 to test the headline claim that Chinese trucks are “70% cheaper”.
            </p>
            <dl className="grid grid-cols-[minmax(0,1fr)] gap-3 sm:grid-cols-3">
              {[
                ["~77%", "lower customs value per unit: Chinese wide-body (US$127k, 6,286 units) vs Japanese rigid (US$542k, 1,105 units) into Indonesia, 2023–25. But they are much smaller trucks."],
                ["0–35%", "cheaper per tonne of payload at ultra-class, because the expensive parts are the same: a Wabtec drive and a Cummins engine."],
                ["“70%”", "traces to one company’s own claim about ~140t trucks at a single mine: not ultra-class trucks, and not packs."],
              ].map(([value, label]) => (
                <div key={value} className="glass flex flex-col-reverse gap-2 rounded-xl p-4">
                  <dt className="text-sm leading-snug text-muted">{label}</dt>
                  <dd className="font-display text-3xl font-semibold text-gradient">{value}</dd>
                </div>
              ))}
            </dl>
          </Sub>
        </div>
      </CaseSection>

      <CaseSection id="regional-outlook" index="03" title="Where the disruption lands">
        <p className="prose-body mb-6 text-ink/85">
          The team scored every region on an evidence-weighted model: Chinese OEMs advance where Chinese capital owns the mine and stall
          where incumbents own the fleet and its autonomy. Select a region to see why it scores where it does.
        </p>
        <RegionScoreChart />
        <div className="mt-10 flex flex-col gap-3">
          <h3 className="font-display text-xl font-semibold text-ink">How a score is built (try it)</h3>
          <ScoreCalculator />
        </div>
      </CaseSection>

      <CaseSection id="komatsu" index="04" title="How Komatsu responds">
        <p className="prose-body mb-6 text-ink/85">
          Komatsu defends where its revenue is, not where the threat is. Oceania and Africa (29% of its mining sales) are where the threat
          grows, and there Komatsu has pilots and service rather than a battery fleet.
        </p>
        <div className="grid grid-cols-[minmax(0,1fr)] gap-6 lg:grid-cols-2">
          <figure className="glass rounded-xl p-5">
            <figcaption className="mb-4 text-sm font-medium text-ink">Share of Komatsu mining sales (FY2025) and the region’s Chinese-capture score</figcaption>
            <ul className="flex flex-col gap-3">
              {KOMATSU_EXPOSURE.map((row) => (
                <li key={row.region} className="grid grid-cols-[7rem_1fr_3rem] items-center gap-3 text-sm">
                  <span className="text-ink">{row.region}</span>
                  <span className="h-3 rounded bg-line/50">
                    <span className="block h-full rounded bg-sky/80" style={{ width: `${(row.share / 32) * 100}%` }} />
                  </span>
                  <span className="text-right font-mono text-ink">{row.share}%</span>
                  <span className="col-span-3 -mt-1 text-xs text-muted">
                    threat {row.threat} · {row.note}
                  </span>
                </li>
              ))}
            </ul>
          </figure>
          <div className="flex flex-col gap-4">
            <ol className="flex flex-col divide-y divide-line rounded-xl border border-line">
              {KOMATSU_LEVERS.map((lever, index) => (
                <li key={lever.lever} className="flex gap-3 px-4 py-3">
                  <span className="font-mono text-xs text-accent">{index + 1}</span>
                  <span>
                    <span className="font-medium text-ink">{lever.lever}. </span>
                    <span className="text-sm text-muted">{lever.evidence}</span>
                  </span>
                </li>
              ))}
            </ol>
            <div className="glass rounded-xl p-4">
              <p className="font-mono text-xs text-accent">history · leadership changes only at technology resets</p>
              <ol className="mt-3 flex flex-col gap-1.5 text-sm">
                {TECHNOLOGY_RESETS.map((reset) => (
                  <li key={reset.year} className="grid grid-cols-[5.5rem_1fr] gap-3">
                    <span className="font-mono text-faint">{reset.year}</span>
                    <span className="text-ink/90">
                      {reset.reset} <span className="text-muted">· {reset.leader}</span>
                    </span>
                  </li>
                ))}
              </ol>
              <p className="mt-3 text-sm text-muted">Newcomers win by pairing a reset with a captive customer base. Chinese OEMs now have both.</p>
            </div>
          </div>
        </div>
      </CaseSection>

      <CaseSection id="recommendation" index="05" title="What it means for Wabtec">
        <DataTable caption="Drive content by 220–240t truck" head={["Truck", "Drive evidence", "Wabtec status"]} rows={DRIVE_CONTENT.map((d) => [d.truck, d.drive, d.status])} />
        <div className="mt-6 grid grid-cols-[minmax(0,1fr)] gap-3 md:grid-cols-3">
          {PATHWAYS.map((p) => (
            <div key={p.pathway} className="glass flex flex-col gap-2 rounded-xl p-5">
              <p className="font-display text-xl font-semibold text-ink">{p.pathway}</p>
              <p className="text-sm text-ink/90">{p.condition}</p>
              <p className="mt-auto text-xs text-muted">
                <span className="font-mono text-accent">watch · </span>
                {p.signal}
              </p>
            </div>
          ))}
        </div>
        <ol className="mt-6 flex max-w-3xl flex-col gap-2">
          {RECOMMENDATION.map((rec, index) => (
            <li key={rec} className="flex gap-3 rounded-lg border border-accent/40 bg-accent-soft/30 px-4 py-3 text-ink">
              <span className="font-mono text-accent">{index + 1}</span>
              {rec}
            </li>
          ))}
        </ol>
      </CaseSection>

      <CaseSection id="results" index="06" title="Key numbers">
        <ResultsGrid results={WABTEC_RESULTS} note="Derived from public filings, trade data and the pack-cost model; inferences are labelled as such." />
      </CaseSection>

      <CaseSection id="rigor" index="07" title="How the numbers were kept honest">
        <ul className="flex max-w-3xl list-disc flex-col gap-2 pl-5 leading-relaxed text-ink/90 marker:text-accent">
          {RIGOR.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </CaseSection>

      <CaseSection id="lessons" index="08" title="What I took from it">
        <Lessons
          items={[
            { title: "Compare like with like", body: "A 77% headline gap became 0–35% once trucks were compared per tonne of payload, with the same drive and engine inside." },
            { title: "Show which assumptions matter", body: "The sensitivity shows two assumptions drive the gap, and that the client’s own price per kWh would replace the weakest one with data." },
            { title: "Say what you can’t claim", body: "With no public mining margin and no fleet denominator, the honest output was a range and an evidence grade, not a point estimate." },
          ]}
        />
      </CaseSection>

      <CaseFooter note="Student consulting engagement with Kearney for Wabtec Mining, Fall 2026. Public sources only; client meetings, contacts and internal materials are not reproduced.">
        <Link href="/work/consulting/" className="btn-ghost">
          Consulting track
        </Link>
      </CaseFooter>
    </article>
  );
}

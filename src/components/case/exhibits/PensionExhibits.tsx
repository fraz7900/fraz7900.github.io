import { Pin } from "../mockup-kit";
import { BarCompare, Exhibit, StatTiles } from "./Exhibit";

const SOURCE = "Ministry of Finance work, 2022–2025, as recorded in my CV";

export function FiscalRiskExhibit() {
  return (
    <Exhibit title="Federal defined-benefit pension cost" source={SOURCE}>
      <BarCompare
        unit="PKR billion"
        rows={[
          { label: "Today", value: 470, display: "PKR 470bn", kind: "reported", note: "14.3% of federal net revenue", pin: 1 },
          { label: "By 2050", value: 5500, display: "over PKR 5.5tn", kind: "projected", pin: 2 },
        ]}
      />
    </Exhibit>
  );
}

export function RevaluationExhibit() {
  return (
    <Exhibit title="Federal pension liability" source={`${SOURCE}; 2021 baseline derived from the reported ~9% gap`}>
      <BarCompare
        unit="PKR trillion"
        rows={[
          { label: "2021 Pay and Pension Commission baseline", value: 11.0, display: "≈ PKR 11.0tn", kind: "derived", pin: 1 },
          { label: "July 2023 actuarial revaluation", value: 12.0, display: "PKR 12.0tn", kind: "reported", note: "About 9% above the 2021 baseline", pin: 2 },
        ]}
      />
      <p className="mt-5 flex items-start gap-2 border-t border-line pt-4 text-sm text-muted">
        <Pin n={3} />
        <span>The valuation fed 10- and 20-year pension-fund financing paths.</span>
      </p>
    </Exhibit>
  );
}

const RULES: readonly { rule: string; before: string; after: string; status: "committed" | "costed" }[] = [
  { rule: "Annual pension increase", before: "Discretionary (17.5% in FY2024)", after: "CPI indexation", status: "committed" },
  { rule: "Wage and pension bill", before: "Uncapped", after: "Capped as a share of GDP", status: "committed" },
  { rule: "Indexation formula", before: "—", after: "80% of 3-year average CPI", status: "costed" },
  { rule: "Pensionable pay base", before: "—", after: "36-month average pay", status: "costed" },
  { rule: "Commutation", before: "35%", after: "25%", status: "costed" },
];

export function RulesExhibit() {
  return (
    <Exhibit title="Pension rules: what changed" source={`${SOURCE}; IMF Extended Fund Facility MEFP (2024)`}>
      <div tabIndex={0} role="region" aria-label="Pension rule changes (scrolls sideways)" className="overflow-x-auto">
        <table className="w-full min-w-[34rem] border-collapse text-left text-sm">
          <thead>
            <tr className="border-b border-line-strong text-xs text-muted">
              <th scope="col" className="py-2 pr-3 font-medium">Rule</th>
              <th scope="col" className="py-2 pr-3 font-medium">Before</th>
              <th scope="col" className="py-2 pr-3 font-medium">After</th>
              <th scope="col" className="py-2 font-medium">Status</th>
            </tr>
          </thead>
          <tbody>
            {RULES.map((row) => (
              <tr key={row.rule} className="border-b border-line last:border-0">
                <th scope="row" className="py-2.5 pr-3 font-medium text-ink">{row.rule}</th>
                <td className="py-2.5 pr-3 text-muted">{row.before}</td>
                <td className="py-2.5 pr-3 text-ink">{row.after}</td>
                <td className="py-2.5">
                  <span className="inline-flex items-center gap-1.5 whitespace-nowrap rounded border border-line-strong px-2 py-0.5 font-mono text-[0.7rem] text-ink">
                    <Pin n={row.status === "committed" ? 1 : 2} />
                    {row.status === "committed" ? "IMF commitment" : "Costed reform"}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="mt-4 text-xs text-muted">
        A dash means the earlier rule isn’t stated here. Costed reforms were costed for 1.8 million pensioners; the
        table does not claim each one was enacted.
      </p>
    </Exhibit>
  );
}

function FlowNode({ title, detail, pin, emphasis = false }: { title: string; detail: string; pin?: number; emphasis?: boolean }) {
  return (
    <div className={`flex min-w-0 flex-1 flex-col gap-1 rounded-lg border p-3 ${emphasis ? "border-accent/70 bg-accent-soft/60" : "border-line-strong bg-paper/50"}`}>
      <p className="flex items-center justify-between gap-2 text-sm font-semibold text-ink">
        {title}
        {pin !== undefined && <Pin n={pin} />}
      </p>
      <p className="text-xs leading-snug text-muted">{detail}</p>
    </div>
  );
}

function FlowArrow() {
  return (
    <span aria-hidden="true" className="flex items-center justify-center text-accent md:px-1">
      <span className="md:hidden">↓</span>
      <span className="hidden md:inline">→</span>
    </span>
  );
}

export function DcFlowExhibit() {
  return (
    <Exhibit title="Funded defined-contribution scheme: how a contribution moves" source={`${SOURCE}; S.R.O. 1728(I)/2025`}>
      <div className="flex flex-col gap-2 md:flex-row md:items-stretch">
        <div className="flex flex-col gap-2 md:w-44">
          <FlowNode title="Employee" detail="10% of pay" pin={1} />
          <FlowNode title="Government" detail="20% of pay" />
        </div>
        <FlowArrow />
        <FlowNode title="Payroll collection" detail="Accountant General Pakistan Revenues deducts and remits contributions" pin={2} />
        <FlowArrow />
        <FlowNode
          title="Licensed private fund managers"
          detail="Licensed and onboarded with SECP and the State Bank of Pakistan; invest the contributions"
          pin={3}
          emphasis
        />
        <FlowArrow />
        <FlowNode title="Member accounts" detail="Funded, individual balances instead of an unfunded promise" />
      </div>
      <p className="mt-4 text-xs text-muted">Design informed by cross-country practice in Malaysia, Sri Lanka, the UK and Kenya.</p>
    </Exhibit>
  );
}

export function FiscalSpaceExhibit() {
  return (
    <Exhibit title="Benazir Income Support Programme, FY25 expansion" source={`${SOURCE}; my pension-bill calculations informed the fiscal space`}>
      <StatTiles
        items={[
          { value: "PKR 599bn", label: "budget, up 27% (0.5% of GDP)", pin: 1 },
          { value: "13,500", label: "quarterly transfer in PKR, up from 10,500", pin: 2 },
          { value: "9.8M", label: "households covered", pin: 3 },
        ]}
      />
    </Exhibit>
  );
}

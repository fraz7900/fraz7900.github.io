/**
 * Consulting case: CMU × Kearney student engagement for Wabtec Mining (Fall 2026).
 * Sources: Fraz's RQ4–RQ6 Background Research Brief (his own document), his ABS battery-cost
 * speaker notes and model, his UN Comtrade pipeline (~/projects/wabtec-kearney), and the
 * midterm deck (slides 14–15 are his; regional scores are the team's model, labelled as such).
 * Excluded on purpose: client meeting notes, client contacts, classmates' names, the client's
 * internal brief figures, Nexis PDFs, and the Ok Tedi per-unit value (unreliable per-unit weights).
 *
 * CLEARANCE: publishing a named client's engagement may be restricted by a confidentiality
 * agreement. Set to true only after Fraz confirms permission; until then the page carries a
 * data-to-confirm marker and `npm run check:publish` blocks deploys.
 */

export const CLEARANCE_CONFIRMED = true;

export const WABTEC_CASE_FILE = [
  { term: "Engagement", detail: "CMU × Kearney student consulting lab for Wabtec Mining, Fall 2026" },
  { term: "Team", detail: "Seven CMU students, coached by Kearney" },
  { term: "My workstreams", detail: "RQ4–RQ6 research, UN Comtrade trade-data pipeline, ABS battery-cost model, Komatsu response analysis" },
  { term: "Methods", detail: "Financial-statement analysis, cost modelling with sensitivity, trade-data analysis, evidence-weighted scoring" },
  { term: "Evidence", detail: "Public sources only, by client direction. 50 of 50 slide claims checked by script against archived sources" },
] as const;

export const WABTEC_INTRO = {
  title: "The China question in mining: should Wabtec worry about Chinese haul trucks?",
  lede:
    "Chinese OEMs such as XCMG are entering the 220–240 tonne haul-truck market long dominated by Caterpillar and Komatsu, Wabtec’s key partners. As part of a CMU × Kearney team, I built the financial, cost and trade-data analysis behind one question: how exposed is Wabtec, and what should it do now?",
  answer:
    "No law keeps Chinese trucks out; Komatsu will answer with service rather than price; and Wabtec’s real exposure is battery trucks, not Chinese diesel-electric wins.",
} as const;

export const WABTEC_RESULTS = [
  { value: "+8%", label: "battery-pack cost penalty for Komatsu’s ABS packs vs Chinese (range 6–25%)" },
  { value: "61.9%", label: "of Komatsu’s mining sales in the regions Chinese OEMs are entering" },
  { value: "+40%", label: "free cash flow Komatsu needs a year to meet its three-year target" },
  { value: "14 of 17", label: "trucks in a mixed South African fleet likely carry Wabtec drives (inference)" },
] as const;

// ---------- RQ4: market access ----------

export const TARIFFS = [
  { market: "Australia", rate: "5%", note: "China-specific ChAFTA rate not verified" },
  { market: "Chile", rate: "6%", note: "US–Chile trade duty-free under the FTA" },
  { market: "Peru", rate: "0%", note: "FTA preferences irrelevant" },
  { market: "South Africa", rate: "0–10%", note: "10% hits articulated dumpers only; rigid trucks not targeted" },
] as const;

export const IMPORTS = [
  { market: "Australia (2025)", total: "US$1,450.9m", china: "0.3%", chinaUnit: "US$0.05m", us: "66.8%", usUnit: "US$3.07m" },
  { market: "Chile (2025)", total: "US$767.2m", china: "1.4%", chinaUnit: "US$0.21m", us: "91.2%", usUnit: "US$4.63m" },
  { market: "Peru (2024)", total: "US$271.7m", china: "21.8%", chinaUnit: "US$0.24m", us: "73.1%", usUnit: "US$4.32m" },
  { market: "South Africa (2025)", total: "US$421.5m", china: "10.4%", chinaUnit: "US$0.17m", us: "4.8%", usUnit: "US$0.93m" },
] as const;

// ---------- RQ5: who can fund a response ----------

export const KOMATSU_FINANCIALS = {
  unit: "¥ millions, fiscal years April–March",
  rows: [
    { line: "Operating cash flow", values: ["434,778", "517,167", "448,963"] },
    { line: "Investing cash flow", values: ["(204,419)", "(210,669)", "(199,232)"] },
    { line: "Free cash flow (derived)", values: ["230,359", "306,498", "249,731"] },
    { line: "R&D (construction, mining & utility)", values: ["94,145", "101,107", "111,108"] },
    { line: "Net interest-bearing debt", values: ["796,192", "765,028", "901,330"] },
  ],
  years: ["FY2023", "FY2024", "FY2025"],
} as const;

export const XCMG_FINANCIALS = {
  unit: "CNY millions, calendar years",
  rows: [
    { line: "Mining machinery revenue", values: ["5,860.7", "7,572.6", "9,376.9"] },
    { line: "Operating cash flow", values: ["3,570.9", "5,692.8", "14,142.3"] },
    { line: "Government grants in profit", values: ["674.3", "366.4", "191.1"] },
  ],
  years: ["2023", "2024 (restated)", "2025"],
} as const;

export const FINANCIAL_READS = [
  "Komatsu’s ¥1tn three-year free-cash-flow target (excl. M&A) minus ¥263.2bn achieved leaves ¥368.4bn a year for FY2026–27: 40% above FY2025.",
  "Komatsu expects mining demand down 10% in FY2025 and 10–15% in FY2026, with 61.9% of its ¥1,904.4bn mining sales in Latin America, Oceania and Africa.",
  "XCMG’s mining revenue grew 23.8% in 2025 while government grants in profit fell to CNY 191.1m. Overseas gross margin (25.80%) exceeds domestic (19.64%).",
  "XCMG doesn’t disclose a mining margin, so a structural cost or pricing advantage is not supported on public data, and the case doesn’t claim one.",
] as const;

// ---------- Komatsu exposure and history (my slides 14–15) ----------

export const KOMATSU_EXPOSURE = [
  { region: "Latin America", share: 32, threat: "−0.1 to −0.3", note: "Chile −0.2, Peru −0.3, Brazil −0.1" },
  { region: "North America", share: 22, threat: "−0.7", note: "Tariffs and autonomy lock-in" },
  { region: "Oceania", share: 19, threat: "0.0, rising", note: "Fortescue–XCMG battery agreement" },
  { region: "Africa", share: 10, threat: "+0.2", note: "Provisional: low fact count" },
  { region: "Europe", share: 2, threat: "+0.5", note: "Serbia, where Chinese capital owns the mines" },
  { region: "China", share: 1, threat: "+0.7", note: "Home market" },
] as const;

export const KOMATSU_LEVERS = [
  { lever: "Defend the installed base", evidence: "Service is 63–70% of mining sales" },
  { lever: "Lock in with autonomy", evidence: "1,016 cumulative autonomous haulage trucks" },
  { lever: "Keep power options open", evidence: "US$65m in battery maker ABS; battery, trolley or hydrogen platform" },
  { lever: "Hold price, give up volume", evidence: "Sales up on price; volume down" },
] as const;

export const TECHNOLOGY_RESETS = [
  { year: "1934", reset: "Mechanical", leader: "Euclid" },
  { year: "1950s", reset: "Diesel-electric", leader: "Haulpak" },
  { year: "1960s–80s", reset: "Service networks", leader: "Caterpillar vs Komatsu" },
  { year: "1990s", reset: "AC drive", leader: "Komatsu 930E" },
  { year: "2008", reset: "Autonomy", leader: "Komatsu FrontRunner" },
  { year: "2028–30", reset: "Battery-electric", leader: "Fortescue–XCMG agreement" },
] as const;

// ---------- Team regional model (5-year Chinese-capture score, −2…+2; proposals) ----------

export const REGION_SCORES = [
  { region: "China", score: 0.7, why: "Home market; state-owned miners buy domestic; Chinese batteries about 44% cheaper." },
  { region: "Sub-Saharan Africa", score: 0.2, why: "New fleets at Chinese-owned mines go to Chinese OEMs; open, cost-driven access. Provisional: low fact count." },
  { region: "Australia", score: 0.0, why: "Fortescue agreement for up to 150–200 XCMG battery trucks; incumbent autonomy (500+ trucks) is the remaining barrier." },
  { region: "Brazil", score: -0.1, why: "Chinese entry still thin." },
  { region: "Chile", score: -0.2, why: "US-built trucks are 91.2% of large-truck import value; Codelco–XCMG MoU centres on ~120t trucks." },
  { region: "Peru", score: -0.3, why: "Chinese imports are small units; no 220–240t event found." },
  { region: "North America", score: -0.7, why: "Triple-stacked US tariffs, no Chinese-owned mines, incumbent autonomy lock-in." },
] as const;

// ---------- RQ6: Wabtec exposure and recommendation ----------

export const DRIVE_CONTENT = [
  { truck: "XCMG XDE260 (220t, diesel-electric)", drive: "Wabtec AC drive named in the Australian batch", status: "Present (single source)" },
  { truck: "Komatsu 830E-5 (227t)", drive: "GE Mining’s Invertex drive (Wabtec acquired GE Transportation in 2019)", status: "Probable" },
  { truck: "Hitachi EH4000AC-3 (221t)", drive: "Hitachi’s own AC drive", status: "Absent (verified)" },
  { truck: "Fortescue battery trucks (2028+)", drive: "Fortescue Zero designs the powertrain", status: "No role disclosed" },
] as const;

export const PATHWAYS = [
  { pathway: "Retain", condition: "Chinese diesel-electric trucks keep Wabtec drives", signal: "XCMG spec sheets or tenders naming Wabtec" },
  { pathway: "Displace", condition: "Battery trucks with miner- or OEM-owned powertrains", signal: "Other miners copying the Fortescue Zero model" },
  { pathway: "Coexist", condition: "Mines buy OEM-agnostic collision avoidance whoever supplies trucks", signal: "Collision-avoidance contracts at mixed-fleet mines" },
] as const;

export const RECOMMENDATION = [
  "Win the drive on Chinese diesel-electric trucks now.",
  "Get into battery powertrains before specifications lock, around 2028.",
  "Sell OEM-agnostic collision avoidance to mines without in-house systems.",
] as const;

export const RIGOR = [
  "Every figure carries an evidence ID and a grade: verified, corroborated, directional or excluded.",
  "A script checked all 50 slide claims against archived source text, and every derived number was recomputed from source data.",
  "Excluded on purpose: an XCMG cost advantage (mining margin undisclosed), market shares (no fleet denominator), and unit prices split out of mixed-equipment deals.",
  "Customs values per unit are proxies, not realised prices; HS 8704.10 covers all off-highway dumpers.",
] as const;

/**
 * Pension reform case study. Every figure comes from Fraz's CV
 * (OneDrive Website/Assets/Fraz_Ahmed_CV_ADB_YPP.pdf), confirmed 2026-11-14.
 * Derived values are labelled as derived wherever they appear.
 */

import type { WalkthroughStep } from "./walkthrough";

export const PENSION_CASE_FILE = [
  { term: "Role", detail: "Section Officer (BS-17), Regulations Wing" },
  { term: "Organisation", detail: "Ministry of Finance, Government of Pakistan" },
  { term: "Dates", detail: "November 2022 – July 2025" },
  { term: "Worked with", detail: "IMF staff, State Bank of Pakistan, SECP, Accountant General Pakistan Revenues" },
  { term: "Methods", detail: "Actuarial valuation, pension liability modelling, fiscal risk analysis, regulatory drafting" },
] as const;

export const PENSION_INTRO = {
  title: "Pension reform: from an unfunded promise to a funded scheme",
  lede:
    "At Pakistan’s Ministry of Finance I worked on the federal pension system: measuring how big the liability really was, turning that into binding rules under an IMF programme, and building the funded defined-contribution scheme that new civil servants now join. This walkthrough follows that sequence.",
  problem:
    "How do you reform a pension promise that is already costing 14% of federal net revenue, without breaking faith with 1.8 million pensioners or the budget?",
  problemContext:
    "The federal defined-benefit scheme is unfunded: today’s pensions are paid from today’s budget, and on current rules the cost was projected to pass PKR 5.5 trillion by 2050. Any fix had to be costed precisely, agreed with the IMF, written into law, and delivered through institutions that had never run a funded civil-service scheme.",
} as const;

export const PENSION_STEPS: readonly WalkthroughStep[] = [
  {
    id: "diagnose",
    title: "Diagnose the fiscal risk",
    summary: "Size the unfunded defined-benefit bill today and where it is heading.",
    myWork: [
      "Diagnosed the fiscal risk of the unfunded defined-benefit scheme: PKR 470 billion, 14.3% of federal net revenue.",
      "Showed its trajectory: over PKR 5.5 trillion by 2050.",
    ],
    whyItMatters:
      "A pension bill that grows faster than revenue quietly crowds out everything else. Putting it in revenue terms made the trade-off visible to decision-makers who don’t read actuarial reports.",
    mockupLabel: "Pension cost, today vs the 2050 projection",
    notes: [
      { pin: 1, text: "Today’s cost, and its share of federal net revenue." },
      { pin: 2, text: "The 2050 projection on the same scale: about 12 times today’s figure (derived)." },
    ],
  },
  {
    id: "revalue",
    title: "Revalue the liability",
    summary: "An actuarial revaluation of federal pension liabilities, July 2023.",
    myWork: [
      "Conducted the actuarial revaluation of federal pension liabilities (July 2023): PKR 12.0 trillion, about 9% above the 2021 Pay and Pension Commission baseline.",
      "Modelled 10- and 20-year pension-fund financing paths.",
    ],
    whyItMatters:
      "Reform negotiations start from a number. An up-to-date valuation replaced a two-year-old baseline and gave the ministry a defensible figure for financing paths and IMF discussions.",
    mockupLabel: "Federal pension liability, 2021 baseline vs 2023 revaluation",
    notes: [
      { pin: 1, text: "The 2021 baseline is implied from the 9% gap; it is derived, not quoted." },
      { pin: 2, text: "The July 2023 revaluation: PKR 12.0 trillion." },
      { pin: 3, text: "The valuation fed 10- and 20-year financing paths for a pension fund." },
    ],
  },
  {
    id: "rules",
    title: "Turn the numbers into rules",
    summary: "IMF programme commitments and costed parametric reforms.",
    myWork: [
      "In policy dialogue with IMF staff, co-drafted the macro-fiscal pension commitments in the Memorandum of Economic and Financial Policies for the US$7 billion Extended Fund Facility (2024), and the pension brief.",
      "Costed parametric defined-benefit reforms for 1.8 million pensioners.",
    ],
    whyItMatters:
      "Discretionary increases are where pension costs escape control. Replacing them with a rule, and capping the bill as a share of GDP, made future costs predictable and politically harder to reverse.",
    mockupLabel: "Rule changes: committed vs costed",
    notes: [
      { pin: 1, text: "Commitments in the IMF programme (MEFP, 2024)." },
      { pin: 2, text: "Parametric reforms I costed for 1.8 million pensioners." },
    ],
  },
  {
    id: "dc",
    title: "Build the funded scheme",
    summary: "A defined-contribution scheme invested by licensed private fund managers.",
    myWork: [
      "Co-designed a public-private pension delivery model: a funded defined-contribution scheme in which licensed private fund managers invest a 10% employee and 20% government contribution.",
      "Drafted its legal framework (S.R.O. 1728(I)/2025), drawing on Malaysia, Sri Lanka, the UK and Kenya.",
      "Served as focal person for implementation: licensing and onboarding fund managers with the State Bank of Pakistan and SECP, and payroll-based contribution collection with the Accountant General Pakistan Revenues.",
    ],
    whyItMatters:
      "A funded scheme only works if money actually moves: payroll has to collect it, regulators have to license managers, and members have to see their accounts. Coordinating those institutions was the delivery work.",
    mockupLabel: "How a contribution flows through the DC scheme",
    notes: [
      { pin: 1, text: "Contributions: 10% from the employee, 20% from the government." },
      { pin: 2, text: "Collected through payroll by the Accountant General Pakistan Revenues." },
      { pin: 3, text: "Invested by private fund managers licensed and onboarded with SECP and the State Bank." },
    ],
  },
  {
    id: "fiscal-space",
    title: "Make room for social spending",
    summary: "Pension-bill calculations that informed the FY25 BISP expansion.",
    myWork: [
      "Scoped fiscal space for social spending with pension-bill calculations that informed the FY25 expansion of the Benazir Income Support Programme (BISP).",
    ],
    whyItMatters:
      "Pension reform is not only about saving money; it decides what else the budget can afford. Here, knowing the pension bill precisely helped make the case for a larger cash-transfer programme.",
    mockupLabel: "BISP FY25 expansion",
    notes: [
      { pin: 1, text: "Budget up 27% to PKR 599 billion, 0.5% of GDP." },
      { pin: 2, text: "Quarterly cash transfer raised from PKR 10,500 to 13,500." },
      { pin: 3, text: "Coverage extended to 9.8 million households." },
    ],
  },
];

export const PENSION_RESULTS = [
  { value: "PKR 12.0tn", label: "federal pension liability revalued (July 2023)" },
  { value: "US$7bn", label: "IMF Extended Fund Facility with pension commitments I co-drafted" },
  { value: "1.8M", label: "pensioners covered by the parametric reforms I costed" },
  { value: "S.R.O. 1728", label: "legal framework for the funded DC scheme, 2025" },
] as const;

export const PENSION_TENSIONS = [
  { pull: "Fiscal sustainability", against: "protecting existing pensioners’ purchasing power" },
  { pull: "Transition cost of a funded scheme", against: "the long-run unfunded liability" },
  { pull: "Public administration", against: "private fund-manager delivery" },
  { pull: "IMF programme deadlines", against: "careful legal drafting" },
] as const;

export const JAMAICA = {
  title: "Taking the model abroad: Jamaica",
  dates: "December 2025 – April 2026 · independent research project with the World Bank (LAC Digital Development), through CMU Heinz",
  body: [
    "I led the digital pension-system design for Jamaica, adapting Pakistan’s defined-contribution model to digital ID enrolment, data exchange and mobile payments, so that auto-enrolment and micro-pensions can reach informal workers. The government announced it in May 2026.",
    "I also scoped the supervision architecture linking pension administrators, private payment providers and the regulator, for an industry of J$847 billion across 820 plans, as the private-equity limit rose from 5% to 7.5%.",
  ],
  stats: [
    { value: "174k", label: "informal workers in scope, 12% of employment" },
    { value: "J$847bn", label: "pension industry, 820 plans" },
    { value: "JMD 3.2bn", label: "projected public savings from interoperable government systems" },
    { value: "31.1pp", label: "service-delivery gap between integrated and fragmented digital governments, 193 countries" },
  ],
} as const;

export const PENSIONFISC = {
  title: "What I’m building now: pensionfisc",
  body:
    "An open-source Python toolkit for costing public pension reform, starting with Pakistan’s federal civil-service scheme. Every scheme rule is stored with its legal citation and effective date, only public sources are used, and every claimed figure is backed by a test and logged in an audit file, including the checks that failed.",
  status: "Pre-release. The engine is built and tested but not yet validated against outturns, so it isn’t an official estimate.",
} as const;

export const PENSION_LESSONS = [
  {
    title: "Put the liability in terms people decide with",
    body: "14% of federal net revenue lands in a budget meeting in a way PKR 470 billion does not.",
  },
  {
    title: "Rules beat discretion",
    body: "Indexation formulas and a cap as a share of GDP make costs predictable, which is what lenders, ministries and pensioners all need.",
  },
  {
    title: "Delivery is institutional",
    body: "The DC scheme needed payroll, two regulators and private fund managers to work together. The design was the easy part.",
  },
  {
    title: "Good public-finance design travels",
    body: "The same defined-contribution logic, rebuilt on digital public infrastructure, became Jamaica’s route to covering informal workers.",
  },
] as const;

export const PENSION_SOURCE_NOTE =
  "Figures are from my work at the Ministry of Finance (2022–2025) and the World Bank project (2025–2026), as recorded in my CV. Charts and diagrams are drawn for this page; the 2021 baseline is derived from the reported 9% gap.";

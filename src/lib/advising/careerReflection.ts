/**
 * Career reflection: a transparent, rule-based suggestion of what to focus a conversation on.
 * Not an assessment. Every rule is visible below.
 */

export const STAGES = [
  { id: "student", label: "Student or recent graduate" },
  { id: "early", label: "Early career (0–3 years)" },
  { id: "mid", label: "Mid-career (4+ years)" },
  { id: "changing", label: "Changing sector or role" },
  { id: "returning", label: "Returning after a break" },
] as const;

export const DECISIONS = [
  { id: "direction", label: "Which direction or role to pursue" },
  { id: "switch", label: "How to move into a new field" },
  { id: "search", label: "How to run a job search" },
  { id: "study", label: "Whether to study further or keep working" },
  { id: "growth", label: "How to grow in my current role" },
] as const;

export const USEFUL = [
  { id: "options", label: "Clarifying my options" },
  { id: "materials", label: "Feedback on my CV, résumé or LinkedIn" },
  { id: "interview", label: "Practising for interviews" },
  { id: "plan", label: "Leaving with a concrete next step" },
] as const;

export type StageId = (typeof STAGES)[number]["id"];
export type DecisionId = (typeof DECISIONS)[number]["id"];
export type UsefulId = (typeof USEFUL)[number]["id"];

export interface ReflectionAnswers {
  readonly stage: StageId;
  readonly decision: DecisionId;
  readonly useful: UsefulId;
}

export interface ReflectionResult {
  readonly focus: string;
  readonly why: readonly string[];
  readonly checklist: readonly string[];
  readonly service: "career" | "admissions";
}

const DECISION_FOCUS: Record<DecisionId, string> = {
  direction: "Narrow your options to two or three roles worth testing",
  switch: "Map your transferable experience onto the field you want to enter",
  search: "Turn your target roles into a focused search plan",
  study: "Weigh further study against staying in work, using your own criteria",
  growth: "Identify the next responsibility that would show growth",
};

const USEFUL_PREP: Record<UsefulId, readonly string[]> = {
  options: ["List the roles or paths you’re considering, even half-formed ones", "Note what you enjoyed and avoided in past work"],
  materials: ["Have your current CV or LinkedIn profile open", "Pick one or two target roles so feedback has a reference point"],
  interview: ["Bring a job description you’re preparing for", "Note two or three experiences you’d like to tell well"],
  plan: ["Write down the deadline or decision date you’re working to", "Note what has stopped you acting so far"],
};

const STAGE_PREP: Record<StageId, string> = {
  student: "Note the courses, projects or internships you’d point to as evidence",
  early: "Note the achievements you’re proudest of in your first roles",
  mid: "Note the results you’d want a future employer to remember",
  changing: "Note which parts of your current work you want to keep doing",
  returning: "Note what you did during your break that is worth mentioning",
};

export function reflect(answers: ReflectionAnswers): ReflectionResult {
  const stage = STAGES.find((s) => s.id === answers.stage)!.label;
  const decision = DECISIONS.find((d) => d.id === answers.decision)!.label;
  const useful = USEFUL.find((u) => u.id === answers.useful)!.label;
  return {
    focus: DECISION_FOCUS[answers.decision],
    why: [
      `You chose “${decision.toLowerCase()}”, which sets the focus.`,
      `You’re at the “${stage.toLowerCase()}” stage, which shapes what evidence to gather.`,
      `You said “${useful.toLowerCase()}” would make the conversation useful, which shapes the preparation.`,
    ],
    checklist: [STAGE_PREP[answers.stage], ...USEFUL_PREP[answers.useful]],
    service: answers.decision === "study" ? "admissions" : "career",
  };
}

export function reflectionSummary(answers: ReflectionAnswers, result: ReflectionResult): string {
  const stage = STAGES.find((s) => s.id === answers.stage)!.label;
  const decision = DECISIONS.find((d) => d.id === answers.decision)!.label;
  const useful = USEFUL.find((u) => u.id === answers.useful)!.label;
  return [
    "Career reflection (prepared on fraz7900.github.io)",
    "",
    `Stage: ${stage}`,
    `Decision: ${decision}`,
    `Most useful: ${useful}`,
    "",
    `Suggested focus: ${result.focus}`,
    "",
    "Before we talk:",
    ...result.checklist.map((item) => `- ${item}`),
    "",
    "This is a reflection prompt, not an assessment.",
  ].join("\n");
}

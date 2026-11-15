/**
 * Application readiness checklist. Measures task completion only, never admission likelihood.
 * Items are deliberately generic: no transcripts, passports or financial records are requested.
 */

export interface ChecklistGroup {
  readonly id: string;
  readonly title: string;
  readonly items: readonly { readonly id: string; readonly label: string }[];
}

export const READINESS_GROUPS: readonly ChecklistGroup[] = [
  {
    id: "goals",
    title: "Goals",
    items: [
      { id: "goal-statement", label: "I can say in two sentences what I want to study and why" },
      { id: "goal-career", label: "I know how the degree connects to my next career step" },
    ],
  },
  {
    id: "research",
    title: "Programme research",
    items: [
      { id: "shortlist", label: "I have a shortlist with a balance of ambitious and realistic choices" },
      { id: "requirements", label: "I’ve read each programme’s official requirements" },
      { id: "fit", label: "I can explain why each programme fits me specifically" },
    ],
  },
  {
    id: "documents",
    title: "Documents",
    items: [
      { id: "cv", label: "My CV is updated for academic applications" },
      { id: "sop-draft", label: "I have a first draft of my statement of purpose" },
      { id: "sop-feedback", label: "I’ve had feedback on my statement and revised it myself" },
    ],
  },
  {
    id: "recommendations",
    title: "Recommendations",
    items: [
      { id: "recommenders", label: "I’ve chosen recommenders who know my work well" },
      { id: "asked", label: "I’ve asked them, with a summary of my goals and the deadlines" },
    ],
  },
  {
    id: "tests",
    title: "Tests",
    items: [
      { id: "tests-known", label: "I know which tests each programme requires or waives" },
      { id: "tests-booked", label: "I’ve booked any test dates with time to retake if needed" },
    ],
  },
  {
    id: "funding",
    title: "Funding",
    items: [
      { id: "funding-options", label: "I’ve listed scholarships and funding I’m eligible for" },
      { id: "funding-deadlines", label: "I’ve noted funding deadlines, which can be earlier than admissions" },
    ],
  },
  {
    id: "submission",
    title: "Submission",
    items: [
      { id: "calendar", label: "Every deadline is in my calendar with its time zone" },
      { id: "final-check", label: "I’ve planned a final check before each submission" },
    ],
  },
];

export const ALL_ITEM_IDS = READINESS_GROUPS.flatMap((group) => group.items.map((item) => item.id));

export interface Progress {
  readonly done: number;
  readonly total: number;
  readonly percent: number;
  readonly byGroup: readonly { readonly id: string; readonly done: number; readonly total: number }[];
}

export function progressOf(completed: ReadonlySet<string>): Progress {
  const valid = ALL_ITEM_IDS.filter((id) => completed.has(id));
  const byGroup = READINESS_GROUPS.map((group) => ({
    id: group.id,
    done: group.items.filter((item) => completed.has(item.id)).length,
    total: group.items.length,
  }));
  return { done: valid.length, total: ALL_ITEM_IDS.length, percent: Math.round((valid.length / ALL_ITEM_IDS.length) * 100), byGroup };
}

export const READINESS_STORAGE_KEY = "advising.readiness.v1";

/** Parse stored progress defensively; anything unexpected yields an empty set. */
export function parseStored(raw: string | null): Set<string> {
  if (!raw) return new Set();
  try {
    const value: unknown = JSON.parse(raw);
    if (!Array.isArray(value)) return new Set();
    return new Set(value.filter((id): id is string => typeof id === "string" && ALL_ITEM_IDS.includes(id)));
  } catch {
    return new Set();
  }
}

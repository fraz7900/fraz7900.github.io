import type { ServiceId } from "@/content/advising/services";

/** Landing-page "where should I start?" options, each mapped to one service. */
export const FINDER_OPTIONS: readonly { readonly id: string; readonly label: string; readonly service: ServiceId; readonly why: string }[] = [
  { id: "direction", label: "I’m not sure what role or field to aim for", service: "career", why: "Career guidance starts with your options and narrows them." },
  { id: "cv", label: "I want feedback on my CV or LinkedIn", service: "career", why: "Career guidance covers CV, résumé and LinkedIn feedback." },
  { id: "interview", label: "I have a job interview coming up", service: "career", why: "Career guidance includes interview preparation." },
  { id: "masters", label: "I’m planning a Master’s or PhD application", service: "admissions", why: "Admissions support covers shortlists, timelines and statements." },
  { id: "scholarship", label: "I’m applying for a scholarship", service: "admissions", why: "Admissions support includes scholarship application planning." },
  { id: "test", label: "I need to prepare for a standardized test", service: "test-prep", why: "Test preparation planning turns your test date into a study plan." },
];

export function findService(optionId: string): { service: ServiceId; why: string } | null {
  const option = FINDER_OPTIONS.find((o) => o.id === optionId);
  return option ? { service: option.service, why: option.why } : null;
}

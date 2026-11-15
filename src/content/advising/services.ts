/** The three advising services. Copy and activation live here, not in page components. */

import { BOOKING, type Pricing } from "./config";

export type ServiceId = "career" | "admissions" | "test-prep";

export interface AdvisingService {
  readonly id: ServiceId;
  readonly title: string;
  readonly href: string;
  readonly summary: string;
  /** Short label used as the booking topic. */
  readonly topic: string;
  readonly helpsWith: readonly string[];
  readonly active: boolean;
  readonly pricing: Pricing;
  readonly durationMinutes: number;
}

export const SERVICES: readonly AdvisingService[] = [
  {
    id: "career",
    title: "Career guidance",
    href: "/advising/career/",
    summary: "Work out a direction, a transition, or the next practical step, and tell your story clearly.",
    topic: "Career guidance",
    helpsWith: [
      "Career direction and role exploration",
      "Moving between sectors, for example public service to product or analytics",
      "Turning your experience into a clear professional narrative",
      "Feedback on your CV, résumé or LinkedIn profile",
      "Interview preparation",
      "Choosing one practical next step",
    ],
    active: true,
    pricing: BOOKING.pricing,
    durationMinutes: BOOKING.sessionMinutes,
  },
  {
    id: "admissions",
    title: "Admissions support",
    href: "/advising/admissions/",
    summary: "Plan graduate applications, from a balanced shortlist to a statement of purpose that is genuinely yours.",
    topic: "Admissions support",
    helpsWith: [
      "Clarifying your academic and professional goals",
      "Building a balanced programme shortlist",
      "Planning application milestones",
      "Feedback on an authentic statement of purpose",
      "Preparing recommendation requests",
      "Scholarship application planning",
      "Interview preparation",
    ],
    active: true,
    pricing: BOOKING.pricing,
    durationMinutes: BOOKING.sessionMinutes,
  },
  {
    id: "test-prep",
    title: "Test preparation planning",
    href: "/advising/test-prep/",
    summary: "Turn a test date into a realistic study plan: a starting point, weekly priorities and practice review.",
    topic: "Test preparation planning",
    helpsWith: [
      "Taking stock of your starting point",
      "Building a study plan that fits your weeks and hours",
      "Prioritising sections",
      "Reviewing practice results",
      "Preparing for test day",
    ],
    active: true,
    pricing: BOOKING.pricing,
    durationMinutes: BOOKING.sessionMinutes,
  },
];

export const ACTIVE_SERVICES = SERVICES.filter((service) => service.active);

export function serviceById(id: string): AdvisingService | undefined {
  return SERVICES.find((service) => service.id === id);
}

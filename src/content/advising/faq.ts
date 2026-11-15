import { BOOKING } from "./config";

export interface FaqItem {
  readonly question: string;
  readonly answer: string;
}

const priceLine =
  BOOKING.pricing.mode === "free"
    ? `Introductory conversations are currently free and last ${BOOKING.sessionMinutes} minutes.`
    : BOOKING.pricing.mode === "paid"
      ? `Sessions last ${BOOKING.sessionMinutes} minutes. The price is shown on the booking page.`
      : `Sessions last ${BOOKING.sessionMinutes} minutes. Get in touch for pricing.`;

export const FAQ: readonly FaqItem[] = [
  { question: "Does it cost anything?", answer: priceLine },
  {
    question: "Who is this for?",
    answer:
      "Students and early- to mid-career professionals thinking about a career move, graduate applications, scholarships or a standardized test, especially people moving between public service, policy and analytics roles.",
  },
  {
    question: "Can you guarantee an admission, a scholarship or a job?",
    answer:
      "No. Nobody honest can. I can help you plan, prepare and present your own case clearly; decisions belong to employers, universities and scholarship panels.",
  },
  {
    question: "Will you write my statement of purpose or essays?",
    answer:
      "No. Your applications stay yours. I give feedback, ask questions and help you structure your thinking, but I don’t ghostwrite or submit anything on your behalf.",
  },
  {
    question: "Is this counselling or therapy?",
    answer:
      "No. This is practical career and application guidance from someone who has been through these processes. It isn’t licensed psychological counselling.",
  },
  {
    question: "What should I prepare before we talk?",
    answer:
      "Use the tool on the relevant service page to note your stage, your decision and what would make the conversation useful. Bring that summary, plus any draft you want feedback on.",
  },
  {
    question: "What happens to the information I share?",
    answer:
      "The planning tools on this site run in your browser and send nothing anywhere. Bookings are handled by the scheduling provider, which collects only what its booking form asks for.",
  },
];

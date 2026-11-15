import type { Metadata } from "next";
import { TrackPage } from "@/components/TrackPage";

export const metadata: Metadata = {
  title: "Consulting",
  description: "Strategy consulting case studies by Fraz Ahmed: financial modelling, cost modelling and market research.",
};

export default function ConsultingPage() {
  return (
    <TrackPage
      id="consulting"
      intro="Strategy consulting with a quantitative core: build the model, show its sensitivity, and say plainly what the evidence can’t support."
    />
  );
}

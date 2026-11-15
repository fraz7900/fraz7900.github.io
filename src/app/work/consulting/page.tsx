import type { Metadata } from "next";
import { TrackPage } from "@/components/TrackPage";

export const metadata: Metadata = {
  title: "Consulting",
  description: "Consulting case studies by Fraz Ahmed, in preparation.",
};

export default function ConsultingPage() {
  return <TrackPage id="consulting" intro="Consulting case studies will appear here as they are written up." />;
}

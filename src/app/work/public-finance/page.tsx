import type { Metadata } from "next";
import { TrackPage } from "@/components/TrackPage";

export const metadata: Metadata = {
  title: "Public finance",
  description: "Pension reform at Pakistan’s Ministry of Finance, digital pension design with the World Bank, and export-competitiveness schemes.",
};

export default function PublicFinancePage() {
  return (
    <TrackPage
      id="public-finance"
      intro="Three years at Pakistan’s Ministry of Finance (2022–2025), then a World Bank research project on Jamaica’s pension system. The same habits run through all of it: size the problem, turn it into rules, and get the institutions to deliver."
    />
  );
}

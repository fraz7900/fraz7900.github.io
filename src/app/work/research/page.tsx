import type { Metadata } from "next";
import { TrackPage } from "@/components/TrackPage";

export const metadata: Metadata = {
  title: "Research",
  description: "Working papers on industrial policy, digital public infrastructure and trade, and an open-source pension costing toolkit.",
};

export default function ResearchPage() {
  return (
    <TrackPage
      id="research"
      intro="Applied economics with administrative data: how policy actually changes behaviour, and how to measure it honestly. Working papers are listed with co-authors; drafts aren’t posted here."
    />
  );
}

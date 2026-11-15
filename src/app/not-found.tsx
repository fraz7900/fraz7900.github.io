import type { Metadata } from "next";
import Link from "next/link";
import { SectionLabel } from "@/components/SectionLabel";

export const metadata: Metadata = { title: "Page not found" };

export default function NotFound() {
  return (
    <div className="page-container flex flex-col gap-4 py-16">
      <SectionLabel>404</SectionLabel>
      <h1 className="font-display text-5xl text-ink">Page not found</h1>
      <p className="text-ink/85">That address doesn’t match a page on this site.</p>
      <p>
        <Link href="/" className="link-accent">
          Go to the homepage
        </Link>
      </p>
    </div>
  );
}

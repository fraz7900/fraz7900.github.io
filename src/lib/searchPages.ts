import type { NavItem } from "@/content/site";

/** Case-insensitive page search; label matches rank above description-only matches. */
export function searchPages(pages: readonly NavItem[], query: string): readonly NavItem[] {
  const needle = query.trim().toLowerCase();
  if (needle === "") return pages;
  const labelMatches = pages.filter((page) => page.label.toLowerCase().includes(needle));
  const descriptionMatches = pages.filter(
    (page) => !labelMatches.includes(page) && page.description.toLowerCase().includes(needle),
  );
  return [...labelMatches, ...descriptionMatches];
}

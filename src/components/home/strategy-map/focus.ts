/** Lets other parts of the page (work cards, the list view) highlight a node on the strategy map. */
export const FOCUS_EVENT = "strategy-map:focus";

export function focusStrategyNode(id: string | null): void {
  window.dispatchEvent(new CustomEvent<string | null>(FOCUS_EVENT, { detail: id }));
}

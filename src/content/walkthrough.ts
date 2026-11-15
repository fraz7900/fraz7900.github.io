/** Shared shape for case-study walkthrough steps (CareTrak, pension reform, ...). */

export interface WalkthroughNote {
  readonly pin: number;
  readonly text: string;
}

export interface WalkthroughStep {
  readonly id: string;
  readonly title: string;
  readonly summary: string;
  readonly myWork: readonly string[];
  readonly whyItMatters: string;
  /** Short label for the step's visual, used in its caption. */
  readonly mockupLabel: string;
  readonly notes: readonly WalkthroughNote[];
}

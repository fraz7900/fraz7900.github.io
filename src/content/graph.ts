/**
 * Strategy map: how Fraz's work connects domains, methods and tools.
 * Sources: CareTrak case study, Persivia CV bullets, the ROI calculator.
 */

export type GraphNodeType = "work" | "domain" | "method" | "tool";

export interface GraphNode {
  readonly id: string;
  readonly label: string;
  readonly type: GraphNodeType;
  readonly href?: string;
}

export const GRAPH_TYPES: readonly { readonly type: GraphNodeType; readonly label: string }[] = [
  { type: "work", label: "Work" },
  { type: "domain", label: "Domains" },
  { type: "method", label: "Methods" },
  { type: "tool", label: "Tools" },
];

export const GRAPH_NODES: readonly GraphNode[] = [
  { id: "caretrak", label: "CareTrak case study", type: "work", href: "/work/caretrak/" },
  { id: "roi", label: "Workflow ROI calculator", type: "work", href: "/tools/workflow-roi/" },
  { id: "pension", label: "Pension reform (in preparation)", type: "work" },

  { id: "healthcare", label: "Healthcare SaaS", type: "domain" },
  { id: "vbc", label: "Value-based care", type: "domain" },
  { id: "public-finance", label: "Public finance", type: "domain" },
  { id: "product-strategy", label: "Product strategy", type: "domain" },
  { id: "analytics", label: "Analytics", type: "domain" },
  { id: "enterprise-strategy", label: "Enterprise strategy", type: "domain" },

  { id: "ehr", label: "EHR interoperability", type: "method" },
  { id: "nlp-eval", label: "Clinical NLP evaluation", type: "method" },
  { id: "hcc", label: "CMS-HCC risk adjustment", type: "method" },
  { id: "readiness", label: "Data readiness", type: "method" },
  { id: "ops-analytics", label: "Operational analytics", type: "method" },
  { id: "cohorts", label: "Cohort analysis", type: "method" },
  { id: "ccm", label: "Chronic care management", type: "method" },
  { id: "predictive", label: "Predictive cost models", type: "method" },
  { id: "break-even", label: "Break-even modelling", type: "method" },

  { id: "r", label: "R / RStudio", type: "tool" },
  { id: "databricks", label: "Databricks", type: "tool" },
  { id: "sql", label: "SQL", type: "tool" },
  { id: "typescript", label: "TypeScript", type: "tool" },
];

export const GRAPH_LINKS: readonly (readonly [string, string])[] = [
  ["caretrak", "healthcare"],
  ["caretrak", "vbc"],
  ["caretrak", "product-strategy"],
  ["caretrak", "analytics"],
  ["caretrak", "ehr"],
  ["caretrak", "nlp-eval"],
  ["caretrak", "hcc"],
  ["caretrak", "readiness"],
  ["caretrak", "ops-analytics"],
  ["caretrak", "cohorts"],
  ["caretrak", "ccm"],
  ["caretrak", "predictive"],
  ["ops-analytics", "r"],
  ["cohorts", "databricks"],
  ["cohorts", "sql"],
  ["predictive", "sql"],
  ["hcc", "vbc"],
  ["ccm", "vbc"],
  ["nlp-eval", "healthcare"],
  ["roi", "product-strategy"],
  ["roi", "analytics"],
  ["roi", "break-even"],
  ["roi", "typescript"],
  ["break-even", "ops-analytics"],
  ["pension", "public-finance"],
  ["pension", "enterprise-strategy"],
  ["enterprise-strategy", "product-strategy"],
];

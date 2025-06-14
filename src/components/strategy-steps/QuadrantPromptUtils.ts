
import type { SelectedPoint } from "./StepOne";

// Type for one scenario quadrant
export type MatrixScenario = {
  title: string;
  description: string;
};

export const QUADRANT_LABELS = [
  "Best Case (Both Factors in Favor)",
  "Y-Axis Favor, X-Axis Against",
  "Both Against",
  "X-Axis Favor, Y-Axis Against"
] as const;

export type QuadrantRequest = {
  label: string;
  promptDesc: string;
};

// All 4 quadrants for matrix scenario generation
export const QUADRANT_REQUESTS: QuadrantRequest[] = [
  {
    label: QUADRANT_LABELS[0],
    promptDesc: "both the Y-axis and X-axis factors are in favor of Invisalign"
  },
  {
    label: QUADRANT_LABELS[1],
    promptDesc: "the Y-axis factor is in favor, but the X-axis factor is against Invisalign"
  },
  {
    label: QUADRANT_LABELS[2],
    promptDesc: "both the Y-axis and X-axis factors are against Invisalign"
  },
  {
    label: QUADRANT_LABELS[3],
    promptDesc: "the X-axis factor is in favor, but the Y-axis factor is against Invisalign"
  }
];

// Compose a per-quadrant prompt
export function makeQuadrantPrompt(
  pdfContent: string,
  yAxis: SelectedPoint,
  xAxis: SelectedPoint,
  quadrant: QuadrantRequest
) {
  return `
Given the following business case context (Invisalign):

---
${pdfContent}
---

Here are the two key uncertainties selected for a scenario matrix:
  Y Axis: ${yAxis.factor} - "${yAxis.text}"
  X Axis: ${xAxis.factor} - "${xAxis.text}"

Generate a scenario QUADRANT for a 2x2 scenario matrix:
Description: ${quadrant.promptDesc}

Return a single compact JSON object (no extra prose, no markdown, JSON only) with:
{
  "title": "<concise quadrant label (max 8 words)>",
  "description": "<a business-oriented scenario for Invisalign if this quadrant occurs; 3-4 sentences, specific, actionable>"
}
REPLY WITH JSON ONLY.
  `.trim();
}


import type { SelectedPoint } from "./StepOne";

// New style for one scenario quadrant
export type MatrixScenario = {
  header: string;   // "In this scenario, ..."
  bullets: string[]; // 4–6 bullet points
};

export type QuadrantRequest = {
  key: string;
  label: string;
  desc: string;
  xHigh: string;
  xLow: string;
  yHigh: string;
  yLow: string;
};

export const QUADRANT_LABELS = [
  "High Y / High X",
  "High Y / Low X",
  "Low Y / Low X",
  "Low Y / High X",
] as const;

// Each quadrant explains the mix of high/low on both axes
export const QUADRANT_REQUESTS: QuadrantRequest[] = [
  {
    key: 'yHigh_xHigh',
    label: "High Y, High X",
    desc: "Both axes (Y and X) at their high/extreme/positive setting.",
    yHigh: "High",
    yLow: "Low",
    xHigh: "High",
    xLow: "Low"
  },
  {
    key: 'yHigh_xLow',
    label: "High Y, Low X",
    desc: "Y axis high, X axis low.",
    yHigh: "High",
    yLow: "Low",
    xHigh: "Low",
    xLow: "High"
  },
  {
    key: 'yLow_xLow',
    label: "Low Y, Low X",
    desc: "Both axes at their low/extreme/negative setting.",
    yHigh: "Low",
    yLow: "High",
    xHigh: "Low",
    xLow: "High"
  },
  {
    key: 'yLow_xHigh',
    label: "Low Y, High X",
    desc: "Y axis low, X axis high.",
    yHigh: "Low",
    yLow: "High",
    xHigh: "High",
    xLow: "Low"
  },
];

// New prompt, following user's style
export function makeQuadrantPrompt(
  caseTitle: string,
  industryContext: string,
  horizonYear: string,
  yAxis: SelectedPoint,
  xAxis: SelectedPoint,
  quadrant: QuadrantRequest
) {
  return `
CASE_TITLE: "${caseTitle}"
INDUSTRY_OR_CONTEXT: "${industryContext}"
HORIZON_YEAR: ${horizonYear}
X_AXIS: "${xAxis.factor}" (LOW = "${xAxis.lowLabel || "Low"}", HIGH = "${xAxis.highLabel || "High"}")
Y_AXIS: "${yAxis.factor}" (LOW = "${yAxis.lowLabel || "Low"}", HIGH = "${yAxis.highLabel || "High"}")

For the quadrant where Y is "${quadrant.yHigh}" and X is "${quadrant.xHigh}":
For this scenario, write:
1. A 1-sentence header that starts with “In this scenario, ...”
2. 4-6 concise bullet points covering:
  (a) market dynamics,
  (b) product / service implications,
  (c) operational or cost impacts,
  (d) partnership or ecosystem notes,
  (e) any other context-specific factor.

STYLE
- ≤ 90 words per quadrant (header plus bullets)
- Bullet verbs = present tense (“Accelerates…”, “Constrains…”)
- No industry jargon unless present in CASE_TITLE
- Ready for direct copy-paste into slides.

Return a compact, valid JSON object (no extra prose, no markdown) in this schema:
{
  "header": "In this scenario, ...",
  "bullets": [
    "Bullet point 1",
    ...
    "Bullet point 4 to 6"
  ]
}
REPLY WITH JSON ONLY.
  `.trim();
}

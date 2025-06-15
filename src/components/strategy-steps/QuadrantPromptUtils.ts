
import type { SelectedPoint } from "./types";

// Updated interface to include summary
export type MatrixScenario = {
  summary: string;   // New: brief 5-7 word headline
  header: string;    // "In this scenario, ..."
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
  "High Y / Low X",
  "High Y / High X", 
  "Low Y / Low X",
  "Low Y / High X",
] as const;

// Updated quadrant requests to match new index mapping:
// Index 0: Top Right (High Y, Low X)
// Index 1: Top Left (High Y, High X)
// Index 2: Bottom Left (Low Y, Low X)
// Index 3: Bottom Right (Low Y, High X)
export const QUADRANT_REQUESTS: QuadrantRequest[] = [
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
    key: 'yHigh_xHigh',
    label: "High Y, High X",
    desc: "Both axes (Y and X) at their high/extreme/positive setting.",
    yHigh: "High",
    yLow: "Low",
    xHigh: "High",
    xLow: "Low"
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

// Updated prompt to include summary generation and word count constraint
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
X_AXIS: "${xAxis.factor}" (LOW = "Low", HIGH = "High")
Y_AXIS: "${yAxis.factor}" (LOW = "Low", HIGH = "High")

For the quadrant where Y is "${quadrant.yHigh}" and X is "${quadrant.xHigh}":
For this scenario, write:
1. A brief 5-7 word summary headline
2. A 1-sentence header that starts with "In this scenario, ..."
3. 4-6 concise bullet points covering:
  (a) market dynamics,
  (b) product / service implications,
  (c) operational or cost impacts,
  (d) partnership or ecosystem notes,
  (e) any other context-specific factor.

STYLE
- Summary: 5-7 words max, captures essence of scenario
- Header: ≤ 100 words total for the entire quadrant content (header plus all bullets combined)
- Bullet verbs = present tense ("Accelerates…", "Constrains…")
- No industry jargon unless present in CASE_TITLE
- Ready for direct copy-paste into slides.
- Keep content concise and impactful

Return a compact, valid JSON object (no extra prose, no markdown) in this schema:
{
  "summary": "Brief scenario headline",
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

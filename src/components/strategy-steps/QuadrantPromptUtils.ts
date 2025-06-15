
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

// Helper function to extract industry from case context
function extractIndustry(caseTitle: string, industryContext: string): string {
  // Look for industry indicators in title and context
  const combinedText = `${caseTitle} ${industryContext}`.toLowerCase();
  
  // Common industry patterns
  if (combinedText.includes('ai') || combinedText.includes('artificial intelligence') || combinedText.includes('machine learning')) {
    return "AI and Machine Learning";
  }
  if (combinedText.includes('tech') || combinedText.includes('software') || combinedText.includes('digital')) {
    return "Technology";
  }
  if (combinedText.includes('automotive') || combinedText.includes('car') || combinedText.includes('vehicle')) {
    return "Automotive";
  }
  if (combinedText.includes('healthcare') || combinedText.includes('medical') || combinedText.includes('pharma')) {
    return "Healthcare";
  }
  if (combinedText.includes('finance') || combinedText.includes('bank') || combinedText.includes('fintech')) {
    return "Financial Services";
  }
  if (combinedText.includes('retail') || combinedText.includes('e-commerce') || combinedText.includes('consumer')) {
    return "Retail and Consumer";
  }
  if (combinedText.includes('energy') || combinedText.includes('renewable') || combinedText.includes('oil')) {
    return "Energy";
  }
  
  // Default fallback
  return "Technology and Innovation";
}

// Updated prompt to focus on industry-wide scenarios
export function makeQuadrantPrompt(
  caseTitle: string,
  industryContext: string,
  horizonYear: string,
  yAxis: SelectedPoint,
  xAxis: SelectedPoint,
  quadrant: QuadrantRequest
) {
  const industry = extractIndustry(caseTitle, industryContext);
  
  return `
CASE_TITLE: "${caseTitle}"
INDUSTRY: "${industry}"
HORIZON_YEAR: ${horizonYear}
X_AXIS: "${xAxis.factor}" (LOW = "Low", HIGH = "High")
Y_AXIS: "${yAxis.factor}" (LOW = "Low", HIGH = "High")

For the ${industry} industry scenario where Y is "${quadrant.yHigh}" and X is "${quadrant.xHigh}":

Write an industry-wide scenario analysis covering:
1. A brief 5-7 word summary headline
2. A 1-sentence header that starts with "In this scenario, ..."
3. 4-6 concise bullet points covering:
  (a) Overall industry market dynamics and competitive landscape
  (b) How companies in this industry typically respond/behave
  (c) Key operational and cost implications across the industry
  (d) Partnership patterns and ecosystem changes industry-wide
  (e) Regulatory or external factors affecting all industry players
  (f) Innovation trends and technology adoption patterns

FOCUS: Describe what happens to the ENTIRE ${industry} industry, not just one company.
PERSPECTIVE: Industry-wide trends, market conditions, and how all major players collectively respond.

STYLE
- Summary: 5-7 words max, captures essence of industry scenario
- Total content: ≤ 100 words for header plus all bullets combined
- Bullet verbs = present tense ("Industry accelerates…", "Companies pivot…", "Market consolidates…")
- Industry-focused language, not company-specific
- Ready for direct copy-paste into slides

Return a compact, valid JSON object (no extra prose, no markdown) in this schema:
{
  "summary": "Brief industry scenario headline",
  "header": "In this scenario, the ${industry} industry...",
  "bullets": [
    "Industry-wide dynamic 1",
    ...
    "Industry-wide dynamic 4 to 6"
  ]
}
REPLY WITH JSON ONLY.
  `.trim();
}

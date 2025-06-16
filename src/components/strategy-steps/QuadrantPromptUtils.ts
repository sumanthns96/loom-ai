import type { SelectedPoint } from "./types";

export type MatrixScenario = {
  summary: string;
  header: string;
  bullets: string[];
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

function extractIndustry(caseTitle: string, industryContext: string): string {
  const combinedText = `${caseTitle} ${industryContext}`.toLowerCase();
  
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
  
  return "Technology and Innovation";
}

// Updated prompt function to use axis contexts for consistency
export function makeQuadrantPrompt(
  caseTitle: string,
  industryContext: string,
  horizonYear: string,
  yAxis: SelectedPoint,
  xAxis: SelectedPoint,
  quadrant: QuadrantRequest,
  yContext?: { low: string; high: string },
  xContext?: { low: string; high: string }
) {
  const industry = extractIndustry(caseTitle, industryContext);
  
  // Use axis contexts if provided, otherwise use generic terms
  const yAxisHigh = yContext?.high || "High";
  const yAxisLow = yContext?.low || "Low";
  const xAxisHigh = xContext?.high || "High";
  const xAxisLow = xContext?.low || "Low";
  
  // Determine which axis values to use for this quadrant
  const quadrantYValue = quadrant.yHigh === "High" ? yAxisHigh : yAxisLow;
  const quadrantXValue = quadrant.xHigh === "High" ? xAxisHigh : xAxisLow;
  
  return `
SCENARIO GENERATION TASK:
Case: "${caseTitle}"
Industry: "${industry}"
Time Horizon: ${horizonYear}

AXIS DEFINITIONS:
Y-axis (${yAxis.factor}): "${yAxisLow}" ←→ "${yAxisHigh}"
X-axis (${xAxis.factor}): "${xAxisLow}" ←→ "${xAxisHigh}"

THIS QUADRANT: Y = "${quadrantYValue}", X = "${quadrantXValue}"

INSTRUCTIONS:
Create a ${industry} industry scenario where:
- ${yAxis.factor} tends toward: ${quadrantYValue}
- ${xAxis.factor} tends toward: ${quadrantXValue}

REQUIREMENTS:
1. SUMMARY: Create a 4-6 word headline capturing the quadrant essence
2. HEADER: Write "In this scenario, the ${industry} industry..." (one sentence, max 15 words)
3. BULLETS: Provide 3 concise points (max 12 words each) covering:
   - Market dynamics and competitive landscape
   - How companies typically respond/behave  
   - Operational and cost implications industry-wide

CRITICAL CONSTRAINT: Total response must not exceed 50 words across all fields combined.

STYLE REQUIREMENTS:
- Focus on INDUSTRY-WIDE trends, not individual companies
- Use present tense ("Industry consolidates...", "Companies pivot...")
- Make scenarios realistic and actionable
- Ensure consistency with axis labels: "${quadrantYValue}" and "${quadrantXValue}"
- BE EXTREMELY CONCISE - prioritize clarity over detail

OUTPUT FORMAT:
Return valid JSON only, no markdown, no explanations:
{
  "summary": "Brief 4-6 word industry scenario headline",
  "header": "In this scenario, the ${industry} industry [continues with scenario description]",
  "bullets": [
    "Industry-wide trend 1 (max 12 words)",
    "Industry-wide trend 2 (max 12 words)", 
    "Industry-wide trend 3 (max 12 words)"
  ]
}
  `.trim();
}

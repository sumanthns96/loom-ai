import { FC } from "react";
import type { SelectedPoint } from "./StepOne";

export interface MatrixScenario {
  header: string;
  bullets: string[];
}

interface ScenarioMatrixProps {
  scenarios: MatrixScenario[];
  axes: SelectedPoint[];
}

const colorStyles = [
  "text-blue-700 font-bold",
  "text-yellow-700 font-bold"
];

// Helper to trim axis summaries to max 6 words
function shortSummary(text: string) {
  if (!text) return "";
  const words = text.split(/\s+/);
  return words.length <= 6 ? text : words.slice(0, 6).join(" ") + "...";
}

// Optionally - let last word be 'increase'/'decrease'/'advance'/etc. so keep it
// returns [low, high] for the axis, guessing 'increase' and 'decrease' from keywords
function splitAxisSummary(axisText: string) {
  // Look for vs, /, → or common patterns
  if (!axisText) return ["", ""];
  const vsMatch = axisText.split(/\s+vs\.?\s+|\s*\/\s*|←|→|-|–/i);
  if (vsMatch.length === 2) {
    return vsMatch.map(w => w.trim());
  }
  // If no explicit divider, try to guess meaning: pick first/last word
  const words = axisText.split(/\s+/);
  if (words.length > 2) {
    return [words.slice(0, Math.floor(words.length/2)).join(" "), words.slice(Math.floor(words.length/2)).join(" ")];
  }
  // fallback to both the same
  return [axisText.trim(), axisText.trim()];
}

const ScenarioMatrix: FC<ScenarioMatrixProps> = ({ scenarios, axes }) => {
  if (!scenarios.length || axes.length !== 2) return null;

  // For labels
  const [yAxis, xAxis] = axes;
  // Axis summaries (truncate but keep direction words at end)
  const ySummaries = splitAxisSummary(yAxis.text);
  const xSummaries = splitAxisSummary(xAxis.text);

  return (
    <div className="mt-12 animate-fade-in">
      {/* Axes Legends */}
      <div className="flex flex-col items-center mb-6">
        <div className="text-2xl font-semibold mb-2 text-center">
          <span className={colorStyles[0]}>{yAxis.factor}</span>
          <span className="text-black font-normal"> → Y Axis, </span>
          <span className={colorStyles[1]}>{xAxis.factor}</span>
          <span className="text-black font-normal"> → X Axis</span>
        </div>
      </div>
      {/* 2x2 Matrix with labeled axes */}
      <div className="relative max-w-3xl mx-auto mb-7">
        {/* X axis labels */}
        <div className="flex justify-between items-center mb-1 px-2 sm:px-4">
          <span className="text-xs sm:text-sm text-gray-600 whitespace-nowrap">{shortSummary(xSummaries[0])}</span>
          <span className="text-xs sm:text-sm text-gray-600 whitespace-nowrap">{shortSummary(xSummaries[1])}</span>
        </div>
        <div className="grid grid-cols-2 grid-rows-2 gap-8">
          {/* 1st Row (y=high) */}
          <div className="rounded-xl border border-gray-200 bg-white shadow-sm p-7 min-h-[190px] flex flex-col">
            <div className="font-bold text-blue-900 text-base mb-2 leading-tight">
              {scenarios[0]?.header || <span className="text-gray-400 font-normal">Scenario could not be generated</span>}
            </div>
            {Array.isArray(scenarios[0]?.bullets) && scenarios[0]?.bullets.length > 0 ? (
              <ul className="pl-5 list-disc space-y-1 text-gray-800 text-base">
                {scenarios[0].bullets.map((pt, i) =>
                  <li key={i}>{pt}</li>
                )}
              </ul>
            ) : (
              <div className="text-gray-500 text-sm">[Scenario could not be generated; please retry or adjust your axis selection.]</div>
            )}
          </div>
          <div className="rounded-xl border border-gray-200 bg-white shadow-sm p-7 min-h-[190px] flex flex-col">
            <div className="font-bold text-blue-900 text-base mb-2 leading-tight">
              {scenarios[1]?.header || <span className="text-gray-400 font-normal">Scenario could not be generated</span>}
            </div>
            {Array.isArray(scenarios[1]?.bullets) && scenarios[1]?.bullets.length > 0 ? (
              <ul className="pl-5 list-disc space-y-1 text-gray-800 text-base">
                {scenarios[1].bullets.map((pt, i) =>
                  <li key={i}>{pt}</li>
                )}
              </ul>
            ) : (
              <div className="text-gray-500 text-sm">[Scenario could not be generated; please retry or adjust your axis selection.]</div>
            )}
          </div>
          {/* 2nd Row (y=low) */}
          <div className="rounded-xl border border-gray-200 bg-white shadow-sm p-7 min-h-[190px] flex flex-col">
            <div className="font-bold text-blue-900 text-base mb-2 leading-tight">
              {scenarios[2]?.header || <span className="text-gray-400 font-normal">Scenario could not be generated</span>}
            </div>
            {Array.isArray(scenarios[2]?.bullets) && scenarios[2]?.bullets.length > 0 ? (
              <ul className="pl-5 list-disc space-y-1 text-gray-800 text-base">
                {scenarios[2].bullets.map((pt, i) =>
                  <li key={i}>{pt}</li>
                )}
              </ul>
            ) : (
              <div className="text-gray-500 text-sm">[Scenario could not be generated; please retry or adjust your axis selection.]</div>
            )}
          </div>
          <div className="rounded-xl border border-gray-200 bg-white shadow-sm p-7 min-h-[190px] flex flex-col">
            <div className="font-bold text-blue-900 text-base mb-2 leading-tight">
              {scenarios[3]?.header || <span className="text-gray-400 font-normal">Scenario could not be generated</span>}
            </div>
            {Array.isArray(scenarios[3]?.bullets) && scenarios[3]?.bullets.length > 0 ? (
              <ul className="pl-5 list-disc space-y-1 text-gray-800 text-base">
                {scenarios[3].bullets.map((pt, i) =>
                  <li key={i}>{pt}</li>
                )}
              </ul>
            ) : (
              <div className="text-gray-500 text-sm">[Scenario could not be generated; please retry or adjust your axis selection.]</div>
            )}
          </div>
        </div>
        {/* Y axis labels */}
        <div className="absolute -left-12 top-0 h-full flex flex-col justify-between items-end">
          <span className="text-xs sm:text-sm text-gray-600 transform -translate-y-1 whitespace-nowrap">{shortSummary(ySummaries[0])}</span>
          <span className="text-xs sm:text-sm text-gray-600 transform translate-y-1 whitespace-nowrap">{shortSummary(ySummaries[1])}</span>
        </div>
      </div>
      {/* Optional: bottom margin for layout */}
      <div className="mb-6" />
    </div>
  );
};

export default ScenarioMatrix;

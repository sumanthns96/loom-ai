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

// Style classes
const colorStyles = [
  "text-blue-700 font-bold",
  "text-yellow-700 font-bold"
];

// Map each STEEP factor to direction labels [Negative/Low, Positive/High]
const FACTOR_DIRECTIONS: Record<string, [string, string]> = {
  Social:       ["Decrease", "Increase"],
  Technological:["Reduces", "Advances"],
  Economic:     ["Weakens", "Strengthens"],
  Environmental:["Worsens", "Improves"],
  Political:    ["Unfavours", "Favours"]
};

// Helper: trims summary to max 6 words, keeping last word if it's a direction
function shortSummaryWithDirection(text = ""): string {
  if (!text) return "";
  const words = text.trim().split(/\s+/);
  if (words.length <= 6) return text;
  // Try to keep last word if it's like "increase"/"decrease"/"advances"
  const last = words[words.length - 1];
  return words.slice(0, 5).join(" ") + " " + last;
}

// Helper: extracts [low, high], works for "Adoption decreases/increases", "Advances/Reduces"
function splitAxisSummary(axisText: string) {
  if (!axisText) return ["", ""];
  const vsMatch = axisText.split(/\s+vs\.?\s+|\s*\/\s*|←|→|-|–/i);
  if (vsMatch.length === 2) {
    return vsMatch.map(w => w.trim());
  }
  // fallback as before
  const words = axisText.trim().split(/\s+/);
  if (words.length > 2) {
    return [
      words.slice(0, Math.floor(words.length/2)).join(" "),
      words.slice(Math.floor(words.length/2)).join(" ")
    ];
  }
  return [axisText.trim(), axisText.trim()];
}

// Color mapping for label ends
const endLabelColors = ["text-red-600 font-bold", "text-green-600 font-bold"];

// Utility to capitalize
const cap = (str: string) => str.charAt(0).toUpperCase() + str.slice(1);

const ScenarioMatrix: FC<ScenarioMatrixProps> = ({ scenarios, axes }) => {
  if (!scenarios.length || axes.length !== 2) return null;

  // Derive factor labels for axes and their direction ends
  const [yAxis, xAxis] = axes;

  // Factor directions—for fallback, default to generic Increase/Decrease
  const yDirs = FACTOR_DIRECTIONS[yAxis.factor] || ["Decrease", "Increase"];
  const xDirs = FACTOR_DIRECTIONS[xAxis.factor] || ["Decrease", "Increase"];

  return (
    <div className="mt-12 animate-fade-in relative">
      {/* Axis overlays (absolute on grid) */}
      <div className="relative max-w-3xl mx-auto mb-7">
        <div className="relative" style={{ minHeight: 400 }}>
          {/* Horizontal X axis bar */}
          <div className="absolute left-0 right-0 top-1/2 transform -translate-y-1/2 z-10 pointer-events-none select-none flex items-center">
            {/* Left label */}
            <span
              className={`absolute -left-2 -translate-x-full whitespace-nowrap ${endLabelColors[0]} text-base sm:text-lg`}
              style={{ top: "50%", transform: "translateY(-50%) translateX(-8px)" }}
            >
              {xDirs[0]}
            </span>
            {/* Main bar */}
            <div className="w-full border-t-8 border-blue-700 relative flex justify-center items-center">
              <span className="absolute left-1/2 -translate-x-1/2 bg-white px-4 py-1 text-base sm:text-lg text-blue-900 font-extrabold uppercase tracking-wide shadow -mt-2 z-20 border-2 border-blue-700 rounded-md">
                {xAxis.factor}
              </span>
            </div>
            {/* Right label */}
            <span
              className={`absolute -right-2 translate-x-full whitespace-nowrap ${endLabelColors[1]} text-base sm:text-lg`}
              style={{ top: "50%", right: 0, transform: "translateY(-50%) translateX(8px)" }}
            >
              {xDirs[1]}
            </span>
          </div>
          {/* Vertical Y axis bar */}
          <div className="absolute top-0 bottom-0 left-1/2 transform -translate-x-1/2 z-10 pointer-events-none select-none flex flex-col items-center">
            {/* Top label */}
            <span
              className={`absolute -top-2 -translate-y-full whitespace-nowrap ${endLabelColors[1]} text-base sm:text-lg`}
              style={{ left: "50%", transform: "translateX(-50%) translateY(-8px)" }}
            >
              {yDirs[1]}
            </span>
            {/* Main bar */}
            <div className="h-full border-l-8 border-blue-700 relative flex flex-col justify-center items-center">
              <span className="absolute top-1/2 -translate-y-1/2 -left-1/2 -rotate-90 origin-center bg-white px-4 py-1 text-base sm:text-lg text-blue-900 font-extrabold uppercase tracking-wide shadow z-20 border-2 border-blue-700 rounded-md">
                {yAxis.factor}
              </span>
            </div>
            {/* Bottom label */}
            <span
              className={`absolute -bottom-2 translate-y-full whitespace-nowrap ${endLabelColors[0]} text-base sm:text-lg`}
              style={{ left: "50%", bottom: 0, transform: "translateX(-50%) translateY(8px)" }}
            >
              {yDirs[0]}
            </span>
          </div>
          {/* Grid matrix overlayed atop bars (z-20) */}
          <div className="relative z-20 grid grid-cols-2 grid-rows-2 gap-8 pt-8 pb-8 pl-8 pr-8">
            {/* Top Left */}
            <div className="rounded-xl border border-gray-200 bg-white shadow-sm p-7 min-h-[190px] flex flex-col">
              <div className="font-bold text-blue-900 text-base mb-2 leading-tight">
                {scenarios[0]?.header || <span className="text-gray-400 font-normal">Scenario could not be generated</span>}
              </div>
              {Array.isArray(scenarios[0]?.bullets) && scenarios[0]?.bullets.length > 0 ? (
                <ul className="pl-5 list-disc space-y-1 text-gray-800 text-base">
                  {scenarios[0].bullets.map((pt, i) => (
                    <li key={i}>{pt}</li>
                  ))}
                </ul>
              ) : (
                <div className="text-gray-500 text-sm">[Scenario could not be generated; please retry or adjust your axis selection.]</div>
              )}
            </div>
            {/* Top Right */}
            <div className="rounded-xl border border-gray-200 bg-white shadow-sm p-7 min-h-[190px] flex flex-col">
              <div className="font-bold text-blue-900 text-base mb-2 leading-tight">
                {scenarios[1]?.header || <span className="text-gray-400 font-normal">Scenario could not be generated</span>}
              </div>
              {Array.isArray(scenarios[1]?.bullets) && scenarios[1]?.bullets.length > 0 ? (
                <ul className="pl-5 list-disc space-y-1 text-gray-800 text-base">
                  {scenarios[1].bullets.map((pt, i) => (
                    <li key={i}>{pt}</li>
                  ))}
                </ul>
              ) : (
                <div className="text-gray-500 text-sm">[Scenario could not be generated; please retry or adjust your axis selection.]</div>
              )}
            </div>
            {/* Bottom Left */}
            <div className="rounded-xl border border-gray-200 bg-white shadow-sm p-7 min-h-[190px] flex flex-col">
              <div className="font-bold text-blue-900 text-base mb-2 leading-tight">
                {scenarios[2]?.header || <span className="text-gray-400 font-normal">Scenario could not be generated</span>}
              </div>
              {Array.isArray(scenarios[2]?.bullets) && scenarios[2]?.bullets.length > 0 ? (
                <ul className="pl-5 list-disc space-y-1 text-gray-800 text-base">
                  {scenarios[2].bullets.map((pt, i) => (
                    <li key={i}>{pt}</li>
                  ))}
                </ul>
              ) : (
                <div className="text-gray-500 text-sm">[Scenario could not be generated; please retry or adjust your axis selection.]</div>
              )}
            </div>
            {/* Bottom Right */}
            <div className="rounded-xl border border-gray-200 bg-white shadow-sm p-7 min-h-[190px] flex flex-col">
              <div className="font-bold text-blue-900 text-base mb-2 leading-tight">
                {scenarios[3]?.header || <span className="text-gray-400 font-normal">Scenario could not be generated</span>}
              </div>
              {Array.isArray(scenarios[3]?.bullets) && scenarios[3]?.bullets.length > 0 ? (
                <ul className="pl-5 list-disc space-y-1 text-gray-800 text-base">
                  {scenarios[3].bullets.map((pt, i) => (
                    <li key={i}>{pt}</li>
                  ))}
                </ul>
              ) : (
                <div className="text-gray-500 text-sm">[Scenario could not be generated; please retry or adjust your axis selection.]</div>
              )}
            </div>
          </div>
        </div>
      </div>
      {/* Optional: bottom margin for layout */}
      <div className="mb-6" />
    </div>
  );
};

export default ScenarioMatrix;

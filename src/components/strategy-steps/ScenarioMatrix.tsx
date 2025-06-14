
import { FC } from "react";
import type { SelectedPoint } from "./StepOne";

export interface MatrixScenario {
  header: string;
  bullets: string[];
}

interface ScenarioMatrixProps {
  scenarios: MatrixScenario[];
  axes: SelectedPoint[];
  // new: axis context phrases from Gemini: array [{low, high}, {low, high}]
  axisContexts?: { low: string; high: string }[];
}

const endLabelColors = ["text-red-600 font-bold", "text-green-600 font-bold"];

// Utility: capitalize first
const cap = (str: string) => str.charAt(0).toUpperCase() + str.slice(1);

const ScenarioMatrix: FC<ScenarioMatrixProps> = ({ scenarios, axes, axisContexts }) => {
  if (!scenarios.length || axes.length !== 2) return null;

  const [yAxis, xAxis] = axes;

  // fallback directions if context is missing
  const fallback = [{ low: "Low", high: "High" }, { low: "Low", high: "High" }];
  const [yContext, xContext] = axisContexts && axisContexts.length === 2 ? axisContexts : fallback;

  return (
    <div className="mt-12 animate-fade-in relative">
      {/* Axis overlays (absolute on grid) */}
      <div className="relative max-w-3xl mx-auto mb-7">
        <div className="relative" style={{ minHeight: 420 }}>
          {/* Horizontal X axis bar */}
          <div className="absolute left-0 right-0 top-1/2 -translate-y-1/2 z-10 pointer-events-none select-none flex items-center">
            {/* Left label */}
            <span
              className={`absolute left-0 -translate-x-full whitespace-nowrap ${endLabelColors[0]} text-sm sm:text-base bg-white px-2 py-0.5 rounded shadow`}
              style={{
                top: "50%",
                transform: "translateY(-60%) translateX(-10px)",
                maxWidth: 120,
                textAlign: "right",
                overflow: "hidden",
                textOverflow: "ellipsis"
              }}
              title={xContext.low}
            >
              {cap(xContext.low)}
            </span>
            {/* Main bar */}
            <div className="w-full border-t-8 border-blue-700 relative flex justify-center items-center min-w-[220px]">
              <span className="absolute left-1/2 -translate-x-1/2 bg-white px-4 py-1 text-base sm:text-lg text-blue-900 font-extrabold uppercase tracking-wide shadow -mt-2 z-20 border-2 border-blue-700 rounded-md whitespace-nowrap">
                {xAxis.factor}
              </span>
            </div>
            {/* Right label */}
            <span
              className={`absolute right-0 translate-x-full whitespace-nowrap ${endLabelColors[1]} text-sm sm:text-base bg-white px-2 py-0.5 rounded shadow`}
              style={{
                top: "50%",
                right: 0,
                transform: "translateY(-60%) translateX(8px)",
                maxWidth: 120,
                textAlign: "left",
                overflow: "hidden",
                textOverflow: "ellipsis"
              }}
              title={xContext.high}
            >
              {cap(xContext.high)}
            </span>
          </div>
          {/* Vertical Y axis bar */}
          <div className="absolute top-0 bottom-0 left-1/2 -translate-x-1/2 z-10 pointer-events-none select-none flex flex-col items-center">
            {/* Top label */}
            <span
              className={`absolute top-0 -translate-y-full whitespace-nowrap ${endLabelColors[1]} text-sm sm:text-base bg-white px-2 py-0.5 rounded shadow`}
              style={{
                left: "50%",
                transform: "translateX(-50%) translateY(-10px)",
                maxWidth: 120,
                textAlign: "center",
                overflow: "hidden",
                textOverflow: "ellipsis"
              }}
              title={yContext.high}
            >
              {cap(yContext.high)}
            </span>
            {/* Main bar */}
            <div className="h-full border-l-8 border-blue-700 relative flex flex-col justify-center items-center min-h-[220px]">
              <span className="absolute top-1/2 -translate-y-1/2 -left-1/2 -rotate-90 origin-center bg-white px-4 py-1 text-base sm:text-lg text-blue-900 font-extrabold uppercase tracking-wide shadow z-20 border-2 border-blue-700 rounded-md whitespace-nowrap">
                {yAxis.factor}
              </span>
            </div>
            {/* Bottom label */}
            <span
              className={`absolute bottom-0 translate-y-full whitespace-nowrap ${endLabelColors[0]} text-sm sm:text-base bg-white px-2 py-0.5 rounded shadow`}
              style={{
                left: "50%",
                transform: "translateX(-50%) translateY(10px)",
                maxWidth: 120,
                textAlign: "center",
                overflow: "hidden",
                textOverflow: "ellipsis"
              }}
              title={yContext.low}
            >
              {cap(yContext.low)}
            </span>
          </div>
          {/* Grid overlay */}
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
      <div className="mb-6" />
    </div>
  );
};

export default ScenarioMatrix;

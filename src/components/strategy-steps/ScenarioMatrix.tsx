import { FC } from "react";
import type { SelectedPoint } from "./types";

export interface MatrixScenario {
  summary: string;
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
    <div className="mt-12 animate-fade-in">
      {/* Container with proper padding for all labels */}
      <div className="max-w-4xl mx-auto px-20 py-16">
        
        {/* Y-axis (vertical) labels - positioned outside the grid */}
        <div className="relative">
          {/* Y-axis top label */}
          <div className="absolute -top-8 left-1/2 transform -translate-x-1/2">
            <span className={`${endLabelColors[1]} text-xs whitespace-nowrap px-2 py-1 bg-white rounded shadow`}>
              {cap(yContext.high)}
            </span>
          </div>
          
          {/* Y-axis bottom label */}
          <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2">
            <span className={`${endLabelColors[0]} text-xs whitespace-nowrap px-2 py-1 bg-white rounded shadow`}>
              {cap(yContext.low)}
            </span>
          </div>
          
          {/* Main content area with axes */}
          <div className="relative" style={{ minHeight: 480 }}>
            
            {/* Horizontal X axis */}
            <div className="absolute left-0 right-0 top-1/2 transform -translate-y-1/2 z-10">
              <div className="flex items-center">
                {/* X-axis left label */}
                <div className="absolute -left-16 top-1/2 transform -translate-y-1/2">
                  <span className={`${endLabelColors[0]} text-xs whitespace-nowrap px-2 py-1 bg-white rounded shadow`}>
                    {cap(xContext.low)}
                  </span>
                </div>
                
                {/* X-axis line and label */}
                <div className="w-full border-t-6 border-blue-700 relative">
                  <div className="absolute left-1/2 top-0 transform -translate-x-1/2 -translate-y-1/2">
                    <span className="bg-blue-700 text-white px-3 py-1 text-sm font-bold uppercase tracking-wide rounded">
                      {xAxis.factor}
                    </span>
                  </div>
                </div>
                
                {/* X-axis right label */}
                <div className="absolute -right-16 top-1/2 transform -translate-y-1/2">
                  <span className={`${endLabelColors[1]} text-xs whitespace-nowrap px-2 py-1 bg-white rounded shadow`}>
                    {cap(xContext.high)}
                  </span>
                </div>
              </div>
            </div>
            
            {/* Vertical Y axis */}
            <div className="absolute top-0 bottom-0 left-1/2 transform -translate-x-1/2 z-10">
              <div className="h-full border-l-6 border-blue-700 relative">
                <div className="absolute left-0 top-1/2 transform -translate-x-1/2 -translate-y-1/2 -rotate-90">
                  <span className="bg-blue-700 text-white px-3 py-1 text-sm font-bold uppercase tracking-wide rounded whitespace-nowrap">
                    {yAxis.factor}
                  </span>
                </div>
              </div>
            </div>
            
            {/* Scenario grid - positioned above the axes */}
            <div className="relative z-20 grid grid-cols-2 grid-rows-2 gap-6 p-8">
              {/* Top Left */}
              <div className="rounded-xl border border-gray-200 bg-white shadow-sm p-6 min-h-[180px] flex flex-col">
                {scenarios[0]?.summary && (
                  <div className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">
                    {scenarios[0].summary}
                  </div>
                )}
                <div className="font-bold text-blue-900 text-sm mb-2 leading-tight">
                  {scenarios[0]?.header || <span className="text-gray-400 font-normal">Scenario could not be generated</span>}
                </div>
                {Array.isArray(scenarios[0]?.bullets) && scenarios[0]?.bullets.length > 0 ? (
                  <ul className="pl-4 list-disc space-y-1 text-gray-800 text-sm">
                    {scenarios[0].bullets.map((pt, i) => (
                      <li key={i}>{pt}</li>
                    ))}
                  </ul>
                ) : (
                  <div className="text-gray-500 text-xs">[Scenario could not be generated; please retry or adjust your axis selection.]</div>
                )}
              </div>
              
              {/* Top Right */}
              <div className="rounded-xl border border-gray-200 bg-white shadow-sm p-6 min-h-[180px] flex flex-col">
                {scenarios[1]?.summary && (
                  <div className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">
                    {scenarios[1].summary}
                  </div>
                )}
                <div className="font-bold text-blue-900 text-sm mb-2 leading-tight">
                  {scenarios[1]?.header || <span className="text-gray-400 font-normal">Scenario could not be generated</span>}
                </div>
                {Array.isArray(scenarios[1]?.bullets) && scenarios[1]?.bullets.length > 0 ? (
                  <ul className="pl-4 list-disc space-y-1 text-gray-800 text-sm">
                    {scenarios[1].bullets.map((pt, i) => (
                      <li key={i}>{pt}</li>
                    ))}
                  </ul>
                ) : (
                  <div className="text-gray-500 text-xs">[Scenario could not be generated; please retry or adjust your axis selection.]</div>
                )}
              </div>
              
              {/* Bottom Left */}
              <div className="rounded-xl border border-gray-200 bg-white shadow-sm p-6 min-h-[180px] flex flex-col">
                {scenarios[2]?.summary && (
                  <div className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">
                    {scenarios[2].summary}
                  </div>
                )}
                <div className="font-bold text-blue-900 text-sm mb-2 leading-tight">
                  {scenarios[2]?.header || <span className="text-gray-400 font-normal">Scenario could not be generated</span>}
                </div>
                {Array.isArray(scenarios[2]?.bullets) && scenarios[2]?.bullets.length > 0 ? (
                  <ul className="pl-4 list-disc space-y-1 text-gray-800 text-sm">
                    {scenarios[2].bullets.map((pt, i) => (
                      <li key={i}>{pt}</li>
                    ))}
                  </ul>
                ) : (
                  <div className="text-gray-500 text-xs">[Scenario could not be generated; please retry or adjust your axis selection.]</div>
                )}
              </div>
              
              {/* Bottom Right */}
              <div className="rounded-xl border border-gray-200 bg-white shadow-sm p-6 min-h-[180px] flex flex-col">
                {scenarios[3]?.summary && (
                  <div className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">
                    {scenarios[3].summary}
                  </div>
                )}
                <div className="font-bold text-blue-900 text-sm mb-2 leading-tight">
                  {scenarios[3]?.header || <span className="text-gray-400 font-normal">Scenario could not be generated</span>}
                </div>
                {Array.isArray(scenarios[3]?.bullets) && scenarios[3]?.bullets.length > 0 ? (
                  <ul className="pl-4 list-disc space-y-1 text-gray-800 text-sm">
                    {scenarios[3].bullets.map((pt, i) => (
                      <li key={i}>{pt}</li>
                    ))}
                  </ul>
                ) : (
                  <div className="text-gray-500 text-xs">[Scenario could not be generated; please retry or adjust your axis selection.]</div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ScenarioMatrix;

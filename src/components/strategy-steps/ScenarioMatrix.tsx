
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

const ScenarioMatrix: FC<ScenarioMatrixProps> = ({ scenarios, axes }) => {
  if (!scenarios.length || axes.length !== 2) return null;

  return (
    <div className="mt-12 animate-fade-in">
      {/* Axes Legends */}
      <div className="flex flex-col items-center mb-6">
        <div className="text-2xl font-semibold mb-2 text-center">
          <span className={colorStyles[0]}>{axes[0].factor}</span>
          <span className="text-black font-normal"> → Y Axis, </span>
          <span className={colorStyles[1]}>{axes[1].factor}</span>
          <span className="text-black font-normal"> → X Axis</span>
        </div>
        <div className="flex items-center gap-8">
          <span className={colorStyles[0]}>{axes[0].factor}</span>
          <span className="text-gray-400 font-medium">as Y-axis</span>
          <span className={colorStyles[1]}>{axes[1].factor}</span>
          <span className="text-gray-400 font-medium">as X-axis</span>
        </div>
      </div>
      {/* 2x2 Matrix */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 max-w-3xl mx-auto mb-7">
        {scenarios.map((sc, idx) => (
          <div
            key={idx}
            className="rounded-xl border border-gray-200 bg-white shadow-sm p-7 min-h-[190px] flex flex-col"
          >
            <div className="font-bold text-blue-900 text-base mb-2 leading-tight">
              {sc.header || <span className="text-gray-400 font-normal">Scenario could not be generated</span>}
            </div>
            {Array.isArray(sc.bullets) && sc.bullets.length > 0 ? (
              <ul className="pl-5 list-disc space-y-1 text-gray-800 text-base">
                {sc.bullets.map((pt, i) =>
                  <li key={i}>{pt}</li>
                )}
              </ul>
            ) : (
              <div className="text-gray-500 text-sm">[Scenario could not be generated; please retry or adjust your axis selection.]</div>
            )}
          </div>
        ))}
      </div>
      {/* Quadrant axis explanations */}
      <div className="mt-6 flex flex-col sm:flex-row justify-between gap-4 px-2 text-base text-gray-700 font-normal">
        <div className="flex-1">
          <span className={colorStyles[0]}>Y:</span> {axes[0].text}
        </div>
        <div className="flex-1">
          <span className={colorStyles[1]}>X:</span> {axes[1].text}
        </div>
      </div>
    </div>
  );
};

export default ScenarioMatrix;

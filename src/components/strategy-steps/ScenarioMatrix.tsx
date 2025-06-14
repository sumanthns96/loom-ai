
import { FC } from "react";
import type { SelectedPoint } from "./StepOne";
import type { MatrixScenario } from "./QuadrantPromptUtils";

// Just visual 2x2 matrix for the 4 scenarios.
interface ScenarioMatrixProps {
  scenarios: MatrixScenario[];
  axes: SelectedPoint[];
}

const colorStyles = [
  "text-blue-700",
  "text-yellow-700"
];

const ScenarioMatrix: FC<ScenarioMatrixProps> = ({ scenarios, axes }) => {
  if (!scenarios.length || axes.length !== 2) return null;

  // For layout, map scenarios to 2x2 grid
  // Order: Top-left, top-right, bottom-left, bottom-right
  // Convention: [0]: both favor, [1]: Y favor X against, [2]: both against, [3]: X favor Y against

  return (
    <div className="mt-12 animate-fade-in">
      {/* Axes Legends */}
      <div className="flex flex-col items-center mb-6">
        <div className="text-xl font-semibold mb-2">
          <span>
            <span className={colorStyles[0]}>{axes[0].factor}</span>
            {" "}→ Y Axis,{" "}
            <span className={colorStyles[1]}>{axes[1].factor}</span>
            {" "}→ X Axis
          </span>
        </div>
        <div className="flex items-center gap-8">
          <span className="font-bold text-blue-700">{axes[0].factor}</span>
          <span className="text-gray-400">as Y-axis</span>
          <span className="font-bold text-yellow-700">{axes[1].factor}</span>
          <span className="text-gray-400">as X-axis</span>
        </div>
      </div>
      {/* 2x2 Matrix */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-3xl mx-auto mb-7">
        {scenarios.map((sc, idx) => (
          <div
            key={idx}
            className="rounded-xl border border-gray-200 bg-white shadow-sm p-6 min-h-[160px] flex flex-col"
          >
            <div className="font-bold text-blue-900 text-lg mb-2">{sc.title}</div>
            <div className="text-gray-700 text-base">{sc.description}</div>
          </div>
        ))}
      </div>
      {/* Quadrant axis explanations */}
      <div className="mt-6 flex flex-col sm:flex-row justify-between gap-4 px-2 text-base text-gray-700 font-normal">
        <div className="flex-1">
          <span className="font-bold text-blue-700">Y:</span> {axes[0].text}
        </div>
        <div className="flex-1">
          <span className="font-bold text-yellow-700">X:</span> {axes[1].text}
        </div>
      </div>
    </div>
  );
};

export default ScenarioMatrix;

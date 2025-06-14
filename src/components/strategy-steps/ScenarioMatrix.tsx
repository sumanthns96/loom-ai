
import { FC } from "react";
import type { SelectedPoint } from "./StepOne";
import type { MatrixScenario } from "./QuadrantPromptUtils";

// Just visual 2x2 matrix for the 4 scenarios.
interface ScenarioMatrixProps {
  scenarios: MatrixScenario[];
  axes: SelectedPoint[];
}

const ScenarioMatrix: FC<ScenarioMatrixProps> = ({ scenarios, axes }) => {
  if (!scenarios.length || axes.length !== 2) return null;

  return (
    <div className="mt-10">
      {/* Axes Legends */}
      <div className="flex flex-col items-center mb-6">
        <div className="text-lg font-semibold mb-2">
          {axes[0].factor} → Y Axis, {axes[1].factor} → X Axis
        </div>
        <div className="flex items-center">
          <span className="font-bold text-blue-700">{axes[0].factor}</span>
          <span className="mx-4 text-gray-400">as Y-axis</span>
          <span className="font-bold text-yellow-700">{axes[1].factor}</span>
          <span className="mx-4 text-gray-400">as X-axis</span>
        </div>
      </div>
      {/* 2x2 Matrix */}
      <div className="grid grid-cols-2 grid-rows-2 gap-4 max-w-3xl mx-auto">
        {scenarios.map((sc, idx) => (
          <div key={idx} className="border rounded-lg bg-gray-50 shadow px-4 py-5">
            <div className="font-bold mb-2 text-blue-900">{sc.title}</div>
            <div className="text-sm text-gray-700">{sc.description}</div>
          </div>
        ))}
      </div>
      {/* Quadrant Labels, Arrow Legends (optional) */}
      <div className="mt-4 flex justify-between px-8 text-sm text-gray-600 font-medium">
        <span>Y: {axes[0].text}</span>
        <span>X: {axes[1].text}</span>
      </div>
    </div>
  );
};

export default ScenarioMatrix;

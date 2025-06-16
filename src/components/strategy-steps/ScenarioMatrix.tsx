
import { FC } from "react";
import AxisLines from "./AxisLines";
import CornerLabels from "./CornerLabels";
import ScenarioGrid from "./ScenarioGrid";
import type { SelectedPoint } from "./types";

export interface MatrixScenario {
  summary: string;
  header: string;
  bullets: string[];
}

interface ScenarioMatrixProps {
  scenarios: MatrixScenario[];
  axes: SelectedPoint[];
  axisContexts?: { low: string; high: string }[];
}

const ScenarioMatrix: FC<ScenarioMatrixProps> = ({ scenarios, axes, axisContexts }) => {
  if (!scenarios.length || axes.length !== 2) return null;

  return (
    <div className="mt-12 animate-fade-in">
      {/* Container with proper spacing for axis lines and labels */}
      <div className="max-w-7xl mx-auto px-12 py-20">
        
        {/* Main matrix container with proper dimensions */}
        <div className="relative w-full h-[700px] bg-gradient-to-br from-slate-50 via-white to-blue-50 rounded-3xl shadow-2xl border border-gray-200/50">
          
          {/* Axis lines - positioned to be clearly visible */}
          <AxisLines axes={axes} />
          
          {/* Scenario cards grid - positioned with proper spacing from center */}
          <ScenarioGrid scenarios={scenarios} />
          
          {/* Corner labels - positioned outside the card areas */}
          <CornerLabels axes={axes} axisContexts={axisContexts} />
        </div>
      </div>
    </div>
  );
};

export default ScenarioMatrix;


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
  // new: axis context phrases from Gemini: array [{low, high}, {low, high}]
  axisContexts?: { low: string; high: string }[];
}

const ScenarioMatrix: FC<ScenarioMatrixProps> = ({ scenarios, axes, axisContexts }) => {
  if (!scenarios.length || axes.length !== 2) return null;

  return (
    <div className="mt-12 animate-fade-in">
      {/* Container with enhanced 3D perspective */}
      <div className="max-w-6xl mx-auto px-8 py-16 perspective-[1000px]">
        
        {/* Main 3D matrix container */}
        <div className="relative transform-gpu" style={{ 
          transformStyle: 'preserve-3d',
          transform: 'rotateX(5deg) rotateY(-2deg)',
          minHeight: 600 
        }}>
          
          {/* Enhanced background grid with 3D effect */}
          <div className="absolute inset-0 bg-gradient-to-br from-slate-50 via-white to-blue-50 rounded-3xl shadow-2xl border border-gray-200/50 transform-gpu" 
               style={{ transform: 'translateZ(-20px)' }}>
            {/* Subtle grid pattern overlay */}
            <div className="absolute inset-0 opacity-30" 
                 style={{
                   backgroundImage: `
                     linear-gradient(to right, rgba(148, 163, 184, 0.1) 1px, transparent 1px),
                     linear-gradient(to bottom, rgba(148, 163, 184, 0.1) 1px, transparent 1px)
                   `,
                   backgroundSize: '40px 40px'
                 }}>
            </div>
          </div>

          <ScenarioGrid scenarios={scenarios} />
          <AxisLines axes={axes} />
        </div>

        <CornerLabels axes={axes} axisContexts={axisContexts} />
      </div>
    </div>
  );
};

export default ScenarioMatrix;

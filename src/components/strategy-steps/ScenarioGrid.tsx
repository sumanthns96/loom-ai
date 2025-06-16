
import { FC } from "react";
import ScenarioCard from "./ScenarioCard";
import type { MatrixScenario } from "./ScenarioMatrix";

interface ScenarioGridProps {
  scenarios: MatrixScenario[];
}

const colorSchemes = [
  {
    primary: "text-green-600",
    background: "bg-green-50",
    glow: "bg-gradient-to-br from-green-500/20 to-emerald-500/20",
    dot: "bg-green-500"
  },
  {
    primary: "text-blue-600",
    background: "bg-blue-50",
    glow: "bg-gradient-to-br from-blue-500/20 to-purple-500/20",
    dot: "bg-blue-500"
  },
  {
    primary: "text-orange-600",
    background: "bg-orange-50",
    glow: "bg-gradient-to-br from-orange-500/20 to-red-500/20",
    dot: "bg-orange-500"
  },
  {
    primary: "text-purple-600",
    background: "bg-purple-50",
    glow: "bg-gradient-to-br from-purple-500/20 to-pink-500/20",
    dot: "bg-purple-500"
  }
];

const ScenarioGrid: FC<ScenarioGridProps> = ({ scenarios }) => {
  return (
    <div className="absolute inset-0 z-20">
      {/* Top Left Quadrant */}
      <div className="absolute top-8 left-8 w-[calc(50%-24px)] h-[calc(50%-24px)]">
        <ScenarioCard 
          scenario={scenarios[1]} 
          colorScheme={colorSchemes[1]} 
        />
      </div>
      
      {/* Top Right Quadrant */}
      <div className="absolute top-8 right-8 w-[calc(50%-24px)] h-[calc(50%-24px)]">
        <ScenarioCard 
          scenario={scenarios[0]} 
          colorScheme={colorSchemes[0]} 
        />
      </div>
      
      {/* Bottom Left Quadrant */}
      <div className="absolute bottom-8 left-8 w-[calc(50%-24px)] h-[calc(50%-24px)]">
        <ScenarioCard 
          scenario={scenarios[2]} 
          colorScheme={colorSchemes[2]} 
        />
      </div>
      
      {/* Bottom Right Quadrant */}
      <div className="absolute bottom-8 right-8 w-[calc(50%-24px)] h-[calc(50%-24px)]">
        <ScenarioCard 
          scenario={scenarios[3]} 
          colorScheme={colorSchemes[3]} 
        />
      </div>
    </div>
  );
};

export default ScenarioGrid;

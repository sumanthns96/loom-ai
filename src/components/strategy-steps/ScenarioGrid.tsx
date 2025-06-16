
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
    /* Enhanced 3D scenario grid - LOWEST Z-INDEX FOR CARDS */
    <div className="relative z-[5] grid grid-cols-2 grid-rows-2 gap-6 pt-28 pb-16 px-20 transform-gpu"
         style={{ transform: 'translateZ(10px)' }}>
      
      {/* Top Left - Index 1 */}
      <ScenarioCard 
        scenario={scenarios[1]} 
        colorScheme={colorSchemes[1]} 
      />
      
      {/* Top Right - Index 0 */}
      <ScenarioCard 
        scenario={scenarios[0]} 
        colorScheme={colorSchemes[0]} 
      />
      
      {/* Bottom Left - Index 2 */}
      <ScenarioCard 
        scenario={scenarios[2]} 
        colorScheme={colorSchemes[2]} 
      />
      
      {/* Bottom Right - Index 3 */}
      <ScenarioCard 
        scenario={scenarios[3]} 
        colorScheme={colorSchemes[3]} 
      />
    </div>
  );
};

export default ScenarioGrid;

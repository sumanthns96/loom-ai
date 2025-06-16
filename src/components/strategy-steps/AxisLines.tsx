
import { FC } from "react";
import type { SelectedPoint } from "./types";

interface AxisLinesProps {
  axes: SelectedPoint[];
}

const AxisLines: FC<AxisLinesProps> = ({ axes }) => {
  if (axes.length !== 2) return null;

  const [yAxis, xAxis] = axes;

  return (
    <>
      {/* Central axis lines - POSITIONED AFTER CARDS TO APPEAR ON TOP */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-[50]">
        {/* Horizontal axis line - spans most of the container width */}
        <div className="absolute w-[75%] h-1 bg-gradient-to-r from-blue-600 via-blue-700 to-blue-600 rounded-full shadow-lg transform-gpu"
             style={{ 
               filter: 'drop-shadow(0 4px 8px rgba(59, 130, 246, 0.3))',
               transform: 'translateZ(40px)'
             }}>
          {/* Axis glow effect */}
          <div className="absolute inset-0 bg-blue-400 rounded-full blur-sm opacity-50"></div>
        </div>
        
        {/* Vertical axis line - spans most of the container height */}
        <div className="absolute h-[75%] w-1 bg-gradient-to-b from-blue-600 via-blue-700 to-blue-600 rounded-full shadow-lg transform-gpu"
             style={{ 
               filter: 'drop-shadow(4px 0 8px rgba(59, 130, 246, 0.3))',
               transform: 'translateZ(40px)'
             }}>
          {/* Axis glow effect */}
          <div className="absolute inset-0 bg-blue-400 rounded-full blur-sm opacity-50"></div>
        </div>
      </div>

      {/* Axis labels positioned at the vertex - HIGHEST LAYER */}
      <div className="absolute inset-0 pointer-events-none z-[60]">
        {/* X-axis label (e.g., SOCIAL) - horizontal across X axis */}
        <div className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2">
          <div className="bg-gradient-to-r from-blue-700 to-blue-800 text-white px-4 py-1 text-sm font-bold uppercase tracking-wider rounded-lg shadow-xl border border-blue-600 text-center whitespace-nowrap"
               style={{ transform: 'translateZ(50px)' }}>
            {xAxis.factor}
          </div>
        </div>

        {/* Y-axis label (e.g., TECHNOLOGICAL) - vertical across Y axis */}
        <div className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 rotate-[-90deg]">
          <div className="bg-gradient-to-r from-blue-700 to-blue-800 text-white px-4 py-1 text-sm font-bold uppercase tracking-wider rounded-lg shadow-xl border border-blue-600 text-center whitespace-nowrap"
               style={{ transform: 'translateZ(50px)' }}>
            {yAxis.factor}
          </div>
        </div>
      </div>
    </>
  );
};

export default AxisLines;

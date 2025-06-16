
import { FC } from "react";
import type { SelectedPoint } from "./types";

interface CornerLabelsProps {
  axes: SelectedPoint[];
  axisContexts?: { low: string; high: string }[];
}

// Utility: capitalize first
const cap = (str: string) => str.charAt(0).toUpperCase() + str.slice(1);

const CornerLabels: FC<CornerLabelsProps> = ({ axes, axisContexts }) => {
  if (axes.length !== 2) return null;

  const [yAxis, xAxis] = axes;

  // fallback directions if context is missing
  const fallback = [{ low: "Low", high: "High" }, { low: "Low", high: "High" }];
  const [yContext, xContext] = axisContexts && axisContexts.length === 2 ? axisContexts : fallback;

  return (
    /* Corner direction labels - COMPLETELY SEPARATE CONTAINER WITH HIGHEST Z-INDEX */
    <div className="absolute inset-0 pointer-events-none z-[100]" style={{ transform: 'translateZ(60px)' }}>
      {/* Top (Y High) */}
      <div className="absolute top-[140px] left-1/2 transform -translate-x-1/2">
        <span className="text-green-700 font-bold text-sm bg-gradient-to-r from-green-50 to-emerald-50 px-3 py-2 rounded-xl border-2 border-green-200 shadow-lg transform-gpu hover:scale-105 transition-transform duration-200"
              style={{ transform: 'translateZ(70px)' }}>
          {cap(yContext.high)}
        </span>
      </div>
      
      {/* Bottom (Y Low) */}
      <div className="absolute bottom-[140px] left-1/2 transform -translate-x-1/2">
        <span className="text-red-700 font-bold text-sm bg-gradient-to-r from-red-50 to-rose-50 px-3 py-2 rounded-xl border-2 border-red-200 shadow-lg transform-gpu hover:scale-105 transition-transform duration-200"
              style={{ transform: 'translateZ(70px)' }}>
          {cap(yContext.low)}
        </span>
      </div>
      
      {/* Left (X Low) */}
      <div className="absolute left-[140px] top-1/2 transform -translate-y-1/2">
        <span className="text-red-700 font-bold text-sm bg-gradient-to-r from-red-50 to-rose-50 px-3 py-2 rounded-xl border-2 border-red-200 shadow-lg transform-gpu hover:scale-105 transition-transform duration-200"
              style={{ transform: 'translateZ(70px)' }}>
          {cap(xContext.low)}
        </span>
      </div>
      
      {/* Right (X High) */}
      <div className="absolute right-[140px] top-1/2 transform -translate-y-1/2">
        <span className="text-green-700 font-bold text-sm bg-gradient-to-r from-green-50 to-emerald-50 px-3 py-2 rounded-xl border-2 border-green-200 shadow-lg transform-gpu hover:scale-105 transition-transform duration-200"
              style={{ transform: 'translateZ(70px)' }}>
          {cap(xContext.high)}
        </span>
      </div>
    </div>
  );
};

export default CornerLabels;

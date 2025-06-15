
import { FC } from "react";
import type { SelectedPoint } from "./types";

interface MatrixAxesProps {
  axes: SelectedPoint[];
  axisContexts?: { low: string; high: string }[];
}

const MatrixAxes: FC<MatrixAxesProps> = ({ axes, axisContexts }) => {
  if (axes.length !== 2) return null;

  const [yAxis, xAxis] = axes;
  const fallback = [{ low: "Low", high: "High" }, { low: "Low", high: "High" }];
  const [yContext, xContext] = axisContexts && axisContexts.length === 2 ? axisContexts : fallback;

  const cap = (str: string) => str.charAt(0).toUpperCase() + str.slice(1);

  return (
    <>
      {/* Vertical Axis Line */}
      <div className="absolute top-16 bottom-16 left-1/2 w-0.5 bg-gray-900 transform -translate-x-1/2 z-10 pointer-events-none"></div>
      
      {/* Horizontal Axis Line */}
      <div className="absolute left-16 right-16 top-1/2 h-0.5 bg-gray-900 transform -translate-y-1/2 z-10 pointer-events-none"></div>
      
      {/* Y-axis Label Container */}
      <div className="absolute top-16 bottom-16 left-1/2 transform -translate-x-1/2 z-20 flex items-center justify-center pointer-events-none">
          <div className="bg-[#111827] text-white px-2 py-[2px] text-xs font-bold uppercase tracking-wide rounded shadow-lg -rotate-90 border border-white whitespace-nowrap">
            {yAxis.factor}
          </div>
      </div>

      {/* X-axis Label Container */}
      <div className="absolute left-16 right-16 top-1/2 transform -translate-y-1/2 z-20 flex items-center justify-center pointer-events-none">
          <div className="bg-[#111827] text-white px-2 py-[2px] text-xs font-bold uppercase tracking-wide rounded shadow-lg border border-white whitespace-nowrap">
            {xAxis.factor}
          </div>
      </div>
      
      {/* Corner Labels - Top (Y High) */}
      <div className="absolute top-14 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-30 pointer-events-none">
        <span className="text-green-700 font-semibold text-[11px] bg-green-100 px-2 py-0.5 rounded border border-green-300 whitespace-nowrap shadow-sm">
          {cap(yContext.high)}
        </span>
      </div>
      {/* Corner Labels - Bottom (Y Low) */}
      <div className="absolute bottom-14 left-1/2 transform -translate-x-1/2 translate-y-1/2 z-30 pointer-events-none">
        <span className="text-red-700 font-semibold text-[11px] bg-red-100 px-2 py-0.5 rounded border border-red-300 whitespace-nowrap shadow-sm">
          {cap(yContext.low)}
        </span>
      </div>
      {/* Corner Labels - Left (X Low) */}
      <div className="absolute left-14 top-1/2 transform -translate-y-1/2 -translate-x-1/2 z-30 pointer-events-none">
        <span className="text-red-700 font-semibold text-[11px] bg-red-100 px-2 py-0.5 rounded border border-red-300 whitespace-nowrap shadow-sm">
          {cap(xContext.low)}
        </span>
      </div>
      {/* Corner Labels - Right (X High) */}
      <div className="absolute right-14 top-1/2 transform -translate-y-1/2 translate-x-1/2 z-30 pointer-events-none">
        <span className="text-green-700 font-semibold text-[11px] bg-green-100 px-2 py-0.5 rounded border border-green-300 whitespace-nowrap shadow-sm">
          {cap(xContext.high)}
        </span>
      </div>
    </>
  );
};

export default MatrixAxes;

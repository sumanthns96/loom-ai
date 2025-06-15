
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
      
      {/* Y-axis Factor Label (Vertical) placed above the grid center, with higher z-index */}
      <div className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-full z-40 flex flex-col items-center pointer-events-none" style={{ marginTop: -44 }}>
        <div className="bg-[#111827] text-white px-3 py-1 text-[14px] font-bold uppercase tracking-wide rounded shadow-lg -rotate-90 border border-white">
          {yAxis.factor}
        </div>
      </div>
      
      {/* X-axis Factor Label (Horizontal), slightly below the grid center, not covering the axis */}
      <div className="absolute left-1/2 top-1/2 transform -translate-x-1/2 z-40 flex flex-col items-center pointer-events-none" style={{ marginTop: 44 }}>
        <div className="bg-[#111827] text-white px-4 py-1 text-[14px] font-bold uppercase tracking-wide rounded shadow-lg border border-white">
          {xAxis.factor}
        </div>
      </div>
      
      {/* Corner Labels - Top */}
      <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-30 pointer-events-none" style={{ marginTop: -32 }}>
        <span className="text-green-700 font-semibold text-xs bg-green-100 px-3 py-1 rounded shadow-sm border border-green-300 whitespace-nowrap">
          {cap(yContext.high)}
        </span>
      </div>
      
      {/* Corner Labels - Bottom */}
      <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-1/2 z-30 pointer-events-none" style={{ marginBottom: -32 }}>
        <span className="text-red-700 font-semibold text-xs bg-red-100 px-3 py-1 rounded shadow-sm border border-red-300 whitespace-nowrap">
          {cap(yContext.low)}
        </span>
      </div>
      
      {/* Corner Labels - Left */}
      <div className="absolute left-0 top-1/2 transform -translate-y-1/2 -translate-x-1/2 z-30 pointer-events-none" style={{ marginLeft: -36 }}>
        <span className="text-red-700 font-semibold text-xs bg-red-100 px-3 py-1 rounded shadow-sm border border-red-300 whitespace-nowrap">
          {cap(xContext.low)}
        </span>
      </div>
      
      {/* Corner Labels - Right */}
      <div className="absolute right-0 top-1/2 transform -translate-y-1/2 translate-x-1/2 z-30 pointer-events-none" style={{ marginRight: -36 }}>
        <span className="text-green-700 font-semibold text-xs bg-green-100 px-3 py-1 rounded shadow-sm border border-green-300 whitespace-nowrap">
          {cap(xContext.high)}
        </span>
      </div>
    </>
  );
};

export default MatrixAxes;

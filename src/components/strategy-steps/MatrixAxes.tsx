
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
      <div className="absolute top-16 bottom-16 left-1/2 w-0.5 bg-gray-900 transform -translate-x-1/2 z-10"></div>
      
      {/* Horizontal Axis Line */}
      <div className="absolute left-16 right-16 top-1/2 h-0.5 bg-gray-900 transform -translate-y-1/2 z-10"></div>
      
      {/* Y-axis Factor Label (Vertical) - Positioned at center */}
      <div className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 z-30">
        <div className="bg-gray-900 text-white px-4 py-2 text-xs font-bold uppercase tracking-wide rounded shadow-lg -rotate-90">
          {yAxis.factor}
        </div>
      </div>
      
      {/* X-axis Factor Label (Horizontal) - Positioned at center */}
      <div className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 z-30 mt-12">
        <div className="bg-gray-900 text-white px-4 py-2 text-xs font-bold uppercase tracking-wide rounded shadow-lg">
          {xAxis.factor}
        </div>
      </div>
      
      {/* Corner Labels - Top (moved further from axis line) */}
      <div className="absolute top-4 left-1/2 transform -translate-x-1/2">
        <span className="text-green-700 font-semibold text-xs bg-green-100 px-2 py-1 rounded shadow-sm border border-green-300">
          {cap(yContext.high)}
        </span>
      </div>
      
      {/* Corner Labels - Bottom (moved further from axis line) */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2">
        <span className="text-red-700 font-semibold text-xs bg-red-100 px-2 py-1 rounded shadow-sm border border-red-300">
          {cap(yContext.low)}
        </span>
      </div>
      
      {/* Corner Labels - Left (moved further from axis line) */}
      <div className="absolute left-4 top-1/2 transform -translate-y-1/2">
        <span className="text-red-700 font-semibold text-xs bg-red-100 px-2 py-1 rounded shadow-sm border border-red-300">
          {cap(xContext.low)}
        </span>
      </div>
      
      {/* Corner Labels - Right (moved further from axis line) */}
      <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
        <span className="text-green-700 font-semibold text-xs bg-green-100 px-2 py-1 rounded shadow-sm border border-green-300">
          {cap(xContext.high)}
        </span>
      </div>
    </>
  );
};

export default MatrixAxes;

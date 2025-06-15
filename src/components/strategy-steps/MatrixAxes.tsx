
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
      <div className="absolute top-20 bottom-20 left-1/2 w-0.5 bg-gray-900 transform -translate-x-1/2 z-10"></div>
      
      {/* Horizontal Axis Line */}
      <div className="absolute left-20 right-20 top-1/2 h-0.5 bg-gray-900 transform -translate-y-1/2 z-10"></div>
      
      {/* Y-axis Factor Label (Vertical) */}
      <div className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 -rotate-90 z-20">
        <div className="bg-gray-900 text-white px-6 py-3 text-sm font-bold uppercase tracking-wide rounded-lg shadow-lg">
          {yAxis.factor}
        </div>
      </div>
      
      {/* X-axis Factor Label (Horizontal) */}
      <div className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 z-20 mt-16">
        <div className="bg-gray-900 text-white px-6 py-3 text-sm font-bold uppercase tracking-wide rounded-lg shadow-lg">
          {xAxis.factor}
        </div>
      </div>
      
      {/* Corner Labels - Top */}
      <div className="absolute top-8 left-1/2 transform -translate-x-1/2">
        <span className="text-green-700 font-bold text-sm bg-green-100 px-4 py-2 rounded-lg shadow-md border border-green-300">
          {cap(yContext.high)}
        </span>
      </div>
      
      {/* Corner Labels - Bottom */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2">
        <span className="text-red-700 font-bold text-sm bg-red-100 px-4 py-2 rounded-lg shadow-md border border-red-300">
          {cap(yContext.low)}
        </span>
      </div>
      
      {/* Corner Labels - Left */}
      <div className="absolute left-8 top-1/2 transform -translate-y-1/2">
        <span className="text-red-700 font-bold text-sm bg-red-100 px-4 py-2 rounded-lg shadow-md border border-red-300">
          {cap(xContext.low)}
        </span>
      </div>
      
      {/* Corner Labels - Right */}
      <div className="absolute right-8 top-1/2 transform -translate-y-1/2">
        <span className="text-green-700 font-bold text-sm bg-green-100 px-4 py-2 rounded-lg shadow-md border border-green-300">
          {cap(xContext.high)}
        </span>
      </div>
    </>
  );
};

export default MatrixAxes;


import { FC } from "react";
import type { SelectedPoint } from "./types";

interface AxisLinesProps {
  axes: SelectedPoint[];
}

const AxisLines: FC<AxisLinesProps> = ({ axes }) => {
  if (axes.length !== 2) return null;

  const [yAxis, xAxis] = axes;

  return (
    <div className="absolute inset-0 pointer-events-none z-30">
      {/* Horizontal axis line - prominent and clearly visible */}
      <div className="absolute top-1/2 left-0 right-0 transform -translate-y-1/2 flex items-center justify-center">
        <div className="w-full h-2 bg-gradient-to-r from-gray-400 via-gray-600 to-gray-400 shadow-lg">
          {/* Left part of X-axis label – "ENVIRO" */}
          <div className="absolute top-1/2 left-[calc(50%-65px)] transform -translate-y-1/2 z-[70]">
            <div className="bg-gradient-to-r from-blue-700 to-blue-800 text-white px-3 py-1 text-sm font-bold uppercase tracking-wider rounded-l-md shadow-xl border border-blue-600">
              ENVIRO
            </div>
          </div>

          {/* Right part of X-axis label – "NMENT" */}
          <div className="absolute top-1/2 left-[calc(50%+5px)] transform -translate-y-1/2 z-[70]">
            <div className="bg-gradient-to-r from-blue-700 to-blue-800 text-white px-3 py-1 text-sm font-bold uppercase tracking-wider rounded-r-md shadow-xl border border-blue-600">
              NMENT
            </div>
          </div>
        </div>
      </div>
      
      {/* Vertical axis line - prominent and clearly visible */}
      <div className="absolute left-1/2 top-0 bottom-0 transform -translate-x-1/2 flex items-center justify-center">
        <div className="h-full w-2 bg-gradient-to-b from-gray-400 via-gray-600 to-gray-400 shadow-lg">
          {/* Axis label for vertical - rotated */}
          <div className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 -rotate-90">
            <div className="bg-gray-700 text-white px-4 py-2 text-sm font-bold uppercase tracking-wider rounded-lg shadow-xl border border-gray-600 whitespace-nowrap">
              {yAxis.factor}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AxisLines;

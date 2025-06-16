
import { FC } from "react";
import type { SelectedPoint } from "./types";

interface CornerLabelsProps {
  axes: SelectedPoint[];
  axisContexts?: { low: string; high: string }[];
}

const cap = (str: string) => str.charAt(0).toUpperCase() + str.slice(1);

const CornerLabels: FC<CornerLabelsProps> = ({ axes, axisContexts }) => {
  if (axes.length !== 2) return null;

  const [yAxis, xAxis] = axes;
  const fallback = [{ low: "Low", high: "High" }, { low: "Low", high: "High" }];
  const [yContext, xContext] = axisContexts && axisContexts.length === 2 ? axisContexts : fallback;

  return (
    <div className="absolute inset-0 pointer-events-none z-40">
      {/* Top center - Y High with green plus icon */}
      <div className="absolute top-4 left-1/2 transform -translate-x-1/2">
        <div className="flex flex-col items-center space-y-2">
          <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center shadow-lg">
            <div className="w-6 h-1 bg-white rounded-full"></div>
            <div className="w-1 h-6 bg-white rounded-full absolute"></div>
          </div>
          <span className="text-green-700 font-bold text-sm bg-green-50 px-3 py-1 rounded-lg border border-green-200 shadow-md">
            {cap(yContext.high)}
          </span>
        </div>
      </div>
      
      {/* Bottom center - Y Low with red minus icon */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2">
        <div className="flex flex-col items-center space-y-2">
          <span className="text-red-700 font-bold text-sm bg-red-50 px-3 py-1 rounded-lg border border-red-200 shadow-md">
            {cap(yContext.low)}
          </span>
          <div className="w-12 h-12 bg-red-500 rounded-full flex items-center justify-center shadow-lg">
            <div className="w-6 h-1 bg-white rounded-full"></div>
          </div>
        </div>
      </div>
      
      {/* Left center - X Low with red minus icon */}
      <div className="absolute left-4 top-1/2 transform -translate-y-1/2">
        <div className="flex items-center space-x-2">
          <div className="w-12 h-12 bg-red-500 rounded-full flex items-center justify-center shadow-lg">
            <div className="w-6 h-1 bg-white rounded-full"></div>
          </div>
          <span className="text-red-700 font-bold text-sm bg-red-50 px-3 py-1 rounded-lg border border-red-200 shadow-md">
            {cap(xContext.low)}
          </span>
        </div>
      </div>
      
      {/* Right center - X High with green plus icon */}
      <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
        <div className="flex items-center space-x-2">
          <span className="text-green-700 font-bold text-sm bg-green-50 px-3 py-1 rounded-lg border border-green-200 shadow-md">
            {cap(xContext.high)}
          </span>
          <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center shadow-lg">
            <div className="w-6 h-1 bg-white rounded-full"></div>
            <div className="w-1 h-6 bg-white rounded-full absolute"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CornerLabels;

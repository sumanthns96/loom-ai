
import { FC } from "react";
import type { SelectedPoint } from "./types";

interface CompetitorData {
  type: "Incumbent" | "Insurgent" | "Adjacent";
  name: string;
  action: string;
  logoUrl?: string;
}

interface QuadrantCompetitors {
  competitors: CompetitorData[];
}

interface CompetitorMatrixProps {
  quadrantCompetitors: QuadrantCompetitors[];
  axes: SelectedPoint[];
  axisContexts?: { low: string; high: string }[];
  getCompanyInitials: (name: string) => string;
}

const CompetitorTypeCard: FC<{ 
  type: "Incumbent" | "Insurgent" | "Adjacent";
  competitors: CompetitorData[];
  getInitials: (name: string) => string;
}> = ({ type, competitors, getInitials }) => {
  if (competitors.length === 0) return null;

  const typeColors = {
    Incumbent: "border-blue-400 bg-blue-50",
    Insurgent: "border-red-400 bg-red-50", 
    Adjacent: "border-green-400 bg-green-50"
  };

  const typeLabels = {
    Incumbent: "INCUMBENTS",
    Insurgent: "INSURGENTS",
    Adjacent: "ADJACENTS"
  };

  // Truncate combined action to 10-15 words max
  const combinedAction = competitors.map(c => c.action).join(". ");
  const words = combinedAction.split(" ");
  const truncatedAction = words.length > 15 
    ? words.slice(0, 15).join(" ") + "..." 
    : combinedAction;
  
  return (
    <div className={`${typeColors[type]} rounded-xl border-2 p-2 h-28 flex flex-col justify-between shadow-sm`}>
      {/* Header */}
      <div className="text-center">
        <h4 className="text-[10px] font-bold text-gray-800 tracking-wide">
          {typeLabels[type]}
        </h4>
      </div>
      
      {/* Main Content */}
      <div className="flex-1 flex items-center justify-center px-1">
        <p className="text-[9px] text-gray-700 text-center leading-tight">
          {truncatedAction}
        </p>
      </div>
      
      {/* Company Logos */}
      <div className="flex justify-center items-center space-x-1">
        {competitors.slice(0, 3).map((competitor, index) => (
          <div key={index} className="flex flex-col items-center">
            <div className="w-4 h-4 rounded bg-white border border-gray-200 flex items-center justify-center overflow-hidden">
              <img 
                src={competitor.logoUrl} 
                alt={competitor.name}
                className="w-full h-full object-contain p-0.5"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.style.display = 'none';
                  target.nextElementSibling!.classList.remove('hidden');
                }}
              />
              <span className="hidden text-gray-600 text-[8px] font-bold">
                {getInitials(competitor.name)}
              </span>
            </div>
            <span className="text-[8px] text-gray-500 font-medium text-center max-w-[30px] truncate">
              {competitor.name.split(' ')[0]}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

const CompetitorMatrix: FC<CompetitorMatrixProps> = ({ 
  quadrantCompetitors, 
  axes, 
  axisContexts,
  getCompanyInitials 
}) => {
  if (!quadrantCompetitors.length || axes.length !== 2) return null;

  const [yAxis, xAxis] = axes;
  const fallback = [{ low: "Low", high: "High" }, { low: "Low", high: "High" }];
  const [yContext, xContext] = axisContexts && axisContexts.length === 2 ? axisContexts : fallback;

  const cap = (str: string) => str.charAt(0).toUpperCase() + str.slice(1);

  // Group competitors by type for each quadrant
  const getCompetitorsByType = (quadrantIndex: number) => {
    const competitors = quadrantCompetitors[quadrantIndex]?.competitors || [];
    return {
      incumbents: competitors.filter(c => c.type === "Incumbent"),
      insurgents: competitors.filter(c => c.type === "Insurgent"), 
      adjacents: competitors.filter(c => c.type === "Adjacent")
    };
  };

  // Generate dynamic quadrant headers using contextual axis labels
  const getQuadrantHeader = (yHigh: boolean, xHigh: boolean) => {
    const yLabel = yHigh ? cap(yContext.high) : cap(yContext.low);
    const xLabel = xHigh ? cap(xContext.high) : cap(xContext.low);
    return `${yLabel}, ${xLabel}`;
  };

  return (
    <div className="mt-8 animate-fade-in">
      <div className="max-w-7xl mx-auto px-8 py-12">
        {/* Main container with proper spacing for axes */}
        <div className="relative" style={{ paddingTop: '80px', paddingBottom: '80px', paddingLeft: '120px', paddingRight: '120px' }}>
          
          {/* Vertical Axis Line */}
          <div className="absolute top-16 bottom-16 left-1/2 w-1 bg-gray-800 transform -translate-x-1/2 z-10"></div>
          
          {/* Horizontal Axis Line */}
          <div className="absolute left-24 right-24 top-1/2 h-1 bg-gray-800 transform -translate-y-1/2 z-10"></div>
          
          {/* Y-axis Factor Label (Vertical) */}
          <div className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 -rotate-90 z-20">
            <div className="bg-gray-800 text-white px-4 py-2 text-sm font-bold uppercase tracking-wide rounded">
              {yAxis.factor}
            </div>
          </div>
          
          {/* X-axis Factor Label (Horizontal) */}
          <div className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 z-20">
            <div className="bg-gray-800 text-white px-4 py-2 text-sm font-bold uppercase tracking-wide rounded">
              {xAxis.factor}
            </div>
          </div>
          
          {/* Corner Labels - Top */}
          <div className="absolute top-4 left-1/2 transform -translate-x-1/2">
            <span className="text-green-600 font-bold text-sm bg-white px-3 py-1 rounded shadow-md border">
              {cap(yContext.high)}
            </span>
          </div>
          
          {/* Corner Labels - Bottom */}
          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2">
            <span className="text-red-600 font-bold text-sm bg-white px-3 py-1 rounded shadow-md border">
              {cap(yContext.low)}
            </span>
          </div>
          
          {/* Corner Labels - Left */}
          <div className="absolute left-4 top-1/2 transform -translate-y-1/2">
            <span className="text-red-600 font-bold text-sm bg-white px-3 py-1 rounded shadow-md border">
              {cap(xContext.low)}
            </span>
          </div>
          
          {/* Corner Labels - Right */}
          <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
            <span className="text-green-600 font-bold text-sm bg-white px-3 py-1 rounded shadow-md border">
              {cap(xContext.high)}
            </span>
          </div>
          
          {/* Quadrant Grid Container */}
          <div className="relative z-30 grid grid-cols-2 grid-rows-2 gap-8 h-96">
            
            {/* Top Left Quadrant - Index 1 (High Y, Low X) */}
            <div className="bg-gray-50 rounded-lg p-4 border-2 border-gray-200 shadow-sm">
              <h4 className="text-center text-xs font-bold text-gray-700 uppercase tracking-wide mb-3 bg-white px-2 py-1 rounded border">
                {getQuadrantHeader(true, false)}
              </h4>
              {(() => {
                const { incumbents, insurgents, adjacents } = getCompetitorsByType(1);
                return (
                  <div className="grid grid-cols-3 gap-2 h-full">
                    {insurgents.length > 0 && (
                      <CompetitorTypeCard type="Insurgent" competitors={insurgents} getInitials={getCompanyInitials} />
                    )}
                    {incumbents.length > 0 && (
                      <CompetitorTypeCard type="Incumbent" competitors={incumbents} getInitials={getCompanyInitials} />
                    )}
                    {adjacents.length > 0 && (
                      <CompetitorTypeCard type="Adjacent" competitors={adjacents} getInitials={getCompanyInitials} />
                    )}
                  </div>
                );
              })()}
            </div>
            
            {/* Top Right Quadrant - Index 0 (High Y, High X) */}
            <div className="bg-gray-50 rounded-lg p-4 border-2 border-gray-200 shadow-sm">
              <h4 className="text-center text-xs font-bold text-gray-700 uppercase tracking-wide mb-3 bg-white px-2 py-1 rounded border">
                {getQuadrantHeader(true, true)}
              </h4>
              {(() => {
                const { incumbents, insurgents, adjacents } = getCompetitorsByType(0);
                return (
                  <div className="grid grid-cols-3 gap-2 h-full">
                    {insurgents.length > 0 && (
                      <CompetitorTypeCard type="Insurgent" competitors={insurgents} getInitials={getCompanyInitials} />
                    )}
                    {incumbents.length > 0 && (
                      <CompetitorTypeCard type="Incumbent" competitors={incumbents} getInitials={getCompanyInitials} />
                    )}
                    {adjacents.length > 0 && (
                      <CompetitorTypeCard type="Adjacent" competitors={adjacents} getInitials={getCompanyInitials} />
                    )}
                  </div>
                );
              })()}
            </div>
            
            {/* Bottom Left Quadrant - Index 2 (Low Y, Low X) */}
            <div className="bg-gray-50 rounded-lg p-4 border-2 border-gray-200 shadow-sm">
              <h4 className="text-center text-xs font-bold text-gray-700 uppercase tracking-wide mb-3 bg-white px-2 py-1 rounded border">
                {getQuadrantHeader(false, false)}
              </h4>
              {(() => {
                const { incumbents, insurgents, adjacents } = getCompetitorsByType(2);
                return (
                  <div className="grid grid-cols-3 gap-2 h-full">
                    {insurgents.length > 0 && (
                      <CompetitorTypeCard type="Insurgent" competitors={insurgents} getInitials={getCompanyInitials} />
                    )}
                    {incumbents.length > 0 && (
                      <CompetitorTypeCard type="Incumbent" competitors={incumbents} getInitials={getCompanyInitials} />
                    )}
                    {adjacents.length > 0 && (
                      <CompetitorTypeCard type="Adjacent" competitors={adjacents} getInitials={getCompanyInitials} />
                    )}
                  </div>
                );
              })()}
            </div>
            
            {/* Bottom Right Quadrant - Index 3 (Low Y, High X) */}
            <div className="bg-gray-50 rounded-lg p-4 border-2 border-gray-200 shadow-sm">
              <h4 className="text-center text-xs font-bold text-gray-700 uppercase tracking-wide mb-3 bg-white px-2 py-1 rounded border">
                {getQuadrantHeader(false, true)}
              </h4>
              {(() => {
                const { incumbents, insurgents, adjacents } = getCompetitorsByType(3);
                return (
                  <div className="grid grid-cols-3 gap-2 h-full">
                    {insurgents.length > 0 && (
                      <CompetitorTypeCard type="Insurgent" competitors={insurgents} getInitials={getCompanyInitials} />
                    )}
                    {incumbents.length > 0 && (
                      <CompetitorTypeCard type="Incumbent" competitors={incumbents} getInitials={getCompanyInitials} />
                    )}
                    {adjacents.length > 0 && (
                      <CompetitorTypeCard type="Adjacent" competitors={adjacents} getInitials={getCompanyInitials} />
                    )}
                  </div>
                );
              })()}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CompetitorMatrix;

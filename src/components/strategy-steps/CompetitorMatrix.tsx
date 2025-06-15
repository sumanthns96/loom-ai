
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

  // Combine all actions for this type into one coherent description
  const combinedAction = competitors.map(c => c.action).join(". ");
  
  return (
    <div className={`${typeColors[type]} rounded-2xl border-2 p-4 min-h-[240px] flex flex-col justify-between shadow-md`}>
      {/* Header */}
      <div className="text-center mb-3">
        <h4 className="text-sm font-bold text-gray-800 tracking-wide">
          {typeLabels[type]}
        </h4>
      </div>
      
      {/* Main Content */}
      <div className="flex-1 flex items-center justify-center px-2">
        <p className="text-xs text-gray-700 text-center leading-relaxed">
          {combinedAction}
        </p>
      </div>
      
      {/* Company Logos */}
      <div className="flex justify-center items-center space-x-2 mt-3">
        {competitors.slice(0, 3).map((competitor, index) => (
          <div key={index} className="flex flex-col items-center">
            <div className="w-8 h-8 rounded-md bg-white border border-gray-200 flex items-center justify-center overflow-hidden shadow-sm">
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
              <span className="hidden text-gray-600 text-xs font-bold">
                {getInitials(competitor.name)}
              </span>
            </div>
            <span className="text-xs text-gray-500 mt-0.5 font-medium text-center max-w-[40px] truncate">
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

  const endLabelColors = ["text-red-600 font-bold", "text-green-600 font-bold"];
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
      <div className="max-w-7xl mx-auto px-16 py-12">
        <div className="relative">
          {/* Y-axis labels */}
          <div className="absolute -top-8 left-1/2 transform -translate-x-1/2">
            <span className={`${endLabelColors[1]} text-sm whitespace-nowrap px-3 py-1 bg-white rounded-lg shadow-md`}>
              {cap(yContext.high)}
            </span>
          </div>
          
          <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2">
            <span className={`${endLabelColors[0]} text-sm whitespace-nowrap px-3 py-1 bg-white rounded-lg shadow-md`}>
              {cap(yContext.low)}
            </span>
          </div>
          
          <div className="relative" style={{ minHeight: 600 }}>
            {/* Horizontal X axis */}
            <div className="absolute left-0 right-0 top-1/2 transform -translate-y-1/2 z-10">
              <div className="flex items-center">
                <div className="absolute -left-16 top-1/2 transform -translate-y-1/2">
                  <span className={`${endLabelColors[0]} text-sm whitespace-nowrap px-3 py-1 bg-white rounded-lg shadow-md`}>
                    {cap(xContext.low)}
                  </span>
                </div>
                
                <div className="w-full border-t-4 border-purple-700 relative">
                  <div className="absolute left-1/2 top-0 transform -translate-x-1/2 -translate-y-1/2">
                    <span className="bg-purple-700 text-white px-3 py-1 text-sm font-bold uppercase tracking-wide rounded-lg">
                      {xAxis.factor}
                    </span>
                  </div>
                </div>
                
                <div className="absolute -right-16 top-1/2 transform -translate-y-1/2">
                  <span className={`${endLabelColors[1]} text-sm whitespace-nowrap px-3 py-1 bg-white rounded-lg shadow-md`}>
                    {cap(xContext.high)}
                  </span>
                </div>
              </div>
            </div>
            
            {/* Vertical Y axis */}
            <div className="absolute top-0 bottom-0 left-1/2 transform -translate-x-1/2 z-10">
              <div className="h-full border-l-4 border-purple-700 relative">
                <div className="absolute left-0 top-1/2 transform -translate-x-1/2 -translate-y-1/2 -rotate-90">
                  <span className="bg-purple-700 text-white px-3 py-1 text-sm font-bold uppercase tracking-wide rounded-lg whitespace-nowrap">
                    {yAxis.factor}
                  </span>
                </div>
              </div>
            </div>
            
            {/* Competitor quadrants */}
            <div className="relative z-20 grid grid-cols-2 grid-rows-2 gap-6 p-6">
              {/* Top Left - Index 1 (High Y, Low X) */}
              <div className="space-y-4">
                <h4 className="text-center text-sm font-bold text-gray-700 mb-4 uppercase tracking-wide bg-white px-3 py-1 rounded-lg shadow-sm">
                  {getQuadrantHeader(true, false)}
                </h4>
                {(() => {
                  const { incumbents, insurgents, adjacents } = getCompetitorsByType(1);
                  return (
                    <div className="grid grid-cols-3 gap-3">
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
              
              {/* Top Right - Index 0 (High Y, High X) */}
              <div className="space-y-4">
                <h4 className="text-center text-sm font-bold text-gray-700 mb-4 uppercase tracking-wide bg-white px-3 py-1 rounded-lg shadow-sm">
                  {getQuadrantHeader(true, true)}
                </h4>
                {(() => {
                  const { incumbents, insurgents, adjacents } = getCompetitorsByType(0);
                  return (
                    <div className="grid grid-cols-3 gap-3">
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
              
              {/* Bottom Left - Index 2 (Low Y, Low X) */}
              <div className="space-y-4">
                <h4 className="text-center text-sm font-bold text-gray-700 mb-4 uppercase tracking-wide bg-white px-3 py-1 rounded-lg shadow-sm">
                  {getQuadrantHeader(false, false)}
                </h4>
                {(() => {
                  const { incumbents, insurgents, adjacents } = getCompetitorsByType(2);
                  return (
                    <div className="grid grid-cols-3 gap-3">
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
              
              {/* Bottom Right - Index 3 (Low Y, High X) */}
              <div className="space-y-4">
                <h4 className="text-center text-sm font-bold text-gray-700 mb-4 uppercase tracking-wide bg-white px-3 py-1 rounded-lg shadow-sm">
                  {getQuadrantHeader(false, true)}
                </h4>
                {(() => {
                  const { incumbents, insurgents, adjacents } = getCompetitorsByType(3);
                  return (
                    <div className="grid grid-cols-3 gap-3">
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
    </div>
  );
};

export default CompetitorMatrix;

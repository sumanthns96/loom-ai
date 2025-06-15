
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

const CompetitorCard: FC<{ competitor: CompetitorData; getInitials: (name: string) => string }> = ({ 
  competitor, 
  getInitials 
}) => {
  const typeColors = {
    Incumbent: "bg-blue-100 border-blue-300 text-blue-800",
    Insurgent: "bg-red-100 border-red-300 text-red-800", 
    Adjacent: "bg-green-100 border-green-300 text-green-800"
  };

  return (
    <div className={`p-3 rounded-lg border-2 ${typeColors[competitor.type]} mb-2`}>
      <div className="flex items-center gap-2 mb-1">
        <div className="w-8 h-8 rounded-full bg-white border flex items-center justify-center text-xs font-bold overflow-hidden">
          <img 
            src={competitor.logoUrl} 
            alt={competitor.name}
            className="w-full h-full object-contain"
            onError={(e) => {
              // Fallback to initials if logo fails to load
              const target = e.target as HTMLImageElement;
              target.style.display = 'none';
              target.nextElementSibling!.classList.remove('hidden');
            }}
          />
          <span className="hidden text-gray-600">
            {getInitials(competitor.name)}
          </span>
        </div>
        <div className="flex-1 min-w-0">
          <div className="font-semibold text-xs truncate">{competitor.name}</div>
          <div className="text-xs opacity-75">{competitor.type}</div>
        </div>
      </div>
      <div className="text-xs leading-tight">{competitor.action}</div>
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

  return (
    <div className="mt-12 animate-fade-in">
      <div className="max-w-6xl mx-auto px-20 py-16">
        <div className="relative">
          {/* Y-axis labels */}
          <div className="absolute -top-8 left-1/2 transform -translate-x-1/2">
            <span className={`${endLabelColors[1]} text-xs whitespace-nowrap px-2 py-1 bg-white rounded shadow`}>
              {cap(yContext.high)}
            </span>
          </div>
          
          <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2">
            <span className={`${endLabelColors[0]} text-xs whitespace-nowrap px-2 py-1 bg-white rounded shadow`}>
              {cap(yContext.low)}
            </span>
          </div>
          
          <div className="relative" style={{ minHeight: 600 }}>
            {/* Horizontal X axis */}
            <div className="absolute left-0 right-0 top-1/2 transform -translate-y-1/2 z-10">
              <div className="flex items-center">
                <div className="absolute -left-16 top-1/2 transform -translate-y-1/2">
                  <span className={`${endLabelColors[0]} text-xs whitespace-nowrap px-2 py-1 bg-white rounded shadow`}>
                    {cap(xContext.low)}
                  </span>
                </div>
                
                <div className="w-full border-t-6 border-purple-700 relative">
                  <div className="absolute left-1/2 top-0 transform -translate-x-1/2 -translate-y-1/2">
                    <span className="bg-purple-700 text-white px-3 py-1 text-sm font-bold uppercase tracking-wide rounded">
                      {xAxis.factor}
                    </span>
                  </div>
                </div>
                
                <div className="absolute -right-16 top-1/2 transform -translate-y-1/2">
                  <span className={`${endLabelColors[1]} text-xs whitespace-nowrap px-2 py-1 bg-white rounded shadow`}>
                    {cap(xContext.high)}
                  </span>
                </div>
              </div>
            </div>
            
            {/* Vertical Y axis */}
            <div className="absolute top-0 bottom-0 left-1/2 transform -translate-x-1/2 z-10">
              <div className="h-full border-l-6 border-purple-700 relative">
                <div className="absolute left-0 top-1/2 transform -translate-x-1/2 -translate-y-1/2 -rotate-90">
                  <span className="bg-purple-700 text-white px-3 py-1 text-sm font-bold uppercase tracking-wide rounded whitespace-nowrap">
                    {yAxis.factor}
                  </span>
                </div>
              </div>
            </div>
            
            {/* Competitor quadrants */}
            <div className="relative z-20 grid grid-cols-2 grid-rows-2 gap-6 p-8">
              {/* Top Left - Index 1 (High Y, Low X) */}
              <div className="rounded-xl border border-gray-200 bg-white shadow-sm p-4 min-h-[280px]">
                <h4 className="text-xs font-bold text-gray-600 mb-3 text-center">HIGH Y, LOW X</h4>
                {(() => {
                  const { incumbents, insurgents, adjacents } = getCompetitorsByType(1);
                  return (
                    <div className="space-y-3">
                      {incumbents.length > 0 && (
                        <div>
                          <h5 className="text-xs font-semibold text-blue-700 mb-1">INCUMBENTS</h5>
                          {incumbents.map((comp, i) => (
                            <CompetitorCard key={i} competitor={comp} getInitials={getCompanyInitials} />
                          ))}
                        </div>
                      )}
                      {insurgents.length > 0 && (
                        <div>
                          <h5 className="text-xs font-semibold text-red-700 mb-1">INSURGENTS</h5>
                          {insurgents.map((comp, i) => (
                            <CompetitorCard key={i} competitor={comp} getInitials={getCompanyInitials} />
                          ))}
                        </div>
                      )}
                      {adjacents.length > 0 && (
                        <div>
                          <h5 className="text-xs font-semibold text-green-700 mb-1">ADJACENTS</h5>
                          {adjacents.map((comp, i) => (
                            <CompetitorCard key={i} competitor={comp} getInitials={getCompanyInitials} />
                          ))}
                        </div>
                      )}
                    </div>
                  );
                })()}
              </div>
              
              {/* Top Right - Index 0 (High Y, High X) */}
              <div className="rounded-xl border border-gray-200 bg-white shadow-sm p-4 min-h-[280px]">
                <h4 className="text-xs font-bold text-gray-600 mb-3 text-center">HIGH Y, HIGH X</h4>
                {(() => {
                  const { incumbents, insurgents, adjacents } = getCompetitorsByType(0);
                  return (
                    <div className="space-y-3">
                      {incumbents.length > 0 && (
                        <div>
                          <h5 className="text-xs font-semibold text-blue-700 mb-1">INCUMBENTS</h5>
                          {incumbents.map((comp, i) => (
                            <CompetitorCard key={i} competitor={comp} getInitials={getCompanyInitials} />
                          ))}
                        </div>
                      )}
                      {insurgents.length > 0 && (
                        <div>
                          <h5 className="text-xs font-semibold text-red-700 mb-1">INSURGENTS</h5>
                          {insurgents.map((comp, i) => (
                            <CompetitorCard key={i} competitor={comp} getInitials={getCompanyInitials} />
                          ))}
                        </div>
                      )}
                      {adjacents.length > 0 && (
                        <div>
                          <h5 className="text-xs font-semibold text-green-700 mb-1">ADJACENTS</h5>
                          {adjacents.map((comp, i) => (
                            <CompetitorCard key={i} competitor={comp} getInitials={getCompanyInitials} />
                          ))}
                        </div>
                      )}
                    </div>
                  );
                })()}
              </div>
              
              {/* Bottom Left - Index 2 (Low Y, Low X) */}
              <div className="rounded-xl border border-gray-200 bg-white shadow-sm p-4 min-h-[280px]">
                <h4 className="text-xs font-bold text-gray-600 mb-3 text-center">LOW Y, LOW X</h4>
                {(() => {
                  const { incumbents, insurgents, adjacents } = getCompetitorsByType(2);
                  return (
                    <div className="space-y-3">
                      {incumbents.length > 0 && (
                        <div>
                          <h5 className="text-xs font-semibold text-blue-700 mb-1">INCUMBENTS</h5>
                          {incumbents.map((comp, i) => (
                            <CompetitorCard key={i} competitor={comp} getInitials={getCompanyInitials} />
                          ))}
                        </div>
                      )}
                      {insurgents.length > 0 && (
                        <div>
                          <h5 className="text-xs font-semibold text-red-700 mb-1">INSURGENTS</h5>
                          {insurgents.map((comp, i) => (
                            <CompetitorCard key={i} competitor={comp} getInitials={getCompanyInitials} />
                          ))}
                        </div>
                      )}
                      {adjacents.length > 0 && (
                        <div>
                          <h5 className="text-xs font-semibold text-green-700 mb-1">ADJACENTS</h5>
                          {adjacents.map((comp, i) => (
                            <CompetitorCard key={i} competitor={comp} getInitials={getCompanyInitials} />
                          ))}
                        </div>
                      )}
                    </div>
                  );
                })()}
              </div>
              
              {/* Bottom Right - Index 3 (Low Y, High X) */}
              <div className="rounded-xl border border-gray-200 bg-white shadow-sm p-4 min-h-[280px]">
                <h4 className="text-xs font-bold text-gray-600 mb-3 text-center">LOW Y, HIGH X</h4>
                {(() => {
                  const { incumbents, insurgents, adjacents } = getCompetitorsByType(3);
                  return (
                    <div className="space-y-3">
                      {incumbents.length > 0 && (
                        <div>
                          <h5 className="text-xs font-semibold text-blue-700 mb-1">INCUMBENTS</h5>
                          {incumbents.map((comp, i) => (
                            <CompetitorCard key={i} competitor={comp} getInitials={getCompanyInitials} />
                          ))}
                        </div>
                      )}
                      {insurgents.length > 0 && (
                        <div>
                          <h5 className="text-xs font-semibold text-red-700 mb-1">INSURGENTS</h5>
                          {insurgents.map((comp, i) => (
                            <CompetitorCard key={i} competitor={comp} getInitials={getCompanyInitials} />
                          ))}
                        </div>
                      )}
                      {adjacents.length > 0 && (
                        <div>
                          <h5 className="text-xs font-semibold text-green-700 mb-1">ADJACENTS</h5>
                          {adjacents.map((comp, i) => (
                            <CompetitorCard key={i} competitor={comp} getInitials={getCompanyInitials} />
                          ))}
                        </div>
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

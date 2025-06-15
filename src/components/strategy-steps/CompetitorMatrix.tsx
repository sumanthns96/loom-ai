
import { FC } from "react";
import type { SelectedPoint } from "./types";
import MatrixAxes from "./MatrixAxes";
import QuadrantContainer from "./QuadrantContainer";

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

  // Generate dynamic quadrant headers using contextual axis labels
  const getQuadrantHeader = (yHigh: boolean, xHigh: boolean) => {
    const yLabel = yHigh ? cap(yContext.high) : cap(yContext.low);
    const xLabel = xHigh ? cap(xContext.high) : cap(xContext.low);
    return `${yLabel}, ${xLabel}`;
  };

  return (
    <div className="mt-8 animate-fade-in">
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="relative bg-white rounded-2xl shadow-xl p-20" style={{ minHeight: "900px" }}>
          {/* Axis lines and labels */}
          <MatrixAxes axes={axes} axisContexts={axisContexts} />
          {/* Quadrant Grid Container with more space */}
          <div className="relative z-30 grid grid-cols-2 grid-rows-2 gap-8 h-full min-h-[700px] p-12">
            {/* Top Left Quadrant - Index 1 (High Y, Low X) */}
            <QuadrantContainer
              title={getQuadrantHeader(true, false)}
              competitors={quadrantCompetitors[1]?.competitors || []}
              getCompanyInitials={getCompanyInitials}
              quadrantIndex={1}
            />
            {/* Top Right Quadrant - Index 0 (High Y, High X) */}
            <QuadrantContainer
              title={getQuadrantHeader(true, true)}
              competitors={quadrantCompetitors[0]?.competitors || []}
              getCompanyInitials={getCompanyInitials}
              quadrantIndex={0}
            />
            {/* Bottom Left Quadrant - Index 2 (Low Y, Low X) */}
            <QuadrantContainer
              title={getQuadrantHeader(false, false)}
              competitors={quadrantCompetitors[2]?.competitors || []}
              getCompanyInitials={getCompanyInitials}
              quadrantIndex={2}
            />
            {/* Bottom Right Quadrant - Index 3 (Low Y, High X) */}
            <QuadrantContainer
              title={getQuadrantHeader(false, true)}
              competitors={quadrantCompetitors[3]?.competitors || []}
              getCompanyInitials={getCompanyInitials}
              quadrantIndex={3}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default CompetitorMatrix;

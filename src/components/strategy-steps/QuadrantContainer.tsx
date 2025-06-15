
import { FC } from "react";
import CompetitorTypeCard from "./CompetitorTypeCard";

interface CompetitorData {
  type: "Incumbent" | "Insurgent" | "Adjacent";
  name: string;
  action: string;
  logoUrl?: string;
}

interface QuadrantContainerProps {
  title: string;
  competitors: CompetitorData[];
  getCompanyInitials: (name: string) => string;
}

const QuadrantContainer: FC<QuadrantContainerProps> = ({ 
  title, 
  competitors, 
  getCompanyInitials 
}) => {
  // Group competitors by type
  const incumbents = competitors.filter(c => c.type === "Incumbent");
  const insurgents = competitors.filter(c => c.type === "Insurgent");
  const adjacents = competitors.filter(c => c.type === "Adjacent");

  return (
    <div className="bg-gray-100 rounded-xl p-6 border border-gray-300 shadow-lg">
      <h4 className="text-center text-sm font-bold text-gray-800 uppercase tracking-wide mb-4 bg-white px-3 py-2 rounded-lg border shadow-sm">
        {title}
      </h4>
      <div className="grid grid-cols-3 gap-3 h-full min-h-[200px]">
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
    </div>
  );
};

export default QuadrantContainer;

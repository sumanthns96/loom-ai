
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

  const allTypes = [
    { type: "Insurgent", list: insurgents },
    { type: "Incumbent", list: incumbents },
    { type: "Adjacent", list: adjacents },
  ];

  return (
    <div className="bg-gray-200 rounded-2xl p-8 border border-gray-400 shadow-xl h-full">
      <h4 className="text-center text-sm font-bold text-gray-800 uppercase tracking-wide mb-6 bg-white px-4 py-3 rounded-lg border shadow-sm">
        {title}
      </h4>
      <div className="grid grid-cols-3 gap-6 h-full items-stretch">
        {allTypes.map(
          ({ type, list }) => (
            <div key={type} className="w-full">
              <CompetitorTypeCard
                type={type as any}
                competitors={list}
                getInitials={getCompanyInitials}
              />
            </div>
          )
        )}
      </div>
    </div>
  );
};

export default QuadrantContainer;

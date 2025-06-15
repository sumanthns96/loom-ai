
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

  // For consistent card heights, always render 3 cards and align heights (even if some are empty)
  const allTypes = [
    { type: "Insurgent", list: insurgents },
    { type: "Incumbent", list: incumbents },
    { type: "Adjacent", list: adjacents },
  ];

  return (
    <div className="bg-gray-100 rounded-xl p-5 border border-gray-300 shadow-lg h-full">
      <h4 className="text-center text-sm font-bold text-gray-800 uppercase tracking-wide mb-3 bg-white px-2 py-1 rounded-lg border shadow-sm">
        {title}
      </h4>
      <div className="grid grid-cols-3 gap-2 h-full min-h-[150px] items-stretch">
        {allTypes.map(
          ({ type, list }) => (
            <CompetitorTypeCard
              key={type}
              type={type as any}
              competitors={list}
              getInitials={getCompanyInitials}
            />
          )
        )}
      </div>
    </div>
  );
};

export default QuadrantContainer;

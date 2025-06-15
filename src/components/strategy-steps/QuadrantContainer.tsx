
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
    <div className="bg-gray-50 rounded-lg p-4 border border-gray-300 shadow-lg h-full flex flex-col min-h-[400px]">
      <h4 className="text-center text-sm font-bold text-gray-700 uppercase tracking-wide mb-4">
        {title}
      </h4>
      
      {/* 3 separate cards in a horizontal row with spacing between them */}
      <div className="flex-1 flex gap-3 justify-between">
        {allTypes.map(({ type, list }) => (
          <div key={type} className="flex-1">
            <CompetitorTypeCard
              type={type as any}
              competitors={list}
              getInitials={getCompanyInitials}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default QuadrantContainer;

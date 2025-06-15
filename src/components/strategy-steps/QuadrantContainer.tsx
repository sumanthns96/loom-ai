
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
    <div className="bg-gray-300 rounded-2xl p-10 border border-gray-500 shadow-xl h-full flex flex-col">
      <h4 className="text-center text-sm font-bold text-gray-800 uppercase tracking-wide mb-8 bg-white px-4 py-3 rounded-lg border shadow-sm">
        {title}
      </h4>
      {/* Responsive 3-column grid with fixed card dimensions */}
      <div className="flex justify-center items-center gap-6 flex-1">
        <div className="grid grid-cols-3 gap-6 w-full max-w-4xl">
          {allTypes.map(({ type, list }) => (
            <div key={type} className="flex justify-center">
              <CompetitorTypeCard
                type={type as any}
                competitors={list}
                getInitials={getCompanyInitials}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default QuadrantContainer;

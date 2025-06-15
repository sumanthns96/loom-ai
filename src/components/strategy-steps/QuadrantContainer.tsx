
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
  quadrantIndex?: number; // Add index to determine positioning
}

const QuadrantContainer: FC<QuadrantContainerProps> = ({ 
  title, 
  competitors, 
  getCompanyInitials,
  quadrantIndex 
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

  // Determine alignment based on quadrant index
  // Quadrants 0 and 3 move right, Quadrants 1 and 2 move left
  // Matrix layout: 0=top-right(Q1), 1=top-left(Q2), 2=bottom-left(Q3), 3=bottom-right(Q4)
  const getAlignment = () => {
    if (quadrantIndex === 1 || quadrantIndex === 2) return "justify-start"; // Q1 and Q2 move left
    if (quadrantIndex === 0 || quadrantIndex === 3) return "justify-end"; // Q0 and Q3 move right
    return "justify-center"; // Default center
  };

  return (
    <div className="flex flex-col h-full w-full p-2">
      <h4 className="text-center text-xs font-bold text-gray-700 uppercase tracking-wide mb-3">
        {title}
      </h4>
      
      {/* Vertical stack of cards instead of horizontal row to prevent overlap */}
      <div className={`flex flex-col gap-2 ${getAlignment()} flex-1`}>
        {allTypes.map(({ type, list }) => (
          list.length > 0 && (
            <CompetitorTypeCard
              key={type}
              type={type as any}
              competitors={list}
              getInitials={getCompanyInitials}
            />
          )
        ))}
      </div>
    </div>
  );
};

export default QuadrantContainer;

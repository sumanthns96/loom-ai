
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
  // Quadrant 1 and 4 move right, Quadrant 2 and 3 move left
  // Matrix layout: 1=top-left, 0=top-right, 2=bottom-left, 3=bottom-right
  const getAlignment = () => {
    if (quadrantIndex === 1 || quadrantIndex === 2) return "justify-start"; // Q2 and Q3 move left
    if (quadrantIndex === 0 || quadrantIndex === 3) return "justify-end"; // Q1 and Q4 move right
    return "justify-center"; // Default center
  };

  return (
    <div className="flex flex-col h-full">
      <h4 className="text-center text-sm font-bold text-gray-700 uppercase tracking-wide mb-4">
        {title}
      </h4>
      
      {/* 3 cards in a horizontal row with conditional positioning */}
      <div className={`flex gap-2 ${getAlignment()}`}>
        {allTypes.map(({ type, list }) => (
          <CompetitorTypeCard
            key={type}
            type={type as any}
            competitors={list}
            getInitials={getCompanyInitials}
          />
        ))}
      </div>
    </div>
  );
};

export default QuadrantContainer;

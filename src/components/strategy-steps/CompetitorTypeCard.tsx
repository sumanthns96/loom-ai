
import { FC } from "react";

interface CompetitorData {
  type: "Incumbent" | "Insurgent" | "Adjacent";
  name: string;
  action: string;
  logoUrl?: string;
}

interface CompetitorTypeCardProps {
  type: "Incumbent" | "Insurgent" | "Adjacent";
  competitors: CompetitorData[];
  getInitials: (name: string) => string;
}

const CompetitorTypeCard: FC<CompetitorTypeCardProps> = ({ type, competitors, getInitials }) => {
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

  // Truncate combined action to 12 words max for better fit
  const combinedAction = competitors.map(c => c.action).join(". ");
  const words = combinedAction.split(" ");
  const truncatedAction = words.length > 12 
    ? words.slice(0, 12).join(" ") + "..." 
    : combinedAction;
  
  return (
    <div className={`${typeColors[type]} rounded-lg border-2 p-2 h-32 flex flex-col justify-between shadow-sm overflow-hidden`}>
      {/* Header */}
      <div className="text-center flex-shrink-0">
        <h4 className="text-[9px] font-bold text-gray-800 tracking-wide">
          {typeLabels[type]}
        </h4>
      </div>
      
      {/* Main Content - Scrollable if needed */}
      <div className="flex-1 flex items-center justify-center px-1 overflow-hidden">
        <p className="text-[8px] text-gray-700 text-center leading-tight break-words overflow-hidden">
          {truncatedAction}
        </p>
      </div>
      
      {/* Company Logos */}
      <div className="flex justify-center items-center space-x-1 flex-shrink-0">
        {competitors.slice(0, 3).map((competitor, index) => (
          <div key={index} className="flex flex-col items-center">
            <div className="w-3 h-3 rounded bg-white border border-gray-200 flex items-center justify-center overflow-hidden">
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
              <span className="hidden text-gray-600 text-[6px] font-bold">
                {getInitials(competitor.name)}
              </span>
            </div>
            <span className="text-[6px] text-gray-500 font-medium text-center max-w-[24px] truncate">
              {competitor.name.split(' ')[0]}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CompetitorTypeCard;

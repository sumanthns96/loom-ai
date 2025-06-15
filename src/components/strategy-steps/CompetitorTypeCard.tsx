
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

const typeStyles = {
  Incumbent: {
    border: "border-blue-400",
    bg: "bg-blue-50",
    text: "text-blue-700",
    ring: "ring-blue-200",
  },
  Insurgent: {
    border: "border-red-400",
    bg: "bg-red-50",
    text: "text-red-700",
    ring: "ring-red-200",
  },
  Adjacent: {
    border: "border-green-400",
    bg: "bg-green-50",
    text: "text-green-700",
    ring: "ring-green-200",
  }
};

const typeLabels = {
  Incumbent: "INCUMBENTS",
  Insurgent: "INSURGENTS",
  Adjacent: "ADJACENTS"
};

// A basic summary function (simulates AI summary)
function summarizeActions(actions: string[]): string {
  if (!actions.length) return "";
  if (actions.length === 1) return actions[0];
  // Just briefly concatenate and cut if too long
  const joined = actions.map(a => a.trim().replace(/\.+$/, "")).join(". ");
  return joined;
}

const CompetitorTypeCard: FC<CompetitorTypeCardProps> = ({ type, competitors, getInitials }) => {
  if (competitors.length === 0) return null;
  const styles = typeStyles[type];

  // Restore and summarize actions
  const combinedAction = summarizeActions(competitors.map(c => c.action));
  
  return (
    <div
      className={`
        flex flex-col border-2 rounded-xl p-4 h-full min-w-0 
        ${styles.bg} ${styles.border} shadow-sm transition-all
      `}
      style={{ minHeight: 280 }}
    >
      {/* Header */}
      <div className={`w-full text-center font-bold text-xs uppercase leading-tight mb-3 ${styles.text} tracking-wide`}>
        {typeLabels[type]}
      </div>
      
      {/* Main Content - Full text without truncation */}
      <div className="flex-1 w-full mb-4">
        <p className="text-sm text-gray-700 leading-relaxed px-2">
          {combinedAction}
        </p>
      </div>
      
      {/* Company Logos Only - No Names */}
      <div className="flex justify-center items-center space-x-3 mt-auto">
        {competitors.slice(0, 6).map((competitor, idx) => (
          <div key={idx} className="flex items-center">
            <div
              className={
                "w-8 h-8 rounded bg-white border flex items-center justify-center overflow-hidden ring-1 " +
                styles.ring
              }
            >
              {competitor.logoUrl ? (
                <img
                  src={competitor.logoUrl}
                  alt={competitor.name}
                  className="w-6 h-6 object-contain"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.style.display = "none";
                    target.nextElementSibling!.classList.remove("hidden");
                  }}
                />
              ) : null}
              <span className={`${competitor.logoUrl ? "hidden" : ""} text-gray-600 text-xs font-bold`}>
                {getInitials(competitor.name)}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CompetitorTypeCard;

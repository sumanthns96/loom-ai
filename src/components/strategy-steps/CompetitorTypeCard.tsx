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
  if (joined.length <= 95) return joined;
  // Try to keep meaningful phrases
  return joined.slice(0, 90).replace(/\s+\S*$/, "") + "...";
}

const CompetitorTypeCard: FC<CompetitorTypeCardProps> = ({ type, competitors, getInitials }) => {
  if (competitors.length === 0) return null;
  const styles = typeStyles[type];

  // Restore and summarize actions
  const combinedAction = summarizeActions(competitors.map(c => c.action));
  
  return (
    <div
      className={`
        flex flex-col items-center border-2 rounded-xl p-3 h-full min-w-0 
        ${styles.bg} ${styles.border} overflow-hidden shadow-sm transition-all
      `}
      style={{ minHeight: 160, maxHeight: 180 }}
    >
      {/* Header */}
      <div className={`w-full text-center font-bold text-xs uppercase leading-tight mb-1 ${styles.text} tracking-wide`}>
        {typeLabels[type]}
      </div>
      {/* Main Content, one summary for all competitors */}
      <div className="flex-1 w-full text-center flex items-center justify-center">
        <p
          className="text-sm text-gray-800 font-medium leading-normal max-h-[42px] overflow-hidden text-ellipsis px-2"
          style={{
            display: "-webkit-box",
            WebkitLineClamp: 2,
            WebkitBoxOrient: "vertical",
            whiteSpace: "normal",
          }}
          title={combinedAction}
        >
          {combinedAction}
        </p>
      </div>
      {/* Company Logos */}
      <div className="flex justify-center items-center space-x-2 mt-2 mb-0 w-full overflow-x-auto min-w-0">
        {competitors.slice(0, 8).map((competitor, idx) => (
          <div key={idx} className="flex flex-col items-center min-w-[32px] max-w-[42px]">
            <div
              className={
                "w-6 h-6 rounded bg-white border flex items-center justify-center overflow-hidden mb-1 ring-1 " +
                styles.ring
              }
            >
              {competitor.logoUrl ? (
                <img
                  src={competitor.logoUrl}
                  alt={competitor.name}
                  className="w-5 h-5 object-contain"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.style.display = "none";
                    target.nextElementSibling!.classList.remove("hidden");
                  }}
                />
              ) : null}
              <span className={`${competitor.logoUrl ? "hidden" : ""} text-gray-600 text-[11px] font-bold`}>
                {getInitials(competitor.name)}
              </span>
            </div>
            <span className="text-[10px] text-gray-600 font-medium text-center w-full truncate">
              {competitor.name.split(' ')[0].slice(0, 8)}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CompetitorTypeCard;

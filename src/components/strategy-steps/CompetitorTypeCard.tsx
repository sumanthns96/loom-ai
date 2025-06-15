
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

const CompetitorTypeCard: FC<CompetitorTypeCardProps> = ({ type, competitors, getInitials }) => {
  if (competitors.length === 0) return null;
  const styles = typeStyles[type];

  // Better content truncation for 2 lines (reference design)
  const combinedAction = competitors.map(c => c.action).join(". ");
  function truncateToNChars(text: string, maxChars = 125) {
    if (text.length <= maxChars) return text;
    return text.slice(0, maxChars).replace(/\s+\S*$/, "") + "...";
  }
  const truncatedAction = truncateToNChars(combinedAction, 125);

  return (
    <div
      className={`
        flex flex-col items-center border-2 rounded-xl px-4 pt-3 pb-2 h-full min-w-0 
        ${styles.bg} ${styles.border} overflow-hidden shadow-sm
      `}
      style={{ minHeight: 175, maxHeight: 200 }}
    >
      {/* Header */}
      <div className={`w-full text-center font-bold text-[13px] uppercase leading-tight mb-1 ${styles.text} tracking-wide`}>
        {typeLabels[type]}
      </div>
      {/* Main Content, two lines max */}
      <div className="flex-1 w-full text-center flex items-center justify-center">
        <p
          className="text-[13px] text-gray-800 font-normal leading-tight max-h-[38px] overflow-hidden"
          style={{
            display: "-webkit-box",
            WebkitLineClamp: 2,
            WebkitBoxOrient: "vertical",
            whiteSpace: "normal",
            textOverflow: "ellipsis"
          }}
          title={combinedAction}
        >
          {truncatedAction}
        </p>
      </div>
      {/* Company Logos */}
      <div className="flex justify-center items-center space-x-2 mt-2 mb-0 w-full overflow-x-auto min-w-0">
        {competitors.slice(0, 8).map((competitor, idx) => (
          <div key={idx} className="flex flex-col items-center min-w-[36px] max-w-[46px]">
            <div
              className={
                "w-7 h-7 rounded bg-white border flex items-center justify-center overflow-hidden mb-1 ring-1 " +
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
              <span className={`${competitor.logoUrl ? "hidden" : ""} text-gray-600 text-xs font-bold`}>
                {getInitials(competitor.name)}
              </span>
            </div>
            <span className="text-[9px] text-gray-500 font-medium text-center w-full truncate">
              {competitor.name.split(' ')[0].slice(0, 8)}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CompetitorTypeCard;

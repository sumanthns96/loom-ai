
import { FC, useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

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
  const [summarizedAction, setSummarizedAction] = useState<string>("");
  const [isLoading, setSummaryLoading] = useState(false);

  if (competitors.length === 0) return null;
  const styles = typeStyles[type];

  // Combine all actions into one text
  const combinedAction = competitors.map(c => c.action).join(". ");

  useEffect(() => {
    const summarizeText = async () => {
      if (!combinedAction) return;
      
      setSummaryLoading(true);
      try {
        const { data, error } = await supabase.functions.invoke('summarize-with-gemini', {
          body: { text: combinedAction }
        });

        if (error) throw error;
        // Limit summary to 60 characters for compact display
        const summary = data.summarizedText || combinedAction;
        const truncated = summary.length > 60 ? summary.substring(0, 60) + "..." : summary;
        setSummarizedAction(truncated);
      } catch (error) {
        console.error('Summarization failed:', error);
        // Fallback to truncated original text
        const fallback = combinedAction.length > 60 ? combinedAction.substring(0, 60) + "..." : combinedAction;
        setSummarizedAction(fallback);
      } finally {
        setSummaryLoading(false);
      }
    };

    summarizeText();
  }, [combinedAction]);
  
  return (
    <div
      className={`
        flex flex-col border-2 rounded-xl shadow-lg
        w-72 h-80 p-5
        ${styles.bg} ${styles.border} 
        transition-all hover:shadow-xl
      `}
    >
      {/* Header - Fixed height */}
      <div className={`
        w-full text-center font-bold text-sm uppercase tracking-wide
        ${styles.text} h-8 flex items-center justify-center flex-shrink-0
      `}>
        {typeLabels[type]}
      </div>
      
      {/* Main Content - Large readable text, center-aligned, 1-2 lines max */}
      <div className="flex-1 flex items-center justify-center px-4 py-6">
        <p className={`
          text-lg font-medium text-gray-800 text-center leading-relaxed
          line-clamp-2 overflow-hidden
        `}>
          {isLoading ? "Analyzing..." : summarizedAction}
        </p>
      </div>
      
      {/* Company Logos - Bottom section, max 4 logos */}
      <div className="flex justify-center items-center gap-3 h-16 flex-shrink-0">
        {competitors.slice(0, 4).map((competitor, idx) => (
          <div
            key={idx}
            className={`
              w-10 h-10 rounded-lg bg-white border-2 shadow-sm
              flex items-center justify-center overflow-hidden
              ${styles.ring} transition-transform hover:scale-105
            `}
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
            <span className={`${competitor.logoUrl ? "hidden" : ""} text-gray-700 text-xs font-semibold`}>
              {getInitials(competitor.name)}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CompetitorTypeCard;

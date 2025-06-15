
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
        setSummarizedAction(data.summarizedText || combinedAction);
      } catch (error) {
        console.error('Summarization failed:', error);
        // Fallback to truncated original text
        setSummarizedAction(combinedAction.length > 80 ? combinedAction.substring(0, 80) + "..." : combinedAction);
      } finally {
        setSummaryLoading(false);
      }
    };

    summarizeText();
  }, [combinedAction]);
  
  return (
    <div
      className={`
        flex flex-col border-2 rounded-2xl p-4 h-full w-full aspect-square
        ${styles.bg} ${styles.border} shadow-sm transition-all
      `}
    >
      {/* Header */}
      <div className={`w-full text-center font-semibold text-xs uppercase leading-tight mb-3 ${styles.text} tracking-wide`}>
        {typeLabels[type]}
      </div>
      
      {/* Main Content - Summarized text */}
      <div className="flex-1 w-full mb-4 flex items-center justify-center">
        <p className="text-sm text-gray-700 leading-relaxed text-center px-2">
          {isLoading ? "Summarizing..." : summarizedAction}
        </p>
      </div>
      
      {/* Company Logos Only - No Names */}
      <div className="flex justify-center items-center space-x-2 mt-auto">
        {competitors.slice(0, 6).map((competitor, idx) => (
          <div key={idx} className="flex items-center">
            <div
              className={
                "w-6 h-6 rounded bg-white border flex items-center justify-center overflow-hidden ring-1 " +
                styles.ring
              }
            >
              {competitor.logoUrl ? (
                <img
                  src={competitor.logoUrl}
                  alt={competitor.name}
                  className="w-4 h-4 object-contain"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.style.display = "none";
                    target.nextElementSibling!.classList.remove("hidden");
                  }}
                />
              ) : null}
              <span className={`${competitor.logoUrl ? "hidden" : ""} text-gray-600 text-xs font-medium`}>
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

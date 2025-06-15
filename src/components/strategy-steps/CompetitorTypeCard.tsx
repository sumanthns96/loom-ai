
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
    border: "border-blue-300",
    bg: "bg-blue-50",
    text: "text-blue-800",
  },
  Insurgent: {
    border: "border-red-300", 
    bg: "bg-red-50",
    text: "text-red-800",
  },
  Adjacent: {
    border: "border-green-300",
    bg: "bg-green-50", 
    text: "text-green-800",
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
        // Use the summarized text directly without character truncation
        const summary = data.summarizedText || combinedAction;
        setSummarizedAction(summary);
      } catch (error) {
        console.error('Summarization failed:', error);
        // Fallback to original text if summarization fails
        setSummarizedAction(combinedAction);
      } finally {
        setSummaryLoading(false);
      }
    };

    summarizeText();
  }, [combinedAction]);
  
  return (
    <div
      className={`
        border-2 rounded-lg shadow-md p-3
        h-full max-h-[280px] min-h-[240px]
        ${styles.bg} ${styles.border} 
        transition-all hover:shadow-lg
        flex flex-col justify-between
      `}
    >
      {/* Header - Category name */}
      <div className={`
        text-center font-bold text-xs uppercase tracking-wide mb-3
        ${styles.text}
      `}>
        {typeLabels[type]}
      </div>
      
      {/* Main Content - Summary text (center section) */}
      <div className="flex-1 flex items-center justify-center px-2">
        <p className="text-sm font-medium text-gray-700 text-center leading-relaxed">
          {isLoading ? "Analyzing..." : summarizedAction}
        </p>
      </div>
      
      {/* Company Logos - Bottom section */}
      <div className="flex justify-center items-center gap-2 mt-3">
        {competitors.slice(0, 4).map((competitor, idx) => (
          <div
            key={idx}
            className="w-7 h-7 rounded bg-white border shadow-sm flex items-center justify-center overflow-hidden"
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


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
      
      console.log('Starting summarization for:', type, combinedAction);
      setSummaryLoading(true);
      
      try {
        const { data, error } = await supabase.functions.invoke('summarize-with-gemini', {
          body: { text: combinedAction }
        });

        console.log('Summarization response:', data, error);

        if (error) {
          console.error('Summarization error:', error);
          throw error;
        }
        
        const summary = data?.summarizedText || combinedAction.split(' ').slice(0, 8).join(' ');
        console.log('Setting summary:', summary);
        setSummarizedAction(summary);
      } catch (error) {
        console.error('Summarization failed for', type, ':', error);
        // Fallback to a very short version of original text
        const shortFallback = combinedAction.split(' ').slice(0, 8).join(' ');
        setSummarizedAction(shortFallback);
      } finally {
        setSummaryLoading(false);
      }
    };

    summarizeText();
  }, [combinedAction, type]);
  
  return (
    <div
      className={`
        border-2 rounded-lg shadow-sm p-4
        w-full aspect-square
        ${styles.bg} ${styles.border} 
        transition-all hover:shadow-md
        flex flex-col justify-between
        min-h-[140px]
      `}
    >
      {/* Header - Category name */}
      <div className={`
        text-center font-bold text-xs uppercase tracking-wide mb-2
        ${styles.text}
      `}>
        {typeLabels[type]}
      </div>
      
      {/* Main Content - Summary text (center section) */}
      <div className="flex-1 flex items-center justify-center px-2">
        <p className="text-sm text-gray-700 text-center leading-tight font-medium">
          {isLoading ? "Analyzing..." : summarizedAction || "Processing..."}
        </p>
      </div>
      
      {/* Company Logos - Bottom section */}
      <div className="flex justify-center items-center gap-2 mt-2">
        {competitors.slice(0, 4).map((competitor, idx) => (
          <div
            key={idx}
            className="w-6 h-6 rounded bg-white border shadow-sm flex items-center justify-center overflow-hidden"
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

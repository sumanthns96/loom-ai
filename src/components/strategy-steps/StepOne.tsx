import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { RefreshCw, Users, Lightbulb, BarChart2, Recycle, Landmark } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import SteepCategorySection from "./SteepCategorySection";

// Map factor name to color and icon for display, as per the reference image
const FACTOR_STYLES: Record<
  string,
  { color: string; bg: string; icon: React.ReactNode }
> = {
  Social: {
    color: "text-red-600",
    bg: "bg-red-100",
    icon: <Users className="w-6 h-6 text-red-500" />,
  },
  Technological: {
    color: "text-yellow-700",
    bg: "bg-yellow-100",
    icon: <Lightbulb className="w-6 h-6 text-yellow-400" />,
  },
  Economic: {
    color: "text-yellow-900",
    bg: "bg-yellow-200",
    icon: <BarChart2 className="w-6 h-6 text-yellow-500" />,
  },
  Environmental: {
    color: "text-green-700",
    bg: "bg-green-100",
    icon: <Recycle className="w-6 h-6 text-green-500" />,
  },
  Political: {
    color: "text-cyan-700",
    bg: "bg-cyan-100",
    icon: <Landmark className="w-6 h-6 text-cyan-500" />, // Changed to Landmark
  },
};

const FACTOR_ORDER = [
  "Social",
  "Technological",
  "Economic",
  "Environmental",
  "Political",
];

type SteepAnalysisPoint = {
  text: string;
};
type SteepFactorGroup = {
  factor: string;
  points: SteepAnalysisPoint[];
  selected: number[]; // indexes of selected points
};

interface StepOneProps {
  pdfContent: string;
  data: string; // Will be JSON string of SteepFactorGroup[]
  onDataChange: (data: string) => void;
  onNext: (selectedPoints: SelectedPoint[]) => void; // NEW for next step
}

// Selected point type
export type SelectedPoint = {
  factor: string;        // e.g. "Social"
  pointIdx: number;      // index in .points array (0,1,2)
  text: string;          // actual analysis point text
};

const StepOne = ({ pdfContent, data, onDataChange, onNext }: StepOneProps) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [factors, setFactors] = useState<SteepFactorGroup[]>([]);
  const [hasGenerated, setHasGenerated] = useState(false);

  // Parse JSON model for 3 points per factor
  useEffect(() => {
    try {
      if (data) {
        // Data is a JSON string of SteepFactorGroup[]
        const parsed: SteepFactorGroup[] = JSON.parse(data);
        if (Array.isArray(parsed) && parsed[0]?.points) {
          setFactors(parsed);
          setHasGenerated(true);
          return;
        }
      }
      setFactors([]);
      setHasGenerated(false);
    } catch {
      setFactors([]);
      setHasGenerated(false);
    }
  }, [data]);

  const handleSelect = (factorIdx: number, pointIdx: number, checked: boolean) => {
    setFactors((prev) => {
      const next = prev.map((f, i) =>
        i === factorIdx
          ? {
              ...f,
              selected: checked
                ? Array.from(new Set([...f.selected, pointIdx]))
                : f.selected.filter((j) => j !== pointIdx),
            }
          : f
      );
      onDataChange(JSON.stringify(next));
      return next;
    });
  };

  const handleEdit = (factorIdx: number, pointIdx: number, value: string) => {
    setFactors((prev) => {
      const next = prev.map((f, i) =>
        i === factorIdx
          ? {
              ...f,
              points: f.points.map((p, j) =>
                j === pointIdx ? { ...p, text: value } : p
              ),
            }
          : f
      );
      onDataChange(JSON.stringify(next));
      return next;
    });
  };

  const generateAnalysis = async () => {
    setIsGenerating(true);
    try {
      // Updated prompt to ask for 3 points per factor:
      const prompt = `
You are an expert strategy consultant at BCG. Based on the provided case study, provide an in-depth, up-to-date STEEP analysis with 3 factors/points per category (Social, Technological, Economic, Environmental, Political). For each factor:
- Return an array of exactly 5 objects (order: Social, Technological, Economic, Environmental, Political)
- Each object MUST have "factor" (as above) and "points" (array of 3 string analysis points, each 2-3 sentences, specific and actionable)
- JSON only, no markdown, no prose.

Case Study:
---
${pdfContent}
---`;

      const { data: responseData, error } = await supabase.functions.invoke(
        "generate-steep-analysis",
        { body: { pdfContent: prompt } }
      );

      if (error) {
        toast({
          title: "Error generating analysis",
          description: error.message,
          variant: "destructive",
        });
        setIsGenerating(false);
        return;
      }
      // Parse: accept .steepAnalysis or direct array
      let arr: any[] | undefined = undefined;
      if (
        responseData &&
        Array.isArray(responseData.steepAnalysis)
      ) {
        arr = responseData.steepAnalysis;
      } else if (
        responseData &&
        Array.isArray(responseData.STEEPAnalysis)
      ) {
        arr = responseData.STEEPAnalysis;
      } else if (Array.isArray(responseData)) {
        arr = responseData;
      } else if (
        typeof responseData === "object" &&
        responseData !== null
      ) {
        // Sometimes embedded as JSON string property!
        const possible = responseData.steepAnalysis || responseData.STEEPAnalysis;
        if (typeof possible === "string") {
          try {
            const parsed = JSON.parse(possible);
            if (Array.isArray(parsed)) {
              arr = parsed;
            }
          } catch { /* ignore */ }
        }
      }
      if (!arr || !Array.isArray(arr) || !arr[0]?.points) {
        toast({
          title: "Error processing analysis",
          description: "Could not parse 3-point STEEP analysis from AI response.",
          variant: "destructive",
        });
        setIsGenerating(false);
        return;
      }

      // Structure enforced: [{factor, points:["","", ""]}] - fallback if analysis points missing.
      const ordered: SteepFactorGroup[] = FACTOR_ORDER.map((factor) => {
        const found = arr.find((e) => e.factor === factor);
        return {
          factor,
          points: (found?.points && Array.isArray(found.points)
            ? found.points.map((pt: string) => ({ text: pt }))
            : [{ text: "" }, { text: "" }, { text: "" }]
          ).slice(0, 3),
          selected: [],
        };
      });
      setFactors(ordered);
      setHasGenerated(true);
      onDataChange(JSON.stringify(ordered));
      toast({
        title: "Analysis generated",
        description: "AI has completed the detailed 3-point STEEP analysis.",
      });
    } catch (error) {
      toast({
        title: "Error generating analysis",
        description:
          "An unexpected error occurred while generating the analysis.",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  // Helper to extract selected points for next step
  const getSelectedPoints = (): SelectedPoint[] => {
    return factors.flatMap((group) =>
      group.selected.map(i => ({
        factor: group.factor,
        pointIdx: i,
        text: group.points[i]?.text || ""
      }))
    );
  };

  // Add "Continue" button if any point is selected
  const selectedPoints = getSelectedPoints();

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <span role="img" aria-label="lightbulb">💡</span>
            <span>STEEP Analysis</span>
          </CardTitle>
          <CardDescription>
            In-depth, actionable STEEP analysis. Each category includes 3 points. Select the most relevant points for further strategic work.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4 min-h-[800px]">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-medium">STEEP 3-Point Analysis</h3>
            <Button
              onClick={generateAnalysis}
              disabled={isGenerating || !pdfContent}
              variant="outline"
            >
              {isGenerating ? (
                <>
                  <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Generate with AI
                </>
              )}
            </Button>
          </div>
          {isGenerating && (
            <div className="h-60 flex items-center justify-center text-muted-foreground gap-2">
              <RefreshCw className="h-5 w-5 animate-spin" />
              <span>Generating detailed analysis with Gemini...</span>
            </div>
          )}
          {!isGenerating && !hasGenerated && (
            <div className="h-60 flex items-center justify-center text-muted-foreground">
              <span>Click "Generate with AI" to start your STEEP analysis</span>
            </div>
          )}
          {!isGenerating && hasGenerated &&
            factors.map((group, factorIdx) => (
              <SteepCategorySection
                key={group.factor}
                factor={group.factor}
                style={FACTOR_STYLES[group.factor]}
                points={group.points.map((p) => p.text)}
                selectedIndexes={group.selected}
                onSelect={(pointIdx, checked) =>
                  handleSelect(factorIdx, pointIdx, checked)
                }
                onEdit={(pointIdx, value) =>
                  handleEdit(factorIdx, pointIdx, value)
                }
              />
            ))}
          {!isGenerating && hasGenerated && (
            <div className="flex justify-end mt-8">
              <Button
                onClick={() => onNext(selectedPoints)}
                disabled={selectedPoints.length < 2}
                className="bg-blue-600 hover:bg-blue-700"
              >
                Continue to Scenario Matrix
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default StepOne;

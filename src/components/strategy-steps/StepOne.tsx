import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { RefreshCw, Users, Lightbulb, BarChart2, Recycle, Landmark } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface SteepEntry {
  factor: string;
  analysis: string;
}

interface StepOneProps {
  pdfContent: string;
  data: string; // This will be a JSON string of SteepEntry[]
  onDataChange: (data: string) => void;
}

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

const StepOne = ({ pdfContent, data, onDataChange }: StepOneProps) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [analysis, setAnalysis] = useState<SteepEntry[]>([]);

  useEffect(() => {
    try {
      if (data) {
        const parsedData = JSON.parse(data);
        // Accept as array, or object with STEEPAnalysis or steepAnalysis property
        let arr: SteepEntry[] = [];
        if (Array.isArray(parsedData)) {
          arr = parsedData;
        } else if (parsedData && Array.isArray(parsedData.steepAnalysis)) {
          arr = parsedData.steepAnalysis;
        } else if (parsedData && Array.isArray(parsedData.STEEPAnalysis)) {
          arr = parsedData.STEEPAnalysis;
        }
        if (arr.length > 0) {
          setAnalysis(arr);
        } else {
          setAnalysis([]);
        }
      } else {
        setAnalysis([]);
      }
    } catch (error) {
      setAnalysis([]);
    }
  }, [data]);

  const generateAnalysis = async () => {
    setIsGenerating(true);

    try {
      // UPDATED prompt with strategy consultant expert context and explicit structure:
      const detailedPrompt = `
You are an expert strategy consultant at BCG. Based on the provided case study, provide an in-depth, up-to-date STEEP analysis for the case with references to current trends and global context.
For each factor, analyze deeply and use the latest knowledge. Format your response as a valid JSON array of exactly 5 objects in this order: ["Social", "Technological", "Economic", "Environmental", "Political"]. Each object must have a "factor" key (with the name above) and an "analysis" key (with a detailed analysis, at least 2-3 sentences). Do NOT include markdown or extra text.

Case Study:
---
${pdfContent}
---`;

      const { data: responseData, error } = await supabase.functions.invoke(
        "generate-steep-analysis",
        {
          body: { pdfContent: detailedPrompt },
        }
      );

      if (error) {
        toast({
          title: "Error generating analysis",
          description: error.message,
          variant: "destructive",
        });
        return;
      }

      // Parse result: look for array, steepAnalysis, STEEPAnalysis, or try to extract with fallback.
      let newAnalysis: SteepEntry[] | undefined;
      if (
        responseData &&
        Array.isArray(responseData.steepAnalysis)
      ) {
        newAnalysis = responseData.steepAnalysis;
      } else if (
        responseData &&
        Array.isArray(responseData.STEEPAnalysis)
      ) {
        newAnalysis = responseData.STEEPAnalysis;
      } else if (Array.isArray(responseData)) {
        newAnalysis = responseData;
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
              newAnalysis = parsed;
            }
          } catch { /* ignore */ }
        }
      }
      if (!newAnalysis || !Array.isArray(newAnalysis)) {
        toast({
          title: "Error processing analysis",
          description: "Unexpected response format from AI service.",
          variant: "destructive",
        });
        setIsGenerating(false);
        return;
      }

      // Sort so always in STEEP order
      const ordered = FACTOR_ORDER.map((factor) =>
        newAnalysis!.find((e) => e.factor === factor) || {
          factor,
          analysis: "",
        }
      );
      setAnalysis(ordered);
      onDataChange(JSON.stringify(ordered));
      toast({
        title: "Analysis generated",
        description: "AI has completed the STEEP analysis based on your case study.",
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

  const handleAnalysisChange = (value: string, index: number) => {
    const newAnalysis = [...analysis];
    newAnalysis[index].analysis = value;
    setAnalysis(newAnalysis);
    onDataChange(JSON.stringify(newAnalysis));
  };

  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <span role="img" aria-label="lightbulb">💡</span>
            <span>STEEP Analysis</span>
          </CardTitle>
          <CardDescription>
            As an expert strategy consultant: AI-generated, in-depth STEEP analysis for your uploaded document, styled for presentation.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-medium">STEEP Analysis</h3>
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

          {/* Custom table for STEEP as per image */}
          <div className="rounded-lg overflow-hidden shadow-md border">
            <div>
              {isGenerating && (
                <div className="h-40 flex items-center justify-center text-muted-foreground gap-2">
                  <RefreshCw className="h-5 w-5 animate-spin" />
                  <span>Generating analysis with Gemini...</span>
                </div>
              )}
              {!isGenerating && (!analysis || analysis.length === 0) && (
                <div className="h-40 flex items-center justify-center text-muted-foreground">
                  Click "Generate with AI" to create a STEEP analysis from your document.
                </div>
              )}
              {!isGenerating &&
                analysis.length > 0 &&
                analysis.map((item, idx) => {
                  const style = FACTOR_STYLES[item.factor] ?? { color: "", bg: "", icon: null };
                  return (
                    <div
                      key={item.factor}
                      className={`flex items-stretch border-b last:border-none ${style.bg}`}
                    >
                      {/* Sidebar letter & icon */}
                      <div
                        className={`flex flex-col items-center justify-center w-16 min-w-[64px] ${style.bg}`}
                      >
                        <span
                          className={`text-3xl font-extrabold ${style.color}`}
                        >
                          {item.factor[0]}
                        </span>
                        <span className="mt-2">{style.icon}</span>
                      </div>
                      {/* Main content */}
                      <div className="flex-[2] flex flex-col justify-center px-4 py-5">
                        <span
                          className={`uppercase font-bold text-lg pb-1 tracking-wide ${style.color}`}
                        >
                          {item.factor}
                        </span>
                        <Textarea
                          value={item.analysis}
                          onChange={(e) => handleAnalysisChange(e.target.value, idx)}
                          className="w-full border-none focus-visible:ring-0 focus-visible:ring-offset-0 p-0 min-h-[80px] bg-transparent resize-none font-normal text-base"
                          placeholder="Analysis goes here..."
                        />
                      </div>
                    </div>
                  );
                })}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default StepOne;

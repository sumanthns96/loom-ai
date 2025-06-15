import { useState } from "react";
import { Button } from "@/components/ui/button";
import { RefreshCw } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { SteepFactorGroup } from "./types";
import { FACTOR_ORDER } from "./constants";
interface AnalysisGeneratorProps {
  pdfContent: string;
  isGenerating: boolean;
  onGenerationStart: () => void;
  onGenerationComplete: (factors: SteepFactorGroup[]) => void;
  onGenerationError: () => void;
}
const AnalysisGenerator = ({
  pdfContent,
  isGenerating,
  onGenerationStart,
  onGenerationComplete,
  onGenerationError
}: AnalysisGeneratorProps) => {
  const generateAnalysis = async () => {
    onGenerationStart();
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
      const {
        data: responseData,
        error
      } = await supabase.functions.invoke("generate-steep-analysis", {
        body: {
          pdfContent: prompt
        }
      });
      if (error) {
        toast({
          title: "Error generating analysis",
          description: error.message,
          variant: "destructive"
        });
        onGenerationError();
        return;
      }

      // Parse: accept .steepAnalysis or direct array
      let arr: any[] | undefined = undefined;
      if (responseData && Array.isArray(responseData.steepAnalysis)) {
        arr = responseData.steepAnalysis;
      } else if (responseData && Array.isArray(responseData.STEEPAnalysis)) {
        arr = responseData.STEEPAnalysis;
      } else if (Array.isArray(responseData)) {
        arr = responseData;
      } else if (typeof responseData === "object" && responseData !== null) {
        // Sometimes embedded as JSON string property!
        const possible = responseData.steepAnalysis || responseData.STEEPAnalysis;
        if (typeof possible === "string") {
          try {
            const parsed = JSON.parse(possible);
            if (Array.isArray(parsed)) {
              arr = parsed;
            }
          } catch {/* ignore */}
        }
      }
      if (!arr || !Array.isArray(arr) || !arr[0]?.points) {
        toast({
          title: "Error processing analysis",
          description: "Could not parse 3-point STEEP analysis from AI response.",
          variant: "destructive"
        });
        onGenerationError();
        return;
      }

      // Structure enforced: [{factor, points:["","", ""]}] - fallback if analysis points missing.
      const ordered: SteepFactorGroup[] = FACTOR_ORDER.map(factor => {
        const found = arr.find(e => e.factor === factor);
        return {
          factor,
          points: (found?.points && Array.isArray(found.points) ? found.points.map((pt: string) => ({
            text: pt
          })) : [{
            text: ""
          }, {
            text: ""
          }, {
            text: ""
          }]).slice(0, 3),
          selected: []
        };
      });
      onGenerationComplete(ordered);
      toast({
        title: "Analysis generated",
        description: "AI has completed the detailed 3-point STEEP analysis."
      });
    } catch (error) {
      toast({
        title: "Error generating analysis",
        description: "An unexpected error occurred while generating the analysis.",
        variant: "destructive"
      });
      onGenerationError();
    }
  };
  return <div className="flex justify-between items-center">
      <h3 className="text-lg font-medium text-center">Analyzing the Strategic Landscape from the Outside-IN</h3>
      <Button onClick={generateAnalysis} disabled={isGenerating || !pdfContent} variant="outline">
        {isGenerating ? <>
            <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
            Generating...
          </> : <>
            <RefreshCw className="h-4 w-4 mr-2" />
            Generate with AI
          </>}
      </Button>
    </div>;
};
export default AnalysisGenerator;

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { RefreshCw, TrendingUp } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import ThreeHorizonsChart from "./ThreeHorizonsChart";

interface StepFiveProps {
  pdfContent: string;
  data: string;
  onDataChange: (data: string) => void;
}

interface HorizonsData {
  horizon1: { focus1: string; focus2: string; strategy: string; };
  horizon2: { focus1: string; focus2: string; strategy: string; };
  horizon3: { focus1: string; focus2: string; strategy: string; };
}

const StepFive = ({ pdfContent, data, onDataChange }: StepFiveProps) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [horizonsData, setHorizonsData] = useState<HorizonsData | null>(null);

  useEffect(() => {
    if (data) {
      try {
        const parsed = JSON.parse(data);
        setHorizonsData(parsed);
      } catch {
        // If data is old format string, ignore and let user regenerate
      }
    }
  }, [data]);

  const parseThreeHorizonsText = (text: string): HorizonsData | null => {
    try {
      const horizonSections = text.split(/HORIZON \d/);
      
      const parseHorizonSection = (section: string) => {
        const focus1Match = section.match(/Focus 1: (.+?)(?=Focus 2|Strategy|$)/s);
        const focus2Match = section.match(/Focus 2: (.+?)(?=Strategy|$)/s);
        const strategyMatch = section.match(/Strategy: (.+?)(?=HORIZON|$)/s);
        
        return {
          focus1: focus1Match?.[1]?.trim() || "",
          focus2: focus2Match?.[1]?.trim() || "",
          strategy: strategyMatch?.[1]?.trim() || ""
        };
      };

      return {
        horizon1: parseHorizonSection(horizonSections[1] || ""),
        horizon2: parseHorizonSection(horizonSections[2] || ""),
        horizon3: parseHorizonSection(horizonSections[3] || "")
      };
    } catch (error) {
      console.error('Error parsing three horizons text:', error);
      return null;
    }
  };

  const generateThreeHorizons = async () => {
    setIsGenerating(true);
    
    try {
      // Get previous step data from localStorage
      const wizardState = localStorage.getItem("strategyWizardState");
      let steepAnalysis = "";
      let scenarioMatrix = "";
      let strategicOptions = "";
      let dotsStrategy = "";

      if (wizardState) {
        const state = JSON.parse(wizardState);
        steepAnalysis = state.stepData?.step1 || "";
        scenarioMatrix = state.stepData?.step2 || "";
        strategicOptions = state.stepData?.step3 || "";
        dotsStrategy = state.stepData?.step4 || ""; // DOTS is now step 4
      }

      const { data: result, error } = await supabase.functions.invoke('generate-three-horizons', {
        body: {
          pdfContent,
          steepAnalysis,
          scenarioMatrix,
          strategicOptions,
          dotsStrategy
        }
      });

      if (error) throw error;

      if (result.success && result.threeHorizons) {
        const parsedData = parseThreeHorizonsText(result.threeHorizons);
        
        if (parsedData) {
          setHorizonsData(parsedData);
          onDataChange(JSON.stringify(parsedData));
          
          toast({
            title: "Three Horizons Implementation Generated",
            description: "Strategic roadmap has been created based on your DOTS strategy.",
          });
        } else {
          throw new Error("Failed to parse generated content");
        }
      } else {
        throw new Error(result.error || "Failed to generate three horizons model");
      }
    } catch (error) {
      console.error('Error generating three horizons:', error);
      toast({
        title: "Generation Failed",
        description: "Failed to generate the Three Horizons Implementation. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <TrendingUp className="h-5 w-5 text-blue-600" />
            <span>Three Horizons Implementation</span>
          </CardTitle>
          <CardDescription>
            Transform your DOTS strategic response themes into a detailed tactical roadmap 
            across three time horizons: core optimization (0-2 years), adjacent opportunities (3-4 years), 
            and breakthrough innovation (5-6 years).
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-medium">Tactical Implementation Roadmap</h3>
            <Button
              onClick={generateThreeHorizons}
              disabled={isGenerating}
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
                  Generate Implementation Roadmap
                </>
              )}
            </Button>
          </div>

          <ThreeHorizonsChart horizonsData={horizonsData} />

          <div className="bg-blue-50 p-4 rounded-lg">
            <h4 className="font-medium text-blue-900 mb-2">Implementation Framework:</h4>
            <ul className="text-sm text-blue-800 space-y-1">
              <li>• <strong>Horizon 1 (0-2 years):</strong> Tactical initiatives to operationalize strategic response themes</li>
              <li>• <strong>Horizon 2 (3-4 years):</strong> Mid-term programs to build capabilities for strategic opportunities</li>
              <li>• <strong>Horizon 3 (5-6 years):</strong> Long-term innovations to address strategic drivers and threats</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default StepFive;

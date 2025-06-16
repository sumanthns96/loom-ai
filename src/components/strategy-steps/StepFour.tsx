
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { RefreshCw, Target } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import DotsStrategyTable from "./DotsStrategyTable";

interface StepFourProps {
  pdfContent: string;
  data: string;
  onDataChange: (data: string) => void;
}

interface DotsData {
  drivers: string[];
  opportunities: string[];
  threats: string[];
  strategicResponse: string[];
}

const StepFour = ({ pdfContent, data, onDataChange }: StepFourProps) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [dotsData, setDotsData] = useState<DotsData | null>(null);

  useEffect(() => {
    if (data) {
      try {
        const parsed = JSON.parse(data);
        setDotsData(parsed);
      } catch {
        // If data is old format or invalid, ignore and let user regenerate
      }
    }
  }, [data]);

  const cleanMarkdownText = (text: string): string => {
    if (!text) return text;
    
    // Remove markdown formatting while preserving the text
    return text
      .replace(/\*\*(.*?)\*\*/g, '$1') // Remove **bold** formatting
      .replace(/\*(.*?)\*/g, '$1')     // Remove *italic* formatting
      .replace(/^\s*[\*\-\+]\s+/gm, '') // Remove bullet points at start of lines
      .replace(/^\s*\d+\.\s+/gm, '')   // Remove numbered lists
      .trim();
  };

  const parseDotsText = (text: string): DotsData | null => {
    try {
      const sections = {
        drivers: [] as string[],
        opportunities: [] as string[],
        threats: [] as string[],
        strategicResponse: [] as string[]
      };

      // Split text by main sections
      const driversMatch = text.match(/DRIVERS:(.*?)(?=OPPORTUNITIES:|$)/s);
      const opportunitiesMatch = text.match(/OPPORTUNITIES:(.*?)(?=THREATS:|$)/s);
      const threatsMatch = text.match(/THREATS:(.*?)(?=STRATEGIC RESPONSE:|$)/s);
      const strategicResponseMatch = text.match(/STRATEGIC RESPONSE:(.*?)$/s);

      // Parse each section into bullet points and clean markdown
      const parseSection = (sectionText: string): string[] => {
        if (!sectionText) return [];
        return sectionText
          .split(/\n/)
          .map(line => cleanMarkdownText(line.replace(/^[•\-\*]\s*/, '').trim()))
          .filter(line => line.length > 0 && !line.match(/^\[.*\]$/))
          .slice(0, 4); // Limit to 4 items per section
      };

      if (driversMatch) sections.drivers = parseSection(driversMatch[1]);
      if (opportunitiesMatch) sections.opportunities = parseSection(opportunitiesMatch[1]);
      if (threatsMatch) sections.threats = parseSection(threatsMatch[1]);
      if (strategicResponseMatch) sections.strategicResponse = parseSection(strategicResponseMatch[1]);

      return sections;
    } catch (error) {
      console.error('Error parsing DOTS text:', error);
      return null;
    }
  };

  const generateDotsStrategy = async () => {
    setIsGenerating(true);
    
    try {
      // Get previous step data from localStorage
      const wizardState = localStorage.getItem("strategyWizardState");
      let steepAnalysis = "";
      let scenarioMatrix = "";
      let strategicOptions = "";

      if (wizardState) {
        const state = JSON.parse(wizardState);
        steepAnalysis = state.stepData?.step1 || "";
        scenarioMatrix = state.stepData?.step2 || "";
        strategicOptions = state.stepData?.step3 || "";
      }

      const { data: result, error } = await supabase.functions.invoke('generate-dots-strategy', {
        body: {
          pdfContent,
          steepAnalysis,
          scenarioMatrix,
          strategicOptions
        }
      });

      if (error) throw error;

      if (result.success && result.dotsStrategy) {
        const parsedData = parseDotsText(result.dotsStrategy);
        
        if (parsedData) {
          setDotsData(parsedData);
          onDataChange(JSON.stringify(parsedData));
          
          toast({
            title: "DOTS Strategy Generated",
            description: "Strategic vision framework has been created based on your analysis.",
          });
        } else {
          throw new Error("Failed to parse generated content");
        }
      } else {
        throw new Error(result.error || "Failed to generate DOTS strategy");
      }
    } catch (error) {
      console.error('Error generating DOTS strategy:', error);
      toast({
        title: "Generation Failed",
        description: "Failed to generate the DOTS Strategy. Please try again.",
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
            <Target className="h-5 w-5 text-purple-600" />
            <span>DOTS Strategy Framework</span>
          </CardTitle>
          <CardDescription>
            Generate a comprehensive strategic vision that identifies key Drivers, Opportunities, 
            Threats, and Strategic Response themes to guide your tactical implementation planning.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-medium">Strategic Vision</h3>
            <Button
              onClick={generateDotsStrategy}
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
                  Generate DOTS
                </>
              )}
            </Button>
          </div>

          <DotsStrategyTable dotsData={dotsData} />

          <div className="bg-purple-50 p-4 rounded-lg">
            <h4 className="font-medium text-purple-900 mb-2">DOTS Framework:</h4>
            <ul className="text-sm text-purple-800 space-y-1">
              <li>• <strong>Drivers:</strong> Key internal capabilities and external forces shaping your future</li>
              <li>• <strong>Opportunities:</strong> Strategic possibilities for growth and competitive advantage</li>
              <li>• <strong>Threats:</strong> Significant risks that could impact organizational success</li>
              <li>• <strong>Strategic Response:</strong> High-level themes that inform tactical roadmaps</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default StepFour;

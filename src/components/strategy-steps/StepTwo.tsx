import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { ChevronDown, ChevronUp, ArrowRight } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import type { SelectedPoint } from "./types";
import { QUADRANT_REQUESTS, makeQuadrantPrompt, MatrixScenario } from "./QuadrantPromptUtils";
import ScenarioMatrix from "./ScenarioMatrix";
import SteepCategorySection from "./SteepCategorySection";
import { FACTOR_STYLES } from "./constants";

async function fetchAxisContext(factor: string, axisText: string, caseContext: string) {
  const prompt = `
CONTEXT: ${caseContext}

TASK: For the STEEP factor "${factor}", create clear axis labels for a 2x2 scenario matrix.

REQUIREMENTS:
- Generate ONE specific aspect that could realistically increase/advance (HIGH direction)
- Generate ONE specific aspect that could realistically decrease/decline (LOW direction)
- Each label must be 2-4 words maximum
- Labels must be opposite ends of the same spectrum
- Be specific to the case context, not generic
- Focus on measurable or observable changes

FACTOR DETAILS: ${axisText}

EXAMPLES of good axis pairs:
- "Regulation Tightens" vs "Regulation Relaxes"
- "AI Adoption Accelerates" vs "AI Adoption Stalls"
- "Market Consolidates" vs "Market Fragments"

Respond ONLY with valid JSON in this exact format:
{"low": "specific decline phrase", "high": "specific advance phrase"}

No explanations, no markdown, just the JSON object.`;

  try {
    const { data: responseData, error } = await supabase.functions.invoke("generate-scenario-matrix", {
      body: { prompt }
    });

    if (error) {
      console.error('Axis context generation error:', error);
      return { low: "Low", high: "High" };
    }

    // Parse the response more robustly
    let content = responseData?.raw || responseData;
    if (typeof content !== "string") {
      content = JSON.stringify(content);
    }
    
    // Clean up common JSON formatting issues
    content = content.replace(/^\s*```json\s*|\s*```\s*$/gi, "").trim();
    content = content.replace(/^[^{]*({.*})[^}]*$/s, "$1"); // Extract JSON object
    
    const parsed = JSON.parse(content);
    
    if (typeof parsed.low === "string" && typeof parsed.high === "string" && 
        parsed.low.trim() && parsed.high.trim()) {
      return {
        low: parsed.low.trim(),
        high: parsed.high.trim()
      };
    }
  } catch (parseError) {
    console.error('Failed to parse axis context:', parseError);
  }
  
  // Fallback with factor-specific defaults
  const factorDefaults = {
    'Social': { low: 'Social Resistance', high: 'Social Adoption' },
    'Technological': { low: 'Tech Stagnation', high: 'Tech Advancement' },
    'Economic': { low: 'Economic Decline', high: 'Economic Growth' },
    'Environmental': { low: 'Environmental Strain', high: 'Environmental Care' },
    'Political': { low: 'Political Instability', high: 'Political Stability' }
  };
  
  return factorDefaults[factor] || { low: "Low", high: "High" };
}

interface StepTwoProps {
  pdfContent: string;
  data: string;
  onDataChange: (data: string) => void;
  selectedPoints: SelectedPoint[];
  onNext?: () => void;
}

const StepTwo = ({ pdfContent, data, onDataChange, selectedPoints, onNext }: StepTwoProps) => {
  const [axes, setAxes] = useState<SelectedPoint[]>([]);
  const [scenarios, setScenarios] = useState<MatrixScenario[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [axisContexts, setAxisContexts] = useState<{ low: string; high: string }[]>([]);
  const [factorSelections, setFactorSelections] = useState<{[key: string]: number[]}>({});
  const [isAnalysisOpen, setIsAnalysisOpen] = useState(true);

  // Group selected points by factor for display
  const groupedPoints = selectedPoints.reduce((acc, point) => {
    if (!acc[point.factor]) {
      acc[point.factor] = [];
    }
    acc[point.factor].push(point);
    return acc;
  }, {} as {[key: string]: SelectedPoint[]});

  const handleSelect = (factor: string, localIdx: number, checked: boolean) => {
    if (checked) {
      // Check if this factor already has a selection
      const currentFactorSelections = factorSelections[factor] || [];
      if (currentFactorSelections.length >= 1) {
        toast({
          title: "Selection limit reached",
          description: `You can only select 1 item per ${factor} category.`,
          variant: "destructive"
        });
        return;
      }

      // Check total selections across all factors
      const totalSelections = Object.values(factorSelections).reduce((sum, arr) => sum + arr.length, 0);
      if (totalSelections >= 2) {
        toast({
          title: "Selection limit reached",
          description: "You can only select 2 factors total across all categories.",
          variant: "destructive"
        });
        return;
      }
    }

    setFactorSelections(prev => {
      const factorSelected = prev[factor] || [];
      const updated = checked 
        ? [...factorSelected, localIdx]
        : factorSelected.filter(idx => idx !== localIdx);
      
      const newSelections = { ...prev, [factor]: updated };
      
      // Update axes based on total selections
      const allSelected = Object.entries(newSelections).flatMap(([factorName, indices]) =>
        indices.map(idx => groupedPoints[factorName][idx])
      ).filter(Boolean);
      
      setAxes(allSelected.slice(0, 2)); // Only allow 2 axes
      return newSelections;
    });
  };

  function getCaseTitleAndContext() {
    let title = "";
    let context = "";
    const match = pdfContent.match(/^\s*Title:?\s*(.+?)\s*$/m);
    if (match) title = match[1];
    const lines = pdfContent.split("\n").map(line => line.trim()).filter(Boolean);
    if (!title && lines.length > 0) title = lines[0];
    if (lines.length > 1) context = lines.slice(1).join(" ");
    if (!context) context = "See case study background above.";
    return { title, context };
  }

  const handleGenerateScenarios = async () => {
    if (axes.length !== 2) {
      toast({
        title: "Select 2 axes",
        description: "Please select two factors/points for the scenario matrix axes.",
        variant: "destructive"
      });
      return;
    }
    setIsGenerating(true);

    try {
      const [yAxis, xAxis] = axes;
      const { title: caseTitle, context: industryContext } = getCaseTitleAndContext();
      const horizonYear = "2027";

      // Step 1: Generate consistent axis labels first
      console.log('Generating axis contexts...');
      toast({ title: "Analyzing axes...", description: "Creating consistent axis directions..." });
      
      const [yContext, xContext] = await Promise.all([
        fetchAxisContext(yAxis.factor, yAxis.text, industryContext),
        fetchAxisContext(xAxis.factor, xAxis.text, industryContext)
      ]);
      
      console.log('Generated axis contexts:', { yContext, xContext });
      setAxisContexts([yContext, xContext]);

      // Step 2: Generate scenarios using the AI-detected industry and axis contexts
      toast({ title: "Detecting industry...", description: "Using AI to identify case study industry..." });
      
      const quadrantResults: MatrixScenario[] = [];
      for (let i = 0; i < QUADRANT_REQUESTS.length; i++) {
        const q = QUADRANT_REQUESTS[i];
        
        // Create prompt using AI-detected industry (makeQuadrantPrompt is now async)
        const prompt = await makeQuadrantPrompt(
          caseTitle,
          industryContext,
          horizonYear,
          yAxis,
          xAxis,
          q,
          yContext,
          xContext
        );
        
        console.log(`Generating quadrant ${i + 1}...`);
        
        const { data: responseData, error } = await supabase.functions.invoke(
          "generate-scenario-matrix",
          { body: { prompt } }
        );
        
        if (error) {
          console.error(`Quadrant ${i + 1} generation error:`, error);
          quadrantResults.push({ 
            summary: "Generation failed", 
            header: "Scenario could not be generated", 
            bullets: [] 
          });
          continue;
        }

        let scenarioObj: MatrixScenario = { summary: "", header: "", bullets: [] };
        
        try {
          let content = responseData?.raw || responseData;
          if (typeof content !== "string") {
            content = JSON.stringify(content);
          }
          
          // Clean and parse JSON response
          content = content.replace(/^\s*```json\s*|\s*```\s*$/gi, "").trim();
          content = content.replace(/,\s*(\}|\])/g, "$1"); // Remove trailing commas
          
          const parsed = JSON.parse(content);
          
          if (parsed.summary && parsed.header && Array.isArray(parsed.bullets)) {
            scenarioObj = {
              summary: parsed.summary.trim(),
              header: parsed.header.trim(),
              bullets: parsed.bullets.filter(bullet => bullet && bullet.trim())
            };
          }
        } catch (parseError) {
          console.error(`Failed to parse quadrant ${i + 1} response:`, parseError);
          scenarioObj = { 
            summary: "Parse error", 
            header: "Scenario could not be generated", 
            bullets: [] 
          };
        }
        
        quadrantResults.push(scenarioObj);
      }

      if (quadrantResults.length !== 4) {
        toast({
          title: "Generation incomplete",
          description: "Some scenarios could not be generated. Please try again.",
          variant: "destructive"
        });
        setIsGenerating(false);
        return;
      }

      setScenarios(quadrantResults);
      onDataChange(JSON.stringify(quadrantResults));

      // Save data for Step 3
      const step2Data = {
        scenarios: quadrantResults,
        axes: axes,
        axisContexts: [yContext, xContext]
      };
      localStorage.setItem('step2Data', JSON.stringify(step2Data));

      // Collapse the analysis section after generation
      setIsAnalysisOpen(false);

      toast({
        title: "Scenario Matrix Complete",
        description: "Generated industry-specific 2x2 scenario matrix using AI-detected industry."
      });

    } catch (err: any) {
      console.error("Scenario generation error:", err);
      toast({
        title: "Error",
        description: "Failed to generate scenarios. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      {/* Show Matrix at top when generated */}
      {scenarios.length > 0 && (
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle>Scenario Matrix</CardTitle>
          </CardHeader>
          <CardContent>
            <ScenarioMatrix scenarios={scenarios} axes={axes} axisContexts={axisContexts} />
          </CardContent>
        </Card>
      )}

      {/* STEEP Analysis - Collapsible after matrix generation */}
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle>
            Factor Selection: Choose Key Uncertainties
          </CardTitle>
        </CardHeader>
        <CardContent>
          {scenarios.length > 0 ? (
            <Collapsible open={isAnalysisOpen} onOpenChange={setIsAnalysisOpen}>
              <CollapsibleTrigger asChild>
                <Button variant="outline" className="w-full justify-between mb-6">
                  <span>View STEEP Analysis & Selection</span>
                  {isAnalysisOpen ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                </Button>
              </CollapsibleTrigger>
              <CollapsibleContent>
                <div className="mb-6">
                  <h3 className="font-medium mb-4 text-lg">
                    Based on your selection of Driving Forces, AI will identify uncertainties that you can't predict that impact your Strategic Choices. Select <span className="font-bold text-blue-600">two factors</span> as key uncertainties to Identify Plausible Scenarios
                  </h3>
                  
                  <div className="space-y-4">
                    {Object.entries(groupedPoints).map(([factor, points]) => (
                      <SteepCategorySection
                        key={factor}
                        factor={factor}
                        style={FACTOR_STYLES[factor]}
                        points={points.map(p => ({ text: p.text, isUserAdded: false }))}
                        selectedIndexes={factorSelections[factor] || []}
                        onSelect={(idx, checked) => handleSelect(factor, idx, checked)}
                        onEdit={() => {}} // No editing in step 2
                        showCheckboxes={true}
                      />
                    ))}
                  </div>
                </div>
                
                <div className="flex justify-center">
                  <Button
                    onClick={handleGenerateScenarios}
                    disabled={axes.length !== 2 || isGenerating}
                    className="bg-blue-600 hover:bg-blue-700"
                    size="lg"
                  >
                    {isGenerating ? "Generating..." : "Generate Scenarios"}
                  </Button>
                </div>
              </CollapsibleContent>
            </Collapsible>
          ) : (
            <>
              <div className="mb-6">
                <h3 className="font-medium mb-4 text-lg">
                  Based on your selection of Driving Forces, AI will identify uncertainties that you can't predict that impact your Strategic Choices. Select <span className="font-bold text-blue-600">two factors</span> as key uncertainties to Identify Plausible Scenarios
                </h3>
                
                <div className="space-y-4">
                  {Object.entries(groupedPoints).map(([factor, points]) => (
                    <SteepCategorySection
                      key={factor}
                      factor={factor}
                      style={FACTOR_STYLES[factor]}
                      points={points.map(p => ({ text: p.text, isUserAdded: false }))}
                      selectedIndexes={factorSelections[factor] || []}
                      onSelect={(idx, checked) => handleSelect(factor, idx, checked)}
                      onEdit={() => {}} // No editing in step 2
                      showCheckboxes={true}
                    />
                  ))}
                </div>
              </div>
              
              <div className="flex justify-center">
                <div className="flex flex-col items-center space-y-4">
                  <div className="text-sm text-gray-600">
                    Selected: {axes.length}/2 factors
                  </div>
                  <Button
                    onClick={handleGenerateScenarios}
                    disabled={axes.length !== 2 || isGenerating}
                    className="bg-blue-600 hover:bg-blue-700"
                    size="lg"
                  >
                    {isGenerating ? "Generating..." : "Generate Scenarios"}
                  </Button>
                </div>
              </div>
            </>
          )}
        </CardContent>
      </Card>

      {/* Next Button - Only show after scenarios are generated */}
      {scenarios.length > 0 && onNext && (
        <div className="flex justify-center pt-8 pb-4">
          <Button
            onClick={onNext}
            className="bg-blue-600 hover:bg-blue-700 px-8 py-3 text-lg"
            size="lg"
          >
            Next: Competitor Analysis
            <ArrowRight className="h-5 w-5 ml-2" />
          </Button>
        </div>
      )}
    </div>
  );
};

export default StepTwo;

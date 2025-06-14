
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import type { SelectedPoint } from "./StepOne";
import { QUADRANT_REQUESTS, makeQuadrantPrompt, MatrixScenario } from "./QuadrantPromptUtils";
import ScenarioMatrix from "./ScenarioMatrix";

interface StepTwoProps {
  pdfContent: string;
  data: string; // for this step (can be scenario info for export)
  onDataChange: (data: string) => void;
  selectedPoints: SelectedPoint[]; // Passed from StepOne "Continue"
}

const StepTwo = ({ pdfContent, data, onDataChange, selectedPoints }: StepTwoProps) => {
  // User-selected 2 points that become axes: [Y, X]
  const [axes, setAxes] = useState<SelectedPoint[]>([]);
  const [scenarios, setScenarios] = useState<MatrixScenario[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);

  // Handle axis selection
  const handleSelectAxis = (point: SelectedPoint) => {
    setAxes((prev) => {
      if (prev.find(a => a.factor === point.factor && a.pointIdx === point.pointIdx)) {
        return prev.filter(a => !(a.factor === point.factor && a.pointIdx === point.pointIdx));
      }
      if (prev.length === 2) return prev; // Only allow 2
      return [...prev, point];
    });
  };

  // Clean context info for prompts
  function getCaseTitleAndContext() {
    // Try to grab from pdfContent (if structured) or fallback
    let title = "";
    let context = "";
    const match = pdfContent.match(/^\s*Title:?\s*(.+?)\s*$/m);
    if (match) title = match[1];
    // If unable to find, use the first line for title and the remainder for context
    const lines = pdfContent.split("\n").map(line => line.trim()).filter(Boolean);
    if (!title && lines.length > 0) title = lines[0];
    if (lines.length > 1) context = lines.slice(1).join(" ");
    // If still empty, just use a generic context
    if (!context) context = "See case study background above.";
    return { title, context };
  }

  // Generate scenarios from Gemini (one LLM call per quadrant)
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
      const horizonYear = "2027"; // Or compute from UI/year picker if present

      // Generate each quadrant with improved prompt/results
      const quadrantResults: MatrixScenario[] = [];
      for (let i = 0; i < QUADRANT_REQUESTS.length; i++) {
        const q = QUADRANT_REQUESTS[i];
        const prompt = makeQuadrantPrompt(
          caseTitle,
          industryContext,
          horizonYear,
          yAxis,
          xAxis,
          q
        );
        const { data: responseData, error } = await supabase.functions.invoke(
          "generate-steep-analysis",
          { body: { pdfContent: prompt } }
        );
        if (error) {
          quadrantResults.push({
            header: "",
            bullets: []
          });
          continue;
        }
        // Parse [header, bullets[]] JSON robustly
        let obj: any = undefined;
        if (responseData && typeof responseData === "object" && !Array.isArray(responseData)) {
          if (responseData.header && Array.isArray(responseData.bullets)) {
            obj = responseData;
          }
        }
        if (!obj && typeof responseData === "string") {
          try {
            let cleaned = responseData
              .replace(/^`+json|`+$/gi, '')
              .replace(/,\s*(\}|\])/g, "$1")
              .trim();
            const parsed = JSON.parse(cleaned);
            if (parsed.header && Array.isArray(parsed.bullets)) {
              obj = parsed;
            }
          } catch { /* ignore parse error */ }
        }
        if (!obj) {
          obj = {
            header: "",
            bullets: []
          };
        }
        quadrantResults.push(obj);
      }

      if (!quadrantResults || quadrantResults.length !== 4) {
        toast({
          title: "Scenario format error",
          description: "Could not generate all four quadrants. Please try again.",
          variant: "destructive"
        });
        setIsGenerating(false);
        return;
      }
      setScenarios(quadrantResults);
      onDataChange(JSON.stringify(quadrantResults));
      toast({
        title: "Scenario Matrix Ready",
        description: "Generated 2x2 scenario matrix using your selected uncertainties."
      });
    } catch (err: any) {
      toast({
        title: "Error",
        description: "Unexpected error occurred while generating scenarios.",
        variant: "destructive"
      });
    } finally {
      setIsGenerating(false);
    }
  };

  // Render
  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle>
            Scenario Generation: 2x2 Uncertainty Matrix
          </CardTitle>
        </CardHeader>
        <CardContent>
          <h3 className="font-medium mb-4">
            Select <span className="font-bold">two</span> factors/points as key uncertainties (these become axes):
          </h3>
          {/* Point selection UI */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {selectedPoints.map((pt, idx) => (
              <button
                key={pt.factor + pt.pointIdx}
                type="button"
                className={`rounded-lg px-3 py-2 border 
                  ${axes.find(a => a.factor === pt.factor && a.pointIdx === pt.pointIdx)
                    ? "border-blue-600 bg-blue-100 font-semibold"
                    : "border-gray-300 bg-white"}
                  text-left flex flex-col cursor-pointer`}
                disabled={axes.length === 2 && !axes.find(a => a.factor === pt.factor && a.pointIdx === pt.pointIdx)}
                onClick={() => handleSelectAxis(pt)}
              >
                <span className="text-xs uppercase tracking-tight text-gray-500 mb-1">
                  {pt.factor} Point {pt.pointIdx + 1}
                </span>
                <span className="text-sm">{pt.text}</span>
              </button>
            ))}
          </div>
          {/* Generate Button */}
          <div className="flex justify-end mt-6">
            <Button
              onClick={handleGenerateScenarios}
              disabled={axes.length !== 2 || isGenerating}
              className="bg-blue-600 hover:bg-blue-700"
            >
              {isGenerating ? "Generating..." : "Generate Scenario Matrix"}
            </Button>
          </div>
          {/* Render Matrix (now separated into ScenarioMatrix component) */}
          <ScenarioMatrix scenarios={scenarios} axes={axes} />
        </CardContent>
      </Card>
    </div>
  );
};

export default StepTwo;

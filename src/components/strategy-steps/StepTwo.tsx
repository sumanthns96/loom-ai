import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import type { SelectedPoint } from "./StepOne";

// Type for one scenario quadrant
type MatrixScenario = {
  title: string;
  description: string;
};

interface StepTwoProps {
  pdfContent: string;
  data: string; // for this step (can be scenario info for export)
  onDataChange: (data: string) => void;
  selectedPoints: SelectedPoint[]; // Passed from StepOne "Continue"
}

// Helper for quadrant position
const QUADRANT_LABELS = [
  "Best Case (Both Factors in Favor)",
  "Y-Axis Favor, X-Axis Against",
  "Both Against",
  "X-Axis Favor, Y-Axis Against"
];

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
      // Compose prompt for Gemini
      const [yAxis, xAxis] = axes;
      const prompt = `
Given the following business case context (Invisalign), and these two key uncertainties or factors:
  Y Axis: ${yAxis.factor} - "${yAxis.text}"
  X Axis: ${xAxis.factor} - "${xAxis.text}"

Generate a 2x2 matrix of scenario descriptions, relevant for a strategy session.
Return a JSON array of exactly four objects (one per quadrant, order: Q1 (both in favor), Q2 (Y in favor, X not), Q3 (both not in favor), Q4 (X in favor, Y not)). Each object should have:
  - "title": concise quadrant label (≤8 words)
  - "description": a scenario for the company if that quadrant occurs (3–4 sentences, specific and actionable, business-oriented, tailored to the Invisalign clear aligner context)
NO markdown, no extra prose, JSON array only.

Context: 
---
${pdfContent}
---`;

      const { data: responseData, error } = await supabase.functions.invoke(
        "generate-steep-analysis",
        { body: { pdfContent: prompt } }
      );

      if (error) {
        toast({
          title: "Error generating scenarios",
          description: error.message,
          variant: "destructive"
        });
        setIsGenerating(false);
        return;
      }

      // --- Robust Gemini response parsing logic ---
      let arr: any[] | undefined = undefined;
      if (responseData && Array.isArray(responseData.steepAnalysis)) {
        arr = responseData.steepAnalysis;
      } else if (Array.isArray(responseData)) {
        arr = responseData;
      } else if (typeof responseData === "object" && responseData !== null) {
        // Try all possible properties and also handle stringified arrays
        const possible = responseData.steepAnalysis || responseData.STEEPAnalysis || responseData.scenarioMatrix || responseData.matrix;
        if (typeof possible === "string") {
          try {
            // Remove trailing commas and whitespace, if any (Gemini issue)
            let cleaned = possible
              .replace(/,\s*(\]|\})/g, '$1')
              .trim();
            // Try to parse as JSON
            const inner = JSON.parse(cleaned);
            if (Array.isArray(inner)) {
              arr = inner;
            }
          } catch {
            // ignore
          }
        } else if (Array.isArray(possible)) {
          arr = possible;
        }
      } else if (typeof responseData === "string") {
        // If the whole response is a stringified array
        try {
          let cleaned = responseData.replace(/,\s*(\]|\})/g, '$1').trim();
          const asArr = JSON.parse(cleaned);
          if (Array.isArray(asArr)) {
            arr = asArr;
          }
        } catch {
          // ignore
        }
      }
      // END robust parsing

      // Validate scenario count for a proper 2x2 matrix
      if (!arr || arr.length !== 4) {
        toast({
          title: "Scenario format error",
          description: "Could not parse four quadrants from AI response. Please try again, or try regenerating.",
          variant: "destructive"
        });
        setIsGenerating(false);
        return;
      }

      setScenarios(arr as MatrixScenario[]);
      onDataChange(JSON.stringify(arr));
      toast({
        title: "Scenario Matrix Ready",
        description: "Generated 2x2 scenario matrix using your selected uncertainties."
      });
    } catch (err) {
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
          {/* Point selection: show all selected points from Step 1 */}
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
          {/* Render Matrix */}
          {!!scenarios.length && axes.length === 2 && (
            <div className="mt-10">
              {/* Axes Legends */}
              <div className="flex flex-col items-center mb-6">
                <div className="text-lg font-semibold mb-2">
                  {axes[0].factor} → Y Axis, {axes[1].factor} → X Axis
                </div>
                <div className="flex items-center">
                  <span className="font-bold text-blue-700">{axes[0].factor}</span>
                  <span className="mx-4 text-gray-400">as Y-axis</span>
                  <span className="font-bold text-yellow-700">{axes[1].factor}</span>
                  <span className="mx-4 text-gray-400">as X-axis</span>
                </div>
              </div>
              {/* 2x2 Matrix */}
              <div className="grid grid-cols-2 grid-rows-2 gap-4 max-w-3xl mx-auto">
                {scenarios.map((sc, idx) => (
                  <div key={idx} className="border rounded-lg bg-gray-50 shadow px-4 py-5">
                    <div className="font-bold mb-2 text-blue-900">{sc.title}</div>
                    <div className="text-sm text-gray-700">{sc.description}</div>
                  </div>
                ))}
              </div>
              {/* Quadrant Labels, Arrow Legends (optional) */}
              <div className="mt-4 flex justify-between px-8 text-sm text-gray-600 font-medium">
                <span>Y: {axes[0].text}</span>
                <span>X: {axes[1].text}</span>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default StepTwo;

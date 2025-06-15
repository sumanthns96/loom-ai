import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { RefreshCw } from "lucide-react";
import SteepCategorySection from "./SteepCategorySection";
import AnalysisGenerator from "./AnalysisGenerator";
import { useSteepData } from "./hooks/useSteepData";
import { FACTOR_STYLES } from "./constants";
import { StepOneProps } from "./types";
const StepOne = ({
  pdfContent,
  data,
  onDataChange,
  onNext
}: StepOneProps) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const {
    factors,
    hasGenerated,
    handleSelect,
    handleEdit,
    getSelectedPoints,
    updateFactors
  } = useSteepData(data, onDataChange);
  const handleGenerationStart = () => {
    setIsGenerating(true);
  };
  const handleGenerationComplete = (newFactors: any[]) => {
    updateFactors(newFactors);
    setIsGenerating(false);
  };
  const handleGenerationError = () => {
    setIsGenerating(false);
  };

  // Add "Continue" button if any point is selected
  const selectedPoints = getSelectedPoints();
  return <div className="space-y-6 max-w-5xl mx-auto">
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <span role="img" aria-label="lightbulb">💡</span>
            <span>STEEP Analysis</span>
          </CardTitle>
          <CardDescription>The STEEP analysis is a tool used to map the external factors
that impact an organization’s strategic landscape.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4 min-h-[800px]">
          <AnalysisGenerator pdfContent={pdfContent} isGenerating={isGenerating} onGenerationStart={handleGenerationStart} onGenerationComplete={handleGenerationComplete} onGenerationError={handleGenerationError} />
          {isGenerating && <div className="h-60 flex items-center justify-center text-muted-foreground gap-2">
              <RefreshCw className="h-5 w-5 animate-spin" />
              <span>Generating detailed analysis with Gemini...</span>
            </div>}
          {!isGenerating && !hasGenerated && <div className="h-60 flex items-center justify-center text-muted-foreground">
              <span>Click "Generate with AI" to start your STEEP analysis</span>
            </div>}
          {!isGenerating && hasGenerated && factors.map((group, factorIdx) => <SteepCategorySection key={group.factor} factor={group.factor} style={FACTOR_STYLES[group.factor]} points={group.points.map(p => p.text)} selectedIndexes={group.selected} onSelect={(pointIdx, checked) => handleSelect(factorIdx, pointIdx, checked)} onEdit={(pointIdx, value) => handleEdit(factorIdx, pointIdx, value)} />)}
          {!isGenerating && hasGenerated && <div className="flex justify-end mt-8">
              <Button onClick={() => onNext(selectedPoints)} disabled={selectedPoints.length < 2} className="bg-blue-600 hover:bg-blue-700">
                Continue to Scenario Matrix
              </Button>
            </div>}
        </CardContent>
      </Card>
    </div>;
};
export default StepOne;
export type { SelectedPoint } from "./types";

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { RefreshCw } from "lucide-react";
import SteepCategorySection from "./SteepCategorySection";
import AnalysisGenerator from "./AnalysisGenerator";
import { useSteepData } from "./hooks/useSteepData";
import { FACTOR_STYLES } from "./constants";
import { StepOneProps } from "./types";

const LoadingText = () => {
  const [phase, setPhase] = useState(1);
  
  useEffect(() => {
    const timer = setTimeout(() => {
      setPhase(2);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);
  
  return (
    <span className="transition-opacity duration-500 text-body">
      {phase === 1 ? (
        <span className="animate-fade-in">
          Analyzing the Strategic Landscape from the Outside-In
        </span>
      ) : (
        <span className="animate-fade-in">
          Analyzing all factors
        </span>
      )}
    </span>
  );
};

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
    handleEdit,
    handleAddPoint,
    handleDeletePoint,
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

  const handleContinue = () => {
    // Pass all analysis points to step 2
    const allPoints = factors.flatMap((group) =>
      group.points.map((point, idx) => ({
        factor: group.factor,
        pointIdx: idx,
        text: point.text
      }))
    );
    onNext(allPoints);
  };

  return (
    <div className="space-y-8 max-w-6xl mx-auto animate-fade-in-up">
      <Card className="shadow-xl border-0 bg-white/90 backdrop-blur-sm overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500"></div>
        <CardHeader className="pb-8 pt-8">
          <div className="space-y-4">
            <CardTitle className="text-display bg-gradient-to-r from-gray-900 via-gray-800 to-gray-700 bg-clip-text text-transparent">
              STEEP Analysis
            </CardTitle>
            <div className="w-16 h-1 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full"></div>
            <CardDescription className="text-body text-gray-600 max-w-4xl leading-relaxed">
              The STEEP framework is a strategic analysis tool designed to systematically evaluate the 
              <span className="font-medium text-gray-800"> external macro-environmental factors</span> that 
              influence an organization's strategic landscape. This comprehensive assessment examines 
              <span className="font-medium text-gray-800"> Social, Technological, Economic, Environmental, 
              and Political</span> dimensions to identify opportunities, threats, and emerging trends that 
              could impact your strategic decisions.
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent className="space-y-6 pb-8 min-h-[800px]">
          <AnalysisGenerator 
            pdfContent={pdfContent} 
            isGenerating={isGenerating} 
            onGenerationStart={handleGenerationStart} 
            onGenerationComplete={handleGenerationComplete} 
            onGenerationError={handleGenerationError} 
          />
          
          {isGenerating && (
            <div className="h-60 content-center text-gray-600 gap-3">
              <RefreshCw className="h-6 w-6 animate-spin text-blue-500" />
              <LoadingText />
            </div>
          )}
          
          {!isGenerating && !hasGenerated && (
            <div className="h-60 content-center text-gray-500">
              <div className="space-y-3">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-xl flex items-center justify-center mx-auto">
                  <RefreshCw className="h-6 w-6 text-blue-600" />
                </div>
                <span className="text-body">Click "Initiate STEEP Analysis" to begin your strategic assessment</span>
              </div>
            </div>
          )}
          
          {!isGenerating && hasGenerated && factors.map((group, factorIdx) => (
            <SteepCategorySection
              key={group.factor}
              factor={group.factor}
              style={FACTOR_STYLES[group.factor]}
              points={group.points}
              onEdit={(pointIdx, value) => handleEdit(factorIdx, pointIdx, value)}
              onAddPoint={(text) => handleAddPoint(factorIdx, text)}
              onDeletePoint={(pointIdx) => handleDeletePoint(factorIdx, pointIdx)}
              canAddMore={group.points.length < 5} // 3 generated + 2 user additions max
              showCheckboxes={false}
              selectedIndexes={[]}
              onSelect={() => {}}
            />
          ))}
          
          {!isGenerating && hasGenerated && (
            <div className="flex justify-end mt-12 pt-6 border-t border-gray-100">
              <Button 
                onClick={handleContinue}
                className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-8 py-3 rounded-xl font-medium shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
              >
                Continue to Factor Selection
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default StepOne;
export type { SelectedPoint } from "./types";

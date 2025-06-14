
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { RefreshCw, Lightbulb } from "lucide-react";
import { toast } from "@/hooks/use-toast";

interface StepOneProps {
  pdfContent: string;
  data: string;
  onDataChange: (data: string) => void;
}

const StepOne = ({ pdfContent, data, onDataChange }: StepOneProps) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [analysis, setAnalysis] = useState(data);

  useEffect(() => {
    setAnalysis(data);
  }, [data]);

  const generateAnalysis = async () => {
    setIsGenerating(true);
    
    // Simulate AI analysis - in a real app, this would call an LLM API
    setTimeout(() => {
      const mockAnalysis = `SITUATIONAL ANALYSIS

Current Market Position:
• The company operates in a competitive market with established players
• Market share position needs strengthening through differentiation
• Customer segments show varied needs and preferences

Competitive Landscape:
• Multiple competitors with similar offerings
• Opportunity for innovation and unique value proposition
• Price competition affects margins across the industry

Internal Capabilities:
• Strong operational foundation
• Technology infrastructure requires modernization
• Human resources show potential for growth and development

SWOT Analysis:

Strengths:
• Established brand recognition
• Loyal customer base
• Operational efficiency

Weaknesses:
• Limited digital presence
• Aging technology systems
• Resource constraints

Opportunities:
• Growing market demand
• Digital transformation potential
• New customer segments

Threats:
• Increased competition
• Economic uncertainty
• Technological disruption

Key Insights:
The analysis reveals a company with solid fundamentals but facing modern challenges that require strategic adaptation and investment in digital capabilities.`;

      setAnalysis(mockAnalysis);
      onDataChange(mockAnalysis);
      setIsGenerating(false);
      
      toast({
        title: "Analysis generated",
        description: "AI has completed the situational analysis based on your case study.",
      });
    }, 3000);
  };

  const handleAnalysisChange = (value: string) => {
    setAnalysis(value);
    onDataChange(value);
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Lightbulb className="h-5 w-5 text-yellow-600" />
            <span>Situational Analysis</span>
          </CardTitle>
          <CardDescription>
            Analyze the current market position, competitive landscape, and internal capabilities 
            based on your case study. This forms the foundation for strategic planning.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-medium">AI-Generated Analysis</h3>
            <Button
              onClick={generateAnalysis}
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
                  Generate Analysis
                </>
              )}
            </Button>
          </div>

          <Textarea
            placeholder="Click 'Generate Analysis' to create an AI-powered situational analysis, or write your own analysis here..."
            value={analysis}
            onChange={(e) => handleAnalysisChange(e.target.value)}
            className="min-h-96 font-mono text-sm"
          />

          <div className="bg-blue-50 p-4 rounded-lg">
            <h4 className="font-medium text-blue-900 mb-2">Analysis Framework:</h4>
            <ul className="text-sm text-blue-800 space-y-1">
              <li>• Market position and competitive landscape</li>
              <li>• Internal capabilities and resources</li>
              <li>• SWOT analysis (Strengths, Weaknesses, Opportunities, Threats)</li>
              <li>• Key stakeholder analysis</li>
              <li>• Current performance metrics</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default StepOne;

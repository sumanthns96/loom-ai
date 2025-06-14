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
      const mockAnalysis = `STEEP ANALYSIS

Social Factors:
• Changing consumer lifestyles and preferences towards sustainability.
• Increasing demand for ethical and transparent business practices.
• Demographic shifts affecting the workforce and customer base.

Technological Factors:
• Rapid advancements in AI and automation are disrupting industries.
• Increased cybersecurity threats require robust defense systems.
• Rise of e-commerce and digital marketing channels.

Economic Factors:
• Global economic uncertainty and potential for recession.
• Fluctuating inflation rates and interest rates impacting costs.
• Shifting trade policies and tariffs.

Environmental Factors:
• Growing regulatory pressure for environmental sustainability.
• Climate change risks impacting supply chains and operations.
• Consumer preference for eco-friendly products and services.

Political Factors:
• Changes in government regulations and taxation policies.
• Political instability in key markets.
• International trade agreements and disputes.

Key Insights:
The analysis highlights the need for adaptability in the face of technological disruption and a proactive approach to sustainability to meet consumer expectations and regulatory requirements.`;

      setAnalysis(mockAnalysis);
      onDataChange(mockAnalysis);
      setIsGenerating(false);
      
      toast({
        title: "Analysis generated",
        description: "AI has completed the STEEP analysis based on your case study.",
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
            <span>Analyze STEEP Factors</span>
          </CardTitle>
          <CardDescription>
            Analyze the Social, Technological, Economic, Environmental, and Political factors 
            affecting your business. This forms the foundation for strategic planning.
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
            placeholder="Click 'Generate Analysis' to create an AI-powered STEEP analysis, or write your own analysis here..."
            value={analysis}
            onChange={(e) => handleAnalysisChange(e.target.value)}
            className="min-h-96 font-mono text-sm"
          />

          <div className="bg-blue-50 p-4 rounded-lg">
            <h4 className="font-medium text-blue-900 mb-2">Analysis Framework:</h4>
            <ul className="text-sm text-blue-800 space-y-1">
              <li>• Social: Demographics, lifestyles, cultural norms.</li>
              <li>• Technological: Innovation, automation, R&D.</li>
              <li>• Economic: Growth, inflation, interest rates.</li>
              <li>• Environmental: Climate, regulations, sustainability.</li>
              <li>• Political: Government policy, stability, trade.</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default StepOne;


import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { RefreshCw, AlertTriangle } from "lucide-react";
import { toast } from "@/hooks/use-toast";

interface StepTwoProps {
  pdfContent: string;
  data: string;
  onDataChange: (data: string) => void;
}

const StepTwo = ({ pdfContent, data, onDataChange }: StepTwoProps) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [problems, setProblems] = useState(data);

  useEffect(() => {
    setProblems(data);
  }, [data]);

  const generateProblems = async () => {
    setIsGenerating(true);
    
    setTimeout(() => {
      const mockProblems = `PROBLEM IDENTIFICATION

Core Strategic Challenges:

1. MARKET POSITIONING ISSUES
   Problem: Unclear value proposition in competitive market
   Impact: Declining market share and customer confusion
   Urgency: High - directly affects revenue
   
2. OPERATIONAL INEFFICIENCIES
   Problem: Outdated systems and processes
   Impact: Higher costs and slower response times
   Urgency: Medium - affects long-term competitiveness
   
3. DIGITAL TRANSFORMATION LAG
   Problem: Limited digital presence and capabilities
   Impact: Missing opportunities in digital channels
   Urgency: High - market is rapidly digitizing

4. TALENT AND SKILLS GAP
   Problem: Workforce lacks modern skill sets
   Impact: Reduced innovation and adaptability
   Urgency: Medium - affects future growth potential

5. FINANCIAL CONSTRAINTS
   Problem: Limited capital for strategic investments
   Impact: Inability to fund growth initiatives
   Urgency: High - limits strategic options

Priority Matrix:
HIGH URGENCY + HIGH IMPACT:
• Market positioning clarity
• Digital transformation acceleration

MEDIUM URGENCY + HIGH IMPACT:
• Operational efficiency improvements
• Talent development programs

ROOT CAUSE ANALYSIS:
The fundamental issue appears to be a lack of strategic focus and investment in modernization, leading to competitive disadvantage in a rapidly evolving market.

STAKEHOLDER IMPACT:
• Customers: Experiencing suboptimal service
• Employees: Frustrated with outdated tools
• Shareholders: Concerned about declining returns
• Partners: Questioning long-term viability`;

      setProblems(mockProblems);
      onDataChange(mockProblems);
      setIsGenerating(false);
      
      toast({
        title: "Problems identified",
        description: "AI has analyzed and prioritized key strategic challenges.",
      });
    }, 2500);
  };

  const handleProblemsChange = (value: string) => {
    setProblems(value);
    onDataChange(value);
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <AlertTriangle className="h-5 w-5 text-orange-600" />
            <span>Problem Identification</span>
          </CardTitle>
          <CardDescription>
            Identify and prioritize the key challenges and problems that need to be addressed. 
            This step helps focus strategic efforts on the most critical issues.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-medium">Problem Analysis</h3>
            <Button
              onClick={generateProblems}
              disabled={isGenerating}
              variant="outline"
            >
              {isGenerating ? (
                <>
                  <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                  Analyzing...
                </>
              ) : (
                <>
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Identify Problems
                </>
              )}
            </Button>
          </div>

          <Textarea
            placeholder="Click 'Identify Problems' to generate AI analysis, or document key challenges manually..."
            value={problems}
            onChange={(e) => handleProblemsChange(e.target.value)}
            className="min-h-96 font-mono text-sm"
          />

          <div className="bg-orange-50 p-4 rounded-lg">
            <h4 className="font-medium text-orange-900 mb-2">Problem Analysis Framework:</h4>
            <ul className="text-sm text-orange-800 space-y-1">
              <li>• Problem definition and scope</li>
              <li>• Impact assessment (financial, operational, strategic)</li>
              <li>• Urgency and priority ranking</li>
              <li>• Root cause analysis</li>
              <li>• Stakeholder impact evaluation</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default StepTwo;

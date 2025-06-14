
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { RefreshCw, Lightbulb } from "lucide-react";
import { toast } from "@/hooks/use-toast";

interface StepThreeProps {
  pdfContent: string;
  data: string;
  onDataChange: (data: string) => void;
}

const StepThree = ({ pdfContent, data, onDataChange }: StepThreeProps) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [options, setOptions] = useState(data);

  useEffect(() => {
    setOptions(data);
  }, [data]);

  const generateOptions = async () => {
    setIsGenerating(true);
    
    setTimeout(() => {
      const mockOptions = `STRATEGIC OPTIONS

OPTION 1: DIGITAL TRANSFORMATION & INNOVATION
Strategy: Comprehensive digital modernization with innovation focus
Approach:
• Implement cloud-based technology infrastructure
• Develop mobile-first customer experiences
• Create data analytics capabilities
• Establish innovation labs and partnerships

Investment Required: High ($2-5M)
Timeline: 18-24 months
Risk Level: Medium
Expected ROI: 25-40% over 3 years

Pros:
• Future-proofs the business
• Opens new revenue streams
• Improves operational efficiency

Cons:
• High upfront investment
• Execution complexity
• Change management challenges

OPTION 2: MARKET EXPANSION & PARTNERSHIPS
Strategy: Grow through new markets and strategic alliances
Approach:
• Enter adjacent geographic markets
• Form strategic partnerships
• Develop channel partner network
• Target new customer segments

Investment Required: Medium ($1-3M)
Timeline: 12-18 months
Risk Level: Medium
Expected ROI: 15-25% over 2 years

Pros:
• Leverages existing capabilities
• Diversifies revenue sources
• Lower technical risk

Cons:
• Market entry challenges
• Partner dependency
• Brand dilution risk

OPTION 3: OPERATIONAL EXCELLENCE & COST OPTIMIZATION
Strategy: Focus on efficiency and margin improvement
Approach:
• Streamline operations and processes
• Implement lean methodologies
• Optimize supply chain
• Automate routine tasks

Investment Required: Low ($0.5-1.5M)
Timeline: 6-12 months
Risk Level: Low
Expected ROI: 10-20% over 1 year

Pros:
• Quick wins and immediate impact
• Low investment requirement
• Builds operational foundation

Cons:
• Limited growth potential
• May not address core issues
• Risk of stagnation

RECOMMENDED HYBRID APPROACH:
Combine elements of all three options:
Phase 1 (0-6 months): Operational excellence foundation
Phase 2 (6-18 months): Market expansion initiatives  
Phase 3 (12-24 months): Digital transformation rollout

This phased approach balances risk, investment, and growth potential while building momentum through early wins.`;

      setOptions(mockOptions);
      onDataChange(mockOptions);
      setIsGenerating(false);
      
      toast({
        title: "Strategic options generated",
        description: "AI has developed multiple strategic alternatives for consideration.",
      });
    }, 3000);
  };

  const handleOptionsChange = (value: string) => {
    setOptions(value);
    onDataChange(value);
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Lightbulb className="h-5 w-5 text-green-600" />
            <span>Strategic Options</span>
          </CardTitle>
          <CardDescription>
            Develop multiple strategic alternatives to address identified problems. 
            Each option should be evaluated for feasibility, risk, and potential impact.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-medium">Strategic Alternatives</h3>
            <Button
              onClick={generateOptions}
              disabled={isGenerating}
              variant="outline"
            >
              {isGenerating ? (
                <>
                  <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                  Developing...
                </>
              ) : (
                <>
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Generate Options
                </>
              )}
            </Button>
          </div>

          <Textarea
            placeholder="Click 'Generate Options' to create strategic alternatives, or develop your own options..."
            value={options}
            onChange={(e) => handleOptionsChange(e.target.value)}
            className="min-h-96 font-mono text-sm"
          />

          <div className="bg-green-50 p-4 rounded-lg">
            <h4 className="font-medium text-green-900 mb-2">Strategy Evaluation Criteria:</h4>
            <ul className="text-sm text-green-800 space-y-1">
              <li>• Strategic fit with company capabilities</li>
              <li>• Financial investment and ROI projections</li>
              <li>• Implementation timeline and complexity</li>
              <li>• Risk assessment and mitigation strategies</li>
              <li>• Competitive advantage potential</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default StepThree;

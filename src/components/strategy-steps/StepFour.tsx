
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { RefreshCw, Calendar } from "lucide-react";
import { toast } from "@/hooks/use-toast";

interface StepFourProps {
  pdfContent: string;
  data: string;
  onDataChange: (data: string) => void;
}

const StepFour = ({ pdfContent, data, onDataChange }: StepFourProps) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [plan, setPlan] = useState(data);

  useEffect(() => {
    setPlan(data);
  }, [data]);

  const generatePlan = async () => {
    setIsGenerating(true);
    
    setTimeout(() => {
      const mockPlan = `IMPLEMENTATION PLAN

PHASE 1: FOUNDATION (Months 1-6)
Objective: Establish operational excellence and quick wins

Key Initiatives:
1. Process Optimization Project
   • Timeline: Months 1-3
   • Owner: Operations Director
   • Budget: $200K
   • Deliverables: Streamlined processes, 15% cost reduction

2. Technology Infrastructure Assessment
   • Timeline: Months 2-4
   • Owner: IT Director
   • Budget: $100K
   • Deliverables: Technology roadmap, system requirements

3. Team Training & Development
   • Timeline: Months 3-6
   • Owner: HR Director
   • Budget: $150K
   • Deliverables: Skills assessment, training programs

PHASE 2: EXPANSION (Months 7-18)
Objective: Market growth and capability building

Key Initiatives:
1. Market Expansion Project
   • Timeline: Months 7-15
   • Owner: Sales Director
   • Budget: $800K
   • Deliverables: New market entry, 25% revenue growth

2. Partnership Development
   • Timeline: Months 8-12
   • Owner: Business Development Manager
   • Budget: $300K
   • Deliverables: 3-5 strategic partnerships

3. Customer Experience Enhancement
   • Timeline: Months 9-18
   • Owner: Customer Success Manager
   • Budget: $400K
   • Deliverables: Improved NPS, retention increase

PHASE 3: TRANSFORMATION (Months 19-24)
Objective: Digital transformation and innovation

Key Initiatives:
1. Digital Platform Development
   • Timeline: Months 19-24
   • Owner: CTO
   • Budget: $1.2M
   • Deliverables: Modern platform, digital capabilities

2. Data Analytics Implementation
   • Timeline: Months 20-24
   • Owner: Data Analytics Manager
   • Budget: $500K
   • Deliverables: Business intelligence, predictive analytics

3. Innovation Lab Launch
   • Timeline: Months 22-24
   • Owner: Innovation Director
   • Budget: $300K
   • Deliverables: Innovation processes, new product pipeline

RESOURCE ALLOCATION:
Total Investment: $3.95M over 24 months
• Personnel: 60% ($2.37M)
• Technology: 25% ($988K)
• Marketing: 10% ($395K)
• Operations: 5% ($197K)

RISK MANAGEMENT:
High Risk Items:
• Technology implementation delays → Mitigation: Phased rollout
• Market entry challenges → Mitigation: Pilot programs
• Resource constraints → Mitigation: Flexible budgeting

GOVERNANCE STRUCTURE:
• Executive Steering Committee (monthly)
• Project Management Office (weekly)
• Phase Gate Reviews (quarterly)
• Board Updates (quarterly)

SUCCESS FACTORS:
• Strong executive sponsorship
• Clear communication plan
• Regular progress monitoring
• Agile adaptation capability
• Change management support`;

      setPlan(mockPlan);
      onDataChange(mockPlan);
      setIsGenerating(false);
      
      toast({
        title: "Implementation plan created",
        description: "AI has developed a detailed execution roadmap with timelines and resources.",
      });
    }, 3500);
  };

  const handlePlanChange = (value: string) => {
    setPlan(value);
    onDataChange(value);
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Calendar className="h-5 w-5 text-blue-600" />
            <span>Implementation Plan</span>
          </CardTitle>
          <CardDescription>
            Create a detailed execution roadmap with timelines, resources, responsibilities, 
            and milestones to transform strategy into actionable initiatives.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-medium">Execution Roadmap</h3>
            <Button
              onClick={generatePlan}
              disabled={isGenerating}
              variant="outline"
            >
              {isGenerating ? (
                <>
                  <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                  Planning...
                </>
              ) : (
                <>
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Create Plan
                </>
              )}
            </Button>
          </div>

          <Textarea
            placeholder="Click 'Create Plan' to generate implementation roadmap, or develop your own plan..."
            value={plan}
            onChange={(e) => handlePlanChange(e.target.value)}
            className="min-h-96 font-mono text-sm"
          />

          <div className="bg-blue-50 p-4 rounded-lg">
            <h4 className="font-medium text-blue-900 mb-2">Implementation Framework:</h4>
            <ul className="text-sm text-blue-800 space-y-1">
              <li>• Phased approach with clear milestones</li>
              <li>• Resource allocation and budget planning</li>
              <li>• Responsibility assignment and governance</li>
              <li>• Risk identification and mitigation strategies</li>
              <li>• Communication and change management</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default StepFour;

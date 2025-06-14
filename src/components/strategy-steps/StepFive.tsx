
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { RefreshCw, Target } from "lucide-react";
import { toast } from "@/hooks/use-toast";

interface StepFiveProps {
  pdfContent: string;
  data: string;
  onDataChange: (data: string) => void;
}

const StepFive = ({ pdfContent, data, onDataChange }: StepFiveProps) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [metrics, setMetrics] = useState(data);

  useEffect(() => {
    setMetrics(data);
  }, [data]);

  const generateMetrics = async () => {
    setIsGenerating(true);
    
    setTimeout(() => {
      const mockMetrics = `SUCCESS METRICS & KPI FRAMEWORK

STRATEGIC OBJECTIVES & MEASUREMENTS

1. FINANCIAL PERFORMANCE
Primary KPIs:
• Revenue Growth Rate: Target 25% annually
  Baseline: Current revenue
  Measurement: Quarterly revenue reports
  
• Profit Margin Improvement: Target 5% increase
  Baseline: Current EBITDA margin
  Measurement: Monthly P&L analysis
  
• Return on Investment (ROI): Target 20%+ on strategic initiatives
  Baseline: Historical ROI
  Measurement: Project-specific ROI calculations

2. OPERATIONAL EXCELLENCE
Primary KPIs:
• Process Efficiency: Target 20% improvement
  Baseline: Current cycle times
  Measurement: Process metrics dashboard
  
• Cost Reduction: Target 15% operational cost savings
  Baseline: Current operational expenses
  Measurement: Monthly cost analysis
  
• Quality Metrics: Target 99% customer satisfaction
  Baseline: Current satisfaction scores
  Measurement: Customer surveys & NPS

3. MARKET POSITION
Primary KPIs:
• Market Share Growth: Target 5% increase
  Baseline: Current market position
  Measurement: Industry reports & analysis
  
• Customer Acquisition: Target 40% new customer growth
  Baseline: Current customer base
  Measurement: CRM tracking & analytics
  
• Brand Recognition: Target top 3 in industry awareness
  Baseline: Current brand metrics
  Measurement: Brand awareness surveys

4. INNOVATION & GROWTH
Primary KPIs:
• New Product Revenue: Target 20% of total revenue
  Baseline: Current new product contribution
  Measurement: Product line revenue tracking
  
• Time to Market: Target 30% faster product launches
  Baseline: Current development cycles
  Measurement: Project timeline analysis
  
• Digital Adoption: Target 80% digital engagement
  Baseline: Current digital metrics
  Measurement: Digital analytics platforms

5. ORGANIZATIONAL DEVELOPMENT
Primary KPIs:
• Employee Engagement: Target 85% engagement score
  Baseline: Current engagement levels
  Measurement: Annual engagement surveys
  
• Talent Retention: Target 90% retention rate
  Baseline: Current turnover rates
  Measurement: HR metrics tracking
  
• Skills Development: Target 100% completion of training programs
  Baseline: Current training participation
  Measurement: Learning management system

MEASUREMENT FRAMEWORK

Frequency:
• Daily: Operational metrics (sales, production, quality)
• Weekly: Customer and process metrics
• Monthly: Financial and market metrics
• Quarterly: Strategic progress reviews
• Annually: Comprehensive strategy assessment

Reporting Structure:
• Executive Dashboard: Real-time KPI overview
• Department Scorecards: Function-specific metrics
• Board Reports: Strategic progress summary
• Stakeholder Updates: Key milestone communications

EARLY WARNING INDICATORS

Red Flags (Immediate Action Required):
• Revenue decline >10% month-over-month
• Customer satisfaction <80%
• Project delays >30 days
• Budget overruns >20%

Yellow Flags (Monitor Closely):
• Revenue growth <5% quarterly
• Customer acquisition costs increasing
• Employee turnover >15% annually
• Market share stagnation

SUCCESS MILESTONES

6-Month Targets:
• 10% operational efficiency improvement
• 3 new strategic partnerships established
• Technology infrastructure upgraded
• Team training programs launched

12-Month Targets:
• 15% revenue growth achieved
• Market expansion into 2 new regions
• Digital platform beta launch
• Customer satisfaction >90%

24-Month Targets:
• 25% overall revenue growth
• Market leadership position in key segments
• Full digital transformation completed
• Innovation pipeline generating 20% of revenue

MEASUREMENT TOOLS & SYSTEMS

Technology Stack:
• Business Intelligence: Tableau/Power BI
• CRM Analytics: Salesforce Analytics
• Financial Reporting: ERP-integrated dashboards
• Customer Feedback: Survey platforms
• HR Metrics: HRIS analytics modules

Review Process:
• Weekly operational reviews
• Monthly strategy check-ins
• Quarterly board presentations
• Annual strategic planning sessions`;

      setMetrics(mockMetrics);
      onDataChange(mockMetrics);
      setIsGenerating(false);
      
      toast({
        title: "Success metrics defined",
        description: "AI has created a comprehensive KPI framework for measuring strategic success.",
      });
    }, 4000);
  };

  const handleMetricsChange = (value: string) => {
    setMetrics(value);
    onDataChange(value);
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Target className="h-5 w-5 text-purple-600" />
            <span>Success Metrics</span>
          </CardTitle>
          <CardDescription>
            Define key performance indicators (KPIs) and measurement frameworks to track 
            strategic progress and ensure accountability for results.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-medium">KPI Framework</h3>
            <Button
              onClick={generateMetrics}
              disabled={isGenerating}
              variant="outline"
            >
              {isGenerating ? (
                <>
                  <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                  Defining...
                </>
              ) : (
                <>
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Define Metrics
                </>
              )}
            </Button>
          </div>

          <Textarea
            placeholder="Click 'Define Metrics' to generate success measurements, or create your own KPI framework..."
            value={metrics}
            onChange={(e) => handleMetricsChange(e.target.value)}
            className="min-h-96 font-mono text-sm"
          />

          <div className="bg-purple-50 p-4 rounded-lg">
            <h4 className="font-medium text-purple-900 mb-2">Measurement Framework:</h4>
            <ul className="text-sm text-purple-800 space-y-1">
              <li>• SMART goals (Specific, Measurable, Achievable, Relevant, Time-bound)</li>
              <li>• Leading and lagging indicators</li>
              <li>• Balanced scorecard approach</li>
              <li>• Regular review and adjustment cycles</li>
              <li>• Accountability and ownership assignment</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default StepFive;

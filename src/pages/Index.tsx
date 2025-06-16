import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Target, FileText, TrendingUp, CheckCircle } from "lucide-react";
import PDFUploader from "@/components/PDFUploader";
const Index = () => {
  const navigate = useNavigate();
  const handlePdfExtracted = (content: string) => {
    navigate("/strategy-wizard", {
      state: {
        pdfContent: content
      }
    });
  };
  return <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center space-x-3">
            <div className="bg-blue-600 p-2 rounded-lg">
              <Target className="h-6 w-6 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900">StrategyBuilder</h1>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6 py-12">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h2 className="font-bold text-gray-900 mb-4 text-3xl">
            A Strategic Intelligence Engine Powered by Porter's Competitive Forces and McKinsey's Growth Horizons
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">Bridge case study insights to strategic execution — with AI and a proven 5-step framework</p>
          
          <div className="flex justify-center space-x-8 mb-12">
            {[{
            icon: FileText,
            label: "Upload PDF",
            desc: "Case study analysis"
          }, {
            icon: TrendingUp,
            label: "AI Analysis",
            desc: "Extract key insights"
          }, {
            icon: Target,
            label: "5-Step Framework",
            desc: "Strategic planning"
          }, {
            icon: CheckCircle,
            label: "Action Plan",
            desc: "Implementation ready"
          }].map((item, index) => <div key={index} className="flex flex-col items-center">
                <div className="bg-blue-100 p-4 rounded-full mb-3">
                  <item.icon className="h-8 w-8 text-blue-600" />
                </div>
                <h3 className="font-semibold text-gray-900">{item.label}</h3>
                <p className="text-sm text-gray-600">{item.desc}</p>
              </div>)}
          </div>
        </div>

        {/* Upload Section */}
        <div className="max-w-2xl mx-auto">
          <Card className="border-2 border-dashed border-gray-300 bg-white">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl text-gray-900">Upload Your Case Study</CardTitle>
              <CardDescription className="text-lg">
                Start by uploading a PDF case study document to begin your strategic analysis
              </CardDescription>
            </CardHeader>
            <CardContent>
              <PDFUploader onTextExtracted={handlePdfExtracted} />
            </CardContent>
          </Card>
        </div>

        {/* Framework Preview */}
        <div className="mt-20">
          <h3 className="text-2xl font-bold text-center text-gray-900 mb-12">
            Our 5-Step Strategic Framework
          </h3>
          <div className="grid md:grid-cols-5 gap-6">
            {[{
            step: 1,
            title: "Situational Analysis",
            desc: "Analyze market position and competitive landscape"
          }, {
            step: 2,
            title: "Problem Identification",
            desc: "Identify key challenges and opportunities"
          }, {
            step: 3,
            title: "Strategic Options",
            desc: "Develop multiple strategic alternatives"
          }, {
            step: 4,
            title: "Implementation Plan",
            desc: "Create detailed execution roadmap"
          }, {
            step: 5,
            title: "Success Metrics",
            desc: "Define KPIs and measurement framework"
          }].map((item, index) => <Card key={index} className="bg-white hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="bg-blue-600 text-white rounded-full w-8 h-8 flex items-center justify-center font-bold mb-2">
                    {item.step}
                  </div>
                  <CardTitle className="text-lg">{item.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 text-sm">{item.desc}</p>
                </CardContent>
              </Card>)}
          </div>
        </div>
      </div>
    </div>;
};
export default Index;
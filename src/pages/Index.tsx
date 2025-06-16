
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Target, FileText, TrendingUp, CheckCircle, ArrowRight, Sparkles, Upload, Zap, Users, BarChart3, Shield } from "lucide-react";
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

  return (
    <div className="min-h-screen bg-white">
      {/* Professional Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="bg-blue-600 p-2.5 rounded-lg">
                <Target className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">StrategyBuilder</h1>
                <p className="text-sm text-gray-600">Strategic Intelligence Platform</p>
              </div>
            </div>
            <div className="flex items-center space-x-2 text-sm text-gray-600 bg-gray-50 px-3 py-2 rounded-lg">
              <Sparkles className="h-4 w-4 text-blue-600" />
              <span className="font-medium">AI-Powered</span>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6">
        {/* Hero Section */}
        <section className="py-16 lg:py-24">
          <div className="text-center max-w-4xl mx-auto">
            <div className="inline-flex items-center px-4 py-2 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-sm font-medium mb-8">
              <Zap className="h-4 w-4 mr-2" />
              Enterprise Strategic Analysis
            </div>
            
            <h2 className="text-4xl lg:text-6xl font-bold text-gray-900 leading-tight mb-6">
              Transform Case Studies into
              <span className="text-blue-600 block mt-2">Actionable Strategy</span>
            </h2>
            
            <p className="text-xl text-gray-600 leading-relaxed mb-12 max-w-3xl mx-auto">
              Advanced AI-powered framework combining industry-leading methodologies including Porter's Five Forces, 
              McKinsey's Three Horizons, and strategic scenario planning for comprehensive business intelligence.
            </p>

            {/* Key Benefits */}
            <div className="grid md:grid-cols-3 gap-8 mb-16">
              {[
                {
                  icon: BarChart3,
                  title: "Data-Driven Insights",
                  description: "Extract actionable intelligence from complex case studies and market data"
                },
                {
                  icon: Users,
                  title: "Team Collaboration",
                  description: "Share strategic frameworks and insights across your organization"
                },
                {
                  icon: Shield,
                  title: "Enterprise Ready",
                  description: "Secure, scalable platform built for business-critical strategic planning"
                }
              ].map((benefit, index) => (
                <div key={index} className="text-center">
                  <div className="bg-blue-50 w-16 h-16 rounded-xl flex items-center justify-center mx-auto mb-4">
                    <benefit.icon className="h-8 w-8 text-blue-600" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">{benefit.title}</h3>
                  <p className="text-gray-600 text-sm leading-relaxed">{benefit.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Upload Section */}
        <section className="pb-16">
          <div className="max-w-2xl mx-auto">
            <Card className="border-2 border-gray-100 shadow-lg bg-white overflow-hidden">
              <CardHeader className="text-center bg-gradient-to-r from-blue-50 to-indigo-50 border-b">
                <div className="mx-auto w-16 h-16 bg-blue-600 rounded-xl flex items-center justify-center mb-4 shadow-lg">
                  <Upload className="h-8 w-8 text-white" />
                </div>
                <CardTitle className="text-2xl text-gray-900">Upload Case Study</CardTitle>
                <CardDescription className="text-gray-600 text-base">
                  Begin your strategic analysis by uploading a PDF case study
                </CardDescription>
              </CardHeader>
              <CardContent className="p-8">
                <PDFUploader onTextExtracted={handlePdfExtracted} />
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Process Section */}
        <section className="py-16 bg-gray-50 -mx-6 px-6">
          <div className="text-center mb-16">
            <h3 className="text-3xl font-bold text-gray-900 mb-4">Strategic Analysis Process</h3>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Our systematic approach transforms raw case data into executable strategic plans
            </p>
          </div>
          
          <div className="flex flex-wrap justify-center items-center gap-8">
            {[
              {
                icon: FileText,
                label: "PDF Analysis",
                desc: "Document processing",
                color: "bg-blue-600"
              },
              {
                icon: TrendingUp,
                label: "AI Framework",
                desc: "Strategic analysis",
                color: "bg-indigo-600"
              },
              {
                icon: Target,
                label: "5-Step Process",
                desc: "Comprehensive planning",
                color: "bg-purple-600"
              },
              {
                icon: CheckCircle,
                label: "Export Plan",
                desc: "Implementation ready",
                color: "bg-green-600"
              }
            ].map((item, index) => (
              <div key={index} className="flex items-center">
                <div className="flex flex-col items-center space-y-3">
                  <div className={`${item.color} p-4 rounded-xl shadow-lg`}>
                    <item.icon className="h-6 w-6 text-white" />
                  </div>
                  <div className="text-center">
                    <h4 className="font-semibold text-gray-900 text-sm">{item.label}</h4>
                    <p className="text-xs text-gray-600">{item.desc}</p>
                  </div>
                </div>
                {index < 3 && <ArrowRight className="h-5 w-5 text-gray-400 mx-6" />}
              </div>
            ))}
          </div>
        </section>

        {/* Framework Details */}
        <section className="py-16">
          <div className="text-center mb-16">
            <h3 className="text-3xl font-bold text-gray-900 mb-4">Strategic Framework Components</h3>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Five integrated analytical tools for comprehensive strategic planning
            </p>
          </div>
          
          <div className="grid lg:grid-cols-5 md:grid-cols-2 gap-6">
            {[
              {
                step: 1,
                title: "STEEP Analysis",
                desc: "Analyze societal, technological, economic, environmental, and political factors",
                color: "border-blue-500"
              },
              {
                step: 2,
                title: "Scenario Matrix",
                desc: "Map key uncertainties and develop strategic scenarios",
                color: "border-indigo-500"
              },
              {
                step: 3,
                title: "Competitor Analysis",
                desc: "Comprehensive competitive landscape assessment",
                color: "border-purple-500"
              },
              {
                step: 4,
                title: "DOTS Framework",
                desc: "Driver, Objectives, Tactics, Success metrics planning",
                color: "border-pink-500"
              },
              {
                step: 5,
                title: "Three Horizons",
                desc: "Short, medium, and long-term growth strategy",
                color: "border-green-500"
              }
            ].map((item, index) => (
              <Card key={index} className={`border-t-4 ${item.color} hover:shadow-lg transition-shadow duration-300`}>
                <CardHeader className="pb-4">
                  <div className="flex items-center space-x-3 mb-3">
                    <div className="bg-gray-100 text-gray-900 rounded-lg w-8 h-8 flex items-center justify-center font-bold text-sm">
                      {item.step}
                    </div>
                  </div>
                  <CardTitle className="text-lg font-bold text-gray-900">
                    {item.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 text-sm leading-relaxed">{item.desc}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>
      </div>

      {/* Footer */}
      <footer className="bg-gray-50 border-t border-gray-200 py-12">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <div className="flex items-center justify-center space-x-3 mb-4">
            <div className="bg-blue-600 p-2 rounded-lg">
              <Target className="h-5 w-5 text-white" />
            </div>
            <span className="font-bold text-gray-900 text-lg">StrategyBuilder</span>
          </div>
          <p className="text-gray-600 text-sm">
            Professional strategic analysis platform for enterprise decision-making
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;

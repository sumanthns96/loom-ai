
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Target, FileText, TrendingUp, CheckCircle, ArrowRight, Sparkles, Upload, Zap } from "lucide-react";
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
  return <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50">
      {/* Modern Header */}
      <header className="bg-white/80 backdrop-blur-md border-b border-gray-100 shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="relative">
                <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-2 rounded-xl shadow-lg">
                  <Target className="h-6 w-6 text-white" />
                </div>
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
                  StrategyBuilder
                </h1>
                <p className="text-xs text-gray-500 font-medium">AI-Powered Strategic Intelligence</p>
              </div>
            </div>
            <div className="flex items-center space-x-2 text-sm text-gray-600">
              <Sparkles className="h-4 w-4 text-yellow-500 animate-pulse" />
              <span className="font-medium">Powered by AI</span>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6">
        {/* Hero Section */}
        <div className="text-center py-20 space-y-8">
          <div className="space-y-6 animate-fade-in">
            <div className="inline-flex items-center px-4 py-2 rounded-full bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 text-blue-700 text-sm font-medium mb-6">
              <Zap className="h-4 w-4 mr-2 text-blue-600" />
              Strategic Intelligence Engine
            </div>
            
            <h2 className="text-5xl md:text-6xl font-bold text-gray-900 leading-tight max-w-5xl mx-auto">
              Transform Your Business Case into 
              <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent block mt-2">
                a Strategic Action Plan
              </span>
            </h2>
            
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Bridge theoretical insights to practical execution with our AI-powered framework 
              combining Porter's Competitive Forces and McKinsey's Growth Horizons
            </p>
          </div>
          
          {/* Process Flow */}
          <div className="flex flex-wrap justify-center items-center gap-6 md:gap-8 mt-16">
            {[{
            icon: FileText,
            label: "Upload PDF",
            desc: "Case study analysis",
            delay: "0ms",
            color: "from-blue-500 to-blue-600"
          }, {
            icon: TrendingUp,
            label: "AI Analysis",
            desc: "Extract insights",
            delay: "200ms",
            color: "from-indigo-500 to-indigo-600"
          }, {
            icon: Target,
            label: "Strategic Framework",
            desc: "5-step planning",
            delay: "400ms",
            color: "from-purple-500 to-purple-600"
          }, {
            icon: CheckCircle,
            label: "Action Plan",
            desc: "Ready to implement",
            delay: "600ms",
            color: "from-green-500 to-green-600"
          }].map((item, index) => <div key={index} className="flex items-center group">
                <div className="flex flex-col items-center space-y-3 animate-fade-in" style={{
              animationDelay: item.delay
            }}>
                  <div className="relative">
                    <div className={`bg-gradient-to-br ${item.color} p-5 rounded-2xl shadow-xl group-hover:shadow-2xl transition-all duration-300 group-hover:scale-110 group-hover:-rotate-3`}>
                      <item.icon className="h-7 w-7 text-white" />
                    </div>
                    <div className={`absolute inset-0 bg-gradient-to-br ${item.color} rounded-2xl blur-xl opacity-20 group-hover:opacity-40 transition-opacity duration-300`}></div>
                  </div>
                  <div className="text-center">
                    <h3 className="font-semibold text-gray-900 text-sm">{item.label}</h3>
                    <p className="text-xs text-gray-600">{item.desc}</p>
                  </div>
                </div>
                
                {index < 3 && <ArrowRight className="h-5 w-5 text-gray-400 mx-4 md:mx-6 animate-pulse" />}
              </div>)}
          </div>
        </div>

        {/* Upload Section - Compact and Aesthetic */}
        <div className="max-w-2xl mx-auto mb-16">
          <Card className="border-0 shadow-xl shadow-blue-100/30 bg-white/80 backdrop-blur-sm hover:shadow-2xl transition-all duration-500 group overflow-hidden relative">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 to-indigo-500/5"></div>
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 to-indigo-500"></div>
            
            <CardHeader className="text-center pb-4 pt-8 relative">
              <div className="mx-auto w-14 h-14 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                <Upload className="h-6 w-6 text-white" />
              </div>
              <CardTitle className="text-2xl text-gray-900 mb-2">Upload Your Case Study</CardTitle>
              <CardDescription className="text-base text-gray-600 max-w-md mx-auto">
                Transform your PDF into actionable strategic insights
              </CardDescription>
            </CardHeader>
            <CardContent className="px-8 pb-8 relative">
              <PDFUploader onTextExtracted={handlePdfExtracted} />
            </CardContent>
          </Card>
        </div>

        {/* Framework Preview */}
        <div className="pb-20">
          <div className="text-center mb-16 space-y-4">
            
            <h3 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              5-Step Strategic Framework
            </h3>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">A systematic approach to strategic analysis and planning, powered by proven business frameworks</p>
          </div>
          
          <div className="grid md:grid-cols-5 gap-6">
            {[{
            step: 1,
            title: "Situational Analysis",
            desc: "Comprehensive market position and competitive landscape analysis",
            color: "from-red-500 to-pink-500",
            delay: "0ms"
          }, {
            step: 2,
            title: "Problem Identification",
            desc: "Identify key strategic challenges and growth opportunities",
            color: "from-orange-500 to-red-500",
            delay: "100ms"
          }, {
            step: 3,
            title: "Strategic Options",
            desc: "Develop and evaluate multiple strategic alternatives",
            color: "from-yellow-500 to-orange-500",
            delay: "200ms"
          }, {
            step: 4,
            title: "Implementation Plan",
            desc: "Create detailed execution roadmap with timelines",
            color: "from-green-500 to-yellow-500",
            delay: "300ms"
          }, {
            step: 5,
            title: "Success Metrics",
            desc: "Define comprehensive KPIs and measurement framework",
            color: "from-blue-500 to-green-500",
            delay: "400ms"
          }].map((item, index) => <Card key={index} className="bg-white/80 backdrop-blur-sm hover:bg-white hover:shadow-xl transition-all duration-500 border-0 shadow-lg group cursor-pointer animate-fade-in hover:-translate-y-2" style={{
            animationDelay: item.delay
          }}>
                <CardHeader className="pb-4">
                  <div className="flex items-center space-x-3 mb-4">
                    <div className={`bg-gradient-to-r ${item.color} text-white rounded-xl w-10 h-10 flex items-center justify-center font-bold text-lg shadow-lg group-hover:scale-110 group-hover:rotate-12 transition-all duration-300`}>
                      {item.step}
                    </div>
                    <div className="w-full h-1 bg-gradient-to-r from-gray-200 to-transparent rounded-full overflow-hidden">
                      <div className={`h-full bg-gradient-to-r ${item.color} rounded-full w-0 group-hover:w-full transition-all duration-1000 ease-out`}></div>
                    </div>
                  </div>
                  <CardTitle className="text-lg font-bold text-gray-900 group-hover:text-blue-600 transition-colors duration-300">
                    {item.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 text-sm leading-relaxed">{item.desc}</p>
                </CardContent>
              </Card>)}
          </div>
        </div>

        {/* Footer */}
        <footer className="border-t border-gray-100 py-12 text-center">
          <div className="space-y-4">
            <div className="flex items-center justify-center space-x-2">
              <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-2 rounded-lg">
                <Target className="h-5 w-5 text-white" />
              </div>
              <span className="font-bold text-gray-900">StrategyBuilder</span>
            </div>
            <p className="text-gray-600 text-sm">
              Empowering strategic decision-making through AI-powered analysis
            </p>
          </div>
        </footer>
      </div>
    </div>;
};
export default Index;

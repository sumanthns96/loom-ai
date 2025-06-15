
import React, { useState, useMemo } from 'react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface ThreeHorizonsChartProps {
  horizonsData?: {
    horizon1: { focus1: string; focus2: string; strategy: string; };
    horizon2: { focus1: string; focus2: string; strategy: string; };
    horizon3: { focus1: string; focus2: string; strategy: string; };
  };
}

const ThreeHorizonsChart = ({ horizonsData }: ThreeHorizonsChartProps) => {
  const [selectedHorizon, setSelectedHorizon] = useState<number | null>(null);
  const [hoveredCurve, setHoveredCurve] = useState<number | null>(null);

  // Extract 1-2 word summaries from strategy text
  const extractSummary = (strategy: string): string => {
    if (!strategy) return "";
    
    // Look for key action words and business terms
    const keywords = [
      'optimize', 'improve', 'enhance', 'streamline', 'efficiency',
      'expand', 'grow', 'scale', 'develop', 'explore', 'build',
      'transform', 'innovate', 'disrupt', 'breakthrough', 'future'
    ];
    
    const words = strategy.toLowerCase().split(/\s+/);
    const foundKeywords = keywords.filter(keyword => 
      words.some(word => word.includes(keyword))
    );
    
    if (foundKeywords.length >= 2) {
      return foundKeywords.slice(0, 2).map(word => 
        word.charAt(0).toUpperCase() + word.slice(1)
      ).join(' ');
    } else if (foundKeywords.length === 1) {
      return foundKeywords[0].charAt(0).toUpperCase() + foundKeywords[0].slice(1);
    }
    
    // Fallback to default labels
    return "";
  };

  // Calculate dynamic curve parameters based on content
  const getCurveMetrics = (horizonData: any, horizonNumber: number) => {
    if (!horizonData?.strategy) return { height: 150, confidence: 0.5 };
    
    const strategy = horizonData.strategy.toLowerCase();
    const focusLength = (horizonData.focus1 + horizonData.focus2).length;
    
    // Calculate confidence based on strategy length and specificity
    const confidence = Math.min(0.9, Math.max(0.3, strategy.length / 200));
    
    // Calculate height based on horizon type and content richness
    const baseHeights = [180, 140, 100]; // H1 higher initially, H3 grows most
    const contentBoost = Math.min(30, focusLength / 10);
    
    return {
      height: baseHeights[horizonNumber - 1] + contentBoost,
      confidence
    };
  };

  const horizonSummaries = useMemo(() => {
    if (!horizonsData) return ["Core", "Growth", "Innovation"];
    
    return [
      extractSummary(horizonsData.horizon1?.strategy) || "Core",
      extractSummary(horizonsData.horizon2?.strategy) || "Growth", 
      extractSummary(horizonsData.horizon3?.strategy) || "Innovation"
    ];
  }, [horizonsData]);

  const curveMetrics = useMemo(() => {
    if (!horizonsData) return [
      { height: 180, confidence: 0.5 },
      { height: 140, confidence: 0.5 },
      { height: 100, confidence: 0.5 }
    ];

    return [
      getCurveMetrics(horizonsData.horizon1, 1),
      getCurveMetrics(horizonsData.horizon2, 2),
      getCurveMetrics(horizonsData.horizon3, 3)
    ];
  }, [horizonsData]);

  // Generate dynamic curve paths
  const generateCurvePath = (horizonNumber: number, metrics: any) => {
    const startY = 250 - (horizonNumber === 1 ? 100 : horizonNumber === 2 ? 30 : 0);
    const midY = 250 - metrics.height;
    const endY = 250 - (horizonNumber === 1 ? 50 : horizonNumber === 2 ? 115 : 190);
    
    return `M 80 ${startY} Q 200 ${midY - 20} 320 ${midY} Q 480 ${midY + 10} 640 ${endY} Q 680 ${endY - 10} 720 ${endY - 20}`;
  };

  const horizonColors = [
    { primary: '#10b981', secondary: '#6ee7b7', hover: '#059669' },
    { primary: '#f59e0b', secondary: '#fbbf24', hover: '#d97706' },
    { primary: '#ef4444', secondary: '#f87171', hover: '#dc2626' }
  ];

  const handleCurveClick = (horizonNumber: number) => {
    setSelectedHorizon(selectedHorizon === horizonNumber ? null : horizonNumber);
  };

  return (
    <TooltipProvider>
      <div className="w-full bg-white rounded-lg border p-6">
        {/* Interactive SVG Chart */}
        <div className="mb-8 relative">
          <svg viewBox="0 0 800 300" className="w-full h-64">
            {/* Background */}
            <rect x="0" y="0" width="800" height="300" fill="#f8fafc" />
            
            {/* Grid lines */}
            <defs>
              <pattern id="grid" width="80" height="30" patternUnits="userSpaceOnUse">
                <path d="M 80 0 L 0 0 0 30" fill="none" stroke="#e2e8f0" strokeWidth="1"/>
              </pattern>
              
              {/* Gradients for curves */}
              {horizonColors.map((color, index) => (
                <linearGradient key={index} id={`gradient${index + 1}`} x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor={color.primary} stopOpacity="0.3"/>
                  <stop offset="50%" stopColor={color.secondary} stopOpacity="0.6"/>
                  <stop offset="100%" stopColor={color.primary} stopOpacity="0.8"/>
                </linearGradient>
              ))}
            </defs>
            <rect width="100%" height="100%" fill="url(#grid)" />
            
            {/* Axes */}
            <line x1="80" y1="50" x2="80" y2="250" stroke="#374151" strokeWidth="2"/>
            <line x1="80" y1="250" x2="720" y2="250" stroke="#374151" strokeWidth="2"/>
            
            {/* Y-axis label */}
            <text x="40" y="150" fill="#374151" fontSize="14" textAnchor="middle" transform="rotate(-90, 40, 150)">
              Strategic Value
            </text>
            
            {/* X-axis labels */}
            <text x="160" y="275" fill="#374151" fontSize="12" textAnchor="middle">0-2 years</text>
            <text x="320" y="275" fill="#374151" fontSize="12" textAnchor="middle">3-4 years</text>
            <text x="480" y="275" fill="#374151" fontSize="12" textAnchor="middle">5-6 years</text>
            <text x="400" y="295" fill="#374151" fontSize="14" textAnchor="middle">Time Horizon</text>
            
            {/* Dynamic Horizon Curves */}
            {[1, 2, 3].map((horizonNumber, index) => {
              const color = horizonColors[index];
              const metrics = curveMetrics[index];
              const isHovered = hoveredCurve === horizonNumber;
              const isSelected = selectedHorizon === horizonNumber;
              
              return (
                <g key={horizonNumber}>
                  {/* Curve path */}
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <path
                        d={generateCurvePath(horizonNumber, metrics)}
                        fill="none"
                        stroke={isHovered || isSelected ? color.hover : color.primary}
                        strokeWidth={isHovered || isSelected ? 5 : 4}
                        strokeLinecap="round"
                        style={{
                          cursor: 'pointer',
                          opacity: metrics.confidence,
                          transition: 'all 0.3s ease',
                          filter: isSelected ? 'drop-shadow(0 4px 6px rgba(0,0,0,0.3))' : 'none'
                        }}
                        onMouseEnter={() => setHoveredCurve(horizonNumber)}
                        onMouseLeave={() => setHoveredCurve(null)}
                        onClick={() => handleCurveClick(horizonNumber)}
                      />
                    </TooltipTrigger>
                    <TooltipContent>
                      <div className="max-w-xs">
                        <h4 className="font-semibold">Horizon {horizonNumber}</h4>
                        <p className="text-sm">
                          {horizonsData ? 
                            (horizonNumber === 1 ? horizonsData.horizon1?.strategy :
                             horizonNumber === 2 ? horizonsData.horizon2?.strategy :
                             horizonsData.horizon3?.strategy) || "Click to generate strategy" :
                            "Generate model to see strategy details"
                          }
                        </p>
                      </div>
                    </TooltipContent>
                  </Tooltip>
                  
                  {/* Data points along the curve */}
                  {[200, 400, 600].map((x, pointIndex) => {
                    const y = 250 - (metrics.height * (pointIndex === 0 ? 0.3 : pointIndex === 1 ? 0.8 : 0.9));
                    return (
                      <circle
                        key={pointIndex}
                        cx={x}
                        cy={y}
                        r={isHovered || isSelected ? 6 : 4}
                        fill={color.primary}
                        style={{
                          cursor: 'pointer',
                          transition: 'all 0.3s ease',
                          opacity: isHovered || isSelected ? 1 : 0.7
                        }}
                        onMouseEnter={() => setHoveredCurve(horizonNumber)}
                        onMouseLeave={() => setHoveredCurve(null)}
                        onClick={() => handleCurveClick(horizonNumber)}
                      />
                    );
                  })}
                  
                  {/* Summary labels on curves */}
                  <text
                    x={400}
                    y={250 - metrics.height + (horizonNumber === 1 ? -20 : horizonNumber === 2 ? -10 : 10)}
                    fill={color.primary}
                    fontSize="13"
                    fontWeight="bold"
                    textAnchor="middle"
                    style={{
                      textShadow: '1px 1px 2px rgba(255,255,255,0.8)',
                      transition: 'all 0.3s ease',
                      transform: isHovered || isSelected ? 'scale(1.1)' : 'scale(1)'
                    }}
                  >
                    {horizonSummaries[index]}
                  </text>
                </g>
              );
            })}
            
            {/* Interactive Legend */}
            <g transform="translate(550, 60)">
              <rect x="0" y="0" width="140" height="90" fill="white" stroke="#e5e7eb" strokeWidth="1" rx="4"/>
              {[1, 2, 3].map((horizonNumber, index) => {
                const color = horizonColors[index];
                const isActive = selectedHorizon === horizonNumber || hoveredCurve === horizonNumber;
                
                return (
                  <g key={horizonNumber} style={{ cursor: 'pointer' }}
                     onClick={() => handleCurveClick(horizonNumber)}>
                    <line 
                      x1="10" 
                      y1={15 + index * 20} 
                      x2="30" 
                      y2={15 + index * 20} 
                      stroke={isActive ? color.hover : color.primary} 
                      strokeWidth={isActive ? 4 : 3}
                    />
                    <text 
                      x="35" 
                      y={19 + index * 20} 
                      fill="#374151" 
                      fontSize="11"
                      style={{ fontWeight: isActive ? 'bold' : 'normal' }}
                    >
                      Horizon {horizonNumber}
                    </text>
                  </g>
                );
              })}
            </g>
          </svg>
        </div>

        {/* Enhanced Initiatives Section */}
        <div className="grid grid-cols-3 gap-6 mb-8">
          {/* Horizon 1 Initiatives */}
          <div className={`bg-green-50 border-l-4 border-green-500 p-4 rounded-r-lg transition-all duration-300 ${
            selectedHorizon === 1 ? 'shadow-lg scale-105 bg-green-100' : ''
          }`}>
            <h3 className="font-bold text-green-800 mb-3">Horizon 1 (0-2 years)</h3>
            <h4 className="text-sm font-semibold text-green-700 mb-1">Optimize Core Business</h4>
            <div className="space-y-2 text-sm text-green-700">
              <div>
                <span className="font-medium">Focus 1:</span>
                <p className="mt-1">{horizonsData?.horizon1?.focus1 || "Generate model to see initiatives"}</p>
              </div>
              <div>
                <span className="font-medium">Focus 2:</span>
                <p className="mt-1">{horizonsData?.horizon1?.focus2 || "Generate model to see initiatives"}</p>
              </div>
            </div>
          </div>

          {/* Horizon 2 Initiatives */}
          <div className={`bg-orange-50 border-l-4 border-orange-500 p-4 rounded-r-lg transition-all duration-300 ${
            selectedHorizon === 2 ? 'shadow-lg scale-105 bg-orange-100' : ''
          }`}>
            <h3 className="font-bold text-orange-800 mb-3">Horizon 2 (3-4 years)</h3>
            <h4 className="text-sm font-semibold text-orange-700 mb-1">Adjacent Opportunities</h4>
            <div className="space-y-2 text-sm text-orange-700">
              <div>
                <span className="font-medium">Focus 1:</span>
                <p className="mt-1">{horizonsData?.horizon2?.focus1 || "Generate model to see initiatives"}</p>
              </div>
              <div>
                <span className="font-medium">Focus 2:</span>
                <p className="mt-1">{horizonsData?.horizon2?.focus2 || "Generate model to see initiatives"}</p>
              </div>
            </div>
          </div>

          {/* Horizon 3 Initiatives */}
          <div className={`bg-red-50 border-l-4 border-red-500 p-4 rounded-r-lg transition-all duration-300 ${
            selectedHorizon === 3 ? 'shadow-lg scale-105 bg-red-100' : ''
          }`}>
            <h3 className="font-bold text-red-800 mb-3">Horizon 3 (5-6 years)</h3>
            <h4 className="text-sm font-semibold text-red-700 mb-1">Breakthrough Innovation</h4>
            <div className="space-y-2 text-sm text-red-700">
              <div>
                <span className="font-medium">Focus 1:</span>
                <p className="mt-1">{horizonsData?.horizon3?.focus1 || "Generate model to see initiatives"}</p>
              </div>
              <div>
                <span className="font-medium">Focus 2:</span>
                <p className="mt-1">{horizonsData?.horizon3?.focus2 || "Generate model to see initiatives"}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Enhanced Strategy Descriptions */}
        <div className="grid grid-cols-3 gap-6">
          {[
            { data: horizonsData?.horizon1, color: 'green', number: 1 },
            { data: horizonsData?.horizon2, color: 'orange', number: 2 },
            { data: horizonsData?.horizon3, color: 'red', number: 3 }
          ].map(({ data, color, number }) => (
            <div 
              key={number}
              className={`bg-white border border-${color}-200 p-4 rounded-lg transition-all duration-300 ${
                selectedHorizon === number ? `shadow-lg scale-105 border-${color}-400` : ''
              }`}
            >
              <h4 className={`font-bold text-${color}-800 mb-2`}>Horizon {number} Strategy</h4>
              <p className="text-sm text-gray-700">
                {data?.strategy || `Focus on ${number === 1 ? 'optimizing current operations and improving existing products/services to maximize short-term performance and efficiency' : number === 2 ? 'exploring adjacent markets and capabilities while building mid-term innovations that extend the core business into new areas' : 'investing in breakthrough innovations and disruptive technologies to create new business models for long-term growth'}.`}
              </p>
              {data?.strategy && (
                <div className="mt-3 pt-3 border-t border-gray-200">
                  <div className="flex items-center justify-between text-xs text-gray-500">
                    <span>Confidence: {Math.round(curveMetrics[number - 1].confidence * 100)}%</span>
                    <span>Priority: {number === 1 ? 'High' : number === 2 ? 'Medium' : 'Strategic'}</span>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Interaction Guide */}
        <div className="mt-6 p-4 bg-blue-50 rounded-lg">
          <h4 className="font-medium text-blue-900 mb-2">Interactive Features:</h4>
          <ul className="text-sm text-blue-800 space-y-1">
            <li>• <strong>Hover over curves:</strong> See detailed strategy tooltips</li>
            <li>• <strong>Click on curves or legend:</strong> Highlight and focus on specific horizons</li>
            <li>• <strong>Data points:</strong> Show strategic milestones along the timeline</li>
            <li>• <strong>Dynamic visualization:</strong> Curve height and opacity reflect strategy confidence</li>
          </ul>
        </div>
      </div>
    </TooltipProvider>
  );
};

export default ThreeHorizonsChart;

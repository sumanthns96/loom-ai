import React, { useState, useMemo } from 'react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import MarkdownText from "./MarkdownText";

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

  // Enhanced content analysis for dynamic metrics
  const analyzeContent = (horizonData: any, horizonNumber: number) => {
    if (!horizonData?.strategy) return {
      priority: 0.5,
      risk: 0.5,
      growth: 0.5,
      confidence: 0.3,
      complexity: 0.5,
      timeToValue: 0.5
    };

    const text = (horizonData.strategy + ' ' + horizonData.focus1 + ' ' + horizonData.focus2).toLowerCase();
    
    // Priority indicators
    const priorityKeywords = ['critical', 'essential', 'key', 'primary', 'core', 'main', 'strategic', 'important'];
    const priority = Math.min(1, priorityKeywords.filter(k => text.includes(k)).length / 3);
    
    // Risk indicators
    const riskKeywords = ['risk', 'uncertain', 'challenge', 'complex', 'difficult', 'new', 'experimental'];
    const risk = Math.min(1, riskKeywords.filter(k => text.includes(k)).length / 3);
    
    // Growth indicators
    const growthKeywords = ['grow', 'expand', 'scale', 'increase', 'enhance', 'improve', 'develop'];
    const growth = Math.min(1, growthKeywords.filter(k => text.includes(k)).length / 3);
    
    // Confidence based on detail level and specificity
    const confidence = Math.min(0.95, Math.max(0.2, text.length / 300));
    
    // Complexity based on strategy length and technical terms
    const complexityKeywords = ['integrate', 'transform', 'implement', 'develop', 'build', 'create'];
    const complexity = Math.min(1, (text.length / 200) + (complexityKeywords.filter(k => text.includes(k)).length / 4));
    
    // Time to value (inverse for each horizon)
    const timeToValue = horizonNumber === 1 ? 0.8 : horizonNumber === 2 ? 0.5 : 0.2;
    
    return { priority, risk, growth, confidence, complexity, timeToValue };
  };

  // Extract meaningful summaries from strategy text
  const extractSummary = (strategy: string): string => {
    if (!strategy) return "";
    
    const actionKeywords = [
      { words: ['optimize', 'improve', 'enhance', 'streamline'], label: 'Optimize' },
      { words: ['expand', 'grow', 'scale', 'extend'], label: 'Expand' },
      { words: ['transform', 'innovate', 'disrupt', 'breakthrough'], label: 'Transform' },
      { words: ['develop', 'build', 'create', 'establish'], label: 'Build' },
      { words: ['integrate', 'connect', 'combine', 'merge'], label: 'Integrate' },
      { words: ['explore', 'research', 'investigate', 'discover'], label: 'Explore' }
    ];
    
    const words = strategy.toLowerCase().split(/\s+/);
    
    for (const group of actionKeywords) {
      if (group.words.some(word => words.some(w => w.includes(word)))) {
        return group.label;
      }
    }
    
    // Fallback to horizon-specific defaults
    return ["Core", "Growth", "Innovation"][0];
  };

  // Calculate comprehensive metrics for each horizon
  const contentMetrics = useMemo(() => {
    if (!horizonsData) return [
      { priority: 0.7, risk: 0.3, growth: 0.6, confidence: 0.5, complexity: 0.4, timeToValue: 0.8 },
      { priority: 0.6, risk: 0.5, growth: 0.8, confidence: 0.5, complexity: 0.6, timeToValue: 0.5 },
      { priority: 0.5, risk: 0.8, growth: 0.9, confidence: 0.5, complexity: 0.8, timeToValue: 0.2 }
    ];

    return [
      analyzeContent(horizonsData.horizon1, 1),
      analyzeContent(horizonsData.horizon2, 2),
      analyzeContent(horizonsData.horizon3, 3)
    ];
  }, [horizonsData]);

  const horizonSummaries = useMemo(() => {
    if (!horizonsData) return ["Core", "Growth", "Innovation"];
    
    return [
      extractSummary(horizonsData.horizon1?.strategy) || "Core",
      extractSummary(horizonsData.horizon2?.strategy) || "Growth", 
      extractSummary(horizonsData.horizon3?.strategy) || "Innovation"
    ];
  }, [horizonsData]);

  // Generate truly dynamic curve paths based on content analysis
  const generateDynamicCurvePath = (horizonNumber: number, metrics: any) => {
    const { priority, risk, growth, confidence, complexity, timeToValue } = metrics;
    
    // Base positions adjusted by content
    const startX = 80;
    const endX = 720;
    const midX = 400;
    
    // Dynamic Y positions based on metrics
    const baseY = 250;
    const maxHeight = 180;
    
    // Start point - H1 starts higher (current value), others start lower
    const startY = baseY - (horizonNumber === 1 ? 80 + (timeToValue * 40) : 20 + (timeToValue * 20));
    
    // Peak point - influenced by growth potential and priority
    const peakHeight = maxHeight * (0.3 + (growth * 0.4) + (priority * 0.3));
    const peakY = baseY - peakHeight;
    
    // Peak timing - high complexity and risk delay peak, high priority advances it
    const peakOffset = (complexity * 100) + (risk * 50) - (priority * 75);
    const peakX = midX + peakOffset;
    
    // End point - long-term value influenced by growth and strategic importance
    const endValue = (growth * 0.6) + (priority * 0.4);
    const endY = baseY - (endValue * maxHeight * 0.8);
    
    // Control points for curve shape
    const cp1X = startX + (peakX - startX) * 0.4;
    const cp1Y = startY - ((peakY - startY) * 0.3);
    
    const cp2X = peakX + (endX - peakX) * 0.3;
    const cp2Y = peakY + ((endY - peakY) * 0.2);
    
    // Create smooth curve with multiple control points
    return `M ${startX} ${startY} 
            Q ${cp1X} ${cp1Y} ${peakX} ${peakY} 
            Q ${cp2X} ${cp2Y} ${endX} ${endY}`;
  };

  // Generate confidence bands around curves
  const generateConfidenceBand = (horizonNumber: number, metrics: any) => {
    const { confidence, risk } = metrics;
    const bandWidth = (1 - confidence) * 15 + risk * 10;
    
    const mainPath = generateDynamicCurvePath(horizonNumber, metrics);
    const upperPath = generateDynamicCurvePath(horizonNumber, {
      ...metrics,
      growth: Math.min(1, metrics.growth + bandWidth/100),
      priority: Math.min(1, metrics.priority + bandWidth/150)
    });
    const lowerPath = generateDynamicCurvePath(horizonNumber, {
      ...metrics,
      growth: Math.max(0, metrics.growth - bandWidth/100),
      priority: Math.max(0, metrics.priority - bandWidth/150)
    });
    
    return { mainPath, upperPath, lowerPath, bandWidth };
  };

  const horizonColors = [
    { primary: '#10b981', secondary: '#6ee7b7', hover: '#059669', band: '#10b98120' },
    { primary: '#f59e0b', secondary: '#fbbf24', hover: '#d97706', band: '#f59e0b20' },
    { primary: '#ef4444', secondary: '#f87171', hover: '#dc2626', band: '#ef444420' }
  ];

  const handleCurveClick = (horizonNumber: number) => {
    setSelectedHorizon(selectedHorizon === horizonNumber ? null : horizonNumber);
  };

  return (
    <TooltipProvider>
      <div className="w-full bg-white rounded-lg border p-6">
        {/* Main Chart Area */}
        <div className="w-full mb-8">
          <svg viewBox="0 0 800 300" className="w-full h-64">
            {/* Background and Grid */}
            <rect x="0" y="0" width="800" height="300" fill="#f8fafc" />
            
            <defs>
              <pattern id="grid" width="80" height="30" patternUnits="userSpaceOnUse">
                <path d="M 80 0 L 0 0 0 30" fill="none" stroke="#e2e8f0" strokeWidth="1"/>
              </pattern>
              
              {/* Dynamic gradients based on metrics */}
              {horizonColors.map((color, index) => (
                <linearGradient key={index} id={`gradient${index + 1}`} x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor={color.primary} stopOpacity={0.2 + contentMetrics[index].confidence * 0.3}/>
                  <stop offset="50%" stopColor={color.secondary} stopOpacity={0.4 + contentMetrics[index].priority * 0.4}/>
                  <stop offset="100%" stopColor={color.primary} stopOpacity={0.6 + contentMetrics[index].growth * 0.3}/>
                </linearGradient>
              ))}
            </defs>
            <rect width="100%" height="100%" fill="url(#grid)" />
            
            {/* Axes */}
            <line x1="80" y1="50" x2="80" y2="250" stroke="#374151" strokeWidth="2"/>
            <line x1="80" y1="250" x2="720" y2="250" stroke="#374151" strokeWidth="2"/>
            
            {/* Labels */}
            <text x="40" y="150" fill="#374151" fontSize="14" textAnchor="middle" transform="rotate(-90, 40, 150)">
              Strategic Value
            </text>
            
            <text x="160" y="275" fill="#374151" fontSize="12" textAnchor="middle">0-2 years</text>
            <text x="320" y="275" fill="#374151" fontSize="12" textAnchor="middle">3-4 years</text>
            <text x="480" y="275" fill="#374151" fontSize="12" textAnchor="middle">5-6 years</text>
            <text x="400" y="295" fill="#374151" fontSize="14" textAnchor="middle">Time Horizon</text>
            
            {/* Dynamic Horizon Curves with Confidence Bands */}
            {[1, 2, 3].map((horizonNumber, index) => {
              const color = horizonColors[index];
              const metrics = contentMetrics[index];
              const isHovered = hoveredCurve === horizonNumber;
              const isSelected = selectedHorizon === horizonNumber;
              const { mainPath, upperPath, lowerPath, bandWidth } = generateConfidenceBand(horizonNumber, metrics);
              
              return (
                <g key={horizonNumber}>
                  {/* Confidence Band */}
                  <path
                    d={upperPath}
                    fill="none"
                    stroke={color.band}
                    strokeWidth="2"
                    strokeOpacity="0.3"
                    strokeDasharray="3,3"
                  />
                  <path
                    d={lowerPath}
                    fill="none"
                    stroke={color.band}
                    strokeWidth="2"
                    strokeOpacity="0.3"
                    strokeDasharray="3,3"
                  />
                  
                  {/* Main Curve */}
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <path
                        d={mainPath}
                        fill="none"
                        stroke={isHovered || isSelected ? color.hover : color.primary}
                        strokeWidth={3 + metrics.priority * 3 + (isHovered || isSelected ? 2 : 0)}
                        strokeLinecap="round"
                        style={{
                          cursor: 'pointer',
                          opacity: 0.7 + metrics.confidence * 0.3,
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
                        <div className="text-xs space-y-1 mt-2">
                          <div>Priority: {Math.round(metrics.priority * 100)}%</div>
                          <div>Growth: {Math.round(metrics.growth * 100)}%</div>
                          <div>Risk: {Math.round(metrics.risk * 100)}%</div>
                          <div>Confidence: {Math.round(metrics.confidence * 100)}%</div>
                        </div>
                        <MarkdownText 
                          text={horizonsData ? 
                            (horizonNumber === 1 ? horizonsData.horizon1?.strategy :
                             horizonNumber === 2 ? horizonsData.horizon2?.strategy :
                             horizonsData.horizon3?.strategy) || "Click to generate strategy" :
                            "Generate model to see strategy details"
                          }
                          className="text-sm mt-2"
                        />
                      </div>
                    </TooltipContent>
                  </Tooltip>
                  
                  {/* Dynamic Summary Labels */}
                  <text
                    x={400 + (metrics.complexity - 0.5) * 100}
                    y={120 + index * 25 - metrics.priority * 20}
                    fill={color.primary}
                    fontSize={12 + metrics.priority * 3}
                    fontWeight={400 + metrics.priority * 300}
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
          </svg>
        </div>

        {/* Enhanced Metrics Display */}
        <div className="grid grid-cols-3 gap-6 mb-8">
          {/* Horizon Metrics */}
          {[1, 2, 3].map((horizonNumber, index) => {
            const metrics = contentMetrics[index];
            const color = horizonColors[index];
            const isActive = selectedHorizon === horizonNumber;
            
            return (
              <div 
                key={horizonNumber}
                className={`bg-gray-50 p-4 rounded-lg transition-all duration-300 cursor-pointer ${
                  isActive ? 'ring-2 ring-blue-500 shadow-lg' : 'hover:bg-gray-100'
                }`}
                onClick={() => handleCurveClick(horizonNumber)}
              >
                <h4 className="font-medium text-gray-900 mb-3">Horizon {horizonNumber} Metrics</h4>
                <div className="space-y-2">
                  {[
                    { label: 'Priority', value: metrics.priority, color: 'bg-blue-500' },
                    { label: 'Growth', value: metrics.growth, color: 'bg-green-500' },
                    { label: 'Risk', value: metrics.risk, color: 'bg-red-500' },
                    { label: 'Confidence', value: metrics.confidence, color: 'bg-purple-500' }
                  ].map(({ label, value, color: barColor }) => (
                    <div key={label} className="flex items-center justify-between">
                      <span className="text-xs text-gray-600">{label}</span>
                      <div className="flex items-center space-x-2">
                        <div className="w-16 h-2 bg-gray-200 rounded-full overflow-hidden">
                          <div 
                            className={`h-full ${barColor} transition-all duration-500`}
                            style={{ width: `${value * 100}%` }}
                          />
                        </div>
                        <span className="text-xs font-medium">{Math.round(value * 100)}%</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
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
                <MarkdownText 
                  text={horizonsData?.horizon1?.focus1 || "Generate model to see initiatives"} 
                  className="mt-1"
                />
              </div>
              <div>
                <span className="font-medium">Focus 2:</span>
                <MarkdownText 
                  text={horizonsData?.horizon1?.focus2 || "Generate model to see initiatives"} 
                  className="mt-1"
                />
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
                <MarkdownText 
                  text={horizonsData?.horizon2?.focus1 || "Generate model to see initiatives"} 
                  className="mt-1"
                />
              </div>
              <div>
                <span className="font-medium">Focus 2:</span>
                <MarkdownText 
                  text={horizonsData?.horizon2?.focus2 || "Generate model to see initiatives"} 
                  className="mt-1"
                />
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
                <MarkdownText 
                  text={horizonsData?.horizon3?.focus1 || "Generate model to see initiatives"} 
                  className="mt-1"
                />
              </div>
              <div>
                <span className="font-medium">Focus 2:</span>
                <MarkdownText 
                  text={horizonsData?.horizon3?.focus2 || "Generate model to see initiatives"} 
                  className="mt-1"
                />
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
              <MarkdownText 
                text={data?.strategy || `Focus on ${number === 1 ? 'optimizing current operations and improving existing products/services to maximize short-term performance and efficiency' : number === 2 ? 'exploring adjacent markets and capabilities while building mid-term innovations that extend the core business into new areas' : 'investing in breakthrough innovations and disruptive technologies to create new business models for long-term growth'}.`}
                className="text-sm text-gray-700"
              />
              {data?.strategy && (
                <div className="mt-3 pt-3 border-t border-gray-200">
                  <div className="flex items-center justify-between text-xs text-gray-500">
                    <span>Confidence: {Math.round(contentMetrics[number - 1].confidence * 100)}%</span>
                    <span>Priority: {number === 1 ? 'High' : number === 2 ? 'Medium' : 'Strategic'}</span>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </TooltipProvider>
  );
};

export default ThreeHorizonsChart;

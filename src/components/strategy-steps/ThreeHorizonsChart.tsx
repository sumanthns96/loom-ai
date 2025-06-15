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

  // Enhanced content analysis for truly dynamic metrics
  const analyzeHorizonContent = (horizonData: any, horizonNumber: number) => {
    if (!horizonData?.strategy) {
      // Default fallback values that are clearly different for each horizon
      return {
        1: { priority: 0.9, risk: 0.2, growth: 0.3, confidence: 0.8, timeToValue: 0.9, currentValue: 0.8 },
        2: { priority: 0.7, risk: 0.5, growth: 0.7, confidence: 0.6, timeToValue: 0.4, currentValue: 0.3 },
        3: { priority: 0.5, risk: 0.8, growth: 0.9, confidence: 0.4, timeToValue: 0.1, currentValue: 0.1 }
      }[horizonNumber] || { priority: 0.5, risk: 0.5, growth: 0.5, confidence: 0.5, timeToValue: 0.5, currentValue: 0.5 };
    }

    const text = (horizonData.strategy + ' ' + (horizonData.focus1 || '') + ' ' + (horizonData.focus2 || '')).toLowerCase();
    const words = text.split(/\s+/);
    
    // Horizon-specific keyword analysis
    const h1Keywords = ['optimize', 'improve', 'enhance', 'efficiency', 'cost', 'existing', 'current', 'maintain'];
    const h2Keywords = ['expand', 'develop', 'explore', 'adjacent', 'extend', 'build', 'market', 'capability'];
    const h3Keywords = ['innovate', 'disrupt', 'breakthrough', 'transform', 'future', 'new', 'revolutionary', 'pioneer'];
    
    const riskKeywords = ['risk', 'uncertain', 'challenge', 'complex', 'difficult', 'experimental', 'unknown'];
    const growthKeywords = ['growth', 'scale', 'increase', 'revenue', 'profit', 'expand', 'market'];
    const priorityKeywords = ['critical', 'essential', 'key', 'primary', 'strategic', 'important', 'focus'];
    
    // Calculate metrics based on horizon type and content
    let baseMetrics;
    if (horizonNumber === 1) {
      const h1Score = h1Keywords.filter(k => words.some(w => w.includes(k))).length;
      baseMetrics = {
        priority: 0.7 + Math.min(0.3, h1Score * 0.1),
        risk: 0.1 + Math.min(0.3, riskKeywords.filter(k => words.some(w => w.includes(k))).length * 0.1),
        growth: 0.2 + Math.min(0.4, growthKeywords.filter(k => words.some(w => w.includes(k))).length * 0.1),
        confidence: 0.7 + Math.min(0.3, text.length / 500),
        timeToValue: 0.8 + Math.min(0.2, h1Score * 0.05),
        currentValue: 0.7 + Math.min(0.3, h1Score * 0.1)
      };
    } else if (horizonNumber === 2) {
      const h2Score = h2Keywords.filter(k => words.some(w => words.includes(k))).length;
      baseMetrics = {
        priority: 0.5 + Math.min(0.4, h2Score * 0.1),
        risk: 0.3 + Math.min(0.4, riskKeywords.filter(k => words.some(w => words.includes(k))).length * 0.1),
        growth: 0.4 + Math.min(0.5, growthKeywords.filter(k => words.some(w => words.includes(k))).length * 0.1),
        confidence: 0.4 + Math.min(0.4, text.length / 400),
        timeToValue: 0.3 + Math.min(0.4, h2Score * 0.05),
        currentValue: 0.2 + Math.min(0.4, h2Score * 0.08)
      };
    } else {
      const h3Score = h3Keywords.filter(k => words.some(w => words.includes(k))).length;
      baseMetrics = {
        priority: 0.3 + Math.min(0.5, h3Score * 0.1),
        risk: 0.5 + Math.min(0.5, riskKeywords.filter(k => words.some(w => words.includes(k))).length * 0.1),
        growth: 0.6 + Math.min(0.4, growthKeywords.filter(k => words.some(w => words.includes(k))).length * 0.1),
        confidence: 0.2 + Math.min(0.5, text.length / 300),
        timeToValue: 0.1 + Math.min(0.3, h3Score * 0.03),
        currentValue: 0.05 + Math.min(0.2, h3Score * 0.05)
      };
    }
    
    // Add priority boost based on strategic keywords
    const priorityBoost = priorityKeywords.filter(k => words.some(w => w.includes(k))).length * 0.1;
    baseMetrics.priority = Math.min(1, baseMetrics.priority + priorityBoost);
    
    return baseMetrics;
  };

  const contentMetrics = useMemo(() => {
    return [
      analyzeHorizonContent(horizonsData?.horizon1, 1),
      analyzeHorizonContent(horizonsData?.horizon2, 2),
      analyzeHorizonContent(horizonsData?.horizon3, 3)
    ];
  }, [horizonsData]);

  // Generate proper S-curves following Three Horizons model
  const generateSCurvePath = (horizonNumber: number, metrics: any) => {
    const chartWidth = 640; // SVG width minus margins
    const chartHeight = 200; // SVG height minus margins
    const startX = 80;
    const endX = 720;
    
    // Define time segments for each horizon
    const timeSegments = {
      1: { start: 0, peak: 0.3, end: 1.0 },    // H1: Immediate value, gradual decline
      2: { start: 0.2, peak: 0.7, end: 1.0 },  // H2: Build up, then plateau
      3: { start: 0.5, peak: 0.9, end: 1.0 }   // H3: Slow start, exponential growth
    };
    
    const segment = timeSegments[horizonNumber as keyof typeof timeSegments];
    
    // Calculate key points based on metrics and horizon characteristics
    const startValue = metrics.currentValue;
    const peakValue = horizonNumber === 1 ? 
      Math.min(1, startValue + (metrics.growth * 0.3)) :
      horizonNumber === 2 ?
      Math.min(1, 0.1 + (metrics.growth * 0.7)) :
      Math.min(1, 0.05 + (metrics.growth * 0.9));
    
    const endValue = horizonNumber === 1 ?
      Math.max(0.2, peakValue - 0.3) :
      horizonNumber === 2 ?
      Math.max(0.1, peakValue - 0.1) :
      peakValue; // H3 keeps growing
    
    // Convert to SVG coordinates
    const startY = 250 - (startValue * chartHeight);
    const peakY = 250 - (peakValue * chartHeight);
    const endY = 250 - (endValue * chartHeight);
    
    const startSvgX = startX + (segment.start * chartWidth);
    const peakSvgX = startX + (segment.peak * chartWidth);
    const endSvgX = startX + (segment.end * chartWidth);
    
    // Create S-curve with proper control points
    const cp1X = startSvgX + (peakSvgX - startSvgX) * 0.4;
    const cp1Y = startY - (startY - peakY) * 0.2;
    
    const cp2X = peakSvgX + (endSvgX - peakSvgX) * 0.3;
    const cp2Y = peakY + (endY - peakY) * 0.1;
    
    return `M ${startSvgX} ${startY} 
            Q ${cp1X} ${cp1Y} ${peakSvgX} ${peakY} 
            Q ${cp2X} ${cp2Y} ${endSvgX} ${endY}`;
  };

  const horizonColors = [
    { primary: '#10b981', secondary: '#6ee7b7', hover: '#059669', band: '#10b98120' }, // Green
    { primary: '#f59e0b', secondary: '#fbbf24', hover: '#d97706', band: '#f59e0b20' }, // Orange  
    { primary: '#ef4444', secondary: '#f87171', hover: '#dc2626', band: '#ef444420' }  // Red
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
            </defs>
            <rect width="100%" height="100%" fill="url(#grid)" />
            
            {/* Axes */}
            <line x1="80" y1="50" x2="80" y2="250" stroke="#374151" strokeWidth="2"/>
            <line x1="80" y1="250" x2="720" y2="250" stroke="#374151" strokeWidth="2"/>
            
            {/* Labels */}
            <text x="40" y="150" fill="#374151" fontSize="14" textAnchor="middle" transform="rotate(-90, 40, 150)">
              Strategic Value
            </text>
            
            <text x="200" y="275" fill="#374151" fontSize="12" textAnchor="middle">0-2 years</text>
            <text x="400" y="275" fill="#374151" fontSize="12" textAnchor="middle">3-5 years</text>
            <text x="600" y="275" fill="#374151" fontSize="12" textAnchor="middle">5+ years</text>
            <text x="400" y="295" fill="#374151" fontSize="14" textAnchor="middle">Time Horizon</text>
            
            {/* Three Horizons S-Curves */}
            {[1, 2, 3].map((horizonNumber, index) => {
              const color = horizonColors[index];
              const metrics = contentMetrics[index];
              const isHovered = hoveredCurve === horizonNumber;
              const isSelected = selectedHorizon === horizonNumber;
              const curvePath = generateSCurvePath(horizonNumber, metrics);
              
              return (
                <g key={horizonNumber}>
                  {/* Confidence Band (optional visual enhancement) */}
                  <path
                    d={curvePath}
                    fill="none"
                    stroke={color.band}
                    strokeWidth={8 - metrics.confidence * 3}
                    strokeOpacity="0.2"
                  />
                  
                  {/* Main S-Curve */}
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <path
                        d={curvePath}
                        fill="none"
                        stroke={isHovered || isSelected ? color.hover : color.primary}
                        strokeWidth={2 + metrics.priority * 3 + (isHovered || isSelected ? 2 : 0)}
                        strokeLinecap="round"
                        style={{
                          cursor: 'pointer',
                          opacity: 0.8 + metrics.confidence * 0.2,
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
                  
                  {/* Horizon Labels */}
                  <text
                    x={horizonNumber === 1 ? 200 : horizonNumber === 2 ? 400 : 600}
                    y={70 + index * 15}
                    fill={color.primary}
                    fontSize={13}
                    fontWeight={500}
                    textAnchor="middle"
                    style={{
                      textShadow: '1px 1px 2px rgba(255,255,255,0.8)',
                      transition: 'all 0.3s ease',
                      transform: isHovered || isSelected ? 'scale(1.1)' : 'scale(1)'
                    }}
                  >
                    H{horizonNumber}: {horizonNumber === 1 ? 'Core' : horizonNumber === 2 ? 'Adjacent' : 'Transformational'}
                  </text>
                </g>
              );
            })}
          </svg>
        </div>

        {/* Dynamic Metrics Display */}
        <div className="grid grid-cols-3 gap-6 mb-8">
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
            <h3 className="font-bold text-orange-800 mb-3">Horizon 2 (3-5 years)</h3>
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
            <h3 className="font-bold text-red-800 mb-3">Horizon 3 (5+ years)</h3>
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

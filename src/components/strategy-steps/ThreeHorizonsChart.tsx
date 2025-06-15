
import React from 'react';

interface ThreeHorizonsChartProps {
  horizonsData?: {
    horizon1: { focus1: string; focus2: string; strategy: string; };
    horizon2: { focus1: string; focus2: string; strategy: string; };
    horizon3: { focus1: string; focus2: string; strategy: string; };
  };
}

const ThreeHorizonsChart = ({ horizonsData }: ThreeHorizonsChartProps) => {
  return (
    <div className="w-full bg-white rounded-lg border p-6">
      {/* SVG Chart */}
      <div className="mb-8">
        <svg viewBox="0 0 800 300" className="w-full h-64">
          {/* Background */}
          <rect x="0" y="0" width="800" height="300" fill="#f8fafc" />
          
          {/* Grid lines */}
          <defs>
            <pattern id="grid" width="80" height="30" patternUnits="userSpaceOnUse">
              <path d="M 80 0 L 0 0 0 30" fill="none" stroke="#e2e8f0" strokeWidth="1"/>
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
          
          {/* Axes */}
          <line x1="80" y1="50" x2="80" y2="250" stroke="#374151" strokeWidth="2"/>
          <line x1="80" y1="250" x2="720" y2="250" stroke="#374151" strokeWidth="2"/>
          
          {/* Y-axis label */}
          <text x="40" y="150" fill="#374151" fontSize="14" textAnchor="middle" transform="rotate(-90, 40, 150)">Value</text>
          
          {/* X-axis labels */}
          <text x="160" y="275" fill="#374151" fontSize="12" textAnchor="middle">0-2 years</text>
          <text x="320" y="275" fill="#374151" fontSize="12" textAnchor="middle">3-4 years</text>
          <text x="480" y="275" fill="#374151" fontSize="12" textAnchor="middle">5-6 years</text>
          <text x="400" y="295" fill="#374151" fontSize="14" textAnchor="middle">Time</text>
          
          {/* Horizon 1 Curve (Green) */}
          <path
            d="M 80 150 Q 160 130 240 140 Q 320 150 400 160 Q 480 170 560 180 Q 640 190 720 200"
            fill="none"
            stroke="#10b981"
            strokeWidth="4"
            strokeLinecap="round"
          />
          
          {/* Horizon 2 Curve (Orange) */}
          <path
            d="M 80 220 Q 160 210 240 180 Q 320 150 400 130 Q 480 110 560 100 Q 640 90 720 85"
            fill="none"
            stroke="#f59e0b"
            strokeWidth="4"
            strokeLinecap="round"
          />
          
          {/* Horizon 3 Curve (Red) */}
          <path
            d="M 80 250 Q 160 245 240 235 Q 320 220 400 200 Q 480 170 560 130 Q 640 90 720 60"
            fill="none"
            stroke="#ef4444"
            strokeWidth="4"
            strokeLinecap="round"
          />
          
          {/* Legend */}
          <g transform="translate(550, 60)">
            <rect x="0" y="0" width="140" height="80" fill="white" stroke="#e5e7eb" strokeWidth="1" rx="4"/>
            <line x1="10" y1="20" x2="30" y2="20" stroke="#10b981" strokeWidth="3"/>
            <text x="35" y="24" fill="#374151" fontSize="11">Horizon 1</text>
            <line x1="10" y1="40" x2="30" y2="40" stroke="#f59e0b" strokeWidth="3"/>
            <text x="35" y="44" fill="#374151" fontSize="11">Horizon 2</text>
            <line x1="10" y1="60" x2="30" y2="60" stroke="#ef4444" strokeWidth="3"/>
            <text x="35" y="64" fill="#374151" fontSize="11">Horizon 3</text>
          </g>
        </svg>
      </div>

      {/* Initiatives Section */}
      <div className="grid grid-cols-3 gap-6 mb-8">
        {/* Horizon 1 Initiatives */}
        <div className="bg-green-50 border-l-4 border-green-500 p-4 rounded-r-lg">
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
        <div className="bg-orange-50 border-l-4 border-orange-500 p-4 rounded-r-lg">
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
        <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-r-lg">
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

      {/* Strategy Descriptions */}
      <div className="grid grid-cols-3 gap-6">
        <div className="bg-white border border-green-200 p-4 rounded-lg">
          <h4 className="font-bold text-green-800 mb-2">Horizon 1 Strategy</h4>
          <p className="text-sm text-gray-700">
            {horizonsData?.horizon1?.strategy || "Focus on optimizing current operations and improving existing products/services to maximize short-term performance and efficiency."}
          </p>
        </div>
        
        <div className="bg-white border border-orange-200 p-4 rounded-lg">
          <h4 className="font-bold text-orange-800 mb-2">Horizon 2 Strategy</h4>
          <p className="text-sm text-gray-700">
            {horizonsData?.horizon2?.strategy || "Explore adjacent markets and capabilities while building mid-term innovations that extend the core business into new areas."}
          </p>
        </div>
        
        <div className="bg-white border border-red-200 p-4 rounded-lg">
          <h4 className="font-bold text-red-800 mb-2">Horizon 3 Strategy</h4>
          <p className="text-sm text-gray-700">
            {horizonsData?.horizon3?.strategy || "Invest in breakthrough innovations and disruptive technologies to create new business models for long-term growth."}
          </p>
        </div>
      </div>
    </div>
  );
};

export default ThreeHorizonsChart;

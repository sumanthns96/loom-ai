
import { FC } from "react";
import type { SelectedPoint } from "./types";

export interface MatrixScenario {
  summary: string;
  header: string;
  bullets: string[];
}

interface ScenarioMatrixProps {
  scenarios: MatrixScenario[];
  axes: SelectedPoint[];
  // new: axis context phrases from Gemini: array [{low, high}, {low, high}]
  axisContexts?: { low: string; high: string }[];
}

const endLabelColors = ["text-red-600 font-bold", "text-green-600 font-bold"];

// Utility: capitalize first
const cap = (str: string) => str.charAt(0).toUpperCase() + str.slice(1);

const ScenarioMatrix: FC<ScenarioMatrixProps> = ({ scenarios, axes, axisContexts }) => {
  if (!scenarios.length || axes.length !== 2) return null;

  const [yAxis, xAxis] = axes;

  // fallback directions if context is missing
  const fallback = [{ low: "Low", high: "High" }, { low: "Low", high: "High" }];
  const [yContext, xContext] = axisContexts && axisContexts.length === 2 ? axisContexts : fallback;

  return (
    <div className="mt-12 animate-fade-in">
      {/* Container with enhanced 3D perspective */}
      <div className="max-w-5xl mx-auto px-8 py-16 perspective-[1000px]">
        
        {/* Main 3D matrix container */}
        <div className="relative transform-gpu" style={{ 
          transformStyle: 'preserve-3d',
          transform: 'rotateX(5deg) rotateY(-2deg)',
          minHeight: 600 
        }}>
          
          {/* Enhanced background grid with 3D effect */}
          <div className="absolute inset-0 bg-gradient-to-br from-slate-50 via-white to-blue-50 rounded-3xl shadow-2xl border border-gray-200/50 transform-gpu" 
               style={{ transform: 'translateZ(-20px)' }}>
            {/* Subtle grid pattern overlay */}
            <div className="absolute inset-0 opacity-30" 
                 style={{
                   backgroundImage: `
                     linear-gradient(to right, rgba(148, 163, 184, 0.1) 1px, transparent 1px),
                     linear-gradient(to bottom, rgba(148, 163, 184, 0.1) 1px, transparent 1px)
                   `,
                   backgroundSize: '40px 40px'
                 }}>
            </div>
          </div>

          {/* Central axis lines with enhanced 3D styling */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-20">
            {/* Horizontal axis line with shadow */}
            <div className="absolute w-4/5 h-1 bg-gradient-to-r from-blue-600 via-blue-700 to-blue-600 rounded-full shadow-lg transform-gpu"
                 style={{ 
                   filter: 'drop-shadow(0 4px 8px rgba(59, 130, 246, 0.3))',
                   transform: 'translateZ(10px)'
                 }}>
              {/* Axis glow effect */}
              <div className="absolute inset-0 bg-blue-400 rounded-full blur-sm opacity-50"></div>
            </div>
            
            {/* Vertical axis line with shadow */}
            <div className="absolute h-4/5 w-1 bg-gradient-to-b from-blue-600 via-blue-700 to-blue-600 rounded-full shadow-lg transform-gpu"
                 style={{ 
                   filter: 'drop-shadow(4px 0 8px rgba(59, 130, 246, 0.3))',
                   transform: 'translateZ(10px)'
                 }}>
              {/* Axis glow effect */}
              <div className="absolute inset-0 bg-blue-400 rounded-full blur-sm opacity-50"></div>
            </div>
          </div>

          {/* Axis labels with 3D positioning */}
          <div className="absolute inset-0 pointer-events-none z-30">
            {/* X-axis label */}
            <div className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 transform-gpu"
                 style={{ transform: 'translateX(-50%) translateY(-50%) translateZ(20px)' }}>
              <div className="bg-gradient-to-r from-blue-700 to-blue-800 text-white px-4 py-2 text-sm font-bold uppercase tracking-wider rounded-lg shadow-xl border border-blue-600">
                {xAxis.factor}
              </div>
            </div>
            
            {/* Y-axis label */}
            <div className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 -rotate-90 transform-gpu"
                 style={{ transform: 'translateX(-50%) translateY(-50%) rotate(-90deg) translateZ(20px)' }}>
              <div className="bg-gradient-to-r from-blue-700 to-blue-800 text-white px-4 py-2 text-sm font-bold uppercase tracking-wider rounded-lg shadow-xl border border-blue-600 whitespace-nowrap">
                {yAxis.factor}
              </div>
            </div>
          </div>

          {/* Corner direction labels with enhanced 3D styling */}
          {/* Top (Y High) */}
          <div className="absolute top-8 left-1/2 transform -translate-x-1/2 z-40">
            <span className="text-green-700 font-bold text-sm bg-gradient-to-r from-green-50 to-emerald-50 px-3 py-2 rounded-xl border-2 border-green-200 shadow-lg transform-gpu hover:scale-105 transition-transform duration-200"
                  style={{ transform: 'translateZ(15px)' }}>
              {cap(yContext.high)}
            </span>
          </div>
          
          {/* Bottom (Y Low) */}
          <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-40">
            <span className="text-red-700 font-bold text-sm bg-gradient-to-r from-red-50 to-rose-50 px-3 py-2 rounded-xl border-2 border-red-200 shadow-lg transform-gpu hover:scale-105 transition-transform duration-200"
                  style={{ transform: 'translateZ(15px)' }}>
              {cap(yContext.low)}
            </span>
          </div>
          
          {/* Left (X Low) */}
          <div className="absolute left-8 top-1/2 transform -translate-y-1/2 z-40">
            <span className="text-red-700 font-bold text-sm bg-gradient-to-r from-red-50 to-rose-50 px-3 py-2 rounded-xl border-2 border-red-200 shadow-lg transform-gpu hover:scale-105 transition-transform duration-200"
                  style={{ transform: 'translateZ(15px)' }}>
              {cap(xContext.low)}
            </span>
          </div>
          
          {/* Right (X High) */}
          <div className="absolute right-8 top-1/2 transform -translate-y-1/2 z-40">
            <span className="text-green-700 font-bold text-sm bg-gradient-to-r from-green-50 to-emerald-50 px-3 py-2 rounded-xl border-2 border-green-200 shadow-lg transform-gpu hover:scale-105 transition-transform duration-200"
                  style={{ transform: 'translateZ(15px)' }}>
              {cap(xContext.high)}
            </span>
          </div>

          {/* Enhanced 3D scenario grid */}
          <div className="relative z-50 grid grid-cols-2 grid-rows-2 gap-8 p-16 transform-gpu"
               style={{ transform: 'translateZ(30px)' }}>
            
            {/* Top Left - Index 1 */}
            <div className="group relative">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <div className="relative bg-white/95 backdrop-blur-sm rounded-2xl border border-gray-200/80 shadow-2xl p-8 min-h-[200px] flex flex-col transform-gpu hover:scale-105 hover:shadow-3xl transition-all duration-300"
                   style={{ 
                     boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.15), 0 0 0 1px rgba(255, 255, 255, 0.5)',
                     transform: 'translateZ(0px)'
                   }}>
                {scenarios[1]?.summary && (
                  <div className="text-xs font-semibold text-blue-600 uppercase tracking-wider mb-2 bg-blue-50 px-2 py-1 rounded-lg inline-block">
                    {scenarios[1].summary}
                  </div>
                )}
                <div className="font-bold text-gray-900 text-base mb-3 leading-tight">
                  {scenarios[1]?.header || <span className="text-gray-400 font-normal italic">Scenario could not be generated</span>}
                </div>
                {Array.isArray(scenarios[1]?.bullets) && scenarios[1]?.bullets.length > 0 ? (
                  <ul className="space-y-2 text-gray-700 text-sm flex-1">
                    {scenarios[1].bullets.map((pt, i) => (
                      <li key={i} className="flex items-start space-x-2">
                        <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                        <span className="leading-relaxed">{pt}</span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <div className="text-gray-500 text-sm italic">[Scenario could not be generated; please retry or adjust your axis selection.]</div>
                )}
              </div>
            </div>
            
            {/* Top Right - Index 0 */}
            <div className="group relative">
              <div className="absolute inset-0 bg-gradient-to-br from-green-500/20 to-emerald-500/20 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <div className="relative bg-white/95 backdrop-blur-sm rounded-2xl border border-gray-200/80 shadow-2xl p-8 min-h-[200px] flex flex-col transform-gpu hover:scale-105 hover:shadow-3xl transition-all duration-300"
                   style={{ 
                     boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.15), 0 0 0 1px rgba(255, 255, 255, 0.5)',
                     transform: 'translateZ(0px)'
                   }}>
                {scenarios[0]?.summary && (
                  <div className="text-xs font-semibold text-green-600 uppercase tracking-wider mb-2 bg-green-50 px-2 py-1 rounded-lg inline-block">
                    {scenarios[0].summary}
                  </div>
                )}
                <div className="font-bold text-gray-900 text-base mb-3 leading-tight">
                  {scenarios[0]?.header || <span className="text-gray-400 font-normal italic">Scenario could not be generated</span>}
                </div>
                {Array.isArray(scenarios[0]?.bullets) && scenarios[0]?.bullets.length > 0 ? (
                  <ul className="space-y-2 text-gray-700 text-sm flex-1">
                    {scenarios[0].bullets.map((pt, i) => (
                      <li key={i} className="flex items-start space-x-2">
                        <div className="w-1.5 h-1.5 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                        <span className="leading-relaxed">{pt}</span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <div className="text-gray-500 text-sm italic">[Scenario could not be generated; please retry or adjust your axis selection.]</div>
                )}
              </div>
            </div>
            
            {/* Bottom Left - Index 2 */}
            <div className="group relative">
              <div className="absolute inset-0 bg-gradient-to-br from-orange-500/20 to-red-500/20 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <div className="relative bg-white/95 backdrop-blur-sm rounded-2xl border border-gray-200/80 shadow-2xl p-8 min-h-[200px] flex flex-col transform-gpu hover:scale-105 hover:shadow-3xl transition-all duration-300"
                   style={{ 
                     boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.15), 0 0 0 1px rgba(255, 255, 255, 0.5)',
                     transform: 'translateZ(0px)'
                   }}>
                {scenarios[2]?.summary && (
                  <div className="text-xs font-semibold text-orange-600 uppercase tracking-wider mb-2 bg-orange-50 px-2 py-1 rounded-lg inline-block">
                    {scenarios[2].summary}
                  </div>
                )}
                <div className="font-bold text-gray-900 text-base mb-3 leading-tight">
                  {scenarios[2]?.header || <span className="text-gray-400 font-normal italic">Scenario could not be generated</span>}
                </div>
                {Array.isArray(scenarios[2]?.bullets) && scenarios[2]?.bullets.length > 0 ? (
                  <ul className="space-y-2 text-gray-700 text-sm flex-1">
                    {scenarios[2].bullets.map((pt, i) => (
                      <li key={i} className="flex items-start space-x-2">
                        <div className="w-1.5 h-1.5 bg-orange-500 rounded-full mt-2 flex-shrink-0"></div>
                        <span className="leading-relaxed">{pt}</span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <div className="text-gray-500 text-sm italic">[Scenario could not be generated; please retry or adjust your axis selection.]</div>
                )}
              </div>
            </div>
            
            {/* Bottom Right - Index 3 */}
            <div className="group relative">
              <div className="absolute inset-0 bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <div className="relative bg-white/95 backdrop-blur-sm rounded-2xl border border-gray-200/80 shadow-2xl p-8 min-h-[200px] flex flex-col transform-gpu hover:scale-105 hover:shadow-3xl transition-all duration-300"
                   style={{ 
                     boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.15), 0 0 0 1px rgba(255, 255, 255, 0.5)',
                     transform: 'translateZ(0px)'
                   }}>
                {scenarios[3]?.summary && (
                  <div className="text-xs font-semibold text-purple-600 uppercase tracking-wider mb-2 bg-purple-50 px-2 py-1 rounded-lg inline-block">
                    {scenarios[3].summary}
                  </div>
                )}
                <div className="font-bold text-gray-900 text-base mb-3 leading-tight">
                  {scenarios[3]?.header || <span className="text-gray-400 font-normal italic">Scenario could not be generated</span>}
                </div>
                {Array.isArray(scenarios[3]?.bullets) && scenarios[3]?.bullets.length > 0 ? (
                  <ul className="space-y-2 text-gray-700 text-sm flex-1">
                    {scenarios[3].bullets.map((pt, i) => (
                      <li key={i} className="flex items-start space-x-2">
                        <div className="w-1.5 h-1.5 bg-purple-500 rounded-full mt-2 flex-shrink-0"></div>
                        <span className="leading-relaxed">{pt}</span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <div className="text-gray-500 text-sm italic">[Scenario could not be generated; please retry or adjust your axis selection.]</div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ScenarioMatrix;

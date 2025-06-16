
import { FC } from "react";
import type { MatrixScenario } from "./ScenarioMatrix";

interface ScenarioCardProps {
  scenario?: MatrixScenario;
  colorScheme: {
    primary: string;
    background: string;
    glow: string;
    dot: string;
  };
}

const ScenarioCard: FC<ScenarioCardProps> = ({ scenario, colorScheme }) => {
  return (
    <div className="group relative w-full h-full">
      <div className={`absolute inset-0 ${colorScheme.glow} rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500`}></div>
      <div className="relative bg-white/95 backdrop-blur-sm rounded-2xl border border-gray-200/80 shadow-2xl p-6 h-full hover:scale-105 hover:shadow-3xl transition-all duration-300">
        {scenario?.summary && (
          <div className={`text-xs font-semibold ${colorScheme.primary} uppercase tracking-wider mb-2 ${colorScheme.background} px-2 py-1 rounded-lg inline-block`}>
            {scenario.summary}
          </div>
        )}
        <div className="font-bold text-gray-900 text-sm mb-3 leading-tight">
          {scenario?.header || <span className="text-gray-400 font-normal italic">Scenario could not be generated</span>}
        </div>
        {Array.isArray(scenario?.bullets) && scenario?.bullets.length > 0 ? (
          <ul className="space-y-2 text-gray-700 text-xs">
            {scenario.bullets.map((pt, i) => (
              <li key={i} className="flex items-start space-x-2">
                <div className={`w-1 h-1 ${colorScheme.dot} rounded-full mt-1.5 flex-shrink-0`}></div>
                <span className="leading-relaxed">{pt}</span>
              </li>
            ))}
          </ul>
        ) : (
          <div className="text-gray-500 text-xs italic">[Scenario could not be generated; please retry or adjust your axis selection.]</div>
        )}
      </div>
    </div>
  );
};

export default ScenarioCard;

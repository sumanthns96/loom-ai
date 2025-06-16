
import { FC, useState } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Plus, Trash2 } from "lucide-react";

interface SteepCategorySectionProps {
  factor: string;
  style: { color: string; bg: string; icon: React.ReactNode };
  points: { text: string; isUserAdded?: boolean }[];
  selectedIndexes: number[];
  onSelect: (idx: number, checked: boolean) => void;
  onEdit: (idx: number, value: string) => void;
  onAddPoint?: (text: string) => void;
  onDeletePoint?: (idx: number) => void;
  canAddMore?: boolean;
  showCheckboxes?: boolean;
}

const SteepCategorySection: FC<SteepCategorySectionProps> = ({
  factor,
  style,
  points,
  selectedIndexes,
  onSelect,
  onEdit,
  onAddPoint,
  onDeletePoint,
  canAddMore = false,
  showCheckboxes = true,
}) => {
  const [newPointText, setNewPointText] = useState("");
  const [isAdding, setIsAdding] = useState(false);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  const handleAddNewPoint = () => {
    if (newPointText.trim() && onAddPoint) {
      onAddPoint(newPointText.trim());
      setNewPointText("");
      setIsAdding(false);
    }
  };

  const handleCancelAdd = () => {
    setNewPointText("");
    setIsAdding(false);
  };

  const handleDeletePoint = (idx: number) => {
    if (onDeletePoint) {
      onDeletePoint(idx);
    }
  };

  return (
    <div className={`rounded-2xl mb-8 shadow-xl border-0 ${style.bg} hover:shadow-2xl transition-all duration-500 transform hover:scale-[1.02] animate-slide-in-right`}>
      <div className="flex items-center justify-between px-8 pt-8 pb-4">
        <div className="flex items-center space-x-6">
          <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl flex flex-col items-center justify-center shadow-lg">
            <span className={`text-2xl font-bold tracking-tight ${style.color}`}>
              {factor[0]}
            </span>
            <div className="mt-1 opacity-80">{style.icon}</div>
          </div>
          <div className="space-y-1">
            <span className={`text-headline ${style.color} font-semibold tracking-tight`}>
              {factor}
            </span>
            <div className={`w-12 h-0.5 ${style.color.replace('text-', 'bg-')} opacity-60 rounded-full`}></div>
          </div>
        </div>
        
        {canAddMore && !isAdding && (
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsAdding(true)}
            className={`${style.color} border-current hover:bg-white/30 transition-all duration-300 rounded-xl px-4 py-2 font-medium backdrop-blur-sm`}
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Analysis
          </Button>
        )}
      </div>
      
      <div className="px-10 pb-8 space-y-6">
        {points.map((point, idx) => (
          <div 
            key={idx} 
            className="relative group transition-all duration-300"
            onMouseEnter={() => setHoveredIndex(idx)}
            onMouseLeave={() => setHoveredIndex(null)}
          >
            <div className="flex items-start gap-5">
              {showCheckboxes && (
                <Checkbox
                  checked={selectedIndexes.includes(idx)}
                  onCheckedChange={(checked) => onSelect(idx, !!checked)}
                  className="mt-4 flex-shrink-0 w-5 h-5 rounded-md border-2"
                  aria-label={`Select factor for ${factor} analysis, point ${idx + 1}`}
                />
              )}
              <div className="flex-1 relative">
                <Textarea
                  value={point.text}
                  onChange={(e) => onEdit(idx, e.target.value)}
                  className={`min-h-[100px] w-full text-body transition-all duration-300 rounded-xl border-2 ${
                    showCheckboxes 
                      ? "bg-white/70 border-white/50 resize-none cursor-default focus:ring-0 focus:border-white/60 backdrop-blur-sm" 
                      : "bg-white/90 border-white/60 hover:border-blue-300/60 hover:shadow-lg focus:border-blue-500 focus:ring-4 focus:ring-blue-100/50 focus:shadow-xl backdrop-blur-sm"
                  }`}
                  placeholder={showCheckboxes ? "" : `Edit ${factor.toLowerCase()} analysis point ${idx + 1}...`}
                  readOnly={showCheckboxes}
                />
                {!showCheckboxes && point.isUserAdded && onDeletePoint && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDeletePoint(idx)}
                    className={`absolute top-3 right-3 h-8 w-8 p-0 text-red-500 hover:text-red-700 hover:bg-red-50/80 transition-all duration-300 rounded-lg ${
                      hoveredIndex === idx ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
                    }`}
                    aria-label={`Delete analysis point ${idx + 1}`}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                )}
              </div>
            </div>
          </div>
        ))}
        
        {isAdding && (
          <div className="flex items-start gap-5 animate-fade-in-up">
            {!showCheckboxes && <div className="w-5 mt-4" />}
            <div className="flex-1 space-y-4">
              <Textarea
                value={newPointText}
                onChange={(e) => setNewPointText(e.target.value)}
                className="min-h-[100px] border-2 border-blue-300/60 bg-blue-50/80 focus:border-blue-500 focus:ring-4 focus:ring-blue-200/50 focus:bg-white/90 transition-all duration-300 rounded-xl backdrop-blur-sm text-body"
                placeholder={`Add your own ${factor.toLowerCase()} analysis...`}
                autoFocus
              />
              <div className="flex gap-3">
                <Button 
                  size="sm" 
                  onClick={handleAddNewPoint}
                  disabled={!newPointText.trim()}
                  className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-6 py-2 rounded-lg font-medium shadow-lg hover:shadow-xl transition-all duration-300"
                >
                  Add Point
                </Button>
                <Button 
                  size="sm" 
                  variant="outline" 
                  onClick={handleCancelAdd}
                  className="border-gray-300 hover:bg-gray-50/80 text-gray-700 px-6 py-2 rounded-lg font-medium transition-all duration-300"
                >
                  Cancel
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SteepCategorySection;

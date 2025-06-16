
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
    <div className={`rounded-lg mb-6 shadow-lg border-2 ${style.bg} hover:shadow-xl transition-shadow`}>
      <div className="flex items-center justify-between px-6 pt-6 pb-2">
        <div className="flex items-center">
          <div className="w-12 flex flex-col items-center mr-4">
            <span className={`text-4xl font-bold tracking-tight ${style.color}`}>
              {factor[0]}
            </span>
            <span className="mt-1">{style.icon}</span>
          </div>
          <span className={`uppercase font-semibold text-xl ${style.color}`}>
            {factor}
          </span>
        </div>
        
        {canAddMore && !isAdding && (
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsAdding(true)}
            className={`${style.color} border-current hover:bg-white/50 transition-all`}
          >
            <Plus className="h-4 w-4 mr-1" />
            Add Analysis
          </Button>
        )}
      </div>
      
      <div className="px-8 pb-6 space-y-4">
        {points.map((point, idx) => (
          <div 
            key={idx} 
            className="relative group"
            onMouseEnter={() => setHoveredIndex(idx)}
            onMouseLeave={() => setHoveredIndex(null)}
          >
            <div className="flex items-start gap-4">
              {showCheckboxes && (
                <Checkbox
                  checked={selectedIndexes.includes(idx)}
                  onCheckedChange={(checked) => onSelect(idx, !!checked)}
                  className="mt-3 flex-shrink-0"
                  aria-label={`Select factor for ${factor} analysis, point ${idx + 1}`}
                />
              )}
              <div className="flex-1 relative">
                <Textarea
                  value={point.text}
                  onChange={(e) => onEdit(idx, e.target.value)}
                  className={`min-h-[80px] w-full text-base transition-all ${
                    showCheckboxes 
                      ? "bg-gray-50 border-gray-200 resize-none cursor-default focus:ring-0 focus:border-gray-200" 
                      : "bg-white border-gray-200 hover:border-blue-300 hover:shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-100 focus:shadow-md"
                  }`}
                  placeholder={showCheckboxes ? "" : `Edit ${factor.toLowerCase()} analysis point ${idx + 1}...`}
                  readOnly={showCheckboxes}
                />
                {!showCheckboxes && point.isUserAdded && onDeletePoint && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDeletePoint(idx)}
                    className={`absolute top-2 right-2 h-8 w-8 p-0 text-red-500 hover:text-red-700 hover:bg-red-50 transition-all ${
                      hoveredIndex === idx ? 'opacity-100' : 'opacity-0'
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
          <div className="flex items-start gap-4">
            {!showCheckboxes && <div className="w-4 mt-3" />}
            <div className="flex-1">
              <Textarea
                value={newPointText}
                onChange={(e) => setNewPointText(e.target.value)}
                className="min-h-[80px] border-2 border-blue-300 bg-blue-50/50 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:bg-white transition-all"
                placeholder={`Add your own ${factor.toLowerCase()} analysis...`}
                autoFocus
              />
              <div className="flex gap-2 mt-3">
                <Button 
                  size="sm" 
                  onClick={handleAddNewPoint}
                  disabled={!newPointText.trim()}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  Add Point
                </Button>
                <Button 
                  size="sm" 
                  variant="outline" 
                  onClick={handleCancelAdd}
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


import { FC, useState } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

interface SteepCategorySectionProps {
  factor: string;
  style: { color: string; bg: string; icon: React.ReactNode };
  points: string[];
  selectedIndexes: number[];
  onSelect: (idx: number, checked: boolean) => void;
  onEdit: (idx: number, value: string) => void;
  onAddPoint?: (text: string) => void;
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
  canAddMore = false,
  showCheckboxes = true,
}) => {
  const [newPointText, setNewPointText] = useState("");
  const [isAdding, setIsAdding] = useState(false);

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
            className={`${style.color} border-current hover:bg-white/50`}
          >
            <Plus className="h-4 w-4 mr-1" />
            Add Analysis
          </Button>
        )}
      </div>
      
      <div className="px-8 pb-6">
        {points.map((point, idx) => (
          <div key={idx} className="flex items-start gap-4 mt-4">
            {showCheckboxes && (
              <Checkbox
                checked={selectedIndexes.includes(idx)}
                onCheckedChange={(checked) => onSelect(idx, !!checked)}
                className="mt-3"
                aria-label={`Select factor for ${factor} analysis, point ${idx + 1}`}
              />
            )}
            <Textarea
              value={point}
              onChange={(e) => onEdit(idx, e.target.value)}
              className={`min-h-[80px] flex-1 text-base ${
                showCheckboxes 
                  ? "border-gray-300 bg-gray-50 resize-none cursor-default" 
                  : "border-2 border-dashed border-gray-300 bg-white hover:border-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all"
              }`}
              placeholder={showCheckboxes ? "" : `Edit ${factor.toLowerCase()} analysis point ${idx + 1}...`}
              readOnly={showCheckboxes}
            />
          </div>
        ))}
        
        {isAdding && (
          <div className="flex items-start gap-4 mt-4">
            <div className="w-4 mt-3" /> {/* Spacer for alignment */}
            <div className="flex-1">
              <Textarea
                value={newPointText}
                onChange={(e) => setNewPointText(e.target.value)}
                className="min-h-[80px] border-2 border-blue-300 bg-blue-50 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all"
                placeholder={`Add your own ${factor.toLowerCase()} analysis...`}
                autoFocus
              />
              <div className="flex gap-2 mt-2">
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

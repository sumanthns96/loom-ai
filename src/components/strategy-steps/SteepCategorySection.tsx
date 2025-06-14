
import { FC } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";

interface SteepCategorySectionProps {
  factor: string;
  style: { color: string; bg: string; icon: React.ReactNode };
  points: string[];
  selectedIndexes: number[];
  onSelect: (idx: number, checked: boolean) => void;
  onEdit: (idx: number, value: string) => void;
}

// Render a box for each STEEP category with three editable points and checkboxes.
const SteepCategorySection: FC<SteepCategorySectionProps> = ({
  factor,
  style,
  points,
  selectedIndexes,
  onSelect,
  onEdit,
}) => {
  return (
    <div className={`rounded-lg mb-6 shadow border ${style.bg}`}>
      <div className="flex items-center px-5 pt-5 pb-1">
        <div className="w-10 flex flex-col items-center mr-3">
          <span className={`text-3xl font-bold tracking-tight ${style.color}`}>{factor[0]}</span>
          <span className="mt-1">{style.icon}</span>
        </div>
        <span className={`uppercase font-semibold text-lg ${style.color}`}>{factor}</span>
      </div>
      <div className="px-7 pb-5">
        {points.map((point, idx) => (
          <div key={idx} className="flex items-start gap-3 mt-4">
            <Checkbox
              checked={selectedIndexes.includes(idx)}
              onCheckedChange={(checked) => onSelect(idx, !!checked)}
              className="mt-2"
              aria-label={`Select factor for ${factor} analysis, point ${idx + 1}`}
            />
            <Textarea
              value={point}
              onChange={(e) => onEdit(idx, e.target.value)}
              className="min-h-[60px] flex-1 border-none bg-transparent focus-visible:ring-2 focus-visible:ring-blue-300 text-base"
              placeholder={`Edit analysis point ${idx + 1}...`}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default SteepCategorySection;



import { useState, useEffect } from "react";
import { SteepFactorGroup, SelectedPoint } from "../types";

export const useSteepData = (data: string, onDataChange: (data: string) => void) => {
  const [factors, setFactors] = useState<SteepFactorGroup[]>([]);
  const [hasGenerated, setHasGenerated] = useState(false);

  // Parse JSON model for 3 points per factor + user additions
  useEffect(() => {
    try {
      if (data) {
        const parsed: SteepFactorGroup[] = JSON.parse(data);
        if (Array.isArray(parsed) && parsed[0]?.points) {
          setFactors(parsed);
          setHasGenerated(true);
          return;
        }
      }
      setFactors([]);
      setHasGenerated(false);
    } catch {
      setFactors([]);
      setHasGenerated(false);
    }
  }, [data]);

  const handleSelect = (factorIdx: number, pointIdx: number, checked: boolean) => {
    setFactors((prev) => {
      const next = prev.map((f, i) =>
        i === factorIdx
          ? {
              ...f,
              selected: checked
                ? Array.from(new Set([...f.selected, pointIdx]))
                : f.selected.filter((j) => j !== pointIdx),
            }
          : f
      );
      onDataChange(JSON.stringify(next));
      return next;
    });
  };

  const handleEdit = (factorIdx: number, pointIdx: number, value: string) => {
    setFactors((prev) => {
      const next = prev.map((f, i) =>
        i === factorIdx
          ? {
              ...f,
              points: f.points.map((p, j) =>
                j === pointIdx ? { ...p, text: value } : p
              ),
            }
          : f
      );
      onDataChange(JSON.stringify(next));
      return next;
    });
  };

  const handleAddPoint = (factorIdx: number, text: string) => {
    setFactors((prev) => {
      const next = prev.map((f, i) =>
        i === factorIdx && f.points.length < 5 // Max 5 points (3 generated + 2 user)
          ? {
              ...f,
              points: [...f.points, { text, isUserAdded: true }],
            }
          : f
      );
      onDataChange(JSON.stringify(next));
      return next;
    });
  };

  const handleDeletePoint = (factorIdx: number, pointIdx: number) => {
    setFactors((prev) => {
      const next = prev.map((f, i) =>
        i === factorIdx
          ? {
              ...f,
              points: f.points.filter((_, j) => j !== pointIdx),
              selected: f.selected
                .filter(idx => idx !== pointIdx)
                .map(idx => idx > pointIdx ? idx - 1 : idx)
            }
          : f
      );
      onDataChange(JSON.stringify(next));
      return next;
    });
  };

  // Helper to extract selected points for next step
  const getSelectedPoints = (): SelectedPoint[] => {
    return factors.flatMap((group) =>
      group.selected.map(i => ({
        factor: group.factor,
        pointIdx: i,
        text: group.points[i]?.text || ""
      }))
    );
  };

  const updateFactors = (newFactors: SteepFactorGroup[]) => {
    setFactors(newFactors);
    setHasGenerated(true);
    onDataChange(JSON.stringify(newFactors));
  };

  return {
    factors,
    hasGenerated,
    handleSelect,
    handleEdit,
    handleAddPoint,
    handleDeletePoint,
    getSelectedPoints,
    updateFactors,
  };
};

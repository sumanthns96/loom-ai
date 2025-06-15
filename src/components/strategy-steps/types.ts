export type SteepAnalysisPoint = {
  text: string;
  isUserAdded?: boolean;
};

export type SteepFactorGroup = {
  factor: string;
  points: SteepAnalysisPoint[];
  selected: number[]; // indexes of selected points
};

export type SelectedPoint = {
  factor: string;        // e.g. "Social"
  pointIdx: number;      // index in .points array (0,1,2)
  text: string;          // actual analysis point text
};

export interface StepOneProps {
  pdfContent: string;
  data: string; // Will be JSON string of SteepFactorGroup[]
  onDataChange: (data: string) => void;
  onNext: (selectedPoints: SelectedPoint[]) => void;
}

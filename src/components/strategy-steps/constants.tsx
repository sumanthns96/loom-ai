
import { Users, Lightbulb, BarChart2, Recycle, Landmark } from "lucide-react";

// Map factor name to color and icon for display, as per the reference image
export const FACTOR_STYLES: Record<
  string,
  { color: string; bg: string; icon: React.ReactNode }
> = {
  Social: {
    color: "text-red-600",
    bg: "bg-red-100",
    icon: <Users className="w-6 h-6 text-red-500" />,
  },
  Technological: {
    color: "text-yellow-700",
    bg: "bg-yellow-100",
    icon: <Lightbulb className="w-6 h-6 text-yellow-400" />,
  },
  Economic: {
    color: "text-yellow-900",
    bg: "bg-yellow-200",
    icon: <BarChart2 className="w-6 h-6 text-yellow-500" />,
  },
  Environmental: {
    color: "text-green-700",
    bg: "bg-green-100",
    icon: <Recycle className="w-6 h-6 text-green-500" />,
  },
  Political: {
    color: "text-cyan-700",
    bg: "bg-cyan-100",
    icon: <Landmark className="w-6 h-6 text-cyan-500" />,
  },
};

export const FACTOR_ORDER = [
  "Social",
  "Technological",
  "Economic",
  "Environmental",
  "Political",
];

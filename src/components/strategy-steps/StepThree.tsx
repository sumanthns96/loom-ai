
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import type { SelectedPoint } from "./types";
import CompetitorMatrix from "./CompetitorMatrix";

interface CompetitorData {
  type: "Incumbent" | "Insurgent" | "Adjacent";
  name: string;
  action: string;
  logoUrl?: string;
}

interface QuadrantCompetitors {
  competitors: CompetitorData[];
}

interface StepThreeProps {
  pdfContent: string;
  data: string;
  onDataChange: (data: string) => void;
}

const StepThree = ({ pdfContent, data, onDataChange }: StepThreeProps) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [quadrantCompetitors, setQuadrantCompetitors] = useState<QuadrantCompetitors[]>([]);
  const [axes, setAxes] = useState<SelectedPoint[]>([]);
  const [axisContexts, setAxisContexts] = useState<{ low: string; high: string }[]>([]);

  // Helper to get company name from case study
  const getCompanyName = () => {
    const lines = pdfContent.split("\n").map(line => line.trim()).filter(Boolean);
    // Try to extract company name from title or first few lines
    for (const line of lines.slice(0, 5)) {
      const companyMatch = line.match(/(?:Company|Corporation|Inc|Ltd|Corp|LLC):\s*([^,\n]+)/i);
      if (companyMatch) return companyMatch[1].trim();
    }
    return "the organization"; // fallback
  };

  // Helper to get logo URL using Clearbit API
  const getCompanyLogo = (companyName: string): string => {
    // Clean company name for domain guess
    const cleanName = companyName.toLowerCase()
      .replace(/\s+(inc|corp|ltd|llc|corporation|company)\.?$/i, '')
      .replace(/[^a-z0-9]/g, '');
    
    // Try Clearbit Logo API
    return `https://logo.clearbit.com/${cleanName}.com`;
  };

  // Helper to get company initials as fallback
  const getCompanyInitials = (companyName: string): string => {
    return companyName
      .split(/\s+/)
      .map(word => word.charAt(0).toUpperCase())
      .slice(0, 2)
      .join('');
  };

  const generateCompetitorAnalysis = async () => {
    setIsGenerating(true);
    
    try {
      // Get Step 2 data to inherit axes and context
      const step2Data = localStorage.getItem('step2Data');
      if (!step2Data) {
        toast({
          title: "Missing Step 2 Data",
          description: "Please complete Step 2 scenario matrix first.",
          variant: "destructive"
        });
        setIsGenerating(false);
        return;
      }

      const step2Info = JSON.parse(step2Data);
      setAxes(step2Info.axes || []);
      setAxisContexts(step2Info.axisContexts || []);

      const companyName = getCompanyName();
      
      // STEP 1: Identify competitors in each category
      toast({ title: "Identifying competitors...", description: "Finding Incumbents, Insurgents, and Adjacents" });
      
      const competitorPrompt = `
Based on this case study, identify the main competitors for ${companyName} in 3 categories:

1. INCUMBENTS: 3 established, dominant players in the same industry/market
2. INSURGENTS: 3 newer, disruptive companies challenging the status quo  
3. ADJACENTS: 3 companies from related industries that could enter this market

For each competitor, provide just the company name (no descriptions).

Case Study:
---
${pdfContent}
---

Respond in this exact JSON format:
{
  "incumbents": ["Company1", "Company2", "Company3"],
  "insurgents": ["Company1", "Company2", "Company3"], 
  "adjacents": ["Company1", "Company2", "Company3"]
}`;

      const { data: competitorResponse, error: competitorError } = await supabase.functions.invoke(
        "generate-scenario-matrix",
        { body: { prompt: competitorPrompt } }
      );

      if (competitorError) {
        throw new Error(competitorError.message);
      }

      // Parse competitor response
      let competitors: any = {};
      try {
        const rawData = competitorResponse?.raw || competitorResponse;
        const cleanedData = typeof rawData === "string" 
          ? rawData.replace(/^\s*```json\s*|\s*```\s*$/gi, "").trim()
          : JSON.stringify(rawData);
        competitors = JSON.parse(cleanedData);
      } catch {
        throw new Error("Could not parse competitor identification response");
      }

      if (!competitors.incumbents || !competitors.insurgents || !competitors.adjacents) {
        throw new Error("Incomplete competitor data received");
      }

      // STEP 2: Analyze moves for each quadrant
      toast({ title: "Analyzing competitor moves...", description: "Determining likely actions in each scenario quadrant" });
      
      const [yAxis, xAxis] = step2Info.axes || [];
      const [yContext, xContext] = step2Info.axisContexts || [];
      
      const quadrants = [
        { name: "High Y, High X", yLevel: "high", xLevel: "high" },
        { name: "High Y, Low X", yLevel: "high", xLevel: "low" },
        { name: "Low Y, Low X", yLevel: "low", xLevel: "low" },
        { name: "Low Y, High X", yLevel: "low", xLevel: "high" }
      ];

      const allQuadrantCompetitors: QuadrantCompetitors[] = [];

      for (const quadrant of quadrants) {
        const quadrantPrompt = `
Given this scenario quadrant where ${yAxis?.factor} is ${quadrant.yLevel} (${quadrant.yLevel === 'high' ? yContext?.high : yContext?.low}) and ${xAxis?.factor} is ${quadrant.xLevel} (${quadrant.xLevel === 'high' ? xContext?.high : xContext?.low}):

For each of these competitors, predict their most likely strategic move in this quadrant (max 15 words):

INCUMBENTS: ${competitors.incumbents.join(', ')}
INSURGENTS: ${competitors.insurgents.join(', ')}
ADJACENTS: ${competitors.adjacents.join(', ')}

Case Context: ${companyName}

Respond in this exact JSON format:
{
  "incumbents": [
    {"name": "Company1", "action": "Strategic move in 15 words or less"},
    {"name": "Company2", "action": "Strategic move in 15 words or less"},
    {"name": "Company3", "action": "Strategic move in 15 words or less"}
  ],
  "insurgents": [
    {"name": "Company1", "action": "Strategic move in 15 words or less"},
    {"name": "Company2", "action": "Strategic move in 15 words or less"},
    {"name": "Company3", "action": "Strategic move in 15 words or less"}
  ],
  "adjacents": [
    {"name": "Company1", "action": "Strategic move in 15 words or less"},
    {"name": "Company2", "action": "Strategic move in 15 words or less"},
    {"name": "Company3", "action": "Strategic move in 15 words or less"}
  ]
}`;

        const { data: movesResponse } = await supabase.functions.invoke(
          "generate-scenario-matrix",
          { body: { prompt: quadrantPrompt } }
        );

        // Parse moves response
        let moves: any = {};
        try {
          const rawData = movesResponse?.raw || movesResponse;
          const cleanedData = typeof rawData === "string" 
            ? rawData.replace(/^\s*```json\s*|\s*```\s*$/gi, "").trim()
            : JSON.stringify(rawData);
          moves = JSON.parse(cleanedData);
        } catch {
          // Create fallback data if parsing fails
          moves = {
            incumbents: competitors.incumbents.map((name: string) => ({ name, action: "Maintain market position" })),
            insurgents: competitors.insurgents.map((name: string) => ({ name, action: "Disrupt traditional models" })),
            adjacents: competitors.adjacents.map((name: string) => ({ name, action: "Consider market entry" }))
          };
        }

        // Format competitor data with logos
        const quadrantData: CompetitorData[] = [];
        
        ['incumbents', 'insurgents', 'adjacents'].forEach(type => {
          const typeData = moves[type] || [];
          typeData.forEach((comp: any) => {
            quadrantData.push({
              type: type === 'incumbents' ? 'Incumbent' : type === 'insurgents' ? 'Insurgent' : 'Adjacent',
              name: comp.name,
              action: comp.action,
              logoUrl: getCompanyLogo(comp.name)
            });
          });
        });

        allQuadrantCompetitors.push({ competitors: quadrantData });
      }

      setQuadrantCompetitors(allQuadrantCompetitors);
      onDataChange(JSON.stringify({
        competitors: allQuadrantCompetitors,
        axes: step2Info.axes,
        axisContexts: step2Info.axisContexts
      }));

      toast({
        title: "Competitor Analysis Complete",
        description: "Identified and analyzed competitor moves across all scenario quadrants."
      });

    } catch (error: any) {
      console.error("Competitor analysis error:", error);
      toast({
        title: "Analysis Error",
        description: error.message || "Failed to generate competitor analysis",
        variant: "destructive"
      });
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle>
            Competitor Analysis: Strategic Quadrant Positioning
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-600 mb-6">
            Analyze how Incumbents, Insurgents, and Adjacent competitors will likely behave in each scenario quadrant.
          </p>
          
          <div className="flex justify-center mb-8">
            <Button
              onClick={generateCompetitorAnalysis}
              disabled={isGenerating}
              className="bg-purple-600 hover:bg-purple-700"
            >
              {isGenerating ? "Analyzing Competitors..." : "Generate Competitor Analysis"}
            </Button>
          </div>

          {quadrantCompetitors.length > 0 && (
            <CompetitorMatrix 
              quadrantCompetitors={quadrantCompetitors}
              axes={axes}
              axisContexts={axisContexts}
              getCompanyInitials={getCompanyInitials}
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default StepThree;

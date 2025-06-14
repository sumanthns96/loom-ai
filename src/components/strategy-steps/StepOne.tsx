
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { RefreshCw, Lightbulb } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface SteepEntry {
  factor: string;
  analysis: string;
}

interface StepOneProps {
  pdfContent: string;
  data: string; // This will be a JSON string of SteepEntry[]
  onDataChange: (data: string) => void;
}

const StepOne = ({ pdfContent, data, onDataChange }: StepOneProps) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [analysis, setAnalysis] = useState<SteepEntry[]>([]);

  useEffect(() => {
    try {
      if (data) {
        const parsedData = JSON.parse(data);
        setAnalysis(parsedData);
      } else {
        setAnalysis([]);
      }
    } catch (error) {
      console.error("Failed to parse initial data:", error);
      setAnalysis([]);
    }
  }, [data]);

  const generateAnalysis = async () => {
    setIsGenerating(true);

    const { data: responseData, error } = await supabase.functions.invoke('generate-steep-analysis', {
      body: { pdfContent },
    });

    setIsGenerating(false);

    if (error) {
      toast({
        title: "Error generating analysis",
        description: error.message,
        variant: "destructive",
      });
      return;
    }
    
    const newAnalysis = responseData.steepAnalysis;
    setAnalysis(newAnalysis);
    onDataChange(JSON.stringify(newAnalysis));

    toast({
      title: "Analysis generated",
      description: "AI has completed the STEEP analysis based on your case study.",
    });
  };
  
  const handleAnalysisChange = (value: string, index: number) => {
    const newAnalysis = [...analysis];
    newAnalysis[index].analysis = value;
    setAnalysis(newAnalysis);
    onDataChange(JSON.stringify(newAnalysis));
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Lightbulb className="h-5 w-5 text-yellow-600" />
            <span>Analyze STEEP Factors</span>
          </CardTitle>
          <CardDescription>
            Use AI to generate a STEEP analysis from your case study. This table outlines the Social, Technological, Economic, Environmental, and Political factors impacting your strategy.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-medium">STEEP Analysis</h3>
            <Button
              onClick={generateAnalysis}
              disabled={isGenerating || !pdfContent}
              variant="outline"
            >
              {isGenerating ? (
                <>
                  <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Generate with AI
                </>
              )}
            </Button>
          </div>
          
          <Card className="overflow-hidden border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[150px] bg-muted/50 font-semibold">Factor</TableHead>
                  <TableHead className="font-semibold">Analysis</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isGenerating && (
                  <TableRow>
                    <TableCell colSpan={2} className="h-36 text-center">
                      <div className="flex justify-center items-center space-x-2 text-muted-foreground">
                        <RefreshCw className="h-5 w-5 animate-spin" />
                        <span>Generating analysis with Gemini...</span>
                      </div>
                    </TableCell>
                  </TableRow>
                )}
                {!isGenerating && analysis.length === 0 && (
                   <TableRow>
                    <TableCell colSpan={2} className="h-36 text-center text-muted-foreground">
                      Click "Generate with AI" to create a STEEP analysis from your document.
                    </TableCell>
                  </TableRow>
                )}
                {!isGenerating && analysis.map((item, index) => (
                  <TableRow key={item.factor}>
                    <TableCell className="font-medium align-top bg-muted/50 pt-4">{item.factor}</TableCell>
                    <TableCell>
                      <Textarea
                        value={item.analysis}
                        onChange={(e) => handleAnalysisChange(e.target.value, index)}
                        className="w-full border-none focus-visible:ring-0 focus-visible:ring-offset-0 p-2 min-h-[100px] bg-transparent resize-none"
                        placeholder="Analysis goes here..."
                      />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Card>
        </CardContent>
      </Card>
    </div>
  );
};

export default StepOne;

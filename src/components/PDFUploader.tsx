
import { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Upload, FileText } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import * as pdfjsLib from "pdfjs-dist";
import pdfjsWorker from "pdfjs-dist/build/pdf.worker.mjs?url";

// Set up PDF.js worker
pdfjsLib.GlobalWorkerOptions.workerSrc = pdfjsWorker;

interface PDFUploaderProps {
  onTextExtracted: (text: string) => void;
}

const PDFUploader = ({ onTextExtracted }: PDFUploaderProps) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);

  const extractTextFromPDF = async (file: File): Promise<string> => {
    const arrayBuffer = await file.arrayBuffer();
    const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
    let fullText = "";

    for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
      setProgress((pageNum / pdf.numPages) * 100);
      const page = await pdf.getPage(pageNum);
      const textContent = await page.getTextContent();
      const pageText = textContent.items
        .map((item: any) => item.str)
        .join(" ");
      fullText += pageText + "\n";
    }

    return fullText;
  };

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (!file) return;

    if (file.type !== "application/pdf") {
      toast({
        title: "Invalid file type",
        description: "Please upload a PDF file.",
        variant: "destructive",
      });
      return;
    }

    setUploadedFile(file);
    setIsProcessing(true);
    setProgress(0);

    try {
      const extractedText = await extractTextFromPDF(file);
      
      if (extractedText.trim().length < 100) {
        toast({
          title: "Insufficient content",
          description: "The PDF doesn't contain enough text for analysis.",
          variant: "destructive",
        });
        return;
      }

      toast({
        title: "PDF processed successfully",
        description: "Your case study has been analyzed and is ready for strategic planning.",
      });

      onTextExtracted(extractedText);
    } catch (error) {
      console.error("Error processing PDF:", error);
      toast({
        title: "Processing failed",
        description: "Failed to extract text from the PDF. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
      setProgress(0);
    }
  }, [onTextExtracted]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "application/pdf": [".pdf"],
    },
    maxFiles: 1,
    disabled: isProcessing,
  });

  return (
    <div className="w-full">
      {!isProcessing ? (
        <div
          {...getRootProps()}
          className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors
            ${isDragActive 
              ? "border-blue-500 bg-blue-50" 
              : "border-gray-300 hover:border-blue-400 hover:bg-gray-50"
            }`}
        >
          <input {...getInputProps()} />
          <Upload className="mx-auto h-12 w-12 text-gray-400 mb-4" />
          
          {isDragActive ? (
            <p className="text-lg text-blue-600 font-medium">Drop your PDF case study here</p>
          ) : (
            <div>
              <p className="text-lg text-gray-700 font-medium mb-2">
                Drag & drop your PDF case study here
              </p>
              <p className="text-gray-500 mb-4">or click to browse files</p>
              <Button variant="outline" className="mx-auto">
                <FileText className="mr-2 h-4 w-4" />
                Choose PDF File
              </Button>
            </div>
          )}
        </div>
      ) : (
        <div className="text-center py-8">
          <div className="animate-spin mx-auto h-8 w-8 border-4 border-blue-600 border-t-transparent rounded-full mb-4"></div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Processing your case study...
          </h3>
          <p className="text-gray-600 mb-4">
            Extracting text and analyzing content with AI
          </p>
          <Progress value={progress} className="w-full max-w-xs mx-auto" />
          <p className="text-sm text-gray-500 mt-2">{Math.round(progress)}% complete</p>
        </div>
      )}

      {uploadedFile && !isProcessing && (
        <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg">
          <div className="flex items-center">
            <FileText className="h-5 w-5 text-green-600 mr-2" />
            <span className="text-green-800 font-medium">{uploadedFile.name}</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default PDFUploader;

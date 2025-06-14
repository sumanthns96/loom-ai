
import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import StrategyWizard from "@/components/StrategyWizard";

const StrategyPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const pdfContent = location.state?.pdfContent ?? null;

  useEffect(() => {
    if (!pdfContent) {
      // Redirect to home if the page is accessed directly without PDF content
      navigate('/');
    }
  }, [pdfContent, navigate]);

  const handleReset = () => {
    navigate('/');
  };
  
  if (!pdfContent) {
    return null; // Render nothing while redirecting
  }

  return <StrategyWizard pdfContent={pdfContent} onReset={handleReset} />;
};

export default StrategyPage;

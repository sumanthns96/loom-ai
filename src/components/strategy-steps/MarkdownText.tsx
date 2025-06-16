
import React from 'react';

interface MarkdownTextProps {
  text: string;
  className?: string;
}

const MarkdownText = ({ text, className = "" }: MarkdownTextProps) => {
  // Return null if text is empty, undefined, or just whitespace
  if (!text || !text.trim()) return null;

  // Convert markdown to HTML
  const formatText = (input: string): string => {
    return input
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') // **bold**
      .replace(/\*(.*?)\*/g, '<em>$1</em>')             // *italic*
      .replace(/\n/g, '<br />');                         // line breaks
  };

  const formattedText = formatText(text.trim());

  // Don't render if the formatted text is empty after processing
  if (!formattedText) return null;

  return (
    <div 
      className={className}
      dangerouslySetInnerHTML={{ __html: formattedText }}
    />
  );
};

export default MarkdownText;

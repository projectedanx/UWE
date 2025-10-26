
import React, { useState } from 'react';
import { GoogleGenAI } from '@google/genai';
import Loader from './Loader';
import { SparklesIcon } from './Icons';

interface GeminiPanelAnalysisProps {
  data: any;
  promptTemplate: (data: string) => string;
  buttonText: string;
  rootWord: string;
}

const GeminiPanelAnalysis: React.FC<GeminiPanelAnalysisProps> = ({ data, promptTemplate, buttonText, rootWord }) => {
  const [analysis, setAnalysis] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleAnalysis = async () => {
    if (!data || (Array.isArray(data) && data.length === 0)) return;

    setIsLoading(true);
    setError(null);
    setAnalysis(null);

    try {
      const formattedData = Array.isArray(data) ? data.map(item => item.word || item).join('\n') : String(data);
      const prompt = promptTemplate(formattedData);
      
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });
      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
      });
      
      setAnalysis(response.text);
    } catch (err) {
      console.error("Gemini Panel Analysis Error:", err);
      setError("Failed to generate analysis.");
    } finally {
      setIsLoading(false);
    }
  };
  
  const hasData = data && ( (Array.isArray(data) && data.length > 0) || (typeof data === 'string' && data.length > 0) );

  return (
    <div className="mt-4 border-t border-slate-700 pt-4">
      <button 
        onClick={handleAnalysis} 
        disabled={isLoading || !hasData}
        className="flex items-center justify-center gap-2 text-sm bg-cyan-800/50 hover:bg-cyan-700/50 text-cyan-200 font-semibold py-2 px-3 rounded-md transition duration-300 disabled:bg-slate-600 disabled:text-slate-400 disabled:cursor-not-allowed"
      >
        {isLoading ? <Loader /> : <SparklesIcon className="w-4 h-4" />}
        {buttonText}
      </button>

      {error && <p className="mt-3 text-red-400 text-xs">{error}</p>}
      
      {analysis && (
        <div className="mt-3 p-3 bg-slate-900/50 rounded-md border border-slate-700">
          <p className="text-slate-300 whitespace-pre-wrap text-sm">{analysis}</p>
        </div>
      )}
    </div>
  );
};

export default GeminiPanelAnalysis;

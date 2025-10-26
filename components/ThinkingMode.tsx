import React, { useState } from 'react';
import { GoogleGenAI } from '@google/genai';
import Loader from './Loader';
import Panel from './Panel';
import { BrainCircuitIcon } from './Icons';

/**
 * A component for handling complex queries using the Google Gemini API's "thinking mode".
 * This mode uses a more powerful model with an extended thinking budget for deeper responses.
 * @returns {JSX.Element} The rendered thinking mode component.
 */
const ThinkingMode: React.FC = () => {
  const [prompt, setPrompt] = useState('');
  const [response, setResponse] = useState<string | null>(null);
  const [isThinking, setIsThinking] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGenerate = async () => {
    if (!prompt.trim() || isThinking) return;

    setIsThinking(true);
    setError(null);
    setResponse(null);

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });
      const result = await ai.models.generateContent({
        model: 'gemini-2.5-pro',
        contents: prompt,
        config: {
          thinkingConfig: { thinkingBudget: 32768 },
        },
      });
      setResponse(result.text);

    } catch (err) {
      console.error("Gemini Thinking Mode Error:", err);
      setError("An error occurred while processing the complex query. Please try again.");
    } finally {
      setIsThinking(false);
    }
  };

  return (
    <Panel title="🧠 Thinking Mode" defaultOpen icon={<BrainCircuitIcon />}>
      <p className="text-slate-400 mb-4 text-sm">
        For your most complex queries. This mode uses a more powerful model with an extended thinking budget to provide deeper, more reasoned responses.
      </p>
      <textarea
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
        placeholder="Enter a complex prompt, e.g., 'Write a Python script to analyze sentiment in a CSV file and visualize the results'..."
        className="w-full h-32 bg-slate-800 border border-slate-600 rounded-md px-3 py-2 focus:ring-2 focus:ring-purple-500 focus:outline-none transition mb-4"
        disabled={isThinking}
      />
      <button
        onClick={handleGenerate}
        disabled={isThinking || !prompt.trim()}
        className="w-full bg-purple-600 hover:bg-purple-500 text-white font-bold py-3 px-4 rounded-md transition duration-300 disabled:bg-slate-500 disabled:cursor-not-allowed flex items-center justify-center"
      >
        {isThinking ? (
            <>
              <Loader />
              <span>Thinking...</span>
            </>
          ) : 'Generate with Thinking'}
      </button>

      {error && <p className="mt-4 text-red-400">{error}</p>}
      
      {response && (
        <div className="mt-6">
          <h3 className="text-lg font-bold mb-2 text-purple-300">Response:</h3>
          <div className="bg-slate-900/50 p-4 rounded-md border border-slate-700">
            <pre className="text-slate-200 whitespace-pre-wrap font-sans">{response}</pre>
          </div>
        </div>
      )}
    </Panel>
  );
};

export default ThinkingMode;
